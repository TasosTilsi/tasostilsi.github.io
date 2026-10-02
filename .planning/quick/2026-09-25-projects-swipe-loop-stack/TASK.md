# Quick task 2026-09-25-projects-swipe-loop-stack

**Task:** Rework the Projects stacked-card carousel interaction from scroll-driven to Tinder-style swipe (user directive after live review: "do not make it scrollable this time for the projects — make it like the Tinder cards that the user has to swipe right or left, the project cards more centered in the div, loopable — the front swipe goes to the back of the stack — and it must also show the shadows from behind the first card").

Current state: the Projects panel renders a scroll-driven stacked-card carousel (sticky wrapper + scroll-derived carouselProgress + cardState(cardIndex, carouselProgress)) built in phases 9-10. Files: src/components/explore/sections/projects-section.tsx, src/components/explore/sections/projects-stack-stage.tsx, src/components/explore/projects-card-state.ts, tests/projects-stack.test.mjs + related suites.

Requirements:
1. REMOVE the sticky scroll wiring for the Projects stack: the 300vh wrapper and scroll-derived carouselProgress are retired — the panel returns to natural height with the stage as a centered block (the wrapper data-conditional logic goes; keep the PanelShell chrome).
2. CENTER the stack: the card stack is horizontally and vertically centered in the stage div (no top-anchored offset composition).
3. Tinder swipe interaction (framer-motion drag): the front (foreground) card is draggable — `drag="x"` with the same reduced-motion guard; on drag end, if |offset.x| exceeds a pinned threshold (~100px) OR velocity exceeds a pinned bound, the swipe ACCEPTS: the card animates flying off in the swipe direction (x ±exit distance, slight rotation in the drag direction, opacity → 0), then LOOPS to the BACK of the stack (depth = last level, zIndex lowest, offsets reset); the remaining cards promote one depth level forward (animated, Editorial-calm 200-280ms soft ease-out — no bounce); if below threshold → spring back to center (restrained). Swipe left AND right both cycle (the fly-off direction follows the swipe side).
4. LOOPABLE ring buffer: the stack is cyclic — after the 6th card is swiped, the 1st returns to the front; there is always exactly one foreground card; the counter (aria-live, throttled) shows the cycle position honestly (e.g. 'Card 3 of 6').
5. Shadows from behind the first card: the front card's shadow bloom (the existing --panel-shadow-hover treatment or an always-on softer variant) must render visibly BEHIND the front card onto the cards beneath — verify the shadow is not clipped (overflow-visible on the stack container where needed) and is visible in both themes.
6. In-card info, generative visuals, curated imperfection, and the dual-engine grep ban carry over unchanged; the non-active cards stay aria-hidden + pointer-events-none EXCEPT the front card is the drag target.
7. Keyboard + a11y contract survives: Prev/Next buttons step the cycle (Next = send front card to back with a left-fly-off, Previous = bring the back card forward with a right-fly-off — mirrored directions); aria-labels 'Previous project'/'Next project'; the throttled aria-live announces the new front card; reduced motion = instant reorder (no fly-off animation, opacity-only).
8. Mobile: the swipe works natively on touch (the same drag props); below md the stack stays the simplified composition (active card dominant) now swipe-driven too.
9. Stale-test discipline: tests/projects-stack.test.mjs and related suites renew — the scroll-progress tests rewrite to the swipe/loop contract (cardState's geometry table survives but its input becomes the drag/swipe state + ring position, not carouselProgress; pin the loop invariant: after a full cycle of 6 swipes the stack returns to its initial arrangement; pin the threshold semantics; pin the shadow presence).
10. Gate chronologically last: npm run typecheck && npm run build && node --test tests/*.mjs — all green. Commit atomically: "feat(explore): projects stack becomes swipe-driven Tinder-style loop with centered cards and visible depth shadows (user directive)". Do NOT push. Report the commit hash + what changed.
**Run:** 2026-09-25T17:28:19.094Z

## Result

**commit** `b39b12c61e5ad8cb6fee2926b5c148c17522e97e` — `feat(explore): projects stack becomes swipe-driven Tinder-style loop with centered cards and visible depth shadows (user directive)`

**green gate** — `npm run typecheck` clean, `npm run build` OK, `node --test tests/*.mjs` 248/248 pass.

**what changed**:
- `src/components/explore/projects-card-state.ts` — `cardState` now takes a ring-buffer `frontIndex`; added pinned `SWIPE_THRESHOLD`/`SWIPE_VELOCITY_THRESHOLD` + `swipeAccepts()`.
- `src/components/explore/sections/projects-stack-stage.tsx` — new single-framer `ProjectsSwipeStack` with `drag="x"`, fly-off/loop animation, centered stage, `--panel-shadow-hover` bloom on the foreground card, keyboard Prev/Next loop.
- `src/components/explore/sections/projects-mobile-stack.tsx` — thin compact wrapper over the shared stack.
- `src/components/explore/sections/projects-section.tsx` + `src/components/explore/explore-panels.tsx` — removed the 300vh sticky wrapper and scroll-driven wiring for Projects; PanelShell chrome stays.
- `tests/projects-stack.test.mjs`, `tests/explore-visuals.test.mjs`, `tests/explore-shell.test.mjs`, `tests/explore-sweep.test.mjs` — renewed to the swipe/loop/ring contract.

Not pushed.