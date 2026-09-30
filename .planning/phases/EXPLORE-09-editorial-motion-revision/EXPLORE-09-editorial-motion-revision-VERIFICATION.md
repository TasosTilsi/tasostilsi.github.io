---
phase: 09-editorial-motion-revision
verified: 2026-09-30T05:40:24Z
status: passed
score: 58/58 must-haves verified
behavior_unverified: 0
overrides_applied: 0
verification_tree: "138af26 (phase-9 execute-artefacts commit) — fresh export at /tmp/p9verify"
head_at_verification: 90ac2bd
superseded_items: 17
superseded_by: "REV-18 (phase 10, 53d347a) + user swipe-loop directive (b39b12c)"
human_verification_status: "approved — user batch confirmation, recorded 2026-09-30 (c97b0e8)"
---

# Phase 9: editorial-motion-revision Verification Report

**Verification basis.** HEAD (`90ac2bd`) is **two phases ahead** of this phase (10 projects-stack-revision, 11 credentials-panel-revision, plus three user-directed quick tasks), so every phase-9 truth was verified in two places:

1. **The phase-9 closing tree** — a fresh `git archive 138af26` export into `/tmp/p9verify` (with `node_modules` symlinked), where I independently reproduced the phase's whole gate this session: `npm run typecheck` → **exit 0**; `npm run build` → **exit 0** (routes `/`, `/_not-found`, `/explore`, `/resume` all `○ (Static) prerendered as static content`); `node --test tests/*.test.mjs` → **239 tests, 239 pass, 0 fail**. At that tree `selectTimelineEntries` sorted **year-ascending** and the Projects panel still carried the editorial scroll — every truth statement below is judged as written there.
2. **HEAD** — where later phases *renewed* rather than deleted the phase-9 pins: `node --test tests/*.test.mjs` → **269 tests, 269 pass, 0 fail**; `npm run typecheck` → **exit 0**.

No SUMMARY claim was accepted without a tool check; every number and path below comes from a command run in this session. The HEAD **build** was deliberately not re-run: a live `next dev` server occupies port 3000 in this worktree (`ss -ltnp`), and a production build in the same tree would wipe that server's `.next` manifests. The existing `out/explore.html` (2026-09-30 08:38, contains `id="credentials"`, i.e. post-phase-11 and current for HEAD) was read as the HEAD export artefact; **the phase-9 tree got its own fresh build**, which is what the phase-9 SSR assertions were run against.

## Supersession map (not gaps)

Five later commits legitimately changed phase-9 constructs. Each was checked at the phase-9 tree (where the construct existed and passed) before being classified as evolution rather than a miss — none of them is a delivery failure. The deletion is additionally *enforced* at HEAD by a gone-check, so the supersession is clean rather than half-wired.

| Commit | Phase / REQ | What it changed on phase-9 ground | Phase-9 items affected |
|---|---|---|---|
| `7ab0dd8` | quick 2026-09-24-arc-present-first-order (**explicit user directive**: "the experience must be shown from the present to the past") | `selectTimelineEntries` comparator ascending → **descending** (nulls still last; merge/filters untouched); SSR entry 0 becomes Chubb instead of the Bachelor degree. Re-gated green in its own task record. | P1-1, P1-5 (order half) |
| `53d347a` | phase 10, **REV-18** | Deleted `src/components/explore/sections/projects-editorial-stage.tsx`, `src/components/explore/projects-row-state.ts`, `tests/projects-editorial.test.mjs`; rewired `ProjectsSection` to the stacked-card stage + mobile stack. ROADMAP phase 10 states the replacement in its own goal text. | P4-1…P4-7 (all), artifacts A12–A14, key links K11–K14 |
| `b39b12c` | quick 2026-09-25-projects-swipe-loop-stack (user directive) | The Projects composition becomes a swipe-driven centered stack; the projects sticky wrapper is retired (`projects: { wrapper: '', shell: '', gate: false }`) so `data-editorial-wrapper` now rides only on the Experience wrapper. | P4-3, P4-7 (sticky/spans halves) |
| `08333e3` | phase 11, **REV-21** | Appended the 5th panel (Credentials) beside Projects in row 3; chips/drawer/counter grow to 5; the wizard step sequence is explicitly kept as-is. | none reverted — REV-14's reflow is preserved, row 3 extended |
| `bb5f687` / `583570c` | phase 10 plans 02–03 | Retired the "editorial" wording; kept the wrapper-target assertion; renewed the phase-9 pins to the successor contract. | pin hygiene only |

**Consequence for the record:** REV-17 is materially superseded at HEAD by REV-18. The phase-9 delivery was complete and green at its own tree, so this is not recorded as a gap — but `REQUIREMENTS.md`'s `[x] REV-17` line now describes machinery that no longer exists in the tree and deserves a supersession annotation (REV-18 / phase 10) the next time the requirement ledger is touched.

## Goal Achievement → Observable Truths

| # | Truth | Status | Evidence |
|---|---|---|---|
| R1 | **Roadmap goal** — the panel order reflows so About leads (About first), Experience full-width mid-page, Projects after it | ✓ VERIFIED | `constants.ts:18-24` `EXPLORE_SECTIONS` in DOM order `[about, skills, experience, projects]` (+`credentials` at HEAD); `explore-panels.tsx` render loop maps the array over a `grid-cols-1 md:grid-cols-2` grid with a per-id placement factory; the only `order-first` string in `src/` is doc prose ("The order-first utility RETIRED"), and the `md:order-first` count is pinned 0 by three named assertions. Export chips render 01→About … 04→Projects (05→Credentials at HEAD) |
| R2 | **Roadmap goal** — the About presentation package (positioning lead, impact metrics, availability badge, avatar) | ✓ VERIFIED | `about-section.tsx` (229 lines) blocks at `:96-112` lead (two block spans, never joined) → `:117-130` 2×2 metric tiles → `:132-139` availability chip → `:142-150` avatar → `:154-160` demoted summary → `:180-` 9 channel rows (`CHANNELS` = exactly 9, verified by parsing the array literal) → resume link last. Export order re-verified programmatically in my own build: lead@477 → tail@645 → 12+@838 → 600+@1516 → availability@1833 → avatar@1896 → summary@2067, monotonic; `min-h-[44px]` appears 10× in the About slice (9 channels + the resume row); "Full resume" at 13183/13551 |
| R3 | **Roadmap goal** — education merged onto the semicircular arc (5 entries, type-aware) | ✓ VERIFIED | `selectTimelineEntries` (`timeline-geometry.ts:287-306`) over the real JSON yields exactly 5 typed entries (3 `isTechRelated` roles ∪ 2 `featured` degrees); `TimelineEntry` carries the `'role' \| 'education'` discriminator (`:43-47`); type-aware templates in `experience-section.tsx` (`:156-161` dot anatomy, `:174-177` education label = year only, `:269-288` education template, role branch below). Fresh build contains exactly 5 `data-timeline-dot` + 5 `data-timeline-label` nodes |
| R4 | **Roadmap goal** — the Projects panel converted to a framer-motion-driven editorial scroll composition (top-6 rows entering from below) | ✓ VERIFIED (as-of-close) — **superseded at HEAD** | At `138af26`: `projects-editorial-stage.tsx` (326 lines, `export function ProjectsEditorialStage`) + `projects-row-state.ts` (125 lines, all 3 exports) + `tests/projects-editorial.test.mjs` (264 lines) present; both sticky placements in `explore-panels.tsx`; all 6 top-6 first-sentence strings present in my fresh `out/explore.html` (117/114/55/97/86/82 chars); 27/27 named spot-checks green. Deleted by `53d347a` under REV-18 (see supersession map); its absence is asserted by a gone-check at HEAD (`explore-visuals.test.mjs:934-943`) |
| R5 | **Roadmap goal** — the Experience stage stays hand-rolled (zero framer-motion in the stage) | ✓ VERIFIED | `grep -rn framer-motion` over `experience-section.tsx`, `use-timeline-progress.ts`, `timeline-geometry.ts` → **0 matches** at both trees; `git log -1 -- src/components/explore/use-timeline-progress.ts` → `175dcab` (phase 8, 2026-09-24 16:09), i.e. the hook was never touched by any phase-9 commit; `timeline-geometry.ts` carries only `import type` (zero runtime imports) |
| P1-1 | 5 chronological entries merged from `isTechRelated` roles ∪ `featured` degrees, sorted year-**ascending** (D-03) | ✓ VERIFIED (as-of-close) — order flipped later | Named test at the phase-9 tree: `selectTimelineEntries over the REAL JSON: exactly 5 entries, year-ascending — BEng 2012 · … · Chubb 2023 (D-03)` → **pass**. HEAD: comparator descending per user directive `7ab0dd8`; set/types/filters unchanged, HEAD equivalent named test green |
| P1-2 | Type-aware content templates: role = title > company > duration AS STORED · location > ≤3 bullets; education = degree > institution > duration AS STORED > specialization when present | ✓ VERIFIED | `experience-section.tsx:280-288` (education: `degree` h3, `institution` p, `duration` AS STORED with no location/separator, `specialization` only when present) vs the role branch below; named test `template field mapping (pure data level)…` **pass**; real JSON confirms BEng's absent `specialization` (the data strings are "Bachelor of Computer Engineering" / "Master of Science in Computer Science" — "BEng"/"MSc" are the plans' shorthand, not literals) |
| P1-3 | Education markers are constant hollow dots (`rounded-full border border-chart-2 bg-transparent` — never fill, never swap size); role markers keep the filled dot + size swap; education labels render the year only | ✓ VERIFIED | `experience-section.tsx:156-161` — `isEducation ? 'h-1.5 w-1.5 rounded-full border border-chart-2 bg-transparent' : …` with **no state-dependent variant on the education branch**; compact chip hollow at `:262-266`; `showDateLine = t.type === 'role' && …` at `:174-177` |
| P1-4 | The stage engine is byte-untouched (zero framer-motion under `experience*`; `use-timeline-progress.ts` no diff) and n=5 math stays n-generic (Δ=22.5°, ladder 1/0.9125/0.825/0.7375/0.65) | ✓ VERIFIED | `git log` on the hook ends at phase-8 `175dcab`; `grep framer-motion` → 0 in all three stage files; named tests `n=5 sweeps: every marker stays on the arc ∀ progress (Δ=22.5°); the emphasis ladder at n=5 is exactly [1, 0.9125, 0.825, 0.7375, 0.65] / [1, 0.925, 0.85, 0.775, 0.7]` **pass** and `n=5 keyboard round-trip + RM/contentLayer variants unchanged` **pass** |
| P1-5 | SSR/static export shows entry 0 real text, the counter renders 01 / 05, Prev/Next clamp at 5 stops | ✓ VERIFIED (as-of-close) — entry 0 changed later | At `138af26`: named sweeps `E-6` (entry 0 real text), `E-7` (layers 2–5 `visibility:hidden`), `E-8` (stage anatomy), `E-9` (5 dots + 5 labels at inline `opacity: 0`) all **pass** against my fresh build; I independently read the export: `data-timeline-dot` ×5, `data-timeline-label` ×5, and the counter node renders `01<!-- --> / <!-- -->05`. Clamp at `:206`/`:221` (`disabled={activeIndex === 0}` / `=== entryCount - 1`) |
| P1-6 | `selectTimelineRoles` no longer exists — ONE derivation site; both consumers migrated | ✓ VERIFIED | Named test `gone-check: the phase-8 role-only derivation export is deleted — ONE derivation site (OQ-8)` **pass**; `grep -rn selectTimelineRoles src/ tests/` returns exactly one hit — the absence assertion itself (`tests/explore-timeline.test.mjs:440`); both adapter pins carry the education-passing form |
| P2-1 | The About panel leads with the pinned two-line positioning statement as two block spans, never joined | ✓ VERIFIED | `about-section.tsx:96-112` (`positioning` destructured into `[leadLine, leadTail]`, two `<span className="block …">`; line 2 `text-base text-accent`); JSON values verbatim; named test `about.positioning: exactly the 2 approved lines, verbatim, in order` **pass**; both lines present in the export in order (477 → 645) |
| P2-2 | An impact-metric row renders exactly the 4 approved stats from the NEW `about.metrics` array as 2×2 mini-tiles — verbatim data, never computed at render | ✓ VERIFIED | `about-section.tsx:117-130` (`grid grid-cols-2`, `metric.value`/`metric.label` straight from props); real data `[{12+, engineering teams}, {30+, engineers}, {7+, years}, {600+, npm launch week}]`; named tests `about.metrics: exactly the 4 approved {value,label} stats in approved order` **pass** and the verbatim-transcription pin **pass**; zero `parseInt`/`split` in the component |
| P2-3 | The availability badge renders `about.availability` as a non-interactive accent pill | ✓ VERIFIED | `about-section.tsx:132-139` — conditional on truthy data, plain `<span>` (non-focusable), `rounded-full border border-border … text-accent`, text straight from the field; named test `about.availability: verbatim CLI banner transcription (WelcomeMessage.tsx:33/:42)` **pass**; the CLI file itself has no phase-9 diff |
| P2-4 | The avatar renders from `about.profileImageUrl` as a plain `<img loading=lazy decoding=async>` rounded crop with a meaningful alt; empty URL → graceful-hide | ✓ VERIFIED | `about-section.tsx:142-150` (`h-16 w-16 rounded-full object-cover md:h-20 md:w-20`, `alt={\`Portrait of ${about.name}\`}`, guarded by `about.profileImageUrl &&`); `grep -c "use client\|framer-motion\|onError"` → **0**, so the server-component boundary holds; the export carries `src="https://tinyurl.com/5cfm72u7"` with `loading="lazy"` |
| P2-5 | The full summary renders demoted below the lead (reverting when positioning is absent); all 9 contact rows render tightened with `min-h-[44px]`; the resume link stays LAST | ✓ VERIFIED | `about-section.tsx:154-160` (`hasPositioning ? 'text-xs … text-muted-foreground' : 'text-sm … text-foreground'`); `ROW_CLASS` carries `min-h-[44px]`; `CHANNELS` parsed = exactly 9 keys; my export slice shows the demoted class at 2067 (after the avatar) and "Full resume" at 13183/13551 — after every channel row; 10 `min-h-[44px]` occurrences = 9 channels + the resume row |
| P2-6 | All three new fields are typed in the `.d.ts` in the SAME commit as the JSON write (R-7) and were user-approved via draft→approve→write | ✓ VERIFIED | `.d.ts:82/:84/:86` — `positioning?: string[]`, `availability?: string`, `metrics?: { value: string; label: string }[]`; commit `377ec78` writes JSON + types + integrity tests together (3 files, +97/−1); `about-data-draft.md` (77 lines) carries the source-trace table (`:38/:39/:62` cite `WelcomeMessage.tsx`) and a **filled** APPROVAL BOX (`:9` "Approved: 2026-09-24 — user approved all three fields as drafted"), committed as `b10cc8a` *before* the write |
| P3-1 | The grid reflows by REAL DOM order — `[About+Contact \| Skills]` row 1, Experience full-width row 2, Projects row 3 — DOM order = visual order = tab order | ✓ VERIFIED | Reordered `EXPLORE_SECTIONS` + a render loop that maps the array directly (no placement re-sorting); `md:order-first` count pinned 0 in three named assertions; grid base `grid-cols-1 md:grid-cols-2`. Phase 11 appended `credentials` (REV-21) without disturbing the first three rows. Named test `sweep rows EXPLORE@* (P): 3-row rebalance structure` **pass** |
| P3-2 | Index chips re-derive (About 01, Skills 02, Experience 03, Projects 04) — `String(index+1).padStart(2,'0')` over the array, no literals in JSX | ✓ VERIFIED | `explore-panels.tsx` `index={String(index + 1).padStart(2, '0')}` in the array map; the built export renders chips in document order with chip→section pairs 01→About, 02→Skills, 03→Experience, 04→Projects (05→Credentials at HEAD) |
| P3-3 | Drawer digit accents follow the SECTION, not the position — per-id Record, so Skills never inherits Experience's accent | ✓ VERIFIED | `explore-drawer.tsx:38-44` `DIGIT_ACCENTS: Record<ExploreSectionId, string>` (`about: chart-1, experience: chart-2, skills: chart-3, projects: chart-4`), consumed at `:67` as `DIGIT_ACCENTS[section.id]`; the positional array is gone. Named test `drawer: 4 anchor items from EXPLORE_SECTIONS, 44px targets, per-id chart digits (REV-14 D-01)` **pass** |
| P3-4 | The tour's CONTENT step order is unchanged (welcome → about → experience → skills → projects → finish) via an id-keyed literal table; each body stays paired to its own section id | ✓ VERIFIED | `constants.ts:124-166` — literal table with `id`/`sectionId`/`heading`/`announce`/`body` per step, headings via the guarded `tourLabel(id)` lookup (`:115-122`); the positional `EXPLORE_SECTIONS.map` zip and the positional bodies array are gone. Named tests `step table: locked 6-entry sequence welcome → … → finish, CONTENT order id-keyed` **pass** and `tour generation: the positional zip is GONE` **pass** (24 `EXPLORE_TOUR_STEPS` references in the suite) |
| P3-5 | The Experience wrapper drops `md:order-first` and lands on row 2 naturally; every placement utility is `md:`-scoped (375px invariant) with no overflow utility on the sticky chain | ✓ VERIFIED | `explore-panels.tsx` placement factory: experience `wrapper: 'md:col-span-2 md:h-[300vh]'`, `shell: 'md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]'`; named tests `every new placement/height utility is md-scoped — 375px stacks 1-col (R-9)` **pass** and `sticky-breaker audit — no overflow utility on the panels grid` **pass** |
| P3-6 | The visited counter, IO marking and tour scroll targets re-derive automatically; the entrance stagger re-derives by DOM position with zero CSS changes | ✓ VERIFIED | `explore-status-bar.tsx:44-49` is count-based (`EXPLORE_SECTIONS.length`); `use-explore-visited.ts` filters ids and uses per-section IO thresholds; `explore-tour.tsx` resolves targets via `getElementById(section.id)`; `.panel-grid > *` stagger keys on DOM position — and `git log 138af26 --` on all three files plus `globals.css` shows their last commits are **phase-6/7** (`cc30b09`, `6545ec6`, `d3c587d`, `7b7a214`), i.e. no phase-9 diff |
| P4-1 | The Projects panel renders stat tiles + the editorial scroll stage (md+): top-6 rows — year + name + first-sentence description + link — with thin dividers, inside the sticky ~100vh shell within a `md:h-[300vh]` wrapper | ✓ VERIFIED (as-of-close) — superseded at HEAD | At `138af26`: `projects-editorial-stage.tsx:296` `export function ProjectsEditorialStage`; `explore-panels.tsx` carries the second sticky pair (`projects` wrapper + shell, gated on `data.projects.slice(0, 6).length > 1`); `projects-section.tsx:40/:62` composes `<EditorialStage projects={cards} />` in the md+ rows viewport. Named test `integration: the editorial composition is wired into the server panel + placement map` **pass**; all 6 top-6 first sentences present in my fresh export. Deleted under REV-18 |
| P4-2 | Rows enter from below and COEXIST — one progress value, continuous interpolation, no discrete thresholds, no springs/bounce (`useTransform` only) | ✓ VERIFIED (as-of-close) — superseded at HEAD | At `138af26`: the stage uses `useScroll`/`useTransform`/`useMotionValueEvent`/`useReducedMotion` and **no `useSpring`** (grep); `rowState(` appears at **4** call sites, so the motion channel never inlines row math; named tests `rowState: monotonicity, clamping and the coexistence window over a progress sweep` **pass**, `rowState: §4.3 default values at rest and mid-transition` **pass**, `rowState: visible flips exactly at \|d\| ≥ 1` **pass**, `rowState: H ≤ 0 totality` **pass** |
| P4-3 | Reduced motion degrades to opacity-only via `useReducedMotion` with the sticky range retained; no wheel/touch listeners; the scroll source stays `.explore-shell > main` | ✓ VERIFIED (as-of-close) — superseded at HEAD | Named test `rowState: reduced motion → y ≡ 0 for every input while opacity still tracks d (RM-5, D-04)` **pass**; `MAIN_SELECTOR = '.explore-shell > main'` at stage `:60`; `grep -rn "onWheel\|addEventListener('wheel'\|touchstart\|onTouchStart" src/` → **0 hits** at the phase-9 tree |
| P4-4 | `firstSentence(description, 120)`: split at the first period KEEPING it, word-boundary truncate + `…` over budget — DeepIndex and Clarif-AI truncate, SDK4ED-TD renders whole | ✓ VERIFIED (as-of-close) — superseded at HEAD | Named tests `firstSentence: the two over-budget top-6 rows truncate at a word boundary with an ellipsis`, `…the four short top-6 rows render whole, INCLUDING the terminal period`, `E-5 no period`, `E-6 exact boundary`, `empty string` — all **pass**. Independently recomputed against the real JSON: 117/114/55/97/86/82 chars and **all six present in the export** |
| P4-5 | SSR renders row 0 real text + tiles + pointer at md+ with rows 1–5 at `opacity:0` / hidden / `aria-hidden`; `<md` the compact card grid owns the surface byte-identical | ✓ VERIFIED (as-of-close) — partly superseded at HEAD | My fresh phase-9 build contains all 6 row strings plus the `opacity:0` row styles; the compact card grid is unchanged in the server panel. At HEAD the compact grid still serves `<md` while the md+ tier is the phase-10 stack |
| P4-6 | framer-motion imports appear ONLY in the projects composition file; the stage is a `"use client"` child while `ProjectsSection` stays a server component; hover on linked rows is color-only | ✓ VERIFIED (as-of-close) — engine allowlist moved at HEAD | At `138af26`: the only `framer-motion` import under `src/` is `projects-editorial-stage.tsx:52`; the §10.7 scan was **renewed** (not deleted) to a dual-engine allowlist. At HEAD the single import site is `projects-stack-stage.tsx:35` and the scan still enforces the allowlist — same contract, successor file |
| P4-7 | The two span-2 count assertions keep passing after the `md:col-span-2` move, with their message texts renewed to name the projects WRAPPER | ✓ VERIFIED (as-of-close) — placement later re-homed | The renewal landed in `1fe9eb7`; both suites were green at the phase-9 tree (239/239). Phase 10 retired the projects wrapper (natural height), so at HEAD the projects span-2 fact no longer applies; the assertions are green (269/269) under their phase-10-renewed messages |

## Score

**58/58 must-haves verified** — 30 truths (5 roadmap-goal truths + 6 plan-01 + 6 plan-02 + 6 plan-03 + 7 plan-04), 14 required artifacts, 14 key links. `behavior_unverified: 0`.

**17 of the 58 are verified at the phase-9 closing tree with a documented HEAD supersession** (not failures — each was independently reproduced at `138af26` and each replacement is authorised by a later roadmap requirement or an explicit user directive): truths R4, P1-1, P1-5, P4-1…P4-7 (10), artifacts A12–A14 (3), key links K11–K14 (4). Everything else (41 items) is verified at HEAD as well.

### Corrections to the preceding report (this session's numbers)

Four figures in the previous revision of this report did not reproduce and are corrected here; none changes a status:

1. **A5 `portfolio-main-data.json`** is **380** lines at the phase-9 tree (the earlier "381" is the HEAD count); **A6 `.d.ts`** is **108** at close (the earlier "110" is the HEAD count).
2. **A5 "9 pre-existing about keys survive"** is wrong — the additive test pins **8** pre-existing keys (`name, title, location, dob, email, description, contact, profileImageUrl`); 8 + 3 new = **11** total keys, confirmed by parsing the JSON. The "9" conflates the 9 contact `CHANNELS`.
3. **The HEAD suite is 269/269**, not the 267/267 recorded earlier (later phases added tests).
4. **"BEng" / "MSc" are shorthand**, not data literals — the real strings are "Bachelor of Computer Engineering" and "Master of Science in Computer Science". Grepping the export for `BEng` returns 0; the derivation test names use the shorthand. No impact on any assertion.

## Deferred Items

| Deferred idea (CONTEXT / SPEC) | Status against later phases |
|---|---|
| Editorial scroll for the remaining 8 projects (CLI-reachable) | **Moot** — the editorial composition itself was replaced by REV-18 (phase 10) + the swipe-loop directive; the remaining projects stay CLI-reachable in both successors |
| Arc extensions beyond education (certifications etc. — the brief's future note) | Still deferred; no later phase in the milestone claims it (phase 11 put certifications in a Credentials panel, not on the arc — `grep -i "arc.*certification"` over ROADMAP/REQUIREMENTS returns no match) |
| Scroll-triggered reveals beyond the pinned compositions | Still deferred; no later phase claims it |

## Required Artifacts

| # | Artifact | Required | Observed | Status |
|---|---|---|---|---|
| A1 | `src/components/explore/timeline-geometry.ts` | ≥290 lines; exports `TimelineEntry`, `selectTimelineEntries` + 14 geometry/progress functions; zero runtime imports | 316 lines at close (321 at HEAD); **19** `export` statements; all **16** required symbols present (asserted individually this session); only `import type` — `node --test` loads it via Node 24 type-stripping | ✓ |
| A2 | `src/components/explore/sections/experience-section.tsx` | ≥280 lines; exports `ExperienceSection` | 323 lines at close (326 at HEAD); `:96 export function ExperienceSection`; type-aware branch present | ✓ |
| A3 | `tests/explore-timeline.test.mjs` | ≥380 lines | 599 lines at close (601 at HEAD); green at HEAD | ✓ |
| A4 | `.planning/…/about-data-draft.md` | ≥40 lines; source-trace table; filled APPROVAL BOX | 77 lines; source-trace table at `:62`; APPROVAL BOX filled `2026-09-24` (`:9`) | ✓ |
| A5 | `src/data/portfolio-main-data.json` | ≥350 lines; `about` gains the 3 fields, additive only | **380** lines at close (381 at HEAD); `about` = 11 keys, the 3 new ones verbatim; 8 pre-existing keys survive (named additive test green) | ✓ |
| A6 | `src/data/portfolio-main-data.d.ts` | ≥100 lines; the 3 optional typings | **108** lines at close (110 at HEAD); `:82/:84/:86` exactly as specified | ✓ |
| A7 | `src/components/explore/sections/about-section.tsx` | ≥180 lines; exports `AboutSection`; server component; no framer-motion / onError | 229 lines at both trees; `export function AboutSection`; 0 hits for `use client`/`framer-motion`/`onError` | ✓ |
| A8 | `src/components/explore/constants.ts` | ≥120 lines; the 6 named exports | 166 lines at close (169 at HEAD); all 6 exports confirmed present | ✓ |
| A9 | `src/components/explore/explore-panels.tsx` | ≥140 lines; exports `ExplorePanels` | 176 lines at close (182 at HEAD); `export function ExplorePanels`; placement factory is a data-driven `Record<ExploreSectionId, …>` | ✓ |
| A10 | `src/components/explore/explore-drawer.tsx` | ≥70 lines; exports `ExploreDrawer` | 77 lines at close (78 at HEAD); `DIGIT_ACCENTS` per-id Record at `:38-44` | ✓ |
| A11 | `tests/explore-tour.test.mjs` | ≥560 lines | 635 lines at close (641 at HEAD); green at HEAD | ✓ |
| A12 | `src/components/explore/projects-row-state.ts` | ≥80 lines; exports `firstSentence`, `rowState`, `rowYear` | 125 lines at `138af26`, all 3 exports — **deleted at HEAD** (`53d347a`, REV-18); absence enforced by a gone-check | ✓ as-of-close / superseded |
| A13 | `src/components/explore/sections/projects-editorial-stage.tsx` | ≥140 lines; exports `ProjectsEditorialStage` | 326 lines at `138af26`, `:296` export — **deleted at HEAD** (same commit) | ✓ as-of-close / superseded |
| A14 | `tests/projects-editorial.test.mjs` | ≥120 lines | 264 lines at `138af26`, all named tests passing — **deleted at HEAD** | ✓ as-of-close / superseded |

## Key Link Verification

| # | From → To | Via | Status |
|---|---|---|---|
| K1 | `tests/explore-timeline.test.mjs` → `src/data/portfolio-main-data.json` | `readFileSync` at test time (the 5-entry expectation derived from the real JSON, no copied literals) — 2 references | WIRED |
| K2 | `experience-section.tsx` → `timeline-geometry.ts` | imports `selectTimelineEntries` + `TimelineEntry`; the component never shapes timeline data inline | WIRED |
| K3 | `explore-panels.tsx` → `timeline-geometry.ts` | `selectTimelineEntries(data.experience, data.education).length > 1` W-3 gate in the placement factory | WIRED |
| K4 | `tests/explore-visuals.test.mjs` (+ `-skills`) → `explore-panels.tsx` | the registry-spine adapter pin `experience: ({ data }) => <ExperienceSection experience={data.experience} education={data.education} />,` — 1 hit in each file | WIRED |
| K5 | `tests/portfolio-data-integrity.test.mjs` → the JSON | approved values pinned verbatim (`Open to selective part-time work`, the two positioning lines, the 4 metrics) | WIRED |
| K6 | `about-section.tsx` → `portfolio-main-data.json` | every new block renders from the `about` prop (`about.positioning`/`metrics`/`availability`), no hardcoded portfolio copy | WIRED |
| K7 | `about-data-draft.md` → `WelcomeMessage.tsx` | the source-trace table records availability as a verbatim transcription (3 references at `:38/:39/:62`); the CLI file itself has no phase-9 diff | WIRED |
| K8 | `explore-panels.tsx` → `constants.ts` | render order + chips derive from `EXPLORE_SECTIONS.map` — one ordering source | WIRED |
| K9 | `explore-drawer.tsx` → `constants.ts` | `DIGIT_ACCENTS[section.id]` (`:67`) — accent follows the section | WIRED |
| K10 | `tests/explore-tour.test.mjs` → `constants.ts` | the renewed suite pins `EXPLORE_TOUR_STEPS` (24 references) — content order + per-id body pairing | WIRED |
| K11 | `projects-editorial-stage.tsx` → `projects-row-state.ts` | every per-row `useTransform` consumes the pure `rowState` (4 call sites); the motion channel never inlines row math | WIRED (as-of-close); both files deleted at HEAD under REV-18 |
| K12 | `projects-editorial-stage.tsx` → `.explore-shell > main` | `MAIN_SELECTOR = '.explore-shell > main'` (`:60`) + `WRAPPER_SELECTOR = '[data-editorial-wrapper]'` (`:62`), both handed in as hydrated refs | WIRED (as-of-close); the MAIN_SELECTOR contract persists in the phase-10 successor |
| K13 | `projects-section.tsx` → `projects-editorial-stage.tsx` | `import { ProjectsEditorialStage as EditorialStage }` (`:40`) composed at `:62` in the md+ rows viewport | WIRED (as-of-close); at HEAD `ProjectsSection` composes the stack stage + mobile stack instead |
| K14 | `explore-panels.tsx` → the stage | the wrapper carries `data-editorial-wrapper="true"` (`:169`) which the stage resolves via `closest()` | WIRED (as-of-close); at HEAD the attribute rides on the Experience wrapper only (documented as a stable hook nothing under `src/` reads) |

## Data-Flow Trace

| System | Trace | Verdict |
|---|---|---|
| Arc entries | `portfolio-main-data.json` `experience`/`education` → `isTechRelated` + `featured` filters → `selectTimelineEntries` (5 typed entries, year-sorted, nulls last) → marker list (dot class by `type`) + label list (year; date-line role-only) + content layers (type-aware template) → SSR at `contentLayer(index,0,false)` → built `out/explore.html` (5 dots + 5 labels at `opacity:0`, entry 0 real text, counter `01 / 05`) | **Data-flowing** |
| About package | JSON `about` (8 pre-existing keys + 3 new) → `.d.ts` optional typings → `AboutSection({ about })` props → lead/metrics/chip/avatar/demoted summary/meta → 9 `CHANNELS` rows → resume link → SSR export (all strings present in the pinned order, monotonic offsets 477→13183) | **Data-flowing** |
| Panel order | `EXPLORE_SECTIONS` array → grid render loop (+ per-id placement factory) → chips `01..05` → drawer items + per-id digit accents → tour step targets by id → status-bar counter (`EXPLORE_SECTIONS.length`) → IO visited marking by section id → export DOM order | **Data-flowing** |
| Projects top-6 (as-of-close) | JSON `projects.slice(0,6)` → stat tiles (server) → `rowYear`/`firstSentence`/`rowState` (pure) → `useTransform` per row (client) → SSR progress-0 rows + compact card grid below md → export (6 row strings + `opacity:0` rows) | **Data-flowing at `138af26`**; superseded at HEAD (the stack stage consumes the same slice) |

## Behavioral Spot-Checks

Phase-9 closing tree (`/tmp/p9verify`, fresh export of `138af26`) — fresh build this session, then named tests (never the full suite wholesale):

| Behavior | Named check (phase-9 tree) | Result |
|---|---|---|
| 5-entry typed derivation | `selectTimelineEntries over the REAL JSON: exactly 5 entries, year-ascending — BEng 2012 · … · Chubb 2023 (D-03)` | ✔ pass |
| Selection contracts (filters govern, data untouched) | `selection contracts consumed unchanged: isTechRelated roles (3) ∪ featured education (2)` | ✔ pass |
| Null-year ordering edge | `sort contract: stable year-ascending with null years LAST` | ✔ pass |
| One derivation site | `gone-check: the phase-8 role-only derivation export is deleted — ONE derivation site (OQ-8)` | ✔ pass |
| Type-aware template fields | `template field mapping (pure data level)…` | ✔ pass |
| n=5 arc geometry + emphasis ladder | `n=5 sweeps: every marker stays on the arc ∀ progress (Δ=22.5°); the emphasis ladder at n=5 is exactly [1, 0.9125, 0.825, 0.7375, 0.65] / [1, 0.925, 0.85, 0.775, 0.7]` | ✔ pass |
| n=5 keyboard round-trip + RM/contentLayer | `n=5 keyboard round-trip + RM/contentLayer variants unchanged` | ✔ pass |
| Zero/single-entry totality | `E-1 zero-entry totality`, `E-2 single-role guard set` | ✔ pass ×2 |
| Date-line fit over the real education durations | `W-4 over the education durations: 24/30 chars × 6px ≤ 196 − 16` | ✔ pass |
| SSR arc entry + counter + hidden layers + pre-JS opacity | `sweep E-6`, `E-7`, `E-8`, `E-9` | ✔ pass ×4 |
| Reflow + spans + md-scoping + sticky-breaker audit | `sweep rows EXPLORE@* (P): 3-row rebalance structure`, `EXPLORE@375 (P): every new placement/height utility is md-scoped`, `sticky-breaker audit` | ✔ pass ×3 |
| Tour content order id-keyed / zip gone | `step table: locked 6-entry sequence … CONTENT order id-keyed`, `tour generation: the positional zip is GONE` | ✔ pass ×2 |
| Drawer per-id accents | `drawer: 4 anchor items … per-id chart digits (REV-14 D-01)` | ✔ pass |
| About data contract | `about.positioning`, `about.availability`, `about.metrics`, `the 3 new about fields are purely additive` | ✔ pass ×4 |
| Editorial rows (REV-17) | `integration: the editorial composition is wired into the server panel + placement map` | ✔ pass |
| Editorial row math | `rowState: monotonicity, clamping and the coexistence window`, `…default values at rest and mid-transition`, `…visible flips exactly at \|d\| ≥ 1`, `…reduced motion → y ≡ 0`, `…H ≤ 0 totality` | ✔ pass ×5 |
| First-sentence split/truncate/boundary | `firstSentence: the two over-budget top-6 rows truncate…`, `…four short rows render whole, INCLUDING the terminal period`, `E-5`, `E-6`, `empty string` | ✔ pass ×5 |
| Release semantics (no scroll hijack) | `release semantics: computeProgress clamps rel far beyond ±range` | ✔ pass |
| **Full phase gate** | `node --test tests/*.test.mjs` | **239/239, 0 fail** |

HEAD regression (fresh runs this session):

| Check | Result |
|---|---|
| `node --test tests/*.test.mjs` (13 suites) | **269/269 pass, 0 fail** |
| `npm run typecheck` | exit 0 |
| Engine invariant | `grep framer-motion` in `experience-section.tsx` + `use-timeline-progress.ts` + `timeline-geometry.ts` → 0 matches; hook's last commit `175dcab` (phase 8) |
| framer-motion isolation at HEAD | exactly one file under `src/` imports it — `sections/projects-stack-stage.tsx` (phase-10 successor of the phase-9 stage) |
| Supersession hygiene | the three deleted phase-9 files are asserted absent by a gone-check (`explore-visuals.test.mjs:934-943`); **no dangling reference** to `projects-row-state` / `ProjectsEditorialStage` remains (the surviving `firstSentence` lives in the successor `projects-card-state.ts`) |
| Debt markers | `TBD`/`FIXME`/`XXX` → 0 in all 11 phase-9-touched source/data files |

## Requirements Coverage

| Req | Coverage | Status |
|---|---|---|
| **REV-14** | Panel order + re-mapped drawer/wizard/counter flows | **Delivered** — verified at both trees (P3-1…P3-6); phase 11 appended Credentials per REV-21 without disturbing it |
| **REV-15** | About presentation package + 3 approved data fields | **Delivered** — verified at both trees (P2-1…P2-6, R2) |
| **REV-16** | Education on the arc — 5 entries, type-aware templates, engine untouched | **Delivered** — verified at both trees (P1-1…P1-6, R3); the entry ORDER direction was later flipped to present-first by an explicit user directive (`7ab0dd8`), which changes the order, not the requirement's substance (5 entries, type-aware, engine hand-rolled) |
| **REV-17** | Projects editorial scroll composition (framer-motion, top-6 rows) | **Delivered at the phase tree, materially SUPERSEDED at HEAD** by REV-18 (phase 10 `53d347a`) + the user's swipe-loop directive (`b39b12c`). `REQUIREMENTS.md`'s `[x]` for REV-17 still describes removed machinery and should be re-annotated as superseded the next time the ledger is touched |

## Anti-Patterns Found

**None.** `TBD` / `FIXME` / `XXX` counts are 0 across every phase-9-touched file (`timeline-geometry.ts`, `experience-section.tsx`, `explore-panels.tsx`, `constants.ts`, `explore-drawer.tsx`, `about-section.tsx`, `projects-section.tsx`, `projects-row-state.ts`, `projects-editorial-stage.tsx`, `portfolio-main-data.json`, `portfolio-main-data.d.ts`). No stub bodies, no `TODO`-shaped deferrals, no orphaned artifacts: the three files deleted at HEAD were removed together with their tests and their call sites in one commit (`53d347a`, −829/+80).

## Human Verification Required

**None outstanding.** The three perceptual items raised when this phase was first verified were:

1. **Arc legibility and marker semantics at ≥768px** — 5 markers with adjacent mono year labels; the math is swept (Δ=22.5°, all θ ∈ [90°,270°]) and the class anatomy is source- and export-verified, but "the labels read comfortably and the hollow-vs-filled dot distinction lands" is perceptual.
2. **Reduced-motion behaviour of the arc under a real OS preference** — the RM branches are unit-tested and source-pinned; the rendered suppression outcome needs a browser.
3. **The About panel in a browser at 375px and ≥768px, both themes** — order, values, 44px floors and avatar attributes are export-verified; hierarchy, avatar crop and contact-row tightness are visual.

All three were **confirmed by the user in the 2026-09-25 batch approval round**, recorded in commit `c97b0e8` ("record batch human confirmation for phases 7-11"), which appends `status_human: approved` to the phase-7…11 verification records. They are therefore closed rather than deferred.

*Note (not a check):* the editorial scroll's own perceptual feel (sticky pin, rows coexisting, reduced-motion swaps) **cannot** be human-verified any more — that composition no longer exists at HEAD (superseded by REV-18 / phase 10), and the successor stack's feel belongs to phase 10's verification scope.

## Gaps Summary

**No gaps.** Every one of the 58 must-haves is verified, 41 of them at HEAD and all 58 at the phase-9 closing tree `138af26`, where the phase's own gate was independently reproduced green this session (`typecheck` exit 0, `build` exit 0 with all four routes statically prerendered, `239/239` tests, 27 + 8 named behavioural spot-checks). The only items that do not exist at HEAD are the REV-17 editorial-scroll constructs (3 artifacts, 4 key links, 10 truths' worth of wiring), and they were deleted deliberately by phase 10 under **REV-18** — whose roadmap row states the replacement in its own goal text — plus an explicit user swipe-loop directive, with the deletion itself asserted by a gone-check test. That is supersession, not a delivery miss, and it is recorded as such (with commits) rather than folded into the score.

Two housekeeping consequences follow from this verification, neither of them requiring a re-plan:

1. `REQUIREMENTS.md`'s `[x] REV-17` should be annotated as superseded by REV-18 (phase 10) when the requirement ledger is next edited.
2. The arc's ascending order pinned in plan 01's must-haves is superseded by the user's present-first directive (`7ab0dd8`); the plan-01 truth text now reads as history rather than current contract.

**Status is `passed`.** All truths verified, all artifacts substantive and wired, all key links wired, no anti-patterns, no unresolved human items (the three perceptual checks were user-confirmed in the 2026-09-25 batch round). Nothing blocks moving on.
