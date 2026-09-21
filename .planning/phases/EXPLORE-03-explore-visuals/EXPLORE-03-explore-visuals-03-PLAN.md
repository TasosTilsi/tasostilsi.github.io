---
phase: 03-explore-visuals
plan: 03
type: execute
wave: 2
depends_on: ["EXPLORE-03-explore-visuals-01"]
files_modified: [src/components/explore/sections/career-span-chart.tsx, src/components/explore/sections/experience-section.tsx, src/components/explore/sections/project-stat-tiles.tsx, src/components/explore/sections/projects-section.tsx]
autonomous: true
requirements: ["EXPLORE-02"]
user_setup: []
must_haves:
  truths:
    - "Experience panel renders ALL 7 roles as pure-CSS Gantt rows in JSON order (no sorting) on a shared year axis, above the byte-unchanged 3-role text timeline (D-02 approved deviation, D-07)"
    - "Chubb's Present bar reaches the axis right edge (100%) and WashPark's bar starts at 0%; isTechRelated roles bar bg-chart-2 continuing the timeline dots, non-tech roles bar bg-muted-foreground — no legend (UI-SPEC §3)"
    - "An unparseable duration renders the row text verbatim with the bar omitted; an all-unparseable set hides the whole Gantt while the text timeline stays (E-1/E-2); durations display as stored — em-dash stays em-dash, hyphen stays hyphen"
    - "Projects panel renders 3 stat tiles (Projects / Active Years / Linked) as the first child above the byte-unchanged 6 cards, every value received from viz-data's projectStats — zero stat literals in the component (D-03, EXPLORE-07, OQ-1: computed value, never the stale 9)"
  artifacts:
    - path: src/components/explore/sections/career-span-chart.tsx
      provides: "Pure CSS Gantt renderer — server component, no client directive, no hooks, no recharts; dumb renderer of precomputed CareerSpanData percentages"
      min_lines: 50
      exports: ["CareerSpanChart"]
    - path: src/components/explore/sections/project-stat-tiles.tsx
      provides: "3-up stat tile row — server component receiving ProjectStats via props, E-9 em-dash placeholder for a null span"
      min_lines: 25
      exports: ["ProjectStatTiles"]
    - path: src/components/explore/sections/experience-section.tsx
      provides: "Augmented section: CareerSpanChart in an mb-5 wrapper before the unchanged <ol> timeline, fed by buildCareerSpan(experience) — full 7-entry array, not the slice"
      min_lines: 80
    - path: src/components/explore/sections/projects-section.tsx
      provides: "Augmented section: ProjectStatTiles in an mb-3 wrapper as first child, fed by projectStats(projects) — cards byte-identical"
      min_lines: 90
  key_links:
    - from: src/components/explore/sections/experience-section.tsx
      to: src/components/explore/sections/career-span-chart.tsx
      via: "CareerSpanChart composed before the <ol> with span=buildCareerSpan(experience) (UI-SPEC §1)"
      pattern: "<CareerSpanChart"
    - from: src/components/explore/sections/experience-section.tsx
      to: src/components/explore/viz-data.ts
      via: "geometry from buildCareerSpan — no component parses duration strings (D-05)"
      pattern: "buildCareerSpan"
    - from: src/components/explore/sections/projects-section.tsx
      to: src/components/explore/sections/project-stat-tiles.tsx
      via: "ProjectStatTiles composed before the cards map with stats=projectStats(projects) (UI-SPEC §1)"
      pattern: "<ProjectStatTiles"
    - from: src/components/explore/sections/projects-section.tsx
      to: src/components/explore/viz-data.ts
      via: "tile values from projectStats — no component computes stats from raw entries (D-05/EXPLORE-07)"
      pattern: "projectStats"
---

<objective>
Deliver the two server-rendered visualization slices per D-02 and D-03: a pure-CSS career-span Gantt (all 7 roles, JSON order, shared year axis) mounted above the unchanged 3-role text timeline, and a 3-up project stat tile row mounted above the unchanged cards — both dumb renderers fed by plan-01's viz-data, fully present in the static export with zero client JS and zero new dependencies (D-07).
</objective>

> **Wave-2 parallelism note (shared working tree):** this plan runs concurrently with the other wave-2 plan (`jobs.concurrency: 2`, `use_worktrees: false`) on the same working tree, while its per-task verify commands run *global* gates (`npm run typecheck` and both `node --test` suites) that can transiently observe the sibling's mid-edit files. When a global gate fails mid-wave: root-cause against THIS plan's own diff first (the paths in frontmatter `files_modified`); a failure not attributable to those paths must be re-run after the sibling plan settles before being treated as a real defect. The authoritative cross-plan gate is wave-3 plan 04 Task 3, which runs the full four-command gate chronologically last on the settled tree.

<context>
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md — §1 insertion points, §3 full Gantt anatomy (pinned classes), §4 tile anatomy, §5 interaction matrix, §10 edge table E-1…E-10
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-CONTEXT.md — D-02, D-03, D-05, D-07 locked
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-RESEARCH.md — §1.2B (JSON-order quirk R-4, parse inventory), §1.4 (chart-2 continues the timeline dot color), §1.5 (375px geometry)
@src/components/explore/sections/experience-section.tsx — the section being augmented; entry.duration rendered AS STORED (lines 53-55) must stay byte-identical
@src/components/explore/sections/projects-section.tsx — the section being augmented; cards map must stay byte-identical
@src/components/explore/viz-data.ts — CareerSpanData/YearTick/ProjectStats types (plan 01)
@src/data/portfolio-main-data.json — read-only source (durations lines 35-105, projects lines 172-187)
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — CareerSpanChart pure-CSS Gantt + mount above the text timeline</name>
    <files>src/components/explore/sections/career-span-chart.tsx, src/components/explore/sections/experience-section.tsx</files>
    <read_first>UI-SPEC §1, §3, §5, §6, §8, §10; src/components/explore/viz-data.ts (CareerSpanData shape); src/components/explore/sections/experience-section.tsx</read_first>
    <action>
      Red/green ordering: before writing any code, run `grep -c "<CareerSpanChart" src/components/explore/sections/experience-section.tsx` and observe 0, with career-span-chart.tsx absent — the on-record RED for the missing Gantt behavior. Implement below, then the same grep and the verify command go green.

      Create src/components/explore/sections/career-span-chart.tsx per D-02/UI-SPEC §3 — a server component: NO "use client" directive, no hooks, no recharts import (the approved roadmap deviation). Props: { span: CareerSpanData } with the type imported type-only from '../viz-data'. The component is a dumb renderer of precomputed percentages. Render null when span.rows.every(row => row.leftPct === null) (E-2 graceful-hide). Structure: an axis header div className "relative mb-2 h-4 border-b border-border" containing one absolutely-positioned tick span per span.yearTicks entry — style left `${tick.leftPct}%` with transform translateX(-50%), className "absolute top-0 text-[10px] text-muted-foreground tabular-nums", text = String(tick.year) (no literal year anywhere — the tick label comes from the data, UI-SPEC §9); tick labels are meaningful text, not aria-hidden. Rows in a div className "space-y-3", one per span.rows entry in the given (JSON) order — no sorting (R-4/E-6). Per row: a header line div "flex justify-between gap-2" with the title span "text-xs font-medium text-foreground" (wraps fully, never clipped) and the duration span "text-[10px] text-muted-foreground tabular-nums shrink-0" rendering row.duration VERBATIM as stored; a company line p "text-[10px] text-muted-foreground" (wraps — the longest is 'Mini Market at University Campus of AUTH'); a track div "relative h-2 w-full rounded-full bg-muted" with aria-hidden="true" containing the bar ONLY when row.leftPct !== null and row.widthPct !== null (E-1: bar omitted, row text stays) — a span "absolute inset-y-0 rounded-full" with style left `${row.leftPct}%`, width `${row.widthPct}%`, minWidth '2px' (E-5) and className bg-chart-2 when row.isTechRelated else bg-muted-foreground (UI-SPEC §3 color mapping — chart-2 continues the text-timeline dot color at experience-section.tsx:47). NO legend, no vertical gridlines, no animation, no hover/pointer/focus styles (§5).

      Mount in experience-section.tsx per D-02/D-07/UI-SPEC §1: import { CareerSpanChart } from './career-span-chart' (section-local component — viz-data exports only pure functions and types, never components) and import { buildCareerSpan } from '../viz-data' (value import — it runs server-side at SSG), then insert as the FIRST child of the plain root div, ABOVE the <ol>: a wrapper div className "mb-5" containing <CareerSpanChart span={buildCareerSpan(experience)} /> — the FULL experience array, never the roles slice. Everything else stays byte-identical: roles = experience.slice(0, 3), the return-null graceful-hide, the <ol> rail/dots/titles/durations-as-stored/locations/bullets, TerminalPointer. Update the header doc-comment with one line noting the Gantt augmentation and that the chart hides with the section (E-10). Doc-comments on both files must not contain the literal tokens recharts, parseDuration, or use client — write around them (e.g. 'pure-CSS renderer fed by precomputed percentages') — so the whole-file invariant greps in this plan's acceptance and plan 04's Layer-2 suites cannot be tripped by documentation.
    </action>
    <verify>npm run typecheck && node --test tests/explore-visuals.test.mjs && node --test tests/explore-shell.test.mjs && grep -c "<CareerSpanChart" src/components/explore/sections/experience-section.tsx</verify>
    <acceptance_criteria>
      - grep -c "<CareerSpanChart" on experience-section.tsx returns ≥ 1 with its index BEFORE the indexOf of '<ol'
      - career-span-chart.tsx contains NO use-client directive (grep -c "use client" returns 0), no recharts import (grep -cE "from ['\"]recharts" returns 0), contains "bg-chart-2" and "bg-muted-foreground", and contains no date-parsing logic (grep -cE "parseDuration\(|new Date\(|match\(/" returns 0 — D-05)
      - experience-section.tsx still contains "slice(0, 3)" and "entry.duration" and calls "buildCareerSpan(experience)" (full array, not the slice)
      - npm run typecheck exits 0; both test suites exit 0
    </acceptance_criteria>
    <done>The Gantt slice is end-to-end in source: all 7 roles renderable as percentage-positioned CSS bars above a byte-identical text timeline, edges E-1/E-2/E-5 covered by construction.</done>
  </task>

  <task type="auto">
    <name>Task 2: ProjectStatTiles + mount above the cards</name>
    <files>src/components/explore/sections/project-stat-tiles.tsx, src/components/explore/sections/projects-section.tsx</files>
    <read_first>UI-SPEC §1, §4, §5, §10 (E-8/E-9); src/components/explore/viz-data.ts (ProjectStats shape); src/components/explore/sections/projects-section.tsx; RESEARCH.md OQ-1</read_first>
    <action>
      Red/green ordering: before writing any code, run `grep -c "<ProjectStatTiles" src/components/explore/sections/projects-section.tsx` and observe 0, with project-stat-tiles.tsx absent — the on-record RED for the missing tile behavior. Implement below, then the same grep and the verify command go green.

      Create src/components/explore/sections/project-stat-tiles.tsx per D-03/UI-SPEC §4 — a server component: no client directive, no hooks, no recharts. Props: { stats: ProjectStats } with the type imported type-only from '../viz-data'. Root div className "grid grid-cols-3 gap-2" — never collapsing to stacked (values are tiny; 3-up holds at 311px). Three tiles left→right, each a div "rounded-md border border-border p-2.5" (no extra background — transparent over the panel card) containing: a value element "text-sm font-medium text-foreground tabular-nums leading-none" (single line) and a label element "mt-1 text-[10px] uppercase tracking-wider text-muted-foreground". Tile 1: value String(stats.total), label 'Projects'. Tile 2: value stats.activeYearsSpan ?? '—' (the E-9 em-dash placeholder keeps the grid intact), label 'Active Years'. Tile 3: value String(stats.linked), label 'Linked' — label wording may adjust, the DERIVATION may not (§4/U-1: linked is the JSON-computed count received via props; the stale SPEC literal '(9)' is forbidden in this file). Zero numeric literals driving rendered values; static content, no interaction states (§5).

      Mount in projects-section.tsx per D-03/D-07/UI-SPEC §1: import { ProjectStatTiles } from './project-stat-tiles' (section-local component — viz-data exports only pure functions and types, never components) and import { projectStats } from '../viz-data' (value import — server-side at SSG), then insert as the FIRST child of the space-y-2 root div, above the cards map: a wrapper div className "mb-3" containing <ProjectStatTiles stats={projectStats(projects)} /> (the wrapper carries the intentional 12px emphasis gap; the first child receives no space-y-2 margin). Everything else stays byte-identical: cards = projects.slice(0, 6), the return-null graceful-hide, the link/date conditionals, the ArrowUpRight hover pattern, TerminalPointer. Update the header doc-comment with one line noting the tile augmentation. Doc-comments on the new file must not contain the literal tokens recharts or use client (same prose-sensitive-grep guard as Task 1).
    </action>
    <verify>npm run typecheck && node --test tests/explore-visuals.test.mjs && node --test tests/explore-shell.test.mjs && grep -c "<ProjectStatTiles" src/components/explore/sections/projects-section.tsx</verify>
    <acceptance_criteria>
      - grep -c "<ProjectStatTiles" on projects-section.tsx returns ≥ 1 with its index BEFORE the indexOf of 'cards.map'
      - project-stat-tiles.tsx: no use-client directive (grep -c "use client" returns 0), no recharts import (grep -cE "from ['\"]recharts" returns 0), contains "stats.total", "stats.activeYearsSpan", "stats.linked" — and grep -cE "2016|2026" on it returns 0 (values arrive via props, EXPLORE-07)
      - projects-section.tsx still contains "slice(0, 6)" and calls "projectStats(projects)"
      - npm run typecheck exits 0; both test suites exit 0
    </acceptance_criteria>
    <done>Both server-rendered slices are mounted augment-only: tiles above byte-identical cards, Gantt above byte-identical text timeline, every rendered number flowing from viz-data.</done>
  </task>
</tasks>
