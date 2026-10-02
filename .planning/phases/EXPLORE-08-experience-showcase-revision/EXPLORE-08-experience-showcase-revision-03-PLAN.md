---
phase: 08-experience-showcase-revision
plan: 03
type: execute
wave: 3
depends_on: ["EXPLORE-08-experience-showcase-revision-02"]
files_modified:
  - tests/explore-visuals.test.mjs
  - tests/explore-sweep.test.mjs
autonomous: true
requirements: ["REV-07", "REV-12", "REV-13"]
user_setup: []
must_haves:
  truths:
    - "Source invariants hold and are test-pinned: the section id lives ONLY on the sticky stage (the wrapper carries none), no wheel/touch listeners exist anywhere in the hook or stage, listeners/observers/rAF cleanup tokens are present, the reduced-motion branch is a per-pass read with no media listener, and the reduced-motion + md-gate media queries are greppable in the hook"
    - "Export-level rows pin the §9 contract against out/explore.html with DATA-DERIVED expectations: role 1's title/company/duration/location/first bullet as real text, layers 2-3 visibility:hidden, the group/controls/arc-path/counter markup present, ≥6 opacity-0 marker elements"
    - "The complete gate — npm run typecheck + npm run build + every tests/*.mjs — passes on the FINAL tree as the chronologically last action of the phase (green-gate finality)"
  artifacts:
    - path: "tests/explore-visuals.test.mjs"
      provides: "The phase-8 source-invariant block: R-3 id placement, no-hijack greps, cleanup tokens, RM per-pass read, md gate with cleanup, marker non-interactivity, aria contract"
      min_lines: 720
      exports: []
    - path: "tests/explore-sweep.test.mjs"
      provides: "The phase-8 Type-E export rows: data-derived role-1 text, hidden layers, stage anatomy markers, arc path — in the established Type-E home"
      min_lines: 270
      exports: []
  key_links:
    - from: "tests/explore-sweep.test.mjs"
      to: "out/explore.html"
      via: "Type-E export rows read the built artifact (build must precede the run — established sweep convention)"
      pattern: "out/explore.html"
    - from: "tests/explore-visuals.test.mjs"
      to: "src/components/explore/use-timeline-progress.ts"
      via: "the no-hijack/cleanup/RM invariants are greps over the hook's real source"
      pattern: "use-timeline-progress"
    - from: "tests/explore-sweep.test.mjs"
      to: "src/data/portfolio-main-data.json"
      via: "export expectations derived from the real JSON at test time, never copied literals (house precedent)"
      pattern: "portfolio-main-data.json"
---

<objective>
Falsifiability hardening for the finished phase: pin the interaction-quality and no-hijack contracts as permanent source invariants, pin the SSR/export contract as data-derived Type-E rows, and close the phase with the complete green gate (typecheck + build + the entire test suite) as the chronologically last action. This plan writes tests and runs gates only — no implementation edits — so the delivered tree is proven, not assumed.
</objective>

<assumption_delta_decision>
- Noun now primary: the **timelineProgress derivation + the isTechRelated role selection** (see plan 01).
- Decision: **promote** — the invariant rows in this plan verify the promotion held: every variant (scroll, keyboard, buttons, reduced-motion, compact mobile, no-JS export) round-trips through the one derivation/one-DOM design, and nothing ships alongside the primary representation.
- Rationale: these tests are the promotion's enforcement layer — a regression to a parallel rail or a second scroll source fails the suite.
- Companion invariant: the export rows read role 1's content from the real JSON (the primary data path), proving the compact list, the stage, and the export are all fed by the same selection.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-08-experience-showcase-revision/EXPLORE-08-experience-showcase-revision-UI-SPEC.md — §2.4 (markers non-interactive, no aria-current), §4 (controls), §5 (keyboard), §7 (RM rows), §9 (SSR/export), §10 (a11y), §12 (edge matrix), §13 (new-tests list: "integration greps for R-3… and §5 key handling; SSR-export role-1 grep")
@tests/explore-visuals.test.mjs — the suite the invariant block joins (follow its codeOf/doc-stripping convention at :167-168)
@tests/explore-sweep.test.mjs — the suite the Type-E rows join (follow its Type-E convention: build first, E-row comments)
@src/components/explore/use-timeline-progress.ts, @src/components/explore/sections/experience-section.tsx, @src/components/explore/explore-panels.tsx, @src/components/explore/timeline-geometry.ts — the invariant targets
@src/data/portfolio-main-data.json — the data-derived export expectations
</context>

<tasks>
  <task type="test">
    <name>Task 1: source-invariant block — R-3 placement, no-hijack, cleanup, RM/md-gate, a11y greps</name>
    <files>tests/explore-visuals.test.mjs</files>
    <read_first>UI-SPEC §2.4/§4/§5/§7/§10/§12, tests/explore-visuals.test.mjs (codeOf convention), src/components/explore/use-timeline-progress.ts, src/components/explore/sections/experience-section.tsx, src/components/explore/explore-panels.tsx</read_first>
    <action>
      Append a "Phase EXPLORE-08 invariants" block to tests/explore-visuals.test.mjs in the house style (doc-comment stripping via codeOf — greps judge code, not prose). These rows assert the DELIVERED contract and are expected green immediately; any failure is a REAL defect — fix the source honouring the UI-SPEC rails, never weaken the assertion. Rows:
      1. R-3 id placement: explore-panels.tsx contains no `<div` carrying an id attribute (regex `/<div[^>]*\bid=/` absent) — the wrapper is anonymous; the section id flows from PanelShell's id={section.id} (grep "id={section.id}" present).
      2. No-hijack (D-02/R-5): use-timeline-progress.ts AND experience-section.tsx contain none of "wheel", "touchmove", "touchstart"; the hook contains no "document.addEventListener" and no "window.addEventListener" (listeners attach to the main element / body root / stage refs only).
      3. Cleanup (E-7): the hook contains removeEventListener (≥ 2 occurrences), "disconnect()", and "cancelAnimationFrame".
      4. RM per-pass (E-13): the hook contains exactly ONE occurrence of "prefers-reduced-motion" (the per-derivation-pass read) and attaches NO change listener to the reduced-motion query (assert the only addEventListener('change' is preceded by the min-width media query in the source).
      5. Md gate (§8 B-1): the hook contains "min-width: 768px" with an addEventListener('change') AND the corresponding removeEventListener.
      6. Marker/a11y contract (§2.4/§4/§10): experience-section.tsx contains no "aria-current" (emphasis is visual; the live region announces state), no "tabIndex" (no tabindex additions), no "cursor-pointer"; "hover:" occurs EXACTLY twice (both on the Prev/Next control buttons per §4); 'aria-live="polite"' present; the counter idiom "padStart(2, '0')} /" present.
      7. Geometry provenance (REV-07): timeline-geometry.ts contains "Math.cos" and "Math.sin" and no hardcoded per-marker position literal (assert no three-or-more-digit px literal inside a translate string in the module).
      Run the suite — expected green; if red, the defect is in the delivered source and must be fixed there (no assertion weakening).
    </action>
    <verify>node --test tests/explore-visuals.test.mjs</verify>
    <acceptance_criteria>
      - the new block contains ≥ 6 tests covering rows 1-7 (grep the file for "R-3", "wheel", "cancelAnimationFrame", "prefers-reduced-motion", "min-width: 768px", "aria-current")
      - `node --test tests/explore-visuals.test.mjs` exits 0
    </acceptance_criteria>
    <done>The phase's interaction-quality contracts are permanently enforced by the suite, not by plan prose.</done>
  </task>

  <task type="test">
    <name>Task 2: Type-E export rows — data-derived role-1 text + hidden layers + stage anatomy</name>
    <files>tests/explore-sweep.test.mjs</files>
    <read_first>UI-SPEC §9, tests/explore-sweep.test.mjs (Type-E block convention + E-1…E-5), src/data/portfolio-main-data.json</read_first>
    <action>
      Append Phase-EXPLORE-08 Type-E rows to tests/explore-sweep.test.mjs (build-first convention — npm run build must precede the run; comment each row's grounding):
      1. E-row role-1 real text (D-07/§9): load the first isTechRelated entry from src/data/portfolio-main-data.json at test time; assert out/explore.html contains entry.title, entry.company, entry.duration, entry.location, and entry.responsibilities[0] — ALL data-derived, zero copied literals.
      2. E-row hidden layers (§9): count of "visibility:hidden" in out/explore.html ≥ 2 (layers 2-3 SSR-hidden; layer 1 visible).
      3. E-row stage anatomy (§9/§4): out/explore.html contains 'aria-label="Career timeline"', "Previous role", "Next role", the counter text "01 / 03", and the arc path 'd="M 100 0 A 100 100 0 0 0 100 200"'.
      4. E-row pre-JS markers (§9): count of "opacity:0" in out/explore.html ≥ 6 (3 marker dots + 3 marker labels rendered but unpositioned pre-measurement) — pin the inline-opacity-0 mechanism plan 02 specified.
      Run npm run build then the suite — expected green; a failure is a real export-contract defect in plan 02's delivered source.
    </action>
    <verify>npm run build && node --test tests/explore-sweep.test.mjs</verify>
    <acceptance_criteria>
      - the new rows read src/data/portfolio-main-data.json at test time (grep the file for "portfolio-main-data.json")
      - `npm run build` exits 0 and `node --test tests/explore-sweep.test.mjs` exits 0
    </acceptance_criteria>
    <done>The static export contract is enforced with data-derived assertions in the established Type-E home.</done>
  </task>

  <task type="auto">
    <name>Task 3: complete green gate on the final tree (chronologically last)</name>
    <files>none — gate run only</files>
    <read_first>the user's green-gate-finality constraint: the complete gate is the last action before any completion claim and must cover the final workspace state</read_first>
    <action>
      Run the COMPLETE gate as the phase's final action, in this order, with no file edits after it starts: (1) npm run typecheck; (2) npm run build; (3) node --test over EVERY file matching tests/*.test.mjs (all ten suites — explore-visuals, explore-visuals-server, explore-visuals-skills, explore-shell, explore-sweep, explore-tour, explore-header, explore-routing, portfolio-data-integrity, resume-docx-order — plus tests/explore-timeline.test.mjs from plan 01). Every suite must exit 0. If anything is red: fix the owning source honouring the D-NN/UI-SPEC rails, then rerun the COMPLETE gate from step 1 (a fix reopens the gate — the last green run must cover the final tree). Record the run outputs as the phase's green evidence. No documentation or planning writes after this run — any post-gate write reopens it.
    </action>
    <verify>npm run typecheck && npm run build && for f in tests/*.test.mjs; do node --test "$f" || exit 1; done</verify>
    <acceptance_criteria>
      - npm run typecheck exits 0
      - npm run build exits 0
      - every tests/*.test.mjs run exits 0 (all ten-plus suites green in one final sequence)
      - no file is modified after the final green run (finality)
    </acceptance_criteria>
    <done>The complete gate is green on the final tree — the phase's completion claim anchors on this run.</done>
  </task>
</tasks>
</content>