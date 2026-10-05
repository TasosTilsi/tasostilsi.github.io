I have everything I need. Writing the research document.

# Phase 13: mobile-parity-revision — Research

**Phase:** 13 · **Goal:** full mobile parity (arc + swipe stack at every width, avatar removed, mobile-native platform pack).
**Method:** every claim below was read this session from the working tree, the installed `node_modules`, or an authoritative external source. The phase already has a **UI-SPEC** (`.planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-mobile-parity-revision-UI-SPEC.md`) which is the layout/geometry authority; this RESEARCH does **not** relitigate it. It (a) grounds its load-bearing claims in evidence, (b) **corrects three of its claims**, and (c) surfaces the gaps it does not cover — the most important being a real-hardware trap that makes REV-23b's acceptance unachievable on a phone with Reduce Motion enabled.

---

## 1. Domain analysis

### 1.1 The stack (confidence: HIGH — all verified in-repo)

| Thing | Fact | Provenance |
|---|---|---|
| Framework | Next.js `15.5.25`, App Router, `output: 'export'` (static HTML per route) | [VERIFIED: `next.config.ts`; `node_modules/next/package.json`; `out/{index,cli,resume}.html` exist] |
| React | `18.3.1`, `react-dom` 18.3.1 | [VERIFIED: `package.json`] |
| Styling | Tailwind `3.4.1` + `tailwindcss-animate`; custom IDE tokens in `globals.css` under `.explore-shell` | [VERIFIED: `package.json`; `tailwind.config.ts`; `src/app/globals.css:495-586`] |
| Motion | `framer-motion 13.4.3` (installed + registry-verified). **Only** the projects stack imports it. | [VERIFIED: `src/components/explore/sections/projects-stack-stage.tsx:53`; `node_modules/framer-motion/package.json`] |
| Tests | `node --test tests/*.mjs` — **14 suites, source-grep + pure-function + built-export assertions. No DOM/browser test infra** (no jsdom, no Playwright, no testing-library). | [VERIFIED: `package.json` `"test": "node --test tests/*.mjs"`; `devDependencies` contains only `@types/*`, `postcss`, `serve`, `tailwindcss`, `typescript`] |
| Breakpoint | Exactly one: **`md` = `min-width: 768px`** (the query already in the timeline hook) | [VERIFIED: `src/components/explore/use-timeline-progress.ts:162`] |

**Consequence for validation (§5):** there is no browser instrument in this repo. Every *responsive* and *touch* claim in REV-23/REV-23b/REV-25 is therefore provable only by (1) source greps, (2) pure-function unit rows, (3) assertions on the built `out/*.html`, or (4) the user's real phone. Anything else claimed about the phone is unfalsifiable in CI.

### 1.2 The six `<md` simplification sites (the real scope of "full parity")

This is the phase's central discovery: **`hidden md:flex` is one of six gates, not the gate.** All six were read verbatim:

| # | Site | Exact current text | Effect below `md` |
|---|---|---|---|
| 1 | `src/components/explore/sections/experience-section.tsx:134` | `<div className="hidden md:flex md:flex-col">` | phones never see the arc **or the controls inside it** |
| 2 | `src/components/explore/sections/experience-section.tsx:132` | `<div className="gap-4 md:grid md:h-[calc(100dvh-14rem)] md:grid-cols-[2fr_3fr]">` | one column, no fixed stage height |
| 3 | `src/components/explore/sections/experience-section.tsx:258` | `"md:col-start-1 md:row-start-1"` | layers are **in flow** at `<md` (all five readable) instead of overlapped |
| 4 | `src/components/explore/use-timeline-progress.ts:204` | `if (!mdMedia.matches) return; // dormant below md (B-1 path b)` | `derive()` never runs → markers unpositioned |
| 5 | `src/components/explore/use-timeline-progress.ts:329` and `:348` | `if (!window.matchMedia('(min-width: 768px)').matches) return;` | `goToRole` and arrow keys are dead |
| 6 | `src/components/explore/explore-panels.tsx:140` | `wrapper: 'md:col-span-2 md:h-[300vh]'`, `shell: 'md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]'` | **there is no scroll range below `md`** → `computeProgress` has no input → progress is structurally pinned at 0 |

`[VERIFIED]` each line above, read this session. Sites 4–6 mean the `<md` arc can only ever be a **rest-state** arc (`c′ = 0`) unless a second input channel (a discrete stepped index) is added — which is exactly UI-SPEC `RESOLVED-D1`. **The plan must treat "retire `hidden md:flex`" as the smallest of five edits.**

### 1.3 Patterns this phase must follow (all pinned by tests)

- **One derivation site per concern.** Pure modules (`timeline-geometry.ts`, `projects-card-state.ts`) own every formula; components never shape values inline. `timeline-geometry.ts:16-21` declares "ZERO runtime imports" and erasable-TS-only so `node --test` can strip types directly. Any new derivation (e.g. the anchor budget, the discrete `<md` index) belongs in the pure module or the hook — never in JSX. [VERIFIED: `timeline-geometry.ts:1-40`; `projects-card-state.ts:1-20`]
- **Responsive behaviour is Tailwind-class-derived, never width-sniffed in JS.** The only `matchMedia` in the explore tree are the reduced-motion read and the one `md` gate — pinned by `tests/explore-visuals.test.mjs:883-896` (exactly one `addEventListener('change')`, and it must ride `(min-width: 768px)`). No new breakpoints, no `hover`/`pointer` queries. [VERIFIED: `tests/explore-visuals.test.mjs:883-896`]
- **Server components stay server.** `clientBodies` is a *fixed list* (`tests/explore-visuals.test.mjs:186-189`); `about-section.tsx` is a server component with no hooks. Deleting `projects-mobile-stack.tsx` from that list is mandatory (a stale list makes `readFileSync` throw ENOENT). [VERIFIED: `tests/explore-visuals.test.mjs:186-189, 1047-1051`]
- **SSG-safe / hydration-safe.** Server and first client render must agree: the projects stack mount-gates `useReducedMotion` for exactly this reason (`projects-stack-stage.tsx:604-613`). Any `<md` state added to the timeline must not be read during render. [VERIFIED: `projects-stack-stage.tsx:604-613`]
- **Retirement discipline.** A retired artefact gets a **gone-check** (`assert.equal(existsSync(path), false)`), not a silent delete — the phase-10/11 precedent. [VERIFIED: `tests/explore-visuals.test.mjs:940-945, 1047-1051`]

### 1.4 Pitfalls, ranked

| # | Pitfall | Why it bites | Confidence |
|---|---|---|---|
| P1 | **`<main>` is already a horizontal scroll container.** `<main>` declares only `overflow-y-auto`; per CSS, when one axis is not `visible` the other computes to `auto`. | This *is* the user's "extra scrollbars" mechanism, and it makes any arc label painting outside the arc zone a real scrollbar. | HIGH — [VERIFIED: `explore-shell.tsx:77`]; [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/overflow] |
| P2 | **The `dateLineFits` call site feeds the predicate the wrong number.** `const dateFits = dateLineFits(active.entry.duration, arcZoneWidth ?? 250);` — it passes the **full measured zone width**, while `dateLineFits` internally subtracts 16 (`duration.length * 6 <= innerWidthPx - 16`). The label is right-aligned at the focal anchor `x = W/2 − 0.38R`, so the real budget is that anchor, not the zone width. | At 768px this admits a 20-char duration that then paints ~70px left of the zone → horizontal overflow inside `<main>` (P1). The predicate must receive the **anchor budget**, not the zone width. | HIGH — [VERIFIED: `experience-section.tsx:128`; `timeline-geometry.ts:319-322`; hook:180 sets `arcZoneWidth` from the measured rect] |
| P3 | **Fixed-height bars + safe-area padding = crushed content.** Tailwind preflight sets `box-sizing: border-box`, so `height: 52px` + `padding-top: env(safe-area-inset-top)` (47–59px on a notched iPhone) leaves ~0px for the 44px controls. | The fix must pair padding with height compensation (`calc(52px + env(...))`), which the UI-SPEC does. | HIGH — [CITED: https://tailwindcss.com/docs/preflight (border-box reset)]; [CITED: https://webkit.org/blog/7929/designing-websites-for-iphone-x/] |
| P4 | **`env(safe-area-inset-*)` is `0px` without `viewport-fit=cover`.** | The platform pack is inert until the meta lands — the two changes are coupled and must ship in the same phase (they do). | HIGH — [CITED: https://webkit.org/blog/7929/designing-websites-for-iphone-x/]; [VERIFIED: `out/index.html` viewport metas carry no `viewport-fit`] |
| P5 | **Two `<meta name="viewport">` tags are emitted today on every route.** | Whatever the tie-break, the document is in an undefined state; the fix is to emit exactly one. | HIGH — [VERIFIED: `out/index.html`, `out/cli.html`, `out/resume.html` each carry `content="width=device-width, initial-scale=1, shrink-to-fit=no"` **and** `content="width=device-width, initial-scale=1"`] |
| P6 | **The `<md` stepped index can be stomped by the scroll path.** `derive()` writes `setActiveIndex(active)` on change (`hook:258-261`), and the ResizeObserver fires on the URL-bar collapse right after a tap. | A stepped arc that snaps back to entry 0 = the phone user sees "the buttons do nothing". Must gate the `setActiveIndex` write below md. | HIGH — [VERIFIED: `hook:258-261, 292-295`] |
| P7 | **Framer-motion's reduced-motion read is live on the first client render.** | See §3/R1 — this is the phase's highest-risk item. | HIGH — [VERIFIED: `node_modules/motion-dom/dist/es/render/utils/reduced-motion/index.mjs` sets `prefersReducedMotion.current` synchronously; `framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs` returns it] |
| P8 | **The pointer-event channel is the only drag channel.** framer-motion binds `pointerdown` with no touch fallback. | Fine on iOS Safari 13+/Android Chrome; *not* a cause of the reported touch failure — which is why P7 is the leading hypothesis. | HIGH — [VERIFIED: `node_modules/framer-motion/dist/es/gestures/drag/VisualElementDragControls.mjs:450-452`] |

---

## 2. Package legitimacy

**No new dependency is proposed or needed.** The phase constraint is explicit ("no new dependencies"), and the one engine it uses is already installed.

| Package | Claim | Verification | Verdict |
|---|---|---|---|
| `framer-motion@13.4.3` | Published, real, the drag engine; peer-depends on React 18/19 | `npm view framer-motion@13.4.3` → `version = '13.4.3'`, tarball `https://registry.npmjs.org/framer-motion/-/framer-motion-13.4.3.tgz`; deps `tslib ^2.4.0`, `motion-dom ^13.4.2`, `motion-utils ^13.3.0`; `package-lock.json` `node_modules/framer-motion` → same version/tarball + `sha512-mPQe1GtRHWS30zRGaQAfmlIg0baA0jRhkpbFPT1d+s9bZPjMW6pJSjWM6ArmUEjzMgEm089ZL1wd8aPv1/5DJQ==` | **[VERIFIED: registry + installed lock + tarball source read this session]** |
| `framer-motion` inline drag style | `drag="x"` ⇒ the element gets inline `touch-action: pan-y`, `user-select: none`, `-webkit-user-select: none`, `-webkit-touch-callout: none`, `draggable=false` | Read from the installed tarball: `node_modules/framer-motion/dist/es/render/html/use-props.mjs:40-47` | **[VERIFIED: installed package source]** |
| `framer-motion` RM hook | `useReducedMotion()` returns the OS value on the **first client render** (server value `null`) | `node_modules/framer-motion/dist/es/utils/reduced-motion/use-reduced-motion.mjs` (`useState(prefersReducedMotion.current)`) + `node_modules/motion-dom/dist/es/render/utils/reduced-motion/{index,state}.mjs` | **[VERIFIED: installed package source]** |
| `next@15.5.25` metadata | `viewport` export accepts `viewportFit: 'auto' \| 'cover' \| 'contain'`; the resolved tag is built from the merged viewport object; the merged defaults supply `width=device-width, initial-scale=1` | `node_modules/next/dist/lib/metadata/types/extra-types.d.ts:52`; `node_modules/next/dist/lib/metadata/generate/basic.js:52-83` (`resolveViewportLayout`, `ViewportMeta`); `node_modules/next/dist/lib/metadata/constants.js:23-32` (`ViewportMetaKeys`); `node_modules/next/dist/lib/metadata/default-metadata.js:22-30` (`createDefaultViewport`) | **[VERIFIED: installed Next source + the emitted `out/index.html`]** |
| `lucide-react@0.475.0` | No new icons required (`ChevronUp/Down`, `ArrowUpRight` already imported by the two stages) | `projects-stack-stage.tsx:54`; `experience-section.tsx:76` | **[VERIFIED: in-repo]** |

**No `[ASSUMED]` package claims are load-bearing for this phase.** Nothing new is installed, so there is no supply-chain surface to vet.

---

## 3. Risks

### R1 — BLOCKER-ADJACENT: a phone with Reduce Motion ON cannot pass REV-23b's swipe acceptance, by the locked contract

This is the phase's highest-value finding and it is **not** covered anywhere in the SPEC, CONTEXT, or UI-SPEC as a contradiction.

The chain, every link read this session:

1. `projects-stack-stage.tsx:581` — `drag={isFront && !reducedMotion ? 'x' : false}`. Under reduced motion the drag gesture is **off entirely**.
2. `projects-stack-stage.tsx:604-613` — `const prefersReduced = useReducedMotion() ?? false; const reducedMotion = mounted ? prefersReduced : false;` → after mount, `reducedMotion === true` on a device with the OS setting on.
3. `motion-dom` sets `prefersReducedMotion.current` **synchronously** from `matchMedia('(prefers-reduced-motion)')` on the first `useReducedMotion()` call → this is the real OS state, not a stale default.
4. REV-20's locked acceptance (shipped + verified in phase 10) says: *"reduced motion is opacity/zIndex state swaps …, is mount-gated … **and disables drag**"* — and phase-10 VERIFICATION rows R5/R12/P02-5 pin `drag` off under RM as a **verified** requirement.

Meanwhile this phase's own acceptance for REV-23b says *"touch drag, behind-cards visible, centered, depth shadows"* and the UI-SPEC's phone checklist §10 item 6 says *"touch drag swipes the card away"* — while the checklist preamble says to test *"reduced-motion on and off"*.

**These cannot all be true.** On a phone with Reduce Motion enabled, item 6 fails by design.

**Why this is likely the actual bug report.** The user's real-phone report includes *"swipe stack dead on touch"* alongside *"starting guide OK"*. The wizard has no drag. The stack has exactly one way to be dead that is invisible from the desktop: the OS setting. If the test phone has Reduce Motion on (a very common accessibility setting), the reported symptom is fully explained, and the phase would ship "parity" that still looks dead on that device.

**What must happen before planning proceeds —** see **OQ-1** (RESOLVED under the default policy (a); the setting's VALUE is captured as plan 04's pre-execute precondition — it needs the user, not the code).

### R2 — HIGH: the platform pack's CSS placement can break two pinned motion-region tests

`tests/explore-visuals.test.mjs:445-452` (twin at `:530-540`) defines the "motion region" as the line range **from `@keyframes explore-panel-in` to the FIRST `@media (prefers-reduced-motion: reduce)`**, and asserts that **every line in that region ending in `{`, unless it starts with `@keyframes`, contains `.explore-shell`**; a second pass asserts every `transition:` duration in the region is 200–280ms. `tests/credentials-panel.test.mjs:373` additionally asserts **exactly one** reduced-motion media query in the file.

⇒ The UI-SPEC's phrasing *"All declarations go in `globals.css`, after the Tailwind directives, next to the existing `.explore-shell` blocks"* is **unsafe if read as "inside the motion region"**: the safe-area block needs `@media (min-width: 640px) {` (to restore the ≥640px footer band), and that selector line contains no `.explore-shell` → **RED**.

**Hard rule for the plan: append the entire platform pack AFTER the reduced-motion guard block (the true file tail).** Then `guardIdx` (first occurrence, line 681) is unchanged, the region `[595, 681]` is untouched, and both pins stay green. The pack adds no `transition:` and no second RM query, so both constraints hold. [VERIFIED: `src/app/globals.css:588-694`; `tests/explore-visuals.test.mjs:445-452, 530-540`; `tests/credentials-panel.test.mjs:373`]

### R3 — HIGH: the date-line budget cannot be computed where the UI-SPEC says it can

UI-SPEC §3.1d says the call site passes `budget = W/2 − 0.38·R`. But the hook exposes **only** `arcZoneWidth: number | null` — not the height and not `R`. And `R = 100·min(W/100, H/200)`, where `H` is not statically known at `md+` (the zone is `flex-1` / grid-stretched inside a `calc(100dvh - 14rem)` box).

⇒ The plan **must** widen the hook's public interface (e.g. expose the derived **anchor budget in px**, or the whole `ArcGeometry`) rather than "change the call site". UI-SPEC lines 122-123 of the hook: `arcZoneWidth: number | null` is the entire geometry surface it hands out. [VERIFIED: `use-timeline-progress.ts:115-128, 177-182`]

### R4 — MEDIUM: the UI-SPEC's "W-1 minimal-edit trap" is falsified; the recommendation still stands

UI-SPEC §3.4a asserts that adding only `viewportFit` to the typed export would produce `<meta content="viewport-fit=cover">` **with no `device-width`** ("a severe regression"). That is **false** for Next 15.5.25:

- `createDefaultViewport()` returns `{ width: 'device-width', initialScale: 1, themeColor: null, colorScheme: null }` and is merged under the page's export.
- The **current** export declares only `themeColor` — yet `out/index.html` emits `content="width=device-width, initial-scale=1"`.

⇒ The default supplies `width`/`initialScale`. Adding them explicitly is still the right call (intent, and resilience to a framework-default change), and it makes the emitted tag order deterministic — but the plan must **not** encode "omitting them is a severe regression" as a rationale or a red test, because that rationale is untrue. [VERIFIED: `node_modules/next/dist/lib/metadata/default-metadata.js:22-30`; `generate/basic.js:52-83`; `out/index.html`]

### R5 — MEDIUM: two `<meta name="viewport">` tags ship today (all three routes)

Verified in `out/index.html`, `out/cli.html`, `out/resume.html`: the data-driven `…, shrink-to-fit=no` line **and** Next's own default line. `shrink-to-fit` has had no modern effect for years, and multi-tag tie-breaks are browser-defined — so the current phone is running on an undefined viewport declaration. This is the root of the "no safe areas / gap / extra scrollbar" cluster. The fix (one tag, `viewport-fit=cover`) is unambiguous. [VERIFIED: the three exports]

### R6 — MEDIUM: `body { overscroll-behavior: none }` is inert; only the `html` declaration is load-bearing

`overscroll-behavior` is **not inherited** and is propagated to the viewport only from the **root** element. Since the landing locks `html, body { overflow: hidden }`, `body` is not a scroll container, so a declaration on it does nothing. Keep both (harmless, matches the UI-SPEC) but the plan must not treat the body rule as the mechanism, and the phone checklist item "no bounce / no strip below the footer" is testing the `html` rule. [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior]; [VERIFIED: `src/app/(home)/layout.tsx:52-58`]

### R7 — MEDIUM: `touch-action` inheritance/intersection semantics

`touch-action` is **not inherited** and the browser **intersects** the touched element's value with its ancestors' up to the first containing scrolling element. Consequences the plan should encode:

- `.explore-shell [data-projects-swipe-stage] { touch-action: pan-y }` is a **structural** pin. The *card's* gesture is driven by framer's **inline** `pan-y`, which is only present while `drag` is truthy — i.e. on the front card only, and **not at all under reduced motion**. The CSS pin is what keeps vertical page scroll correct on every non-front card.
- `.explore-shell a { touch-action: manipulation }` intersects with the stage's `pan-y` → a horizontal drag starting on the in-card `View project` link **still** reaches the gesture. No conflict.
- Never `touch-action: none` on the stage (it would kill vertical scroll — the exact "carousel scrolls the wrong way" symptom). [CITED: https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action]; [VERIFIED: framer `use-props.mjs:40-47`; `projects-stack-stage.tsx:581`]

### R8 — LOW: `-webkit-tap-highlight-color` is inherited, so `html` is a valid carrier (and it reaches the portaled drawer)

Two independent engines confirm `inherited: true` → one declaration on `html:has(.explore-shell)` kills the tap flash shell-wide, **including** the portaled Sheet, because inheritance travels from `html` through the DOM regardless of the portal root. [VERIFIED: Chromium `third_party/blink/renderer/core/css/css_properties.json5` (`-webkit-tap-highlight-color`, `inherited: true`); WebKit `Source/WebCore/css/CSSProperties.json:14272-14280` (`"inherited": true`)]. `overscroll-behavior` is not inherited, hence the separate `html`/`body` listing.

**Drawer coverage note (not in the UI-SPEC):** the portal *content* already carries the scope class — `<SheetContent side="left" className="explore-shell">` (`explore-drawer.tsx:53`) — so all `.explore-shell button/a/[role=button]` rules cover the drawer. The *overlay* does **not** carry the class; anything that must apply to it needs the existing `body:has(.explore-shell) [data-state="open"]` precedent (`globals.css:684`). [VERIFIED: `explore-drawer.tsx:13,52-53`; `globals.css:681-694`]

### R9 — LOW: the extra stale pin the UI-SPEC's renewal table misses

`tests/projects-stack.test.mjs:515` asserts the **literal template expression** `'${widthClass} ${stageHeightClass} overflow-hidden'` in the stage source. The mode-Record retirement must therefore either keep those two variable names or renew that pin — the UI-SPEC's §9.1 table lists `:463-471` and `:495-509` but **not** `:515`. Also `:517-537` pins the bottom-anchored card box, no `inset: 0`, and **no negative margin/inset utilities** on the stage or the panels — the mobile layout must respect that. [VERIFIED: `tests/projects-stack.test.mjs:515-544`]

### R10 — LOW: the pre-measurement stand-in width is a magic number

`dateLineFits(…, arcZoneWidth ?? 250)` uses `250` until the first measured frame. At `<md` the real zone measures ~309×200 → `R = 100`. Whatever budget conversion lands (R3), the fallback must be expressed in the **budget's** units too, or the first paint and the measured paint disagree. [VERIFIED: `experience-section.tsx:128`; `hook:177-182`]

---

## Open Questions

> **Gate:** every item must be `(RESOLVED)` before planning proceeds. `OQ-1` is the only one that requires the user.

### OQ-1 — (RESOLVED — default policy (a) + a pre-execute precondition) Does the real test phone have Reduce Motion enabled, and if so, which contract wins?

**Blocking reason:** REV-23b's acceptance ("touch drag works") and REV-20's locked, shipped-and-verified acceptance ("reduced motion … disables drag") are mutually exclusive on a device with the OS setting on. R1 documents the full chain. Nothing in the phase artefacts acknowledges this, so the planner would silently ship a swipe stack that is dead on the very device the phase is judged on. This is a **user-owned choice** (it changes a locked requirement) and cannot be resolved by inspection.

**What unblocks it (in order):**
1. The user checks the test phone: **Settings → Accessibility → Motion → Reduce Motion**. (10 seconds.)
2. **If OFF** → no code change. The plan must add the RM state to the phone checklist as an explicit **precondition** for the swipe items, and the `<md` parity claim is a **width** contract (REV-20's RM contract is orthogonal and unchanged). Recommend this as the default reading.
3. **If ON** → the user chooses:
   - **(a) Test with it off** — parity is a width contract; RM is a separate a11y contract that intentionally trades the gesture away. Zero code change; record the precondition.
   - **(b) Amend REV-20** — keep `drag` enabled at every motion preference, and route the drag release through the existing RM branch (`cycle()`'s instant `handleSwipe(step.ringDelta)` path, `projects-stack-stage.tsx:641-648`) instead of the 220ms fly-off. This is the only change that makes REV-23b's "touch drag" literally true on every device; it requires renewing phase-10's RM pins (`projects-stack.test.mjs` R5/R12/P02-5 rows) and is therefore **scope the user must explicitly grant**.

**Researcher recommendation:** default to (a) **plus** a one-line note in the plan that the swipe parity claim is conditional on Reduce Motion being off; offer (b) only if the user says the phone has it on. Do not silently implement (b) — it edits a verified requirement from a closed phase.

**Resolution (recorded by the phase-13 planner, revision 1):** closed on this researcher's own recommended default — **option (a): no code change**, with the Reduce-Motion state as an explicit precondition. Plan **01 (wave 1)** carries it as a `<pre_execute_precondition>` — promoted from plan 04's block by the plan-checker revision, so the 10-second Settings check is put to the user BEFORE the first executor runs and waves 1-3 never execute with the question unanswered — and plan 04 Task 2 records the actual setting value in `EXPLORE-13-MOBILE-CHECKLIST.md`; option (b) stays available only on an explicit user grant. No user answer is claimed here: the gate is closed on the **policy**, and the **value** is captured at execution time, so the swipe items are never read as PASS/FAIL without it.

### OQ-2 — (RESOLVED) The viewport-export "minimal-edit trap"

R4 falsifies the UI-SPEC's stated failure mode; the mitigation is unchanged. **Decision:** declare `width: 'device-width'`, `initialScale: 1`, `viewportFit: 'cover'` explicitly in `src/app/layout.tsx:59-64`, keep the `themeColor` array byte-identical, delete the `<meta name="viewport" content={portfolioData.meta.viewport} />` line at `:104`, keep `<meta charSet>` at `:103`. Pin the **emitted** string on `out/index.html` (`viewport-fit=cover` present, `shrink-to-fit` absent, exactly **one** `name="viewport"` tag) — that pin is the real falsifier, and it is available because the repo builds the export. **Never** emit `maximum-scale`/`user-scalable=no`. [VERIFIED: `src/app/layout.tsx:59-64, 103-104`; `out/index.html`]

### OQ-3 — (RESOLVED) Where the platform pack lives

**Decision:** `globals.css`, **appended after the reduced-motion guard (the file tail)**, route-scoped with `:has(.explore-shell)` / `body:has(.explore-shell)`. Rationale, all verified:
- The `(home)` inline lock is **not** extended with the pack: two regex pins depend on its byte shape (`tests/route-swap.test.mjs:157-161`, `tests/projects-stack.test.mjs:606-610` — the latter located by its message `the landing layout pins html, body { height: 100%; overflow: hidden; } — kills the WINDOW scrollbar`; the range `:592-598` cited in an earlier revision was stale), and the lock is genuinely route-scoped only because each route is a separate exported HTML file (`out/cli.html`/`out/resume.html` contain zero `overflow: hidden`) — so putting element-level rules there would work but churn the lock's pinned text for no gain.
- Not in the components: `tests/explore-header.test.mjs:118-140, 163-168` pin the header's px-based geometry (`h-[52px]`, `h-[44px]`, no `h-11`), and keeping `explore-header.tsx` / `explore-status-bar.tsx` byte-identical is the cleanest proof of "untouched".
- The two header/footer selectors are exact: both are **direct** children of the shell root (`explore-shell.tsx:65` → `explore-header.tsx:39` `<header>`, `explore-status-bar.tsx:38` `<footer>`). [VERIFIED]
- **R2 is the placement constraint**: file tail, or two suites go red.

### OQ-4 — (RESOLVED) How the anchor budget reaches the predicate

**Decision:** widen the timeline hook's return value to expose the derived anchor budget (or the `ArcGeometry`), because `R` is unavailable from `arcZoneWidth` alone (R3). The pure `dateLineFits` keeps its signature — its unit rows are pinned and stay green (`tests/explore-timeline.test.mjs:503-521, 597-599`). Add boundary-sensitive rows (e.g. boundary-true and boundary-false neighbours) so the predicate can't be satisfied by an off-by-16. [VERIFIED: `hook:115-128, 177-182`; `timeline-geometry.ts:319-322`]

### OQ-5 — (RESOLVED) `overscroll-behavior` carrier

**Decision:** keep the UI-SPEC's `html` + `body` pair; treat **`html` as the load-bearing rule** and `body`'s as harmless documentation-in-CSS (R6). The fallback diagnostic (`overscroll-behavior-y: contain` on `.explore-shell > main`) stays a phone-conditional, not part of the pack.

### OQ-6 — (RESOLVED) `user-select: none` / sticky-hover gating

**Decision:** neither, this phase. `user-select` is outside the locked D-06 pack, and the About contact rows must stay copyable (R6/OQ-3 evidence; UI-SPEC §11 defers both). Sticky hover (`@media (hover: hover) and (pointer: fine)`) is a **real** mobile-native symptom and the only remaining known `!`-item on phones — but it is not in D-06/REV-25, adding it changes desktop behaviour, and no test pins exist for it. Keep it deferred; if the phone test shows a lingering tint that bothers the user, promote it as a follow-up quick task, not silently.

### OQ-7 — (RESOLVED) The static per-width "shown/suppressed" table

UI-SPEC §2.2 prints a per-viewport budget/verdict table. **Do not encode it as an acceptance boundary.** The zone width is **client-measured at runtime** (`hook:180` `setArcZoneWidth(rect.width)`), and the static estimates depend on assumptions the table cannot see (the desktop scrollbar consuming viewport width, the `md` main padding change `p-4 → p-6`, the panel's border/padding). **Decision:** the falsifiable facts are (1) the predicate is applied to the *measured* anchor budget (source grep + unit rows), (2) no label paints outside the arc zone at any width (arithmetic in the unit rows, boundary-sensitive), and (3) the phone shows no horizontal scrollbar. The exact px where a date line starts to fit is **not** a requirement. [VERIFIED: `hook:177-182`; `experience-section.tsx:128`]

### OQ-8 — (RESOLVED) `height: 100dvh` on `html, body` (the CTX D-06 / UI-SPEC D3 deviation)

**Decision:** in scope, and **verified safe against the lock regexes**: `/html,\s*body\s*\{[^}]*height:\s*100%;[^}]*overflow:\s*hidden;/s` still matches with the extra line inserted between them because `[^}]*` spans it. [VERIFIED: `tests/route-swap.test.mjs:157-161`; `tests/projects-stack.test.mjs:606-610`; `src/app/(home)/layout.tsx:52-58`]. Rationale for the line: `body` is `flex flex-col h-full` (`src/app/layout.tsx:129`) and the shell is `h-dvh`; with a *static* `100%` on `html/body` the shell (a flex item with the default `flex-shrink: 1`) cannot grow into the space a retracting URL bar frees — which is the "strip below the footer". Making all three heights the same dynamic number is the reconciliation. [ASSUMED: standard flexbox shrink semantics; the change is defensible and harmless even if the mechanism is stated more loosely than reality.]

### OQ-9 — (RESOLVED) `viewport-fit: cover` also lands on `/cli` and `/resume`

**Decision:** accepted side effect, no code change (those routes are out of scope and their files stay byte-identical). It becomes a **phone-checklist item** (check their top/bottom edges for content under the notch) and a documented boundary, not a defect. [VERIFIED: the viewport export lives in the root layout, `src/app/layout.tsx:59-64`]

---

## 4. Architectural Responsibility Map

| Capability | Tier | Where it must live | Wrong-tier BLOCKER check |
|---|---|---|---|
| Arc geometry (`viewBoxToPx`, `markerPoint`, angles, emphasis) | **domain** | `timeline-geometry.ts` (pure, zero runtime imports, erasable TS) | putting a formula in JSX → breaks the "one derivation site" pin + the `node --test` type-strip contract |
| Arc progress from scroll (`computeProgress`, `continuousIndex`) | **domain** | same module — already there; **do not** re-derive in the hook | — |
| Anchor-budget conversion (new) | **domain** | a pure function beside `dateLineFits`; the hook supplies the measured geometry | computing it inside `experience-section.tsx` → a second derivation site |
| Date-line fit (`dateLineFits`) | **domain** | unchanged pure function | — |
| Arc measurement + rAF writes + geometry cache | **presentation** | `use-timeline-progress.ts` (client hook) | — |
| `<md` discrete stepped index + the "don't stomp it" gate | **presentation** | the hook's state; **never** derived from the DOM per frame | writing it from the scroll path = P6 |
| Breakpoint behaviour (arc above/below content, grid flips) | **presentation** | Tailwind classes in `experience-section.tsx` / `explore-panels.tsx` | JS width-sniffing → breaks the single-`matchMedia` pin |
| Card geometry / ring buffer / `cardState` / `ringStep` | **domain** | `projects-card-state.ts` (pure, pinned by `tests/projects-stack.test.mjs`) | — |
| Stage height constants (card + peek band + safe margin) | **presentation** | `projects-stack-stage.tsx` consts; arithmetic must stay `card + 250 + 20 = stage` | inlining the numbers per-mode → breaks the arithmetic pin |
| Drag gesture + its inline `touch-action` | **integration / platform** | framer-motion (`drag="x"`); the CSS `pan-y` pin on the stage is the structural fallback | `touch-action: none` anywhere in the shell = BLOCKER (kills vertical scroll) |
| Viewport meta | **integration** | Next's typed `viewport` export in the **root** layout (`src/app/layout.tsx:59-64`); it cannot be route-scoped | re-adding a hand-written `<meta name="viewport">` in either layout → duplicate-tag regression (R5) |
| Document height lock + safe-area/overscroll/tap/hover platform CSS | **presentation / platform** | the `(home)` layout lock (height lines only) + `globals.css` tail, `:has(.explore-shell)`-scoped | putting `html`-level rules in an unscoped `globals.css` block → changes `/cli` + `/resume` = out-of-scope mutation |
| Avatar removal + panel reflow | **presentation** | `about-section.tsx` (server component, no hooks) | adding a client directive to compensate the reflow |
| `about.profileImageUrl`, `meta.viewport` | **data** | JSON + `.d.ts`, **unchanged and unconsumed by the UI** | deleting the fields → breaks `portfolio-data-integrity.test.mjs:239` and the map-content-surfaces ledger |
| Static export | **build** | unchanged (`next build` emits one HTML per route) | — |

**Security-sensitive surfaces touched by this phase (all must stay as they are):** the `rel="noopener noreferrer"` + `target="_blank"` pair on every external link (`about-section.tsx:206-215`, `projects-stack-stage.tsx:206-227`); the existing `dangerouslySetInnerHTML` sites (theme-init script, the lock `<style>`, JSON-LD, GA bootstrap) — the phase **adds no new** `dangerouslySetInnerHTML`, no `eval`, no new inline script, and no new remote origin. The new `data-projects-swipe-stage` hook and the new CSS selectors are inert attributes/classes. **No security-sensitive capability moves tiers in this phase** — the map above is therefore BLOCKER-free, provided the two `touch-action`/`overflow` rules land where listed.

---

## 5. Validation architecture

**Instrument inventory (what actually exists):** `npm run typecheck` (`tsc --noEmit`), `npm test` (`node --test tests/*.mjs`), `npm run build` (`next build` → `output: 'export'` → `out/`), and the user's phone. **No browser automation.** [VERIFIED: `package.json`]

Each requirement gets its cheapest sufficient instrument:

| Behaviour | Instrument | Concrete check |
|---|---|---|
| Arc renders at every width (REV-23) | source grep | `experience-section.tsx` contains no `hidden md:flex`; contains the base arc-zone height and base `flex flex-col` container; still contains the arc path `M 100 0 A 100 100 0 0 0 100 200` (`tests/explore-sweep.test.mjs:388-448` depends on it in the export) |
| Markers positioned at `<md` | source grep + absence | no `if (!mdMedia.matches) return;` in the marker derivation; the layer write block carries an explicit `md` gate (else 4 of 5 CV entries vanish on phones — `contentLayer(i,0).visible = |i|<1`) |
| Arc controls reachable at `<md` | export grep + phone | `out/index.html` carries `Previous role` / `Next role` / `01 / 05` (existing `sweep E-8`); phone: tappable, 44px, disabled at the ends, visible result per step |
| Label never overflows (no extra scrollbar) | pure unit rows | boundary-sensitive `dateLineFits` rows (a just-fits and a just-fails neighbour); plus a source pin that the call site passes the **anchor budget**, not the zone width |
| `<md` step survives the scroll path / resize | pure unit row + source pin | a unit/invariant row that a stepped index is not reset by a progress-0 derivation; grep that `setActiveIndex` from the derive path is gated below md (P6) |
| Swipe stack = one contract (REV-23b) | source grep + gone-check | `projects-mobile-stack.tsx` **does not exist** (`existsSync === false`); `projects-section.tsx` has exactly one `<ProjectsStackStage`, no `hidden md:block`, no `md:hidden`, no `ProjectsMobileStack`; `projects-stack-stage.tsx` has no `mode`/`compact`/`max-w-[320px]`; base pair = 690/420, `md:` pair = 830/560, arithmetic `card + 250 + 20 = stage` at both tiers |
| Touch contract | source grep | `data-projects-swipe-stage` present; `touch-action: pan-y` on that hook in `globals.css`; **no** `touch-action: none` anywhere in the shell CSS; framer's inline `pan-y` remains the card-level mechanism |
| Avatar removal (REV-24) | source grep + export grep | no `<img`, no `profileImageUrl`, no `Portrait of` in `about-section.tsx`; none in `out/index.html`; the summary carries `mt-3`; the resume link is still last. **Scope the grep to the About panel** — the field legitimately survives as head metadata at `src/app/layout.tsx:42` (og:image), `:77` (JSON-LD) and `(home)/layout.tsx:84` (og:image), so a repo-wide "unconsumed" grep is unsatisfiable |
| Viewport meta (REV-25a) | export grep (falsifier) | `out/index.html`: exactly **one** `name="viewport"` tag; `viewport-fit=cover` present; `shrink-to-fit` absent; no `maximum-scale`/`user-scalable`; `theme-color` × 2 survives |
| Platform pack (REV-25b) | source grep | the pack exists **after** the RM guard; `-webkit-tap-highlight-color` on `html:has(.explore-shell)`; `overscroll-behavior: none` on both; `touch-action: manipulation` on the three control selectors; the two `env(safe-area-inset-*)` blocks with height compensation; exactly one RM media query in the file |
| Height lock | source grep (positive) + the existing regexes | the lock keeps `height: 100%` **first** and gains `height: 100dvh`; both existing regex pins stay green (OQ-8) |
| Untouched routes | byte-diff | `explore-header.tsx`, `explore-status-bar.tsx`, `cli/layout.tsx`, `resume/page.tsx`, the wizard/tour/drawer, the Credentials panel: unchanged |
| Both themes / 44px / notched device / URL-bar behaviour / touch feel | **phone only** | the UI-SPEC §10 checklist (+ the OQ-1 RM precondition) |

**Gate order (and the finality rule):** `typecheck` → `npm test` (all suites) → `npm build` → the `out/` rows (which read the freshly built export) → the phone checklist. The `out/` rows are only meaningful **after** a build, so the build must precede them, and any write after the last green run reopens the gate.

---

## 6. Project constraints (from project conventions)

Read from the repo, not assumed:

1. **`out/` is build output and is asserted by tests.** `tests/explore-sweep.test.mjs:381-448` reads `out/index.html` (`exportText()`/`exportRaw()`) and asserts SSR content (`01 / 05`, the arc path, ≥4 `visibility:hidden`, exactly 5 `opacity:0` dots + 5 labels). The `<md` change must therefore keep those SSR invariants: the layer loop stays `md`-gated in the render path, `clearLayerStyles()` runs only at runtime, and the arc's dot/label counts stay 5. [VERIFIED: `tests/explore-sweep.test.mjs:388-448`]
2. **Comments are load-bearing in test greps.** Suites strip comments via `codeOf()` for some assertions and count phase-requirement citations (`REV-18`/`REV-21` clauses at `tests/explore-visuals.test.mjs:1100-1149`). Doc headers must be updated honestly (e.g. `about-section.tsx` §2.1 item 4 and the DOM-order sentence; `projects-section.tsx`'s retired-mode prose; the hook's md-gate paragraph) or the citation/comment pins drift.
3. **"Retirement" means a gone-check + a renewed comment, never a silent delete.** Phase-10/11 precedent. [VERIFIED: `tests/explore-visuals.test.mjs:940-945`]
4. **No new dependencies, no new breakpoints, no device sniffing, never disable zoom** — locked in SPEC constraints and re-stated in the UI-SPEC. [VERIFIED: `…-SPEC.md` "Constraints"]
5. **`md` (768px) is the only breakpoint**; every existing placement/height utility in the panels/arc chain is `md:`-prefixed, and `tests/explore-sweep.test.mjs:100-117` asserts each `h-[300vh]`/`col-span`/`h-[calc(100dvh-10rem)]` occurrence is `md:`-prefixed. Enabling the sticky range below `md` **directly contradicts that sweep row** → it must be renewed deliberately (the UI-SPEC §9.1 lists this under the sweep renewal). [VERIFIED: `tests/explore-sweep.test.mjs:100-117`; `explore-panels.tsx:140-142`]
6. **Data files are never deleted from.** `meta.viewport` and `about.profileImageUrl` stay byte-identical in the JSON + `.d.ts`; their last UI consumers retire. `portfolio-data-integrity.test.mjs:239` pins the viewport string verbatim: `'width=device-width, initial-scale=1, shrink-to-fit=no'` (`src/data/portfolio-main-data.json:5`), and `profileImageUrl` is `"https://tinyurl.com/5cfm72u7"` (`:28`). [VERIFIED]
7. **The reduced-motion guard is the file's single suppressor and the file tail today** (`globals.css:676-694`); `tests/credentials-panel.test.mjs:373` asserts exactly one such query. The pack must not add a second, and must not be inserted before it (R2).
8. **The phone is a user-owned instrument.** Every visual/touch claim ships with a checklist item; the programmatic half is the repo's half. The UI-SPEC §10 checklist is the right carrier — **plus** the OQ-1 Reduce Motion precondition, which the checklist currently lacks.

---

*Phase: 13-mobile-parity-revision · RESEARCH · every in-repo claim read this session; external claims carry their URL.*