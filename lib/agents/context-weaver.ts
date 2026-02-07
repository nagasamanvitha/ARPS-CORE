import { ThinkingLevel } from "@google/genai";
import { getGemini, MODELS } from "@/lib/gemini";
import type { CausalRiskResult } from "@/lib/types";

const CAUSAL_SCHEMA = {
  type: "object",
  properties: {
    primaryDriver: { type: "string", description: "Single primary cause of renewal risk" },
    secondaryDrivers: {
      type: "array",
      items: { type: "string" },
      description: "Contributing factors",
    },
    plainEnglishSummary: { type: "string", description: "2-3 sentence causal explanation" },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    conflictDetected: { type: "boolean", description: "True when internal conflict exists (e.g. Sales vs Compliance vs Engineering, legal threat + burnout + security)" },
    conflictDescription: { type: "string", description: "One line describing the conflict, e.g. 'Sales vs Compliance (security bypass vs SOC2). Engineering capacity vs CFO revenue target.'" },
  },
  required: ["primaryDriver", "secondaryDrivers", "plainEnglishSummary", "confidence"],
};

export interface ContextWeaverInput {
  crmSnapshot: string;
  supportConversation: string;
  slackOrEmailConversation: string;
  arr: number;
  renewalDate: string;
}

export async function runContextWeaver(input: ContextWeaverInput): Promise<CausalRiskResult> {
  const prompt = `You are the Context Weaver: a causal reasoning agent for revenue protection.

Your ONLY job: read all inputs together and build a CAUSAL explanation of why this account is at renewal risk. Do NOT predict churn scores. Explain WHY — primary cause and contributing factors.

INPUTS:
- CRM account snapshot:
${input.crmSnapshot}

- Support ticket / conversation:
${input.supportConversation}

- Slack or email thread:
${input.slackOrEmailConversation}

- Account ARR: $${input.arr}
- Renewal date: ${input.renewalDate}

TASK:
1. Fuse these signals (like a 1M-context multimodal reasoner).
2. Identify the PRIMARY risk driver (the main cause).
3. List SECONDARY contributors.
4. Write a plain-English summary (2-3 sentences) that a CRO can read.
5. Set confidence: high if evidence is clear, medium if inferred, low if speculative.
6. If you detect INTERNAL CONFLICT (e.g. Sales pushing for fast fix vs Compliance blocking security bypass vs CTO protecting engineer burnout, or legal threat MSA Section 9 + engineer at capacity), set conflictDetected: true and set conflictDescription to one line (e.g. "Internal conflict: Sales vs Compliance (security bypass vs SOC2). Engineering capacity (Mike at 48 hrs) vs CFO revenue target.").

Output valid JSON matching the schema. No markdown, no extra text.`;

  const ai = getGemini();
  const response = await ai.models.generateContent({
    model: MODELS.CONTEXT_WEAVER,
    contents: prompt,
    config: {
      temperature: 0.2,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
      responseSchema: CAUSAL_SCHEMA,
      thinkingConfig: {
        includeThoughts: true,
        thinkingLevel: ThinkingLevel.HIGH,
      },
    },
  });

  let thoughtSummary = "";
  let text = "";
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if ("text" in part && part.text) {
      if ("thought" in part && part.thought) {
        thoughtSummary += part.text;
      } else {
        text += part.text;
      }
    }
  }

  let causal: CausalRiskResult;
  try {
    const parsed = JSON.parse(text || "{}") as Record<string, unknown>;
    causal = {
      primaryDriver: typeof parsed.primaryDriver === "string" ? parsed.primaryDriver : "Unable to parse.",
      secondaryDrivers: Array.isArray(parsed.secondaryDrivers) ? parsed.secondaryDrivers.filter((s): s is string => typeof s === "string") : [],
      plainEnglishSummary: typeof parsed.plainEnglishSummary === "string" ? parsed.plainEnglishSummary : text || "No summary.",
      confidence: ["high", "medium", "low"].includes(parsed.confidence as string) ? (parsed.confidence as "high" | "medium" | "low") : "low",
      conflictDetected: typeof parsed.conflictDetected === "boolean" ? parsed.conflictDetected : undefined,
      conflictDescription: typeof parsed.conflictDescription === "string" ? parsed.conflictDescription : undefined,
    };
  } catch {
    causal = {
      primaryDriver: "Unable to parse model output.",
      secondaryDrivers: [],
      plainEnglishSummary: text || "No summary.",
      confidence: "low",
    };
  }
  causal.thoughtSummary = thoughtSummary || undefined;
  return causal;
}
