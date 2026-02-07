"use client";

import { useState, useRef, useEffect } from "react";
import type { AuthorizationSummary, RankedAction } from "@/lib/types";

export interface ROIActionsProps {
  rankedActions: RankedAction[];
  recommendedActionId: string;
  strategicPivotAction?: string;
  conflictDetected?: boolean;
  /** When present (Live Solve or demo), Authorization Summary modal uses this instead of hardcoded text. */
  authorizationSummary?: AuthorizationSummary;
}

const JIRA_TICKET = `┌─────────────────────────────────────────────────────────────┐
│ JIRA TICKET — Expedite SSO Fix (Acme Corp / #314)           │
└─────────────────────────────────────────────────────────────┘

Summary
  [P0] SSO login timeout blocking Acme Corp — 80 users, 19+ days. Ship by Friday.

Priority          Critical
Component         SSO / Authentication
Labels            renewal-at-risk, acme-corp, customer-blocker
Account           Acme Corp (AC-120K) | ARR $120,000 | Renewal 2025-03-15

─────────────────────────────────────────────────────────────
Description (Technical Context)
─────────────────────────────────────────────────────────────
• Issue: SSO login timeout / session failure after redirect from IdP.
• Impact: ~80 daily active users unable to access platform since Dec 26.
• Linked support: Ticket #314 (open 19 days). Internal ref: ENG-8821.
• Root cause (engineering): SSO handshake timeout; fix currently in QA.
• Business impact: Customer has paused renewal discussions until resolved;
  IT Director has stated renewal is contingent on platform being functional.
  Competitive evaluation in progress.

Acceptance criteria
  • Fix deployed to production by Friday EOD.
  • Owner assigned; status update in ticket by Wed EOD.
  • Customer notified when fix is live.

Revenue at risk: $120,000. Estimated fix cost: ~$800 (engineer time).`;

const EMAIL_TO_IT_DIRECTOR = `Subject: Acme Corp — Our commitment to you and your team

Dear [Acme Corp IT Director],

I’m reaching out personally because I know the last 19 days have been incredibly frustrating for you and your team.

Having 80 people unable to access the platform because of the SSO issue is not acceptable—and I’m sorry for the delay in getting this resolved. You’ve had to put renewal discussions on hold, and that’s a burden we don’t take lightly.

Here’s what we’re doing: we’ve prioritized the fix that’s currently in QA and are committing to having it live by Friday. You’ll hear from us by end of day Wednesday with a short update, and again the moment the fix is deployed.

We know trust has been damaged by the prolonged downtime and the lack of clear communication on our side. Going forward, we want to make sure you have visibility and a direct line to us so this doesn’t happen again.

Thank you for your patience and for giving us the chance to make this right.

Best regards,
[Your CS Team]`;

function ROITooltip({
  cost,
  revenueSaved,
  roiMultiplier,
  children,
}: {
  cost: number;
  revenueSaved: number;
  roiMultiplier: number;
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const [linger, setLinger] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setShow(true);
    setLinger(false);
  };

  const onLeave = () => {
    setLinger(true);
    timeoutRef.current = setTimeout(() => {
      setShow(false);
      setLinger(false);
      timeoutRef.current = null;
    }, 2000);
  };

  useEffect(() => () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
      {(show || linger) && (
        <div
          className="absolute bottom-full left-1/2 z-50 mb-2 w-72 -translate-x-1/2 rounded-lg border border-amber-500/40 bg-slate-900 p-3 text-xs shadow-xl"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <div className="mb-2 font-medium text-amber-400">ROI formula</div>
          <div className="font-mono text-slate-300">
            ROI = (Revenue Saved − Cost) / Cost
          </div>
          <div className="mt-2 border-t border-slate-600 pt-2 text-slate-400">
            {roiMultiplier.toFixed(0)} = ({revenueSaved.toLocaleString()} − {cost.toLocaleString()}) / {cost.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

const OT_AUTH_TIMESTAMP = () => new Date().toISOString().replace("T", " ").slice(0, 19) + "Z";

export function ROIActions({
  rankedActions,
  recommendedActionId,
  strategicPivotAction,
  conflictDetected,
  authorizationSummary,
}: ROIActionsProps) {
  const auth = authorizationSummary;
  const [simulatedActionOpen, setSimulatedActionOpen] = useState(false);
  const [pivotModalOpen, setPivotModalOpen] = useState(false);
  const [otAuthModalOpen, setOtAuthModalOpen] = useState(false);
  const [jiraAuthorized, setJiraAuthorized] = useState(false);
  const [slackAuthorized, setSlackAuthorized] = useState(false);
  const [emailAuthorized, setEmailAuthorized] = useState(false);
  const [showCalculationLogic, setShowCalculationLogic] = useState(false);
  const recommended = rankedActions.find((a) => a.actionId === recommendedActionId);
  const otAction = rankedActions.find((a) => a.actionId === "emergency-ot");

  const otAllExecuted = jiraAuthorized && slackAuthorized && emailAuthorized;

  const openOtAuthModal = () => {
    setJiraAuthorized(false);
    setSlackAuthorized(false);
    setEmailAuthorized(false);
    setShowCalculationLogic(false);
    setOtAuthModalOpen(true);
  };

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
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-slate-500">#{i + 1}</span>
                    {isRecommended && (
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                        Recommended
                      </span>
                    )}
                    <span className="font-medium text-slate-200">{action.description}</span>
                    {isRecommended && (
                      <button
                        type="button"
                        onClick={() => setSimulatedActionOpen(true)}
                        className="rounded border border-emerald-500/50 bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/30"
                      >
                        Draft Outreach & Fix Ticket
                      </button>
                    )}
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
                  <ROITooltip
                    cost={action.estimatedCost}
                    revenueSaved={action.expectedRevenueSaved}
                    roiMultiplier={action.roiMultiplier}
                  >
                    <div className="cursor-help font-mono text-amber-400 underline decoration-amber-500/50 decoration-dotted">
                      {action.roiMultiplier.toFixed(1)}x
                    </div>
                  </ROITooltip>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agentic buttons when conflict / strategic pivot */}
      {(conflictDetected || strategicPivotAction) && (
        <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-600 pt-4">
          {strategicPivotAction && (
            <button
              type="button"
              onClick={() => setPivotModalOpen(true)}
              className="rounded-lg border border-emerald-500/50 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
            >
              Execute Strategic Pivot
            </button>
          )}
          {otAction && auth && (
            <button
              type="button"
              onClick={openOtAuthModal}
              className="rounded-lg border border-amber-500/50 bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-500/25"
            >
              Authorize Emergency OT & SOC2-Compliant Fix
            </button>
          )}
        </div>
      )}

      {/* OT Authorization modal: only from authorizationSummary (no hardcoded content) */}
      {otAuthModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOtAuthModalOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setOtAuthModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ot-auth-title"
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-amber-500/30 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-amber-500/30 px-6 py-4">
              <h2 id="ot-auth-title" className="text-lg font-bold text-white">
                Authorization Summary
              </h2>
              <button
                type="button"
                onClick={() => setOtAuthModalOpen(false)}
                className="rounded p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {auth ? (
              <>
                <div className="border-b border-amber-500/30 bg-amber-500/5 px-6 py-4">
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${otAllExecuted ? "bg-emerald-500" : "bg-amber-500"}`} />
                      Status: {otAllExecuted ? "EXECUTED" : "AWAITING AUTHORIZATION"}
                    </span>
                    <span>Agent: ARPS-CORE Multi-Agent Suite</span>
                    <span className="font-mono">Timestamp: {OT_AUTH_TIMESTAMP()}</span>
                  </p>
                  {auth.accountLabel && (
                    <p className="mt-1 text-sm text-slate-300">{auth.accountLabel}</p>
                  )}
                </div>

                {auth.thoughtTraceIntro && (
                  <section className="border-b border-amber-500/30 bg-amber-500/5 px-6 py-4">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400">
                      Internal Thought Trace — Chain of Thought
                    </h3>
                    <p className="mb-3 text-[11px] text-slate-500">{auth.thoughtTraceIntro}</p>
                    <ul className="space-y-3 text-[13px] text-slate-200 leading-relaxed">
                      {auth.conflictIdentification && (
                        <li className="flex gap-2">
                          <span className="font-semibold text-amber-400/90 shrink-0">Conflict Identification:</span>
                          <span className="min-w-0 break-words">{auth.conflictIdentification}</span>
                        </li>
                      )}
                      {auth.constraintSatisfaction && (
                        <li className="flex gap-2">
                          <span className="font-semibold text-amber-400/90 shrink-0">Constraint Satisfaction:</span>
                          <span className="min-w-0 break-words">{auth.constraintSatisfaction}</span>
                        </li>
                      )}
                      {auth.legalPolicyCheck && (
                        <li className="flex gap-2">
                          <span className="font-semibold text-amber-400/90 shrink-0">Legal/Policy Check:</span>
                          <span className="min-w-0 break-words">{auth.legalPolicyCheck}</span>
                        </li>
                      )}
                    </ul>
                  </section>
                )}

                <div className="space-y-0">
                  <div className="border-b border-slate-700 bg-slate-800/40 px-6 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      Authorization Result — Proof of Impact
                    </p>
                  </div>
                  <section className="border-b border-slate-700 px-6 py-4">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400">
                      1. Automated Workflow Dispatches — Authorize each task
                    </h3>
                    <p className="mb-3 rounded border border-slate-600 bg-slate-800/50 px-3 py-2 text-[11px] text-slate-400">
                      <strong className="text-slate-300">Draft Review:</strong> All outreach (Jira, Slack, Email) is drafted for human review before send. No autonomous send—co-pilot only.
                    </p>
                    <ul className="space-y-3 text-[13px] text-slate-200">
                      {auth.workflowDispatches?.jira && (
                        <li className="flex flex-col gap-2 rounded-lg border border-slate-600 bg-slate-800/40 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex gap-2 min-w-0 flex-1">
                              <span className="font-medium text-slate-400 shrink-0">Jira:</span>
                              <span className="min-w-0 break-words">{auth.workflowDispatches.jira}</span>
                            </div>
                            {jiraAuthorized ? (
                              <span className="shrink-0 text-emerald-400 text-xs font-semibold">✓ Approved</span>
                            ) : (
                              <button type="button" onClick={() => setJiraAuthorized(true)} className="shrink-0 rounded border border-amber-500/50 bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-amber-500/30">Authorize</button>
                            )}
                          </div>
                        </li>
                      )}
                      {auth.workflowDispatches?.slack && (
                        <li className="flex flex-col gap-2 rounded-lg border border-slate-600 bg-slate-800/40 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex gap-2 min-w-0 flex-1">
                              <span className="font-medium text-slate-400 shrink-0">Slack:</span>
                              <span className="min-w-0 break-words">{auth.workflowDispatches.slack}</span>
                            </div>
                            {slackAuthorized ? (
                              <span className="shrink-0 text-emerald-400 text-xs font-semibold">✓ Approved</span>
                            ) : (
                              <button type="button" onClick={() => setSlackAuthorized(true)} className="shrink-0 rounded border border-amber-500/50 bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-amber-500/30">Authorize</button>
                            )}
                          </div>
                        </li>
                      )}
                      {auth.workflowDispatches?.email && (
                        <li className="flex flex-col gap-2 rounded-lg border border-slate-600 bg-slate-800/40 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex gap-2 min-w-0 flex-1">
                              <span className="font-medium text-slate-400 shrink-0">Email:</span>
                              <span className="min-w-0 break-words">{auth.workflowDispatches.email}</span>
                            </div>
                            {emailAuthorized ? (
                              <span className="shrink-0 text-emerald-400 text-xs font-semibold">✓ Approved</span>
                            ) : (
                              <button type="button" onClick={() => setEmailAuthorized(true)} className="shrink-0 rounded border border-amber-500/50 bg-amber-500/20 px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-amber-500/30">Authorize</button>
                            )}
                          </div>
                        </li>
                      )}
                    </ul>
                  </section>

                  <section className="border-b border-slate-700 px-6 py-4">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400">
                      2. Final Economic Impact
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowCalculationLogic((v) => !v)}
                      className="text-[11px] font-medium text-amber-400/90 underline decoration-amber-500/50 hover:text-amber-300"
                    >
                      {showCalculationLogic ? "Hide" : "View Math"} / Calculation Logic
                    </button>
                    <ul className="grid gap-2 text-[13px] mt-2">
                      <li className="flex justify-between text-slate-300">
                        <span>Direct Cost:</span>
                        <span className="font-mono text-rose-400">${auth.directCost.toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between text-slate-300">
                        <span>Revenue Protected:</span>
                        <span className="font-mono text-emerald-400">${auth.revenueProtected.toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between text-slate-300">
                        <span>Estimated Liability Mitigation:</span>
                        <span className="font-mono text-emerald-400">${auth.liabilityMitigation.toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between border-t border-slate-600 pt-2 text-sm font-semibold text-white">
                        <span>Net Business Value:</span>
                        <span className="font-mono text-amber-400">
                          ${(auth.revenueProtected + auth.liabilityMitigation - auth.directCost).toLocaleString()}
                        </span>
                      </li>
                    </ul>
                    {showCalculationLogic && auth.calculationLogic && (
                      <div className="mt-4 rounded-lg border border-slate-600 bg-slate-800/60 p-4 text-[12px] text-slate-300 space-y-4">
                        {auth.calculationLogic.directCostLogic != null && (
                          <div>
                            <p className="font-semibold text-amber-400/90 mb-1">1. Direct Cost (${auth.directCost.toLocaleString()})</p>
                            <p className="mb-1"><span className="text-slate-500">Logic:</span> {auth.calculationLogic.directCostLogic}</p>
                            {auth.calculationLogic.directCostSource != null && <p className="mb-1"><span className="text-slate-500">Source:</span> {auth.calculationLogic.directCostSource}</p>}
                          </div>
                        )}
                        {auth.calculationLogic.revenueProtectedLogic != null && (
                          <div>
                            <p className="font-semibold text-amber-400/90 mb-1">2. Revenue Protected (${auth.revenueProtected.toLocaleString()})</p>
                            <p className="mb-1"><span className="text-slate-500">Logic:</span> {auth.calculationLogic.revenueProtectedLogic}</p>
                            {auth.calculationLogic.revenueProtectedSource != null && <p className="mb-1"><span className="text-slate-500">Source:</span> {auth.calculationLogic.revenueProtectedSource}</p>}
                          </div>
                        )}
                        {auth.calculationLogic.liabilityLogic != null && (
                          <div>
                            <p className="font-semibold text-amber-400/90 mb-1">3. Estimated Liability Mitigation (${auth.liabilityMitigation.toLocaleString()})</p>
                            <p className="mb-1"><span className="text-slate-500">Logic:</span> {auth.calculationLogic.liabilityLogic}</p>
                            {auth.calculationLogic.liabilitySource != null && <p className="mb-1"><span className="text-slate-500">Source:</span> {auth.calculationLogic.liabilitySource}</p>}
                            {auth.calculationLogic.liabilityCredibility != null && <p className="text-slate-400 italic">{auth.calculationLogic.liabilityCredibility}</p>}
                          </div>
                        )}
                        <div className="border-t border-slate-600 pt-3">
                          <p className="font-semibold text-amber-400/90 mb-1">Net Business Value formula</p>
                          <p className="font-mono text-slate-200 mb-1">Net Value = (Revenue + Liability Mitigation) − Direct Cost</p>
                          <p className="font-mono text-slate-200">
                            {(auth.revenueProtected + auth.liabilityMitigation - auth.directCost).toLocaleString()} = ({auth.revenueProtected.toLocaleString()} + {auth.liabilityMitigation.toLocaleString()}) − {auth.directCost.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </section>

                  {auth.policyAuditItems?.length > 0 && (
                    <section className="px-6 py-4">
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-400">
                        3. Policy Compliance Audit Trail
                      </h3>
                      <ul className="space-y-2 text-[13px] text-slate-200">
                        {auth.policyAuditItems.map((item, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-emerald-500" aria-hidden>✅</span>
                            <span><strong className="text-slate-300">{item.label}:</strong> {item.text}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {auth.securityGuardrail && (
                    <section className="border-b border-slate-700 px-6 py-3">
                      <p className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Security Guardrail:</strong> {auth.securityGuardrail}
                      </p>
                    </section>
                  )}
                </div>

                <div className="border-t border-slate-700 px-6 py-3 text-center">
                  {otAllExecuted ? (
                    <p className="text-[11px] text-slate-500">
                      [ARPS-CORE] Multi-System Dispatch complete. Action logged for audit.
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500">
                      Authorize each task above to execute. Once all are approved, status will show EXECUTED.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="px-6 py-8 text-center text-slate-400 text-sm">
                Authorization summary is not available for this result. Run a solve with a conflict scenario to generate it.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Strategic Pivot modal: Jira re-assignment */}
      {pivotModalOpen && strategicPivotAction && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPivotModalOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setPivotModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pivot-modal-title"
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-600 bg-slate-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 id="pivot-modal-title" className="text-lg font-semibold text-white">
                Emergency Resource Re-balancing — Acme Corp
              </h3>
              <button
                type="button"
                onClick={() => setPivotModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <pre className="whitespace-pre-wrap rounded-lg border border-slate-600 bg-slate-800/60 p-4 text-[13px] leading-relaxed text-slate-200 font-sans">
              {strategicPivotAction}
            </pre>
          </div>
        </div>
      )}

      {/* Simulated Action modal: split-screen Left Email / Right Jira */}
      {simulatedActionOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSimulatedActionOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSimulatedActionOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="simulated-action-title"
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl border border-slate-600 bg-slate-900 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-600 px-6 py-4">
              <h3 id="simulated-action-title" className="text-lg font-semibold text-white">
                Draft Outreach & Fix Ticket
              </h3>
              <button
                type="button"
                onClick={() => setSimulatedActionOpen(false)}
                className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <p className="px-6 pb-3 text-sm text-slate-400">
              Pre-written messages for the #1 recommended action. Copy and send.
            </p>

            <div className="flex flex-1 min-h-0 px-6 pb-6 gap-4">
              {/* Left: Empathetic email to IT Director */}
              <div className="flex-1 flex flex-col rounded-lg border border-slate-600 bg-slate-800/60 overflow-hidden min-w-0">
                <h4 className="px-4 py-2.5 text-sm font-medium text-slate-300 border-b border-slate-600">
                  Email → Acme Corp IT Director
                </h4>
                <pre className="flex-1 overflow-y-auto whitespace-pre-wrap p-4 text-[13px] leading-relaxed text-slate-200 font-sans">
                  {EMAIL_TO_IT_DIRECTOR}
                </pre>
              </div>
              {/* Right: Jira ticket with SSO technical context */}
              <div className="flex-1 flex flex-col rounded-lg border border-slate-600 bg-slate-800/60 overflow-hidden min-w-0">
                <h4 className="px-4 py-2.5 text-sm font-medium text-slate-300 border-b border-slate-600">
                  Jira Ticket — SSO fix (technical context)
                </h4>
                <pre className="flex-1 overflow-y-auto whitespace-pre-wrap p-4 text-xs font-mono text-slate-200">
                  {JIRA_TICKET}
                </pre>
              </div>
            </div>

            {recommended && (
              <p className="px-6 pb-4 text-xs text-slate-500">
                Based on: {recommended.description} (ROI {recommended.roiMultiplier.toFixed(1)}x).
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
