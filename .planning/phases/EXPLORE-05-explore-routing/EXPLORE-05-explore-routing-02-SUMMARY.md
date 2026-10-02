---
phase: 05-explore-routing
plan: 02
type: tdd
subsystem: explore-header
tags: [explore, header, routing, responsive, tdd, d-03, d-04]
requires:
  - src/components/explore/constants.ts (EXPLORE_TOUR_FINISH, linkHref "/" — unchanged, asserted)
  - phase-4 committed explore-header.tsx base (ghost recipe, Tour/theme/drawer controls)
  - tests/explore-tour.test.mjs house style (comment-strip pattern, red-first precedent)
provides:
  - /explore → CLI leg: Terminal ghost link, rightmost header child, href="/" same-tab (D-03)
  - tests/explore-header.test.mjs — 9-test Layer-2 suite incl. falsifiable 375px four-control arithmetic (OQ-6)
  - four-control right-cluster fit proof: 279.25px ≤ 375px at the 14px ≤640px root (globals.css:464-466)
affects:
  - src/components/explore/explore-header.tsx — SSRs into out/explore.html at the next build; export-level assertion of this link belongs to plan 03 (wave's single build point)
tech-stack: [next@15.5.25 Link, lucide-react@0.475.0 Terminal icon, node:test, tailwind px literals]
key-files:
  created:
    - tests/explore-header.test.mjs
  modified:
    - src/components/explore/explore-header.tsx
decisions:
  - "D-03/OQ-8: Terminal <Link href=\"/\"> is the LAST header child, after <ExploreDrawer> — rightmost of the right cluster (Tour → theme → drawer → Terminal)."
  - "Ghost recipe duplicated VERBATIM (house pattern, explore-tour.tsx:60-61 precedent) — no shared const, existing buttons untouched (D-05)."
  - "OQ-6: the 375px test asserts the physical FOUR 44px controls (176px) — the SPEC's three-control shorthand would make the fit claim lie; drawer Menu button counted."
  - "Arithmetic pinned at the 14px root (globals.css:466 @media ≤640px): 28 + 40.25 + 176 + 35 = 279.25px ≤ 375px; 44px targets are px literals, immune to rem shrink."
  - "Sanctioned comment-only exception applied to exactly the plan's two named spots (:5-11 doc block, :88-89 drawer comment) — stale rightmost claims reworded, zero code/test-visible-string change."
  - "Import order follows explore-tour.tsx house style: next/link first, lucide-react second."
metrics:
  duration: single executor session 2026-09-22 (+0300); RED commit 08:55:16 → GREEN commit 08:55:55 (39s red→green)
  completed: 2026-09-22
  status: complete
actuals:
  tokens: ~55k
  tasks: 2
  commits: 2
---

# Phase 05 Plan 02: Explore Header Terminal Link Summary

Completed the /explore → CLI leg of the two-way loop — a 44px real-px ghost Terminal link as the rightmost header child (D-03) — with the 375px right-cluster fit proven by falsifiable arithmetic rather than by eye (D-04/OQ-6), via strict RED→GREEN TDD.

## What was done

**Task 1 — RED (`3e02ac0`, `test:`):** created `tests/explore-header.test.mjs` (203 lines, 9 tests, house Layer-2 source-invariant style). On the untouched header the run failed **exit 1 with exactly 4 new-behaviour failures for the right reasons**: aria-label `"Open the terminal"` absent; ghost recipe ×3 ≠ 4; no `<Link`; 3 ≠ 4 cluster controls. The 5 regression guards (title-only truncator, px-not-rem, Tour trigger id, Tour→theme→drawer order, `EXPLORE_TOUR_FINISH.linkHref === "/"`) were green by design — they pin what must not change.

**Task 2 — GREEN (`c638a4d`, `feat:`):** `explore-header.tsx` (102 → 112 lines) gained the Terminal link as the last header child after `</ExploreDrawer>`: `<Link href="/" aria-label="Open the terminal">` with the ghost recipe class string copied verbatim from the other three 44px controls, `<Terminal className="h-5 w-5" aria-hidden="true" />` from lucide-react, no `target` attribute (same-tab lock). `next/link` imported first (explore-tour.tsx house order); `Terminal` added alphabetically to the lucide import. The two plan-sanctioned stale-comment spots were reworded comment-only (same line count): the doc block (:5–11) and the drawer toggle comment (:88–89) now state drawer → Terminal order with Terminal rightmost.

**Green run:** 9/9 pass, exit 0 — chronological green over the committed red.

## Acceptance criteria — results

- `node --test tests/explore-header.test.mjs` exited non-zero BEFORE any implementation edit (red on record: 4 fail / 5 pass) ✅
- Suite references `Open the terminal`, `h-[44px] w-[44px]`, the 279.25 ≤ 375 arithmetic, and `linkHref` ✅
- Green run exits 0 (9/9) ✅
- `grep aria-label="Open the terminal"` → :105 ✅; `grep -c 'h-[44px] w-[44px]'` → 4 ✅; `href="/"` → :104; `target=` → 0 ✅
- `RIGHTMOST, UI-SPEC §3` and `rightmost control (UI-SPEC §3)` → 0 matches each ✅
- File at 112 lines ≥ min_lines 105; suite at 203 lines ≥ min_lines 80; `ExploreHeader` still the sole export ✅

## TDD Gate Compliance

PASSED — plan is `type: tdd`; the first scope-matching commit is `test:` (`3e02ac0` RED) and precedes the `feat:` commit (`c638a4d` GREEN). No gates skipped; no test weakened or deleted to reach green.

## Scope discipline

Only the plan's two `files_modified` were committed (1 file per commit). Verify commands stayed scoped to `tests/explore-header.test.mjs` per the plan — no `npm run build`, no full-suite run (parallel-wave plan 01 shared this tree; its GREEN commit `df93c8e` interleaved between my RED and GREEN commits; the wave's single build point + export-level link check belong to plan 03). `explore-tour.tsx`, CLI files, panels/visualizations/wizard files, `src/data/**`, and `package.json` untouched.

## Known Stubs

None — stub scan (TODO/FIXME/placeholder/.skip/xit) over both files: clean.

## Threat Flags

None — threat-surface scan over the header: no external URLs, no `target=`, no `window.open`, no `dangerouslySetInnerHTML`; the new link is a same-origin internal `next/link` to `/` rendered in a server-compiled client component.

## Self-Check: PASSED

- `tests/explore-header.test.mjs` exists (203 lines); `src/components/explore/explore-header.tsx` exists (112 lines, full-file read verified).
- Both commits exist as git objects on `phase-5`: `3e02ac0` (test:), `c638a4d` (feat:) — verified via `git cat-file -t`.
- Working tree carries only harness artefacts and plan-01's in-flight scope; nothing of this plan left uncommitted.

## Notes for review / next plans

- Residual stale phrase: the Tour-trigger comment (:60–63) still ends "…so the drawer stays RIGHTMOST (locked phase-1 pin)" — also factually outdated now, but the plan's sanctioned comment-only exception enumerated exactly two spots and said touch nothing else, so it was left in place. Comment-only nit; the phase's code-review step can fold it.
- Rem-based terms in the cluster math (padding, glyph dots, gaps) shrink further below 640px while the 44px px targets cannot — the manual sweep rows in plan 03 should eyeball rendered proportions at 375px (D-04 Type-M rows).
- `out/explore.html` still predates this change; plan 03's build asserts the link SSRs (`aria-label="Open the terminal"` + `href="/"` in the export), mirroring tests/explore-shell.test.mjs precedents.