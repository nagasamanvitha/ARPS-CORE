"use client";

import type { PolicyCheckResult } from "@/lib/types";

export interface PolicyComplianceProps {
  policyCheck: PolicyCheckResult;
}

export function PolicyCompliance({ policyCheck }: PolicyComplianceProps) {
  return (
    <div className="rounded-xl border border-slate-600 bg-slate-900/90 p-6">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <span className={policyCheck.allowed ? "text-emerald-500" : "text-rose-500"}>
          {policyCheck.allowed ? "✓" : "✗"}
        </span>
        Policy compliance
      </h2>
      <p className="text-slate-200">{policyCheck.explanation}</p>
      {policyCheck.violation && (
        <div className="mt-3 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">
          Violation: {policyCheck.violation}
        </div>
      )}
      {policyCheck.alternativeSuggestion && (
        <div className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          Alternative: {policyCheck.alternativeSuggestion}
        </div>
      )}
    </div>
  );
}
