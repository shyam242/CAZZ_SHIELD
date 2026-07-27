import React from "react";
import { FileText, Download, Calendar, ShieldCheck, DollarSign, Activity, FileSpreadsheet } from "lucide-react";
import { Button } from "../components/ui/Button";

const availableReports = [
  { id: "rep-01", name: "Daily Executive AI Governance Report", type: "Daily", date: "2026-07-27", size: "2.4 MB", desc: "Comprehensive 24H summary of agent executions, risk scores, budget spend & policy denials." },
  { id: "rep-02", name: "Weekly Compliance & Audit Report", type: "Weekly", date: "2026-07-25", size: "14.8 MB", desc: "Full cryptographically signed audit log breakdown for regulatory review." },
  { id: "rep-03", name: "Monthly Financial Budget Telemetry", type: "Monthly", date: "2026-07-01", size: "48.2 MB", desc: "Adaptive budget allocation, ceiling caps, and spend velocity across 2,500 agents." },
  { id: "rep-04", name: "Trust Engine Decoupling & Recovery Report", type: "Trust", date: "2026-07-20", size: "8.1 MB", desc: "Analysis of human-in-the-loop approvals, trust decay rates, and violation penalties." },
  { id: "rep-05", name: "OPA Policy AST Performance Benchmark", type: "Policy", date: "2026-07-15", size: "5.3 MB", desc: "Rego compilation latencies, evaluation speeds, and sandbox resource consumption." },
];

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            Enterprise Compliance & Governance Reports
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated regulatory PDF & CSV report generation for SOC2 Type II, ISO 27001, and FINRA compliance.
          </p>
        </div>
      </div>

      {/* Reports List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {availableReports.map((rep) => (
          <div key={rep.id} className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 space-y-3 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-semibold text-white">{rep.name}</h3>
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px]">
                  {rep.type}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">{rep.desc}</p>
              <div className="flex items-center gap-4 text-slate-400 text-[10px]">
                <span>Generated: {rep.date}</span>
                <span>Size: {rep.size}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                className="w-full font-mono text-[11px]"
                icon={<Download className="w-3.5 h-3.5 text-blue-400" />}
                onClick={() => alert(`Downloading PDF report ${rep.name}...`)}
              >
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full font-mono text-[11px]"
                icon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
                onClick={() => alert(`Downloading CSV data ${rep.name}...`)}
              >
                Download CSV
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
