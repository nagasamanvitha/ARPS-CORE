// Pre-built demo result so the public link works for judges without API key or quota.
// Matches the default Acme Corp scenario. Use "See demo result" when API is unavailable.
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
    rulesDescription: "Max 15% discount without VP approval.",
  },
};

export const DEMO_RESULT: ARPSResult = {
  causalRisk: {
    primaryDriver: "Critical production-blocking technical issue (SSO timeout) blocking 80 users for 19+ days.",
    secondaryDrivers: [
      "Prolonged resolution time for high-priority ticket #314",
      "Internal resource constraints and lack of engineering prioritization",
      "Explicit customer threat to evaluate alternatives due to product instability",
      "Proximity to renewal date (60 days) with unresolved core functionality",
    ],
    plainEnglishSummary:
      "Acme Corp is at high risk because a critical SSO failure has blocked 80 users for nearly three weeks, leading the IT Director to explicitly pause renewal commitments until the platform is functional. While a fix is now in QA, the prolonged downtime and perceived lack of urgency have severely damaged trust and prompted the customer to evaluate competitors just two months before their $120k renewal.",
    thoughtSummary:
      "Context Weaver fused CRM, support ticket, and Slack thread. Primary cause: unresolved SSO bug (ticket #314, 19 days). Secondary: delayed CS follow-up, workload imbalance. Timeline ordered causally: bug → delay → threat → renewal at risk.",
    confidence: "high",
  },
  rankedActions: [
    {
      actionId: "eng-fix",
      actionType: "engineering_fix",
      description: "Expedite SSO fix (already in QA); assign owner and ship by Friday",
      estimatedCost: 800,
      expectedRevenueSaved: 120000,
      roiMultiplier: 150,
      reasoning: "Addresses primary driver and restores trust. Higher ROI than discount because it fixes the root cause.",
    },
    {
      actionId: "discount-8",
      actionType: "discount",
      description: "8% discount (within policy) + commitment to fix timeline",
      estimatedCost: 9600,
      expectedRevenueSaved: 120000,
      roiMultiplier: 12.5,
      reasoning: "Within 15% cap; pairs well with fix but does not solve the product issue alone.",
    },
    {
      actionId: "training",
      actionType: "free_training",
      description: "Free training session + dedicated CSM check-in",
      estimatedCost: 500,
      expectedRevenueSaved: 40000,
      roiMultiplier: 80,
      reasoning: "Builds relationship but does not fix SSO. Lower expected revenue saved.",
    },
  ],
  recommendedActionId: "eng-fix",
  policyCheck: {
    actionId: "eng-fix",
    allowed: true,
    explanation:
      "Expediting the SSO fix is within budget ($800 < $10k cap) and does not violate discount or team capacity policy. Recommended action is compliant.",
    alternativeSuggestion: undefined,
    violation: undefined,
  },
  auditLog: [
    {
      agent: "context_weaver",
      timestamp: new Date().toISOString(),
      summary: "Acme Corp is at high risk because a critical SSO failure has blocked 80 users for nearly three weeks...",
      thoughtSummary: "Context Weaver fused CRM, support ticket, and Slack thread. Primary cause: unresolved SSO bug (ticket #314, 19 days).",
    },
    {
      agent: "resource_allocator",
      timestamp: new Date().toISOString(),
      summary: "Recommended: eng-fix. Ranked 3 actions by ROI. Engineering fix has 150x ROI.",
      thoughtSummary: "Resource Allocator compared discount vs fix vs training. Counterfactual: discount does not fix bug; fix addresses root cause and saves renewal.",
    },
    {
      agent: "policy_enforcer",
      timestamp: new Date().toISOString(),
      summary: "Expediting the SSO fix is within budget and does not violate discount or team capacity policy.",
    },
  ],
};
