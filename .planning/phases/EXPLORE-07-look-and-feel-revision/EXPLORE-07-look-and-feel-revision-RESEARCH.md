All evidence gathered. Here is the full RESEARCH.md:

---

# EXPLORE-07 look-and-feel-revision — RESEARCH.md

**Gathered:** 2026-09-24 (this session) · **Branch:** `phase-7` · **Baseline:** 200/200 tests green (`node --test tests/*.mjs`, Node v24.16.0) [VERIFIED: run this session, `ℹ tests 200 / pass 200 / fail 0`]

Provenance tags: `[VERIFIED: <source>]` = confirmed via a tool this session against the real tree; `[CITED: <url>]` = official docs; `[SKILL: <path>:L]` = installed skill file read this session; `[ASSUMED]` = training knowledge only. All in-repo discrete values below were read this session with path + line numbers.

---

## 1. Domain analysis

### 1.1 What /explore is today (the surgical map)

The `/explore` surface is a client-boundary shell over four server-rendered panels, fully SSG-exported to `out/explore.html` (`output: 'export'`, next.config.ts) [VERIFIED: src/app/explore/page.tsx:38-52, src/components/explore/explore-shell.tsx:57-82]. Composition: `ExploreShell` (client, owns theme/visited/tour state) → `ExploreHeader` → intro slot (`ExploreIntro`, client typewriter) → `<main>` (only scroll container) → `ExplorePanels` (server, 4× `PanelShell`) → `ExploreStatusBar` → `ExploreTour` overlay (in-flow fixed, **never portaled**, rendered as shell root's LAST child) [VERIFIED: explore-shell.tsx:57-82; explore-tour.tsx:9-14].

Panel grid: `explore-panels.tsx:65` — `<div className="grid grid-cols-1 gap-4 md:grid-cols-2">`, 4 panels in `EXPLORE_SECTIONS` DOM order (about → experience → skills → projects) [VERIFIED: explore-panels.tsx:63-80; constants.ts:10-15]. Panel chrome: `panel-shell.tsx:39-52` — `rounded-md border bg-card p-4` + chip+label header row + `mt-3` body slot, hover-inert (a test bans `hover:` in that file's code, see §5 R2) [VERIFIED: panel-shell.tsx:38-53; tests/explore-shell.test.mjs:295-303].

### 1.2 The two charts to kill (REV-08) — verified blast radius

**Files to DELETE** [VERIFIED: exist today]:
- `src/components/explore/sections/career-span-chart.tsx` (79 lines — dumb server renderer of precomputed percentages; no hooks, no client directive).
- `src/components/explore/sections/projects-calendar.tsx` (78 lines — same pattern).

**`viz-data.ts` removals** (exact line numbers read this session) [VERIFIED: grep -n on src/components/explore/viz-data.ts]:
| Symbol | Lines | Fate |
|---|---|---|
| `parseDuration` block: header comment `parseDuration — "Sept 2023 — Present" \| "November 2017 - April 2018" \| …` (22), `MONTH_NAMES` (33), `parseMonthToken` (~53-59), `YEAR_PATTERN` (61), `parseMonthYear` (~63-76), `ParsedDuration` interface (~21-31), `parseDuration` (86) | ~21-99 | REMOVE (U-6) — sole consumers are the two builders (verified: only `buildCareerSpan` calls `parseDuration` at viz-data.ts:245; only `parseDuration`+`buildProjectCalendar` use `parseMonthYear`; only the chart suites import `parseDuration` from tests) |
| `buildCareerSpan` + `CareerSpanRow`/`CareerSpanData`/`YearTick` + `monthIndex` (219) | 194-289 | REMOVE |
| `buildProjectCalendar` + `ProjectCalendarRow`/`ProjectCalendarData` + `YEAR_ONLY_PATTERN` (311) | 292-382 (EOF) | REMOVE |
| **Survivors:** `skillGroupFill` (119), `skillsGroupCounts` (135), `GLOBAL_YEAR_PATTERN` (165), `projectStats` (175) | — | KEEP — live consumers: skills-section chips (skills-section.tsx:33,43), project tiles (projects-section.tsx:30,44; project-stat-tiles.tsx:12) |
| File header claim "The ONLY duration/date parsing and mention-matching site" (viz-data.ts:8-9) | 3-24 | UPDATE — false once the parse block dies; `projectStats` keeps its own year-pattern |

**Section edits** [VERIFIED]:
- `experience-section.tsx:30,32,43-51` — imports `buildCareerSpan` + `CareerSpanChart`, computes `span`/`hasSpan`, renders the `mb-5` Gantt wrapper. Post-removal the rail+dots `<ol>` (line 52) becomes the first body child. The timeline body itself (`slice(0,3)` cap, chart-2 dots, verbatim duration/location, ≤3 bullets, `TerminalPointer`) stays byte-identical per REV-07 deferral except the taste-level meta-row merge (U-8 default) [VERIFIED: experience-section.tsx:34-91; UI-SPEC §3.1].
- `projects-section.tsx:30,33,45-53` — imports `buildProjectCalendar` + `ProjectsCalendar`, `hasCalendar` gate + `mb-5` wrapper. Post-removal order: stat-tiles wrapper (`mb-3`) → ≤6 cards → pointer [VERIFIED: projects-section.tsx:44-56].
- `constants.ts:97` — tour experience-step body `"Roles in order, with the career-span chart on top for the shape of it."` — dangling chart reference, REWRITE (U-10). Constraints on replacement copy verified in §5 R1.

**Ripple check:** the only src consumers of the deleted symbols are the two sections, viz-data itself, and the tour copy — `/resume`, CLI, PDF never import them [VERIFIED: repo grep this session across src/tests/scripts].

### 1.3 Token/CSS layer (the IDE rail)

- Tokens: `.explore-shell` block at globals.css:499-534 (dark, `--background: 220 13% 9%` … `--radius: 0.25rem`), `.light .explore-shell` at 539-580, scoped light overrides `--chart-2: 160 65% 32%` (576), `--chart-3: 30 75% 38%` (577), `--chart-4: 280 65% 40%` (578); root CLI chart tokens at 37-41 (`--chart-4: 280 65% 60%` dark) [VERIFIED: sed 480-598 + grep this session].
- **globals.css is exactly 598 lines; the reduced-motion guard is the file's LAST block** (`@media (prefers-reduced-motion: reduce)` at 586-598: `.explore-shell *, .explore-shell .animate-pulse, body:has(.explore-shell) [data-state="open"/"closed"] { animation: none !important; transition: none !important; }` + scroll-behavior override) [VERIFIED: wc -l = 598; sed 586-598]. Guard tests assert presence of these exact selector strings, not byte-identity (tests/explore-shell.test.mjs:171-177) — adding new CSS elsewhere is safe; appending `--panel-shadow-hover` lines inside the two token blocks touches no asserted value [VERIFIED: the light-block test only bans `--chart-1` there, explore-shell.test.mjs:157-167].
- `--chart-4` stays live after the calendar dies: consumed by the Projects panel accent chip (`bg-chart-4`, explore-panels.tsx:40), the drawer digit accent (`text-chart-4`, explore-drawer.tsx:37), and the tour accent map (constants.ts:65) [VERIFIED: grep]. The `--chart-2` token stays live via the timeline dots (experience-section.tsx:62) and the Experience accent chip. **Do not strip "orphan-looking" chart tokens.**
- Existing motion in the shell: phase-3 `transition-colors` on linked project card name/arrow (projects-section.tsx:61,65); instant `group-hover:underline` on contact labels (about-section.tsx:104); inline `@keyframes tour-dim-in` in the tour client wrapper (explore-tour.tsx:374); typewriter via reused CLI `TypingEffect` (explore-intro.tsx:30-53). Everything else transition-free [VERIFIED: grep transition/animate under src/components/explore].

### 1.4 Design-skill guidance distilled (the three locked governors)

**motion-design** [SKILL: ~/.dsh/skills/motion-design/SKILL.md]:
- Stagger budgets: "Micro cascade 20-40ms, total <200ms"; hard cap "Total stagger must stay under 500ms" (lines 220-227). The pinned 4×40ms + 240ms = 360ms budget fits [VERIFIED arithmetic; CONTEXT D-04].
- Weight classification: cards/panels = Medium, 200-350ms (line 256) — supports the locked 200-280ms hover window; the separate "Hover: <100ms" row (line 129) is the micro-feedback row, not the card-lift row — **D-04's 200-280ms governs** (locked decision, not relitigated).
- Easing direction: entrance → decelerate/ease-out family (lines 140-144); no bounce for calm personas.

**design-taste-frontend** [SKILL: ~/.dsh/skills/design-taste-frontend/SKILL.md]:
- Dials B = VARIANCE 5 / MOTION 3 / DENSITY 4 (user pick, D-01). MOTION 1-3 = "No automatic animations. CSS :hover and :active states only" (line 561); 4-7 = "Fluid CSS… animation-delay cascades for load-ins" (line 563). **The one pinned entrance (D-04) is a deliberate user-approved exception inside the locked vocabulary — implement D-04 as written; the closed M1-M5 inventory (UI-SPEC §6.5) is the fence.**
- Animate only transform/opacity (+box-shadow); never top/left/width/height (§6.A, line 520-523). The pinned vocabulary complies (translateY/translateX/box-shadow/opacity only).
- Reduced motion mandatory ≥ MOTION 3 — already satisfied by the existing guard; no `@media` additions needed [SKILL §6.B; guard verified live].
- Preservation rules for redesign mode: keep IA/ids, brand tokens, copy voice; honor a11y wins (§11.C). The audit table disposition vocabulary maps to this.
- Banned-pattern collisions to adjudicate consciously (all resolved toward the locked decisions, see §6): section-number eyebrow ban (§9.F "NO section-number eyebrows") vs D-02's oversized mono index — different device (oversized ghost numeral via `ml-auto`, not a small uppercase micro-label above the headline); em-dash ban (§9.G) vs chrome copy that already uses em-dashes and verbatim data durations — data fidelity + copy-voice preservation win; middle-dot rationing (max 1/line) — the merged meta row uses exactly one ` · `.

**redesign-existing-projects** [SKILL: ~/.dsh/skills/redesign-existing-projects/SKILL.md]:
- Sequence: Scan → Diagnose → Fix (lines 10-14); audit table columns per UI-SPEC §8 (`Region | Area | Generic pattern | Disposition | Fix locus | Test/no-op proof`); dispositions `fixed` / `kept-by-design` / `no-op` (UI-SPEC §8).
- "Generic box-shadow → tint to the background hue" (line 38) — the `--panel-shadow-hover` hsl-tinted recipe implements exactly this.
- Fix priority: typography → color → hover/active states → layout/spacing → components → states → polish (lines 159-169) — maps to the audit table's fix order.

### 1.5 CSS mechanics of the entrance (verified web-platform behavior)

- The `animation` **shorthand resets every animation longhand it doesn't list — including `animation-delay`** ("If any of the components are not included in an animation declaration, the component value is set to the component's initial value") [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/animation]. Therefore the `.panel-grid > *:nth-child(n) { animation-delay: … }` rules **must appear after the `animation:` shorthand rule and carry higher specificity** — `.explore-shell .panel-grid > *:nth-child(2)` is (0,3,1) vs the shorthand's (0,2,1), so later-in-file + higher specificity wins [CITED: same page; CSS cascade]. The UI-SPEC §6.2 CSS block is correct as ordered; planners must not re-order it.
- `animation-fill-mode: backwards` "applies the values defined in the first relevant keyframe as soon as it is applied to the target, and retains this during the animation-delay period" — panels 2-4 hold `opacity:0; translateY(8px)` through their 40/80/120ms delays; no flash-then-jump [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode].
- An active CSS animation of `transform` creates a stacking context / containing block for the animated element while it runs [CITED: same page, stacking-context note]. The four panels contain no `position: fixed` descendants, so the 0-360ms window is safe; the tour overlay is a sibling subtree under the shell root, never transformed.
- **R-6 hard constraint (pre-existing, verified):** explore-tour.tsx:35-36 — "NEVER add transform / animate-* classes to .explore-shell or any ancestor between it and the viewport, or every overlay coordinate silently breaks." The stagger must only ever target `.panel-grid > *` — never the shell root, `<main>`, or any tour ancestor [VERIFIED: explore-tour.tsx:33-37].

### 1.4.1 Test-suite inventory (baseline 200) and per-suite disposition

Per-file test counts (all `grep -c '^test('`, this session): explore-header 9, explore-routing 7, explore-shell 30, explore-sweep 14, explore-tour 43, explore-visuals-server 15, explore-visuals-skills 10, explore-visuals 29, portfolio-data-integrity 18, projects-calendar 11, resume-docx-order 14 = **200** [VERIFIED]. Affected suites:

| Suite (count) | Disposition (from UI-SPEC §2.2, verified against the file this session) |
|---|---|
| `tests/projects-calendar.test.mjs` (11) | DROP entire (its `--chart-4` CSS pin dies with it — see §5 R10) |
| `tests/explore-visuals-server.test.mjs` (15) | Career-span block (~28-107: server purity, aria/tick pins, `<CareerSpanChart` composition, `buildCareerSpan(experience)` source asserts, and the dual-path "gantt files" no-sort/no-replace tests that read `ganttPath`) REMOVE; rewrite an experience-section composition test (timeline `<ol>` first child, no chart import); the Task-2 stat-tiles block (~108-162) survives untouched |
| `tests/explore-visuals.test.mjs` (29) | parseDuration tracer tests (52, 115) DROP with U-6; `buildCareerSpan` Task-4 block (~239-360) DROP; import line (40-41) shrink to `{skillGroupFill, skillsGroupCounts, projectStats}`; cross-cutting block (357-436): `serverSlices` (357-361) drops both deleted paths (three `codeOf()` tests otherwise go ENOENT-red) and the "sole parsing site" test (417-436) INVERTS to assert `parseDuration`/`buildCareerSpan`/`buildProjectCalendar`/`YEAR_PATTERN` ABSENT while `skillGroupFill`/`skillsGroupCounts`/`projectStats`/`GLOBAL_YEAR_PATTERN` stay pinned; export tests (~580-592 calendar, ~597-623 Gantt) — calendar test REWRITES to absence + tiles/cards presence (do **not** reuse its all-14-names loop — only 6 cards render), Gantt export test DROPS (it imports `parseDuration`+`buildCareerSpan` directly at 599-608); competency-cards export test (558) survives REV-09 (presentation classes only) |
| `tests/explore-tour.test.mjs` (43) | Mostly survives. Copy guard (111-133): every step heading/announce/body must be non-empty with **no digits beyond "60"**; no test pins the experience step body's exact words (only about/skills/projects bodies are asserted, explore-tour.test.mjs:145-165) — the constants.ts:97 rewrite is test-safe under those two constraints |
| `tests/explore-shell.test.mjs` (30) | Grid regex `/grid-cols-1 gap-4 md:grid-cols-2/` (312) still matches `…md:grid-cols-2 lg:gap-5` (substring); panel-shell anatomy test bans `hover:`/`cursor-pointer`/`tabIndex` in panel-shell.tsx code (300-303) — the new `index` prop and aria-hidden index span are safe; guard-selector greps (171-177) pin existing strings only |
| `tests/explore-sweep.test.mjs` (14) | Grid/`max-w-` greps (48-66) unaffected by appending ` lg:gap-5`; keep passing |

Suite count will drift from 200 — SPEC acceptance reads as "the full suite green on the final tree"; record the delta in the phase SUMMARY [VERIFIED: UI-SPEC §2.2 row "Suite count"].

---

## 2. Package legitimacy

**No new dependencies are proposed — D-05 forbids them and none are needed.** Everything the phase needs is already installed and verified in-repo:

| Claim | Evidence |
|---|---|
| `recharts` is fully absent (phase-6 already removed it; deps = 38 keys, pinned by a test) | `grep -c recharts package-lock.json` → 0 [VERIFIED]; tests/explore-visuals.test.mjs:512-515 asserts `Object.keys(pkg.dependencies).length === 38` and no `recharts` key [VERIFIED] |
| Tailwind **3.4.19** installed; `group-focus-visible:` (M5 keyboard-parity underline) compiles on this exact version | `node -e` postcss+tailwindcss compile of `group-focus-visible:underline` this session → emitted `.group:focus-visible .group-focus-visible\:underline { text-decoration-line: underline }` [VERIFIED: in-repo compile] |
| `tailwindcss-animate` plugin present (existing; accordion keyframes only) — not needed by this phase | tailwind.config.ts:88-89 [VERIFIED] |
| `lucide-react` 0.475.0 — all nudge-target icons already imported in about-section.tsx (Mail/Linkedin/Github/Medium-as-PenLine/Facebook/Instagram/Twitter/Twitch/Globe, Briefcase/MapPin, FileText/ArrowRight) | about-section.tsx:27-42 [VERIFIED] |
| No JS animation libs (framer-motion/gsap/lottie/`requestAnimationFrame` usage) exist under src/components/explore | grep this session → zero [VERIFIED] |
| Test runner is **Node built-in, no npm test script exists** — suites run directly (`node --test tests/<file>.mjs`; full suite `node --test tests/*.mjs`); type-stripping of imported `.ts` modules needs Node ≥ 23.6, so tests are local-only | package.json scripts (no `test`) [VERIFIED]; suite headers [VERIFIED: explore-visuals.test.mjs:17-24]; baseline run on Node v24.16.0 [VERIFIED] |
| CI = Node 20 + `npm install` + `npm run build` only; never runs tests | .github/workflows/deploy.yml:30,39-40,59 [VERIFIED] |

Package names beyond the repo's own dependency list are not proposed by this research; the "skills are instruction-only, not dependencies" constraint is a locked SPEC constraint [VERIFIED: SPEC Constraints line 41].

---

## 3. Risks

1. **R1 — Tour-copy test constraints (medium).** The replacement experience step body must (a) contain no digits beyond the allowed "60" (digit-guard loop over all headings/announce/bodies, tests/explore-tour.test.mjs:113-131) and (b) not mention "career-span"/chart (the new absence check, UI-SPEC §10.2). Suggested copy in UI-SPEC §2.1 satisfies both. Any wording with digits (e.g. "4 sections") fails the guard.
2. **R2 — panel-shell.tsx source greps (medium).** tests/explore-shell.test.mjs:300-303 bans `hover:`, `cursor-pointer`, `tabIndex` in panel-shell.tsx code (comments stripped). The `index: string` prop + aria-hidden index span are safe; never add hover classes to PanelShell itself.
3. **R3 — zero-stat-literal greps (low).** The cross-cutting test greps touched section files for standalone `14`, `9`, `2016`, `2026` and `count[=:]\s*\d` (explore-visuals.test.mjs:438-457). New code must not introduce them; the index device computes from `String(index + 1).padStart(2, '0')` — no banned literals.
4. **R4 — animation-shorthand reset order (high if ignored).** `animation-delay` rules must follow the `animation:` shorthand in source order (§1.5) or the stagger flattens to simultaneous [CITED: MDN animation].
5. **R5 — no transform on the tour's ancestor chain (high if ignored).** R-6 pin at explore-tour.tsx:33-37; the stagger targets panel children only. The executor must not hang `exp-lift`/animation classes on `.explore-shell`, `<main>`, or the grid container itself.
6. **R6 — reduced-motion behaviour of hover states (accepted, document).** The guard kills `transition` but not the hover property values — the 2px lift/2px nudge apply INSTANTLY under reduce, matching the phase-3 precedent [VERIFIED: guard text + UI-SPEC §9.1].
7. **R7 — export tests need a fresh build (gate ordering).** All export-level tests read `out/explore.html`; the final gate must run `npm run build` **before** `node --test tests/*.mjs`, and the full gate (build + `npm run typecheck` + suite) must be the chronologically last action on the final tree (green-gate-finality; SPEC acceptance line 50) [VERIFIED: suite convention, explore-visuals.test.mjs:547-549].
8. **R8 — suite-count drift vs the "200-test" acceptance wording (low).** Record the final count + delta in SUMMARY; the SPEC's own note (UI-SPEC §2.2) anticipates it.
9. **R9 — BFCache/back-nav replay of the entrance (accepted).** Cosmetic; note in the CSS comment (UI-SPEC §9.3).
10. **R10 — the light `--chart-4` override loses its pin when projects-calendar.test.mjs dies (low).** The token remains live and justified (accent chip, drawer digits, tour accents — §1.3). Default: keep the CSS byte-stable, record the disposition in the audit table; optionally re-pin chart-4 in a rewritten test. The chart-2/3 pins survive independently in explore-visuals-skills.test.mjs:157-171 [VERIFIED].
11. **R11 — stale doc comments (low, cheap).** After the edits these prose claims are false: viz-data.ts:8 "ONLY duration/date parsing site"; experience-section.tsx:19-23 (Gantt paragraphs); projects-section.tsx:12-15 (calendar paragraphs); explore-status-bar.tsx:7-8 ("N/5" — code renders `EXPLORE_SECTIONS.length` = 4 and tests already assert "0/4 sections visited", explore-shell.test.mjs:392, explore-tour.test.mjs:586). Update comments in the same commits; test greps strip comments so greps are unaffected.
12. **R12 — `max-w-` ban on explore-panels.tsx (low).** explore-sweep.test.mjs:66 bans `max-w-` there; the `panel-grid` class addition must not carry one.
13. **R13 — em-dash policy for new copy (low, adjudicate once).** The taste skill bans em-dashes in new copy [SKILL §9.G], but existing chrome copy uses them ("the full story lives in the terminal — start with help", constants.ts:91) and data strings render verbatim (durations, `name — title`). Default: follow the UI-SPEC's suggested tour copy (house voice, preservation rule 11.C); data strings stay verbatim (data-fidelity invariants outrank the ban); no *other* new copy is needed.
14. **R14 — touch-device `:hover` stickiness (accepted, pre-existing).** No new mitigation; IDE context (UI-SPEC §9.3).

---

## 4. Open Questions

None unresolved — every question carries a verified default from the locked CONTEXT, the UI-SPEC §11 register, or a test constraint read this session. The planner may adopt these defaults without further interviewing.

- OQ-1 (U-1): Exact shadow blur/alpha values? — **(RESOLVED)** defaults pinned: dark `0 6px 16px -4px hsl(220 13% 5% / 0.55)`, light `0 6px 16px -4px hsl(220 20% 20% / 0.15)`, defined once per theme block (UI-SPEC §6.4; discretion D-02).
- OQ-2 (U-2): Does the intro strip join the stagger? — **(RESOLVED)** typewriter-only, excluded (UI-SPEC §1.1/§6.2; CONTEXT discretion).
- OQ-3 (U-3): Stagger curve? — **(RESOLVED)** 240ms each, flat 40ms × index, total 360ms < 500ms skill budget (UI-SPEC §6.1-6.2; motion-design micro-cascade row).
- OQ-4 (U-4): `:active` press states? — **(RESOLVED)** press-settle via an `.explore-shell .exp-lift:active` rule ordered after the hover rule (translateY(0), same 220ms curve); header controls `active:bg-muted/80`; both recorded as audit rows (UI-SPEC §7; commit b5b2721 W-5).
- OQ-5 (U-5): Resume row's ArrowRight joins M3? — **(RESOLVED)** add (UI-SPEC §7).
- OQ-6 (U-6): Remove `parseDuration`/`parseMonthToken`/`MONTH_NAMES`/`YEAR_PATTERN`/`parseMonthYear`/`monthIndex` after both builders die? — **(RESOLVED)** remove; verified dead: only consumers are the two builders + their tests (grep this session; §1.2 table).
- OQ-7 (U-7/U-10): Index size/opacity and tour copy wording? — **(RESOLVED)** `text-2xl font-medium tabular-nums text-muted-foreground/50`, `aria-hidden`, `ml-auto` on the four PanelShell headers only; tour copy per UI-SPEC §2.1 subject to R1's guard (UI-SPEC §5/§2.1).
- OQ-8 (U-8): Experience meta framing? — **(RESOLVED)** merged duration·location meta row, both strings verbatim, wraps at 375px; the audit table may keep two lines instead (UI-SPEC §3.1).
- OQ-9 (U-9): Final audit-table rows? — **(RESOLVED)** seeded rows in UI-SPEC §8 are the starting grid; the executor's skill run validates/amends/refutes per the redesign skill protocol (D-01).
- OQ-A: Where do the two `--panel-shadow-hover` lines go? — **(RESOLVED)** appended INSIDE the existing `.explore-shell` and `.light .explore-shell` token blocks (UI-SPEC §0 rail: "the ONLY allowed addition is the two custom-property lines"; no asserted value is touched — §1.3).
- OQ-B: Where does the new motion CSS live relative to the guard? — **(RESOLVED)** a new scoped block inserted BEFORE the guard (globals.css ends at the guard, line 598; guard stays the byte-stable file tail; `!important` makes order irrelevant anyway).
- OQ-C: Re-pin `--chart-4` after the calendar suite dies? — **(RESOLVED)** keep the override line (token live via accent chip/drawer digits/tour accents), record the disposition in the audit table; no new pin required (R10).
- OQ-D: How does the rewritten calendar export test avoid the all-14-names trap? — **(RESOLVED)** assert calendar absence + tiles presence + the 6 card names (`projects.slice(0, 6)`), not all 14 (only cards render; §1.4.1).
- OQ-E: Do the entrance's `backwards` fill and delay rules behave as the UI-SPEC assumes? — **(RESOLVED)** verified against MDN (§1.5), with the source-order requirement noted (R4).

**No unresolved blockers. Planning can proceed on the UI-SPEC defaults.**

---

## 5. Architectural Responsibility Map

Tier assignment so each capability lands in the right plan/file. (No security-sensitive capability exists in this phase; the trust-relevant `target="_blank" rel="noopener noreferrer"` pairs on outbound links are presentation-tier and must remain untouched.)

| Capability | Tier | Home (verified) | Notes |
|---|---|---|---|
| Chart/geometry removal (`buildCareerSpan`, `buildProjectCalendar`, parse block) | **Data/domain** | `src/components/explore/viz-data.ts` (pure, zero-runtime-import module — Node-24 type-stripping contract) | Survivors: `skillGroupFill`, `skillsGroupCounts`, `GLOBAL_YEAR_PATTERN`, `projectStats` |
| Experience/Projects panel bodies (chart excision, meta-row merge, class additions) | **Presentation** | `experience-section.tsx`, `projects-section.tsx`, `project-stat-tiles.tsx` | Server components; no parsing inline ever (D-05 invariant survives — viz-data stays the sole data-shaping module) |
| Competency card restyle (§4: alternating chip, exp-lift, mt-2) | **Presentation** | `skills-section.tsx` | Chips loop + overrides + pointer byte-identical |
| Index device 01-04 (§5) | **Presentation (chrome)** | `panel-shell.tsx` (new `index` prop) + `explore-panels.tsx` (feeds `String(i+1).padStart(2,'0')`) | `aria-hidden`; drawer/tour/status excluded |
| Hover-lift + nudge class usage (`exp-lift`, `exp-nudge` on icons/labels) | **Presentation** | sections + `about-section.tsx` contact rows | Class names only; all motion declarations live in globals.css |
| Micro-motion declarations (keyframes, transitions, shadow tokens) | **Styling/infra** | `globals.css` (scoped under `.explore-shell`) | Guard block 586-598 UNMODIFIED; guard remains the file's last block |
| Tour step copy rewrite | **Presentation-chrome copy** | `constants.ts:97` (module-private `EXPLORE_TOUR_STEP_BODIES`) | Falsifiable only via source-grep (identifier not exported) |
| Gap-4→gap-5 gutter + `panel-grid` class | **Presentation/layout** | `explore-panels.tsx:65` | `lg:gap-5` only; no `max-w-` |
| Integration tier | **Empty — deliberate** | — | Zero new deps, zero JS animation APIs, no route/IA changes; static export must keep holding |

Wrong-tier placements that would be BLOCKERs: parsing or date math in section components (violates the D-05 sole-parsing-site invariant); motion JS in any explore file (violates REV-11/D-04); motion CSS outside `.explore-shell` scope (uncovered by the guard); tokens edited or guard modified (violates D-05 rail).

---

## 6. Validation Architecture

Automated checks per behaviour (the coverage gate consumes this):

| Behaviour (REQ) | Proof |
|---|---|
| REV-08 charts gone | `node --test` source greps: both files `existsSync === false`; `viz-data.ts` contains neither builder nor the parse block (inverted "sole parsing site" test); sections import neither builder; `projects-calendar.test.mjs` absent from tests/ |
| REV-08 Projects = tiles+cards | composition greps: `<ProjectStatTiles` before `cards.map(`, no `<ProjectsCalendar`; export-HTML: calendar aria-label prefix `"Projects calendar — "` ABSENT, 6 card names + tile value/label pairs present (fresh `out/explore.html`) |
| REV-08 Experience non-chart showcase | composition test: `<ol>` is the first body child; no chart import; `slice(0, 3)`/verbatim `{entry.duration}` pins survive; export test: all 7 company names still render (they come from the timeline, not the chart) |
| REV-09 cards restyled | source greps: alternating chip wrapper (`self-start`/`self-end` on an index-parity conditional), `exp-lift` on the competency `<li>`, proof `mt-2`, grid/padding pins unchanged; export: every competency name+proof still renders verbatim (existing test, untouched) |
| REV-10 audit-first | process check: `EXPLORE-07-AUDIT.md` committed BEFORE fix commits (its own commit; git history is the proof); all 8 mandatory regions covered; every row carries a disposition + test-linkage or no-op proof |
| REV-11 CSS-only motion | negative greps under `src/components/explore/`: no `requestAnimationFrame`, `el.animate(`, framer-motion, gsap, lottie; every new `animation`/`transition` declaration's selector chain includes `.explore-shell`; keyframes `explore-panel-in` + 40/80/120ms nth-child delays + `backwards` present; `panel-grid` class on the panels container; pinned curve `cubic-bezier(0.25, 1, 0.5, 1)` and durations within 200-280ms; `--panel-shadow-hover` defined exactly in both theme blocks; guard block byte-identical (existing selector-string assertions keep passing) |
| Focus parity (M2/M5) | `exp-lift:focus-visible` composes ring layers + bloom (the three-layer box-shadow form); `group-focus-visible:underline` on underlined links (compiles on 3.4.19 — §2) |
| 375px / layout invariants | explore-sweep suite green (grid classes still substring-match; no `max-w-`; no col-span); gap-5 asserted lg-only |
| IDE rail preserved | panel-shell anatomy greps (chip/label/slot, hover-inert); JetBrains-Mono font-family line untouched; guard block untouched; themes/tokens untouched except the two sanctioned custom properties |
| Final gate (chronologically last) | `npm run build` → `npm run typecheck` → `node --test tests/*.mjs` all green on the final tree; suite count + delta recorded; **no writes after the last green run** (green-gate-finality) |
| Manual (M-rows for the verify step, static HTML cannot carry them) | motion feel under editorial-calm in both themes; 375px visual pass; entrance timing; hover bloom intensity (U-1 defaults) |

---

## 6. Project Constraints (from planning artefacts + repo conventions)

- **Locked SPEC constraints** [VERIFIED: SPEC.md:39-46]: skills are guidance, not dependencies (no package installs, no GSAP/Framer/Lottie, CSS-only motion inside the existing guard); audit-first with the table committed before fixes; IDE aesthetic is the hard rail (tokens, JetBrains Mono, PanelShell chrome, themes, drawer/header/status structure, 375px no-horizontal-scroll, 44px targets — tune WITHIN, never replace); static export survives (no client-only rendering); stale-test discipline for both removals with the gate green chronologically last; REV-07 stays deferred (no speculative layout invention).
- **CONTEXT D-01…D-05 are LOCKED** — dials 5/3/4, the pinned effect list, the removal list, the Editorial-calm vocabulary, the rails [VERIFIED: CONTEXT.md].
- **Test conventions**: Node built-in runner, no npm test script, run per-file or globbed; suites import `.ts` modules directly (Node ≥ 23.6 type stripping); banned-literal greps strip doc comments before judging code (`codeOf` convention); export tests fail with a build hint until `npm run build` produces `out/explore.html` [VERIFIED: suite headers].
- **CI**: Node 20, `npm install`, `npm run build` only — tests are local-only [VERIFIED: .github/workflows/deploy.yml].
- **Commit conventions** (from git log): `type(scope): message` — `feat(EXPLORE-06-…)`, `docs(planning)…`; atomic per task; docs/planning commits precede code [VERIFIED: `git log --oneline`].
- **Working tree**: branch `phase-7`; only `.planning/STATE.md` modified + untracked tool artifacts (`.deepindex.db`, PDFs, `.cursor/`, tsbuildinfo) — nothing dirty in `src/` or `tests/` [VERIFIED: git status].
- **Stale-comment hygiene**: comments are prose the tests strip, but they anchor human review — update the four stale claims listed in R11 within the commits that invalidate them.
- **UI-SPEC is the binding design contract** for this phase's how-level decisions; this RESEARCH adds verification, blast-radius detail, and web-platform mechanics on top — it does not supersede it.

---

*RESEARCH.md gathered 2026-09-24 from codebase inspection, the three installed SKILL.md files, the phase-7 SPEC + UI-SPEC, the 11-suite test inventory, two MDN fetches, and an in-repo Tailwind compile check. Baseline: 200/200 tests green on `phase-7` @ b5b2721.*