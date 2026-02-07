"use client";

import type { RiskRadar as RiskRadarType } from "@/lib/types";

export interface RiskRadarProps {
  riskRadar: RiskRadarType;
}

const LABELS: Record<string, string> = {
  revenueRisk: "Revenue Risk",
  legalRisk: "Legal Risk",
  teamBurnout: "Team Burnout",
};

const LEVEL_COLOR: Record<string, string> = {
  high: "bg-rose-500/80 text-white",
  medium: "bg-amber-500/80 text-slate-900",
  low: "bg-emerald-500/80 text-white",
  stable: "bg-emerald-500/80 text-white",
};

function LevelPill({ level }: { level: string }) {
  const color = LEVEL_COLOR[level] ?? "bg-slate-500 text-white";
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-[11px] font-semibold uppercase ${color}`}
    >
      {level}
    </span>
  );
}

export function RiskRadar({ riskRadar }: RiskRadarProps) {
  const { before, after } = riskRadar;
  return (
    <div className="rounded-xl border border-slate-600 bg-slate-900/90 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">
        Risk Radar — Before vs After ARPS
      </h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Before ARPS
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">{LABELS.revenueRisk}</span>
              <LevelPill level={before.revenueRisk} />
            </li>
            <li className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">{LABELS.legalRisk}</span>
              <LevelPill level={before.legalRisk} />
            </li>
            <li className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">{LABELS.teamBurnout}</span>
              <LevelPill level={before.teamBurnout} />
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            After ARPS Solution
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">{LABELS.revenueRisk}</span>
              <LevelPill level={after.revenueRisk} />
            </li>
            <li className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">{LABELS.legalRisk}</span>
              <LevelPill level={after.legalRisk} />
            </li>
            <li className="flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">{LABELS.teamBurnout}</span>
              <LevelPill level={after.teamBurnout} />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
