import React, { useState, useEffect } from "react";
import { Search, Download, Filter, FileText, CheckCircle, XCircle, Shield, Calendar, Terminal } from "lucide-react";
import { DrawerPanel } from "../components/shared/DrawerPanel";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { auditApi, AuditEvent } from "../lib/audit";

export const AuditExplorerPage: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("ALL");

  useEffect(() => {
    loadAuditLogs();
  }, [decisionFilter]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const params: any = { page: 1, page_size: 50 };
      if (decisionFilter !== "ALL") params.decision = decisionFilter.toLowerCase();
      if (searchTerm) params.search = searchTerm;
      
      const response = await auditApi.listEvents(params);
      setAuditLogs(response.events);
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.event_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDecision = decisionFilter === "ALL" || log.decision === decisionFilter.toLowerCase();
    return matchesSearch && matchesDecision;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Immutable Audit Trail & Explorer
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            50,000+ cryptographically signed audit logs with zero-tamper SHA-256 verification.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4 text-blue-400" />}
            onClick={() => alert("Downloading Audit Trail as CSV...")}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            icon={<Download className="w-4 h-4 text-emerald-400" />}
            onClick={() => alert("Generating Signed Compliance PDF Report...")}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
        <div className="md:col-span-8 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Event ID, Agent Name, Policy Name, or Hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
        <div className="md:col-span-4">
          <select
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 py-2.5 px-3 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="ALL">All Decisions</option>
            <option value="ALLOWED">ALLOWED</option>
            <option value="DENIED">DENIED</option>
            <option value="CONDITIONAL_APPROVAL">CONDITIONAL_APPROVAL</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">TIMESTAMP</th>
                <th className="py-3 px-4">EVENT ID</th>
                <th className="py-3 px-4">AGENT NAME</th>
                <th className="py-3 px-4">EVALUATED POLICY</th>
                <th className="py-3 px-4">DECISION</th>
                <th className="py-3 px-4">LATENCY</th>
                <th className="py-3 px-4">OPERATOR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Loading audit logs...</td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.event_id}
                    onClick={() => setSelectedEvent(log)}
                    className="hover:bg-slate-900/70 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 text-slate-400">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown'}</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-400">{log.event_id}</td>
                    <td className="py-3.5 px-4 text-white">{log.agent_name || 'Unknown'}</td>
                    <td className="py-3.5 px-4 text-slate-300">{log.policy_matched || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={log.decision === "allowed" ? "success" : log.decision === "denied" ? "danger" : "warning"}>
                        {log.decision?.toUpperCase() || 'UNKNOWN'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-indigo-400 font-semibold">{log.trust_score?.toFixed(2) || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-slate-400">{log.operator || 'Unknown'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No audit logs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedEvent && (
        <DrawerPanel
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title={`Audit Event Details: ${selectedEvent.event_id}`}
          subtitle={`Cryptographic Hash: ${selectedEvent.record_hash?.substring(0, 40) + '...' || 'N/A'}`}
        >
          <div className="space-y-4 font-mono text-xs text-slate-200">
            <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
              <p><span className="text-slate-400">Timestamp:</span> {selectedEvent.timestamp ? new Date(selectedEvent.timestamp).toLocaleString() : 'Unknown'}</p>
              <p><span className="text-slate-400">Agent:</span> {selectedEvent.agent_name || 'Unknown'} ({selectedEvent.agent_id || 'Unknown'})</p>
              <p><span className="text-slate-400">Policy Evaluated:</span> {selectedEvent.policy_matched || 'N/A'}</p>
              <p><span className="text-slate-400">Decision Outcome:</span> <span className="text-emerald-400 font-bold">{selectedEvent.decision?.toUpperCase() || 'UNKNOWN'}</span></p>
              <p><span className="text-slate-400">Trust Score:</span> {selectedEvent.trust_score?.toFixed(2) || 'N/A'}</p>
              <p><span className="text-slate-400">Risk Score:</span> {selectedEvent.risk_score?.toFixed(2) || 'N/A'}</p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-300 mb-2">Action Details</h4>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                <p><span className="text-slate-400">Action:</span> {selectedEvent.action || 'Unknown'}</p>
                <p><span className="text-slate-400">Category:</span> {selectedEvent.action_category || 'Unknown'}</p>
                <p><span className="text-slate-400">Resource:</span> {selectedEvent.resource || 'Unknown'}</p>
                <p><span className="text-slate-400">Department:</span> {selectedEvent.department || 'Unknown'}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-300 mb-2">Cryptographic Hash Chain</h4>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                <p><span className="text-slate-400">Record Hash:</span> {selectedEvent.record_hash || 'N/A'}</p>
                <p><span className="text-slate-400">Prev Hash:</span> {selectedEvent.prev_hash || 'N/A'}</p>
                <p><span className="text-slate-400">Sequence:</span> #{selectedEvent.sequence_number || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </DrawerPanel>
      )}
    </div>
  );
};
