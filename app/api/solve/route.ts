// Orchestrator: Context Weaver → Resource Allocator → Policy Enforcer (in-process, no self-fetch)
import { NextRequest, NextResponse } from "next/server";
import { runContextWeaver } from "@/lib/agents/context-weaver";
import { runResourceAllocator } from "@/lib/agents/resource-allocator";
import { runPolicyEnforcer } from "@/lib/agents/policy-enforcer";
import type {
  ARPSResult,
  AuditEntry,
  RankedAction,
  SolveInput,
} from "@/lib/types";

function now() {
  return new Date().toISOString();
}

export async function POST(req: NextRequest) {
  try {
    const input: SolveInput = await req.json();
    const auditLog: AuditEntry[] = [];

    // 1) Context Weaver — causal risk reasoning
    const causalRisk = await runContextWeaver({
      crmSnapshot: input.crmSnapshot,
      supportConversation: input.supportConversation,
      slackOrEmailConversation: input.slackOrEmailConversation,
      arr: input.arr,
      renewalDate: input.renewalDate,
    });
    auditLog.push({
      agent: "context_weaver",
      timestamp: now(),
      summary: causalRisk.plainEnglishSummary,
      thoughtSummary: causalRisk.thoughtSummary,
    });

    // 2) Resource Allocator — ROI ranking (thinking_level: HIGH via thinkingBudget)
    const allocator = await runResourceAllocator({
      causalSummary: causalRisk.plainEnglishSummary,
      primaryDriver: causalRisk.primaryDriver,
      arr: input.arr,
      renewalDate: input.renewalDate,
      policyDiscountCap: input.policyRules.discountCapPercent,
      teamCapacity: input.teamCapacity,
    });
    const rankedActions = allocator.rankedActions;
    const recommendedActionId = allocator.recommendedActionId;
    auditLog.push({
      agent: "resource_allocator",
      timestamp: now(),
      summary: `Recommended: ${recommendedActionId}. Ranked ${rankedActions.length} actions by ROI.`,
      thoughtSummary: allocator.thoughtSummary,
    });

    const recommendedAction =
      rankedActions.find((a) => a.actionId === recommendedActionId) ?? rankedActions[0];

    const actionForPolicy: RankedAction =
      recommendedAction ?? rankedActions[0] ?? {
        actionId: "fallback",
        actionType: "custom",
        description: "Expedite fix and follow up",
        estimatedCost: 1000,
        expectedRevenueSaved: 120000,
        roiMultiplier: 120,
        reasoning: "Fallback when no action returned.",
      };

    // 3) Policy Enforcer — constraint check
    const policyCheck = await runPolicyEnforcer({
      recommendedAction: actionForPolicy,
      policyRules: input.policyRules,
      teamCapacity: input.teamCapacity,
    });
    auditLog.push({
      agent: "policy_enforcer",
      timestamp: now(),
      summary: policyCheck.explanation,
      thoughtSummary: policyCheck.thoughtSummary,
    });

    const result: ARPSResult = {
      causalRisk,
      rankedActions,
      recommendedActionId,
      policyCheck,
      auditLog,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error("solve error", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Solve failed" },
      { status: 500 }
    );
  }
}
