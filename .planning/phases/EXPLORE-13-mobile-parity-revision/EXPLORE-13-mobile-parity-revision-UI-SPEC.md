Reconnaissance complete — I read every surface the phase touches (arc stage + its hook, the swipe stack, the About panel, both layouts, globals.css, the data file, framer-motion's drag implementation) and mapped the exact stale-test pins. Here is the full file contents.

---

```markdown
# Phase 13: mobile-parity-revision — UI-SPEC

**Gathered:** 2026-10-05
**Status:** Ready for planning (2 decisions carry a stated default + one flagged deviation)
**Sources:** EXPLORE-13-...-SPEC.md (locked what/why), EXPLORE-13-...-CONTEXT.md (decisions D-01…D-07), and first-hand reads of every surface named in §12.
**Authority:** SPEC + CONTEXT are locked and are NOT relitigated here. This document pins layout, interaction, visual behaviour and edge coverage *within* them. Where the locked text under-determines a visible outcome, the item is marked **(UNRESOLVED-Dn)** in §8 with the default the planner must assume.

---

## §0 Scope of the contract

Three surfaces change visually; two retire; one platform layer is added.

| # | Surface | Req | Kind of change |
|---|---|---|---|
| 1 | Experience arc (`experience-section.tsx` + `use-timeline-progress.ts`) | REV-23 | Layout + interaction change at `<md`; geometry unchanged at `md+` |
| 2 | Projects swipe stack (`projects-stack-stage.tsx`, `projects-section.tsx`, `projects-mobile-stack.tsx`) | REV-23b | One contract at every width; the `<md` wrapper file retires |
| 3 | About panel (`about-section.tsx`) | REV-24 | One block deleted; reflow compensation |
| 4 | Viewport meta (`src/app/layout.tsx`) | REV-25a | Meta source moves to the typed export |
| 5 | Platform pack (`globals.css` + `(home)/layout.tsx` lock) | REV-25b | Route-scoped CSS declarations only |

**Not in this contract (untouched, verify by absence, not by edit):** the wizard/tour (`explore-tour.tsx`, `tour-placement.ts`, `explore-drawer.tsx`), the Credentials panel, the CLI, `/resume`, the panel grid placement map, the intro strip, the status-bar type tokens, every theme token.

**One breakpoint only:** `md` = `min-width: 768px` — the single query already in `use-timeline-progress.ts:162`. No new breakpoints, no device sniffing, no `hover`/`pointer` media queries (mobile-native Hard Rules).

---

## §1 Region map and hierarchy

### 1.1 Landing frame (every width)

```
html ................. height:100% → height:100dvh (added, see §3.5b) + overflow:hidden   [route lock]
└ body ............... flex column, same height
  └ .explore-shell ... flex h-dvh flex-col overflow-hidden   (unchanged, explore-shell.tsx:65)
    ├ <header> ....... 52px content band + env(safe-area-inset-top)   ← §3.5c
    ├ intro strip .... shrink-0, between header and main (unchanged)
    ├ <main> ......... flex-1 overflow-y-auto p-4 md:p-6  ← the ONLY scroll container
    │   └ panels grid (1 col <md · 2 cols ≥md; unchanged)
    │       ├ Experience: arc zone (above content <md) → content column
    │       └ Projects: stat tiles → swipe stage → terminal pointer
    ├ <footer> ....... 24.5px (≤639) / 32px (≥640) content band + env(safe-area-inset-bottom)  ← §3.5c
    └ tour overlay .... fixed, portaled-free, LAST child (unchanged)
```

Hierarchy is unchanged: header chrome > panel chrome (index chip 01–05, accent dot, label) > panel body. This phase promotes **no** new emphasis device and adds **no** new chrome.

### 1.2 Experience panel — the one layout change

| | `<md` (375–767) | `md+` (≥768) |
|---|---|---|
| container (line 132) | `flex flex-col gap-4` | `md:grid md:h-[calc(100dvh-14rem)] md:grid-cols-[2fr_3fr]` |
| arc zone column (line 134) | `flex flex-col` (**`hidden md:flex` retired**) | same element, now a grid item |
| arc zone box (line 135) | `relative h-[200px] md:h-auto` | grid-stretched, as today |
| controls row (lines 205–230) | **renders** (it lives inside the arc column) | renders |
| content column (line 233) | below the arc: all five entries readable, 20px rhythm | unchanged 40/60 grid, one layer at a time |
| scroll range | none (the sticky 300vh wrapper is `md:`-scoped, explore-panels.tsx:140) | `md:h-[300vh]` + sticky pair, unchanged |

Order top→bottom at `<md`: **arc strip (200px) → controls → content stack → sr-only live region → terminal pointer.** Arc top / content below is the shape (`D-01` "compact stacked layout"); no horizontal side-by-side at `<md`.

### 1.3 Projects panel — one shape, two height pairs

| | `<md` | `md+` |
|---|---|---|
| stage box (line 707) | `h-[690px]` (base) | `md:h-[830px]` |
| front card box (line 122) | `h-[420px]` (base) | `md:h-[560px]` |
| width cap | `max-w-[540px]` (the `max-w-[320px]` compact cap retires) | `max-w-[540px]` |
| wrapper | **none** — `<ProjectsStackStage>` renders directly | same |
| behind cards | **all depths visible** (the `compactHidden` rule retires) | all depths visible |
| centering | `flex h-full w-full flex-col items-center justify-center` + `mx-auto` | same + the md panel-centering shell (explore-panels.tsx:145) |

Arithmetic preserved at both tiers: `stage = card + PEEK_BAND_PX(250) + PEEK_SAFE_PX(20)` → 420+270=**690**, 560+270=**830**.

---

## §2 Reference geometry (measured, not eyeballed)

### 2.1 375px portrait — the arc

| measure | value | derivation |
|---|---|---|
| viewport | 375 | reference device 375×667 / 375×812 |
| `<main>` content box | 343 | 375 − 2×16 (`p-4`, explore-shell.tsx:77) |
| panel body box | 309 | − 2×1 border − 2×16 (`p-4`, panel-shell.tsx:49) |
| arc zone box | **309 × 200** | new base height |
| meet scale `s = min(W/100, H/200)` | **1.00** | height-limited |
| rendered radius `R = 100s` | **100px** | the semicircle is 200px tall, centred |
| arc box on screen | x ∈ [104.5, 204.5] | `offsetX=(W−100s)/2`; symmetric about W/2 |
| circle centre | (204.5, 100) | `viewBoxToPx` (timeline-geometry.ts:193) |
| label anchor radius `0.88R` | 88px | `LABEL_RADIUS_RATIO`, hook:113 |
| active (θ=180) anchor | (116.5, 100) — a 4-char year at `text-xs` spans 87.5→116.5: **inside** | B-2 right-align |
| bottom-end (θ=90) anchor | (204.5, 188) — left-aligned, spans 204.5→233.5: **inside** | `towardDiameter` false at exactly 90 |
| tightest marker pair (θ=112.5 / θ=90) | 6.7px vertical **and** 33.7px horizontal separation → no label collision | Δ = 90/(n−1) = 22.5°, n=5 |
| date-line budget `W/2 − 0.38R − 4` | **112.5px** → the real 20-char Chubb duration (120px) does **not** fit → suppressed below md | see §3.1d |
| horizontal overhang | none at any θ (max right extent 233.5 ≤ 309; min left extent 87.5 ≥ 0) | the predicate is the guard |

Base-height tolerance: any `H ∈ [180, 220]` satisfies the arithmetic above (R ∈ [90,110]; focal label left edge ∈ [46, 84] ≥ 0). **200px is pinned**; 180–220 is the acceptable band **(UNRESOLVED-D5)**.

### 2.2 `md+` tier — unchanged, with the date-line consequence

| viewport | arc zone | R | focal anchor x | date-line budget | verdict |
|---|---|---|---|---|---|
| 768 | 280.8 × 476 | 238 | 50.0 | 46px | suppressed (today: shown → latent overhang, see §3.1d) |
| 1024 | 383.2 × 544 | 272 | 88.2 | 84px | suppressed |
| 1280 | 485.6 × 576 | 288 | 133.4 | 129px | **shown** (Chubb 120px ✓, Upstream 132px ✗) |
| 1440 | 536.8 × 676 | 338 | 140.0 | 136px | Chubb ✓, Upstream 132 ✓, Netcompany 126 ✓ |

### 2.3 Why the label predicate is a correctness requirement, not polish

`<main>` declares only `overflow-y-auto` (explore-shell.tsx:77). Per CSS, when one axis is not `visible` and the other is, the `visible` axis computes to `auto` — so **`<main>` is also a horizontal scroll container**. Any absolutely-positioned marker label that paints left of its zone's box edge (or right of `main`'s content box) becomes scrollable overflow → a horizontal scrollbar on the phone, i.e. the user's "extra scrollbars" symptom. The shell root's `overflow-hidden` (both axes) does not stop it, because the overflow is *inside* `main`. Therefore: **no label may paint outside the arc zone at any width**, enforced by the re-derived predicate, with **no clipping added to the arc zone** (clipping a glyph mid-stroke is worse than the fix).

---

## §3 Surface contracts

### 3.1 Experience arc (REV-23)

**a. Retirement.** `experience-section.tsx:134` `hidden md:flex md:flex-col` → `flex flex-col`. The `data-timeline-arc-zone` div (line 135) `relative flex-1` → `relative h-[200px] md:h-auto` (`md:flex-1` may stay; it is inert on a grid item). The container (line 132) gains the base display mode: `flex flex-col gap-4 md:grid md:h-[calc(100dvh-14rem)] md:grid-cols-[2fr_3fr]` — without a base display the inherited `gap-4` is inert and the two children would butt together. The SVG path, `viewBox="0 0 100 200"`, `preserveAspectRatio="xMidYMid meet"`, `non-scaling-stroke`, dot anatomy, label anatomy, marker ladder, `md:hidden` year chip and the content templates are **unchanged**.

**b. Geometry stays container-derived at every width** — no new formula, no hardcoded positions: `viewBoxToPx(measured zone)` (timeline-geometry.ts:193) already scales `radius/labels` to the measured box; at 375 the measured box is 309×200 and the radius resolves to 100px (table §2.1).

**c. The hook's md gate narrows, it does not disappear.**
- `derive()` (hook:203-204) **drops** the `if (!mdMedia.matches) return;` early return so markers are positioned/emphasised at every width.
- The **layer write block** (hook:251-257) stays gated to `md+`, so `<md` keeps all five entries readable and `stageActive` stays false below md (hook:282/303) — i.e. no layer carries `aria-hidden` at `<md` (component line 252). **This is (UNRESOLVED-D1).**
- The `md` change listener stays (hook:276-290); its renewed duty is the **layer-ownership + step-mode handoff**, not arc visibility.
- `onScroll` may keep scheduling only at `md+` (below md `range = wrapperHeight − stageHeight ≈ 0` → `computeProgress` returns 0 → nothing to recompute); mount + ResizeObserver + discrete step must still `derive()` at every width.
- Below md there is **no** scroll range, so progress is pinned at 0 → `c′ = 0` → the active role at rest is entry 0 = Chubb at θ=180, the focal point. **The active role at the focal point is a rest-state property at `<md`, and a motion-state property at `md+`.** (This is the honest reading of REV-23's "the active role stays at the focal point".)

**d. Marker labels at `<md`: year-only (UNRESOLVED-D2, two options).**
- **Option 2 — RECOMMENDED: one predicate, the anchor budget.** The date-line fit predicate stops using the zone width and uses the *room actually available left of the focal anchor*: `budget = W/2 − 0.38·R − 4` (derived from `centerX = (W+R)/2` and the `0.88R` label inset). `dateLineFits(duration, budget)` keeps its signature (its unit tests at explore-timeline.test.mjs:503-521/597-599 stay green) but its call site (`experience-section.tsx:128`) passes the budget. Outcome: year-only at `<md` (table §2.1), shown at ≥ ~1250px where it genuinely fits, **and the latent 768–1023 overhang (§2.3) dies at the same time** — one mechanism, three correct outcomes.
- **Option 1 — alternative: `hidden md:block` on the date-line span** (year-only below md, today's width-form predicate above). Smaller diff, zero tablet change, but the 768–1023 horizontal overhang stays (flagged INFO/deferred).

Either way: the date-line span never renders where it cannot fit; **year labels never truncate** (`whitespace-nowrap` stays), never wrap, and never overlap (§2.1 separation arithmetic).

**e. Controls and touch.** The Prev/Next pair (lines 206-229) renders at every width by virtue of (a) — that is the fix for the user's "header/buttons missing". 44×44px stays. Ends disabled over the 5 stops (`disabled:opacity-50`). At `md+` a step is a `main.scrollTo` through the sticky range (unchanged). At `<md` a step is a **discrete index change** (there is no range to scroll): it moves the focal marker and brings the stepped-to entry into view inside `main`. **(UNRESOLVED-D1)** covers the discrete-step + layer-visibility pairing; the planner may implement the step either as a discrete index ref in the hook or as any equivalent that keeps `continuousIndex`/`markerAngle` (timeline-geometry.ts:101/125) as the ONE derivation.

**f. Markers remain non-interactive at every width.** The dots/labels keep `aria-hidden`, no hover/press/cursor affordance, and gain **no** touch target — the arc is not a scrubber surface this phase.

**g. No-JS / SSR.** Markers are `style={{opacity:0}}` pre-measurement and fade in 150ms after the first measured frame (hook:184-201) — unchanged behaviour, and the same at every width (already true at `md+` today). The no-JS narrow viewport therefore shows the arc stroke, no markers, and all five entry texts: accepted parity fact, not a regression (sweep E-8/E-9 pin the DOM, not the responsive state, and stay green).

### 3.2 Projects swipe stack (REV-23b)

**a. One contract.** Delete `src/components/explore/sections/projects-mobile-stack.tsx`. In `projects-section.tsx` delete the import (line 19) and replace the two viewport branches (lines 36-43) with a single unconditional `<ProjectsStackStage projects={cards} />`. The `mode`/`SwipeMode` prop retires from `projects-stack-stage.tsx`, together with every `compact` branch: `compactHidden` (lines 480, 508, 527, 560), `CARD_HEIGHT_CLASS[mode]` / `STAGE_HEIGHT_CLASS[mode]` (121-130), `widthClass` (695). Everything else is byte-identical: drag choreography, ring buffer, `PROMOTE_TRANSITION`, `EXIT_X`/`EXIT_ROTATION`, the 500ms announcement throttle, `aria-live`, `role="group"`, the bottom-anchored card box, the `overflow-hidden` clipping stage, per-card `aria-hidden` on non-front cards, the active-card bloom (`--panel-shadow-hover`) and its `overflow-visible` on the front card.

**b. Heights become a two-tier pair on the same constants** (arithmetic in §1.3), so `<md` keeps the 690px footprint (the phase's "690px-equivalent") **with the full peek band and every card visible**.

**c. Touch contract.**
- The stage box (line 707) gains a stable hook `data-projects-swipe-stage="true"` and the CSS pack sets `touch-action: pan-y` on it (§3.5d). **Never `none`** on the stage or on cards: that is precisely the "carousel that scrolls the wrong way / dead vertical scroll" symptom (mobile-native §9) — the card sits inside `main`'s scroll.
- The front card additionally carries framer-motion's own inline `touch-action: pan-y` (`drag="x"`, framer-motion 13.4.3 — `node_modules/framer-motion/dist/es/render/html/use-props.mjs:41-46` also sets `user-select:none`). The framer inline value is the mechanism on the card; the CSS rule is the structural pin on the clipping box. A component-level `touch-action` utility is therefore optional and must never be `none`.
- Drag is off under reduced motion (`drag={isFront && !reducedMotion ? 'x' : false}`, line 581) — unchanged, and it applies at every width now.

**d. Touch targets.** Prev/Next keep `h-[44px] min-w-[44px]` (lines 728/739). The active-card links (`View project` / `Source`) keep the ring recipe; they are the only in-card focusables. The drag surface itself needs no 44px rule (it is the whole card).

**e. Centering.** Stage `mx-auto` inside the root's `items-center justify-center` — centred at every width; at `md+` the panel body's md centering shell keeps doing its job. No negative margins/insets anywhere on this chain (a pinned invariant, projects-stack.test.mjs:517-537).

### 3.3 About panel (REV-24)

**a. Delete the avatar block entirely** — `about-section.tsx:140-150` (the `<img>` + its conditional). No image, no initials chip, no placeholder, no substituted element (locked wording: "nothing goes in there").

**b. Reflow compensation (required).** The avatar was the only separator between the availability chip and the summary; the summary `<p>` (lines 153-161) carries no top margin. Give it **`mt-3`** so the panel rhythm holds (12px, matching the chip/metrics/resume rhythm). Final DOM order = visual order = tab order:

```
positioning lead → metrics 2×2 → availability chip → summary (mt-3) → meta row
→ divider → 9 contact rows → Full resume (last)
```

Edge: when lead + metrics + chip are all absent the summary gains a 12px top offset (a 1-line conditional can remove it; the real data always has the lead, so `mt-3` is pinned).

**c. Keep, do not touch:** `ROW_CLASS` `min-h-[44px]`, both `exp-nudge` hooks and both `group-hover:underline`/`group-focus-visible:underline` pairs (pinned at explore-visuals.test.mjs:564-575), the divider, the 9-channel table, the resume link last. Update only this file's doc header (§2.1 item 4 and the "DOM order" sentence, lines 9-14/40/47-49).

**d. Data stays byte-identical.** `about.profileImageUrl` remains in the JSON and in the `.d.ts`, unconsumed *by the UI*. ⚠️ **Acceptance-grep caveat:** a repo-wide "no `profileImageUrl` consumption" grep is unsatisfiable and would be a false-red — the field legitimately remains consumed as **head metadata**, not UI, at `src/app/layout.tsx:42` (og:image), `src/app/layout.tsx:77` (JSON-LD `image`) and `src/app/(home)/layout.tsx:84` (og:image). Those consumers are out of this phase's scope and stay. Scope the check to the About panel source + the emitted panel HTML (`no <img … profileImageUrl/tinyurl`, no `Portrait of`).

### 3.4 Viewport meta (REV-25a)

**a. Typed export gains the fit** (`src/app/layout.tsx:59-64`):

```ts
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',        // ← new (REV-25a)
  themeColor: [ /* unchanged: two prefers-color-scheme entries */ ],
};
```

Expected emitted tag: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>`. **Never** emit `maximum-scale` or `user-scalable=no` (the constraint "never disable zoom"); pinch-zoom and browser zoom stay available.

**b. The data-rendered line retires.** Delete `<meta name="viewport" content={portfolioData.meta.viewport} />` (`src/app/layout.tsx:104`). Keep `<meta charSet={...} />` (:103). The `portfolioData` import stays used (metadata, personSchema) — no unused import.

**c. The data field stays.** `meta.viewport` remains byte-identical in the JSON and the `.d.ts`, unconsumed (portfolio-data-integrity.test.mjs:239 stays green). Nothing is deleted from data (map-content-surfaces ledger).

**d. Root-level by necessity, and that is a side effect to verify.** The `viewport` export lives in the **root** layout, so `/cli` and `/resume` also receive `viewport-fit=cover`. Their files stay byte-unchanged (scope) but their content does not pad for the notch → **phone-checklist item** (§10, item 9). This is not fixable by scoping the export; it is inherent.

### 3.5 Mobile-native platform pack (REV-25b)

**a. Where it lives, and why not in the components.** All declarations go in `globals.css`, **after** the Tailwind directives, next to the existing `.explore-shell` blocks. Route scope is achieved with `:has()` on the ancestors — the precedent already in this file (`body:has(.explore-shell)`, globals.css:684/690). The `(home)` layout's inline `documentScrollLock` is **not** extended with the platform rules (see b for its one required line): keeping it byte-stable keeps the two regex pins green (route-swap.test.mjs:160-166, projects-stack.test.mjs:592-598). The header/footer safe-area rules go in CSS rather than Tailwind classes in the components because `explore-header.test.mjs:124-153` pins the header's px-based `h-[52px]` immune-to-rem-shrink form; the CSS selector out-specifies the utilities ((0,1,1) vs (0,1,0)) so **`explore-header.tsx` and `explore-status-bar.tsx` stay byte-identical**.

**b. The height lock — one added line, and it is load-bearing.**

```js
const documentScrollLock = `
html,
body {
  height: 100%;
  height: 100dvh;      /* ← the reconciliation (REV-25b) */
  overflow: hidden;
}
`;
```

Why the added line is required: `body` is `flex flex-col h-full` (src/app/layout.tsx:129) and the shell is `h-dvh` (explore-shell.tsx:65). If `html/body` resolve to the *static/ICB* height while the shell tracks the dynamic viewport, the shell is a **flex item that shrinks** to the document box (`flex-shrink:1` default) — so it can never grow into the space the retracted URL bar frees, leaving exactly the strip below the status bar the user reported. Making `html/body` dynamic makes document height, body height and shell height the same number at every moment. `height: 100%` **stays first** as the fallback and to keep the existing lock regexes matching (`[^}]*` spans the new line). The shell keeps `h-dvh` and `overflow-hidden` (both axes); exactly one scroll container (`<main>`) remains. No `100vh`/`h-screen` anywhere in the landing path (verified — the only occurrences are `/cli`, `/resume`, `not-found`, `toast.tsx`, all out of scope).

**c. Safe areas — exact anatomy (padding + height compensation).**

```css
/* The content BAND keeps its existing height; the inset is added to the box,
   so the notch / home-indicator strip is painted by the bar's own background
   instead of squeezing the 44px controls. */
.explore-shell > header {
  padding-top: env(safe-area-inset-top, 0px);
  height: calc(52px + env(safe-area-inset-top, 0px));
}
.explore-shell > footer {
  padding-bottom: env(safe-area-inset-bottom, 0px);
  height: calc(1.75rem + env(safe-area-inset-bottom, 0px));
}
@media (min-width: 640px) {
  .explore-shell > footer {
    height: calc(2rem + env(safe-area-inset-bottom, 0px));
  }
}
```

- `.explore-shell > header` / `> footer` are exact: both are **direct** children of the shell root (explore-shell.tsx:66 and :81; the elements are explore-header.tsx:39 and explore-status-bar.tsx:38).
- The `env(..., 0px)` fallback keeps non-`viewport-fit` browsers at exactly today's geometry (inset resolves to 0 → no layout change).
- Content bands: header 52px; footer 24.5px at ≤639 (root font is 14px there, globals.css:466) and 32px at ≥640 — preserved by construction.
- Notched iPhone reference: header 52 + 47 = 99px; footer 24.5 + 34 = 58.5px. **No** compression of the 44px controls.
- Only top/bottom insets this phase. Landscape left/right insets are **deferred** (CONTEXT deferred idea: test once, adapt only if broken).

**d. Controls, tapping, overscroll.**

```css
html:has(.explore-shell) {
  /* inherited → one declaration kills the grey tap flash shell-wide */
  -webkit-tap-highlight-color: transparent;
}
html:has(.explore-shell),
body:has(.explore-shell) {
  /* kills pull-to-refresh AND the rubber-band reveal that exposes the strip
     below the status bar */
  overscroll-behavior: none;
}
.explore-shell button,
.explore-shell [role='button'],
.explore-shell a {
  /* drops the legacy double-tap delay; pinch-zoom unaffected */
  touch-action: manipulation;
}
.explore-shell [data-projects-swipe-stage] {
  /* the drag owns horizontal; vertical page scroll survives (mobile-native §9) */
  touch-action: pan-y;
}
```

`-webkit-tap-highlight-color` is inherited, which is why `html` is the carrier; `overscroll-behavior` is **not** inherited, which is why `html` **and** `body` are both listed. If the phone still bounces at `main`'s scroll ends after this, the one-line follow-up is `overscroll-behavior-y: contain` on `.explore-shell > main` (a scoped diagnostic, not part of the locked pack).

**e. Not added (deliberate).** No `user-select: none` in the locked pack. If it is added, scope it to `button`/`[role=button]` only — **never** to `a`, because the About contact rows must stay selectable/copyable (email, links) and the iOS long-press callout there is a feature. **(UNRESOLVED-D4: default = skip this phase.)**

**f. Motion.** The pack adds **zero** animations/transitions. The reduced-motion guard (globals.css:681-694) remains the single suppressor and covers everything new by DOM position.

---

## §4 Interaction states — every control, every state

Legend: **—** = state does not exist for this control (nothing invented).

| Control | default | hover | active/press | focus-visible | disabled | loading | error |
|---|---|---|---|---|---|---|---|
| Arc Prev/Next (both widths) | ghost, `text-muted-foreground` / `text-accent`, 44×44 | `hover:bg-muted` | (inherits the muted tint) | 2px ring + 2px offset (GHOST recipe, unchanged) | at the clamped ends, `disabled:opacity-50`, not focusable-actionable | — | — |
| Arc markers (dots/labels) | non-interactive, `aria-hidden`, no cursor | — | — | — | — | — | — |
| Swipe front card | rest at `cardState` depth pose; bloom `--panel-shadow-hover`; `overflow-visible` | — (no lift: `exp-lift` is explicitly absent — pinned) | **drag-x** (pointer/touch) | — | non-front cards: `pointer-events-none`, `aria-hidden`, deeper opacity | drag-release **below** threshold → spring back to pose (`stiffness 500 / damping 30`) | — |
| Swipe drag accepted | — | — | fly-off 500px + 12° in 220ms easeOut, then loop to the back | — | reduced motion: **no drag**, instant swap (opacity-only) | — | — |
| Stack Prev/Next | ghost, 44×44 | `hover:bg-muted` | — | ring recipe | — (ring buffer never ends; `Home`/`End` jump) | during a fly-off `pendingStep` guards re-entry | — |
| Header controls ×4 (tour/theme/drawer/terminal) | unchanged | unchanged | `active:bg-muted/80` | unchanged | — | — | — |
| Contact rows, links, resume row | unchanged | unchanged (exp-nudge + underline) | — | unchanged | — | — | — |

**Touch-specific additions (all from §3.5):** tap highlight suppressed shell-wide; `touch-action: manipulation` on controls/links; `touch-action: pan-y` on the swipe stage; safe-area padding on header/footer; **no** `:hover`-dependent affordance is required to operate anything on a phone (every hover style has a non-hover equivalent or is decorative).

**Loading / error states:** this phase introduces **no** async surface, no skeleton, no spinner and no error UI. The only "error-ish" states are data-absence states, handled by the existing graceful-hide matrix (§5.3). Nothing is invented.

---

## §5 Visual behaviour

### 5.1 Motion inventory (no additions)

| where | transition | value | unchanged? |
|---|---|---|---|
| panel entrance stagger | `.panel-grid > *` keyframes | 240ms, 40ms cascade | yes |
| hover bloom / nudge | `.exp-lift`, `.exp-nudge` | 220ms cubic-bezier(0.25,1,0.5,1) | yes |
| credentials tab capsule | `.exp-tab*` | 200ms | yes |
| arc discrete colour/dot swaps | `transition-colors` | 200ms ease-out | yes |
| arc marker reveal | inline one-shot opacity (armed by the hook) | 150ms | yes |
| swipe promote / fly-off | framer | 250ms / 220ms easeOut | yes |
| **platform pack** | **none** | — | — |

Reduced motion: everything above is suppressed by the single guard; drag is disabled; the discrete index still steps via the buttons (unchanged contract).

### 5.2 Responsive transitions
Only one breakpoint flip (`768px`) on the Experience panel container. No layout animation is added across it (the container is a static box; no `transition` on display/grid changes).

### 5.3 Empty states (all pre-existing, all still total)

| condition | behaviour |
|---|---|
| 0 selected timeline entries | panel body renders `null` (E-1) — no arc zone, no controls |
| 1 selected entry | arc renders (200px) with a single marker at θ=180; both controls disabled; no carousel travel |
| 0 projects | panel body `null` |
| 1 project | single non-draggable card (no controls, no ring) |
| absent `project.link` / `sourceUrl` | rows omitted |
| absent lead / metrics / chip | omitted per the §2.8 matrix; the summary keeps `mt-3` (see §3.3b) |
| `profileImageUrl` absent | irrelevant — the block no longer exists |

### 5.4 Error states
None. A missing/empty data field degrades by omission (above); a throwing data read is not in this phase's surface.

### 5.5 SSR / static export
- Arc markers: `opacity:0` inline, faded in on the first measured frame — at every width (accepted; already true at `md+`). The arc stroke, the group landmark, both control labels and the `01 / 05` counter all render in the export (sweep E-8/E-9 keep passing).
- Layers 2–5 keep SSR `visibility:hidden` + `aria-hidden` (sweep E-7 keeps passing; the `<md` hook branch never rewrites the SSR style prop).
- The retirement is pure class/DOM, so no route gains or loses a static page; `output: 'export'` stays green.

---

## §6 Accessibility

- **Targets:** 44×44px on every control, unchanged (header ×4, arc ×2, stack ×2, contact rows, resume row). The arc markers gain no target.
- **Focus:** all rings unchanged (GHOST recipe shared by the arc and the stack; the status-bar chip keeps its inset ring). The platform pack changes **no** focus styling.
- **Zoom:** never disabled (`viewportFit` only; no `maximum-scale`, no `user-scalable=no`). `touch-action: manipulation` removes double-tap-zoom on controls only — pinch-zoom everywhere else is untouched.
- **Screen readers:** `role="group" aria-label="Career timeline"` + the sr-only polite live region on discrete index change (unchanged); `role="group" aria-label="Projects carousel"` + the 500ms-throttled live region (unchanged, now at every width — a **strict improvement**, since `<md` previously got it too but with a dead drag). At `<md`, no layer is `aria-hidden` (all five readable).
- **Safe areas:** the header/footer content sits inside the insets at every orientation-with-notch (portrait this phase).
- **Contrast/themes:** no token changes; the arc stroke `hsl(var(--border))`, active dot `chart-2` (light override present), labels `foreground`/`muted-foreground`; the safe-area strips are painted by the bars' own backgrounds (`bg-background`), so both themes stay legible including under the notch.
- **Orientation:** portrait-first; landscape-specific insets deferred.

---

## §7 Edge coverage matrix (explicit, per requirement)

| # | Edge | Expected | Enforced by |
|---|---|---|---|
| E1 | 375px width, arc at rest | semicircle R=100 visible above the content; Chubb (2023) at θ=180; 5 year labels, no collision, no truncation | grep (no `hidden md:flex`), §2.1 arithmetic, phone |
| E2 | 375px width, tapping Next | focal marker moves to the stepped-to entry; the entry comes into view; both ends clamp | (UNRESOLVED-D1), phone |
| E3 | Any width, date line that cannot fit | not rendered (no overhang → no horizontal scroll) | `dateLineFits` with the anchor budget + unit rows (new) |
| E4 | 375px, `<main>` horizontal overflow | none: no element paints outside its box | test: the label predicate + no clipping + the stage's `overflow-hidden` |
| E5 | 375px swipe | touch drag works; behind-cards peek; centred; bloom visible; 44px controls | stage tests (renewed) + phone |
| E6 | 375px vertical scroll over the card | page scrolls (drag does not eat it) | the `pan-y` pins (stage + framer inline) + phone |
| E7 | Reduced motion on phone | no drag; buttons still step; no new motion | existing RM guard + the RM drag gate |
| E8 | Notched device | header 52 + inset; footer band + inset; nothing under the notch/home indicator | the safe-area rules + phone |
| E9 | URL bar retracting | no strip below the status bar, no clipped footer | the dvh lock line + `overscroll-behavior: none` + phone |
| E10 | `/cli`, `/resume` on a phone | their layouts byte-unchanged; check for content under the notch (side effect of the root-level `viewport-fit`) | byte-diff + phone (item 9) |
| E11 | Tour/wizard on a phone | plays step-for-step; **check the docked card is not under the home indicator** (it measures `window.innerHeight`, which now includes the safe area) | phone (item 8) |
| E12 | 1 project / 1 entry / 0 projects / 0 entries | §5.3 table | existing branches |
| E13 | Both themes at 375px | legible; strips match the theme | token inspection + phone |
| E14 | No-JS narrow viewport | arc stroke + all five texts; markers unpositioned (same as `md+` today) | sweep E-7/E-8/E-9 |
| E15 | 768–1023px desktop/tablet | no horizontal scrollbar; the date line follows §3.1d option choice | the predicate rows (new) + sweep |

---

## §8 UNRESOLVED (each with the default the planner MUST assume)

**UNRESOLVED-D1 — `<md` arc interaction pairing (the phase's one real fork).**
Should the `<md` content column keep all five entries readable (with the arc as a focal indicator above) or follow the arc one-entry-at-a-time (true `md+` symmetry)? **Default to ASSUME = keep all five readable** + the arc positions/emphasises at every width + a `<md` step is a discrete index change that also brings the stepped-to entry into view inside `main` (so a tap has a visible result). Rationale: the SPEC enumerates only the arc zone and the swipe wrapper as retirements; the five-entry readable stack is the phase-9 readability form the user never complained about; and one-entry-at-a-time on a phone forces tap-through to read a CV. **The alternative (full symmetry) needs the user's word** — surface it in the phone checklist.
*Consequence if the user later chooses symmetry:* the layer write block loses its md gate and the §3.1c branch disappears; nothing else changes.

**UNRESOLVED-D2 — the date-line predicate (Option 2 vs Option 1).** Default to ASSUME = **Option 2** (one anchor-budget predicate; year-only below md; also fixes the latent 768–1023 horizontal overhang). Take Option 1 only if the user wants the sub-label preserved on tablets — in which case the latent overhang is recorded as INFO/deferred, not silently kept.

**UNRESOLVED-D3 — RESOLVED DEVIATION, flagged for the planner.** CONTEXT D-06 says "html/body keep `height:100%` + `overflow:hidden` … the gap-after-footer dies". The arithmetic in §3.5b shows those two declarations alone cannot kill it; the **added `height: 100dvh` line is required**. `height: 100%` is kept (first line, fallback + pinned regexes). Treat the extra line as in-scope for REV-25, not as scope creep.

**UNRESOLVED-D5 — the arc base height.** Default `h-[200px]`; the safe band is 180–220px. Do not exceed ~220 at 375px without re-checking the label arithmetic (§2.1) and the marker separation (6.7px vertical at the tightest pair).

**UNRESOLVED-D6 — carrier for the safe-area declarations.** Recommended = scoped `globals.css` rules (keeps `explore-header.tsx`/`explore-status-bar.tsx` byte-identical and the `h-[52px]` px-immunity pin intact). Acceptable alternative = Tailwind arbitrary values in the components, but then the calc needs `_`-escaped spaces (`h-[calc(52px_+_env(safe-area-inset-top))]` — CSS `calc` requires whitespace around `+`) and the header/footer test pins must be renewed deliberately.

**UNRESOLVED-D4 — `user-select: none`.** Default = **not added** this phase (outside the locked pack). If added: `button`/`[role=button']` only, never `a`.

---

## §9 Stale-test renewal + acceptance gates

### 9.1 Renewals (verified against the current suites — these will go red by design)

| File:line | Pin today | Why it breaks | Renewed assertion |
|---|---|---|---|
| `projects-stack.test.mjs:463-471` | `heightMap()` requires a `full|compact` Record | the mode Record retires | parse the two class constants positionally; assert `card + 250 + 20 = stage` at both tiers |
| `projects-stack.test.mjs:495-509` | loops `['full','compact']`; "compact owns the base height"; `!md:` in `stage.compact` | same | assert the base (unprefixed) pair is the `<md` pair (690/420) and the `md:` pair is 830/560; assert **no** mode key remains |
| `explore-visuals.test.mjs:186-189` | `clientBodies` includes the mobile-stack path | the file is deleted → read throws | drop the path; keep the other three |
| `explore-visuals.test.mjs:291-293` | zero-literal exclusion names the mobile-stack path | dead path | drop the reference |
| `explore-visuals.test.mjs:960-964` | `ProjectsMobileStack` imported; `hidden md:block`; `md:hidden` | the wrapper retires | assert ONE unconditional `<ProjectsStackStage`, no `hidden md:block`/`md:hidden` wrapper, no `ProjectsMobileStack`, still cites REV-23/REV-23b |
| `explore-visuals.test.mjs:1047-1051` | mobile-stack file exists, no framer-motion, delegates | deleted | **gone-check**: `existsSync(mobilePath) === false` ("retired with the parity contract") |
| `explore-visuals.test.mjs:1111-1149` | REV-18 citation clauses read the mobile-stack source | `readFileSync` ENOENT | drop the surface from the four; add the gone-check; assert projects-section names REV-23/REV-23b |
| `explore-visuals.test.mjs:250-256` | hook reads `matchMedia('(min-width: 768px)')` as the "md gate" | the gate narrows (markers at every width, layers md-only) | keep the query pin; restate the duty as layer-ownership + step-mode handoff; **add** "no `!mdMedia.matches` early return in the marker derivation" |
| `explore-visuals.test.mjs:896` | the md gate carries its change listener (compact↔stage handoff) | the handoff is now layer-only | renew the comment/assertion to the layer-ownership contract |
| `explore-visuals-server.test.mjs:143-147` | tiles → stage → **mobile stack** order | wrapper retires | tiles → stack, single stage, mobile wrapper absent |
| `explore-visuals-server.test.mjs:160-163` | `target="_blank"` in the stack **or** mobile source | ENOENT on the mobile read | assert it in the stage source only |
| `route-swap.test.mjs:216-219` | root layout "keeps `viewport`" | still true, but under-verifies REV-25a | extend: `viewportFit` present; the data-file meta line gone from BOTH layouts; no `user-scalable`/`maximum-scale` |
| `route-swap.test.mjs:160-166`, `projects-stack.test.mjs:592-598` | landing lock regex `height:100%; … overflow:hidden` | **must stay green** — the dvh line goes *between* them; reorder them and both reds | do not reorder; add a positive assertion for the dvh line + `overscroll-behavior` |
| `explore-sweep.test.mjs` mobile rows (`:41/:100/:131/:139/:223`) | EXPLORE@375 rows | the arc's `<md` height + no-`hidden` change the 375px surface | re-derive: keep "1 col at 375" + "shell overflow-hidden"; add the arc `<md` box + no-`hidden md:flex` |
| `portfolio-data-integrity.test.mjs:237-239` | `meta.viewport` byte-identical | **stays green** (data untouched) | keep; optionally add an unconsumed-gone-check (the string survives in no `src/` file but the data + `.d.ts`) |
| `explore-timeline.test.mjs:503-521/597-599` | `dateLineFits` unit rows (200/196/100 budgets) | **stay green** (pure function, signature kept) | keep; **add** the anchor-budget rows: 375 → `dateLineFits('Sept 2023 — Present', 112.5) === false`; 1440 → `=== true` |

### 9.2 New pins (the phase's own acceptance, programmatic half)

1. `experience-section.tsx` contains no `hidden md:flex`; it contains the base `h-[200px]` arc-zone height and the base `flex flex-col` container.
2. `experience-section.tsx` still contains the arc path `M 100 0 A 100 100 0 0 0 100 200`, the `md:hidden` year chip, `role="group"`, `aria-label="Career timeline"`, both control `aria-label`s, the `01 / 05` counter form.
3. `projects-section.tsx`: exactly one stack render, no `ProjectsMobileStack`, no `hidden md:block`, no `md:hidden`.
4. `projects-stack-stage.tsx`: no `mode`, no `compact`, no `max-w-[320px]`; the base/md height pairs satisfy the band arithmetic; `data-projects-swipe-stage` present; `touch-action: pan-y` present in `globals.css` for that hook and **no** `touch-action: none` anywhere in the shell's CSS.
5. `about-section.tsx`: no `<img`, no `profileImageUrl`, no `Portrait of`; the summary carries `mt-3`; the resume link is still last.
6. `src/app/layout.tsx`: `viewportFit: 'cover'` in the typed export; no `portfolioData.meta.viewport`; `width`/`initialScale` present; no `maximumScale`/`userScalable`.
7. `globals.css`: `-webkit-tap-highlight-color` under `html:has(.explore-shell)`; `overscroll-behavior: none` on both `html:has(...)` and `body:has(...)`; `touch-action: manipulation` on the three control selectors; the two `env(safe-area-inset-*)` blocks; **no** rule targeting `/cli`- or `/resume`-only selectors.
8. `(home)/layout.tsx`: the lock keeps `height: 100%` first and gains `height: 100dvh`; still `overflow: hidden`.
9. `explore-header.tsx` / `explore-status-bar.tsx` / `cli/layout.tsx` / `resume/page.tsx`: **byte-identical** (the untouched claim, proven by absence of change).
10. NEW sweep E-row on `out/index.html`: `viewport-fit=cover` present; `shrink-to-fit` absent; no `<img>` with the tinyurl src; no `Portrait of`.
11. `dateLineFits` anchor-budget rows (see §9.1).

### 9.3 Gate order (D-07)
`npm run typecheck` → `npm test` (node --test, all suites) → `npm run build` → the export rows (which read `out/`) → then the phone checklist. Nothing in §9 counts until the **final** chronological run covers the final tree (any post-run write reopens the gate).

---

## §10 Phone checklist (user-owned — every visual claim in this document rides on it)

Portrait, one notched device + one non-notched if available, both themes, reduced-motion on and off.

1. Header visible and tappable; all four controls work; the bar reaches the top edge and its content is not under the notch. Footer reaches the bottom edge; its text is not under the home indicator.
2. **No gap below the footer** at rest, while the URL bar hides/shows, and after scrolling to the bottom of the main area.
3. **Exactly one scrollbar**: no window scrollbar and no horizontal scrollbar anywhere (test at the arc, at the Projects stack, mid-swipe).
4. Experience: the semicircle renders above the content, scaled to the phone; the five year labels are readable and never truncated/overlapping; the active year sits at the left-bulge focal point.
5. Prev/Next step the arc and are tappable (44px), disabled at the ends; a step has a visible result (per UNRESOLVED-D1's default: the stepped-to entry comes into view). **Answer UNRESOLVED-D1 here**: is the five-entry readable stack right, or do you want one entry at a time with the arc driving it?
6. Projects: the full stack — touch drag swipes the card away, the card behind peeks, the stack is centred, the depth/bloom shadows render, the counter and both controls work.
7. Vertical page scroll still works when the gesture starts on the card (drag horizontal = card, drag vertical = page).
8. Wizard: still plays step-by-step; check the **docked** card's buttons are not under the home indicator (the overlay now measures a taller viewport).
9. `/cli` and `/resume` from the phone: check their top/bottom edges for content under the notch — a side effect of the root-level `viewport-fit` (out of scope to fix; report if broken).
10. Credentials panel and the drawer: unchanged.
11. Both themes legible, including the strips behind the notch and above the home indicator.

---

## §11 Non-goals / deferred

- **Not touched:** wizard/tour, drawer, Credentials, CLI, `/resume`, panel grid placement, intro strip, status-bar tokens, theme tokens, the 300vh sticky range at `md+`, the `md+` arc geometry, data files (nothing deleted).
- **Deferred:** landscape-specific insets (left/right safe areas); a user-supplied profile image; PWA/manifest; sticky-hover gating via `@media (hover: hover)` (mobile-native's sticky-hover symptom — real, but outside the locked pack; promote only if the phone test shows a lingering tint that bothers); `overscroll-behavior-y: contain` on `main` (only as a fallback diagnostic); the 768–1023 date-line overhang under Option 1.
- **Explicitly rejected:** clipping the arc zone to hide label overhang; `touch-action: none` anywhere in the shell; device sniffing; `user-scalable=no`/`maximum-scale`; any new dependency; converting the header's px tokens to rem.

---

## §12 Evidence index (every claim's source)

- Arc: `src/components/explore/sections/experience-section.tsx:132-135, 205-230, 262-276`; `src/components/explore/timeline-geometry.ts:193-224, 319-322`; `src/components/explore/use-timeline-progress.ts:104-113, 162-166, 203-305, 323-351`.
- Stack: `src/components/explore/sections/projects-stack-stage.tsx:70-133, 451-593, 595-747`; `projects-mobile-stack.tsx` (whole); `projects-section.tsx:19, 36-43`; `explore-panels.tsx:139-147`; framer-motion 13.4.3 `dist/es/render/html/use-props.mjs:33-47`.
- About: `src/components/explore/sections/about-section.tsx:140-161, 218-227`; `src/app/layout.tsx:42, 77`; `src/app/(home)/layout.tsx:84`; `src/data/portfolio-main-data.json` (`about.profileImageUrl`, `meta.viewport`).
- Frame/CSS: `src/components/explore/explore-shell.tsx:65-88`; `explore-header.tsx:39`; `explore-status-bar.tsx:38`; `panel-shell.tsx:49`; `src/app/(home)/layout.tsx:52-58`; `src/app/globals.css:463-467, 495-535, 676-694`; `src/app/cli/layout.tsx:32`; `src/app/resume/page.tsx:25`.
- Tests cited: `tests/projects-stack.test.mjs:463-598`; `tests/explore-visuals.test.mjs:186-256, 291-293, 340-370, 555-585, 890-900, 955-975, 1040-1150`; `tests/explore-visuals-server.test.mjs:52-66, 140-165`; `tests/route-swap.test.mjs:140-230`; `tests/explore-sweep.test.mjs:41-241, 381-470`; `tests/explore-timeline.test.mjs:503-521, 597-599`; `tests/portfolio-data-integrity.test.mjs:237-239`; `tests/explore-header.test.mjs:124-153`.

---

*Phase: 13-mobile-parity-revision · UI-SPEC generated 2026-10-05 · supersedes nothing; derives from the locked SPEC + CONTEXT.*
```

---

**Highlights the planner must not miss** (all grounded in file reads above):

- **`main` is a horizontal scroll container too** (`overflow-y-auto` alone ⇒ the other axis computes to `auto`) — that is the mechanical cause of "extra scrollbars", and it is why the arc's label fit predicate is a correctness requirement, not polish.
- **The `hidden md:flex` retirement is not sufficient by itself**: the hook's `!mdMedia.matches` early return (`use-timeline-progress.ts:204`) must narrow, or the arc would render unpositioned on phones; and the controls row lives *inside* the retired zone (that is the "buttons missing" complaint).
- **CONTEXT D-06's height-lock line is insufficient as written** — `height: 100dvh` on `html/body` is load-bearing for the gap-after-footer (flagged as a resolved deviation, §8/D3).
- **Safe-area padding must be paired with height compensation**, or the header's fixed `52px` box gets crushed by a 47px inset; carrier pinned to scoped CSS in `globals.css` to keep the header/footer files byte-identical (their px-immunity test pins).
- **"No `profileImageUrl` consumption" is unsatisfiable repo-wide** — og:image/JSON-LD still consume it legitimately; scope the acceptance grep to the About panel.
- **Root-level `viewport-fit=cover` also lands on `/cli` and `/resume`** — flagged as a phone-checklist item since those routes are out of scope.
- **One real fork needs a decision** (`UNRESOLVED-D1`: `<md` five-entry readable stack vs one-entry symmetry) — default assumed, with the phone checklist asking the user directly.