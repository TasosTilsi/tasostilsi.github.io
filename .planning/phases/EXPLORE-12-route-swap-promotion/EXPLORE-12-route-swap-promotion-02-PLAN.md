---
phase: 12-route-swap-promotion
plan: 02
type: execute
wave: 2
# scope-sanity: 12 files_modified exceeds the <=10 plan heuristic. RECORDED DEVIATION, accepted —
# the 7 test suites are one indivisible semantic change (every route literal in tests/ moves at once),
# and the 5 comment-only prose files are severable but a 4th prose-only plan would delay the
# merge-hold lift for no correctness gain. Justification: see "File count note for the checker".
depends_on: ["EXPLORE-12-route-swap-promotion-01"]
files_modified:
  - "tests/credentials-panel.test.mjs"
  - "tests/explore-shell.test.mjs"
  - "tests/explore-tour.test.mjs"
  - "tests/explore-visuals.test.mjs"
  - "tests/explore-sweep.test.mjs"
  - "tests/explore-routing.test.mjs"
  - "tests/explore-header.test.mjs"
  - "src/components/explore/explore-shell.tsx"
  - "src/components/explore/use-explore-theme.ts"
  - "src/components/explore/explore-tour.tsx"
  - "src/components/explore/sections/skills-section.tsx"
  - "src/app/layout.tsx"
autonomous: true
requirements: ["REV-22"]
user_setup: []
must_haves:
  truths:
    - "The stale-suite RED is observed and recorded before it is repaired: `npm run build && node --test tests/explore-shell.test.mjs` fails with 'out/explore.html missing' immediately after plan 01, and the repath converts it to GREEN."
    - "The full house gate passes on the renewed tree: `npm run typecheck && npm run build && node --test tests/*.test.mjs` exits 0 with all 14 suites green (13 pre-existing + tests/route-swap.test.mjs)."
    - "No PRE-EXISTING suite reads the deleted artifact any more, and no pre-existing suite reads a deleted source route: `grep -rn 'out/explore.html' tests/ --exclude=route-swap.test.mjs` and `grep -rn 'src/app/explore\\|src/app/(main)' tests/ --exclude=route-swap.test.mjs` both return nothing. `tests/route-swap.test.mjs` is excluded deliberately: it asserts those absences ON PURPOSE (`!has('out/explore.html')`, `!has('out/explore.txt')`, `!has('src/app/explore')`, `!has('src/app/(main)')`) and is the phase's strongest falsifier for REV-22's 'NO /explore route exists' / 'no `out/explore.*`' clauses — those literals must stay in that suite."
    - "The renewed composite test pins BOTH directions of the loop (CLI → landing → CLI) plus the 404 leg and the new-tab chip leg, all in one assertion set, so a half-rewire cannot pass."
    - "The CLI-side export row now reads the CLI's real artifact: out/cli.html is asserted to contain no SSR'd CLI content, and out/resume.html is still asserted to exist."
    - "Two stale-source-path traps are closed: the landing page path has an explicit existence assertion (not just a silent `.filter(existsSync)`), and out/cli/index.html is asserted absent."
    - "Every remaining /explore reference in src/ is either a relative import specifier, a module/test filename, a directory path, the drawer's deliberate '~/explore' chrome title, or the one recorded debt line: `grep -rnE '[[:space:]]/explore[[:space:]]' src/ --exclude=globals.css` and `grep -rn 'out/explore' src/` both return nothing, and the ONLY residual outside those four legitimate classes is `src/app/globals.css:496` — held as accepted prose debt with a pointer, because UI-SPEC §9 ('globals.css is not edited') and RESEARCH §9.1/§9.2 both forbid editing that file in this phase."
    - "The prose sweep is comment-only and globals.css-free: no executable line changes in any of the five `.ts`/`.tsx` files it touches, and `src/app/globals.css` is byte-untouched by the entire phase — zero new CSS rules, zero new hook classes, zero new transitions, zero new keyframes (UI-SPEC §9 + RESEARCH §9.1/§9.2)."
  artifacts:
    - path: "tests/explore-sweep.test.mjs"
      provides: "Renewed route-existence list {index.html, cli.html, resume.html} + the explicit explore negatives, the renewed E-2/E-3 export rows, and the six-leg two-way routing composite."
      min_lines: 380
    - path: "tests/explore-shell.test.mjs"
      provides: "Renewed reader path (out/index.html), renewed landing route paths ((home)/layout.tsx, (home)/page.tsx), the ':~' breadcrumb constant + export row, the CLI/resume existence row, and the hardened landing-page existence assertion."
      min_lines: 500
    - path: "tests/explore-routing.test.mjs"
      provides: "Renewed welcome-link rows (href='/') and the finish-card guard (linkHref '/cli') at source level."
      min_lines: 220
  key_links:
    - from: "tests/explore-sweep.test.mjs"
      to: "src/components/explore/constants.ts"
      via: "the composite imports EXPLORE_TOUR_FINISH directly and asserts linkHref === '/cli' as leg 4 (no JSX parsing)"
      pattern: "EXPLORE_TOUR_FINISH"
    - from: "tests/explore-shell.test.mjs"
      to: "out/index.html"
      via: "the export reader constant repointed from the deleted out/explore.html, so every export row in the suite reads the landing artifact"
      pattern: "out/index\\.html"
    - from: "tests/explore-sweep.test.mjs"
      to: "src/app/cli/layout.tsx"
      via: "the CLI overflow-invariant row reads the CLI route's new layout path and asserts overflow-hidden + overflow-auto survive the move"
      pattern: "src/app/cli/layout\\.tsx"
---

<objective>
Renew the phase's stale test surface so the full suite runs green against the swapped routes, close the two stale-path traps the research identified, and finish the route-prose sweep so nothing in `src/` still calls `/explore` a route.

Why this plan exists separately from plan 01: plan 01 changed the route table and all six link sites and ended with its OWN acceptance suite green, but the pre-existing suites still point their readers at the deleted `out/explore.html` and still pin the old route literals. Route-name literals live in the tests (RESEARCH P-12), so the renewal is a first-class deliverable, not cleanup — and this is exactly the sweep CONTEXT D-04 mandates: "the sweep rows {/, /explore} → {/, /cli}, the two-way-loop composite, export-title assertions; the stale suite renewals ride the same commits." The declared merge hold from plan 01 is lifted only when this plan's full-suite run is on record.

Work is test-first by observation here: `tests/explore-shell.test.mjs` is RED with a known cause immediately after plan 01 (`out/explore.html missing — run npm run build first`). Task 1 captures that red verbatim, then repairs it. Task 2 renews the remaining route-TARGET rows (the composite and the finish-card guards), which are red because they assert the old destinations — a semantic failure, distinct from task 1's ENOENT failure. Task 3 closes the run.

**Two traps this plan closes deliberately** (both found by research against the real tree):
- `.filter(existsSync)` on a moved path turns a real guard into a silent no-op. `tests/explore-shell.test.mjs:96-99` builds its source list as `['src/app/explore/page.tsx', …].filter((p) => existsSync(join(root, p)))` — after the move that array silently drops the page and the `!code.includes('h-screen')` guard degrades to checking only `explore-shell.tsx`. Repath AND add an explicit existence assertion before the guard (P-1/R-4).
- `trailingSlash` is not set in `next.config.ts`, so `/cli` emits `out/cli.html`. If anyone ever flips it, `href="/cli"` silently 404s on GitHub Pages. The route-existence row therefore asserts `existsSync(out/cli.html)` AND `!existsSync(out/cli/index.html)` (R-8).

**Prose sweep is comment-only and scoped.** RESEARCH §9.1 makes doc-comment hygiene a binding repo convention (a later grep-based ban should be simple), and the phase-05 sweep's guard row shows comments are kept accurate as house style. The predicate that finds the real defects is `grep -rnE '[[:space:]]/explore[[:space:]]' src/ --exclude=globals.css` (whitespace-delimited `/explore`, i.e. the route being named in prose) plus `grep -rn 'out/explore' src/` — verified against the current tree these return 9 lines and 2 lines respectively; after plan 01's moved-file comment renewals the remaining files are the five listed in Task 3. **`src/app/globals.css` is excluded from that predicate because this plan does not edit it at all** (UI-SPEC §9: "globals.css is not edited"; RESEARCH §9.1/§9.2 — the two subsections that exist under §9 — repeat it and list globals.css among the untouched targets), so the one stale route-prose comment at `globals.css:496` is recorded as accepted debt with a pointer — exactly how the drawer's `~/explore` is treated. The task must not touch a single executable token in the five files it does own.

**File count note for the checker (RECORDED DEVIATION — flagged in the frontmatter).** 12 paths are listed: 7 test suites (mechanical route-literal repaths — 5 export readers repointed to `out/index.html`, 2 source-literal suites repointed to `/` and `/cli`) and 5 comment-only `.ts`/`.tsx` prose renewals. This exceeds the ≤8–10 heuristic by design and cannot be split without leaving a green-looking gate over a suite that still reads the deleted `out/explore.html`: the renewal is one indivisible semantic change (every route literal in `tests/` moves to the new route table), and Task 3's five comment files are already independent of it — they are kept in this plan because Task 3's final full-suite run is what lifts plan 01's merge hold, and splitting would need a fourth plan whose only content is prose. The five prose files ARE severable (each is a one-line comment renewal with no dependency on the others); the split was considered and rejected as a 4th plan that carries only prose, and the overrun is recorded as a YAML comment in this plan's frontmatter rather than left unflagged. `src/app/globals.css` — the sixth, rule-adjacent file the research's predicate did flag — is deliberately NOT in this list.

**Out of scope (do not expand):** the drawer's `~/explore` SheetTitle is deliberate accepted debt (UI-SPEC §9 forbids touching the drawer; RESEARCH §3.7/OQ-7) — it is also the single `/explore` occurrence plan 01's suite counts as permitted, so the `assert.equal(hits, 1)` row goes red if anyone edits it; the stale route-prose comment at `src/app/globals.css:496` is likewise accepted debt with a pointer (UI-SPEC §9 + RESEARCH §9.1/§9.2 forbid editing globals.css at all in this phase — do NOT edit it, not even to renew the comment); `PRODUCT.md` is untracked and not a deliverable; sitemap/robots/SEO additions stay deferred; no behavioural change to either surface.
</objective>

<context>
Read these before editing. Line numbers are from HEAD e2e9ec2 (plan 01 has moved the route files by the time this plan runs).

**The five export-reading suites and their reader declarations** — these are the files that go ENOENT-red after plan 01:
- `tests/explore-shell.test.mjs:21` — `const exportHtml = join(root, 'out/explore.html');` then used at :453, :481, :490, :498. Route-path literals at :65 (`src/app/explore/layout.tsx`), :98 (`src/app/explore/page.tsx` inside a `.filter(existsSync)` array), :107, :220, :300, :427. Breadcrumb constant row at :44-45 (`":~/explore"`). Export breadcrumb literal at :458. The "CLI + resume untouched" row at :467-469 asserts `out/index.html` still exists (which after the swap is the landing) — that row's intent is the OTHER surface, so it repoints to `out/cli.html`. **All SEVEN `out/explore.html` occurrences in this file must go** — :21 (the reader path), :452 and :489 (two test titles), :453, :481, :490, :498 (four `… missing — run \`npm run build\` first` assertion messages). The titles and messages do NOT follow automatically from the `:21` repath: they are independent string literals, so an executor that only changes `:21` leaves the file failing the acceptance grep.
- `tests/explore-sweep.test.mjs` — `exportText` at :316 and `exportRaw` at :323 both read `out/explore.html`; inline existence assertions at :246, :326, :352, :361, :374. The `(main)` layout path at :151 (and the disposition-rule comment at :19). Route rows: E-1 route list at :240 (`['out/index.html', 'out/explore.html', 'out/resume.html']`), E-2 at :245-252, E-3 at :255-259, E-5 composite at :276-296. Ten occurrences total (:240 list entry, :245 and :325 titles, :246/:316/:323 read paths, :326/:352/:361/:374 messages).
- `tests/explore-tour.test.mjs` — readers at :516 and :632; messages at :517 and :633; title at :515 (`'export: Tour button SSRs into out/explore.html, tour overlay does not (§12.6)'`); finish-card digit guard ends with `assert.equal(EXPLORE_TOUR_FINISH.linkHref, '/')` at :153. Five occurrences.
- `tests/explore-visuals.test.mjs:687` — `const exportHtmlPath = join(root, 'out/explore.html');`; messages at :692, :699, :721, :748, :776, :799; the "CLI and resume still emitted" row at :793-796 asserts `out/index.html` exists — repoints to `out/cli.html`. The header comment at :7 mentions the old path. Eight occurrences.
- `tests/credentials-panel.test.mjs:39` — `const exportHtmlPath = join(root, 'out/explore.html');`; the assertion message at :42; comments at :11 and :22. Four occurrences.

**The two route-literal suites** (source-level, no `out/` reads):
- `tests/explore-routing.test.mjs` — :74 test title, :83-87 the `href="/explore"` count row, :96 and :115 `indexOf('href="/explore"')`, :136 `{ navigate: "/explore" }`, :197 test title, :210-214 `EXPLORE_TOUR_FINISH.linkHref === '/'`.
- `tests/explore-header.test.mjs` — :18 header comment; :50 the test title (`Next Link to / — same tab` → `Next Link to /cli — same tab`) **and :61 the live regex `/<Link\b[^>]*?href="\/"/` → `href="\/cli"`** (checker BLOCKER 1 — the live assertion pins the old target and no enumerated item renewed it; detection criteria: `grep -c 'href="/cli"' tests/explore-header.test.mjs` ≥ 1 AND `grep -c 'href="/"' tests/explore-header.test.mjs` = 0); :192-199 the finish-card regression guard asserting `linkHref === '/'`.
- **`tests/explore-sweep.test.mjs:174` — (checker BLOCKER 2) the sweep row's `block.includes('<Link href="/explore"')` asserts the OLD welcome-link target as a route literal; renew to `'<Link href="/"'`. File-independent detection criteria after ALL renewals: `grep -rn 'href="/explore"' tests/ --exclude=route-swap.test.mjs` returns nothing AND `grep -rn '{ navigate: "/explore" }' tests/ --exclude=route-swap.test.mjs` returns nothing.**

**Non-obvious constraints on the renewals:**
- `tests/explore-routing.test.mjs:128-135` counts `<Link` occurrences (exactly 1) and `case "` occurrences (exactly 40) — those ADDITIVE-only proofs are unaffected by an href change; do not touch the numbers.
- `tests/explore-tour.test.mjs:139-152` sweeps every `EXPLORE_TOUR_FINISH` string with a digit guard after stripping `60` — `/cli` is digit-free, so only the expected value changes (:153), never the guard.
- `tests/explore-tour.test.mjs:606-616` asserts the status bar's `aria-live="polite"`, the `${visitedCount}/${EXPLORE_SECTIONS.length} sections visited` template and `text-accent` — all preserved by plan 01's chip work; do not weaken them.
- `tests/explore-visuals.test.mjs:598-640` bans `.animate(`/`gsap`/`lottie` across every `src/components/explore/**` file and allows `framer-motion` only in `src/components/explore/sections/projects-stack-stage.tsx`, with the tour rAF counts frozen at 5/3. These must stay green with ZERO edits — that they do is the proof the phase added no motion. Do not touch them.
- `tests/credentials-panel.test.mjs:44-49` strips `<script>` blocks before export assertions because the RSC payload inlines client-island props; preserve `readExportMarkup` exactly as-is while repathing the path.
- `tests/explore-sweep.test.mjs:200-208` pins the four status-bar chrome tokens and `:40-64`/`:100-146` pin the panel grid and shell overflow classes — all unchanged by this phase.
- `tests/explore-visuals.test.mjs` contains ~70 occurrences of the substring `/explore`, of which only the export-path ones belong to this phase: the `src/components/explore/...` occurrences are DIRECTORY paths and must NOT be rewritten. Same care in `tests/explore-tour.test.mjs` (:22 occurrences, mostly component paths and a `../src/components/explore/constants.ts` import).
- House gate: no `npm test` script exists. Gate = `npm run typecheck && npm run build && node --test tests/*.test.mjs`, and `npm run build` is the only CI gate. Every `out/`-reading row needs a prior build.
- The verified prose predicate (`grep -rnE '[[:space:]]/explore[[:space:]]' src/`) currently yields: `explore-shell.tsx:4`, `use-explore-theme.ts:4`, `constants.ts:2`, `skills-section.tsx:14`, `explore-tour.tsx:4`, `src/app/explore/layout.tsx:7`, `src/app/explore/page.tsx:2`, `globals.css:496`, `src/app/layout.tsx:19`. The two `src/app/explore/*` lines and the `constants.ts:2` line are renewed by plan 01; the five remaining `.ts`/`.tsx` files are task 3's scope; `globals.css:496` is NOT edited (accepted debt, UI-SPEC §9 + RESEARCH §9.1/§9.2) and is therefore excluded from the predicate in every acceptance criterion, with the exclusion itself asserted by a one-line debt check.
- Stale-literal inventory to drive the Task 1 grep to zero (verified against the tree with `grep -c`, and every acceptance criterion below is a `grep -c` line count so the unit is consistent): exactly 35 matching LINES / 39 occurrences of `out/explore.html` across 6 files — credentials-panel 4 lines, explore-header 1, explore-shell 7, explore-sweep 10, explore-tour 5, explore-visuals 8. Four of those lines carry the path twice (the inline read/existence path plus its assertion message, all in `tests/explore-sweep.test.mjs` at :326, :352, :361 and :374), which is why a `grep -o` count reads 39 — that discrepancy is arithmetic, not a missed occurrence. Task 1 owns 24 of the 35 lines (credentials-panel, explore-shell, explore-tour, explore-visuals); Task 2 owns the other 11 (explore-sweep 10, explore-header 1). The `grep -c 'out/explore.html' … returns 0 for every file` criterion is only reachable when the TITLES and MESSAGES are renewed too, not just the reader constants.
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — capture the stale-export RED, then repath every export reader, message and moved source path</name>
    <files>tests/credentials-panel.test.mjs, tests/explore-shell.test.mjs, tests/explore-tour.test.mjs, tests/explore-visuals.test.mjs</files>
    <read_first>tests/explore-shell.test.mjs:15-25, :60-110, :120-130, :440-505, tests/explore-visuals.test.mjs:1-12 and :680-700 and :785-805, tests/explore-tour.test.mjs:505-525 and :625-645, tests/credentials-panel.test.mjs:1-55, src/app/(home)/layout.tsx, src/app/(home)/page.tsx (as produced by plan 01)</read_first>
    <action>
    First OBSERVE the red, then repair it. Run `rm -rf out && npm run build && node --test tests/explore-shell.test.mjs 2>&1 | tail -40` and capture the raw output — it must fail with the export-reader cause (`out/explore.html missing — run npm run build first`), which is the plan-01 merge-hold failure made visible. Record the verbatim output in SUMMARY.md. **Commit message pinned (checker W-1): this task commits as `test(phase-12): renew the route-literal suites` — the only deliberately-red commit of this plan.**

    Then repath the readers, the assertion MESSAGES, the test TITLES and the moved source paths in these four suites only. Every `out/explore.html` occurrence in these four files must go — the acceptance grep is per-file zero, and titles/messages are independent literals that a reader-only repath leaves behind:

    1. `tests/explore-shell.test.mjs` (7 occurrences — ALL of them):
       - `:21` → `const exportHtml = join(root, 'out/index.html');` (the landing is now the root export). Every row using `exportHtml` (:453, :481, :490, :498) follows automatically.
       - `:452` test title → the landing artifact: `'static export: landing IDE frame emitted into out/index.html'`.
       - `:489` test title → `'static export: theme script + toggle emitted into out/index.html'`.
       - The four `… missing — run \`npm run build\` first` assertion messages at `:453`, `:481`, `:490`, `:498` → `'out/index.html missing — run \`npm run build\` first'` (these are string literals; they do NOT follow from the `:21` change).
       - `:65` → `read('src/app/(home)/layout.tsx')`.
       - `:98` → `['src/app/(home)/page.tsx', 'src/components/explore/explore-shell.tsx']` in the `.filter(existsSync)` array, AND insert an explicit `assert.ok(existsSync(join(root, 'src/app/(home)/page.tsx')), 'landing page present — the h-screen guard must not silently degrade')` immediately before the list is built. This closes P-1/R-4: without it, a future move makes the `!code.includes('h-screen')` guard silently vacuous.
       - `:107`, `:220`, `:300`, `:427` → `read('src/app/(home)/page.tsx')`.
       - `:45` → `assert.ok(src.includes('":~"'), 'status path (D-03)')` (the pre-swap literal was `":~/explore"`).
       - `:458` → `assert.ok(html.includes(':~'), 'breadcrumb path')`.
       - `:467-469` → the OTHER surface is now `out/cli.html`: `assert.ok(existsSync(join(root, 'out/cli.html')), 'out/cli.html emitted (D-04 — route-existence renewal)')`; keep the `out/resume.html` assertion as-is. Cite D-04 (this phase's test/sweep-renewal decision, CONTEXT.md) and never a D-ID from an earlier phase: this phase's CONTEXT holds only D-01…D-04, so a foreign token reads as a dangling reference during verification.
    2. `tests/explore-tour.test.mjs` (5 occurrences — ALL of them): `:516` and `:632` → `join(root, 'out/index.html')`; the two `out/explore.html missing` assertion messages at `:517` and `:633` → `out/index.html missing — run \`npm run build\` first`; the test title at `:515` → `'export: Tour button SSRs into out/index.html, tour overlay does not (§12.6)'`.
    3. `tests/explore-visuals.test.mjs` (8 occurrences — ALL of them): `:687` → `join(root, 'out/index.html')`; the six assertion messages at `:692`, `:699`, `:721`, `:748`, `:776`, `:799` → `out/index.html missing — run \`npm run build\` first`; the header comment at :7 → `out/index.html`; `:793-796` → assert `out/cli.html` exists (the OTHER surface) and keep the `out/resume.html` assertion.
    4. `tests/credentials-panel.test.mjs` (4 occurrences — ALL of them): `:39` → `join(root, 'out/index.html')`; the assertion message at `:42` → `'out/index.html missing — run \`npm run build\` first'`; renew the two comments at `:11` and `:22` that name `out/explore.html`. PRESERVE `readExportMarkup`'s `<script>` strip exactly as written — the RSC payload inlines client-island props, so an unstripped row can pass on serialized JSON instead of rendered markup (:26-30, :44-49 in the current file).

    Suggestion-style note: in each of these four files, do not touch any assertion that is not route-related. `tests/explore-visuals.test.mjs` alone holds ~70 occurrences of the substring `/explore`, and all but the export-path ones are DIRECTORY paths (`src/components/explore/...`) that must stay exactly as they are.

    Then re-run: `rm -rf out && npm run build && node --test tests/credentials-panel.test.mjs tests/explore-shell.test.mjs tests/explore-tour.test.mjs tests/explore-visuals.test.mjs`. These four must now be GREEN; `tests/explore-sweep.test.mjs`, `explore-routing` and `explore-header` are still red on route TARGETS and are task 2's scope. Confirm no suite in this set is failing for a route-target reason before closing the task.
    </action>
    <verify>`rm -rf out && npm run build && node --test tests/credentials-panel.test.mjs tests/explore-shell.test.mjs tests/explore-tour.test.mjs tests/explore-visuals.test.mjs; echo "exit=$?"` — expected exit 0.</verify>
    <acceptance_criteria>
      - The RED is on record FIRST: SUMMARY.md contains the verbatim `out/explore.html missing — run npm run build first` failure captured before the repath.
      - After the repath: `node --test tests/credentials-panel.test.mjs tests/explore-shell.test.mjs tests/explore-tour.test.mjs tests/explore-visuals.test.mjs` exits 0 (all four suites green).
      - `grep -c 'out/explore.html' tests/credentials-panel.test.mjs tests/explore-shell.test.mjs tests/explore-tour.test.mjs tests/explore-visuals.test.mjs` returns 0 for every file — this is the per-file total of 24 occurrences (4 + 7 + 5 + 8), including the titles and the assertion messages, not just the reader constants.
      - `grep -rn 'src/app/explore' tests/ --exclude=route-swap.test.mjs` returns nothing and `grep -rn 'src/app/(main)' tests/ --exclude=route-swap.test.mjs` returns nothing — scoped to the PRE-EXISTING surface, because `tests/route-swap.test.mjs` (plan 01) deliberately asserts both absences and must keep those literals.
      - `grep -c 'existsSync' tests/explore-shell.test.mjs` increased by at least 1 relative to the pre-task file, and the new assertion message contains `landing page present` — the P-1 hardening landed.
      - `grep -c "out/cli.html" tests/explore-shell.test.mjs` returns at least 1 and `grep -c "out/cli.html" tests/explore-visuals.test.mjs` returns at least 1 — both "other surface" rows now read the CLI artifact.
      - `grep -c 'readExportMarkup' tests/credentials-panel.test.mjs` returns at least 2 (the definition plus the callers) and `grep -c 'replace(/<script' tests/credentials-panel.test.mjs` returns at least 1 — the script-strip survived the repath.
      - No `out/explore.html` string survives in any of the four files' test TITLES either: `grep -c "test('.*out/explore" tests/credentials-panel.test.mjs tests/explore-shell.test.mjs tests/explore-tour.test.mjs tests/explore-visuals.test.mjs` returns 0 for every file.
      - No assertion unrelated to routes changed: `git diff --stat` for each of the four files shows no change to a line that does not mention `out/`, `src/app/`, `:~`, or a test title/comment about those.
      - `git show --stat HEAD` for this task's commit lists exactly these four test files. **Commit message pinned (checker W-1): `test(phase-12): renew the export-reader suites to index/cli readers`.**
    </acceptance_criteria>
    <done>The four export-reading suites are repathed to out/index.html (and to out/cli.html for the OTHER-surface rows), every title and assertion message naming the old artifact is renewed so the per-file grep reaches zero, the moved landing paths are read from src/app/(home)/, the silent-`.filter(existsSync)` trap is closed with an explicit existence assertion, and the stale-export red is captured on record and converted to green.</done>
  </task>

  <task type="auto">
    <name>Task 2: Renew the route-target rows and expand the composite to all six legs</name>
    <files>tests/explore-sweep.test.mjs, tests/explore-routing.test.mjs, tests/explore-header.test.mjs</files>
    <action>
    **Prose sweep additions (checker W-5): comment-only renames at FOUR test-prose sites — `tests/explore-routing.test.mjs:19` (the `{ navigate: "/explore" }` entry in the pinned-contract header) and `:26` (the `/explore → CLI finish-card return leg` phrasing), `tests/explore-visuals.test.mjs:691` (the `export: /explore is recharts-free` test title → the landing artifact), `tests/explore-shell.test.mjs:131` (`scoped to /explore (D-04, EXPLORE-01c)` → the landing shell) — so the phase's later grep bans stay simple, with ZERO assertion-predicate changes (comment/title-only edits, in these 4 files).**
    <read_first>tests/explore-sweep.test.mjs:1-40, :140-160, :195-215, :236-330, :350-380, tests/explore-routing.test.mjs:70-140, :190-215, tests/explore-header.test.mjs:10-35, :185-205, tests/route-swap.test.mjs (plan 01's suite — its composite is the reference for the six legs; keep the two composites consistent), src/components/explore/constants.ts</read_first>
    <action>
    Renew every route-TARGET assertion and expand the two-way composite. Note the ordering that makes this red→green observable: run `rm -rf out && npm run build && node --test tests/explore-sweep.test.mjs tests/explore-routing.test.mjs tests/explore-header.test.mjs` BEFORE editing and capture the failures (they assert `/explore` and `/` as destinations — a semantic red, distinct from task 1's ENOENT red); then repair and re-run to green. Record both runs in SUMMARY.md.

    1. `tests/explore-sweep.test.mjs` (10 occurrences — ALL of them):
       - `:151` → `read('src/app/cli/layout.tsx')`; renew the disposition-rule comment at :19 that lists `(main)/layout.tsx` among the phase surfaces, and the test title's `(main) layout` wording.
       - E-1 (`:238-243`) → route list `['out/index.html', 'out/cli.html', 'out/resume.html']` (the `:240` literal), plus explicit negative rows in the same test: `!existsSync(join(root, 'out/explore.html'))`, `!existsSync(join(root, 'out/explore.txt'))` and `!existsSync(join(root, 'out/cli/index.html'))`. The last one is the trailingSlash tripwire (R-8) — keep it.
       - E-2 (`:245-252`) → read `out/index.html` (the `:245` title and the `:246` read path); assert `aria-label="Open the terminal"` is present AND `href="/cli"` is present (the header Terminal link's new target; the pre-swap row asserted `href="/"`). Renew the test title to name the landing artifact and the `/` → `/cli` leg at L3.
       - E-3 (`:255-259`) → read `out/cli.html`; assert it does NOT include `System initialized` (the CLI stays client-only at its new path). Renew the message to name `out/cli.html`.
       - E-5 (`:276-296`) → expand to the SIX-leg composite in one assertion set, with a comment naming each leg: leg 1 CLI welcome → `/` (`WelcomeMessage.tsx` contains `href="/"` and no `target=`); leg 2 the `explore` command → `/` (`TerminalInterface.tsx` contains `{ navigate: "/" }` plus `router.push(result.navigate)` and no `window.location`); leg 3 header Terminal link → `/cli` (`explore-header.tsx` contains `href="/cli"`); leg 4 `EXPLORE_TOUR_FINISH.linkHref === '/cli'` imported directly; leg 5 the status-bar chip (`explore-status-bar.tsx` contains `target="_blank"` and a `rel` containing both `noopener` and `noreferrer`, `EXPLORE_STATUS_CLI_LINK.href === '/cli'`, and `out/index.html` carries `target="_blank"` + `rel="noopener noreferrer"`); leg 6 the 404 page's `not-found.tsx` contains `href="/cli"`. Add an explicit comment that the two directions (CLI → landing → CLI) are asserted in this ONE test so no half-rewire can pass. Renew the test title from "four legs" to six.
       - The `exportText`/`exportRaw` helpers at `:316`/`:323` → `read('out/index.html')`.
       - The test title at `:325` → name `out/index.html`.
       - The four assertion messages at `:326`, `:352`, `:361`, `:374` → `'out/index.html missing — run \`npm run build\` first'` AND the four inline read/existence paths on those same lines → `join(root, 'out/index.html')`. Both halves of each line change; the message is a literal that the path edit does not touch.
    2. `tests/explore-routing.test.mjs`: `:74` test title → the new target; `:83-87` → `(src.match(/href="\/"/g) || []).length === 1` with the message naming `/` as the target (there is exactly one `<Link>` in the file, so the count stays 1); `:96` and `:115` → `src.indexOf('href="/"')`; `:136` → `src.includes('{ navigate: "/" }')`; `:197` test title → the landing → CLI return leg; `:210-214` → `assert.equal(EXPLORE_TOUR_FINISH.linkHref, '/cli', …)`. Do NOT change the additive-only counts (`<Link` === 1 at :78-82, `case "` === 40 at :128-135) or the dependency-count guard (39).
    3. `tests/explore-header.test.mjs`: `:18` header comment → the new artifact name is irrelevant (this suite has no export rows) but its mention of `out/explore.html` must go (it is the file's only occurrence); `:192-199` → `assert.equal(EXPLORE_TOUR_FINISH.linkHref, '/cli', …)` with the comment renewed to name `/cli`; keep the `linkLabel === 'Open the terminal →'` assertion exactly as-is.

    Then run the full gate: `rm -rf out && npm run typecheck && npm run build && node --test tests/*.test.mjs`. All 14 suites must be green; capture the output.
    </action>
    <verify>`rm -rf out && npm run typecheck && npm run build && node --test tests/*.test.mjs; echo "exit=$?"` — expected exit 0 (14 suites green).</verify>
    <acceptance_criteria>
      - Both runs are on record in SUMMARY.md: the pre-edit semantic RED of the three suites (asserting the old targets) and the post-edit full-suite GREEN.
      - `grep -c 'out/explore.html' tests/explore-sweep.test.mjs` returns 0 and `grep -c 'out/explore.html' tests/explore-header.test.mjs` returns 0 — all 11 occurrences in these two files (10 + 1) are renewed, INCLUDING the two test titles at :245 and :325 and the four assertion messages at :326/:352/:361/:374.
      - `grep -c 'out/cli/index.html' tests/explore-sweep.test.mjs` returns at least 1 (the trailingSlash tripwire).
      - `grep -c "leg 6" tests/explore-sweep.test.mjs` returns at least 1 and `grep -c 'not-found.tsx' tests/explore-sweep.test.mjs` returns at least 1 — the 404 leg is in the composite.
      - The composite is single-test: `grep -n 'two-way routing loop composite' tests/explore-sweep.test.mjs` returns exactly one line, and the six legs sit inside that one `test(...)` body.
      - `grep -c "href=\"/\"" tests/explore-routing.test.mjs` prints at least 2 and the file contains no remaining `href="/explore"`. The 2 matches are the two `indexOf('href="/"')` rows; the count row is deliberately EXEMPT because it is written as `(src.match(/href="\/"/g) || []).length === 1` — the regex is escaped, so it contains no `href="/"` literal and can never contribute to this grep. Verify the count row separately by its own predicate: `grep -c 'match(/href=' tests/explore-routing.test.mjs` prints at least 1 with the asserted length `=== 1`.
      - `grep -c 'linkHref' tests/explore-header.test.mjs` prints at least 1 with the asserted value `'/cli'`; `grep -c "'Open the terminal →'" tests/explore-header.test.mjs` prints at least 1 (the arrow-literal finish-card assertion); and `grep -c "Open the terminal" tests/explore-header.test.mjs` prints at least 3 (the arrow assertion at :192-199 plus the two non-arrow label rows at :53 and :54) — the label guard is intact even though only one of the three rows carries the `→` glyph.
      - `grep -c 'src/app/cli/layout.tsx' tests/explore-sweep.test.mjs` returns 1 — the CLI overflow-invariant row reads the new CLI layout path and asserts `overflow-hidden` + `overflow-auto` survive.
      - `node --test tests/*.test.mjs` exits 0 — all 14 suites green (13 pre-existing + tests/route-swap.test.mjs).
      - `grep -rn 'out/explore.html' tests/ --exclude=route-swap.test.mjs` returns nothing and `grep -rn 'src/app/explore\|src/app/(main)' tests/ --exclude=route-swap.test.mjs` returns nothing — again scoped to the PRE-EXISTING surface: `tests/route-swap.test.mjs` keeps `!has('out/explore.html')`, `!has('out/explore.txt')`, `!has('src/app/explore')` and `!has('src/app/(main)')` as the phase's deliberate absence falsifiers, and deleting them to make an unscoped grep quiet would remove REV-22's strongest negative evidence.
      - `git show --stat HEAD` for this task's commit lists exactly these three test files.
    </acceptance_criteria>
      - `git show --stat HEAD` for this task's commit lists exactly these three test files. **Commit message pinned (checker W-1): `test(phase-12): renew the route-target assertions and lock the two-way composite`.**
  </task>

  <task type="auto">
    <name>Task 3: Comment-only route-prose sweep + the final full-suite run on the frozen tree</name>
    <files>src/components/explore/explore-shell.tsx, src/components/explore/use-explore-theme.ts, src/components/explore/explore-tour.tsx, src/components/explore/sections/skills-section.tsx, src/app/layout.tsx</files>
    <read_first>src/components/explore/explore-shell.tsx:1-12, src/components/explore/use-explore-theme.ts:1-12, src/components/explore/explore-tour.tsx:1-12, src/components/explore/sections/skills-section.tsx:1-20, src/app/layout.tsx:14-24</read_first>
    <action>
    Close the prose sweep: five files still describe the old route in a comment. Each edit is a comment-line text change ONLY — no executable token.

    1. `src/components/explore/explore-shell.tsx:4` — `client boundary of the /explore IDE frame` → the landing IDE frame.
    2. `src/components/explore/use-explore-theme.ts:4` — `hand-rolled dark/light theme state for the /explore shell` → for the landing shell.
    3. `src/components/explore/explore-tour.tsx:4` — `the spotlight wizard tour on /explore (phase EXPLORE-04)` → on the landing page.
    4. `src/components/explore/sections/skills-section.tsx:14` — `the only /explore rendering of the full` → the only landing rendering of the full.
    5. `src/app/layout.tsx:19` — renew the stale route prose (`JetBrains Mono for the /explore IDE shell` → `for the landing IDE shell`) and DROP the bare `D-04:` token that currently prefixes the line. That `D-04` is a PHASE-01 identifier (see `tests/explore-shell.test.mjs:131`, `(D-04, EXPLORE-01c)`), while this phase's CONTEXT holds only D-01…D-04 — leaving the bare token on a line this plan renews would read as THIS phase's sweep-renewal decision and create exactly the dangling-reference hazard Task 1 warns about at :127. Keep `JetBrains Mono` and `--font-jetbrains` verbatim; the replacement comment line is `// JetBrains Mono for the landing IDE shell, exposed as --font-jetbrains.` This is a comment-only touch of the root layout: its metadata, GA id, JSON-LD and viewport must all stay byte-identical (plan 01's suite asserts each of them). No test pins this comment's text (checked: the only `layout.tsx` font assertions are `tests/explore-shell.test.mjs:135-139`, which read the `variable: '--font-jetbrains'` code line).
    6. **NOT edited — `src/app/globals.css:496` is deliberate accepted debt.** That line carries the same stale prose (`/* Dark IDE theme is the default for the /explore shell (UI-SPEC §9.2).`), and it stays exactly as it is. UI-SPEC §9 is categorical — "`globals.css` is not edited — no new hook classes, no new transitions, no new keyframes" — and RESEARCH §9.1/§9.2 (the two subsections that exist under §9) list `globals.css` among the targets this phase does not touch. The plan does NOT re-read that locked ban as rules-only and does NOT ask the executor to arbitrate it: the file is byte-untouched, and the stale comment is recorded in SUMMARY.md as accepted debt with this pointer, exactly as the drawer's `~/explore` title is. `git diff --name-only HEAD -- src/app/globals.css` must be empty.

    Do NOT touch: `src/app/globals.css` (see item 6 — not even its comment), the drawer's `~/explore` SheetTitle (deliberate accepted debt, UI-SPEC §9/RESEARCH §3.7 — and the single `/explore` hit plan 01's `assert.equal(hits, 1)` row counts, so editing it turns that suite red), relative import specifiers like `./explore-*`, test/module filenames, directory paths like `src/components/explore/`, `PRODUCT.md`, or anything else the verified predicates below do not flag.

    Prove the predicate holds on the files this plan owns: `grep -rnE '[[:space:]]/explore[[:space:]]' src/ --exclude=globals.css` and `grep -rn 'out/explore' src/` must both return nothing — and prove the exclusion is honest, not a hiding place, by showing the UNSCOPED predicate returns exactly one line, `src/app/globals.css:496`, with `git diff --name-only HEAD -- src/app/globals.css` empty. Then run the FULL house gate as the last action of this plan: `rm -rf out && npm run typecheck && npm run build && node --test tests/*.test.mjs`. Record the verbatim output in SUMMARY.md, and note explicitly that no source or test file is written after that run (SUMMARY.md itself is a planning artefact; if it is committed, the commit contains only the phase's SUMMARY.md).
    </action>
    <verify>`grep -rnE '[[:space:]]/explore[[:space:]]' src/ --exclude=globals.css; echo "scoped-exit=$?"; grep -rnE '[[:space:]]/explore[[:space:]]' src/; echo "unscoped-shows-only-the-debt-line-exit=$?"; grep -rn 'out/explore' src/; echo "outpath-exit=$?"; git diff --name-only HEAD -- src/app/globals.css; echo "css-diff-empty-exit=$?"; rm -rf out && npm run typecheck && npm run build && node --test tests/*.test.mjs; echo "gate-exit=$?"`</verify>
    <acceptance_criteria>
      - `grep -rnE '[[:space:]]/explore[[:space:]]' src/ --exclude=globals.css` returns nothing (exit 1) and `grep -rn 'out/explore' src/` returns nothing (exit 1) — no prose or comment in any file this plan may edit names the deleted route as a route.
      - The exclusion is proven honest rather than a hiding place: the UNSCOPED `grep -rnE '[[:space:]]/explore[[:space:]]' src/` returns exactly ONE line, `src/app/globals.css:496`, and `git diff --name-only HEAD -- src/app/globals.css` is empty — the locked UI-SPEC §9 / RESEARCH §9.1/§9.2 ban is obeyed literally (file byte-untouched, comment included), and the line is recorded in SUMMARY.md as accepted debt with this pointer, exactly as the drawer's `~/explore` title is.
      - The remaining `/explore` occurrences in `src/` are only relative import specifiers (`./explore-*`), directory paths (`src/components/explore/`, `@/components/explore/`), test/module filenames (`tests/explore-*.test.mjs`) and the drawer's deliberate `~/explore` title: `grep -rn '/explore' src/ --exclude=globals.css | grep -vc 'explore-\|components/explore\|~/explore'` returns 0. If it returns non-zero, each residual line must be individually justified in SUMMARY.md as one of the four legitimate classes above — never silenced by weakening the predicate.
      - Comment-only proof: for each of the FIVE `.ts`/`.tsx` files, every line ADDED by `git diff -U0 -- <file>` contains `//` or `*` and no `=`, `<`, `{` or `class` token that changes code. No CSS file appears in this task's diff at all.
      - The root layout's contracts are intact: `grep -c 'G-TLWL6FDZE7' src/app/layout.tsx` returns 1, `grep -c 'application/ld+json' src/app/layout.tsx` returns 1, `grep -c '"url": "https://tasostilsi.github.io/"' src/app/layout.tsx` returns 1, and — asserted on the IDENTIFIER, since the `portfolio-explore-theme` literal lives only at `src/components/explore/constants.ts:34` and a literal check here would be vacuous — `grep -c 'EXPLORE_THEME_STORAGE_KEY' src/app/layout.tsx` prints 0.
      - `globals.css` carries zero changes of any kind: `git diff --stat HEAD -- src/app/globals.css` is empty, which is strictly stronger than "gains no CSS rule" — so the pre-existing CSS-contract rows in `tests/explore-shell.test.mjs` (`.explore-shell` block marker, token values, the `explore IDE tokens — scoped; CLI token blocks above are untouched (D-10)` comment — that parenthetical is a verbatim codebase string from an earlier phase, not a phase-12 decision) and `tests/explore-sweep.test.mjs` (no `lg:grid-cols-3`, four status-bar tokens) all stay green with zero edits to those assertions.
      - The FULL gate is green on the frozen tree: `npm run typecheck` exit 0, `npm run build` exit 0, `node --test tests/*.test.mjs` exit 0 with 14 suites, and the verbatim output is recorded in SUMMARY.md.
      - The final run covers the final workspace state: no source or test file is modified after it (`git status --porcelain -- src tests` is empty at SUMMARY-write time).
      - `git show --stat HEAD` for this task's commit lists exactly these five files (plus, if committed together, this plan's SUMMARY.md).
    </acceptance_criteria>
    <done>No comment in src/ names /explore as a route in any file this phase may edit, every edit is provably comment-only, `src/app/globals.css` is byte-untouched with its one stale route-prose comment recorded as accepted debt plus a pointer, and the complete house gate is green on the frozen tree with the verbatim run recorded — the plan-01 merge hold is formally lifted.</done>
  </task>
</tasks>

---

**Phase-level verification hooks for the executor's SUMMARY.md.** Record, verbatim: (a) the pre-repath ENOENT RED from `tests/explore-shell.test.mjs`; (b) the pre-edit semantic RED from `tests/explore-sweep.test.mjs`; (c) the final `npm run typecheck && rm -rf out && npm run build && node --test tests/*.test.mjs` output with the suite count; (d) the `git diff --name-only` inventory of the plan's three commits, confirming the code-range touch list is exactly the enumerated files — no panel, drawer, wizard, arc, stack, counter, data or dependency file appears; (e) the statement that the merge hold from plan 01 is lifted.
