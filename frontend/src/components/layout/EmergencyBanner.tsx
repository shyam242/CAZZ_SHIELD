import React from 'react';
import { AlertOctagon, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useEmergencyStore } from '../../store/emergencyStore';
import { motion, AnimatePresence } from 'framer-motion';

export const EmergencyBanner: React.FC = () => {
  const { isEmergencyActive, activatedBy, activatedAt, reason, deactivateFleetStop } = useEmergencyStore();

  return (
    <AnimatePresence>
      {isEmergencyActive && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gradient-to-r from-rose-900 via-red-800 to-rose-950 border-b border-rose-500/50 text-white px-6 py-3 flex items-center justify-between shadow-2xl relative z-50 overflow-hidden"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-rose-500/20 rounded-lg animate-pulse border border-rose-500/40">
              <AlertOctagon className="w-6 h-6 text-rose-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider text-sm uppercase text-rose-200">
                  CRITICAL SYSTEM ALERT — FLEET EMERGENCY STOP ACTIVE
                </span>
                <span className="text-xs bg-rose-500/30 text-rose-200 px-2 py-0.5 rounded-full border border-rose-400/30">
                  ALL REQUESTS DENIED
                </span>
              </div>
              <p className="text-xs text-rose-200/90 mt-0.5">
                Activated by <span className="font-semibold text-white">{activatedBy || 'Security Operator'}</span> • Reason: "{reason || 'Manual Emergency Containment Triggered'}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => deactivateFleetStop('Resolved emergency', true, true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-lg transition-all border border-emerald-400/40 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              Resume Fleet & Restore
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
