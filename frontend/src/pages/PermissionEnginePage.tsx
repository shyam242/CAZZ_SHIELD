import React, { useState } from "react";
import { Lock, Shield, Key, GitBranch, Clock, Globe, DollarSign, Users, AlertTriangle } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

const permissionsMatrix = [
  { id: "perm-001", tool: "SWIFT_WIRE_EXECUTE", type: "Conditional", timeRule: "08:00 - 17:00 EST", geoRule: "US / EU Only", maxSpend: "$500,000", reqApproval: true, dept: "Treasury" },
  { id: "perm-002", perm: "ACH_BATCH_SETTLE", type: "Allow", timeRule: "Anytime", geoRule: "Global", maxSpend: "$2,000,000", reqApproval: false, dept: "Payments" },
  { id: "perm-003", perm: "CRYPTO_DESK_LIQUIDITY", type: "Deny", timeRule: "N/A", geoRule: "Offshore", maxSpend: "$0", reqApproval: true, dept: "Risk" },
  { id: "perm-004", perm: "COMMERCIAL_LOAN_APPROVE", type: "Conditional", timeRule: "Mon-Fri", geoRule: "North America", maxSpend: "$250,000", reqApproval: true, dept: "Retail Loans" },
];

export const PermissionEnginePage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <Lock className="w-6 h-6 text-indigo-400" />
            Granular Permission Matrix & Rule Inheritance Engine
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Contextual permissions evaluation with time-based, geography-based, tool-based, and spend-based constraints.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="purple">Inheritance: Active</Badge>
          <Badge variant="info">Active Policies: 1,240</Badge>
        </div>
      </div>

      {/* Permission Constraints Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs mb-1">
            <Clock className="w-4 h-4" /> TIME-BASED RULES
          </div>
          <p className="text-sm font-bold text-white font-mono">Market Hours Only</p>
          <span className="text-[10px] text-slate-400 font-mono">08:00 - 17:00 EST Enforcement</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs mb-1">
            <Globe className="w-4 h-4" /> GEOGRAPHIC BOUNDS
          </div>
          <p className="text-sm font-bold text-white font-mono">FATF Compliant Zones</p>
          <span className="text-[10px] text-slate-400 font-mono">Geo-IP & Settlement Node checks</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs mb-1">
            <DollarSign className="w-4 h-4" /> SPEND BOUNDARIES
          </div>
          <p className="text-sm font-bold text-white font-mono">Dynamic Tier Caps</p>
          <span className="text-[10px] text-slate-400 font-mono">Tier 1: $50k | Tier 3: $1M</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs mb-1">
            <GitBranch className="w-4 h-4" /> INHERITANCE TREE
          </div>
          <p className="text-sm font-bold text-white font-mono">Dept Level Cascade</p>
          <span className="text-[10px] text-slate-400 font-mono">Global -&gt; Dept -&gt; Agent</span>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-xl">
        <h3 className="text-sm font-semibold font-mono text-white mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          Active Agent Permission Rules Matrix
        </h3>
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">RULE ID</th>
                <th className="py-3 px-3">TOOL / ACTION PERMISSION</th>
                <th className="py-3 px-3">DEPARTMENT</th>
                <th className="py-3 px-3">EVALUATION</th>
                <th className="py-3 px-3">TIME CONSTRAINT</th>
                <th className="py-3 px-3">GEO CONSTRAINT</th>
                <th className="py-3 px-3">SPEND CAP</th>
                <th className="py-3 px-3">APPROVAL REQ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {permissionsMatrix.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/60">
                  <td className="py-3 px-3 text-blue-400 font-semibold">{item.id}</td>
                  <td className="py-3 px-3 text-white">{item.tool || item.perm}</td>
                  <td className="py-3 px-3 text-slate-300">{item.dept}</td>
                  <td className="py-3 px-3">
                    <Badge variant={item.type === "Allow" ? "success" : item.type === "Conditional" ? "warning" : "danger"}>
                      {item.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{item.timeRule}</td>
                  <td className="py-3 px-3 text-slate-300">{item.geoRule}</td>
                  <td className="py-3 px-3 text-emerald-400 font-semibold">{item.maxSpend}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${item.reqApproval ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-400"}`}>
                      {item.reqApproval ? "YES (M-of-N)" : "NO"}
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
