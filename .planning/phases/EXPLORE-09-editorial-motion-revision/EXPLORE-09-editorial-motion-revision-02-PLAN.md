---
phase: 09-editorial-motion-revision
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - .planning/phases/EXPLORE-09-editorial-motion-revision/about-data-draft.md
  - src/data/portfolio-main-data.json
  - src/data/portfolio-main-data.d.ts
  - src/components/explore/sections/about-section.tsx
  - tests/portfolio-data-integrity.test.mjs
autonomous: false
requirements: ["REV-15"]
user_setup: []
must_haves:
  truths:
    - "The About panel leads with the pinned two-line positioning statement rendered as two block spans — line 1 'I design test automation frameworks and AI-driven QA infrastructure that entire engineering organizations adopt.' (text-base font-medium text-foreground leading-snug), line 2 '— not just run.' (text-base text-accent) — never joined (D-02/UI-SPEC §2.2)"
    - "An impact-metric row renders exactly the 4 approved stats from the NEW about.metrics array as 2×2 mini-tiles — '12+' engineering teams, '30+' engineers, '7+' years, '600+' npm launch week — verbatim data, never computed at render (UI-SPEC §2.3)"
    - "The availability badge renders about.availability ('Open to selective part-time work', verbatim from the CLI banner WelcomeMessage.tsx:42) as a non-interactive accent pill (UI-SPEC §2.4)"
    - "The avatar renders from about.profileImageUrl as a plain <img loading=lazy decoding=async> rounded-full object-cover h-16 w-16 md:h-20 md:w-20 with a meaningful alt; empty URL → graceful-hide (UI-SPEC §2.5/U-12)"
    - "The full summary renders demoted below the lead (text-xs muted; reverts to text-sm text-foreground when positioning is absent — §2.8 fallback) with the meta row attached below it; all 9 contact rows render tightened (gap-2, min-h-[44px] STAYS through the shared ROW_CLASS const); the resume link stays LAST"
    - "All three new fields are typed in portfolio-main-data.d.ts in the SAME commit as the JSON write (R-7) and their values were user-approved via the draft→approve→write round (D-02 — the approval round is not skipped)"
  artifacts:
    - path: ".planning/phases/EXPLORE-09-editorial-motion-revision/about-data-draft.md"
      provides: "The 3-field data draft with source-trace table (every value → its verbatim source line) and the user-filled APPROVAL BOX — the phase-6 data-refresh-draft.md precedent"
      min_lines: 40
      exports: []
    - path: "src/data/portfolio-main-data.json"
      provides: "The about object gains positioning (2-string array), availability (string), metrics (4 × {value,label}) — additive only, nothing deleted, all other surfaces untouched"
      min_lines: 350
      exports: []
    - path: "src/data/portfolio-main-data.d.ts"
      provides: "Same-commit optional typing: positioning?: string[]; availability?: string; metrics?: { value: string; label: string }[] (R-7)"
      min_lines: 100
      exports: []
    - path: "src/components/explore/sections/about-section.tsx"
      provides: "The presentation package in the pinned §2.1 block order: lead → metrics 2×2 → availability pill → avatar → demoted summary + meta → divider → 9 tightened contacts → resume link LAST; graceful-hide matrix §2.8; still a server component (no hooks, no framer-motion, no onError)"
      min_lines: 180
      exports: ["AboutSection"]
  key_links:
    - from: "tests/portfolio-data-integrity.test.mjs"
      to: "src/data/portfolio-main-data.json"
      via: "the approved values pinned verbatim at test time — availability string equal to the CLI banner's line, positioning equal to the SPEC's two pinned lines"
      pattern: "Open to selective part-time work"
    - from: "src/components/explore/sections/about-section.tsx"
      to: "src/data/portfolio-main-data.json"
      via: "every new block renders from the data props — no hardcoded portfolio copy in the component (EXPLORE-07 survives)"
      pattern: "about\\.(positioning|metrics|availability)"
    - from: ".planning/phases/EXPLORE-09-editorial-motion-revision/about-data-draft.md"
      to: "src/components/cli/outputs/WelcomeMessage.tsx"
      via: "the draft's source-trace table records availability as a VERBATIM transcription of the CLI banner line (read-only source; the CLI file itself is NOT edited) — the component never hardcodes the string (the about-section link above holds instead)"
      pattern: "WelcomeMessage\\.tsx"
---

<objective>
Deliver the About presentation package (REV-15, D-02): three NEW data fields (about.positioning, about.metrics, about.availability) through the mandatory draft→approve→write round (the approval round is NOT skipped for personal copy — D-02/phase-6 precedent), typed same-commit in the .d.ts (R-7), then rendered in the pinned UI-SPEC §2.1 block order with the full graceful-hide matrix — positioning lead, 4-stat metrics row, availability pill, rounded avatar, demoted summary, 9 tightened contact rows — while AboutSection stays a server component and the CLI/resume/PDF surfaces stay untouched (additive fields break nothing — verified in RESEARCH §1.2).
</objective>

<execution_note>
WAVE-1 COUPLING (declared): plans 01 and 02 are both wave 1 and the executor contract runs same-wave plans in PARALLEL. Task 1 (the draft + APPROVAL BOX stop) is unaffected — it may run concurrently with the wave-1 siblings and touches no src/ file. The post-checkpoint resume (Tasks 2-3) MUST WAIT until every wave-1 sibling plan has COMPLETED before running: Task 2's RED-first mechanics transiently redden tests/portfolio-data-integrity.test.mjs in the working tree (the new assertions fail until the approved data write lands mid-task), and Task 3 restructures src/components/explore/sections/about-section.tsx — a sibling's tree-wide gate (npm run build / typecheck / a broad suite run) observing this transient state would report a spurious red attributable to neither plan. Symmetrically, Tasks 2-3's own typecheck/build gates must not observe a sibling's uncommitted mid-migration tree — the sibling-completion wait covers both directions. Plan 01's own gate is scoped to its five diff-touched suites (its Task 3), and the phase-final full-suite green gate is owned by plan 04 Task 3 (wave 3, after both wave-1 plans are complete).
</execution_note>

<assumption_delta_decision>
- Noun now primary: the **About lead block** — `about.positioning` (the two pinned lines) becomes the panel's primary statement.
- Decision: **promote**. The old full summary (`about.description`) demotes to a detail of the lead (smaller, muted, below) rather than coexisting as a second lead. No add-alongside debt: there is exactly one lead; the summary is demoted, not duplicated.
- Companion invariant: absence round-trips through the primary path — the §2.8 graceful-hide matrix makes a missing `positioning` render the summary at its pre-phase prominence (text-sm text-foreground), so the pre-phase representation survives as the fallback, never as a parallel rendering.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md — §2 is NORMATIVE (anatomy order §2.1, lead §2.2, metrics §2.3, chip §2.4, avatar §2.5, demoted summary §2.6, contacts §2.7, graceful-hide §2.8, data draft §10)
@.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-CONTEXT.md — D-02 (the 'Everything' package + draft→approve→write mandate)
@src/components/explore/sections/about-section.tsx — the merged panel being enhanced (149 lines; description-first today)
@src/components/explore/sections/project-stat-tiles.tsx — the tile anatomy the metrics 2×2 mirrors (§2.3)
@src/data/portfolio-main-data.json — about object at lines ~14-29; profileImageUrl already exists
@src/data/portfolio-main-data.d.ts — about type block, profileImageUrl: string at line 80 (the new fields ride after it)
@src/components/cli/outputs/WelcomeMessage.tsx — the availability source, line 33/42 VERBATIM (read-only)
@.planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md — the draft→approve→write precedent format (APPROVAL BOX)
@tests/portfolio-data-integrity.test.mjs — pins about.title/description VALUES (lines 219-241); additions go nearby
</context>

<tasks>
  <task type="checkpoint:human-action">
    <name>Task 1: the 3-field data draft + APPROVAL BOX — STOP for user approval before any data write (D-02: the approval round is not skipped)</name>
    <files>.planning/phases/EXPLORE-09-editorial-motion-revision/about-data-draft.md</files>
    <read_first>.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md (§10 verbatim draft values), .planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md (the precedent format), src/components/cli/outputs/WelcomeMessage.tsx (lines 33/42), src/data/portfolio-main-data.json (metric sources: competency proofs + Chubb bullets + DeepIndex description)</read_first>
    <action>
      Write .planning/phases/EXPLORE-09-editorial-motion-revision/about-data-draft.md containing, per UI-SPEC §10 verbatim:
      1. positioning (string[2], verbatim, never joined): 'I design test automation frameworks and AI-driven QA infrastructure that entire engineering organizations adopt.' + '— not just run.'
      2. availability: 'Open to selective part-time work' — source-traced to src/components/cli/outputs/WelcomeMessage.tsx:42 (and :33) VERBATIM, no normalization.
      3. metrics: [{ value: '12+', label: 'engineering teams' }, { value: '30+', label: 'engineers' }, { value: '7+', label: 'years' }, { value: '600+', label: 'npm launch week' }] — each value source-traced to its approved competency-proof/bullet string ('12+ engineering teams', '30+ engineers', '7+ years' in about.description, '600+ downloads in launch week' in the DeepIndex description); values are transcriptions, never render-time computations.
      Include a source-trace table (field → verbatim source file:line → approved value) and the APPROVAL BOX (phase-6 precedent) with approve/amend options. Do NOT modify any src/ file in this task. Present the draft to the user and STOP — execution resumes only after the user fills the approval box.
    </action>
    <verify>the draft file exists with the 3 verbatim field values and an approval box; `git status` shows no src/ modification from this task</verify>
    <acceptance_criteria>
      - .planning/phases/EXPLORE-09-editorial-motion-revision/about-data-draft.md contains the exact strings '— not just run.' and 'Open to selective part-time work' and all four metric values '12+', '30+', '7+', '600+'
      - The draft carries an explicit APPROVAL BOX section (grep 'APPROVAL')
      - No src/** path appears in this task's diff
    </acceptance_criteria>
    <done>The draft is on disk with sources traced and the user has approved (or amended) the three fields in the box</done>
  </task>
  <task type="auto">
    <name>Task 2: write the approved fields (JSON + .d.ts same-commit) and pin them in the integrity suite</name>
    <files>src/data/portfolio-main-data.json, src/data/portfolio-main-data.d.ts, tests/portfolio-data-integrity.test.mjs</files>
    <read_first>.planning/phases/EXPLORE-09-editorial-motion-revision/about-data-draft.md (the APPROVED values), src/data/portfolio-main-data.json (about object), src/data/portfolio-main-data.d.ts (lines 60-90), tests/portfolio-data-integrity.test.mjs (house style; the about pins at lines 219-241)</read_first>
    <action>
      1. RED-first inside the task: add to tests/portfolio-data-integrity.test.mjs assertions that data.about.positioning is an array of exactly 2 strings equal (===) to the approved lines, data.about.availability === 'Open to selective part-time work', data.about.metrics deep-equals the approved 4 × {value,label} array; run node --test on the file — the new assertions FAIL (fields absent).
      2. Apply the approved draft to src/data/portfolio-main-data.json inside the about object (after profileImageUrl) — additive only, nothing else moves; keep JSON formatting consistent with the file's existing style.
      3. SAME COMMIT (R-7): extend src/data/portfolio-main-data.d.ts with positioning?: string[]; availability?: string; metrics?: { value: string; label: string }[] — optional typing aligned with the graceful-hide contract (UI-SPEC §10/§2.8), placed immediately after profileImageUrl: string.
      4. Add a surface-safety assertion: the new fields are additive — grep-verify no CLI/resume/PDF consumer shape-pins about's key set (the integrity suite's existing collection pins stay green untouched).
      5. Run node --test tests/portfolio-data-integrity.test.mjs (GREEN) + npm run typecheck.
      6. Commit data + types + tests atomically (one commit; the R-7 same-commit rule makes splitting a violation).
    </action>
    <verify>node --test tests/portfolio-data-integrity.test.mjs exits 0; npm run typecheck exits 0; git log -1 --stat shows JSON + .d.ts + test in ONE commit</verify>
    <acceptance_criteria>
      - `node -e` reading the JSON confirms about.positioning has exactly 2 entries and about.metrics has exactly 4 entries with the approved values
      - `grep -c "positioning?: string\[\]" src/data/portfolio-main-data.d.ts` returns 1; same for availability?: string and the metrics tuple type
      - `node --test tests/portfolio-data-integrity.test.mjs` exits 0 including the new verbatim-value assertions
      - The commit containing the JSON edit also contains the .d.ts edit (R-7 same-commit)
    </acceptance_criteria>
    <done>The approved 3 fields live in the data file, typed same-commit, and the integrity suite pins them verbatim</done>
  </task>
  <task type="auto">
    <name>Task 3: the AboutSection presentation package — pinned §2.1 block order, graceful-hide matrix, tightened contacts, server component preserved</name>
    <files>src/components/explore/sections/about-section.tsx</files>
    <read_first>.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md (§2.1-§2.8), src/components/explore/sections/about-section.tsx (full), src/components/explore/sections/project-stat-tiles.tsx (the tile anatomy mirrored by the metrics tiles), src/data/portfolio-main-data.d.ts (the new optional fields)</read_first>
    <action>
      Restructure AboutSection to the pinned §2.1 block order (notes order is authoritative — U-1), keeping it a SERVER component (no "use client", no hooks, no onError — U-5/U-12):
      1. Positioning lead: about.positioning renders as TWO block spans, never joined — line 1 'text-base font-medium text-foreground leading-snug', line 2 'text-base text-accent' (the em-dash tail as the accent punch, U-2 default). Absent/empty → lead omitted AND the summary renders at its pre-phase prominence (text-sm text-foreground — the §2.8 row-1 fallback).
      2. Metrics row: 2×2 mini-tile grid 'grid grid-cols-2 gap-2', tile anatomy mirroring project-stat-tiles.tsx:21-30 — 'rounded-md border border-border p-2.5', value 'text-sm font-medium leading-none tabular-nums text-foreground', label 'mt-1 text-[10px] uppercase tracking-wider text-muted-foreground'. Renders what exists (1-4 entries — the UI is total, §2.8); empty array → row omitted, no placeholder. Values render as stored; labels uppercased by CSS only.
      3. Availability chip: pill with a 'h-2 w-2 rounded-full bg-chart-1' dot + the verbatim text, 'rounded-full border border-border px-2.5 py-1 text-xs text-accent'; non-interactive (no hover/focus/cursor); absent → omitted.
      4. Avatar: plain <img loading="lazy" decoding="async" className="rounded-full object-cover h-16 w-16 md:h-20 md:w-20" alt={`Portrait of ${about.name}`}> from about.profileImageUrl; absent/empty → no element, no invented copy. No next/image (tinyurl not in remotePatterns; next.config.ts output: 'export' + images.unoptimized — RESEARCH §1.2).
      5. Demoted summary + meta: about.description at 'text-xs leading-relaxed text-muted-foreground'; the existing meta row (Briefcase/MapPin) unchanged directly below; then the existing my-3 divider.
      6. Tightened contacts (§2.7): anatomy unchanged (CHANNELS table, ROW_CLASS, graceful-hide per empty value, email mailto / external noopener pair); tightening = gap-2.5 → gap-2 on the row, value span gains leading-snug, divider my-3 → my-2, resume link mt-3 → mt-2; min-h-[44px] STAYS on every row and the resume link (44px rail, D-05) — via the SHARED ROW_CLASS const (edit the const once; the 9 CHANNELS rows render through it) and the resume link's own class; do NOT inline min-h-[44px] per-row.
      7. Full resume link stays LAST and byte-identical apart from the mt-2 rhythm.
      Zero framer-motion, zero new globals.css declarations, zero invented copy anywhere. Then the green gate: npm run typecheck + npm run build + node --test tests/portfolio-data-integrity.test.mjs tests/explore-visuals.test.mjs — all green. tests/explore-visuals.test.mjs is the ONLY other suite that reads the About source today (its M3/M5 pins at ~lines 543-553 read about-section.tsx: exp-nudge ≥ 2 across the channel icons + the resume ArrowRight, and group-focus-visible:underline parity ≥ 2 on BOTH underlined labels) — the restructure must leave those pins green, so this suite runs in THIS task's gate, not only at the phase-final full gate (plan 04 Task 3).
    </action>
    <verify>npm run typecheck exits 0; npm run build exits 0; node --test tests/portfolio-data-integrity.test.mjs tests/explore-visuals.test.mjs exits 0 (the About-reading visuals suite included in this task's gate)</verify>
    <acceptance_criteria>
      - `grep -c "about.positioning" src/components/explore/sections/about-section.tsx` ≥ 1 and the lead renders two block spans (grep the two pinned class strings 'text-base font-medium text-foreground leading-snug' and 'text-base text-accent')
      - `grep -c "about.metrics" src/components/explore/sections/about-section.tsx` ≥ 1 and the file contains NO numeric parsing of metric values (no parseInt/split on metrics — values render as stored)
      - `grep -c 'loading="lazy"' src/components/explore/sections/about-section.tsx` returns 1
      - `grep -c "min-h-\[44px\]" src/components/explore/sections/about-section.tsx` ≥ 2 (the shared ROW_CLASS const + the resume link — the const is the 44px rail for the 9 CHANNELS rows)
      - `grep -c "className={ROW_CLASS}" src/components/explore/sections/about-section.tsx` ≥ 2 (both contact-row render branches keep the shared chrome)
      - `grep -c "key: '" src/components/explore/sections/about-section.tsx` returns 9 (the CHANNELS table's nine rows intact — 9 rows render through the shared chrome)
      - `grep -c "use client\|framer-motion\|onError" src/components/explore/sections/about-section.tsx` returns 0 (server component preserved)
      - The graceful-hide branches exist for positioning/metrics/availability/profileImageUrl (4 conditional-render sites greppable)
      - `node --test tests/explore-visuals.test.mjs` exits 0 — the About-reading suite stays green through the restructure (exp-nudge ≥ 2 and underline-parity ≥ 2 pins intact; this gate runs in THIS task, not only at plan 04's phase-final gate)
    </acceptance_criteria>
    <done>The About panel renders the full presentation package from the approved data with every graceful-hide branch in place, server-side, over a green tree</done>
  </task>
</tasks>