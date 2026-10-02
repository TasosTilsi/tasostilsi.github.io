---
phase: 03-explore-visuals
plan: 02
type: execute
wave: 2
depends_on: ["EXPLORE-03-explore-visuals-01"]
files_modified: [src/components/explore/sections/skills-chart.tsx, src/components/explore/sections/skills-treemap.tsx, src/components/explore/sections/skills-section.tsx, src/components/explore/explore-panels.tsx, src/app/globals.css, tests/explore-visuals-skills.test.mjs]
autonomous: true
requirements: ["EXPLORE-02", "EXPLORE-02d"]
user_setup: []
must_haves:
  truths:
    - "Skills panel renders the recharts horizontal bar chart as the FIRST child of the space-y-3 root — 6 rows reading top→bottom in JSON group order with the data-derived counts (6/9/6/6/7/2), fills from the shared viz-data map (chart-1..5 + muted-foreground), and printed LabelList values instead of tooltips — above the byte-unchanged chips (D-01/D-04/D-07)"
    - "Skills panel renders the recharts Treemap as the SECOND child, below the bar chart and above the chips — exactly the 4 honest cells (Java 1, CI/CD 2, MCP 1, RAG 1) received from techMentions, static name+count labels via the custom content fn, depth-0 root guarded, pointerEvents none (D-08, U-2)"
    - "No recharts animation exists anywhere — isAnimationActive={false} on the Bar AND the Treemap — and no Tooltip, no CartesianGrid, no matchMedia, no hover handlers exist in either chart file (D-04/D-06 as resolved by UI-SPEC §6/§7/OQ-2)"
    - "Light-theme chart-2/chart-3 fills clear 3:1 on the white card via scoped .light .explore-shell overrides (160 65% 32% / 30 75% 38%); dark :root values untouched; phase-1 suite stays green (UI-SPEC §2 B-1, OQ-6)"
    - "The skills registry closure threads experience={data.experience} so the treemap corpus reaches the section server-side; every other SECTION_BODIES entry is byte-unchanged (UI-SPEC §10 corpus boundary, D-07)"
  artifacts:
    - path: src/components/explore/sections/skills-chart.tsx
      provides: "'use client' recharts BarChart per UI-SPEC §2 anatomy — ResponsiveContainer width 100% height 192, zero data shaping, fill from SkillGroupCount.fill, aria-label composed from rows"
      min_lines: 50
      exports: ["SkillsChart"]
    - path: src/components/explore/sections/skills-treemap.tsx
      provides: "'use client' recharts Treemap per UI-SPEC §3 — height 120, flat cells, custom content fn with depth-0 root guard, label ladder + clipPath overflow guard, honesty caption"
      min_lines: 70
      exports: ["SkillsTreemap"]
    - path: src/components/explore/sections/skills-section.tsx
      provides: "Augmented section: SkillsChart first, SkillsTreemap second, grouping adopted from viz-data skillsGroupCounts (UI-SPEC §10 single source), chips/TerminalPointer byte-identical"
      min_lines: 60
    - path: src/app/globals.css
      provides: "Scoped light-theme --chart-2/--chart-3 overrides inside .light .explore-shell with the pinned values; nothing else in the file changes (OQ-6)"
      min_lines: 580
    - path: tests/explore-visuals-skills.test.mjs
      provides: "Plan-02 red-first source-invariant carrier: client boundary, chart anatomy, augment order, adapter thread, css overrides"
      min_lines: 140
  key_links:
    - from: src/components/explore/sections/skills-section.tsx
      to: src/components/explore/sections/skills-chart.tsx
      via: "SkillsChart composed as FIRST child of the root div, before the groups loop (UI-SPEC §1 ①)"
      pattern: "<SkillsChart"
    - from: src/components/explore/sections/skills-section.tsx
      to: src/components/explore/sections/skills-treemap.tsx
      via: "SkillsTreemap composed as SECOND child, between the chart and the groups loop (UI-SPEC §1 ②)"
      pattern: "<SkillsTreemap"
    - from: src/components/explore/sections/skills-section.tsx
      to: src/components/explore/viz-data.ts
      via: "groups from skillsGroupCounts, cells from techMentions — no parallel shaping in the section (UI-SPEC §10)"
      pattern: "skillsGroupCounts|techMentions"
    - from: src/components/explore/explore-panels.tsx
      to: src/components/explore/sections/skills-section.tsx
      via: "skills adapter closure threads the experience slice for the treemap corpus"
      pattern: "experience=\{data.experience\}"
    - from: src/app/globals.css
      to: .light .explore-shell
      via: "two scoped light-theme chart overrides (B-1)"
      pattern: "--chart-2: 160 65% 32%;"
---

<objective>
Deliver the skills visualization slice end-to-end per D-01 + D-08: the 'use client' recharts horizontal BarChart AND the 'use client' recharts Treemap, both fed by plan-01's skillsGroupCounts/techMentions and mounted as the first two children of the Skills panel above the untouched chips — plus the user-confirmed light-theme contrast overrides for chart-2/chart-3 (UI-SPEC §2 B-1). Zero data shaping in the components, zero tooltips, zero animation, zero hover — static printed values for mobile-first recruiters (D-04).
</objective>

<assumption_delta_decision>
Noun now primary: the viz-data module as the one data-shaping representation (see plan 01).
Decision: promote — this plan's components perform ZERO shaping (D-05/UI-SPEC §2/§3): the section adopts skillsGroupCounts (replacing its inline builder so chart and chips can never drift) and calls techMentions server-side; the shared category→token map rides on SkillGroupCount.fill, so no parallel color mapping exists in any component. No accepted debt. Invariant companion: the plan-02 test file asserts the augment order and the data-only aria-label composition.
</assumption_delta_decision>

> **Wave-2 parallelism note (shared working tree):** this plan runs concurrently with plan 03 (`jobs.concurrency: 2`, `use_worktrees: false`) on the same working tree, and this plan touches ONLY its own files (its own test carrier tests/explore-visuals-skills.test.mjs — no overlap with plan 03's files). Global verify commands (typecheck, sibling suites) can transiently observe the sibling's mid-edit files: when a global gate fails mid-wave, root-cause against THIS plan's own diff (frontmatter files_modified) first; a failure not attributable to those paths must be re-run after the sibling plan settles before being treated as a real defect. The authoritative cross-plan gate is plan 04 Task 3, run chronologically last on the settled tree.

<context>
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md — §1 augment order (① chart ② treemap ③-⑨ unchanged), §2 bar anatomy (pinned props + B-1), §3 treemap contract (root guard, label ladder, matching restated), §6 interaction matrix, §7 motion/themes, §9 aria
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-CONTEXT.md — D-01, D-04, D-05, D-06, D-07, D-08 locked
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-RESEARCH.md — OQ-2 (unconditional isAnimationActive), OQ-3 (duplicate-category bands), OQ-4 (SSG shell + fixed height), OQ-6 (css vs phase-1 tests), R-7 (YAxis order)
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-01-PLAN.md — the data contracts this plan consumes (SkillGroupCount.fill, TreemapCell)
@src/components/explore/sections/skills-section.tsx — the section being augmented (builder lines 29-40 adopted into viz-data consumption)
@src/components/explore/explore-panels.tsx — SECTION_BODIES registry (line 62 is the one-line adapter edit)
@src/app/globals.css — :root chart tokens 37-41; .light .explore-shell block 537-566; reduced-motion guard 573-586
@node_modules/recharts/types/chart/Treemap.d.ts — verify leaf-node prop names before writing renderTreemapCell
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — bar chart composed first (red invariants → component → green)</name>
    <files>tests/explore-visuals-skills.test.mjs, src/components/explore/sections/skills-chart.tsx, src/components/explore/sections/skills-section.tsx</files>
    <read_first>UI-SPEC §2 (full pinned anatomy) and §9 (aria), CONTEXT.md D-01/D-04/D-06, src/components/explore/viz-data.ts (SkillGroupCount shape from plan 01), src/components/explore/sections/skills-section.tsx</read_first>
    <action>
      RED first: create tests/explore-visuals-skills.test.mjs (node:test + node:assert/strict + root-relative read(), mirroring tests/explore-shell.test.mjs conventions; doc-comment states it is plan-02's carrier, runner node --test tests/explore-visuals-skills.test.mjs) with the skills-slice source invariants: skills-section.tsx composes <SkillsChart as the first child before the groups loop; skills-section.tsx no longer contains the inline builder (grep "groups.push" returns nothing) and imports skillsGroupCounts from '../viz-data'; skills-chart.tsx exists carrying 'use client', imports ResponsiveContainer from 'recharts', contains isAnimationActive={false}, contains no Tooltip/CartesianGrid/matchMedia. RUN `node --test tests/explore-visuals-skills.test.mjs` and observe the failures (skills-chart.tsx absent, section unchanged) — the on-record RED. Then implement, and rerun to green.

      Create src/components/explore/sections/skills-chart.tsx per D-01 and UI-SPEC §2. 'use client'; import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Cell, LabelList } from 'recharts'; import type { SkillGroupCount } from '../viz-data'; props { rows: SkillGroupCount[] } — the component performs ZERO data shaping (D-05). Anatomy, exactly pinned: outer div role="img" whose aria-label is composed AT RENDER TIME from the rows — `Skills by category. ${rows.map(r => `${r.label} ${r.count}`).join(', ')}.` (the 'label count' pair format is pinned so plan-04's export test can assert data-derived substrings; the prefix wording is chrome); ResponsiveContainer width="100%" height={192} (fixed height reserves the SSG box — no CLS, OQ-4); BarChart layout="vertical" data={rows} margin={{ top: 4, right: 20, bottom: 0, left: 0 }}; XAxis type="number" hide; YAxis type="category" dataKey="label" width={88} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} AND `reversed` — recharts' vertical band axis defaults to first-datum-at-bottom; the visual order contract is top→bottom in JSON group order (same order as the chips), so `reversed` makes it so — verify against rendered output, never silently accept either order (R-7/UI-SPEC §2); Bar dataKey="count" barSize={12} radius={[0, 2, 2, 0]} isAnimationActive={false} (D-06/OQ-2) containing one Cell per row with key={row.id} fill={row.fill} — the fill is the shared viz-data map, no parallel mapping in the component (UI-SPEC §2); LabelList dataKey="count" position="right" fontSize={10} fill="hsl(var(--foreground))" — a permanent printed label, the D-04 mechanism; NO CartesianGrid; NO Tooltip import (D-04).

      Augment src/components/explore/sections/skills-section.tsx per D-07/UI-SPEC §10: replace the inline builder (lines 29-40) with `const groups = skillsGroupCounts(skills);` imported from '../viz-data' — the rendered groups are byte-identical (same id/label/items semantics, §10 single source); compose <SkillsChart rows={groups} /> as the FIRST child of the space-y-3 root, before the groups.map loop (UI-SPEC §1 ①); the graceful-hide (groups.length === 0 → return null), chips, group headers, and TerminalPointer stay byte-identical; the section signature is unchanged in this task ({ skills }) — the experience prop arrives in task 2.
    </action>
    <verify>node --test tests/explore-visuals-skills.test.mjs && npm run typecheck</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals-skills.test.mjs` exits 0 (was failing before the implementation — RED observed)
      - `npm run typecheck` exits 0
      - skills-chart.tsx greps: '"use client"', "isAnimationActive={false}", "from 'recharts'" present; "Tooltip", "CartesianGrid", "matchMedia" absent
      - skills-section.tsx greps: "<SkillsChart" present and appears BEFORE the groups.map call; "groups.push" absent; "skillsGroupCounts" present
      - skills-chart.tsx contains "rows.map" inside the aria-label composition and no numeric count literal
    </acceptance_criteria>
    <done>The bar chart is mounted first in the Skills panel with data-derived rows and the shared fill map; the section's grouping now has a single source; the red invariants are green.</done>
  </task>

  <task type="auto">
    <name>Task 2: Treemap below the chart (red invariants → component + corpus thread → green)</name>
    <files>tests/explore-visuals-skills.test.mjs, src/components/explore/sections/skills-treemap.tsx, src/components/explore/sections/skills-section.tsx, src/components/explore/explore-panels.tsx</files>
    <read_first>UI-SPEC §3 (full treemap contract) and §9 (treemap aria), CONTEXT.md D-08, src/components/explore/viz-data.ts (TreemapCell), node_modules/recharts/types/chart/Treemap.d.ts + node_modules/recharts/lib/chart/Treemap.js (content-fn prop names, depth-0 root call)</read_first>
    <action>
      RED first: append the treemap invariants to tests/explore-visuals-skills.test.mjs — skills-treemap.tsx exists with 'use client', imports { ResponsiveContainer, Treemap } from 'recharts', contains isAnimationActive={false}, a depth-0 root guard, the caption string 'Mentions in role responsibilities', and pointerEvents none; skills-section composes <SkillsTreemap BETWEEN <SkillsChart and the groups loop; explore-panels.tsx's skills closure threads experience={data.experience} while every other closure is byte-unchanged. RUN the suite to observe the failures — the on-record RED. Then implement and rerun to green.

      Edit src/components/explore/explore-panels.tsx: change ONLY line 62 to `skills: ({ data }) => <SkillsSection skills={data.skills} experience={data.experience} />` — one additive prop thread so the treemap corpus (experience responsibilities, UI-SPEC §10) reaches the section server-side; the registry is the data spine, not chrome (D-07 respected); every other closure stays byte-identical.

      Augment src/components/explore/sections/skills-section.tsx: extend props with experience: PortfolioData['experience']; add `const cells = techMentions(experience, skills);` (import techMentions from '../viz-data'); compose <SkillsTreemap cells={cells} /> as the SECOND child, between <SkillsChart and the groups loop (UI-SPEC §1 ②); nothing else changes.

      Create src/components/explore/sections/skills-treemap.tsx per D-08 and UI-SPEC §3. 'use client'; props { cells: TreemapCell[] } — zero matching/shaping in the component (D-05); if cells.length === 0 return null (E-13: the caption hides with the block); caption <p className="mb-1.5 text-[10px] text-muted-foreground">Mentions in role responsibilities</p> (both tokens 'mentions' and 'responsibilities' pinned); wrapper div role="img" with aria-label composed at render time — `Technology mentions across role responsibilities. ${cells.map(c => `${c.name} ${c.count}`).join(', ')}.` (the 'name count' pair format is pinned for plan-04's export assertions; §9: enumerate every cell so AT users lose nothing); ResponsiveContainer width="100%" height={120} (fixed height, 375px-safe by construction, §8); Treemap data={cells} dataKey="count" isAnimationActive={false} content={renderTreemapCell} — FLAT data, no children (depth-1 cells only, no nested group boxes, §3). renderTreemapCell is a typed pure render function defined in this file: return null when the node's depth === 0 or node.name is missing (the B-1 ROOT GUARD — recharts invokes content for the synthetic depth-0 root carrying no name; without the guard it paints a full-area unstyled rect); per cell render <g pointerEvents="none"> containing <rect fill={node.fill} fillOpacity={0.35} stroke={node.fill} strokeWidth={1} /> plus the label ladder in hsl(var(--foreground)): cell ≥64×40px → name (fontSize 11) + count (fontSize 9, one line below); ≥44×16px → name only (count dropped first); below → no label (area still communicates the count); overflow guard: estimated name width ≈6.6px/char × name.length > cell width − 8 drops the label to the next rung before rendering, and a name still overflowing at ≥44px is clipped via a per-cell clipPath (unique id per cell index) — never bleeds onto neighbors; SVG primitives only (<g>/<rect>/<text>/<clipPath>). Verify the actual leaf-node prop names against the installed recharts 2.15.4 before writing the fn (read_first) — if the leaf spreads the datum, name/count/fill arrive directly on the node. No onClick/onMouseEnter/hover props anywhere (§6: no cursor change ever).
    </action>
    <verify>node --test tests/explore-visuals-skills.test.mjs && npm run typecheck</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals-skills.test.mjs` exits 0 (treemap invariants green after being RED)
      - `npm run typecheck` exits 0
      - skills-treemap.tsx greps: '"use client"', "isAnimationActive={false}", "depth === 0", "Mentions in role responsibilities", "pointerEvents" present; "Tooltip", "onClick", "onMouseEnter", "matchMedia" absent
      - skills-section.tsx: "<SkillsTreemap" appears after "<SkillsChart" and before the groups loop
      - explore-panels.tsx: the skills closure contains "experience={data.experience}"; grep -c "experience={data.experience}" returns exactly 1
    </acceptance_criteria>
    <done>The D-08 treemap renders below the bar chart from techMentions' four honest cells with the pinned root guard and label ladder, and the corpus threads server-side through a one-line adapter change.</done>
  </task>

  <task type="auto">
    <name>Task 3: Light-theme chart-2/chart-3 overrides (red invariant → css → green)</name>
    <files>tests/explore-visuals-skills.test.mjs, src/app/globals.css</files>
    <read_first>UI-SPEC §2 (B-1 resolution + recomputed contrast values), globals.css (.light .explore-shell block ends ~line 566), tests/explore-shell.test.mjs lines 156-159 (the phase-1 --chart-1 assertions this edit must not break, OQ-6)</read_first>
    <action>
      RED first: append the css invariants to tests/explore-visuals-skills.test.mjs — the .light .explore-shell block contains the exact strings '--chart-2: 160 65% 32%;' and '--chart-3: 30 75% 38%;'; the dark .explore-shell block contains neither; no '--chart-1' override appears in either shell block (keeps the phase-1 assertions meaningful). RUN to observe the failure — the on-record RED. Then edit and rerun to green.

      Edit src/app/globals.css: inside the existing .light .explore-shell block, append exactly two lines with a one-line comment citing UI-SPEC §2 B-1 — `--chart-2: 160 65% 32%;` (4.49:1 on the white card) and `--chart-3: 30 75% 38%;` (4.75:1); hue-preserving, user-confirmed. The dark :root/explore-shell values are untouched; NO --chart-1 override is added to either block. Nothing else in globals.css changes — the reduced-motion guard (573-586) and all CLI blocks stay byte-identical (D-07). Known decorative side effect, accepted: drawer digits, 8px timeline dots, and the Gantt's chart-2 bars darken in light mode (UI-SPEC §2: improved consistency, no regression).
    </action>
    <verify>node --test tests/explore-visuals-skills.test.mjs && node --test tests/explore-shell.test.mjs && npm run typecheck</verify>
    <acceptance_criteria>
      - `node --test tests/explore-visuals-skills.test.mjs` exits 0 (css invariants green after being RED)
      - `node --test tests/explore-shell.test.mjs` exits 0 — the phase-1 suite is unaffected by the additions (OQ-6)
      - `npm run typecheck` exits 0
      - globals.css greps: '--chart-2: 160 65% 32%;' and '--chart-3: 30 75% 38%;' each present exactly once, inside the .light .explore-shell block
    </acceptance_criteria>
    <done>Light-theme chart fills clear 3:1 by the pinned scoped override; dark values untouched; both suites green.</done>
  </task>
</tasks>