# Phase 05 — EXPLORE-06 Breakpoint Sweep Table (D-04, falsifiable)

**Phase:** 05-explore-routing · **Plan:** 03 · **Requirement:** EXPLORE-06 (plus the EXPLORE-05/05b entry points it sweeps)
**Grid:** exactly 8 rows — {375, 768, 1440, 1920} × {/ , /explore} — one row per {breakpoint × route}.

## Legend

### Check taxonomy (D-04, RESEARCH §1.8)
- **P — programmatic/static:** a source-invariant or arithmetic check implemented in a node --test suite. Every P row cites its owning test file; every check in this plan's suite comments its sweep row id.
- **E — export-level:** asserted against the static export in `out/` after `npm run build` (all three routes still export statically; the header Terminal link SSRs). Owned by `tests/explore-sweep.test.mjs` (this plan).
- **M — manual-visual:** rendered appearance only a human can confirm. Every M row is marked `manual — user final pass` per D-04 — these rows are the user's final visual pass, not blockers.

### Disposition rule (OQ-5 — defect ownership)
- A defect **on this phase's surfaces** (welcome link line, header cluster, shell/layout chrome classes in `src/components/cli/outputs/WelcomeMessage.tsx` / `src/components/explore/explore-header.tsx` / `src/components/explore/explore-shell.tsx` / `src/app/(main)/layout.tsx`) → disposition **`fixed`**: red-first fix, and the row names its pinning test.
- A defect **inside panels/visualizations/wizard** or any other non-phase surface → disposition **`deferred`**: the row names the out-of-scope surface plus a one-line pointer for a later phase; NOT fixed here (boundary, D-05).
- No defect → **`pass`** (M rows additionally carry the manual marker).

### Row owners
- `tests/explore-sweep.test.mjs` (this plan) — the Type-P structural rows not owned elsewhere (panel grid classes, shell/CLI overflow invariants, welcome-link-line fit arithmetic, status-bar + intro tokens, banner classes), the Type-E export rows, and the two-way routing loop composite.
- `tests/explore-header.test.mjs` (plan 02) — owns the 375px right-cluster arithmetic (four 44px controls = 176px; 279.25px ≤ 375px at the ≤640px 14px root — OQ-6, drawer counted) and the header Terminal-link source contract.
- `tests/explore-routing.test.mjs` (plan 01) — owns the CLI welcome-line format/position and the `explore`-command dispatch contract.

## Sweep table

| # | Breakpoint | Route | Check type | Check | Result | Disposition | Evidence |
|---|---|---|---|---|---|---|---|
| 1 | 375 | /explore | P+M | Right-cluster fit math: four 44px controls (Tour, theme, drawer, Terminal = 176px) + gaps + truncating title + padding = 279.25px ≤ 375px (OQ-6 — the drawer is counted; the SPEC's three-control shorthand would lie) · panels `grid-cols-1` (1 col) · intro `min-h-[40px]` reserves the two-line name—title wrap (by design) · `.explore-shell` `overflow-x-hidden` — horizontal scroll structurally impossible · [M] no content clipped at the viewport edges | pass — P parts green: 28/28 across tests/explore-sweep.test.mjs + tests/explore-routing.test.mjs + tests/explore-header.test.mjs (Task 3 full-sweep run); E-2 export proof green; M visual awaits the user's final pass | pass (P) · manual — user final pass (M) | tests/explore-header.test.mjs (cluster arithmetic); tests/explore-sweep.test.mjs rows EXPLORE@375 (grid, shell, intro); E-2 (header link SSRs) |
| 2 | 768 | /explore | P+M | Panels `md:grid-cols-2` (2 cols) · About `md:col-span-2` spans the first row pair · [M] two-column layout visual pass | pass — P parts green: 28/28 across the three suites (Task 3 full-sweep run); M visual awaits the user's final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs row EXPLORE@768; E-2 (header link SSRs) |
| 3 | 1440 | /explore | P+M | Panels `lg:grid-cols-3` (3 cols) · [M] three-column layout visual pass | pass — P parts green: 28/28 across the three suites (Task 3 full-sweep run); M visual awaits the user's final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs row EXPLORE@1440; E-2 (header link SSRs) |
| 4 | 1920 | /explore | P+M | Panels 3-col full-bleed (no max-width wrapper — by design, explore-panels.tsx doc block) · [M] recharts `ResponsiveContainer` stretch at ultra-wide — plausible ultra-wide finding; the disposition rule applies (a defect inside the visualization → `deferred`, OQ-5) | pass — P parts green: 28/28 across the three suites (Task 3 full-sweep run); M visual awaits the user's final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs row EXPLORE@1920; E-2 (header link SSRs) |
| 5 | 375 | / | P+M | Mobile banner renders (ASCII `<pre>` `hidden sm:block`; mobile banner div `sm:hidden`) · welcome link line fit arithmetic: 30 rendered chars ≤ 42 bound; 30 × ~8.5px ≈ 255px ≤ 359px content width (375 − 2×8px `p-2`, TerminalInterface.tsx:537); no size-class override on the line · CLI layout invariants: wrapper `overflow-hidden` ((main)/layout.tsx:16), main `overflow-auto` (:19), output lines `whitespace-pre-wrap` (TerminalInterface.tsx:568) · [M] CLI banner + bracket link visual at 375px | pass — P parts green: 28/28 across the three suites (Task 3 full-sweep run); M visual awaits the user's final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs rows CLI@375 + CLI@*; E-3 (welcome client-only → L2-only by design) |
| 6 | 768 | / | P+M | ASCII banner visible (`sm:block` from 640px) · CLI layout invariants (as row 5) · [M] visual pass | pass — P parts green: 28/28 across the three suites (Task 3 full-sweep run); M visual awaits the user's final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs rows CLI@≥768; E-3 (welcome client-only → L2-only by design) |
| 7 | 1440 | / | P+M | ASCII banner visible · CLI layout invariants (as row 5) · [M] visual pass | pass — P parts green: 28/28 across the three suites (Task 3 full-sweep run); M visual awaits the user's final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs rows CLI@≥768; E-3 (welcome client-only → L2-only by design) |
| 8 | 1920 | / | P+M | ASCII banner visible · CLI layout invariants (as row 5) · [M] visual pass | pass — P parts green: 28/28 across the three suites (Task 3 full-sweep run); M visual awaits the user's final pass | pass (P) · manual — user final pass (M) | tests/explore-sweep.test.mjs rows CLI@≥768; E-3 (welcome client-only → L2-only by design) |

## Export-level (E) rows

_Build record: `npm run build` exit 0 on 2026-09-22 (plan-03 Task 2 — the wave's single build; plans 01/02 do not build). Route table: /, /explore, /resume all ○ (Static) prerendered._

| E# | Check | Result | Evidence |
|---|---|---|---|
| E-1 | All three routes still export statically | pass | `out/index.html`, `out/explore.html`, `out/resume.html` all exist post-build (precedent tests/explore-shell.test.mjs:393-397) |
| E-2 | The header Terminal link SSRs — the /explore → CLI leg provable at export level (L3) | pass | `out/explore.html` contains `aria-label="Open the terminal"` and `href="/"` (precedent tests/explore-shell.test.mjs:423-433) |
| E-3 | The CLI welcome is client-only — documents why the welcome link + `explore` command stay L2-only | pass | `out/index.html` does NOT contain `System initialized` (0 hits; TerminalInterface mounts `ssr:false`, RESEARCH §1.7) |
| E-4 | Zero new dependencies (D-05) | pass | `package.json` dependencies length === 39 (precedent tests/explore-visuals.test.mjs:624) |
| E-5 | Two-way routing loop composite — all four legs in one assertion set | pass | WelcomeMessage `href="/explore"` (leg 1) + TerminalInterface `{ navigate: "/explore" }` / `router.push(result.navigate)`, no `window.location` (leg 2) + explore-header `href="/"` (leg 3) + `EXPLORE_TOUR_FINISH.linkHref === "/"` imported from src/components/explore/constants.ts (leg 4) |

## Guard row (D-05)

**PASS — /resume and src/data/** are byte-untouched by phase 05** (verified 2026-09-22, plan-03 Task 3). `git diff --name-only 9a940fd..HEAD -- src/app/resume scripts src/data` returned **empty** over the phase's full code-commit range (base = `9a940fd`, the last pre-code commit); the wider `cb1704b^..HEAD` range is also empty. The full phase-05 diff touches exactly the D-05 enumeration plus tests and .planning artefacts: `src/components/cli/constants.ts`, `src/components/cli/TerminalInterface.tsx`, `src/components/cli/outputs/WelcomeMessage.tsx`, `src/components/cli/outputs/HelpOutput.tsx`, `src/components/explore/explore-header.tsx`, and `tests/explore-{routing,header,sweep}.test.mjs`.

## M-row catalogue (user final pass)

Every row below is `manual — user final pass` per D-04 — rendered appearance only a human can confirm. The P/E machinery behind them is green (28/28 across the three suites + 5/5 E rows); these five checks close the sweep.

| M# | Rows covered | Manual check | How to check | Disposition if a defect shows |
|---|---|---|---|---|
| M-1 | 4 (EXPLORE@1920) | recharts `ResponsiveContainer` stretch of the Skills chart at ultra-wide | Open /explore at 1920×1080: the chart must stretch without distortion, unreadable cramming, or clipped axis labels (panels are full-bleed by design — no max-width wrapper, explore-panels.tsx doc block) | `deferred` — the chart lives in a visualization file, outside this phase's editable surfaces (OQ-5); record + one-line pointer for a later phase |
| M-2 | 1–4 (EXPLORE@375/768/1440/1920) | window-glyph dot alignment in the header | The three 10px dots stay centered and evenly gapped at all four widths; they never collide with the truncating title nor shift against the 44px px-based controls when the ≤640px 14px rem root applies | `fixed` — explore-header.tsx is a phase surface (red-first fix + pinning test) |
| M-3 | 1 (EXPLORE@375) | truncation appearance at 375px | The title is the only truncating element (ellipses cleanly); the four right-cluster controls (Tour, theme, drawer, Terminal) never crowd the glyphs or wrap | `fixed` — header cluster is a phase surface (red-first fix + pinning test) |
| M-4 | 5 (CLI@375) | CLI banner + bracket link visual at 375px | The mobile banner renders (ASCII hidden); `[ NEW → visual tour: explore ]` renders on one line in JetBrains Mono — the font split vs the Geist Mono neighbours is the locked D-01/OQ-4 wording consequence, accepted and on record | `fixed` — WelcomeMessage.tsx is a phase surface (red-first fix + pinning test) |
| M-5 | 1–8 (cross-route) | theme + tutorial-suppression persistence across a CLI → /explore navigation | Set a theme on each surface, pass the tutorial once, navigate CLI → /explore and back: themes persist on their separate keys (`portfolio-theme` / `portfolio-explore-theme`), the tutorial box stays suppressed (`cli-visited`), and the welcome link line still renders | `deferred` — persistence lives in the pre-existing theme/visited hooks, not in this phase's additive edit set (OQ-5); record + pointer |