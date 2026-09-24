All grounding facts are verified. One correction to flag for the planner: the CONTEXT's canonical-ref claim that `parseDuration`/`YEAR_PATTERN` live in `viz-data.ts` is stale — EXPLORE-07 deleted that block; only `GLOBAL_YEAR_PATTERN` (`viz-data.ts:90`) survives as the regex precedent. Here is the full UI-SPEC:

---

# EXPLORE-08 experience-showcase-revision — UI-SPEC

**Design contract for the full-width semicircular career-timeline stage. Written before any code; the planner decomposes from this file. Every formula here is pure and unit-testable; every default marked (UNRESOLVED) is planner-assumable within the bounded discretion CONTEXT grants.**

Locked inputs (not relitigated): D-01…D-07, SPEC REV-07/REV-12/REV-13, the user's 2026-09-22 brief (semicircular arc as central metaphor, timelineProgress single source of truth, hand-rolled rAF, zero new deps), phase-7 Editorial-calm vocabulary, IDE tokens.

---

## §0 Hard rails (must not change)

| # | Rail | Grounding |
|---|---|---|
| R-1 | `PanelShell` chrome is byte-identical: accent chip `bg-chart-2`, label `Experience`, mono index **02** (map-derived — experience renders first at md+ but keeps chip 02; the chip is `EXPLORE_SECTIONS`-index-derived per D-02, never display-order-derived) | `panel-shell.tsx:46-64`, `explore-panels.tsx:84` |
| R-2 | `EXPLORE_SECTIONS` order, labels, ids are LOCKED (`about, experience, skills, projects`) — drawer anchors, tour steps, status counter, index chips all derive from it | `constants.ts:10-15` |
| R-3 | The stable section id `experience` STAYS on the PanelShell `<section>` (the sticky stage card). The extended wrapper is a plain `<div>` with **no id** | tour hole `getElementById(sectionId)` measures a rect (`explore-tour.tsx:111,124`); IO threshold uses `el.offsetHeight` (`use-explore-visited.ts:81`); drawer anchors `href="#experience"` (`explore-drawer.tsx:56`) — a 300vh wrapper carrying the id breaks all three |
| R-4 | Zero new dependencies; deps count stays 38. Icons come from `lucide-react` (already a dep) | SPEC constraint; `explore-tour.tsx:46` |
| R-5 | All spatial writes are transform/opacity only; no layout-thrashing writes; no wheel/touch event listeners anywhere | D-02/D-05 |
| R-6 | Reduced-motion suppression stays centralized in the existing guard (`globals.css:647-660`: `animation/transition: none !important` on `.explore-shell *`) — the stage must live inside `.explore-shell` (it does) and adds NO new suppressor | guard is "the single suppressor" (globals.css:584 comment) |
| R-7 | U-8 data fidelity: `duration` and `location` render AS STORED — dash style never normalized; the merged meta row idiom (`tabular-nums` duration + aria-hidden ` · ` separator) carries over verbatim | `experience-section.tsx:59-63`, test `explore-visuals-server.test.mjs:64` |
| R-8 | No gradients, no glassmorphism, no generic-SaaS patterns; IDE tokens only (`border`, `muted-foreground`, `chart-2`, `card`, `background`, `ring`) | SPEC constraint |
| R-9 | 375px invariant: no horizontal scroll at any width; all new col-span/height classes scoped `md:` | SPEC acceptance |
| R-10 | 44px minimum targets on every new control | SPEC constraint |
| R-11 | `TerminalPointer command="experience --all"` retained at the end of the content column (both md+ stage and mobile compact form) | `experience-section.tsx:80` |
| R-12 | The derivation module follows the `tour-placement.ts` pattern: ZERO runtime imports (type-only imports erased), erasable TS only, directly importable under `node --test` | `tour-placement.ts:1-12`, `viz-data.ts:14-18` |
| R-13 | Data-shaping discipline: role filtering, year parsing, and all derivations live in ONE pure module (see §15 seams) — no inline shaping in components (the `viz-data.ts` header rule) | `viz-data.ts:5-7` |
| R-14 | **Canonical-ref correction:** `parseDuration`/`YEAR_PATTERN` do NOT exist — EXPLORE-07 deleted the duration parse block (`viz-data.ts:7-9`). The year marker derives from a NEW pure function following the surviving `GLOBAL_YEAR_PATTERN` regex precedent (`/\b(?:19|20)\d{2}\b/`, `viz-data.ts:90`). Planner must not import a phantom function. | verified this session |

---

## §1 Layout — regions, hierarchy, breakpoints

### 1.1 Grid rebalance table (md+ = ≥768px)

DOM order in `.panel-grid` stays exactly `about, experience-wrapper, skills, projects` (the `EXPLORE_SECTIONS` map order — index chips and the entrance stagger `nth-child(1..4)` delays 0/40/80/120ms stay byte-stable). Placement is achieved with **three placement classes only**:

| Grid child (DOM order) | Base (<md) | md+ classes | md+ result |
|---|---|---|---|
| About+Contact panel | stacked row 1 | — | row 2, col 1 |
| **Experience wrapper** (new `<div>`) | stacked row 2, natural height | `md:order-first md:col-span-2 md:h-[300vh]` | row 1, full width, extended scroll range |
| **Experience stage** (PanelShell, inside wrapper) | normal flow card | `md:sticky md:top-0 md:h-[calc(100dvh-10rem)]` (via the existing PanelShell `className` param) | pinned, fills the pin viewport |
| Skills panel | stacked row 3 | — | row 2, col 2 |
| Projects panel | stacked row 4 | `md:col-span-2` | row 3, full width |

- Resulting md+ rows: `[EXPERIENCE full-width]` → `[About+Contact | Skills]` → `[Projects full-width]`. Zero empty cells at 375/768/1440/1920.
- **Why Projects goes full-width:** with Experience spanning row 1, the remaining three panels in a 2-col grid leave one cell empty unless Projects also spans. The no-empty-cells acceptance forces this. Flagged consequence: the Projects panel's internals are NOT redesigned — it renders wider (its 6-entry stack and 3-up stat row simply get a wider canvas). (UNRESOLVED U-7: surface at plan review if the user objects.)
- **Why `md:order-first` instead of DOM reorder:** reordering `EXPLORE_SECTIONS` would renumber the locked index chips and re-order drawer/tour/counter derivations (R-2). `order` affects grid auto-placement only.
- **Col-span scoping is mandatory:** `col-span-2` unscoped on a `grid-cols-1` base creates an implicit second column and breaks 375px stacking (R-9). The sweep tests asserting "no col-span anywhere" are rewritten, not deleted (§14).
- Sticky-breaker audit (must hold): no `overflow-*` class on the wrapper, the stage, or any element between the stage and `<main>`; the only scroll container ancestor is `<main>` (`overflow-y-auto`, `explore-shell.tsx:70`). The shell root's `overflow-x-hidden` is farther than main, so sticky attaches to main's scrollport. The `.panel-grid > *` entrance animation puts a 240ms `translateY(8px)` on the wrapper — a transform on the sticky element's parent shifts the subtree ≤8px for 240ms at mount; cosmetic, accepted.

### 1.2 Stage interior (md+)

```
┌─ PanelShell section (sticky stage, chrome row unchanged) ──────────────┐
│ ● Experience                                                    02     │
│ ┌─ interior row: md:h-[calc(100dvh-14rem)] md:grid md:grid-cols-[2fr_3fr] ─┐
│ │ ┌─ ARC ZONE (40%) ────────┐  ┌─ CONTENT COLUMN (60%) ──────────────┐ │
│ │ │  left-bulging semicircle │  │  grid-stack of 3 role layers        │ │
│ │ │  (SVG stroke + markers)  │  │  (§4) — active layer in evidence,   │ │
│ │ │  flex-1, C centered      │  │  vertically centered (justify-center)│ │
│ │ ├──────────────────────────┤  │                                     │ │
│ │ │ control row: Prev 01/03 Next │  …bullets…                        │ │
│ │ │ (h-[44px] controls, §5)  │  │                              [→ptr]│ │
│ │ └──────────────────────────┘  └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

- Arc zone: `hidden` below md (compact form, §9); at md+ a flex column — arc container `flex-1`, control row pinned at its bottom.
- Content column: flex column `justify-center`; the grid-stack (§4) + `TerminalPointer` (R-11) after it.
- Interior row height: stage `100dvh−10rem` − p-4 (2rem) − chrome row (~1.25rem) − mt-3 (0.75rem) = `100dvh−14rem`. (UNRESOLVED U-2: exact chrome-row line height; under-fill is the safe direction — never over-fill past the pin viewport.)
- Stage height math (verified chrome): header `h-[52px]` + intro `md:min-h-[20px]` + status bar `sm:h-8` (32px) + main `md:p-6` (48px) = 152px; `100dvh−10rem` (160px) under-fills by 8px — guarantees the stage never exceeds the pin viewport (an over-filled stage makes the range tail unreachable).

### 1.3 Wrapper/sticky geometry + range length (REV-12 core)

| Quantity | Pin |
|---|---|
| Wrapper height | `md:h-[300vh]` (UNRESOLVED U-1: default 300vh; tunable band 250–350vh — 3 role bands ≈ 100vh of scroll each, "unhurried") |
| Scrollable range | `range = wrapperHeight − stageHeight` (≈ 300vh − (100dvh−10rem) ≈ 2 scrollports) |
| Sticky engage | stage `md:top-0` — pins flush with main's content-box top (sticky constraint rect = scrollport inset by main's padding; main's 24px padding remains visible above the pinned stage — intentional) |
| Progress measurement | rAF-throttled `scroll` listener on **`<main>`** (the scroll container — never `window`). Per frame: `rel = (wrapperRect.top − mainRect.top) − mainPaddingTop`; `progress = clamp(−rel / range, 0, 1)`. `rel = 0` at engage → progress 0; `rel = −range` at release → progress 1; clamped outside — scrolling before/after the range flows naturally, **no hijack** |
| Release | Reaching progress 0/1 ends the range; native scrolling continues past the wrapper with zero code — asserted by test, not implemented |
| Reduced motion | The sticky range and scroll-derived progress are RETAINED (scroll position is user input, not animation); only spatial interpolation collapses (§8) |

### 1.4 Breakpoints

| Tier | Behavior |
|---|---|
| <768 (<md) | Compact vertical form (§9). No wrapper extension, no sticky, no arc, no controls. |
| 768–1023 (md) | Full stage; arc zone ≈ 40% of ~672px panel ≈ 250px wide — the C scales down via the viewBox meet-mapping (§2); markers/labels keep constant px type. |
| ≥1024 (lg) | Same stage; grid gutters widen `lg:gap-5` (existing). Arc zone ≈ 537px at 1440 → drawn C ≈ 260×520. |
| 375px | Compact form; no horizontal scroll (R-9). |

---

## §2 Arc geometry contract (the central metaphor)

### 2.1 Orientation — left-bulging semicircle ("C"), pinned with rationale

The acceptance pins the active marker at "the arc's focal point **(vertical center)**". The only semicircle orientation whose arc midpoint sits at the stage's vertical center is the **left-bulging C**: vertical diameter at the zone's right side, arc bulging left, **opening toward the content column**. (The dome/rainbow alternative was considered and rejected: its arc midpoint is the topmost point, not the vertical center — it fails the acceptance literally.) Time reads **bottom → up**: past (2019) at the bottom end, present (2023) starting at the focal point. Scroll direction moves markers UP the arc — the career descends into focus at rest (progress 0 = Chubb = present at the focal point, per the D-07 SSR contract) and rewinds upward as you scroll.

### 2.2 Coordinate system and the pure geometry (all unit-testable)

Container-relative, satisfying the locked formula `x = centerX + radius·cos(angle)`, `y = centerY + radius·sin(angle)` (screen coords, y down):

```
SVG (server-rendered, aria-hidden, decorative):
  viewBox="0 0 100 200", preserveAspectRatio="xMidYMid meet",
  className="absolute inset-0 h-full w-full"
  path: M 100 0 A 100 100 0 0 0 100 200     (top end → left bulge → bottom end, sweep 0)
  stroke: hsl(var(--border)) — "border token color"; stroke-width 1 (thin);
  fill none. Dash detail: solid (Editorial-calm; dash is discretionary, default none).

Scale mapping (pure, mirrors meet-alignment exactly — zero layout shift on hydration):
  s        = min(zoneW / 100, zoneH / 200)
  offsetX  = (zoneW − 100·s) / 2
  offsetY  = (zoneH − 200·s) / 2
  px(vx,vy) = { x: offsetX + vx·s, y: offsetY + vy·s }   (relative to the arc container)

Circle center in px:  centerX = offsetX + 100·s ;  centerY = offsetY + 100·s ;  radius = 100·s

Marker polar points (angle θ in degrees, domain [90°, 270°]):
  dot   at viewBox radius 100:  vx = 100 + 100·cos(θ) , vy = 100 + 100·sin(θ)
  label at viewBox radius 88 (12 viewBox-unit inward inset ≈ 12·s px — scales with the arc):
        same formula at r=88.
```

### 2.3 The carousel derivation (REV-12 "single source of truth")

`c′ = (n−1)·progress ∈ [0, n−1]` (continuous role index; n = filtered role count = 3).

| Function | Formula | Notes |
|---|---|---|
| `continuousIndex(progress, n)` | `(n−1)·progress` | n≥2; n=1 → 0 |
| `activeIndex(c′)` | `Math.round(c′)` | role bands: [0,0.25)→0, [0.25,0.75)→1, [0.75,1]→2; band centers = keyboard step targets |
| `markerAngle(i, c′, n)` | `180° − (i − c′)·Δ` , `Δ = 90°/(n−1)` | **Exact-fit Δ = 45° for n=3:** max offset `(n−1)·Δ = 90°` keeps every marker on the arc for every c′ — the train never leaves the curve. Generalizes to any n≥2 (data-driven, not 3-hardcoded) |
| `markerPoint(center, radius, θ)` | §2.2 px mapping | dot on the arc; label at radius·(88/100) |
| `markerEmphasis(i, c′)` | `t = 1 − min(|i − c′|, n−1)/(n−1)`; `opacity = 0.65 + 0.35·t`; `scale = 0.7 + 0.3·t` | ladder: active 1/1, adjacent 0.825/0.85, farthest 0.65/0.7 |
| `contentLayer(i, c′)` | `d = i − c′`; `opacity = clamp(1 − |d|, 0, 1)`; `translateY = 14·d px`; `visible = |d| < 1` | §4 |
| `startYear(duration)` | first `/\b(?:19|20)\d{2}\b/` match, else `null` | R-14; `'Sept 2023 — Present'`→2023, `'Sept 2022 — Aug 2023'`→2022, `'June 2019 — Sept 2022'`→2019 |
| `computeProgress(rel, range)` | §1.3 formula | pure; fake-rect testable |

Roles come from `experience.filter(e => e.isTechRelated)` — the pinned phase-6 contract — in JSON order (no sort): Chubb → Upstream → Netcompany. Marker years read 2023/2022/2019 along the arc **bottom → up** (chronological), consistent with §2.1.

### 2.4 Marker anatomy

Each marker = **two** absolutely-positioned real-text elements inside the arc container, both from §2.2 (one positioned wrapper per marker is equivalent; pick one form and keep it):

| Element | Position | Active (i = activeIndex) | Inactive |
|---|---|---|---|
| Dot span | polar(100, θ), `transform: translate(Xpx,Ypx) translate(-50%,-50%) scale(S)` | `h-2 w-2 rounded-full bg-chart-2` (the experience accent) | `h-1.5 w-1.5 rounded-full bg-muted-foreground/40` (the tour's inactive-dot idiom) |
| Year label | polar(88, θ), `transform: translate(Xpx,Ypx) translate(0,-50%)` — **left-aligned, extending inward toward the diameter** (never spills right past the diameter into the content gap); `whitespace-nowrap` | `font-mono text-sm font-medium tabular-nums text-foreground` + a **date line**: the role's `duration` AS STORED (U-8), `text-[10px] text-muted-foreground tabular-nums`, opacity tracking emphasis | `font-mono text-xs tabular-nums text-muted-foreground` |
| Continuous writes | both elements | `opacity`/`scale` from `markerEmphasis` via rAF (§7) | same |

- Markers are **readable text, not aria-hidden** (years are data; SR reads them in DOM role order). No roles, no `aria-current` — emphasis is visual; state is announced by the live region (§5) and carried by the content column.
- `startYear → null` (unparseable/absent duration): dot-only marker, **no invented label** (D-03); content keeps duration AS STORED.
- Active-marker date line at 768px width is the crowding risk — (UNRESOLVED U-6: default included per the acceptance's "+ date"; drop if it clips at md).

---

## §3 Content column anatomy (per-role state)

One `display:grid` stack — all 3 layers in the SAME cell (`grid-area: 1/1`), so the column height = the tallest layer (stable, no jump), all layers stay in normal flow (SSG-safe, "no geometry-dependent layout"), and inactive layers hide without reserving extra space.

**Layer anatomy (identical for every role — hierarchy per the brief):**

| Element | Classes | Content source |
|---|---|---|
| Title `<h3>` | `text-base font-medium text-foreground` (largest in the column) | `entry.title` |
| Company | `mt-0.5 text-sm text-foreground` | `entry.company` |
| Meta line | `text-xs text-muted-foreground`: `<span class="tabular-nums">duration</span>` + `<span aria-hidden="true"> · </span>` + location — **the phase-7 merged-meta idiom verbatim (R-7)** | `entry.duration`, `entry.location` AS STORED |
| Bullets `<ul>` | `mt-2 space-y-1.5 list-disc pl-4 marker:text-muted-foreground`, items `text-xs leading-relaxed text-muted-foreground` | FIRST 3 of `responsibilities` — graceful: fewer renders what exists, absent/empty omits the whole list (phase-7 §11 discipline). Cap rationale: column height budget at 768px; Chubb's 6 quantified bullets would overflow. (UNRESOLVED U-3: default cap-3; full list only if the user confirms the brief demanded all bullets AND the 768px budget is re-measured) |
| Terminal pointer | after the stack | R-11 |

**Layer states (pure functions of c′, written by rAF — §7):**

| State | Condition (d = i − c′) | opacity | translateY | visibility / AT |
|---|---|---|---|---|
| Active | `d = 0` | 1 | 0 | visible, AT-readable |
| Entering | `0 < d < 1` (incoming — sits below, slides up) | `1−d` | `+14d px` | `aria-hidden` (only the activeIndex layer is AT-readable), visible |
| Leaving | `−1 < d < 0` (exits upward) | `1−|d|` | `14d px` (negative) | `aria-hidden`, visible mid-fade |
| Hidden | `|d| ≥ 1` | 0 | clamped ±28px | `visibility: hidden` + `aria-hidden` (removed from AT tree; no focusables inside, so no inert needed) |

- **SSR = the same derivation evaluated at progress 0** — no special-casing: Chubb's layer renders visible with real text; Upstream/Netcompany layers render `visibility:hidden` in the export HTML. This satisfies the acceptance verbatim ("the static export renders role 1's full content as real text").
- Content layers are plain text — **no focusables, no hover states** (panels stay static cards per the shell contract; only §5 controls are interactive).

---

## §4 Interaction states (every control)

There are exactly **two interactive controls** in the whole phase surface — the Prev/Next buttons. Everything else is static or scroll-driven.

| Control | Default | Hover | Focus-visible | Active/press | Disabled | Loading/Error |
|---|---|---|---|---|---|---|
| Prev button | ghost: `flex h-[44px] min-w-[44px] items-center justify-center px-3 text-xs text-muted-foreground rounded-md` + ChevronUp icon (lucide, `h-4 w-4`, aria-hidden) + `aria-label="Previous role"` | `hover:bg-muted` | the tour's `GHOST_INTERACTION` recipe verbatim: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background` | native (no custom) | `disabled:opacity-50` when `activeIndex === 0` (clamping, mirrors the tour's Back) | n/a — static data |
| Next button | same anatomy, ChevronDown, `aria-label="Next role"`, `text-accent` (primary-action ladder, tour precedent) | same | same | native | `disabled:opacity-50` when `activeIndex === n−1` | n/a |
| Role counter (non-interactive) | `{String(activeIndex+1).padStart(2,'0')} / {String(n).padStart(2,'0')}` — `font-mono text-[10px] text-muted-foreground tabular-nums` (PanelShell index precedent) | — | — | — | — | — |
| Live region (sr-only) | `aria-live="polite"`: `Role {i+1} of {n} — {title}, {company}` — announced on **activeIndex change only**, never per scroll frame (tour §9/W-5 precedent) | — | — | — | — | — |
| Markers, arc, content | no hover/press/cursor affordance of any kind (R: panels' bodies are non-interactive; the arc is emphasis, not navigation) | — | — | — | — | — |

Control-row anatomy (arc-zone footer, centered): `[Prev] [01 / 03] [Next]` — the tour footer's grammar (Back | dots+counter | Next). Below md the whole row is absent (§9).

---

## §5 Keyboard + focus contract

| Concern | Pin |
|---|---|
| Handler scope | ONE `keydown` listener on the sticky stage `<section>` (bubbling). It acts only when the event target is inside the stage; `preventDefault()` only on handled keys. **No document/window key listeners** — no scroll-jacking outside the section (REV-12) |
| Keys | `ArrowDown` → next role; `ArrowUp` → previous role. (Home/End deliberately excluded — the brief pins arrows + buttons only; arrows outside the stage fall through to native main scrolling, which itself drives progress) |
| Action | Set progress to the target role's **band center**: `main.scrollTo({ top: engageScrollTop + (i/(n−1))·range, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })` — the same reduced-motion branch the tour uses (`explore-tour.tsx:157-159`). Scrolling IS the progress input, so markers glide and content crossfades through the same derivation — keyboard never bypasses the single source of truth |
| Focus order | DOM order: arc zone (no focusables) → content column (no focusables) → control row: **Prev → Next**. Tab entry lands on Prev |
| Entry without pointer | The stage `<section>` itself stays NON-focusable (PanelShell pin: sections are not focusable). Arrows work once focus is inside the stage (either button). With `<main>` focused (tabIndex=0), arrows scroll natively and progress advances organically — documented ambient path |
| Screen-reader path | The buttons ARE the accessible non-scroll alternative (REV-13): activate Next/Prev → same scrollTo → same derivation. The live region announces each role. Content is real text in the column (§4); marker years are readable text (§2.4) |

---

## §6 Motion contract — rAF authority vs the Editorial-calm vocabulary

The phase-7 vocabulary (200–280ms soft ease-out, transform/opacity only) applies to **discrete** changes. The scroll-driven system is **directly mapped**, not tweened:

| Channel | Mechanism | Easing |
|---|---|---|
| Marker positions (dot+label transforms), marker opacity/scale, content layer opacity/translateY | **rAF imperative writes** (`el.style.transform/opacity`), coalesced ≤1 write/element/frame; scroll events only schedule a rAF. **NO React state per frame; NO CSS transition on these properties** (a transition would fight per-frame writes and lag the scroll) | none — the scroll itself is the easing (this IS "driven by the progress delta") |
| Discrete class swaps (active marker color/size, dot fill) | React state on `activeIndex` change; CSS `transition-[color,opacity] duration-200 ease-out` on marker text/dot for the swap smoothing | 200ms soft ease-out (inside the 200–280 window) |
| Marker first paint (post-measurement fade-in, §10) | opacity 0 → 1, `duration-150 ease-out` | instant under the guard |
| Entrance stagger, tour dim, everything else pre-existing | unchanged CSS choreography | untouched |
| React re-renders | ONLY on: `activeIndex` change, geometry (resize) change. Zero state writes per scroll frame | — |

Writes are `translate3d`-style transform strings; reads are batched per frame (rects read once per rAF, never per marker). `will-change`: none (measured need only; ≤6 transformed elements).

---

## §7 Reduced-motion contract rows (every motion → its suppressor)

| # | Motion (default) | Reduced-motion behavior | Suppressor |
|---|---|---|---|
| RM-1 | Marker carousel glide (positions track c′ continuously) | **Positions FIXED**: `θ(i) = 180° − (i·Δ)` + … → pinned as constants `θ(i) = 180° − i·Δ + 90°·0`… concretely the frozen set `{180°, 135°, 90°}` for i=0,1,2 (chronological bottom→up, index order) — zero spatial movement ever; emphasis (dot fill, color, scale-of-dot via opacity only, date line) swaps opacity-only | derivation branch keyed off `matchMedia('(prefers-reduced-motion: reduce)').matches`, read per derivation pass (stateless, no listener needed) |
| RM-2 | Content layer translateY slide | `translateY ≡ 0`; layers swap opacity-only (opacity still tracks c′ — opacity is not spatial) | same branch |
| RM-3 | Keyboard-step smooth scroll | `behavior: 'auto'` (instant jump to the band center; markers/content land in one frame) | matchMedia branch at the call site (tour precedent) |
| RM-4 | All CSS transitions/animations (marker swap smoothing, first-paint fade, entrance stagger) | killed globally — swaps become instant | existing guard `globals.css:647-660` (`.explore-shell *`), zero new CSS |
| RM-5 | The sticky range + scroll-derived progress itself | RETAINED — scrolling is user input; the stage still pins and roles still advance; only the interpolation collapses | n/a (mechanism, not motion) |
| RM-6 | Keyboard navigation | fully unaffected (§5) | n/a |

RM-1 pins FIXED positions (the strongest reading of D-04's "no spatial movement" — any reposition is spatial movement, including a frozen-train jump). Documented trade: under reduced motion the emphasized dot sits at the role's own arc position, not the focal point — the acceptance's focal contract is a motion-state contract that RM explicitly trades away.

---

## §8 Mobile compact anatomy (<md)

| Aspect | Pin |
|---|---|
| Structure | Wrapper natural height (no `md:h-[300vh]`), stage in normal flow. Interior row: single column — arc zone `hidden`, content list full width |
| Role entries | All 3 stacked (`space-y-5`), always visible — no scroll interaction on mobile (the sticky range is a md+ affordance; SPEC pins "compact vertical form", not a mobile scroll scene) |
| Year marker per entry | One row: dot `h-2 w-2 rounded-full bg-chart-2` + year `font-mono text-xs tabular-nums text-muted-foreground` (dot + year chip replaces the phase-7 rail grammar; NO `border-l` rail — the year leads) |
| Content per entry | The §4 layer anatomy verbatim (title > company > meta > ≤3 bullets), no transitions needed (all visible) |
| Controls | Absent below md (no progress to step — dead controls would violate the no-dead-controls discipline) |
| Overflow | Nothing nowrap exceeds the column (years are 4 chars); no horizontal scroll at 375px (R-9) — sweep-asserted |
| Terminal pointer | Retained after the last entry (R-11) |

---

## §9 SSR / static-export contract

| Concern | Pin |
|---|---|
| Component class | The stage is a `"use client"` component (it owns scroll/rAF/keyboard) — client components STILL server-render in the static export, so the export carries real text |
| Export HTML | All 3 role layers present in the DOM; layer 0 (Chubb) visible with full content (title/company/dates/location/bullets as real text); layers 1–2 `visibility:hidden` + `aria-hidden`. **No geometry-dependent layout**: the content column is flow text inside the grid-stack; nothing depends on measured geometry |
| SVG arc | Server-rendered via the fixed viewBox (§2.2) — scales with the container, no JS, **zero layout shift on hydration** (the stroke the user sees pre-hydration IS the final stroke) |
| Markers | NOT positioned pre-measurement (geometry is client-measured): rendered with opacity 0, fade in over 150ms after the first measured frame (RM-4 makes it instant under reduced motion). No-JS: arc stroke visible, markers absent, Chubb content readable — matches the acceptance's export contract exactly (role 1 only) |
| Hydration | First derivation pass reads the ACTUAL scroll position — a mid-range refresh (browser scroll restoration) lands markers/content at the restored role in one frame, instant (no transition on first write) |
| Tour/IO/no-JS | ids unchanged (R-3); the export's `#experience` anchor resolves; visited counter is hydration-only as today |

---

## §10 Accessibility contract

- Landmarks: the PanelShell `<section aria-label="Experience">` is unchanged; the stage adds an inner `role="group" aria-label="Career timeline"` wrapping arc + content + controls.
- Reading order = DOM order: marker years (2023, 2022, 2019) → active role content → controls. The live region (§4) announces role changes; it is `sr-only`, `aria-live="polite"`, updated ONLY on discrete activeIndex changes.
- The carousel's continuous motion is decorative and never moves focus or announces per frame.
- Contrast: active marker `text-foreground` on `bg-card`; inactive `text-muted-foreground` (the established 4.5:1-safe pairing); dot colors are the chart-2/muted-foreground pair already used by phase-7 dots and tour progress dots.
- `prefers-reduced-motion`: §7. Keyboard: §5. Focus-visible: the tour's ghost ring recipe (R: §4).
- No `tabindex` additions anywhere; no focus trapping (the stage is in-page content, not an overlay).

---

## §11 Integration contracts (flows that must survive untouched)

| Flow | Contract |
|---|---|
| Wizard EXPERIENCE step | `scrollIntoView(stage)` resolves to the stage's static position = **wrapper top** → progress 0 → Chubb active — the tour lands on the timeline's first role deterministically. The cut-out hole measures the STAGE's rect (`getElementById('experience')` — R-3); a pinned stage returns its stuck rect, so the hole highlights correctly even mid-range. Card placement: the stage is viewport-height → `placeCard` deterministically docks (its bounds already reject below/above for near-full-height panels — `tour-placement.ts:77-91`) — behavior change from today's below-placement, handled by existing code |
| Visited marking | Per-panel IO on the stage (R-3): `visitThreshold(864, halfVisible)` ≈ 0.5 — the pinned stage is ~fully visible while engaged → marks naturally; dedupe makes wizard+IO double-marking harmless (unchanged path, `use-explore-visited.ts`) |
| Drawer anchors | `href="#experience"` native hash scroll → main scrolls to the stage's static position (wrapper top) → progress 0. CSS `scroll-behavior: smooth` on the shell (auto under RM) means the jump sweeps progress 0↔1 visually — accepted, it is a scroll not an animation |
| Status bar | `visitedCount` N/5 counter untouched (D-06 out of scope) |
| Entrance stagger | Unchanged selectors; the wrapper is the animated grid child; DOM order preserved so delays stay 0/40/80/120ms in the same order (§1.1) |
| Theme flip | Tokens only; geometry is px-computed from rects — theme-independent |
| BFCache/back-nav | Entrance replay accepted (existing §9.3 note); scroll restoration re-derives progress on the first scroll event / mount pass |

---

## §12 Edge coverage matrix

| # | Edge | Behavior |
|---|---|---|
| E-1 | 0 tech-filtered roles | Body renders `null` (graceful-hide, phase-7 §11 — pointer included in the null) |
| E-2 | 1 role | No wrapper extension, no range; single marker at the focal point (θ=180°); both buttons disabled; counter `01 / 01` |
| E-3 | n roles (generalized) | `Δ = 90°/(n−1)`; carousel/exact-fit math holds for any n≥2 — the DATA yields 3, the MATH is not 3-hardcoded (acceptance's "exactly 3" is a data property, asserted against the filter) |
| E-4 | Unparseable/absent duration | `startYear → null` → dot-only marker, no invented year (D-03); content keeps duration AS STORED |
| E-5 | Empty responsibilities | Bullet list omitted entirely (no padding, no invented copy) |
| E-6 | Resize / orientation | `ResizeObserver` on the stage (one observer, disconnected on unmount) recomputes `s/offsets/radius`, rAF-coalesced rewrite of marker transforms; progress re-clamps on the next frame |
| E-7 | Unmount | ALL listeners cleaned: scroll (main), keydown (section), ResizeObserver, pending rAF ids cancelled (REV-13) |
| E-8 | Fast scroll / momentum | rAF coalescing: ≤1 derivation pass + ≤1 write set per frame; no per-event work |
| E-9 | Load mid-range (refresh restoration) | First client pass derives from actual scroll — instant landing, no transition (§9) |
| E-10 | Scrolling in from below (progress 1 → decreasing) | Symmetric derivation; markers glide down the arc |
| E-11 | Deep link `#experience` from another route | Same as drawer anchor (§11) |
| E-12 | No-JS | Chubb content readable; arc stroke visible; markers/controls inert — consistent with the site's no-JS posture (§9) |
| E-13 | `prefers-reduced-motion` flips mid-session | Branch is read per derivation pass — next frame adopts the new mode, no listener, no stale flag |
| E-14 | Tour open while pinned | Hole wraps the stuck stage rect; card docks; stage interaction continues underneath (non-modal overlay) |

---

## §13 Stale-test renewal list (the rail+dots → timeline replacement)

Per the replacement discipline: rewrite against the NEW contract, keep genuinely-surviving assertions, add gone-checks for the rail.

| File : test (verified this session) | Verdict | Renewal |
|---|---|---|
| `explore-visuals-server.test.mjs:49` — "rail+dots `<ol>` is the first body child" | **STALE** | Rewrite: the arc zone is the first body child; add gone-check `border-l` rail + `bg-chart-2` rail dots absent from the section |
| `explore-visuals-server.test.mjs:64` — merged duration·location meta row (U-8) | **REWRITE-TARGET** | The idiom survives verbatim in the content layer — repoint at the new anatomy (tabular-nums + aria-hidden separator + AS-STORED strings) |
| `explore-visuals-server.test.mjs:83` — `slice(0, 3)` cap + ≤3 bullets + pointer | **STALE** | `slice(0,3)` is replaced by the `isTechRelated` filter (semantics change: 3 roles BY FILTER, not order-cap — D-01→D-06); ≤3-bullet cap survives; `experience --all` pointer survives |
| `explore-visuals-server.test.mjs:40` — chart machinery deleted | **KEEP** | Unchanged |
| `explore-visuals.test.mjs:284` — SECTION_BODIES registry line | **KEEP** | The stage keeps the file `experience-section.tsx` and the prop shape `experience={data.experience}` (filter happens inside via the pure module) — pin this decision to avoid registry churn |
| `explore-visuals.test.mjs:293-314` — REV-08 incl. `!exp.includes('use client')` | **STALE** | The stage IS client now; rewrite to: `"use client"` present AND the export renders role-1 real text AND no chart machinery |
| `explore-visuals.test.mjs:175,344` — serverSlices/sectionBodies component-class registry | **STALE** | experience-section moves to the client list; skills/projects stay server |
| `explore-shell.test.mjs:326-339` — grid classes + zero-col-span invariant | **STALE** | Rewrite to the new placement whitelist: exactly two `md:col-span-2` (experience wrapper, projects) + one `md:order-first`; `grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5` unchanged; no other col-span |
| `explore-sweep.test.mjs:38-55` — sweep grid rows + `!src.includes('md:col-span-2')` | **STALE** | Same whitelist; re-verify 375px (col-spans scoped `md:` so base stays 1-col) and add the 300vh-wrapper-absent-below-md check |
| `portfolio-data-integrity.test.mjs:281-321,450-457` | **KEEP** | Data untouched (D-06). Note: `slice(0,3)` companies == the filtered set COINCIDES today (first 3 entries are the tech roles) — annotate that the stage is filter-governed, not slice-governed |
| `explore-tour.test.mjs` | **KEEP** | EXPERIENCE step wiring unchanged; hole/IO target the stage (R-3) |

**New tests the planner must decompose:** the pure derivation module (progress clamp, continuousIndex, markerAngle + exact-fit invariant `∀i,c′: θ∈[90°,270°]`, emphasis ladder, contentLayer states, computeProgress with fake rects, startYear on the 3 real durations + unparseable input, reduced-motion branch, generalized n∈{1,2,4}); SSR-export role-1 grep; integration greps for R-3 (id on section, no id on wrapper) and §5 key handling; 375px sweep row.

---

## §14 Falsifiability — seams the planner must decompose

1. **Pure module** (`src/components/explore/timeline-geometry.ts`, name discretionary): EVERY formula in §1.3/§2.2/§2.3/§3 + `startYear` + the reduced-motion branch selector. Zero runtime imports (R-12), `node --test` importable, fake-rect inputs.
2. **Hook** (`use-timeline-progress` or equivalent): owns the scroll listener, ResizeObserver, rAF loop, keydown wiring, cleanup — thin over the pure module; testable via the module, integration-asserted by greps.
3. **Stage component**: replaces the body of `sections/experience-section.tsx` (file retained — §13), `"use client"`, consumes `experience` prop → pure module → render.
4. **Grid**: three placement classes in `explore-panels.tsx` (§1.1) — the only grid edit.
5. **globals.css**: at most marker-transition utilities scoped under `.explore-shell` (or Tailwind classes inline) — NO new keyframes beyond what exists; the guard must keep covering everything (R-6).
6. **Deps count 38** asserted (R-4).

---

## §15 UNRESOLVED register (planner assumes the defaults; discretion bounded by CONTEXT)

| # | Question | Default (assumed) |
|---|---|---|
| U-1 | Exact wrapper range length | `md:h-[300vh]` (band 250–350vh; tune so 3 role bands feel unhurried) |
| U-2 | Interior height chrome-row slack | `md:h-[calc(100dvh-14rem)]`; under-fill is the safe direction |
| U-3 | Bullet cap | First 3 (phase-7 discipline + 768px height budget). Full list only with explicit user confirmation + re-measured budget |
| U-4 | Visible scroll hint (e.g. a muted mono "scroll" line near the controls) | NONE — the buttons + counter are the affordance; Editorial-calm restraint |
| U-5 | Progress-denominator precision (padding-inclusion in `range`) | `range = wrapperHeight − stageHeight`; the acceptance requires only the 0→1 mapping + clean release |
| U-6 | Active-marker date line | INCLUDED (`text-[10px]`, AS STORED) per the acceptance's "+ date"; drop if it clips at 768px |
| U-7 | Projects full-width consequence | Accepted (forced by no-empty-cells); surface at plan review for user confirmation |

---

*Phase: 08-experience-showcase-revision · UI-SPEC gathered 2026-09-24 · Grounded in: experience-section.tsx, explore-panels.tsx, panel-shell.tsx, explore-shell.tsx, explore-tour.tsx, use-explore-visited.ts, tour-placement.ts, constants.ts, viz-data.ts, globals.css:577-660, portfolio-main-data.json, and the named test files.*

---

**Key decisions worth noting to the orchestrator:** (1) the arc is pinned as a **left-bulging C** — the only orientation where the active marker's resting point literally satisfies "focal point (vertical center)", opening toward the content column; (2) the marker carousel uses an **exact-fit Δ = 90°/(n−1)** so markers never leave the arc at any progress; (3) the section **id must stay on the sticky stage**, never the wrapper — three existing flows (tour hole, IO threshold, drawer anchor) measure it; (4) two stale-test clusters (rail+dots anatomy, zero-col-span invariant) require rewrites, enumerated in §13; (5) the CONTEXT's `parseDuration` canonical ref is stale — year parsing follows the surviving `GLOBAL_YEAR_PATTERN` precedent instead (R-14).