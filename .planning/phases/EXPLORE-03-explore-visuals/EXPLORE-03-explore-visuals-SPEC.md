# Phase 3: explore-visuals - Spec

**Gathered:** 2026-09-21T12:14:42.871Z
**Mode:** interviewed

## Requirements

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

## Boundaries

**In scope:** Add the visualizations — a skills chart, an experience timeline, and project stats — built with recharts from the existing portfolio data.
**Out of scope:** (not specified)

## Constraints

- Augment, never replace: phase-2 text content stays intact (EXPLORE-03/07 remain satisfied); the phase-1 grid, panel chrome, drawer, header, status bar untouched
- recharts only — already installed; no new dependencies; charts as 'use client' components (ResponsiveContainer needs the browser), SSG-safe via hydration shells
- Every rendered number derives from portfolio-main-data.json at build time — zero hardcoded stats (EXPLORE-07)
- Reduced-motion: recharts animations disabled under prefers-reduced-motion; 375px no-horizontal-scroll invariant preserved; JetBrains Mono carries chart labels
- Duration/date parsing happens in a pure data-shaping module (typed, testable) — no parsing scattered in components

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and `node --test tests/explore-shell.test.mjs` all pass on the final tree; /explore still exports statically
- Skills panel: horizontal bar chart of technology counts per category (6 groups from JSON) renders above the existing chips; bar values match the JSON counts exactly (soft 6, Languages 9, Testing 6, Infrastructure 6, Innovation 7, languages 2)
- Experience panel: career-span chart renders ALL 7 roles as duration bars across a time axis derived from the JSON duration strings; the phase-2 3-role text details remain below it
- Projects panel: stat tiles render above the cards — total count, active-years span, linked-project count — every number derived from portfolio-main-data.json (grep: no hardcoded stats)
- All three charts use the chart-1..5 design tokens and remain legible in dark and light themes
- 375px: no horizontal scroll — charts scale with their panel (ResponsiveContainer or equivalent), never overflow
- Reduced motion: chart entry animations disabled under prefers-reduced-motion
- The static export contains the chart components (client-hydration shells present in out/explore.html) with zero new dependencies beyond recharts (already installed)

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- Q: Which visualizations? A: All three (roadmap-literal) — user: 'all three, we may need to change the experience timeline with a graphical experience timeline'. ASSUMPTION recorded: graphical timeline AUGMENTS the panel (span chart for all 7 roles) while phase-2 text details stay — revisit at discuss if replacement was meant.
- Q: Skills chart form? A: Bar chart of counts (data has no proficiency levels — radar rejected as misleading).
- Q: Project stats form? A: Stat tiles (total, active years, linked count).
- Q: Placement? A: Augment panels — charts above existing content; no grid redesign.

---

*Phase: 03-explore-visuals*
*Spec gathered: 2026-09-21*
## Ambiguity Report

| Dimension | Score | Min | Status |
|---|---|---|---|
| Goal Clarity | 0.85 | 0.75 | PASS |
| Boundary Clarity | 0.75 | 0.70 | PASS |
| Constraint Clarity | 0.88 | 0.65 | PASS |
| Acceptance Criteria | 0.85 | 0.70 | PASS |

**Overall Ambiguity:** 0.169  (max 0.2)

**Gate:** PASSING — requires ambiguity <= 0.2 AND all four dimensions at/above their minima

No dimension is below its minimum.
