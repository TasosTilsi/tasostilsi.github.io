# Quick task 2026-10-02-single-scrollbar-invariant

**Task:** Eliminate the 3-scrollbar state on the landing page (/, the explore experience) so exactly ONE scroll container exists: <main>. User-report: 3 scrollbars visible. Root causes identified in source:

(1) The WINDOW/body scrollbar: the route-swap moved the landing to src/app/(home)/ (or the direct home layout) — the body element (root layout, `h-full flex flex-col`) carries content beyond the shell: the empty wrapper div(s) + the Radix live-region/toaster portal roots render INSIDE/after the shell; with `h-full` resolving against html's own height chain, any extra content or the dynamic-viewport (dvh) rounding makes the document taller than the visual viewport → the window scrolls (also the long-standing "scroll past the footer" report). Fix: in the landing layout (the one wrapping the explore shell), constrain the document: `html, body { overflow: hidden; height: 100%; }` — scoped to the landing routes ONLY (the CLI keeps its own h-screen overflow-hidden shell at /cli; /resume scrolls as a document BY DESIGN — do not touch its layout). The explore shell is h-dvh (mobile-safe); overflow hidden on html+body only prevents the WINDOW from showing a scrollbar — main's internal scroll is unaffected.

(2) The SHELL's own vertical scrollbar: `explore-shell` root carries `overflow-x-hidden` — CSS spec computes `overflow-y: auto` when one axis is hidden, so the shell frame can display a vertical scrollbar for anything poking past its h-dvh box. Fix: change the shell root's class to `overflow-hidden` (both axes) — main is the only scroll container; nothing inside the shell may paint a scrollbar.

Acceptance: (a) typecheck + build + tests all green; (b) structural tests: the shell root pins `overflow-hidden` (NOT overflow-x-hidden), the landing layout pins the html/body overflow-hidden rule (scoped: the CLI + resume layouts' own height rules byte-unchanged), the window-scroll invariant suite still pins <main> as the only scroll container; (c) no horizontal scroll regression at 375px (overflow-hidden on the shell keeps the invariant).

Stale-test discipline: suites pinning `overflow-x-hidden` on the shell (tests/explore-sweep.test.mjs / explore-visuals — grep the overflow tokens) renew to `overflow-hidden`; any test pinning the body class string renews if the layout class changes.

Do NOT touch: /cli's shell, /resume's document-scroll layout, any panel/stage/tour content, the drag/swipe machinery.
Gate chronologically last: npm run typecheck && npm run build && node --test tests/*.mjs — all green. Commit atomically: "fix(explore): single-scrollbar invariant — body scroll off on the landing, shell overflow-hidden; <main> is the only scroll container". Do NOT push. Report the commit hash + which scrollbar each fix kills.
**Run:** 2026-10-02T17:19:22.322Z

## Result

Done. Commit `c7b45f7`, not pushed.

**Summary:** `fix(explore): single-scrollbar invariant — body scroll off on the landing, shell overflow-hidden; <main> is the only scroll container` — commit `c7b45f7e20f0e370e7e37149bec8e788f0722e61`; 6 files, +135/−13.

Which scrollbar each fix kills:

1. **WINDOW scrollbar** (the "scroll past the footer" one) — `src/app/(home)/layout.tsx` now emits a route-scoped `<style>` lock, `html, body { height: 100%; overflow: hidden; }`. Scoped by construction: it lives in the landing route's only layout, so `out/cli.html` and `out/resume.html` carry **0** occurrences (verified in the exported HTML; `out/index.html` carries it). `/cli`'s `h-screen overflow-hidden` shell and `/resume`'s document-scroll layout are byte-unchanged.
2. **SHELL's own vertical scrollbar** — `src/components/explore/explore-shell.tsx:65`, `overflow-x-hidden` → `overflow-hidden`. This is the subtle one: the single-hidden-axis rule computes the other axis as `auto` (CSS spec), so the `h-dvh` frame could paint its own vertical scrollbar beside main's. Clipping both axes removes it while keeping zero horizontal scroll structural at 375px.

Evidence trail:
- **Red first**: stashed the shell fix, ran the renewed suites → shell pin, `window-scroll invariant`, and `row 3` all failed on the pre-fix source; popped, then implemented the layout lock.
- **Green gate, chronologically last**: `npm run typecheck` ✓ · `npm run build` ✓ (6 static pages, export 2/2) · `node --test tests/*.mjs` → **289 pass / 0 fail**.
- **Stale tests renewed** (5 pins of `overflow-x-hidden` → `overflow-hidden`): `tests/explore-shell.test.mjs` (×2), `tests/explore-sweep.test.mjs`, `tests/route-swap.test.mjs`. Negative assertions run on **comment-stripped** source on purpose — the shell's doc comment names the retired form, so a raw-source `!/overflow-x-hidden/` would have been red on prose, not code.
- **New pins**: shell root must carry `overflow-hidden` and never `overflow-x-hidden`; exactly one `overflow-(y-)?(auto|scroll)` in the shell; landing layout must declare the lock; `/cli` + `/resume` must NOT pick it up. The window-scroll invariant suite still pins `<main>` as the only scroll container.
- Untouched as instructed: `/cli` shell, `/resume` layout, panels/stage/tour content, drag/swipe machinery.

One note for the verifier: the lock is an inline `<style>` element (React 18 here, so `precedence`-based head hoisting isn't available) — it applies pre-hydration and unmounts on client-side navigation away from the landing, which is what keeps `/cli` and `/resume` unaffected.