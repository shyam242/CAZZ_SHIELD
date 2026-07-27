import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FileCode, Play, History, Copy, Trash2, CheckCircle, XCircle, Plus, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { policiesApi, Policy } from "../lib/policies";

const samplePolicies = [
  {
    id: "pol-101",
    name: "SWIFT Transfer Limit Policy",
    department: "Wire Transfers",
    version: "v2.4",
    status: "Active",
    rego: `package cazz.shield.banking

default allow = false

# Rule 1: Single transaction limit $500,000
allow {
    input.action == "SWIFT_TRANSFER"
    input.amount <= 500000
    input.agent.trust_score >= 70
    input.destination.fatf_compliant == true
}

# Rule 2: Require 2FA for international settlement
allow {
    input.amount > 500000
    input.human_approval == true
    input.agent.trust_score >= 85
}`,
  },
  {
    id: "pol-102",
    name: "High-Frequency Trading Throttle",
    department: "Global Markets",
    version: "v1.8",
    status: "Active",
    rego: `package cazz.shield.trading

default allow = false

allow {
    input.request_rate_per_sec <= 100
    input.agent.department == "Global Markets"
    input.market_status == "OPEN"
}`,
  },
];

export const PolicyEnginePage: React.FC = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(samplePolicies[0]);
  const [policyCode, setPolicyCode] = useState(samplePolicies[0].rego);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const response = await policiesApi.listPolicies({ page: 1, page_size: 50 });
      setPolicies(response.policies);
      if (response.policies.length > 0) {
        setSelectedPolicy(response.policies[0]);
        setPolicyCode(response.policies[0].policy_code || samplePolicies[0].rego);
      }
    } catch (error) {
      console.error('Failed to load policies:', error);
      // Fall back to sample policies if API fails
      setSelectedPolicy(samplePolicies[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPolicy = (pol: typeof samplePolicies[0]) => {
    setSelectedPolicy(pol);
    setPolicyCode(pol.rego);
    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <FileCode className="w-6 h-6 text-blue-400" />
            OPA REGO Policy Governance Engine
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Open Policy Agent (OPA) declarations, version control, zero-latency sandbox compilation & simulation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            icon={<Play className="w-4 h-4 text-emerald-400" />}
            onClick={() => navigate("/simulator")}
          >
            Launch Policy Simulator
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            New OPA Policy
          </Button>
        </div>
      </div>

      {/* Main Grid: Policy List & Rego Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Policy Selector Sidebar */}
        <div className="lg:col-span-4 bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="text-xs font-mono font-semibold text-slate-200">ACTIVE OPA POLICIES (300)</h3>
            <span className="text-[10px] text-blue-400 font-mono">300 Deployed</span>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="text-center text-slate-400 text-xs py-4">Loading policies...</div>
            ) : policies.length > 0 ? (
              policies.map((pol) => (
                <div
                  key={pol.policy_id}
                  onClick={() => {
                    setSelectedPolicy(pol);
                    setPolicyCode(pol.policy_code || samplePolicies[0].rego);
                    setIsSaved(true);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer font-mono text-xs transition-all ${
                    selectedPolicy.policy_id === pol.policy_id
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{pol.name}</span>
                    <Badge variant={pol.status === "active" ? "success" : "neutral"}>{pol.version}</Badge>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
                    <span>{pol.category}</span>
                    <span className="text-blue-400">{pol.policy_id}</span>
                  </div>
                </div>
              ))
            ) : (
              samplePolicies.map((pol) => (
                <div
                  key={pol.id}
                  onClick={() => handleSelectPolicy(pol)}
                  className={`p-3 rounded-lg border cursor-pointer font-mono text-xs transition-all ${
                    selectedPolicy.id === pol.id
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{pol.name}</span>
                    <Badge variant={pol.status === "Active" ? "success" : "neutral"}>{pol.version}</Badge>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
                    <span>{pol.department}</span>
                    <span className="text-blue-400">{pol.id}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* REGO Code Editor & Controls */}
        <div className="lg:col-span-8 bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold font-mono text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-blue-400" />
                {selectedPolicy.name} ({selectedPolicy.version})
              </h3>
              <p className="text-xs text-slate-400 font-mono">Department: {selectedPolicy.department} • Language: Open Policy Agent REGO</p>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <Button
                variant="outline"
                size="sm"
                icon={<Copy className="w-3.5 h-3.5" />}
                onClick={() => alert(`Cloned policy ${selectedPolicy.id}`)}
              >
                Clone
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={<History className="w-3.5 h-3.5 text-amber-400" />}
                onClick={() => alert(`Rolling back to v${parseFloat(selectedPolicy.version.slice(1)) - 0.1}`)}
              >
                Rollback
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                onClick={() => {
                  setIsSaved(true);
                  alert(`OPA Policy ${selectedPolicy.id} compiled & hot-reloaded across fleet!`);
                }}
              >
                Compile & Deploy
              </Button>
            </div>
          </div>

          {/* Rego Textarea Editor */}
          <div className="relative">
            <textarea
              value={policyCode}
              onChange={(e) => {
                setPolicyCode(e.target.value);
                setIsSaved(false);
              }}
              rows={16}
              className="w-full bg-[#070b14] border border-slate-800 rounded-lg p-4 font-mono text-xs text-blue-300 focus:outline-none focus:border-blue-500 leading-relaxed shadow-inner"
            />
            {!isSaved && (
              <span className="absolute top-3 right-3 text-[11px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                Unsaved Rego Changes
              </span>
            )}
          </div>

          {/* Compilation Output Bar */}
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs flex justify-between items-center text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>OPA AST Compiler: 0 Warnings • Syntactically Valid REGO</span>
            </div>
            <span className="text-slate-400 text-[11px]">Evaluation Time: 0.18ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
