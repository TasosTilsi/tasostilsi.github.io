---
phase: EXPLORE-07-look-and-feel-revision
plan: 01
subsystem: explore-panels
tags: [explore, REV-08, REV-10, chart-removal, audit-first, non-chart-showcase, viz-data]
requires:
  - ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-SPEC.md (locked what/why)"
  - ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-UI-SPEC.md (§2-§3, §8, §10 removal contract)"
  - ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-RESEARCH.md (blast radius + U-6 verification)"
  - ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-CONTEXT.md (D-01..D-05)"
  - "src/components/explore/viz-data.ts survivors consumed by skills-section + projects-section"
provides:
  - "EXPLORE-07-AUDIT.md — the falsifiable audit table (rows A-01..A-20) that plans 02/03 fixes reference"
  - "A chart-free /explore surface: Experience rail+dots timeline as first body child with the merged duration·location meta row; Projects stat-tiles + ≤6 cards"
  - "viz-data.ts shrunk to the survivor API (skillGroupFill, skillsGroupCounts, GLOBAL_YEAR_PATTERN, projectStats) with the parse block and both builders deleted"
  - "Rewritten test contracts: explore-visuals-server (non-chart composition), explore-visuals (absence + survivor inversions), explore-tour (no-chart source grep)"
affects:
  - "EXPLORE-07-look-and-feel-revision-02 (skills restyle / index device / gutter — builds on this tree)"
  - "EXPLORE-07-look-and-feel-revision-03 (motion vocabulary — targets the polished non-chart panels)"
tech-stack: [next, react, tailwindcss, node-test]
key_files:
  created:
    - ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-AUDIT.md"
  modified:
    - "src/components/explore/viz-data.ts"
    - "src/components/explore/sections/experience-section.tsx"
    - "src/components/explore/sections/projects-section.tsx"
    - "src/components/explore/constants.ts"
    - "src/components/explore/explore-status-bar.tsx"
    - "tests/explore-visuals-server.test.mjs"
    - "tests/explore-visuals.test.mjs"
    - "tests/explore-visuals-skills.test.mjs"
    - "tests/explore-tour.test.mjs"
  deleted:
    - "src/components/explore/sections/projects-calendar.tsx"
    - "src/components/explore/sections/career-span-chart.tsx"
    - "tests/projects-calendar.test.mjs"
decisions:
  - "D-03 honored end-to-end: both Gantt-style charts deleted with their data machinery; Experience showcase = refined rail+dots timeline (taste-level only, REV-07 still deferred); Projects = stat tiles + cards"
  - "U-6: the whole parse block (parseDuration/parseMonthToken/MONTH_NAMES/YEAR_PATTERN/parseMonthYear) removed — no consumer survived both builder deletions"
  - "U-8: Experience meta merged into ONE <p> (tabular-nums duration + aria-hidden ' · ' + verbatim location), preserving the current company→meta rhythm (plan's literal class list used; the UI-SPEC §3.1 mt-0.5 sketch superseded by the plan contract)"
  - "U-10: tour copy rewritten to 'Roles in order — title, company, tenure, and the shape of the career as a timeline.' — digit-guard clean, chart-free"
  - "DEV-1 (recorded): the plan's 'grep -c YEAR_PATTERN prints 0' acceptance is unsatisfiable alongside its own GLOBAL_YEAR_PATTERN survivor pin (substring collision); verified word-bounded (`grep -cE '\\bYEAR_PATTERN\\b'` → 0) and in-test via a lookbehind regex"
  - "DEV-2 (recorded): interaction-free-charts test dropped per plan ('now-subject-free'); its surviving subject (project-stat-tiles) keeps purity pins in the server suite"
  - "DEV-3 (noted, not acted): explore-shell.tsx:48 prose still says 'LIVE N/5 counter' — same stale-claim family as R11 but the file is outside task 3's <files>; left for the verify step (no unrelated refactors)"
metrics:
  duration: "~15 min (3 tasks, 3 commits)"
  completed: "2026-09-24T00:53:11+03:00"
  baseline_tests: 200
  final_tests: 176
  suite_delta: "-24 (projects-calendar suite 11 dropped with subject; parseDuration tracers 2 + buildCareerSpan block 6 + Gantt export 1 + interaction-free-charts 1 dropped; career-span server block 8 → 4 replacement composition tests; +1 tour no-chart grep)"
status: complete
actuals:
  tasks: 3
  commits: 3
---

# Phase EXPLORE-07 Plan 01: Chart Removal + Audit-First Gate Summary

**One-liner:** Both Gantt-style charts and their entire data machinery deleted behind a committed audit-first gate (A-01..A-20), leaving the Experience rail+dots timeline with a merged duration·location meta row and Projects on stat tiles + cards — full gate green (build + typecheck + 176/176).

## What shipped (per task)

- **Task 1 — `0a06623` (audit-first process gate, REV-10/D-01):** `EXPLORE-07-AUDIT.md` committed as the phase's FIRST commit, before every fix. Scan→Diagnose ran over all 8 mandatory regions (shell frame · header bar · intro strip · panel grid · About+Contact · Experience · Skills · Projects) plus disposition-only surfaces (status bar, drawer, tour, shell, intro). The 12 seeded rows validated and refined into A-01…A-20; dispositions limited to fixed / kept-by-design / no-op; fix order follows the redesign skill's priority (removals → hierarchy → motion states), matching plan waves 01→02→03.
- **Task 2 — `daba677` (tracer, REV-08):** Projects year-grid calendar removed end-to-end — RED recorded first (rewritten absence test failing 43/1 against the unedited tree), then `projects-calendar.tsx` + `buildProjectCalendar`/`ProjectCalendarRow`/`ProjectCalendarData`/`YEAR_ONLY_PATTERN` deleted, the `hasCalendar` gate + mb-5 wrapper excised (stat tiles now the first body child), `tests/projects-calendar.test.mjs` dropped with its subject, and the calendar export test rewritten to absence + tiles + exactly 6 card names (OQ-D — the all-14 loop would have lied). GREEN 44/44.
- **Task 3 — `d3c587d` (REV-08/D-03/U-6/U-8/U-10):** RED recorded 68/6 (exactly the six renewed assertions), then: `career-span-chart.tsx` deleted; the `buildCareerSpan` block + `CareerSpanRow/CareerSpanData/YearTick`/`monthIndex` AND the whole parse block removed from `viz-data.ts` (survivors byte-identical); Experience section carries no viz-data import, opens with the rail+dots `<ol>`, and renders the merged meta row (`tabular-nums` duration + aria-hidden ` · ` + verbatim location); tour copy rewritten (no digits beyond "60", no chart mention); status-bar prose corrected to N/4; cross-cutting tests inverted (parse-site absence + survivor pins, D-09 file-absence + timeline keeps); skills-suite comment fixed. GREEN 74/74, then the full gate.

## Verification evidence

| Gate | Result |
|---|---|
| Task-2 RED (test-first) | 43 pass / 1 fail — the rewritten calendar-absence test, against the unedited tree |
| Task-2 GREEN | 44/44 (build + both suites) |
| Task-3 RED (test-first) | 68 pass / 6 fail — exactly the six new/renewed assertions |
| Task-3 GREEN | 74/74 (three affected suites) |
| Full gate (mid-phase) | `rm -rf out && npm run build` ✓ → `npm run typecheck` ✓ → `node --test tests/*.mjs` 176/176 ✓ |
| Export sanity (fresh `out/explore.html`) | no `Projects calendar` substring; no `career-span` copy; duration + location + ` · ` separator render; all 6 card names present |
| Acceptance greps | all 8 gone-symbols → 0 in `viz-data.ts` (YEAR_PATTERN word-bounded, see DEV-1); 4 survivors ≥ 1; zero chart references in either section file; `career-span chart` → 0 in constants |

## TDD Gate Compliance

Plan type is `execute` (not `tdd`), but the plan's own red/green discipline was enforced inside tasks 2–3: the test renewals were committed in the SAME atomic commit as the code (commit-is-green-on-the-tree-it-creates), and each RED run is recorded above with the exact failing assertions before any implementation edit. No `test:`/`feat:` split was required by the plan; the tdd_audit ship gate does not apply to a non-tdd plan.

## Known Stubs

None. Stub scan (`TODO|FIXME|placeholder|\.skip`) over the changed surface returns only prose hits: the removed placeholder-body machinery description in `panel-shell.tsx`, the E-9 em-dash placeholder (a real graceful-hide value, pinned by tests), and a test name describing the removed machinery. No skipped tests, no debug artifacts.

## Threat Flags

None. No new external surface: outbound anchors keep `target="_blank" rel="noopener noreferrer"` (verified in both sections); no new dependencies (38 keys, pinned by test); no JS animation APIs introduced; `--chart-4`/`--chart-2` tokens stay live (drawer digits/tour accents, timeline dot/chip); the reduced-motion guard block is byte-untouched. The deleted charts' aria-labels were the only a11y regression risk — the replacement contract keeps all role/project data as real DOM text (export-verified).

## Deviations & notes

- **DEV-1:** `grep -c YEAR_PATTERN` raw substring prints 3 (all inside the pinned survivor `GLOBAL_YEAR_PATTERN`); the honest absence check is word-bounded: `grep -cE '\bYEAR_PATTERN\b' src/components/explore/viz-data.ts` → 0, mirrored in the suite via `/(?<![A-Z_])YEAR_PATTERN(?![A-Z_])/`.
- **DEV-2:** the interaction-free-charts test was dropped as the plan instructed; note the plan's premise ("the array is empty") was slightly off — `serverSlices` keeps `project-stat-tiles.tsx` (live), which retains its own purity pins in the server suite.
- **DEV-3:** stale "N/5" prose in `explore-shell.tsx:48` left untouched (file not in the task's <files> list; REV-10 forbids unrelated edits) — flagged for the verify step.
- Suite count drifted 200 → 176 as anticipated (UI-SPEC §2.2 "Suite count" row + R8); the delta breakdown is in the frontmatter.

## Self-Check: PASSED

- Created: `.planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-AUDIT.md` exists ✓ (37 lines, all 8 regions + 20 disposition rows).
- Deleted: `projects-calendar.tsx`, `career-span-chart.tsx`, `tests/projects-calendar.test.mjs` — all absent ✓.
- Commits: `0a06623` (audit, precedes all fixes) → `daba677` (calendar) → `d3c587d` (career-span + polish) on `phase-7` ✓; `git log` order confirms the audit commit precedes the first `src/` fix commit ✓.
- Working tree: clean of task artefacts after commit 3 (only pre-existing untracked tool junk remains) ✓.