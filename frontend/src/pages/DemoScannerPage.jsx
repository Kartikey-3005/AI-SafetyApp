import React, { useState } from 'react';
import { ScanLine, ShieldAlert, ShieldCheck, Play, AlertTriangle, Clock } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function DemoScannerPage() {
  const [content, setContent] = useState('');
  const [appSource, setAppSource] = useState('Browser');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState(null);
  const [connectionError, setConnectionError] = useState(null);

  const presets = [
    {
      title: 'Adult Website (Pornhub)',
      app: 'Browser',
      text: 'https://www.pornhub.com',
    },
    {
      title: 'Direct IP Access (192.168.1.1)',
      app: 'Browser',
      text: 'http://192.168.1.1/admin',
    },
    {
      title: 'India DoT Banned (Desiflix)',
      app: 'Browser',
      text: 'https://desiflix.com',
    },
    {
      title: 'Suspicious TLD (.xyz Gaming Phish)',
      app: 'Browser',
      text: 'http://claim-free-robux-rewards.xyz',
    },
    {
      title: 'National Geographic Kids (Safe)',
      app: 'Browser',
      text: 'https://kids.nationalgeographic.com',
    },
  ];

  /**
   * Sanitizes input by automatically stripping markdown brackets [],
   * parentheses (), and trailing whitespace before dispatching.
   */
  const sanitizeInput = (input) => {
    if (!input) return '';
    return input.replace(/[\[\]\(\)]/g, '').trim();
  };

  const handleScan = async (overrideText = null, overrideApp = null) => {
    const rawInput = overrideText || content;
    const sanitizedUrl = sanitizeInput(rawInput);
    const appToScan = overrideApp || appSource;

    if (!sanitizedUrl) return;

    setLoading(true);
    setResult(null);
    setConnectionError(null);
    const startTime = performance.now();

    try {
      // Connect to real backend endpoint
      const response = await fetch(`${API_BASE_URL}/api/scan/url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'user_child_01',
          url: sanitizedUrl,
        }),
      });

      const roundTripMs = (performance.now() - startTime).toFixed(1);
      setLatencyMs(roundTripMs);

      const data = await response.json();

      if (response.status === 403 || data.status === 'BLOCKED') {
        setResult({
          status: 'BLOCKED',
          category: data.category || data.blockedReason || 'Security Threat Filter',
          childFriendlyExplanation:
            data.childFriendlyExplanation ||
            `🛡️ "Navigation halted: ${data.blockedReason || 'Destination blocked for child protection.'}"`,
          fromCache: !!data.fromCache,
          url: sanitizedUrl,
        });
      } else if (response.ok) {
        setResult({
          status: 'ALLOWED',
          category: data.category || 'Safe Browsing Verified',
          childFriendlyExplanation:
            data.childFriendlyExplanation || '✅ "Verified safe and secure browsing destination."',
          fromCache: !!data.fromCache,
          url: sanitizedUrl,
        });
      } else {
        throw new Error(data.message || `Server returned status code ${response.status}`);
      }
    } catch (err) {
      const failedRoundTripMs = (performance.now() - startTime).toFixed(1);
      setLatencyMs(failedRoundTripMs);
      console.error('Scan request failure:', err);

      setConnectionError(
        `Backend Connection Failure: Unable to reach server on port 5000 (${err.message}). Verify that your Node.js backend is running.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#384358] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-[#FFF1EB]">LIVE NEURAL SCANNER</h1>
          <p className="text-xs font-mono text-[#A2B0C7] mt-1">
            Real-Time Multi-Tier URL Inspection & Regional Protection Gateway
          </p>
        </div>

        {/* Dynamic Telemetry Display */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161E2F] border border-[#384358] text-[#FFA586]">
            <Clock className="w-3.5 h-3.5" />
            <span>Telemetry Latency: </span>
            <span className="font-bold text-[#FFF1EB] ml-1">
              {latencyMs !== null ? `${latencyMs} ms` : 'Idle'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Error Banner on Network Failure */}
      {connectionError && (
        <div className="p-4 bg-[#B51A2B]/20 border border-[#B51A2B] text-[#FFF1EB] flex items-start gap-3 font-mono text-xs">
          <AlertTriangle className="w-5 h-5 text-[#B51A2B] flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-[#FFA586] block">COMMUNICATION_ERROR</strong>
            <span>{connectionError}</span>
          </div>
        </div>
      )}

      {/* Preset Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-[#A2B0C7] uppercase">Quick Test Vectors:</span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setContent(p.text);
                setAppSource(p.app);
                handleScan(p.text, p.app);
              }}
              className="px-3 py-1.5 bg-[#242F49] border border-[#384358] hover:border-[#FFA586] text-xs font-mono text-[#FFF1EB] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3 h-3 text-[#FFA586]" />
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="hud-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-xs font-mono text-[#A2B0C7]">PLATFORM CONTEXT:</label>
          <select
            value={appSource}
            onChange={(e) => setAppSource(e.target.value)}
            className="bg-[#161E2F] border border-[#384358] text-xs font-mono text-[#FFF1EB] px-3 py-1.5 focus:border-[#FFA586] outline-none cursor-pointer"
          >
            <option value="Browser">Web Browser Gateway (Chrome/Edge)</option>
            <option value="Discord">Discord Embedded URL</option>
            <option value="Roblox">Roblox Experience Link</option>
            <option value="YouTube">YouTube Description URL</option>
          </select>
        </div>

        <div>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter destination URL or domain (e.g. [https://www.pornhub.com], http://192.168.1.1, https://desiflix.com)..."
            className="w-full bg-[#161E2F] border border-[#384358] p-4 text-xs font-mono text-[#FFF1EB] placeholder-[#A2B0C7]/40 focus:border-[#FFA586] outline-none"
          />
          <div className="text-[10px] font-mono text-[#A2B0C7] mt-1">
            * Markdown brackets `[]`, `()` and extra spaces are sanitized automatically before transmission.
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-xs font-mono text-[#A2B0C7]">
            Active Endpoint: <span className="text-[#FFA586]">{API_BASE_URL}/api/scan/url</span>
          </div>
          <button
            onClick={() => handleScan()}
            disabled={loading || !content.trim()}
            className="hud-button-primary px-6 py-2.5 text-xs font-mono font-black flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <ScanLine className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'INSPECTING VIA PIPELINE...' : 'INSPECT PACKET'}
          </button>
        </div>
      </div>

      {/* Real Scan Results Banner */}
      {result && (
        <div
          className={`hud-card p-6 border-l-4 transition-all ${
            result.status === 'BLOCKED'
              ? 'border-l-[#B51A2B] bg-[#242F49]'
              : 'border-l-[#10B981] bg-[#242F49]'
          }`}
        >
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {result.status === 'BLOCKED' ? (
                <ShieldAlert className="w-5 h-5 text-[#B51A2B]" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              )}
              <span
                className={`font-mono text-sm font-black tracking-wider uppercase ${
                  result.status === 'BLOCKED' ? 'text-[#FFA586]' : 'text-[#10B981]'
                }`}
              >
                GATEWAY VERDICT: {result.status}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              {result.fromCache && (
                <span className="px-2 py-0.5 bg-[#161E2F] border border-[#384358] text-[#FFA586] text-[10px]">
                  ⚡ REDIS CACHED
                </span>
              )}
              <span className="text-[#A2B0C7]">
                Threat Vector: <strong className="text-[#FFF1EB]">{result.category}</strong>
              </span>
            </div>
          </div>

          {/* Child-Friendly Empathy Coach Explanation */}
          {result.childFriendlyExplanation && (
            <div
              className={`p-4 border text-xs font-sans mt-3 ${
                result.status === 'BLOCKED'
                  ? 'bg-[#541A2E]/50 border-[#B51A2B] text-[#FFF1EB]'
                  : 'bg-[#064E3B]/40 border-[#10B981] text-[#ECFDF5]'
              }`}
            >
              <div
                className={`font-mono text-[10px] font-bold uppercase mb-1 ${
                  result.status === 'BLOCKED' ? 'text-[#FFA586]' : 'text-[#34D399]'
                }`}
              >
                SafeKids Empathy AI Guidance:
              </div>
              {result.childFriendlyExplanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
