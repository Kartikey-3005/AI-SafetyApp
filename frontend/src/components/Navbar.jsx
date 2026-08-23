import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, FileText, Settings, ScanLine, UserCheck, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Threat Logs', path: '/logs', icon: FileText },
    { name: 'Live Scanner', path: '/scan', icon: ScanLine },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#2A1638] border-b border-[#4A2A5E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#1A0E23] border border-[#F6DBC0] flex items-center justify-center transition-all">
            <Shield className="w-5 h-5 text-[#F6DBC0]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-[#F8F4E9]">SAFEKIDS</span>
            <span className="text-lg font-black tracking-wider text-[#F6DBC0] ml-1">AI</span>
            <div className="text-[10px] tracking-widest text-[#C4B0C7] font-mono -mt-1 uppercase"></div>
          </div>
        </Link>

        {/* Navigation Links */}
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
                    ? 'bg-[#381E48] border-[#F6DBC0] text-[#F6DBC0]'
                    : 'border-transparent text-[#C4B0C7] hover:text-[#F8F4E9] hover:border-[#4A2A5E] hover:bg-[#381E48]/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Status Badge & Auth State */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#1A0E23] border border-[#935073] text-[#F6DBC0] text-xs font-mono">
            <span className="w-2 h-2 rounded-none bg-[#935073]"></span>
            SHIELD ACTIVE
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-[#1A0E23] border border-[#4A2A5E] text-xs font-mono">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-5 h-5 bg-[#381E48] border border-[#935073]"
                />
                <span className="text-[#F8F4E9] font-bold max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] text-[#F6DBC0] uppercase px-1 bg-[#502D55]">{user.role}</span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 bg-[#1A0E23] border border-[#4A2A5E] text-[#C4B0C7] hover:text-[#F6DBC0] hover:border-[#935073] transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold tracking-wider border transition-all ${
                location.pathname === '/signin'
                  ? 'bg-[#F6DBC0] text-[#1A0E23] border-[#F6DBC0]'
                  : 'hud-button-primary'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              SIGN IN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
