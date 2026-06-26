# Enrollify AI — Admin Panel (deprecated)

**This Next.js app is deprecated.** Staff admin now lives in the main site at:

**`/enrollify-manage`** on enrollifyedu.com (Vite + React Router in `src/`)

Use this folder as reference only. Do not deploy to Vercel.

## Local development (legacy)

If you still need the Next.js admin locally:

```bash
cd apps/admin
npm install
npm run dev
```

Prefer the integrated admin instead:

```bash
# Terminal 1
cd apps/backend && npm run dev

# Terminal 2 — from repo root
npm run dev
# Open http://localhost:5173/enrollify-manage
```

See [Documents/Bot/phase-4-messenger-deploy.md](../../Documents/Bot/phase-4-messenger-deploy.md) for deployment.
