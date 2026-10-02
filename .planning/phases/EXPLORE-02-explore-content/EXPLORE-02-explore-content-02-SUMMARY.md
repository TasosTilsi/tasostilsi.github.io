---
phase: 02-explore-content
plan: 02
subsystem: explore-panels
tags: [explore, portfolio-data, server-components, project-cards, skill-chips, dead-code-removal, terminal-pointer]
requires:
  - "Plan 01 outputs: PanelShell chrome, TerminalPointer, SECTION_BODIES adapter-closure registry, page → panels → sections PortfolioData spine (src/components/explore/)"
  - "shadcn Badge primitive (src/components/ui/badge.tsx — variant values untouched, className overrides only)"
  - "PortfolioData types + portfolio-main-data.json (src/data/)"
provides:
  - "ProjectsSection — top-6 linked mini-cards with ↗, optional date tag, hover accent (src/components/explore/sections/projects-section.tsx)"
  - "SkillsSection — 6 JSON-order groups, 36 static outline chips (src/components/explore/sections/skills-section.tsx)"
  - "SECTION_BODIES as a TOTAL Record — all five panels data-driven, no fallback body path (src/components/explore/explore-panels.tsx)"
affects:
  - "Phase 3 (explore-visuals): chart bodies slot into the locked panels via the same registry pattern"
tech-stack: [next@15.5.10, react@18.3.1, tailwindcss@3.4.17, lucide-react@0.475.0]
key-files:
  created:
    - src/components/explore/sections/projects-section.tsx
    - src/components/explore/sections/skills-section.tsx
  modified:
    - src/components/explore/explore-panels.tsx
    - src/components/explore/constants.ts
  deleted: []
decisions:
  - "ProjectsSection: single linked-card anchor template in source (target/rel/mailto occurrence semantics from plan 01 carried over); unlinked-variant robustness branch renders a plain div with no group/hover/cursor."
  - "SkillsSection group keys use the distinct JSON paths (soft_skills / hard_skills.<Category> / languages) while labels are chrome — the two 'Languages' groups would otherwise collide as duplicate React keys; group order disambiguates them visually (UI-SPEC §6)."
  - "Skills group order = JSON key order via explicit pushes (soft_skills → Object.entries(hard_skills) → languages); prettified chrome labels ('Soft Skills', 'Languages') as structural literals per W-5/§17.4."
  - "SECTION_BODIES promoted from Partial to a total Record and the map simplified to always render <Body data={data} />; the private transitional body, its Skeleton import, and the EXPLORE_PANEL_HUMOR import/export deleted (D-06, UI-SPEC §2/§17.12)."
  - "ui/skeleton.tsx kept — sidebar.tsx still imports it (UI-SPEC §0); only the panels stopped using it."
metrics:
  duration: "~45 min"
  completed: "2026-09-21"
status: complete
actuals:
  tokens: ~55000
  tasks: 3
  commits: 3
---

# Phase 02 Plan 02: Projects/Skills bodies + placeholder machinery removal Summary

The last two placeholder panels (Projects, Skills) now render data-driven content — top-6 linked mini-cards and 36 grouped static chips — the transitional placeholder machinery is deleted outright, and the full phase acceptance sweep (typecheck + static build + all UI-SPEC §15 verifier hooks) is green: all five /explore panels are real content with zero placeholder remnants.

## What Was Built

- **ProjectsSection** (new): top-6 mini-cards in JSON order via `slice(0, 6)` — the 7th entry (VESM) verified absent from the export. Linked cards are single anchors (new tab + noopener pair, focus-visible ring, full-card touch target) with name + ↗ ArrowUpRight + optional date tag; hover moves ONLY name+arrow to text-accent via the group class (W-2). Descriptions wrap fully — no clamping anywhere; `sourceUrl` not rendered (one link per card, §17.11). `// more: projects --all in the terminal` pointer after the stack.
- **SkillsSection** (new): 6 groups in JSON key order (soft_skills → Object.entries(hard_skills) insertion order → languages) with prettified chrome labels; all 36 chips as outline Badges with `font-normal pointer-events-none` (no hover flicker, not focusable — §10); groups keyed by distinct JSON paths so the two "Languages" rows don't collide as React keys; `// more: skills in the terminal` pointer after the groups.
- **explore-panels.tsx** (finished): SECTION_BODIES promoted to a total `Record<ExploreSectionId, ComponentType<SectionBodyProps>>` with the five adapter closures; map simplified to always render `<Body data={data} />`; private transitional body, Skeleton import, and humor import removed; doc comment updated token-free. Grid classes, ACCENTS record, and About span byte-identical (verified by grep counts == 1).
- **constants.ts** (trimmed): EXPLORE_PANEL_HUMOR export + doc comment deleted after confirming its sole consumer was explore-panels.tsx; EXPLORE_SECTIONS, ExploreSectionId, theme keys, and status-bar constants untouched.

## Red/Green Timeline (no test runner in repo — assertion greps per verification_protocol)

- Task 1 RED: projects-section.tsx absent; 4/6 project names MISSING from export (Clarif-AI/DeepIndex pre-present via JSON-LD — pre-green invariant); projects --all pointer 0; projects.repo.checkout humor 2 (SSR + flight); "— pending" 4. GREEN: slice(0, 6) == 1, target="_blank" == 1 (single linked template; 6 anchors at runtime), sourceUrl 0, flex-wrap 0, all 6 names render, pointer ≥ 1, humor 0, pending exactly 2 (only Skills transitional, flight-doubled). typecheck + build 2/2.
- Task 2 RED: skills-section.tsx absent; skills.matrix.map humor 2; pending 2. GREEN: all source counts exactly 1 (variant/pointer-events/font-normal/badge import/command), 6/6 chip samples present, plus distinguishing chrome-label greps (Soft Skills ≥ 1, >Infrastructure< ≥ 1, >Testing< ≥ 1 — all 0 pre-change, isolating section-body rendering from the JSON-LD payload that pre-contains skill names); humor 0; pending exactly 0 — all placeholder content eliminated. badge.tsx unmodified. typecheck + build pass.
- Task 3 RED: 7 dead-code token matches in explore-panels.tsx + the constants export (importer set verified == explore-panels.tsx). GREEN: full phase acceptance sweep all green (below).
- Final consolidated gate on the final tree: typecheck clean; `npm run build` exports 2/2; every sweep grep green.

## TDD Gate Compliance

Plan type is execute (not tdd) — no test: commit required. The repo has no test runner (verified: no test script, no test configs — plan 01 established the assertion-grep protocol); red/green ran on the plan's own verify greps against source and out/explore.html, with red states recorded before each implementation step.

## Known Stubs

None. No TODO/FIXME/placeholder/skipped-test markers in any new or modified file (grep-verified). The graceful-hide branches (unlinked project card, empty skills group) are robustness code per UI-SPEC §11 that never fires with current data — intentional, not stubs.

## Threat Flags

None. No dangerouslySetInnerHTML/eval; the linked-card anchor carries `rel="noopener noreferrer"` (target="_blank" occurrence == 1 in source, 6 anchors at runtime verified in the export); hrefs render stored values verbatim with no protocol repair; zero hardcoded portfolio copy in src/components/explore/ (sweep grep 0); no new dependencies (D-08); no charts (phase 3), no pointer interactivity (phase 5), no photo/education content (deferred).

## Self-Check: PASSED

- Files: projects-section.tsx + skills-section.tsx exist with pinned exports; explore-panels.tsx is a total registry; constants.ts no longer exports the humor map; ui/skeleton.tsx, ui/badge.tsx untouched (git status clean on src/).
- Commits: cd9ee4f (task 1), ef490b8 (task 2), 55d7681 (task 3) — one per task, scoped feat/refactor(EXPLORE-02-explore-content-02).
- Full phase acceptance sweep on the final code tree (chronologically before the summary/state docs): dead-code tokens 0; hardcoded-copy 0; truncation-in-phase-files 0; grid/About-span/PanelShell chrome counts == 1; "use client" 0; pending 0; both --all pointers present; no pointer on About/Contact; skeleton file present. /explore still statically exported (2/2 routes).

## Deviations

1. **React-key collision fixed in SkillsSection**: keying groups by display label would collide ("Languages" appears both as a hard_skills category key rendered verbatim and as the languages chrome label). Implemented the UI-SPEC §6 pin literally — groups keyed by their distinct JSON paths (`soft_skills`, `hard_skills.<Category>`, `languages`) with labels rendered separately. Caught during implementation, before any green run.
2. **Task 2 chip-sample loop strengthened**: the plan's 6-name sample loop was pre-green (skill names already live in the export's JSON-LD `knowsAbout` payload, as with plan 01's contact domains), so it cannot isolate section rendering. Added distinguishing greps (chrome labels "Soft Skills"/">Infrastructure<"/">Testing<", all 0 pre-change) — recorded so the verifier doesn't mistake the loop's empty output for new evidence.