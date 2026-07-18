# Fluent Academy v1 — End-to-End Blueprint

**Objective:** Ship a working school & family learning intelligence platform.

**Repo:** `gnaneshwer23/fluentacademy`  
**Production:** [fluentInstitute](https://github.com/gnaneshwer23/fluentInstitute) → [https://fluent.institute](https://fluent.institute)  
**This repo deploy:** Vercel project `fluentacademy` → https://fluentacademy.vercel.app (experiment only)

See [PROGRESS.md](./PROGRESS.md) for live status.

---

## Phase 0 — Foundation ✅ (complete on production infra)

> Aligned to `fluent.institute` + Supabase `bzefudyjvgwwtlalmrxk`. See [INFRA_ALIGNMENT.md](./INFRA_ALIGNMENT.md).

- Merge Connectd UI + Nitro Vercel deploy
- Clean Lovable branding, add `.env.example`, README
- Verify Supabase env on Vercel

**Exit:** Production build from `main`; auth + forms work.

---

## Phase 1 — Core data model ✅ (goals met on production; schema differs)

> **Do not apply** `20260718160000_phase1_core_schema.sql` to production. Equivalent tables/RPCs exist in fluentInstitute.

**Branch:** `cursor/schema-core-v1`

Tables: `schools`, `school_members`, `classes`, `enrollments`, `guardian_links`, `guardian_invites`

- RLS per role (student, parent, tutor, admin)
- Onboarding: class codes, guardian invites
- Admin: school setup UI

---

## Phase 2 — Dashboards wired

**Branch:** `cursor/dashboards-real-data` (split PRs ok)

- Overview stats from DB
- Student: classes from enrollments
- Parent: reports via guardian_links
- Tutor: roster picker (no UUID paste)
- Role route guards

---

## Phase 3 — Fluency & progress

**Branch:** `cursor/fluency-v1`

Tables: `practice_sessions`, `fluency_snapshots`, extend `progress_reports`

- Academic Fluency Score pipeline
- Parent weekly view + charts

---

## Phase 4 — School intelligence

**Branch:** `cursor/school-intelligence`

- Cohort metrics, intervention queue
- Admin/school leader dashboard

---

## Phase 5 — AI tutor MVP

**Branch:** `cursor/ai-tutor-mvp`

- Streaming chat API (Vercel AI SDK)
- Student UI; hints-not-answers guardrails
- `ai_conversations`, `ai_messages`

---

## Phase 6 — Polish & launch

**Branch:** `cursor/v1-polish`

- Password reset, email confirm
- Legal pages, demo booking emails
- Smoke tests

---

## Dependency order

```
Phase 0 → 1 → 2 → (3 | 4 | 5 parallel) → 6
```

Each phase: branch → PR → merge `main` → `vercel deploy --prod`.
