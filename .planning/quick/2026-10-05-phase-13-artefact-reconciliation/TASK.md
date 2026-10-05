# Quick task 2026-10-05-phase-13-artefact-reconciliation

**Task:** Reconcile phase 13's locked artefacts with the DELIVERED, user-approved contract. The verifier found 4 truth-gaps all sharing one root cause: the executed code carries the user's FINAL directive (commit 43432f5: the mobile experience = a vertical year rail, one-at-a-time, scroll-driven swaps — chosen because the squeezed arc was unappealing; approved 'perfect') but REQUIREMENTS/CONTEXT/plan-01 still assert the superseded clauses. Nothing in src/ or tests/ changes — this is documentation reconciliation ONLY.

Edits:
1. `.planning/REQUIREMENTS.md` REV-23: rewrite the clause to the delivered contract (marked as user-superseded): "REV-23: Full mobile parity (as revised by the user's post-execute directive, commit 43432f5, approved 9fd3a87): the Projects swipe stack renders with the full gesture contract at every width (drag, behind-cards, centering, shadows — the simplified mobile wrapper retired); the Experience panel on PHONES presents a vertical year rail with one entry at a time changing while scrolling (the desktop keeps the semicircular arc — the user judged the squeezed arc unappealing per the reference brief's own advice); every panel behaves per its desktop-equivalent contract, tested on real hardware."
2. `.planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-mobile-parity-revision-CONTEXT.md` D-01: append a reconciliation line: "**SUPERSEDED in execution (user directive 43432f5, approved 9fd3a87): the <md presentation is NO arc — a vertical year rail with one-at-a-time scroll-driven entries; desktop md+ = the arc as pinned. Delivered and verified.**"
3. `EXPLORE-13-mobile-parity-revision-01-PLAN.md` truths + key links reconciliation: annotate truths 1-3 with "[SUPERSEDED by user directive 43432f5 — the delivered contract is the year-rail/one-at-a-time <md presentation; see ROADMAP REV-23 as revised]" (in-place annotation, keeping the original text for history) and mark L4 (steppedIndexRef) as "[RETIRED — the replacement link (stepRole → goToRole → scrollTargetForRole → main.scrollTo → derive) is wired and verified; the declared ref retires deliberately, pinned absent by tests/explore-visuals.test.mjs:1107-1111]".
4. In the phase's 04-SUMMARY.md append a short Reconciliation section noting: user-directed supersession, where recorded, the two export-list inaccuracies (TimelineStage/documentScrollLock module-private) annotated as INFO in the artefact or the SUMMARY (one line each).
5. Gate chronologically last (nothing in src/tests changed — assert that too): `git diff --name-only HEAD~1 HEAD -- src tests` returns nothing for this commit; then `npm run typecheck && npm test && npm run build && node --test tests/*.mjs` → all green (314 expected). Commit atomically: "docs(phase-13): reconcile locked artefacts with the delivered rail contract (verifier gaps closed)".
6. Do NOT push; report the commit hash.
**Run:** 2026-10-05T10:47:27.789Z

## Result

Done. Commit: **`a220f87`**

**Summary:** Reconcile phase 13's locked artefacts with the delivered (user-superseded) rail contract — REQUIREMENTS REV-23 rewritten, CONTEXT D-01 + plan-01 truths 1-3 / key link L4 annotated in place, 04-SUMMARY Reconciliation section added (incl. both INFO export-list inaccuracies); docs-only, gate green last.

Detail:

| Item | Result |
|---|---|
| Docs changed (4 files, +17/−5) | `.planning/REQUIREMENTS.md` (REV-23 → delivered contract, marked user-superseded), `EXPLORE-13-mobile-parity-revision-CONTEXT.md` (D-01 appended `SUPERSEDED in execution …`), `EXPLORE-13-mobile-parity-revision-01-PLAN.md` (truths 1–3 in-place `[SUPERSEDED by user directive 43432f5 …]`, L4 `[RETIRED — replacement link … pinned absent by tests/explore-visuals.test.mjs:1107-1111]`), `EXPLORE-13-mobile-parity-revision-04-SUMMARY.md` (`## Reconciliation` + one INFO line each for `TimelineStage` and `documentScrollLock`) |
| `src`/`tests` untouched | `git diff --name-only HEAD~1 HEAD -- src tests` → empty (asserted) |
| Gate (chronologically last, over the committed tree) | `npm run typecheck` exit 0 · `npm test` **314/314 pass, 0 fail** · `npm run build` exit 0 · `node --test tests/*.mjs` **314/314 pass, 0 fail** |
| Tree after gate | `git status --porcelain` empty (`out/` is gitignored; no tracked write followed the run) |
| Push | Not done — remote writes stay held per the standing rule |

Red/green note: no implementation code was edited, so no new failing test applies. The standing red record is `EXPLORE-13-mobile-parity-revision-VERIFICATION.md` (`status: gaps_found`, 41/48 — gaps 1–3 are precisely these artefact truths), plus the suite's deliberate gone-check pinning `steppedIndexRef` absent — which is why L4 is annotated as a retirement rather than "fixed" in code. Still open and deliberately not folded here: H1/AP-3 (touch drag unobserved on hardware, RM ON) and AP-1 (REV-23's sweep falsifier is vacuous) — both carry to the milestone audit.