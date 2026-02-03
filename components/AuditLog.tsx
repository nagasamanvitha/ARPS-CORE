"use client";

import type { AuditEntry } from "@/lib/types";

export interface AuditLogProps {
  auditLog: AuditEntry[];
}

const AGENT_LABELS: Record<string, string> = {
  context_weaver: "Context Weaver",
  resource_allocator: "Resource Allocator",
  policy_enforcer: "Policy Enforcer",
};

export function AuditLog({ auditLog }: AuditLogProps) {
  return (
    <div className="rounded-xl border border-slate-600 bg-slate-900/90 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">Audit log (Gemini explanation)</h2>
      <div className="space-y-2 font-mono text-sm">
        {auditLog.map((entry, i) => (
          <div
            key={i}
            className="flex flex-wrap items-baseline gap-2 border-b border-slate-700/60 pb-2 last:border-0"
          >
            <span className="text-slate-500">{entry.timestamp}</span>
            <span className="text-amber-400">{AGENT_LABELS[entry.agent] ?? entry.agent}</span>
            <span className="text-slate-300">{entry.summary}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
