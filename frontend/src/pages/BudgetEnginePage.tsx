import React, { useState, useEffect } from "react";
import { DollarSign, TrendingUp, AlertTriangle, PieChart as PieIcon, ShieldCheck, Zap } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { Badge } from "../components/ui/Badge";
import { budgetApi, BudgetOverview } from "../lib/budget";

const budgetForecastData = [
  { day: "Mon", actual: 82000, forecast: 85000, cap: 100000 },
  { day: "Tue", actual: 89000, forecast: 88000, cap: 100000 },
  { day: "Wed", actual: 94000, forecast: 92000, cap: 100000 },
  { day: "Thu", actual: 81200, forecast: 90000, cap: 100000 },
  { day: "Fri", actual: null, forecast: 95000, cap: 100000 },
  { day: "Sat", actual: null, forecast: 45000, cap: 100000 },
  { day: "Sun", actual: null, forecast: 42000, cap: 100000 },
];

const budgetFormulaData = [
  { name: "Floor Multiplier", val: "0.05 (5%)", desc: "Minimum budget safety allocation reserved under low trust conditions" },
  { name: "Ceiling Multiplier", val: "1.50 (150%)", desc: "Maximum budget expansion cap permitted under high trust scores (> 90)" },
  { name: "Adaptive Formula", val: "B_adj = B_base * (0.05 + 1.45 * (Trust / 100))", desc: "Real-time budget adjustment dynamic multiplier" },
];

export const BudgetEnginePage: React.FC = () => {
  const [budgetOverview, setBudgetOverview] = useState<BudgetOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBudgetData();
  }, []);

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      const overview = await budgetApi.getOverview();
      setBudgetOverview(overview);
    } catch (error) {
      console.error('Failed to load budget data:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-400" />
            Adaptive Financial Budget Control Engine
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Autonomous dynamic budget caps scaled against real-time agent trust scores, spend velocity & risk metrics.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="success">Total Daily Cap: ${budgetOverview?.total_budget?.toLocaleString() || '0'}</Badge>
          <Badge variant="info">Used Today: ${budgetOverview?.total_spent?.toLocaleString() || '0'} ({budgetOverview ? ((budgetOverview.total_spent / budgetOverview.total_budget) * 100).toFixed(1) : '0'}%)</Badge>
        </div>
      </div>

      {/* Top Budget KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <p className="text-[11px] font-mono text-slate-400">TODAY'S FLEET SPEND</p>
          <p className="text-2xl font-bold text-white font-mono mt-1">${budgetOverview?.total_spent?.toLocaleString() || '0'}</p>
          <span className="text-[10px] text-emerald-400 font-mono">Within ${budgetOverview?.total_budget?.toLocaleString() || '0'} Daily Cap</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <p className="text-[11px] font-mono text-slate-400">REMAINING FLEET BUDGET</p>
          <p className="text-2xl font-bold text-blue-400 font-mono mt-1">${budgetOverview?.total_remaining?.toLocaleString() || '0'}</p>
          <span className="text-[10px] text-slate-400 font-mono">{budgetOverview ? ((budgetOverview.total_remaining / budgetOverview.total_budget) * 100).toFixed(1) : '0'}% Buffer left</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <p className="text-[11px] font-mono text-slate-400">FROZEN BUDGETS</p>
          <p className="text-2xl font-bold text-amber-400 font-mono mt-1">{budgetOverview?.total_frozen || 0}</p>
          <span className="text-[10px] text-amber-400 font-mono">Agents under emergency freeze</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
          <p className="text-[11px] font-mono text-slate-400">BUDGET VIOLATIONS (24H)</p>
          <p className="text-2xl font-bold text-red-400 font-mono mt-1">{budgetOverview?.total_violations || 0} Breach</p>
          <span className="text-[10px] text-red-400 font-mono">{budgetOverview?.total_violations === 0 ? '100% Auto-throttled' : 'Action required'}</span>
        </div>
      </div>

      {/* Adaptive Formula Breakdown & Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Adaptive Calculation Formula Card */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-xl p-5 shadow-xl">
          <h3 className="text-sm font-semibold font-mono text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Adaptive Trust-Driven Budget Formula
          </h3>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-emerald-300 mb-4">
            {"B_{allocated} = B_{base} \\times \\left( \\text{Floor} + (\\text{Ceiling} - \\text{Floor}) \\times \\frac{\\text{Trust}}{100} \\right)"}
          </div>
          <div className="space-y-3 font-mono text-xs">
            {budgetFormulaData.map((item) => (
              <div key={item.name} className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
                <div className="flex justify-between font-semibold text-white">
                  <span>{item.name}</span>
                  <span className="text-blue-400">{item.val}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Spend Forecast vs Cap Chart */}
        <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold font-mono text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            7-Day Spend Forecast vs Dynamic Fleet Ceiling ($)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={budgetForecastData}>
                <XAxis dataKey="day" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", fontSize: "12px" }} />
                <Area type="monotone" dataKey="actual" stroke="#10b981" fill="#10b98120" strokeWidth={2} name="Actual Spend" />
                <Area type="monotone" dataKey="forecast" stroke="#3b82f6" fill="#3b82f610" strokeWidth={2} strokeDasharray="3 3" name="Forecasted Spend" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
