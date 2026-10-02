---
phase: EXPLORE-06-explore-revision
plan: "03"
subsystem: resume-surfaces
tags: [rev-02, rev-03, docx-order, resume-rebuild, pdf-rebuild, featured-curation, verify-script, d-08]
requires:
  - "plan EXPLORE-06-explore-revision-01 — the refreshed data contract (core_competencies, featured flags, U-4 3-role flip, U-6 flagship order) typed in portfolio-main-data.d.ts"
  - "src/data/portfolio-main-data.json — the single store /resume and the PDF template both read"
  - ".planning/phases/EXPLORE-06-explore-revision/resume-docx-extraction.md — the docx structure source of truth"
provides:
  - "/resume rebuilt to the single-column docx order: SUMMARY → CORE COMPETENCIES → PROFESSIONAL EXPERIENCE → PROJECTS → EDUCATION → CERTIFICATIONS → SELECTED WRITING, chrome + modal contract preserved"
  - "Featured-only curation on all four curated sections (projects, education, certifications, writing) via one featuredOnly prop mechanism; ResumeSkills section deleted from the composition/barrel/disk (skills data stays CLI-reachable)"
  - "PDF export rebuilt to the same docx structure, fully data-driven (about.contact kills the hardcoded LinkedIn/GitHub/Website literals; isTechRelated + featured selection replaces positional slices)"
  - "scripts/verify-resume-content.js rewritten to the docx contract — standalone node script, exit 0"
  - "tests/resume-docx-order.test.mjs — 14-row zero-dep suite pinning order, labels, chrome, U-4, curation, skills removal, print CSS"
affects:
  - "plan 04 (explore skills cards) — the 2 pre-triaged explore-visuals.test.mjs rows (techMentions corpus, buildCareerSpan Smartup fixture) stay red until its rewrite"
  - "CLI ResumeModal — untouched, inherits the docx layout + featured curation through the unchanged ResumeViewProps (§7.5, E-16 uncoupling live)"
  - "resume modal's Print/Save-PDF link (/resume-export.html) — served by the rebuilt template with the same docx structure"
tech-stack: [next-15, react-18, typescript-5, node-test-runner, static-export]
key-files:
  created:
    - "src/components/resume/ResumeCoreCompetencies.tsx"
    - "tests/resume-docx-order.test.mjs"
  modified:
    - "src/components/resume/ResumeView.tsx"
    - "src/components/resume/index.ts"
    - "src/components/resume/ResumeSummary.tsx"
    - "src/components/resume/ResumeExperience.tsx"
    - "src/components/resume/ResumeProjects.tsx"
    - "src/components/resume/ResumeEducation.tsx"
    - "src/components/resume/ResumeCertifications.tsx"
    - "src/components/resume/ResumeArticles.tsx"
    - "scripts/generate-static-resume.js"
    - "scripts/verify-resume-content.js"
    - "public/resume-export.html"
    - "tests/explore-shell.test.mjs (one row: intro-strip fixture renewed to the refreshed branding — see Deviations)"
  deleted:
    - "src/components/resume/ResumeSkills.tsx"
decisions:
  - "Task-1 commit scope grew beyond its <files> list (6 section components + barrel): the task action's checker fixes B-1/B-2/B-3 mandate docx-verbatim labels on ALL six section markers plus featured-only projects/education in the SAME commit the order suite asserts them — the <files> list was under-specified, the action is authoritative."
  - "Featured-filter mechanism unified: one optional featuredOnly prop pattern across ResumeProjects/ResumeEducation (task 1) and ResumeCertifications/ResumeArticles (task 2); unset → legacy slice behaviour; ResumeView always passes it, so /resume AND the modal inherit the docx curation per §7.5."
  - "Modal continuity: the CLI ResumeModal renders the same ResumeView and inherits the featured curation (§7.5 pinned; E-16 uncouples PROJECTS from !showArticles). Its toggle props keep working through the unchanged ResumeViewProps (R-11) — ResumeModal.tsx byte-untouched."
  - "PDF section selection uses the SAME mechanisms as /resume (isTechRelated filter + featured flags), not positional slices — the verify script pins 'isTechRelated' in the template; grep -c returns 2."
  - "PDF contact rows built from about.contact (email mailto/linkedin/github/portfolio) — the hardcoded https://linkedin.com/in/tasostilsi literal is gone from both template (grep 0) and export (forbidden marker, data-driven http://www.linkedin.com/in/tasostilsi form verified)."
  - "verify-resume-content.js normalises entities before marker checks so template escaping is free to evolve; section order pinned by indexOf ascending over '//</span> LABEL' markers."
  - "Template text injected through an esc() helper; the verify script decodes &amp;/&lt;/&gt;/&#39;/&quot; before marker checks, so escaping choices can't break acceptance."
  - "UI-SPEC §7.3.1 docx contact-line: /resume keeps ResumeHeader's stacked contact anatomy (plan file scope excludes ResumeHeader.tsx; the plan action never names it) — the PDF header DOES carry the docx contact line. Recorded as a deliberate narrower-than-UI-SPEC scope, not drift."
metrics:
  duration: "~2h, 2026-09-23"
  completed: 2026-09-23
status: complete
actuals:
  tokens: ~110000
  tasks: 3
  commits: 4
---

# Phase EXPLORE-06 Plan 03: /resume + PDF rebuilt to the docx structure Summary

Rebuilt /resume and the static PDF export to the single-column docx order (SUMMARY → CORE COMPETENCIES → PROFESSIONAL EXPERIENCE → PROJECTS → EDUCATION → CERTIFICATIONS → SELECTED WRITING) from the refreshed data — featured-only curation via one prop mechanism, hardcoded PDF skills/contacts deleted, the stale verify script rewritten to the new contract (RED→GREEN 29✖→0), and the modal contract byte-preserved.

## What was done (per task)

**Task 1 — docx-order single-column ResumeView + core-competencies section (commit 18a5263)**
- RED on record (/tmp/red-resume-order.log, renewed /tmp/red-resume-order2.log immediately before the edits): new suite 7✖/3✔ — two-column ResumeView with sidebar grid, old `.EXE/.SH/.SYS/.BIN/.KEY/.LOG` labels, limit-sliced projects, degree-filtered education; chrome/props/U-4 rows green by construction (plan 01's data already in place).
- GREEN: `ResumeView.tsx` rebuilt — single flow column (`resume-wrapper` block, sidebar div + `md:w-[33%]/[67%]` + `.resume-sidebar/.resume-main` print rules deleted; `@page` A4, 210mm container, print-tight helpers kept); render order Header → Summary → CoreCompetencies → Experience → Projects → Education → Certifications → Articles; E-16 `!showArticles` coupling removed. New `ResumeCoreCompetencies.tsx` (8 clusters, name + proof rows, graceful-hide null, breakInside avoid). `ResumeProjects.tsx` gains featuredOnly (featured-flagged docx two in data order, U-6) + the muted mono link-line atom with the E-11b omission guard; `ResumeEducation.tsx` featured-only (2 degrees, High School stays CLI-reachable). All six section-marker labels made docx-verbatim (B-3): SUMMARY / PROFESSIONAL EXPERIENCE / PROJECTS / EDUCATION / CERTIFICATIONS / SELECTED WRITING. `index.ts` exports CoreCompetencies.
- Verify: typecheck 0; suite 10/10; page.tsx diff 0; `COMPETENCIES.SYS` grep clean repo-wide.

**Task 2 — featured curation + dead skills section removal + print polish (commit a054f0a)**
- RED on record (/tmp/red-task2.log): 3 new rows failed (certs/articles lack featuredOnly; ResumeSkills still on disk), 11 prior rows green.
- GREEN: `featuredOnly` props on ResumeCertifications (5 featured: ISTQB + 4 Anthropic; else legacy top-8 slice) and ResumeArticles (5 featured, ignoring limit; else legacy slice); ResumeView passes featuredOnly to both; `ResumeSkills.tsx` deleted + barrel export removed; print CSS single-column pins asserted in the suite.
- Verify: typecheck 0; suite 14/14; `featuredOnly` ×4 in ResumeView; ResumeModal.tsx diff empty.

**Task 3 — PDF rebuild + verify script rewrite (commit 5d14401)**
- RED on record (/tmp/red-verify.log): rewritten verify script against the stale old-structure export → 29 failures (no competencies markers, SKILLS.SYS + sidebar blocks + hardcoded linkedin present, old section order; data checks 6/6 PASS).
- GREEN: `generate-static-resume.js` rebuilt — single-column 210mm docx layout (sidebar/skill-group CSS deleted), JetBrains Mono + dark/print token swap + URL-print expansion kept, esc() on every injected string; header contact rows data-driven from about.contact; sections in docx order with docx-verbatim labels; roles via `experience.filter(e => e.isTechRelated)` (U-4), projects/education/certs/writing via featured flags in data order. `verify-resume-content.js` = data checks (title/8 competencies/Chubb 6 bullets + '12+ engineering teams'/U-4 3 roles/5 featured certs incl. 4 Anthropic/5 featured articles) + export checks (required markers, ascending section order, forbidden legacy markers, data-driven contacts).
- Verify: `npm run build:resume` 0; `node scripts/verify-resume-content.js` exit 0 (all PASS); SKILLS.SYS grep 0; hardcoded linkedin grep 0; isTechRelated grep 2; clarif-ai.net + npmjs.com/package/deepindex both in the export.

**Deviation commit — explore-shell intro-strip fixture renewal (ef225a5)**
- The first full-gate run surfaced a row plan 01's final gate never saw: `explore-shell.test.mjs:435` pinned the SSR intro h1 with the PRE-refresh title literal. It passed there only because `out/` was a stale pre-refresh build (R-6 trap); my gate's fresh `npm run build` regenerated `out/explore.html` with the refreshed branding and exposed it. Triage: the component is data-driven and unchanged — the fixture literal was the stale side. Renewed to `'Anastasios Tilsizoglou — Test Automation Architect | Principal Test Automation Engineer'` (D-7 intent preserved, verified against the live export h1) and committed as its own `test:` commit.

## Red/Green timeline

| Run | Result | Evidence |
|---|---|---|
| Task 1 RED | 7✖ / 3✔ — order, single-column, E-16, labels, competencies, featured projects/education | /tmp/red-resume-order.log + /tmp/red-resume-order2.log |
| Task 1 GREEN | typecheck 0 + suite 10/10 | /tmp/green-task1.log |
| Task 2 RED | 3✖ / 11✔ — certs/articles curation, skills deletion | /tmp/red-task2.log |
| Task 2 GREEN | typecheck 0 + suite 14/14 | /tmp/green-task2.log |
| Task 3 RED | verify script 29 checks failed vs stale export (data 6/6 PASS) | /tmp/red-verify.log |
| Task 3 GREEN | build:resume 0 + verify exit 0 | /tmp/green-verify.log |
| Fixture renewal | explore-shell 30/30 after renewal | /tmp/shell-renew.log |

## TDD Gate Compliance

Plan type is `execute` (not `tdd`) — no test:-commit-before-feat: gate applies. Red-first discipline honoured in all three tasks: each contract change ran RED on record before its GREEN edits; RED and GREEN land in the same atomic per-task commit. The one standalone `test:` commit (ef225a5) is a stale-fixture renewal, not a missing gate.

## Known Stubs

None. `grep TODO|FIXME|placeholder|skipped` over all touched files: zero hits.

## Threat Flags

None. No auth, secrets, input handling, or network surface introduced; the PDF template's only external references are the pre-existing FontAwesome/Google-Fonts CDN links, and injected data strings are HTML-escaped via esc().

## Self-Check: PASSED

- Files: ResumeCoreCompetencies.tsx (46 lines) ✓; tests/resume-docx-order.test.mjs (14 tests) ✓; ResumeView single-column docx order ✓; index.ts exports CoreCompetencies, not ResumeSkills ✓; ResumeSkills.tsx absent ✓; generate-static-resume.js single-column docx template ✓; verify-resume-content.js exit 0 ✓; public/resume-export.html regenerated (docx labels + projects + data-driven contacts) ✓.
- Commits: 18a5263 (task 1), a054f0a (task 2), 5d14401 (task 3), ef225a5 (fixture renewal) — all on `phase-6`, scope EXPLORE-06-explore-revision-03 ✓.
- must_haves truths: all 6 verified (docx order single-column ✓ / chrome preserved + page.tsx diff 0 ✓ / featured 5+5 curation with modal contract intact ✓ / exactly 3 isTechRelated roles through the untouched filter ✓ / build:resume renders the docx structure with zero hardcoded skills+contacts ✓ / verify script standalone exit 0 ✓).
- key_links: JSON → ResumeView/PDF via core_competencies + featured ✓; ResumeViewProps contract unchanged, ResumeModal.tsx untouched ✓; PDF reads about.contact (hardcoded literals grep 0) ✓.

## Deviations (documented, minimal)

1. **Task-1 commit includes 6 files beyond its `<files>` list** (ResumeSummary/ResumeExperience/ResumeProjects/ResumeEducation/ResumeCertifications/ResumeArticles): the task action's B-1/B-2/B-3 checker fixes mandate docx-verbatim labels on ALL six section markers and featured-only projects/education; the order suite asserts those labels, so the GREEN commit must carry them for atomicity. The `<files>` list was under-specified; the action text is authoritative.
2. **Task-2 commit includes ResumeView.tsx** beyond its `<files>` list: the action explicitly requires "ResumeView's CERTIFICATIONS call passes featuredOnly" — same under-listing.
3. **UI-SPEC §7.3.1 contact-line divergence on /resume (deliberate, narrower):** the plan's file scope and action never name ResumeHeader.tsx, so /resume keeps the existing stacked contact anatomy inside the header; the PDF header carries the docx contact line. Recorded so the verify step can confirm the intent.
4. **tests/explore-shell.test.mjs edited (1 row, ef225a5):** beyond plan scope, the same stale-test-discipline exception class as plan 01's 23b07f8 — the row's fixture pinned the pre-refresh branding and only surfaced once a fresh build regenerated `out/`; the renewal keeps the full gate meaningful.

## Full-gate state (pre-SUMMARY measurement)

`npm run typecheck` 0; `npm run build` 0; `npm run build:resume` 0 + verify script exit 0; full `node --test tests/*.test.mjs` → **199 tests, 197 pass, 2 fail** — both pre-triaged plan-04-owned rows in tests/explore-visuals.test.mjs (`techMentions` corpus rewrite, `buildCareerSpan` Smartup `isTechRelated:true`→`false` fixture), explicitly routed by plan 01's triage and outside plan 03's file scope. The third full-gate failure seen on the first run (intro-strip stale fixture) was triaged and fixed here as ef225a5; the treemap aria row that plan 01 reported failing PASSES against the fresh build. The chronologically-final gate run over the post-SUMMARY tree is recorded in the completion note below.

## Completion note (final gate on record)

Ran the full gate twice over the post-SUMMARY tree by design: once to measure, once (after the SUMMARY numbers were written from those measurements) as the chronologically last action anchoring this completion claim. Both runs identical: `npm run typecheck` exit 0; `npm run build:resume` exit 0 + `node scripts/verify-resume-content.js` exit 0; `node --test tests/*.test.mjs` → **199 tests, 197 pass, 2 fail** — the 2 pre-triaged plan-04 rows above. /tmp/final-gate-tc.log + /tmp/final-gate-suite.log hold the runs.