All research complete. Here is the full RESEARCH.md for the orchestrator to write to disk:

````markdown
# Phase 5: explore-routing — RESEARCH.md

**Gathered:** 2026-09-22 (research pass, planner input)
**Phase:** 05-explore-routing · Milestone: Explore Visual Landing · Branch: `phase-5`
**Inputs honored:** CONTEXT.md D-01…D-05 (locked), SPEC.md (ambiguity 0.155, PASSING), canonical refs read this session.

**Scope note — read this first.** All HOW decisions are locked; this research implements them, it does not relitigate. It (a) verifies every augment-target fact the plan will touch, (b) corrects one **factually wrong assumption in CONTEXT.md's code_context** (the help output does NOT derive from AVAILABLE_COMMANDS — §1.4), (c) resolves two spec-vs-reality tensions the planner must carry (the JetBrains Mono font split, §OQ-4; the sweep-defect-ownership vs "no panel changes" boundary, §OQ-5), and (d) verifies the exact suite invocation the green gate needs (§7). Nothing blocks planning.

---

## 1. Domain analysis

### 1.1 What is being built (settled)

Two-way routing + responsive polish, five locked edit surfaces, zero new dependencies:
1. CLI welcome link line `[ NEW → visual tour: explore ]` after the tutorial box (D-01).
2. New `explore` command: AVAILABLE_COMMANDS entry + handler case + help entry (D-02).
3. /explore header Terminal link, 44px ghost, rightmost in the right cluster (D-03).
4. Falsifiable breakpoint sweep table {375, 768, 1440, 1920} × {/, /explore} (D-04).
5. All additive-only; /resume and data files byte-untouched (D-05).

### 1.2 CLI routing mechanics — how navigation actually plugs in [VERIFIED: repo]

- `TerminalInterface` is a `"use client"` component (`src/components/cli/TerminalInterface.tsx:1`) mounted via `dynamic(() => import(...), { ssr: false })` on the CLI page (`src/app/(main)/page.tsx:8-15`) — it never SSRs, so `useRouter` from `next/navigation` is unconditionally available inside it. Verified: `useRouter` is exported by the installed next (`node_modules/next/dist/client/components/navigation.d.ts:62` — `export declare function useRouter(): AppRouterInstance;`, JSDoc cites https://nextjs.org/docs/app/api-reference/functions/use-router). **No `useRouter` usage exists anywhere in `src/` yet** — this phase introduces it [VERIFIED: grep, zero hits].
- `processCommand` signature: `async (command: string): Promise<React.ReactNode | { openModal: "resume" } | { openModal: "presentation"; presentation: Presentation }>` (TerminalInterface.tsx:129-133). Command dispatch: `const [cmd, ...args] = command.toLowerCase().trim().split(" ")` (:134), then a `switch (cmd)` with `case ""` and a fuzzy-suggestion `default` (:295-317).
- **The house precedent for a command with a side effect beyond output is the sentinel object**: `case "resume": ... return { openModal: "resume" }` (:228-235), and `executeCommand` handles it — pushes a loading line, `setHistory(...)`, `await new Promise(resolve => setTimeout(resolve, 800))` (:372), then acts, then returns early (:386). The sentinel path is checked BEFORE the "plain ReactNode" branch (:387-404), so a plain object return is never pushed as output. A `{ navigate: "/explore" }` sentinel slots into this exact shape.
- Router navigation must be `router.push('/explore')` — D-02 forbids `window.location`. Same-tab is the default for both `router.push` and `<Link>` without `target` [CITED: Next.js useRouter/Link docs, per the JSDoc above].
- `next/link` is **not yet imported anywhere under `src/components/cli/`** [VERIFIED: grep, zero hits] — the welcome link is the CLI's first; it is client-component-safe (already used in explore-tour.tsx:37) [CITED: Next.js docs].
- Achievements/easter eggs are keyed to specific interactions, never to command-list length: `unlockAchievement` calls exist only at TerminalInterface.tsx:224 (POLYGLOT), :416 (FIRST_STEPS), :452 (SPEED_DEMON), :472/:485 (TIME_TRAVELER). EXPLORER/COMPLETIONIST are defined in constants.ts:98-109 but never unlocked anywhere [VERIFIED: grep]. Adding a command case that triggers neither hook keeps all behaviour identical. Note FIRST_STEPS will unlock on a first-ever `explore` command — that is the pre-existing generic first-command behaviour, not a change.

### 1.3 WelcomeMessage anatomy — insertion point and typing flow [VERIFIED: repo]

Current structure (src/components/cli/outputs/WelcomeMessage.tsx:24-65): ASCII banner `<pre className="... hidden sm:block">` → mobile banner div → `{showTyping && (<> two TypingEffect lines </>)}` → `{showTutorial && (<div className="border border-accent/30 rounded bg-accent/5 p-4 my-2 text-sm">…🚀 Quick Start Guide…</div>)}` → `<br />`. `showTutorial` renders **only on first visit** (localStorage `cli-visited`, :12-17).

- **Insertion point**: between the `{showTutorial && …}` block and the trailing `<br />` (exact px within that window is Claude's Discretion per CONTEXT).
- **The link line must render unconditionally** (a sibling after the tutorial block, NOT inside it) — otherwise returning visitors (tutorial suppressed) never see the link and the island problem stays open for the majority surface. This reading is consistent with D-01 ("placed after the tutorial box" = DOM position, not render condition) and the SPEC acceptance ("placed after the tutorial box section of the welcome flow"). Resolved at OQ-3.
- Typing flow: `TypingEffect` is a self-contained animated `<span>` (TypingEffect.tsx:50-55); a static element below it cannot break it — matches code_context's claim. The link line will be visible immediately while the two typed lines animate (100ms + per-char + 800ms delay); accepted per code_context ("the new link line renders as static content below the tutorial box").
- The welcome renders twice per session path: initial mount (TerminalInterface.tsx:62) and on every `clear` (:342-349) — the link line appears in both, automatically, with zero extra code.
- **The rest renders byte-identical**: no existing test asserts WelcomeMessage content [VERIFIED: grep of tests/*.mjs], so the additive edit cannot break a source invariant. The only pre-existing "explore" strings in the CLI are the typing line `"> Type 'help' to explore my work"` (WelcomeMessage.tsx:48) and the `explorer` achievement id (constants.ts:99) — neither is a route reference; the "exactly one added link line" test must count `<Link`/anchor elements, not the word.

### 1.4 Help surface — the CONTEXT claim is wrong; entry is manual [VERIFIED: repo — planner MUST plan for this]

CONTEXT code_context says "The help output derives from AVAILABLE_COMMANDS — adding 'explore' auto-lists it". **This is false.** Verified this session:

- `AVAILABLE_COMMANDS` has exactly two consumers, both in TerminalInterface: Tab autocomplete (`AVAILABLE_COMMANDS.filter(cmd => cmd.startsWith(trimmedInput))`, :444-446) and fuzzy "Did you mean" suggestions (levenshtein ≤2, :299-304).
- `HelpOutput.tsx:12-19` is a **hardcoded `<li>` list** (about, taas, contact, experience, education, skills, advanced, clear — verbatim lines like `<li><span className="text-primary w-36 inline-block">about</span>                  - Display {portfolioData.about.name}'s summary</li>`).
- `AdvancedHelpOutput.tsx:17-26` is likewise hardcoded (projects, articles, presentations, certifications, interests, achievements, resume, theme, help, clear).

Consequence: satisfying the SPEC acceptance "listed in the help output" requires a **manual `<li>` entry** in one of the two components. D-02 anticipated exactly this ("planner verifies the help/AdvancedHelpOutput description map gets a matching entry") — there is no map, there are two literal lists; the planner picks one. Recommendation: **HelpOutput.tsx** (main help — the tutorial box sends every newcomer to `help`, so the island closes on the primary surface; AdvancedHelpOutput is utility commands). Follow the existing line shape: `<li><span className="text-primary w-36 inline-block">explore</span> - <description></li>` with a chrome-only description (e.g. "Open the visual portfolio tour" — wording is Claude's Discretion, EXPLORE-07: no invented portfolio facts).

### 1.5 AVAILABLE_COMMANDS entry — behavior notes [VERIFIED: repo]

Verbatim current list (constants.ts:55-62): `"help", "advanced", "about", "taas", "freelance", "contact", "socials", "links", "experience", "xp", "education", "edu", "skills", "projects", "portfolio", "articles", "presentations", "talks", "slides", "interests", "hobbies", "certifications", "certs", "gaming", "games", "resume", "pdf", "cv", "date", "echo", "theme", "supermario", "alias", "revelio", "clear", "shortcuts", "keys", "achievements"`. Appending `"explore"` (D-02 "appended") yields:

- Tab autocomplete: typing `exp` now matches **two** commands (`experience`, `explore`) → the multi-match path prints both options (:453-461); `expl` is unique. Additive, correct-by-construction — note it in the plan so it isn't mistaken for a regression.
- Fuzzy suggestions: typos like `explor`/`exlore` now surface `explore` (distance ≤2) — desired.
- No flags/aliases: D-02 pins only the bare command; do NOT add aliases or an easter-egg id (that would modify EASTER_EGG_IDS — outside the D-05 enumeration of allowed edits).
- The `MobileCommandPalette` (basic/advanced command sheets, MobileCommandPalette.tsx:24-45) has its own hardcoded lists and is **NOT in the D-05 enumeration** ("welcome link line, AVAILABLE_COMMANDS entry, command handler case, help description entry") — do not touch it (OQ-9).

### 1.6 /explore header right cluster — order, recipe, and the 3-vs-4 nuance [VERIFIED: repo]

Current JSX child order in `ExploreHeader` (explore-header.tsx): glyphs div (:38) → mobile title span (:53, `min-w-0 flex-1 truncate`) → desktop title span (:56, `hidden min-w-0 flex-1 truncate md:inline`) → Tour button (:63-71, `id="explore-tour-trigger"`, Compass) → theme button (:73-86) → `ExploreDrawer` (:89-99) whose `SheetTrigger asChild` child is the Menu button. Ghost recipe, verbatim class string of every 44px control: `flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background` (:68/:79/:94). Header bar: `flex h-[52px] shrink-0 items-center gap-2 border-b bg-background px-4` (:36).

- **D-03 placement**: the Terminal `<Link href="/">` becomes the **last header child, after `ExploreDrawer`** → rightmost. It copies the ghost recipe classes exactly (house pattern is byte-identical duplication, not a shared const — cf. GHOST_INTERACTION in explore-tour.tsx:60-61 which the header does NOT consume), with `<Terminal className="h-5 w-5" aria-hidden="true" />` and `aria-label="Open the terminal"`.
- **Width math at 375px (verified arithmetic, all values from source)**: px-4 = 32; glyphs = 3×10px dots + 2×8px internal gaps = 46; cluster = 4 × 44px = 176 (Tour, theme, drawer, **Terminal**); header gap-2 between 6 visible children = 5 × 8 = 40. Fixed total = 294 ≤ 375, leaving ≥81px for the truncating title. Title is the only `min-w-0 truncate` element — stays the only truncator.
- **SPEC wording nuance**: the acceptance criterion names "(theme toggle, Tour button, Terminal link)" — three targets — but the physical cluster has **four** 44px controls (the drawer Menu button is the third pre-existing one). The D-04 right-cluster test must assert the **four**-control math (176px + gaps), or the test passes while lying. Flagged at OQ-6; planner words the test against four.
- Rem-shrink trap: ≤640px `html { font-size: 14px }` (globals.css:464-466) — the 44px targets are px-based (`h-[44px] w-[44px]`), immune; never convert to rem (explore-header.tsx:13-15 doc block).
- SSR: the header is inside the client-boundary shell but IS server-rendered into the static export — `out/explore.html` already contains `Start the guided tour` [VERIFIED: grep of out/explore.html = 1 hit; export-level precedent tests/explore-shell.test.mjs:423-433]. The new link will SSR identically → export-level assertion possible. Hydration-stable (static markup, no storage reads at render).

### 1.7 Static export + routing facts [VERIFIED: repo]

- `output: 'export'` (next.config.ts:5) — `npm run build` emits `out/` with `index.html`, `explore.html`, `resume.html` all present today [VERIFIED: ls out/]. All three routes must keep exporting.
- The CLI welcome is **client-only** — `out/index.html` does NOT contain `System initialized` [VERIFIED: grep = 0 hits]. So the welcome link + command handler can only be asserted at **source level (Layer-2)**; the header Terminal link asserts at both source and **export level (Layer-3)**.
- Static-export navigation: `<Link href="/explore">` and `router.push('/explore')` work on the exported site (same-origin client-side transitions between static HTML routes) [CITED: Next.js docs via the useRouter JSDoc; house precedent explore-tour.tsx:435 `<Link href={EXPLORE_TOUR_FINISH.linkHref}>` where `linkHref: "/"` (constants.ts:92, verbatim)].
- Cross-surface state: navigating CLI → /explore unmounts the CLI; localStorage keys (`cli-visited`, `portfolio-theme`, history, achievements) persist, so a returning visitor skips the tutorial box and keeps their theme — no code needed, just expected behaviour to note in the sweep table's manual rows.

### 1.8 Breakpoint sweep domain — what each row can actually check [VERIFIED: repo]

Tailwind screens are stock (no `screens` key in tailwind.config.ts): sm 640 / md 768 / lg 1024. Relevant responsive classes on /explore:

- Panels grid: `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3` + About `md:col-span-2 lg:col-span-2` (explore-panels.tsx:67,77) → 375 = 1 col, 768 = 2 cols, 1440/1920 = 3 cols. **No max-width wrapper** — full-bleed at any width (doc block :17-19). At 1920 panels ≈ 600px wide; the recharts skills chart (`'use client'`, skills-chart.tsx:25) stretches with `ResponsiveContainer` — a plausible ultra-wide manual finding.
- Intro strip: `min-h-[40px] shrink-0 … text-sm md:min-h-[20px]`; the 57-char name—title wraps to two lines at 375px by design (explore-intro.tsx:24-26, 42).
- Status bar: `h-7 sm:h-8 … text-[10px] sm:text-xs` with breadcrumb left + counter right (explore-status-bar.tsx:34) — combined ~46 chars at 10px fits 375.
- Shell: `.explore-shell flex h-dvh flex-col overflow-x-hidden` (explore-shell.tsx:58) — **overflow-x-hidden means "zero horizontal scroll" is structurally guaranteed on /explore; the real check is nothing clipped/cut**. Manual rows must look for clipped content, not a scrollbar. On the CLI, `(main)/layout.tsx` uses `overflow-hidden` on the wrapper but `overflow-auto` on main — a real horizontal scrollbar IS possible there, so scrollWidth-vs-clientWidth reasoning applies to the CLI side.
- CLI at 375: ASCII banner hidden below sm (`hidden sm:block`, WelcomeMessage.tsx:27); mobile banner div renders instead. The new link line at text-sm mono ≈ 30 chars ≈ ~260px — fits 359px of content width.
- Prior verified behaviour on record (do not regress, do not re-test from scratch — cite it): 375px no-horizontal-scroll + 44px targets user-confirmed phase-1 (EXPLORE-01 VERIFICATION.md:35,49,146); drawer one-code-path at every viewport (:43); tour card dock geometry at 375 table-tested phase-4 (EXPLORE-04 VERIFICATION.md:105,141).

**Sweep row taxonomy (resolves D-04's "component-level checks per row" discretion, OQ-6):**
- **Type P (programmatic)** — source-invariant/geometry tests: grid classes, px arithmetic (cluster math), px-not-rem target classes, overflow guards, `whitespace-pre-wrap` on CLI output.
- **Type E (export)** — after `npm run build`: markers in `out/index.html` / `out/explore.html` / `out/resume.html` (header link, static-HTML markers, routes exist).
- **Type M (manual-visual)** — rendered appearance per width (chart stretch at 1920, glyph alignment, truncation look) — marked "user final pass" per D-04.

**Defect ownership rule (resolves the D-04 ↔ boundary tension, OQ-5):** the phase boundary excludes "any panel/grid/visualization/wizard changes", while D-04 says "every discovered defect fixed with a test". A defect found inside a panel/visualization (e.g. 1920 chart stretch) is **recorded in the sweep table with disposition `deferred`** (pointer for a later phase); defects on this phase's surfaces (header cluster, welcome line, shell chrome classes) are **fixed + tested**. The SPEC acceptance "every discovered defect is fixed" reads as "every defect owned by this phase's surfaces". Planner must give the sweep table a disposition column (`fixed` / `deferred`) so the verifier can check the rule.

### 1.9 Pitfalls (high confidence)

- **Directory-mode test run is broken**: `node --test tests/` fails ('test failed' on the directory itself, verified this session). The suite must run as `node --test "tests/*.test.mjs"` — verified: **132 pass / 0 fail** on the current phase-5 tree. Put this exact command in the plan's gate.
- Tests import `.ts` directly via Node type stripping — **local-only** (needs Node ≥ 23.6; CI runs Node 20 and never runs tests, deploy.yml:35-60). Keep the new suite in the same style; do not promise CI coverage.
- Adding the explore case to the switch must not change the `default` fuzzy-suggestion path ordering (case goes before `case ""`/`default`; 39 `case "` occurrences today — becomes 40).
- `processCommand` return union: a new sentinel value must be added to the declared union type (:131-133) or typecheck fails; handle it in `executeCommand` before the ReactNode branch (:387).
- The welcome link line inherits `text-sm md:text-base` sizing from the history-line wrapper (TerminalInterface.tsx:528) — no size classes needed; only font-family/color per D-01.
- Do not add `target="_blank"` anywhere — same tab is locked (D-01/D-02/D-03).

---

## 2. Package legitimacy

**Zero new dependencies is locked (D-05).** No package is proposed. Every package the phase touches, verified in `node_modules` this session:

| Package | package.json | Installed | Verified use this phase | Source |
|---|---|---|---|---|
| `next` | `^15.5.10` | **15.5.25** | `<Link>` (welcome line, header link); `useRouter` from `next/navigation` (handler) | [VERIFIED: node_modules/next/package.json; `node_modules/next/dist/client/components/navigation.d.ts:62` — `export declare function useRouter(): AppRouterInstance;`; JSDoc doc URL https://nextjs.org/docs/app/api-reference/functions/use-router [CITED]] |
| `lucide-react` | `^0.475.0` | 0.475.0 | `Terminal` icon (header link) | [VERIFIED: `node_modules/lucide-react/dist/lucide-react.d.ts:18129` — `* @component @name Terminal` + `declare const Terminal`; already imported in MobileCommandPalette.tsx:4] |
| `react` / `react-dom` | `^18.3.1` | 18.3.x | existing runtime, untouched | [VERIFIED: package.json + node_modules] |
| recharts et al. | — | — | untouched (no edits allowed in visualization files) | [VERIFIED: package.json:39-dep block; invariant test precedent tests/explore-visuals.test.mjs:622-625] |

Dependency-count invariant precedent exists: `assert.equal(Object.keys(pkg.dependencies).length, 39, …)` (explore-visuals.test.mjs:624) — the new suite should pin 39 again.

---

## 3. Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-1 | Planner trusts CONTEXT's "help auto-lists from AVAILABLE_COMMANDS" → help entry skipped → SPEC acceptance "listed in the help output" fails | — | High | §1.4: entry is a manual `<li>`; plan an explicit HelpOutput.tsx task |
| R-2 | Navigation fires before the chrome line renders → user never sees `[ opening the visual tour… ]` | Medium | Low | Delay ~500-800ms between history update and `router.push`, mirroring the resume 800ms idiom (TerminalInterface.tsx:369-386); pinned in the plan |
| R-3 | Sweep finds a defect inside a panel/visualization (out of scope to fix) and the phase stalls on "fix everything" wording | Medium | Medium | Disposition column (`fixed`/`deferred`) in the sweep table; shell-surface defects fixed+tested, panel-internal deferred (OQ-5) |
| R-4 | Right-cluster test asserts only the SPEC's named three controls → drawer toggle uncounted → math lie at 375px | Medium | Medium | Test asserts all FOUR 44px controls (176px) + 5×8 gaps + 46px glyphs + 32px padding ≤ 375 (§1.6) |
| R-5 | `node --test tests/` used as the gate command → false red | Certain (verified) | Low | Gate command is `node --test "tests/*.test.mjs"` (§7) |
| R-6 | JetBrains Mono lock renders the link line in a different font than its Geist Mono neighbours → visual inconsistency noticed at review | Certain (by design) | Low | Accepted consequence of the locked wording; explicit `--font-jetbrains` stack on the line; noted in plan + sweep manual rows (OQ-4) |
| R-7 | Executor "helpfully" also adds `explore` to MobileCommandPalette or touches /resume | Low | Medium | D-05 enumeration is exhaustive; plan lists the exact five-file edit set; /resume asserted byte-untouched at verify |
| R-8 | Tab-complete `exp` ambiguity mistaken for a regression during verify | Low | Low | Documented as intended additive behaviour (§1.5) |

---

## 4. Open Questions

- **OQ-1: Which help component gets the `explore` entry?** — **(RESOLVED)** HelpOutput.tsx (main help). D-02 allows "help/AdvancedHelpOutput"; the SPEC acceptance says "listed in the help output"; the tutorial box routes newcomers to `help`, so the primary list is the island-closing surface. Line shape follows the file's existing `w-36 inline-block` pattern verbatim.
- **OQ-2: Navigation mechanism inside the handler — direct `router.push` in the case vs sentinel?** — **(RESOLVED)** Both satisfy D-02's mechanism (`useRouter().push('/explore')`, no `window.location`). **Recommend the sentinel `{ navigate: "/explore" }`** returned from the case, handled in `executeCommand` exactly like `{ openModal: "resume" }`: push the chrome line → `setHistory` → await ~600ms → `router.push(result.navigate)`. This is the house idiom for side-effect commands (TerminalInterface.tsx:228-235, 352-386), guarantees the chrome line paints first, and keeps the union-type change one token. Literal alternative (setTimeout inside the case, chrome line returned immediately) is acceptable if the planner prefers the smaller diff — pick ONE in the plan and pin it so the executor doesn't freelance.
- **OQ-3: Link line conditional on first-visit tutorial?** — **(RESOLVED)** Unconditional. Rendered as a sibling after the `{showTutorial && …}` block (before the `<br />`); the tutorial box is position context, not a render gate. Returning visitors must still see the link (island closure is the phase's purpose).
- **OQ-4: D-01 pins "JetBrains Mono" for the welcome link line, but the CLI renders Geist Mono** (`body { font-family: var(--font-geist-mono), … }` globals.css:5-8; JetBrains Mono is scoped ONLY to `.explore-shell`, globals.css:499-502 — comment verbatim: "CLI pages keep Geist Mono via the body rule above."). — **(RESOLVED)** Honor the lock literally: the line carries an explicit font stack `var(--font-jetbrains), var(--font-geist-mono), Menlo, Monaco, 'Courier New', monospace` (the variable is loaded globally on `<body>`, src/app/layout.tsx:19-26, so it resolves on the CLI page). Visual delta vs neighbours is a locked-wording consequence — note it in the plan; a one-line user override ("inherit CLI Geist Mono instead") would need a CONTEXT amendment, otherwise implement as locked.
- **OQ-5: "Fix every discovered defect" vs out-of-scope "any panel/grid/visualization/wizard changes"?** — **(RESOLVED)** Defects on this phase's surfaces (header cluster, welcome line, shell/layout chrome) → fix + test. Defects found inside panels/visualizations → recorded in the sweep table with disposition `deferred` + a one-line pointer; fixing them would breach the explicit boundary. Sweep table gains a disposition column (§1.8).
- **OQ-6: Right-cluster test scope — three or four 44px controls?** — **(RESOLVED)** Four (Tour, theme, drawer, Terminal = 176px). The SPEC acceptance omits the drawer by naming shorthand; the physical math must include it or the fit claim is false at 375px (§1.6 arithmetic).
- **OQ-7: Exact suite invocation for the green gate?** — **(RESOLVED)** `node --test "tests/*.test.mjs"` — verified 132/132 pass on the current tree this session. `node --test tests/` (directory form) FAILS — never write it into a plan.
- **OQ-8: Terminal link inside or after the drawer's trigger slot?** — **(RESOLVED)** After `ExploreDrawer` as the last header child (D-03 "after theme + drawer + tour"); ExploreDrawer's SheetTrigger wraps only the Menu button, so a sibling `<Link>` after it is the rightmost control.
- **OQ-9: Does MobileCommandPalette need the explore entry?** — **(RESOLVED)** No. D-05's enumerated CLI edits are exhaustive (welcome line, AVAILABLE_COMMANDS entry, handler case, help entry); the palette is not among them → untouched.

---

## 5. Architectural Responsibility Map

| Capability | Tier | Home | Notes |
|---|---|---|---|
| Welcome bracket link line | **presentation** | `src/components/cli/outputs/WelcomeMessage.tsx` | Pure presentational output; static markup; client-only surface (never SSRs) |
| `explore` command name registry | **domain/data** (CLI constant) | `src/components/cli/constants.ts` | AVAILABLE_COMMANDS append; consumed by autocomplete/fuzzy-match logic |
| `explore` command dispatch + navigation | **integration** (inside client component) | `src/components/cli/TerminalInterface.tsx` | processCommand case + executeCommand sentinel handling + `useRouter().push`; the ONLY place router access is wired — must NOT leak into output components |
| Help listing entry | **presentation** | `src/components/cli/outputs/HelpOutput.tsx` | Hardcoded list; one `<li>` |
| Header Terminal link | **presentation** + integration (next/link) | `src/components/explore/explore-header.tsx` | Ghost recipe reuse; SSRs into static export |
| Sweep table artefact | **validation artefact** | `.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md` | Committed per D-04; disposition column per OQ-5 |
| Sweep/fixed-defect tests | **validation** | `tests/explore-routing.test.mjs` (new) | Layer-2 source invariants + Layer-3 export checks, house style |
| Data tier | — | **no changes** | portfolio-main-data.json untouched (EXPLORE-07/D-05) |

Security-sensitive capabilities: **none** — no auth, no untrusted input, no external fetches; navigation targets are same-origin static routes. No tier reassignment risks a BLOCKER. The integration capability (router) correctly sits inside the existing client boundary — pulling it lower (into an output component) would be the wrong-tier mistake to check at review.

---

## 6. Validation Architecture

Automated checks proving each locked behaviour (feeds the Nyquist/coverage gate; all in the house `node --test` source-invariant style — no DOM renderer exists in this repo, tests read sources and constants):

| Behaviour (SPEC/CONTEXT) | Check | Layer |
|---|---|---|
| Exactly one added bracket link line, format `[ NEW → visual tour: explore ]`, after tutorial box | WelcomeMessage source: one `<Link href="/explore">`; locked literal string present verbatim; accent-bracket classes; position asserted by source-order (link line between `showTutorial` block and `<br />`); pre-existing segments (banner, typing lines, tutorial `<li>`s) still present (byte-identical rest) | L2 |
| Link line in JetBrains Mono (OQ-4) | Source asserts explicit `var(--font-jetbrains)` stack on the line | L2 |
| `explore` in AVAILABLE_COMMANDS | Import `AVAILABLE_COMMANDS` from `../src/components/cli/constants.ts` (type-stripping import, house precedent explore-tour.test.mjs:22-29) and assert inclusion + list length 38→39 | L1 |
| Command routes via Next router, same tab, chrome line first | TerminalInterface source: `useRouter` import from `next/navigation`; `case "explore"` present; `router.push("/explore")` present; negative grep: no `window.location` in file; delay/sequencing per pinned OQ-2 variant; `case "` count 39→40 (additive-only proof) | L2 |
| Listed in help | HelpOutput source contains an `explore` entry line (and AdvancedHelpOutput untouched if Help-only chosen) | L2 |
| Header Terminal link: 44px ghost, Terminal icon, aria-label, href="/", rightmost | explore-header source: `aria-label="Open the terminal"`, `h-[44px] w-[44px]`, ghost class string, `Terminal` import; JSX child-order check (index of link > index of ExploreDrawer) | L2 |
| Header link SSRs | `out/explore.html` includes `Open the terminal` + `href="/"` (build precondition like explore-shell.test.mjs:378) | L3 |
| Right-cluster fits 375px, title only truncator | Arithmetic test from source-extracted values: 32 + 46 + 176 + 40 = 294 ≤ 375; assert title spans keep `min-w-0 flex-1 truncate` and are the only truncators | L2 |
| Zero horizontal scroll | CLI: source invariants (wrapper `overflow-hidden`, inner overflow-auto with `whitespace-pre-wrap` outputs) + manual rows; /explore: shell `overflow-x-hidden` invariant + manual clip-check rows | L2 + M |
| Sweep grid classes per breakpoint | Source asserts `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` + About spans unchanged (regression guard for the sweep) | L2 |
| Routes still export statically | `out/index.html`, `out/explore.html`, `out/resume.html` exist post-build (precedent explore-shell.test.mjs:393-397) | L3 |
| No new dependencies | `Object.keys(pkg.dependencies).length === 39` (precedent explore-visuals.test.mjs:622-625) | L1 |
| /resume byte-untouched; data files untouched | Verification-table git check: `git diff --name-only <base>…HEAD -- src/app/resume scripts src/data` empty (not a node test — a verify-step row) | verify |
| Welcome link + command + header link = two-way loop | Composition of the above (welcome→/explore, command→/explore, header→/, finish-card→/ already pinned: `EXPLORE_TOUR_FINISH.linkHref === "/"`, constants.ts:92 verbatim) | L2 composite |

Gates (final-tree ordering per house green-gate discipline): `npm run build` → `npm run typecheck` → `node --test "tests/*.test.mjs"` (build first so Layer-3 export checks read fresh output).

---

## 7. Project Constraints (project conventions)

- **Test infra**: Node built-in runner, zero test deps; suites import `.ts` directly (type stripping, Node ≥ 23.6) → **local-only** (CI = deploy.yml runs Node 20, build only). Suite invocation: `node --test "tests/*.test.mjs"` (132/132 green on the current phase-5 tree, verified this session). Red-first discipline is on record for prior phases (explore-tour.test.mjs:9-14).
- **Gates**: `npm run build` (CI gate — must keep emitting all three static routes), `npm run typecheck`, full node --test suite.
- **Scope guards**: additive-only CLI edits (exactly: WelcomeMessage link line, constants AVAILABLE_COMMANDS entry, TerminalInterface case + navigation, HelpOutput entry); /resume byte-untouched; data files untouched; zero new dependencies; existing commands/themes/achievements/easter-eggs byte-identical.
- **Copy discipline**: EXPLORE-07 — all new copy is chrome; locked strings verbatim: `[ NEW → visual tour: explore ]`, aria-label `Open the terminal`; chrome wording otherwise Claude's Discretion.
- **Layout facts to respect**: px-based 44px targets (never rem below 640px); `.explore-shell` token/font scoping; CLI uses CLI tokens (`text-accent` on the CLI page resolves through the CLI theme blocks — globals.css:27/:68/:102/:134/:166/:198/:230), not explore tokens.
- **Git/state**: branch `phase-5` active; working tree clean except `.planning/STATE.md` (expected) and untracked harness artefacts (`.cursor/`, `.deepindex.db`, `*.pdf/png`, `tsconfig.tsbuildinfo`, `doublecheck-*.md`) — never commit those; no remote pushes without explicit user command (standing rule).
- **Sweep artefact path** (proposed): `.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md` — 8 rows ({375,768,1440,1920} × {/, /explore}), each with check-type (P/E/M), result (pass/defect), disposition (fixed+test / deferred), and manual rows flagged for the user's final pass.
````