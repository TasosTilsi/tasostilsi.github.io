All verification complete. Here is the full RESEARCH.md for the orchestrator to write to disk.

---

# Phase 2: explore-content — RESEARCH.md

**Prepared:** 2026-09-21 (gsd-phase-researcher)
**Inputs:** CONTEXT.md (D-01…D-08, locked), phase SPEC (locked), phase-2 UI-SPEC (locked design contract), PROJECT.md, codebase inspection this session.
**Provenance legend:** `[V]` = [VERIFIED: in-repo path + line range, read this session] · `[PKG]` = [VERIFIED: installed package artifact under node_modules] · `[CITED]` = [CITED: official Next.js docs] · `[A]` = [ASSUMED: training knowledge only].

---

## Domain analysis

### Stack inventory (all read this session)

| Layer | Fact | Confidence |
|---|---|---|
| Framework | Next.js **15.5.10** installed (`node_modules/next/package.json`), `output: 'export'` in `next.config.ts`; `basePath` commented out — site serves at root (user page `tasostilsi.github.io`) | [V: next.config.ts:1-24, node_modules/next/package.json] |
| React | 18.3.1 installed; App Router; explore page is a **server component** importing the JSON directly, passing name/title/intro through the client `ExploreShell` boundary — panels stay server-rendered | [V: src/app/explore/page.tsx:30-47, explore-shell.tsx:1-55] |
| CSS | Tailwind 3.4.17; `chart-1..5` tokens defined once in `:root` and shared by both themes (`--chart-2: 160 60% 45%` = experience green); IDE tokens scoped to `.explore-shell` (dark default) + `.light .explore-shell` overrides; JetBrains Mono via `--font-jetbrains` scoped to the shell | [V: src/app/globals.css:37-41, 499-566, tailwind.config.ts:47-51] |
| Icons | lucide-react **0.475.0** installed. Verified present in the installed dist **and re-exported by the main entry**: `github, linkedin, twitter, facebook, instagram, twitch, mail, globe, external-link, arrow-right, arrow-up-right, link-2, at-sign, file-text, calendar, map-pin, briefcase, circle-dot, git-commit-horizontal, square-arrow-out-up-right, package, layers, languages, wrench, cpu, award, zap, users, clock, terminal-square`, plus `Newspaper`/`NotebookPen`. **No `Medium` brand icon exists** | [PKG: node_modules/lucide-react/dist/esm/icons/*.js file listing; dist/lucide-react.d.ts:9107 (`Github`), :10836 (`Linkedin`), :12877 (`Newspaper`)] |
| Primitives | shadcn `Badge` (`src/components/ui/badge.tsx`): base `rounded-full border px-2.5 py-0.5 text-xs font-semibold`; `outline` variant = transparent bg + `text-foreground` — correct on `bg-card` in both themes. **Pitfall: default/secondary variants carry `hover:bg-*-80` and CSS `:hover` fires on divs** — static chips need `pointer-events-none` + `font-normal` override (className only; variant values not editable per UI-SPEC §17.2) | [V: src/components/ui/badge.tsx:7-17; UI-SPEC §6/§17.2] |
| Tests | **No test framework exists**: no vitest/jest/playwright configs, no `*.test.*`/`*.spec.*` files in `src`, no test scripts in package.json. CI (`deploy.yml`) runs only `npm install` + `npm run build` on Node 20 and uploads `./out` | [V: package.json scripts; .github/workflows/deploy.yml:37-58; repo-wide find] |
| Build gates | `next build` fails on TS errors by default (`typescript.ignoreBuildErrors` not set in next.config); eslint is ignored during builds (`eslint.ignoreDuringBuilds: true`), so `npm run typecheck` (`tsc --noEmit`) and `npm run lint` are separate, non-CI checks | [V: next.config.ts:6-10, package.json scripts] [CITED: https://nextjs.org/docs/app/api-reference/config/typescript — build fails on TS errors unless `typescript.ignoreBuildErrors`] |
| Static export | Phase-1 build artifacts already exist: `out/explore.html` contains the server-rendered placeholder chrome (grep found `about.profile.load() — pending` verbatim in the HTML). This proves post-build content greps against `out/explore.html` are a reliable, zero-dependency validation seam | [V: out/explore.html grep this session; src/app/explore/page.tsx:24-25 comment] [CITED: https://nextjs.org/docs/app/guides/static-exports — `output: 'export'` emits static site to `out/`] |

### Data-fidelity quick reference (the planner's content contract — all quoted verbatim this session)

**About** [V: src/data/portfolio-main-data.json:10-28]: `title` = "Senior Software Engineer in Test" (l.12), `location` = "Thessaloniki, Greece" (l.13), `description` = 430-char paragraph incl. curly apostrophe in "Master’s" and literal "(clarif-ai.net)" (l.16). `profileImageUrl` and `dob` exist but are unused this phase (D-05, UI-SPEC §17.9).

**Experience — 7 entries, reverse-chronological; first 3 are the cap set** [V: portfolio-main-data.json:30-108]:

| # | title / company | duration (verbatim) | location (verbatim) | responsibilities |
|---|---|---|---|---|
| 1 | Senior Software Engineer in Test / Chubb | `Sept 2023 — Present` (em dash) | `Leof. Georgikis Scholis 27, Thermi, 57001 Thessaloniki (Greece)` | 7 items → first 3 taken |
| 2 | Software Engineer in Test / Upstream Systems | `Sept 2022 — Aug 2023` | `Kastorias 4, Gerakas, 15344 Athens (Greece)` | exactly 3 |
| 3 | Software Engineer in Test / Netcompany-Intrasoft | `June 2019 — Sept 2022` | `Agiou Georgiou 5, Pylaia, 57001 Thessaloniki (Greece)` | exactly 3 |

- **No `isTechRelated` filter, no sorting** — D-01 pins "first 3 entries in JSON order". (An `isTechRelated` filter would coincidentally yield the same top-3 — entries 1-3 are all `true`; the non-tech entries are #5-7 — but the filter is still wrong per D-01 and is what `ResumeExperience.tsx` does — do not copy that pattern.) [V: portfolio-main-data.json:36,52,64,76,90,98,106; src/components/resume/ResumeExperience.tsx:22]
- **Dash fidelity:** top-3 durations all use spaced em dash ` — `; older entries (#4+) use plain hyphen (`November 2017 - April 2018`, l.75). Render as stored, never normalize — only em-dash variants will actually appear at top-3. [V: portfolio-main-data.json:35,51,63,75]

**Skills — 6 groups, 36 chips, JSON key order fixed** [V: portfolio-main-data.json:146-155]: `soft_skills` (6) → `hard_skills.Languages` (9) → `hard_skills.Testing` (6) → `hard_skills.Infrastructure` (6) → `hard_skills.Innovation` (7) → `languages` (2: `Greek (Native)`, `English (Fluent)`). `hard_skills` is typed `{ [category: string]: string[] }` — group ORDER is JSON key order (no sorting); the §6 key→label chrome map (`soft_skills`→"Soft Skills", `languages`→"Languages", etc.) is structural chrome, allowed per SPEC. [V: portfolio-main-data.d.ts:80-86; UI-SPEC §6]

**Projects — 14 entries; first 6 = cap set** [V: portfolio-main-data.json:172-186]: Clarif-AI, DeepIndex, SDK4ED-TD, ServicedMetricsCalculator, Avoid Traffic Extended, Uom Track. **All 6 carry `link`**; only DeepIndex also carries `sourceUrl` (NOT rendered, UI-SPEC §7). All 6 have `date` (`2026`, `2026`, `June 2023`, `June 2023`, `May 2022`, `December 2021`). DeepIndex's ~200-char description wraps to 4-5 lines at 419px — accepted, no clamping. Top-6 cap matches the resume modal: `<ResumeProjects data limit={6}>` at `ResumeView.tsx:146` → `slice(0, limit)` [V: src/components/resume/ResumeView.tsx:146, ResumeProjects.tsx:11-16]. Note the CLI's own `projects` command shows first **7** (`ProjectsOutput.tsx:14`) — the /explore cap is 6 (resume-modal precedent), pointer invites `projects --all` (14) — the three surfaces' caps are intentionally different; do not "align" them.

**Contact — all 9 channels present** [V: portfolio-main-data.json:17-27]: `email, linkedin, github, medium, facebook, instagram, twitter, twitch, portfolio` in that JSON key order. Fidelity facts the planner must respect:
- `linkedin`, `github`, `facebook`, `instagram`, `twitch` are **`http://`** (not https) — render href as stored, no upgrade logic (UI-SPEC §11 "no repair logic"; links are navigation, not mixed content).
- `portfolio` = `https://tasostilsi.github.io/` — **self-referential** (opens the CLI root of this very site). Render as-is per data fidelity; it is simply a normal external row labelled "Portfolio".
- Email row: visible value = the address, `href="mailto:"` prefix is the only protocol literal allowed (chrome, UI-SPEC §17.4). CLI precedent: `ContactOutput.tsx:46-49` branches mailto vs new-tab the same way.
- CLI's `ContactOutput.tsx` renders only 8 channels (no `portfolio`) — /explore's 9-channel requirement (D-01) is deliberately a superset. Do not reuse `ContactOutput`'s filtering (`isValidUrl` drops nothing today, but the shape differs). [V: src/components/cli/outputs/ContactOutput.tsx:10-22]

### Established patterns to reuse

1. **JSON import + type cast** — the repo-wide pattern: `import portfolioDataJson from '@/data/portfolio-main-data.json'; import type { PortfolioData } from '@/data/portfolio-main-data'; const portfolioData = portfolioDataJson as PortfolioData;` [V: src/components/cli/outputs/ContactOutput.tsx:3-7]. `resolveJsonModule: true` in tsconfig; `@/*` → `./src/*`. [V: tsconfig.json compilerOptions]
2. **Server-component section bodies** — no `"use client"`, no hooks; data flows `page.tsx → panels → sections` as props (UI-SPEC §2). `ExploreShell` passes server children through untouched. [V: explore-shell.tsx:17-18]
3. **Chrome constants module** — locked strings live in `src/components/explore/constants.ts`; new chrome (pointer strings, label maps) follows that shape or a colocated `sections/` constant. [V: constants.ts:10-52]
4. **Section id + aria-label preserved** — `<section id aria-label>` + chrome row (accent chip + `h2 text-sm font-medium`) stay byte-identical; drawer anchors `href={#${section.id}}` target those ids. [V: panel-placeholder.tsx:37-48, explore-drawer.tsx:53-69]
5. **Focus ring recipe** — `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background` (UI-SPEC §14); touch rows `min-h-[44px]` real px (≤640px rem-shrink trap, `globals.css` html font-size rule). [V: globals.css:464-467 per UI-SPEC §0; explore-drawer.tsx:59]

### Pitfalls (each one observed in this repo)

- **P-1 — Badge hover flicker on static chips** (above).
- **P-2 — `EXPLORE_PANEL_HUMOR` + `PanelPlaceholder` become dead code.** Only `explore-panels.tsx` imports them (grep this session — no other consumer). UI-SPEC §2/§17.12 permits deleting them, but the chrome-row + grid classes they carried must re-appear byte-identical in the replacement wiring. [V: grep src — matches only in explore-panels.tsx:6,8,23,26,41,45 and the definitions]
- **P-3 — `ui/skeleton.tsx` must NOT be deleted** — `ui/sidebar.tsx` still imports it; only panels stop using it. [V: UI-SPEC §0 row; sidebar.tsx import noted by ui-researcher]
- **P-4 — 375px panel content width is only ~309px** (375 − 2×16 shell padding − 2×16 panel padding − 2×1 border) → `break-all` on URL value lines, `min-w-0` on flex children, no `flex-wrap` on the project-card header row (name wraps internally, date stays pinned right), full street addresses wrap to 2 lines. [V: UI-SPEC §0 width math, §12 matrix]
- **P-5 — `next build` does NOT run eslint** (`ignoreDuringBuilds: true`) but DOES run TypeScript — type safety of the `PortfolioData` prop chain is enforced by both `build` and `npm run typecheck`. Lint is a soft check only. [V: next.config.ts:8-10]
- **P-6 — No new animations:** the phase-1 reduced-motion guard in globals.css already covers the shell; the only permitted motion is `transition-colors` on the 16 link elements (UI-SPEC §13, §10).
- **P-7 — JSON literal types vs `PortfolioData`:** the raw JSON import carries TS-inferred literal types; the established `as PortfolioData` cast (pattern #1) is what makes optional fields (`date?`, `link?`, `sourceUrl?`, `responsibilities?`, contact optionals) correctly nullable for the §11 graceful-hide branches. Don't render straight from the inferred type.

---

## Package legitimacy

**Zero new dependencies is a locked decision (D-08, UI-SPEC §17.3) — none proposed.** Verification of the packages this phase touches, all read from the installed tree this session:

| Package | Version (installed) | Role | Evidence |
|---|---|---|---|
| `next` | 15.5.10 | SSG build, `next/link` for /resume | [PKG: node_modules/next/package.json] |
| `react` / `react-dom` | 18.3.1 | Server components | [PKG: node_modules/react/package.json] |
| `lucide-react` | 0.475.0 | All section icons (16 link icons + decorative icons) | [PKG: dist/esm/icons listing + dist/lucide-react.d.ts:9107,10836] — every icon the UI-SPEC maps (`Mail, Linkedin, Github, PenLine, Facebook, Instagram, Twitter, Twitch, Globe, FileText, ArrowRight, ArrowUpRight, MapPin, Briefcase`) confirmed shipped by the main entry |
| `tailwindcss` | 3.4.17 | Tokens/utilities only | [PKG: node_modules/tailwindcss/package.json] |
| `class-variance-authority` | (already a working dep of badge.tsx) | No direct use planned | [V: src/components/ui/badge.tsx:1-3] |
| `recharts` | ^2.15.1 in package.json | **NOT touched this phase** (phase 3) | [V: package.json dependencies] |

Note: lucide brand icons (`Github`, `Linkedin`, `Twitter`, `Facebook`, `Instagram`, `Twitch`) are deprecated upstream but fully present in 0.475.0 — using them as-is is correct for this pinned version; no replacement needed. There is **no `Medium` icon** in lucide (verified by dist listing) — the UI-SPEC §8 substitute `PenLine` is confirmed present. [PKG + UI-SPEC §8]

---

## Risks

| # | Risk | Mitigation |
|---|---|---|
| R-1 | Stale planning artifacts: `EXPLORE-02-explore-content-01-PLAN.md` and `-02-PLAN.md` already exist in the phase dir from a prior planning pass (no SUMMARYs — execution never ran). A replan must not leave a stale plan mix. | Planner regenerates both plans wholesale; orchestrator should treat existing PLAN files as superseded. [V: .planning/phases/EXPLORE-02-explore-content/ file listing + plan frontmatter this session] |
| R-2 | Dead-code deletion (P-2) accidentally drops phase-1 chrome classes (accent chip, header row, grid classes, About spans). | Byte-identical chrome re-appearance is a must_have; grep-diff of rendered chrome between old `explore-panels.tsx` and new wiring. |
| R-3 | 375px overflow from long unbroken tokens (URLs, DeepIndex description) or fixed-width flex children. | §3/§11/§12 contract: `break-all` on URL values, `min-w-0`, no `flex-wrap` on card header, no `truncate`/`line-clamp-*`/`whitespace-nowrap` anywhere on content. Static class audit is automated (below). |
| R-4 | Silently normalizing data (https-upgrading URLs, prettifying durations, re-sorting skills) breaks the strict-fidelity requirement (D-01, user choice "location = full address as-is"). | §11 "no repair logic" pins: render as stored; only structure (labels/icons/pointers) is chrome. |
| R-5 | 375/768/1440 visual acceptance ("one screenful", scannability) has no browser automation in this repo — it cannot be proven by the build alone. | Accept as Manual-Only in the validation matrix (below); automate everything that IS statically checkable (content greps on `out/explore.html`). |
| R-6 | `next/link` for `Full resume →` inside a statically exported app — `/resume` must exist as a route (it does, `src/app/resume/page.tsx`) and must NOT be nested under the CLI shell. | Verified: `src/app/resume/` is a top-level sibling of `(main)`; explore is likewise a sibling. [V: src/app tree listing] |

---

## Open Questions

- **OQ-1 — Delete or keep `PanelPlaceholder` / `EXPLORE_PANEL_HUMOR` after replacement?** (RESOLVED) — UI-SPEC §2/§17.12: removal permitted as explore-owned dead code; only `explore-panels.tsx` imports them (verified by grep this session). Recommendation: delete both after the new wiring renders chrome byte-identically; keep `EXPLORE_SECTIONS`/`ExploreSectionId` (still used by drawer/status-bar).
- **OQ-2 — Data flow: props down from `page.tsx` vs per-component JSON imports?** (RESOLVED) — UI-SPEC §2 pins "data flows page.tsx → panels → sections as props" with server components; single JSON import at the page level, typed `PortfolioData` via the established cast (pattern #1).
- **OQ-3 — How to treat the self-referential `portfolio` contact channel (links to this site's root)?** (RESOLVED) — render as-is per data fidelity as a normal "Portfolio" row (UI-SPEC §8 renders all 9). No special-casing; it is external-link shape, new tab like the rest.
- **OQ-4 — Medium icon gap.** (RESOLVED) — No Medium brand icon exists in lucide 0.475.0 (verified dist listing); UI-SPEC §8 substitutes `PenLine`. Use the UI-SPEC map verbatim.
- **OQ-5 — Apply `isTechRelated` filter to experience like `ResumeExperience.tsx` does?** (RESOLVED) — No. D-01/SPEC pin "first 3 entries in JSON order, no sorting"; the filter is a Resume* behaviour that must not leak in (Resume* components are explicitly untouched/unreused). Top-3 are all `isTechRelated: true` anyway.
- **OQ-6 — Bullet-count fallback if a role has <3 responsibilities.** (RESOLVED) — CONTEXT discretion + UI-SPEC §11: render what exists, no padding; all