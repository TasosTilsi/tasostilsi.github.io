All verifications complete. The duplicate-category path is confirmed: with `allowDuplicatedCategory: true` (YAxis default), recharts swaps the band domain to serial numbers — one band per row, duplicate "Languages" ticks both render. Every claim is now verified. Here is the full RESEARCH.md:

---

# RESEARCH.md — Phase 3: explore-visuals (EXPLORE-03)

**Gathered:** 2026-09-21 (session-verified against the working tree, installed node_modules, and a live Node experiment)
**Phase goal:** Add the visualizations — a skills chart, an experience timeline, and project stats — built with recharts from the existing portfolio data (EXPLORE-02).
**Inputs honored:** CONTEXT.md decisions D-01…D-07 treated as LOCKED; Claude's-discretion areas researched with recommendations; deferred ideas (tooltips, gamification, routing) ignored.

> **Primary planning input beyond CONTEXT.md:** `.planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md` (260 lines) already pins nearly all HOW-level detail (file names, element structure, colors, spacing, motion). Research below verifies those pins against the installed code and flags the two places where they interact with locked decisions and the existing test suite (§Risks OQ-1, OQ-2).

---

## 1. Domain analysis

### 1.1 Stack in play (all verified this session)

| Concern | Value | Evidence |
|---|---|---|
| Framework | Next `^15.5.10`, `output: 'export'` (SSG) | [VERIFIED: package.json:29 + next.config.ts:5] |
| React | `^18.3.1` (recharts peer range covers ^18) | [VERIFIED: package.json:44 + node_modules/recharts/package.json peerDependencies] |
| Charts | recharts `^2.15.1` declared, **2.15.4 installed/resolved**, currently imported only by `src/components/ui/chart.tsx` (shadcn wrapper, used nowhere in app code) | [VERIFIED: npm ls → `recharts@2.15.4`; grep src → chart.tsx:4 only] |
| Styling | Tailwind `^3.4.1`, `darkMode: ["class"]`, shadcn primitives | [VERIFIED: package.json:66 + tailwind.config.ts:4] |
| Tests | `node --test` (built-in, zero npm deps), files in `tests/*.test.mjs`; **no `test` npm script** | [VERIFIED: tests/explore-shell.test.mjs:4,13 + package.json scripts] |
| CI | `.github/workflows/deploy.yml` — Node 20, `npm install`, `npm run build`, uploads `./out`. **No typecheck or test step in CI** | [VERIFIED: deploy.yml:34-64] |
| Typecheck | `tsc --noEmit`; also implicit in `next build` (no `ignoreBuildErrors` set) | [VERIFIED: package.json:10 + next.config.ts:8-10] |

**Implication:** the real local gate is `npm run build` + `npm run typecheck` + `node --test tests/*.test.mjs`; CI only replays the build on push to `master`. Tests are a local-only gate (fine — they are not expected in CI).

### 1.2 The three visualizations and their locked mechanics

Per D-01…D-04, only the **skills chart uses recharts**. The Gantt is pure CSS (approved roadmap deviation) and the stat tiles are plain server-rendered divs.

**A. Skills chart — recharts horizontal BarChart (D-01)**

- Data: 6 groups in JSON group order (the exact order `skills-section.tsx:29-40` builds: `soft_skills` → `hard_skills` insertion order (Languages, Testing, Infrastructure, Innovation) → `languages`). Verified counts **6 / 9 / 6 / 6 / 7 / 2** (sum 36 = the "36 grouped chips" SPEC current-state) [VERIFIED: JSON lines 147-155 + skills-section.tsx:29-40 + programmatic count].
- The UI-SPEC pins the element: `src/components/explore/sections/skills-chart.tsx`, `"use client"`, ResponsiveContainer, zero data shaping (data arrives precomputed from the viz-data module) [VERIFIED: UI-SPEC §2/§1].
- Pinned chart anatomy [VERIFIED: UI-SPEC §2 lines 91-94 — APIs re-verified against installed types]: `XAxis type="number" hide`; `YAxis type="category" dataKey="label" width={88} axisLine={false} tickLine={false}` with tick `fontSize={10} fill="hsl(var(--muted-foreground))"`; `Bar dataKey="count" barSize={12} radius={[0,2,2,0]}` + one `Cell` per row; `LabelList dataKey="count" position="right" fontSize={10} fill="hsl(var(--foreground))"`; **no CartesianGrid**; ~20px right margin so printed values never clip.
- **Bar colors (discretion, resolved in UI-SPEC):** rows 1–5 → `chart-1…5` (`fill="hsl(var(--chart-N))"`); row 6 (spoken Languages) → `muted-foreground` gray — not a sixth hue [VERIFIED: UI-SPEC §2 line 96].
- **Visual order contract:** rows read top→bottom in JSON group order; recharts' vertical band axis puts the first datum at the bottom by default, so `reversed` on YAxis is expected — UI-SPEC explicitly requires verifying against rendered output, not assuming [VERIFIED: UI-SPEC §2 line 98; `reversed?: boolean` exists on YAxisProps — node_modules/recharts/types/cartesian/YAxis.d.ts].

**Duplicate-category pitfall — resolved by recharts default, verified in source.** Two groups are both labelled `Languages` (hard-skills 9, spoken 2). The pinned `YAxis dataKey="label"` therefore has duplicate category values. recharts handles this: when the derived category domain has duplicates **and** `allowDuplicatedCategory` is true (the YAxis default), the band domain is replaced by serial numbers `0…len-1`, giving one band per data row and rendering both "Languages" ticks [VERIFIED: node_modules/recharts/lib/cartesian/YAxis.js:74 `allowDuplicatedCategory: true` + lib/chart/generateCategoricalChart.js:327-333 — `if (allowDuplicatedCategory && duplicate) { duplicateDomain = domain; domain = range(0, len); }`]. No unique-id dataKey is required; the UI-SPEC's "disambiguate by position" claim holds. A render-level/export test should still pin 6 visible rows (see §5).

**B. Career-span Gantt — pure CSS (D-02)**

- Element pinned: `src/components/explore/sections/career-span-chart.tsx` — **no client directive, no hooks, no recharts**; a dumb renderer of percentages precomputed by viz-data [VERIFIED: UI-SPEC §3 line 106].
- Geometry: unit = months; `axisStart` = min parsed start across all 7 roles (March 2017, WashPark); `axisEnd` = build-time "Present" (`new Date()` at module evaluation during SSG — fixed in the exported HTML, recomputes only on rebuild, exactly per D-02) [VERIFIED: UI-SPEC §3 lines 110-111].
- `left% = (start − axisStart)/totalMonths × 100`, `width% = span/totalMonths × 100`; year ticks at each January positioned by the same math, 0-position labelled with the axis-start year; no right-edge tick [VERIFIED: UI-SPEC §3 lines 111-112].
- Structure pinned: row = role/company + duration text beside a full-span `bg-muted` track (`relative h-2 w-full rounded-full`) with an absolutely positioned bar (`absolute inset-y-0 rounded-full`, computed left/width, `min-width: 2px`); `space-y-3` rows; axis header `mb-2 border-b border-border`; no vertical gridlines; ≈400px total height accepted [VERIFIED: UI-SPEC §3 lines 119-140].
- Bar colors (discretion, resolved): `isTechRelated === true` → `bg-chart-2` (continues the text-timeline dot color at experience-section.tsx:47), `false` → `bg-muted-foreground`; no legend [VERIFIED: UI-SPEC §3 line 136 + experience-section.tsx:47].
- **Data-verified parse inventory** (all 7 strings byte-checked for codepoints this session) [VERIFIED: JSON lines 35,51,63,75,89,97,105 + codepoint dump]:

| # (JSON order) | company | duration (verbatim) | dash | start→end | monthIndex (y*12+m−1) |
|---|---|---|---|---|---|
| 1 | Chubb | `Sept 2023 — Present` | U+2014 | Sep 2023 → Present | 22184 → axisEnd |
| 2 | Upstream Systems | `Sept 2022 — Aug 2023` | U+2014 | Sep 2022 → Aug 2023 | 22168 → 22183 |
| 3 | Netcompany-Intrasoft | `June 2019 — Sept 2022` | U+2014 | Jun 2019 → Sep 2022 | 22117 → 22168 |
| 4 | Smartup PCC | `November 2017 - April 2018` | U+002D | Nov 2017 → Apr 2018 | 22074 → 22079 |
| 5 | Sweet Corner | `May 2018 - June 2018` | U+002D | May 2018 → Jun 2018 | 22080 → 22081 |
| 6 | Mini Market at University Campus of AUTH | `June 2017 - July 2017` | U+002D | Jun 2017 → Jul 2017 | 22069 → 22070 |
| 7 | WashPark | `March 2017 - June 2017` | U+002D | Mar 2017 → Jun 2017 | 22066 → 22069 (axis min) |

- Month tokens present in the data: `Sept` (**4 letters** — the only nonstandard one), `Aug`, `June`, `April`, `May`, `July`, `March`, `November` (full word). Case-insensitive **first-3-letter matching resolves all 8** (`sep`, `aug`, `jun`, `apr`, `may`, `jul`, `mar`, `nov`) with zero ambiguity in this dataset [VERIFIED: token inventory from JSON].
- **JSON-order quirk (no action, know it exists):** rows 4/5 are not in strict start-date descending order (Smartup starts Nov 2017, appears before Sweet Corner which starts May 2018 — the array is tech-first then non-tech, each reverse-chronological). D-02 + code_context pin row order = JSON order; labels beside each bar carry the dates, so the swap is self-explanatory. Do not "fix" the order [VERIFIED: JSON order + isTechRelated values].
- Parser must NOT alter the stored duration strings rendered in the phase-2 text timeline — `experience-section.tsx:53-55` renders `entry.duration` as stored (strict data fidelity, D-07) [VERIFIED: experience-section.tsx:53-55].

**C. Project stat tiles (D-03)**

- Element pinned: `src/components/explore/sections/project-stat-tiles.tsx` — server component, values received as props from viz-data [VERIFIED: UI-SPEC §4 line 146].
- Computed values (all recomputed programmatically this session) [VERIFIED: JSON lines 172-187 + node computation]:
  - **Total projects: 14.**
  - **Active-years span: 2016–2026** (min/max 4-digit `(19|20)xx` year parsed from `projects[].date`; UI-SPEC pins the en-dash range form `"2016–2026"` over a bare "10", label wording may vary) [VERIFIED: UI-SPEC §4 line 158].
  - **Linked projects: 14** — by D-03's definition ("entries with a link") every one of the 14 entries has `link`. See OQ-1 for the SPEC's stale "(9)".
  - "Ongoing" (Portfolio Website, JSON line 186) contains no year → excluded from min/max; harmless today since 2026 is already the max from dated entries [VERIFIED: UI-SPEC §4 line 161 + year list].
- Date-string inventory (parser input space): `2026`, `June 2023`, `May 2022`, `December 2021`, `August 2018`, `April 2018`, `January 2018`, `December 2017`, `January 2017`, `November 2016`, `October 2016`, `Ongoing` [VERIFIED: programmatic dump].
- Type-level guards required even though all 14 entries are currently complete: `Project.date?: string` and `Project.link?: string` are **optional** in `portfolio-main-data.d.ts:22-23` — stats must gracefully skip absent date/link, never throw [VERIFIED: d.ts lines 19-25].

### 1.3 Rendering/RSC architecture (verified patterns to reuse)

- Composition today: `page.tsx` (server, imports `portfolio-main-data.json`) → `ExplorePanels` (server, `SECTION_BODIES` closure registry passing data slices) → section bodies (all server components) [VERIFIED: page.tsx:33-52, explore-panels.tsx:54-63].
- Pattern for this phase: sections stay server components and compose the new pieces; **only the recharts chart needs `"use client"`** (D-06). The Gantt and tiles are server components. Precomputed plain-object props cross the RSC boundary serialized — no client-side parsing (D-05) [VERIFIED: explore-panels.tsx adapter pattern; UI-SPEC §2 "component performs zero data shaping"].
- **ResponsiveContainer SSR behavior — critical SSG fact [VERIFIED: node_modules/recharts/lib/component/ResponsiveContainer.js]:**
  - Default `initialDimension = {width:-1, height:-1}`; while unmeasured, `chartContent` early-returns `null` (`if (containerWidth < 0 || containerHeight < 0) return null`) — **no SVG in static HTML**.
  - The wrapper div `<div class="recharts-responsive-container" style="width:100%;height:100%">` is **always rendered** — so the static export contains the hydration shell, exactly matching the SPEC acceptance "client-hydration shells present in out/explore.html".
  - `ResizeObserver` is created inside `useEffect` only — SSR-safe.
  - The "width/height should be greater than 0" warn fires only when a real measured size is ≤0, **not** during SSR with the −1 default (the warn sits after the early return) — build logs stay clean.
  - Baseline confirmed: current `out/explore.html` contains zero `recharts` traces.
  - Mitigation for layout shift: give the chart's parent a fixed height (UI-SPEC §2 pins the structure; the wrapper is height:100% of it) — no CLS when the SVG mounts.
- **Reduced motion — the CSS guard does NOT cover recharts, and the UI-SPEC supersedes the D-06 mechanism.** The phase-1 guard (globals.css:573-586, verbatim verified) kills CSS `animation`/`transition` inside `.explore-shell` — but recharts entry animation is **JS-driven** (react-smooth attribute interpolation), invisible to that CSS. D-06 prescribed the explore-intro matchMedia-once pattern (`explore-intro.tsx:33-39`) wiring `isAnimationActive`; the UI-SPEC §motion (line 184) resolves instead: **`isAnimationActive={false}` unconditionally on every recharts element** — no matchMedia wiring, bars render complete at hydration, no re-grow artifact. This strictly satisfies the reduced-motion acceptance (nothing animates under reduce because nothing animates at all) and is the lazier correct mechanism. The explore-intro matchMedia pattern remains the precedent for genuinely conditional motion in later phases. (Tension flagged and resolved in OQ-2.)
- **Theme mechanics:** `use-explore-theme.ts` toggles `dark`/`light` classes on `<html>`; explore dark tokens live on `.explore-shell`, light overrides on `.light .explore-shell` (globals.css:499-566) [VERIFIED]. Chart text inherits JetBrains Mono automatically via the shell's font-family (globals.css:502) — no font work anywhere [VERIFIED: UI-SPEC §1 line 20 + globals.css:502].

### 1.4 Color/contrast facts

- `--chart-1…5` defined **once** at `:root` (globals.css:37-41), never overridden per theme: `220 70% 50%` / `160 60% 45%` / `30 80% 55%` / `280 65% 60%` / `340 75% 55%` [VERIFIED: globals.css:37-41; single grep hit set].
- Bars sit on `bg-card`: dark shell `--card: 220 12% 12%` (globals.css:505), light shell `--card: 0 0% 100%` (globals.css:540).
- I independently recomputed the WCAG relative-luminance ratios the UI-SPEC claims; **every number reproduces exactly** [VERIFIED: WCAG 2.x luminance recomputation this session]:
  - chart-1 vs dark card **3.06:1** (passes 3:1 non-text) ✓
  - chart-2 dark vs light card **2.53:1** ✗, chart-3 dark vs light card **2.55:1** ✗ → the UI-SPEC's user-confirmed (B-1) fix: scoped light-theme overrides inside `.light .explore-shell`: `--chart-2: 160 65% 32%` → **4.49:1**, `--chart-3: 30 75% 38%` → **4.75:1** ✓ (hue-preserving; dark values untouched; side effect — drawer digits and 8px chips for chart-2/3 darken in light mode: decorative, no regression) [VERIFIED: UI-SPEC §2 line 100 + my recomputation].
  - Tick labels muted-foreground: dark **5.68:1**, light **6.04:1** (both ≥4.5:1) ✓.
- **CSS-amendment implication:** adding those two lines inside the existing `.light .explore-shell` block (globals.css:537-566) is an additive edit to a phase-1 artifact. The existing phase-1 test only greps for `--chart-1` overrides (`tests/explore-shell.test.mjs:156-159` — regex `\.light \.explore-shell\s*\{[^}]*--chart-1`) and `--chart-1` in the dark block (:54), so the suite stays green with `--chart-2/--chart-3` overrides [VERIFIED: test regex read]. New tests should pin the two light overrides explicitly (§5).

### 1.5 Mobile/375px geometry

- Scroll container: `main` is `flex-1 overflow-y-auto p-4 md:p-6` [VERIFIED: explore-shell.tsx:50]; panels `rounded-md border bg-card p-4` [VERIFIED: panel-shell.tsx:42]; 1-col grid at base [VERIFIED: explore-panels.tsx:67].
- Chart body width at 375px ≈ 375 − 32 (main p-4) − 32 (panel p-4) − 2 (border) ≈ **309px**; YAxis width 88 leaves ~220px of bar+label space — pinned sizes fit. Gantt is percentage-based; tiles are a fixed 3-col grid (≈100px/tile — `"2016–2026"` at text-xs ≈ 55-60px fits). `overflow-x-hidden` on the shell root remains the last-line guard, not the mechanism [VERIFIED: UI-SPEC §7 line 188 + shell class combo].

---

## 2. Package legitimacy

**No new dependencies are proposed — D-07 pins "zero new dependencies," and everything needed is already installed.** Every package claim below was verified against the real installed artifact this session.

| Package | Claim | Evidence | Tag |
|---|---|---|---|
| `recharts` | Declared `^2.15.1`, resolved **2.15.4** in the lockfile tree | `package.json:51` (dependencies) + `npm ls recharts` → `recharts@2.15.4` | [VERIFIED: package.json + npm ls] |
| recharts React compat | peerDependencies `react: ^16||^17||^18||^19`, `react-dom` same | node_modules/recharts/package.json | [VERIFIED: installed package.json] |
| recharts transitive deps | `eventemitter3@4.0.7`, `lodash@4.18.1`, `clsx`, `react-is` — all already resolved in-tree | `npm ls lodash eventemitter3` | [VERIFIED: npm ls] |
| `ResponsiveContainer` props | `initialDimension?: {width,height}` exists in 2.15.x (default `{-1,-1}`); `width/height/aspect/minWidth/minHeight/onResize` | node_modules/recharts/types/component/ResponsiveContainer.d.ts + lib implementation | [VERIFIED: installed types + lib] |
| `XAxis/YAxis` | `type?: 'number' \| 'category'` via BaseAxisProps (util/types.d.ts:487); `YAxisProps.width`, `reversed`, `orientation` | node_modules/recharts/types/cartesian/{XAxis,YAxis}.d.ts + util/types.d.ts | [VERIFIED: installed types] |
| `Bar` | `isAnimationActive?: boolean` (cartesian/Bar.d.ts:61); `Cell` = `FunctionComponent<SVGProps>` (fill passes through) | node_modules/recharts/types/cartesian/Bar.d.ts + component/Cell.d.ts | [VERIFIED: installed types] |
| `LabelList` | `position?: LabelPosition` (includes `'right'`), `formatter`, `content`; presentation attrs (`fontSize`, `fill`) pass through | node_modules/recharts/types/component/LabelList.d.ts + Label.d.ts LabelPosition union | [VERIFIED: installed types] |
| Duplicate categories | `allowDuplicatedCategory: true` is the **YAxis default** (lib/cartesian/YAxis.js:74); duplicate domain → serial-number bands (lib/chart/generateCategoricalChart.js:327-333) | installed lib source | [VERIFIED: installed lib] |
| SSR behavior | wrapper div always rendered; chart content null until measured; ResizeObserver in effect only | lib/component/ResponsiveContainer.js | [VERIFIED: installed lib] |
| `src/components/ui/chart.tsx` (shadcn wrapper) | Exists, `"use client"`, wraps ResponsiveContainer + ChartConfig→CSS-var `<style dangerouslySetInnerHTML>`; currently the only recharts importer in src | read this session | [VERIFIED: chart.tsx:1-67] |

**Alternative considered and NOT recommended:** building on shadcn `ChartContainer` (ui/chart.tsx) instead of raw recharts. Tradeoffs: it bundles `aspect-video` default (must be overridden), a config→CSS-var style-tag mechanism (a `dangerouslySetInnerHTML` surface we don't need for static colors), and unused tooltip/legend machinery. The UI-SPEC already pins raw recharts primitives with direct `fill="hsl(var(…))"` — fewer layers, full control, matches D-04's static-print approach. Raw recharts wins; ui/chart.tsx stays untouched dead code.

**Node toolchain fact relevant to D-05's "unit-tested" requirement:** `node --test` on Node **v24.16.0** imports a `.ts` module directly (type stripping is on by default), **including an `import type { PortfolioData } from '@/data/portfolio-main-data'` aliased type-only import — verified live: the alias path is never resolved at runtime because type imports are erased.** Experiment: scratch `viz-data.ts` + `.mjs` test in /tmp, `node --test` → 1 pass, 0 fail [VERIFIED: live experiment]. Constraints for the planner: the pure module must use **only erasable TS syntax** (type annotations, interfaces — no `enum`/`namespace`/parameter properties) and **no runtime imports** except type-only ones; the runner must be Node ≥23.6 (CI runs Node 20 but never runs tests, so this is local-only — document it in the plan). The test file reads the JSON via `fs` like `explore-shell.test.mjs:15-20` already does.

---

## 3. Risks and Open Questions

### Open Questions (each marked RESOLVED — planning may proceed)

- **OQ-1 — SPEC pins "linked-project count (9)" but the JSON yields 14. (RESOLVED)**
  Evidence: all 14 `projects[]` entries carry `link` (programmatic count) [VERIFIED]; git history shows the data file had 12 projects/12 links before `0cd7e6b` (2026-09-10, "cv: foreground AI work") and 14/14 after; the SPEC was gathered 2026-09-21, after the last data change — no data state ever had 9 linked projects. D-03 locks the definition ("entries with a link") and D-07/EXPLORE-07 lock "every rendered number computed from the JSON". **Resolution: the tile renders the computed value (14 today); tests must derive the expected number from the JSON at test time (count entries with `link`), never pin a literal 9 or 14. The "(9)" SPEC literal is stale and must not leak into code or tests.**

- **OQ-2 — D-06 (matchMedia-once pattern for recharts animations) vs UI-SPEC §motion (`isAnimationActive={false}` unconditionally). (RESOLVED — follow the UI-SPEC)**
  The CSS reduced-motion guard cannot stop recharts' JS animation, so *something* must neutralize it. Unconditional `isAnimationActive={false}` is a strict superset of D-06's intent: animations are disabled under reduced motion (trivially — there are none anywhere), plus it removes a mount-effect race and the hydration re-grow artifact. UI-SPEC §motion line 184 explicitly supersedes the D-06 mechanism and records it as a resolution. **Resolution: every recharts element carries `isAnimationActive={false}` unconditionally; no matchMedia code for charts; the explore-intro matchMedia pattern stays untouched for the intro. The reduced-motion acceptance criterion is satisfied and provable by source assertion.**

- **OQ-3 — Will the pinned `YAxis dataKey="label"` break on duplicate "Languages" labels? (RESOLVED — no)**
  recharts' category axis with duplicate values and the default `allowDuplicatedCategory: true` swaps the band domain to serial numbers, one band per row; both "Languages" ticks render [VERIFIED: YAxis.js:74 + generateCategoricalChart.js:327-333]. Add an export/render-level test asserting 6 distinct bar bands to guard the subtle behavior (§5).

- **OQ-4 — Does the static export contain anything meaningful for the recharts chart? (RESOLVED — shells only, and that is the acceptance)**
  ResponsiveContainer SSRs the wrapper div and nothing else until measurement [VERIFIED: lib source]. SPEC acceptance demands "client-hydration shells present in out/explore.html" — satisfied by the wrapper. The Gantt and tiles are pure CSS/server-rendered and therefore fully present in static HTML — no-JS visitors lose only the skills bar chart (accepted in UI-SPEC §7 table). Give the chart parent a fixed height so mounting the SVG causes no CLS.

- **OQ-5 — Can D-05's "unit-tested" pure TS module actually run under the repo's test harness? (RESOLVED — yes, with constraints)**
  Node 24 type stripping imports `.ts` directly, erasing aliased type-only imports [VERIFIED: live experiment]. Constraints: erasable syntax only; no runtime imports (or relative ones); tests are local-gate only (CI never runs them; CI Node 20 would not strip types).

- **OQ-6 — Will adding the UI-SPEC's light-theme `--chart-2/--chart-3` overrides break the phase-1 test suite? (RESOLVED — no)**
  The phase-1 assertions grep only `--chart-1` overrides in the shell blocks (explore-shell.test.mjs:54,156-159); adding two var lines inside `.light .explore-shell` keeps every existing test green [VERIFIED: regexes read]. The amendment is user-confirmed per UI-SPEC §2 (B-1) and required for 3:1 light-theme legibility (my recomputation agrees: 2.53/2.55 fail → 4.49/4.75 pass).

- **OQ-7 — "Present" axis end drifting between rebuilds. (RESOLVED — accepted by D-02)**
  `axisEnd = new Date()` at module evaluation during SSG; the export freezes it until the next rebuild. Accepted explicitly by D-02 ("fixed at build time — the export is static") and UI-SPEC §3. Tests must derive the axis end from a `now` injected into the pure module (recommend an optional `now` parameter defaulting to build time) rather than pinning wall-clock numbers.

- **OQ-8 — Does `recharts` emit SSR warnings during `npm run build`? (RESOLVED — no)**
  The "width/height should be greater than 0" warn sits after the unmeasured early-return, so the −1 default never triggers it at build time [VERIFIED: code path]. No log noise expected.

### Risks (non-question)

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R-1 | Duplicate-category axis behavior is subtle (serial-number bands); a future recharts upgrade could change it | Low | Export test pins 6 bands + both "Languages" labels (§5) |
| R-2 | recharts client-bundle cost on the landing page (~100+KB gz with lodash; estimate only) | Low/Accepted | Dependency is mandated by roadmap + D-01; static site; not in scope to code-split this phase [ASSUMED: size estimate] |
| R-3 | No-JS visitors see an empty skills chart | Low/Accepted | Gantt + tiles fully server-rendered; acceptance pinned to "shells" (OQ-4) |
| R-4 | JSON order quirk (Smartup/Sweet Corner swap) could tempt an executor to "fix" ordering | Medium (scope creep) | D-02 + UI-SPEC pin JSON order; plan should forbid sorting, exactly like the phase-2 no-sort discipline |
| R-5 | `Sept` 4-letter month token breaks a naive 3-letter-only parser | Medium if missed | Parser contract: case-insensitive first-3-letter matching verified against all 8 tokens present (§1.2); unit tests feed all 7 real strings |
| R-6 | Optional `date`/`link` fields (types) vs today's complete data | Low | Graceful skip in stats; unit-test with a fixture missing date/link |
| R-7 | YAxis band order is bottom-first by default; the visual order contract requires `reversed` | Medium | UI-SPEC already flags "verify against rendered output"; export test asserts first JSON group is visually top row |

---

## 4. Architectural Responsibility Map

Capability → tier assignment for the planner. Nothing here is security-sensitive; the only cross-tier rule that matters is the D-05 parse-once discipline (components never parse strings inline).

| Capability | Tier | Home | Rationale |
|---|---|---|---|
| Duration-string parsing (`parseDuration`, both dashes + 'Present' + month tokens) | **Domain** (pure, typed, unit-tested) | `src/components/explore/viz-data.ts` | D-05: the ONLY string-parsing site; pure functions, injectable `now` for testability |
| Skills group counting / ordering (`skillsGroupCounts`) | **Domain** | `viz-data.ts` | Mirrors skills-section group builder semantics (order, prettified labels); keeps chart data pure |
| Project stats (`projectStats`: total, year min/max, linked count) | **Domain** | `viz-data.ts` | Graceful on optional `date`/`link`; no build-time coupling beyond injectable now |
| Gantt geometry (monthIndex → left%/width%, axis start/end, year ticks) | **Domain** | `viz-data.ts` | Percent math is pure; the component stays a dumb renderer (UI-SPEC §3) |
| Skills chart rendering (recharts BarChart, 'use client', ResponsiveContainer, isAnimationActive=false, Cell fills, LabelList static values) | **Presentation (client)** | `sections/skills-chart.tsx` | D-06: only recharts needs the client boundary; receives precomputed data via RSC-serializable props |
| Career-span Gantt rendering (tracks, bars, axis header) | **Presentation (server)** | `sections/career-span-chart.tsx` | Pure CSS; in static export without JS |
| Stat tiles rendering | **Presentation (server)** | `sections/project-stat-tiles.tsx` | Server-rendered numbers from props |
| Section augmentation order (chart above chips / Gantt above text details / tiles above cards; graceful-hide preserved) | **Presentation (server)** | existing three section files | D-01/D-02/D-03 + D-07 augment-only |
| Scoped light-theme chart-2/3 contrast overrides | **Presentation (CSS)** | `.light .explore-shell` block in globals.css | UI-SPEC B-1; additive two lines; phase-1 suite unaffected (OQ-6) |
| Data source | **Data** | `portfolio-main-data.json` + `.d.ts` | Read-only, untouched (D-07) |
| Integration tier | **None new** | — | No network, storage, or third-party integration work this phase; recharts is a client-side rendering library already in the dependency tree |

No security-sensitive capability exists in this phase (static data, no user input, no HTML injection surface — the recommended path adds no `dangerouslySetInnerHTML`). **BLOCKER check: none of the above sits in the wrong tier; the parse discipline stays in the domain tier.**

---

## 5. Validation Architecture

Automated checks proving each behaviour. Layers mirror the established `tests/explore-shell.test.mjs` pattern (source-level invariants run immediately; export-level require `npm run build` first). Proposed carrier: a new `tests/explore-visuals.test.mjs` (plus the regression run of the existing suite), executed via `node --test tests/explore-visuals.test.mjs` alongside `node --test tests/explore-shell.test.mjs`.

**Layer 1 — Unit tests of the pure module (D-05; direct `.ts` import, verified viable):**
- `parseDuration` over **all 7 real strings read from the JSON** → exact `{startYear, startMonth, endYear, endMonth, isPresent}` expectations (table in §1.2B); both dash styles; `Present` semantics; graceful `null` (never throw) on malformed input; `Sept`/`Nov`-style tokens.
- `skillsGroupCounts` against the JSON → `[{label:'Soft Skills',count:6},{label:'Languages',count:9},{label:'Testing',count:6},{label:'Infrastructure',count:6},{label:'Innovation',count:7},{label:'Languages',count:2}]` in that exact order (JSON group order, soft first, spoken last; duplicate label preserved).
- `projectStats` against the JSON → total 14, min 2016, max 2026, linked = JSON-filter count (computed, not pinned — OQ-1); fixture entries with missing `date`/`link` are skipped gracefully; "Ongoing" excluded from min/max.
- Gantt geometry: given injected `now`, axisStart = WashPark March 2017, percentages sum/position correctly, 'Present' row extends to 100%.

**Layer 2 — Source-level invariants (existing repo style):**
- Augment order: in `skills-section.tsx` the chart composes **before** the group loop; in `experience-section.tsx` the Gantt composes **before** the `<ol>`; in `projects-section.tsx` the tiles compose **before** the card map (indexOf ordering, matching the suite's established style).
- `skills-chart.tsx` carries `"use client"`, imports ResponsiveContainer; Gantt and tiles files carry **no** client directive, **no** recharts import.
- Every recharts element sets `isAnimationActive={false}` unconditionally; no `matchMedia` added to chart files (OQ-2); no `Tooltip` import anywhere under `src/components/explore/` (D-04).
- `viz-data.ts` is the only file under `src/components/explore/` containing duration/date parsing logic (components never parse inline — D-05); the three section bodies' existing logic (`slice(0,3)`, `slice(0,6)`, group builder, graceful-hides) byte-unchanged.
- No hardcoded stat literals in section/chart components (grep-style: no `14`, `2016`, `2026`, `9` literals driving rendered numbers; values arrive via props/module).
- Package.json dependencies unchanged (D-07: zero new deps).
- globals.css: the two pinned light overrides exist inside `.light .explore-shell` with the exact pinned values (`--chart-2: 160 65% 32%;`, `--chart-3: 30 75% 38%;`) and no `--chart-1` override appears in either shell block (keeps phase-1 assertions meaningful).
- Gantt bars positioned by computed percentages (no fixed px spans); shell/grid/drawer/header/status-bar files untouched (augment-only diff check).

**Layer 3 — Export-level invariants (after `npm run build`):**
- `out/explore.html` contains `recharts-responsive-container` (hydration shell — the SPEC's pinned acceptance) and the skills-panel markup unchanged around it.
- Gantt fully server-rendered: all 7 company names present with track/bar markup; year-tick labels derived from JSON (`2017` present at minimum).
- Tiles present with the **JSON-derived** numbers (test computes expected total/linked from the JSON at test time and asserts those strings appear — survives future data edits, per OQ-1).
- Exactly **6 bar bands / 6 printed count labels** guard the duplicate-category behavior (OQ-3) — assert the six counts (6/9/6/6/7/2) appear as printed text where static SVG permits, or via the rendered band count in the markup.
- `/` and `/resume` exports still emitted and untouched (`out/index.html`, `out/resume.html` — D-07/EXPLORE-05).
- Existing phase-1 suite still green (regression run).

**Gates (SPEC acceptance):** `npm run build` + `npm run typecheck` + both `node --test` files pass on the final tree; `/explore` still exports statically.

**What automation cannot prove (manual, listed for verify):** visual order top→bottom (R-7 — check rendered/reversed), 375px no-horizontal-scroll by eye, both-theme legibility aesthetics beyond the recomputed contrast math (numbers already verified in §1.4).

---

## 5.1 Project Constraints (from project conventions and planning artefacts)

- **Augment-only discipline (D-07):** no changes to panel chrome, grid spans, phase-2 text bodies, drawer/header/status bar; no edits to CLI, `/resume`, the data file, or Resume* components; zero new dependencies. Existing phase-1 test suite must stay green (it asserts chrome byte-stability).
- **Test runner convention:** Node built-in `node --test`, zero npm test deps (D-09 heritage, tests/explore-shell.test.mjs:4); source-invariant + export-invariant two-layer style with doc-comment-stripping greps; export-level tests fail with a "run npm run build" hint until built.
- **No hardcoded content (EXPLORE-07):** every rendered number derives from `portfolio-main-data.json`.
- **Static fidelity:** duration strings rendered as stored; JSON array order never sorted; strict data-fidelity precedents in experience-section.
- **Interaction-free chrome (UI-SPEC §17.6 heritage):** no hover/pointer/focus/transition on chart elements; chips' `font-normal pointer-events-none` overrides untouched.
- **SSG constraints:** `output: 'export'`; sections server components; only chart components are client; no server APIs.
- **CI reality:** deploy.yml builds on Node 20 and never runs tests — the plan's gates run locally; keep tests Node-24-compatible and document that (OQ-5).
- **ESLint ignored during builds** (next.config.ts:8-10) — typecheck is the lint-equivalent gate here.
- **Remote writes:** none in this phase's scope; shipping is a later, separately-commanded step.

---

## 6. Provenance summary

- Every in-repo discrete value quoted above was read this session with path + line anchors (JSON lines 30-108/146-155/172-187; d.ts 19-25; tailwind.config.ts 46-52; globals.css 37-41/499-566/573-586; skills-section 29-40; experience-section 31-56; projects-section 27-55; explore-panels 37-63; explore-shell 47-50; panel-shell 39-51; explore-intro 33-39; test regexes 54/156-159; deploy.yml 29-64; next.config.ts 5-10).
- Every recharts API claim was verified against the installed 2.15.4 tarball (`npm ls`-resolved), citing node_modules paths and line numbers; the duplicate-category and SSR behaviors were read from compiled lib source.
- Contrast figures were independently recomputed (WCAG relative luminance) and matched the UI-SPEC's claims exactly.
- The `node --test` TS-import pattern was proven by a live experiment on Node v24.16.0.
- Remaining [ASSUMED] items: recharts bundle-size estimate (R-2); none affect planning decisions.

**Verdict: no unresolved open questions. Planning may proceed.**