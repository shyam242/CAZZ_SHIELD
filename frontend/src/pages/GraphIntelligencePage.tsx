import React, { useState } from "react";
import ReactFlow, { Background, Controls, MiniMap } from "react-flow-renderer";
import { GitBranch, ShieldAlert, Cpu, Database, Globe, Lock, Search, AlertTriangle, Layers } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

const initialNodes = [
  { id: "node-agent-1", type: "default", data: { label: "🤖 SWIFT High-Value Agent #1 (Risk: 88)" }, position: { x: 100, y: 100 }, style: { background: "#7f1d1d", color: "#fca5a5", border: "2px solid #ef4444", borderRadius: "10px", padding: "10px", fontSize: "11px", fontWeight: "bold" } },
  { id: "node-agent-2", type: "default", data: { label: "🤖 FX Hedging Bot Alpha (Risk: 94)" }, position: { x: 100, y: 250 }, style: { background: "#7f1d1d", color: "#fca5a5", border: "2px solid #ef4444", borderRadius: "10px", padding: "10px", fontSize: "11px", fontWeight: "bold" } },
  { id: "node-bank-1", type: "default", data: { label: "🏦 JPMorgan Federal Settlement Bank" }, position: { x: 450, y: 80 }, style: { background: "#0f172a", color: "#38bdf8", border: "1px solid #0284c7", borderRadius: "10px", padding: "10px", fontSize: "11px" } },
  { id: "node-account-1", type: "default", data: { label: "💳 Treasury Escrow Pool #8820" }, position: { x: 450, y: 220 }, style: { background: "#0f172a", color: "#a7f3d0", border: "1px solid #059669", borderRadius: "10px", padding: "10px", fontSize: "11px" } },
  { id: "node-api-1", type: "default", data: { label: "⚡ SWIFT ISO20022 REST API" }, position: { x: 750, y: 100 }, style: { background: "#0f172a", color: "#fef08a", border: "1px solid #ca8a04", borderRadius: "10px", padding: "10px", fontSize: "11px" } },
  { id: "node-vendor-1", type: "default", data: { label: "🌐 Anthropic LLM Engine v3.5" }, position: { x: 750, y: 250 }, style: { background: "#0f172a", color: "#e9d5ff", border: "1px solid #9333ea", borderRadius: "10px", padding: "10px", fontSize: "11px" } },
  { id: "node-policy-1", type: "default", data: { label: "📜 OPA SWIFT Limit Policy v2.4" }, position: { x: 450, y: 360 }, style: { background: "#0f172a", color: "#93c5fd", border: "1px solid #2563eb", borderRadius: "10px", padding: "10px", fontSize: "11px" } },
];

const initialEdges = [
  { id: "e1-3", source: "node-agent-1", target: "node-bank-1", animated: true, style: { stroke: "#ef4444", strokeWidth: 2.5 }, label: "Risky Cluster Link" },
  { id: "e2-3", source: "node-agent-2", target: "node-bank-1", animated: true, style: { stroke: "#ef4444", strokeWidth: 2.5 } },
  { id: "e1-4", source: "node-agent-1", target: "node-account-1", style: { stroke: "#64748b" } },
  { id: "e3-5", source: "node-bank-1", target: "node-api-1", animated: true, style: { stroke: "#38bdf8" } },
  { id: "e4-6", source: "node-account-1", target: "node-vendor-1", style: { stroke: "#9333ea" } },
  { id: "e1-7", source: "node-agent-1", target: "node-policy-1", style: { stroke: "#2563eb" } },
];

export const GraphIntelligencePage: React.FC = () => {
  const [highlightCluster, setHighlightCluster] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-purple-400" />
            Neo4j Graph Intelligence & Suspicious Cluster Topology
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time relationship mapping connecting AI Agents, Settlement Banks, Escrow Accounts, Vendor LLMs, and Policies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={highlightCluster ? "danger" : "warning"}
            icon={<AlertTriangle className="w-4 h-4" />}
            onClick={() => setHighlightCluster(!highlightCluster)}
          >
            {highlightCluster ? "Clear Cluster Highlight" : "Highlight Suspicious Cluster"}
          </Button>
        </div>
      </div>

      {/* Legend & Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 font-mono text-xs">
        <div className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-lg flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-slate-300">Agents (High Risk)</span>
        </div>
        <div className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-lg flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sky-500" />
          <span className="text-slate-300">Settlement Banks</span>
        </div>
        <div className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-lg flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-slate-300">Escrow Accounts</span>
        </div>
        <div className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-lg flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-slate-300">REST APIs</span>
        </div>
        <div className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-lg flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-purple-500" />
          <span className="text-slate-300">LLM Vendors</span>
        </div>
        <div className="p-2.5 bg-[#0f172a] border border-slate-800 rounded-lg flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-slate-300">OPA Policies</span>
        </div>
      </div>

      {/* React Flow Interactive Graph Canvas */}
      <div className="bg-[#070b14] border border-slate-800 rounded-xl h-[520px] w-full relative overflow-hidden shadow-2xl">
        {highlightCluster && (
          <div className="absolute top-4 left-4 z-10 bg-red-500/20 border border-red-500/50 p-3 rounded-lg font-mono text-xs text-red-300 flex items-center gap-2 backdrop-blur-md">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
            <div>
              <p className="font-bold">SUSPICIOUS CLUSTER DETECTED (#CL-9021)</p>
              <p className="text-[10px] text-slate-300">2 High-Risk Arbitrage Agents attempting duplicate SWIFT transfers to JPMorgan node</p>
            </div>
          </div>
        )}

        <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
          <Background color="#1e293b" gap={16} />
          <Controls />
          <MiniMap nodeColor={() => "#3b82f6"} maskColor="rgba(15, 23, 42, 0.8)" />
        </ReactFlow>
      </div>
    </div>
  );
};
