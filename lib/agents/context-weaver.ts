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
        thinkingLevel: "high",
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
    causal = JSON.parse(text || "{}") as CausalRiskResult;
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
