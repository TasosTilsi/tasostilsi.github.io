I have everything grounded: components, data, tokens (chart-1..5 are global constants across both explore themes), the reduced-motion guard, shell padding, grid breakpoints, and the recharts version. Two notable findings I must surface in the spec: the SPEC's linked-count literal "(9)" conflicts with the current JSON (all 14 projects have links), and chart-1..5 tokens are theme-invariant (defined only at `:root`, never overridden per theme). Now writing the full UI-SPEC.

---

# EXPLORE-03 explore-visuals — UI-SPEC (design contract)

**Status:** Ready for planning · **Binding before implementation** · Phase: 03-explore-visuals
**Inputs honored:** CONTEXT.md D-01…D-07 (locked), SPEC REQ EXPLORE-02 / 02b / 02c, phase-2 UI-SPEC precedents (graceful-hide, static panels, server components).
**Contract scope:** layout, interaction states, visual behaviour, edge coverage for the three visualizations ONLY. Everything not specified here is unchanged phase-2 behaviour.

---

## §0 — Locked frame (do not relitigate)

- **Augment-only:** outer grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, About spans 2), PanelShell chrome (accent chip + label + `p-4 rounded-md border bg-card`), drawer, header, intro strip, status bar — **byte-untouched**. No new dependencies beyond `recharts ^2.15.1` (already in package.json:51). No tooltips, no hover interactions on any chart element (D-04).
- **Augment points are INSIDE the three section bodies** (server components compose new children; D-06): `skills-section.tsx`, `experience-section.tsx`, `projects-section.tsx`. Chart sub-components are new files under `src/components/explore/sections/`; the pure data-shaping module lives at `src/components/explore/viz-data.ts` (D-05). Components never parse strings inline.
- **Verified environment facts this contract relies on:**
  - `--chart-1…5` are defined once at `:root` (globals.css:37-41) and **never overridden by any theme block** — the same five hues render in dark and light explore themes. `--chart-1` blue `220 70% 50%`, `--chart-2` green `160 60% 45%`, `--chart-3` orange `30 80% 55%`, `--chart-4` purple `280 65% 60%`, `--chart-5` pink `340 75% 55%`.
  - Explore themes are exactly two: `.explore-shell` dark (default) and `.light .explore-shell`. Panels sit on `--card` (dark `220 12% 12%`, light `0 0% 100%`).
  - JetBrains Mono is scoped to `.explore-shell` via `--font-jetbrains` (globals.css:502) — all chart text **inherits it automatically**; no explicit font-family needed anywhere.
  - The phase-1 reduced-motion guard (globals.css:573-586) already kills all CSS animation/transition inside `.explore-shell` — the CSS Gantt inherits suppression with zero new CSS. Only recharts needs the matchMedia-once pattern.
  - Main scroll container padding: `p-4 md:p-6` (explore-shell.tsx:50). Panel body inner width: **≈311px at 375px viewport** (375 − 32 shell − 32 panel padding) — this is the binding constraint.

---

## §1 — Augment order inside each panel (exact insertion points)

**Skills panel body** (`SkillsSection`, space-y-3 root):

```
┌ PanelShell "Skills" (unchanged) ──────────────┐
│ ① SkillsChart        ← NEW, first child      │
│ ② group "Soft Skills" + chips   (unchanged)   │
│ ③ group "Languages" + chips     (unchanged)   │
│ ④ group "Testing" + chips       (unchanged)   │
│ ⑤ group "Infrastructure" + chips (unchanged)  │
│ ⑥ group "Innovation" + chips    (unchanged)   │
│ ⑦ group "Languages" + chips     (unchanged)   │
│ ⑧ TerminalPointer "skills"      (unchanged)   │
└───────────────────────────────────────────────┘
```

Chart is the **first child** of the existing root div. The root's `space-y-3` already yields a 12px chart→first-group gap — **add no extra margin** (keeps one uniform rhythm). Group headers and chips stay byte-identical. If `groups.length === 0` the section returns `null` as today — chart included, nothing renders.

**Experience panel body** (`ExperienceSection`, plain div root):

```
┌ PanelShell "Experience" (unchanged) ──────────┐
│ ① CareerSpanChart    ← NEW, mb-5             │
│ ② <ol> 3-role text timeline    (unchanged)    │
│ ③ TerminalPointer "experience --all" (unchanged)│
└───────────────────────────────────────────────┘
```

Chart wrapper carries `mb-5` (matches the ol's internal `space-y-5` rhythm; the ol itself is untouched). Existing graceful-hide preserved: `experience.slice(0,3)` logic, caps, and `return null` on empty list stay exactly as-is — the chart renders above them and hides with the section.

**Projects panel body** (`ProjectsSection`, space-y-2 root):

```
┌ PanelShell "Projects" (unchanged) ────────────┐
│ ① StatTiles (grid-cols-3) ← NEW, first child, │
│    wrapper mb-3                               │
│ ② 6 project cards               (unchanged)   │
│ ③ TerminalPointer "projects --all" (unchanged)│
└───────────────────────────────────────────────┘
```

Tiles are the first child (receives no `space-y-2` top margin); wrapper `mb-3` gives a 12px tiles→cards gap versus the 8px card-card rhythm — intentional emphasis of the summary row.

---

## §2 — Skills chart (recharts horizontal BarChart)

**Element:** `src/components/explore/sections/skills-chart.tsx`, `"use client"`, `ResponsiveContainer`. Data arrives as a ready-made array from `viz-data.ts` (`[{ label, count }]`, 6 entries, JSON group order) — the component performs **zero** data shaping.

**Data contract (verified against portfolio-main-data.json):**

| Order | viz-data label | JSON path | count |
|---|---|---|---|
| 1 | Soft Skills | `skills.soft_skills` | 6 |
| 2 | Languages | `skills.hard_skills.Languages` | 9 |
| 3 | Testing | `skills.hard_skills.Testing` | 6 |
| 4 | Infrastructure | `skills.hard_skills.Infrastructure` | 6 |
| 5 | Innovation | `skills.hard_skills.Innovation` | 7 |
| 6 | Spoken Languages | `skills.languages` | 2 |

**Layout & anatomy:**

- `<BarChart layout="vertical" data={…} margin={{ top: 4, right: 20, bottom: 0, left: 0 }}>`
- `<ResponsiveContainer width="100%" height={192}>` — **fixed height**, 6 category rows do not vary with width; parent reserves the box, so SSG shell → hydration causes **no layout shift**.
- `XAxis type="number" hide` — the numeric axis is fully hidden; values are printed on bars instead (D-04 static print).
- `YAxis type="category" dataKey="label" width={104} axisLine={false} tickLine={false}` with tick `fontSize={10}` `fill="hsl(var(--muted-foreground))"`. Width 104px is sized for the longest label ("Spoken Languages", 16 chars ≈ 96px at 10px JetBrains Mono) — labels never truncate.
- `<Bar dataKey="count" barSize={12} radius={[0, 2, 2, 0]}>` with one `<Cell>` per row; `<LabelList dataKey="count" position="right" fontSize={10} fill="hsl(var(--foreground))">`. LabelList is a **permanent printed label, not a tooltip** — this is the D-04 mechanism. All six counts are single-digit; 20px right margin guarantees the label never clips at panel edge.
- No `CartesianGrid` — gridlines would add noise against the chips below; the axis-free print keeps the terminal minimalism.

**Bar color mapping (discretion exercised — planner may assume):** rows 1–5 map to `chart-1…5` in table order (fill `"hsl(var(--chart-N))"`); row 6 (Spoken Languages) maps to **`muted-foreground`**, not a sixth hue. Rationale: the only unused in-shell hue (`accent 160 84% 45%`) is hue-adjacent to chart-2's green and would falsely pair the two "Languages" rows; gray reads honestly as the minor spoken-languages group and is a design token, satisfying the "chart-token colors" acceptance. All five chart-1..5 tokens appear in the chart.

**Visual order contract:** chart rows read **top→bottom in JSON group order** (Soft Skills top … Spoken Languages bottom) — same order as the chips below, so eye travel between chart and chips is order-consistent. recharts' vertical-layout band axis defaults to first-item-at-bottom; the executor must make the rendered order match this contract (likely `reversed` on YAxis — verify against rendered output; do not silently accept reversed order).

**Legibility (both themes verified by token math):** fills are mid-lightness HSLs (45–60%) on card `12%` L (dark) and `100%` L (light) — every fill clears 3:1 non-text contrast in both themes; tick labels (`muted-foreground`: 60% L on dark card, 40% L on white) and value labels (`foreground`) clear 4.5:1. No per-theme color switching is needed or permitted — tokens do the work.

---

## §3 — Career-span Gantt (pure CSS, server component)

**Element:** `src/components/explore/sections/career-span-chart.tsx` — **no client directive, no hooks, no recharts** (approved D-02 deviation). Geometry comes precomputed from `viz-data.ts` as percentages; the component is a dumb renderer.

**Axis contract:**

- Domain: `axisStart` = min parsed start across all 7 roles (**March 2017**, WashPark) → `axisEnd` = build-time "Present" (module-evaluation `new Date()` during SSG — fixed in the exported HTML; recomputes only on rebuild, per D-02).
- Unit of measure: **months** (duration strings carry no day precision). `left% = (start − axisStart) / totalMonths × 100`, `width% = span / totalMonths × 100`.
- Year ticks: one tick at `0%` labelled with the axis-start year ("2017"), then one tick at each January of every subsequent year through the axis-end year, absolutely positioned by the same percentage math. No right-edge tick (the final January already names the end year). The 3-month fuzz of labelling position 0 as "2017" when the axis truly starts at March is accepted Gantt convention.
- Tick labels: `fontSize 10`, `text-muted-foreground tabular-nums`, positioned `translateX(-50%)` at each percentage. At 375px the track is ≈311px → ≈34px between year ticks vs ≈24px label width — fits without thinning. No breakpoint-specific tick thinning.

**Row anatomy (7 rows, JSON order — top = most recent):**

```
┌──────────────────────────────────────────────┐
│ 2017   2018   2019   2020   2021 …   2026    │ ← axis header, border-b
├──────────────────────────────────────────────┤
│ Senior Software Engineer in Test   Sept 2023 — Present │
│ Chubb                                                  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ Software Engineer in Test          Sept 2022 — Aug 2023 │
│ Upstream Systems                                       │
│        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                                 │
│ … (7 rows)                                             │
└────────────────────────────────────────────┘
```

Per row (top→bottom):
1. **Header line** — `flex justify-between gap-2`: role title left (`text-xs font-medium text-foreground`, wraps fully, never clipped — §3 phase-2 contract) + duration right (`text-[10px] text-muted-foreground tabular-nums shrink-0`). Duration renders **verbatim as stored** ("Sept 2023 — Present" keeps its em-dash; "November 2017 - April 2018" keeps its hyphen) — the parser normalizes dash styles only for geometry, never for display (phase-2 data-fidelity pin).
2. **Company line** — `text-[10px] text-muted-foreground`, wraps (longest: "Mini Market at University Campus of AUTH" — must wrap, not truncate).
3. **Track line** — `relative h-2 w-full rounded-full bg-muted` (full-span track communicates the axis range per row) with the bar absolutely positioned inside: `absolute inset-y-0 rounded-full` + computed `left%/width%`, `min-width: 2px`.

**Bar color mapping (discretion exercised — planner may assume):** roles carry semantic color from existing JSON data — `isTechRelated === true` (Chubb, Upstream, Netcompany-Intrasoft, Smartup PCC) → `bg-chart-2`; `false` (Sweet Corner, Storekeeper, WashPark) → `bg-muted-foreground`. Rationale: chart-2 is already the timeline-dot color in the text timeline below (`experience-section.tsx:47`), so tech spans visually continue the dots; the three non-tech roles de-emphasize to gray, telling the true story (early non-tech jobs vs the tech career) without inventing a legend. No color legend is rendered — the two-tone pattern is self-evident with the text timeline beneath.

**Vertical rhythm:** `space-y-3` between rows; axis header `mb-2` with `border-b border-border`; total Gantt height ≈ 400px at any width (rows grow taller only if titles wrap — accepted).

**No vertical gridlines:** hairlines crossing wrapped role text would be noise; the per-row full-span `bg-muted` track plus the top year axis carry the grid duty. This resolves the "grid line subtlety" discretion item.

---

## §4 — Project stat tiles

**Element:** `src/components/explore/sections/project-stat-tiles.tsx` — server component, pure CSS, values received as props from `viz-data.ts`.

**Layout:** `grid grid-cols-3 gap-2`, never collapsing to stacked (values are tiny; 3-up holds at 311px). Tile anatomy mirrors the project cards for family resemblance: `rounded-md border border-border p-2.5`, no extra background (transparent over panel card). Internal:

- **Value** — `text-sm font-medium text-foreground tabular-nums leading-none`, single line.
- **Label** — `mt-1 text-[10px] uppercase tracking-wider text-muted-foreground`, single line, may wrap at 375px.

**Tiles (left→right, values computed by `viz-data.ts` from current JSON):**

| # | Value | Label | Derivation |
|---|---|---|---|
| 1 | `14` | Projects | `projects.length` |
| 2 | `2016–2026` | Active Years | min/max parsed 4-digit years across `projects[].date` (en-dash; range form chosen over a bare "10" — a number invites "10 what?"; planner may shorten label wording, not the derivation) |
| 3 | `14` | Linked | count of entries with a truthy `link` — see §10 U-1 |

"Ongoing" (Portfolio Website) contains no year → excluded from min/max. Since 2026 is already the max from dated entries, this exclusion is invisible today but keeps the tile decoupled from build time.

---

## §5 — Interaction states (complete matrix)

Charts are static content in non-interactive panels (phase-2 UI-SPEC §17.6 precedent). Full matrix so the planner/executor never guesses:

| Control | Default | Hover | Active/pressed | Focus | Disabled | Loading | Error |
|---|---|---|---|---|---|---|---|
| Skills bars + labels | rendered, static | none — no cursor change, no pointer-events | none | not focusable | n/a | none — full SVG at hydration | none — SVG is client-rendered; empty shell until JS (accepted, §7) |
| Gantt bars | rendered, static | none | none | not focusable | n/a | none — pure CSS, present in static HTML | n/a |
| Axis tick labels | static text | none | none | not focusable | n/a | none | n/a |
| Stat tiles | static | none | none | not focusable | n/a | none | n/a |
| Project cards below | **unchanged** | name+arrow → accent (existing group-hover) | existing | existing ring (links only) | n/a | none | n/a |
| Panel chrome / grid / drawer / header / status bar | **unchanged** | unchanged | unchanged | unchanged | unchanged | unchanged | unchanged |

No new cursor, hover, transition, or focus style may be introduced on any chart element. The chips' existing `pointer-events-none font-normal` overrides are untouched.

---

## §6 — Visual behaviour: motion, themes, hydration

- **recharts entry animation:** recharts default grow animation runs on non-reduced-motion clients. `isAnimationActive={false}` is applied via the explore-intro matchMedia-once pattern (one-shot mount effect, D-06 mechanism) — component state defaults `false→` animation on, flips before paint matters because the static SVG shell is already complete.
- **Known artifact (accepted):** recharts re-mounts on hydration → bars re-grow once after the static shell paints. Accepted for non-reduce users; under reduce the pattern disables animation so no re-grow occurs. **Planner-assumable fallback:** if the re-grow reads as a glitch in review, hardcode `isAnimationActive={false}` unconditionally (acceptance only constrains reduced motion, and D-06's mechanism remains trivially satisfied). Do not add custom easing/duration configs.
- **CSS Gantt & tiles:** **no entry animation defined at all** — nothing to suppress; the globals.css reduced-motion guard covers them for free (and must not be edited).
- **Theme behaviour:** zero theme-conditional classes. All colors are semantic tokens (`chart-N`, `muted-foreground`, `foreground`, `border`, `card`, `muted`) which flip correctly between `.explore-shell` and `.light .explore-shell`; chart-1..5 are theme-invariant by design (§0). Legibility is guaranteed by token math (§2), not by dark:/light: variants.
- **Empty/error states:** no fallback copy, no skeletons, no "no data" messages anywhere — graceful-hide governs (§1, §10). This matches D-06/EXPLORE-07: real data, zero filler.
- **Scroll/overflow:** charts never introduce horizontal scroll at any width. recharts scales via ResponsiveContainer; Gantt is percentage-based; tiles are a fixed 3-col grid. `overflow-x-hidden` on the shell remains the last-line guard, not the mechanism.

---

## §7 — Responsive behaviour

| Breakpoint | Grid | Panel body width (approx) | Chart behaviour |
|---|---|---|---|
| < 768px (binding: 375px) | 1 col | 311px @375 | Skills: ResponsiveContainer fills width, fixed 192px height; bar lengths compress, printed labels unchanged. Gantt: % geometry, year ticks ≈34px apart — fits. Tiles: 3-up, labels may wrap. **No horizontal scroll, no overflow, no clipping.** |
| ≥ 768px (md, 2-col) | 2 col | ≈340px | Identical anatomy; nothing breakpoint-specific. |
| ≥ 1024px (lg, 3-col) | 3 col | ≈314px | Identical anatomy. |

Single fluid anatomy across all breakpoints is the contract — **no** responsive variant of any chart, no hidden elements at any width, no max-width capping inside panels.

---

## §8 — Accessibility

- **Skills chart:** wrapper carries `role="img"` + `aria-label` summarizing all values (e.g. "Technologies per category: Soft Skills 6, Languages 9, Testing 6, Infrastructure 6, Innovation 7, Spoken Languages 2"). The recharts SVG internals stay un-navigable; the chips below remain the full AT-consumable source, so nothing is lost.
- **Gantt:** row text (title / company / duration) is **real DOM text** — the screen-reader experience is a natural 7-item role+duration list, strictly better than a graphic; no ARIA duplication of row content. Bars, tracks, and gridline-free axis decorations that carry no text are `aria-hidden="true"`. Year tick labels are real text (meaningful) and stay readable.
- **Tiles:** plain text; values+labels read as pairs in DOM order. `tabular-nums` for stable reading.
- **Reduced motion:** covered (§6) — recharts animations off, CSS motion nonexistent.
- **No keyboard targets added:** charts add zero focusable elements; tab order of each panel is unchanged.

---

## §9 — Data-derived value audit (EXPLORE-07)

Every rendered number/position MUST trace to `portfolio-main-data.json` through `viz-data.ts`. Grep-proof rules:

- Skills counts = `groups.map(g => g.items.length)` — the same groups array SkillsSection already builds (single source of truth; viz-data may export a `skillsGroupCounts(skills)` that reuses that grouping logic — no parallel grouping implementation).
- Gantt geometry = parsed from the 7 `duration` strings; axis start/end derived; no literal "2017" anywhere in components (the tick label comes from `axisStart.year`).
- Tile values = computed; **zero numeric literals** in the three chart components (a `0` used as a margin or min-width constant is CSS chrome, not a rendered stat — allowed).
- Unit tests for `parseDuration()` (both dash styles + "Sept" abbreviation + "Present"), `skillsGroupCounts()` (exact 6/9/6/6/7/2 from the fixture), `projectStats()` (14 / 2016–2026 / 14, "Ongoing" exclusion) live beside the module per D-05.

---

## §10 — Edge coverage & open items

| # | Edge | Behaviour |
|---|---|---|
| E-1 | Role with unparseable `duration` | Row renders with verbatim text; **bar omitted** (geometry unknown — never invented). Axis unaffected. |
| E-2 | ALL durations unparseable | Whole Gantt block hides (graceful-hide); text timeline below remains. |
| E-3 | `Present` end | Bar extends to 100% (axis end), fixed at build. |
| E-4 | Parsed end beyond build time (bad data) | Clamp bar to axis end. |
| E-5 | Degenerate span (start == end month) | `min-width: 2px` keeps the bar visible. |
| E-6 | Non-overlapping-but-unsorted JSON order (Sweet Corner May–Jun 2018 sits below Smartup Nov 2017–Apr 2018) | **Render in JSON order, no sorting** (CONTEXT pin). The visual step-down is honest to the data. |
| E-7 | Empty skills group | Skipped by existing logic — chart lists only contentful groups; counts always match rendered chips. |
| E-8 | Project date without a year ("Ongoing") | Excluded from min/max (§4). |
| E-9 | No project date parses | Active-Years tile renders value `—` (keeps the 3-col grid intact). |
| E-10 | Empty experience / projects arrays | Sections return `null` as today — chart blocks hide with them. |
| E-11 | Extreme narrowness (< 320px) | Same fluid anatomy; ResponsiveContainer and % geometry degrade gracefully; no overflow. |
| E-12 | recharts JS failure / no-JS | Empty 192px shell in the skills panel (height reserved, no shift); Gantt and tiles unaffected (pure HTML). |

**UNRESOLVED (planner assumes the stated default):**

- **U-1 — Linked-projects literal:** SPEC acceptance pins "linked-project count (9)", but the current JSON has **all 14 projects carrying a `link`**, so D-03's rule ("entries with a link") yields **14**. Default: render the **computed** value (14 today) — never hardcode 9; flag the stale SPEC literal in the plan and let verification reconcile against EXPLORE-07. If the user intends a different definition (e.g. distinct hosts), that is a data-rule change for the user to make, not a UI change.

---

## §11 — Verification hooks (mapping contract → checks)

1. Skills chart renders exactly 6 bars; printed values equal the JSON group item-counts (6/9/6/6/7/2) — assertable in a unit/DOM test against `viz-data.ts` + rendered markup.
2. Chart rows visually ordered top→bottom as chips order (manual + code review pin on YAxis direction).
3. Gantt renders 7 rows in JSON order; Chubb bar right edge at 100%; WashPark bar left edge at 0%.
4. `npm run build` still emits `out/explore.html` containing the ResponsiveContainer shell; `/explore` remains SSG.
5. `grep` for hardcoded stats in the three components returns nothing (EXPLORE-07).
6. Reduced-motion: `isAnimationActive` wired through the matchMedia-once pattern; no new CSS animation anywhere.
7. 375px: no horizontal scroll with all three charts present (manual viewport check).
8. Both themes: manual check — fills/labels legible on `bg-card` in `.explore-shell` and `.light .explore-shell`.

---

*UI-SPEC gathered by gsd-ui-researcher from code inspection: explore-panels.tsx, panel-shell.tsx, explore-shell.tsx, the three section components, terminal-pointer.tsx, constants.ts, explore-intro.tsx, globals.css (tokens + reduced-motion guard), tailwind.config.ts (chart tokens), portfolio-main-data.json (all counts recomputed), package.json (recharts ^2.15.1).*