# Lumi Wellness deployment runbook

The frontend deploys to Vercel; FastAPI needs a separate persistent backend host. This repository does not run the API or SQLite database inside a Vercel frontend function. The commands below prepare a real release; example domains are placeholders and must be replaced by the chosen public origins.

## Backend

Use Python 3.12 and install `backend/requirements.txt`. Set these environment variables in the backend host's secret/configuration store:

| Variable | Production value |
| --- | --- |
| `ENVIRONMENT` | `production` |
| `SECRET_KEY` | A random secret of at least 32 characters, generated with `openssl rand -hex 32` |
| `DATABASE_URL` | `sqlite:////data/lumi.db`, with `/data` mounted on persistent storage |
| `CORS_ORIGINS` | Exact public frontend HTTPS origins, comma-separated |
| `FRONTEND_URL` | The actual frontend HTTPS origin used for password-reset links |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_FROM` | Working mail delivery configuration |
| `SMTP_USERNAME`, `SMTP_PASSWORD` | Mail credentials where required by the provider |
| `SEED_DEMO_DATA` | `false` |

Set SMTP TLS options to match the mail provider. Password-reset delivery must be exercised with a controlled operator address before opening registration. If a reverse proxy is used, configure it to sanitize forwarded headers before enabling `TRUST_PROXY`; do not trust client-supplied forwarding headers.

From `backend`, with the production environment loaded and the database volume writable:

```sh
python -m pip install -r requirements.txt
python -m alembic upgrade head
python -m alembic check
python -m app.bootstrap_admin --email operator@yourdomain.com --first-name مدیر --last-name باشگاه
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 1
```

Bootstrap prompts for a hidden password twice. It requires at least 12 characters, a letter and a digit, and no more than 72 UTF-8 bytes. Automation may inject `BOOTSTRAP_ADMIN_PASSWORD` from the hosting secret store for this one command; remove it afterward. Do not place passwords in command-line flags, logs or committed files. The command requires current migrations, creates only one active administrator, never seeds demo data, and refuses any existing email address.

Test `GET /health` for HTTP 200 and `GET /ready` for HTTP 200. A process can be healthy while `/ready` returns 503 because its database is unavailable or not migrated. Readiness responses contain no connection strings or SQL diagnostics and must not be cached. Production does not create tables on startup.

The backend Dockerfile copies migrations and exposes port 8000. Build it from the backend context with `docker build -t lumi-api backend`. Mount a persistent volume at `/data`, inject secrets at runtime, run the same migration/bootstrap commands through the image, and then start its default command. Its healthcheck calls `/ready`; a new empty database remains unhealthy until migrated.

Use one backend process and one replica in this release. The current login limiter stores attempts in process memory, and SQLite needs persistent local storage. A multi-replica PostgreSQL rollout needs a PostgreSQL driver, shared rate limiting, and migration/contract validation; it is not established by changing `DATABASE_URL` alone.

## Vercel frontend

Import `amir-hdri/Lumi-Wellness` into a project named `lumi-wellness`. Choose Root Directory `apps/web`, the Next.js preset, and Node.js 22. The checked-in `apps/web/vercel.json` supplies the build command. npm installs workspaces from the root lockfile.

Set both Preview and Production environment values:

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Actual public backend HTTPS origin, without `/api/v1` |
| `NEXT_PUBLIC_APP_URL` | Actual frontend HTTPS origin used by share metadata |
| `NEXT_PUBLIC_USE_MOCKS` | `false` |

The deployment build rejects absent or malformed origins and enabled mocks. These public values are compiled into the browser bundle, so each change requires a rebuild. The local CI example origins are validation inputs, not an endpoint or deployment.

For previews, permit only controlled Vercel hostnames in backend CORS. An explicit list is safest. If using `CORS_ALLOW_ORIGIN_REGEX`, anchor it and include the actual project/account suffix so another account with a similar project name cannot use the allowlist. Check the exact `Origin` seen from the deployment. Verify one allowed origin and one unrelated origin using an OPTIONS request to `/api/v1/auth/login`.

## Release acceptance

1. Run web type checks, lint, unit tests, and a deployment-mode build; run backend tests and migrations against an isolated database first.
2. Create a Vercel preview with real API mode, then sign in with the controlled administrator account. Exercise member creation, coach/program assignment, attendance, payment recording, renewal approval and messaging.
3. Check production HTTPS, CSP/API connectivity, CORS, database readiness, SMTP reset delivery and backups. Confirm staff routes reject an athlete account.
4. Check 390px and 1440px layouts. The main landing actions are text-only, scrolling remains available without visible scrollbar tracks, and the viewport is fitted at scale one as requested. Mobile text inputs use at least 16px to avoid focus zoom.
5. Check offline mode and the explicit PWA update prompt. Private portal/reset-page responses and Next RSC prefetches must not appear in the offline cache. V4 removes older Lumi caches on activation. Development unregisters the local Lumi worker to prevent cached dev styles/chunks from hiding edits.
6. Confirm contact/social links and final legal/marketing copy belong to the operator. Historical Lighthouse results in README are not measurements of this release.

Back up the database before applying migrations to an existing installation. Keep the previous frontend deployment and backend image available for rollback. If the new application needs the new schema, do not point an older incompatible backend at it without validating compatibility or restoring a backup. Do not enable traffic until `/ready` succeeds and the real API acceptance checks pass.
