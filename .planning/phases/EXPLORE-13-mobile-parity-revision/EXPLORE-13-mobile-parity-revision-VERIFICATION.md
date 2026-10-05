---
phase: 13-mobile-parity-revision
verified: 2026-10-05T10:56:12Z
status: passed
score: 48/48 must-haves verified
behavior_unverified: 0
overrides_applied: 0
re_verification: "true — the prior EXPLORE-13-...-VERIFICATION.md (2026-10-05T10:49:07Z, HEAD b21866a) returned status `human_needed`, score 46/48. Its only open item was H1 — the touch-drag gesture had never executed on hardware (Reduce Motion ON on the sole tested device disables `drag` by the verified phase-10 REV-20 contract). Commit b4dc674 records the user's final RM-OFF hardware verdict, which discharges it. This run re-derives RT-2/P02-1 (the two `PRESENT_BEHAVIOR_UNVERIFIED` truths) against that verdict, re-confirms the four truths + one key link the prior run closed by reconciliation, and runs a regression gate over the previously-passed 18 truths / 12 artifacts / 11 links."
verification_tree: "HEAD b4dc674 on branch phase-13; `git status --porcelain` EMPTY (no orchestrator write either). `git diff --name-only b21866a..HEAD -- src tests public scripts` → EMPTY: the only commit since the prior verification (b4dc674) is a single `.planning/` checklist append. Every code fact below was therefore re-read FIRST-HAND on the identical tree — nothing inherited from any SUMMARY.md. The gate was re-run fresh over that tree: typecheck exit 0 · `npm test` 314/314 (14 files, 0 fail) · `next build` exit 0 (4 static routes: /, /_not-found, /cli, /resume) · `node --test tests/explore-sweep.test.mjs` 22/22 against the FRESHLY BUILT export, plus 10/10 named behavioural rows run in isolation, with the `out/` and emitted-CSS falsifiers re-grepped by hand."
evidence_classes: "45 of the 48 must-haves are programmatic (source greps, pure-function rows, built-export assertions). RT-2 and P02-1 are the same touch-drag behaviour stated once in each plan; they rest on the real-hardware instrument that D-07 / UI-SPEC §10 explicitly designates as the acceptance surface for every visual and touch claim. They are marked VERIFIED on that designated instrument's recorded verdict, NOT on a programmatic test — no browser/DOM/device instrumentation exists in this repo (no jsdom, no Playwright, no testing-library). P04-2 is partially human-instrument (the checklist's existence and quote-fidelity are programmatic; its content is user-owned)."
human_items_closed: "H1 (touch drag on hardware) is CLOSED by b4dc674 — user verbatim: \"the drag is not working with reduced motion on but we can leave with the up and down arrows to handle this if someone has the reduce motion on. with that mode off, it plays like a charm\". RM OFF → drag verified working on real hardware. RM ON → the drag is disabled by the verified phase-10 REV-20 contract and the user explicitly ACCEPTED the Prev/Next + arrow controls as the fallback (no REV-20 amendment granted, no code change wanted). Nothing is left outstanding: no other must-have truth depends on an unobserved behaviour."
residual_artefact_divergence: "Four pre-existing documentation-lag items survive (AP-5/AP-6/AP-7) — the ROADMAP goal cell at `ROADMAP.md:19`, the UI-SPEC's §10 item 4 wording, the PLAN-01/PLAN-02 plan bodies, and one stale test MESSAGE. None is a code divergence, none re-opens a truth: the AUTHORITATIVE requirement text (`REQUIREMENTS.md:37` REV-23, rewritten to the delivered rail contract and marked approved), every PLAN frontmatter must-have, and the shipped code are mutually consistent. The ROADMAP cell is the one a milestone audit reads first — fix before the audit."
---

# Phase 13: mobile-parity-revision Verification Report

**Run type:** re-verification (the prior report's status was `human_needed`; no `--gaps` re-plan was needed — the single open item was a human observation, and it was answered on hardware).

**What changed since the prior verification:** exactly one commit — `b4dc674`, which appends 9 lines to `EXPLORE-13-MOBILE-CHECKLIST.md` recording the final RM-OFF touch-drag hardware verdict. **Zero source, test, config or data files changed** (`git diff --name-only b21866a..HEAD -- src tests public scripts` is empty).

---

## Re-Verification of the Previously-Failed / Previously-Open Items

| Prior item | Prior verdict | What closed it | Current verdict (this run) |
|---|---|---|---|
| **H1 / AP-3 — touch drag never observed on hardware** | ⚠️ outstanding **human item** | Commit `b4dc674`: the user's itemized final verdict distinguishes both motion settings — RM OFF "it plays like a charm" (drag works on hardware), RM ON "the drag is not working… we can leave with the up and down arrows" (design contract + accepted fallback) | ✓ **CLOSED** — see RT-2 / P02-1. The drag path was re-read first-hand: `drag={isFront && !reducedMotion ? 'x' : false}` (`projects-stack-stage.tsx:607`), `onDragEnd → handleDragEnd` (`:565`) → `performExit` (`:521`) → `advanceFront` + `onSwipe` (`:529,:539`) → `handleSwipe → setFrontIndex(advanceFront(…))` (`:661-662`), and the ring invariants are pinned by green pure rows (`cardState: loop invariant — a full cycle of 6 frontIndex steps returns the initial arrangement`, `ringStep: the direction map`, `ringStep: Previous is the exact inverse of Next`). |
| **Gap 1 — RT-1 / P01-1** (the arc's `<md` clause was false as written; the arc is `md:block` and a rail renders below md) | ✗ FAILED → closed by reconciliation | `REQUIREMENTS.md:37` REV-23 rewritten verbatim to the delivered contract, marked user-superseded (43432f5 / approved 9fd3a87); CONTEXT D-01 carries the same `SUPERSEDED in execution` line; PLAN-01 truth 1 annotated in place | ✓ **REGRESSION-CONFIRMED** — code re-read this run: arc SVG `hidden … md:block` (`experience-section.tsx:237`), dots `:266`, labels `:281`; rail `data-timeline-rail="true" … md:hidden` (`:192`); zone `relative h-[200px] md:h-auto md:flex-1` (`:180`). |
| **Gap 2 — P01-2** (the all-five-readable `<md` contract retired) | ✗ FAILED → closed as superseded | PLAN-01 truth 2 annotated; the user's RESOLVED-D1 answer recorded | ✓ **REGRESSION-CONFIRMED** — inactive layers `opacity-0 invisible` (`:368`) riding `activeIndex`, which is written at EVERY width (`use-timeline-progress.ts:302-305`) and driven by the base `h-[400vh]` range (`explore-panels.tsx:153`). |
| **Gap 3 — P01-3 / key link L4** (`steppedIndexRef` retired; stepping runs the unified scroll path) | ✗ FAILED (truth) / ✗ NOT_WIRED (L4) → closed | PLAN-01 truth 3 annotated; L4 annotated `[RETIRED …]` with the replacement link | ✓ **REGRESSION-CONFIRMED** — replacement path re-derived first-hand: `stepRole` (`:403`) → `goToRole` (`:379`) → `scrollTargetForRole` (`:396`) → `main.scrollTo`; returned at `:418-420`, wired to the controls (`experience-section.tsx:308,323`) and the `role="group"` root (`:173`). Retirement pinned absent by the green row `REV-23c one derivation: the carousel index is UN-branched, the stepped-index ref is retired` (`tests/explore-visuals.test.mjs:1105`). |
| **AP-1 — the REV-23 acceptance check was vacuous** | ⚠️ WARNING → mitigated | The phase sweep now POSITIVELY pins the delivered `<md` presentation | ✓ **MITIGATED (regression-confirmed)** — `sweep rows EXPLORE@375 (P): the rail column + the base scroll range` and `sweep E-10 (E, phase 13)` both green this run, and E-10 derives the five rail years from `selectTimelineEntries` rather than copying a year list. |
| **AP-4 — plan-01/plan-03 declared exports that do not exist** | ℹ️ INFO | — | ℹ️ **RE-RECORDED, unchanged** — `TimelineStage` is module-private in `experience-section.tsx` (real export: `ExperienceSection`, `:136`); `documentScrollLock` is a module-private `const` in `src/app/(home)/layout.tsx:64` (real export: `metadata` `:87`, `ExploreLayout` `:113`). Capability wired; only the frontmatter export lists are inaccurate. |
| **AP-5 / AP-6 / AP-7 — documentation lag** | ⚠️ WARNING ×3 | Not addressed by b4dc674 | ⚠️ **STILL OPEN (warnings)** — unchanged; see Anti-Patterns. None is a code divergence and none re-opens a must-have. |

**The prior run's entire open set is closed. No must-have remains unverified.**

---

## Goal Achievement → Observable Truths

### Roadmap truths (ROADMAP.md phase-13 goal + REQUIREMENTS REV-23…REV-25, as revised by the user's approved directive)

| # | Truth | Status | Evidence |
|---|---|---|---|
| RT-1 | **REV-23 (as revised, `REQUIREMENTS.md:37`):** full mobile parity — the Projects swipe stack carries the full gesture contract at every width; the Experience panel on phones presents a vertical year rail with one-at-a-time scroll-driven entries (desktop keeps the arc); every panel behaves per its desktop-equivalent contract; tested on real hardware | ✓ **VERIFIED** (as revised; reconciled) | Swipe stack: ONE unconditional render (`projects-section.tsx:38`), no mode prop, no mobile wrapper, base/md height pairs `h-[520px] md:h-[560px]` / `h-[760px] md:h-[800px]` (`projects-stack-stage.tsx:149,156`), band `5×44+20 = 240` (`:140`, derived by `tests/projects-stack.test.mjs:632-698`). Rail: `md:hidden` (`experience-section.tsx:192`), 5 SSR rail markers in the fresh export, driven at every width by the base `h-[400vh]` range. Other panels unchanged by this phase except the About avatar removal (diff-verified). Real hardware: the user's itemized `status_human: approved` verdict. The roadmap goal CELL at `ROADMAP.md:19` still carries the pre-directive arc clause — see AP-6. |
| RT-2 | **REV-23b:** on touch the full stack works — drag swipes the foreground card away, the card behind peeks, the stack is centred, depth/bloom shadows render | ✓ **VERIFIED** — human instrument (real hardware), the D-07-designated acceptance surface | Composition programmatic: one contract, no `mode`/`compact`/`max-w-[320px]` residue, one class string per constant with exactly one unprefixed + one `md:` tier (green rows `REV-23b: the mode plumbing is retired`, `stage containment: the fixed stage height IS the arithmetic card + peek band`), visibility `depth === 0 || state.visible` so every depth peeks at every width (`:590`), centring rows green, `panel-shadow-hover` on the foreground card (`:601`). The **drag gesture**: `drag` wired (`:607`) + user verbatim "with that mode off, it plays like a charm" on real hardware (b4dc674). Under RM ON the drag is `false` by the verified phase-10 REV-20 contract and the user ACCEPTED the arrows as the fallback — an explicit, recorded waiver, not an unmet clause. |
| RT-3 | **REV-24:** the avatar is removed entirely from the About panel — no image, no initials | ✓ **VERIFIED** | `grep -cE "<img"` on `about-section.tsx` → **0**; the only `profileImageUrl` mention is a prose comment (`:27`); no `initials`/`avatar` markup. Fresh export `out/index.html`: `<img` → **0**, `Portrait of` → **0**. Data preserved: `git diff 4902fcf..HEAD -- src/data/` → empty. |
| RT-4 | **REV-25:** the mobile-native platform pack — proper viewport meta (`viewport-fit=cover`), dvh/svh reconciliation, `overscroll-behavior: none`, tap-highlight off, `touch-action: manipulation`, safe-area padding — killing the gap-after-footer and the extra scrollbars | ✓ **VERIFIED** | Fresh export: **exactly one** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>`; `shrink-to-fit`/`maximum-scale`/`user-scalable` → 0; `<meta name="theme-color">` → 2. Fresh emitted CSS (`b6ffad8fda5ba753.css`): single `@media (prefers-reduced-motion:reduce)` at byte **42100**; the pack at **42427-42994** — `tap-highlight-color`, `overscroll-behavior:none` (html + body), `touch-action:manipulation`, `touch-action:pan-y` on `[data-projects-swipe-stage]`, `safe-area-inset-top` (×2), `safe-area-inset-bottom` (×3) — **every rule after the guard**; the only `touch-action:none` in the bundle is Tailwind's unrelated `.touch-none` (context read at byte 16826). Lock: `height: 100%` then `height: 100dvh` then `overflow: hidden` (`src/app/(home)/layout.tsx:64-71`) emitted into the landing only — `out/cli.html` and `out/resume.html` carry **0** occurrences. User PASS recorded for the gap and single-scrollbar items. |

### Plan 01 truths (arc/rail parity) — 5/5

| # | Truth | Status | Evidence |
|---|---|---|---|
| P01-1 | A 375px viewport renders the semicircular arc … `[SUPERSEDED — delivered contract is the year-rail/one-at-a-time <md presentation]` | ✓ **VERIFIED** (as superseded) | Delivered `<md` presentation re-verified: rail `md:hidden` (`:192`), 5 rail markers + 1 rail block in the fresh export, base zone `h-[200px]` (`:180`), arc `md:block` (`:237/:266/:281`). Named rows green: `sweep rows EXPLORE@375 (P): the rail column + the base scroll range`, `REV-23c rail parity: the <md squeezed arc is retired`. |
| P01-2 | All five timeline entries stay readable on a phone … `[SUPERSEDED]` | ✓ **VERIFIED** (as superseded) | Delivered contract is one-at-a-time: inactive layers `opacity-0 invisible` (`:368`); `activeIndex` written at every width (`use-timeline-progress.ts:304`, comment `:83` "the per-pass `setActiveIndex` write is NOT gated"); base `h-[400vh]` range makes the swap scroll-driven. Recorded in checklist item 5 as the user's RESOLVED-D1 answer. |
| P01-3 | Prev/Next step at `<md` through the stepped-index input … `[SUPERSEDED]` | ✓ **VERIFIED** (as superseded, replacement wired) | `stepRole` → `goToRole` → `scrollTargetForRole` → `main.scrollTo` (`:379-401`); `handleKeyDown` `:407-411` returned at `:410-420`; wired at `experience-section.tsx:173,308,323`; one target formula at every width. The retired ref's absence is deliberately pinned (`tests/explore-visuals.test.mjs:1105`, green). |
| P01-4 | No arc label paints outside the arc zone at any width | ✓ **VERIFIED** | The predicate consumes the measured anchor budget, not the zone width: `dateLineFits(active.entry.duration, anchorBudget ?? 250)` (`experience-section.tsx:170`); `anchorBudget` declared in the hook's return type (`:142`), set from `labelAnchorBudget(geometry)` (`:207`), returned (`:418`); pure `labelAnchorBudget` (`timeline-geometry.ts:348`) beside `dateLineFits` (`:319`) and `LABEL_RADIUS_RATIO = 0.88` (`:330`). Named row green: `REV-23 anchor budget …` (boundary-sensitive: 375 suppressed, 1440 shown). |
| P01-5 | Only one value in the arc path is width-specific — the zone box height | ✓ **VERIFIED** | Zone `relative h-[200px] md:h-auto md:flex-1` (`:180`) — the single width-specific value; geometry derives from the measured rect (`viewBoxToPx`, `timeline-geometry.ts:193`); the path is the fixed viewBox `M 100 0 A 100 100 0 0 0 100 200` (1 occurrence in the fresh export). |

### Plan 02 truths (one swipe-stack contract) — 5/5

| # | Truth | Status | Evidence |
|---|---|---|---|
| P02-1 | A phone renders the SAME stack as desktop: touch drag, behind-cards peek, centred, shadows | ✓ **VERIFIED** — human instrument (real hardware) | Same clause as RT-2. Composition + centring + depth ladder verified programmatically; the drag gesture verified on hardware with RM OFF (b4dc674); RM ON accepted by the user with the arrows. |
| P02-2 | No simplified mobile stack exists anywhere in the tree | ✓ **VERIFIED** | `projects-mobile-stack.tsx` absent (`ls` on the sections dir); no import/render — `projects-section.tsx:20,38` imports and renders only `ProjectsStackStage`; the only `ProjectsMobileStack` occurrences are the gone-check assertions themselves (`tests/explore-visuals.test.mjs:1236,1331-1335`; `tests/explore-visuals-server.test.mjs:162`, green). |
| P02-3 | The base/unprefixed heights ARE the phone heights; the fixed limited-peek box is retired and the full peek band shows at `<md` | ✓ **VERIFIED** | `CARD_HEIGHT_CLASS = 'h-[520px] md:h-[560px]'` (`:149`), `STAGE_HEIGHT_CLASS = 'h-[760px] md:h-[800px]'` (`:156`), `PEEK_BAND_PX = DEPTH_LEVELS * VISIBLE_BAND_PX + PEEK_SAFE_PX` (`:140`) = 240. No `mode`/`compact`/width-cap residue (green row). |
| P02-4 | Only one value pair is width-specific, and both tiers satisfy the stage arithmetic so peeks/fly-off cannot extend the layout | ✓ **VERIFIED** (substance; the frontmatter's literal numbers are stale — AP-7) | Both tiers satisfy `stage = card + PEEK_BAND_PX`: 520+240=760, 560+240=800, with the band DERIVED in the suite (`tests/projects-stack.test.mjs:641-697`) from `DEPTH_LEVELS`/`VISIBLE_BAND_PX`/`PEEK_SAFE_PX` rather than restated — so a drifting band or a re-added safe term reddens. The truth TEXT still cites the pre-directive 420/690, 560/830, `250+20` pair (amended live by the user's band-tighten directive 47ea74a): the asserted relationship holds exactly, the literals do not. |
| P02-5 | The stage carries the `data-projects-swipe-stage` hook its `touch-action: pan-y` rule targets | ✓ **VERIFIED** | Attribute `projects-stack-stage.tsx:733`; rule `globals.css:742-744`; both present in the fresh export + emitted CSS (byte 42671). |

### Plan 03 truths (viewport / platform pack / avatar) — 6/6

| # | Truth | Status | Evidence |
|---|---|---|---|
| P03-1 | Exactly ONE viewport meta, `width=device-width, initial-scale=1, viewport-fit=cover`, no `shrink-to-fit`/`maximum-scale`/`user-scalable` | ✓ **VERIFIED** | Typed export `src/app/layout.tsx:69-73` (`width`, `initialScale`, `viewportFit: 'cover'`, `themeColor` ×2); the data-file meta line has no consumer left in either layout. Fresh export: 1 tag, exactly that content; 0/0/0 for the banned directives. Green row: `REV-25a (E): the built landing declares exactly ONE viewport meta`. |
| P03-2 | The strip below the footer is gone — document/body height and the shell's `h-dvh` are the same dynamic number, overscroll suppressed | ✓ **VERIFIED** | Lock emits `height: 100%; height: 100dvh; overflow: hidden` (`src/app/(home)/layout.tsx:64-71`), injected into the landing `<head>` (`:121`); shell is `flex h-dvh flex-col overflow-hidden` (`explore-shell.tsx:65`); `overscroll-behavior:none` on `html`+`body` in the emitted CSS. 100dvh → 5 occurrences in the fresh export; 0 in `/cli`+`/resume`. User checklist item 2 → PASS. |
| P03-3 | Header/footer paint their safe-area insets without compressing their content bands | ✓ **VERIFIED** (structural) | `globals.css:757-773`: `padding-top: env(safe-area-inset-top,0px)` + `height: calc(52px + env(safe-area-inset-top,0px))`; footer `calc(1.75rem + …)` with the `@media (min-width:640px)` band override to `calc(2rem + …)`; all three literals DERIVED from the two bar components by `tests/route-swap.test.mjs` (green). Hardware look recorded COVERED by the user's verdict. |
| P03-4 | Tap highlight gone, double-tap delay gone, stage keeps horizontal drag while vertical scroll survives | ✓ **VERIFIED** | All four rules emitted after the RM guard (`html:has(.explore-shell)` tap-highlight; `overscroll-behavior`; `touch-action:manipulation` on button/a/[role=button]; `touch-action:pan-y` on `[data-projects-swipe-stage]`); no `touch-action:none` in the shell CSS. Green row `REV-25b: the platform pack is appended AFTER the reduced-motion guard and adds no second suppressor`. |
| P03-5 | The About panel renders no avatar | ✓ **VERIFIED** | See RT-3. |
| P03-6 | Nothing is deleted from the data: `meta.viewport` and `about.profileImageUrl` stay byte-identical, unconsumed by the landing UI | ✓ **VERIFIED** | `git diff 4902fcf..HEAD -- src/data/` → empty; no code consumer of `portfolioData.meta.viewport` remains (the layout's viewport is the typed export). `/resume`, `/cli`, the PDF script and `explore-header`/`explore-status-bar` are diff-clean. |

### Plan 04 truths (acceptance surface) — 4/4

| # | Truth | Status | Evidence |
|---|---|---|---|
| P04-1 | The stale `<md` sweep rows are renewed and the new export rows pass on a freshly built `out/` | ✓ **VERIFIED** | Rebuilt this session (exit 0, 4 static routes). `node --test tests/explore-sweep.test.mjs` → **22/22**, incl. `sweep rows EXPLORE@375 (P): the rail column + the base scroll range`, `sweep E-10 (E, phase 13)`, `REV-25a (E)`, `REV-25b`. |
| P04-2 | Every VISUAL/TOUCH claim is carried by a written, user-owned checklist item | ✓ **VERIFIED** | `EXPLORE-13-MOBILE-CHECKLIST.md` (176 lines) quotes UI-SPEC §10 items 1-11 VERBATIM (spot-checked char-for-char against `…-UI-SPEC.md:441-455`) + item 0 + one supplementary item, with per-item verdicts, a classified-failures table and two `status_human: approved` blocks. |
| P04-3 | The Reduce-Motion precondition is put to the user and recorded | ✓ **VERIFIED** | Recorded **ON**, option (a) — no code change; stated in the premise block, item 0, the itemized results and the user-verdict block. b4dc674 additionally records the RM-OFF hardware run, so both branches now have a recorded outcome. |
| P04-4 | The full gate is the LAST chronological action and is re-run over the final workspace state | ✓ **VERIFIED** | Re-run independently this session at HEAD `b4dc674` (tree clean): typecheck 0 · 314/314 · build 0 · sweep 22/22 on the fresh export. Every commit after the execute wave is `.planning`-only except the two user-directed source amendments (`47ea74a`, `43432f5`), superseded by the verdict commits that follow them — so the phase's green run covers the final source state. |

---

## Score

**48 / 48 must-haves verified** — 24 of 24 truths (4 roadmap + 20 plan), 12/12 artifacts, 12/12 key links. `behavior_unverified: 0`. `overrides_applied: 0` — nothing was reclassified to reach green.

Change vs the prior run (46/48, `human_needed`): **+2 truths** (RT-2 and P02-1 — the same touch-drag clause, closed by the recorded RM-OFF hardware verdict) and **−1 open human item** (H1). The four truths and the one key link the prior run closed by reconciliation regressed clean on the identical tree.

---

## Deferred Items

Phase 13 is the **final** phase of the v1.0 milestone (STATE `next_phases: [13]`; the ROADMAP Progress table ends at 12 and 13's row is added at ship), so there is no later phase to absorb these — they carry to the milestone audit as outstanding UAT items:

| Item | Source | Status |
|---|---|---|
| Residual documentation lag: `ROADMAP.md:19`, the UI-SPEC's §10 item 4 wording, the PLAN-01 body, PLAN-02 truth 4's numeric literals, and `tests/explore-visuals.test.mjs:254`'s message | this run, AP-6/AP-7 | **Open (warnings only)** — one-line wording fixes, no code impact. Fix before the milestone audit so it does not read the superseded `<md` arc as delivered. |
| Checklist internal lag: the itemized results table's item 6 row still reads `PASS — read with item 0 (RM ON)` and cites `projects-stack-stage.tsx:581` (the line is now `:607`) | this run, AP-5 | **Open (warning)** — superseded by the file's own `Final touch-drag verdict` section; wording/line-ref only. |
| `AP-4` export-list inaccuracies in the plan frontmatter (`TimelineStage`, `documentScrollLock`) | this run / prior | **Open (INFO)** — capability wired through the real exports. |
| Landscape-specific tweaks (test once on the phone; adapt only if broken) | CONTEXT deferred | **Not tested** — the checklist records portrait only. Carries to the milestone audit. |
| Vertical scroll over the drag card not individually reported (checklist item 7) | checklist results block | **Covered by the user's approved verdict** + structurally pinned (`touch-action: pan-y` on the stage, never `none`; framer's inline `pan-y` on the dragged card). Not raised as outstanding — the user's blanket approval covers it. |
| Sticky-hover tint gating (`@media (hover: hover) and (pointer: fine)`) | RESEARCH OQ-6 | Deliberately deferred; promote only if the phone shows a lingering tint. |
| `/cli` + `/resume` content under the notch (`viewport-fit: cover` is root-level) | RESEARCH OQ-9 | Accepted side effect, out of scope; checklist item 9 recorded COVERED. |
| A user-supplied profile image | CONTEXT deferred | Closed by REV-24 ("no image, no initials") — do not revisit unless the user asks. |
| PWA/manifest additions | CONTEXT deferred | Future milestone candidate. |

---

## Required Artifacts

| Path | Declared | Actual | Substantive | Wired |
|---|---|---|---|---|
| `src/components/explore/sections/experience-section.tsx` | ≥300 lines, exports `TimelineStage` | **420** lines; exports `ExperienceSection` (`:136`); `TimelineStage` is module-private | ✓ | ✓ rendered by `explore-panels.tsx` — ⚠️ export-list deviation (INFO, AP-4) |
| `src/components/explore/use-timeline-progress.ts` | ≥340, exports `useTimelineProgress`, `TimelineProgress` | **421** lines; both present (`:149`, `:127`) | ✓ | ✓ consumed by the stage (`:157-158`) |
| `src/components/explore/timeline-geometry.ts` | ≥300, exports `labelAnchorBudget`, `dateLineFits`, `viewBoxToPx` | **349** lines; all three present (`:348`, `:319`, `:193`) | ✓ | ✓ measurement site (`hook:207`) + call site (`experience-section.tsx:170`) |
| `src/components/explore/sections/projects-stack-stage.tsx` | ≥690, exports `ProjectsStackStage`, `ProjectsSwipeStack` | **779** lines; both present (`:777`, `:626`) | ✓ | ✓ one unconditional render (`projects-section.tsx:38`) |
| `src/components/explore/sections/projects-section.tsx` | ≥40, exports `ProjectsSection` | **42** lines; export present (`:22`) | ✓ | ✓ rendered by `explore-panels.tsx` |
| `src/components/explore/sections/projects-mobile-stack.tsx` | must NOT exist (gone-check) | **absent** | ✓ (retirement) | ✓ gone-checks in two suites, green |
| `src/app/layout.tsx` | ≥120, exports `viewport`, `metadata`, `RootLayout` | **147** lines; all three present (`:69`, `:29`, `:80`) | ✓ | ✓ the single emitted viewport tag |
| `src/app/(home)/layout.tsx` | ≥80, exports `documentScrollLock` | **124** lines; `documentScrollLock` is a module-private `const` (`:64`) | ✓ | ✓ injected into the landing `<head>` (`:121`) — ⚠️ export-list deviation (INFO, AP-4) |
| `src/app/globals.css` | ≥720 | **773** lines | ✓ | ✓ pack emitted after the single RM guard |
| `src/components/explore/sections/about-section.tsx` | ≥190, exports `AboutSection` | **225** lines; export present (`:98`); 0 `<img>` | ✓ | ✓ rendered by `explore-panels.tsx` |
| `tests/explore-sweep.test.mjs` | ≥460 | **615** lines | ✓ | ✓ 22/22 against the fresh build |
| `…/EXPLORE-13-MOBILE-CHECKLIST.md` | ≥40 | **176** lines | ✓ | ✓ quotes UI-SPEC §10 + the recorded user verdicts |

No artifact is missing, empty, or a stub. Every artifact was read (or measured) first-hand this run.

---

## Key Link Verification

| ID | From → To | Declared pattern | Verdict | Evidence |
|---|---|---|---|---|
| L1 | `use-timeline-progress.ts` → `experience-section.tsx` | `anchorBudget` | **WIRED** | Return type `:142`, set `:207`, returned `:418`, consumed `experience-section.tsx:156,170`. |
| L2 | `timeline-geometry.ts` → `use-timeline-progress.ts` | `labelAnchorBudget` | **WIRED** | Pure function `timeline-geometry.ts:348`; imported + called with the measured `ArcGeometry` (`hook:106,207`). |
| L3 | `use-timeline-progress.ts` → `experience-section.tsx` | `stepRole\|handleKeyDown` | **WIRED** | Implemented `:403,:407`; returned `:419-420`; wired to `role="group"` (`:173`) and both controls (`:308,:323`). |
| L4 | `experience-section.tsx` → `use-timeline-progress.ts` | `steppedIndexRef` | **WIRED (retired by design)** | Declared ref absent — a deliberate retirement pinned by a green gone-check (`tests/explore-visuals.test.mjs:1105-1112`). Replacement verified end-to-end: button → `stepRole` → `goToRole` → `scrollTargetForRole` → `main.scrollTo` → scroll event → `derive()`. |
| L5 | `projects-section.tsx` → `projects-stack-stage.tsx` | one unconditional `<ProjectsStackStage projects={cards} />` | **WIRED** | `:38`, single occurrence, no mode argument, no viewport wrapper. |
| L6 | `projects-stack-stage.tsx` → `globals.css` | `data-projects-swipe-stage` | **WIRED** | Attribute `:733`; rule `globals.css:742`; both in the fresh export + emitted CSS (byte 42671). |
| L7 | `tests/projects-stack.test.mjs` → `projects-stack-stage.tsx` | `PEEK_BAND_PX` | **WIRED** | The suite derives `PEEK_SAFE_PX`, `DEPTH_LEVELS`, `VISIBLE_BAND_PX`, both height class strings and both arithmetic tiers from the source (`:616-697`). |
| L8 | `src/app/layout.tsx` → `out/index.html` | `viewport-fit=cover` | **WIRED** | Typed export → exactly one emitted tag carrying `viewport-fit=cover`; the data-file meta line has no consumer. |
| L9 | `globals.css` → `explore-shell.tsx` | `explore-shell > (header\|footer)` | **WIRED** | Selectors `globals.css:757,762,771`; both bars are direct children of the shell root (`explore-shell.tsx:65`); `tests/route-swap.test.mjs` derives the band literals from the components. |
| L10 | `globals.css` → `projects-stack-stage.tsx` | `data-projects-swipe-stage` | **WIRED** | Same pair as L6, verified in the emitted CSS. |
| L11 | `tests/explore-sweep.test.mjs` → `out/index.html` | `viewport-fit=cover` | **WIRED** | `sweep E-10 (E, phase 13)` reads the freshly built export — 22/22 after a build in this session. |
| L12 | `EXPLORE-13-MOBILE-CHECKLIST.md` → `UI-SPEC.md` | `§10` | **WIRED** | The checklist quotes §10 item-for-item (verified verbatim against `UI-SPEC.md:441-455`) and appends the OQ-1 precondition + the final verdict. |

**12/12 wired** (L4 by deliberate retirement + a verified replacement, as annotated).

---

## Data-Flow Trace

```
portfolio-main-data.json
  ├─ experience + education ──▶ selectTimelineEntries()   [timeline-geometry.ts — the ONE derivation site]
  │        └─▶ 5 entries, year-DESCENDING (2023 … 2012), present-first
  │              ├─ md+  : measured zone ──▶ viewBoxToPx ──▶ markerPoint (cos/sin)
  │              │          └─▶ rAF writes: dot/label transforms + layer opacity/visibility
  │              │                └─ labelAnchorBudget (centerX − 0.88·R) ──▶ dateLineFits ──▶ date line shown?
  │              └─ <md : the SAME entries.map ──▶ 5 rail markers (React classes off activeIndex)
  │                        + ONE visible layer, swapped by the scroll-driven activeIndex
  │
  └─ <main> scroll (the ONLY scroll container, at every width; base range h-[400vh])
        └─▶ derive(): computeProgress(rel, range) ──▶ continuousIndex ──▶ activeIndexFromContinuous   [UN-branched]
              ├─ EVERY width : setActiveIndex(active) ──▶ rail accent + the one-at-a-time layer swap
              └─ md+ ONLY    : imperative marker/layer writes (the surviving md gate, hook:252)

projects ──▶ slice(0,6) ──▶ ProjectsStackStage ──▶ cardState(index, frontIndex, count, reducedMotion)
                                   └─ levelsFor(cardHeight): translateY = −(l·44 + H·(1−scale_l))
                                        └─ stage = card + PEEK_BAND_PX (240) — 760 base / 800 md
```

The path is intact and single-sourced: no hardcoded portfolio content was added, `EXPLORE-07` survives, and the only width branch in the flow is the presentation branch (arc vs rail), never a data branch.

---

## Behavioral Spot-Checks

Run first-hand this session at HEAD `b4dc674` (named rows only; the full suite as the phase's own gate):

| Check | Command | Result |
|---|---|---|
| Typecheck over the final tree | `npm run typecheck` | **exit 0**, no diagnostics |
| Full suite (the repo's real CI suite) | `npm test` | **314/314 pass, 0 fail** (14 files, 230ms) |
| Static export build | `npm run build` | **exit 0**, 4 static routes (`/`, `/_not-found`, `/cli`, `/resume`), Exporting 2/2 |
| Sweep, incl. the phase-13 export rows (after the build) | `node --test tests/explore-sweep.test.mjs` | **22/22** — `sweep rows EXPLORE@375 (P)`, `sweep E-10 (E, phase 13)`, `REV-25a (E)`, `REV-25b` green |
| Named behavioural rows in isolation | `node --test --test-name-pattern="rail column\|anchor budget\|one derivation\|REV-25b\|one viewport\|stage containment\|mode plumbing\|REV-23b"` over 4 suites | **10/10 pass** — incl. `REV-23c rail parity: the <md squeezed arc is retired`, `REV-23c one derivation: the carousel index is UN-branched`, `stage containment: the fixed stage height IS the arithmetic card + peek band`, `REV-23b retirement: the compact mobile-stack wrapper is gone` |
| Export falsifier (first-hand, fresh build) | greps on `out/index.html` | 1 viewport tag w/ `viewport-fit=cover`; 0 `shrink-to-fit`/`maximum-scale`/`user-scalable`; 2 `theme-color` tags; 0 `<img>`; 0 `Portrait of`; 5 rail markers; 1 rail block; 1 arc path; 1 `h-[200px]`; 1 swipe-stage attribute; 5 `100dvh`; 0 `hidden md:flex`; 0 `overflow: hidden` on `/cli` + `/resume` |
| Emitted-CSS falsifier (first-hand) | byte-offset greps on `out/_next/static/css/b6ffad8fda5ba753.css` | 1 RM query @ **42100**; pack @ **42427-42994** (after the guard): tap-highlight, overscroll ×2, manipulation, pan-y, safe-area ×5; the only `touch-action:none` is Tailwind's `.touch-none` (@16826); the `@media (min-width:640px)` footer-band override present |
| Ring-buffer invariants underpinning the drag | `tests/projects-stack.test.mjs` rows | green — `cardState: loop invariant — a full cycle of 6 frontIndex steps returns the initial arrangement`, `ringStep: Previous is the exact inverse of Next`, `swipeAccepts: threshold semantics` |

**Not run, deliberately:** no browser/DOM/device instrumentation exists in this repo (no jsdom, no Playwright, no testing-library), so no programmatic check can execute the drag gesture. That behaviour's evidence is the user's real-hardware verdict (b4dc674), which is the instrument D-07 designates for it.

---

## Requirements Coverage

| REQ-ID | Requirement (abridged) | Status | Evidence |
|---|---|---|---|
| **REV-23** (as revised in `REQUIREMENTS.md:37`) | Swipe stack with the full gesture contract at every width; the phone Experience panel = a vertical year rail, one entry at a time, scroll-driven (desktop keeps the arc); every panel per its desktop-equivalent contract; real-hardware tested | ✓ **DELIVERED** | Stack: one contract, base/md pairs, band arithmetic, touch-action rules — verified. Rail: `md:hidden` composition, 5 SSR markers, `h-[400vh]` range, un-branched index — verified. Panels: unchanged except the avatar removal. Hardware: the user's approved verdict, plus the RM-OFF drag report. |
| **REV-23b** (the SPEC-era clause) | touch drag / behind-cards / centred / shadows | ✓ **DELIVERED** (RM-ON branch waived by the user) | Composition verified programmatically; drag verified on hardware with RM OFF; under RM ON the drag is off by the verified phase-10 REV-20 contract and the user accepted the arrows — recorded, not silently reinterpreted. |
| **REV-24** | The avatar is removed entirely (no image, no initials) | ✓ **DELIVERED** | 0 `<img>`/avatar markup in source and export; data preserved; panel reflowed. |
| **REV-25** | The mobile-native platform pack: proper viewport meta (`viewportFit=cover`), dvh/svh, `overscroll-behavior: none`, tap-highlight off, `touch-action: manipulation`, safe-area padding — eliminating the gap-after-footer and the extra scrollbars | ✓ **DELIVERED** | One viewport tag with cover; `100dvh` lock reconciliation; the pack emitted after the RM guard; user PASS on the gap and scrollbar items. Its "wizard/tour/stack/drag machinery untouched" clause is qualified as before: the wizard, tour, drawer, Credentials, header and status bar are byte-identical, while the stack geometry was amended twice by the user's own directives (`47ea74a`, `43432f5`) inside this phase. |

**CONTEXT decision coverage:** D-02, D-03, D-04, D-05, D-06, D-07 delivered (6/7); **D-01 superseded in execution** by the user's approved directive (43432f5 / 9fd3a87) and carrying the reconciliation line. D-03 verified by the absence of any diff in `explore-tour.tsx`, `explore-drawer.tsx`, `credentials-section.tsx`, `explore-header.tsx`, `explore-status-bar.tsx`, `src/app/cli/`, `src/app/resume/` (`git diff` since the execute wave → empty for all seven).

---

## Anti-Patterns Found

No `TBD`/`FIXME`/`XXX`/`HACK` markers anywhere in `src/` or `tests/` (`grep -rniE` → none). No unreferenced debt marker. **No blocker anti-pattern.**

| ID | Finding | Severity | Note |
|---|---|---|---|
| AP-1 | The REV-23 SPEC-era falsifier (`no hidden md:flex`) was vacuous while the target was unmet | ~~WARNING~~ → **MITIGATED (re-confirmed)** | The sweep now POSITIVELY pins the delivered `<md` presentation (rail column, base `h-[200px]`, both controls, the `h-[400vh]` range, 5 SSR rail markers, years derived from `selectTimelineEntries`). The falsifier survives only as a no-regression guard with an accurate message. |
| AP-2 | Stale locked artefacts (REV-23 + CONTEXT D-01 + PLAN-01 truths) | **RESOLVED** | Reconciled in `a220f87`; re-confirmed this run. |
| AP-5 | Checklist internal lag: the itemized results table's item 6 row still reads `PASS — read with item 0 (RM ON)` and the file cites `projects-stack-stage.tsx:581` (now `:607`). | **WARNING** | Wording/line-ref only. The file's own `Final touch-drag verdict` section (b4dc674) states the real outcome for both motion settings, so no reader is misled; the table's `COVERED` convention is explained in the recording rules. Same fact as the closed H1. |
| AP-6 | `ROADMAP.md:19` still states "…the arc and the full swipe stack render on phones…" — the pre-directive contract. | **WARNING** | One-line fix: replace that clause with the rail wording now in `REQUIREMENTS.md:37`. The milestone audit reads the roadmap first, so this must not ship into the audit. No code impact; does NOT re-open RT-1, because the authoritative requirement and every frontmatter must-have are consistent with the shipped code. |
| AP-7 | Documentation lag: the UI-SPEC body (§10 item 4's "semicircle renders above the content", plus §2.1/§3.1/§5 rows), the PLAN-01 body (§§a-g, E-rows, the RESOLVED-D1 block), PLAN-02 truth 4's literals (`420/690`, `560/830`, `card + 250 + 20`) and `tests/explore-visuals.test.mjs:254`'s message ("the arc and its markers render at every width"). | **WARNING** | Wording only — the assertions themselves are green and non-vacuous (the message at `:254` accompanies `!hook.includes('if (!mdMedia.matches) return;')`, which genuinely holds; PLAN-02's arithmetic is verified by derivation, not by its stale literals). Fix the wording before the milestone audit. |
| AP-4 | Declared exports that do not exist (`TimelineStage`, `documentScrollLock`). | **INFO** | Capability wired through the real exported surfaces; only the frontmatter export lists are inaccurate. Re-recorded in `…-04-SUMMARY.md`. |
| — | Bookkeeping noise outside this phase's must-haves: `ROADMAP.md`'s Progress table lists phases 01-11 as `pending` although 01-12 shipped, and `STATE.md`'s "Current Position" says "_No active phase._" while its frontmatter says `active_phase: 13`. | **INFO** | Pre-existing orchestrator bookkeeping; the ship step writes 13's row. No phase-13 must-have depends on it. |

---

## Human Verification Required

**None outstanding.** The phase's one human item (H1 — touch drag on hardware) is closed by `b4dc674`:

| # | Test | Outcome | Instrument |
|---|---|---|---|
| H1 | On a real phone, drag the foreground Projects card | **CLOSED** — RM OFF: the user reports "it plays like a charm" (drag works on hardware). RM ON: the drag is `false` by the verified phase-10 REV-20 contract and the user **accepted** the Prev/Next + arrow controls as the fallback ("we can leave with the up and down arrows to handle this"), granting no REV-20 amendment and requesting no code change. | the user's phone — the instrument D-07 / UI-SPEC §10 designates for touch claims |

**Not raised as outstanding, and why** (all inside the blanket `status_human: approved` verdict the user gave knowingly, with the `COVERED` convention explained in the checklist's own recording rules): checklist item 1 (safe-area/notch look), item 7 (vertical scroll over the drag card — structurally pinned by `touch-action: pan-y` and the never-`none` invariant), item 9 (`/cli`+`/resume` under the notch — a documented, out-of-scope accepted side effect), item 11 (both themes on hardware), and the supplementary tap-highlight item. Landscape was never tested and is carried as a Deferred item.

---

## Gaps Summary

**No gap remains. No truth FAILED, no artifact MISSING/STUB, no key link NOT_WIRED, no blocker anti-pattern, and no human-verification item is outstanding — so the status resolves to `passed`, not `human_needed`.**

1. **H1 / AP-3 — the phase's last open item — is closed.** Commit `b4dc674` records the real-hardware verdict that separates the two motion settings: the drag works with Reduce Motion off, and with it on the user accepts the arrow controls as the fallback rather than asking for a REV-20 amendment. RT-2 and P02-1 therefore move from `PRESENT_BEHAVIOR_UNVERIFIED` to VERIFIED **on the instrument the phase itself designates for touch claims** — with the evidence class stated explicitly, because no programmatic test in this repo can execute a gesture.
2. **The four truths and the one key link closed by the reconciliation regressed clean** on the identical tree: the delivered `<md` contract is the rail (arc `md:block`, rail `md:hidden`, `h-[400px]`-free zone, `h-[400vh]` base range), the index derivation is un-branched, and `steppedIndexRef`/`scheduleRef` are absent under a green gone-check.
3. **The full gate is green over the final workspace state**, re-run first-hand this session at `b4dc674` with a clean tree: typecheck 0 · 314/314 · build 0 (4 static routes) · sweep 22/22 on the fresh export · 10/10 named behavioural rows. No `src`/`tests` file has changed since the prior verification, and the only commit since then is a `.planning/` checklist append.
4. **Residual documentation lag (AP-5/AP-6/AP-7)** — one ROADMAP goal cell, the UI-SPEC's §10 item 4 wording, two plan bodies, one test message, and one checklist line-ref. Wording only; recorded as warnings, not re-opened truths, because the authoritative requirement text, every declared must-have and the shipped code are mutually consistent. The ROADMAP cell should be fixed before the milestone audit reads it.

**Status: `passed`** · Score **48/48** · `behavior_unverified: 0` · `overrides_applied: 0` · human items outstanding: **0**.

---

*Phase: 13-mobile-parity-revision · RE-VERIFICATION run 2026-10-05T10:56:12Z at HEAD b4dc674 (tree clean; `src/`+`tests/` unchanged since b21866a) · verifier: fresh-context subagent · not committed (the orchestrator bundles it)*
