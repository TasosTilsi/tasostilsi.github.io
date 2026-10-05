# Phase 13: mobile-parity-revision - Context

**Gathered:** 2026-10-05T07:18:13.297Z
**Status:** Ready for planning

<domain>
## Phase Boundary
**In scope:** Arc parity <md; the full swipe stack at every width; the avatar block removed; the typed viewport meta (viewportFit=cover) replacing the data-file render; the mobile-native pack (tap-highlight/overscroll/touch-action/safe-areas; the height lock reconciliation); stale-test renewal + the phone checklist.
**Out of scope:** The wizard, the Credentials panel, the CLI, /resume, desktop-only behaviour changes, new dependencies, data deletions, device sniffing.
</domain>

<decisions>
## Decisions
### Full parity (REV-23)
- **D-01:** The arc renders at EVERY width: the arc zone's `hidden md:flex` retires — at <md the zone renders above/beside the content in a compact stacked layout (arc top, content below, or a slim horizontal arc strip — the geometry is container-derived so the narrow container scales the radius/labels automatically); the year-marker fit predicate + label nowrap re-derive at the narrow width; the active role stays at the focal point; no horizontal scroll.
  - **SUPERSEDED in execution (user directive 43432f5, approved 9fd3a87): the <md presentation is NO arc — a vertical year rail with one-at-a-time scroll-driven entries; desktop md+ = the arc as pinned. Delivered and verified.**
- **D-02:** The swipe stack = ONE contract at every width: the simplified projects-mobile-stack wrapper retires; <md renders the same ProjectsSwipeStack with the same drag/behind-cards/centering/shadows, inside the same peek-band-height arithmetic (the container-derived heights: 690px-equivalent applies BUT the full peek + cards show — the phase-10 W-11 two-visible-cards/±28px pin retires with the wrapper).
- **D-03:** The wizard stays untouched (it tested great on the phone); the drawer/wizard/counter flows unchanged.
### Avatar removal (REV-24)
- **D-04:** The About panel's avatar block removed ENTIRELY (no img, no initials chip — user); the panel reflows around the positioning lead + metrics + availability + contacts; profileImageUrl stays in the data file unconsumed (nothing deleted from data; the field's last UI consumer goes).
### Mobile-native pack (REV-25)
- **D-05:** The typed viewport export gains viewportFit: 'cover' (root layout.tsx); the layout STOPS rendering the data-file meta line (`portfolioData.meta.viewport`); meta.viewport stays in the JSON unconsumed (map-content-surfaces: its single consumer retires, nothing deleted).
- **D-06:** The platform pack in globals.css (the landing route lock extends): `-webkit-tap-highlight-color: transparent` on html; `overscroll-behavior: none` on html/body (inside the landing's existing route-scoped lock — /cli + /resume untouched); `touch-action: manipulation` on button/a/[role=button]; `touch-action: pan-y` on the swipe stage (the drag owns horizontal; vertical scroll survives — mobile-native §9); safe-area insets: the header gains `padding-top: env(safe-area-inset-top)`, the footer `padding-bottom: env(safe-area-inset-bottom)` (with viewportFit=cover the envs activate); the height lock reconciled: html/body keep height:100% + overflow:hidden, the shell stays h-dvh (URL-bar adaptive) — the gap-after-footer dies.
- **D-07:** Real-hardware verification is the user's bar: every VISUAL claim ships with the phone checklist; the programmatic half (grep pins, export checks, suites) is mine. The suite + gate re-run chronologically last; stale <md pins renew.
### Claude's Discretion
- The arc's <md layout shape (arc strip above the content vs beside) — container-derived, taste-guided
- Safe-area padding magnitudes within the env values
- The stage's mobile height arithmetic (the band still fits the narrow width)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Parity targets
- `src/components/explore/sections/experience-section.tsx:134 — the arc zone's `hidden md:flex` (the phase-8 <md pin this phase retires)`
- `src/components/explore/sections/projects-mobile-stack.tsx — the simplified mobile wrapper retiring (the full stack takes over)`
- `src/components/explore/sections/about-section.tsx — the avatar img block to remove`
### Viewport + lock sites
- `src/app/(home)/layout.tsx — the height:100% lock + where the data-file meta line renders (the viewport retirement site)`
- `src/app/layout.tsx:59-64 + :104 — the typed viewport export (gains viewportFit=cover) + the data-file meta line`
- `portfolio-main-data.json meta.viewport — the field retiring from consumption (stays in the data, unconsumed)`
### Skill + locked spec
- `~/.dsh/skills/mobile-native/SKILL.md — the platform pack (Baseline, symptom table, Hard Rules)`
- `.planning/phases/EXPLORE-13-mobile-parity-revision/EXPLORE-13-mobile-parity-revision-SPEC.md`
</canonical_refs>

<code_context>
## Code Context
- SPEC.md locked what/why; focus this discussion on 'how'.
- The viewport meta renders from portfolioData.meta.viewport (src/app/layout.tsx:104) — 'shrink-to-fit=no' + no viewportFit; the typed viewport export (line 59) already carries themeColor per scheme — viewportFit goes there
- The landing's height:100% lock (route-scoped style in the (home) layout) conflicts with dvh on the phone's collapsing URL bar — the lock keeps the WINDOW still but the shell's dvh tracks the visual viewport; the reconciliation: keep the shell h-dvh (URL-bar-adaptive) + the lock's overflow:hidden stays (the rubber-band guard) + safe-area insets handle the notch/home-indicator zones
- The arc's cos/sin geometry derives from the CONTAINER (arc zone) — at <md the zone renders (retire the hidden) with a smaller radius via the same container measurement (the marker labels' nowrap + the fit predicate re-derive)
- The swipe stage is container-relative (cardState + the fixed stage heights at 790/830) — the mobile branch reuses the SAME stage with the mobile container's height (the fixed 690px mobile box retires; the stage height derives the same way)
- touch-action: pan-y is CRITICAL on the drag card — the horizontal drag must not eat vertical page scroll (the carousel symptom; mobile-native §9) — the stage is inside <main>'s scroll: vertical swipes must scroll the page, horizontal swipes drag the card
- The reduced-motion guard lives at .explore-shell scope — mobile inherits it free
- 44px targets, the drawer, wizard (untouched — it tested great), credentials (unchanged)
</code_context>

<specifics>
## Specifics
**LOCKED from SPEC (what/why)**
- **Requirements (SPEC):**
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
- **Boundaries (SPEC):**
  **In scope:** Full mobile parity (real-hardware-tested): the <md simplifications retired - the arc and the full swipe stack render on phones - the avatar removed, and the mobile-native platform pack applied (proper viewport meta with viewport-fit=cover, dvh/svh, overscroll/tap-highlight/safe-areas) - killing the gap-after-footer, the extra scrollbars, and the touch failures.
  **Out of scope:** (not specified)
- **Acceptance Criteria (SPEC):**
  - `npm run build` (CI gate), `npm run typecheck`, and the full node --test suite pass on the final tree; all routes export statically
  - The semicircular arc renders below `md`: the arc zone's `hidden md:flex` is retired — the arc displays on phones scaled to the narrow container (the cos/sin geometry derives from the smaller container), with the year markers readable and the active role at the focal point; no horizontal scroll at 375px
  - The Projects swipe stack on mobile is the FULL experience: drag/swipe works on touch, behind-cards peek visibly, the stack is centered in its container, the depth shadows render — the simplified mobile-stack wrapper is retired in favour of the same stack contract as desktop (the fixed limited-peek box goes)
  - The avatar block is removed from the About panel entirely (no img, no initials chip) — the panel reflows; the data file's profileImageUrl field stays (harmless, unconsumed)
  - The viewport meta is emitted by Next's typed `viewport` export (viewportFit=cover + the theme-color entries) — the layout NO LONGER renders the data-file's `<meta name=viewport content='shrink-to-fit=no'>` line (the meta.viewport field retires from the export surface; the data field itself stays harmless)
  - The mobile-native pack is in globals.css: `-webkit-tap-highlight-color: transparent` on html, `overscroll-behavior: none` on html/body (the landing's route-scoped lock extended), `touch-action: manipulation` on buttons/anchors, safe-area padding (`env(safe-area-inset-top/bottom)`) on the header/footer, and the dvh/svh pairing correct (the shell stays dvh; the height:100% lock reconciled with it — no gap after the footer on the phone)
  - Both scrollbars-but-one invariant holds on mobile: the window does not scroll (<main> is the only scroll container); verified by the structural tests + the user's phone
  - The starting guide (wizard) still plays on mobile and is unaffected; the Credentials panel unchanged; 44px targets hold; both themes legible on the phone
  - Stale-test renewal: suites pinning the <md simplifications (hidden arc zone, the mobile fixed-height stack, the avatar) renews to the parity contracts; the sweep's mobile rows re-derive
- User: real-phone test report (7 items quoted in SPEC background)
- User: FULL PARITY — 'the experience is not shown like the semicircle that is built for the web' + the swipe complaints = the phone gets the web experience
- User: 'nothing goes in there no need of an image no need of initials' — the avatar goes entirely
- User: 'the credentials div is ok as it is' — untouched; 'the starting guide is great' — untouched
</specifics>

<deferred>
## Deferred Ideas
- Landscape-specific tweaks (test once on the phone; adapt only if broken)
- A user-supplied profile image (revisit only if asked)
- PWA/manifest additions (future)
</deferred>


---

*Phase: 13-mobile-parity-revision*
*Context gathered: 2026-10-05*