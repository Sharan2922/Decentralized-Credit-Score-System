# Decentralized Credit Score (Demo) — Single-host Fullstack (Free)

**One repo. One service.** Express backend + React (Vite) frontend. The server serves the built UI, so you can run locally and deploy as a single free service (e.g., Render). No paid APIs.

## Quick start (local)

Requirements: Node **>= 18**

```bash
# 1) Install deps (server + client)
npm install

# 2) Dev (backend only; frontend is served after build or run separately with `cd client && npm run dev` if you want HMR)
npm run dev

# In another terminal (optional, for live frontend dev)
cd client
npm run dev
# -> open http://localhost:5173 (API proxied to 5000)
```

**Production-style run (single host):**

```bash
# Build frontend
npm run build

# Start server (serves /client/dist)
npm start

# Open http://localhost:5000
```

## API

- `POST /api/score` — transparent points-based score. Body example:

```json
{
  "repaymentOnTimePct": 95,
  "utilizationPct": 25,
  "dtiPct": 30,
  "monthsSinceLastDPD": 24,
  "hardInquiries12m": 1,
  "avgAccountAgeMonths": 36,
  "numActiveAccounts": 3
}
```

## Single-host FREE deploy (Render)

1. Push this repo to GitHub.
2. On **Render.com** → **New Web Service** → connect repo.
3. Use these settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node 18+
4. Deploy. Render will serve Express on the assigned URL, and Express will serve the React build under `/` and the API under `/api/*`.

> Note: No environment variables required for this demo. No external paid services.

## How to integrate your own Bolt AI UI
Bolt (or any UI) just needs to call `POST /api/score` on the same origin. If you keep the path the same, no further backend changes are needed.

## Folder structure

```
.
├─ server/
│  ├─ index.js           # Express app; serves API + static frontend
│  └─ routes/
│     └─ score.js        # Scoring endpoint
├─ client/               # React + Vite (TS)
│  ├─ src/
│  │  ├─ App.tsx
│  │  └─ main.tsx
│  ├─ index.html
│  ├─ package.json
│  └─ vite.config.ts
├─ package.json          # Root scripts
└─ README.md
```

## Notes

- Everything runs on a single port in production (`npm start`).
- Dev mode: you can run the Vite dev server for HMR; API is proxied to Express (5000).
- The scorecard is transparent and editable in `server/routes/score.js`.
