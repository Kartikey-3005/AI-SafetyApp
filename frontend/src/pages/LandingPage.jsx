import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, ChevronRight, Zap, Eye, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#502D55]/60 border border-[#935073] text-[#F6DBC0] text-xs font-mono font-bold tracking-widest uppercase shadow-[0_0_12px_rgba(147,80,115,0.4)]">
          <Sparkles className="w-3.5 h-3.5 text-[#F6DBC0]" /> Next-Generation Child Safety
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#F8F4E9] uppercase leading-none">
          Neural Defense <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F6DBC0] via-[#935073] to-[#F8F4E9]">
            For Young Minds
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#C4B0C7] font-sans leading-relaxed">
          Real-time AI packet inspection protecting kids across Discord, Roblox, YouTube, and web browsers with supportive coaching and gamified digital citizenship.
        </p>

        {/* Violet Dusk Gradient Preview Bar (matching the palette design) */}
        <div className="w-full max-w-md mx-auto h-3 rounded-full bg-gradient-to-r from-[#502D55] via-[#935073] to-[#F6DBC0] opacity-80 shadow-[0_0_15px_rgba(147,80,115,0.5)]"></div>

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
            TEST LIVE SCANNER <Zap className="w-4 h-4 text-[#F6DBC0]" />
          </Link>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="hud-card p-6 space-y-3">
          <div className="w-10 h-10 bg-[#1A0E23] border border-[#F6DBC0] flex items-center justify-center text-[#F6DBC0] shadow-[0_0_10px_rgba(246,219,192,0.25)]">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#F8F4E9] tracking-wide">6-Layer Threat Filter</h3>
          <p className="text-xs text-[#C4B0C7] leading-relaxed">
            Multi-stage pipeline intercepting predatory grooming, PII harvesting, phishing links, and cyberbullying instantly.
          </p>
        </div>

        <div className="hud-card p-6 space-y-3">
          <div className="w-10 h-10 bg-[#1A0E23] border border-[#935073] flex items-center justify-center text-[#935073] shadow-[0_0_10px_rgba(147,80,115,0.3)]">
            <Sparkles className="w-5 h-5 text-[#F6DBC0]" />
          </div>
          <h3 className="text-lg font-bold text-[#F8F4E9] tracking-wide">AI Empathy Coach</h3>
          <p className="text-xs text-[#C4B0C7] leading-relaxed">
            Instead of silent bans, our child-friendly coach explains why a message is risky and guides safe online behavior.
          </p>
        </div>

        <div className="hud-card p-6 space-y-3">
          <div className="w-10 h-10 bg-[#1A0E23] border border-[#F6DBC0] flex items-center justify-center text-[#F6DBC0] shadow-[0_0_10px_rgba(246,219,192,0.25)]">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#F8F4E9] tracking-wide">Gamified Citizenship</h3>
          <p className="text-xs text-[#C4B0C7] leading-relaxed">
            Level up digital guardian companions (like VIPER-007) by building smart habits, maintaining safety streaks, and reporting scams.
          </p>
        </div>
      </section>
    </div>
  );
}
