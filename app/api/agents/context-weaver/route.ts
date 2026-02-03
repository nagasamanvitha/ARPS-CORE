// Agent A: Context Weaver — Causal Risk Reasoning (multimodal, includeThoughts)
import { NextRequest, NextResponse } from "next/server";
import { runContextWeaver } from "@/lib/agents/context-weaver";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const causal = await runContextWeaver({
      crmSnapshot: body.crmSnapshot,
      supportConversation: body.supportConversation,
      slackOrEmailConversation: body.slackOrEmailConversation,
      arr: body.arr,
      renewalDate: body.renewalDate,
    });
    return NextResponse.json({ causal });
  } catch (e) {
    console.error("context-weaver error", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Context Weaver failed" },
      { status: 500 }
    );
  }
}
