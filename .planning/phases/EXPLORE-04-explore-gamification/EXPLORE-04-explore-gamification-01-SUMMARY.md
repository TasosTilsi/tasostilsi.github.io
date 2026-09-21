---
phase: 04-explore-gamification
plan: 01
subsystem: explore-tour-data-tier
tags: [explore, tour, gamification, domain-module, data-tier, tdd, node-test]
requires: []
provides:
  - "EXPLORE_TOUR_STORAGE_KEY / EXPLORE_VISITED_STORAGE_KEY + EXPLORE_TOUR_ACCENTS + TourStep + EXPLORE_TOUR_STEPS + EXPLORE_TOUR_FINISH (constants.ts)"
  - "placeCard (R-10-gated §3 placement table) / visitThreshold (R-2) / parseVisitedIds + serializeVisitedIds (E-8) (tour-placement.ts, import-free pure TS)"
  - "useExploreVisited hook + readTourFlag / writeTourFlag (use-explore-visited.ts — the ONLY tour/visited localStorage site)"
  - "tests/explore-tour.test.mjs — 24-test Layer-1 suite (plan 02 extends it)"
affects:
  - "EXPLORE-04-explore-gamification-02 (consumes the constants spine, placeCard, and the hook for header/status-bar/wizard UI)"
tech-stack: [react-18-hooks, intersection-observer, node-test, next-static-export, erasable-ts-type-stripping]
key-files:
  created:
    - src/components/explore/tour-placement.ts
    - src/components/explore/use-explore-visited.ts
    - tests/explore-tour.test.mjs
  modified:
    - src/components/explore/constants.ts
decisions:
  - "D-02/D-03: locked 7-entry EXPLORE_TOUR_STEPS generated from EXPLORE_SECTIONS (headings/announce derived, never duplicated literals); welcome/finish chrome strings pinned"
  - "D-05/D-06: both storage keys explore-scoped with the portfolio-explore- prefix; key references confined to constants.ts (definition) + use-explore-visited.ts (every call) — grep-provable tier map"
  - "R-10 (recorded amendment): placeCard runs a viewport-intersection gate BEFORE the §3 below/above rows — fully-above (bottom ≤ 0) and fully-below (top ≥ vh) panels dock deterministically; above additionally requires top + cardH ≤ vh − 16"
  - "R-2 (recorded amendment): visitThreshold = max(0.05, min(0.5, rootHalfVisible / panelHeight)) — per-panel IO thresholds make tall panels markable at ~50%-of-visible-root coverage"
  - "OQ-3: visited marking is IntersectionObserver-only (root = '.explore-shell > main'), one observer per panel for per-target thresholds; drawer stays byte-untouched"
  - "D-08: constants.ts stays import-free plain TS; EXPLORE_TOUR_ACCENTS duplicates the byte-untouched explore-panels.tsx ACCENTS; use-explore-theme.ts:43 pre-existing theme write untouched"
metrics:
  duration: ~45m
  completed: 2026-09-22
  commits: 3
  tasks: 3
status: complete
actuals:
  tokens: ~91000
  tasks: 3
  commits: [8993278, 88aa1db, 6545ec6]
---

# Phase 4 Plan 01: Tour Domain + Data Tier Summary

**One-liner:** The spotlight tour's constants spine (storage keys, locked 7-step table, §4 chrome copy), the import-free pure decision module (R-10-gated `placeCard`, R-2 `visitThreshold`, E-8 `parseVisitedIds`/`serializeVisitedIds`), and the `useExploreVisited` data hook — all red-first proven under the house `node --test` harness, with tour/visited storage access confined to exactly one file.

## Shipped

| Commit | Task | Content |
|---|---|---|
| 8993278 | Task 1 | `constants.ts` augmented: tour + visited storage keys (D-05/D-06), `EXPLORE_TOUR_ACCENTS`, `TourStep`, `EXPLORE_TOUR_FINISH` (D-04), `EXPLORE_TOUR_STEPS` (7-entry locked table, §4 bodies verbatim, content steps derived from `EXPLORE_SECTIONS`); suites 1–3 (keys/disjointness, accents, step table, copy guard) |
| 88aa1db | Task 2 | `tour-placement.ts`: R-10-gated `placeCard` (§3 below/above/dock/center + viewport-intersection gate), `visitThreshold` (R-2), `parseVisitedIds`/`serializeVisitedIds` (E-8); suites 4–6 (18 table tests incl. both named R-10 dock rows) |
| 6545ec6 | Task 3 | `use-explore-visited.ts`: `useExploreVisited` (literal init → after-mount sync → per-panel IO marking rooted at `.explore-shell > main` with height-aware thresholds → dedupe → guarded writes), `readTourFlag` (garbage-tolerant per E-8), `writeTourFlag` (never downgrades 'completed'); suite 7 (source invariants + tier-confinement greps) |

## TDD Gate Compliance

Plan is `type: execute` (not tdd), but the plan's session discipline required red-first on every task — all three RED runs are on record in this session's transcript:

1. Task 1 RED: `SyntaxError: The requested module '../src/components/explore/constants.ts' does not provide an export named 'EXPLORE_TOUR_ACCENTS'` — 0 pass / 1 fail, immediately before the constants edit.
2. Task 2 RED: `ERR_MODULE_NOT_FOUND: Cannot find module '.../src/components/explore/tour-placement.ts'` — 0 pass / 1 fail, before the module was created.
3. Task 3 RED: 22 pass / **2 fail** (both task-3 suites failing on the missing `use-explore-visited.ts`), before the hook was created.

Each RED was followed by GREEN in the same task: final task-3 state 24 pass / 0 fail (`node --test tests/explore-tour.test.mjs`) with `npm run typecheck` clean; the pre-existing `tests/explore-shell.test.mjs` stayed 30 pass / 0 fail. One atomic commit per task (test + implementation together — no red trees left in history).

## Verification

- `node --test tests/explore-tour.test.mjs` → 24 pass / 0 fail (suites: keys+disjointness, accents, locked 7-step table, §12.4 copy guard, §12.3 placeCard table with the two named R-10 rows, R-2 thresholds, E-8 parse/serialize, source invariants, storage-tier confinement).
- `npm run typecheck` → clean (caught and fixed one real typing issue in `parseVisitedIds` mid-task-2: `readonly ExploreSectionId[]` vs `string` `.includes`).
- Tier confinement greps on the final tree: `EXPLORE_TOUR_STORAGE_KEY|EXPLORE_VISITED_STORAGE_KEY` referenced by exactly `constants.ts` + `use-explore-visited.ts`; `localStorage` in exactly `use-explore-visited.ts` + the pre-existing `use-explore-theme.ts:43` theme write (byte-untouched, D-08).
- Full-suite + build gate on the final tree: `node --test tests/*.test.mjs` + `npm run typecheck` + `npm run build` executed as the last action of this plan (results in the orchestrator log; all green at time of return).

## Threat Flags

- **New parse surface:** `JSON.parse` on the stored `portfolio-explore-visited` value — guarded try/catch, output filtered to `EXPLORE_SECTIONS` ids, deduped; garbage/non-array JSON resolves to `[]` (table-tested, E-8). No other new input surface: no network, no eval, no innerHTML, no `dangerouslySetInnerHTML`.
- **Persisted surface:** localStorage only, both keys try/catch-guarded (E-7); `writeTourFlag` cannot downgrade 'completed' (D-04/D-05).
- **DOM probe:** `document.querySelector('.explore-shell > main')` + `document.getElementById` — null-safe (no-JS/missing-panel edges return early; E-6/R-9 spirit).

## Known Stubs

None — stub scan (TODO/FIXME/placeholder/XXX/`.skip`) over all three created files returned zero matches; no skipped tests.

## Self-Check: PASSED

- Created files exist: `src/components/explore/tour-placement.ts` (132 lines ≥ 130), `src/components/explore/use-explore-visited.ts` (126 ≥ 110), `tests/explore-tour.test.mjs` (333 ≥ 220); `constants.ts` now 132 lines (≥ 100) — all min_lines met.
- All three commits exist on `phase-4` (8993278, 88aa1db, 6545ec6), each containing only its task's files.
- Only the plan's four declared files were touched; CLI, /resume, data files, drawer, panels untouched (verified via git log + the untouched pre-existing suite).

## Handoff to Plan 02

Plan 02 (wave 2) consumes, without re-deriving: `EXPLORE_TOUR_STEPS`/`EXPLORE_TOUR_FINISH`/`EXPLORE_TOUR_ACCENTS` (chrome + chips), `placeCard`/`visitThreshold` (the single placement/threshold authority — no component-side math), `useExploreVisited`/`readTourFlag`/`writeTourFlag` (the single storage site — plan 02 components must NOT add localStorage calls, the tier-confinement test enforces it). The suite is extended-not-rewritten; keep the red-first discipline for its additions.