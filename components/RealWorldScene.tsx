"use client";

/**
 * Real-world simulation: fake CRM view showing the "red" account
 * before you drop data into ARPS. Sets the demo scene.
 */
export function RealWorldScene() {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/90 p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          CRM — Accounts at risk
        </h2>
        <span className="rounded bg-slate-700/60 px-2 py-1 text-xs text-slate-400">
          Last sync: 2 min ago
        </span>
      </div>

      <div className="overflow-hidden rounded-lg border border-rose-500/30 bg-rose-500/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700/60 bg-slate-800/80">
              <th className="px-4 py-3 font-medium text-slate-400">Account</th>
              <th className="px-4 py-3 font-medium text-slate-400">ARR</th>
              <th className="px-4 py-3 font-medium text-slate-400">Renewal</th>
              <th className="px-4 py-3 font-medium text-slate-400">Health</th>
              <th className="px-4 py-3 font-medium text-slate-400">Churn risk</th>
              <th className="px-4 py-3 font-medium text-slate-400">Why?</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-700/40">
              <td className="px-4 py-3">
                <span className="font-medium text-white">Acme Corp</span>
                <span className="ml-2 text-slate-500">#AC-120K</span>
              </td>
              <td className="px-4 py-3 font-mono text-amber-400">$120,000</td>
              <td className="px-4 py-3 text-slate-300">Mar 15, 2025</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  42
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded bg-rose-500/20 px-2.5 py-0.5 text-xs font-medium text-rose-400">
                  High
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500 italic">—</td>
            </tr>
            <tr className="border-b border-slate-700/40 bg-slate-800/30">
              <td className="px-4 py-3 text-slate-400">Beta Inc</td>
              <td className="px-4 py-3 font-mono text-slate-400">$85,000</td>
              <td className="px-4 py-3 text-slate-400">Apr 01, 2025</td>
              <td className="px-4 py-3">
                <span className="text-xs text-emerald-400">72</span>
              </td>
              <td className="px-4 py-3 text-slate-500">Low</td>
              <td className="px-4 py-3 text-slate-500">—</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-slate-400">Gamma LLC</td>
              <td className="px-4 py-3 font-mono text-slate-400">$200,000</td>
              <td className="px-4 py-3 text-slate-400">May 10, 2025</td>
              <td className="px-4 py-3 text-xs text-slate-400">68</td>
              <td className="px-4 py-3 text-slate-500">Low</td>
              <td className="px-4 py-3 text-slate-500">—</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-center text-sm text-slate-500">
        <span className="text-rose-400">Acme Corp</span> — $120k ARR. Churn predicted, but the team doesn&apos;t know <em>why</em>. Drop CRM + Support + Slack into ARPS below to get a causal explanation and ROI-ranked actions.
      </p>
    </div>
  );
}
