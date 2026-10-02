# Doublecheck spec

## Goal
A throwaway /motion-demo prototype page lets the user live-compare two scroll-transition engines (hand-rolled rAF vs framer-motion) for the upcoming scroll-driven editorial content transition, committed on branch phase-8 without breaking the static export.

## Scope
In: new files src/app/motion-demo/page.tsx (server shell: metadata + banner + divider), demo-shared.tsx (entries + keyframes + card chrome), engine-a-raf.tsx (typed hook: passive window scroll listener + rAF coalescing, transform/opacity writes, cleanup, reduced-motion opacity-only), engine-b-framer.tsx (useScroll + useTransform + useReducedMotion), and a prototype-contract test in tests/. framer-motion added as a TEMPORARY dependency. Out: changes to any existing file, sitemap/nav links, tests for the production phases, git push.

## Acceptance criteria
1) npm run typecheck and npm run build both pass and out/motion-demo.html is emitted; 2) node --test over the repo test suites (including the new prototype-contract suite) is green covering the final tree; 3) both sections render identical visuals from the same ENTRY_MOTION keyframes (outgoing 0→-80px / 1→0.15→0, incoming 120px→0 / 0→1, coexistence windows at 1/3 and 2/3 ± 1/12); 4) reduced-motion yields opacity-only swaps in BOTH engines (no translateY); 5) banner text exact, metadata title "Motion Engine Prototype", no reference to /motion-demo anywhere in src outside the new directory; 6) commit contains only package.json, package-lock.json and the new motion-demo files + its contract test.

## Failure modes
a) 'use client' + metadata export in one file breaks the Next build → keep page.tsx a server shell, interactive demo in sibling client components (recorded deviation from the literal single-file wording, no existing file touched). b) framer-motion version incompatible with React 18.3.1/Next 15 → verify installed version 13.x peer range and that the build passes. c) new route leaks into navigation/sitemap → assert no src reference to /motion-demo outside the new directory. d) engine A drifts from engine B visually → both consume the same shared ENTRY_MOTION arrays and shared card chrome. e) scroll hijack → no preventDefault, no wheel/touch listeners; window scroll only, passive.

## Priorities
Identical visual parity between the two engines > minimal throwaway size > perf niceties. The page and its contract test are both disposable after the engine decision.

## Non-goals
No sitemap/metadata integration beyond the banner; no design-system changes; no push; no production adoption of framer-motion (removed after the user picks); the page is deleted after the decision.
