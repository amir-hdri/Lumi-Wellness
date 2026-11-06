# Lumi UI Upgrade Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan in the current session, task by task, followed by an independent whole-change review.

**Goal:** Implement the user-approved full UI upgrade while preserving Lumi's identity and working API flows.
**Architecture:** Improve shared primitives first, repair evidenced page defects, then review every route through its shared shell. Keep current props and lazy data/chart boundaries.
**Tech Stack:** Next.js 16.3, React 19, Tailwind 4, Radix, React Query, Framer Motion.
**Spec:** ../specs/2026-11-06-ui-upgrade-design.md (full implementation approved by user in this session).

## Global Constraints

- Persian RTL; dark default and light counterpart; semantic colors; controls at least 44px.
- Keep the 7 active-day capsule window, admin-only renewal approval and current API permissions.
- No Expo/dependency installation, broad RSC migration, deployment or production database operations.
- Preserve pre-existing `.serena/`, `next-env.d.ts` and screenshot changes.
- Ruling: use the existing checkout on `codex/ui-upgrade`, protected by the owned `codex-ui` lock, and make one atomic final commit with context. This avoids copying pre-existing unrelated work or releasing the lock between tasks.

## Review Focus

- Repeated form labels and external ARIA descriptions must remain unique and connected.
- Asynchronously fetched goals must populate fields and persist every editable field.
- Failed saves/deletes must retain entered data and show errors; destructive actions require confirmation.
- Receptionist header destinations must remain within the admitted admin portal.
- Short/mobile viewports, long content and reduced motion must keep controls reachable and readable.

### Task 1: Shared field and control behavior

**Files:** components/ui/{Input,Textarea,Button,Select,Switch,Tabs}.tsx; components/twilight/{CtaButton,controls,Type,Page}.tsx; globals.css.
**Interfaces:** Existing public props remain; generated IDs only when explicit IDs absent. ARIA descriptions concatenate consumer and internal references.
- [x] Add failing regression assertions for duplicate labels/external descriptions and reduced-motion counters in existing/new behavioral tests.
- [x] Run focused Vitest and verify expected failures.
- [x] Implement stable IDs, clear focus, 44px targets, precise transitions, semantic CTA foreground, shared motion timing and readable/mobile-safe typography.
- [x] Re-run focused tests.

### Task 2: Shell, overlays and navigation

**Files:** components/layout/{Header,PortalLayout}.tsx; components/ui/{Dialog,Sheet}.tsx; twilight/DockNav.tsx; app/layout.tsx; PwaRegister.tsx.
**Interfaces:** Portal props remain; role destinations derive from current user role. Overlays retain Radix focus/keyboard behavior.
- [x] Add a regression test for receptionist profile/notification links.
- [x] Verify failure, implement admitted role destinations, descriptive avatar/menu names and long-content handling.
- [x] Bound dialog height and inner scrolling, include safe areas, coordinate dock/PWA clearance and improve skip-link focus behavior.
- [x] Verify keyboard/focus and short-viewport overlays in browser.

### Task 3: Athlete goal workflow

**Files:** app/athlete/goals/{[id],new}/page.tsx; goal form shared module if needed; goal tests.
**Interfaces:** Existing useUpdateGoal({id,data}) and useDeleteGoal(id); existing backend ownership policy permits athlete operations on own goals.
- [x] Write tests for async form population, all-field payload, failed-save retention and confirmed deletion; watch them fail.
- [x] Implement form hydration without resetting dirty fields, finite numeric validation, legal category/date values, labelled select, truthful feedback and confirmed deletion.
- [x] Verify targeted tests and live mock save/reload.

### Task 4: Athlete remaining interactions

**Files:** athlete/exercises/[id]/page.tsx; athlete/notifications/page.tsx; athlete/membership/payments/[id]/page.tsx; lib/payment-receipt.ts; twilight/CapsuleChart.tsx.
**Interfaces:** Existing log/read/delete/payment hooks. Print uses browser print; download labels accurately describe a text receipt.
- [x] Write behavioral tests for keyboard notification reading and receipt actions, then verify failures.
- [x] Connect labels, implement independent read/delete controls and receipt actions, make capsule gradient IDs unique.
- [x] Verify focused tests and browser actions.

### Task 5: Page consistency and URL state

**Files:** all active app routes via shared page headers/controls, admin TableControls/use-pagination, coach/athlete filters, auth/public links, lib/hooks for URL state.
**Interfaces:** Filter names and enum values validated; unknown URL values use safe defaults. Back/forward restores state and links preserve native navigation.
- [x] Add a focused behavioral test of valid/invalid URL state and back navigation.
- [x] Implement reusable lightweight URL state with existing browser APIs, preserve query parameters, migrate filter/tab/page users where suitable.
- [x] Align page action placement, empty/loading/error states, typography, RTL spacing and touch overrides identified by baseline.
- [x] Review each of 54 route entries and targeted long-content/mobile cases; document unaffected routes too.

### Task 6: Verification and handoff

**Files:** docs/UI_UX_AUDIT_2026-11-06.md; docs/ui-audit/*; DESIGN_SYSTEM.md; .context/{STATE,SESSION_LOG}.md.
- [x] Run full TypeScript/ESLint/Vitest, build and relevant existing/new e2e against mock and real API where feasible.
- [ ] Inspect final light/dark/mobile/desktop screenshots, actual CTA contrast, focus, short overlays and reduced motion.
- [x] Request independent review of final diff and address actionable findings; no implementation delegation per task.
- [x] Record per-route evidence, limitations, graph provenance/freshness and decisions; mark this checklist using actual results.
- [x] Stage only session-owned changes and context; make local atomic commit and verify lock release.

## Execution ledger

Tasks 1–5 complete. Final: TypeScript/ESLint, 240 unit tests, 112 mock browser tests and 34 real-API browser tests passed; both production builds passed. Independent review fixes are covered by regression tests. Ruling: preserve an owner-scoped session draft for browser history instead of trying to cancel Next popstate; document this behavior. Manual final screenshots are pending a new Ego space after the original space disappeared. Source/context handoff prepared for the atomic local commit; manual screenshots remain optional and pending explicit permission for a new Ego workspace.
