# MoveInSync Tenant Configuration Console (Frontend)

Interactive web dashboard for the **MoveInSync Hierarchical Configuration Service**, built with React, Vite, Tailwind CSS, and Lucide Icons.

---

## Features

- **Multi-Tenant Switcher**: Switch between corporate tenants (Microsoft, Google, Amazon, Uber).
- **4-Level Hierarchy**: Resolve configuration values across `GLOBAL` -> `CLIENT` -> `OFFICE` -> `SHIFT`.
- **Live SSE Push**: Real-time Server-Sent Events push listener for instantaneous zero-latency updates.
- **Explain Mode**: Visual breakdown of which hierarchy level won and why.
- **Atomic Changesets & Rollbacks**: Multi-key transactional updates and 1-click rollbacks with diffs.
- **Staged Canary Rollouts**: Pilot rollout targeting specific office campuses before tenant-wide promotion.
- **System Diagnostics**: Real-time Actuator metrics, JVM telemetry, and latency monitors.

---

## Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of deployed backend service (e.g. `https://your-backend.onrender.com`) | `""` (uses local proxy) |

---

## Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Start local dev server with proxy to backend (localhost:8090)
npm run dev
```

### Production Build
```bash
npm run build
```

---

## Deployment on Vercel

1. Import this repository in **Vercel**.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. In **Environment Variables**, add:
   * **`VITE_API_BASE_URL`**: Your Render backend URL (e.g. `https://tenant-config-backend.onrender.com`)
6. Click **Deploy**.
