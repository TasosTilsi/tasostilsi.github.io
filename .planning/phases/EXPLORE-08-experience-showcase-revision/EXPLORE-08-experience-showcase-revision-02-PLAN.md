---
phase: 08-experience-showcase-revision
plan: 02
type: execute
wave: 2
depends_on: ["EXPLORE-08-experience-showcase-revision-01"]
files_modified:
  - src/components/explore/sections/experience-section.tsx
  - src/components/explore/use-timeline-progress.ts
  - src/components/explore/explore-panels.tsx
  - tests/explore-shell.test.mjs
  - tests/explore-sweep.test.mjs
  - tests/explore-visuals-server.test.mjs
  - tests/explore-visuals.test.mjs
autonomous: true
requirements: ["REV-07", "REV-12", "REV-13"]
user_setup: []
must_haves:
  truths:
    - "The Experience panel spans both grid columns at md+ as row 1, with [About+Contact | Skills] row 2 and Projects full-width row 3 — zero empty cells; at 375px everything stacks 1-col with every new span/height class md:-scoped (D-01, UI-SPEC §1.1)"
    - "out/explore.html carries role 1 (Chubb) title/company/duration/location/bullets as real static text while layers 2–3 render visibility:hidden + aria-hidden; the interaction activates on hydration (D-07, UI-SPEC §9)"
    - "Scrolling inside the extended wrapper drives marker transforms and content layers from ONE progress value via rAF imperative writes on main.scrollTop — no wheel/touch listeners, natural release at the range ends, React re-renders only on activeIndex/geometry change (REV-12, D-02/D-04, UI-SPEC §1.3/§6)"
    - "ArrowUp/ArrowDown on the stage and the Prev/Next buttons step roles via main.scrollTo with the reduced-motion behavior branch — the buttons ARE the accessible non-scroll alternative (REV-13, D-05, UI-SPEC §4/§5)"
    - "prefers-reduced-motion freezes markers at {180°,135°,90°} by index, swaps content opacity-only, and suppresses the dot size-class swap (D-04, UI-SPEC §7 RM-1/RM-2/W-7)"
    - "Every listener/observer/animation frame is cleaned up on unmount: scroll, keydown, matchMedia change, ResizeObserver, rAF (REV-13, UI-SPEC E-7)"
    - "The <md compact form is the SAME DOM as the stage (single-DOM B-1): stacked layers with year chips, all readable, hook dormant — no second subtree (D-05, UI-SPEC §8)"
  artifacts:
    - path: "src/components/explore/sections/experience-section.tsx"
      provides: "The stage composition (UI-SPEC §14 seam 3): 'use client' file retaining the pinned ExperienceSection signature; single-DOM arc zone + content layers + controls; SSR = the derivation evaluated at progress 0 (Chubb real text)"
      min_lines: 170
      exports: ["ExperienceSection"]
    - path: "src/components/explore/use-timeline-progress.ts"
      provides: "The interaction hook (UI-SPEC §14 seam 2): scroll/rAF/keyboard/resize/reduced-motion/md-gate machinery over the pure module, full unmount cleanup"
      min_lines: 110
      exports: ["useTimelineProgress"]
    - path: "src/components/explore/explore-panels.tsx"
      provides: "The grid rebalance (UI-SPEC §14 seam 4): data-conditional full-width wrapper (W-3), three placement classes, sticky/z stage via PanelShell className"
      min_lines: 100
      exports: ["ExplorePanels"]
    - path: "tests/explore-shell.test.mjs"
      provides: "Grid invariants rewritten to the placement whitelist (§13): 2× md:col-span-2 + 1× md:order-first + md-scoped heights"
      min_lines: 440
      exports: []
    - path: "tests/explore-sweep.test.mjs"
      provides: "Sweep rows rewritten to the whitelist + md-scoping + sticky-breaker audit (no overflow- on the panels)"
      min_lines: 250
      exports: []
    - path: "tests/explore-visuals-server.test.mjs"
      provides: "Anatomy suite renewed to the dual contract: arc-zone-first, rail gone-checks, filter-governed roles, 'use client' present"
      min_lines: 150
      exports: []
    - path: "tests/explore-visuals.test.mjs"
      provides: "Client-boundary + motion invariants renewed: experience-section + hook join the client list; matchMedia ban narrowed to the server set; REV-08 row repointed at the arc"
      min_lines: 690
      exports: []
  key_links:
    - from: "src/components/explore/sections/experience-section.tsx"
      to: "src/components/explore/use-timeline-progress.ts"
      via: "the stage consumes the interaction hook (§14 seams 2+3)"
      pattern: "use-timeline-progress"
    - from: "src/components/explore/use-timeline-progress.ts"
      to: "src/components/explore/timeline-geometry.ts"
      via: "every per-frame derivation is a pure module call — the hook is thin over it"
      pattern: "timeline-geometry"
    - from: "src/components/explore/use-timeline-progress.ts"
      to: "src/components/explore/explore-shell.tsx main"
      via: "the ONLY scroll source is the main scroll container, never window (research §1.2/§1.8.2)"
      pattern: "explore-shell > main"
    - from: "src/components/explore/explore-panels.tsx"
      to: "src/components/explore/panel-shell.tsx"
      via: "sticky stage classes ride the existing PanelShell className param — chrome stays byte-identical (R-1)"
      pattern: "md:sticky md:top-0"
    - from: "src/components/explore/sections/experience-section.tsx"
      to: "src/components/explore/timeline-geometry.ts"
      via: "role selection + SSR layer styles come from the pure module (D-06, R-13)"
      pattern: "timeline-geometry"
---

<objective>
Compose the full-width interactive semicircular timeline: rebalance the panel grid (Experience full-width row 1, About|Skills row 2, Projects full-width row 3 — D-01), rewrite the Experience panel body into the sealed UI-SPEC stage (arc zone + content layers + controls, single-DOM mobile form, SSR contract), and wire the interaction hook (scroll → timelineProgress → rAF writes, keyboard, reduced-motion, cleanup). Renew every stale test atomically with the source change per the replacement discipline, so the tree is green at the end of every task. Delivers REV-07's layout, REV-12's scroll mechanism, and REV-13's interaction contracts.
</objective>

<assumption_delta_decision>
- Noun now primary: the **timelineProgress derivation + the isTechRelated role selection** — ONE timeline identity (see plan 01).
- Decision: **promote** — this plan implements the promotion physically: ONE DOM (UI-SPEC §8 B-1) serves the md+ stage, the <md compact form, and the no-JS export; scroll, keyboard, and buttons all funnel into the same progress domain (`scrollTargetForRole` → `main.scrollTo`); the phase-7 rail+dots `slice(0,3)` list is replaced, not maintained alongside (gone-checks in Task 1).
- Rationale: D-02/D-04 + UI-SPEC §2.3/§8 pin one derivation and one DOM; an add-alongside rail would duplicate content and violate the single-source-of-truth acceptance. No accepted debt.
- Companion invariant: the wrapper height, the stage, and the compact list all derive from the SAME `selectTimelineRoles` output — one selection function feeds every variant (pinned in Task 1's explore-shell/sweep rewrites and plan 01's unit tests).
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-08-experience-showcase-revision/EXPLORE-08-experience-showcase-revision-UI-SPEC.md — the sealed design contract; §1.1 placement table, §2.2/§2.3 geometry, §2.4 markers, §3 layers, §4 controls, §5 keyboard, §6 rAF authority, §7 reduced-motion, §8 B-1, §9 SSR, §12 edge matrix, §13 stale-test list, §15 UNRESOLVED defaults are ALL NORMATIVE
@.planning/phases/EXPLORE-08-experience-showcase-revision/EXPLORE-08-experience-showcase-revision-CONTEXT.md — D-01…D-07 locked decisions (cite the D-NN in each task)
@src/components/explore/timeline-geometry.ts — plan 01's pure module (the ONLY derivation source)
@src/components/explore/sections/experience-section.tsx — the panel body this phase replaces
@src/components/explore/explore-panels.tsx — the grid to rebalance (registry closure pinned by tests/explore-visuals.test.mjs:273-291 — keep the ExperienceSection signature)
@src/components/explore/panel-shell.tsx — chrome (byte-identical per R-1; className param is the only touchpoint)
@src/components/explore/explore-shell.tsx — `.explore-shell > main` is the only scroll container (overflow-y-auto, p-4 md:p-6)
@src/components/explore/use-explore-visited.ts — house hook pattern ("use client" directive, hydration contract, '.explore-shell > main' root)
@src/components/explore/explore-tour.tsx — :110 main selector precedent, :157-159 reduced-motion behavior branch, GHOST_INTERACTION focus recipe (grep it)
@src/app/globals.css:588-660 — entrance stagger (.panel-grid > *, nth-child delays), exp-lift vocabulary, reduced-motion guard (the ONLY suppressor, R-6)
@tests/explore-shell.test.mjs, @tests/explore-sweep.test.mjs, @tests/explore-visuals-server.test.mjs, @tests/explore-visuals.test.mjs — the stale assertions this plan rewrites (exact regions in Task 1)
@src/components/explore/constants.ts — EXPLORE_SECTIONS order LOCKED (R-2)
@src/data/portfolio-main-data.json + @src/data/portfolio-main-data.d.ts — data (zero data-file changes, D-06)
</context>

<tasks>
  <task type="auto">
    <name>Task 1 (tracer): grid rebalance + stage composition + hook scroll channel + atomic test renewal</name>
    <files>src/components/explore/explore-panels.tsx, src/components/explore/sections/experience-section.tsx, src/components/explore/use-timeline-progress.ts, tests/explore-shell.test.mjs, tests/explore-sweep.test.mjs, tests/explore-visuals-server.test.mjs, tests/explore-visuals.test.mjs</files>
    <read_first>UI-SPEC.md in full (§1–§9, §13), CONTEXT.md decisions, timeline-geometry.ts, experience-section.tsx, explore-panels.tsx, panel-shell.tsx, explore-shell.tsx, use-explore-visited.ts, explore-tour.tsx:100-170, globals.css:588-660, the four test files</read_first>
    <action>
      Thinnest end-to-end slice through every layer, production quality, verified before expansion. ORDER WITHIN THE TASK (red/green discipline): rewrite the stale assertions FIRST and run the four suites against the unchanged source to put the new-contract failures on record (red), THEN land the source edits and rerun to green. Commit atomically after green (the replacement discipline — source change + test rewrite in one commit).
      a. tests/explore-shell.test.mjs — rewrite the grid test at :326-342 to the placement whitelist (UI-SPEC §13): keep the grid-classes/lg-ban/accent/registry/max-w/padStart assertions (:317-334); replace the zero-col-span block (:335-340) with: exactly 2 matches of "md:col-span-2" in explore-panels.tsx (experience wrapper + projects shell), exactly 1 "md:order-first", "md:sticky md:top-0" present, "md:h-[calc(100dvh-10rem)]" present, "md:h-[300vh]" present AND no unprefixed h-[300vh] (lookbehind regex); keep the :341 about-conditional ban (the placement map is a Record lookup, not an id comparison).
      b. tests/explore-sweep.test.mjs — rewrite the two grid rows at :38-53 and :55-76 to the same whitelist; KEEP the section-order assertion (:62-65) and the grid-cols-1 base row (:78-84); add: md-scoping row (every col-span / h-[300vh] / h-[calc(100dvh-10rem)] occurrence is md:-prefixed — R-9) and a sticky-breaker grep (explore-panels.tsx contains no "overflow-" — UI-SPEC §1.1 audit).
      c. tests/explore-visuals-server.test.mjs — :40-47 KEEP (the viz-data import ban survives: the section imports timeline-geometry, not viz-data); REWRITE :49-62: the stage group/arc zone is the first body child, gone-checks "relative space-y-5 border-l" absent, "-left-[4px]" absent, "<ol" absent, bg-chart-2 STILL present (year chips + active dot); :64-81 KEEP untouched (the merged meta markup survives verbatim in the layers, R-7); REWRITE :83-93: selectTimelineRoles present and slice(0, 3) absent (filter-governed, D-06 supersedes the phase-7 order-cap), ≤3 bullets + verbatim strings + pointer kept, "use client" PRESENT (inverts :92).
      d. tests/explore-visuals.test.mjs — REWRITE :170-197: move experience-section.tsx into a new clientBodies list; the no-client loop covers serverSlices + skills/projects sections + explore-panels.tsx; assert experience-section.tsx AND use-timeline-progress.ts carry "use client". REWRITE :199-217: the isAnimationActive ban stays global; the matchMedia ban narrows to the server set; add assertions that use-timeline-progress.ts contains matchMedia('(prefers-reduced-motion: reduce)') and matchMedia('(min-width: 768px)'). KEEP :219-243 (update the phaseTouchedComponents arrays so experience-section stays scanned by the banned-token loop). KEEP :273-291 (registry closure). REWRITE :293-315: keep the deleted-chart checks; replace the rail-survives assertion with the arc path "M 100 0 A 100 100 0 0 0 100 200" + the md:hidden year chip present in the section; invert :314 to "use client" present.
      e. src/components/explore/explore-panels.tsx — grid rebalance (D-01, UI-SPEC §1.1, seam 4): import selectTimelineRoles from './timeline-geometry'; add a data-driven placement Record keyed by ExploreSectionId (no id-comparison conditional — the :341 ban stays satisfied): about/skills empty; projects shell "md:col-span-2"; experience shell "md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]" and wrapper "md:order-first md:col-span-2 md:h-[300vh]" — BOTH conditional on selectTimelineRoles(data.experience).length > 1 (W-3 data-conditional, not a static class; ≤1 roles → natural height, no sticky, E-2). Render: for experience, wrap PanelShell in a plain div carrying ONLY the wrapper classes and NO id (R-3 — the tour hole, IO threshold, and drawer anchors measure the section); pass the shell classes via the existing PanelShell className param (R-1 chrome byte-identical). md:z-10 on the sticky section per the research stacking pitfall (§1.8.1: later siblings Skills/Projects would paint over the pinned card). Index chips stay map-derived (R-1: chip 02). Entrance stagger untouched (the wrapper is the animated grid child; DOM order preserved).
      f. src/components/explore/use-timeline-progress.ts — NEW hook ("use client", use-explore-visited.ts pattern), scroll channel only in this task (seam 2): passive scroll listener on document.querySelector('.explore-shell > main') (NEVER window — research §1.8.2); scroll events only schedule rAF; one derivation pass per frame with batched reads (wrapper/stage/arc-zone rects + main paddingTop once — §6): rel = (wrapperRect.top − mainRect.top) − mainPaddingTop, range = wrapperHeight − stageHeight, progress = computeProgress(rel, range) (§1.3 — natural release, no gating code), c′ = continuousIndex, activeIndex = activeIndexFromContinuous; per-marker writes: θ = markerAngle(i, c′, n) (reduced-motion branch lands in Task 2), geometry from viewBoxToPx(measured zone) refreshed by a ResizeObserver on the stage (E-6), dot transform translate(x,y) translate(-50%,-50%) + scale(emphasis.scale), label transform translate(x,y) translate(0,-50%) + translateX(-100%) when the point's vx < 100 (B-2), emphasis opacity — transform/opacity ONLY (R-5), reads batched, ≤1 write set per frame (E-8); per-layer writes: contentLayer(i, c′, reducedMotion) → style.opacity/transform/visibility; setActiveIndex ONLY on change (no per-frame setState — §6); geometryReady state after the first measured pass. Cleanup on unmount: removeEventListener('scroll'), RO.disconnect(), cancelAnimationFrame (E-7 partial — Task 2 completes it).
      g. src/components/explore/sections/experience-section.tsx — stage composition (D-03/D-04/D-05/D-06/D-07, seams 3, UI-SPEC §2/§3/§8/§9/§10): add "use client" as line 1; KEEP the exact prop signature { experience: PortfolioData['experience'] } (registry closure test :284 stays green); roles = selectTimelineRoles(experience); roles.length === 0 → return null (E-1); ONE DOM (§8 B-1): root div role="group" aria-label="Career timeline" (§10, the Task 2 keydown target); interior row md:grid md:grid-cols-[2fr_3fr] gap-4 (§1.2 40/60 split); arc zone hidden md:flex md:flex-col — SVG per §2.2 (viewBox "0 0 100 200", preserveAspectRatio "xMidYMid meet", className "absolute inset-0 h-full w-full", path "M 100 0 A 100 100 0 0 0 100 200", fill none, stroke "hsl(var(--border))", strokeWidth 1, vectorEffect "non-scaling-stroke", aria-hidden — left-bulging C per §2.1) + per-role dot span (aria-hidden; active "h-2 w-2 rounded-full bg-chart-2" / inactive "h-1.5 w-1.5 rounded-full bg-muted-foreground/40") + year label (REAL TEXT: start year, active label font-mono text-sm font-medium tabular-nums text-foreground + the duration AS STORED at text-[10px] text-muted-foreground tabular-nums when dateLineFits allows (W-4/U-6), inactive font-mono text-xs tabular-nums text-muted-foreground; NO aria-current, NO hover/press/cursor on markers — §2.4/§4); markers render inline opacity 0 pre-measurement, fading in 150ms after the first measured frame (§9 — one-shot: the hook removes the transition class imperatively after the first post-measurement write so rAF writes are never transition-lagged); control row in the arc-zone footer (§4): Prev button (lucide ChevronUp h-4 w-4 aria-hidden, aria-label "Previous role", h-[44px] min-w-[44px] px-3 text-xs text-muted-foreground rounded-md, hover:bg-muted, the tour's GHOST_INTERACTION focus-visible recipe verbatim, disabled:opacity-50 at activeIndex 0), counter "{String(activeIndex+1).padStart(2,'0')} / {String(n).padStart(2,'0')}" font-mono text-[10px] text-muted-foreground tabular-nums, Next button (ChevronDown, aria-label "Next role", text-accent, disabled:opacity-50 at n−1) — the ONLY two interactive controls (§4); content column flex justify-center: layers container "space-y-5 md:grid" with each layer "md:col-start-1 md:row-start-1" (§3 single-cell stack at md+, stacked list below); per-layer year chip md:hidden (dot bg-chart-2 + font-mono text-xs year; dot-only when year is null — E-4); layer anatomy verbatim (§3/R-7): h3 text-base font-medium text-foreground title, p mt-0.5 text-sm company, merged meta p text-xs text-muted-foreground with span.tabular-nums duration + span[aria-hidden] " · " + location AS STORED, ul mt-2 space-y-1.5 list-disc pl-4 marker:text-muted-foreground with FIRST 3 responsibilities (graceful omit, U-3); SSR initial layer styles = contentLayer(i, 0, false) evaluated inline at render (§9: layer 0 visible real text, layers 1-2 visibility:hidden); aria-hidden per layer = stageActive && i !== activeIndex with stageActive state initialized TRUE (SSR = the md+ export contract §9; corrected on mount; below md all layers readable — B-1 path b); sr-only p aria-live="polite" announcing "Role {i+1} of {n} — {title}, {company}" (re-renders only on activeIndex change — never per frame); TerminalPointer command="experience --all" after the stack (R-11 — serves both md+ and <md from the same node); no localStorage, no geometry-dependent layout (flow text), no new suppressor CSS (R-6 — inline Tailwind transition utilities only, under .explore-shell scope by DOM position).
      VERIFY: npm run typecheck; npm run build; node --test on all four rewritten suites; grep Chubb's title out of out/explore.html.
    </action>
    <verify>npm run typecheck && npm run build && node --test tests/explore-shell.test.mjs && node --test tests/explore-sweep.test.mjs && node --test tests/explore-visuals-server.test.mjs && node --test tests/explore-visuals.test.mjs && grep -c "Senior Software Engineer in Test" out/explore.html</verify>
    <acceptance_criteria>
      - `npm run typecheck` exits 0 and `npm run build` exits 0
      - the four rewritten suites exit 0
      - out/explore.html contains "Senior Software Engineer in Test" (grep count ≥ 1)
      - grep explore-panels.tsx: exactly two "md:col-span-2", one "md:order-first", "md:sticky md:top-0" present, no "overflow-"
      - grep experience-section.tsx: "use client" present, "M 100 0 A 100 100 0 0 0 100 200" present, "slice(0, 3)" absent, "selectTimelineRoles" present
      - grep use-timeline-progress.ts: "explore-shell > main" present, "removeEventListener" present, "cancelAnimationFrame" present
    </acceptance_criteria>
    <done>The full-width pinned stage exists end-to-end: grid rows rebalanced, export carries Chubb real text, scroll drives markers/content from one progress value, all four renewed suites green.</done>
  </task>

  <task type="auto">
    <name>Task 2: interaction contracts completion — keyboard, reduced-motion, resize, mobile gate, cleanup</name>
    <files>src/components/explore/use-timeline-progress.ts, src/components/explore/sections/experience-section.tsx</files>
    <read_first>UI-SPEC §5 (keyboard), §7 (reduced-motion rows RM-1…RM-6), §8 B-1 (mobile hydration paths), §12 (E-6/E-7/E-13), explore-tour.tsx:157-159 (behavior branch precedent)</read_first>
    <action>
      Deepen the hook + stage to the full interaction-quality contract (REV-13/D-05), citing the UI-SPEC row ids:
      a. Keyboard (§5): ONE keydown listener attached to the stage body root (the role="group" div — NOT the PanelShell section, which has no ref support and must stay byte-identical per R-1; all focusables live inside the body so coverage is identical, and the §5 intent — no document/window listeners — is honored). ArrowDown → next role, ArrowUp → previous; preventDefault ONLY on these handled keys; arrows outside the stage fall through to native main scrolling (documented ambient path). Action: main.scrollTo({ top: scrollTargetForRole(main.scrollTop, relNow, target, n, range), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }) — the tour's :157-159 branch verbatim; scrolling IS the progress input so keyboard never bypasses the single source of truth (D-02). relNow is measured fresh at invocation (read wrapper+main rects, recompute rel).
      b. Prev/Next buttons + keyboard share one goToRole(i)/stepRole(±1) path in the hook; buttons disable at the clamped ends (§4).
      c. Reduced motion (§7): the rm flag is read PER DERIVATION PASS via matchMedia('(prefers-reduced-motion: reduce)').matches — no listener, no stale flag (E-13); when rm: angles = reducedMotionAngle(i, n) frozen {180,135,90}, emphasis = reducedMotionEmphasis (opacity-only, scale 1 — no scale component written), content = contentLayer(i, c′, true) (translateY ≡ 0, opacity-only), and the dot SIZE-class swap is SUPPRESSED (W-7 — dots stay at the inactive size; a 2px size change is spatial movement). The sticky range itself is RETAINED (RM-5 — scroll is user input).
      d. Dot discrete classes (§6 + W-7): color classes (text-foreground/text-muted-foreground, bg-chart-2/bg-muted-foreground/40) swap via React render on activeIndex with transition-[color,opacity] duration-200 ease-out; the size classes (h-2 w-2 vs h-1.5 w-1.5) are gated on a reducedMotion state the hook updates inside the activeIndex-change effect by reading matchMedia fresh (post-mount only — hydration-safe, no media listener; the discrete channel adopts the new mode at the next discrete change while the rAF channels adopt per pass).
      e. Resize/orientation (E-6): the ResizeObserver on the stage recomputes zone geometry (s/offsets/radius) rAF-coalesced; progress re-clamps on the next frame; observer disconnected on unmount.
      f. Mobile gate (§8 B-1): matchMedia('(min-width: 768px)') WITH a change listener (added + removed on cleanup): dormant below md (the derivation pass short-circuits — computeProgress never runs, the NaN divide-by-zero path is unreachable); on entering compact, clear the inline visibility/opacity/transform styles on ALL layers once (static stacked list, all 3 visible and readable — the SSR hidden styles never survive to a mobile user); on re-entering md+, the hook takes ownership of per-layer visibility.
      g. Cleanup completion (E-7): removeEventListener for scroll + keydown + the md media change listener, RO.disconnect(), cancelAnimationFrame of any pending frame — ALL in the unmount effect.
      h. Live region + counter correctness: the sr-only aria-live line and the 01/03 counter update ONLY on discrete activeIndex changes (never per frame — §4).
      VERIFY: typecheck + build + the four suites + the new-contract greps below.
    </action>
    <verify>npm run typecheck && npm run build && node --test tests/explore-visuals.test.mjs && node --test tests/explore-visuals-server.test.mjs && grep -c "ArrowDown" src/components/explore/use-timeline-progress.ts && grep -c "prefers-reduced-motion: reduce" src/components/explore/use-timeline-progress.ts && grep -c "min-width: 768px" src/components/explore/use-timeline-progress.ts</verify>
    <acceptance_criteria>
      - grep use-timeline-progress.ts: "ArrowDown", "ArrowUp", "scrollTo", "behavior" present; exactly one "prefers-reduced-motion" matchMedia read (per-pass, E-13) and no change-listener attached to the RM query; "min-width: 768px" present WITH addEventListener('change') and its removeEventListener
      - grep use-timeline-progress.ts: "ResizeObserver", "disconnect()", "cancelAnimationFrame", "removeEventListener" all present (E-7)
      - grep experience-section.tsx: no "cursor-pointer", no "tabIndex", no "aria-current" (markers non-interactive, §2.4/§10); "aria-live=\"polite\"" present
      - the suites exit 0 and the build exits 0
    </acceptance_criteria>
    <done>The stage honors the full REV-13 contract: keyboard + buttons step roles through scrollTo, reduced motion collapses spatial interpolation per RM-1/RM-2/W-7, resize recomputes, mobile gate rests, unmount cleans everything.</done>
  </task>

  <task type="auto">
    <name>Task 3: local gates + export smoke (verification task — no source edits)</name>
    <files>none — verification only</files>
    <read_first>UI-SPEC §9 (SSR/export contract)</read_first>
    <action>
      Run the local gates on the composed tree and smoke the export contract before the wave closes: npm run typecheck; npm run build; node --test over ALL of tests/explore-tour.test.mjs, tests/explore-header.test.mjs, tests/explore-routing.test.mjs, tests/explore-visuals-skills.test.mjs, tests/portfolio-data-integrity.test.mjs, tests/resume-docx-order.test.mjs (the untouched neighbors must stay green — if one fails, it is a REAL defect in this plan's scope: fix the source honouring the D-NN rules, never weaken the assertion). Then grep out/explore.html for the §9 contract: Chubb's title AND company AND duration AND location present; "visibility:hidden" count ≥ 2 (layers 1-2); "aria-label=\"Career timeline\"" present; "Previous role" and "Next role" present; "d=\"M 100 0 A 100 100 0 0 0 100 200\"" present. No file edits in this task — if any check fails, fix the owning source file from Task 1/Task 2's scope and rerun.
    </action>
    <verify>npm run typecheck && npm run build && for f in tests/explore-tour.test.mjs tests/explore-header.test.mjs tests/explore-routing.test.mjs tests/explore-visuals-skills.test.mjs tests/portfolio-data-integrity.test.mjs tests/resume-docx-order.test.mjs; do node --test "$f" || exit 1; done && grep -c "visibility:hidden" out/explore.html</verify>
    <acceptance_criteria>
      - typecheck, build, and all six neighbor suites exit 0
      - grep out/explore.html: "visibility:hidden" count ≥ 2; "Career timeline", "Previous role", "Next role", and the arc path d attribute all present
      - no source file modified by this task (pure verification)
    </acceptance_criteria>
    <done>The composed tree passes its local gates and the static export satisfies the §9 contract; the wave closes green.</done>
  </task>
</tasks>
</content>