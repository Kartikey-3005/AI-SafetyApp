/**
 * SafeKids AI - Standalone Compiled Vanilla JS Popup
 * Directly runnable in Chrome Extension without extra bundlers,
 * with complete glassmorphism UI, Master Toggle and Live Threat Counter.
 */

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (!root) return;

  // Initial State
  let state = {
    shieldEnabled: true,
    threatsBlocked: 0,
    isUpdating: false
  };

  // Sync state with chrome.storage.local
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['shieldEnabled', 'threatsBlockedToday'], (data) => {
      if (data.shieldEnabled !== undefined) {
        state.shieldEnabled = data.shieldEnabled;
      }
      if (data.threatsBlockedToday !== undefined) {
        state.threatsBlocked = data.threatsBlockedToday;
      }
      render();
    });

    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        if (changes.threatsBlockedToday) {
          state.threatsBlocked = changes.threatsBlockedToday.newValue;
        }
        if (changes.shieldEnabled) {
          state.shieldEnabled = changes.shieldEnabled.newValue;
        }
        render();
      }
    });
  } else {
    render();
  }

  function render() {
    const isShieldOn = state.shieldEnabled;

    root.innerHTML = `
      <div style="
        width: 320px;
        background-color: #0F1115;
        color: #F1F5F9;
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
        padding: 16px;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        user-select: none;
      ">
        <!-- Ambient Glow -->
        <div style="
          position: absolute;
          top: -60px;
          right: -40px;
          width: 200px;
          height: 180px;
          background: ${isShieldOn ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(15, 17, 21, 0) 70%)' : 'radial-gradient(circle, rgba(244, 63, 94, 0.2) 0%, rgba(15, 17, 21, 0) 70%)'};
          filter: blur(30px);
          pointer-events: none;
          z-index: 0;
        "></div>

        <!-- Header -->
        <header style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; position: relative; z-index: 1;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="
              width: 36px;
              height: 36px;
              border-radius: 10px;
              background-color: ${isShieldOn ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.15)'};
              border: 1px solid ${isShieldOn ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.4)'};
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;
            ">
              ${isShieldOn ? '🛡️' : '⚠️'}
            </div>
            <div>
              <h1 style="margin: 0; font-size: 0.95rem; font-weight: 700; color: #FFFFFF;">SafeKids AI</h1>
              <p style="margin: 0; font-size: 0.68rem; color: #94A3B8;">Neural Browser Protection</p>
            </div>
          </div>
          <div style="
            font-size: 0.65rem;
            font-weight: 700;
            font-family: 'JetBrains Mono', monospace;
            padding: 3px 8px;
            border-radius: 9999px;
            letter-spacing: 0.05em;
            background-color: ${isShieldOn ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.15)'};
            color: ${isShieldOn ? '#34D399' : '#F87171'};
            border: 1px solid ${isShieldOn ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.3)'};
          ">
            ${isShieldOn ? 'SHIELD ACTIVE' : 'UNPROTECTED'}
          </div>
        </header>

        <!-- Metric Card -->
        <section style="
          position: relative;
          z-index: 1;
          background: rgba(22, 27, 34, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 12px;
        ">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 0.74rem; font-weight: 600; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.05em;">
              Threats Blocked Today
            </span>
            <span style="
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: #10B981;
              box-shadow: 0 0 6px #10B981;
            "></span>
          </div>
          <div style="display: flex; align-items: baseline; gap: 6px;">
            <span style="font-size: 1.9rem; font-weight: 800; color: #F8FAFC; line-height: 1.1;">
              ${state.threatsBlocked}
            </span>
            <span style="font-size: 0.78rem; color: #64748B; font-weight: 500;">Interceptions</span>
          </div>
          <p style="margin: 8px 0 0 0; font-size: 0.67rem; color: #64748B; line-height: 1.3;">
            Active multi-tier URL heuristics & Google Safe Browsing sync.
          </p>
        </section>

        <!-- Toggle Control Card -->
        <section style="
          position: relative;
          z-index: 1;
          background: rgba(22, 27, 34, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        ">
          <div style="display: flex; flex-direction: column; gap: 2px; max-width: 200px;">
            <span style="font-size: 0.84rem; font-weight: 600; color: #E2E8F0;">SafeKids Shield</span>
            <span style="font-size: 0.68rem; color: #94A3B8; line-height: 1.25;">
              ${isShieldOn ? 'Real-time URL scanning is active' : 'Filtering paused. Child navigation is unmonitored'}
            </span>
          </div>

          <button id="toggleBtn" style="
            width: 46px;
            height: 24px;
            border-radius: 12px;
            background-color: ${isShieldOn ? '#10B981' : '#334155'};
            border: none;
            cursor: pointer;
            position: relative;
            transition: background-color 0.2s ease;
            padding: 2px;
            outline: none;
            box-shadow: ${isShieldOn ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none'};
          ">
            <div style="
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color: #FFFFFF;
              transform: ${isShieldOn ? 'translateX(22px)' : 'translateX(0px)'};
              transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            "></div>
          </button>
        </section>

        <!-- Warning Banner if Off -->
        ${!isShieldOn ? `
          <div style="
            position: relative;
            z-index: 1;
            display: flex;
            align-items: center;
            gap: 8px;
            background-color: rgba(244, 63, 94, 0.1);
            border: 1px solid rgba(244, 63, 94, 0.3);
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 0.7rem;
            color: #FDA4AF;
            margin-bottom: 12px;
            line-height: 1.3;
          ">
            <span>⚠️ Parent alert: Threats will not be intercepted while shield is off.</span>
          </div>
        ` : ''}

        <!-- Footer -->
        <footer style="position: relative; z-index: 1;">
          <button id="openDashboardBtn" style="
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 9px;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #94A3B8;
            font-size: 0.74rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.15s ease;
          ">
            <span>Open Full Parental Dashboard</span>
            <span style="font-size: 11px;">↗</span>
          </button>
        </footer>
      </div>
    `;

    // Attach listeners
    const toggleBtn = document.getElementById('toggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', async () => {
        const nextState = !state.shieldEnabled;
        state.shieldEnabled = nextState;
        render();
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
          await chrome.storage.local.set({ shieldEnabled: nextState });
        }
      });
    }

    const openDashboardBtn = document.getElementById('openDashboardBtn');
    if (openDashboardBtn) {
      openDashboardBtn.addEventListener('click', () => {
        const dashboardUrl = 'http://localhost:5173';
        if (typeof chrome !== 'undefined' && chrome.tabs) {
          chrome.tabs.create({ url: dashboardUrl });
        } else {
          window.open(dashboardUrl, '_blank');
        }
      });
    }
  }
});
