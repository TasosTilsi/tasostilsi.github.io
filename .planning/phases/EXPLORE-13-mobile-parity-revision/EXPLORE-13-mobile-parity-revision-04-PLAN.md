---
phase: 13-mobile-parity-revision
plan: 04
type: execute
wave: 4
depends_on: ["EXPLORE-13-mobile-parity-revision-03"]
files_modified:
  - "tests/explore-sweep.test.mjs"
  - ".planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-MOBILE-CHECKLIST.md"
autonomous: false
requirements: ["REV-23", "REV-23b", "REV-24", "REV-25"]
user_setup:
  - "A real phone (one notched device preferred, one non-notched if available), on the deployed or locally-served build, in portrait."
  - "Access to Settings → Accessibility → Motion → Reduce Motion (10 seconds) for the OQ-1 decision."
must_haves:
  truths:
    - "The stale `<md` sweep rows are renewed to the parity contracts and the phase's new export rows pass on a freshly built out/."
    - "Every VISUAL and TOUCH claim this phase makes is carried by a written, user-owned checklist item — the programmatic half is green, but nothing visual is claimed as verified until the phone says so (D-07)."
    - "The Reduce-Motion precondition for the swipe-parity claim is explicitly put to the user and its answer recorded — REV-23b's 'touch drag works' and REV-20's verified 'reduced motion disables drag' cannot both hold on a phone with the OS setting ON."
    - "The full gate is the LAST chronological action: any write that follows the phone test (a fix or the checklist record itself) reopens it, and it is re-run green over the final workspace state."
  artifacts:
    - path: "tests/explore-sweep.test.mjs"
      provides: "The renewed mobile sweep rows plus the phase's new export rows"
      min_lines: 460
      exports: []
    - path: ".planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-MOBILE-CHECKLIST.md"
      provides: "The 11 phone items + the Reduce-Motion precondition + the recorded results"
      min_lines: 40
      exports: []
  key_links:
    - from: "tests/explore-sweep.test.mjs"
      to: "out/index.html"
      via: "the new export rows read the freshly built static export (so the build must precede them)"
      pattern: "viewport-fit=cover"
    - from: ".planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-MOBILE-CHECKLIST.md"
      to: ".planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-mobile-parity-revision-UI-SPEC.md"
      via: "the checklist quotes UI-SPEC §10 item-for-item and adds the OQ-1 precondition"
      pattern: "§10"
---

<objective>
Close the phase's acceptance loop: renew the stale `<md` sweep rows, add the phase's own export-level rows, then put the two user-owned questions to the real phone — including the Reduce-Motion contradiction that no artefact in this phase currently acknowledges — and re-run the full gate chronologically last over the final tree.

**Why this is a separate plan with `autonomous: false`.** D-07 splits the phase's bar in two: "Real-hardware verification is the user's bar: every VISUAL claim ships with the phone checklist; the programmatic half (grep pins, export checks, suites) is mine." The programmatic half is finished by plans 01-03; this plan owns the human half and must therefore NOT be executed autonomously.

**The contradiction this plan exists to surface (RESEARCH R1 / OQ-1).** REV-23b's acceptance says "touch drag, behind-cards visible, centered, depth shadows". The verified phase-10 contract (REV-20, shipped and pinned) says `drag={isFront && !reducedMotion ? 'x' : false}` — i.e. reduced motion **disables drag**, and `useReducedMotion()` reads the real OS state synchronously on the first client render. On a phone with Reduce Motion ON, REV-23b's touch-drag clause fails **by design**. RESEARCH flags this as the likeliest explanation of the user's original "swipe stack dead on touch" report (the wizard has no drag; the stack has exactly one way to be dead that is invisible from the desktop — the OS setting). Both cannot be true, this is a user-owned choice that changes a locked requirement, and it must be decided before the swipe items are read as a pass or a fail.

**Why the sweep renewal is here and not in plans 01-03.** The sweep's mobile rows are structural greps on `explore-panels.tsx`, `explore-shell.tsx` and `explore-intro.tsx` — all three files stay byte-identical this phase, so its existing rows do NOT break; they need EXTENDING with the arc's new `<md` facts. Because the new rows assert the final post-parity DOM (`h-[200px]`, no `hidden md:flex`, the single viewport tag), they are green only after plans 01-03 land — which is exactly this wave's position.
</objective>

<pre_execute_precondition>
**Ask this BEFORE any executor runs plan 01 — the phase's acceptance is unknowable until it is answered.** RESEARCH OQ-1 is closed on the researcher's own recommended POLICY (default option (a), below), but the SETTING'S VALUE is a user-owned fact no artefact can derive. Put it to the user first: "On the phone you test with, is **Settings → Accessibility → Motion → Reduce Motion** ON?" (10 seconds.)

The ask itself is carried at WAVE 1 by plan 01's `<pre_execute_precondition>` (the same question and the same two branches) so no executor runs before it is answered; this block is its record-keeping twin, and Task 2 below consumes the answer.

- **DEFAULT (option (a), the recommended reading):** no code change. REV-23b's parity claim is a **width** contract; REV-20's reduced-motion contract is orthogonal and intentionally trades the gesture away. Record the setting's value plus the precondition in `EXPLORE-13-MOBILE-CHECKLIST.md`.
- **If ON and the user explicitly grants option (b):** Task 2's amendment branch applies — keep `drag` enabled at every motion preference, route the release through the EXISTING reduced-motion instant path, renew the phase-10 RM pins deliberately, and record the scope amendment. Never start (b) without the grant.

Either way the answer is written into the checklist BEFORE the swipe items are read as PASS or FAIL, because on a phone with Reduce Motion ON item 6 fails **by design** (`projects-stack-stage.tsx:581`, `drag={isFront && !reducedMotion ? 'x' : false}`, pinned by `tests/projects-stack.test.mjs`) and is not a parity defect. This is the phase's headline defect; surfacing it before execute is what stops it being discovered after.
</pre_execute_precondition>

<assumption_delta_decision>
- **Primary noun:** the promoted every-width contract; this plan is its acceptance surface.
- **Decision:** **promote** (consistent with plans 01-03): the sweep rows are renewed to assert the PARITY contracts (base unprefixed arc box, one stack, one viewport tag), not the retired `<md` simplifications.
- **Accepted debt:** none. The one accepted side effect (root-level `viewport-fit=cover` also reaching `/cli` + `/resume`) is carried as checklist item 9 — documented, verified on the phone, not fixed here.
</assumption_delta_decision>

<context>
Read before editing:
- @tests/explore-sweep.test.mjs:38-48 (the panels-grid row), :98-118 (the `md:`-prefix row — stays green, do NOT touch), :128-145 (the `grid-cols-1` and shell-overflow rows), :218-241 (the intro-strip and CLI rows), :375-450 (the export rows E-6…E-9 and the `exportText()`/`exportRaw()` helpers)
- @tests/explore-visuals.test.mjs:186-195 (the `clientBodies` list that must now read three paths)
- @.planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-mobile-parity-revision-UI-SPEC.md §9.1 (the sweep renewal intent), §9.2 (rows 1-11, the phase's own acceptance), §9.3 (the gate order), §10 (the 11 phone items — quoted item-for-item into the checklist)
- @.planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-mobile-parity-revision-RESEARCH.md (§3 R1, and Open Questions OQ-1 — which reads `(RESOLVED — default policy (a) + a pre-execute precondition)`: the POLICY is closed, the SETTING'S VALUE is the user-owned fact this plan captures; §5 the instrument inventory — no browser automation exists in this repo, so every responsive/touch claim is provable only by source greps, pure-function rows, built-export assertions, or the real phone)
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Renew the sweep rows, add the phase's export rows, and write the phone checklist artefact</name>
    <files>tests/explore-sweep.test.mjs, .planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-MOBILE-CHECKLIST.md</files>
    <read_first>tests/explore-sweep.test.mjs:38-48, 98-118, 128-145, 218-241, 375-450, src/components/explore/sections/experience-section.tsx:130-140, src/app/globals.css (the appended pack at the tail), src/app/layout.tsx:55-66, .planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-mobile-parity-revision-UI-SPEC.md §9.2 and §10</read_first>
    <action>
    **A. Renew the sweep's mobile rows (extend, do not break).** `tests/explore-sweep.test.mjs:98-118`'s `md:`-prefix row stays GREEN UNTOUCHED — `explore-panels.tsx` was deliberately not modified (the 300vh sticky range stays md-only; UI-SPEC §1.2 line 62 and §11), so do not soften or re-derive that row. The rows at `:41`, `:131`, `:139` and `:223` also stay green; re-run them rather than editing them. ADD one new row named `'sweep rows EXPLORE@375 (P): the arc zone renders at the base width — no hidden gate, base 200px box, base flex column'` asserting against `src/components/explore/sections/experience-section.tsx`: no `hidden md:flex`; `relative h-[200px]`; the base container mode `flex flex-col gap-4 md:grid`; the controls (`aria-label="Previous role"` and `aria-label="Next role"`) present in source; and the `md:hidden` year chip still present (the compact-form marker row survives, so the five entries remain readable in the stacked layout).

    **B. Add the phase's export rows.** `tests/explore-sweep.test.mjs:375-450` already owns the `exportText()`/`exportRaw()` helpers and guards every export row with an `existsSync(join(root, 'out/index.html'))` check whose message says to run `npm run build` first — follow that shape exactly. Add one row named `'sweep E-10 (E, phase 13): the built export carries the mobile-parity contract — one viewport meta, no avatar, the base arc box'`:
    - Read `out/index.html` as raw text. Assert `(html.match(/<meta name="viewport"/g) || []).length === 1` (exactly one declaration — the pre-phase baseline emitted TWO, verified: the data-file line plus Next's default). Assert `html.includes('viewport-fit=cover')`. Assert `!html.includes('shrink-to-fit')`. Assert `!/user-scalable|maximum-scale/.test(html)` (zoom is never disabled).
    - Assert the avatar is gone from the export, DERIVED from the data file rather than restating the literal: read `src/data/portfolio-main-data.json`, take `const avatarUrl = data.about.profileImageUrl` and `const avatarAlt = 'Portrait of ' + data.about.name`, then assert `!html.includes('src="' + avatarUrl + '"')` (no img tag carries that src) and `!html.includes(avatarAlt)` (the alt is gone from both the tag and its RSC flight-payload copy — the two `Portrait of` occurrences in today's export both come from this one element). Do NOT ban the bare URL or the bare substring `tinyurl`: the export legitimately carries `5cfm72u7` 8× as head metadata (`og:image`, `twitter:image`, the JSON-LD `image`, plus their flight-payload copies) and the Credentials panel renders the data file's article links, several of which are `tinyurl.com` hrefs — either bare ban is permanently red.
    - Assert the arc's base box is in the SSR markup: `html.includes('h-[200px]')` (Tailwind emits the class verbatim) and `!html.includes('hidden md:flex')`.
    - Assert the swipe-stage touch contract is COMPLETE in the final tree — BOTH halves in this one row, because no other row can see them together: `html.includes('data-projects-swipe-stage')` (plan 02's attribute survives into the export — client-component data attributes do render there, `data-timeline-dot` appears 5× today and is the proven precedent) AND `read('src/app/globals.css')` contains a `[data-projects-swipe-stage]` rule carrying `touch-action: pan-y` (plan 03's only consumer of that attribute). This pins the declared 02 → 03 temporal coupling at the phase level: with plan 02 deliberately asserting only the ABSENCE of `touch-action: none`, a slipped wave order or a dropped plan 03 would otherwise delete the touch contract with no failing test.
    - Assert the two theme-colour metas survive, TAG-SCOPED: `(html.match(/<meta name="theme-color"/g) || []).length === 2` — the viewport export's `themeColor` array must not have been collateral damage of the migration. Count the TAG, never the bare string: the current export contains FOUR `theme-color` occurrences (two real `<meta name="theme-color">` tags plus two `self.__next_f.push` flight-payload copies, which serialize as `[\"$\",\"meta\"…` and so cannot match the tag-scoped pattern), so a bare-string `=== 2` could never go green and the executor would silently weaken it to `>= 2`.
    - Assert the SSR layer invariants are untouched (they are the reason the layer gate is a RUNTIME gate): `(raw.match(/visibility:hidden/g) || []).length >= 4` and the arc path `M 100 0 A 100 100 0 0 0 100 200` is present.

    **C. Write the checklist artefact** `.planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-MOBILE-CHECKLIST.md`. Quote UI-SPEC §10's 11 items VERBATIM (they are the user-owned bar — do not paraphrase them into weaker statements), each with a result slot. Prepend, as item 0 / a precondition block, the Reduce-Motion precondition RESEARCH R1 identifies and the UI-SPEC §10 preamble currently LACKS:
    - "**Precondition for items 6 and 7 (swipe): check Settings → Accessibility → Motion → Reduce Motion.** The stack's drag is disabled by design under reduced motion (REV-20's verified contract: `drag={isFront && !reducedMotion ? 'x' : false}`). On a phone with Reduce Motion ON, item 6 fails by design and is NOT a parity defect. State the setting's value before reading the swipe items."
    Structure the file with: a premise block (device, OS, build served, both themes, RM on/off) and a results block (item → PASS/FAIL → verbatim observation). State explicitly that FAILURES must be recorded verbatim rather than smoothed over, and that any resulting fix or doc write reopens the gate.

    Then run the gate: `npm run typecheck && npm test && npm run build && node --test tests/explore-sweep.test.mjs; echo "exit=$?"` — all 14 suites green on the freshly built export.
    </action>
    <verify>`npm run typecheck && npm test && npm run build` exits 0 with all 14 suites green, and the new export row passes against the freshly built `out/index.html`.</verify>
    <acceptance_criteria>
      - `npm run typecheck && npm test && npm run build` all exit 0 with all 14 suites green.
      - The new export row is non-vacuous and its delta is on record: before the fix, capture the PRE-PHASE counts straight from the current `out/index.html` — 2 `<meta name="viewport"` matches, 4 bare `theme-color` strings, 0 `viewport-fit=cover` — and record them in SUMMARY.md beside the post-fix counts (1 / 2 tag-scoped / 1). The `=== 1` viewport assertion IS the falsifier: it is red on today's two-tag export and green only after the typed-viewport migration, so no tree mutation and no dirty tree is needed to prove the row can fail. Do not leave an uncommitted edit behind while sanity-checking it.
      - The `md:`-prefix row at `:98-118` is UNCHANGED (`git diff tests/explore-sweep.test.mjs` shows no edit inside it) — `explore-panels.tsx` stayed untouched by design.
      - The checklist artefact exists and quotes all 11 items: `grep -c '^### Item\|^- \[ \]' .planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-MOBILE-CHECKLIST.md` is ≥ 11, and it contains the Reduce-Motion precondition naming `Reduce Motion` and `REV-20`.
      - The avatar assertion is scoped: the new row contains no bare-substring `tinyurl` ban in the export.
      - `git show --stat HEAD` lists exactly the two files — commit as `test(phase-13): renew the mobile sweep rows and add the parity export row (+ the phone checklist)`.
    </acceptance_criteria>
    <done>The sweep asserts the parity contract and the built export, the checklist artefact carries all 11 user-owned items plus the Reduce-Motion precondition, and the full suite is green on a freshly built export.</done>
  </task>

  <task type="checkpoint:decision">
    <name>Task 2: Decide the Reduce-Motion contract for the swipe parity claim (OQ-1)</name>
    <files>.planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-MOBILE-CHECKLIST.md</files>
    <read_first>src/components/explore/sections/projects-stack-stage.tsx:575-615 (the drag line and the mount gate), node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs and node_modules/motion-dom/dist/es/render/utils/reduced-motion/index.mjs (the synchronous OS read that makes this real), tests/projects-stack.test.mjs (the phase-10 RM pins: the R5/R12 rows asserting drag is off under reduced motion), .planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-mobile-parity-revision-RESEARCH.md §3 R1 and Open Questions OQ-1 (status on disk: `(RESOLVED — default policy (a) + a pre-execute precondition)` — the policy is settled, only the setting's VALUE is put to the user here)</read_first>
    <action>
    PUT THIS QUESTION TO THE USER AND WAIT. Do not guess, do not silently implement either branch, and do not weaken either locked requirement on your own authority.

    Ask exactly this, with the evidence attached:
    1. "On the phone you test with, is **Settings → Accessibility → Motion → Reduce Motion** ON?" (10 seconds to check.)
    2. State the consequence plainly: if it is ON, item 6 ("touch drag swipes the card away") FAILS BY DESIGN — the stack deliberately disables `drag` under reduced motion (`projects-stack-stage.tsx:581`, `drag={isFront && !reducedMotion ? 'x' : false}`), and that behaviour is a VERIFIED phase-10 requirement (REV-20), pinned by `tests/projects-stack.test.mjs`. `useReducedMotion()` reads the real OS state synchronously on the first client render, so this is the live OS setting, not a stale default.

    Then record whichever answer the user gives:
    - **If OFF (the recommended default reading):** no code change. REV-23b's parity claim is a **width** contract; REV-20's reduced-motion contract is orthogonal and intentionally trades the gesture away. Record the precondition + the answer in the checklist artefact's premise block so the swipe items are read in context.
    - **If ON, and the user chooses "test with it off" (option a):** same as above — record the precondition, change no code.
    - **If ON, and the user explicitly grants amending REV-20 (option b):** keep `drag` enabled at every motion preference and route the drag release through the EXISTING reduced-motion branch (`cycle()`'s instant `handleSwipe(step.ringDelta)` path around `projects-stack-stage.tsx:641-648`) instead of the 220ms fly-off, so reduced motion degrades the ANIMATION rather than the gesture. This edits a requirement verified in a closed phase, so it requires an explicit grant, it must renew the phase-10 RM pins in `tests/projects-stack.test.mjs` deliberately, and it must be recorded as a scope amendment in the checklist artefact and SUMMARY.md. Do not start this branch without that grant.

    Write the decision (the setting's value, the option chosen, and the rationale) into the checklist artefact. If the answer is option (b), that write is an implementation change: complete it, renew the pins, and re-run the gate as the last action.
    </action>
    <verify>`grep -c 'Reduce Motion' .planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-MOBILE-CHECKLIST.md` is ≥ 2 and the artefact records the setting's value plus the chosen option. If option (b) was granted: `npm run typecheck && npm test && npm run build` exits 0 with the RM pins renewed.</verify>
    <acceptance_criteria>
      - The question was actually put to the user and the answer recorded — the checklist artefact states the phone's Reduce-Motion setting and the option chosen. An unanswered question blocks this task; it is not satisfiable by inference.
      - The default branch changes no code: unless option (b) was explicitly granted, `git show --stat HEAD` for this task lists only the checklist artefact.
      - If option (b) was granted, the change is confined to the reduced-motion drag path and its renewed pins, and the full gate is green — with the renewed RM rows naming the amendment's rationale, never a deleted assertion.
      - No locked requirement is weakened silently: if the answer leaves REV-23b's touch-drag clause conditional on the OS setting, that conditionality is written down in the artefact (this is the accepted, documented reading — not a defect discovered later).
      - Commit as `docs(phase-13): record the Reduce-Motion precondition for the swipe parity claim`.
    </acceptance_criteria>
    <done>The Reduce-Motion question is answered by the user, its consequence for REV-23b is written down rather than silently assumed, and either no code changed (default) or the granted amendment landed with renewed pins and a green gate.</done>
  </task>

  <task type="checkpoint:human-verify">
    <name>Task 3: Walk the 11-item phone checklist and close the gate chronologically last</name>
    <files>.planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-MOBILE-CHECKLIST.md</files>
    <read_first>.planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-MOBILE-CHECKLIST.md (the artefact written in Task 1, with the Task 2 precondition recorded), .planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-mobile-parity-revision-UI-SPEC.md §10 (the item list) and §7 (the edge matrix each item maps to)</read_first>
    <action>
    HAND THE CHECKLIST TO THE USER and record what the phone actually shows. This task is a human-verify checkpoint: the agent cannot observe the phone (RESEARCH §5 — this repo has NO browser automation, no jsdom, no Playwright; every responsive and touch claim is provable only by source greps, pure-function rows, built-export assertions, or the real device).

    Instruct the user to walk all 11 items on the checklist in portrait on the real device, with both themes, and with the Task 2 Reduce-Motion precondition in hand for items 6-7. Record each item's PASS/FAIL and the user's **verbatim** observation into the artefact — especially the four items that carry this phase's whole premise:
    - item 2: no gap below the footer at rest, while the URL bar hides/shows, and after scrolling to the bottom;
    - item 3: exactly one scrollbar — no window scrollbar and no horizontal scrollbar anywhere (test at the arc, at the Projects stack, mid-swipe);
    - item 4: the semicircle renders above the content scaled to the phone, the five year labels readable and never truncated/overlapping, the active year at the left-bulge focal point;
    - item 6: the full stack — touch drag, behind-card peek, centred, depth/bloom shadows, counter and both controls (read in the light of the Reduce-Motion precondition).
    Also capture item 5's embedded question (UI-SPEC RESOLVED-D1): is the five-entry readable stack right, or does the user want one entry at a time with the arc driving it? That answer is a design decision for a possible follow-up, not a fix in this phase.

    For any FAIL: do not smooth it over. Record it verbatim, classify it (parity defect vs accepted side effect vs precondition artifact), and if it needs a code fix, state that the fix requires a NEW plan (this phase's plans are complete; a post-verification fix belongs in gap-closure planning) — do not silently reopen plan 01-03 edits.

    THEN, as the literal last action of this plan and the phase's execution: re-run the full gate so the green run covers the final workspace state (D-07 / UI-SPEC §9.3) — the checklist write itself reopens the gate. Run `npm run typecheck && npm test && npm run build && node --test tests/explore-sweep.test.mjs; echo "exit=$?"` and record the exit code and the suite summary in SUMMARY.md. Write SUMMARY.md's BODY — including its nyquist obligation section, which must name `gsd_validate_phase` as required after `gsd_verify` and before `gsd_ship` (see <verification_gate>) — BEFORE that final gate run; then run the gate, append the recorded exit code, and re-run the gate once more so the passing run is chronologically last over the final tree (a doc write after a green run reopens it, SUMMARY.md included).
    </action>
    <verify>`npm run typecheck && npm test && npm run build && node --test tests/explore-sweep.test.mjs; echo "exit=$?"` — exits 0 with all 14 suites green, run AFTER the last checklist write (this ordering is the requirement, not the command).</verify>
    <acceptance_criteria>
      - The artefact records a result for every one of the 11 items, with the user's verbatim observations (not summaries) for items 2, 3, 4 and 6.
      - Failures (if any) are recorded verbatim and classified; no failing item is marked PASS and no observation is invented. If the agent did not receive an observation for an item, that item is recorded as NOT RUN rather than assumed.
      - The gate is the LAST action: the recorded green run's timestamp is after the artefact's final write, and SUMMARY.md states that the run covered the final workspace state.
      - SUMMARY.md records the nyquist obligation explicitly, as its own named section: it names `gsd_validate_phase 13` as required AFTER `gsd_verify 13` and BEFORE `gsd_ship 13`, and states that no planning-time `EXPLORE-13-mobile-parity-revision-VALIDATION.md` is written (the loop's validate step emits it). Assert with `grep -c 'gsd_validate_phase' SUMMARY.md` ≥ 1 — a description of the convention in the abstract does not satisfy this, and neither does an implicit assumption that the loop will do it.
      - `git show --stat HEAD` lists the checklist artefact (plus any renewal the phone test forced) — commit as `docs(phase-13): record the real-hardware phone checklist results`.
    </acceptance_criteria>
    <done>Every item has a real recorded observation from the phone, the Reduce-Motion precondition is honoured when reading the swipe items, any failure is captured rather than hidden, and the full suite plus build is green as the chronologically last action over the final tree.</done>
  </task>
</tasks>

<verification_gate>
This plan IS the phase's verification surface. Final order (D-07):
1. `npm run typecheck` → 2. `npm test` (all 14 suites) → 3. `npm run build` → 4. the export rows (which read the freshly built `out/`) → 5. the phone checklist → 6. the FULL gate re-run last.

Any write after a green run — including this checklist's own record — reopens the gate. Nothing in this plan may be reported as verified on the strength of a green programmatic run alone: the visual and touch claims are the user's to confirm.

**Nyquist / validation-window coverage (`.planning/config.json` sets `nyquist_validation: true`).** No `<NN>-VALIDATION.md` exists for this phase, nor for any of the 12 prior phases — verified on disk: `find .planning -name "*VALIDATION*"` returns nothing. The artefact is emitted at the loop's `validate` step, not at planning time, and planning will not fabricate one. Window coverage is therefore recorded HERE, per task, and it is complete — no 3-consecutive-task window lacks an automated instrument:

| Window | Plans / tasks | Automated instrument |
|---|---|---|
| 1 | 01 T1–T3 | T1 `node --test tests/explore-visuals.test.mjs tests/explore-timeline.test.mjs` (must be RED); T2 `npm run typecheck && npm run build && node --test …`; T3 `npm run typecheck && npm test && npm run build` |
| 2 | 02 T1–T2 | T1 `node --test tests/projects-stack.test.mjs tests/explore-visuals.test.mjs tests/explore-visuals-server.test.mjs` (must be RED); T2 `npm run typecheck && npm test && npm run build` |
| 3 | 03 T1–T3 | T1 `npm run build && node --test tests/route-swap.test.mjs tests/explore-visuals.test.mjs` (must be RED); T2 / T3 `npm run typecheck && npm test && npm run build` + the `out/index.html` tag counts |
| 4 | 04 T1–T3 | T1 `npm run typecheck && npm test && npm run build && node --test tests/explore-sweep.test.mjs`; T2 `grep -c 'Reduce Motion' …CHECKLIST.md`; T3 the full gate re-run chronologically last |

Every task in all four plans carries its own runnable `<verify>`, so nothing is deferred to the milestone audit.

**MANDATORY LOOP OBLIGATION — the nyquist gate's closure, recorded rather than implicit.** Because no planning-time `EXPLORE-13-mobile-parity-revision-VALIDATION.md` is written, the gate is closed by the LOOP: `gsd_validate_phase 13` MUST run AFTER `gsd_verify 13` and BEFORE `gsd_ship 13`. This plan's `SUMMARY.md` must carry that obligation in its own named section, naming both commands (`gsd_validate_phase` and `gsd_ship`), rather than describing the convention in the abstract — a phase that reaches ship with neither a `<NN>-VALIDATION.md` nor that recorded obligation is a gate failure, not a documentation gap. The loop's own step order carries the enforcement (the available steps run `verify` → `validate` → `ship`, and `gsd_validate_phase` is what lands STATE on the `validate` step), so the SUMMARY record exists to make a skipped `validate` a visible omission rather than a silent one.
</verification_gate>
