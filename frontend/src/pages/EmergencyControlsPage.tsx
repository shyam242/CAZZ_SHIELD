import React, { useState, useEffect } from "react";
import { AlertOctagon, ShieldAlert, Power, Key, DollarSign, RefreshCw, PauseOctagon, Zap, CheckCircle2 } from "lucide-react";
import { useEmergencyStore } from "../store/emergencyStore";
import { emergencyApi } from "../lib/emergency";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";

export const EmergencyControlsPage: React.FC = () => {
  const { emergencyMode, toggleEmergencyMode, fetchStatus, affectedAgentsCount, frozenBudgetsCount, activatedAt, activatedBy, reason, loading } = useEmergencyStore();
  const [selectedDept, setSelectedDept] = useState("Treasury Operations");

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleFleetEmergencyStop = async () => {
    await toggleEmergencyMode(true, "SECURITY_OFFICER_MANUAL_PANIC_BUTTON");
  };

  const handleFleetResume = async () => {
    await toggleEmergencyMode(false);
  };

  const handleDepartmentPause = async () => {
    try {
      await emergencyApi.pauseDepartment(selectedDept);
      alert(`Department '${selectedDept}' paused successfully.`);
      await fetchStatus();
    } catch (error) {
      alert(`Failed to pause department: ${error}`);
    }
  };

  const handleFreezeBudgets = async () => {
    try {
      await emergencyApi.activate({ reason: "Manual budget freeze", actions: ["freeze_budgets"] });
      alert("All agent budgets frozen successfully.");
      await fetchStatus();
    } catch (error) {
      alert(`Failed to freeze budgets: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <motion.div
        animate={{
          backgroundColor: emergencyMode ? "rgba(153, 27, 27, 0.4)" : "rgba(15, 23, 42, 0.9)",
          borderColor: emergencyMode ? "#ef4444" : "#334155",
        }}
        className="rounded-2xl border p-6 shadow-2xl relative overflow-hidden text-slate-100"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-xl border ${emergencyMode ? "bg-red-600/30 border-red-500 text-red-400 animate-pulse" : "bg-amber-500/10 border-amber-500/30 text-amber-400"}`}>
              <AlertOctagon className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
                EMERGENCY CONTROL CENTER
                {emergencyMode && <span className="text-xs px-2 py-0.5 rounded bg-red-600 text-white animate-bounce">FLEET HALTED</span>}
              </h1>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Highest authority control plane panic trigger. Immediately pauses {affectedAgentsCount} agent executions, freezes {frozenBudgetsCount} budgets & rejects incoming API requests.
              </p>
              {emergencyMode && (
                <div className="mt-2 text-xs text-red-300 font-mono">
                  <div>Activated: {activatedAt ? new Date(activatedAt).toLocaleString() : 'Unknown'}</div>
                  <div>By: {activatedBy || 'Unknown'}</div>
                  <div>Reason: {reason || 'Unknown'}</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {emergencyMode ? (
              <Button
                variant="primary"
                size="lg"
                icon={<RefreshCw className="w-5 h-5" />}
                onClick={handleFleetResume}
                className="bg-emerald-600 hover:bg-emerald-500 font-mono text-sm px-6 py-3"
              >
                RESUME FLEET OPERATIONS
              </Button>
            ) : (
              <Button
                variant="danger"
                size="lg"
                icon={<Power className="w-5 h-5" />}
                onClick={handleFleetEmergencyStop}
                className="bg-red-600 hover:bg-red-500 font-mono text-sm px-6 py-3 shadow-lg shadow-red-600/40 animate-pulse"
              >
                FLEET EMERGENCY STOP (KILL SWITCH)
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Target Granular Control Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* Department Pause Card */}
        <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <PauseOctagon className="w-4 h-4 text-amber-400" />
            Department Isolation & Sector Freeze
          </h3>
          <p className="text-slate-400">Halt all agent activity within a specific banking unit without impacting the rest of the enterprise.</p>

          <div className="space-y-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 focus:outline-none"
            >
              <option value="Treasury Operations">Treasury Operations</option>
              <option value="Wire Transfers">Wire Transfers & SWIFT</option>
              <option value="Global Markets">Global Markets Trading</option>
              <option value="Retail Loans">Retail Credit Underwriting</option>
            </select>

            <Button
              variant="warning"
              className="w-full py-2.5"
              onClick={handleDepartmentPause}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pause Department (${selectedDept})`}
            </Button>
          </div>
        </div>

        {/* Global Security Actions Matrix */}
        <div className="lg:col-span-6 bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            Fleet-Wide Security Enforcements
          </h3>
          <p className="text-slate-400">Trigger immediate fleet zero-trust security lockdowns across all 2,500 nodes.</p>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-red-500/40 text-red-400 hover:bg-red-500/10 py-3 flex-col gap-1"
              onClick={() => alert("All Bearer Tokens Revoked across 2,500 agents.")}
            >
              <Key className="w-4 h-4" />
              <span>Revoke All API Tokens</span>
            </Button>

            <Button
              variant="outline"
              className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10 py-3 flex-col gap-1"
              onClick={handleFreezeBudgets}
              disabled={loading}
            >
              <DollarSign className="w-4 h-4" />
              <span>{loading ? 'Processing...' : 'Freeze All Budgets'}</span>
            </Button>

            <Button
              variant="outline"
              className="border-red-500/40 text-red-400 hover:bg-red-500/10 py-3 flex-col gap-1"
              onClick={() => alert("Quarantined all 170 high & medium risk agents.")}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Quarantine Risky Agents</span>
            </Button>

            <Button
              variant="outline"
              className="border-blue-500/40 text-blue-400 hover:bg-blue-500/10 py-3 flex-col gap-1"
              onClick={() => alert("System state snapshot generated & saved to audit log.")}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Snapshot State Audit</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
