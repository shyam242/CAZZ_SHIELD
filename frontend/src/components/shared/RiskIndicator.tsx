import React from 'react';

interface RiskIndicatorProps {
  score: number; // 0.0 to 1.0
  level?: string;
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ score, level }) => {
  const getRiskBadge = (val: number) => {
    if (val >= 0.8) return { label: 'CRITICAL', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
    if (val >= 0.6) return { label: 'HIGH', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    if (val >= 0.3) return { label: 'MEDIUM', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    return { label: 'LOW', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  };

  const badge = getRiskBadge(score);

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            score >= 0.8 ? 'bg-rose-500' : score >= 0.6 ? 'bg-amber-500' : score >= 0.3 ? 'bg-blue-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, score * 100))}%` }}
        />
      </div>
      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${badge.color}`}>
        {level ? level.toUpperCase() : badge.label}
      </span>
    </div>
  );
};
