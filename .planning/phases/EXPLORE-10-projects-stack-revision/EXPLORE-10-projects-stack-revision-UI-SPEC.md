# Phase 10: projects-stack-revision — UI-SPEC

**Date:** 2026-09-25  
**Design Read:** A developer-portfolio projects showcase for design-conscious recruiters, with an IDE/editorial language, leaning toward a curated stacked-card gallery inside the existing dark/light IDE shell.  
**Dials:** `DESIGN_VARIANCE = 7`, `MOTION_INTENSITY = 7`, `VISUAL_DENSITY = 4`.  
**Motion Personality:** Premium / Corporate — calm, precise, depth-driven; scroll-linked continuous motion; no bounce, no snap.

## 1. Scope & revision targets

This phase replaces the phase-9 editorial rows inside `src/components/explore/sections/projects-section.tsx` with a scroll-driven stacked-card carousel.

- **In scope:** the curated 6-card stack, the pure `cardState(cardIndex, carouselProgress)` geometry, generative IDE-language visuals, curated imperfection, in-card active info, keyboard + reduced-motion contracts, mobile simplified stack, stale-test renewal.
- **Out of scope (locked):** image assets, new dependencies, Experience stage changes, data-file changes, CLI/resume/PDF changes, wheel/touch hijacking, token/chrome replacement.

**Canonical downstream reads (must be read before implementation):**
- `src/components/explore/sections/projects-section.tsx` — DOM order and tier split.
- `src/components/explore/projects-row-state.ts` — the module this phase replaces.
- `src/components/explore/viz-data.ts` — `firstSentence`, `projectStats`.
- `src/components/explore/explore-panels.tsx:120-130` — the 300vh sticky wrapper and pinned shell.
- `src/components/explore/panel-shell.tsx:46-65` — panel chrome and `mt-3` body gap.
- `src/app/globals.css:499-586` — IDE shell tokens (dark/light).
- `src/components/explore/sections/experience-section.tsx:131-229` — Prev/Next 44px control precedent.
- `src/data/portfolio-main-data.json` — top-6 projects in data order.

## 2. Layout

### 2.1 Regions & hierarchy

The Projects panel body keeps the **ProjectStatTiles** first and the **TerminalPointer** last. Between them, the old editorial rows and the `<md compact grid are replaced by the stack.

DOM order (same as render order = tab order):

1. `ProjectStatTiles` (`src/components/explore/sections/project-stat-tiles.tsx`) — unchanged, 3-up grid above the stage.
2. **Stack stage** (`md+`) — sticky scroll-driven composition.
3. **Mobile stack** (`<md`) — simplified state-driven composition.
4. `TerminalPointer command="projects --all"` — unchanged, last.

The stage itself is composed as a single flex column:

- **Stack area** (`flex-1 min-h-0 relative`) — the 6 overlapping cards, vertically centered.
- **Control row** (`shrink-0`) — Prev / counter / Next, 44px targets, centered.

### 2.2 Stage geometry

Reuse the existing pinned chain from `explore-panels.tsx`:

| element | pinned recipe | notes |
|---|---|---|
| wrapper | `md:col-span-2 md:h-[300vh]` | the `data-editorial-wrapper` scroll target, unchanged |
| shell | `md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]` | unchanged |
| stage viewport | `hidden md:block h-[calc(100dvh-14.5rem)] overflow-hidden` | tunable U-item: adjust `-14.5rem` if the new control row needs more room; must leave space for stat tiles + controls |
| card | `w-full max-w-[540px] max-h-full aspect-[4/3] rounded-lg border border-border bg-card mx-auto` | landscape card; visual area is the background; info panel overlays the bottom |

The stage viewport is the **one sanctioned overflow clip** for the stack — cards may sweep partially above it while leaving.

### 2.3 Mobile simplified stack (`<md`)

- The 300vh wrapper and sticky shell are `md:`-scoped and do not apply below `md`.
- Render a state-driven simplified stack inside a fixed-height container (`h-[420px]`, tunable U-item).
- Active card is centered, scale `1`, opacity `1`; adjacent cards peek above/below with `±28px` offset, scale `0.94`, opacity `0.7`.
- Controls sit below the mobile container with the same Prev/Next 44px buttons and counter.
- No horizontal scroll; 375px invariant holds; all content remains readable.

## 3. Stack geometry — the pure `cardState` function

### 3.1 Signature

```ts
export interface CardState {
  translateY: number;   // px
  translateX: number;   // px, includes imperfection
  scale: number;
  opacity: number;
  zIndex: number;
  rotation: number;       // deg, includes imperfection
  activeAmount: number;   // 0..1, drives in-card info expansion
  visible: boolean;       // false → visibility:hidden + aria-hidden
}

export function cardState(
  cardIndex: number,
  carouselProgress: number,
  count: number,
  reducedMotion: boolean,
): CardState;
```

The function must have **zero runtime imports** so `node --test` can import it directly, following the `projects-row-state.ts` precedent.

### 3.2 `carouselProgress` derivation

A single framer-motion `scrollYProgress` MotionValue drives the whole stack:

```ts
const progress = useScroll({
  container: containerRef, // .explore-shell > main
  target: targetRef,         // [data-editorial-wrapper]
  offset: ['start start', 'end end'],
}).scrollYProgress;
```

`carouselProgress` is `clamp(progress.get(), 0, 1)`. The active center is:

```ts
const activeCenter = (count - 1) * carouselProgress;
const s = activeCenter - cardIndex; // signed offset from the active card
```

- `s === 0` → the card is exactly active/foreground.
- `s < 0` → the card is upcoming, behind and rising toward the front.
- `s > 0` → the card has been passed and is moving away / receding.

### 3.3 Depth-constant table (tunable U-item)

Defaults are inside the brief's ranges. Interpolation between levels uses smoothstep `t^2(3-2t)` for C1 continuous motion.

| level `l` | upcoming `Y` | leaving `Y` | scale | opacity | z-index drop |
|---|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 1.00 | 1.00 | 0 |
| 1 | -38 px | -94 px | 0.96 | 0.95 | 10 |
| 2 | -76 px | -132 px | 0.92 | 0.85 | 20 |
| 3 | -114 px | -170 px | 0.88 | 0.70 | 30 |
| 4 | -150 px | -206 px | 0.84 | 0.50 | 40 |
| 5 | -186 px | -242 px | 0.80 | 0.30 | 50 |

`leavingY` adds a `LEAVE_EXTRA = 56 px` one-time bonus so the foreground visibly moves away (`Y_leave = -l * 38 - 56` for `l ≥ 1`).

For `l > 5` extrapolate with the same per-level deltas until opacity falls below `0.05`, then clamp to `0`.

### 3.4 Continuous interpolation

For a given card:

```ts
const l = Math.abs(s);
const y = s >= 0 ? interpolateLeavingY(l) : interpolateUpcomingY(l);
const { scale, opacity } = interpolateScaleOpacity(l);
const activeAmount = 1 - clamp(Math.abs(s), 0, 1);
```

`interpolate*` reads the two nearest pinned levels and applies smoothstep.

### 3.5 z-index ordering

```ts
const zIndex = 100
  - Math.ceil(Math.abs(s)) * 10
  - (s > 0 ? 5 : 0);
```

- Active card: `100`.
- Upcoming card one level behind: `90` (paints above the leaving card).
- Leaving card one level behind: `85`.

This is derived from the continuous `s`, not a discrete state swap.

### 3.6 Curated imperfection

Per-index deterministic offsets (seeded by `cardIndex`, never `Math.random()` at render):

```ts
const IMPERFECTION_X = [-4, -2, 2, 4, 3, -3];       // px
const IMPERFECTION_ROTATION = [-1, -0.5, 0.5, 1, 0.75, -0.75]; // deg
```

Apply `index % 6`. Under reduced motion both are forced to `0`.

### 3.7 Reduced-motion branch

When `reducedMotion === true`:

- `translateY = 0`, `scale = 1`, `rotation = 0`, `translateX = 0`.
- `opacity` still derives from `clamp(1 - |s| * 0.6, 0, 1)` for quick state swaps.
- `zIndex` uses the same formula.
- `activeAmount` unchanged.

This is read via framer-motion `useReducedMotion()`; the CSS `prefers-reduced-motion` guard in `globals.css:647-659` suppresses any stray CSS transitions.

### 3.8 Visibility

```ts
const visible = opacity > 0.05 && Number.isFinite(opacity);
```

Non-visible cards get `visibility: hidden` and `aria-hidden="true"` and their links are not focusable.

## 4. Card design

### 4.1 Anatomy

Each card is a single `relative rounded-lg border border-border bg-card overflow-hidden` container with three layers:

1. **Generative visual layer** — `absolute inset-0`, `aria-hidden="true"`, fills the card, monochrome SVG/CSS, zero image assets, no gradients.
2. **Bottom info strip** — `relative z-10 border-t border-border bg-card p-3`, always shows name + tagline.
3. **Expanded active panel** — overlays the visual above the strip, anchored to the strip's top, scaling up from the bottom as `activeAmount` grows.

### 4.2 Header default (inactive)

- Project name: `text-sm font-medium text-foreground`.
- Tagline: `mt-0.5 text-xs text-muted-foreground line-clamp-2` from `firstSentence(description, 120)`.
- Date (if present): `text-xs tabular-nums text-muted-foreground` beside the name.

### 4.3 Header expanded (active)

The expanded panel renders inside the active card only when `activeAmount > 0`:

- One-line description (full `firstSentence` ≤ 120 chars).
- Technology chips (up to 4; see §4.5).
- Primary project link (external, with `ArrowUpRight`).
- Optional `sourceUrl` secondary link if present and different from `link`.

The panel animates with the same continuous `activeAmount`:

```ts
expandedPanel = {
  opacity: activeAmount,
  scaleY: activeAmount,
  originY: 1, // grows upward from the header strip
  translateY: (1 - activeAmount) * 8, // subtle upward drift
};
```

All three properties are transform-safe; no `height` animation.

### 4.4 Generative visual variants (6 distinct, monochrome, token-only)

All visuals use only `hsl(var(--border))`, `hsl(var(--muted-foreground))`, `hsl(var(--accent))`, `hsl(var(--foreground))`, and card background. No gradients, no images.

| # | project | variant | composition |
|---|---------|---------|-------------|
| 0 | DeepIndex | `terminal-mock` | Rounded terminal frame. Top-left three 4px status dots; a `>` prompt line with a blinking cursor block; 5–6 pseudo-code/JSON snippet lines of varying `opacity` (1.0, 0.6, 0.4); a bottom status bar with segmented blocks and the word `READY`. |
| 1 | Clarif-AI | `contract-analysis` | A document sheet with top header line and 6 horizontal text lines. Two clauses highlighted with a 2px-left accent bar. Two small warning triangles (`destructive` token) beside flagged lines. A right-side checklist column with empty and checked boxes. |
| 2 | SDK4ED-TD | `architecture-diagram` | Four rounded rectangular nodes labeled `Collector`, `Analyzer`, `Report`, `DB` connected by straight arrows. Node sizes vary slightly. A small pie/gauge glyph in the bottom-right corner. |
| 3 | ServicedMetricsCalculator | `metrics-dashboard` | Three number tiles at top; a bar chart with five bars of different heights; a simple line graph (polyline) below; grid tick marks. |
| 4 | Avoid Traffic Extended | `route-map` | Stylized road grid: two vertical + two horizontal lines, four intersection dots, a highlighted route path in accent, a location pin glyph, a small compass rose. |
| 5 | Uom Track | `report-table` | A table header row plus four data rows; two status pills; a small list/scroll indicator on the right; a map pin glyph above the table. |

Each visual is a deterministic function of the project name and is `aria-hidden`. The executor may tune exact pixel coordinates, but the anatomy above must remain recognizable and distinct.

### 4.5 Technologies chips

Because `portfolio-main-data.json` has no dedicated `technologies` field, derive chips deterministically from the project description:

```ts
const TECH_LEXICON = [
  'RAG', 'MCP', 'SQLite', 'TypeScript', 'tree-sitter', 'embeddings',
  'AI', 'contract', 'Technical Debt', 'metrics', 'route optimization',
  'tracking', 'Android', 'Java', 'Web', 'Electron',
];

export function projectTechnologies(description: string, max = 4): string[];
```

- Scan `description` lower-cased for each lexicon term.
- Return matches in order of first appearance, deduplicated, capped at `max`.
- If no term matches, return an empty array and render nothing (graceful-hide).

If a future data phase adds a `technologies` array to the Project type, the function should fall back to that array with a one-line change.

### 4.6 Links & focus

- Primary link: the project `link`. Renders as an external anchor with `target="_blank" rel="noopener noreferrer"`, an accent arrow icon, and the focus ring recipe.
- Secondary link: `sourceUrl` when present and not equal to `link`. Label "Source".
- An unlinked project renders as a static `div` with no hover affordance.
- Only the **active** card's links are keyboard-focusable; inactive cards are `aria-hidden` and their links carry `tabIndex={-1}`.

### 4.7 Both-theme legibility

All card colors are token-driven. In light mode the `--card` background is white/very light and `--foreground` is dark; in dark mode the shell overrides make `--card` dark and `--foreground` light. The generative visuals use `muted-foreground` for subtle lines and `accent` for highlights, both of which maintain ≥ 3:1 against `--card` in both themes.

## 5. Interaction states

### 5.1 Card hover / focus

- The whole card is **not** an interactive target unless the project has a `link`.
- Linked active card: hover/focus changes only the link text color to `accent` and the arrow icon to `accent` — **no `exp-lift`** on the card because the transform channel is owned by the scroll-driven motion system.
- Inactive cards: no hover state; pointer events should be suppressed so they do not steal focus.

### 5.2 Prev / Next controls

Use the same 44px ghost recipe as the Experience stage (`GHOST_INTERACTION` in `experience-section.tsx:88-89`):

```ts
const GHOST_INTERACTION =
  'rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
```

| state | style |
|---|---|
| default | `text-muted-foreground` (Prev), `text-accent` (Next), `h-[44px] min-w-[44px]`, ghost recipe |
| hover | `bg-muted` |
| active/pressed | `translateY(1px)` via `:active` (transform-safe, no motion conflict) |
| focus | focus ring from ghost recipe |
| disabled (at ends) | `disabled:opacity-50`, `aria-disabled="true"`, no hover background |

Icons: `ChevronUp` for Previous, `ChevronDown` for Next (vertical stack metaphor). Counter between them: `01 / 06`, `font-mono text-[10px] tabular-nums text-muted-foreground`.

### 5.3 Keyboard contract

- The stage root is a `role="group"` with `aria-label="Projects carousel"`.
- Arrow keys: `ArrowUp` / `ArrowLeft` step to the previous card; `ArrowDown` / `ArrowRight` step to the next card. Only prevent default on handled keys; unhandled keys fall through to native scrolling.
- `Home` / `End` jump to first / last card (optional but recommended).
- `Tab` moves through: active card link → Prev button → Next button.
- An `aria-live="polite"` sr-only region announces the active project name when the active card changes.

### 5.4 Reduced-motion interaction

Under reduced motion, Prev/Next still scroll the main container to the target band position, but with `behavior: 'auto'`. The cards swap state (opacity/z-index) instead of translating/scaling.

## 6. Visual behaviour & motion

### 6.1 Motion layers

- **Primary:** card translateY / scale / opacity / z-index / rotation.
- **Secondary:** in-card info expansion (opacity + scaleY + translateY).
- **Ambient:** the curated imperfection offsets and the blinking cursor inside the DeepIndex terminal visual.

### 6.2 Scroll-driven motion

- All spatial motion derives continuously from `carouselProgress` through `cardState`.
- No springs, no bounce, no snap points, no wheel/touch listeners.
- The single scroll source remains `.explore-shell > main`.
- Scrolling forward peels the foreground upward and brings the next card forward; scrolling backward reverses the exact same motion.

### 6.3 Keyboard stepping motion

Stepping sets `main.scrollTo({ top: targetScrollTop, behavior })` where:

```ts
const targetProgress = targetIndex / (count - 1);
const targetScrollTop = ...; // compute from wrapper/stage geometry
const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
```

The scroll is the single source of truth; no direct state mutation.

### 6.4 Empty / error / loading states

- **Empty list:** `ProjectsSection` returns `null` when `cards.length === 0` (existing behaviour).
- **Single project:** the stack stage is not pinned; render one static card.
- **Missing description/link/date:** graceful-hide per field — never invent fallback copy.
- **Loading:** not applicable; data is static SSG.
- **No-JS / SSR:** render the stack at `carouselProgress = 0`. The DeepIndex foreground card is real text/markup. Links are real anchors.

## 7. Accessibility

- **Landmark:** the stage group has `aria-label="Projects carousel"`.
- **Live region:** `sr-only` `aria-live="polite"` announces `Project {activeIndex + 1} of {count}: {project.name}`.
- **Hidden layers:** inactive cards are `aria-hidden="true"` and `tabIndex={-1}` on links; only the active card is in the accessibility tree.
- **Focus:** active card link is focusable; Prev/Next buttons are focusable; focus ring recipe from `GHOST_INTERACTION`.
- **Reduced motion:** covered by framer `useReducedMotion()` and the global CSS guard.
- **Contrast:** all text uses token colors; active link text on card background meets WCAG AA.
- **SSR real text:** the foreground card and its visual are rendered as real DOM at build time.

## 8. Edge coverage

| case | expected behaviour |
|---|---|
| `projects.length === 0` | Section returns `null`; no sticky wrapper. |
| `projects.slice(0,6).length <= 1` | `explore-panels.tsx` gate disables sticky wrapper; render a single static card. |
| Missing `description` | Tagline empty; no description line. |
| Missing `link` | Card is a static `div`; no link, no hover. |
| Missing `date` | No date chip. |
| `prefers-reduced-motion: reduce` | Cards do not translate/scale/rotate; opacity/z-index swaps only. |
| Mobile (`< 768px`) | Simplified state-driven stack; no horizontal scroll; 375px invariant. |
| No JavaScript / static export | Stack renders at progress 0; foreground DeepIndex is real text. |
| Theme switch | Token-driven colors adapt automatically. |
| Resize | `ResizeObserver` on the stage remeasures geometry; motion values re-derive on next frame. |
| Cleanup | Scroll listener, resize observer, keydown listener, and any pending rAF are removed on unmount. |

## 9. Stale-test renewal list

The phase-9 row contract is replaced; the following files/tests must be updated:

- **Delete:** `src/components/explore/projects-row-state.ts`.
- **Delete:** `src/components/explore/sections/projects-editorial-stage.tsx`.
- **Delete:** `tests/projects-editorial.test.mjs`.
- **Create:** `src/components/explore/projects-card-state.ts` — exports `firstSentence`, `cardState`, `projectTechnologies`, `projectYear`.
- **Create:** `src/components/explore/sections/projects-stack-stage.tsx` — scroll-driven md+ stack.
- **Create:** `src/components/explore/sections/projects-mobile-stack.tsx` — `<md` simplified stack.
- **Update:** `src/components/explore/sections/projects-section.tsx` — import the new stage and mobile stack; keep stat tiles and pointer.
- **Create:** `tests/projects-stack.test.mjs` — test `cardState` geometry, imperfection, reduced-motion branch, visibility, monotonicity, SSR snapshot at progress 0, and integration greps (editorial rows gone, framer-motion only in projects files).

The dual-engine grep ban remains: framer-motion imports are allowed **only** in the projects stack files; the Experience stage keeps its hand-rolled rAF engine.

## 10. Unresolved decisions

None. All decisions required to implement the stack are pinned above; tunable values are explicitly marked as U-items.