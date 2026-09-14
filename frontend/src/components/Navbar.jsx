import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, FileText, Settings, ScanLine, LogIn, LogOut, Lock } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-[#242F49] border-b border-[#384358]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#161E2F] border border-[#FFA586] flex items-center justify-center transition-all">
            <Shield className="w-5 h-5 text-[#FFA586]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-[#FFF1EB]">SAFEKIDS</span>
            <span className="text-lg font-black tracking-wider text-[#FFA586] ml-1">AI</span>
            <div className="text-[10px] tracking-widest text-[#A2B0C7] font-mono -mt-1 uppercase"></div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const targetPath = user ? item.path : '/signin';

            return (
              <Link
                key={item.path}
                to={targetPath}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold tracking-wide border transition-all ${
                  isActive
                    ? 'bg-[#2E3B5B] border-[#FFA586] text-[#FFA586]'
                    : 'border-transparent text-[#A2B0C7] hover:text-[#FFF1EB] hover:border-[#384358] hover:bg-[#2E3B5B]/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
                {!user && <Lock className="w-3 h-3 text-[#A2B0C7]/60 ml-0.5" />}
              </Link>
            );
          })}
        </nav>

        {/* Status Badge & Google Auth State */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#161E2F] border border-[#B51A2B] text-[#FFA586] text-xs font-mono">
            <span className="w-2 h-2 rounded-none bg-[#B51A2B]"></span>
            {user ? 'SHIELD ACTIVE' : 'LOCKED • AUTH REQUIRED'}
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-[#161E2F] border border-[#384358] text-xs font-mono">
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-5 h-5 bg-[#2E3B5B] border border-[#B51A2B]"
                />
                <span className="text-[#FFF1EB] font-bold max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] text-[#FFA586] uppercase px-1 bg-[#541A2E]">{user.role}</span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 bg-[#161E2F] border border-[#384358] text-[#A2B0C7] hover:text-[#FFA586] hover:border-[#B51A2B] transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/signin"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider border transition-all ${
                location.pathname === '/signin'
                  ? 'bg-[#FFA586] text-[#161E2F] border-[#FFA586]'
                  : 'hud-button-primary'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              GOOGLE SIGN IN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
