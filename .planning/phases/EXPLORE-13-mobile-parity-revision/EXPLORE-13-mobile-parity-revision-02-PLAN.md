---
phase: 13-mobile-parity-revision
plan: 02
type: tdd
wave: 2
depends_on: ["EXPLORE-13-mobile-parity-revision-01"]
files_modified:
  - "src/components/explore/sections/projects-stack-stage.tsx"
  - "src/components/explore/sections/projects-section.tsx"
  - "src/components/explore/sections/projects-mobile-stack.tsx"
  - "tests/projects-stack.test.mjs"
  - "tests/explore-visuals.test.mjs"
  - "tests/explore-visuals-server.test.mjs"
autonomous: true
requirements: ["REV-23", "REV-23b"]
user_setup: []
must_haves:
  truths:
    - "A phone renders the SAME Projects stack as the desktop: touch drag swipes the foreground card away, the cards behind it peek visibly, the stack is centred, and the depth/bloom shadows render — one contract, no mobile variant."
    - "No simplified mobile stack exists anywhere in the tree: the wrapper file is gone, and nothing imports, renders, or names it."
    - "The base/unprefixed heights ARE the phone heights: the fixed limited-peek box is retired and the full peek band shows at <md."
    - "Only one value pair is width-specific — the stage and card box heights (420/690 base, 560/830 from md) — and both pairs satisfy `stage = card + 250 + 20`, so the depth peeks and the 500px fly-off cannot extend the layout at either width."
    - "The stage carries the stable `data-projects-swipe-stage` hook its `touch-action: pan-y` rule will target (the rule itself lands in plan 03 with the rest of the platform pack)."
  artifacts:
    - path: "src/components/explore/sections/projects-stack-stage.tsx"
      provides: "The single swipe-stack contract: no mode prop, two-tier height pair on the same constants, the swipe-stage hook attribute"
      min_lines: 690
      exports: ["ProjectsStackStage", "ProjectsSwipeStack"]
    - path: "src/components/explore/sections/projects-section.tsx"
      provides: "One unconditional stack render — no viewport branch"
      min_lines: 40
      exports: ["ProjectsSection"]
    - path: "src/components/explore/sections/projects-mobile-stack.tsx"
      provides: "RETIRED — must not exist (gone-check)"
      min_lines: 0
      exports: []
  key_links:
    - from: "src/components/explore/sections/projects-section.tsx"
      to: "src/components/explore/sections/projects-stack-stage.tsx"
      via: "one unconditional ProjectsStackStage render, no mode argument and no viewport wrapper"
      pattern: "<ProjectsStackStage projects=\\{cards\\} />"
    - from: "src/components/explore/sections/projects-stack-stage.tsx"
      to: "src/app/globals.css"
      via: "the data-projects-swipe-stage attribute is the selector hook for touch-action: pan-y (added in plan 03)"
      pattern: "data-projects-swipe-stage"
    - from: "tests/projects-stack.test.mjs"
      to: "src/components/explore/sections/projects-stack-stage.tsx"
      via: "the band arithmetic is read off the two class constants and asserted at both tiers"
      pattern: "PEEK_BAND_PX"
---

<objective>
Deliver REV-23b: the Projects swipe stack becomes ONE contract at every width. The 20-line `projects-mobile-stack.tsx` wrapper retires, `projects-section.tsx` renders a single unconditional `<ProjectsStackStage>`, the `mode`/`SwipeMode` plumbing and every `compact` branch leave the stage, and the two height constants become a base/md pair on the same arithmetic.

This is the second half of the phase's parity promise and the one the user reported as broken ("swipe stack dead on touch"). The wrapper is why it was broken-adjacent: it delegated to the same stack but with `mode="compact"`, which (a) capped the stage at `max-w-[320px]`, (b) hid every card deeper than depth 1 (`compactHidden`), and (c) pinned the base heights to the compact pair. Retiring the mode collapses all three into the full contract.

**What must NOT be verified here, and where it lands instead.** The touch CSS (`touch-action: pan-y` on the stage) belongs to the locked D-06 platform pack, which ships as one atomic change in plan 03 (UI-SPEC §3.5a pins every declaration to the `globals.css` tail, and RESEARCH R2 shows a misplaced declaration reddens two motion-region pins). This plan adds the `data-projects-swipe-stage` attribute the rule will target and asserts the ABSENCE of `touch-action: none`; the CSS pin itself is plan 03's.

**File count note for the checker:** 6 files — within the ≤10 heuristic. `explore-panels.tsx` is deliberately NOT in `files_modified`: the Projects placement map (`md:flex md:flex-col md:justify-center`, content-driven height, no sticky range) is pinned by `tests/projects-stack.test.mjs:549-560` and stays byte-identical, which is why `tests/explore-sweep.test.mjs:100-117`'s `md:`-prefix row stays green.
</objective>

<assumption_delta_decision>
- **Primary noun:** the single every-width swipe-stack contract (`ProjectsSwipeStack`, no mode).
- **Decision:** **promote.** The `mode` prop and the `<md` compact variant are deleted, not kept alongside a `full` default — D-02 states one contract at every width, and a surviving compact path is the debt being paid off.
- **Accepted debt:** none. The two-tier height pair is the promoted contract's input (a width-specific *value*, not a second code path), and its invariant is asserted at both tiers in Task 1.
</assumption_delta_decision>

<context>
Read before editing:
- @src/components/explore/sections/projects-mobile-stack.tsx (the whole 20-line file — it is deleted)
- @src/components/explore/sections/projects-section.tsx (the whole file: the imports 15-20, the two viewport branches 36-43)
- @src/components/explore/sections/projects-stack-stage.tsx (the mode type + height records 70-133, the props 451-470, the `SwipeCard` compact branches 480/508/527/560, the drag line 581, the centering 690-720, the stage box 707, the exports 749-753)
- @tests/projects-stack.test.mjs:455-600 (the `heightMap` helper, the two containment rows, the centering row, the window-scroll invariant)
- @tests/explore-visuals.test.mjs:183-195 (`clientBodies`), :286-296 (the zero-literal list), :340-372 (the `md:hidden` year chip — unaffected), :955-970 (the ProjectsSection rows), :1040-1055 (the mobile-stack rows), :1100-1152 (the requirement-citation rows)
- @tests/explore-visuals-server.test.mjs:138-166 (the tiles→stack→mobile-stack order row and the `target="_blank"` disjunction)
- @.planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-mobile-parity-revision-UI-SPEC.md (§1.3, §3.2, §7 E5-E7, §9.1 rows for the three suites, §9.2 rows 3-4, §11)
</context>

<tasks>
  <task type="test">
    <name>Task 1: RED — renew the retired-mode pins and add the one-contract assertions</name>
    <files>tests/projects-stack.test.mjs, tests/explore-visuals.test.mjs, tests/explore-visuals-server.test.mjs</files>
    <read_first>tests/projects-stack.test.mjs:455-600 (every row named below, read in full before rewriting), tests/explore-visuals.test.mjs:183-195, 286-296, 955-970, 1040-1055, 1100-1152, tests/explore-visuals-server.test.mjs:138-166, src/components/explore/sections/projects-stack-stage.tsx:70-133 and 690-753, src/components/explore/sections/projects-section.tsx:19 and 36-43, .planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-mobile-parity-revision-UI-SPEC.md §9.1 (the renewal table) and §9.2 (rows 3-4)</read_first>
    <action>
    Renew every pin that encodes the retired `<md` simplification, and add the rows that encode the one-contract target. Each renewed row must FAIL on the current tree (that is the required red) and the retired-artefact rows must fail because the artefact still exists.

    **`tests/projects-stack.test.mjs` — the mode-keyed rows renew to a two-tier pair.** The `heightMap(source, constName)` helper extracts a `Record<'full'|'compact', string>` and asserts `assert.deepEqual(Object.keys(entries).sort(), ['compact', 'full'])`. Replace it with a positional reader that pulls the ONE class-string constant by name (e.g. `const m = src.match(new RegExp("const " + constName + " = '([^']+)'"))`) and returns its px values via the existing `heightPx` helper. Then rewrite the two containment rows:
    1. `'stage containment: the fixed stage height IS the arithmetic card + peek band + safe margin'` — keep the `PEEK_BAND_PX === 250` and `PEEK_SAFE_PX === 20` assertions verbatim (they are the named constants the arithmetic depends on, and they do not change). Replace the `for (const mode of ['full','compact'])` loop with a both-tiers assertion on the single pair: the card constant's px list is `[420, 560]` and the stage constant's is `[690, 830]` — `cardPx.length === stagePx.length`, and for each index `stagePx[i] === cardPx[i] + 250 + 20`. Assert the base (unprefixed, index 0) values are 420/690 and the `md:` (index 1) values are 560/830. Replace the retired `<md` invariant (`heightPx(stage.compact).length === 1` and `!/md:/.test(stage.compact)`) with its successor: the base height is the PHONE height and it is still unprefixed — i.e. the constant's first px value is the unprefixed one, asserted by matching the class string against `/^h-\[\d+px\] md:h-\[\d+px\]$/` so a stray `md:`-only form or a re-added mode Record cannot pass.
    2. Add a NEW row `'REV-23b: the mode plumbing is retired — no SwipeMode, no compact branch, no compact width cap'`: assert `tests/projects-stack.test.mjs`'s subject source contains NO `SwipeMode`, NO `'compact'`, NO `compactHidden`, NO `max-w-[320px]`, and NO `mode` prop on `ProjectsSwipeStack` or `SwipeCard`. Grep the source for the bare identifier `mode` is NOT acceptable (it collides with unrelated words) — assert the specific literals listed here, each with its own named failure message.
    3. Keep every row from `:512` onward structurally intact BUT re-read them for mode leakage: the `'${widthClass} ${stageHeightClass} overflow-hidden'` literal at `:515` pins two variable NAMES. Since the two-tier pair keeps one `stageHeightClass` and one `widthClass` (there is no second tier of variables, just a two-tier class STRING), assert the same literal unchanged — do NOT rename those variables in Task 2. The `:517-537` rows (bottom-anchored card box, no `inset: 0`, no negative margins/insets) stay green unmodified; re-run them rather than editing them.

    **`tests/explore-visuals.test.mjs` — drop the dead reads, add the gone-check.**
    4. `clientBodies` at `:186-189`: DELETE the `'src/components/explore/sections/projects-mobile-stack.tsx'` entry; keep the other three. This is load-bearing red-prevention, not tidiness: the file is deleted in Task 2, and any remaining `read`/`readFileSync` of it throws ENOENT and takes down unrelated rows with an INVALID red.
    5. The zero-literal exclusion list at `:291-293`: DELETE the mobile-stack path reference (dead path).
    6. The ProjectsSection row at `:960-964`: replace the three stale assertions (`ProjectsMobileStack` imported, `hidden md:block`, `md:hidden`) with the one-contract triple — the section contains exactly ONE `<ProjectsStackStage` occurrence and it is NOT inside a `hidden md:block` or `md:hidden` wrapper; the section contains no `ProjectsMobileStack`; and the section's doc comment still cites REV-23/REV-23b. Count the `<ProjectsStackStage` occurrences and assert `=== 1` — a `>= 1` check cannot detect a surviving second branch.
    7. The rows at `:1047-1051`: replace the three "file exists / no framer-motion / delegates" assertions with the RETIREMENT gone-check. KEEP the existing `const mobilePath = 'src/components/explore/sections/projects-mobile-stack.tsx';` at `:1047` and pass it to the assertion rather than inlining a second literal — `assert.equal(existsSync(join(root, mobilePath)), false, 'projects-mobile-stack.tsx retired with the parity contract (REV-23b)')` — and delete the `codeOf(mobilePath)` read at `:1049` together with its two assertions (`:1050-1051`), because that read would throw ENOENT once Task 2 deletes the file. Precede the gone-check with a comment naming the phase-10/11 house precedent (the deleted-editorial retirement loop at `tests/explore-visuals.test.mjs:941-947`) so a future reader sees the gone-check is the discipline, not an accident. Keeping the const is deliberate: it makes the file's remaining `projects-mobile-stack` occurrences exactly 2 (this const plus the message below), which is the count the acceptance criterion pins.
    8. The requirement-citation rows at `:1111-1149`: they currently `read` the mobile-stack source to check its REV-18/REV-21 citation clauses. Because that read would throw ENOENT, remove that surface from the four-way list and keep the three surviving clauses BYTE-IDENTICAL — in particular `projects-section.tsx` must still cite **REV-18 ≥ 1**: the phase-10 pin at `tests/explore-visuals.test.mjs:1145-1150` (clause 2) is RETAINED, never substituted. Then ADD, as its own new assertion beside the retained one, that `projects-section.tsx` ALSO cites REV-23b (`assert.ok((sectionFile.match(/REV-23b/g) || []).length >= 1)`) — the parity contract's citation is an addition to the existing phase-10 citation, so the two clauses coexist and a substitution reddens a retained row.
    9. Add ONE new row `'REV-23b swipe-stage contract: the stage carries the stable hook and no touch-action: none exists in the shell CSS'`: assert `projects-stack-stage.tsx` contains `data-projects-swipe-stage`, and that `src/app/globals.css` contains no `touch-action: none` (the explicitly rejected form — `touch-action: none` on the stage or a card kills vertical page scroll, the "carousel scrolls the wrong way" symptom). The POSITIVE `touch-action: pan-y` assertion for that hook belongs to plan 03's pack and must NOT be added here.

    **`tests/explore-visuals-server.test.mjs` — the composed-order and link rows.**
    10. Row at `:143-147`: it asserts `mobileIdx !== -1` and `tilesIdx < stageIdx < mobileIdx`. Renew to: `<ProjectStatTiles` present, exactly one `<ProjectsStackStage`, `<ProjectsMobileStack` absent, tiles before the stage, and the `mb-3` tiles wrapper retained.
    11. Row at `:160-163`: it asserts `stackSrc.includes('target="_blank"') || mobileSrc.includes('target="_blank"')`. The mobile read would ENOENT; assert it in the stage source ONLY — keep it a REAL assertion on a source that exists, never a tautology or a removed clause. The same edit must drop the `const mobileSrc = read(...)` line at `:160`.

    Then RUN the three suites and capture the raw output verbatim: `node --test tests/projects-stack.test.mjs tests/explore-visuals.test.mjs tests/explore-visuals-server.test.mjs; echo "exit=$?"`. It must FAIL. Record the output in SUMMARY.md.
    </action>
    <verify>`node --test tests/projects-stack.test.mjs tests/explore-visuals.test.mjs tests/explore-visuals-server.test.mjs; echo "exit=$?"` — expected NON-ZERO (the required RED).</verify>
    <acceptance_criteria>
      - All three suites FAIL (non-zero exit) and the raw output is recorded verbatim in SUMMARY.md.
      - The failure causes are the missing behaviour, not a broken test: the output must include the gone-check failure (the wrapper file still exists), the `SwipeMode`/`compact`/`max-w-[320px]` still-present failures, the `=== 1` single-render failure (two renders exist today), and the two-tier arithmetic failure. A `SyntaxError`, a `Cannot find module`, or an unguarded raw `ENOENT` counts as an INVALID red and must be fixed before proceeding.
      - No remaining READ of the retired wrapper path in any test file — assert the SHAPE, not a line count. `grep -c "read('.*projects-mobile-stack" tests/explore-visuals.test.mjs tests/explore-visuals-server.test.mjs` prints 0 for each file (the same for the `readFileSync(` form — both are 0 today under that shape only because `explore-visuals.test.mjs:1111` uses `read(` and `explore-visuals-server.test.mjs:160` uses `read(`, and both are removed by this task; `grep` exits 1 on a zero count, so assert the printed count, not grep's exit code). This is the criterion's whole purpose: the file is deleted in Task 2, so a surviving read throws ENOENT and takes down unrelated rows with an INVALID red. A residual path LITERAL in the gone-check is expected and is NOT a defect: after this task `grep -c 'projects-mobile-stack' tests/explore-visuals.test.mjs` is 2 (the retained `const mobilePath` at `:1047` feeding the gone-check, plus the gone-check's own message), which is exactly why the criterion is stated against the read shape — a bare-path line count of 1 would be unsatisfiable without inlining a literal the plan never asks for. `grep -c 'projects-mobile-stack' tests/explore-visuals-server.test.mjs` prints 0.
      - The gone-check is an equality on existence, in the house's stale-test-retirement form (the precedent is the deleted-editorial loop at `tests/explore-visuals.test.mjs:941-947`): ≥ 1 `assert.equal(existsSync(join(root, mobilePath)), false, …)` whose message contains `projects-mobile-stack.tsx retired`, so the assertion is `=== false` and cannot pass on a surviving file.
      - The gone-check exists and is an equality: `grep -c "projects-mobile-stack.tsx retired" tests/explore-visuals.test.mjs` ≥ 1 and the row asserts `=== false`/`existsSync(...), false`.
      - The mode ban is literal-specific, not identifier-wide: the new row names `SwipeMode`, `compactHidden` and `max-w-[320px]` in its assertions, and the bare word `mode` appears in a negative assertion nowhere in the file.
      - `git show --stat HEAD` lists exactly the three test files — commit as `test(phase-13): renew the retired-mode pins and add the swipe-stack one-contract rows`.
    </acceptance_criteria>
    <done>A committed, runnable set of assertions that currently fails for the right reasons: the gone-check reddens on the surviving wrapper, the mode bans redden on the surviving plumbing, the single-render row reddens on the two branches, and no test read points at a file that Task 2 deletes.</done>
  </task>

  <task type="feat">
    <name>Task 2: GREEN — delete the mobile wrapper, render one stack, retire the mode and ship the two-tier heights</name>
    <files>src/components/explore/sections/projects-mobile-stack.tsx, src/components/explore/sections/projects-section.tsx, src/components/explore/sections/projects-stack-stage.tsx</files>
    <read_first>src/components/explore/sections/projects-section.tsx (the whole file), src/components/explore/sections/projects-stack-stage.tsx:60-135, 445-475, 476-600, 688-753, tests/projects-stack.test.mjs (the Task 1 rows this task must turn green), .planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-mobile-parity-revision-UI-SPEC.md §1.3, §3.2a-b, §3.2e</read_first>
    <action>
    Make the three suites green with one atomic retirement.

    1. DELETE `src/components/explore/sections/projects-mobile-stack.tsx` (`git rm`). The whole file goes — it was a wrapper whose only content was `mode="compact"`.
    2. `src/components/explore/sections/projects-section.tsx`: delete the `import { ProjectsMobileStack } from './projects-mobile-stack';` line (line 19) and replace the two viewport branches (lines 36-43: the `hidden md:block` wrapper around `<ProjectsStackStage projects={cards} />` and the `md:hidden` wrapper around `<ProjectsMobileStack projects={cards} />`, with both comments) with ONE unconditional `<ProjectsStackStage projects={cards} />`. Renew the two comments to state the one-contract fact (the same stack renders at every width) rather than the retired per-viewport split, and cite REV-23b there — while RETAINING the existing `REV-18` citation on line 2. `tests/explore-visuals.test.mjs:1145-1150` clause 2 still requires `projects-section.tsx` to cite REV-18 at least once, so this is REV-18 **plus** REV-23b: the renewal ADDS the new id and never substitutes it, or a retained phase-10 row reddens. Keep `ProjectStatTiles` before it with its `mb-3` wrapper and keep `<TerminalPointer command="projects --all" />` after it — both are pinned and unchanged.
    3. `src/components/explore/sections/projects-stack-stage.tsx` — retire the mode:
       (a) Delete the `type SwipeMode = 'full' | 'compact';` declaration (line 70).
       (b) Replace the two mode-keyed Records with the single two-tier pair on the same constants and the same arithmetic: the card constant becomes the class string `h-[420px] md:h-[560px]` and the stage constant becomes `h-[690px] md:h-[830px]` — base tier = the phone (420/690), `md:` tier = desktop (560/830), both satisfying `card + PEEK_BAND_PX + PEEK_SAFE_PX`. Do NOT delete or rename `PEEK_BAND_PX`/`PEEK_SAFE_PX` (the suite asserts them as named constants). Rename the two constants to reflect that they are no longer Records (e.g. drop any `Record<...>` annotation) but KEEP the variable names `stageHeightClass`/`widthClass` at the use sites: `tests/projects-stack.test.mjs:515` pins the literal template `'${widthClass} ${stageHeightClass} overflow-hidden'`. The current `full` mode's unprefixed `h-[520px]`/`h-[790px]` values retire with the mode (they were unreachable below md anyway, since the section wrapped the stack in `hidden md:block`).
       (c) Delete every `mode` prop: the `SwipeCardProps.mode` field and its destructure (451-468), the `ProjectsSwipeStackProps.mode` field (597), `ProjectsSwipeStack({ projects, mode })` (601), the `mode={mode}` passing at 715, and the `compactHidden` computations at 480, 508, 527, 560 together with their uses in the card's `hidden`/`nextHidden` expressions and the dependency arrays that list `mode`. The card's visibility now comes solely from the depth/ring derivation (`cardState`, `ringDepth`) — every depth is visible, which is the parity requirement.
       (d) `widthClass` (line 695) becomes the single `max-w-[540px]`; the `max-w-[320px]` compact cap is deleted.
       (e) `ProjectsStackStage` (line 751) becomes `return <ProjectsSwipeStack projects={projects} />;` and its doc comment stops saying "md+ full-mode".
       (f) The stage box (line 707) gains the stable hook attribute so the plan-03 CSS can target it: add `data-projects-swipe-stage="true"` to the div that already carries the `relative mx-auto w-full ${widthClass} ${stageHeightClass} overflow-hidden` class string. Add NOTHING else to that element — no `touch-action` utility (plan 03 owns the CSS), no negative margin, no inset (all pinned).
       (g) Delete the now-stale doc-comment prose that describes the compact mode (the file header and any `SwipeMode`/compact references), and renew the header to state the one-contract fact with the REV-23b citation. Comments are load-bearing in this repo's greps.
       Leave the drag choreography, the ring buffer, `PROMOTE_TRANSITION`, `EXIT_X`/`EXIT_ROTATION`, the 500ms announcement throttle, `aria-live`, `role="group"`, `aria-label="Projects carousel"`, the bottom-anchored card box, per-card `aria-hidden` on non-front cards, the active-card bloom (`--panel-shadow-hover`) and its `overflow-visible` on the front card, and both 44px control buttons BYTE-IDENTICAL.

    Then run the full gate: `npm run typecheck && npm test && npm run build; echo "exit=$?"` — all 14 suites green, including the three renewed ones.
    </action>
    <verify>`npm run typecheck && npm test && npm run build` — exits 0 with all 14 suites green.</verify>
    <acceptance_criteria>
      - `npm run typecheck && npm test && npm run build` all exit 0 with all 14 suites green.
      - The wrapper is gone: `test -f src/components/explore/sections/projects-mobile-stack.tsx` fails (non-zero exit) and `grep -rc 'ProjectsMobileStack\|projects-mobile-stack' src/` prints 0 for every file (grep exits 1 on a zero count — assert the printed counts).
      - The single render holds: `grep -c '<ProjectsStackStage' src/components/explore/sections/projects-section.tsx` is 1, and `grep -c 'hidden md:block\|md:hidden' src/components/explore/sections/projects-section.tsx` prints 0.
      - The mode plumbing is gone from the stage: `grep -c 'SwipeMode\|compactHidden\|max-w-\[320px\]' src/components/explore/sections/projects-stack-stage.tsx` prints 0 (assert the printed count, not grep's exit code).
      - The two-tier pair is exact and satisfies the arithmetic: the stage constant reads `h-[690px] md:h-[830px]` and the card constant `h-[420px] md:h-[560px]` — `grep -c 'h-\[690px\] md:h-\[830px\]' src/components/explore/sections/projects-stack-stage.tsx` is 1 and `grep -c 'h-\[420px\] md:h-\[560px\]' src/components/explore/sections/projects-stack-stage.tsx` is 1.
      - The template literal at the stage box is preserved: `grep -c '\${widthClass} \${stageHeightClass} overflow-hidden' src/components/explore/sections/projects-stack-stage.tsx` is 1, and the same element carries `data-projects-swipe-stage`.
      - The stage stays centred and adds no document scroll: `node --test tests/projects-stack.test.mjs` passes (the centering row at `:549` and the window-scroll invariant at `:570` are unchanged and green).
      - `git show --stat HEAD` lists exactly the three implementation files (one deletion, two edits) — commit as `feat(phase-13): one swipe-stack contract at every width (REV-23b)`.
    </acceptance_criteria>
    <done>One unconditional swipe stack renders at every width with all depth cards visible and centred, the mobile wrapper and the entire mode plumbing are gone, both height tiers satisfy the band arithmetic, and the whole suite plus the build is green.</done>
  </task>
</tasks>

<verification_gate>
Gate order (UI-SPEC §9.3 / D-07) — the LAST chronological action of this plan:
`npm run typecheck && npm test && npm run build` then `node --test tests/explore-sweep.test.mjs` (its export rows read `out/`, so the build must precede them).

**Declared temporal coupling to plan 03 (pinned at the phase level, not left implicit).** This plan adds the inert `data-projects-swipe-stage` attribute; plan 03 ships its ONLY consumer (`.explore-shell [data-projects-swipe-stage] { touch-action: pan-y; }` in the platform pack), and this plan deliberately asserts only the ABSENCE of `touch-action: none`. The strict 02 → 03 wave order is retained, and plan 04 Task 1's export row asserts BOTH halves in the final tree (the attribute present in `out/index.html` AND the `pan-y` rule present in `globals.css`) — so a slipped wave or a dropped plan 03 cannot silently delete the touch contract with no failing test.

Handed to the phone checklist (plan 04 — not CI-verifiable): touch drag actually swiping the card, the behind-cards peeking, the depth/bloom shadows, and vertical page scroll surviving a gesture that starts on the card.
</verification_gate>
