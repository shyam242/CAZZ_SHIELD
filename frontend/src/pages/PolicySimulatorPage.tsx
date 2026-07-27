import React, { useState } from "react";
import { Play, RotateCcw, AlertTriangle, CheckCircle, XCircle, ShieldCheck, Zap, Activity, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

export const PolicySimulatorPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);

  const runSimulation = () => {
    setIsRunning(true);
    setHasSimulated(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasSimulated(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <Play className="w-6 h-6 text-emerald-400" />
            Historical Policy Replay & Blast Radius Simulator
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Simulate new OPA policies against 50,000 historical audit events without affecting live production traffic.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={<Play className="w-4 h-4" />}
            disabled={isRunning}
            onClick={runSimulation}
            className="bg-emerald-600 hover:bg-emerald-500 font-mono text-xs"
          >
            {isRunning ? "Simulating 50k Events..." : "Run Replay Simulation"}
          </Button>
        </div>
      </div>

      {/* Simulator Inputs & Configuration */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div>
          <label className="text-slate-300 block mb-1 font-semibold">Historical Event Dataset</label>
          <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none">
            <option>Last 24 Hours (50,420 events)</option>
            <option>Last 7 Days (350,000 events)</option>
            <option>Q2 2026 Audit Replay (1,200,000 events)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-300 block mb-1 font-semibold">Target Policy Version</label>
          <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none">
            <option>SWIFT Transfer Limit Policy (v2.5-draft)</option>
            <option>HFT Throttle Policy (v1.9-draft)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-300 block mb-1 font-semibold">Simulation Mode</label>
          <select className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none">
            <option>Zero-Impact Dry Run</option>
            <option>Shadow Enforcement Mode</option>
          </select>
        </div>
      </div>

      {/* Simulation Animated Results */}
      {isRunning && (
        <div className="bg-[#0f172a] border border-blue-500/40 rounded-xl p-8 text-center font-mono text-xs text-blue-300 space-y-3">
          <Activity className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
          <p className="font-bold text-sm text-white">Replaying 50,420 Audit Logs Against OPA Rego Engine...</p>
          <p className="text-slate-400">Evaluating blast radius, request denials, policy conflicts & agent impact.</p>
        </div>
      )}

      {hasSimulated && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 font-mono text-xs"
        >
          {/* Top Results Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400">ALLOWED REQUESTS</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">48,920</p>
              <span className="text-[10px] text-emerald-400">97.0% Pass Rate</span>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400">NEWLY DENIED REQUESTS</p>
              <p className="text-2xl font-bold text-red-400 mt-1">1,500</p>
              <span className="text-[10px] text-red-400">3.0% Block Rate</span>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400">POLICY CONFLICTS</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">0 Conflict</p>
              <span className="text-[10px] text-emerald-400">Deterministic Rego evaluation</span>
            </div>

            <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
              <p className="text-slate-400">BLAST RADIUS (AFFECTED AGENTS)</p>
              <p className="text-2xl font-bold text-indigo-400 mt-1">14 Agents</p>
              <span className="text-[10px] text-slate-400">0.56% Fleet Impact</span>
            </div>
          </div>

          {/* Blast Radius & Impact Analysis */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Impact Breakdown & Blast Radius Verification
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Deploying <span className="text-blue-400">v2.5-draft</span> will safely block 1,500 unauthorized high-value transfer requests without impacting valid settlement flows. Blast radius is contained strictly within 14 High-Risk Arbitrage bots.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
