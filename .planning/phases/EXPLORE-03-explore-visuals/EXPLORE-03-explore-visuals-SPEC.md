# Phase 3: explore-visuals - Spec

**Gathered:** 2026-09-21T13:28:03.914Z
**Mode:** interviewed

## Requirements

_Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._

### Req EXPLORE-02

- **Current:** Skills panel shows only 36 grouped chips (phase 2).
- **Target:** A skills bar chart (technologies per category) inside the Skills panel, above the existing chips, built with recharts.
- **Acceptance:** Horizontal bar chart renders 6 categories with exact JSON counts (6/9/6/6/7/2), chart-token colors, above the chips; legible in both themes (scoped light override per UI-SPEC); scales to panel width.

### Req EXPLORE-02d

- **Current:** n/a (new — user-requested addition at execute step).
- **Target:** A technology × year activity heatmap inside the Skills panel (below the bar chart), derived purely from matching the JSON's own technology names against role responsibilities within each role's active years.
- **Acceptance:** Heatmap rows are technologies that appear in responsibilities text (matched by whole-word case-insensitive skill names from the JSON); columns = activity years derived from role durations; intensity levels from mention counts; pinned row cap keeps density sane; rendered below the skills bar chart; legible in both themes with existing tokens.

### Req EXPLORE-02b

- **Current:** Experience panel is a 3-role text timeline (rail + dots).
- **Target:** A graphical career-span timeline (pure CSS Gantt, duration bars for ALL 7 roles, parsed from duration strings) added to the Experience panel above the phase-2 text details.
- **Acceptance:** All 7 roles appear as duration bars on a shared time axis derived from 'duration' strings; the 3-role text details remain below; chart legible in both themes.

### Req EXPLORE-02c

- **Current:** Projects panel shows only the 6 cards.
- **Target:** Project stat tiles inside the Projects panel — total projects, active-years span, linked-project count — derived entirely from the data file.
- **Acceptance:** Tiles show total projects (14), active-year span, linked-project count (9) — all computed from the JSON; rendered above the 6 project cards.

## Boundaries

**In scope:** Add the visualizations — a skills chart, an experience timeline, and project stats — built with recharts from the existing portfolio data.
**Out of scope:** (not specified)

## Constraints

- Augment, never replace: phase-2 text content stays intact (EXPLORE-03/07 remain satisfied); the phase-1 grid, panel chrome, drawer, header, status bar untouched
- recharts only for charts — already installed; no new dependencies; the heatmap is pure CSS (grid of tinted cells from existing tokens) matching the D-02 CSS-Gantt pattern
- Every rendered number derives from portfolio-main-data.json at build time — the heatmap keyword list IS the JSON's own technology names; zero hardcoded stats or invented keywords (EXPLORE-07)
- recharts components 'use client' with ResponsiveContainer; isAnimationActive={false} unconditionally; SSG-safe hydration shells; 375px no-horizontal-scroll invariant preserved; JetBrains Mono carries labels
- Duration/date/mention parsing happens in the pure data-shaping module (typed, testable) — no parsing scattered in components
- The scoped light-theme chart overrides pinned in the phase-3 UI-SPEC (§2) are part of this phase's contract

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and `node --test tests/explore-shell.test.mjs` all pass on the final tree; /explore still exports statically
- Skills panel: horizontal bar chart of technology counts per category (6 groups from JSON) renders above the existing chips; bar values match the JSON counts exactly (soft 6, Languages 9, Testing 6, Infrastructure 6, Innovation 7, languages 2)
- Skills panel: technology × year activity heatmap renders below the bar chart — rows = technologies matched by name from the skills JSON, columns = activity years, cell intensity = mention counts in role responsibilities active that year; matches are case-insensitive whole-word matches of skill names from the JSON itself
- Heatmap rows are capped (top technologies by total mentions) to keep panel density sane; the cap count is a pinned chrome constant, the technology set itself is data-derived
- Experience panel: career-span chart renders ALL 7 roles as duration bars across a time axis derived from the JSON duration strings; the phase-2 3-role text details remain below it
- Projects panel: stat tiles render above the cards — total count, active-years span, linked-project count — every number derived from portfolio-main-data.json (grep: no hardcoded stats)
- All visualizations use the chart-1..5 design tokens (with the pinned scoped light-theme overrides for --chart-2/--chart-3) and remain legible in dark and light themes
- 375px: no horizontal scroll — charts and heatmap scale with their panel (ResponsiveContainer or equivalent), never overflow
- Reduced motion: recharts animations disabled unconditionally (isAnimationActive={false}); heatmap is static CSS (no animation to suppress)
- The static export contains the chart components (client-hydration shells present in out/explore.html) with zero new dependencies beyond recharts (already installed)

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- Q: Which visualizations? A: All three + (user, at execute step): 'you fit a heatmap as well somewhere to show some extra valuable information'.
- Q: Heatmap shows what? A: user custom: 'I was thinking more into the stats for the skills' → RESOLVED: technology × year activity heatmap in the Skills panel; technologies matched by their own names from the skills JSON against role responsibilities text; placement below the skills bar chart (agent-assigned per augment pattern; user delegated 'you fit').
- Q: Skills chart form? A: Bar chart of counts (data has no proficiency levels — radar rejected as misleading).
- Q: Project stats form? A: Stat tiles (total, active years, linked count).
- Q: Placement? A: Augment panels — charts above/below existing content; no grid redesign.
- Q: Timeline build? A: Pure CSS Gantt (deviation approved); static printed values, no tooltips.

---

*Phase: 03-explore-visuals*
*Spec gathered: 2026-09-21*
## Ambiguity Report

| Dimension | Score | Min | Status |
|---|---|---|---|
| Goal Clarity | 0.85 | 0.75 | PASS |
| Boundary Clarity | 0.72 | 0.70 | PASS |
| Constraint Clarity | 0.82 | 0.65 | PASS |
| Acceptance Criteria | 0.80 | 0.70 | PASS |

**Overall Ambiguity:** 0.199  (max 0.2)

**Gate:** PASSING — requires ambiguity <= 0.2 AND all four dimensions at/above their minima

No dimension is below its minimum.
