import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronRight, Zap, Eye, Lock, HeartHandshake } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#242F49] border border-[#384358] text-[#FFA586] text-xs font-mono font-bold tracking-widest uppercase">
          <Shield className="w-3.5 h-3.5 text-[#FFA586]" /> Next-Generation Child Safety
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#FFF1EB] uppercase leading-none">
          Neural Defense <br />
          <span className="text-[#FFA586]">
            For Young Minds
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#A2B0C7] font-sans leading-relaxed">
          Real-time AI packet inspection protecting kids across Discord, Roblox, YouTube, and web browsers with supportive coaching and gamified digital citizenship.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/dashboard"
            className="hud-button-primary px-8 py-3.5 text-xs font-mono font-black tracking-wider flex items-center gap-2"
          >
            LAUNCH GUARDIAN HUD <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/scan"
            className="hud-button-secondary px-6 py-3.5 text-xs font-mono font-bold tracking-wider flex items-center gap-2"
          >
            TEST LIVE SCANNER <Zap className="w-4 h-4 text-[#FFA586]" />
          </Link>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="hud-card p-6 space-y-3">
          <div className="w-10 h-10 bg-[#161E2F] border border-[#FFA586] flex items-center justify-center text-[#FFA586]">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#FFF1EB] tracking-wide">6-Layer Threat Filter</h3>
          <p className="text-xs text-[#A2B0C7] leading-relaxed">
            Multi-stage pipeline intercepting predatory grooming, PII harvesting, phishing links, and cyberbullying instantly.
          </p>
        </div>

        <div className="hud-card p-6 space-y-3">
          <div className="w-10 h-10 bg-[#161E2F] border border-[#B51A2B] flex items-center justify-center text-[#FFA586]">
            <HeartHandshake className="w-5 h-5 text-[#FFA586]" />
          </div>
          <h3 className="text-lg font-bold text-[#FFF1EB] tracking-wide">AI Empathy Coach</h3>
          <p className="text-xs text-[#A2B0C7] leading-relaxed">
            Instead of silent bans, our child-friendly coach explains why a message is risky and guides safe online behavior.
          </p>
        </div>

        <div className="hud-card p-6 space-y-3">
          <div className="w-10 h-10 bg-[#161E2F] border border-[#FFA586] flex items-center justify-center text-[#FFA586]">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#FFF1EB] tracking-wide">Gamified Citizenship</h3>
          <p className="text-xs text-[#A2B0C7] leading-relaxed">
            Level up digital guardian companions (like VIPER-007) by building smart habits, maintaining safety streaks, and reporting scams.
          </p>
        </div>
      </section>
    </div>
  );
}
