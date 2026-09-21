---
phase: 02-explore-content
plan: 02
type: execute
wave: 2
depends_on: ["EXPLORE-02-explore-content-01"]
files_modified:
  - src/components/explore/sections/projects-section.tsx
  - src/components/explore/sections/skills-section.tsx
  - src/components/explore/explore-panels.tsx
  - src/components/explore/constants.ts
autonomous: true
requirements: ["EXPLORE-03", "EXPLORE-07"]
user_setup: []
must_haves:
  truths:
    - "The Projects panel renders exactly 6 cards (Clarif-AI, DeepIndex, SDK4ED-TD, ServicedMetricsCalculator, Avoid Traffic Extended, Uom Track) in JSON order — the 7th entry ('Visualized Environment for Search Methods (VESM)') is absent — each card a single anchor when linked (name + ArrowUpRight + optional date tag, external in a new tab; on hover ONLY name + arrow shift to text-accent) with the full description wrapping and no clamping; the static '// more: projects --all in the terminal' pointer closes the panel (per D-01, D-02, UI-SPEC §7)."
    - "The Skills panel renders 6 groups in JSON key order (Soft Skills, Languages, Testing, Infrastructure, Innovation, Languages — the duplicate Languages label is disambiguated by group order) with all 36 skill chips as outline Badges carrying font-normal + pointer-events-none (no hover flicker, not focusable, no cursor change), followed by the static '// more: skills in the terminal' pointer (per D-01, D-02, D-04, UI-SPEC §6)."
    - "No humor line, no skeleton, and no placeholder code remain anywhere on /explore: the placeholder shell file (deleted in plan 01), the humor constant, and the transitional placeholder body are all gone; src/components/ui/skeleton.tsx the FILE stays (sidebar.tsx still imports it) (per D-06, UI-SPEC §2/§17.2)."
    - "grep over src/components/explore/ finds zero hardcoded portfolio copy — every rendered string originates from portfolio-main-data.json via PortfolioData-typed props or the phase-locked chrome literals (per D-07, EXPLORE-07, UI-SPEC §17.4)."
    - "The outer grid classes, ACCENTS map, and About span remain byte-identical to phase 1; 375px shows no horizontal scroll; content wraps, never truncates (per D-08, UI-SPEC §3/§12/§17.1)."
    - "All five panels are server components with no 'use client', no hooks, no new dependencies; /explore still statically exports (per D-08, UI-SPEC §2)."
  artifacts:
    - path: "src/components/explore/sections/projects-section.tsx"
      provides: "Projects body: top-6 mini-cards (single anchor or plain div per link presence, ↗ icon, optional date tag, wrapping description), terminal pointer (UI-SPEC §7, D-01)"
      min_lines: 75
      exports: ["ProjectsSection"]
    - path: "src/components/explore/sections/skills-section.tsx"
      provides: "Skills body: 6 groups in JSON key order with prettified chrome labels, 36 outline Badges (font-normal, pointer-events-none), terminal pointer (UI-SPEC §6, D-04)"
      min_lines: 65
      exports: ["SkillsSection"]
  key_links:
    - from: "src/components/explore/explore-panels.tsx"
      to: "src/components/explore/sections/projects-section.tsx"
      via: "SECTION_BODIES registry maps the projects section id to an adapter closure rendering ProjectsSection with data.projects (per-section slice props)"
      pattern: "sections/projects-section"
    - from: "src/components/explore/explore-panels.tsx"
      to: "src/components/explore/sections/skills-section.tsx"
      via: "SECTION_BODIES registry maps the skills section id to an adapter closure rendering SkillsSection with data.skills (per-section slice props)"
      pattern: "sections/skills-section"
    - from: "src/components/explore/sections/skills-section.tsx"
      to: "src/components/ui/badge.tsx"
      via: "Skill chips are the existing shadcn Badge with variant=\"outline\" + className overrides only (no primitive edits, per UI-SPEC §17.2)"
      pattern: "components/ui/badge"
    - from: "src/components/explore/sections/projects-section.tsx"
      to: "src/components/explore/sections/terminal-pointer.tsx"
      via: "Projects renders <TerminalPointer command=\"projects --all\" /> after the card stack (UI-SPEC §9, D-02)"
      pattern: "<TerminalPointer"
    - from: "src/components/explore/sections/skills-section.tsx"
      to: "src/components/explore/sections/terminal-pointer.tsx"
      via: "Skills renders <TerminalPointer command=\"skills\" /> after the chip groups (UI-SPEC §9, D-02)"
      pattern: "<TerminalPointer"
---

<objective>
Finish the phase: replace the last two placeholder bodies (Projects, Skills) with their data-driven components, then remove the transitional placeholder machinery so the phase ends clean — all five panels data-driven from portfolio-main-data.json (per D-01, D-02, D-04, D-06, D-07, D-08), no dead code, and the full SPEC acceptance sweep green (typecheck + static build + grep audit). Plan 01 established PanelShell, TerminalPointer, SECTION_BODIES (adapter-closure registry), and the page → panels → sections data flow; this plan completes the registry and deletes everything placeholder (EXPLORE-03, EXPLORE-07).
</objective>

<assumption_delta_decision>
- Noun now primary: the per-role responsibilities bullet list (promoted in plan 01 to a variable-length list capped at 3, per the assumption_delta_decision recorded there) — and, executed by this plan, the panel-body render path promotion: the data-driven path with cap + graceful-hide semantics (UI-SPEC §11) is the ONE primary path.
- Decision: promote (carried from plan 01). This plan EXECUTES the demotion's final step — task 3 deletes the transitional placeholder body, the skeleton usage in explore-panels, and the humor constant outright (UI-SPEC §2 permits it; D-06 + EXPLORE-07 mandate it). No add-alongside debt.
- Invariant companion (no test runner exists — static assertions only): the confirmed defaults (6 projects, all linked; 6 skill groups / 36 chips) round-trip through the primary path and are asserted in out/explore.html by this plan's greps; empty/absent optional fields (date, link, a skills group, responsibilities) render nothing without invented copy (§11) and are enforced as code-shape contracts in the task actions.
</assumption_delta_decision>

<verification_protocol>
Same protocol as plan 01 (no test runner in this repo — red/green runs on the acceptance assertions themselves). For each task, FIRST run the task's verify commands against the current source tree and out/explore.html and record the failing (red) state of every assertion that pins NEW behaviour — e.g. the per-panel humor-token eliminations (projects.repo.checkout after Task 1, skills.matrix.map after Task 2 — each red state reads 2), the flight-doubled global "— pending" count (4 at plan-01 end → 2 after Task 1 → 0 after Task 2), panel-specific content greps (project names, skills chip samples) that cannot pass before wiring, and the dead-code greps that fail while the transitional placeholder machinery still exists. DOUBLING (empirically verified this session against the phase-1 build): every rendered TEXT string inside the server-rendered children (the ExplorePanels output) appears exactly twice in out/explore.html — once in the SSR markup, once in the inlined RSC flight payload (self.__next_f.push rows; measured baseline: "— pending" = 10, each per-panel humor token = 2). Attribute-syntax strings (target="_blank") appear ONLY in the SSR markup — the flight payload serializes props as escaped JSON (\"target\":\"_blank\"), which a plain-quote attribute grep does not count. Assertions reading == 0 are immune (0 × 2 = 0). Pre-green invariants (exclusion greps like the VESM one) already pass before the change — record them as such. Then implement, and re-run the SAME commands to record green before committing the task. Task 3's sweep is the PHASE's chronological-last gate: no file may be written after the last green run that the completion claim leans on.
PROSE SAFETY (carried from plan 01): no comment or doc comment in any file under src/components/explore/ may contain the literal tokens PanelPlaceholder, PlaceholderBody, EXPLORE_PANEL_HUMOR, or Skeleton — plan 01 wrote every transitional comment token-free; plan 02 task 3 deletes the code occurrences; if the task-3 sweep surfaces a surviving match it can only be a comment — reword it without the tokens. Lowercase prose ("skeleton lines", "placeholder body") is safe; the capitalized identifiers are what the case-sensitive sweep matches.
</verification_protocol>

<context>
@.planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-UI-SPEC.md  — the locked design contract: §6 (skills chips), §7 (project cards), §10 (interaction matrix), §11 (graceful-hide), §12 (responsive matrix), §15 (verifier hooks), §16 (resolved W-5 labels), §17 (prohibitions). Follow its exact class strings.
@.planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-CONTEXT.md  — locked decisions D-01…D-08.
@.planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-01-PLAN.md  — wave-1 plan: the SECTION_BODIES adapter-closure registry, the transitional placeholder body, the prose-safety rule, and the chrome contracts this plan finishes.
@src/components/explore/explore-panels.tsx  — wiring file as left by plan 01 (Partial registry of adapter closures + transitional placeholder body).
@src/components/explore/constants.ts  — EXPLORE_PANEL_HUMOR to delete; everything else stays (drawer/status-bar still import the rest).
@src/components/explore/sections/terminal-pointer.tsx  — the shared pointer component to reuse (created by plan 01 task 3).
@src/components/ui/badge.tsx  — the Badge primitive (variant="outline" = transparent bg + text-foreground; default/secondary carry hover:bg-*-80; className overrides only — do NOT edit).
@src/data/portfolio-main-data.d.ts  — PortfolioData['skills'] (soft_skills / hard_skills index-signature / languages) / PortfolioData['projects'] types.
@src/data/portfolio-main-data.json  — projects[0..5] (all carry link; date optional; DeepIndex also has sourceUrl — not rendered), skills (soft_skills 6, hard_skills{Languages 9, Testing 6, Infrastructure 6, Innovation 7} in insertion order, languages 2 — 36 chips total).
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — Projects body, top-6 mini-cards with external links</name>
    <files>src/components/explore/sections/projects-section.tsx, src/components/explore/explore-panels.tsx</files>
    <read_first>src/data/portfolio-main-data.json (projects[0..5] and projects[6] for the cap boundary), src/data/portfolio-main-data.d.ts (Project.link/date/sourceUrl optionality), src/components/explore/sections/terminal-pointer.tsx, .planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-UI-SPEC.md (§7, §10, §11, §12, §14, §17.5/§17.11)</read_first>
    <action>
      1. Create src/components/explore/sections/projects-section.tsx — server component (NO "use client", no hooks) exporting `ProjectsSection({ projects }: { projects: PortfolioData['projects'] })`, typed via `import type { PortfolioData } from '@/data/portfolio-main-data'` (repo convention, per D-07); icons from 'lucide-react'; TerminalPointer from './terminal-pointer'.
      2. Cap per D-01: `const cards = projects.slice(0, 6)` — first 6 JSON entries, NO sorting; this matches the in-app resume-modal cap precedent (src/components/resume/ResumeView.tsx:146 — limit={6} → slice(0, 6), verified). If cards.length === 0 render nothing at all — no stack, no pointer, no "no entries" copy (UI-SPEC §11).
      3. Card stack: `<div className="space-y-2">`. Per card, exactly ONE link or none (UI-SPEC §7/§17.11 — no nested anchors): when `link` is present → `<a href={link} target="_blank" rel="noopener noreferrer" className="group block rounded-md border border-border p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">`; when absent → plain `<div className="block rounded-md border border-border p-3">` with NO group class, no hover, no cursor (robustness branch only — all 6 pinned projects have links, verified).
      4. Card header EXACTLY per UI-SPEC §7: `<div className="flex items-baseline justify-between gap-2">` — NO flex-wrap (W-4 pin: at 375px the name wraps internally while the date stays pinned right, §12). Name `<span className="flex min-w-0 items-center gap-1 text-sm font-medium text-foreground group-hover:text-accent transition-colors">{name} <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 group-hover:text-accent transition-colors" /></span>` — the ↗ and BOTH group-hover classes exist ONLY on the linked variant (hover moves name + arrow to text-accent, nothing else — W-2 pin). Date `<span className="shrink-0 text-xs text-muted-foreground tabular-nums">{date}</span>` rendered ONLY when date is present (§11: tag absent → right side empty, no dash/placeholder).
      5. Description `<p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>` — wraps fully; DeepIndex's ~220-char description runs 4-5 lines at 419px and that is ACCEPTED; zero truncate/line-clamp-*/whitespace-nowrap (§17.5). `sourceUrl` is NOT rendered — one link per card; the source stays reachable via the terminal (§7).
      6. After the stack: `<TerminalPointer command="projects --all" />` (per D-02, UI-SPEC §9). No other interactivity; no "use client".
      7. Register projects via the adapter closure `projects: ({ data }) => <ProjectsSection projects={data.projects} />` in SECTION_BODIES in src/components/explore/explore-panels.tsx (adapter-closure registry form pinned by plan 01 task 1 step 3c). Run npm run typecheck && npm run build.
    </action>
    <verify>
      npm run typecheck && npm run build (exit 0)
      grep -cF "slice(0, 6)" src/components/explore/sections/projects-section.tsx   # 1 (D-01 cap)
      grep -oF 'target="_blank"' src/components/explore/sections/projects-section.tsx | wc -l   # 1 (occurrence semantics: single linked-card anchor template in source; 6 anchors at runtime)
      grep -n "sourceUrl" src/components/explore/sections/projects-section.tsx | wc -l   # 0 (UI-SPEC §7)
      grep -n "flex-wrap" src/components/explore/sections/projects-section.tsx | wc -l   # 0 (W-4 pin)
      grep -oF "Visualized Environment for Search Methods" out/explore.html | wc -l   # == 0 (7th project excluded — cap holds; pre-green invariant, the placeholder never rendered it)
      for n in "Clarif-AI" "DeepIndex" "SDK4ED-TD" "ServicedMetricsCalculator" "Avoid Traffic Extended" "Uom Track"; do grep -qF "$n" out/explore.html || echo "MISSING: $n"; done   # empty output (all 6 render)
      grep -oF "projects --all" out/explore.html | wc -l   # >= 1 (D-02 pointer)
      grep -oF "projects.repo.checkout" out/explore.html | wc -l   # 0 (Projects humor replaced per D-06 — red state reads 2: SSR markup + flight payload)
      grep -oF "— pending" out/explore.html | wc -l   # 2 (only the Skills placeholder body remains transitionally)
    </verify>
    <acceptance_criteria>
      - npm run typecheck and npm run build both exit 0
      - out/explore.html contains all 6 capped project names and zero occurrences of the 7th entry "Visualized Environment for Search Methods" (D-01 top-6 cap; exclusion is a pre-green invariant)
      - projects-section.tsx contains slice(0, 6) exactly once, target="_blank" exactly once as an occurrence (the single linked-card template — 6 anchors render at runtime), zero sourceUrl references, and zero flex-wrap (W-4 pin)
      - "projects --all" appears in out/explore.html (TerminalPointer after the stack, per D-02); the projects.repo.checkout humor token reaches 0 occurrences (red→green transition recorded — the red state reads 2, one SSR markup occurrence + one inlined RSC flight payload) and the global "— pending" occurrence count is exactly 2 at this point (only the Skills placeholder remains, flight-doubled)
      - the linked-card anchor carries the focus-visible ring classes and the hover transition is confined to name + ↗ via the group class (W-2 pin)
    </acceptance_criteria>
    <done>Projects panel renders exactly 6 data-driven mini-cards (linked ones as single anchors with ↗ + optional date, hover accent on name+arrow only) plus the static terminal pointer; typecheck and static build pass.</done>
  </task>

  <task type="auto">
    <name>Task 2: Skills body — grouped chips via shadcn Badge</name>
    <files>src/components/explore/sections/skills-section.tsx, src/components/explore/explore-panels.tsx</files>
    <read_first>src/data/portfolio-main-data.json (skills), src/components/ui/badge.tsx (variant inventory + base classes), .planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-CONTEXT.md (D-01, D-04), .planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-UI-SPEC.md (§6, §11, §16 resolved W-5, §17.2/§17.4)</read_first>
    <action>
      1. Create src/components/explore/sections/skills-section.tsx — server component (NO "use client") exporting `SkillsSection({ skills }: { skills: PortfolioData['skills'] })` (type per D-07); Badge from '@/components/ui/badge'; TerminalPointer from './terminal-pointer'.
      2. Groups in JSON key order, NO sorting, NO re-shaping (per D-01 — chips render the JSON's own grouping): soft_skills FIRST with chrome label 'Soft Skills', then the hard_skills groups in the JSON's INSERTION order via Object.entries (verified order: Languages, Testing, Infrastructure, Innovation) with label = the key verbatim, then languages with chrome label 'Languages'. The two 'Languages' rows are intentionally distinct groups keyed by their distinct JSON paths; group ORDER disambiguates them (UI-SPEC §6, W-5 resolved: prettified chrome labels are allowed structural literals per §17.4).
      3. Outer wrapper `<div className="space-y-3">`. Per group (skip the group ENTIRELY when its array is missing or empty — §11 renders nothing, no placeholder copy): `<div><p className="text-xs text-muted-foreground">{label}</p><ul className="mt-1.5 flex flex-wrap gap-1.5">` with one `<li><Badge variant="outline" className="font-normal pointer-events-none">{skill}</Badge></li>` per skill. If NO group has content, render nothing at all — no wrapper, no pointer (§11; robustness branch that never fires with current data).
      4. Badge constraints (per D-04, UI-SPEC §6/§17.2): import the existing Badge from '@/components/ui/badge' and use variant="outline" ONLY; do NOT edit badge.tsx; the className overrides are mandatory — font-normal neutralizes the base font-semibold (too heavy at chip density) and pointer-events-none neutralizes the default/secondary variants' hover:bg-* classes (CSS :hover fires on divs — without it a cursor pass flicks chip backgrounds; §10 pins chips static, no cursor change, not focusable).
      5. All 36 chips render — every group as-is, NO cap on groups (CONTEXT discretion locked: 6 soft + 9+6+6+7 hard + 2 languages = 36).
      6. After the groups: `<TerminalPointer command="skills" />` (per D-02 — the CLI command is `skills`, no --all). No "use client"; fully static.
      7. Register skills via the adapter closure `skills: ({ data }) => <SkillsSection skills={data.skills} />` in SECTION_BODIES (adapter-closure registry form pinned by plan 01 task 1 step 3c). Run npm run typecheck && npm run build.
    </action>
    <verify>
      npm run typecheck && npm run build (exit 0)
      grep -cF 'variant="outline"' src/components/explore/sections/skills-section.tsx   # 1
      grep -cF "pointer-events-none" src/components/explore/sections/skills-section.tsx   # 1 (§10 chips-static pin)
      grep -cF "font-normal" src/components/explore/sections/skills-section.tsx   # 1
      grep -cF "components/ui/badge" src/components/explore/sections/skills-section.tsx   # 1 (reuses the existing primitive per D-04)
      grep -cF "Soft Skills" src/components/explore/sections/skills-section.tsx   # >= 1 (prettified chrome label, W-5)
      for n in "Analytical Skills" "Java" "Playwright" "NPM Module Dev" "Prompt Engineering" "Greek (Native)"; do grep -qF "$n" out/explore.html || echo "MISSING: $n"; done   # empty output (each of the 6 groups renders at least its first chip)
      grep -cF 'command="skills"' src/components/explore/sections/skills-section.tsx   # 1 (D-02)
      grep -oF "skills.matrix.map" out/explore.html | wc -l   # 0 (Skills humor replaced per D-06 — red state reads 2: flight-doubled)
      grep -oF "— pending" out/explore.html | wc -l   # == 0 (all five panels now render real content; == 0 is immune to the doubling — 0 × 2 = 0)
    </verify>
    <acceptance_criteria>
      - npm run typecheck and npm run build both exit 0
      - every skills group renders at least its representative chip in out/explore.html (the 6-sample loop prints nothing) — soft_skills, hard_skills.Languages, hard_skills.Testing, hard_skills.Infrastructure, hard_skills.Innovation, languages each present, in JSON key order with the prettified labels (per D-01, W-5)
      - the chip markup is exactly Badge with variant="outline" and className "font-normal pointer-events-none" — no hover affordance survives (§10), and ui/badge.tsx is unmodified
      - "skills.matrix.map" reaches 0 occurrences (red→green transition recorded — the red state reads 2, flight-doubled) and the global "— pending" humor count reaches exactly 0 (immune to the flight doubling; D-06 complete)
      - skills-section.tsx contains command="skills" exactly once and no anchor/hover classes on chips (D-02 static pointer)
    </acceptance_criteria>
    <done>Skills panel renders all 6 JSON groups with 36 static outline chips plus the terminal pointer; no placeholder body remains on the page; typecheck and static build pass.</done>
  </task>

  <task type="auto">
    <name>Task 3: Dead-code removal + full phase acceptance sweep</name>
    <files>src/components/explore/explore-panels.tsx, src/components/explore/constants.ts</files>
    <read_first>src/components/explore/explore-panels.tsx (as left by Tasks 1-2), src/components/explore/constants.ts, .planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-UI-SPEC.md (§2, §15, §17)</read_first>
    <action>
      1. In src/components/explore/explore-panels.tsx: make SECTION_BODIES TOTAL — `Record<ExploreSectionId, ComponentType<{ data: PortfolioData }>>` with the five ADAPTER CLOSURES (the registry-entry form pinned by plan 01 task 1 step 3c, since section components take per-section slice props): `about: ({ data }) => <AboutSection about={data.about} />`, `experience: ({ data }) => <ExperienceSection experience={data.experience} />`, `skills: ({ data }) => <SkillsSection skills={data.skills} />`, `projects: ({ data }) => <ProjectsSection projects={data.projects} />`, `contact: ({ data }) => <ContactSection contact={data.about.contact} />`; delete the private transitional placeholder-body component, the `import { Skeleton } from '@/components/ui/skeleton'`, and the EXPLORE_PANEL_HUMOR import; simplify the map to always render `<Body data={data} />` (the fallback branch is gone). The grid div classes, the ACCENTS record, and the About span ('md:col-span-2 lg:col-span-2') stay BYTE-IDENTICAL (§17.1/§17.12). Update the file's doc comment to describe the completed anatomy (5 real bodies, no placeholder path) — worded WITHOUT the sweep tokens per the prose-safety rule carried from plan 01.
      2. In src/components/explore/constants.ts: FIRST grep the importers of EXPLORE_PANEL_HUMOR — after Tasks 1-2 it must be exactly explore-panels.tsx; then delete the EXPLORE_PANEL_HUMOR export and its doc comment. Keep EXPLORE_SECTIONS, ExploreSectionId, EXPLORE_THEME_STORAGE_KEY/VALUES, and the status-bar constants untouched (other files import them).
      3. Full phase acceptance sweep (UI-SPEC §15 verifier hooks; run all with the fresh build):
         a. Dead code: grep -rn "EXPLORE_PANEL_HUMOR\|PlaceholderBody\|PanelPlaceholder\|Skeleton" src/components/explore/ → 0 matches. Every CODE occurrence — the transitional body component, the skeleton import, the humor import and export — is deleted by steps 1-2 of this task, and plan 01 wrote every transitional doc comment token-free (its verification_protocol prose-safety rule), so a surviving match can only be a comment: reword the comment without the tokens.
         b. No hardcoded portfolio copy (§17.4, EXPLORE-07): grep -rnE "Chubb|Upstream Systems|Netcompany|Smartup|Clarif-AI|DeepIndex|SDK4ED|ServicedMetrics|Avoid Traffic|Uom Track|protonmail|linkedin\.com|github\.com|medium\.com|facebook\.com|instagram\.com|twitter\.com|twitch\.tv|Playwright|Analytical Skills|Greek \(Native\)" src/components/explore/ → 0 matches. The chrome label maps (Email/LinkedIn/GitHub/Medium/… and Soft Skills/Languages/Testing/Infrastructure/Innovation) and pointer strings must not match these patterns — keep portfolio VALUES out of all new explore files, including doc comments.
         c. No truncation (scoped to the files this phase writes): grep -rn "truncate\|line-clamp-\|whitespace-nowrap" src/components/explore/sections/ src/components/explore/panel-shell.tsx src/components/explore/explore-panels.tsx src/components/explore/constants.ts → 0 matches (§17.5). A directory-wide sweep would be wrong: phase-1 explore-header.tsx:50,53 legitimately carries two truncate classes and is out of bounds per §17.1 — the sweep covers exactly the files this phase creates or rewrites.
         d. Chrome byte-identical: grep -cF "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" == 1 and grep -cF "md:col-span-2 lg:col-span-2" == 1 in explore-panels.tsx; grep -cF "rounded-md border bg-card p-4" panel-shell.tsx == 1.
         e. Pointer census in out/explore.html: "— pending" == 0; "experience --all" and "projects --all" both present (>= 1 each); command="skills" present in skills-section.tsx source; zero TerminalPointer references in about-section.tsx and contact-section.tsx (per D-02).
         f. npm run typecheck && npm run build exit 0 — /explore still static-exported (output 'export' untouched; no "use client" added to any explore section, PanelShell, or ExplorePanels).
      4. Do NOT delete src/components/ui/skeleton.tsx (sidebar.tsx still imports it — UI-SPEC §0/§17.2); do not touch ui/badge.tsx, ui/sheet.tsx, Resume* components, any CLI file, or portfolio-main-data.json (§17.2/§17.12, D-08). No new dependencies (D-08) and no chart-library imports (phase 3) — this phase introduces no charts, no interactivity on terminal pointers (phase 5), and no photo/education content (deferred ideas, do not implement).
    </action>
    <verify>
      npm run typecheck && npm run build (exit 0)
      grep -rn "EXPLORE_PANEL_HUMOR\|PlaceholderBody\|PanelPlaceholder\|Skeleton" src/components/explore/ | wc -l   # 0
      grep -rnE "Chubb|Clarif-AI|DeepIndex|protonmail|linkedin\.com|github\.com|Playwright|Analytical Skills" src/components/explore/ | wc -l   # 0 (no hardcoded portfolio copy — EXPLORE-07)
      grep -rn "truncate\|line-clamp-\|whitespace-nowrap" src/components/explore/sections/ src/components/explore/panel-shell.tsx src/components/explore/explore-panels.tsx src/components/explore/constants.ts | wc -l   # 0 (phase-owned files only — explore-header.tsx's two phase-1 truncate classes are §17.1-untouched and excluded)
      grep -cF "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" src/components/explore/explore-panels.tsx   # 1
      grep -cF "md:col-span-2 lg:col-span-2" src/components/explore/explore-panels.tsx   # 1
      grep -rn "use client" src/components/explore/sections/ src/components/explore/panel-shell.tsx src/components/explore/explore-panels.tsx | wc -l   # 0 (server components, §2)
      grep -oF "— pending" out/explore.html | wc -l   # == 0
      grep -oF "experience --all" out/explore.html | wc -l   # >= 1
      grep -oF "projects --all" out/explore.html | wc -l   # >= 1
      grep -n "TerminalPointer" src/components/explore/sections/about-section.tsx src/components/explore/sections/contact-section.tsx | wc -l   # 0 (D-02: no pointer on About/Contact)
      test -f src/components/ui/skeleton.tsx   # exit 0 (file stays — sidebar.tsx imports it)
    </verify>
    <acceptance_criteria>
      - npm run typecheck and npm run build both exit 0; out/explore.html regenerated; /explore still statically exported (no "use client" in any explore section, panel-shell, or explore-panels)
      - src/components/explore/ contains zero references to EXPLORE_PANEL_HUMOR, PlaceholderBody, PanelPlaceholder, or Skeleton; the humor count in out/explore.html is exactly 0 (D-06 fully complete)
      - the hardcoded-copy grep over src/components/explore/ returns zero matches (EXPLORE-07: every rendered string from the JSON or phase-locked chrome)
      - the truncation grep over the phase-owned explore files (sections/, panel-shell.tsx, explore-panels.tsx, constants.ts) returns zero matches — explore-header.tsx and other untouched phase-1 files are excluded per §17.1; the phase-1 grid classes and About span remain byte-identical (§17.1)
      - src/components/ui/skeleton.tsx still exists; constants.ts no longer exports EXPLORE_PANEL_HUMOR but still exports EXPLORE_SECTIONS and the theme/status constants; ui/badge.tsx, ui/sheet.tsx, Resume* components, CLI files, and portfolio-main-data.json are untouched (§17.2/§17.12, D-08)
      - this sweep is the phase's chronological-last gate — no file is written after the final green run that the completion claim leans on
    </acceptance_criteria>
    <done>All five /explore panels render data-driven content from portfolio-main-data.json with zero placeholder remnants, byte-identical phase-1 chrome/grid, and the full SPEC acceptance sweep green — this sweep is the phase's chronological-last gate.</done>
  </task>
</tasks>