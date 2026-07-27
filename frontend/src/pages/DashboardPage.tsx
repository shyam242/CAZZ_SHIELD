import React, { useEffect, useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  DollarSign,
  Lock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Server,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { useAgentStore } from "../store/agentStore";
import { dashboardApi } from "../lib/dashboard";

export const DashboardPage: React.FC = () => {
  const { agents, fetchAgents } = useAgentStore();
  const [kpis, setKpis] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchAgents({ page: 1, page_size: 100 }),
          dashboardApi.getKPIs().then(setKpis),
          dashboardApi.getCharts().then(setCharts),
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchAgents]);

  const activeAgents = agents.filter((a) => a.status === "active");
  const restrictedAgents = agents.filter((a) => a.status === "paused");
  const quarantinedAgents = agents.filter((a) => a.status === "quarantined");
  const offlineAgents = agents.filter((a) => a.status === "suspended" || a.status === "pending_review");

  const riskDistributionData = charts?.trust_distribution?.map((item: any, index: number) => ({
    name: item.label,
    value: item.count,
    color: ["#10b981", "#f59e0b", "#ef4444", "#9333ea", "#3b82f6"][index] || "#64748b",
  })) || [
    { name: "Low Risk", value: 0, color: "#10b981" },
    { name: "Medium Risk", value: 0, color: "#f59e0b" },
    { name: "High Risk", value: 0, color: "#ef4444" },
    { name: "Critical Risk", value: 0, color: "#9333ea" },
  ];

  const topRiskAgents = agents
    .filter((a) => a.status === "quarantined" || a.status === "paused" || a.riskScore > 60)
    .slice(0, 5);

  const spendTrendData = charts?.audit_timeline?.map((item: any) => ({
    time: item.date,
    spend: item.allowed * 100,
    budget: (item.allowed + item.denied) * 100,
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 font-mono">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            Enterprise Banking Governance Telemetry
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time autonomous control plane telemetry across 2,500 active financial AI agents.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Control Plane: ONLINE
          </span>
          <span className="px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Latency: 1.2ms
          </span>
        </div>
      </div>

      {/* KPI Cards Row 1: Agent Fleet Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-xl bg-[#0f172a] border border-slate-800 p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400">ACTIVE AGENTS</p>
              <h3 className="text-2xl font-bold text-white font-mono mt-1">{activeAgents.length.toLocaleString()}</h3>
              <span className="text-[11px] text-emerald-400 font-mono mt-1 inline-block">
                {((activeAgents.length / agents.length) * 100).toFixed(1)}% of total fleet
              </span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${(activeAgents.length / agents.length) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-xl bg-[#0f172a] border border-slate-800 p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400">RESTRICTED AGENTS</p>
              <h3 className="text-2xl font-bold text-amber-400 font-mono mt-1">{restrictedAgents.length.toLocaleString()}</h3>
              <span className="text-[11px] text-amber-400 font-mono mt-1 inline-block">
                {((restrictedAgents.length / agents.length) * 100).toFixed(1)}% rate limit applied
              </span>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full"
              style={{ width: `${(restrictedAgents.length / agents.length) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-xl bg-[#0f172a] border border-slate-800 p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400">QUARANTINED AGENTS</p>
              <h3 className="text-2xl font-bold text-red-400 font-mono mt-1">{quarantinedAgents.length.toLocaleString()}</h3>
              <span className="text-[11px] text-red-400 font-mono mt-1 inline-block">
                {((quarantinedAgents.length / agents.length) * 100).toFixed(1)}% isolation active
              </span>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-red-500 h-full"
              style={{ width: `${(quarantinedAgents.length / agents.length) * 100}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-xl bg-[#0f172a] border border-slate-800 p-5 shadow-lg relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-mono text-slate-400">OFFLINE AGENTS</p>
              <h3 className="text-2xl font-bold text-slate-400 font-mono mt-1">{offlineAgents.length.toLocaleString()}</h3>
              <span className="text-[11px] text-slate-400 font-mono mt-1 inline-block">
                {((offlineAgents.length / agents.length) * 100).toFixed(1)}% scheduled maintenance
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-800 text-slate-400">
              <Server className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-slate-500 h-full"
              style={{ width: `${(offlineAgents.length / agents.length) * 100}%` }}
            />
          </div>
        </motion.div>
      </div>

      {/* KPI Cards Row 2: Financial & Operational Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl bg-[#0f172a] border border-slate-800 p-4">
          <p className="text-[11px] font-mono text-slate-400">TODAY'S SPEND</p>
          <p className="text-xl font-bold text-white font-mono mt-1">${kpis?.total_spent?.toLocaleString() || '0'}</p>
          <span className="text-[10px] text-emerald-400 font-mono">Budget: ${kpis?.total_budget?.toLocaleString() || '0'}</span>
        </div>
        <div className="rounded-xl bg-[#0f172a] border border-slate-800 p-4">
          <p className="text-[11px] font-mono text-slate-400">BUDGET USAGE</p>
          <p className="text-xl font-bold text-blue-400 font-mono mt-1">{kpis?.budget_utilization?.toFixed(1) || '0'}%</p>
          <span className="text-[10px] text-slate-400 font-mono">Total: ${kpis?.total_budget?.toLocaleString() || '0'}</span>
        </div>
        <div className="rounded-xl bg-[#0f172a] border border-slate-800 p-4">
          <p className="text-[11px] font-mono text-slate-400">POLICY ACCURACY</p>
          <p className="text-xl font-bold text-emerald-400 font-mono mt-1">{kpis?.policy_accuracy?.toFixed(2) || '0'}%</p>
          <span className="text-[10px] text-emerald-400 font-mono">Active: {kpis?.active_policies || 0}</span>
        </div>
        <div className="rounded-xl bg-[#0f172a] border border-slate-800 p-4">
          <p className="text-[11px] font-mono text-slate-400">DECISION LATENCY</p>
          <p className="text-xl font-bold text-indigo-400 font-mono mt-1">{kpis?.avg_decision_latency_ms?.toFixed(1) || '0'} ms</p>
          <span className="text-[10px] text-slate-400 font-mono">System Health: {kpis?.system_health?.toFixed(1) || '0'}%</span>
        </div>
        <div className="rounded-xl bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <p className="text-[11px] font-mono text-slate-400">AUDIT EVENTS (24H)</p>
          <p className="text-xl font-bold text-purple-400 font-mono mt-1">{kpis?.events_today?.toLocaleString() || '0'}</p>
          <span className="text-[10px] text-purple-400 font-mono">Total: {kpis?.total_audit_events?.toLocaleString() || '0'}</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Spend vs Budget Trend Chart */}
        <div className="lg:col-span-8 rounded-xl bg-[#0f172a] border border-slate-800 p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Adaptive Spend vs Budget Cap Telemetry (24H)
              </h3>
              <p className="text-xs text-slate-400 font-mono">Real-time spend velocity against dynamic floor/ceiling caps</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendTrendData}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                  formatter={(val: any) => [`$${val.toLocaleString()}`, "Amount"]}
                />
                <Area type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#spendGrad)" name="Current Spend" />
                <Area type="monotone" dataKey="budget" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#budgetGrad)" name="Budget Cap" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Fleet Risk Distribution */}
        <div className="lg:col-span-4 rounded-xl bg-[#0f172a] border border-slate-800 p-5">
          <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2 mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Fleet Risk Distribution
          </h3>
          <p className="text-xs text-slate-400 font-mono mb-4">Risk scoring across {agents.length} active agents</p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={4}>
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-xs">
            {riskDistributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400">{item.name}:</span>
                <span className="text-white font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Riskiest Agents Table */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 p-5">
        <h3 className="text-sm font-semibold text-white font-mono mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          Top Risk Financial AI Agents
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 px-3">AGENT ID</th>
                <th className="pb-3 px-3">AGENT NAME</th>
                <th className="pb-3 px-3">DEPARTMENT</th>
                <th className="pb-3 px-3">RISK SCORE</th>
                <th className="pb-3 px-3">TRUST SCORE</th>
                <th className="pb-3 px-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topRiskAgents.map((agt) => (
                <tr key={agt.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="py-3 px-3 text-blue-400 font-semibold">{agt.id}</td>
                  <td className="py-3 px-3 text-white">{agt.name}</td>
                  <td className="py-3 px-3 text-slate-300">{agt.department}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-red-400 bg-red-500/10 border border-red-500/30">
                      {agt.riskScore} / 100
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-amber-400 bg-amber-500/10 border border-amber-500/30">
                      {agt.trustScore} / 100
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${
                      agt.status === "Quarantined" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {agt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
