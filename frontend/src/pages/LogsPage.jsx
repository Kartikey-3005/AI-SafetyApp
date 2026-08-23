import React, { useState, useEffect } from 'react';
import { FileText, RefreshCw } from 'lucide-react';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/dashboard/logs?userId=user_child_01&status=${filterStatus}`);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4A2A5E] pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-[#F8F4E9]">SYSTEM AUDIT LOGS</h1>
          <p className="text-xs font-mono text-[#C4B0C7] mt-1">
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
                  ? 'bg-[#F6DBC0] text-[#1A0E23] border-[#F6DBC0]'
                  : 'bg-[#2A1638] text-[#C4B0C7] border-[#4A2A5E] hover:border-[#F6DBC0]/50 hover:text-[#F8F4E9]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="hud-card overflow-hidden">
        <div className="p-4 border-b border-[#4A2A5E] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#F8F4E9] font-mono">
            <FileText className="w-4 h-4 text-[#F6DBC0]" />
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

        <div className="divide-y divide-[#4A2A5E]">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-[#C4B0C7] font-mono text-xs">
              NO AUDIT ENTRIES FOUND FOR FILTER: {filterStatus}
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-[#381E48]/40 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-[#C4B0C7] font-bold">{log.id}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                        log.status?.toLowerCase() === 'blocked'
                          ? 'bg-[#502D55] text-[#F6DBC0] border border-[#935073]'
                          : 'bg-[#381E48] text-[#F8F4E9] border border-[#4A2A5E]'
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="text-xs font-mono text-[#F8F4E9] px-2 py-0.5 bg-[#1A0E23] border border-[#4A2A5E]">
                      {log.appSource}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#C4B0C7]/70">{log.timestamp}</span>
                </div>

                <div className="text-sm font-semibold text-[#F8F4E9] mb-1">{log.threatCategory}</div>
                <div className="font-mono text-xs bg-[#1A0E23] p-2.5 border border-[#4A2A5E] text-[#F8F4E9]/90 break-all mb-2">
                  {log.flaggedContent}
                </div>

                {log.childFriendlyExplanation && (
                  <div className="text-xs text-[#F8F4E9] bg-[#502D55]/30 p-2.5 border border-[#935073] font-sans">
                    <strong className="text-[#F6DBC0]">Coach Note: </strong>
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
