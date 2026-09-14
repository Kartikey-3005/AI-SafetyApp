import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, unit = '', subtitle, trend, icon: Icon }) {
  const isPositive = trend && trend.startsWith('+');

  return (
    <div className="hud-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[#A2B0C7] uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2 bg-[#161E2F] border border-[#384358] text-[#FFA586]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-black font-mono tracking-tight text-[#FFF1EB]">{value}</span>
        {unit && <span className="text-sm font-mono text-[#A2B0C7]">{unit}</span>}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        {subtitle && <span className="text-[#A2B0C7] font-sans">{subtitle}</span>}
        {trend && (
          <span className={`inline-flex items-center font-mono font-bold ${isPositive ? 'text-[#FFA586]' : 'text-[#B51A2B]'}`}>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
