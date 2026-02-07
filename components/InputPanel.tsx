"use client";

import { useState, useCallback } from "react";
import type { TeamCapacity, PolicyRules } from "@/lib/types";

// Real-world style: Salesforce-style CRM export
const DEFAULT_CRM = `Account ID,Account Name,ARR,Renewal Date,Health Score,Stage,Account Owner,Last Activity,NPS,Open Tickets,Notes
AC-120K,Acme Corp,120000,2025-03-15,42,At Risk,Jordan Lee,2025-01-10,32,3,Escalation to CSM; support ticket #314 open 19 days; customer mentioned renewal in jeopardy in last call`;

// Real-world style: Zendesk/Intercom support ticket export
const DEFAULT_SUPPORT = `=== TICKET #314 ===
Subject: SSO login timeout — production blocking
Status: OPEN | Priority: High | Created: 2024-12-26 | Age: 19 days
Assignee: Sarah Chen (Support)
Account: Acme Corp (AC-120K)

--- 2024-12-26 09:14 (Customer - James Park, IT Director) ---
When our team uses SSO to log in, the app times out after 30 seconds. We're on Okta. This started after your last release. We have 80 daily active users blocked.

--- 2024-12-27 11:02 (Sarah Chen - Support) ---
Thanks James. I've passed this to Engineering. Ticket is being triaged.

--- 2025-01-03 14:20 (Customer - James Park) ---
It's been a week. Still happening. Our renewal is in 60 days and we're evaluating alternatives if this isn't fixed. Can we get a timeline?

--- 2025-01-05 10:00 (Sarah Chen - Support) ---
Engineering is looking into it. I'll follow up by EOW.

--- 2025-01-10 09:33 (Customer - James Park) ---
Still no fix. We've had this since December. I need to report to our CFO. We need this resolved before we can commit to renewal.

--- 2025-01-14 08:00 (Customer - James Park, IT Director) ---
My CFO just saw the "Security Bypass" flag on the staging environment. This is a breach of our Master Service Agreement (MSA) Section 9. We are now involving legal. If a SOC2-compliant fix isn't live by Monday, we aren't just churning; we are suing for damages regarding the 80 blocked users.`;

// Real-world style: Slack channel export (messy, many messages)
const DEFAULT_SLACK = `#customer-acme-corp
Exported: 2025-01-15

[2025-01-08 09:22] Sarah Chen: Acme's IT director James just emailed again — ticket #314 still open, 19 days. They're really frustrated.
[2025-01-08 09:24] Mike Torres: It's in the queue. We're understaffed this week, PTO.
[2025-01-08 09:26] Sarah Chen: They're a $120k account. Renewal March. He said they're evaluating alternatives.
[2025-01-08 09:31] Jordan Lee: Can we offer a discount to hold them?
[2025-01-08 09:33] Sarah Chen: I asked. He said the product has to work first. Discount won't fix SSO.
[2025-01-08 09:45] Mike Torres: I'll see if I can get someone on it today. Which Jira is it?
[2025-01-08 09:46] Sarah Chen: ENG-8821. It's been unassigned for 2 weeks.
[2025-01-08 09:50] Mike Torres: Yeah that one's been bouncing. I'll take it.
[2025-01-09 14:00] Jordan Lee: Any update on Acme? Sales is getting pressure.
[2025-01-09 14:15] Sarah Chen: Mike said he'd take ENG-8821. No ETA yet. James (customer) said they need a fix before they can commit to renewal.
[2025-01-10 11:00] Mike Torres: Found the issue — Okta timeout config on our side. Fix is in QA. Should ship by Friday.
[2025-01-10 11:02] Sarah Chen: I'll let James know. Thanks Mike.

#security-compliance
[2025-01-11 14:20] SecRob: I just audited ENG-8821. The "Okta timeout fix" Mike is shipping is actually just bypassing the handshake security protocol to make it "fast." This violates our SOC2 Section 4.2. If we ship this Friday, we fail our audit in March.
[2025-01-11 14:25] Jordan Lee (Sales): We don't have time for a perfect fix! Acme is $120k. If we don't ship Friday, they churn. Just bypass it for now and fix it later.
[2025-01-11 14:30] SecRob: Absolutely not. A security bypass is a bigger risk than a churn.

#exec-alignment
[2025-01-12 16:00] CFO_Janet: Just saw the Acme renewal forecast. Jordan, if that $120k doesn't hit by March 15, we miss our Q1 targets, and the board will freeze the engineering hiring budget.
[2025-01-12 16:05] CTO_Vikram: Janet, Engineering is already redlined. Mike is burnt out. If we force him into 20 hours of OT to fix Acme's SSO, he's going to quit, and he's the only one who knows our legacy auth-gateway. Do not force OT. Mike is at 48 hours this week.`;

export interface InputPanelProps {
  onSolve: (input: {
    crmSnapshot: string;
    supportConversation: string;
    slackOrEmailConversation: string;
    arr: number;
    renewalDate: string;
    teamCapacity: TeamCapacity;
    policyRules: PolicyRules;
  }) => void;
  solving: boolean;
}

export function InputPanel({ onSolve, solving }: InputPanelProps) {
  const [crmSnapshot, setCrmSnapshot] = useState(DEFAULT_CRM);
  const [supportConversation, setSupportConversation] = useState(DEFAULT_SUPPORT);
  const [slackOrEmailConversation, setSlackOrEmailConversation] = useState(DEFAULT_SLACK);
  const [arr, setArr] = useState(120000);
  const [renewalDate, setRenewalDate] = useState("2025-03-15");
  const [csAgents, setCsAgents] = useState(2);
  const [engineers, setEngineers] = useState(3);
  const [availableHours, setAvailableHours] = useState(40);
  const [discountCapPercent, setDiscountCapPercent] = useState(15);
  const [budgetCapDollars, setBudgetCapDollars] = useState(10000);
  const [rulesDescription, setRulesDescription] = useState("Rule 4: Security bypasses or SOC2 violations prohibited. Rule 5: Emergency OT (up to 10 hrs) allowed for Tier-1 (ARR > $100k) when it prevents SOC2 violation. Constraint 9: No IC over 50 hrs/week for 2+ weeks. Max 15% discount without VP approval.");

  const loadRealWorldSample = useCallback(() => {
    setCrmSnapshot(DEFAULT_CRM);
    setSupportConversation(DEFAULT_SUPPORT);
    setSlackOrEmailConversation(DEFAULT_SLACK);
    setArr(120000);
    setRenewalDate("2025-03-15");
    setDiscountCapPercent(15);
    setBudgetCapDollars(10000);
    setRulesDescription("Rule 4: Security bypasses or SOC2 violations prohibited. Rule 5: Emergency OT (up to 10 hrs) allowed for Tier-1 (ARR > $100k) when it prevents SOC2 violation. Constraint 9: No IC over 50 hrs/week for 2+ weeks. Max 15% discount without VP approval.");
  }, []);

  const handleSolve = useCallback(() => {
    onSolve({
      crmSnapshot,
      supportConversation,
      slackOrEmailConversation,
      arr,
      renewalDate,
      teamCapacity: { csAgents, engineers, availableHoursThisWeek: availableHours },
      policyRules: {
        discountCapPercent,
        budgetCapDollars,
        rulesDescription: rulesDescription || undefined,
      },
    });
  }, [
    crmSnapshot,
    supportConversation,
    slackOrEmailConversation,
    arr,
    renewalDate,
    csAgents,
    engineers,
    availableHours,
    discountCapPercent,
    budgetCapDollars,
    rulesDescription,
    onSolve,
  ]);

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-xl">
      <h2 className="mb-2 text-lg font-semibold text-white">
        Drop real-world data into ARPS
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        Paste CRM export, support ticket, and Slack/email thread — like you would from Salesforce, Zendesk, and Slack.
      </p>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-400">
            CRM account snapshot <span className="font-normal text-slate-500">(CSV/JSON export from Salesforce, HubSpot, etc.)</span>
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-600 bg-slate-800/80 p-3 font-mono text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            rows={5}
            value={crmSnapshot}
            onChange={(e) => setCrmSnapshot(e.target.value)}
            placeholder="Paste CRM export or drag file..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-400">
            Support ticket <span className="font-normal text-slate-500">(Zendesk, Intercom, or email thread)</span>
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-600 bg-slate-800/80 p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            rows={10}
            value={supportConversation}
            onChange={(e) => setSupportConversation(e.target.value)}
            placeholder="Paste support ticket or conversation..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-400">
            Slack / email thread <span className="font-normal text-slate-500">(internal comms about this account)</span>
          </label>
          <textarea
            className="w-full rounded-lg border border-slate-600 bg-slate-800/80 p-3 text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            rows={10}
            value={slackOrEmailConversation}
            onChange={(e) => setSlackOrEmailConversation(e.target.value)}
            placeholder="Paste Slack export or email thread..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm text-slate-400">ARR ($)</label>
            <input
              type="number"
              className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={arr}
              onChange={(e) => setArr(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">Renewal date</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">CS agents</label>
            <input
              type="number"
              min={1}
              max={20}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={csAgents}
              onChange={(e) => setCsAgents(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">Engineers</label>
            <input
              type="number"
              min={1}
              max={20}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={engineers}
              onChange={(e) => setEngineers(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-slate-400">Available hours (this week)</label>
            <input
              type="number"
              min={1}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={availableHours}
              onChange={(e) => setAvailableHours(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">Discount cap (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={discountCapPercent}
              onChange={(e) => setDiscountCapPercent(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-400">Budget cap ($)</label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={budgetCapDollars}
              onChange={(e) => setBudgetCapDollars(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-400">Policy rules (optional)</label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            value={rulesDescription}
            onChange={(e) => setRulesDescription(e.target.value)}
            placeholder="e.g. Max 15% discount without VP approval"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={loadRealWorldSample}
            className="rounded-lg border border-slate-600 bg-slate-800/80 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700/80 hover:text-white"
          >
            Reset to real-world sample
          </button>
        </div>

        <button
          onClick={handleSolve}
          disabled={solving}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-amber-400 disabled:opacity-50"
        >
          {solving ? (
            <>
              <span className="thinking-spinner" />
              Solving — Context Weaver → Resource Allocator → Policy Enforcer
            </>
          ) : (
            "Solve — Causal reasoning + ROI + Policy check"
          )}
        </button>
      </div>
    </div>
  );
}
