# Quick task 2026-09-24-arc-present-first-order

**Task:** Flip the semicircular arc's entry order to present-first (user directive: "the experience must be shown from the present to the past"). Current state: the phase-9 arc derivation in src/components/explore/viz-data.ts (or the entries derivation module) sorts the 5 entries year-ASCENDING (BEng 2012 → Netcompany 2019 → MSc 2021 → Upstream 2022 → Chubb 2023). Flip to year-DESCENDING: Chubb 2023 first (the arc's focal point at rest), then Upstream 2022, MSc 2021, Netcompany 2019, BEng 2012 last.

Requirements:
1. Locate the sort in the derivation (search for the sort call producing the 5-entry entries array — likely `.sort((a, b) => a.startYear - b.startYear)` or similar ascending comparator) and flip it to descending (b - a). The merge logic (roles.filter(isTechRelated) ∪ education.filter(featured)) stays unchanged — ONLY the sort direction flips.
2. Update the stale-test assertions that pin the ascending order (grep the test suites for the entry order: tests/explore-visuals*.test.mjs, tests/projects-calendar.test.mjs if it pins entry order, tests/resume-docx-order.test.mjs — CAREFUL: only the ARC/timeline entry-order assertions flip; the /resume + PDF experience section stays reverse-chronological by its own existing contract (it already renders most-recent-first via data order — verify it does NOT break; the resume's role order comes from the data array order which the sort must NOT touch — flip ONLY the arc's own derived entries array sort, inside the arc derivation module, not the data file or the resume surfaces).
3. Verify the rendered arc: after the flip, the FIRST/best-positioned marker at rest (progress 0) should be Chubb (2023, the active present role), and BEng 2012 should be the last. Run the affected test suites to green.
4. Gate chronologically last: npm run typecheck && npm run build && node --test tests/*.mjs — all green. Commit atomically: "fix(explore): arc order flips to present-first (Chubb focal at rest) per user directive". Do NOT push. Report the commit hash + the new marker order.
**Run:** 2026-09-24T18:31:18.928Z

## Result

Done. **Summary:** Flipped `selectTimelineEntries` in `src/components/explore/timeline-geometry.ts` to a year-DESCENDING comparator (null years still sort LAST; merge logic/filters untouched; resume + docx surfaces don't consume this module — their JSON-order pins in `tests/resume-docx-order.test.mjs` and `tests/portfolio-data-integrity.test.mjs` stay intact), updated the doc contracts in `src/components/explore/sections/experience-section.tsx`, and renewed the stale ascending pins in `tests/explore-timeline.test.mjs` + `tests/explore-sweep.test.mjs` E-6 under red/green discipline (new-contract test recorded RED against the old comparator, then GREEN after the flip).

- **Commit:** `7ab0dd8` on `phase-9` — `fix(explore): arc order flips to present-first (Chubb focal at rest) per user directive` (4 files, +48/−38)
- **New marker order (present → past):** Chubb 2023 (focal at rest, progress 0) → Upstream Systems 2022 → MSc 2021 → Netcompany-Intrasoft 2019 → BEng 2012 (last)
- **Rendered arc verified:** Chubb's SSR title now sits in the visible layer-1 block (byte 44753 of `out/explore.html`), BEng in hidden layers; `01 / 05` counter and layer visibility counts unchanged
- **Gate (chronologically last):** `npm run typecheck` ✓ · `npm run build` ✓ · `node --test tests/*.mjs` → **239/239 pass** — all green over the committed workspace state. Not pushed.