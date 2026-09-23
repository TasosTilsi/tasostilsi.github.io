---
phase: EXPLORE-07-look-and-feel-revision
plan: 03
subsystem: explore-motion
tags: [explore, REV-11, REV-10, D-04, editorial-calm, css-only-motion, stagger, hover-vocabulary, reduced-motion-guard]
requires:
  - ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-02-SUMMARY.md (the .panel-grid hook + exp-lift class usage this plan animates)"
  - ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-01-SUMMARY.md (chart-free tree + audit table A-01..A-20 this plan's commits close)"
  - ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-UI-SPEC.md (§6.1-§6.5, §7, §9, §10 items 3-8 — the binding motion contract)"
  - "src/app/globals.css:581-599 (pre-plan; the reduced-motion guard that must stay the byte-stable file tail)"
  - "src/components/explore/explore-tour.tsx:33-37 (R-6: never transform the tour's ancestor chain)"
provides:
  - "The closed Editorial-calm vocabulary (M1-M5) as pure CSS inside .explore-shell: explore-panel-in stagger (240ms, 40/80/120ms source-ordered delays, backwards fill), exp-lift lift+bloom with ring-composed focus parity and a source-ordered :active press-settle, exp-nudge icon/arrow trigger rules"
  - "--panel-shadow-hover defined exactly once per theme block (dark hsl bg-hue tint 0.55, light slate tint 0.15) — the only token addition (OQ-A)"
  - "Class usage landed: exp-lift on competency cards + linked project anchors only (unlinked divs static), exp-nudge on the 9 channel icons + resume ArrowRight, group-focus-visible:underline parity on both labels, active:bg-muted/80 on the four 44px header ghosts (theme swap stays instant)"
  - "REV-11 falsifiability: three new test pins in explore-visuals.test.mjs (stagger contract, vocabulary contract, compiled-CSS-ship export pin) with negative JS-animation greps and a frozen tour-rAF baseline"
affects:
  - "EXPLORE-07 verify step (motion feel / 375px / entrance-timing manual pass; audit table confirmation for A-07..A-10)"
tech-stack: [next, react, tailwindcss, node-test, css]
key_files:
  created: []
  modified:
    - "src/app/globals.css"
    - "src/components/explore/sections/projects-section.tsx"
    - "src/components/explore/sections/about-section.tsx"
    - "src/components/explore/explore-header.tsx"
    - "tests/explore-visuals.test.mjs"
decisions:
  - "D-04 honored as a closed set: ONE entrance (panel-grid stagger, keyframes + shorthand + nth-child delays in exact UI-SPEC §6.2 order) + the M2/M3 vocabulary; M4 stays instant-by-design; M5 adds group-focus-visible:underline parity; PanelShell chrome never lifts (§17.6); intro strip stays typewriter-only (U-2)"
  - "OQ-A honored verbatim: --panel-shadow-hover appended INSIDE .explore-shell and .light .explore-shell (globals.css:534/585) — the only token-block addition, no asserted value touched; guard block byte-untouched at the file tail (659-line file, guard now 646-659)"
  - "U-4/W-5: the .exp-lift:active press-settle (translateY(0)) is source-ordered AFTER the :hover rule (631 > 617) — source order overrides while pressed, same 220ms curve from the base rule; the dead active:translate-y-0 utility is not used"
  - "U-5: the resume row's ArrowRight joins M3; FileText does not (closed vocabulary — nothing else animates)"
  - "active:bg-muted/80 appended at the END of each header className so the explore-header suite's byte-identical GHOST_44 ×4 substring pin survives; the theme swap keeps zero transition utilities (raw grep = 0 after the comment reword)"
  - "DEV-1 (plan deviation, recorded): the plan's negative-grep acceptance 'requestAnimationFrame prints 0 under src/components/explore/' is unsatisfiable — explore-tour.tsx carries the PRE-EXISTING phase-6 double-rAF spotlight measurement (W-1/W-2, last touched cc30b09, untouched here; RESEARCH §2's zero-claim was wrong). The invariant REV-11 needs (no NEW JS animation APIs) is enforced instead: full ban on .animate(/framer-motion/gsap/lottie across all explore files, rAF banned in every explore file EXCEPT the tour, whose baseline is frozen at 5 requestAnimationFrame / 3 cancelAnimationFrame by count pins"
  - "DEV-2 (recorded): prose comments naming literal class tokens broke exact-count acceptance greps (exp-lift 2≠1, active:bg-muted/80 5≠4) — reworded the comments in projects-section/about-section/explore-header to reference the devices without the literal class strings where the acceptance demands exact counts; where the acceptance is ≥N (exp-nudge, group-focus-visible:underline) the prose mention stands and the count clears the contract (3 ≥ 2)"
  - "DEV-3 (recorded): the M5 pin asserts the parity FORM (≥2 lines carrying BOTH group-hover:underline and group-focus-visible:underline) — stronger than a bare ≥2 substring count and matching the acceptance's ≥2 shape"
metrics:
  duration: "~18 min (2 code tasks + final gate; 2 commits, task 3 commits nothing by design)"
  completed: "2026-09-24T01:20:00+03:00"
  baseline_tests: 200
  final_tests: 180
  suite_delta: "-20 vs the 200 baseline (plan-01 −24, plan-02 +1, this plan +3: stagger pin, vocabulary pin, export-stylesheet ship pin); '200-test suite' acceptance read as 'the full suite green on the final tree' per UI-SPEC §2.2/R8"
status: complete
actuals:
  tasks: 3
  commits: 2
  tokens: "~95k"
---

# Phase EXPLORE-07 Plan 03: Editorial-Calm CSS-Only Micro-Motion Vocabulary Summary

**One-liner:** REV-11 shipped as a closed CSS-only Editorial-calm set — the single panel-grid stagger entrance (240ms, 40/80/120ms source-ordered, backwards fill), lift+bloom with ring-composed keyboard parity, icon nudge, underline focus parity, and header press-settle, every declaration scoped under .explore-shell with the reduced-motion guard byte-untouched at the file tail — then the full green gate (build → typecheck → 180/180) ran as the chronologically last action.

## What shipped (per task)

- **Task 1 — `92a966d` (M1 stagger, audit A-09):** RED recorded first (20 pass / 1 fail — the new stagger pin) against the unedited tree, then the `@keyframes explore-panel-in` block + the `.explore-shell .panel-grid > *` shorthand (`explore-panel-in 240ms cubic-bezier(0.25, 1, 0.5, 1) backwards`) + the three nth-child delay rules landed in globals.css AFTER the `.light .explore-shell` token block and BEFORE the guard comment — delay rules at 598-600 following the shorthand at 593 (R4: the animation shorthand resets animation-delay; later-in-file + higher specificity keeps the cascade from flattening), with the BFCache replay note (R9) as a comment. Zero JSX wiring, zero JS, SSG-safe; total budget 240ms + 120ms delay = 360ms < the 500ms skill cap.
- **Task 2 — `7b7a214` (M2-M5 + U-4/U-5/OQ-A, audit A-07/A-08/A-10):** RED recorded first (21 pass / 2 fail — the vocabulary pin + the export-ship pin). Then: both `--panel-shadow-hover` token lines (OQ-A) inside the two theme blocks; the `.exp-lift` transition/hover/focus-visible/active set (220ms pinned curve, three-layer ring-composed focus shadow, :active source-ordered after :hover); `.exp-nudge` + the a:hover/a:focus-visible trigger rules; class usage — linked project anchor gains `exp-lift` (unlinked div byte-identical static shell), channel icons + resume ArrowRight gain `exp-nudge`, both labels gain `group-focus-visible:underline` (M5 parity, Tailwind 3.4.19 compiles it), the four 44px header ghosts gain `active:bg-muted/80` (appended at className end so the GHOST_44 byte-identical pin survives); stale prose updated in all three section files (R11). Negative greps extended with the tour-rAF baseline freeze (DEV-1). GREEN 22/23 → fresh build → 111/111 across the four affected suites.
- **Task 3 — no commit (closing evidence):** the full gate `npm run build` → `npm run typecheck` → `node --test tests/*.mjs` ran green on the final tree (180/180; delta −20 vs the 200 baseline recorded in the frontmatter), then the SUMMARY was written and the gate re-ran as the chronologically last action (green-gate-finality; §10 item 10).

## Verification evidence

| Gate | Result |
|---|---|
| Task-1 RED (test-first) | 20 pass / 1 fail — the stagger pin, against the unedited tree |
| Task-1 GREEN | 21/21 → fresh build + visuals+shell suites → 51/51 |
| Task-2 RED (test-first) | 21 pass / 2 fail — the vocabulary pin + the export-ship pin, against the task-1 tree |
| Task-2 GREEN | build ✓ + typecheck ✓ + four suites → 111/111 |
| Full gate run 1 (pre-SUMMARY) | `npm run build` ✓ (all routes static) → `npm run typecheck` ✓ → `node --test tests/*.mjs` **180/180** |
| Full gate run 2 (post-SUMMARY, anchoring) | build ✓ → typecheck ✓ → **180/180** — chronologically last action on the final tree |
| Acceptance greps | explore-panel-in ×2 · backwards ×2 · curve ×1 (task 1); panel-shadow-hover ×4 (declarations at 534/585 — one per theme block) · exp-lift(projects)=1 · exp-nudge(about)=3 ≥2 · gfv:underline(about)=3 ≥2 · active=4/transition=0 (header) · :active(631) > :hover(617) |
| Export pin (fresh build) | the compiled CSS chunk ships explore-panel-in + panel-grid + panel-shadow-hover + exp-lift + exp-nudge (the hashed CSS chunk read from out/_next/static/css/) |

## TDD Gate Compliance

Plan type is `execute` (not `tdd`), so no `test:`/`feat:` split is required and the tdd_audit ship gate does not apply. The plan's own red/green discipline was enforced inside both code tasks: the test pins were written and run FIRST against the unedited trees (RED runs recorded above with exact counts: 20/1 and 21/2), then the implementation landed, then the same commands ran GREEN — each commit carries tests + code together, so every commit is green on the tree it creates.

## Known Stubs

None. Stub scan (`TODO|FIXME|placeholder|\.skip`) over the changed surface (globals.css, the three section/header files, tests/explore-visuals.test.mjs) returns zero hits. No skipped tests, no debug artefacts.

## Threat Flags

None. No new external surface: the vocabulary touches only class names and CSS — outbound links keep `target="_blank" rel="noopener noreferrer"` untouched; zero new dependencies (38 keys unchanged, pinned by test); zero JS animation APIs (negative greps on record, tour rAF frozen at its pre-existing baseline); the reduced-motion guard block is byte-untouched and remains the file's last block (659-line file, guard 646-659) — every new animation/transition declaration is scoped under `.explore-shell` and suppressed by it under prefers-reduced-motion (hover states still apply instantly, matching the phase-3 precedent, UI-SPEC §9.1).

## Deviations & notes

- **DEV-1 (plan deviation, recorded):** the negative-grep acceptance (`requestAnimationFrame … all print 0` under src/components/explore/) was unsatisfiable as written — `explore-tour.tsx` carries the pre-existing phase-6 (`cc30b09`) double-rAF spotlight measurement (W-1/W-2 pins; layout timing, not animation). RESEARCH §2's "zero requestAnimationFrame" claim was wrong against the real tree. Resolution: the full ban holds for `.animate(`/framer-motion/gsap/lottie across all explore files and for `requestAnimationFrame` in every explore file EXCEPT the tour, whose baseline is frozen at 5 requestAnimationFrame / 3 cancelAnimationFrame by count pins — any NEW JS animation usage trips the suite. This preserves the invariant REV-11 actually needs (no NEW JS animation APIs).
- **DEV-2 (recorded):** acceptance greps demanding exact counts collided with my first comment drafts naming the literal class tokens (exp-lift 2≠1, active:bg-muted/80 5≠4) — the comments were reworded to describe the devices without the literal strings; where the acceptance is ≥N (exp-nudge, group-focus-visible:underline) the prose mention stands and the count clears the contract.
- **DEV-3 (recorded):** the M5 pin asserts the parity form (≥2 lines carrying BOTH underline classes) rather than a raw substring count — stronger and matching the acceptance's ≥2 shape.
- Audit rows A-07/A-08/A-09/A-10 were pre-committed in `EXPLORE-07-AUDIT.md` with final dispositions, fix loci (EXPLORE-07-03) and test linkage — this plan's commits fulfil them; no audit-file edit was required (consistent with plan-02's DEV-2: the table update belongs to the verify step if it wants commit hashes folded in).
- Suite count 177 → 180 (+3: stagger pin, vocabulary pin, export-ship pin); cumulative phase delta 200 → 180 (−20) recorded per UI-SPEC §2.2/R8.
- Green-gate-finality: the gate ran twice — run 1 to produce the numbers, then the SUMMARY write, then run 2 as the chronologically last action anchoring green on the exact final tree.

## Self-Check: PASSED

- Modified files all exist and carry the target contract: `globals.css` (659 lines ≥ 620; entrance block + both shadow tokens + vocabulary, guard still the tail), `projects-section.tsx` (exp-lift on the linked anchor only), `about-section.tsx` (148 lines ≥ 140; nudge + parity), `explore-header.tsx` (4× active:bg-muted/80, 0 transitions), `tests/explore-visuals.test.mjs` (705 lines ≥ 450; three new motion tests) ✓.
- Commits on `phase-7`: `92a966d` (task 1, exactly its two files) → `7b7a214` (task 2, exactly its five files); task 3 commits nothing by design ✓.
- Full gate green twice on the final tree (180/180; build + typecheck + suite), the second run chronologically last with no writes after it ✓.

---

*Executed 2026-09-24 · plan EXPLORE-07-look-and-feel-revision-03 · wave 3 (final) of the phase-7 loop*