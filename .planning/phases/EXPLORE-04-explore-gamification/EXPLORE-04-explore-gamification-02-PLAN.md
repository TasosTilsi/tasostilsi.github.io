---
phase: 04-explore-gamification
plan: 02
type: execute
wave: 2
depends_on: ["EXPLORE-04-explore-gamification-01"]
files_modified: [src/components/explore/explore-tour.tsx, src/components/explore/explore-shell.tsx, src/components/explore/explore-header.tsx, src/components/explore/explore-status-bar.tsx, tests/explore-tour.test.mjs, tests/explore-shell.test.mjs]
autonomous: true
requirements: ["EXPLORE-04", "EXPLORE-04b", "EXPLORE-04c", "EXPLORE-04d"]
user_setup: []
must_haves:
  truths:
    - "The tour renders as a fixed full-viewport overlay INSIDE .explore-shell — LAST child of the shell root (W-4 paint order), z-40, never portaled (no createPortal): content steps show a cut-out hole (panel rect inflated 12px, rounded-md, box-shadow 0 0 0 100vmax rgba(0,0,0,0.7) — D-01 technique with the R-1 spread amendment) and welcome/finish show a plain rgba(0,0,0,0.7) dim; the dim FADES IN over 150ms opacity via the tour-dim-in keyframe declared in an inline <style> inside the wrapper (§10's pinned open fade — the ONLY animation of the overlay, implemented as an opacity-only CSS animation per §12.10's explicit permission, NOT a transition, and auto-suppressed under prefers-reduced-motion by the phase-1 guard globals.css:581-593 which sets animation:none !important on .explore-shell *); the card is the ONLY pointer-events-auto descendant, so the page stays interactive and outside clicks never dismiss (UI-SPEC §1, §10, §12.5/§12.6)"
    - "The locked 7-step sequence drives the wizard (D-02): each content step marks its panel visited AT STEP ACTIVATION via onMarkVisited, then smooth-scrolls it into the <main> container with settle detection — scrollend on <main> racing a 700ms timeout with an idempotent guard, double-rAF before measuring, an already-in-view fast path that skips settle when the target rect is fully within <main>'s client rect, and behavior branched on window.matchMedia('(prefers-reduced-motion: reduce)') at call time"
    - "Re-measure triggers per UI-SPEC §2 (all INSTANT — no transition on hole/card geometry, ever): step change after settle; window resize/orientationchange rAF-coalesced; <main> scrollend re-measures ONLY (W-3 — never re-scrolls); rapid Next/Back cancels the pending settle and starts fresh (E-5, last click wins); a missing target renders plain dim + docked card (E-6); the hole element occupies ONE persistent JSX slot across content steps with NO React key — step changes and re-measures update its style props without remounting, so the §10 open fade plays only when a dim-painting element first mounts (open, or welcome↔content transitions) and never replays on step changes or re-measures"
    - "Card anatomy and controls per D-03/UI-SPEC §4 (with §9's ≥44px real-px pin GOVERNING over §4's h-11 shorthand — h-11 = 38.5px real px on phones under the ≤640px rem shrink, so all three card touch controls are px-based h-[44px]): heading row (accent chip from EXPLORE_TOUR_ACCENTS on content steps, heading, X h-[44px] w-[44px] aria-label 'Close tour'), §4 body, controls row — Back ghost h-[44px] px-3 disabled at step 1 | 7 dots (hidden below 640px, aria-hidden, active bg-accent) + 'Step N of 7' derived from EXPLORE_TOUR_STEPS.length | Start/Next/Finish/Done with the primary action text-accent; focus lands on the card (tabIndex -1, .focus({ preventScroll: true })) on open and every step change; Tab cycles card focusables only (element-scoped trap — inherently suspended while the drawer holds focus, E-2; E-2's Radix-default closing-returns-focus-to-drawer-trigger governs over §6's parenthetical per UI-SPEC §13 conflict surfacing — no post-drawer-close refocus implemented); ArrowLeft/ArrowRight = Back/Next (§6)"
    - "X and ESC dismiss mid-tour without blocking the page: ESC uses a document-capture keydown registered while the tour is open and calls stopImmediatePropagation() when dismissing so one press never double-dismisses tour + drawer (UI-SPEC §9/E-12); dismissal writes 'seen' via writeTourFlag (never downgrading 'completed', D-05) and returns focus to the header Tour button; finishing via the finish card writes 'completed' on render (D-04)"
    - "Auto-open fires once per page load at 800ms after mount only when readTourFlag() returns null, cancelled by any pointerdown/keydown before it fires; the header Tour button (44px ghost, lucide Compass, aria-label 'Start the guided tour', LEFTMOST of the right cluster keeping Theme and Drawer byte-identical) re-opens at step 1 for everyone and resets to step 1 when clicked while open (D-05, E-10)"
    - "The finish card shows the §4 congrats, an internal next/link to '/' labeled 'Open the terminal →' (text-accent, same tab) and the muted hint 'the full story lives in the terminal — start with help' — the phase's ONLY cross-surface pointer (D-04, EXPLORE-04d); the link targets the real '/' route file src/app/(main)/page.tsx"
    - "The status-bar counter is LIVE (EXPLORE-04c, D-06): 'N/5 sections visited' inside the existing aria-live polite <p>, fed by ExploreShell's single useExploreVisited instance via a visitedCount prop, text-accent when visitedCount === EXPLORE_SECTIONS.length, persisted under EXPLORE_VISITED_STORAGE_KEY; drawer anchors + manual scroll + wizard arrivals all mark through the one IO path with the drawer byte-untouched (OQ-3/R-3)"
    - "The stale test is renewed in the SAME task as the counter change (R-4): tests/explore-shell.test.mjs:73-82 asserts the live-variable form and never the literal '0/${EXPLORE_SECTIONS.length}' — while the export-level assertion '0/5 sections visited' survives via the SSR literal-0 initial state (UI-SPEC §12.6/§12.7)"
    - "Full gate green on the final tree: npm run build (static export), npm run typecheck, and the FULL node --test suite via the glob form node --test tests/*.test.mjs (the bare directory form fails on Node 24); no spin-the-wheel, no achievements, no toasts, CLI + /resume + panel bodies + drawer byte-untouched (D-08, SPEC acceptance)"
  artifacts:
    - path: src/components/explore/explore-tour.tsx
      provides: "'use client' ExploreTour — auto-open effect, 7-step state machine, scroll-settle, cut-out + card with placeCard geometry, controls, ESC/document + Tab/Arrow card keydowns, focus contract, finish-card Link, flag writes via the plan-01 accessors; client-only (absent from static HTML)"
      min_lines: 280
      exports: ["ExploreTour"]
    - path: src/components/explore/explore-shell.tsx
      provides: "State lifting per RESEARCH OQ-7: single useExploreVisited instance + tourOpen/tourEpoch state, onOpenTour → header, visitedCount → status bar, ExploreTour composed as the LAST child of the shell root"
      min_lines: 75
    - path: src/components/explore/explore-header.tsx
      provides: "Tour button prepended to the right cluster (Tour → Theme → Drawer; the theme/drawer pair and the drawer-rightmost pin stay byte-identical); Compass icon, 44px px-based ghost"
      min_lines: 100
    - path: src/components/explore/explore-status-bar.tsx
      provides: "visitedCount prop + live counter span replacing the literal 0, text-accent branch at 5/5; breadcrumb and aria-live region untouched"
      min_lines: 40
    - path: tests/explore-tour.test.mjs
      provides: "Extended plan-02 suites: overlay DOM contract (§12.5), ESC capture contract (§12.9), reduced-motion branch + no-geometry-transition (§12.10), §10 dim-fade contract, settle primitive presence, header order (§12.8), live counter (§12.7), auto-open, storage confinement, export-level presence/absence in out/explore.html (§12.6)"
      min_lines: 380
    - path: tests/explore-shell.test.mjs
      provides: "Renewed status-bar assertion (live-variable form, R-4) — every other assertion in the file untouched and still passing"
      min_lines: 430
  key_links:
    - from: src/components/explore/explore-tour.tsx
      to: src/components/explore/tour-placement.ts
      via: "placeCard is the single card-positioning authority on every measure (plan-01 export, D-03)"
      pattern: "placeCard"
    - from: src/components/explore/explore-tour.tsx
      to: src/components/explore/constants.ts
      via: "EXPLORE_TOUR_STEPS step table + EXPLORE_TOUR_ACCENTS chip map + EXPLORE_TOUR_FINISH link constants (D-02/D-03/D-04)"
      pattern: "EXPLORE_TOUR_STEPS|EXPLORE_TOUR_ACCENTS|EXPLORE_TOUR_FINISH"
    - from: src/components/explore/explore-shell.tsx
      to: src/components/explore/use-explore-visited.ts
      via: "the single useExploreVisited instance owned by the shell; onMarkVisited threads to the tour, visitedCount to the status bar (OQ-7)"
      pattern: "useExploreVisited"
    - from: src/components/explore/explore-status-bar.tsx
      to: src/components/explore/explore-shell.tsx
      via: "visitedCount prop flows shell → status bar live span (single source of truth, UI-SPEC §5)"
      pattern: "visitedCount"
    - from: src/components/explore/explore-header.tsx
      to: src/components/explore/explore-shell.tsx
      via: "onOpenTour prop from shell → Tour button re-opens/reset at step 1 (D-05, E-10)"
      pattern: "onOpenTour"
    - from: src/components/explore/explore-tour.tsx
      to: src/app/(main)/page.tsx
      via: "finish-card next/link href='/' — internal same-tab navigation to the CLI served by src/app/(main)/page.tsx (D-04)"
      pattern: "href=\"/\""
---

<objective>
Deliver the visible tour: ExploreTour (overlay + cut-out + step card + 7-step mechanics + triggers), the ExploreShell state lifting that composes it as the shell's last child, the header Tour button, the LIVE status-bar counter, and the renewed stale test — completing EXPLORE-04/04b/04c/04d against plan 01's domain/data tier with the full gate green on the final tree.
</objective>

<assumption_delta_decision>
Noun now primary: the single spotlight tour wizard (one overlay, one 7-step table, one trigger pair) as the phase's one gamification representation.
Decision: no-change — the detected pluralization signals are false positives: "fallback" names the 375px bottom-dock MODE of the same summary card (D-03), "alternative" is the Compass icon choice inside Claude's discretion, "second" is the 60-second welcome framing. This phase adds one tour on one surface and explicitly DROPS the sibling systems (spin-the-wheel, achievements, milestone toasts — user-dropped), so there is no general representation to promote and no variant set to enumerate. No accepted debt.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-04-explore-gamification/EXPLORE-04-explore-gamification-CONTEXT.md — locked D-01…D-06, D-08; every task below cites its D-NN
@.planning/phases/EXPLORE-04-explore-gamification/EXPLORE-04-explore-gamification-UI-SPEC.md — BINDING: §1 (anatomy/z-stack/paint order), §2 (settle/re-measure), §3 (sequence + placement, with plan-01's R-10 amendment), §4 (anatomy + pinned copy), §5 (Tour button + live counter + IO), §6 (interaction matrix), §7 (triggers/persistence), §9 (a11y/ESC), §10 (motion/hydration — the 150ms dim fade is IMPLEMENTED here, see Task 1/Task 2), §11 (edges E-1…E-13), §12 (hooks 5-12; §12.10 explicitly permits the opacity-only fade), §13 (U-1 no ring, U-2 scrollend-only, U-3 800ms)
@.planning/phases/EXPLORE-04-explore-gamification/EXPLORE-04-explore-gamification-RESEARCH.md — §1.4 scroll-settle, §1.7 Radix facts (hand-rolled overlay), §3 R-1 (100vmax), R-4 (stale test), R-5 (hydration), R-7 (ESC), OQ-7 (shell lifting), OQ-8 (auto-open timing), OQ-9 (focus contract)
@.planning/phases/EXPLORE-04-explore-gamification/EXPLORE-04-explore-gamification-01-PLAN.md — plan 01 exports: EXPLORE_TOUR_STEPS / EXPLORE_TOUR_ACCENTS / EXPLORE_TOUR_FINISH (constants.ts), placeCard / visitThreshold / parseVisitedIds (tour-placement.ts), useExploreVisited / readTourFlag / writeTourFlag (use-explore-visited.ts)
@src/components/explore/explore-shell.tsx — composition to augment (client boundary, single theme instance precedent)
@src/components/explore/explore-header.tsx — right cluster to prepend the Tour button to (ghost recipe at :63)
@src/components/explore/explore-status-bar.tsx — the literal '0/${EXPLORE_SECTIONS.length} sections visited' at :31 to make live
@src/components/explore/explore-drawer.tsx — ESC/portal behavior reference; INTERNALS BYTE-UNTOUCHED (OQ-3/R-3)
@src/app/globals.css:581-593 — the phase-1 reduced-motion guard (.explore-shell * → animation/transition: none !important) that suppresses the §10 fade automatically
@tests/explore-shell.test.mjs — stale assertion at :73-82 (R-4) + house conventions
@tests/explore-tour.test.mjs — plan-01 suite to extend
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — ExploreTour spine E2E: overlay + welcome/finish cards + controls + dismiss + shell composition + header Tour button</name>
    <files>src/components/explore/explore-tour.tsx, src/components/explore/explore-shell.tsx, src/components/explore/explore-header.tsx, tests/explore-tour.test.mjs</files>
    <read_first>UI-SPEC §1/§4/§6/§7/§9/§10 + §12 items 5/6/8/9, RESEARCH §1.7 (why hand-rolled) + §1.8 (z-landscape) + OQ-7/OQ-9, explore-shell.tsx, explore-header.tsx, plan-01 constants exports, src/app/globals.css:581-593 (the reduced-motion guard), tests/explore-tour.test.mjs (extend)</read_first>
    <action>
      Red/green ordering: append the plan-02 source-invariant suites to tests/explore-tour.test.mjs FIRST (overlay wrapper contract: 'fixed inset-0', 'z-40', 'pointer-events-none', 'pointer-events-auto', 'data-tour-overlay', no 'createPortal'; dim-fade contract: 'tour-dim-in' AND '150ms' present and implemented as a CSS animation/keyframe — the absence assert for 'transition' runs on the COMMENT-STRIPPED source per the house pattern (mirroring tests/explore-shell.test.mjs:202-203) so prose comments cannot trip a spurious red — §10/§12.10; card contract: role="dialog", aria-modal="false", tabIndex -1; card-control sizing: 'h-[44px] w-[44px]' (X) present and 'h-[44px] px-3' occurring ≥2 times (Back + Next) — §9's ≥44px real-px pin over §4's h-11 shorthand; ESC contract: "{ capture: true }" + "stopImmediatePropagation"; header order Tour→Theme→Drawer via indexOf comparisons + 'Compass' import + aria-label "Start the guided tour" + 'h-[44px]'; export-level: out/explore.html CONTAINS 'aria-label="Start the guided tour"' and does NOT contain 'data-tour-overlay' — the verify line below builds BEFORE running the suite, so a fresh export always exists for these asserts), run `node --test tests/explore-tour.test.mjs` → observe RED; then implement.

      Create src/components/explore/explore-tour.tsx ('use client'):
      - export function ExploreTour({ open, reopenEpoch, onOpenChange, onMarkVisited }: { open: boolean; reopenEpoch: number; onOpenChange: (open: boolean) => void; onMarkVisited: (id: ExploreSectionId) => void }).
      - internal stepIndex state; reset effect keyed on [open, reopenEpoch]: when open, setStepIndex(0) — covers open-from-closed AND the E-10 while-open reset (shell bumps reopenEpoch on every Tour-button click; auto-open does not bump).
      - when !open render null (client-only overlay — absent from static HTML, R-5/§12.6).
      - when open: wrapper div fixed inset-0 z-40 pointer-events-none with attribute data-tour-overlay, rendered as the last child of the shell root (W-4). THIS TASK renders the plain rgba(0,0,0,0.7) full dim for ALL steps, carrying §10's pinned open fade: an inline <style> element inside the wrapper declares the tour-dim-in keyframes (opacity 0 → 1) and the dim element gets the inline style animation 'tour-dim-in 150ms ease-out'. This is a CSS ANIMATION on opacity only — never a 'transition' (§12.10 explicitly permits the ≤150ms opacity fade on the dim; the banned string remains 'transition', which targets geometry). Zero new CSS files: the overlay is client-only (renders only when open), so the <style> tag never SSRs, and the phase-1 reduced-motion guard (globals.css:581-593: `.explore-shell *` → `animation: none !important`) suppresses the fade under prefers-reduced-motion automatically — exactly §10's 'zero new CSS' suppression. The card is NOT animated (§10: card + cut-out appear with the fading dim).
      - card: role="dialog" aria-modal="false" aria-labelledby heading id, tabIndex -1, ref, className 'pointer-events-auto absolute bg-card border rounded-md shadow-lg p-4', geometry from placeCard({ panelRect: null, cardSize, viewport }) as inline top/left/width (the LAST child of the wrapper — W-4 paint order pin).
      - card anatomy (§4, with §9's px pin governing touch controls): heading row min-h-11 flex items-center gap-2 — accent chip ONLY on content steps (h-2 w-2 rounded-full + EXPLORE_TOUR_ACCENTS[sectionId]); heading text-sm font-medium; X button ml-auto h-[44px] w-[44px] (icon h-4 w-4, aria-label 'Close tour', ghost hover recipe); body mt-2 text-xs leading-relaxed text-muted-foreground from the step's copy (content steps: step.heading as the heading, per Task 1 the step table supplies it); controls row mt-3 flex items-center justify-between gap-2 — Back ghost 'h-[44px] px-3 text-xs rounded-md' with text-muted-foreground hover recipe, disabled + opacity-50 at step 1; dots container 'hidden sm:flex items-center gap-1' with 7 dots h-1.5 w-1.5 rounded-full (active bg-accent, inactive bg-muted-foreground/40, aria-hidden, count = EXPLORE_TOUR_STEPS.length) + 'text-[10px] text-muted-foreground' counter `Step ${stepIndex + 1} of ${EXPLORE_TOUR_STEPS.length}`; Next ghost 'h-[44px] px-3 text-xs rounded-md' with text-accent, label from the inline ladder ['Start','Next','Next','Next','Next','Finish','Done'] indexed by stepIndex. SIZING GOVERNANCE (§9 over §4, surfaced per UI-SPEC §13): all three card TOUCH controls (X, Back, Next) are px-based h-[44px] — UI-SPEC §9 pins 'all touch targets ≥44px real px, immune to the ≤640px html{font-size:14px} rem shrink' (globals.css:465-467 makes h-11 = 38.5px real px on phones), GOVERNING over §4's h-11 shorthand classes and matching the locked phase-1 header convention (explore-header.tsx:13-15). Only touch targets switch to px; non-touch layout minimums (the heading row's min-h-11) stay §4-verbatim — the 44px X already forces the row to real-px height.
      - Next/Back handlers: advance/clamp within [0, EXPLORE_TOUR_STEPS.length − 1]; Task 1 marks steps 2-6 as temporary no-target rendering (replaced in Task 2) — the step table, controls, and pacing are already the real locked ones (D-02/D-03).
      - keyboard + focus (§6/§9/OQ-9): document keydown listener in capture phase registered while open — on Escape: stopImmediatePropagation(), dismiss (one press never double-dismisses tour + drawer, R-7); card-ELEMENT keydown handler cycling Tab within card focusables ('button:not([disabled]), a[href]') and ArrowLeft/ArrowRight → Back/Next disabled-aware (element-scoped trap is inherently suspended while the drawer holds focus, E-2 — no drawer-open detection needed; SPEC-CONFLICT SURFACING per UI-SPEC §13: §11 E-2's 'closing returns focus to drawer trigger (Radix default); no extra focus juggling' GOVERNS over §6's parenthetical 'on drawer close, focus returns to the card's active control' — Radix's Sheet actually returns focus to its trigger, so §6's parenthetical mis-describes the library behavior; NO post-drawer-close refocus is implemented); focus effect on [open, stepIndex]: cardRef.current?.focus({ preventScroll: true }); dismiss helper (X, ESC, Done): writeTourFlag('seen') + onOpenChange(false) + focus return to document.getElementById('explore-tour-trigger') (writeTourFlag's completed-guard prevents downgrade, D-05; no flag write on navigation-away per E-11 because only these handlers write).
      - sr-only aria-live="polite" span inside the card announcing the §9 exact strings on step change + initial open: `Step ${stepIndex + 1} of 7 — ${step.announce}`.
      - finish card (§4 step 7 + D-04): body = EXPLORE_TOUR_FINISH.congrats + next/link href={EXPLORE_TOUR_FINISH.linkHref} ('/') className text-accent, label EXPLORE_TOUR_FINISH.linkLabel, + muted hint EXPLORE_TOUR_FINISH.hint; an effect fires writeTourFlag('completed') when the finish step becomes active (D-04 — flag set on finish-card render, §7); Done dismisses WITHOUT a 'seen' write (guard no-ops it).
      - Edit explore-header.tsx: prepend the Tour button as the LEFTMOST of the right cluster — button id 'explore-tour-trigger', type button, onClick onOpenTour prop, aria-label 'Start the guided tour', ghost recipe copied from :63 (h-[44px] w-[44px] shrink-0 … focus-visible ring), lucide Compass h-5 w-5 aria-hidden (Compass exists in lucide-react 0.475.0), shrink-0; the existing Theme + Drawer markup stays byte-identical so the drawer stays RIGHTMOST (phase-1 pin). New prop onOpenTour: () => void.
      - Edit explore-shell.tsx (OQ-7 lifting): instantiate useExploreVisited() (visitedCount not yet surfaced — Task 3), add tourOpen + tourEpoch useState(0); header receives onOpenTour = () => { setTourOpen(true); setTourEpoch(e => e + 1); }; render ExploreTour open={tourOpen} reopenEpoch={tourEpoch} onOpenChange={setTourOpen} onMarkVisited={markVisited} as the LAST child inside the shell root div, AFTER ExploreStatusBar (W-4).
      - Update the plan-02 suites to green.
    </action>
    <verify>npm run typecheck && npm run build && node --test tests/explore-tour.test.mjs && node --test tests/explore-shell.test.mjs</verify>
    <acceptance_criteria>
      - `npm run typecheck` exits 0; `npm run build` exits 0 with /explore still exported statically; `node --test tests/explore-tour.test.mjs` exits 0 (build runs BEFORE the suite so export-level asserts see a fresh out/explore.html)
      - out/explore.html contains 'aria-label="Start the guided tour"' (Tour button SSRs) and does NOT contain 'data-tour-overlay' (client-only overlay, §12.6)
      - grep in explore-tour.tsx: the plain dim 'rgba(0,0,0,0.7)'; 'tour-dim-in' AND '150ms' (§10 fade as a CSS animation); 'stopImmediatePropagation'; '{ capture: true }'; 'aria-modal="false"'; NO 'createPortal'; 'h-[44px] w-[44px]' (X) present AND 'h-[44px] px-3' occurring ≥2 times (Back + Next — §9's ≥44px real-px pin on all three card controls)
      - on the COMMENT-STRIPPED source (house pattern mirroring tests/explore-shell.test.mjs:202-203 — strip JS comments before the absence assert so prose comments like 'no transitions on geometry' cannot trip a spurious red), NO 'transition' string remains in explore-tour.tsx
      - grep in explore-header.tsx: indexOf('Start the guided tour') < indexOf('Switch to light theme') < indexOf('Open section navigation') (Tour→Theme→Drawer source order, §12.8)
      - the existing tests/explore-shell.test.mjs suite still passes UNCHANGED at this point (executed by this task's verify command; header test at :65-71 asserts nothing that the Tour addition breaks)
    </acceptance_criteria>
    <done>The tracer is green: opening via the header Tour button shows the welcome card over a plain dim fading in 150ms, Back/Next/dots/counter navigate the 7 steps (content steps temporarily no-target), X/ESC dismiss with the 'seen' flag and focus return — E2E through constants → component → shell → header before the spotlight mechanics expand.</done>
  </task>

  <task type="auto">
    <name>Task 2: Content-step spotlight — scroll-settle, measurement, cut-out hole (100vmax), placeCard geometry, re-measure triggers</name>
    <files>src/components/explore/explore-tour.tsx, tests/explore-tour.test.mjs</files>
    <read_first>UI-SPEC §2 (settle + re-measure) + §3 (sequence/activation order, with plan-01's R-10 placement amendment) + §1 (hole anatomy, W-4) + §10 (the pinned fade + instant-reposition invariant) + §11 E-4/E-5/E-6 + §12 items 5/10, RESEARCH §1.4 (scrollend + fast-path requirement) + §1.2 (box-shadow hit-testing) + R-1, src/components/explore/tour-placement.ts (plan-01 exports incl. the R-10 intersection gate), src/components/explore/panel-shell.tsx (panel ids), src/components/explore/explore-shell.tsx (the <main> the settle listener attaches to)</read_first>
    <action>
      Red/green ordering: extend tests/explore-tour.test.mjs FIRST with the content-step contract suite (asserts in explore-tour.tsx: 'scrollend', '700', 'requestAnimationFrame', 'prefers-reduced-motion', 'placeCard', '0 0 0 100vmax rgba(0,0,0,0.7)', 'getBoundingClientRect', 'offsetHeight' card measurement, 'orientationchange', 'tour-dim-in' AND '150ms' (the fade carried on the hole too), and — on the COMMENT-STRIPPED source (house pattern mirroring tests/explore-shell.test.mjs:202-203) — that NO 'transition' string exists in the code), run → RED (features absent); then implement in explore-tour.tsx and rerun to green.

      Replace the Task-1 temporary no-target treatment for content steps (steps 2-6) with the real spotlight (D-01/D-02, UI-SPEC §2/§3):
      - Step-activation effect per content step: onMarkVisited(step.sectionId) FIRST (marking at activation, not after settle — §3 activation order), then settle → measure → render.
      - Scroll-settle primitive inside explore-tour.tsx: target = document.getElementById(step.sectionId); behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' (branch at call time — the CSS guard does NOT override explicit smooth JS, RESEARCH §1.4); already-in-view fast path (W-2): if target.getBoundingClientRect() is fully within document.querySelector('.explore-shell > main').getBoundingClientRect(), SKIP the scroll and measure after a double requestAnimationFrame (scrollend never fires when the position does not change); otherwise target.scrollIntoView({ block: 'start', behavior }) then race <main>'s 'scrollend' (once: true) against a setTimeout(settle, 700) fallback behind an idempotent guard; return a cancel function. Each step change cancels the pending settle listener/timer before starting a fresh one (E-5 — last click wins).
      - Measure after settle: rect = target.getBoundingClientRect(); store { rect, cardSize } in state. Card size: measure the rendered card element (ref → offsetWidth/offsetHeight) in a layout effect and update state when it changes (two-pass converge, max one extra render); placeCard({ panelRect, cardSize, viewport }) with viewport = { width: window.innerWidth, height: window.innerHeight } drives the card inline geometry (plan-01's R-10 amendment guarantees the card is never off-screen, including panels scrolled off-viewport).
      - Hole element (content steps with a resolved target): absolutely-positioned transparent element inside the wrapper at rect inflated 12px on all sides (left rect.left − 12, top rect.top − 12, width rect.width + 24, height rect.height + 24), rounded-md, boxShadow '0 0 0 100vmax rgba(0,0,0,0.7)' (R-1 amendment of D-01's 100vw — 100vw under-covers tall portrait viewports; technique/element-count/opacity unchanged, UI-SPEC §1 as amended), pointer-events-none, aria-hidden, and it carries the SAME §10 dim fade — the hole's box-shadow IS the content-step dim, so the hole element gets the inline style animation 'tour-dim-in 150ms ease-out' (opacity-only, §12.10-permitted). The hole occupies ONE persistent JSX slot across content steps with NO React key: step changes and re-measures update its style props without remounting, so the §10 open fade plays only when a dim-painting element first mounts (tour open → first content step; a welcome↔content transition swaps dim-painters and replays the fade once — that is the pinned open fade behaving as mounted, not a new animation) and NEVER replays on same-kind step changes or re-measures (§10 instant-reposition invariant). Rendered BEFORE the card in DOM (W-4: the card is the last child so the hole's shadow never dims it).
      - Re-measure triggers (§2, all INSTANT — no transition classes on left/top/width/height anywhere): (a) step change after settle; (b) window resize + orientationchange rAF-coalesced → re-measure current step; (c) <main> 'scrollend' → re-measure ONLY (W-3: user scrollends reposition the cut-out/card but never re-scroll; the programmatic scrollIntoView fires on step activation only). All listeners registered while open and cleaned on close/unmount.
      - Target-missing guard (E-6): if document.getElementById(step.sectionId) returns null → render the plain full dim + placeCard with panelRect null (docked card) — the tour never crashes on a missing target.
      - Finish-card completion effect (D-04): when the finish step becomes active, writeTourFlag('completed') (Task 1 placed the finish card; this task ensures the flag write is bound to finish activation, not dismissal).
      - One-line comment in the component (R-6): fixed positioning assumes NO transformed ancestor between the overlay and the viewport — never add transform/animate-* to .explore-shell or its ancestors.
      Extend the plan-02 suites: hole contract greps (12px inflation math presence '− 12'/' + 24' or equivalent, 'rounded-md' hole, boxShadow string, the hole carrying 'tour-dim-in'), settle greps, W-3 measure-only assertion (the main 'scrollend' handler contains no scrollIntoView call — assert the scrollIntoView occurrence count is exactly 1 in the file).
    </action>
    <verify>npm run typecheck && node --test tests/explore-tour.test.mjs</verify>
    <acceptance_criteria>
      - `npm run typecheck` exits 0; `node --test tests/explore-tour.test.mjs` exits 0
      - grep '100vmax' hits explore-tour.tsx (R-1 amended D-01 string); grep '100vw' returns NO match
      - explore-tour.tsx contains 'scrollend', '700', 'requestAnimationFrame', 'matchMedia', 'prefers-reduced-motion' (§12.10 source-level)
      - 'scrollIntoView' appears EXACTLY once in explore-tour.tsx (step-activation only — W-3 measure-only scroll repositioning)
      - on the COMMENT-STRIPPED source (house pattern mirroring tests/explore-shell.test.mjs:202-203), no 'transition' string remains in explore-tour.tsx (§10/§12.10: geometry repositioning is instant; the §10 open fade is IMPLEMENTED as the opacity-only CSS ANIMATION 'tour-dim-in' at 150ms — an animation is not a transition, §12.10 explicitly permits it, and the phase-1 reduced-motion guard at globals.css:581-593 sets animation:none !important under prefers-reduced-motion so the fade self-suppresses)
      - grep 'tour-dim-in' and '150ms' hit explore-tour.tsx: the keyframes are declared once in the inline <style>, and BOTH dim-painters (the plain-dim div and the hole element) carry the animation inline style
      - grep 'createPortal' returns no match in any tour file (§12.5)
    </acceptance_criteria>
    <done>Content steps spotlight the real panel: mark at activation → smooth-scroll → settle → measure → hole + placeCard-placed card, re-measured on resize/scrollend, deterministic at 375px — D-01/D-02/D-03 satisfied end-to-end with §10's pinned 150ms dim fade live.</done>
  </task>

  <task type="auto">
    <name>Task 3: Auto-open + LIVE status-bar counter + stale-test renewal + full phase gate</name>
    <files>src/components/explore/explore-tour.tsx, src/components/explore/explore-shell.tsx, src/components/explore/explore-status-bar.tsx, tests/explore-shell.test.mjs, tests/explore-tour.test.mjs</files>
    <read_first>UI-SPEC §5 (counter + Tour button) + §7 (auto-open) + §11 E-8/E-10/E-13 + §12 items 6/7/12, RESEARCH §1.6 (SSR/client-boundary facts) + §3 R-4 (stale test) + R-5 (hydration), RESEARCH OQ-6 (which existing tests change), tests/explore-shell.test.mjs:73-82 (the assertion to renew) and :379 (the export assertion that must survive)</read_first>
    <action>
      Red/green ordering: FIRST rewrite the stale status-bar source test in tests/explore-shell.test.mjs (R-4) — replace the :77-80 assertion that src includes '0/${EXPLORE_SECTIONS.length} sections visited' with its live-variable form: assert src includes '${visitedCount}/${EXPLORE_SECTIONS.length} sections visited' AND does NOT include '0/${EXPLORE_SECTIONS.length}'; rename the test to 'status bar: breadcrumb + live theme label + LIVE N/5 counter'. Run `node --test tests/explore-shell.test.mjs` → observe RED (the source still renders the literal). THEN implement and rerun to green.

      Edit explore-status-bar.tsx: add prop visitedCount: number to ExploreStatusBar (alongside theme); replace the :31 literal with `${visitedCount}/${EXPLORE_SECTIONS.length} sections visited` inside the EXISTING aria-live="polite" <p> (string format byte-identical, §5); wrap that span in a conditional className — text-accent when visitedCount === EXPLORE_SECTIONS.length (E-13, the phase's only celebration visual), text-muted-foreground otherwise; keep the breadcrumb and theme label untouched.

      Edit explore-shell.tsx: pass visitedCount={visitedCount} to ExploreStatusBar (the plan-01 hook instance is the single source of truth, OQ-7).

      Edit explore-tour.tsx — auto-open effect (D-05, §7): mount-only effect — if readTourFlag() !== null return (ANY non-null value suppresses, E-8); else setTimeout(() => onOpenChange(true), 800) (U-3 default) cancelled by any document pointerdown/keydown ({ once: true, capture: true } listeners removed in cleanup); opens at step 1 via the existing open-transition reset; one-shot per page load.

      Extend tests/explore-tour.test.mjs: auto-open source greps ('800', 'pointerdown', 'keydown', 'readTourFlag'); status-bar live-form greps ('${visitedCount}/${EXPLORE_SECTIONS.length} sections visited', 'text-accent', 'visitedCount' prop, aria-live intact); export-level suite against out/explore.html — still contains '0/5 sections visited' (SSR literal-0 initial state survives, :379 green) and 'aria-label="Start the guided tour"', and does NOT contain 'data-tour-overlay' (§12.6).

      Full phase gate on the final tree: npm run typecheck && npm run build && node --test tests/*.test.mjs (ALL suite files via the GLOB form — the suite-wide gate, R-4. Planner correction, verified this session: bare `node --test tests/` FAILS on Node 24 — it treats the directory path itself as a single test entry and reports one failing 'tests'; the glob form is the proven house invocation). Confirm /explore still exports statically (out/explore.html exists) and that no edit touched src/components/cli/, src/app/(main), /resume, data files, explore-panels.tsx, explore-drawer.tsx, or explore-intro.tsx (git status / git diff --stat check; D-08 augment-only).
    </action>
    <verify>npm run typecheck && npm run build && node --test tests/*.test.mjs</verify>
    <acceptance_criteria>
      - `npm run typecheck` exits 0; `npm run build` exits 0 (static export intact); `node --test tests/*.test.mjs` exits 0 across ALL suite files (5 suite files ≥93 tests — the 4 pre-existing suites' 93 tests plus the new tests/explore-tour.test.mjs)
      - tests/explore-shell.test.mjs no longer contains the string '0/${EXPLORE_SECTIONS.length} sections visited' and its replacement asserts '${visitedCount}/${EXPLORE_SECTIONS.length} sections visited'
      - out/explore.html contains '0/5 sections visited' AND 'aria-label="Start the guided tour"' and does NOT contain 'data-tour-overlay'
      - explore-status-bar.tsx contains 'visitedCount' and a text-accent conditional on visitedCount === EXPLORE_SECTIONS.length; the aria-live="polite" <p> is untouched
      - explore-tour.tsx contains '800', 'pointerdown', 'keydown', 'readTourFlag' (auto-open per §7)
      - git diff --stat shows NO changes under src/components/cli/, src/app/(main), resume surfaces, src/data/, explore-panels.tsx, explore-drawer.tsx, explore-intro.tsx (D-08)
    </acceptance_criteria>
    <done>Phase acceptance sweep green on the final tree: triggers (auto-once + Tour button), live persisted N/5 counter, finish-card CLI pointer, full gate green — EXPLORE-04/04b/04c/04d complete against the locked contract.</done>
  </task>
</tasks>