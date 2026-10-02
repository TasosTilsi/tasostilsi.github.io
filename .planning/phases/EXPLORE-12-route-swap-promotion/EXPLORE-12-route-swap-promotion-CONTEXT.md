# Phase 12: route-swap-promotion - Context

**Gathered:** 2026-10-02T16:23:58.842Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** Route promotion: / = explore, /cli = CLI, /explore deleted; cross-surface link rewiring; breadcrumb ~; the status-bar cli new-tab chip; metadata split; test/sweep renewal; composite two-way test updated.
**Out of scope:** Behavioural changes to either surface, new dependencies, redirect machinery, sitemap/robots SEO additions (flagged separately), wizard/arc/stack/credentials flow changes, personal-copy data changes.
</domain>

<decisions>
## Decisions
### Route moves
- **D-01:** The explore experience becomes src/app/page.tsx (primary landing /); the CLI terminal moves to src/app/cli/page.tsx keeping its terminal layout (the (main) route group restructures: either a (cli) group rename or /cli with its own layout.tsx — whichever preserves the CLI's h-screen overflow-hidden shell exactly); /explore's route folder is DELETED (never shipped).
- **D-02:** Metadata split: the ROOT layout keeps GA + JSON-LD + viewport; the home page (explore) carries its own data-driven metadata (explore experience branding — title/description/OG); the /cli page carries CLI-branded metadata ('Interactive CLI Portfolio'); no duplicate canonical handling needed (the explore route is deleted).
### Cross-surface rewiring
- **D-03:** Link targets rewire in the same commit set (cross-surface-links discipline): CLI WelcomeMessage hyperlink → '/'; CLI `explore` command → router.push('/'); explore header Terminal link → '/cli'; wizard EXPLORE_TOUR_FINISH href → '/cli'; breadcrumb text → 'guest@tasostilsi:~'; NEW status-bar 'cli' chip-link: an anchor href='/cli' target='_blank' rel='noopener noreferrer' with the CLI identity (arrow glyph), 44px-equivalent touch area, in the breadcrumb row right group (beside theme + counter, or immediately after the breadcrumb left group — the taste review: right cluster, after the counter).
- **D-04:** Test/sweep renewal: route-existence tests (index.html/cli.html in out/), the sweep rows {/, /explore} → {/, /cli}, the two-way-loop composite (CLI→/→CLI via header; /→/cli→/ via chip), export-title assertions; the stale suite renewals ride the same commits.
### Claude's Discretion
- The status-bar cli chip's exact icon/glyph (a terminal glyph + arrow) and label text ('cli' lowercase, chrome)
- Whether the CLI page keeps route group (cli) or a plain folder+layout (both valid; pick per Next conventions)
- The home page metadata's exact title wording (data-driven, explore branding)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Route move targets
- `src/app/explore/ — the route folder moving to src/app/page.tsx (the primary landing)`
- `src/app/(main)/ — the CLI route group moving to src/app/cli/`
- `src/components/explore/explore-status-bar.tsx — breadcrumb + the new cli chip-link`
### Cross-surface link sites
- `src/components/cli/outputs/WelcomeMessage.tsx — the explore hyperlink → target /`
- `src/components/cli/TerminalInterface.tsx — the explore command's navigation target`
- `src/components/explore/explore-header.tsx — the Terminal link → /cli`
- `src/components/explore/constants.ts — EXPLORE_TOUR_FINISH href → /cli`
### Locked spec + test renewal targets
- `.planning/phases/EXPLORE-12-route-swap-promotion/EXPLORE-12-route-swap-promotion-SPEC.md`
- `tests/explore-sweep.test.mjs + the two-way-loop composite test — route-name renewal targets`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- Next.js App Router route move: renaming/creating page.tsx files + moving the (main) route group; the (main) layout's h-screen overflow-hidden terminal shell must travel with the CLI page to /cli (a route-group rename or a direct /cli folder carrying a cli/layout.tsx)
- The explore route has its own layout (fonts/theme) that becomes the ROOT landing layout; the root layout.tsx carries GA + metadata + JSON-LD — the home metadata may need the explore branding (title currently CLI-branded via layout.tsx:22)
- Static export: output routes = index.html (explore) + cli.html (CLI); GitHub Pages serves them; the old /explore output disappears (deleted route)
- The CLI page.tsx uses dynamic import ssr:false for TerminalInterface — a client-only leaf; the /cli route keeps that pattern
- The status-bar cli chip-link: small chrome element in the breadcrumb row (target=_blank new tab — the user's explicit ask vs the header Terminal link's same-tab)
- The wizard finish card's href lives in EXPLORE_TOUR_FINISH (explore/constants.ts:89-94) — one constant change re-derives both card and tests
- The two-way loop composite test (tests/explore-*, sweep rows) pins routes by name — all renew to / and /cli
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
  _Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._
  ### Req REV-22
  - **Current:** / serves the CLI terminal; /explore serves the visual experience; links point across accordingly; the breadcrumb reads 'guest@tasostilsi:~/explore'.
  - **Target:** The route swap: / = the explore visual experience (primary landing), /cli = the CLI terminal, /explore deleted, breadcrumb 'guest@tasostilsi:~', the status-bar 'cli' new-tab hyperlink, all cross-surface links + tests + sweep renewed.
  - **Acceptance:** The export emits index.html = the explore experience + /cli = the CLI terminal; NO /explore route exists; all cross-surface links (CLI welcome link, explore command, header Terminal link, wizard finish card, status-bar cli chip) verified navigable via the composite test; metadata/sweep/suites renewed.
- **Boundaries (SPEC):**
  **In scope:** The explore experience is promoted to the primary landing: / serves the visual experience, /cli serves the CLI terminal, /explore is deleted, the breadcrumb becomes ~, cross-surface links rewire, and the status bar gains a new-tab cli hyperlink.
  **Out of scope:** (not specified)
- **Acceptance Criteria (SPEC):**
  - `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; the static export emits: index.html = the explore experience, cli.html or /cli/index.html = the CLI terminal, and NO explore.html exists
  - Cross-surface links verified rewired (grep + export checks): the CLI welcome hyperlink + the `explore` command navigate to / (the explore home); the header Terminal link and the wizard finish card navigate to /cli; the status bar gains a 'cli' hyperlink opening /cli in a NEW tab (target=_blank rel=noopener)
  - The status-bar breadcrumb renders 'guest@tasostilsi:~'; the CLI's own surfaces keep their identity strings unchanged
  - Metadata: the home (explore page) carries its own data-driven metadata (the explore experience branding); the /cli page carries its own CLI-branded metadata; the root layout's JSON-LD/schema URLs stay correct
  - No redirect machinery needed (GitHub Pages static): the old /explore path simply no longer exists
  - The sweep table and route-existence tests renew: rows cover {/, /cli} (replacing /explore), the two-way loop composite test asserts CLI→/→CLI; every discovered defect fixed with a test
  - The CLI's behaviour is functionally unchanged (commands/history/themes/achievements); the explore page's behaviour is functionally unchanged (arc, stack, credentials, drawer, wizard, counter) — only paths and link targets moved
  - No new dependencies; 375px invariant holds on both new paths
- User: 'make the /explore to be the landing page in / and the home cli that is now the / to become /cli paths'
- User: 'the /explore is deleted as it is not live in github pages yet'
- User: breadcrumb option 2 (~) + 'we could have a hyperlink opening a new tab for the user to explore the cli version of the site'
</specifics>

<deferred>
## Deferred Ideas
- Redirect stubs for any OTHER old paths (none needed — /explore never shipped)
- A sitemap.xml addition (separate SEO concern — flagged for the ship phase if desired)
- CLI deep-linking (?cmd= prefill) — deferred to a future milestone
</deferred>


---

*Phase: 12-route-swap-promotion*
*Context gathered: 2026-10-02*