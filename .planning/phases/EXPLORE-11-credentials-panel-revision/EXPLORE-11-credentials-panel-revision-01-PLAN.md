---
phase: 11-credentials-panel-revision
plan: 01
type: tdd
wave: 1
depends_on: []
files_modified:
  - "tests/credentials-panel.test.mjs"
  - "src/components/explore/constants.ts"
  - "src/data/portfolio-main-data.d.ts"
  - "src/data/portfolio-main-data.json"
  - "src/components/explore/sections/credentials-section.tsx"
  - "src/components/explore/explore-panels.tsx"
  - "src/components/explore/explore-drawer.tsx"
  - "src/app/globals.css"
autonomous: true
requirements: ["REV-21"]
gap_closure: false
user_setup: []
must_haves:
  truths:
    - "The new Credentials acceptance suite fails BEFORE any implementation lands (RED), and passes after (GREEN) — the red run is the missing-behaviour proof on record."
    - "A visitor at /explore sees a 'Credentials' panel in row 3 immediately right of the Projects stack at md+, and full-width below the Projects stack at <md — no order-* utility involved."
    - "The panel shows three tabs (Articles | Certifications | Presentations) with Articles selected on load, and the Articles rows are real text in the static export (no JS required)."
    - "The static-export assertions stay inside what SSR actually emits — panel chrome (id, label, the 05 mono index), the three tab labels, the counter and the default Articles rows — because the drawer's closed Sheet and the two inactive tabs are client-only; those contracts are asserted at source/data level instead, and every export row reads the script-stripped document."
    - "The Articles tab lists the 5 featured articles as compact rows carrying title, date and an external link."
    - "The Certifications tab lists the 5 featured certifications with name + date; the ISTQB entry renders its verification ID 'ID: GRTB-24-1S20-CTFL' as plain text on a combined 'date · ID' line and is NOT an anchor, as are the 4 null-link entries."
    - "Supersession of record: SPEC acceptance 'every row an anchor' and CONTEXT D-02 'compact anchor rows' are narrowed FOR THE CERTIFICATIONS TAB by UI-SPEC §5.3/§5.4 — 4 null links + 1 verification ID ⇒ 5 plain-text rows, ZERO anchors; the Articles and Presentations tabs keep real anchors. Recorded in SUMMARY.md so verification reads a deliberate narrowing, not a coverage gap."
    - "The Presentations tab lists the single Allure Reporting presentation with its date and a real external link."
    - "The drawer derives 5 anchors ending in 05 Credentials from the sections constant, and the status bar renders '0/5 sections visited' in the no-JS static export."
    - "Nothing was deleted: articles stay 15, certifications 45, presentations 1, so the full collections remain CLI-reachable."
    - "A tab whose featured list is empty renders exactly one calm non-link row: 'No featured articles.' / 'No featured certifications.' / 'No featured presentations.' — same 44px rhythm, no invented copy."
    - "Every tab trigger and every row meets a 44px-equivalent touch target, and the whole row is the link hit target."
    - "At 375px the Credentials panel is full-width below the Projects stack with no horizontal overflow (the title truncates); both themes stay legible via theme tokens only."
    - "Reduced motion removes the row hover nudge and the panel entrance animation through the pre-existing guard, with no new exception added."
    - "Prohibitions hold: no framer-motion import in any Credentials file, no new dependency, no order-* utility (DOM order = visual order), and no carousel/stack machinery in the panel."
  artifacts:
    - path: "tests/credentials-panel.test.mjs"
      provides: "The phase's acceptance suite: source-level contract rows plus export-level rows limited to the SSR-reachable surface of out/explore.html, asserted on the script-stripped document."
      min_lines: 60
    - path: "src/components/explore/sections/credentials-section.tsx"
      provides: "Client leaf island: 3-tab Credentials panel over featured articles/certifications/presentations, calm anchor rows, empty states, no framer-motion."
      min_lines: 90
      exports: ["CredentialsSection"]
    - path: "src/data/portfolio-main-data.json"
      provides: "The single presentation entry (Allure Reporting) gains featured: true."
    - path: "src/app/globals.css"
      provides: "Entrance-stagger cascade extended to the 5th grid child at 160ms."
  key_links:
    - from: "src/components/explore/constants.ts"
      to: "src/components/explore/explore-panels.tsx"
      via: "EXPLORE_SECTIONS 5th entry drives ACCENTS, SECTION_BODIES and buildPlacement (all total Record<ExploreSectionId> maps)"
      pattern: "credentials:\\s*\\(\\{ data \\}\\) => <CredentialsSection"
    - from: "src/components/explore/constants.ts"
      to: "src/components/explore/explore-drawer.tsx"
      via: "section id -> drawer anchor + per-id digit accent"
      pattern: "credentials: 'text-chart-5'"
    - from: "src/components/explore/sections/credentials-section.tsx"
      to: "src/data/portfolio-main-data.json"
      via: "featured-only filtering from the data prop (EXPLORE-07, no hardcoded copy)"
      pattern: "\\.filter\\(\\(\\w+\\) => \\w+\\.featured\\)"
    - from: "src/app/globals.css"
      to: "src/components/explore/explore-panels.tsx"
      via: ".explore-shell .panel-grid > *:nth-child(5) stagger delay for the new 5th grid child"
      pattern: "nth-child\\(5\\) \\{ animation-delay: 160ms; \\}"
---
<objective>
Deliver the phase-11 tracer test-first: a failing acceptance suite for the Credentials panel on record FIRST (RED), then the thinnest end-to-end slice that turns it green (GREEN) — a typed `featured` flag on the presentations data, the 5-section constants re-map, and a new three-tab panel rendering featured items as calm anchor rows beside the Projects stack in the built static export.

This is the phase's forcing slice. Appending the `credentials` id to `EXPLORE_SECTIONS` widens `ExploreSectionId`, which makes the five total `Record<ExploreSectionId, …>` maps in the tree fail `npm run typecheck` until each is updated — the type system, not a convention, enforces that every derived surface (panels accents, section bodies, placement, drawer digits, tour accents) is re-mapped in the same commit. No grid change is required: the existing `grid-cols-1 md:grid-cols-2` already places the new panel beside Projects (row 3) and below it at <md, per UI-SPEC §2.1 (LAYOUT-01: the ≈60/40 ratio is dropped; the plain 2-column split is the pinned implementation — this supersedes CONTEXT D-01's ratio wording, see the amended D-01).

Every assertion in the new suite must hold under the SSR boundary pinned in <context>: only the default Articles tab body, the panel chrome, the tab labels and the counter reach `out/explore.html`. The closed drawer and the inactive tabs are client-only — and because the RSC payload in the same document also inlines the client island's full props, every export row must read the script-stripped document (see Task 1 item 6).

End state of this plan: the new suite is GREEN and the tree typechecks/builds, but SIX pre-existing suites are EXPECTED-RED — they encode the retired 4-section contract and plan 02 renews them. Do not fix them here. The exact red set, named for the plan-02 handoff: `tests/explore-shell.test.mjs`, `tests/explore-tour.test.mjs`, `tests/explore-sweep.test.mjs`, `tests/explore-visuals.test.mjs` (both its index-span row and its adapter-closure row), `tests/explore-visuals-skills.test.mjs` (its adapter-closure row), and `tests/portfolio-data-integrity.test.mjs` (the `PRE_PRESENTATIONS` ledger fixture no longer deep-equals the data once `featured: true` lands). MERGE HOLD: the branch must not be merged or handed off as green until plan 02's full-suite run is on record.
</objective>

<context>
- `.planning/phases/EXPLORE-11-credentials-panel-revision/EXPLORE-11-credentials-panel-revision-UI-SPEC.md` — §2 layout, §2.3 tabs, §2.4 row anatomy, §3 interaction states, §4.1 motion, §4.2 empty states, §5.3/§5.4 field mapping and link affordance, §6 accessibility, §7 re-map, §8 SSR/no-JS contract (line 231), §9 stale tests, §10 implementation notes. Governing visual/interaction contract.
- `.planning/phases/EXPLORE-11-credentials-panel-revision/EXPLORE-11-credentials-panel-revision-CONTEXT.md` — D-01 grid (ratio superseded by UI-SPEC LAYOUT-01), D-02 tabs+rows (anchor-row wording narrowed for Certifications by UI-SPEC §5.3/§5.4), D-03 featured flag (d.ts same-commit), D-04 re-map, D-05 calm/zero-new-deps/375px/both themes.
- `src/components/explore/sections/about-section.tsx` — the calm row/link vocabulary to reuse verbatim (`exp-nudge`, `min-h-[44px]`, `group-hover:underline`, `focus-visible:ring-2 …`), and its `ROW_CLASS` const at line 90.
- `src/components/explore/panel-shell.tsx` — panel chrome (`id` → `<section id>`, accent dot, label, zero-padded index). The mono index span is the class signature `ml-auto select-none font-mono text-2xl font-medium leading-none tabular-nums text-muted-foreground/50`.
- `src/components/ui/tabs.tsx` — the installed, previously unused shadcn Tabs primitive (Radix).
- `src/components/resume/ResumeCertifications.tsx:20-21` — the existing `data.certifications.filter((cert) => cert.featured)` idiom to mirror.
- The five total maps: `constants.ts:69-74` (`EXPLORE_TOUR_ACCENTS`), `explore-panels.tsx:66-71` (`ACCENTS`), `explore-panels.tsx:83-91` (`SECTION_BODIES`), `explore-panels.tsx:104-119` (`buildPlacement`), `explore-drawer.tsx:38-43` (`DIGIT_ACCENTS`).
- `tests/explore-shell.test.mjs` — the house test style (source `read()` rows + export rows over `out/explore.html`), copy its helper shape. Its export-row helper is the pattern for the `existsSync` guard and the "run `npm run build` first" message.

**Research-artefact note (resolves the plan-review finding that phase 11 ships no `RESEARCH.md`/`VALIDATION.md` while `config.json` sets `workflow.nyquist_validation: true`):** this phase's research coverage IS the measured block below plus the runnable `verify` row on every task — every load-bearing claim in it was re-measured against this working tree at plan time, not inferred, and each is falsifiable by re-running the stated command. That combination is the accepted substitute for this phase; SUMMARY.md must say so (see Task 2).

**SSR / export boundary — verified facts (re-measured against this working tree). Every export row in this plan is cut to this boundary:**
- `src/components/ui/tabs.tsx` re-exports `@radix-ui/react-tabs@1.1.21`, which renders `TabsContent` through `Presence` with `present: forceMount || isSelected` (`node_modules/@radix-ui/react-tabs/dist/index.mjs:163`). With `defaultValue="articles"` and no `forceMount` on any `TabsContent`, ONLY the Articles tab body is server-rendered; Certifications and Presentations bodies exist only after hydration. This matches UI-SPEC §8 line 231.
- `src/components/explore/explore-drawer.tsx:46,52` mounts `Sheet`/`SheetContent` under `useState(false)`; the portal content is `Presence`-gated, so the drawer anchors are absent from `out/explore.html`. Measured on the current 4-section build: `href="#about"` = 0, `href="#skills"` = 0, `href="#experience"` = 0, `href="#projects"` = 0, while `id="about"` = 1 — the `<section id>` landmarks are exported, the anchors are not.
- Consequence: the presentation name (`Boosting Your Team's Clarity with Allure Reporting`), the ISTQB ID (`ID: GRTB-24-1S20-CTFL`) and the drawer anchors are asserted at source/data level, NEVER against the export.
- **RSC payload leakage — why export rows must strip `<script>`:** measured on the current build, `out/explore.html` is 154,737 bytes raw and 87,558 bytes after `html.replace(/<script[\s\S]*?<\/script>/g, '')` (52 script tags). `DeepIndex` is real rendered text and survives the strip, so stripping does not break legitimate rows. But once Task 2 threads the FULL `articles`/`certifications`/`presentations` slices into the `CredentialsSection` client island, the serialized props carry all 15 article names (non-featured included) into the payload, so an unstripped export row asserting an article name would pass on JSON rather than on rendered markup. Stripping is therefore load-bearing. Measured today: `Core Design Patterns` and `Flaky Tests` appear in NEITHER the raw nor the stripped document — they must appear in the stripped document only once the Articles tab body is genuinely server-rendered.
- Reachable export surface for this phase (all on the stripped document): `id="credentials"`, the `Credentials` label, the `PanelShell` mono index span (currently 4 such spans in the export; must become 5, one carrying `>05<`), `0/5 sections visited` (currently `0/4`), the three tab labels, and the default Articles tab's featured rows as real text.
- Mono-index regex caveat (measured): the bare substring `>05<` already occurs ONCE elsewhere in the stripped document at 4 sections, so the index row must match the full `aria-hidden="true" class="ml-auto select-none font-mono …">[0-9]{2}</span>` signature and count 5, never a bare `>05<`.
- Data field names (verified): all three collections expose `name` — there is NO `title` field — plus `date`. `Article.link` is required `string` (`portfolio-main-data.d.ts:36`), `Certification.link` is `string | null` (`:30`), `Presentation.link` is required `string` (`:48`); `interface Presentation` has no `featured` yet. Featured counts: articles 5 of 15, certifications 5 of 45, presentations 1 of 1 (none featured).
- Featured-certification link contract (verified by direct measurement of the JSON, the source of the certification data rows in Task 1): of the 5 featured certifications, **0** have a `link` starting with `http`; exactly **4** have `link === null`; exactly **1** has `link === 'ID: GRTB-24-1S20-CTFL'`. There is no URL-bearing featured certification — the Certifications tab rendering ZERO anchors is the correct, measured outcome, not a regression.
</context>

<tasks>
  <task type="test">
    <name>Task 1: RED — write the Credentials acceptance suite against behaviour that does not exist yet</name>
    <files>tests/credentials-panel.test.mjs</files>
    <read_first>tests/explore-shell.test.mjs (helper shape: read(), the out/explore.html export path, assert style), tests/explore-visuals.test.mjs:765-780 (the exact mono index-span regex to reuse), .planning/phases/EXPLORE-11-credentials-panel-revision/EXPLORE-11-credentials-panel-revision-UI-SPEC.md, src/data/portfolio-main-data.json</read_first>
    <action>
    Create `tests/credentials-panel.test.mjs` (Node built-in runner, zero npm deps, `import { test } from 'node:test'` + `assert`), modelled on `tests/explore-shell.test.mjs`'s two layers: source-level rows that hold against `src/`, and export-level rows that hold against `out/explore.html` (guard export rows with `existsSync` and the "run `npm run build` first" message, exactly as the existing suite does).

    HARD BOUNDARY (from <context>): export-level rows may only assert what SSR actually emits — panel chrome, the tab labels, the counter and the default Articles rows. The closed drawer's anchors and the two inactive tabs' bodies are client-only; asserting them against the export makes the suite unfixable. Their guards belong in the source/data rows below.

    Assert the phase contract, not the implementation's private details:
    1. constants: parse the `EXPLORE_SECTIONS` block and assert the ids deep-equal `['about','skills','experience','projects','credentials']`; assert `label: "Credentials"` (or `label: 'Credentials'` — accept the file's existing quote style); assert `EXPLORE_TOUR_ACCENTS` contains `credentials: "bg-chart-5"`; assert the welcome body contains `five sections` and does NOT contain `four sections`; assert `EXPLORE_TOUR_STEPS` still has exactly 6 entries with ids `welcome → about → experience → skills → projects → finish` (no Credentials step — pinned; assert the array length is 6 and that no step's `sectionId` is `credentials`).
    2. data + type: assert `presentations.length === 1` and `presentations[0].featured === true`; assert articles length 15 and certifications length 45 (nothing deleted); assert `presentations[0].link` starts with `http`; assert the `.d.ts` declares `featured?: boolean` inside `interface Presentation` and still declares `link: string` (required — not loosened). Then add the DATA-level certification contract, asserted against the JSON alone — no HTML involved, because the Certifications tab is client-only (see HARD BOUNDARY). Write it to the MEASURED numbers, which are the opposite of "some cert has a real URL": the featured certifications are exactly 5; **0** of the 5 have a `link` that starts with `http`; exactly **4** have `link === null`; exactly **1** has `link === 'ID: GRTB-24-1S20-CTFL'`. Assert all four counts explicitly (e.g. a `.filter(...).length` per clause) so the row encodes the real contract and cannot be satisfied by a weakened shape. Do NOT assert that any featured certification carries an http link, and do NOT assert rendered certification anchors against the export — UI-SPEC §5.3/§5.4 make those rows plain text by design, and an http-anchor assertion would make Task 2's GREEN unreachable.
    3. panel source: assert `src/components/explore/sections/credentials-section.tsx` exists and contains `"use client"`; imports `Tabs` from `@/components/ui/tabs`; contains `defaultValue="articles"`; contains the three tab labels `Articles`, `Certifications`, `Presentations`; contains `min-h-[44px]`; imports the three lucide icons `FileText`, `Award`, `MonitorPlay`; contains featured filtering (`.filter((…) => ….featured)`); contains the three empty-state strings `No featured articles.`, `No featured certifications.`, `No featured presentations.`; contains an anchor predicate matching `/link\??\.startsWith\(\s*['"]http['"]\s*\)/` used as the ONLY condition under which a row becomes an anchor (so the `ID: GRTB-24-1S20-CTFL` string and the 4 null links can never become `href`s — assert additionally that the anchor branch is URL-guarded, not `href={c.link}` unconditionally); and a `·` separator for the combined `date · ID` line; reads the `name` and `date` fields for the row copy (there is no `title` field in the JSON); and does NOT contain `framer-motion`.
    4. registries and drawer derivation: assert `explore-panels.tsx` contains `credentials: 'bg-chart-5'`, a `credentials: ({ data }) => <CredentialsSection` closure, and an EXACT-SHAPE placement entry — assert the source matches the literal-shape regex `/credentials:\s*\{\s*wrapper:\s*'',\s*shell:\s*'',\s*gate:\s*false\s*\}/` (the single-quoted `about`/`skills` natural-height shape as the file already writes it), AND that the matched credentials placement text carries none of `md:sticky`, `md:h-` or `md:col-span-2` (the Credentials panel is not sticky, unlike `experience`) — this replaces any vague "an entry with an empty wrapper" phrasing; assert `explore-drawer.tsx` contains `credentials: 'text-chart-5'`; assert `explore-drawer.tsx` still derives its href as the template literal `href={\`#${section.id}\`}` and its index as `String(i + 1).padStart(2, '0')` — this is how the 5th anchor becomes `05 Credentials`, and it MUST be asserted at SOURCE level because the closed Sheet never reaches the export; assert `constants.ts` places the `credentials` entry AFTER `projects` in the array (append-only); assert neither `explore-panels.tsx` nor `explore-drawer.tsx` uses an `order-` utility.
    5. css: assert `globals.css` contains `nth-child(5) { animation-delay: 160ms; }` and that the reduced-motion guard still matches `.explore-shell *`.
    6. export rows over `out/explore.html` — ONLY the SSR-reachable surface, and every one of them asserted on the SCRIPT-STRIPPED document. Define ONE helper and use it for all export assertions in this file, e.g. `const html = readExport().replace(/<script[\s\S]*?<\/script>/g, '')`. Stripping is load-bearing, not cosmetic: after Task 2 the RSC payload inlines the client island's full props (all 15 article names, non-featured included), so an unstripped row asserting an article name passes on serialized JSON instead of rendered markup. Measured today: `DeepIndex` is real rendered text and survives the strip (so the strip does not break legitimate rows), while `Core Design Patterns` and `Flaky Tests` appear in NEITHER the raw nor the stripped document. Then assert the stripped document contains `id="credentials"`, the panel label `Credentials`, the three tab labels `Articles`, `Certifications` and `Presentations`, the string `0/5 sections visited`, and the name of at least TWO of the 5 featured articles as rendered text (verified present in the data as quote-free substrings: `Core Design Patterns for Test Automation` and `Flaky Tests Driving You Crazy?`). For the mono index, reuse the exact span regex from `tests/explore-visuals.test.mjs:770-773` (the `aria-hidden="true" class="ml-auto select-none font-mono text-2xl font-medium leading-none tabular-nums text-muted-foreground/50"` signature), assert the match count is 5, and assert one of those spans ends with `>05</span>` — this proves the real `PanelShell` chrome carries the credential index. A bare `>05<` substring is NOT sufficient: it already occurs once elsewhere in the stripped document. Explicitly do NOT assert `href="#credentials"`, the drawer anchors, the name `Allure Reporting`, or `GRTB-24-1S20-CTFL` against the export: those are client-only (see <context>), and rows 2 and 4 above are their guards.

    Then RUN the suite and capture the failure output: it must fail because the behaviour is absent (missing `credentials-section.tsx`, 4-section constants, stale export). Record the raw red output in SUMMARY.md.
    </action>
    <verify>npm run build && node --test tests/credentials-panel.test.mjs; echo "exit=$?"</verify>
    <acceptance_criteria>
      - `node --test tests/credentials-panel.test.mjs` FAILS (non-zero exit) — this is the required RED on record.
      - The failure causes are the absent behaviour (missing panel file, 4-section constants/arrays, `0/4` counter in the export), not a syntax error in the test itself — the run must report assertion/`ENOENT`-class failures.
      - The build is run BEFORE the red run so the export-level failures reflect the missing contract, not a missing `out/`.
      - The certification data rows match the MEASURED contract, not an assumed one. Re-measure independently and confirm the suite encodes the same four numbers: `node -e` over `src/data/portfolio-main-data.json` reports featured=5, http-links=0, null-links=4, ID-string-links=1; `grep -c "startsWith" tests/credentials-panel.test.mjs` shows the http predicate is applied as the anchor guard, and no row asserts a featured certification http link.
      - Every export row reads the stripped document: `grep -c "replace(/<script" tests/credentials-panel.test.mjs` returns at least 1, and no export assertion uses the unstripped `readExport()` value directly.
      - No export-level row references `href="#credentials"`, `Allure Reporting` or `GRTB-24-1S20-CTFL`: `grep -c 'href="#credentials"' tests/credentials-panel.test.mjs` returns 0 and the same string is asserted against `explore-drawer.tsx` source instead.
      - The credentials placement row is falsifiable by literal shape: the suite contains the regex `/credentials:\s*\{\s*wrapper:\s*'',\s*shell:\s*'',\s*gate:\s*false\s*\}/` (or an equivalent exact-literal match on the same four fields) plus the absence checks for `md:sticky` / `md:h-` / `md:col-span-2`.
      - The test file is committed as `test(phase-11): add failing Credentials panel acceptance suite` BEFORE any implementation file is edited.
    </acceptance_criteria>
    <done>A committed, runnable acceptance suite that currently fails for the right reasons, with the red run captured in SUMMARY.md, every export row inside the SSR-reachable surface and read from the script-stripped document, and the certification rows encoding the measured 5/0/4/1 contract rather than an assumed http anchor.</done>
  </task>

  <task type="feat">
    <name>Task 2: GREEN — typed featured flag, 5-section re-map, and the three-tab Credentials panel in row 3</name>
    <files>src/data/portfolio-main-data.d.ts, src/data/portfolio-main-data.json, src/components/explore/constants.ts, src/components/explore/sections/credentials-section.tsx, src/components/explore/explore-panels.tsx, src/components/explore/explore-drawer.tsx, src/app/globals.css</files>
    <read_first>src/data/portfolio-main-data.d.ts (lines 29-52), src/data/portfolio-main-data.json (the presentations array), src/components/explore/constants.ts, src/components/explore/explore-panels.tsx, src/components/explore/explore-drawer.tsx, src/components/explore/panel-shell.tsx, src/components/ui/tabs.tsx, src/components/explore/sections/about-section.tsx, src/app/globals.css (the `.panel-grid` nth-child block ~602-607 and the reduced-motion guard ~647)</read_first>
    <action>
    Implement exactly what the Task 1 suite asserts — nothing more.

    Data + type contract (D-03, R-7 same-commit rule):
    1. `src/data/portfolio-main-data.d.ts`: add `featured?: boolean;` to `interface Presentation` (mirror `Certification` line 33). Keep `link: string` REQUIRED — do not loosen it (TYPE-01).
    2. `src/data/portfolio-main-data.json`: add `"featured": true` to `presentations[0]` ("Boosting Your Team's Clarity with Allure Reporting"). No field renamed or deleted. Note the downstream consequence in SUMMARY.md: `tests/portfolio-data-integrity.test.mjs` runs `assert.deepStrictEqual(data.presentations, PRE_PRESENTATIONS)` against a fixture that has no `featured` key, so that suite goes RED here by design and plan 02 renews the fixture — do not "fix" it in this plan.

    Constants re-map (D-04):
    3. `src/components/explore/constants.ts`: append `{ id: "credentials", label: "Credentials" }` as the 5th `EXPLORE_SECTIONS` entry after `projects`. Read the real array first — it is `[about, skills, experience, projects]` (constants.ts:18-24); the phase-9 DOM order is about, skills, experience, projects, and ONLY an append happens (CONTEXT D-04's "about, experience, skills" phrasing is stale — it describes the pre-phase-9 TOUR order, not the array). In the same edit, renew the now-stale doc comment at `constants.ts:65-67` ("both maps narrowed to the 4 sections by the REV-04 merge (D-05)") to say 5 sections — the map is total over `ExploreSectionId`, so the comment would otherwise contradict the code it documents.
    4. Add `credentials: "bg-chart-5"` to `EXPLORE_TOUR_ACCENTS` (double-quoted object — match the existing quote style).
    5. In the `EXPLORE_TOUR_STEPS` welcome body at constants.ts:130 ("A 60-second lap of the four sections — …") change `four sections` to `five sections` (UI-SPEC §9 TOUR-01: the copy must not lie). Change nothing else in the step table — it stays a literal 6-step, id-keyed table with no Credentials step.

    New panel component:
    6. Create `src/components/explore/sections/credentials-section.tsx` as a `"use client"` leaf island (UI-SPEC §10 — `Tabs` is a client primitive) receiving plain serializable slices typed off `PortfolioData`: `articles`, `certifications`, `presentations`. It must NOT import `framer-motion` (MOTION-01 pins framer-motion to `projects-stack-stage.tsx` only).
    7. Render `Tabs` with `defaultValue="articles"`. This is what makes the Articles rows real text in the static export; do NOT pass `forceMount` to any `TabsContent` — mounting the inactive tabs server-side is out of scope and would change the SSR contract the suite pins. `TabsList` holds three `TabsTrigger`s (`articles`/`certifications`/`presentations`) labelled **Articles | Certifications | Presentations** (locked, UI-SPEC §2.3), each trigger carrying `min-h-[44px]` (A11Y-01), with the existing shadcn `bg-muted p-1` pill retained and a `mb-3` gap below the list.
    8. Build ONE shared row primitive used by all three tabs (a local component/helper — do not write three divergent copies). Row anatomy per UI-SPEC §2.4/§3.2: `group flex min-h-[44px] items-center gap-3 border-b border-border` with the last row dropping `border-b`, plus `hover:bg-muted/40` and the `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background` recipe; left icon in the tab's accent-neutral `text-muted-foreground`, `h-4 w-4 shrink-0`, `aria-hidden="true"`; title `text-sm font-medium text-foreground min-w-0 truncate` gaining `group-hover:text-accent group-hover:underline` and reading the item's `name` field (there is no `title` in the JSON — all three collections use `name`); date `text-xs tabular-nums text-muted-foreground shrink-0` at the right, rendered VERBATIM from the JSON `date` field (no reformatting); a hover/focus-only `ArrowUpRight` (`h-3.5 w-3.5 ml-1`, class `exp-nudge`, `aria-hidden="true"`) placed immediately AFTER the date (ARROW-01).
    9. Per-tab content: Articles → `articles.filter((a) => a.featured)` (real data: 5) with icon `FileText`, real `<a href={link} target="_blank" rel="noopener noreferrer">`; Certifications → `certifications.filter((c) => c.featured)` (real data: 5) with icon `Award`; Presentations → `presentations.filter((p) => p.featured)` (real data: 1) with icon `MonitorPlay`, real external anchor.
    10. Certification link nuance (UI-SPEC §5.3, CERT-ID-01) — load-bearing against the MEASURED data (of the 5 featured certs, **4 have `link: null` and 1 holds the literal `"ID: GRTB-24-1S20-CTFL"`; ZERO have an http URL**): a row is an anchor ONLY when `link` is truthy AND matches `/^https?:/` / starts with `http` — implement it as a single named predicate on `link` so the guard is greppable. Otherwise render NO anchor, no `href`/`target`/`rel`, no external arrow, and show the ID as muted text on one combined secondary line `date · ID` using a `·` separator in `tabular-nums text-muted-foreground` (a `null` link renders the date alone on that line). The Certifications tab legitimately renders ZERO anchors for the current data — do not force anchor semantics onto it, and do not "fix" the data to manufacture a URL.
    11. Empty states (UI-SPEC §4.2, EMPTY-01): when a tab's filtered list is empty, render exactly one non-link row with the same `min-h-[44px]` rhythm, the tab's icon slot present (muted, `aria-hidden`), and the messages `No featured articles.` / `No featured certifications.` / `No featured presentations.` in `text-muted-foreground`. No dash prefix, no invented copy.
    12. Row-omission edge (UI-SPEC §4.2/§5.4): for ARTICLES ONLY, a featured entry whose `link` is missing/empty is omitted from the list entirely (and falls back to the empty state if that empties the tab). Not applied to certifications (plain text instead) or presentations (typed required).
    13. Accessibility: rely on Radix's `role="tablist"/"tab"/"tabpanel"`, `aria-selected` and arrow-key navigation; prefer Radix's implicit `aria-controls`/`aria-labelledby` and do NOT invent duplicate ARIA (UI-SPEC §6). The panel section landmark comes from `PanelShell` (`id="credentials"`, `aria-label="Credentials"`).

    Registry wiring (all five total maps must land in this commit or typecheck fails):
    14. `explore-panels.tsx`: add `credentials: 'bg-chart-5'` to `ACCENTS`; add the `credentials: ({ data }) => <CredentialsSection articles={data.articles} certifications={data.certifications} presentations={data.presentations} />` closure to `SECTION_BODIES`; add `credentials: { wrapper: '', shell: '', gate: false }` to the returned placement Record (natural height, like `about`/`skills` — the Credentials panel is NOT sticky, so no `md:sticky`/`md:h-`/`md:col-span-2` classes); import `CredentialsSection`. Do NOT change the grid classes — `grid panel-grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5` already yields [Projects | Credentials] in row 3 (D-01, as resolved by UI-SPEC §2.1/LAYOUT-01) and stacking at <md. The 5th grid child changes the adapter-closure count and the panel index-span count; six pre-existing suites assert the retired 4-count and go RED here by design (see <objective>).
    15. `explore-drawer.tsx`: add `credentials: 'text-chart-5'` to `DIGIT_ACCENTS`. The anchor row, its `#credentials` href and the padStart index all derive from the array — no other drawer change.
    16. `explore-status-bar.tsx` and `use-explore-visited.ts` are NOT touched — both derive from `EXPLORE_SECTIONS` and pick up the 5th section automatically (`N/5`, and the IO observes `#credentials`).

    Motion (MOTION-01):
    17. `src/app/globals.css`: the cadence is +40ms per grid child (`nth-child(2)` 40 / `(3)` 80 / `(4)` 120). Add `.explore-shell .panel-grid > *:nth-child(5) { animation-delay: 160ms; }` immediately after the `nth-child(4)` rule, matching its formatting. This is the ONLY motion this phase adds — the panel inherits the existing `explore-panel-in` keyframe and the existing `@media (prefers-reduced-motion: reduce)` guard already covers `.explore-shell *`, so no new guard or exception is added.

    SUMMARY.md must record, in this plan's phase directory, before the plan is reported complete:
    - the SIX expected-red suites by name with their RAW failing output pasted in, as the plan-02 handoff;
    - the supersession line, verbatim in meaning: "SPEC acceptance 'every row an anchor' + CONTEXT D-02 'compact anchor rows' are superseded FOR THE CERTIFICATIONS TAB by UI-SPEC §5.3/§5.4 — 4 null links + 1 verification ID ⇒ 5 plain-text rows, 0 anchors; the Articles and Presentations tabs keep real anchors." This is a deliberate narrowing of the SPEC's literal wording, not a coverage gap;
    - the research-artefact note: this phase ships no RESEARCH.md/VALIDATION.md; the accepted substitute is each task's runnable verify row plus the re-measured SSR/export-boundary block in this plan's <context>;
    - the MERGE HOLD: the branch must not be merged or handed off as green until plan 02's `npm run build && node --test tests/*.test.mjs` full-suite run is on record — until then the worktree is knowingly red on six suites and the repo-wide suite does NOT pass.
    </action>
    <verify>npm run typecheck && npm run build && node --test tests/credentials-panel.test.mjs</verify>
    <acceptance_criteria>
      - `node --test tests/credentials-panel.test.mjs` exits 0 — the RED suite from Task 1 is now GREEN (this is the red→green transition on record).
      - `npm run typecheck` exits 0 (proves all five `Record<ExploreSectionId, …>` maps were re-mapped).
      - `npm run build` exits 0 and still emits `out/explore.html`, `out/index.html` and `out/resume.html`.
      - `grep -c 'framer-motion' src/components/explore/sections/credentials-section.tsx` returns 0.
      - Copy is data-driven (EXPLORE-07), proven at source level: `grep -c 'Allure Reporting' src/components/explore/sections/credentials-section.tsx` returns 0 and `grep -c 'GRTB-24-1S20-CTFL' src/components/explore/sections/credentials-section.tsx` returns 0, while `node -e` over the JSON reports the presentation name and the cert ID present in the data.
      - The anchor guard is URL-only: the component contains a predicate matching `/\.startsWith\(\s*['"]http['"]\s*\)/` (or `/^https?:/`) and no unconditional `href={…link}` on the certification path — so the measured 4 null links and the 1 `ID:` string render as plain text, and the Certifications tab renders 0 anchors by design (UI-SPEC §5.3/§5.4).
      - SSR proof at export level, on the SCRIPT-STRIPPED document (only what SSR emits): `id="credentials"`, `Credentials`, the three tab labels, `0/5 sections visited`, the name of at least two featured articles, and 5 `PanelShell` mono index spans with one ending `>05</span>` are all present in the stripped `out/explore.html`.
      - Source-level contract that the export cannot carry: `grep -c 'href={\`#${section.id}\`}' src/components/explore/explore-drawer.tsx` returns 1 and `grep -c "credentials: 'text-chart-5'" src/components/explore/explore-drawer.tsx` returns 1 (the 5th anchor is derived, and the drawer never reaches the static export because the Sheet is closed — the export is NOT asserted for `href="#credentials"`).
      - Placement shape is exact: `grep -cE "credentials:\s*\{\s*wrapper:\s*'',\s*shell:\s*'',\s*gate:\s*false\s*\}" src/components/explore/explore-panels.tsx` returns 1, and the credentials entry carries no `md:sticky`, `md:h-` or `md:col-span-2`.
      - `node -e` over the JSON still reports articles 15, certifications 45, presentations 1 (nothing deleted).
      - Expected-RED and OUT OF SCOPE here: exactly SIX pre-existing suites now fail — `tests/explore-shell.test.mjs`, `tests/explore-tour.test.mjs`, `tests/explore-sweep.test.mjs`, `tests/explore-visuals.test.mjs` (index-span row 4→5 AND the adapter-closure row at :332-335), `tests/explore-visuals-skills.test.mjs` (the adapter-closure row at :161), and `tests/portfolio-data-integrity.test.mjs` (the `PRE_PRESENTATIONS` ledger fixture at :113-122 vs the new `featured: true` field). Record all six in SUMMARY.md by name with the raw failing output; do not edit any of them in this plan.
      - SUMMARY.md carries the supersession line: `grep -c "superseded FOR THE CERTIFICATIONS TAB" .planning/phases/EXPLORE-11-credentials-panel-revision/EXPLORE-11-credentials-panel-revision-01-SUMMARY.md` returns 1, and `grep -c "MERGE HOLD" …-01-SUMMARY.md` returns at least 1.
    </acceptance_criteria>
    <done>The Credentials panel renders end-to-end at /explore — 3 tabs, featured-only rows, the cert plain-text/ID nuance (5 plain-text rows, 0 anchors, per the measured data), the derived 05 Credentials drawer anchor and the 0/5 counter — with its SSR-reachable surface (chrome, tab labels, counter, default Articles rows) landing in the built export, the new acceptance suite green, the tree typechecking and building, and SUMMARY.md carrying the six red suites by name with raw output, the SPEC/CONTEXT supersession line for the Certifications tab, the research-artefact substitute note, and the merge hold forbidding a merge before plan 02's full-suite run.</done>
  </task>
</tasks>
