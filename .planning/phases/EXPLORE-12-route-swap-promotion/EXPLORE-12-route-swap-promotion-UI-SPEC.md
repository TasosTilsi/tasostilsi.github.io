Grounded. Here is the full UI-SPEC content.

# Phase 12: route-swap-promotion - UI-SPEC

**Gathered:** 2026-10-02
**Status:** Ready for planning
**Scope note:** this phase is route infrastructure, so this contract is deliberately narrow — it covers only the surfaces whose *pixels* or *interaction* change. Every other explore element (panels, drawer, wizard, counter, arc, stack) keeps its existing UI-SPEC (phases 1–11) byte-identically; a visual change anywhere else is a defect of this phase.

## 1. Goal

Define the visual, interaction, and responsive contract for promoting the explore experience to the primary landing (`/`), moving the CLI terminal to `/cli`, deleting `/explore`, and adding one new chrome control: a `cli` new-tab hyperlink in the explore status bar. The only new visual object in the phase is that chip; everything else is a path renaming with zero visual delta.

## 2. Layout

### 2.1 Surface swap — visual delta table

| Surface | Today | After | Visual delta |
|---|---|---|---|
| `/` (root) | CLI terminal, `h-screen overflow-hidden` shell | Explore IDE shell (`ExploreShell`) | Full-surface swap. The shell's own composition (§2.2) is unchanged. |
| `/cli` | — | CLI terminal, same layout shell as today's `/` | None — the terminal frame moves with the route. |
| `/explore` | Explore IDE shell | deleted, never shipped | Route disappears from the export. |
| Status-bar breadcrumb | `guest@tasostilsi` + `:~/explore` | `guest@tasostilsi` + `:~` | 8 characters shorter; same two-tone split. |
| Status-bar right cluster | theme label · counter | theme label · counter · `cli ↗` chip | **+1 control** (new). |
| Header Terminal link | `href="/"` | `href="/cli"` | None (chrome, label, 44×44 recipe unchanged). |
| Wizard finish card | `href="/"` | `href="/cli"` | None (label/chrome unchanged). |
| CLI welcome bracket link | `href="/explore"` | `href="/"` | None (rendered line unchanged verbatim). |
| CLI `explore` command | `navigate: "/explore"` | `navigate: "/"` | None. |

**Hard constraint carried forward:** the landing route must render the explore shell on the root layout chain only. It must never inherit `src/app/(main)/layout.tsx`'s `flex flex-col h-screen … overflow-hidden` terminal wrapper — the explore shell supplies its own `h-dvh` frame (`explore-shell.tsx:58`), and stacking the two produces a doubled-height clipped page (`tests/explore-shell.test.mjs:127` already forbids `h-screen` in the explore chain).

### 2.2 Status-bar row anatomy

The footer's own class string stays byte-identical (`explore-status-bar.tsx:34`):

```
flex h-7 shrink-0 items-center justify-between border-t px-3 text-[10px] sm:h-8 sm:px-4 sm:text-xs
```

Only its children change. Two flex children (never three — a third child under `justify-between` would recentre the counter):

```
TODAY                                                     (base 375px, 10px type)
┌──────────────────────────────────────────────────────────────┐  h-7 = 28px · border-t
│ guest@tasostilsi:~/explore      dark · 0/5 sections visited  │  px-3
└──────────────────────────────────────────────────────────────┘
   └── <p> 108px                    └── <p aria-live> 162px

AFTER
┌────────────────────────────────────────────────────────────────────┐
│ guest@tasostilsi:~      dark · 0/5 sections visited   cli ↗        │
└────────────────────────────────────────────────────────────────────┘
   └── <p min-w-0 truncate>          └── right cluster: <div shrink-0 flex items-center gap-3>
        108px                            ├── <p aria-live="polite"> 162px
                                         └── <a href="/cli"> 50px
```

- **Left group:** the existing `<p>` gains `min-w-0 truncate` (escape valve for narrow viewports — see §2.4). Inner spans unchanged: `EXPLORE_STATUS_USER` in `text-accent`, `EXPLORE_STATUS_PATH` in `text-muted-foreground`, contiguous, no separator spans.
- **Right cluster:** a new wrapper `<div className="flex shrink-0 items-center gap-3">` holds the existing `aria-live="polite"` counter `<p>` **and** the new chip anchor. `aria-live` stays on the counter `<p>` only — it must not wrap the chip (a focusable link inside a live region is announced on every counter change).
- The counter `<p>` keeps its exact inner markup and accent branch (`visitedCount === EXPLORE_SECTIONS.length ? 'text-accent' : 'text-muted-foreground'`) so the 5/5 celebration is untouched.

### 2.3 The `cli` chip — locked anatomy

```
 ╭───────────────────╮   ← rounded-md (= 2px inside .explore-shell: --radius 4px)
 │ cli  ↗ │           ← label 18px (text-accent) + 4px gap + 12px ArrowUpRight (muted)
 ╰───────────────────╯     8px px-2 pad        8px px-2 pad
 └───────── 50px ─────┘   hit box 50 × 28px  (sm+: 50 × 32px)
```

| Property | Pin |
|---|---|
| Element | Plain `<a>` (NOT `next/link` — a route prefetch/navigation primitive is wrong for a new-tab affordance, and the plain anchor emits the literal `href="/cli"` into the static HTML). |
| `href` | `/cli` |
| `target` / `rel` | `_blank` / `noopener noreferrer` (house convention: `credentials-section.tsx:143-144`, `ContactOutput.tsx:51`) |
| Accessible name | `cli — open the terminal in a new tab` (see §5.1 for why this is not the brief's literal string) |
| Visible label | exactly `cli` — lowercase, 3 characters, no colon, no trailing glyph. Width-budget-driven: a leading terminal glyph costs ~16px that the 375px row does not have (§2.4). |
| Icon | `ArrowUpRight` (lucide), `h-3 w-3` (12px px literal, immune to the ≤640px 14px root shrink), `aria-hidden="true"`, `text-muted-foreground`, always visible at rest (it *is* the new-tab affordance — unlike the credentials rows' hover-only arrow). |
| Box | `inline-flex h-7 sm:h-8 items-center gap-1 rounded-md px-2` — **B-1 resolution, option (a): the chip anchor carries an explicit `h-7 sm:h-8` height — immune to the right-cluster's content-box height (the cluster is `items-center`, NOT stretch; the footer stays byte-identical); the pinned 50×28/54×32 hit boxes and §5.4's WCAG position hold as written.** |
| Type | Inherits the footer's `text-[10px] sm:text-xs` — no per-chip size class (single-sourced type scale). |
| Colour at rest | label `text-accent`, arrow `text-muted-foreground`. The breadcrumb's two-tone split, reused: identity in accent, chrome in muted. |
| Position | Rightmost element of the row, in the right cluster, after the counter — per the taste review recorded in CONTEXT D-03. |
| Constants | Add `EXPLORE_STATUS_CLI_LINK = { label: "cli", href: "/cli", ariaLabel: "cli — open the terminal in a new tab" }` to `src/components/explore/constants.ts` (house precedent: `EXPLORE_TOUR_FINISH`, importable by tests without parsing JSX). |

### 2.4 Width math and the responsive contract

Base (<640px) is JetBrains Mono at `text-[10px]`; JetBrains Mono advances 0.6em → **6.0px/character** (estimate; ±0.1px/char drift is absorbed by the structural guards below, not by hope). The status bar is `px-3` → 24px of horizontal padding.

| Item | Chars | Base px | `sm:`+ px (12px type, 7.2px/char, `px-4`) |
|---|---|---|---|
| Left: `guest@tasostilsi` + `:~` | 18 | 108 | 129.6 |
| Right: `dark · 0/5 sections visited` | 27 | 162 | 194.4 |
| Right: `light · 0/5 sections visited` (worst case) | 28 | 168 | 201.6 |
| Cluster gap (`gap-3`) | — | 12 | 12 |
| Chip (`px-2` 16 + `cli` 18 + gap 4 + arrow 12) | — | 50 | 53.6 |
| **Total, light theme + 5/5 counter** | — | **338** | **397** |

| Viewport | Available | Fits? | Behaviour |
|---|---|---|---|
| 375px (the phase pin) | 351px | ✓ 13px slack (light) / 19px (dark) | Nothing truncates, nothing wraps. |
| 362px | 338px | ✓ exactly | Zero-truncation floor for the light theme (356px for dark). |
| 360px (common Android) | 336px | ✗ by 2px (light only) | The **left** breadcrumb ellipsizes by 2px; the right cluster and chip never move. |
| 320px | 296px | ✗ by 42px | Left breadcrumb ellipsizes further; right cluster + chip stay intact; no horizontal scroll (`explore-shell.tsx:58` `overflow-x-hidden`). |
| ≥640px | ≥608px | ✓ ≥211px slack | Never truncates. |

**Structural guards (these — not the estimate — are what the tests pin):**

- Left `<p>`: `min-w-0 truncate` → absorbs 100% of any deficit.
- Right cluster `<div>`: `flex shrink-0 items-center gap-3` + `whitespace-nowrap` on the counter `<p>` → the right group can never wrap onto a second line inside the 28px bar and can never shave the chip. This replaces today's implicit "the counter may wrap" behaviour, which would silently overflow a fixed-height bar.
- Chip: `shrink-0`.

### 2.5 Landing-surface identity (both routes)

- `/` renders the explore shell unchanged: header (52px, window glyphs, truncating title, 4 ghost controls) → intro strip → main scroll container → status bar.
- `/cli` renders the CLI terminal in its existing `h-screen overflow-hidden` frame with the same theme/behaviour as today's `/`.
- No new spacing, no new container, no re-flow — the route move must be visually invisible on both surfaces.

## 3. Interaction States

### 3.1 Status-bar `cli` chip (the phase's only new control)

| State | Visual | Behaviour |
|---|---|---|
| **Default** | Label `text-accent`, arrow `text-muted-foreground`, transparent background, `rounded-md`. | Opens `/cli` in a **new tab**. |
| **Hover** | NO background pill (W-2 resolution — this was the phase's one uncomputed contrast claim; the hover stays colour/opacity-only: label stays accent, arrow nudges 2px right via the existing `.exp-nudge` hook). | Pointer cursor (anchor default). |
| **Active (press)** | `active:opacity-80` — press feedback without a background (consistent with the W-2 hover resolution); arrow settles. | — |
| **Focus visible** | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring` — **inset**, see §4.3. Same 2px arrow nudge as hover (`.exp-nudge` fires on `a:focus-visible`). | Enter activates. |
| **Disabled** | Not used — the new-tab escape hatch is always available. | N/A |
| **Loading** | Not used — static export, no async. | N/A |
| **Visited** | No distinct style (links are chrome, not content). | N/A |

**No transition utility on the chip.** The only motion is the inherited `.exp-nudge` transform (220ms, house curve) from `globals.css:635-640` — zero new CSS, and the existing reduced-motion guard suppresses it automatically.

### 3.2 Breadcrumb (left group)

Non-interactive plain text — unchanged in behaviour. No hover, no focus, no cursor change. It shrinks/ellipsizes under width pressure (§2.4) and never becomes clickable.

### 3.3 Right-cluster counter

Unchanged: `aria-live="polite"`, live `${N}/5 sections visited`, accent at 5/5. Adding a sibling anchor must not alter its markup, its announcement cadence, or its accent branch.

### 3.4 Header Terminal link

Target only: `href="/"` → `href="/cli"`. Chrome byte-identical (44×44 real-px ghost recipe, `h-[44px] w-[44px]`, `hover:bg-muted`, `active:bg-muted/80`, ring-offset-2 recipe), `aria-label="Open the terminal"` unchanged, same-tab navigation unchanged, rightmost position in the header cluster unchanged.

### 3.5 Wizard finish card link

Target only: `EXPLORE_TOUR_FINISH.linkHref` `"/"` → `"/cli"`. Label `Open the terminal →` and the `text-accent` styling unchanged; still a same-tab `next/link`. The hint line ("the full story lives in the terminal — start with help") stays.

### 3.6 CLI welcome bracket link

Target only: `href="/explore"` → `href="/"`. The rendered line `[ NEW → visual tour: explore ]` must stay **verbatim** — `tests/explore-sweep.test.mjs:184` pins the exact text, and the sweep row's structural assertions (single `<Link>` on the line, link after the label, no size-class override) are all unaffected by the href change.

## 4. Visual Behaviour

### 4.1 Motion policy — zero new motion

- **No new CSS rules.** The chip reuses `.exp-nudge` (existing, `.explore-shell`-scoped) and Tailwind colour utilities only. `globals.css` is not edited by this phase.
- **No new transition.** Hover/active colour changes are instant — consistent with the shell's precedent that chrome state changes (theme swap) are never animated.
- `transition: none !important` from the existing reduced-motion guard (`globals.css:665-682`) is the only suppressor and already covers the chip: the arrow nudge disappears and the colour states remain (colour is not motion).

### 4.2 Theme legibility — both themes, both bar sizes

Contrast ratios computed from the token values in `globals.css:503-563` (sRGB relative luminance); they are computed, not browser-measured — the ui-review pass should confirm live with axe/DevTools.

| Element | Dark (`.explore-shell`) | Ratio | Light (`.light .explore-shell`) | Ratio |
|---|---|---|---|---|
| `cli` label — `text-accent` on `--background` | `160 84% 45%` on `220 13% 9%` | **9.34:1** | `160 80% 28%` on `220 20% 97%` | **4.58:1** |
| Arrow — `text-muted-foreground` on `--background` | `220 8% 60%` on `220 13% 9%` | **6.46:1** | `220 9% 40%` on `220 20% 97%` | **5.69:1** |
| Hover background `bg-muted` under the label | 16% L vs 45% L accent | ≥ 4.5:1 | 92% L vs 28% L accent | ≥ 4.5:1 |
| Focus ring — `ring-ring` on `--background` | accent green on near-black | clearly visible | `215 85% 45%` on near-white | clearly visible |

All four text/background pairs clear WCAG AA (4.5:1) at both bar sizes. The light-theme accent at 4.58:1 is the tightest number in the phase — the planner must not introduce opacity on the label (`text-accent/80` would drop below AA).

**Accepted adjacency:** at 5/5 the counter's last span is also `text-accent`, so the row can render two accent runs 12px apart. The chip's rounded hover box and always-on arrow keep them visually distinct. If the ui-review flags it, the fallback is `text-foreground` on the label with the arrow retaining accent — **not** opacity reduction.

### 4.3 Focus visibility inside a 28px bar

The house ring recipe (`ring-2 ring-offset-2 ring-offset-background`) draws 4px outside the element's box; a full-bar-height element inside an `h-7` bar would paint its outer ring above the bar's `border-t` and below the viewport edge, i.e. a half-clipped ring. The chip therefore uses **`ring-2 ring-inset ring-ring`** (Tailwind 3.4 `ring-inset` is available; `tailwind.config.ts:64-68` maps `rounded-md` to `calc(var(--radius) - 2px)` = 2px inside the shell). The ring is drawn inside the chip's own box, is never clipped, never overlaps the scroll region, and stays fully visible in both themes and at both bar heights. **RESOLVED-RING-INSET.** (Everything else in the phase keeps the offset-2 recipe untouched.)

### 4.4 Before-paint theme script — visual behaviour that must travel correctly

The explore layout's inline `try { localStorage.getItem("portfolio-explore-theme") … document.documentElement.classList.remove("dark","light") … }` script (`src/app/explore/layout.tsx:19-27`) is the D-05 flash-prevention contract: SSR/first paint renders `dark`, and the persisted theme applies before first paint. It must remain **the first child of the landing route's layout, ahead of the shell markup**, and the exported `index.html` must still contain it ahead of the `explore-shell` markup.

**Blocking rule:** the script must **NOT** be moved into `src/app/layout.tsx`. The root layout is shared with `/cli` and `/resume`; running it there would strip the CLI's `dark`/`light` classes and rewrite them from the explore storage key, breaking the CLI theme on its own page. Keep a route-scoped layout for `/` (e.g. `src/app/(home)/layout.tsx` alongside `src/app/(home)/page.tsx`, or an equivalent scoped layout) so the script's blast radius is exactly one route.

### 4.5 Empty states / error states

No new empty or error states exist in this phase: the explore panels, tour, and counters are unchanged, and the chip has no data dependency (a static href). The only "error" surface is the deleted route: `/explore` must 404 (no redirect machinery) — a routing concern, not a visual state. No skeleton, no toast, no fallback UI.

### 4.6 Surface identity & metadata chrome (social-card visible)

| Route | Title | Notes |
|---|---|---|
| `/` (explore) | `{about.name} \| {about.title} \| Visual Portfolio Explorer` (data-driven, from the current explore layout's pattern) | OG title/card now describes the visual experience; `metadataBase` stays at the root layout. |
| `/cli` | CLI-branded (`Interactive CLI Portfolio`) | Carries the branding the root layout uses today. |
| Root layout | Keeps GA + JSON-LD (`Person` schema, URL `https://tasostilsi.github.io/`) + viewport | JSON-LD/schema URLs are unchanged and stay correct because `/` is still the canonical home. |

No duplicate-canonical handling (the old route is deleted, not redirected).

## 5. Accessibility

1. **Accessible name vs visible label (WCAG 2.5.3).** The brief's literal `aria-label="Open the terminal in a new tab"` does **not** contain the visible text `cli`, so the accessible name would not include the visible label. **Pin: `aria-label="cli — open the terminal in a new tab"`** (visible label first, new-tab warning second). **RESOLVED-NAME** — a deliberate, WCAG-grounded deviation from the brief's literal string.
2. **Link semantics:** a real `<a>` with `href`; not a button, not a div with a click handler. Keyboard: `Tab` reaches it in DOM order (last stop in the shell before the tour overlay), `Enter` activates, new-tab behaviour is the browser's own.
3. **Focus visibility:** inset ring, §4.3 — never `outline: none` without a replacement.
4. **Target size (WCAG 2.2 SC 2.5.8, AA ≥24px):** hit box 50 × 28px base (≈54 × 32px at `sm:`+) — passes AA. **RESOLVED-44PX:** the brief's 44px *vertical* intent cannot be met inside the test-pinned `h-7`/`sm:h-8` bar (`tests/explore-sweep.test.mjs:200-208` pins all four height/type tokens) without either growing the bar (breaks the chrome rhythm and the token pin) or a negative-margin pseudo-element hit area extending 8px above the bar into `main`'s scroll region (an invisible mis-tap strip while scrolling — rejected). Mitigation: the same destination is reachable via the header's real **44×44** Terminal link; the chip is a secondary, new-tab shortcut. Width does clear 44px.
5. **Live region isolation:** `aria-live="polite"` stays on the counter `<p>` only; the chip is outside it.
6. **Reduced motion:** arrow nudge suppressed by the existing guard; colour-only state changes remain (no information is motion-only).
7. **Contrast:** §4.2 — all pairs ≥4.5:1 in both themes; no opacity on the label.
8. **New-tab signalling:** conveyed by the always-visible arrow and the accessible name; `target="_blank"` alone is not an accessible cue, hence the arrow.
9. **No new landmarks/roles:** the footer stays a `<footer>`; the chip adds no landmark.

## 6. SSR / No-JS Contract

- The status bar is SSR'd as part of `ExploreShell`'s initial HTML (today `out/explore.html` contains the breadcrumb — `tests/explore-shell.test.mjs:457-459`), so after the swap `out/index.html` must contain: `guest@tasostilsi`, `:~`, the live counter string `0/5 sections visited`, the before-paint script, and the chip's literal `href="/cli"` + `target="_blank"` + `rel="noopener noreferrer"` + the aria-label.
- The chip is a plain anchor: it works with JavaScript disabled, unlike a router-driven handler.
- The header Terminal link (`/cli`) and the wizard finish card (`/cli`) are SSR'd/`next/link`-driven exactly as today; the CLI welcome link and the `explore` command stay client-only (`TerminalInterface` mounts `ssr:false`) and are therefore verifiable by source assertion + the composite test, not by the export.
- Static-export coupling: with `output: 'export'` and no `trailingSlash` (`next.config.ts`), `/cli` must emit **`out/cli.html`** for `href="/cli"` to resolve on GitHub Pages. If a build emits `out/cli/index.html` instead, the href must become `"/cli/"` in all four sites (welcome link, header link, finish card, chip) — **the href and the emitted artifact shape are one decision, not two.**

## 7. Edge Coverage

| Edge | Correct behaviour |
|---|---|
| 375px, dark theme | Row renders at 332px of 351px available — nothing truncates or wraps. |
| 375px, light theme | 338px of 351px — 13px slack; still nothing truncates. |
| 360px (light) | Left breadcrumb ellipsizes ~2px (`guest@tasostilsi:…`); right cluster and chip are unaffected. |
| 320px | Left breadcrumb ellipsizes further; the right cluster never wraps inside the 28px bar and the chip never shrinks; the shell's `overflow-x-hidden` guarantees no horizontal scroll. |
| ≥640px | `sm:h-8` bar, `sm:text-xs` type, `sm:px-4`: ≥211px slack, never truncates. |
| Counter at 5/5 | Accent counter adjacent to the accent chip label — accepted (§4.2); no opacity tricks. |
| Any other counter value | Counter muted, chip accent — unchanged behaviour. |
| Keyboard-only | Chip is a real focusable anchor; inset ring fully visible at both bar heights; `Enter` opens a new tab; hover and focus get the same arrow nudge (parity). |
| Reduced motion | No arrow nudge; colour states and the inset ring unaffected. |
| Middle-click / ⌘-click on the chip | Opens a new tab (anchor semantics), no double-open. |
| JS disabled | Chip still navigates (static `href`). |
| `/explore` requested | 404 — the route no longer exists; no redirect stub, no visual fallback. |
| Landing route in the wrong layout chain | Must not inherit the CLI's `h-screen overflow-hidden` wrapper (doubled-height clipped page) — asserted by the renewed shell test's `h-screen` ban. |
| Before-paint script in the root layout | Would break the CLI page's theme — script stays route-scoped to `/` (§4.4). |
| Explore theme keys on the CLI page | Untouched: the landing swap must not merge `portfolio-explore-theme` with the CLI's `portfolio-theme`. |
| Wizard finish card / header link mid-animation | Unchanged chrome; only `href` moved — no new motion, no z-index change. |
| Two `href="/cli"` occurrences in `out/index.html` (header link + chip) | Any renewed assertion must not require a single occurrence — use presence, or count explicitly as 2. |
| Stale test rows reading `out/explore.html` | Must be repointed to `out/index.html` (and `out/cli.html` for CLI-side rows) — see §8. |

## 8. Test-Surface Renewal Map (visual assertions that must renew in the same commits)

| File | Row / line | Renewal |
|---|---|---|
| `tests/explore-shell.test.mjs` | `:44-45` constants | `":~/explore"` → `":~"`. |
| `tests/explore-shell.test.mjs` | `:81-96` status-bar row | Keep all existing assertions; **add** the chip's `href="/cli"`, `target="_blank"`, `rel="noopener noreferrer"`, `aria-label`, `text-accent`, `ArrowUpRight` + `exp-nudge`, `self-stretch`/`px-2`/`gap-1` tokens. |
| `tests/explore-shell.test.mjs` | `:127` (`!h-screen`) | Unchanged — but it now guards the landing route; keep. |
| `tests/explore-shell.test.mjs` | `:450-462` export row | Path `out/explore.html` → `out/index.html`; `:~/explore` → `:~`; add the chip + the before-paint script ordering check. |
| `tests/explore-sweep.test.mjs` | `:139-145` | Path `src/app/explore/page.tsx` → `src/app/(home)/page.tsx` (or wherever the landing lands); `overflow-x-hidden` marker unchanged. |
| `tests/explore-sweep.test.mjs` | `:150-158` | `src/app/(main)/layout.tsx` → the CLI route's new layout path; overflow invariants unchanged. |
| `tests/explore-sweep.test.mjs` | `:200-208` | The four bar tokens stay **present and unchanged**; add the row-fit structural guards (`min-w-0`, `truncate`, `shrink-0`, `whitespace-nowrap`) if a width row is added. |
| `tests/explore-sweep.test.mjs` | `:240-250` (E-1/E-2/E-3) | Route list `{index, explore, resume}` → `{index, cli, resume}`; E-2 reads `out/index.html` for the header link `href="/cli"`; E-3's CLI-client-only check reads `out/cli.html`. |
| `tests/explore-sweep.test.mjs` | `:276-296` (E-5 composite) | Leg 1 `href="/explore"` → `href="/"`; leg 2 `{ navigate: "/explore" }` → `"/"`; leg 3 `href="/"` → `href="/cli"`; leg 4 `linkHref === "/"` → `"/cli"`; **add leg 5**: the chip (`href="/cli"`, `target="_blank"`, `rel` includes `noopener`). |
| `tests/explore-routing.test.mjs` | `:74-120` | The welcome-link bracket rows: `href="/explore"` → `href="/"`; the locked rendered text and structural assertions stay. |
| `tests/explore-routing.test.mjs` | `:210` | `EXPLORE_TOUR_FINISH.linkHref` `"/"` → `"/cli"`. |
| `tests/explore-header.test.mjs` | `:192-199` | Finish-card guard `linkHref === "/"` → `"/cli"`; label unchanged. |
| `tests/credentials-panel.test.mjs` | `:39-42` | `out/explore.html` → `out/index.html`. |
| `tests/explore-tour.test.mjs`, `tests/explore-visuals*.test.mjs` | export rows | Any row reading `out/explore.html` repoints to `out/index.html`; content expectations unchanged. |
| New rows | — | Chip anatomy + a11y attrs; `:~` breadcrumb; route-existence `out/index.html` + `out/cli.html`, `!existsSync(out/explore.html)`; "no `/explore` href anywhere in `src/`"; "no `/explore` string in `out/**`"; the root layout contains no explore theme-key script. |

## 9. Implementation Notes (for the planner)

- **Files touched (visual scope only):** `src/components/explore/explore-status-bar.tsx` (left `<p>` guards + right cluster wrapper + chip), `src/components/explore/constants.ts` (`EXPLORE_STATUS_PATH` → `":~"`, new `EXPLORE_STATUS_CLI_LINK`, `EXPLORE_TOUR_FINISH.linkHref` → `"/cli"`), `src/components/explore/explore-header.tsx` (href only), `src/components/cli/outputs/WelcomeMessage.tsx` (href only), `src/components/cli/TerminalInterface.tsx` (`navigate` value only), plus the route files.
- **`globals.css` is not edited** — no new hook classes, no new transitions, no new keyframes. If the chip seems to need CSS, that is a signal the Tailwind recipe above was not followed.
- **Route mechanics:** the landing needs a route-scoped layout that owns the theme script + the explore metadata; the CLI's route group moves to the `/cli` path keeping `h-screen overflow-hidden` byte-identical. The `(main)` group cannot keep `page.tsx` at the root once the landing exists.
- **Do not touch the panels, drawer, tour card internals, counter logic, theme hooks, or data.**
- Add the new sweep/route rows in the same commits as the moves (route-name literals live in the tests, so a half-landed rename leaves the suite red).
- Export-verification order per house rule: `npm run build` before any `out/`-reading row.

## 10. Open / UNRESOLVED Decisions

- **(RESOLVED-44PX)** Chip vertical hit area = full bar height (28/32px) rather than the brief's 44px; WCAG AA passes, header Terminal link remains the 44×44 control. Planner assumes this; do not grow the bar.
- **(RESOLVED-RING-INSET)** The chip uses `ring-inset` for focus visibility because a 28px bar cannot contain an offset ring. Every other control keeps the offset-2 recipe.
- **(RESOLVED-NAME)** Accessible name is `cli — open the terminal in a new tab` (visible label included) rather than the brief's literal `Open the terminal in a new tab`, for WCAG 2.5.3.
- **(RESOLVED-WIDTH)** The leading terminal glyph is dropped from the chip; label + trailing arrow only, because the 375px row budget leaves 13px of light-theme slack and a leading glyph would consume ~16px.
- **(RESOLVED-ARROW — W-1)** Arrow glyph: `ArrowUpRight` — **FINAL for this phase** (no taste-review swap; the reviewer's alternative is a follow-up, not an executor choice).
- **(RESOLVED-HOVER — W-1 + W-2)** Hover: colour/opacity-only — **FINAL for this phase** (the uncomputed tint pair dropped; no pill at hover or press; the reviewer's tint variants die with the pair).
- **(PLANNER-CHOICE)** The landing route group name — the planner's mechanical choice; the outcome to preserve is a one-route blast radius for the before-paint theme script (§4.4) and no inheritance of the CLI's `h-screen overflow-hidden` wrapper.
- **(RESOLVED-WIDTH-TEST — W-1)** The sweep covers the status bar with **structural guards** (the truncation-floor numbers from §2.4 recorded as a comment) — no estimated-px assertion, so a font-metric change cannot make the suite brittle.