# Quick task 2026-09-25-uom-track-honest-copy

**Task:** Fix the 'Uom Track' project entry in src/data/portfolio-main-data.json (projects[5]) per the user's clarification: it is a frontend course exercise for the Web & Mobile Development course at the University of Macedonia, NOT a product/serious project. Keep it in the top-6 stack (user chose "Fix copy, keep in stack").

Changes to that single entry:
1. description → "Frontend course exercise for the Web & Mobile Development course at the University of Macedonia — a mobile-first tracking application built to practice responsive UI development."
2. link → "https://tasostilsi.github.io/WebnMobileDevelopmentUOM/" (the user's live site for this exercise; the current entry may carry a different/absent link — set exactly this).
3. date stays "December 2021".
4. Everything else in the entry and the data file stays byte-untouched (no other project edits, no featured-flag changes — Uom Track is not featured, so /resume and the PDF are unaffected).

Check for stale-test fallout: grep the test suites for the old description string ("possibly for University") and for 'Uom Track' — renew any assertion pinning the old description/tagline (the stack card's tagline derives from firstSentence, so the card tagline will change to 'Frontend course exercise for the Web & Mobile Development at the University of Macedonia.' — verify no test pinned the old tagline; renew if pinned).

Gate chronologically last: npm run typecheck && npm run build && node --test tests/*.mjs — all green. Commit atomically: "fix(data): Uom Track presented honestly as a UOM course exercise with correct link". Do NOT push. Report the commit hash + the new tagline as rendered.
**Run:** 2026-09-25T21:37:57.779Z

## Result

Done.

- `src/data/portfolio-main-data.json`: Uom Track description + link updated; date untouched; no other project touched.
- `tests/projects-stack.test.mjs`: renewed stale assertions — Uom Track moved to over-budget first-sentence group, chips updated to `['Web', 'tracking']`.
- Green gate passed after final edits: `npm run typecheck && npm run build && node --test tests/*.mjs` → 248/248 pass.
- Commit: `4d5c121` — `fix(data): Uom Track presented honestly as a UOM course exercise with correct link`.
- New stack-card tagline: `Frontend course exercise for the Web & Mobile Development course at the University of Macedonia — a mobile-first…`.
- Not pushed.

(`.planning/STATE.md` was already dirty from a prior quick task; left out of this commit.)