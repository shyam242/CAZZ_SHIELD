import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Shield,
  FileCode,
  PlayCircle,
  Activity,
  DollarSign,
  Zap,
  GitFork,
  Search,
  MessageSquare,
  AlertOctagon,
  AlertCircle,
  FileText,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import { useEmergencyStore } from '../../store/emergencyStore';

const navigationItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Agent Fleet', path: '/agents', icon: Bot, count: '2,500' },
  { name: 'Trust Engine', path: '/trust', icon: Activity },
  { name: 'Adaptive Budgets', path: '/budget', icon: DollarSign },
  { name: 'Risk Engine', path: '/risk', icon: Zap },
  { name: 'Policy Engine', path: '/policies', icon: FileCode },
  { name: 'Policy Simulator', path: '/simulator', icon: PlayCircle },
  { name: 'Permissions', path: '/permissions', icon: Shield },
  { name: 'Graph Intelligence', path: '/graph', icon: GitFork },
  { name: 'Audit Explorer', path: '/audit', icon: Search },
  { name: 'Governance Copilot', path: '/copilot', icon: MessageSquare },
  { name: 'Emergency Controls', path: '/emergency', icon: AlertOctagon, highlight: true },
  { name: 'Incident Center', path: '/incidents', icon: AlertCircle },
  { name: 'Reports', path: '/reports', icon: FileText },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { isEmergencyActive } = useEmergencyStore();

  return (
    <aside className={`w-64 flex-shrink-0 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 backdrop-blur-md transition-colors ${
      isEmergencyActive ? 'border-rose-800/40 bg-slate-950/95' : ''
    }`}>
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className={`p-2 rounded-xl shadow-lg border transition-colors ${
            isEmergencyActive ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-blue-600/20 border-blue-500/30 text-blue-400'
          }`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold tracking-tight text-white text-lg leading-none">CAZZ SHIELD</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-semibold">AI Governance Control Plane</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                    : item.highlight
                    ? isEmergencyActive
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : 'text-rose-400 hover:bg-rose-500/10'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  item.highlight ? 'text-rose-400' : ''
                }`} />
                <span>{item.name}</span>
              </div>
              {item.count && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 group-hover:bg-slate-700">
                  {item.count}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Institution Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[10px]">v2.0.0 Enterprise</span>
          <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[10px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            CONNECTED
          </span>
        </div>
      </div>
    </aside>
  );
};
