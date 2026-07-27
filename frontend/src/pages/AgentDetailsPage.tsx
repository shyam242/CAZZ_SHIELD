import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShieldAlert,
  Activity,
  DollarSign,
  Lock,
  History,
  Terminal,
  Cpu,
  Database,
  Globe,
  AlertOctagon,
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  Key,
} from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { TrustGauge } from "../components/shared/TrustGauge";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useAgentStore } from "../store/agentStore";

const trustTimeline = [
  { time: "09:00", score: 92, violationPenalty: 0 },
  { time: "10:00", score: 89, violationPenalty: -3 },
  { time: "11:00", score: 85, violationPenalty: -4 },
  { time: "12:00", score: 72, violationPenalty: -13 },
  { time: "13:00", score: 78, violationPenalty: +6 },
  { time: "14:00", score: 84, violationPenalty: +6 },
];

const budgetTimeline = [
  { time: "09:00", spent: 1200, cap: 10000 },
  { time: "10:00", spent: 3400, cap: 10000 },
  { time: "11:00", spent: 5800, cap: 10000 },
  { time: "12:00", spent: 8900, cap: 10000 },
  { time: "13:00", spent: 9400, cap: 10000 },
  { time: "14:00", spent: 9800, cap: 10000 },
];

export const AgentDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const agentId = id || "agt-1001";

  const { agents, quarantineAgent, restrictAgent, resumeAgent } = useAgentStore();
  const agentData = agents.find((a) => a.id === agentId || a.uuid === agentId);

  const [activeTab, setActiveTab] = useState<"overview" | "trust" | "budget" | "policies" | "audit" | "emergency">("overview");

  const currentStatus = agentData?.status || "Active";
  const trustScore = agentData?.trustScore || 78;
  const riskScore = agentData?.riskScore || 22;
  const agentName = agentData?.name || "SWIFT High-Value Transfer Bot";
  const deptName = agentData?.department || "Treasury Operations";
  const ownerName = agentData?.owner || "SRE-Treasury-Team";

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/agents")}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold font-mono text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            Agent Detail View: <span className="text-blue-400">{agentId}</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            {agentName} • Department: {deptName}
          </p>
        </div>
      </div>

      {/* Main Agent Header Card */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 flex items-center gap-4">
          <TrustGauge score={trustScore} size={90} label="Trust Score" />
          <div>
            <h2 className="text-base font-semibold text-white">{agentName}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Department: {deptName}</p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant={currentStatus === "Active" ? "success" : currentStatus === "Restricted" ? "warning" : currentStatus === "Quarantined" ? "danger" : "neutral"} dot>
                {currentStatus}
              </Badge>
              <span className="text-[11px] text-slate-400 font-mono">Owner: {ownerName}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
            <p className="text-[10px] text-slate-400 font-mono">DAILY BUDGET</p>
            <p className="text-sm font-bold text-white font-mono mt-1">$9,800 / $10,000</p>
            <span className="text-[10px] text-amber-400 font-mono">98% Limit reached</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
            <p className="text-[10px] text-slate-400 font-mono">RISK RATING</p>
            <p className="text-sm font-bold text-amber-400 font-mono mt-1">{riskScore} / 100</p>
            <span className="text-[10px] text-emerald-400 font-mono">Real-time telemetry</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
            <p className="text-[10px] text-slate-400 font-mono">PERMISSIONS</p>
            <p className="text-sm font-bold text-blue-400 font-mono mt-1">14 Granted</p>
            <span className="text-[10px] text-slate-400 font-mono">2 Conditional</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80">
            <p className="text-[10px] text-slate-400 font-mono">LAST ACTIVITY</p>
            <p className="text-sm font-bold text-emerald-400 font-mono mt-1">2s ago</p>
            <span className="text-[10px] text-slate-400 font-mono">SWIFT Exec</span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-800 gap-4 font-mono text-xs overflow-x-auto">
        {["overview", "trust", "budget", "policies", "audit", "emergency"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3 px-1 capitalize transition-colors border-b-2 font-medium ${
              activeTab === tab
                ? "border-blue-500 text-blue-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trust Timeline Chart */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
              <h3 className="text-xs font-mono font-semibold text-white mb-3">Trust Evolution Timeline (24H)</h3>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trustTimeline}>
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                    <YAxis domain={[50, 100]} stroke="#475569" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "11px" }} />
                    <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Trust Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Budget Timeline Chart */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
              <h3 className="text-xs font-mono font-semibold text-white mb-3">Budget Utilization Curve ($)</h3>
              <div className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={budgetTimeline}>
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                    <YAxis stroke="#475569" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "11px" }} />
                    <Area type="monotone" dataKey="spent" stroke="#3b82f6" fill="#3b82f620" strokeWidth={2} name="Spent Budget" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Connected Systems & Integrations */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
              <h4 className="text-slate-200 font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Connected APIs (3)
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>SWIFT Alliance Gateway v2.4</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </li>
                <li className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>Fedwire ISO20022 REST Endpoint</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </li>
                <li className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>FinCEN Sanctions Screening API</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
              <h4 className="text-slate-200 font-semibold mb-3 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                Connected Enterprise Accounts (2)
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>JPMorgan Settlement Acct #8841</span>
                  <span className="text-slate-400">$45.2M Pool</span>
                </li>
                <li className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>BNY Mellon Liquidity Reserve</span>
                  <span className="text-slate-400">$120M Pool</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
              <h4 className="text-slate-200 font-semibold mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-purple-400" />
                Connected Vendors (2)
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>Anthropic Claude 3.5 Sonnet Agent</span>
                  <span className="text-blue-400">LLM Provider</span>
                </li>
                <li className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                  <span>OpenAI GPT-4o Risk Evaluator</span>
                  <span className="text-blue-400 font-mono">LLM Provider</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "emergency" && (
        <div className="bg-[#0f172a] border border-red-500/40 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3 text-red-400 border-b border-slate-800 pb-4">
            <AlertOctagon className="w-6 h-6" />
            <div>
              <h3 className="text-base font-bold font-mono">Agent Emergency Control & Isolation Matrix</h3>
              <p className="text-xs text-slate-400">Target Agent: {agentId} • Actions take immediate real-time effect in control plane.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="danger"
              className="py-4 font-mono text-xs flex-col gap-2"
              onClick={() => quarantineAgent(agentId)}
            >
              <ShieldAlert className="w-6 h-6" />
              <span>Quarantine Agent</span>
            </Button>

            <Button
              variant="warning"
              className="py-4 font-mono text-xs flex-col gap-2"
              onClick={() => restrictAgent(agentId)}
            >
              <Activity className="w-6 h-6" />
              <span>Restrict Execution</span>
            </Button>

            <Button
              variant="outline"
              className="py-4 font-mono text-xs flex-col gap-2 border-red-500/40 text-red-400 hover:bg-red-500/10"
              onClick={() => alert(`JWT API Bearer Tokens revoked for agent ${agentId}.`)}
            >
              <Key className="w-6 h-6" />
              <span>Revoke Bearer Tokens</span>
            </Button>

            <Button
              variant="primary"
              className="py-4 font-mono text-xs flex-col gap-2"
              onClick={() => resumeAgent(agentId)}
            >
              <RefreshCw className="w-6 h-6" />
              <span>Resume Operations</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
