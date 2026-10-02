# Doublecheck spec

## Goal
The phase-3 UI-SPEC.md is amended so the ui-checker's blocker B-1 (false 3:1 contrast claim + forbidden fix) is resolved via the user-approved scoped light-theme token override, and warnings W-1 (row-label contradiction), W-2 (literal-count aria-label example), W-3 (timing-dependent reduced-motion claim) are pinned before gsd_plan.

## Scope
In scope: only .planning/phases/EXPLORE-03-explore-visuals/EXPLORE-03-explore-visuals-UI-SPEC.md — §2/§6 contrast claims + light-theme override values, chart row-label contract (§2/§9), §8 aria-label note, §6 reduced-motion pin. Out of scope: all source code, SPEC/CONTEXT, other phases, re-running the checker.

## Acceptance criteria
["§2/§6 contrast claims rewritten to be true: pinned `.light .explore-shell` overrides `--chart-2: 160 65% 32%` and `--chart-3: 30 75% 38%` (computed ≥3:1 vs white card, hue-preserving); dark-theme token values unchanged; the old theme-invariance claim is replaced by the scoped-override decision (user-confirmed)", "Chart row labels pinned to the skills-section group builder labels verbatim (both Languages rows disambiguate by JSON order, matching existing chips); 'Spoken Languages' removed; YAxis width re-pinned for the shorter labels", "§8 aria-label example marked illustrative: label composed at render from the viz-data array, zero numeric literals in chart components (EXPLORE-07 audit intact)", "Reduced-motion claim replaced by unconditional `isAnimationActive={false}` pinned for all recharts components (timing race eliminated)", "All 4 findings folded with no other sections altered; file remains valid markdown"]

## Failure modes
["Computed override values fail 3:1 when re-checked → recompute darker values before committing (never ship a false 'verified' claim — the exact mistake B-1 flagged)", "Label change conflicts with the zero-invented-copy rule → reuse the existing group builder; never invent new labels in the chart", "An edit fails to match → re-read the section, re-anchor, never leave half-patched", "Override breaks dark theme or drawer digits → scoped selector `.light .explore-shell` only; verify via grep that :root blocks untouched"]

## Priorities
["Honest claims over convenient claims — the contract must only assert what is computed true", "Executor unambiguity: every finding resolves to a pinned mechanism, not prose", "Speed: fold all 4 in one batch, then straight to the standing-order gsd_plan"]

## Non-goals
["No source-code changes (override + components belong to plan/execute)", "No dark-theme token changes", "No re-run of the ui-checker after the fold-in", "No changes to SPEC.md or CONTEXT.md of phase 3"]
