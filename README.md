# 🛡️ SafeKids AI — Neural Defense & Child Cyber Safety Platform

[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%203.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%205-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis&logoColor=white)](https://redis.io/)
[![AI Powered](https://img.shields.io/badge/AI-OpenAI%20%2B%20Google%20Safe%20Browsing-FF6F00)](https://openai.com/)

**SafeKids AI** is an intelligent cyber safety and neural defense platform engineered to protect children across web browsers, messaging platforms, Discord, Roblox, and YouTube. Combining a multi-layer real-time inspection engine, child-friendly AI coaching, regulatory compliance, and a gamified cyber pet companion, SafeKids AI safeguards young digital explorers while educating them on safe cyber citizenship.

---

## ✨ Key Features

- **🔍 Multi-Layer Threat Inspection Pipeline (6-Tier Engine)**:
  - **Local Heuristics & RegEx**: Detects PII leakage (phone numbers, Aadhaar/SSN, credentials, physical addresses), toxicity, and suspicious keywords instantly with zero latency.
  - **India Regulatory & Banned Domains Blocklist**: Built-in enforcement for illegal gambling/betting platforms, predatory apps, cyber fraud, and MeitY/DoT prohibited domains.
  - **Google Safe Browsing API**: Real-time identification of malware, social engineering, phishing, and deceptive domains.
  - **OpenAI Moderation Engine**: Deep semantic analysis across harassment, hate speech, self-harm, sexual content, and cyberbullying.
  - **Intelligent Explainer & AI Coach**: Translates complex security threats into age-appropriate, compassionate guidance for children, alongside actionable diagnostic breakdowns for parents.
  - **Redis / In-Memory Ultra-Fast Cache**: Re-evaluates frequently scanned URLs and content with sub-millisecond response times.

- **🎮 Gamified Cyber Defense Companion ("VIPER-007")**:
  - Virtual cyber pet that gains XP and levels up as children browse safely and avoid dangerous interactions.
  - Interactive Safety Streak counter and digital health meters.

- **📊 Comprehensive Parent Command Dashboard**:
  - Real-time threat analytics, safety score metrics, and categorized incident breakdowns.
  - Live activity feed tracking inspected messages, URLs, and queries across Discord, Roblox, YouTube, and Chrome.
  - Custom protection settings (Strictness levels, auto-block unknown contacts, instant parent alerts).

- **⚡ Interactive Live Scanner Demo Tool**:
  - Dedicated interactive testing page (`/scan`) for parents and children to test URLs, simulated chat messages, or suspicious links in real time.

- **🔒 Built-in Zero-Config Fallback Mode**:
  - Seamlessly runs out-of-the-box with built-in memory stores and intelligent heuristics even if PostgreSQL, Redis, or external API keys are not locally configured.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend (React 18 + Vite + Tailwind CSS)"]
        UI["Web App (Dashboard, Live Scanner, Logs, Settings)"]
        AuthCtx["Auth Context & Protected Routes"]
    end

    subgraph Backend["Backend (Node.js + Express API)"]
        Server["Express Server (:5000)"]
        ScanCtrl["Scan Controller (/api/scan)"]
        DashCtrl["Dashboard Controller (/api/dashboard)"]
        AuthCtrl["Auth Controller (/api/auth)"]
        
        subgraph Pipeline["6-Tier Neural Inspection Engine"]
            CacheLayer["1. Redis / In-Memory Cache"]
            RegExLayer["2. PII, Toxicity & Heuristic Matcher"]
            GovtBlock["3. India Regulatory & Banned Domains Filter"]
            SafeBrowse["4. Google Safe Browsing API"]
            OAIMod["5. OpenAI Semantic Moderation"]
            AICoach["6. Child Coach & Parent Diagnostic Explainer"]
        end
    end

    subgraph Storage["Data & Cache Layer"]
        PG[("PostgreSQL via Prisma")]
        RedisDB[("Redis Cache / In-Memory Fallback")]
    end

    UI -->|HTTP / JSON| Server
    Server --> ScanCtrl & DashCtrl & AuthCtrl
    ScanCtrl --> Pipeline
    Pipeline --> CacheLayer --> RegExLayer --> GovtBlock --> SafeBrowse --> OAIMod --> AICoach
    DashCtrl --> PG
    Pipeline --> RedisDB
    Pipeline --> PG
```

---

## 📁 Repository Structure

```text
AI-Safety App/
├── frontend/                     # React 18 + Vite + Tailwind CSS Single Page Application
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProtectedRoute, ActivityFeed, StatCard, PetStatusCard
│   │   ├── context/              # AuthContext (Google Sign-In simulation & session state)
│   │   ├── pages/                # LandingPage (/), Dashboard (/dashboard), Logs (/logs), Settings (/settings), DemoScanner (/scan), SignIn (/signin)
│   │   ├── App.jsx               # Client-side routing with React Router DOM v6
│   │   ├── index.css             # Cyberpunk sharp UI, electric glow effects & custom palettes
│   │   └── main.jsx              # React DOM entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                      # Node.js + Express + Prisma REST API
│   ├── prisma/
│   │   └── schema.prisma         # PostgreSQL schema (User, ActivityLog, IndiaBlocklist, Settings, Gamification)
│   ├── src/
│   │   ├── config/               # Prisma DB connection & Redis cache manager (with auto in-memory fallback)
│   │   ├── controllers/          # Request handlers: auth, scan, urlScan, dashboard
│   │   ├── integrations/         # Google Safe Browsing, OpenAI Moderation, OpenAI Child Explainer
│   │   ├── routes/               # Modular Express API endpoints
│   │   ├── services/             # 6-step threat scanning pipeline, auth service, dashboard aggregation
│   │   └── server.js             # Express application server entry point (Port 5000)
│   ├── .env.example              # Sample environment configuration
│   ├── test_endpoints.js         # Automated backend test suite
│   └── package.json
│
├── package.json                  # Workspace script runner
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- *(Optional)* [PostgreSQL](https://www.postgresql.org/) and [Redis](https://redis.io/) (backend automatically falls back to in-memory mode if omitted)

---

### 📥 1. Installation

Clone the repository and install dependencies for both frontend and backend:

```powershell
# Clone the repository
git clone https://github.com/Kartikey-3005/AI-SafetyApp.git
cd "AI-Safety App"

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

---

### ⚙️ 2. Environment Configuration

Create a `.env` file in the `backend/` directory based on `.env.example`:

```powershell
# In backend/.env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/safekids_db?schema=public"
REDIS_URL="redis://127.0.0.1:6379"

# External API Keys (Optional — mock engines activate automatically if left as mock)
GOOGLE_SAFE_BROWSING_API_KEY="mock_google_key"
OPENAI_API_KEY="mock_openai_key"
```

> **Note:** If live PostgreSQL or Redis is not connected, the server gracefully activates its built-in in-memory fallback storage so you can test all features immediately.

---

### 🏃 3. Running the Application

You can run both services from the root folder or individually:

#### Option A: Run from Root Folder (Recommended)

```powershell
# In the root folder:
npm run dev:frontend   # Starts React Vite frontend on http://localhost:3000
npm run dev:backend    # Starts Express API server on http://localhost:5000
```

#### Option B: Run in Separate Terminals

**Terminal 1 (Backend):**
```powershell
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```powershell
cd frontend
npm run dev
```

Once running:
- 🌐 **Frontend Application**: [http://localhost:3000](http://localhost:3000) (or `http://localhost:5173`)
- 🛡️ **Backend API Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

---

## 📡 API Reference & Endpoints

### 🩺 Health Check
- `GET /health`
  - Returns backend operational status and service identifier.

### 🛡️ Threat Inspection Engine
- `POST /api/scan`
  - **Body**:
    ```json
    {
      "content": "Check out free robux at http://free-robux-reward.xyz",
      "contentType": "URL",
      "appSource": "Discord",
      "userId": "user-uuid-or-anonymous"
    }
    ```
  - **Response**:
    ```json
    {
      "status": "BLOCKED",
      "threatType": "PHISHING",
      "severityScore": 0.95,
      "flaggedLayer": "GOOGLE_SAFE_BROWSING",
      "childFriendlyExplanation": "🛡️ Whoa there! That link looks like a trick to steal your game account or password. We've blocked it to keep you safe!",
      "parentDiagnosticReason": "Domain identified in Phishing / Deceptive database targeting minors.",
      "fromCache": false
    }
    ```

### 📊 Dashboard & Analytics
- `GET /api/dashboard/summary?userId=:id` — Overview statistics, safety score, streak, threat breakdown.
- `GET /api/dashboard/logs?userId=:id&page=1&limit=20` — Paginated and filterable inspection logs.

### 🔐 Authentication
- `POST /api/auth/google` — Google OAuth authentication / simulation.
- `POST /api/auth/signin` — Email & password sign-in.
- `POST /api/auth/signup` — Account registration.

---

## 🧪 Testing Backend Endpoints

Run the automated endpoint verification suite:

```powershell
cd backend
node test_endpoints.js
```

This verifies:
1. `/health` ping response
2. Clean message inspection (`ALLOWED`)
3. Malicious phishing/PII payload inspection (`BLOCKED`)
4. Indian regulatory domain blocklist check (`BLOCKED`)
5. Dashboard summary metric aggregation

---

## 🛡️ Security & Privacy Principles

1. **Child-First Data Privacy**: No raw text or personal chats are permanently logged in plaintext when privacy mode is enabled.
2. **Deterministic & Semantic Hybrids**: Fast regex scanning runs on the local server tier prior to any external API calls, reducing cost, latency, and data leakage.
3. **Compassionate Educational Feedback**: Instead of purely punitive blocks, the AI Coach empowers children to understand why specific content is risky, building long-term digital literacy.

---

## 👥 Authors & Acknowledgments

- **Lead Developer**: Kartikey
- **Repository**: [Kartikey-3005/AI-SafetyApp](https://github.com/Kartikey-3005/AI-SafetyApp)
- Designed with modern cyber safety principles for children and families.
