"use client";

import type { AuditEntry } from "@/lib/types";

export interface ReasoningSidebarProps {
  auditLog: AuditEntry[];
  expandedAgent: "context_weaver" | "resource_allocator" | "policy_enforcer" | null;
  onToggle: (agent: "context_weaver" | "resource_allocator" | "policy_enforcer" | null) => void;
  finalRecommendation?: string;
}

const LABELS: Record<string, string> = {
  context_weaver: "Context Weaver (causal reasoning)",
  resource_allocator: "Resource Allocator (ROI, thinking_level: high)",
  policy_enforcer: "Policy Enforcer (constraints)",
};

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** Renders thought/summary text with paragraphs, bold (**), and list-like lines for readability. */
function ThoughtSignatureText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={`thought-signature-text space-y-2 ${className}`}>
      {paragraphs.map((para, i) => {
        const lines = para.split(/\n/).map((l) => l.trim()).filter(Boolean);
        const hasListLike = lines.some(
          (l) => /^[•\-*]\s/.test(l) || /^\[\s*"[^"]+"\s*\]/.test(l) || l.startsWith("Secondary factors:") || l.startsWith("The secondary") || l.startsWith("The core issue:")
        );
        const asList = lines.length > 1 && (hasListLike || lines.some((l) => /^[•\-*]\s/.test(l)));
        return (
          <div key={i} className="last:mb-0">
            {asList ? (
              <ul className="list-inside list-disc space-y-1 pl-1 text-[13px] leading-[1.5]">
                {lines.map((line, j) => {
                  const bullet = /^[•\-*]\s*/.exec(line);
                  const content = bullet ? line.slice(bullet[0].length) : line;
                  return (
                    <li key={j} className="pl-0.5">
                      <FormattedSegment text={content} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="space-y-1.5">
                {lines.map((line, j) => (
                  <p key={j} className="text-[13px] leading-[1.55]">
                    <FormattedSegment text={line} />
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Renders a segment with **bold** parsed. */
function FormattedSegment({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest.length > 0) {
    const bold = /\*\*([^*]+)\*\*/.exec(rest);
    if (bold) {
      const idx = rest.indexOf(bold[0]);
      if (idx > 0) parts.push(<span key={key++}>{rest.slice(0, idx)}</span>);
      parts.push(<strong key={key++} className="font-semibold text-slate-200">{bold[1]}</strong>);
      rest = rest.slice(idx + bold[0].length);
    } else {
      parts.push(<span key={key++}>{rest}</span>);
      break;
    }
  }
  return <>{parts}</>;
}

const SECTION_LABEL = "text-[11px] font-semibold uppercase tracking-wider text-amber-500/80";

export function ReasoningSidebar({
  auditLog,
  expandedAgent,
  onToggle,
  finalRecommendation,
}: ReasoningSidebarProps) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-slate-900/90 p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-400">
        <span className="text-amber-500">Thought signatures</span>
        <span className="text-slate-500">— model reasoning</span>
      </h2>
      <p className="mb-4 text-xs text-slate-500">
        Click to expand. Summary, thought, and reasoning logic when opened.
      </p>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {auditLog.map((entry, i) => {
          const isOpen = expandedAgent === entry.agent;
          return (
            <div key={i} className="thought-block rounded-r-lg overflow-hidden">
              <button
                type="button"
                onClick={() =>
                  onToggle(isOpen ? null : entry.agent)
                }
                className="flex w-full items-center justify-between gap-2 p-3 text-left text-sm font-medium text-slate-200 hover:bg-amber-500/10 hover:text-amber-300/90 transition-colors"
              >
                <span>{LABELS[entry.agent] ?? entry.agent}</span>
                <span
                  className={`flex-shrink-0 text-amber-500/80 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-amber-500/20 bg-slate-900/50 p-3.5 space-y-3">
                  <span className="text-[11px] text-slate-500 font-mono">{entry.timestamp.slice(0, 19)}</span>

                  <div>
                    <div className={SECTION_LABEL}>Summary</div>
                    <div className="mt-1 text-slate-400">
                      <ThoughtSignatureText text={entry.summary} />
                    </div>
                  </div>

                  {entry.thoughtSummary && (
                    <div className="rounded bg-slate-800/80 p-2.5">
                      <div className={SECTION_LABEL}>Thought</div>
                      <div className="mt-1 text-amber-200/90">
                        <ThoughtSignatureText text={entry.thoughtSummary} className="text-[13px]" />
                      </div>
                    </div>
                  )}

                  {entry.reasoningLogic && (
                    <div className="rounded border border-amber-500/30 bg-amber-500/5 p-2.5">
                      <div className={SECTION_LABEL}>Internal debate</div>
                      <div className="mt-1 text-amber-200/95">
                        <ThoughtSignatureText text={entry.reasoningLogic} className="text-[13px]" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {finalRecommendation && (
        <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400/90">
            Final recommendation
          </div>
          <p className="mt-1 text-sm font-medium text-emerald-200">
            {finalRecommendation}
          </p>
        </div>
      )}
    </div>
  );
}
