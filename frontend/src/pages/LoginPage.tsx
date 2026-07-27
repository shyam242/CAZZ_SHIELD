import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Shield, Lock, ArrowRight, UserCheck, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<string>("Admin");
  const [username, setUsername] = useState<string>("admin@cazzshield.com");
  const [password, setPassword] = useState<string>("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>("");

  const roles = [
    { id: "Admin", title: "Enterprise Administrator", desc: "Full administrative access to governance controls & fleet operations", color: "border-blue-500/50 bg-blue-500/10 text-blue-400", email: "admin@cazzshield.com", password: "admin123" },
    { id: "Security Admin", title: "Security Officer", desc: "Control emergency quarantine, policy enforcement & audit reviews", color: "border-red-500/50 bg-red-500/10 text-red-400", email: "security@cazzshield.com", password: "security123" },
    { id: "Operator", title: "Fleet Operator", desc: "Monitor agent activities, execution state & active incidents", color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400", email: "operator@cazzshield.com", password: "operator123" },
    { id: "Auditor", title: "Compliance Auditor", desc: "Read-only access to immutable audit logs, reports & compliance verification", color: "border-amber-500/50 bg-amber-500/10 text-amber-400", email: "auditor@cazzshield.com", password: "auditor123" },
    { id: "AI Engineer", title: "AI Agent Developer", desc: "Policy simulator testing, prompt evaluation & graph inspection", color: "border-purple-500/50 bg-purple-500/10 text-purple-400", email: "engineer@cazzshield.com", password: "engineer123" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setLoginError(error || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#0f172a]/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10"
      >
        {/* Left Column: Platform Branding */}
        <div className="md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80 pb-6 md:pb-0 md:pr-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white font-mono">CAZZ SHIELD</h1>
                <p className="text-xs text-blue-400 font-mono tracking-wide">ENTERPRISE AI GOVERNANCE PLATFORM</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Autonomous Governance & Self-Healing Control Plane for Financial AI Agents. Enforcing zero-trust execution, real-time risk scoring, and automated compliance.
            </p>

            <div className="space-y-3 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Control Plane Status: Active</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span>OPA Policy Engine: Connected</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Graph Intelligence: Synchronized</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>TLS 1.3 Enterprise Auth • MFA Enabled</span>
            </div>
          </div>
        </div>

        {/* Right Column: Role Selection & Login Form */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Enterprise OIDC Single Sign-On</h2>
            <p className="text-xs text-slate-400 mt-1">Select your access role to initiate secure session authentication.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-mono font-medium text-slate-300 block mb-2">Select User Role</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {roles.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedRole(r.id);
                      setUsername(r.email);
                      setPassword(r.password);
                    }}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      selectedRole === r.id
                        ? `${r.color} ring-1 ring-blue-500/50 shadow-md`
                        : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold font-mono">{r.title}</span>
                      {selectedRole === r.id && <UserCheck className="w-4 h-4 text-blue-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-medium text-slate-300 block mb-1">Corporate Identity (SSO Email)</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-medium text-slate-300 block mb-1">Security Token / Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span className="font-mono text-xs">Authenticating Session...</span>
              ) : (
                <>
                  <span>Authenticate & Launch Control Plane</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
