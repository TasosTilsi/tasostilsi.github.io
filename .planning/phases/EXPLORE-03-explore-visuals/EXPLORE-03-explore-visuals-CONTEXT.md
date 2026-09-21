# Phase 3: explore-visuals - Context

**Gathered:** 2026-09-21T13:32:32.099Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** Four data-derived visualizations added inside existing panels: recharts skills bar chart above chips, recharts technology Treemap (area ∝ mentions in role responsibilities, colored by category) below the bar chart, CSS Gantt career-span chart (7 roles) above the text timeline, 3 stat tiles above project cards; pure typed parser module + unit tests; client-boundary recharts components; isAnimationActive={false}; scoped light-theme chart overrides per UI-SPEC; all numbers computed from portfolio-main-data.json.
**Out of scope:** Replacing phase-2 text content (EXPLORE-03 regression forbidden), grid/chrome redesign, new dependencies, tooltips, heatmaps (superseded), gamification (phase 4), routing (phase 5), edits to CLI, /resume, data file, or Resume* components.
</domain>

<decisions>
## Decisions
### Visualization mechanics
- **D-01:** Skills chart = recharts horizontal BarChart of counts per category (6 groups, exact JSON values), rendered ABOVE the chips in the Skills panel; chips and group headers unchanged.
- **D-02:** Career-span timeline = PURE CSS Gantt (user-approved deviation): shared year axis 2017→present, all 7 roles as horizontal span bars positioned by parsed start/end percentages; role + duration printed beside each bar; 'Present' extends to axis end (fixed at build). ABOVE the phase-2 3-role text details, which stay unchanged.
- **D-03:** Project stat tiles = 3 static tiles above the cards: total projects, active-years span, linked-project count — computed from the JSON by the data module.
- **D-04:** All chart values are STATIC printed text (JetBrains Mono, chart tokens) — no hover tooltips anywhere.
- **D-08:** Skills TREEMAP (user correction: 'better to have treemap not heatmap', superseding the agent's heatmap proposal): recharts <Treemap> in the Skills panel BELOW the bar chart — cells = technologies matched whole-word case-insensitively by their own names from the skills JSON against the 7 roles' responsibilities text; area ∝ total mention count; grouped/colored by category via chart tokens; static name+count cell labels (name at minimum on small cells); pinned minimum-area/mention threshold drops invisible cells; zero invented keywords (the keyword list IS the JSON's technology names); mention counts are honest heuristics — 'named mentions in role descriptions', not effort hours; isAnimationActive={false}; no tooltips.
### Architecture
- **D-05:** One pure, typed data-shaping module: parseDuration(), skillsGroupCounts(), projectStats(), techMentions() (whole-word escaped matching of JSON skill names against responsibilities text) — unit-tested; components never parse strings inline.
- **D-06:** recharts components are 'use client' with ResponsiveContainer; the page stays SSG (hydration shells in the static export); isAnimationActive={false} unconditionally on every recharts component including <Treemap> (W-3 pin — no matchMedia wiring).
- **D-07:** Augment-only: no changes to panel chrome, grid spans, phase-2 text bodies, drawer/header/status bar; zero new dependencies; every rendered number from portfolio-main-data.json (EXPLORE-07).
### Claude's Discretion
- Bar color mapping across chart-1..5 tokens + which token covers the 6th group
- Treemap minimum-cell threshold and label-elision rule (chrome constants, pinned in UI-SPEC)
- Gantt row height, axis tick styling
- Tile typography and internal spacing
- recharts margins within panels
- Exact wording of tile labels (chrome, data-derived values)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Augment targets
- `src/components/explore/sections/experience-section.tsx — text timeline to augment (stays below the Gantt)`
- `src/components/explore/sections/skills-section.tsx — chips stay below the new chart + treemap`
- `src/components/explore/sections/projects-section.tsx — cards stay below the new tiles`
### Data source
- `src/data/portfolio-main-data.json — experience[7] durations (both dash styles verified parseable), skills groups + technology names (the treemap keyword set = these names, zero invented), responsibilities[] text (the corpus), projects[14] date strings`
- `src/data/portfolio-main-data.d.ts — PortfolioData types`
### Tokens, overrides, chart lib
- `tailwind.config.ts:46-52 — chart-1..5 tokens`
- `.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md — scoped light-theme --chart-2/--chart-3 overrides (§2), isAnimationActive={false} pin (§6)`
- `package.json — recharts ^2.15.1 installed (Treemap included in 2.x)`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- recharts 2.x ships a native <Treemap> component — first usage in this phase alongside <BarChart>; both are 'use client' with ResponsiveContainer and isAnimationActive={false} unconditional (UI-SPEC §6 pin)
- Treemap label rendering needs a custom content component (recharts Treemap renders cells via a content prop) — keep it a typed server-safe render fn inside the client component
- Whole-word case-insensitive matching: skill names like 'C++' contain regex-special chars — the parser must escape for matching; multi-word names ('Creative Problem Solving') match literally
- Duration strings use TWO dash styles (em-dash and hyphen) plus 'Present' — the parser normalizes both (verified all 7 parse)
- Experience data is reverse-chronological; Gantt rows render in JSON order
- Reduced-motion CSS guard (globals.css:573-586) covers all CSS animation inside .explore-shell — treemap is recharts (JS) so it relies on isAnimationActive={false}
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
  - **Acceptance:** Horizontal bar chart renders 6 categories with exact JSON counts (6/9/6/6/7/2), chart-token colors, above the chips; legible in both themes (scoped light override per UI-SPEC); scales to panel width.
  ### Req EXPLORE-02d
  - **Current:** n/a (new — user-requested addition, corrected from heatmap to treemap).
  - **Target:** A recharts Treemap inside the Skills panel (below the bar chart) showing which technologies dominate actual work — area proportional to total mention count across role responsibilities, colored by skill category.
  - **Acceptance:** Treemap cells are technologies matched whole-word case-insensitively by their own names from the skills JSON against the 7 roles' responsibilities text; area ∝ total mentions; colored by category (chart tokens); static name+count labels; pinned minimum-area rule keeps cells legible; rendered below the bar chart; zero tooltips; legible in both themes.
  ### Req EXPLORE-02b
  - **Current:** Experience panel is a 3-role text timeline (rail + dots).
  - **Target:** A graphical career-span timeline (pure CSS Gantt, duration bars for ALL 7 roles, parsed from duration strings) added to the Experience panel above the phase-2 text details.
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
  - Skills panel: a recharts Treemap renders below the bar chart — cells = technologies that appear in responsibilities text (matched whole-word, case-insensitive, by their own names from the skills JSON), area proportional to total mention count across the 7 roles' responsibilities; grouped/colored by category using chart tokens; matches are zero-invented-keyword
  - Treemap cell labels print the technology name and mention count as static text (JetBrains Mono); no tooltips; cells too small for labels show at least the name, or drop below a pinned minimum-mention threshold to keep the treemap legible
  - Experience panel: career-span chart renders ALL 7 roles as duration bars across a time axis derived from the JSON duration strings; the phase-2 3-role text details remain below it
  - Projects panel: stat tiles render above the cards — total count, active-years span, linked-project count — every number derived from portfolio-main-data.json (grep: no hardcoded stats)
  - All visualizations use the chart-1..5 design tokens (with the pinned scoped light-theme overrides for --chart-2/--chart-3) and remain legible in dark and light themes
  - 375px: no horizontal scroll — charts and treemap scale with their panel (ResponsiveContainer or equivalent), never overflow
  - Reduced motion: recharts animations disabled unconditionally (isAnimationActive={false}) across all chart components including the Treemap
  - The static export contains the chart components (client-hydration shells present in out/explore.html) with zero new dependencies beyond recharts (already installed)
- User: 'all three, we may need to change the experience timeline with a graphical experience timeline' — resolved as AUGMENT (Gantt above text details)
- User: skills = bar chart of counts
- User: stats = stat tiles
- User: placement = augment panels, no grid redesign
- User: CSS Gantt build (deliberate roadmap deviation, approved)
- User: static printed values, no tooltips
- User: 'you fit a heatmap as well somewhere to show some extra valuable information' then 'I was thinking more into the stats for the skills' then 'better to have treemap not heatmap' — final: recharts Treemap of technology mentions in the Skills panel
</specifics>

<deferred>
## Deferred Ideas
- Hover tooltips (rejected — revisit only if user asks)
- Charts in the About/Contact panels
- Gamification + exploration progress → phase 4
- CLI↔explore routing → phase 5
- Heatmap idea (superseded by the treemap per user)
</deferred>


---

*Phase: 03-explore-visuals*
*Context gathered: 2026-09-21*