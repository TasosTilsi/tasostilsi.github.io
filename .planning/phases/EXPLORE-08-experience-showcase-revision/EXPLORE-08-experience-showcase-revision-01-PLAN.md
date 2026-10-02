---
phase: 08-experience-showcase-revision
plan: 01
type: tdd
wave: 1
depends_on: []
files_modified:
  - src/components/explore/timeline-geometry.ts
  - tests/explore-timeline.test.mjs
autonomous: true
requirements: ["REV-07", "REV-12", "REV-13"]
user_setup: []
must_haves:
  truths:
    - "startYear on the real data file yields '2023', '2022', '2019' — the FIRST year match wins for 'Sept 2022 — Aug 2023' (D-03/R-14)"
    - "selectTimelineRoles on the real data yields exactly [Chubb, Upstream Systems, Netcompany-Intrasoft] in JSON order, no sorting (D-06)"
    - "For n=3 the exact-fit carousel keeps every marker angle within [90°,270°] for every progress in [0,1] (Δ=45°), and the active role sits at θ=180° (the focal point, vertical center) whenever c′ is an integer"
    - "Keyboard targets round-trip through the primary derivation: activeIndexFromContinuous(progressForRole(i,n)) === i for all i, including the legitimate band edges 0 and n−1 (D-02/UI-SPEC §2.3 W-2)"
    - "The reduced-motion variant returns frozen angles {180,135,90} by index, scale 1, translateY 0, opacity-only emphasis (D-04/UI-SPEC §7 RM-1/RM-2)"
    - "The generalized math holds for n ∈ {1,2,4} — the data yields 3, the math is not 3-hardcoded (UI-SPEC E-3)"
  artifacts:
    - path: "src/components/explore/timeline-geometry.ts"
      provides: "The ONE pure derivation module for the phase (UI-SPEC §14 seam 1 / R-13): sticky-range progress, continuous carousel index, marker angles/points/emphasis, content-layer states, reduced-motion variants, viewBox→px geometry, role selection (isTechRelated), start-year parse, keyboard scroll targets — zero runtime imports, erasable TS, node --test importable"
      min_lines: 120
      exports: ["computeProgress", "continuousIndex", "activeIndexFromContinuous", "markerAngle", "markerEmphasis", "contentLayer", "reducedMotionAngle", "reducedMotionEmphasis", "viewBoxToPx", "markerPoint", "progressForRole", "scrollTargetForRole", "startYear", "selectTimelineRoles", "dateLineFits"]
    - path: "tests/explore-timeline.test.mjs"
      provides: "The unit-test core of the phase: every UI-SPEC §1.3/§2.2/§2.3/§3 formula asserted pure, plus data shaping asserted against the REAL portfolio-main-data.json at test time"
      min_lines: 140
      exports: []
  key_links:
    - from: "tests/explore-timeline.test.mjs"
      to: "src/data/portfolio-main-data.json"
      via: "readFileSync at test time — expectations derived from the real JSON, never copied literals (house precedent, explore-visuals.test.mjs header)"
      pattern: "portfolio-main-data.json"
    - from: "tests/explore-timeline.test.mjs"
      to: "src/components/explore/timeline-geometry.ts"
      via: "direct .ts import under node --test (Node 24 type stripping) — proves the zero-runtime-import/erasable-TS contract (R-12) by the import itself"
      pattern: "from '../src/components/explore/timeline-geometry.ts'"
---

<objective>
Build the pure derivation core of the semicircular career timeline: ONE zero-runtime-import module (`timeline-geometry.ts`) implementing every UI-SPEC formula (§1.3 progress, §2.2 geometry, §2.3 carousel, §3 content layers, §7 reduced-motion variants) plus role selection and start-year parsing (D-06/D-03, R-13/R-14), proven by a RED-first unit suite that asserts against the real data file. This module is the single source of truth every later plan consumes — REV-12's "single source of truth" and REV-13's reduced-motion/keyboard contracts are DERIVED here as pure, unit-testable functions before any component exists.
</objective>

<assumption_delta_decision>
- Noun now primary: the **timelineProgress derivation domain** (progress/c′ + the isTechRelated role selection) — ONE timeline identity.
- Decision: **promote**. Scroll input, keyboard stepping (UI-SPEC §5), Prev/Next buttons, the reduced-motion rendering (§7), and the <md compact rendering (§8 B-1, single DOM) are all variants/subscribers of the same derivation. The phase-7 rail+dots `slice(0,3)` list is REPLACED (gone-checks in plan 02), not maintained alongside.
- Rationale: D-02/D-04 plus UI-SPEC §2.3/§8 pin one pure derivation and one DOM serving every variant; an add-alongside rail would duplicate content and violate the single-source-of-truth acceptance. No accepted debt.
- Companion invariant (encoded in Task 1 tests): every confirmed variant round-trips through the primary use-path — `progressForRole(i)` → `activeIndexFromContinuous` → i (keyboard), `selectTimelineRoles` feeding stage, compact list and wrapper-height alike, reduced-motion derivations = the same functions with the `reducedMotion` flag.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-08-experience-showcase-revision/EXPLORE-08-experience-showcase-revision-UI-SPEC.md — the sealed design contract; §2.2/§2.3/§3 formulas are NORMATIVE (they supersede the research's band-model sketch: activeIndex is Math.round(c′), keyboard targets are role positions i/(n−1), not band centers)
@.planning/phases/EXPLORE-08-experience-showcase-revision/EXPLORE-08-experience-showcase-revision-CONTEXT.md — D-01…D-07 locked decisions
@src/components/explore/tour-placement.ts — the R-12 header contract precedent (zero runtime imports, erasable TS, direct node --test import)
@src/components/explore/viz-data.ts — the surviving GLOBAL_YEAR_PATTERN regex precedent (line 90) and the erasable-TS header discipline; NOTE: R-14 — parseDuration/YEAR_PATTERN do NOT exist anymore, do not import a phantom function; viz-data.ts itself is NOT edited in this plan (UI-SPEC R-13 moves this phase's derivations to the new module)
@src/data/portfolio-main-data.json — the real data the tests assert against (tech durations use em-dash U+2014)
@src/data/portfolio-main-data.d.ts — ExperienceEntry shape
@tests/explore-visuals-server.test.mjs — house node --test style (header, runner note, read() helper)
</context>

<tasks>
  <task type="test">
    <name>Task 1: RED — the pure derivation contract suite</name>
    <files>tests/explore-timeline.test.mjs</files>
    <read_first>.planning/phases/EXPLORE-08-experience-showcase-revision/EXPLORE-08-experience-showcase-revision-UI-SPEC.md (§2.2, §2.3, §3, §7, §13 "new tests" list), src/components/explore/viz-data.ts, src/components/explore/tour-placement.ts, tests/explore-visuals-server.test.mjs (house style), src/data/portfolio-main-data.json</read_first>
    <action>
      Create tests/explore-timeline.test.mjs in the house node --test style: header comment with runner note ("node --test tests/explore-timeline.test.mjs — no npm test script exists"), assert from node:assert/strict, readFileSync of the REAL src/data/portfolio-main-data.json (never copied literals). Import the not-yet-existing module directly: `import { ... } from '../src/components/explore/timeline-geometry.ts'` — the import itself is the R-12 erasable-TS proof. Write one test per contract, expectations quoted from UI-SPEC §2.3 (these are NORMATIVE — implement the spec's formulas, not the research's band model):
      1. computeProgress: rel=0 → 0; rel=−range → 1; clamps outside [0,1]; monotonic over a rel sweep; range≤0 → 0 (total, no NaN).
      2. continuousIndex: (n−1)·progress; roleCount 1 → 0.
      3. activeIndexFromContinuous (Math.round NORMATIVE per W-2): c′=0.49→0, 0.5→1, 1.5→2, 2→2; clamps to [0, n−1].
      4. markerAngle exact-fit invariant: for n=3, sweep progress 0→1 step 0.01, every marker angle ∈ [90,270]; Δ=90/(n−1)=45; at c′=i exactly, angle(i)=180 (focal point, vertical center); generalized n∈{1,2,4} keeps the invariant (n=1 → 180; n=2 → Δ=90; n=4 → Δ=30).
      5. markerPoint + viewBoxToPx: for zone 250×520, s=min(250/100, 520/200)=2.5, center/radius per §2.2 (centerX=offsetX+100·s, centerY=offsetY+100·s, radius=100·s); θ=180 → vx=0 (left bulge, focal); θ=90 → vy=200 (BOTTOM end — SVG y-down); θ=270 → vy=0 (top end); label point = markerPoint at radius·0.88.
      6. markerEmphasis ladder at n=3: c′=1 → i=1 {opacity:1, scale:1}; i=0 and i=2 {opacity:0.825, scale:0.85}; c′=0 → i=2 {opacity:0.65, scale:0.7}; monotone in |i−c′|.
      7. contentLayer states (§3): d=0 → {opacity:1, translateY:0, visible:true}; d=0.5 → {opacity:0.5, translateY:7, visible:true}; d=−0.5 → {opacity:0.5, translateY:−7, visible:true}; d=1 → {opacity:0, translateY:14, visible:false}; d=2 → {opacity:0, translateY:28, visible:false}; translateY clamped to ±28.
      8. Reduced-motion variants (§7 RM-1/RM-2): reducedMotionAngle(i,3) frozen {180,135,90} by index; reducedMotionEmphasis = opacity ladder with scale 1; contentLayer(reducedMotion=true) → translateY≡0 with opacity still tracking c′.
      9. progressForRole: i/(n−1) — round-trip activeIndexFromContinuous(progressForRole(i,3)) === i for i∈{0,1,2} (edges 0 and 1 are legitimate targets, W-2); roleCount 1 → 0.
      10. scrollTargetForRole(scrollTop, rel, i, n, range) === scrollTop + rel + progressForRole(i,n)·range (arithmetic assertions incl. rel=0 engage case).
      11. startYear against the REAL JSON: the 3 isTechRelated durations → '2023','2022','2019'; 'Sept 2022 — Aug 2023' → '2022' (FIRST match — never max/min); 'Ongoing' → null; '' → null.
      12. selectTimelineRoles against the REAL JSON: length 3; companies exactly ['Chubb','Upstream Systems','Netcompany-Intrasoft'] in JSON order (no sorting); the 4 non-tech entries excluded.
      13. dateLineFits (W-4): 6px/char — a 19-char duration fits innerWidth 200 (114 ≤ 184) and does NOT fit innerWidth 100 (114 > 84).
      Run `node --test tests/explore-timeline.test.mjs`. The module does not exist yet, so FIRST create a minimal stub src/components/explore/timeline-geometry.ts that exports every imported name with `throw new Error('not implemented')` bodies and the type-only import line — NO logic. The stub exists only to make the suite EXECUTE and fail on its assertions/throws: red for the missing behavior. A module-resolution crash is NOT red evidence (red-green discipline: a run that fails for the wrong reason proves nothing). The suite + stub commit together as the plan's first commit (test: commit). Commit test-first.
    </action>
    <verify>node --test tests/explore-timeline.test.mjs exits non-zero with a failing count in the runner output and every test executing — failures are assertion/throw failures from the stubs, not a module-not-found crash</verify>
    <acceptance_criteria>
      - tests/explore-timeline.test.mjs exists and imports '../src/components/explore/timeline-geometry.ts' directly (grep: "timeline-geometry.ts")
      - the suite reads src/data/portfolio-main-data.json at test time (grep: "portfolio-main-data.json")
      - the RED run output shows the suite executing (pass + fail counts printed) with failures caused by the not-implemented stubs — never a module-resolution crash
      - the plan's first commit contains the test suite (+ stub) and precedes any implementation commit
    </acceptance_criteria>
    <done>The full derivation contract is written as failing tests — the phase's unit-test core exists and pins UI-SPEC §2.3 verbatim.</done>
  </task>

  <task type="feat">
    <name>Task 2: GREEN — implement the derivation math in timeline-geometry.ts</name>
    <files>src/components/explore/timeline-geometry.ts</files>
    <read_first>src/components/explore/tour-placement.ts (R-12 header pattern), src/components/explore/viz-data.ts:14-24 + :90 (erasable discipline + GLOBAL_YEAR_PATTERN), UI-SPEC §1.3/§2.2/§2.3/§3</read_first>
    <action>
      Replace the Task 1 stub bodies in src/components/explore/timeline-geometry.ts with the real implementations of EVERY function Task 1 pins, keeping the exact signatures from the test imports and the stub's type-only import line. Header comment cites UI-SPEC §14 seam 1, R-12 (ZERO runtime imports — the ONLY import line is type-only, erased at runtime: `import type { ExperienceEntry } from '@/data/portfolio-main-data'`), R-13 (this module is the phase's ONE derivation site per UI-SPEC §15 seams — it intentionally supersedes the viz-data "single data-shaping site" header for phase-8 derivations; viz-data.ts is NOT edited), R-14 (startYear is a NEW pure function following the surviving GLOBAL_YEAR_PATTERN regex precedent — no phantom parseDuration import). Erasable TS only (annotations/interfaces — no enum/namespace/parameter properties) so Node 24 type-stripping imports it directly. Implement per the NORMATIVE UI-SPEC formulas: computeProgress = clamp(−rel/range, 0, 1) with range≤0 → 0; continuousIndex = (n−1)·progress; activeIndexFromContinuous = Math.round clamped to [0, n−1] (W-2: NOT band if/else); markerAngle = 180 − (index−c′)·(90/(n−1)), n≤1 → 180; markerEmphasis t = 1 − min(|i−c′|, n−1)/(n−1), opacity = 0.65+0.35t, scale = 0.7+0.3t; contentLayer d = i−c′, opacity = clamp(1−|d|, 0, 1), translateY = reducedMotion ? 0 : clamp(14·d, −28, 28), visible = |d|<1; reducedMotionAngle(i,n) = markerAngle(i, 0, n); reducedMotionEmphasis = opacity ladder with scale 1; viewBoxToPx per §2.2 (s = min(zoneW/100, zoneH/200), offsets center the meet-mapped box, centerX = offsetX+100·s, centerY = offsetY+100·s, radius = 100·s); markerPoint(geometry, thetaDeg) = { x: centerX + radius·cos(θrad), y: centerY + radius·sin(θrad) } — the LOCKED formula with SVG y-down (θ∈[90,270] renders the left-bulging C; §2.1); progressForRole = i/(n−1), n≤1 → 0; scrollTargetForRole = scrollTop + rel + progressForRole·range; startYear = first /\b(?:19|20)\d{2}\b/ match else null; selectTimelineRoles = filter(isTechRelated) in JSON order mapping to { year, entry } (no sorting — D-06); dateLineFits(duration, innerWidthPx) = duration.length·6 ≤ innerWidthPx − 16 (W-4). Run the suite — every Task 1 test goes green.
    </action>
    <verify>node --test tests/explore-timeline.test.mjs exits 0</verify>
    <acceptance_criteria>
      - `node --test tests/explore-timeline.test.mjs` exits 0
      - grep timeline-geometry.ts for "Math.cos" and "Math.sin" (the locked cos/sin positioning, REV-07)
      - grep timeline-geometry.ts: the ONLY import line is `import type` (R-12 zero runtime imports)
      - grep timeline-geometry.ts for "isTechRelated" (D-06 role selection lives in the module, not components)
    </acceptance_criteria>
    <done>Every derivation the phase needs exists as a pure, unit-tested function; the module imports cleanly under node --test.</done>
  </task>

  <task type="feat">
    <name>Task 3: RED→GREEN — data-shaping edge hardening (unparseable durations, n=1 guard)</name>
    <files>tests/explore-timeline.test.mjs, src/components/explore/timeline-geometry.ts</files>
    <read_first>UI-SPEC §12 E-2/E-3/E-4, src/data/portfolio-main-data.json (non-tech durations use hyphen U+002D)</read_first>
    <action>
      Add the edge tests first (RED), then close any gaps in the module (GREEN): (a) selectTimelineRoles + startYear over the NON-tech entries — 'November 2017 - April 2018' (hyphen U+002D) still parses a year via startYear but is EXCLUDED by the filter; (b) n=1 guards: continuousIndex → 0, markerAngle → 180, progressForRole → 0, markerEmphasis → {1,1}, contentLayer at c′=0 → active state (E-2 single-role stage math); (c) contentLayer at |d|>2 clamps translateY to ±28 for any n; (d) computeProgress with rel beyond ±range clamps (release semantics — scrolling past the range flows naturally, UI-SPEC §1.3); (e) dateLineFits with the empty string → true (no label to drop). Fix the module where an edge guard is missing (divide-by-zero n−1 paths must be total). Commit atomically (test additions + guards in one commit — the plan's first commit is already Task 1's test: commit, so the tdd ordering holds).
    </action>
    <verify>node --test tests/explore-timeline.test.mjs exits 0 after the additions</verify>
    <acceptance_criteria>
      - the suite contains a test asserting the hyphen-U+002D non-tech duration is filtered out while startYear still parses it
      - the suite contains n=1 guard tests (E-2) and a divide-by-zero-totality check
      - `node --test tests/explore-timeline.test.mjs` exits 0
    </acceptance_criteria>
    <done>The derivation module is total over the edge matrix (E-2/E-3/E-4) and the suite proves it.</done>
  </task>
</tasks>
</content>