import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function ActivityFeed({ logs = [] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="hud-card p-8 text-center text-[#A2B0C7] font-mono text-sm">
        NO RECENT THREAT ACTIVITY RECORDED
      </div>
    );
  }

  return (
    <div className="hud-card p-6">
      <div className="flex items-center justify-between border-b border-[#384358] pb-4 mb-4">
        <h3 className="text-base font-bold text-[#FFF1EB] tracking-wide flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#FFA586]" />
          Real-Time Neural Activity Feed
        </h3>
        <span className="text-xs font-mono text-[#A2B0C7]">Showing {logs.length} events</span>
      </div>

      <div className="space-y-4">
        {logs.map((log) => {
          const isBlocked = log.status?.toLowerCase() === 'blocked';

          return (
            <div
              key={log.id}
              className={`p-4 bg-[#161E2F] border transition-all ${
                isBlocked
                  ? 'border-[#B51A2B] hover:border-[#FFA586]'
                  : 'border-[#384358] hover:border-[#FFA586]/50'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[11px] font-mono font-bold uppercase ${
                      isBlocked
                        ? 'bg-[#541A2E] text-[#FFA586] border border-[#B51A2B]'
                        : 'bg-[#242F49] text-[#FFF1EB] border border-[#384358]'
                    }`}
                  >
                    {log.status}
                  </span>
                  <span className="text-xs font-mono text-[#FFF1EB] font-bold px-2 py-0.5 bg-[#242F49] border border-[#384358]">
                    {log.appSource}
                  </span>
                  <span className="text-xs font-mono text-[#A2B0C7]">
                    {log.contentType}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#A2B0C7]/70">{log.timestamp}</span>
              </div>

              {/* Threat Category */}
              <div className="text-sm font-semibold text-[#FFF1EB] mb-1">
                {log.threatCategory}
              </div>

              {/* Flagged Content */}
              <div className="p-2.5 bg-[#242F49] border border-[#384358] text-xs font-mono text-[#FFF1EB]/90 break-all mb-3">
                <span className="text-[#FFA586] mr-2">&gt;</span>
                {log.flaggedContent}
              </div>

              {/* Child-Friendly AI Coach message */}
              {log.childFriendlyExplanation && (
                <div className="p-3 bg-[#541A2E]/40 border border-[#B51A2B] text-xs text-[#FFF1EB]">
                  <div className="font-mono text-[10px] text-[#FFA586] font-bold uppercase mb-1">
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
