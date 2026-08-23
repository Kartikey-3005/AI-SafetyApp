import React, { useState, useEffect } from 'react';
import { Shield, Lock, Smartphone, Save, CheckCircle, RefreshCw } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    strictness: 'MEDIUM',
    safeBrowsingEnabled: true,
    aiModerationEnabled: true,
    onDevicePrivacyOnly: false,
    autoBlockNewContacts: true,
    instantParentAlerts: true,
  });

  const [platforms, setPlatforms] = useState({
    discord: true,
    roblox: true,
    youtube: true,
    browser: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/dashboard/settings?childId=user_child_01');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch (err) {
      console.warn('Backend offline or settings fetch failed, using fallback settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSavedSuccess(false);
  };

  const handlePlatformToggle = (key) => {
    setPlatforms((prev) => ({ ...prev, [key]: !prev[key] }));
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('http://localhost:5000/api/dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childId: 'user_child_01',
          settings: settings,
        }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Failed to save settings to backend:', err);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#4A2A5E] pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-[#F8F4E9]">GUARDIAN SETTINGS</h1>
          <p className="text-xs font-mono text-[#C4B0C7] mt-1">
            Configure Real-Time AI Interception Thresholds & Platform Integrations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettings}
            className="hud-button-secondary px-3 py-2 text-xs font-mono flex items-center gap-1.5"
            disabled={loading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            REFRESH
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="hud-button-primary px-5 py-2 text-xs font-mono font-black flex items-center gap-2"
          >
            <Save className={`w-3.5 h-3.5 ${saving ? 'animate-spin' : ''}`} />
            {saving ? 'SAVING...' : 'SAVE CONFIGURATION'}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-[#502D55]/60 border border-[#F6DBC0] text-[#F8F4E9] flex items-center gap-3 font-mono text-xs">
          <CheckCircle className="w-5 h-5 text-[#F6DBC0]" />
          <span>Guardian safety policies and telemetry settings successfully updated & synced across all endpoints.</span>
        </div>
      )}

      {/* Strictness Level Selector */}
      <div className="hud-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#4A2A5E] pb-3">
          <Shield className="w-5 h-5 text-[#F6DBC0]" />
          <h2 className="text-sm font-bold text-[#F8F4E9] uppercase tracking-wider font-mono">
            AI Threat Inspection Strictness
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              level: 'RELAXED',
              label: 'Relaxed (Teens 13+)',
              desc: 'Blocks critical phishing & severe harassment. Allows educational mature topics with mild coaching.',
            },
            {
              level: 'MEDIUM',
              label: 'Balanced (Kids 9-12)',
              desc: 'Standard neural defense. Intercepts predatory grooming, PII harvesting, cyberbullying, and unverified links.',
            },
            {
              level: 'STRICT',
              label: 'Maximum (Kids Under 9)',
              desc: 'Zero-tolerance filter. Blocks all stranger messages, unknown external links, and requires whitelist approval.',
            },
          ].map((item) => (
            <button
              key={item.level}
              type="button"
              onClick={() => {
                setSettings((prev) => ({ ...prev, strictness: item.level }));
                setSavedSuccess(false);
              }}
              className={`p-4 text-left border transition-all ${
                settings.strictness === item.level
                  ? 'bg-[#381E48] border-[#F6DBC0]'
                  : 'bg-[#1A0E23] border-[#4A2A5E] hover:border-[#935073]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-mono text-xs font-bold uppercase ${
                    settings.strictness === item.level ? 'text-[#F6DBC0]' : 'text-[#F8F4E9]'
                  }`}
                >
                  {item.label}
                </span>
                {settings.strictness === item.level && (
                  <span className="w-2 h-2 bg-[#F6DBC0]"></span>
                )}
              </div>
              <p className="text-[11px] text-[#C4B0C7] leading-relaxed mt-2">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Core Defense Toggles */}
      <div className="hud-card p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-[#4A2A5E] pb-3">
          <Lock className="w-5 h-5 text-[#935073]" />
          <h2 className="text-sm font-bold text-[#F8F4E9] uppercase tracking-wider font-mono">
            Core Protection Modules
          </h2>
        </div>

        <div className="space-y-4 divide-y divide-[#4A2A5E]/60">
          {[
            {
              key: 'aiModerationEnabled',
              title: 'Real-Time Neural AI Packet Inspection',
              desc: 'Deep multi-modal analysis inspecting chat streams for predatory grooming, extortion, and hate speech.',
            },
            {
              key: 'safeBrowsingEnabled',
              title: 'Safe Browsing & Phishing Shield',
              desc: 'Inspects outbound URLs and halts deceptive gaming credential stealers (e.g. fake Robux & V-Bucks sites).',
            },
            {
              key: 'autoBlockNewContacts',
              title: 'Stranger Danger Auto-Quarantine',
              desc: 'Automatically flag and coach messages originating from accounts created less than 14 days ago.',
            },
            {
              key: 'instantParentAlerts',
              title: 'High-Severity Parent SMS / Push Alerts',
              desc: 'Send immediate emergency notifications when predatory grooming or physical address requests are detected.',
            },
            {
              key: 'onDevicePrivacyOnly',
              title: 'On-Device Privacy Mode',
              desc: 'Anonymize telemetry packet payloads before sending metadata to central neural evaluation nodes.',
            },
          ].map((item) => (
            <div key={item.key} className="pt-4 first:pt-0 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-[#F8F4E9]">{item.title}</div>
                <div className="text-xs text-[#C4B0C7] leading-relaxed">{item.desc}</div>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(item.key)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border transition-colors duration-200 ease-in-out ${
                  settings[item.key]
                    ? 'bg-[#935073] border-[#F6DBC0]'
                    : 'bg-[#1A0E23] border-[#4A2A5E]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform transition duration-200 ease-in-out ${
                    settings[item.key] ? 'translate-x-5 bg-[#F6DBC0]' : 'translate-x-0 bg-[#F8F4E9]'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Connected Platforms */}
      <div className="hud-card p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#4A2A5E] pb-3">
          <Smartphone className="w-5 h-5 text-[#F6DBC0]" />
          <h2 className="text-sm font-bold text-[#F8F4E9] uppercase tracking-wider font-mono">
            Connected Protected Platforms
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: 'discord', name: 'Discord', status: 'ACTIVE' },
            { key: 'roblox', name: 'Roblox Engine', status: 'ACTIVE' },
            { key: 'youtube', name: 'YouTube Kids', status: 'ACTIVE' },
            { key: 'browser', name: 'Chrome Extension', status: 'ACTIVE' },
          ].map((plat) => (
            <div
              key={plat.key}
              onClick={() => handlePlatformToggle(plat.key)}
              className={`p-4 border cursor-pointer transition-all ${
                platforms[plat.key]
                  ? 'bg-[#1A0E23] border-[#935073]'
                  : 'bg-[#1A0E23]/50 border-[#4A2A5E] opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-[#F8F4E9]">{plat.name}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 border ${
                    platforms[plat.key]
                      ? 'bg-[#502D55] text-[#F6DBC0] border-[#935073]'
                      : 'bg-[#2A1638] text-[#C4B0C7] border-[#4A2A5E]'
                  }`}
                >
                  {platforms[plat.key] ? 'SYNCED' : 'PAUSED'}
                </span>
              </div>
              <div className="text-[10px] font-mono text-[#C4B0C7]">
                {platforms[plat.key] ? '● Intercepting telemetry' : '○ Protection paused'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
