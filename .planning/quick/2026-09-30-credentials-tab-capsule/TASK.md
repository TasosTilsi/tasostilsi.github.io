# Quick task 2026-09-30-credentials-tab-capsule

**Task:** Rework the Credentials panel's tab list (`src/components/explore/sections/credentials-section.tsx`) from the shadcn muted-pill `TabsList` into a floating-capsule bar navigation — the icon-above-label bottom-nav pattern adapted inside the panel. Radix Tabs primitives (`Tabs`/`TabsTrigger`/`TabsContent`) stay: only className/content changed, so arrow-key roving focus, `aria-selected` and the tab semantics are inherited unchanged.

Pinned design contract:
1. `TabsList` = capsule: `rounded-full`, full-width inside the body, elevated against the card (`bg-muted/70` + `border border-border` + `shadow-lg shadow-black/10 dark:shadow-black/30`), `px-2 py-1.5`, ~68px tall via the stacked items.
2. Each `TabsTrigger`: `flex flex-1 flex-col items-center justify-center gap-1 rounded-full min-h-[56px] px-2`, 16px lucide icon (Articles→FileText, Certifications→Award, Presentations→MonitorPlay, `aria-hidden`) ABOVE the label, label `text-[11px] leading-none`.
3. Active: accent icon + accent label (`text-accent`), `font-medium`, soft accent pill (`bg-accent/10`) — user decision: accent + soft pill.
4. Inactive: `text-muted-foreground`, ~0.85 emphasis, no background.
5. Inactive hover: icon translates up 2px, label darkens toward foreground, opacity → 1, 150–200ms on the phase-7 editorial-calm curve; the reduced-motion guard suppresses it automatically.
6. Labels stay EXACTLY Articles | Certifications | Presentations; row anatomy below unchanged.
7. Stale-test discipline: renew the assertions pinning the old recipe (44px trigger pin, `flex-wrap` inline list) + the UI-SPEC A11Y-01 record note so the height contract matches the new anatomy.
8. Gate chronologically last: `npm run typecheck && npm run build && node --test tests/*.mjs`.

**Run:** 2026-09-30 — gsd-quick.

## Result

Done (the commit hash is reported in the run summary; recording it here would need a write after the gate).

- `src/components/explore/sections/credentials-section.tsx`: three shared constants (`TAB_LIST` capsule / `TAB_TRIGGER` segment / `TAB_ICON` / `TAB_LABEL`); each trigger now renders its ICON-01 glyph above an 11px label; Radix primitives and all three `TabsContent` bodies untouched (no `forceMount`, SSR boundary intact).
- `src/app/globals.css`: new shell-scoped `.exp-tab` / `.exp-tab-icon` / `.exp-tab-label` hooks — inactive 0.85 emphasis, hover/focus-visible lift of 2px + label darkening toward foreground, 180ms editorial-calm curve, declared before the single existing reduced-motion guard (no second suppressor).
- `tests/credentials-panel.test.mjs`: the "44px triggers AND rows" reading of A11Y-01 was retired (RED on record first) — rows keep `min-h-[44px]`, triggers are pinned at `min-h-[56px]`; new capsule test asserts the anatomy, the icon-above-label order per tab, and gone-checks (`flex-wrap`, a 44px trigger recipe); new CSS test asserts the hooks are shell-scoped under the one guard.
- `EXPLORE-11-…-UI-SPEC.md` §2.2/§2.3/§2.5: A11Y-01 record note revised — 44px minimum still governs the row rail, the trigger clears it at 56px stacked.
- Gate green on the committed tree: typecheck + build + full `tests/*.mjs` suite.
