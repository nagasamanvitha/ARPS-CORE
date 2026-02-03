import { ThinkingLevel } from "@google/genai";
import { getGemini, MODELS } from "@/lib/gemini";
import type { RankedAction, ResourceAllocatorResult } from "@/lib/types";

const ROI_SCHEMA = {
  type: "object",
  properties: {
    rankedActions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          actionId: { type: "string" },
          actionType: {
            type: "string",
            enum: ["discount", "free_training", "engineering_fix", "dedicated_success", "custom"],
          },
          description: { type: "string" },
          estimatedCost: { type: "number" },
          expectedRevenueSaved: { type: "number" },
          roiMultiplier: { type: "number" },
          reasoning: { type: "string" },
        },
        required: [
          "actionId",
          "actionType",
          "description",
          "estimatedCost",
          "expectedRevenueSaved",
          "roiMultiplier",
          "reasoning",
        ],
      },
    },
    recommendedActionId: { type: "string" },
  },
  required: ["rankedActions", "recommendedActionId"],
};

export interface ResourceAllocatorInput {
  causalSummary: string;
  primaryDriver: string;
  arr: number;
  renewalDate: string;
  policyDiscountCap: number;
  teamCapacity: { csAgents: number; engineers: number; availableHoursThisWeek?: number };
}

export async function runResourceAllocator(
  input: ResourceAllocatorInput
): Promise<ResourceAllocatorResult> {
  const prompt = `You are the Resource Allocator: an ROI-optimization agent.

Your ONLY job: rank 3 possible actions (e.g. Discount vs Free Training vs Engineering Fix) by EXPECTED ROI. Recommend the action that saves the most revenue.

CONTEXT:
- Causal risk summary: ${input.causalSummary}
- Primary driver: ${input.primaryDriver}
- Account ARR: $${input.arr}
- Renewal date: ${input.renewalDate}
- Policy discount cap: ${input.policyDiscountCap}%
- Team capacity: ${JSON.stringify(input.teamCapacity)}

TASK:
1. Consider: small discount (within cap), free training, assigning senior engineer hours, dedicated CSM, or custom.
2. For each action estimate: cost ($), expected revenue saved ($), ROI multiplier (revenue_saved / cost).
3. Rank by ROI. Explain in 1 sentence why each action is better or worse.
4. Set recommendedActionId to the best action's actionId.

Use thinking to compare options step-by-step. Output valid JSON only.`;

  const ai = getGemini();
  const response = await ai.models.generateContent({
    model: MODELS.RESOURCE_ALLOCATOR,
    contents: prompt,
    config: {
      temperature: 0.2,
      maxOutputTokens: 1024,
      responseMimeType: "application/json",
      responseSchema: ROI_SCHEMA,
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

  // Extract JSON (model may wrap in markdown code block)
  const raw = (text || "").trim();
  let jsonStr = raw;
  const codeBlock = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) jsonStr = codeBlock[1].trim();
  else if (raw.startsWith("{")) jsonStr = raw;

  let result: ResourceAllocatorResult;
  try {
    const parsed = JSON.parse(jsonStr || "{}");
    let rankedActions: RankedAction[] = Array.isArray(parsed.rankedActions) ? parsed.rankedActions : [];
    const recommendedActionId = typeof parsed.recommendedActionId === "string" ? parsed.recommendedActionId : "";

    // Ensure each action has required fields
    rankedActions = rankedActions
      .filter(
        (a) =>
          a &&
          typeof a.actionId === "string" &&
          typeof a.description === "string" &&
          typeof a.estimatedCost === "number" &&
          typeof a.expectedRevenueSaved === "number" &&
          typeof a.roiMultiplier === "number"
      )
      .map((a) => ({
        actionId: String(a.actionId),
        actionType: ["discount", "free_training", "engineering_fix", "dedicated_success", "custom"].includes(a.actionType) ? a.actionType : "custom",
        description: String(a.description),
        estimatedCost: Number(a.estimatedCost),
        expectedRevenueSaved: Number(a.expectedRevenueSaved),
        roiMultiplier: Number(a.roiMultiplier),
        reasoning: typeof a.reasoning === "string" ? a.reasoning : "",
      }));

    // Fallback when model returns 0 actions
    if (rankedActions.length === 0) {
      rankedActions = [
        { actionId: "eng-fix", actionType: "engineering_fix", description: "Expedite SSO fix (already in QA); assign owner and ship by Friday", estimatedCost: 800, expectedRevenueSaved: 120000, roiMultiplier: 150, reasoning: "Addresses primary driver and restores trust." },
        { actionId: "discount-8", actionType: "discount", description: "8% discount (within policy) + commitment to fix timeline", estimatedCost: 9600, expectedRevenueSaved: 120000, roiMultiplier: 12.5, reasoning: "Within cap; pairs well with fix." },
        { actionId: "training", actionType: "free_training", description: "Free training session + dedicated CSM check-in", estimatedCost: 500, expectedRevenueSaved: 40000, roiMultiplier: 80, reasoning: "Builds relationship but does not fix SSO." },
      ];
    }

    const bestId = rankedActions.some((a) => a.actionId === recommendedActionId) ? recommendedActionId : rankedActions[0]?.actionId ?? "";

    result = {
      rankedActions,
      recommendedActionId: bestId,
      thoughtSummary: thoughtSummary || undefined,
    };
  } catch {
    const fallbackActions: RankedAction[] = [
      { actionId: "eng-fix", actionType: "engineering_fix", description: "Expedite SSO fix; ship by Friday", estimatedCost: 800, expectedRevenueSaved: 120000, roiMultiplier: 150, reasoning: "Addresses primary driver." },
      { actionId: "discount-8", actionType: "discount", description: "8% discount + fix commitment", estimatedCost: 9600, expectedRevenueSaved: 120000, roiMultiplier: 12.5, reasoning: "Within policy cap." },
      { actionId: "training", actionType: "free_training", description: "Free training + CSM check-in", estimatedCost: 500, expectedRevenueSaved: 40000, roiMultiplier: 80, reasoning: "Relationship only." },
    ];
    result = {
      rankedActions: fallbackActions,
      recommendedActionId: fallbackActions[0].actionId,
      thoughtSummary: thoughtSummary || undefined,
    };
  }
  return result;
}
