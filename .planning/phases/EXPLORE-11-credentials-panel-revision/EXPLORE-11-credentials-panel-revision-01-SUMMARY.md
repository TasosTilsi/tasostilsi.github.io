---
phase: 11-credentials-panel-revision
plan: 01
type: tdd
wave: 1
subsystem: explore-credentials-panel
tags: [explore, credentials, tabs, radix, ssr, featured-flag, tdd, tracer]
status: complete
dependency-graph:
  requires: []
  provides:
    - "ExploreSectionId widened to 5 — `credentials` appended (all five total Record maps re-mapped)"
    - "typed `featured?: boolean` on Presentation (.d.ts + data, same commit)"
    - "CredentialsSection — 3-tab client leaf island over featured articles/certifications/presentations"
    - "5th panel-grid child: Credentials beside Projects in row 3 at md+, stacked below at <md"
    - "tests/credentials-panel.test.mjs — the phase's acceptance suite (19 rows)"
  affects:
    - "src/components/explore/explore-drawer.tsx — 5th anchor '05 Credentials' derives from the array"
    - "src/components/explore/explore-status-bar.tsx + use-explore-visited.ts — N/5 + IO observes #credentials (no edit needed, both derive)"
    - "six pre-existing suites (renewal deferred to plan 02)"
tech-stack:
  added: []
  patterns:
    - "shadcn Tabs (Radix) consumed as a client leaf island inside the server panel grid"
    - "type-system-enforced re-map: widening ExploreSectionId fails tsc until every total Record is updated"
    - "data-driven featured-only filtering (EXPLORE-07), zero hardcoded copy"
    - "export rows asserted against the SCRIPT-STRIPPED document"
key-files:
  created:
    - "tests/credentials-panel.test.mjs"
    - "src/components/explore/sections/credentials-section.tsx"
  modified:
    - "src/components/explore/constants.ts"
    - "src/components/explore/explore-panels.tsx"
    - "src/components/explore/explore-drawer.tsx"
    - "src/components/explore/panel-shell.tsx"
    - "src/data/portfolio-main-data.json"
    - "src/data/portfolio-main-data.d.ts"
    - "src/app/globals.css"
decisions: [D-01, D-02, D-03, D-04, D-05]
metrics:
  duration: "≈6m 23s (first commit 22:21:51+03:00 → last commit 22:28:08+03:00, 2026-09-29)"
  completed: "2026-09-29"
actuals:
  tasks: 2
  commits: 2
  acceptance_rows: 19
---

# Phase 11 Plan 01: Credentials panel tracer — typed featured flag, 5-section re-map, three-tab panel beside Projects

The forcing slice of REV-21: a RED acceptance suite on record first, then the thinnest end-to-end
implementation that turns it green — a typed `featured` flag on the presentations data, the 5-section
constants re-map that the type system forces through all five total `Record<ExploreSectionId, …>` maps,
and a calm three-tab Credentials panel rendering featured items as compact rows in row 3 beside the
Projects stack, with its default Articles rows server-rendered into the static export.

## Commits

| # | Hash | Subject |
|---|---|---|
| 1 (RED) | `9745193` | `test(11-01): add failing Credentials panel acceptance suite [EXPLORE-11-credentials-panel-revision-01]` |
| 2 (GREEN) | `08333e3` | `feat(11-01): typed featured flag, 5-section re-map, and the three-tab Credentials panel beside Projects [EXPLORE-11-credentials-panel-revision-01]` |

Scope convention: the GSD executor prompt derives the conventional-commit scope as `{phase}-{plan}`
(`11-01`), which is also the exact token the ship-time `tdd_audit` gate regexes for
(`gates.js:124-135`, `new RegExp("\\((11-01)\\)")`). The plan id is carried verbatim in the subject tail so
both the gate and the plan-artefact trail resolve.

## Task 1 — RED on record

`npm run build` was run **before** the red run (so the export-level failures reflect the missing contract,
not a missing `out/`), then:

```
npm run build && node --test tests/credentials-panel.test.mjs
→ exit=1   (15 failed, 4 passed)
```

The 4 passing rows are the ones asserting invariants that already held at HEAD (nothing deleted / the
measured certification shape / no `order-*` utility / no client-only markup in the export). The 15
failures are assertion-class failures for absent behaviour — no syntax error, no crash. Raw excerpt:

```
✖ constants: EXPLORE_SECTIONS appends credentials as the 5th entry (D-04)
  AssertionError [ERR_ASSERTION]: append-only 5th section — DOM order = visual order, projects stays 4th
✖ constants: EXPLORE_TOUR_ACCENTS gains credentials chart-5, map stays total (UI-SPEC §7)
  AssertionError [ERR_ASSERTION]: credentials chip accent (UI-SPEC §7)
✖ constants: welcome copy says five sections, the 6-step tour table is unchanged
  AssertionError [ERR_ASSERTION]: welcome body copy must not lie (UI-SPEC §9 TOUR-01)
✖ data: the single presentation gains featured:true, its .d.ts flag lands same-commit (D-03/R-7)
✖ panel: client leaf island over the installed shadcn Tabs, default Articles
✖ panel: calm row vocabulary — 44px rows and triggers, icons, exp-nudge arrow
✖ panel: featured-only, data-driven copy, no framer-motion (EXPLORE-07 / MOTION-01)
✖ panel: empty states are the three pinned dash-free strings (UI-SPEC §4.2 EMPTY-01)
✖ panel: the anchor guard is URL-only — ID strings and null links stay plain text (§5.3/§5.4)
✖ panels: credentials accent, body closure, and the exact natural-height placement
✖ drawer: credentials digit accent + the derived 05 anchor (source-level, the Sheet is client-only)
✖ css: the stagger cascade gains nth-child(5) at 160ms, reduced-motion guard untouched
✖ export: the credentials panel chrome + tab labels land in the static export (§8)
  AssertionError [ERR_ASSERTION]: the panel section landmark is server-rendered
✖ export: the default Articles tab body renders its featured rows as real text (§8)
  AssertionError [ERR_ASSERTION]: featured article renders as text in the export: "Core Design Patterns for Test Automation"
✖ export: five PanelShell mono index spans, one of them the credential 05 (§2.2)
  AssertionError [ERR_ASSERTION]: exactly five panel index spans render — found 4
```

### Measured certification contract (re-measured, not assumed)

`node -e` over `src/data/portfolio-main-data.json` at plan time and again at execute time:

```
featured certifications = 5
  link starting with http = 0
  link === null           = 4
  link === 'ID: GRTB-24-1S20-CTFL' = 1
```

The suite encodes exactly those four numbers, so the row cannot be satisfied by a weakened shape and no
row asserts a featured-certification http link.

### Pre-existing export facts re-measured before the red run (all four plan claims confirmed)

```
raw out/explore.html            154,737 bytes
script-stripped                 87,558 bytes   (52 <script> blocks removed)
PanelShell mono index spans     4
bare ">05<" substrings          1 (the regex must use the full class signature, never a bare substring)
"DeepIndex" survives the strip  true
```

## Task 2 — GREEN on record

```
npm run typecheck && npm run build && node --test tests/credentials-panel.test.mjs
→ typecheck=0  build=0  suite=0   (19 passed, 0 failed)
```

The build still emits `out/index.html` (20,645 B), `out/resume.html` (18,690 B) and
`out/explore.html` (179,489 B — the growth is the RSC payload now carrying the full article /
certification / presentation slices into the client island's props).

## TDD Gate Compliance

- `type: tdd` plan, and commit 1 is `test(11-01): …` on the RED suite — committed **before** any
  implementation file was touched.
- Commit 2 is `feat(11-01): …`. A `test(` subject precedes any `feat(`/`fix(` subject within the
  `(11-01)` scope, so the ship-time `tdd_audit` gate resolves to pass.
- RED→GREEN transition is on record on both sides (exit 1 with the 15 assertion failures above; exit 0
  with 19 passing below).

## The six expected-red suites — plan-02 handoff

Six pre-existing suites deliberately go RED in this plan. **None of them was edited here.** The full
suite run (`node --test tests/*.test.mjs` → exit 1) confirms exactly this set, and exactly this set only:

| Suite | Failing rows | Raw assertion |
|---|---|---|
| `tests/explore-shell.test.mjs` | 7 | `no chart-5 digit — 4 sections after the merge (REV-04/E-14)`; `no chart-5 accent — 4 sections only (D-05)`; `static counter over 4 sections (D-03; REV-04)` |
| `tests/explore-tour.test.mjs` | 7 | `chip accent map duplicated from explore-panels.tsx — 4 sections after the merge (REV-04/D-05)`; `welcome body says "four sections" (REV-04)`; `SSR renders the literal-0 initial state over 4 sections` |
| `tests/explore-sweep.test.mjs` | 3 | `exactly 4 section ids in EXPLORE_SECTIONS — phase-9 reflow order LOCKED` |
| `tests/explore-visuals.test.mjs` | 5 | `exactly four adapter closures — the registry is total over the 4-section grid (D-04/D-07)`; `exactly four panel index spans render — found 5` |
| `tests/explore-visuals-skills.test.mjs` | 3 | `exactly four adapter closures (D-04/D-07)` |
| `tests/portfolio-data-integrity.test.mjs` | 3 | `ledger: interests / favorite_games / presentations / skills byte-identical` → `AssertionError: Expected values to be strictly deep-equal` (the `PRE_PRESENTATIONS` fixture has no `featured` key) |

Seven other suites stay green: `credentials-panel`, `explore-header`, `explore-routing`,
`explore-timeline`, `explore-visuals-server`, `projects-stack`, `resume-docx-order`.

## Supersession of record

SPEC acceptance "every row an anchor" + CONTEXT D-02 "compact anchor rows" are **superseded FOR THE CERTIFICATIONS TAB** by UI-SPEC §5.3/§5.4 — 4 null links + 1 verification ID ⇒ 5 plain-text rows, 0 anchors; the Articles and Presentations tabs keep real anchors. This is a deliberate narrowing of the SPEC's literal wording, backed by the measured data above, not a coverage gap. The suite encodes it as four counted clauses so a future reader sees the intent, and the implementation enforces it with a single named URL predicate (`isExternalLink`).

## Research-artefact substitute note

This phase ships **no `RESEARCH.md` and no `VALIDATION.md`** while `config.json` sets
`workflow.nyquist_validation: true`. The accepted substitute for phase 11 is (a) a runnable `verify` row
on every task (`npm run build && node --test …` for Task 1, `npm run typecheck && npm run build &&
node --test …` for Task 2) and (b) the re-measured SSR / export-boundary block in the plan's `<context>`,
every load-bearing claim of which was re-measured against this working tree at plan time and independently
re-measured again during this execution (the four export facts quoted above). Each claim is falsifiable by
re-running the stated command; none is inferred.

## MERGE HOLD

**MERGE HOLD — do not merge or hand this branch off as green.** The branch is knowingly red on six
suites (listed above) because they encode the retired 4-section contract and the pre-`featured`
presentation ledger. The hold lifts only when **plan 02** lands the test renewal and its
`npm run build && node --test tests/*.test.mjs` full-suite run is on record. Until then the repo-wide
suite does **not** pass, and the phase is incomplete by design.

## Deviations from the plan

1. **Commit scope** — the plan's Task 1 acceptance spells the message `test(phase-11): …`; the executor
   contract derives `{phase}-{plan}` and the ship-time `tdd_audit` gate regexes `\((11-01)\)`. Commits use
   `test(11-01):` / `feat(11-01):` with the plan id carried in the subject tail. Gate-compatible and
   traceable; see the Commits table.
2. **`src/components/explore/panel-shell.tsx` was touched** — a one-line doc-comment truthfulness fix
   (`the zero-padded mono index 01–04` → `01–05`). No behaviour change, no class change, no test
   depends on it; the file is not in the plan's `files_modified`, so it is disclosed here rather than
   smuggled in.
3. **Test-file refinement inside the GREEN commit** — three rows initially failed for the wrong reason
   (my own new source *doc comments* named `forceMount` and `framer-motion`, and the `SECTION_BODIES`
   closure was wrapped across lines). Fixed on the **source** side, not by weakening the assertions,
   because Task 2's acceptance requires `grep -c 'framer-motion' src/components/explore/sections/credentials-section.tsx`
   to return 0 — comments included. The RED commit `9745193` is the unmodified first-failure record.
4. **`grep -c 'href={\`#${section.id}\`}' src/components/explore/explore-drawer.tsx` returns 2, not 1.**
   Measured at HEAD (`git show HEAD:…` → 2) *before* this change: one JSX occurrence (line 62) and one
   pre-existing doc-comment occurrence (line 17). The plan's "returns 1" was a miscount of the same
   pre-existing file; the code occurrence count is 1 and no drawer edit was needed. The suite asserts the
   derivation with `includes`, so the row is insensitive to the comment.
5. **`TabsList` gets `h-auto flex-wrap`** and each `TabsContent` `mt-0`. The shadcn list pins `h-10`,
   which would clip 44px triggers; at 375px the root font-size drops to 14px (`globals.css`), so the three
   monospace triggers can exceed the panel's ~311px content width — `flex-wrap` implements UI-SPEC §2.5's
   "triggers may wrap if needed" without truncating a label, and `mt-0` keeps the pinned `mb-3` gap
   instead of double-spacing it with the primitive's default `mt-2`.
6. **Motion** — the plan's UI-SPEC §4.1 records the `nth-child(5)` cascade at 160ms (the checker's 140ms
   figure was the cascade misread). Implemented at 160ms, matching the +40ms cadence.

## Verification evidence (all re-measured on the committed tree)

```
npm run typecheck                                                   → exit 0
npm run build                                                       → exit 0, out/{explore,index,resume}.html emitted
node --test tests/credentials-panel.test.mjs                        → exit 0, 19 passed / 0 failed
grep -c 'framer-motion' src/components/explore/sections/credentials-section.tsx   → 0
grep -c 'Allure Reporting' src/components/explore/sections/credentials-section.tsx → 0
grep -c 'GRTB-24-1S20-CTFL' src/components/explore/sections/credentials-section.tsx → 0
grep -cE "credentials:\s*\{\s*wrapper:\s*'',\s*shell:\s*'',\s*gate:\s*false\s*\}" src/components/explore/explore-panels.tsx → 1
grep -c "credentials: 'text-chart-5'" src/components/explore/explore-drawer.tsx    → 1
grep -c 'replace(/<script' tests/credentials-panel.test.mjs                        → 2
grep -c 'href="#credentials"' tests/credentials-panel.test.mjs                      → 0
node -e over the JSON → articles 15, certifications 45, presentations 1
```

Export surface, on the script-stripped `out/explore.html`: `id="credentials"`, the `Credentials` label,
the three tab labels, `0/5 sections visited`, the featured article names as real text, and **5**
`PanelShell` mono index spans with one ending `>05</span>` — while `#credentials`, `Allure Reporting` and
`GRTB-24-1S20-CTFL` stay **absent** (client-only: the drawer Sheet is closed, the two inactive tab bodies
are hydration-only). Those three contracts are guarded at source/data level instead, exactly as the
plan's SSR boundary requires.

## Known Stubs

None. No `TODO`/`FIXME`/placeholder/skipped test was introduced in either new file (scanned). The three
empty-state strings (`No featured articles.` etc.) are the pinned UI-SPEC §4.2 copy, not stubs — they are
unreachable with the current data (5/5/1 featured) and exist so the panel is total.

## Threat Flags

- **Outbound link injection** — every `href` on an anchor row comes from JSON data, never from user input,
  and every one is gated by the single `isExternalLink` predicate (`typeof link === 'string' &&
  link.startsWith('http')`). A `javascript:`/`data:` value in `link` can never become an `href`; it would
  render as plain text. All anchors carry `target="_blank" rel="noopener noreferrer"`.
- **No new dependency, no new network surface, no new listener, no `dangerouslySetInnerHTML`** in the panel
  or the suite. The build output is a static export; the only client code added is the Radix Tabs island
  already present in the dependency graph (`@radix-ui/react-tabs`, installed since phase 1, first use here).
- **Payload growth** — threading the full `articles`/`certifications`/`presentations` slices into the client
  island enlarges the inlined RSC payload (154,737 B → 179,489 B on `out/explore.html`). Accepted by the
  plan; the script-strip discipline in the suite keeps the growth from being mistaken for rendered markup.

## Self-Check: PASSED

- Created files exist: `tests/credentials-panel.test.mjs` (366 lines, ≥60 required) and
  `src/components/explore/sections/credentials-section.tsx` (≥90 required) — both present and committed.
- Commits exist on `phase-11`: `9745193` (test:) and `08333e3` (feat:), both carrying the `(11-01)` scope.
- RED run on record (exit 1, 15 assertion failures), GREEN run on record (exit 0, 19 passed).
- `npm run typecheck` exit 0 — the five total `Record<ExploreSectionId, …>` maps are all re-mapped.
- Working tree clean for every file this plan owns (`git status` shows only the harness's untracked
  artefacts and the pre-existing `.planning/async-jobs.json` modification).
- Six expected-red suites named, with raw output, and untouched.
