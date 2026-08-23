import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldAlert, Cpu, Lock, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#2A1638] border-t border-[#4A2A5E] mt-auto text-[#C4B0C7] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-[#1A0E23] border border-[#F6DBC0] flex items-center justify-center transition-all">
                <Shield className="w-4 h-4 text-[#F6DBC0]" />
              </div>
              <div>
                <span className="text-base font-black tracking-wider text-[#F8F4E9]">SAFEKIDS</span>
                <span className="text-base font-black tracking-wider text-[#F6DBC0] ml-1">AI</span>
              </div>
            </Link>
            <p className="text-xs text-[#C4B0C7] leading-relaxed font-sans">
              Next-generation autonomous neural safety grid protecting kids from cyberbullying, toxic discourse, and predatory behavior in real time.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#F6DBC0]">
              <span className="w-1.5 h-1.5 bg-[#935073] animate-pulse"></span>
              CORE v1.0.4 ONLINE
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F8F4E9] font-mono mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-[#F6DBC0] transition-colors flex items-center gap-1.5">
                  <span>▸</span> System Dashboard
                </Link>
              </li>
              <li>
                <Link to="/scan" className="hover:text-[#F6DBC0] transition-colors flex items-center gap-1.5">
                  <span>▸</span> Threat Scanner
                </Link>
              </li>
              <li>
                <Link to="/logs" className="hover:text-[#F6DBC0] transition-colors flex items-center gap-1.5">
                  <span>▸</span> Incident Logs
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-[#F6DBC0] transition-colors flex items-center gap-1.5">
                  <span>▸</span> Defense Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety Protocols */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F8F4E9] font-mono mb-3">
              Safety Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#F6DBC0] flex-shrink-0" />
                <span>Zero-Retention Scanning</span>
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#935073] flex-shrink-0" />
                <span>High-Speed Memory Cache</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F6DBC0] flex-shrink-0" />
                <span>Contextual Risk Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#935073] flex-shrink-0" />
                <span>Parental Escalation API</span>
              </li>
            </ul>
          </div>

          {/* System Telemetry & Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#F8F4E9] font-mono mb-3">
              System Telemetry
            </h4>
            <div className="bg-[#1A0E23] border border-[#4A2A5E] p-3 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-[#C4B0C7]">
                <span>API Status:</span>
                <span className="text-[#F6DBC0] font-bold">OPERATIONAL</span>
              </div>
              <div className="flex justify-between text-[#C4B0C7]">
                <span>Latency:</span>
                <span className="text-[#935073] font-bold">&lt; 14ms</span>
              </div>
              <div className="flex justify-between text-[#C4B0C7]">
                <span>Privacy:</span>
                <span className="text-[#F6DBC0]">COPPA Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#4A2A5E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#C4B0C7]/80">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} SafeKids AI. Dedicated to a safer digital generation.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#F8F4E9] transition-colors cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-[#F8F4E9] transition-colors cursor-pointer">Security Standards</span>
            <span className="hover:text-[#F8F4E9] transition-colors cursor-pointer">Responsible AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
