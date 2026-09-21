---
phase: 03-explore-visuals
plan: 03
type: execute
wave: 2
depends_on: ["EXPLORE-03-explore-visuals-01"]
files_modified: [src/components/explore/sections/career-span-chart.tsx, src/components/explore/sections/experience-section.tsx, src/components/explore/sections/project-stat-tiles.tsx, src/components/explore/sections/projects-section.tsx, tests/explore-visuals-server.test.mjs]
autonomous: true
requirements: ["EXPLORE-02", "EXPLORE-02b", "EXPLORE-02c"]
user_setup: []
must_haves:
  truths:
    - "Experience panel renders ALL 7 roles as pure-CSS Gantt rows in JSON order (no sorting) on the shared year axis derived from the duration strings, above the byte-unchanged 3-role text timeline — Chubb's Present bar reaches the axis right edge (100%), WashPark's bar starts at 0% (D-02 approved deviation, E-3)"
    - "Gantt bar colors carry the data story: isTechRelated roles bar bg-chart-2 (continuing the text-timeline dots), non-tech roles bar bg-muted-foreground — no legend (UI-SPEC §4)"
    - "An unparseable duration renders the row text verbatim with the track but no bar; an all-unparseable set hides the whole Gantt while the text timeline stays (E-1/E-2); durations display AS STORED — em-dash stays em-dash, hyphen stays hyphen (D-02/§4)"
    - "Projects panel renders the 3 stat tiles (Projects / Active Years / Linked) as the FIRST child above the byte-unchanged 6 cards, every value received from viz-data's projectStats — zero stat literals in the component, the computed linked value (never the stale SPEC literal 9), em-dash placeholder when no date parses (D-03, EXPLORE-07, OQ-1/U-1, E-9)"
  artifacts:
    - path: src/components/explore/sections/career-span-chart.tsx
      provides: "Pure CSS Gantt renderer — server component, no client directive, no hooks, no recharts; dumb renderer of precomputed CareerSpanData percentages with aria-hidden bars/tracks and real-text year ticks"
      min_lines: 60
      exports: ["CareerSpanChart"]
    - path: src/components/explore/sections/project-stat-tiles.tsx
      provides: "3-up stat tile row — server component receiving ProjectStats via props, E-9 em-dash placeholder for a null span"
      min_lines: 30
      exports: ["ProjectStatTiles"]
    - path: src/components/explore/sections/experience-section.tsx
      provides: "Augmented section: CareerSpanChart in an mb-5 wrapper before the unchanged <ol> timeline, fed by buildCareerSpan(experience) — the FULL 7-entry array, not the slice"
      min_lines: 80
    - path: src/components/explore/sections/projects-section.tsx
      provides: "Augmented section: ProjectStatTiles in an mb-3 wrapper as first child, fed by projectStats(projects) — cards byte-identical"
      min_lines: 90
    - path: tests/explore-visuals-server.test.mjs
      provides: "Plan-03 red-first source-invariant carrier: server purity, augment order, verbatim-duration fidelity, no-sort discipline, stat-literal-free tiles"
      min_lines: 120
  key_links:
    - from: src/components/explore/sections/experience-section.tsx
      to: src/components/explore/sections/career-span-chart.tsx
      via: "CareerSpanChart composed before the <ol> with span=buildCareerSpan(experience) (UI-SPEC §1 ②)"
      pattern: "<CareerSpanChart"
    - from: src/components/explore/sections/experience-section.tsx
      to: src/components/explore/viz-data.ts
      via: "geometry from buildCareerSpan — no component parses duration strings (D-05)"
      pattern: "buildCareerSpan"
    - from: src/components/explore/sections/projects-section.tsx
      to: src/components/explore/sections/project-stat-tiles.tsx
      via: "ProjectStatTiles composed before the cards map with stats=projectStats(projects) (UI-SPEC §1 ③)"
      pattern: "<ProjectStatTiles"
    - from: src/components/explore/sections/projects-section.tsx
      to: src/components/explore/viz-data.ts
      via: "tile values from projectStats — no component computes stats (D-05/EXPLORE-07)"
      pattern: "projectStats"
---

<objective>
Deliver the two server-rendered visualization slices end-to-end: the pure-CSS career-span Gantt above the unchanged 3-role text timeline in the Experience panel (D-02 approved roadmap deviation — dumb renderer of plan-01's buildCareerSpan percentages, fully present in the static export without JS), and the three data-derived project stat tiles above the untouched cards in the Projects panel (D-03). Augment-only: no chrome, no grid, no phase-2 text bodies change (D-07); no tooltips, no animation, no hover anywhere (D-04/§6).
</objective>

<assumption_delta_decision>
Noun now primary: the viz-data module as the one data-shaping representation (see plan 01).
Decision: promote — both new components are dumb renderers of precomputed values (CareerSpanData percentages, ProjectStats), so the inline shaping pattern is never added alongside; buildCareerSpan(projectStats) are the only geometry/stats sites (D-05). No accepted debt. Invariant companion: the plan-03 carrier asserts the sections call viz-data with the FULL slices and contain no parsing or stat literals.
</assumption_delta_decision>

> **Wave-2 parallelism note (shared working tree):** this plan runs concurrently with plan 02 (`jobs.concurrency: 2`, `use_worktrees: false`) on the same working tree, and this plan touches ONLY its own files (its own test carrier tests/explore-visuals-server.test.mjs — no overlap with plan 02's files). Global verify commands can transiently observe the sibling's mid-edit files: when a global gate fails mid-wave, root-cause against THIS plan's own diff (frontmatter files_modified) first; a failure not attributable to those paths must be re-run after the sibling plan settles before being treated as a real defect. The authoritative cross-plan gate is plan 04 Task 3, run chronologically last on the settled tree.

<context>
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md — §1 augment order (② experience ③ projects), §4 Gantt contract (axis, row anatomy, colors, E-1…E-6), §5 tiles (pinned anatomy + derivations), §6 interaction matrix, §9 aria
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-CONTEXT.md — D-02, D-03, D-04, D-05, D-07 locked
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-RESEARCH.md — §1.2B parse inventory + JSON-order quirk, OQ-1 (computed linked), OQ-7 (build-time Present)
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-01-PLAN.md — the data contracts this plan consumes (CareerSpanData/YearTick, ProjectStats)
@src/components/explore/sections/experience-section.tsx — the section being augmented above its <ol>
@src/components/explore/sections/projects-section.tsx — the section being augmented above its cards
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — career-span Gantt above the text timeline (red invariants → component → green)</name>
    <files>tests/explore-visuals-server.test.mjs, src/components/explore/sections/career-span-chart.tsx, src/components/explore/sections/experience-section.tsx</files>
    <read_first>UI-SPEC §4 (full Gantt contract) and §9 (gantt aria), CONTEXT.md D-02, src/components/explore/viz-data.ts (CareerSpanData/YearTick/CareerSpanRow from plan 01), src/components/explore/sections/experience-section.tsx (current structure — the <ol> must stay byte-identical)</read_first>
    <action>
      RED first: create tests/explore-visuals-server.test.mjs (node:test + node:assert/strict + root-relative read(), mirroring the suite conventions; doc-comment states it is plan-03's carrier, runner node --test tests/explore-visuals-server.test.mjs) with the server-slice invariants: experience-section.tsx composes <CareerSpanChart BEFORE the <ol; experience-section.tsx calls buildCareerSpan(experience) on the FULL array (contains 'buildCareerSpan(experience)' and NOT 'buildCareerSpan(roles)'); career-span-chart.tsx exists carrying NO 'use client', NO recharts import, NO hooks; the Gantt renders the duration verbatim (grep for a duration-normalization call such as .replace( on row.duration returns nothing); no .sort( in either file. RUN `node --test tests/explore-visuals-server.test.mjs` and observe the failures — the on-record RED. Then implement, and rerun to green.

      Create src/components/explore/sections/career-span-chart.tsx per D-02 and UI-SPEC §4 — a pure CSS Gantt: NO client directive, NO hooks, NO recharts (approved roadmap deviation). props { span: CareerSpanData } — a dumb renderer of precomputed percentages (D-05); if every row has leftPct null, return null (E-2: the Gantt hides, nothing renders — the wrapper guard in the section keeps no stray margin). Axis header: a relative container with border-b border-border and mb-2; for each tick in span.yearTicks render an absolutely positioned span at left `${tick.leftPct}%` with -translate-x-1/2, className text-[10px] text-muted-foreground tabular-nums, printing tick.year as REAL text (the tick label comes from axisStart.year — no literal '2017' anywhere in this file, §10; ticks are real text and stay readable per §9). Rows: space-y-3; per row — header line flex justify-between gap-2 with the role title (text-xs font-medium text-foreground, wraps fully, never clipped) left and the duration (text-[10px] text-muted-foreground tabular-nums shrink-0) right rendered VERBATIM AS STORED — the em-dash of 'Sept 2023 — Present' and the hyphen of 'November 2017 - April 2018' are display data, never normalized (the parser touches geometry only); company line text-[10px] text-muted-foreground (wraps — 'Mini Market at University Campus of AUTH' must wrap, not truncate); track line relative h-2 w-full rounded-full bg-muted aria-hidden="true" containing the bar ONLY when row.leftPct !== null: an absolute inset-y-0 rounded-full element with style left `${row.leftPct}%`, width `${row.widthPct}%`, minWidth 2px (E-5 degenerate spans stay visible; clamping happened in viz-data, E-4), className bg-chart-2 when row.isTechRelated else bg-muted-foreground (§4 color pin; the §2 light override darkens chart-2 bars in light mode — accepted, no action); unparseable rows (leftPct null) render their text + full-span track with NO bar (E-1 — geometry unknown, never invented). Bars and tracks carry aria-hidden="true"; the year ticks and all row text are real text (§9: a natural 7-item role+duration list for AT, no ARIA duplication). No legend, no vertical gridlines, no hover/focus/cursor anywhere (§6).
    </action>
    <verify>node --test tests/explore-visuals-server.test.mjs && npm run typecheck</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals-server.test.mjs` exits 0 (was failing before the implementation — RED observed)
      - `npm run typecheck` exits 0
      - career-span-chart.tsx greps: no '"use client"', no "from 'recharts'", "aria-hidden" present, "bg-chart-2" and "bg-muted-foreground" present, "minWidth" present
      - experience-section.tsx greps: "<CareerSpanChart" present and appears BEFORE the "<ol"; "buildCareerSpan(experience)" present; "mb-5" present on the chart wrapper
      - neither file contains ".sort(" nor a duration-normalizing ".replace(" on the stored duration
    </acceptance_criteria>
    <done>All 7 roles render as percentage-positioned CSS bars above the untouched text timeline, colored by isTechRelated, with verbatim durations — fully present in the static export without JS.</done>
  </task>

  <task type="auto">
    <name>Task 2: Project stat tiles above the cards (red invariants → component → green)</name>
    <files>tests/explore-visuals-server.test.mjs, src/components/explore/sections/project-stat-tiles.tsx, src/components/explore/sections/projects-section.tsx</files>
    <read_first>UI-SPEC §5 (tile anatomy + derivation table) and §6 (static interaction), CONTEXT.md D-03, src/components/explore/viz-data.ts (ProjectStats from plan 01), src/components/explore/sections/projects-section.tsx (current structure — cards must stay byte-identical)</read_first>
    <action>
      RED first: append the tiles invariants to tests/explore-visuals-server.test.mjs — projects-section.tsx composes <ProjectStatTiles BEFORE the cards map with an mb-3 wrapper; projects-section.tsx calls projectStats(projects); project-stat-tiles.tsx exists carrying NO 'use client' and NO recharts import, contains 'grid grid-cols-3 gap-2', and contains no standalone stat literals 14, 9, 2016, 2026 in its code (strip doc comments before grepping). RUN to observe the failures — the on-record RED. Then implement and rerun to green.

      Create src/components/explore/sections/project-stat-tiles.tsx per D-03 and UI-SPEC §5 — a server component, pure CSS, values received as props (D-05): props { stats: ProjectStats }; root div grid grid-cols-3 gap-2 (never collapsing to stacked — 3-up holds at 311px); each tile rounded-md border border-border p-2.5 with the value (text-sm font-medium text-foreground tabular-nums leading-none, single line) above the label (mt-1 text-[10px] uppercase tracking-wider text-muted-foreground, single line, may wrap at 375px); tiles left→right per the §5 table: value stats.total with label 'Projects'; value stats.activeYearsSpan ?? '—' (the E-9 em-dash placeholder keeps the 3-col grid when no date parses) with label 'Active Years'; value stats.linked with label 'Linked' (label wording pinned to the §5 table; the derivation is fixed: computed from the JSON by viz-data, OQ-1/U-1 — the stale SPEC literal 9 must not appear anywhere); plain text values+labels read as pairs in DOM order; zero stat literals in the file (EXPLORE-07); no hover/focus/cursor anywhere (§6).

      Augment src/components/explore/sections/projects-section.tsx per D-07/UI-SPEC §1 ③: add `const stats = projectStats(projects);` (import projectStats from '../viz-data'); render <div className="mb-3"><ProjectStatTiles stats={stats} /></div> as the FIRST child of the space-y-2 root, before the cards map (the mb-3 gives the intentional 12px tiles→cards gap versus the 8px card-card rhythm, §1); the cards map, TerminalPointer, graceful-hide (cards.slice(0, 6), empty → null) stay byte-identical.
    </action>
    <verify>node --test tests/explore-visuals-server.test.mjs && npm run typecheck</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals-server.test.mjs` exits 0 (tiles invariants green after being RED)
      - `npm run typecheck` exits 0
      - project-stat-tiles.tsx greps: no '"use client"', no "from 'recharts'", "grid grid-cols-3 gap-2" present, "stats.activeYearsSpan" present, and — doc comments stripped — no standalone literal 14/9/2016/2026
      - projects-section.tsx greps: "<ProjectStatTiles" present and appears BEFORE the cards map call; "projectStats(projects)" present; "mb-3" present on the tiles wrapper
    </acceptance_criteria>
    <done>The Projects panel opens with three JSON-derived summary tiles above the untouched cards; both server slices are complete and their red invariants are green.</done>
  </task>
</tasks>