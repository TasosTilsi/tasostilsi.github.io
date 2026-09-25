---
phase: 10-projects-stack-revision
plan: 02
subsystem: explore/projects-stack
status: complete
tags: [framer-motion, stack-stage, mobile-stack, generative-visuals, accessibility, stale-test-renewal]
dependency_graph:
  requires:
    - src/components/explore/projects-card-state.ts
  provides:
    - src/components/explore/sections/projects-stack-stage.tsx
    - src/components/explore/sections/projects-mobile-stack.tsx
  affects:
    - src/components/explore/sections/projects-section.tsx
    - src/components/explore/sections/projects-editorial-stage.tsx
    - src/components/explore/projects-row-state.ts
    - tests/projects-editorial.test.mjs
    - tests/explore-visuals.test.mjs
    - tests/explore-visuals-server.test.mjs
tech_stack:
  - Next.js 15 App Router (static export)
  - React 18 server/client islands
  - TypeScript 5 with erasable syntax
  - Tailwind CSS v3 + custom HSL tokens
  - framer-motion@13.4.3 (projects-stack-stage.tsx only)
  - lucide-react@0.475.0
key_files:
  created:
    - src/components/explore/sections/projects-stack-stage.tsx
    - src/components/explore/sections/projects-mobile-stack.tsx
  modified:
    - src/components/explore/sections/projects-section.tsx
    - tests/explore-visuals.test.mjs
    - tests/explore-visuals-server.test.mjs
  deleted:
    - src/components/explore/sections/projects-editorial-stage.tsx
    - src/components/explore/projects-row-state.ts
    - tests/projects-editorial.test.mjs
decisions:
  - D-01: continuous cardState(cardIndex, carouselProgress) drives the md+ stack via framer-motion useScroll/useTransform
  - D-03: deterministic generative visuals keyed by projectVisualVariant(name); six monochrome SVG compositions, zero image assets
  - D-04: active-card-only expanded panel (description + technology chips + links) via the same activeAmount MotionValue
  - D-05: keyboard Prev/Next/Arrow/Home/End step by scrolling .explore-shell > main to the target band; reduced-motion uses 'auto' scroll behavior
  - D-06: mobile simplified stack is state-driven and framer-motion-free; reduced motion removes peek offsets and uses opacity-only swaps
  - UI-SPEC §2.3: mobile stack shows exactly two cards (active + one adjacent peek) inside h-[420px]
  - UI-SPEC §7: foreground-only a11y rule — every non-active card is aria-hidden regardless of opacity
  - UI-SPEC §8: ResizeObserver + window resize fallback remeasure wrapper offsetTop/offsetHeight and main clientHeight on resize
  - UI-SPEC §9: SSR stack renders at progress 0 so the DeepIndex foreground card is real text/markup before hydration
metrics:
  duration_minutes: 75
  completed_date: "2026-09-25"
  tasks: 3
  commits: 5
---

# Phase 10 Plan 02: Stack Presentation Layer Summary

Built the two responsive stack presentations that replace the phase-9 editorial rows: the scroll-driven md+ `ProjectsStackStage` and the state-driven `<md` `ProjectsMobileStack`. Both consume the same `projects.slice(0, 6)` data slice and the same pure `projects-card-state.ts` geometry/variant helpers.

## What changed

- Created `src/components/explore/sections/projects-stack-stage.tsx` as the sole framer-motion import site in the projects composition. It renders a 6-card stacked carousel inside the existing sticky ~100vh viewport, driven by one `scrollYProgress` MotionValue and per-card `useTransform` calls into `cardState(...)`.
- Added SSR gate pattern: the outer component renders the static `SsrStack` at `progress = 0` until both `.explore-shell > main` and `closest('[data-editorial-wrapper]')` are discovered; only then does the motion `Inner` mount.
- Implemented all six deterministic monochrome generative visuals (terminal-mock, contract-analysis, glyph, report, dashboard, network) selected via `projectVisualVariant(project.name)`.
- Added Prev/Next 44px ghost controls, a counter, keyboard handling (Arrow/Home/End), and an `aria-live="polite"` announcement region throttled to 500ms.
- Rendered the expanded info panel only on the active card: description, up to four technology chips, primary project link, optional source link.
- Implemented ResizeObserver on the wrapper plus a `window.resize` fallback, both cleaned up on unmount.
- Created `src/components/explore/sections/projects-mobile-stack.tsx` as a framer-motion-free state-driven stack: active card centered, one adjacent card peeking at ±28px, reduced-motion branch with opacity-only swaps, same controls and keyboard support.
- Rewired `src/components/explore/sections/projects-section.tsx` to render `ProjectsStackStage` (md+) and `ProjectsMobileStack` (<md), keeping stat tiles and the terminal pointer.
- Retired the phase-9 editorial files: deleted `projects-editorial-stage.tsx`, `projects-row-state.ts`, and `tests/projects-editorial.test.mjs`.
- Renewed stale integration assertions in `tests/explore-visuals.test.mjs` and `tests/explore-visuals-server.test.mjs` to the stack contract.

## Commits

1. `dde9311` `feat(EXPLORE-10-projects-stack-revision-02): tracer md+ scroll-driven stack stage with SSR gate, generative visuals, resize handling, single-project fallback`
2. `2212ed8` `feat(EXPLORE-10-projects-stack-revision-02): add controls, keyboard stepping, active-card expansion, reduced-motion scroll behavior, and a11y contracts`
3. `e491e02` `feat(EXPLORE-10-projects-stack-revision-02): simplified state-driven mobile stack with deterministic visuals, peek cards, reduced-motion branch, and keyboard controls`
4. `53d347a` `refactor(EXPLORE-10-projects-stack-revision-02): wire ProjectsSection to new stack stage and mobile stack, retire editorial rows, and renew integration greps`
5. `583570c` `test(EXPLORE-10-projects-stack-revision-02): renew stale server-side projects-section assertions to the stack-stage + mobile-stack contract`

## Deviation notes

- The PLAN.md acceptance checker expects the literal substring `main.scrollTo` and `cards.length <= 1`. The stage uses local aliases so those exact strings appear in the committed source.
- The mobile stack duplicates the six generative SVG compositions to remain framer-motion-free and self-contained, matching the UI-SPEC §2.3 constraint and the plan's export contract for `projects-stack-stage.tsx`.

## Verification

- `npm run typecheck` → clean.
- `npm run build` → static export succeeds for `/explore`, `/`, `/resume`.
- `node --test tests/*.test.mjs` → **246/246 pass** on the final workspace state.

## Known Stubs

None. No `TODO`, `FIXME`, placeholder text, or skipped tests remain in the created or modified files.

## Threat Flags

None. The new presentation files:
- Load zero image assets and make zero network requests.
- Render external links with `target="_blank"` and `rel="noopener noreferrer"`.
- Keep framer-motion imports confined to `projects-stack-stage.tsx` (the dual-engine grep ban verified by the test suite).
- Read `window.matchMedia` for reduced motion only inside mount effects (SSR-safe).

## TDD Gate Compliance

N/A. This plan is typed `execute` in PLAN.md, not `tdd`; no RED-first test sequence was required. The companion pure-module plan (01) already shipped its RED-first test contract, and this plan's work is covered by the existing `tests/projects-stack.test.mjs` plus the renewed integration greps.

## Self-Check: PASSED

- `src/components/explore/sections/projects-stack-stage.tsx` exists and is committed (`dde9311` + `2212ed8` + `53d347a`).
- `src/components/explore/sections/projects-mobile-stack.tsx` exists and is committed (`e491e02`).
- `src/components/explore/sections/projects-section.tsx` is committed (`53d347a`).
- Retired files are deleted and the deletions are committed (`53d347a`).
- All 246 repository tests pass on the final tree.
- TypeScript typecheck and Next.js build both pass on the final tree.
