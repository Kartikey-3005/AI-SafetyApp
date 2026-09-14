import React from 'react';
import { Shield, Heart, Flame } from 'lucide-react';

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
    <div className="hud-card p-6 border-l-4 border-l-[#FFA586]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Pet Avatar & Identity */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#161E2F] border border-[#FFA586] flex items-center justify-center text-2xl">
            🐉
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-[#FFF1EB] tracking-wider">{petName}</h3>
              <span className="px-2 py-0.5 bg-[#541A2E] border border-[#B51A2B] text-[#FFA586] text-xs font-mono font-bold">
                LVL {petLevel}
              </span>
            </div>
            <p className="text-xs text-[#A2B0C7] font-mono mt-0.5">Guardian Digital Companion</p>
          </div>
        </div>

        {/* Streaks and Scores */}
        <div className="flex items-center gap-4 font-mono text-sm">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161E2F] border border-[#B51A2B] text-[#FFA586]">
            <Flame className="w-4 h-4 text-[#FFA586]" />
            <span>{safetyStreakDays} Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161E2F] border border-[#541A2E] text-[#FFF1EB]">
            <Heart className="w-4 h-4 text-[#B51A2B]" />
            <span>{safetyScore}% Health</span>
          </div>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs font-mono mb-1.5">
          <span className="text-[#A2B0C7]">XP PROGRESSION</span>
          <span className="text-[#FFA586] font-bold">{currentXp} / {xpToNextLevel} XP ({progressPercent}%)</span>
        </div>
        <div className="w-full h-3 bg-[#161E2F] border border-[#384358] p-[1px]">
          <div
            className="h-full bg-[#B51A2B] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
