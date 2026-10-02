---
phase: 05-explore-routing
plan: 01
subsystem: cli-routing
tags: [cli, routing, island-closure, next-link, useRouter, tdd, node-test, additive-only]
requires:
  - "AVAILABLE_COMMANDS + ACHIEVEMENTS (src/components/cli/constants.ts, pre-existing)"
  - "processCommand / executeCommand sentinel idiom `{ openModal: \"resume\" }` (TerminalInterface.tsx:352-386, pre-existing house pattern)"
  - "EXPLORE_TOUR_FINISH.linkHref === \"/\" (src/components/explore/constants.ts:92 — phase-4 /explore→CLI return leg, consumed read-only by the suite)"
provides:
  - "Bracket welcome link line `[ NEW → visual tour: explore ]` in WelcomeMessage.tsx — unconditional sibling after the tutorial box, JetBrains Mono stack, same-tab Next <Link href=\"/explore\"> (D-01, OQ-3/OQ-4)"
  - "`explore` CLI command — AVAILABLE_COMMANDS 39th/last entry, `case \"explore\"` returning the `{ navigate: \"/explore\" }` sentinel, executeCommand navigate branch (chrome line → 600ms → router.push) (D-02, OQ-2)"
  - "HelpOutput.tsx explore li entry — `Open the visual portfolio tour` (D-02, OQ-1)"
  - "tests/explore-routing.test.mjs — 7-test Layer-1/2 routing contract suite (registry, welcome format+position, dispatch, help, additive-only, guards)"
affects:
  - "EXPLORE-05-explore-routing-02 (explore-side header Terminal link completes the two-way loop this plan's CLI legs open)"
  - "EXPLORE-05-explore-routing-03 (sweep table rows reference the new entry points; owns the full build+typecheck+suite gate)"
tech-stack: [next-15-link, next-navigation-useRouter, react-18, node-test, erasable-ts-type-stripping, tailwind-cli-theme-tokens]
key-files:
  created:
    - tests/explore-routing.test.mjs
  modified:
    - src/components/cli/constants.ts
    - src/components/cli/TerminalInterface.tsx
    - src/components/cli/outputs/WelcomeMessage.tsx
    - src/components/cli/outputs/HelpOutput.tsx
decisions:
  - "D-01: the link line renders as an UNCONDITIONAL sibling between the showTutorial block and the trailing <br /> — DOM position, not a render gate, so returning visitors (tutorial suppressed) still see the island exit (OQ-3)"
  - "D-01/OQ-4: the line carries the explicit `var(--font-jetbrains), var(--font-geist-mono), Menlo, Monaco, 'Courier New', monospace` stack — honoring the JetBrains Mono lock literally while the CLI body stays Geist Mono (locked-wording consequence, visual delta accepted and noted for the sweep manual rows)"
  - "D-02/OQ-2: the command returns the sentinel `{ navigate: \"/explore\" }` and executeCommand handles it in a new branch BEFORE the ReactNode branch, mirroring the resume openModal idiom: push chrome line `[ opening the visual tour... ]` → setHistory → await 600ms → router.push(result.navigate) — guarantees the chrome line paints before the CLI unmounts (R-2)"
  - "D-02/OQ-1: help entry is a manual `<li>` in HelpOutput.tsx (the CONTEXT auto-derivation claim is false — both help lists are hardcoded li elements, RESEARCH §1.4); placed second, right after `about`, padded to the sibling 23-char column; AdvancedHelpOutput + MobileCommandPalette untouched (OQ-9)"
  - "Import style fix mid-task: `next/link` 15.5 has no named `Link` export — default import `import Link from 'next/link'` per the house style (explore-tour.tsx:37); caught by `npm run typecheck`"
metrics:
  duration: ~40m
  completed: 2026-09-22
status: complete
actuals:
  tokens: ~92k
  tasks: 2
  commits: 2
---

# Phase 05 Plan 01: CLI Island Closure — Welcome Link + explore Command + Help Entry Summary

**One-liner:** the CLI gained two additive exits to /explore — the bracket-styled welcome hyperlink `[ NEW → visual tour: explore ]` (unconditional, JetBrains Mono, accent brackets, same-tab `<Link>`) and the `explore` command (AVAILABLE_COMMANDS 39th entry → navigate sentinel → 600ms-delayed `router.push`) — plus the HelpOutput li entry, all pinned red-first by a 7-test contract suite.

## Shipped

| Commit | Task | Content |
|---|---|---|
| 2238f30 | Task 1 (RED) | `tests/explore-routing.test.mjs` — 7-test locked contract: (a) registry (39th/last entry), (b) welcome line format `[ NEW → visual tour: explore ]` as a strictly-increasing relative-order chain + unconditional position after `showTutorial &&` before `<br />`, (c) dispatch (useRouter import, sentinel, `router.push(result.navigate)`, no window.location, `case "` count 39→40, exactly one chrome line), (d) help entry + untouched-guards, (e) additive-only pre-existing segments, (f) dep-count 39 + finish-card return leg. **Red run on record: 7 tests / 2 pass / 5 fail / exit 1** — the 5 failures name exactly the missing explore wiring |
| df93c8e | Task 2 (GREEN) | `constants.ts` (explore appended, nothing else), `TerminalInterface.tsx` (useRouter hook, union extended with `{ navigate: string }`, `case "explore"` before `case ""`, executeCommand navigate branch with the resume-idiom chrome line + 600ms + `router.push`), `WelcomeMessage.tsx` (the link line sibling + default-import Link), `HelpOutput.tsx` (explore li, 23-char column padding) |

## TDD Gate Compliance

Plan is `type: tdd`. The first scope-matching commit for this plan is the `test:` commit (2238f30), followed by exactly one `feat:` commit (df93c8e) — gate satisfied. The RED run (7/2/5, exit 1) is on record in this session's transcript and in `/tmp/red-run.log` at execution time; GREEN covers the final state: `node --test tests/explore-routing.test.mjs` → **7 pass / 0 fail / exit 0**, and `npm run typecheck` → clean. Note: plan 02's RED commit (3e02ac0) interleaved on the shared phase-5 tree between the two commits — non-overlapping file sets (plan 02 owns explore-side files), no conflict.

## Verification

- `node --test tests/explore-routing.test.mjs` → 7 pass / 0 fail (green over the final post-import-fix state).
- `npm run typecheck` → clean (caught one real error mid-task-2: `Module '"next/link"' has no exported member 'Link'` → default import).
- Acceptance greps on the final tree: `case "explore"` ×1, `router.push(result.navigate)` ×1, `from "next/navigation"` ×1, `window.location` ×0 in TerminalInterface; `<Link href="/explore"` ×1 and `var(--font-jetbrains)` ×1 in WelcomeMessage; `>explore<` ×1 and `Open the visual portfolio tour` ×1 in HelpOutput; `>explore<` ×0 in AdvancedHelpOutput; `explore` is the last AVAILABLE_COMMANDS entry (constants.ts:62).
- Per the plan context, the full build + suite gate is NOT run here (plan 03 owns it); verify commands scoped to this suite only.

## Threat Flags

- **Navigation surface:** `router.push(result.navigate)` — `result.navigate` originates only from the fixed literal `{ navigate: "/explore" }`; no user-controlled value reaches router.push. No `window.location`, no `target="_blank"` (same-tab locked).
- **Client-only mount:** the welcome link + handler live inside TerminalInterface (`dynamic(..., { ssr: false })`) — the `<Link>` never renders server-side; no new SSR attack surface. No new inputs, no eval, no dangerouslySetInnerHTML, no external fetches.
- **Dependencies:** package.json pinned at 39 deps (test (f)) — zero new supply-chain surface.

## Known Stubs

None — stub scan (TODO/FIXME/placeholder/XXX/`.skip`/`.only`) over all five touched files returned zero matches; no skipped tests.

## Self-Check: PASSED

- Created files exist: `tests/explore-routing.test.mjs` (208 lines ≥ 100).
- Modified files meet min_lines gates: `WelcomeMessage.tsx` 76 ≥ 70, `constants.ts` 179 ≥ 110, `TerminalInterface.tsx` 646 ≥ 520, `HelpOutput.tsx` 23 ≥ 23.
- Both commits exist on `phase-5` (2238f30 test:, df93c8e feat:), each containing only its task's declared files; only the plan's five declared files were touched (git log + status clean apart from orchestrator-owned `.planning/async-jobs.json`).
- Untouched-by-construction: MobileCommandPalette.tsx, AdvancedHelpOutput.tsx, EASTER_EGG_IDS, /resume, src/data/**, package.json deps — guarded by suite tests (d)/(f).

## Handoff to Plan 02 / 03

Plan 02 (explore-side header Terminal link) completes the two-way loop; its right-cluster arithmetic must count FOUR 44px controls (Tour, theme, drawer, Terminal = 176px — OQ-6). Plan 03's sweep table should mark the welcome link's JetBrains-Mono-vs-Geist-Mono visual delta (locked-wording consequence, OQ-4) as a manual row, and owns the full `npm run build` + typecheck + full-suite green gate on the merged tree.