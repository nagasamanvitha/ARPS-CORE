"use client";

import { useState } from "react";
import type { CausalRiskResult } from "@/lib/types";

export interface RiskSummaryProps {
  causalRisk: CausalRiskResult;
  arr: number;
  renewalDate: string;
  sourceSnippets?: { arr?: string; primaryDriver?: string; groundingLabel?: string };
  conflictDetected?: boolean;
  conflictDescription?: string;
  /** Account name for display; when set, shows Internal Alignment sparkline (pre-ticket friction). */
  accountName?: string;
}

/** Sparkline showing "Internal Alignment" drift — Pre-Ticket Friction / Early Warning. */
const ALIGNMENT_SPARKLINE_DATA = [88, 82, 76, 68, 58, 48];

function InternalAlignmentSparkline() {
  const [show, setShow] = useState(false);
  const width = 80;
  const height = 24;
  const padding = 2;
  const min = Math.min(...ALIGNMENT_SPARKLINE_DATA);
  const max = Math.max(...ALIGNMENT_SPARKLINE_DATA);
  const range = max - min || 1;
  const xStep = (width - padding * 2) / (ALIGNMENT_SPARKLINE_DATA.length - 1);
  const points = ALIGNMENT_SPARKLINE_DATA.map((v, i) => {
    const x = padding + i * xStep;
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const tooltip =
    "Before James Park even sent that legal threat, ARPS-CORE detected a 'Causal Drift.' Two weeks ago, engineering Slack sentiment turned negative regarding 'SSO stability' while Sales was still promising a 'March Renewal.' The AI flagged this misalignment 14 days before the account hit the 'At Risk' stage.";

  return (
    <span
      className="relative ml-2 inline-flex cursor-help items-center gap-1.5"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
        Internal Alignment
      </span>
      <svg
        width={width}
        height={height}
        className="rounded border border-slate-600 bg-slate-800/60"
        aria-label="Internal alignment trend"
      >
        <polyline
          fill="none"
          stroke="rgb(245, 158, 11)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
      {show && (
        <span
          className="absolute left-0 top-full z-[100] mt-2 w-72 rounded-lg border border-amber-500/30 bg-slate-800 px-3 py-2.5 text-[12px] leading-relaxed text-slate-200 shadow-xl"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          <span className="font-semibold text-amber-400/90">Pre-Ticket Friction · Early Warning</span>
          <p className="mt-1.5">{tooltip}</p>
        </span>
      )}
    </span>
  );
}

function SourceBadge({ snippet, label }: { snippet: string; label: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative ml-2 inline-flex cursor-help align-middle"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      title={label}
    >
      <span className="inline-flex items-center gap-1 rounded border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-400 hover:bg-amber-500/25">
        <SourceIconSvg className="h-3 w-3" />
        Source
      </span>
      {show && (
        <span
          className="absolute left-0 top-full z-[100] mt-2 w-[320px] rounded-lg border border-amber-500/40 bg-slate-800 px-4 py-3 text-[13px] leading-relaxed text-slate-100 shadow-2xl"
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
          <span className="block break-words font-normal">{snippet}</span>
        </span>
      )}
    </span>
  );
}

function SourceIconSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />
    </svg>
  );
}

function ConflictAlert({
  description,
  onClick,
}: {
  description: string;
  onClick?: () => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { setShow(!show); onClick?.(); }}
      className="flex items-center gap-2 rounded-lg border border-rose-500/50 bg-rose-500/15 px-3 py-2 text-left text-sm transition hover:bg-rose-500/25"
    >
      <span className="inline-flex h-3 w-3 flex-shrink-0 animate-pulse rounded-full bg-rose-500" />
      <span className="font-medium text-rose-300">Conflict Alert</span>
      {show && (
        <p className="mt-2 w-full border-t border-rose-500/30 pt-2 text-xs text-rose-200/90">
          {description}
        </p>
      )}
    </button>
  );
}

export function RiskSummary({
  causalRisk,
  arr,
  renewalDate,
  sourceSnippets,
  conflictDetected,
  conflictDescription,
  accountName,
}: RiskSummaryProps) {
  return (
    <div className="risk-pulse rounded-xl border border-rose-500/40 bg-slate-900/90 p-6">
      {conflictDetected && conflictDescription && (
        <div className="mb-4">
          <ConflictAlert description={conflictDescription} />
        </div>
      )}
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-3 w-3 rounded-full bg-rose-500" />
        <h2 className="text-lg font-semibold text-white">Revenue Risk Summary</h2>
      </div>
      {accountName && (
        <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-slate-700 pb-4">
          <span className="text-slate-400 text-sm">Account</span>
          <span className="font-medium text-white">{accountName}</span>
          <InternalAlignmentSparkline />
        </div>
      )}
      <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-400">Account ARR</span>
          <p className="mt-0.5 flex flex-wrap items-center gap-1 font-mono text-amber-400">
            ${arr.toLocaleString()}
            {sourceSnippets?.arr && (
              <SourceBadge
                snippet={sourceSnippets.groundingLabel ?? sourceSnippets.arr}
                label="Ground truth"
              />
            )}
          </p>
        </div>
        <div>
          <span className="text-slate-400">Renewal date</span>
          <p className="font-mono text-slate-200">{renewalDate}</p>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs uppercase tracking-wider text-slate-500">
              Primary risk driver
            </span>
            {sourceSnippets?.primaryDriver && (
              <SourceBadge snippet={sourceSnippets.primaryDriver} label="Source for risk driver" />
            )}
          </div>
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
