---
phase: 10-projects-stack-revision
plan: 02
type: execute
wave: 2
depends_on:
  - "EXPLORE-10-projects-stack-revision-01"
files_modified:
  - "src/components/explore/sections/projects-stack-stage.tsx"
  - "src/components/explore/sections/projects-mobile-stack.tsx"
autonomous: true
requirements: ["REV-18", "REV-19", "REV-20"]
gap_closure: false
user_setup: []
must_haves:
  truths:
    - "The desktop stack renders all 6 project cards inside the sticky md+ stage with continuous scroll-driven depth geometry."
    - "The foreground DeepIndex card renders name, tagline, and the terminal generative visual as real SSR markup."
    - "The 4 non-fixed generative visuals are selected by a stable djb2(project.name) % 4 function, not hard-coded per project."
    - "Keyboard Prev/Next and arrow keys step the carousel by scrolling the main container to the target band."
    - "Reduced motion removes translate/scale/rotation motion and uses opacity/zIndex state swaps."
    - "Mobile <md renders the new ProjectsMobileStack simplified state-driven stack (the phase-9 compact grid is retired)."
    - "Resize remeasures the stage so the keyboard scroll-band formula stays correct after viewport changes."
    - "A single-project data set renders one static active card without carousel chrome."
  artifacts:
    - path: "src/components/explore/sections/projects-stack-stage.tsx"
      provides: "Scroll-driven stacked-card carousel for md+, SSR gate, controls, keyboard/RM contracts, generative visuals (hash-selected), resize handling, single-project fallback."
      min_lines: 220
      exports: ["ProjectsStackStage"]
    - path: "src/components/explore/sections/projects-mobile-stack.tsx"
      provides: "Simplified state-driven stacked composition for <md with controls; replaces the retired phase-9 compact card grid."
      min_lines: 130
      exports: ["ProjectsMobileStack"]
  key_links:
    - from: "src/components/explore/sections/projects-stack-stage.tsx"
      to: "src/components/explore/projects-card-state.ts"
      via: "imports cardState, firstSentence, projectYear, projectTechnologies, projectVisualVariant"
      pattern: "from ['\"]\.\./projects-card-state['\"]"
    - from: "src/components/explore/sections/projects-stack-stage.tsx"
      to: "src/components/explore/explore-panels.tsx"
      via: "useScroll target discovered by closest('[data-editorial-wrapper]') inside the 300vh wrapper"
      pattern: "closest\(['\"]\[data-editorial-wrapper\]['\"]\)"
    - from: "src/components/explore/sections/projects-stack-stage.tsx"
      to: "framer-motion"
      via: "the only allowed JS motion engine in the projects composition"
      pattern: "from ['\"]framer-motion['\"]"
---

<objective>
Build the two stack presentations: the scroll-driven md+ framer-motion stage and the simplified <md state-driven stack. Both consume the same pure cardState module, the same 6-project data slice, and the same name-hash deterministic generative visual variant map. This plan is the visual/implementation core of the phase.
</objective>

<assumption_delta_decision>
- primary noun: the stacked-card carousel / `cardState(cardIndex, carouselProgress)` geometry
- decision: promote
- rationale: this phase replaces the editorial-row composition; `cardState` becomes the sole md+ Projects panel derivation, and the row/rowState contract is retired. The mobile simplified stack is the promoted responsive variant, not a parallel UI.
- invariant: every responsive path (md+ scroll-driven stack, <md state-driven stack, reduced-motion opacity-only swap, keyboard step) consumes the same `projects.slice(0, 6)` data slice and the same `cardState` active-index rule.
</assumption_delta_decision>

<context_reconciliation>
- **Generative visual selection** is locked to a stable `djb2(project.name) % 4` hash per CONTEXT.md D-03 / RESEARCH.md OQ-3. DeepIndex is always variant 0 (`terminal-mock`) and Clarif-AI is always variant 1 (`contract-analysis`) outside the hash; the remaining four projects are mapped by the hash to `['glyph','report','dashboard','network']` (exact composition labels are executor discretion). **Recorded decision note (checker W-1): the UI-SPEC §4.4 table's NAMED per-project assignments are superseded by this hash contract — the table is illustrative of the resulting compositions, not a binding assignment; this note is the deviation record so no executor treats the table as hard-coded.**
- **Mobile tier** is the new `ProjectsMobileStack` per REV-20 / UI-SPEC §2.3. The phase-9 compact card grid is retired; see the updated D-06 / OQ-5. **Reconciliation note (checker W-2): CONTEXT.md D-06's "compact list fallback per the phase-9 <md pattern" phrase is OVERRIDDEN by this phase's mobile stack — the phase-9 compact grid is retired, not kept as a fallback; this note is the recorded override so the executor does not honor the stale phrase.**
</context_reconciliation>

<context>
Read before implementing:
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-UI-SPEC.md §2-§8
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/sections/projects-editorial-stage.tsx (mount gate and useScroll precedent to reuse)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/use-timeline-progress.ts (keyboard scroll-to-role precedent)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/explore-panels.tsx (wrapper/shell recipe and data-editorial-wrapper)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/projects-card-state.ts (output of plan 01)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/app/globals.css (token names for monochrome visuals)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/data/portfolio-main-data.json (top-6 project names in data order)
</context>

<tasks>
  <task type="auto">
    <name>Task 1 (Tracer): Implement the md+ scroll-driven stack stage with SSR gate, resize handling, single-project fallback, and all 6 generative visuals selected by name-hash determinism</name>
    <files>src/components/explore/sections/projects-stack-stage.tsx</files>
    <read_first>src/components/explore/sections/projects-editorial-stage.tsx, src/components/explore/explore-panels.tsx, .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-UI-SPEC.md</read_first>
    <action>
      Create `src/components/explore/sections/projects-stack-stage.tsx` as a `'use client'` island. Mirror the editorial-stage mount gate exactly: outer `div` ref, `useEffect` discovers `document.querySelector('.explore-shell > main')` and the `closest('[data-editorial-wrapper]')`; only render the motion `Inner` when both elements exist; otherwise render an `SsrStack` at `carouselProgress = 0` so the DeepIndex foreground card is real text/markup at build time per D-05/D-06.
      The `Inner` component:
      - `containerRef`/`targetRef` initial values are the discovered elements (never undefined — this avoids the useScroll container-ref trap);
      - `useScroll` over the wrapper with `offset: ['start start', 'end end']` produces the single `progress` MotionValue;
      - per-card `useTransform` consumes `cardState(cardIndex, progress.get(), count, reducedMotion)` for `translateY`, `translateX`, `scale`, `opacity`, `rotation`, `zIndex` (transform string: `translateY(${y}px) translateX(${x}px) scale(${s}) rotate(${r}deg)`);
      - `style.visibility` derives from the `visible` geometry flag (hide cards whose opacity fell below the cutoff);
      - `aria-hidden` is set by the foreground-only rule `activeIndex !== cardIndex` (UI-SPEC §7 / REV-20) — every non-active card is hidden from the accessibility tree regardless of opacity;
      - `useReducedMotion()` is passed to `cardState` and also gates CSS transitions;
      - Add a `ResizeObserver` on the discovered `[data-editorial-wrapper]` that remeasures `wrapperEl.offsetHeight`, `wrapperEl.offsetTop`, and `mainEl.clientHeight` on resize and stores them in state/refs; schedule a one-frame re-derivation of the keyboard scroll-band math (UI-SPEC §6.3) via a small state tick or MotionValue `set`; include a `window.addEventListener('resize', ...)` fallback for older environments; clean up both on unmount (D-05). The keyboard helper must recompute `targetScrollTop` from the fresh values every time it runs: `const targetScrollTop = offsetTop + targetProgress * (offsetHeight - mainClientHeight)`.
      Render 6 cards inside a relative centered container, but first short-circuit when `cards.length <= 1` (UI-SPEC §6.4 / §8): render one static active card with the expanded panel fully visible, no controls, no behind-cards, no `activeAmount` animation.
      Non-short-circuit card shell:
      - card shell: `w-full max-w-[540px] max-h-full aspect-[4/3] rounded-lg border border-border bg-card mx-auto relative overflow-hidden`;
      - generative visual layer: `absolute inset-0`, `aria-hidden="true"`, monochrome SVG/CSS using only token colors (`border`, `muted-foreground`, `accent`, `foreground`, plus `destructive` ONLY for the Clarif-AI warning triangles per UI-SPEC §4.4), no gradients, no `<img>`;
      - visual variant selection per D-03/OQ-3: import `{ projectVisualVariant }` from `../projects-card-state` and call `projectVisualVariant(project.name)` for each card. For DeepIndex this returns `'terminal-mock'`, for Clarif-AI `'contract-analysis'`, and for the other four projects it returns one of `['glyph','report','dashboard','network']` via the stable `djb2(project.name) % 4` helper exported from the pure module. Do not hard-code project names to variant labels in the stage; the selection must be stable under re-ordering.
      - header strip at bottom: project name + optional year chip + tagline (`firstSentence(description, 120)`) using `text-sm`/`text-xs` `text-foreground`/`text-muted-foreground`;
      - inactive cards: `pointer-events-none`, `aria-hidden="true"` (foreground-only rule), `tabIndex={-1}` on links;
      - active card only: render the expanded info panel and expose links.
      At this tracer stage, the expanded panel and controls are intentionally omitted; only the stack motion + visuals + headers are live.
    </action>
    <verify>Run `npm run typecheck` and `npm run build`. The build must succeed and the new file must be the only framer-motion import under src/components/explore when later verified.</verify>
    <acceptance_criteria>
      - `src/components/explore/sections/projects-stack-stage.tsx` exists and typechecks.
      - The file imports from `'framer-motion'` exactly once.
      - `npm run build` exits 0.
      - Grep confirms `data-editorial-wrapper` is consumed via `closest('[data-editorial-wrapper]')`.
      - Grep confirms **BOTH** `ResizeObserver` **AND** `window.addEventListener('resize'` are present in the file (checker W-5 — the action mandates the observer plus the fallback; the acceptance requires the redundancy, not either-or).
      - Grep confirms a `cards.length <= 1` short-circuit branch.
      - Grep confirms `projectVisualVariant` is imported from `../projects-card-state` and used in the visual variant selection path; no hard-coded mapping of the four remaining project names to variant labels.
    </acceptance_criteria>
    <done>Tracer complete: SSR+scroll stack renders cards with hash-selected generative visuals; resize and single-project edge cases are covered; component compiles and builds.</done>
  </task>

  <task type="auto">
    <name>Task 2: Add controls, keyboard stepping, active-card expansion, reduced-motion branch, and accessibility</name>
    <files>src/components/explore/sections/projects-stack-stage.tsx</files>
    <read_first>src/components/explore/use-timeline-progress.ts, .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-UI-SPEC.md §5/§7</read_first>
    <action>
      Extend `src/components/explore/sections/projects-stack-stage.tsx`:
      - Wrap the stack in a `<div role="group" aria-label="Projects carousel">` and add an `sr-only aria-live="polite"` region that announces `Project {activeIndex + 1} of {count}: {project.name}` throttled to one announcement per 500ms (store `lastAnnouncementRef` and only update when activeIndex changes and 500ms elapsed).
      - Compute `activeIndex = Math.round((count - 1) * clampedProgress)`. Only the `activeIndex` card renders the expanded panel (W-6 foreground-only rule). The expanded panel is `absolute left-0 right-0 bottom-[strip-height] z-10` over the visual layer, `transform-origin: bottom`, with opacity/scaleY/translateY driven by `activeAmount` from `cardState` (no height animation).
      - Expanded panel content per UI-SPEC §4.3: full `firstSentence` description, up to 4 `projectTechnologies` chips, primary project link (`target="_blank" rel="noopener noreferrer"` with `ArrowUpRight`), optional `sourceUrl` secondary link when present and `!== link`; inactive cards hide links (`aria-hidden` + `tabIndex={-1}`).
      - Control row below the stack: Prev (`ChevronUp`) and Next (`ChevronDown`) 44px ghost buttons using the exact `GHOST_INTERACTION` recipe from `experience-section.tsx` (`rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`), `aria-label="Previous project"` / `aria-label="Next project"`, `disabled` at clamped ends with `disabled:opacity-50`, counter `01 / 06` `font-mono text-[10px] tabular-nums text-muted-foreground`.
      - Keyboard handler on the group root: `ArrowUp`/`ArrowLeft` step -1, `ArrowDown`/`ArrowRight` step +1, `Home` to 0, `End` to count-1; `preventDefault` only on handled keys; stepping calls `goToCard(index)` which sets `main.scrollTo({ top: targetScrollTop, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })` using the formula in UI-SPEC §6.3 with the remeasured `wrapperEl.offsetTop`, `wrapperEl.offsetHeight`, and `mainEl.clientHeight` from the ResizeObserver state: `const targetScrollTop = offsetTop + targetProgress * (offsetHeight - mainClientHeight)`.
      - Reduced-motion branch: `cardState` already returns translateY/scale/rotation 0 and opacity-only; ensure the control stepping uses `'auto'` behavior; CSS transitions are suppressed by the existing guard.
      - Reaffirm the foreground-only a11y rule: every non-active card carries `aria-hidden="true"` and `tabIndex={-1}` on links, independent of opacity.
      - Cleanup: remove any added listeners/observers in the `useEffect` return; framer `useScroll` cleans its own listener.
    </action>
    <verify>Run `npm run typecheck` and `npm run build`.</verify>
    <acceptance_criteria>
      - Grep confirms `role="group"`, `aria-label="Projects carousel"`, `aria-live="polite"`, `Previous project`, `Next project`, `ChevronUp`, `ChevronDown`.
      - Grep confirms a `goToCard`-equivalent scroll helper using `main.scrollTo`.
      - Grep confirms `aria-hidden` is applied by the active-index rule (e.g. `aria-hidden={activeIndex !== cardIndex}` or equivalent helper).
      - `npm run build` exits 0.
    </acceptance_criteria>
    <done>Desktop stack is fully interactive, accessible, reduced-motion safe, and resize-aware.</done>
  </task>

  <task type="auto">
    <name>Task 3: Implement the <md simplified mobile stack</name>
    <files>src/components/explore/sections/projects-mobile-stack.tsx</files>
    <read_first>src/components/explore/sections/projects-section.tsx, .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-UI-SPEC.md §2.3</read_first>
    <action>
      Create `src/components/explore/sections/projects-mobile-stack.tsx` as a `'use client'` component (state-driven, no framer-motion import). It receives the same `projects` prop (top-6 slice) and uses local `useState` for `activeIndex` (default 0). Render inside a fixed-height container (`h-[420px]` tunable U-item) with the active card centered and full opacity/scale, the ONE adjacent peek card above or below at `±28px` offset, scale `0.94`, opacity `0.7`; deeper cards are `visibility:hidden` (W-11 pin: exactly 2 cards visible). Under reduced motion, remove the peek/offset translations (opacity-only, cards static at their slots); read `window.matchMedia('(prefers-reduced-motion: reduce)')` only inside `useEffect` (or via `useSyncExternalStore` with an SSR-safe fallback), and initialize the reduced-motion state to `false` for the server — this file must NOT import framer-motion. Non-active cards are `aria-hidden="true"` with `tabIndex={-1}` links. Reuse the same card shell, generative visuals (via `projectVisualVariant(project.name)` imported from `../projects-card-state`), header strip, and expanded panel as the desktop stack. Render the same Prev/Next 44px controls and counter below the container; stepping updates `activeIndex` directly (no scroll hijack). Ensure no horizontal scroll and the 375px invariant holds. Short-circuit `projects.length <= 1` by rendering one static active card with the expanded panel fully visible and no controls.
    </action>
    <verify>Run `npm run typecheck` and `npm run build`.</verify>
    <acceptance_criteria>
      - `src/components/explore/sections/projects-mobile-stack.tsx` exists and does NOT contain `'framer-motion'`.
      - Grep confirms `h-[420px]` or equivalent fixed mobile height, `md:hidden` usage in `projects-section`, and no `overflow-x-auto`/`overflow-x-scroll`.
      - Grep confirms `window.matchMedia` is guarded inside `useEffect` or `useSyncExternalStore` (not during render).
      - `npm run build` exits 0.
    </acceptance_criteria>
    <done>Mobile stack is a readable, reduced-motion-safe, SSR-safe simplified composition that replaces the retired compact grid.</done>
  </task>
</tasks>
