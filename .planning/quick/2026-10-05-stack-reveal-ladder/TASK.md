# Quick task 2026-10-05-stack-reveal-ladder

**Task:** Fix the swipe-stack depth geometry so behind-cards are VISIBLE as stacked header bands (the user's reference look) instead of near-invisible slivers, and so the stage's peek band stops reading as an awkward empty gap. Root cause (verified in code): cards are bottom-anchored (`bottom: 0`) AND per-level scaled — the visible peek of a depth-l card = |translateY| − H×(1−scale_l); the LEVELS table's offsets (−38/−76/−114/−152/−190) were designed without the scale-shrink compensation, so the visible peeks collapse to ~16/44/68/78px slivers (nearly invisible) and the reserved 250px band reads as dead empty space between the stat tiles and the cards.

Files: src/components/explore/projects-card-state.ts (LEVELS + translateY derivation + doc comments), src/components/explore/sections/projects-stack-stage.tsx (stage height constants: PEEK_BAND_PX, the h-[790px]/md:h-[830px] classes → re-derived), tests/projects-stack.test.mjs + the geometry/level suites (renew the pinned numbers).

Pinned new contract (the reveal-ladder formula — record it as the module contract):
1. VISIBLE_BAND_PX = 72 — each depth level reveals one more 72px band of the behind-card's top (header + edge) above the front card's top edge. The composition at rest = the front card + 5 progressively shallower card tops behind it — the curated physical-stack look.
2. translateY for depth l (1..5): translateY(l) = −( l × VISIBLE_BAND_PX + H_front × (1 − scale_l) ) where scale_l = 0.96/0.92/0.88/0.84/0.80 (the existing scale ladder UNCHANGED) and H_front comes from the card height (560 md / 520 base — pin the formula so the numbers derive, with the computed table recorded: md H=560 → yUp = −94/−189/−283/−378/−472; base H=520 → yUp = −92/−186/−280/−373/−468; the module derives these from H via the CARD_HEIGHT input, not hardcoded magic — the function gains/uses the card height param or a named constant pair).
3. yLeave(l) = translateY(l) − 56 (the LEAVE_EXTRA relation preserved: −56 further). Exit choreography unchanged (the exit animates x/rotate/opacity; y stays).
4. PEEK_BAND_PX = 5 × VISIBLE_BAND_PX + SAFE = 360 + 20 = 380 (was 250). Stage heights: h-[900px] base (520+360+20) / md:h-[940px] (560+360+20) / mobile compact: h-[900px] consistent with the card 520 — replace the 790/830/690 constants accordingly, deriving where possible from the formula (stage = card + band + safe).
5. Depth-6+ (should not occur with 6 cards) extrapolation rule extends the same formula. Reduced motion: SAME static offsets (the depth composition is not motion — it renders at every motion preference; only transitions are instant under RM — this matches the RM amendment granted in spirit by the user's defect report: the depth must never appear/disappear with the OS setting).
6. z-index ladder unchanged; opacity ladder unchanged (0.95/0.85/0.7/0.5/0.3 — the deeper card tops read as layered paper); curated imperfection unchanged.
7. Renew the stale geometry pins: the LEVELS rows in tests/projects-stack.test.mjs (the yUp/yLeave/scale/opacity per-depth assertions + the frontIndex geometry assertions) and any band-height assertions (the 790/830 pins) — red first on the old numbers, then green on the reveal-ladder contract. Record the formula in the module docstring (the contract is the FORMULA, not just the numbers).
8. Gate chronologically last: npm run typecheck && npm test && npm run build && node --test tests/*.mjs — all green. Commit atomically: "fix(explore): swipe stack depth becomes a visible header-band reveal ladder (behind-cards visible, band no longer dead space)". Do NOT push. Report the commit hash + the new geometry summary.
**Run:** 2026-10-05T09:42:09.265Z

## Result

**Commit `47ea74a`** — `fix(explore): swipe stack depth becomes a visible header-band reveal ladder (behind-cards visible, band no longer dead space)` (3 files, +361/−87, working tree clean, not pushed).

**New geometry (derived, not hand-typed):**
- Contract in `projects-card-state.ts`: `scale_l = clamp(1 − 0.04·l, 0.80, 1)`, `translateY(l) = −(l·72 + H·(1 − scale_l))`, `yLeave(l) = translateY(l) − 56`; exported `VISIBLE_BAND_PX=72`, `LEAVE_EXTRA_PX=56`, `DEPTH_LEVELS=5`, `CARD_HEIGHT_MD=560`/`CARD_HEIGHT_BASE=520`, `levelsFor(h)`.
- md (H=560) yUp: **−94/−189/−283/−378/−472** (yLeave −150/−245/−339/−434/−528); base (H=520): −93/−186/−278/−371/−464. Depth 6+ extends the same formula; z/opacity ladders and the curated imperfection unchanged.
- Stage (`projects-stack-stage.tsx`): `PEEK_SAFE_PX=20`, `PEEK_BAND_PX = DEPTH_LEVELS·VISIBLE_BAND_PX + PEEK_SAFE_PX = 380` (was 250), card box `h-[520px] md:h-[560px]` (was 420 base), stage `h-[900px] md:h-[940px]` (was 690/830) — emitted CSS/HTML verified in `out/`.
- **RM amendment:** the ladder is derived outside the RM branch — RM keeps yUp/scale/opacity/z, suppressing only translateX/rotation; the depth can no longer flatten or vanish with the OS setting.

**Two contract discrepancies I resolved (formula governs, as pinned):**
1. Task's base row `−92/−186/−280/−373/−468` is not reproducible from the pinned formula (3/5 rows off by 1–4px; its own successive deltas aren't constant). The formula-derived base table is recorded instead; md matches the pin exactly (all 5 rows).
2. Task said stage = card + band + safe = `520+360+20`; but `PEEK_BAND_PX` is itself pinned to `360+20 = 380`. Adding safe twice gives 920/960, contradicting the pinned 900/940. Resolved as **stage = card + PEEK_BAND_PX** (band inclusive of safe) → 900/940, matching both pinned numbers.

**Also added (required for the pinned arithmetic to be exact):** `origin-bottom` on the swipe card. The `H·(1−scale_l)` compensation is the *bottom-origin* top-edge fall; with the CSS default centre origin every band would be `72 + 0.02H ≈ 83px` and the deepest card's top would clip 36px above the stage. With `origin-bottom` the depth-5 top lands exactly on `PEEK_SAFE_PX` (md: 940−560−5·72 = 20), so the reserved 380px is filled by five 72px header bands with no clipping and no dead space. This is pinned by a test row.

Suite: `projects-stack.test.mjs` went red on the old numbers/constants first, then green; `npm run typecheck`, `npm run build`, and `npm test` (**313/313**) all green on the committed state.