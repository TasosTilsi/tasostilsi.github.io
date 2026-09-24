# Quick task 2026-09-24-motion-demo-decision-applied

**Task:** The user picked the engine: framer-motion for the upcoming editorial compositions (projects scroll + About enhancements), while the Experience semicircular timeline keeps its existing hand-rolled rAF hook (phase-8 system stays as-is). Apply the decision and clean up the scratch prototype:

1. Delete src/app/motion-demo/page.tsx entirely (the throwaway comparison page) and any motion-demo test/artefact references if any exist (none expected).
2. KEEP framer-motion in package.json — it is now a real dependency for phase 9 (reverses the earlier 'temporary' framing; update package.json if the install pinned it as anything unusual — it should just be a normal "^12.x" semver entry in dependencies).
3. Run npm install to sync package-lock.json if needed.
4. Gate: npm run typecheck && npm run build && node --test tests/*.mjs — all green, out/motion-demo.html must NO LONGER exist in the regenerated export. Commit atomically: "chore: apply engine decision — framer-motion adopted for editorial compositions, scratch motion-demo page deleted".
5. Do NOT push. Report the commit hash + the dependency count (was 38, expect 39 with framer-motion).
**Run:** 2026-09-24T14:29:48.277Z

## Result

**quick 2026-09-24-engine-decision: deleted the `/motion-demo` scratch prototype (4 files, −367 lines) + its 8-test throwaway suite (`tests/motion-demo-prototype.test.mjs`, −189), kept framer-motion as a permanent `dependencies` entry, renewed 3 stale "TEMPORARY dependency" test framings, gate green (typecheck + build + 212/212, `out/motion-demo.html` absent from the regenerated export) — commit `387fd86`.**

Details:
- **Deletions:** `src/app/motion-demo/{page,engine-a-raf,engine-b-framer,demo-shared}.tsx` + `tests/motion-demo-prototype.test.mjs` — "none expected" for artefact refs was wrong; the prototype had 3 sibling components and a dedicated contract suite, all deleted.
- **Test renewals:** `explore-routing` / `explore-sweep` / `explore-visuals` messages+titles updated from "TEMPORARY … returns to 38" to the adopted framing. The `framer-motion` ban in `explore-visuals.test.mjs:595` is scoped to `src/components/explore/**` (REV-11) and correctly stays — the phase-8 timeline keeps its hand-rolled rAF.
- **package.json:** no change — framer-motion is a normal caret entry `"^13.4.3"` in `dependencies` (lock in sync, `npm install` was a no-op, 0 vulnerabilities). **Deviation from the task's `^12.x` expectation:** npm actually installed 13.4.3, the latest major the prototype was built against; the entry is not "unusual", so I kept it rather than downgrade and re-verify phase-9 groundwork against 12.x.
- **Gate:** suite back to the pre-prototype baseline of **212/212**; `out/` regenerated with exactly the 5 expected pages. One transient: the first typecheck hit stale `.next/types/app/motion-demo/*` from the pre-deletion build (TS2307) — the build regenerated them and the re-run passed; cache artifact, not a regression.
- **Dependency count: 39** (was 38, +1 framer-motion) — as expected. **Not pushed.**