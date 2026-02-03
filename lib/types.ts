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

// --- Full pipeline result ---
export interface ARPSResult {
  causalRisk: CausalRiskResult;
  rankedActions: RankedAction[];
  recommendedActionId: string;
  policyCheck: PolicyCheckResult;
  auditLog: AuditEntry[];
}

export interface AuditEntry {
  agent: "context_weaver" | "resource_allocator" | "policy_enforcer";
  timestamp: string;
  summary: string;
  thoughtSummary?: string;
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
