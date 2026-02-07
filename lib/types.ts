// ARPS-CORE types — inputs and agent outputs

export interface CRMAccount {
  accountId: string;
  accountName: string;
  arr: number;
  renewalDate: string;
  healthScore?: string;
  lastContact?: string;
  notes?: string;
  [key: string]: unknown;
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: string;
  createdAt: string;
  messages: { role: string; text: string }[];
}

export interface PolicyRules {
  discountCapPercent: number;
  budgetCapDollars: number;
  maxEngineerHoursPerAccount?: number;
  rulesDescription?: string;
}

export interface TeamCapacity {
  csAgents: number;
  engineers: number;
  availableHoursThisWeek?: number;
}

// --- Context Weaver output ---
export interface CausalRiskResult {
  primaryDriver: string;
  secondaryDrivers: string[];
  plainEnglishSummary: string;
  thoughtSummary?: string;
  confidence: "high" | "medium" | "low";
  /** Set when internal conflict detected (e.g. Sales vs Compliance vs Engineering). */
  conflictDetected?: boolean;
  conflictDescription?: string;
}

// --- Resource Allocator output (ROI) ---
export interface RankedAction {
  actionId: string;
  actionType: "discount" | "free_training" | "engineering_fix" | "dedicated_success" | "custom";
  description: string;
  estimatedCost: number;
  expectedRevenueSaved: number;
  roiMultiplier: number;
  reasoning: string;
}

export interface ResourceAllocatorResult {
  rankedActions: RankedAction[];
  recommendedActionId: string;
  thoughtSummary?: string;
  /** Full text of re-balancing email for "Execute Strategic Pivot" (when triple conflict). */
  strategicPivotAction?: string;
}

// --- Policy Enforcer output ---
export interface PolicyCheckResult {
  actionId: string;
  allowed: boolean;
  violation?: string;
  alternativeSuggestion?: string;
  explanation: string;
  thoughtSummary?: string;
}

/** Optional RAG/source snippets to show on hover (Verify the AI). */
export interface SourceSnippets {
  arr?: string;
  primaryDriver?: string;
  /** e.g. "Verified via CRM Snapshot (AC-120K) - 99% Grounding" */
  groundingLabel?: string;
}

/** Before/After risk levels for Risk Radar. */
export interface RiskRadarLevels {
  revenueRisk: "high" | "medium" | "low";
  legalRisk: "high" | "medium" | "low";
  teamBurnout: "high" | "medium" | "low" | "stable";
}

export interface RiskRadar {
  before: RiskRadarLevels;
  after: RiskRadarLevels;
}

/** Authorization Summary modal content (built from API context when conflict detected). */
export interface AuthorizationSummary {
  accountLabel: string;
  thoughtTraceIntro?: string;
  conflictIdentification: string;
  constraintSatisfaction: string;
  legalPolicyCheck: string;
  workflowDispatches: { jira: string; slack: string; email: string };
  directCost: number;
  revenueProtected: number;
  liabilityMitigation: number;
  policyAuditItems: { label: string; text: string }[];
  securityGuardrail: string;
  /** Optional View Math breakdown (source/logic for each number). */
  calculationLogic?: {
    directCostLogic?: string;
    directCostSource?: string;
    revenueProtectedLogic?: string;
    revenueProtectedSource?: string;
    liabilityLogic?: string;
    liabilitySource?: string;
    liabilityCredibility?: string;
  };
}

// --- Full pipeline result ---
export interface ARPSResult {
  causalRisk: CausalRiskResult;
  rankedActions: RankedAction[];
  recommendedActionId: string;
  policyCheck: PolicyCheckResult;
  auditLog: AuditEntry[];
  sourceSnippets?: SourceSnippets;
  /** Internal conflict detected (e.g. Sales vs. Compliance) — show Conflict Alert. */
  conflictDetected?: boolean;
  conflictDescription?: string;
  /** Risk Radar: Before ARPS vs After ARPS. */
  riskRadar?: RiskRadar;
  /** Strategic pivot action (e.g. Jira re-assignment email) for "Execute Strategic Pivot". */
  strategicPivotAction?: string;
  /** One-line final recommendation for audit display. */
  finalRecommendation?: string;
  /** Authorization Summary modal content (built from context when conflict). Not hardcoded. */
  authorizationSummary?: AuthorizationSummary;
}

export interface AuditEntry {
  agent: "context_weaver" | "resource_allocator" | "policy_enforcer";
  timestamp: string;
  summary: string;
  thoughtSummary?: string;
  /** Internal debate / reasoning logic (e.g. "Considering X. Rejected. Pivoting to Y.") */
  reasoningLogic?: string;
}

export interface SolveInput {
  crmSnapshot: string;       // CSV or JSON text
  supportConversation: string;
  slackOrEmailConversation: string;
  arr: number;
  renewalDate: string;
  teamCapacity: TeamCapacity;
  policyRules: PolicyRules;
}
