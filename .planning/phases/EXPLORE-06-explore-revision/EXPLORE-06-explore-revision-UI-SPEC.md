All grounding complete. I've verified every surface the contract touches: the grid + PanelShell chrome, both merge targets' full anatomy, the removed recharts pair, the Gantt pattern to reuse (career-span-chart + viz-data builder), all six `EXPLORE_SECTIONS` consumers, the tour's hardcoded 7-step arrays, the shared ResumeView (page + CLI modal), the PDF template's hardcoded skills, the data's actual date shapes (11 Month-YYYY, 2 year-only, 1 Ongoing), chart tokens with their light-mode override precedent, and the stale-test surface. Returning the full UI-SPEC.md:

# EXPLORE-06 explore-revision — UI-SPEC.md (design contract)

**Phase:** 06-explore-revision · **Gathered:** 2026-09-23 · **Status:** Ready for planning
**Authority:** This contract pins HOW the revised surfaces look and behave. CONTEXT.md decisions D-01…D-09 and the locked UI notes are inputs this spec does not relitigate. Every pinned value below was verified against the current tree; file:line cites are evidence, not instructions to preserve those exact lines.

---

## §0 Reading order and scope

1. **§1** Surface inventory + propagation map (what changes, what is byte-untouched)
2. **§2–§5** The four visual revisions (grid, merged panel, competency cards, calendar)
3. **§6** Chrome consequences of 5→4 sections (drawer, tour, status bar, intro, header)
4. **§7–§8** /resume page + PDF template rebuilds to the docx structure
5. **§9–§11** Interaction states, visual behaviour, accessibility
6. **§12** Edge-case table · **§13** UNRESOLVED items · **§14** Falsifiable acceptance checks · **§15** Stale-test surface

**Contract boundary (D-01/D-03):** this spec covers RENDERING of the refreshed data only. The data write itself is draft→approve→write and lives in the data plan. CLI output styling is out of scope (data-driven text changes propagate automatically).

---

## §1 Surface inventory

### §1.1 Changed surfaces

| Surface | Change | SPEC req |
|---|---|---|
| `/explore` panel grid | 5 panels → 4, 2×2 rebalance | REV-04 |
| `/explore` About panel | Absorbs all 9 contact rows + Full resume link | REV-04 |
| `/explore` Skills panel | recharts BarChart + Treemap → competency/proof cards | REV-05 |
| `/explore` Projects panel | Year-grid calendar added above tiles + cards | REV-06 |
| `/explore` chrome | Drawer/tour/status-bar/intro/header adapt to 4 sections | REV-04 |
| `/resume` page | Rebuilt to docx section order, single-column | REV-02 |
| `public/resume-export.html` | Template rebuilt to same docx structure from data | REV-03 |
| Data rendering (all surfaces) | New title/summary/competencies/quantified bullets/featured flags | REV-01 |

### §1.2 Byte-untouched (pinned)

- `experience-section.tsx` + `career-span-chart.tsx` — REV-07 deferred (D-09). The wizard/drawer/counter flows keep working through them.
- `terminal-pointer.tsx`, `panel-shell.tsx` (chrome anatomy unchanged), `explore-header.tsx` structure (only its data-driven title string changes), `use-explore-theme.ts`, `tour-placement.ts`.
- `project-stat-tiles.tsx` + the project card map (projects-section.tsx top-6 slice, hover pin W-2) — unchanged below the calendar.
- CLI terminal outputs — data-driven text only, no styling changes.
- `ResumeModal.tsx` chrome (Customize/print buttons, OBSIDIAN/PRINTER protocol switch, module toggles) — unchanged; it re-renders the rebuilt ResumeView (§7.5).
- Chart tokens `--chart-1…5` themselves stay defined in both theme blocks; only *usages* shrink (chart-5 loses its explore usages but keeps the header window glyphs, explore-header.tsx:42).

### §1.3 Propagation map (D-03 checklist, render side)

`about.title` → /explore header truncate (explore-header.tsx:54-59), intro strip (explore-intro.tsx:32), About panel meta row, /resume header, PDF header, root layout metadata + JSON-LD, CLI banner — all data-driven; the only *layout* consequence is the intro strip height (§6.5).
`core_competencies` → /explore Skills cards (§4), /resume CORE COMPETENCIES (§7.3), PDF (§8). `featured` certs/articles/projects → /resume + PDF only (§7.3, §8); /explore has no certs/articles panel.

---

## §2 /explore grid rebalance (REV-04, D-04)

### §2.1 Grid container

`explore-panels.tsx:67` becomes `grid grid-cols-1 gap-4 md:grid-cols-2` — the `lg:grid-cols-3` tier is **removed**. The About col-span className (`md:col-span-2 lg:col-span-2`, line 77) is **removed**; no panel carries any span class.

### §2.2 Breakpoint/span table (pinned)

| Viewport | Container | About+Contact | Experience | Skills | Projects |
|---|---|---|---|---|---|
| <768px (base, incl. 375) | 1 column, stacked | full width | full width | full width | full width |
| ≥768px (md) | 2 columns | row 1 · col 1 | row 1 · col 2 | row 2 · col 1 | row 2 · col 2 |
| ≥1024px (lg) | **2 columns (unchanged from md — no lg override)** | row 1 · col 1 | row 1 · col 2 | row 2 · col 1 | row 2 · col 2 |

- DOM order = visual order at every width (no span tricks): about → experience → skills → projects. Zero empty cells: 4 panels fill 2×2 exactly (lg included).
- Panels stretch to their row height (default `align-items: stretch`); content height differences inside a row are accepted — the REV-04 "no wide empty space" target is the grid-level emptiness (no orphan third column, no span-induced voids), not per-panel equal heights. No min-height hacks.

### §2.3 Panel width budget (drives §3–§5 pins)

Computed from shell padding `p-4 md:p-6` (explore-shell.tsx:70), `gap-4`, card `p-4`:

| Viewport | Panel body width |
|---|---|
| 375px | ≈ 311px |
| 640px | ≈ 576px |
| 768px (md 2-col) | ≈ 320px |
| 1024px | ≈ 448px |
| 1440px | ≈ 656px |

Note the dip at md (320px < 576px at sm): any per-panel 2-column density must key on `lg`, never on `md` (this is why §4.2 pins `lg:grid-cols-2`).

---

## §3 Merged About+Contact panel (REV-04, D-05)

### §3.1 Identity

- Section id **`about`** and PanelShell chrome unchanged: chart-1 chip + `h2` label (panel-shell.tsx:38-52). The standalone `contact` section disappears from `EXPLORE_SECTIONS` (constants.ts:10-16) — no `#contact` anchor exists anywhere in the repo today (verified by grep), so removal breaks nothing.
- Accent stays chart-1. `ACCENTS`/`EXPLORE_TOUR_ACCENTS`/`DIGIT_ACCENTS` drop their contact/chart-5 entries.

### §3.2 Internal anatomy (pinned order — top to bottom)

```
┌ PanelShell: ● About ────────────────────────────┐  ← chart-1 chip + h2 (chrome, unchanged)
│ description paragraph                            │  ← about.description (docx SUMMARY), text-sm leading-relaxed text-foreground (verbatim, wraps)
│ meta row: ⎇ <title>  ⌖ <location>                │  ← existing AboutSection meta row (Briefcase/MapPin, text-xs muted, flex-wrap, graceful-hide per field)
│ ─────────────────────────────────────────────── │  ← one divider: my-3 border-t border-border (reused from contact-section.tsx:80)
│ ✉ Email      <value break-all>                   │  ├ 9 channel rows, JSON key order
│ in LinkedIn   <value>                            │  │  (email, linkedin, github, medium, facebook,
│ ⃝ GitHub      <value>                            │  │   instagram, twitter, twitch, portfolio — CHANNELS table, contact-section.tsx:44-58)
│ … (9 rows total)                                 │
│ [📄 Full resume →]                               │  ← LAST (see §3.3), bordered accent row
└──────────────────────────────────────────────────┘
```

1. **Description** — `about.description`, full text, never clipped.
2. **Meta row** — title (Briefcase) + location (MapPin), existing classes, `mt-3` above it per current about-section spacing rhythm.
3. **Divider** — the single `my-3 border-t` reused from ContactSection.
4. **9 contact rows** — the existing ContactSection row anatomy REUSED VERBATIM: icon `h-4 w-4 text-muted-foreground`, label `text-sm text-foreground`, value `break-all text-xs text-muted-foreground`, `min-h-[44px]`, `group-hover:underline`, focus ring recipe `ROW_CLASS` (contact-section.tsx:61-62). Email keeps `mailto:` same-tab; the 8 external rows keep `target="_blank" rel="noopener noreferrer"`. Graceful-hide per channel (missing value → no row, no invented copy).
5. **Full resume link LAST** — the existing bordered accent row (`FileText` + "Full resume" + `ArrowRight`, `min-h-[44px]`, `/resume` internal route same-tab). **Position change pinned:** it moves from first (old Contact position, contact-section.tsx:72) to last, per the locked notes order `heading/description/contacts/resume link`. The `mt-3` spacing above it separates it from the channel list.
6. **No TerminalPointer** on the merged panel — status quo for both merged halves (about-section had none; contact-section had none). Experience/Projects/Skills keep theirs.

### §3.3 Consequences pinned elsewhere

Drawer/tour/status-bar/counter updates: §6. Grid slot: §2.2. Focus order: §11.2.

---

## §4 Skills panel — competency + proof cards (REV-05, D-06)

### §4.1 What is removed

- `skills-chart.tsx` (recharts BarChart) and `skills-treemap.tsx` (recharts Treemap) — **components deleted**, imports removed from skills-section.tsx.
- `techMentions` + `TreemapCell` machinery in viz-data.ts:196-260 — deleted with the treemap.
- The skills chip groups (soft_skills / hard_skills categories / languages) are removed from the panel body per the locked "competency + proof cards ONLY" — the full skills inventory remains CLI-reachable (`skills` command) and the JSON data is untouched. *(U-2 confirms this reading; if the user intended chips to stay, they render below the cards — planner default is REMOVED.)*
- `skillsGroupCounts`/`skillGroupFill` (viz-data.ts:102-153) survive only if the chips stay (U-2); with the default they are deleted too. Either way the section imports no recharts and no mention machinery.

### §4.2 Card anatomy (pinned)

```
┌──────────────────────────────┐
│ (Test Automation Architecture│  ← competency name chip: Badge variant="outline",
│  & Framework Design)         │     className "font-normal pointer-events-none text-chart-3
│                              │     border-chart-3/40" — wraps, never truncates
│ Playwright, Selenium, Rest   │  ← proof: text-xs leading-relaxed text-muted-foreground,
│ Assured, WebdriverIO         │     renders VERBATIM from data.core_competencies[n].proof
└──────────────────────────────┘   card container: rounded-md border border-border p-3
```

- **Grid:** `grid grid-cols-1 gap-2 lg:grid-cols-2` inside the body (density discretion pinned). Rationale: panel body is ≈311px (375) / 576px (sm) / **320px (md — too narrow for 2 cards)** / 448px+ (lg). At lg, 8 cards = 4 full rows of 2, zero empty cells.
- **Semantics:** the card grid is a `<ul>` with one `<li>` per cluster (matches the existing chips-list pattern; gives AT a countable list).
- **Name chip** carries the Skills panel accent identity: chart-3 text + 40%-alpha chart-3 border. Contrast is proven both themes: dark `30 80% 55%` on card bg; light uses the existing override `30 75% 38%` (globals.css:573, measured 4.75:1). Chips are static chrome — `pointer-events-none`, not focusable (§17.6 precedent from the old chips).
- **Proof** is one line by design (quantified, short) but wraps fully when longer — never clipped (§3 content rule).
- **Count is data-driven**: render `data.core_competencies` as-is, no `slice`, no hardcoded 8 (expected 8 per D-02; the UI must not assume it). Empty/missing array → the section body renders nothing (graceful-hide; PanelShell header still renders, existing behaviour).
- **TerminalPointer `command="skills"` stays** at the body end (existing chrome, unchanged).
- Panel body order: cards grid → TerminalPointer. Nothing else.

### §4.3 New prop path

`SECTION_BODIES.skills` maps `{ data }` → `SkillsSection competencies={data.core_competencies}` (the skills/experience props drop if their machinery goes with U-2). Server component, no client directive — the Skills panel becomes 100% server-rendered (recharts was its only client slice).

---

## §5 Projects panel — year-grid bars calendar (REV-06, D-07)

### §5.1 Position and pattern

FIRST child of the Projects body, above ProjectStatTiles (which stays), inside a `mb-5` wrapper exactly like the Gantt's (experience-section.tsx:47-51). Pure CSS, **the existing Gantt pattern**: a pure geometry builder in viz-data.ts + a dumb server renderer. No recharts, no client directive, no hooks.

### §5.2 Geometry — new pure builder `buildProjectsCalendar(projects, now = new Date())` in viz-data.ts

- **Axis:** January of the minimum data year → December of `max(current year, max data year)`. Today: 2016 → 2026 = 11 full-year columns, `totalMonths = 132`. Full-year columns (not min-ship-month start) so each year is an exact 1/11 block — a year *grid*, per the user's "like a calendar" framing. `now` injectable for tests; SSG render freezes the axis until rebuild (OQ-7 precedent from buildCareerSpan).
- **`yearTicks`: reuse the existing `YearTick` shape** — `{year, leftPct}` at each January, start-year tick at 0%, no right-edge tick (career-span precedent, viz-data.ts:348-355).
- **Per project (rows in JSON order, NO sorting — R-4 discipline):** parse the date; a `Month YYYY` date yields `leftPct = (shipMonthIndex − axisStart)/totalMonths × 100` and `widthPct = 100/totalMonths` (exactly one month cell ≈ 2.35px at 375px). Year-only (`"2026"`), `"Ongoing"`, or unparseable → `leftPct/widthPct = null` — **geometry is never invented** (Gantt E-1 precedent).
- Data reality check (14 projects): 11 ship months (June 2023 ×2, May 2022, Dec 2021, Aug 2018, Apr 2018, Jan 2018, Dec 2017, Jan 2017, Nov 2016, Oct 2016) → 11 single-month bars; Clarif-AI + DeepIndex (`"2026"`) and Portfolio Website (`"Ongoing"`) render rows without bars (§5.4).
- Name/date strings are copied VERBATIM as stored — the parser touches geometry only.
- Zero rows with geometry → the whole calendar graceful-hides, wrapper included (Gantt E-2 precedent; no stray margin).

### §5.3 Visual anatomy (per row — mirrors career-span-chart.tsx rows)

```
2016      2017     2018     2019 … 2025      2026     ← year ticks: text-[10px] tabular-nums muted, absolute at leftPct%, mb-2 border-b track header
─────────────────────────────────────────────────
SDK4ED-TD                        ▮               ← June 2023: name text-xs font-medium min-w-0 + date
June 2023                (█)                       text-[10px] tabular-nums muted right-aligned;
─────────────────────────────────────────────────   track h-2 rounded-full bg-muted, bar bg-chart-4 minWidth:2
```

- **Bar color: `bg-chart-4` for every bar** (Projects panel accent identity; color encodes NO data — all 14 projects are linked, no type field exists). Light mode requires a **new hue-preserving `--chart-4` override** beside the chart-2/3 precedent (globals.css:572-573), targeting ≥3:1 on the white card — e.g. `280 65% 40%`, exact value at executor's probe. Dark mode value untouched.
- Bars carry `minWidth: 2` so a single-month cell stays visible at 375px (Gantt E-5 precedent).
- **Fit at 375px:** 11 year ticks across ≈311px → ≈28px spacing vs ≈24px label width — no overlap; this is the same tick density the experience Gantt already ships (10 ticks, same width). 14 rows × (name line + 8px track + gaps) ≈ 350px vertical — the panel is a scroll column; accepted.
- **Static chrome**: no hover, focus, cursor, or animation anywhere in the calendar (§17.6).

### §5.4 Rows without geometry (pinned behaviour)

A project with no parseable month renders its full row — name + verbatim date (`"2026"`, `"Ongoing"`) — with the track and NO bar. Rationale: the Gantt's E-1 discipline (row text renders, geometry never invented) + the name must stay visible so the calendar's project count matches the data; the alternative (inventing a placement) is rejected, and hiding the rows would silently drop the two flagship docx-enriched projects from the surface.

### §5.5 Accessibility

Tracks and bars are `aria-hidden="true"`; year ticks and all row text are real DOM text — assistive tech gets a natural 14-item project+date list, no ARIA duplication, no `role="img"` (Gantt precedent).

---

## §6 Explore chrome — 5→4 section consequences

### §6.1 `EXPLORE_SECTIONS` (constants.ts:10-16)

Contact entry removed → four sections: about, experience, skills, projects. Every consumer that derives from the list updates automatically: panels grid, drawer anchors, status-bar counter, tour step generation, IO observers, visited-id validation. The `ExploreSectionId` union shrinks, which **type-forces** the contact-key removal from `ACCENTS` (explore-panels.tsx:37-43), `EXPLORE_TOUR_ACCENTS` (constants.ts:62-68).

### §6.2 Status bar (pinned consequence)

Counter renders `${visitedCount}/${EXPLORE_SECTIONS.length} sections visited` → **`N/4`** automatically (explore-status-bar.tsx:49); the 4/4 celebration turns `text-accent` unchanged. Doc comment "0/5" literals (use-explore-visited.ts:47, status-bar header) update. SSR/first paint renders the literal-0 counter — now literal `0/4` — hydration contract unchanged.

### §6.3 Drawer

Four anchor items (`#about`, `#experience`, `#skills`, `#projects`); `DIGIT_ACCENTS` shrinks to four entries — digits render `01`–`04`, chart-5 accent drops out of use (explore-drawer.tsx:33-39). All other drawer chrome byte-identical.

### §6.4 Tour (6 steps)

- `EXPLORE_TOUR_STEPS` = welcome + 4 content + finish. The positional `EXPLORE_TOUR_STEP_BODIES` array (constants.ts:97-103) shrinks to 4 and its copy is rewritten (chrome orientation only, zero invented facts):
  - about: bio + role + location **+ every contact channel + the resume export** (merged-panel reality)
  - experience: unchanged copy (the panel is byte-untouched, D-09)
  - skills: competency clusters with proof lines — **no treemap mention**
  - projects: year-grid calendar + stat tiles + projects — no "six projects underneath" count
- Welcome body: "the five sections" → "the four sections" (constants.ts:117).
- **`PRIMARY_LABELS` (explore-tour.tsx:57) is the one hardcoded step-count array: 7 → 6 entries** `['Start','Next','Next','Next','Finish','Done']` (projects is now the last content step → its primary action becomes "Finish").
- **The sr-only literal `"Step ${stepIndex + 1} of 7"` (line 409) must derive from `EXPLORE_TOUR_STEPS.length`**; the visible counter already derives (line 464).
- Placement: the hole targets the now-taller `#about` panel; `placeCard`'s R-10 viewport-intersection gate already docks for oversized panels — no placement change.
- Finish card copy stays valid ("every section's marked visited on the counter below" — true for 4).

### §6.5 Intro strip + header title (new-title wrap safety)

- `fullText` grows from 57 to ≈91 chars (`Anastasios Tilsizoglou — Test Automation Architect | Principal Test Automation Engineer`). At 375px that wraps to **3 lines** (was 2, explore-intro.tsx:26); the strip's reserved `min-h-[40px]` no longer covers it → the animated span filling client-side would shift layout 20px mid-typing (CLS regression). **Pinned invariant: the strip's reserved height statically covers the new worst-case wrap — bump base `min-h` to cover 3 lines (e.g. `min-h-[60px]`) and md+ to cover 2 (e.g. `md:min-h-[40px]`)**; exact classes at planner's discretion, the no-post-hydration-shift invariant is the contract. Reduced-motion static swap and TypingEffect reuse unchanged.
- Header: `name — title` truncates with ellipsis at md+ (`min-w-0 truncate`, explore-header.tsx:57-59) — existing behaviour absorbs the longer title; the md:hidden name-only span is unaffected.

---

## §7 /resume page rebuild (REV-02, D-08)

### §7.1 Page chrome preserved byte-for-byte (page.tsx)

Dark/printer toggle ("Obsidian Protocol"/"Printer Protocol" button), "Print / Save PDF" button (`window.print()`), `?print=true` → 1000ms delayed auto-print, `Suspense` fallback "LOADING ARCHIVE...", fixed top-right cluster `print:hidden`. All unchanged.

### §7.2 Layout: single-column document flow

The 33/67 sidebar grid (ResumeView.tsx:124-149) is **replaced by a single-column document** — the docx order cannot survive a sidebar split (certs/writing would detach from their docx positions). `max-w-5xl mx-auto` screen container, `font-mono`, `transition-colors duration-300` theme swap kept.

### §7.3 Section order (pinned — DOM order = docx order)

1. **Header block** — name (h1, `text-3xl font-black uppercase`, print 2xl), title (h2 accent `text-xs tracking-[0.2em]`, the NEW 'Test Automation Architect | Principal Test Automation Engineer'), then the docx contact **line**: location | email | LinkedIn | GitHub | Portfolio as a wrapping inline row of links (icons kept), replacing the stacked sidebar contact list.
2. **SUMMARY** — `about.description` (docx SUMMARY).
3. **CORE COMPETENCIES** — the 8 clusters, one line each: name (semibold, foreground) + proof (muted), in data order. This is the docx content in document form — the explore cards' two-part anatomy without card chrome. *(The docx's inline `•` wall was considered and rejected: a ~400-char wrapped wall hurts scannability and print flow.)*
4. **PROFESSIONAL EXPERIENCE** — the docx's 3 roles, reverse-chron data order, FULL quantified bullet list per role (no 3-bullet cap on /resume; the docx carries 6/3/4). The existing `isTechRelated` filter already yields exactly these 3 roles (verified: Chubb/Upstream/Netcompany are the only `isTechRelated:true` entries) — keep it (U-4).
5. **PROJECTS** — the docx's two: **deepindex first, then Clarif-AI** via featured flags, rendered in data order (no client-side sorting; the data write owns the deepindex-first order, U-6). Each: name + date + description + the link as a muted mono URL line under the description (new element, mirrors the PDF template's link-line pattern; clickable on screen, prints as text).
6. **EDUCATION** — both degrees (MSc + BEng) in docx order; existing row anatomy (degree/duration/institution | location/focus) already matches the docx content.
7. **CERTIFICATIONS** — featured certs only (expected 5: ISTQB CTFL + the 4 Anthropic Academy items), data order with ISTQB first per the data write; row anatomy = existing cert row (name + date + ID mono). The other 36 remain CLI-reachable.
8. **SELECTED WRITING (MEDIUM)** — the 5 docx-flagged articles, data order; existing article row anatomy (name + date + platform).

Featured-filter mechanics (flags vs explicit lists) are data-step decisions; the UI renders whatever curation the refreshed data provides — never hardcodes names/counts.

### §7.4 Heading labels

Visible section headings = docx names verbatim (SUMMARY, CORE COMPETENCIES, PROFESSIONAL EXPERIENCE, PROJECTS, EDUCATION, CERTIFICATIONS, SELECTED WRITING), keeping the `//`-prefix accent chrome style (`<span class="opacity-50">//</span> NAME`) and the `text-[10px] font-black uppercase tracking-[0.4em]` treatment. The `.EXE/.SH/.SYS/.BIN/.KEY/.LOG` suffixes are dropped (U-5). Hierarchy stays h1 name → h3 sections.

### §7.5 Print stylesheet (rebuilt inside ResumeView's inline `<style>`)

- Keep: `@page { size: A4; margin: 0mm }`, `.resume-container { width: 210mm }`, white bg / black text, `print-color-adjust: exact`, per-entry `break-inside: avoid`, line-height tightening.
- Remove: all `.resume-sidebar` / flex-row rules (single-column now).
- Invariants: print width 210mm verified; long bullets/proofs wrap, never clip; multi-page flow allowed (content exceeds one A4 page — no fixed 297mm page clipping beyond `min-height`).
- **Modal propagation (pinned):** `ResumeModal` renders this same ResumeView (ResumeModal.tsx:117-123) — it inherits the single-column docx layout and section set. The sidebar-era coupling `showProjects && !showArticles` (ResumeView.tsx:146) is **removed**: PROJECTS and PUBLICATIONS toggles now control their sections independently (E-16). `ResumeSkills` (SKILLS.SYS chips) is deleted from the composition and its file removed — the docx has no skills section; the skills JSON stays in data (CLI-reachable).

### §7.6 Both-theme behaviour

The `isDarkMode` color pairs (#0b1326/#dae2fd/#8fdb00 dark; white/grays/blue-600 light) extend to the two NEW sections (competencies, writing) with the same var pattern; print overrides force black/near-black text as today.

---

## §8 PDF template rebuild (REV-03, D-08)

`scripts/generate-static-resume.js` rebuilt to the SAME docx structure from the refreshed data:

- **Delete the hardcoded skills block** (template lines 373-386: Languages/Testing/Infrastructure slices + Innovation group) — replaced by the CORE COMPETENCIES section rendering `data.core_competencies` (same line-per-cluster anatomy as §7.3).
- **Section order = §7.3 exactly**: header (name/title/location/contact line) → SUMMARY → CORE COMPETENCIES → PROFESSIONAL EXPERIENCE (full bullets, 3 roles) → PROJECTS (deepindex first, then Clarif-AI, with npm/clarif-ai.net link lines) → EDUCATION → CERTIFICATIONS (featured 5, data-driven — replaces the hardcoded ISTQB-only sidebar item) → SELECTED WRITING (the 5 featured articles — replaces `articles.slice(0,3)`).
- **Single-column 210mm** container (the sidebar column dies); keep the dark-screen/white-print token swap (`--text-accent: #0044cc` print), JetBrains Mono + FontAwesome CDN header, `a[href^="http"]:after` URL-print rule, `break-inside: avoid` per entry.
- Output path unchanged: `public/resume-export.html` via `npm run build:resume` (the modal's `/resume-export.html` link keeps working).
- Section heading labels match /resume (U-5 default).

---

## §9 Interaction-state matrix (every control)

**/explore**

| Control | Default | Hover | Active | Focus | Disabled | Loading/Error |
|---|---|---|---|---|---|---|
| Header buttons (tour/theme/drawer/terminal) | 44×44 ghost, muted icon | `hover:bg-muted` | browser default | `ring-2 ring-ring offset-2` recipe | never | N/A (SSG) |
| Drawer items ×4 | 44px row, digit accent + label | `bg-sidebar-accent` + fg swap | — | `ring-sidebar-ring` | never | N/A |
| Contact rows ×9 (merged panel) | icon muted / label fg / value muted | label+value `group-hover:underline` | — | `ROW_CLASS` ring recipe | never | N/A |
| Full resume link (merged, last) | bordered, `text-accent`, FileText+ArrowRight | label underline (group) | — | ring recipe | never | N/A |
| Project card anchors (≤6) | bordered card | name+arrow → `text-accent` (transition-colors, W-2 pin) | — | ring recipe | never | N/A |
| Unlinked project card | bordered div | none (no affordance) | — | N/A | N/A | N/A |
| Competency cards ×8 | static card | none — not interactive (§17.6) | — | N/A | N/A | N/A |
| Calendar | static | none | — | N/A | N/A | N/A |
| Stat tiles | static | none | — | N/A | N/A | N/A |
| Tour X / Back / Next / Finish / Done | ghost 44px / accent label | `hover:bg-muted` | — | ring recipe | Back at step 0 (`disabled:opacity-50`) | N/A |
| Theme toggle | instant swap, NO transition classes | — | — | ring recipe | never | N/A |

**/resume:** theme toggle (outline, `bg-white/80 backdrop-blur`, print:hidden), print button (blue-600, print:hidden), header contact links (hover translate-x-1 + underline-border, suppressed in print) — all unchanged. **No new interactive elements** are introduced anywhere in this phase; competency cards and the calendar are static by construction.

---

## §10 Visual behaviour

### §10.1 Motion budget

Zero new CSS animations or transitions in this phase. New visuals are server-rendered static DOM (animation-free by construction); the shell's reduced-motion guard (globals.css:581-593) keeps covering the pre-existing animations (tour dim fade, intro typewriter, resume theme transition). Grep-verifiable: no `animate-`, no `transition-` classes added.

### §10.2 Empty states (graceful-hide everywhere — no fallback copy is ever invented)

| Condition | Behaviour |
|---|---|
| `core_competencies` empty/missing | Skills body renders nothing; /resume + PDF omit the section (incl. heading) |
| Competency proof empty | Card renders name chip only |
| No parseable ship month on a project | Row renders with verbatim date, no bar (§5.4) |
| No parseable months at all | Calendar + wrapper unmount entirely |
| Contact channel missing | Row absent |
| `about.title`/`location` empty | Meta item absent |
| Zero featured certs / articles | /resume + PDF omit that section |
| Section body fully empty | PanelShell header still renders, body slot empty (existing behaviour) |

### §10.3 Error states

None introduced. All surfaces are SSG from the JSON — a malformed entry hides its atom (never throws); the /resume Suspense fallback is pre-existing chrome.

### §10.4 Both-theme legibility (new visuals)

- chart-3 competency chips: safe both themes (light override exists, 4.75:1 — globals.css:573).
- chart-4 calendar bars: **new light-mode override required** beside the chart-2/3 precedent (hue-preserving, ≥3:1 on white card); dark unchanged.
- `bg-muted` tracks, `text-muted-foreground` proofs/labels/values: existing tokens, safe both themes.
- /resume + PDF: existing dark palette extended; print forces white/black as today.

---

## §11 Accessibility contract

### §11.1 Semantics

- Single `h2` per panel via PanelShell (unchanged); merged panel adds no second heading — channel rows are self-describing links (accessible name = "Email tilsizoglou@protonmail.com" style label+value text).
- Competency cards: `<ul>/<li>` list (countable); calendar rows are real-text rows with aria-hidden geometry (§5.5); /resume keeps h1 → h3 hierarchy with docx-verbatim headings.
- Calendar/competency visuals introduce no ARIA duplication — real DOM text carries the content.

### §11.2 Focus order (merged panel)

DOM order = visual order = tab order: description → meta row (non-focusable) → 9 channel rows in JSON key order → Full resume link **last**. No focus reordering, no `tabIndex` tricks. Drawer/tour focus machinery unchanged (Radix drawer trap; tour card-cycling + focus-on-card). The Full-resume-link move changes tab position accordingly — pinned, not accidental.

### §11.3 Touch targets

Every interactive row keeps `min-h-[44px]` (contact rows, resume link, drawer items, tour controls, header buttons) — the 375px invariant is unchanged; px-based heights stay px (never rem — the ≤640px font-size shrink rule).

### §11.4 Reduced motion

No new motion to suppress. Intro strip: existing matchMedia static-swap unchanged; the reserved-height fix (§6.5) is CSS-only.

---

## §12 Edge-case coverage (pinned)

| ID | Case | Pinned behaviour |
|---|---|---|
| E-01 | Year-only project date (`"2026"`, Clarif-AI + DeepIndex) | Row + verbatim date render; no bar — geometry never invented |
| E-02 | `"Ongoing"` date (Portfolio Website) | Same as E-01 |
| E-03 | Unparseable garbage date | Row + verbatim date, no bar; parser never throws (viz-data confinement) |
| E-04 | Zero parseable months dataset-wide | Whole calendar graceful-hides incl. wrapper margin |
| E-05 | Two projects, same ship month (June 2023 ×2) | Two independent rows — no collision possible (per-row tracks) |
| E-06 | Current-year column, future months | Empty cells; no invented bars |
| E-07 | `core_competencies` missing/empty | Explore: no cards; /resume + PDF: section omitted incl. heading |
| E-08 | Missing contact channel value | Row absent (existing graceful-hide) |
| E-09 | `about.title`/`about.location` empty | Meta item absent (existing) |
| E-10 | Zero featured certifications | /resume + PDF omit CERTIFICATIONS |
| E-11 | Zero featured articles | /resume + PDF omit SELECTED WRITING |
| E-12 | Legacy localStorage visited list contains `contact` | `parseVisitedIds` filters to the 4 valid ids — stale id dropped silently, counter correct |
| E-13 | Tour hole on the taller merged panel | `placeCard` R-10 gate docks the card — no placement change needed |
| E-14 | Hardcoded 5/7-length chrome arrays | `PRIMARY_LABELS` → 6, `DIGIT_ACCENTS` → 4, step bodies → 4, welcome "five"→"four" — all pinned in §6; the sr-only "of 7" becomes derived |
| E-15 | New 91-char intro string | Strip reserved height covers 3 wrapped lines at 375px — no post-hydration CLS (§6.5) |
| E-16 | Modal toggles: PROJECTS on + PUBLICATIONS on | Both sections render independently — the `!showArticles` coupling is removed (§7.5) |
| E-17 | Print overflow (long bullets/proofs at 210mm) | Wrap, never clip; `break-inside: avoid` per entry; multi-page flow allowed |
| E-18 | `/resume?print=true` | 1000ms auto-print unchanged against the new structure |
| E-19 | 375px horizontal overflow | None: merged rows `break-all`/wrap, calendar rows wrap, competency proofs wrap, no fixed widths beyond the px chrome bars |
| E-20 | Zero empty grid cells | 4 panels = 2×2 at md+; 8 competency cards = 4×2 at lg |
| E-21 | Stale `#contact` hash navigation | No `#contact` anchors exist in the repo (verified) — removal introduces none |
| E-22 | recharts after removal | Zero imports remain under `src/components/explore/**`; dependency removal is the plan-time gate decision (D-06 discretion), not a UI behaviour |

---

## §13 UNRESOLVED items (planner assumes the default)

| ID | Question | Default assumption |
|---|---|---|
| U-1 | Merged panel label wording: "About" vs "About & Contact" | **"About"** — id/label stay, chrome text elsewhere stays stable; contacts are self-evident rows |
| U-2 | Do the skills chip groups (soft/hard/languages) stay below the competency cards? | **Removed** — the locked notes say "competency + proof cards ONLY"; skills inventory stays CLI-reachable; `skillsGroupCounts`/`skillGroupFill` deleted with the chips unless the user overrides |
| U-3 | Exact competency chip classes | Badge `variant="outline"` + `font-normal pointer-events-none text-chart-3 border-chart-3/40` (§4.2) |
| U-4 | /resume experience role-selection mechanism | Keep the existing `isTechRelated` filter — it already yields exactly the docx's 3 roles; the data write swaps the bullets |
| U-5 | /resume + PDF heading labels: docx-verbatim vs `.EXE`-style chrome | **Docx-verbatim labels**, `//` prefix chrome retained, `.EXE/.SH/...` suffixes dropped |
| U-6 | Projects featured mechanism + deepindex-before-Clarif-AI ordering | Featured flags on the docx's two; UI renders data order (never sorts); the data write orders deepindex → Clarif-AI to match the docx |
| U-7 | recharts removed from package.json? | Plan-time decision gated on zero remaining usages (already flagged in CONTEXT discretion) — not a UI decision |

---

## §14 Falsifiable UI acceptance checks

1. **Grid:** source contains `md:grid-cols-2`, no `lg:grid-cols-3`, no `col-span` on panels; at 768/1024/1440 the grid resolves 2×2 with DOM order about→experience→skills→projects; zero empty cells.
2. **Merged panel:** `#about` contains the description, the meta row, all 9 channel rows (or fewer per E-08), and the Full resume link as the LAST interactive element; no `#contact` element exists on /explore.
3. **Chrome:** drawer renders 4 anchors (digits 01–04); status bar renders `N/4 sections visited` with `4/4` in `text-accent`; tour = 6 steps, visible + sr-only counters say "of 6", welcome copy says four sections, PRIMARY_LABELS has 6 entries.
4. **Skills:** card count === `data.core_competencies.length` (expected 8); every card = chip + proof; `skills-chart.tsx`/`skills-treemap.tsx` deleted; grep proves zero `recharts` imports under `src/components/explore/**`.
5. **Calendar:** year axis 2016→2026 (11 columns, ticks at each January); 14 rows in JSON order; exactly 11 bars (one per Month-YYYY project), 0 bars for E-01/E-02 rows; bars `aria-hidden`, row text real; first child above the stat tiles.
6. **/resume:** DOM section order SUMMARY → CORE COMPETENCIES → PROFESSIONAL EXPERIENCE → PROJECTS → EDUCATION → CERTIFICATIONS → SELECTED WRITING; single-column; print stylesheet pins 210mm A4 with sidebar rules gone; toggle + print button + `?print=true` intact; experience renders full bullet lists.
7. **PDF:** `npm run build:resume` output contains the 7 docx sections in order, zero hardcoded skill-tag arrays, PROJECTS present with deepindex before Clarif-AI.
8. **375px:** no horizontal scroll on /explore or /resume; intro strip statically reserves 3 lines; calendar year ticks do not overlap.
9. **Themes:** light-mode `--chart-4` override present; every new text/color pair ≥3:1 on card backgrounds in both themes.
10. **Motion:** zero new `animate-*`/`transition-*`/keyframes in the diff.

---

## §15 Stale-test surface (executor must reconcile — stale-test discipline)

| Test file | Fate |
|---|---|
| `tests/explore-visuals-skills.test.mjs` | Rewritten to the competency-card contract (or removed + replaced) — chart/treemap assertions go stale |
| `tests/explore-visuals-server.test.mjs` | `techMentions` tests removed; `buildProjectsCalendar` tests added (geometry, E-01/02/03/04, injectable now) |
| `tests/explore-visuals.test.mjs` | Career-span suite untouched; projects-calendar component assertions added |
| `tests/explore-shell.test.mjs` | `0/5` literals → `0/4` |
| `tests/explore-tour.test.mjs` | 7-step fixtures → 6; step-count/label assertions; key-disjointness greps unchanged |
| `tests/explore-sweep.test.mjs` | 5-panel sweep → 4-panel |
| `tests/explore-header.test.mjs` | Likely untouched (title truncation is data-driven) — verify longer-title fixture |
| `tests/explore-routing.test.mjs` | Untouched |

Doc comments carrying stale literals ("0/5", "of 7", "five panels/sections", "Five panels" in explore-panels.tsx header) update with the code they describe.

---

*End of UI-SPEC — EXPLORE-06 explore-revision. Planner: assume §13 defaults unless the user overrides; every §12 case must be traceable to a plan task or a test.*