# Clean Mock Data and Deploy to Worker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean all fake/mock data, demo programs, and fake accounts from Lumi-Wellness, and deploy the production-ready project to remote Worker 1 (`87.107.109.185`).

**Architecture:** Purge fake seed data and mock toggle (`NEXT_PUBLIC_USE_MOCKS=false`); containerize backend (FastAPI) and frontend (Next.js 16) with Docker Compose in an isolated workspace `/opt/lumi-wellness` on Worker 1 with strict memory limits (`1024m` web, `512m` backend) so it coexists safely with existing BarPro workers.

**Tech Stack:** Next.js 16 (App Router, standalone), FastAPI (Python 3.12, Uvicorn), SQLite/Alembic, Docker Compose, SSH Ed25519.

**Spec:** Direct user request to purge fake data and deploy to one of the BarPro worker nodes.

## Global Constraints

- Strict Persian RTL and Iranian Sans typography in all reports.
- English ASCII digits (`0-9`) exclusively across all outputs.
- No disruption or memory exhaustion for the running `barpro-celery-worker` on Worker 1.
- Strict isolation: separate Docker Compose project name, custom bridge network, and capped memory limits.
- Never commit or leak raw production credentials.

## Review Focus

- Backend startup without fake seeding when `ENVIRONMENT=production` and `SEED_DEMO_DATA=false`.
- Frontend builds and runs without mock data (`NEXT_PUBLIC_USE_MOCKS=false`).
- Database schema cleanly migrated to head revision `0003` without residual demo rows.
- Worker 1 resource impact: available memory must remain > 5.5 GB after deployment.
- Live connectivity: endpoints `/ready`, `/docs`, and web UI accessible on Worker 1.

---

### Task 1: Purge Mock/Fake Data and Disable Mock Service

**Files:**
- Modify: `apps/web/.env.local`
- Modify: `backend/app/main.py`
- Modify: `backend/gymapp.db` (reset / clean migration)
- Create / Run: script to reset clean database schema

- [ ] Check all locations where fake data / demo accounts are defined (`backend/app/seed.py`, `apps/web/src/lib/mock-service.ts`, `apps/web/.env.local`).
- [ ] Set `NEXT_PUBLIC_USE_MOCKS=false` in `apps/web/.env.local` so client uses real API endpoints.
- [ ] Ensure `backend/app/main.py` strictly prevents automatic demo seeding when `ENVIRONMENT=production` or `SEED_DEMO_DATA=false`.
- [ ] Reset database: run fresh migration `alembic upgrade head` to produce a completely clean database schema with zero fake athletes, zero fake coaches, and zero fake programs.
- [ ] Run bootstrap admin script to create a real, clean administrator account.
- [ ] Verify local backend tests (`pytest`) and web tests (`vitest`) pass cleanly.

---

### Task 2: Worker Node Selection and Server Preparation

**Files:**
- Target Server: `Worker 1` (`87.107.109.185` / `vm6489-13390.vpsmarket.org`)
- SSH Key: `~/Desktop/SSH/barpro_workers_id_ed25519`

- [ ] Confirm SSH connectivity and resource availability on Worker 1 (`free -h`, `df -h`, `docker ps`).
- [ ] Ensure existing BarPro containers (`barpro-celery-worker`, `barpro-squid-worker`) are healthy and unaffected.
- [ ] Create isolated project directory `/opt/lumi-wellness` on Worker 1.
- [ ] Verify required ports (`3000`, `8000`) are unoccupied on Worker 1.

---

### Task 3: Containerization & Docker Compose Setup for Worker 1

**Files:**
- Create: `docker-compose.prod.yml`
- Reference: `backend/Dockerfile`
- Reference: `apps/web/Dockerfile`

- [ ] Write `docker-compose.prod.yml` with:
  - Service `backend`: build `backend/Dockerfile`, port `8000:8000`, memory limit `512m`, env `ENVIRONMENT=production`, volume for sqlite `lumi_data:/srv/backend/data`.
  - Service `web`: build `apps/web/Dockerfile`, port `3000:3000`, memory limit `1024m`, args `NEXT_PUBLIC_API_URL=http://87.107.109.185:8000`, `NEXT_PUBLIC_APP_URL=http://87.107.109.185:3000`, `NEXT_PUBLIC_USE_MOCKS=false`.
  - Isolated network: `lumi-net`.
- [ ] Package and sync repository source files to `/opt/lumi-wellness` on Worker 1.
- [ ] Ensure build environment parameters and deploy guards (`deploy-env.mjs`) are satisfied.

---

### Task 4: Deployment Execution and Database Initialization on Worker 1

**Files:**
- Server Path: `/opt/lumi-wellness` on `87.107.109.185`

- [ ] Build and start containers on Worker 1: `docker compose -f docker-compose.prod.yml up -d --build`.
- [ ] Execute database migration inside backend container: `alembic upgrade head`.
- [ ] Bootstrap clean production administrator account on the remote database.
- [ ] Check container health and status: `docker compose ps` and `docker logs`.

---

### Task 5: Live Verification & Quality Gates

**Files:**
- Remote Endpoints:
  - `http://87.107.109.185:8000/ready`
  - `http://87.107.109.185:8000/docs`
  - `http://87.107.109.185:3000`

- [ ] Verify backend responds `200 OK` at `http://87.107.109.185:8000/ready`.
- [ ] Verify Swagger UI loads at `http://87.107.109.185:8000/docs`.
- [ ] Verify web frontend loads in browser at `http://87.107.109.185:3000` with clean UI and no fake demo data.
- [ ] Verify BarPro worker health on Worker 1 (`docker ps`, memory usage, zero interference).
- [ ] Capture evidence, update `.context/STATE.md` and log session record.
