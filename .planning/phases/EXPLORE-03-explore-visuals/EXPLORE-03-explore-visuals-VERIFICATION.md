---
phase: 03-explore-visuals
verified: 2026-09-21T15:28:54Z
status: passed
score: 46/46 must-haves verified
behavior_unverified: 0
overrides_applied: 0
---

# Phase 3: explore-visuals Verification Report

**Verifier mode:** full verification with the prior human-verification record on file (no `gaps:` block — functionality was already human-verified live; this pass re-proves the mechanism independently and carries the visual verdict forward).

**Goal:** Add the visualizations — a skills chart, an experience timeline, and project stats — built with recharts from the existing portfolio data (EXPLORE-02).

## Goal Achievement → Observable Truths

| # | Truth (SPEC acceptance / plan must-have) | Status | Evidence |
|---|---|---|---|
| 1 | Gates pass on the final tree: `npm run build`, `npm run typecheck`, all four `node --test` suites; /explore still exports statically | ✓ VERIFIED | Independent re-run this session: build exit 0 (all of `out/explore.html`, `out/index.html`, `out/resume.html` emitted), typecheck exit 0, suites 38/38 + 10/10 + 15/15 + 30/30 (93 tests, 0 fail) |
| 2 | Skills panel: horizontal bar chart of counts per category renders above the existing chips; values match the JSON exactly (6/9/6/6/7/2 in JSON group order) | ✓ VERIFIED | `skills-section.tsx:54` composes `<SkillsChart rows={groups} />` as first child before the groups loop; export `aria-label` reads `Skills by category. Soft Skills 6, Languages 9, Testing 6, Infrastructure 6, Innovation 7, Languages 2.` — byte-matches my independent recompute from the raw JSON |
| 3 | Skills panel: recharts Treemap below the bar chart — cells = technologies matched whole-word case-insensitively by their own JSON names against responsibilities text; area ∝ mentions; zero-invented keywords | ✓ VERIFIED | `skills-treemap.tsx` flat `Treemap data={cells}`; cells from `techMentions(experience, skills)`; export aria: `Java 1, CI/CD 2, MCP 1, RAG 1` — exactly reproduced by an independent whole-word matcher I ran against the raw JSON (zero invented keywords: the keyword set IS the JSON's technology names) |
| 4 | Treemap static name+count labels, no tooltips; minimum-mention threshold; legibility ladder | ✓ VERIFIED | Source: custom `TreemapCellContent` with depth-0 root guard, label ladder (≥64×40 name+count → ≥44×16 name-only → bare area), per-cell clipPath; `Tooltip` absent from all chart components (comment-stripped grep clean); threshold `count < 1` dropped (`viz-data.ts:253`) |
| 5 | Experience panel: career-span chart renders ALL 7 roles as duration bars on a shared time axis from the JSON duration strings; the phase-2 3-role text details remain below | ✓ VERIFIED | Export contains all 7 companies + percentage-positioned bars (`width:31.58%…` for Chubb, `0.877%` 1-month bars, `100%` Present edge); `buildCareerSpan` probed live: WashPark `leftPct=0`, Chubb Present row reaches 100%, 10 year ticks starting `{2017, 0}`, rows in JSON order (Smartup above Sweet Corner — no sorting, R-4 honored) |
| 6 | Projects panel: stat tiles render above the cards — total, active-years span, linked — every number derived from the JSON | ✓ VERIFIED | Export tile pairs: `14/Projects`, `2016–2026/Active Years`, `14/Linked` — all reproduced by my independent JSON recompute (total 14, span 2016–2026, linked = `projects.filter(p => p.link).length` = 14). Stale SPEC literal 9 asserted nowhere (grep clean in module, components, tests) |
| 7 | Chart-1..5 tokens used (with the pinned scoped light-theme `--chart-2`/`--chart-3` overrides); legible in both themes | ✓ VERIFIED (code + contrast math) | `globals.css:572-573` — `--chart-2: 160 65% 32%;` / `--chart-3: 30 75% 38%;` inside `.light .explore-shell`; dark `:root` values untouched (38-39 unchanged); no `--chart-1` override in either shell block. Fills flow from the shared `skillGroupFill` map to both charts |
| 8 | Reduced motion: recharts animations disabled unconditionally (`isAnimationActive={false}`) on every chart component incl. Treemap | ✓ VERIFIED | Source greps: prop present in `skills-chart.tsx:61` and `skills-treemap.tsx:162`; `isAnimationActive={true}` appears nowhere under `src/components/explore/` (Layer-2 recursive assertion green) |
| 9 | Static export contains the chart components (client-hydration shells in `out/explore.html`); zero new dependencies beyond recharts | ✓ VERIFIED | Direct export grep: 2 × `recharts-responsive-container` (bar + treemap shells); `package.json` dependencies = exactly 39 keys with `recharts: ^2.15.1` (D-07) |
| 10 | 375px: no horizontal scroll — charts scale with their panel | ✓ VERIFIED (structural) + human live view | ResponsiveContainer width 100% with fixed heights (192/120), percentage-positioned Gantt, 3-up tile grid of tiny values — all scale by construction; user's live on-record check covered the rendered page |

## Score

**46/46 plan must-haves verified** (plan-01: 9/9 · plan-02: 15/15 · plan-03: 13/13 · plan-04: 9/9) — every roadmap truth, artifact, and key link verified; 93 tests green across the four suites plus build + typecheck, re-run independently by this verification.

## Deferred Items (filtered against later milestone phases)

- **Gamification + exploration progress** → phase 4 (exists in roadmap) — carried forward.
- **CLI↔explore routing** → phase 5 (exists in roadmap) — carried forward.
- **Visual design revision of the visualizations** → a NEW phase to be added before ship, per the user's on-record decision (see Human Verification below) — carried forward; supersedes no phase-3 mechanism.
- **Hover tooltips** — rejected (not deferred to any phase; revisit only if the user asks).
- **Charts in About/Contact panels** — not scheduled in any later phase; dropped.
- **Heatmap idea** — superseded by the treemap (delivered this phase); closed.

## Required Artifacts

| Artifact | Exists | Substantive | Evidence |
|---|---|---|---|
| `src/components/explore/viz-data.ts` | ✓ | ✓ 358 lines ≥ 170; all 13 pinned exports (parseDuration, skillsGroupCounts, projectStats, techMentions, buildCareerSpan, skillGroupFill + 7 interfaces); zero runtime imports (single type-only line 19) | read + live probe |
| `tests/explore-visuals.test.mjs` | ✓ | ✓ ≥ 320 lines claimed, 38 tests green (Layer-1 units + Layer-2 invariants + Layer-3 export) | suite run 38/38 |
| `tests/explore-visuals-skills.test.mjs` | ✓ | ✓ 10 tests green (client boundary, anatomy, augment order, css pins) | suite run 10/10 |
| `tests/explore-visuals-server.test.mjs` | ✓ | ✓ 15 tests green (server purity, augment order, verbatim durations, no-sort, stat-literal-free) | suite run 15/15 |
| `src/components/explore/sections/skills-chart.tsx` | ✓ | ✓ 78 ≥ 50 lines; exports `SkillsChart`; 'use client'; zero data shaping | read |
| `src/components/explore/sections/skills-treemap.tsx` | ✓ | ✓ 169 ≥ 70 lines; exports `SkillsTreemap`; root guard, ladder, clipPath | read |
| `src/components/explore/sections/skills-section.tsx` | ✓ | ✓ 73 ≥ 60 lines; chart first / treemap second / chips unchanged; grouping single-sourced to `skillsGroupCounts` | read |
| `src/components/explore/sections/career-span-chart.tsx` | ✓ | ✓ 79 ≥ 60 lines; exports `CareerSpanChart`; no client directive, no hooks, no recharts | read |
| `src/components/explore/sections/project-stat-tiles.tsx` | ✓ | ✓ 34 ≥ 30 lines; exports `ProjectStatTiles`; zero stat literals | read |
| `src/components/explore/sections/experience-section.tsx` | ✓ | ✓ 91 ≥ 80 lines; Gantt before `<ol>` fed by FULL array | read |
| `src/components/explore/sections/projects-section.tsx` | ✓ | ✓ 97 ≥ 90 lines; tiles before cards map | read |
| `src/app/globals.css` | ✓ | ✓ 594 ≥ 580 lines; both pinned overrides inside `.light .explore-shell` exactly once | read + grep |

No artifact is MISSING or a STUB.

## Key Link Verification

| From → To | Via | Status | Evidence |
|---|---|---|---|
| tests/explore-visuals.test.mjs → portfolio-main-data.json | fs read, expectations derived at test time | **WIRED** | Layer-1 suites pass against the real JSON; expectations track my independent recompute exactly |
| viz-data.ts → portfolio-main-data.d.ts | type-only aliased import | **WIRED** | `viz-data.ts:19` is the only import line; module imports clean under `node --test` (proven by the passing suite) |
| skills-section.tsx → skills-chart.tsx | `<SkillsChart` first child | **WIRED** | `skills-section.tsx:54`, before the groups loop (56) |
| skills-section.tsx → skills-treemap.tsx | `<SkillsTreemap` second child | **WIRED** | `skills-section.tsx:55`, between chart and loop |
| skills-section.tsx → viz-data.ts | skillsGroupCounts + techMentions | **WIRED** | `skills-section.tsx:35,47,51` — no parallel shaping in the section |
| explore-panels.tsx → skills-section.tsx | experience corpus thread | **WIRED** | `explore-panels.tsx:62` skills closure threads `experience={data.experience}` |
| globals.css → `.light .explore-shell` | two scoped overrides | **WIRED** | lines 572-573 with pinned values inside the block |
| experience-section.tsx → career-span-chart.tsx | `<CareerSpanChart` before `<ol>` | **WIRED** | `experience-section.tsx:47-51` before `<ol>` (52); mb-5 wrapper |
| experience-section.tsx → viz-data.ts | `buildCareerSpan(experience)` FULL array | **WIRED** | `experience-section.tsx:30,43` (uses `experience`, not the `roles` slice) |
| projects-section.tsx → project-stat-tiles.tsx | `<ProjectStatTiles` before cards map | **WIRED** | `projects-section.tsx:42-44` before `cards.map` (45); mb-3 wrapper |
| projects-section.tsx → viz-data.ts | `projectStats(projects)` | **WIRED** | `projects-section.tsx:26,39` |
| tests/explore-visuals.test.mjs → out/explore.html | Layer-3 export assertions | **WIRED** | export assertions pass; I independently confirmed every asserted string in the HTML |
| tests/explore-visuals.test.mjs → package.json | 39 deps, recharts ^2.15.1 | **WIRED** | assertion green + my independent count |

## Data-Flow Trace

`portfolio-main-data.json` → **viz-data.ts** (the sole parsing/shaping site: parseDuration → buildCareerSpan geometry; skillsGroupCounts → bar rows + shared §2 fill map; techMentions → treemap cells; projectStats → tile values) → **server sections** (skills/experience/projects — zero shaping, props only) → **client chart components** ('use client', zero shaping) → **static export**.

End-to-end proof: the strings in `out/explore.html` (bar aria pairs `Soft Skills 6 … Languages 2`, treemap aria `Java 1, CI/CD 2, MCP 1, RAG 1`, Gantt companies + year ticks + percentage bars incl. the 100% Present bar, tile pairs `14/2016–2026/14`) all byte-match values I recomputed directly from the raw JSON with an independent implementation. No hardcoded portfolio content anywhere in the chain (EXPLORE-07).

## Behavioral Spot-Checks

- `node --test tests/explore-visuals.test.mjs` → **38 pass / 0 fail** (Layer-1 real-JSON contract tests incl. all 7 duration parses, exact group counts, exact 4-cell treemap reality, 7-row Gantt geometry at injected now; Layer-2 nine cross-cutting invariants; Layer-3 six export assertions) — run twice by this verifier (before and after the build re-run; green both).
- `node --test tests/explore-visuals-skills.test.mjs` → **10 pass / 0 fail**.
- `node --test tests/explore-visuals-server.test.mjs` → **15 pass / 0 fail**.
- `node --test tests/explore-shell.test.mjs` → **30 pass / 0 fail** (phase-1 regression intact — augment-only held).
- Direct module probe (live, not via tests): parseDuration on Chubb/Smartup/WashPark strings returns exact month pairs incl. em-dash + `Sept` + `Present`; buildCareerSpan(injected now) → WashPark leftPct 0, Chubb reaches 100%, JSON row order preserved; projectStats → `{total:14, activeYearsSpan:'2016–2026', linked:14}`.
- `npm run build` → exit 0 on the current tree (this verifier's own run); `npm run typecheck` → exit 0.

## Requirements Coverage

| REQ | Status | Evidence |
|---|---|---|
| EXPLORE-02 (skills chart, timeline, project stats from recharts + existing data) | ✓ delivered | All four visualizations live in the export with JSON-derived values; recharts carries the bar chart + treemap; the Gantt is the user-approved pure-CSS deviation (D-02 on record) |
| EXPLORE-02b (career-span timeline, 7 roles, text details below) | ✓ delivered | See truths #5 |
| EXPLORE-02c (stat tiles above cards) | ✓ delivered | See truth #6 |
| EXPLORE-02d (mention treemap below the bar chart) | ✓ delivered | See truths #3/#4 |
| EXPLORE-07 (all content data-driven) | ✓ held | Every rendered number traced to the JSON through viz-data; no stat literals in components (comment-stripped greps clean) |
| EXPLORE-05 (CLI + resume intact) | ✓ not broken by this phase | `out/index.html` + `out/resume.html` still emitted; phase-1 suite 30/30; full routing/toggle remains phase 5's scope |
| EXPLORE-01/03/06 (earlier phases) | ✓ not regressed | Augment-only discipline held: panel chrome/grid/text bodies byte-stable (pinned by the three suites) |

## Anti-Patterns Found

- **Unreferenced TBD/FIXME/XXX/HACK markers:** none in `src/components/explore/` (grep clean).
- **`isAnimationActive={true}`:** zero occurrences under `src/components/explore/`.
- **Tooltip / matchMedia / interaction handlers in chart components:** none in code — the single `Tooltip` grep hit is the doc-comment prohibition statement in `skills-chart.tsx:12` ("NO Tooltip"); comment-stripped suite greps confirm the code is clean.
- **Sorting of data-derived arrays:** no `.sort(` in viz-data.ts or any section (JSON order is render order — R-4/E-6 honored, confirmed in export row order).
- **Hardcoded stats:** none — values arrive via props/module; the treemap's `COUNT_FONT = 9` is a documented chrome font-size constant, not a stat (exemption on record in plan-04's decisions).
- **New dependencies:** none — dependencies still exactly 39 keys with `recharts ^2.15.1`.
- **Documented deviation (not a defect):** E-17 duplicate-name handling ships as "counted once, first-group color" instead of the plan's "aggregate counts" — a red-caught correction with rationale on record in SUMMARY-01 and pinned by its own test. Zero-invented-keyword and count-honesty properties are unaffected (independently reproduced).

## Human Verification Required

**Human verification already occurred and is on record** (prior VERIFICATION.md, 2026-09-21): the user verified the live changes — **functionality verified, visual satisfaction NEGATIVE**. The user's decision: continue with the remaining phases; a **NEW PHASE will be added before ship** carrying the concrete change requests for the visualizations. That revision phase is a design-correction pass on top; it supersedes no phase-3 mechanism.

Disposition of the four checks automation cannot prove on static HTML (they render client-side or require eyes):

- §12.2 rendered bar row order (top→bottom JSON group order) — mechanism pinned by source test; R-7 probe record proves the default renders row 1 at TOP; subsumed by the user's live view.
- §12.3 treemap area ∝ mentions (client-side squarify) — data contract proven; rendering covered by the user's live view.
- §12.8 375px no horizontal scroll by eye — structurally guaranteed (ResponsiveContainer, % Gantt, 3-up tiny tiles); covered by the user's live view.
- §12.9 both-theme legibility aesthetics — contrast math verified (light overrides 4.49:1 / 4.75:1, recomputed in RESEARCH §1.4); the aesthetic judgment is exactly what the user's negative visual verdict addressed and routes to the revision phase.

No outstanding human-verification item blocks this phase's contract: the human pass happened, its outcome is recorded, and its remedy (design revision) is scoped to a separate upcoming phase per the user's explicit instruction.

## Gaps Summary

None. All 46 must-haves verified; no FAILED truth, no MISSING/STUB artifact, no NOT_WIRED key link, no blocker anti-pattern. The visual dissatisfaction on record is a user design preference routed to a dedicated revision phase before ship — it is not a gap against phase 3's contract (add the visualizations per the locked spec), and the user's on-record decision explicitly continues the milestone.

**Status: passed — 46/46 — report at `.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-VERIFICATION.md`** (not committed; orchestrator bundles it).