# Quick task 2026-09-24-motion-engine-prototype

**Task:** Create a throwaway engine-comparison prototype page at src/app/motion-demo/page.tsx on the current branch (phase-8) and install framer-motion as a TEMPORARY dependency for the comparison. Purpose: let the user visually decide between two animation engines for an upcoming scroll-driven editorial content transition (outgoing content translateY up + fade, incoming enters from below + fade, both temporarily coexisting — continuous scroll-linked interpolation, no discrete state swaps).

Requirements:
1. Run `npm install framer-motion` (temporary — a later step will remove it after the user picks).
2. Create src/app/motion-demo/page.tsx: a scratch page with metadata title "Motion Engine Prototype", NOT linked from anywhere, clearly banner-labelled at top: "ENGINE PROTOTYPE — scratch page, to be deleted after the engine decision".
3. The page contains TWO identical demo sections stacked vertically, separated by a labelled divider:
   - Section A, labelled "ENGINE A — hand-rolled rAF (zero deps)": a sticky 100vh stage inside a ~250vh scroll wrapper, showing 3 sample career entries (Chubb / Upstream Systems / Netcompany-Intrasoft, each with a year marker "2023"/"2022"/"2019", a title, a company line, and 2 sample bullets). Scroll progress through the wrapper (0→1) drives: outgoing entry translateY(0→-80px) + opacity(1→0.15), incoming entry translateY(120px→0) + opacity(0→1) — entries coexist during transitions, continuous interpolation from a single progress value computed in a small typed hook (scroll listener + rAF, transform/opacity only, listeners cleaned up on unmount, prefers-reduced-motion → opacity-only swaps, no spatial movement). All styling with the existing design tokens (bg-card, border, muted-foreground, accent) and JetBrains Mono via var(--font-jetbrains) — 'use client' page.
   - Section B, labelled "ENGINE B — framer-motion": the IDENTICAL visual demo implemented with framer-motion's useScroll + useTransform (same 3 entries, same ranges, same coexistence behaviour, same reduced-motion fallback via useReducedMotion).
4. Keep it minimal and throwaway: no tests for this page, no sitemap/metadata integration beyond the banner, no changes to any other file except package.json/package-lock.json (framer-motion install). The page must not break the static export: it exports statically like the other routes (it will appear in out/ as /motion-demo — acceptable for a scratch page).
5. Gate before commit: npm run typecheck && npm run build must pass (build includes the new page; confirm out/motion-demo.html is emitted). Commit atomically with message "chore(motion-demo): temporary engine-comparison prototype — hand-rolled rAF vs framer-motion (to delete after decision)". Do NOT push. Report the commit hash and the dev-server URL path (/motion-demo) so the user can compare both engines live.
**Run:** 2026-09-24T14:18:32.393Z

## Result

Complete gate green over the current tree, chronologically after the report writes: **typecheck ✓, build ✓ (`out/motion-demo.html` re-emitted), 12/12 suites ✓**.

Remaining before the completion claim: the adversarial reviewer (`38d09d86`) is still running — when it settles, its findings get folded into the delivery report; any code-affecting finding would re-open this gate and trigger one more full run, a no-change fold gets one final suite confirmation as the last write-covering action. Waiting on the reviewer now.