import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/dashboard/logs?userId=user_child_01&status=${filterStatus}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#384358] pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-[#FFF1EB]">SYSTEM AUDIT LOGS</h1>
          <p className="text-xs font-mono text-[#A2B0C7] mt-1">
            Granular Inspection Trail Across Connected Child Platforms
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          {['ALL', 'BLOCKED', 'ALLOWED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-mono font-bold border transition-all ${
                filterStatus === status
                  ? 'bg-[#FFA586] text-[#161E2F] border-[#FFA586]'
                  : 'bg-[#242F49] text-[#A2B0C7] border-[#384358] hover:border-[#FFA586]/50 hover:text-[#FFF1EB]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="hud-card overflow-hidden">
        <div className="p-4 border-b border-[#384358] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#FFF1EB] font-mono">
            <FileText className="w-4 h-4 text-[#FFA586]" />
            PACKET AUDIT LOGS ({logs.length})
          </div>
          <button
            onClick={fetchLogs}
            className="hud-button-secondary px-3 py-1 text-xs font-mono flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            REFRESH
          </button>
        </div>

        <div className="divide-y divide-[#384358]">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-[#A2B0C7] font-mono text-xs">
              NO AUDIT ENTRIES FOUND FOR FILTER: {filterStatus}
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-[#2E3B5B]/40 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#A2B0C7] font-bold">{log.id}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                        log.status?.toLowerCase() === 'blocked'
                          ? 'bg-[#541A2E] text-[#FFA586] border border-[#B51A2B]'
                          : 'bg-[#242F49] text-[#FFF1EB] border border-[#384358]'
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="text-xs font-mono text-[#FFF1EB] px-2 py-0.5 bg-[#161E2F] border border-[#384358]">
                      {log.appSource}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#A2B0C7]/70">{log.timestamp}</span>
                </div>

                <div className="text-sm font-semibold text-[#FFF1EB] mb-1">{log.threatCategory}</div>
                <div className="font-mono text-xs bg-[#161E2F] p-2.5 border border-[#384358] text-[#FFF1EB]/90 break-all mb-2">
                  {log.flaggedContent}
                </div>

                {log.childFriendlyExplanation && (
                  <div className="text-xs text-[#FFF1EB] bg-[#541A2E]/40 p-2.5 border border-[#B51A2B] font-sans">
                    <strong className="text-[#FFA586]">Coach Note: </strong>
                    {log.childFriendlyExplanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
