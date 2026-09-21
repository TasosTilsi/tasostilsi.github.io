---
phase: 02-explore-content
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/explore/panel-shell.tsx
  - src/components/explore/sections/about-section.tsx
  - src/components/explore/sections/contact-section.tsx
  - src/components/explore/sections/experience-section.tsx
  - src/components/explore/sections/terminal-pointer.tsx
  - src/components/explore/explore-panels.tsx
  - src/app/explore/page.tsx
  - src/components/explore/panel-placeholder.tsx
autonomous: true
requirements: ["EXPLORE-03", "EXPLORE-07"]
user_setup: []
must_haves:
  truths:
    - "On /explore the About panel shows the real about.description (it opens 'Aspiring Test Solutions Architect'), the title 'Senior Software Engineer in Test' beside a Briefcase icon, and the location 'Thessaloniki, Greece' beside a MapPin icon — no profile photo, no humor line, no skeleton (per D-05, D-06)."
    - "The Contact panel shows the 'Full resume' row FIRST (text-accent, FileText + ArrowRight icons, border, min-h-[44px], same-tab via next/link to /resume), then a divider, then all 9 channel rows in JSON key order (Email, LinkedIn, GitHub, Medium, Facebook, Instagram, Twitter, Twitch, Portfolio), each with its lucide icon, capitalized chrome label, and the URL exactly as stored; email is a mailto: link, the 8 external channels open in a new tab with rel=noopener noreferrer (per D-03, UI-SPEC §8)."
    - "The Experience panel shows exactly 3 roles (Chubb, Upstream Systems, Netcompany-Intrasoft — the 4th entry 'Smartup PCC' is absent) in JSON order as a vertical timeline with a continuous rail and bg-chart-2 dots, each role showing title, company, duration as stored (dash style NOT normalized), the full street-address location, and up to 3 bullet responsibilities; the static pointer '// more: experience --all in the terminal' closes the panel (per D-01, D-02, UI-SPEC §5)."
    - "The About and Contact panels carry NO terminal pointer (per D-02 — no matching CLI command)."
    - "Until plan 02 lands, the Skills and Projects panels still render the phase-1 placeholder body (humor line + 2 skeleton lines) inside the new PanelShell chrome — no blank or broken panels mid-phase."
    - "Panel chrome (accent chip + label header row, rounded-md border bg-card p-4) and the outer grid (1/2/3 cols, About span-2) are byte-identical to phase 1; panels grow, main scrolls, no internal scroll, no hover affordance on panel containers (UI-SPEC §3, §17.1/§17.6)."
    - "375px: no horizontal scroll — content text wraps, never truncates (no truncate / line-clamp-* / whitespace-nowrap anywhere in the new code)."
  artifacts:
    - path: "src/components/explore/panel-shell.tsx"
      provides: "Shared panel chrome: <section id aria-label> + accent chip + label header row + mt-3 body slot — byte-identical to the phase-1 shell (UI-SPEC §2/§3)"
      min_lines: 35
      exports: ["PanelShell"]
    - path: "src/components/explore/sections/about-section.tsx"
      provides: "About body: description paragraph + Briefcase/MapPin meta row, text-only, from data props (UI-SPEC §4, D-05)"
      min_lines: 35
      exports: ["AboutSection"]
    - path: "src/components/explore/sections/contact-section.tsx"
      provides: "Contact body: prominent Full resume → /resume row + divider + 9 channel rows with the ordered icon/label channel table (UI-SPEC §8, D-03)"
      min_lines: 90
      exports: ["ContactSection"]
    - path: "src/components/explore/sections/experience-section.tsx"
      provides: "Experience body: top-3 vertical timeline (rail + dots), ≤3 bullets per role with graceful-hide, terminal pointer (UI-SPEC §5, D-01, D-02)"
      min_lines: 70
      exports: ["ExperienceSection"]
    - path: "src/components/explore/sections/terminal-pointer.tsx"
      provides: "Shared static terminal-pointer chrome: '// more: <command> in the terminal' with accent command token — not a link (UI-SPEC §9, D-02)"
      min_lines: 20
      exports: ["TerminalPointer"]
  key_links:
    - from: "src/app/explore/page.tsx"
      to: "src/components/explore/explore-panels.tsx"
      via: "page passes the imported portfolioData JSON as the data prop (server → server, SSG-safe; UI-SPEC §2 data flow)"
      pattern: 'data=\{portfolioData\}'
    - from: "src/components/explore/explore-panels.tsx"
      to: "src/components/explore/sections/about-section.tsx"
      via: "SECTION_BODIES registry maps the about section id to an adapter closure rendering AboutSection with data.about (per-section slice props)"
      pattern: "sections/about-section"
    - from: "src/components/explore/explore-panels.tsx"
      to: "src/components/explore/sections/contact-section.tsx"
      via: "SECTION_BODIES adapter closure contact: ({ data }) => <ContactSection contact={data.about.contact} />"
      pattern: "sections/contact-section"
    - from: "src/components/explore/explore-panels.tsx"
      to: "src/components/explore/sections/experience-section.tsx"
      via: "SECTION_BODIES adapter closure experience: ({ data }) => <ExperienceSection experience={data.experience} />"
      pattern: "sections/experience-section"
    - from: "src/components/explore/sections/contact-section.tsx"
      to: "src/app/resume/page.tsx"
      via: "next/link <Link href=\"/resume\"> — the only outbound navigation of phase 2 (D-03)"
      pattern: 'href="/resume"'
    - from: "src/components/explore/sections/experience-section.tsx"
      to: "src/components/explore/sections/terminal-pointer.tsx"
      via: "Experience renders <TerminalPointer command=\"experience --all\" /> after the timeline (UI-SPEC §9)"
      pattern: "<TerminalPointer"
---

<objective>
Make three of the five /explore panels (About, Contact, Experience) render real, data-driven content from portfolio-main-data.json, and establish the shared chrome this phase's remaining work reuses: a PanelShell (byte-identical phase-1 chrome + body slot), a shared static TerminalPointer, and the page → panels → sections data flow as typed props. Skills and Projects keep their phase-1 placeholder bodies inside the new chrome until plan 02 swaps them. This plan implements D-01 (Experience caps), D-02 (static pointers on Experience only among these), D-03 (Full resume link), D-04 (fresh IDE-native section components), D-05 (About text-only), D-06 (humor replaced by real content), D-07 (all copy from the JSON via PortfolioData), D-08 (no new deps, SSG, 375px invariant) for its three panels (EXPLORE-03, EXPLORE-07).
</objective>

<assumption_delta_decision>
- Noun now primary: the per-role responsibilities bullet list — a variable-length list (0..N strings) capped at 3, replacing the fixed "exactly 3 highlights" reading as the structural assumption.
- Decision: promote. The renderer treats responsibilities as a variable-length list — `(entry.responsibilities ?? []).slice(0, 3)` — where 3 is a cap parameter, not a shape assumption; "exactly 3" is merely the common instance the current data hits (top-3 roles carry 7/3/3 responsibilities). Rationale: the JSON array is already variable-length and UI-SPEC §11 mandates render-what-exists with no padding and no invented copy, so a separate fixed-3 fallback path would be dead machinery. No accepted debt.
- Invariant companion (no test runner exists in this repo — static assertions only): every confirmed default (7/3/3 bullets across the top-3 roles) round-trips through the primary use-path and is asserted in out/explore.html by this plan's build greps; the shorter/empty variants render what exists (§11) and are enforced as a code-shape contract in the task action (no padding loops, no fixed-count rendering).
- Related promotion recorded for the phase: the data-driven panel-body render path (cap + graceful-hide semantics) is the ONE render path for all five panels; the placeholder render path is demoted to a transitional private body in this plan (PlaceholderBody in explore-panels.tsx) and deleted outright by plan 02 task 3 (D-06 + EXPLORE-07 mandate replacement, not coexistence; UI-SPEC §2 permits the deletion). No add-alongside debt.
</assumption_delta_decision>

<verification_protocol>
This repo has no test runner (package.json defines no test script — verified). Red/green discipline therefore runs on the acceptance assertions themselves: for each task, FIRST run the task's verify commands against the current source tree and out/explore.html and record the failing (red) state of every assertion that pins NEW behaviour — e.g. presence greps against section files that do not exist yet, the per-panel humor-token eliminations (about.profile.load, contact.establish_link, experience.render), and the flight-doubled global "— pending" counts (10 → 8 → 6 → 4 across this plan's tasks). DOUBLING (empirically verified against the phase-1 build this session): every rendered TEXT string inside the server-rendered children (the ExplorePanels output) appears exactly twice in the static export — once in the SSR markup, once in the inlined RSC flight payload (self.__next_f.push rows; measured: "— pending" = 10, each per-panel humor token = 2). Attribute-syntax strings (e.g. target="_blank") appear ONLY in the SSR markup — the flight payload serializes props as escaped JSON (\"target\":\"_blank\"), which a plain-quote attribute grep does not count (measured on aria-label inside the server-children region). Client-component-internal strings (e.g. "Portfolio sections" on <main>) appear once. Assertions reading == 0 are immune to the doubling (0 × 2 = 0). Assertions that already pass without the change (e.g. cap-exclusion greps like "Smartup PCC" == 0 — the placeholder never rendered portfolio content) are recorded as pre-green invariants. Then implement, and re-run the SAME commands to record green before committing the task.
PROSE SAFETY (spans both plans): no comment or doc comment in any file under src/components/explore/ may contain the literal tokens PanelPlaceholder, PlaceholderBody, EXPLORE_PANEL_HUMOR, or Skeleton — plan 02 task 3's final dead-code sweep greps the whole directory for them (case-sensitive), and every CODE occurrence is deleted there, so a surviving match could only be a comment. Describe transitional state in lowercase prose ("the transitional placeholder body", "skeleton lines") — the capitalized identifiers are what the sweep matches. Note: the code occurrences of EXPLORE_PANEL_HUMOR and the skeleton import inside PlaceholderBody itself are REQUIRED by this plan's step 3 and are deleted (with the component) by plan 02 task 3.
</verification_protocol>

<context>
@.planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-UI-SPEC.md  — the locked design contract: §2 (what stays/replaced, server components), §3 (shared body contract), §4 (About), §5 (Experience timeline), §8 (Contact), §9 (terminal pointer), §10 (interaction matrix), §11 (graceful-hide), §12 (responsive), §17 (prohibitions). Follow its exact class strings.
@.planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-CONTEXT.md  — locked decisions D-01…D-08; every task below cites the D-NN it implements.
@src/components/explore/panel-placeholder.tsx  — the byte-identical chrome source this plan's PanelShell must reproduce (lines 37-55); the file is deleted by task 1.
@src/components/explore/explore-panels.tsx  — the wiring file: locked grid classes, ACCENTS map, About span. Its EXISTING doc comment (lines 1-18) names the placeholder component/constant/skeleton import — task 1 rewrites it prose-safe.
@src/components/explore/constants.ts  — EXPLORE_SECTIONS / ExploreSectionId / EXPLORE_PANEL_HUMOR (the humor constant is deleted by plan 02, not here).
@src/app/explore/page.tsx  — server page already importing portfolioData; add the data prop here.
@src/components/explore/explore-shell.tsx  — main is the ONLY scroll container; server-rendered children pass through untouched.
@src/data/portfolio-main-data.d.ts  — PortfolioData / ExperienceEntry types; contact channel optionality (email/linkedin/github/medium required; portfolio/facebook/instagram/twitter/twitch optional).
@src/data/portfolio-main-data.json  — about (description/title/location + 9 contact channels), experience[0..2] (Chubb 7 responsibilities, Upstream 3, Netcompany-Intrasoft 3; em-dash durations; full street addresses).
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — PanelShell + data spine + About body wired end-to-end</name>
    <files>src/components/explore/panel-shell.tsx, src/components/explore/sections/about-section.tsx, src/components/explore/explore-panels.tsx, src/app/explore/page.tsx, src/components/explore/panel-placeholder.tsx</files>
    <read_first>src/components/explore/panel-placeholder.tsx, src/components/explore/explore-panels.tsx, src/app/explore/page.tsx, src/data/portfolio-main-data.d.ts, .planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-UI-SPEC.md (§2, §3, §4, §11, §17)</read_first>
    <action>
      1. Create src/components/explore/panel-shell.tsx — a server component (NO "use client", no hooks; `import type { ReactNode } from 'react'` and `import type { ExploreSectionId } from './constants'`) exporting `PanelShell({ id, label, accent, className, children }: { id: ExploreSectionId; label: string; accent: string; className?: string; children: ReactNode })`. Render byte-identical to the shell part of panel-placeholder.tsx:37-49: `<section id={id} aria-label={label} className={...rounded-md border bg-card p-4 + optional className}>` → header row `<div className="flex items-center gap-2">` containing `<span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${accent}`} />` + `<h2 className="text-sm font-medium">{label}</h2>` → body slot `<div className="mt-3">{children}</div>` (UI-SPEC §3: mt-3 is the first body gap). Keep the className-composition style of the placeholder (template literal + conditional space). Non-interactive pinned chrome: no hover, no cursor, not focusable (§17.6). Doc comment (prose-safe per the verification_protocol rule — name NONE of the four sweep tokens): describe the shared chrome as byte-identical to the phase-1 shell with a body slot, and note the transitional placeholder body lives in explore-panels.tsx until plan 02 task 3 removes it.
      2. Create src/components/explore/sections/about-section.tsx — server component exporting `AboutSection({ about }: { about: PortfolioData['about'] })`, typed via `import type { PortfolioData } from '@/data/portfolio-main-data'` (repo convention, per D-07). Body per UI-SPEC §4 (D-05 text-only — profileImageUrl and about.dob unused; no name repetition — header bar + intro strip carry it; no pointer per D-02): `<p className="text-sm leading-relaxed text-foreground">{about.description}</p>`; meta row `<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">` with item 1 = `<Briefcase aria-hidden="true" className="h-3.5 w-3.5" />` (from 'lucide-react') + `<span>{about.title}</span>`, item 2 = `<MapPin aria-hidden="true" className="h-3.5 w-3.5" />` + `<span>{about.location}</span>`. Graceful-hide (§11): render each meta item only when its string is non-empty; invent no fallback copy (EXPLORE-07). No truncation classes.
      3. Rewrite src/components/explore/explore-panels.tsx (per UI-SPEC §2 "shared panel wrapper" shape):
         a. Keep the outer grid div `className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"` BYTE-IDENTICAL (§17.1), keep the ACCENTS record and the About span ('md:col-span-2 lg:col-span-2') byte-identical.
         b. Add prop `data: PortfolioData` (typed via `import type { PortfolioData } from '@/data/portfolio-main-data'`, per D-07) and `import type { ComponentType } from 'react'`.
         c. Introduce `const SECTION_BODIES: Partial<Record<ExploreSectionId, ComponentType<{ data: PortfolioData }>>>` whose entries are ADAPTER CLOSURES mapping the whole PortfolioData to the section's slice prop — the pinned form is `about: ({ data }) => <AboutSection about={data.about} />` (section components take per-section slice props, so a bare `{ about: AboutSection }` literal would not typecheck; adapters keep the data flow server-side and SSG-safe; the remaining four entries are registered by task 2, task 3, and plan 02 the same way).
         d. Map EXPLORE_SECTIONS as before, rendering each section as `<PanelShell id label accent className>` whose children are `<Body data={data} />` when a body is registered, else `<PlaceholderBody id={section.id} />` — a PRIVATE component in this file reproducing the phase-1 placeholder body EXACTLY: `<p className="mt-1 text-xs text-muted-foreground">{EXPLORE_PANEL_HUMOR[id]}</p>` + `<div aria-hidden="true" className="mt-3 space-y-2">` containing `<Skeleton className="h-3 w-3/4" />` and `<Skeleton className="h-3 w-1/2" />` (the extra third line was About-only and About is wired now — always 2 lines). Keep the EXPLORE_PANEL_HUMOR import and add `import { Skeleton } from '@/components/ui/skeleton'` (both transitional — plan 02 task 3 removes them). Mark PlaceholderBody with a doc comment noting it is transitional and removed by plan 02 task 3, worded WITHOUT the sweep tokens per the prose-safety rule.
         e. Rewrite this file's existing doc comment (lines 1-18 currently name the placeholder component, the humor constant, and the skeleton import) to describe the new anatomy — locked grid, ACCENTS, SECTION_BODIES registry, PanelShell chrome, transitional body for the not-yet-wired panels — in wording that contains NONE of the four sweep tokens (code occurrences of EXPLORE_PANEL_HUMOR/Skeleton stay until plan 02 task 3; comments must not carry them).
      4. Delete src/components/explore/panel-placeholder.tsx (its only importer was explore-panels.tsx — verified by grep; chrome moves to PanelShell, body to PlaceholderBody; UI-SPEC §2/§17.12 permits this).
      5. Update src/app/explore/page.tsx: render `<ExplorePanels data={portfolioData} />` and update the doc comment's composition line so it describes the new data flow (page → panels → sections as typed props).
      6. Run npm run typecheck && npm run build.
    </action>
    <verify>
      npm run typecheck && npm run build (exit 0; output: 'export' regenerates out/explore.html)
      test ! -f src/components/explore/panel-placeholder.tsx
      grep -cF "rounded-md border bg-card p-4" src/components/explore/panel-shell.tsx   # 1
      grep -cF "h-2 w-2 shrink-0 rounded-full" src/components/explore/panel-shell.tsx   # 1
      grep -cF "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" src/components/explore/explore-panels.tsx   # 1
      grep -cF "md:col-span-2 lg:col-span-2" src/components/explore/explore-panels.tsx   # 1
      grep -oF "Thessaloniki, Greece" out/explore.html | wc -l   # >= 1 (about.location rendered; flight-doubled)
      grep -oF "Aspiring Test Solutions Architect" out/explore.html | wc -l   # >= 1 (about.description rendered)
      grep -oF "about.profile.load" out/explore.html | wc -l   # 0 (About humor replaced per D-06 — red state reads 2: SSR markup + flight payload)
      grep -oF "— pending" out/explore.html | wc -l   # 8 (4 transitional placeholder bodies × 2; phase-1 baseline measured at 10)
      grep -rn "truncate\|line-clamp-\|whitespace-nowrap" src/components/explore/sections/ | wc -l   # 0
      grep -rn "profileImageUrl" src/components/explore/sections/ | wc -l   # 0 (D-05)
      grep -rn "use client" src/components/explore/panel-shell.tsx src/components/explore/sections/ | wc -l   # 0 (server components, §2)
    </verify>
    <acceptance_criteria>
      - npm run typecheck and npm run build both exit 0; out/explore.html is regenerated by the build
      - grep -oF "Thessaloniki, Greece" out/explore.html | wc -l is >= 1 AND grep -oF "Aspiring Test Solutions Architect" out/explore.html | wc -l is >= 1 (About shows real description + location)
      - "about.profile.load" appears 0 times in out/explore.html (About's humor line replaced per D-06; the red state reads 2 — one SSR markup occurrence + one inlined RSC flight payload); the global "— pending" occurrence count is exactly 8 at this point (4 transitional placeholder bodies × 2, flight-doubled)
      - src/components/explore/panel-placeholder.tsx does not exist; src/components/explore/panel-shell.tsx exists exporting PanelShell with "rounded-md border bg-card p-4" and "h-2 w-2 shrink-0 rounded-full" present exactly once each
      - src/components/explore/explore-panels.tsx still contains the byte-identical grid classes and About span, imports ./sections/about-section, and registers the about entry as the adapter closure ({ data }) => <AboutSection about={data.about} />; its doc comment contains none of the sweep tokens (PanelPlaceholder / PlaceholderBody / EXPLORE_PANEL_HUMOR / Skeleton)
      - grep over src/components/explore/sections/ finds zero truncate / line-clamp-* / whitespace-nowrap occurrences and zero profileImageUrl references; zero "use client" in panel-shell.tsx or sections/
    </acceptance_criteria>
    <done>About panel renders real data-driven content inside byte-identical chrome; ExplorePanels receives data from the page; the four unwired panels still render the complete phase-1 placeholder body inside PanelShell (no blank panels mid-phase); typecheck and static build pass.</done>
  </task>

  <task type="auto">
    <name>Task 2: Contact body — Full resume row + 9 channel rows</name>
    <files>src/components/explore/sections/contact-section.tsx, src/components/explore/explore-panels.tsx</files>
    <read_first>src/data/portfolio-main-data.json (about.contact — 9 channels in key order), src/data/portfolio-main-data.d.ts (contact optionality), .planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-UI-SPEC.md (§8, §10, §11, §14, §17.4)</read_first>
    <action>
      1. Create src/components/explore/sections/contact-section.tsx — server component (NO "use client") exporting `ContactSection({ contact }: { contact: PortfolioData['about']['contact'] })` (type per D-07 convention; `import Link from 'next/link'`, icons + `import type { LucideIcon } from 'lucide-react'` — the type is exported by lucide-react 0.475.0, verified).
      2. Resume row FIRST and prominent (per D-03, UI-SPEC §8.1): `<Link href="/resume" className="group flex min-h-[44px] items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">` containing `<FileText aria-hidden="true" className="h-4 w-4" />`, `<span className="group-hover:underline">Full resume</span>`, `<ArrowRight aria-hidden="true" className="h-4 w-4" />`. Internal route → SAME TAB: no target attribute (the locked phrase 'Full resume →' is realized as label + arrow icon). This is the only outbound navigation of phase 2.
      3. Divider `<div className="my-3 border-t border-border" />`.
      4. Channel rows — ALL 9 channels in JSON key order (email, linkedin, github, medium, facebook, instagram, twitter, twitch, portfolio). Define ONE ordered table (allowed chrome literals per UI-SPEC §17.4): `const CHANNELS: ReadonlyArray<{ key: keyof PortfolioData['about']['contact']; label: string; Icon: LucideIcon }>`, 9 entries in the order above with labels Email, LinkedIn, GitHub, Medium, Facebook, Instagram, Twitter, Twitch, Portfolio and icons Mail, Linkedin, Github, PenLine (no Medium brand icon exists in lucide 0.475.0 — verified), Facebook, Instagram, Twitter, Twitch, Globe. The keyof typing makes the keyset exhaustive at compile time. Iterate CHANNELS; graceful-hide (§11): a channel whose data value is missing/empty renders NO row and invents no copy.
      5. Row anatomy (UI-SPEC §8.3), one anchor template for all rows: `<a key={channel.key} {...(channel.key === 'email' ? { href: `mailto:${value}` } : { href: value, target: '_blank', rel: 'noopener noreferrer' })} className="flex min-h-[44px] items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">` — email row → mailto: href with NO target (mailto is not a new-tab external); external channels → new tab + rel="noopener noreferrer". Inside: `<channel.Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />` + `<span className="min-w-0 flex-1"><span className="block text-sm text-foreground group-hover:underline">{channel.label}</span><span className="block break-all text-xs text-muted-foreground">{value}</span></span>`. The value line shows the stored string EXACTLY (data fidelity — no protocol repair, §11; the http:// links render as stored); `break-all` keeps 37+ char URLs from forcing horizontal scroll (375px invariant, 309px panel content width). Row text doubles as the accessible name — no aria-label overrides (§14). Hover: label underlines only (§8).
      6. NO TerminalPointer in this component (per D-02 — no matching CLI command). No "use client". No truncation classes.
      7. Register contact via the adapter closure `contact: ({ data }) => <ContactSection contact={data.about.contact} />` in SECTION_BODIES in src/components/explore/explore-panels.tsx (adapter-closure registry form pinned in task 1 step 3c). Run npm run typecheck && npm run build.
    </action>
    <verify>
      npm run typecheck && npm run build (exit 0)
      grep -cF 'href="/resume"' src/components/explore/sections/contact-section.tsx   # 1 (D-03, only outbound link)
      grep -oF 'target="_blank"' src/components/explore/sections/contact-section.tsx | wc -l   # 1 (occurrence semantics: ONE external-row anchor template in source; 8 anchors at runtime)
      grep -oF 'rel="noopener noreferrer"' src/components/explore/sections/contact-section.tsx | wc -l   # 1 (same single template)
      grep -cF "mailto:" src/components/explore/sections/contact-section.tsx   # 1
      grep -cF "PenLine" src/components/explore/sections/contact-section.tsx   # 1 (Medium substitute — no Medium brand icon exists)
      grep -cF "Globe" src/components/explore/sections/contact-section.tsx   # 1 (portfolio channel)
      grep -n "TerminalPointer" src/components/explore/sections/contact-section.tsx | wc -l   # 0 (D-02)
      grep -oF 'target="_blank"' out/explore.html | wc -l   # 8 (8 external channels in the SSR markup; the flight payload serializes the prop as escaped JSON, which this attribute-syntax grep does not count)
      grep -oE "protonmail\.com|linkedin\.com|github\.com|medium\.com|facebook\.com|instagram\.com|twitter\.com|twitch\.tv|tasostilsi\.github\.io" out/explore.html | sort -u | wc -l   # == 9 (all channels rendered from data)
      grep -oF "Full resume" out/explore.html | wc -l   # >= 1
      grep -oF "contact.establish_link" out/explore.html | wc -l   # 0 (Contact humor replaced per D-06 — red state reads 2: flight-doubled)
      grep -oF "— pending" out/explore.html | wc -l   # 6 (3 transitional placeholder bodies × 2)
    </verify>
    <acceptance_criteria>
      - npm run typecheck and npm run build both exit 0
      - contact-section.tsx contains exactly one href="/resume" (D-03), exactly one mailto:, exactly ONE target="_blank" occurrence and ONE rel="noopener noreferrer" occurrence in source (the single external-row anchor template — 8 anchors render at runtime), one PenLine and one Globe icon reference, and zero TerminalPointer references (D-02)
      - out/explore.html contains all 9 contact values from the JSON (the 9-pattern grep | sort -u | wc -l equals 9), at least one "Full resume", and exactly 8 runtime target="_blank" occurrences (one per external channel in the SSR markup) — "one template in source, eight runtime anchors"
      - "contact.establish_link" appears zero times in out/explore.html (humor replaced per D-06; the red state reads 2 — flight-doubled); the global "— pending" occurrence count is exactly 6 at this point (3 transitional bodies × 2)
      - every anchor in contact-section.tsx carries the focus-visible ring classes per UI-SPEC §14; channel rows and the resume row are min-h-[44px] real px
    </acceptance_criteria>
    <done>Contact panel shows the prominent same-tab Full resume → /resume row first, then all 9 channel rows with icons, capitalized chrome labels and as-stored values (email as mailto, 8 externals new-tab); no pointer on Contact; static build passes.</done>
  </task>

  <task type="auto">
    <name>Task 3: TerminalPointer chrome + Experience timeline body</name>
    <files>src/components/explore/sections/terminal-pointer.tsx, src/components/explore/sections/experience-section.tsx, src/components/explore/explore-panels.tsx</files>
    <read_first>src/data/portfolio-main-data.json (experience[0..2]), src/data/portfolio-main-data.d.ts (ExperienceEntry.responsibilities optional), .planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-CONTEXT.md (D-01, D-02), .planning/phases/EXPLORE-02-explore-content/EXPLORE-02-explore-content-UI-SPEC.md (§5, §9, §11, §17.6)</read_first>
    <action>
      1. Create src/components/explore/sections/terminal-pointer.tsx — exporting `TerminalPointer({ command }: { command: string })`, static styled chrome per D-02 + UI-SPEC §9: `<p className="mt-4 text-xs text-muted-foreground">{'// more: '}<span className="text-accent">{command}</span>{' in the terminal'}</p>`. It is NOT a link: no <a>, no hover/pointer classes, not focusable, and NOT aria-hidden (meaningful chrome text that may wrap at 375px). Doc comment records that phase 5 may make it interactive — behaviour stays static now (deferred idea, do not implement).
      2. Create src/components/explore/sections/experience-section.tsx — server component (NO "use client") exporting `ExperienceSection({ experience }: { experience: PortfolioData['experience'] })` (type per D-07).
      3. Cap per D-01: `const roles = experience.slice(0, 3)` — first 3 entries in JSON order, NO sorting and NO isTechRelated filter (the array is reverse-chronological; verified [0] = Chubb, Sept 2023 — Present; the Resume* filter pattern must not leak in). If roles.length === 0 render nothing at all — no timeline, no pointer, no "no entries" copy (UI-SPEC §11).
      4. Timeline anatomy EXACTLY per UI-SPEC §5 (D-04 git-log feel): `<ol className="relative space-y-5 border-l border-border">` (continuous rail, no pl on the ol); per role `<li className="relative pl-4">` containing: dot `<span aria-hidden="true" className="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-chart-2" />`; `<h3 className="text-sm font-medium text-foreground">{title}</h3>`; `<p className="mt-0.5 text-xs text-foreground">{company}</p>`; `<p className="text-xs text-muted-foreground tabular-nums">{duration}</p>` — duration rendered AS STORED, dash style NOT normalized (top-3 durations all use spaced em dash); `<p className="text-xs text-muted-foreground">{location}</p>` — the FULL street address exactly as stored, wrapping freely (D-01 strict data fidelity).
      5. Bullets (the promoted variable-length model, per assumption_delta_decision): `const bullets = (entry.responsibilities ?? []).slice(0, 3)`; render `<ul className="mt-2 space-y-1.5 list-disc pl-4 marker:text-muted-foreground">` with `<li className="text-xs leading-relaxed text-muted-foreground">{bullet}</li>` only when bullets.length > 0 — fewer than 3 responsibilities renders what exists, absent/empty omits the whole ul (D-01 fallback per CONTEXT discretion + §11; no padding, no invented copy). No fixed-count rendering anywhere.
      6. After the closing ol tag: `<TerminalPointer command="experience --all" />` (per D-02, UI-SPEC §9). All timeline elements are static — no hover/press/cursor affordance anywhere (§17.6). No "use client". No truncation classes.
      7. Register experience via the adapter closure `experience: ({ data }) => <ExperienceSection experience={data.experience} />` in SECTION_BODIES (adapter-closure registry form pinned in task 1 step 3c). Run npm run typecheck && npm run build.
    </action>
    <verify>
      npm run typecheck && npm run build (exit 0)
      grep -cF "border-l border-border" src/components/explore/sections/experience-section.tsx   # 1 (continuous rail)
      grep -cF -- "-left-[4px]" src/components/explore/sections/experience-section.tsx   # 1 (dot on rail)
      grep -cF "experience.slice(0, 3)" src/components/explore/sections/experience-section.tsx   # 1 (D-01 role cap)
      grep -cF "(entry.responsibilities ?? []).slice(0, 3)" src/components/explore/sections/experience-section.tsx   # 1 (D-01 bullet cap over the variable-length list)
      grep -oF "Smartup PCC" out/explore.html | wc -l   # == 0 (4th entry excluded — cap holds; pre-green invariant, the placeholder never rendered it)
      grep -oE "Chubb|Upstream Systems|Netcompany-Intrasoft" out/explore.html | sort -u | wc -l   # == 3 (exactly the top-3 roles)
      grep -oF "Leof. Georgikis Scholis 27" out/explore.html | wc -l   # >= 1 (full street address as stored)
      grep -cF "tabular-nums" src/components/explore/sections/experience-section.tsx   # 1 (duration styling)
      grep -oF "experience --all" out/explore.html | wc -l   # >= 1 (pointer command token, per D-02)
      grep -cF "text-accent" src/components/explore/sections/terminal-pointer.tsx   # 1 (accent command token)
      grep -cn "<a" src/components/explore/sections/terminal-pointer.tsx | grep -v ":0" | wc -l   # 0 lines with an anchor (static chrome, not a link)
      grep -oF "experience.render" out/explore.html | wc -l   # 0 (Experience humor replaced per D-06 — red state reads 2: flight-doubled)
      grep -oF "— pending" out/explore.html | wc -l   # 4 (only the Skills + Projects placeholder bodies remain transitionally)
    </verify>
    <acceptance_criteria>
      - npm run typecheck and npm run build both exit 0
      - out/explore.html shows exactly the 3 capped roles: "Chubb", "Upstream Systems", "Netcompany-Intrasoft" present and "Smartup PCC" absent (D-01; the exclusion grep is a pre-green invariant)
      - "Leof. Georgikis Scholis 27" (full street address) appears in out/explore.html unchanged (strict data fidelity); durations render as stored with tabular-nums styling
      - experience-section.tsx contains the rail class "border-l border-border" once and the "-left-[4px]" dot offset once; "experience.slice(0, 3)" appears exactly once (role cap) and "(entry.responsibilities ?? []).slice(0, 3)" exactly once (bullet cap); each role carries title + company + tabular-nums duration + location + up to 3 list-disc bullets
      - "experience --all" appears in out/explore.html (TerminalPointer rendered after the timeline, per D-02); "experience.render" reaches 0 occurrences (red state reads 2 — flight-doubled) and the global "— pending" count is exactly 4 at this point (2 transitional bodies × 2)
      - TerminalPointer emits no anchor element and carries text-accent exactly once (static chrome only)
    </acceptance_criteria>
    <done>Experience panel renders the 3-role vertical timeline with full-address fidelity and the static terminal pointer; the shared TerminalPointer component exists for plan 02's Skills/Projects reuse; typecheck and static build pass.</done>
  </task>
</tasks>