import React, { useState, useEffect } from "react";
import { ShieldCheck, TrendingUp, AlertTriangle, UserCheck, Clock, Zap, RefreshCw } from "lucide-react";
import { TrustGauge } from "../components/shared/TrustGauge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { Badge } from "../components/ui/Badge";
import { approvalsApi, ApprovalRequest } from "../lib/approvals";

const trustFormulaData = [
  { metric: "Alpha (Success Weight)", value: "0.05", desc: "+0.05 trust score increment per verified autonomous transaction" },
  { metric: "Beta (Human Approval)", value: "0.03", desc: "+0.03 boost for manual compliance officer override verification" },
  { metric: "Gamma (Violation Penalty)", value: "0.15", desc: "-0.15 severe trust deduction for policy sandbox violations" },
  { metric: "Delta (Anomaly Penalty)", value: "0.08", desc: "-0.08 deduction for statistical behavior deviations" },
  { metric: "Decay Rate", value: "0.001 / hr", desc: "Time-based linear trust decay rate without active execution" },
];

const trustEvolutionData = [
  { hour: "00:00", avgTrust: 88, violations: 0 },
  { hour: "04:00", avgTrust: 87, violations: 1 },
  { hour: "08:00", avgTrust: 85, violations: 3 },
  { hour: "12:00", avgTrust: 79, violations: 8 },
  { hour: "16:00", avgTrust: 83, violations: 4 },
  { hour: "20:00", avgTrust: 89, violations: 0 },
  { hour: "24:00", avgTrust: 91, violations: 0 },
];

export const TrustEnginePage: React.FC = () => {
  const [approvalQueue, setApprovalQueue] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovalQueue();
  }, []);

  const fetchApprovalQueue = async () => {
    try {
      setLoading(true);
      const data = await approvalsApi.getQueue({ status: 'pending', page_size: 10 });
      setApprovalQueue(data.approvals);
    } catch (error) {
      console.error('Failed to fetch approval queue:', error);
      // Fallback to mock data if API fails
      setApprovalQueue([
        { id: "mock-1", request_id: "appr-881", agent_id: "agent-001", agent_name: "SWIFT High-Value Wire Agent", requested_operation: "Wire Transfer $450,000 to Deutsche Bank Clearing", trust_before: 0.68, trust_after: null, confidence_before: 0.85, confidence_after: null, status: "pending", priority: "high", requested_by: "system", approved_by: null, rejection_reason: null, action_id: null, policy_id: null, created_at: new Date().toISOString(), reviewed_at: null, expires_at: null, time_ago: "3m ago" },
        { id: "mock-2", request_id: "appr-882", agent_id: "agent-002", agent_name: "FX Hedging Agent Gamma", requested_operation: "Open Derivatives Position $1.2M", trust_before: 0.64, trust_after: null, confidence_before: 0.78, confidence_after: null, status: "pending", priority: "high", requested_by: "system", approved_by: null, rejection_reason: null, action_id: null, policy_id: null, created_at: new Date().toISOString(), reviewed_at: null, expires_at: null, time_ago: "7m ago" },
        { id: "mock-3", request_id: "appr-883", agent_id: "agent-003", agent_name: "Credit Loan Underwriter #4", requested_operation: "Approve Commercial Line Increase $850k", trust_before: 0.71, trust_after: null, confidence_before: 0.82, confidence_after: null, status: "approved", priority: "medium", requested_by: "system", approved_by: "compliance@cazzbank.com", rejection_reason: null, action_id: null, policy_id: null, created_at: new Date().toISOString(), reviewed_at: new Date().toISOString(), expires_at: null, time_ago: "14m ago" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setProcessing(requestId);
      const result = await approvalsApi.processAction(requestId, true);
      console.log('Approval result:', result);
      // Refresh the queue after approval
      await fetchApprovalQueue();
      alert(`Approved ${requestId} - Trust boosted by +${result.trust_after && result.trust_before ? (result.trust_after - result.trust_before).toFixed(4) : '0.03'}`);
    } catch (error) {
      console.error('Failed to approve request:', error);
      alert('Failed to approve request. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Autonomous Trust Engine & Scoring Matrix
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Dynamic cryptographic trust formula calculating real-time trust scores with time decay and human-in-the-loop approvals.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Fleet Avg Trust: 84.6 / 100
          </span>
          <span className="px-3 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Min Confidence N: 30
          </span>
        </div>
      </div>

      {/* Top Formula & Gauges Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Mathematical Trust Formula Card */}
        <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-xl">
          <h3 className="text-sm font-semibold font-mono text-white mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Mathematical Trust Score Calculation Formula
          </h3>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-blue-300 mb-4">
            {"T(t) = T_base + \\alpha \\cdot S_{success} + \\beta \\cdot H_{approval} - \\gamma \\cdot V_{violation} - \\delta \\cdot A_{anomaly} - \\lambda \\cdot \\Delta t"}
          </div>
          <div className="space-y-2 font-mono text-xs">
            {trustFormulaData.map((item) => (
              <div key={item.metric} className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded flex justify-between items-center">
                <div>
                  <span className="text-white font-semibold">{item.metric}</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
                <span className="text-emerald-400 font-bold px-2 py-1 bg-slate-800 rounded">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Fleet Trust Distribution Gauge */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <TrustGauge score={84.6} size={150} label="Fleet Average Trust" />
          <div className="mt-4 font-mono text-xs text-slate-400 space-y-1">
            <p className="text-emerald-400 font-semibold">Self-Healing Confidence Level: HIGH</p>
            <p>2,120 Agents with Trust &gt; 75.0 (Authorized for Unattended Execution)</p>
            <p className="text-amber-400">380 Agents Under Restricted Guardrails (Trust 40 - 74)</p>
          </div>
        </div>
      </div>

      {/* Trust Evolution Chart */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold font-mono text-white mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          Fleet Trust Evolution & Violation Recovery Curve (24H)
        </h3>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trustEvolutionData}>
              <XAxis dataKey="hour" stroke="#475569" fontSize={11} />
              <YAxis domain={[60, 100]} stroke="#475569" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "12px" }} />
              <Area type="monotone" dataKey="avgTrust" stroke="#10b981" fill="#10b98120" strokeWidth={2} name="Avg Fleet Trust" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Human Approvals & Trust Recovery Log */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold font-mono text-white mb-3 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-blue-400" />
          Human-in-the-Loop Trust Approval Queue
        </h3>
        {loading ? (
          <div className="text-center py-8 text-slate-400 font-mono text-xs">Loading approval queue...</div>
        ) : (
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">REQ ID</th>
                  <th className="py-2.5 px-3">AGENT NAME</th>
                  <th className="py-2.5 px-3">REQUESTED OPERATION</th>
                  <th className="py-2.5 px-3">PRE-TRUST SCORE</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {approvalQueue.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">No pending approval requests</td>
                  </tr>
                ) : (
                  approvalQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/60">
                      <td className="py-3 px-3 text-blue-400 font-semibold">{item.request_id}</td>
                      <td className="py-3 px-3 text-white">{item.agent_name}</td>
                      <td className="py-3 px-3 text-slate-300">{item.requested_operation}</td>
                      <td className="py-3 px-3 text-amber-400 font-semibold">{(item.trust_before * 100).toFixed(0)}/100</td>
                      <td className="py-3 px-3">
                        <Badge variant={item.status === "pending" ? "warning" : item.status === "approved" ? "success" : "danger"}>
                          {item.status === "pending" ? "Pending Human Sign-off" : item.status === "approved" ? "Approved by Compliance" : item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {item.status === "pending" ? (
                          <button
                            onClick={() => handleApprove(item.request_id)}
                            disabled={processing === item.request_id}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded text-[11px]"
                          >
                            {processing === item.request_id ? "Processing..." : "Approve Boost"}
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[11px]">{item.time_ago}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
