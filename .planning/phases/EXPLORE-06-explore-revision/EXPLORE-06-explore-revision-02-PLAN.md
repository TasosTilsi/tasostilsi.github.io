---
phase: EXPLORE-06-explore-revision
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - "src/components/explore/constants.ts"
  - "src/components/explore/explore-panels.tsx"
  - "src/components/explore/sections/about-section.tsx"
  - "src/components/explore/sections/contact-section.tsx"
  - "src/components/explore/explore-tour.tsx"
  - "tests/explore-tour.test.mjs"
  - "tests/explore-sweep.test.mjs"
  - "tests/explore-visuals.test.mjs"
autonomous: true
requirements: ["REV-04", "REV-07"]
user_setup: []
must_haves:
  truths:
    - "/explore renders exactly 4 panels — [About+Contact | Experience] / [Skills | Projects] — with zero empty cells at 375px (1 col), 768px (2 cols) and 1440/1920px (2 cols); no lg:grid-cols-3 anywhere"
    - "The merged panel carries, in UI-SPEC §3.2's pinned order — description → meta row → divider → all 9 contact channel rows → 'Full resume →' link LAST — under About's chart-1 accent and panel identity; the Full-resume link is the merged panel's last interactive element (§14.2 — checker W-5 citation fix) and no standalone Contact panel exists"
    - "The tour runs 6 steps (welcome → about → experience → skills → projects → finish) and every 'Step N of M' counter derives from EXPLORE_TOUR_STEPS.length — no 'of 7' literal; the status bar counts N/4 automatically; drawer anchors list 4 sections"
    - "Tour/counter/drawer/visited flows still thread through the untouched Experience panel (D-09): experience-section.tsx and career-span-chart.tsx are byte-untouched all phase"
    - "Welcome tour copy says 'four sections'; stale stored 'contact' visited-ids are harmlessly filtered"
  artifacts:
    - path: "src/components/explore/sections/about-section.tsx"
      provides: "The merged About+Contact panel body per UI-SPEC §3.2 pinned order: description → meta row → divider → 9 channel rows → Full resume link LAST (absorbed ContactSection anatomy)"
      min_lines: 100
    - path: "src/components/explore/explore-panels.tsx"
      provides: "2×2 grid adapter: 4 SECTION_BODIES closures, no contact closure, no About col-span"
      min_lines: 55
    - path: "tests/explore-sweep.test.mjs"
      provides: "Updated breakpoint sweep rows pinning the 2×2 grid and the removed About span"
      min_lines: 180
  key_links:
    - from: "src/components/explore/constants.ts"
      to: "src/components/explore/explore-panels.tsx"
      via: "EXPLORE_SECTIONS (4 entries) drives the panel map — panels render whatever the sections list holds"
      pattern: "EXPLORE_SECTIONS.map"
    - from: "src/components/explore/sections/contact-section.tsx"
      to: "src/components/explore/sections/about-section.tsx"
      via: "CHANNELS table + ROW_CLASS + Full-resume Link absorbed into the merged section; contact-section.tsx deleted"
      pattern: "CHANNELS"
    - from: "src/components/explore/constants.ts"
      to: "src/components/explore/explore-tour.tsx"
      via: "tour steps derive from EXPLORE_SECTIONS; the hardcoded 'of 7' becomes EXPLORE_TOUR_STEPS.length"
      pattern: "EXPLORE_TOUR_STEPS.length"
---

<objective>
Merge About + Contact into one panel and rebalance the /explore grid to the locked 2×2 (REV-04, D-04/D-05), driving every section-count consumer (panels, drawer, tour, status bar, visited storage, tour copy) from the 5→4 EXPLORE_SECTIONS switch, while keeping the experience showcase byte-untouched (REV-07 deferral, D-09).
</objective>

<assumption_delta_decision>
- noun: the /explore section set (five panels → four merged panels) and, as recorded in plan 01, the Projects panel rendering (add-alongside — plan 04).
- decision: promote — the merged About+Contact panel becomes the primary About identity (About's accent, label and grid position), and the standalone Contact panel is demoted into its anatomy (absorbed component), not added alongside as a fifth entry.
- rationale: D-04/D-05 lock the 2×2 four-panel grid with the Contact panel disappearing from the grid; a fifth "Contact" section would contradict the zero-empty-cells invariant.
- accepted debt: none — the merged panel keeps the exact ContactSection anatomy (9 channels + Full resume link), so no content is lost.
- invariant companion: every EXPLORE_SECTIONS consumer (panels, drawer, tour, status bar, visited filter) must derive from the 4-entry list — pinned by the updated tour/sweep suites.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-06-explore-revision/EXPLORE-06-explore-revision-SPEC.md
@.planning/phases/EXPLORE-06-explore-revision/EXPLORE-06-explore-revision-RESEARCH.md (§1.3 pitfall 5-6, OQ-9, OQ-10)
@src/components/explore/constants.ts
@src/components/explore/explore-panels.tsx
@src/components/explore/sections/about-section.tsx
@src/components/explore/sections/contact-section.tsx
@src/components/explore/explore-tour.tsx
@src/components/explore/explore-status-bar.tsx
@src/components/explore/explore-drawer.tsx
@src/components/explore/use-explore-visited.ts
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — 4-section spine, merged panel, 2×2 grid (D-04/D-05)</name>
    <files>src/components/explore/constants.ts, src/components/explore/explore-panels.tsx, src/components/explore/sections/about-section.tsx, src/components/explore/sections/contact-section.tsx, tests/explore-sweep.test.mjs, tests/explore-visuals.test.mjs</files>
    <read_first>src/components/explore/explore-panels.tsx, src/components/explore/sections/about-section.tsx, src/components/explore/sections/contact-section.tsx, src/components/explore/constants.ts (lines 10-16, 62-68)</read_first>
    <action>RED first: update the two sweep assertions in tests/explore-sweep.test.mjs (grid test, lines 38-49) to the NEW contract — src includes 'grid grid-cols-1 gap-4 md:grid-cols-2', src does NOT include 'lg:grid-cols-3', src does NOT include 'md:col-span-2' — and update the registry-spine test in tests/explore-visuals.test.mjs (lines 605-620) to 4 closures with no contact closure; run both files and capture the failures on record (current tree still has lg:grid-cols-3, the About span, and 5 closures; if plan 01's JSON write has already landed in the wave-1 interleave, the visuals suite's techMentions rows also fail — carve-out, REPORT-ONLY, see below). GREEN, in this order: constants.ts — remove the contact entry (line 15) from EXPLORE_SECTIONS and the contact key (line 67) from EXPLORE_TOUR_ACCENTS (TS Record<ExploreSectionId,…> forces every consumer to compile against 4 ids); about-section.tsx — absorb the ContactSection anatomy verbatim: move the CHANNELS table, ROW_CLASS constant, Full-resume Link (next/link, href /resume, FileText + ArrowRight icons, accent bordered row) and the 9-channel row renderer into AboutSection, composing top-to-bottom in UI-SPEC §3.2's pinned order: description paragraph → title/location meta row (existing) → divider → the 9 channel rows → Full-resume link LAST (D-05: description first, contacts after; §3.2 pins the link moving from first — its old contact-section.tsx:72 position — to LAST, with the existing mt-3 spacing above it; §13 E-UAT-2: the link is the merged panel's LAST interactive element and no #contact element exists; keeps About's chart-1 accent and grid identity); delete src/components/explore/sections/contact-section.tsx; explore-panels.tsx — drop the ContactSection import, remove the contact closure from SECTION_BODIES (exactly 4 closures remain), remove the contact: 'bg-chart-5' key from the local ACCENTS record (lines 37-43 — the Record<ExploreSectionId, string> narrows once the union drops contact, so TS forces the fifth literal key out), change the grid classes (line 67) to 'grid grid-cols-1 gap-4 md:grid-cols-2' (lg tier drops from 3 to 2 columns per D-04), and remove the About col-span conditional (lines 76-78 → className undefined); update the file doc-comment (five panels → four, merged panel note). **Tour updates (checker W-3a — files this task owns): (a) explore-tour.tsx's ABOUT tour step body is rewritten to the merged-panel reality — 'bio + role + location + every contact channel + the resume export' replaces the old bio-only text; (b) `PRIMARY_LABELS` (explore-tour.tsx:57, currently 7 entries) shrinks to the pinned 6 — ['Start','Next','Next','Next','Finish','Done'] (§14.3) — so the finish card's primary button stops mislabelling; (c) the `TourStep['id']` union (constants.ts:77) drops 'contact' (E-14 inventory).** Re-run sweep to full green and visuals SCOPED: node --test --test-name-pattern="^(?!.*techMentions)" tests/explore-visuals.test.mjs — the techMentions rows (every test whose name contains 'techMentions': the real-corpus cells pins at ~232-360 and the export treemap-aria row at ~691-704) are plan-04-owned REPORT-ONLY during waves 1-2 because plan 01's JSON write (same wave, interleaving order nondeterministic) shifts their live-corpus mention counts; any visuals failure whose test name does NOT contain 'techMentions' is a real defect of this task and must be fixed here. **Wave-1 sibling-retry note (checker W-4): verify failures traceable to plan 01's in-flight data write — including transient typecheck breaks — are retried once after plan 01's commit lands, same REPORT-ONLY triage.**</action>
    <verify>npm run typecheck && node --test tests/explore-sweep.test.mjs && node --test --test-name-pattern="^(?!.*techMentions)" tests/explore-visuals.test.mjs && ! test -f src/components/explore/sections/contact-section.tsx && ! grep -c "lg:grid-cols-3" src/components/explore/explore-panels.tsx && ! grep -c "ContactSection" src/components/explore/explore-panels.tsx</verify>
    <acceptance_criteria>
      - RED on record: the updated sweep + spine assertions failed against the pre-merge tree before the edits
      - node --test tests/explore-sweep.test.mjs exits 0 and tests/explore-visuals.test.mjs exits 0 under --test-name-pattern="^(?!.*techMentions)" — the excluded rows are plan-04-owned (plan 01's data write breaks them during wave 1); a visuals failure whose name lacks 'techMentions' is a real defect and blocks this task
      - contact-section.tsx no longer exists; grep 'ContactSection' in explore-panels.tsx returns nothing
      - explore-panels.tsx contains 'md:grid-cols-2' and NOT 'lg:grid-cols-3' and NOT 'md:col-span-2'
      - grep -c 'contact:' src/components/explore/constants.ts returns 0 for EXPLORE_SECTIONS and EXPLORE_TOUR_ACCENTS entries
      - exactly 4 adapter closures in SECTION_BODIES (spine test asserts the count)
    </acceptance_criteria>
    <done>The grid is 2×2 with zero empty cells, the merged panel carries the full contact anatomy under About's identity, and the section-count spine is 4 everywhere it typechecks.</done>
  </task>

  <task type="auto">
    <name>Task 2: Tour/counter/drawer mechanics + welcome copy (D-05, OQ-9)</name>
    <files>src/components/explore/constants.ts, src/components/explore/explore-tour.tsx, tests/explore-tour.test.mjs</files>
    <read_first>src/components/explore/constants.ts (lines 76-133), src/components/explore/explore-tour.tsx (lines 395-478), tests/explore-tour.test.mjs</read_first>
    <action>RED first: update tests/explore-tour.test.mjs step-count assertions (lines 69 and 72 per RESEARCH §OQ-9) to expect EXPLORE_TOUR_STEPS.length === 6 and an id list of welcome/about/experience/skills/projects/finish (no contact); add an assertion that the tour file contains no 'of 7' literal; also rewrite the other merge-invalidated blocks in tests/explore-tour.test.mjs: the 'tour accents' deepEqual (lines 55-66) becomes the 4-id map without the 'contact: 'bg-chart-5'' entry; the step-table content slice moves from EXPLORE_TOUR_STEPS.slice(1, 6) (line 75 — with 6 steps the old slice pulls the finish step and derefs EXPLORE_SECTIONS[4], which throws) to slice(1, 5); the finish assertions EXPLORE_TOUR_STEPS[6] move to [5] (lines 96-98 and the finish-body congrats assert at line 122); VALID_IDS (line 137) drops 'contact' and the parseVisitedIds block (lines 260-281) gains a stale-id assertion parseVisitedIds('["about","contact","skills"]', VALID_IDS) → ['about','skills'] (stored 'contact' ids must filter like 'bogus' once the section is gone); run and capture the failure on record. GREEN: constants.ts — drop "contact" from the TourStep id union (line 77), drop the contact body entry from EXPLORE_TOUR_STEP_BODIES (line 102 — the array becomes 4 entries for about/experience/skills/projects; leave the skills treemap sentence and projects sentence UNTOUCHED — plan 04 owns that copy atomically with the removal), change the welcome body 'five sections' (line 117) to 'four sections'; EXPLORE_TOUR_STEPS auto-derives 6 steps from the 4-section map (no other edit). explore-tour.tsx line 409 — change the sr-only 'Step ${stepIndex + 1} of 7' literal to derive from EXPLORE_TOUR_STEPS.length exactly like line 464 already does. Verify-only sites (no edit, D-03): explore-status-bar.tsx counter derives from EXPLORE_SECTIONS.length (auto N/4); explore-drawer.tsx anchors map EXPLORE_SECTIONS (4 items; its 5-entry accent record keeps compiling since ACCENTS keys are per-id Records — drop the contact key if TS forces it); use-explore-visited.ts parseVisitedIds filters stale stored 'contact' ids (existing behaviour, constants.ts:51-53 — assert via existing suite, add a stale-id filter test if none covers it).</action>
    <verify>npm run typecheck && node --test tests/explore-tour.test.mjs && ! grep -c "of 7" src/components/explore/explore-tour.tsx && grep -c "four sections" src/components/explore/constants.ts</verify>
    <acceptance_criteria>
      - RED on record: the updated tour assertions failed (7 steps + contact id) before the constants edit
      - node --test tests/explore-tour.test.mjs exits 0 with 6 steps and the no-contact id list
      - tour accents deepEqual pins the 4-id map (no contact/bg-chart-5), VALID_IDS holds 4 ids, and the stale-'contact' parseVisitedIds filter assertion is green
      - grep 'of 7' in explore-tour.tsx returns nothing (both counters derive from EXPLORE_TOUR_STEPS.length)
      - constants.ts welcome body contains 'four sections' and EXPLORE_TOUR_STEP_BODIES has exactly 4 entries
      - grep 'treemap' src/components/explore/constants.ts still matches (skills step copy untouched until plan 04)
    </acceptance_criteria>
    <done>The tour is a 6-step lap over 4 sections with fully derived counters; stale stored visited ids are filtered; the skills/projects step copy is deliberately untouched.</done>
  </task>

  <task type="auto">
    <name>Task 3: Stale-test sweep + REV-07 byte-untouched invariant (D-09)</name>
    <files>tests/explore-sweep.test.mjs, tests/explore-visuals.test.mjs</files>
    <read_first>tests/explore-sweep.test.mjs, tests/explore-visuals.test.mjs (lines 600-680), src/components/explore/sections/experience-section.tsx (read-only), src/components/explore/sections/career-span-chart.tsx (read-only)</read_first>
    <action>Finalize the stale-test surface for the merge: sweep suite — keep the no-max-width and overflow assertions, extend the grid test with a structural zero-empty-cells row (4 section ids in EXPLORE_SECTIONS, 2 columns at md+, no col-span classes anywhere in explore-panels.tsx) and a 375px row (grid-cols-1 base class present); visuals suite — the registry-spine test now asserts: about closure unchanged, no contact closure, exactly 4 closures, skills closure STILL threading experience={data.experience} (plan 04 reverts it); add a byte-untouched invariant test asserting src/components/explore/sections/experience-section.tsx and career-span-chart.tsx both still exist and the buildCareerSpan Gantt test (visuals.test.mjs lines 360-389) still passes unchanged (REV-07/D-09: no speculative redesign, wizard/drawer/counter flows keep working through the experience panel). Run sweep and tour to full green; run visuals scoped with --test-name-pattern="^(?!.*techMentions)" (same plan-04-owned carve-out as task 1 — the techMentions real-corpus rows stay red until plan 04 task 2 removes them) and confirm green outside the carve-out.</action>
    <verify>node --test tests/explore-sweep.test.mjs tests/explore-tour.test.mjs && node --test --test-name-pattern="^(?!.*techMentions)" tests/explore-visuals.test.mjs && git diff --name-only HEAD -- src/components/explore/sections/experience-section.tsx src/components/explore/sections/career-span-chart.tsx | wc -l</verify>
    <acceptance_criteria>
      - sweep and tour suites exit 0; visuals exits 0 under the ^(?!.*techMentions) carve-out (plan-04-owned rows stay REPORT-ONLY until wave 3)
      - git diff --name-only over experience-section.tsx and career-span-chart.tsx prints nothing across the whole phase (byte-untouched — D-09)
      - the spine test asserts exactly 4 closures and the skills closure still carrying experience={data.experience}
      - no test weakened: every removed assertion is replaced by its 4-section successor, never deleted without a replacement
    </acceptance_criteria>
    <done>The merge's stale-test surface is green, the 2×2 grid is pinned, and the experience showcase's byte-untouched status is on record.</done>
  </task>
</tasks>