"use client";

import type { AuditEntry } from "@/lib/types";

export interface ReasoningSidebarProps {
  auditLog: AuditEntry[];
  expandedAgent: "context_weaver" | "resource_allocator" | "policy_enforcer" | null;
  onToggle: (agent: "context_weaver" | "resource_allocator" | "policy_enforcer" | null) => void;
}

const LABELS: Record<string, string> = {
  context_weaver: "Context Weaver (causal reasoning)",
  resource_allocator: "Resource Allocator (ROI, thinking_level: high)",
  policy_enforcer: "Policy Enforcer (constraints)",
};

export function ReasoningSidebar({
  auditLog,
  expandedAgent,
  onToggle,
}: ReasoningSidebarProps) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-slate-900/90 p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-400">
        <span className="text-amber-500">Thought signatures</span>
        <span className="text-slate-500">— model reasoning</span>
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Gemini reasoning (includeThoughts) shown per agent. Required for multi-turn thought context.
      </p>
      <div className="space-y-2">
        {auditLog.map((entry, i) => (
          <div key={i} className="thought-block rounded-r-lg p-3">
            <button
              type="button"
              onClick={() =>
                onToggle(expandedAgent === entry.agent ? null : entry.agent)
              }
              className="w-full text-left text-sm font-medium text-slate-200"
            >
              {LABELS[entry.agent] ?? entry.agent} — {entry.timestamp.slice(0, 19)}
            </button>
            <p className="mt-1 text-xs text-slate-400">{entry.summary}</p>
            {expandedAgent === entry.agent && entry.thoughtSummary && (
              <div className="mt-3 rounded bg-slate-800/80 p-3 text-xs text-amber-200/90">
                {entry.thoughtSummary}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
