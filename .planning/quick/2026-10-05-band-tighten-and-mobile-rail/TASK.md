# Quick task 2026-10-05-band-tighten-and-mobile-rail

**Task:** Two user-directed amendments to the just-executed phase-13 work (the phase's plans are complete, so these land as an amendment quick-task with pinned contracts):

PART 1 — tighten the card bands (user picked 44px): in src/components/explore/projects-card-state.ts change VISIBLE_BAND_PX from 72 to 44 (the formula contract unchanged: translateY(l) = −(l·44 + H·(1−scale_l)), yLeave = translateY − 56; scale/opacity/z ladders unchanged); in src/components/explore/sections/projects-stack-stage.tsx re-derive PEEK_BAND_PX = 5·44 + 20 = 240 and the stage heights h-[760px] base (520+240) / md:h-[800px] (560+240) (the formula: stage = card + band, band inclusive of safe). Renew the geometry test pins (the band constants, the yUp/yLeave rows, the stage-height rows) red-first; update the module docstrings (72 → 44 with the note the value is the user's density dial).

PART 2 — the mobile experience presentation (user: the squeezed arc is unappealing; picked the vertical year rail + 'one at a time, changing while scrolling'): in src/components/explore/sections/experience-section.tsx (+ the hook: src/components/explore/use-timeline-progress.ts if needed):
- DESKTOP (md+) stays byte-untouched: the semicircular arc + the sticky-range scroll drive + all-content behavior unchanged.
- MOBILE (<md): the arc zone does NOT render the squeezed semicircle — instead a slim VERTICAL RAIL: a left rail (a thin vertical line + 5 year markers: 2023/2022/2021/2019/2012 — top = present) with the ACTIVE marker emphasized (accent dot + accent year, the others muted), and the RIGHT/BODY area shows EXACTLY ONE entry at a time — the active entry's full content (role: title > company > dates > location > bullets; education: degree > institution > dates > specialization).
- The 'changing while scrolling' rhythm: <md gains a scroll-range wrapper (mirroring the desktop's sticky-range mechanism, sized ~5 bands — e.g. 5 × 80vh ≈ 400vh wrapper via the same data-conditional pattern, the stage sticky within it); the scroll position through the range maps to the active index in 5 bands (the phase-8 desktop derivation generalizes: progress → active idx via Math.round((n-1)·progress) — REUSE the existing derivation); the entry swap = Editorial-calm opacity/fade (200-280ms) — no spatial slides; the rail's active marker follows the active index.
- The reduced-motion contract: instant swaps (opacity-only), no animation — the existing RM gate covers it.
- Keyboard/buttons: Prev/Next still step (they scroll through the range to the target band — the same targetScrollTop formula with the <md wrapper's own geometry); arrows work <md (the D1 lift, already pinned); ends clamp.
- The RESOLVED-D1 all-five-readable contract is SUPERSEDED on mobile by the user's one-at-a-time decision — record the amendment in the plan/doc (the <md path = one-at-a-time; the all-five rendering retires with the squeezed arc).
- touch-action: pan-y stays on the stage area if the wrapper region should never block vertical scroll (the page scroll IS the input — nothing captures it; no wheel/touch handlers).

Stale-test renewal: the suites pinning the <md experience (all-five-readable, RESOLVED-D1 rows, the arc-hidden-at-mobile rows in tests/explore-visuals*.test.mjs, explore-sweep.test.mjs mobile rows, the E15/E2 edge rows) renew red-first to the rail + one-at-a-time + scroll-range contract; the sweep's mobile rows re-derive.

Gate chronologically last: npm run typecheck && npm test && npm run build && node --test tests/*.mjs — all green. Commit atomically: "fix(explore): 44px card bands shrink the stage; mobile experience becomes a one-at-a-time year rail with scroll-driven swaps (user directives)". Do NOT push. Report the commit hash + both changes' summaries.
**Run:** 2026-10-05T10:28:38.488Z

## Result

Green over the committed state. Done — no push.

## Commit

**`43432f5e8feb2d18e1b6c9e20677e4626a1d6a5e`** (branch `phase-13`, 9 files, +574/−354)
`fix(explore): 44px card bands shrink the stage; mobile experience becomes a one-at-a-time year rail with scroll-driven swaps (user directives)`

**Gate (chronologically last, over the committed state):** `typecheck=0` · `npm test` **314/314** · `build=0` · `node --test tests/*.mjs` **314/314, exit 0**.
**Red-first on record before implementation:** 14 failures — 8 in `projects-stack.test.mjs` (`-472 !== -332` etc.), 5 across `explore-visuals*`, 1 sweep P row + the build-dependent E-10.

## PART 1 — 44px card bands

- `projects-card-state.ts`: `VISIBLE_BAND_PX` 72 → 44. Formula contract untouched: `translateY(l) = −(l·44 + H·(1−scale_l))`, `yLeave = translateY − 56`, scale/opacity/z ladders unchanged. Docstring re-derives both tables and names the constant the user's density dial. md H=560 → `−66/−133/−199/−266/−332`, yLeave `−122/−189/−255/−322/−388`; base H=520 → `−65/−130/−194/−259/−324`, yLeave `−121/−186/−250/−315/−380`.
- `projects-stack-stage.tsx`: `PEEK_BAND_PX = 5·44 + 20 = 240`; `STAGE_HEIGHT_CLASS` `h-[900px]/md:h-[940px]` → `h-[760px] md:h-[800px]` (stage = card + band, band inclusive of safe). Containment identity still lands the depth-5 top edge exactly on the 20px safe margin.
- Pins renewed: both ladders, the band/`stagePx` rows, the frontIndex-0 and frontIndex-3 geometry rows, the RM row, the departed-card tracer. `projects-stack.test.mjs` 35/35.

## PART 2 — mobile one-at-a-time year rail

- Desktop `md+` untouched in behaviour: same arc, same 300vh sticky range, same all-content grid stack (the container's class form changed — `flex flex-col … md:grid` → base `grid` — but the md computed layout is identical; `space-y-5` was already `md:space-y-0`).
- `<md` rail: `.explore-panels.tsx` gives the phone its own range on the same data-conditional wrapper — `wrapper: 'h-[400vh] md:col-span-2 md:h-[300vh]'` (5 × 80vh), `shell: 'sticky top-0 z-10 md:sticky md:top-0 md:z-10 md:h-[calc(100dvh-10rem)]'`. `use-timeline-progress.ts`: the index derivation is now **un-branched** (`continuousIndex(progress)` → `activeIndexFromContinuous`, the phase-8 formula reused, unequal 12.5/25/25/25/12.5 bands and all); the scroll listener is live at every width; the **imperative write channel** (arc measure, marker transforms, per-layer styles) moved behind `if (mdMedia.matches)`; `steppedIndexRef`/`scheduleRef` retired; `goToRole` is one `scrollTargetForRole` + `main.scrollTo` path measuring each tier's own wrapper.
- `experience-section.tsx`: `<md` renders the rail (thin line + 5 year markers, top = present 2023→2012, active = accent dot + accent year, education keeps the constant hollow dot) and the body shows exactly one entry via a single-cell grid overlay — `col-start-1 row-start-1` + `transition-[opacity,visibility] duration-200 ease-out md:transition-none`, active `opacity-100 visible` / rest `opacity-0 invisible`. No spatial slides; RM = instant (the existing guard, no second suppressor). The arc SVG + dot/label markers are `hidden md:block` (md-only presentation, still one DOM). The per-layer `md:hidden` year chip retired — the rail owns the years. Verified in `out/index.html`: 5 rail markers, exactly one `opacity-100 visible` layer, arc path present but `hidden`.
- Pins renewed red-first: `explore-visuals` (2 rows rewritten, 2 replaced: rail parity + `<md` one-at-a-time), `explore-visuals-server` (rail-grammar row), `explore-sweep` (the `EXPLORE@375` row, E-8/E-9/E-10 messages, plus a data-derived E-10 rail row: 5 markers and the present-first year order straight from `selectTimelineEntries`).
- RESOLVED-D1 all-five-readable is recorded as superseded on mobile in both the section and hook docstrings; the phase-7 rail gone-checks (`border-l`, `-left-[4px]`, `<ol`) stay live — the new rail is a distinct anatomy.

## Notes / holds

- **`touch-action: pan-y`**: left untouched, no new CSS. The experience stage carries no wheel/touch/drag handlers, so nothing captures the vertical scroll — the page scroll *is* the input. The projects stage keeps its existing globals.css rule (pinned by REV-23b/E-10).
- **`.planning/STATE.md` was already dirty on entry** (the previous quick task `2026-10-05-stack-reveal-ladder`'s uncommitted record). I left it alone rather than sweep an unrelated hunk into this atomic commit, and wrote no separate planning record — the task pinned one commit. Flip it if you want the quick-task line committed too.
- No push, no PR — remote writes stay gated.