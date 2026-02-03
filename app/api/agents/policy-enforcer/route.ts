// Agent C: Policy Enforcer — Constraint check (structured, fast)
import { NextRequest, NextResponse } from "next/server";
import { runPolicyEnforcer } from "@/lib/agents/policy-enforcer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const policyCheck = await runPolicyEnforcer({
      recommendedAction: body.recommendedAction,
      policyRules: body.policyRules,
      teamCapacity: body.teamCapacity,
    });
    return NextResponse.json({ policyCheck });
  } catch (e) {
    console.error("policy-enforcer error", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Policy Enforcer failed" },
      { status: 500 }
    );
  }
}
