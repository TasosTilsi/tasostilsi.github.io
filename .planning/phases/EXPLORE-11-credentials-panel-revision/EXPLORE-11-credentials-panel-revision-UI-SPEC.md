Below is the full UI-SPEC.md content for the orchestrator to write to:

```markdown
# Phase 11: credentials-panel-revision - UI-SPEC

**Gathered:** 2026-09-26T08:20:00.000Z  
**Status:** Ready for planning

## 1. Goal

Design the visual, interaction, and responsive contract for the new **Credentials** panel that sits beside the Projects stack on `/explore`. The panel is a calm, tabbed surface that surfaces featured articles, certifications, and presentations as compact anchor rows. It extends the existing phase-7 panel vocabulary and shadcn Tabs primitive, adds no new motion, and feeds the 5-section drawer/counter/visited re-map.

## 2. Layout

### 2.1 Page grid — row 3 rebalanced

The `ExplorePanels` grid keeps its existing 1-col base / 2-col `md` layout (`grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5`). Row 3 changes from a single full-width Projects cell to a **two-cell sibling pair**:

| Breakpoint | Row 3 layout |
|---|---|
| Base (< `md` / 768px) | Projects stack full-width, then Credentials panel full-width below it (vertical stack). |
| `md` and up | Left cell: Projects stack (~60% of the row width). Right cell: Credentials panel (~40% of the row width), side-by-side. |

Implementation note: because the parent is a 2-column grid, the exact ratio is achieved by ** Projects**: let it span the left column naturally (the 2-col grid gives it roughly half the row, then the Credentials panel fills the remainder), while the Projects stack stage internally centers and clamps its own width. The Projects stack is **not** widened; it keeps its existing centered composition and simply lives inside the narrower left column. The stack’s `cardState` geometry is container-relative, so it adapts to the reduced column width without new logic. The Credentials panel occupies the right column.

DOM order = visual order = tab order: the Credentials panel renders **after** the Projects panel in the grid, so at `<md` it stacks below the Projects stack. No `order-*` utility is used.

### 2.2 Credentials panel chrome

The Credentials panel uses the same `PanelShell` chrome as every other panel:

```text
┌─────────────────────────────────────┐
│ ● Credentials                 05    │  ← 8×8px chart-5 accent dot + label + zero-padded mono index
├─────────────────────────────────────┤
│ [Articles] [Certifications] [Pres…] │  ← tab list (shadcn TabsList)
├─────────────────────────────────────┤
│ ○ Article title              Sep 14 │  ← active tab content: anchor rows
│ ○ Another featured title     May 26 │
│ …                                   │
└─────────────────────────────────────┘
```

- **Section id:** `credentials` (stable hash target for drawer anchors and IO).
- **Label:** `Credentials`.
- **Accent:** `bg-chart-5` (the free chart slot after the phase-9/10 re-map).
- **Index:** `05`, derived from `EXPLORE_SECTIONS` map position (zero-padded by the caller, no literals).
- Shell classes remain identical to other panels: `rounded-md border bg-card p-4`.
- The panel is **not** a sticky extended wrapper; it renders at natural height inside its grid cell.

### 2.3 Tab list anatomy

Inside the shell body, the tab list sits immediately under the chrome with `mt-3` (the shell body gap) plus an additional `mb-3` to separate it from the row list.

- Tabs primitive: existing `src/components/ui/tabs.tsx` (`Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`).
- Tab labels (locked): **Articles | Certifications | Presentations**.
- Default tab: **Articles** (the most current/primary credibility signal; SSR renders this tab’s rows).
- Tabs list style: reuse the shadcn default `TabsList` (`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground`).
- Tab triggers are full text (no truncation) and use the shadcn `TabsTrigger` recipe.

### 2.4 Row list anatomy

Each tab renders a vertical stack of anchor rows. Rows are **not** cards; they are compact list items.

- Container: `flex flex-col` with no gap (dividers separate rows).
- Each row: `flex items-center gap-3` with a **minimum height of 44px** (`min-h-[44px]` or `py-3` to guarantee 44px-equivalent touch targets).
- Left icon: a small `Link` or `FileText` / `Award` / `MonitorPlay` lucide icon, 16px, `text-muted-foreground`, `shrink-0`, `aria-hidden="true"`.
- Title: `text-sm font-medium text-foreground`, `min-w-0 truncate`.
- Date: `text-xs tabular-nums text-muted-foreground`, `shrink-0`, placed at the right end.
- External link arrow (`ArrowUpRight`, 14px) appears on hover/focus inside the active row, nudged via the existing `.exp-nudge` vocabulary.

A subtle 1px divider (`border-b border-border`) separates rows; the last row has no bottom border.

### 2.5 Responsive specifics

| Concern | Base (<`md`) | `md`+ |
|---|---|---|
| Grid | 1 column; Credentials stacks below Projects. | 2 columns; Credentials sits beside Projects. |
| Panel | Full-width inside the grid cell. | ~40% right column. |
| TabsList | Triggers may wrap if needed; font `text-sm`. | Same, no wrap expected for 3 short labels. |
| Row title | `truncate` ensures no overflow at 375px. | Same. |
| Row min-height | 44px. | 44px. |
| Row date | always visible. | always visible. |

The 375px invariant: at 375px the Credentials panel is full-width below the stack; no horizontal overflow occurs; no content is clipped.

## 3. Interaction States

### 3.1 Tab triggers

| State | Visual | Behaviour |
|---|---|---|
| **Default** | `text-muted-foreground`, transparent background. | Click/tap switches tab. |
| **Hover** | `hover:text-foreground` + subtle `hover:bg-muted/50` if not active. | Cursor pointer. |
| **Active (`data-[state=active]`)** | `bg-background text-foreground shadow-sm rounded-sm`. | The corresponding `TabsContent` is unmounted/mounted by Radix. |
| **Focus visible** | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`. | Ring offset ensures visibility on both themes. |
| **Disabled** | Not used (all 3 tabs always enabled). | N/A. |
| **Loading** | Not used. | N/A. |

Keyboard behaviour is provided by Radix Tabs: arrow keys move focus between tab triggers, `Home`/`End` jump to first/last, `Tab` moves into the active tab panel.

### 3.2 Anchor rows

Every row is a real `<a>` element.

| State | Visual |
|---|---|
| **Default** | Title `text-foreground`, date `text-muted-foreground`, left icon `text-muted-foreground`, no underline. |
| **Hover** | Title color shifts to `text-accent` and gains an underline (`underline underline-offset-4 decoration-from-font`); the external arrow icon nudges 2px right via `.exp-nudge`; background gets `hover:bg-muted/40` across the whole row. |
| **Active (press)** | Row background `active:bg-muted/60`; title stays accent; arrow settles. |
| **Focus visible** | Same `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background` recipe as other interactive elements; the ring wraps the entire row. |
| **Disabled** | Not used; rows without a link must not be rendered as rows (see §5.2). |
| **Loading** | Not used. |

The entire row is the hit target (44px min-height). The external link arrow is decorative and `aria-hidden`.

### 3.3 Panel container

`PanelShell` is non-interactive, per the existing contract: no hover, no cursor change, no focus ring on the panel itself.

### 3.4 Drawer anchor

The drawer gains a fifth anchor row for `credentials`:

| State | Visual |
|---|---|
| Default | Same as existing drawer anchors: `min-h-[44px]`, `px-2`, `text-sm`, leading `05` digit in `text-chart-5`. |
| Hover | `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`. |
| Focus visible | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring`. |

Clicking the anchor closes the drawer and scrolls to `#credentials`.

## 4. Visual Behaviour

### 4.1 Motion policy — calm

- **No new animation vocabulary** for the Credentials panel.
- The only motion is the existing phase-7 entrance stagger: because the Credentials panel is a new child of `.panel-grid`, it inherits the `explore-panel-in` CSS keyframe and the `nth-child(5)` delay (140ms, same cascade). If the stagger delay rules are extended to a fifth child, the panel fades/slides in; if not, it still renders at natural opacity (the animation uses `backwards`, but content is never hidden).
- **No framer-motion import** in the Credentials panel files. Framer-motion remains allowed only in `projects-stack-stage.tsx` (phase-9/10 pin).
- Tab switching is instant; Radix supplies only the unmount/mount semantics, no transition.
- Hover/focus row states use the existing `.exp-nudge` + underline vocabulary (CSS transitions). These are suppressed by the existing reduced-motion guard (`@media (prefers-reduced-motion: reduce)`).

### 4.2 Empty states

| Scenario | Behaviour |
|---|---|
| Featured articles array empty | Render a single calm row: “No featured articles.” in `text-muted-foreground`, no link. |
| Featured certifications array empty | Render “No featured certifications.” |
| Featured presentations array empty | Render “No featured presentations.” |
| Single presentation (current reality) | One row: “Boosting Your Team's Clarity with Allure Reporting” + date + link. |
| A row has no `link` | Do not render it as a row; omit it from the list. If that empties the tab, fall back to the empty-state message. |

### 4.3 Error states

- Data errors are not part of this phase (the JSON is statically imported). If type checking reveals a malformed presentation entry, the TypeScript contract fails the build.
- No runtime fetch → no loading skeleton or error retry UI.

### 4.4 Theme legibility

Both dark and light `/explore` themes must keep rows legible:

- Title: `text-foreground` (adapts to theme).
- Date/icon: `text-muted-foreground`.
- Hover title: `text-accent` (the theme-specific accent token).
- Focus ring: `ring-ring` (theme-specific).
- Panel background: `bg-card`, borders `border-border`.

### 4.5 Reduced motion

The existing reduced-motion guard (`@media (prefers-reduced-motion: reduce)`) already suppresses `transition` and `animation` inside `.explore-shell`. The Credentials panel adds no exceptions; its hover nudge and row background transitions are automatically removed.

## 5. Data & Content

### 5.1 Featured collections

The panel renders **featured-only** items from `src/data/portfolio-main-data.json`:

- **Articles tab:** items with `featured: true` in `data.articles`. Current JSON count: 5.
- **Certifications tab:** items with `featured: true` in `data.certifications`. Current JSON count: 5.
- **Presentations tab:** items with `featured: true` in `data.presentations`. Current JSON count: 1 after the `featured: true` flag is added to the Allure Reporting entry.

### 5.2 Presentation featured flag

The single presentation entry gains `featured: true` in the JSON, and the `.d.ts` `Presentation` interface gains `featured?: boolean` in the same commit (same pattern as `Certification` and `Article`).

### 5.3 Row field mapping

| Tab | Primary text | Secondary text | Link |
|---|---|---|---|
| Articles | `article.name` | `article.date` | `article.link` |
| Certifications | `certification.name` | `certification.date` + optional ID when `link` looks like an ID | `certification.link` if truthy; if `link` is `null` or an ID string, the row still renders but is not clickable (see §5.4). |
| Presentations | `presentation.name` | `presentation.date` | `presentation.link` |

Certification link handling nuance: some entries store a verification ID (e.g., `"ID: GRTB-…"`) in `link`. If `link` is present but does not start with `http`, render the ID as muted text next to the date and do **not** make the row an external anchor (the whole row stays plain text). If `link` is `null`, the row is plain text.

Date formatting: render the JSON date string verbatim (no reformatting). Dates vary in shape (`Sep 14, 2026`, `June 2025`, `November 2025`); keep them as-is to avoid mismatch with tests/data.

### 5.4 External link affordance

Rows with a real URL get:
- `target="_blank"`
- `rel="noopener noreferrer"`
- An `ArrowUpRight` icon that appears on hover/focus.

Plain-text rows (certification ID-only or null link) get no anchor semantics and no external icon.

## 6. Accessibility

- **Section landmark:** the panel is a `<section id="credentials" aria-label="Credentials">` via `PanelShell`.
- **Tabs:** Radix Tabs supplies `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, and arrow-key navigation. The default tab (`Articles`) is selected on load.
- **Tabpanel label:** each `TabsContent` should carry `aria-label` matching its tab text (or rely on Radix’s implicit association via `aria-controls` + `aria-labelledby`). Prefer the Radix default wiring; do not invent duplicate ARIA.
- **Rows:** anchor rows are real links; focus order flows through them naturally. The external arrow is `aria-hidden`.
- **Empty states:** the empty message is plain text, not a link.
- **Color contrast:** all text uses theme tokens that already pass 4.5:1 in both dark and light shells.
- **Touch targets:** tab triggers and rows meet 44px minimum.
- **Reduced motion:** covered by the existing CSS guard.

## 7. Section/Flow Re-mapping

Adding the `credentials` section triggers the following downstream updates, all deriving from `EXPLORE_SECTIONS`:

- `EXPLORE_SECTIONS` becomes 5 entries: `[about, skills, experience, projects, credentials]`.
- Drawer anchors: 5 rows (`01 About`, `02 Skills`, `03 Experience`, `04 Projects`, `05 Credentials`). Digit accents follow the per-id map; `credentials` gets `text-chart-5`.
- Visited counter: status bar renders `${visitedCount}/${EXPLORE_SECTIONS.length} sections visited` → `N/5`. Accent at `5/5`.
- IntersectionObserver marking: the `#credentials` panel is observed automatically because `use-explore-visited.ts` iterates `EXPLORE_SECTIONS`.
- Tour step table: stays the existing literal 6-step sequence (`welcome → about → experience → skills → projects → finish`). No Credentials step is added (deferred).

## 8. SSR / No-JS Contract

- The Credentials panel itself (chrome + default Articles rows) is server-rendered because it can be composed inside `ExplorePanels` as a server-compatible body.
- Tab switching requires the `Tabs` client boundary, so Certifications/Presentations tabs only appear after hydration. The default Articles rows are real text in the static export.
- The panel must therefore not rely on client-only data fetching; it receives the full `PortfolioData` prop and filters featured items synchronously.

## 9. Edge Coverage

| Edge | Correct behaviour |
|---|---|
| 375px viewport | Credentials panel full-width below Projects; no overflow; rows truncate; tabs fit. |
| No featured items in a tab | Show a single non-link empty-state row. |
| Certification `link` is an ID string | Render as plain text with ID visible; no external link. |
| Certification `link` is `null` | Render as plain text; no link. |
| Article/presentation `link` missing | Omit the row entirely. If all rows omit, show empty state. |
| Reduced motion enabled | No hover nudge, no panel entrance animation, no transition. |
| Keyboard-only navigation | Tab triggers arrow-key navigable; rows Tab-focusable; focus rings visible. |
| Hydration mismatch | Default tab is Articles server-side; client switches to default on hydrate to avoid mismatch (Radix defaultValue handles this). |
| Theme toggle | Panel recolors instantly via CSS variables; no JS re-render required. |
| Static export (`out/explore.html`) | Articles rows and panel chrome are present as real text; tab list is present. |
| Stale tests (4→5 sections) | The following tests/assertions must be renewed: `explore-shell.test.mjs` (4-section constant check, N/4 counter check), `explore-tour.test.mjs` (accent map 4 sections, N/4 counter check, 0/4 SSR check, welcome “four sections” copy). Update to expect 5 sections, N/5, 0/5, and “five sections” copy if the welcome body is updated. |

## 10. Implementation Notes (for the planner)

- New file: `src/components/explore/sections/credentials-section.tsx` — server component that imports `Tabs` (which has `"use client"` inside `tabs.tsx`) and renders the 3-tab panel. Because `Tabs` is a client primitive, `CredentialsSection` must itself carry `"use client"` if it uses state, OR it can be a server wrapper that passes children to a small client tab shell. Simpler: make `CredentialsSection` a client component (`"use client"`) that receives `data` props; it is a leaf island inside the server `ProjectsSection`/`ExplorePanels`, analogous to the project stacks.
- Do **not** put `framer-motion` in the new Credentials files.
- Update `src/components/explore/constants.ts`:
  - Append `{ id: "credentials", label: "Credentials" }` to `EXPLORE_SECTIONS`.
  - Add `credentials: 'bg-chart-5'` to `EXPLORE_TOUR_ACCENTS`.
  - `TourStep['sectionId']` type already uses `ExploreSectionId` and remains valid.
- Update `src/components/explore/explore-panels.tsx`:
  - Add `credentials` to `ACCENTS` (`bg-chart-5`).
  - Add `CredentialsSection` to `SECTION_BODIES` closure.
  - `buildPlacement` returns natural height for `credentials` (same as `about`/`skills`).
- Update `src/components/explore/explore-drawer.tsx`: add `credentials: 'text-chart-5'` to `DIGIT_ACCENTS`.
- Update `src/data/portfolio-main-data.json`: add `"featured": true` to the presentations entry.
- Update `src/data/portfolio-main-data.d.ts`: add `featured?: boolean` to `Presentation`.
- Renew stale tests as listed in §9.

## 11. Open / UNRESOLVED Decisions

- **(UNRESOLVED)** Whether the Credentials panel’s tab list should use a subtle top border or a `bg-muted` pill background. The shadcn default `TabsList` uses `bg-muted p-1`; recommend keeping it unless taste review objects.
- **(UNRESOLVED)** Exact row divider spacing (recommend 1px `border-b` between rows, no extra vertical gap, for the calm list aesthetic).
- **(UNRESOLVED)** Whether to render certification ID-only entries as a single combined “date · ID” secondary line or split them. Recommend combined line to keep row height uniform.

All other decisions are locked by this spec.
```

End of UI-SPEC.md content.