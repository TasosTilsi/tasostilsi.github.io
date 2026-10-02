All environment facts verified. Here is the **full UI-SPEC.md** (v2 — treemap contract added, prior valid sections carried forward):

---

# EXPLORE-03 explore-visuals — UI-SPEC (design contract)

**Status:** Ready for planning · **Binding before implementation** · Phase: 03-explore-visuals
**Version:** v2 — adds the D-08 skills Treemap (user correction: "better to have treemap not heatmap"); §0–§2, §4–§12 carry the prior D-01…D-07 contract forward unchanged except where a treemap row/edge/hook is appended.
**Inputs honored:** CONTEXT.md D-01…D-08 (locked), SPEC REQ EXPLORE-02 / 02d / 02b / 02c, phase-2 UI-SPEC precedents (graceful-hide, static panels, server components).
**Contract scope:** layout, interaction states, visual behaviour, edge coverage for the four visualizations ONLY. Everything not specified here is unchanged phase-2 behaviour.

---

## §0 — Locked frame (do not relitigate)

- **Augment-only:** outer grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, About spans 2), PanelShell chrome (accent chip + label + `p-4 rounded-md border bg-card`), drawer, header, intro strip, status bar — **byte-untouched**. No new dependencies beyond `recharts ^2.15.1` (already in package.json:51, ships `<Treemap>` in 2.x). No tooltips, no hover interactions on any chart element (D-04, D-08).
- **Augment points are INSIDE the three section bodies** (server components compose new children; D-06): `skills-section.tsx`, `experience-section.tsx`, `projects-section.tsx`. Chart sub-components are new files under `src/components/explore/sections/` (verified: none exist yet — clean slate); the pure data-shaping module lives at `src/components/explore/viz-data.ts` (D-05). Components never parse strings inline.
- **Verified environment facts this contract relies on:**
  - `--chart-1…5` are defined once at `:root` (globals.css:37-41); `--chart-2`/`--chart-3` gain a scoped light-theme override inside `.light .explore-shell` (§2, B-1 resolution) — dark values unchanged. The current `.light .explore-shell` block (globals.css:537-566) is chart-free; the overrides are added by this phase.
  - Explore themes are exactly two: `.explore-shell` dark (default) and `.light .explore-shell`. Panels sit on `--card` (dark `220 12% 12%`, light `0 0% 100%`).
  - JetBrains Mono is scoped to `.explore-shell` via `--font-jetbrains` (globals.css:502) — all chart text **inherits it automatically**; no explicit font-family needed anywhere (SVG `<text>` included).
  - The phase-1 reduced-motion guard (globals.css:573-586) already kills all CSS animation/transition inside `.explore-shell` — the CSS Gantt inherits suppression with zero new CSS. recharts components (`BarChart`, `Treemap`) carry `isAnimationActive={false}` unconditionally (§7, W-3 resolution) — no motion wiring needed at all.
  - Main scroll container padding: `p-4 md:p-6` (explore-shell.tsx:50). Panel body inner width: **≈311px at 375px viewport** (375 − 32 shell − 32 panel padding) — this is the binding constraint.
- **Verified data reality (drives §3's pinned thresholds):** matching every technology name from the skills JSON **whole-word, case-insensitively** against the joined `experience[].responsibilities` text (the corpus, zero-invented keywords per D-08) yields exactly **4 non-zero technologies / 5 total mentions**: `CI/CD = 2`, `Java = 1`, `MCP = 1`, `RAG = 1`; every other JSON name (32 of 36) has **0** mentions. The treemap is therefore **sparse by design** — this is the honest output of the locked matching rule, not a bug (see U-2). Consequences pinned in §3: minimum-mention threshold = 1 (anything ≥2 leaves a degenerate ≤1-cell treemap), and the treemap block hides gracefully if the data ever yields zero matches.

---

## §1 — Augment order inside each panel (exact insertion points)

**Skills panel body** (`SkillsSection`, space-y-3 root):

```
┌ PanelShell "Skills" (unchanged) ──────────────┐
│ ① SkillsChart        ← NEW, first child      │
│ ② SkillsTreemap      ← NEW (D-08), second    │
│ ③ group "Soft Skills" + chips   (unchanged)   │
│ ④ group "Languages" + chips     (unchanged)   │
│ ⑤ group "Testing" + chips       (unchanged)   │
│ ⑥ group "Infrastructure" + chips (unchanged)  │
│ ⑦ group "Innovation" + chips    (unchanged)   │
│ ⑧ group "Languages" + chips     (unchanged)   │
│ ⑨ TerminalPointer "skills"      (unchanged)   │
└───────────────────────────────────────────────┘
```

Both chart blocks are the first two children of the existing root div; the root's `space-y-3` already yields a uniform 12px gap between bar chart → treemap → first group — **add no extra margins** (one rhythm). Narrative order is deliberate: *summary by category (bar) → which technologies dominate actual work (treemap) → full inventory (chips)*. Group headers and chips stay byte-identical. If `groups.length === 0` the section returns `null` as today — both charts included, nothing renders.

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

## §2 — Skills bar chart (recharts horizontal BarChart) — carried forward unchanged

**Element:** `src/components/explore/sections/skills-chart.tsx`, `"use client"`, `ResponsiveContainer`. Data arrives as a ready-made array from `viz-data.ts` (`[{ label, count }]`, 6 entries, JSON group order) — the component performs **zero** data shaping.

**Data contract (verified against portfolio-main-data.json):**

| Order | viz-data label | JSON path | count |
|---|---|---|---|
| 1 | Soft Skills | `skills.soft_skills` | 6 |
| 2 | Languages | `skills.hard_skills.Languages` | 9 |
| 3 | Testing | `skills.hard_skills.Testing` | 6 |
| 4 | Infrastructure | `skills.hard_skills.Infrastructure` | 6 |
| 5 | Innovation | `skills.hard_skills.Innovation` | 7 |
| 6 | Languages | `skills.languages` | 2 |

**Layout & anatomy:**

- `<BarChart layout="vertical" data={…} margin={{ top: 4, right: 20, bottom: 0, left: 0 }}>`
- `<ResponsiveContainer width="100%" height={192}>` — **fixed height**, 6 category rows do not vary with width; parent reserves the box, so SSG shell → hydration causes **no layout shift**.
- `XAxis type="number" hide` — the numeric axis is fully hidden; values are printed on bars instead (D-04 static print).
- `YAxis type="category" dataKey="label" width={88} axisLine={false} tickLine={false}` with tick `fontSize={10}` `fill="hsl(var(--muted-foreground))"`. Width 88px is sized for the longest label ("Infrastructure", 14 chars ≈ 84px at 10px JetBrains Mono) — labels never truncate. Row labels reuse the **skills-section group builder labels verbatim** (W-1 resolution: chart == chips, zero invented copy; the two "Languages" rows disambiguate by position in JSON order, exactly as the existing chips already do).
- `<Bar dataKey="count" barSize={12} radius={[0, 2, 2, 0]}>` with one `<Cell>` per row; `<LabelList dataKey="count" position="right" fontSize={10} fill="hsl(var(--foreground))">`. LabelList is a **permanent printed label, not a tooltip** — this is the D-04 mechanism. All six counts are single-digit; 20px right margin guarantees the label never clips at panel edge.
- No `CartesianGrid` — gridlines would add noise against the chips below; the axis-free print keeps the terminal minimalism.

**Bar color mapping (discretion exercised — planner may assume):** rows 1–5 map to `chart-1…5` in table order (fill `"hsl(var(--chart-N))"`); row 6 (Languages) maps to **`muted-foreground`**, not a sixth hue. Rationale: the only unused in-shell hue (`accent 160 84% 45%`) is hue-adjacent to chart-2's green and would falsely pair the two "Languages" rows; gray reads honestly as the minor spoken-languages group (label = builder's "Languages") and is a design token, satisfying the "chart-token colors" acceptance. All five chart-1..5 tokens appear in the chart. **This category→token map is exported once from `viz-data.ts` and is the single source consumed by BOTH the bar chart and the treemap (§3) — no parallel mapping in any component.**

**Visual order contract:** chart rows read **top→bottom in JSON group order** (Soft Skills top … Languages bottom) — same order as the chips below, so eye travel between chart and chips is order-consistent. recharts' vertical-layout band axis defaults to first-item-at-bottom; the executor must make the rendered order match this contract (likely `reversed` on YAxis — verify against rendered output; do not silently accept reversed order).

**Legibility (both themes — pinned scoped override, user decision B-1):** dark theme: tokens as-is, minimum fill contrast 3.06:1 (chart-1) — passes. Light theme: `chart-2` (`160 60% 45%` = 2.53:1) and `chart-3` (`30 80% 55%` = 2.55:1) FAIL 3:1 against the white card — therefore `.light .explore-shell` gains scoped overrides **`--chart-2: 160 65% 32%` (4.49:1)** and **`--chart-3: 30 75% 38%` (4.75:1)** (hue-preserving, computed ≥3:1; user-confirmed). Every fill clears 3:1 non-text contrast in both themes AFTER the override; tick labels (`muted-foreground`) and value labels (`foreground`) clear 4.5:1. The phase-2 theme-invariance claim is deliberately superseded by this scoped decision: dark token values are untouched, the override lives only inside `.light .explore-shell` (drawer digits, 8px timeline dots, and the Gantt's chart-2 tech bars darken with it in light mode — decorative/aria-hidden, improved consistency, no regression). The verifier must recompute both light values against white before signing off.

---

## §3 — Skills treemap (recharts `<Treemap>`) — NEW (D-08)

**Element:** `src/components/explore/sections/skills-treemap.tsx`, `"use client"`, `ResponsiveContainer`. Rendered in the Skills panel **below the bar chart, above the chips** (§1). Data arrives fully shaped from `viz-data.ts` — the component performs zero string matching.

**Pinned anatomy:**

- `<ResponsiveContainer width="100%" height={120}>` — **fixed height 120px**, scales to panel width, never overflows (375px-safe by construction; §8).
- `<Treemap data={cells} dataKey="count" isAnimationActive={false} content={renderTreemapCell}>` — **flat data** (one entry per technology, **no `children`** → depth-1 cells only, **no nested group rendering**). Rationale: with 4 cells from 3 categories at current data, nested containers would spend area on near-empty group boxes; flat cells colored per category tell the story with zero waste.
- Cell data shape from `viz-data.ts`: `{ name: string; count: number; fill: string }` where `fill` is the category's token string (`hsl(var(--chart-N))` / `hsl(var(--muted-foreground))`) from the **shared §2 category→token map**. Current expected cells: `Java → chart-2`, `CI/CD → chart-4`, `MCP → chart-5`, `RAG → chart-5` (Innovation; chart-1 Soft Skills and chart-3 Testing contribute no cells today — honest, not a bug). A spoken-languages-like group (the §2 gray rationale) maps to `muted-foreground` and would contribute no cells today either. **Cell array ORDER = render order (W-1 pin):** squarify processes children in array order (Treemap.js:169-207), so cells are emitted in **flattened keyword-set order — JSON group order, ties by first occurrence** — matching the expected-cells list above exactly; no client-side sorting, no count-descending reorder.
- **Custom content = a typed pure render function** (server-safe fn inside the client component, per CONTEXT) receiving the node props (geometry + name + count + fill). It renders **SVG primitives only** (`<g><rect/><text/></g>`) — no HTML elements inside the SVG tree. **ROOT GUARD (B-1 resolution, verified against recharts Treemap.js:470-631):** the content fn is invoked for the synthetic depth-0 root node as well as every depth-1 cell — the root carries no `name`/`count`/`fill`. Therefore: **`content` returns `null` for any node with `depth === 0` (equivalently, missing `name`); every non-root invocation renders exactly one cell.** Without this guard the root call paints a full-area unstyled (black) rect under the cells.

**Cell rendering (pinned):**

- `<rect>`: `fill = node.fill` at **`fillOpacity 0.35`**, `stroke = node.fill` at full opacity, `strokeWidth 1` — the 1px full-strength stroke carries crisp category hue; the wash keeps the panel airy and the labels readable.
- **Label ladder (chrome constants — the delegated elision rule):** cell text renders in `hsl(var(--foreground))`, centered: **name** (`fontSize 11`) + **count** (`fontSize 9`, one line below) when the cell is ≥ 64×40px; **name only** when ≥ 44×16px (count dropped first); **no label** below that (area still rendered — area always communicates the count). At current data the smallest cell is ≈86×86px — every cell shows name+count and the ladder is a no-op; it exists for future data growth. "Name at minimum on small cells" is satisfied: identity is never lost as long as the cell is at least 44px wide. **Overflow guard (W-5 pin):** SVG `<text>` never wraps — a label whose rendered width (≈6.6px/char at 11px JetBrains Mono) exceeds the cell width − 8px drops to the next ladder step before rendering; if even the name overflows at ≥44px, the name is **clipped via a per-cell `clipPath`** (never bleeds onto neighbors). At current data this guard is a no-op.
- **Text contrast by construction (why the wash):** solid token fills fail 4.5:1 for in-cell text in at least one theme per token (e.g. white-on-chart-2-dark = 2.35:1, white-on-chart-4-dark = 4.03:1; light chart-2 override needs white while dark chart-2 needs dark — an adaptive text color would need a fragile luminance threshold across 10 combinations). The 0.35 wash keeps the effective background near the card: `foreground` text on the blend computes to **≥ 6:1 in both themes** (dark: ≈9.2:1 over the chart-2 blend, ≈6.2:1 over the lightest chart-3 blend; light: ≈9.9:1, worst case chart-4 blend ≈11.2:1). The verifier recomputes against the final constants. Category identity never relies on hue alone (name always printed when the cell can carry it); the full-strength stroke supplies the hue edge.
- `pointerEvents: none` on the cell group — no cursor change, no hover state, ever (D-04/D-08: no tooltips).

**Honesty caption (discretion exercised — planner may assume):** one line above the treemap, `text-[10px] text-muted-foreground`, reading **"Mentions in role responsibilities"** — the D-08 framing ("named mentions in role descriptions, not effort hours") printed as chrome so a sparse treemap is not mistaken for a bug. This is a chrome label under the established group-header precedent (phase-2 §17.4 W-5: structural chrome labels allowed); the planner may reword but must keep the tokens "mentions" and "responsibilities". `mb-1.5` before the container.

**Matching rule (restated from D-08 for the executor):** keyword set = the skills JSON's own technology names, flattened from the same groups the chips render (`soft_skills` + `Object.values(hard_skills).flat()` + `languages`) — **zero hand-written keywords**. Matching is whole-word, case-insensitive, per occurrence: leading word boundary always; trailing boundary only when the name ends with a word character (so `C++` matches with escaped special chars but no bogus trailing `\b`; `Java` must NOT match inside `Javascript`; `JS` must not match inside `Javascript`; the phrase `AI Agents` must not match `AI agent skills` — singular vs plural differs). Multi-word names match as literal phrases. Count = total occurrence events across the corpus (a name appearing twice in one bullet counts twice).

---

## §4 — Career-span Gantt (pure CSS, server component) — carried forward unchanged

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

1. **Header line** — `flex justify-between gap-2`: role title left (`text-xs font-medium text-foreground`, wraps fully, never clipped — phase-2 §3 contract) + duration right (`text-[10px] text-muted-foreground tabular-nums shrink-0`). Duration renders **verbatim as stored** ("Sept 2023 — Present" keeps its em-dash; "November 2017 - April 2018" keeps its hyphen) — the parser normalizes dash styles only for geometry, never for display (phase-2 data-fidelity pin).
2. **Company line** — `text-[10px] text-muted-foreground`, wraps (longest: "Mini Market at University Campus of AUTH" — must wrap, not truncate).
3. **Track line** — `relative h-2 w-full rounded-full bg-muted` (full-span track communicates the axis range per row) with the bar absolutely positioned inside: `absolute inset-y-0 rounded-full` + computed `left%/width%`, `min-width: 2px`.

**Bar color mapping (discretion exercised — planner may assume):** roles carry semantic color from existing JSON data — `isTechRelated === true` (Chubb, Upstream, Netcompany-Intrasoft, Smartup PCC) → `bg-chart-2`; `false` (Sweet Corner, Mini Market at University Campus of AUTH, WashPark) → `bg-muted-foreground`. Rationale: chart-2 is already the timeline-dot color in the text timeline below (`experience-section.tsx:47`), so tech spans visually continue the dots; the three non-tech roles de-emphasize to gray, telling the true story (early non-tech jobs vs the tech career) without inventing a legend. No color legend is rendered — the two-tone pattern is self-evident with the text timeline beneath. (In light mode the §2 scoped chart-2 override darkens these bars — improved contrast, no regression.)

**Vertical rhythm:** `space-y-3` between rows; axis header `mb-2` with `border-b border-border`; total Gantt height ≈ 400px at any width (rows grow taller only if titles wrap — accepted).

**No vertical gridlines:** hairlines crossing wrapped role text would be noise; the per-row full-span `bg-muted` track plus the top year axis carry the grid duty. This resolves the "grid line subtlety" discretion item.

---

## §5 — Project stat tiles — carried forward unchanged

**Element:** `src/components/explore/sections/project-stat-tiles.tsx` — server component, pure CSS, values received as props from `viz-data.ts`.

**Layout:** `grid grid-cols-3 gap-2`, never collapsing to stacked (values are tiny; 3-up holds at 311px). Tile anatomy mirrors the project cards for family resemblance: `rounded-md border border-border p-2.5`, no extra background (transparent over panel card). Internal:

- **Value** — `text-sm font-medium text-foreground tabular-nums leading-none`, single line.
- **Label** — `mt-1 text-[10px] uppercase tracking-wider text-muted-foreground`, single line, may wrap at 375px.

**Tiles (left→right, values computed by `viz-data.ts` from current JSON):**

| # | Value | Label | Derivation |
|---|---|---|---|
| 1 | `14` | Projects | `projects.length` |
| 2 | `2016–2026` | Active Years | min/max parsed 4-digit years across `projects[].date` (en-dash; range form chosen over a bare "10" — a number invites "10 what?"; planner may shorten label wording, not the derivation) |
| 3 | `14` | Linked | count of entries with a truthy `link` — see §11 U-1 |

"Ongoing" (Portfolio Website) contains no year → excluded from min/max. Since 2026 is already the max from dated entries, this exclusion is invisible today but keeps the tile decoupled from build time.

---

## §6 — Interaction states (complete matrix)

Charts are static content in non-interactive panels (phase-2 UI-SPEC §17.6 precedent). Full matrix so the planner/executor never guesses:

| Control | Default | Hover | Active/pressed | Focus | Disabled | Loading | Error |
|---|---|---|---|---|---|---|---|
| Skills bars + labels | rendered, static | none — no cursor change, no pointer-events | none | not focusable | n/a | none — full SVG at hydration | none — SVG is client-rendered; empty shell until JS (accepted, §7) |
| Treemap cells + labels + caption | rendered, static | none — `pointerEvents: none`, no handlers, no cursor | none | not focusable | n/a | none — full SVG at hydration | none — zero-match data hides the block (graceful-hide, §11 E-13); empty shell only in the no-JS case |
| Gantt bars | rendered, static | none | none | not focusable | n/a | none — pure CSS, present in static HTML | n/a |
| Axis tick labels | static text | none | none | not focusable | n/a | none | n/a |
| Stat tiles | static | none | none | not focusable | n/a | none | n/a |
| Project cards below | **unchanged** | name+arrow → accent (existing group-hover) | existing | existing ring (links only) | n/a | none | n/a |
| Panel chrome / grid / drawer / header / status bar | **unchanged** | unchanged | unchanged | unchanged | unchanged | unchanged | unchanged |

No new cursor, hover, transition, or focus style may be introduced on any chart element — including treemap cells (no `onClick`/`onMouseEnter` props passed to `<Treemap>` or its content). The chips' existing `pointer-events-none font-normal` overrides are untouched.

---

## §7 — Visual behaviour: motion, themes, hydration

- **recharts entry animation: NONE (W-3 resolution — pinned unconditional):** every recharts component — `<BarChart>` internals AND `<Treemap>` — sets `isAnimationActive={false}` **unconditionally** — no matchMedia wiring, no mount-effect race. Bars and cells render complete on hydration; there is no re-grow artifact at all. (Supersedes the D-06 matchMedia mechanism for recharts; the CSS reduced-motion guard continues to cover the shell's own CSS animations.)
- **CSS Gantt & tiles:** **no entry animation defined at all** — nothing to suppress; the globals.css reduced-motion guard covers them for free (and must not be edited).
- **Theme behaviour:** all colors are semantic tokens (`chart-N`, `muted-foreground`, `foreground`, `border`, `card`, `muted`) which flip correctly between `.explore-shell` and `.light .explore-shell`. **One deliberate exception (B-1 resolution, user-confirmed):** `.light .explore-shell` carries scoped overrides for `--chart-2`/`--chart-3` (§2) so light-theme fills clear 3:1 — dark values untouched. Treemap cell text (foreground on ≥35% wash, §3) clears 4.5:1 in both themes by computation (≥6:1) with no adaptive logic. Legibility is by token math + the pinned override, not by dark:/light: classes.
- **Empty/error states:** no fallback copy, no skeletons, no "no data" messages anywhere — graceful-hide governs (§1, §11). This matches D-06/EXPLORE-07: real data, zero filler.
- **Scroll/overflow:** charts never introduce horizontal scroll at any width. recharts scales via ResponsiveContainer (fixed heights reserve their boxes); Gantt is percentage-based; tiles are a fixed 3-col grid. `overflow-x-hidden` on the shell remains the last-line guard, not the mechanism.

---

## §8 — Responsive behaviour

| Breakpoint | Grid | Panel body width (approx) | Chart behaviour |
|---|---|---|---|
| < 768px (binding: 375px) | 1 col | 311px @375 | Skills: bar ResponsiveContainer fills width at fixed 192px height; treemap ResponsiveContainer fills width at fixed 120px height, squarified cells re-layout to the narrower box, label ladder guards any cell that shrinks (§3). Gantt: % geometry, year ticks ≈34px apart — fits. Tiles: 3-up, labels may wrap. **No horizontal scroll, no overflow, no clipping.** |
| ≥ 768px (md, 2-col) | 2 col | ≈340px | Identical anatomy; nothing breakpoint-specific. |
| ≥ 1024px (lg, 3-col) | 3 col | ≈314px | Identical anatomy. |

Single fluid anatomy across all breakpoints is the contract — **no** responsive variant of any chart, no hidden elements at any width, no max-width capping inside panels.

---

## §9 — Accessibility

- **Skills bar chart:** wrapper carries `role="img"` + `aria-label` summarizing all values — the label is **composed at render time from the viz-data array** (W-2 resolution: zero numeric literals in the component; the illustrative example below is NOT copy-pasteable source: "…Soft Skills 6, Languages 9, Testing 6…"). The recharts SVG internals stay un-navigable; the chips below remain the full AT-consumable source, so nothing is lost.
- **Treemap:** wrapper carries `role="img"` + an `aria-label` **composed at render time from the cell array** (illustrative only, never literal: "Technology mentions across role responsibilities. CI/CD 2, Java 1, MCP 1, RAG 1."). Since the treemap is the only surface printing mention counts, the label must enumerate every cell's name+count — AT users lose nothing. The SVG internals (rects + labels) stay un-navigable under `role="img"`. The caption is real text and readable.
- **Gantt:** row text (title / company / duration) is **real DOM text** — the screen-reader experience is a natural 7-item role+duration list, strictly better than a graphic; no ARIA duplication of row content. Bars, tracks, and gridline-free axis decorations that carry no text are `aria-hidden="true"`. Year tick labels are real text (meaningful) and stay readable.
- **Tiles:** plain text; values+labels read as pairs in DOM order. `tabular-nums` for stable reading.
- **Reduced motion:** covered (§7) — recharts animations off (including `<Treemap>`), CSS motion nonexistent.
- **No keyboard targets added:** charts add zero focusable elements; tab order of each panel is unchanged.

---

## §10 — Data-derived value audit (EXPLORE-07)

Every rendered number/position MUST trace to `portfolio-main-data.json` through `viz-data.ts`. Grep-proof rules:

- Skills counts = `groups.map(g => g.items.length)` — the same groups array SkillsSection already builds (single source of truth; viz-data's `skillsGroupCounts(skills)` reuses that grouping logic — no parallel grouping implementation).
- **Treemap cells = `techMentions(responsibilities, skills)`** in `viz-data.ts`: flattens the skills JSON's technology names into the keyword set (zero hand-written entries), joins the 7 roles' `responsibilities[]` into the corpus (**corpus boundary: experience responsibilities ONLY** — never education courses, certifications, projects descriptions, or meta.keywords), counts whole-word case-insensitive occurrences, filters to `count >= 1`, attaches each cell's `fill` from the **shared §2 category→token map**. Components receive finished cells.
- Gantt geometry = parsed from the 7 `duration` strings; axis start/end derived; no literal "2017" anywhere in components (the tick label comes from `axisStart.year`).
- Tile values = computed; **zero numeric literals** in the four chart components (a `0` used as a margin or min-width constant is CSS chrome, not a rendered stat — allowed).
- Unit tests beside the module per D-05: `parseDuration()` (both dash styles + "Sept" abbreviation + "Present"), `skillsGroupCounts()` (exact 6/9/6/6/7/2 from the fixture), `projectStats()` (14 / 2016–2026 / 14, "Ongoing" exclusion), **`techMentions()`** (exact `{CI/CD: 2, Java: 1, MCP: 1, RAG: 1}` from the fixture corpus; boundary cases: `Javascript` matches neither `Java` nor `JS`; `AI agent skills` does not match `AI Agents`; `C++`-style special-char names escape and match cleanly; a name repeated within one bullet counts each occurrence).

---

## §11 — Edge coverage & open items

| # | Edge | Behaviour |
|---|---|---|
| E-1 | Role with unparseable `duration` | Row renders with verbatim text; **track renders, only the bar is omitted** (geometry unknown — never invented). Axis unaffected. (W-4 pin — never triggers with current data: all 7 durations verified parseable.) |
| E-2 | ALL durations unparseable | Whole Gantt block hides (graceful-hide); text timeline below remains. |
| E-3 | `Present` end | Bar extends to 100% (axis end), fixed at build. |
| E-4 | Parsed end beyond build time (bad data) | Clamp bar to axis end. |
| E-5 | Degenerate span (start == end month) | `min-width: 2px` keeps the bar visible. |
| E-6 | Non-overlapping-but-unsorted JSON order (Sweet Corner May–Jun 2018 sits below Smartup Nov 2017–Apr 2018) | **Render in JSON order, no sorting** (CONTEXT pin). The visual step-down is honest to the data. |
| E-7 | Empty skills group | Skipped by existing logic — chart lists only contentful groups; counts always match rendered chips. |
| E-8 | Project date without a year ("Ongoing") | Excluded from min/max (§5). |
| E-9 | No project date parses | Active-Years tile renders value `—` (keeps the 3-col grid intact). |
| E-10 | Empty experience / projects arrays | Sections return `null` as today — chart blocks hide with them. |
| E-11 | Extreme narrowness (< 320px) | Same fluid anatomy; ResponsiveContainer and % geometry degrade gracefully; no overflow. |
| E-12 | recharts JS failure / no-JS | Empty 192px + (caption + 120px) shells in the skills panel (heights reserved, no shift); Gantt and tiles unaffected (pure HTML). |
| E-13 | **Zero technologies with ≥1 mention** (treemap) | Treemap block including caption hides entirely (graceful-hide); bar chart and chips unaffected. |
| E-14 | **Single-cell treemap result** | Renders as one full-area cell — honest, no artificial minimum. |
| E-15 | **Regex-special / multi-word names** ('C++', 'Embeddings & Semantic Search', 'NPM Module Dev') | Parser escapes special chars; trailing word boundary applied only when the name ends with a word char; multi-word names match as literal phrases; substring false-positives impossible (`Java` ≠ `Javascript`). |
| E-16 | **Cell too small for a label** (future data) | Elision ladder (§3): count dropped first, then name; area always rendered — the count's information never disappears while the cell exists. |
| E-17 | **Duplicate technology name across groups** (none today) | Counts aggregate per unique name string; color = the first group in JSON order that contains the name. Pinned for future-proofing. |

**UNRESOLVED (planner assumes the stated default):**

- **U-1 — Linked-projects literal:** SPEC acceptance pins "linked-project count (9)", but the current JSON has **all 14 projects carrying a `link`**, so D-03's rule ("entries with a link") yields **14**. Default: render the **computed** value (14 today) — never hardcode 9; flag the stale SPEC literal in the plan and let verification reconcile against EXPLORE-07. If the user intends a different definition (e.g. distinct hosts), that is a data-rule change for the user to make, not a UI change.
- **U-2 — Treemap sparseness:** the locked zero-invented-keyword rule over the responsibilities corpus yields exactly **4 cells / 5 mentions** (CI/CD 2, Java 1, MCP 1, RAG 1 — §0). Default: render the honest result; no keyword invention, no corpus widening, no "AI Agents" stemming (singular/plural differs — no match). If the user expected a fuller treemap, widening requires an explicit data-rule change (corpus scope or keyword set) from the user — not a UI-planner decision. The honesty caption (§3) makes the sparse result self-explanatory.

---

## §12 — Verification hooks (mapping contract → checks)

1. Skills bar chart renders exactly 6 bars; printed values equal the JSON group item-counts (6/9/6/6/7/2) — assertable in a unit/DOM test against `viz-data.ts` + rendered markup.
2. Bar chart rows visually ordered top→bottom as chips order (manual + code review pin on YAxis direction).
3. Treemap renders exactly the technologies with ≥1 whole-word mention (4 cells at current data: CI/CD, Java, MCP, RAG); the CI/CD cell's area is ≈2× any 1-mention cell (± squarify layout tolerance); cell labels print name+count in foreground on the token wash; `isAnimationActive={false}` present on `<Treemap>` too.
4. Gantt renders 7 rows in JSON order; Chubb bar right edge at 100%; WashPark bar left edge at 0%.
5. `npm run build` still emits `out/explore.html` containing the ResponsiveContainer shells; `/explore` remains SSG.
6. `grep` for hardcoded stats and hand-written keyword lists in the four chart components returns nothing (EXPLORE-07 + zero-invented-keyword pin — the matcher's keyword set imports from the skills JSON only).
7. Reduced-motion: `isAnimationActive={false}` unconditionally on every recharts component (bar + treemap; W-3 resolution — no timing race); no new CSS animation anywhere.
8. 375px: no horizontal scroll with all four charts present (manual viewport check).
9. Both themes: manual check — bar fills/labels, treemap cells/labels (≥6:1 text by computation, verifier recomputes), Gantt bars, tiles legible on `bg-card` in `.explore-shell` and `.light .explore-shell`; the pinned `--chart-2`/`--chart-3` light overrides present inside `.light .explore-shell` and absent from dark.

---

*UI-SPEC gathered by gsd-ui-researcher from code inspection: explore-panels.tsx, panel-shell.tsx, explore-shell.tsx, the three section components, terminal-pointer.tsx, constants.ts, explore-intro.tsx, globals.css (tokens + `.light .explore-shell` block + reduced-motion guard), tailwind.config.ts (chart tokens), portfolio-main-data.json (all counts recomputed, treemap mentions hand-computed per the D-08 matching rule), package.json (recharts ^2.15.1). v2 carries the prior contract forward and adds §3 (treemap) per D-08.*