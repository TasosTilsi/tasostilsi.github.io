---
phase: 09-editorial-motion-revision
plan: 02
subsystem: explore-about-panel
tags: [about-package, data-write, draft-approve-write, graceful-hide, server-component, rev-15]
requires:
  - "Approved 3-field data draft (Task 1, checkpoint resolved 2026-09-24 — about-data-draft.md APPROVAL BOX filled + committed)"
  - "PortfolioData['about'] prop contract (D-07) and the EXPLORE-07 contact anatomy (CHANNELS/ROW_CLASS) preserved verbatim"
provides:
  - "about.positioning / about.availability / about.metrics in portfolio-main-data.json — typed same-commit in the .d.ts (R-7)"
  - "AboutSection §2.1 presentation package: positioning lead → 2×2 metrics tiles → availability chip → avatar → demoted summary → tightened contacts → resume link LAST"
  - "Integrity-suite pins (5 new tests) locking the approved values verbatim + the additive-only contract"
affects:
  - "src/components/explore/sections/about-section.tsx (restructured §2.1; server component preserved)"
  - "out/explore.html static export (About SSR now carries the package)"
  - "plans 03/04 consume the untouched PanelShell/grid chrome — no interface change"
tech-stack: [next-static-export, react-server-components, tailwind, node--test, lucide-react]
key_files:
  created:
    - ".planning/phases/EXPLORE-09-editorial-motion-revision/about-data-draft.md (Task 1, pre-checkpoint session — 3 fields + source-trace table + APPROVAL BOX)"
  modified:
    - "src/data/portfolio-main-data.json"
    - "src/data/portfolio-main-data.d.ts"
    - "tests/portfolio-data-integrity.test.mjs"
    - "src/components/explore/sections/about-section.tsx"
decisions:
  - "Resume semantics: Task 1's checkpoint:human-action was resolved before this session (draft committed 08f4f4e; user approval recorded in the APPROVAL BOX + committed b10cc8a) — executor resumed per contract at Task 2 (skip tasks 1..1); wave-1 sibling plan 01 verified COMPLETE before Tasks 2-3 ran (execution_note coupling satisfied)"
  - "Task 2 is red-first INSIDE the task but lands as ONE commit (R-7 same-commit rule makes splitting data+types+tests a violation): red evidence recorded in-session (4 new tests failing on absent fields, pre-existing pins green), then one feat commit greens the suite (18→23 assertions)"
  - "Metric labels stored lowercase, uppercased by CSS only; values render as stored — zero numeric parsing in the component (transcription discipline, §2.3)"
  - "Avatar = plain <img loading=lazy decoding=async> (U-5/U-12 default: tinyurl not in remotePatterns, output:'export' + images.unoptimized; verified eslint.ignoreDuringBuilds:true so the img element cannot block the build); no runtime error handler — AboutSection stays a server component, broken-URL browser fallback accepted"
  - "Graceful-hide §2.8 implemented as 4 conditional sites; the fallback path re-promotes the summary to its pre-phase prominence (text-sm text-foreground) so the pre-phase representation survives only as the fallback, never as a parallel rendering"
  - "Inter-block rhythm defaulted to the §2.7 bounds: mt-4 (metrics) / mt-3 (chip, avatar, summary, meta) / my-2 divider / mt-2 resume; gap-2.5→gap-2 and a leading-snug value span carry the contact tightening; min-h-[44px] stays via the shared ROW_CLASS const + the resume row"
  - "Header doc-comment wording avoids the literal strings the acceptance grep bans ('use client|framer-motion|onError' must count 0 across the whole file INCLUDING comments) — described as 'no client directive, no runtime error handlers' instead"
metrics:
  duration: "~15 min (post-checkpoint resume: Tasks 2-3; Task 1 + approval round completed in the prior executor session)"
  completed: 2026-09-24
status: complete
actuals: { tokens: "~95k", tasks: 3, commits: "4 on the plan (08f4f4e draft, b10cc8a approval record, 377ec78 data+types+tests, 8c3d39f component); 2 landed this session" }
---

# Phase 09 Plan 02: About Presentation Package Summary

Three user-approved data fields (positioning/metrics/availability) written + typed same-commit and rendered as the pinned §2.1 About package — positioning lead, 2×2 metric tiles, availability chip, avatar, demoted summary, 9 tightened contacts — over a fully green tree.

## What was done

- **Task 1 (checkpoint:human-action — resolved pre-spawn):** the 3-field draft with the source-trace table and APPROVAL BOX was written and committed (08f4f4e); the user approved all three fields as drafted (recorded in the box, committed b10cc8a). Verified from git before touching any src/ file; no re-execution.
- **Task 2 (commit 377ec78):** RED-first inside the task — 5 new assertions appended to the integrity suite (section 10, house style: verbatim constants + source-transcription pin + additive-only pin); RED run showed exactly the 4 missing-field tests failing with every pre-existing pin green. Then the approved values were written into the `about` object immediately after `profileImageUrl` (additive only) and typed same-commit in the .d.ts (`positioning?: string[]`, `availability?: string`, `metrics?: { value: string; label: string }[]`). GREEN: integrity suite 23/23, typecheck green, surface-safety grep confirmed no CLI/resume/PDF consumer shape-pins `about`'s key set. ONE atomic commit per R-7.
- **Task 3 (commit 8c3d39f):** AboutSection restructured to the pinned §2.1 notes order (U-1): lead → metrics 2×2 → availability chip → avatar → demoted summary + meta → divider → 9 tightened contacts → Full resume link LAST. Server component preserved (no client directive, no hooks, no runtime error handlers); zero framer-motion; zero new globals.css declarations; values render as stored. All acceptance greps green (positioning ×2, metrics ×2, loading=lazy ×1, min-h-[44px] ×3, ROW_CLASS ×2, 9 channel rows, banned strings 0, graceful-hide sites 4, no parseInt/split).

## Verification (green gate over the final tree)

- `npm run typecheck` — green (tsc --noEmit, exit 0)
- `npm run build` — green; static export emits the package into out/explore.html (lead, accent tail, availability, metrics, avatar, demoted summary all grep-verified in the SSR HTML)
- Full node --test suite over tests/*.mjs: **225/225 pass, 0 fail** (suite delta 220→225; includes this plan's +5 integrity tests and the About-reading explore-visuals suite with its exp-nudge/underline-parity pins intact)
- Chronology: build + full suite ran as the last verification actions before this SUMMARY write; plan 04 Task 3 (wave 3) owns the phase-final full-suite green gate after all waves.

## Deviations

None against the plan. Two recorded compliance details: (1) the Task-2 red→green evidence lives inside one atomic commit (R-7 override of commit-splitting — the plan's own verify step demands exactly this); (2) the component doc-comment avoids the banned literal strings because the acceptance grep scans the whole file including comments.

## Known Stubs

None — stub scan (TODO/FIXME/placeholder/skipped) clean across the plan's files.

## Threat Flags

- The avatar `<img>` renders an external, user-owned https URL (tinyurl, already in the data as about.profileImageUrl and previously consumed only by layout metadata). No runtime error handler (server-component constraint): a broken URL degrades to the browser's broken-image fallback — accepted edge (UI-SPEC §2.5/U-5). No user input flows into any href; positioning/availability/metrics are static approved data.
- No auth/storage/network code touched; no new dependencies.

## Self-Check: PASSED

- All 5 key files exist on disk (sizes verified: about-data-draft.md 5600B, about-section.tsx 10089B, .d.ts 2461B, JSON 26434B, integrity suite 28509B).
- All plan commits exist in git (377ec78, 8c3d39f verified via git cat-file; 08f4f4e + b10cc8a predate this session).
- Working tree at completion: only pre-existing untracked harness junk (.cursor/, probe PDFs, tsbuildinfo) — no uncommitted plan-02 source.

## TDD Gate Compliance

Plan type is `execute` (not `tdd`), so the ship-gate's first-commit-must-be-test rule does not bind. Discipline still held: the Task-2 RED run (4 failing tests) is on record BEFORE the data write; GREEN (23/23) after; Task 3's restructure is presentation-only over data already pinned by tests, gated green by typecheck + build + both About-reading suites. No warning.