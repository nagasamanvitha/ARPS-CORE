// Agent B: Resource Allocator — ROI-based action ranking (thinking_level: HIGH)
import { NextRequest, NextResponse } from "next/server";
import { runResourceAllocator } from "@/lib/agents/resource-allocator";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await runResourceAllocator({
      causalSummary: body.causalSummary,
      primaryDriver: body.primaryDriver,
      arr: body.arr,
      renewalDate: body.renewalDate,
      policyDiscountCap: body.policyDiscountCap,
      teamCapacity: body.teamCapacity,
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error("resource-allocator error", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Resource Allocator failed" },
      { status: 500 }
    );
  }
}
