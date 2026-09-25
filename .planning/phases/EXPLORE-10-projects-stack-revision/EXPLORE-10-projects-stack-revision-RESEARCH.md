# EXPLORE-10-projects-stack-revision — Research

## 1. Domain analysis

### 1.1 What this phase has to build

The Projects panel’s editorial-row scroll (phase 9, REV-17) is replaced by a curated, scroll-driven stacked-card carousel (REV-18/REV-19/REV-20). The work is a **presentation-layer swap** inside the existing `/explore` IDE shell:

- The sticky ~100vh stage, the 300vh extended wrapper, the stat tiles and the `TerminalPointer` all stay in place [VERIFIED: `src/components/explore/explore-panels.tsx:121-132`, `src/components/explore/sections/projects-section.tsx:53-63`].
- The rows composer (`ProjectsEditorialStage`) and its pure module (`projects-row-state.ts`) are deleted; a new client stage and a new pure `projects-card-state.ts` take their place (stale-test discipline).
- The new stage is the **only** sanctioned `framer-motion` import site in the projects composition; the Experience panel keeps its hand-rolled rAF engine (dual-engine contract) [VERIFIED: `tests/explore-visuals.test.mjs:605-653`].

### 1.2 Standard stack for this task

The project already runs the exact stack needed:

- **Framework:** Next.js 15 App Router with static export (`output: 'export'`) [VERIFIED: `next.config.ts:5`, `src/app/explore/page.tsx:1-53`].
- **React:** 18.3.1, server components by default, `'use client'` islands for motion/interaction [VERIFIED: `package.json:48`].
- **Styling:** Tailwind CSS v3.4.1 + custom HSL tokens scoped under `.explore-shell` [VERIFIED: `package.json:62`, `src/app/globals.css:499-586`].
- **Motion:** `framer-motion@13.4.3` (installed and already used for the editorial scroll) [VERIFIED: `package.json:42`, `src/components/explore/sections/projects-editorial-stage.tsx:45-52`].
- **Icons:** `lucide-react@0.475.0` for controls and links [VERIFIED: `package.json:45`, `src/components/explore/sections/projects-editorial-stage.tsx:53`].
- **Data:** one typed JSON file, `src/data/portfolio-main-data.json`, with 6 top projects in data order [VERIFIED: `src/data/portfolio-main-data.json:195-202`, `src/data/portfolio-main-data.d.ts:20-27`].

No new dependency is required and none should be added; the context explicitly bans it [VERIFIED: `CONTEXT.md` decisions D-06].

### 1.3 Patterns to reuse and pitfalls to avoid

| Pattern / pitfall | How the phase should handle it | Evidence |
|---|---|---|
| **Single scroll source** | The carousel progress must come from `.explore-shell > main`, never `window`. `window.scrollY` is always 0 inside the shell. | [VERIFIED: `src/components/explore/explore-shell.tsx:57-73`, `src/components/explore/sections/projects-editorial-stage.tsx:59-62`] |
| **useScroll container-ref trap** | `useScroll` throws if its `container`/`target` refs are `undefined` and permanently caches a bad fallback. The stage must SSR a static stack first, then mount the motion `Inner` only after both elements are discovered. | [VERIFIED: `src/components/explore/sections/projects-editorial-stage.tsx:44-52`, `171-186`, `296-327`] |
| **Sticky stage layout** | The extended wrapper is `md:col-span-2 md:h-[300vh]` and the shell pins at `md:h-[calc(100dvh-10rem)]`; the rows viewport inside the shell is `md:h-[calc(100dvh-14.5rem)]`. Reuse these exact recipes. | [VERIFIED: `src/components/explore/explore-panels.tsx:121-132`, `src/components/explore/sections/projects-section.tsx:57-63`] |
| **Continuous derivation** | Card geometry must be `cardState(cardIndex, carouselProgress)` — one 0→1 progress value, no discrete thresholds as the primary motion driver. | [VERIFIED: `CONTEXT.md` D-01] |
| **Reduced motion** | JS side uses `useReducedMotion()`; CSS side is already gated by `@media (prefers-reduced-motion: reduce)` under `.explore-shell`. Under reduced motion the stack collapses to opacity/zIndex state swaps with no translation/scale/rotation. | [VERIFIED: `src/app/globals.css:647-660`, `src/components/explore/sections/projects-editorial-stage.tsx:178`, `CONTEXT.md` D-05] |
| **SSR / no-JS** | The foreground card (index 0 = DeepIndex) must render real text/markup before hydration. The static stack is rendered at `progress = 0`. | [VERIFIED: `src/components/explore/sections/projects-editorial-stage.tsx:107-149`, `CONTEXT.md` acceptance criteria] |
| **Keyboard accessible alternative** | Provide Prev/Next buttons that set `main.scrollTo({ top: bandPosition })`, mirroring the timeline `goToRole`/`stepRole` path. Arrow keys can share the same step function. | [VERIFIED: `src/components/explore/use-timeline-progress.ts:323-351`, `CONTEXT.md` D-05] |
| **Mobile fallback** | Below `md` the stage is CSS-hidden and a compact card grid owns the surface. Reuse the existing `md:hidden` block; it already satisfies the 375px invariant and no horizontal scroll. | [VERIFIED: `src/components/explore/sections/projects-section.tsx:64-114`] |
| **No image assets** | Generative visuals must be monochrome SVG/CSS compositions using the design tokens; `aria-hidden`; no `<img>`, no gradients, no external fetches. | [VERIFIED: `CONTEXT.md` D-03 / REV-19 acceptance] |
| **Dual-engine ban** | `framer-motion` is allowed only in the new projects stack; `requestAnimationFrame`, `gsap`, `lottie`, `.animate(` remain banned everywhere else under `src/components/explore`. | [VERIFIED: `tests/explore-visuals.test.mjs:605-653`, `CONTEXT.md` D-06] |

### 1.4 Confidence levels

- **High** — stack, sticky layout, scroll source, framer-motion APIs, data schema, SSR gate pattern, reduced-motion contracts.
- **Medium** — the exact “feel” numbers for stack depth/opacity; these are inside the ranges the brief gives and are tunable U-items.
- **High** — test replacement path (delete row module, create card module, rewrite integration greps).

---

## 2. Package legitimacy

| Package | Why it appears | Verified status |
|---|---|---|
| `framer-motion@^13.4.3` | Already the installed motion engine for the editorial composition; the new stack reuses `useScroll`, `useTransform`, `useReducedMotion`. | [VERIFIED: `package.json:42`] |
| Official docs for `useScroll`, `useTransform`, `useReducedMotion` | The APIs needed are documented in the Motion for React docs. | [CITED: `https://motion.dev/docs/react-use-scroll`, `https://motion.dev/docs/react-use-transform`, `https://motion.dev/docs/react-use-reduced-motion`] |
| `lucide-react@^0.475.0` | Icons for links (`ArrowUpRight`) and controls; Prev/Next buttons can reuse `ChevronUp`/`ChevronDown`. | [VERIFIED: `package.json:45`, `src/components/explore/sections/projects-editorial-stage.tsx:53`] |

**No new package installation is required or permitted** [VERIFIED: `CONTEXT.md` D-06].

---

## 3. Risks and Open Questions

Every Open Question below is marked **(RESOLVED)** before planning proceeds.

### OQ-1 — Where do the “technologies” on the active card come from? *(RESOLVED)*
`portfolio-main-data.json` has no `technologies` field on `Project`; the schema only exposes `name`, `description`, `date`, `link`, `sourceUrl`, `featured` [VERIFIED: `src/data/portfolio-main-data.d.ts:20-27`].  
**Resolution (locked):** The active card’s expanded header renders the one-line description (first sentence, ≤120 chars), the available link(s), and up to four technology chips derived deterministically from the project description via the pinned `TECH_LEXICON` in UI-SPEC §4.5. The lexicon scan is lower-cased on both sides, returns first-appearance order, deduplicated, capped at 4, and falls back to an empty array when no term matches. This does **not** add a `technologies` data field to the JSON (still out of scope); it derives a transient lexicon match at render time. `projectTechnologies(description, max = 4)` is therefore a required export of the pure `projects-card-state.ts` module per D-04 / UI-SPEC §4.5 [VERIFIED: `UI-SPEC.md` §4.5, `CONTEXT.md` D-04, REV-19 acceptance].

### OQ-2 — Exact card geometry constants inside the brief’s ranges *(RESOLVED)*
The brief gives ranges, not exact numbers: behind-cards step `translateY -30..-45px`, scale `0.96 / 0.92 / 0.88`, opacity `0.95 / 0.85 / 0.7` [VERIFIED: `CONTEXT.md` D-01].  
**Resolution (locked by UI-SPEC §3):** Use a continuous function keyed by signed distance `s = (count - 1) * progress - cardIndex`:
- `translateY` interpolated from the level table: `Y_upcoming = -l * 38`, `Y_leave = -l * 38 - 56` for `l ≥ 1` (LEAVE_EXTRA = 56 px),
- `scale = clamp(1 - 0.04 * l, 0.80, 1)`,
- `opacity` interpolated between keyframes `(0→1, 1→0.95, 2→0.85, 3→0.70, 4→0.50, 5→0.30)`; visible cutoff at `opacity ≤ 0.05`,
- `zIndex = 100 - ceil(|s|) * 10 - (s > 0 ? 5 : 0)`,
- `rotate` and `translateX` offsets come from the deterministic per-index arrays in UI-SPEC §3.6 (see OQ-3).  
UI-SPEC §3 is the final locked source of truth; these constants supersede the earlier draft numbers. Extrapolation beyond l=5 uses the same per-level deltas until opacity drops below the visible cutoff.

### OQ-3 — Deterministic assignment of the four remaining generative visuals *(RESOLVED)*
DeepIndex is fixed to “terminal/context-engine mock” and Clarif-AI to “contract-analysis panel”; the other four projects map to architecture/glyph/report variants by name-hash determinism [VERIFIED: `CONTEXT.md` D-03].  
**Resolution:** Use a stable djb2-style hash of `project.name` modulo 4 to pick from `['glyph','report','dashboard','network']`. The four variants are:
1. `glyph` — abstract architecture glyphs / node graph,
2. `report` — quality-report / metrics panel,
3. `dashboard` — KPI grid / bar indicators,
4. `network` — service topology / route lines.  
All are monochrome SVG/CSS compositions using only `foreground`, `muted-foreground`, `border`, `accent` tokens; `aria-hidden`; no gradients or images.

### OQ-4 — SSR stack: should inactive cards render at all? *(RESOLVED)*
The acceptance criterion says “the foreground card (DeepIndex) renders with its name/tagline/visual as real text/markup; hydration activates the carousel” [VERIFIED: `CONTEXT.md` acceptance criteria].  
**Resolution:** The `SsrStack` renders all 6 cards with `cardState(index, 0)` geometry. Card 0 is full opacity/scale/top z-index; cards 1-5 are behind with reduced opacity/scale/offset. They remain real markup, but their partial visibility is acceptable for the stacked composition.

### OQ-5 — Mobile: keep the compact list or build a new stacked swipe? *(RESOLVED)*
The brief says “mobile collapses to a simplified stacked composition (active card dominant, behind-cards hinted, content readable)” [VERIFIED: `CONTEXT.md` D-06, REV-20 acceptance]. UI-SPEC §2.3 details that simplified stack as a fixed-height state-driven composition with an active card and one peek card.  
**Resolution (locked):** Replace the phase-9 `<md` compact card grid with the new `ProjectsMobileStack` state-driven simplified stack per UI-SPEC §2.3. The compact card grid is retired in this phase; the 300vh wrapper and sticky stage stay `md:`-scoped and do not apply below `md`. The new mobile stack honors the 375px invariant, no horizontal scroll, 44px controls, and the reduced-motion opacity-only branch.

### OQ-6 — Which files and tests are retired by the swap? *(RESOLVED)*
The editorial rows and their tests are replaced.  
**Resolution:** Delete:
- `src/components/explore/sections/projects-editorial-stage.tsx`
- `src/components/explore/projects-row-state.ts`
- `tests/projects-editorial.test.mjs`  
Create:
- `src/components/explore/sections/projects-stack-stage.tsx`
- `src/components/explore/projects-card-state.ts`
- `tests/projects-stack.test.mjs`  
Update `tests/explore-visuals.test.mjs` integration greps from row-specific pins to stack-specific pins (framer-motion allowlist file name, pure module name, no rAF in projects files, etc.).

### OQ-7 — Keyboard focus and accessibility inside a stack of overlapping cards *(RESOLVED)*
**Resolution:** Wrap the stack in a `<div role="group" aria-label="Project stack">`. Prev/Next buttons live outside the stack (or inside the group) and keep focus. Inactive cards get `aria-hidden={true}` and `tabIndex={-1}` on their links; only the active card exposes its link(s) to tab order. The buttons use `disabled` at the clamped ends, matching the Experience-stage control pattern [VERIFIED: `src/components/explore/sections/experience-section.tsx:204-230`].

### OQ-8 — Should the whole card be a link? *(RESOLVED)*
**Resolution:** No. Only the active card’s header exposes real link(s) (`link`, and `sourceUrl` if present). Inactive cards must not promise interactivity; they render name + tagline as plain text. This preserves the “no hover affordance on unlinked cards” precedent from the editorial rows [VERIFIED: `src/components/explore/sections/projects-section.tsx:66-112`].

### OQ-9 — How is the in-card info expansion animated safely? *(RESOLVED)*
The acceptance says the active card’s header expands to carry description, technologies, and links, with the expansion animating “via transform-safe patterns” [VERIFIED: `CONTEXT.md` D-04].  
**Resolution:** The expanded content is always in the DOM and is revealed with `opacity` + a small `translateY` MotionValue driven by the same `progress`/`activeProximity`. The card itself keeps a fixed internal layout; no `height` or `width` animation is used, so no layout thrash occurs.

---

## 4. Architectural Responsibility Map

| Capability | Tier | Assignment / file | Rationale |
|---|---|---|---|
| **Data slicing** (top-6 projects, stat tiles) | Data | `src/components/explore/viz-data.ts` | Existing pure module; stays untouched. |
| **Card geometry derivation** | Domain | `src/components/explore/projects-card-state.ts` | Pure, typed, unit-testable; no runtime imports; produces `y`, `x`, `scale`, `opacity`, `zIndex`, `rotate`, `transform`, `visible`. |
| **Stacked-card visual composition** | Presentation | `src/components/explore/sections/projects-stack-stage.tsx` | Client island; owns framer-motion `useScroll`/`useTransform`, ResizeObserver, keyboard controls, reduced-motion branch, and SSR gate. |
| **Generative IDE visuals** | Presentation | Inline SVG components inside `projects-stack-stage.tsx` or co-located helpers | Monochrome, token-colored, deterministic, no image assets. |
| **Panel layout / sticky wrapper** | Presentation | `src/components/explore/explore-panels.tsx` | Already owns the 300vh wrapper + sticky shell; no change except the stage import name. |
| **Stat tiles** | Presentation | `src/components/explore/sections/project-stat-tiles.tsx` | Stays exactly as-is above the stage. |
| **Mobile simplified stack** | Presentation | `src/components/explore/sections/projects-mobile-stack.tsx` (rendered in projects-section.tsx md:hidden block) | New state-driven stack per UI-SPEC §2.3; replaces the phase-9 compact card grid. |
| **External link safety** | Presentation | `rel="noopener noreferrer"` on all external anchors | Security-sensitive but lightweight; belongs in presentation where links render. |
| **Scroll / motion integration** | Integration | `framer-motion` APIs inside `projects-stack-stage.tsx` | The only allowed JS motion engine in the projects composition. |
| **Hydration / no-JS SSR gate** | Integration | Mount-gate inside `projects-stack-stage.tsx` | Mirrors the editorial-stage gate. |
| **Reduced-motion coordination** | Integration | `useReducedMotion()` + existing CSS guard | JS and CSS suppression must agree. |
| **Validation** | Validation | `tests/projects-stack.test.mjs` + updated `tests/explore-visuals.test.mjs` | Pure function unit tests + cross-cutting grep invariants. |

No security-sensitive capability is placed in the wrong tier; data never executes, links are rendered with safe attributes in presentation, and all motion state lives in client islands.

---

## 5. Validation Architecture

| Behaviour | How it is proven |
|---|---|
| **Build / typecheck pass** | `npm run build` and `npm run typecheck` run on the final tree. |
| **Card geometry is pure and continuous** | `tests/projects-stack.test.mjs` imports `projects-card-state.ts` directly via `node --test` and asserts: <br>• `cardState(0, 0)` is foreground (y=0, scale=1, opacity=1, zIndex top). <br>• `cardState(i, 0)` for `i>0` is behind with negative y, scale < 1, opacity < 1. <br>• Monotonicity and clamping over a 0→1 sweep. <br>• Scrolling backward (`p` decreasing) reverses the same values. <br>• Reduced-motion branch has `y=0`, `scale=1`, `rotate=0` and only opacity/zIndex vary. <br>• `H ≤ 0` / non-finite totality forces `y=0` and finite opacity. |
| **6 cards rendered in a stack** | Grep / render test: `projects-stack-stage.tsx` maps exactly `projects.slice(0, 6)` to overlapping cards; the parent has `relative` positioning; children have absolute/relative stacking with z-index. |
| **Generative visuals: no image assets** | Grep asserts the file contains no `<img`, `url(`, or `from '@/assets/` inside the projects composition; SVG elements use only HSL token strings. |
| **Editorial rows are gone** | `tests/explore-visuals.test.mjs` gone-checks: `projects-editorial-stage.tsx` and `projects-row-state.ts` no longer exist; the old `data-editorial-wrapper` attribute is replaced by the stack wrapper attribute; `ProjectsEditorialStage` string absent. |
| **framer-motion isolation** | Cross-cutting grep: only `projects-stack-stage.tsx` contains `framer-motion`; all other `src/components/explore/**/*.tsx` lack it; `requestAnimationFrame` remains absent from the projects composition. |
| **Reduced-motion contract** | Source assertions: `useReducedMotion()` is imported and used; no `translateY`/`scale`/`rotate` motion values are written when reduced motion is true; CSS guard in `globals.css` is untouched. |
| **Keyboard / accessible alternative** | Grep assertions: `role="group"` with `aria-label="Project stack"`; Prev/Next `<button>` elements with `aria-label` and `disabled` at ends; `aria-hidden` on inactive cards. |
| **Mobile stack** | Grep asserts the `md:hidden` block renders `ProjectsMobileStack`; the stack is `hidden md:block`; no horizontal-scroll utilities (`overflow-x-auto`, `overflow-x-scroll`) in the projects section; `ProjectsMobileStack` does not import `framer-motion`. |
| **Data-driven content** | Grep / export test: no hardcoded project names or descriptions in `projects-section.tsx` or `projects-stack-stage.tsx`; strings come from `portfolio-main-data.json`. |
| **SSR foreground card** | Export-level test: `out/explore.html` contains the DeepIndex project name, its tagline, and an inline SVG visual as real markup before hydration. |
| **Stale-test discipline** | Old `tests/projects-editorial.test.mjs` is deleted; a new `tests/projects-stack.test.mjs` covers the replacement contract. |

---

## 6. Project Constraints (from project conventions and skills)

- **Tailwind v3 + custom HSL tokens:** all new code must use the existing token family (`background`, `foreground`, `card`, `border`, `accent`, `muted-foreground`, `chart-*`) scoped under `.explore-shell`. No raw hex colors except where the token system already defines them [VERIFIED: `tailwind.config.ts:10-93`, `src/app/globals.css:499-586`].
- **Default dark IDE theme:** the shell default is dark; light theme is an override via `html.light`. Test both before shipping [VERIFIED: `src/app/globals.css:499-586`].
- **No new dependencies:** dependency count must remain at 39 (post-recharts + framer-motion); adding a package would break the pinned integration test [VERIFIED: `tests/explore-visuals.test.mjs:358-366`, `CONTEXT.md` D-06].
- **Data-driven only:** no hardcoded portfolio content in the new components [VERIFIED: `CONTEXT.md` EXPLORE-07 / REV-20 acceptance].
- **Reduced-motion suppression is single-source:** the CSS guard in `globals.css` suppresses all `.explore-shell` CSS motion; the JS side must read `useReducedMotion()` or a fresh `matchMedia` call. Do not add a second suppressor [VERIFIED: `src/app/globals.css:647-660`, `src/components/explore/use-timeline-progress.ts:108-109`].
- **Font stack:** JetBrains Mono is scoped to `.explore-shell` via CSS variable [VERIFIED: `src/app/globals.css:502`].
- **Motion character is “editorial-calm”:** the existing vocabulary uses `cubic-bezier(0.25, 1, 0.5, 1)` and 200-280ms transitions. The stack should keep the same calm, non-bouncy feel [VERIFIED: `src/app/globals.css:600`, `tests/explore-visuals.test.mjs:472-517`, `~/.dsh/skills/motion-design/SKILL.md`].
- **Transform-only animation:** animate only `transform` and `opacity`; never `top/left/width/height` [VERIFIED: `~/.dsh/skills/motion-design/SKILL.md` §6.A, `~/.dsh/skills/design-taste-frontend/SKILL.md` §6.A].
- **No em-dash in visible copy:** the design-taste skill bans the em-dash (`—`) everywhere visible. Use hyphens for ranges [VERIFIED: `~/.dsh/skills/design-taste-frontend/SKILL.md` §9.G]. (Note: existing data-driven date spans may contain en-dash U+2013; new code should not introduce U+2014 em-dashes.)
- **Generative visuals explicitly allowed:** because the brief calls for deterministic IDE-language visuals with no image assets, hand-rolled SVG/CSS is the correct implementation, not a “fake screenshot” anti-pattern [VERIFIED: `CONTEXT.md` D-03, `~/.dsh/skills/design-taste-frontend/SKILL.md` §4.8 / §9.E].
- **One framer-motion import site:** the new stage must remain the only `framer-motion` import under `src/components/explore` outside any pre-existing allowances [VERIFIED: `CONTEXT.md` D-06, `tests/explore-visuals.test.mjs:611-618`].