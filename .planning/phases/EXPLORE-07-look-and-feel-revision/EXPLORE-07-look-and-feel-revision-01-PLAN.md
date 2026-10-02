---
phase: EXPLORE-07-look-and-feel-revision
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-AUDIT.md"
  - "src/components/explore/sections/career-span-chart.tsx"
  - "src/components/explore/sections/projects-calendar.tsx"
  - "src/components/explore/viz-data.ts"
  - "src/components/explore/sections/experience-section.tsx"
  - "src/components/explore/sections/projects-section.tsx"
  - "src/components/explore/constants.ts"
  - "src/components/explore/explore-status-bar.tsx"
  - "tests/projects-calendar.test.mjs"
  - "tests/explore-visuals-server.test.mjs"
  - "tests/explore-visuals.test.mjs"
  - "tests/explore-visuals-skills.test.mjs"
  - "tests/explore-tour.test.mjs"
autonomous: true
requirements: ["REV-08", "REV-10"]
user_setup: []
must_haves:
  truths:
    - "/explore renders with zero Gantt-style chart markup: Experience's body opens with the rail+dots <ol> timeline (merged duration·location meta row, both strings verbatim), Projects' body opens with the stat-tiles wrapper followed by the ≤6 project cards — no chart import remains in either section"
    - "viz-data.ts keeps exactly the survivor API — skillGroupFill, skillsGroupCounts, GLOBAL_YEAR_PATTERN, projectStats — with the parse block (parseDuration/parseMonthToken/MONTH_NAMES/YEAR_PATTERN/parseMonthYear/ParsedDuration), both builders (buildCareerSpan/buildProjectCalendar + their types) and monthIndex gone, and the file-header 'only parsing site' claim corrected"
    - "The tour's Experience step body no longer mentions any chart, contains no digits beyond the allowed '60', and a source-grep test pins 'no chart substring in any step body'"
    - "The committed EXPLORE-07-AUDIT.md (Region | Area | Generic pattern | Disposition | Fix locus | Test/no-op proof) covers all 8 mandatory regions and is the phase's FIRST commit, preceding every code commit"
  artifacts:
    - path: ".planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-AUDIT.md"
      provides: "The falsifiable audit-first table (REV-10/D-01): 12+ seeded rows validated/amended/refuted per the redesign-existing-projects protocol, dispositions fixed/kept-by-design/no-op, all 8 mandatory regions"
      min_lines: 40
    - path: "src/components/explore/viz-data.ts"
      provides: "The shrunk pure data-shaping module — only the live survivors remain (skills chips + stat tiles); zero runtime imports contract intact for Node-24 type stripping"
      min_lines: 90
      exports: ["skillGroupFill", "skillsGroupCounts", "projectStats"]
    - path: "src/components/explore/sections/experience-section.tsx"
      provides: "The polished non-chart showcase (D-03/U-8): rail+dots <ol> as first body child, merged duration·location meta row, caps + verbatim strings + TerminalPointer preserved"
      min_lines: 50
      exports: ["ExperienceSection"]
    - path: "src/components/explore/sections/projects-section.tsx"
      provides: "Projects reverted to tiles + cards: stat-tiles wrapper (mb-3) as first body child, ≤6 cards, TerminalPointer — no calendar import or gate"
      min_lines: 55
      exports: ["ProjectsSection"]
    - path: "tests/explore-visuals.test.mjs"
      provides: "Renewed suite: builders/parse tracers dropped, cross-cutting serverSlices pruned, sole-parsing test inverted to absence+survivors, calendar export test rewritten to absence + 6 card names, Gantt export test dropped"
      min_lines: 400
    - path: "tests/explore-visuals-server.test.mjs"
      provides: "Career-span block replaced by the experience-section composition contract (timeline <ol> first body child, no chart import, merged meta row, slice(0,3)/verbatim pins)"
      min_lines: 100
  key_links:
    - from: "src/components/explore/sections/projects-section.tsx"
      to: "src/components/explore/viz-data.ts"
      via: "after the calendar dies, the tiles keep their live data feed through projectStats(projects) — the survivor import"
      pattern: "projectStats"
    - from: "src/components/explore/sections/projects-section.tsx"
      to: "src/components/explore/sections/project-stat-tiles.tsx"
      via: "stat-tiles wrapper composes FIRST in the body (mb-3) before the cards map once the calendar wrapper is gone"
      pattern: "<ProjectStatTiles"
    - from: "src/components/explore/constants.ts"
      to: "src/components/explore/explore-tour.tsx"
      via: "the rewritten experience step body still flows through EXPLORE_TOUR_STEPS via EXPLORE_TOUR_STEP_BODIES[index] — copy changes, wiring unchanged"
      pattern: "EXPLORE_TOUR_STEP_BODIES"
---

<objective>
Deliver REV-08 (both Gantt-style charts deleted, Experience polished non-chart, Projects tiles+cards) and the REV-10 process gate (audit table committed before any fix). Task 1 is the audit-first artefact — it must be the phase's FIRST commit because every later commit in this phase (including this plan's own removals) is a fix that the audit table precedes. Task 2 is the tracer: the thinnest end-to-end removal slice (one chart, its data machinery, its section wiring, its suite) verified green before the second chart expands the same pattern.

Red/green discipline inside every code task: the test renewal is written and run FIRST against the unedited tree (the renewal asserts the target contract, so it records RED), then the removal/polish edits land, then the same commands re-run GREEN — the commit itself stays atomic (tests + code together) so every commit is green on the tree it creates.
</objective>

<assumption_delta_decision>
- noun: n/a — the detected "alternate" signal is a presentation rhythm (competency chip positions alternate by index; gap-4→lg:gap-5), not a singular→plural / required→optional identity transition.
- decision: no-change — the phase introduces no second platform, auth method, tenant or source of truth; portfolio-main-data.json stays the single content identity and viz-data.ts stays the single /explore data-shaping module.
- rationale: promoting or adding-alongside any "variant" would invent scope SPEC/CONTEXT do not contain; the locked decisions (D-01…D-05) contain no variant axis.
- invariant companion: none required — the single data identity already round-trips through CLI, /explore, /resume and the PDF (pinned by tests/portfolio-data-integrity.test.mjs).
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-UI-SPEC.md
@.planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-RESEARCH.md
@src/components/explore/viz-data.ts
@src/components/explore/sections/experience-section.tsx
@src/components/explore/sections/projects-section.tsx
@src/components/explore/constants.ts
@tests/explore-visuals.test.mjs
@tests/explore-visuals-server.test.mjs
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Commit the validated look-and-feel audit table (REV-10 process gate — phase's first commit)</name>
    <files>.planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-AUDIT.md</files>
    <read_first>~/.dsh/skills/redesign-existing-projects/SKILL.md, .planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-look-and-feel-revision-UI-SPEC.md (§8), src/components/explore/explore-shell.tsx, src/components/explore/explore-header.tsx, src/components/explore/explore-intro.tsx, src/components/explore/explore-panels.tsx, src/components/explore/sections/about-section.tsx, src/components/explore/sections/experience-section.tsx, src/components/explore/sections/skills-section.tsx, src/components/explore/sections/projects-section.tsx</read_first>
    <action>Per D-01 and UI-SPEC §8: run the redesign-existing-projects Scan→Diagnose pass over the 8 mandatory regions (shell frame · header bar · intro strip · panel grid · About+Contact panel · Experience panel · Skills panel · Projects panel; drawer/tour/status scanned disposition-only) and write EXPLORE-07-AUDIT.md with the locked table format (Region | Area | Generic pattern / weak point (before) | Disposition | Fix locus | Test / no-op proof). Start from the 12 seeded rows in UI-SPEC §8 and validate, amend or refute each per the skill's protocol — the protocol decides the final table. Dispositions are limited to `fixed` (with test linkage), `kept-by-design` (with IDE-rail justification), `no-op`. Rows 1–8 describe work delivered by this phase's plans — set disposition `fixed` with the fix locus naming the delivering plan/task (charts → this plan tasks 2–3; merged meta row → this plan task 3; skills restyle/index/gutter → plan 02; lift+bloom/nudge/underline/active → plan 03). This task changes NO code and commits ONLY the audit file as its own commit, message `docs(EXPLORE-07): look-and-feel audit table (before fixes)` — it must precede every fix commit of the phase. Do not refactor anything else (REV-10: no unrelated refactors).</action>
    <verify>test -f .planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-AUDIT.md && git log --oneline -5</verify>
    <acceptance_criteria>
      - `test -f .planning/phases/EXPLORE-07-look-and-feel-revision/EXPLORE-07-AUDIT.md` exits 0
      - the file contains each of the 8 mandatory region names (grep ≥1 match for: "shell frame", "header bar", "intro strip", "panel grid", "About+Contact", "Experience", "Skills", "Projects")
      - every table row carries one of the dispositions fixed / kept-by-design / no-op
      - `git log --oneline` on branch phase-7 shows the audit commit BEFORE this phase's first src/ commit
    </acceptance_criteria>
    <done>The audit table is committed on its own and every subsequent commit in the phase can reference its row ids.</done>
  </task>
  <task type="auto">
    <name>Task 2 (tracer): Remove the Projects year-grid calendar end-to-end (REV-08/D-03)</name>
    <files>src/components/explore/sections/projects-calendar.tsx, src/components/explore/viz-data.ts, src/components/explore/sections/projects-section.tsx, tests/projects-calendar.test.mjs, tests/explore-visuals.test.mjs</files>
    <read_first>src/components/explore/sections/projects-calendar.tsx, src/components/explore/viz-data.ts, src/components/explore/sections/projects-section.tsx, tests/projects-calendar.test.mjs, tests/explore-visuals.test.mjs (import lines ~30-45, serverSlices ~357-367, sole-parsing test ~417-436, calendar export test ~580-592)</read_first>
    <action>RED first: land the TEST edits before touching code — (a) delete tests/projects-calendar.test.mjs entirely (its --chart-4 CSS pin dies with it, RESEARCH R10); (b) in tests/explore-visuals.test.mjs: shrink the viz-data import to drop buildProjectCalendar; prune 'src/components/explore/sections/projects-calendar.tsx' from serverSlices (keep career-span-chart.tsx until task 3); remove the buildProjectCalendar entry from the sole-parsing existence list (the full inversion lands in task 3); rewrite the calendar export test (~580-592) to assert calendar absence — no "Projects calendar" aria-label prefix in out/explore.html — plus tiles presence and exactly the 6 card names from data.projects.slice(0, 6) (OQ-D: do NOT reuse an all-14-names loop, only 6 cards render). Run `rm -rf out && npm run build && node --test tests/explore-visuals-server.test.mjs tests/explore-visuals.test.mjs` and RECORD the RED (the rewritten absence assertions fail because the calendar still exists). THEN per D-03 make the code edits: (1) delete src/components/explore/sections/projects-calendar.tsx. (2) In viz-data.ts remove ONLY the calendar block: buildProjectCalendar, ProjectCalendarRow, ProjectCalendarData, YEAR_ONLY_PATTERN (lines 291-382, file end) — the survivors skillGroupFill / skillsGroupCounts / GLOBAL_YEAR_PATTERN / projectStats and the parse block stay byte-identical in THIS task (career-span removal is task 3). (3) In projects-section.tsx remove the buildProjectCalendar + ProjectsCalendar imports, the `calendar`/`hasCalendar` computation, and the mb-5 calendar wrapper so the stat-tiles wrapper (mb-3) becomes the first body child; order stays stat-tiles (mb-3) → cards.map → TerminalPointer `projects --all`; per UI-SPEC §3.2 the linked anchors keep their existing accent hover, unlinked divs stay untouched. Update the file header comment to drop the ProjectsCalendar paragraphs (R11). Re-run the same commands to GREEN. Commit atomically (tests + code together): `feat(EXPLORE-07): remove the Projects year-grid calendar + its data machinery (REV-08)`.</action>
    <verify>rm -rf out && npm run build && node --test tests/explore-visuals-server.test.mjs tests/explore-visuals.test.mjs</verify>
    <acceptance_criteria>
      - `test ! -f src/components/explore/sections/projects-calendar.tsx` exits 0
      - `grep -c buildProjectCalendar src/components/explore/viz-data.ts` prints 0
      - `grep -c ProjectsCalendar src/components/explore/sections/projects-section.tsx` prints 0
      - `test ! -f tests/projects-calendar.test.mjs` exits 0
      - `grep -c projectStats src/components/explore/sections/projects-section.tsx` ≥ 1 (survivor feed intact)
      - out/explore.html contains no "Projects calendar" substring and contains all 6 card names from projects.slice(0, 6)
      - both affected suites exit 0 (build first — export tests read out/explore.html)
    </acceptance_criteria>
    <done>The Projects panel renders stat tiles + ≤6 cards only, its dedicated suite is dropped, the shared suites are green at this commit, and the same removal pattern is proven for task 3 to repeat on the career-span side.</done>
  </task>
  <task type="auto">
    <name>Task 3: Remove the career-span Gantt + the parse block, polish the Experience showcase, rewrite tour copy, invert the cross-cutting tests (REV-08/D-03/U-6/U-8/U-10)</name>
    <files>src/components/explore/sections/career-span-chart.tsx, src/components/explore/viz-data.ts, src/components/explore/sections/experience-section.tsx, src/components/explore/constants.ts, src/components/explore/explore-status-bar.tsx, tests/explore-visuals-server.test.mjs, tests/explore-visuals.test.mjs, tests/explore-visuals-skills.test.mjs, tests/explore-tour.test.mjs</files>
    <read_first>src/components/explore/sections/career-span-chart.tsx, src/components/explore/viz-data.ts, src/components/explore/sections/experience-section.tsx, src/components/explore/constants.ts (lines 94-100), src/components/explore/explore-status-bar.tsx (lines 1-18), tests/explore-visuals-server.test.mjs (lines 28-110), tests/explore-visuals.test.mjs (lines 30-60, 110-130, 239-360, 357-436, 479-506, 597-623), tests/explore-tour.test.mjs (lines 112-136), UI-SPEC §2-§3, §10 items 1-2</read_first>
    <action>RED first: land the TEST renewals before the code edits. (a) tests/explore-visuals-server.test.mjs: remove the career-span block (~28-107 incl. the dual-path gantt-files tests that read ganttPath) and write the replacement composition contract: the timeline <ol> is the first body child of ExperienceSection, the file imports neither CareerSpanChart nor buildCareerSpan, the merged meta row pins (tabular-nums duration span + aria-hidden ` · ` separator + location), slice(0, 3) and verbatim duration/location renders survive. (b) tests/explore-visuals.test.mjs: shrink the import to {skillGroupFill, skillsGroupCounts, projectStats}; drop the parseDuration tracer tests (~52-127) and the buildCareerSpan Task-4 block (~239-360); finish the serverSlices prune (remove career-span-chart.tsx, the array is empty) and DROP the now-subject-free interaction-free-charts test; INVERT the sole-parsing test (417-436) to assert parseDuration/buildCareerSpan/buildProjectCalendar/YEAR_PATTERN ABSENT from viz-data.ts while skillGroupFill/skillsGroupCounts/projectStats/GLOBAL_YEAR_PATTERN stay pinned; invert the D-09 existence block (~479-506) to assert both chart files absent from disk and buildCareerSpan absent from both viz-data.ts and experience-section.tsx while the timeline pins survive; drop the Gantt export test (~597-623, it imports parseDuration + buildCareerSpan directly); update stale header comments (lines ~11-12, ~49, ~506). (c) tests/explore-visuals-skills.test.mjs line ~154: fix the comment that still cites the career-span chart. (d) tests/explore-tour.test.mjs: add one source-grep test per UI-SPEC §10.2 — codeOf('src/components/explore/constants.ts') step-body literals contain no "chart" substring (module-private EXPLORE_TOUR_STEP_BODIES is not exported; grep the source), keeping the existing digit-guard green. Run `node --test tests/explore-visuals-server.test.mjs tests/explore-visuals.test.mjs tests/explore-tour.test.mjs` and RECORD the RED (the absence/inversion assertions fail because the Gantt still exists; the composition contract fails because the meta row is not merged; the no-chart grep fails on the current tour copy). THEN per D-03/U-6 make the code edits: (1) delete src/components/explore/sections/career-span-chart.tsx. (2) In viz-data.ts remove buildCareerSpan + CareerSpanRow/CareerSpanData/YearTick + monthIndex (lines 193-289) AND the whole parse block (ParsedDuration, MONTH_NAMES, parseMonthToken, YEAR_PATTERN, parseMonthYear, parseDuration — lines 21-99); nothing consumes them after both builders die (RESEARCH §1.2 verified). Update the file-header comment: the "ONLY duration/date parsing and mention-matching site" claim is false once parsing dies — rewrite to describe the surviving skillGroupFill/skillsGroupCounts/projectStats shaping (projectStats keeps its own GLOBAL_YEAR_PATTERN). (3) In experience-section.tsx remove the buildCareerSpan + CareerSpanChart imports, the `span`/`hasSpan` computation and the mb-5 chart wrapper so the rail+dots <ol> becomes the first body child; apply the U-8 meta-row merge per UI-SPEC §3.1 — replace the two stacked muted lines (duration p + location p) with ONE meta line `<p className="text-xs text-muted-foreground">` holding `<span className="tabular-nums">{entry.duration}</span>`, an aria-hidden ` · ` separator span, then `{entry.location}` — both data strings verbatim, dash style never normalized, wraps at 375px; everything else in the timeline body stays byte-identical (slice(0,3), chart-2 dot, ≤3 bullets, TerminalPointer `experience --all`) — REV-07 stays deferred, this is taste-level only (D-03/D-05). Rewrite the header comment (lines 19-23 Gantt paragraphs gone). (4) constants.ts:97 — replace the dangling chart copy with the UI-SPEC §2.1 suggested body: "Roles in order — title, company, tenure, and the shape of the career as a timeline." (U-10; no digits, no chart mention — R1 guard). (5) explore-status-bar.tsx header comment: correct the stale N/5 prose to N/4 (EXPLORE_SECTIONS.length = 4; comment-only, R11). Re-run the affected suites to GREEN, then the full gate. Commit atomically (tests + code together): `feat(EXPLORE-07): remove the career-span Gantt + parse block; polished non-chart showcase (REV-08)`.</action>
    <verify>rm -rf out && npm run build && npm run typecheck && node --test tests/*.mjs</verify>
    <acceptance_criteria>
      - `test ! -f src/components/explore/sections/career-span-chart.tsx` exits 0
      - in src/components/explore/viz-data.ts each of grep -c buildCareerSpan, parseDuration, MONTH_NAMES, YEAR_PATTERN, parseMonthToken, parseMonthYear, monthIndex, buildProjectCalendar prints 0; grep -c for skillGroupFill, skillsGroupCounts, GLOBAL_YEAR_PATTERN, projectStats each ≥ 1
      - in src/components/explore/sections/experience-section.tsx grep -c CareerSpanChart prints 0 and grep -c "career-span-chart" prints 0; `<ol className="relative space-y-5 border-l border-border">` present as the first body child; the merged meta row pattern (tabular-nums + aria-hidden separator) present; grep -c "slice(0, 3)" ≥ 1
      - `grep -c "career-span chart" src/components/explore/constants.ts` prints 0
      - `node --test tests/*.mjs` exits 0 on this tree (full mid-phase gate)
    </acceptance_criteria>
    <done>Both Gantts and all their data machinery are gone; Experience shows the refined rail+dots timeline with the merged meta row; Projects shows tiles + cards; every affected suite is rewritten to the replacement contract and the full suite is green.</done>
  </task>
</tasks>