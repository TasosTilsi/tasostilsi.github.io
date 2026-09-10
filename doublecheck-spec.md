# Doublecheck spec

## Goal
Foreground the user's AI engineering work across every CV surface — four AI focus areas in the Chubb role plus the personal AI products Clarif-AI (clarif-ai.net) and DeepIndex (npm) — by updating portfolio-main-data.json and extending every generated output it feeds, with a green suite run and one commit on record.

## Scope
In: src/data/portfolio-main-data.json (Chubb responsibilities rewritten to 7 AI-forward bullets, two new project entries at the top of the projects array, Innovation skill group expanded to 7 tags, about.description swapped to approved V1, meta keywords extended with AI terms); scripts/generate-static-resume.js (sidebar renders the Innovation skills group; new PROJECTS.BIN section in the main column rendering the top 4 projects); public/resume-export.html regenerated via npm run build:resume; repo verification suite (npm run build per CI, plus lint and typecheck as hygiene); fixing any reds those surface including pre-existing ones; one git commit of the whole batch. Out: everything else — see non-goals.

## Acceptance criteria
1) portfolio-main-data.json is valid JSON and `tsc --noEmit` passes against portfolio-main-data.d.ts. 2) All three data-fed surfaces carry the change: site components (CLI outputs + in-app resume modal read the JSON directly); regenerated public/resume-export.html contains "Clarif-AI", "DeepIndex", "PROJECTS.BIN", the Innovation skill tags, and the new Chubb bullets (verified by grep in the built artifact). 3) `npm run build:resume` regenerates the export; `npm run build` (the CI suite) exits 0; lint + typecheck exit 0 — any red including pre-existing gets fixed. 4) One git commit lands data + template + regenerated export after the green run.

## Failure modes
Invalid JSON or schema mismatch → typecheck/build red → fix before anything ships. Template edit breaks build:resume → non-zero exit → fix template, regenerate. Silent propagation gap (static export missing new content) → verify by grepping the built HTML, not by eyeballing the site. Entity confusion (clarif-ai.app lookalike vs user's clarif-ai.net) → links were verified against the live domain and npm registry; keep the .net link and npm/deepindex + github.com/TasosTilsi/deepindex only. Unapproved personal copy → all copy was draft-approved verbatim; summary V1 confirmed. Pre-existing lint/typecheck reds → fix everything per user decision. Rollback: single commit → git revert restores prior state.

## Priorities
Approved copy verbatim over template elegance; correctness (valid JSON, green suite) over speed; cross-surface consistency over per-surface polish; minimal diff (reuse existing template classes). If the A4 PDF overflows, the top-4 project slice and dropped Jira bullet are the pressure valves — trim rendered count before trimming copy.

## Non-goals
No AI-first V2 rewrite of the about summary (V1 chosen). No edits to non-AI CV entries (older roles, legacy projects, certs, articles). No component/TSX code changes — data drives them. No Clarif-AI sourceUrl (no public repo named). No push/deploy to master (CI deploys on push — separate explicit action). No GSD Explore-Visual-Landing milestone work. No new ~/.dsh skill files.
