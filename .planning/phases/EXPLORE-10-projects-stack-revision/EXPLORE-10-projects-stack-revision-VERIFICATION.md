---
phase: 10-projects-stack-revision
verified: 2026-09-29T23:33:27+03:00
status: gaps_found
score: 21/26 must-haves verified
behavior_unverified: 1
overrides_applied: 4
gaps:
  - truth: "Continuous cardPosition = f(cardIndex, carouselProgress) driven by scroll (roadmap goal + REV-18/REV-20 acceptance)"
    status: failed
    reason: "No progress input exists. The tree has no useScroll, no carouselProgress, no 300vh wrapper and no sticky stage for Projects; geometry is now a DISCRETE ring-buffer depth: cardState(cardIndex, frontIndex, count, reducedMotion) (src/components/explore/projects-card-state.ts:234-303) animated by framer-motion drag/fly-off. Superseded by a recorded user directive after live review — quick 2026-09-25-projects-swipe-loop-stack (.planning/quick/2026-09-25-projects-swipe-loop-stack/TASK.md), commit b39b12c. Do NOT restore scroll; the correct closure is to update the ROADMAP/SPEC wording (carouselProgress -> ring-buffer frontIndex) so plan must_haves match the delivered contract."
    artifacts:
      - path: "src/components/explore/sections/projects-stack-stage.tsx"
        issue: "useScroll/useTransform/MotionValue progress all absent; drag='x' + useAnimationControls drive motion instead (lines 24-30, 502-519)"
      - path: "src/components/explore/explore-panels.tsx"
        issue: "projects placement is `{ wrapper: '', shell: '', gate: false }` (line 122) — the 300vh sticky range was retired"
      - path: "src/components/explore/projects-card-state.ts"
        issue: "cardState signature is (cardIndex, frontIndex, count, reducedMotion); there is no progress parameter"
    missing:
      - "single carouselProgress (0->1) derived from scroll position"
      - "sticky ~100vh stage with release at both range ends"
      - "continuous (non-level-stepped) geometry derivation from that progress"
  - truth: "The desktop stack renders all 6 project cards inside the sticky md+ stage with continuous scroll-driven depth geometry (plan 02 truth 1)"
    status: failed
    reason: "Six cards do render (672-line stage, projects.map over the top-6 slice), but not inside a sticky scroll-driven stage: the panel returned to natural height and the stack is a centered fixed-height block driven by swipe state. Superseded by the same user directive (commit b39b12c)."
    artifacts:
      - path: "src/components/explore/sections/projects-section.tsx"
        issue: "md+ host is a plain `hidden md:block` div (lines 33-35); no height clamp, no sticky wrapper"
      - path: "src/components/explore/sections/projects-stack-stage.tsx"
        issue: "stage container is `relative mx-auto w-full max-w-[540px] h-[520px] md:h-[560px]` (lines 614-627) — centered block, not a sticky viewport"
    missing:
      - "sticky md+ stage"
      - "scroll-linked depth promotion"
  - truth: "Keyboard Prev/Next and arrow keys step the carousel by scrolling the main container to the target band (plan 02 truth 4)"
    status: failed
    reason: "Keyboard stepping is state-driven, not scroll-driven: handleKeyDown -> cycle(dir) -> pendingSwipe -> fly-off/loop, with Home/End via goTo() setting frontIndex directly. `main.scrollTo` and the scroll-band formula are gone (grep-verified absent). Superseded by the user directive; the keyboard CONTRACT (Prev/Next, arrows, Home/End, focusable 44px controls) is still met."
    artifacts:
      - path: "src/components/explore/sections/projects-stack-stage.tsx"
        issue: "handleKeyDown at lines 574-590; no scroll helper, no scrollTo anywhere in the file"
    missing:
      - "main.scrollTo({ top: targetScrollTop }) stepping"
      - "keyboard scroll-band formula `offsetTop + progress * (offsetHeight - clientHeight)`"
  - truth: "Resize remeasures the stage so the keyboard scroll-band formula stays correct after viewport changes (plan 02 truth 7)"
    status: failed
    reason: "Not applicable to the delivered interaction and therefore not implemented: there is no scroll-band formula to keep correct, and no ResizeObserver or window resize listener exists in the stage. The swipe stack is layout-independent (percentage-free fixed height, absolute cards), so no remeasure is required. Superseded by the user directive together with the scroll band."
    artifacts:
      - path: "src/components/explore/sections/projects-stack-stage.tsx"
        issue: "zero occurrences of ResizeObserver / addEventListener (grep-verified)"
    missing:
      - "ResizeObserver + window resize fallback (only required if scroll-band keyboard stepping is restored)"
  - truth: "Key link: projects-stack-stage.tsx -> explore-panels.tsx via closest('[data-editorial-wrapper]') (plan 02 key_link 2)"
    status: failed
    reason: "NOT_WIRED — the discovered-target recipe was the useScroll plumbing and was deleted with the scroll composition. The element still exists and still carries the attribute (used by the Experience stage's sticky range), but the Projects stage no longer reads it; there is no remaining functional link between the Projects stage and the wrapper."
    artifacts:
      - path: "src/components/explore/sections/projects-stack-stage.tsx"
        issue: "no closest('[data-editorial-wrapper]') and no document.querySelector('.explore-shell > main')"
      - path: "src/components/explore/explore-panels.tsx"
        issue: "line 161 keeps data-editorial-wrapper='true', now serving the Experience stage only"
    missing:
      - "either the wired scroll-target discovery (if scroll is restored) or the removal of the stale plan key_link"
---

# Phase 10: projects-stack-revision Verification Report

**Scope of verification.** First verification of this phase (no prior VERIFICATION.md). Verified against the live working tree at `d2f1db5` on branch `phase-11`, not against SUMMARY.md. The tree also contains subsequent work (phase 11 credentials + two quick tasks); those are named where they touch this phase's artefacts.

**Material fact established during verification.** The phase was executed as a scroll-driven composition, then the user directed a live-review change on the same day: *"do not make it scrollable this time for the projects — make it like the Tinder cards that the user has to swipe right or left... loopable... show the shadows from behind the first card"* — recorded in `.planning/quick/2026-09-25-projects-swipe-loop-stack/TASK.md`, implemented at commit `b39b12c`, with the phase's own tests renewed to the swipe/ring contract (integration pin `EXPLORE-10 invariant (REV-21): projects stack is swipe-driven, centered, loopable and shadowed`, `tests/explore-visuals.test.mjs:934-988`). Every failure below traces to that directive, not to a defect in the delivered interaction. `overrides_applied: 4` counts the four must-have truths retired by it.

## Goal Achievement → Observable Truths

| # | Truth | Status | Evidence |
|---|---|---|---|
| R1 | Projects panel's editorial scroll is replaced by a curated stacked-card carousel (roadmap goal) | ✓ VERIFIED | `projects-row-state.ts`, `projects-editorial-stage.tsx`, `tests/projects-editorial.test.mjs` deleted at `53d347a` and absent from disk; `projects-section.tsx` renders `ProjectsStackStage` + `ProjectsMobileStack` |
| R2 | 6 visual-first cards physically stacked in depth | ✓ VERIFIED | `projects-stack-stage.tsx:628-640` maps the `slice(0,6)` slice to `SwipeCard`; each card `position:absolute; inset:0` with `zIndex/scale/translateY/opacity` from `cardState` (lines 502-519); `out/explore.html` carries all 6 project names as real markup |
| R3 | Continuous `cardPosition = f(cardIndex, carouselProgress)` with framer-motion | ✗ FAILED (superseded) | geometry input is `frontIndex` (ring buffer), not progress: `projects-card-state.ts:234-303`; no `useScroll`/`carouselProgress` anywhere (`grep` clean). framer-motion present and sanctioned: `projects-stack-stage.tsx:24-30` |
| R4 | Generative IDE-language visuals | ✓ VERIFIED (deviation) | 6 monochrome inline-SVG variants, token colors only, `aria-hidden`, zero image assets (`<img`/`url(`/asset imports absent from all phase files); `projectVisualVariant` via djb2 hash + flagship pins (`projects-card-state.ts:157-187`). **Deviation:** only 5 distinct variants for 6 cards — `ServicedMetricsCalculator` and `Uom Track` both resolve to `network` |
| R5 | Curated imperfection (deterministic, ±2-4px / ±1°) | ✓ VERIFIED | `IMPERFECTION_X = [-4,-2,2,4,3,-3]`, `IMPERFECTION_ROTATION = [-1,-0.5,0.5,1,0.75,-0.75]`, indexed by `cardIndex % 6`, forced to 0 under reduced motion (`projects-card-state.ts:51-52, 284-289`) |
| R6 | In-card info on the ACTIVE card | ✓ VERIFIED | `CardExpandedPanel` renders only when `visible={isFront}` (`projects-stack-stage.tsx:106-164, 523`); carries first-sentence description, up to 4 lexicon technology chips, `link` and conditional `sourceUrl` with `rel="noopener noreferrer"`; inactive cards render no links at all |
| R7 | Keyboard contract | ✓ VERIFIED | `role="group" aria-label="Projects carousel"` + `onKeyDown` for Arrow/Home/End (`:574-590`), 44px `Previous project`/`Next project` buttons (`:644-663`), throttled `aria-live="polite"` announcement (`:543-554, 624-626`) |
| R8 | Reduced-motion contract | ✓ VERIFIED | `useReducedMotion()` (`:537`); RM branch pins translateY/X/scale/rotation to 0 and varies opacity/zIndex (`projects-card-state.ts:264-289`); `cycle()` bypasses fly-off under RM (`:561-568`); `drag` disabled under RM (`:515`); CSS guard intact (`globals.css:648-655`) |
| R9 | Mobile simplified stack | ✓ VERIFIED | `ProjectsMobileStack` (`projects-mobile-stack.tsx`) renders below md via `md:hidden`; compact mode hides depth > 1 so exactly the active card + one peek card are visible (`:416, 464, 499`); no `overflow-x-*` utility in any projects file |
| R10 | IDE aesthetic preserved | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | Token classes (`bg-card`, `border-border`, `text-muted-foreground`, `rounded-lg`, `font-mono`) are present, but "visual-first 75-85% visual area" and the IDE look are judgements no static check can make |
| P01-1 | Unit suite loads `projects-card-state.ts` directly under `node --test` and passes | ✓ VERIFIED | static `.ts` import (`tests/projects-stack.test.mjs:25-36`); `node --test` → 21/21 pass |
| P01-2 | `cardState(0, 0, 6, false)` is foreground (y 0, scale 1, opacity 1, top z, visible, activeAmount 1) | ✓ VERIFIED | `projects-card-state.ts:257-303` depth 0 branch; test `cardState: frontIndex 0 geometry` passes |
| P01-3 | indices > 0 get behind geometry (negative y, scale < 1, opacity < 1, lower z) | ✓ VERIFIED | `LEVELS` table (`:56-63`); zIndex `100 - depth*10` (`:290`); test passes |
| P01-4 | Reduced-motion branch returns translate/scale/rotation 0 | ✓ VERIFIED | `:264-289`; test `reduced-motion branch pins translate/scale/rotation to 0` passes |
| P02-1 | md+ sticky, scroll-driven continuous depth for all 6 cards | ✗ FAILED (superseded) | see gap 2 |
| P02-2 | Foreground DeepIndex card renders name, tagline, terminal visual as real SSR markup | ✓ VERIFIED | `out/explore.html` (rebuilt this run) contains `DeepIndex`, the terminal mock string `query_context`, and inline `<svg>` markup; 50 inline SVGs in the export |
| P02-3 | The 4 non-fixed visuals are chosen by `djb2(name) % 4`, not hard-coded | ✓ VERIFIED | `projectVisualVariant` (`:182-187`); stage calls it per card (`:364-382, 521`) |
| P02-4 | Keyboard steps by scrolling the main container to the target band | ✗ FAILED (superseded) | see gap 3 |
| P02-5 | Reduced motion = opacity/zIndex state swaps, no translate/scale | ✓ VERIFIED | `:561-568` + `cardState` RM branch; tests pin both |
| P02-6 | <md renders the new simplified stack (phase-9 compact grid retired) | ✓ VERIFIED | `projects-section.tsx:36-38`; no compact-card-grid markup remains; framer-motion absent from the mobile file |
| P02-7 | Resize remeasures the stage | ✗ FAILED (superseded) | see gap 4 |
| P02-8 | Single-project data set renders one static active card, no carousel chrome | ✓ VERIFIED | `count <= 1` short-circuit, expanded panel `visible`, no controls (`:592-612`) |
| P03-1 | `projects-section.tsx` wires stack + mobile stack, keeps stat tiles and terminal pointer | ✓ VERIFIED | `:26-42` (tiles → md+ stack → mobile stack → `TerminalPointer command="projects --all"`) |
| P03-2 | Old editorial-row files and their dedicated test are gone | ✓ VERIFIED | all three deleted at `53d347a`; `existsSync` gone-checks pass in the integration suite |
| P03-3 | `explore-visuals.test.mjs` allowlists framer-motion only in `projects-stack-stage.tsx` and asserts the old contract absent | ✓ VERIFIED | allowlist loop at `:631-639`; gone-checks at `:934-946`; `grep` confirms framer-motion appears in exactly one file under `src/` |
| P03-4 | `npm run typecheck`, `npm run build`, `node --test tests/*.test.mjs` all pass on the final tree | ✓ VERIFIED | reproduced this run: typecheck exit 0, build exit 0 (4 static routes), suite 267/267 pass exit 0 |

**Score: 21/26** — 21 verified, 4 failed-and-superseded (R3, P02-1, P02-4, P02-7), 1 present-behavior-unverified (R10). The broken key link (gap 5) is additional to the truth count.

## Deferred Items

| Item | Status vs later phases |
|---|---|
| Real screenshots replacing generative visuals (user supplies assets later) | Still deferred — no later milestone phase owns it; phase 11 delivered the Credentials panel only |
| Terminal/command-driven About-skill idea | Still deferred — future direction, unowned |
| Cards for the other 8 projects (CLI-reachable) | Still deferred — top-6 slice is the delivered contract |

No deferred item from this phase was consumed by a later phase, and no later phase re-opened the Projects mechanism (phase 11 appended a fifth panel; the two quick tasks touched copy and the projects interaction only).

## Required Artifacts

| Path | Exists | Substantive | Wired | Notes |
|---|---|---|---|---|
| `src/components/explore/projects-card-state.ts` | ✓ | ✓ 303 lines ≥ 80; exports `CardState`, `cardState`, `firstSentence`, `projectYear`, `projectTechnologies`, `projectVisualVariant`, `djb2`, `swipeAccepts`, `SWIPE_THRESHOLD`, `SWIPE_VELOCITY_THRESHOLD` | ✓ imported by the stage (static, `../projects-card-state`) and by the unit suite by explicit `.ts` path | zero runtime imports (asserted by the integration suite) |
| `tests/projects-stack.test.mjs` | ✓ | ✓ 336 lines ≥ 120; 21 tests, all passing | ✓ run by `node --test` | renewed to the swipe/ring contract |
| `src/components/explore/sections/projects-stack-stage.tsx` | ✓ | ✓ 672 lines ≥ 220; exports `ProjectsStackStage` + `ProjectsSwipeStack` | ✓ rendered by `ProjectsSection` (md+) and by the mobile wrapper | the single framer-motion import site under `src/` |
| `src/components/explore/sections/projects-mobile-stack.tsx` | ✓ | ⚠️ 20 lines vs `min_lines: 130` — ADVISORY, not a stub | ✓ rendered in the `md:hidden` block; delegates to `ProjectsSwipeStack mode="compact"`, where the compact composition (2-card visibility, `h-[420px]`, `max-w-[320px]`) is implemented | the plan-02 summary recorded a self-contained duplicate implementation; the swipe refactor deliberately collapsed it to a shared delegate. Capability is real and test-pinned (integration suite asserts the delegation) |
| `src/components/explore/sections/projects-section.tsx` | ✓ | ✓ 47 lines ≥ 40 | ✓ stack + mobile stack + tiles + pointer | compact card grid removed |
| `tests/explore-visuals.test.mjs` | ✓ | ✓ 1000 lines ≥ 50; includes the EXPLORE-10 invariant and the framer allowlist | ✓ run by `node --test` | stale comment wording at `:619-621` still says "the editorial stage is the ONE import site" (see Anti-Patterns) |

## Key Link Verification

| From | To | Via | Status | Evidence |
|---|---|---|---|---|
| `tests/projects-stack.test.mjs` | `src/components/explore/projects-card-state.ts` | static import with explicit `.ts` extension | ✓ WIRED | `:25-36`; suite executes the real module (21/21) |
| `projects-card-state.ts` | `portfolio-main-data.json` shape | runtime-free consumer contract (type-only) | ✓ WIRED | zero import statements in the module (asserted); consumers pass `PortfolioData['projects'][number]` |
| `projects-stack-stage.tsx` | `projects-card-state.ts` | `import { cardState, firstSentence, projectTechnologies, projectYear, projectVisualVariant, swipeAccepts }` | ✓ WIRED | `:32-39`, used at `:82-83, 114, 365, 418, 443, 463, 483, 488` |
| `projects-stack-stage.tsx` | `explore-panels.tsx` | `closest('[data-editorial-wrapper]')` scroll-target discovery | ✗ NOT_WIRED | gap 5 — retired with the scroll composition |
| `projects-stack-stage.tsx` | `framer-motion` | the only sanctioned JS motion engine in the projects composition | ✓ WIRED | `:24-30`; allowlist test passes; single import site under `src/` |
| `projects-section.tsx` | `projects-stack-stage.tsx` / `projects-mobile-stack.tsx` | import + render per viewport | ✓ WIRED | `:11-12, 33-38` |
| `projects-mobile-stack.tsx` | `projects-stack-stage.tsx` | `ProjectsSwipeStack mode="compact"` | ✓ WIRED | `:15-19` |

## Data-Flow Trace

Trace (verified end to end, not assumed):

`src/data/portfolio-main-data.json` → `src/app/explore/page.tsx` (static import) → `ExplorePanels` adapter closure `projects: ({ data }) => <ProjectsSection projects={data.projects} />` (`explore-panels.tsx:96`) → `ProjectsSection` `projects.slice(0, 6)` (`projects-section.tsx:20`) → `ProjectsStackStage`/`ProjectsMobileStack` → `SwipeCard` → `GenerativeVisual(project.name)` / `CardHeader` / `CardExpandedPanel`.

Evidence that data actually flows (level 4, not just "wired"):
- `out/explore.html` (rebuilt this run, exit 0) contains all six JSON names — `DeepIndex`, `Clarif-AI`, `SDK4ED-TD`, `ServicedMetricsCalculator`, `Avoid Traffic Extended`, `Uom Track` — plus the DeepIndex terminal-mock strings, as real server-rendered text/markup.
- `firstSentence`, `projectYear`, `projectTechnologies` all take the project description/date and are asserted against the real JSON in `tests/projects-stack.test.mjs` (no copied literals).
- No hardcoded portfolio content in the phase files; the only literals are variant names and the pinned `TECH_LEXICON`; `FIXED_VARIANTS` keys two project names (`DeepIndex`, `Clarif-AI`) exactly as locked by CONTEXT D-03.
- The single `<img>` in `out/explore.html` belongs to the About avatar (REV-15), not to a Projects card — the cards fetch zero image assets.

## Behavioral Spot-Checks

| # | Check | Command | Result |
|---|---|---|---|
| 1 | Pure geometry/content contract | `node --test tests/projects-stack.test.mjs` | **21/21 pass**, exit 0 — includes `cardState: loop invariant — a full cycle of 6 frontIndex steps returns the initial arrangement`, `reduced-motion branch pins translate/scale/rotation to 0`, `swipeAccepts: threshold semantics`, `visibility drops below the 0.05 opacity cutoff`, `totality` |
| 2 | Phase integration pins | `node --test tests/explore-visuals.test.mjs` | **31/31 pass**, exit 0 — includes `EXPLORE-10 invariant (REV-21): projects stack is swipe-driven, centered, loopable and shadowed` (gone-checks, allowlist, drag/`swipeAccepts`, shadow/`overflow-visible`, `aria-hidden`, `pointer-events-none`, mobile delegation) |
| 3 | Plan-03 full-gate claim | `node --test tests/*.test.mjs` | **267/267 pass**, exit 0, no skips (14 suites) on the final workspace state |
| 4 | Type gate | `npm run typecheck` | exit 0, no output |
| 5 | Build + static export | `npm run build` | exit 0; `/`, `/explore`, `/resume` exported static; SSR assertions above read from the freshly written `out/explore.html` |

Probe execution: not applicable (presentation-layer phase, no migration/tooling step).

## Requirements Coverage

| REQ | Status | Basis |
|---|---|---|
| REV-18 | **PARTIAL** | Delivered: editorial rows replaced by a 6-card stack; geometry from the pure, unit-testable `cardState`; both directions reversible (ring buffer, loop invariant pinned). Not delivered as written: `cardState(cardIndex, carouselProgress)` continuous scroll-driven promotion, sticky stage, release at the range ends — all retired by the 2026-09-25 user directive (`b39b12c`). Gap 1-3 |
| REV-19 | **PARTIAL** | Delivered: rounded corners, compact header (name + year + ≤120-char tagline), monochrome token-only generative visuals with `aria-hidden` and zero image assets, deterministic ±2-4px/±1° imperfection, active-card expansion carrying description + technologies + links, links `rel="noopener noreferrer"`. Deviations: 5 distinct variants for 6 cards (`ServicedMetricsCalculator` and `Uom Track` both `network`) vs the SPEC acceptance "6 distinct variants"; the 75-85% visual-area proportion is unmeasured (human item) |
| REV-20 | **VERIFIED** | Keyboard Prev/Next + arrows + Home/End with focusable 44px controls; reduced motion = opacity/zIndex state swaps with drag disabled and zero translate/scale/rotation; no listeners/observers to leak (none added; framer owns its own); mobile compact stack (active card + one peek, no horizontal scroll, `h-[420px]`); all content from `portfolio-main-data.json`; dual-engine grep ban holds (framer-motion in exactly one `src/` file; no rAF/gsap/lottie/`.animate(` in the projects files) |

## Anti-Patterns Found

No debt markers: zero `TBD`/`FIXME`/`XXX`/`TODO`/placeholder text in any file this phase created or modified. No skipped tests, no stubs, no disabled assertions. Advisory findings only:

| ID | Severity | Finding |
|---|---|---|
| AP-1 | WARNING | Generative-visual variant collision: `projectVisualVariant` yields 5 distinct variants for the 6 cards (`ServicedMetricsCalculator` and `Uom Track` both `network`, `projects-card-state.ts:186`), against the SPEC acceptance "6 distinct variants". The locked D-03 hash contract permits it, so this is a design-record conflict, not a code defect; if distinctness is wanted, salt the hash for one of the two or add a third flagship pin. |
| AP-2 | WARNING | `projects-mobile-stack.tsx` is 20 lines against the plan's `min_lines: 130`. Capability is delivered by delegation (compact mode in the shared stack) and is test-pinned; recorded as an accepted deviation, not a stub. |
| AP-3 | WARNING | Reduced-motion hydration parity is unconfirmed: framer's `useReducedMotion()` initialises from `matchMedia` on the first client render (`node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs`), while SSR renders `false`. For a user with OS reduced motion on, the first client render can differ from the server markup (style attributes). Requires a browser check (see Human Verification 4). |
| AP-4 | INFO | Stale comment: `tests/explore-visuals.test.mjs:619-621` still calls `projects-stack-stage.tsx` "the editorial stage" / "projects editorial scroll". |
| AP-5 | INFO | Stale docstring: `explore-panels.tsx:8-13, 36-38` still states that Projects carries its own sticky range and is gated on the top-6 slice, contradicting `buildPlacement` (`projects: { wrapper: '', shell: '', gate: false }`). |
| AP-6 | INFO | `className` includes the literal token `'aria-hidden'` (`projects-stack-stage.tsx:504`) — a no-op class; the real `aria-hidden` prop is set correctly at `:518`. |
| AP-7 | INFO | `CardState.activeAmount` is produced but never consumed by the swipe stage (the expanded panel animates on mount); it remains part of the pinned UI-SPEC §3 contract. |

## Human Verification Required

Not placed in the frontmatter because the status is `gaps_found` (rule a precedes rule b). If the five gaps are accepted as directive overrides, the residual status is `human_needed` on these items.

1. **test:** Swipe/drag feel on desktop (mouse) and touch: grab the foreground card, drag past ~100px or flick past 500px/s, release; assert it flies off, the card behind promotes one level, the flown card loops to the back, and a below-threshold drag springs back without overshoot.
   **expected:** Continuous, restrained (editorial-calm, no bounce) motion; after 6 swipes the original arrangement returns; counter stays honest (`01 / 06` … `06 / 06`).
   **why_human:** Gesture feel, promotion timing and spring restraint are interactive and cannot be asserted statically.

2. **test:** Shadow bloom: confirm the foreground card's `--panel-shadow-hover` bloom is visible on the cards beneath it in **both themes** and is not clipped by any ancestor (`overflow-visible` chain through the stage container, panel body and shell).
   **expected:** The shadow reads as depth above the stack in dark and light themes, with no hard cut at a container edge.
   **why_human:** Clipping/visibility depends on computed layout and theme tokens; it was an explicit user directive item.

3. **test:** Visual-first proportion and mobile invariant: at md+ measure that the generative visual occupies ~75-85% of the card; at 375px check the compact stack (no horizontal scroll, active card dominant, exactly one peek card, readable content at 100% zoom).
   **expected:** IDE aesthetic preserved; no horizontal scrolling; text legible.
   **why_human:** Visual proportion and small-viewport rendering need a real viewport/screenshot.

4. **test:** Reduced motion in a real browser with the OS setting ON: reload `/explore` and step with the controls; confirm instant state swaps with no translation/scale/rotation, and no hydration warning or visible style flash in the console.
   **expected:** Opacity/z-index swaps only; no React hydration mismatch (see AP-3).
   **why_human:** Requires an OS-level media-query setting and console inspection.

5. **test:** Keyboard-only pass: tab to the stack, then Arrow keys, Home/End, and the Prev/Next buttons; confirm the announced project name updates and that no focus lands on a hidden card's link.
   **expected:** `Project NN of 06: <name>` announcements; focus stays on the controls; hidden cards expose no links (they render none).
   **why_human:** Focus order and live-region announcements are only observable in a browser + screen reader.

## Gaps Summary

Five gaps, all four truth-gaps traceable to the single recorded user directive of 2026-09-25 (`b39b12c`, `.planning/quick/2026-09-25-projects-swipe-loop-stack/TASK.md`) that replaced the scroll-driven composition with a swipe-driven ring buffer after live review:

1. Continuous `f(cardIndex, carouselProgress)` scroll geometry — **superseded**, not broken. Restoring it would contradict the user's directive.
2. The sticky md+ scroll stage — **superseded** (panel returned to natural height; stack is a centered fixed-height block).
3. Keyboard stepping by `main.scrollTo` to a scroll band — **superseded** (stepping is state-driven; the keyboard contract itself is fully met).
4. Resize remeasurement — **obsolete** once the scroll band is gone; no resize handling is needed by the delivered interaction.
5. Key link `projects-stack-stage.tsx → closest('[data-editorial-wrapper]')` — **not wired**, because the useScroll target discovery was deleted with the scroll composition.

Recommended closure (no code restoration): treat gaps 1-4 as accepted overrides and update the ROADMAP phase-10 goal + REV-18/REV-20 acceptance wording from `cardPosition = f(cardIndex, carouselProgress)` / "sticky scroll-driven stage" to the delivered ring-buffer contract `cardState(cardIndex, frontIndex)` with swipe/keyboard promotion and looping; delete or replace the plan-02 key link (gap 5) since the wrapper attribute now serves the Experience stage only. Separately worth a decision: AP-1 (5 distinct visuals for 6 cards) and the four human-verification items above.

Verification evidence for the delivered interaction itself is strong and current: 21/21 pure-contract tests, 31/31 integration pins, 267/267 full suite, typecheck clean, build + static export clean, SSR markup carrying all six project names — all run against this working tree.
