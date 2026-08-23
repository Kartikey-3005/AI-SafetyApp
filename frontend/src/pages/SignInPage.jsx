import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, User, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const { loginWithEmail, registerWithEmail, loginWithGoogle, user, logout } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PARENT');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Pre-configured Quick Demo Accounts
  const demoAccounts = [
    {
      title: 'Parent / Guardian Demo',
      email: 'guardian@safekids.ai',
      password: 'SafeKids2026!',
      role: 'PARENT',
      badge: 'Admin Guardian',
    },
    {
      title: 'Youth Learner Demo',
      email: 'child@safekids.ai',
      password: 'SafeKids2026!',
      role: 'CHILD',
      badge: 'Protected Child',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await registerWithEmail(name, email, password, role);
      } else {
        result = await loginWithEmail(email, password);
      }

      if (result.success) {
        setSuccessMsg(isSignUp ? 'Account successfully registered!' : 'Welcome back!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        setErrorMsg(result.error || 'Authentication failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      // Realistic Google Identity Profile Simulation
      const googleUserPayload = {
        name: name || 'Google User',
        email: email || 'user.google@safekids.ai',
        googleId: `google_${Date.now()}`,
        avatarUrl: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        role: role || 'PARENT',
      };

      const result = await loginWithGoogle(googleUserPayload);
      if (result.success) {
        setSuccessMsg('Google authentication verified!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        setErrorMsg(result.error || 'Google login failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Google authentication encountered an error.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    const result = await loginWithEmail(demo.email, demo.password);
    if (result.success) {
      setSuccessMsg(`Logged in as ${demo.title}!`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 700);
    } else {
      setErrorMsg(result.error || 'Demo login failed.');
    }
    setLoading(false);
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="hud-card p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-[#1A0E23] border border-[#F6DBC0] mx-auto flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-[#F6DBC0]" />
          </div>

          <div>
            <h2 className="text-xl font-black tracking-wider text-[#F8F4E9]">ACTIVE SESSION DETECTED</h2>
            <p className="text-xs font-mono text-[#C4B0C7] mt-1">
              Currently signed in as <strong className="text-[#F6DBC0]">{user.name}</strong> ({user.email})
            </p>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-[#502D55] text-[#F6DBC0] border border-[#935073] text-[10px] font-mono font-bold uppercase">
              Role: {user.role}
            </span>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/dashboard"
              className="hud-button-primary py-2.5 text-xs font-mono font-bold flex items-center justify-center gap-2"
            >
              GO TO DASHBOARD <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={logout}
              className="hud-button-secondary py-2.5 text-xs font-mono font-bold"
            >
              SIGN OUT CURRENT USER
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      {/* Header Badge */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2A1638] border border-[#4A2A5E] text-[#F6DBC0] text-xs font-mono font-bold tracking-widest uppercase">
          <Shield className="w-3.5 h-3.5 text-[#F6DBC0]" /> Neural Guardian Access Portal
        </div>
        <h1 className="text-3xl font-black tracking-tight text-[#F8F4E9] uppercase">
          {isSignUp ? 'Create Guardian Account' : 'Sign In To SafeKids AI'}
        </h1>
        <p className="text-xs font-mono text-[#C4B0C7]">
          Secure multi-layer gatekeeper telemetry & real-time child protection
        </p>
      </div>

      {/* Main Form Card */}
      <div className="hud-card p-8 space-y-6">
        {/* Toggle Mode: Sign In vs Sign Up */}
        <div className="flex border border-[#4A2A5E] p-1 bg-[#1A0E23]">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all ${
              !isSignUp
                ? 'bg-[#381E48] text-[#F6DBC0] border border-[#935073]'
                : 'text-[#C4B0C7] hover:text-[#F8F4E9]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all ${
              isSignUp
                ? 'bg-[#381E48] text-[#F6DBC0] border border-[#935073]'
                : 'text-[#C4B0C7] hover:text-[#F8F4E9]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Alerts */}
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

        {/* Google Authentication Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 bg-[#1A0E23] border border-[#4A2A5E] hover:border-[#F6DBC0] text-[#F8F4E9] hover:text-[#F6DBC0] text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            CONTINUE WITH GOOGLE
          </button>
        </div>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-[1px] bg-[#4A2A5E]"></div>
          <span className="text-[10px] font-mono text-[#C4B0C7] uppercase">Or with email</span>
          <div className="flex-1 h-[1px] bg-[#4A2A5E]"></div>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-mono text-[#C4B0C7] mb-1">FULL NAME</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#C4B0C7] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full bg-[#1A0E23] border border-[#4A2A5E] pl-10 pr-4 py-2.5 text-xs font-mono text-[#F8F4E9] placeholder-[#C4B0C7]/40 focus:border-[#F6DBC0] outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-[#C4B0C7] mb-1">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#C4B0C7] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guardian@example.com"
                className="w-full bg-[#1A0E23] border border-[#4A2A5E] pl-10 pr-4 py-2.5 text-xs font-mono text-[#F8F4E9] placeholder-[#C4B0C7]/40 focus:border-[#F6DBC0] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#C4B0C7] mb-1">PASSWORD</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#C4B0C7] absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#1A0E23] border border-[#4A2A5E] pl-10 pr-10 py-2.5 text-xs font-mono text-[#F8F4E9] placeholder-[#C4B0C7]/40 focus:border-[#F6DBC0] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#C4B0C7] hover:text-[#F8F4E9]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-mono text-[#C4B0C7] mb-1">ACCOUNT TYPE</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#1A0E23] border border-[#4A2A5E] px-3 py-2 text-xs font-mono text-[#F8F4E9] focus:border-[#F6DBC0] outline-none"
              >
                <option value="PARENT">Parent / Legal Guardian</option>
                <option value="CHILD">Youth Learner (Child Account)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full hud-button-primary py-3 text-xs font-mono font-black tracking-wider flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'AUTHENTICATING...' : isSignUp ? 'CREATE GUARDIAN ACCOUNT' : 'SECURE SIGN IN'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Accounts */}
        <div className="border-t border-[#4A2A5E] pt-5 space-y-3">
          <span className="text-[11px] font-mono text-[#C4B0C7] uppercase block">
            One-Click Demo Profiles:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {demoAccounts.map((demo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickDemoLogin(demo)}
                className="p-3 bg-[#1A0E23] border border-[#4A2A5E] hover:border-[#F6DBC0] text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold text-[#F8F4E9] group-hover:text-[#F6DBC0]">
                    {demo.title}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-[#C4B0C7] truncate">{demo.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
