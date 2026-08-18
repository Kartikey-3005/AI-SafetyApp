import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function ActivityFeed({ logs = [] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="hud-card p-8 text-center text-[#C4B0C7] font-mono text-sm">
        NO RECENT THREAT ACTIVITY RECORDED
      </div>
    );
  }

  return (
    <div className="hud-card p-6">
      <div className="flex items-center justify-between border-b border-[#4A2A5E] pb-4 mb-4">
        <h3 className="text-base font-bold text-[#F8F4E9] tracking-wide flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#F6DBC0]" />
          Real-Time Neural Activity Feed
        </h3>
        <span className="text-xs font-mono text-[#C4B0C7]">Showing {logs.length} events</span>
      </div>

      <div className="space-y-4">
        {logs.map((log) => {
          const isBlocked = log.status?.toLowerCase() === 'blocked';

          return (
            <div
              key={log.id}
              className={`p-4 bg-[#1A0E23] border transition-all ${
                isBlocked
                  ? 'border-[#935073] hover:border-[#F6DBC0] shadow-[0_0_12px_rgba(147,80,115,0.3)]'
                  : 'border-[#4A2A5E] hover:border-[#F6DBC0]/50'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[11px] font-mono font-bold uppercase ${
                      isBlocked
                        ? 'bg-[#502D55] text-[#F6DBC0] border border-[#935073]'
                        : 'bg-[#381E48] text-[#F8F4E9] border border-[#4A2A5E]'
                    }`}
                  >
                    {log.status}
                  </span>
                  <span className="text-xs font-mono text-[#F8F4E9] font-bold px-2 py-0.5 bg-[#2A1638] border border-[#4A2A5E]">
                    {log.appSource}
                  </span>
                  <span className="text-xs font-mono text-[#C4B0C7]">
                    {log.contentType}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#C4B0C7]/70">{log.timestamp}</span>
              </div>

              {/* Threat Category */}
              <div className="text-sm font-semibold text-[#F8F4E9] mb-1">
                {log.threatCategory}
              </div>

              {/* Flagged Content */}
              <div className="p-2.5 bg-[#2A1638] border border-[#4A2A5E] text-xs font-mono text-[#F8F4E9]/90 break-all mb-3">
                <span className="text-[#935073] mr-2">&gt;</span>
                {log.flaggedContent}
              </div>

              {/* Child-Friendly AI Coach message */}
              {log.childFriendlyExplanation && (
                <div className="p-3 bg-[#502D55]/30 border border-[#935073] text-xs text-[#F8F4E9]">
                  <div className="font-mono text-[10px] text-[#F6DBC0] font-bold uppercase mb-1">
                    AI Safety Coach Guidance:
                  </div>
                  {log.childFriendlyExplanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
