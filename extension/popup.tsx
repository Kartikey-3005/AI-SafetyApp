import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';

export default function Popup() {
  const [shieldEnabled, setShieldEnabled] = useState(true);
  const [threatsBlocked, setThreatsBlocked] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [recentSyncTime, setRecentSyncTime] = useState('Just now');

  // Load storage state on mount
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['shieldEnabled', 'threatsBlockedToday'], (result) => {
        if (result.shieldEnabled !== undefined) {
          setShieldEnabled(result.shieldEnabled);
        }
        if (result.threatsBlockedToday !== undefined) {
          setThreatsBlocked(result.threatsBlockedToday);
        }
      });

      // Listen for dynamic updates (e.g., when a threat is intercepted in background)
      const handleStorageChange = (changes, area) => {
        if (area === 'local') {
          if (changes.threatsBlockedToday) {
            setThreatsBlocked(changes.threatsBlockedToday.newValue);
          }
          if (changes.shieldEnabled) {
            setShieldEnabled(changes.shieldEnabled.newValue);
          }
        }
      };

      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => chrome.storage.onChanged.removeListener(handleStorageChange);
    }
  }, []);

  // Toggle SafeKids master shield
  const handleToggleShield = async () => {
    setIsUpdating(true);
    const nextState = !shieldEnabled;
    setShieldEnabled(nextState);

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ shieldEnabled: nextState });
    }
    setTimeout(() => setIsUpdating(false), 200);
  };

  // Open Full Parent Dashboard
  const handleOpenParentDashboard = () => {
    const parentDashboardUrl = 'http://localhost:5173';
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: parentDashboardUrl });
    } else {
      window.open(parentDashboardUrl, '_blank');
    }
  };

  return (
    <div style={styles.container}>
      {/* Background ambient red/blue glow */}
      <div style={styles.ambientGlow(shieldEnabled)}></div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.brandIconWrapper(shieldEnabled)}>
            {shieldEnabled ? (
              <ShieldCheck size={20} color="#10B981" />
            ) : (
              <ShieldAlert size={20} color="#F43F5E" />
            )}
          </div>
          <div>
            <h1 style={styles.brandTitle}>SafeKids AI</h1>
            <p style={styles.brandSubtitle}>Neural Browser Protection</p>
          </div>
        </div>
        <div style={styles.badge(shieldEnabled)}>
          {shieldEnabled ? 'SHIELD ACTIVE' : 'UNPROTECTED'}
        </div>
      </header>

      {/* Threat Counter Metric Card */}
      <section style={styles.metricCard}>
        <div style={styles.metricHeader}>
          <span style={styles.metricLabel}>Threats Blocked Today</span>
          <span style={styles.metricLiveDot}></span>
        </div>
        <div style={styles.metricValueRow}>
          <span style={styles.metricValue}>{threatsBlocked}</span>
          <span style={styles.metricUnit}>Interceptions</span>
        </div>
        <p style={styles.metricFootnote}>
          Multi-tier heuristics & Google Safe Browsing database sync.
        </p>
      </section>

      {/* Master Toggle Control Card */}
      <section style={styles.controlCard}>
        <div style={styles.controlInfo}>
          <span style={styles.controlTitle}>SafeKids Shield</span>
          <span style={styles.controlDescription}>
            {shieldEnabled
              ? 'Real-time URL packet scanning is active'
              : 'Filtering paused. Child navigation is unmonitored'}
          </span>
        </div>

        <button
          onClick={handleToggleShield}
          disabled={isUpdating}
          style={styles.toggleTrack(shieldEnabled)}
          aria-label="Toggle SafeKids Shield"
          id="toggle-safekids-shield"
        >
          <div style={styles.toggleThumb(shieldEnabled)} />
        </button>
      </section>

      {/* Warning banner when disabled */}
      {!shieldEnabled && (
        <div style={styles.warningBanner}>
          <AlertTriangle size={16} color="#F87171" style={{ flexShrink: 0 }} />
          <span>Parent alert: URL threats will not be blocked while shield is off.</span>
        </div>
      )}

      {/* Footer / Quick Actions */}
      <footer style={styles.footer}>
        <button
          onClick={handleOpenParentDashboard}
          style={styles.dashboardBtn}
          id="btn-open-dashboard"
        >
          <span>Open Full Parental Dashboard</span>
          <ExternalLink size={14} />
        </button>
      </footer>
    </div>
  );
}

// Minimalist glassmorphic dark theme styles (#0F1115)
const styles = {
  container: {
    width: '320px',
    backgroundColor: '#0F1115',
    color: '#F1F5F9',
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: '16px',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
  },
  ambientGlow: (active) => ({
    position: 'absolute',
    top: '-60px',
    right: '-40px',
    width: '200px',
    height: '180px',
    background: active
      ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(15, 17, 21, 0) 70%)'
      : 'radial-gradient(circle, rgba(244, 63, 94, 0.2) 0%, rgba(15, 17, 21, 0) 70%)',
    filter: 'blur(30px)',
    pointerEvents: 'none',
    zIndex: 0,
  }),
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    position: 'relative',
    zIndex: 1,
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandIconWrapper: (active) => ({
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: active ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.15)',
    border: `1px solid ${active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.4)'}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  brandTitle: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: '700',
    letterSpacing: '-0.01em',
    color: '#FFFFFF',
  },
  brandSubtitle: {
    margin: 0,
    fontSize: '0.68rem',
    color: '#94A3B8',
  },
  badge: (active) => ({
    fontSize: '0.65rem',
    fontWeight: '700',
    fontFamily: "'JetBrains Mono', monospace",
    padding: '3px 8px',
    borderRadius: '9999px',
    letterSpacing: '0.05em',
    backgroundColor: active ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.15)',
    color: active ? '#34D399' : '#F87171',
    border: `1px solid ${active ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.3)'}`,
  }),
  metricCard: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(22, 27, 34, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '12px',
  },
  metricHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  metricLabel: {
    fontSize: '0.74rem',
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  metricLiveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#10B981',
    boxShadow: '0 0 6px #10B981',
  },
  metricValueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
  },
  metricValue: {
    fontSize: '1.9rem',
    fontWeight: '800',
    color: '#F8FAFC',
    lineHeight: 1.1,
  },
  metricUnit: {
    fontSize: '0.78rem',
    color: '#64748B',
    fontWeight: '500',
  },
  metricFootnote: {
    margin: '8px 0 0 0',
    fontSize: '0.67rem',
    color: '#64748B',
    lineHeight: 1.3,
  },
  controlCard: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(22, 27, 34, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '12px',
    padding: '12px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  controlInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    maxWidth: '200px',
  },
  controlTitle: {
    fontSize: '0.84rem',
    fontWeight: '600',
    color: '#E2E8F0',
  },
  controlDescription: {
    fontSize: '0.68rem',
    color: '#94A3B8',
    lineHeight: 1.25,
  },
  toggleTrack: (active) => ({
    width: '46px',
    height: '24px',
    borderRadius: '12px',
    backgroundColor: active ? '#10B981' : '#334155',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s ease',
    padding: '2px',
    outline: 'none',
    boxShadow: active ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
  }),
  toggleThumb: (active) => ({
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    transform: active ? 'translateX(22px)' : 'translateX(0px)',
    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
  }),
  warningBanner: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    borderRadius: '8px',
    padding: '8px 10px',
    fontSize: '0.7rem',
    color: '#FDA4AF',
    marginBottom: '12px',
    lineHeight: 1.3,
  },
  footer: {
    position: 'relative',
    zIndex: 1,
  },
  dashboardBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '9px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#94A3B8',
    fontSize: '0.74rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
};
