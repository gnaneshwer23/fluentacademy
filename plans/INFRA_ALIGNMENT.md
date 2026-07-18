# Infrastructure Alignment — fluentacademy → Production

**Last updated:** July 2026

This repo (`fluentacademy`, TanStack Start) was used for Phase 0/1 experiments. **Canonical production** is the Next.js app in [fluentInstitute](https://github.com/gnaneshwer23/fluentInstitute).

| | Production (use this) | This repo (experiment) |
|--|----------------------|------------------------|
| **URL** | [https://fluent.institute](https://fluent.institute) | [https://fluentacademy.vercel.app](https://fluentacademy.vercel.app) |
| **Vercel project** | `fluent-institute` | `fluentacademy` |
| **Supabase** | `bzefudyjvgwwtlalmrxk` | ~~`dbqsdyyabrbsuueiiiiz`~~ (deprecated) |
| **Stack** | Next.js 15 | TanStack Start + Nitro |

**Do not:**
- Deploy this repo to the `fluent-institute` Vercel project
- Run `supabase/migrations/20260718160000_phase1_core_schema.sql` against `bzefudyjvgwwtlalmrxk` (conflicts with existing schema)

---

## Phase 0 deliverables → production equivalent

| fluentacademy Phase 0 | Production equivalent |
|----------------------|----------------------|
| Connectd marketing UI + Nitro Vercel deploy | fluentInstitute marketing + Next.js on Vercel |
| `.env.example` + README | `fluentInstitute/.env.example`, `docs/DEPLOY.md` |
| Supabase client wiring | `@supabase/ssr` in fluentInstitute |
| Blueprint in `plans/` | `fluentInstitute/docs/PHASE0_PHASE1_ALIGNMENT.md` |
| Production deploy from `main` | `fluent.institute` from `fluentInstitute` `main` |

**Status:** Phase 0 goals met on production infra. This repo remains a TanStack reference implementation.

---

## Phase 1 deliverables → production equivalent

| fluentacademy Phase 1 | Production table / RPC | fluentInstitute code |
|----------------------|------------------------|---------------------|
| `schools` (slug-based) | `schools` (name, city, ethos) | `provision_school` RPC |
| `school_members` | `school_members` | Signup + invite redemption |
| `classes` + join codes | `class_enrollments` (teacher roster) | `src/app/teacher/classes/` |
| `enrollments` | `class_enrollments` | Teacher enrolls students from roster |
| `guardian_links` | `guardian_student_links` | `src/app/guardian/actions.ts` |
| `guardian_invites` | `school_invites` (role-scoped tokens) | `src/app/invites/actions.ts` |
| RPC `join_class` | Teacher enrollment actions | No join-code RPC |
| RPC `link_guardian` | `redeem_invite` + `linkChild` | Invite metadata → suggested children |
| RPC `create_guardian_invite` | `create_school_invite` | Unified for all roles |
| Admin `/dashboard/school` | `/admin/schools/new` | Operator provisioning |
| Student onboarding class code | `/join?invite=TOKEN` | `validate_invite_token` |
| Parent onboarding guardian flow | Guardian invite + `linkSuggestedChildren` | Post-redeem linking |

**Status:** Phase 1 *goals* (school org, enrollments, guardian links, invites, onboarding) are implemented on production with a different schema shape. The fluentacademy migration was **never applied** to production and must not be.

---

## Environment configuration

For local dev against **production Supabase** (read-only / careful testing only):

```bash
VITE_SUPABASE_URL=https://bzefudyjvgwwtlalmrxk.supabase.co
VITE_SUPABASE_PROJECT_ID=bzefudyjvgwwtlalmrxk
# Use anon key from production dashboard — never commit
VITE_SITE_URL=http://localhost:5173
```

Production app env vars live in Vercel project `fluent-institute`, not `fluentacademy`.

---

## What to do with this repo

1. **Reference only** for TanStack Start patterns and Connectd UI components
2. **Do not** treat Phase 1 migration as source of truth for schema
3. **Track progress** in [PROGRESS.md](./PROGRESS.md) — Phase 0/1 marked complete against production infra
4. **Continue Phase 2+** either by porting features to fluentInstitute or keeping this as a sandbox on `fluentacademy.vercel.app` with a **separate** Supabase project if needed

See also: [fluentInstitute/docs/PHASE0_PHASE1_ALIGNMENT.md](https://github.com/gnaneshwer23/fluentInstitute/blob/main/docs/PHASE0_PHASE1_ALIGNMENT.md)
