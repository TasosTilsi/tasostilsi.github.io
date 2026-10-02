---
phase: EXPLORE-06-explore-revision
plan: "04"
subsystem: explore-viz
tags: [rev-05, rev-06, competency-cards, year-grid-calendar, recharts-removal, viz-data, green-gate, d-06, d-07]
requires:
  - "plan EXPLORE-06-explore-revision-01 — the refreshed data contract (core_competencies 8 clusters typed in portfolio-main-data.d.ts; U-4 3-role isTechRelated flip)"
  - "plan EXPLORE-06-explore-revision-02 — the 4-section 2×2 grid + merged panel the skills/projects bodies render inside"
  - "plan EXPLORE-06-explore-revision-03 — the two pre-triaged explore-visuals.test.mjs rows (techMentions corpus, Smartup fixture) this plan rewrites"
  - "src/data/portfolio-main-data.json — 14 project dates + core_competencies feed both new renderings"
provides:
  - "src/components/explore/viz-data.ts buildProjectCalendar — the pure year-grid geometry builder (injectable now, geometry-never-invented); techMentions machinery deleted"
  - "src/components/explore/sections/projects-calendar.tsx — pure server renderer of the year-grid bars calendar (career-span-chart precedent)"
  - "src/components/explore/sections/skills-section.tsx — competency + proof cards FIRST over the surviving grouped chips + TerminalPointer"
  - "recharts removed from package.json (dependencies 39→38) with the consumerless src/components/ui/chart.tsx wrapper deleted"
  - "tests/projects-calendar.test.mjs — 11-row zero-dep unit suite pinning the calendar geometry contract"
affects:
  - "out/explore.html — rebuilt; zero recharts hydration shells; competency cards + calendar markup server-rendered"
  - "tests/explore-tour.test.mjs — the plan-02 temporary 'untouched until plan 04' skills-copy pin flipped to the cards contract"
  - "package-lock.json — synced (38 deps, no recharts)"
  - "ui-review — audits the skills cards against the U-2 adjudication and the calendar against the OQ-1 full-year-bar override (both recorded in this summary)"
tech-stack: [next-15, react-18, typescript-5, tailwind-3, node-test-runner, static-export]
key-files:
  created:
    - "src/components/explore/sections/projects-calendar.tsx"
    - "tests/projects-calendar.test.mjs"
  modified:
    - "src/components/explore/viz-data.ts"
    - "src/components/explore/sections/projects-section.tsx"
    - "src/components/explore/sections/skills-section.tsx"
    - "src/components/explore/explore-panels.tsx"
    - "src/components/explore/constants.ts"
    - "src/app/globals.css"
    - "package.json"
    - "package-lock.json"
    - "tests/explore-visuals.test.mjs"
    - "tests/explore-visuals-skills.test.mjs"
    - "tests/explore-routing.test.mjs"
    - "tests/explore-sweep.test.mjs"
    - "tests/explore-tour.test.mjs (documented addition — see Deviations)"
  deleted:
    - "src/components/explore/sections/skills-chart.tsx"
    - "src/components/explore/sections/skills-treemap.tsx"
    - "src/components/ui/chart.tsx"
decisions:
  - "Calendar position: ProjectsCalendar composes as the FIRST child of the Projects body, ABOVE the stat tiles (UI-SPEC §5.1/§14.5 checker B-4 pin; OQ-11's middle-child reading mis-parsed D-07's 'above the cards') — mb-5 wrapper, tiles mb-3 wrapper byte-unchanged, cards map byte-unchanged."
  - "Year-only dates render a FULL-YEAR-SPAN bar (recorded override of UI-SPEC §14.5/E-01 per RESEARCH OQ-1, evidence-based, post-dating the spec): '2026' (DeepIndex, Clarif-AI) spans 12 months — the year is the precision the data carries and inventing a month would violate geometry-never-invented in the opposite direction; 'Ongoing' keeps the null-geometry row with its verbatim date."
  - "buildProjectCalendar parses year-only dates with an exact-match rule (^\\s*(19|20)\\d{2}\\s*$): a string that IS a year carries year precision; a string with other words but no month ('Someday 1999') is unparseable → null geometry (E-1)."
  - "Bar fill = the bg-chart-4 token class (tailwind.config maps chart-4 → hsl(var(--chart-4))); the light-shell --chart-4 override lands at 280 65% 40% (hue-preserving, probe-measured 7.85:1 on the white card; dark 60% value measures 4.03:1) beside the chart-2/3 precedent, whose claimed 4.49/4.75 values the same probe reproduced."
  - "U-2 adjudication implemented as recorded: D-06 removes ONLY the BarChart + Treemap; the grouped chips (the only /explore rendering of the full hard-skills lists), their headers, skillsGroupCounts, skillGroupFill and the TerminalPointer survive below the cards; ONLY techMentions/TreemapCell/escapeRegExp/WORD_CHAR_PATTERN/countOccurrences die."
  - "Skills cards are a <ul>/<li> grid (grid-cols-1 gap-2 lg:grid-cols-2 — density keys on lg, never md), each card an outline Badge chip (font-normal pointer-events-none text-chart-3 border-chart-3/40) + the proof verbatim in text-xs leading-relaxed text-muted-foreground; no slice, no hardcoded 8; graceful-hide keeps the cards and chips blocks independent."
  - "Renderer is a dumb server component fed precomputed leftPct/widthPct; year-tick positions derive arithmetically from the handed startYear/endYear (numbers, not string parsing — the single-site rule governs string parsing); aria-label on the wrapper is data-derived, tracks/bars aria-hidden, no role=img (§5.5)."
  - "recharts removal adopted (OQ-2): zero usages remained after task 2 (ui/chart.tsx had no consumers, grep-verified before deletion); the gate (tsc + build + 11 suites) proves it; the dependency-count pins in three suites renewed to 38 + recharts-undefined."
metrics:
  duration: "~2h (executor session, 2026-09-23; tasks 1-3 + summary + final gate)"
  completed: 2026-09-23
status: complete
actuals:
  tokens: ~120000
  tasks: 3
  commits: 3
---

# Phase EXPLORE-06 Plan 04: skills cards + year-grid calendar + recharts removal Summary

Replaced the Skills panel's recharts bar chart + treemap with 8 competency + proof cards over the surviving chips (REV-05/D-06), added the year-grid bars calendar to the Projects panel as a pure-CSS viz-data-fed renderer above the tiles (REV-06/D-07), removed recharts entirely with its consumerless shadcn wrapper (deps 39→38, OQ-2), and landed the phase's final chronological green gate: build + typecheck + build:resume + verify script + the explicit 11-suite node --test run, 200/200.

## What was done (per task)

**Task 1 — buildProjectCalendar + year-grid renderer (commit b408f87)**
- RED on record (/tmp/red-t1.log, exit 1): `SyntaxError: The requested module '../src/components/explore/viz-data.ts' does not provide an export named 'buildProjectCalendar'` — the whole rewritten suite fails at import against the pre-edit tree.
- GREEN: `viz-data.ts` — `ProjectCalendarRow`/`ProjectCalendarData` interfaces + `buildProjectCalendar(projects, now = new Date())` reusing parseMonthYear/YEAR_PATTERN/monthIndex in-module; axis = January of the min data year (2016) through December of the now year (2026) = 11 full-year columns; 'Month YYYY' → one-month-cell bar (width 1/132), pure-year strings → full-year span (start year×12, width 12), anything else → null geometry, row kept, date verbatim; rows in JSON order. `projects-calendar.tsx` — pure server renderer (no 'use client', no hooks, no chart library): year-tick header row (tabular-nums, absolute leftPct, border-b), one row per project with name + verbatim date + h-2 track + bg-chart-4 bar (minWidth: 2), null-geometry rows render with an empty track, zero-geometry → graceful-hide. `projects-section.tsx` — calendar composed FIRST inside the mb-5 wrapper above the tiles; cards JSX block byte-unchanged. `globals.css` — light-shell `--chart-4: 280 65% 40%` override beside the chart-2/3 block.
- Verify: typecheck 0; suite 11/11; no 'use client'/recharts greps clean. One typecheck iteration: `Project.date` is optional in the .d.ts, so the verbatim row date coalesces `?? ''` for the omitted case (none in data today).

**Task 2 — competency cards + chart/treemap/techMentions removal (commit e2a9925)**
- RED on record (/tmp/red-t2-skills.log: 7✖/3✔; /tmp/red-t2-visuals.log: 5✖/24✔): both suites rewritten to the NEW contract before the removal — skills suite pins cards-first, zero hardcoded competency strings (nine docx segments + all 8 data names+proofs grep clean), removal absence, panels closure, constants copy; visuals suite pruned the techMentions import + unit block, dropped the deleted-file reads (clientChartFiles, treemap stripAll, treemap-keywords test), redesigned the client-boundary row to the post-removal contract, and rewrote the export rows (zero recharts-responsive-container, competency cards, calendar markup).
- GREEN: `skills-section.tsx` rebuilt (cards FIRST, chips + pointer byte-identical below, no recharts/mention imports, competencies prop in, experience prop out); `explore-panels.tsx` skills closure → `competencies={data.core_competencies}`; `constants.ts` skills step body → "Competency cards with the quantified proof behind each — full inventory below."; skills-chart.tsx + skills-treemap.tsx deleted; viz-data techMentions machinery deleted (skillsGroupCounts/skillGroupFill survive).
- Verify: typecheck 0; skills suite 10/10; visuals non-export surface 26/26 (the 3 failing rows were export rows against the stale pre-phase out/ — see Deviations #2 on the scoped-verify form); tour suite 43/43 after renewing the plan-02 temporary pin (Deviations #3); sweep/server/shell/routing/header all green.

**Task 3 — recharts removal + phase final gate (commit e9e0714)**
- RED on record (/tmp/red-t3-visuals.log, -routing.log, -sweep.log): the three renewed pins each failed against the 39-dep tree with recharts present (pass 0 / fail 3 on the scoped pattern).
- GREEN: zero consumers verified first (`grep -rn "ui/chart" src/` empty; the only recharts importer was ui/chart.tsx itself); `ui/chart.tsx` deleted; recharts removed from package.json; `npm install` synced package-lock.json (38 deps, recharts undefined).
- Shell-suite rewrite items (a)–(e) verified ALREADY-LANDED: plans 02/03 renewed the constants 4-id loop, the no-ContactSection registration, the 2×2/zero-col-span grid test with chart-1..4 accents, the '0/4 sections visited' export pin and the refreshed intro-strip title — the shell suite runs 30/30 green without edits (RED empty by prior-wave work, see Deviations #5).

## Red/Green timeline

| Run | Result | Evidence |
|---|---|---|
| Baseline (pre-edit) | visuals 37/2✖ — the 2 pre-triaged plan-04 rows (techMentions corpus, Smartup fixture); typecheck 0 | /tmp/baseline-visuals.log |
| Task 1 RED | suite fails to load — missing buildProjectCalendar export | /tmp/red-t1.log |
| Task 1 GREEN | typecheck 0 + projects-calendar 11/11 + affected suites green (except the 2 known rows) | /tmp/t1-*.log |
| Task 2 RED | skills 7✖/3✔; visuals 5✖/24✔ (2 source + 3 stale-export) | /tmp/red-t2-skills.log, /tmp/red-t2-visuals.log |
| Task 2 GREEN | typecheck 0 + skills 10/10 + visuals non-export 26/26 + tour 43/43 | /tmp/t2-*.log |
| Task 3 RED | 3 pin rows fail (39 deps + recharts present) | /tmp/red-t3-*.log |
| **GATE #1** | **build 0 + typecheck 0 + build:resume 0 + verify script 0 + explicit 11-suite run 200/200** | /tmp/gate1-*.log |

## TDD Gate Compliance

Plan type is `execute` (not `tdd`) — no test:-commit-before-feat: gate applies. Red-first discipline was honoured inside all three tasks: every contract change ran its failing test (or failing load) on record before the source edits; RED and GREEN land in the same atomic per-task commit per the one-commit-per-task rule. Commits: b408f87 (task 1), e2a9925 (task 2), e9e0714 (task 3).

## Known Stubs

None. `grep TODO|FIXME|placeholder|.skip|.todo` over every touched source + test file: zero hits.

## Threat Flags

None. No auth, secrets, input handling, or network surface touched; the calendar renders data strings verbatim through React text nodes (auto-escaped); the only style injection is precomputed percentage values from viz-data.

## Deviations (all documented, all minimal)

1. **tests/explore-tour.test.mjs edited (1 row)** — beyond the task-2 `<files>` list: the plan-02 row 'step bodies: … skills/projects copy untouched until plan 04' pinned the OLD treemap sentence as a temporary state whose own message declared plan 04 the owner of the flip. Renewed to the cards contract (name + no-treemap guard); stale-test discipline (CONTEXT D-06).
2. **Task-2 scoped-verify form adapted**: the plan's `--test-name-pattern="^(?!.*export)"` does not filter on Node 24 (control-probed: a plain `parseDuration` pattern filters to 2 tests, the lookahead pattern runs all 29). Equivalent check used instead: the full unscoped run must show every failing row starting with `export` (the stale-out/ rows) and every non-export row green — satisfied: only the 3 export rows failed at task 2, and gate #1's fresh build turns them green.
3. **buildCareerSpan Smartup fixture row fixed in task 2** — plan 03 routed this pre-triaged row (expected `isTechRelated: true` for Smartup PCC) to plan 04: renewed to `false` per plan 01's U-4 3-role data contract; the fixture literal was the stale side.
4. **Raw `grep -rn "recharts" src/` trips on one D-09-protected doc-comment line** (career-span-chart.tsx:4 'NOT a recharts chart' — the file must stay byte-untouched). The usage-scoped form is the faithful check: comment-stripped greps return zero recharts across src/components/explore/ (suite-enforced) and zero importers repo-wide (verified before ui/chart.tsx deletion). Recorded so task 3's acceptance reads the semantic contract.
5. **Shell-suite rewrite items (a)–(e) were already landed by plans 02/03** — the plan-04 action anticipated staleness that waves 1–2 resolved; the shell suite is verified 30/30 green as-is (RED empty by prior-wave work, not a skipped gate).
6. **ProjectCalendarRow.date coalesces `?? ''`** — the plan's pinned `date: string` shape vs the optional `Project.date` in the .d.ts; no project omits its date today, so the verbatim discipline is unaffected.

## Self-Check: PASSED

- Files: projects-calendar.tsx (85 lines, pure server renderer) ✓; viz-data buildProjectCalendar (no techMentions) ✓; skills-section cards-first + chips intact ✓; skills-chart.tsx/skills-treemap.tsx/ui/chart.tsx absent ✓; package.json 38 deps, no recharts ✓; 5 test files renewed + 1 created ✓.
- Commits: 3 on `phase-6` — b408f87, e2a9925, e9e0714 — all scoped EXPLORE-06-explore-revision-04 ✓.
- must_haves truths: (1) 8 competency cards, no bar chart/treemap, chips + pointer remain ✓ (suite-pinned); (2) calendar between… above the tiles per B-4, month bars + full-year bars + Ongoing null, cards byte-unchanged ✓ (git diff insertion-scoped); (3) all parsing in viz-data, injectable now, no client directives/recharts ✓; (4) recharts removed, deps 38, 11-suite gate 200/200 ✓; (5) tour skills copy names the cards, experience-section/career-span-chart byte-untouched (git diff empty) ✓.

## Full-gate state (pre-SUMMARY measurement)

GATE #1 on the committed tree: `npm run build` 0; `npm run typecheck` 0; `npm run build:resume` 0 + `node scripts/verify-resume-content.js` 0 (regenerated public/resume-export.html is byte-identical — git diff empty); explicit 11-file `node --test` enumeration → **200 tests, 200 pass, 0 fail, 0 skipped**. The chronologically-final gate run over the post-SUMMARY tree is recorded in the completion note below.

## Completion note (final gate on record — run after the SUMMARY commit)

GATE #2 = the same full gate re-run as the chronologically last action after the SUMMARY commit, anchoring the completion claim: build 0, typecheck 0, build:resume 0 + verify script 0, explicit 11-suite run **200/200**. Logs: /tmp/gate2-*.log.