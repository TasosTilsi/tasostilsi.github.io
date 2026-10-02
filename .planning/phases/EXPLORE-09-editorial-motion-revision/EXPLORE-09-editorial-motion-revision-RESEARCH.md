All research is complete — every claim verified against the tree, the data, and the installed framer-motion source. Here is the full RESEARCH.md:

---

# EXPLORE-09-editorial-motion-revision — RESEARCH

**Phase:** 09 editorial-motion-revision · REV-14 (grid reflow), REV-15 (About package), REV-16 (education-on-arc), REV-17 (projects editorial scroll)
**Inputs:** SPEC (locked), CONTEXT D-01…D-05 (locked), UI-SPEC v1.0 (design contract, read in full), PROJECT.md
**Research method:** every claim below was verified this session against the real tree, the real `portfolio-main-data.json`, the installed `node_modules/framer-motion@13.4.3` (package.json + `.d.ts` + ESM source), or computed with node against the real data. No claim rests on training memory alone unless tagged `[ASSUMED]`.

**Provenance legend:** `[VERIFIED: <source>]` = confirmed via a tool AND an authoritative in-repo/registry source this session. `[CITED: <url>]` = official docs. `[ASSUMED]` = training knowledge only.

---

## 1. Domain analysis

### 1.1 Work area A — Grid reflow (REV-14, D-01)

**Current state (all [VERIFIED: src reads this session]):**
- The single ordering source is `EXPLORE_SECTIONS` — `src/components/explore/constants.ts:10-15` — currently `[about, experience, skills, projects]`. Five consumers derive from it (grep, this session): `explore-panels.tsx` (render order + index chips, line 133), `explore-drawer.tsx:53-68` (items + **positional** digit accents, line 33-38), `explore-status-bar.tsx:44-49` (count-based counter — order-independent), `use-explore-visited.ts:54,78` (valid-id filter + per-panel IO loop — order-independent), and `constants.ts:117-123` (tour step generation — **positional zip** against a positional body array, line 95-100).
- The grid is `grid-cols-1 md:grid-cols-2 lg:gap-5` (`explore-panels.tsx:123`); Experience leads row 1 via a data-driven `PLACEMENT` map (`explore-panels.tsx:108-116`): wrapper `'md:order-first md:col-span-2 md:h-[300vh]'`, shell `'md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]'`; Projects shell carries `md:col-span-2`.
- The sticky extension is data-conditional (W-3): `selectTimelineRoles(data.experience).length > 1` at `explore-panels.tsx:121`.
- `PanelShell` is a plain `<section>` — NOT a flex container (verified `panel-shell.tsx:46-65`) — so an inner stage cannot size with `flex-1`; the UI-SPEC's explicit-inner-height resolution (§4.1) is the only mechanism available. Confirmed.
- The entrance stagger animates `.panel-grid > *` with `nth-child(2/3/4)` 40/80/120ms delays (`src/app/globals.css`, REV-11 block, verified this session) — children re-derive by DOM position; **no CSS change needed** for the reflow. `[VERIFIED: globals.css]`

**Mechanism (UI-SPEC §1.1, verified sound):** reorder `EXPLORE_SECTIONS` to `[about, skills, experience, projects]`. Chips re-derive (`String(index+1).padStart(2,'0')`), drawer order re-derives, stagger re-derives, DOM order = visual order (the `md:order-first` speech-order caveat retires). Two positional consumers BREAK and must be re-pinned (both confirmed by reading them):
1. `DIGIT_ACCENTS` (drawer, positional array) → per-id Record (`text-chart-1` about, `text-chart-2` experience, `text-chart-3` skills, `text-chart-4` projects) — otherwise Skills gets Experience's accent.
2. Tour step generation (positional zip of bodies) → id-keyed literal 6-step table so CONTENT order stays welcome→about→experience→skills→projects→finish (D-01) while DOM order is About→Skills→Experience→Projects. The existing test `tests/explore-tour.test.mjs:73-97` pins the positional zip (`step.sectionId === EXPLORE_SECTIONS[i].id`) — it renews (see §5).

**PLACEMENT deltas** (UI-SPEC §1.1, verified against the current map): Experience wrapper drops `md:order-first`; Projects gains wrapper `'md:col-span-2 md:h-[300vh]'` (conditional W-3 mirror: `slice(0,6).length > 1`) + shell `'md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]'`; the existing `md:col-span-2` moves shell→wrapper. Both wrappers stay plain `div`s with NO id (R-3 — tour hole, IO, drawer anchors measure the sticky `<section id>`; verified the tour measures `getElementById(section.id)` at `explore-tour.tsx:111` and IO at `use-explore-visited.ts:79`).

**W-3 gate re-wiring (verified ripple):** `explore-panels.tsx:121` imports `selectTimelineRoles` and gates Experience's extension. With education merged, that gate must read the NEW merged derivation (5 > 1 → extended, same outcome, different function). Both importers of `selectTimelineRoles` (`explore-panels.tsx:61`, `experience-section.tsx:64`) update together. Confidence: high.

**Confidence: HIGH** — the whole area is class-string surgery on one verified map plus two verified positional breakages; the planner decides nothing structural beyond the UI-SPEC's pinned resolutions.

### 1.2 Work area B — About presentation package (REV-15, D-02)

**Current anatomy** (`src/components/explore/sections/about-section.tsx:78-147`, [VERIFIED]): description paragraph (`text-sm text-foreground`) → meta row (Briefcase/MapPin) → `my-3` divider → 9 contact rows (`ROW_CLASS` with `min-h-[44px]`, per-channel graceful-hide) → Full resume link (bordered accent, LAST). Server component, no hooks, no `use client` (line 22-32 header).

**Target anatomy** (UI-SPEC §2.1, pinned): positioning lead → metrics row → availability chip → avatar → demoted summary + meta → divider → 9 tightened contacts → resume link. The order note (metrics/availability/avatar before the summary) satisfies D-02's "summary below the lead"; U-1 default holds.

**Data facts (all [VERIFIED: portfolio-main-data.json this session]):**
- `about.profileImageUrl` already exists: `"https://tinyurl.com/5cfm72u7"` (JSON line 28) and is typed (`portfolio-main-data.d.ts:80`). It is consumed ONLY by `src/app/layout.tsx:42,77` (OG/schema metadata) — **no component renders it yet**; the avatar is entirely new rendering surface.
- Metric sources verbatim: `'12+ engineering teams'` (competency proof, JSON line 31), `'30+ engineers'` (line 34), `'7+ years'` (about.description, line 16), `'600+ downloads in launch week'` (DeepIndex description, line 185).
- Availability source verbatim: `'Open to selective part-time work'` — `src/components/cli/outputs/WelcomeMessage.tsx:33` (ASCII banner) and `:42` (mobile banner). `[VERIFIED]`
- Cross-surface safety of the 3 new fields: `about` is read by WelcomeMessage (`about.title`), layout.tsx metadata, AboutSection, and `src/app/(main)` surfaces — none spread `about` into a shape-pinned consumer; `tests/portfolio-data-integrity.test.mjs` pins `about.title`/`about.description` VALUES (lines 219-241) and pins education/projects/articles/cert collections, but never `Object.keys(about)`. **Additive fields break nothing** on CLI/resume/PDF. `[VERIFIED: grep + test read]`

**Typing (R-7, same-commit):** `.d.ts` additions — `positioning?: string[]` (2 entries), `availability?: string`, `metrics?: { value: string; label: string }[]` (UI-SPEC §10; optional typing aligned with the graceful-hide matrix §2.8).

**Avatar element:** plain `<img loading="lazy" decoding="async">` — verified rationale: `next.config.ts:5,11-12` pins `output: 'export'` + `images.unoptimized: true`; the tinyurl host is NOT in `remotePatterns`; no `<img>`/`next/image` precedent exists in any component (grep, this session). `next/image` unoptimized would work but adds nothing; plain `<img>` keeps AboutSection a server component (UI-SPEC U-5/U-12 default). Graceful-hide on empty URL; no `onError` handler (server component) — broken-URL browser fallback accepted.

**Data-write discipline:** the phase-6 precedent is `.planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md` — a complete diff draft with a user-filled APPROVAL BOX before any write (read this session, [VERIFIED]). The phase-9 draft is 3 fields but the approval round is NOT skipped (D-02).

**Confidence: HIGH.** The only judgement left is presentation detail, and UI-SPEC §2 already pins defaults with a U-register.

### 1.3 Work area C — Education merged onto the arc (REV-16, D-03)

**Verified data facts (node run against the real JSON, this session):**
- Featured education = exactly 2: MSc (`October 2021 - June 2023`, 24 chars) and BEng (`September 2012 - December 2018`, 30 chars) — hyphen-style durations; `startYear`'s regex is dash-agnostic (`timeline-geometry.ts:71,247-251`). BEng has **no** `specialization` field; MSc has `Software Quality Assurance Engineering`.
- Tech roles' start years: Netcompany 2019, Upstream 2022, Chubb 2023. Merged + sorted year-ascending → the 5 pinned entries **2012 BEng · 2019 Netcompany · 2021 MSc · 2022 Upstream · 2023 Chubb** — exactly D-03's list, confirmed from real data.
- `education` featured flags are test-pinned (`tests/portfolio-data-integrity.test.mjs:426-436`); the data file is NOT edited this phase.

**Engine reality (the load-bearing finding):** `use-timeline-progress.ts` is **count-agnostic** — it takes `roleCount` as a parameter (line 130), discovers dots/labels/layers via `data-timeline-*` hooks in DOM order (lines 148-157), and never references entry content. The pure geometry (`markerAngle` Δ=90°/(n−1), `markerEmphasis`, `contentLayer`, `reducedMotionAngle/Emphasis`) generalizes to any n ≥ 2 (E-3 contract, `timeline-geometry.ts:106-171`). **Zero engine changes are required** — the byte-untouched-engine constraint (D-05) is satisfiable with a derivation-only extension. `[VERIFIED: full read of both files]`

**What actually changes:**
- `timeline-geometry.ts` gains the merged derivation: a typed `TimelineEntry { type: 'role' | 'education'; year: string | null; entry: ExperienceEntry | EducationEntry }[]` from `selectTimelineEntries(experience, education)` = `experience.filter(isTechRelated) ∪ education.filter(featured)`, sorted by parsed start year **ascending**. This is "the one deliberate sort of this phase" (UI-SPEC §3.1) — it supersedes, for this one function, the module's pinned "No sorting of data-derived arrays anywhere" header (`timeline-geometry.ts:27-29`); the new function's docstring must scope that rule so the contradiction is documented, not silent. The old `selectTimelineRoles` is replaced (its callers are exactly the two files above, grep-verified) and its tests renew.
- Sort key: `startYear(entry.duration)` (exists, verified). Edge: a null year needs a deterministic placement — recommend stable-sort with nulls LAST, and no 5-entry assertion breaks because all 5 real durations parse (`[VERIFIED: computed]`).
- `experience-section.tsx` content layer becomes type-aware: role template unchanged; education renders degree > institution > `duration` AS STORED (no location — education entries have a `location` field but the template omits it per UI-SPEC §3.3) > `specialization` (absent → omit; BEng omits, verified). Keys change (`entry.company` → type-aware primary, education entries have no `company`). sr-only announce becomes type-aware (`Entry i of n — title|degree, company|institution`). Marker anatomy: education = constant hollow dot (`border border-chart-2 bg-transparent`, never fills, never swaps size — UI-SPEC §3.2 W-2 resolution) — a className concern only, **no per-frame write changes** (the rAF channel writes opacity/transform to the same nodes regardless of type).
- No-JS/SSR behavior change (accepted): SSR shows entry 0 = **BEng (education)** real text instead of Chubb. The phase-8 no-JS contract renews.
- W-3 generalization: `explore-panels.tsx` gate switches to `selectTimelineEntries(...).length > 1` (5 > 1 → sticky retained; ≤1 → natural height, E-2 preserved).
- W-4 predicate: education durations are 24–30 chars → 144–180px at 6px/char — fits at md inner widths (UI-SPEC §3.1 arithmetic; verified the two real durations). Unchanged.

**n=5 marker math (verified numerically):** Δ = 22.5°; every marker stays on θ ∈ [90°,270°]; emphasis ladder opacities 1 / 0.9125 / 0.825 / 0.7375 / 0.65 and scales 1 / 0.925 / 0.85 / 0.775 / 0.7 — monotone, matches UI-SPEC §3.1. Label crowding: adjacent markers are ~0.39·radius apart along the arc (≈98px at a 250px radius) vs a 4-char mono year label (~30px at text-xs) — fits; the top/bottom ends (θ=270°/90°) anchor differently but never overlap. Low risk; verify visually at 768px during execute.

**Controls/counter:** Prev/Next + ArrowUp/ArrowDown unchanged, now 5 clamped stops; counter `padStart(2,'0')` renders `03 / 05`. Compact form stacks all 5 entries. `[VERIFIED: engine read]`

**Confidence: HIGH.** Biggest execution risk is accidentally touching the engine files — the grep gate (`zero framer-motion import under src/components/explore/sections/experience*`) plus "use-timeline-progress.ts byte-untouched" must be explicit plan constraints.

### 1.3.1 Work area D — Projects editorial scroll (REV-17, D-04)

**Engine: framer-motion 13.4.3 — installed, verified, UNUSED in src today** (`package.json:42`; zero `framer-motion` imports under `src/` — grep, this session). This phase is the library's first real usage; there is no in-repo precedent to copy, so the API semantics below are verified from the installed package itself.

Verified API facts (all from `node_modules/framer-motion@13.4.3`):
- Runtime exports exist and are functions: `useScroll`, `useTransform`, `useReducedMotion`, `motion`, `AnimatePresence`, `useSpring`, `useMotionValue`, `useInView`, `useMotionValueEvent`. `[VERIFIED: node -e require check]`
- `useScroll({ container?, target?, axis?, offset? })` returns `{scrollX, scrollY, scrollXProgress, scrollYProgress}` MotionValues; `offset?: ScrollOffset = Array<Edge | Intersection | ProgressIntersection>` (e.g. `['start start','end end']`). `[VERIFIED: dist/index.d.ts:1058-1070, 755-810]`
- `useTransform` overloads: `(mv, inputRange, outputRange, options?)`, single-transformer, multi-transformer, and `(() => O)` forms. `[VERIFIED: dist/index.d.ts:1216-1257]`
- `useReducedMotion(): boolean | null` — null on SSR/no-preference; handle as `?? false`. `[VERIFIED: dist/index.d.ts:1306]`
- peerDependencies `react ^18.0.0 || ^19.0.0` — repo has react 18.3.1 ✓. Runtime deps `motion-dom 13.4.2` + `motion-utils 13.3.0` are its own transitive deps (installed). `[VERIFIED: package.json]`
- The ES modules carry `"use client"` directives (e.g. `dist/es/value/use-scroll.mjs:1`) but there is no RSC entry and `sideEffects: false`; the repo-standard pattern — import framer-motion only from a file whose first line is `"use client"` (the `experience-section.tsx:1` precedent) — is the correct, safe boundary. `[VERIFIED: file head + grep for directives]`

**Container resolution — the critical pitfall, verified from the installed implementation** (`dist/es/value/use-scroll.mjs`, read in full this session):
1. `isRefPending(ref) = !ref.current`. If the container/target ref is pending at the layout effect, `useScroll` defers via a microtask retry; if it is STILL pending, it throws `invariant("Container ref is defined but not hydrated", "use-scroll-ref")`.
2. If `container?.current` is **undefined** (never hydrated object vs missing), `scroll()` receives `container: undefined` and **falls back to the window/documentElement** — and that result is cached, "would permanently mistrack". Inside the explore shell, window scroll is ALWAYS 0 (`use-timeline-progress.ts` research note, line 11-13, and `MAIN_SELECTOR = '.explore-shell > main'` line 104).
3. Therefore the ONLY safe pattern for this repo: the stage client component must not render until the main element is discovered (phase-8 idiom: `document.querySelector('.explore-shell > main')` inside a mount effect), and the discovered element must be handed to `useScroll` as a ref that is ALREADY hydrated — i.e. a mount-gated child receiving the element, with `const containerRef = useRef<HTMLElement>(main)` (initial-value ref, hydrated before any framer effect runs). UI-SPEC §4.3 pins `container: mainRef('.explore-shell > main')` — the discovery+gating mechanics are this research's verified addition.
4. Offset semantics verified from source (`dist/es/render/dom/scroll/offsets/offset.mjs`): progress = `resolveEdge(target edge, targetLength, targetInset) − resolveEdge(container edge, containerLength)` — the container edge is the container's border box, NOT its content box. The explore `<main>` has `p-4 md:p-6` (`explore-shell.tsx:70`), so `['start start','end end']` engages ~24px before the phase-8 `rel`-math engage point (which subtracts `mainPaddingTop`). Delta is absorbed by the 300vh range; the inner-height constant is a tunable U-value (UI-SPEC U-15). Verified nuance, not a blocker.

**Verified composition architecture** (matching D-04 + UI-SPEC §4.3, and the phase-8 idioms the repo already proves):
- Geometry: plain wrapper div (grid child, no id) `md:col-span-2 md:h-[300vh]` conditional on top-6 count > 1; sticky PanelShell `md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]` (the Experience recipe verbatim); inside the pinned shell: ProjectStatTiles (server, unchanged) → rows viewport (`hidden md:block`, explicit inner height class — U-15 starting value `md:h-[calc(100dvh-14.5rem)]`, tunable 13.5–15.5rem; PanelShell is not flex so `flex-1` is unavailable — verified) → compact list (`md:hidden`, the existing card grid byte-identical, stays server-rendered) → TerminalPointer last.
- Single progress source: `useScroll({ container, target: wrapperRef, offset: ['start start','end end'] })` → one MotionValue 0→1. `useTransform` per row consumes a PURE row-state module (`rowState(progress, i, n, H)` + `firstSentence(desc, 120)` in a framer-free, zero-runtime-import sibling — node --testable, the `timeline-geometry.ts` R-12 precedent). Rows: `motion.div` with `style={{ y, opacity }}` MotionValues; **no springs, no bounce** — `useTransform` linear/gentle interpolation only (editorial-calm, D-04).
- Discrete channel (aria-hidden/visibility flip at |d| ≥ 1): React state written ONLY on discrete row-index changes via `useMotionValueEvent(progress, 'change', …)` — the phase-8 "React state only on activeIndex change" contract carried over. `[VERIFIED: useMotionValueEvent is exported — dist/index.d.ts:1756]`
- SSR/no-JS contract (§4.4): do NOT rely on framer-motion to SSR motion values — render each row with CONSTANT explicit style props from the pure derivation at progress 0 (row 0 real text; rows 1–5 `opacity:0, y:+H, visibility:hidden, aria-hidden`), exactly the phase-8 `ssr = contentLayer(index, 0)` idiom (`experience-section.tsx:199-213`); the MotionValues adopt per-frame on hydration. Static export shows row 0 + tiles + pointer at md+; <md the compact list owns the surface (the rows viewport is CSS-hidden).
- Reduced motion: `useReducedMotion()` → `y ≡ 0`, opacity-only swaps; sticky retained (RM-5). No wheel/touch listeners anywhere (D-05); scroll IS the input through the one main scrollport.
- Hover: color-only on linked rows (`group-hover:text-accent`, the existing card vocabulary); **no `exp-lift`** — the transform channel is owned by the motion system; a hover transform would fight per-frame writes.
- Client boundary: keep `ProjectsSection` a server component; extract ONLY the md+ stage as a `"use client"` child receiving the top-6 slice (plain JSON — serializable). This preserves the D-07/D-08 "panels are server components" convention and keeps tiles/compact list/pointer in the static export with zero client JS.
- Import isolation (grep gate): framer-motion imports appear ONLY in the projects composition files; zero under `experience*` (SPEC gate, UI-SPEC §12).

**First-sentence data (computed against the real JSON this session):** top-6 = DeepIndex, Clarif-AI, SDK4ED-TD, ServicedMetricsCalculator, Avoid Traffic Extended, Uom Track (data order, JSON lines 185-190). Without-period readings: DeepIndex 233 chars, Clarif-AI 121, SDK4ED-TD 54, ServicedMetricsCalculator 96, Avoid Traffic Extended 85, Uom Track 81. With-period (+1): 234 / 122 / 55 / 97 / 86 / 82. Exactly two rows truncate at 120 (DeepIndex, Clarif-AI); UI-SPEC's E-6 examples (236→120+…, ~123→120+…) corroborate the with-period counting (234≈236, 122≈123).

**Confidence: HIGH on contract, MEDIUM on pixel-level tuning** (the inner-height constant and the engage-point delta are tunable-by-design via U-15/U-13; nothing structural).

### 1.4 Patterns and pitfalls inventory (condensed)

| # | Pitfall | Status |
|---|---|---|
| P1 | `useScroll` container ref hydration → window fallback / invariant throw | VERIFIED above; mount-gate + ref-initial pattern |
| P2 | Positional zip breakages (drawer digits, tour bodies) on reorder | VERIFIED both sites; UI-SPEC pins resolutions |
| P3 | framer-motion in a server component | Must import only from `"use client"` files; repo precedent exists |
| P4 | SSR reliance on framer motion values | Do not — constant SSR style props from the pure module (phase-8 idiom) |
| P5 | Hover transforms fighting per-frame motion writes | Pinned: color-only hover on rows; no `exp-lift` |
| P6 | A CSS transition on a per-frame-written property | Existing §6 row-1 rule; discrete color swaps only (`transition-colors`) |
| P7 | `order-first` re-sort leaves speech order ≠ visual order | Retired with the array reorder (real DOM reorder) — UI-SPEC §8 |
| P8 | Sticky breakers: any `overflow` utility on wrapper/shell/grid/main chain | Carry over the phase-8 audit; no new overflow utilities |
| P9 | Two sticky ranges on one page (E-15) | Sequential wrappers, both shells `md:z-10`; ids stay on the `<section>`s |
| P10 | `node --test` loads pure modules via Node 24 type-stripping | New pure modules: zero runtime imports, erasable TS only (R-12 precedent) |
| P11 | Old `selectTimelineRoles` name drift | One derivation site preserved — generalize in place, renew tests |

## 2. Package legitimacy

No new dependencies are proposed. The single relevant package:

| Package | Claim | Verification |
|---|---|---|
| `framer-motion@^13.4.3` | Already a dependency; provides the editorial-scroll APIs | `[VERIFIED: package.json:42]` declares it; `[VERIFIED: node_modules/framer-motion/package.json]` installed 13.4.3, exports map (main cjs / module esm / types), peerDeps `react ^18 \|\| ^19`, deps motion-dom@13.4.2 + motion-utils@13.3.0; `[VERIFIED: runtime require]` all eight APIs are functions; `[VERIFIED: dist/index.d.ts:1058-1070,1216-1257,1306]` useScroll/useTransform/useReducedMotion signatures; `[VERIFIED: dist/es/value/use-scroll.mjs]` container deferral/invariant/window-fallback semantics; `[VERIFIED: dist/es/render/dom/scroll/offsets/offset.mjs]` offset resolution (no container-padding subtraction) |
| `lucide-react@^0.475.0` | Icons for rows/about (ArrowUpRight, Briefcase, MapPin already in use) | `[VERIFIED: package.json:45 + about-section.tsx/projects-section.tsx imports]` — no new icon needed |

Claims about framer-motion v13 behavior NOT verified from the installed package stay `[ASSUMED]` and none are load-bearing: every API the composition needs was read from the installed `.d.ts`/source this session. Registry-level metadata (weekly downloads etc.) was not consulted — irrelevant here since the package is already installed and pinned by package.json.

## 3. Risks and Open Questions

### Risks (ranked)

| Risk | Severity | Mitigation |
|---|---|---|
| `useScroll` container ref hydration → permanent window-scroll mistrack | HIGH (verified failure mode) | Mount-gate the stage on the discovered main element; hand the element as the ref's initial value; never render the stage with a pending container ref. P1. |
| Positional zip breakages (drawer digits, tour bodies) silently shipping wrong accents/copy | HIGH (deterministic) | Both sites enumerated above; UI-SPEC §1.2 resolutions pinned; tests renew. P2. |
| Stale-test blast radius (enumerable, ~5 files) | MEDIUM | §5 inventory; stale-test-triage discipline; atomic renewals per the reflow/arc/editorial diffs. |
| framer motion-values fighting React re-renders (style props re-rendered) | MEDIUM | Constant SSR style props + MotionValues adopt on hydration; React re-renders only the discrete channel (phase-8 contract carried over). |
| 5-marker label crowding on the arc at 768px | LOW-MED | Math verified to fit (~98px arc spacing vs ~30px labels); visual check during execute. |
| Engage-point delta (24px main padding) between framer offsets and the phase-8 rel math | LOW | Continuous mapping absorbs it; U-15 constant is tunable; verify visually. |
| `md:order-first` removal changing grid auto-placement | LOW | The array reorder makes DOM order = visual order; speech order caveat retires (UI-SPEC §8). |
| Education marker/type template key collisions (`entry.company` absent for education) | LOW | Type-aware keys (`institution`); planner detail. |

### Open Questions

**OQ-1: `firstSentence` terminal-period handling — (RESOLVED).** Reading (a) drops the terminal period (`slice(0, idx)`); reading (b) keeps it (`slice(0, idx+1)`), making the period count toward the 120 cap. UI-SPEC §4.2 explicitly states "the sentence's terminal period counts toward 120; no period after `…`", and its E-6 estimates (~123 for Clarif-AI, 236 for DeepIndex) match the with-period counts (122, 234) — **recommend (b)**: keep the terminal period for complete sentences; truncate at a word boundary + `…` only when over 120; no period appended after `…`. The planner pins the exact rule in the pure function's docstring + tests (both readings truncate the same two rows; the difference is only whether the four single-sentence rows end with a period). Verified data: DeepIndex 233/234, Clarif-AI 121/122, others 54–96 — no blocker.

**OQ-2: W-3 gate re-wiring — (RESOLVED).** `explore-panels.tsx:121` switches from `selectTimelineRoles(data.experience).length > 1` to the merged `selectTimelineEntries(...).length > 1` for Experience, plus a mirrored `projects.slice(0, 6).length > 1` gate for the new Projects wrapper (UI-SPEC §3.5/§4.1). Current data: 5 > 1 and 6 > 1 → both sticky ranges live; E-2 (≤1 → natural height) preserved.

**OQ-3: SSR behavior of framer motion-values — (RESOLVED by pattern choice).** Do not depend on framer-motion rendering MotionValue-derived styles server-side; the plan pins constant SSR style props from the pure row-state module at progress 0 (the phase-8 `experience-section.tsx:199-213` idiom), and the motion channel adopts on hydration. Static-export HTML therefore satisfies §4.4/E-11 deterministically.

**OQ-4: `positioning` storage shape — (RESOLVED).** `string[]` with exactly 2 entries per U-7 (rendered as two block spans, never joined); SPEC quotes the two pinned lines verbatim; the data draft carries them verbatim (UI-SPEC §10).

**OQ-5: Avatar element choice — (RESOLVED).** Plain `<img loading="lazy" decoding="async">`, `rounded-full object-cover h-16 w-16 md:h-20 md:w-20`, `alt="Portrait of {about.name}"`, graceful-hide, no `onError` (keeps AboutSection a server component — U-5/U-12). Rationale verified: `next.config.ts` static export + unoptimized images; tinyurl not in remotePatterns; zero prior `<img>` usage to establish a competing precedent.

**OQ-6: Tour step table under the reorder — (RESOLVED).** `EXPLORE_TOUR_STEPS` becomes an id-keyed literal 6-step table (content order welcome→about→experience→skills→projects→finish, bodies looked up by section id), replacing the positional `EXPLORE_SECTIONS.map` generation (`constants.ts:117-123`). The existing positional-zip test (`tests/explore-tour.test.mjs:73-97`) renews to the pinned content order.

**OQ-7: Drawer digit accents under the reorder — (RESOLVED).** `DIGIT_ACCENTS` (positional array, `explore-drawer.tsx:33-38`) becomes a per-id Record mirroring `ACCENTS`/`EXPLORE_TOUR_ACCENTS` (both already per-id Records — verified `explore-panels.tsx:70-75`, `constants.ts:61-66`). Accents follow the section, not the position.

**OQ-8: Old `selectTimelineRoles` fate — (RESOLVED).** Replaced by the generalized `selectTimelineEntries`; its only consumers (`explore-panels.tsx:61`, `experience-section.tsx:64`) migrate in the same change; the phase-8 role-selection tests renew to the 5-entry contract. Keeping both functions would fork the derivation site — rejected (one-derivation-site rule, `timeline-geometry.ts` header).

**OQ-9: Does the entrance stagger need CSS changes after the reflow — (RESOLVED).** No. The `.panel-grid > *` block targets children positionally (0/40/80/120ms for children 1–4); the reflow keeps 4 grid children and re-derives delays by DOM position. `[VERIFIED: globals.css REV-11 block]`

**OQ-10: BEng education detail line — (RESOLVED).** BEng has no `specialization` (verified JSON lines 139-149) → the detail line omits gracefully (UI-SPEC §3.3 "absent → omit"). No data edit needed or wanted.

**OQ-11: Does the reorder break the visited counter or IO marking — (RESOLVED).** Counter is count-based (`explore-status-bar.tsx:44-49`); IO thresholds are per-panel, section-id-based, height-aware (`use-explore-visited.ts:73-98`, `tour-placement.ts:101-104`) — all order-independent. No change.

**No unresolved Open Questions remain.** Planning can proceed on the UI-SPEC's U-register defaults; the only executor-phase verifications are visual (marker spacing at 768px, U-15 inner height constant), which are pinned as tunable U-values rather than blockers.

## 4. Architectural Responsibility Map

| Capability | Tier | Rationale / home |
|---|---|---|
| Panel ordering, placement classes, index chips, W-3 gates | Presentation (server) | `explore-panels.tsx` + `constants.ts` — pure class wiring over the render tree; no state |
| Drawer items/digits, status-bar counter, IO visited marking, tour step table | Presentation-client (navigation chrome) | `explore-drawer.tsx`, `explore-status-bar.tsx`, `use-explore-visited.ts`, `constants.ts` — order-derivation only; **no new data logic** |
| About package rendering (lead, metrics, chip, avatar, demoted summary, tightened contacts) | Presentation (server) | `about-section.tsx` stays a server component; graceful-hide matrix is server-side conditional rendering — no client boundary |
| Arc entry derivation (merge + sort + type discriminator + start-year parse) | Domain (pure, zero-runtime-import) | `timeline-geometry.ts` — the ONE derivation site; node --testable via type stripping |
| Arc geometry/progress/content-layer math + reduced-motion variants | Domain (pure) — BYTE-UNTOUCHED | `timeline-geometry.ts` existing functions; n-generic already |
| Arc scroll engine (rAF channel, IO/RO cleanup, keyboard scrollTo) | Presentation-client (hand-rolled) — BYTE-UNTOUCHED | `use-timeline-progress.ts`; receives only `entryCount` |
| Arc content templates (role vs education) | Presentation (client, framer-free) | `experience-section.tsx` — template selection by `entry.type`; zero framer-motion (grep gate) |
| Projects row-state math + `firstSentence` split | Domain (pure, framer-free) — NEW | Sibling pure module next to the stage; node --testable (R-12 precedent) |
| Projects editorial scroll (useScroll/useTransform/useReducedMotion + discrete aria channel) | Presentation-client (framer-motion) — the ONLY framer import site | New `"use client"` stage component; receives the top-6 slice as props |
| Stat tiles, compact card list, TerminalPointer | Presentation (server) — UNCHANGED | `project-stat-tiles.tsx`, `projects-section.tsx` server body |
| Portfolio data (3 new about fields) | Data | `portfolio-main-data.json` + `.d.ts` same-commit; draft→approve→write gate; other surfaces untouched (additive) |
| Availability text source | Data (verbatim transcription) | `WelcomeMessage.tsx:33,42` — read-only reference; CLI file itself is NOT edited |

Security-sensitive tiering check: no capability in this phase touches auth, storage, or network egress; the only external surface is the avatar `<img>` URL (user-owned, https) rendered in the presentation tier — correctly NOT in an integration tier. No BLOCKER.

## 5. Validation Architecture

Automated checks proving each behaviour (the repo's suite is `node --test tests/*.mjs` per file — Node 24 type stripping imports the pure `.ts` modules directly; there is no `npm test` script; CI runs `npm run build` only, `[VERIFIED: .github/workflows/deploy.yml:60]`):

| Behaviour | Check |
|---|---|
| Grid order + placement | grep/assert: `EXPLORE_SECTIONS` id order `[about, skills, experience, projects]`; zero `md:order-first` matches in `explore-panels.tsx`; Projects wrapper carries `md:col-span-2 md:h-[300vh]` + sticky shell recipe; wrapper has no id. (Renew `explore-sweep.test.mjs:51-107`, `explore-shell.test.mjs:244-347`.) |
| Tour re-mapping | Renew `explore-tour.test.mjs:68-98`: id-keyed table, 6 steps, CONTENT order welcome→about→experience→skills→projects→finish, sectionId targets by id, bodies id-keyed (Skills keeps "Roles in order…" body? — no: bodies stay paired to their OWN section; assert each body string against its section). |
| Drawer re-mapping | Per-id digit accents (4 assertions), item order = new DOM order, 44px targets intact. |
| Counter | Count-based, order-independent — assert derivation from `EXPLORE_SECTIONS.length` (existing pattern). |
| Arc derivation | Renew `explore-timeline.test.mjs`: `selectTimelineEntries` on the real JSON → exactly 5 entries in year order [2012, 2019, 2021, 2022, 2023] with types [education, role, education, role, role]; null-year edge → stable placement; type-aware template field mapping (degree/institution/specialization vs title/company/bullets); W-4 predicate over the two real education durations. |
| Arc engine untouched | grep: zero framer-motion imports under `src/components/explore/sections/experience*` AND `use-timeline-progress.ts` byte-identical (or at minimum zero framer imports — the plan should pin "no edits to use-timeline-progress.ts" as a checked invariant). |
| Row math + firstSentence | NEW pure-module tests: `firstSentence` split/truncate/no-period cases with the REAL data strings (DeepIndex 234→120+…, Clarif-AI 122→120+…, SDK4ED-TD whole); `rowState` coexistence window (two rows simultaneously in [0,1) opacity band), monotonicity, RM y≡0, clamp behavior, H-fallback. |
| About package | Data-integrity additions: the 3 new fields exist with the approved values (verbatim vs WelcomeMessage/SPEC quotes); `.d.ts` typing greps; AboutSection source greps for graceful-hide branches, demoted summary classes, 44px contacts, `alt` on the avatar, `loading="lazy"`. |
| framer isolation | grep: `framer-motion` imports ONLY in the projects stage files; zero new deps in package.json. |
| Gates | `npm run build` (CI gate) + `npm run typecheck` + full `node --test tests/` green on the final tree; static export emits `out/explore.html`; 375px invariant greps (every new placement utility `md:`-scoped; no new overflow utilities on the sticky chain); 44px floors unchanged. |

Red/green discipline: new pure-module tests go red-first before their implementations (house precedent in every phase SUMMARY).

## 6. Project Constraints (from project conventions, verified this session)

- **Static export:** `output: 'export'`, `images.unoptimized: true` (`next.config.ts:5,11-12`); all routes export statically; no server APIs.
- **Server/client split:** panels are server components; the explore shell (`explore-shell.tsx:1`) and the experience stage are the client boundaries; new framer stage adds one more `"use client"` file (precedent: `experience-section.tsx:1`).
- **Single scroll source:** `.explore-shell > main` — never window (`use-timeline-progress.ts:104`); no wheel/touch listeners anywhere (D-05); no wheel hijacking (SPEC).
- **Pure-module contract:** derivation modules carry zero runtime imports and erasable-TS-only syntax so `node --test` loads them via Node 24 type stripping (`timeline-geometry.ts:15-20`, `viz-data.ts:14-18`).
- **Motion rails:** the `.explore-shell` reduced-motion guard is the single CSS suppressor (`globals.css` @media block, verified); per-frame-written properties never carry CSS transitions; the closed phase-7/8 CSS vocabulary (`exp-lift`, `exp-nudge`, `transition-colors 200ms`, entrance stagger) is unchanged and zero new globals.css declarations are planned for About.
- **Chrome pins:** PanelShell byte-identical; IDE tokens (`bg-card/border/muted-foreground/chart-1..4/accent`) + JetBrains Mono; 44px targets; 375px invariant; `ring recipe` focus styles.
- **Data discipline:** draft→approve→write for personal copy (phase-6 APPROVAL-BOX precedent); `.d.ts` types same-commit as JSON (R-7); nothing deleted (full lists stay CLI-reachable); no invented copy — graceful-hide everywhere.
- **Verification culture:** grep-verifiable acceptance hooks; stale tests are renewed to the new contract (never deleted wholesale); commits atomic per task.
- **User's green-gate standing rule:** the full gate (build + typecheck + suite) must chronologically cover the final workspace state before completion is declared — plan the verification step last, after every artefact write.

---

**Provenance summary:** every in-repo claim carries a `[VERIFIED: path(:line)]` from this session's reads/greps/computations; framer-motion claims carry node_modules file-level verification; `[CITED]` unused (no web sources were needed — the installed package's own source and types are the authoritative artifact); `[ASSUMED]` used only where explicitly marked. The three corrigenda found against UI-SPEC v1.0 (Clarif-AI first-sentence 121/122 vs "~123"; DeepIndex 233/234 vs "236"; education durations confirmed 24/30 chars exactly as §3.1 states) are example-number precision only and change no contract.