import React from 'react';
import { Sparkles, Heart, Flame } from 'lucide-react';

export default function PetStatusCard({ pet = {} }) {
  const {
    petName = 'VIPER-007',
    petLevel = 4,
    currentXp = 780,
    xpToNextLevel = 1000,
    safetyScore = 96,
    safetyStreakDays = 14,
  } = pet;

  const progressPercent = Math.min(100, Math.round((currentXp / xpToNextLevel) * 100));

  return (
    <div className="hud-card p-6 border-l-4 border-l-[#F6DBC0]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Pet Avatar & Identity */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#1A0E23] border-2 border-[#F6DBC0] flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(246,219,192,0.3)]">
            🐉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-[#F8F4E9] tracking-wider">{petName}</h3>
              <span className="px-2 py-0.5 bg-[#502D55] border border-[#935073] text-[#F6DBC0] text-xs font-mono font-bold shadow-[0_0_8px_rgba(147,80,115,0.4)]">
                LVL {petLevel}
              </span>
            </div>
            <p className="text-xs text-[#C4B0C7] font-mono mt-0.5">Violet Dusk Guardian Companion</p>
          </div>
        </div>

        {/* Streaks and Scores */}
        <div className="flex items-center gap-4 font-mono text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A0E23] border border-[#935073] text-[#F6DBC0]">
            <Flame className="w-4 h-4 text-[#F6DBC0]" />
            <span>{safetyStreakDays} Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A0E23] border border-[#502D55] text-[#F8F4E9]">
            <Heart className="w-4 h-4 text-[#935073]" />
            <span>{safetyScore}% Health</span>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs font-mono mb-1.5">
          <span className="text-[#C4B0C7]">XP PROGRESSION</span>
          <span className="text-[#F6DBC0] font-bold">{currentXp} / {xpToNextLevel} XP ({progressPercent}%)</span>
        </div>
        <div className="w-full h-3.5 bg-[#1A0E23] border border-[#4A2A5E] p-[2px]">
          <div
            className="h-full bg-gradient-to-r from-[#502D55] via-[#935073] to-[#F6DBC0] shadow-[0_0_12px_rgba(147,80,115,0.6)] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
