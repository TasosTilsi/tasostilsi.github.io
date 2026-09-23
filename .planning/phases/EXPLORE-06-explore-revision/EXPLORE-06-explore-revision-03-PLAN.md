---
phase: EXPLORE-06-explore-revision
plan: 03
type: execute
wave: 2
depends_on: ["EXPLORE-06-explore-revision-01"]
files_modified:
  - "src/components/resume/ResumeView.tsx"
  - "src/components/resume/ResumeCoreCompetencies.tsx"
  - "src/components/resume/ResumeCertifications.tsx"
  - "src/components/resume/ResumeArticles.tsx"
  - "src/components/resume/ResumeSkills.tsx"
  - "src/components/resume/index.ts"
  - "tests/resume-docx-order.test.mjs"
  - "scripts/generate-static-resume.js"
  - "scripts/verify-resume-content.js"
  - "public/resume-export.html"
autonomous: true
requirements: ["REV-02", "REV-03"]
user_setup: []
must_haves:
  truths:
    - "/resume renders the docx section order in a single-column linear flow: SUMMARY → CORE COMPETENCIES → PROFESSIONAL EXPERIENCE → PROJECTS → EDUCATION → CERTIFICATIONS → SELECTED WRITING"
    - "The page chrome is preserved: dark/printer toggle button, Print/Save button, and ?print=true auto-print timer in resume/page.tsx"
    - "CERTIFICATIONS on /resume shows exactly the featured entries (ISTQB + 4 Anthropic Academy) and SELECTED WRITING shows exactly the 5 featured articles; the CLI resume modal keeps its full-list toggles working (R-11 — ResumeViewProps contract unchanged)"
    - "/resume PROFESSIONAL EXPERIENCE renders exactly 3 roles — the untouched .filter((job) => job.isTechRelated) over plan 01's U-4-flipped data (UI-SPEC §7.3) — with Smartup PCC staying CLI-reachable"
    - "npm run build:resume produces public/resume-export.html rendering the same docx structure from the refreshed data, with the hardcoded Languages/Testing/Infrastructure/Innovation skill block and the hardcoded LinkedIn/GitHub/Website contact literals gone, and projects present"
    - "node scripts/verify-resume-content.js passes on the new contract (standalone, exit 0)"
  artifacts:
    - path: "src/components/resume/ResumeView.tsx"
      provides: "Single-column docx-order rebuild keeping the ResumeViewProps contract and print CSS"
      min_lines: 100
    - path: "src/components/resume/ResumeCoreCompetencies.tsx"
      provides: "New CORE COMPETENCIES section rendering data.core_competencies (name + proof rows)"
      min_lines: 30
    - path: "tests/resume-docx-order.test.mjs"
      provides: "Zero-dep suite pinning section order, chrome preservation, featured curation, the U-4 3-role experience count and print CSS"
      min_lines: 60
    - path: "scripts/generate-static-resume.js"
      provides: "PDF template rebuilt to the docx structure, fully data-driven contacts"
      min_lines: 300
    - path: "scripts/verify-resume-content.js"
      provides: "Standalone acceptance script rewritten to the docx-structure contract (R-4)"
      min_lines: 60
  key_links:
    - from: "src/data/portfolio-main-data.json"
      to: "src/components/resume/ResumeView.tsx"
      via: "sections render core_competencies and featured-filtered certs/articles from the refreshed data"
      pattern: "core_competencies"
    - from: "src/components/resume/ResumeView.tsx"
      to: "src/components/cli/ResumeModal.tsx"
      via: "ResumeViewProps (data, isDarkMode, showCertifications, showProjects, showArticles) unchanged — modal untouched"
      pattern: "showCertifications"
    - from: "src/data/portfolio-main-data.json"
      to: "scripts/generate-static-resume.js"
      via: "PDF template reads about.contact and the new fields instead of hardcoded literals"
      pattern: "about.contact"
---

<objective>
Rebuild /resume and the static PDF export to the docx structure (REV-02/REV-03, D-08): single-column linear SUMMARY → CORE COMPETENCIES → PROFESSIONAL EXPERIENCE → PROJECTS → EDUCATION → CERTIFICATIONS → SELECTED WRITING from the refreshed data, page chrome and modal contract preserved, PDF hardcoded sections replaced by data-driven ones, and the stale verify-resume-content.js rewritten to the new contract.
</objective>

<assumption_delta_decision>
- noun: the resume document model (previously the two-column sidebar layout with its own section set; now the docx's linear section structure).
- decision: promote — the docx structure becomes the primary resume rendering on BOTH /resume and the PDF; the old two-column sidebar layout is demoted/removed rather than kept alongside a second layout.
- rationale: D-08 locks "rebuilds the content sections to the docx order" and REV-02's acceptance is order fidelity; keeping two layouts alongside would double the print surface and contradict the acceptance.
- accepted debt: the CLI in-app resume modal inherits the same docx-order layout (it renders ResumeView) — accepted and intended ("flowing consistently to ALL surfaces"); its toggle props keep per-section control. PROJECTS count divergence is deliberate, not drift: /resume renders limit 6 (top-6, continuity with the CLI resume modal's top-6 projects display) while the PDF PROJECTS section renders 2 flagships (projects.slice(0, 2), matching the docx's two-project section) — REV-02 pins section ORDER, not count; 6 on the web surface for modal continuity, 2 on the paper surface for docx fidelity.
- invariant companion: tests/resume-docx-order.test.mjs pins the heading order for the page and the section-marker order in the PDF export — one contract, two renderers.
</assumption_delta_decision>

<context>
@.planning/phases/EXPLORE-06-explore-revision/resume-docx-extraction.md
@.planning/phases/EXPLORE-06-explore-revision/EXPLORE-06-explore-revision-SPEC.md (Req REV-02/REV-03)
@.planning/phases/EXPLORE-06-explore-revision/EXPLORE-06-explore-revision-RESEARCH.md (R-9, R-11, OQ-5, §1.3 pitfall 9)
@src/components/resume/ResumeView.tsx
@src/app/resume/page.tsx
@src/components/resume/ResumeCertifications.tsx
@src/components/resume/ResumeArticles.tsx
@src/components/resume/ResumeSkills.tsx
@scripts/generate-static-resume.js
@scripts/verify-resume-content.js
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — docx-order single-column ResumeView + core-competencies section</name>
    <files>tests/resume-docx-order.test.mjs, src/components/resume/ResumeCoreCompetencies.tsx, src/components/resume/ResumeView.tsx, src/components/resume/index.ts</files>
    <read_first>src/components/resume/ResumeView.tsx, src/app/resume/page.tsx, src/components/resume/ResumeSummary.tsx, src/data/portfolio-main-data.d.ts, tests/explore-sweep.test.mjs (suite conventions)</read_first>
    <action>RED first: write tests/resume-docx-order.test.mjs (zero-dep node --test, read-source convention) pinning the NEW order — in ResumeView.tsx source, the render-order indices must ascend: Summary < CoreCompetencies < Experience < Projects < Education < Certifications < Articles — plus chrome assertions on resume/page.tsx ('?print' timer, two toggle/print buttons, print:hidden), a props-contract assertion (showCertifications/showProjects/showArticles present in ResumeViewProps), and the U-4 role-count assertion: portfolio-main-data.json parsed yields exactly 3 experience entries with isTechRelated === true (Chubb, Upstream Systems, Netcompany-Intrasoft — plan 01's U-4 write flipped Smartup PCC to false) while ResumeExperience.tsx source keeps the .filter((job) => job.isTechRelated) read, so the rendered PROFESSIONAL EXPERIENCE role count is exactly 3 (UI-SPEC §7.3); run it and capture the failure on record (current ResumeView is two-column with Skills in the sidebar and no competencies section). GREEN: create src/components/resume/ResumeCoreCompetencies.tsx ('use client' matching siblings; props { data: PortfolioData; isDarkMode?: boolean }; renders data.core_competencies as rows — cluster name in the bold text color plus its one-line proof beneath in the muted color; section heading in the sibling style 'text-[10px] font-black uppercase tracking-[0.4em]' labelled // CORE COMPETENCIES (U-5, UI-SPEC §7.4: docx-verbatim labels — .EXE/.SH/.SYS suffixes dropped, // prefix chrome retained); graceful-hide — empty array renders null; breakInside avoid). Rebuild ResumeView.tsx to a single-column linear flow: keep the outer .resume-container + print style block, replace the two-column .resume-wrapper flex row with a single flow column (drop the sidebar div and the md:w-[33%]/md:w-[67%] print rules; keep @page A4, .resume-container width, print-tight helpers), render in order: ResumeHeader → ResumeSummary → ResumeCoreCompetencies → ResumeExperience → (showProjects && **ResumeProjects FEATURED-ONLY per UI-SPEC §7.3.5/U-6 — checker B-1 fix: render the featured-flagged projects (the docx's two, deepindex → Clarif-AI in data order), NOT a limit-6 slice; each carries the muted mono link-line atom (§7.3.5, E-11b omission rule); the modal inherits the same featured set per §7.5**) → ResumeEducation **featured-only (the 2 docx degrees — checker B-2 fix; the High School row stays CLI-reachable)** → (showCertifications && ResumeCertifications) → (showArticles && ResumeArticles); keep the ResumeViewProps interface EXACTLY as-is (data, isDarkMode, showCertifications?, showProjects?, showArticles? — R-11 modal contract). **Heading labels to docx-verbatim (checker B-3 fix, §7.4/U-5): the six section-marker literals drop their extension suffixes — SUMMARY.EXE→SUMMARY (ResumeSummary.tsx:15), EXPERIENCE.SH→PROFESSIONAL EXPERIENCE (ResumeExperience.tsx:18), PROJECTS.BIN→PROJECTS (ResumeProjects.tsx:25), EDUCATION.SYS→EDUCATION (ResumeEducation.tsx:22), CERTS.KEY→CERTIFICATIONS (ResumeCertifications.tsx:22), PUBS.LOG→SELECTED WRITING (ResumeArticles.tsx:26); resume-docx-order.test.mjs asserts the docx-verbatim labels.** Export ResumeCoreCompetencies from src/components/resume/index.ts. Re-run the suite to green; npm run typecheck.</action>
    <verify>npm run typecheck && node --test tests/resume-docx-order.test.mjs</verify>
    <acceptance_criteria>
      - RED on record: the new order suite failed against the current two-column ResumeView before the rebuild
      - node --test tests/resume-docx-order.test.mjs exits 0 after the rebuild
      - ResumeView.tsx contains no 'resume-sidebar' and no 'md:w-[33%]' (single column) and renders CoreCompetencies between Summary and Experience
      - grep -c 'CORE COMPETENCIES' src/components/resume/ResumeCoreCompetencies.tsx → ≥ 1 and grep 'COMPETENCIES.SYS' src/ returns nothing (U-5 docx-verbatim label)
      - the order suite's U-4 role-count assertion is green: exactly 3 isTechRelated:true entries in the JSON and ResumeExperience.tsx still filtering on it
      - ResumeViewProps still declares showCertifications/showProjects/showArticles (grep) — modal contract intact, ResumeModal.tsx untouched
      - resume/page.tsx unchanged in this task (chrome preserved — git diff shows no edits to it)
    </acceptance_criteria>
    <done>/resume renders the docx order in one linear column with the competencies section live from the refreshed data and the modal contract intact.</done>
  </task>

  <task type="auto">
    <name>Task 2: Featured curation (certs + writing), drop dead skills section, print polish</name>
    <files>src/components/resume/ResumeCertifications.tsx, src/components/resume/ResumeArticles.tsx, src/components/resume/ResumeSkills.tsx, src/components/resume/index.ts, tests/resume-docx-order.test.mjs</files>
    <read_first>src/components/resume/ResumeCertifications.tsx, src/components/resume/ResumeArticles.tsx, src/components/cli/ResumeModal.tsx (lines 1-130), tests/resume-docx-order.test.mjs</read_first>
    <action>RED first: extend tests/resume-docx-order.test.mjs with curation assertions — ResumeCertifications.tsx contains 'featuredOnly' and filters by 'featured', ResumeArticles.tsx contains 'featuredOnly' and filters by 'featured', ResumeView passes featuredOnly to both, ResumeSkills.tsx no longer exists; run and capture the failure on record. GREEN: ResumeCertifications.tsx — add optional featuredOnly?: boolean prop; when true render certifications.filter(c => c.featured) (all 5 featured: ISTQB + 4 Anthropic), else keep the existing slice(0, 8) sidebar behaviour; ResumeView's CERTIFICATIONS call passes featuredOnly. ResumeArticles.tsx — add optional featuredOnly?: boolean; when true render articles.filter(a => a.featured) (the 5 selected-writing entries) ignoring limit, else keep slice(0, limit); ResumeView's SELECTED WRITING call passes featuredOnly. The CLI ResumeModal keeps its defaults (featuredOnly unset → full lists; toggles still gate sections — R-11). Delete the now-unused src/components/resume/ResumeSkills.tsx and its index.ts export (the docx structure has no skills section; nothing deleted from DATA — the full skills lists stay CLI-reachable). Print polish in ResumeView: single-column .resume-wrapper print rules (drop the 33%/67% sidebar widths), keep print:max-w-none and the A4 page rules. Re-run the suite green.</action>
    <verify>npm run typecheck && node --test tests/resume-docx-order.test.mjs && ! test -f src/components/resume/ResumeSkills.tsx && grep -c "featuredOnly" src/components/resume/ResumeView.tsx</verify>
    <acceptance_criteria>
      - RED on record: the curation assertions failed before the featuredOnly edits
      - node --test tests/resume-docx-order.test.mjs exits 0
      - ResumeSkills.tsx deleted; src/components/resume/index.ts no longer exports it
      - grep 'featuredOnly' hits ResumeCertifications.tsx, ResumeArticles.tsx and ResumeView.tsx
      - ResumeModal.tsx untouched (git diff over it empty) — its toggles keep working through the unchanged props contract
    </acceptance_criteria>
    <done>The page curates featured certs/writing per the docx while the modal keeps full lists; dead skills component removed; print CSS is single-column.</done>
  </task>

  <task type="auto">
    <name>Task 3: PDF rebuild to the docx structure + verify script rewrite (D-08, R-4)</name>
    <files>scripts/verify-resume-content.js, scripts/generate-static-resume.js, public/resume-export.html</files>
    <read_first>scripts/generate-static-resume.js, scripts/verify-resume-content.js, .planning/phases/EXPLORE-06-explore-revision/resume-docx-extraction.md, src/data/portfolio-main-data.json (post-refresh)</read_first>
    <action>RED first: rewrite scripts/verify-resume-content.js to the NEW contract and run it against the CURRENT (old-structure) export — capture the failure on record (old export lacks COMPETENCIES, carries SKILLS.SYS). New contract, standalone exit-0 script: data checks — about.title equals the docx line-2 string, core_competencies length 8 with non-empty proofs, Chubb responsibilities length 6 with first bullet containing '12+ engineering teams', experience entries with isTechRelated === true numbering exactly 3 (U-4), certifications exactly 5 featured with the 4 Anthropic names present, articles exactly 5 featured with the 2 new titles present; export checks — required markers present (about.name, the docx title, the summary text, competency cluster names, '12+ engineering teams', 'clarif-ai.net', 'npmjs.com/package/deepindex', Anthropic course names, article titles) and section ORDER ascending by indexOf: SUMMARY < COMPETENCIES < EXPERIENCE < PROJECTS < EDUCATION < CERTIFICATIONS < WRITING; forbidden markers — 'SKILLS.SYS', 'Languages' skill-group tags, the hardcoded 'https://linkedin.com/in/tasostilsi' literal, sidebar ARTICLES.LOG/CERTS.KEY/EDUCATION.BIN blocks. GREEN: rebuild scripts/generate-static-resume.js to a single-column docx layout (keep the JetBrains Mono styling, dark/print CSS variables, print URL-expansion and the write to public/resume-export.html): header (about.name, about.title, about.location) + contact rows built from about.contact (email mailto, linkedin, github, portfolio — data-driven, killing the hardcoded literals at lines 357-365); then sections in docx order: SUMMARY (about.description) → CORE COMPETENCIES (core_competencies name+proof list) → EXPERIENCE (experience.filter(e => e.isTechRelated) — the U-4 mechanism, the same filter /resume uses over plan 01's flipped data, yielding exactly the docx's 3 roles; responsibilities render the refreshed quantified bullets) → PROJECTS (**featured-flagged projects only — the docx's two, deepindex → Clarif-AI in data order; NOT a slice — the same featured mechanism /resume uses, checker B-1 fix** — flagship cards with enriched descriptions + the muted mono link lines) → EDUCATION (**featured-only: MSc + BEng** — checker B-2 fix) → CERTIFICATIONS (featured-only list: ISTQB with its ID link + the 4 Anthropic entries) → SELECTED WRITING (featured articles with links); delete the sidebar SKILLS.SYS hardcoded groups (lines 371-386), the sidebar EDUCATION.BIN/ARTICLES.LOG/CERTS.KEY blocks and the two-column .sidebar/.main layout CSS; **the PDF section markers carry the same docx-verbatim labels as /resume (checker B-3): SUMMARY, PROFESSIONAL EXPERIENCE, PROJECTS, EDUCATION, CERTIFICATIONS, SELECTED WRITING — the verify-resume-content.js order assertion already pins them.** Run npm run build:resume then node scripts/verify-resume-content.js to green.</action>
    <verify>npm run build:resume && node scripts/verify-resume-content.js</verify>
    <acceptance_criteria>
      - RED on record: the rewritten verify script failed against the pre-rebuild export (old structure) before the template edit
      - npm run build:resume exits 0 and regenerates public/resume-export.html
      - node scripts/verify-resume-content.js exits 0 (all PASS lines, no FAIL)
      - grep -c 'SKILLS.SYS' public/resume-export.html returns 0 and the export contains the competency section marker
      - grep -c 'https://linkedin.com/in/tasostilsi' scripts/generate-static-resume.js returns 0 (contacts data-driven from about.contact)
      - grep -c 'isTechRelated' scripts/generate-static-resume.js → ≥ 1 (PDF role selection uses the U-4 filter mechanism, not a positional slice)
      - the export renders projects (grep 'clarif-ai.net' and 'npmjs.com/package/deepindex' in public/resume-export.html both hit)
    </acceptance_criteria>
    <done>The PDF export renders the docx structure from the refreshed data with data-driven contacts; the standalone verify script is green on the new contract and stays runnable (npm-independent node script).</done>
  </task>
</tasks>