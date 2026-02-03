# ARPS-CORE

**The World's First Causal, ROI-Aware Revenue Protection Agent**

Not a dashboard. Not a churn score. ARPS-CORE explains **why** revenue is at risk, **what action** saves the most money, and **why that action is compliant** — using Gemini reasoning.

---

## One-line pitch (for judges)

> **"ARPS doesn't predict churn — it decides how to save revenue using causal reasoning and ROI optimization."**

---

## What you build (single flow)

**Scenario:** A $120k ARR customer is at renewal risk. Leadership needs to know:
1. **Why** the account is at risk (causal explanation)
2. **What to do** (ranked actions by ROI)
3. **Why that action is compliant** (policy check)

---

## System components

### 1. Input layer

- **CRM account snapshot** (CSV or JSON paste)
- **Support ticket / conversation** (paste)
- **Slack or email thread** (paste)
- **Account ARR + renewal date**
- **Team capacity** (CS agents, engineers, available hours)
- **Policy rules** (discount cap %, budget cap $, optional description)

### 2. Gemini = the brain (three agents)

| Agent | Role | Gemini use |
|-------|------|------------|
| **Context Weaver** | Causal risk reasoning | Multimodal fusion, `includeThoughts`, `thinkingLevel: "high"` |
| **Resource Allocator** | ROI-based action ranking | **`thinkingLevel: "high"`** (ROI reasoning), structured JSON |
| **Policy Enforcer** | Constraint check | Structured JSON, Gemini 3 Flash |

- **Context Weaver:** Reads CRM + support + Slack together → primary + secondary drivers → plain-English summary.
- **Resource Allocator:** Ranks 3 actions (e.g. discount vs training vs engineering fix) by expected ROI; recommends best.
- **Policy Enforcer:** Checks discount cap, budget cap, team overload → allowed / violation + alternative.

### 3. Output UI

- **Revenue risk summary** (primary driver, contributors, plain-English)
- **“Why this account is at risk”** (causal explanation)
- **Ranked actions with ROI** (cost, revenue saved, ROI multiplier)
- **Policy compliance** (allowed / violation / alternative)
- **Thought signatures** (Gemini reasoning per agent, expandable sidebar)
- **Audit log** (Gemini explanation per step)

---

## Gemini integration (for judges)

- **Causal reasoning, not generation:** Context Weaver fuses CRM, support, and comms to explain *why*.
- **Counterfactual ROI reasoning:** Resource Allocator uses **high thinking budget** for ROI comparison.
- **Policy-constrained decisions:** Policy Enforcer rejects invalid actions and suggests alternatives.
- **Structured outputs:** `responseMimeType: "application/json"` + `responseSchema` for UI-ready data.
- **Thought signatures:** `includeThoughts: true` for reasoning visibility and multi-turn context.

---

## Run locally

1. **Clone and install**
   ```bash
   cd gemini3
   npm install
   ```

2. **Set API key**
   - Copy `.env.local.example` to `.env.local`
   - Add your [Google AI Studio](https://aistudio.google.com/apikey) key:
   ```bash
   GEMINI_API_KEY=your_key_here
   ```

3. **Dev server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

4. **Build for production (e.g. Netlify)**
   ```bash
   npm run build
   npm run start
   ```

---

## Demo script (3 minutes)

| Time | Scene | Action |
|------|--------|--------|
| 0:00–0:45 | **The pain** | Show a “red” $120k account; “churn predicted but team doesn’t know why.” |
| 0:45–1:45 | **The reasoning** | Paste CRM + support + Slack into ARPS; show Context Weaver pulling the real reason from the noise. |
| 1:45–2:30 | **The decision** | Click “Solve”; show Resource Allocator thinking (spinner), ROI comparison, Policy Enforcer check. |
| 2:30–3:00 | **The win** | “ARPS-CORE just saved $100k with a reasoning-based decision, not a guess.” |

---

## Tech stack

- **Next.js 14** (App Router), **React 18**, **TypeScript**
- **@google/genai** — Gemini 3 only (gemini-3-pro-preview / gemini-3-flash-preview)
- **Tailwind CSS** for UI
- Deploy on **Netlify** or **Vercel** (serverless-friendly; solve runs in-process, no self-fetch)

---

## Devpost submission (Gemini 3 Hackathon)

- **200-word Gemini Integration** + **submission checklist** + **3-min video script** + **judging alignment:** see **[DEVPOST.md](./DEVPOST.md)**.
- **Architecture diagram** (for judges): see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

---

## License

MIT.
