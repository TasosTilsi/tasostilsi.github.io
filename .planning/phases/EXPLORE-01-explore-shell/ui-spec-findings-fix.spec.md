# Doublecheck spec

## Goal
The phase-1 UI-SPEC.md is amended so the UI-checker's blocker B-1 and warnings W-1…W-6 are resolved as pinned, executor-unambiguous decisions, using the exact mechanisms the checker verdict prescribed, before gsd_plan runs.

## Scope
In scope: only .planning/phases/EXPLORE-01-explore-shell/EXPLORE-01-explore-shell-UI-SPEC.md, amending exactly the seven flagged spots (§12 guard block, §2.1 shell-root class, §4 intro min-h, §5 drawer item anatomy, §7 status-bar theme label, §13 landmarks, §13 contrast + keyboard scrolling). Out of scope: any source code, sheet.tsx, SPEC.md, CONTEXT.md, and the planning/execution steps themselves.

## Acceptance criteria
["grep of the UI-SPEC shows the §12 guard block as valid, closed CSS with `.explore-shell *`, `.explore-shell .animate-pulse`, `body:has(.explore-shell) [data-state=\"open\"]`, `body:has(.explore-shell) [data-state=\"closed\"]` selectors and a `scroll-behavior: auto !important` override (B-1 + W-1); no `data-slot` selector and no unclosed comment remains", "§2.1 pins the exact root class `h-dvh` with no stacked h-screen fallback (W-4)", "§4 pins `min-h-[40px] md:min-h-[20px]` px values (W-5)", "§5 marks drawer index digits `aria-hidden` and §13 scopes the 4.5:1 contrast claim to meaningful text with the digit exemption stated (W-3)", "§7 pins the theme-label hydration contract: SSR `dark` default + one-shot after-mount sync from documentElement.classList (W-2)", "§13 pins `tabIndex={0}` + aria-label on the main scroll container as keyboard-focusable (W-6)", "All 7 edits land with no other sections altered; the file remains valid markdown"]

## Failure modes
["An edit fails to match old_string (text drift) → re-read the section, re-apply with a corrected anchor before proceeding; never leave the spec half-patched", "A prescribed fix contradicts an existing locked decision (e.g. sheet.tsx edits) → stop and surface to the user instead of silently choosing", "Checker verdict misread → re-read the verdict text before writing; the fix must match what the checker verified against the codebase, not a paraphrase", "All 7 edits already applied successfully before the gate fired → do not re-edit; verify via grep and record this spec as the contract for the already-applied fixes"]

## Priorities
["Correctness of the pinned mechanisms (checker-prescribed selectors/contracts) over prose brevity", "Speed: fold all 7 findings in one batch, then immediately proceed to the user-commanded gsd_plan — no extra review round-trip", "If any finding conflicted with a locked decision, surfacing it would win over silently patching — none did"]

## Non-goals
["No re-run of the ui-checker after the fold-in (its verdict prescribed the exact fixes)", "No source-code implementation in this task — code belongs to the plan/execute steps", "No changes to SPEC.md, CONTEXT.md, or any src/ file", "No reopening of decisions already settled in the spec or discuss interviews"]
