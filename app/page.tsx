"use client";

import { useState, useCallback } from "react";
import { RealWorldScene } from "@/components/RealWorldScene";
import { InputPanel } from "@/components/InputPanel";
import { RiskSummary } from "@/components/RiskSummary";
import { RiskRadar } from "@/components/RiskRadar";
import { ReasoningSidebar } from "@/components/ReasoningSidebar";
import { ROIActions } from "@/components/ROIActions";
import { PolicyCompliance } from "@/components/PolicyCompliance";
import { AuditLog } from "@/components/AuditLog";
import { DEMO_RESULT, DEMO_INPUT } from "@/lib/demo-result";
import type { ARPSResult, SolveInput } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<ARPSResult | null>(null);
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<SolveInput | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<
    "context_weaver" | "resource_allocator" | "policy_enforcer" | null
  >(null);

  const onSolve = useCallback(async (input: SolveInput) => {
    setSolving(true);
    setError(null);
    setLastInput(input);
    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Solve failed");
      setResult(data as ARPSResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setResult(null);
    } finally {
      setSolving(false);
    }
  }, []);

  const showDemo = useCallback(() => {
    setError(null);
    setLastInput(DEMO_INPUT);
    setResult(DEMO_RESULT);
  }, []);

  return (
    <div className="min-h-screen bg-grid bg-[#0a0a0f]">
      <header className="border-b border-slate-800 bg-slate-900/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-white">
              Causal, ROI-aware revenue protection — powered by Gemini reasoning
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400">
            Gemini 3 reasoning • Multi-agent
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <RealWorldScene />
            <div className="rounded-lg border border-slate-600 bg-slate-800/60 p-4">
              <p className="mb-2 text-sm text-slate-300">
                <strong>First time here?</strong> Click below to see the full ARPS flow with a <strong>Triple Conflict</strong> scenario (Sales vs. Compliance vs. Engineering): risk summary, Conflict Alert, Risk Radar, ROI-ranked actions, policy check, and thought signatures — no API key needed.
              </p>
              <button
                type="button"
                onClick={showDemo}
                className="rounded-lg border border-emerald-500/50 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
              >
                See demo result (no API key needed)
              </button>
            </div>
            <InputPanel onSolve={onSolve} solving={solving} />

            {error && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
                <p className="text-amber-200">{error}</p>
                <p className="mt-2 text-sm text-slate-300">
                  <strong>No problem.</strong> Click &quot;See demo result (no API)&quot; above to view the full flow — Revenue Risk Summary, Ranked actions by ROI, Policy compliance, and Thought signatures — without an API key.
                </p>
              </div>
            )}

            {result && (
              <>
                <RiskSummary
                  causalRisk={result.causalRisk}
                  arr={lastInput?.arr ?? 0}
                  renewalDate={lastInput?.renewalDate ?? ""}
                  sourceSnippets={
                    result.sourceSnippets ?? {
                      arr: `CRM: ARR $${(lastInput?.arr ?? 0).toLocaleString()}. Renewal date ${lastInput?.renewalDate ?? ""}.`,
                      primaryDriver: `Support Ticket #314: Status=Open since Dec 26. ${result.causalRisk.primaryDriver}`,
                    }
                  }
                  conflictDetected={result.conflictDetected}
                  conflictDescription={result.conflictDescription}
                  accountName="Acme Corp (AC-120K)"
                />
                {result.riskRadar && (
                  <RiskRadar riskRadar={result.riskRadar} />
                )}
                <ROIActions
                  rankedActions={result.rankedActions}
                  recommendedActionId={result.recommendedActionId}
                  strategicPivotAction={result.strategicPivotAction}
                  conflictDetected={result.conflictDetected}
                  authorizationSummary={result.authorizationSummary}
                />
                <PolicyCompliance policyCheck={result.policyCheck} />
                <AuditLog auditLog={result.auditLog} />
              </>
            )}
          </div>

          {result && (
            <aside className="lg:sticky lg:top-8 lg:self-start">
              <ReasoningSidebar
                auditLog={result.auditLog}
                expandedAgent={expandedAgent}
                onToggle={setExpandedAgent}
                finalRecommendation={result.finalRecommendation}
              />
            </aside>
          )}
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-800 px-6 py-4 text-center text-xs text-slate-500">
        ARPS-CORE — Not a dashboard. Not a churn score. Causal reasoning + ROI + policy.
      </footer>
    </div>
  );
}
