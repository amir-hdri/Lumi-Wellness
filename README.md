# Lumi Wellness

A full-stack gym management platform: member, coach, and admin portals with
membership plans, training programs, goals, check-ins (incl. staff QR check-in),
payments, in-app messaging, notifications, and analytics dashboards. Persian
(RTL) UI, mobile-first, Jalali dates.

The repository and the project are named **Lumi-Wellness** (`Lumi Wellness` in
the UI, the manifest and the metadata). The deployed domain (`gymapp.ir`) and
the seeded account domain (`@gymapp.ir`) are still the old name — they are
infrastructure, not product naming, and changing them means a DNS/mail cutover.

## Architecture

```
┌────────────────────────────────────────────────────────┐
│  apps/web — Next.js 16 (App Router) + React 19         │
│  ├── /athlete    member portal (role: athlete)         │
│  ├── /coach      coach portal (role: coach)            │
│  ├── /admin      admin portal (role: admin/receptionist)│
│  └── /auth       login · register · onboarding ·       │
│                   forgot/reset password                │
├────────────────────────────────────────────────────────┤
│  backend — FastAPI + SQLAlchemy + SQLite               │
│  REST API under /api/v1 — ~100 paths, 96 operations    │
│  JWT auth · role enforcement · QR check-in · SMTP mail │
├────────────────────────────────────────────────────────┤
│  packages/ — shared workspaces (reserved)              │
│  turbo.json — Turborepo pipeline                       │
└────────────────────────────────────────────────────────┘
```

### Backend

- **FastAPI** + SQLAlchemy ORM + SQLite (dev), pydantic-settings for config
- **Models:** User, Branch, MembershipPlan, Membership, Exercise,
  TrainingProgram, ProgramExercise, Goal, CheckIn, Payment, Notification,
  Conversation, Message
- **Auth:** JWT access/refresh tokens (python-jose), bcrypt hashing,
  `require_roles()` dependency; staff-only QR check-in; ownership checks on
  dashboards
- **Routers:** auth, users, branches, membership-plans, memberships, exercises,
  training-programs, goals, check-ins, payments, dashboard (incl. analytics),
  notifications, messages, readiness
- Extra endpoints beyond plain CRUD: role update, check-in void, membership
  renew, readiness history, QR check-in, broadcast, deduct-session
- Schema is created with `Base.metadata.create_all` — there are **no
  migrations**. A model change means recreating the dev database.
- Password reset mail is delivered over SMTP when `SMTP_HOST`/`SMTP_FROM` are
  set; otherwise production answers 503 and non-prod returns `devToken`.
- Interactive docs at `/docs` (Swagger UI)

### Frontend

- **Next.js 16 App Router**, React 19, Tailwind CSS 4 (CSS-first `@theme`, no
  `tailwind.config.js`), TypeScript 5.9
- **Data layer:** React Query hooks (`src/hooks/use-api.ts`) over a lazily
  imported `mock-service` (fetched only when `NEXT_PUBLIC_USE_MOCKS=true`) and a
  lazy axios facade (`src/lib/api.ts` → dynamic `import("./api-client")`), so
  `axios` stays out of the critical chain of public routes
- **Auth:** `AuthProvider` (localStorage JWT + refresh) and `RequireAuth` route
  guard on all portals; the marketing page (`/`) is intentionally *not* gated on
  auth state so the hero paints with the first paint
- **UI:** Radix UI primitives, framer-motion, lucide-react, recharts (behind
  `React.lazy` with a fixed-height skeleton, so charts cost no layout shift),
  sonner toasts, react-hook-form + **zod 3**
- **Activity capsule chart:** the member's own weekly volume is a bespoke SVG
  component (`components/twilight/CapsuleChart.tsx`) — capsules on a visible
  `--muted` track over the last 7 **active** days (days with a session), scaled
  against the busiest day in that window
- **Visual language:** calm and warm rather than dashboard-bright — warm
  near-black surfaces, hairline borders instead of shadows, generous rounding,
  large light-weight numerals. Two accents with two jobs: `--primary` (sand in
  dark, bronze in light) is interface furniture, `--blush` (soft pastel pink)
  marks the member's own data — streaks, goal progress, activity rings. Dark is
  the canonical theme. All raw colour values live in `src/app/globals.css`;
  `docs/DESIGN_SYSTEM.md` is the binding spec.
- **ESLint 10 flat config** (`eslint.config.js`)

## Quick start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # macOS/Linux
pip install -r requirements.txt
export SECRET_KEY="change-me"
uvicorn app.main:app --reload --port 8000
```

API docs at http://localhost:8000/docs

The database is seeded on first start (2 branches, 3 coaches, 8 athletes, plans,
programs, check-in history, payments). Seeded passwords come from the
`SEED_*_PASSWORD` environment variables; the defaults below are dev-only and the
app logs a warning when it falls back to them.

| Account | Role | Default password | Override with |
| --- | --- | --- | --- |
| `admin@gymapp.ir` | admin | `admin123` | `SEED_ADMIN_PASSWORD` |
| `reception@gymapp.ir` | receptionist | `reception123` | `SEED_RECEPTIONIST_PASSWORD` |
| `coach1@gymapp.ir` … `coach3@` | coach | `coach123` | `SEED_COACH_PASSWORD` |
| `athlete1@gymapp.ir` … `athlete8@` | athlete | `athlete123` | `SEED_ATHLETE_PASSWORD` |

### Frontend

```bash
npm install
npm run dev          # starts apps/web via turbo
```

Set `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`) in
`apps/web/.env.local`.

To run the UI with no backend at all, set `NEXT_PUBLIC_USE_MOCKS=true`. The mock
layer is a complete in-memory implementation of every client method — including
messaging and the analytics series — so the whole app is navigable offline. Mock
accounts mirror the seed addresses above; the mock password for every one of them
is `Lumi1234`.

## Scripts

| Command | Location | Description |
| --- | --- | --- |
| `npm run dev` | root | Start frontend dev server |
| `npm run build` | root | Build all workspaces |
| `npm run type-check` | root / `apps/web` | TypeScript check |
| `npm run lint` | `apps/web` | ESLint |
| `npm run test --workspace=apps/web` | root | Vitest (unit) |
| `npx playwright test` | `apps/web` | Playwright (end-to-end) — see caveat below |
| `./venv/bin/python -m pytest tests -q` | `backend` | pytest (contract + RBAC) |

The backend tests need the venv's interpreter: the suite imports `fastapi`, which
a system `python3` will not have.

## Roles

| Role | Portal | Capabilities |
| --- | --- | --- |
| `athlete` | `/athlete` | workouts, goals, check-in, membership, payments, messages |
| `coach` | `/coach` | athletes, exercises, programs, templates, messages |
| `admin` / `receptionist` | `/admin` | members, coaches, plans, payments, analytics, notifications, settings |

Portals are protected client-side (`RequireAuth`); the backend enforces roles on
staff endpoints. Self-registration always produces an `athlete` — a `role` in the
request body is ignored. Create staff accounts through the seed or
`POST /api/v1/users` as an admin.

## Performance

Measured with Lighthouse 12 (mobile default throttling) against a production
build:

| Metric | Baseline | Current |
| --- | ---: | ---: |
| Performance score | 85 | **91–92** |
| Accessibility | 96 | **100** |
| Speed Index | 6.0 s | **0.9–1.2 s** |
| LCP element render delay | 3,921 ms | **126 ms** |
| LCP (simulated Moto G4) | 3.46 s | **3.3 s** |
| Color-contrast audit | fail | pass |
| Desktop Performance | 100 | 100 |

Full methodology, fix log (P0/P1/P2) and the measured roadmap for reaching 95+:
[`docs/PERFORMANCE_AUDIT.md`](docs/PERFORMANCE_AUDIT.md).

## Deployment

### Vercel — frontend

`apps/web/vercel.json` pins the framework preset and the build command; the
remaining settings live in the dashboard (Project → Settings → Build &
Deployment):

| Setting | Value |
| --- | --- |
| Root Directory | `apps/web` |
| Framework Preset | Next.js |
| Build Command | `cd ../.. && npm run build --workspace=apps/web` (from `vercel.json`) |
| Install Command | auto-detected — npm workspaces are installed from the repo root |
| Node.js | 20.9+ (`engines.node` in the root `package.json`) |

Environment variables (Project → Settings → Environment Variables — set them for
Production *and* Preview):

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | the deployed API origin, e.g. `https://api.gymapp.ir` |
| `NEXT_PUBLIC_APP_URL` | the frontend origin, e.g. `https://gymapp.ir` |
| `NEXT_PUBLIC_USE_MOCKS` | unset (or `false`) — the mock layer is dev-only |

`NEXT_PUBLIC_*` values are inlined into the bundle at build time, so changing
one requires a rebuild. The build fails on purpose when `NEXT_PUBLIC_USE_MOCKS`
is `true`, or when `NEXT_PUBLIC_API_URL` is missing or points at localhost
(`apps/web/config/deploy-env.mjs`) — a mock or localhost build must never
reach production.

The API is a separate project and has to allow the frontend origins:
`CORS_ORIGINS=https://gymapp.ir,https://www.gymapp.ir`. Preview deployments get
a new hostname on every push, so add
`CORS_ALLOW_ORIGIN_REGEX=^https://<project>-.*\.vercel\.app$` to the API
environment. Name the Vercel project `lumi-wellness` to match the repository;
while old preview hostnames are still alive, accept both prefixes:
`^https://(lumi-wellness|gym-app)-.*\.vercel\.app$`.

### Docker — frontend

```bash
docker build -f apps/web/Dockerfile \
  --build-arg NEXT_PUBLIC_API_URL=https://api.gymapp.ir \
  --build-arg NEXT_PUBLIC_APP_URL=https://gymapp.ir \
  -t lumi-web .
docker run -p 3000:3000 lumi-web
```

The image is a Next.js `standalone` build and the API origin is baked in at
build time, for the same reason as on Vercel. `.dockerignore` keeps
`.env.local`, `node_modules` and `.next` out of the build context — the dev
`.env.local` points at the mock layer and would otherwise be compiled into the
image.

## Known limitations

- **Password reset needs SMTP env to work in production.**
  `POST /api/v1/auth/forgot-password` sends a Persian reset mail when
  `SMTP_HOST`/`SMTP_FROM` are configured (SSL or STARTTLS, optional login).
  Outside production the response also carries the token as `devToken`;
  in production without SMTP the endpoint answers 503. Tokens are
  single-use, 30-minute, SHA-256 stored, rate-limited, and pruned.
- **No database migrations.** Schema changes require recreating the database.
- **`@playwright/test` is not in `package.json`.** The end-to-end specs under
  `apps/web/e2e/` are committed and the config is self-sufficient, but the
  dependency could not be added in the environment they were written in (no
  registry access, and adding it without regenerating `package-lock.json` would
  break `npm ci`). The `e2e` CI job installs it ad hoc with `--no-save` and is
  `continue-on-error`. Add the dependency properly, then delete both.
- **Fonts are self-hosted.** `app/layout.tsx` loads Estedad (UI),
  Bodoni Moda + Montserrat (LUMI WELLNESS wordmark) and Vazirmatn
  (fallback) from `src/app/fonts/` via `next/font/local` — builds work
  fully offline.

Every intentional divergence between the implementation and the coordination
spec is recorded under `## Deviations` in
[`docs/API_CONTRACT_V2.md`](docs/API_CONTRACT_V2.md).

## Environment Variables

| Variable | Where | Default |
| --- | --- | --- |
| `SECRET_KEY` | backend | — (required) |
| `DATABASE_URL` | backend | `sqlite:///./gymapp.db` |
| `ENVIRONMENT` | backend | `development` (`production` suppresses `devToken`) |
| `SEED_DEMO_DATA` | backend | `false` (dev seeds by default; staging seeds only on opt-in) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USERNAME` / `SMTP_PASSWORD` / `SMTP_FROM` / `SMTP_STARTTLS` / `SMTP_SSL` | backend | unset (password-reset mail) |
| `FRONTEND_URL` | backend | reset-link base URL |
| `TRUST_PROXY` | backend | `false` (honor `X-Forwarded-For` for rate limiting) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | backend | 30 |
| `REFRESH_TOKEN_EXPIRE_DAYS` | backend | 7 |
| `LOGIN_RATE_LIMIT` | backend | per-IP login attempt ceiling |
| `SEED_ADMIN_PASSWORD` | backend | `admin123` |
| `SEED_RECEPTIONIST_PASSWORD` | backend | `reception123` |
| `SEED_COACH_PASSWORD` | backend | `coach123` |
| `SEED_ATHLETE_PASSWORD` | backend | `athlete123` |
| `NEXT_PUBLIC_API_URL` | apps/web | `http://localhost:8000` |
| `NEXT_PUBLIC_USE_MOCKS` | apps/web | unset (real API) |
| `NEXT_PUBLIC_APP_URL` | apps/web | `https://gymapp.ir` (metadata base) |
| `CORS_ORIGINS` | backend | `http://localhost:3000` (comma-separated allow-list) |
| `CORS_ALLOW_ORIGIN_REGEX` | backend | unset (regex for Vercel preview origins) |

See `FINAL_REPORT.md` for the full engineering audit, bug fixes, and known gaps,
`docs/API_CONTRACT_V2.md` for the API contract and its deviations, and
`docs/PERFORMANCE_AUDIT.md` for the performance/accessibility audit.
