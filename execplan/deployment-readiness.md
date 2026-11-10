# Prepare Lumi Wellness for deployment

This is a living execution plan. Work runs in `/Users/amirheidari/GitHub/Lumi-Wellness` on `codex/deployment-readiness`, under the `codex-release` coordination lock.

## Purpose / Big Picture

Make the existing Persian fitness management app safe to release without changing its approved visual language. Private portal responses must stay out of the offline cache, infrastructure must distinguish a running process from a migrated database, an operator must be able to create the first administrator without demo data, and revenue charts should use one bounded database query. Verify the actual frontend/backend flows and provide a concrete release runbook.

## Progress

- [x] Repository coordination, current source, prior handoff, and plugin preflight inspected.
- [x] Baseline: 240 web tests; 203 backend tests and four expected failures.
- [x] Vercel account inspected: connected, no matching Lumi project. MagicPath is unauthenticated; hosted Graphify is unavailable.
- [x] Captured landing, signin and member notifications in the in-app browser; live user navigation replaced the attempted signup capture.
- [x] Reproduce and fix private response caching, production readiness/bootstrap gaps, and revenue query growth.
- [x] Align public marketing claims and deployment metadata with actual behavior.
- [x] Run static checks, regression suites, deployment-style build, isolated migrations, and real API browser flows.
- [x] Wrote findings/runbook, updated all five state sections and session log, released the lock; this plan is included in the atomic task commit.

## Surprises & Discoveries

The service worker excludes private routes only in its HTML navigation branch. Next's private page prefetches enter the generic static cache branch. The `/health` endpoint performs no database operation. `dashboard.revenue_data` performs thirty SQL queries for its daily view. Production skips development seeds, but there is no first-admin command. The landing page promises automatic renewal although renewals require an administrator's approval.

## Decision Log

- Preserve current design and existing API contracts; patch evidence-backed issues. User requested review, enhancement, optimization and deployment preparation.
- Keep `/health` as process liveness and add `/ready` for database/migration readiness. A health check should fail without exposing database configuration.
- Support the existing SQLite deployment with a persistent volume and a single backend process. Database platform migration and shared rate limiting need a separate verified rollout.
- Prepare the repository and a release runbook. No public API destination was provided and no matching Vercel project exists; do not fabricate a production URL.

## Outcomes & Retrospective

Implementation and validation complete: 253 web, 213 backend + 4 xfail, 112 mock browser and 34 real-API browser tests passed; deployment-mode build, TypeScript and lint passed. No public destination is provisioned. Docker daemon unavailable. The user requested a minimal landing, text-only CTA buttons, hidden scrollbar and scale-one viewport; these were incorporated. The session log and all five state sections have been updated, the lock has been released, and this plan accompanies the atomic task commit. Existing unrelated `.serena` deletions, generated Next types, and old untracked screenshots must be preserved and excluded from the task commit.

## Context and Orientation

`apps/web` is a Next.js 16 App Router application. `backend/app` is FastAPI with SQLAlchemy models, JWT authentication and SQLite; `backend/migrations` contains Alembic versioned schema changes. `apps/web/public/sw.js` is the offline worker. The frontend calls `/api/v1` on a separately hosted backend. `backend/app/routers/dashboard.py` produces the legacy chart response `{labels, values}`. `.github/workflows/ci.yml` runs separate web, backend and browser checks.

## Plan of Work

Add meaningful regression tests before changing the worker and backend behavior. Restrict cache handling to safe public assets and navigation, reject private/no-store responses and prefetches, and preserve the explicit worker update flow. Add operational code for database readiness and a validated, non-overwriting administrator bootstrap command. Replace per-bucket revenue queries with one bounded read and preserve zero-filled chronological labels. Update marketing copy and deployment metadata using existing assets and components. Add CI validation for the production build configuration and write the exact release sequence.

## Concrete Steps

From the repository root run `npm run test --workspace=apps/web`, `npm run lint --workspace=apps/web` and `npm run type-check --workspace=apps/web`. From `backend`, run `./venv/bin/python -m pytest tests -q`. Use a temporary SQLite database for `python -m alembic upgrade head`, `python -m alembic check`, bootstrap and `/ready` probes. Build the frontend with `VERCEL=1 NEXT_PUBLIC_USE_MOCKS=false NEXT_PUBLIC_API_URL=https://api.example.com NEXT_PUBLIC_APP_URL=https://lumi.example.com`; these are validation origins, not real deployment targets. Existing Playwright suites exercise mobile and desktop workflows on isolated servers/databases; use the in-app browser for visual capture.

## Validation and Acceptance

Private page prefetches must never open/write the worker cache, offline public navigation must still work, and unrelated origin caches must survive activation. `/health` must remain available while `/ready` returns 503 for a missing/stale database and 200 for a migrated database. Bootstrap must create only a validated active administrator and refuse existing identities or weak passwords. Daily/monthly revenue must preserve amounts/labels and read payments once. Static checks, production-style build and existing role/ownership suites must pass. Record evidence separately from untested public infrastructure.

## Idempotence and Recovery

Tests use disposable databases and build directories; no production data changes. Bootstrap refuses existing email addresses instead of changing roles or passwords. Alembic is applied only to temporary databases in this session. Keep existing source edits intact. Retry failed checks only after diagnosing the error, and record remaining infrastructure limits.

## Artifacts and Notes

Current browser captures belong in `docs/deployment-audit/2026-11-10/`. The final report belongs in `docs/DEPLOYMENT_READINESS_2026-11-10.md`. No source is uploaded to MagicPath or Graphify.

## Interfaces and Dependencies

Reuse FastAPI, SQLAlchemy, Alembic, Pydantic and existing password hashing. `/ready` follows the existing success/error response envelope. Bootstrap is a local module command, not a public API. Retain the revenue response contract and frontend styling tokens. No new production package is required for these fixes.

Revision 2026-11-10: created from current source findings and baseline evidence; release destination remains unresolved.

Revision 2026-11-10: incorporated user UI/viewport corrections, completed regression evidence, and recorded missing public infrastructure.
