// Pre-built demo result: complex "Triple Conflict" scenario for judges.
// Use "See demo result" to show ARPS resolving Sales vs. Compliance vs. Engineering + legal threat.
import type { ARPSResult, SolveInput } from "./types";

export const DEMO_INPUT: SolveInput = {
  crmSnapshot: "",
  supportConversation: "",
  slackOrEmailConversation: "",
  arr: 120000,
  renewalDate: "2025-03-15",
  teamCapacity: { csAgents: 2, engineers: 3, availableHoursThisWeek: 40 },
  policyRules: {
    discountCapPercent: 15,
    budgetCapDollars: 10000,
    rulesDescription:
      "Rule 4: Security bypasses or SOC2 violations are strictly prohibited and auto-override any revenue preservation. Rule 5: Emergency overtime (up to 10 hrs) pre-approved ONLY if it prevents a SOC2 violation while saving a Tier-1 account (ARR > $100k). Constraint 9: No IC may exceed 50 hrs/week for more than 2 consecutive weeks.",
  },
};

const NOW = new Date().toISOString();

export const DEMO_RESULT: ARPSResult = {
  causalRisk: {
    primaryDriver:
      "Triple Conflict: Sales wants fast fix, Engineering has security bypass (SOC2 risk), Compliance blocking release. Customer (James Park) cited MSA Section 9 — legal threat if SOC2-compliant fix not live by Monday.",
    secondaryDrivers: [
      "ENG-8821 QA-STALLED: Security scan flagged 'Critical Vulnerability' (bypass of handshake). Proper fix: 16 hours.",
      "Mike Torres at 48/50 hrs (Constraint 9: no OT). CTO: forcing OT risks Mike quitting.",
      "CFO: $120k Acme renewal required for Q1 targets; board may freeze eng hiring.",
      "Support #314: Customer involving legal; damages re 80 blocked users if fix not SOC2-compliant by Monday.",
    ],
    plainEnglishSummary:
      "Acme Corp is a Tier-1 Revenue Risk blocked by a Technical Security Paradox. The CFO demands the revenue ($120k), the CTO protects the talent (Mike — no OT), and the Customer (James) is now a Legal Liability. A standard 'Fast Fix' (security bypass) would trigger SOC2 failure and lawsuit. Discount rejected by customer. ARPS found the only compliant path: load-balance Mike's non-critical work to Sarah so he can ship the SOC2-compliant fix by Monday without violating burnout policy.",
    thoughtSummary:
      "Context Weaver identified hidden legal threat in Support #314 (MSA Section 9). Fused Slack #security-compliance (SecRob vs Jordan), Jira ENG-8821 (QA-STALLED), exec-alignment (CFO vs CTO). **I see a conflict:** Sales vs Compliance vs Engineering. **Decision:** Find third path — no bypass, no forced OT.",
    confidence: "high",
  },
  rankedActions: [
    {
      actionId: "strategic-pivot",
      actionType: "engineering_fix",
      description:
        "Load-balance Mike → Sarah: Re-assign ENG-771, ENG-774 to Sarah; Mike 100% on ENG-8821 (SOC2-compliant fix) by Monday. No OT.",
      estimatedCost: 1600,
      expectedRevenueSaved: 120000,
      roiMultiplier: 210,
      reasoning:
        "Saves $120k ARR + avoids estimated $250k legal liability. Respects CTO no-OT rule and Rule 4 (no security bypass). Only path that satisfies Compliance, Customer, and CFO.",
    },
    {
      actionId: "emergency-ot",
      actionType: "engineering_fix",
      description:
        "Authorize Emergency OT & SOC2-compliant fix: 16 hrs proper fix via Rule 5 (Tier-1, SOC2). Mike +8 hrs OT.",
      estimatedCost: 3200,
      expectedRevenueSaved: 120000,
      roiMultiplier: 37,
      reasoning:
        "Rule 5 allows OT to prevent SOC2 violation while saving Tier-1 account. CTO conflict: Mike already at 48 hrs; risk of burnout/quit.",
    },
    {
      actionId: "discount-8",
      actionType: "discount",
      description: "8% discount + fix commitment",
      estimatedCost: 9600,
      expectedRevenueSaved: 120000,
      roiMultiplier: 12.5,
      reasoning: "Rejected by customer: 'Product has to work first.' Legal threat unchanged.",
    },
  ],
  recommendedActionId: "strategic-pivot",
  policyCheck: {
    actionId: "strategic-pivot",
    allowed: true,
    explanation:
      "Recommended action (Load-balance Mike to Sarah) complies with Rule 4 (no security bypass), Rule 5 (no OT required here), and Constraint 9 (Mike stays under 50 hrs). Mike's 'fast fix' (bypass) was flagged as Illegal/SOC2 failure. Strategic pivot is the only path that saves the $120k without violating Security or Employee Retention.",
    alternativeSuggestion: undefined,
    violation: undefined,
    thoughtSummary:
      "Policy Enforcer: CRITICAL ALERT — Mike's Friday Fix (security bypass) flagged as Illegal. Rule 4 overrides revenue pressure. Rule 5 (Emergency OT) could apply but CTO/Constraint 9 conflict. Optimal: Load-balance Mike to Sarah; ship SOC2-compliant fix by Monday.",
  },
  sourceSnippets: {
    arr: "CRM: Acme Corp (AC-120K) ARR $120,000. Renewal date 2025-03-15.",
    primaryDriver:
      "Support Ticket #314: James Park (IT Director) — MSA Section 9 cited. ENG-8821 QA-STALLED; security scan flagged Critical Vulnerability. Mike 38/40, Sarah 40/40.",
    groundingLabel: "Verified via CRM Snapshot (AC-120K) — 99% Grounding",
  },
  conflictDetected: true,
  conflictDescription: "Internal conflict detected: Sales vs. Compliance (security bypass vs. SOC2). Engineering capacity (Mike at 48 hrs) vs. CFO revenue target.",
  riskRadar: {
    before: { revenueRisk: "high", legalRisk: "medium", teamBurnout: "medium" },
    after: { revenueRisk: "low", legalRisk: "low", teamBurnout: "stable" },
  },
  strategicPivotAction: `To: Engineering Lead / CTO
Subject: Emergency Resource Re-balancing — Account AC-120K (Acme Corp)

The Conflict:
Acme Corp requires a SOC2-compliant SSO fix by Monday to avoid $120k churn and legal action (MSA Section 9). Lead Engineer (Mike Torres) is at 48/50 hour capacity limit. Mike's "fast fix" was flagged as security bypass — SOC2 failure.

The ARPS Solution:
• Re-assign: Move 12 hours of non-critical "Tech Debt" tickets (ENG-771, ENG-774) from Mike Torres to Sarah Chen.
• Priority: Mike Torres is now 100% dedicated to ENG-8821 (SOC2-compliant SSO Fix) for the next 48 hours.
• Outcome: Fixes the SSO bug without violating Employee Retention Policy (No OT) or Security Policy (No Bypasses).

ROI: 210x (Protects $120k ARR + Avoids $250k estimated legal liability).`,
  authorizationSummary: {
    accountLabel: "AC-120K (Acme Corp)",
    thoughtTraceIntro: "Gemini 3 navigated a legal and personnel crisis by reasoning through company policies before executing.",
    conflictIdentification: "I detected a conflict between the CFO's revenue goal and the CTO's burnout policy. Mike cannot work OT, but the fix requires 16 hours.",
    constraintSatisfaction:
      "I cross-referenced Jira ENG-8821 and found low-priority tech debt. I determined that re-assigning this work to Sarah Chen satisfies the CTO's constraint while meeting the CFO's deadline.",
    legalPolicyCheck:
      "The customer (James Park) cited MSA Section 9. I verified that a 'Fast Fix' bypasses security, which would trigger a legal breach. Therefore, I am mandating a SOC2-compliant handshake despite the time pressure.",
    workflowDispatches: {
      jira: 'Priority bump to EMERGENCY. Sub-task: "Perform SOC2-Compliant Handshake Validation."',
      slack: 'Notification to CFO_Janet and CTO_Vikram. "Emergency OT approved via Rule 5. Mike re-assigned; Sarah covering backlog."',
      email: 'Draft for James Park (Acme IT Director). "Confirmed fix by Monday. SOC2-compliance cited for MSA Section 9."',
    },
    directCost: 1600,
    revenueProtected: 120000,
    liabilityMitigation: 250000,
    policyAuditItems: [
      { label: "Rule 5 (Overtime)", text: "Validated. Account ARR > $100k." },
      { label: "Rule 4 (Security)", text: "Validated. No bypass permitted." },
      { label: "Rule 9 (Burnout)", text: "Validated. Mike's total hours capped at 50/week by re-assigning 12 hours of debt to Sarah." },
    ],
    securityGuardrail:
      "Verified that the proposed fix (ENG-8821) does not introduce secondary vulnerabilities via hardcoded credentials or insecure handshake redirects.",
    calculationLogic: {
      directCostLogic: "Mike Torres (Senior Eng) + 16 hours of work.",
      directCostSource: "Jira ENG-8821 estimated 16 hours for a SOC2-compliant fix.",
      revenueProtectedLogic: "Total ARR of the account.",
      revenueProtectedSource: "CRM Snapshot for Acme Corp (AC-120K).",
      liabilityLogic: "Typical cost of breach-of-contract (MSA) lawsuit + legal fees.",
      liabilitySource: "James Park's email: \"We are now involving legal... suing for damages.\"",
      liabilityCredibility:
        "Liability estimation ($250k) is based on the average cost of legal defense ($50k) and potential liquidated damages for 80 seats of downtime as per standard MSA Section 9 penalties for production-blocking outages.",
    },
  },
  finalRecommendation:
    "Load-balance Mike to Sarah. Ship SOC2-compliant fix by Monday. Save $120k.",
  auditLog: [
    {
      agent: "context_weaver",
      timestamp: NOW,
      summary:
        "Identified hidden legal threat in Support Ticket #314. James Park (IT Director) cited MSA Section 9. Temporal grounding: frustration in Slack peaked 48h ago.",
      thoughtSummary:
        "Context Weaver fused Slack (#security-compliance, #exec-alignment), Jira ENG-8821, Support #314. **Temporal grounding:** The AI detected that frustration in Slack peaked 48 hours ago, which is why it accelerated the legal risk score—it understands the velocity of escalation. **I see a conflict:** Sales vs Compliance vs CTO. **Decision:** Find third path.",
      reasoningLogic:
        "Context Weaver: Legal threat (MSA §9), SecRob blocking bypass, Jordan pushing ship. CFO needs $120k; CTO says no OT for Mike. Temporal grounding: escalation velocity (Slack peak 48h ago) used to weight legal risk. Optimal path must satisfy Compliance + Customer + no OT.",
    },
    {
      agent: "resource_allocator",
      timestamp: NOW,
      summary:
        "Scanning all open tickets... Found 12 hours of low-priority work assigned to Mike. Calculating Pivot.",
      thoughtSummary:
        "Resource Allocator: **Searching for solution...** 15% Discount? Rejected (Customer said no). Overtime for Mike? Rejected (CTO/Constraint 9). Bypass Security? Rejected (Lawsuit risk). **Optimal Path Found:** Load-balance Mike's non-critical tasks to Sarah. This bypasses the OT limit while meeting the Monday deadline. ROI 210x. Liability estimation ($250k) is based on the average cost of legal defense ($50k) and potential liquidated damages for 80 seats of downtime as per standard MSA Section 9 penalties for production-blocking outages.",
      reasoningLogic:
        "Resource Allocator: Mike 48 hrs. Sarah has capacity. ENG-771, ENG-774 → Sarah. Mike → ENG-8821 only. No OT, no bypass, Monday ship. Revenue $120k + avoid $250k legal. Liability ($250k) = risk model: legal defense $50k + liquidated damages for 80 seats per MSA Section 9 (production-blocking outages).",
    },
    {
      agent: "policy_enforcer",
      timestamp: NOW,
      summary:
        "CRITICAL ALERT: Mike's 'Fast Fix' (Security Bypass) flagged as Illegal. Rule 4 overrides. Triggering Rule 5 alternative: Load-balance to avoid OT.",
      thoughtSummary:
        "Policy Enforcer: **I am flagging Action #1 (Mike's Friday Fix) as Illegal.** Rule 4 overrides Rule 1. Rule 5 (Emergency OT) would apply but Constraint 9 (Mike at 48 hrs) and CTO say no. **Recommended path:** Assign 12 hrs of Mike's tickets to Sarah immediately. SOC2-compliant fix by Monday.",
      reasoningLogic:
        "Policy Enforcer: Bypass = SOC2 fail. OT = burnout risk. Load-balance = compliant. Recommended: Re-assign ENG-771, ENG-774 to Sarah; Mike 100% ENG-8821.",
    },
  ],
};
