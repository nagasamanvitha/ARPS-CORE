# ARPS-CORE — Architecture (for judges)

## High-level flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER / LEADERSHIP                                  │
│  "Why is this $120k account at risk? What should we do? Is it compliant?"   │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  INPUT LAYER                                                                │
│  • CRM snapshot (CSV/JSON)   • Support ticket   • Slack/email thread       │
│  • ARR, renewal date         • Team capacity    • Policy rules (discount, $)│
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  GEMINI 3 — MULTI-AGENT PIPELINE                                            │
│                                                                             │
│  ┌──────────────────┐    ┌──────────────────────┐    ┌──────────────────┐  │
│  │ CONTEXT WEAVER    │───▶│ RESOURCE ALLOCATOR   │───▶│ POLICY ENFORCER  │  │
│  │ (Gemini 3)        │    │ (Gemini 3, high     │    │ (Gemini 3 Flash) │  │
│  │                   │    │  thinking)           │    │                  │  │
│  │ • Multimodal fuse │    │ • Rank 3 actions     │    │ • Check discount │  │
│  │ • Causal drivers  │    │   by ROI             │    │   cap, budget    │  │
│  │ • Plain-English   │    │ • Counterfactual     │    │ • Allow / reject │  │
│  │   summary         │    │   reasoning          │    │   + alternative  │  │
│  │ • includeThoughts │    │ • responseSchema     │    │ • responseSchema │  │
│  └──────────────────┘    └──────────────────────┘    └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  OUTPUT UI                                                                  │
│  • Revenue Risk Summary   • Ranked actions (ROI)   • Policy compliance      │
│  • Thought signatures     • Audit log (Gemini explanation)                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Gemini 3 usage (technical)

| Component        | Model                     | Config / behavior |
|-----------------|---------------------------|-------------------|
| Context Weaver  | gemini-3-pro-preview or gemini-3-flash-preview | `thinkingLevel: "high"`, `includeThoughts: true`, `responseSchema` (causal JSON). |
| Resource Allocator | Same                     | `thinkingLevel: "high"`, `includeThoughts: true`, `responseSchema` (rankedActions + recommendedActionId). |
| Policy Enforcer | gemini-3-flash-preview   | `responseSchema` (allowed, violation, explanation). No thinking (low latency). |

All agents use **Gemini 3 only** (no 2.x). Structured outputs feed the UI (cards, tables); thought signatures are shown in the sidebar.

## Why this wins (judge view)

- **Technical (40%):** Real app, Gemini 3–only, multi-agent, structured outputs, thought visibility.
- **Impact (20%):** Revenue protection for every SaaS; CRO/CFO pain; scalable.
- **Innovation (30%):** Causal + counterfactual + policy in one flow; not a churn score.
- **Presentation (10%):** Clear problem, 3-min demo, docs, and this architecture.
