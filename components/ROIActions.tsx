"use client";

import type { RankedAction } from "@/lib/types";

export interface ROIActionsProps {
  rankedActions: RankedAction[];
  recommendedActionId: string;
}

export function ROIActions({ rankedActions, recommendedActionId }: ROIActionsProps) {
  return (
    <div className="rounded-xl border border-slate-600 bg-slate-900/90 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">
        Ranked actions by ROI
      </h2>
      <div className="space-y-3">
        {rankedActions.map((action, i) => {
          const isRecommended = action.actionId === recommendedActionId;
          return (
            <div
              key={action.actionId}
              className={`rounded-lg border p-4 ${
                isRecommended
                  ? "border-amber-500/60 bg-amber-500/10"
                  : "border-slate-600 bg-slate-800/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500">#{i + 1}</span>
                    {isRecommended && (
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                        Recommended
                      </span>
                    )}
                    <span className="font-medium text-slate-200">{action.description}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{action.reasoning}</p>
                </div>
                <div className="text-right text-sm">
                  <div className="text-slate-400">Cost</div>
                  <div className="font-mono text-rose-400">${action.estimatedCost.toLocaleString()}</div>
                  <div className="mt-1 text-slate-400">Revenue saved</div>
                  <div className="font-mono text-emerald-400">
                    ${action.expectedRevenueSaved.toLocaleString()}
                  </div>
                  <div className="mt-1 text-slate-400">ROI</div>
                  <div className="font-mono text-amber-400">{action.roiMultiplier.toFixed(1)}x</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
