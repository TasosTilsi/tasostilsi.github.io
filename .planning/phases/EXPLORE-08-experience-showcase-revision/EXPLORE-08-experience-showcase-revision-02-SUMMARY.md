# Phase 8 Plan 02: Stage Composition + Scroll-Channel Hook Summary

The full-width interactive semicircular timeline composed end-to-end: the panel grid rebalanced to [Experience full-width] / [About+Contact | Skills] / [Projects full-width] via a data-conditional placement map, the Experience panel body rewritten into the sealed UI-SPEC stage (single-DOM arc zone + content layers + two controls, SSR = Chubb real text), and the `use-timeline-progress` hook wiring scroll → progress → rAF writes over plan 01's pure module — with every stale test renewed atomically per the replacement discipline.

---
phase: EXPLORE-08-experience-showcase-revision
plan: 02
subsystem: explore-timeline
tags: [timeline-stage, arc-svg, sticky-range, raf, keyboard, reduced-motion, resize-observer, mobile-compact, ssr-export, grid-rebalance, test-renewal, REV-07, REV-12, REV-13]
requires:
  - "src/components/explore/timeline-geometry.ts (plan 01's pure derivation module — computeProgress/continuousIndex/activeIndexFromContinuous/markerAngle/markerEmphasis/contentLayer/reducedMotion*/viewBoxToPx/markerPoint/scrollTargetForRole/selectTimelineRoles/dateLineFits; roleCount is the LAST carousel parameter; TimelineRole = {year, entry})"
  - ".planning/phases/EXPLORE-08-experience-showcase-revision/EXPLORE-08-experience-showcase-revision-UI-SPEC.md (§1.1 placement, §1.2/§1.3 stage+range, §2.2 arc SVG, §2.4 markers, §3 layers, §4 controls, §5 keyboard, §6 rAF authority, §7 reduced-motion, §8 B-1, §9 SSR, §10 a11y — NORMATIVE)"
  - ".planning/phases/EXPLORE-08-experience-showcase-revision/EXPLORE-08-experience-showcase-revision-CONTEXT.md (D-01…D-07)"
  - "src/components/explore/explore-shell.tsx:67-71 ('.explore-shell > main' is the ONLY scroll container — p-4 md:p-6 padding feeds rel)"
  - "src/components/explore/panel-shell.tsx (className param is the only touchpoint — chrome byte-identical, R-1)"
  - "src/components/explore/explore-tour.tsx:60-61,110,157-159 (GHOST_INTERACTION recipe, main selector precedent, RM behavior branch verbatim)"
provides:
  - "src/components/explore/use-timeline-progress.ts — the interaction hook (seam 2): passive scroll listener on '.explore-shell > main' → rAF-coalesced derivation passes (batched reads: wrapper/main rects + main padding-top → computeProgress/continuousIndex/activeIndexFromContinuous), per-marker transform/opacity writes (markerAngle + markerPoint, B-2 label alignment, reducedMotionAngle/reducedMotionEmphasis under RM), per-layer contentLayer writes, ResizeObserver geometry refresh (E-6), keyboard ArrowUp/ArrowDown + Prev/Next through ONE goToRole → main.scrollTo(scrollTargetForRole(...)) with the tour's RM behavior branch (RM-3), md gate '(min-width: 768px)' WITH change listener (compact form clears SSR inline styles once; dormant below md — computeProgress never runs), reduced-motion read FRESH per pass (E-13, exactly one matchMedia read), full unmount cleanup (E-7: scroll + md change + RO.disconnect + cancelAnimationFrame + fade timer)"
  - "src/components/explore/sections/experience-section.tsx — the stage (seam 3): 'use client' retaining the pinned { experience } signature; ONE DOM (§8 B-1) = group root [aria-label='Career timeline', the keydown target] → interior row md:grid md:grid-cols-[2fr_3fr] md:h-[calc(100dvh-14rem)] → arc zone (hidden md:flex; aria-hidden SVG viewBox '0 0 100 200' path 'M 100 0 A 100 100 0 0 0 100 200' non-scaling-stroke; 3 dot + 3 year-label real-text markers at data-timeline-* hooks, inline opacity 0 pre-measurement, one-shot 150ms inline-opacity fade; control row: Prev/Next 44px buttons with the tour GHOST_INTERACTION recipe + 01/03 counter) | content column (§3 grid-stack layers md:col-start-1 md:row-start-1, md:hidden year chips, U-8 merged meta verbatim, ≤3 bullets, W-4-gated date line, sr-only aria-live region, TerminalPointer)"
  - "src/components/explore/explore-panels.tsx — the grid rebalance (seam 4): data-driven PLACEMENT Record (about/skills empty; experience wrapper 'order-first + span-2 + md:h-[300vh]', shell 'md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]'; projects shell span-2) — BOTH experience placements conditional on selectTimelineRoles(data.experience).length > 1 (W-3); wrapper is a plain div with NO id (R-3); md:z-10 guards the pinned card against later siblings (research §1.8.1); chrome/index chips/entrance stagger untouched"
  - "Four renewed suites: explore-shell (placement-whitelist grid test), explore-sweep (whitelist + md-scoping row + sticky-breaker audit, +2 rows), explore-visuals-server (stage-composition anatomy + gone-checks, filter-governed roles, client inversion), explore-visuals (clientBodies slice, matchMedia confined to the hook, REV-08 row repointed at the arc, rAF ban narrowed to the two sanctioned sites)"
affects:
  - "EXPLORE-08-experience-showcase-revision-03 (consumes the composed stage: wrapper/stage/geometry classes are stable; any export-level or visual assertions build on the renewed suites)"
  - "Wizard/tour/visited/status-bar flows verified untouched (explore-tour 44/44, header 9/9, routing 7/7, skills 10/10, data-integrity 18/18, resume-docx-order 14/14)"
tech-stack: [next-15-static-export, react-18-client-slice, hand-rolled-rAF, tailwind-v3, zero-new-deps]
key_files:
  created:
    - "src/components/explore/use-timeline-progress.ts"
  modified:
    - "src/components/explore/sections/experience-section.tsx"
    - "src/components/explore/explore-panels.tsx"
    - "tests/explore-shell.test.mjs"
    - "tests/explore-sweep.test.mjs"
    - "tests/explore-visuals-server.test.mjs"
    - "tests/explore-visuals.test.mjs"
decisions:
  - "DEV-1 (sequencing): Task 2's interaction contracts (keyboard, RM branches, ResizeObserver, md gate, cleanup) landed WITHIN Task 1's commit 89e014d — the hook was authored complete against the full REV-13 contract in one pass instead of a deliberately-partial intermediate state. Task 2's verify ran on the committed tree (typecheck + build + suites + all acceptance greps green, zero functional delta); its only commit (175dcab) is doc-comment raw-grep hygiene. E-7's keydown item needs no removeEventListener — the keydown handler is a React onKeyDown prop on the group root (the plan's 'ONE keydown listener attached to the stage body root'), so React owns attach/detach and nothing can leak; the §5 no-document/window-listener intent is honored."
  - "DEV-2 (§9 fade mechanics): the marker first-paint fade is an INLINE one-shot transition (el.style.transition armed at the first measured pass, cleared by a 150ms timer — cleaned up on unmount) instead of the plan's 'removes the transition class imperatively': marker classNames carry activeIndex-dependent classes, so a React-restored transition class would re-lag every subsequent rAF write after the first role change. The inline transition is not React-restored, and the reduced-motion guard (transition:none !important on .explore-shell *) suppresses it outright — RM-4 stays instant and R-6 stays the single suppressor."
  - "DEV-3 (§6 vocabulary reconciliation): the discrete marker class swap rides transition-colors duration-200 ease-out, not the plan's shorthand transition-[color,opacity] — opacity and transform are written PER-FRAME by the hook's rAF channel and UI-SPEC §6 row 1 forbids CSS transitions on per-frame-written properties (a transition would lag the scroll); the color-only set still smooths the discrete swap (row 2's intent)."
  - "DEV-4 (§3 stack stability): the layers container gained md:space-y-0 — the plan's 'space-y-5 md:grid' shorthand would keep the 20px sibling margins inside the single grid cell, offsetting stacked layers by 20px per index and breaking the stable-height single-cell stack §3 pins. space-y-5 stays for the <md stacked list."
  - "DEV-5: no geometryReady state — its only intended consumer (the marker fade gate) is served by the inline one-shot transition (DEV-2) and the W-4 predicate consumes arcZoneWidth state (a real geometry-change re-render, §6-sanctioned); a third state would be dead weight."
  - "DEV-6 (test renewal beyond the plan's enumerated list): the motion suite's rAF ban (explore-visuals.test.mjs:559-566) was rewritten even though Task 1.d did not list it — the hook necessarily uses rAF (UI-SPEC §6/D-04), so the invariant became 'no rAF outside the TWO sanctioned sites (tour measurement + timeline hook)' with the hook's requestAnimationFrame/cancelAnimationFrame pinned. Replacement discipline, not weakening."
  - "DEV-7: the interior row carries md:h-[calc(100dvh-14rem)] (U-2 default) — the plan's Task 1.g listing omitted the height class but §1.2/U-2 pin it, and without a definite height the arc zone's flex-1/meet-mapping has no geometry. Under-fill is the safe direction (never over-fills the pin viewport)."
  - "DEV-8: the hook inlines window.matchMedia('(min-width: 768px)') at its three read sites (no constant) so the plan's greppable matchMedia literal lives in CODE, not comments; the reduced-motion query stays behind the ONE helper (exactly one raw grep line, per-pass reads only)."
  - "Class-order note: the date line/counter/year-chip utilities order tabular-nums BEFORE text-muted-foreground (e.g. 'text-[10px] tabular-nums text-muted-foreground') — zero visual difference (Tailwind is order-independent) and it keeps the kept U-8 merged-meta test's banned-substring check ('text-muted-foreground tabular-nums' = the old stacked pattern) green without editing that kept assertion."
metrics:
  duration: "~50 min (RED 4-suite run → 2 commits → Task-3 gates → final full gate)"
  completed: "2026-09-24T15:05:00+03:00"
  tasks: 3
  commits: 2
  suite_delta: "199 → 201 (+2: the sweep md-scoping + sticky-breaker rows)"
  gate_run_1: "typecheck exit 0 + build exit 0 + four rewritten suites 30/16/11/23 all green + six neighbor suites (44/9/7/10/18/14) green + export greps (Chubb real text, visibility:hidden ×2, arc path d, control labels)"
status: complete
---

## What was built

**Task 1 (tracer, commit `89e014d`)** — RED first: the four stale suites were rewritten to the new contracts (UI-SPEC §13 replacement discipline) and run against the UNCHANGED source — 12 new-contract failures on record (shell 1, sweep 3, visuals-server 2, visuals 6 incl. the hook's ENOENT). Then the source landed and the same suites went green:

- `tests/explore-shell.test.mjs` — grid test rewritten to the placement whitelist: exactly 2 × span-2 + exactly 1 × order-first + `md:sticky md:top-0` + both md-scoped height classes + the lookbehind ban on the unprefixed range height; the about-conditional ban retained (the placement map is a Record lookup).
- `tests/explore-sweep.test.mjs` — both grid rows rewritten to the same whitelist; section-order + grid-cols-1 base rows kept verbatim; +2 rows: every placement/height utility md:-prefixed (R-9) and the sticky-breaker audit (no overflow utility on the panels grid).
- `tests/explore-visuals-server.test.mjs` — stage-composition anatomy (group root, arc zone first body child, gone-checks on the rail grammar, bg-chart-2 survives), filter-governed role selection (D-06 supersedes the phase-7 order-cap), client inversion; the U-8 merged-meta test kept UNTOUCHED and green against the new layer anatomy.
- `tests/explore-visuals.test.mjs` — experience-section + the hook moved to a new clientBodies list; matchMedia ban narrowed to the server set with both hook queries pinned present; REV-08 row repointed at the arc path + md:hidden year chip + client inversion; rAF ban narrowed to the two sanctioned sites (DEV-6).
- `src/components/explore/explore-panels.tsx` — data-driven PLACEMENT Record (no id-comparison conditional), W-3 data-conditional experience placements, plain no-id wrapper (R-3), md:z-10 stacking guard, PanelShell chrome byte-identical via the className param, registry/index chips/entrance stagger untouched.
- `src/components/explore/use-timeline-progress.ts` (NEW) — the interaction hook: passive scroll on `.explore-shell > main` → rAF-coalesced derivation passes (batched reads → computeProgress → continuousIndex → activeIndexFromContinuous → markerAngle/markerPoint/markerEmphasis → contentLayer), geometry via ResizeObserver, reduced-motion branches per pass, md gate with change listener, full cleanup.
- `src/components/explore/sections/experience-section.tsx` — the stage: "use client" line 1, pinned `{ experience }` signature, E-1 null guard, single-DOM composition (arc SVG + 6 marker nodes + 3 content layers + 2 controls), SSR = `contentLayer(i, 0, false)` inline (Chubb real text, layers 1–2 `visibility:hidden`), W-4 date line, aria-live region, TerminalPointer.

**Task 2 (commit `175dcab`)** — interaction-contract verification pass on the committed tree (DEV-1: the contracts landed in Task 1's commit): keyboard ArrowUp/ArrowDown → goToRole → `main.scrollTo(scrollTargetForRole(...))` with the tour's RM behavior branch and fresh rel; buttons share the same path and disable at the clamped ends; reduced motion freezes markers at {180°,135°,90°} (reducedMotionAngle), swaps content opacity-only, suppresses the dot size-class swap (W-7) via the post-mount discrete read; ResizeObserver recomputes geometry rAF-coalesced; the md gate clears SSR layer styles on entering compact and re-owns visibility on re-entering md+; unmount cleans scroll + md-change listeners, RO, pending rAF, fade timer. All Task 2 acceptance greps green (single reduced-motion read line, no RM change-listener, no cursor-pointer/tabIndex/current-state attribute on markers, aria-live present).

**Task 3 (verification only, no commit)** — typecheck 0, build 0, six untouched neighbor suites green (explore-tour 44, explore-header 9, explore-routing 7, explore-visuals-skills 10, portfolio-data-integrity 18, resume-docx-order 14 — zero defects surfaced), and the §9 export contract: Chubb title/company/duration/location real text, `visibility:hidden` ×2 (layers 1–2), `aria-label="Career timeline"`, Previous/Next role labels, `d="M 100 0 A 100 100 0 0 0 100 200"`, `id="experience"` exactly once (wrapper carries no id, R-3), 8 inline `opacity:0` (3 dots + 3 labels + 2 hidden layers).

## TDD Gate Compliance

Plan type is `execute` (not `tdd`) — no test:-before-feat: ordering requirement applies. Red/green discipline was still honored inside Task 1: the four rewritten suites ran RED against the unchanged source (12 failures on record) before any source edit landed, then went green in the same atomic commit per the replacement discipline.

## Known Stubs

None. Stub scan (`TODO|FIXME|placeholder|not implemented|XXX|HACK`) over the three source files returns zero hits; `ℹ skipped 0` on every suite run (9 explore suites checked).

## Threat Flags

None. Threat-surface scan over the three files: no eval/child_process/dangerouslySetInnerHTML/process.env/localStorage (localStorage stays confined to use-explore-visited.ts — the CLI-key-disjointness greps untouched); the only event surface is a passive scroll listener + a group-scoped keydown handler (no document/window listeners, no wheel/touch listeners — the no-hijack contract holds, greppable); zero new dependencies (deps count 38 asserted by the existing suite, still green); all writes are transform/opacity to the stage's own elements; input surface remains the typed portfolio data file.

## Self-Check: PASSED

- Created file exists: `src/components/explore/use-timeline-progress.ts` (353 lines ≥ min 110; exports useTimelineProgress). Modified files exist: `experience-section.tsx` (254 ≥ min 170), `explore-panels.tsx` (152 ≥ min 100), and the four test files (478/291/160/752 lines ≥ mins 440/250/150/690). ✓
- Commits on `phase-8`: `89e014d` (Task 1 — exactly its 7 files) → `175dcab` (Task 2 — exactly its 2 files). Task 3 is verification-only (no files, no commit). Two atomic commits, no blanket adds, no amends. ✓
- Gate run 1 green on the tree (Task 3's record): typecheck + build + four rewritten suites + six neighbor suites + export greps. ✓
- Green-gate-finality: SUMMARY + STATE written next, then the FULL gate (typecheck + build + all 11 suites) re-runs as the chronologically last action (run 2), anchoring the completion claim on the exact final tree. ✓

---

*Executed 2026-09-24 · plan EXPLORE-08-experience-showcase-revision-02 · wave 2 of the phase-8 loop*