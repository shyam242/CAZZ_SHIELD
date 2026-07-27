import React from 'react';
import { Bell, Search, Shield, User, AlertOctagon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useEmergencyStore } from '../../store/emergencyStore';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { isEmergencyActive, activateFleetStop } = useEmergencyStore();
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search Input */}
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search agents, policies, audit events (Press / to focus)..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Fleet Stop Button */}
        {!isEmergencyActive ? (
          <button
            onClick={() => activateFleetStop('Manual Operator Trigger', ['stop_agents', 'freeze_budgets'])}
            className="flex items-center gap-2 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 shadow-sm"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Emergency Stop</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/emergency')}
            className="flex items-center gap-2 bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold animate-bounce shadow-lg shadow-rose-500/20"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Emergency Control</span>
          </button>
        )}

        {/* Notifications */}
        <button className="relative p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500"></span>
        </button>

        {/* User Profile Menu */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
            {user?.full_name?.charAt(0) || 'A'}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-medium text-slate-200">{user?.full_name}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
