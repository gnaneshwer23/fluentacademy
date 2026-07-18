# Fluent Academy

School & family **learning intelligence** platform — TanStack Start, Supabase, Vercel.

- **Production (canonical):** [https://fluent.institute](https://fluent.institute) — Next.js app in [fluentInstitute](https://github.com/gnaneshwer23/fluentInstitute)
- **This repo (experiment):** https://fluentacademy.vercel.app
- **Marketing landing (static):** https://fluent-institute-landing.vercel.app
- **Build plan:** [plans/fluent-v1-blueprint.md](./plans/fluent-v1-blueprint.md)
- **Progress:** [plans/PROGRESS.md](./plans/PROGRESS.md)

## Stack

- [TanStack Start](https://tanstack.com/start) + React 19
- [Supabase](https://supabase.com) (Auth, Postgres, RLS)
- [Tailwind CSS 4](https://tailwindcss.com) + shadcn/ui
- Deploy: Vercel (Nitro preset)

## Local development

```bash
git clone https://github.com/gnaneshwer23/fluentacademy.git
cd fluentacademy
npm install
cp .env.example .env   # fill Supabase keys from project dashboard
npm run dev
```

Open http://localhost:5173

## Environment variables

Copy `.env.example` to `.env` locally. On **Vercel** (Project → Settings → Environment Variables), set:

| Variable | Scope |
|----------|--------|
| `VITE_SUPABASE_URL` | Production, Preview, Development |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Production, Preview, Development |
| `VITE_SUPABASE_PROJECT_ID` | Optional |
| `VITE_SITE_URL` | `http://localhost:5173` locally; `https://fluentacademy.vercel.app` for this repo's Vercel deploy only |
| `VITE_SUPABASE_URL` | Production schema: `https://bzefudyjvgwwtlalmrxk.supabase.co` (see [plans/INFRA_ALIGNMENT.md](./plans/INFRA_ALIGNMENT.md)) |
| `SUPABASE_URL` | Same as VITE URL (server) |
| `SUPABASE_PUBLISHABLE_KEY` | Same as VITE key (server) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only — never expose to client |

## Build & deploy

```bash
npm run build          # generates .vercel/output via Nitro
vercel deploy --prebuilt --prod
```

Git push to `main` auto-deploys when Vercel Git integration is enabled.

## Project structure

```
src/
  routes/           # File-based routes (marketing + dashboards)
  components/       # DashboardShell, MarketingShell, ui/
  integrations/     # Supabase client + types
  lib/              # auth-context, site constants
supabase/migrations # Postgres schema + RLS
plans/              # Blueprint + progress tracker
```

## Roles

`admin` · `tutor` · `parent` · `student` — see onboarding and `/dashboard/*` routes.

## License

Private — Fluent Institute.
