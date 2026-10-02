---
phase: 04-explore-gamification
plan: 01
type: execute
wave: 1
depends_on: []
files_modified: [src/components/explore/constants.ts, src/components/explore/tour-placement.ts, src/components/explore/use-explore-visited.ts, tests/explore-tour.test.mjs]
autonomous: true
requirements: ["EXPLORE-04", "EXPLORE-04c"]
user_setup: []
must_haves:
  truths:
    - "placeCard() resolves EVERY (panelRect-or-null, cardSize, viewport) input to exactly one deterministic mode — below / above / dock / center — per UI-SPEC §3 with the R-10 visibility-bounds amendment: viewport-intersection gate FIRST (panelRect.bottom ≤ 0 OR panelRect.top ≥ viewport.height → dock — a rect with no vertical viewport overlap has no on-screen anchor), then below (top = panelRect.bottom + 12, valid when top ≥ 0 AND top + cardH ≤ vh − 16), then above (top = panelRect.top − 12 − cardH, valid when top ≥ 8 AND top + cardH ≤ vh − 16), else dock (left 16, top vh − 16 − cardH, width vw − 32); no-target steps dock at <640 and center at ≥640; targeted width = min(384, panelRect.width) clamped to 16px gutters — a panel fully above the viewport (bottom ≤ 0) and a panel fully below the viewport (top ≥ vh) BOTH dock, and every resolved below/above card sits fully on-screen: the card is never off-screen at any input (D-03, UI-SPEC §3/§12.3 as amended by R-10)"
    - "visitThreshold(panelHeight, rootHalfVisible) = max(0.05, min(0.5, rootHalfVisible / panelHeight)) — the R-2 amendment that lets a panel taller than 2× the visible root still mark visited at ~50%-of-visible-root coverage instead of never (UI-SPEC §5 as amended)"
    - "parseVisitedIds(raw, valid) returns [] on null / garbage / non-array JSON, filters ids to valid EXPLORE_SECTIONS ids, dedupes preserving first-occurrence order, and serializeVisitedIds writes a JSON string array — E-8 garbage-input contract locked by table tests (UI-SPEC §7/§11 E-8)"
    - "Both explore-scoped storage keys exist and are disjoint from every CLI key: EXPLORE_TOUR_STORAGE_KEY = \"portfolio-explore-tour\" (D-05), EXPLORE_VISITED_STORAGE_KEY = \"portfolio-explore-visited\" (D-06) — grep-level never 'portfolio-theme' / 'portfolioCliFoundEasterEggs' (UI-SPEC §12.1)"
    - "EXPLORE_TOUR_STEPS is the locked 7-entry table welcome → about → experience → skills → projects → contact → finish (D-02): content steps carry sectionIds in EXPLORE_SECTIONS order with headings derived from its labels, per-step §4 chrome copy, and §9 announce strings; no copy string contains digits beyond the allowed '60' (UI-SPEC §4/§12.2/§12.4)"
    - "useExploreVisited initializes to a LITERAL empty array, syncs from localStorage in a one-shot after-mount effect (never read during render — R-5 hydration contract), marks via IntersectionObserver with root = '.explore-shell > main' and per-panel visitThreshold values, dedupes, and writes ONLY through guarded try/catch inside this one data-tier file (§5/§12.11)"
    - "readTourFlag returns any non-null stored value (garbage included — E-8 suppression semantics) and writeTourFlag never downgrades 'completed' to 'seen'; every localStorage CALL for the two tour/visited keys is confined to use-explore-visited.ts (tier map, D-05/D-06) — the pre-existing theme write at use-explore-theme.ts:43 is outside the tour tier and byte-untouched (D-08)"
  artifacts:
    - path: src/components/explore/constants.ts
      provides: "Augmented locked-chrome module (stays plain import-free TS so node --test imports it directly): tour storage keys, EXPLORE_TOUR_ACCENTS (bg-chart-1..5 map duplicating explore-panels.tsx ACCENTS because that file is byte-untouched), TourStep type + EXPLORE_TOUR_STEPS (7 entries, §4 copy) + EXPLORE_TOUR_FINISH (D-04 link constants)"
      min_lines: 100
      exports: ["EXPLORE_TOUR_STORAGE_KEY", "EXPLORE_VISITED_STORAGE_KEY", "EXPLORE_TOUR_ACCENTS", "TourStep", "EXPLORE_TOUR_STEPS", "EXPLORE_TOUR_FINISH"]
    - path: src/components/explore/tour-placement.ts
      provides: "The phase's ONE import-free pure decision module (erasable TS only, OQ-5): placeCard (intersection-gated below/above/dock/center table per R-10), visitThreshold (R-2 formula), parseVisitedIds + serializeVisitedIds (E-8) — zero runtime imports so Node 24 type stripping imports it under node --test"
      min_lines: 130
      exports: ["placeCard", "visitThreshold", "parseVisitedIds", "serializeVisitedIds", "TourCardPlacement", "TourRect"]
    - path: src/components/explore/use-explore-visited.ts
      provides: "'use client' data tier: useExploreVisited hook (literal init, after-mount sync, per-panel IO marking rooted at the explore <main>, dedupe, guarded writes) + readTourFlag/writeTourFlag; the ONLY file in the phase allowed to touch localStorage for the two tour keys (RESEARCH §5 tier map, §12.11)"
      min_lines: 110
      exports: ["useExploreVisited", "readTourFlag", "writeTourFlag"]
    - path: tests/explore-tour.test.mjs
      provides: "Layer-1 unit + source-invariant suite for the tour domain/data tier under the house node --test harness with direct .ts imports (OQ-5); extended by plan 02"
      min_lines: 220
  key_links:
    - from: tests/explore-tour.test.mjs
      to: src/components/explore/tour-placement.ts
      via: "direct .ts import of the import-free pure module under node --test (OQ-5 experiment verified on Node v24.16.0)"
      pattern: "tour-placement.ts"
    - from: src/components/explore/use-explore-visited.ts
      to: src/components/explore/constants.ts
      via: "both storage keys + the valid-id source imported from constants so key disjointness is greppable in one place (D-05/D-06)"
      pattern: "EXPLORE_VISITED_STORAGE_KEY|EXPLORE_TOUR_STORAGE_KEY"
    - from: src/components/explore/tour-placement.ts
      to: src/components/explore/constants.ts
      via: "type-only ExploreSectionId import for parseVisitedIds' signature — erased at runtime under node --test, resolved by tsc (OQ-5)"
      pattern: "import type.*constants"
---

<objective>
Deliver the tour's domain + data tier as pure, unit-tested modules before any component exists: the locked constants spine (storage keys, 7-step table with pinned chrome copy, accent map, finish-card constants), the import-free decision module (placeCard placement table, R-2 height-aware visit threshold, visited-id parse/serialize), and the useExploreVisited data hook (visited state + IO marking + guarded storage + tour-flag accessors). This is everything EXPLORE-04c needs at the data layer (D-06) and the entire contract plan 02's UI consumes — per the RESEARCH §5 tier map, storage access lives ONLY here, which is what makes the D-05/D-06 CLI-key-disjointness invariant mechanically greppable.
</objective>

<assumption_delta_decision>
Noun now primary: the single spotlight tour wizard (one overlay, one 7-step table, one trigger pair) as the phase's one gamification representation.
Decision: no-change — the detected pluralization signals are false positives: "fallback" names the 375px bottom-dock MODE of the same summary card (D-03), "alternative" is the Compass icon choice inside Claude's discretion, "second" is the 60-second welcome framing. This phase adds one tour on one surface and explicitly DROPS the sibling systems (spin-the-wheel, achievements, milestone toasts — user-dropped per SPEC interview log), so there is no general representation to promote and no variant set to enumerate. No accepted debt.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-04-explore-gamification/EXPLORE-04-explore-gamification-CONTEXT.md — locked decisions D-01…D-06, D-08; every D-NN cited below is binding; deferred ideas (spin-the-wheel, achievements, toasts, CLI prefill, GA) must NOT appear
@.planning/phases/EXPLORE-04-explore-gamification/EXPLORE-04-explore-gamification-UI-SPEC.md — §3 (placement table + edge rule, as amended by R-10 below), §4 (pinned copy), §5 (counter + IO + R-2 threshold as amended), §7 (keys/persistence), §11 E-7/E-8, §12 (verification hooks 1-4, 11)
@.planning/phases/EXPLORE-04-explore-gamification/EXPLORE-04-explore-gamification-RESEARCH.md — §1.5 IO facts, §3 R-2 (threshold conflict + fix), OQ-3 (IO-only marking), OQ-5 (pure-TS-under-node-test), OQ-6 (which existing tests change), §5 architecture responsibility map, §6 validation architecture
@src/components/explore/constants.ts — the file being augmented; MUST stay plain import-free TS (importable from server components per its own doc comment)
@src/components/explore/use-explore-theme.ts — the storage/hydration precedent to mirror: literal init, one-shot after-mount sync, guarded try/catch writes; ALSO the pre-existing localStorage site at :43 (theme persistence) that stays byte-untouched (D-08) and outside the tour tier
@src/components/explore/explore-shell.tsx — the <main> scroll container ('.explore-shell > main') the IO root targets
@src/components/cli/constants.ts — CLI keys ('portfolio-theme', 'portfolioCliFoundEasterEggs') that must stay disjoint and untouched
@tests/explore-shell.test.mjs — node --test conventions to mirror (assert/strict, root-relative read helper, disjointness grep pattern at :33-36)
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — tour constants spine + harness proof (constants → node --test)</name>
    <files>src/components/explore/constants.ts, tests/explore-tour.test.mjs</files>
    <read_first>src/components/explore/constants.ts (full), src/components/explore/use-explore-theme.ts (hydration contract), UI-SPEC §4 (pinned copy table) + §7 (keys) + §9 (announce strings) + §12 items 1/2/4, RESEARCH §6 items 1-4 (suite conventions), src/components/cli/constants.ts lines 60-70 (CLI keys for the disjointness greps)</read_first>
    <action>
      Red/green ordering (session discipline, applies to every task in this plan): write the new suites in tests/explore-tour.test.mjs FIRST and run `node --test tests/explore-tour.test.mjs` — observe it FAIL on the missing constant exports (on-record RED). Only then implement the constants additions and rerun to green.

      Create tests/explore-tour.test.mjs mirroring tests/explore-shell.test.mjs conventions: node:test + node:assert/strict, root-relative read() helper via dirname(fileURLToPath(import.meta.url)). Header doc-comment: Layer-1 tour suite; runner `node --test tests/explore-tour.test.mjs` (no npm test script — run directly); CI runs Node 20 and never runs tests while type stripping needs Node ≥23.6 (OQ-5), so the suite is local-only; import constants with the explicit extension: `import { ... } from '../src/components/explore/constants.ts'`. Header also records the phase's red-first discipline: every suite here was observed RED before its implementation landed.

      Then augment src/components/explore/constants.ts (stays a plain, import-free TS module — no "use client", no imports):
      - export const EXPLORE_TOUR_STORAGE_KEY = "portfolio-explore-tour"; with a doc comment citing D-05 and the disjointness requirement against the CLI keys (src/components/cli/constants.ts:64-67).
      - export const EXPLORE_VISITED_STORAGE_KEY = "portfolio-explore-visited"; with a doc comment citing D-06 (JSON array of visited section ids).
      - export const EXPLORE_TOUR_ACCENTS: Record<ExploreSectionId, string> = { about: 'bg-chart-1', experience: 'bg-chart-2', skills: 'bg-chart-3', projects: 'bg-chart-4', contact: 'bg-chart-5' } — same values as the module-private ACCENTS in explore-panels.tsx:37-43 (UI-SPEC §4 chip map), duplicated because that file is byte-untouched (D-08).
      - export type TourStep = { id: 'welcome' | 'about' | 'experience' | 'skills' | 'projects' | 'contact' | 'finish'; sectionId: ExploreSectionId | null; heading: string; announce: string; body: string }.
      - export const EXPLORE_TOUR_STEPS: readonly TourStep[] = the locked 7-entry table per D-02 order — welcome {sectionId: null, heading: 'explore --tour', announce: 'welcome', body: 'A 60-second lap of the five sections — Next and Back at your own pace, ESC whenever you\'re done. No timers.'}; then content steps in EXPLORE_SECTIONS order with heading AND announce derived from the matching EXPLORE_SECTIONS entry (never duplicated literals) and the §4 bodies verbatim: about 'The short version of who\'s typing — bio, role, and location.'; experience 'Roles in order, with the career-span chart on top for the shape of it.'; skills 'Skills by category, then the treemap of what the actual work proves — full inventory below.'; projects 'Stat tiles up top, six projects underneath.'; contact 'The part where you say hi back — resume export and every channel, exactly as listed.'; finish {sectionId: null, heading: 'tour complete', announce: 'tour complete', body: the §4 congrats string from EXPLORE_TOUR_FINISH.congrats}. Zero invented portfolio facts (SPEC constraint; UI-SPEC §4).
      - export const EXPLORE_TOUR_FINISH = { congrats: 'That\'s the lap — every section\'s marked visited on the counter below.', linkLabel: 'Open the terminal →', linkHref: '/', hint: 'the full story lives in the terminal — start with help' } with a doc comment citing D-04 (the ONLY cross-surface pointer in this phase).

      Suites to write (RED first): (1) keys — exact string values, both start with the 'portfolio-explore-' prefix, and a disjointness guard asserting constants.ts contains NO assignment of 'portfolio-theme' or 'portfolioCliFoundEasterEggs' (grep-level, mirroring tests/explore-shell.test.mjs:33-36); (2) step table — EXPLORE_TOUR_STEPS.length === 7, id sequence exactly ['welcome','about','experience','skills','projects','contact','finish'], content steps' sectionId equal EXPLORE_SECTIONS[i−1].id in order, content headings === EXPLORE_SECTIONS labels, welcome/finish carry sectionId null; (3) copy guard — collect every heading/body/announce/linkLabel/hint/congrats string and assert the only digit occurring anywhere is '60' (§12.4).
    </action>
    <verify>node --test tests/explore-tour.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/explore-tour.test.mjs` exits 0 with all suites passing (and the earlier RED run for the missing exports is on record)
      - grep "portfolio-explore-tour" and "portfolio-explore-visited" each hit src/components/explore/constants.ts exactly once
      - constants.ts contains no occurrence of "portfolio-theme" or "portfolioCliFoundEasterEggs"
      - the step-table test asserts length 7 and the exact id sequence
      - constants.ts still has zero `import ` lines (stays import-free; grep "^import " returns no matches)
    </acceptance_criteria>
    <done>The tracer is green: the constants spine (keys + locked 7-step table + §4 copy) is proven under the house node --test harness before any component consumes it.</done>
  </task>

  <task type="auto">
    <name>Task 2: tour-placement.ts — placeCard table (R-10 visibility bounds) + visitThreshold (R-2) + visited-id parsing, table-tested</name>
    <files>src/components/explore/tour-placement.ts, tests/explore-tour.test.mjs</files>
    <read_first>UI-SPEC §3 (placement table + placement edge rule, read WITH the R-10 amendment below) + §5 (R-2 threshold as amended) + §11 E-8 + §12 item 3, RESEARCH §3 R-2 and OQ-5 (import-free requirement + Node type-stripping experiment), tests/explore-tour.test.mjs (extend, do not rewrite)</read_first>
    <action>
      Red/green ordering: append suites 4-6 to tests/explore-tour.test.mjs FIRST (importing `../src/components/explore/tour-placement.ts` with the explicit extension), run `node --test tests/explore-tour.test.mjs` → observe RED on the missing module; then implement the module and rerun to green.

      Create src/components/explore/tour-placement.ts. Header doc-comment: pure decision module for the explore tour — the ONLY placement/threshold/visited-parse site under src/components/explore/; ZERO runtime imports so Node 24 type stripping imports it directly under node --test (OQ-5: erasable TS syntax only — annotations/interfaces/type aliases, no enums/namespaces/parameter properties); the sole import line is the type-only `import type { ExploreSectionId } from './constants'`.

      Export type TourRect = { left: number; top: number; width: number; height: number } and export type TourCardPlacement = { mode: 'below' | 'above' | 'dock' | 'center'; top: number; left: number; width: number }. Export function placeCard(input: { panelRect: TourRect | null; cardSize: { width: number; height: number }; viewport: { width: number; height: number } }): TourCardPlacement implementing the UI-SPEC §3 table WITH the R-10 visibility-bounds amendment (per D-03). R-10 (recorded amendment, plan-checker blocker fix): the pinned §3 rows alone — below valid iff top + cardH ≤ vh − 16, above valid iff top ≥ 8 — admit off-screen placements for panels scrolled fully off-viewport (a fully-above panel with bottom ∈ (−12, 0) resolves `below` at a small top; a fully-below panel resolves `above` past the bottom edge), contradicting §3's own edge rule 'deterministic, never off-screen'. R-10 completes the pinned table with an intersection gate + explicit on-screen bounds; it changes NO behavior for any panel that intersects the viewport:
      - Viewport-intersection gate FIRST: if panelRect.bottom ≤ 0 OR panelRect.top ≥ viewport.height — the rect has no vertical overlap with the viewport — return dock immediately (there is no on-screen anchor to attach to; this gate is what makes both off-viewport rows resolve dock deterministically).
      - Targeted steps that pass the gate: width = Math.min(384, panelRect.width); left = panelRect.left clamped into [16, viewport.width − 16 − width]; below first: top = panelRect.bottom + 12, valid when top ≥ 0 AND top + cardSize.height ≤ viewport.height − 16; else above: top = panelRect.top − 12 − cardSize.height, valid when top ≥ 8 AND top + cardSize.height ≤ viewport.height − 16 (the added bottom bound rejects near-bottom sliver panels whose above-card would cross the viewport's bottom margin); else dock: left 16, top = viewport.height − 16 − cardSize.height, width = viewport.width − 32. Keep BOTH explicit bounds on each branch even though the gate already removed the fully-off-viewport cases — they are the card-fully-on-screen guarantee for intersecting rects (card top within [0|8, …], card bottom ≤ vh − 16) and must not be 'simplified' away. No header exclusion zone on above (the card may paint over the dimmed header — §3 pin).
      - panelRect null (welcome/finish no-target): viewport.width < 640 → dock; else center with width 384, left = (viewport.width − width) / 2, top = (viewport.height − cardSize.height) / 2.
      - The §3 placement edge rule, now exact: a panel scrolled off-viewport keeps its rect and hits the intersection gate → docks deterministically (never off-screen); an intersecting panel resolves below/above ONLY when the bounded card fits fully on-screen, else docks. Never throws; no DOM access (callers convert DOMRects to plain rects).

      Export function visitThreshold(panelHeight: number, rootHalfVisible: number): number = Math.max(0.05, Math.min(0.5, rootHalfVisible / panelHeight)) — the R-2 height-aware threshold (doc comment cites the UI-SPEC §5 amendment).

      Export function parseVisitedIds(raw: string | null, valid: readonly string[]): string[] — null/''/garbage/non-array JSON.parse failures → []; filter entries to `valid`; dedupe preserving first-occurrence order (E-8). Export function serializeVisitedIds(ids: readonly string[]): string = JSON.stringify of the deduped array.

      Table tests (RED first, then green): §12.3 rows — below-fits; below-overflow→above; above-overflow→dock; no-target dock at a 375-wide viewport; no-target center at a 1280-wide viewport; width clamp min(384, panelWidth); 16px gutter clamp on the left edge; R-10 off-viewport rows — 'placeCard: panel fully above the viewport (bottom ≤ 0) docks' (use a rect with bottom between −12 and 0, e.g. bottom = −5, the exact trap the gate closes) and 'placeCard: panel fully below the viewport (top ≥ vh) docks' (e.g. top = vh + 50), each asserting mode 'dock'; plus visitThreshold rows (short panel → exactly 0.5; tall panel > 2× rootHalfVisible → ratio below 0.5; 0.05 floor) and parseVisitedIds rows (null → [], 'garbage' → [], non-array JSON → [], invalid ids filtered, duplicates deduped, order preserved, valid round-trips through serializeVisitedIds).
    </action>
    <verify>node --test tests/explore-tour.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/explore-tour.test.mjs` exits 0 with suites 4-6 green, including the two R-10 off-viewport rows
      - grep "fully above the viewport" and "fully below the viewport" each hit tests/explore-tour.test.mjs (the two R-10 rows exist as named tests asserting mode 'dock')
      - grep "export function placeCard", "export function visitThreshold", "export function parseVisitedIds", "export function serializeVisitedIds" each hit src/components/explore/tour-placement.ts
      - the ONLY import line in tour-placement.ts is an `import type` from './constants' (grep "^import " returns exactly one match, matching "import type")
      - the test file asserts the dock width equals viewport.width − 32 and the targeted width equals min(384, panelRect.width) for at least one row each
    </acceptance_criteria>
    <done>The placement/threshold/parse decisions are locked by table tests — including the R-10 off-viewport dock rows — and plan 02 consumes placeCard as the single card-positioning authority (D-03).</done>
  </task>

  <task type="auto">
    <name>Task 3: use-explore-visited.ts — visited hook + tour-flag accessors, storage confined to one file</name>
    <files>src/components/explore/use-explore-visited.ts, tests/explore-tour.test.mjs</files>
    <read_first>src/components/explore/use-explore-theme.ts (the hydration + guarded-write precedent to mirror; note its pre-existing :43 localStorage write), src/components/explore/explore-shell.tsx (the '.explore-shell > main' selector target), UI-SPEC §5 (IO path as amended) + §7 (persistence) + §11 E-7/E-8, RESEARCH §1.5 + §5 (tier map: ALL tour/visited storage access in this module) + §6 item 11, src/components/explore/constants.ts (plan-01 exports)</read_first>
    <action>
      Red/green ordering: append the source-invariant suite (suite 7) to tests/explore-tour.test.mjs FIRST — asserting the file exists, carries "use client", exports useExploreVisited/readTourFlag/writeTourFlag, contains EXPLORE_VISITED_STORAGE_KEY and EXPLORE_TOUR_STORAGE_KEY, contains guarded 'try {'/'catch' storage writes, and contains NO 'portfolio-theme' / 'portfolioCliFoundEasterEggs' — run `node --test tests/explore-tour.test.mjs` → RED on the missing file; then implement and rerun to green.

      Create src/components/explore/use-explore-visited.ts with a "use client" directive. Header doc-comment: the data tier of the explore tour — the ONLY module in the phase allowed to touch localStorage for EXPLORE_TOUR_STORAGE_KEY / EXPLORE_VISITED_STORAGE_KEY (RESEARCH §5 tier map); keys stay disjoint from the CLI keys (D-05/D-06); private mode keeps everything per-session via guarded access (E-7).

      export function useExploreVisited(): { visitedIds: ExploreSectionId[]; visitedCount: number; markVisited: (id: ExploreSectionId) => void } per D-06 and the hydration contract (mirror use-explore-theme.ts:27-37):
      - useState<ExploreSectionId[]>([]) LITERAL init — never read localStorage during render (R-5).
      - One-shot after-mount effect: read localStorage.getItem(EXPLORE_VISITED_STORAGE_KEY) inside try/catch (null on failure) and setVisited(parseVisitedIds(raw, valid ids from EXPLORE_SECTIONS)).
      - markVisited: useCallback — if the id is already present return unchanged (dedupe makes IO + wizard + drawer double-marking harmless, §5(c)); otherwise append and write guarded try { localStorage.setItem(EXPLORE_VISITED_STORAGE_KEY, serializeVisitedIds(next)) } catch {} (E-7).
      - IO mount effect: main = document.querySelector('.explore-shell > main'); if null return (no-JS/private safe); for each EXPLORE_SECTIONS id resolve document.getElementById(id), skip nulls; create ONE IntersectionObserver PER PANEL (IO applies a single threshold list to all targets, so per-target thresholds require per-panel observers — UI-SPEC §5 as amended) with { root: main, threshold: [visitThreshold(el.offsetHeight, main.clientHeight * 0.5)] } (R-2); the callback marks when entry.isIntersecting && entry.intersectionRatio >= threshold; observers are created once and never re-created (§5(b)), and ALL are disconnected on cleanup. Drawer anchors, manual scroll, and wizard scrollIntoView all arrive through this one path — no drawer edit, no duplicate marking path (OQ-3, D-06).
      - Return visitedCount = visitedIds.length.

      export function readTourFlag(): 'seen' | 'completed' | null — guarded try { localStorage.getItem(EXPLORE_TOUR_STORAGE_KEY) } catch { null }; return ANY non-null raw value as-is (garbage included) so the auto-open check '!== null' suppresses per E-8.
      export function writeTourFlag(next: 'seen' | 'completed'): void — guarded write, and NEVER downgrade 'completed': if (readTourFlag() === 'completed') return before writing (D-04/D-05: a post-completion dismissal must not erase the completed flag).

      Suite 7 (green check): the source invariants listed above, plus the KEY-SCOPED confinement invariant (D-05/D-06, RESEARCH §5 tier map): among src/components/explore/*.ts(x), the strings 'EXPLORE_TOUR_STORAGE_KEY' and 'EXPLORE_VISITED_STORAGE_KEY' appear ONLY in constants.ts (definition site) and use-explore-visited.ts (every localStorage CALL for those keys); constants.ts itself stays storage-free (it contains the key string constants but NO 'localStorage' call). Do NOT assert 'localStorage' is absent from the whole directory: use-explore-theme.ts:43 carries the PRE-EXISTING theme-persistence write, byte-untouched this phase (D-08) and outside the tour tier.
    </action>
    <verify>node --test tests/explore-tour.test.mjs && npm run typecheck</verify>
    <acceptance_criteria>
      - `node --test tests/explore-tour.test.mjs` exits 0 and `npm run typecheck` exits 0
      - grep "use client" hits the first line of use-explore-visited.ts; "readTourFlag" and "writeTourFlag" are exported
      - the file contains "try {" and "catch" for every localStorage write (E-7) and never contains "portfolio-theme" or "portfolioCliFoundEasterEggs"
      - grep -rl "EXPLORE_TOUR_STORAGE_KEY\|EXPLORE_VISITED_STORAGE_KEY" src/components/explore/ matches EXACTLY constants.ts and use-explore-visited.ts, with every localStorage CALL for those keys confined to use-explore-visited.ts (tour/visited tier confinement)
      - grep -rl "localStorage" src/components/explore/ matches exactly [use-explore-visited.ts, use-explore-theme.ts] — use-explore-theme.ts:43 is the pre-existing theme write, whitelisted (D-08, byte-untouched); no other file in the directory matches
      - the IO effect source contains ".explore-shell > main" and "visitThreshold" (R-2 wiring present at source level)
    </acceptance_criteria>
    <done>The data tier is complete and confined: plan 02 consumes useExploreVisited / readTourFlag / writeTourFlag / placeCard / EXPLORE_TOUR_STEPS without touching tour/visited storage or placement math anywhere else (EXPLORE-04c data layer done per D-06).</done>
  </task>
</tasks>