import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ShieldAlert, Cpu, ArrowUpDown, ChevronRight, SlidersHorizontal, Layers, CheckCircle } from "lucide-react";
import { DrawerPanel } from "../components/shared/DrawerPanel";
import { TrustGauge } from "../components/shared/TrustGauge";
import { RiskIndicator } from "../components/shared/RiskIndicator";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useAgentStore, AgentItem } from "../store/agentStore";
import { agentsApi } from "../lib/agents";

export const AgentFleetPage: React.FC = () => {
  const navigate = useNavigate();
  const { agents, quarantineAgent, resumeAgent, fetchAgents, loading } = useAgentStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [totalAgents, setTotalAgents] = useState(0);

  const pageSize = 25;

  useEffect(() => {
    loadAgents();
  }, [currentPage, departmentFilter, statusFilter]);

  const loadAgents = async () => {
    const params: any = {
      page: currentPage,
      page_size: pageSize,
    };
    if (departmentFilter !== "All") params.department = departmentFilter;
    if (statusFilter !== "All") params.status = statusFilter;
    if (searchTerm) params.search = searchTerm;
    
    try {
      const response = await agentsApi.listAgents(params);
      setTotalAgents(response.total);
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const debounceTimer = setTimeout(() => {
        setCurrentPage(1);
        loadAgents();
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm]);

  const selectedAgent = useMemo(() => {
    return agents.find((a) => a.id === selectedAgentId || a.uuid === selectedAgentId) || null;
  }, [agents, selectedAgentId]);

  const filteredAgents = useMemo(() => {
    return agents.filter((agt) => {
      const matchesSearch =
        agt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agt.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept = departmentFilter === "All" || agt.department === departmentFilter;
      const matchesStatus = statusFilter === "All" || agt.status === statusFilter;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [agents, searchTerm, departmentFilter, statusFilter]);

  const totalPages = Math.ceil(totalAgents / pageSize) || 1;
  const paginatedAgents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAgents.slice(start, start + pageSize);
  }, [filteredAgents, currentPage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-400" />
            AI Agent Fleet Management
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Global catalog of 2,500 active financial AI agents governed by autonomous policy execution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info">Total Fleet: {totalAgents}</Badge>
          <Badge variant="success">Filtered: {filteredAgents.length}</Badge>
          {loading && <Badge variant="warning">Loading...</Badge>}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-[#0f172a] border border-slate-800 p-4 rounded-xl">
        {/* Search */}
        <div className="md:col-span-6 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Agent Name, ID or Department..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        {/* Dept Filter */}
        <div className="md:col-span-3">
          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 py-2.5 px-3 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="All">All Departments</option>
            <option value="Treasury">Treasury</option>
            <option value="Wire Transfers">Wire Transfers</option>
            <option value="Retail Loans">Retail Loans</option>
            <option value="Global Markets">Global Markets</option>
            <option value="Wealth Management">Wealth Management</option>
            <option value="Compliance & Risk">Compliance & Risk</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 py-2.5 px-3 focus:outline-none focus:border-blue-500 font-mono"
          >
            <option value="All">All Execution Statuses</option>
            <option value="Active">Active</option>
            <option value="Restricted">Restricted</option>
            <option value="Quarantined">Quarantined</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      {/* Agents Table */}
      <div className="rounded-xl bg-[#0f172a] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">AGENT ID</th>
                <th className="py-3 px-4">NAME & OWNER</th>
                <th className="py-3 px-4">DEPARTMENT</th>
                <th className="py-3 px-4">TRUST SCORE</th>
                <th className="py-3 px-4">RISK LEVEL</th>
                <th className="py-3 px-4">BUDGET SPENT / CAP</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedAgents.map((agt) => (
                <tr
                  key={agt.uuid}
                  onClick={() => setSelectedAgentId(agt.id)}
                  className="hover:bg-slate-900/70 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-semibold text-blue-400">{agt.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{agt.name}</div>
                    <div className="text-[10px] text-slate-400">{agt.owner}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{agt.department}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-emerald-400">{agt.trustScore}/100</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <RiskIndicator score={agt.riskScore} />
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    {agt.spentBudget} / <span className="text-slate-400">{agt.dailyBudget}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        agt.status === "Active"
                          ? "success"
                          : agt.status === "Restricted"
                          ? "warning"
                          : agt.status === "Quarantined"
                          ? "danger"
                          : "neutral"
                      }
                      dot
                    >
                      {agt.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/agents/${agt.id}`);
                      }}
                      icon={<ChevronRight className="w-4 h-4 text-blue-400" />}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-800 gap-3 font-mono text-xs text-slate-400 bg-slate-900/40">
          <div>
            Showing Page <span className="text-white font-semibold">{currentPage}</span> of{" "}
            <span className="text-white font-semibold">{totalPages}</span> ({totalAgents} total agents)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Slide Drawer for Selected Agent Quick Overview */}
      {selectedAgent && (
        <DrawerPanel
          isOpen={!!selectedAgent}
          onClose={() => setSelectedAgentId(null)}
          title={`Agent Details: ${selectedAgent.name}`}
          subtitle={`UUID: ${selectedAgent.uuid} | Department: ${selectedAgent.department}`}
        >
          <div className="space-y-6 text-xs font-mono">
            <div className="grid grid-cols-2 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div>
                <p className="text-slate-400">Current Status</p>
                <Badge
                  variant={
                    selectedAgent.status === "Active"
                      ? "success"
                      : selectedAgent.status === "Restricted"
                      ? "warning"
                      : selectedAgent.status === "Quarantined"
                      ? "danger"
                      : "neutral"
                  }
                  className="mt-1"
                  dot
                >
                  {selectedAgent.status}
                </Badge>
              </div>
              <div>
                <p className="text-slate-400">Owner Team</p>
                <p className="text-white font-semibold mt-1">{selectedAgent.owner}</p>
              </div>
              <div>
                <p className="text-slate-400">Trust Score</p>
                <p className="text-emerald-400 font-bold text-base mt-1">{selectedAgent.trustScore} / 100</p>
              </div>
              <div>
                <p className="text-slate-400">Risk Score</p>
                <p className="text-red-400 font-bold text-base mt-1">{selectedAgent.riskScore} / 100</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-200 font-semibold">Budget & Spend Overview</h4>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>Spent: {selectedAgent.spentBudget}</span>
                  <span>Cap: {selectedAgent.dailyBudget}</span>
                </div>
                <div className="mt-2 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[45%]" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-slate-200 font-semibold">Connected Enterprise Integrations</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">SWIFT Financial Gateway API</div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">Core Banking Ledger SQL</div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">Bloomberg Market Feed</div>
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800">Federal Reserve ACH Webhook</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex gap-2">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  navigate(`/agents/${selectedAgent.id}`);
                }}
              >
                Open Full Control Panel
              </Button>
              {selectedAgent.status === "Quarantined" ? (
                <Button
                  variant="outline"
                  className="w-full border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                  onClick={() => resumeAgent(selectedAgent.id)}
                >
                  Resume Agent
                </Button>
              ) : (
                <Button
                  variant="danger"
                  className="w-full"
                  onClick={() => quarantineAgent(selectedAgent.id)}
                >
                  Quarantine Agent
                </Button>
              )}
            </div>
          </div>
        </DrawerPanel>
      )}
    </div>
  );
};
