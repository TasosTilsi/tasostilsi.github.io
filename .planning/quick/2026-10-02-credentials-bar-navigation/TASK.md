# Quick task 2026-10-02-credentials-bar-navigation

**Task:** Rework the Credentials panel's tab list (in src/components/explore/sections/credentials-section.tsx) from the shadcn muted-pill TabsList into a floating-capsule bar navigation, per the user's brief (icon-above-label bottom-nav pattern adapted inside the panel). KEEP the Radix Tabs primitives (Tabs/TabsTrigger/TabsContent) — only className/content styling changes, so the keyboard pattern (arrow keys), aria-selected, and tab semantics are preserved free.

Design contract (from the user's brief, pinned):
1. TabsList becomes a CAPSULE: `rounded-full` (fully rounded), horizontally centered if the panel width allows (or full-width within the body), visually elevated: a subtle background contrasting with the card (e.g. `bg-muted/70` or the card + border + soft diffuse shadow `shadow-lg shadow-black/10 dark:shadow-black/30` — both-theme legible), padded (`px-2 py-1.5`), ~64-72px tall via the stacked items.
2. Each TabsTrigger: `flex flex-1 flex-col items-center justify-center gap-1 rounded-full min-h-[56px] px-2` — the ICON (16px lucide, the locked map: Articles→FileText, Certifications→Award, Presentations→MonitorPlay, `aria-hidden`) rendered ABOVE the label; label `text-[11px] leading-none`.
3. ACTIVE trigger: accent-colored icon + accent label (`text-accent` on both), font-medium (slightly stronger), PLUS a soft accent-tinted pill background (`bg-accent/10`) — user decision: accent + soft pill.
4. INACTIVE trigger: muted icon + muted label (`text-muted-foreground`), lower emphasis (opacity ~0.85), NO background.
5. Hover (inactive items): icon translates up 1-2px, label color darkens toward foreground, opacity increases — 150-200ms transitions (Editorial-calm easing, within the phase-7 vocabulary; the reduced-motion guard suppresses automatically).
6. Keep the tab labels EXACTLY: Articles | Certifications | Presentations (locked phase-11 copy). Keep the row anatomy below unchanged.
7. Stale-test discipline: renew tests/explore-credentials-related assertions that pin the old TabsList recipe (`inline-flex h-10 items-center` / `bg-muted` / the 44px trigger pin — the trigger min-height changes to 56px stacked; update the assertion + the A11Y-01 record note so the height contract matches the new anatomy); anything pinning the old inline layout.
8. Gate chronologically last: npm run typecheck && npm run build && node --test tests/*.mjs — all green. Commit atomically: "feat(explore): credentials tab bar becomes floating capsule navigation (icon-over-label, accent+pill active) per user directive". Do NOT push. Report the commit hash + the new bar's anatomy summary.
**Run:** 2026-10-02T16:00:10.524Z

## Result

**One-line summary:** Credentials tab list reworked into a floating capsule bar (Radix Tabs kept, icon-over-label segments, accent + soft pill active) — feature commit `02c14b6`, plus one follow-up fix commit `909b3bb` (hover duration realigned 180ms→200ms after `tests/explore-visuals.test.mjs` caught it red); full gate green on the final tree, not pushed.

**New bar's anatomy** (verified in `out/explore.html` + compiled CSS, not just source):
- **Capsule** (`TabsList`): `rounded-full border border-border bg-muted/70 px-2 py-1.5 shadow-lg shadow-black/10 dark:shadow-black/30`, `w-full` inside the body, `mb-3` gap, ~68px tall (`min-h-[56px]` + `py-1.5`). twMerge dropped the primitive's `h-10`, `bg-muted`, `rounded-md`, `inline-flex`; `px-2`/`py-1.5` emit after `p-1`, so the 8px/6px padding wins.
- **Segments**: `exp-tab flex flex-1 flex-col items-center justify-center gap-1 rounded-full min-h-[56px] px-2 font-normal` — three equal thirds; 16px `aria-hidden` lucide glyph (FileText/Award/MonitorPlay) rendered **above** the `text-[11px] leading-none` label, both coloured by the trigger's inherited `currentColor`.
- **Active** (`data-state=active`): `bg-accent/10` + `text-accent` + `font-medium` (`shadow-none` neutralises the primitive's `shadow-sm`).
- **Inactive**: `text-muted-foreground`, 0.85 emphasis, no background; hover/focus-visible lifts the icon 2px, darkens the label to `hsl(var(--foreground))`, opacity → 1, at 200ms on `cubic-bezier(0.25,1,0.5,1)` via the shell-scoped `.exp-tab*` hooks — the single existing reduced-motion guard still suppresses it, and no second guard was added.
- Radix primitives untouched: export shows `role=tablist`/`role=tab` with `aria-selected` and `data-state` intact, so arrow-key roving focus and tab semantics are unchanged; labels and row anatomy below are byte-identical.

**Stale-test renewal (RED on record first):** the "44px triggers AND rows" reading of A11Y-01 is retired — rows keep `min-h-[44px]`, triggers pin `min-h-[56px]`; gone-checks cover `flex-wrap` and any 44px trigger recipe. `EXPLORE-11-…-UI-SPEC.md` §2.2/§2.3/§2.5 now carries the revised A11Y-01 note (target never shrank: 56px clears the 44px minimum). Changed: `credentials-section.tsx`, `globals.css`, `tests/credentials-panel.test.mjs`, `EXPLORE-11-credentials-panel-revision-UI-SPEC.md`, `.planning/quick/2026-09-30-credentials-tab-capsule/TASK.md`.