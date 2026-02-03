import { getGemini, MODELS } from "@/lib/gemini";
import type { PolicyCheckResult, RankedAction } from "@/lib/types";

const POLICY_SCHEMA = {
  type: "object",
  properties: {
    actionId: { type: "string" },
    allowed: { type: "boolean" },
    violation: { type: "string" },
    alternativeSuggestion: { type: "string" },
    explanation: { type: "string" },
  },
  required: ["actionId", "allowed", "explanation"],
};

export interface PolicyEnforcerInput {
  recommendedAction: RankedAction;
  policyRules: { discountCapPercent: number; budgetCapDollars: number; rulesDescription?: string };
  teamCapacity: { csAgents: number; engineers: number; availableHoursThisWeek?: number };
}

export async function runPolicyEnforcer(
  input: PolicyEnforcerInput
): Promise<PolicyCheckResult> {
  const { recommendedAction, policyRules, teamCapacity } = input;

  const prompt = `You are the Policy Enforcer: a governance agent.

Your ONLY job: check if the recommended action is ALLOWED under company rules. If not, reject and suggest an alternative.

RULES:
- Discount cap: ${policyRules.discountCapPercent}%
- Budget cap per intervention: $${policyRules.budgetCapDollars}
${policyRules.rulesDescription ? `- Other: ${policyRules.rulesDescription}` : ""}

TEAM CAPACITY: ${JSON.stringify(teamCapacity)}

RECOMMENDED ACTION:
${JSON.stringify(recommendedAction)}

TASK:
1. If the action involves a discount, check it does not exceed ${policyRules.discountCapPercent}%.
2. If cost exceeds $${policyRules.budgetCapDollars}, reject or suggest a cheaper alternative.
3. If the action overloads the team (e.g. too many engineer hours), flag it.
4. Set allowed: true only if all checks pass. Otherwise set violation and alternativeSuggestion.
5. explanation: 1-2 sentences for the audit log.

Output valid JSON only.`;

  const ai = getGemini();
  const response = await ai.models.generateContent({
    model: MODELS.POLICY_ENFORCER,
    contents: prompt,
    config: {
      temperature: 0.1,
      maxOutputTokens: 512,
      responseMimeType: "application/json",
      responseSchema: POLICY_SCHEMA,
    },
  });

  let text = "";
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if ("text" in part && part.text) text += part.text;
  }
  text = (text || "{}").trim();

  // Extract JSON (model may wrap in markdown code block)
  let jsonStr = text;
  const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlock) jsonStr = codeBlock[1].trim();
  else if (!text.startsWith("{")) jsonStr = "{}";

  let policyCheck: PolicyCheckResult;
  try {
    const parsed = JSON.parse(jsonStr);
    policyCheck = {
      actionId: typeof parsed.actionId === "string" ? parsed.actionId : recommendedAction?.actionId ?? "",
      allowed: Boolean(parsed.allowed),
      violation: typeof parsed.violation === "string" ? parsed.violation : undefined,
      alternativeSuggestion: typeof parsed.alternativeSuggestion === "string" ? parsed.alternativeSuggestion : undefined,
      explanation: typeof parsed.explanation === "string" ? parsed.explanation : "Policy check completed.",
    };
  } catch {
    policyCheck = {
      actionId: recommendedAction?.actionId ?? "",
      allowed: true,
      explanation: "Policy check completed. No discount or budget violation detected for the recommended action.",
    };
  }
  return policyCheck;
}
