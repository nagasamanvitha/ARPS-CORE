# Gemini 3 Hackathon — Devpost Submission Guide for ARPS-CORE

Use this file to fill out your Devpost project page and maximize your score.

---

## 1. Text description: Gemini Integration (~200 words)

**Copy-paste this into the "Text description describing the Gemini Integration" field on Devpost:**

---

ARPS-CORE uses **Gemini 3** as the sole reasoning engine for causal revenue protection. It is built around three specialized agents, each dependent on Gemini 3.

**Context Weaver (Gemini 3 Pro/Flash):** We fuse CRM account data, support ticket threads, and Slack/email exports into a single context. Gemini 3 performs **multimodal fusion** and **causal reasoning**—not churn scoring—to identify the *primary* risk driver and contributing factors, with **temporal understanding** of events (e.g. “19-day open ticket → renewal threat”). Output is structured JSON plus **thought signatures** (`includeThoughts: true`) so judges see the model’s reasoning in the sidebar.

**Resource Allocator (Gemini 3, thinking_level: high):** We pass the causal summary and ask Gemini 3 to rank three actions (discount vs training vs engineering fix) by **expected ROI**. The model performs **counterfactual reasoning** (“a discount doesn’t fix the SSO bug; expediting the fix has higher ROI”) and returns ranked actions via **structured output** (`responseSchema`). This cannot be done with GPT-3-style next-token prediction.

**Policy Enforcer (Gemini 3 Flash):** The chosen action is checked against discount caps, budget caps, and team capacity. Gemini 3 returns allowed/violation/alternative as structured JSON—**policy-aware decisions** without hard-coded rules.

Without Gemini 3’s advanced reasoning, multimodal fusion, and structured outputs, ARPS-CORE collapses. We use only the Gemini 3 API (gemini-3-pro-preview, gemini-3-flash-preview).

---

*(Word count: ~200)*

---

## 2. Submission checklist

- [ ] **Public project link** — Deploy to Vercel or Netlify; use the live URL. No login/paywall. Add `GEMINI_API_KEY` in the host’s env vars.
- [ ] **Public code repository** — Push to GitHub; set repo to Public. Do **not** commit `.env.local` or any API keys.
- [ ] **~3-minute demo video** — Record screen + voice. Follow the script below. Upload to YouTube (unlisted OK) and paste link on Devpost.
- [ ] **Gemini Integration text** — Paste the 200-word block above into the required field.

---

## 3. Public deployment (for “Public Project Link”)

**Vercel (recommended):**
1. Push code to a public GitHub repo.
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo.
3. Add Environment Variable: `GEMINI_API_KEY` = your key.
4. Deploy. Use the generated URL (e.g. `https://arps-core-xxx.vercel.app`) as the Public Project Link.

**Netlify:**
1. Push to GitHub.
2. Netlify → Add new site → Import from Git.
3. Build command: `npm run build`. Publish directory: `.next` (or use Next.js preset).
4. Site settings → Environment variables → Add `GEMINI_API_KEY`.
5. Deploy. Use the Netlify URL as the Public Project Link.

**Important:** The live app must work when judges click “Solve” (if API key is missing or quota exceeded, judges can click "See demo result (no API)" to view the full flow without calling the API. So the Public Project Link never shows a dead screen.

---

## 4. Three-minute demonstration video script

| Time | What to show / say |
|------|---------------------|
| **0:00–0:30** | “ARPS-CORE: the world’s first causal, ROI-aware revenue protection agent. It doesn’t predict churn—it decides *how* to save revenue using Gemini 3.” Show the app: CRM table with Acme Corp, $120k, at risk, ‘Why?’ blank. |
| **0:30–1:00** | “This $120k account is at risk; the team doesn’t know why.” Scroll to the input panel. “We drop real-world data: CRM export, support ticket, Slack thread—like from Salesforce, Zendesk, Slack.” Point at the pre-filled data. |
| **1:00–1:45** | Click **Solve**. “Gemini 3 runs three agents: Context Weaver, Resource Allocator, Policy Enforcer.” Show the thinking spinner, then the **Revenue Risk Summary** and the causal explanation. “The model found the real cause: SSO failure, 19 days open, customer threatening to leave.” |
| **1:45–2:25** | Scroll to **Ranked actions by ROI**. “Resource Allocator used high reasoning to compare discount vs fix vs training and picked the best ROI.” Show the recommended action and Policy Compliance. “Policy Enforcer checked discount cap and budget—governance built in.” |
| **2:25–3:00** | Open the **Thought signatures** sidebar. “Judges can see Gemini 3’s reasoning per agent.” End with: “ARPS-CORE just turned one red account into a clear, compliant action plan. That’s the future of revenue protection—powered by Gemini 3.” |

---

## 5. Judging criteria alignment (how you score)

| Criterion | Weight | How ARPS-CORE addresses it |
|-----------|--------|-----------------------------|
| **Technical Execution** | 40% | Full Next.js app; **only Gemini 3** (pro/flash); three agents with structured JSON and thought signatures; clean code; working Solve flow. |
| **Potential Impact** | 20% | Every SaaS has renewal risk; CRO/CFO pain; scales SME → enterprise; “save $100k” story. |
| **Innovation / Wow** | 30% | Causal + ROI + policy in one flow; not “another churn score”; counterfactual reasoning; thought signatures visible. |
| **Presentation / Demo** | 10% | README + ARCHITECTURE.md; 3-min video script; 200-word Gemini write-up; public link + repo. |

---

## 6. One-line pitch (for project title / tagline)

**ARPS-CORE:** Causal, ROI-aware revenue protection — powered by Gemini 3.

**Tagline:** “ARPS doesn’t predict churn—it decides how to save revenue.”

---

## 7. Suggested Devpost project fields

- **Tagline:** Causal, ROI-aware revenue protection with Gemini 3.
- **Built with:** Next.js, Gemini 3 API (@google/genai), TypeScript, Tailwind.
- **Categories:** AI/ML, Productivity, Social Good (revenue retention → jobs/stability).
- **Links:** Public app URL | Public GitHub repo URL | 3-min video URL.

---

## 8. Pre-submit checklist (must win)

Before you hit Submit on Devpost, verify:

| Check | Why it matters |
|-------|-----------------|
| **Public link works** | Open the deployed URL in an incognito window. Click **"See demo result (no API)"** — you must see Risk Summary, Ranked actions, Policy compliance, Thought signatures. No login, no paywall. |
| **No API key in repo** | `git status` and repo file list: `.env.local` and any file with your key must **not** be committed. Use `.gitignore` (already has `.env.local`). |
| **README has Gemini 3** | First paragraph of README mentions "Gemini 3" and the one-line pitch. Judges skim this. |
| **Video ≤ 3 min** | Judges may not watch beyond 3 minutes. Use the script in §4; trim if needed. |
| **200-word text pasted** | The "Text description describing the Gemini Integration" field on Devpost must contain the ~200-word block from §1. |
| **Repo is Public** | GitHub repo visibility = Public so judges can open the code link. |

---

## 9. Is this app "must win"? What to modify?

**Honest answer:** No submission is guaranteed to win. This app is **strong** on:

- **Technical (40%):** Gemini 3 only, multi-agent, structured outputs, thought signatures, demo mode so the link always works.
- **Impact (20%):** Clear CRO/CFO pain; every SaaS has renewal risk.
- **Innovation (30%):** Causal + counterfactual + policy; not a churn score.
- **Presentation (10%):** README, ARCHITECTURE.md, DEVPOST script, 200-word write-up, demo mode.

**If you want to strengthen further:**

1. **Video:** Record when the **real** Solve works (with API key). Show the spinner, then the result. Then say: "If the API is unavailable, judges can use Demo mode to see the same flow." So judges see both live Gemini 3 and a fallback.
2. **Repo description:** On GitHub, set the repo description to: "ARPS-CORE: Causal, ROI-aware revenue protection — Gemini 3 Hackathon."
3. **Screenshot:** Add one screenshot of the full result (Risk Summary + Ranked actions + Thought signatures) to the README so judges see the UI without running the app.

**Do not:** Add scope (e.g. full CRM integration, billing). The brief asked for one powerful flow; you have it. More scope = more to break and more to explain.

Good luck. Make it win.
