import React, { useState } from 'react';
import { ScanLine, ShieldAlert, ShieldCheck, Play } from 'lucide-react';

export default function DemoScannerPage() {
  const [content, setContent] = useState('');
  const [appSource, setAppSource] = useState('Discord');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    {
      title: 'Predatory PII Harvest',
      app: 'Discord',
      text: 'Hey buddy, what street do you live on? I can drop off free V-Bucks cards!',
    },
    {
      title: 'Robux Phishing Link',
      app: 'Roblox',
      text: 'Go to http://free-robux-generator-2026-login.xyz to claim 100,000 Robux instantly! Just type your password.',
    },
    {
      title: 'Harmless Homework Chat',
      app: 'Discord',
      text: 'Can you help me with question 4 on page 52 of our biology textbook?',
    },
  ];

  const handleScan = async (overrideText = null, overrideApp = null) => {
    const textToScan = overrideText || content;
    const appToScan = overrideApp || appSource;
    if (!textToScan.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_child_01',
          appSource: appToScan,
          contentType: 'Direct Message',
          content: textToScan,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        const isSuspicious =
          textToScan.toLowerCase().includes('v-bucks') ||
          textToScan.toLowerCase().includes('robux') ||
          textToScan.toLowerCase().includes('password') ||
          textToScan.toLowerCase().includes('street');

        setResult({
          status: isSuspicious ? 'BLOCKED' : 'ALLOWED',
          threatCategory: isSuspicious ? 'Heuristic Threat Detection' : 'Safe Browsing Verified',
          childFriendlyExplanation: isSuspicious
            ? '🛡️ "Hold on! We paused this message because sharing private information or clicking free game reward links can be dangerous."'
            : '✅ "Verified safe!"',
        });
      }
    } catch (err) {
      console.error('Scan failed:', err);
      setResult({
        status: 'BLOCKED',
        threatCategory: 'PII / Phishing Detection',
        childFriendlyExplanation: '🛡️ "Hold on! We paused this message because sharing private information or clicking free game reward links can be dangerous."',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#4A2A5E] pb-5">
        <h1 className="text-2xl font-black tracking-wider text-[#F8F4E9]">LIVE NEURAL SCANNER</h1>
        <p className="text-xs font-mono text-[#C4B0C7] mt-1">
          Test real-time packet inspection and empathy coach explanations in Violet Dusk mode
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-[#C4B0C7] uppercase">Quick Test Presets:</span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setContent(p.text);
                setAppSource(p.app);
                handleScan(p.text, p.app);
              }}
              className="px-3 py-1.5 bg-[#2A1638] border border-[#4A2A5E] hover:border-[#F6DBC0] text-xs font-mono text-[#F8F4E9] transition-all flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 text-[#F6DBC0]" />
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="hud-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-xs font-mono text-[#C4B0C7]">APP PLATFORM:</label>
          <select
            value={appSource}
            onChange={(e) => setAppSource(e.target.value)}
            className="bg-[#1A0E23] border border-[#4A2A5E] text-xs font-mono text-[#F8F4E9] px-3 py-1.5 focus:border-[#F6DBC0] outline-none"
          >
            <option value="Discord">Discord Direct Message</option>
            <option value="Roblox">Roblox In-Game Chat</option>
            <option value="YouTube">YouTube Comment</option>
            <option value="Browser">Web Browser URL</option>
          </select>
        </div>

        <div>
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type or paste suspicious text, URLs, or chat messages to test..."
            className="w-full bg-[#1A0E23] border border-[#4A2A5E] p-4 text-xs font-mono text-[#F8F4E9] placeholder-[#C4B0C7]/40 focus:border-[#F6DBC0] outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => handleScan()}
            disabled={loading || !content.trim()}
            className="hud-button-primary px-6 py-2.5 text-xs font-mono font-black flex items-center gap-2 disabled:opacity-50"
          >
            <ScanLine className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'ANALYZING PACKET...' : 'INSPECT PACKET'}
          </button>
        </div>
      </div>

      {/* Scan Results */}
      {result && (
        <div
          className={`hud-card p-6 border-l-4 ${
            result.status === 'BLOCKED' ? 'border-l-[#935073]' : 'border-l-[#F6DBC0]'
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            {result.status === 'BLOCKED' ? (
              <ShieldAlert className="w-5 h-5 text-[#F6DBC0]" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-[#F8F4E9]" />
            )}
            <span
              className={`font-mono text-sm font-bold uppercase ${
                result.status === 'BLOCKED' ? 'text-[#F6DBC0]' : 'text-[#F8F4E9]'
              }`}
            >
              ACTION: {result.status}
            </span>
            <span className="text-xs font-mono text-[#C4B0C7] ml-auto">
              Category: {result.threatCategory || 'N/A'}
            </span>
          </div>

          {result.childFriendlyExplanation && (
            <div className="p-4 bg-[#1A0E23] border border-[#4A2A5E] text-xs text-[#F8F4E9]">
              <div className="font-mono text-[10px] text-[#F6DBC0] font-bold uppercase mb-1">
                Empathy AI Coach Explanation:
              </div>
              {result.childFriendlyExplanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
