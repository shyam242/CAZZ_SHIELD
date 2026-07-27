import React from "react";
import { ShieldAlert, AlertTriangle, Zap, Activity, Eye, ShieldCheck, RefreshCw } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { RiskIndicator } from "../components/shared/RiskIndicator";
import { Badge } from "../components/ui/Badge";

const anomalyFeeds = [
  { id: "anom-901", agent: "High-Freq Arbitrage Bot #9", dept: "Treasury", severity: "CRITICAL", anomaly: "Abnormal API payload frequency (450 req/sec vs 10 baseline)", time: "2m ago" },
  { id: "anom-902", agent: "SWIFT Settlement Execution", dept: "Wire Transfers", severity: "HIGH", anomaly: "Unusual destination geolocation (Jurisdiction: Off-shore Non-FATF)", time: "6m ago" },
  { id: "anom-903", agent: "Credit Risk Underwriter v4", dept: "Retail Loans", severity: "MEDIUM", anomaly: "Rapid succession credit score approvals (> 50 in 1 minute)", time: "12m ago" },
];

const riskDistributionData = [
  { category: "Low Risk (0-30)", count: 1850, color: "#10b981" },
  { category: "Medium Risk (31-60)", count: 480, color: "#f59e0b" },
  { category: "High Risk (61-85)", count: 140, color: "#ef4444" },
  { category: "Critical Risk (86-100)", count: 30, color: "#9333ea" },
];

export const RiskEnginePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-400" />
            Autonomous Risk Engine & Anomaly Detector
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time statistical anomaly feeds, velocity violation scoring, and zero-trust auto-remediation.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30">
            Critical Alerts: 3
          </span>
          <span className="px-3 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Anomaly Model: IsolationForest v2.1
          </span>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <p className="text-[11px] font-mono text-slate-400">FLEET AVG RISK SCORE</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">18.4 / 100</p>
          <span className="text-[10px] text-emerald-400 font-mono">-2.1 vs last week</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <p className="text-[11px] font-mono text-slate-400">ANOMALIES DETECTED (24H)</p>
          <p className="text-2xl font-bold text-amber-400 font-mono mt-1">142</p>
          <span className="text-[10px] text-amber-400 font-mono">100% Mitigated by Policy</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <p className="text-[11px] font-mono text-slate-400">AUTO-QUARANTINED</p>
          <p className="text-2xl font-bold text-red-400 font-mono mt-1">14 Agents</p>
          <span className="text-[10px] text-red-400 font-mono">Isolated in sandbox</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <p className="text-[11px] font-mono text-slate-400">REMEDIATION SPEED</p>
          <p className="text-2xl font-bold text-indigo-400 font-mono mt-1">&lt; 0.4 ms</p>
          <span className="text-[10px] text-slate-400 font-mono">Sub-millisecond containment</span>
        </div>
      </div>

      {/* Anomaly Real-time Feed & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Anomaly Feed */}
        <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold font-mono text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            Real-Time Anomaly Stream & Automated Containment
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {anomalyFeeds.map((anom) => (
              <div key={anom.id} className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={anom.severity === "CRITICAL" ? "danger" : anom.severity === "HIGH" ? "warning" : "info"}>
                      {anom.severity}
                    </Badge>
                    <span className="text-white font-semibold">{anom.agent}</span>
                    <span className="text-slate-400">({anom.dept})</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{anom.anomaly}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-400 text-[11px]">{anom.time}</span>
                  <button
                    onClick={() => alert(`Auto-remediating agent ${anom.agent}...`)}
                    className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 rounded text-[11px]"
                  >
                    Contain Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="lg:col-span-4 bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold font-mono text-white mb-3">Agent Fleet Risk Score Breakdown</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistributionData}>
                <XAxis dataKey="category" stroke="#475569" fontSize={9} interval={0} />
                <YAxis stroke="#475569" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "11px" }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
