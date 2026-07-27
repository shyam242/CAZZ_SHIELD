import React, { useState } from "react";
import { Sliders, Shield, Bell, Key, Database, CheckCircle, Save } from "lucide-react";
import { Button } from "../components/ui/Button";

export const SettingsPage: React.FC = () => {
  const [alpha, setAlpha] = useState("0.05");
  const [beta, setBeta] = useState("0.03");
  const [gamma, setGamma] = useState("0.15");
  const [delta, setDelta] = useState("0.08");
  const [decay, setDecay] = useState("0.001");
  const [webhookUrl, setWebhookUrl] = useState("https://hooks.slack.com/services/cazz/shield/alerts");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-400" />
            Enterprise Platform & Governance Settings
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Configure trust weights, emergency webhooks, OPA engine thresholds, and RBAC permissions.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Save className="w-4 h-4" />}
          onClick={() => alert("Platform governance settings saved & synced to all nodes!")}
        >
          Save & Apply Configuration
        </Button>
      </div>

      {/* Main Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* Trust Engine Hyperparameters */}
        <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-emerald-400" />
            Trust Engine Hyperparameters (PRD Calibrated)
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-slate-300 block mb-1">Alpha (Success Increment Weight)</label>
              <input
                type="text"
                value={alpha}
                onChange={(e) => setAlpha(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-blue-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Beta (Human Approval Boost Weight)</label>
              <input
                type="text"
                value={beta}
                onChange={(e) => setBeta(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-blue-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Gamma (Violation Penalty Weight)</label>
              <input
                type="text"
                value={gamma}
                onChange={(e) => setGamma(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-red-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Delta (Anomaly Penalty Weight)</label>
              <input
                type="text"
                value={delta}
                onChange={(e) => setDelta(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-amber-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Linear Time Decay Rate per Hour</label>
              <input
                type="text"
                value={decay}
                onChange={(e) => setDecay(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Emergency Webhooks & Integration Settings */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Bell className="w-4 h-4 text-amber-400" />
              Emergency Webhooks & SIEM Integration
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1">Datadog / PagerDuty Alert Webhook</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-blue-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-slate-900 rounded border border-slate-800 text-slate-300 space-y-1">
                <p className="font-semibold text-white">Splunk HEC Integration</p>
                <p className="text-[11px] text-slate-400">Endpoint: https://splunk.internal:8088/services/collector</p>
                <span className="text-[10px] text-emerald-400">Status: CONNECTED</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              Control Plane Self-Healing Status
            </h3>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>All 16 Control Modules Synchronized & Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
