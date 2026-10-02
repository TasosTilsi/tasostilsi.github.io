---
phase: 01-explore-shell
plan: 02
type: execute
wave: 2
depends_on: ["EXPLORE-01-explore-shell-01"]
files_modified:
  - src/components/explore/explore-drawer.tsx
  - src/components/explore/explore-panels.tsx
  - src/components/explore/panel-placeholder.tsx
  - src/components/explore/explore-intro.tsx
  - src/components/explore/explore-header.tsx
  - src/components/explore/constants.ts
  - src/app/explore/page.tsx
autonomous: true
requirements: ["EXPLORE-01", "EXPLORE-06"]
user_setup: []
must_haves:
  truths:
    - "The header drawer toggle opens a left off-canvas Sheet listing About, Experience, Skills, Projects, Contact (in order) at EVERY viewport — 375px, 768px, 1440px — one code path, no separate mobile navbar (per D-02, EXPLORE-01b)"
    - "The drawer closes via its built-in X, ESC, and outside click at all viewports; Radix traps focus while open and returns focus to the toggle on close (EXPLORE-01b)"
    - "Clicking a nav item closes the drawer and smooth-scrolls to its panel; all five panels carry stable DOM ids about/experience/skills/projects/contact (drawer anchors + no-JS hash fallback)"
    - "Five placeholder panels render with accent chip + locked label, one comment-style humor line each (D-06), and Skeleton bodies, in a 1-col (375px) / 2-col About-spanning (768px) / 3-col About-spanning (1440px) grid (EXPLORE-06)"
    - "Placeholder panels are non-interactive: no hover style, no pointer cursor, not focusable (UI-SPEC §17.6 pinned)"
    - "The typewriter strip types the real 'name — title' from data once per mount; with prefers-reduced-motion it renders static full text instead; a server-rendered sr-only <h1> always carries the full text (per D-07)"
    - "All interactive targets are ≥44 real px (px-based classes): header toggles and drawer items (EXPLORE-06)"
    - "The status bar counter reads 0/5 with the 5 derived from EXPLORE_SECTIONS.length; the 0 stays static until phase 4 (D-03)"
    - "The CLI at / and /resume render unchanged: git diff names no file under src/app/(main)/, src/components/cli/, src/app/resume/ and src/components/ui/sheet.tsx is untouched (D-10, UI-SPEC §17.2)"
  artifacts:
    - path: "src/components/explore/explore-drawer.tsx"
      provides: "Sheet-based off-canvas drawer: 5 anchor nav items, portal-safe explore-shell scope class"
      min_lines: 55
      exports: ["ExploreDrawer"]
    - path: "src/components/explore/explore-panels.tsx"
      provides: "Responsive 5-panel grid with stable section ids and About spans at md/lg"
      min_lines: 40
      exports: ["ExplorePanels"]
    - path: "src/components/explore/panel-placeholder.tsx"
      provides: "Placeholder panel anatomy: accent chip, locked label, humor line, Skeleton body"
      min_lines: 40
      exports: ["PanelPlaceholder"]
    - path: "src/components/explore/explore-intro.tsx"
      provides: "Typewriter intro strip: sr-only h1 + reduced-motion-aware TypingEffect wrapper"
      min_lines: 40
      exports: ["ExploreIntro"]
    - path: "src/components/explore/constants.ts"
      provides: "Locked humor copy map keyed by section id (chrome strings, not portfolio data)"
      min_lines: 25
      exports: ["EXPLORE_PANEL_HUMOR"]
  key_links:
    - from: "src/components/explore/explore-drawer.tsx"
      to: "src/components/explore/explore-panels.tsx"
      via: "anchor hrefs #{id} from EXPLORE_SECTIONS resolve to section ids rendered in the main scroll container"
      pattern: "href=\\{?`#\\$\\{"
    - from: "src/components/explore/explore-header.tsx"
      to: "src/components/explore/explore-drawer.tsx"
      via: "drawer toggle button wired as SheetTrigger asChild — Radix supplies aria-expanded/aria-controls and focus return"
      pattern: "SheetTrigger"
    - from: "src/components/cli/TypingEffect.tsx"
      to: "src/components/explore/explore-intro.tsx"
      via: "import of the untouched CLI TypingEffect with text={name — title}, speed 30, delay 400 (reuse, no modification — D-07)"
      pattern: "from ['\"]@/components/cli/TypingEffect['\"]"
    - from: "src/components/explore/explore-drawer.tsx"
      to: "portaled SheetContent DOM"
      via: "SheetContent carries the explore-shell marker class because Sheet portals to <body> and escapes the shell subtree (UI-SPEC §5 hard requirement)"
      pattern: "explore-shell"
---

<assumption_delta_decision>
- Second-landing representation: /explore remains **add-alongside** the CLI (per plan 01's assumption_delta_decision and D-10) — this plan adds no cross-routing, toggle, or promotion between landings; that is phase 5's deferred work.
- Invariant companion honoured here: the drawer anchors target in-page panel ids only (no cross-route links), so every supported landing stays independent until phase 5.
</assumption_delta_decision>

<objective>
Complete the IDE shell on the wave-1 foundation: the off-canvas section drawer (D-02) wired into the header, the full five-panel placeholder grid with locked humor copy (D-06) and stable section ids, and the typewriter intro (D-07). After this plan the phase's EXPLORE-01 frame is complete end-to-end — header → drawer → panels → status bar — responsive from 375px to desktop (EXPLORE-06), with the drawer, panel grid, and intro verified through the static export. Zero new dependencies (D-09); no edits to src/components/ui/sheet.tsx, src/components/cli/**, src/app/(main)/**, or /resume (D-10).
</objective>

<context>
@.planning/phases/EXPLORE-01-explore-shell/EXPLORE-01-explore-shell-UI-SPEC.md
@.planning/phases/EXPLORE-01-explore-shell/EXPLORE-01-explore-shell-01-PLAN.md
@src/components/ui/sheet.tsx
@src/components/cli/TypingEffect.tsx
@src/components/explore/constants.ts
@src/components/explore/explore-header.tsx
@src/components/explore/explore-shell.tsx
@src/app/explore/page.tsx
@src/data/portfolio-main-data.json
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — Sheet drawer end-to-end (header toggle → left drawer → 5 anchors → panel ids)</name>
    <files>src/components/explore/explore-drawer.tsx, src/components/explore/explore-header.tsx, src/components/explore/explore-panels.tsx, src/app/explore/page.tsx</files>
    <read_first>.planning/phases/EXPLORE-01-explore-shell/EXPLORE-01-explore-shell-UI-SPEC.md (§5, §13, §17), src/components/ui/sheet.tsx, src/components/explore/constants.ts, src/components/explore/explore-header.tsx, src/app/explore/page.tsx</read_first>
    <action>
      This is plan 02's tracer: the thinnest working slice of navigation — toggle → drawer → anchor → panel id — verified before the panel anatomy expansion in Task 2.
      1. Create src/components/explore/explore-drawer.tsx ("use client"): export function ExploreDrawer({ trigger }: { trigger: React.ReactNode }). Compose with the EXISTING shadcn primitives from '@/components/ui/sheet' (per D-02, D-09): <Sheet> → <SheetTrigger asChild>{trigger}</SheetTrigger> → <SheetContent side="left">. Per UI-SPEC §5: NO width overrides (the default left variant w-3/4 sm:max-w-sm = 384px is pinned, sheet.tsx:41), and the overlay stays the built-in bg-black/80 at every viewport (resolves the discuss discretion — one code path, zero churn). DO NOT edit src/components/ui/sheet.tsx in any way (UI-SPEC §17.2).
      2. SheetContent className MUST include the marker class `explore-shell` alongside its own classes — hard requirement: Sheet renders through a portal to <body> (sheet.tsx:60) and escapes the shell DOM subtree, so without this class the drawer loses both the IDE tokens and JetBrains Mono (UI-SPEC §5, §10). Pass className="explore-shell" to SheetContent.
      3. Inside SheetContent: <SheetHeader> with <SheetTitle>~/explore</SheetTitle> and <SheetDescription>Jump to a section</SheetDescription> (Radix a11y warning guard — chrome copy, not portfolio data, UI-SPEC §17.5). Then a nav rendering the 5 items from EXPLORE_SECTIONS in order as anchor links: <a href={`#${section.id}`} onClick={close}> with label text; onClick closes the drawer (anchor navigates + close, UI-SPEC §5). Radix already provides ESC-close, outside-click close, focus trap, and focus return to the trigger (EXPLORE-01b) — do NOT re-implement or customize initial focus (UI-SPEC §5).
      4. Item anatomy (UI-SPEC §5): each item is a flex row, min-h-[44px] (px-based real touch target), items-center gap-3 px-2 rounded-md text-sm text-sidebar-foreground, hover:bg-sidebar-accent hover:text-sidebar-accent-foreground, focus-visible:ring-2 ring-sidebar-ring; leading index digits "01"…"05" (String(i + 1).padStart(2, "0")) with text-xs tabular-nums and aria-hidden — decorative per the W-3 fix; digit accent color is fixed by section order: About=text-chart-1, Experience=text-chart-2, Skills=text-chart-3, Projects=text-chart-4, Contact=text-chart-5.
      5. Edit src/components/explore/explore-header.tsx: add the drawer toggle as the RIGHTMOST control (UI-SPEC §3 order: theme toggle, then drawer toggle rightmost) — a <button type="button"> of exactly h-[44px] w-[44px], ghost styling matching Task 3 of plan 01 (text-muted-foreground hover:bg-muted rounded-md focus-visible:ring-2 ring-ring ring-offset-2), wrapping the lucide-react Menu icon, passed into <ExploreDrawer trigger={…}>. The trigger button itself needs no manual aria-expanded/aria-controls — SheetTrigger asChild supplies them (Radix).
      6. Create src/components/explore/explore-panels.tsx: export function ExplorePanels() (no "use client" — static). Thin tracer version: <div className="grid grid-cols-1 gap-4"> mapping EXPLORE_SECTIONS to <section id={section.id} aria-label={section.label} className="rounded-md border bg-card p-4"> with a title row (text-sm font-medium). The full §6 anatomy and responsive spans land in Task 2 — keep ids stable from the start.
      7. Edit src/app/explore/page.tsx: replace the inline About placeholder panel (the tracer stand-in from plan 01) with <ExplorePanels /> inside the main scroll container.
    </action>
    <verify>npm run typecheck && npm run build && test -f out/explore.html && test $(grep -c "href=\\[?\\|\`#" src/components/explore/explore-drawer.tsx) -ge 5 && grep -q 'explore-shell' src/components/explore/explore-drawer.tsx && grep -q 'side="left"' src/components/explore/explore-drawer.tsx && grep -q "SheetTrigger" src/components/explore/explore-drawer.tsx && git diff --stat src/components/ui/sheet.tsx | wc -l | grep -q "^0"</verify>
    <acceptance_criteria>
      - `grep -q 'side="left"' src/components/explore/explore-drawer.tsx` exits 0 (left off-canvas, D-02)
      - `grep -q "explore-shell" src/components/explore/explore-drawer.tsx` exits 0 (portal scope class on SheetContent — UI-SPEC §5 hard requirement)
      - The drawer file contains 5 anchor hrefs derived from EXPLORE_SECTIONS (grep for `#${` usage or five href="#…" occurrences ≥ 5)
      - `grep -q "SheetTrigger" src/components/explore/explore-drawer.tsx` exits 0 (toggle wired as Radix trigger — aria-expanded/controls free)
      - `git diff --name-only src/components/ui/sheet.tsx` outputs nothing (prohibition §17.2)
      - Observable: at 375px, 768px, and 1440px the drawer opens from the header Menu button, closes via built-in X / ESC / outside click, focus is trapped while open and returns to the toggle on close (Radix defaults — EXPLORE-01b)
      - `npm run build` exits 0 and out/explore.html exists
    </acceptance_criteria>
    <done>The drawer is one code path at every viewport: header Menu → left Sheet (token+font-scoped via the portal-safe marker class) → five labeled anchors closing on click; panels with stable ids exist as anchor targets; sheet.tsx is byte-untouched.</done>
  </task>

  <task type="auto">
    <name>Task 2: Five-panel placeholder grid — humor copy, accents, skeletons, responsive spans (D-06, D-01, EXPLORE-06)</name>
    <files>src/components/explore/constants.ts, src/components/explore/panel-placeholder.tsx, src/components/explore/explore-panels.tsx</files>
    <read_first>.planning/phases/EXPLORE-01-explore-shell/EXPLORE-01-explore-shell-UI-SPEC.md (§6, §8, §11, §17), src/components/explore/constants.ts, src/components/ui/skeleton.tsx</read_first>
    <action>
      1. Extend src/components/explore/constants.ts: export const EXPLORE_PANEL_HUMOR: Record<ExploreSectionId, string> = { about: "// about.profile.load() — pending", experience: "// experience.render() — pending", skills: "// skills.matrix.map() — pending", projects: "// projects.repo.checkout() — pending", contact: "// contact.establish_link() — pending" } — the five UI-SPEC §6 strings verbatim (format locked `// <expression> — pending`; wording is planner discretion per CONTEXT, resolved by adopting §6 verbatim; professional, one line per panel — D-06). These are locked chrome strings, not portfolio content (UI-SPEC §17.5).
      2. Create src/components/explore/panel-placeholder.tsx: export function PanelPlaceholder({ id, label, humor, accent, extraLine }: { id: ExploreSectionId; label: string; humor: string; accent: string; extraLine?: boolean }) rendering <section id={id} aria-label={label}> with className "rounded-md border bg-card p-4" and, top to bottom (UI-SPEC §6): header row — aria-hidden 8px×8px (h-2 w-2) rounded-full chip in the section's chart-N color + <h2 className="text-sm font-medium">{label}</h2> (exactly the locked label from EXPLORE_SECTIONS); the humor line as <p className="text-xs text-muted-foreground">{humor}</p> (may wrap, never truncate — full text must stay readable); the placeholder body: aria-hidden Skeleton lines from '@/components/ui/skeleton' — two h-3 lines w-3/4 and w-1/2, plus a third h-3 w-2/3 when extraLine (the wide About panel gets 3 lines, UI-SPEC §6). NON-INTERACTIVE pinned (UI-SPEC §17.6): no hover: class, no cursor-pointer, no tabIndex — a hover affordance would promise navigation that does not exist until later phases.
      3. Rewrite src/components/explore/explore-panels.tsx to the full grid (UI-SPEC §6): <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"> mapping EXPLORE_SECTIONS in order, passing each section's accent (fixed mapping About=chart-1 … Contact=chart-5, same as the drawer) and humor from EXPLORE_PANEL_HUMOR. About spans both wider layouts: className addition md:col-span-2 lg:col-span-2 on the about panel only — natural DOM order then yields [about about] [experience skills] [projects contact] at md and [about about experience] [skills projects contact] at lg (verified placement, UI-SPEC §6). The main area's p-4 md:p-6 padding already lands via ExploreShell in plan 01 — full-bleed, no max-width container.
      4. Do NOT wire any real content, charts, or visited-count tracking — those are phases 2–4 (deferred register); the status-bar counter stays the plan-01 static '0/5' (D-03).
    </action>
    <verify>npm run typecheck && npm run build && test -f out/explore.html && for s in about experience skills projects contact; do grep -q "id=\\"$s\\"" out/explore.html || exit 1; done && grep -q "experience.render() — pending" out/explore.html && grep -q "col-span-2" src/components/explore/explore-panels.tsx && test $(grep -c "hover:" src/components/explore/panel-placeholder.tsx) -eq 0 && grep -q "Skeleton" src/components/explore/panel-placeholder.tsx</verify>
    <acceptance_criteria>
      - `out/explore.html` contains all five section ids (grep for id="about" … id="contact" each exits 0 — stable anchor targets for the drawer)
      - `grep -q "experience.render() — pending" out/explore.html` exits 0 (humor copy server-rendered, D-06); all five humor strings present (grep each)
      - `grep -q "md:col-span-2\|lg:col-span-2" src/components/explore/explore-panels.tsx` exits 0 (About spans at md/lg, EXPLORE-06 grid)
      - `grep -c "hover:" src/components/explore/panel-placeholder.tsx` outputs 0 (panels non-interactive — pinned)
      - `grep -q "bg-chart-" src/components/explore/explore-panels.tsx` exits 0 (per-section accent chips)
      - Observable: 375px → 1 column; 768px → 2 columns with About spanning both; 1440px → 3 columns with About spanning 2; no horizontal overflow at 375px (EXPLORE-06)
    </acceptance_criteria>
    <done>All five panels render the full §6 anatomy with stable ids, per-section chart accents, the locked humor lines, and Skeleton bodies in the responsive grid — static and hover-inert, building into out/explore.html with all copy visible.</done>
  </task>

  <task type="auto">
    <name>Task 3: Typewriter intro from real data + reduced-motion fallback + final phase sweep (D-07, EXPLORE-01)</name>
    <files>src/components/explore/explore-intro.tsx, src/app/explore/page.tsx</files>
    <read_first>.planning/phases/EXPLORE-01-explore-shell/EXPLORE-01-explore-shell-UI-SPEC.md (§4, §12, §13, §15), src/components/cli/TypingEffect.tsx, src/app/explore/page.tsx</read_first>
    <action>
      1. Create src/components/explore/explore-intro.tsx ("use client"): export function ExploreIntro({ name, title }: { name: string; title: string }). Render an sr-only <h1> holding the FULL `${name} — ${title}` text — server-rendered into the static HTML, doubling as the screen-reader and no-JS source (UI-SPEC §4/§13). Next to it the visual strip: <span aria-hidden> containing a "❯" prefix span in text-accent (aria-hidden decorative) and the animated span, which renders EMPTY in static HTML and fills client-side (accepted pinned tradeoff — do not server-render full text into the visible span, it would flash empty-then-type on hydration; UI-SPEC §4). The animated span wraps <TypingEffect text={`${name} — ${title}`} speed={30} delay={400} /> imported from '@/components/cli/TypingEffect' — REUSE per D-07; do NOT modify that file (CLI reuse protection, UI-SPEC §4: its pulsing "_" cursor disappears on completion — leave it so).
      2. Reduced motion (D-07, UI-SPEC §12): in a mount effect, check window.matchMedia("(prefers-reduced-motion: reduce)").matches ONCE; if reduced, render the static full text span in place of TypingEffect — the component is not rendered at all under reduce. The check runs before the 400ms delay fires, so no characters type under reduced motion.
      3. No layout shift: the strip container reserves height — className includes min-h-[40px] md:min-h-[20px] (px arbitrary values immune to the ≤640px html{font-size:14px} rem shrink; text-sm line-height = 20px/line; the 57-char string wraps to two lines at 375px) — plus shrink-0 px-4 text-sm border-b (UI-SPEC §2.1/§4). Runs once per mount; no persistence, no replay.
      4. Edit src/app/explore/page.tsx: insert <ExploreIntro name={portfolioData.about.name} title={portfolioData.about.title} /> between <ExploreHeader …/> and the main scroll container, INSIDE ExploreShell (region order per UI-SPEC §1: header → typewriter strip → panel grid → status bar).
      5. Final sweep (no code change): re-run the full build; confirm the three landing routes are all still emitted and the CLI surface is untouched (see verify).
    </action>
    <verify>npm run typecheck && npm run build && test -f out/explore.html && test -f out/index.html && test -f out/resume.html && grep -q "<h1" out/explore.html && grep -q "prefers-reduced-motion" src/components/explore/explore-intro.tsx && grep -q "TypingEffect" src/components/explore/explore-intro.tsx && grep -q "Anastasios Tilsizoglou" out/explore.html && grep -q "0/5 sections visited" out/explore.html && test -z "$(git diff --name-only | grep -E 'src/app/\(main\)/|src/components/cli/|src/app/resume/|src/components/ui/sheet.tsx')"</verify>
    <acceptance_criteria>
      - `grep -q "TypingEffect" src/components/explore/explore-intro.tsx` exits 0 AND `git diff src/components/cli/TypingEffect.tsx` is empty (CLI component reused unmodified — D-07)
      - `grep -q "prefers-reduced-motion" src/components/explore/explore-intro.tsx` exits 0 (static fallback — UI-SPEC §12)
      - `grep -q "<h1" out/explore.html` exits 0 with the full name—title inside the sr-only h1 (a11y + no-JS contract)
      - `grep -q "min-h-\[40px\]" src/components/explore/explore-intro.tsx` exits 0 (reserved height, no layout shift)
      - `test -f out/explore.html && test -f out/index.html && test -f out/resume.html` — all three routes emitted by the export
      - `git diff --name-only | grep -E 'src/app/\(main\)/|src/components/cli/|src/app/resume/|src/components/ui/sheet.tsx'` outputs nothing (CLI + resume + sheet untouched — D-10, §17.2)
      - `npm run typecheck` and `npm run build` exit 0
    </acceptance_criteria>
    <done>The shell is complete: header → typewriter strip (real name—title, reduced-motion-safe, sr-only duplicate) → drawer → five placeholder panels → status bar. The full phase build is green across all three routes with zero edits to the CLI, /resume, or sheet.tsx.</done>
  </task>
</tasks>