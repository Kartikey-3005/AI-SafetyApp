# SafeKids AI — Complete Web Application & Neural Defense Platform

AI-powered cyber safety platform protecting children across Discord, Roblox, YouTube, and web browsers with real-time packet inspection, child-friendly AI coaching, and gamified digital citizenship.

---

## 📁 Repository Structure

```text
AI-Safety App/
├── frontend/                     # React + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/           # Sharp HUD Navbar, Sidebar, PetStatusCard, ActivityFeed, StatCard
│   │   ├── pages/                # LandingPage (/), Dashboard (/dashboard), Logs (/logs), Settings (/settings)
│   │   ├── mock/                 # Interactive mock API & state store
│   │   ├── App.jsx               # React Router DOM (v6) routing tree
│   │   ├── index.css             # Strict 90-degree sharp borders & electric glow theme
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                      # Node.js + Express + Prisma + Redis Backend
│   ├── prisma/
│   │   └── schema.prisma         # PostgreSQL schema (User, ActivityLog, Settings, Gamification)
│   ├── src/
│   │   ├── config/               # Prisma client & Redis client (with memory fallback)
│   │   ├── integrations/         # Google Safe Browsing, OpenAI Moderation, OpenAI Coach Explainer
│   │   ├── services/             # 6-step threat scanning pipeline & dashboard aggregation
│   │   ├── controllers/          # /api/scan & /api/dashboard controller handlers
│   │   ├── routes/               # Modular Express router definitions
│   │   └── server.js             # Express application entry point (Port 5000)
│   ├── .env                      # Environment variables & API keys
│   ├── package.json
│   └── test_endpoints.js         # Automated backend test suite
│
├── package.json                  # Root workspace script runner
└── README.md
```

---

## 🚀 How to Run the Application

### Option A: Run from Root Folder

```powershell
# Start Frontend (React + Vite on http://localhost:3000 or 3001)
npm run dev:frontend

# Start Backend (Express API on http://localhost:5000)
npm run dev:backend
```

---

### Option B: Run Directly from Subfolders

#### 1. Frontend:
```powershell
cd frontend
npm run dev
```
Open 👉 **http://localhost:3000** (or port printed in terminal)

#### 2. Backend:
```powershell
cd backend
npm run dev
```
Health Check: 👉 **http://localhost:5000/health**

Run API Test Suite:
```powershell
cd backend
node test_endpoints.js
```
