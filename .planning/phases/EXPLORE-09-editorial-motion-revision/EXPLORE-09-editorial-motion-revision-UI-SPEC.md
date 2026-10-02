All references verified against the tree (grid composition, About/Experience/Projects bodies, PLACEMENT map, drawer accent pairing, tour step generation trap, motion vocabulary in globals.css, data shapes, phase SPEC). Below is the full UI-SPEC.md for the orchestrator to write to disk.

---

# EXPLORE-09-editorial-motion-revision — UI-SPEC (design contract)

**Phase:** 09 editorial-motion-revision · **Status:** Ready for planning · **Locked inputs:** SPEC (REV-14…REV-17) + CONTEXT D-01…D-05.
**Scope of this contract:** layout, interaction states, visual behaviour, accessibility, and edge coverage for the four revisions. Rails inherited untouched: IDE tokens (bg-card/border/muted-foreground/chart-1..4/accent), JetBrains Mono (`font-mono`), PanelShell chrome (byte-identical), 375px invariant, 44px touch targets, `.explore-shell` reduced-motion guard (globals.css:647–659), zero new dependencies beyond the adopted framer-motion v13.4.3, static-export SSR renders first composition states as real text.

---

## §1 Grid reflow (REV-14, D-01)

### 1.1 Order table (md+)

| Grid slot | DOM order (new) | Panel | Index chip | Accent (per-id, unchanged) |
|---|---|---|---|---|
| Row 1 · col 1 | 1 | About + Contact (merged) | `01` | chart-1 |
| Row 1 · col 2 | 2 | Skills | `02` | chart-3 |
| Row 2 · span-2 | 3 | Experience (sticky range, wrapper) | `03` | chart-2 |
| Row 3 · span-2 | 4 | Projects (sticky range, **new** wrapper) | `04` | chart-4 |

Pinned mechanism (recommendation, grep-verifiable): reorder `EXPLORE_SECTIONS` in `src/components/explore/constants.ts:10` to `[about, skills, experience, projects]`. The index chips (`String(index+1).padStart(2,'0')`, explore-panels.tsx:133), the entrance stagger and the drawer items re-derive automatically. Alternative (pure placement classes with the array untouched) is rejected: it leaves drawer order ≠ DOM order and re-numbers nothing.

**PLACEMENT deltas** (explore-panels.tsx:108–116 — the phase's only three→four placement class sites):
- `experience.wrapper`: `'md:col-span-2 md:h-[300vh]'` — **`md:order-first` removed** (Experience lands on row 2 naturally). `experience.shell` sticky recipe unchanged.
- `projects.wrapper`: `'md:col-span-2 md:h-[300vh]'` — **new**; conditional like W-3 (§4.5). `projects.shell`: `'md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]'` — **new**; the existing `md:col-span-2` moves from shell to wrapper. Plain wrapper div, **no id** (R-3: the tour hole, IO and drawer anchors measure the sticky section by its stable id).
- `about` / `skills`: unchanged (`''`).

### 1.2 Re-mapped flows

| Flow | File | Contract |
|---|---|---|
| Drawer items + digit accents | explore-drawer.tsx:53–68 | Item order follows the new array (About, Skills, Experience, Projects). **`DIGIT_ACCENTS` (line 33) is positional — it breaks:** item 02 (Skills) would get chart-2. Pin: digits become a per-id Record mirroring ACCENTS (`text-chart-1` about, `text-chart-2` experience, `text-chart-3` skills, `text-chart-4` projects) so the digit color follows the section, not the position. |
| Visited counter | explore-status-bar.tsx:44–49 | Count-based (`n/4`), order-independent — no change; accent at 4/4 unchanged. |
| Tour CONTENT order | constants.ts:109–123 | **Trap:** `EXPLORE_TOUR_STEPS` is generated via `EXPLORE_SECTIONS.map` with a **positional** body array — reordering the array silently re-pairs bodies (Skills would get "Roles in order…"). Pin: the 6-step table becomes id-keyed (literal steps, bodies looked up by section id) so CONTENT order stays **welcome → about → experience → skills → projects → finish** while DOM order is About→Skills→Experience→Projects (D-01). Tour scroll targets (`getElementById`, tour.tsx:111/160) re-derive automatically. |
| Entrance stagger | globals.css:599–607 | 4 grid children in new DOM order — delays 0/40/80/120ms land automatically; no CSS change. |
| IO visited marking | section-id based | Order-independent — no change. |
| Status bar breadcrumb | — | Static — no change. |
| Mobile stack (<768) | — | 1-col DOM order: About, Skills, Experience (compact), Projects (compact list). |

### 1.3 Breakpoints
Base 1-col / `md:grid-cols-2` / `lg:gap-5` — unchanged (explore-panels.tsx:123). Every placement utility stays `md:`-scoped (375px invariant). No overflow utility on the wrapper/shell/grid ancestor chain (sticky-breaker audit carries over; see §4.1 for the one *descendant* overflow that is new and safe).

---

## §2 About panel anatomy (REV-15, D-02)

### 2.1 Block order (top → bottom) — pinned
1. **Positioning lead** (new `about.positioning`, 2 pinned lines)
2. **Metrics row** (new `about.metrics`, 4 stats)
3. **Availability chip** (new `about.availability`)
4. **Avatar** (`about.profileImageUrl`)
5. **Demoted summary** (`about.description`, smaller + muted) + the existing meta row (Briefcase title + MapPin location) kept attached below it
6. Divider (`my-3 border-t border-border`, existing)
7. **9 tightened contact rows** (existing anatomy)
8. **Full resume link** (bordered accent row, LAST interactive element — unchanged)

Notes order is authoritative (`positioning/metrics/availability/avatar/summary/contacts`); D-02's "summary below the lead" is satisfied in document order. (UNRESOLVED U-1: if the planner reads D-02 as *immediately* under the lead, the summary and metrics blocks swap — default is the notes order.)

### 2.2 Positioning lead
- Two hard lines, verbatim: line 1 `I design test automation frameworks and AI-driven QA infrastructure that entire engineering organizations adopt.` line 2 `— not just run.` Rendered as two block spans (never joined, never re-wrapped into one paragraph).
- Typography (discretion, pinned default within the text-sm..text-base range): line 1 `text-base font-medium text-foreground leading-snug`; line 2 `text-base text-accent` (the em-dash tail as the accent punch). (UNRESOLVED U-2: line 2 muted instead of accent; and a `md:text-sm` fallback if the half-panel wrap count reads too heavy.)
- Zero motion (no reveal animation; the panel entrance stagger covers it — see U-6).

### 2.3 Metrics row
- Layout (discretion, pinned default): **2×2 mini-tile grid** — `grid grid-cols-2 gap-2`, tile anatomy mirrors ProjectStatTiles (project-stat-tiles.tsx:21–30): `rounded-md border border-border p-2.5`, value `text-sm font-medium leading-none tabular-nums text-foreground`, label `mt-1 text-[10px] uppercase tracking-wider text-muted-foreground`. Holds at 309px inner (2×~150px). (UNRESOLVED U-3: inline wrapped chips as the alternative.)
- Values **never computed at render time** — verbatim transcription in the data draft (§10). Labels stored lowercase, uppercased by CSS.
- Static chrome (§17.6 precedent): no hover, no focus, no cursor.

### 2.4 Availability chip
- Content verbatim from data: `Open to selective part-time work` (source: WelcomeMessage.tsx:42, verbatim).
- Anatomy: inline pill — small dot (`h-2 w-2 rounded-full bg-chart-1`, About's accent) + text, `rounded-full border border-border px-2.5 py-1 text-xs text-accent`; non-interactive (no hover/focus/cursor). Micro-chrome discretionary (U-4).

### 2.5 Avatar
- `about.profileImageUrl` → `rounded-full object-cover h-16 w-16 md:h-20 md:w-20` (size classes locked by SPEC); default full-circle crop (U-5 for `rounded-md` alternative).
- `alt={\`Portrait of ${about.name}\`}`; plain `<img loading="lazy" decoding="async">` (U-12: tinyurl is not in next.config remotePatterns — plain img default).
- Graceful-hide: empty/missing URL → no element, no invented copy. Broken-at-runtime URL: default = no `onError` handler (AboutSection stays a server component; the browser fallback is the accepted edge). (UNRESOLVED U-5: a ~12-line client `AvatarImg` with onError-hide if the planner elects it.)

### 2.6 Demoted summary + meta
- Summary (`about.description`): `text-xs leading-relaxed text-muted-foreground` (demoted from the current `text-sm text-foreground`).
- Meta row (Briefcase title + MapPin location): unchanged anatomy, kept directly under the summary block (its current relative slot).

### 2.7 Contacts (9 rows) — tightened
- Anatomy unchanged (icon + label + `break-all` value, `ROW_CLASS` ring recipe, email `mailto:` / external `target="_blank" rel="noopener noreferrer"`, graceful-hide per empty value, values wrap never clipped).
- Tightening: `min-h-[44px]` **stays** (44px rail, D-05); compactness comes from `gap-2.5 → gap-2`, value `leading-snug`, and `my-3 → my-2`/`mt-3 → mt-2` rhythm. Exact compact spacing discretionary within those bounds.
- Full resume row: unchanged anatomy, `min-h-[44px]`, accent text, `exp-nudge` arrow.

### 2.8 Graceful-hide matrix (all server-side, no invented copy)
| Field state | Render |
|---|---|
| `positioning` absent/empty | Lead omitted; summary renders at its pre-phase prominence (`text-sm text-foreground`) — the pre-phase presentation is the fallback (U-7) |
| `metrics` empty array | Row omitted, no placeholder |
| `metrics` 1–3 entries | Render what exists (grid auto-flows) — "exactly 4" is the data shape, the UI is total |
| `availability` absent/empty | Chip omitted |
| `profileImageUrl` absent/empty | Avatar omitted |
| Any contact value empty | Row omitted (existing) |

---

## §3 Experience arc — education merged (REV-16, D-03)

### 3.1 Entry derivation
- `selectTimelineRoles` generalizes to a typed entries array with a `type: 'role' | 'education'` discriminator: entries = `experience.filter(isTechRelated) ∪ education.filter(featured)`, **sorted by parsed start year** (the one deliberate sort of this phase — year-ascending), 5 entries pinned: BEng 2012 · Netcompany-Intrasoft 2019 · MSc 2021 · Upstream Systems 2022 · Chubb 2023. Marker = first-year pattern (`startYear`, timeline-geometry.ts:247 — education durations are hyphen-style, `startYear` is dash-agnostic ✓).
- Engine untouched: `use-timeline-progress.ts`, the rAF channel, `markerAngle/markerEmphasis/contentLayer` all byte-unchanged; the derivation module stays zero-runtime-import (node --test renews over 5 entries). Zero framer-motion under `src/components/explore/sections/experience*` (grep gate).
- Generalization is already total: n=5 → `markerAngle` Δ = 22.5° (θ ∈ [90°,270°] always ✓), emphasis ladder t = 1 − |i−c′|/4 → opacities 1 / 0.9125 / 0.825 / 0.7375 / 0.65, scales 1 / 0.925 / 0.85 / 0.775 / 0.7. W-4 date-line predicate: education durations are **24–30 chars** (W-3 correction: `October 2021 - June 2023` = 24, `September 2012 - December 2018` = 30) → 144–180px at 6px/char, fits at md (inner ≥ ~196px; verified ≈266px at 768px viewport) — predicate unchanged.

### 3.2 Marker anatomy (type-aware — the one new visual discriminator)
- Role markers: unchanged (filled dot `bg-chart-2`/`bg-muted-foreground/40` + year label).
- Education markers (discretion, pinned default): **hollow dot** — same footprint, `rounded-full border border-chart-2 bg-transparent` — plus the plain year label. **W-2 resolution: the hollow dot is CONSTANT in both states (resting and active) — never fills, never swaps size class; education emphasis rides the existing opacity/scale ladder + label treatment only** (the role dots keep their fill/size swap; the type difference IS the visual distinction). No glyph, no text suffix (mono label stays clean). (UNRESOLVED U-8: a small degree glyph instead of the hollow dot.)
- Markers keep NO hover/press/cursor affordance (phase-8 pin). The static type discriminator is a className concern only — no per-frame writes change.

### 3.3 Content templates (type-aware)
| Slot | role (today) | education (new) |
|---|---|---|
| Title | `entry.title` (h3, `text-base font-medium`) | `entry.degree` |
| Primary | `entry.company` (text-sm) | `entry.institution` |
| Dates | `entry.duration` AS STORED · ` · ` + location (merged meta idiom) | `entry.duration` AS STORED — **no location, dash style never normalized** |
| Detail | first 3 `responsibilities` bullets (`list-disc`, absent → omit) | `entry.specialization` as a single `text-xs text-muted-foreground` line (absent → omit); `courses` NOT rendered |
- Compact (<md) year chip: dot + year — education entries carry the hollow dot there too.

### 3.4 Controls / counter / live region
- Prev/Next buttons + ArrowUp/ArrowDown: unchanged recipes, now 5 clamped stops (disabled at entry 0 and entry 4). Counter renders `03 / 05` style (`padStart(2,'0')` over 5).
- sr-only aria-live: becomes type-aware — default string `Entry ${i+1} of ${n} — ${title|degree}, ${company|institution}` (U-9 for the exact wording; polite, on discrete activeIndex change only, unchanged mechanics).

### 3.5 Range + compact form
- Sticky wrapper stays `md:h-[300vh]` conditional on entries > 1 (W-3 generalizes to the merged count). (UNRESOLVED U-10: whether 300vh is retuned for 5 entries — default keep; the carousel is continuous, no per-entry stop is required.)
- Compact form: all 5 entries stacked (each with year chip + full type-aware template) — the panel grows taller; no cramped arc below md. Reduced-motion, keyboard, mobile contracts hold for 5 entries (engine math is n-generic).

---

## §4 Projects editorial scroll (REV-17, D-04)

### 4.1 Geometry (sticky stage, md+ only)
- **Wrapper** (grid child, plain div, no id): `md:col-span-2 md:h-[300vh]` — conditional on `slice(0,6).length > 1` (W-3 mirror; ≤1 project → natural height, no pin). (UNRESOLVED U-10: exact range length — default 300vh → ~215vh travel across 5 row transitions ≈ 43vh each.)
- **Shell** (PanelShell className): `md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]` — the Experience recipe verbatim.
- **Body inside the pinned shell** (top → bottom, **literal DOM sequence — W-1 resolution**): `ProjectStatTiles` (unchanged, stays **above** the rows) → **rows viewport** (hidden <md, shown at md+) → **compact list** (`md:hidden`, the existing card grid byte-identical) → `TerminalPointer command="projects --all"` (**LAST in both tiers** — the Experience pointer precedent, experience-section.tsx:250).
- **B-1 resolution — the inner distribution mechanism (pinned, Experience idiom):** `flex-1` is dead (PanelShell is not a flex container and its chrome is locked verbatim); the rows viewport carries an **explicit inner height class** instead: `md:h-[calc(100dvh-14.5rem)]` — the arithmetic: the sticky shell recipe `md:h-[calc(100dvh-10rem)]` minus PanelShell `p-4` vertical (2rem) minus the chrome row (`text-2xl leading-none` index + label ≈ 1.5rem) minus `mt-3` (0.75rem) minus the tiles row (≈2rem at md) minus the `mt-3` gap (0.75rem) minus the pointer row (≈1.25rem) ≈ 7.25rem of chrome inside the 10rem-offset sticky box → **the exact constant is pinned as a U-table starting value (U-new: tunable 13.5–15.5rem), NOT executor-invented**. `H` (the motion constant) = the **measured client height of the rows-viewport element** (one-shot on mount + on resize, `getBoundingClientRect` — the same measured-rect idiom the tour uses); with the explicit height class the measurement is stable and the ±H enter/exit sweep is real. SSR/no-JS: the viewport renders at natural height with all 6 rows in flow (E-11 unchanged — presence, not geometry).
- Rows viewport interior: a `md:grid` stack — all 6 rows `md:col-start-1 md:row-start-1`, the stack vertically centered (Experience content-column `justify-center` precedent). **No scroll-snap, no wheel/touch listeners anywhere** (D-05; the single scroll source stays `.explore-shell > main`, use-timeline-progress.ts:104).

### 4.2 Row anatomy + divider spec (6 rows, data order)
Top-6 in data order: DeepIndex (2026) · Clarif-AI (2026) · SDK4ED-TD (2023) · ServicedMetricsCalculator (2023) · Avoid Traffic Extended (2022) · Uom Track (2021).
| Element | Contract |
|---|---|
| Year marker | First 4-digit year in `project.date` via the existing first-year pattern; absent date → `—` em-dash placeholder (tiles' E-9 idiom). Mono `text-xs tabular-nums text-muted-foreground`. (UNRESOLVED U-11: raw date string instead of extracted year.) |
| Name | `text-base font-medium text-foreground` (one editorial scale-step above the card header's text-sm; discretionary). |
| Description | **First sentence** of `description` — split at the first period, **≤120 chars** — pure function `firstSentence(description, 120)` in a framer-motion-free pure module (testable in node --test). Over-length → truncate at a word boundary and append `…` (the sentence's terminal period counts toward 120; no period after `…`). No period in the string → whole string, still ≤120. Rendered `text-sm leading-relaxed text-muted-foreground` (or text-xs — planner's density call). |
| Link | Linked project → the **row block is one anchor** (`target="_blank" rel="noopener noreferrer"`, name + `ArrowUpRight h-3.5 w-3.5` hover/focus → `text-accent` `transition-colors` — the W-2 card vocabulary). **No `exp-lift`** — the transform channel is owned by the motion system; hover is color-only. Unlinked → plain div, no hover affordance. |
| Divider | `border-t border-border` on **every** row block (row 0 included — uniform editorial ruling); the hairline is part of the row block and rides its transform/opacity (coexistence shows two rules during a transition — correct). |
| Row spacing | `pt-4` above content under the hairline; vertical centering in the rows viewport. Exact spacing discretionary (D-04 leaves row spacing open). |

### 4.3 Motion contract (single progress value, continuous)
- `useScroll({ container: mainRef('.explore-shell > main'), target: wrapperRef, offset: ['start start', 'end end'] })` → one `progress` MotionValue 0→1 across the pin (window scroll is always 0 inside the shell — the MAIN_SELECTOR precedent is mandatory).
- Row state default (mirrors `contentLayer` at editorial scale, pure + testable): `r′ = (n−1)·progress` (n=6); `d = i − r′`; `y = clamp(Δ·d, −H, +H)` with Δ = H = the measured rows-viewport height (fallback 480px pre-measurement) — each row sweeps **enter from below the stage → centered → exit above**; `opacity = clamp(1 − |d|, 0, 1)` — the phase-8 coexistence window carried over: at rest one row is fully visible; during each transition the outgoing and incoming rows **coexist** (two rows simultaneously visible). (UNRESOLVED U-13: interpolation shape — wider opacity window / partial travel are acceptable alternatives; the *contract* is: single progress value, continuous interpolation, no discrete thresholds, no springs, no bounce, `useTransform` only.)
- `useReducedMotion` (framer-motion) → `y ≡ 0`, opacity-only swaps; the sticky range is **retained** (RM-5: scroll position is user input).
- framer-motion imports appear **ONLY** in the projects editorial composition files (SPEC gate). The row math lives in a pure sibling module (zero framer-motion import) so `node --test` covers the derivation; framer consumes it via `useTransform`. About gains **no** framer-motion (D-05's "About motion" is permission, not mandate — U-6).
- **No hover transform on rows** (would fight the per-frame motion writes); hover/focus = color-only.

### 4.4 SSR / static export / no-JS
- SSR = the row derivation evaluated at progress 0 (the §9/§3 precedent): row 0 renders real text; rows 1–5 render `opacity: 0, y: +H, visibility: hidden, aria-hidden="true"` — constant style props, corrected by the motion channel on hydration.
- No-JS md+: sticky CSS still pins; only row 0 (+ tiles + pointer) is readable; the compact list is CSS-hidden at md+. **Accepted trade** (identical to the phase-8 no-JS contract).
- <md: the rows-viewport subtree is `hidden md:block`; `useScroll` progress is inert there; the compact list owns mobile. (Planner note: guard the hidden-target measurement path so progress clamps to 0 — no NaN styles reach the hidden subtree, U-14.)

### 4.5 Mobile fallback + conditional
- <768px: `ProjectStatTiles` + the **existing compact card grid, byte-identical** + pointer. No sticky, no motion transforms, no framer effects visible. 375px invariant holds (no new horizontal-overflow surface).

---

## §5 Interaction state matrix (every control)

| Control | Default | Hover | Focus-visible | Active | Disabled | Loading/Error |
|---|---|---|---|---|---|---|
| Contact rows ×9 (anchors) | icon muted + label fg + value muted; `min-h-[44px]` | label underline + icon `exp-nudge` 2px | ring recipe + underline + nudge (parity) | — | — | n/a (static links) |
| Full resume link | bordered accent row | label underline + arrow nudge | ring recipe + parity | — | — | n/a |
| Positioning lead / metrics tiles / availability chip / avatar / demoted summary | static chrome — **non-interactive, hover-inert** (PanelShell §17.6 precedent) | — | — | — | — | avatar broken URL → browser fallback (U-5) |
| Experience Prev/Next | prev muted / next accent, ghost | `bg-muted` | GHOST_INTERACTION ring recipe | — | `disabled:opacity-50` at clamped ends (0 and 4) | n/a |
| ArrowUp/ArrowDown (group root) | handled at md+ only, `preventDefault` on handled keys | — | — | — | — | below md: fall through to native scroll |
| Arc markers (5) | dot + year label; **no hover/press/cursor** (pinned) | — | — | — | — | — |
| Projects rows (linked) | name fg + arrow, year/desc muted | name + arrow → `text-accent` (color-only) | ring recipe + `group-focus-visible:text-accent` parity | none — **no lift/settle transform** (motion channel owns transform) | — | n/a |
| Projects rows (unlinked) | plain div, no affordance | none (never promise interactivity) | — | — | — | n/a |
| Rows viewport / stage container | non-interactive chrome; scroll IS the input | — | — | — | — | — |
| Stat tiles / TerminalPointer | unchanged existing behavior | — | — | — | — | — |

No loading or error states exist anywhere in this phase (static JSON, no async data paths).

---

## §6 Visual behaviour

- **Motion vocabulary:** the closed phase-7/8 set only — `transition-colors 200ms ease-out` for discrete color swaps; `exp-lift`/`exp-nudge` (globals.css:613–640, 220ms cubic-bezier(0.25,1,0.5,1)) unchanged; entrance stagger unchanged. **Zero new motion declarations in globals.css for About.** The projects composition's motion is entirely framer-motion value-driven (transform/opacity), deliberately outside the CSS vocabulary.
- **Editorial-calm:** no springs, no bounce, no overshoot anywhere in the new systems; interpolation shapes are linear or gentle-ease; per-frame-written properties never carry CSS transitions (the §6 row-1 rule).
- **Coexistence rendering:** rows/layers outside the coexistence window carry `visibility:hidden` + `aria-hidden` (the §3 hidden-row contract) — this is an a11y/tab-order flip at |d| ≥ 1, not a discrete visual threshold; the motion stays continuous.
- **Reduced-motion rows:**
  - Projects: `y ≡ 0` — opacity-only swaps via `useReducedMotion`; sticky retained; dividers ride row opacity; the `.explore-shell` guard suppresses the color transitions (hover accent becomes instant — accepted, existing behavior).
  - Experience: unchanged RM-1…RM-5 (markers freeze at the c′=0 train for n=5: θ = 180/157.5/135/112.5/90; emphasis opacity-only, scale pinned 1; dot size-class swap suppressed).
  - About: no motion to suppress beyond the guarded `exp-nudge`.
- **Entrance:** the panel-grid stagger plays once per panel as today; the new Projects wrapper animates as a grid child exactly like the Experience wrapper does.

---

## §7 Responsive behaviour

| Tier | Grid | Projects | Experience | About |
|---|---|---|---|---|
| <768 (375px) | 1-col, order About→Skills→Experience→Projects | tiles + compact card grid (byte-identical) | compact stack, all 5 entries, year chips | package stacks full-width; metrics 2×2 (~150px tiles at 309px inner ✓) |
| 768–1023 | 2-col rows [About\|Skills][EXP span2][Projects span2] | sticky stage live, 300vh range | sticky stage live, 300vh wrapper | half-panel; lead text-base |
| ≥1024 | `lg:gap-5`, same structure | same | same | same |

375px checks: no horizontal overflow from any new piece (the editorial stage is md+ only; the avatar/metrics/chip are fixed-size blocks; the lead wraps).

---

## §8 Accessibility

- DOM order = visual order = tab order in the new grid (the array reorder is a real reorder — no `order-first` re-sort trick remains; the phase-8 speech-order caveat is retired with `md:order-first`).
- Non-visible projects rows: `visibility:hidden` + `aria-hidden` → excluded from tab order and AT. No aria-live on the projects stage (no discrete state to announce).
- Experience live region becomes type-aware (§3.4); discrete-only announcements preserved.
- All interactive elements keep the ring recipe + 44px floors (contacts, resume, tour targets, drawer items, Prev/Next).
- Avatar carries meaningful alt; markers/dots/hairlines/index chips stay `aria-hidden`.
- Landmarks unchanged: `id`-anchored sections (drawer anchors, no-JS hash navigation, tour holes) resolve by stable id; the new Projects wrapper carries **no id** (R-3).

---

## §9 Edge coverage matrix

| # | Edge | Contract |
|---|---|---|
| E-1 | Zero merged arc entries / zero projects | Section body renders nothing (existing §11) |
| E-2 | 1 entry (either system) | Continuous index ≡ 0; wrapper stays natural height, no pin (W-3 mirror) |
| E-3 | n > 3 entries on the arc | Angle/emphasis math is n-generic (verified above for n=5); no 3-hardcoding |
| E-4 | Unparseable/absent year | Dot-only marker (roles) / dot-only chip (compact) — no invented label; projects row year → `—` |
| E-5 | `description` with no period | Whole string, then ≤120 truncation |
| E-6 | `description` first sentence >120 chars | Word-boundary truncate + `…` (DeepIndex 236→120+…; Clarif-AI ~123→120+…) |
| E-7 | Unlinked project in top-6 | Static div row, no hover affordance, dividers unchanged |
| E-8 | `project.date` absent | `—` year marker; row otherwise intact |
| E-9 | Empty `about.metrics` / `availability` / `profileImageUrl` / `positioning` | Graceful-hide matrix (§2.8) |
| E-10 | Reduced motion | §6 rows — opacity-only in both new systems, sticky retained |
| E-11 | No-JS static export | Experience: entry 1 real text (unchanged §9). Projects: row 1 real text + tiles + pointer; compact list hidden at md+ (accepted trade, §4.4) |
| E-12 | Resize / breakpoint crossing | Projects: framer re-measures with the container resize (planner note U-14); Experience: ResizeObserver unchanged |
| E-13 | BFCache back-nav | Stagger replay accepted (existing §9.3); framer progress re-derives from live scroll position on reattach |
| E-14 | <md framer progress | Inert (hidden target → clamped 0; NaN guard, U-14) |
| E-15 | Both sticky ranges on one page | Sequential wrappers, no overlap; both shells `md:z-10`; no ancestor overflow on the sticky chain |

---

## §10 Data-draft checklist (3 fields — draft→approve→write, R-7 typing same-commit)

Draft values (verbatim, no normalization):

```json
"positioning": [
  "I design test automation frameworks and AI-driven QA infrastructure that entire engineering organizations adopt.",
  "— not just run."
],
"availability": "Open to selective part-time work",
"metrics": [
  { "value": "12+", "label": "engineering teams" },
  { "value": "30+", "label": "engineers" },
  { "value": "7+", "label": "years" },
  { "value": "600+", "label": "npm launch week" }
]
```

- `availability` source verified: WelcomeMessage.tsx:42, verbatim.
- `metrics` values transcribed from the approved competency-proof/bullet strings ('12+ engineering teams', '30+ engineers', '7+ years' in the summary, '600+ downloads in launch week' in the DeepIndex description) — never computed at render.
- `.d.ts` (same commit): `positioning?: string[]` (2 entries, rendered as two blocks, never joined — U-7 for tuple shape), `availability?: string`, `metrics?: { value: string; label: string }[]` — optional typing aligned with the graceful-hide contract; other surfaces (CLI, resume modal, static PDF) ignore the new fields.
- Approval round **not skipped** for personal copy (D-01 phase-6 precedent) even though the draft is tiny.

---

## §11 UNRESOLVED register (planner assumes the defaults)

| # | Question | Default |
|---|---|---|
| U-1 | Summary immediately under the lead (strict D-02) vs notes order | Notes order (positioning→metrics→availability→avatar→summary→contacts) |
| U-2 | Positioning line 2 treatment | `text-accent`; fallback `md:text-sm` lead if the half-panel wrap reads heavy |
| U-3 | Metrics layout | 2×2 mini-tiles (mirror ProjectStatTiles); alternative inline chips |
| U-4 | Availability chip micro-chrome | Pill + chart-1 dot + `text-xs` |
| U-5 | Avatar corner + broken-URL handling | `rounded-full`, no onError (server component preserved) |
| U-6 | framer-motion in About (D-05 allowance) | None — CSS vocabulary only; if elected, one RM-gated composition |
| U-7 | `positioning` storage shape | 2-string array |
| U-8 | Education marker discriminator | Hollow dot (border ring); alternative small degree glyph |
| U-9 | Live-region string for mixed entries | `Entry i of n — primary, secondary` |
| U-10 | Experience sticky-range length with 5 entries | Keep `md:h-[300vh]` |
| U-11 | Projects row year marker | Extracted first 4-digit year; alternative raw `project.date` |
| U-12 | Avatar image element | Plain `<img>` (tinyurl not in remotePatterns) |
| U-13 | Row interpolation shape / travel | Full-interior sweep, `clamp(1−|d|)` opacity, no springs |
| U-14 | Hidden-target / resize measurement guards | Clamp progress at 0; re-measure on container resize |
| U-15 | Projects rows-viewport inner height | `md:h-[calc(100dvh-14.5rem)]` — tunable 13.5–15.5rem (B-1 starting value; the sticky recipe minus the measured chrome stack) |

---

## §12 Grep-verifiable acceptance hooks

- `EXPLORE_SECTIONS` order = about, skills, experience, projects; drawer accents per-id; tour table id-keyed with content order intact.
- `grep framer-motion src/components/explore/sections/experience*` → zero matches; framer imports only under the projects composition files.
- Projects PLACEMENT carries the new wrapper/shell classes; Experience wrapper without `md:order-first`.
- `node --test`: 5 arc entries in year order (2012, 2019, 2021, 2022, 2023), type-aware template outputs, `firstSentence` split/truncate cases (E-5/E-6), row-state math (coexistence window, RM y≡0), drawer/tour/counter re-mapping.
- `npm run build` + `npm run typecheck` green; all routes export statically; 375px invariant and 44px targets intact.

*Contract version: 1.0 — 2026-09-24 · gsd-ui-researcher*