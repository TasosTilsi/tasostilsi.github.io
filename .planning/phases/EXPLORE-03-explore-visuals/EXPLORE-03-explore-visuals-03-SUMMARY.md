---
phase: 03-explore-visuals
plan: 03
subsystem: explore-viz-server-slices
tags: [career-span-gantt, stat-tiles, server-components, augment-only, d-02, d-03, d-05, css-gantt, data-derived]
requires:
  - src/components/explore/viz-data.ts (buildCareerSpan/projectStats from plan EXPLORE-03-explore-visuals-01)
  - src/data/portfolio-main-data.json (read-only data source)
  - .planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md (§1/§4/§5/§6/§9 pins)
provides:
  - src/components/explore/sections/career-span-chart.tsx — pure-CSS Gantt renderer (server, dumb renderer of CareerSpanData percentages, E-2 graceful-hide)
  - src/components/explore/sections/project-stat-tiles.tsx — 3-up stat tile row (server, ProjectStats via props, E-9 em-dash placeholder)
  - augmented experience-section.tsx / projects-section.tsx — CareerSpanChart (mb-5) above the <ol>, ProjectStatTiles (mb-3) above the cards
  - tests/explore-visuals-server.test.mjs — 15-test Layer-2 source-invariant carrier (server purity, augment order, verbatim-duration fidelity, no-sort, stat-literal-free tiles)
affects:
  - "plan 04 (global verify) consumes both slices as part of the cross-plan gate"
  - "phase-4 gamification / phase-5 routing inherit these panel bodies untouched"
tech-stack: [React 18 server components, Tailwind 3, zero client JS for both slices, node --test source invariants]
key-files:
  created:
    - src/components/explore/sections/career-span-chart.tsx
    - src/components/explore/sections/project-stat-tiles.tsx
    - tests/explore-visuals-server.test.mjs
  modified:
    - src/components/explore/sections/experience-section.tsx
    - src/components/explore/sections/projects-section.tsx
decisions:
  - "Wrapper guards live in the sections, E-2 null-return lives in the component: the section mounts the mb-5/mb-3 wrappers only when geometry exists (span.rows.some(leftPct !== null)), so an all-unparseable set leaves no stray margin while the component itself still defends against a caller passing a dead span"
  - "Bar renders only when BOTH leftPct and widthPct are non-null (type-honest narrowing of the together-set pair) — geometry unknown is never invented (E-1)"
  - "min-w-0 on the flex title span: the only way the pinned 'wraps fully, never clipped' contract can hold inside justify-between (flex min-width:auto would otherwise overflow)"
  - "Tiles data as a small local {value,label} array keyed by label — three pinned rows read left→right per §5 with no literal counts anywhere (EXPLORE-07/OQ-1)"
  - "Red/green enforced per task: Task-1 RED = 7 failing invariants (missing component + unmet augment order); Task-2 RED = 6 additional failures before the tiles landed; each task committed atomically after its green run"
metrics:
  duration: "~25 min wall-clock (single executor session, estimate)"
  completed: 2026-09-21T15:05:00Z
status: complete
actuals:
  tasks: 2
  commits: 2
  tests: 15
---

# Phase 03 Plan 03: Server viz slices — CSS career-span Gantt + project stat tiles Summary

Delivered both server-rendered visualization slices end-to-end: the pure-CSS career-span Gantt (all 7 roles, percentage-positioned, tech/non-tech two-tone, verbatim durations) above the byte-unchanged 3-role text timeline, and the three JSON-derived stat tiles above the byte-unchanged project cards — zero client JS, zero tooltips, zero stat literals.

## What was built

- **`src/components/explore/sections/career-span-chart.tsx`** (78 lines, server component — no client directive, no hooks, no recharts, per the D-02 approved deviation):
  - Dumb renderer of plan-01's `CareerSpanData` percentages (D-05): axis header (`border-b border-border` + `mb-2`, `h-4`) with absolutely positioned year ticks at `leftPct%` / `-translate-x-1/2`, real-text `text-[10px]` labels from `tick.year` — no literal year anywhere.
  - 7 rows in JSON order (`space-y-3`, R-4/E-6 — never sorted): header line (title `min-w-0` left, duration `shrink-0 tabular-nums` right rendered **VERBATIM AS STORED** — em-dash stays em-dash, hyphen stays hyphen), wrapping company line, full-span `bg-muted` track (aria-hidden) containing the bar only when geometry exists: `bg-chart-2` for `isTechRelated`, `bg-muted-foreground` otherwise, `minWidth: 2` for degenerate spans (E-5), clamping already done in viz-data (E-4).
  - E-1: unparseable rows render text + track with NO bar; E-2: every row null → component returns null.
  - No legend, no vertical gridlines, no hover/focus/cursor (D-04/§6); bars/tracks aria-hidden, ticks + row text real text (§9).
- **`src/components/explore/sections/project-stat-tiles.tsx`** (33 lines, server component): pinned §5 anatomy — `grid grid-cols-3 gap-2` root (never stacks), `rounded-md border border-border p-2.5` tiles, `text-sm font-medium tabular-nums leading-none` value over `mt-1 text-[10px] uppercase tracking-wider` label; Projects / Active Years (`stats.activeYearsSpan ?? '—'`, E-9) / Linked in the §5 order; values and labels read as pairs in DOM order (§9); zero stat literals (EXPLORE-07/OQ-1).
- **`src/components/explore/sections/experience-section.tsx`** (augmented, 90 lines): `buildCareerSpan(experience)` on the FULL array (never the slice(0,3) `roles`), `CareerSpanChart` in an `mb-5` wrapper composed before the byte-identical `<ol>` (graceful-hide `slice(0,3)`/`return null` untouched; wrapper mounts only when geometry exists).
- **`src/components/explore/sections/projects-section.tsx`** (augmented, 96 lines): `projectStats(projects)` + `ProjectStatTiles` in an `mb-3` wrapper as the FIRST child of the `space-y-2` root, before the byte-identical 6-card map (TerminalPointer, graceful-hide, one-link-card anchor unchanged).
- **`tests/explore-visuals-server.test.mjs`** (162 lines, 15 tests): plan-03's Layer-2 carrier — server purity (no `"use client"`, no recharts, no hooks), augment order (Gantt before `<ol>`, tiles before `cards.map`), full-array vs slice feeding, verbatim-duration fidelity (no `.replace(` normalization, no `.sort(`), aria/color/minWidth pins, stat-literal-free tiles (doc comments stripped before grepping), byte-stability guards on both section bodies' pre-existing logic.

## Verification

- Per task, red observed on record then green: Task 1 — 7 failing (missing component ENOENT + unmet augment invariants) → 8/8 green; Task 2 — 6 additional failures → 15/15 green (0 fail).
- `npm run typecheck` (tsc --noEmit) exits 0 after each task.
- Augment-only greps: no `.sort(` / `.replace(` in the four touched source files; no `"use client"` / recharts import in either new server component; `mb-5` and `mb-3` wrappers present at the pinned positions.
- Phase-1/plan-01 regression: `node --test tests/explore-shell.test.mjs` and `node --test tests/explore-visuals.test.mjs` green on the final tree (see Self-Check run).

## TDD Gate Compliance

Plan type is `execute` (not `tdd`); red/green followed per the plan's explicit ordering — each task's invariants were written and observed failing before the implementing edit, and the first scope-matching commit is `feat(EXPLORE-03-explore-visuals-03): …` with test + implementation landed as one atomic per-task commit (the carrier and its component form one unit per task). No `test:`/`feat:` split was required for this plan type; no missing gates.

## Known Stubs

None — the only `placeholder` hits are prose describing the E-9 em-dash placeholder behavior (a data-handling rule, not unfinished code); no TODO/FIXME/XXX/skip anywhere in the five files.

## Threat Flags

None — both new components are pure renderers: no `dangerouslySetInnerHTML`, no eval/exec, no network or storage, no user input; every rendered value arrives precomputed from viz-data (which escapes/handles the only string-derived surface).

## Self-Check: PASSED

- All five artifacts exist at the pinned paths with min_lines met: career-span-chart.tsx 78 (≥60, exports `CareerSpanChart`), project-stat-tiles.tsx 33 (≥30, exports `ProjectStatTiles`), experience-section.tsx 90 (≥80), projects-section.tsx 96 (≥90), tests/explore-visuals-server.test.mjs 162 (≥120).
- key_links verified in source: experience-section → career-span-chart (`<CareerSpanChart` before `<ol>`, `buildCareerSpan` from `'../viz-data'`), projects-section → project-stat-tiles (`<ProjectStatTiles` before `cards.map(`, `projectStats` from `'../viz-data'`).
- Commits verified: 90e79c8 (Task 1: Gantt) and c9286d8 (Task 2: tiles) — one atomic commit per task, conventional prefix `feat(EXPLORE-03-explore-visuals-03)`, only the task's own `<files>` staged.
- On-record final gates: `node --test tests/explore-visuals-server.test.mjs` → 15 pass / 0 fail; `npm run typecheck` → exit 0. Full three-suite gate + typecheck re-run chronologically last on the final tree — see the completion report.

## Notes for wave-2 consumers

- Plan 04's global verify should include an export-level check: the Gantt and tiles are fully server-rendered and must appear complete in `out/explore.html` without JS (only the recharts skills chart is shells-only).
- The tile values are computed at SSG render from the JSON — linked count is whatever the data yields (14 today), never a pinned literal (OQ-1).
- No tooltips, no animation, no hover were added anywhere (D-04/§6); the reduced-motion story needs nothing from these slices.