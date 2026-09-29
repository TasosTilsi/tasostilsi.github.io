---
phase: 11-credentials-panel-revision
plan: 02
type: execute
wave: 2
depends_on:
  - "EXPLORE-11-credentials-panel-revision-01"
files_modified:
  - "tests/explore-shell.test.mjs"
  - "tests/explore-visuals.test.mjs"
  - "tests/portfolio-data-integrity.test.mjs"
  - "tests/explore-sweep.test.mjs"
  - "tests/explore-tour.test.mjs"
  - "tests/explore-visuals-skills.test.mjs"
autonomous: true
requirements: ["REV-21"]
gap_closure: false
user_setup: []
must_haves:
  truths:
    - "No assertion anywhere in tests/ still encodes the retired 4-section contract — a sweep for the 4-section literals finds only deliberate history comments, not live assertions."
    - "No test TITLE or message in tests/ still says 'four total closures' or 'exactly four adapter closures' — the counts and the prose that describes them are renewed in the same edit, so no file carries a claim its own renewed assertion contradicts."
    - "The drawer suite asserts 5 anchors including the credentials digit accent; the counter suites assert the live N/5 template and the static '0/5 sections visited' string."
    - "The export suite asserts 5 panel index spans 01-05 (the Credentials panel carries 05) and 5 adapter closures (the CredentialsSection closure is the 5th)."
    - "The tour suite asserts the welcome copy says 'five sections' and no longer asserts 'four sections' — the copy is truthful about the panel count."
    - "The sweep suite asserts the 5-entry EXPLORE_SECTIONS order including credentials, and the adapter-closure suites in BOTH affected files assert 5 closures."
    - "The presentations nothing-deleted ledger keeps its deepStrictEqual and its PRE_PRESENTATIONS fixture gains the typed featured flag that plan 01 added to the data — so 'nothing deleted' stays a true statement over the new contract."
    - "The full `node --test tests/*.test.mjs` suite passes on the final tree after a fresh `npm run build`, and that run is the chronologically LAST action of the plan."
  artifacts:
    - path: "tests/explore-shell.test.mjs"
      provides: "5-section constants/drawer/counter export rows, with the chart-5 digit accent now REQUIRED."
    - path: "tests/explore-tour.test.mjs"
      provides: "5-entry accent map, 5 valid visited ids, truthful 'five sections' welcome copy, 0/5 static counter."
    - path: "tests/explore-sweep.test.mjs"
      provides: "5-entry EXPLORE_SECTIONS order assertion."
    - path: "tests/explore-visuals.test.mjs"
      provides: "5 panel index spans 01-05 in the static export, and 5 adapter closures including CredentialsSection."
    - path: "tests/explore-visuals-skills.test.mjs"
      provides: "5 adapter closures including the CredentialsSection closure."
    - path: "tests/portfolio-data-integrity.test.mjs"
      provides: "The PRE_PRESENTATIONS ledger fixture carrying the new typed featured flag, with the deepStrictEqual ledger assertion intact."
  key_links:
    - from: "tests/explore-shell.test.mjs"
      to: "src/components/explore/explore-drawer.tsx"
      via: "the drawer digit-accent assertion now requires credentials: 'text-chart-5'"
      pattern: "credentials: 'text-chart-5'"
    - from: "tests/explore-visuals.test.mjs"
      to: "src/components/explore/panel-shell.tsx"
      via: "5 rendered index spans 01-05 in out/explore.html"
      pattern: "spans\\.length, 5"
    - from: "tests/explore-tour.test.mjs"
      to: "src/components/explore/constants.ts"
      via: "the welcome-copy guard asserts the truthful five-section count"
      pattern: "five sections"
    - from: "tests/portfolio-data-integrity.test.mjs"
      to: "src/data/portfolio-main-data.json"
      via: "the presentations ledger fixture mirrors the new typed featured flag"
      pattern: "featured: true"
---
<objective>
Turn the deliberately-broken 4-section test suites green again after plan 01 replaced the section contract with 5 sections.

Plan 01 appended `credentials` to `EXPLORE_SECTIONS`, which legitimately invalidates every suite that pinned the 4-section world. Those suites are RED on record right now (captured in plan 01's SUMMARY.md). This plan renews the SIX stale suites to the new contract — it edits test files only, and must not weaken or delete any assertion that still describes real behaviour: each renewal either widens a count/array to include the new section, renews a snapshot fixture to the deliberately-changed data contract, or inverts a check that asserted the absence of the now-required chart-5 accent. No implementation file is touched.

Renewal inventory (verified against the tree — six suites, not five): `explore-shell.test.mjs`, `explore-visuals.test.mjs` (index spans AND adapter closures), `portfolio-data-integrity.test.mjs` (the presentations ledger fixture), `explore-sweep.test.mjs`, `explore-tour.test.mjs`, `explore-visuals-skills.test.mjs` (adapter closures). UI-SPEC §9 names only the first two by file — the rest were found by a repo-wide sweep of 4-section literals plus the data-contract delta, and are equally broken, so a green run requires all six. The closure-count assertion is deliberately duplicated in TWO files (`explore-visuals.test.mjs:332-335` and `explore-visuals-skills.test.mjs:161`) — renewing only one leaves the gate unsatisfiable.

Renewal completeness rule: when a count changes, the PROSE that states the count changes with it in the same edit — test titles and assertion messages are assertions of record too. A file that asserts 5 closures while its own title says "four total closures" carries a contradiction, which is exactly the staleness class this plan exists to remove.

Closes on the full suite: `npm run build && node --test tests/*.test.mjs` passing on the final tree, with that run being the LAST action of the plan (no writes after it).

MERGE HOLD (inherited from plan 01): until this plan's full-suite run is on record, the branch is knowingly red on six suites and must not be merged or handed off as green. This plan is the release of that hold.
</objective>

<context>
- `.planning/phases/EXPLORE-11-credentials-panel-revision/EXPLORE-11-credentials-panel-revision-01-SUMMARY.md` — the plan-01 handoff listing the six red suites and the raw red output, plus the merge hold this plan releases.
- `.planning/phases/EXPLORE-11-credentials-panel-revision/EXPLORE-11-credentials-panel-revision-UI-SPEC.md` §9 — the stale-test inventory and the TOUR-01 copy resolution (welcome body must say "five sections").
- The new contract, already implemented by plan 01: `EXPLORE_SECTIONS` has 5 entries (`about, skills, experience, projects, credentials`); `EXPLORE_TOUR_ACCENTS` and the drawer's `DIGIT_ACCENTS` carry `credentials: 'bg-chart-5'` / `credentials: 'text-chart-5'`; the status bar derives `${visitedCount}/${EXPLORE_SECTIONS.length}`; the tour still has exactly 6 id-keyed steps with no Credentials step.
- `src/components/explore/explore-panels.tsx` — 5 `SECTION_BODIES` closures and 5 `ACCENTS` entries.
- `src/data/portfolio-main-data.json` — `presentations[0].featured === true` (the D-03/R-7 addition that the nothing-deleted ledger fixture must follow).
- SUPERSESSION OF RECORD (recorded in plan 01's SUMMARY.md, restated here so no renewal reads it as a regression): SPEC acceptance "every row an anchor" and CONTEXT D-02 "compact anchor rows" are narrowed FOR THE CERTIFICATIONS TAB by UI-SPEC §5.3/§5.4 — of the 5 featured certifications, 4 have `link: null` and 1 holds the literal `"ID: GRTB-24-1S20-CTFL"`, so that tab renders 5 plain-text rows and ZERO anchors, and no suite may assert a certification anchor. The Articles and Presentations tabs keep real anchors. Nothing in this plan's renewal inventory asserts certification anchors, so this is context for reading the suite, not a site to edit.
- Scope boundary this plan does NOT touch: `tests/credentials-panel.test.mjs` (phase 11's new acceptance suite, authored and greened by plan 01 — its certification rows already encode the measured 5-featured / 0-http / 4-null / 1-ID contract, including the SCRIPT-STRIPPED export rows).
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Renew the shell suite to 5 sections, the 5-span/5-closure export suite, and the presentations ledger fixture</name>
    <files>tests/explore-shell.test.mjs, tests/explore-visuals.test.mjs, tests/portfolio-data-integrity.test.mjs</files>
    <read_first>tests/explore-shell.test.mjs, tests/explore-visuals.test.mjs, tests/portfolio-data-integrity.test.mjs, src/components/explore/explore-drawer.tsx, src/components/explore/explore-panels.tsx, src/data/portfolio-main-data.json</read_first>
    <action>
    Renew `tests/explore-shell.test.mjs` at these exact sites:
    - Line ~27 test title: "4 locked sections" → 5; and the membership loop at ~31 `['about','skills','experience','projects']` → append `'credentials'`. The membership check is order-irrelevant — keep the phase-9 order comment accurate.
    - Line ~79 title: "LIVE N/4 counter" → N/5. The assertion itself checks the derived template `\${visitedCount}/\${EXPLORE_SECTIONS.length} sections visited` and stays as-is. Renew only the ~92 comment ("4/4 celebration accent" → 5/5).
    - Line ~246 test title: "4 anchor items" → 5 anchor items. The `padStart(2)` assertion is unchanged; renew the ~251 comment "01…04" → "01…05". (This row reads `explore-drawer.tsx` as source, not the export — the closed Sheet never reaches the static export, so no export assertion for drawer anchors exists or should be added here.)
    - Line ~268-269: the per-id digit assertions. Keep the existing `projects: 'text-chart-4'` check, ADD `credentials: 'text-chart-5'`, and INVERT the negative check `assert.ok(!src.includes('text-chart-5'), …)` into a positive one requiring the credentials chart-5 digit. This is a deliberate contract inversion — the accent is now required, not forbidden.
    - Line ~345-346: the panels accent loop. Widen `for (let i = 1; i <= 4; i++)` → `i <= 5`, and INVERT `assert.ok(!src.includes('chart-5'), …)` into a positive assertion that `explore-panels.tsx` maps `credentials` to `bg-chart-5`. Do NOT delete the `!lg:grid-cols-3` check at ~344 — that behaviour is unchanged.
    - Line ~447: the static-export row `html.includes('0/4 sections visited')` → `'0/5 sections visited'`, message updated to "over 5 sections".

    Renew `tests/explore-visuals.test.mjs` at BOTH of its 4-section sites, and renew each site's prose with its count:
    - Line ~314 test title: `'cross-cutting: registry spine — four total closures after the merge, skills carries competencies (D-04/D-05/D-07, plan 04)'` → `'cross-cutting: registry spine — five total closures after the merge, skills carries competencies (D-04/D-05/D-07, phase-11 REV-21)'`. The title is stale in exactly the way the count assertion below it is; renaming it is part of the SAME edit, not a separate cleanup. Leaving it would make the file assert 5 closures under a "four total closures" headline.
    - Lines ~325-335 — the adapter-closure registry. Alongside the existing per-closure rows, ADD the credentials closure assertion: that `explore-panels.tsx` contains `credentials: ({ data }) => <CredentialsSection articles={data.articles} certifications={data.certifications} presentations={data.presentations} />` and that it maps to `bg-chart-5`. THEN renew the count assertion at ~332-335: `(src.match(/\w+: \(\{ data \}\) => </g) || []).length` → 5, with the message updated to "exactly five adapter closures — the registry is total over the 5-section grid" (drop the "4-section grid (D-04/D-07)" phrasing, which now contradicts the count).
    - Line ~765 test title: "the four panel headers render the aria-hidden mono index spans 01-04" → five / 01-05.
    - Line ~774: `assert.equal(spans.length, 4, …)` → 5 (message updated).
    - Line ~775: the expected digits array `['01','02','03','04']` → append `'05'`.

    Renew `tests/portfolio-data-integrity.test.mjs`:
    - Lines ~113-122: the `PRE_PRESENTATIONS` fixture. Add `featured: true` to its single entry so it mirrors the data contract plan 01 landed (`presentations[0].featured`). Reason, recorded in a one-line comment next to the fixture: the ledger test at ~444 runs `assert.deepStrictEqual(data.presentations, PRE_PRESENTATIONS)`, which fails on the extra own key if the fixture is not renewed. The flag is a DELIBERATE typed addition (D-03 / R-7), not a deletion — the ledger's "nothing deleted" meaning is preserved.
    - Keep the ledger assertion at ~444 exactly as it is: still `assert.deepStrictEqual(data.presentations, PRE_PRESENTATIONS)` over all four collections. Do NOT delete the entry, do NOT narrow the comparison to a subset, and do NOT loosen `deepStrictEqual` to a length or `Object.keys` check.

    Renew only the 4-section contract rows and their prose named above. Every other assertion in these three files still describes real behaviour and must stay byte-unchanged — in particular the `!lg:grid-cols-3` and `!src.includes('ContactSection')` checks in the shell suite, the skills chart-fill derivation at `explore-visuals.test.mjs:88,97` (which legitimately uses `hsl(var(--chart-5))` for an unrelated purpose), and the interests / favorite_games / skills ledgers beside the presentations fixture.
    </action>
    <verify>npm run build && node --test tests/explore-shell.test.mjs && node --test tests/explore-visuals.test.mjs && node --test tests/portfolio-data-integrity.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/explore-shell.test.mjs` exits 0.
      - `node --test tests/explore-visuals.test.mjs` exits 0 after a fresh `npm run build`.
      - `node --test tests/portfolio-data-integrity.test.mjs` exits 0.
      - `grep -c "0/4 sections visited" tests/explore-shell.test.mjs` returns 0 and `grep -c "0/5 sections visited" tests/explore-shell.test.mjs` returns 1.
      - `grep -c "text-chart-5" tests/explore-shell.test.mjs` returns at least 1 and the assertion is POSITIVE (no `!src.includes('text-chart-5')` remains).
      - `grep -c "spans.length, 4" tests/explore-visuals.test.mjs` returns 0 and `grep -c "spans.length, 5" tests/explore-visuals.test.mjs` returns 1.
      - `grep -c "exactly four adapter closures" tests/explore-visuals.test.mjs` returns 0 and `grep -c "CredentialsSection" tests/explore-visuals.test.mjs` returns at least 1.
      - Stale closure prose is gone: `grep -c "four total closures" tests/explore-visuals.test.mjs` returns 0 and `grep -c "five total closures" tests/explore-visuals.test.mjs` returns 1 — the title at ~314 was renamed with the count, not left behind.
      - No stale "four"/"01-04" headline survives its renewed count in this file: `grep -c "spans 01-04" tests/explore-visuals.test.mjs` returns 0.
      - `grep -c "featured: true" tests/portfolio-data-integrity.test.mjs` returns at least 1 AND `grep -c "assert.deepStrictEqual(data.presentations, PRE_PRESENTATIONS)" tests/portfolio-data-integrity.test.mjs` returns 1 — the fixture was renewed, the ledger was not weakened.
      - The `!lg:grid-cols-3` and `!src.includes('ContactSection')` assertions still exist (real behaviour, not weakened).
    </acceptance_criteria>
    <done>The shell and export suites assert the 5-section world — including the now-required chart-5 credentials accent, the 05 index span and the 5-closure registry — with every renewed count's title and message renewed alongside it, and the presentations ledger fixture carrying the new typed flag while all three suites pass.</done>
  </task>

  <task type="auto">
    <name>Task 2: Renew the section-order sweep and the tour suite (accent map, valid ids, truthful welcome copy)</name>
    <files>tests/explore-sweep.test.mjs, tests/explore-tour.test.mjs</files>
    <read_first>tests/explore-sweep.test.mjs, tests/explore-tour.test.mjs, src/components/explore/constants.ts</read_first>
    <action>
    Renew `tests/explore-sweep.test.mjs`:
    - Lines ~74-78: the `assert.deepEqual(sections, [...])` on the parsed `EXPLORE_SECTIONS` ids must become `['about', 'skills', 'experience', 'projects', 'credentials']`. Update the message to say 5 section ids and note that `credentials` is the row-3 sibling of the Projects stack. This is the ONLY 4-section assertion in the file — the `md:grid-cols-2`, `md:col-span-2` count and `md:order-first`-absence checks below it all still describe real behaviour and must be left intact.
    - The ~65 test description mentioning "[Projects full-width]" as row 3: renew the wording to the row-3 sibling pair [Projects stack | Credentials] so the description does not contradict the assertion.

    Renew `tests/explore-tour.test.mjs`:
    - Lines ~54-63: the `EXPLORE_TOUR_ACCENTS` deep-equal gains `credentials: 'bg-chart-5'`; update the "4 sections after the merge" message to 5.
    - Lines ~178-186 — the deliberate copy INVERSION (UI-SPEC §9 TOUR-01): the test currently asserts the welcome body `includes('four sections')` and `!includes('five sections')`. Invert BOTH: assert the welcome body now includes `five sections` and does NOT include `four sections`, and rename the test to reflect the 5-section reality (phase-11 REV-21). The copy must not lie about the panel count. Do not simply delete this test — the inverted guard is the value.
    - Line ~230: `const VALID_IDS = ['about', 'skills', 'experience', 'projects']` → append `'credentials'`. The `parseVisitedIds` expectations at ~365-373 use explicit inputs/outputs that are unaffected by the widened valid set — verify they still pass rather than editing them.
    - Lines ~601-608: renew the "N/4" counter test title/comment to N/5 (the derived-template assertion is unchanged).
    - Line ~630: the static-export row `html.includes('0/4 sections visited')` → `'0/5 sections visited'`.
    - Lines ~67-71: the locked 6-step table assertion (`['welcome','about','experience','skills','projects','finish']`) MUST remain 6 entries — this is the pinned D-04/D-05 contract that the wizard gains NO Credentials step. Leave it byte-unchanged as the guard against scope creep.
    </action>
    <verify>npm run build && node --test tests/explore-sweep.test.mjs && node --test tests/explore-tour.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/explore-sweep.test.mjs` exits 0 and its parsed-id assertion is the 5-entry array.
      - `node --test tests/explore-tour.test.mjs` exits 0.
      - `grep -c "four sections" tests/explore-tour.test.mjs` returns 0 in live assertions (only a deliberate history comment may remain, and preferably none); `grep -c "five sections" tests/explore-tour.test.mjs` returns at least 1.
      - The 6-step sequence assertion still expects exactly 6 step ids and no step is `credentials` — `grep -c "finish" tests/explore-tour.test.mjs` shows the table intact.
      - `grep -c "'credentials'" tests/explore-tour.test.mjs` shows `VALID_IDS` widened and the accent map entry present.
      - No test title in either file still states the retired 4-section count: `grep -nc "4 sections" tests/explore-sweep.test.mjs tests/explore-tour.test.mjs` finds no live title or message (history comments only, and none if avoidable).
    </acceptance_criteria>
    <done>The sweep asserts the 5-entry order and the tour suite asserts the 5-section accent map, widened valid ids, the truthful "five sections" copy and the unchanged 6-step wizard — with no title or message still claiming four sections.</done>
  </task>

  <task type="auto">
    <name>Task 3: Renew the adapter-closure suite and close on the full green gate</name>
    <files>tests/explore-visuals-skills.test.mjs</files>
    <read_first>tests/explore-visuals-skills.test.mjs, src/components/explore/explore-panels.tsx, tests/explore-visuals.test.mjs (the closure rows renewed in Task 1 — keep both files' messages consistent)</read_first>
    <action>
    Renew `tests/explore-visuals-skills.test.mjs`:
    - Line ~161: `assert.equal((src.match(/\w+: \(\{ data \}\) => </g) || []).length, 4, 'exactly four adapter closures (D-04/D-07)')` → 5, message updated to name the 5 closures. This is the SECOND copy of the closure-count row — Task 1 renewed the one in `explore-visuals.test.mjs:332-335` (title at ~314 included); both files' counts AND their prose must change or the full-suite gate cannot pass and one file's headline will contradict its own assertion.
    - Alongside the existing per-closure assertions for `about`/`experience`/`projects`/`skills` (~149-160), ADD the credentials closure assertion: that `explore-panels.tsx` contains `credentials: ({ data }) => <CredentialsSection articles={data.articles} certifications={data.certifications} presentations={data.presentations} />` (the exact adapter threading the three featured collections), and that `CredentialsSection` is imported. Do not weaken the existing negative checks (the absent contact closure assertion stays).

    Then close the phase gate — this task's final gate run must be the LAST action performed, covering the final workspace state:
    - Run `npm run build`, then the FULL suite `node --test tests/*.test.mjs`. Everything must pass: the new `credentials-panel.test.mjs` from plan 01 plus all 12 pre-existing suites (13 files in total).
    - If any suite other than the six renewed here fails, report it in SUMMARY.md as a gap rather than loosening its assertion. Do not weaken an assertion to reach green.
    - Write SUMMARY.md only after (or record the exact gate command + output in it), so no source write follows the green run. Record in SUMMARY.md that this run releases the plan-01 MERGE HOLD: the branch is mergeable only because this full-suite green covers the final workspace state.
    </action>
    <verify>npm run build && node --test tests/*.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/*.test.mjs` exits 0 with all suites passing (13 test files: the 12 pre-existing plus `credentials-panel.test.mjs`).
      - `grep -c ", 4, 'exactly four adapter closures" tests/explore-visuals-skills.test.mjs` returns 0 and `grep -c "CredentialsSection" tests/explore-visuals-skills.test.mjs` returns at least 1.
      - Repo-wide, no live 4-section assertion remains: a sweep for `0/4 sections visited`, `!src.includes('text-chart-5')`, `!src.includes('chart-5')`, `spans.length, 4`, `'exactly four adapter closures'` and `"four total closures"` across tests/ returns no live-assertion match. The closure-count sweep MUST cover both `tests/explore-visuals.test.mjs` (count + title) and `tests/explore-visuals-skills.test.mjs`.
      - The data-contract renewal is complete: `grep -c "featured: true" tests/portfolio-data-integrity.test.mjs` returns at least 1 and that suite exits 0 (a 4-section-literal sweep alone cannot catch this fixture drift, so it is checked explicitly).
      - `npm run typecheck` exits 0 and `npm run build` exits 0 on the final tree, emitting `out/index.html`, `out/explore.html` and `out/resume.html`.
      - The green run is chronologically last: `git status --porcelain` is empty of source/test writes after the recorded gate command (SUMMARY.md is the only artefact committed after it, and no source file is touched after the run).
      - SUMMARY.md records the merge-hold release: `grep -c "MERGE HOLD" .planning/phases/EXPLORE-11-credentials-panel-revision/EXPLORE-11-credentials-panel-revision-02-SUMMARY.md` returns at least 1.
    </acceptance_criteria>
    <done>The full node --test suite and the build/typecheck gates pass on the final tree as the plan's last action, with all six stale suites renewed to the 5-section contract — counts and their titles/messages together — and nothing weakened.</done>
  </task>
</tasks>
