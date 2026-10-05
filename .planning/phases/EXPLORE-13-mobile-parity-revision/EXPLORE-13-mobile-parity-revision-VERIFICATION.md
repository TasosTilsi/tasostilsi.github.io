---
phase: 13-mobile-parity-revision
verified: 2026-10-05T10:49:07Z
status: human_needed
score: 46/48 must-haves verified
behavior_unverified: 2
overrides_applied: 0
re_verification: "true — a prior EXPLORE-13-...-VERIFICATION.md (2026-10-05T10:45:22Z) returned status `gaps_found`, score 41/48, at HEAD 9c3956f. This run re-derives the 4 failed truths (RT-1, P01-1, P01-2, P01-3) and the 1 NOT_WIRED key link (L4) after the reconciliation commit a220f87, and runs a regression gate over the previously-passed 18 truths / 12 artifacts / 11 links."
verification_tree: "HEAD b21866a on branch phase-13; `git status --porcelain` shows only `.planning/STATE.md` (an orchestrator write, not this verifier's). `git diff --name-only 9c3956f..HEAD -- src tests` → EMPTY: no source or test file changed since the previous verification, so every code fact below was re-read first-hand on the identical tree. The gate was re-run fresh over that tree: typecheck exit 0 · `npm test` 314/314 (14 files) · `next build` exit 0 (4 static routes) · `node --test tests/explore-sweep.test.mjs` 22/22, with the `out/` and emitted-CSS falsifiers re-grepped against the fresh build. No SUMMARY.md claim was inherited."
residual_artefact_divergence: "Three planning documents still describe the SUPERSEDED <md contract (see AP-6/AP-7): ROADMAP.md:19 ('the arc and the full swipe stack render on phones'), the UI-SPEC body (§2.1 row 61, §3.1, §5 checklist line 346/357, E1 at 357, and §10 item 4's 'semicircle renders above the content'), and the PLAN-01 body (§§a-g, E-rows). The AUTHORITATIVE requirement text (REQUIREMENTS.md:37 REV-23), CONTEXT D-01, and all PLAN-01 frontmatter truths now describe the delivered rail contract, so these are documentation-lag warnings with one-line fixes — not re-opened failed truths."
human_verification:
  - test: "On a real phone with Reduce Motion OFF, drag the foreground Projects card horizontally (the drag path: `drag={isFront && !reducedMotion ? 'x' : false}`, projects-stack-stage.tsx:607)."
    expected: "The card follows the finger and loops to the back; the cards behind stay visible in the depth band; the stack stays centred; a vertical swipe over the same card still scrolls the page."
    why_human: "No browser/DOM/device instrumentation exists in this repo (no jsdom, no Playwright, no testing-library) — every responsive/touch claim is provable only by source greps, pure-function rows, built-export assertions, or the user's phone. The drag path is structurally wired and CSS-pinned but has NEVER executed: the only tested device has Reduce Motion ON, which disables `drag` by design under the verified phase-10 REV-20 contract. Checklist item 6 was recorded `PASS — read with item 0 (RM ON)`, which is a verdict on the stack's composition, not on an observed drag."
human_verification_status: "The real-hardware checklist (EXPLORE-13-MOBILE-CHECKLIST.md, 167 lines: items 1-11 quoted verbatim from UI-SPEC §10 + item 0 (the Reduce-Motion precondition) + 1 supplementary item) exists and carries the user's itemized verdict with `status_human: approved`. Reduce Motion is recorded ON and option (a) — no code change — was chosen. Items 2, 3, 6, 8, 10 carry explicit PASS words from the user ('overflow/scrollbar fixes resolved', 'swipe stack great', 'starting guide great', 'credentials ok') plus 'the experience rail (perfect)' for item 4/5; items 1, 7, 9, 11 and the supplementary tap-highlight item are recorded COVERED by the standing 'perfect' verdict rather than individually observed."
---

# Phase 13: mobile-parity-revision Verification Report

**Run type:** gap re-verification (the prior report's status was `gaps_found`; no `--gaps` re-plan was run — the gap closure took the form of reconciliation commit `a220f87` + quick-task record `b21866a`).

**What changed since the prior verification:** `.planning/REQUIREMENTS.md` (REV-23 rewritten to the delivered rail contract), `.planning/phases/…-CONTEXT.md` (D-01 gains a `SUPERSEDED in execution` line), `…-01-PLAN.md` (truths 1-3 annotated `[SUPERSEDED …]`, key link L4 annotated `[RETIRED …]`), `…-04-SUMMARY.md` (reconciliation section), plus the prior VERIFICATION.md and the quick-task TASK.md. **Zero source, test, config or data files changed** — `git diff --name-only 9c3956f..HEAD -- src tests` is empty.

---

## Re-Verification of the Previously-Failed Items

| Prior gap | Prior verdict | What the reconciliation did | Current verdict (this run) |
|---|---|---|---|
| **Gap 1 — RT-1 / P01-1:** the arc's `<md` clause was false as written; the arc is `hidden md:block` and a rail renders below md | ✗ FAILED | `REQUIREMENTS.md:37` REV-23 rewritten verbatim to the delivered contract ("the Experience panel on PHONES presents a vertical year rail with one entry at a time … the desktop keeps the semicircular arc"), marked as user-superseded (43432f5 / approved 9fd3a87); CONTEXT D-01 gained the same `SUPERSEDED in execution` line; PLAN-01 truth 1 annotated in place with `[SUPERSEDED by user directive 43432f5 …]` | ✓ **CLOSED** — the declared truth and the authoritative requirement now describe what the code does. Code re-read: arc SVG `hidden … md:block` (`experience-section.tsx:237`), dots `:266`, labels `:281`; rail `data-timeline-rail="true" … md:hidden` (`:192`); zone `relative h-[200px] md:h-auto md:flex-1` (`:180`). |
| **Gap 2 — P01-2:** the all-five-readable `<md` contract was retired (four layers `opacity-0 invisible`) | ✗ FAILED | PLAN-01 truth 2 annotated `[SUPERSEDED …]`; the user's RESOLVED-D1 answer ("one at a time, changing while scrolling") is recorded in the checklist item 5 row and in quick-task TASK.md | ✓ **CLOSED (as superseded)** — code re-read: inactive layers are `opacity-0 invisible` (`experience-section.tsx:368`) riding `activeIndex`, which is now written at EVERY width (`use-timeline-progress.ts:302-305`) and driven by the base `h-[400vh]` scroll range (`explore-panels.tsx`). |
| **Gap 3 — P01-3 / key link L4:** `steppedIndexRef`/`scheduleRef` retired; stepping runs the unified scroll path instead | ✗ FAILED (truth) / ✗ NOT_WIRED (L4) | PLAN-01 truth 3 annotated `[SUPERSEDED …]`; L4 annotated `[RETIRED — the replacement link (stepRole → goToRole → scrollTargetForRole → main.scrollTo → derive) is wired and verified; the declared ref retires deliberately, pinned absent by tests/explore-visuals.test.mjs:1107-1111]` | ✓ **CLOSED** — the replacement path re-derived first-hand: `goToRole` → `scrollTargetForRole` → `main.scrollTo({top, behavior})` (`use-timeline-progress.ts:379-401`), `stepRole`/`handleKeyDown` (`:403-411`, returned at `:410-420`), one target formula at every width; retirement pinned by the gone-check row `REV-23c one derivation: the carousel index is UN-branched, the stepped-index ref is retired` (`tests/explore-visuals.test.mjs:1104-1111`, green in this run). |
| **AP-1 — the REV-23 acceptance check was vacuous** (`no hidden md:flex` passed while the Target was unmet) | ⚠️ WARNING | Not addressed as a code change, but the phase's sweep was renewed: the `<md` presentation is now POSITIVELY pinned — `sweep rows EXPLORE@375 (P): the rail column + the base scroll range` (`tests/explore-sweep.test.mjs:129-160`) asserts the rail, the 56px rail column, the base `h-[200px]`, both controls and the `h-[400vh]` range; the export row `sweep E-10 (E, phase 13)` asserts 5 rail markers in the built HTML | ✓ **MITIGATED** — the falsifier is no longer the only witness; the delivered `<md` contract has its own named rows (both green in this run). One stale test MESSAGE survives: `tests/explore-visuals.test.mjs:254` still says "the arc and its markers render at every width (REV-23)" — see AP-7. |
| **H1 — touch drag never observed on hardware** | ⚠️ outstanding human item | Not addressed; checklist item 6 records `PASS — read with item 0 (RM ON)` | ⚠️ **STILL OUTSTANDING** — no instrument in this repo can execute the drag; the only tested device has Reduce Motion ON, where `drag` is `false` by the verified REV-20 contract. Carried as the single human item. |
| **AP-4 — plan-01/plan-03 declared exports that do not exist** | ℹ️ INFO | Recorded in `…-04-SUMMARY.md`'s reconciliation section | ℹ️ **RE-RECORDED** — unchanged: `TimelineStage` is module-private in `experience-section.tsx` (the exported surface is `ExperienceSection`, `:136`); `documentScrollLock` is a module-private `const` in `src/app/(home)/layout.tsx`. Capability wired; frontmatter export lists inaccurate. |

**Three of the four failed truths and the one NOT_WIRED link are closed by the reconciliation; the closure is documentation, exactly as the prior report demanded (the code was never the divergence).**

---

## Goal Achievement → Observable Truths

### Roadmap truths (ROADMAP.md phase-13 goal + REV-23…REV-25, as revised by the user's approved directive)

| # | Truth | Status | Evidence |
|---|---|---|---|
| RT-1 | **REV-23 (as revised, `REQUIREMENTS.md:37`):** full mobile parity — the Projects swipe stack carries the full gesture contract at every width; the Experience panel on phones presents a vertical year rail with one-at-a-time scroll-driven entries (desktop keeps the arc); every panel behaves per its desktop-equivalent contract; tested on real hardware | ✓ **VERIFIED** (as revised; reconciled) | Swipe stack: ONE unconditional render (`projects-section.tsx:38`), no mode prop, no mobile wrapper, base/md height pairs `h-[520px] md:h-[560px]` / `h-[760px] md:h-[800px]` (`projects-stack-stage.tsx:149,156`), band `5×44+20 = 240` (`:139-140`, `projects-card-state.ts:117`). Rail: `md:hidden` at `experience-section.tsx:192`, accented active marker + one visible layer, driven at every width by the base `h-[400vh]` range; 5 rail markers in the fresh export. Every other panel: About/Skills/Projects/Credentials unchanged by this phase except the About avatar removal. Real hardware: the user's itemized verdict (`status_human: approved`, "perfect") is on file. The roadmap goal CELL at `ROADMAP.md:19` still carries the pre-directive arc clause — see AP-6. |
| RT-2 | **REV-23b:** on touch the full stack works — drag swipes the foreground card away, the card behind peeks, the stack is centred, depth/bloom shadows render | ⚠️ **PRESENT_BEHAVIOR_UNVERIFIED** | Structure fully verified this run: one contract, no `mode`/`compact`/`max-w-[320px]` residue, one class string per constant with exactly one unprefixed + one `md:` tier (`tests/projects-stack.test.mjs:652-665, 700`), the drag card's inline `touch-action:pan-y` present in `out/index.html`, the structural `.explore-shell [data-projects-swipe-stage]{touch-action:pan-y}` rule emitted, peeks/centring/shadows pinned by the 35 projects-stack rows. The **drag gesture itself has never executed** — no browser instrument, and Reduce Motion ON on the only tested device disables it by the verified REV-20 contract. |
| RT-3 | **REV-24:** the avatar is removed entirely from the About panel — no image, no initials | ✓ **VERIFIED** | `grep -cE "<img"` on `about-section.tsx` → **0**; the only `profileImageUrl` mention is a prose comment (`:27`). Fresh export `out/index.html`: `<img` → **0**, `Portrait of` → **0** (the 6 `tinyurl.com/5cfm72u7` hits are the og:image/JSON-LD head metadata declared in scope; the About panel consumes none). Data preserved: `git diff 4902fcf..HEAD -- src/data/` → empty. |
| RT-4 | **REV-25:** the mobile-native platform pack — proper viewport meta (`viewport-fit=cover`), dvh/svh reconciliation, `overscroll-behavior: none`, tap-highlight off, `touch-action: manipulation`, safe-area padding — killing the gap-after-footer and the extra scrollbars | ✓ **VERIFIED** | Fresh export: **exactly one** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>`; `shrink-to-fit`/`maximum-scale`/`user-scalable` → 0. Fresh emitted CSS (`b6ffad8fda5ba753.css`): single `@media (prefers-reduced-motion` at byte 42092; `overscroll-behavior:none` @42509, `-webkit-tap-highlight-color:transparent` @42419, `touch-action:manipulation` @42602, `touch-action:pan-y` @42671, `safe-area-inset-top` @42728/42774, `safe-area-inset-bottom` @42842/42894/42994 — **every rule after the guard**; the only `touch-action:none` in the bundle is Tailwind's unrelated `.touch-none` utility. Lock: `height: 100%` then `height: 100dvh` then `overflow: hidden` (`src/app/(home)/layout.tsx:67-68`) emitted into the landing only — `out/cli.html` and `out/resume.html` carry 0 occurrences. User PASS on record for the gap and single-scrollbar items. |

### Plan 01 truths (arc parity / rail parity) — 5/5

| # | Truth | Status | Evidence |
|---|---|---|---|
| P01-1 | A 375px viewport renders the semicircular arc … no `hidden` gate hides any of it `[SUPERSEDED — delivered contract is the year-rail/one-at-a-time <md presentation]` | ✓ **VERIFIED** (as superseded) | Supersession annotated in the plan frontmatter and reconciled into REV-23/D-01. Delivered `<md` presentation re-verified: rail `md:hidden` (`:192`), 5 rail markers in the export, base zone `h-[200px]` (`:180`), arc `md:block` (`:237/:266/:281`). Named rows green: `sweep rows EXPLORE@375 (P): the rail column + the base scroll range`, `sweep E-10 (E, phase 13)`. |
| P01-2 | All five timeline entries stay readable on a phone … `[SUPERSEDED]` | ✓ **VERIFIED** (as superseded) | The delivered contract is one-at-a-time: inactive layers `opacity-0 invisible` (`:368`), single-cell overlay grid; `activeIndex` written at every width (`use-timeline-progress.ts:302-305`); 400vh base range makes the swap scroll-driven. Recorded in checklist item 5 as the user's RESOLVED-D1 answer. |
| P01-3 | Prev/Next step at `<md` through the stepped-index input … `[SUPERSEDED]` | ✓ **VERIFIED** (as superseded, replacement wired) | `stepRole` → `goToRole` → `scrollTargetForRole` → `main.scrollTo` (`:379-411`), one formula at every width, keyboard wired to the `role="group"` root; end-clamping via `Math.min/max`. The retired ref is gone and its absence deliberately pinned (`tests/explore-visuals.test.mjs:1104-1111`). |
| P01-4 | No arc label paints outside the arc zone at any width | ✓ **VERIFIED** | The predicate consumes the measured anchor budget, not the zone width: `dateLineFits(active.entry.duration, anchorBudget ?? 250)` (`experience-section.tsx:170`), `setAnchorBudget(labelAnchorBudget(geometry))` (`use-timeline-progress.ts:207`), pure `labelAnchorBudget` (`timeline-geometry.ts:348`), returned at `:418`. Named row green: `REV-23 anchor budget: labelAnchorBudget is the px budget the date-line predicate consumes — 375 suppressed, 1440 shown, boundary-sensitive` (run first-hand this session). |
| P01-5 | Only one value in the arc path is width-specific — the zone box height | ✓ **VERIFIED** | Zone `relative h-[200px] md:h-auto md:flex-1` (`:180`); geometry derives from the measured rect (`viewBoxToPx`); the path is the fixed viewBox `M 100 0 A 100 100 0 0 0 100 200` (1 occurrence in the export). |

### Plan 02 truths (one swipe-stack contract) — 4/5

| # | Truth | Status | Evidence |
|---|---|---|---|
| P02-1 | A phone renders the SAME stack as desktop: touch drag, behind-cards peek, centred, shadows | ⚠️ **PRESENT_BEHAVIOR_UNVERIFIED** | Same clause as RT-2. Composition/centring/depth ladder verified; drag unobserved on hardware. |
| P02-2 | No simplified mobile stack exists anywhere in the tree | ✓ **VERIFIED** | `projects-mobile-stack.tsx` absent from `src/components/explore/sections/`; no `ProjectsMobileStack` import or render (`projects-section.tsx:20,38`); gone-checks live in `tests/explore-visuals.test.mjs` and `tests/explore-visuals-server.test.mjs:163` (green). |
| P02-3 | The base/unprefixed heights ARE the phone heights; the fixed limited-peek box is retired and the full peek band shows at `<md` | ✓ **VERIFIED** | `CARD_HEIGHT_CLASS = 'h-[520px] md:h-[560px]'` (`:149`), `STAGE_HEIGHT_CLASS = 'h-[760px] md:h-[800px]'` (`:156`), band 240. No `mode`/`compact`/width-cap residue. |
| P02-4 | Only one width-specific value pair, and both tiers satisfy the stage arithmetic so peeks/fly-off cannot extend the layout | ✓ **VERIFIED** (substance; the frontmatter's literal numbers are stale — see AP-7) | Both tiers satisfy `stage = card + PEEK_BAND_PX`: 520+240=760, 560+240=800, with `PEEK_BAND_PX = DEPTH_LEVELS·44 + 20` derived in `tests/projects-stack.test.mjs:635-691` from the constants rather than restated. The truth text still cites the pre-directive 420/690, 560/830, 250+20 pair (amended by the user's band-tighten directive 47ea74a) — the relationship it asserts holds; the literals do not. |
| P02-5 | The stage carries the `data-projects-swipe-stage` hook its `touch-action: pan-y` rule targets | ✓ **VERIFIED** | Attribute `projects-stack-stage.tsx:733`; rule `globals.css:742`; both present in the fresh export + emitted CSS. |

### Plan 03 truths (viewport / platform pack / avatar) — 6/6

| # | Truth | Status | Evidence |
|---|---|---|---|
| P03-1 | Exactly ONE viewport meta, `width=device-width, initial-scale=1, viewport-fit=cover`, no `shrink-to-fit`/`maximum-scale`/`user-scalable` | ✓ **VERIFIED** | Fresh export: 1 tag, exactly that content; 0/0/0 for the banned directives. Row green: `REV-25a (E): the built landing declares exactly ONE viewport meta`. |
| P03-2 | The strip below the footer is gone — document/body height and the shell's `h-dvh` are the same dynamic number, overscroll suppressed | ✓ **VERIFIED** | `src/app/(home)/layout.tsx:67-68` emitted into the landing; shell is `h-dvh`; `overscroll-behavior:none` on `html`/`body` in the emitted CSS. User checklist item 2 → PASS. |
| P03-3 | Header/footer paint their safe-area insets without compressing their content bands | ✓ **VERIFIED** (structural) | `globals.css:757-772`: `padding-top: env(safe-area-inset-top,0px)` + `height: calc(52px + env(safe-area-inset-top,0px))`, and the `1.75rem`/`2rem` footer pair with the `@media (min-width:640px)` override; the literals are derived from the two bar components by `tests/route-swap.test.mjs` (green). Hardware look recorded COVERED. |
| P03-4 | Tap highlight gone, double-tap delay gone, stage keeps horizontal drag while vertical scroll survives | ✓ **VERIFIED** | All three rules emitted after the RM guard; `touch-action: pan-y` on `[data-projects-swipe-stage]`; no `touch-action: none` in the shell. |
| P03-5 | The About panel renders no avatar | ✓ **VERIFIED** | See RT-3. |
| P03-6 | Nothing is deleted from the data: `meta.viewport` and `about.profileImageUrl` stay byte-identical, unconsumed by the landing UI | ✓ **VERIFIED** | `git diff 4902fcf..HEAD -- src/data/` empty; no code consumer of `portfolioData.meta.viewport` remains (the layout's viewport is the typed export). |

### Plan 04 truths (acceptance surface) — 4/4

| # | Truth | Status | Evidence |
|---|---|---|---|
| P04-1 | The stale `<md` sweep rows are renewed and the new export rows pass on a freshly built `out/` | ✓ **VERIFIED** | Rebuilt this session (exit 0, 4 static routes). `node --test tests/explore-sweep.test.mjs` → **22/22**, incl. `sweep rows EXPLORE@375 (P): the rail column + the base scroll range`, `sweep E-10 (E, phase 13)`, `REV-25a (E)`, `REV-25b`. |
| P04-2 | Every VISUAL/TOUCH claim is carried by a written, user-owned checklist item | ✓ **VERIFIED** | `EXPLORE-13-MOBILE-CHECKLIST.md` (167 lines) quotes §10 items 1-11 verbatim + item 0 + one supplementary item, with per-item verdicts and a `status_human: approved` block. |
| P04-3 | The Reduce-Motion precondition is put to the user and recorded | ✓ **VERIFIED** | Recorded **ON**, option (a) — no code change; stated in the premise block, item 0, the itemized results and the user-verdict block. |
| P04-4 | The full gate is the LAST chronological action and is re-run over the final workspace state | ✓ **VERIFIED** | Re-run independently this session at HEAD `b21866a`: typecheck 0 · 314/314 · build 0 · sweep 22/22. Every commit after the execute wave is `.planning`-only except the two user-directed source amendments (`47ea74a`, `43432f5`), and the verdict commit `9fd3a87` postdates both. |

---

## Score

**46 / 48 must-haves verified** — 22 of 24 truths (4 roadmap + 20 plan), 12/12 artifacts, 12/12 key links. `behavior_unverified: 2` (the same drag clause, stated once in RT-2 and once in P02-1). `overrides_applied: 0` — nothing was reclassified to reach green.

Change vs the prior run (41/48): **+4 truths** (RT-1, P01-1, P01-2, P01-3 closed by the reconciliation) and **+1 key link** (L4 now a deliberate, gone-check-pinned retirement with a verified replacement, rather than a dangling NOT_WIRED declaration). The 2 remaining unverified must-haves are the same unexercised touch-drag behaviour — no new gap.

---

## Deferred Items

Phase 13 is the final phase of the v1.0 milestone (the ROADMAP Progress table ends at 12 and 13's row is added at ship), so there is no later phase to absorb these — they carry to the milestone audit as outstanding UAT items:

| Item | Source | Status |
|---|---|---|
| Touch drag observed on hardware with Reduce Motion OFF (or an explicit user waiver of the clause) | prior report H1 / AP-3 | **Open** — the only human item; carried into `human_verification` above. |
| Landscape-specific tweaks (test once on the phone; adapt only if broken) | CONTEXT deferred | Not tested — the checklist records portrait only. Carries to the milestone audit. |
| Sticky-hover tint gating (`@media (hover: hover) and (pointer: fine)`) | RESEARCH OQ-6 | Deliberately deferred; promote only if the phone shows a lingering tint (RESEARCH R6/§8). |
| `/cli` + `/resume` content under the notch (`viewport-fit: cover` is root-level) | RESEARCH OQ-9 | Accepted side effect, out of scope; checklist item 9 recorded COVERED. |
| A user-supplied profile image | CONTEXT deferred | Closed by REV-24 ("no image, no initials") — do not revisit unless the user asks. |
| PWA/manifest additions | CONTEXT deferred | Future milestone candidate. |
| Residual documentation lag: `ROADMAP.md:19`, the UI-SPEC body, the PLAN-01 body, and PLAN-02 truth 4's numeric literals | this run, AP-6/AP-7 | One-line wording fixes; no code impact. Fix before the milestone audit so it does not read the superseded `<md` arc as delivered. |

---

## Required Artifacts

| Path | Declared | Actual | Substantive | Wired |
|---|---|---|---|---|
| `src/components/explore/sections/experience-section.tsx` | ≥300 lines, exports `TimelineStage` | **420** lines; exports `ExperienceSection` (`:136`); `TimelineStage` is module-private | ✓ | ✓ rendered by `explore-panels.tsx` — ⚠️ export-list deviation (INFO, AP-4) |
| `src/components/explore/use-timeline-progress.ts` | ≥340, exports `useTimelineProgress`, `TimelineProgress` | **421** lines; both present (`:149`, `:142` in the return type) | ✓ | ✓ consumed by the stage |
| `src/components/explore/timeline-geometry.ts` | ≥300, exports `labelAnchorBudget`, `dateLineFits`, `viewBoxToPx` | **349** lines; all three present (`labelAnchorBudget` at `:348`) | ✓ | ✓ measurement site + call site |
| `src/components/explore/sections/projects-stack-stage.tsx` | ≥690, exports `ProjectsStackStage`, `ProjectsSwipeStack` | **779** lines; both present (`:626`, `:777`) | ✓ | ✓ one unconditional render (`projects-section.tsx:38`) |
| `src/components/explore/sections/projects-section.tsx` | ≥40, exports `ProjectsSection` | **42** lines; export present (`:22`) | ✓ | ✓ rendered by `explore-panels.tsx` |
| `src/components/explore/sections/projects-mobile-stack.tsx` | must NOT exist (gone-check) | **absent** | ✓ (retirement) | ✓ gone-checks in two suites, green |
| `src/app/layout.tsx` | ≥120, exports `viewport`, `metadata`, `RootLayout` | **147** lines; all three present (`:69`, `:29`, `:80`) | ✓ | ✓ the single emitted viewport tag |
| `src/app/(home)/layout.tsx` | ≥80, exports `documentScrollLock` | **124** lines; `documentScrollLock` is a module-private `const` | ✓ | ✓ injected into the landing `<head>` — ⚠️ export-list deviation (INFO, AP-4) |
| `src/app/globals.css` | ≥720 | **773** lines | ✓ | ✓ pack emitted after the single RM guard |
| `src/components/explore/sections/about-section.tsx` | ≥190, exports `AboutSection` | **225** lines; export present (`:98`); 0 `<img>` | ✓ | ✓ rendered by `explore-panels.tsx` |
| `tests/explore-sweep.test.mjs` | ≥460 | **615** lines | ✓ | ✓ 22/22 against the fresh build |
| `…/EXPLORE-13-MOBILE-CHECKLIST.md` | ≥40 | **167** lines | ✓ | ✓ quotes UI-SPEC §10 + the recorded user verdict |

No artifact is missing, empty, or a stub.

---

## Key Link Verification

| ID | From → To | Declared pattern | Verdict | Evidence |
|---|---|---|---|---|
| L1 | `use-timeline-progress.ts` → `experience-section.tsx` | `anchorBudget` | **WIRED** | Derived at the measurement site (`:207`), declared in the return type (`:142`), returned (`:418`), consumed by the predicate (`experience-section.tsx:170`). |
| L2 | `timeline-geometry.ts` → `use-timeline-progress.ts` | `labelAnchorBudget` | **WIRED** | Pure function (`timeline-geometry.ts:348`) called with the measured `ArcGeometry`. |
| L3 | `use-timeline-progress.ts` → `experience-section.tsx` | `stepRole\|handleKeyDown` | **WIRED** | Implemented (`:403-411`), returned (`:410-420`), wired to the controls and the `role="group"` root. |
| L4 | `experience-section.tsx` → `use-timeline-progress.ts` | `steppedIndexRef` | **WIRED (retired by design)** | The declared ref is absent — a deliberate retirement now annotated in the plan and pinned by a gone-check (`tests/explore-visuals.test.mjs:1104-1111`, green). Replacement verified end-to-end: button → `stepRole` → `goToRole` → `scrollTargetForRole` → `main.scrollTo` → scroll event → `derive()` → `setActiveIndex`. |
| L5 | `projects-section.tsx` → `projects-stack-stage.tsx` | one unconditional `<ProjectsStackStage projects={cards} />` | **WIRED** | `:38`, single occurrence, no mode argument, no viewport wrapper. |
| L6 | `projects-stack-stage.tsx` → `globals.css` | `data-projects-swipe-stage` | **WIRED** | Attribute `:733`; rule `globals.css:742`; both in the fresh export + emitted CSS. |
| L7 | `tests/projects-stack.test.mjs` → `projects-stack-stage.tsx` | `PEEK_BAND_PX` | **WIRED** | The suite derives the constants and both tiers from the source (`:616-691`). |
| L8 | `src/app/layout.tsx` → `out/index.html` | `viewport-fit=cover` | **WIRED** | Typed export → exactly one emitted tag carrying `viewport-fit=cover`; the data-file meta line has no consumer. |
| L9 | `globals.css` → `explore-shell.tsx` | `explore-shell > (header\|footer)` | **WIRED** | Selectors `globals.css:757,762,771`; both bars are direct children of the shell root; `tests/route-swap.test.mjs` derives the band literals from the components. |
| L10 | `globals.css` → `projects-stack-stage.tsx` | `data-projects-swipe-stage` | **WIRED** | Same pair as L6, verified in the emitted CSS. |
| L11 | `tests/explore-sweep.test.mjs` → `out/index.html` | `viewport-fit=cover` | **WIRED** | `sweep E-10 (E, phase 13)` reads the freshly built export — 22/22 after a build in this session. |
| L12 | `EXPLORE-13-MOBILE-CHECKLIST.md` → `UI-SPEC.md` | `§10` | **WIRED** | The checklist quotes §10 verbatim, item-for-item, and annotates the rail verdict. |

**12/12 wired** (L4 by deliberate retirement + verified replacement, as annotated).

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
              └─ md+ ONLY    : imperative marker/layer writes (the surviving md gate, :252)

projects ──▶ slice(0,6) ──▶ ProjectsStackStage ──▶ cardState(index, frontIndex, count, reducedMotion)
                                   └─ levelsFor(cardHeight): translateY = −(l·44 + H·(1−scale_l))
                                        └─ stage = card + PEEK_BAND_PX (240) — 760 base / 800 md
```

The path is intact and single-sourced: no hardcoded portfolio content was added, `EXPLORE-07` survives, and the only width branch in the flow is the presentation branch (arc vs rail), never a data branch.

---

## Behavioral Spot-Checks

Run first-hand this session at HEAD `b21866a` (named rows only; the full suite only as the phase's own gate):

| Check | Command | Result |
|---|---|---|
| Typecheck over the final tree | `npm run typecheck` | **exit 0**, no diagnostics |
| Full suite (the repo's real CI suite) | `npm test` | **314/314 pass, 0 fail** (14 files) |
| Static export build | `npm run build` | **exit 0**, 4 static routes (`/`, `/_not-found`, `/cli`, `/resume`) |
| Sweep, incl. the phase-13 export rows | `node --test tests/explore-sweep.test.mjs` | **22/22** — `sweep rows EXPLORE@375 (P)`, `sweep E-10 (E, phase 13)`, `REV-25a (E)`, `REV-25b` green |
| Named rows re-run in isolation | `node --test --test-name-pattern="rail column\|anchor budget\|REV-25a\|REV-25b\|one stack\|viewport"` | **4/4 matched rows pass** incl. `the rail column + the base scroll range` and `REV-23 anchor budget …` |
| Export falsifier (first-hand) | greps on the fresh `out/index.html` | 1 viewport tag w/ `viewport-fit=cover`; 0 `shrink-to-fit`/`maximum-scale`/`user-scalable`; 0 `<img>`; 0 `Portrait of`; 5 rail markers; 1 arc path; 5 dots; 5 labels; 1 swipe-stage attribute; `100dvh` present; 0 lock occurrences on `/cli` + `/resume` |
| Emitted-CSS falsifier (first-hand) | greps + byte offsets on `out/_next/static/css/b6ffad8fda5ba753.css` | all four pack rules + both safe-area blocks at 42419-42994, **after** the single RM guard at 42092; the only `touch-action:none` is Tailwind's `.touch-none` |

**Not run, deliberately:** no browser/DOM/device instrumentation exists in this repo (no jsdom, no Playwright, no testing-library), so every responsive/touch claim is provable only by source greps, pure-function rows, built-export assertions, or the user's phone. The phone was tested by the user; the itemized verdict is on file.

---

## Requirements Coverage

| REQ-ID | Requirement (abridged) | Status | Evidence |
|---|---|---|---|
| **REV-23** (as revised in `REQUIREMENTS.md:37`) | Swipe stack with the full gesture contract at every width; the phone Experience panel = a vertical year rail, one entry at a time, scroll-driven (desktop keeps the arc); every panel per its desktop-equivalent contract; real-hardware tested | ✓ **DELIVERED** (one clause human-pending) | Stack: one contract, base/md pairs, band arithmetic, touch-action rules — verified. Rail: `md:hidden` composition, 5 SSR markers, `h-[400vh]` range, un-branched index — verified. Panels: unchanged except the avatar removal. Hardware: user verdict approved. The **touch-drag** clause remains unexercised (RM ON on the tested device) → the single human item. |
| **REV-24** | The avatar is removed entirely (no image, no initials) | ✓ **DELIVERED** | 0 `<img>`/avatar markup in source and export; data preserved; panel reflowed. |
| **REV-25** | The mobile-native platform pack: proper viewport meta (`viewportFit=cover`), dvh/svh, `overscroll-behavior: none`, tap-highlight off, `touch-action: manipulation`, safe-area padding — eliminating the gap-after-footer and the extra scrollbars | ✓ **DELIVERED** | One viewport tag with cover; `100dvh` lock reconciliation; the pack emitted after the RM guard; user PASS on the gap and scrollbar items. Its "wizard/tour/stack/drag machinery untouched" clause is qualified: the wizard, tour, drawer, Credentials, header and status bar are byte-identical, while the stack geometry was amended twice by the user's own directives (`47ea74a`, `43432f5`) inside this phase. |

CONTEXT decision coverage: **D-02, D-03, D-04, D-05, D-06, D-07 delivered (6/7)**; **D-01 superseded in execution** by the user's approved directive (43432f5 / 9fd3a87) and now carries the reconciliation line — the delivered contract is the rail. D-03 verified by absence of any diff in `explore-tour.tsx`, `explore-drawer.tsx`, `credentials-section.tsx`, `explore-header.tsx`, `explore-status-bar.tsx`, `src/app/cli/`, `src/app/resume/`.

---

## Anti-Patterns Found

No `TBD`/`FIXME`/`XXX`/`HACK` markers in any touched source (`grep -rniE` over `src/components/explore/`, both layouts, `globals.css` → none). No unreferenced debt marker. **No blocker anti-pattern.**

| ID | Finding | Severity | Note |
|---|---|---|---|
| AP-1 | The REV-23 SPEC-era falsifier (`no hidden md:flex`) was vacuous while the target was unmet. | ~~WARNING~~ → **MITIGATED** | The phase's own sweep now POSITIVELY pins the delivered `<md` contract (rail column, base `h-[200px]`, both controls, the `h-[400vh]` range, 5 SSR rail markers). The vacuous row survives only as a no-regression guard, with an accurate message at `tests/explore-sweep.test.mjs:132-133`. |
| AP-2 | Stale locked artefacts. | **RESOLVED** | `REQUIREMENTS.md:37`, CONTEXT D-01 and PLAN-01 truths 1-3 are reconciled. |
| AP-3 | Unverified headline behaviour (touch drag). | **WARNING** | Recorded as the single human item; needs an RM-OFF hardware run or an explicit waiver at ship. |
| AP-4 | Declared exports that do not exist (`TimelineStage`, `documentScrollLock`). | **INFO** | Capability wired through the real exported surfaces; only the frontmatter export lists are inaccurate. Re-recorded in `…-04-SUMMARY.md`. |
| AP-5 | Checklist item 6 is recorded `PASS — read with item 0 (RM ON)` although the file's own recording rule says an unobserved item must be `NOT RUN` or `FAIL by design`. | **WARNING** | Under RM ON the drag never runs, so the PASS word describes the stack's composition, not the drag. Suggested wording: `FAIL by design (Reduce Motion ON)` + a note that the composition items (peeking, centring, shadows, controls) passed. This is the same fact AP-3/H1 record; it is a labelling issue, not a disagreement about what happened. |
| AP-6 | `ROADMAP.md:19` still states "…the arc and the full swipe stack render on phones…" — the pre-directive contract. | **WARNING** | One-line fix: replace that clause with the rail wording now in `REQUIREMENTS.md:37` (the milestone audit reads the roadmap first). No code impact. |
| AP-7 | Documentation lag: the UI-SPEC body (`:61`, `:123`, `:346`, `:357`, `:370`, `:482-487`), the PLAN-01 body (§§a-g, E1/E2/E14, the RESOLVED-D1 block), PLAN-02 truth 4's literals (`420/690`, `560/830`, `card + 250 + 20`) and `tests/explore-visuals.test.mjs:254`'s message ("the arc and its markers render at every width") still describe the superseded `<md` arc / pre-directive heights. | **WARNING** | Wording only — the assertions themselves are green and correct (the `test-name-pattern` message is cosmetic; the PLAN-02 arithmetic is verified by derivation, not by those literals). Fix the wording before the milestone audit. |

---

## Human Verification Required

One item is genuinely outstanding — everything else visual/touch is covered by the user's recorded, itemized verdict (`status_human: approved`):

| # | Test | Expected | Why human |
|---|---|---|---|
| H1 | On a real phone with **Reduce Motion OFF**, drag the foreground Projects card horizontally | The card follows the finger and loops to the back; the cards behind stay visible in the depth band; the stack stays centred; vertical swipes still scroll the page | The drag path is structurally wired, CSS-pinned and test-described, but no instrument in this repo can execute it and it has never run on hardware: the only tested device has Reduce Motion ON, which sets `drag = false` by the verified phase-10 REV-20 contract. The alternative is an explicit waiver of the clause (option (a), already recorded) relying on the Prev/Next controls, which do step at every width and are verified. |

Secondary, already covered by the standing verdict and therefore *not* raised as outstanding: the notch/home-indicator safe-area look (checklist item 1, COVERED), both-theme legibility on hardware (item 11, COVERED), the tap-highlight flash (supplementary, COVERED), `/cli` + `/resume` under the notch (item 9, COVERED accepted side effect), and landscape (never tested — carried as a Deferred item).

---

## Gaps Summary

**No code gap remains.** The re-verification closes the prior run's entire failed set:

1. **RT-1, P01-1, P01-2, P01-3 — closed.** The locked artefacts that still asserted the superseded `<md` arc were reconciled in `a220f87`: the requirement itself (`REQUIREMENTS.md:37` REV-23) now describes the delivered rail contract, CONTEXT D-01 carries the supersession line, and the plan truths/links are annotated in place. The code was never the divergence and is unchanged.
2. **Key link L4 — closed** as a deliberate retirement with a verified replacement path, pinned absent by a green gone-check row.
3. **AP-1 — mitigated**: the phase's sweep now positively pins the delivered `<md` contract, so the phase is no longer witnessed only by a falsifier that passes vacuously.
4. **Residual documentation lag (AP-6/AP-7)** — three planning documents still carry the pre-directive wording (the ROADMAP goal cell is the one a milestone audit reads first). One-line wording fixes; recorded as warnings, not re-opened truths, because the authoritative requirement and every declared must-have are now consistent with the shipped code.
5. **H1 / AP-3 / AP-5 — one genuinely unexercised behaviour**: the touch drag on hardware with Reduce Motion OFF. Structurally verified, never observed; the checklist labels it PASS under an RM-ON caveat.

Per the status decision tree: no truth FAILED, no artifact MISSING/STUB, no key link NOT_WIRED, no blocker anti-pattern — but one human-verification item (the PRESENT_BEHAVIOR_UNVERIFIED drag clause) remains. That resolves to **`human_needed`**, not `passed`: the phase must not be declared fully verified while its headline touch behaviour has never executed on any device.

**Status: `human_needed`** · Score **46/48** · `behavior_unverified: 2` · `overrides_applied: 0`.

---

*Phase: 13-mobile-parity-revision · RE-VERIFICATION run 2026-10-05T10:49:07Z at HEAD b21866a (tree unchanged in `src/`+`tests/` since 9c3956f) · verifier: fresh-context subagent · not committed (orchestrator bundles)*
