---
phase: 01-explore-shell
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/app/explore/page.tsx
  - src/app/explore/layout.tsx
  - src/components/explore/explore-shell.tsx
  - src/components/explore/constants.ts
  - src/components/explore/use-explore-theme.ts
  - src/components/explore/explore-header.tsx
  - src/components/explore/explore-status-bar.tsx
  - src/app/layout.tsx
  - src/app/globals.css
autonomous: true
requirements: ["EXPLORE-01", "EXPLORE-06"]
user_setup: []
must_haves:
  truths:
    - "Visiting /explore renders a full-viewport IDE shell: 52px header bar (3 window glyphs + real name/title from data), one scrolling panel area, and a bottom status bar reading 'guest@tasostilsi:~/explore' left and 'dark · 0/5 sections visited' right (per D-01, D-03)"
    - "Computed font-family on /explore resolves to JetBrains Mono (self-hosted via next/font, no runtime CDN fetch); CLI pages keep Geist Mono (per D-04, EXPLORE-01c)"
    - "Dark IDE theme renders by default with zero flash; the header toggle switches to a light IDE theme; the choice persists via localStorage key 'portfolio-explore-theme' across reload (per D-05, EXPLORE-01d)"
    - "Shell is h-dvh flex-column with overflow-x-hidden and px-based chrome heights: no horizontal scroll at 375px (EXPLORE-06 foundation)"
    - "npm run build succeeds and the static export emits out/explore.html; out/index.html and out/resume.html are still emitted"
    - "The shell never reads or writes the CLI localStorage key 'portfolio-theme'; the CLI theme self-heals on / because useCliTheme is untouched (D-05, D-10)"
  artifacts:
    - path: "src/app/explore/page.tsx"
      provides: "Server-rendered /explore route composing the IDE shell"
      min_lines: 40
      exports: ["default ExplorePage"]
    - path: "src/app/explore/layout.tsx"
      provides: "Data-driven page metadata + synchronous inline before-paint theme script (flash prevention)"
      min_lines: 30
      exports: ["metadata", "default ExploreLayout"]
    - path: "src/components/explore/explore-shell.tsx"
      provides: "Client boundary owning explore theme state, composing header/main/status bar"
      min_lines: 25
      exports: ["ExploreShell"]
    - path: "src/components/explore/constants.ts"
      provides: "Locked chrome strings: 5 ordered sections, explore theme key, breadcrumb segments"
      min_lines: 25
      exports: ["EXPLORE_SECTIONS", "EXPLORE_THEME_STORAGE_KEY", "EXPLORE_THEME_VALUES"]
    - path: "src/components/explore/use-explore-theme.ts"
      provides: "Hand-rolled dark/light theme hook: class on <html>, localStorage persistence, try/catch safety"
      min_lines: 30
      exports: ["useExploreTheme"]
    - path: "src/components/explore/explore-header.tsx"
      provides: "IDE header bar: window glyphs, truncating data-driven title, 44px theme toggle"
      min_lines: 40
      exports: ["ExploreHeader"]
    - path: "src/components/explore/explore-status-bar.tsx"
      provides: "Status bar: accent breadcrumb + live theme label + static 0/5 counter"
      min_lines: 30
      exports: ["ExploreStatusBar"]
    - path: "src/app/globals.css"
      provides: ".explore-shell scoped dark IDE token block, .light .explore-shell override block, reduced-motion guard"
      min_lines: 60
      exports: []
  key_links:
    - from: "src/app/explore/layout.tsx"
      to: "document.documentElement class before first paint"
      via: "synchronous inline <script dangerouslySetInnerHTML> rendered before {children}; reads portfolio-explore-theme, strips dark/light, applies persisted-or-dark"
      pattern: "classList.remove\\([\"']dark[\"'],\\s*[\"']light[\"']\\)"
    - from: "src/app/layout.tsx"
      to: "src/app/globals.css"
      via: "JetBrains_Mono next/font variable --font-jetbrains consumed by the .explore-shell font-family rule"
      pattern: "var\\(--font-jetbrains\\)"
    - from: "src/data/portfolio-main-data.json"
      to: "out/explore.html static HTML"
      via: "about.name / about.title imported by server components and rendered into the header title and sr-only-safe markup"
      pattern: "about\\.name"
    - from: "src/components/explore/explore-shell.tsx"
      to: "src/components/explore/explore-header.tsx + explore-status-bar.tsx"
      via: "single useExploreTheme state passed as props so toggle and live label share one source of truth"
      pattern: "useExploreTheme"
---

<assumption_delta_decision>
- Noun: "landing page" — the site now has two landing surfaces (CLI terminal at / and the visual /explore).
- Decision: **add-alongside**. The CLI at / remains the primary landing; /explore is added as a second, sibling route (src/app/explore/, NOT inside the (main)/ route group). Rationale: the user's locked constraint "without losing the cli website" (D-10) and the roadmap defers CLI↔/explore routing/toggle to phase 5 — no promotion or replacement of the primary route happens in this phase.
- Accepted debt: until phase 5 (explore-routing), there is no toggle or cross-link between the two landings; visitors reach /explore only by URL. Recorded here so the executor does not "helpfully" add a routing link (that would implement a deferred idea).
- Invariant companion: every supported landing route (/, /resume, /explore) round-trips through the same root layout — the font addition must be additive (Geist variables untouched) and the theme mechanism self-heals per surface (CLI strips/re-applies its classes via useCliTheme; the explore before-paint script strips/re-applies dark/light on every /explore load).
</assumption_delta_decision>

<objective>
Establish the /explore IDE-shell foundation: the route itself with its full-viewport flex-column frame, the scoped dark/light IDE theme system with flash prevention, and JetBrains Mono scoped to /explore only. Delivers the D-01 skeleton (header bar, status bar, first placeholder panel, theme toggle), D-03 status bar, D-04 font scoping, and D-05 hand-rolled theme — verified end-to-end through the static export (out/explore.html). The drawer, the 5-panel grid, and the typewriter arrive in plan 02; nothing in this plan touches src/components/ui/sheet.tsx, src/components/cli/**, src/app/(main)/**, or /resume (D-09, D-10).
</objective>

<context>
@.planning/phases/EXPLORE-01-explore-shell/EXPLORE-01-explore-shell-UI-SPEC.md
@.planning/phases/EXPLORE-01-explore-shell/EXPLORE-01-explore-shell-SPEC.md
@src/app/layout.tsx
@src/app/globals.css
@src/data/portfolio-main-data.json
@src/data/portfolio-main-data.d.ts
@src/components/ui/skeleton.tsx
@src/components/cli/hooks/useCliTheme.ts
@src/app/(main)/layout.tsx
</context>

<tasks>
  <task type="auto">
    <name>Task 1: Tracer — /explore route, IDE frame skeleton, dark token block, status bar (end-to-end through static export)</name>
    <files>src/components/explore/constants.ts, src/app/globals.css, src/app/explore/layout.tsx, src/components/explore/explore-header.tsx, src/components/explore/explore-status-bar.tsx, src/app/explore/page.tsx</files>
    <read_first>.planning/phases/EXPLORE-01-explore-shell/EXPLORE-01-explore-shell-UI-SPEC.md, src/app/layout.tsx, src/app/globals.css, src/data/portfolio-main-data.d.ts, src/components/ui/skeleton.tsx, src/app/(main)/layout.tsx</read_first>
    <action>
      This is the tracer: the thinnest production-quality slice through route → layout → tokens → components → data → build → static export. Do not add the drawer, the 5-panel grid, the typewriter, or the theme toggle here — they arrive in later tasks/plan 02.
      1. Create src/components/explore/constants.ts (plain TS, no "use client" needed): export const EXPLORE_SECTIONS = [{ id: "about", label: "About" }, { id: "experience", label: "Experience" }, { id: "skills", label: "Skills" }, { id: "projects", label: "Projects" }, { id: "contact", label: "Contact" }] as const — this exact order and these exact labels are locked by the SPEC acceptance (D-01). Export type ExploreSectionId = (typeof EXPLORE_SECTIONS)[number]["id"]. Export const EXPLORE_THEME_STORAGE_KEY = "portfolio-explore-theme" and export const EXPLORE_THEME_VALUES = ["dark", "light"] as const — the explore key must never collide with the CLI key "portfolio-theme" (src/components/cli/constants.ts:65; per D-05, D-10). Export const EXPLORE_STATUS_USER = "guest@tasostilsi" and EXPLORE_STATUS_PATH = ":~/explore" (locked chrome strings, UI-SPEC §7).
      2. Append (additive only — do NOT modify the existing :root / .dark / .light / .sepia… token blocks at src/app/globals.css lines 11–130, per D-10 and UI-SPEC §9.1) a `.explore-shell` block defining the dark IDE tokens verbatim from UI-SPEC §9.2: --background: 220 13% 9%; --foreground: 220 12% 84%; --card: 220 12% 12%; --card-foreground: 220 12% 84%; --popover: 220 12% 13%; --popover-foreground: 220 12% 84%; --primary: 215 90% 64%; --primary-foreground: 220 13% 9%; --secondary: 220 10% 17%; --secondary-foreground: 220 12% 84%; --muted: 220 10% 16%; --muted-foreground: 220 8% 60%; --accent: 160 84% 45%; --accent-foreground: 220 13% 9%; --destructive: 0 72% 51%; --destructive-foreground: 0 0% 98%; --border: 220 10% 20%; --input: 220 10% 16%; --ring: 215 90% 64%; --sidebar-background: 220 12% 11%; --sidebar-foreground: 220 10% 78%; --sidebar-primary: 215 90% 64%; --sidebar-primary-foreground: 220 13% 9%; --sidebar-accent: 220 10% 18%; --sidebar-accent-foreground: 220 12% 90%; --sidebar-border: 220 10% 18%; --sidebar-ring: 215 90% 64%; --radius: 0.25rem. Do NOT redefine --chart-1..5, --success, --warning (inherited by proximity rule: values on the shell div shadow the <html>-level CLI classes for all descendants). Note in a CSS comment: "explore IDE tokens — scoped; CLI token blocks above are untouched (D-10)".
      3. Create src/app/explore/layout.tsx as a server component: export const metadata: Metadata with data-driven values (per D-08 and the root pattern at src/app/layout.tsx:20-48): title: `${portfolioData.about.name} | ${portfolioData.about.title} | Visual Portfolio Explorer`, description: portfolioData.meta.description, importing portfolioData from '@/data/portfolio-main-data.json'. Render an inline synchronous before-paint <script dangerouslySetInnerHTML={{ __html: themeInitScript }}> as the FIRST child, before {children} (UI-SPEC §9.1): inside a try/catch, read localStorage.getItem(EXPLORE_THEME_STORAGE_KEY), then document.documentElement.classList.remove("dark","light") and add "light" only when the stored value is exactly "light", else add "dark" (anything invalid/absent/throwing → dark; no prefers-color-scheme detection — UI-SPEC §17.7). Pre-hydration class mutation is safe: root <html> already carries suppressHydrationWarning (src/app/layout.tsx:92). Inline the script body as a string constant; keep it synchronous and static-export-safe (no next/script, no dynamic import).
      4. Create src/components/explore/explore-header.tsx: export function ExploreHeader({ name, title }: { name: string; title: string }). Root <header className="flex h-[52px] shrink-0 items-center gap-2 border-b bg-background px-4"> (px height immune to the ≤640px html{font-size:14px} rem shrink — UI-SPEC §3/§11). Left: three aria-hidden decorative window glyphs — 10px (h-2.5 w-2.5) rounded-full dots with gap-2 (8px), colored via inline style or arbitrary class with hsl(var(--chart-5)), hsl(var(--chart-3)), hsl(var(--chart-2)) left-to-right (traffic-light per UI-SPEC §3). Title: <span className="flex-1 min-w-0 truncate text-sm text-foreground"> rendering {name} only below md and {`${name} — ${title}`} at md+ (two spans: one "md:hidden", one "hidden md:inline"). NO right cluster yet — interactive controls are added by the tasks that implement them (Task 3 adds the theme toggle; plan 02 adds the drawer toggle). No dead buttons.
      5. Create src/components/explore/explore-status-bar.tsx: export function ExploreStatusBar({ theme }: { theme: string }) — plain presentational (no "use client"; it is rendered inside the client shell in Task 3). Root <footer className="flex h-7 shrink-0 items-center justify-between border-t px-3 text-[10px] sm:h-8 sm:px-4 sm:text-xs"> (D-03). Left: <span className="text-accent">{EXPLORE_STATUS_USER}</span><span className="text-muted-foreground">{EXPLORE_STATUS_PATH}</span> — contiguous text, colors only (UI-SPEC §7). Right group with aria-live="polite": {theme} + {" · "} + {`0/${EXPLORE_SECTIONS.length} sections visited`} — the counter is STATIC until phase 4 wires real progress; the 5 comes from the constant, the 0 is a literal (D-03). SSR/first paint renders "dark"; the live-sync hook lands in Task 3 (UI-SPEC §7 hydration contract — never lazy-init this label from documentElement during render).
      6. Create src/app/explore/page.tsx as a server component with a default export: import portfolioData from '@/data/portfolio-main-data.json'. Render the shell root div className="explore-shell flex h-dvh flex-col overflow-x-hidden bg-background text-foreground" (single h-dvh class — Tailwind ^3.4.1 ships it natively; do NOT stack h-screen, per UI-SPEC §2.1; overflow-x-hidden is the belt-and-braces no-horizontal-scroll guarantee for EXPLORE-06). Inside, in order: <ExploreHeader name={portfolioData.about.name} title={portfolioData.about.title} />; <main aria-label="Portfolio sections" tabIndex={0} className="flex-1 overflow-y-auto p-4 md:p-6"> containing ONE inline placeholder panel — <section id="about" className="rounded-md border bg-card p-4"> with a title row ("About", text-sm font-medium) and two aria-hidden Skeleton lines (import { Skeleton } from '@/components/ui/skeleton', classNames h-3 w-3/4 and h-3 w-1/2). This inline panel is the tracer's thinnest main-area stand-in and WILL be replaced by <ExplorePanels /> in plan 02 — keep it disposable. Then <ExploreStatusBar theme="dark" />. The page must be a sibling of the (main)/ route group (src/app/explore/, NOT inside src/app/(main)/) so it does not inherit the CLI's h-screen overflow-hidden terminal shell (src/app/(main)/layout.tsx:16, D-08).
      7. Do NOT add any transition on background/color (theme swap must be an instant CSS-var swap — UI-SPEC §9.1). Do NOT create any new npm dependency (D-09).
    </action>
    <verify>npm run typecheck && npm run build && test -f out/explore.html && grep -q "explore-shell" out/explore.html && grep -q "Anastasios Tilsizoglou" out/explore.html && grep -q "guest@tasostilsi" out/explore.html && grep -q ":~/explore" out/explore.html && grep -q "0/5 sections visited" out/explore.html</verify>
    <acceptance_criteria>
      - `npm run typecheck` exits 0
      - `npm run build` exits 0 and `out/explore.html` exists (static export emitted the route — D-08)
      - `grep -q "explore-shell" out/explore.html` exits 0 (scope marker class in emitted HTML)
      - `grep -q "Anastasios Tilsizoglou" out/explore.html` exits 0 (header title is data-driven from about.name — no hardcoded copy, EXPLORE-07)
      - `grep -q "0/5 sections visited" out/explore.html` exits 0 (status bar renders the static counter, D-03)
      - `git diff src/app/globals.css` touches nothing inside the :root/.dark/.light blocks (lines 11–119) — only additive .explore-shell content
    </acceptance_criteria>
    <done>/explore builds into the static export and serves the IDE frame skeleton — header with glyphs + real name/title, one About placeholder panel with skeletons, status bar with breadcrumb + 'dark' + '0/5 sections visited' — in the scoped dark IDE tokens, with the theme script present in the page HTML ahead of shell markup.</done>
  </task>

  <task type="auto">
    <name>Task 2: JetBrains Mono via next/font, scoped to /explore (D-04, EXPLORE-01c)</name>
    <files>src/app/layout.tsx, src/app/globals.css</files>
    <read_first>.planning/phases/EXPLORE-01-explore-shell/EXPLORE-01-explore-shell-UI-SPEC.md (§10), src/app/layout.tsx, src/app/globals.css (lines 1–8)</read_first>
    <action>
      1. Edit src/app/layout.tsx: extend the existing next/font/google import (line 3) to include JetBrains_Mono alongside Geist and Geist_Mono. Add `const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });` directly below the geistMono declaration (line 14–17 pattern). Append `${jetbrainsMono.variable}` to the <body> className at line 120 — AFTER the existing ${geistSans.variable} ${geistMono.variable} tokens. Per D-04 and D-10: never remove or reorder the Geist variables; the change is purely additive so CLI pages keep Geist Mono via the body rule (globals.css:5-8).
      2. In src/app/globals.css, add INSIDE the .explore-shell block created in Task 1 (not on body — scope rule, UI-SPEC §10): `font-family: var(--font-jetbrains), var(--font-geist-mono), Menlo, Monaco, 'Courier New', monospace;`. Do not touch the body font-family rule (globals.css:5-8).
      3. Confirm no runtime CDN font fetch: next/font self-hosts at build; do not add any <link> to fonts.googleapis.com or similar (UI-SPEC §10, EXPLORE-01c).
    </action>
    <verify>npm run typecheck && npm run build && grep -q "JetBrains_Mono" src/app/layout.tsx && grep -q -- "--font-jetbrains" src/app/globals.css && grep -rlq "JetBrains Mono" out/_next/static/css/ && grep -q "font-geist-mono" src/app/layout.tsx</verify>
    <acceptance_criteria>
      - `grep -q "JetBrains_Mono" src/app/layout.tsx` exits 0 AND `grep -q "geistMono" src/app/layout.tsx` exits 0 (both fonts coexist — D-10)
      - `grep -q -- "var(--font-jetbrains)" src/app/globals.css` exits 0 inside the .explore-shell scope rule
      - `grep -rlq "JetBrains Mono" out/_next/static/css/` exits 0 (self-hosted @font-face present in the emitted CSS — no CDN)
      - `grep -q "cdnjs.cloudflare.com/ajax/libs/font-awesome" out/explore.html` still exits 0 and `grep -q "fonts.googleapis" out/explore.html` exits 1 (no new runtime font CDN)
      - `npm run build` exits 0
    </acceptance_criteria>
    <done>The /explore shell renders in JetBrains Mono through the --font-jetbrains variable consumed by .explore-shell; the root layout's Geist declarations are byte-identical except the additive JetBrains import/variable, and the font file is self-hosted in the export output.</done>
  </task>

  <task type="auto">
    <name>Task 3: Hand-rolled explore theme — light tokens, hook, client shell, header toggle, reduced-motion guard (D-05, EXPLORE-01d)</name>
    <files>src/app/globals.css, src/components/explore/use-explore-theme.ts, src/components/explore/explore-shell.tsx, src/components/explore/explore-header.tsx, src/app/explore/page.tsx</files>
    <read_first>.planning/phases/EXPLORE-01-explore-shell/EXPLORE-01-explore-shell-UI-SPEC.md (§8, §9, §12, §14), src/components/cli/hooks/useCliTheme.ts, src/components/explore/constants.ts, src/components/explore/explore-header.tsx, src/components/explore/explore-status-bar.tsx</read_first>
    <action>
      1. In src/app/globals.css, append AFTER the .explore-shell dark block a `.light .explore-shell` override block with the light IDE token values verbatim from UI-SPEC §9.3: --background: 220 20% 97%; --foreground: 220 14% 16%; --card: 0 0% 100%; --card-foreground: 220 14% 16%; --popover: 0 0% 100%; --popover-foreground: 220 14% 16%; --primary: 215 85% 45%; --primary-foreground: 0 0% 100%; --secondary: 220 14% 93%; --secondary-foreground: 220 14% 20%; --muted: 220 14% 92%; --muted-foreground: 220 9% 40%; --accent: 160 80% 28%; --accent-foreground: 0 0% 100%; --destructive: 0 74% 46%; --destructive-foreground: 0 0% 98%; --border: 220 12% 85%; --input: 220 13% 89%; --ring: 215 85% 45%; --sidebar-background: 220 16% 94%; --sidebar-foreground: 220 11% 30%; --sidebar-primary: 215 85% 45%; --sidebar-primary-foreground: 0 0% 100%; --sidebar-accent: 220 14% 90%; --sidebar-accent-foreground: 220 14% 15%; --sidebar-border: 220 12% 86%; --sidebar-ring: 215 85% 45%; --radius: 0.25rem. Leave --chart-1..5 inherited (not overridden). The existing .light block (globals.css:89-119) stays byte-untouched (D-10) — proximity makes the shell's own values win over any <html>-level class.
      2. Append the reduced-motion guard from UI-SPEC §12 verbatim to globals.css (the ONLY motion-suppression mechanism of this phase; its body:has(.explore-shell) [data-state="open"/"closed"] selectors cover the portaled SheetOverlay/SheetContent without editing src/components/ui/sheet.tsx, and the scroll-behavior:auto overrides the body smooth rule at globals.css ~line 284): `@media (prefers-reduced-motion: reduce) { .explore-shell *, .explore-shell .animate-pulse, body:has(.explore-shell) [data-state="open"], body:has(.explore-shell) [data-state="closed"] { animation: none !important; transition: none !important; } body:has(.explore-shell), .explore-shell main { scroll-behavior: auto !important; } }`.
      3. Create src/components/explore/use-explore-theme.ts ("use client"): export function useExploreTheme(): { theme: "dark" | "light"; setTheme: (t: "dark" | "light") => void }. State is initialized to the literal "dark" — NEVER lazy-init from documentElement during render (hydration mismatch risk, UI-SPEC §7/§14). One-shot mount effect reads documentElement.classList and syncs state ("light" if it contains "light", else "dark"). setTheme(next): documentElement.classList.remove("dark","light") then classList.add(next), persisted via try/catch localStorage.setItem(EXPLORE_THEME_STORAGE_KEY, next) (private-mode-safe — UI-SPEC §14#4). No prefers-color-scheme detection anywhere (UI-SPEC §17.7); the hook must never read or write "portfolio-theme" (D-05/D-10).
      4. Create src/components/explore/explore-shell.tsx ("use client"): export function ExploreShell({ children }: { children: React.ReactNode }). It calls useExploreTheme() and renders the shell root div (move the exact className from page.tsx Task 1: "explore-shell flex h-dvh flex-col overflow-x-hidden bg-background text-foreground") composing, in order: <ExploreHeader name title theme onToggleTheme /> (header receives the current theme + a toggle callback), <main aria-label="Portfolio sections" tabIndex={0} className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main> (the ONLY scroll container — UI-SPEC §2.1; tabIndex 0 + aria-label pinned for keyboard scrolling, UI-SPEC §13), and <ExploreStatusBar theme={theme} />. Passing server-rendered children through a client component is the existing composition pattern and is static-export-safe.
      5. Edit src/components/explore/explore-header.tsx: add the right cluster with the theme toggle ONLY (drawer toggle arrives in plan 02): a <button type="button"> of EXACTLY h-[44px] w-[44px] (px-based real touch target — the ≤640px html{font-size:14px} rule shrinks rem sizes ~17%, so rem-based h-10 would render ~33px at 375px; UI-SPEC §3/§13), ghost styling (text-muted-foreground, hover:bg-muted, rounded-md, focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background, no transition classes). Icon: lucide-react Sun while theme is dark (click → light), Moon while light (UI-SPEC §3 target-theme icon); aria-label swaps "Switch to light theme" / "Switch to dark theme". Clicking calls the toggle (dark↔light) — instant swap, no animation (UI-SPEC §9.1). Wire it from ExploreShell's hook state (single source of truth — key_link).
      6. Edit src/components/explore/explore-status-bar.tsx: type theme as "dark" | "light" and render it as the live label (the one-shot mount sync lives in the hook; the briefly-wrong label right after load with persisted light is the accepted tradeoff, UI-SPEC §7). Keep the right group aria-live="polite" so theme switches are announced.
      7. Edit src/app/explore/page.tsx: keep it a server component; wrap the shell contents in <ExploreShell name={portfolioData.about.name} title={portfolioData.about.title}>{inline About placeholder panel from Task 1}</ExploreShell> so all interactive theme state lives behind the client boundary while panels stay server-rendered.
    </action>
    <verify>npm run typecheck && npm run build && grep -q ".light .explore-shell" src/app/globals.css && grep -q "prefers-reduced-motion" src/app/globals.css && grep -q "portfolio-explore-theme" src/components/explore/constants.ts && grep -q "useExploreTheme" src/components/explore/explore-shell.tsx && grep -q "Switch to" src/components/explore/explore-header.tsx && grep -q "44px\|h-\[44px\]" src/components/explore/explore-header.tsx && grep -qv "prefers-color-scheme" src/components/explore/use-explore-theme.ts</verify>
    <acceptance_criteria>
      - `grep -q ".light .explore-shell" src/app/globals.css` exits 0 AND the .light CLI block (globals.css:89-119) is unmodified in `git diff src/app/globals.css`
      - `grep -q "prefers-reduced-motion" src/app/globals.css` exits 0 with the body:has(.explore-shell) guard present
      - `grep -q "prefers-color-scheme" src/components/explore/use-explore-theme.ts` exits 1 (dark is the unconditional default — UI-SPEC §17.7)
      - `grep -q "portfolio-explore-theme" src/components/explore/constants.ts` exits 0 AND `grep -q "portfolio-theme" src/components/explore/*` exits 1 for the exact CLI key (no cross-key writes)
      - `grep -q "h-\[44px\]" src/components/explore/explore-header.tsx` exits 0 (px-based 44px touch target)
      - Observable: /explore renders the dark IDE theme by default; clicking the header Sun icon swaps to the light IDE theme instantly; reloading with persisted "light" paints light with no flash (before-paint script); `npm run build` exits 0
    </acceptance_criteria>
    <done>The shell ships both scoped IDE themes with a working 44px header toggle, persistence under portfolio-explore-theme, zero flash on reload, and a reduced-motion guard that already covers the future portaled drawer — with the CLI token blocks and CLI theme hook byte-untouched.</done>
  </task>
</tasks>