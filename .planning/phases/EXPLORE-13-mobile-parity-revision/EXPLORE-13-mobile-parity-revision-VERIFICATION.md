---
phase: 13-mobile-parity-revision
verified: 2026-10-05T10:45:22Z
status: gaps_found
score: 41/48 must-haves verified
behavior_unverified: 2
overrides_applied: 0
verification_tree: "HEAD 9c3956f on branch phase-13; `git status --porcelain` EMPTY (worktree clean). No prior EXPLORE-13-...-VERIFICATION.md existed in the phase directory, so this is a FIRST verification, not gap re-verification — the re-verification framing consumed an empty failed-item set. Every fact below was re-derived by a command run in THIS session at THIS tree (`npm run typecheck`, `npm test`, `npm run build`, `node --test tests/explore-sweep.test.mjs`, targeted named rows, source greps, and greps against the freshly built `out/` + its emitted CSS). No SUMMARY.md claim was inherited."
requirement_divergence: "REV-23 in REQUIREMENTS.md is marked [x], but its literal arc clause — 'the semicircular arc renders on phones (scaled to the narrow container)' — is NOT delivered: the arc SVG and both marker templates are `hidden md:block`, and a vertical year rail renders below md instead. The change is an explicit post-execute USER directive (quick 2026-10-05-band-tighten-and-mobile-rail, commit 43432f5: 'the squeezed arc is unappealing' → 'the vertical year rail + one at a time, changing while scrolling'), and the user's standing verdict 'perfect' is recorded AFTER it (9fd3a87, checklist `status_human: approved`). The delivered code matches the user's final directive; the locked artefacts (REQUIREMENTS REV-23, CONTEXT D-01, plan-01 truths 1-3, key link L4) still describe the superseded contract and were never reconciled. Recorded as gaps rather than smoothed into verified, because those artefacts are now false as written and a milestone audit would read REV-23 as delivered."
human_verification_status: "The real-hardware checklist (EXPLORE-13-MOBILE-CHECKLIST.md: items 1-11 + item 0 + one supplementary item) exists and carries the user's itemized verdict with `status_human: approved`; the Reduce-Motion precondition is recorded ON and option (a) — no code change — chosen. ONE behavioral claim remains unobserved on real hardware: touch drag actually moving a card. On the only tested device Reduce Motion is ON, which disables drag by the verified phase-10 REV-20 contract (`drag={isFront && !reducedMotion ? 'x' : false}`), so the drag path has never been exercised on hardware by either the user or any test."
gaps:
  - truth: "Plan 01 truth 1 / ROADMAP REV-23 arc clause — a 375px viewport renders the semicircular arc above the content column (arc stroke + all five year markers positioned on the curve + the Prev/Next controls), no hidden gate hides any of it, and the semicircle renders below md scaled to the narrow container"
    status: failed
    reason: "The arc is md-only PRESENTATION: the SVG carries `hidden md:block` (experience-section.tsx:237), every dot marker carries `hidden md:block` (:266) and every year/date label carries `hidden md:block` (:281). Below md a vertical year rail (`md:hidden`, :192) renders instead. The SPEC's own grep falsifier — 'no `hidden md:flex` on the arc container' — passes VACUOUSLY, because the old gate was renamed rather than retired; that is the existence-vs-behaviour trap: the literal check is green while the stated Target is unmet. Cause is a user-directed supersession (commit 43432f5), not an implementation defect."
    artifacts:
      - path: "src/components/explore/sections/experience-section.tsx"
        issue: "arc SVG at :237 and both marker templates at :266/:281 carry `hidden md:block`; the rail renders at :190-229 with `md:hidden`"
    missing:
      - "the semicircle rendered below md (REV-23 as written)"
      - "a reconciled REV-23 / CONTEXT D-01 / plan-01 truth-1 text describing the delivered rail contract"
  - truth: "Plan 01 truth 2 — all five timeline entries stay readable on a phone: no content layer is hidden below md, and no layer carries aria-hidden at <md"
    status: failed
    reason: "The <md body is a ONE-AT-A-TIME single-cell overlay: the five layers share `col-start-1 row-start-1` and the four inactive ones are `opacity-0 invisible` (:367-369), so four entries are hidden below md by design. Superseded by the user's RESOLVED-D1 answer ('one at a time, changing while scrolling', recorded in checklist item 5 and in the quick-task TASK.md). The delivered behaviour matches that answer; the plan truth does not."
    artifacts:
      - path: "src/components/explore/sections/experience-section.tsx"
        issue: "inactive layers are `opacity-0 invisible` at base (:368) — the all-five-readable <md contract is retired"
    missing:
      - "the five-entry readable stack at <md (superseded)"
      - "a reconciled RESOLVED-D1 / plan-01 truth-2 text"
  - truth: "Plan 01 truth 3 and key link L4 — the Prev/Next controls step the arc at <md because the stepped index IS the <md derivation input, and the stepped index survives a ResizeObserver pass without snapping back to entry 0 (link pattern `steppedIndexRef`)"
    status: failed
    reason: "The declared mechanism no longer exists: `steppedIndexRef` and `scheduleRef` are RETIRED (only a retirement comment remains at use-timeline-progress.ts:243; their absence is pinned by tests/explore-visuals.test.mjs:1107-1111). Stepping now runs ONE width-agnostic path — `goToRole` → `scrollTargetForRole` → `main.scrollTo` (:379-401) — which the <md 400vh scroll range makes meaningful. The observable outcome (controls step at every width, no snap-back) IS delivered by the replacement mechanism and test-pinned, but the declared key link is NOT_WIRED and the truth as written is false."
    artifacts:
      - path: "src/components/explore/use-timeline-progress.ts"
        issue: "steppedIndexRef/scheduleRef retired (:243 comment only); the <md branch was replaced by the unified scroll-target path (:379-401)"
    missing:
      - "the stepped-index derivation input and its <md branch, as declared"
---

# Phase 13: mobile-parity-revision Verification Report

**Verification tree:** branch `phase-13`, HEAD `9c3956f`, `git status --porcelain` **empty**. Sources and tests are unchanged since the last execute commit (`0ef6b20`); the three commits above it are planning-document-only (`83d839e`, `a48cd0b`, `9c3956f`) plus the two user-directed amendment commits (`47ea74a`, `43432f5`).

**Prior verification:** none existed for phase 13. Standard first-pass verification; the re-verification instruction was honoured by loading the recorded user verdict and the two post-execute amendment quick tasks as first-class context.

**Method note:** SUMMARY claims were treated as leads, never as evidence. Every row below is backed by a command run in this session — the full gate over the final tree, targeted named test rows, source reads with line numbers, and greps against the freshly rebuilt `out/` and its emitted CSS bundle.

---

## Goal Achievement → Observable Truths

### Roadmap truths (ROADMAP.md phase-13 success criteria, always loaded)

| # | Truth | Status | Evidence |
|---|---|---|---|
| RT-1 | **REV-23 / phase goal:** the `<md` simplifications are retired — the **semicircular arc renders on phones** (scaled to the narrow container) and every panel behaves per its desktop contract | ✗ **FAILED** | Source: arc SVG `hidden md:block` (`experience-section.tsx:237`), dot markers `hidden md:block` (:266), labels `hidden md:block` (:281); a `md:hidden` vertical year rail renders at :190-229. Export: `out/index.html` has 1 arc path (inside the `hidden` gate), **5 rail markers**, `h-[200px]` rail/arc box. The old `hidden md:flex` gate is gone (so the SPEC's grep falsifier passes vacuously) but the arc does not render below md. User-directed supersession — commit `43432f5`; see `requirement_divergence`. |
| RT-2 | **REV-23b:** the Projects swipe stack gets the FULL treatment on touch — touch drag swipes the foreground card away, the card behind peeks, the stack is centred, depth/bloom shadows render | ⚠️ **PRESENT_BEHAVIOR_UNVERIFIED** | Structure fully verified: ONE contract at every width, no mode prop, no mobile wrapper, `drag={isFront && !reducedMotion ? 'x' : false}` (`projects-stack-stage.tsx:607`), the drag card's SSR inline `touch-action:pan-y` present in `out/index.html`, the structural `.explore-shell [data-projects-swipe-stage]{touch-action:pan-y}` rule emitted, peeks/centring/shadows pinned by `tests/projects-stack.test.mjs` (35/35). The **drag behaviour itself has never been observed on hardware**: the only tested device has Reduce Motion ON, which disables drag by the verified phase-10 REV-20 contract. Checklist item 6 is recorded as `PASS — read with item 0 (RM ON)` on the user's standing verdict, not on an observed drag. |
| RT-3 | **REV-24:** the avatar is removed entirely from the About panel (no image, no initials) | ✓ **VERIFIED** | `grep -nE "<img|Portrait of|initials"` over `about-section.tsx` → no avatar markup. Built export: `out/index.html` `grep -o '<img'` → **0**, `src="https://tinyurl.com/5cfm72u7"` → **0**, `Portrait of` → **0**. The panel reflows via the pinned `mt-3` rhythm (`about-section.tsx:138,152-153`). Data preserved: `git diff 4902fcf..HEAD -- src/data/` **empty** — `profileImageUrl` stays in the JSON and `.d.ts`, unconsumed. |
| RT-4 | **REV-25:** the mobile-native platform pack — proper viewport meta with `viewport-fit=cover`, dvh/svh, `overscroll-behavior: none`, tap-highlight off, `touch-action: manipulation`, safe-area padding — eliminating the gap-after-footer and the extra scrollbars | ✓ **VERIFIED** | Emitted export: **exactly one** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>`; `shrink-to-fit` 0, `maximum-scale` 0, `user-scalable` 0; 2 `theme-color` tags survive. Emitted CSS (`out/_next/static/css/b6ffad8fda5ba753.css`): `html:has(.explore-shell),body:has(.explore-shell){overscroll-behavior:none}`, `.explore-shell button/[role=button]/a{touch-action:manipulation}`, `.explore-shell [data-projects-swipe-stage]{touch-action:pan-y}`, `env(safe-area-inset-top/bottom)` with `calc()` height compensation — all at byte indices **after** the single `prefers-reduced-motion` guard (42100 < 42509/42602/42671/42728/42842). Lock inline style in `out/index.html`: `height: 100%` → `height: 100dvh` → `overflow: hidden`, with `/cli` and `/resume` carrying none of it (0 occurrences). User PASS recorded for the gap-after-footer and the single-scrollbar items. |

### Plan 01 truths (arc parity) — 2/5

| # | Truth | Status | Evidence |
|---|---|---|---|
| P01-1 | A 375px viewport renders the semicircular arc above the content column; no `hidden` gate hides any of it | ✗ **FAILED** | `hidden md:block` at `:237/:266/:281`; see gap 1. Superseded by the user's rail directive (`43432f5`). |
| P01-2 | All five timeline entries stay readable on a phone; no layer hidden below md; no aria-hidden at `<md` | ✗ **FAILED** | `opacity-0 invisible` on the four inactive layers (`:368`); see gap 2. Superseded by the user's one-at-a-time answer. |
| P01-3 | Prev/Next step the arc at `<md` via the stepped-index derivation input, surviving a ResizeObserver pass | ✗ **FAILED** (as written) | `steppedIndexRef`/`scheduleRef` retired; the replacement path (`goToRole` → `scrollTargetForRole` → `main.scrollTo`, `:379-401`) delivers the observable outcome; see gap 3. |
| P01-4 | No arc label paints outside the arc zone at any width (so `<main>` never gains a horizontal scrollbar) | ✓ **VERIFIED** | Labels are `hidden md:block`, so nothing can overflow below md. At md+ the predicate is fed the measured **anchor budget**, not the raw width: `dateLineFits(active.entry.duration, anchorBudget ?? 250)` (`experience-section.tsx:170`), with `anchorBudget` derived at the measurement site via the pure `labelAnchorBudget` (`use-timeline-progress.ts:207`, returned at `:418`) = `centerX − 0.88·R` (`timeline-geometry.ts:330,349`). Named row green: `REV-23 anchor budget: labelAnchorBudget is the px budget the date-line predicate consumes — 375 suppressed, 1440 shown, boundary-sensitive` (1/1). |
| P01-5 | Only one value in the arc path is width-specific — the zone's box height; marker positions stay container-derived at every width | ✓ **VERIFIED** | The zone is `relative h-[200px] md:h-auto md:flex-1` (`:180`) — one width-specific box height; the geometry derives from the measured rect (`viewBoxToPx({width, height})`, `use-timeline-progress.ts:202`) and `M 100 0 A 100 100 0 0 0 100 200` is a fixed viewBox path. |

### Plan 02 truths (one swipe-stack contract) — 4/5

| # | Truth | Status | Evidence |
|---|---|---|---|
| P02-1 | A phone renders the SAME stack as desktop: touch drag swipes the card away, behind-cards peek, stack centred, shadows render — one contract | ⚠️ **PRESENT_BEHAVIOR_UNVERIFIED** | Same row as RT-2: composition verified (base tier 520/760 with the full 240px band, `origin-bottom`, `opacity`/`scale`/`z` ladders in `projects-card-state.ts`), drag unobserved on hardware. |
| P02-2 | No simplified mobile stack exists anywhere in the tree | ✓ **VERIFIED** | `ls src/components/explore/sections/projects-mobile-stack.tsx` → No such file; `grep -rn "ProjectsMobileStack\|projects-mobile-stack" src/` → 0 source hits; gone-checks live at `tests/explore-visuals.test.mjs:1236,1331-1335` and `tests/explore-visuals-server.test.mjs:162`. |
| P02-3 | The base/unprefixed heights ARE the phone heights — the fixed limited-peek box is retired and the full peek band shows at `<md` | ✓ **VERIFIED** | `CARD_HEIGHT_CLASS = 'h-[520px] md:h-[560px]'` (`projects-stack-stage.tsx:149`); `STAGE_HEIGHT_CLASS = 'h-[760px] md:h-[800px]'` (:156); `PEEK_SAFE_PX = 20` (:139), `PEEK_BAND_PX = DEPTH_LEVELS * VISIBLE_BAND_PX + PEEK_SAFE_PX` (:140) with `VISIBLE_BAND_PX = 44` (`projects-card-state.ts:117`) → 240. No `mode`/`compact`/`max-w-[320px]` residue in the stage. |
| P02-4 | Only one width-specific value pair (stage + card heights), and both pairs satisfy the stage arithmetic so peeks and the fly-off cannot extend the layout at either width | ✓ **VERIFIED** | Both tiers satisfy `stage = card + PEEK_BAND_PX`: 520+240=760, 560+240=800. Test rows derive the numbers from the constants rather than inlining them: `tests/projects-stack.test.mjs:635-691` (PEEK_SAFE_PX named, `PEEK_BAND_PX` derived, `tier i: stage = card + band`, the depth-5 top edge landing exactly on the 20px safe margin). |
| P02-5 | The stage carries the stable `data-projects-swipe-stage` hook its `touch-action: pan-y` rule targets | ✓ **VERIFIED** | `projects-stack-stage.tsx:733` `data-projects-swipe-stage="true"`; the rule exists in source (`globals.css:743`) **and** in the emitted CSS; `out/index.html` carries the attribute. |

### Plan 03 truths (viewport / platform pack / avatar) — 6/6

| # | Truth | Status | Evidence |
|---|---|---|---|
| P03-1 | The document declares EXACTLY ONE viewport meta carrying `width=device-width, initial-scale=1, viewport-fit=cover` — no `shrink-to-fit`, no `maximum-scale`, no `user-scalable` | ✓ **VERIFIED** | `grep -o '<meta name="viewport"[^>]*>' out/index.html` → exactly 1 tag: `content="width=device-width, initial-scale=1, viewport-fit=cover"`; counts 0/0/0 for the banned directives. Named row green: `REV-25a (E): the built landing declares exactly ONE viewport meta — the fit declared, the legacy directives gone`. |
| P03-2 | On a phone the strip below the footer is gone: document height, body height and the shell's `h-dvh` are the same dynamic number and overscroll is suppressed | ✓ **VERIFIED** | `src/app/(home)/layout.tsx:64-71` `html, body { height: 100%; height: 100dvh; overflow: hidden; }` emitted verbatim into `out/index.html`; shell is `explore-shell flex h-dvh … overflow-hidden` (`explore-shell.tsx:65`); `overscroll-behavior:none` emitted on `html` and `body`. User checklist item 2 → **PASS**. |
| P03-3 | Header/footer paint their safe-area insets without compressing their content bands | ✓ **VERIFIED** (structural); hardware look covered by the recorded verdict | `globals.css:757-772`: `padding-top: env(safe-area-inset-top, 0px); height: calc(52px + env(safe-area-inset-top, 0px))` on `.explore-shell > header`, and the `1.75rem`/`2rem` `calc()` pair on `> footer`; both bands emitted, and `tests/route-swap.test.mjs` derives the literals from the two component sources. Checklist item 1 recorded **COVERED** (not individually reported) on the user's standing verdict — a visual claim that no programmatic check can confirm, and it is not re-raised as outstanding (see `human_verification_status`). |
| P03-4 | Tapping a control no longer flashes the grey highlight; buttons/anchors lose the double-tap delay; the drag stage keeps horizontal drag while vertical page scroll survives | ✓ **VERIFIED** | `html:has(.explore-shell){-webkit-tap-highlight-color:transparent}`, `.explore-shell button/[role=button]/a{touch-action:manipulation}`, `.explore-shell [data-projects-swipe-stage]{touch-action:pan-y}` — all present in source and in the emitted CSS; `grep -rn "touch-action: none" src/` → **no hits** (the "carousel scrolls the wrong way" blocker is absent). Supplementary checklist item recorded COVERED. |
| P03-5 | The About panel renders no avatar — no `<img>`, no initials chip, no substituted element | ✓ **VERIFIED** | See RT-3: zero `<img>` in the source panel and zero in the built export. |
| P03-6 | Nothing is deleted from the data: `meta.viewport` and `about.profileImageUrl` stay byte-identical in the JSON and the `.d.ts`, unconsumed by the landing UI | ✓ **VERIFIED** | `git diff 4902fcf..HEAD -- src/data/` → **empty**; the JSON still carries `"viewport": "width=device-width, initial-scale=1, shrink-to-fit=no"` (:5) and `"profileImageUrl":"…"` (:28), `.d.ts:82` intact. Consumption retired: `grep -rn 'name="viewport"\|meta.viewport' src/` → only prose comments (`layout.tsx:60-67`); `portfolioData.meta.viewport` has **no** code consumer. |

### Plan 04 truths (acceptance surface) — 4/4

| # | Truth | Status | Evidence |
|---|---|---|---|
| P04-1 | The stale `<md` sweep rows are renewed to the parity contracts and the phase's new export rows pass on a freshly built `out/` | ✓ **VERIFIED** | Rebuilt this session (`next build` exit 0, 4 static routes). `node --test tests/explore-sweep.test.mjs` → **22/22**, including `sweep row EXPLORE@375 (P): every new placement/height utility is md-scoped` (the new base `h-[400vh]` is deliberately outside its token list while `h-[300vh]`/`col-span`/`h-[calc(100dvh-10rem)]` all remain `md:`-prefixed), `sweep rows EXPLORE@375 (P): the rail column + the base scroll range`, and `sweep E-10 (E, phase 13)`. |
| P04-2 | Every VISUAL and TOUCH claim is carried by a written, user-owned checklist item | ✓ **VERIFIED** | `EXPLORE-13-MOBILE-CHECKLIST.md` (167 lines) quotes UI-SPEC §10 items 1-11 verbatim + item 0 (RM precondition) + one supplementary item, with per-item verdicts and a `User verdict` block carrying `status_human: approved`. |
| P04-3 | The Reduce-Motion precondition is explicitly put to the user and its answer recorded | ✓ **VERIFIED** | Recorded **ON**, option (a) — no code change; stated in both the premise block and the itemized results, and cross-referenced by plan 04's SUMMARY. This closes RESEARCH R1/OQ-1 on the record rather than by inference. |
| P04-4 | The full gate is the LAST chronological action; any write after the phone test reopens it and it is re-run over the final workspace state | ✓ **VERIFIED** | Re-run independently this session at HEAD `9c3956f` on a clean tree: `npm run typecheck` **exit 0**; `npm test` **314/314 pass, 0 fail** (14 files); `npm run build` **exit 0** (4 static routes exported); `node --test tests/explore-sweep.test.mjs` **22/22**. Commits after the execute wave are planning-document-only or the two user-directed source amendments, and the verdict commit `9fd3a87` (13:40) postdates both amendments (`47ea74a` 12:41, `43432f5` 13:27). |

---

## Score

**41 / 48 must-haves verified** — 18 of 24 truths (4 roadmap + 20 plan), 12/12 artifacts, 11/12 key links. `behavior_unverified: 2` (the drag clause in RT-2 and P02-1). `overrides_applied: 0` — nothing was reclassified to reach green.

- **4 truths FAILED** (RT-1, P01-1, P01-2, P01-3) — all four are the same user-directed supersession of the arc-at-`<md` contract, recorded as gaps because the locked artefacts still assert the superseded behaviour.
- **2 truths PRESENT_BEHAVIOR_UNVERIFIED** (the touch-drag clause, counted once in the roadmap truth and once in the plan-02 truth it is restated in).
- **1 key link NOT_WIRED** (plan-01 L4, `steppedIndexRef`) — the replacement link is wired and delivers the outcome, but the declared pattern is absent from the tree.
- **2 artifact deviations, INFO only** (not failures): plan-01 declares `exports: [TimelineStage]` but the component is module-private; plan-03 declares `exports: [documentScrollLock]` but the lock is a module-private `const`. Both are consumed internally by the exported surface (`ExperienceSection`; the default-exported `ExploreLayout`), so the capability is wired — the frontmatter's export list is what is inaccurate.

---

## Deferred Items

Filtered against later milestone phases: **phase 13 is the final phase of the v1.0 milestone** (ROADMAP lists 13 phases; the Progress table ends at 12, with 13's row to be added at ship). There is therefore no later phase to consume these — they carry to the milestone audit as outstanding UAT items:

| Item | Source | Status |
|---|---|---|
| Landscape-specific tweaks (test once on the phone; adapt only if broken) | CONTEXT deferred | Not tested — checklist records portrait only. Carries to milestone audit. |
| A user-supplied profile image | CONTEXT deferred | Explicitly closed by REV-24 ("no image, no initials") — do not revisit unless the user asks. |
| PWA/manifest additions | CONTEXT deferred | Future milestone candidate. |
| Sticky-hover tint gating (`@media (hover: hover)`) | RESEARCH OQ-6 | Deliberately deferred; only promote if the phone shows a lingering tint that bothers the user. |
| `/cli` + `/resume` under the notch (`viewport-fit: cover` is root-level) | RESEARCH OQ-9 | Accepted side effect, out of scope; checklist item 9 recorded COVERED. |

---

## Required Artifacts

| Path | Declared | Actual | Substantive | Wired |
|---|---|---|---|---|
| `src/components/explore/sections/experience-section.tsx` | ≥300 lines, exports `TimelineStage` | **420** lines; exports `ExperienceSection` (TimelineStage is module-private, `:150`) | ✓ | ✓ rendered by `explore-panels.tsx` — ⚠️ export-list deviation (INFO) |
| `src/components/explore/use-timeline-progress.ts` | ≥340, exports `useTimelineProgress`, `TimelineProgress` | **421** lines; both exports present (`:127,:149`) | ✓ | ✓ consumed by the stage (`:159`) |
| `src/components/explore/timeline-geometry.ts` | ≥300, exports `labelAnchorBudget`, `dateLineFits`, `viewBoxToPx` | **349** lines; all three present | ✓ | ✓ `labelAnchorBudget` at the measurement site, `dateLineFits` at the call site |
| `src/components/explore/sections/projects-stack-stage.tsx` | ≥690, exports `ProjectsStackStage`, `ProjectsSwipeStack` | **779** lines; both exports present (`:626,:777`) | ✓ | ✓ one unconditional render from `projects-section.tsx:36` |
| `src/components/explore/sections/projects-section.tsx` | ≥40, exports `ProjectsSection` | **42** lines; export present (`:22`) | ✓ | ✓ rendered by `explore-panels.tsx` |
| `src/components/explore/sections/projects-mobile-stack.tsx` | must NOT exist (gone-check) | **absent** | ✓ (retirement) | ✓ gone-checks live in three suites |
| `src/app/layout.tsx` | ≥120, exports `viewport`, `metadata`, `RootLayout` | **147** lines; all three present (`:29,:69,:80`) | ✓ | ✓ emitted as the single viewport tag in `out/index.html` |
| `src/app/(home)/layout.tsx` | ≥80, exports `documentScrollLock` | **124** lines; `documentScrollLock` is a module-private `const` (`:64`) | ✓ | ✓ injected at `:121`; lock present in `out/index.html` — ⚠️ export-list deviation (INFO) |
| `src/app/globals.css` | ≥720 | **773** lines | ✓ | ✓ pack emitted in the built CSS, after the RM guard |
| `src/components/explore/sections/about-section.tsx` | ≥190, exports `AboutSection` | **225** lines; export present (`:98`) | ✓ | ✓ rendered by `explore-panels.tsx`; zero avatar markup |
| `tests/explore-sweep.test.mjs` | ≥460 | **615** lines | ✓ | ✓ 22/22 green against the fresh build |
| `…/EXPLORE-13-MOBILE-CHECKLIST.md` | ≥40 | **167** lines | ✓ | ✓ quoted from UI-SPEC §10 + the recorded user verdict |

No artifact is missing, empty, or a stub.

---

## Key Link Verification

| ID | From → To | Declared pattern | Verdict | Evidence |
|---|---|---|---|---|
| L1 | `use-timeline-progress.ts` → `experience-section.tsx` | `anchorBudget` | **WIRED** | Derived at the measurement site (`:207`), returned (`:418`), consumed by the date-line predicate (`:170`). |
| L2 | `timeline-geometry.ts` → `use-timeline-progress.ts` | `labelAnchorBudget` | **WIRED** | Pure function at `timeline-geometry.ts:349`; the hook calls it with the measured `ArcGeometry`. |
| L3 | `use-timeline-progress.ts` → `experience-section.tsx` | `stepRole\|handleKeyDown` | **WIRED** | `handleKeyDown` on the `role="group"` root (`:173`); `stepRole(-1)`/`stepRole(1)` on both buttons (`:308,:323`); both implemented in the hook (`:403-411`). |
| L4 | `experience-section.tsx` → `use-timeline-progress.ts` | `steppedIndexRef` | **✗ NOT_WIRED** | No declaration in the tree — only the retirement comment (`use-timeline-progress.ts:243`); the absence is intentionally pinned by `tests/explore-visuals.test.mjs:1107-1111`. Replacement link verified instead: button → `stepRole` → `goToRole` → `scrollTargetForRole` → `main.scrollTo` → scroll event → `derive()` → `setActiveIndex`. **See gap 3.** |
| L5 | `projects-section.tsx` → `projects-stack-stage.tsx` | one unconditional `<ProjectsStackStage projects={cards} />` | **WIRED** | `projects-section.tsx:36`, single occurrence, no mode argument, no viewport wrapper. |
| L6 | `projects-stack-stage.tsx` → `globals.css` | `data-projects-swipe-stage` | **WIRED** | Attribute at stage `:733`; rule at `globals.css:743`; both the attribute and the rule verified in `out/index.html` + the emitted CSS. |
| L7 | `tests/projects-stack.test.mjs` → `projects-stack-stage.tsx` | `PEEK_BAND_PX` | **WIRED** | The suite derives constants and both tiers from the source (`:635-691`) instead of restating numbers. |
| L8 | `src/app/layout.tsx` → `out/index.html` | `viewport-fit=cover` | **WIRED** | Typed export (`layout.tsx:69-72`) → exactly one emitted tag carrying `viewport-fit=cover`; the data-file meta line has no consumer. |
| L9 | `globals.css` → `explore-shell.tsx` | `explore-shell > (header\|footer)` | **WIRED** | Selectors at `globals.css:757,762,771`; both bars are direct children of the shell root (`explore-shell.tsx:65`). |
| L10 | `globals.css` → `projects-stack-stage.tsx` | `data-projects-swipe-stage` | **WIRED** | Same pair as L6, verified end-to-end in the emitted CSS. |
| L11 | `tests/explore-sweep.test.mjs` → `out/index.html` | `viewport-fit=cover` | **WIRED** | E-10 reads the freshly built export; passes (22/22) after a build run in this session. |
| L12 | `EXPLORE-13-MOBILE-CHECKLIST.md` → `UI-SPEC.md` | `§10` | **WIRED** | The checklist's header and item blocks quote §10 verbatim and add the OQ-1 precondition; `§10` reference present. |

**11/12 WIRED.** The one NOT_WIRED link is a retired mechanism whose replacement is wired — recorded, not silent.

---

## Data-Flow Trace

```
portfolio-main-data.json
  ├─ experience + education ──▶ selectTimelineEntries()  [timeline-geometry.ts — the ONE derivation site]
  │        └─▶ 5 entries, year-DESCENDING (2023 … 2012), present-first
  │              ├─ md+  : measured arc zone ──▶ viewBoxToPx ──▶ markerPoint (cos/sin)
  │              │          └─▶ rAF writes: dot/label transforms + layer opacity/visibility
  │              │                └─ labelAnchorBudget (centerX − 0.88·R) ──▶ dateLineFits ──▶ date line shown?
  │              └─ <md : rail markers (React classes off activeIndex) + ONE visible layer
  │
  └─ scroll ──▶ <main> scroll event (live at EVERY width)
        └─▶ derive(): computeProgress(rel, range) ──▶ continuousIndex ──▶ activeIndexFromContinuous
              ├─ EVERY width : setActiveIndex(active)  ──▶ rail accent + one-at-a-time layer swap
              └─ md+ ONLY    : imperative marker/layer writes (the surviving md gate)

projects ──▶ slice(0,6) ──▶ ProjectsStackStage ──▶ cardState(index, frontIndex, count, reducedMotion)
                                   └─ levelsFor(cardHeight) : translateY = −(l·44 + H·(1−scale_l)), yLeave = yUp − 56
                                        └─ stage = card + PEEK_BAND_PX (240) — 760 base / 800 md
```

The data path is intact and single-sourced: no hardcoded portfolio content was introduced, `EXPLORE-07` survives, and the only width branch in the flow is the presentation branch (arc vs rail), not a data branch.

---

## Behavioral Spot-Checks

Run this session; named rows only (no full-suite padding beyond the required gate):

| Check | Command | Result |
|---|---|---|
| Typecheck over the final tree | `npm run typecheck` | **exit 0**, no diagnostics |
| Full suite (repo's real CI suite) | `npm test` | **314/314 pass, 0 fail** (14 files) |
| Static export build | `npm run build` | **exit 0**, 4 static routes (`/`, `/_not-found`, `/cli`, `/resume`) |
| Sweep, incl. phase-13 export row | `node --test tests/explore-sweep.test.mjs` | **22/22 pass** — `sweep E-7`, `E-8`, `E-9`, `E-10 (E, phase 13)`, `REV-25a (E)`, `REV-25b` all green |
| Swipe-stack one-contract rows | `node --test --test-name-pattern="REV-23b" …` | **3/3 pass** — mode plumbing retired, no compact branch, no width cap |
| Rail renewal rows | `node --test --test-name-pattern="rail" …` | **4/4 pass** — incl. `REV-23c rail parity: the <md squeezed arc is retired` |
| Anchor-budget row | `node --test --test-name-pattern="anchor budget" …` | **1/1 pass** — 375 suppressed, 1440 shown, boundary-sensitive |
| Export falsifier (first-hand) | greps on `out/index.html` | one viewport tag with `viewport-fit=cover`; 0 `shrink-to-fit`; 0 `<img>`; 0 `Portrait of`; 5 rail markers; arc path present but `hidden md:block` |
| Emitted CSS falsifier (first-hand) | greps on `out/_next/static/css/*.css` | all five pack rules present, all after the single RM guard |

**Not run, deliberately:** no browser/DOM/device instrumentation exists in this repo (no jsdom, no Playwright), so every responsive/touch claim is provable only by source greps, pure-function rows, built-export assertions, or the user's phone. The phone was tested by the user, whose itemized verdict is on file.

---

## Requirements Coverage

| REQ-ID | Requirement (abridged) | Status | Evidence |
|---|---|---|---|
| **REV-23** | Full mobile parity: `<md` simplifications retired — the semicircular arc renders on phones, the Projects swipe stack gets the full touch treatment, every panel behaves per its desktop contract, tested on real hardware | ⚠️ **PARTIAL / DIVERGED** | Swipe-stack parity: delivered (one contract, full band, centring, shadows) but the drag is unobserved on hardware. `<md` simplifications: replaced rather than retired — the arc's `hidden md:flex` became `hidden md:block`, with a `md:hidden` rail taking over. Every panel per desktop contract: true for About/Skills/Projects/Credentials; the Experience panel is deliberately one-at-a-time on phones. Real-hardware test: performed and recorded. **Marked `[x]` in REQUIREMENTS.md while its literal arc clause is false — see gap 1.** |
| **REV-23b** (plan-local) | A phone renders the SAME Projects stack as desktop: touch drag, behind-cards, centred, shadows | ⚠️ **PARTIAL** | Composition, centring, depth ladders and the touch-action contract verified; the drag gesture is structurally wired but unproven on hardware (RM ON on the test device). |
| **REV-24** | The avatar is removed entirely (no image, no initials) | ✓ **DELIVERED** | Zero avatar markup in source and export; data preserved; panel reflowed. |
| **REV-25** | The mobile-native platform pack: proper viewport meta (`viewportFit=cover`), dvh/svh, `overscroll-behavior: none`, tap-highlight off, `touch-action: manipulation`, safe-area padding — eliminating the gap-after-footer and the extra scrollbars | ✓ **DELIVERED** | One viewport tag with cover; `height:100dvh` reconciliation; all four CSS rules emitted after the RM guard; user PASS recorded for the gap and the scrollbar items. Its "wizard/tour/stack/drag machinery untouched" clause is **qualified**: the wizard, tour, drawer, Credentials, header and status bar are byte-identical, but the stack's geometry was amended twice by the user's own directives (`47ea74a`, `43432f5`) inside this phase. |

CONTEXT decision coverage: **D-02, D-03, D-04, D-05, D-06, D-07 delivered (6/7)**; **D-01 diverged** — "the arc renders at EVERY width" is not what shipped, superseded by the user's rail directive. D-03 verified by absence of any diff in `explore-tour.tsx`, `explore-drawer.tsx`, `credentials-section.tsx`, `explore-header.tsx`, `explore-status-bar.tsx`, `src/app/cli/`, `src/app/resume/`.

---

## Anti-Patterns Found

| ID | Finding | Severity | Note |
|---|---|---|---|
| AP-1 | **Vacuous acceptance criterion.** REV-23's SPEC/SWEEP falsifier is "no `hidden md:flex` on the arc container". It passes because the gate was renamed to `hidden md:block` — the check is green while the stated Target (the semicircle below md) is unmet. | **WARNING** | The test that was supposed to prove REV-23 now proves nothing. A behavioural row (the arc's computed display at 375px, or a gone-check on the `hidden md:block` form) is required. This is the most important finding in the report. |
| AP-2 | **Stale locked artefacts.** `REQUIREMENTS.md` REV-23 is `[x]` with arc-on-phone text; CONTEXT D-01 says the arc renders at every width; plan-01 truths 1-3 assert the same. All four were superseded mid-phase and never reconciled. | **WARNING** | Gaps 1-3. A milestone audit reading REV-23 as delivered would be wrong. |
| AP-3 | **Unverified headline behaviour.** The touch-drag clause (the user's original complaint) has never been observed working on a real device, and cannot be on the only tested device while Reduce Motion is ON. | **WARNING** | Recorded as a precondition artifact in the checklist; needs either an RM-OFF hardware re-test or an explicit waiver. |
| AP-4 | **Declared exports that do not exist.** plan-01 declares `exports: [TimelineStage]` (module-private); plan-03 declares `exports: [documentScrollLock]` (module-private `const`). | **INFO** | Capability is wired through the exported surfaces; only the frontmatter export lists are inaccurate. Not a stub, not a failure. |
| AP-5 | **Requirement text vs. delivered contract** for "`<md` simplifications retired": the arc's `<md` gate was replaced by a different `<md` simplification (the rail), so the clause is satisfied in form and not in substance. | **INFO** | Correct outcome for the user's directive; flagged so the wording is fixed rather than re-litigated. |

No `TBD`/`FIXME`/`XXX`/`HACK` markers in any touched source (`grep -rniE` over `src/components/explore/`, both layouts, `globals.css` → none). No unreferenced debt markers. No blocker anti-pattern found.

---

## Human Verification Required

Only one item is genuinely outstanding — everything else visual/touch is covered by the user's recorded, itemized verdict (`status_human: approved`):

| # | Test | Expected | Why human |
|---|---|---|---|
| H1 | On a real phone with **Reduce Motion OFF**, drag the foreground Projects card horizontally | The card follows the finger and loops to the back; behind-cards stay visible; the stack stays centred; vertical swipes still scroll the page | The drag path is structurally wired and CSS-pinned, but no test or hardware run has ever observed it executing — on the only available device RM is ON, which disables `drag` by the verified phase-10 REV-20 contract. Alternative: the user may explicitly waive this clause (option (a), already recorded) and rely on the Prev/Next buttons, which do work at every width. |

Secondary, already covered by the standing verdict and therefore *not* raised as outstanding: the notch/home-indicator safe-area look (checklist item 1, COVERED), both-theme legibility on hardware (item 11, COVERED), the tap-highlight flash (supplementary, COVERED), and `/cli` + `/resume` under the notch (item 9, COVERED accepted side effect).

---

## Gaps Summary

The phase **delivered what the user finally asked for, and the user said so on the record** — but three of its locked truths and the ROADMAP requirement text still describe the contract the user rejected on the phone. Reporting this as `gaps_found` is a statement about the artefacts, not about the code:

1. **Gap 1 — REV-23's arc clause is false as written.** The arc is `hidden md:block`; a vertical year rail renders below md. Cause: user directive (`43432f5`), approved (`9fd3a87`). Needs: either the semicircle below md, or — correctly — a rewrite of REV-23 / CONTEXT D-01 / plan-01 truth 1 to the rail contract.
2. **Gap 2 — the all-five-readable `<md` contract is retired.** The user answered RESOLVED-D1 with "one at a time, changing while scrolling"; the code matches the answer, plan-01 truth 2 does not. Needs the same reconciliation.
3. **Gap 3 — plan-01 truth 3 and key link L4 reference a retired mechanism.** `steppedIndexRef`/`scheduleRef` are gone (absence deliberately test-pinned); stepping now runs the unified scroll-target path. Outcome delivered, declaration stale.
4. **H1 — the touch-drag behaviour is unverified on hardware** (RM ON on the test device). Either re-test with RM off, or record the waiver explicitly at ship time.
5. **AP-1 — the REV-23 acceptance check is now vacuous.** It must be re-anchored to a behavioural assertion, or the milestone audit will keep passing a requirement that no longer describes the product.

Nothing here requires a code rewrite: the only code-shaped risk (AP-1's vacuous test, H1's unobserved drag) is small and cheap. The bulk of the phase — the one-contract swipe stack, the avatar removal, the viewport retirement, the dvh/lock reconciliation, the platform pack with safe areas, and the real-hardware acceptance surface — is verified green at source, at build, at export, and by the user.

**Status: `gaps_found`** · Score **41/48** · `behavior_unverified: 2` · `overrides_applied: 0`.

---

*Phase: 13-mobile-parity-revision · verification run 2026-10-05T10:45:22Z at HEAD 9c3956f (clean tree) · verifier: fresh-context subagent · not committed (orchestrator bundles)*
