import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, FileText, Settings, ScanLine } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Threat Logs', path: '/logs', icon: FileText },
    { name: 'Live Scanner', path: '/scan', icon: ScanLine },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#2A1638]/90 border-b border-[#4A2A5E] shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#1A0E23] border border-[#F6DBC0] flex items-center justify-center shadow-[0_0_12px_rgba(246,219,192,0.3)] group-hover:shadow-[0_0_18px_rgba(246,219,192,0.6)] transition-all">
            <Shield className="w-5 h-5 text-[#F6DBC0]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-[#F8F4E9]">SAFEKIDS</span>
            <span className="text-lg font-black tracking-wider text-[#F6DBC0] ml-1">AI</span>
            <div className="text-[10px] tracking-widest text-[#C4B0C7] font-mono -mt-1 uppercase"></div>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold tracking-wide border transition-all ${
                  isActive
                    ? 'bg-[#381E48] border-[#F6DBC0] text-[#F6DBC0] shadow-[0_0_12px_rgba(246,219,192,0.25)]'
                    : 'border-transparent text-[#C4B0C7] hover:text-[#F8F4E9] hover:border-[#4A2A5E] hover:bg-[#381E48]/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1A0E23] border border-[#935073] text-[#F6DBC0] text-xs font-mono shadow-[0_0_8px_rgba(147,80,115,0.3)]">
            <span className="w-2 h-2 rounded-none bg-[#935073] animate-pulse"></span>
            SHIELD ACTIVE
          </div>
        </div>
      </div>
    </header>
  );
}
