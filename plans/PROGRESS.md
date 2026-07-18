# Fluent Academy — Build Progress

Track each phase: branch → PR → production deploy.

| Phase | Branch | PR | Deploy | Status |
|-------|--------|-----|--------|--------|
| 0 — Foundation | `cursor/foundation-prod` | — | [fluentacademy.vercel.app](https://fluentacademy.vercel.app) | ✅ Complete |
| 1 — Core schema | `cursor/schema-core-v1` | TBD | [fluentacademy.vercel.app](https://fluentacademy.vercel.app) | 🔄 In progress |
| 2 — Dashboards | `cursor/dashboards-real-data` | — | — | ⏳ Pending |
| 3 — Fluency | `cursor/fluency-v1` | — | — | ⏳ Pending |
| 4 — School intel | `cursor/school-intelligence` | — | — | ⏳ Pending |
| 5 — AI tutor | `cursor/ai-tutor-mvp` | — | — | ⏳ Pending |
| 6 — Polish | `cursor/v1-polish` | — | — | ⏳ Pending |

## Phase 0 checklist

- [x] Connectd marketing UI merged (from `cursor/connectd-app-design`)
- [x] Nitro Vercel preset for serverless deploy
- [x] Tracked blueprint (`plans/fluent-v1-blueprint.md`)
- [x] Remove Lovable/Future Minds branding from meta & errors
- [x] `.env.example` + README
- [x] Vercel env vars documented in README (verify in dashboard)
- [x] Merge to `main` + production deploy (via PR)

## Phase 1 checklist

- [x] Migration: schools, classes, enrollments, guardian_links, guardian_invites
- [x] RPCs: `join_class`, `link_guardian`, `create_guardian_invite`
- [x] RLS policies + parent access to linked student reports
- [x] TypeScript types + `school-api.ts` helpers
- [x] Admin school setup route (`/dashboard/school`)
- [x] Onboarding: class join code (student) + guardian invite (parent)
- [x] Dashboards wired to enrollments, roster, guardian links
- [ ] Apply migration to Supabase production
- [ ] Merge to `main` + production deploy

## Deploy URLs

| Surface | URL |
|---------|-----|
| App (production) | https://fluentacademy.vercel.app |
| App (alias) | https://fluent-woad.vercel.app |
| Static landing | https://fluent-institute-landing.vercel.app |
| Legacy (do not overwrite) | https://fluent.institute |
