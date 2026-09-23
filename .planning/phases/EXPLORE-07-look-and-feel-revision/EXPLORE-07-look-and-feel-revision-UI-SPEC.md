All inputs grounded. Here is the full UI-SPEC.md:

---

# EXPLORE-07 look-and-feel-revision — UI-SPEC

**Status:** design contract for planning (no code yet)
**Governing skills:** redesign-existing-projects (audit-first sequence) · design-taste-frontend (dials VARIANCE 5 / MOTION 3 / DENSITY 4 — user pick B) · motion-design (Editorial-calm archetype)
**Locked upstream:** SPEC (REV-08/09/10/11) + CONTEXT D-01…D-05. This document pins the **how** at design-contract level; it does not relitigate locked decisions.

**Design read (taste skill §0.B):** Reading this as: developer-portfolio IDE surface for recruiters/peers, with a terminal-editorial language (JetBrains Mono, panel chrome, quiet tokens), leaning toward restrained CSS micro-motion inside the existing reduced-motion guard — taste pass WITHIN the IDE rail, never a replacement of it.

---

## §0 Hard rails (must not change)

| Rail | Pin | Where enforced |
|---|---|---|
| Tokens | `.explore-shell` / `.light .explore-shell` blocks stay; the ONLY allowed addition is the two `--panel-shadow-hover` custom-property lines (§7.3) | globals.css:499-579 |
| Font | JetBrains Mono scoped to the shell | globals.css:502 |
| Panel chrome | PanelShell `rounded-md border bg-card p-4`, chip+label header row, `mt-3` body slot — unchanged except the index device (§6) | panel-shell.tsx:39-52 |
| Themes | dark default / `.light` override; theme swap stays INSTANT (no transition classes on the toggle, §9.1 precedent) | explore-header.tsx:74-87 |
| Frame structure | header → intro strip → `<main>` (only scroll container) → status bar → tour overlay | explore-shell.tsx:57-81 |
| 375px invariant | no horizontal scroll at any breakpoint | tests/explore-sweep.test.mjs |
| 44px targets | header buttons, contact rows keep `min-h-[44px]`/44px | about-section.tsx:65-66, explore-header.tsx |
| Reduced-motion guard | UNMODIFIED — the only suppression mechanism | globals.css:586-598 |
| No new dependencies | zero package installs; motion = CSS only | D-05 |
| REV-07 | Experience layout invention stays deferred; this phase is taste-level on the EXISTING rail+dots `<ol>` | D-03/D-05 |
| Static export | no client-only rendering introduced; all new motion is CSS keyframes/transitions | SPEC constraint |

**Prohibitions (do-not list for the planner):** no chart replacement (do not invent a new visualization to replace the Gantts); no JS animation APIs (`requestAnimationFrame`, Web Animations `el.animate()`, framer-motion, gsap, lottie); no transition on the theme toggle; no PanelShell hover affordance (§17.6 pin survives — panels stay static; the stagger animates them once at entrance only); no drawer/tour/dropdown restyle; no new fonts; no reduced-motion guard edits; no `/resume`, CLI, or PDF changes.

---

## §1 Layout — regions, hierarchy, breakpoints

### 1.1 Region map (post-change target)

```
┌ explore-shell (h-dvh flex-col · JetBrains Mono · token-scoped) — stagger scope root
├ ① Header bar h-[52px] shrink-0 border-b
│    glyphs (chart-5/3/2 dots, aria-hidden) · truncating title · [tour | theme | drawer | terminal] ×4 44px ghost
├ ② Intro strip (typewriter ❯ + sr-only h1; min-h 60px base / 20px md+; shrink-0)   [NO stagger — typewriter-only, U-2]
├ ③ main aria-label="Portfolio sections" tabIndex=0 · flex-1 overflow-y-auto p-4 md:p-6
│   └ .panel-grid  grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5        ← THE stagger target (4 children, DOM order)
│       ├ PanelShell #01 About+Contact  (accent bg-chart-1)   [row 1 left]
│       │    description → meta row (Briefcase/MapPin) → divider → 9 contact rows (icon nudge) → Full-resume CTA (last)
│       ├ PanelShell #02 Experience (accent bg-chart-2)       [row 1 right]
│       │    rail+dots timeline (≤3 entries × title/company/meta/bullets) → terminal pointer
│       ├ PanelShell #03 Skills (accent bg-chart-3)           [row 2 left]
│       │    competency cards (1col; 2col at lg; lift+bloom; alternating chip) → chip groups → terminal pointer
│       └ PanelShell #04 Projects (accent bg-chart-4)         [row 2 right]
│            stat tiles (3-up, never stacks) → ≤6 mini-cards (linked: lift+bloom) → terminal pointer
├ ④ Status bar h-7 sm:h-8 — guest@tasostilsi:~/explore · theme · N/5 sections visited (aria-live)
└ ⑤ Tour overlay (portaled Sheet — unchanged chrome, guard covers via body:has selectors)
```

Hierarchy change of record: panel headers gain a **second hierarchy layer** (accent chip → label → oversized mono index, §6). Panel bodies keep their pinned internal orders byte-identically except where §4/§5 refine them.

### 1.2 Breakpoints

| Tier | Panel grid | Competency grid | Gutters | Intro strip | Header title |
|---|---|---|---|---|---|
| base <768 | 1 col | 1 col | gap-4 | 60px reserve | name only |
| md 768–1023 | 2×2, DOM order [About+Contact\|Experience]/[Skills\|Projects] | 1 col (≈320px panel body too narrow for 2) | gap-4 | 20px | name — title |
| **lg ≥1024** | 2×2 | 2 col (8 cards = 4×2, zero empty cells) | **gap-5 (NEW, D-02)** | 20px | name — title |
| 1440/1920 | unchanged full-bleed (no max-width wrapper — existing pin) | | | | |

The only layout edit is `gap-4` → `gap-4 lg:gap-5` on the panels grid (explore-panels.tsx:65). No new breakpoints, no `max-w` introduction, no competency-grid gap change (DENSITY 4 keeps gap-2).

### 1.3 Hierarchy rules (taste dials)

- VARIANCE 5 = rhythm through **alternation, not asymmetry**: alternating chip alignment (§5), alternating lift targets — never overlapping/negative-margin tricks.
- DENSITY 4 = current spacing scale survives; the pass may ±4px inside panels via the audit, never restructures.
- MOTION 3 = §7 vocabulary only; hover responds, page does not perform.

---

## §2 REV-08 — chart removal contract & blast radius

### 2.1 Deletions (grep-verifiable)

| Artefact | Action | Notes |
|---|---|---|
| `src/components/explore/sections/career-span-chart.tsx` | DELETE file | |
| `src/components/explore/sections/projects-calendar.tsx` | DELETE file | |
| `viz-data.ts` `buildCareerSpan` + `CareerSpanRow/CareerSpanData/YearTick` (lines 193-289) | REMOVE | |
| `viz-data.ts` `buildProjectCalendar` + `ProjectCalendarRow/ProjectCalendarData` + `YEAR_ONLY_PATTERN` (lines 291-382) | REMOVE | |
| `viz-data.ts` `monthIndex` (line 219) | REMOVE | sole consumers are the two builders |
| `viz-data.ts` `parseDuration`/`ParsedDuration`/`parseMonthToken`/`MONTH_NAMES`/`YEAR_PATTERN` (lines 21-99) | REMOVE **(U-6, default: remove)** | after the Gantt dies, no consumer remains (verified by grep: only viz-data itself + chart tests). Keep only if the replacement contract needs parsing — it does not. `projectStats`'s own `GLOBAL_YEAR_PATTERN` and `skillsGroupCounts`/`skillGroupFill` **survive**. Update the file-header comment ("only duration/date parsing site" no longer holds). |
| `experience-section.tsx` — `buildCareerSpan` import, `hasSpan` gate, `mb-5` chart wrapper (lines 30,32,43-51) | REMOVE | `<ol>` timeline becomes first body child |
| `projects-section.tsx` — `buildProjectCalendar` import, `hasCalendar` gate, `mb-5` wrapper (lines 30,33,45-53) | REMOVE | tiles wrapper becomes first body child |
| `constants.ts:97` tour copy `"Roles in order, with the career-span chart on top for the shape of it."` | REWRITE **(U-10)** | dangling chart reference; suggested replacement: `"Roles in order — title, company, tenure, and the shape of the career as a timeline."` Chrome-only, no invented facts. Tour steps [0,2,3] stay accurate post-restyle. |

### 2.2 Test blast radius (stale-test discipline)

| Suite | Disposition |
|---|---|
| `tests/projects-calendar.test.mjs` (entire, ~12 tests) | DROP with its subject |
| `tests/explore-visuals-server.test.mjs` — career-span tests (lines ~28-80: server purity, aria-hidden/composition/geometry-source assertions) | REMOVE; rewrite the experience-section composition test to assert the timeline `<ol>` is the first body child and no chart import exists |
| `tests/explore-visuals.test.mjs` — `buildCareerSpan` geometry tests (~239-360), `buildProjectCalendar` import (line 41), D-09 existence checks (lines ~489-506) | REMOVE; invert existence checks to assert absence of both files + both builders; drop `parseDuration` tracer tests (52, 115) if U-6 lands |
| `tests/explore-visuals.test.mjs` — export test asserting calendar `aria-label` in exported HTML (~580-592) | REWRITE: assert calendar absence + tiles/cards presence |
| `tests/explore-visuals.test.mjs` line 607 (`startYear` derivation), header comments (11), `explore-visuals-skills.test.mjs:154` comment | REMOVE/UPDATE with the rewrite |
| Suite count | Changes from ~200 — SPEC's "200-test suite" reads as "the full suite on the final tree"; record the delta in the phase SUMMARY |

**Ripples expected: none** outside `/explore` (verified: the only src consumers of the charts/builders are the two sections, viz-data, and the tour copy — `/resume`, CLI, PDF never import them).

---

## §3 Replacement presentations (non-chart)

### 3.1 Experience showcase (taste-level only — REV-07 stays deferred)

Keep: the rail+dots `<ol class="relative space-y-5 border-l border-border">` anatomy, 8px chart-2 dots (`-left-[4px] top-1.5 h-2 w-2`), caps (first 3 entries, ≤3 bullets, JSON order, verbatim strings, dash style never normalized), TerminalPointer `experience --all`.

Target anatomy per entry (typography/hierarchy refinement, not a new layout):

```
●  <h3> text-sm font-medium text-foreground        — role title (unchanged)
   <p>  text-xs text-foreground                    — company (unchanged)
   <p>  text-xs text-muted-foreground mt-0.5       — META ROW (refinement, U-8):
          <span tabular-nums>{duration}</span> · {location}
        (one meta line; wraps at 375px; both strings verbatim; the " · "
         separator is aria-hidden text — no entity invented from data)
   <ul> bullets unchanged (list-disc pl-4 marker muted)
```

Rationale for the audit table: duration+location as two stacked muted lines is a flat meta hierarchy (generic pattern: stacked equal-weight metadata); the merge gives period framing one visual beat. Alternate disposition (keep two lines, tighten `mt`) is legal via the audit table.

### 3.2 Projects panel

Body order post-removal: stat tiles wrapper (`mb-3`) → ≤6 mini-cards → TerminalPointer `projects --all`. Tiles and card anatomy are unchanged from project-stat-tiles.tsx / projects-section.tsx. New: linked cards (the anchors) join the lift+bloom vocabulary (§7.2); **unlinked cards (plain `<div>`) stay static** — hover must never promise interactivity (W-2 precedent). Stat tiles stay static (§6 pin).

---

## §4 REV-09 — Skills competency card restyle

Target anatomy (chip + proof preserved; data verbatim):

```tsx
<li class="flex flex-col rounded-md border border-border p-3 exp-lift">
  <div class={i % 2 === 0 ? "self-start" : "self-end"}>   // alternating chip position (D-02)
    <Badge variant="outline" class="font-normal pointer-events-none
                                    text-chart-3 border-chart-3/40">…</Badge>
  </div>
  <p class="mt-2 text-xs leading-relaxed text-muted-foreground">{proof}</p>
</ul>
```

- **Alternation geometry:** even-index cards top-left chip, odd-index cards top-right chip. In the lg 2-col grid (8 cards, 4×2) this produces a column-wise zigzag rhythm; at base 1-col it reads as alternating left/right down the stack. Proof text stays left-aligned both ways (reading stability).
- Grid: `grid-cols-1 gap-2 lg:grid-cols-2` unchanged; card padding p-3 unchanged; proof gap 1.5→2 (mt-2).
- **Cursor stays default** — cards are not interactive; the lift is a tactile response, not a navigation promise. No focusable, no pointer, no 44px requirement.
- Chip groups (`soft_skills`/`hard_skills`/languages), their `text-xs` headers, the two Badge overrides (`font-normal pointer-events-none`, §17.2), and `TerminalPointer skills` remain byte-identical.
- Graceful-hide unchanged: empty `competencies` → no cards block; empty groups+competencies → section renders nothing (skills-section.tsx:44-46).

---

## §5 Hierarchy device — oversized mono index 01–04 (D-02)

- **Scope:** the four PanelShell headers only (`About` 01, `Experience` 02, `Skills` 03, `Projects` 04 — EXPLORE_SECTIONS array index + 1, zero-padded, data-driven; no literals in JSX). NOT the drawer items, NOT tour card headings, NOT status bar.
- **Anatomy:** `<span aria-hidden="true" class="ml-auto select-none font-mono text-2xl font-medium leading-none tabular-nums text-muted-foreground/50">01</span>` appended to the existing header row (`flex items-center gap-2`).
- **Placement:** right end of the header row (ml-auto), baseline-aligned with the label; never behind/overlapping body content.
- **Props:** PanelShell gains an `index: string` prop fed from `explore-panels.tsx`'s `EXPLORE_SECTIONS.map` index; `explore-tour.tsx`'s duplicated accent map is untouched.
- **Accessibility:** `aria-hidden="true"` (decorative); heading structure (h2 labels) and AT output unchanged; no contrast obligation, but 50% muted keeps it a quiet ghost in both themes.
- **375px:** chip(8px) + label + ~30px glyph fits the 52px-row-adjacent panel header; labels are fixed short strings — no truncation risk.

---

## §6 REV-11 — Editorial-calm motion vocabulary (CSS-only)

### 6.1 Timing constants

| Property | Value | Source of authority |
|---|---|---|
| Signature easing | `cubic-bezier(0.25, 1, 0.5, 1)` (soft ease-out, editorial-calm family) | D-01/D-04 + motion-design directional rule (entrance→decelerate) |
| Hover/focus duration | **220ms** (mid of the 200-280ms window) — symmetric in/out (hover symmetry; the enter>exit guidance governs enter/exit choreography, not hover) | D-04 |
| Overshoot/bounce | **0%** — no springs, no ease-out-back | Editorial-calm |
| Animated properties | `transform` + `opacity` + `box-shadow` only — never top/left/width/height | taste §6.A |
| Entrance budget | 4 panels, 40ms stagger, 240ms each → total 360ms < 500ms budget | motion-design stagger table (micro-cascade 20-40ms ✓) |

### 6.2 THE entrance — panel-grid stagger (the only entrance)

```css
/* inside globals.css, under the .explore-shell scope (guard-covered) */
@keyframes explore-panel-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.explore-shell .panel-grid > * {
  animation: explore-panel-in 240ms cubic-bezier(0.25, 1, 0.5, 1) backwards;
}
.explore-shell .panel-grid > *:nth-child(2) { animation-delay: 40ms; }
.explore-shell .panel-grid > *:nth-child(3) { animation-delay: 80ms; }
.explore-shell .panel-grid > *:nth-child(4) { animation-delay: 120ms; }
```

- Target: the grid container in `explore-panels.tsx` gains a `panel-grid` class; children = the 4 PanelShell sections in DOM order (About+Contact → Experience → Skills → Projects). Implementation via nth-child in globals.css — **zero JSX animation wiring, no inline styles, SSG-safe, no-JS-safe**.
- `backwards` fill: pre-delay panels hold the from-frame → no flash-then-jump; first paint starts the choreography.
- Runs on every fresh page load of `/explore`; theme toggle does not remount panels → never restarts the animation.
- The intro strip stays **typewriter-only** (default, U-2) — the typewriter is already the intro's motion; a second entrance device splits the vocabulary.
- Reduced-motion: `animation: none !important` (guard) → keyframes never apply, `backwards` fill never hides content → panels render at natural opacity 1.

### 6.3 Hover/focus vocabulary

```css
/* globals.css, .explore-shell scope */
.explore-shell .exp-lift {
  transition: transform 220ms cubic-bezier(0.25, 1, 0.5, 1),
              box-shadow 220ms cubic-bezier(0.25, 1, 0.5, 1);
}
.explore-shell .exp-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--panel-shadow-hover);
}
.explore-shell .exp-nudge { transition: transform 220ms cubic-bezier(0.25, 1, 0.5, 1); }
.explore-shell a:hover .exp-nudge,
.explore-shell a:focus-visible .exp-nudge { transform: translateX(2px); }
```

### 6.3 Shadow recipe (dark/light-agnostic, hsl-token tinted)

```css
.explore-shell       { --panel-shadow-hover: 0 6px 16px -4px hsl(220 13% 5%  / 0.55); }  /* bg-hue tint on 220 13% 9% bg */
.light .explore-shell { --panel-shadow-hover: 0 6px 16px -4px hsl(220 20% 20% / 0.15); }  /* slate tint, never pure black */
```

Tinted to the background hue per the redesign skill ("no generic black shadows"); exact blur/alpha within Claude's discretion — **defaults above are the pinned starting values (U-1)**. Applied to: competency cards (all), linked project cards (only the anchors; unlinked divs stay static, §3.2). PanelShell containers do **not** lift (§17.6 pin survives; entrance animation only).

### 6.5 Vocabulary inventory (closed set — nothing else animates)

| # | Device | Target | Trigger | Motion |
|---|---|---|---|---|
| M1 | Panel stagger | `.panel-grid > *` (4 panels) | first paint | 240ms, 40ms stagger, translateY(8px)+fade, backwards fill |
| M2 | Card lift+bloom | competency cards, linked project cards | hover | translateY(-2px) + shadow bloom, 220ms |
| M3 | Icon nudge | 9 contact-row icons (`about-section.tsx` lucide icons) | row hover + row focus-visible | translateX(2px), 220ms |
| M4 | Link underline | existing `group-hover:underline` (contact labels, resume label) | hover — unchanged | instant (kept; the nudge carries motion) |
| M5 | Underline focus parity | same links | **NEW `group-focus-visible:underline`** (keyboard parity; Tailwind 3.4 ✓) | instant |

Everything else is pre-existing phase-3 motion (drawer Sheet animations, typewriter, status pulse guard selectors) — untouched.

---

## §7 Interaction-state inventory (every control)

| Control | Default | Hover | Focus-visible | Active | Disabled | Loading | Error |
|---|---|---|---|---|---|---|---|
| Header: tour / theme / drawer / terminal (4× 44px ghost) | muted icon | `bg-muted` (existing) | §14 ring (existing) | **candidate audit row**: `active:bg-muted/80` (U-4, default: add) | n/a (never disabled) | n/a | n/a |
| Theme toggle | — | same | same | same | — | — | **swap stays INSTANT — adding a transition here is a violation** |
| Project card (linked `<a>`) | border card | name+arrow → accent (existing) **+ M2 lift+bloom** | ring **+ lift+bloom** (transform rides with the ring) | **candidate audit row**: `active:translate-y-0` press-settle ≤120ms (U-4, default: add) | n/a | n/a | n/a |
| Project card (unlinked `<div>`) | border card | **none** (static — interactivity legibility) | n/a | n/a | n/a | n/a | n/a |
| Stat tiles | static | none | n/a | n/a | n/a | n/a | n/a |
| Competency cards | border card | **M2 lift+bloom** (cursor stays default) | n/a (not focusable) | n/a | n/a | n/a | n/a |
| Contact rows (9, 44px) | icon muted + label/value | label underline (existing) **+ M3 icon nudge** | ring (existing) **+ M3 nudge + M5 underline parity** | n/a | n/a (graceful-hide removes missing channels entirely) | n/a | n/a |
| Full-resume Link | bordered accent row | label underline (existing) | ring | n/a | n/a | n/a | n/a; **candidate row**: `ArrowRight` joins M3 (U-5, default: add) |
| Terminal pointers (3) | static text | **none — pinned not-a-link (§17.6)** | not focusable | n/a | n/a | n/a | n/a |
| PanelShell ×4 | static chrome | **none** (§17.6 pin survives; stagger is entrance-only) | n/a | n/a | n/a | n/a | n/a |
| Drawer / tour / dropdown | Radix chrome | unchanged | unchanged | unchanged | unchanged | unchanged | unchanged |
| Intro strip | typewriter 30ms/400ms | n/a | n/a | n/a | n/a | — | reduced-motion → static full text (existing JS swap, untouched) |

Empty states (graceful-hide, all preserved — restyle must not break them): missing channel/meta value → row omitted; empty roles → Experience renders null; empty projects → Projects renders null; empty competencies → cards block omitted, chips independent; both empty in Skills → null; stat-tile active-years without parseable dates → `—` em-dash placeholder (E-9). No fallback copy is invented anywhere. Loading states: n/a (static export; the typewriter is the only client-animated region and is unchanged). Error states: n/a in scope (no forms; no dead-`#` links — all hrefs are data-driven from `portfolio-main-data.json`).

---

## §8 REV-10 — audit-first artefact

- **Artefact:** `.planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-AUDIT.md`, committed **BEFORE** any fix (its own commit; the redesign-existing-projects Scan→Diagnose→Fix sequence is falsifiable).
- **Format (locked):**

| Region | Area | Generic pattern / weak point (before) | Disposition | Fix locus | Test / no-op proof |
|---|---|---|---|---|---|

- **Disposition vocabulary:** `fixed` (with test linkage) / `kept-by-design` (with reason — IDE-rail justification) / `no-op` (nothing to fix).
- **Regions (mandatory coverage):** shell frame · header bar · intro strip · panel grid · About+Contact panel · Experience panel · Skills panel · Projects panel. Status bar / drawer / tour may be scanned but are disposition-only (no chrome replacement).
- **Seeded rows** (the executor's skill-run validates, amends, or refutes — the protocol decides the final table, this grid is the starting point):
  1. Panels — Gantt chart + year-grid calendar = generic AI-dashboard pattern → `fixed` by REMOVAL (REV-08).
  2. Experience — stacked equal-weight duration/location lines → merged meta row (§3.1).
  3. Skills — uniform chip+text cards, no rhythm, no hover response → REV-09 restyle (§4).
  4. Panel grid — uniform gap-4 gutters at all tiers → `gap-4 lg:gap-5`.
  5. Panel headers — no hierarchy device → mono index 01-04 (§5).
  6. Projects (linked) — color-only hover affordance → M2 lift+bloom.
  7. Contact rows — static icons, hover-only underline → M3 + M5.
  8. Tour copy — dangling "career-span chart" reference → rewrite (U-10).
  9. lucide icons everywhere (skill flags the default) → `kept-by-design` (project already depends on it; skill's own override clause).
  10. JetBrains Mono / tokens / chrome → `kept-by-design` (hard rail).
  11. Focus rings/44px/empty-state discipline → `kept-by-design` (already correct; no-op rows recorded).
  12. Loading/error states → `no-op` (static export, no forms).

---

## §9 Visual behaviour, accessibility, reduced-motion verification

### 9.1 Reduced-motion verification rows (every new motion → its suppressor)

The single guard (globals.css:586-598, UNMODIFIED) already covers everything because all new declarations live under `.explore-shell`:

| New motion | Guard clause | Result under reduce | Verification row (test) |
|---|---|---|---|
| M1 stagger | `.explore-shell * { animation: none !important }` | panels render static at opacity 1 (backwards fill never applies) | grep: keyframes + selectors scoped under `.explore-shell`; export-HTML test with content visible |
| M2 lift+bloom | `transition: none !important` | hover lift applies INSTANTLY (state change without animation — same as phase-3 precedent) | grep test |
| M3 nudge | `transition: none !important` | icon jumps instantly (accepted, consistent) | grep test |
| M4/M5 underline | not animated (instant by design) | unchanged | — |
| Typewriter | pre-existing JS matchMedia swap | static full text | existing test, untouched |

Static-CSS note: the guard suppresses transitions but not hover property values; an instant 2px shift under reduced motion matches the established phase-3 behaviour and is accepted.

### 9.2 Accessibility contract

- Index spans, nudge icons, dots, glyphs: `aria-hidden="true"`; heading structure and AT reading order unchanged.
- Stagger animates opacity/transform of real content — no ARIA impact; AT reads the full DOM immediately; content is never invisible beyond the 360ms budget.
- Focus rings (§14 recipe: `ring-2 ring-ring ring-offset-2 ring-offset-background`) preserved on every anchor; transform motion rides along with the ring; no clipping (cards have p-3/p-4 padding).
- Keyboard parity added by M5 (underline on focus-visible, matching hover).
- Tab order = DOM order — no new focusables introduced (competency cards stay non-focusable; terminal pointers stay non-focusable).
- 44px targets: no new interactive element below 44px; competency cards are non-interactive.
- Contrast: no text color changes; shadow/index devices are decorative. Theme toggle keeps its instant swap (contrast parity across themes is pre-existing).
- `aria-live` status counter, sr-only h1, drawer Radix semantics — all untouched.

### 9.3 Edge matrix

| Edge | Behaviour | Risk owner |
|---|---|---|
| prefers-reduced-motion | full suppression table §9.1 | guard (existing) |
| No JS | keyframes are pure CSS — entrance runs; intro span renders empty (existing pinned tradeoff) | SSG |
| Theme toggle during entrance | tokens swap live; animation does not restart (no remount) | design contract |
| 375px no horizontal scroll | translateY-only motion (no X), shadows don't create scroll, gap-5 only ≥lg | explore-sweep test |
| Touch devices (`:hover` stickiness) | pre-existing behaviour on cards/rows; no new mitigation (IDE context) | accepted |
| Empty sections | graceful-hide; stagger animates the panel chrome regardless | existing tests |
| BFCache restore | animation may replay on back-navigation — cosmetic, accepted | note in code comment |
| iOS Safari | cubic-bezier/transform/backwards fill/unprefixed keyframes — universal support; no `@property`, no new `:has` usage | — |
| `prefers-reduced-transparency` | not engaged (no transparency devices) | — |
| Long/wrapping values | break-all/`min-w-0` contracts unchanged; meta row wraps | existing §3 pin |

---

## §10 Falsifiability — test plan the planner must decompose

1. **Absence checks:** both chart files gone; `buildCareerSpan`/`buildProjectCalendar` (and per U-6 `parseDuration`) absent from `viz-data.ts`; suites dropped/rewritten per §2.2.
2. **Tour copy:** `EXPLORE_TOUR_STEP_BODIES[1]` contains no `chart` substring.
3. **Stagger:** `@keyframes explore-panel-in` + `.panel-grid > *` animation + 40/80/120ms nth-child delays + `backwards` fill, all scoped under `.explore-shell`; `panel-grid` class present on the panels container.
4. **Vocabulary greps:** `.exp-lift` on competency `<li>` + linked project `<a>` (not on unlinked `<div>`); `.exp-nudge` on channel icons; the pinned curve string; durations within 200-280ms.
5. **Shadow tokens:** `--panel-shadow-hover` defined in both `.explore-shell` and `.light .explore-shell`.
6. **Index device:** 4 panels render `aria-hidden` `01`–`04` (export-HTML assertions).
7. **Negative JS-animation grep:** no `requestAnimationFrame`, `element.animate`, Web Animations API, framer-motion, gsap, lottie under `src/components/explore/`.
8. **Reduced-motion rows:** every new `animation`/`transition` declaration sits under a `.explore-shell`-scoped selector (grep), guard block byte-identical.
9. **Layout invariants:** 375px sweep green; gap-5 only at lg; competency grid unchanged breakpoints.
10. **Gate:** `npm run build` + `npm run typecheck` + full `node --test` green **chronologically last** on the final tree (suite count recorded; post-green writes reopen the gate).

---

## §11 UNRESOLVED register (planner assumes the defaults; discretion bounded by CONTEXT)

| ID | Question | Default (assumed by planner) | Discretion source |
|---|---|---|---|
| U-1 | Exact shadow blur/alpha | §6.3 pinned values | D-02 discretion ("shadow bloom intensity/blur values") |
| U-2 | Intro strip in the stagger? | typewriter-only — excluded | CONTEXT Claude's discretion |
| U-3 | Stagger duration/delay curve | 240ms, flat 40ms × index | CONTEXT discretion (within 200-280 / 20-40) |
| U-4 | `:active` press states | add transform-only press-settle on linked project cards; header controls `active:bg-muted/80`; audit table records both rows | taste skill interactivity section vs D-04 closed vocabulary |
| U-5 | Resume row's `ArrowRight` joins M3 | add (same one-line vocabulary) | audit disposition |
| U-6 | `parseDuration`/`monthIndex`/`parseMonthToken` removal | remove (dead after the Gantt dies; ponytail) | D-03 scope |
| U-7 | Index size/opacity | text-2xl, muted-foreground/50 | taste discretion |
| U-8 | Experience meta framing | merged duration·location meta row | audit table may keep two lines |
| U-9 | Seeded audit rows | skill protocol runs and finalizes the table | D-01 |
| U-10 | Tour replacement copy wording | suggestion in §2.1 | chrome-literal discipline |

*UI-SPEC gathered 2026-09-23 from codebase inspection (explore components, globals.css, constants, test suites) + the three installed SKILL.md files. All file/line references verified in the current tree.*