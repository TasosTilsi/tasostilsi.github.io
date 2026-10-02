All research complete. Here is the full RESEARCH.md for the orchestrator to write to disk:

```markdown
# Phase 4: explore-gamification — RESEARCH.md

**Gathered:** 2026-09-21 (research pass, planner input)
**Phase:** 04-explore-gamification · Milestone: Explore Visual Landing
**Inputs honored:** CONTEXT.md D-01…D-08 (locked), SPEC.md, phase UI-SPEC (`.planning/phases/EXPLORE-04-explore-gamification/EXPLORE-04-explore-gamification-UI-SPEC.md`)

**Scope note — read this first.** A binding UI-SPEC for this phase already exists and pins most design decisions (z-stack, overlay anatomy, pointer-events model, scroll-settle, placement table, copy, a11y, edges, verification hooks). This research does NOT relitigate any of it. It (a) independently re-verifies the environment facts the UI-SPEC claims, (b) researches the remaining browser-API HOW (scrollend, IntersectionObserver, box-shadow spread math, Radix ESC layering), and (c) surfaces three conflicts between pinned values and build-time reality that the planner must carry into the plan explicitly — none blocks planning.

---

## 1. Domain analysis

### 1.1 What is being built (settled)

A non-modal spotlight tour on /explore: a fixed full-viewport dim layer with a cut-out over the active panel (box-shadow technique), a summary step card, locked 7-step sequence (Welcome → About → Experience → Skills → Projects → Contact → finish), manual pacing, auto-open once + header Tour button, live `N/5 sections visited` counter, finish card linking to the CLI at `/`. Spin-the-wheel and achievements are **user-dropped** — no research needed, do not exist [VERIFIED: SPEC.md:66-72 interview log; CONTEXT.md deferred section].

### 1.2 Spotlight-tour pattern — standard practice [ASSUMED, high confidence]

The "measure → position cut-out → summary card adjacent to target" pattern is the standard guided-tour shape (same mechanics family as driver.js/intro.js-style product tours). The two mainstream cut-out implementations are (1) an SVG mask/rect and (2) the box-shadow technique. D-01 locks (2): one absolutely-positioned hole element with `box-shadow: 0 0 0 <spread> rgba(0,0,0,0.7)`.
- Mechanism grounding: spread-radius expands the shadow in all four directions beyond the element's box, and "if a border-radius is specified on the element with a box shadow, the box shadow takes on the same rounded corners" [CITED: MDN box-shadow, https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow]. So a rounded hole element with a huge spread IS the dim layer with a rounded cut-out — the technique is sound.
- Key hit-testing property (pattern knowledge, [ASSUMED]): box-shadow paint is not hit-testable — only the hole element's own box can capture pointers. With `pointer-events: none` on the hole and the wrapper, the entire page stays interactive; the card is the only `pointer-events: auto` surface. The UI-SPEC §1 pins exactly this model ("the dim is visual-only").

### 1.3 Measurement + positioning [VERIFIED: repo + standard APIs]

- Panels are server-rendered `<section id={id} aria-label={label} className="rounded-md border bg-card p-4">` — targets resolvable by `document.getElementById(section.id)` [VERIFIED: `src/components/explore/panel-shell.tsx:39-42`; ids from `EXPLORE_SECTIONS` at `src/components/explore/constants.ts:10-16`].
- `getBoundingClientRect()` returns viewport-relative coordinates, which pair directly with `position: fixed` overlay math — no offset-parent arithmetic needed [ASSUMED, standard DOM API behavior].
- The sole scroll container is `<main class="flex-1 overflow-y-auto p-4 md:p-6">` inside the client shell; scroll/IO/settle work must target it, never the window [VERIFIED: `src/components/explore/explore-shell.tsx:47-53`; `<main aria-label tabIndex={0}>`].
- The shell root `div.explore-shell` (classes `explore-shell flex h-dvh flex-col overflow-x-hidden bg-background text-foreground`) creates no stacking context and no transformed containing block [VERIFIED: `src/components/explore/explore-shell.tsx:39`; globals.css shell token blocks at :530/:566 carry no transform]. Fixed-position overlay children therefore position against the viewport and are NOT clipped by the shell's `overflow-x-hidden` (a fixed element's containing block is the viewport absent a transformed ancestor) [ASSUMED, standard CSS containing-block rules].
- Scroll target alignment: UI-SPEC §2 pins `scrollIntoView({ block: 'start', behavior })` on the panel; the nearest scrollable ancestor (`<main>`) scrolls [ASSUMED, standard].

### 1.4 Scroll-settle: scrollend + fallback [CITED + VERIFIED]

- MDN classifies the `scrollend` event as **Baseline 2025 — Newly available: "Since December 2025, this feature works across the latest devices and browser versions. This feature might not work in older devices or browsers."** [CITED: MDN, https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollend_event]. D-02's timeout fallback therefore remains REQUIRED for older Safari/mobile engines — feature-detect (`'onscrollend' in window`) or just always race the timeout.
- Critical correctness property, quoted from MDN: **"If the scroll position did not change, then no scrollend event fires."** [CITED: same page]. Consequence: on any step whose target is already fully in view, a bare `scrollend` listener would never fire and the wizard would stall until the fallback timer. The UI-SPEC §2 "already-in-view fast path" (skip settle when the target rect is already fully within main's client rect, measure after a double-rAF) is therefore required for correctness AND speed, not merely an optimization.
- The event fires on the scrolled element (`<main>`), not `document` — listen on main [ASSUMED, standard; consistent with MDN example].
- Reduced motion: the CSS guard sets `scroll-behavior: auto !important` on `body:has(.explore-shell)` and `.explore-shell main` [VERIFIED: `src/app/globals.css:590-593`] but that override only affects `behavior:'auto'` calls — an explicit JS `scrollIntoView({behavior:'smooth'})` bypasses CSS. The implementation must branch behavior on `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at call time [VERIFIED pattern precedent: `src/components/explore/explore-intro.tsx:35-39`]. UI-SPEC §2 pins this exact branch.

### 1.5 Visited-marking via IntersectionObserver [CITED + risk below]

- IO supports `root` as an Element (use `<main>`, never null/window) and thresholds as ratios of intersection area to **the target's bounding box area** [CITED: MDN, https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver — "The ancestor element or viewport is referred to as the root"; "thresholds… a ratio of intersection area to bounding box area of an observed target"].
- The observer marks a panel visited when its ratio crosses the threshold; marking is deduped in the store; initial observation reports currently-intersecting targets immediately on `observe()` [ASSUMED, universally relied-upon IO behavior]. Semantic consequence the planner should know: on first load the About panel is ≥50% visible at the top of main, so the counter can legitimately read ≥1/5 right after hydration on a fresh visit — this is consistent with UI-SPEC §5 semantics and does not affect the SSR literal (still `0/5` in static HTML).
- IO alone subsumes all three visit sources (drawer-anchor scroll, manual scroll, wizard `scrollIntoView`) — one marking mechanism, no duplicate paths. See Open Question OQ-3.

### 1.6 State & persistence patterns (house precedents) [VERIFIED: repo]

- Storage writes are guarded `try { localStorage.setItem(…) } catch {}` so private mode keeps working per-session [VERIFIED: `src/components/explore/use-explore-theme.ts:42-46`].
- State initializes to a literal and syncs in a one-shot after-mount effect; NEVER read localStorage during render (hydration contract) [VERIFIED: `use-explore-theme.ts:27-37`; the status bar doc block states the same contract at `explore-status-bar.tsx:10-12`].
- New keys per UI-SPEC §7: `portfolio-explore-tour` (`'seen' | 'completed'`) and `portfolio-explore-visited` (JSON array of valid section ids, filtered on read, deduped, append-only). They must stay disjoint from CLI keys `portfolioCliFoundEasterEggs`, `portfolio-theme`, `portfolio-command-history`, `portfolio-achievements` [VERIFIED: `src/components/cli/constants.ts:64-67`] and the existing `portfolio-explore-theme` [VERIFIED: `src/components/explore/constants.ts:26`]. The `portfolio-explore-` prefix achieves disjointness; a grep-level disjointness test is already the house pattern (`tests/explore-shell.test.mjs:33-36`).
- Client components SSR in the static export: the header (a client-boundary child) is present in `out/explore.html` with its aria-labels today [VERIFIED: export-level test at `tests/explore-shell.test.mjs:425`]; by the same mechanism the Tour button WILL appear in static HTML while the overlay (gated on mounted+tourOpen state) must not.

### 1.7 Radix facts — why the tour is hand-rolled [VERIFIED: node_modules]

The UI-SPEC §0/§9 pins "Radix Dialog's modal machinery is deliberately NOT used". Verified in the installed packages this session:

- `@radix-ui/react-dialog` 1.1.23: `DialogContent` branches on `modal` — `DialogContentModal` sets `trapFocus: context.open` + `disableOutsidePointerEvents: context.open` + `hideOthers(content)` (aria-hides the rest of the page); `DialogContentNonModal` sets `trapFocus: false` + `disableOutsidePointerEvents: false` [VERIFIED: `node_modules/@radix-ui/react-dialog/dist/index.mjs`, DialogContentModal/DialogContentNonModal blocks, ~lines 145-215]. Modal mode would break D-01's pointer pass-through; non-modal still routes outside pointer-down through `DismissableLayer.onDismiss → onOpenChange(false)` [VERIFIED: same file, DialogContentImpl `onDismiss` wiring] — i.e., outside clicks would dismiss the card, which the UI-SPEC §1 forbids ("outside clicks therefore do not dismiss the tour"). Conclusion: neither Radix mode fits; the overlay + card are hand-rolled (a plain fixed div + `role="dialog" aria-modal="false"` card), with Radix remaining only as the pattern reference the canonical refs intend, and the drawer continuing to use Sheet untouched.
- `@radix-ui/react-dismissable-layer` 1.1.19 (the drawer's ESC engine): registers `keydown` on `ownerDocument` with `{ capture: true }` only while it is the highest layer [VERIFIED: `node_modules/@radix-ui/react-dismissable-layer/dist/index.mjs`, `isHighestLayer` effect, ~lines 101-108]. This grounds the UI-SPEC §9 ESC ordering contract (tour registers its own document-capture keydown on open; `stopImmediatePropagation()` when dismissing so one ESC press never closes both surfaces).

### 1.8 Z-landscape [VERIFIED: repo]

Sheet overlay/content and Dialog are `z-50`, portaled to `<body>` [VERIFIED: `src/components/ui/sheet.tsx:24,34,60`; `src/components/ui/dialog.tsx:24,41`]. No other z-index exists under `src/components/explore/` [VERIFIED: grep — only the shell chrome is z-auto]. A `z-40` overlay rendered inside `.explore-shell` sits above all shell content and below a mid-tour drawer, exactly as UI-SPEC §1 pins.

### 1.9 Sizing + token facts the tour inherits [VERIFIED: repo]

- `rounded-md` = `calc(var(--radius) - 2px)` with `--radius: 0.25rem` inside both shell blocks → hole radius 2px, matching panel corners [VERIFIED: `tailwind.config.ts:63-67` borderRadius map; `src/app/globals.css:530,566`].
- ≤640px `html{font-size:14px}` rem-shrink rule exists — px-based sizing for all tour controls (44px targets) is mandatory [VERIFIED: `globals.css:464-466`; precedent note at `explore-header.tsx:13-15`].
- No custom Tailwind screens — defaults sm 640 / md 768 / lg 1024 [VERIFIED: `tailwind.config.ts` (no `screens` key)].
- `Compass` icon exists in the installed lucide-react 0.475.0 [VERIFIED: `node_modules/lucide-react/dist/esm/icons/compass.js`].
- The counter's live region already exists: `<p aria-live="polite">` wraps the counter span today [VERIFIED: `src/components/explore/explore-status-bar.tsx:28-32`]; the current literal is `{`0/${EXPLORE_SECTIONS.length} sections visited`}` at line 31 (quoted verbatim) — the only source edit needed for EXPLORE-04c is swapping the literal `0` for the live count.

---

## 2. Package legitimacy

**D-08 / UI-SPEC §0: zero new dependencies.** No new package is proposed; every package the phase touches is already installed and was verified this session:

| Package | Installed | Verified use | Source |
|---|---|---|---|
| `lucide-react` | 0.475.0 | `Compass` icon present for the Tour button | [VERIFIED: `node_modules/lucide-react/package.json` + `dist/esm/icons/compass.js`; listed in `package.json:44`] |
| `@radix-ui/react-dialog` | 1.1.23 | NOT used by the tour (§1.7); drawer keeps Sheet; `modal` prop exists if ever revisited | [VERIFIED: `node_modules/@radix-ui/react-dialog/package.json` + `dist/index.mjs`] |
| `@radix-ui/react-dismissable-layer` | 1.1.19 | ESC capture facts grounding §9 ordering (transitively active via drawer) | [VERIFIED: `node_modules/@radix-ui/react-dismissable-layer/package.json` + `dist/index.mjs:101-108`] |
| `next` | ^15.5.10 | `next/link` internal same-tab nav for the finish card (`href="/"`) | [VERIFIED: `package.json:45`; Link is the framework's built-in internal navigation — ASSUMED behavior for static export, standard] |
| `react`/`react-dom` | ^18.3.1 | hooks only (useState/useEffect/useRef/useCallback) | [VERIFIED: `package.json:47-49`] |
| `node:test` (built-in) | Node v24.16.0 | house test runner, zero deps | [VERIFIED: `tests/explore-shell.test.mjs:13-14` header; runner experiment this session] |

No registry lookups were needed beyond node_modules because no dependency is added; per D-08 any plan step proposing an install is out of scope.

---

## 3. Risks

- **R-1 (flagged conflict — pinned value fails on target devices).** The pinned dim `box-shadow: 0 0 0 100vw rgba(0,0,0,0.7)` (D-01 verbatim, UI-SPEC §1) under-covers portrait phones: the shadow extends `100vw` beyond the hole in every direction, so on a 375×812 phone a cut-out whose bottom edge sits above `812 − 375 = 437px` leaves an unshaded strip at the bottom (e.g. a short Contact panel aligned to the container top leaves ~25-125px unshaded on tall phones; worse at 430×932). The spread unit must be `100vmax` (or a fixed large px) to guarantee coverage on tall portrait viewports — same one-element technique, same color, one character changed. **This amends a pinned string** (UI-SPEC §12 item 5 greps `0 0 0 100vw`) — the planner must surface the amendment explicitly in the plan (and update the §12 grep in the same stroke), per UI-SPEC §13's "do not silently redesign" rule.
- **R-2 (flagged conflict — IO threshold vs tall panels).** UI-SPEC §5 pins `threshold: 0.5`. The threshold is a ratio against the TARGET's bounding box [CITED: MDN IntersectionObserver], so any panel taller than 2× main's visible height (~692px at 375×812 → panels > ~1384px) can NEVER reach 0.5 and would never be marked by scroll — plausibly the About or Projects panel at 375px. Fix that preserves the ~50% intent: per-element height-aware threshold `min(0.5, (rootVisibleHeight × 0.5) / panelHeight)` computed per panel at observer creation (mark when the panel covers ~half the visible viewport, or 50% of a short panel). Wizard arrivals are unaffected (marked at step activation). Planner surfaces the amendment.
- **R-3 (flagged conflict — E-3 vs §0 byte-untouched drawer).** UI-SPEC E-3's parenthetical ("one `onSectionSelect` callback prop") would edit `explore-drawer.tsx`, which §0 declares byte-untouched. Resolution: IO-only marking (OQ-3) — the drawer's anchor scroll is observed like any other scroll, no drawer edit, §0 preserved. The planner should note E-3's marking is satisfied via the IO path.
- **R-4 (suite goes red mid-phase).** `tests/explore-shell.test.mjs:78` asserts the literal `0/${EXPLORE_SECTIONS.length} sections visited` in the status-bar SOURCE — it fails the moment the counter goes live. The test update is part of the counter task (same commit), never deferred. The export-level assertion at `:379` (`html.includes('0/5 sections visited')`) survives because SSR still renders the literal-0 initial state.
- **R-5 (hydration).** The overlay must be absent from SSR/first paint: gate on a mounted flag + read both storage keys only in effects (literal-init precedent). Tour button + counter SSR as their literal defaults (`0/5`), then sync after mount — the same accepted brief-wrong-value tradeoff as the theme label [VERIFIED precedent: `use-explore-theme.ts:30-37`].
- **R-6 (containing block fragility).** Fixed positioning of the overlay depends on no ancestor between it and the viewport being transformed. True today [VERIFIED: shell root classes], so add a one-line comment in the tour component forbidding transforms on shell ancestors (a future `animate-*`/`transform` on `.explore-shell` would silently break all overlay math).
- **R-7 (ESC coexistence).** Radix's capture-phase document keydown coexists with the tour's own; the §9 ordering (tour dismisses + `stopImmediatePropagation()` when the tour opened first) is implementable exactly as pinned and verified against the installed layer source (§1.7). Card-element-level keydown additionally handles Enter/Space/Arrow keys per §6.
- **R-8 (private mode).** All storage access guarded; tour becomes per-session (opens every visit), counter per-session. Pinned E-7; theme-hook precedent verified.
- **R-9 (no-JS).** Overlay renders nothing without JS (client-only); page remains fully usable — consistent with the shell's existing no-JS contract (sr-only h1, anchors resolve to server-rendered panel ids) [VERIFIED: `explore-intro.tsx:43`, `panel-shell.tsx:39-42`].

---

## 4. Open Questions

- **OQ-1 — Which overlay primitive: Radix Dialog or hand-rolled? — (RESOLVED)** Hand-rolled fixed overlay + card with `role="dialog" aria-modal="false"`. Radix modal mode breaks D-01 pass-through (`disableOutsidePointerEvents` + `hideOthers`); Radix non-modal mode still closes on outside pointer-down (`DismissableLayer.onDismiss`), which the UI-SPEC forbids. Both verified in installed source (§1.7). Radix stays a pattern reference only; no new usage.
- **OQ-2 — Does the pinned `100vw` box-shadow spread survive portrait phones? — (RESOLVED, recommend amendment)** No — see R-1. Recommend `100vmax` in the plan as a one-line surfaced amendment of D-01's technique-preserving detail (technique, element count, opacity all unchanged). Fallback if the planner declines: keep `100vw` and accept a documented unshaded-strip artifact on tall phones (not recommended — the primary audience is mobile recruiters, EXPLORE-06).
- **OQ-3 — Does visited-marking need a drawer click hook (`onSectionSelect`)? — (RESOLVED)** No. One IntersectionObserver (root = `<main>`) marks every arrival: drawer-anchor scrolls, manual scroll, and wizard `scrollIntoView` all produce scroll-into-view events the observer sees; wizard arrivals additionally mark at step activation per §3. This satisfies "hook the same path the drawer uses, not duplicate it" (CONTEXT code_context) with the drawer byte-untouched (R-3). The IO threshold caveat (R-2) applies to this path and is fixed per R-2.
- **OQ-4 — Is the scrollend fallback still necessary? — (RESOLVED)** Yes. scrollend is Baseline-2025 "Newly available" (December 2025) — older Safari/mobile engines lack it [CITED: MDN scrollend]. Race `scrollend` (on `<main>`) against a ~700ms timeout with an idempotent settle guard, per UI-SPEC §2. The already-in-view fast path is required because "if the scroll position did not change, then no scrollend event fires" [CITED: MDN scrollend].
- **OQ-5 — Can the pure placement function be unit-tested under the house `node --test` harness? — (RESOLVED)** Yes — verified by experiment this session: on Node v24.16.0, an `.mjs` test file imported a `.ts` module directly via native type stripping and assertions passed. Requirement: the placement module must be import-free (no `@/` path aliases, no react) and use erasable TS syntax only; the test imports it WITH the `.ts` extension (`import { placeCard } from '../src/components/explore/tour-placement.ts'`). Factoring `placeCard` into such a module enables UI-SPEC §12 item 3's table-driven tests.
- **OQ-6 — Which existing tests must change this phase? — (RESOLVED)** `tests/explore-shell.test.mjs:73-82` — the static-counter source assertion (line 78) must be rewritten to assert the live-variable form (UI-SPEC §12 item 7 supersedes it); everything else in that file (header order, drawer, export `0/5`, reduced-motion) survives. New checks land in a new `tests/explore-tour.test.mjs` (house pattern: source invariants + `out/explore.html` export invariants).
- **OQ-7 — How is the tour state wired between header, status bar, and wizard? — (RESOLVED)** Lift to `ExploreShell` (the single client boundary): it owns `visited` state (+ IO effect + mainRef) and `tourOpen` state, passes `visitedCount` to the status bar, `onOpenTour` to the header, and `open/onOpenChange/markVisited` to the wizard. No context, no external store — everything already shares this ancestor [VERIFIED: shell composition `explore-shell.tsx:38-56`]. The wizard renders as the LAST child of the shell root (paint order pin, UI-SPEC §1 W-4) and must NOT portal (UI-SPEC §0 pin: inside-shell rendering inherits tokens + reduced-motion guard with zero portal-class work).
- **OQ-8 — Does auto-open race hydration or panel layout? — (RESOLVED)** No. Auto-open fires ~800ms after mount (cancelled by any pointerdown/keydown, §7) and opens at the Welcome step, which measures nothing; content steps measure only after scroll-settle, and all five panels are server-rendered into the static HTML before hydration [VERIFIED: `out/explore.html` emission contract, page.tsx composition]. The tour never depends on measuring before the panels exist.
- **OQ-9 — Focus contract implementation? — (RESOLVED)** Per UI-SPEC §6/§9: card root `tabIndex={-1}` focused (`.focus({ preventScroll: true })`) on open and every step change; card-element-scoped Tab trap (keydown handler on the card element cycling its focusables, suspended while the drawer is open mid-tour); focus returns to the header Tour button on dismiss/finish (it exists in all cases, including auto-open). Standard focus-trap-lite implementation, no Radix involvement.

No open question remains blocked; planning may proceed.

---

## 5. Architectural Responsibility Map

| Capability | Tier | Home | Notes |
|---|---|---|---|
| Overlay/cut-out/card DOM, Tour button, counter span, finish-card Link | presentation | `explore-tour.tsx`, `explore-header.tsx` (edit), `explore-status-bar.tsx` (edit), `explore-shell.tsx` (compose) | Fixed overlay inside shell root, z-40, last child (§1) |
| Step sequence + chrome copy + placement math + visited-id validation | domain (pure) | `constants.ts` additions (keys, step table, copy), `tour-placement.ts` (import-free pure fn) | Pure so `node --test` can exercise them (OQ-5); zero invented portfolio facts |
| localStorage read/write/guards, hydration sync for tour flag + visited set | data | one `use-explore-visited` hook + two key constants | ALL storage access in this module — keeps the CLI-key-disjointness grep (§12 item 1) checkable in one place. A storage write anywhere else is a tier violation |
| IntersectionObserver wiring, scrollend/timeout settle, matchMedia reduced-motion probe, document-capture ESC | integration | inside `use-explore-visited` effect + tour effects | Browser APIs only; no network, no external services |

Security-sensitive placement: the only persisted surface is localStorage. Keys + access confined to the data tier (one hook + constants) is what makes the disjointness invariant (D-05/D-06) mechanically greppable; scattering storage calls across components would be a BLOCKER-grade tier breach.

---

## 6. Validation Architecture

Automated (house pattern: `node --test` source invariants + `out/explore.html` export invariants — no jsdom, component behavior is pinned at source level):

1. Constants: both new keys exported from `explore/constants.ts`; grep-level disjointness from `portfolio-theme` / `portfolioCliFoundEasterEggs` (§12.1).
2. Step sequence: locked 7-entry array; dots = 7; "Step N of 7" derivation (§12.2).
3. `placeCard` table tests: below / below-overflow→above / above-overflow→dock / no-target dock <640 / center ≥640 / width clamp (§12.3) — via direct `.ts` import (OQ-5).
4. Copy constants: every §4 string exported; no digits/facts beyond allowed chrome (§12.4).
5. Overlay DOM contract: `z-40` wrapper, pointer-events split, box-shadow dim on the hole, `rounded-md`, no `createPortal` in tour files (§12.5 — plus the R-1 spread amendment if adopted).
6. Export-level: Tour button (`aria-label="Start the guided tour"`) present in `out/explore.html`; tour overlay/card markup ABSENT (client-mount-only) (§12.6).
7. Status bar: live variable (no literal `0/`), `text-accent` branch at 5, `visitedCount` prop, `aria-live` unchanged (§12.7).
8. Header: Tour→Theme→Drawer source order, 44px px classes, Compass import, drawer-rightmost pin intact (§12.8).
9. ESC contract: document keydown capture + `stopImmediatePropagation` (§12.9).
10. Reduced motion: `scrollIntoView` behavior branches on matchMedia; no transitions on hole/card geometry; opacity-only ≤150ms fade permitted (§12.10).
11. Storage: guarded try/catch writes; visited read filters invalid ids (§12.11).
12. Gates on the final tree: `npm run build` (CI gate; static export — `output: 'export'`, `next.config.ts:5`), `npm run typecheck`, full `node --test tests/*.test.mjs` suite green. Note: there is NO `test` script in `package.json` and CI runs build only [VERIFIED: `package.json` scripts; `.github/workflows/deploy.yml:60`] — the suite is invoked directly. **PLANNER CORRECTION (verified live this session):** the bare directory form `node --test tests/` FAILS on Node 24 (it treats the path itself as a single failing 'tests' entry); the proven house invocation is the glob form `node --test tests/*.test.mjs` — 93 pass / 0 fail on the pre-phase tree.
13. Stale-test update is itself a check: `tests/explore-shell.test.mjs` static-counter assertion replaced by the live-variable assertion in the same task as the counter change (R-4).

Manual UAT (not automatable in node:test — enumerate in the phase's human-verification list): 375px dock mode + no horizontal scroll; spotlight alignment through real scrolling; auto-open exactly once + persists across reloads; reduced-motion instant jump; drawer-mid-tour ESC ordering (tour first, drawer next press); private-mode behavior (tour per-session, counter per-session).

---

## 7. Project Constraints (from conventions, verified this session)

- **Augment-only:** new files under `src/components/explore/` only; CLI (`src/app/(main)`, `src/components/cli/`), `/resume`, data files byte-untouched; the drawer keeps its internals untouched (R-3/OQ-3 resolution). The only edited existing files: `explore-shell.tsx`, `explore-header.tsx`, `explore-status-bar.tsx`, `constants.ts` (additions), `globals.css` (at most a comment), and the stale test file.
- **Zero new dependencies** (D-08) — everything needed is installed and verified (§2).
- **SSG/static export:** `output: 'export'` [VERIFIED: `next.config.ts:5`]; overlay client-mount-only; Tour button SSRs; counter SSRs as the literal `0/5`.
- **px-based sizing** below sm (rem shrink at ≤640px, `globals.css:464-466`); all tour touch targets 44px real px.
- **Portaled content must carry the `explore-shell` marker class** — irrelevant for the tour (renders inside the shell, §0 pin) but the drawer precedent stands [VERIFIED: `explore-drawer.tsx:12-15,48`].
- **Storage discipline:** guarded try/catch; literal init + after-mount sync; explore-scoped keys only.
- **No GA wiring this phase** (GA id lives in the root layout; out of scope per CONTEXT deferred list).
- **Copy register:** chrome, playful, zero invented portfolio facts; section names from `EXPLORE_SECTIONS`; welcome/finish headings are chrome literals (`explore --tour`, `tour complete`).
</arg_value></tool_call>