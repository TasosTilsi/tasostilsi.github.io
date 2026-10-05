# Phase 13: mobile-parity-revision - Spec

**Gathered:** 2026-10-05T07:17:47.021Z
**Mode:** interviewed

## Requirements

_Every requirement is FALSIFIABLE — a test or check proves whether it was met or not. Each carries Current / Target / Acceptance._

### Req REV-23

- **Current:** The arc zone carries `hidden md:flex` (phase-8's compact-form pin) — phones never see the semicircle.
- **Target:** Full arc parity on mobile: the semicircle renders below md, scaled to the narrow container.
- **Acceptance:** The arc zone renders at every width (grep: no `hidden md:flex` on the arc container); the scaled arc + markers are readable at 375px with the active role at the focal point; no horizontal scroll; the touch interaction works on the phone (user-verified).

### Req REV-23b

- **Current:** The mobile stack is the phase-9/10 simplified wrapper — swipes dead, behind-cards hidden, off-center.
- **Target:** Full swipe-stack parity on mobile: real drag, behind-cards, centering, shadows.
- **Acceptance:** The swipe stack on mobile = the desktop contract: touch drag, behind-cards visible, centered, depth shadows; the simplified mobile wrapper (fixed 690px box, 2-card peek) retired; 44px touch targets; no horizontal scroll.

### Req REV-24

- **Current:** The About panel renders the tinyurl avatar (dead link, broken image on the phone).
- **Target:** The avatar is removed entirely — no image, no initials (user decision).
- **Acceptance:** grep-verifiable: no `<img` avatar in the About panel source, no profileImageUrl consumption, no img emitted in the export's About panel.

### Req REV-25

- **Current:** The viewport meta renders from the data file ('shrink-to-fit=no'); no safe-areas; no overscroll/tap control — the mobile gap + extra scrollbar.
- **Target:** The mobile-native platform pack: proper typed viewport meta (viewportFit=cover), dvh/svh reconciliation, safe-area insets, tap-highlight/overscroll/touch-action.
- **Acceptance:** The export header carries viewportFit=cover in the typed viewport meta; the data-file meta line is gone from the layouts; safe-area padding on the header/footer; tap-highlight/overscroll/touch-action pins in globals.css; the gap-after-footer + the 2nd scrollbar die on the phone (user-verified); the wizard/tour/stack/drag machinery untouched.

## Boundaries

**In scope:** Full mobile parity (real-hardware-tested): the <md simplifications retired - the arc and the full swipe stack render on phones - the avatar removed, and the mobile-native platform pack applied (proper viewport meta with viewport-fit=cover, dvh/svh, overscroll/tap-highlight/safe-areas) - killing the gap-after-footer, the extra scrollbars, and the touch failures.
**Out of scope:** (not specified)

## Constraints

- PARITY, not just fixes: the <md simplification branches retire (the arc zone renders at every width; the mobile stack = the same swipe contract) — the user explicitly reversed the phase-8 desktop-first decision
- The mobile-native skill's platform pack, applied per its Hard Rules: media queries over device sniffing; never disable zoom; touch-action on the gesture surface (the swipe stage: touch-action: pan-y so vertical page scroll survives while horizontal drag is owned by the card); user-select: none only on controls
- The viewport meta retires from the data-rendered path (the layout stops emitting portfolioData.meta.viewport) and moves to the typed Viewport export — the meta.viewport data field stays in the file unconsumed (nothing deleted; map-content-surfaces: the field's only consumer was the layout meta line)
- The wizard (the starting guide) is untouched (it tested great); the Credentials panel untouched; the CLI and /resume untouched
- Real-hardware verification is the user's bar: every visual claim marked for the phone; the structural/programmatic half is mine (tests + static export checks)
- 44px targets, both themes, no new dependencies, stale-test renewal for the retired <md pins

## Acceptance Criteria

- `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
- The semicircular arc renders below `md`: the arc zone's `hidden md:flex` is retired — the arc displays on phones scaled to the narrow container (the cos/sin geometry derives from the smaller container), with the year markers readable and the active role at the focal point; no horizontal scroll at 375px
- The Projects swipe stack on mobile is the FULL experience: drag/swipe works on touch, behind-cards peek visibly, the stack is centered in its container, the depth shadows render — the simplified mobile-stack wrapper is retired in favour of the same stack contract as desktop (the fixed limited-peek box goes)
- The avatar block is removed from the About panel entirely (no img, no initials chip) — the panel reflows; the data file's profileImageUrl field stays (harmless, unconsumed)
- The viewport meta is emitted by Next's typed `viewport` export (viewportFit=cover + the theme-color entries) — the layout NO LONGER renders the data-file's `<meta name=viewport content='shrink-to-fit=no'>` line (the meta.viewport field retires from the export surface; the data field itself stays harmless)
- The mobile-native pack is in globals.css: `-webkit-tap-highlight-color: transparent` on html, `overscroll-behavior: none` on html/body (the landing's route-scoped lock extended), `touch-action: manipulation` on buttons/anchors, safe-area padding (`env(safe-area-inset-top/bottom)`) on the header/footer, and the dvh/svh pairing correct (the shell stays dvh; the height:100% lock reconciled with it — no gap after the footer on the phone)
- Both scrollbars-but-one invariant holds on mobile: the window does not scroll (<main> is the only scroll container); verified by the structural tests + the user's phone
- The starting guide (wizard) still plays on mobile and is unaffected; the Credentials panel unchanged; 44px targets hold; both themes legible on the phone
- Stale-test renewal: suites pinning the <md simplifications (hidden arc zone, the mobile fixed-height stack, the avatar) renews to the parity contracts; the sweep's mobile rows re-derive

## Edge Coverage / Prohibitions

_OUT OF SCOPE (later phase): edge-completeness and prohibition probes are handled by a subsequent phase — not by this spec-phase._


## Interview Log

- User tested on a REAL PHONE (2026-09-26) and reported 7 items (quoted in the background): starting guide OK, header/buttons missing, no semicircle on mobile, gap after footer + 2 scrollbars, broken tinyurl profile image, swipe stack dead on touch (+ not centered, no behind-cards), credentials OK.
- Q: full parity or fix the simplified forms? A: FULL PARITY (user — the <md simplifications retire; the phone gets the arc + the full swipe stack).
- Q: the dead tinyurl image? A: 'nothing goes in there no need of an image no need of initials' — the avatar block REMOVED entirely (no img, no monogram).

---

*Phase: 13-mobile-parity-revision*
*Spec gathered: 2026-10-05*
## Ambiguity Report

**Status:** UNAVAILABLE

_The ambiguity-scoring subagent could not score this draft. Cause: unknown. The SPEC.md is still written; the planner should treat the un-scored clarity dimensions as assumptions and re-clarify them._
