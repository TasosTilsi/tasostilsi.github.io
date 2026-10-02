---
phase: 12-route-swap-promotion
plan: 03
type: execute
wave: 3
depends_on: ["EXPLORE-12-route-swap-promotion-02"]
files_modified:
  - ".planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-SWEEP.md"
  - ".planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-03-SUMMARY.md"
autonomous: true
requirements: ["REV-22"]
user_setup: []
must_haves:
  truths:
    - "The breakpoint matrix is renewed to the new route grid: exactly 8 rows — {375, 768, 1440, 1920} × {/ , /cli} — replacing phase 05's {/ , /explore}, because /explore no longer exists to sweep."
    - "Every one of the 8 rows carries the taxonomy marker and, for its manual half, the exact phrase 'manual — user final pass' — these rows are the user's final visual pass, not an executor claim."
    - "The export-level section records the phase's real artifact facts from a fresh build: index.html = the explore experience, cli.html = the CLI terminal, no explore artifact, and the `/explore` residue confined to its two-tier measured result — ZERO occurrences in out/*.html and out/*.txt, and EXACTLY ONE occurrence across out/_next/static/chunks/** (the drawer's retained `~/explore` SheetTitle, explore-drawer.tsx:55), recorded as accepted debt per RESEARCH §3.7/OQ-7 + UI-SPEC §9, not as a defect and not as a zero."
    - "The table records the chip's width arithmetic as a comment-grade note (375px: 338px used of 351px available in light theme; 362px zero-truncation floor) while the ASSERTED contract stays structural (min-w-0 / truncate / shrink-0 / whitespace-nowrap) — no estimated-px assertion is added to any suite (RESOLVED-WIDTH-TEST)."
    - "The guard row proves the phase's negative space with a git inventory: no new dependency, src/data/portfolio-main-data.json byte-untouched, no behavioural file from either surface's feature set touched, and `src/app/globals.css` byte-untouched by the whole phase — the stale route-prose comment at :496 is recorded as accepted debt with a UI-SPEC §9 / RESEARCH §9.1/§9.2 pointer, never edited."
    - "The final full gate (typecheck + build + the 14-suite run) is the LAST action on a frozen tree: it covers the workspace state that includes this SWEEP.md, and nothing source- or test-level is written after it."
    - "The phase's known post-ship perception trap is recorded for the ship step: the deployed site currently lags the repo (the live / title still reads 'Senior Software Engineer in Test' while the repo data carries the refreshed docx branding), so the first deploy after this phase ships the route swap AND the REV-01 data refresh — the changed landing copy is not a phase-12 defect."
  artifacts:
    - path: ".planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-SWEEP.md"
      provides: "The phase's breakpoint sweep table: the 8-row {375,768,1440,1920} × {/, /cli} grid with P/E/M taxonomy and dispositions, the E-1..E rows over the rebuilt export, the M rows for the user's final visual pass, the build record, and the negative-space guard row."
      min_lines: 45
  key_links:
    - from: ".planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-SWEEP.md"
      to: "tests/route-swap.test.mjs"
      via: "each P/E row's Evidence column cites the owning test and row, so every sweep claim is traceable to a falsifier rather than to prose"
      pattern: "tests/route-swap\\.test\\.mjs"
    - from: ".planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-SWEEP.md"
      to: "out/index.html"
      via: "the build record and the E rows cite the artifacts produced by `rm -rf out && npm run build` on the final tree"
      pattern: "out/index\\.html"
    - from: ".planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-SWEEP.md"
      to: ".planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md"
      via: "same row taxonomy (P/E/M), same disposition rule, and the same 8-row breakpoint × route shape with the route axis renewed"
      pattern: "manual — user final pass"
---

<objective>
Emit the phase's breakpoint sweep table for the new route grid and close the phase with a finality gate that covers the frozen workspace.

This is the phase's verification-artefact step, modelled on `.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md` (same P/E/M taxonomy, same disposition rule, same 8-row shape). The route axis changes from {/ , /explore} to {/ , /cli}: `/` is now the explore IDE shell and `/cli` the CLI terminal, so phase 05's row 1-4 evidence ("panels 1→2 cols on /explore") still applies to `/` verbatim, while its rows 5-8 (the CLI's mobile/ASCII banner and layout invariants) now apply to `/cli`.

Green-gate finality governs the task order. The table is written FIRST (it is the last planning artefact this phase produces), and the complete gate runs AFTER it, so the recorded run covers the workspace state that includes the table. Any write after the final green run reopens the gate — so the only permitted post-gate write is this phase's SUMMARY.md, and it must contain no source or test change.

Manual rows are not the executor's to claim. Rows marked `manual — user final pass` are the user's own visual confirmation of the two surfaces at the four breakpoints; the executor transcribes their arithmetic (from UI-SPEC §2.4) into the row's check description and leaves the result as awaiting that pass. Do not upgrade an M row to `pass`.
</objective>

<context>
Read these before writing.

- `.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md` — the house format: title block (Phase/Plan/Requirement + the grid statement), the Legend (P = programmatic/static source-or-arithmetic check owned by a `node --test` suite; E = export-level after `npm run build`; M = manual-visual, marked "manual — user final pass"), the disposition rule (a defect on this phase's surfaces → `fixed` red-first; elsewhere → `deferred` with a pointer), the 8-row table, the E rows table with a build record, and the guard row.
- `.planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-UI-SPEC.md` §2.4 (the width math and the responsive contract: 338px used of 351px at 375px light theme, the 362px zero-truncation floor, 360px ellipsizing the left breadcrumb by ~2px), §7 (the edge-coverage table), §5.4 (RESOLVED-44PX: the chip's 50×28/54×32 hit box and the header Terminal link as the real 44×44 control), §9 (the categorical "Do not touch the panels, drawer, tour card internals…" ban that makes the one surviving `~/explore` accepted debt).
- `.planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-RESEARCH.md` §6.1-§6.5 (the validation architecture: which check proves which behaviour — §6.1's artifact-residue row was amended to the two-tier rule: `out/*.html` + `out/*.txt` empty, exactly one hit under `out/_next/static/chunks/**`), §6.6 (the gate ordering), §9.1/§9.2 (the conventions binding this phase and the out-of-scope list, both naming `globals.css` untouched), §3.7/OQ-7 (the drawer's `~/explore` accepted debt), P-10 (the amended two-tier residue pitfall), and R-12 (the deployed-site lag).
- `.planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-CONTEXT.md` D-04 (the sweep renewal: route-existence tests, the {/ , /explore} → {/ , /cli} rows, the two-way composite, export-title assertions).
- `tests/route-swap.test.mjs` — the phase's new acceptance suite, added by plan 01. Every P and E sweep row cites a row in it (or in one of the renewed pre-existing suites). Its residue row is the falsifier for E-8: it asserts ZERO `/explore` in `out/*.html` + `out/*.txt` and EXACTLY ONE across `out/_next/static/chunks/**`.
- `tests/explore-sweep.test.mjs` — the E-row owner; the renewed E-1..E-5 rows and the `(main)`→`cli` layout invariant live here.
- `src/app/globals.css` — the `.explore-shell` overflow guard already makes horizontal scroll structurally impossible on the landing (`overflow-x-hidden`), and the reduced-motion guard at :681-690 covers every `.explore-shell *`.
- House gate: no `npm test` script exists. Gate = `npm run typecheck && npm run build && node --test tests/*.test.mjs`; `npm run build` is the only CI gate and the 14-suite run is local-only (it needs Node ≥ 23.6 for native `.ts` type stripping, while the workflow pins Node 20).
- Remote writes are gated: this phase ends at a green local tree with prepared handoff, never at a push or a deploy.
- **`VALIDATION.md` is not a plan-step artefact (Nyquist note for the plan-checker).** `workflow.nyquist_validation` is `true` and RESEARCH.md exists, so the Nyquist gate expects a `<NN>-VALIDATION.md` — but in this toolchain that file is authored by the `validate_phase` capability (`gsd_validate_phase`) from a deterministic requirement→test coverage scan, and it runs AFTER `gsd_verify`, immediately before ship. The plan step's half of that gate is the coverage obligation — every task carries a runnable `<verify>` and no 3-consecutive-task window lacks coverage — which holds across all three phase plans (3/3 have an automated verify on every task). Do NOT hand-write a `VALIDATION.md` during execute: an early artefact is reconciled by `gsd_validate_phase` as a PRIOR input, so writing one now creates a pre-verify record the validate step must then correct.
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — baseline the full gate on the post-plan-02 tree, then write the renewed 8-row sweep table</name>
    <files>.planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-SWEEP.md</files>
    <read_first>.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md, .planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-UI-SPEC.md (§2.4, §5.4, §7, §8, §9), .planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-RESEARCH.md (§6, §9.1, §9.2, §3.7, P-10, R-12), tests/route-swap.test.mjs, tests/explore-sweep.test.mjs</read_first>
    <action>
    Step 1 — baseline. Run the complete gate on the tree plan 02 handed over: `rm -rf out && npm run typecheck && npm run build && node --test tests/*.test.mjs`. Capture the verbatim output, including the build's route table (it must list `/`, `/cli` and `/resume` as static/prerendered) and the suite totals (14 suites, zero failures). If anything is red, stop and fix it red-first (add or tighten the owning test before touching the code) rather than proceeding with a red baseline; record what was found and fixed.

    Step 2 — write `.planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-SWEEP.md`, mirroring the phase-05 structure exactly. This table is the phase's implementation of CONTEXT D-04 ("test/sweep renewal": the sweep rows {/ , /explore} become {/ , /cli}, and the composite/export-title assertions are renewed), so every row must cite the renewed falsifier that owns it.

    Header block: title "Phase 12 — REV-22 Route Swap Sweep Table (D-04, falsifiable)"; `**Phase:** 12-route-swap-promotion · **Plan:** 03 · **Requirement:** REV-22`; the grid statement "exactly 8 rows — {375, 768, 1440, 1920} × {/ , /cli} — one row per {breakpoint × route}, replacing phase 05's {/ , /explore} grid because /explore no longer exists".

    Legend: copy phase 05's three-taxonomy block (P / E / M) with the same meanings, and the disposition rule (a defect on THIS phase's surfaces — the landing route files, `explore-status-bar.tsx`, `constants.ts`, `explore-header.tsx`, `WelcomeMessage.tsx`, `TerminalInterface.tsx`, `not-found.tsx`, `src/app/cli/layout.tsx` — → `fixed` red-first and the row names its pinning test; a defect inside panels/visualizations/wizard or any other non-phase surface → `deferred` with a one-line pointer; no defect → `pass`). Add a Row-owners block naming `tests/route-swap.test.mjs` (this phase's new acceptance suite: route tree, export shape, the six-leg composite, chip anatomy, metadata og:title, root-layout script ban, the SCOPED out/ residue scan — `out/*.html` + `out/*.txt` clean and exactly one `out/_next/static/chunks/**` hit), `tests/explore-sweep.test.mjs` (the renewed E rows and the CLI layout invariant) and `tests/explore-shell.test.mjs` (the landing export frame, breadcrumb, status-bar and theme-script rows).

    The 8-row table, one row per {breakpoint × route}, with columns `# | Breakpoint | Route | Check type | Check | Result | Disposition | Evidence`:
    - Rows 1-4 (`/`, the explore IDE shell) carry the phase-05 row content renewed to the new route name: at 375 the panels grid is `grid grid-cols-1 gap-4 md:grid-cols-2` (1 col), the intro strip's `min-h-[60px]` reserves the two-line wrap, `.explore-shell` carries `overflow-x-hidden` so horizontal scroll is structurally impossible, and the status bar's right cluster holds theme label · counter · the new `cli` chip; at 768/1440/1920 the grid is 2 columns at md and up (no `lg:grid-cols-3`), and the panel order is the phase-9/11 reflow with zero empty cells. Each row's Check must additionally record the chip's status-bar arithmetic as a note: at 375px the row uses 338px of 351px available in light theme (13px slack; 332px in dark) and 362px is the zero-truncation floor, with 360px ellipsizing only the left breadcrumb by ~2px — recorded as arithmetic, NOT asserted, because the suite pins the structural guards (`min-w-0`, `truncate`, `shrink-0`, `whitespace-nowrap`) instead (RESOLVED-WIDTH-TEST).
    - Rows 5-8 (`/cli`, the CLI terminal) carry phase 05's rows 5-8 content repointed: at 375 the ASCII `<pre>` is hidden (`hidden sm:block`) and the mobile banner div (`sm:hidden`) renders instead, the welcome link-line fit arithmetic still holds (30 rendered chars ≤ 42 bound; ~255px ≤ 359px content width), the CLI layout keeps `overflow-hidden` on the wrapper and `overflow-auto` on main, and output lines stay `whitespace-pre-wrap`; at 768/1440/1920 the ASCII banner is visible (from 640px) with the same invariants.
    - Every row's Result cell must distinguish its P/E part from its M part: the programmatic part cites the owning suite and result, and the manual part carries the exact phrase `manual — user final pass`. Do NOT mark any manual part `pass`.
    - Evidence cells cite the owning test file, row or grep, e.g. `tests/explore-sweep.test.mjs EXPLORE@375 (grid, shell, intro)`, `tests/route-swap.test.mjs (chip anatomy)`, `tests/explore-shell.test.mjs:452+ (landing export frame)`.

    Export-level (E) section with its own build record (`rm -rf out && npm run build` exit 0, the date, and the route table line for `/`, `/cli`, `/resume`):
    - E-1 the three routes export statically as `out/index.html`, `out/cli.html`, `out/resume.html`, with the explicit negatives `out/explore.html` absent, `out/explore.txt` absent and `out/cli/index.html` absent (the trailingSlash tripwire).
    - E-2 the header Terminal link SSRs into the LANDING artifact and points at `/cli` (`aria-label="Open the terminal"` + `href="/cli"` in `out/index.html`).
    - E-3 the CLI is still client-only at its new path (`out/cli.html` does NOT contain `System initialized`); note that this is why the welcome link and the `explore` command stay source-asserted plus composite-asserted rather than export-asserted.
    - E-4 zero new dependencies — `package.json` dependencies length still 39 and `recharts` still absent.
    - E-5 the six-leg two-way composite in one assertion set (CLI welcome link + `explore` command → `/`; header Terminal link + wizard finish card + 404 "Return to Terminal" + status-bar chip → `/cli`; the chip additionally `target="_blank"` + `rel="noopener noreferrer"` in both source and export).
    - E-6 the landing's social card is explore-branded — the `og:title` meta in `out/index.html` contains `Visual Portfolio Explorer`, while `out/cli.html` carries `Interactive CLI Portfolio`.
    - E-7 the before-paint theme script is route-scoped and ahead of the shell markup — present in `out/index.html` ahead of `explore-shell`, and absent from `src/app/layout.tsx` (so `/cli` and `/resume` keep their own theme classes).
    - E-8 the `/explore` residue — TWO FACTS, both measured, neither a bare zero. Fact (a): NO `/explore` string in any `out/*.html` or `out/*.txt` (result 0; this covers the deleted `explore.html` + `explore.txt`, which today are 2 of the 4 pre-phase carriers, and `out/404.html`, which must also be clean). Fact (b): EXACTLY ONE occurrence remains under `out/_next/static/chunks/**` — the landing page chunk's `~/explore` string, i.e. the drawer's retained SheetTitle at `src/components/explore/explore-drawer.tsx:55`, carried over from the pre-phase `_next/static/chunks/app/explore/page-*.js` (which held 2 hits: that title plus the now-renewed `:~/explore` status path). Record the pre-phase count that made the row meaningful (4 artifact files contained `/explore`: `explore.html`, `explore.txt`, that landing chunk, and the shared `_next/static/chunks/37.*.js` sentinel chunk) and the post-build result as `0 in html/txt, 1 under chunks/** — accepted debt per RESEARCH §3.7/OQ-7 + UI-SPEC §9`. Cite the owning falsifier in the Evidence column: `tests/route-swap.test.mjs (scoped residue scan: html/txt = 0 files; chunks = assert.equal(hits, 1) naming explore-drawer.tsx)`. Do NOT write the post-build result as `0` — it is 1, and a false artifact fact in a phase deliverable would be worse than the debt it hides.

    Manual (M) section: transcribe the 8 M rows explicitly (375/768/1440/1920 × `/` and `/cli`), each marked `manual — user final pass`, each naming what the user looks at — for `/`: the IDE shell renders with the status bar reading `guest@tasostilsi:~` and the `cli ↗` chip in the right cluster, the chip's inset focus ring is fully visible when tabbed to, and at 375px nothing truncates or wraps in the status row; for `/cli`: the terminal renders in its full-height frame with the ASCII banner from 640px and the mobile banner below it, and the welcome bracket line fits. Add a one-line note that the chip's new-tab behaviour (middle-click/⌘-click and `Enter` both opening a new tab) is part of the user's pass.

    Guard row: prove the phase's negative space with a git inventory over the phase's code commits — `git diff --name-only <plan-01-base>..HEAD -- src/data package.json public scripts .github` returns empty (the data file, dependency manifest, static assets and CI are untouched); `git diff --stat -- src/app/globals.css` returns EMPTY (the file is byte-untouched by the whole phase — UI-SPEC §9 + RESEARCH §9.1/§9.2, so record its stale route-prose comment at `:496` as accepted debt with a pointer, never as a permitted edit); and the touched-file inventory equals the enumeration in plan 01/02's `files_modified` lists (no panel, drawer, wizard, arc, stack, credentials or counter source appears). Add the R-12 perception note verbatim in meaning: "The deployed site currently lags the repo — the live `/` title still reads 'Senior Software Engineer in Test' while the repo data carries the refreshed docx branding. The first deploy after this phase ships the route swap AND the REV-01 data refresh together; the changed landing copy is not a phase-12 defect."

    Step 3 — commit the table on its own as `docs(phase-12): add route-swap breakpoint sweep table`.
    </action>
    <verify>`rm -rf out && npm run typecheck && npm run build && node --test tests/*.test.mjs; echo "gate-exit=$?"` and `grep -c '^| [0-9]' .planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-SWEEP.md`</verify>
    <acceptance_criteria>
      - The baseline gate is on record BEFORE the table is written: `npm run typecheck` exit 0, `npm run build` exit 0 with a route table listing `/`, `/cli`, `/resume`, and `node --test tests/*.test.mjs` exit 0 with 14 suites and zero failures — the verbatim output is quoted in the table's build record and in SUMMARY.md.
      - `.planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-SWEEP.md` exists and `grep -c '^| [1-8] |' <file>` returns 8 — the grid is exactly {375, 768, 1440, 1920} × {/, /cli}.
      - Every one of the 8 rows contains the exact phrase `manual — user final pass`: `grep -c 'manual — user final pass' <file>` returns at least 8, and no M row's result is recorded as `pass`.
      - The E section has at least 8 rows: `grep -c '^| E-' <file>` returns at least 8.
      - Every row's Evidence cell cites a test file: `grep -c 'tests/' <file>` returns at least 10, and `grep -c 'tests/route-swap.test.mjs' <file>` returns at least 1.
      - The renewed negative facts are present in the table: `grep -c 'out/explore.html' <file>` returns at least 1 (in the "absent" sense), `grep -c 'out/cli/index.html' <file>` returns at least 1, AND the E-8 row carries both measured tiers — `grep -c 'out/_next/static/chunks' <file>` returns at least 1, `grep -c 'explore-drawer' <file>` returns at least 1, and the row states the chunks count is EXACTLY ONE with `~/explore` named as the accepted hit (the row must NOT report a whole-tree zero: `grep -c 'post-build result (0)' <file>` returns 0).
      - The chip arithmetic is recorded as a note and NOT as an asserted pixel value: the 338/351 and 362px figures appear in the row's Check text, while the same row names the structural guards (`min-w-0`, `truncate`, `shrink-0`, `whitespace-nowrap`) — and no suite gains an estimated-px assertion in this plan (`git diff --name-only` for this task lists only the table).
      - The guard row is present with its git command and its result: `grep -c 'git diff --name-only' <file>` returns at least 1, and the command's empty result over `src/data package.json public scripts .github` is quoted.
      - The `globals.css` guard records the byte-untouched result, not a comment-only diff: `grep -c 'src/app/globals.css' <file>` returns at least 1 and the row states the diff is EMPTY, with the `globals.css:496` stale route-prose comment recorded as accepted debt plus a UI-SPEC §9 pointer. No row in the table claims a comment edit to that file.
      - The R-12 perception note is present: `grep -c 'not a phase-12 defect' <file>` returns 1.
      - The commit contains only the sweep table: `git show --stat HEAD` lists one file.
    </acceptance_criteria>
    <done>A committed sweep table that renews phase 05's matrix to the {375, 768, 1440, 1920} × {/, /cli} grid, records every P/E row against its owning falsifier with the real build baseline, states the `/explore` residue as its two measured facts (0 in out/*.html + out/*.txt; exactly 1 under out/_next/static/chunks/** — the drawer's accepted `~/explore`) rather than a false whole-tree zero, marks all 8 M rows as the user's final pass with the chip arithmetic transcribed as a note rather than an assertion, and proves the phase's negative space (data/deps/assets/CI untouched, `globals.css` byte-untouched with one recorded debt line) with a git inventory.</done>
  </task>

  <task type="auto">
    <name>Task 2: Finality pass — the complete gate as the last action on the frozen tree, with the merge hold and ship handoff recorded</name>
    <files>.planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-SWEEP.md, .planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-03-SUMMARY.md</files>
    <read_first>.planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-SWEEP.md (as written by Task 1), .planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-01-PLAN.md (the merge hold text), .planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-02-PLAN.md (the phase-level verification hooks)</read_first>
    <action>
    Close the phase with a finality pass. The ordering is the whole point: the workspace must already contain the sweep table, and the complete gate must be the LAST action performed on it.

    1. Confirm the workspace is frozen: `git status --porcelain -- src tests` returns nothing (no uncommitted source or test change) and `git status --porcelain` shows at most planning artefacts.
    2. Run the complete gate, from a clean artifact directory, as the final action: `rm -rf out && npm run typecheck && npm run build && node --test tests/*.test.mjs`. Capture the verbatim output: the typecheck result, the build's route table (`/`, `/cli`, `/resume` static) and the suite totals.
    3. If the run is red, fix it red-first (write or tighten the owning test before the code), re-run the gate, and record both runs. Never soften an assertion to reach green — in particular do NOT touch row 11 of `tests/route-swap.test.mjs` (the `assert.equal(hits, 1)` residue count) to manufacture a green.
    4. Append a short "Finality" section to the sweep table's build record: the exact command sequence, the exit codes, the suite count, the date, and the statement that this run covers the workspace state including this table and that no source or test file was written after it. Note that `EXPLORE-12-route-swap-promotion-03-SUMMARY.md` — this plan's own SUMMARY, the file named in this plan's `files_modified` — is the only permitted post-gate write and contains no source or test change.
    5. Write the phase handoff notes into `EXPLORE-12-route-swap-promotion-03-SUMMARY.md` (not into the table): the merge hold is LIFTED (plan 02's full-suite run was green and this final run re-confirms it); the remote-write hold stands — no push, no PR, no deploy without an explicit per-action user command; the deploy workflow triggers on `master` only, so nothing ships until the user authorises it; and the R-12 note that the first deploy carries both the route swap and the REV-01 data refresh, so the changed landing copy must not be read as a phase-12 defect. Also record the accepted debt with both pointers: (a) the drawer's `~/explore` SheetTitle is deliberately unchanged (UI-SPEC §9 forbids touching the drawer; RESEARCH §3.7/OQ-7) and belongs to a future chrome pass — it is also the ONE `/explore` occurrence the residue scan permits, so it is pinned by `tests/route-swap.test.mjs`'s `assert.equal(hits, 1)` row; (b) the stale route-prose comment at `src/app/globals.css:496` is deliberately unchanged because UI-SPEC §9 and RESEARCH §9.1/§9.2 forbid editing `globals.css` at all in this phase — the file is byte-untouched and the debt carries the same UI-SPEC §9 pointer.
    6. Commit the finality section as `docs(phase-12): record final green gate on the route-swap tree` (with SUMMARY.md in the same commit). This commit contains planning artefacts only.
    </action>
    <verify>`git status --porcelain -- src tests; echo "src-tests-clean-exit=$?"; rm -rf out && npm run typecheck && npm run build && node --test tests/*.test.mjs; echo "gate-exit=$?"`</verify>
    <acceptance_criteria>
      - `git status --porcelain -- src tests` is empty BEFORE the final gate run — the run covers a frozen workspace.
      - The final gate is the last action: `npm run typecheck` exit 0, `npm run build` exit 0 (route table lists `/`, `/cli`, `/resume`), `node --test tests/*.test.mjs` exit 0 with 14 suites — recorded verbatim in the table's Finality section and in SUMMARY.md.
      - No source or test file is modified after the final run: `git status --porcelain -- src tests` is still empty after it.
      - The table's Finality section contains the command sequence and the exit codes: `grep -c 'npm run typecheck' <SWEEP.md>` returns at least 2 and `grep -c 'Finality' <SWEEP.md>` returns at least 1.
      - SUMMARY.md records all four handoff facts: the merge hold being lifted, the remote-write hold standing, the `master`-only deploy trigger, and the R-12 data-refresh note (`grep -c 'not a phase-12 defect' SUMMARY.md` returns at least 1).
      - SUMMARY.md records the accepted debt with its pointers: the drawer's `~/explore` title unchanged by design and pinned as the single permitted residue hit, deferred to a future chrome pass (`grep -c 'explore-drawer' SUMMARY.md` returns at least 1), and `src/app/globals.css:496` unchanged because UI-SPEC §9 / RESEARCH §9.1 forbid editing that file (`grep -c 'globals.css:496' SUMMARY.md` returns at least 1).
      - `git show --stat HEAD` for this commit lists only planning artefacts: the sweep table and this plan's SUMMARY (`EXPLORE-12-route-swap-promotion-SWEEP.md` + `EXPLORE-12-route-swap-promotion-03-SUMMARY.md`, both named in this plan's `files_modified`) — no file under `src/` or `tests/`.
    </acceptance_criteria>
    <done>The complete house gate (typecheck + build + the 14-suite run) is green and chronologically last on a frozen tree that includes the sweep table, with the merge hold lifted, the remote-write hold standing, the deploy-trigger and data-refresh notes recorded, and both accepted debts (the drawer title — the single permitted `/explore` residue hit — and the `globals.css:496` prose line) documented with their pointers.</done>
  </task>
</tasks>

---

**Not this plan's job:** the M rows are the user's visual pass and must stay unclaimed; `verify`/`ship`/`milestone-audit` are separate loop steps, not plan tasks; and no remote mutation (push, PR, deploy) happens here under any circumstances.
