All grounding verified. Key facts pinned from inspection: Sheet defaults (left variant `w-3/4 sm:max-w-sm`, 500ms-in/300ms-out, built-in X, Radix focus trap), `darkMode: ["class"]` + chart-1..5/sidebar tokens, the CLI's own theme class self-healing in `useCliTheme.ts:28-49` (strips and re-applies CLI classes on mount — makes a separate localStorage key safe), TypingEffect's pulsing `_` cursor that disappears on completion, the ≤640px `html { font-size: 14px }` rule that shrinks all rem-based touch targets (a real trap at 375px), the portaled Sheet escaping shell DOM (drawer must carry the theme/font scope class itself), and `about.name`/`about.title` present in the data. Below is the full UI-SPEC.md for the orchestrator to write.

---

# Phase 1: explore-shell — UI Spec

**Gathered:** 2026-09-20 (ui-researcher pass)
**Status:** Design contract — locked visual/interaction decisions for the planner
**Inputs:** EXPLORE-01 SPEC (locked), CONTEXT.md (D-01…D-10), codebase inspection (cited inline)

## 0. Grounding (verified facts this contract relies on)

| Fact | Source |
|---|---|
| Sheet = Radix Dialog; left variant `w-3/4 sm:max-w-sm`, slide-in 500ms / slide-out 300ms, overlay `bg-black/80` fade | `src/components/ui/sheet.tsx:33-50, 24` |
| Sheet ships a built-in close X (top-right, opacity-70→100 hover) | `src/components/ui/sheet.tsx:68-71` |
| Radix Dialog provides ESC-close, outside-click close, focus trap, focus restore | Radix `@radix-ui/react-dialog` (sheet.tsx:4) |
| `tailwindcss-animate` plugin active → `animate-in/out`, `fade-*`, `slide-in-from-*` available | `tailwind.config.ts:93` |
| `darkMode: ["class"]`; chart-1..5 and sidebar token mappings exist | `tailwind.config.ts:4, 46-62` |
| `:root`/`.dark`/`.light` token blocks exist and are shared with the CLI — CLI light/dark must NOT change | `src/app/globals.css:11-53, 55-87, 89-119` |
| CLI theme: `useCliTheme` removes all `VALID_THEMES` classes from `<html>` then adds its own, persisted under `portfolio-theme` | `src/components/cli/hooks/useCliTheme.ts:28-49`, `constants.ts:65` |
| Body font is Geist Mono globally (`--font-geist-mono`) | `src/app/globals.css:5-8`, `layout.tsx:14-17, 120` |
| TypingEffect: `text`, `speed=30`ms/char, `delay=0`, `onComplete`; pulsing `_` cursor while typing, cursor **disappears** when done; no reduced-motion handling of its own | `src/components/cli/TypingEffect.tsx:11-55` |
| `@media (max-width: 640px) { html { font-size: 14px } }` — **all rem-based sizes shrink ~17% on mobile** | `src/app/globals.css:464-467` |
| `scroll-behavior: smooth` already on body | `src/app/globals.css:284` |
| Data fields exist: `about.name` = "Anastasios Tilsizoglou", `about.title` = "Senior Software Engineer in Test" | `src/data/portfolio-main-data.json:11-12`, type at `portfolio-main-data.d.ts:58-60` |
| CLI route group owns a `h-screen overflow-hidden` flex shell | `src/app/(main)/layout.tsx:16-19` |
| Skeleton = `animate-pulse rounded-md bg-muted` | `src/components/ui/skeleton.tsx:8-10` |
| lucide-react available (Sheet already imports it) | `src/components/ui/sheet.tsx:6` |

---

## 1. Design Contract Summary

`/explore` is a full-viewport IDE frame: a fixed-height app shell (`header → typewriter intro strip → scrolling panel grid → status bar`) in JetBrains Mono, dark IDE theme by default with a hand-rolled light theme, and a left off-canvas navigation drawer (shadcn Sheet) at **every** viewport. Panels are labeled placeholders with one line of techy-humor comment text. Everything the shell renders is either locked chrome (defined here) or sourced from `portfolio-main-data.json`. Zero new dependencies.

## 2. Layout — Regions & Scroll Architecture

### 2.1 Shell skeleton (single flex column, full viewport)

```
┌────────────────────────────────────────────────────────────────┐
│ ● ● ●   {name} — {title}                        [ ☀ ]  [ ≡ ]  │ ① header bar · h-[52px]
├────────────────────────────────────────────────────────────────┤
│ ❯ {name} — {title}█                                            │ ② typewriter intro strip
├────────────────────────────────────────────────────────────────┤
│ ┌ ● about ───────────────┐ ┌ ● experience ──┐                  │
│ │ // about.profile…      │ │ // experience… │                  │ ③ main panel area
│ │ ▓▓▓▓▓▓▓▓▓▓             │ │ ▓▓▓▓▓▓▓        │                  │    flex-1 · overflow-y-auto
│ ├ ● skills ──────────────┤ ├ ● projects ────┤ ├ ● contact ──┐  │    (the ONLY scroll container)
│ └────────────────────────┘ └────────────────┘ └─────────────┘  │
├────────────────────────────────────────────────────────────────┤
│ guest@tasostilsi:~/explore                 dark · 0/5 sections │ ④ status bar · h-7 / h-8
└────────────────────────────────────────────────────────────────┘
```

- Shell root: `h-[100dvh]` (fallback `h-screen`), `flex flex-col`, `overflow-x-hidden`, marker class **`explore-shell`** (theme + font scope, §9/§10).
- Header, intro strip, status bar: `shrink-0`. Main: `flex-1 overflow-y-auto` — the only scroll container (mirrors `(main)/layout.tsx` intent but **without** its `overflow-hidden` on the shell; /explore must scroll internally so the status bar never leaves the viewport).
- /explore is a **sibling route of `(main)/`** — it must not inherit the CLI's `overflow-hidden` terminal shell (verified at `(main)/layout.tsx:16`).
- No sticky/fixed positioning anywhere inside the shell; the flex column is the positioning model. z-index is only used by the portaled Sheet (`z-50`, built-in).

### 2.2 Region ownership

| # | Region | Component (proposed, under `src/components/explore/`) | Interactive |
|---|---|---|---|
| ① | Header bar | `ExploreHeader` | theme toggle, drawer toggle |
| ② | Typewriter strip | `ExploreIntro` | no |
| ③ | Panel grid | `ExplorePanels` (5 × `PanelPlaceholder`) | no (phase 1) |
| ④ | Status bar | `ExploreStatusBar` | no |

## 3. Header Bar (①)

**Anatomy, left → right:**

| Slot | Content | Spec |
|---|---|---|
| Window glyphs | 3 filled circles, `10px` each, gap `8px`, left→right `hsl(var(--chart-5))`, `hsl(var(--chart-3))`, `hsl(var(--chart-2))` (red/amber/green traffic-light) | decorative, `aria-hidden`, never interactive, both themes |
| Title | `<md`: `{about.name}` only · `≥md`: `{name} — {title}` · `truncate`, `text-sm`, `flex-1 min-w-0` | data-driven (`about.name`, `about.title`) |
| Right cluster | theme toggle, then drawer toggle (drawer toggle rightmost) | buttons `h-[44px] w-[44px]` (px-based — see §11 trap), ghost style |

- Bar height: `h-[52px]` (px-based so the ≤640px font shrink cannot compress it), `border-b`, background = `background` token.
- Theme toggle icon: **target-theme icon** — `Sun` while dark (click → light), `Moon` while light. `aria-label` swaps: "Switch to light theme" / "Switch to dark theme".
- Drawer toggle: lucide `Menu` icon, wired as the `SheetTrigger` (Radix supplies `aria-expanded`/`aria-controls`).
- Window glyphs must remain visible at 375px (they are the IDE identity cue); the title is the only element that truncates.

## 4. Typewriter Intro Strip (②)

- Content: accent `❯` prefix + `TypingEffect` rendering `{about.name} — {about.title}` — **real data, verified present** (D-07).
- Timing: `speed=30` (component default), `delay=400`ms; runs **once per mount** (no persistence, no replay on scroll).
- Cursor behaviour is the component's own: pulsing `_` while typing, **gone after completion** — do not modify `TypingEffect.tsx` (CLI reuse protection). Persistent block cursor after completion: (OPTIONAL — skip-able).
- **No layout shift:** container reserves height — one text line `≥md`, two lines `<md` (the 57-char string wraps at 375px). Height reserved via `min-h`, never via fixed typing animation.
- **Accessibility split:** server-rendered `sr-only` `<h1>` holding the full `{name} — {title}`; the visually animated span is `aria-hidden` (char-by-char mutation is noise for screen readers). The `h1` doubles as the static no-JS/reduced-motion text source.
- **No-JS contract:** the animated span renders **empty in static HTML** and fills client-side. Accepted tradeoff (pinned): no CLS, no flash-of-full-text; screen readers and no-JS users get the sr-only full text. Do not render full text server-side into the visible span (it would flash empty-then-type on hydration).
- Reduced motion: `TypingEffect` is **not rendered at all**; the static full text shows in its place (client wrapper checks `prefers-reduced-motion` once on mount).
- Strip chrome: `border-b` optional, `text-sm`, prefix in `accent` token color, typed text in `foreground`.

## 5. Navigation Drawer (Sheet) — one code path, all viewports (D-02)

- **Build:** existing `Sheet`/`SheetContent`/`SheetHeader`/`SheetTitle`/`SheetDescription`, `side="left"`, **no width overrides** (default `w-3/4` / `sm:max-w-sm` = 384px — accepted, IDE-appropriate). **No edits to `src/components/ui/sheet.tsx`** (pinned: overlay stays default `bg-black/80` at every viewport — resolves the discuss discretion; one code path, zero file churn).
- **Anatomy (top → bottom):**
  1. `SheetTitle`: `~/explore` · `SheetDescription`: `Jump to a section` (Radix a11y warning guard; chrome copy, not portfolio data).
  2. Built-in close `X` (top-right, ships with SheetContent).
  3. 5 nav items — **anchor links** (`<a href="#about">` etc.), one per section, in order: About, Experience, Skills, Projects, Contact (labels locked by SPEC acceptance).
- **Item anatomy:** `min-h-[44px]`, two columns: index `01…05` in the section's chart accent color (`text-xs tabular-nums`) + label (`text-sm`). Accent per section, fixed order: About=chart-1, Experience=chart-2, Skills=chart-3, Projects=chart-4, Contact=chart-5 (same mapping as panels §6).
- **Item states:** default `sidebar-foreground`; hover `bg-sidebar-accent` + `sidebar-accent-foreground`; focus-visible `ring-2 ring-sidebar-ring`; active/pressed = same as hover (no active-section tracking exists until phase 4 — **no "current section" highlight**); no disabled state in phase 1.
- **Open/close interaction (all viewports — 375, 768, 1440):**
  - Open: header drawer toggle → slide-in-from-left 500ms + overlay fade (Sheet defaults, verified).
  - Close: built-in `X`, `ESC`, click on overlay (all Radix defaults); click on a nav item (anchor navigates + `onClick` closes).
  - Focus: **trapped while open** (Radix, satisfies EXPLORE-01b); initial focus = Radix default (do not customize); on close, focus returns to the drawer toggle (Radix default).
  - Nav click → smooth scroll to the panel inside the main scroll container (`scroll-behavior: smooth` inherited from `globals.css:284`; panels sit at scroll-top of main — header is outside the scroll container, **no scroll-margin needed**). Anchor `href` gives no-JS/deep-link fallback and stable ids for phases 3–5.
- **Critical DOM fact (trap caught):** Sheet renders through a **portal to `<body>`** (`sheet.tsx:60`) — it escapes the shell DOM subtree. Therefore the `SheetContent` **must also carry the `explore-shell` marker class**, or the drawer loses both the IDE tokens and JetBrains Mono. This is a hard requirement of this contract.
- **Motion note:** Sheet animations are classes on the portaled content; the reduced-motion guard (§12) must therefore target the portal too.

## 6. Placeholder Panels (③) — 5 panels (D-01, D-06)

**Panel anatomy (top → bottom):**
1. Header row: `8×8px` accent chip (section's chart-N color, `aria-hidden`) + section title (`text-sm font-medium`, exactly the locked label).
2. Humor line: one line, comment style `// <expression> — pending`, `text-xs text-muted-foreground`, may wrap (never truncate — full text must stay readable).
3. Placeholder body: 2 `Skeleton` lines (`h-3`, widths `w-3/4`, `w-1/2`; the wide About panel gets 3 lines) — `aria-hidden`, reuses `src/components/ui/skeleton.tsx`.

- Humor strings: format locked, exact wording planner-discretion (UNRESOLVED §16): about → `// about.profile.load() — pending`, experience → `// experience.render() — pending` (example locked in CONTEXT), skills → `// skills.matrix.map() — pending`, projects → `// projects.repo.checkout() — pending`, contact → `// contact.establish_link() — pending`. Professional, one line, no memes.
- Panels carry stable DOM ids: `about`, `experience`, `skills`, `projects`, `contact` (drawer anchors + future phases).
- **Panels are non-interactive in phase 1: no hover style, no pointer cursor, no focusability.** A hover affordance would promise navigation that does not exist yet. (Pinned — deliberate absence.)
- Grid (`grid gap-4`):
  - **375px (base):** 1 column, natural order; page scrolls vertically inside main.
  - **768px (`md`):** 2 columns; **About spans both** → balanced `[about about] [experience skills] [projects contact]`.
  - **1440px (`lg`):** 3 columns; **About spans 2** → `[about about experience] [skills projects contact]`.
- Full-bleed (no max-width container); padding: `p-4` mobile, `p-6 ≥md`.
- Panel chrome: `bg-card`, `border`, `rounded-md` (radius from §9 token), `p-4`.

## 7. Status Bar (④) (D-03)

- Left: exact string `guest@tasostilsi:~/explore` — rendered as `guest@tasostilsi` in `accent` + `:~/explore` in `muted-foreground` (contiguous text, colors only).
- Right: active theme name (`dark` | `light`, lowercase, updates live) + ` · ` + `0/5 sections visited` (counter **static** until phase 4; the `5` is rendered from the sections constant length, the `0` is a literal).
- Heights: `h-7` mobile, `h-8 ≥sm`; font: `text-[10px]` mobile, `sm:text-xs` — px math verified: full copy ≈ 318px at 375px viewport → **no truncation at any breakpoint**; do not shorten the breadcrumb (locked copy).
- Structure: `<footer>`; right group has `aria-live="polite"` so theme switches are announced.

## 8. Interaction-State Matrix (every control)

| Control | Default | Hover | Active/Pressed | Focus-visible | Disabled | Loading | Error |
|---|---|---|---|---|---|---|---|
| Window glyphs | filled chart-color dots | — | — | — | n/a (never interactive) | — | — |
| Header title | `foreground`, truncate | — | — | — | n/a | — | — |
| Theme toggle | ghost btn, target-theme icon, `muted-foreground` | `bg-muted` | same as hover (no scale — motion-safe only) | `ring-2 ring-ring ring-offset-2 ring-offset-background` | never | n/a (instant swap) | n/a |
| Drawer toggle | ghost btn, `Menu` | `bg-muted` | same as hover | `ring-2 ring-ring ring-offset-2` | never | n/a | n/a |
| Drawer panel | closed | — | — | on open: Radix initial focus | — | n/a (local state) | n/a |
| Drawer overlay | transparent → `black/80` | — | — | — | — | — | — |
| Drawer close X | `opacity-70` (built-in) | `opacity-100` | — | built-in ring (sheet.tsx:68) | never | — | — |
| Drawer nav item | `sidebar-foreground`, index in chart-N | `bg-sidebar-accent` | same as hover | `ring-2 ring-sidebar-ring` | n/a | n/a | n/a |
| Panels | static card | **none (pinned)** | — | not focusable | n/a | n/a | n/a |
| Skeletons | `animate-pulse bg-muted` | — | — | `aria-hidden` | — | — | — |
| Status bar | static text | — | — | — | — | — | — |
| Typewriter | types once on mount | — | — | — | — | typed-progress IS the loading visual | n/a |

No async data exists in phase 1 (SSG import at build time), so no loading/error UI is defined anywhere by design. Error-adjacent behaviour is limited to §14 storage failures.

## 9. Theme System (D-05) — mechanism + pinned token values

### 9.1 Mechanism (contract)

- **Scope marker:** every token override lives under a **`.explore-shell`** class in `globals.css`:
  ```css
  .explore-shell { /* dark IDE tokens — the default */ }
  .light .explore-shell { /* light IDE overrides */ }
  ```
  Rationale: `:root`/`.dark`/`.light` blocks are the CLI's and stay byte-untouched (D-10). Specificity verified: `.light .explore-shell` (0,2,0) beats `.explore-shell` (0,1,0); the shell div's own values beat `<html>`-level CLI classes for all descendants.
- **Class on `<html>`:** `dark` or `light` (existing system). Dark = default always — no `prefers-color-scheme` detection.
- **Persistence:** localStorage key **`portfolio-explore-theme`** (values `dark` | `light`). The shell **never reads or writes the CLI key `portfolio-theme`** (constants.ts:65) — hard rule.
- **Flash prevention:** an inline before-paint script rendered by the /explore layout/page (static-export-safe, synchronous inline `<script dangerouslySetInnerHTML>`): reads the key, `classList.remove("dark","light")` then adds the persisted class, defaulting to `dark` when absent/invalid/`localStorage` throws (try/catch). Root `<html>` already has `suppressHydrationWarning` (layout.tsx:92) so pre-hydration class mutation is safe.
- **No-regression guarantee (verified mechanism):** if a class ever lingers, the CLI self-heals — `useCliTheme` strips all `VALID_THEMES` classes and applies its own on mount (`useCliTheme.ts:28-40`). Conversely, explore's script strips/re-applies its own on every /explore load. No cleanup code may be added to any `src/components/cli/*` file (D-10).
- **Theme swap visual behaviour:** instant CSS-var swap — **no transition** on `background`/`color` at theme-toggle time (a global transition would smear both themes during the swap).
- Status-bar label text is exactly `dark` / `light` (matches applied class).

### 9.2 Dark IDE tokens (default — the `.explore-shell` base block)

All values shadcn HSL format; chart-1..5, success, warning are **inherited, not overridden**.

| Token | Value | Intent |
|---|---|---|
| `--background` | `220 13% 9%` | editor charcoal-blue (distinct from CLI neutral) |
| `--foreground` | `220 12% 84%` | |
| `--card` / `--card-foreground` | `220 12% 12%` / `220 12% 84%` | panel surface |
| `--popover` / `--popover-foreground` | `220 12% 13%` / `220 12% 84%` | drawer surface |
| `--primary` / `--primary-foreground` | `215 90% 64%` / `220 13% 9%` | IDE blue (rings, active) |
| `--secondary` / `--secondary-foreground` | `220 10% 17%` / `220 12% 84%` | |
| `--muted` / `--muted-foreground` | `220 10% 16%` / `220 8% 60%` | skeletons, secondary text |
| `--accent` / `--accent-foreground` | `160 84% 45%` / `220 13% 9%` | terminal green (❯, breadcrumb user) |
| `--destructive` / `--destructive-foreground` | `0 72% 51%` / `0 0% 98%` | |
| `--border` / `--input` / `--ring` | `220 10% 20%` / `220 10% 16%` / `215 90% 64%` | panel borders, focus |
| `--sidebar-background` / `--sidebar-foreground` | `220 12% 11%` / `220 10% 78%` | drawer |
| `--sidebar-primary` / `--sidebar-primary-foreground` | `215 90% 64%` / `220 13% 9%` | |
| `--sidebar-accent` / `--sidebar-accent-foreground` | `220 10% 18%` / `220 12% 90%` | item hover |
| `--sidebar-border` / `--sidebar-ring` | `220 10% 18%` / `215 90% 64%` | |
| `--radius` | `0.25rem` | sharper IDE corners, scoped to shell |

Contrast check: foreground 84% on 9% ≈ 13:1; muted-foreground 60% on 9% ≈ 5:1; both pass AA for the sizes used.

### 9.3 Light IDE tokens (the `.light .explore-shell` override block)

| Token | Value |
|---|---|
| `--background` / `--foreground` | `220 20% 97%` / `220 14% 16%` |
| `--card` / `--card-foreground` | `0 0% 100%` / `220 14% 16%` |
| `--popover` / `--popover-foreground` | `0 0% 100%` / `220 14% 16%` |
| `--primary` / `--primary-foreground` | `215 85% 45%` / `0 0% 100%` |
| `--secondary` / `--secondary-foreground` | `220 14% 93%` / `220 14% 20%` |
| `--muted` / `--muted-foreground` | `220 14% 92%` / `220 9% 40%` |
| `--accent` / `--accent-foreground` | `160 80% 28%` / `0 0% 100%` |
| `--destructive` / `--destructive-foreground` | `0 74% 46%` / `0 0% 98%` |
| `--border` / `--input` / `--ring` | `220 12% 85%` / `220 13% 89%` / `215 85% 45%` |
| `--sidebar-background` / `--sidebar-foreground` | `220 16% 94%` / `220 11% 30%` |
| `--sidebar-primary` / `--sidebar-primary-foreground` | `215 85% 45%` / `0 0% 100%` |
| `--sidebar-accent` / `--sidebar-accent-foreground` | `220 14% 90%` / `220 14% 15%` |
| `--sidebar-border` / `--sidebar-ring` | `220 12% 86%` / `215 85% 45%` |
| `--radius` | `0.25rem` |

Foreground 16% on 97% ≈ 12:1; muted-foreground 40% ≈ 6.5:1 — AA clean. Chart accents stay decorative-only in both themes: **chart colors may color chips, borders, and the drawer index digits; they must never be the sole text color for body copy.**

## 10. Typography (D-04)

- `JetBrains_Mono` via `next/font/google`, `subsets: ['latin']`, `variable: '--font-jetbrains'`, added to the root layout `<body>` className **alongside** the existing Geist variables (never replacing them — D-10).
- Consumption, scoped:
  ```css
  .explore-shell { font-family: var(--font-jetbrains), var(--font-geist-mono), Menlo, Monaco, 'Courier New', monospace; }
  ```
  CLI pages keep Geist Mono (body rule, globals.css:5-8) — untouched.
- Scale (JetBrains Mono everywhere on /explore, including the portaled drawer via §5's scope class):

| Element | Size |
|---|---|
| Header title | `text-sm` |
| Intro strip | `text-sm` (→ `text-base` at `md` optional) |
| Panel title | `text-sm font-medium` |
| Panel humor | `text-xs` |
| Drawer items | `text-sm`; index `text-xs tabular-nums` |
| Status bar | `text-[10px]` → `sm:text-xs` |
| Base body text | `text-sm` (14px desktop; ~11.6px effective mobile via the 14px html rule — verified legible) |

- No runtime CDN font fetch (next/font self-hosts at build; satisfies EXPLORE-01c).

## 11. Responsive Matrix (EXPLORE-06)

| Aspect | 375px (base) | 768px (`md`) | 1440px (`lg`) |
|---|---|---|---|
| Header | h-[52px], glyphs + name only (truncate-ready), 44px buttons | + `— {title}` shown | same |
| Intro strip | reserved 2-line min-h | 1 line | same |
| Panel grid | 1 col | 2 cols, About spans 2 | 3 cols, About spans 2 |
| Drawer | default Sheet left (`w-3/4` ≈ 281px) | `sm:max-w-sm` (384px) | same |
| Status bar | h-7, `text-[10px]`, full copy (fits — §7) | h-8, `text-xs` | same |
| Horizontal scroll | none (`overflow-x-hidden` belt-and-braces) | none | none |
| Scroll model | main scrolls internally; header/status always visible (`100dvh` handles mobile URL bar) | same | same |

## 12. Motion & Reduced Motion (D-07)

| Motion | Normal | `prefers-reduced-motion: reduce` |
|---|---|---|
| Typewriter | 30ms/char after 400ms delay | **component not rendered**; static full text |
| Sheet open/close | slide 500ms/300ms + overlay fade (built-in) | suppressed (see guard below) |
| Skeleton pulse | `animate-pulse` (built-in) | static `bg-muted` |
| Theme swap | instant | instant (nothing to suppress) |
| Anchor scroll | smooth (body rule) | instant |

Guard (required in `globals.css` — note the portal escape, §5):
```css
@media (prefers-reduced-motion: reduce) {
  body:has(.explore-shell) .explore-shell *,
  body:has(.explore-shell) [data-slot],          /* planner: prefer scoping by the marker class
  body:has(.explore-shell) .animate-pulse { animation: none !important; transition: none !important; }
}
```
Planner note: the portaled SheetContent carries `.explore-shell` itself (§5), so a guard shaped as `.explore-shell *, .explore-shell .animate-pulse { … }` plus the overlay selector covers both the in-flow shell and the portaled drawer. Behavioural requirement: **no animation authored by this phase survives reduced-motion**, including portal content.

## 13. Accessibility Contract

- **Landmarks:** `<header>` (banner) · intro strip `<h1>` (sr-only full name/title) · `<main aria-label="Portfolio sections">` wrapping the grid · `<footer>` status bar.
- **Drawer (Radix Dialog semantics, free):** `SheetTrigger` exposes `aria-expanded`/`aria-controls`; focus trapped while open (EXPLORE-01b); ESC + outside click close; focus returns to the trigger on close; `SheetTitle`/`SheetDescription` present (no Radix console warning).
- **Animated text:** visual typing span `aria-hidden`; sr-only static duplicate always present (§4).
- **Decorative:** window glyphs, accent chips, skeletons, `❯` prefix — all `aria-hidden`.
- **Live region:** status-bar right group `aria-live="polite"` (announces theme change).
- **Touch targets:** drawer toggle + theme toggle = 44×44 **real px** (px-based classes — the ≤640px `html{font-size:14px}` rule shrinks rem sizes ~17%, so rem-based `h-10` would render ~33px at 375px; this is why §3/§5 pin px sizing for every interactive target, including drawer items `min-h-[44px]`).
- **Focus order:** theme toggle → drawer toggle → (drawer contents while open) → panels contain no tabbables (skip-through) — no keyboard traps; ESC always exits the drawer.
- **Contrast:** all text ≥4.5:1 in both themes (token tables §9); theme label + counter use `muted-foreground`-class values, verified above.
- **Zoom/reflow:** no fixed-width children; grid + truncate handle 200% zoom; no horizontal scroll at 375px is a hard acceptance check.

## 14. Edge Coverage (explicit)

| # | Edge | Contract |
|---|---|---|
| 1 | First visit, no localStorage entry | Dark IDE renders (base tokens + script default) — no flash |
| 2 | Persisted `light` | Before-paint class → first paint is light, zero flash |
| 3 | Invalid/stale localStorage value | Anything ≠ `light` → dark (script's ternary default) |
| 4 | localStorage throws (private mode) | try/catch → dark; toggle still works per-session; no crash |
| 5 | JS disabled / static HTML | Header, panels, skeletons (CSS pulse), status bar all render; drawer + typewriter visual inert; sr-only h1 carries identity (§4, pinned tradeoff) |
| 6 | 375px viewport | No horizontal overflow (§11); drawer fully usable; all touch targets ≥44 real px |
| 7 | Landscape phone (~667×375) | `100dvh` shell; chrome ≈124px; panels scroll in remainder — no special case |
| 8 | Long data values | Name truncates in header (§3); intro may wrap (min-h reserved); humor wraps, never truncates |
| 9 | Rapid drawer toggle | Radix handles animation interruption; no stuck state |
| 10 | Double theme-toggle click | Idempotent class swap + one write; live label matches |
| 11 | Drawer open on desktop | Overlay `black/80` present at ALL viewports (pinned, one code path) |
| 12 | Stray CLI theme class on `<html>` | Explore script strips `dark`/`light` before applying its own (§9.1) |
| 13 | CLI regression surface | Zero writes to `src/app/(main)/**`, `src/components/cli/**`, `/resume`, root `globals.css` CLI blocks; only additive root-layout font + `.explore-shell` blocks |
| 14 | Hydration | Theme class mutated pre-hydration under existing `suppressHydrationWarning` (layout.tsx:92); typed span starts empty server-side by design (§4) |
| 15 | Panel anchors without JS | Drawer anchors still navigate via URL hash; panels scroll into view via native anchor behavior |

## 15. Verifier Hooks (acceptance → contract section)

| Acceptance (SPEC) | Proof in this contract |
|---|---|
| Full IDE frame at /explore | §2–§7 |
| Drawer opens/closes at 375/768/1440 + focus trap | §5, §8, §11 |
| No horizontal scroll at 375px | §11 + §14#6 |
| JetBrains Mono computed on /explore, self-hosted | §10 (incl. drawer scope rule) |
| Dark default; toggle + persistence; legibility | §9.1–§9.3 |
| CLI + /resume untouched | §9.1 mechanism, §14#13 |
| Static export emits /explore | SSG-safe inline script (§9.1), no server APIs anywhere in the shell |

## 16. (UNRESOLVED) / (OPTIONAL) Register — planner assumes these

| Marker | Item | Default if unaddressed |
|---|---|---|
| (UNRESOLVED) | Exact humor wording per panel (format `// <expr> — pending` locked; examples in §6) | use the five §6 strings verbatim |
| (OPTIONAL) | Subtle IDE glow: 1px gradient line under the header border at ~10% accent opacity | skip it; must never affect contrast if built |
| (OPTIONAL) | Persistent block cursor after typewriter completes | skip it (component cursor vanishes on completion — verified TypingEffect.tsx:53) |
| (UNRESOLVED) | /explore page metadata | follow the data-driven metadata pattern (layout.tsx:20-48); not a visual contract item |

## 17. Prohibitions (locked — do not relitigate)

1. No visible tab strip or per-section tabs in the header in phase 1 (drawer is the only nav; D-02; active-section logic is phase 4).
2. No edits to `src/components/ui/sheet.tsx`, `src/components/cli/**`, `src/app/(main)/**`, `/resume`, or the existing `:root`/`.dark`/`.light` token blocks.
3. No mobile-only navbar or second nav code path (D-02).
4. No new npm dependencies (D-09).
5. No hardcoded portfolio copy in the shell — name/title from data; section labels are the five locked chrome strings; status-bar strings are locked chrome (§7).
6. No hover/press affordance on placeholder panels (they are not navigable yet — §8).
7. No `prefers-color-scheme` detection (dark is the unconditional default, D-05).
8. No writing to the CLI's `portfolio-theme` localStorage key.

---

*UI Spec for phase 01-explore-shell · prepared by gsd-ui-researcher · 2026-09-20*