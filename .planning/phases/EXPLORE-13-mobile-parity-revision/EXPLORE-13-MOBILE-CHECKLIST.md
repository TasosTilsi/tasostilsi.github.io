# Phase 13: mobile-parity-revision — real-hardware phone checklist

**Owner:** the user (D-07: "Real-hardware verification is the user's bar: every VISUAL claim ships with the phone checklist; the programmatic half (grep pins, export checks, suites) is mine.")
**Items:** UI-SPEC §10, quoted VERBATIM below (they are the locked bar — not paraphrased into weaker statements) + the item-0 Reduce-Motion precondition that §10's preamble lacks (RESEARCH R1 / OQ-1) + one supplementary observation carried from plan 03 (no §10 item exists for it).
**How to run:** portrait, on the real device, both themes. One notched device preferred; one non-notched if available. Open the deployed or locally-served build.

**Recording rules — read before you start.**
- An item is PASS only if you saw it pass on the phone. FAILURES are recorded **verbatim** — the exact symptom in your words — never smoothed over, never reworded into a near-pass. If an item was not tested, record it as **NOT RUN** rather than assuming it works; an invented observation is worse than a missing one.
- Classify every FAIL: **parity defect** (this phase's contract did not land), **accepted side effect** (documented, out of scope), or **precondition artifact** (only fails because of a premise, e.g. Reduce Motion ON).
- A code fix for any FAIL is **not** applied here: this phase's plans are complete, so a fix belongs in gap-closure planning (a new plan), not in a silent edit of plans 01-03.
- **Every write after a green programmatic run reopens the gate.** Recording this checklist is a write; so is a fix. The full gate (`npm run typecheck && npm test && npm run build && node --test tests/explore-sweep.test.mjs`) is re-run after the last write, and only then is the phase's execution claim good.

---

## Premise block (fill in before item 1)

- Device: `___`
- OS / version: `___`
- Browser: `___`
- Build served: `___` (commit `___`; deployed or local)
- Themes tested: `light` / `dark` / both
- **Reduce Motion (Settings → Accessibility → Motion → Reduce Motion): `ON` / `OFF`** — REQUIRED before reading items 6 and 7; see item 0.

---

## The Reduce-Motion precondition (RESEARCH R1 / OQ-1) — read before items 6 and 7

The stack deliberately disables the drag gesture under reduced motion. This is a **verified phase-10 requirement (REV-20)**, not a bug: `projects-stack-stage.tsx:581` reads `drag={isFront && !reducedMotion ? 'x' : false}`, and `useReducedMotion()` returns the real OS state synchronously on the first client render — not a stale default. `tests/projects-stack.test.mjs` pins that contract (the R5/R12 rows).

**Consequence:** on a phone with **Reduce Motion ON**, item 6's "touch drag swipes the card away" fails **BY DESIGN**. That is a **precondition artifact**, not a parity defect. REV-23b's parity claim is a **WIDTH** contract; REV-20's reduced-motion contract is orthogonal and intentionally trades the gesture away. The stacked buttons still step the carousel under reduced motion.

**Record the setting's value here BEFORE reading the swipe items:** `___` (ON / OFF).

If the setting is ON and you want the gesture kept under reduced motion (option (b) in the plan), that is an **explicit scope grant to amend REV-20** — it must renew the phase-10 reduced-motion pins in `tests/projects-stack.test.mjs` deliberately and cannot be started on inference. Default (option (a)) = record the value, change no code.

### Item 0 — Reduce-Motion precondition (record-keeping, not a visual item)

- [ ] The phone's Reduce Motion setting is recorded in the premise block above.
- [ ] Items 6 and 7 are read in that light: `PASS` / `FAIL by design (RM ON)` / `NOT RUN`.
- Observation (verbatim): `___`

---

## The items (UI-SPEC §10, verbatim)

### Item 1 — header/footer safe areas

> Header visible and tappable; all four controls work; the bar reaches the top edge and its content is not under the notch. Footer reaches the bottom edge; its text is not under the home indicator.

Result: `PASS` / `FAIL` / `NOT RUN` — observation (verbatim): `___`

### Item 2 — no gap below the footer (the phase's headline symptom)

> **No gap below the footer** at rest, while the URL bar hides/shows, and after scrolling to the bottom of the main area.

Result: `PASS` / `FAIL` / `NOT RUN` — observation (verbatim): `___`

### Item 3 — exactly one scrollbar

> **Exactly one scrollbar**: no window scrollbar and no horizontal scrollbar anywhere (test at the arc, at the Projects stack, mid-swipe).

Result: `PASS` / `FAIL` / `NOT RUN` — observation (verbatim): `___`

### Item 4 — the arc renders on the phone (REV-23)

> Experience: the semicircle renders above the content, scaled to the phone; the five year labels are readable and never truncated/overlapping; the active year sits at the left-bulge focal point.

Result: `PASS` / `FAIL` / `NOT RUN` — observation (verbatim): `___`

### Item 5 — arc steps + the RESOLVED-D1 design question

> Prev/Next step the arc and are tappable (44px), disabled at the ends; a step has a visible result (per RESOLVED-D1's default: the stepped-to entry comes into view). **Answer RESOLVED-D1 here**: is the five-entry readable stack right, or do you want one entry at a time with the arc driving it?

Result: `PASS` / `FAIL` / `NOT RUN` — observation (verbatim): `___`

**RESOLVED-D1 answer (design decision for a possible follow-up, not a fix in this phase):** `___`

### Item 6 — the full swipe stack (REV-23b) — read with item 0

> Projects: the full stack — touch drag swipes the card away, the card behind peeks, the stack is centred, the depth/bloom shadows render, the counter and both controls work.

Result: `PASS` / `FAIL` / `FAIL by design (Reduce Motion ON)` / `NOT RUN` — observation (verbatim): `___`

### Item 7 — vertical scroll over the drag card

> Vertical page scroll still works when the gesture starts on the card (drag horizontal = card, drag vertical = page).

Result: `PASS` / `FAIL` / `NOT RUN` — observation (verbatim): `___`

### Item 8 — the wizard on the phone

> Wizard: still plays step-by-step; check the **docked** card's buttons are not under the home indicator (the overlay now measures a taller viewport).

Result: `PASS` / `FAIL` / `NOT RUN` — observation (verbatim): `___`

### Item 9 — /cli and /resume under the notch (accepted side effect)

> `/cli` and `/resume` from the phone: check their top/bottom edges for content under the notch — a side effect of the root-level `viewport-fit` (out of scope to fix; report if broken).

Result: `PASS` / `FAIL` / `NOT RUN` — observation (verbatim): `___`

### Item 10 — Credentials panel and drawer unchanged

> Credentials panel and the drawer: unchanged.

Result: `PASS` / `FAIL` / `NOT RUN` — observation (verbatim): `___`

### Item 11 — both themes legible, including the safe-area strips

> Both themes legible, including the strips behind the notch and above the home indicator.

Result: `PASS` / `FAIL` / `NOT RUN` — observation (verbatim): `___`

### Supplementary (not a §10 item) — the tap-highlight flash (REV-25b)

Carried from plan 03's handoff: UI-SPEC §10 has no item for it, and `-webkit-tap-highlight-color: transparent` is on `html:has(.explore-shell)` in the platform pack. Tapping any control should no longer flash the grey highlight.

Result: `PASS` / `FAIL` / `NOT RUN` — observation (verbatim): `___`

---

## Results block (item → verdict → verbatim observation)

| # | Item | Verdict | Verbatim observation |
|---|---|---|---|
| 0 | Reduce-Motion precondition | | |
| 1 | Header/footer safe areas | | |
| 2 | No gap below the footer | | |
| 3 | Exactly one scrollbar | | |
| 4 | Arc on the phone (REV-23) | | |
| 5 | Arc steps + RESOLVED-D1 answer | | |
| 6 | Full swipe stack (REV-23b) | | |
| 7 | Vertical scroll over the drag card | | |
| 8 | Wizard docked card | | |
| 9 | /cli + /resume under the notch | | |
| 10 | Credentials + drawer unchanged | | |
| 11 | Both themes + strips | | |
| — | Tap-highlight flash (supplementary) | | |

## Failures — classified, never smoothed

| # | Symptom (verbatim) | Classification | Follow-up |
|---|---|---|---|
| | | parity defect / accepted side effect / precondition artifact | new gap-closure plan / none (documented) |

## Gate record

The full gate is re-run **after** the last write to this file (the checklist write itself reopens it). Record the exit code and the suite summary here:

- `npm run typecheck && npm test && npm run build && node --test tests/explore-sweep.test.mjs` → exit code `___`, suites `___`, timestamp/HEAD `___`.

---

*Phase: 13-mobile-parity-revision · plan 04 · checklist generated 2026-10-05 · items 1-11 quoted verbatim from EXPLORE-13-...-UI-SPEC.md §10*
