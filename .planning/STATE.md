---
gsd_state_version: 1
milestone: v1.0
milestone_name: "Explore Visual Landing"
status: execute
active_phase: 13
next_action: execute-phase
next_phases: [13]
progress:
  total_phases: 12
  completed_phases: 1
  total_plans: 4
  completed_plans: 44
  percent: 8
current_phase: 13
current_phase_name: mobile-parity-revision
current_plan: 3
last_updated: "2026-10-05T09:42:09.325Z"
state_head: null
last_activity: 2026-10-05
stopped_at: "Phase 12 shipped — PR #12"
paused_at: null
---
# GSD STATE

## Current Position

_No active phase._

## Accumulated Context

### Recent Decisions
- Phase 1: SPEC.md sealed (ambiguity 0.145)
- Phase 1: CONTEXT.md sealed — 10 decisions
- Phase 1: planned — 2 plan(s) across 2 wave(s).
- Phase 2: SPEC.md sealed (ambiguity 0.182)
- Phase 2: CONTEXT.md sealed — 8 decisions
- Phase 2: planned — 2 plan(s) across 2 wave(s).
- Phase 2: plan 01 executed — 3 tasks committed (PanelShell chrome + data spine, About/Contact/Experience bodies, TerminalPointer); full gate green (typecheck + build + 29 assertions).
- Phase 2: plan 02 executed — 3 tasks committed (Projects body top-6, Skills body 36 grouped chips, total registry + transitional-body removal); full phase acceptance sweep green (typecheck + build + all UI-SPEC §15 verifier hooks, humor/pending counts 0).
- Phase 3: SPEC.md sealed (ambiguity 0.169)
- Phase 3: CONTEXT.md sealed — 7 decisions
- Phase 3: planned — 4 plan(s) across 3 wave(s).
- Phase 3: SPEC.md sealed (ambiguity 0.199)
- Phase 3: SPEC.md sealed (ambiguity 0.147)
- Phase 3: CONTEXT.md sealed — 8 decisions
- Phase 3: planned — 4 plan(s) across 3 wave(s).
- Phase 4: SPEC.md sealed (ambiguity 0.199)
- Phase 4: CONTEXT.md sealed — 7 decisions
- Phase 4: planned — 2 plan(s) across 2 wave(s).
- Phase 5: SPEC.md sealed (ambiguity 0.206)
- Phase 5: SPEC.md sealed (ambiguity 0.155)
- Phase 5: CONTEXT.md sealed — 5 decisions
- Phase 5: planned — 3 plan(s) across 2 wave(s).
- Phase 6: SPEC.md sealed (ambiguity 0.182)
- Phase 6: CONTEXT.md sealed — 9 decisions
- Phase 6: planned — 4 plan(s) across 3 wave(s); checker issues remain after 3 iterations (manual review).
- Phase 7: SPEC.md sealed (ambiguity 0.197)
- Phase 7: CONTEXT.md sealed — 5 decisions
- Phase 7: planned — 3 plan(s) across 3 wave(s).
- Phase 7: plan 01 executed — 3 tasks committed (audit-first table 0a06623 → calendar removal daba677 → career-span removal + non-chart showcase d3c587d); full gate green (build + typecheck + 176/176); suite delta 200→176 recorded in SUMMARY.
- Phase 8: SPEC.md sealed (ambiguity 0.215)
- Phase 8: SPEC.md sealed (ambiguity 0.181)
- Phase 8: CONTEXT.md sealed — 7 decisions
- Phase 8: planned — 3 plan(s) across 3 wave(s).
- Phase 8: plan 01 executed — 3 tasks committed (RED contract suite + stub 2af7f88 → derivation math GREEN 357989a → edge-hardening E-1/E-2/E-4 6ce577c); suite delta 180→199, typecheck + full suite green; pure module timeline-geometry.ts (15 exports, zero runtime imports) is the phase's single derivation site for plans 02/03.
- Phase 8: plan 02 executed — 2 commits (stage composition + scroll-channel hook + atomic test renewal 89e014d → interaction-contract verify pass 175dcab); Task 3 verification-only; suite delta 199→201, typecheck + build + full suite green; the full-width pinned stage renders Chubb real text in out/explore.html (§9 contract), grid rebalanced [EXP]/[About|Skills]/[Projects], hook drives markers/layers from one progress value; deviations DEV-1…DEV-8 recorded in the plan-02 SUMMARY.
- Phase 8: plan 03 executed — 2 test commits (source-invariant block dd9117c: R-3 id placement, D-02 no-hijack greps, E-7 cleanup tokens, E-13 single RM read + B-1 md gate, marker a11y contract, REV-07 geometry provenance → data-derived Type-E export rows 6f61103: role-1 real text, hidden layers, stage anatomy, pre-JS opacity-0 markers); Task 3 = the complete green gate as the chronologically last action; suite delta 201→212 assertions, all 11 suites green; deviations DEV-1…DEV-4 recorded in the plan-03 SUMMARY.
- quick 2026-09-24-motion-engine-prototype: Create a throwaway engine-comparison prototype page at src/app/motion-demo/page.tsx on the current branch (phase-8) and install framer-motion as a TEMPORARY dependency for the comparison. Purpose: let the user visually decide between two animation engines for an upcoming scroll-driven editorial content transition (outgoing content translateY up + fade, incoming enters from below + fade, both temporarily coexisting — continuous scroll-linked interpolation, no discrete state swaps).
- quick 2026-09-24-motion-demo-decision-applied: The user picked the engine: framer-motion for the upcoming editorial compositions (projects scroll + About enhancements), while the Experience semicircular timeline keeps its existing hand-rolled rAF hook (phase-8 system stays as-is). Apply the decision and clean up the scratch prototype:
- Phase 9: SPEC.md sealed (ambiguity 0.207)
- Phase 9: SPEC.md sealed (ambiguity 0.191)
- Phase 9: CONTEXT.md sealed — 5 decisions
- Phase 9: planned — 4 plan(s) across 3 wave(s).
- quick 2026-09-24-arc-present-first-order: Flip the semicircular arc's entry order to present-first (user directive: "the experience must be shown from the present to the past"). Current state: the phase-9 arc derivation in src/components/explore/viz-data.ts (or the entries derivation module) sorts the 5 entries year-ASCENDING (BEng 2012 → Netcompany 2019 → MSc 2021 → Upstream 2022 → Chubb 2023). Flip to year-DESCENDING: Chubb 2023 first (the arc's focal point at rest), then Upstream 2022, MSc 2021, Netcompany 2019, BEng 2012 last.
- Phase 10: SPEC.md sealed (ambiguity UNAVAILABLE)
- Phase 10: CONTEXT.md sealed — 6 decisions
- Phase 10: planned — 3 plan(s) across 3 wave(s); checker issues remain after 3 iterations (manual review).
- Phase 10: plan 01 executed — RED test contract (380a200) → visibility-test correction for clamped carouselProgress (cdcf988) → GREEN pure projects-card-state.ts module (e936b20); node --test 19/19 pass, typecheck clean; the pure module becomes the single derivation site for plans 02/03.
- quick 2026-09-25-projects-swipe-loop-stack: Rework the Projects stacked-card carousel interaction from scroll-driven to Tinder-style swipe (user directive after live review: "do not make it scrollable this time for the projects — make it like the Tinder cards that the user has to swipe right or left, the project cards more centered in the div, loopable — the front swipe goes to the back of the stack — and it must also show the shadows from behind the first card").
- quick 2026-09-25-uom-track-honest-copy: Fix the 'Uom Track' project entry in src/data/portfolio-main-data.json (projects[5]) per the user's clarification: it is a frontend course exercise for the Web & Mobile Development course at the University of Macedonia, NOT a product/serious project. Keep it in the top-6 stack (user chose "Fix copy, keep in stack").
- Phase 11: SPEC.md sealed (ambiguity UNAVAILABLE)
- Phase 11: CONTEXT.md sealed — 5 decisions
- Phase 11: planned — 2 plan(s) across 2 wave(s).
- Phase 11: plan 01 executed — RED acceptance suite `tests/credentials-panel.test.mjs` on record first (9745193, 15 assertion failures for absent behaviour), then GREEN typed featured flag + 5-section re-map + 3-tab CredentialsSection beside Projects (08333e3); typecheck + build + `node --test tests/credentials-panel.test.mjs` 19/19 on record. Six pre-existing suites are knowingly RED (explore-shell, explore-tour, explore-sweep, explore-visuals, explore-visuals-skills, portfolio-data-integrity) — plan 02 renews them; MERGE HOLD until plan 02's full-suite run is on record.
- Phase 10: planned — 6 plan(s) across 3 wave(s); checker issues remain after 3 iterations (manual review).
- Phase 10: planned — 8 plan(s) across 7 wave(s).
- quick 2026-10-02-credentials-bar-navigation: Rework the Credentials panel's tab list (in src/components/explore/sections/credentials-section.tsx) from the shadcn muted-pill TabsList into a floating-capsule bar navigation, per the user's brief (icon-above-label bottom-nav pattern adapted inside the panel). KEEP the Radix Tabs primitives (Tabs/TabsTrigger/TabsContent) — only className/content styling changes, so the keyboard pattern (arrow keys), aria-selected, and tab semantics are preserved free.
- quick 2026-10-02-stack-center-and-overflow: Fix two user-reported defects on the Projects swipe stack (http://localhost:3000/explore, static export; files: src/components/explore/sections/projects-stack-stage.tsx, src/components/explore/sections/projects-mobile-stack.tsx, src/components/explore/explore-panels.tsx, stale tests as needed):
- Phase 12: SPEC.md sealed (ambiguity 0.133)
- Phase 12: CONTEXT.md sealed — 4 decisions
- Phase 12: planned — 3 plan(s) across 3 wave(s); checker issues remain after 3 iterations (manual review).
- Phase 12: plan 01 executed — RED acceptance suite `tests/route-swap.test.mjs` on record first (833a7d6, 13 of 14 rows failing for absent behaviour: CLI still at `/`, no `out/cli.html`, `out/explore.*` present, stale `/explore` route literals, no chip), then the atomic route swap (0bacb6a: `/` = the explore landing on a `(home)` route group, `/cli` = the CLI terminal, `/explore` deleted outright, the landing declares its own Open Graph/Twitter branding, and all six cross-surface links rewired — including the declared 6th site `not-found.tsx` "Return to Terminal") and the status-bar `cli` new-tab chip (690ca67, `rel="noopener noreferrer"`, inset ring, no new CSS); `npm run typecheck` + `npm run build` + the suite 14/14 green on record, `out/*.html`/`out/*.txt` free of `/explore`, exactly one accepted chunk hit (the drawer's `~/explore`). Seven pre-existing suites are knowingly RED (explore-shell 10, explore-sweep 9, explore-visuals 6, explore-routing 4, credentials-panel 4, explore-tour 3, explore-header 2 = 38 of 289) — plan 02 renews them; MERGE HOLD until plan 02's full-suite run is on record.
- Phase 12: plan 02 executed — the stale-test renewal in three atomic commits: the four export-reader suites repathed to `out/index.html` (`out/cli.html` for the "other surface" rows) with titles + assertion messages renewed (386a55f, 128/128 on record), the three route-target suites renewed with both checker BLOCKERs closed and the two-way composite expanded from four to **six legs** (7fbe829 — CLI welcome/`explore` command → `/`, header Terminal link/finish card/status-bar chip/404 → `/cli`, both directions in ONE test), then the comment-only route-prose sweep over five `src` files (64c263c). Two traps closed: the silent `.filter(existsSync)` no-op now has an explicit landing-page existence assertion, and E-1 carries the `!existsSync(out/cli/index.html)` trailingSlash tripwire. **MERGE HOLD LIFTED** — `npm run typecheck` + `npm run build` + `node --test tests/*.test.mjs` = 0/0/0 with **289/289 tests across 14 files** on record as the chronologically last action on the code range; the 38 plan-01 failures are all renewed. Accepted debt with pointers: `src/app/globals.css:496`'s stale route prose (UI-SPEC §9 / RESEARCH §9.1-9.2 forbid editing that file — byte-untouched) and the drawer's `~/explore` SheetTitle (the single permitted residue hit). Remote-write hold stands: no push, no PR, no deploy.
- quick 2026-10-02-single-scrollbar-invariant: Eliminate the 3-scrollbar state on the landing page (/, the explore experience) so exactly ONE scroll container exists: <main>. User-report: 3 scrollbars visible. Root causes identified in source:
- Phase 12: LEARNINGS.md extracted (decisions: 4, lessons: 8, patterns: 9, surprises: 10)
- Milestone Explore Visual Landing: AUDIT.md written (status not-ready)
- Milestone Explore Visual Landing: AUDIT.md written (status not-ready)
- Phase 12 shipped — PR #12 (https://github.com/TasosTilsi/tasostilsi.github.io/pull/12)
- Milestone Explore Visual Landing: AUDIT.md written (status not-ready)
- Phase 13: SPEC.md sealed (ambiguity UNAVAILABLE)
- Phase 13: CONTEXT.md sealed — 7 decisions
- Phase 13: planned — 4 plan(s) across 4 wave(s).
- quick 2026-10-05-stack-reveal-ladder: Fix the swipe-stack depth geometry so behind-cards are VISIBLE as stacked header bands (the user's reference look) instead of near-invisible slivers, and so the stage's peek band stops reading as an awkward empty gap. Root cause (verified in code): cards are bottom-anchored (`bottom: 0`) AND per-level scaled — the visible peek of a depth-l card = |translateY| − H×(1−scale_l); the LEVELS table's offsets (−38/−76/−114/−152/−190) were designed without the scale-shrink compensation, so the visible peeks collapse to ~16/44/68/78px slivers (nearly invisible) and the reserved 250px band reads as dead empty space between the stat tiles and the cards.

Files: src/components/explore/projects-card-state.ts (LEVELS + translateY derivation + doc comments), src/components/explore/sections/projects-stack-stage.tsx (stage height constants: PEEK_BAND_PX, the h-[790px]/md:h-[830px] classes → re-derived), tests/projects-stack.test.mjs + the geometry/level suites (renew the pinned numbers).

Pinned new contract (the reveal-ladder formula — record it as the module contract):
1. VISIBLE_BAND_PX = 72 — each depth level reveals one more 72px band of the behind-card's top (header + edge) above the front card's top edge. The composition at rest = the front card + 5 progressively shallower card tops behind it — the curated physical-stack look.
2. translateY for depth l (1..5): translateY(l) = −( l × VISIBLE_BAND_PX + H_front × (1 − scale_l) ) where scale_l = 0.96/0.92/0.88/0.84/0.80 (the existing scale ladder UNCHANGED) and H_front comes from the card height (560 md / 520 base — pin the formula so the numbers derive, with the computed table recorded: md H=560 → yUp = −94/−189/−283/−378/−472; base H=520 → yUp = −92/−186/−280/−373/−468; the module derives these from H via the CARD_HEIGHT input, not hardcoded magic — the function gains/uses the card height param or a named constant pair).
3. yLeave(l) = translateY(l) − 56 (the LEAVE_EXTRA relation preserved: −56 further). Exit choreography unchanged (the exit animates x/rotate/opacity; y stays).
4. PEEK_BAND_PX = 5 × VISIBLE_BAND_PX + SAFE = 360 + 20 = 380 (was 250). Stage heights: h-[900px] base (520+360+20) / md:h-[940px] (560+360+20) / mobile compact: h-[900px] consistent with the card 520 — replace the 790/830/690 constants accordingly, deriving where possible from the formula (stage = card + band + safe).
5. Depth-6+ (should not occur with 6 cards) extrapolation rule extends the same formula. Reduced motion: SAME static offsets (the depth composition is not motion — it renders at every motion preference; only transitions are instant under RM — this matches the RM amendment granted in spirit by the user's defect report: the depth must never appear/disappear with the OS setting).
6. z-index ladder unchanged; opacity ladder unchanged (0.95/0.85/0.7/0.5/0.3 — the deeper card tops read as layered paper); curated imperfection unchanged.
7. Renew the stale geometry pins: the LEVELS rows in tests/projects-stack.test.mjs (the yUp/yLeave/scale/opacity per-depth assertions + the frontIndex geometry assertions) and any band-height assertions (the 790/830 pins) — red first on the old numbers, then green on the reveal-ladder contract. Record the formula in the module docstring (the contract is the FORMULA, not just the numbers).
8. Gate chronologically last: npm run typecheck && npm test && npm run build && node --test tests/*.mjs — all green. Commit atomically: "fix(explore): swipe stack depth becomes a visible header-band reveal ladder (behind-cards visible, band no longer dead space)". Do NOT push. Report the commit hash + the new geometry summary.

### Blockers / Concerns
- Shipping decision (user, 2026-09-21): ship the milestone AS A WHOLE at milestone close — no per-phase PRs. phase-1 and phase-2 branches pushed to origin (backup only); gsd_ship deferred for both phases. phase-2 branch contains phase-1 commits (stacked).
- Phase-3 visual revision (user, 2026-09-21): user verified the visualizations live but DID NOT LIKE the visual result. Before ship, a NEW PHASE will be added carrying the user's concrete change requests for the visualizations (design-correction pass on top of phase 3; details to be supplied by the user). Recorded in phase-3 VERIFICATION.md as verified_disliked_visuals.
- Projects editorial hold (user, 2026-09-24): the user will research carousel options ("maybe a great carousel with cards swapping") — the phase-9 editorial scroll composition stays as-built until the user returns with a direction; no further projects-panel work until then. Also 2026-09-24: the arc order flipped to present-first (Chubb focal at rest) per user directive — commit 7ab0dd8.

## Session Continuity

- Last session: n/a
- Stopped at: n/a
- Resume file: None
