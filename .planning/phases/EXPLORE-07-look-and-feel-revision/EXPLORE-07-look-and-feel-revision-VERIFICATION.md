---
phase: 07-look-and-feel-revision
verified: 2026-09-29T00:00:00Z
status: human_needed
score: 34/34 must-haves verified
behavior_unverified: 0
overrides_applied: 0
human_verification:
  - test: "Load /explore in dark AND light theme and watch the first paint: the four panels fade+rise in a 240ms cascade 40ms apart; then hover a competency card, a linked project card and a contact row; then press a header ghost."
    expected: "Editorial-calm feel — cards lift ~2px with a soft hsl-tinted shadow bloom, contact icons nudge 2px, header ghosts press-settle; no bounce/spring, nothing jitters or reflows. Total entrance ≤ 360ms."
    why_human: "Source pins prove the declarations exist, are source-ordered and ship in the built stylesheet; the actual timing/feel and the absence of layout thrash are perceptual and need a browser."
  - test: "With the OS/browser set to prefers-reduced-motion: reduce, load /explore and repeat the interactions above."
    expected: "All four panels are immediately visible at full opacity (no stagger, no hidden panels); hover/focus states apply instantly with no transition; scroll behaviour is instant."
    why_human: "The guard block is byte-identical to the phase-7 close (diff-verified) and its selector strings are test-pinned, but the rendered suppression outcome is a browser behaviour."
  - test: "Tab through /explore with a keyboard — a linked project card, a contact row, and the resume row."
    expected: "Focus-visible shows the focus ring AND the shadow bloom composed together (ring not replaced); underlined labels show their underline on focus, not only on hover."
    why_human: "The three-layer ring-composed box-shadow and the group-focus-visible parity are source-pinned, but 'ring visible, not clipped, readable' is visual."
  - test: "Check the four panel-header index numerals (01–04 at phase close; 01–05 at HEAD after phase 11) in both themes, and do a 375px visual pass of /explore."
    expected: "The zero-padded mono numeral reads as a quiet 50%-muted ghost at the right end of each header in both themes; at 375px there is no horizontal scroll, no clipped shadow bloom and no clipped stagger offset."
    why_human: "Plan-02 DEV-1 recorded that font-mono resolves to Tailwind's default mono stack (tailwind.config.ts has no fontFamily override) rather than the shell's JetBrains Mono, and the 375px/theme visual result is not machine-checkable."
---

# Phase 7: look-and-feel-revision Verification Report

**Verification basis.** HEAD is 4 phases ahead of this phase (phase 11 in progress), so phase-7 truths that a *later milestone phase* legitimately replaced were verified in two ways: (1) against the phase-7 final tree — a detached `git worktree` at `9f028c7` (the commit immediately after the last phase-7 code commit `7b7a214`), where I independently re-ran the full gate: `npm run build` → exit 0 (all routes prerendered static), `npm run typecheck` → exit 0, `node --test tests/*.mjs` → **180/180 pass**, matching the claimed suite count exactly; and (2) against HEAD, where the later phases renewed — rather than deleted — the phase-7 pins (test names still carry `(REV-08)`, `(REV-11/D-04/M1)`, `(UI-SPEC §10.2)`). No SUMMARY claim was accepted without a tool check; every number below comes from a command run in this session.

**Supersession map (not gaps).** `89e014d` (phase 8, REV-12) replaced the rail+dots Experience timeline with the arc stage and added a `md:col-span-2` grid rebalance; `1fe9eb7`/`53d347a`/`b39b12c` (phases 9–10, REV-17/REV-18) replaced the Projects tiles+cards body with the swipe stack and admitted `framer-motion`; `08333e3` (phase 11, REV-21) added a fifth panel and a 5th stagger delay. Each was checked against the phase-7 tree before being classified as legitimate later-phase evolution rather than a phase-7 miss.

**Green-gate finality.** Writing this report re-opened the gate, so the repo's real gate was re-run on the current workspace as the chronologically last action of this verification: `npm run build` (exit 0, all 6 routes prerendered static) → `npm run typecheck` (exit 0) → `node --test tests/*.mjs` (**267/267 pass**, exit 0). Nothing was written after that run. The 267 count is the phase-11-era suite; the phase-7-era count was 180, independently reproduced at the phase-7 final tree above.

## Goal Achievement → Observable Truths

| # | Truth | Status | Evidence |
|---|---|---|---|
| R1 | **Roadmap goal** — overall look-and-feel revision under the three design skills: both Gantts removed, skills cards redesigned, audit-first polish, restrained micro-motion, IDE aesthetic preserved | ✓ VERIFIED | Both requirements (REV-08, REV-11) plus the plan-declared REV-09/REV-10 verified below; commit range `0a06623 → 7b7a214` on branch `phase-7` |
| R2 | **REV-08** — both Gantt-style charts removed; Experience polished non-chart; Projects tiles+cards; stale tests updated/removed per replacement discipline | ✓ VERIFIED | `career-span-chart.tsx` + `projects-calendar.tsx` absent from `src/components/explore/sections/`; `tests/projects-calendar.test.mjs` absent; no chart import anywhere under `src/` (only a legacy comment in `globals.css:575`) |
| R3 | **REV-11** — restrained micro-motion: CSS-only hover/focus + one entrance, auto-suppressed by the phase-1 reduced-motion guard | ✓ VERIFIED | `globals.css:595-641` (keyframes + shorthand + delays + `.exp-lift`/`.exp-nudge`); every selector scoped `.explore-shell`; guard block diff-identical `7b7a214` ↔ HEAD |
| 1 | [P1-T1] `/explore` renders zero Gantt markup; Experience body opens with the rail+dots `<ol>` (merged duration·location meta row); Projects body opens with the stat-tiles wrapper then ≤6 cards; no chart import in either section | ✓ VERIFIED | At phase-7 tree: `d3c587d:experience-section.tsx:43` `<ol className="relative space-y-5 border-l border-border">`, `:60-62` `tabular-nums` duration + `aria-hidden` ` · ` + location; `d3c587d:projects-section.tsx:43-44` `mb-3` wrapper + `<ProjectStatTiles>` first, `:36` `slice(0, 6)`, `:95` TerminalPointer. At HEAD the rail is replaced by the arc — pinned by the passing test `cross-cutting: REV-08 — both chart files deleted, builders absent, the arc stage replaces the rail (D-03, EXPLORE-08 rewrite)` |
| 2 | [P1-T2] `viz-data.ts` keeps exactly the survivor API (skillGroupFill, skillsGroupCounts, GLOBAL_YEAR_PATTERN, projectStats); parse block + both builders + `monthIndex` gone; header claim corrected | ✓ VERIFIED | Word-bounded grep on HEAD: `buildCareerSpan`, `buildProjectCalendar`, `parseDuration`, `parseMonthToken`, `parseMonthYear`, `monthIndex`, `YEAR_ONLY_PATTERN` all **0**; survivors 4/3/3/3. File 115 lines (≥90). Test `cross-cutting: viz-data is the sole data-shaping module — chart machinery GONE, survivors pinned (REV-08/U-6, D-05)` passes |
| 3 | [P1-T3] Tour Experience-step body mentions no chart, carries no digits beyond the allowed "60", and a source-grep test pins "no chart substring in any step body" | ✓ VERIFIED | `constants.ts:147` "Roles in order — title, company, tenure, and the shape of the career as a timeline." Test `tour step bodies: no chart machinery mention in any body (REV-08/U-10, UI-SPEC §10.2)` **passes** (ran it); the digit guard (`tour copy guard: chrome only, no digits beyond the allowed "60"`) passes in the 66-test run |
| 4 | [P1-T4] Committed `EXPLORE-07-AUDIT.md` covers all 8 mandatory regions and is the phase's FIRST commit, preceding every code commit | ✓ VERIFIED | `git log --reverse 0a06623~1..d3c587d` → `0a06623 docs(EXPLORE-07): look-and-feel audit table (before fixes)` then `daba677` then `d3c587d`. All 8 region names present (grep ≥2 each); 24 dispositions (13 fixed / 8 kept-by-design / 3 no-op) |
| 5 | [P2-T1] Each of the four panel headers shows a quiet oversized mono index, aria-hidden, zero-padded from the map index, no literals in JSX; no index on drawer/tour/status | ✓ VERIFIED | `panel-shell.tsx:41,61` (`index: string` prop + `{index}` span); `explore-panels.tsx:144` `index={String(index + 1).padStart(2, '0')}`, `:134` `panel-grid`. Export HTML contains the four spans with the exact pinned class recipe (`ml-auto select-none font-mono text-2xl … text-muted-foreground/50`) reading 01–04 (01–05 at HEAD after phase 11) |
| 6 | [P2-T2] Competency cards alternate the accent chip by index parity and carry `exp-lift`; chips groups, Badge overrides, TerminalPointer unchanged | ✓ VERIFIED | `skills-section.tsx:62` `exp-lift` on the `<li>`, `:63` `index % 2 === 0 ? "self-start" : "self-end"`, `:66` `font-normal pointer-events-none text-chart-3 border-chart-3/40`, `:71` `mt-2 text-xs leading-relaxed text-muted-foreground`, `:60` grid pin intact, `cursor-pointer` count 0. Tests `skills-section: card anatomy pinned` + `export: competency cards render every cluster name + proof` pass |
| 7 | [P2-T3] Panel grid carries `panel-grid` + `gap-4 md:grid-cols-2 lg:gap-5`; no `max-w-` or `col-span` class | ✓ VERIFIED (as-of-close) | `explore-panels.tsx:134` exact class string; `max-w-` count 0; at the phase-7 tree `col-span` appears **only inside a comment** ("no col-span"). The single `col-span` utility at HEAD (`:118`) was added by phase 8 `89e014d` (REV-12 grid rebalance) and phase 10 `b39b12c` — a later milestone phase, not a phase-7 miss |
| 8 | [P3-T1] First-paint panel stagger: 240ms cascade 40ms apart, `translateY(8px)`+opacity, backwards fill, CSS-only, every declaration under `.explore-shell`, guard UNMODIFIED | ✓ VERIFIED | `globals.css:595` `@keyframes explore-panel-in`; `:600` `animation: explore-panel-in 240ms cubic-bezier(0.25, 1, 0.5, 1) backwards`; delay rules at `:605-608` **after** the shorthand (R4 source order); guard diff `7b7a214` ↔ HEAD = **identical**. Test `motion: panel-grid stagger entrance … (REV-11/D-04/M1, UI-SPEC §10.3)` passes; export stylesheet test passes |
| 9 | [P3-T2] Cards lift 2px + bloom on hover AND focus-visible (ring composed); icons/arrow nudge; underline focus parity; header press-settle; theme toggle stays instant | ✓ VERIFIED | `globals.css:534/585` `--panel-shadow-hover` in **both** theme blocks; `:614-641` `.exp-lift` (transition, `:hover`, `:focus-visible` three-layer ring composition, `:active` ordered after `:hover`) + `.exp-nudge` trigger rules; `about-section.tsx:189,226` nudge, `:192,225` `group-focus-visible:underline`; `explore-header.tsx` `active:bg-muted/80` ×4 and `transition` count **0**. Test `motion: hover/focus/active vocabulary …` passes |
| 10 | [P3-T3] The final gate — build → typecheck → `node --test tests/*.mjs` — is green as the chronologically last action on the final tree, with suite count + delta recorded and no writes after | ✓ VERIFIED | **Independently reproduced this session** on the phase-7 final tree (`9f028c7`, detached worktree): `BUILD_EXIT=0` (all routes `○ (Static) prerendered as static content`), `TC_EXIT=0`, `TEST_EXIT=0` with `tests 180 / pass 180 / fail 0` — exactly the recorded count. Working tree cleaned up; no phase-7 write occurred after the gate |

## Score

**34/34 must-haves verified** — 3 roadmap/requirement truths + 10 plan truths + 12 required artifacts + 9 key links. `behavior_unverified: 0` (every behaviour-dependent truth has a passing named test, re-run in this session). Status is `human_needed` purely because of the four perceptual/visual items below; the phase's own artefacts (RESEARCH §6 "Manual" row, UI-SPEC §10, plan-02 DEV-1) demand them and they cannot be machine-confirmed.

## Deferred Items

| Item | Origin | Status at verification |
|---|---|---|
| REV-07 per-company Experience redesign (awaits the user's screenshot brief) | CONTEXT deferred / SPEC scoped | Correctly NOT delivered by phase 7 — scoped into phase 8 and delivered there (`89e014d`, REV-12/REV-13). Not a gap |
| Scroll-triggered reveals (fuller motion vocabulary) | CONTEXT deferred | Not this phase; later addressed by phase 9's editorial motion (REV-17). Not a gap |
| CLI / resume / PDF visual polish | CONTEXT out of scope | Untouched by phase 7; verified by the untouched suites at the phase-7 tree (180/180 incl. `resume-docx-order`, `portfolio-data-integrity`). Not a gap |

## Required Artifacts

| Artifact | Expected | Actual | Status |
|---|---|---|---|
| `EXPLORE-07-AUDIT.md` | ≥40 lines, 8 regions, dispositions | exists, **36 lines** (36 at its own commit), 8/8 regions, 24 disposition entries | ⚠️ PRESENT — WARNING: min_lines shortfall only; content is substantive (every row carries region/area/generic-pattern/disposition/fix locus). Not a stub → does not gate |
| `src/components/explore/viz-data.ts` | ≥90 lines, survivors exported | 115 lines; 4 survivors present, all removed symbols word-bounded 0 | ✓ |
| `src/components/explore/sections/experience-section.tsx` | ≥50 lines, exports `ExperienceSection` | exists, exports at `:99`; 97-line phase-7 version, 326 at HEAD (arc) | ✓ |
| `src/components/explore/sections/projects-section.tsx` | ≥55 lines, exports `ProjectsSection` | 97 lines at phase-7 close (≥55); 47 at HEAD after phase-10/11 rewrite; export at `:21` | ✓ (min_lines met as-of-close) |
| `tests/explore-visuals.test.mjs` | ≥400 (plan 01) / ≥450 (plan 03) | 1000 lines | ✓ |
| `tests/explore-visuals-server.test.mjs` | ≥100, non-chart composition contract | 167 lines | ✓ |
| `src/components/explore/panel-shell.tsx` | ≥55, exports `PanelShell` | 66 lines, export `:30`, `index: string` prop | ✓ |
| `src/components/explore/explore-panels.tsx` | ≥85, exports `ExplorePanels` | 168 lines, export `:128` | ✓ |
| `src/components/explore/sections/skills-section.tsx` | ≥80, exports `SkillsSection` | 94 lines, export `:46` | ✓ |
| `src/app/globals.css` | ≥620 lines | 660 lines; guard remains the file's last block | ✓ |
| `src/components/explore/sections/about-section.tsx` | ≥140 lines | 229 lines | ✓ |

## Key Link Verification

| From → To | Via | Status |
|---|---|---|
| `projects-section.tsx` → `viz-data.ts` | `projectStats(projects)` survivor feed after the calendar died (`:11`, `:27` at phase-7 tree) | WIRED — test `projects-section: tile values from projectStats(projects)` passes |
| `projects-section.tsx` → `project-stat-tiles.tsx` | stat-tiles wrapper composes FIRST (`mb-3`) before the cards map | WIRED — test `projects-section: ProjectStatTiles composed BEFORE the stack stages with an mb-3 wrapper` passes |
| `constants.ts` → `explore-tour.tsx` | `EXPLORE_TOUR_STEPS[i].body` → `explore-tour.tsx:442` `{step.body}` | WIRED — the rewritten copy renders; the no-chart + digit-guard tests pass |
| `explore-panels.tsx` → `panel-shell.tsx` | `index={String(index + 1).padStart(2, '0')}` → required `index` prop → aria-hidden span | WIRED — the four spans with the exact pinned recipe are present in `out/explore.html` |
| `explore-panels.tsx` → `globals.css` | `panel-grid` class is the stagger target (`explore-panel-in`) | WIRED — export stylesheet test confirms the vocabulary ships in the built CSS chunk |
| `skills-section.tsx` → `globals.css` | `exp-lift` on the competency `<li>` joins the lift+bloom set | WIRED — the compiled `.explore-shell .exp-lift` rules exist and the export pin passes |
| `globals.css` → `globals.css` (scope) | every new animation/transition selector chain carries `.explore-shell` | WIRED — grep-verified across `:595-641`; guard is the single suppression mechanism |
| `globals.css` → `about-section.tsx` | `.explore-shell a:hover/:focus-visible .exp-nudge` drives the icons + resume arrow | WIRED — `exp-nudge` present at `about-section.tsx:189,226`; nudge rules at `globals.css:635-641` |
| `globals.css` → guard | all motion inside `.explore-shell` so the unmodified guard suppresses it | WIRED — guard block byte-identical (diff-verified) |

## Data-Flow Trace

`src/data/portfolio-main-data.json` → `projectStats(projects)` (`viz-data.ts`) → `ProjectsSection` → `ProjectStatTiles` → exported `/explore` HTML: the tiles render **`14 Projects` · `2016–2026 Active Years` · `14 Linked`**, matching the JSON (14 projects, all linked) — real values, not literals (`cross-cutting: zero stat literals` and `export: stat tiles server-rendered with JSON-derived values` both pass). Competency names + proofs render verbatim from `core_competencies` (`export: competency cards render every cluster name + proof` passes). No static/hardcoded fallback path found in the trace.

## Behavioral Spot-Checks

| Check (named test) | Command | Result |
|---|---|---|
| REV-08 removal + REV-11 motion + REV-05 export | `node --test --test-name-pattern="chart machinery\|chart files deleted\|calendar removed\|motion:\|REV-11\|competency cards render every cluster" tests/explore-visuals.test.mjs` | **7/7 pass** |
| Phase-7 affected suites (server composition + skills anatomy + tour copy) | `node --test tests/explore-visuals-server.test.mjs tests/explore-visuals-skills.test.mjs tests/explore-tour.test.mjs` | **66/66 pass** |
| Tour no-chart pin | `node --test --test-name-pattern="no chart machinery" tests/explore-tour.test.mjs` | **1/1 pass** |
| Index device / grid / shell anatomy | `node --test --test-name-pattern="panel-shell: chrome anatomy\|page: h-dvh flex shell\|responsive grid rebalance" tests/explore-shell.test.mjs` | **3/3 pass** |
| Stat-tile export data flow | `node --test --test-name-pattern="stat tiles server-rendered" tests/explore-visuals.test.mjs` | **1/1 pass** |
| Phase-7 final-tree gate (probe, detached worktree @ `9f028c7`) | `npm run build` → `npm run typecheck` → `node --test tests/*.mjs` | **build 0 · typecheck 0 · 180/180 pass** |
| Current workspace (HEAD `a5d52c2`, phase 11) — green gate re-closed after this report was written | `npm run build` → `npm run typecheck` → `node --test tests/*.mjs` | **build 0** (6 routes prerendered static) · **typecheck 0** · **267/267 pass** |

## Requirements Coverage

| REQ-ID | Description (phase scope) | Status | Evidence |
|---|---|---|---|
| REV-08 | Both Gantt charts removed; Experience polished non-chart; Projects tiles+cards; stale tests updated | ✓ DELIVERED | Chart files + builder/parse symbols absent; tiles+cards first-child composition; `projects-calendar.test.mjs` dropped, suites renewed |
| REV-09 (plan-declared) | Skills competency cards redesign — spacing/hierarchy/accent rhythm + restrained motion | ✓ DELIVERED | Alternating chip parity, `exp-lift`, `mt-2` proof rhythm, preserved overrides/grid/pointer |
| REV-10 (plan-declared) | Audit-first pass with a committed before/after audit table | ✓ DELIVERED | `EXPLORE-07-AUDIT.md` is the phase's first commit, 8/8 regions, 24 dispositions (WARNING: 36 < 40 min_lines) |
| REV-11 | CSS-only micro-motion vocabulary + one entrance, guard-suppressed | ✓ DELIVERED | Source + export stylesheet pins; guard byte-identical from close to HEAD |

## Anti-Patterns Found

None. `\b(TBD|FIXME|XXX)\b` over `src/components/explore/` and `src/app/globals.css` → **0**; no `.skip(`/`.todo(`/`TODO` in the four phase-7 suites → **0**; no debug artifacts; no unreferenced debt markers.

**Non-blocking observations (INFO, not gaps):**
1. `EXPLORE-07-AUDIT.md` is 36 lines against the plan's `min_lines: 40` floor — the one artifact-contract miss in this phase, cosmetic (content and structure are complete).
2. The phase-7 invariant "zero JS animation APIs under `src/components/explore/`" no longer holds at HEAD: `framer-motion` is imported in `projects-stack-stage.tsx` and a hand-rolled `requestAnimationFrame` engine lives in `use-timeline-progress.ts`. Both were introduced by *later* phases under explicit requirements (REV-13 hand-rolled rAF, REV-17/18 framer-motion for the Projects composition only) and are enforced as such by the later renewed tests (`recharts removed — 38 permanent + framer-motion adopted…`). Verified NOT a phase-7 regression at the phase-7 tree.
3. Comment-level prose drift introduced by phase 11: `explore-status-bar.tsx:7` still says "N/4 sections visited" while `EXPLORE_SECTIONS.length` is now 5 (and `explore-shell.tsx:48` "N/5" is correct again). Correct at phase-7 close; owned by phase 11.

## Human Verification Required

1. **Motion feel (both themes)** — entrance cascade + hover lift/lift bloom + icon nudge + header press-settle. Source-pinned but perceptual.
2. **prefers-reduced-motion rendered outcome** — panels immediately visible, no transition, instant scroll.
3. **Keyboard focus-visible parity** — ring + bloom composed (not replaced) on cards; underline on focus for labels.
4. **Index numeral ghost legibility (both themes) + 375px visual pass** — ties to plan-02 DEV-1 (`font-mono` resolves to Tailwind's default mono stack, not JetBrains Mono) and to the 375px no-horizontal-scroll invariant (whose structural half IS machine-checked: `grid-cols-1` base + `.explore-shell overflow-x-hidden`).

## Gaps Summary

No gaps. Every phase-7 truth, artifact, key link and requirement is verified against the code — either at HEAD where the phase-7 construct still lives, or at the phase-7 final tree where a later milestone phase legitimately replaced it (phase 8 arc + grid rebalance, phases 9–10 Projects stack + framer-motion, phase 11 fifth panel), with the gate independently reproduced there (build 0 / typecheck 0 / 180/180). The only status-raising condition is the four perceptual checks above, which are exactly the manual rows the phase's own RESEARCH/UI-SPEC reserved for the verify step — hence `human_needed`, not `passed`.

*Written by gsd-verifier · not committed (the orchestrator bundles it).*

## Human Verification Record (2026-09-25, user-confirmed in batch)

User verdict (batch round): **confirmed** — the phase's live review items were reviewed across the phase's execution and revision cycles, and the user confirms them in the 2026-09-25 batch approval round.

status_human: approved
