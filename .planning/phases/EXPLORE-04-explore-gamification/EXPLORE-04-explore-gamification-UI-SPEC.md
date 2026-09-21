All environment facts verified (components read, Radix ESC behavior verified in `node_modules`, token blocks and z-landscape pinned, test harness style confirmed). Returning the **full UI-SPEC.md** below.

---

# EXPLORE-04 explore-gamification — UI-SPEC (design contract)

**Status:** Ready for planning · **Binding before implementation** · Phase: 04-explore-gamification
**Inputs honored:** CONTEXT.md D-01…D-08 (locked), SPEC REQ EXPLORE-04 / 04b / 04c / 04d, phase-1/2/3 UI-SPEC precedents (44px px-based chrome, drawer portal scope, reduced-motion guard, static panels).
**Contract scope:** layout, interaction states, visual behaviour, edge coverage for the tour wizard (overlay, cut-out, cards), the header Tour button, and the live status-bar counter ONLY. Everything not specified here is unchanged phase-3 behaviour. Spin-the-wheel, achievements, milestone toasts: **do not exist** (user-dropped).
**Copy register:** chrome, light-humor allowed (phase goal), **zero invented portfolio facts** — every summary describes only what the panel verifiably contains.

---

## §0 — Locked frame (do not relitigate)

- **Augment-only:** outer grid, PanelShell, drawer internals, intro strip, panel bodies, CLI, /resume, all data files — **byte-untouched**. New files live under `src/components/explore/` only (D-08). Zero new dependencies (`lucide-react` ^0.475.0 already in package.json:44; `Compass` icon exists in it).
- **Verified environment facts this contract relies on:**
  - `EXPLORE_SECTIONS` locked order/labels (constants.ts:10-16); panel accents chart-1…5 in that order (explore-panels.tsx:37-43). Panels are `<section id aria-label className="rounded-md border bg-card p-4">` (panel-shell.tsx:39-42); `rounded-md` = `calc(var(--radius) − 2px)` = **2px** (globals.css `--radius: 0.25rem`; tailwind.config.ts:64-68).
  - `<main>` is the ONLY scroll container: `flex-1 overflow-y-auto p-4 md:p-6` (explore-shell.tsx:47-53). All rect math and scroll-settle/IO work target this element, never the window.
  - Header: `h-[52px]`, right cluster = [theme 44px ghost][drawer 44px ghost], drawer **RIGHTMOST is a locked phase-1 pin** (explore-header.tsx:33-84). Ghost recipe: `rounded-md text-muted-foreground hover:bg-muted` + `focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background`; icon `h-5 w-5` with `aria-hidden`.
  - Status bar: `h-7 sm:h-8 text-[10px] sm:text-xs`, right `<p aria-live="polite">` already exists (explore-status-bar.tsx:28) — the live counter wires INTO this existing live region; string format `${n}/${EXPLORE_SECTIONS.length} sections visited` unchanged.
  - **Z landscape (verified):** Sheet overlay+content = `z-50`, portaled to `<body>` (sheet.tsx:24,34,60); Dialog likewise `z-50` (dialog.tsx:24,41). No `z-30/z-40/z-[…]` anywhere under `src/components/explore/`. The shell root `div.explore-shell` creates **no stacking context** (no position/z/transform — globals.css:499, explore-shell.tsx:39) → a `z-40` overlay inside the shell competes with the Sheet in the root stacking context and renders **below** it.
  - If the overlay renders **inside** `.explore-shell` DOM (last child of the shell root), it inherits IDE tokens, JetBrains Mono, AND the reduced-motion guard (globals.css:581-593 `.explore-shell *`) with zero portal-class work — the `explore-shell` marker-class hack is only needed for body-portal escapes (explore-drawer.tsx:12-15). **Pinned: tour renders inside the shell, not portaled.**
  - **Radix ESC facts (verified, node_modules/@radix-ui/react-dismissable-layer/dist/index.js:105,130-137):** Radix registers its ESC keydown on `document` with `{capture: true}` only while it is the highest layer; it calls `preventDefault()` but **never `stopPropagation()`**. Document capture listeners fire in registration order → a tour listener registered when the tour opens (typically before any drawer) runs first if it also opens first. Contract in §9 pins the exact resolution.
  - Reduced-motion CSS `scroll-behavior: auto !important` (globals.css:592) does **not** override an explicit JS `scrollIntoView({behavior:'smooth'})` — the implementation must branch behavior on `window.matchMedia('(prefers-reduced-motion: reduce)')` at call time (matchMedia pattern precedent: explore-intro.tsx).
  - Storage precedent: guarded `try { localStorage… } catch {}` so private mode keeps working per-session (use-explore-theme.ts:44-47); state initializes to a **literal** and syncs in a one-shot mount effect — never read storage during render (hydration contract, use-explore-theme.ts:27-31).
  - Test harness: `node --test` source-level + `out/`-export-level invariants, zero new deps (tests/explore-shell.test.mjs pattern). Static export target: `out/explore.html` — the tour overlay must be **absent from static HTML** (client-mount-only) while the Tour button **is present** (client components SSR at build).
  - Viewport reality: 375px → main padding 16px each side → panel width ≈ **311px**; status bar **28px** tall (<640px), header 52px, intro strip 20–40px (explore-intro.tsx). Tailwind defaults: sm 640 / md 768 / lg 1024 (no custom screens in tailwind.config.ts).

---

## §1 — Layout: regions, z-stack, overlay anatomy

**Frame regions (unchanged):** ① header 52px · ② intro strip · ③ `<main>` scroll container (panels) · ④ status bar. The tour adds **no** region to this frame — it is an overlay + one header button + one counter wiring.

**Z-stack (pinned, root stacking context):**

| Layer | z | Element | Notes |
|---|---|---|---|
| dim + cut-out + card | **40** | tour overlay (inside `.explore-shell`, last child of shell root) | above all shell content (header/intro/main/status are z-auto) |
| drawer Sheet overlay+content | 50 | portaled to `<body>` | renders **above** the tour dim when open mid-tour |

**Overlay anatomy (one wrapper, three children; wrapper is `fixed inset-0 z-40 pointer-events-none`, renders nothing in SSG):**

1. **Cut-out hole element** (content steps only): absolutely-positioned transparent element sized to the measured panel rect **inflated 12px on all sides**, `rounded-md`, `box-shadow: 0 0 0 100vw rgba(0,0,0,0.7)` (D-01 verbatim), `pointer-events: none`, `aria-hidden="true"`. The box-shadow IS the dim layer — one element, no SVG mask. The 12px ring shows undimmed page background around the panel (intended spotlight breathing ring; hole radius 2px vs panel radius 2px with a 12px ring — corner mismatch is imperceptible).
2. **Plain full dim** (welcome/finish steps only): `fixed inset-0` div with `background: rgba(0,0,0,0.7)`, `pointer-events-none`, `aria-hidden` — no hole, no cut-out.
3. **Step card**: the ONLY `pointer-events-auto` descendant. Geometry in §3, anatomy in §4.

**Pointer-events model (pinned, resolves D-01 honestly):** the entire overlay except the card is `pointer-events: none`. The dim is **visual-only** — the page stays fully interactive during the tour (panel links, header toggles all work; nothing is click-blocked). Rationale: with the one-element box-shadow technique (D-01 bans SVG masks), a click-blocking dim would also block the hole; "never blocks the page" (SPEC) wins. Outside clicks therefore do **not** dismiss the tour — dismissal is X / ESC / finish / link-out only. No caret/pointer connects card to panel — the 12px undimmed ring is the association.

**No horizontal scroll:** box-shadow never contributes to scroll overflow; the wrapper is `inset-0`; card widths are clamped (§3). The 375px invariant survives by construction.

---

## §2 — Spotlight mechanics: measure, re-measure, scroll-settle

- **Measure primitive:** `document.getElementById(sectionId).getBoundingClientRect()` — viewport coords, matching `position: fixed` overlay math. Target lookup happens **after** scroll settle, never mid-scroll (D-02).
- **Scroll-settle (shared primitive, used by wizard advance AND §3 re-measure):** call `main.scrollIntoView… ` then `main.addEventListener('scrollend', settle, { once: true })` racing a `setTimeout(settle, 700)` fallback (Safari lag; idempotent guard so only the first fires), plus double-`requestAnimationFrame` before measuring. If the panel is already fully in view, settle fires immediately (scrollend or timeout — measure still runs).
- **Reduced motion:** `behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'` — under reduce the jump is instant and settle logic still runs (measure-after-jump contract identical).
- **Re-measure triggers (cut-out + card reposition, always INSTANT — no transition on left/top/width/height, ever):** (a) step change (after settle), (b) window `resize`/`orientationchange` (rAF-coalesced, immediate), (c) main-container scroll settle (the §2 primitive) — mid-scroll drift is accepted and corrected at scrollend (U-2).
- **Rapid Next/Back during an unsettled scroll:** each step change cancels the pending settle listener/timer and starts a fresh one for the new target — last click wins, no flicker loop.
- **Target missing guard:** if the panel element is not found (defensive; all five always render this phase), render the plain full dim (no hole) and place the card docked-bottom — the tour never crashes on a missing target.
- **Panel content interactivity inside the hole:** unchanged — drawer anchors, contact links, everything inside the cut-out behaves exactly as with no tour.

---

## §3 — Step sequence, placement rules, welcome/finish handling

**Locked sequence (D-02/D-03) — indices drive dots and "Step N of 7":**

| N | Step | Target panel | Marks visited | Card target |
|---|---|---|---|---|
| 1 | Welcome | — | no | no-target (centered / docked) |
| 2 | About | `about` (chip chart-1) | yes | auto-place near panel |
| 3 | Experience | `experience` (chart-2) | yes | auto-place |
| 4 | Skills | `skills` (chart-3) | yes | auto-place |
| 5 | Projects | `projects` (chart-4) | yes | auto-place |
| 6 | Contact | `contact` (chart-5) | yes | auto-place |
| 7 | Finish card | — | no | no-target |

Step activation order per content step: set step → mark visited (`markVisited(sectionId)`, dedupe) → scroll-settle → measure → render cut-out + card → focus card (§6). Marking happens at step activation, not after settle.

**Card placement — pure decision function (unit-testable, planner may factor it out):** given `panelRect`, measured `cardRect`, `viewport {w, h}`:
- `width = min(384, panelRect.width)` px; horizontal: left-aligned to `panelRect.left`, clamped to 16px gutters both sides.
- **below** first: `top = panelRect.bottom + 12`; valid if `top + cardH ≤ vh − 16`.
- else **above**: `bottom = panelRect.top − 12`; valid if `bottom − cardH ≥ 8` (no header exclusion zone — the card may paint over the dimmed header; the dim covers it).
- else **dock**: `fixed left-4 right-4 bottom-4` (viewport − 32px wide). At 375px with typical panel heights, dock is the expected mode.
- **no-target steps (welcome/finish):** `<640px` → dock (same geometry); `≥640px` → centered via `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`, width 384 max.
- No caret/arrow connects card to panel (the ring associates them); no caret is a pin, not an omission.

**Placement edge rule:** if the current step's panel is scrolled off-viewport (e.g. after a manual jump), the card still resolves by the same table — if neither below nor above fits the off-screen reality, it docks. Deterministic, never off-screen (SPEC acceptance).

---

## §4 — Card anatomy + pinned copy

**Card shell (both themes via inherited tokens):** `bg-card border rounded-md shadow-lg p-4` — reads as a sibling of PanelShell chrome. JetBrains Mono inherited (inside shell).

**Anatomy (top→bottom):**
1. **Heading row** (`flex items-center gap-2`, `min-h-11`): accent chip `h-2 w-2 rounded-full bg-chart-N` (same map as panels, explore-panels.tsx:37-43; welcome/finish chips: no chip — heading only) + heading `text-sm font-medium` (= `aria-labelledby` target) + **X** button (`ml-auto`, `h-11 w-11`, icon `h-4 w-4`, `aria-label="Close tour"`).
2. **Body** `mt-2 text-xs leading-relaxed text-muted-foreground`: 1–2 sentences per the copy table.
3. **Finish card extra** (replaces/extends body): congratulation line + internal `<Link href="/">` styled `text-accent` (next/link, same tab) + one-line muted hint. D-04 exactly.
4. **Controls row** `mt-3 flex items-center justify-between gap-2`:
   - **Back**: ghost `h-11 px-3 text-xs rounded-md` (hover/focus recipe per §0 header ghost); step 1 → `disabled` (`opacity-50`, not focusable).
   - **Center**: dots row — 7 dots `h-1.5 w-1.5 rounded-full`, active `bg-accent`, inactive `bg-muted-foreground/40`; + `text-[10px] text-muted-foreground` `Step N of 7`. **At `<640px` the dots hide** (counter text remains — the 311px card cannot fit both); dots are `aria-hidden` (counter text is the accessible progress), non-interactive.
   - **Next**: same ghost recipe; label per step: step 1 = **Start**, steps 2–5 = **Next**, step 6 = **Finish**, step 7 (finish card) = **Done**. Primary action reads `text-accent`.

**Pinned copy (chrome; ≤2 sentences; planner may adjust wording WITHIN register — §14):**

| Step | Heading | Body |
|---|---|---|
| 1 Welcome | `explore --tour` (accent token, TerminalPointer motif) | “A 60-second lap of the five sections — Next and Back at your own pace, ESC whenever you're done. No timers.” |
| 2 About | About | “The short version of who's typing — bio, role, and location.” |
| 3 Experience | Experience | “Roles in order, with the career-span chart on top for the shape of it.” |
| 4 Skills | Skills | “Skills by category, then the treemap of what the actual work proves — full inventory below.” |
| 5 Projects | Projects | “Stat tiles up top, six projects underneath.” |
| 6 Contact | Contact | “The part where you say hi back — resume export and every channel, exactly as listed.” |
| 7 Finish | `tour complete` | Congrat: “That's the lap — every section's marked visited on the counter below.” Link: **“Open the terminal →”** (`href="/"`, same tab). Hint (muted): “the full story lives in the terminal — start with help”. |

Copy above is grounded in verified panel content only (about-section.tsx bio/title/location; phase-3 §1 chart/treemap/chips; projects stat tiles + 6 cards; contact resume row + channels). No facts, numbers, or claims beyond orientation.

---

## §5 — Augment points: Tour button + live counter

**Header Tour button** — order becomes **[Tour][Theme][Drawer]**: Tour enters as the LEFTMOST of the right cluster, so the existing pair stays byte-identical and the drawer stays RIGHTMOST (locked phase-1 pin). 44×44px ghost (recipe per §0), `lucide-react` `Compass h-5 w-5 aria-hidden`, `aria-label="Start the guided tour"`, `shrink-0`. 375px fit: 3×44px + glyphs + gaps ≈ 208px fixed → title (flex-1 truncate) keeps ~160px, truncates — safe. States: default/hover `hover:bg-muted`/focus-visible ring/disabled **n/a** (always enabled; clicking while the tour is open resets to step 1 — pinned).

**Status-bar live counter** (replaces the literal `0`, explore-status-bar.tsx:31): `<span>{`${visitedCount}/${EXPLORE_SECTIONS.length} sections visited`}</span>` inside the existing `aria-live="polite"` `<p>` — string format byte-identical to today. When `visitedCount === 5`, the counter span renders `text-accent` (tiny gamification, no toast — the only celebration visual in the phase). `ExploreStatusBar` gains a `visitedCount: number` prop; single source of truth lives in `ExploreShell`.

---

## §6 — Interaction states (complete matrix)

| Control | Default | Hover | Focus-visible | Active/pressed | Disabled | Loading/Error | Notes |
|---|---|---|---|---|---|---|---|
| Tour button (header) | ghost muted | `bg-muted` | ring-2 ring-ring offset | instant | n/a | n/a | re-opens at step 1 always (D-05) |
| Next/Start/Finish/Done | ghost, `text-accent` | `bg-muted` | ring | instant | never (label per step) | n/a | advances after click; settle is async but non-blocking |
| Back | ghost muted | `bg-muted` | ring | instant | step 1 only (`opacity-50`, not focusable, `aria-disabled` implicit via `disabled`) | n/a | n/a |
| X (card) | ghost | `bg-muted` | ring | instant | never | n/a | dismiss = flag `seen` unless already `completed` |
| Finish card Link | accent text | underline | ring | instant | never | n/a | next/link → `/`, same tab (D-04) |
| Dots | `bg-muted-foreground/40` | none | none | none | non-interactive (not a control, `aria-hidden`) | n/a | active `bg-accent` |
| Dim + cut-out | rgba(0,0,0,0.7) | n/a | n/a | n/a | pointer-events: none | n/a | visual-only dim (§1) |
| Drawer mid-tour | — | — | — | — | — | — | opens normally ABOVE dim (z-50>40); see §11 |
| Panels inside cut-out | unchanged | unchanged | unchanged | unchanged | unchanged | n/a | pass-through by D-01 |

**Keyboard (pinned):** `Enter`/`Space` native on buttons; `ArrowLeft`/`ArrowRight` on the card = Back/Next (disabled-aware); `Tab` cycles **within the card's focusables only** (minimal keydown trap — with the visual-only dim, an untrapped Tab would wander into dimmed panels, violating the SPEC's "focus is not lost behind the overlay"); `ESC` = dismiss (ordering table in §9).

---

## §7 — Triggers & persistence

- **Keys (explore-scoped, disjoint from CLI keys — constants.ts precedent):** `portfolio-explore-tour` → `'seen' | 'completed'` (written on dismiss / finish-card render respectively; any non-null value suppresses auto-open); `portfolio-explore-visited` → JSON array of visited section ids (dedupe, append-only, filtered to valid EXPLORE_SECTIONS ids on read).
- **Auto-open:** on mount + **800ms** delay, only if the tour key is absent; the timer is **cancelled by any pointerdown/keydown before it fires** (user already driving). Opens at step 1 (welcome). One-shot per page load.
- **No storage-event listener, no cross-tab sync** (single-tab concern; YAGNI).
- **Focus return:** on dismiss/finish, focus returns to the header Tour button (exists in all cases, incl. auto-open).

---

## §8 — Responsive behaviour

| Viewport | Cut-out | Card | Controls row |
|---|---|---|---|
| 375px (<sm) | 12px ring; dock expected for most steps | `left-4 right-4 bottom-4`, width = viewport−32; may partially cover the 28px status bar — accepted transient tradeoff (tour-scoped; counter stays live underneath, covered) | dots hidden; `Back · Step N of 7 · Next` fits (≈50/70/55px + gaps in 311px) |
| ≥640px (sm+) | same | below/above per §3 table; welcome/finish centered | dots + counter both visible |
| md/lg grid layouts | panel rects measured per actual grid position — About spans 2 cols (explore-panels.tsx:76-78); nothing special-cased | same rules | same |

No horizontal scroll at any width: dim shadow never scrolls, card clamped to 16px gutters (docked: exactly 16px insets).

---

## §9 — Accessibility

- Card: `role="dialog"`, **`aria-modal="false"`** (honest non-modal — the dim does not make the page inert), `aria-labelledby` → heading id, `tabIndex={-1}`, focused on open and on every step change.
- SR step announcements: one `sr-only` `aria-live="polite"` region announcing `Step N of 7 — <section label>` on step change (container focus alone does not re-read body copy).
- Hole/dim: `aria-hidden="true"`.
- ESC resolution (verified Radix facts, §0): the tour registers its ESC keydown on `document` in **capture** phase **when the tour opens**. If a drawer is opened AFTER the tour, the drawer's Radix capture listener registers later → tour's listener fires first: dismiss the tour AND call `stopImmediatePropagation()` → drawer unaffected (closes on the NEXT ESC). Tour-only open: ESC dismisses tour. Drawer-only open: Radix closes drawer (unchanged). One ESC never double-dismisses.
- All touch targets ≥44px real px (immune to the ≤640px `html{font-size:14px}` rem shrink — px-based like the header, explore-header.tsx:13-15). Contrast: card tokens are the existing 4.5:1-clearing set; dim at 70% black leaves the card as the only interactive surface — no contrast regressions.
- Static export: overlay absent (client-mount-only); Tour button present with accessible name; counter SSRs as `0/5 sections visited` then syncs after mount (same accepted brief-wrong-value tradeoff as the theme label, use-explore-theme.ts:23-25).
- No `inert`/`aria-hidden` applied to page content outside the card (non-modal semantics; Radix Dialog's modal machinery is deliberately NOT used — it would set `body pointer-events:none` and break the D-01 hole pass-through).

---

## §10 — Visual behaviour: motion, themes, hydration

- **Open:** dim fades in 150ms opacity (the ONLY animation of the overlay); card + cut-out appear with it. Under reduced motion the existing guard (globals.css:581-593) kills the fade automatically — zero new CSS.
- **Step changes / re-measures:** instant reposition, **no transition classes anywhere on hole/card geometry** (immune to mid-scroll lag; the guard would kill them anyway).
- **Both themes:** dim is theme-independent `rgba(0,0,0,0.7)`; card/hole inherit `.explore-shell` vs `.light .explore-shell` tokens automatically (overlay inside shell). Theme swap mid-tour: tokens update live, rects unchanged, no re-measure needed.
- **Hydration:** overlay absent in SSG/static HTML and first paint; everything mounts client-side after the auto-open check. Counter: literal `0` SSR → after-mount sync from `portfolio-explore-visited` (never read localStorage during render — theme-hook precedent).

---

## §11 — Edge coverage (explicit, falsifiable)

| # | Edge | Pinned behavior |
|---|---|---|
| E-1 | Resize/orientation mid-tour | rAF-coalesced immediate re-measure; instant reposition |
| E-2 | Drawer opened mid-tour | Opens normally above the dim (z-50); tour stays open; modal focus trap applies while drawer open; ESC = tour first + `stopImmediatePropagation`, then drawer (§9); closing returns focus to drawer trigger (Radix default); no extra focus juggling |
| E-3 | Drawer anchor click mid-tour | Closes drawer, scrolls (existing path), marks visited via the same drawer wiring (one `onSectionSelect` callback prop — no duplicate path, CONTEXT code_context); the tour does **NOT** follow to that section — the locked sequence is kept; cut-out re-aligns to the current step's panel at scrollend |
| E-4 | Manual scroll mid-step | Cut-out may drift mid-scroll (dim is visual-only); corrected at scrollend (§2) |
| E-5 | Rapid Next/Back during settle | Pending settle cancelled, fresh settle per new step — last click wins |
| E-6 | Target panel element missing | Plain full dim + docked card; no crash |
| E-7 | localStorage unavailable (private mode) | try/catch guards: tour opens every visit, counter is per-session — both features still work (theme-hook precedent) |
| E-8 | Invalid/garbage stored values | Tour key: any non-null value suppresses auto-open; visited key: parsed array filtered to valid ids, deduped |
| E-9 | Theme swap mid-tour | Tokens swap live; geometry untouched |
| E-10 | Tour button clicked while tour open | Resets to step 1 (welcome), flag untouched |
| E-11 | Navigation away mid-tour (internal link in a dimmed panel, e.g. resume row) | Tour unmounts; **no flag write** (dismiss = X/ESC/finish only); auto-open re-offers next visit — honest, state is component-local |
| E-12 | Double ESC / ESC with drawer+tour both open | §9 ordering table — deterministic, single surface per press |
| E-13 | All 5 visited | Counter renders accent + "5/5"; nothing else happens (no toast, no confetti — dropped scope) |

---

## §12 — Verification hooks (mapping contract → checks)

`node --test` in the house pattern (source invariants + `out/`-export invariants), plus `npm run build` / `npm run typecheck` gates. Expected checks:

1. **Constants:** `EXPLORE_TOUR_STORAGE_KEY = "portfolio-explore-tour"` and `EXPLORE_VISITED_STORAGE_KEY = "portfolio-explore-visited"` exported from `src/components/explore/constants.ts`; neither equals nor writes `"portfolio-theme"` / `"portfolioCliFoundEasterEggs"` (grep-level disjointness, D-05/D-06).
2. **Step sequence:** a locked 7-entry array `welcome → about → experience → skills → projects → contact → finish` exported from the tour module; dots count = 7; "Step N of 7" derivation.
3. **Placement function:** pure exported `placeCard(...)` — table-driven unit tests: below-fits / below-overflow→above / above-overflow→dock / no-target dock <640 / center ≥640; width clamp `min(384, panelWidth)`.
4. **Copy constants:** every §4 string exported; a guard test asserts no copy string contains digits/facts beyond the allowed chrome (60-second, step N of 7).
5. **Overlay DOM contract (source-level):** `z-40` on the wrapper; `pointer-events-none` wrapper + `pointer-events-auto` card; `box-shadow: 0 0 0 100vw rgba(0,0,0,0.7)` on the hole; `rounded-md` hole; overlay rendered as a child of the shell root (NOT portaled — no `createPortal` in tour files).
6. **Client-only:** `out/explore.html` contains the Tour button (`aria-label="Start the guided tour"`) but NO tour overlay/card markup and no auto-open logic in static HTML.
7. **Status bar:** source shows `${…}/${EXPLORE_SECTIONS.length} sections visited` with a live variable (no literal `0/`), `text-accent` branch at 5, prop `visitedCount`; `<p aria-live="polite">` unchanged.
8. **Header:** right-cluster order Tour→Theme→Drawer (source order), 44px px classes, `Compass` import, drawer rightmost pin preserved.
9. **ESC contract:** tour registers document keydown capture + `stopImmediatePropagation` (source-level match).
10. **Reduced motion:** `scrollIntoView` behavior branches on `prefers-reduced-motion` matchMedia (source-level); no transition classes on hole/card geometry (grep: no `transition` in tour components).
11. **Storage:** guarded try/catch writes for both keys; visited read filters invalid ids.
12. **Full gate:** `npm run build`, `npm run typecheck`, full node --test suite green on the final tree; /explore still exports statically.

---

## §13 — UNRESOLVED (planner assumes the stated default)

- **U-1 — Hole highlight ring:** default **none** (pure cut-out; the panel's own border/chrome is the highlight). A 1px `outline-foreground/40` ring on the hole is the fallback if the cut-out reads ambiguously on the light theme; pick one, don't add config for both.
- **U-2 — Card re-anchor during manual scroll:** default **scrollend-only** (§2/E-4). Per-frame tracking is explicitly out.
- **U-3 — Auto-open delay:** default **800ms**; any value 500–1500ms is acceptable if the executor finds an interaction reason.

*(Everything else above is pinned. If a pinned row conflicts with a build-time reality, stop and surface it — do not silently redesign the contract.)*