---
phase: 09-editorial-motion-revision
verified: 2026-09-29T20:29:41Z
status: human_needed
score: 58/58 must-haves verified
behavior_unverified: 0
overrides_applied: 0
human_verification:
  - test: "Load /explore at >=768px in dark AND light theme and step through the Experience arc: use the Prev/Next buttons and ArrowUp/ArrowDown."
    expected: "The arc carries 5 year markers — Chubb 2023 (focal at rest, present-first), Upstream Systems 2022, MSc 2021, Netcompany-Intrasoft 2019, BEng 2012 — with adjacent labels not colliding at 768px; the active marker is the darkest/largest role dot while the two education markers are CONSTANT hollow dots (never fill, never swap size); the counter reads 01 / 05; both buttons disable at the clamped ends; content swaps between the role template (title > company > duration · location > ≤3 bullets) and the education template (degree > institution > duration AS STORED > specialization when present, omitted for BEng)."
    why_human: "The 5-entry derivation, the type-aware template field mapping, the marker class anatomy, the counter and the clamp are unit-tested and source-pinned, and the marker angles are swept numerically (Δ=22.5° — every marker stays on θ∈[90°,270°]). Whether two adjacent mono year labels actually read comfortably at 768px, and whether the hollow/filled distinction reads as the intended visual signal, is perceptual and needs a browser."
  - test: "With the OS/browser set to prefers-reduced-motion: reduce, reload /explore and scroll the Experience range, then step entries with the buttons."
    expected: "Markers stay frozen at their own arc positions with no spatial movement; role dots keep the inactive size (the size swap is suppressed) and emphasis is opacity-only; education dots render the same constant hollow dot as in the normal path; content swaps by opacity only."
    why_human: "The RM branches are unit-tested and source-pinned (reducedMotionAngle/Emphasis, the W-7 dot-size suppression), but the rendered suppression outcome under a real OS setting is a browser behaviour."
  - test: "Open /explore at 375px and at >=768px on the About+Contact panel (both themes), and tab through it."
    expected: "The package reads top-to-bottom as: two-line positioning lead (line 2 in the accent colour) → 2x2 metric tiles (12+ engineering teams / 30+ engineers / 7+ years / 600+ npm launch week) → availability chip ('Open to selective part-time work') → rounded avatar → the full summary demoted (smaller, muted) → 9 contact rows → the resume link last; nothing overflows horizontally at 375px and every interactive row keeps a >=44px target with a visible focus ring."
    why_human: "The block order, the demoted summary classes, the 9 channels, the 44px floors and the avatar attributes are source-pinned and re-verified against the built static export (the exact order is present in out/explore.html), but hierarchy, avatar cropping, contact-row tightness and 375px readability are visual."
---

# Phase 9: editorial-motion-revision Verification Report

**Verification basis.** HEAD (`6cb9e6a`) is **two phases ahead** of this phase (10 projects-stack-revision, 11 credentials-panel-revision, plus two user-directed quick tasks), so every phase-9 truth was verified in two places — the same method the phase-8 report used:

1. **The phase-9 closing tree** — a `git archive` export of commit `138af26` (the phase's execute-artefacts commit, 2026-09-24 20:21:32 +0300) into `/tmp/p9tree`, with `node_modules` symlinked, where I independently reproduced the whole gate: `npm run typecheck` → **exit 0**; `npm run build` → **exit 0** (routes `/`, `/_not-found`, `/explore`, `/resume` all `○ (Static) prerendered as static content`); `node --test tests/*.test.mjs` → **239 tests, 239 pass, 0 fail**. At that tree `selectTimelineEntries` still sorted **year-ascending** and the Projects panel still carried the editorial scroll — the truth statements are judged as written there.
2. **HEAD** — where later phases *renewed* rather than deleted the phase-9 pins: `node --test tests/*.test.mjs` → **267 tests, 267 pass, 0 fail** across all 13 suites; `npm run typecheck` → **exit 0**. Named re-runs: `explore-timeline` 27/27, `explore-sweep` 20/20, `explore-tour` 45/45; `explore-shell`, `explore-visuals`, `explore-visuals-server`, `portfolio-data-integrity` all 0 failures.

No SUMMARY claim was accepted without a tool check; every number and every path below comes from a command run in this session. The HEAD **build** was deliberately not re-run: a live `next dev` server occupies port 3000 in this worktree (`ss -ltnp`), and a production build in the same tree would wipe that server's `.next` manifests. The existing `out/explore.html` (built 2026-09-29 23:25:21, contains `id="credentials"`, i.e. post-phase-11 and current for HEAD) was read as the HEAD export artefact; **the phase-9 tree got its own fresh build**, which is what the phase-9 SSR assertions were run against.

## Supersession map (not gaps)

Five later-phase commits legitimately changed phase-9 constructs. Each was checked at the phase-9 tree (where the construct existed and passed) before being classified as evolution rather than a miss — none of them is a delivery failure.

| Commit | Phase / REQ | What it changed on phase-9 ground | Phase-9 items affected |
|---|---|---|---|
| `7ab0dd8` | quick 2026-09-24-arc-present-first-order (**explicit user directive**: "the experience must be shown from the present to the past") | `selectTimelineEntries` comparator ascending → **descending** (nulls still last; merge/filters untouched); SSR entry 0 becomes Chubb instead of BEng. Re-gated green (239/239) in its own task record. | P1-1, P1-5 (order half) |
| `53d347a` | phase 10, **REV-18** | Deleted `src/components/explore/sections/projects-editorial-stage.tsx`, `src/components/explore/projects-row-state.ts`, `tests/projects-editorial.test.mjs`; wired `ProjectsSection` to the stacked-card stage + mobile stack. ROADMAP phase 10 states the replacement in its own goal text. | P4-1…P4-7 (all), artifacts A12–A14, key links K11–K14 |
| `b39b12c` | quick 2026-09-25-projects-swipe-loop-stack (user directive) | The Projects composition becomes a swipe-driven centered stack; the projects sticky wrapper is retired (`buildPlacement().projects = { wrapper: '', gate: false }`) so `data-editorial-wrapper` now rides only on the Experience wrapper. | P4-3, P4-7 (sticky/spans halves) |
| `08333e3` | phase 11, **REV-21** | Appended the 5th panel (Credentials) beside Projects in row 3; chips/drawer/counter grow to 5; the wizard step sequence is explicitly kept as-is. | none reverted — REV-14's reflow is preserved with the row 3 pair extended |
| `bb5f687` / `583570c` | phase 10 plans 02–03 | Retired the "editorial" wording; kept the wrapper-target assertion; renewed the phase-9 pins to the successor contract. | pin hygiene only |

**Consequence for the record:** REV-17 is materially superseded at HEAD by REV-18. The phase-9 delivery was complete and green at its own tree, so this is not recorded as a gap — but `REQUIREMENTS.md`'s `[x] REV-17` line now describes machinery that no longer exists in the tree and deserves a supersession annotation (REV-18 / phase 10) the next time the requirement ledger is touched.

## Goal Achievement → Observable Truths

| # | Truth | Status | Evidence |
|---|---|---|---|
| R1 | **Roadmap goal** — the panel order reflows so About leads (About first), Experience full-width mid-page, Projects after it | ✓ VERIFIED | `constants.ts:18-24` `EXPLORE_SECTIONS` in DOM order `[about, skills, experience, projects, credentials]`; `explore-panels.tsx:110-126` placement factory (Experience `md:col-span-2 md:h-[300vh]`; zero `md:order-first` anywhere); 2-col grid → row 1 `[About+Contact \| Skills]`, row 2 Experience, row 3 `[Projects \| Credentials]`. Named test `sweep rows EXPLORE@* (P): 3-row rebalance structure — order locked, spans whitelisted, stage pinned` green at BOTH trees; HEAD export chips render 01→About … 05→Credentials |
| R2 | **Roadmap goal** — the About presentation package (positioning lead, impact metrics, availability badge, avatar) | ✓ VERIFIED | `about-section.tsx` (229 lines) blocks at `:103-112` lead (two block spans, never joined) → `:117-130` 2×2 metric tiles → `:132-139` availability chip → `:142-150` avatar → `:154-160` demoted summary → `:180-` 9 channel rows (`CHANNELS` length 9) → resume link last. SSR order re-verified programmatically in `out/explore.html` (offsets monotonic: lead@477, tail@647, metric 12+@837, 600+@1515, availability@1833, avatar@1896, summary@3233, resume@12669) |
| R3 | **Roadmap goal** — education merged onto the semicircular arc (5 entries, type-aware) | ✓ VERIFIED | `selectTimelineEntries` (`timeline-geometry.ts:292-313`) over the real JSON yields exactly 5 typed entries (3 `isTechRelated` roles ∪ 2 `featured` degrees); type-aware templates in `experience-section.tsx` (`:158-161` dot anatomy, `:174-177` education label = year only, `:268-283` education template, `:295-` role bullets). Named test `selection contracts consumed unchanged: isTechRelated roles (3) ∪ featured education (2)` green at both trees |
| R4 | **Roadmap goal** — the Projects panel converted to a framer-motion-driven editorial scroll composition (top-6 rows entering from below) | ✓ VERIFIED (as-of-close) — **superseded at HEAD** | At `138af26`: `projects-editorial-stage.tsx` (326 lines) + `projects-row-state.ts` (125 lines) + `tests/projects-editorial.test.mjs` (264 lines) present, both sticky placements in `explore-panels.tsx:122-129`, all 6 top-6 first-sentence strings present in the freshly built `out/explore.html`. Deleted by `53d347a` under REV-18 (see supersession map) |
| R5 | **Roadmap goal** — the Experience stage stays hand-rolled (zero framer-motion in the stage) | ✓ VERIFIED | `grep -rn framer-motion` over `experience-section.tsx`, `use-timeline-progress.ts`, `timeline-geometry.ts` → **0 matches** at both trees; `git log -- src/components/explore/use-timeline-progress.ts` shows the last commit is `175dcab` (phase 8) — byte-untouched through phase 9 and still untouched at HEAD |
| P1-1 | 5 chronological entries (BEng 2012 · Netcompany 2019 · MSc 2021 · Upstream 2022 · Chubb 2023), merged, sorted year-**ascending** (D-03) | ✓ VERIFIED (as-of-close) — order flipped later | Named test at the phase-9 tree: `selectTimelineEntries over the REAL JSON: exactly 5 entries, year-ascending — BEng 2012 · … · Chubb 2023 (D-03)` → pass. HEAD: comparator descending per user directive `7ab0dd8`; the set/types/filters are unchanged and the HEAD test (`… year-DESCENDING (present-first)`) is green |
| P1-2 | Type-aware content templates: role = title > company > duration AS STORED · location > ≤3 bullets; education = degree > institution > duration AS STORED > specialization when present (BEng omits) | ✓ VERIFIED | `experience-section.tsx:268-283` (education branch: `degree` h3, `institution` p, `duration` AS STORED with no location/separator, `specialization` only when present), `:295-` (role branch). Named test `template field mapping (pure data level)…` green at both trees; BEng's absent `specialization` verified against the real JSON (`specialization: undefined`) |
| P1-3 | Education markers are constant hollow dots (`rounded-full border border-chart-2 bg-transparent` — never fill, never swap size); role markers keep the filled dot + size swap; education labels render the year only | ✓ VERIFIED | `experience-section.tsx:158-161` — `isEducation ? 'h-1.5 w-1.5 rounded-full border border-chart-2 bg-transparent' : …` with no state-dependent variant; `:266` compact chip hollow; `:174-177` `showDateLine = t.type === 'role' && …`. Rendered-artefact corroboration: the class string appears exactly **4** times in the built export (2 education entries × 2 render surfaces) |
| P1-4 | The stage engine is byte-untouched (zero framer-motion under `experience*`; `use-timeline-progress.ts` no diff) and n=5 math stays n-generic (Δ=22.5°, ladder 1/0.9125/0.825/0.7375/0.65) | ✓ VERIFIED | `git log` on the hook ends at phase-8 `175dcab`; `git diff f84900f^..138af26 -- src/components/explore/use-timeline-progress.ts` empty; the n=5 sweeps (angles ∀progress, emphasis ladder, keyboard round-trip) are named tests green at both trees |
| P1-5 | SSR/static export shows entry 0 real text, the counter renders 01 / 05, Prev/Next clamp at 5 stops | ✓ VERIFIED (as-of-close) — entry 0 changed later | At `138af26`: named tests `sweep E-6 (E, phase EXPLORE-09): entry 1 (first selectTimelineEntries result — BEng, education) renders real text in out/explore.html`, E-7 (≥4 hidden layers), E-8 (counter/anatomy), E-9 (5 dots + 5 labels at `opacity:0`) all pass against the fresh build. At HEAD E-6 names Chubb (post-flip) and still passes; counter `01 / 05` and the clamp (`:209`/`:224`) unchanged |
| P1-6 | `selectTimelineRoles` no longer exists — ONE derivation site; both consumers migrated; the renewed pins carry no stale fact | ✓ VERIFIED | Named test `gone-check: the phase-8 role-only derivation export is deleted — ONE derivation site (OQ-8)` green at both trees; the literal symbol survives only inside that absence assertion (`tests/explore-timeline.test.mjs:442`); the two adapter pins carry the education-passing form (`education={data.education}` in `explore-visuals.test.mjs` and `explore-visuals-skills.test.mjs`); the counter-idiom message reads `§4: 01 / 05` |
| P2-1 | The About panel leads with the pinned two-line positioning statement as two block spans, never joined | ✓ VERIFIED | `about-section.tsx:95-112` (`positioning` sliced into `[leadLine, leadTail]`, two `<span className="block …">`); data values verbatim in `portfolio-main-data.json` (`positioning` = the 2 SPEC lines). Named test `about.positioning: exactly the 2 approved lines, verbatim, in order` green at both trees; both lines present in the export in order |
| P2-2 | An impact-metric row renders exactly the 4 approved stats from the NEW `about.metrics` array as 2×2 mini-tiles — verbatim data, never computed at render | ✓ VERIFIED | `about-section.tsx:117-130` (`grid grid-cols-2`, `metric.value` / `metric.label` straight from props); real data `[{12+, engineering teams}, {30+, engineers}, {7+, years}, {600+, npm launch week}]`. Named tests `about.metrics: exactly the 4 approved {value,label} stats in approved order` and `metric values are transcriptions of already-approved data strings (never computed)` green; zero `parseInt`/`split` in the component |
| P2-3 | The availability badge renders `about.availability` as a non-interactive accent pill | ✓ VERIFIED | `about-section.tsx:132-139` — conditional on truthy data, `<span>` (non-focusable), `rounded-full border border-border … text-accent`, text straight from the field. Named test `about.availability: verbatim CLI banner transcription (WelcomeMessage.tsx:33/:42)` green; the CLI file itself has no phase-9 diff |
| P2-4 | The avatar renders from `about.profileImageUrl` as a plain `<img loading=lazy decoding=async>` rounded crop (`h-16 w-16 md:h-20 md:w-20 object-cover`) with a meaningful alt; empty URL → graceful-hide | ✓ VERIFIED | `about-section.tsx:142-150` (all four attributes present, `alt={\`Portrait of ${about.name}\`}`, guarded by `about.profileImageUrl &&`); `grep -c "use client\|framer-motion\|onError"` over the file → **0**, so the server-component boundary is preserved. Export carries `src="https://tinyurl.com/5cfm72u7"` |
| P2-5 | The full summary renders demoted below the lead (reverting to pre-phase prominence when positioning is absent); all 9 contact rows render tightened with `min-h-[44px]` retained; the resume link stays last | ✓ VERIFIED | `about-section.tsx:154-160` (`hasPositioning ? 'text-xs … text-muted-foreground' : 'text-sm … text-foreground'`); `ROW_CLASS` (`:90-91`) carries `min-h-[44px]`; `CHANNELS` has exactly 9 entries; export order puts the resume link after every contact row (10 `min-h-[44px]` occurrences in the About slice = 9 channels + the resume row). Named test `the 3 new about fields are purely additive — every pre-existing key survives` green; a grep over the CLI/resume/PDF consumers found no key-set pin on `about` |
| P2-6 | All three new fields are typed in the `.d.ts` in the SAME commit as the JSON write (R-7) and were user-approved via draft→approve→write | ✓ VERIFIED | `portfolio-main-data.d.ts:84,86,88` — `positioning?: string[]`, `availability?: string`, `metrics?: { value: string; label: string }[]`; one atomic commit `377ec78` writes JSON + types + tests together; `about-data-draft.md` (77 lines) carries the source-trace table and a **filled** APPROVAL BOX (`:9` "Approved: 2026-09-24 — user approved all three fields as drafted"), committed as `b10cc8a` before the write |
| P3-1 | The grid reflows by REAL DOM order — `[About+Contact \| Skills]` row 1, Experience full-width row 2, Projects row 3 — with DOM order = visual order = tab order | ✓ VERIFIED | Reordered `EXPLORE_SECTIONS` + `explore-panels.tsx` render loop mapping the array (no placement re-sorting); zero `md:order-first` in the tree (named pin `order-first count 0`); grid base is `grid-cols-1 md:grid-cols-2` so DOM order is the visual order. Phase 11 appended `credentials` (REV-21) without disturbing the first three rows |
| P3-2 | Index chips re-derive (About 01, Skills 02, Experience 03, Projects 04) — `String(index+1).padStart(2,'0')` over the array, no literals in JSX | ✓ VERIFIED | `explore-panels.tsx:130-144` (`index={String(index + 1).padStart(2, '0')}`); the built export renders chips 01–05 in document order with chip→section pairs 01→About, 02→Skills, 03→Experience, 04→Projects, 05→Credentials (phase-11 addition) |
| P3-3 | Drawer digit accents follow the SECTION, not the position — per-id Record, so Skills never inherits Experience's accent | ✓ VERIFIED | `explore-drawer.tsx:38-44` `DIGIT_ACCENTS: Record<ExploreSectionId, string>` (`about: chart-1, experience: chart-2, skills: chart-3, projects: chart-4, credentials: chart-5`), consumed as `DIGIT_ACCENTS[section.id]` at `:68`; the positional array is gone. Named test `drawer: 4 anchor items from EXPLORE_SECTIONS, 44px targets, per-id chart digits (REV-14 D-01)` green at the phase-9 tree; HEAD drawer suite 0 failures |
| P3-4 | The tour's CONTENT step order is unchanged (welcome → about → experience → skills → projects → finish) via an id-keyed literal table; each body stays paired to its own section id | ✓ VERIFIED | `constants.ts:127-170` — literal table with `id`/`sectionId`/`heading`/`announce`/`body` per step, headings via the guarded `tourLabel(id)` lookup (`:122`); the positional `EXPLORE_SECTIONS.map` zip and the positional bodies array are gone. Named tests `step table: locked 6-entry sequence welcome → … → finish, CONTENT order id-keyed` and `tour generation: the positional zip is GONE — a literal id-keyed table only` green at the phase-9 tree. REV-21 explicitly keeps this order as-is; HEAD tour suite 45/45 |
| P3-5 | The Experience wrapper drops `md:order-first` and lands on row 2 naturally; every placement utility is `md:`-scoped (375px invariant) with no overflow utility on the sticky chain | ✓ VERIFIED | `explore-panels.tsx:117-121` (wrapper `md:col-span-2 md:h-[300vh]`, shell `md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]`, no `order-first`); named tests `every new placement/height utility is md-scoped — 375px stacks 1-col (R-9)` and `sticky-breaker audit — no overflow utility on the panels grid` green at both trees |
| P3-6 | The visited counter, IO marking and tour scroll targets re-derive automatically; the entrance stagger re-derives by DOM position with zero CSS changes | ✓ VERIFIED | `explore-status-bar.tsx:44-49` is count-based (`EXPLORE_SECTIONS.length`); `use-explore-visited.ts` filters ids and uses per-section IO thresholds; `explore-tour.tsx` resolves targets via `getElementById(section.id)`; `.panel-grid > *` stagger (globals.css, REV-11) keys on DOM position — and the three files carry no phase-9 diff (`explore-status-bar.tsx`, `use-explore-visited.ts`, `explore-tour.tsx` untouched by plan 03) |
| P4-1 | The Projects panel renders stat tiles + the editorial scroll stage (md+): top-6 rows — year + name + first-sentence description + link — with thin dividers, inside the sticky ~100vh shell within a `md:h-[300vh]` wrapper | ✓ VERIFIED (as-of-close) — superseded at HEAD | At `138af26`: `projects-editorial-stage.tsx:296` `ProjectsEditorialStage`; `explore-panels.tsx:128-129` second sticky pair; `projects-section.tsx:61` `hidden md:block md:h-[calc(100dvh-14.5rem)] md:overflow-hidden` rows viewport between tiles and the compact grid. Named test `integration: the editorial composition is wired into the server panel + placement map` green; all 6 top-6 first sentences present in the fresh export. Deleted under REV-18 |
| P4-2 | Rows enter from below and COEXIST — one progress value, continuous interpolation, no discrete thresholds, no springs/bounce (`useTransform` only) | ✓ VERIFIED (as-of-close) — superseded at HEAD | At `138af26`: `projects-editorial-stage.tsx` uses `useScroll`/`useTransform` with the pure `rowState` math (4 call sites — grep-counted) and no `useSpring`; named tests `rowState: monotonicity, clamping and the coexistence window over a progress sweep` and `rowState: §4.3 default values at rest and mid-transition` green; `firstSentence` over-budget truncation test green |
| P4-3 | Reduced motion degrades to opacity-only via `useReducedMotion` with the sticky range retained; no wheel/touch listeners; the scroll source stays `.explore-shell > main` | ✓ VERIFIED (as-of-close) — superseded at HEAD | Named test `rowState: reduced motion → y ≡ 0 for every input while opacity still tracks d` green; `MAIN_SELECTOR = '.explore-shell > main'` at stage `:60`; the no-hijack greps (`no wheel/touch listeners`) live in the phase-8/9 source-invariant block and stay green at both trees |
| P4-4 | `firstSentence(description, 120)`: split at the first period KEEPING it, word-boundary truncate + `…` over budget — DeepIndex and Clarif-AI truncate, SDK4ED-TD renders whole | ✓ VERIFIED (as-of-close) — superseded at HEAD | Named tests `firstSentence: the two over-budget top-6 rows truncate at a word boundary with an ellipsis`, `…the four short top-6 rows render whole, INCLUDING the terminal period`, `E-5 no period`, `E-6 exact boundary`, `empty string` — all green at the phase-9 tree. Independently recomputed this session against the real JSON in the phase-9 tree export: the derived strings are present for all 6 rows (117/114/55/97/86/82 chars) |
| P4-5 | SSR renders row 0 real text + tiles + pointer at md+ with rows 1–5 at `opacity:0` / hidden / `aria-hidden`; `<md` the compact card grid owns the surface byte-identical | ✓ VERIFIED (as-of-close) — partly superseded at HEAD | Fresh phase-9 build contains all 6 row strings and `opacity:0` styles; the compact card grid is unchanged in the server panel. At HEAD the compact grid still serves `<md` while the md+ tier is the phase-10 stack (supersession) |
| P4-6 | framer-motion imports appear ONLY in the projects composition file; the stage is a `"use client"` child while `ProjectsSection` stays a server component; hover on linked rows is color-only (no `exp-lift`) | ✓ VERIFIED (as-of-close) — engine allowlist moved at HEAD | At `138af26`: the only `framer-motion` import under `src/` is the editorial stage; the §10.7 scan was **renewed** (not deleted) to a dual-engine allowlist. At HEAD the single import site is `projects-stack-stage.tsx` (grep over all `src/*.ts(x)` returns exactly that file) and the scan test still enforces the allowlist — same contract, successor file |
| P4-7 | The two span-2 count assertions keep passing after the `md:col-span-2` move, with their message texts renewed to name the projects WRAPPER | ✓ VERIFIED (as-of-close) — placement later re-homed | The renewal landed in `1fe9eb7` and both suites were green at the phase-9 tree. Phase 10 retired the projects wrapper (natural height), so at HEAD the projects span-2 fact no longer applies; the assertions themselves are green (0 failures) under their phase-10-renewed messages |

## Score

**58/58 must-haves verified** — 30 truths (5 roadmap-goal truths + 6 plan-01 + 6 plan-02 + 6 plan-03 + 7 plan-04), 14 required artifacts, 14 key links. `behavior_unverified: 0`.

**17 of the 58 are verified at the phase-9 closing tree with a documented HEAD supersession** (they are not failures — each was independently reproduced at `138af26` and each replacement is authorised by a later roadmap requirement or an explicit user directive): truths R4, P1-1, P1-5, P4-1…P4-7 (10), artifacts A12–A14 (3), key links K11–K14 (4). Everything else (41 items) is verified at HEAD as well.

## Deferred Items

| Deferred idea (CONTEXT / SPEC) | Status against later phases |
|---|---|
| Editorial scroll for the remaining 8 projects (CLI-reachable) | **Moot** — the editorial composition itself was replaced by REV-18 (phase 10) + the swipe-loop directive; the remaining projects stay CLI-reachable in both successors |
| Arc extensions beyond education (certifications etc. — the brief's future note) | Still deferred; no later phase in the milestone claims it (phase 11 put certifications in a Credentials panel, not on the arc) |
| Scroll-triggered reveals beyond the pinned compositions | Still deferred; no later phase claims it |

## Required Artifacts

| # | Artifact | Required | Observed | Status |
|---|---|---|---|---|
| A1 | `src/components/explore/timeline-geometry.ts` | ≥290 lines; exports `TimelineEntry`, `selectTimelineEntries` + 14 geometry/progress functions; zero runtime imports | 316 lines at close (still present at HEAD); **19** export statements; all 16 named symbols present; `node --test` loads it via Node 24 type-stripping | ✓ |
| A2 | `src/components/explore/sections/experience-section.tsx` | ≥280 lines; exports `ExperienceSection` | 323 lines at close; `export function ExperienceSection` (`:99`); type-aware branch present | ✓ |
| A3 | `tests/explore-timeline.test.mjs` | ≥380 lines | 599 lines at close (present at HEAD); 27 named tests green at HEAD | ✓ |
| A4 | `.planning/…/about-data-draft.md` | ≥40 lines; source-trace table; filled APPROVAL BOX | 77 lines; §4 source-trace table; APPROVAL BOX filled `2026-09-24` | ✓ |
| A5 | `src/data/portfolio-main-data.json` | ≥350 lines; `about` gains the 3 fields, additive only | 381 lines; `about.positioning`/`availability`/`metrics` present and verbatim; 9 pre-existing `about` keys survive (named additive test green) | ✓ |
| A6 | `src/data/portfolio-main-data.d.ts` | ≥100 lines; the 3 optional typings | 110 lines; `:84/:86/:88` exactly as specified | ✓ |
| A7 | `src/components/explore/sections/about-section.tsx` | ≥180 lines; exports `AboutSection`; server component; no framer-motion / onError | 229 lines; `:93` export; 0 hits for `use client`/`framer-motion`/`onError` | ✓ |
| A8 | `src/components/explore/constants.ts` | ≥120 lines; the 6 named exports | 166 lines at close; `EXPLORE_SECTIONS`, `ExploreSectionId`, `EXPLORE_TOUR_STEPS`, `TourStep`, `EXPLORE_TOUR_ACCENTS`, `EXPLORE_TOUR_FINISH` all exported | ✓ |
| A9 | `src/components/explore/explore-panels.tsx` | ≥140 lines; exports `ExplorePanels` | 176 lines at close; `:128` export; placement factory `:110-126` | ✓ |
| A10 | `src/components/explore/explore-drawer.tsx` | ≥70 lines; exports `ExploreDrawer` | 77 lines at close; `DIGIT_ACCENTS` per-id Record at `:38-44` | ✓ |
| A11 | `tests/explore-tour.test.mjs` | ≥560 lines | 635 lines at close (present at HEAD, 45/45 green) | ✓ |
| A12 | `src/components/explore/projects-row-state.ts` | ≥80 lines; exports `firstSentence`, `rowState`, `rowYear` | 125 lines at `138af26`, all 3 exports — **MISSING at HEAD** (deleted `53d347a`, REV-18) | ✓ as-of-close / superseded |
| A13 | `src/components/explore/sections/projects-editorial-stage.tsx` | ≥140 lines; exports `ProjectsEditorialStage` | 326 lines at `138af26`, `:296` export — **MISSING at HEAD** (same deletion) | ✓ as-of-close / superseded |
| A14 | `tests/projects-editorial.test.mjs` | ≥120 lines | 264 lines at `138af26` (its named pure-module + integration tests passed) — **MISSING at HEAD** | ✓ as-of-close / superseded |

## Key Link Verification

| # | From → To | Via | Status |
|---|---|---|---|
| K1 | `tests/explore-timeline.test.mjs` → `src/data/portfolio-main-data.json` | `readFileSync` at test time (5-entry expectation derived from the real JSON, no copied literals) | WIRED (2 references) |
| K2 | `experience-section.tsx` → `timeline-geometry.ts` | imports `selectTimelineEntries` + `TimelineEntry`; the component never shapes timeline data inline | WIRED |
| K3 | `explore-panels.tsx` → `timeline-geometry.ts` | `selectTimelineEntries(data.experience, data.education).length > 1` W-3 gate (`:113-114`) | WIRED |
| K4 | `tests/explore-visuals.test.mjs` (+ `-skills`) → `explore-panels.tsx` | the registry-spine adapter pin `experience: ({ data }) => <ExperienceSection experience={data.experience} education={data.education} />,` | WIRED (1 hit in each file) |
| K5 | `tests/portfolio-data-integrity.test.mjs` → the JSON | the approved values pinned verbatim (`Open to selective part-time work` etc.) | WIRED |
| K6 | `about-section.tsx` → `portfolio-main-data.json` | every new block renders from the `about` prop (`about.positioning`/`metrics`/`availability` — 7 references), no hardcoded copy | WIRED |
| K7 | `about-data-draft.md` → `WelcomeMessage.tsx` | the source-trace table records availability as a verbatim transcription (3 references); the CLI file itself has no phase-9 diff | WIRED |
| K8 | `explore-panels.tsx` → `constants.ts` | render order + chips derive from `EXPLORE_SECTIONS.map` (2 references) — one ordering source | WIRED |
| K9 | `explore-drawer.tsx` → `constants.ts` | `DIGIT_ACCENTS[section.id]` (`:68`) — accent follows the section | WIRED |
| K10 | `tests/explore-tour.test.mjs` → `constants.ts` | the renewed suite pins `EXPLORE_TOUR_STEPS` (24 references) — content order + per-id body pairing | WIRED |
| K11 | `projects-editorial-stage.tsx` → `projects-row-state.ts` | every per-row `useTransform` consumes the pure `rowState` (4 call sites); the motion channel never inlines row math | WIRED (as-of-close); both files deleted at HEAD under REV-18 |
| K12 | `projects-editorial-stage.tsx` → `.explore-shell > main` | `MAIN_SELECTOR = '.explore-shell > main'` (`:60`) + `WRAPPER_SELECTOR = '[data-editorial-wrapper]'` (`:62`), both handed in as hydrated refs | WIRED (as-of-close); the MAIN_SELECTOR contract persists in the phase-10 successor |
| K13 | `projects-section.tsx` → `projects-editorial-stage.tsx` | `import { ProjectsEditorialStage as EditorialStage }` (`:40`) composed in the md+ rows viewport | WIRED (as-of-close); at HEAD `ProjectsSection` composes the stack stage + mobile stack instead |
| K14 | `explore-panels.tsx` → the stage | the wrapper carries `data-editorial-wrapper="true"` (`:169`) which the stage resolves via `closest()` | WIRED (as-of-close); at HEAD the attribute rides on the Experience wrapper only |

## Data-Flow Trace

| System | Trace | Verdict |
|---|---|---|
| Arc entries | `portfolio-main-data.json` `experience`/`education` → `isTechRelated` + `featured` filters → `selectTimelineEntries` (5 typed entries, year-sorted, nulls last) → marker list (dot class by `type`) + label list (year; date-line role-only) + content layers (type-aware template) → SSR at `contentLayer(index,0,false)` → built `out/explore.html` (5 dots + 5 labels at `opacity:0`, entry 0 real text, `01 / 05`) | **Data-flowing** |
| About package | JSON `about` (9 pre-existing keys + 3 new) → `.d.ts` optional typings → `AboutSection({ about })` props → lead/metrics/chip/avatar/demoted summary/meta → 9 `CHANNELS` rows → resume link → SSR export (all strings present in the pinned order) | **Data-flowing** |
| Panel order | `EXPLORE_SECTIONS` array → grid render loop (+ per-id placement factory) → chips `01..05` → drawer items + per-id digit accents → tour step targets by id → status-bar counter (`EXPLORE_SECTIONS.length`) → IO visited marking by section id → export DOM order | **Data-flowing** |
| Projects top-6 (as-of-close) | JSON `projects.slice(0,6)` → stat tiles (server) → `rowYear`/`firstSentence`/`rowState` (pure) → `useTransform` per row (client) → SSR progress-0 rows + compact card grid below md → export (6 row strings + `opacity:0` rows) | **Data-flowing at `138af26`**; superseded at HEAD (stack stage consumes the same slice) |

## Behavioral Spot-Checks

Phase-9 closing tree (`/tmp/p9tree`, from `138af26`) — fresh build, then named tests:

| Behavior | Named check (phase-9 tree) | Result |
|---|---|---|
| 5-entry typed derivation | `selectTimelineEntries over the REAL JSON: exactly 5 entries, year-ascending — BEng 2012 · Netcompany-Intrasoft 2019 · MSc 2021 · Upstream Systems 2022 · Chubb 2023 (D-03)` | ✔ pass |
| Selection contracts (filters govern, data untouched) | `selection contracts consumed unchanged: isTechRelated roles (3) ∪ featured education (2)` | ✔ pass |
| One derivation site | `gone-check: the phase-8 role-only derivation export is deleted — ONE derivation site (OQ-8)` | ✔ pass |
| Type-aware template fields | `template field mapping (pure data level): role exposes …; education exposes degree/institution/duration/specialization-optional` | ✔ pass |
| Date-line fit over the real education durations | `W-4 over the education durations: 24/30 chars × 6px ≤ 196 − 16` | ✔ pass |
| SSR arc entry + counter | `sweep E-6 … entry 1 (first selectTimelineEntries result — BEng, education) renders real text in out/explore.html` | ✔ pass |
| SSR hidden layers / marker anatomy / pre-JS opacity | `sweep E-7`, `E-8`, `E-9` | ✔ pass ×3 |
| Reflow + spans + md-scoping + sticky-breaker audit | `sweep rows EXPLORE@* (P): 3-row rebalance structure`, `EXPLORE@375 (P): every new placement/height utility is md-scoped`, `sticky-breaker audit` | ✔ pass ×3 |
| Tour content order id-keyed / zip gone | `step table: locked 6-entry sequence … CONTENT order id-keyed`, `tour generation: the positional zip is GONE` | ✔ pass ×2 |
| Drawer per-id accents + grid rebalance | `drawer: 4 anchor items … per-id chart digits (REV-14 D-01)`, `panels: responsive grid rebalance` | ✔ pass ×2 |
| About data contract | `about.positioning`, `about.availability`, `about.metrics`, `purely additive` | ✔ pass ×4 |
| Editorial rows (REV-17) | `integration: the editorial composition is wired into the server panel + placement map`, `rowState: monotonicity…`, `firstSentence: the two over-budget top-6 rows truncate…` | ✔ pass ×3 |
| Full phase gate | `node --test tests/*.test.mjs` | **239/239, 0 fail** |

HEAD regression (fresh runs this session):

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` (13 suites) | **267/267 pass, 0 fail** |
| `npm run typecheck` | exit 0 |
| `explore-timeline` / `explore-sweep` / `explore-tour` named suites | 27/27, 20/20, 45/45 |
| `explore-shell` / `explore-visuals` / `explore-visuals-server` / `portfolio-data-integrity` | 0 failures each |
| Engine invariant | `grep framer-motion` in `experience-section.tsx` + `use-timeline-progress.ts` + `timeline-geometry.ts` → 0 matches; hook's last commit `175dcab` (phase 8) |
| framer-motion isolation at HEAD | exactly one file under `src/` imports it — `sections/projects-stack-stage.tsx` (phase-10 successor of the phase-9 stage) |
| Debt markers | `TBD`/`FIXME`/`XXX` → 0 in all 8 phase-9-touched source/data files |

## Requirements Coverage

| Req | Coverage | Status |
|---|---|---|
| **REV-14** | Panel order + re-mapped drawer/wizard/counter flows | **Delivered** — verified at both trees (P3-1…P3-6); phase 11 appended Credentials per REV-21 without disturbing it |
| **REV-15** | About presentation package + 3 approved data fields | **Delivered** — verified at both trees (P2-1…P2-6, R2) |
| **REV-16** | Education on the arc — 5 entries, type-aware templates, engine untouched | **Delivered** — verified at both trees (P1-1…P1-6, R3); the entry ORDER direction was later flipped to present-first by an explicit user directive (`7ab0dd8`), which changes the order, not the requirement's substance (5 entries, type-aware, engine hand-rolled) |
| **REV-17** | Projects editorial scroll composition (framer-motion, top-6 rows) | **Delivered at the phase tree, materially SUPERSEDED at HEAD** by REV-18 (phase 10 `53d347a`) + the user's swipe-loop directive (`b39b12c`). `REQUIREMENTS.md`'s `[x]` for REV-17 still describes removed machinery and should be re-annotated as superseded when the ledger is next touched |

## Anti-Patterns Found

**None.** `TBD` / `FIXME` / `XXX` counts are 0 across every phase-9-touched file (`timeline-geometry.ts`, `experience-section.tsx`, `explore-panels.tsx`, `constants.ts`, `explore-drawer.tsx`, `about-section.tsx`, `portfolio-main-data.json`, `portfolio-main-data.d.ts`). No stub bodies, no `TODO`-shaped deferrals, no orphaned artifacts: the three files deleted at HEAD were removed together with their tests and their call sites in one commit.

## Human Verification Required

1. **Arc legibility and marker semantics at ≥768px** — 5 markers with adjacent mono year labels (see frontmatter item 1). The math is swept (Δ=22.5°, all θ ∈ [90°,270°]) and the class anatomy is source- and export-verified, but "the labels read comfortably and the hollow-vs-filled dot distinction lands" is perceptual.
2. **Reduced-motion behaviour of the arc under a real OS preference** (frontmatter item 2) — the RM branches are unit-tested and source-pinned; the rendered suppression outcome needs a browser.
3. **The About panel in a browser at 375px and ≥768px, both themes** (frontmatter item 3) — order, values, 44px floors and avatar attributes are export-verified; hierarchy, avatar crop and contact-row tightness are visual.

*Note (not a check):* the editorial scroll's own perceptual feel (sticky pin, rows coexisting, reduced-motion swaps) **cannot** be human-verified any more — that composition no longer exists at HEAD (superseded by REV-18 / phase 10), and the successor stack's feel belongs to phase 10's verification scope.

## Gaps Summary

**No gaps.** Every one of the 58 must-haves is verified, 41 of them at HEAD and all 58 at the phase-9 closing tree `138af26` where the phase's own gate was independently reproduced green (`typecheck` exit 0, `build` exit 0 with all four routes statically prerendered, `239/239` tests). The only items that do not exist at HEAD are the REV-17 editorial-scroll constructs (3 artifacts, 4 key links, 10 truths' worth of wiring), and they were deleted deliberately by phase 10 under **REV-18** — whose roadmap row states the replacement in its own goal text — plus an explicit user swipe-loop directive. That is supersession, not a delivery miss, and it is recorded as such (with commits) rather than folded into the score.

Two housekeeping consequences follow from this verification, neither of them requiring a re-plan:

1. `REQUIREMENTS.md`'s `[x] REV-17` should be annotated as superseded by REV-18 (phase 10) when the requirement ledger is next edited.
2. The arc's ascending order pinned in plan 01's must-haves is superseded by the user's present-first directive (`7ab0dd8`); the plan-01 truth text now reads as history rather than current contract.

The status is `human_needed` because three perceptual checks remain open (arc legibility/marker semantics, reduced-motion rendering, About-panel visual pass). Nothing blocks moving on: the phase is verified as delivered, and its superseded half is accounted for by the later phase that replaced it.
