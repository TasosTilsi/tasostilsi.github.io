# Phase 1: explore-shell - Spec

**Gathered:** 2026-09-20T22:16:36.728Z
**Mode:** interviewed

## Requirements

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

## Boundaries

**In scope:** New /explore route (src/app/explore/page.tsx + layout as needed); new shell components (header bar, drawer navigation, placeholder panels, status bar) under src/components/explore/; JetBrains Mono font swap in root layout; explore-specific dark/light theme tokens in globals.css; typewriter intro in the shell header area.
**Out of scope:** Real content in the panels (About/Experience text, lists) — phase 2. Charts/timelines/stats — phase 3. Gamification (spin-the-wheel, achievements) — phase 4. CLI↔/explore cross-links and toggles — phase 5. Any change to the CLI terminal, /resume, or the resume PDF export pipeline. New dependencies beyond what's needed for the font and drawer.

## Constraints

- Reuse the existing shadcn/Radix component library (Sheet for the drawer) and the CSS-variable token system — no parallel styling mechanism
- The site ships as a static export to GitHub Pages: /explore must be SSG-compatible (no server-only APIs)
- All copy rendered by the shell must come from src/data/portfolio-main-data.json — no hardcoded portfolio content (EXPLORE-07)
- JetBrains Mono must be self-hosted via next/font/google (build-time), not a runtime CDN link

## Acceptance Criteria

- `npm run build` succeeds and /explore is emitted into the static export output (out/)
- Visiting /explore renders the full IDE frame: header bar with window controls + name/title, off-canvas drawer with 5 section targets (About, Experience, Skills, Projects, Contact), placeholder panels in the main area, bottom status bar
- The drawer opens via the header toggle and closes via ESC / outside click at 375px, 768px, and 1440px viewports
- No horizontal scroll at 375px; the shell is usable on a phone
- Computed font on /explore resolves to JetBrains Mono (self-hosted via next/font, no runtime CDN fetch)
- Dark IDE theme renders by default; the theme toggle switches to light and the choice persists across reload
- The CLI at / and the resume at /resume render unchanged (no regression)

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- Q: What does a visitor see on /explore at end of phase 1? A: Full IDE frame — header bar (window controls + name), left sidebar with section nav, main panel area with placeholder panels, bottom status bar; content in phase 2.
- Q: Mobile behaviour of section navigation? A: Off-canvas drawer at every viewport size (drawer everywhere, one code path, most IDE-like).
- Q: Which mono typeface carries the IDE identity? A: JetBrains Mono (self-hostable via next/font; literal Consolas rejected as Windows-only proprietary).
- Q: Theme and typewriter intro? A: Both dark and light IDE themes from day one. Intro detail was bundled into the theme answer — ASSUMPTION recorded: intro renders real name/title from portfolio-main-data.json (cheap; data exists). To revisit at discuss if unwanted.

---

*Phase: 01-explore-shell*
*Spec gathered: 2026-09-20*
## Ambiguity Report

| Dimension | Score | Min | Status |
|---|---|---|---|
| Goal Clarity | 0.83 | 0.75 | PASS |
| Boundary Clarity | 0.92 | 0.70 | PASS |
| Constraint Clarity | 0.92 | 0.65 | PASS |
| Acceptance Criteria | 0.75 | 0.70 | PASS |

**Overall Ambiguity:** 0.145  (max 0.2)

**Gate:** PASSING — requires ambiguity <= 0.2 AND all four dimensions at/above their minima

No dimension is below its minimum.
