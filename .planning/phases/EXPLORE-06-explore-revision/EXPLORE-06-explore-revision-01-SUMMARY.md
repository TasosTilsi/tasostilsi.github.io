---
phase: EXPLORE-06-explore-revision
plan: "01"
subsystem: portfolio-data
tags: [rev-01, data-refresh, docx, draft-approve-write, cli-branding, integrity-suite]
requires:
  - ".planning/phases/EXPLORE-06-explore-revision/resume-docx-extraction.md — the docx content source of truth"
  - ".planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md — the approved D-01 diff (user approval recorded 2026-09-22, commit ad03775)"
  - "src/data/portfolio-main-data.json — the single store every surface reads"
provides:
  - "Refreshed portfolio-main-data.json on the docx contract: branding, summary, 8 core-competency clusters, quantified bullets, enriched flagship projects, featured certs/articles/education, U-4 isTechRelated contract (exactly 3 true)"
  - "Types-first .d.ts: required core_competencies + featured? on Project/Certification/Article/EducationEntry"
  - "tests/portfolio-data-integrity.test.mjs — 18-row zero-dep suite pinning the docx contract + nothing-deleted ledger"
  - "CLI/SEO branding propagation: WelcomeMessage (2 sites), AboutOutput derived-width ASCII box, SkillsOutput competencies block, explore-intro 3-line reserve"
affects:
  - "src/components/resume/ResumeExperience.tsx — untouched .filter((job) => job.isTechRelated) now renders exactly the docx's 3 roles (U-4 wiring consumed by plan 03)"
  - "src/components/cli/outputs/TaasOutput.tsx — auto-derives the pipe-bearing title (seen-and-approved, no code change)"
  - "tests/explore-visuals.test.mjs — 3 report-only rows now red (see Triage below; plan 04 task 2 owns the rewrite)"
  - "plan 03 (PDF) + plan 04 (explore skills cards) — consume core_competencies + featured fields typed in this commit"
tech-stack: [next-15, react-18, typescript-5, node-test-runner]
key-files:
  created:
    - "tests/portfolio-data-integrity.test.mjs"
    - ".planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md (created + approved in the prior session of this plan: 96cd16f + ad03775)"
  modified:
    - "src/data/portfolio-main-data.json"
    - "src/data/portfolio-main-data.d.ts"
    - "src/components/cli/outputs/WelcomeMessage.tsx"
    - "src/components/cli/outputs/AboutOutput.tsx"
    - "src/components/cli/outputs/SkillsOutput.tsx"
    - "src/components/explore/explore-intro.tsx"
    - "tests/explore-shell.test.mjs (one row: intro min-h-[60px] B-6 pin)"
    - "tests/explore-sweep.test.mjs (one row: intro-strip EXPLORE@375 pin → 3-line B-6 reserve; renewal exposed by the full-gate run)"
decisions:
  - "Resume-after-checkpoint: tasks 1-2 (draft + user approval) were committed by the prior session (96cd16f draft, ad03775 approval — downloads B, geo d2, defaults (c), keywords yes, chips stay, U-4 approved); this session resumed at Task 3 per the orchestrator's checkpoint protocol."
  - "Types-first RED honored exactly per plan: .d.ts + integrity suite written before the JSON write; RED captured 15 failing rows vs the pre-refresh JSON (/tmp/red-data.log), then GREEN 18/18."
  - "Downloads wording = decision (a) B: '600+ downloads in launch week (Sep 2026)' in the deepindex line + summary tail '…debuted at 600+ downloads in its launch week.' — registry-verified spike (646, Sep 9-14 2026), docx 400+ rejected, pinned by the suite."
  - "U-6 flagship order written into the data: projects[0]=DeepIndex, projects[1]=Clarif-AI, both featured:true (data order = render order; no client sorting)."
  - "Article insertion positions chosen so featured render order equals the docx SELECTED WRITING order (AI Agent → Playwright 45 → Core → Flaky → Geo Part 1) while all 12 originals keep relative order (never re-sorted)."
  - "Per-article Medium links fetched at write time via the profile RSS feed (generativeai.pub + startup-insider-edge slugs, ?source= tracking param stripped) — profile-level fallback not needed."
  - "Geo d2: real Part 1 added (featured, Dec 23 2025, verified subtitle) after Flaky; the Part-2 entry stays byte-untouched and unfeatured."
  - "SkillsOutput competencies block prepends before soft skills (name chip in the existing bg-primary/10 text-primary pattern + proof line beneath, graceful-hide); soft/hard/languages blocks byte-unchanged (OQ-3: data-driven text only)."
  - "AboutOutput box width derives from max(name, title)+2 via '═'.repeat — the 62-char title fits; acceptance grep forbids the old pad literal even in comments (self-tripped once, reworded)."
  - "explore-intro B-6 (checker fix): min-h-[40px]→min-h-[60px] 3-line reserve for the ~91-char intro + shell-suite pin renewed in the same commit."
  - "Fixture-precision lesson (on record): the pre-refresh JSON uses straight apostrophes (Team's, Google's, Here's, Shouldn't) while the docx extraction uses curly (team's, “shift-left”) — ledger fixtures were byte-verified against the actual JSON before GREEN."
metrics:
  duration: "tasks 1-2 (draft + approval): prior session, 2026-09-22; tasks 3-4 (this session): ~55 min, 2026-09-23"
  completed: 2026-09-23
status: complete
actuals:
  tokens: ~110000
  tasks: 4
  commits: 4
---

# Phase EXPLORE-06 Plan 01: Data refresh to docx contract + CLI/SEO branding propagation Summary

Wrote the user-approved docx data refresh into portfolio-main-data.json (RED-first integrity suite 15✖→18✔), propagated the new 62-char branding to every surface that does not auto-derive it (WelcomeMessage, AboutOutput derived-width box, SkillsOutput competencies block, explore-intro 3-line reserve), and left the nothing-deleted ledger provably intact — resuming from the committed draft+approval checkpoint (96cd16f, ad03775).

## What was done (per task)

**Task 1 — draft artifact (prior session, commit 96cd16f)** — `data-refresh-draft.md`: complete verbatim diff per D-02 mapping (12 sections incl. the consumer propagation table, downloads decision box with registry-verified numbers, U-4 flip, U-6 order, all decision boxes). Verify greps green.

**Task 2 — checkpoint (prior session, commit ad03775)** — user approval recorded verbatim in the draft's approval box: (a)=B spike-scoped downloads, (d)=d2 real Part 1, all remaining items approved as recommended (title/summary/competencies/bullets verbatim, U-4 flip, deepindex-first order, Anthropic defaults, keywords refresh, chips stay, TaasOutput pipe sentence seen-and-accepted). No JSON write occurred before approval (commit order on record).

**Task 3 — write the approved diff (this session, commit b59efee)**
- RED on record (/tmp/red-data.log): `.d.ts` types + integrity suite written first; run against the pre-refresh JSON → 15 failing / 3 passing rows (title mismatch, no core_competencies, no featured, 4 isTechRelated:true vs 3 expected, old bullets/order/wording; ledger rows green by construction).
- GREEN: portfolio-main-data.json written exactly per the approved draft — about.title (62 chars), about.description (docx + (a)=B tail), meta.description/keywords, new top-level core_competencies (8 clusters, 9→8 merge = segments ②+③ into "Test Automation Stack & Languages" whose proof carries the full ②③ enumeration), Chubb 6 / Upstream 3 / Netcompany 4 docx bullets (curly quotes verbatim), Smartup PCC isTechRelated→false (U-4; entry + 5 prose lines intact), projects DeepIndex→Clarif-AI both featured (U-6) with enriched descriptions + (a)=B wording, certs 41+4 Anthropic (ISTQB + 4 featured, date "2026", link null), articles 12+3 (5 featured, RSS-fetched per-article links), education MSc+BEng featured.
- Verify: `npm run typecheck` 0; integrity suite 18/18; explore-visuals-server 15/15; raw greps `"isTechRelated": true` = 3, `featured` = 14 lines, `core_competencies` present.

**Task 4 — CLI + SEO propagation (this session, commit 8ac886d)**
- RED on record: WelcomeMessage hardcoded literal at :32 (banner) + :41 (mobile), AboutOutput padEnd(57), SkillsOutput 0 core_competencies.
- GREEN: WelcomeMessage both sites interpolate `portfolioData.about.title` (chrome byte-identical); AboutOutput box width = `Math.max(name.length, title.length) + 2` with `'═'.repeat` rules; SkillsOutput prepends the Core Competencies block (chip + proof, length-guarded); explore-intro B-6 `min-h-[60px]` + doc-comment + shell-suite pin renewed.
- Verify: typecheck 0; absence greps clean repo-wide (src/components + src/app); integrity 18/18; shell 30/30; server 15/15.

## Red/Green timeline

| Run | Result | Evidence |
|---|---|---|
| Task 3 RED (pre-refresh JSON) | 15✖ / 3✔ — title, meta, summary, competencies, bullets, U-4 (4≠3), U-6 order, downloads wording, featured, education flags | /tmp/red-data.log |
| Task 3 GREEN | integrity 18/18 + typecheck 0 + server 15/15 + acceptance greps | session log |
| Task 4 RED | hardcoded literal ×2, padEnd(57), 0 core_competencies | session log |
| Task 4 GREEN | typecheck 0 + greps clean + integrity 18/18 + shell 30/30 + server 15/15 | session log |

## TDD Gate Compliance

Plan type is `execute` (not `tdd`) — no test:-commit-before-feat: gate applies. Red-first discipline honoured inside both tasks: each contract change ran RED on record before its GREEN edits; RED+GREEN land in the same atomic per-task commit.

## Report-Only Triage (explore-visuals.test.mjs — plan-01-forbidden file, never rewritten here)

Ran report-only after the data write: 36/39 pass, 3 fail, each triaged:
1. `techMentions: exact cells from the real corpus — 4 cells / 5 mentions` — **plan 01's own data write** shifted the mention corpus (docx bullets drop 'Built RAG pipelines…', count shifts). Owner: plan 04 task 2 (whole techMentions surface rewrite).
2. `buildCareerSpan: 7 rows in JSON order, WashPark at 0%, Chubb reaches 100%` — the row pins Smartup PCC's `isTechRelated: true`; **U-4 (this plan's named data-write flip, user-approved)** makes it `false`. The pin is in the plan-02/04-owned file — owner: the file's next rewrite (plan 04 task 2 / verify-step routing); one-line fixture update (`true`→`false` for the Smartup row).
3. `export: treemap aria-label enumerates every techMentions name count pair` — export-level row over a stale `out/` (pre-refresh build) AND the treemap surface plan 04 removes. Owner: plan 04.
All other rows green, including the 39-dependency/recharts pin (package.json untouched) and the REV-07 byte-untouched invariant. **Full-gate follow-up (23b07f8):** the first full-suite run exposed one MORE B-6-invalidated row the shell-suite grep missed — `sweep row EXPLORE@375: intro strip min-height reserves the two-line wrap` (tests/explore-sweep.test.mjs:157, pinning min-h-[40px]). Renewed to the 3-line reserve in commit 23b07f8 (same stale-test discipline as the shell pin).

## Known Stubs

None. `grep TODO|FIXME|placeholder|.skip|.todo` over all touched files: the only hits are 2 pre-existing explore-shell.test.mjs test names asserting the OLD humor machinery's removal (plan 02 heritage, not stubs).

## Threat Flags

None. No auth, secrets, input handling, or network surface in the touched files; the only outbound fetches were read-only registry/Medium/RSS verifications feeding the approved draft (D-03).

## Self-Check: PASSED

- Files: data-refresh-draft.md (approved, 277 lines) ✓; portfolio-main-data.json (369 lines, valid JSON, docx contract pinned) ✓; portfolio-main-data.d.ts (core_competencies required + featured? on Project/Certification/Article/EducationEntry) ✓; tests/portfolio-data-integrity.test.mjs (18 tests) ✓; WelcomeMessage/AboutOutput/SkillsOutput/explore-intro edits present ✓.
- Commits: 96cd16f (draft), ad03775 (approval), b59efee (data+types+test), 8ac886d (CLI+SEO), 23b07f8 (sweep-row renewal), 0930bb4 (.d.ts completion — see note) — all on `phase-6`, scope EXPLORE-06-explore-revision-01 ✓.
- must_haves truths: all 6 verified (data-driven branding zero hardcoded literals / derived box width / CLI competencies 8 clusters / nothing-deleted ledger deep-equal / U-4 exactly 3 true + Smartup CLI-reachable / approval recorded before write) ✓.
- key_links: JSON→.d.ts same-commit typing ✓; WelcomeMessage portfolioData.about.title ×2 ✓; SkillsOutput core_competencies ✓; ResumeExperience untouched filter ×3-true ✓.
- Final gate (chronologically last, after this SUMMARY write): `npm run typecheck` 0 + full `node --test tests/*.test.mjs` over the final tree — 185 tests, 182 pass / 3 fail, all 3 the pre-triaged report-only rows above (plan-04-owned surfaces; phase acceptance re-asserts their green after plan 04). See completion note below the report.

## Deviations (documented, minimal)

1. **`tests/explore-shell.test.mjs` edited (1 row)** — beyond the task's `<files>` list, but explicitly named by the plan's B-6 exception as the assertion surface ("the shell suite's intro assertions reflect the 3-line reserve"); stale-test discipline pins it to the same commit.
2. **`src/components/explore/explore-intro.tsx` edited** — the plan's own B-6 exception ("explore-intro.tsx IS edited"), outside the frontmatter `files_modified` list but mandated by the checker fix.
3. **Resume note**: Task 3's `files` frontmatter lists only JSON+types+test, but the prior session's Tasks 1-2 additionally committed the draft artifact (its own listed file) — checkpoint protocol artefacts.
4. **Atomic-set miss, fixed forward (0930bb4)**: of the five .d.ts type edits, Project.featured + EducationEntry.featured landed in b59efee, but the remaining three (PortfolioData.core_competencies, Certification.featured, Article.featured) were completed during Task 4's GREEN when typecheck exposed their absence — and the Task-4 commit scoped only the CLI files. Result: 3 commits (b59efee..23b07f8) carried a transient committed-tree inconsistency (JSON has the field, types don't) that never affected any run (all gate runs execute on the working tree, which had the types). Landed as 0930bb4; committed tree now consistent.

## Completion note (final gate on record)

The final gate ran twice over the post-SUMMARY tree by design: once to measure, once (after the SUMMARY numbers were corrected with those measurements) as the chronologically last action anchoring this completion claim. Both runs identical: `npm run typecheck` exit 0; `node --test tests/*.test.mjs` → **185 tests, 182 pass, 3 fail** — the 3 report-only rows triaged above (plan 04 owns their rewrite; the buildCareerSpan row's `true`→`false` Smartup fixture update is a one-line renewal recorded in the triage). /tmp/final-gate-tc2.log + /tmp/final-gate-suite2.log hold the runs.