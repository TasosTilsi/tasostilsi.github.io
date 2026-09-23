---
phase: EXPLORE-06-explore-revision
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - ".planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md"
  - "src/data/portfolio-main-data.json"
  - "src/data/portfolio-main-data.d.ts"
  - "src/components/cli/outputs/WelcomeMessage.tsx"
  - "src/components/cli/outputs/AboutOutput.tsx"
  - "src/components/cli/outputs/SkillsOutput.tsx"
  - "tests/portfolio-data-integrity.test.mjs"
autonomous: false
requirements: ["REV-01"]
user_setup: []
must_haves:
  truths:
    - "about.title renders as 'Test Automation Architect | Principal Test Automation Engineer' from data on the CLI welcome banner (desktop + mobile), the CLI About box, the explore header/intro, root layout metadata and JSON-LD — zero hardcoded old title literals remain in src/ components"
    - "The CLI About ASCII box derives its width from the rendered strings, so the 62-char title displays fully with no padEnd(57) overflow"
    - "CLI `skills` output shows the 8 core-competency clusters (name + one-line proof) as data-driven text, with soft/hard/languages lists byte-unchanged below"
    - "Nothing deleted: interests, favorite_games, presentations, skills, education, the 4 non-docx experience roles, all 41 original certifications and all 12 original articles remain in portfolio-main-data.json"
    - "U-4 (UI-SPEC §7.3.4 line 246 / UAT table line 396): the data write flips Smartup PCC's isTechRelated from true to false — exactly 3 isTechRelated:true entries remain (Chubb, Upstream Systems, Netcompany-Intrasoft), so /resume and the PDF render exactly the docx's 3 roles via the untouched isTechRelated filter, while the Smartup PCC entry itself stays fully CLI-reachable (the flip is a flag change, not a row removal)"
    - "The npm '400+ weekly downloads' wording (or its user-approved replacement) was explicitly approved by the user before the data write"
  artifacts:
    - path: ".planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md"
      provides: "The complete verbatim data diff transcribed from the docx extraction, presented for and approved by the user (D-01)"
      min_lines: 60
    - path: "src/data/portfolio-main-data.json"
      provides: "Refreshed single store: new branding, docx summary, 8 core-competency clusters with proofs, quantified bullets, enriched flagship projects, featured certs + articles, and the U-4 flip (Smartup PCC isTechRelated → false; exactly 3 true entries remain)"
      min_lines: 300
    - path: "src/data/portfolio-main-data.d.ts"
      provides: "Types for the new fields: core_competencies: { name: string; proof: string }[] and featured?: boolean on Certification + Article"
      min_lines: 100
    - path: "tests/portfolio-data-integrity.test.mjs"
      provides: "Zero-dep node --test suite pinning the docx contract and the nothing-deleted ledger"
      min_lines: 60
  key_links:
    - from: "src/data/portfolio-main-data.json"
      to: "src/data/portfolio-main-data.d.ts"
      via: "every new JSON field is typed in the .d.ts in the same commit (R-7: types first or together)"
      pattern: "core_competencies"
    - from: "src/data/portfolio-main-data.json"
      to: "src/components/cli/outputs/WelcomeMessage.tsx"
      via: "banner + mobile title lines interpolate portfolioData.about.title instead of the hardcoded literal"
      pattern: "portfolioData.about.title"
    - from: "src/data/portfolio-main-data.json"
      to: "src/components/cli/outputs/SkillsOutput.tsx"
      via: "competencies block maps data.core_competencies to the existing list-chip pattern"
      pattern: "core_competencies"
    - from: "src/data/portfolio-main-data.json"
      to: "src/components/resume/ResumeExperience.tsx"
      via: "the untouched .filter((job) => job.isTechRelated) render (U-4) reads exactly 3 true entries after the Smartup PCC flip — the docx's 3 roles on /resume and the PDF (plan 03 consumes this wiring)"
      pattern: "isTechRelated"
---

<objective>
Refresh portfolio-main-data.json to the user's current resume docx as source of truth (REV-01) through the locked draft → approve → write process, propagate the new branding to every CLI/SEO surface that does NOT auto-derive it, and pin the refreshed contract with a data-integrity suite. Nothing is deleted; everything flows to CLI, /explore, /resume and the PDF through the existing data-driven reads.
</objective>

<assumption_delta_decision>
- noun: the portfolio content source-of-truth (previously the old inline resume story baked into the JSON; now the docx) — and, downstream, the Projects panel's rendering (one representation → cards + calendar).
- decision: promote for the data model — the docx structure becomes the primary content model (core competencies, quantified bullets, featured flags) and the old specific representations are demoted to complementary detail that stays CLI-reachable; add-alongside for the Projects panel visual (locked by D-07 / SPEC REV-06 "alongside the existing cards", implemented in plan 04).
- rationale: promotion matches REV-01's "source of truth" acceptance; add-alongside is the user's explicit choice, not planner preference.
- accepted debt: cards and calendar both render the same 14 projects — drift risk mitigated by keeping ALL derivation in viz-data.ts (plan 04); the debt is two parallel renderings to keep visually consistent.
- invariant companion: every competency/proof/bullet string in the JSON must be traceable to resume-docx-extraction.md or the user-approved draft — pinned by tests/portfolio-data-integrity.test.mjs.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-06-explore-revision/resume-docx-extraction.md
@.planning/phases/EXPLORE-06-explore-revision/EXPLORE-06-explore-revision-SPEC.md
@.planning/phases/EXPLORE-06-explore-revision/EXPLORE-06-explore-revision-RESEARCH.md
@src/data/portfolio-main-data.json
@src/data/portfolio-main-data.d.ts
@src/components/cli/outputs/WelcomeMessage.tsx
@src/components/cli/outputs/AboutOutput.tsx
@src/components/cli/outputs/SkillsOutput.tsx
@src/components/cli/outputs/TaasOutput.tsx
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — complete draft-approve data diff artifact (D-01/D-02/D-03)</name>
    <files>.planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md</files>
    <read_first>.planning/phases/EXPLORE-06-explore-revision/resume-docx-extraction.md, .planning/phases/EXPLORE-06-explore-revision/EXPLORE-06-explore-revision-RESEARCH.md (§1.4, §1.4.1), src/data/portfolio-main-data.json</read_first>
    <action>Produce data-refresh-draft.md transcribing the COMPLETE data-file diff verbatim from the docx extraction, section by section, per D-02 mapping: (1) Branding — about.title ← docx line 2 exactly; meta.description/keywords refresh proposals per RESEARCH OQ-4. (2) Summary — about.description ← docx line 5 verbatim. (3) core_competencies — docx line 7 carries NINE '•'-separated segments; D-02 pins EIGHT clusters {name, proof}: propose the 9→8 decomposition (name which two segments merge and under what name) and compose each one-line quantified proof ONLY from refreshed data values (12+ teams / 20+ projects / 5 immediate adoptions / 30+ engineers / primary reviewer / real-time dashboards / 100% requirement coverage / npm package) — no invented numbers. (4) Experience bullets — Chubb: replace 7 responsibilities with the docx's 6 (extraction lines 10-15); Upstream: 3 (17-19); Netcompany: 4 (21-24); titles/companies/durations and the 4 non-docx roles' prose stay untouched — EXCEPT the U-4 named data-write obligation (UI-SPEC §7.3.4 line 246 / UAT line 396, not executor improvisation): the draft proposes flipping experience[3] Smartup PCC ('Android Developer') isTechRelated from true to false, so the untouched ResumeExperience .filter((job) => job.isTechRelated) renders exactly the docx's 3 roles on /resume and the PDF; the Smartup PCC entry itself stays fully CLI-reachable via 'experience --all' (nothing deleted — flag change only). (5) Projects — Clarif-AI + DeepIndex enriched with the docx value lines (red-flags framing, under-two-minutes, hybrid semantic and entity-graph search); include the downloads-claim DECISION BOX with RESEARCH-verified registry numbers (18 downloads current week; 646 spike week Sep 9-14 2026; docx claims 400+) and 2-3 wording options for the user to pick; note the flagship ordering question (docx lists deepindex first, JSON has Clarif-AI at projects[0], SPEC reads 'deepindex, Clarif-AI first') with a keep-or-reorder recommendation. (6) Certifications — ISTQB entry (existing, line 196) gains featured: true; FOUR NEW Anthropic Academy entries from docx line 33 (Claude 101, Claude Code in Action, Introduction to Claude Cowork, Introduction to Agent Skills) with featured: true, link: null, dates in a CertsOutput-parseable format ('MMMM yyyy' | 'MMM yyyy' | 'yyyy'); mark links/dates as user-supplied-or-null. (7) Selected writing — featured: true on the 3 existing JSON matches; 2 NEW entries with the real Medium titles/dates from RESEARCH §1.4.1 (per-article links to be fetched at write time); geo-entry reconciliation proposal (docx selects Part 1, Dec 23 2025; JSON entry currently corresponds to Part 2, Jan 2026) for user approval. (8) Education — record 'verified already-matching, no change' (JSON's own degree/specialization fields stand per D-02). (9) Nothing-deleted ledger — enumerate every untouched collection. (10) Rendering notes — TaasOutput will read 'as a Test Automation Architect | Principal Test Automation Engineer and…' (data-driven, flagged for user awareness); CLI About box needs width derivation (plan task 4 handles it). (11) Consumer propagation table (D-03, map-content-surfaces) — a dedicated section enumerating EVERY rendering surface the data feeds, each row marked auto-derived / handled-in-task-4 / needs-nothing: CLI outputs ×6, resume modal, /resume components, PDF template, wizard intro, root layout metadata + JSON-LD, explore header/intro — so Task 4's edit list and its verify-only list are derived from this table, not from memory.</action>
    <verify>test -f .planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md && grep -c 'core_competencies' .planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md && grep -c 'handled-in-task-4' .planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md</verify>
    <acceptance_criteria>
      - data-refresh-draft.md exists and contains section markers for: title, summary, core_competencies, experience, projects, certifications, articles, education, nothing-deleted ledger
      - grep '18 downloads\|646' data-refresh-draft.md → the registry-verified numbers appear next to the docx '400+' claim (D-03 external verification on record)
      - grep 'featured' data-refresh-draft.md → ≥ 6 hits (1 ISTQB + 4 Anthropic certs + ≥ 2 article flags)
      - every docx bullet (extraction lines 10-24) appears verbatim in the draft's experience section
      - grep 'isTechRelated' data-refresh-draft.md → the Smartup PCC flip appears in section (4) with its CLI-reachability note (U-4 — the user approves the flag flip as part of the diff, D-01)
      - data-refresh-draft.md contains a per-consumer propagation table (D-03 consumer enumeration): CLI outputs ×6, resume modal, /resume components, PDF template, wizard intro, root layout metadata + JSON-LD, explore header/intro — each row marked auto-derived / handled-in-task-4 / needs-nothing
    </acceptance_criteria>
    <done>The draft artifact holds the complete proposed diff with every D-02 mapping item and every open wording decision boxed for the user — nothing written to the JSON yet (D-01).</done>
  </task>

  <task type="checkpoint:human-verify">
    <name>Task 2: Checkpoint — user approves the complete data diff (D-01)</name>
    <files>.planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md</files>
    <read_first>.planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md</read_first>
    <action>Present the complete draft diff to the user and block for approval per D-01 — personal resume copy never enters the data file unseen. Ask the user to resolve the boxed decisions: (a) downloads wording (keep docx claim / soften / spike-scoped), (b) flagship project order (keep JSON Clarif-AI-first vs docx deepindex-first), (c) Anthropic cert dates and any links, (d) geo-article reconciliation, (e) meta.keywords refresh yes/no. Record the approval verbatim at the top of data-refresh-draft.md as an 'Approved:' header including the date and the chosen options. Do NOT proceed to Task 3 without explicit user approval recorded in the file.</action>
    <verify>grep -c 'Approved' .planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md</verify>
    <acceptance_criteria>
      - data-refresh-draft.md contains an 'Approved' header with a date and the resolved wording for the downloads claim
      - no write to src/data/portfolio-main-data.json occurred before this approval (git log shows the JSON commit after the draft commit)
    </acceptance_criteria>
    <done>The user has seen the complete diff and approved it with all boxed decisions resolved.</done>
  </task>

  <task type="auto">
    <name>Task 3: Write the approved diff — JSON + types-first .d.ts + integrity suite</name>
    <files>src/data/portfolio-main-data.d.ts, src/data/portfolio-main-data.json, tests/portfolio-data-integrity.test.mjs</files>
    <read_first>.planning/phases/EXPLORE-06-explore-revision/data-refresh-draft.md, src/data/portfolio-main-data.d.ts, src/data/portfolio-main-data.json, tests/explore-visuals.test.mjs (lines 1-60 for suite conventions)</read_first>
    <action>RED first (red/green discipline): write the .d.ts types and the integrity test BEFORE touching the JSON. Types first (R-7): in portfolio-main-data.d.ts add to PortfolioData a required field core_competencies: { name: string; proof: string }[] and add optional featured?: boolean to Certification and Article (OQ-8 — zero current 'featured' usages, grep-verified in RESEARCH §OQ-8). Then write tests/portfolio-data-integrity.test.mjs (zero-dep node --test, reads the JSON directly, follows the read-source convention of tests/explore-sweep.test.mjs): pin title === docx line 2 string, description === docx line 5, core_competencies.length === 8 with every name+proof non-empty, Chubb responsibilities length 6 with first bullet containing '12+ engineering teams', Upstream 3, Netcompany 4, experience entries with isTechRelated === true numbering exactly 3 (U-4: Chubb, Upstream, Netcompany-Intrasoft — Smartup PCC false), certifications.length >= 41 with exactly 5 featured and the 4 Anthropic names present, articles.length >= 12 with exactly 5 featured and the 2 new titles present, deepindex description containing the approved downloads string, and the nothing-deleted ledger as literal fixtures copied from the PRE-refresh JSON (interests, favorite_games, presentations, skills, education degrees, the 4 non-docx roles' company+title+duration, the 41 original cert names, the 12 original article names). Run node --test tests/portfolio-data-integrity.test.mjs and capture the failure output on record (title mismatch, no core_competencies, no featured flags, 4 isTechRelated:true where 3 are expected — the missing behaviour). GREEN: then write the approved diff into portfolio-main-data.json exactly as recorded in data-refresh-draft.md: about.title, about.description, meta.description (+ keywords if approved), new top-level core_competencies array of 8 clusters, Chubb/Upstream/Netcompany responsibilities replaced by the docx bullets (everything else in those entries untouched), experience[3] (Smartup PCC, 'Android Developer') isTechRelated flipped true→false per U-4 — the entry's other fields untouched (CLI-reachable via 'experience --all'), Clarif-AI/DeepIndex descriptions enriched with the approved value lines and downloads wording, certifications: ISTQB featured:true + 4 new Anthropic entries (featured:true, link null unless user supplied), articles: 3 featured flags + 2 new entries with per-article links + geo reconciliation as approved. JSON array order stays render order — insert new certs/articles at sensible collection positions per the approved draft, never re-sort existing entries. Re-run the suite to green. Commit .d.ts + test + JSON as one atomic commit. Wave-1 coupling note: the cross-suite check runs only tests/explore-visuals-server.test.mjs (no section-count pins — immune to plan 02's in-flight RED window) plus the new integrity suite; tests/explore-visuals.test.mjs is plan 02's file (its task 1 flips the spine to the 4-closure contract) AND its techMentions real-corpus rows (every test whose name contains 'techMentions' — the exact-cells pins at ~232-360 asserting Java:1/CI-CD:2/MCP:1/RAG:1 against the LIVE JSON corpus, plus the export treemap-aria row at ~691-704) are turned red by plan 01's OWN data write too: the docx bullets drop 'Built RAG pipelines…' and shift the mention counts, so those rows go red from wave 1 until plan 04 task 2 rewrites the whole techMentions surface. Both causes are plan-02/plan-04-owned: failures plan 01 sees there during wave 1 are REPORT-ONLY — record the triage note (naming which cause each failure stems from), never rewrite that file from plan 01.</action>
    <verify>npm run typecheck && node --test tests/portfolio-data-integrity.test.mjs && node --test tests/explore-visuals-server.test.mjs</verify>
    <acceptance_criteria>
      - RED on record: the integrity suite failed against the pre-refresh JSON (captured output showing title/core_competencies/featured failures) before the JSON was written
      - GREEN after: node --test tests/portfolio-data-integrity.test.mjs exits 0 with all assertions green
      - tests/explore-visuals-server.test.mjs still passes (experience titles/durations/companies unchanged — it has no section-count pins, so it is immune to plan 02's in-flight RED window)
      - grep -c '"isTechRelated": true' src/data/portfolio-main-data.json → exactly 3 (U-4 — Chubb/Upstream/Netcompany; Smartup PCC flipped false and still present in the array)
      - tests/explore-visuals.test.mjs is OWNED by wave-1 plan 02 + wave-3 plan 04: failures plan 01 observes there during wave 1 are REPORT-ONLY (triage note recorded, file never rewritten by plan 01 — its RED-first contract update is plan 02 task 1's, and the techMentions real-corpus rows that plan 01's own data write breaks are plan 04 task 2's surface); its green state is asserted by plan 02 task 1's acceptance criteria (techMentions carve-out), not here
      - grep -c 'featured' src/data/portfolio-main-data.json → ≥ 10 (5 certs + 5 articles)
      - grep -c 'core_competencies' src/data/portfolio-main-data.json → ≥ 1
    </acceptance_criteria>
    <done>The refreshed data file matches the approved draft exactly; types compile; the integrity suite proves the docx contract and the nothing-deleted ledger.</done>
  </task>

  <task type="auto">
    <name>Task 4: CLI + SEO branding propagation (D-03 checklist — the sites that do NOT auto-derive)</name>
    <files>src/components/cli/outputs/WelcomeMessage.tsx, src/components/cli/outputs/AboutOutput.tsx, src/components/cli/outputs/SkillsOutput.tsx</files>
    <read_first>src/components/cli/outputs/WelcomeMessage.tsx, src/components/cli/outputs/AboutOutput.tsx, src/components/cli/outputs/SkillsOutput.tsx, .planning/phases/EXPLORE-06-explore-revision/EXPLORE-06-explore-revision-RESEARCH.md (§1.3 pitfalls 1-2, OQ-3)</read_first>
    <action>RED first: run the acceptance greps below against the untouched files and capture the failures (the hardcoded literal is present, padEnd(57) is present, SkillsOutput has no core_competencies — the missing behaviour). GREEN: WelcomeMessage.tsx: replace the hardcoded 'Senior Software Engineer in Test' on the desktop banner (line 32) and the mobile block (line 41) with portfolioData.about.title — the import already exists (line 7); keep both lines' surrounding chrome byte-identical. AboutOutput.tsx: the ASCII box (lines 24-27) hardcodes a 59-char rule and padEnd(57) — derive the inner width from Math.max(about.name.length, about.title.length) so the 62-char title fits; build the ╔═╗/║║/╚═╝ lines from the computed width with '═'.repeat(width); keep the mobile header (already data-driven) untouched. SkillsOutput.tsx: prepend a competencies block BEFORE the soft-skills block — map data.core_competencies to rows of an accent chip (existing bg-primary/10 text-primary pattern) with the cluster name plus a one-line proof beneath in text-muted-foreground text-xs, guarded by a length check so an empty array renders nothing (graceful-hide); leave the soft/hard/languages blocks below byte-unchanged (OQ-3: data-driven text only, existing chip pattern). TaasOutput.tsx: NO code change — it renders about.title data-driven; the pipe-bearing title was flagged in the draft. Root layout, explore header/intro and wizard intro auto-derive from the data — verify, do not edit (D-03). Re-run the greps to green.</action>
    <verify>npm run typecheck && ! grep -rn "Senior Software Engineer in Test" src/components/ src/app/ && ! grep -n "padEnd(57)" src/components/cli/outputs/AboutOutput.tsx && grep -c "core_competencies" src/components/cli/outputs/SkillsOutput.tsx</verify>
    <acceptance_criteria>
      - RED on record: the greps below failed against the untouched files before the edits
      - repo-wide absence grep: grep -rn 'Senior Software Engineer in Test' over src/components/ and src/app/ returns nothing (zero hardcoded old-title literals in ANY component or page — WelcomeMessage.tsx and AboutOutput.tsx are the two known sites per RESEARCH pitfall 1, and the broad grep proves there is no third; src/data is data and excluded by design)
      - grep 'padEnd(57)' over AboutOutput.tsx returns nothing (width derived)
      - SkillsOutput.tsx references core_competencies and keeps its existing soft/hard/languages JSX unchanged
      - npm run typecheck exits 0
      - git diff shows only these three CLI files changed in this task's commit (atomic, one commit)
    </acceptance_criteria>
    <done>Every CLI/SEO surface that does not auto-derive the branding now renders the new title from data; the 62-char title fits its box; competencies are CLI-reachable; nothing else in the CLI changed.</done>
  </task>
</tasks>