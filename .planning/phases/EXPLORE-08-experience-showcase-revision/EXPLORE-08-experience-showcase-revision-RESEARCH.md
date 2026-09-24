All facts gathered and verified. Here is the complete RESEARCH.md:

---

# RESEARCH.md — Phase 8: experience-showcase-revision

**Gathered:** 2026-09-24 · Researcher: gsd-phase-researcher · Fresh-context pass over the canonical refs + repo + platform docs.
**Sources key:** `[VERIFIED: <tool + source>]` = confirmed by running a tool this session AND an authoritative source; `[CITED: <url>]` = official docs; `[ASSUMED]` = training knowledge, verify at implementation; in-repo discrete values quoted verbatim with path + line range.

---

## 1. Domain analysis

### 1.1 The stack this phase builds on (all read this session)

- **Next.js 15 static export** (`output: 'export'`, next.config.ts:5 — `[VERIFIED: read next.config.ts]`). `npm run build` emits `out/` including `out/explore.html`; export-level tests read that file. No server runtime — every behavior must be SSR-safe or hydration-activated.
- **React 18.3 / Next 15.5** (`[VERIFIED: package.json:45-47]`): `react ^18.3.1`, `react-dom ^18.3.1`, `next ^15.5.10`. Server/client split is load-bearing: panels are server components; interactive behavior lives behind `ExploreShell` ("use client", explore-shell.tsx:1).
- **Tailwind v3.4 + tailwindcss-animate** (`[VERIFIED: package.json:61-62]`). No `screens` override exists in tailwind.config.ts (`grep screens` → exit 1, no match) → default breakpoint `md = 768px` applies `[VERIFIED: no override + Tailwind default]` `[ASSUMED: default value]`.
- **Test harness: `node --test tests/<file>.mjs`, run per-file, no npm test script** (`[VERIFIED: tests/explore-visuals.test.mjs:21-22]`: "Runner: node --test tests/explore-visuals.test.mjs (no npm test script exists — run directly)"). Pure modules are imported **directly with an explicit `.ts` extension** — Node 24 strips types at load; modules must have **zero runtime imports and erasable TS syntax only** (no enums/namespaces/parameter properties) (`[VERIFIED: tour-placement.ts:4-9 header contract + explore-visuals.test.mjs:23-25]`). Local Node is **v24.16.0** (`[VERIFIED: node --version]`); CI runs **Node 20 and never runs tests** (`[VERIFIED: .github/workflows/deploy.yml — node-version "20", no test step]`).
- **Type-only alias safety:** pure modules import `PortfolioData`/`ExploreSectionId` type-only so the `@/` alias never resolves at runtime under node --test (`[VERIFIED: viz-data.ts:24, tour-placement.ts:12]`). New pure modules must follow the same erasable-TS discipline.

### 1.2 Scroll-driven sticky-range pattern (the chosen mechanism)

The mechanism is **locked** (D-02): sticky-range progress, no wheel/touch hijacking. How it works concretely in THIS shell:

- The **only scroll container is `<main>`**, not the window: `className="flex-1 overflow-y-auto p-4 md:p-6"` (explore-shell.tsx:67-71, quoted verbatim) inside `<div className="explore-shell flex h-dvh flex-col overflow-x-hidden bg-background text-foreground">` (explore-shell.tsx:58, quoted verbatim). Every scroll read must be **`main.scrollTop`** — `window.scrollY` is always 0 here. The tour already queries the container as `.explore-shell > main` (explore-tour.tsx:110) — reuse that selector pattern.
- **Sticky semantics** `[CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/position + https://www.w3.org/TR/css-position-3/]`: sticky offsets adjust "in reference to the nearest ancestor scroll container's scrollport (as modified by the inset properties)". Two verified platform nuances:
  1. MDN: a sticky element sticks to its **nearest ancestor with a scrolling mechanism** (`overflow` hidden/scroll/auto/overlay), even if that ancestor isn't the nearest actually-scrolling ancestor. Here `main` (overflow-y:auto) is nearer than the shell root (overflow-x-hidden), so the stage sticks to `main` — correct target `[VERIFIED: MDN + in-repo ancestor chain: wrapper → panel-grid → main]`.
  2. **Per-axis tracking**: CSSWG resolved sticky tracks the nearest scroll container *per axis* — the root's `overflow-x-hidden` does not capture the y-axis sticky `[CITED: https://lists.w3.org/Archives/Public/public-css-archive/2026Mar/0368.html]`. Also `[CITED: https://css-tricks.com/dealing-with-overflow-and-position-sticky/]` — an ancestor with overflow ≠ visible *between* the sticky element and the intended scroller kills sticking; the chain wrapper→panel-grid→main has none (all overflow:visible) `[VERIFIED: read explore-panels.tsx/panel-shell.tsx]`.
- **Progress math** (pure, testable): `progress = clamp((main.scrollTop − wrapperRangeStart) / (wrapperHeight − stageHeight), 0, 1)`, where `wrapperRangeStart` is derived per frame from `wrapper.getBoundingClientRect().top` relative to `main`'s rect + `main.scrollTop`. Recompute range bounds on resize/orientation (rAF-coalesced). This is the standard sticky-progress pattern `[ASSUMED — pattern is textbook; the arithmetic is unit-testable]`.
- **Natural release at range ends** falls out of sticky for free — no JS gating, no hijack (the entire point of D-02). Nothing to implement beyond not breaking it.
- **Pitfall — sticky paints under later siblings:** position:sticky "always creates a new stacking context" but does not raise z-index; the Skills/Projects panels are *later* DOM siblings in the same stacking context and will paint **over** the pinned Experience card as they scroll up. Mitigation: explicit `z-10`-class z-index on the sticky section `[VERIFIED: MDN position page, sticky paragraph + DOM order in explore-panels.tsx:76-89]`. This is the single most likely visual bug of the phase.
- **Pitfall — scroller padding**: `main` carries `p-4 md:p-6`; sticky insets are scrollport-relative, so the pinned card lands flush at the scrollport top edge (the padding does not hold a gap while stuck). Exact visual gap is a pixel-level detail — tune the `top` inset at implementation, never derive it `[ASSUMED]`.
- **Pitfall — entrance animation transform**: `.explore-shell .panel-grid > *` animates `translateY(8px)→0` for 240ms on the grid children (globals.css:595-601). During that 240ms the Experience wrapper carries a transform; after completion no transform persists (`backwards` fill only covers the delay). Sticky inside a transformed ancestor still tracks main's scrollport; worst case is a transient constraint-rect nuance at first paint `[ASSUMED — verify once visually]`.

### 1.3 Arc geometry (semicircular timeline)

- **Coordinate math**: markers positioned by `x = centerX + radius·cos(angle)`, `y` per the SPEC formula. **SVG y-axis points down** — for an upward dome use `y = centerY − radius·sin(angle)` (or negate the angle sweep); copying the SPEC's `+` sign literally renders an upside-down (bowl) arc `[CITED: MDN SVG coordinate systems — y-down]` `[ASSUMED: dome orientation matches the user's screenshot brief]`.
- **Marker constellation rotation** (derived, the load-bearing math): with n roles, `θ = progress·(n−1)` (continuous role position), marker angle `αᵢ = 90° + (θᵢ − θ)·Δ` where `Δ ≤ 90°/(n−1)` keeps **every marker on the arc for the entire sweep** (worst |i−θ| = n−1 ⇒ α ∈ 90° ± (n−1)·Δ ⊆ [0°,180°] exactly). For n=3: **Δ = 45°** is the unique no-clamp value filling `α ∈ [0°,180°]` across all θ ∈ [0,2]; the active role always sits at the 90° apex ("focal point / vertical center" per SPEC). Δ>45° requires clamping markers at the arc ends. This whole mapping is a pure function of progress — the unit-test core of the phase. `[VERIFIED: derived arithmetic re-checked; no external source]`
- **Arc path**: one SVG `<path>` using the `A` (elliptical-arc) command between the two endpoints, `aria-hidden`, thin stroke in `border` token color (D-03). The path is static; only markers travel. Geometry derives from the measured container (ResizeObserver or resize listener) — no hardcoded pixel positions (SPEC acceptance).
- **Markers are real-text absolutely-positioned elements**, not SVG text (D-03) — DOM text, AT-readable, styleable; per-frame writes go through `transform` on refs, not React state (D-05). Start years come from data (see §1.4) — D-03 pins the labels '2023', '2022', '2019'.

### 1.4 Data facts (all read this session from the real files)

- `ExperienceEntry` (src/data/portfolio-main-data.d.ts:1-8, quoted): `isTechRelated: boolean; duration: string; location: string; responsibilities?: string[]; title: string; company: string`. **There are no startDate/endDate fields** — the D-06 mapping "duration→startDate/endDate (parsed)" means **parsing `duration`**; D-06's "planner verifies; any missing field surfaces at plan time" is hereby surfaced and resolved: nothing is missing, dates parse from `duration`.
- Exactly **7 experience entries**; the `isTechRelated` filter yields **3**: Chubb (6 bullets), Upstream Systems (3), Netcompany-Intrasoft (4), in reverse-chronological JSON order — Chubb first, no sorting (`[VERIFIED: parsed JSON this session]`). Filter precedent: `allExperience.filter(exp => exp.isTechRelated)` (src/components/cli/outputs/ExperienceOutput.tsx:12; resume side src/components/resume/ResumeExperience.tsx:22).
- **Duration strings, exact codepoints** (`[VERIFIED: JSON parsed + repr dump]`): tech roles use **em-dash U+2014** — `'Sept 2023 — Present'`, `'Sept 2022 — Aug 2023'`, `'June 2019 — Sept 2022'`; non-tech use hyphen U+002D (`'November 2017 - April 2018'`). Start year = **first** `/\b(?:19|20)\d{2}\b/` match (Chubb→2023, Upstream→2022, Netcompany→2019) — matches D-03's pinned labels exactly. Note `'Sept 2022 — Aug 2023'` contains two years; the **first** match is the start year — the parser must not take max/min.
- **The CONTEXT.md code-context claim "parseDuration/YEAR_PATTERN exist in viz-data.ts" is STALE** (`[VERIFIED: grep + full read]`): the chart-machinery deletion (REV-08) removed `parseDuration`/`monthIndex`; what survives in viz-data.ts is `skillGroupFill`/`skillsGroupCounts`/`projectStats` and one precedent to re-derive from: `const GLOBAL_YEAR_PATTERN = /\b(?:19|20)\d{2}\b/g;` (viz-data.ts:90, quoted verbatim). The planner must treat year parsing as **re-derivation from this pattern**, not reuse.
- viz-data.ts header pins it as "The single data-shaping site under src/components/explore/" (viz-data.ts:2-3). The timeline's role-selection/year-parse belongs there or in a sibling pure module mirroring the `tour-placement.ts` precedent (pure decision module, zero runtime imports — tour-placement.ts:1-9).

### 1.5 Interaction architecture (hand-rolled rAF, per D-04/D-05)

- **Two write channels, deliberately separated**:
  1. **Continuous channel (rAF + refs)**: passive `scroll` listener on `main` stores scrollTop; one rAF-coalesced loop writes marker `transform` (translate/position) and opacity/scale directly to element refs. React state updates **only when `activeIndex` changes** — no per-frame setState, no re-render loops (SPEC: "transform-based writes, no unnecessary re-renders"). The repo's only rAF precedent is the tour's rAF-coalesced measurement (explore-tour.tsx:135-136, 151-152, 340-342) — same house pattern.
  2. **Discrete channel (React state + CSS transitions)**: `activeIndex` drives the content column. Recommended mechanism: all 3 role-content blocks in the DOM stacked in one CSS grid cell (height = tallest — no measurement), active gets `opacity-100 translate-y-0`, inactive `opacity-0 translate-y-*`, transition **220ms cubic-bezier(0.25, 1, 0.5, 1)** — the exact phase-7 curve from `.explore-shell .exp-lift` (globals.css:613-616, quoted verbatim) and the 200-280ms soft-ease-out window (D-04). All 3 blocks stay real text in the AT tree (reading order = all roles — acceptable and data-true). Alternatives: key-remount with enter-only animation (weaker — reads as instant-outgoing), or progress-interpolated continuous opacity (heavier, unnecessary).
- **Reduced motion — dual layer, do not conflate** (`[VERIFIED: globals.css:647-660 read in full]`):
  1. The CSS guard `@media (prefers-reduced-motion: reduce) { .explore-shell *, ... { animation: none !important; transition: none !important; } }` (globals.css:647-654, quoted) suppresses every *declarative* transition in-shell automatically — the grid-stack cross-fade dies under reduce with zero extra code. The stage must live in-shell (it will — everything is inside `.explore-shell`).
  2. The guard **does not stop JS rAF writes** — the hook itself must read `matchMedia('(prefers-reduced-motion: reduce)')` and switch: no spatial interpolation (markers render at their static role angles, emphasis via opacity/scale state only; "arc static at the active role's position" per D-04), content swaps opacity-only. The CONTEXT's "static positioning automatically" via the guard is only true for CSS transitions, **not** for JS-driven transforms — the JS branch is mandatory.
- **Scroll-behavior trap**: the guard also sets `scroll-behavior: auto !important` on `.explore-shell main` (globals.css:656-659) — but an explicit `behavior:'smooth'` in `scrollTo()` bypasses CSS scroll-behavior. The established pattern branches at the call site (explore-tour.tsx:155-159, quoted: `const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'`). **Keyboard role-stepping must reuse exactly this branch** (D-02: keyboard "set[s] progress to the role's band" — implemented as `main.scrollTo({ top: bandCenterScrollPos, behavior })`, which keeps scroll the single source of truth; directly setting an internal progress value would be overwritten by the scroll listener).
- **Progress→band mapping** (pure, testable): `activeIndex = min(n−1, floor(progress·n))` (role i owns [i/n, (i+1)/n)); keyboard target `progressForRole(i) = (i+0.5)/n` (band center). Marker emphasis derives from |αᵢ − 90°| distance-from-apex (opacity/scale pure functions).
- **Breakpoint awareness**: the md+ mechanics (sticky range, arc) activate at ≥768px via `matchMedia('(min-width: 768px)')` + change listener (cleanup on unmount); `<md` renders the compact form with **no scroll machinery attached at all**.
- **SSG/hydration contract (D-07)**: recommended dual-variant body inside the Experience panel:
  - compact list `md:hidden` — the existing rail+dots markup (server-rendered, all 3 tech roles... see OQ-3 on whether the non-tech filter applies to the mobile list);
  - interactive stage `hidden md:flex` — client component, SSR renders activeIndex=0 (Chubb): title/company/dates/location/bullets as **real text in out/explore.html**; arc geometry and marker positions are client-computed post-hydration (markers pre-hydration: hidden until geometry exists, to avoid unpositioned pile-up at origin).
  - No-JS visitors get the readable compact list at every width — a feature, not a compromise. Export assertion target: Chubb's title/company/dates/location/bullets present as real text in `out/explore.html`.

### 1.5 Wizard/tour/counter interplay (must not regress)

- `useExploreVisited` mounts one IntersectionObserver **per panel**, root = `'.explore-shell > main'`, threshold from `visitThreshold(el.offsetHeight, halfVisible)` = `Math.max(0.05, Math.min(0.5, rootHalfVisible / panelHeight))` (use-explore-visited.ts:74-98; tour-placement.ts:101-103, quoted verbatim). With the stage ≈ main-height, threshold ≈ 0.5; a **pinned** sticky section is ~fully intersecting for the whole range → `experience` marks visited early in the range, unchanged mechanics. No edit needed in use-explore-visited.
- Tour `scrollIntoView` targets `document.getElementById(current.sectionId)` with an in-view fast path and a reduced-motion behavior branch (explore-tour.tsx:110-163). Keep `id="experience"` on the sticky section: below-viewport → scrolls to natural position = wrapper start (first role); already pinned → in-view fast path measures the pinned rect. Edge case: tour opened while scrolled *past* the range lands at the wrapper end (last role) — acceptable, documented edge.
- Status bar counter `N/4 sections visited` derives from `visitedCount`/`EXPLORE_SECTIONS.length` — untouched.
- `TerminalPointer command="experience --all"` (experience-section.tsx:80) is the pinned CLI cross-surface pointer (REV-12: "non-tech roles stay CLI-reachable") — keep it in the panel body; placement (compact list footer vs stage footer) is planner's call.

### 1.6 Grid rebalance — the empty-cell derivation (load-bearing)

Current grid: `grid panel-grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5` (explore-panels.tsx:75, quoted verbatim), DOM order = EXPLORE_SECTIONS = `about, experience, skills, projects` (constants.ts:10-15, quoted verbatim; header comment: "section order and labels are locked by the SPEC acceptance").

- D-01: Experience full-width row 1, `[About+Contact | Skills]` row 2. With **4 panels** and "no empty cells at any width" (SPEC acceptance), **Projects must also span both columns at md+** (row 3 full-width) — the only completion of D-01's two named rows that satisfies the no-empty-cells criterion. Derived, not invented: 4 panels − 2×(span-2) = rows [EXP], [About|Skills], [Projects] = 5 cell-slots over 3 rows, zero empties.
- **Auto-placement forces Experience-first in placement order**: with DOM order unchanged, a span-2 Experience placed after About cannot fit row 1's remaining cell and drops to row 2, leaving row 1 half-empty. CSS grid auto-placement follows **order-modified document order** `[CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Auto-placement + https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/order — "Items in a container are sorted by ascending order value and then by their source code order"]`. So either:
  - **Option A — DOM reorder**: `EXPLORE_SECTIONS` becomes experience-first. Ripples: index chips renumber (Experience=01), `EXPLORE_TOUR_STEP_BODIES` is index-coupled and must reorder in sync (constants.ts:94-100, 117-123), tour step order changes (welcome→experience→about→…), drawer order changes, and `tests/explore-sweep.test.mjs:62-65` (pinned literal `['about', 'experience', 'skills', 'projects']`) + `tests/explore-tour.test.mjs:71` rewrite. Mobile stacking order also changes to experience-first.
  - **Option B — CSS `md:order-first` on the Experience wrapper** (recommended): mobile order, locked constant, tour order, index chips all unchanged; visual placement becomes [EXP span2] / [About|Skills] / [Projects span2]. The CSSWG explicitly designs grid reordering as visual-only: "The reordering capabilities of grid layout intentionally affect only the visual rendering, leaving speech order and navigation based on the source order" `[CITED: https://www.w3.org/TR/2025/CRD-css-grid-2-20250326/]` — so the DOM/visual mismatch is a spec-sanctioned mechanism, not an a11y hack. Cost: only the col-span assertions rewrite (see §5 stale list).
- **Structure**: the grid child for Experience becomes a wrapper `div` (`md:col-span-2 md:order-first`, height ≈300vh-equivalent at md+, auto below) containing the sticky `section#experience` (PanelShell chrome + stage body) — the sticky element's containing block must be the tall wrapper for the pin range to work. The entrance stagger (`.panel-grid > *` nth-child 2-4, globals.css:605-607) still applies — 4 grid children survive.
- The "no col-span" invariant is **test-pinned in two files** and both tests must be rewritten per the replacement discipline: `tests/explore-shell.test.mjs:337-340` ("no col-span classes anywhere — zero empty cells at every width") and `tests/explore-sweep.test.mjs:48-51` (`!src.includes('md:col-span-2')`) + `:72-75`. The invariant itself is *inverted*, not abandoned: exactly 2 span-2 children (experience wrapper + projects), zero empty cells re-derived.
- `explore-shell.test.mjs:341` bans only a `section.id === 'about'` conditional — an experience-branch or data-driven wrapper map is permissible; prefer a data-driven structure over an id conditional.

### 1.7 Mobile compact form (<md)

- D-05: "compact vertical form — year markers + role content stacked (no cramped arc), same content hierarchy". The existing rail+dots list already IS that shape (experience-section.tsx:43-79: `relative space-y-5 border-l border-border` rail, 8px `bg-chart-2` dots, merged duration·location meta). Recommendation: the compact variant **reuses this markup** as the `md:hidden` server-rendered list (year emphasis upgraded to the D-03 marker style: start-year label + dot) — minimal diff, preserves the phase-7 polish, and keeps the `explore-visuals-server.test.mjs` rail-anatomy assertions partially alive (see stale triage).
- 375px invariant: stage hidden below md ⇒ no arc, no horizontal scroll; shell root `overflow-x-hidden` makes it structural (explore-sweep.test.mjs:86-95 pins this — stays green).

### 1.8 Known pitfalls summary (ranked)

1. **Pinned card painted over by later panels** (stacking context, §1.6/§1.2) — needs explicit z-index.
2. **`window.scrollY` instead of `main.scrollTop`** — silent zero-progress bug; the scroll container is `<main>`.
3. **SPEC's `y = centerY + radius·sin(angle)` copied literally** → bowl arc (SVG y-down). Use `−sin` for the dome.
4. **Second year in `'Sept 2022 — Aug 2023'`** taken as end→apex rotation base — start year = *first* regex match.
5. **Reduced-motion treated as CSS-only** — the rAF loop must branch on `matchMedia` itself; the guard only kills declarative transitions.
6. **Sticky range math measured once at mount** — resize/orientation must recompute range bounds (rAF-coalesced, cleaned up).
7. **Unpositioned markers at SSR origin** — hide markers until geometry computed post-hydration.
8. **`scrollTo({behavior:'smooth'})` unconditionally** — bypasses the reduced-motion `scroll-behavior:auto` guard; branch at call time (tour precedent).
9. **Sticky-in-padded-scroller top offset** — scrollport-relative insets; tune visually, don't derive.

---

## 2. Package legitimacy

**Zero new dependencies are proposed** — the phase is explicitly hand-rolled rAF (D-05, SPEC constraint "deps count stays 38", user AAA). Therefore the dependency surface is a *negative* verification:

- **Current count = 38 runtime dependencies** — counted from package.json:14-53 this session: 1 (@hookform/resolvers) + 20 @radix-ui + 2 @tanstack + class-variance-authority + clsx + date-fns + dotenv + html2canvas + jspdf + lucide-react + next + patch-package + react + react-day-picker + react-dom + react-hook-form + tailwind-merge + tailwindcss-animate = 38 `[VERIFIED: package.json read + arithmetic]`. Cross-pinned by `tests/explore-visuals.test.mjs:317-320` (`Object.keys(pkg.dependencies).length === 38`, "no recharts key") — this existing test stays green and doubles as the no-new-deps gate.
- **No registry lookups required** — no package is added, removed, or version-bumped. Any proposal to add an animation library (framer-motion, GSAP, lenis, @use-gesture…) is out of scope by SPEC constraint + D-02's explicit wheel-hijack rejection.
- Dev/runtime boundary unchanged: `tailwindcss-animate` stays (already a dep), no PostCSS/plugin changes.

---

## 3. Risks and Open Questions

### Risks

| # | Risk | Likelihood | Mitigation |
|---|------|-----------|------------|
| R-1 | Stacking-order: Skills/Projects paint over the pinned card | High (structural) | Explicit z-index on sticky section (§1.8.1) |
| R-2 | Scroll progress wired to window instead of `<main>` | Medium | Single `'.explore-shell > main'` accessor (tour precedent); unit test the pure math, source-invariant test asserts the selector |
| R-3 | Stale-test blast radius (col-span bans in 2 files, rail-anatomy suite, server-component assertion) | Certain | §5 stale-test triage list; rewrite atomically per replacement discipline |
| R-4 | Upside-down arc / marker pile-up pre-hydration | Medium | §1.8.3/§1.8.7 |
| R-5 | Entrance-stagger + tall wrapper interplay visual glitches | Low | Verify once at 240ms-boundary; `backwards` fill only |
| R-6 | Chubb's 6 bullets overflow the 60% content column at short viewports | Medium | Bullet cap is discretion (OQ-5); test at 768×~600 |
| R-7 | Tour landing semantics at wrapper mid-range/end | Low | In-view fast path already handles pinned case; document edge |

### Open Questions — all (RESOLVED) except none; blockers listed where relevant

1. **Where does Projects land in the rebalanced grid?** — **(RESOLVED)** Full-width `md:col-span-2` row 3. Derived from D-01's two pinned rows + SPEC's "no empty cells at any width" with exactly 4 panels; no alternative placement exists that satisfies both. Planner confirms the class placement (wrapper vs PanelShell className).
2. **DOM reorder vs CSS `md:order-first` for Experience-first row** — **(RESOLVED, recommendation)**: Option B (CSS order-first) — zero ripple to the locked EXPLORE_SECTIONS order, tour order, index chips, drawer order, and mobile reading order; grid-order reordering is visual-only by spec design `[CITED: csswg css-grid-2]`. Option A (DOM reorder) remains the strict reading-order-parity alternative if the planner prefers it; it costs the sweep/tour order test rewrites + STEP_BODIES sync. Decision is reversible; pick once in the plan.
3. **Date parsing — `parseDuration` is gone** — **(RESOLVED)** Re-derive start-year = first `/\b(?:19|20)\d{2}\b/` match on `duration` (pattern precedent viz-data.ts:90); verified against the 3 real strings → '2023'/'2022'/'2019' matching D-03. Dash style (U+2014 vs U+002D) is irrelevant to the regex; quote the real strings in tests.
4. **Does the sticky mechanism need any polyfill/feature detection?** — **(RESOLVED)** No. position:sticky is Baseline "widely available since July 2015" `[CITED: MDN position page compatibility note]`; scrollend already has a 700ms timeout fallback pattern in-repo (explore-tour.tsx:162). rAF/IntersectionObserver/matchMedia are baseline.
5. **Bullet count in the stage content column** — **(RESOLVED, discretion)** Recommend: no cap in the stage (Chubb's 6 quantified bullets are the phase's hero content), graceful if vertical space demands a cap at implementation; compact mobile list keeps the existing ≤3 cap (phase-7 D-01) so mobile density is unchanged. Both behaviors unit-derivable.
6. **Does the compact mobile list filter to the 3 tech roles or keep the current first-3-slice?** — **(RESOLVED, recommendation)** The arc's role-selection contract (`isTechRelated`, 3 roles) is pinned for the stage (D-06). The mobile compact list: keep it **consistent with the stage** — same 3 tech roles, same order — so "same visual language" (D-05) and one selection function feeds both. The current `slice(0,3)` (experience-section.tsx:37) happens to yield the same 3 entries today (Chubb/Upstream/Netcompany are JSON-first), but slice-vs-filter semantics differ if data changes; the isTechRelated filter is the pinned contract from phase 6 — use it for both variants. (Note: the phase-7 test pinning `slice(0,3)` semantics gets rewritten either way — see §5.)
7. **aria strategy for the cross-faded content stack** — **(RESOLVED, recommendation)** All 3 role blocks remain un-aria-hidden real text (SR reads all roles in order — correct, they're genuine content); add one `sr-only` `aria-live="polite"` line announcing "Role N of 3 — title, company" on discrete activeIndex changes only (never per-frame — live regions must not fire during scroll interpolation). Markers: the 3 year markers as buttons with `aria-current="step"` on the active one, inside a `role="group"` `aria-roledescription`-free labeled container; ArrowUp/ArrowDown handled at the group level + explicit Prev/Next 44px buttons (SPEC constraint). The SVG arc is `aria-hidden` (D-03).
8. **Exact sticky-range length / radius / insets / marker typography deltas** — **(RESOLVED as discretion)** All five fall under CONTEXT "Claude's Discretion"; the plan should pin starting values (range ≈ 3× stage height; Δ=45° marker spacing per §1.3) and tune at implementation. Nothing blocks planning.
9. **Does the wizard/tour/visited machinery need any change?** — **(RESOLVED)** No code change required anywhere in explore-tour.tsx / use-explore-visited.ts / explore-status-bar.tsx (§1.5); only the D-07 stale-test renewal touches their assertions if the grid test rewrite requires it.

No question remains blocked on user input or unavailable tooling.

---

## 4. Architectural Responsibility Map

Capability → tier assignment (planner places each in the right plan/file):

| Capability | Tier | Home | Notes |
|---|---|---|---|
| Grid rebalance (span-2 wrapper + order-first + Projects span-2) | Presentation | `explore-panels.tsx` (+ wrapper div) | PanelShell untouched; entrance stagger intact |
| Compact mobile list (rail+dots, 3 tech roles) | Presentation (server) | `experience-section.tsx` | Stays a server component; `md:hidden` |
| Sticky wrapper + stage composition, SSR role-1 text | Presentation (server → client boundary) | `experience-section.tsx` renders a client stage child | Keeps the registry closure + "no use client in experience-section.tsx" test alive |
| Scroll/rAF/keyboard/reduced-motion interaction | **Integration** (client) | NEW `experience-timeline-stage.tsx` ("use client") | The ONLY client directive of the phase; listeners/observers/rAF cleaned up on unmount |
| Progress math, angle/marker derivation, band mapping, reduced-motion variant | **Domain** (pure) | NEW `timeline-progress.ts` (tour-placement.ts precedent: zero runtime imports, erasable TS) | Unit-test core; security-adjacent contract (no scroll hijack) lives here as pure invariants |
| Role selection (isTechRelated) + start-year parse | **Domain** (pure) | NEW `timeline-data.ts` **or** extend `viz-data.ts` | viz-data header pins "the single data-shaping site" — either extend it or justify a sibling pure module mirroring tour-placement; do NOT shape data in components |
| Visited-marking, tour scroll, counter | Integration (existing, untouched) | `use-explore-visited.ts` / `explore-tour.tsx` / `explore-status-bar.tsx` | Zero edits expected |
| Portfolio data | **Data** (read-only) | `portfolio-main-data.json` via typed props | No data-file changes (D-06 verified: all fields present) |
| localStorage | Data (existing, untouched) | `use-explore-visited.ts` only | No new keys; CLI-key disjointness greps stay green |

**Security-sensitive placement check**: the only user-agency-sensitive capability is the scroll mechanism (no hijacking — a trust/agency contract, not auth). It correctly lands in the **Integration** tier as listener wiring over pure Domain invariants — no presentation-layer event logic, no data-tier state. No security-sensitive capability is mis-tiered. The arc SVG/marker writes are presentation-adjacent but driven by the Domain tier's pure outputs.

---

## 5. Validation Architecture (what automated checks prove each behavior)

Runner: `node --test tests/<file>.mjs` per file (no npm script) `[VERIFIED: test header]`. Node ≥23.6 required for type stripping; local Node 24.16.0 ✓; CI never runs tests (build-only) `[VERIFIED: deploy.yml]`.

**Layer 1 — pure unit tests (new `tests/explore-timeline.test.mjs` or extend visuals suite):**
- `progressFromScroll(scrollTop, start, end)`: clamps to [0,1], identity at ends, monotonic.
- `activeIndexFromProgress(progress, n)`: band boundaries (1/3, 2/3 for n=3), clamp at 1→2.
- `angleForRole(progress, i, n)`: active ≈90° (apex) at every band; all angles ∈ [0°,180°] for the full sweep (the Δ≤90°/(n−1) invariant — assert over a progress sweep).
- `markerEmphasis(progress, i, n)`: opacity/scale monotone in distance-from-apex; active strictly largest/darkest bucket.
- `progressForRole(i, n)`: round-trips through `activeIndexFromProgress` (keyboard stepping lands in the right band).
- Reduced-motion variant functions: static-angle mode returns role-fixed angles (no θ term), opacity-only emphasis.
- Data shaping: `isTechRelated` selection → exactly [Chubb, Upstream Systems, Netcompany-Intrasoft] in JSON order; start-year parse → `'2023'`, `'2022'`, `'2019'` from the verbatim duration strings (assert against `src/data/portfolio-main-data.json` at test time, never copied literals — house precedent, explore-visuals.test.mjs header).
- **Import discipline**: new pure modules carry zero runtime imports, erasable TS only (node --test direct `.ts` import must keep working — assert by the import itself).

**Layer 2 — source invariants (read file text):**
- Dependencies stay 38, no animation lib keys (existing test `explore-visuals.test.mjs:317-320` stays green unedited).
- `'use client'` exists ONLY on the new stage file; `experience-section.tsx` keeps zero directives (existing assertion `explore-visuals.test.mjs:314` may stay green under the recommended architecture — verify, don't assume).
- No `wheel`/`touchmove`/`preventDefault`-on-scroll anywhere in the stage source (the no-hijack contract, greppable).
- Listener-cleanup contract: `removeEventListener` / `disconnect()` / `cancelAnimationFrame` present in the stage's cleanup paths; matchMedia change-listener removed too.
- Arc math uses `Math.cos`/`Math.sin` (no hardcoded per-marker position literals); marker positions derive from measured container size (ResizeObserver/resize present).
- Grid invariants rewritten: exactly the expected col-span set (2 × `md:col-span-2`), `md:grid-cols-2` intact, no `lg:grid-cols-3`, no `max-w-` wrapper (rewrites of explore-shell.test.mjs:326-342 + explore-sweep.test.mjs:38-76).

**Layer 3 — export-level (after `npm run build`):**
- `out/explore.html` contains Chubb's real text: title ("Senior Software Engineer in Test"), company (Chubb), duration string, location, ≥1 bullet — data-derived, not copied (D-07/SSG contract).
- Both variants present: compact list markup + stage markup; stage carries the `hidden md:` gating classes.
- All routes still export statically (existing explore-routing/explore-sweep suites).

**Layer 4 — full gates (SPEC acceptance):** `npm run build` + `npm run typecheck` + every `tests/*.mjs` green on the final tree. Per green-gate-finality discipline the complete gate runs last, covering the final workspace state.

**Stale-test triage list (rewrite/remove per replacement discipline — enumerated for the planner):**
- `tests/explore-shell.test.mjs:326-342` — "no col-span classes anywhere" → rewrite to the 2-span-2 rebalance contract.
- `tests/explore-sweep.test.mjs:38-76` — three sweep tests asserting no-col-span/no-md:col-span-2/2×2 → rewrite to the 3-row rebalance (EXP span2 / About|Skills / Projects span2); `:62-65` order assertion survives under Option B.
- `tests/explore-visuals-server.test.mjs:49-140` — the experience-section anatomy suite (rail first-child, caps `slice(0,3)`, byte-stable meta row) → rewrite to the dual-variant contract (compact list anatomy + stage composition + TerminalPointer survives); the merged-meta U-8 fidelity rules carry into the stage content column.
- `tests/explore-visuals.test.mjs:304-315` — "rail+dots survives as the non-chart showcase" + "experience-section remains a server component" → rewrite semantics to "compact mobile form survives; stage is the only client slice" (both may stay green under the recommended architecture; verify at plan).
- `tests/explore-tour.test.mjs` — untouched under Option B (order assertions derive from EXPLORE_SECTIONS); revisit only if Option A is chosen.
- `tests/explore-visuals.test.mjs:284-290` + `explore-visuals-skills.test.mjs:156` — registry-closure assertions (`experience: ({ data }) => <ExperienceSection experience={data.experience} />`) stay green if the section keeps its prop shape — a design constraint on the refactor (keep the adapter signature).

---

## 6. Project Constraints (from project conventions + SPEC)

- **Zero new dependencies; deps count stays 38** (user AAA, SPEC constraint, test-pinned).
- **IDE aesthetic holds**: design tokens (`border`, `bg-card`, `chart-N`, `muted-foreground`), JetBrains Mono chrome, PanelShell chrome untouched, dark/light themes both work; no gradients/glassmorphism/generic-SaaS patterns (SPEC constraint).
- **Motion vocabulary**: the phase-7 Editorial-calm set — 200-280ms soft ease-out, the `cubic-bezier(0.25, 1, 0.5, 1)` curve (globals.css:613-616), transform/opacity only, never top/left/width/height. The reduced-motion guard (globals.css:647-660) is the ONLY motion suppressor; new declarative motion must live under `.explore-shell` scope to inherit it.
- **Interaction states**: 44px minimum targets for all new controls (SPEC constraint); keyboard parity follows the §14 ring pattern; panels-are-static rule (§17.6) is amended for this phase's stage only (the stage is the panel's interactive body — the chrome stays inert).
- **Data fidelity**: strings rendered AS STORED, dash style never normalized (U-8 precedent); every rendered value traces to portfolio-main-data.json through a pure module (EXPLORE-07); JSON order is render order — no sorting.
- **Hydration contract**: localStorage never read during render; state initializes to literals (R-5 precedent, use-explore-visited.ts:43-47). SSR emits real text; interaction activates on hydration (D-07).
- **Tests**: node --test, direct `.ts` imports of pure modules, expectations derived from the real JSON at test time; stale tests rewritten/removed per the replacement discipline, not silenced.
- **Green-gate finality**: the complete gate (build + typecheck + full suite) is the chronologically last action before any completion claim, covering the final tree (user memory constraint).
- **Out of scope** (CONTEXT domain): data-file changes, new deps, CLI/resume/PDF changes, wizard/drawer/counter flow changes beyond the scroll-target check, wheel/touch hijacking, the arc for non-tech roles, education/cert extensions on the arc, deferred arc extensions (Education/Certs/Projects/Open Source).

---

*Research complete — every Open Question is (RESOLVED); nothing blocks planning. The two planner-level decision points are D-01-grid-completion (Projects span-2 — forced by arithmetic) and Option A vs B placement strategy (recommendation: Option B `md:order-first`), both fully grounded above.*