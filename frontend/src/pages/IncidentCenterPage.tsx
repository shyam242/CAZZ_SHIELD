import React, { useState, useEffect } from "react";
import { AlertOctagon, Clock, User, ShieldAlert, CheckCircle, MessageSquare, ArrowUpRight } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { incidentsApi, Incident } from "../lib/incidents";

export const IncidentCenterPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const response = await incidentsApi.listIncidents({ page: 1, page_size: 50 });
      setIncidents(response.incidents);
    } catch (error) {
      console.error('Failed to load incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.incident_id === incidentId ? { ...inc, status: "resolved" } : inc))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-red-400" />
            Security Incident Response Center
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time security incident tracking, escalation workflows, containment verification & resolution audit.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="danger">Active Incidents: 2</Badge>
          <Badge variant="success">Resolved Today: 18</Badge>
        </div>
      </div>

      {/* Incident Cards */}
      <div className="space-y-4 font-mono text-xs">
        {loading ? (
          <div className="text-center text-slate-400 py-8">Loading incidents...</div>
        ) : incidents.length > 0 ? (
          incidents.map((inc) => (
            <div
              key={inc.incident_id}
              className={`p-5 rounded-xl border bg-[#0f172a] shadow-xl space-y-4 ${
                inc.status === "resolved" || inc.status === "closed" ? "border-slate-800 opacity-60" : "border-red-500/40"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-red-400">{inc.incident_id}</span>
                  <Badge variant={inc.severity === "critical" ? "danger" : "warning"}>{inc.severity}</Badge>
                  <Badge variant={inc.status === "resolved" || inc.status === "closed" ? "success" : "warning"}>{inc.status}</Badge>
                  <h3 className="text-sm font-semibold text-white">{inc.title}</h3>
                </div>
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Detected {inc.detected_at ? new Date(inc.detected_at).toLocaleString() : 'Unknown'}
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed">{inc.description}</p>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-blue-400" /> Assigned: {inc.assigned_to || 'Unassigned'}</span>
                  <span className="flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Type: {inc.incident_type}</span>
                </div>
                {inc.status !== "resolved" && inc.status !== "closed" && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => resolveIncident(inc.incident_id)}
                  >
                    Mark Resolved
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-400 py-8">No incidents found</div>
        )}
      </div>
    </div>
  );
};
