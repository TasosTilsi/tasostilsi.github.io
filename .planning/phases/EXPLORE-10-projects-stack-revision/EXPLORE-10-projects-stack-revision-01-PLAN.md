---
phase: 10-projects-stack-revision
plan: 01
type: tdd
wave: 1
depends_on: []
files_modified:
  - "src/components/explore/projects-card-state.ts"
  - "tests/projects-stack.test.mjs"
autonomous: true
requirements: ["REV-18", "REV-19", "REV-20"]
gap_closure: false
user_setup: []
must_haves:
  truths:
    - "The unit-test suite loads src/components/explore/projects-card-state.ts directly under node --test and passes."
    - "cardState(0, 0, 6, false) returns the foreground geometry (translateY 0, scale 1, opacity 1, top zIndex, visible true, activeAmount 1)."
    - "cardState for indices > 0 at progress 0 returns behind-card geometry with negative translateY, scale < 1, opacity < 1, and lower zIndex."
    - "Reduced-motion branch returns translateY/translateX/scale/rotation 0 and uses opacity/zIndex state swaps only."
  artifacts:
    - path: "src/components/explore/projects-card-state.ts"
      provides: "Pure typed derivation of card geometry, first-sentence tagline, year extraction, deterministic technology chips (derived from description, no data-field change), and name-hash visual-variant map."
      min_lines: 80
      exports: ["CardState", "cardState", "firstSentence", "projectYear", "projectTechnologies", "projectVisualVariant", "djb2"]
    - path: "tests/projects-stack.test.mjs"
      provides: "Node-test contract suite for the pure module: geometry, monotonicity, imperfection, RM branch, visibility, SSR snapshot, technology lexicon."
      min_lines: 120
      exports: []
  key_links:
    - from: "tests/projects-stack.test.mjs"
      to: "src/components/explore/projects-card-state.ts"
      via: "static import with explicit .ts extension (Node 24 type stripping)"
      pattern: "import .* from ['\"]\.\./src/components/explore/projects-card-state\.ts['\"]"
    - from: "src/components/explore/projects-card-state.ts"
      to: "src/data/portfolio-main-data.json"
      via: "runtime-free; consumers pass Project objects shaped by the JSON/type file"
      pattern: "interface CardState|function cardState\("
---

<objective>
Deliver the typed, runtime-free geometry module that every stack consumer depends on, plus a red-first node --test contract that pins the continuous stack math, the first-sentence/tagline helper, the year parser, the deterministic technology-chip lexicon, and the name-hash visual-variant map. This plan produces the single source of truth for card appearance before any React code is written.
</objective>

<assumption_delta_decision>
- primary noun: the stacked-card carousel / `cardState(cardIndex, carouselProgress)` geometry
- decision: promote
- rationale: this phase replaces the editorial-row composition; `cardState` becomes the sole md+ Projects panel derivation, and the row/rowState contract is retired. The mobile simplified stack is the promoted responsive variant, not a parallel UI.
- invariant: every responsive path (md+ scroll-driven stack, <md state-driven stack, reduced-motion opacity-only swap, keyboard step) consumes the same `projects.slice(0, 6)` data slice and the same `cardState` active-index rule.
</assumption_delta_decision>

<context_reconciliation>
This plan implements locked decisions that supersede earlier research drafts:
- **projectTechnologies** is required per CONTEXT.md D-04 and UI-SPEC §4.5. It derives chips deterministically from the project description via the pinned `TECH_LEXICON` (lower-cased substring match, first-appearance order, deduplicated, capped at 4). It does NOT add a `technologies` field to `portfolio-main-data.json` (data fields remain out of scope) — RESEARCH.md OQ-1 is reconciled to bless this render-time derivation.
- **Geometry constants** follow UI-SPEC §3 as the final locked source: `step = 38px`, `LEAVE_EXTRA = 56px`, scale `-0.04/level`, opacity keyframes `(0→1, 1→0.95, 2→0.85, 3→0.70, 4→0.50, 5→0.30)`, visible cutoff `opacity ≤ 0.05`. These override the earlier OQ-2 draft numbers.
</context_reconciliation>

<context>
Read before implementing:
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/.planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-UI-SPEC.md §3, §4.5, §9
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/components/explore/projects-row-state.ts (the module being retired — copy firstSentence/rowYear semantics only)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/src/data/portfolio-main-data.d.ts (Project shape)
- @/home/tasostilsi/Development/Projects/tasostilsi.github.io/tests/projects-editorial.test.mjs (the test pattern being replaced)
</context>

<tasks>
  <task type="test">
    <name>Task 1: Write RED unit-test contract for projects-card-state.ts</name>
    <files>tests/projects-stack.test.mjs</files>
    <read_first>src/components/explore/projects-row-state.ts, tests/projects-editorial.test.mjs</read_first>
    <action>
      Create tests/projects-stack.test.mjs that statically imports `{ firstSentence, projectYear, projectTechnologies, projectVisualVariant, djb2, cardState }` from `../src/components/explore/projects-card-state.ts` (do NOT import the `CardState` interface — it is type-only and is erased by Node 24 type stripping; the interface is still exported from the `.ts` module for TypeScript consumers). The failing import is the RED signal. Pin the contracts from UI-SPEC §3/§4.5/§9:
      - Load the real `src/data/portfolio-main-data.json` and slice `data.projects.slice(0, 6)`.
      - firstSentence: the four short top-6 descriptions render whole with terminal period kept; the two over-budget rows (DeepIndex, Clarif-AI) truncate at a word boundary with '…' and never produce '….';
      - projectYear: top-6 dates extract first 4-digit years in data order; absent/unparseable dates return null;
      - projectTechnologies: scan each top-6 description against the TECH_LEXICON (UI-SPEC §4.5) lower-cased on both sides, return first-appearance order, deduplicated, capped at 4; no match returns [];
      - djb2/projectVisualVariant: `djb2('DeepIndex')` and `djb2('Clarif-AI')` produce stable positive integers; `projectVisualVariant('DeepIndex')` returns `'terminal-mock'`; `projectVisualVariant('Clarif-AI')` returns `'contract-analysis'`; other top-6 names map to one of `['glyph','report','dashboard','network']` and re-running with the same name returns the same variant (stability under re-ordering);
      - cardState geometry: at progress 0 card 0 is foreground (translateY 0, scale 1, opacity 1, zIndex 100, visible true, activeAmount 1); cards 1-5 are behind with translateY < 0, scale < 1, opacity < 1, zIndex < 100, visible true for nearby cards;
      - Monotonicity and clamping over a 0→1 sweep: opacity ∈ [0,1], scale ∈ [0.8,1], translateY within the table bounds, zIndex derived from the formula;
      - Reversibility: decreasing progress reverts to the same geometry values;
      - Reduced motion: translateY/translateX/scale/rotation are all 0; opacity still varies; zIndex still varies;
      - Visibility: visible is false when opacity ≤ 0.05 or non-finite;
      - Imperfection: translateX and rotation come from the deterministic index-seeded arrays (IMPERFECTION_X, IMPERFECTION_ROTATION) and are 0 under reduced motion.
    </action>
    <verify>Run `node --test tests/projects-stack.test.mjs`. Expect RED (module not found or import failure).</verify>
    <acceptance_criteria>
      - The test file exists and contains the static import string `../src/components/explore/projects-card-state.ts`.
      - Running `node --test tests/projects-stack.test.mjs` fails because the imported module does not exist.
    </acceptance_criteria>
    <done>RED commit ready: test file in place, import is the single failure cause.</done>
  </task>

  <task type="feat">
    <name>Task 2: Implement the pure projects-card-state.ts module</name>
    <files>src/components/explore/projects-card-state.ts</files>
    <read_first>src/components/explore/projects-row-state.ts, .planning/phases/EXPLORE-10-projects-stack-revision/EXPLORE-10-projects-stack-revision-UI-SPEC.md</read_first>
    <action>
      Create `src/components/explore/projects-card-state.ts` as a zero-runtime-import TypeScript module (erasable syntax only, no enums/namespaces, so Node 24 type stripping can load it directly). Export:
      - `firstSentence(description, maxChars = 120)` — copy the semantics from projects-row-state.ts (keep terminal period, word-boundary ellipsis, no '….');
      - `projectYear(date)` — mirror rowYear: return the first match of `/\b(?:19|20)\d{2}\b/` or null;
      - `projectTechnologies(description, max = 4)` per D-04 and UI-SPEC §4.5: lower-case the description once; iterate the TECH_LEXICON terms in their declared order; for each term, find its lower-cased form as a substring of the lower-cased description and, on first hit, record the index of that first occurrence; after scanning the whole lexicon, sort the recorded matches by their first-occurrence index ascending, deduplicate preserving first appearance, cap at `max`, and return the original-cased lexicon terms in that order. If no term matches, return [];
      - `djb2(str)` and `projectVisualVariant(projectName, fixed = false)` per D-03/OQ-3: `djb2` is a stable 32-bit string hash; `projectVisualVariant` returns `'terminal-mock'` for the DeepIndex name, `'contract-analysis'` for the Clarif-AI name, and for any other name returns `['glyph','report','dashboard','network'][djb2(name) % 4]`. Export both so the desktop and mobile stacks share the exact same selection and the unit tests can assert stability; **the module docstring MUST document the `fixed` parameter's semantics (checker W-4): `fixed = true` bypasses the hash and returns the named flagship variant for known names regardless of position — used by tests to pin the flagship contracts deterministically; `fixed = false` (default) is the production path;**
      - `CardState` interface and `cardState(cardIndex, carouselProgress, count, reducedMotion)` implementing UI-SPEC §3 exactly:
        - `activeCenter = (count - 1) * clamp(progress,0,1)`, `s = activeCenter - cardIndex`, `activeIndex = round(activeCenter)`;
        - depth level `l = abs(s)`; use the pinned level table (l=0..5) with smoothstep interpolation between adjacent levels: `Y_upcoming = -l*38`, `Y_leave = -l*38 - 56` for `l ≥ 1`;
        - scale = `1 - 0.04*l` clamped to [0.8,1], opacity from keyframes `(1, 0.95, 0.85, 0.70, 0.50, 0.30)` interpolated by `l`, clamped to [0,1] (drop below 0.05 → visible false);
        - zIndex = `100 - ceil(abs(s))*10 - (s > 0 ? 5 : 0)`;
        - activeAmount = `1 - clamp(abs(s), 0, 1)`;
        - `IMPERFECTION_X = [-4, -2, 2, 4, 3, -3]`, `IMPERFECTION_ROTATION = [-1, -0.5, 0.5, 1, 0.75, -0.75]`, applied via `index % 6`, forced to 0 under reduced motion;
        - reducedMotion branch: translateY/translateX/scale/rotation 0, opacity = `clamp(1 - abs(s)*0.6, 0, 1)`, zIndex and activeAmount unchanged;
        - Totality: non-finite inputs produce finite, safe defaults (y=0, opacity=0, visible false).
    </action>
    <verify>Run `node --test tests/projects-stack.test.mjs`. Expect all assertions green.</verify>
    <acceptance_criteria>
      - `node --test tests/projects-stack.test.mjs` exits 0.
      - `npm run typecheck` exits 0 (the module is typed and importable).
    </acceptance_criteria>
    <done>The pure module exists, is fully green under its unit-test contract, and typechecks.</done>
  </task>
</tasks>
