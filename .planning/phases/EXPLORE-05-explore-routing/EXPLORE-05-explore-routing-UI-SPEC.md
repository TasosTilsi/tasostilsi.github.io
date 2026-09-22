Grounding complete — I inspected every augment target and the four prior UI-SPECs. Three corrections to CONTEXT assumptions surfaced during inspection (help lists are hardcoded, not derived; header order is Tour→Theme→Drawer, not theme→drawer→tour; D-03 supersedes the phase-1 drawer-rightmost pin) — all pinned below. Full UI-SPEC.md follows.

---

# Phase 5: explore-routing — UI Spec

**Gathered:** 2026-09-22 (ui-researcher pass)
**Status:** Design contract — locked visual/interaction decisions for the planner
**Inputs:** EXPLORE-05 SPEC (locked, ambiguity 0.155), CONTEXT.md (D-01…D-05), phase-1…4 UI-SPECs (referenced, not relitigated), codebase inspection (cited inline)

## 0. Grounding (verified facts this contract relies on — including 3 corrections to CONTEXT assumptions)

| # | Fact | Source |
|---|---|---|
| 1 | **CORRECTION:** Help output does **NOT** derive from `AVAILABLE_COMMANDS` — `HelpOutput` and `AdvancedHelpOutput` are hardcoded `<li>` lists. Adding `explore` to `AVAILABLE_COMMANDS` auto-lists it nowhere; a literal `<li>` must be added to one of the two lists. | `src/components/cli/outputs/HelpOutput.tsx:8-22`, `AdvancedHelpOutput.tsx:13-29` |
| 2 | `AVAILABLE_COMMANDS` = 38 entries (constants.ts:55-62); Tab autocomplete (single/multi-match) and fuzzy "Did you mean" suggestions both derive from it. **CORRECTION (W-1): `experience` shares the 3-char prefix `exp` with the new `explore` — Tab on `exp` multi-matches BOTH (`TerminalInterface.tsx:444-459`, `startsWith` filter). No single-match autocomplete assertion may be authored on `exp`; see the §10 edge row.** | `constants.ts:55-62`, `TerminalInterface.tsx:299-304, 444-461` |
| 3 | `processCommand` returns `ReactNode` (→ pushed as `output` history line) or a sentinel object (`{ openModal: "resume" }` / `{ openModal: "presentation" }` → handled in `executeCommand`). The sentinel path is the established precedent for side-effecting commands. | `TerminalInterface.tsx:129-133, 352-386, 399-403` |
| 4 | Resume-command UX precedent for a perceptible pre-action line: system line with spinner + **800ms artificial delay** before the modal opens. | `TerminalInterface.tsx:360-372` |
| 5 | The CLI's sr-only live region renders **only when the last history line is type `output`** (`TerminalInterface.tsx:515-521`) and announces the **string** content of that line; node/`system` content is announced by NOTHING. **W-2 consequence:** the pinned `system`-type chrome line is SR-silent — accepted deliberately (machinery untouched; the route change is the meaningful announcement). Do not author tests asserting an announcement. | `TerminalInterface.tsx:515-521` |
| 6 | History lines render with type classes (`system` → `text-muted-foreground`, `output` → `text-foreground`); string content goes through `<pre className="whitespace-pre-wrap">`. | `TerminalInterface.tsx:525-547` |
| 7 | CLI link convention: `text-accent hover:underline` (plain anchors, browser-default focus outline, no custom focus classes). | `ContactOutput.tsx:47`, `TaasOutput.tsx:71` |
| 8 | **CORRECTION:** Header right-cluster source order is verified **Tour → Theme → Drawer** (Tour leftmost, drawer currently rightmost) — not the "theme → drawer → tour" prose in CONTEXT/code_context. | `explore-header.tsx:59-99` (Tour 63-71, Theme 73-86, Drawer 89-99) |
| 9 | **CORRECTION / supersession:** Phase-1 pinned "drawer RIGHTMOST" (re-affirmed phase-4 §5). **D-03 (newer, explicit) supersedes it**: the Terminal link becomes the new rightmost control. The stale assertion exists at TWO sites (W-3): the header doc comment `explore-header.tsx:4-11` AND the inline comment `explore-header.tsx:59-62` — **both** must be updated (comment-only edits) so no implementer reverts the order. | `explore-header.tsx:4-11, 59-62`, phase-4 UI-SPEC §5, CONTEXT D-03 |
| 10 | Ghost recipe (all three existing cluster buttons): `flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`; icon `h-5 w-5 aria-hidden`. The tour card's `GHOST_INTERACTION` constant is the same recipe minus layout classes. | `explore-header.tsx:68, 79, 94`, `explore-tour.tsx:60-61` |
| 11 | Header bar: `flex h-[52px] shrink-0 items-center gap-2 border-b bg-background px-4`; glyphs 3× `h-2.5 w-2.5` + inner `gap-2`, `aria-hidden`; two title spans (`md:hidden` name-only / `hidden md:inline` name — title), both `min-w-0 flex-1 truncate`. | `explore-header.tsx:36-58` |
| 12 | `@media (max-width: 640px) { html { font-size: 14px } }` — all rem-based classes shrink at 375px: `gap-2`→7px, `px-4`→14px, `h-2.5`→8.75px. px arbitrary values (`h-[44px]`, `h-[52px]`) are immune. | `globals.css:464-467` |
| 13 | WelcomeMessage DOM order: ASCII banner `<pre>` (`hidden sm:block`, `text-accent text-xs sm:text-sm`) → mobile banner `<div>` (`sm:hidden`) → 2× `TypingEffect` lines (rendered when `showTyping`, 100ms after mount) → tutorial box (first visit only, `localStorage['cli-visited']`) → trailing `<br />`. Column wrapper: `flex flex-col gap-2`. | `WelcomeMessage.tsx:24-65` |
| 14 | CLI body font stack comes from `globals.css:5-8` (Geist Mono); Tailwind's `font-mono` utility = the **default** mono stack (no `fontFamily` override in tailwind.config) — it is neither Geist nor JetBrains. `--font-jetbrains` is exposed on the root `<body>` (layout.tsx:129) and consumed only by `.explore-shell` (globals.css:500-502) — so the variable **is** available on CLI pages, but only via explicit `var(--font-jetbrains)`. | `globals.css:5-8, 500-502`, `layout.tsx:129`, `tailwind.config.ts` (no fontFamily block) |
| 15 | Panels grid: `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3`; full-bleed (no max-width container) → at 1920px the 3 columns stretch edge-to-edge. | `explore-panels.tsx:67` |
| 16 | Horizontal-scroll impossibility by construction: CLI shell has `overflow-hidden` (`(main)/layout.tsx:16`); explore shell root carries `overflow-x-hidden` (phase-1 §2.1). | `(main)/layout.tsx:16`, phase-1 UI-SPEC §2.1 |
| 17 | Wizard finish-card link: label `"Open the terminal →"`, `href: "/"`, rendered as `<Link … className="text-accent">` — **unchanged this phase**. | `src/components/explore/constants.ts:89-94` (`EXPLORE_TOUR_FINISH`), `explore-tour.tsx:435-437` |
| 18 | `TerminalInterface` mounts client-only (`dynamic(..., { ssr: false })`) → `useRouter`/`<Link>` navigation inside it is safe; CLI welcome content exists **only client-side** (nothing CLI-side is assertable in `out/index.html`). | `(main)/page.tsx:8-10` |
| 19 | `lucide-react` already imported in the header (`Compass, Menu, Moon, Sun`) — `Terminal` icon is available from the same package (zero new deps). | `explore-header.tsx:18` |
| 20 | Test harness pattern: `node --test`, source-level assertions + `out/`-export-level invariants; five existing files under `tests/`. JetBrains Mono advance = 0.6em (width-math constant). | `tests/explore-shell.test.mjs` et al. |

---

## 1. Design Contract Summary

Phase 5 wires a two-way loop between the CLI at `/` and `/explore`, all additive, all chrome copy: (a) one bracket-styled hyperlink line appended to the CLI welcome message; (b) one new `explore` command (chrome line → router navigation, listed in help); (c) one ghost Terminal link appended rightmost in the `/explore` header cluster; (d) a falsifiable 8-row breakpoint sweep (375/768/1440/1920 × /, /explore) with the right-cluster-fit math test pinned. **No panel, grid, visualization, wizard, status-bar, or drawer visual changes.** The only layout arithmetic in this phase is the header cluster at 375px (§4.3).

---

## 2. CLI Side A — Welcome link line (D-01, Req EXPLORE-05)

### 2.1 Position (pinned)

- Insert **one** new element between the tutorial-box conditional block and the trailing `<br />` in `WelcomeMessage.tsx` (i.e. after line 62, before line 63). JSX/DOM order becomes: banner → mobile banner → typed lines → tutorial box (first visit only) → **link line (always)** → `<br />`.
- The line renders **unconditionally on every welcome render** — first visits (below the tutorial box) and return visits (below the typed lines). It is the routing entry point; it is never hidden.
- The rest of the welcome message renders **byte-identical** (banner, mobile banner, typed lines, tutorial box, trailing `<br />` all untouched).

### 2.2 Anatomy (token table — exact string `[ NEW → visual tour: explore ]`, one line)

| Token | Render | Style |
|---|---|---|
| `[` | static span | `text-accent` |
| `NEW` | static text (attention flag) | `text-accent` — may share the same span as `[` |
| `→` (U+2192) | static span | `text-accent` |
| `visual tour:` | static text | `text-muted-foreground` |
| `explore` | **the link** — `<Link href="/explore">` (next/link), same tab, no `target`/`rel` | `text-accent hover:underline` (CLI convention, §0#7) |
| `]` | static span | `text-accent` |

- Wrapper: `<p className="text-sm">` — matches the tutorial box's `text-sm` at all widths (the surrounding history container is `text-sm md:text-base`; the link line deliberately pins `text-sm` to match the tutorial box).
- Font: the line sets **JetBrains Mono explicitly** — `style={{ fontFamily: 'var(--font-jetbrains), var(--font-geist-mono), Menlo, Monaco, "Courier New", monospace' }}` (or an equivalent scoped class). Do **not** use Tailwind `font-mono` — it resolves to the default mono stack, not JetBrains (§0#14). The SPEC's locked wording "JetBrains Mono" is honored via the CSS variable; the subtle visual difference from the surrounding Geist-rendered welcome text is **accepted and intended** (a quiet cross-surface cue). Verifier note: the line differing in typeface from the rest of the welcome is contract-correct, not a defect.
- Spacing: no extra margins — the column's `gap-2` supplies 8px above; the untouched trailing `<br />` supplies the break below. On first visits the tutorial box's `my-2` stacks with `gap-2` (≈16px) — accepted.
- No `whitespace-nowrap` needed: 30 chars × 0.6em — ≈220px at 375px (`text-sm` = 12.25px effective at the 14px root) against ≈361px available. Single line at every sweep width by math (§7).

### 2.3 Interaction states

| State | Contract |
|---|---|
| Default | accent `explore` token, no underline; brackets/arrow static accent (never hover-styled) |
| Hover | `hover:underline` on the link token only (CLI convention); cursor: pointer (native anchor) |
| Active/pressed | same as hover (no scale, no color shift) |
| Focus-visible | **browser default outline** — the CLI has no custom focus-visible conventions and this phase must not introduce one (regression-surface cleanliness, §13) |
| Disabled / Loading / Error | n/a — plain client-side `<Link>`; navigation is instant on a static export (prefetch is on by default) |

- **Not** wrapped in `TypingEffect`; renders statically with the welcome. The typing animation above it does not shift it (each typed string fits one line at 375px: 32 chars ≈ 235px < 361px).
- Benign known interaction: clicking the link bubbles to the container's `handleContainerClick` (refocuses the hidden input) — harmless, precedes navigation, **do not** add `stopPropagation`.

### 2.4 Accessibility

- Accessible name = `explore` (natural link text). The line reads as one flow: `[ NEW → visual tour: explore ]`. No `aria-label`, no `aria-hidden` on any token (brackets are meaningful punctuation here).
- Inline text link → **exempt from the 44px touch-target rule** (same class as every existing CLI output link, §0#7; the 44px rule governs controls/buttons).
- No-JS: unchanged CLI condition — the CLI renders client-only (§0#18); nothing to contract.

---

## 3. CLI Side B — `explore` command + help entry (D-02, Req EXPLORE-05)

### 3.1 Command behaviour (visual contract)

- Executing `explore` prints **exactly one** chrome line then navigates to `/explore` via Next's router (`useRouter().push('/explore')` or a `{ navigate }` sentinel handled in `executeCommand` like the `openModal` precedent, §0#3) — planner's mechanism choice; visual behaviour identical either way.
- Chrome line format (mirrors the welcome-line bracket aesthetic): `[ opening the visual tour... ]` — brackets in `text-accent`, inner text `text-muted-foreground`, rendered as a `system`-type history line (renders `text-muted-foreground` at container level; spans override per token). Implementation as a ReactNode (not a plain string) is the default so it can carry accent spans.
- Perceptibility: the chrome line should be on screen ≥ ~0.8s before the route swaps — default **800ms delay before navigation**, following the resume-loading precedent (§0#4). **W-4 pins:** (a) the chrome line **persists untouched until the route swaps — no replacement/success line** (the resume precedent REPLACES its loading line at `TerminalInterface.tsx:360-386`; do not mirror that second line — "exactly one" wins); (b) the input stays **enabled** during the window — a racing second command (including a second `explore`) simply prints its own chrome line (harmless, same route); (c) the delay is stated once here — resolved to the 800ms default, §12 no longer carries a zero-delay fork.
- `explore` with any arguments: args ignored, navigation always happens. No flags, no `-a` behaviour.
- **No** achievement unlocks, **no** easter-egg triggers on `explore` (existing sets untouched, D-05).
- Command is recorded in `commandHistory` (existing machinery, automatic); appears in Tab multi-match on the `e` prefix and in fuzzy suggestions (existing machinery, automatic).

### 3.2 Help entry (hardcoded — §0#1 correction)

- Add one `<li>` to **`AdvancedHelpOutput`** (default, §12) matching that list's literal pattern — name in the `text-primary w-32 inline-block` column, literal-space alignment like its siblings, then ` - ` + description:
  `<li><span className="text-primary w-32 inline-block">explore</span>               - Open the visual tour (/explore)</li>`
- Description wording is chrome copy, planner-discretion; the default above is recommended. If the planner instead adds it to the main `HelpOutput` (w-36 column), the same visual pattern applies. Exactly one help list gains the entry (not both).

### 3.3 Screen-reader behaviour (accepted tradeoff)

- The pinned chrome line is `system`-type, and the sr-only live region renders **only for `output`-type history lines** (§0#5, corrected) — therefore **nothing announces this command's response** (W-2 resolution: silence accepted deliberately; the machinery is untouched, and the route change itself is the meaningful announcement — page title / landmarks change). Do not add a second string line just for SRs (one chrome line only, D-02), do not author tests asserting an announcement, and do not reclassify the line as `output` (that would alter CLI rendering machinery).

---

## 4. Explore Side — Header Terminal link (D-03, Req EXPLORE-05b)

### 4.1 Cluster anatomy after this phase (pinned)

Order, left → right, of the right cluster: **Tour → Theme → Drawer → Terminal**.

- The three existing controls stay **byte-identical** (positions, classes, order). The Terminal link is **appended after `</ExploreDrawer>`** as the last child before `</header>` — it becomes the new rightmost control.
- D-03 explicitly supersedes the phase-1 "drawer RIGHTMOST" pin (§0#9). Duty: update the stale comment at `explore-header.tsx:4-11` (comment-only edit) so the file's self-description matches reality.
- Focus/tab order = DOM order: Tour → Theme → Drawer trigger → Terminal link.

### 4.2 Terminal link element (locked recipe)

```tsx
<Link
  href="/"
  aria-label="Open the terminal"
  className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
>
  <Terminal className="h-5 w-5" aria-hidden="true" />
</Link>
```

- `next/link`, same tab (no `target`), lucide `Terminal` icon `h-5 w-5 aria-hidden` (same icon scale as the cluster), `shrink-0` (never squeezed by the truncating title), **no `id`** (nothing returns focus to it), no tooltip/`title` (cluster consistency: aria-label only).
- 44px **real px** — px arbitrary classes, immune to the ≤640px rem shrink (§0#12). Never convert to rem.

### 4.3 375px right-cluster math (the D-04 pinned test — normative formula)

At 375px (root = 14px per §0#12), the header's fixed-width content:

```
glyphs   = 3 × 8.75px (h-2.5) + 2 × 7px (inner gap-2)          = 40.25px
buttons  = 4 × 44px (Tour, Theme, Drawer, Terminal — px classes) = 176.00px
gaps     = 5 × 7px (header gap-2 across 6 visible children)     = 35.00px
padding  = 2 × 14px (px-4)                                      = 28.00px
fixed    = 279.25px  →  title (flex-1 min-w-0) ≈ 95.75px
```

- **Assert in test:** `fixed(375) + 64px (minimum viable title) ≤ 375px` → `279.25 + 64 = 343.25 ≤ 375` ✓. Plus source-level assertions: all four cluster controls carry `h-[44px] w-[44px] shrink-0`; both title spans carry `min-w-0 flex-1 truncate`; header carries `gap-2 px-4 h-[52px]`.
- **No compression is required** — the cluster fits at 375px as-is. Contingency ladder **only if** the math (or the manual pass) fails, in priority order: (1) `gap-2` → `gap-1` on the header at base breakpoint only (saves ≈10px); (2) `px-4` → `px-2` on the header at base only; (3) **never** shrink any touch target below 44px; (4) **never** hide the window glyphs (phase-1 §3 pin: glyphs visible at 375px).
- Note on SPEC wording: the acceptance line lists "theme toggle, Tour button, Terminal link" (3 controls) but the implemented cluster has **4** (drawer included); the math test must cover all 4 — the drawer is part of the binding constraint.
- Title at 375px truncates to ≈13 visible chars ("Anastasios…") — **expected**; the title is the only truncating element (invariant).

---

## 5. Two-Way Loop Map (acceptance: "complete two-way loop")

| # | From → To | Mechanism | Phase |
|---|---|---|---|
| 1 | `/` → `/explore` | Welcome link line (`explore` token, `<Link>`) | 5 |
| 2 | `/` → `/explore` | `explore` command (chrome line → router push) | 5 |
| 3 | `/explore` → `/` | Header Terminal link (new rightmost, `<Link>`) | 5 |
| 4 | `/explore` → `/` | Wizard finish card `"Open the terminal →"` | 4 — **unchanged, regression-verified only** |

All four navigate same-tab. Browser Back after any of them: `/` remounts the CLI fresh (welcome + link line re-render; no CLI state survives navigation — existing behaviour).

---

## 6. Interaction-State Matrix (phase-5 controls only; everything else = prior-phase contracts unchanged)

| Control | Default | Hover | Active/Pressed | Focus-visible | Disabled | Loading | Error |
|---|---|---|---|---|---|---|---|
| Welcome link token `explore` | `text-accent`, no underline | `hover:underline` | same as hover | browser default outline | never | n/a (instant client nav) | n/a |
| Welcome brackets / `NEW` / `→` / `]` | static `text-accent` | — | — | — | n/a (not interactive) | — | — |
| `visual tour:` text | static `text-muted-foreground` | — | — | — | n/a | — | — |
| `explore` command chrome line | bracket line in history (`system`) | — | — | **sr: silent (W-2 — region renders for `output` lines only; §3.3)** | n/a | visible ≥ ~0.8s (resolved 800ms delay, W-4), then route swap | n/a |
| Help list `explore` entry | static list row, `text-primary` name column | — | — | — | n/a | — | — |
| Header Terminal link | ghost 44px, `muted-foreground` icon | `bg-muted` | same as hover (no scale) | `ring-2 ring-ring ring-offset-2 ring-offset-background` | never | n/a (instant client nav) | n/a |
| Finish-card link (regression) | `text-accent` (phase-4 §7) | unchanged | unchanged | unchanged | never | n/a | n/a |

No async data, no empty states, and no error states are introduced by this phase — all three new surfaces are static chrome or instant client navigation.

---

## 7. Breakpoint Sweep Contract (D-04, Req EXPLORE-06)

### 7.1 Artifact & format

- Committed to **`.planning/phases/EXPLORE-05-explore-routing/EXPLORE-05-explore-routing-SWEEP.md`** (default name, §12).
- **8 canonical rows** — exactly one per {375, 768, 1440, 1920} × {`/`, `/explore`}. Each row: checklist (sub-items with method tags) → result → defects → manual-pass checkbox:

```
### R5 · /explore · 375px
Checks: <bulleted checklist, each tagged TEST / MATH / EXPORT / MANUAL>
Result: PASS | DEFECT-SWEEP-NN
Defects: SWEEP-01 — <description> → fix commit <sha>, test <file:case>
Manual visual pass: ☐ (user's final pass)
```

- Method tags: **TEST** = source-level `node --test` assertion; **MATH** = computed-width formula in a test (numbers hardcoded from this contract); **EXPORT** = `out/*.html` invariant; **MANUAL** = user's visual pass (marked, cannot be automated).
- Summary table at top of the artifact: Row | Route | Width | Result | Defects fixed (tests).

### 7.2 Per-row checklists

**`/` (CLI) rows — source-level only (CLI renders client-only, §0#18):**

| Row | Checks |
|---|---|
| R1 · 375 | ASCII banner `hidden sm:block` asserted (hidden at 375 — expected); mobile banner present; link line single-line fit (MATH: 30 chars ≈ 220px ≤ 361px); prompt row wraps below prompt at 375 (existing `flex-wrap` design — known-expected, not a defect); shell `overflow-hidden` asserted; no horizontal scroll [MANUAL] |
| R2 · 768 | ASCII banner visible (`sm:block`, ≈44 cells ≈ 370px — fits); link line at `text-sm` (pinned); welcome order intact |
| R3 · 1440 | banner + link line + prompt row class assertions; layout pass |
| R4 · 1920 | no max-width container (full-bleed output); link line position sane [MANUAL] |

**`/explore` rows:**

| Row | Checks |
|---|---|
| R5 · 375 | **Right-cluster math test (§4.3 — normative)**; 4×44px classes; title `min-w-0 flex-1 truncate` on both spans; shell `overflow-x-hidden` asserted; status-bar full copy fits (phase-1 §7 math — regression); grid-cols-1; no horizontal scroll [MANUAL] |
| R6 · 768 | `md:grid-cols-2` + About span-2 (phase-1 §6 — regression); `md:inline` title variant; cluster math at 16px root (fixed = 294px, title ≈ 474px — **known-expected**: full "name — title" needs ≈479px, so the title may ellipsize its last word; accepted, title-only-truncates invariant holds) |
| R7 · 1440 | `lg:grid-cols-3` + About span-2; title shows full string |
| R8 · 1920 | no max-width container asserted (full-bleed 3-col stretch); no non-title element clips/truncates [MANUAL aesthetics] |

**EXPORT-level invariant (applies to the `/explore` rows):** `out/explore.html` contains the Terminal link markup — `aria-label="Open the terminal"` and `href="/"` (client components SSR at build; phase-4 §0 precedent for the Tour button).

### 7.3 Defect protocol

1. Any failed check ⇒ row = `DEFECT-SWEEP-NN` (SWEEP-01, SWEEP-02, …) with the description in the row.
2. Every defect is fixed; the fix commit carries a test (new `tests/explore-sweep.test.mjs` by default, or an extension of the existing suite files — planner's call) that fails without the fix.
3. Re-run ⇒ row flips to `PASS (fixed by <test>)`. A row may end `PASS` with zero defects.
4. **Scope reconciliation (pin — resolves the CONTEXT tension):** "every discovered defect fixed" authorizes *responsive-defect* fixes — horizontal overflow, clipped/truncated non-title content, shrunk touch targets, wrap breakage — including adjusting responsive classes inside panels/wizard **when the defect is recorded in the sweep table**. Visual redesign of panels/grid/wizard/status bar remains out of scope (D-05). Cosmetic-at-1920-only observations that violate no check are recorded as notes, not defects.
5. Every row ends with the **manual visual pass checkbox** for the user's final pass — the sweep is not "done" until all 8 checkboxes are ticked.

### 7.4 Known-expected register (pre-declared so the sweep doesn't record false defects)

| Observation | Verdict |
|---|---|
| Title truncates to ≈13 chars at 375px | expected (only-truncating-element invariant) |
| Title may ellipsize its final word at exactly 768px (≈479px needed vs ≈474px available) | expected (same invariant) |
| CLI input row wraps below the prompt at 375px | expected (existing `flex-wrap` design) |
| ASCII banner hidden at 375px | expected (`hidden sm:block`, phase-1 design) |
| Link line renders in JetBrains Mono amid Geist-rendered welcome text | expected (SPEC-locked, §2.2) |
| Chrome line announces generically to SRs | expected (§3.3 accepted tradeoff) |

---

## 8. Motion & Reduced Motion

- **Phase 5 introduces zero new motion.** The link line, chrome line, help entry, and Terminal link are static. Navigation via `<Link>`/router is a route swap, not an animation.
- Existing guards untouched: reduced-motion CSS guard for `.explore-shell` + portal (phase-1 §12), CLI theme swap instant (phase-1 §9.1). `prefers-reduced-motion` needs no phase-5 branch — nothing animated is added.
- The optional 800ms pre-navigation delay (§3.1) is a timer, not an animation — it applies identically under reduced motion.

## 9. Accessibility Contract

- **New tabbable elements:** the welcome link token (1, CLI) and the header Terminal link (1, /explore). Focus order /explore header: Tour → Theme → Drawer trigger → Terminal; while the drawer is open Radix traps focus (Terminal unreachable — correct); on drawer close focus returns to the drawer trigger (Radix default, unchanged).
- **Post-navigation focus (W-5 pin):** after navigating via the welcome link, the `explore` command, or the Terminal link, focus follows the browser/Next.js App Router default (the origin element unmounts; focus falls back to `<body>`) — **no focus management is added this phase**, consistent with the untouched phase-4 finish-card precedent. A verifier must not hunt for focus restoration as a defect.
- **Names:** welcome link = `explore` (natural text, §2.4); Terminal link = `aria-label="Open the terminal"` (locked).
- **Contrast:** `text-accent` and `text-muted-foreground` in both CLI themes and both explore themes — existing tokens, verified in prior phases (phase-1 §9.2/§9.3: accent ≥4.5:1 as used; muted-foreground ≥5:1 dark / ≈6.5:1 light). No new colors.
- **Touch targets:** header Terminal link 44×44 real px (px classes, §4.2); welcome link exempt as an inline text link (§2.4).
- **Live region:** chrome line announces generically (§3.3 — accepted, documented, do not add a second line).
- **Keyboard:** Enter on either link navigates same-tab (native anchor semantics via `<Link>`); no traps introduced; ESC behaviour unchanged everywhere.

## 10. Edge Coverage (explicit)

| # | Edge | Contract |
|---|---|---|
| 1 | First visit to `/` (tutorial shown) | Link line renders below the tutorial box (§2.1) |
| 2 | Return visit (no tutorial) | Link line renders below the typed lines, same JSX slot — always present |
| 3 | `clear` command | Welcome remounts → link line re-renders (unconditional) |
| 4 | `explore` with args / repeated invocations | Args ignored; navigation every time; each run prints its one chrome line |
| 5 | Unknown near-miss `explor` | Existing fuzzy machinery suggests `explore` (automatic, §0#2) |
| 6 | Tab on `e` prefix | Multi-match list includes `explore` alongside experience/education/echo (existing behaviour) |
| 7 | Back-navigation after any loop path | CLI remounts fresh with the link line; explore remounts with its persisted theme (existing scripts) |
| 8 | Drawer open → Terminal link | Radix focus trap excludes it; order/focus-return unchanged (§9) |
| 9 | **Tab on `exp` prefix (W-1 pin)** | Multi-match: BOTH `experience` and `explore` listed (existing `startsWith` machinery) — expected, not a defect; no single-match assertion may exist |
| 10 | **Racing second `explore` within the 800ms window (W-4 pin)** | Input stays enabled; the second command prints its own chrome line (harmless, same route); no input lock is added |
| 9 | Theme toggle while Terminal link focused | Instant token swap; ghost states valid in both explore themes (§9) |
| 10 | 375px cluster fit | Math in §4.3 (normative test); compression ladder only on failure |
| 11 | Stale "drawer rightmost" comment | Updated comment-only (§0#9) — no implementer reverts the order |
| 12 | Help entry discoverability | Exactly one help list gains the `explore` `<li>` (§3.2); autocomplete/fuzzy already derive from `AVAILABLE_COMMANDS` |
| 13 | `/resume` + data files | Zero edits — byte-untouched (D-05; verifier greps the diff) |
| 14 | Reduced motion | Nothing animated added (§8) |
| 15 | Typing flow integrity | Link line is static, outside the typed spans; typed strings fit one line at 375 (§2.3) — no reflow of the link line |

## 11. Verifier Hooks (acceptance → contract section)

| SPEC acceptance | Proof |
|---|---|
| Exactly one bracket-styled link line, pinned format, after tutorial box, rest byte-identical | §2.1–§2.2 (+ test: source-level string/class assertions on WelcomeMessage) |
| `explore` command in AVAILABLE_COMMANDS + help, routes via router same-tab | §3.1–§3.2 (+ §0#1 correction recorded) |
| One Terminal ghost link, 44px real px, aria-label, rightmost, same-tab | §4.1–§4.2 (+ EXPORT invariant §7.2) |
| Complete two-way loop (4 paths) | §5 |
| Sweep table committed, 8 rows, every defect fixed w/ test, zero h-scroll at 4 widths | §7.1–§7.3 (+ §0#16 construction guarantees) |
| Right-cluster fits 375px, all targets 44px real px, title only truncating element | §4.3 (normative MATH test) + §7.4 expected-truncation register |
| No new deps; CLI additive-only; /resume byte-untouched | §13 prohibitions + §10#13 |

## 12. (UNRESOLVED) / (OPTIONAL) Register — planner assumes these defaults

| Marker | Item | Default if unaddressed |
|---|---|---|
| (UNRESOLVED) | Word-level colors beyond the locked set (brackets + arrow accent are locked): `NEW` | `text-accent` (shares the bracket span) |
| (UNRESOLVED) | `visual tour:` text color | `text-muted-foreground` |
| (UNRESOLVED) | JetBrains Mono mechanism for the link line | explicit `fontFamily: 'var(--font-jetbrains), …'` (never Tailwind `font-mono`, §2.2) |
| (UNRESOLVED) | Which help list carries the `explore` entry | `AdvancedHelpOutput`, description `Open the visual tour (/explore)`, w-32 column pattern |
| (UNRESOLVED) | Chrome-line wording (D-02 leaves it to discretion) | `[ opening the visual tour... ]` (brackets accent, inner muted) |
| (RESOLVED — W-4) | Pre-navigation delay for the chrome line | **800ms, resolved** (resume precedent, §0#4; §3.1 pins the persistence + input-enabled semantics) |
| (UNRESOLVED) | Command navigation mechanism (direct `router.push` in the case vs `{ navigate }` sentinel) | planner's choice — visual contract §3.1 identical |
| (UNRESOLVED) | Sweep artifact filename | `EXPLORE-05-explore-routing-SWEEP.md` in the phase dir |
| (UNRESOLVED) | Sweep test file | new `tests/explore-sweep.test.mjs` (or extension of existing files) |
| (OPTIONAL) | Subtle hover glow on the welcome link beyond `hover:underline` | skip it |
| (OPTIONAL) | Tooltip/`title` on the Terminal link | skip it (cluster consistency) |

## 13. Prohibitions (locked — do not relitigate)

1. No edits to `/resume`, `src/data/**`, or any existing CLI command/theme/achievement/easter-egg/output beyond the three additive CLI surfaces (welcome line, `AVAILABLE_COMMANDS` entry, handler case, one help `<li>`) — D-05.
2. No new packages (lucide `Terminal`, `next/link` already imported in their respective files; `next/navigation`'s `useRouter` is **not yet imported anywhere in CLI/explore sources** — only `src/app/resume/page.tsx` uses it — imports are added this phase, zero installs).
3. No `window.location` hacks, no `target="_blank"` on any phase-5 link — same-tab only.
4. No `TypingEffect` wrapping of the link line or chrome line (§2.3, §3.1).
5. No touch target below 44px real px in the header cluster; no rem conversion of the px classes (§0#12).
6. No hiding/removing/reordering the window glyphs or the three existing cluster controls; the only cluster change is the appended Terminal link (§4.1).
7. No changes to panels/grid/visualizations/wizard/status-bar/drawer visuals — except responsive-defect fixes recorded per §7.3.4.
8. No custom focus-visible styling on the CLI link (browser default; CLI convention, §2.3).
9. No second help-list entry, no `explore` alias command (§3.2).
10. No `prefetch={false}` or navigation interception on the new links — defaults stand.

---

*UI Spec for phase 05-explore-routing · prepared by gsd-ui-researcher · 2026-09-22*