---
phase: 09-editorial-motion-revision
plan: 04
type: tdd
wave: 3
depends_on: ["EXPLORE-09-editorial-motion-revision-03"]
files_modified:
  - src/components/explore/projects-row-state.ts
  - src/components/explore/sections/projects-editorial-stage.tsx
  - src/components/explore/sections/projects-section.tsx
  - src/components/explore/explore-panels.tsx
  - tests/projects-editorial.test.mjs
  - tests/explore-sweep.test.mjs
  - tests/explore-shell.test.mjs
  - tests/explore-visuals.test.mjs
autonomous: true
requirements: ["REV-17"]
user_setup: []
must_haves:
  truths:
    - "The Projects panel renders stat tiles + the framer-motion-driven editorial scroll stage (md+ only): the top-6 curated projects in data order as rows — year + name + first-sentence description + link line — with a thin border-t divider on EVERY row block, inside the sticky ~100vh shell within a md:h-[300vh] wrapper (UI-SPEC §4.1/§4.2)"
    - "Rows enter from below and COEXIST during transitions: single progress value from useScroll, continuous interpolation (r′=(n−1)·progress, y=clamp(H·d,−H,+H), opacity=clamp(1−|d|,0,1)) with no discrete thresholds, no springs, no bounce — useTransform only (D-04)"
    - "Reduced motion degrades to opacity-only swaps via useReducedMotion (y≡0) with the sticky range retained; no wheel/touch listeners anywhere — the single scroll source stays .explore-shell > main (D-05)"
    - "The row description is firstSentence(description, 120): split at the first period KEEPING the terminal period, word-boundary truncate + '…' (no period after) over budget — DeepIndex (234 chars) and Clarif-AI (122) truncate; SDK4ED-TD (55) renders whole (OQ-1 reading (b), UI-SPEC §4.2)"
    - "SSR/static export renders row 0 real text + tiles + pointer at md+ with rows 1-5 at opacity 0 / visibility hidden / aria-hidden (constant progress-0 styles, the phase-8 idiom); <md the existing compact card grid owns the surface byte-identical and the rows viewport is CSS-hidden"
    - "framer-motion imports appear ONLY in the projects editorial composition file; the stage is a 'use client' child while ProjectsSection stays a server component; hover on linked rows is color-only (no exp-lift — the transform channel is owned by the motion system)"
    - "After the md:col-span-2 move from the projects shell to the wrapper, the two span-2 count assertions in tests/explore-sweep.test.mjs and tests/explore-shell.test.mjs keep passing with their message texts renewed to name the projects WRAPPER (the wave-2→3 handoff — no factually stale message survives)"
    - "The §10.7 engine-scan loop in tests/explore-visuals.test.mjs (~lines 593-600) is RENEWED, not deleted, to the dual-engine contract: framer-motion permitted ONLY in src/components/explore/sections/projects-editorial-stage.tsx (mirroring the plan's isolation grep), '.animate('/'gsap'/'lottie' still banned across every explore .ts/.tsx file, and the new projects-row-state.ts pinned zero-import — the phase-8 wholesale ban is renewed to the new engine reality, never deleted wholesale (D-05 house convention)"
  artifacts:
    - path: "src/components/explore/projects-row-state.ts"
      provides: "The pure, framer-free, zero-runtime-import row-state module: firstSentence (OQ-1 reading b pinned in the docstring), rowState (y/opacity/visible with RM variant + H-fallback totality), rowYear (first 4-digit year from project.date) — node --testable via type stripping (the timeline-geometry R-12 precedent)"
      min_lines: 80
      exports: ["firstSentence", "rowState", "rowYear"]
    - path: "src/components/explore/sections/projects-editorial-stage.tsx"
      provides: "The 'use client' editorial stage: mount-gated main/wrapper discovery (P1 — never a pending container ref), useScroll({container,target,offset}) single progress source, per-row useTransform consuming the pure rowState, useMotionValueEvent discrete aria channel, useReducedMotion RM fallback, SSR constant styles at progress 0"
      min_lines: 140
      exports: ["ProjectsEditorialStage"]
    - path: "tests/projects-editorial.test.mjs"
      provides: "The RED-first pure-module suite over the REAL JSON: firstSentence split/truncate/no-period/boundary cases (DeepIndex 234→120+…, Clarif-AI 122→120+…, SDK4ED-TD whole), rowState coexistence/monotonicity/RM/clamp contracts, rowYear extraction + E-8 null → the caller's em-dash"
      min_lines: 120
      exports: []
  key_links:
    - from: "src/components/explore/sections/projects-editorial-stage.tsx"
      to: "src/components/explore/projects-row-state.ts"
      via: "every per-row useTransform consumes the pure rowState — the motion channel NEVER inlines row math (the single derivation source)"
      pattern: "rowState\\("
    - from: "src/components/explore/sections/projects-editorial-stage.tsx"
      to: ".explore-shell > main"
      via: "the useScroll container is the discovered main element (MAIN_SELECTOR precedent, use-timeline-progress.ts:104) handed in as an ALREADY-HYDRATED ref — window fallback is never reachable"
      pattern: "explore-shell > main"
    - from: "src/components/explore/sections/projects-section.tsx"
      to: "src/components/explore/sections/projects-editorial-stage.tsx"
      via: "the server panel renders the client stage inside the md+ rows viewport between the tiles and the compact list; the compact card grid stays byte-identical"
      pattern: "ProjectsEditorialStage"
    - from: "src/components/explore/explore-panels.tsx"
      to: "src/components/explore/sections/projects-editorial-stage.tsx"
      via: "the projects wrapper carries data-editorial-wrapper='true' (no id — R-3) which the stage resolves via closest() as its useScroll target"
      pattern: "data-editorial-wrapper"
---

<objective>
Convert the Projects panel to the framer-motion-driven editorial scroll composition (REV-17, D-04): a sticky ~100vh stage (md+ only) inside a 300vh wrapper where the top-6 curated projects render as editorial rows — year + name + first-sentence description + link line, thin dividers — entering from below and coexisting under ONE continuous scroll-linked progress value (useScroll/useTransform, Editorial-calm: no springs, no bounce), with reduced-motion opacity-only swaps, SSR row-0 real text, and the existing compact card grid preserved byte-identical below md. The row math lives in a pure framer-free sibling module (node --testable); framer-motion is imported ONLY in the stage file. RED-first per the tdd discipline.
</objective>

<assumption_delta_decision>
- Noun now primary: the **projects row presentation at md+** — the framer-driven editorial rows are the primary md+ composition, derived from the single rowState source.
- Decision: **promote**. The existing compact card grid demotes to the <md tier variant of the SAME top-6 data slice (byte-identical, server-rendered) rather than a parallel presentation system. No add-alongside debt: one data slice (slice(0,6)), one row identity, two viewport tiers.
- Companion invariant: both tiers round-trip through the primary data path — the compact list and the editorial rows consume the SAME top-6 slice in data order from the same props; the md+ rows additionally round-trip every state through the pure rowState (the framer channel never re-derives the math inline).
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md — §4 is NORMATIVE (geometry §4.1, row anatomy + first-sentence rule §4.2, motion contract §4.3, SSR §4.4, mobile fallback §4.5); §11 U-13/U-14/U-15 defaults
@.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-CONTEXT.md — D-04 (the editorial brief) + D-05 (framer-motion ONLY in the projects composition; zero new deps)
@src/components/explore/timeline-geometry.ts — the R-12 pure-module precedent (zero runtime imports, erasable TS, node --testable) and the YEAR_PATTERN copy precedent (line 71)
@src/components/explore/use-timeline-progress.ts — the MAIN_SELECTOR (line 104) + DOM-discovery idiom (lines 147+) the stage's mount gate mirrors; also the phase-8 'React state only on discrete change' contract
@src/components/explore/sections/projects-section.tsx — the server panel being integrated (tiles at 48-50, the card map at 51-99 stays byte-identical as the <md tier, pointer at 100)
@src/components/explore/explore-panels.tsx — the PLACEMENT map (post plan-03 state) where the projects wrapper/shell + W-3 mirror gate land
@src/components/explore/panel-shell.tsx — confirms PanelShell is NOT a flex container (the explicit inner-height mechanism, U-15)
@src/data/portfolio-main-data.json — top-6 in data order: DeepIndex, Clarif-AI, SDK4ED-TD, ServicedMetricsCalculator, Avoid Traffic Extended, Uom Track (description lengths 234/122/55/97/86/82 with periods)
@node_modules/framer-motion/dist/index.d.ts — useScroll (offset semantics), useTransform, useReducedMotion (boolean | null — handle ?? false), useMotionValueEvent signatures (RESEARCH §1.3.1 verified facts)
@tests/explore-sweep.test.mjs — the placement-whitelist count message at line ~53 ('experience wrapper + projects shell') that this plan's span-2 move makes stale — Task 3 renews the message text
@tests/explore-shell.test.mjs — the same count message at line ~344 — Task 3 renews the message text
</context>

<tasks>
  <task type="test">
    <name>Task 1: RED — the pure row-state suite over the real JSON (tracer: description strings → firstSentence → row states, asserted pure before any framer code exists)</name>
    <files>tests/projects-editorial.test.mjs</files>
    <read_first>.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md (§4.2/§4.3 + E-5/E-6), tests/explore-timeline.test.mjs (house node --test style: assert/strict, readFileSync of the REAL JSON, direct .ts import), src/data/portfolio-main-data.json (the six descriptions — read them verbatim)</read_first>
    <action>
      Create tests/projects-editorial.test.mjs in the house node --test style. Import { firstSentence, rowState, rowYear } from '../src/components/explore/projects-row-state.ts' — the module does not exist yet; the failed import IS the red. Contracts (all against the REAL JSON, never copied literals):
      1. firstSentence on the real top-6 descriptions: DeepIndex (234 chars with terminal period) → truncated at a word boundary ≤120 ending with '…' and NO period after it; Clarif-AI (122) → same; SDK4ED-TD (55) → the whole first sentence INCLUDING its terminal period; ServicedMetricsCalculator (96/97), Avoid Traffic Extended (85/86), Uom Track (81/82) → whole sentences (the terminal period counts toward 120 — OQ-1 reading (b)).
      2. firstSentence edge matrix (UI-SPEC E-5/E-6): a string with NO period ≤120 → returned whole; a no-period string >120 → word-boundary truncate + '…'; an exactly-120 sentence with period → returned unchanged; a sentence of exactly 121 → truncated + '…'; no double punctuation ('…' never followed by a period); empty string → empty string.
      3. rowState shape: rowState(index, progress, count, H, rm) → { y, opacity, visible } with r′=(n−1)·progress, d=i−r′, y=clamp(H·d, −H, +H), opacity=clamp(1−|d|, 0, 1), visible=|d|<1 — assert the §4.3 values: progress 0 → row 0 {y:0, opacity:1, visible:true} and row 1 {y:+H, opacity:0, visible:false}; progress 1 with n=6 → row 5 active; c′=2.5 → rows 2 and 3 BOTH in the (0,1) opacity coexistence band with y ∓H/2.
      4. Contract invariants: monotone in d per property; RM=true → y≡0 for every input while opacity still tracks d (RM-5/D-04); H≤0 → y=0 totality (no NaN anywhere — U-14's hidden-viewport guard); y clamped to exactly ±H; visible flips exactly at |d|≥1.
      5. rowYear on the real project.date strings: '2026' → '2026'; the six top-6 dates extract their first 4-digit years in data order [2026, 2026, 2023, 2023, 2022, 2021]; absent/empty date → null (the caller renders the '—' em-dash, E-8).
      Run `node --test tests/projects-editorial.test.mjs` — RED (module missing).
    </action>
    <verify>node --test tests/projects-editorial.test.mjs exits non-zero with the module-import failure (RED)</verify>
    <acceptance_criteria>
      - The suite imports firstSentence/rowState/rowYear from '../src/components/explore/projects-row-state.ts'
      - The suite asserts against the real JSON descriptions (readFileSync of portfolio-main-data.json present in the file)
      - The DeepIndex/Clarif-AI truncation cases and the SDK4ED-TD whole-sentence case are all asserted
      - `node --test tests/projects-editorial.test.mjs` fails with 'Cannot find module' / failed import (RED, not assertion drift)
    </acceptance_criteria>
    <done>The row-state contract suite is on record and red for exactly the missing module</done>
  </task>
  <task type="feat">
    <name>Task 2: GREEN — the pure row-state module + the 'use client' editorial stage (mount-gated useScroll, per-row useTransform, discrete aria channel, RM fallback, SSR constant styles)</name>
    <files>src/components/explore/projects-row-state.ts, src/components/explore/sections/projects-editorial-stage.tsx</files>
    <read_first>tests/projects-editorial.test.mjs (the Task-1 contract is the spec), src/components/explore/timeline-geometry.ts (the pure-module header contract), src/components/explore/use-timeline-progress.ts (MAIN_SELECTOR + the discrete-state + SSR-at-progress-0 idioms), .planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md (§4.3/§4.4), node_modules/framer-motion/dist/index.d.ts (the verified API shapes)</read_first>
    <action>
      1. src/components/explore/projects-row-state.ts (NEW): the timeline-geometry.ts precedent — ZERO runtime imports, erasable TS only, full docstring header. Exports:
         - firstSentence(description: string, maxChars = 120): string — split at the FIRST '.' KEEPING the terminal period (OQ-1 reading (b), pinned in the docstring); if the sentence exceeds maxChars, truncate at the last word boundary that fits (including a trailing '…' within the budget) and append '…' with NO period after; no period → the whole string under the same truncation rule; no truncation → return as-is. Never append '….' (no period after the ellipsis).
         - rowState(index: number, progress: number, count: number, height: number, reducedMotion: boolean): { y: number; opacity: number; visible: boolean } — r′=(count−1)·progress; d=index−r′; y=reducedMotion ? 0 : clamp(height·d, −height, +height) with height≤0 → y=0 (totality); opacity=clamp(1−|d|, 0, 1); visible=|d|<1. Full docstring mirroring the contentLayer contract at editorial scale.
         - rowYear(date: string | null | undefined): string | null — the private YEAR_PATTERN copy (the timeline-geometry.ts:71 precedent — first /\b(?:19|20)\d{2}\b/ match wins; NO cross-module import so the module stays zero-runtime-import).
      2. src/components/explore/sections/projects-editorial-stage.tsx (FIRST LINE 'use client'): the ONLY framer-motion import site of the phase. Two components in one file:
         - ProjectsEditorialStage (outer, SSR surface): 'use client' hooks ONLY for discovery — a mount effect that resolves the container via document.querySelector<HTMLElement>('.explore-shell > main') (the MAIN_SELECTOR precedent) and the target via stageRef.current?.closest<HTMLElement>('[data-editorial-wrapper]'); BEFORE discovery (SSR/static/no-JS and the first client frame) it renders the rows-viewport stack with CONSTANT styles from rowState(i, 0, n, 480, false) — row 0 real text; rows 1-5 opacity 0, visibility hidden, aria-hidden 'true' (the UI-SPEC §4.4 contract, the experience-section.tsx:199-213 idiom). On discovery it renders the Inner child. HARD RULE (RESEARCH P1): the Inner is NEVER rendered while either element is missing — useScroll throws an invariant on a still-pending ref and permanently caches a window fallback when container is undefined; the discovered elements are handed over as ref INITIAL VALUES so no framer effect ever sees a pending ref.
         - The Inner (module-private) receives { mainEl, wrapperEl, projects }: useRef<HTMLElement>(mainEl) + useRef<HTMLElement>(wrapperEl) — BOTH initialized hydrated; H = the measured height of the stage root (getBoundingClientRect on mount + on resize via the container's resize — U-14), fallback 480; const reducedMotion = useReducedMotion() ?? false; const progress = useScroll({ container: containerRef, target: wrapperRef, offset: ['start start', 'end end'] }).scrollYProgress — ONE MotionValue 0→1, the single progress source (D-04). Per row: two useTransform hooks calling rowState(i, p, n, H, reducedMotion).y / .opacity — the pure module is the ONLY math site; NO springs, no useSpring, no bounce (Editorial-calm, D-04). The discrete channel: useMotionValueEvent(progress, 'change', …) updates React state ONLY when the set of visible rows (|d|<1) changes — the aria-hidden/visibility flip rides React state on discrete changes only (the phase-8 contract carried over); no aria-live on this stage (UI-SPEC §8).
         - Row anatomy (§4.2, shared by the SSR fallback and the motion rows via one small render helper): motion.div (or plain div pre-discovery) 'md:col-start-1 md:row-start-1' in a 'md:grid' stack vertically centered; border-t border-border on EVERY row block including row 0 (uniform ruling, rides the row's transform); year marker = rowYear(project.date) as mono 'text-xs tabular-nums text-muted-foreground', null → '—'; name 'text-base font-medium text-foreground'; description = firstSentence(project.description) at 'text-sm leading-relaxed text-muted-foreground'; linked project → the row block is ONE anchor (target='_blank' rel='noopener noreferrer') with ArrowUpRight h-3.5 w-3.5 and color-only hover/focus ('group-hover:text-accent transition-colors' + the ring recipe) — NO exp-lift (P5); unlinked → plain div, no affordance (E-7).
         - Constraints baked in: no wheel/touch listeners anywhere (D-05); no scroll-snap; framer imports appear in NO other file of this change; the stage root carries 'h-full' so H measures the U-15 inner height box.
      Run node --test tests/projects-editorial.test.mjs — GREEN; typecheck passes. Commit atomically (feat:).
    </action>
    <verify>node --test tests/projects-editorial.test.mjs exits 0; npm run typecheck exits 0</verify>
    <acceptance_criteria>
      - `grep -c "from 'framer-motion'" src/components/explore/sections/projects-editorial-stage.tsx` ≥ 1 AND `grep -rn "framer-motion" src/components/explore/` shows matches ONLY in that file (the isolation grep gate, D-05)
      - `grep -c "useSpring\|scroll-snap\|addEventListener('wheel'\|addEventListener('touch" src/components/explore/sections/projects-editorial-stage.tsx` returns 0 (no springs, no hijack)
      - `grep -c "rowState(" src/components/explore/sections/projects-editorial-stage.tsx` ≥ 4 (SSR fallback + per-row transforms consume the pure module)
      - `grep -c "use client" src/components/explore/sections/projects-editorial-stage.tsx` returns 1 as the first line
      - `grep -cE "^import\s" src/components/explore/projects-row-state.ts` returns 0 (zero import STATEMENTS of any kind — the R-12 contract, anchored like the §10.7 pin's /^import\s/m; a compliant docstring header that itself says 'ZERO runtime imports' must not trip the raw unanchored grep, and the module needs not even a type-only import — it works on primitives only, unlike timeline-geometry.ts's erasable `import type` line at 31)
      - `node --test tests/projects-editorial.test.mjs` exits 0
    </acceptance_criteria>
    <done>The pure row math and the single framer import site exist, wired to one continuous progress value, with the pure suite green</done>
  </task>
  <task type="feat">
    <name>Task 3: integration — the server panel, the projects placement + W-3 mirror gate, the span-2 message renewal, the §10.7 dual-engine renewal, and the full green gate over the final tree</name>
    <files>src/components/explore/sections/projects-section.tsx, src/components/explore/explore-panels.tsx, tests/explore-sweep.test.mjs, tests/explore-shell.test.mjs, tests/explore-visuals.test.mjs</files>
    <read_first>.planning/phases/EXPLORE-09-editorial-motion-revision/EXPLORE-09-editorial-motion-revision-UI-SPEC.md (§4.1 literal DOM sequence W-1, §4.5), src/components/explore/sections/projects-section.tsx (full — the card map stays byte-identical), src/components/explore/explore-panels.tsx (the post-plan-03 state), src/components/explore/sections/experience-section.tsx (TerminalPointer-last precedent, line 250), tests/explore-sweep.test.mjs (line ~53), tests/explore-shell.test.mjs (line ~344), tests/explore-visuals.test.mjs (the §10.7 engine-scan block, lines ~572-613 — the loop this task renews; also the education-passing adapter pin at ~line 314, already renewed by plan 01 Task 1 — leave it untouched)</read_first>
    <action>
      1. projects-section.tsx (STAYS a server component): reorder the body to the §4.1 literal DOM sequence — ProjectStatTiles (unchanged, above everything) → the rows viewport '<div className="hidden md:block md:h-[calc(100dvh-14.5rem)]">' (the U-15 starting constant — the sticky recipe minus the measured chrome stack; tunable 13.5-15.5rem by design) wrapping <ProjectsEditorialStage projects={cards} /> → the compact list '<div className="md:hidden">' containing the EXISTING card map byte-identical → TerminalPointer command='projects --all' LAST in both tiers (W-1). The card map JSX must not change beyond being wrapped in the md:hidden container.
      2. explore-panels.tsx: PLACEMENT.projects becomes { wrapper: 'md:col-span-2 md:h-[300vh]', shell: 'md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]' } — the existing 'md:col-span-2' moves from shell to wrapper (the Experience recipe verbatim); the wrapper divs (the generic branch) carry data-editorial-wrapper="true" (NO id — R-3: the tour hole, IO and drawer anchors measure the sticky section by its stable id); split the single `extended` boolean into the per-system W-3 pair carried IN the placement map (no section-id conditionals — the explore-shell.test.mjs pin holds): experience gate = selectTimelineEntries(data.experience, data.education).length > 1 (unchanged from plan 01), projects gate = data.projects.slice(0, 6).length > 1 (the W-3 mirror, E-2 preserved: ≤1 project → natural height, no pin); the shell/wrapper conditional reads placement.gate && placement.shell. Update the header comment for the phase-9 dual sticky ranges (E-15: sequential wrappers, both shells md:z-10).
      3. Renew/extend the greps in tests/projects-editorial.test.mjs (source-level): the panels source contains the projects wrapper+shell recipe and data-editorial-wrapper; the stage file is the only framer import site; projects-section carries the hidden/md:block viewport + md:hidden compact pairing + the pointer last.
      4. Span-2 message renewal (the wave-2→3 handoff): moving 'md:col-span-2' from the projects shell to the wrapper keeps both placement-whitelist count assertions green (the count stays exactly 2) but makes their MESSAGE texts factually stale — renew BOTH message strings in this task's test commit: tests/explore-sweep.test.mjs (~line 53) → 'exactly two span-2 grid children — experience wrapper + projects wrapper (D-01)' and tests/explore-shell.test.mjs (~line 344) → 'exactly two span-2 grid children — the experience wrapper + the projects wrapper (D-01)'. Change ONLY the message strings — the asserted counts (=== 2) and matched regex stay untouched.
      5. §10.7 dual-engine renewal (the second stale site this phase creates — RENEW the assertion, never delete it wholesale): tests/explore-visuals.test.mjs lines ~593-600 recursively enumerate EVERY .ts/.tsx under src/components/explore/ (readdirSync recursive, comment-stripped via codeOf) and assert framer-motion — alongside '.animate(', 'gsap', 'lottie' — absent from EACH file with no allowlist; plan 04's sanctioned framer import in projects-editorial-stage.tsx trips this loop deterministically the moment Task 2 lands. Operating on the post-plan-01 file state (the education-passing adapter pin at ~line 314 is already renewed — touch ONLY the §10.7 loop region), renew the loop to the dual-engine contract: the '.animate('/'gsap'/'lottie' bans keep iterating every explore .ts/.tsx file UNCHANGED; the framer-motion ban becomes the ALLOWLIST — every explore file EXCEPT src/components/explore/sections/projects-editorial-stage.tsx must contain no 'framer-motion' substring, and the exempted stage file must CONTAIN it (the positive half, mirroring Task 2's isolation grep); add the zero-import pin for the new pure module: codeOf('src/components/explore/projects-row-state.ts') contains no /^import\s/m match and no 'framer-motion' (the R-12 zero-runtime-import contract, now node --test-asserted in the cross-cutting suite). Keep the loop's recursive enumeration, the codeOf convention, and the downstream rAF loop (lines ~606-613, with its two sanctioned-site exemptions) byte-untouched — the stage uses no rAF directly.
      6. The FULL green gate, chronologically last: npm run typecheck → npm run build → node --test over the complete tests/ directory (all suites, including plans 01-03's renewed files — the ONLY full-suite run of the phase; plans 01-03's own gates are scoped to their diff-touched suites). Verify the export: out/explore.html carries the row-0 (DeepIndex) first-sentence text + tiles + pointer; the compact card grid markup still present in the export (md:hidden tier). Commit atomically per task (test/source renewals ride this task's commit).
    </action>
    <verify>npm run typecheck && npm run build exit 0; the complete node --test suite exits 0 as the chronologically last action</verify>
    <acceptance_criteria>
      - `grep -c "ProjectsEditorialStage" src/components/explore/sections/projects-section.tsx` returns 1 and the card map's existing key/anatomy strings are unchanged (byte-identical tier)
      - `grep -c "data-editorial-wrapper" src/components/explore/explore-panels.tsx` returns 1 and `grep -c "md:col-span-2 md:h-\[300vh\]"` shows the projects wrapper alongside the experience wrapper
      - `grep -c "slice(0, 6).length > 1" src/components/explore/explore-panels.tsx` returns 1 (the W-3 mirror gate)
      - `grep -rn "framer-motion" src/ | grep -v projects-editorial-stage` returns 0 matches (the isolation gate over the whole tree)
      - out/explore.html contains a DeepIndex row's first-sentence text (≤120 chars, ending '…') and 'projects --all' AFTER the rows viewport
      - `grep -c "experience wrapper + projects wrapper" tests/explore-sweep.test.mjs` returns 1 and `grep -c "the projects wrapper (D-01)" tests/explore-shell.test.mjs` returns 1 (the renewed message texts), with both count assertions still `=== 2` (green in the full-suite run)
      - tests/explore-visuals.test.mjs carries the renewed §10.7 allowlist: `grep -c "projects-editorial-stage" tests/explore-visuals.test.mjs` ≥ 1 (the framer-motion exemption, with the positive assertion that the stage file contains it) while the '.animate('/'gsap'/'lottie' universal-ban strings REMAIN in the loop (renewed, not deleted — `grep -c "'.animate('" tests/explore-visuals.test.mjs` ≥ 1), and the projects-row-state.ts zero-import pin exists; `node --test tests/explore-visuals.test.mjs` exits 0
      - The full node --test suite over tests/ exits 0 (the green gate covers the final tree)
    </acceptance_criteria>
    <done>REV-17's editorial scroll is live end-to-end — sticky stage, coexisting rows, RM fallback, SSR row 0, byte-identical mobile tier — over a fully green tree with no stale span-2 message left behind</done>
  </task>
</tasks>