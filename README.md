# SafeKids AI

SafeKids AI is a web application designed to protect children online. It helps keep kids safe while using web browsers, messaging apps, Discord, Roblox, and YouTube. The system scans messages and website links in real time to stop online threats such as bad links, scams, personal data leaks, and harmful messages. It also explains safety risks to kids in simple, friendly words and includes a fun virtual pet that levels up when they practice safe browsing habits.

## Main Features

* Multi-Layer Safety Scanner: Checks text and links through multiple safety checks.
* Personal Data Protection: Detects and stops leaks of private details like phone numbers, addresses, and passwords.
* Blocklist Protection: Blocks dangerous websites, illegal betting sites, phishing links, and malicious domains.
* Real-Time AI Moderation: Detects bullying, harassment, and harmful content.
* Child-Friendly AI Coach: Explains why a blocked link or message is unsafe in kind, simple words so kids learn safe habits.
* Virtual Safety Companion: A virtual pet named VIPER-007 that earns experience points and levels up as kids browse safely.
* Parent Dashboard: Lets parents see safety scores, view activity logs, and choose protection levels.
* Live Scanner Demo: An interactive scanner page where you can test links or messages immediately.
* Easy Local Setup: Works out of the box with built-in memory storage even if you do not have external databases configured.

## Technologies Used

* Frontend: React 18, Vite, Tailwind CSS, Lucide Icons, React Router
* Backend: Node.js, Express
* Database and ORM: PostgreSQL, Prisma
* Caching: Redis with automatic in-memory fallback
* AI and Security Services: Google Safe Browsing, OpenAI Moderation and Explainer

## Project Structure

```text
AI-Safety App/
├── frontend/
│   ├── src/
│   │   ├── components/       (Navbar, Footer, Activity Feed, Stat Cards)
│   │   ├── context/          (User login state and authentication)
│   │   ├── pages/            (Dashboard, Scanner, Logs, Settings, Sign In)
│   │   ├── App.jsx           (Main app routes)
│   │   ├── index.css         (Custom styling and colors)
│   │   └── main.jsx          (React entry point)
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma     (Database models for users, logs, and settings)
│   ├── src/
│   │   ├── config/           (Database and cache settings)
│   │   ├── controllers/      (Scan, dashboard, and authentication handlers)
│   │   ├── integrations/     (Google Safe Browsing and OpenAI connections)
│   │   ├── routes/           (API routes)
│   │   ├── services/         (Safety scanning and business logic)
│   │   └── server.js         (Backend server entry point)
│   ├── .env.example          (Example environment settings)
│   ├── test_endpoints.js     (Backend test script)
│   └── package.json
│
└── package.json              (Root workspace script runner)
```

## How to Get Started

### Prerequisites

* Node.js version 18 or newer
* npm package manager

### 1. Installation

Clone the project from GitHub and install packages for both frontend and backend:

```powershell
git clone https://github.com/Kartikey-3005/AI-SafetyApp.git
cd "AI-Safety App"

cd frontend
npm install

cd ../backend
npm install

cd ..
```

### 2. Environment Setup

Create a .env file inside the backend folder by copying .env.example:

```text
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/safekids_db?schema=public"
REDIS_URL="redis://127.0.0.1:6379"
GOOGLE_SAFE_BROWSING_API_KEY="mock_google_key"
OPENAI_API_KEY="mock_openai_key"
```

Note: If you do not have PostgreSQL or Redis installed, the backend will automatically use its built-in memory storage so you can test everything right away.

### 3. Running the App

You can start both frontend and backend from the main project folder:

```powershell
npm run dev:frontend
npm run dev:backend
```

Or you can start them in separate terminal windows:

Terminal 1 (Backend):
```powershell
cd backend
npm run dev
```

Terminal 2 (Frontend):
```powershell
cd frontend
npm run dev
```

Once started:
* Open the frontend in your browser at: http://localhost:3000
* Check the backend health status at: http://localhost:5000/health

## API Endpoints

### Health Check
* GET /health : Checks if the backend server is running.

### Safety Scanner
* POST /api/scan : Scans a message or website link for safety risks.

Example Request:
```json
{
  "content": "Check out this free reward at http://free-robux-reward.xyz",
  "contentType": "URL",
  "appSource": "Discord",
  "userId": "guest"
}
```

Example Response:
```json
{
  "status": "BLOCKED",
  "threatType": "PHISHING",
  "severityScore": 0.95,
  "flaggedLayer": "GOOGLE_SAFE_BROWSING",
  "childFriendlyExplanation": "Whoa there! That link looks like a trick to steal your game account or password. We blocked it to keep you safe.",
  "parentDiagnosticReason": "Domain identified in phishing database targeting minors.",
  "fromCache": false
}
```

### Dashboard and Logs
* GET /api/dashboard/summary : Gets total scans, safety score, streak, and threat count.
* GET /api/dashboard/logs : Gets recent scan logs with status details.

### User Account
* POST /api/auth/google : Sign in with Google account.
* POST /api/auth/signin : Sign in with email and password.
* POST /api/auth/signup : Create a new user account.

## Testing Backend Endpoints

To run the automated backend tests:

```powershell
cd backend
node test_endpoints.js
```

This test checks:
1. Server health check response
2. Safe message scan check
3. Dangerous link detection check
4. Blocklist check
5. Dashboard statistics check

## Privacy and Safety Rules

1. Child Privacy: Private text and chat messages are never permanently stored in plaintext when privacy mode is turned on.
2. Fast Local Checks: Text is checked on the local server first before sending anything to external services.
3. Helpful Feedback: Instead of only blocking content, the app teaches children why certain links are risky so they can learn good online habits.

## Author

* Developer: Kartikey
* GitHub: https://github.com/Kartikey-3005/AI-SafetyApp
