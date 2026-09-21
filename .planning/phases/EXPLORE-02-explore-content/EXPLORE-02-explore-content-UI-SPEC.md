All grounding verified against the codebase: phase-1 chrome/tokens (panel-placeholder, explore-panels, explore-shell, globals.css `.explore-shell` blocks), data file + types (caps, optional fields, 9 contact channels, 6/6 top projects with links, 6 skill groups / 36 chips), Badge variants, lucide 0.475.0 icon inventory (no Medium brand icon — PenLine substitute), the verified resume-modal top-6 cap precedent (`ResumeView.tsx:146`), the live `/resume` route, and the sidebar.tsx Skeleton import that forbids deleting the skeleton file. Contrast for new color uses (`text-accent` on card, muted-foreground on card) computed for both themes. Full UI-SPEC.md follows.

# Phase 2: explore-content — UI Spec

**Gathered:** 2026-09-21 (ui-researcher pass)
**Status:** Design contract — locked visual/interaction decisions for the planner
**Inputs:** EXPLORE-02 SPEC (locked), CONTEXT.md (D-01…D-08), phase-1 UI-SPEC (chrome/tokens inherited, not relitigated), codebase inspection (cited inline)

## 0. Grounding (verified facts this contract relies on)

| Fact | Source |
|---|---|
| Panel chrome (phase 1, stays): `<section id aria-label>` + `rounded-md border bg-card p-4`; header row = `h-2 w-2 rounded-full bg-chart-N` chip + `h2 text-sm font-medium`; the humor line + Skeleton body are the parts this phase replaces | `src/components/explore/panel-placeholder.tsx:37-55` |
| Grid locked: `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3`, About `md:col-span-2 lg:col-span-2`; accents About=chart-1 … Contact=chart-5 | `src/components/explore/explore-panels.tsx:29-49` |
| Main scroll container: `p-4 md:p-6`, the ONLY scroll container | `src/components/explore/explore-shell.tsx:47-53` |
| `.explore-shell` dark tokens + `.light .explore-shell` overrides exist as specced (card `220 12% 12%` / white; muted-foreground `220 8% 60%` / `220 9% 40%`; accent green `160 84% 45%` / `160 80% 28%`; `--radius: 0.25rem`; JetBrains Mono scoped) | `src/app/globals.css:499-560` |
| chart-1..5 defined once in `:root`, shared by both themes; chart-2 (experience) = `160 60% 45%` green | `src/app/globals.css:37-41` |
| Contrast (computed from those token values): `text-accent` on `bg-card` ≈ **7.1:1 dark / 4.9:1 light** (AA ✓ at text-xs); `muted-foreground` on card ≈ **5.5:1 dark / 6.4:1 light** | computed |
| Badge base: `rounded-full border px-2.5 py-0.5 text-xs font-semibold`; `outline` variant = `text-foreground` (transparent bg). default/secondary variants ship `hover:bg-*-80` classes — CSS `:hover` fires on divs too, so static chips must neutralize | `src/components/ui/badge.tsx:7-17` |
| lucide-react 0.475.0 exports `Mail, Linkedin, Github, Facebook, Instagram, Twitter, Twitch, Globe, PenLine, FileText, ArrowRight, ArrowUpRight, MapPin, Briefcase` — **no `Medium` brand icon exists** | `node_modules/lucide-react/dist/esm/icons/` |
| `/resume` route exists — internal, same-tab target | `src/app/resume/page.tsx` |
| Resume-modal project cap precedent verified: `<ResumeProjects data limit={6}>` → `slice(0, 6)` | `src/components/resume/ResumeView.tsx:146`, `resume/ResumeProjects.tsx:11-16` |
| Types: `Project.date`/`link`/`sourceUrl` optional; `ExperienceEntry.responsibilities` optional; contact channels `portfolio/facebook/instagram/twitter/twitch` optional (all present in data) | `src/data/portfolio-main-data.d.ts:19-25, 1-8, 65-75` |
| Data verified: top-3 experience = Chubb (7 responsibilities), Upstream (3), Netcompany-Intrasoft (3) — all ≥3; top-6 projects all carry `link` (DeepIndex also has `sourceUrl` — not rendered); contact has all 9 channels; skills = 6 groups / 36 chips | `src/data/portfolio-main-data.json:30-155, 172-186` |
| Page already imports full `portfolioData` (server) and passes children (server-rendered) into the client `ExploreShell` | `src/app/explore/page.tsx:30-47` |
| `ui/skeleton.tsx` is still imported by `src/components/ui/sidebar.tsx` — the FILE stays; only panels stop using it | `src/components/ui/sidebar.tsx` |
| Panel content width: 375px → **309px**; md → **318px** (About 686px); lg → **419px** (About 888px) | grid + padding math (shell p-4/p-6, panel p-4, 1px borders, gap-4) |
| `text-xs` at 375px ≈ 11.6px effective (≤640px `html{font-size:14px}` rule) → ≈44 chars/line | `src/app/globals.css:464-467` (phase-1 §11 trap) |

## 1. Design Contract Summary

The five placeholder panel bodies are replaced by real, data-driven content rendered by fresh **server components** under `src/components/explore/sections/`. Outer grid, panel chrome row, header, drawer, intro strip, status bar, tokens, and JetBrains Mono are untouched (phase-1 pins survive). Every interactive element introduced in this phase is a link — 6 project cards, 9 contact channel rows, 1 resume row; everything else (timeline, chips, terminal pointers) is static, non-interactive text. Zero new dependencies, zero new animations, SSG-safe.

## 2. What Stays / What Is Replaced

| Element | Status |
|---|---|
| `<section id aria-label>` wrapper + `rounded-md border bg-card p-4` | STAYS byte-identical |
| Header row: accent chip `h-2 w-2 rounded-full bg-chart-N` + `h2 text-sm font-medium` | STAYS byte-identical |
| Humor line (`EXPLORE_PANEL_HUMOR`) | REMOVED from all 5 panels |
| Skeleton placeholder body | REMOVED from all 5 panels |
| Grid classes, About spans, `gap-4` | UNTOUCHED (the grid div in explore-panels) |
| Header, drawer, intro strip, status bar | UNTOUCHED |

- After this phase `EXPLORE_PANEL_HUMOR` and `PanelPlaceholder` are dead code; removing them is permitted (explore-owned files). The grid + chrome-row classes are NOT.
- Implementation shape is planner's choice — a shared panel wrapper (chrome row + body slot) or per-section chrome — but the RENDERED chrome must be identical to phase 1 either way.
- Section bodies are **server components**: no `"use client"`, no hooks; data flows `page.tsx → panels → sections` as props. SSG preserved (pure JSON import at build).

## 3. Shared Body Contract (all 5 panels)

- Body sits below the chrome row with `mt-3` first gap.
- All content text **wraps, never truncates**: no `truncate`, no `whitespace-nowrap`, no `line-clamp-*` on any content element.
- Both themes via existing tokens only. chart-N colors remain **decorative-only** (chips/dots/icons — never the sole text color of meaningful copy).
- Panels do not scroll internally and take no max-height — panels grow; `main` scrolls. Grid rows stretch to the tallest panel in the row; whitespace at shorter panels' bottoms is accepted.
- The panel container keeps **no hover/press affordance** (phase-1 pin survives): only links INSIDE panels are interactive.

## 4. About Panel Body (accent chart-1)

Text-only (D-05 — no photo anywhere; `about.profileImageUrl` intentionally unused).

1. **Description** — `<p class="text-sm leading-relaxed text-foreground">` — `about.description` verbatim (reads as 2-3 lines across the wide panel at md/lg).
2. **Meta row** — `<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">`, two items:
   - `Briefcase` `h-3.5 w-3.5` (aria-hidden) + `about.title`
   - `MapPin` `h-3.5 w-3.5` (aria-hidden) + `about.location`

No name repetition (header bar + intro strip carry it), no terminal pointer (D-02). `title`/`location` are type-required and present; if either were absent its item hides (§11).

## 5. Experience Panel Body (accent chart-2) — vertical timeline (git-log feel)

```
<ol class="relative space-y-5 border-l border-border">        ← continuous rail
  <li class="relative pl-4">                                   ← one per role (top-3, JSON order)
    <span aria-hidden class="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-chart-2" />
    <h3 class="text-sm font-medium text-foreground">{title}</h3>
    <p class="mt-0.5 text-xs text-foreground">{company}</p>
    <p class="text-xs text-muted-foreground tabular-nums">{duration}</p>
    <p class="text-xs text-muted-foreground">{location}</p>     ← full street address, wraps
    <ul class="mt-2 space-y-1.5 list-disc pl-4 marker:text-muted-foreground">
      <li class="text-xs leading-relaxed text-muted-foreground">{responsibility}</li>  ×≤3
    </ul>
  </li> ×3
</ol>
```

- Rail = the `<ol>`'s `border-l border-border`, continuous through entries and gaps (git-log). The `<ol>` carries no `pl` — each `<li>` has `pl-4`; the 8px dot centers on the 1px rail via `-left-[4px]` (0.5px optical offset, invisible; decorative).
- **Caps (D-01):** first 3 JSON entries (reverse-chronological verified), no sorting; bullets = **first 3** of `responsibilities[]`.
- `location` renders EXACTLY as stored — full street address, wraps to 2 lines at 375px.
- `duration` renders as-is — dash style varies per entry (em dash / hyphen); do NOT normalize.
- Terminal pointer appended after the `<ol>` (§9).

## 6. Skills Panel Body (accent chart-3) — grouped chips

- 6 groups in **JSON key order** (no sorting, no re-shaping): `soft_skills` → `hard_skills.Languages` → `hard_skills.Testing` → `hard_skills.Infrastructure` → `hard_skills.Innovation` → `languages`.
- Group anatomy:

```
<div class="space-y-3">                                        ×6 groups
  <div>
    <p class="text-xs text-muted-foreground">{groupPath}</p>    ← JSON key path, verbatim
    <ul class="mt-1.5 flex flex-wrap gap-1.5">
      <li><Badge variant="outline" class="font-normal pointer-events-none">{skill}</Badge></li>
    </ul>
  </div>
</div>
```

- **Group header = prettified chrome label** (user-confirmed W-5): `soft_skills` → `Soft Skills` · `hard_skills.Languages` → `Languages` · `hard_skills.Testing` → `Testing` · `hard_skills.Infrastructure` → `Infrastructure` · `hard_skills.Innovation` → `Innovation` · `languages` → `Languages` (the two Languages entries render as separate rows, keyed by their distinct JSON paths). Key→label map is structural chrome (allowed per SPEC) — group ORDER still follows JSON key order, no sorting.
- **Chip:** existing `Badge`, `variant="outline"` (transparent bg + border + `text-foreground`, correct on card in both themes), `font-normal` override (badge default `font-semibold` is heavy at this density), and **`pointer-events-none`** — chips are static; Badge's variants carry `hover:` classes and CSS `:hover` fires on divs, so without neutralization a cursor pass would flick chip backgrounds. No cursor change, not focusable.
- All 36 chips render — every group as-is, no cap (CONTEXT discretion locked).
- Terminal pointer after the groups (§9).

## 7. Projects Panel Body (accent chart-4) — mini-cards

- Vertical stack `space-y-2` of exactly 6 cards (first 6 JSON entries — resume-modal cap precedent verified at `ResumeView.tsx:146`).
- **Card = one anchor** when `link` present (`<a target="_blank" rel="noopener noreferrer">`); plain `<div>` when absent. Single anchor per card — no nested links. All 6 pinned projects have links (verified); the no-link branch is robustness only.
- Card anatomy:

```
<a class="group block rounded-md border border-border p-3">
  <div class="flex items-baseline justify-between gap-2">
    <span class="flex min-w-0 items-center gap-1 text-sm font-medium text-foreground group-hover:text-accent transition-colors">
      {name} <ArrowUpRight aria-hidden class="h-3.5 w-3.5 shrink-0 group-hover:text-accent transition-colors" />   ← ↗ after name; hover = name + ↗ only, via group on the anchor (W-2 pin)
    </span>
    <span class="shrink-0 text-xs text-muted-foreground tabular-nums">{date}</span>
  </div>
  <p class="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
</a>
```

- `date` is optional → tag absent = nothing rendered on the right (no dash).
- Description wraps fully (DeepIndex's ~200-char description = 4-5 lines at 419px — accepted; no clamping).
- `sourceUrl` is NOT rendered in explore — one link per card (`link`); the source stays reachable via `projects --all` in the terminal.
- Touch target: full-card anchor (≥44px by construction).

## 8. Contact Panel Body (accent chart-5) — resume row + channel rows

1. **'Full resume →' row — FIRST, prominent (D-03):**

```
<Link href="/resume" class="group flex min-h-[44px] items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-accent">
  <FileText aria-hidden class="h-4 w-4" /> <span class="group-hover:underline">Full resume</span> <ArrowRight aria-hidden class="h-4 w-4" />
</Link>
```

   - Internal route → **same tab** via `next/link`. Chrome copy `Full resume` + arrow icon (locked phrase realized as label + icon).
   - The only `text-accent` default-state text in any panel → prominence in both themes (contrast verified §0).
2. **Divider:** `<div class="my-3 border-t border-border" />` — separates the resume action from the channel list.
3. **Channel rows** — all 9, in JSON key order (`email, linkedin, github, medium, facebook, instagram, twitter, twitch, portfolio`):

```
<a href={href} target="_blank" rel="noopener noreferrer" class="flex min-h-[44px] items-center gap-2.5 group">
  <Icon aria-hidden class="h-4 w-4 shrink-0 text-muted-foreground" />
  <span class="min-w-0 flex-1">
    <span class="block text-sm text-foreground group-hover:underline">{label}</span>
    <span class="block break-all text-xs text-muted-foreground">{href}</span>
  </span>
</a>
```

   - Display label = channel key, capitalized **chrome map**: `Email, LinkedIn, GitHub, Medium, Facebook, Instagram, Twitter, Twitch, Portfolio` (structural labels — allowed chrome per SPEC).
   - Icon map (verified in lucide 0.475.0): email→`Mail`, linkedin→`Linkedin`, github→`Github`, **medium→`PenLine`** (no Medium brand icon exists), facebook→`Facebook`, instagram→`Instagram`, twitter→`Twitter`, twitch→`Twitch`, portfolio→`Globe`.
   - Value line = the URL **exactly as stored** (data fidelity), `break-all` so 37+ char URLs can never force horizontal scroll. Email row: visible value = the address; `href="mailto:{value}"`.
   - External channels → new tab + `rel="noopener noreferrer"`. Row text doubles as the accessible name (no `aria-label` override — URL text is real content).
   - Hover: channel label underlines; value unchanged. No panel-level hover.

## 9. Terminal Pointer (shared chrome, 3 panels)

- Static styled text pinned to the **bottom** of the Experience, Projects, and Skills bodies (`mt-4`), register locked by D-02:
  - Experience → `// more: experience --all in the terminal`
  - Projects → `// more: projects --all in the terminal`
  - Skills → `// more: skills in the terminal`
- Render: `<p class="mt-4 text-xs text-muted-foreground">` with the command token wrapped in `<span class="text-accent">` (terminal-green echo; AA verified both themes §0). Plain prefix + trailing text in `text-muted-foreground`.
- **NOT a link:** no hover, no focus, no cursor-pointer, no handler (phase 5 may make it interactive). It is meaningful chrome text — rendered normally, not `aria-hidden`; may wrap at 375px.
- About and Contact carry **no pointer** (D-02 — no matching CLI command).
- Suggested implementation: one `TerminalPointer({ command })` component under `sections/`, reused by the three panels.

## 10. Interaction-State Matrix (every control)

| Control | Default | Hover | Active | Focus-visible | Disabled | Loading | Error |
|---|---|---|---|---|---|---|---|
| Panel container (all 5) | static card | **none (phase-1 pin survives)** | — | not focusable | n/a | n/a — SSG | n/a |
| About body (text + meta) | static | — | — | — | n/a | n/a | n/a |
| Timeline (rail, dots, text) | static | — | — | — | n/a | n/a | n/a |
| Skill chip | outline Badge, static | **none — `pointer-events-none`** | — | not focusable | n/a | n/a | n/a |
| Project card (linked) | name+↗ `text-foreground` | name + ↗ → `text-accent`, `transition-colors` | same as hover | `ring-2 ring-ring ring-offset-2 ring-offset-background` | n/a | n/a | n/a |
| Project card (no link) | plain div, no ↗ | none | — | n/a | n/a | n/a | n/a |
| Resume row | `text-accent` + border | label underline | — | same ring | n/a | n/a | n/a |
| Contact channel row | label `foreground` + URL `muted` | label underline | — | same ring | n/a | n/a | n/a |
| Terminal pointer | static text | none | — | not focusable | n/a | n/a | n/a |
| Header / drawer / intro / status bar | phase-1 §8 matrix | unchanged | unchanged | unchanged | unchanged | unchanged | unchanged |

- No async data exists (build-time JSON import) → **no loading or error UI is defined**; a malformed data file fails the build loudly (phase-1 §8 stance continues). Skeletons leave the panels and do not return.
- Total motion inventory: `transition-colors` on the 16 link elements (6 cards + 9 rows + 1 resume row). Nothing else animates.

## 11. Data-Absence & Graceful-Hide Contract

Data is build-time-verified present for every pinned value (§0) — these are robustness rules for type-optional fields. **No fallback copy may be invented** (EXPLORE-07).

| Case | Contract |
|---|---|
| `Project.date` absent | date tag omitted; name row right side empty (no dash/placeholder) |
| `Project.link` absent | card renders as non-interactive div; ↗ omitted; no hover/cursor |
| `responsibilities` absent or empty | entry renders without the bullet list |
| fewer than 3 responsibilities | render what exists (no padding) |
| a contact channel absent (typed optional) | row omitted |
| a whole list empty (experience / projects / a skills group) | that block renders nothing — no skeleton resurrection, no "no entries" copy |
| URL without protocol | rendered as-is in the value line and href (no repair logic) |
| Extremely long values | wrap (`break-all` URLs, normal paragraph wrapping); never truncate |

## 12. Responsive Matrix

| Aspect | 375px (base) | 768px (md) | 1440px (lg) |
|---|---|---|---|
| Grid | 1 col | 2 cols, About spans 2 | 3 cols, About spans 2 |
| Panel content width | 309px | 318px (About 686px) | 419px (About 888px) |
| About | description ~7 lines; meta row wraps to 2 lines | 2-3 lines; meta 1 line | meta 1 line |
| Experience | title/company/duration/location stack; location wraps to 2 lines | same, fewer wraps | location 1 line |
| Skills | chips wrap freely; 6 groups stacked | same | same |
| Projects | card header: name wraps internally, date stays pinned right (anatomy-authoritative — no `flex-wrap`, W-4 pin); description 2-4 lines | 1-2 lines | ≤3 lines |
| Contact | URL value wraps to 2 lines (`break-all`); rows stay ≥44px | URL 1 line | URL 1 line |
| Terminal pointer | may wrap to 2 lines | 1 line | 1 line |
| Horizontal scroll | **none — invariant** (`break-all` + wrap + no fixed widths) | none | none |
| Scroll model | `main` scrolls; panels grow; no internal scroll | same | same |

Density note (EXPLORE-03c): caps make each panel complete-feeling in roughly one screenful at 768/1440. At lg the Experience panel is the tallest body (~600-700px) and may exceed one screenful — accepted (the rail keeps it scannable). Do NOT compensate with internal scroll, lower caps, or truncation; whitespace at the bottom of shorter panels in the same grid row is accepted.

## 13. Motion & Reduced Motion

- **No new animations or keyframes in this phase.** Skeletons (`animate-pulse`) leave the panels; the only motion is hover color transitions on the 16 links.
- The phase-1 reduced-motion guard in `globals.css` already suppresses transitions inside `.explore-shell` — hover changes become instant under `prefers-reduced-motion: reduce`. No new CSS required.
- No `prefers-color-scheme` logic; both themes come from the phase-1 token blocks.

## 14. Accessibility Contract

- Section `<section id aria-label>` wrappers stay; bodies add no new landmarks.
- Experience = `<ol>` (chronological semantics free); bullets and chips = `<ul>`/`<li>` (Tailwind preflight strips markers — chips need no `list-none`, bullets pin `list-disc`).
- Icons, timeline dots, accent chips = `aria-hidden="true"`.
- **Link accessible names = natural text** (no `aria-label` overrides): project card = name + description + date; channel row = label + URL; resume row = "Full resume". External-ness is conveyed by the ↗ icon, not announced text.
- Keyboard: tab order = DOM order; every link carries `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background` (consistent with phase-1 §8). `main` keeps `tabIndex={0}` arrow-key scrolling — panels now contain tabbables; no traps; ESC exits the drawer unchanged.
- Touch targets: every interactive element `min-h-[44px]` **real px** (the ≤640px rem-shrink trap from phase-1 §13) — channel rows and resume row pinned explicitly; project cards reach ≥44px by content, never via rem-based sizing.
- Contrast (verified §0): `text-accent` on card 7.1:1 dark / 4.9:1 light; `muted-foreground` 5.5/6.4:1; chart-N colors remain decorative-only.
- Zoom/reflow: no fixed-width children anywhere in the new bodies; 200% zoom reflows; 375px no-horizontal-scroll remains a hard acceptance check.

## 15. Verifier Hooks (acceptance → contract section)

| SPEC acceptance | Proof in this contract |
|---|---|
| About = real description + title + location; no humor line anywhere | §2, §4 |
| Experience: exactly 3 roles, vertical timeline, 2-3 bullets, pointer present | §5, §9 |
| Skills: grouped chips from JSON grouping, no flattened dump, pointer present | §6, §9 |
| Projects: exactly 6 cards (name/description/link/date), pointer present | §7, §9 |
| Contact: all links + prominent 'Full resume →' to /resume, no pointer | §8, §9 |
| No hardcoded portfolio copy (grep clean) | §4-§8 anatomy pulls from data; chrome limited to §8/§9 maps + §17.4 |
| 375px no horizontal scroll; wrap never truncate; grid spans intact | §3, §11, §12 |
| Terminal pointer as styled chrome, readable in both themes | §9 + §0 contrast |
| Static export / SSG preserved | §2 (server components), §10 (no async UI) |

## 16. (UNRESOLVED) / (OPTIONAL) Register — planner assumes these

| Marker | Item | Default if unaddressed |
|---|---|---|
| (RESOLVED — user picked prettified labels) | Skills group-header formatting: **prettified chrome labels** ("Soft Skills", "Languages", "Testing", "Infrastructure", "Innovation", "Languages") via a structural key→label map; JSON key order preserved; group ORDER carries disambiguation for the duplicate Languages label | resolved 2026-09-21 |
| (OPTIONAL) | Chip color-coding per group (chart-N accents) | skip — chart-as-sole-text-color is prohibited (§17.12); single outline style scans cleaner |
| (OPTIONAL) | Subtle inset bg on project cards (`bg-background/40`) | skip — border-only cards |
| (OPTIONAL) | Resume row below the 9 channels instead of first | skip — first-row placement is the pinned prominence choice |
| (OPTIONAL) | Timeline dot halo/ring detail | skip — flat `bg-chart-2` dot |

## 17. Prohibitions (locked — do not relitigate)

1. No edits to the outer grid (`explore-panels.tsx` grid classes), `explore-header`, `explore-drawer`, `explore-intro`, `explore-status-bar` — only panel-body wiring touches existing explore files.
2. No edits to `ui/sheet.tsx`, `ui/badge.tsx` (variant values — className overrides only), `ui/skeleton.tsx` (sidebar.tsx still imports it — the file stays), `Resume*` components, or any CLI file.
3. No new npm dependencies; no chart libraries (phase 3).
4. No hardcoded portfolio copy — chrome literals limited to: section labels (existing constants), channel display labels (§8 map), terminal-pointer strings (§9), `Full resume`, structural aria-labels, and the `mailto:` protocol prefix.
5. No truncation utilities (`truncate`, `line-clamp-*`, `whitespace-nowrap`) on content text.
6. No hover/press/cursor affordance on chips, timeline, terminal pointers, About body, or panel containers; no new keyframes/animations.
7. No internal scroll containers or max-heights inside panels.
8. No interactive terminal pointers (phase 5), no charts (phase 3), no visited-tracking (phase 4).
9. No profile photo anywhere (D-05); `about.profileImageUrl` and `about.dob` unused.
10. No `prefers-color-scheme` logic; no writes to the CLI theme key.
11. No nested anchors — one link per project card; the resume row is one link.
12. No edits to `portfolio-main-data.json` (D-08); `PanelPlaceholder`/`EXPLORE_PANEL_HUMOR` may be deleted as dead code, but the chrome-row and grid classes they carried must re-appear byte-identical in the replacement.

---

*UI Spec for phase 02-explore-content · prepared by gsd-ui-researcher · 2026-09-21*