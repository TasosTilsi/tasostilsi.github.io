# Phase 3: explore-visuals - Context

**Gathered:** 2026-09-21T12:15:56.404Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** Three data-derived visualizations added inside existing panels: recharts skills bar chart above chips, CSS Gantt career-span chart (7 roles) above the text timeline, 3 stat tiles above project cards; pure typed parser module + unit tests; client-boundary recharts components; reduced-motion handling; all numbers computed from portfolio-main-data.json.
**Out of scope:** Replacing phase-2 text content (EXPLORE-03 regression forbidden), grid/chrome redesign, new dependencies, tooltips, gamification (phase 4), routing (phase 5), edits to CLI, /resume, data file, or Resume* components.
</domain>

<decisions>
## Decisions
### Visualization mechanics
- **D-01:** Skills chart = recharts horizontal BarChart of counts per category (6 groups, exact JSON values), rendered ABOVE the chips in the Skills panel; chips and group headers unchanged.
- **D-02:** Career-span timeline = PURE CSS Gantt (user-approved deviation from roadmap-literal recharts): shared year axis 2017→present, all 7 roles as horizontal span bars positioned by parsed start/end percentages, role + duration printed beside each bar; 'Present' extends to the axis end (fixed at build time — the export is static). Rendered ABOVE the phase-2 3-role text details, which stay unchanged.
- **D-03:** Project stat tiles = 3 static tiles above the cards: total projects (14), active-years span (from min/max project years), linked-project count (entries with a link) — every number computed from the JSON by the data module.
- **D-04:** All chart values are STATIC printed text (JetBrains Mono, chart tokens) — no hover tooltips anywhere (user decision; mobile-first recruiters).
### Architecture
- **D-05:** One pure, typed data-shaping module (e.g. src/components/explore/viz-data.ts): parseDuration() normalizing both dash styles + 'Present', skillsGroupCounts(), projectStats() — unit-tested; components never parse strings inline.
- **D-06:** recharts components are 'use client' with ResponsiveContainer; the page stays SSG (hydration shells in the static export); reduced-motion disables recharts animations via the explore-intro matchMedia-once pattern.
- **D-07:** Augment-only: no changes to panel chrome, grid spans, phase-2 text bodies, drawer/header/status bar; zero new dependencies; every rendered number from portfolio-main-data.json (EXPLORE-07).
### Claude's Discretion
- Bar color mapping across chart-1..5 tokens + which token covers the 6th group
- Gantt row height, axis tick styling, grid line subtlety
- Tile typography and internal spacing
- recharts margins/padding within panels
- Exact wording of tile labels (chrome, data-derived values)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Augment targets
- `src/components/explore/sections/experience-section.tsx — text timeline to augment (stays below the Gantt)`
- `src/components/explore/sections/skills-section.tsx — chips stay below the new chart`
- `src/components/explore/sections/projects-section.tsx — cards stay below the new tiles`
### Data source
- `src/data/portfolio-main-data.json — experience[7] durations ('Sept 2023 — Present' em-dash + 'March 2017 - June 2017' hyphen formats, verified all 7 parse), skills group counts (6/9/6/6/7/2), projects[14] with date strings`
- `src/data/portfolio-main-data.d.ts — PortfolioData types`
### Tokens, motion pattern, chart lib
- `tailwind.config.ts:46-52 — chart-1..5 tokens for chart colors`
- `src/components/explore/explore-intro.tsx — reduced-motion matchMedia-once pattern to reuse`
- `package.json — recharts ^2.15.1 already installed`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- Duration strings use TWO dash styles (em-dash and hyphen) plus 'Present' — the parser module must normalize both
- Experience data is reverse-chronological (Chubb 2023 first, WashPark 2017 last) — Gantt rows render in JSON order, top = most recent
- recharts 2.15.1 is a dependency but unused so far — first usage lands in this phase; ResponsiveContainer requires client rendering, so chart components are 'use client' while sections stay server components that compose them
- reduced-motion precedent exists: explore-intro.tsx checks matchMedia once on mount — same pattern for disabling recharts animations (isAnimationActive={false})
- The phase-1 reduced-motion guard in globals.css suppresses CSS transitions inside .explore-shell — CSS Gantt bars inherit suppression automatically
- GA G-TLWL6FDZE7 in root layout; no chart-interaction tracking in this phase
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
  _Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._
  ### Req EXPLORE-02
  - **Current:** Skills panel shows only 36 grouped chips (phase 2).
  - **Target:** A skills bar chart (technologies per category) inside the Skills panel, above the existing chips, built with recharts.
  - **Acceptance:** Horizontal bar chart renders 6 categories with exact JSON counts (6/9/6/6/7/2), chart-token colors, above the chips; legible in both themes; scales to panel width.
  ### Req EXPLORE-02b
  - **Current:** Experience panel is a 3-role text timeline (rail + dots).
  - **Target:** A graphical career-span timeline (Gantt-style duration bars for ALL 7 roles, parsed from duration strings) added to the Experience panel above the phase-2 text details.
  - **Acceptance:** All 7 roles appear as duration bars on a shared time axis derived from 'duration' strings; the 3-role text details remain below; chart legible in both themes.
  ### Req EXPLORE-02c
  - **Current:** Projects panel shows only the 6 cards.
  - **Target:** Project stat tiles inside the Projects panel — total projects, active-years span, linked-project count — derived entirely from the data file.
  - **Acceptance:** Tiles show total projects (14), active-year span, linked-project count (9) — all computed from the JSON; rendered above the 6 project cards.
- **Boundaries (SPEC):**
  **In scope:** Add the visualizations — a skills chart, an experience timeline, and project stats — built with recharts from the existing portfolio data.
  **Out of scope:** (not specified)
- **Acceptance Criteria (SPEC):**
  - `npm run build` (CI gate), `npm run typecheck`, and `node --test tests/explore-shell.test.mjs` all pass on the final tree; /explore still exports statically
  - Skills panel: horizontal bar chart of technology counts per category (6 groups from JSON) renders above the existing chips; bar values match the JSON counts exactly (soft 6, Languages 9, Testing 6, Infrastructure 6, Innovation 7, languages 2)
  - Experience panel: career-span chart renders ALL 7 roles as duration bars across a time axis derived from the JSON duration strings; the phase-2 3-role text details remain below it
  - Projects panel: stat tiles render above the cards — total count, active-years span, linked-project count — every number derived from portfolio-main-data.json (grep: no hardcoded stats)
  - All three charts use the chart-1..5 design tokens and remain legible in dark and light themes
  - 375px: no horizontal scroll — charts scale with their panel (ResponsiveContainer or equivalent), never overflow
  - Reduced motion: chart entry animations disabled under prefers-reduced-motion
  - The static export contains the chart components (client-hydration shells present in out/explore.html) with zero new dependencies beyond recharts (already installed)
- User: 'all three, we may need to change the experience timeline with a graphical experience timeline' — resolved as AUGMENT (Gantt above text details); replacement rejected to protect EXPLORE-03
- User: skills = bar chart of counts (radar rejected as misleading)
- User: stats = stat tiles
- User: placement = augment panels, no grid redesign
- User: CSS Gantt build (deliberate roadmap deviation, approved)
- User: static printed values, no tooltips
</specifics>

<deferred>
## Deferred Ideas
- Hover tooltips (rejected this round — revisit only if user asks)
- Charts in the About/Contact panels (not in this phase's scope)
- Gamification + exploration progress → phase 4
- CLI↔explore routing → phase 5
</deferred>


---

*Phase: 03-explore-visuals*
*Context gathered: 2026-09-21*