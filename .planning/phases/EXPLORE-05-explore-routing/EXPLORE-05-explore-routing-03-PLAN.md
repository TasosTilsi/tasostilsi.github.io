---
phase: 05-explore-routing
plan: 03
type: execute
wave: 2
depends_on: ["EXPLORE-05-explore-routing-01", "EXPLORE-05-explore-routing-02"]
files_modified:
  - .planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md
  - tests/explore-sweep.test.mjs
autonomous: true
requirements: ["EXPLORE-05", "EXPLORE-05b", "EXPLORE-06"]
user_setup: []
must_haves:
  truths:
    - "A committed sweep table (EXPLORE-05-explore-routing-SWEEP.md) covers exactly 8 rows — {375, 768, 1440, 1920} × {/, /explore} — each with check-type (P programmatic / E export / M manual-visual), result, and disposition (fixed+test / deferred / manual — user final pass), per D-04 and OQ-5."
    - "Zero horizontal scroll holds structurally on both routes at all four widths: .explore-shell overflow-x-hidden (explore-shell.tsx:58) for /explore, CLI wrapper overflow-hidden + inner overflow-auto + whitespace-pre-wrap outputs for / (RESEARCH §1.8); visual-confirmation rows are marked for the user's final pass, per D-04."
    - "Every discovered defect on this phase's surfaces (header cluster, welcome line, shell/layout chrome classes) is fixed and carries a test, red-first; defects inside panels/visualizations/wizard are recorded with disposition deferred + a one-line pointer and are NOT fixed here (boundary, per D-05 and OQ-5)."
    - "All three routes still export statically (out/index.html, out/explore.html, out/resume.html) and the exported out/explore.html carries the header Terminal link (aria-label 'Open the terminal' + href '/') — the /explore → CLI leg is provable at export level (L3), and the two-way loop is asserted as a composite."
    - "The resume at /resume and the data files (src/data/**) are byte-untouched by this phase — proven by a git diff guard row recorded in the sweep table (D-05, SPEC acceptance)."
  artifacts:
    - path: .planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md
      provides: "The falsifiable 8-row breakpoint sweep table with check-type, result, and disposition columns (D-04)"
      min_lines: 40
    - path: tests/explore-sweep.test.mjs
      provides: "Type-P structural rows (grid classes, overflow guards, welcome-line fit arithmetic, intro/status-bar classes) + Type-E export rows (three routes, header-link SSR, dep-count 39) + the two-way loop composite"
      min_lines: 100
  key_links:
    - from: .planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md
      to: tests/explore-sweep.test.mjs
      via: "Every P/E row cites its implementing test — in this suite, or the owning suite from plans 01/02 for rows already covered there"
      pattern: "tests/explore-sweep\\.test\\.mjs"
    - from: src/components/explore/explore-header.tsx
      to: out/explore.html
      via: "Static export carries the header Terminal link into the exported HTML (L3, precedent tests/explore-shell.test.mjs:423-433)"
      pattern: "aria-label=\"Open the terminal\""
    - from: tests/explore-sweep.test.mjs
      to: out/
      via: "Three-route export existence precondition after npm run build (precedent tests/explore-shell.test.mjs:393-397)"
      pattern: "out/explore\\.html"
---

<objective>
Run the falsifiable breakpoint sweep (D-04, EXPLORE-06) over the now-complete routing surfaces from plans 01/02: commit the 8-row sweep table with dispositions, fix every phase-surface defect red-first, defer panel-internal ones, prove the static export and the two-way loop, and run the phase's full green gate on the final tree.
</objective>

<context>
@.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SPEC.md
@.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-CONTEXT.md
@.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-RESEARCH.md  — §1.8 sweep taxonomy (P/E/M) + defect-ownership rule (OQ-5), §1.9 pitfalls, §7 conventions; OQ-7 gate command is binding
@src/components/explore/explore-shell.tsx, @src/components/explore/explore-panels.tsx, @src/components/explore/explore-intro.tsx, @src/components/explore/explore-status-bar.tsx
@src/app/(main)/layout.tsx
@src/components/cli/outputs/WelcomeMessage.tsx, @src/components/explore/explore-header.tsx
@src/components/explore/constants.ts  — EXPLORE_TOUR_FINISH (:89, linkHref "/" at :92) for the Task 2 composite
@tests/explore-shell.test.mjs  — build-precedent (:378), export-route (:393-397) and export-marker (:423-433) precedents
@tests/explore-visuals.test.mjs  — dependency-count precedent (:622-625)
@tests/explore-routing.test.mjs, @tests/explore-header.test.mjs  — plan 01/02 suites this plan runs and builds on

Discipline: work on branch phase-5; one atomic commit per task; never push to a remote; never commit harness artefacts (.cursor/, .deepindex.db, *.pdf/png, tsconfig.tsbuildinfo, doublecheck-*.md). This plan owns the wave's single `npm run build` and the phase's full green gate (plans 01/02 do not build). Conditional fix rule: if a P/E row fails on a phase surface (welcome line, header cluster, shell/layout chrome classes in WelcomeMessage.tsx / explore-header.tsx / explore-shell.tsx / (main)/layout.tsx), the fix is red-first — the failing row IS the red record; extend the pinning test, confirm it fails, fix the source, confirm green. NEVER edit panels/visualization/wizard files or src/data/** for a defect — record it as deferred (OQ-5). Out of bounds also: MobileCommandPalette.tsx, EASTER_EGG_IDS, /resume, package.json dependencies.
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — sweep table skeleton + Type-P structural rows</name>
    <files>.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md, tests/explore-sweep.test.mjs</files>
    <read_first>.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-RESEARCH.md, src/components/explore/explore-panels.tsx, src/components/explore/explore-shell.tsx, src/components/explore/explore-intro.tsx, src/components/explore/explore-status-bar.tsx, src/app/(main)/layout.tsx, src/components/cli/outputs/WelcomeMessage.tsx, tests/explore-shell.test.mjs</read_first>
    <action>
      Create EXPLORE-05-explore-routing-SWEEP.md (D-04): a legend defining the check taxonomy — P = programmatic/static source or arithmetic check, E = export-level check after npm run build, M = manual-visual row flagged `manual — user final pass` — and the disposition rule per OQ-5: defects on this phase's surfaces → `fixed` + test; defects inside panels/visualizations/wizard → `deferred` + one-line pointer. Then the 8-row table with columns Breakpoint | Route | Check type | Check | Result | Disposition | Evidence, one row per {375, 768, 1440, 1920} × {/, /explore}, each row's Check pre-filled: /explore — 375: right-cluster math (owned by tests/explore-header.test.mjs) + panels 1-col + intro name-title two-line wrap by design + shell overflow-x-hidden + no-clipped-content visual; 768: panels 2-col (md:grid-cols-2) + About md:col-span-2 + visual; 1440: panels 3-col (lg:grid-cols-3) + visual; 1920: panels 3-col full-bleed + recharts ResponsiveContainer stretch (M — plausible ultra-wide finding, disposition rule applies). / — 375: mobile banner renders (ASCII `hidden sm:block`) + welcome link line fit arithmetic + CLI overflow invariants + visual; 768/1440/1920: ASCII banner visible + CLI overflow invariants + visual.
      Create tests/explore-sweep.test.mjs (house style) implementing the P rows not owned elsewhere, each assertion commenting its sweep row id: grid classes on explore-panels.tsx (`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3` :67, About `md:col-span-2 lg:col-span-2` :77); shell invariant `.explore-shell` with `overflow-x-hidden` (explore-shell.tsx:58); CLI layout invariants in src/app/(main)/layout.tsx (wrapper `overflow-hidden` :16, main `overflow-auto` :19) plus `whitespace-pre-wrap` on the CLI output-line rendering; welcome-link-line fit arithmetic — the rendered line is ~30 characters at inherited text-sm JetBrains/Geist Mono (~8.5px/char) against 359px content width at 375px, assert chars ≤ 42, and assert no size-class override was added to the line; status bar classes asserted as four independent tokens — `h-7`, `sm:h-8`, `text-[10px]`, `sm:text-xs` — each present in explore-status-bar.tsx:34 (the actual class string interleaves other tokens — `flex h-7 shrink-0 items-center justify-between border-t px-3 text-[10px] sm:h-8 sm:px-4 sm:text-xs` — so no contiguous token PAIR may be asserted as a substring; if this row ever fails, the status bar sits outside this phase's editable surfaces → disposition `deferred` + one-line pointer, OQ-5); intro strip `min-h-[40px]` + `md:min-h-[20px]` (explore-intro.tsx).
    </action>
    <verify>node --test tests/explore-sweep.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/explore-sweep.test.mjs` exits 0
      - SWEEP.md contains all four breakpoint values (375, 768, 1440, 1920), both routes, the strings `deferred` and `manual`, and a disposition column header
      - SWEEP.md references tests/explore-sweep.test.mjs and tests/explore-header.test.mjs as row owners
    </acceptance_criteria>
    <done>The sweep table exists with 8 pre-filled rows and the structural P rows are green.</done>
  </task>

  <task type="auto">
    <name>Task 2: Type-E export rows + two-way loop composite (single build point)</name>
    <files>tests/explore-sweep.test.mjs, .planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md</files>
    <read_first>tests/explore-sweep.test.mjs, tests/explore-shell.test.mjs, tests/explore-visuals.test.mjs, src/components/explore/constants.ts</read_first>
    <action>
      Run `npm run build` — this is the wave's single build (plans 01/02 do not build). Add export-level assertions (precedents tests/explore-shell.test.mjs:378, :393-397, :423-433): out/index.html, out/explore.html, out/resume.html all exist (all three routes still export statically — SPEC acceptance); out/explore.html contains `aria-label="Open the terminal"` and `href="/"` (the header Terminal link SSRs — Layer-3 proof of the /explore → CLI leg); out/index.html does NOT contain `System initialized` (the CLI welcome is client-only — this row documents why the welcome link and command are L2-only, RESEARCH §1.7); package.json dependencies length === 39 (D-05 zero new dependencies). Add the two-way loop composite test (EXPLORE-05 acceptance): WelcomeMessage contains `href="/explore"` AND TerminalInterface contains the navigate sentinel/`router.push` AND explore-header.tsx contains `href="/"` AND EXPLORE_TOUR_FINISH.linkHref === "/" (imported from src/components/explore/constants.ts — exported :89, linkHref at :92; NOT cli/constants.ts) — all four legs in one assertion set. Record every E row's result in SWEEP.md's Result column with the evidence (file + string found).
    </action>
    <verify>npm run build && node --test tests/explore-sweep.test.mjs</verify>
    <acceptance_criteria>
      - `npm run build` exits 0 and out/index.html, out/explore.html, out/resume.html all exist
      - `node --test tests/explore-sweep.test.mjs` exits 0
      - grep `aria-label="Open the terminal"` matches out/explore.html
      - SWEEP.md E rows all carry a Result and Evidence
    </acceptance_criteria>
    <done>Export-level proof committed: three routes export, the header link survives export, the loop is composite-asserted.</done>
  </task>

  <task type="auto">
    <name>Task 3: Defect disposition + M rows + full green gate (final tree)</name>
    <files>.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md, tests/explore-sweep.test.mjs, conditionally: src/components/cli/outputs/WelcomeMessage.tsx, src/components/explore/explore-header.tsx, src/components/explore/explore-shell.tsx, src/app/(main)/layout.tsx</files>
    <read_first>.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md, tests/explore-sweep.test.mjs, tests/explore-routing.test.mjs, tests/explore-header.test.mjs</read_first>
    <action>
      Run the whole sweep: node --test tests/explore-sweep.test.mjs, tests/explore-routing.test.mjs, tests/explore-header.test.mjs. Any failing row on a phase surface → red-first fix per the context rule (extend the pinning test, see it fail, fix the source, see it green; one atomic commit). Any defect discovered inside panels/visualizations/wizard (e.g. 1920 recharts stretch) → do NOT fix; record the row with disposition `deferred` + a one-line pointer for a later phase (OQ-5). Fill every M row with its manual-check description and mark it `manual — user final pass` per D-04 — cover at minimum: 1920 chart stretch, glyph-dot alignment at each width, truncation appearance at 375px, CLI banner/link visual at 375px, and theme + tutorial-suppression persistence across a CLI → /explore navigation (localStorage keys persist per RESEARCH §1.7). Add a guard row to SWEEP.md: /resume and src/data/** byte-untouched — verified by a git diff --name-only over the phase's commit range restricted to those paths returning empty (D-05, SPEC acceptance). Finalize the Result column for all 8 rows.
      Then the phase green gate, in this exact order on the final tree: `npm run build` → `npm run typecheck` → `node --test "tests/*.test.mjs"` (OQ-7: this exact glob form — the directory form `node --test tests/` FAILS and must never be used). All three must pass; this is the green gate whose run chronologically covers the final tree.
    </action>
    <verify>npm run build && npm run typecheck && node --test "tests/*.test.mjs"</verify>
    <acceptance_criteria>
      - `npm run build` exits 0; `npm run typecheck` exits 0; `node --test "tests/*.test.mjs"` exits 0 with 0 failures
      - every SWEEP.md row has a non-empty Result and Disposition; every `fixed` row names its pinning test; every `deferred` row names the out-of-scope surface; every M row is marked `manual — user final pass`
    </acceptance_criteria>
    <done>Sweep committed with dispositions, defects resolved per the ownership rule, and the full gate green on the final tree.</done>
  </task>
</tasks>