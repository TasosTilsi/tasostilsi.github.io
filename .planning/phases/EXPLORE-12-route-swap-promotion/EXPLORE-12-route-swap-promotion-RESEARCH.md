Research complete. Here is the full RESEARCH.md content.

---

````markdown
# Phase 12: route-swap-promotion — RESEARCH

**Phase:** 12 · **Milestone:** Explore Visual Landing (v1.0) · **Requirement:** REV-22
**Gathered:** 2026-10-02 · **Author:** gsd-phase-researcher (fresh context)
**Status:** Complete — all Open Questions RESOLVED, planning may proceed

---

## 1. Provenance, method, and how to read this

Every claim below carries one of three tags:

- **[VERIFIED: <source>]** — confirmed this session by a tool against the real target (repo read, installed package, built artifact in `out/`, or the live `https://tasostilsi.github.io`).
- **[CITED: <url>]** — quoted from an authoritative external reference.
- **[ASSUMED]** — training knowledge or inference, not directly confirmed. Flagged so the plan-checker can challenge it.

**Method.** Read-only recon of the working tree at `/home/tasostilsi/Development/Projects/tasostilsi.github.io` on branch `phase-12` (HEAD `e2e9ec2`): the route tree, both layouts, both pages, all four link sites, the status bar, the constants module, `next.config.ts`, `package.json`, the CI workflow, the current `out/` export, and the full `tests/` suite (13 files). Then three live checks against the deployment target and three official-docs fetches.

**No files were written.** The orchestrator owns the write.

**Scope discipline.** CONTEXT.md `## Decisions` D-01…D-04 are LOCKED. This document researches *how* to implement them. Where a locked decision is **technically impossible as literally worded**, that is called out explicitly (§3.1) with the minimal correction that preserves the decision's stated outcome — not a re-litigation of the decision.

---

## 2. Repo evidence baseline (all re-quotable, all measured this session)

### 2.1 Route tree — [VERIFIED: `find src/app -maxdepth 3 -type f`]

```
src/app/layout.tsx          → root layout (GA + JSON-LD + viewport + metadata + both fonts)
src/app/globals.css
src/app/not-found.tsx       → global 404, 'use client'
src/app/favicon.png
src/app/page.tsx            → DOES NOT EXIST
src/app/explore/layout.tsx  → before-paint theme script + explore metadata
src/app/explore/page.tsx    → the explore shell composition (server component)
src/app/(main)/layout.tsx   → the CLI's h-screen overflow-hidden wrapper
src/app/(main)/page.tsx     → the CLI terminal page ('use client', dynamic ssr:false)
src/app/resume/page.tsx     → print resume (no metadata export)
```

### 2.2 Discrete values, quoted verbatim with path + line range

| Value | Location | Verbatim |
|---|---|---|
| Static export enabled | `next.config.ts:5` | `output: 'export',` — **no `trailingSlash` key anywhere in the file** |
| Root title | `src/app/layout.tsx:31` | `` `${portfolioData.about.name} | ${portfolioData.about.title} | Interactive CLI Portfolio` `` |
| Root OG title | `src/app/layout.tsx:36` | `` title: `${portfolioData.about.name} | Interactive CLI Portfolio`, `` |
| Root twitter title | `src/app/layout.tsx:53` | `` title: `${portfolioData.about.name} | Interactive CLI Portfolio`, `` |
| Root `metadataBase` | `src/app/layout.tsx:30` | `new URL('https://tasostilsi.github.io')` |
| JSON-LD `url` | `src/app/layout.tsx:76` | `"url": "https://tasostilsi.github.io/"` |
| `<html>` / `<body>` chrome | `src/app/layout.tsx:101`, `:129` | `className="h-full"` · `` className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} font-mono antialiased h-full flex flex-col`} `` |
| Explore metadata | `src/app/explore/layout.tsx:34` | `` title: `${portfolioData.about.name} | ${portfolioData.about.title} | Visual Portfolio Explorer`, `` (plus `description` only — **no `openGraph`, no `twitter`**) |
| Before-paint script | `src/app/explore/layout.tsx:19-27` | `themeInitScript` — `localStorage.getItem("${EXPLORE_THEME_STORAGE_KEY}")`, `classList.remove("dark", "light")`, add `light` iff stored === `"light"`, else `dark` |
| CLI shell wrapper | `src/app/(main)/layout.tsx:16` | `"flex flex-col h-screen bg-background text-foreground font-mono overflow-hidden"` |
| CLI main | `src/app/(main)/layout.tsx:19` | `"flex-grow overflow-auto"` |
| CLI page head | `src/app/(main)/page.tsx:1`, `:8-15` | `'use client';` + `dynamic(..., { ssr: false, loading: () => <TerminalLoader /> })` |
| Breadcrumb user | `src/components/explore/constants.ts:45` | `export const EXPLORE_STATUS_USER = "guest@tasostilsi";` |
| **Breadcrumb path** | `src/components/explore/constants.ts:46` | `export const EXPLORE_STATUS_PATH = ":~/explore";` |
| Tour finish target | `src/components/explore/constants.ts:98-103` | `EXPLORE_TOUR_FINISH = { congrats, linkLabel: "Open the terminal →", linkHref: "/", hint }` |
| Status-bar footer classes | `src/components/explore/explore-status-bar.tsx:34` | `"flex h-7 shrink-0 items-center justify-between border-t px-3 text-[10px] sm:h-8 sm:px-4 sm:text-xs"` |
| Status-bar left group | `src/components/explore/explore-status-bar.tsx:35-38` | bare `<p>` (no `min-w-0`, no `truncate`) |
| Status-bar right group | `src/components/explore/explore-status-bar.tsx:39-51` | `<p aria-live="polite" className="text-muted-foreground">` wrapping theme span + counter span |
| Header Terminal link | `src/components/explore/explore-header.tsx:105-111` | `<Link href="/" aria-label="Open the terminal" …>` — rightmost control |
| Drawer title | `src/components/explore/explore-drawer.tsx:55` | `<SheetTitle>~/explore</SheetTitle>` |
| CLI welcome link | `src/components/cli/outputs/WelcomeMessage.tsx:71` | `<Link href="/explore" className="text-accent">explore</Link>` inside `[ NEW → visual tour: explore ]` |
| CLI `explore` command | `src/components/cli/TerminalInterface.tsx:297-298` | `case "explore":` → `return { navigate: "/explore" };` |
| CLI navigate flow | `src/components/cli/TerminalInterface.tsx:403`, `:412` | chrome line `[ opening the visual tour... ]` → 600 ms → `router.push(result.navigate)` |
| **6th link site (undocumented)** | `src/app/not-found.tsx:104-110` | `<Link href="/">` with the visible label **"Return to Terminal"** |
| Root font-size shrink | `src/app/globals.css:464-467` | `@media (max-width: 640px) { html { font-size: 14px; } }` |
| Arrow-nudge hook | `src/app/globals.css:635-640` | `.explore-shell .exp-nudge { transition: transform 220ms … }` + `.explore-shell a:hover .exp-nudge, .explore-shell a:focus-visible .exp-nudge { transform: translateX(2px); }` |
| Radius token | `tailwind.config.ts:64-68` | `md: 'calc(var(--radius) - 2px)'` |

### 2.3 Current export artifacts — [VERIFIED: `ls out/`]

```
404.html  explore.html  explore.txt  index.html  index.txt  resume-export.html
resume.html  resume.txt  robots.txt  sitemap.xml  _next/
```

`out/cli.html` does **not** exist. `/resume` → `out/resume.html` confirms the naming convention for a non-index route under `output: 'export'` with no `trailingSlash`.

### 2.4 Live deployment baseline — [VERIFIED: fetched `https://tasostilsi.github.io/` and `/resume` and `/explore`]

| URL | Result |
|---|---|
| `https://tasostilsi.github.io/` | **HTTP 200, the CLI terminal** — body renders `terminal`, `$ Initializing terminal interface...`, `› Loading portfolio data...`, `› Setting up CLI environment...`. Confirms SPEC *Current*: `/` is the CLI. |
| `https://tasostilsi.github.io/resume` | **HTTP 200, the resume page** — served from `resume.html` with **no directory and no redirect**. |
| `https://tasostilsi.github.io/explore` | **HTTP 404.** Confirms CONTEXT's "never shipped to GitHub Pages". |

**This is the phase's most important empirical result.** The whole phase is a bet that `href="/cli"` resolves when only `out/cli.html` exists on the host. `/resume` already proves that exact mechanism against the exact host, with the exact exporter config. The bet is already won in production, once, today.

Corroboration from external references:
- [CITED: https://til.simonwillison.net/github/github-pages] — "`/foo` will serve content from `foo.html`, if it exists."
- [CITED: https://rsp.github.io/gh-pages-no-extension/] — "to remove .html extension from GitHub Pages all you have to do is remove .html extension from your links … it already works."
- [CITED: https://nextjs.org/docs/app/building-your-application/deploying/static-exports] — the `trailingSlash` option is documented as *"Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`"*, i.e. **without** it, `/me` emits `/me.html`. This is the canonical statement of the §2.3 observation.

### 2.5 Test-suite topology — [VERIFIED: repo-wide grep of `tests/*.mjs`]

13 suites, all `node --test`, zero npm deps. There is **no `test` script in `package.json`** — the house gate is `npm run typecheck && npm run build && node --test tests/*.test.mjs`.

**Suites that read `out/`** (must run after `npm run build`):

| Suite | `out/` refs | `out/explore.html` refs (incl. comments) |
|---|---|---|
| `tests/explore-visuals.test.mjs` | 13 | 8 |
| `tests/explore-sweep.test.mjs` | 12 | 10 |
| `tests/explore-shell.test.mjs` | 11 | 7 |
| `tests/explore-tour.test.mjs` | 6 | 5 |
| `tests/credentials-panel.test.mjs` | 5 | 4 |
| `tests/explore-header.test.mjs` | 1 | 1 (comment only, line 18) |
| **Total** | **48** | **35** |

**Suites that read route-path literals in `src/app/`** (stale-path hazard):

```
tests/explore-shell.test.mjs:65   read('src/app/explore/layout.tsx')
tests/explore-shell.test.mjs:98   ['src/app/explore/page.tsx', 'src/components/explore/explore-shell.tsx']
tests/explore-shell.test.mjs:107  read('src/app/explore/page.tsx')
tests/explore-shell.test.mjs:220  read('src/app/explore/page.tsx')
tests/explore-shell.test.mjs:300  read('src/app/explore/page.tsx')
tests/explore-shell.test.mjs:427  read('src/app/explore/page.tsx')
tests/explore-sweep.test.mjs:151  read('src/app/(main)/layout.tsx')
```

**The six suites that assert on route targets / route names** (the composite and stale rows):

| File | Lines | What it pins today |
|---|---|---|
| `tests/explore-sweep.test.mjs` | `240-243` | route existence: `{ out/index.html, out/explore.html, out/resume.html }` |
| | `245-252` (E-2) | header link `href="/"` present in `out/explore.html` |
| | `255-259` (E-3) | `out/index.html` does **not** contain `System initialized` (CLI is client-only) |
| | `276-296` (E-5) | **the four-leg two-way composite**: `href="/explore"` / `{ navigate: "/explore" }` / `href="/"` / `EXPLORE_TOUR_FINISH.linkHref === '/'` |
| | `165-180` | welcome-line fit arithmetic, `block.includes('<Link href="/explore"')`, rendered text pinned to `'[ NEW → visual tour: explore ]'`, ≤ 42 chars |
| `tests/explore-routing.test.mjs` | `74-92` | `href="/explore"` exactly once, no `target=` anywhere (same-tab) |
| | `94-122` | the locked bracket-line render order |
| | `128-154` | `case "explore":` + `{ navigate: "/explore" }` + `router.push(result.navigate)` + exactly 40 `case "` occurrences |
| | `197-212` | guards: dependency count `=== 39`; `EXPLORE_TOUR_FINISH.linkHref === '/'` |
| `tests/explore-header.test.mjs` | `192-199` | finish-card regression guard `linkHref === '/'`, label `'Open the terminal →'` |
| `tests/explore-tour.test.mjs` | `153` | `linkHref === '/'` at the end of the **tour copy digit guard** (`:139-152`) |
| | `608-616` | status bar: `aria-live="polite"` + live counter + `text-accent` |
| | `630-641` | export: literal `0/5 sections visited` in `out/explore.html` |
| `tests/explore-shell.test.mjs` | `44-45` | constants pin `'"guest@tasostilsi"'` and `'":~/explore"'` |
| | `80-95` | status-bar rows (substring-based, additive-safe) |
| | `96-127` | `page + shell` must not contain `h-screen`, **and the source list is `.filter(existsSync)`-ed** |
| | `452-462` | export row reads `out/explore.html`, asserts `':~/explore'`, `'0/5 sections visited'`, the before-paint script |
| | `468-469` | `out/index.html` **and** `out/resume.html` still emitted |
| | `241` | drawer `~/explore` chrome copy pinned |
| `tests/credentials-panel.test.mjs` | `39-42` | `exportHtmlPath = join(root, 'out/explore.html')` |
| `tests/explore-visuals.test.mjs` | `687-688`, `794-795`, `802` | `out/explore.html` reads; `out/index.html` + `out/resume.html` existence; `out/_next` CSS dir |
| **Bans that constrain the new chip** | `explore-visuals.test.mjs:598-640` | `.animate(`, `gsap`, `lottie` banned in **every** `src/components/explore/*.ts{,x}`; `framer-motion` allowed **only** in `projects-stack-stage.tsx`; tour rAF counts frozen at 5/3 |
| | `explore-tour.test.mjs:38-52` | disjointness on the literal CLI **storage keys** (`'portfolio-theme'`, `'portfolioCliFoundEasterEggs'`) — **not** on the token `cli` |
| | `explore-tour.test.mjs:139-152` | every `EXPLORE_TOUR_FINISH` string (including `linkHref`) must be digit-free after stripping `60` |

**Route-string noise today — [VERIFIED: `grep -rl "/explore" out/`]** exactly 4 files:
`out/_next/static/chunks/app/explore/page-86c589961abc2d37.js`, `out/_next/static/chunks/37.e93bfa7b421b481d.js` (the shared chunk that carries the `WelcomeMessage` href and the `TerminalInterface` navigate sentinel), `out/explore.html`, `out/explore.txt`. **Zero hits in `out/index.html`.** A post-swap `grep -rl "/explore" out/` returning empty is therefore a genuine whole-artifact falsifier.

### 2.6 Non-`src` references — [VERIFIED: repo-wide grep]

- `README.md`, `docs/`, `scripts/`, `.github/` — **zero** `/explore` or `/cli` references.
- `PRODUCT.md` (root, **untracked** — `?? PRODUCT.md` in `git status`) references `/explore` at lines 13, 20, 24, 36, 45, 53. Not part of the committed deliverable.
- `public/sitemap.xml` contains exactly one `<loc>https://tasostilsi.github.io/</loc>` — already correct after the swap (it points at the new landing). Its `<lastmod>` is a literal un-evaluated template string `${new Date()…}` — a pre-existing bug, **out of scope** per CONTEXT's deferred list.
- `.claude/`, `.cursor/`, `.omc/`, `.serena/` — tooling, not product surfaces.

---

## 3. Domain analysis

### 3.1 Route groups cannot create a URL segment — HIGH confidence — **CORRECTS D-01's parenthetical**

**Finding.** D-01 reads: *"the (main) route group restructures: either a **(cli) group rename** or /cli with its own layout.tsx."* A route-group rename is **not** an option: renaming `(main)` to `(cli)` leaves the CLI page resolving to `/`, because a route group's name is explicitly excluded from the URL path.

[CITED: https://nextjs.org/docs/app/building-your-application/routing/route-groups] — *"A route group can be created by wrapping a folder's name in parenthesis: `(folderName)`. This convention indicates the folder is for organizational purposes and **should not be included in the route's URL path**."*

**Therefore the only implementation that satisfies D-01's stated outcome** ("/cli serves the CLI terminal, keeping its terminal layout") is:

```
src/app/(main)/layout.tsx  →  src/app/cli/layout.tsx     (byte-identical; `import '../globals.css'` still resolves to src/app/globals.css)
src/app/(main)/page.tsx    →  src/app/cli/page.tsx       (byte-identical; 'use client' + dynamic ssr:false preserved)
src/app/(main)/            →  DELETED (the folder must not survive empty or with any page)
```

This is a **pure file move with zero content edits**, which is exactly the D-01 constraint ("whichever preserves the CLI's h-screen overflow-hidden shell exactly"). The `../globals.css` relative import depth is unchanged (both files sit at `src/app/<x>/`).

**Corollary — the landing.** The landing must be provided by either:
- **(A) route group + layout (RECOMMENDED):** `git mv src/app/explore src/app/\(home\)` → `src/app/(home)/layout.tsx` + `src/app/(home)/page.tsx`. URL stays `/`. Route-scoped layout preserved (UI-SPEC §4.4's literal suggestion, §10 `PLANNER-CHOICE`), the before-paint script's blast radius stays one route, and `tests/explore-shell.test.mjs:65`'s "read the layout for the theme script" row survives with a one-line path change.
- **(B) plain `src/app/page.tsx`** with the script inlined and `export const metadata` on the page. UI-SPEC explicitly allows "an equivalent scoped layout", and a server-component layout fragment and a page's first child render to the same place in `<body>`. But it deletes the layout file, so `explore-shell.test.mjs:65` must be **rewritten** rather than repathed, and it diverges from UI-SPEC §4.4's letter.

**Recommendation: (A).** Smaller conceptual diff, fewer test rewrites, matches the sealed UI-SPEC.

### 3.2 Conflicting paths force atomicity — HIGH confidence

[CITED: same route-groups page] — *"Conflicting paths: Routes in different groups should not resolve to the same URL path. For example, `(marketing)/about/page.js` and `(shop)/about/page.js` would both resolve to `/about` and **cause an error**."*

**Consequence for the plan's commit granularity.** While both `src/app/(main)/page.tsx` and `src/app/(home)/page.tsx` exist, the tree has two providers of `/` and `next build` fails. The route move is therefore **one atomic task, one commit**:

1. delete `src/app/(main)/`
2. create `src/app/cli/layout.tsx` + `src/app/cli/page.tsx` (moved verbatim)
3. move `src/app/explore/` → `src/app/(home)/`
4. rewire all six link sites + the breadcrumb constant
5. renew the stale test rows

A half-landed rename leaves `npm run build` red, and per the repo's own precedent (`EXPLORE-11-…-01-PLAN.md:172` — "the MERGE HOLD: the branch must not be merged or handed off as green until … the full-suite run is on record") the branch is knowingly red until the last row lands. The plan should state this as an explicit hold, exactly as phase 11 did.

### 3.3 The before-paint script must stay route-scoped — HIGH confidence

The script at `src/app/explore/layout.tsx:19-27` unconditionally does `document.documentElement.classList.remove("dark", "light")` then adds one class derived from **`portfolio-explore-theme`**. The CLI writes **`portfolio-theme`** (declared `src/components/cli/constants.ts:65`, asserted distinct by `tests/explore-shell.test.mjs:41` and `tests/explore-tour.test.mjs:45`).

If that script moved into `src/app/layout.tsx`, it would run on `/cli` and `/resume` too, strip the CLI's own `<html>` classes at every boot, and rebuild them from the wrong storage key. D-02's "the ROOT layout keeps GA + JSON-LD + viewport" is therefore not merely a preference — putting the script there is a **BLOCKER-class defect**. UI-SPEC §4.4 states the same rule; this research confirms the mechanism from the source.

Root layout already carries `suppressHydrationWarning` (`src/app/layout.tsx:101`), so the pre-hydration class mutation remains safe wherever the script lives.

### 3.4 Metadata inheritance — measured, not assumed — HIGH confidence

The explore layout defines **only** `title` + `description` (`src/app/explore/layout.tsx:33-36`). The root layout defines `title`, `description`, `keywords`, `authors`, `openGraph`, `twitter`.

**Measured in the currently-built artifact** — [VERIFIED: `out/explore.html`, built from the current tree]:

| Tag in `out/explore.html` | Value | Origin |
|---|---|---|
| `<title>` | `… | Visual Portfolio Explorer` | explore layout — **overrode** root |
| `property="og:title"` | `Anastasios Tilsizoglou \| Interactive CLI Portfolio` | **root layout — survived** |
| `name="twitter:title"` | `Anastasios Tilsizoglou \| Interactive CLI Portfolio` | **root layout — survived** |
| `name="description"` | `portfolioData.meta.description` | explore layout (identical string to root's) |

**Implication — this is a real trap.** D-02 asks for "explore experience branding — title/description/OG". A landing layout that copies the *existing* pattern (title + description only) will satisfy `title` and silently keep the **CLI-branded OG/twitter card** — the one piece of metadata recruiters actually see when the link is pasted into Slack or LinkedIn. The landing layout must define `openGraph` and `twitter` explicitly.

Because `metadataBase` lives in the root layout (`:30`), relative OG image URLs defined on the landing still resolve correctly. The general merge rule is [ASSUMED] (per-top-level-field override, nested objects replaced only when the child declares that key); **the specific observable above is [VERIFIED]** and is sufficient to plan against. The renewal row should assert the built `out/index.html` contains the *Visual Portfolio Explorer* wording inside `og:title`, not just in `<title>` — that is the falsifier for D-02.

### 3.5 Root metadata should be left untouched — HIGH confidence

D-02 pins root = GA + JSON-LD + viewport and gives the CLI branding to `/cli`. It is silent on whether root's `title` string changes. Root's title is also what `/resume` inherits today (`src/app/resume/page.tsx` has no metadata export) — confirmed against the live deployment, where `/resume`'s `<title>` is `Anastasios Tilsizoglou | Senior Software Engineer in Test | Interactive CLI Portfolio` [VERIFIED: live fetch].

**Recommendation: change nothing in root's metadata.** Editing it would alter `/resume`'s page title for no requirement, and the JSON-LD `Person` schema URLs stay correct precisely because root is untouched. The `/cli` layout then declares the CLI branding explicitly (identical string to root's today → zero visual delta, but satisfies D-02 literally and keeps the branding co-located with the route).

### 3.6 The cross-surface link inventory is six sites, not five — HIGH confidence

SPEC's acceptance enumerates five: CLI welcome link, `explore` command, header Terminal link, wizard finish card, status-bar chip. **[VERIFIED: `grep -rn 'href="/"' src/`]** returns exactly two hits:

```
src/components/explore/explore-header.tsx:106   (in scope — D-03)
src/app/not-found.tsx:105                       (NOT enumerated)
```

`src/app/not-found.tsx:104-110` renders a `<Link href="/">` whose visible label is **"Return to Terminal"**, inside a page whose copy says `terminal — 404`, `Tip: Type 'help' in the terminal to see all available commands`. After the swap that button lands on the **explore** page while promising the terminal. Because `output: 'export'` emits `out/404.html` and GitHub Pages serves it for every unknown path — **including the now-deleted `/explore`** — this is the single most-travelled page of the old route.

**Recommendation: rewire it (one token, `href="/"` → `href="/cli"`), and add it as leg 6 of the composite.** Rationale grounded in the SPEC's own acceptance wording ("all cross-surface links … verified navigable") and the `cross-surface-links` discipline (map both directions; add entry points on both sides). It is a one-token change to an already-loaded client component with no test that pins `href="/"` there — zero blast radius. The plan should record it as a **deliberate, declared 6th site** so the plan-checker does not read it as scope creep.

### 3.7 `~/explore` in the drawer is deliberately left alone — HIGH confidence

`src/components/explore/explore-drawer.tsx:55` renders `<SheetTitle>~/explore</SheetTitle>`, pinned by `tests/explore-shell.test.mjs:241`. After the swap, the breadcrumb reads `:~` but the drawer title still says `~/explore`.

**Resolution: leave it.** UI-SPEC §9 explicitly instructs "Do not touch the panels, **drawer**, tour card internals, counter logic, theme hooks, or data", and §2.1's visual-delta table lists the status-bar breadcrumb only — not the drawer title. Changing it would also require editing the test that pins it, expanding a route-rename phase into a chrome-review phase. **Record it as accepted cosmetic debt** with a one-line pointer for a future chrome pass. (Note the asymmetry is defensible on its own terms: `~/explore` names the *panel group* — the visual-exploration surface — while `:~` is the shell's *prompt*, which is now the site root.)

### 3.8 Static-export artifact shape — HIGH confidence

`/cli` with `output: 'export'` and no `trailingSlash` emits **`out/cli.html`** (and `out/cli.txt` RSC payload). Evidence: `out/resume.html` exists for the `/resume` route today [VERIFIED §2.3]; the docs describe `trailingSlash` as the option that *changes* this to `cli/index.html` [CITED §2.4]; and the live host serves `/resume` from `resume.html` [VERIFIED §2.4].

**The href form and the artifact shape are one decision** (UI-SPEC §6 says the same). With `out/cli.html`, all four `/cli` hrefs are `"/cli"` — no trailing slash. **Do not add `trailingSlash: true`:** it would break the already-working `/resume` link in `src/components/explore/sections/about-section.tsx:221` and change every existing URL on the site. The verification row should assert **both** `existsSync(out/cli.html)` and `!existsSync(out/cli/index.html)` so a future `trailingSlash` flip fails loudly instead of silently 404-ing the chip.

`actions/configure-pages@v5` with `static_site_generator: next` is documented to auto-inject `basePath` for project pages [CITED: https://github.com/actions/configure-pages] (with a known issue for custom domains, [CITED: https://github.com/actions/configure-pages/issues/67]). This repo is the **user-page** repo (`tasostilsi.github.io`), so `basePath` is empty; the live site's working root-relative assets and the working `/resume` confirm no basePath is applied today. **No action.** [ASSUMED: that this stays true — the deploy workflow is unchanged by this phase.]

### 3.9 Pitfalls catalogue (all grounded in the repo, not generic advice)

| # | Pitfall | Evidence | Mitigation |
|---|---|---|---|
| P-1 | `.filter(existsSync)` makes stale test paths **silently pass** | `tests/explore-shell.test.mjs:97-99` — `['src/app/explore/page.tsx', …].filter((p) => existsSync(join(root, p)))`. After the move, the array silently drops the page and the `!code.includes('h-screen')` guard at `:127` degrades to checking only `explore-shell.tsx`. | **Repath, never rely on the filter.** Add an explicit `assert.ok(existsSync(...))` for the landing page before the guard. |
| P-2 | The `:~/explore` string lives in **two** places (constant + two test rows) | `constants.ts:46`, `explore-shell.test.mjs:45`, `explore-shell.test.mjs:458` | Renew all three in the same commit. `:458` reads the **export**, so it needs a rebuild first. |
| P-3 | A naive `grep '/explore' src/` ban fails on **doc comments** | `explore-status-bar.tsx:5`, `explore-header.tsx:6-7,103`, `constants.ts:2,42`, `WelcomeMessage.tsx:65`, `explore-shell.tsx:4`, `use-explore-theme.ts:4`, `explore-tour.tsx:4`, `explore-drawer.tsx`, `src/app/layout.tsx:19` all mention `/explore` in prose | The ban must target **quoted route literals** (`href="/explore"`, `"/explore"`, `'"/explore"'`) or strip comments first — house precedent for stripping: `tests/credentials-panel.test.mjs:52` (`stripComments`). Separately, **renew the prose** (the phase-05 sweep's guard row shows comments are kept accurate as a matter of house style). |
| P-4 | `EXPLORE_TOUR_FINISH` strings are swept by a **digit guard** | `explore-tour.test.mjs:139-152` iterates `heading/announce/body/congrats/linkLabel/linkHref/hint` and asserts no digits after removing `60` | `/cli` is digit-free — safe. Do **not** introduce a numeric label into the chip constants (e.g. no `cli → 2`). |
| P-5 | Chip geometry vs a 24.5px bar | `explore-status-bar.tsx:34` = `h-7 … sm:h-8`; `globals.css:464-467` shrinks the root to 14px ≤640px → `h-7` = **24.5px** at 375px | Already resolved in UI-SPEC §5.4 (`RESOLVED-44PX`): full-bar-height hit box (50×28 base), real 44×44 alternative is the header Terminal link. **Do not grow the bar** — `explore-sweep.test.mjs:198-208` pins all four height/type tokens. |
| P-6 | Focus ring clipped by a 28px bar | offset-2 ring paints 4px outside the box, above `border-t` / below the viewport edge | UI-SPEC §4.3 `RESOLVED-RING-INSET`: `ring-2 ring-inset ring-ring`. `ring-inset` is real in the installed Tailwind [VERIFIED: `node_modules/tailwindcss/src/corePlugins.js:2540` → `'.ring-inset': { '@defaults ring-width': {}, '--tw-ring-inset': 'inset' }`, tailwindcss **3.4.19**]. |
| P-7 | Adding a third flex child to the status-bar row | `:34` uses `justify-between`; the UI-SPEC §2.2 anatomy requires the **counter `<p>` to stay the live region** and the chip to sit **outside** it | Wrap counter + chip in a `<div className="flex shrink-0 items-center gap-3">`; keep `aria-live="polite"` on the counter `<p>`; `whitespace-nowrap` on the counter. This preserves `explore-shell.test.mjs:94` and `explore-tour.test.mjs:614` verbatim. |
| P-8 | Reverse tabnabbing on the new `target="_blank"` anchor | The chip is the phase's only new external-window control | `rel="noopener noreferrer"` is mandatory. UI-SPEC §6 and §7 pin it; the composite's leg 5 must assert it. Static href from a constant → **no open-redirect surface**. |
| P-9 | Two `href="/cli"` occurrences in `out/index.html` | header Terminal link + the new chip | UI-SPEC §7 flags this: renewed assertions must use **presence or an explicit count of 2**, never "exactly once". (Contrast: `href="/explore"` in the CLI welcome line stays count-1 and is asserted as such in a *different* file, `explore-routing.test.mjs:83-87` — that file reads source, not the export.) |
| P-10 | `"no `/explore` anywhere in `out/**`" is **unsatisfiable** as a bare whole-tree zero | [VERIFIED §2.5] today 4 artifacts contain it, all produced by the old route. [VERIFIED this session] `grep` of `out/_next/static/chunks/app/explore/page-86c589961abc2d37.js` yields 2 hits: `~/explore` (the drawer SheetTitle) and `:~/explore` (the status-bar path). §3.7 keeps the drawer title, so **one hit survives the swap** and a whole-tree `→ empty` row can never go green without editing the drawer, which UI-SPEC §9 forbids. | Order the row after `npm run build` and make it **TWO-TIER, COUNT-EXACT**: (a) `out/*.html` and `out/*.txt` → assert **no** `/explore` (this includes `out/404.html`, which must also be clean); (b) `out/_next/static/chunks/**` → count the hits and `assert.equal(hits, 1)` with an inline comment naming the drawer's retained `~/explore` (`explore-drawer.tsx:55`) as accepted debt. A loose `> 0` check would hide a second leak; a bare whole-tree zero is the wrong contract. |
| P-11 | Metadata trap: OG/twitter inherited from root | [VERIFIED §3.4] `out/explore.html` carries root's `og:title` | Define `openGraph` + `twitter` on the landing layout; assert the built `out/index.html` `og:title` contains `Visual Portfolio Explorer`. |
| P-12 | Route-string literals live in the tests | 35 `out/explore.html` refs + 7 `src/app/...` path literals | Renew in the **same commit set** as the moves — UI-SPEC §9 states this; the phase-11 merge-hold precedent applies. |

---

## 4. Package legitimacy

**Zero new dependencies — this is a hard constraint** (SPEC constraint: "Zero new dependencies"; `explore-routing.test.mjs:198-203` and `explore-sweep.test.mjs:261-266` pin `Object.keys(pkg.dependencies).length === 39`).

Three **already-installed** packages are exercised by this phase. Each verified against the real installed artifact:

| Package | Version [VERIFIED: `node_modules/<pkg>/package.json`] | Claim | Verdict |
|---|---|---|---|
| `next` | `^15.5.10` (declared `package.json` dependencies) | App Router route moves, route groups, nested `metadata` merges, `output: 'export'` naming | **LEGITIMATE** — all four behaviours verified in-repo/live/docs (§3.1, §3.4, §3.5, §3.8) against *this* project's own build, not against training knowledge. No new package needed: the whole phase is filesystem layout + string targets. |
| `lucide-react` | `^0.475.0` (installed tree confirmed) | `ArrowUpRight` exists for the chip's arrow glyph (UI-SPEC `RESOLVED-ARROW`) | **LEGITIMATE** — [VERIFIED: `node_modules/lucide-react/dist/esm/icons/arrow-up-right.js` exists]. Note the exact export name is `ArrowUpRight` (kebab filename → PascalCase export, the standard lucide convention, [ASSUMED] on the export binding itself; the icon file's presence is verified). Same import style already used by `explore-header.tsx:21` (`import { Compass, Menu, Moon, Sun, Terminal } from 'lucide-react'`). |
| `tailwindcss` | **3.4.19** installed (declared `^3.4.1`) | `ring-inset` utility exists; `rounded-md` maps to `calc(var(--radius) - 2px)`; `shrink-0`, `min-w-0`, `truncate`, `whitespace-nowrap`, `gap-3`, `text-[10px]`, `text-accent`, `focus-visible:ring-*` are all available | **LEGITIMATE** — [VERIFIED: `node_modules/tailwindcss/src/corePlugins.js:2540` defines `.ring-inset`; `.ring-inset` was added in v3.0, and the installed version is 3.4.19]. Radius map [VERIFIED: `tailwind.config.ts:64-68`]. |

**Explicitly rejected / not to be added** (each would also trip the count-39 pin):

- `framer-motion` — banned outside `projects-stack-stage.tsx` by `tests/explore-visuals.test.mjs:632-640`. UI-SPEC §4.1 requires **zero new motion**: the chip inherits `.exp-nudge` (`globals.css:635-640`) only.
- Any router/redirect helper — the SPEC forbids redirect machinery; a static host has no server to redirect with.
- Any metadata helper — `next`'s own `Metadata` type + a plain object is what the codebase already uses.
- `recharts` — already removed (`explore-sweep.test.mjs:268-272` asserts `pkg.dependencies.recharts === undefined`). Must not return.

**`globals.css` is not edited by this phase** (UI-SPEC §4.1, §9). If the chip appears to need a CSS rule, that is a signal the Tailwind recipe was not followed.

---

## 5. Architectural Responsibility Map

Capability → tier. The rule applied: a value's *owner* determines its tier; anything security- or browser-boundary-sensitive is placed where it cannot leak.

| # | Capability | Tier | Where it lives | Notes / wrong-tier hazards |
|---|---|---|---|---|
| A-1 | **Route table for `/` and `/cli`** | **presentation** | `src/app/(home)/{layout,page}.tsx`, `src/app/cli/{layout,page}.tsx` | The filesystem *is* the route table in App Router. Must not be abstracted into a central route-config module — that would be new machinery for two routes and would defeat static-export analysis. |
| A-2 | **Landing composition (the explore shell)** | **presentation** | `src/app/(home)/page.tsx` → `ExploreShell` → `ExplorePanels` | Unchanged body. The one hazard: this route must **not** sit under the CLI's `h-screen overflow-hidden` wrapper (UI-SPEC §2.1 hard constraint; `explore-shell.test.mjs:127` already bans `h-screen` in this chain, but P-1 shows that guard can go soft). |
| A-3 | **CLI terminal shell at `/cli`** | **presentation** | `src/app/cli/layout.tsx` (the moved wrapper) + `cli/page.tsx` | Byte-identical move. The `dynamic(..., { ssr:false })` leaf stays client-only — this is why the export-level CLI assertions must read `out/cli.html` for *absence* of CLI content (precedent `explore-sweep.test.mjs:255-259`). |
| A-4 | **Cross-surface link targets (6 sites)** | **presentation** | Owning component in each case | Each target is a literal owned by the component that renders it: `explore-header.tsx:106`, `constants.ts:101` (`EXPLORE_TOUR_FINISH.linkHref`, consumed by `explore-tour.tsx:435`), `WelcomeMessage.tsx:71`, `TerminalInterface.tsx:298`, `not-found.tsx:105`, plus the new `EXPLORE_STATUS_CLI_LINK.href` in `constants.ts`. **Do NOT** centralise these into one route-map module: they already have a single owner each, and `EXPLORE_TOUR_FINISH` is deliberately test-importable (house precedent noted in `explore-routing.test.mjs:37-38`). |
| A-5 | **Chrome constants (breadcrumb, chip, finish card)** | **domain** (pure values) | `src/components/explore/constants.ts` | Plain TS, zero runtime imports, importable by both surfaces and by tests without parsing JSX. The chip's `{ label, href, ariaLabel }` belongs here, not inline in the status bar — that is what makes it assertable by a source-level row and keeps the component presentational. |
| A-6 | **Chip rendering + its `target`/`rel` security attributes** | **presentation**, with a **security-critical attribute pair** | `src/components/explore/explore-status-bar.tsx` | The chip is a real `<a>` with `href="/cli" target="_blank" rel="noopener noreferrer"`. **`rel` is the phase's one security-relevant token**; omitting it is reverse-tabnabbing. It must be rendered literally in the component (not computed), so both the SSR export and a source-level row can assert it. No `onClick`, no `window.open`, no router push — an anchor with a static href works with JS disabled (UI-SPEC §6). |
| A-7 | **The `href` value feeding that anchor** | **domain** | `constants.ts` `EXPLORE_STATUS_CLI_LINK.href = "/cli"` | Static constant → **no open-redirect surface**: the URL is not user-, query-, or data-derived. Keep it that way; do not thread it through props. |
| A-8 | **Breadcrumb path value** | **domain** | `constants.ts:46` → `":~"` | Single derivation site; the status bar stays presentational. |
| A-9 | **Before-paint theme script (`localStorage`)** | **integration** (browser boundary) | **route-scoped** layout for `/` only | Reads `localStorage["portfolio-explore-theme"]`, writes one of two allow-listed classes to `<html>`. **MUST NOT move to `src/app/layout.tsx`** — that is the phase's highest-severity wrong-tier placement (§3.3): it would run on `/cli` and `/resume` and strip the CLI's own theme classes. The 2-value allow-list must not be widened (no arbitrary class injection). |
| A-10 | **Metadata (title/description/OG/twitter)** | **presentation** | `src/app/(home)/layout.tsx` (landing), `src/app/cli/layout.tsx` (CLI), root untouched | Data-driven from `src/data/portfolio-main-data.json` at build time (a **data** read). The landing must declare `openGraph` + `twitter`, else root's CLI-branded OG survives (§3.4 / P-11). |
| A-11 | **Portfolio data** | **data** | `src/data/portfolio-main-data.json` (unchanged) | EXPLORE-07 survives: this phase moves paths, never content. Any diff in that file is a defect. |
| A-12 | **`/explore` removal** | **presentation** (route deletion) | Delete the directory; no stub, no redirect | A redirect at the **integration** tier is impossible on a static host and is forbidden by the SPEC. GitHub Pages answers the dead path with `out/404.html` — which is exactly why A-13 matters. |
| A-13 | **The 404 page's "Return to Terminal" link** | **presentation** | `src/app/not-found.tsx:105` | Declared 6th link site (§3.6). It is the page GitHub Pages serves *for* the deleted `/explore`. Leaving it mislabelled would send a lost visitor to the wrong surface at the moment they are most lost. |
| A-14 | **Validation (suites, sweep table, composite)** | **validation tier** — not runtime | `tests/*.mjs`, `.planning/…-SWEEP.md` | Route literals live in the tests (P-12). Renewals ride the code commits. |

**BLOCKER check — security-sensitive capability in the wrong tier:** none of A-1…A-14 places a security-sensitive capability in the wrong tier. The two candidates were examined and both land correctly: the `target="_blank"` anchor keeps its `rel` in the **presentation** tier where it is asserted by the export row (A-6), and the `localStorage`-writing script is confined to a **route-scoped integration** boundary rather than the shared root (A-9). **No blockers from this section.** The residual risk is execution discipline, not architecture: a planner who "helpfully" centralises the four `/cli` hrefs into one module (A-4) would make the composite test unfalsifiable per-leg, and a planner who "simplifies" the theme script into the root layout (A-9) would introduce the one defect this phase cannot ship with.

---

## 6. Validation Architecture

What automated check proves each behaviour. All rows are falsifiable and mapped to the artefact that owns them. House gate: **`npm run typecheck && npm run build && node --test tests/*.test.mjs`** — `npm run build` **must** precede every `out/`-reading row.

### 6.1 Route existence and artifact shape

| Behaviour | Check | Type | Owner |
|---|---|---|---|
| `/` exports the explore experience | `existsSync('out/index.html')` **and** `read('out/index.html').includes('explore-shell')` **and** `.includes('guest@tasostilsi')` | E | renewed `explore-shell.test.mjs` (ex-`:452-462`), extended `explore-sweep.test.mjs` E-1 |
| `/cli` exports the CLI terminal | `existsSync('out/cli.html')` **and** `!existsSync('out/cli/index.html')` | E | `explore-sweep.test.mjs` E-1 (renewed) |
| `/explore` is gone | `!existsSync('out/explore.html')` **and** `!existsSync('out/explore.txt')` | E | `explore-sweep.test.mjs` E-1 (new row) |
| No route string survives in the artifact | TWO TIERS: `grep -rl "/explore" out/*.html out/*.txt` → **empty** (includes `out/404.html`), AND exactly **one** hit across `out/_next/static/chunks/**` — the drawer's retained `~/explore` SheetTitle (§3.7; UI-SPEC §9 forbids touching the drawer), pinned count-exact as `assert.equal(hits, 1)` so a second leak fails loudly. A bare whole-tree `grep` → empty is **unsatisfiable** (see P-10). | E | new sweep row (P-10); `tests/route-swap.test.mjs` row 11 |
| `/resume` unaffected | `existsSync('out/resume.html')` | E | `explore-shell.test.mjs:469`, `explore-visuals.test.mjs:795` (unchanged) |
| The CLI is still client-only at its new path | `!read('out/cli.html').includes('System initialized')` | E | `explore-sweep.test.mjs` E-3 (repath `out/index.html` → `out/cli.html`) |
| The landing does not stack the CLI's shell | landing `page+shell` source contains no `h-screen` **and** `assert.ok(existsSync(landing page))` (closes P-1) | P | `explore-shell.test.mjs:96-127` (repathed + hardened) |
| The CLI shell survived verbatim | `read('src/app/cli/layout.tsx').includes('overflow-hidden')` and `.includes('overflow-auto')` | P | `explore-sweep.test.mjs:150-158` (repathed) |

### 6.2 Cross-surface links — the two-way composite (SPEC's central acceptance)

| Leg | Assertion | Type |
|---|---|---|
| 1 — CLI welcome → explore home | `WelcomeMessage.tsx` contains `href="/"` exactly once; rendered text still exactly `'[ NEW → visual tour: explore ]'`; no `target=` in the file | P |
| 2 — CLI `explore` command → `/` | `TerminalInterface.tsx` contains `case "explore":` + `{ navigate: "/" }` + `router.push(result.navigate)`; no `window.location`; exactly one `[ opening the visual tour... ]` | P |
| 3 — explore header Terminal link → `/cli` | `explore-header.tsx` contains `href="/cli"`; `aria-label="Open the terminal"` unchanged; 44×44 recipe tokens unchanged; rightmost position unchanged | P |
| 4 — wizard finish card → `/cli` | `EXPLORE_TOUR_FINISH.linkHref === '/cli'`, `linkLabel === 'Open the terminal →'`, `hint` unchanged | P (imports the constant directly — no JSX parsing) |
| 5 — status-bar chip → `/cli` in a NEW tab | source: `href="/cli"`, `target="_blank"`, `rel` contains `noopener` and `noreferrer`, `aria-label` contains the visible label `cli` (WCAG 2.5.3, `RESOLVED-NAME`); export: same tokens present in `out/index.html` | P + E |
| 6 — 404 "Return to Terminal" → `/cli` | `not-found.tsx` contains `href="/cli"` | P |
| **Both directions** | CLI `→` explore home `→` CLI, asserted as one set in **one test** (the composite), so no half-rewire can pass | P |
| Header link actually SSR'd at the new path | `read('out/index.html').includes('aria-label="Open the terminal"')` and `.includes('href="/cli"')` | E |

### 6.3 Breadcrumb, chip anatomy, and layout guards

| Behaviour | Check | Type |
|---|---|---|
| Breadcrumb reads `guest@tasostilsi:~` | `constants.ts` contains `":~"` **and** not `":~/explore"`; export contains `guest@tasostilsi` and `:~` | P + E |
| Status bar keeps its four tokens | `h-7`, `sm:h-8`, `text-[10px]`, `sm:text-xs` all still present in `explore-status-bar.tsx` | P (existing `explore-sweep.test.mjs:198-208` stays green — **do not grow the bar**) |
| Row cannot overflow or wrap | footer children: left `<p>` carries `min-w-0 truncate`; right cluster is `flex shrink-0 items-center gap-3`; counter `<p>` carries `whitespace-nowrap`; chip is `shrink-0` | P (new structural guards — UI-SPEC `RESOLVED-WIDTH-TEST` deliberately does **not** assert estimated px) |
| Live region isolated | `aria-live="polite"` present, on the counter `<p>`, and the chip is **outside** it | P (existing rows at `explore-shell.test.mjs:94`, `explore-tour.test.mjs:614` stay green) |
| Counter logic untouched | `${visitedCount}/${EXPLORE_SECTIONS.length} sections visited` verbatim; export contains `0/5 sections visited` | P + E |
| No new motion | `.animate(`, `gsap`, `lottie` absent across all of `src/components/explore/**`; `framer-motion` present only in `projects-stack-stage.tsx`; tour rAF counts still 5/3; `globals.css` unchanged | P (existing `explore-visuals.test.mjs:598-640` — all should stay green with **zero** edits, which is itself the proof that this phase added no motion) |

### 6.4 Metadata

| Behaviour | Check | Type |
|---|---|---|
| Landing `<title>` is explore-branded | `read('out/index.html')` matches `/Visual Portfolio Explorer<\/title>/` | E |
| **Landing OG is explore-branded** (the §3.4 trap) | `read('out/index.html')` `og:title` contains `Visual Portfolio Explorer` | E |
| `/cli` carries CLI branding | `read('out/cli.html')` or the `/cli` layout source contains `Interactive CLI Portfolio` | P |
| Root untouched | `src/app/layout.tsx` still contains the GA id `G-TLWL6FDZE7`, the `application/ld+json` script, the `Person` schema with `"url": "https://tasostilsi.github.io/"`, and the `viewport` export | P |
| **The before-paint script did NOT escape to root** | `!read('src/app/layout.tsx').includes('portfolio-explore-theme')` — a direct falsifier for §3.3 | P |
| The script is still ahead of the shell markup | `read('out/index.html')` matches `/classList\.remove\(["']dark["'],\s*["']light["']\)/` **and** the script index < the `explore-shell` index | E |
| Theme keys still disjoint | the explore chain never assigns `portfolio-theme` (existing `explore-shell.test.mjs:41`, `explore-tour.test.mjs:45`) | P |

### 6.5 Responsive / 375px invariant

| Behaviour | Check | Type |
|---|---|---|
| Landing stacks 1-col at 375px | `explore-panels.tsx` still contains `grid grid-cols-1 gap-4 md:grid-cols-2`; all `col-span`/`h-[300vh]`/`h-[calc(100dvh-10rem)]` occurrences `md:`-prefixed | P (existing `explore-sweep.test.mjs:41-64`, `:100-120` — unchanged, must stay green) |
| No horizontal scroll is structural | `explore-shell.tsx` root still matches `/explore-shell flex h-dvh flex-col overflow-x-hidden/` | P (existing `:139-146`) |
| Chip fits at 375px | structural guards only (§6.3) + the recorded 338px/351px arithmetic as a comment | P |
| Chip hit box passes WCAG 2.2 SC 2.5.8 AA (≥24px) | 50×28 base — recorded in the sweep table as an M-adjacent arithmetic note | P (documented, not estimated) |
| Both surfaces render at 375 / 768 / 1440 / 1920 | **manual — user final pass** (the sweep's M rows), covering `/` (explore) and `/cli` | M |

### 6.6 Gate ordering (the "finality" discipline)

The workspace must be green **in this order**, with nothing written after the last green run:

1. `npm run typecheck`
2. `npm run build` — this is the CI gate; CI runs nothing else (`.github/workflows/deploy.yml`: `npm install` → `npm run build` → upload `./out`)
3. `node --test tests/*.test.mjs` — **only valid after step 2**, because 48 rows read `out/`
4. commit the renewed sweep table

Note: the test suite cannot run in CI — it imports `.ts` modules directly and relies on Node's native type stripping, which needs Node ≥ 23.6, while the workflow pins `node-version: "20"` (`deploy.yml`). This is documented in `tests/explore-routing.test.mjs:1-7`. **The suite is a local-only gate**; `npm run build` is the only automated CI gate.

---

## 7. Risks

| ID | Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|---|
| R-1 | Two providers of `/` while both route trees exist → `next build` fails mid-sequence | **BLOCKER** if it lands in a commit | High if split across tasks | Land the route move as **one atomic task/commit** (§3.2). Record the merge hold explicitly (phase-11 precedent). |
| R-2 | The theme script ends up in the root layout → CLI/resume theme stripped at every boot | **BLOCKER** | Medium (root layout is the "obvious" home for shared head content) | Explicit prohibition in the plan's must-not-do list + the direct falsifier in §6.4 (`!root.includes('portfolio-explore-theme')`). |
| R-3 | Landing OG/twitter silently stays CLI-branded (§3.4) | WARNING | **High** — copying the existing layout pattern produces exactly this | Require `openGraph` + `twitter` on the landing layout; assert `og:title` in the export. |
| R-4 | `.filter(existsSync)` lets a stale landing path silently weaken the `h-screen` guard | WARNING | Medium | Repath + add an explicit existence assertion (P-1). |
| R-5 | Chip rendered without `rel="noopener noreferrer"` | WARNING (security) | Low (UI-SPEC pins it) | Source + export assertion on both tokens; composite leg 5. |
| R-6 | 35 `out/explore.html` refs + 7 `src/app/...` path literals renewed incompletely → suite red in a way that masks a real failure | WARNING | Medium-High (mechanical, high volume) | Renew with the code, in the same commit set; the plan should enumerate the exact file/line list (§2.5) rather than say "update the tests". |
| R-7 | A naive `/explore` ban trips on doc comments (P-3) | INFO | High | Ban quoted route literals or strip comments; renew prose separately. |
| R-8 | `trailingSlash` added later (or by CI tooling) silently 404s `/cli` | WARNING | Low | Assert `existsSync(out/cli.html) && !existsSync(out/cli/index.html)`; keep hrefs slash-free. |
| R-9 | `not-found.tsx` left pointing at `/` → the 404 page promises "Terminal", delivers explore | WARNING | Medium (it is not in the SPEC's list) | Declare it the 6th site and rewire it (§3.6). |
| R-10 | Drawer `~/explore` reads stale after the swap | INFO | Certain (by design) | Accepted cosmetic debt, per UI-SPEC §9's "do not touch the drawer" (§3.7). Record it; do not fix here. |
| R-11 | `PRODUCT.md` (untracked) still documents `/explore` as the visual surface | INFO | Certain | Out of the tracked deliverable. Optional doc-hygiene follow-up; not a phase task. |
| R-12 | The deployed site is currently *behind* the repo (live `/` title says "Senior Software Engineer in Test"; the repo data says "Test Automation Architect \| Principal Test Automation Engineer") | INFO | Certain | Expected: the first deploy after this phase ships both the route swap **and** the REV-01 data refresh. Not a regression, but the ship note should say so, so nobody reads the changed landing copy as a phase-12 defect. |

---

## 8. Open Questions

All questions were resolvable from repo evidence, the sealed SPEC/CONTEXT/UI-SPEC, or the live deployment target. **No question blocks planning.**

| ID | Question | Status | Resolution / blocker |
|---|---|---|---|
| OQ-1 | Can a `(cli)` route-group rename produce the `/cli` URL (D-01's parenthetical)? | **(RESOLVED)** | **No.** Route groups are excluded from the URL [CITED: nextjs.org/docs/…/route-groups]. Move to `src/app/cli/{layout,page}.tsx` as a byte-identical file move; delete `src/app/(main)/` entirely. D-01's *outcome* is preserved; only its "or a group rename" option is void. |
| OQ-2 | Landing structure: `(home)` route group vs plain `src/app/page.tsx` with an inline script? | **(RESOLVED)** | **`(home)` route group.** `git mv src/app/explore src/app/\(home\)` keeps the route-scoped layout (UI-SPEC §4.4's literal suggestion), keeps the theme script's blast radius at one route, and turns six test path literals into one-line repaths instead of a rewrite. UI-SPEC §10 records this as `PLANNER-CHOICE`; the outcome it demands is satisfied. |
| OQ-3 | Does `/cli` emit `cli.html` or `cli/index.html`, and does either resolve on GitHub Pages? | **(RESOLVED)** | **`out/cli.html`**, and it resolves. No `trailingSlash` in `next.config.ts` [VERIFIED §2.2]; `out/resume.html` is the in-repo precedent [VERIFIED §2.3]; docs confirm `trailingSlash` is the option that changes the shape [CITED §2.4]; **the live host serves `/resume` from `resume.html` today** [VERIFIED §2.4]. All `/cli` hrefs are `"/cli"`. Leave `trailingSlash` unset. |
| OQ-4 | Will a landing layout that mirrors the current explore layout deliver D-02's "OG" branding? | **(RESOLVED)** | **No.** Measured: `out/explore.html` keeps root's CLI-branded `og:title`/`twitter:title` [VERIFIED §3.4]. The landing layout **must** declare `openGraph` + `twitter` explicitly. Assert `og:title` in the built export. |
| OQ-5 | Should root layout metadata change? | **(RESOLVED)** | **No.** Root also serves `/resume` (which inherits its title today, verified live). Leave metadata, GA, JSON-LD, and viewport untouched; declare CLI branding on the `/cli` layout and explore branding on the `(home)` layout. |
| OQ-6 | Are there cross-surface link sites beyond the five the SPEC enumerates? | **(RESOLVED)** | **Yes, one:** `src/app/not-found.tsx:104-110`, labelled "Return to Terminal", `href="/"`. Rewire to `/cli` and add it as composite leg 6. It is the page GitHub Pages serves for the deleted `/explore`. |
| OQ-7 | Does the drawer's `~/explore` title need renewing to match the new breadcrumb? | **(RESOLVED — leave as-is)** | UI-SPEC §9 explicitly forbids touching the drawer; the visual-delta table lists only the status-bar breadcrumb. Renewing it would also edit the test at `explore-shell.test.mjs:241`, expanding the phase's scope. **Recorded as accepted cosmetic debt (R-10).** |
| OQ-8 | How does the chip satisfy "44px touch area" inside a 24.5–32px bar without breaking the pinned bar tokens? | **(RESOLVED)** | Full-bar-height hit box (50×28 base / ≈54×32 at `sm:`), WCAG 2.2 SC 2.5.8 AA satisfied; the real 44×44 alternative is the header Terminal link. UI-SPEC §5.4 `RESOLVED-44PX`. **Do not grow the bar** — `explore-sweep.test.mjs:198-208` pins `h-7`/`sm:h-8`. |
| OQ-9 | Focus ring clipping inside a 28px bar? | **(RESOLVED)** | `ring-2 ring-inset ring-ring` (UI-SPEC §4.3 `RESOLVED-RING-INSET`); `ring-inset` confirmed present in the installed Tailwind 3.4.19 [VERIFIED]. Every other control keeps the offset-2 recipe. |
| OQ-10 | Is the accessible name `"Open the terminal in a new tab"` (the brief's literal string) acceptable? | **(RESOLVED)** | **No — WCAG 2.5.3.** Pin `aria-label="cli — open the terminal in a new tab"` so the accessible name contains the visible label (UI-SPEC §5.1 `RESOLVED-NAME`). |
| OQ-11 | Can the route move be split across commits? | **(RESOLVED — must not be)** | No: two providers of `/` fail the build [CITED route-groups]. One atomic task; the branch is knowingly red until the last renewal lands (phase-11 merge-hold precedent). |
| OQ-12 | Is `sitemap.xml` / `robots.txt` affected? | **(RESOLVED — no action)** | `public/sitemap.xml` has exactly one `<loc>` = `https://tasostilsi.github.io/`, which is already the correct post-swap landing. SEO additions remain deferred per CONTEXT. |
| OQ-13 | Is anything outside `src/` and `tests/` referencing the old routes? | **(RESOLVED — no action)** | `README.md`, `docs/`, `scripts/`, `.github/`, `public/` all clean [VERIFIED]. Only the untracked `PRODUCT.md` mentions `/explore` (R-11, out of the tracked deliverable). |

**Blocking open questions: none.** Planning may proceed.

**Process hold (not a research blocker, recorded for the ship step):** remote mutations — `git push`, PR creation, any deploy — are gated behind an explicit per-action user command. This phase therefore ends at a green local tree plus prepared handoff artefacts, not at a pushed branch. The deploy workflow triggers on `master` only.

---

## 9. Project Constraints

### 9.1 Repo conventions that bind this phase

| Constraint | Evidence | Consequence for the plan |
|---|---|---|
| **No `test` npm script.** The gate is `npm run typecheck && npm run build && node --test tests/*.test.mjs` | `package.json` scripts = `dev, build, serve, start, lint, typecheck, build:resume` | Every task's `<verify>` must compose the gate by hand, as phase 11 did (`…-01-PLAN.md:120,174`). |
| **CI runs `npm run build` only**; Node 20; uploads `./out` | `.github/workflows/deploy.yml` | The build is the only automated gate. The suite is local-only (Node ≥23.6 needed for native `.ts` import — documented at `tests/explore-routing.test.mjs:1-7`). |
| **`globals.css` is not edited** | UI-SPEC §4.1 + §9 | Zero new CSS, zero new keyframes, zero new transitions. The chip reuses `.exp-nudge` (`globals.css:635-640`). Existing `.animate(`/`gsap`/`lottie`/`framer-motion` bans must stay green **with no edits** — that is the proof. |
| **`framer-motion` is importable only from `projects-stack-stage.tsx`** | `tests/explore-visuals.test.mjs:632-640` | The chip is a plain anchor; no motion library. |
| **Dependency count is pinned at 39** | `tests/explore-routing.test.mjs:198-203`, `tests/explore-sweep.test.mjs:261-266` | Zero new deps. `recharts` must not return. |
| **Tests import TS modules directly** (`import … from '../src/components/…/constants.ts'`) | `tests/explore-routing.test.mjs:35-38`, `tests/explore-sweep.test.mjs:32-35` | Keep new constants in the same **zero-runtime-import** plain-TS modules (`constants.ts`, `timeline-geometry.ts`) so test-importability is preserved. Do not put the chip constants behind a `'use client'` file. |
| **`out/`-reading rows need a prior build** | every export row | Build once per wave, then run the suite. Order matters (§6.6). |
| **`output: 'export'`, `images.unoptimized`, `eslint.ignoreDuringBuilds`** | `next.config.ts:5-12,19` | Lint is not a gate. Static-only: no middleware, no redirects, no route handlers with dynamic input. |
| **Remote writes gated** | session policy | End at a green local tree + prepared PR body; wait for a per-action command. |
| **Green-gate finality** | session policy | The last full gate run must cover the final workspace state — including the renewed sweep table and any doc/planning commits. Nothing writes after the final green run. |
| **Sweep-table convention** | `.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md` | Row taxonomy P (programmatic) / E (export-level after `npm run build`) / M (manual — user final pass). 8 rows = {375, 768, 1440, 1920} × {route A, route B}. Phase 12's grid becomes **{/, /cli}** replacing {/, /explore}. Disposition rule: a defect on a phase surface → `fixed` (red-first); elsewhere → `deferred`. |
| **Doc-comment hygiene** | phase-05 sweep guard row; `constants.ts`, `explore-header.tsx` comments | Prose mentioning `/explore` should be renewed alongside the code, so a later grep-based ban can be simple. |
| **`tests/credentials-panel.test.mjs` hard boundary** | `:19-28` | The closed drawer + non-default Radix tab bodies are **not** in the SSR export. Only repath that suite's `out/explore.html` constant (`:39-42`); do not add export rows for client-only chrome. |
| **Script-stripping is load-bearing in the credentials suite** | `:26-30`, `readExportMarkup` at `:44-49` | The RSC payload inlines client-island props, so an unstripped export row can pass on JSON rather than markup. Preserve that helper when repathing. |

### 9.2 Deferred / out of scope (do not touch)

Per CONTEXT's deferred list and UI-SPEC §9 — the plan's must-not-do list:

- Redirect stubs of any kind (no such machinery on a static host; `/explore` just 404s).
- `sitemap.xml` / `robots.txt` / SEO additions.
- CLI deep-linking (`?cmd=` prefill).
- Behavioural changes on either surface: arc, stack, credentials, drawer, wizard, counter, CLI commands/history/themes/achievements.
- Personal copy and `src/data/portfolio-main-data.json`.
- The drawer's `~/explore` title (OQ-7), `globals.css`, panels, tour internals, theme hooks.
- `PRODUCT.md` (untracked) — optional follow-up, not a task.

---

## 10. Recommended decomposition input (for the planner)

Not prescriptive — this is the shape the evidence supports, offered so the planner does not re-derive it.

**Atomicity.** One required atomic unit (R-1): the route move + all six link rewires + the breadcrumb constant + the stale-suite renewals. Splitting it across commits leaves the branch unbuildable in between, which the phase-11 precedent already treats as a declared merge hold.

**Suggested wave shape** (3 plans, 2 waves — the count is the planner's call):

- **Wave 1 — plan 01 (atomic route swap).** Delete `src/app/(main)/`; create `src/app/cli/{layout,page}.tsx` as byte-identical moves + a CLI metadata export; `git mv src/app/explore` → `src/app/(home)`; rewire the six sites + `EXPLORE_STATUS_PATH`; add `EXPLORE_STATUS_CLI_LINK`; render the chip with `target="_blank" rel="noopener noreferrer"` and `ring-inset`; renew the six suites' route/path/export literals in the same commit set. Build + full suite must be green at the end of this plan.
- **Wave 1 — plan 02 (renewed sweep table + new falsifiers), parallel-safe only if it touches no file plan 01 edits** — realistically this belongs *after* plan 01 because the sweep rows read the built export. The honest shape is: the sweep table and the new rows (route existence, `!existsSync(explore.*)`, the `out/**` string ban, `og:title`, the root-layout script falsifier, the 6-leg composite) land **with** plan 01's test renewals, and the sweep **table document** is written last, after the final green run.
- **Wave 2 — plan 03 (verify-pass hardening).** Re-read the built `out/index.html` + `out/cli.html`; confirm the 375px structural guards and the four status-bar tokens unchanged; record the M rows (manual, user final pass) for {375, 768, 1440, 1920} × {/, /cli}; write the sweep table.

**Two tasks that will otherwise be missed.** (a) Add an explicit `assert.ok(existsSync(landingPagePath))` wherever a test `.filter(existsSync)`s a moved path (P-1/R-4). (b) Assert `!existsSync('out/cli/index.html')` alongside `existsSync('out/cli.html')` so a future `trailingSlash` flip fails loudly (R-8).

**The two must-not-dos worth stating verbatim in every relevant plan.** Do not move the before-paint theme script into `src/app/layout.tsx` (R-2 — BLOCKER). Do not grow the status bar's height or type tokens (P-5 — pinned by four existing assertions).
````

---

**Primary evidence read this session:** `src/app/layout.tsx`, `src/app/explore/{layout,page}.tsx`, `src/app/(main)/{layout,page}.tsx`, `src/app/not-found.tsx`, `src/app/globals.css`, `next.config.ts`, `tailwind.config.ts`, `package.json`, `.github/workflows/deploy.yml`, `src/components/explore/{constants,explore-status-bar,explore-header,explore-drawer,explore-shell,explore-tour}.tsx`, `src/components/cli/{constants.ts,TerminalInterface.tsx,outputs/WelcomeMessage.tsx}`, the built `out/explore.html` / `out/index.html`, all 13 files in `tests/`, and `.planning/phases/EXPLORE-12-route-swap-promotion/*` + the phase-05 SWEEP.md. Live checks: `https://tasostilsi.github.io/`, `/resume`, `/explore`. Docs: Next.js route-groups, generateMetadata, static-exports; GitHub Pages extensionless serving.