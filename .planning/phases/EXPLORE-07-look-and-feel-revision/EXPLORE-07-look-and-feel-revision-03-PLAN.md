---
phase: EXPLORE-07-look-and-feel-revision
plan: 03
type: execute
wave: 3
depends_on: ["EXPLORE-07-look-and-feel-revision-01", "EXPLORE-07-look-and-feel-revision-02"]
files_modified:
  - "src/app/globals.css"
  - "src/components/explore/sections/projects-section.tsx"
  - "src/components/explore/sections/about-section.tsx"
  - "src/components/explore/explore-header.tsx"
  - "tests/explore-visuals.test.mjs"
autonomous: true
requirements: ["REV-11", "REV-10"]
user_setup: []
must_haves:
  truths:
    - "On first paint the four panels fade+rise in a 240ms cascade 40ms apart (translateY(8px)+opacity, backwards fill) — CSS-only, zero JS animation APIs, zero new dependencies, every declaration scoped under .explore-shell so the UNMODIFIED reduced-motion guard suppresses it to static opacity-1 panels"
    - "Linked project cards and competency cards lift 2px with an hsl-tinted shadow bloom on hover AND focus-visible (ring layers composed, not replaced); contact-row icons and the resume ArrowRight nudge 2px on row hover/focus; underlines gain group-focus-visible parity; the four header ghosts press-settle at active — and the theme toggle stays INSTANT (no transition classes)"
    - "The final gate — npm run build → npm run typecheck → node --test tests/*.mjs — is green as the chronologically LAST action on the final tree, with the suite count + delta vs the 200 baseline recorded and no writes after the last green run"
  artifacts:
    - path: "src/app/globals.css"
      provides: "The two --panel-shadow-hover token lines (OQ-A, the ONLY allowed token addition), the explore-panel-in stagger block with source-ordered delay rules (R4), and the .exp-lift/.exp-nudge vocabulary — all before the byte-stable guard tail"
      min_lines: 620
    - path: "src/components/explore/sections/about-section.tsx"
      provides: "M3 icon nudge on the 9 contact-row icons + resume arrow, M5 group-focus-visible:underline parity on both label spans"
      min_lines: 140
    - path: "tests/explore-visuals.test.mjs"
      provides: "The REV-11 falsifiability block (UI-SPEC §10.3-8): stagger pins, vocabulary targets, shadow tokens in both theme blocks, pinned curve + 200-280ms window, negative JS-animation greps"
      min_lines: 450
  key_links:
    - from: "src/app/globals.css"
      to: "src/components/explore/explore-panels.tsx"
      via: "the stagger animation targets the panel-grid class plan 02 placed on the panels container (children in DOM order)"
      pattern: "explore-panel-in"
    - from: "src/app/globals.css"
      to: "src/components/explore/sections/about-section.tsx"
      via: "the exp-nudge class on the channel icons and resume arrow is driven by the a:hover/a:focus-visible descendant rules in the vocabulary block"
      pattern: "exp-nudge"
    - from: "src/app/globals.css"
      to: "src/app/globals.css"
      via: "every new animation/transition declaration sits inside a .explore-shell-scoped selector so the existing guard (globals.css 586-599, UNMODIFIED) is the single suppression mechanism"
      pattern: ".explore-shell"
---

<objective>
Deliver REV-11: the Editorial-calm CSS-only micro-motion vocabulary (D-04) — the single entrance (panel-grid stagger) plus the hover/focus/active set (card lift+bloom, icon nudge, underline parity, header press-settle) — with every declaration inside .explore-shell so the phase-1 reduced-motion guard covers it untouched, then run the phase's final green gate chronologically last (UI-SPEC §10 item 10). This plan depends on plan 02 for the .panel-grid hook and the exp-lift class usage it animates, and on plan 01 for the audit-first ordering.

Red/green discipline inside every code task: the test pins are written and run FIRST against the unedited tree (they assert the target contract, so they record RED), then the CSS/JSX lands, then the same commands re-run GREEN — each commit stays atomic (tests + code together) so every commit is green on the tree it creates.
</objective>

<assumption_delta_decision>
- noun: n/a — same adjudication as plan 01: no identity-model transition exists in this phase; the motion vocabulary animates the EXISTING single representation of every surface.
- decision: no-change — see plan 01 for the full block.
- rationale: D-04 is a closed CSS-only vocabulary over existing elements; no new variant axis is introduced.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-UI-SPEC.md
@.planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-RESEARCH.md
@src/app/globals.css
@src/components/explore/explore-panels.tsx
@src/components/explore/sections/skills-section.tsx
@src/components/explore/sections/projects-section.tsx
@src/components/explore/sections/about-section.tsx
@src/components/explore/explore-header.tsx
@tests/explore-visuals.test.mjs
</context>

<tasks>
  <task type="auto">
    <name>Task 1 (tracer): The panel-grid stagger entrance — the ONE choreography, CSS-only (REV-11/D-04/M1, UI-SPEC §6.2)</name>
    <files>src/app/globals.css, tests/explore-visuals.test.mjs</files>
    <read_first>src/app/globals.css (lines 499-599: token blocks, guard tail), src/components/explore/explore-panels.tsx (the panel-grid container), tests/explore-visuals.test.mjs (tail), tests/explore-shell.test.mjs (guard test ~172-177), UI-SPEC §6.1, §6.2, §9.1, §10 item 3</read_first>
    <action>RED first: add a motion block to tests/explore-visuals.test.mjs asserting UI-SPEC §10.3 on the SOURCE: @keyframes explore-panel-in exists; the `.explore-shell .panel-grid > *` selector carries an animation shorthand naming explore-panel-in, 240ms, the pinned curve cubic-bezier(0.25, 1, 0.5, 1) and the backwards fill; the nth-child(2)/(3)/(4) delay rules (40ms/80ms/120ms) appear AFTER the shorthand line in source order; every new animation declaration's selector chain includes .explore-shell; the guard block's asserted selector strings (existing explore-shell.test.mjs guard test) still pass. Run `node --test tests/explore-visuals.test.mjs` and RECORD the RED (no keyframes exist yet; the panel-grid class does — plan 02 landed it). THEN implement in globals.css: insert a new block AFTER the `.light .explore-shell` token block and BEFORE the reduced-motion guard comment, exactly per UI-SPEC §6.2 — the @keyframes explore-panel-in (from opacity 0 / translateY(8px) to opacity 1 / translateY(0)), the `.explore-shell .panel-grid > *` animation shorthand `explore-panel-in 240ms cubic-bezier(0.25, 1, 0.5, 1) backwards`, then the three nth-child delay rules 40ms/80ms/120ms placed AFTER the shorthand (R4: the animation shorthand resets animation-delay — later-in-file + higher specificity is what keeps the stagger from flattening; do not reorder), plus a short comment noting the BFCache back-nav replay is cosmetic-accepted (R9). Zero JSX animation wiring, no inline styles, no JS — SSG-safe and no-JS-safe (backwards fill means content is never hidden beyond the 360ms budget). The guard block stays the byte-stable file tail — touch NOTHING in it (§0 rail; the existing guard test enforces it). Re-run to GREEN, then the build. Commit atomically: `feat(EXPLORE-07): panel-grid stagger entrance — CSS-only editorial-calm (REV-11/D-04)`.</action>
    <verify>rm -rf out && npm run build && node --test tests/explore-visuals.test.mjs tests/explore-shell.test.mjs</verify>
    <acceptance_criteria>
      - `grep -c "explore-panel-in" src/app/globals.css` ≥ 2 (keyframes + shorthand)
      - `grep -c "backwards" src/app/globals.css` ≥ 1 and the 40ms/80ms/120ms delay rules appear AFTER the animation shorthand line (line numbers ordered)
      - `grep -c "cubic-bezier(0.25, 1, 0.5, 1)" src/app/globals.css` ≥ 1 (pinned curve)
      - every new animation selector line contains `.explore-shell` (grep the new block)
      - the reduced-motion guard block is byte-unchanged (existing guard-selector test in tests/explore-shell.test.mjs stays green)
      - both suites exit 0 on the fresh export
    </acceptance_criteria>
    <done>The entrance choreography exists as pure CSS inside .explore-shell, source-ordered so the cascade actually staggers, and is proven suppressed-by-guard through the untouched guard block.</done>
  </task>
  <task type="auto">
    <name>Task 2: Hover/focus/active vocabulary + class usage + falsifiability pins (REV-11/D-04/M2-M5, U-4, U-5, OQ-A)</name>
    <files>src/app/globals.css, src/components/explore/sections/projects-section.tsx, src/components/explore/sections/about-section.tsx, src/components/explore/explore-header.tsx, tests/explore-visuals.test.mjs</files>
    <read_first>src/app/globals.css (token blocks + the plan task-1 motion block), src/components/explore/sections/projects-section.tsx (linked/unlinked card shells ~85-104), src/components/explore/sections/about-section.tsx (ROW_CLASS ~65, channel icon ~99, labels ~104, resume row ~132-139), src/components/explore/explore-header.tsx (four ghost className strings 69/80/95/106), UI-SPEC §6.2, §6.4, §6.5, §7, §10 items 4-8</read_first>
    <action>RED first: extend the motion block in tests/explore-visuals.test.mjs per UI-SPEC §10.4-8: --panel-shadow-hover defined in BOTH .explore-shell and .light .explore-shell (exact hsl values per §6.4); the .exp-lift rules (transition on transform+box-shadow 220ms with the pinned curve; :hover translateY(-2px) + the token; :focus-visible with the THREE-LAYER box-shadow composition var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--panel-shadow-hover); :active press-settle translateY(0) ordered AFTER the hover rule); .exp-nudge + the a:hover/.exp-nudge and a:focus-visible/.exp-nudge translateX(2px) rules; exp-lift present on the linked project anchor and ABSENT from the unlinked div card; exp-nudge present on the channel icons and the resume ArrowRight; group-focus-visible:underline on both label spans in about-section.tsx; active:bg-muted/80 four times in explore-header.tsx; the pinned curve string and a 220ms duration present, no duration outside 200-280ms in the new block; negative greps over src/components/explore/ for requestAnimationFrame, .animate(, framer-motion, gsap, lottie — all zero. Run `node --test tests/explore-visuals.test.mjs` and RECORD the RED (the positive pins fail; the negative greps already hold). THEN implement: (1) globals.css — append `--panel-shadow-hover: 0 6px 16px -4px hsl(220 13% 5% / 0.55);` INSIDE the .explore-shell token block and `--panel-shadow-hover: 0 6px 16px -4px hsl(220 20% 20% / 0.15);` INSIDE the .light .explore-shell block (OQ-A: the ONLY allowed addition to the token blocks; no asserted value touched); then under .explore-shell scope add the M2/M3 rules per UI-SPEC §6.2: .exp-lift transition (transform + box-shadow, 220ms, pinned curve), .exp-lift:hover (translateY(-2px) + box-shadow var(--panel-shadow-hover)), .exp-lift:focus-visible (translateY(-2px) + the three-layer ring-composed shadow — bloom rides WITH the ring, never replaces it), .exp-lift:active press-settle (translateY(0), same 220ms curve) written AFTER the hover rule in the same block (U-4/W-5: source order overrides), .exp-nudge transition + the two a-scoped trigger rules. All under .explore-shell — guard-covered, 220ms within the 200-280ms window, transform/opacity/box-shadow only. (2) projects-section.tsx: the LINKED card <a> className gains exp-lift; the UNLINKED <div> gains NOTHING (static — hover must never promise interactivity, §3.2/W-2); the existing group-hover accent colors + ring stay as-is. (3) about-section.tsx: the channel.Icon span gains exp-nudge (M3, row hover + row focus via the a-scoped rules); BOTH group-hover:underline label spans (the 9 contact labels and the Full resume label) gain group-focus-visible:underline (M5 keyboard parity; compiles on Tailwind 3.4.19 — RESEARCH §2); the resume row's ArrowRight gains exp-nudge (U-5). (4) explore-header.tsx: the four 44px ghost controls (tour / theme / drawer trigger / terminal link) each gain active:bg-muted/80 (U-4) — and NO transition class anywhere in this file (the theme swap stays INSTANT; adding one is a §0 violation). Re-run to GREEN. Commit atomically: `feat(EXPLORE-07): hover/focus/active micro-motion vocabulary (REV-11/D-04/U-4/U-5)`.</action>
    <verify>rm -rf out && npm run build && npm run typecheck && node --test tests/explore-visuals.test.mjs tests/explore-shell.test.mjs tests/explore-tour.test.mjs tests/explore-sweep.test.mjs</verify>
    <acceptance_criteria>
      - `grep -c "panel-shadow-hover" src/app/globals.css` ≥ 2 with one inside .explore-shell and one inside .light .explore-shell
      - `grep -c "exp-lift" src/components/explore/sections/projects-section.tsx` = 1 (the linked <a> only) and the unlinked div className line still reads block rounded-md border border-border p-3 with NO exp-lift
      - `grep -c "exp-nudge" src/components/explore/sections/about-section.tsx` ≥ 2 (channel icons + ArrowRight)
      - `grep -c "group-focus-visible:underline" src/components/explore/sections/about-section.tsx` ≥ 2
      - `grep -c "active:bg-muted/80" src/components/explore/explore-header.tsx` = 4 and `grep -c transition src/components/explore/explore-header.tsx` prints 0
      - negative greps (requestAnimationFrame, .animate(, framer-motion, gsap, lottie) under src/components/explore/ all print 0
      - the .exp-lift:active rule's line number is greater than the .exp-lift:hover rule's (source-ordered press-settle)
      - all suites exit 0 on the fresh export
    </acceptance_criteria>
    <done>The closed M1-M5 vocabulary is live and CSS-only: stagger (task 1), lift+bloom with keyboard parity, icon nudge with resume-arrow join, underline focus parity, header press-settle — all scoped, guard-covered, zero JS, zero new deps.</done>
  </task>
  <task type="auto">
    <name>Task 3: Final green gate — chronologically last on the final tree (UI-SPEC §10 item 10, green-gate-finality)</name>
    <files></files>
    <read_first>UI-SPEC §10 item 10, RESEARCH §6 (final gate row), .planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-SPEC.md (acceptance criteria)</read_first>
    <action>On the FINAL tree — after every plan-01/02/03 commit is in and the working tree is clean of intended changes — run the full gate IN THIS ORDER: `npm run build` (all routes export statically), then `npm run typecheck`, then `node --test tests/*.mjs` (the full suite). All three must exit 0 on this exact tree. Record the final suite count and its delta vs the 200 baseline (projects-calendar.test.mjs dropped, several blocks rewritten/added) for the phase SUMMARY — the SPEC's "200-test suite" reads as "the full suite green on the final tree" (R8). NO file writes of any kind after the last green run — any post-green write (code, docs, planning artefacts) reopens the gate and forces a re-run before any completion claim (green-gate-finality). This task commits nothing; it is the phase's closing evidence.</action>
    <verify>npm run build && npm run typecheck && node --test tests/*.mjs</verify>
    <acceptance_criteria>
      - `npm run build` exits 0 (all routes export statically, including out/explore.html)
      - `npm run typecheck` exits 0
      - `node --test tests/*.mjs` exits 0 with the full suite
      - the three runs are the chronologically last actions on the final tree (git status clean of new changes after them)
      - the final suite count + delta is recorded for the phase SUMMARY
    </acceptance_criteria>
    <done>The phase's definition of done is proven on the final tree: build + typecheck + full suite green, chronologically last, nothing written after.</done>
  </task>
</tasks>