import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ShieldAlert, Cpu, Lock, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#242F49] border-t border-[#384358] mt-auto text-[#A2B0C7] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-[#161E2F] border border-[#FFA586] flex items-center justify-center transition-all">
                <Shield className="w-4 h-4 text-[#FFA586]" />
              </div>
              <div>
                <span className="text-base font-black tracking-wider text-[#FFF1EB]">SAFEKIDS</span>
                <span className="text-base font-black tracking-wider text-[#FFA586] ml-1">AI</span>
              </div>
            </Link>
            <p className="text-xs text-[#A2B0C7] leading-relaxed font-sans">
              Next-generation autonomous neural safety grid protecting kids from cyberbullying, toxic discourse, and predatory behavior in real time.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#FFA586]">
              <span className="w-1.5 h-1.5 bg-[#B51A2B] animate-pulse"></span>
              CORE v1.0.4 ONLINE
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFF1EB] font-mono mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/dashboard" className="hover:text-[#FFA586] transition-colors flex items-center gap-1.5">
                  <span>▸</span> System Dashboard
                </Link>
              </li>
              <li>
                <Link to="/scan" className="hover:text-[#FFA586] transition-colors flex items-center gap-1.5">
                  <span>▸</span> Threat Scanner
                </Link>
              </li>
              <li>
                <Link to="/logs" className="hover:text-[#FFA586] transition-colors flex items-center gap-1.5">
                  <span>▸</span> Incident Logs
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-[#FFA586] transition-colors flex items-center gap-1.5">
                  <span>▸</span> Defense Settings
                </Link>
              </li>
            </ul>
          </div>

          {/* Safety Protocols */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFF1EB] font-mono mb-3">
              Safety Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#FFA586] flex-shrink-0" />
                <span>Zero-Retention Scanning</span>
              </li>
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#B51A2B] flex-shrink-0" />
                <span>High-Speed Memory Cache</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#FFA586] flex-shrink-0" />
                <span>Contextual Risk Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#B51A2B] flex-shrink-0" />
                <span>Parental Escalation API</span>
              </li>
            </ul>
          </div>

          {/* System Telemetry & Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FFF1EB] font-mono mb-3">
              System Telemetry
            </h4>
            <div className="bg-[#161E2F] border border-[#384358] p-3 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-[#A2B0C7]">
                <span>API Status:</span>
                <span className="text-[#FFA586] font-bold">OPERATIONAL</span>
              </div>
              <div className="flex justify-between text-[#A2B0C7]">
                <span>Latency:</span>
                <span className="text-[#B51A2B] font-bold">&lt; 14ms</span>
              </div>
              <div className="flex justify-between text-[#A2B0C7]">
                <span>Privacy:</span>
                <span className="text-[#FFA586]">COPPA Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#384358] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#A2B0C7]/80">
          <div className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()} SafeKids AI. Dedicated to a safer digital generation.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#FFF1EB] transition-colors cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-[#FFF1EB] transition-colors cursor-pointer">Security Standards</span>
            <span className="hover:text-[#FFF1EB] transition-colors cursor-pointer">Responsible AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
