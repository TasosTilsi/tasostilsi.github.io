---
phase: 09-editorial-motion-revision
plan: 01
type: tdd
wave: 1
depends_on: []
files_modified:
  - src/components/explore/timeline-geometry.ts
  - src/components/explore/sections/experience-section.tsx
  - src/components/explore/explore-panels.tsx
  - tests/explore-timeline.test.mjs
  - tests/explore-visuals-server.test.mjs
  - tests/explore-visuals.test.mjs
  - tests/explore-visuals-skills.test.mjs
  - tests/explore-sweep.test.mjs
autonomous: true
requirements: ["REV-16"]
user_setup: []
must_haves:
  truths:
    - "The arc renders 5 chronological entries — BEng 2012, Netcompany-Intrasoft 2019, MSc 2021, Upstream Systems 2022, Chubb 2023 — derived from experience.filter(isTechRelated) ∪ education.filter(featured), sorted year-ascending (D-03)"
    - "Content templates are type-aware: role = title > company > duration AS STORED · location > ≤3 bullets; education = degree > institution > duration AS STORED (no location) > specialization when present (BEng has none — omits)"
    - "Education markers are constant hollow dots (rounded-full border border-chart-2 bg-transparent — never fill, never swap size); role markers keep the existing filled-dot + size swap; education marker labels render the year only"
    - "The stage engine is byte-untouched: zero framer-motion imports under src/components/explore/sections/experience* and use-timeline-progress.ts carries no diff; n=5 math stays n-generic (Δ=22.5°, emphasis ladder 1/0.9125/0.825/0.7375/0.65)"
    - "SSR/static export shows entry 0 = BEng real text (degree/institution/duration); the control counter renders 01 / 05; Prev/Next clamp at 5 stops"
    - "selectTimelineRoles no longer exists — ONE derivation site selectTimelineEntries; both consumers (explore-panels.tsx gate + adapter, experience-section.tsx) migrated in the same change (OQ-8); the two adapter pins in tests/explore-visuals.test.mjs and tests/explore-visuals-skills.test.mjs renew to the education-passing form in the same plan, and the counter-idiom pin's message text renews to the 5-entry reality (§4: 01 / 05) — no stale pin or factually stale message survives the diff"
  artifacts:
    - path: "src/components/explore/timeline-geometry.ts"
      provides: "The ONE pure derivation module, extended with the typed merged-entries derivation (TimelineEntry + selectTimelineEntries) replacing selectTimelineRoles; every existing geometry/progress/emphasis function byte-untouched; zero runtime imports preserved (node --test loads it via type stripping)"
      min_lines: 290
      exports: ["TimelineEntry", "selectTimelineEntries", "computeProgress", "continuousIndex", "activeIndexFromContinuous", "markerAngle", "markerEmphasis", "contentLayer", "reducedMotionAngle", "reducedMotionEmphasis", "viewBoxToPx", "markerPoint", "progressForRole", "scrollTargetForRole", "startYear", "dateLineFits"]
    - path: "src/components/explore/sections/experience-section.tsx"
      provides: "The arc stage rendering the 5-entry type-aware composition: marker anatomy branch (hollow vs filled), type-aware content templates, type-aware keys, type-aware sr-only announce, compact year chips with the hollow dot, SSR entry 0 = BEng — engine imports untouched"
      min_lines: 280
      exports: ["ExperienceSection"]
    - path: "tests/explore-timeline.test.mjs"
      provides: "The renewed 5-entry derivation suite: selectTimelineEntries over the REAL JSON (5 entries, year order, type discriminator), null-year stable placement, template field mapping, W-4 over education durations, n-generic invariants re-swept at n=5, gone-checks for selectTimelineRoles"
      min_lines: 380
      exports: []
  key_links:
    - from: "tests/explore-timeline.test.mjs"
      to: "src/data/portfolio-main-data.json"
      via: "readFileSync at test time — the 5-entry expectation derived from the real JSON, never copied literals"
      pattern: "portfolio-main-data\\.json"
    - from: "src/components/explore/sections/experience-section.tsx"
      to: "src/components/explore/timeline-geometry.ts"
      via: "imports selectTimelineEntries + TimelineEntry (the ONE derivation site); the component never shapes timeline data inline"
      pattern: "selectTimelineEntries"
    - from: "src/components/explore/explore-panels.tsx"
      to: "src/components/explore/timeline-geometry.ts"
      via: "the W-3 sticky gate reads the merged count: selectTimelineEntries(data.experience, data.education).length > 1"
      pattern: "selectTimelineEntries\\(data\\.experience, data\\.education\\)"
    - from: "tests/explore-visuals.test.mjs"
      to: "src/components/explore/explore-panels.tsx"
      via: "the registry-spine pin asserts the education-passing experience adapter — the panel wiring is pinned where it is rendered"
      pattern: "ExperienceSection experience=\\{data\\.experience\\} education=\\{data\\.education\\}"
---

<objective>
Merge education onto the semicircular career timeline (REV-16, D-03): the arc carries 5 chronological entries — the 3 tech roles plus the 2 featured education records — with type-aware content templates, while the hand-rolled engine stays byte-untouched. The derivation generalizes IN PLACE: `selectTimelineRoles` becomes `selectTimelineEntries` over a typed `{ type: 'role' | 'education' }` entries array, both consumers migrate in the same change (one derivation site, OQ-8), and the phase-8 suite renews to the 5-entry contract. RED-first per the tdd discipline.
</objective>

<assumption_delta_decision>
- Noun now primary: the **timeline entries derivation** (`selectTimelineEntries` — a typed role|education array). The phase-8 role-only `selectTimelineRoles` was the specific single-variant representation.
- Decision: **promote**. The general typed representation becomes the ONLY derivation; the old specific one is deleted, not kept alongside. Rationale: OQ-8 + the module's one-derivation-site header — keeping both functions forks the derivation site; roles round-trip through the primary path as `type: 'role'` with byte-identical marker/engine behaviour. No accepted debt.
- Companion invariant (encoded in Task 1): every existing role behaviour round-trips through `selectTimelineEntries` — the 3 tech roles appear as type 'role' entries at years 2019/2022/2023 with unchanged geometry, emphasis, keyboard and reduced-motion derivations; education is purely a discriminator + template variant.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md — §3 is NORMATIVE (derivation, marker anatomy W-2 resolution, content templates, counter, range)
@.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-CONTEXT.md — D-03 (education-on-arc) + D-05 (engine untouched, grep ban)
@src/components/explore/timeline-geometry.ts — the derivation module being extended; header rules at lines 15-29 (zero runtime imports; the no-sort rule this phase's ONE function must scope explicitly)
@src/components/explore/sections/experience-section.tsx — the stage: selectTimelineRoles import at line 64, call at line 79, markers at 121-162, content template at 195-245, sr-only announce at 247-249
@src/components/explore/explore-panels.tsx — consumer migration site: import at line 61, adapter at line 92, W-3 gate at line 121
@src/components/explore/use-timeline-progress.ts — BYTE-UNTOUCHED this phase (D-05); read only to confirm the count-agnostic engine (roleCount param at line 130, MAIN_SELECTOR at line 104)
@src/data/portfolio-main-data.json — featured education = exactly MSc + BEng (hyphen durations 24/30 chars); tech roles Netcompany/Upstream/Chubb
@tests/explore-timeline.test.mjs — the phase-8 suite being renewed (409 lines; selectTimelineRoles section at line 314; the top-level static import block carries selectTimelineRoles at line 43)
@tests/explore-visuals-server.test.mjs — pins `selectTimelineRoles` in a source grep at line 90 (renews same-change)
@tests/explore-visuals.test.mjs — pins the experience adapter line VERBATIM at line 314 (`experience: ({ data }) => <ExperienceSection experience={data.experience} />,` inside the registry-spine test) — renews to the education-passing form; every other assertion survives (about/skills/projects adapters, the four-closure count, hover:/aria-live/padStart idioms) EXCEPT the counter-idiom pin's MESSAGE text at ~line 881, which names the stale '§4: 01 / 03' and renews to '§4: 01 / 05' in this task (value assertion untouched)
@tests/explore-visuals-skills.test.mjs — pins the same adapter line VERBATIM at line 156 (the OQ-10 adapter test) — renews to the education-passing form; every other pin survives
@tests/explore-sweep.test.mjs — pins the 3-role static export (E-6…E-9 at lines 319-383: role-1 Chubb text, counter 01 / 03, exactly 3 dots/labels) — renews to the 5-entry export contract (Task 3, after the rebuild)
</context>

<tasks>
  <task type="test">
    <name>Task 1: RED — renew the derivation suite to the 5-entry typed contract (tracer: real JSON → selectTimelineEntries → 5 typed entries, asserted pure before any component work)</name>
    <files>tests/explore-timeline.test.mjs, tests/explore-visuals-server.test.mjs, tests/explore-visuals.test.mjs, tests/explore-visuals-skills.test.mjs</files>
    <read_first>.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md (§3.1-§3.4), src/components/explore/timeline-geometry.ts, src/data/portfolio-main-data.json, src/data/portfolio-main-data.d.ts (ExperienceEntry/EducationEntry shapes), tests/explore-timeline.test.mjs (house style + the phase-8 sections being renewed + the import block at lines 26-45), tests/explore-visuals.test.mjs (line 314 adapter pin), tests/explore-visuals-skills.test.mjs (line 156 adapter pin), tests/explore-visuals-server.test.mjs (line 90 source-grep pin)</read_first>
    <action>
      Renew tests/explore-timeline.test.mjs in the house node --test style (assert from node:assert/strict, readFileSync of the REAL src/data/portfolio-main-data.json). RED MECHANICS (load-bearing): the not-yet-existing export must NEVER appear in the top-level static import — a static `import { selectTimelineEntries }` of a missing export fails the ENTIRE module load and takes every retained phase-8 assertion down with it, which would violate this task's red-locality criterion. Instead: (a) the top-level static import block keeps ONLY the surviving exports (remove `selectTimelineRoles` from the destructured list at line 43 — its deletion in Task 2 must not break the module load), and (b) the renewed contract blocks consume the module through ONE top-of-suite dynamic namespace import — `const geometry = await import('../src/components/explore/timeline-geometry.ts')` (top-level await is valid .mjs) — accessing `geometry.selectTimelineEntries` ONLY inside the new-contract blocks. During RED the dynamic import resolves (the module and its phase-8 exports exist), `geometry.selectTimelineEntries` is undefined, and ONLY the new blocks fail (TypeError on the undefined property / the gone-check). `TimelineEntry` is a type-only export — never value-import it at runtime; pin its shape in the same renewed block via readFileSync of timeline-geometry.ts asserting the source contains `interface TimelineEntry` and `'role' | 'education'`. Renew, do not delete wholesale: the phase-8 geometry/progress/keyboard/RM sections stay byte-identical except the n-sweeps noted below. Write/renew:
      1. selectTimelineEntries on the REAL JSON: exactly 5 entries in year-ascending order with years ['2012','2019','2021','2022','2023'] and types ['education','role','education','role','role']; primary identities [BEng, Netcompany-Intrasoft, MSc, Upstream Systems, Chubb] (degree vs title per type). Every entry carries its parsed start year via startYear.
      2. Selection contracts consumed unchanged: roles = experience.filter(isTechRelated) (the phase-6 filter governs — the 4 non-tech entries excluded), education = education.filter(featured) (exactly 2; the test-pinned flags at portfolio-data-integrity.test.mjs:426-436 are the source of truth — do not edit data).
      3. Sort contract: stable, nulls-last — synthetic input with a null-year entry places it after every year-ful entry, order-stable within equal keys; the real data has no null years (all 5 parse — assert this too).
      4. Gone-check: `!('selectTimelineRoles' in geometry)` — the module has no such export key; ONE derivation site (OQ-8). The literal symbol name appears ONLY inside this gone-check (assertion + comment) and nowhere as a call or import.
      5. Template field mapping (pure data level): for the active-entry rendering contract, assert the type-aware field PICKERS exist as pure expectations — role entry exposes title/company/duration/location/responsibilities; education entry exposes degree/institution/duration/specialization-optional (BEng has no specialization — assert undefined; MSc = 'Software Quality Assurance Engineering'). The component-level template is verified in Task 3's export checks.
      6. n=5 sweeps: markerAngle invariant ∀ progress ∈ [0,1] step 0.01 keeps every θ ∈ [90,270] (Δ=22.5°); emphasis ladder at c′∈{0,1,2,3,4} yields opacities exactly [1, 0.9125, 0.825, 0.7375, 0.65] and scales [1, 0.925, 0.85, 0.775, 0.7]; keyboard round-trip activeIndexFromContinuous(progressForRole(i,5)) === i for i∈{0..4}; contentLayer/reducedMotion variants unchanged at n=5; E-2 n=1 guards unchanged.
      7. W-4 over education durations: dateLineFits('October 2021 - June 2023', 196) === true and dateLineFits('September 2012 - December 2018', 196) === true (24/30 chars × 6px ≤ innerWidth − 16).
      8. In tests/explore-visuals-server.test.mjs: renew ONLY the line-90 source-grep pin — `selectTimelineRoles` → `selectTimelineEntries` (same assertion intent: role/entry selection via the pure module). Do not touch the other assertions in that file.
      9. In tests/explore-visuals.test.mjs (line ~314) and tests/explore-visuals-skills.test.mjs (line ~156): renew the SINGLE experience-adapter pin in each — `src.includes('experience: ({ data }) => <ExperienceSection experience={data.experience} />,' )` → `src.includes('experience: ({ data }) => <ExperienceSection experience={data.experience} education={data.education} />,')` — the education-passing form Task 2 introduces. In tests/explore-visuals.test.mjs renew ALSO the counter-idiom pin's MESSAGE text at ~line 881 — '...is present (§4: 01 / 03, the PanelShell index precedent)' → '...is present (§4: 01 / 05, the PanelShell index precedent)' — after Task 2 the SSR counter renders 01 / 05 and no factually stale message survives the diff; the asserted VALUE idiom at line 880 (`padStart(2, '0')} /`) is untouched and stays green through Task 2. Touch NOTHING else in these two files: the about/skills/projects adapter pins, the four-closure count, the hover:/aria-live idioms, the padStart VALUE assertion, and every other assertion are verified to survive the Task-2 diff and must stay byte-identical. These two renewed pins are part of this task's RED (the tree still carries the old adapter until Task 2); the message-text renewal is timing-neutral (the idiom assertion is green before and after Task 2).
      Run `node --test tests/explore-timeline.test.mjs tests/explore-visuals-server.test.mjs tests/explore-visuals.test.mjs tests/explore-visuals-skills.test.mjs` — RED confined to the renewed blocks (timeline suite: missing-export/gone-check blocks; visuals-server: the renewed line-90 pin; the two visuals files: the two renewed adapter pins); every retained phase-8 assertion still passing.
    </action>
    <verify>node --test tests/explore-timeline.test.mjs tests/explore-visuals-server.test.mjs tests/explore-visuals.test.mjs tests/explore-visuals-skills.test.mjs exits non-zero with failures confined to the renewed blocks (missing export / absent source string), with every retained phase-8 assertion still passing</verify>
    <acceptance_criteria>
      - `grep -c "await import('../src/components/explore/timeline-geometry.ts')" tests/explore-timeline.test.mjs` ≥ 1 (dynamic namespace import — the new-contract blocks never statically import the not-yet-existing export)
      - `grep -c "selectTimelineRoles(" tests/explore-timeline.test.mjs` returns 0 (no call sites remain — the symbol survives ONLY inside the gone-check's absence assertion, which contains the bare literal)
      - The suite contains a gone-check that selectTimelineRoles is absent from the module exports
      - The 5-entry contract asserts years ['2012','2019','2021','2022','2023'] and types ['education','role','education','role','role'] against the real JSON
      - tests/explore-visuals.test.mjs and tests/explore-visuals-skills.test.mjs each contain the renewed pin string `experience: ({ data }) => <ExperienceSection experience={data.experience} education={data.education} />,`
      - tests/explore-visuals.test.mjs carries the renewed counter-idiom message text — `grep -c "§4: 01 / 05" tests/explore-visuals.test.mjs` ≥ 1 and `grep -c "§4: 01 / 03" tests/explore-visuals.test.mjs` returns 0 — with the value assertion `padStart(2, '0')} /` byte-identical
      - Command `node --test tests/explore-timeline.test.mjs` fails inside the renewed contract blocks (undefined-property TypeError / gone-check), NOT at module load and NOT in any retained section
    </acceptance_criteria>
    <done>The renewed suites express the full REV-16 derivation contract and are red for exactly the missing-derivation reasons, with every retained assertion still green</done>
  </task>
  <task type="feat">
    <name>Task 2: GREEN — selectTimelineEntries in the pure module + both consumers migrated + the type-aware stage templates (one atomic change; the type union forces the template branch in the same commit)</name>
    <files>src/components/explore/timeline-geometry.ts, src/components/explore/sections/experience-section.tsx, src/components/explore/explore-panels.tsx</files>
    <read_first>tests/explore-timeline.test.mjs (the Task-1 contract is the spec), src/components/explore/timeline-geometry.ts (header rules lines 15-29 + selectTimelineRoles at 253-262), src/components/explore/sections/experience-section.tsx (full), src/components/explore/explore-panels.tsx (lines 59-153), .planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md (§3.2/§3.3)</read_first>
    <action>
      1. timeline-geometry.ts: add the type-only `EducationEntry` import alongside the existing ExperienceEntry type import (stays erasable — zero RUNTIME imports preserved). Add `export interface TimelineEntry { type: 'role' | 'education'; year: string | null; entry: ExperienceEntry | EducationEntry }`. Add `export function selectTimelineEntries(experience: ExperienceEntry[], education: EducationEntry[]): TimelineEntry[]` per D-03: roles = experience.filter(isTechRelated) → { type: 'role', year: startYear(entry.duration), entry }; edu = education.filter(featured) → { type: 'education', year: startYear(entry.duration), entry }; merge; stable sort by numeric start-year ascending with null years LAST (Array.prototype.sort is stable in Node — document the reliance). The new function's docstring MUST explicitly scope the module's lines-27-29 no-sort rule to this ONE function (UI-SPEC §3.1: the phase's one deliberate sort) so the contradiction is documented, not silent. DELETE selectTimelineRoles entirely (OQ-8 — no deprecated alias, no fork). Every other function byte-untouched.
      2. experience-section.tsx: swap the import to selectTimelineEntries + TimelineEntry; ExperienceSection gains a second prop `education: PortfolioData['education']` and calls selectTimelineEntries(experience, education); the E-1 empty-guard becomes entries.length === 0 → null. Marker anatomy (per UI-SPEC §3.2 W-2 resolution): education dots carry the CONSTANT className 'rounded-full border border-chart-2 bg-transparent' in BOTH states — never fill, never swap size class, no per-frame-write change; role dots keep the existing dotSize/dotFill swap. Marker keys become type-aware (education has no company — key on the type-aware primary: entry.company for roles, entry.institution for education, plus index). Marker labels: education renders the year only (no duration date-line suffix); roles keep the active date-line behind W-4. Content template (§3.3): role branch byte-identical to today (title h3 / company / duration·location merged meta / ≤3 bullets); education branch renders degree (h3), institution (text-sm), duration AS STORED (text-xs muted, NO location, no separator), and specialization as one text-xs muted line ONLY when present (BEng omits). Compact (<md) year chips: education chips carry the hollow-dot class too. sr-only announce (U-9 default): `Entry ${activeIndex + 1} of ${n} — ${primary}, ${secondary}` where primary = title|degree, secondary = company|institution. SSR idiom (lines 199-213) unchanged mechanically — entry 0 is now BEng.
      3. explore-panels.tsx: migrate the consumer in the SAME change (OQ-8) — import selectTimelineEntries (line 61); the W-3 gate (line 121) becomes selectTimelineEntries(data.experience, data.education).length > 1 (5 > 1 → sticky retained, E-2 preserved); the SECTION_BODIES experience adapter (line 92) passes education={data.education}. Touch NOTHING else in this file (plan 03 owns the placement map next wave).
      4. Update the two files' header comments where they name selectTimelineRoles / the 3-role contract (experience-section header lines 16-19; explore-panels W-3 comment lines 28-30).
      NOTE: the two adapter pins in tests/explore-visuals.test.mjs and tests/explore-visuals-skills.test.mjs were ALREADY renewed to the education-passing form by Task 1 — they go GREEN with this commit. This feat commit touches NO test file (the Task-1 test commit already owns every renewal).
      Run the suite: tests/explore-timeline.test.mjs, tests/explore-visuals-server.test.mjs, tests/explore-visuals.test.mjs and tests/explore-visuals-skills.test.mjs go GREEN; typecheck passes.
    </action>
    <verify>node --test tests/explore-timeline.test.mjs tests/explore-visuals-server.test.mjs tests/explore-visuals.test.mjs tests/explore-visuals-skills.test.mjs green; npm run typecheck exits 0</verify>
    <acceptance_criteria>
      - `grep -c "selectTimelineEntries" src/components/explore/timeline-geometry.ts` ≥ 2 (interface usage + function)
      - `grep -c "selectTimelineRoles" src/components/explore/timeline-geometry.ts` returns 0 (deleted, no alias)
      - `grep -c "selectTimelineEntries(data.experience, data.education)" src/components/explore/explore-panels.tsx` returns 1
      - `grep -c "education" src/components/explore/sections/experience-section.tsx` ≥ 3 (prop, derivation, template branch)
      - `grep -rn "framer-motion" src/components/explore/sections/experience-section.tsx src/components/explore/use-timeline-progress.ts` returns 0 matches (D-05 grep gate)
      - `git diff --stat src/components/explore/use-timeline-progress.ts` is empty (byte-untouched engine)
      - `node --test tests/explore-timeline.test.mjs` exits 0 with the 5-entry contract green
      - `node --test tests/explore-visuals.test.mjs tests/explore-visuals-skills.test.mjs` exits 0 (the renewed education-passing adapter pins green)
    </acceptance_criteria>
    <done>The arc derives 5 typed entries from the real data, renders the type-aware templates through the byte-untouched engine, and both consumers migrated in the same atomic commit — with no stale pin left behind</done>
  </task>
  <task type="test">
    <name>Task 3: renew the static-export arc pins (sweep E-6…E-9) to the 5-entry contract + the full green gate over this plan's tree</name>
    <files>tests/explore-sweep.test.mjs</files>
    <read_first>tests/explore-sweep.test.mjs (E-6…E-9 block, lines 319-383), tests/explore-sweep.test.mjs lines 40-110 (the placement greps — DO NOT touch them; plan 03 renews those next wave)</read_first>
    <action>
      1. Renew ONLY the phase-8 E-6…E-9 block in tests/explore-sweep.test.mjs to the 5-entry contract: E-6 → entry 1 = the first selectTimelineEntries result (BEng, education) with degree/institution/duration AS STORED asserted against the real JSON (no location expectation, no bullet expectation for education); E-7 → hidden layers ≥ 4 (5 entries, 1 visible); E-8 → counter renders 01 / 05, the aria-labels and arc path unchanged; E-9 → exactly 5 data-timeline-dot and 5 data-timeline-label spans at inline opacity:0. Do NOT touch the placement/order-first assertions elsewhere in the file (they are plan 03's scope and are still green).
      2. Run npm run build (regenerates out/explore.html), then node --test over EXACTLY the five suites this plan's diff touches — tests/explore-timeline.test.mjs, tests/explore-visuals-server.test.mjs, tests/explore-visuals.test.mjs, tests/explore-visuals-skills.test.mjs, tests/explore-sweep.test.mjs — everything green including the renewed sweep block and the Task-1-renewed adapter pins in tests/explore-visuals.test.mjs and tests/explore-visuals-skills.test.mjs. SCOPE RULE (declared wave-1 coupling): plans 01 and 02 are both wave 1 and run in PARALLEL — do NOT run the full tests/ directory from this plan; a tree-wide suite run here can observe plan 02's transient post-checkpoint red (its Task 2 RED-first integrity assertions fail in the working tree until the approved data write lands in the same task; its Task 3 restructures about-section.tsx mid-task) and report a spurious red attributable to neither plan. The phase-final FULL suite run — every suite, including plan 02's files and plans 03-04's — is owned by plan 04 Task 3's chronologically-last green gate (wave 3, after all earlier waves complete).
      3. Grep the phase gates one final time: zero framer-motion under src/components/explore/sections/experience*; use-timeline-progress.ts diff empty; the 5-marker math assertions from Task 1 all green.
      4. Commit the sweep renewal as its own test: commit (atomic per task).
    </action>
    <verify>npm run build exits 0; node --test over the five diff-touched suites (explore-timeline / explore-visuals-server / explore-visuals / explore-visuals-skills / explore-sweep) exits 0</verify>
    <acceptance_criteria>
      - out/explore.html contains the BEng degree string and 'September 2012 - December 2018' AS STORED
      - out/explore.html contains '01 / 05'
      - out/explore.html contains exactly 5 matches of data-timeline-dot="true" at opacity:0 and 5 data-timeline-label="true" at opacity:0
      - `node --test tests/explore-sweep.test.mjs` exits 0
      - The md:order-first count assertions in explore-sweep.test.mjs are untouched by this plan's diff (git diff shows no change near lines 51-107)
    </acceptance_criteria>
    <done>The static export carries the 5-entry arc with BEng as the SSR-visible entry; the five diff-touched suites are green over this plan's final tree (the phase-final full-suite gate is plan 04 Task 3, wave 3)</done>
  </task>
</tasks>