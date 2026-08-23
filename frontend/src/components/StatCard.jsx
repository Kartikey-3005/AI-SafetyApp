import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ title, value, unit = '', subtitle, trend, icon: Icon }) {
  const isPositive = trend && trend.startsWith('+');

  return (
    <div className="hud-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[#C4B0C7] uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2 bg-[#1A0E23] border border-[#4A2A5E] text-[#F6DBC0]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-black font-mono tracking-tight text-[#F8F4E9]">{value}</span>
        {unit && <span className="text-sm font-mono text-[#C4B0C7]">{unit}</span>}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        {subtitle && <span className="text-[#C4B0C7] font-sans">{subtitle}</span>}
        {trend && (
          <span className={`inline-flex items-center font-mono font-bold ${isPositive ? 'text-[#F6DBC0]' : 'text-[#935073]'}`}>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
