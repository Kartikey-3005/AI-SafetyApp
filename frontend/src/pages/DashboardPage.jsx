import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Clock, Award, RefreshCw } from 'lucide-react';
import StatCard from '../components/StatCard';
import PetStatusCard from '../components/PetStatusCard';
import ActivityFeed from '../components/ActivityFeed';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const summaryRes = await fetch('http://localhost:5000/api/dashboard/summary?userId=user_child_01');
      if (summaryRes.ok) {
        const data = await summaryRes.json();
        setSummary(data);
      } else {
        // Fallback mock
        setSummary({
          threatsBlockedWeekly: 42,
          contentFilteredWeekly: 128,
          safeHoursLogged: 36.5,
          digitalCitizenshipScore: 94,
          digitalPet: {
            petName: 'VIPER-007',
            petLevel: 4,
            currentXp: 780,
            xpToNextLevel: 1000,
            safetyScore: 96,
            safetyStreakDays: 14,
          },
        });
      }

      const logsRes = await fetch('http://localhost:5000/api/dashboard/logs?userId=user_child_01&limit=5');
      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setSummary({
        threatsBlockedWeekly: 42,
        contentFilteredWeekly: 128,
        safeHoursLogged: 36.5,
        digitalCitizenshipScore: 94,
        digitalPet: {
          petName: 'VIPER-007',
          petLevel: 4,
          currentXp: 780,
          xpToNextLevel: 1000,
          safetyScore: 96,
          safetyStreakDays: 14,
        },
      });
      setLogs([
        {
          id: 'LOG-8842',
          timestamp: '2026-08-18 02:45:12',
          appSource: 'Discord',
          contentType: 'Direct Message',
          status: 'Blocked',
          threatCategory: 'PII / Location Harvesting',
          flaggedContent: 'Hey buddy, what street do you live on? I can drop off free V-Bucks cards!',
          childFriendlyExplanation: '🛡️ "Hey there! We paused this message because sharing your real home address with people online isn\'t safe. Real friends never ask to meet secretly."'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4A2A5E] pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-[#F8F4E9]">COMMAND DASHBOARD</h1>
          <p className="text-xs font-mono text-[#C4B0C7] mt-1">
            Real-Time Guardian Telemetry & Child Protection Engine
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="hud-button-secondary px-4 py-2 flex items-center gap-2 text-xs font-mono font-bold"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          SYNC TELEMETRY
        </button>
      </div>

      {/* Pet Card */}
      {summary?.digitalPet && <PetStatusCard pet={summary.digitalPet} />}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Threats Blocked"
          value={summary?.threatsBlockedWeekly ?? 42}
          subtitle="Past 7 days"
          trend="+12%"
          icon={ShieldAlert}
        />
        <StatCard
          title="Content Filtered"
          value={summary?.contentFilteredWeekly ?? 128}
          subtitle="Packets inspected"
          trend="+8%"
          icon={ShieldCheck}
        />
        <StatCard
          title="Safe Browsing"
          value={summary?.safeHoursLogged ?? 36.5}
          unit="hrs"
          subtitle="Protected online time"
          trend="+4.2%"
          icon={Clock}
        />
        <StatCard
          title="Citizenship Score"
          value={summary?.digitalCitizenshipScore ?? 94}
          unit="/100"
          subtitle="Safety habits index"
          trend="+2"
          icon={Award}
        />
      </div>

      {/* Activity Feed */}
      <ActivityFeed logs={logs} />
    </div>
  );
}
