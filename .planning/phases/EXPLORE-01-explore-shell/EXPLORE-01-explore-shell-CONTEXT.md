# Phase 1: explore-shell - Context

**Gathered:** 2026-09-20T22:19:27.107Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** Scaffold the /explore route as the complete IDE-style shell defined in SPEC.md: header bar with window controls + name/title, off-canvas section drawer (Sheet-based) at all viewports, 5 placeholder panels, bottom status bar with breadcrumb + theme + section counter; JetBrains Mono scoped to /explore; hand-rolled dark/light theme with flash prevention; typewriter intro with real name/title; all copy data-driven.
**Out of scope:** Real panel content (phase 2), charts/visualizations (phase 3), gamification and progress wiring (phase 4), CLI↔/explore routing toggle (phase 5), any change to the CLI terminal, /resume, or the resume PDF pipeline, any new npm dependency.
</domain>

<decisions>
## Decisions
### Layout & Shell
- **D-01:** /explore renders the full IDE frame: header bar (window-control glyphs + name/title from data), off-canvas section drawer, main panel area with 5 placeholder panels (About, Experience, Skills, Projects, Contact), bottom status bar.
- **D-02:** Section navigation is an off-canvas drawer at EVERY viewport size (drawer everywhere, one code path, no separate mobile navbar), built on the existing shadcn Sheet; toggled from the header; closes via ESC/outside click.
- **D-03:** Status bar: left = 'guest@tasostilsi:~/explore' breadcrumb; right = active theme name + '0/5 sections visited' counter (counter stays static until phase 4 wires real exploration progress).
### Visual identity
- **D-04:** JetBrains Mono loaded via next/font/google and applied ONLY to /explore via a new CSS variable (--font-jetbrains), leaving CLI pages on Geist Mono untouched (no regression risk).
- **D-05:** Dark IDE theme (default) + light IDE theme, hand-rolled: localStorage key + class on <html> + inline before-paint script to prevent flash; explore-specific token values added in globals.css under the existing shadcn CSS-var system; toggle lives in the header bar.
- **D-06:** Placeholder panels: section title + one line of light techy humor (e.g. '// experience.render() — pending') so the shell feels alive; humor stays professional.
- **D-07:** Typewriter intro in the shell renders the visitor-facing real name/title from portfolio-main-data.json, reusing the CLI's TypingEffect; respects prefers-reduced-motion (falls back to static text).
### Architecture & constraints
- **D-08:** New route at src/app/explore/page.tsx, SSG-compatible for the static export; shell components under src/components/explore/; ALL copy rendered by the shell comes from portfolio-main-data.json (EXPLORE-07).
- **D-09:** Zero new dependencies in phase 1: drawer via existing shadcn Sheet, theme hand-rolled, font via next/font.
- **D-10:** CLI (/) and /resume render untouched — no changes to their layouts, fonts, or themes.
### Claude's Discretion
- Exact window-control glyphs and header layout micro-details
- Wording of the witty placeholder copy (professional, one line per panel)
- Status bar typography and spacing
- Whether the drawer keeps a subtle backdrop on desktop or slides the content
- /explore page metadata (title/description) — follow the data-driven pattern
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Component library
- `src/components/ui/sheet.tsx — existing shadcn Sheet (Radix Dialog) to build the drawer on`
- `src/components/ui/skeleton.tsx — for placeholder blocks inside panels`
### Design tokens
- `tailwind.config.ts:46-62 — sidebar + chart-1..5 token mappings already defined`
- `src/app/globals.css — CSS variable token system, darkMode: class`
### Fonts
- `src/app/layout.tsx:9-17 — Geist/Geist_Mono via next/font: the pattern to follow for JetBrains Mono`
### Data source
- `src/data/portfolio-main-data.json`
- `src/data/portfolio-main-data.d.ts — PortfolioData type`
### Typewriter
- `src/components/cli/TypingEffect.tsx — typing animation component`
### Theme persistence precedent
- `src/components/cli/constants.ts — LOCAL_STORAGE_THEME_KEY pattern`
### Locked spec
- `.planning/phases/EXPLORE-01-explore-shell/EXPLORE-01-explore-shell-SPEC.md`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- Google Analytics (G-TLWL6FDZE7) is wired in the root layout — no per-page tracking changes needed in this phase
- Site ships as a static export (next build → out/, served on GitHub Pages) — /explore must be SSG-compatible; CLI already uses dynamic import with ssr:false as its client-boundary pattern
- CLI terminal lives in src/app/(main)/ route group with its own layout; /explore should be a sibling route, not inside that group, to avoid inheriting the h-screen overflow-hidden terminal shell
- shadcn 'use client' components (Sheet) can be used from a server-component page via composition, same as existing pages
- Metadata pattern is data-driven from portfolio-main-data.json (src/app/layout.tsx:20-48)
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
  _Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._
  ### Req EXPLORE-01
  - **Current:** No /explore route exists. The only landing is the CLI terminal at / (src/app/(main)/page.tsx) plus /resume.
  - **Target:** /explore renders the full IDE frame: header bar with window controls + name/title, off-canvas section drawer, main panel area with placeholder panels, bottom status bar.
  - **Acceptance:** Visiting /explore shows header bar with window controls + name/title, off-canvas drawer listing About/Experience/Skills/Projects/Contact, placeholder panels in the main area, and a bottom status bar.
  ### Req EXPLORE-01b
  - **Current:** n/a (new page).
  - **Target:** Section navigation is an off-canvas drawer at every viewport size, toggled from the header — one code path, no separate mobile navbar.
  - **Acceptance:** Drawer opens from the header toggle and closes via ESC/outside click at 375px, 768px, and 1440px; focus is trapped while open.
  ### Req EXPLORE-01c
  - **Current:** src/app/layout.tsx loads Geist + Geist_Mono via next/font.
  - **Target:** JetBrains Mono loaded via next/font and applied as the shell's typeface.
  - **Acceptance:** Computed font-family on /explore resolves to JetBrains Mono; no runtime CDN font fetch.
  ### Req EXPLORE-01d
  - **Current:** globals.css token system (shadcn, darkMode: class) exists with sidebar and chart-1..5 tokens; CLI is dark-themed.
  - **Target:** /explore supports a dark IDE theme (default) and a light IDE theme using the existing CSS-variable token system, switchable in-shell.
  - **Acceptance:** Dark renders by default; toggle switches theme; choice persists via localStorage; both themes legible.
  ### Req EXPLORE-06
  - **Current:** n/a (new page).
  - **Target:** The shell is responsive from 375px to desktop with no horizontal scroll and a touch-usable drawer.
  - **Acceptance:** At 375px viewport width there is no horizontal overflow and the drawer is fully usable.
- **Boundaries (SPEC):**
  **In scope:** New /explore route (src/app/explore/page.tsx + layout as needed); new shell components (header bar, drawer navigation, placeholder panels, status bar) under src/components/explore/; JetBrains Mono font swap in root layout; explore-specific dark/light theme tokens in globals.css; typewriter intro in the shell header area.
  **Out of scope:** Real content in the panels (About/Experience text, lists) — phase 2. Charts/timelines/stats — phase 3. Gamification (spin-the-wheel, achievements) — phase 4. CLI↔/explore cross-links and toggles — phase 5. Any change to the CLI terminal, /resume, or the resume PDF export pipeline. New dependencies beyond what's needed for the font and drawer.
- **Acceptance Criteria (SPEC):**
  - `npm run build` succeeds and /explore is emitted into the static export output (out/)
  - Visiting /explore renders the full IDE frame: header bar with window controls + name/title, off-canvas drawer with 5 section targets (About, Experience, Skills, Projects, Contact), placeholder panels in the main area, bottom status bar
  - The drawer opens via the header toggle and closes via ESC / outside click at 375px, 768px, and 1440px viewports
  - No horizontal scroll at 375px; the shell is usable on a phone
  - Computed font on /explore resolves to JetBrains Mono (self-hosted via next/font, no runtime CDN fetch)
  - Dark IDE theme renders by default; the theme toggle switches to light and the choice persists across reload
  - The CLI at / and the resume at /resume render unchanged (no regression)
- User, on identity: 'remaining in another landing page in the look and feel techy with typography and typewriting more techy, like consolas font and such, or the page might look like an IDE but showing and presenting better the work'
- User, on audience: recruiters and non-techy people must be able to scan the work without typing commands
- User, on constraint: 'without losing the cli website'
- User approved spec interview answers: Full IDE frame / Drawer everywhere / JetBrains Mono / Dark + light themes
- User approved discuss answers: hand-rolled theme / labeled + witty placeholders / breadcrumb + counters status bar
</specifics>

<deferred>
## Deferred Ideas
- Charts/visualizations (skills radar, experience timeline, project stats) → phase 3 (explore-visuals)
- Spin-the-wheel tour picker + exploration achievements → phase 4 (explore-gamification)
- Wiring the 0/5-visited counter to real tracking → phase 4
- CLI ↔ /explore toggle/links → phase 5 (explore-routing)
</deferred>


---

*Phase: 01-explore-shell*
*Context gathered: 2026-09-20*