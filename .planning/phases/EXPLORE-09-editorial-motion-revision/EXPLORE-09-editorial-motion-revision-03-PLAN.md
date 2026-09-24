---
phase: 09-editorial-motion-revision
plan: 03
type: tdd
wave: 2
depends_on: ["EXPLORE-09-editorial-motion-revision-01"]
files_modified:
  - src/components/explore/constants.ts
  - src/components/explore/explore-panels.tsx
  - src/components/explore/explore-drawer.tsx
  - tests/explore-tour.test.mjs
  - tests/explore-sweep.test.mjs
  - tests/explore-shell.test.mjs
autonomous: true
requirements: ["REV-14"]
user_setup: []
must_haves:
  truths:
    - "The grid reflows to [About+Contact | Skills] row 1, Experience full-width row 2, Projects row 3 — by REAL DOM order (the reordered EXPLORE_SECTIONS), not placement re-sorting; DOM order = visual order = tab order (UI-SPEC §8)"
    - "Index chips re-derive: About 01, Skills 02, Experience 03, Projects 04 — String(index+1).padStart(2,'0') over the new array order, no literals in JSX"
    - "Drawer digit accents follow the SECTION, not the position: per-id Record (about chart-1, experience chart-2, skills chart-3, projects chart-4) — Skills never inherits Experience's accent (the positional-zip trap, OQ-7)"
    - "The tour's CONTENT step order is unchanged — welcome → about → experience → skills → projects → finish (D-01) — via an id-keyed literal 6-step table; each body string stays paired to its OWN section id (the positional body zip is gone, OQ-6)"
    - "The Experience wrapper drops md:order-first and lands on row 2 naturally; the grid stays grid-cols-1 md:grid-cols-2 lg:gap-5 with every placement utility md:-scoped (375px invariant) and no overflow utility on the sticky chain"
    - "The visited counter, IO visited marking and tour scroll targets re-derive automatically (count-based / section-id-based — order-independent, OQ-11); the entrance stagger re-derives by DOM position with zero CSS changes (OQ-9)"
  artifacts:
    - path: "src/components/explore/constants.ts"
      provides: "EXPLORE_SECTIONS reordered to [about, skills, experience, projects] (the single ordering source) + the id-keyed literal 6-step tour table replacing the positional EXPLORE_SECTIONS.map zip"
      min_lines: 120
      exports: ["EXPLORE_SECTIONS", "ExploreSectionId", "EXPLORE_TOUR_STEPS", "TourStep", "EXPLORE_TOUR_ACCENTS", "EXPLORE_TOUR_FINISH"]
    - path: "src/components/explore/explore-panels.tsx"
      provides: "The reflowed PLACEMENT map — experience wrapper 'md:col-span-2 md:h-[300vh]' (order-first removed), shell sticky recipe unchanged; about/skills/projects placements untouched this wave (plan 04 owns the projects wrapper next wave); chips/stagger re-derive from the array"
      min_lines: 140
      exports: ["ExplorePanels"]
    - path: "src/components/explore/explore-drawer.tsx"
      provides: "DIGIT_ACCENTS as a per-id Record<ExploreSectionId, string> consumed by section id — accents follow the section under any order"
      min_lines: 70
      exports: ["ExploreDrawer"]
    - path: "tests/explore-tour.test.mjs"
      provides: "The renewed tour contract: 6 steps, CONTENT order pinned by id, every body string paired to its own section id (id-keyed), sectionId targets by id"
      min_lines: 560
      exports: []
  key_links:
    - from: "src/components/explore/explore-panels.tsx"
      to: "src/components/explore/constants.ts"
      via: "render order, index chips and the panel map all derive from the reordered EXPLORE_SECTIONS — one ordering source (D-01)"
      pattern: "EXPLORE_SECTIONS\\.map"
    - from: "src/components/explore/explore-drawer.tsx"
      to: "src/components/explore/constants.ts"
      via: "item order derives from EXPLORE_SECTIONS; digit accent lookup is by section id (DIGIT_ACCENTS[section.id])"
      pattern: "DIGIT_ACCENTS\\[section\\.id\\]"
    - from: "tests/explore-tour.test.mjs"
      to: "src/components/explore/constants.ts"
      via: "the renewed suite pins the id-keyed content order and the per-id body pairing against the literal table"
      pattern: "EXPLORE_TOUR_STEPS"
---

<objective>
Reflow the /explore panel grid (REV-14, D-01): reorder the single ordering source EXPLORE_SECTIONS to [about, skills, experience, projects] so About leads row 1 with Skills beside it, Experience lands full-width row 2 and Projects row 3 — by real DOM order, retiring the md:order-first speech-order trick — while re-pinning the TWO verified positional-zip consumers (drawer digit accents → per-id Record; tour step generation → id-keyed literal table preserving the CONTENT order) so nothing silently re-pairs. Chips, drawer items, entrance stagger, counter, IO and tour targets all re-derive from the one array. RED-first: the renewed suite pins the new contracts before the reorder lands.
</objective>

<assumption_delta_decision>
- Noun now primary: the **panel order source** — the reordered EXPLORE_SECTIONS array is THE order identity (DOM = visual = drawer = chips = stagger derive from it).
- Decision: **promote**. The old [about, experience, skills, projects] order is gone entirely; the positional consumers (DIGIT_ACCENTS array, tour body zip) demote to id-keyed lookups over the same identity rather than coexisting as a parallel ordering path. No add-alongside debt.
- Companion invariant: every order consumer round-trips through the primary array — drawer items, index chips, placement map lookup, tour scroll targets, IO thresholds and the visited counter all read the one array (or are provably order-independent, OQ-11); no consumer keeps a second copy of the old order.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md — §1 is NORMATIVE (order table §1.1, re-mapped flows §1.2, breakpoints §1.3)
@.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-CONTEXT.md — D-01 (the reflow + content order unchanged)
@src/components/explore/constants.ts — EXPLORE_SECTIONS at lines 10-15; the positional tour generation at lines 94-123 (EXPLORE_TOUR_STEP_BODIES zip)
@src/components/explore/explore-panels.tsx — PLACEMENT map at lines 108-116 (experience wrapper carries md:order-first at line 111); NOTE this file was minimally migrated by plan 01 (selectTimelineEntries gate) — build on the current state
@src/components/explore/explore-drawer.tsx — the positional DIGIT_ACCENTS array at lines 33-38, consumed at line 62
@tests/explore-tour.test.mjs — the positional-zip pins at lines 68-98 being renewed
@tests/explore-sweep.test.mjs — the placement greps at lines 51-107 (order-first count, EXPLORE_SECTIONS id order) being renewed (the E-6…E-9 block was already renewed by plan 01 — do not touch it)
@tests/explore-shell.test.mjs — the drawer digit pins at lines 246-254 and the placement whitelist at lines 326-371 being renewed
</context>

<tasks>
  <task type="test">
    <name>Task 1: RED — renew the reflow contracts (tour content order by id, drawer accents by id, grid order + zero order-first)</name>
    <files>tests/explore-tour.test.mjs, tests/explore-sweep.test.mjs, tests/explore-shell.test.mjs</files>
    <read_first>.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md (§1.1/§1.2), src/components/explore/constants.ts (the bodies at lines 95-100 — they stay verbatim), src/components/explore/explore-drawer.tsx, tests/explore-tour.test.mjs (lines 60-110), tests/explore-sweep.test.mjs (lines 40-110), tests/explore-shell.test.mjs (lines 240-371)</read_first>
    <action>
      1. tests/explore-tour.test.mjs: renew the step-table assertions (lines ~68-98) to the ID-KEYED contract — EXPLORE_TOUR_STEPS has exactly 6 steps with ids [welcome, about, experience, skills, projects, finish] IN CONTENT ORDER (unchanged by the reflow, D-01); each content step's sectionId targets its own panel id and each step's body string is paired to ITS OWN section (about → the bio/contacts body, experience → 'Roles in order…', skills → 'Competency cards…', projects → 'Stat tiles…') — replacing the positional assertion `step.sectionId === EXPLORE_SECTIONS[i].id` (which silently re-pairs after the reorder). Welcome/finish chrome assertions stay.
      2. tests/explore-sweep.test.mjs: renew ONLY the placement block (lines ~51-107) — EXPLORE_SECTIONS ids in order [about, skills, experience, projects]; `md:order-first` count in explore-panels.tsx === 0 (the speech-order caveat retires, UI-SPEC §8); the col-span-2 whitelist still holds (experience wrapper + projects shell this wave — the projects shell still carries md:col-span-2 at wave 2, so the count message's 'projects shell' wording stays factually CORRECT here; plan 04 renews that message text next wave when it moves the span-2 to the projects wrapper — do NOT pre-renew it in this plan); the sticky recipe + md-scoped h-[300vh] assertions stay. Do NOT touch the E-6…E-9 block (plan 01's renewal — keep it green).
      3. tests/explore-shell.test.mjs: renew the drawer digit pins (lines ~246-254) to per-id assertions — the drawer source contains a Record keyed by section id with all four text-chart-N values, and the usage is DIGIT_ACCENTS[section.id]; renew the placement test (lines ~326-371) to zero order-first + the same col-span whitelist; the no-id-comparison pin (line ~363) STAYS (the reflow must stay map-driven).
      Run all three files — RED on the new contracts (the drawer Record and the reordered array do not exist yet; the order-first greps fail), with all unrelated pins still green.
    </action>
    <verify>node --test tests/explore-tour.test.mjs tests/explore-sweep.test.mjs tests/explore-shell.test.mjs — the new-contract assertions fail, everything else green</verify>
    <acceptance_criteria>
      - The tour suite asserts the 6 ids in content order AND per-id body pairing (grep the suite for 'Roles in order' paired to the experience id)
      - The sweep suite asserts the id order [about, skills, experience, projects] and an order-first count of 0
      - The shell suite asserts a per-id digit-accent Record (grep for 'DIGIT_ACCENTS[section.id]' in the drawer source expectation)
      - `node --test tests/explore-sweep.test.mjs` fails on the EXPLORE_SECTIONS-order/order-first assertions against the current tree (RED)
    </acceptance_criteria>
    <done>The renewed suites express REV-14's contracts and are red for exactly the not-yet-reordered reasons</done>
  </task>
  <task type="feat">
    <name>Task 2: GREEN — reorder the ordering source, re-pin both positional consumers, drop md:order-first</name>
    <files>src/components/explore/constants.ts, src/components/explore/explore-drawer.tsx, src/components/explore/explore-panels.tsx</files>
    <read_first>tests/explore-tour.test.mjs + tests/explore-sweep.test.mjs + tests/explore-shell.test.mjs (the Task-1 contracts are the spec), src/components/explore/constants.ts (full), src/components/explore/explore-drawer.tsx (lines 30-70), src/components/explore/explore-panels.tsx (lines 97-153), .planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md (§1.2 flow table)</read_first>
    <action>
      1. constants.ts: reorder EXPLORE_SECTIONS to [{ about }, { skills }, { experience }, { projects }] — labels unchanged. Replace the positional tour generation (EXPLORE_TOUR_STEP_BODIES array + the EXPLORE_SECTIONS.map zip at lines 117-123) with the ID-KEYED literal 6-step table: welcome and finish steps byte-identical to today; the four content steps written as literal objects in CONTENT order (about, experience, skills, projects) with heading/announce derived from the matching EXPLORE_SECTIONS entry's label and each body string kept verbatim from the current EXPLORE_TOUR_STEP_BODIES but keyed to its own section (about → bio body, experience → 'Roles in order…', skills → 'Competency cards…', projects → 'Stat tiles…'). Delete the now-unused positional bodies array. Update the file header comment (D-01 phase-9 amendment: About first; content order preserved).
      2. explore-drawer.tsx: replace the positional DIGIT_ACCENTS array with a per-id Record<ExploreSectionId, string> — about: 'text-chart-1', experience: 'text-chart-2', skills: 'text-chart-3', projects: 'text-chart-4' (mirroring ACCENTS/EXPLORE_TOUR_ACCENTS — OQ-7) — consumed as DIGIT_ACCENTS[section.id]; item order continues to derive from EXPLORE_SECTIONS (About, Skills, Experience, Projects). 44px targets untouched.
      3. explore-panels.tsx: PLACEMENT.experience.wrapper drops 'md:order-first' → 'md:col-span-2 md:h-[300vh]' (Experience lands row 2 naturally under the reordered DOM); experience shell sticky recipe unchanged; about/skills/projects placements byte-untouched this wave (plan 04 owns the projects wrapper next wave). Update the header comment: the phase-9 reflow rows [About|Skills][EXP span-2][Projects span-2], the speech-order caveat retired (UI-SPEC §8), chips/stagger re-deriving from the array. The W-3 gate line stays exactly as plan 01 left it (selectTimelineEntries-based). Keep the placement map-driven — no section-id conditionals (the explore-shell.test.mjs no-id-comparison pin holds).
      4. Do NOT touch explore-status-bar.tsx / use-explore-visited.ts / explore-tour.tsx — verified order-independent (OQ-11) and their anchors resolve by stable section id.
      Run the three renewed suites GREEN + typecheck; commit atomically.
    </action>
    <verify>node --test tests/explore-tour.test.mjs tests/explore-sweep.test.mjs tests/explore-shell.test.mjs all exit 0; npm run typecheck exits 0</verify>
    <acceptance_criteria>
      - `grep -A 5 "EXPLORE_SECTIONS = \[" src/components/explore/constants.ts` shows about, skills, experience, projects in that order
      - `grep -c "md:order-first" src/components/explore/explore-panels.tsx` returns 0
      - `grep -c "EXPLORE_SECTIONS.map" src/components/explore/constants.ts` returns 0 (the positional zip generation is gone)
      - `grep -c "DIGIT_ACCENTS\[section.id\]" src/components/explore/explore-drawer.tsx` returns 1 and the Record keys are the 4 section ids
      - The tour table's content steps appear in the array in the order about, experience, skills, projects (ids), each with its own body string
      - `node --test tests/explore-tour.test.mjs` exits 0
    </acceptance_criteria>
    <done>The grid reflows by real DOM order with the drawer digits and tour content re-pinned by id; every re-mapping test is green</done>
  </task>
  <task type="test">
    <name>Task 3: the full green gate over the reflowed tree (chronologically last action of this plan)</name>
    <files>tests/explore-sweep.test.mjs</files>
    <read_first>tests/explore-sweep.test.mjs (full — confirm nothing else pins the old order), tests/explore-shell.test.mjs (the static-export blocks at lines 425-477)</read_first>
    <action>
      1. Sweep the whole tests/ directory for any remaining pin of the old order or the positional consumers (grep for 'order-first', the old id sequence, and positional accent indexes) — renew any straggler to the new contract in this task's commit.
      2. Run the FULL gate in order: npm run typecheck → npm run build → node --test over the complete tests/ directory. All green.
      3. Grep the invariants one final time: every placement utility in explore-panels.tsx is md:-scoped (375px invariant); no overflow utility added on the wrapper/shell/grid/main chain; EXPLORE_SECTIONS length still 4; the counter derivation untouched.
      4. Commit any renewal atomically (test: commit) so the green run covers the final tree state of this plan.
    </action>
    <verify>npm run typecheck && npm run build both exit 0; node --test tests/ (all files) exits 0 as the chronologically last check of this plan</verify>
    <acceptance_criteria>
      - `grep -rn "text-chart-\${i}" src/components/explore/explore-drawer.tsx` returns 0 (no positional accent indexing remains)
      - The full node --test suite over tests/ exits 0 with the reflowed tree in place
      - out/explore.html builds and its panel DOM order is About, Skills, Experience, Projects (greppable via the index chips 01/02/03/04 adjacency in the export)
      - No non-md-scoped placement utility appears in explore-panels.tsx (grep the placement values for bare h-\[300vh\] / col-span without the md: prefix — zero)
    </acceptance_criteria>
    <done>REV-14's reflow is live with every navigation flow re-mapped and the entire suite green over the final tree of this plan</done>
  </task>
</tasks>