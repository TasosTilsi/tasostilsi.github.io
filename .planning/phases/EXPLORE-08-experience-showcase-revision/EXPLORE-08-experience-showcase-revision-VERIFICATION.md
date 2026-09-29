---
phase: 08-experience-showcase-revision
verified: 2026-09-29T20:24:18Z
status: human_needed
score: 39/39 must-haves verified
behavior_unverified: 0
overrides_applied: 0
human_verification:
  - test: "Load /explore at >=768px in dark AND light theme and scroll slowly through the Experience panel's extended range."
    expected: "The panel pins; the arc's year markers glide continuously along the left-bulging semicircle; the ACTIVE role's marker sits at the arc's vertical centre (left bulge) and is the darkest/largest; the right-hand content column cross-fades+slides between roles (200-280ms, no instant text swap, no bounce); at the range ends normal scrolling resumes with no trap or hijack."
    why_human: "The geometry/emphasis/content arithmetic is unit-tested and the wiring is source-pinned, but 'the markers land ON the curve', 'the active marker reads as the focal point' and the motion's smoothness/feel are perceptual and need a browser."
  - test: "With the OS/browser set to prefers-reduced-motion: reduce, reload /explore and scroll the Experience range, then step roles with the Prev/Next buttons."
    expected: "Markers stay frozen at their own arc positions (180deg/135deg/90deg by index) with no spatial movement; the active marker's emphasis is opacity-only (no size/scale change); content swaps by opacity only with no translate; the sticky scroll range itself is retained (scroll is still the input)."
    why_human: "The RM branches are unit-tested and source-pinned (frozen angle set, scale pinned to 1, translateY identically 0), but the rendered suppression outcome under a real OS setting is a browser behaviour."
  - test: "Click the Prev/Next buttons and press ArrowUp/ArrowDown with the stage focused; watch the scroll position and the counter/live region."
    expected: "Each activation scroll-steps to the target role's position (smooth normally, instant under reduce), the counter advances 01/05..05/05, buttons disable at the clamped ends, the sr-only live region announces the new entry once per discrete step (never during continuous scroll), and focus-visible shows the ring recipe on both buttons."
    why_human: "The scrollTo(behavior) branch, the 44px targets and the aria wiring are source-pinned, but stepping feel, focus-ring rendering and live-region timing are interactive/perceptual."
  - test: "Resize the window below 768px (and do a 375px pass) on /explore."
    expected: "The arc and control row disappear; the same entries appear as a readable stacked list with year chips, all entries visible (no SSR-hidden leftovers), no horizontal scroll, nothing clipped."
    why_human: "The md gate, the single-DOM structure and the clearLayerStyles path are source-pinned and the 375px no-horizontal-scroll invariant is structurally test-pinned, but the compact form's readability/layout is visual."
  - test: "Scroll fast, resize the window mid-range, then navigate away from /explore and back."
    expected: "No stale marker/layer positions after resize, no console errors, no orphaned scroll/rAF activity after unmount (listeners/observer/frame all released)."
    why_human: "The cleanup tokens and the ResizeObserver recompute are source-pinned, but actual leak/regression behaviour over a real session needs a browser devtools pass."
---

# Phase 8: experience-showcase-revision Verification Report

**Verification basis.** HEAD (`phase-11`) is three phases ahead of this phase, so every phase-8 truth was verified in two places: **(1) the phase-8 final tree** — a `git archive` export of commit `6f61103` (plan 03's last commit, the phase's closing artefact), into `/tmp/p8tree`, where I independently reproduced the whole gate: `npm run typecheck` → exit 0, `npm run build` → exit 0 (routes prerendered static), and `node --test tests/*.test.mjs` → **212 assertions, 0 failures across all 11 suites** — exactly the count plan 03's SUMMARY claims; and **(2) HEAD**, where the later phases *renewed* rather than deleted the phase-8 pins. No SUMMARY claim was accepted without a tool check; every number below comes from a command run in this session.

**Supersession map (not gaps).** Three later-phase commits legitimately changed phase-8 constructs, each verified at the phase-8 tree before being classified as evolution rather than a miss:

| Commit | Phase / REQ | What it changed on phase-8 ground |
|---|---|---|
| `f84900f` | phase 9, REV-16 | Merged education onto the arc: `selectTimelineRoles` → typed `selectTimelineEntries`; the arc now carries 5 entries (3 roles + 2 featured degrees) and sorts year-descending. Phase 8's role-only module had a gone-check written for it (`tests/explore-timeline.test.mjs:440`). |
| `1aef24c` | phase 9, REV-14 | Reflowed the panel grid by real DOM order ([About+Contact &#124; Skills] row 1, Experience row 2, Projects row 3) and retired `md:order-first`. Phase 8's D-01 **row order** is superseded; its *full-width Experience wrapper + pinned sticky stage* survives byte-for-byte. |
| `08333e3` | phase 11, REV-21 | Appended the 5th panel (Credentials beside Projects), making the 5-panel grid. |
| `b39b12c` | phase 10, REV-18 | Rewrote the Projects body as the swipe stack and admitted `framer-motion` as the 39th dependency — for the Projects composition only; the Experience engine's hand-rolled rAF is untouched. |

The phase-8 interaction engine itself was **not** superseded: `git diff 6f61103 HEAD -- src/components/explore/use-timeline-progress.ts` is **empty** — the hook is byte-unchanged since phase-8 close. `timeline-geometry.ts` changed only by the phase-9 education merge (+63/−15).

**Green-gate finality.** Writing this report re-opened the gate, so the repo's complete gate was re-run on the current workspace as the chronologically last action of this verification (recorded in the reply that accompanies this file): `npm run typecheck` → exit 0, `npm run build` → exit 0 (all routes prerendered static), `node --test tests/*.mjs` → all suites green. Nothing was written after that run.

## Goal Achievement → Observable Truths

| # | Truth | Status | Evidence |
|---|---|---|---|
| R1 | **Roadmap goal** — the Experience panel becomes a full-width interactive semicircular career timeline: mathematically positioned arc with year markers, scroll-driven `timelineProgress` driving positions/emphasis/content, hand-rolled rAF (zero new deps), keyboard + reduced-motion contracts, mobile-adapted compact form, IDE aesthetic preserved | ✓ VERIFIED | Delivered by `89e014d` + `175dcab` (plan 02) over `357989a`/`6ce577c` (plan 01); `explore-panels.tsx:117-121` full-width wrapper + pinned shell; `experience-section.tsx:131-149` group root + arc SVG; `use-timeline-progress.ts` scroll→rAF→writes; deps 38 at close (39 at HEAD after phase 10's `framer-motion`) |
| R2 | **REV-07** — full-width panel, arc with year markers for the 3 docx tech roles, arc left ~40% / content right ~60%, active role's content beside it, grid rebalanced with no empty cells | ✓ VERIFIED | At the phase-8 tree: `explore-panels.tsx:111-115` = 2× `md:col-span-2` (Experience wrapper + Projects shell) + 1× `md:order-first`; `experience-section.tsx:132` `md:grid-cols-[2fr_3fr]`; the built `out/explore.html` carries exactly **3** `data-timeline-dot` + **3** `data-timeline-label` real-text markers. Row *order* later re-mapped by REV-14 (supersession map above; full-width + pinned stage survive at HEAD) |
| R3 | **REV-12** — scroll input → normalized progress → active index → arc positions → content, as one deterministic typed system (sticky-range, **no** wheel-event hijacking), releasing normal scrolling at the range ends | ✓ VERIFIED | `timeline-geometry.ts` pure formulas (`computeProgress` clamp/−rel/range, `continuousIndex`, `activeIndexFromContinuous` = `Math.round` W-2); `use-timeline-progress.ts:104` `MAIN_SELECTOR = '.explore-shell > main'`, `:207-214` one derivation pass, `:272-274` passive scroll → schedule only; no `wheel`/`touchmove` in either file (code, not prose); `computeProgress` clamps outside [0,1] → natural release |
| R4 | **REV-13** — hand-rolled rAF (no new deps), keyboard + accessible non-scroll alternative, reduced-motion fallback, listener cleanup, mobile compact adaptation, all content from the data file | ✓ VERIFIED | Hook is byte-unchanged since close and imports **no** animation library; `:346-351` ArrowUp/ArrowDown handler, `:206-229` two 44px `aria-label`ed buttons; `:229-232` `reducedMotionAngle`/`reducedMotionEmphasis` per-pass; `:307-313` cleanup (2× removeEventListener, `disconnect()`, `cancelAnimationFrame`, `clearTimeout`); `:162,276-290` md gate; all strings via `selectTimelineEntries(portfolio-main-data.json)` |
| 1 | [P1] `startYear` on the real data yields `'2023'`, `'2022'`, `'2019'` — the **FIRST** year match wins for `'Sept 2022 — Aug 2023'` | ✓ VERIFIED | `timeline-geometry.ts:259-263` non-global `YEAR_PATTERN` + `.match`; named test `startYear: FIRST /\b(?:19\|20)\d{2}\b/ match wins …` at `tests/explore-timeline.test.mjs:313-322` — re-run green at both trees (asserts the real durations, not literals) |
| 2 | [P1] `selectTimelineRoles` yields exactly `[Chubb, Upstream Systems, Netcompany-Intrasoft]` in JSON order, no sorting | ✓ VERIFIED (as-of-close) | At the phase-8 tree: function present at `timeline-geometry.ts` and the named test `selectTimelineRoles: isTechRelated filter yields exactly [Chubb, Upstream Systems, Netcompany-Intrasoft] in JSON order` passes (19/19 in the exported tree). At HEAD deliberately replaced by phase-9 REV-16's `selectTimelineEntries` (5 chronologically sorted entries) with a committed gone-check — supersession, not a miss |
| 3 | [P1] For n=3 the exact-fit carousel keeps every marker angle within [90°,270°] for every progress; Δ=45°; active at 180° when c′ is an integer | ✓ VERIFIED | `markerAngle` `:180-(i-c)*(90/(n-1))`; named test sweeps progress 0→1 step 0.01 asserting the invariant, plus a phase-9 n=5 sweep (Δ=22.5°) — suite green (27/27 at HEAD, 19/19 at the phase-8 tree) |
| 4 | [P1] Keyboard targets round-trip through the primary derivation — `activeIndexFromContinuous(progressForRole(i,n)) === i`, including the legitimate edges 0 and n−1 | ✓ VERIFIED | `progressForRole` `= i/(n-1)`; named round-trip test green; `scrollTargetForRole` is the shipped consumer (`use-timeline-progress.ts:335`) |
| 5 | [P1] The reduced-motion variant returns frozen angles {180,135,90} by index, scale 1, translateY 0, opacity-only emphasis | ✓ VERIFIED | `reducedMotionAngle` `:168-170` = `markerAngle(i, 0, n)`; `reducedMotionEmphasis` `:177-183` pins `scale: 1`; named RM test green |
| 6 | [P1] The generalized math holds for n ∈ {1,2,4} — not 3-hardcoded | ✓ VERIFIED | Named generalization test green; all `n-1` denominators guarded (`:102,113,126,136,232`) |
| 7 | [P2] Experience spans both columns at md+ as row 1, `[About+Contact \| Skills]` row 2, Projects full-width row 3 — zero empty cells; 375px stacks 1-col with every span/height class `md:`-scoped | ✓ VERIFIED (as-of-close) | Phase-8 tree: 2× `md:col-span-2` + 1× `md:order-first` + both md-scoped heights; `grid-cols-1` base; `explore-swap`/shell suites green at close (30/30, 20/20). Row order superseded by REV-14 at HEAD; the md-scoping invariant is still test-pinned (`sweep: md-scoping` row) |
| 8 | [P2] `out/explore.html` carries role 1 (Chubb) title/company/duration/location/bullets as real static text while later layers render `visibility:hidden` + `aria-hidden` | ✓ VERIFIED | **Re-derived from the real JSON this session, not copied**: at the phase-8 tree all five strings present, `visibility:hidden` ×2; at HEAD (fresh build) all five present, ×8. `experience-section.tsx:247-257` = the §9 derivation at progress 0 via `contentLayer(index,0,false)` |
| 9 | [P2] Scrolling inside the extended wrapper drives marker transforms and content layers from ONE progress value via rAF imperative writes on `main.scrollTop` — no wheel/touch listeners, natural release, React re-renders only on activeIndex/geometry change | ✓ VERIFIED | `use-timeline-progress.ts:203-262` one batched-read/write pass; `:258-261` `setActiveIndex` ONLY on change; `:292-299` ResizeObserver (geometry only); the no-hijack, cleanup and md-gate rows are test-pinned green in `tests/explore-visuals.test.mjs` |
| 10 | [P2] ArrowUp/ArrowDown on the stage and the Prev/Next buttons step roles via `main.scrollTo` with the reduced-motion behavior branch — the buttons ARE the accessible non-scroll alternative | ✓ VERIFIED | `:346-351` keydown → `stepRole`; `:323-340` `goToRole` → `scrollTargetForRole` → `main.scrollTo({top, behavior})` with `prefersReducedMotion() ? 'auto' : 'smooth'`; `experience-section.tsx:206-229` two real `<button>`s, `aria-label="Previous role"`/`"Next role"`, 44px, disabled at the clamped ends |
| 11 | [P2] `prefers-reduced-motion` freezes markers at {180°,135°,90°} by index, swaps content opacity-only, and suppresses the dot size-class swap | ✓ VERIFIED | `:229-232` RM branches per pass; `:237` no scale component written under RM; `experience-section.tsx:158-162` size-class swap gated on the post-mount `reducedMotion` state; exactly ONE `prefers-reduced-motion` occurrence in the hook (E-13) |
| 12 | [P2] Every listener/observer/animation frame is cleaned up on unmount | ✓ VERIFIED | `:307-313` return cleanup — `removeEventListener` scroll ×1 + md-change ×1 (grep count 2), `observer.disconnect()`, `cancelAnimationFrame`, `clearTimeout(fadeTimer)`; pinned by the E-7 row in `tests/explore-visuals.test.mjs` |
| 13 | [P2] The <md compact form is the SAME DOM as the stage (single-DOM B-1), stacked and readable, hook dormant | ✓ VERIFIED | `experience-section.tsx` renders ONE `entries.map` for the layers (`:235-315`) with `md:hidden` year chips and `md:col-start-1 md:row-start-1` stacking; `use-timeline-progress.ts:204` `if (!mdMedia.matches) return` and `:282-289` `clearLayerStyles()` on entering compact |
| 14 | [P3] Source invariants hold and are test-pinned: id only on the sticky stage, no wheel/touch listeners, cleanup tokens, RM per-pass with no media listener, RM + md media queries greppable | ✓ VERIFIED | Greps run this session: no `wheel`/`touchmove`/`touchstart`/`document.addEventListener`/`window.addEventListener` in hook or section (only prose); R-3 `/<div[^>]*\bid=/` absent from `explore-panels.tsx`, `id={section.id}` flows to PanelShell; the 7-row block passes (`explore-visuals.test.mjs` 31/31) |
| 15 | [P3] Export rows pin the §9 contract against `out/explore.html` with DATA-DERIVED expectations | ✓ VERIFIED | I re-derived independently from `src/data/portfolio-main-data.json`: role-1 title/company/duration/location/first bullet present; `aria-label="Career timeline"`, `Previous role`, `Next role`, counter `01 / 0N`, arc path `d="M 100 0 A 100 100 0 0 0 100 200"`, `opacity:0` ≥ 6 (26 at HEAD / 8 at the phase-8 tree), 3 dot + 3 label spans at close |
| 16 | [P3] The complete gate — typecheck + build + every `tests/*.mjs` — passes on the FINAL tree as the chronologically last action | ✓ VERIFIED | **Independently reproduced at the phase-8 final tree** (`/tmp/p8tree` @ `6f61103`): typecheck exit 0, build exit 0, **212 assertions / 0 failures across 11 suites** — exactly the SUMMARY's claimed count. Re-run on the current workspace as this report's final action |

## Score

**39/39 must-haves verified** — 4 roadmap/requirement truths (goal + REV-07 + REV-12 + REV-13) + 16 plan truths (6 + 7 + 3) + 9 unique required-artifact paths (11 plan-declared entries; `explore-visuals.test.mjs` and `explore-sweep.test.mjs` are declared by both plan 02 and plan 03) + 10 key links. `behavior_unverified: 0` — every behaviour-dependent truth has a passing named test (pure-derivation unit suite) or a passing source-invariant/export-row pin, all re-run in this session.

Status is `human_needed`, not `passed`, because this repo has no browser/jsdom harness: the pure arithmetic and the wiring are machine-proven, but the five *rendered/perceptual* outcomes below can only be confirmed in a browser. That residue is exactly what the phase's own validation architecture (RESEARCH §5: layers 1–3 are pure-unit / source-grep / export-row) leaves uncovered.

## Deferred Items

| Item | Origin | Status at verification |
|---|---|---|
| Extending the arc to Education/Certifications/Projects/Open Source | CONTEXT `<deferred>` | Education extension was **not** this phase's (it became phase 9/REV-16 — delivered, supersession map above). Certs/Projects/Open Source remain undeferred-by-this-phase and are not phase-8 gaps |
| Wheel-event hijacking variant | CONTEXT `<deferred>` — explicitly rejected for sticky-range | Correctly NOT delivered; `computeProgress` clamps and no wheel listener exists (verified) |
| Arc on mobile (compact vertical form instead) | CONTEXT `<deferred>` | Correctly NOT delivered — `<md` renders the compact stacked form (truth 13) |

## Required Artifacts

| Artifact | Expected | Actual | Status |
|---|---|---|---|
| `src/components/explore/timeline-geometry.ts` | ≥120 lines, 15 exports | 321 lines; all pinned formulas exported (phase-9 renamed role selection to `selectTimelineEntries`) | ✓ |
| `tests/explore-timeline.test.mjs` | ≥140 lines | 601 lines; real-JSON `readFileSync`, direct `.ts` import | ✓ |
| `src/components/explore/sections/experience-section.tsx` | ≥170 lines, exports `ExperienceSection` | 326 lines, export `:99` | ✓ |
| `src/components/explore/use-timeline-progress.ts` | ≥110 lines, exports `useTimelineProgress` | 354 lines, export `:130` (byte-unchanged since close) | ✓ |
| `src/components/explore/explore-panels.tsx` | ≥100 lines, exports `ExplorePanels` | 168 lines, export `:128` | ✓ |
| `tests/explore-shell.test.mjs` | ≥440 lines | 505 lines | ✓ |
| `tests/explore-sweep.test.mjs` | ≥250 lines | 393 lines | ✓ |
| `tests/explore-visuals-server.test.mjs` | ≥150 lines | 167 lines | ✓ |
| `tests/explore-visuals.test.mjs` | ≥690 lines | 1000 lines | ✓ |

All artifacts pass the substantive bar: no `TODO`/`FIXME`/`XXX`/`HACK`/`not implemented` residue in any phase-8 source file (grep clean), no skipped tests (`ℹ skipped 0` on every suite run at both trees).

## Key Link Verification

| From → To | Via | Status |
|---|---|---|
| `tests/explore-timeline.test.mjs` → `src/data/portfolio-main-data.json` | `readFileSync` at test time (line 56) — expectations derived from the real JSON | WIRED |
| `tests/explore-timeline.test.mjs` → `timeline-geometry.ts` | direct `.ts` import (line 53) under `node --test` — the import itself proves the zero-runtime-import / erasable-TS contract | WIRED |
| `experience-section.tsx` → `use-timeline-progress.ts` | `import { useTimelineProgress }` (`:84`) + call (`:122`) | WIRED |
| `use-timeline-progress.ts` → `timeline-geometry.ts` | single `from './timeline-geometry'` import of 12 pure derivations | WIRED |
| `use-timeline-progress.ts` → `<main>` of `explore-shell.tsx` | `MAIN_SELECTOR = '.explore-shell > main'` (`:104`) — the ONLY scroll source, never `window` | WIRED |
| `explore-panels.tsx` → `panel-shell.tsx` | `className={placement.gate && placement.shell ? placement.shell : undefined}` (`:145`) — chrome untouched, placement rides the param | WIRED |
| `experience-section.tsx` → `timeline-geometry.ts` | `selectTimelineEntries` + `contentLayer` + `dateLineFits` (`:78-83`) | WIRED |
| `tests/explore-sweep.test.mjs` → `out/explore.html` | Type-E rows read the built artifact (build-first convention) | WIRED |
| `tests/explore-visuals.test.mjs` → `use-timeline-progress.ts` | `codeOf('…use-timeline-progress.ts')` source-invariant rows (`:187,240`) | WIRED |
| `tests/explore-sweep.test.mjs` → `portfolio-main-data.json` | data-derived export expectations read at test time (`:304`) | WIRED |

## Data-Flow Trace

`src/data/portfolio-main-data.json` → `selectTimelineEntries(experience, education)` (`timeline-geometry.ts:292-310`, `isTechRelated` ∪ `featured`, year-descending) → `ExperienceSection` (`:106`) → `TimelineStage` → `useTimelineProgress(entryCount)` → per-frame `markerAngle`/`markerPoint`/`markerEmphasis`/`contentLayer` writes onto the `data-timeline-*` nodes → exported `out/explore.html`.

Traced end-to-end with real values, not literals: the export contains Chubb's actual `title`, `company`, `duration`, `location` and first bullet, all read from the JSON at verification time (both at the phase-8 tree and in a fresh HEAD build). No static/hardcoded fallback path exists — `experience-section.tsx` E-1 returns `null` on an empty selection and every rendered string descends from the JSON through the pure module. Requirement EXPLORE-07 (data-driven, zero hardcoded content) survives intact.

## Behavioral Spot-Checks

| Check (named test / command) | Result |
|---|---|
| Phase-8 pure-derivation core (27 named tests incl. startYear, carousel invariants, keyboard round-trip, RM variants, edge matrix) — `node --test tests/explore-timeline.test.mjs` | **27/27 pass** (HEAD); **19/19 pass** at the phase-8 tree |
| Phase-8 source invariants (R-3 id placement, no-hijack, cleanup, RM per-pass, md gate, a11y, cos/sin provenance) — `node --test tests/explore-visuals.test.mjs` | **31/31 pass** |
| Type-E export rows (data-derived role-1 text, hidden layers, stage anatomy, pre-JS `opacity:0` markers) — `node --test tests/explore-sweep.test.mjs` | **20/20 pass** |
| Stage anatomy + filter-governed selection + client inversion — `node --test tests/explore-visuals-server.test.mjs` | **11/11 pass** |
| Grid placement whitelist — `node --test tests/explore-shell.test.mjs` | **30/30 pass** |
| Export contract re-derived by hand from the JSON (role-1 five strings, `visibility:hidden`, arc path `d`, group label, both control labels, `id="experience"` ×1) | **all present**, phase-8 tree and fresh HEAD build |
| **Phase-8 final-tree probe** (`/tmp/p8tree` @ `6f61103`): `npm run typecheck` → `npm run build` → all 11 suites | **typecheck 0 · build 0 · 212 assertions / 0 failures** (matches the claimed count exactly) |
| Current workspace closing gate (run as this report's chronologically last action) | recorded in the accompanying reply — see **Green-gate finality** above |

## Requirements Coverage

| REQ-ID | Description (phase scope) | Status | Evidence |
|---|---|---|---|
| REV-07 | Experience panel → full-width interactive semicircular career timeline; arc + year markers for the 3 docx roles; content beside the arc; grid rebalanced | ✓ DELIVERED | Full-width wrapper + pinned shell + `2fr/3fr` split; 3 dot + 3 label markers at close (5 after REV-16); role-1 real text in the export; 2× span-2 grid with no empty cells |
| REV-12 | `timelineProgress` single source of truth from scroll — sticky-range, no wheel hijacking, releases at the ends, pure/unit-testable derivations | ✓ DELIVERED | `computeProgress`/`continuousIndex`/`activeIndexFromContinuous` + the full arc/emphasis/content function set, unit-tested; one scroll source (`main`), no hijack listeners, clamping gives natural release |
| REV-13 | Interaction-quality contract — hand-rolled rAF (zero new deps), keyboard + accessible alternative, reduced-motion fallback, cleanup, mobile compact, data-driven strings | ✓ DELIVERED | Hook byte-unchanged since close with no animation-library import; ArrowUp/ArrowDown + two 44px labelled buttons; RM branches per pass (RM-1/RM-2/W-7); full cleanup tokens; md-gated single-DOM compact form; all strings from the JSON |

## Anti-Patterns Found

None. `\b(TBD|FIXME|XXX|HACK)\b` and `TODO` over the four phase-8 source files → **0** hits; no `.skip(`/`.todo(` in the phase-8 suites; no unreferenced debt markers; no debug artifacts.

**Non-blocking observations (INFO, not gaps):**
1. Phase 8's dependency count (38) is now 39 at HEAD — `framer-motion` was adopted by **phase 10 (REV-17/18)** for the Projects stack only. The phase-8 suite row was renewed in lockstep (`cross-cutting: recharts removed — 38 permanent + framer-motion adopted for the projects stack composition`). REV-13's "zero new animation dependencies" holds for the Experience engine: the hook imports no library and has not changed since close.
2. The arc now carries 5 entries rather than phase 8's 3 — deliberate phase-9/REV-16 education merge, verified at the phase-8 tree to have been exactly 3 at close.
3. `md:order-first` was retired by phase 9/REV-14 (DOM order became visual order). The phase-8 grid contract that mattered — Experience full-width at md+, About/Skills/Projects filling every cell with zero empties — survives and is still test-pinned.

## Human Verification Required

1. **Arc rendering + focal point (both themes, ≥768px)** — markers visibly on the left-bulging curve, active role at the arc's vertical centre, darkest/largest.
2. **Scroll-driven motion + release** — pinned range drives continuous marker movement and content cross-fade; smooth hand-off back to normal scrolling at both ends; no trap.
3. **`prefers-reduced-motion` rendered outcome** — frozen marker positions, opacity-only emphasis and content swap, sticky range retained.
4. **Keyboard/controls + focus parity** — Prev/Next and arrow stepping land on the right role, counter/live region update once per discrete step, focus ring visible.
5. **Mobile compact form + session hygiene** — 375px stacked readable list with no horizontal scroll; no stale positions after resize; no orphaned listeners after unmount.

## Gaps Summary

**No gaps.** All 39 must-haves are verified against the code — either at HEAD where the phase-8 construct still lives (the interaction hook is byte-unchanged since close; the arc stage, grid placement, export contract and all ten key links are live), or at the phase-8 final tree (`6f61103`) where later milestone phases legitimately replaced the role-only selection and the row order under explicit later requirements (REV-14/REV-16/REV-17/REV-21), with the complete gate independently reproduced there — **typecheck 0, build 0, 212 assertions / 0 failures**, matching the phase's own recorded count. No `gaps:` block is emitted. The only status-raising condition is the five perceptual checks above, which are precisely the outcomes this repo's test harness (source greps + static-export rows + pure-math units, no browser) cannot reach — hence `human_needed`, not `passed`.

*Written by gsd-verifier · not committed (the orchestrator bundles it).*
