---
phase: EXPLORE-07-look-and-feel-revision
plan: 02
type: execute
wave: 2
depends_on: ["EXPLORE-07-look-and-feel-revision-01"]
files_modified:
  - "src/components/explore/panel-shell.tsx"
  - "src/components/explore/explore-panels.tsx"
  - "src/components/explore/sections/skills-section.tsx"
  - "tests/explore-shell.test.mjs"
  - "tests/explore-visuals.test.mjs"
  - "tests/explore-visuals-skills.test.mjs"
autonomous: true
requirements: ["REV-09", "REV-10"]
user_setup: []
must_haves:
  truths:
    - "Each of the four panel headers shows a quiet oversized mono index (01-04) at its right end — aria-hidden, zero-padded from the EXPLORE_SECTIONS map index, no literals in JSX — and no index appears on drawer items, tour card headings or the status bar"
    - "Competency cards alternate the accent chip left/right by index parity (even top-left, odd top-right, proof always left-aligned) and carry exp-lift (the class is intentionally inert until plan 03 defines it in globals.css) — chip groups, Badge overrides and TerminalPointer stay byte-identical"
    - "The panel grid carries panel-grid + gap-4 md:grid-cols-2 lg:gap-5 (gutters widen only ≥1024px per D-02); no max-w- or col-span class exists in explore-panels.tsx"
  artifacts:
    - path: "src/components/explore/panel-shell.tsx"
      provides: "The index prop + aria-hidden oversized mono index span on the four PanelShell headers only — hover-inert chrome otherwise unchanged (R2 bans hold)"
      min_lines: 55
      exports: ["PanelShell"]
    - path: "src/components/explore/explore-panels.tsx"
      provides: "The index feed (String(index + 1).padStart(2, '0')), the panel-grid stagger hook class, and the lg:gap-5 gutter"
      min_lines: 85
      exports: ["ExplorePanels"]
    - path: "src/components/explore/sections/skills-section.tsx"
      provides: "The REV-09 competency card presentation redesign: alternating chip alignment, exp-lift, mt-2 proof rhythm — chips/pointer/graceful-hide preserved"
      min_lines: 80
      exports: ["SkillsSection"]
  key_links:
    - from: "src/components/explore/explore-panels.tsx"
      to: "src/components/explore/panel-shell.tsx"
      via: "the zero-padded index flows from the EXPLORE_SECTIONS map through the required index prop into the aria-hidden span"
      pattern: "index={String(index + 1).padStart(2, '0')}"
    - from: "src/components/explore/explore-panels.tsx"
      to: "src/app/globals.css"
      via: "the panel-grid class is the DOM hook plan 03's stagger animation targets (dependency: plan 03 runs after this)"
      pattern: "panel-grid"
    - from: "src/components/explore/sections/skills-section.tsx"
      to: "src/app/globals.css"
      via: "exp-lift on the competency <li> joins the M2 lift+bloom vocabulary once plan 03 defines the class"
      pattern: "exp-lift"
---

<objective>
Deliver the static D-02 dial-B effects and the REV-09 competency card redesign: the oversized mono index hierarchy device on the four panel headers (UI-SPEC §5), the lg-tier gutter widening plus the panel-grid stagger hook (UI-SPEC §1.1/§1.2), and the alternating-chip / spaced / hover-wired competency cards (UI-SPEC §4). This plan depends on plan 01 because REV-10's process gate requires the audit-table commit to precede every fix commit — these ARE fix commits (audit rows 3, 4, 5).

Red/green discipline inside every code task: the test pins are written and run FIRST against the unedited tree (they assert the target contract, so they record RED), then the implementation lands, then the same commands re-run GREEN — each commit stays atomic (tests + code together) so every commit is green on the tree it creates.
</objective>

<assumption_delta_decision>
- noun: n/a — same adjudication as plan 01: the "alternate" signal is a presentation rhythm (chip-position parity across the 8-card index), not an identity-model transition.
- decision: no-change — no variant axis exists; see plan 01 for the full block.
- rationale: D-02's alternation is a visual cadence over ONE card representation, not a promotion/add-alongside of a second representation.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-UI-SPEC.md
@.planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-RESEARCH.md
@src/components/explore/panel-shell.tsx
@src/components/explore/explore-panels.tsx
@src/components/explore/sections/skills-section.tsx
@tests/explore-shell.test.mjs
@tests/explore-visuals-skills.test.mjs
</context>

<tasks>
  <task type="auto">
    <name>Task 1 (tracer): Panel index device 01-04 end-to-end + lg gutter + panel-grid hook (D-02, UI-SPEC §5/§1.2)</name>
    <files>src/components/explore/panel-shell.tsx, src/components/explore/explore-panels.tsx, tests/explore-shell.test.mjs, tests/explore-visuals.test.mjs</files>
    <read_first>src/components/explore/panel-shell.tsx, src/components/explore/explore-panels.tsx, tests/explore-shell.test.mjs (panel-shell anatomy ~295-303, grid regex ~312), tests/explore-visuals.test.mjs (export block), UI-SPEC §1.1, §1.2, §5, §10 item 6</read_first>
    <action>RED first: extend tests/explore-shell.test.mjs — the panel-shell anatomy block keeps its existing hover:/cursor-pointer/tabIndex bans and gains the target pins (panel-shell.tsx declares an `index: string` prop and renders an aria-hidden span with the classes ml-auto select-none font-mono text-2xl font-medium leading-none tabular-nums text-muted-foreground/50; explore-panels.tsx container class carries panel-grid and lg:gap-5 and NO max-w-); in tests/explore-visuals.test.mjs add an export test asserting out/explore.html renders four aria-hidden index spans reading 01, 02, 03, 04 (UI-SPEC §10.6). Run `rm -rf out && npm run build && node --test tests/explore-shell.test.mjs tests/explore-visuals.test.mjs` and RECORD the RED (the pins fail — no index exists yet). THEN implement: (1) panel-shell.tsx gains a REQUIRED `index: string` prop (the single caller always feeds it; never optional) and the header row (flex items-center gap-2) appends after the h2 the span aria-hidden="true" with exactly the class string above, fed by the prop — nothing else in the chrome changes, no hover affordance, no cursor, no tabIndex (R2; UI-SPEC §0 panel-chrome rail); (2) explore-panels.tsx: the EXPLORE_SECTIONS.map callback gains the index parameter and feeds index={String(index + 1).padStart(2, '0')} (data-derived, zero literals — R3); the container className becomes `grid panel-grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5` — the D-02 gutter widening is lg-only and the panel-grid class is the stagger hook plan 03 targets (no max-w- — R12). The drawer items, tour card headings, status bar and explore-tour.tsx's duplicated accent map stay untouched (UI-SPEC §5 scope). Update the panel-shell/explore-panels header comments to note the index device (D-02). Re-run the same commands to GREEN. Commit atomically: `feat(EXPLORE-07): panel index hierarchy device + lg gutter + stagger hook (D-02)`.</action>
    <verify>rm -rf out && npm run build && node --test tests/explore-shell.test.mjs tests/explore-visuals.test.mjs tests/explore-sweep.test.mjs</verify>
    <acceptance_criteria>
      - `grep -c "index: string" src/components/explore/panel-shell.tsx` ≥ 1 and `grep -c "ml-auto select-none font-mono text-2xl" src/components/explore/panel-shell.tsx` ≥ 1
      - `grep -c "panel-grid" src/components/explore/explore-panels.tsx` ≥ 1 and `grep -c "lg:gap-5" src/components/explore/explore-panels.tsx` ≥ 1
      - `grep -c "max-w-" src/components/explore/explore-panels.tsx` prints 0
      - `grep -c "String(index + 1).padStart(2, '0')" src/components/explore/explore-panels.tsx` ≥ 1 (zero literals in JSX)
      - out/explore.html contains the four aria-hidden index values 01 02 03 04
      - `node --test tests/explore-shell.test.mjs tests/explore-visuals.test.mjs tests/explore-sweep.test.mjs` exits 0 (sweep still green: grid regex substring intact, no col-span)
    </acceptance_criteria>
    <done>All four panel headers render the quiet mono index at their right end, data-driven with no literals, and the grid carries the lg gutter + the plan-03 stagger hook — verified through source pins and the fresh export.</done>
  </task>
  <task type="auto">
    <name>Task 2: Competency card presentation redesign (REV-09/D-02, UI-SPEC §4)</name>
    <files>src/components/explore/sections/skills-section.tsx, tests/explore-visuals-skills.test.mjs</files>
    <read_first>src/components/explore/sections/skills-section.tsx, tests/explore-visuals-skills.test.mjs (card anatomy test ~78), tests/explore-visuals.test.mjs (competency export test ~558), UI-SPEC §4</read_first>
    <action>RED first: extend the card-anatomy test in tests/explore-visuals-skills.test.mjs (~78) with the target pins: the competency li carries exp-lift; the chip wrapper uses the index-parity conditional (self-start on even, self-end on odd); the proof sits at mt-2; the grid classes grid-cols-1 gap-2 lg:grid-cols-2 and the p-3 padding are UNCHANGED; the Badge override string font-normal pointer-events-none text-chart-3 border-chart-3/40 is UNCHANGED; the file contains no cursor-pointer. Run `node --test tests/explore-visuals-skills.test.mjs` and RECORD the RED. THEN per UI-SPEC §4/D-02 implement in skills-section.tsx: the competencies.map callback gains the index parameter; the li className becomes `flex flex-col rounded-md border border-border p-3 exp-lift` (the class is intentionally inert until plan 03 defines .exp-lift in globals.css — cite D-02/D-04); wrap the Badge in a div with className={index % 2 === 0 ? "self-start" : "self-end"} (alternating chip position; in the lg 4×2 grid this reads column-wise zigzag, at base 1-col as alternating left/right); the proof p moves mt-1.5 → mt-2 and stays text-xs leading-relaxed text-muted-foreground, left-aligned both ways (reading stability); everything else stays byte-identical: the chips groups loop with its text-xs headers, both Badge override strings (font-normal pointer-events-none; the chart-3 chip accent), the TerminalPointer `skills`, the grid gap-2, and the graceful-hide branches (skills-section.tsx:44-46). Cursor stays default — cards are NOT interactive (no focusable, no pointer, no 44px requirement). Update the header comment to the REV-09 presentation note. The competency export test in tests/explore-visuals.test.mjs (~558) must keep passing untouched (names + proofs render verbatim). Re-run to GREEN. Commit atomically: `feat(EXPLORE-07): competency card presentation redesign (REV-09/D-02)`.</action>
    <verify>npm run typecheck && node --test tests/explore-visuals-skills.test.mjs tests/explore-visuals.test.mjs</verify>
    <acceptance_criteria>
      - `grep -c "exp-lift" src/components/explore/sections/skills-section.tsx` ≥ 1
      - `grep -c "self-start\" : \"self-end" src/components/explore/sections/skills-section.tsx` ≥ 1 (the parity conditional exists)
      - `grep -c "mt-2 text-xs leading-relaxed text-muted-foreground" src/components/explore/sections/skills-section.tsx` ≥ 1
      - `grep -c "font-normal pointer-events-none text-chart-3 border-chart-3/40" src/components/explore/sections/skills-section.tsx` ≥ 1 (override preserved)
      - `grep -c "cursor-pointer" src/components/explore/sections/skills-section.tsx` prints 0
      - `grep -c "grid-cols-1 gap-2 lg:grid-cols-2" src/components/explore/sections/skills-section.tsx` ≥ 1 (grid unchanged)
      - both suites exit 0
    </acceptance_criteria>
    <done>The competency cards alternate chips by parity, sit on the exp-lift hook with mt-2 proof rhythm, and every preserved element (chips, overrides, pointer, graceful-hide, verbatim export) is proven unchanged by the extended pins.</done>
  </task>
</tasks>