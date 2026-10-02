---
phase: 03-explore-visuals
plan: 01
subsystem: explore-viz-data
tags: [viz-data, pure-module, unit-tests, recharts-prep, d-05, d-08, data-derived]
requires:
  - src/data/portfolio-main-data.json (read-only data source)
  - src/data/portfolio-main-data.d.ts (PortfolioData types)
  - .planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md (§0/§2/§3/§4/§10 pins)
provides:
  - src/components/explore/viz-data.ts — pure typed data-shaping module: parseDuration, skillGroupFill, skillsGroupCounts, projectStats, techMentions, buildCareerSpan (+ 7 exported interfaces)
  - tests/explore-visuals.test.mjs — 23-test Layer-1 unit suite (node --test, every expectation JSON-derived)
affects:
  - "wave-2 component slices (skills-chart, skills-treemap, career-span-chart, project-stat-tiles) consume these functions"
  - "plan 02 moves skills-section grouping onto skillsGroupCounts (single-source pin)"
tech-stack: [TypeScript (erasable syntax only), Node 24 type stripping, node --test, zero runtime imports]
key-files:
  created:
    - src/components/explore/viz-data.ts
    - tests/explore-visuals.test.mjs
  modified: []
decisions:
  - "E-17 corrected during execution: a technology name duplicated across skill groups is counted ONCE (unique-name set guard), color from the first JSON-order group — the initial per-group accumulate double-counted (caught red by the E-17 test, fixed in-task)"
  - "Red/green enforced per task: every suite block was run to its failing state (missing export / assertion) before the implementing edit; test fixtures corrected in place when a fixture itself was wrong (MCP missing from fixtureSkills)"
  - "skillGroupFill is the single shared category→token map (chart-1..5 for contentful positions 0-4, muted-foreground from 5) consumed by both the bar chart and the treemap — no parallel color mapping allowed downstream (UI-SPEC §2/§10)"
  - "techMentions emits cells in flattened keyword-set order (JSON group order, ties by first occurrence), NO sorting — squarify renders in array order (W-1 pin); verified: no .sort( anywhere in the module"
  - "buildCareerSpan takes injectable now (default new Date() at SSG render) — tests pin geometry against 2026-09-21 without wall-clock coupling (OQ-7)"
  - "MODULE_TYPELESS_PACKAGE_JSON warning on direct .ts import under node --test is expected (module syntax auto-detection); NOT fixed via package.json 'type':'module' — an out-of-scope repo-wide change"
metrics:
  duration: "~20 min wall-clock (single executor session, estimate)"
  completed: 2026-09-21T14:28:18Z
status: complete
actuals:
  tasks: 4
  commits: 4
  tests: 23
---

# Phase 03 Plan 01: Pure viz-data module + Layer-1 unit harness Summary

Delivered the complete D-05/D-08 domain tier — one pure, typed data-shaping module (parseDuration, skillsGroupCounts + shared fill map, projectStats, techMentions, buildCareerSpan) proven by 23 green unit tests whose expectations derive from the real portfolio-main-data.json at test time.

## What was built

- **`src/components/explore/viz-data.ts`** (357 lines, zero runtime imports — only the erased type-only `@/data/portfolio-main-data` import):
  - `parseDuration()` — both dash styles (em-dash U+2014, hyphen U+002D), first-3-letter month matching (resolves the 4-letter `Sept`, R-5), `Present` semantics, `null` on malformed input, never throws.
  - `skillGroupFill()` / `skillsGroupCounts()` — the §2/§10 single-source category→token fill map (chart-1…5 for contentful positions 0-4, muted-foreground from 5) + the skills-section builder logic adopted verbatim (contentful groups, JSON order, duplicate `Languages` preserved).
  - `projectStats()` — total / en-dash active-years span / truthy-link count; optional `date`/`link` handled gracefully (R-6/E-8/E-9); the stale SPEC literal 9 structurally excluded (OQ-1/U-1).
  - `techMentions()` — D-08 whole-word case-insensitive matcher over the responsibilities-only corpus: zero-invented keywords (the set IS the JSON's technology names), escaped special chars (`C++`), conditional trailing boundary (`Java` ≠ `Javascript`, `AI Agents` ≠ `AI agent skills`), per-occurrence counting, threshold ≥1, flattened keyword-set order, no sorting.
  - `buildCareerSpan()` — month-index Gantt geometry with injectable `now`: axisStart = min parsed start, Present rows reach 100% (E-3), clamp beyond now (E-4), null geometry on unparseable (E-1/E-2), rows in JSON order with verbatim display strings, year ticks from axis-start year through axis-end year with no right-edge tick.
- **`tests/explore-visuals.test.mjs`** (456 lines, 23 tests): real-JSON contract tests (7 durations, 6 group counts, exact 4-cell/5-mention treemap reality per UI-SPEC §0, full 7-row Gantt geometry at injected now 2026-09-21) plus boundary fixtures (malformed durations, missing date/link, `Ongoing`, `Javascript` isolation, `AI Agents` singular/plural + positive control, repeated-name counting, E-17 duplicate-name, E-7/E-9/E-13 groundwork).

## Verification

- Per task: red observed on record (missing export / module-not-found / behavior bugs), then green — final suite: **23 pass, 0 fail**.
- `npm run typecheck` (tsc --noEmit) clean over the final tree.
- Acceptance greps: single type-only import in viz-data.ts; no hand-written keyword literals (`CI/CD`/`RAG`/`MCP` absent from module source); no `.sort(` anywhere; no pinned linked-count literal in tests.

## TDD Gate Compliance

Plan type is `execute` (not `tdd`); discipline followed per the plan's explicit red/green ordering — every task's tests were written and observed failing before the implementing commit. First scope-matching commit is `feat(…)` because test + implementation for Task 1 landed in one atomic per-task commit (test file and module are one unit); no `test:`/`feat:` split was required for this plan type.

## Known Stubs

None — stub scan (TODO/FIXME/placeholder/skip) over both files returns only prose mentions of graceful "skipped" data handling, no code stubs.

## Threat Flags

None — the module is pure (no DOM, no network, no `dangerouslySetInnerHTML`, no user input; regexes built only from JSON-owned technology names with special-char escaping).

## Self-Check: PASSED

- viz-data.ts exists (357 lines ≥ min_lines 170) with all 13 pinned exports (6 functions + 7 interfaces).
- tests/explore-visuals.test.mjs exists (456 lines ≥ min_lines 200) with the JSON-derived key_links patterns (`portfolio-main-data.json`, type-only aliased import in the module).
- Commits verified: 6f1868d, e5f095c, 5d2e027, 517efe7 — one atomic commit per task, conventional prefix `feat(EXPLORE-03-explore-visuals-01)`.
- Final gate (run as the last action on the final tree): `node --test tests/explore-visuals.test.mjs` + `node --test tests/explore-shell.test.mjs` + `npm run typecheck` — all green (see below for the on-record run).

## Notes for wave-2 consumers

- Chart/treemap data: `skillsGroupCounts(skills)` for bars (label/count/fill), `techMentions(experience, skills)` for cells, `skillGroupFill` never re-implemented.
- Gantt: `buildCareerSpan(experience)` — component is a dumb renderer of leftPct/widthPct/yearTicks; apply `min-width: 2px` for widthPct 0 (E-5) and hide when every row is null (E-2).
- Tiles: `projectStats(projects)` — render `activeYearsSpan ?? '—'` (E-9).
- The module has zero runtime imports so Node 24 `node --test` imports it directly; keep it that way (erasable TS syntax only, OQ-5).