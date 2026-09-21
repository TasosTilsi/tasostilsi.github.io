---
phase: 03-explore-visuals
plan: 02
type: execute
wave: 2
depends_on: ["EXPLORE-03-explore-visuals-01"]
files_modified: [src/components/explore/sections/skills-chart.tsx, src/components/explore/sections/skills-section.tsx, src/app/globals.css]
autonomous: true
requirements: ["EXPLORE-02"]
user_setup: []
must_haves:
  truths:
    - "Skills panel renders a horizontal recharts bar chart as the FIRST child of the space-y-3 root, above the byte-unchanged chips and group headers (D-01/D-07)"
    - "The chart shows the 6 JSON group counts (6/9/6/6/7/2) as data-derived rows with chart-1..5 token fills for rows 1–5 and muted-foreground for row 6; printed LabelList values replace tooltips entirely (D-04)"
    - "No recharts animation exists at all — isAnimationActive={false} on the Bar — so reduced-motion is satisfied unconditionally with no matchMedia wiring (D-06 as resolved by UI-SPEC §6/OQ-2)"
    - "Light-theme chart-2/chart-3 fills clear 3:1 on the white card via scoped .light .explore-shell overrides (160 65% 32% / 30 75% 38%); dark :root values untouched (UI-SPEC §2 B-1)"
  artifacts:
    - path: src/components/explore/sections/skills-chart.tsx
      provides: "'use client' recharts BarChart — ResponsiveContainer width 100% height 192, zero data shaping, data via precomputed props (D-05/D-06)"
      min_lines: 40
      exports: ["SkillsChart"]
    - path: src/components/explore/sections/skills-section.tsx
      provides: "Augmented section: SkillsChart composed first, grouping sourced from viz-data skillsGroupCounts (UI-SPEC §9 single source), chips/TerminalPointer byte-identical"
      min_lines: 60
    - path: src/app/globals.css
      provides: "Scoped light-theme --chart-2/--chart-3 overrides inside .light .explore-shell with the pinned values; phase-1 shell assertions unaffected (OQ-6)"
      min_lines: 580
  key_links:
    - from: src/components/explore/sections/skills-section.tsx
      to: src/components/explore/sections/skills-chart.tsx
      via: "SkillsChart composed as first child of the root div, before the groups.map loop (UI-SPEC §1)"
      pattern: "<SkillsChart"
    - from: src/components/explore/sections/skills-section.tsx
      to: src/components/explore/viz-data.ts
      via: "groups built by skillsGroupCounts — no parallel grouping implementation (UI-SPEC §9)"
      pattern: "skillsGroupCounts"
    - from: src/components/explore/sections/skills-chart.tsx
      to: package.json (recharts ^2.15.1, line 51)
      via: "client component importing ResponsiveContainer/BarChart/XAxis/YAxis/Bar/Cell/LabelList from 'recharts'"
      pattern: "from 'recharts'"
---

<objective>
Deliver the skills visualization slice end-to-end per D-01: a 'use client' recharts horizontal BarChart fed by plan-01's skillsGroupCounts, mounted as the first child of the Skills panel above the untouched chips, plus the user-confirmed light-theme contrast overrides for chart-2/chart-3 (UI-SPEC §2, B-1). Zero data shaping in the component, zero tooltips, zero animation — static printed values for mobile-first recruiters (D-04).
</objective>

> **Wave-2 parallelism note (shared working tree):** this plan runs concurrently with the other wave-2 plan (`jobs.concurrency: 2`, `use_worktrees: false`) on the same working tree, while its per-task verify commands run *global* gates (`npm run typecheck` and both `node --test` suites) that can transiently observe the sibling's mid-edit files. When a global gate fails mid-wave: root-cause against THIS plan's own diff first (the paths in frontmatter `files_modified`); a failure not attributable to those paths must be re-run after the sibling plan settles before being treated as a real defect. The authoritative cross-plan gate is wave-3 plan 04 Task 3, which runs the full four-command gate chronologically last on the settled tree.

<context>
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md — §1 insertion points, §2 full chart anatomy (pinned values), §5 interaction matrix, §6 motion/themes, §8 aria
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-CONTEXT.md — D-01, D-04, D-06, D-07 locked
@.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-RESEARCH.md — OQ-2 (unconditional isAnimationActive={false}), OQ-3 (duplicate-category bands), OQ-4 (SSG shell + fixed height), OQ-6 (css overrides vs phase-1 tests), R-7 (YAxis order)
@src/components/explore/sections/skills-section.tsx — the section being augmented (builder lines 29-40 move to viz-data consumption)
@src/components/explore/viz-data.ts — SkillGroupCount source (plan 01)
@src/app/globals.css — :root chart tokens 37-41; .light .explore-shell block 533-566; reduced-motion guard 568-586
@src/components/explore/explore-intro.tsx — matchMedia precedent that must stay untouched by charts
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — SkillsChart client component + mount above the chips</name>
    <files>src/components/explore/sections/skills-chart.tsx, src/components/explore/sections/skills-section.tsx</files>
    <read_first>UI-SPEC §1, §2, §5, §6, §8; src/components/explore/sections/skills-section.tsx; src/components/explore/viz-data.ts; tailwind.config.ts lines 46-52 (chart tokens)</read_first>
    <action>
      Red/green ordering: before writing any code, run `grep -c "<SkillsChart" src/components/explore/sections/skills-section.tsx` and observe 0, with src/components/explore/sections/skills-chart.tsx absent — the on-record RED for the missing chart behavior. Implement below, then the same grep and the verify command go green.

      Create src/components/explore/sections/skills-chart.tsx per D-01/D-06/UI-SPEC §2. First line is the "use client" directive. Props: { data: Array<{ label: string; count: number }> } — the component performs ZERO data shaping; the array arrives precomputed from viz-data (D-05). Structure: an outer div with role="img" and an aria-label composed at render time from the data array — 'Skills by category: ' + data.map(d => `${d.label} ${d.count}`).join(', ') — zero numeric literals in the component (UI-SPEC §8/W-2); inside it, ResponsiveContainer width="100%" height={192} (fixed height so the SSG shell → hydration transition causes no layout shift, OQ-4); BarChart layout="vertical" data={data} margin={{ top: 4, right: 20, bottom: 0, left: 0 }}; XAxis type="number" hide; YAxis type="category" dataKey="label" width={88} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} reversed — the visual order contract requires rows top→bottom in JSON group order and recharts defaults to first-at-bottom, so set reversed AND verify the rendered order against this contract (R-7: do not silently accept the wrong direction); Bar dataKey="count" barSize={12} radius={[0, 2, 2, 0]} isAnimationActive={false} — unconditional, no matchMedia anywhere (D-06 as resolved by UI-SPEC §6/OQ-2); one Cell per row via map over data — index 0-4 fill 'hsl(var(--chart-1))' … 'hsl(var(--chart-5))', index 5 fill 'hsl(var(--muted-foreground))' (UI-SPEC §2 color mapping: no sixth hue, gray reads honestly for the spoken-languages group); LabelList dataKey="count" position="right" fontSize={10} fill="hsl(var(--foreground))" — the permanent printed value, the D-04 mechanism. NO CartesianGrid, NO Tooltip, no hover/cursor/focus/transition styles on anything (UI-SPEC §5). Import only from 'recharts'.

      Mount in skills-section.tsx per D-01/D-07/UI-SPEC §1: replace the inline group builder (current lines 29-40) with `const groups = skillsGroupCounts(skills);` imported from '../viz-data' — single source of truth per UI-SPEC §9 so chart counts can never drift from the rendered chips; the id/label/items consumption in the render loop stays exactly as-is and the output remains byte-identical; keep `if (groups.length === 0) { return null; }` unchanged (E-10: chart hides with the section). Compose <SkillsChart data={groups.map(({ label, count }) => ({ label, count }))} /> as the FIRST child of the existing space-y-3 root div, before the groups.map — no extra wrapper margin (the root's space-y-3 provides the 12px gap). Group headers, chips (Badge variant="outline" className="font-normal pointer-events-none"), and TerminalPointer: byte-unchanged. Update the header doc-comment with one line noting the chart augmentation and the viz-data grouping source. Doc-comments on both files must not contain the literal tokens Tooltip, CartesianGrid, or matchMedia — write around them (e.g. 'printed values replace hover layers') — so the code-shaped acceptance greps below and plan 04's whole-file Layer-2 token greps cannot be tripped by documentation.
    </action>
    <verify>npm run typecheck && node --test tests/explore-visuals.test.mjs && node --test tests/explore-shell.test.mjs && grep -c "<SkillsChart" src/components/explore/sections/skills-section.tsx</verify>
    <acceptance_criteria>
      - grep -c "<SkillsChart" on skills-section.tsx returns ≥ 1, and its index is BEFORE the indexOf of 'groups.map' (augment order)
      - skills-chart.tsx first line matches /["']use client["']/; grep "isAnimationActive={false}" hits it; grep -c "<Tooltip" on it returns 0; grep -c "matchMedia(" on it returns 0; grep -c "<CartesianGrid" on it returns 0 — code-shaped tokens, doc-comment prose cannot trip them
      - skills-section.tsx contains "skillsGroupCounts" and still contains "font-normal pointer-events-none"
      - npm run typecheck exits 0; both test suites exit 0
    </acceptance_criteria>
    <done>The skills chart slice is end-to-end in source: client component per D-06 anatomy, mounted above byte-identical chips, grouping single-sourced through viz-data (UI-SPEC §9).</done>
  </task>

  <task type="auto">
    <name>Task 2: light-theme chart-2/chart-3 contrast overrides (UI-SPEC §2, B-1)</name>
    <files>src/app/globals.css</files>
    <read_first>src/app/globals.css lines 37-41 and 533-566; tests/explore-shell.test.mjs lines 41-55 (phase-1 shell assertions); UI-SPEC §2 legibility paragraph</read_first>
    <action>
      Red/green ordering: run `grep -c -- "--chart-2: 160 65% 32%;" src/app/globals.css` first and observe 0 — the on-record RED for the missing light-theme overrides. Then edit and rerun to 1 (green).

      Inside the existing .light .explore-shell block (globals.css:537-566) add exactly two token lines, per the user-confirmed B-1 resolution: `--chart-2: 160 65% 32%;` and `--chart-3: 30 75% 38%;` (light-theme 2.53:1/2.55:1 failures become 4.49:1/4.75:1 against the white card; hue-preserving; dark :root values at lines 38-39 untouched). Amend the block's preceding comment (lines 533-536), which currently claims 'Chart-1..5 remain inherited (not overridden)': restate it as the B-1 resolution — chart-2/chart-3 gain scoped light overrides, chart-1/4/5 stay inherited, dark :root values untouched. Do NOT add any --chart-1, --chart-4, or --chart-5 override to either shell block (the phase-1 test at tests/explore-shell.test.mjs:54 asserts no --chart-1 inside shell blocks — OQ-6). Do NOT touch the reduced-motion guard block (globals.css:568-586) or any CLI token block (D-07). No other CSS changes.
    </action>
    <verify>grep -c -- "--chart-2: 160 65% 32%;" src/app/globals.css && grep -c -- "--chart-3: 30 75% 38%;" src/app/globals.css && node --test tests/explore-shell.test.mjs && node --test tests/explore-visuals.test.mjs</verify>
    <acceptance_criteria>
      - grep finds both pinned values exactly once each in src/app/globals.css, and the regex /\.light \.explore-shell\s*\{[^}]*--chart-2/s matches
      - the regex /\.explore-shell\s*\{[^}]*--chart-1/s does NOT match anywhere in globals.css (phase-1 assertion OQ-6 stays meaningful)
      - `node --test tests/explore-shell.test.mjs` exits 0 (phase-1 suite unbroken) and `node --test tests/explore-visuals.test.mjs` exits 0
    </acceptance_criteria>
    <done>Both themes clear the contrast math by pinned tokens: light chart-2/chart-3 pass 3:1, dark untouched, phase-1 assertions green.</done>
  </task>
</tasks>
