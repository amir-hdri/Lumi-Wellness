# Exercise UI completion — 2026-11-10

The interrupted Design session requested a minimal redesign of the program exercise page and workout player, then explicitly requested saving all changes from that conversation to GitHub `main`. The continuation resumed the existing edits after the user authorized releasing the interrupted session's lock.

## Result

- Removed the player's fixed scenic hero and overlapping timer. The sheet now uses its shared visible title, theme surfaces, a slim progress indicator, a separate elapsed readout and clear text controls.
- Exercise cards expose sets/reps, weight and rest in three readable columns. Completed names remain legible, with completion conveyed by the checkbox.
- The program detail page reuses the dashboard's exercise row. Its section header stacks on mobile so the start button does not crowd the heading.
- Preserved the existing program-detail completion payload, save lock, persisted sets, rest timer, previous/next navigation, sound preference and confirmed restart.
- Added a disabled prop to the shared row. A failing keyboard test also reproduced a dead Tab stop on the animated label; `tabIndex={-1}` leaves the native checkbox as the keyboard control. Both regression tests passed after correction.

## Fresh verification

| Check | Result |
| --- | --- |
| Web unit/component suite | 255 passed, 34 files |
| Backend suite | 213 passed, 4 expected historical xfails |
| TypeScript / ESLint | Passed |
| Mock browser suite | 112 passed |
| Real API browser suite | 34 passed, mobile 390 × 844 and desktop 1440 × 1000 |
| Deployment-mode build | Passed with mocks disabled, deployment guard enabled and validation-only HTTPS origins |
| Independent source review | No actionable regressions found in the release commits or exercise UI diff |

Real API tests include saved-set resumption after reload, pause/skip rest and exercise completion. Browser review confirmed previous/next navigation, Escape close, focus return to the start button, no horizontal page overflow and no captured console errors. Local test/dependency warnings remain separate from failures; production infrastructure was not exercised.

## Visual evidence

The final continuation replaced the earlier cropped page captures and refreshed all eight screenshots with Agent Browser at exact CSS viewports of 390 × 844 and 1440 × 1000 in both themes. The page and player rendered without horizontal overflow, framework error overlays or browser errors. The automated real API projects independently used the same exact viewport sizes. The capture browser was closed afterward.

- [Dark mobile page](dark-mobile-page.jpg) / [player](dark-mobile-player.jpg)
- [Light mobile page](light-mobile-page.jpg) / [player](light-mobile-player.jpg)
- [Dark desktop page](dark-desktop-page.jpg) / [player](dark-desktop-player.jpg)
- [Light desktop page](light-desktop-page.jpg) / [player](light-desktop-player.jpg)

## Integration and limits

The release consists of the deployment-readiness commit, the daily workout-card commit and this exercise UI completion. All are authorized for a normal fast-forward integration into `main`; the final GitHub SHA and CI status are verified after the push. Pre-existing `.serena` deletions, generated `next-env.d.ts` and loose `.context` images are excluded from staging.

Hosted Graphify was unavailable in this session; no setup, authentication or local graph rebuild was performed. Source review and fresh tests are the evidence for this patch. Public deployment still requires the actual backend origins and infrastructure described in `docs/DEPLOYMENT_RUNBOOK.md`.
