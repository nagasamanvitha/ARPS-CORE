"use client";

import type { CausalRiskResult } from "@/lib/types";

export interface RiskSummaryProps {
  causalRisk: CausalRiskResult;
  arr: number;
  renewalDate: string;
}

export function RiskSummary({ causalRisk, arr, renewalDate }: RiskSummaryProps) {
  return (
    <div className="risk-pulse rounded-xl border border-rose-500/40 bg-slate-900/90 p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-3 w-3 rounded-full bg-rose-500" />
        <h2 className="text-lg font-semibold text-white">Revenue Risk Summary</h2>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-400">Account ARR</span>
          <p className="font-mono text-amber-400">${arr.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-slate-400">Renewal date</span>
          <p className="font-mono text-slate-200">{renewalDate}</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-500">Primary risk driver</span>
          <p className="mt-1 text-slate-200">{causalRisk.primaryDriver}</p>
        </div>
        {causalRisk.secondaryDrivers?.length > 0 && (
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-500">Contributing factors</span>
            <ul className="mt-1 list-inside list-disc text-slate-300">
              {causalRisk.secondaryDrivers.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-500">Plain-English summary</span>
          <p className="mt-1 text-slate-100">{causalRisk.plainEnglishSummary}</p>
        </div>
        <p className="text-xs text-slate-500">Confidence: {causalRisk.confidence}</p>
      </div>
    </div>
  );
}
