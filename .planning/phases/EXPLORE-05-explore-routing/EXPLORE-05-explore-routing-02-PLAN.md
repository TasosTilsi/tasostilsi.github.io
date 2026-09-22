---
phase: 05-explore-routing
plan: 02
type: tdd
wave: 1
depends_on: []
files_modified:
  - src/components/explore/explore-header.tsx
  - tests/explore-header.test.mjs
autonomous: true
requirements: ["EXPLORE-05", "EXPLORE-05b", "EXPLORE-06"]
user_setup: []
must_haves:
  truths:
    - "The /explore header bar shows a Terminal ghost link as the LAST child of the header (rightmost in the right cluster, after Tour, theme, and the drawer Menu button): 44px real-px touch target, lucide Terminal icon, aria-label 'Open the terminal', Next <Link href=\"/\"> navigating to the CLI in the same tab — per D-03, OQ-8."
    - "At 375px the right cluster fits, every rem-based term evaluated at the 14px root (globals.css:464-467): 28px px-4 padding + 40.25px glyph dots (3 × h-2.5 = 8.75px + 2 × gap-2 = 7px internal gaps) + 176px (4 × 44px controls — Tour, theme, drawer, Terminal; px-based literals, exact at any root — the rem-shrink hazard D-04 guards) + 35px child gaps (5 × gap-2 = 7px) = 279.25px ≤ 375px, and the page title (mobile + desktop spans) remains the ONLY truncating element (min-w-0 flex-1 truncate), per D-04, OQ-6 — the SPEC's three-control shorthand is asserted against the real FOUR-control cluster or the test passes while lying."
    - "The wizard finish-card link to / (EXPLORE_TOUR_FINISH.linkHref, src/components/explore/constants.ts:92) is unchanged — the /explore → CLI loop keeps both legs, per D-03's unchanged clause."
    - "44px targets stay px-based (h-[44px] w-[44px] literals), never converted to rem — the ≤640px html font-size 14px rule (globals.css:464-466) must not shrink them (explore-header.tsx:13-15 doc block)."
  artifacts:
    - path: tests/explore-header.test.mjs
      provides: "RED-first contract: source invariants (aria-label, ghost recipe, child order, same-tab) + 375px right-cluster arithmetic + title-only-truncator + px-not-rem guards"
      min_lines: 80
    - path: src/components/explore/explore-header.tsx
      provides: "Header right cluster gains the Terminal ghost link, rightmost, ghost recipe copied verbatim (D-03)"
      min_lines: 105
      exports: ["ExploreHeader"]
  key_links:
    - from: src/components/explore/explore-header.tsx
      to: / (CLI route)
      via: "Next <Link href=\"/\"> on the Terminal ghost button, same tab, no target attribute (D-03)"
      pattern: "href=\"/\""
---

<objective>
Complete the /explore → CLI leg of the two-way loop (EXPLORE-05 + EXPLORE-05b, D-03): a 44px ghost Terminal link rightmost in the header right cluster — and harden the right cluster at 375px with falsifiable arithmetic (EXPLORE-06, D-04/OQ-6). Red/green: the invariant suite is committed first and proven failing, then the link turns it green.
</objective>

<context>
@.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SPEC.md
@.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-CONTEXT.md
@.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-RESEARCH.md  — §1.6 header anatomy + width arithmetic, §1.9 pitfalls; §4 OQ-6/OQ-8 resolutions are binding
@src/components/explore/explore-header.tsx
@src/components/explore/explore-tour.tsx  — GHOST_INTERACTION recipe-duplication precedent (:60-61)
@src/components/explore/constants.ts  — EXPLORE_TOUR_FINISH (:89, linkHref "/" at :92), untouched by this plan
@tests/explore-tour.test.mjs  — house test style + red-first precedent

Discipline: work on branch phase-5; one atomic commit per task — Task 1 commits FIRST with a `test:` message (red run on record), Task 2 commits with a `feat:` message; never push to a remote; never commit harness artefacts. Out of bounds: explore-tour.tsx (finish-card link already points to / — phase-4), any CLI-side file (plan 01 owns those), panels/visualizations/wizard files, src/data/**, package.json. Verify commands scope to tests/explore-header.test.mjs only — do NOT run npm run build or the full suite (parallel-wave plan 01 shares this tree; the export-level check of this link runs in plan 03, which owns the single build point of the wave).
</context>

<tasks>
  <task type="test">
    <name>Task 1: RED — header link contract + 375px cluster arithmetic</name>
    <files>tests/explore-header.test.mjs</files>
    <read_first>src/components/explore/explore-header.tsx, src/components/explore/constants.ts, tests/explore-tour.test.mjs</read_first>
    <action>
      Create tests/explore-header.test.mjs in house style (source-invariant node --test suite importing .ts constants directly) asserting — every new-behaviour assertion must fail on the untouched header, which is the required red record:
      (a) D-03 link presence: source contains `aria-label="Open the terminal"`, a `Terminal` import from "lucide-react", and a `<Link href="/">`; zero occurrences of `target=` (same-tab lock).
      (b) Ghost recipe (D-03): the exact ghost class string `flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background` appears 4 times (Tour :68, theme :79, drawer Menu :94, + the new Terminal link) — equivalently, `h-[44px] w-[44px]` occurs exactly 4 times.
      (c) Placement (D-03, OQ-8): the source index of the Terminal `<Link href="/">` is greater than the index of the ExploreDrawer JSX element — measured against `lastIndexOf('<ExploreDrawer')` (the element at :89; the bare string `ExploreDrawer` also matches the import :19 and a doc comment :10, which would make an indexOf comparison vacuous) — the link is the LAST header child, rightmost in the right cluster.
      (d) 375px cluster math (D-04, OQ-6): compute the fixed width from source-derived values with every rem-based term evaluated at the 375px root font-size of 14px (globals.css:464-467 media rule — at 375px viewport the root is 14px, NOT the 16px desktop root): 28px (px-4 = 1rem = 14px × 2 sides) + 40.25px glyph dots (3 × h-2.5 = 0.625rem = 8.75px, :38, plus 2 × gap-2 = 0.5rem = 7px internal gaps) + 176px (4 × h-[44px] w-[44px] controls — px-based literals, exact at any root; the rem-shrink hazard D-04 actually guards) + 35px child gaps (5 × gap-2 = 7px across the 6 children visible at 375px) = 279.25px, assert 279.25 <= 375; record the arithmetic as a comment citing the source lines (globals.css:464-467 for the root; rem-based terms shrink further below 640px while the 44px px targets cannot).
      (e) Title-only truncator: `truncate` occurs exactly twice in the file — the mobile title span (:53) and desktop title span (:56), both carrying `min-w-0 flex-1` — the title stays the only truncating element.
      (f) px-not-rem guard: the string `h-[44px]` is present and no `h-11`/rem-based 44px form is introduced (globals.css rem-shrink trap).
      (g) Pre-existing controls intact (D-05): `explore-tour-trigger` id (:64) still present; drawer/theme controls unchanged.
      (h) Finish-card regression guard (D-03 unchanged clause): EXPLORE_TOUR_FINISH imported from ../src/components/explore/constants.ts (exported at :89 — it is NOT exported by src/components/cli/constants.ts) has linkHref === "/" (:92).
    </action>
    <verify>node --test tests/explore-header.test.mjs — must FAIL (non-zero exit) on the missing Terminal link; that failing run is the red record. If it unexpectedly passes, stop and re-read the source before implementing.</verify>
    <acceptance_criteria>
      - `node --test tests/explore-header.test.mjs` exits non-zero (red on record) BEFORE any implementation edit
      - the suite file references `Open the terminal`, `h-[44px] w-[44px]`, the 279.25 ≤ 375 arithmetic, and `linkHref`
    </acceptance_criteria>
    <done>The header-link contract and the falsifiable 375px cluster math are pinned in a committed test file and proven failing on the untouched tree.</done>
  </task>

  <task type="feat">
    <name>Task 2: GREEN — Terminal ghost link rightmost in the header (D-03)</name>
    <files>src/components/explore/explore-header.tsx</files>
    <read_first>tests/explore-header.test.mjs, src/components/explore/explore-header.tsx</read_first>
    <action>
      In ExploreHeader, add a Next `<Link href="/">` as the LAST child of the header bar — after the ExploreDrawer element (:89-99), i.e. rightmost in the right cluster per D-03/OQ-8. The link copies the ghost recipe class string VERBATIM from the existing 44px controls (:68/:79/:94): `flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background` — the house pattern is byte-identical duplication, NOT a shared const (cf. explore-tour.tsx:60-61; do not refactor the existing buttons). Inside the link: `<Terminal className="h-5 w-5" aria-hidden="true" />` imported from lucide-react (0.475.0, verified installed), plus `aria-label="Open the terminal"`. NO target attribute — same tab (D-03). Import order and formatting follow the file's existing style. Touch nothing else: Tour button, theme button, drawer, title spans, glyph dots, and the :13-15 rem-shrink doc block stay untouched (D-05) — with ONE sanctioned comment-only exception: the file's own doc comments declare the drawer toggle the rightmost control (the :5-7 doc block — `then the drawer toggle (RIGHTMOST, UI-SPEC §3)` — and the :87 inline comment — `{/* Drawer toggle: rightmost control (UI-SPEC §3) ...`), which becomes factually wrong the instant the Terminal link lands as the last child. Reword those two comment spots in place — same line count, zero code change, zero test-visible-string change — so they state the new order: drawer toggle immediately before the Terminal link, Terminal link rightmost. Documentation hygiene, not a D-05 breach (D-05 is additive-only for behaviour). The wizard finish-card link in explore-tour.tsx is NOT modified.
      Then run the suite — it must now pass (green), covering the red run from Task 1.
    </action>
    <verify>node --test tests/explore-header.test.mjs — must PASS (exit 0), green covering Task 1's red record</verify>
    <acceptance_criteria>
      - `node --test tests/explore-header.test.mjs` exits 0
      - grep `aria-label="Open the terminal"` matches src/components/explore/explore-header.tsx
      - grep -c `h-[44px] w-[44px]` in that file equals 4
      - grep `href="/"` matches in that file; grep `target=` matches zero times
      - grep `RIGHTMOST, UI-SPEC §3` and grep `rightmost control (UI-SPEC §3)` each match zero times in that file after Task 2 (stale rightmost claims reworded, comment-only)
    </acceptance_criteria>
    <done>The /explore → CLI leg exists in production form per D-03, with the 375px fit proven by test rather than by eye.</done>
  </task>
</tasks>