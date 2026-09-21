---
phase: 04-explore-gamification
plan: 02
subsystem: explore-tour-ui
tags: [explore, tour, spotlight, gamification, ui-layer, tdd, node-test, next-static-export]
requires:
  - "EXPLORE-04-explore-gamification-01 (constants spine, placeCard/visitThreshold/parseVisitedIds, useExploreVisited + tour-flag accessors)"
provides:
  - "ExploreTour (explore-tour.tsx) — client-only non-modal spotlight wizard: fixed z-40 overlay inside the shell root (never portaled), box-shadow cut-out (100vmax), placeCard-placed step card, locked 7-step pacing, ESC/Tab/Arrow keyboard contract, auto-open, finish-card CLI link"
  - "ExploreShell state lifting (OQ-7): single useExploreVisited instance + tourOpen/tourEpoch; ExploreTour composed as the LAST child of the shell root"
  - "Header Tour button (44px ghost, lucide Compass, aria-label 'Start the guided tour') as LEFTMOST of the right cluster — Theme/Drawer pair byte-identical, drawer stays RIGHTMOST"
  - "LIVE status-bar counter: visitedCount prop drives 'N/5 sections visited' inside the existing aria-live region, text-accent at 5/5 (E-13)"
  - "tests/explore-tour.test.mjs extended to 39 tests (overlay/ESC/fade/spotlight/auto-open/export contracts); tests/explore-shell.test.mjs status-bar assertion renewed to the live-variable form (R-4)"
affects:
  - "EXPLORE-04 verify/ship gates (phase acceptance sweep)"
  - "phase-5 explore-routing (CLI prefill deferred; the finish card is the only cross-surface pointer)"
tech-stack: [react-18-hooks, intersection-observer-via-plan-01-hook, scrollend-settle, next-link, lucide-react, node-test, next-static-export]
key-files:
  created:
    - src/components/explore/explore-tour.tsx
  modified:
    - src/components/explore/explore-shell.tsx
    - src/components/explore/explore-header.tsx
    - src/components/explore/explore-status-bar.tsx
    - tests/explore-tour.test.mjs
    - tests/explore-shell.test.mjs
decisions:
  - "R-1 amendment applied in code: hole box-shadow spread 100vmax (the original viewport-width unit under-covered tall portrait viewports); technique, element count, opacity unchanged (D-01 preserved)"
  - "§10 dim fade implemented as an inline <style> @keyframes tour-dim-in (opacity 0→1, 150ms ease-out) carried by BOTH dim-painters (hole + plain dim) as a CSS animation — the only overlay animation; suppressed under prefers-reduced-motion by the phase-1 guard (globals.css:581-593) with zero new CSS"
  - "Dim-painter reconciliation: hole and plain dim render as TWO SIBLING conditional slots before the card (not a same-type ternary at one slot) — React would have preserved a same-type div across welcome↔content swaps and killed the pinned fade replay; sibling slots remount on painter-kind swap, stay stable across content-step changes/re-measures, and need no React key on the hole (§10 no-remount pin)"
  - "W-3 re-measure is measure-only: exactly ONE scroll-into-view call site in the file (step activation); resize/orientationchange rAF-coalesced, main scrollend re-measures panel + card size + viewport, never re-scrolls"
  - "§9 over §4 sizing governance: all three card touch controls (X/Back/Next) are px-based h-[44px]; non-touch layout minimums (heading row min-h-11) stay §4-verbatim"
  - "E-2 conflict resolved per UI-SPEC §13: the card Tab trap is card-ELEMENT-scoped (inherently suspended while the drawer holds focus); Radix's return-to-trigger governs on drawer close — no post-drawer-close refocus implemented"
  - "Auto-open: mount-only effect, suppressed by ANY non-null tour flag (E-8, via the plan-01 readTourFlag accessor), 800ms timer cancelled by document pointerdown/keydown (once+capture), never bumps reopenEpoch (E-10)"
  - "'completed' flag bound to finish ACTIVATION (render), not dismissal; dismiss writes 'seen' which writeTourFlag no-ops post-completion (D-04/D-05); no flag write on navigation-away (E-11)"
metrics:
  duration: ~2h
  completed: 2026-09-22
  commits: 3
  tasks: 3
status: complete
actuals:
  tokens: ~115000
  tasks: 3
  commits: [fd87af4, 6463e1b, fb24c24]
---

# Phase 4 Plan 02: ExploreTour UI Layer Summary

**One-liner:** The visible spotlight tour — fixed z-40 non-modal overlay with a 100vmax box-shadow cut-out, locked 7-step card wizard with scroll-settle measurement and instant re-positioning, 150ms §10 dim fade, header Tour trigger, auto-open-once, the LIVE persisted `N/5 sections visited` counter, and the finish card's CLI pointer — delivered red-first with the full phase gate green on the final tree.

## Shipped

| Commit | Task | Content |
|---|---|---|
| fd87af4 | Task 1 | `explore-tour.tsx` spine: overlay wrapper (`data-tour-overlay`, fixed inset-0 z-40, pointer-events-none, never portaled), plain `rgba(0,0,0,0.7)` dim with the §10 `tour-dim-in 150ms` fade, non-modal card (`role="dialog" aria-modal="false"`, tabIndex −1, focus + card-scoped Tab trap + Arrow keys), Back/dots+counter/Next controls (all three touch controls px-based 44px), X/ESC dismiss with `stopImmediatePropagation` + focus return, finish card (`next/link` → `/` + hint, 'completed' on activation), shell state lifting (OQ-7), header Tour button (Compass, leftmost — Theme/Drawer byte-identical); plan-02 suites 1–8 |
| 6463e1b | Task 2 | Content-step spotlight: §3 activation order (mark visited → settle → measure → render), settle primitive (already-in-view fast path + scrollend racing a 700ms idempotent guard + double-rAF, reduced-motion behavior branch), hole element (12px-inflated, rounded-md, `0 0 0 100vmax rgba(0,0,0,0.7)`, persistent sibling slot, no key), W-3 measure-only re-measure (resize/orientationchange rAF-coalesced + main scrollend), E-6 missing-target guard, sibling-slot fix for the fade-replay semantics; plan-02 suites 9–12 |
| fb24c24 | Task 3 | Auto-open (mount-only, flag-suppressed, 800ms, pointerdown/keydown-cancelled), LIVE status-bar counter (`visitedCount` prop, `${visitedCount}/${EXPLORE_SECTIONS.length} sections visited`, text-accent at 5/5), stale status-bar assertion renewed to the live-variable form (R-4), export-level suite; suites 13–16 |

## TDD Gate Compliance

Plan is `type: execute`; the plan's own red-first ordering was enforced per task — all RED runs on record in this session's transcript:

1. Task 1 RED: `node --test tests/explore-tour.test.mjs` → **24 pass / 7 fail** — the seven new plan-02 suites failing on the missing `explore-tour.tsx` and header order (before any implementation existed).
2. Task 2 RED: **32 pass / 3 fail** — the settle, hole (100vmax), and re-measure suites failing on the absent spotlight code.
3. Task 3 RED: `node --test tests/explore-shell.test.mjs` → **29 pass / 1 fail** (the renewed LIVE-counter test against the still-literal status bar) and the tour suite → **36 pass / 3 fail** (auto-open, live counter, `visitedCount={visitedCount}`).

Each RED was followed by GREEN in the same task; one atomic commit per task (test + implementation together — no red trees left in history). Task-1 test-harness typo (`exportHtml` → `exportHtmlPath`) fixed before implementation — test-file-only edit, RED still on record.

## Verification

- **Full phase gate on the final tree** (chronologically last action of this plan, re-run after the summary write): `npm run typecheck` clean; `npm run build` exports `/explore` statically (120 kB, `✓ Exporting (2/2)`); `node --test tests/*.test.mjs` (GLOB form — the bare directory form fails on Node 24) → **132 pass / 0 fail across all 5 suite files**.
- Task-level gates: Task 1 `typecheck && build && tour-suite(31) && shell-suite(30)`; Task 2 `typecheck && tour-suite(35)` (+ shell suite 30); Task 3 unit-level re-run 30/30 + 39/39 before the full gate.
- Key greps asserted by the suites (all green): `100vmax` present / `100vw` absent; `scrollIntoView` count === 1; comment-stripped source contains no `transition`; both dim-painters carry `tour-dim-in 150ms ease-out`; no `createPortal`; `{ capture: true }` + `stopImmediatePropagation`; `h-[44px] w-[44px]` + `h-[44px] px-3` ×≥2; header order Tour→Theme→Drawer with drawer RIGHTMOST.
- Export-level (`out/explore.html`): contains `aria-label="Start the guided tour"` AND the SSR literal-0 `0/5 sections visited`; does NOT contain `data-tour-overlay` (client-mount-only overlay, §12.6/R-5).
- Augment-only verified over the full plan range (`git diff --stat c6152ce -- src/ tests/`): only `explore-tour.tsx` (new), `explore-shell.tsx`, `explore-header.tsx`, `explore-status-bar.tsx`, and the two test files changed — CLI, `/resume`, data files, panels, drawer, intro all byte-untouched (D-08).

## Threat Flags

- **No new input surface:** no network calls, no eval/Function, no innerHTML/`dangerouslySetInnerHTML` (scan clean over all plan files). The only parse surface remains plan-01's guarded `JSON.parse` (unchanged).
- **Persisted surface:** localStorage only, via the plan-01 accessors — `explore-tour.tsx` never touches storage directly (tier-confinement suite keeps `EXPLORE_TOUR_*`/`EXPLORE_VISITED_*` references confined to `constants.ts` + `use-explore-visited.ts`; `localStorage` calls confined to the data tier + the pre-existing theme write).
- **Pointer/keyboard surface:** the overlay is pointer-events-none except the card; the ESC document-capture listener is registered only while open and removed on close; the auto-open timer + once-listeners are removed on fire/cleanup (no dangling document listeners).
- **Geometry integrity:** R-6 comment embedded in the component — no transformed ancestor may be introduced between the overlay and the viewport, or all overlay coordinates silently break.

## Known Stubs

None — stub scan (`TODO|FIXME|placeholder|XXX|.skip`, case-insensitive) over all five created/modified files returned zero matches; no skipped tests.

## Self-Check: PASSED

- Created/modified files exist with min_lines met: `explore-tour.tsx` 450 (≥280), `explore-shell.tsx` 82 (≥75), `explore-header.tsx` 101 (≥100), `explore-status-bar.tsx` 53 (≥40), `tests/explore-tour.test.mjs` 534 (≥380), `tests/explore-shell.test.mjs` 431 (≥430).
- All three commits exist on `phase-4` (fd87af4, 6463e1b, fb24c24), each containing only its task's declared files.
- The full gate (typecheck + build + 132-test glob suite) was green on the final tree as the plan's last action.

## Handoff to Verify

Human-UAT items the suites cannot pin (feed the phase's human-verification list): 375px dock mode + no horizontal scroll during the tour; spotlight alignment through real scrolling; auto-open exactly once + suppression across reloads; reduced-motion instant jump + suppressed fade; drawer-mid-tour ESC ordering (tour first, drawer on the next press); private-mode per-session behavior. Plan 02 leaves no code debt to plan 01/03: the drawer, panels, CLI, `/resume`, and data files are byte-untouched, and the finish card is the phase's only cross-surface pointer.