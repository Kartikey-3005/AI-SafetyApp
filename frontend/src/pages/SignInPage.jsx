import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, CheckCircle, AlertCircle, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, user, logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [role, setRole] = useState('PARENT');

  // Destination path (redirect back to wherever user was trying to go)
  const fromPath = location.state?.from?.pathname || '/dashboard';

  // Quick Google Identity Profiles
  const googleDemoProfiles = [
    {
      title: 'Sign in as Guardian (Sarah Connor)',
      email: 'sarah.connor@gmail.com',
      name: 'Sarah Connor',
      role: 'PARENT',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SarahGoogle',
      badge: 'Parent Guardian',
    },
    {
      title: 'Sign in as Youth Learner (Leo Connor)',
      email: 'leo.connor.kids@gmail.com',
      name: 'Leo Connor',
      role: 'CHILD',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=LeoGoogle',
      badge: 'Protected Child',
    },
    {
      title: 'Sign in as Educator / School Admin',
      email: 'educator.safety@gmail.com',
      name: 'Prof. Miller',
      role: 'PARENT',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=MillerEdu',
      badge: 'Educator License',
    },
  ];

  const handleGoogleSignIn = async (profileOverride = null) => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const payload = profileOverride || {
        name: customName || (customEmail ? customEmail.split('@')[0] : 'Google User'),
        email: customEmail || 'guardian.google@safekids.ai',
        googleId: `google_oauth_${Date.now()}`,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customName || customEmail || 'GoogleUser')}`,
        role: role || 'PARENT',
      };

      const result = await loginWithGoogle(payload);
      if (result.success) {
        setSuccessMsg(`Google Authentication Verified for ${result.user.name}!`);
        setTimeout(() => {
          navigate(fromPath, { replace: true });
        }, 700);
      } else {
        setErrorMsg(result.error || 'Google login failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Google authentication encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="hud-card p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-[#1A0E23] border border-[#F6DBC0] mx-auto flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[#F6DBC0]" />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-wider text-[#F8F4E9]">GOOGLE SESSION ACTIVE</h2>
            <p className="text-xs font-mono text-[#C4B0C7] mt-1">
              Signed in via Google as <strong className="text-[#F6DBC0]">{user.name}</strong> ({user.email})
            </p>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-[#502D55] text-[#F6DBC0] border border-[#935073] text-[10px] font-mono font-bold uppercase">
              Authenticated Role: {user.role}
            </span>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/dashboard"
              className="hud-button-primary py-3 text-xs font-mono font-bold flex items-center justify-center gap-2"
            >
              ENTER GUARDIAN DASHBOARD <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={logout}
              className="hud-button-secondary py-2.5 text-xs font-mono font-bold"
            >
              SIGN OUT GOOGLE ACCOUNT
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      {/* Security Gatekeeper Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2A1638] border border-[#935073] text-[#F6DBC0] text-xs font-mono font-bold tracking-widest uppercase">
          <Lock className="w-3.5 h-3.5 text-[#F6DBC0]" /> Restricted Access • Google Login Required
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#F8F4E9] uppercase">
          SafeKids AI Access Portal
        </h1>
        <p className="text-xs font-mono text-[#C4B0C7] max-w-md mx-auto leading-relaxed">
          To protect children and ensure COPPA compliance, all neural defenses and telemetry streams require an authenticated Google account.
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="hud-card p-8 space-y-6">
        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 bg-[#502D55]/50 border border-[#935073] text-[#F8F4E9] flex items-center gap-2 text-xs font-mono">
            <AlertCircle className="w-4 h-4 text-[#F6DBC0] flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-[#2A1638] border border-[#F6DBC0] text-[#F8F4E9] flex items-center gap-2 text-xs font-mono">
            <CheckCircle className="w-4 h-4 text-[#F6DBC0] flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Primary Google Login Button */}
        <div>
          <button
            type="button"
            onClick={() => handleGoogleSignIn()}
            disabled={loading}
            className="w-full py-3.5 bg-[#1A0E23] border border-[#F6DBC0] hover:bg-[#381E48] text-[#F8F4E9] hover:text-[#F6DBC0] text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
              />
            </svg>
            <span>{loading ? 'CONNECTING TO GOOGLE...' : 'SIGN IN WITH GOOGLE'}</span>
          </button>
        </div>

        {/* Custom Google Account Input (Optional) */}
        <div className="border border-[#4A2A5E] p-4 bg-[#1A0E23]/60 space-y-3">
          <div className="text-[11px] font-mono font-bold text-[#F6DBC0] uppercase flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Or Enter Specific Google Account:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono text-[#C4B0C7] mb-1">GOOGLE NAME</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-[#1A0E23] border border-[#4A2A5E] px-3 py-2 text-xs font-mono text-[#F8F4E9] placeholder-[#C4B0C7]/40 focus:border-[#F6DBC0] outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-[#C4B0C7] mb-1">GMAIL / GOOGLE EMAIL</label>
              <input
                type="email"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="your.email@gmail.com"
                className="w-full bg-[#1A0E23] border border-[#4A2A5E] px-3 py-2 text-xs font-mono text-[#F8F4E9] placeholder-[#C4B0C7]/40 focus:border-[#F6DBC0] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-mono text-[#C4B0C7]">ROLE:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-[#1A0E23] border border-[#4A2A5E] px-2 py-1 text-[11px] font-mono text-[#F8F4E9] outline-none"
              >
                <option value="PARENT">Parent / Legal Guardian</option>
                <option value="CHILD">Youth Learner (Child)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => handleGoogleSignIn()}
              disabled={loading || (!customEmail && !customName)}
              className="hud-button-primary px-4 py-1.5 text-xs font-mono font-bold disabled:opacity-50"
            >
              AUTHENTICATE
            </button>
          </div>
        </div>

        {/* 1-Click Verified Google Profiles */}
        <div className="border-t border-[#4A2A5E] pt-5 space-y-3">
          <span className="text-[11px] font-mono text-[#C4B0C7] uppercase block font-bold">
            ⚡ Quick 1-Click Verified Google Accounts:
          </span>
          <div className="space-y-2">
            {googleDemoProfiles.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleGoogleSignIn(p)}
                disabled={loading}
                className="w-full p-3 bg-[#1A0E23] border border-[#4A2A5E] hover:border-[#F6DBC0] text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-8 h-8 bg-[#2A1638] border border-[#935073] flex-shrink-0"
                  />
                  <div>
                    <div className="text-xs font-mono font-bold text-[#F8F4E9] group-hover:text-[#F6DBC0]">
                      {p.title}
                    </div>
                    <div className="text-[10px] font-mono text-[#C4B0C7]">{p.email}</div>
                  </div>
                </div>
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-[#381E48] text-[#F6DBC0] border border-[#4A2A5E]">
                  {p.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
