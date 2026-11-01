# Agent Sync Protocol — Antigravity Rules

## Session Start (BEFORE any work)
1. Check `.context/LOCK` — if active, STOP and notify user.
2. If Cairn is active, run `cairn brief` and `cairn waypoint resume`.
3. Read `.context/STATE.md` to load active decisions and next task.
4. Run `python3 scripts/agent_sync.py start antigravity`.

## Session End (BEFORE committing)
1. If Cairn is active, run `cairn waypoint` to checkpoint.
2. Update `.context/STATE.md` (all 5 required sections).
3. Append record to `.context/SESSION_LOG.md`.
4. Atomic commit of source files together with `.context/STATE.md`.
