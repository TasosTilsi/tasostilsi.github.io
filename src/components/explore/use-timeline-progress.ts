"use client";

/**
 * useTimelineProgress — the timeline interaction hook (UI-SPEC §14 seam 2,
 * phase 8 REV-12/REV-13; D-02/D-04/D-05).
 *
 * Owns everything dynamic about the semicircular career-timeline stage and
 * stays THIN over the pure module (timeline-geometry.ts — every per-frame
 * derivation is a pure call; no data shaping here, R-13). The ONE scroll
 * source is the explore main scroll container — '.explore-shell > main',
 * never window (research §1.8.2: window.scrollY is always 0 inside the
 * shell). No wheel/touch listeners anywhere (D-02 — scrolling IS the
 * progress input; the sticky range releases naturally at both ends, no
 * gating code).
 *
 * Scroll channel (UI-SPEC §1.3/§6): ONE passive scroll listener on main
 * that only SCHEDULES a rAF; each frame performs one derivation pass with
 * batched reads first (wrapper/main rects + main padding-top, each read
 * once) then ≤1 write set per element — transform/opacity ONLY (R-5):
 *
 *   rel      = (wrapperRect.top − mainRect.top) − mainPaddingTop
 *   range    = wrapperHeight − stageHeight
 *   progress = computeProgress(rel, range)     — clamped, natural release
 *   c′       = md+ ? continuousIndex(progress, roleCount)
 *                  : steppedIndexRef.current  (<md: the discrete step, REV-23)
 *   active   = activeIndexFromContinuous(c′, roleCount)
 *
 * Marker writes: θ = markerAngle(i, c′, n) (or reducedMotionAngle under
 * reduced motion), px positions from viewBoxToPx(measured arc zone) via
 * markerPoint (dot on the arc, label at the 0.88 inset), emphasis
 * opacity/scale from markerEmphasis (reducedMotionEmphasis swaps
 * opacity-only, no scale component written — W-7/RM-1). Label alignment
 * follows B-2: right-align toward the arc interior (translateX(-100%))
 * when the anchor's θ lies strictly inside (90°, 270°). Layer writes:
 * contentLayer(i, c′, rm) → opacity/translateY/visibility. React state
 * updates ONLY on activeIndex change and on geometry (resize) change —
 * never per frame (§6/E-8).
 *
 * Geometry (E-6): a ResizeObserver on the stage recomputes the arc-zone
 * geometry (s/offsets/center/radius) rAF-coalesced; scroll frames reuse
 * the cached geometry.
 *
 * Marker first paint (§9): markers render at inline opacity 0
 * pre-measurement; the first measured pass arms a ONE-SHOT inline opacity
 * transition (150ms) and clears it right after the fade window so rAF
 * writes are never transition-lagged. (Recorded deviation from the plan's
 * "removes the transition class imperatively": a class would be
 * React-restored on the next activeIndex-driven className render and
 * re-lag the writes — the inline transition is not, and the existing
 * reduced-motion guard kills it outright (transition:none !important
 * beats inline styles), so RM-4 stays the single suppressor, R-6.)
 *
 * Keyboard + controls (§5/§4): ONE keydown handler for the stage body
 * root (the role="group" div) — ArrowUp/ArrowDown step roles; Prev/Next
 * buttons share the same goToRole path. At md+ stepping sets progress to the
 * target role's POSITION via main.scrollTo(scrollTargetForRole(...)) with
 * the tour's reduced-motion behavior branch at the call site (RM-3) —
 * scrolling IS the progress input, so keyboard never bypasses the single
 * source of truth (D-02). rel is measured fresh at invocation. Below md
 * (REV-23) there is no scroll range to move in, so the step writes the
 * stepped index (the <md derivation input), re-runs the imperative
 * derivation through the schedule bridge and brings the entry into view
 * with block:'nearest'. Arrows outside the stage fall through to native
 * main scrolling; preventDefault ONLY on handled keys.
 *
 * Reduced motion (E-13): the mode is read FRESH per derivation pass and
 * per invocation via the ONE reduced-motion matchMedia read below — no
 * listener, no stale flag. The discrete channel re-reads
 * it post-mount inside the activeIndex-change effect (hydration-safe,
 * never during render) to gate the dot size-class swap (W-7). The sticky
 * range itself is RETAINED (RM-5 — scroll position is user input).
 *
 * md gate (REV-23 / §8 B-1): matchMedia('(min-width: 768px)') WITH a change
 * listener (added/removed on cleanup). Since phase 13 the query no longer
 * gates the ARC — it owns LAYER OWNERSHIP and the step-mode handoff:
 *  • the derivation runs at EVERY width (marker positions/emphasis are
 *    written on phones too, so the semicircle is live below md);
 *  • only the per-layer opacity/translateY/visibility writes are md-only
 *    (below md all five entries stay readable — an ungated pass at
 *    progress 0 would hide entries 2-5);
 *  • only the per-pass `setActiveIndex` write is md-only (below md the
 *    DISCRETE step owns the active index and a ResizeObserver pass must
 *    never stomp it);
 *  • entering the compact form clears the inline layer styles ONCE (the SSR
 *    hidden styles never survive to a mobile user) and RE-DERIVES with
 *    c′ = the stepped index; re-entering md+ hands per-layer visibility
 *    back to the hook.
 *
 * Cleanup (E-7): scroll listener, md change listener, ResizeObserver,
 * pending rAF frame and the marker fade one-shot are ALL removed/cancelled
 * on unmount.
 *
 * DOM discovery (mount-only): the stage is the sticky section
 * id="experience" (R-3), the extended wrapper is its plain parent div, and
 * markers/layers/arc zone carry the data-timeline-* hooks the stage
 * renders — queried once, order-aligned with the role array.
 */
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  activeIndexFromContinuous,
  computeProgress,
  contentLayer,
  continuousIndex,
  markerAngle,
  markerEmphasis,
  markerPoint,
  reducedMotionAngle,
  reducedMotionEmphasis,
  scrollTargetForRole,
  viewBoxToPx,
  type ArcGeometry,
} from './timeline-geometry';

/** The ONLY scroll source — the explore main scroll container (never window). */
const MAIN_SELECTOR = '.explore-shell > main';
/** The sticky stage's stable section id (R-3). */
const STAGE_ID = 'experience';
/** E-13: the ONE reduced-motion read — invoked fresh per pass/invocation. */
const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** §9 marker first-paint fade (instant under the guard, RM-4). */
const MARKER_FADE_MS = 150;
/** §2.2 label anchor inset: 12 viewBox units inward of the 100-unit arc. */
const LABEL_RADIUS_RATIO = 0.88;

export interface TimelineProgress {
  /** Discrete active role index — re-renders ONLY on change (§6). */
  activeIndex: number;
  /** md+ ownership: SSR-true (the §9 export contract), corrected on mount. */
  stageActive: boolean;
  /** Post-mount discrete read gating the dot size-class swap (W-7). */
  reducedMotion: boolean;
  /** Measured arc-zone width for the W-4 date-line predicate (null pre-measurement). */
  arcZoneWidth: number | null;
  /** §4: step to a clamped role via main.scrollTo (the buttons' path). */
  stepRole: (delta: number) => void;
  /** §5: the stage body root's keydown handler (ArrowUp/ArrowDown only). */
  handleKeyDown: (event: ReactKeyboardEvent<HTMLDivElement>) => void;
}

export function useTimelineProgress(roleCount: number): TimelineProgress {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageActive, setStageActive] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [arcZoneWidth, setArcZoneWidth] = useState<number | null>(null);

  const geometryRef = useRef<ArcGeometry | null>(null);
  const activeIndexRef = useRef(0);
  const frameRef = useRef(0);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /**
   * REV-23: the <md carousel-index source. Below md there is no scroll range,
   * so the discrete step (Prev/Next/arrows) IS the derivation input — a ref,
   * never render state, so the rAF pass never reads a stale closure.
   */
  const steppedIndexRef = useRef(0);
  /**
   * REV-23: the bridge to the mount effect's `schedule`. Marker transforms
   * are written imperatively by the rAF pass and this effect's deps are
   * [roleCount], so a `setActiveIndex` re-render swaps classes but writes no
   * transform — goToRole's <md branch needs the imperative re-derivation.
   */
  const scheduleRef = useRef<(() => void) | null>(null);

  // The mount effect owns the whole scroll/rAF/observer machinery; roleCount
  // is stable for the life of the stage (the data file is static), so the
  // closure never goes stale.
  useEffect(() => {
    const stage = document.getElementById(STAGE_ID);
    const wrapper = stage?.parentElement ?? null;
    const main = document.querySelector<HTMLElement>(MAIN_SELECTOR);
    const arcZone = stage?.querySelector<HTMLElement>('[data-timeline-arc-zone]') ?? null;
    const dots = stage
      ? Array.from(stage.querySelectorAll<HTMLElement>('[data-timeline-dot]'))
      : [];
    const labels = stage
      ? Array.from(stage.querySelectorAll<HTMLElement>('[data-timeline-label]'))
      : [];
    const layers = stage
      ? Array.from(stage.querySelectorAll<HTMLElement>('[data-timeline-layer]'))
      : [];
    if (!stage || !wrapper || !main || !arcZone || dots.length === 0 || layers.length === 0) {
      return; // non-shell context — nothing to drive (E-6 spirit)
    }

    const mdMedia = window.matchMedia('(min-width: 768px)');
    let geometryDirty = true;
    let fadeArmed = false;

    // §8 B-1 path (b): clear the SSR inline styles once so the compact form
    // shows all layers readable; React never re-applies them (the style
    // prop is the constant §9 derivation at progress 0).
    const clearLayerStyles = () => {
      for (const layer of layers) {
        layer.style.opacity = '';
        layer.style.transform = '';
        layer.style.visibility = '';
      }
    };

    const measureGeometry = (): ArcGeometry | null => {
      const rect = arcZone.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      setArcZoneWidth(rect.width); // W-4 re-evaluation on geometry change (§6)
      return viewBoxToPx({ width: rect.width, height: rect.height });
    };

    const revealMarkers = () => {
      // §9 one-shot fade: arm an inline opacity transition, then clear it
      // after the window so rAF writes are never transition-lagged. The
      // reduced-motion guard suppresses the inline transition entirely
      // (RM-4) — instant reveal under reduce.
      if (fadeArmed) return;
      fadeArmed = true;
      const transition = `opacity ${MARKER_FADE_MS}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      for (const el of [...dots, ...labels]) {
        el.style.transition = transition;
      }
      if (fadeTimerRef.current !== null) clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = setTimeout(() => {
        for (const el of [...dots, ...labels]) {
          el.style.transition = '';
        }
      }, MARKER_FADE_MS);
    };

    const derive = () => {
      const rm = prefersReducedMotion(); // E-13: fresh per pass
      // Batched reads FIRST — never interleaved with writes (§6/E-8).
      const wrapperRect = wrapper.getBoundingClientRect();
      const mainRect = main.getBoundingClientRect();
      const mainPaddingTop = parseFloat(getComputedStyle(main).paddingTop) || 0;
      const rel = wrapperRect.top - mainRect.top - mainPaddingTop;
      const range = wrapper.offsetHeight - stage.offsetHeight;
      const progress = computeProgress(rel, range); // clamped — natural release
      // REV-23: the carousel index is BRANCHED. Below md there is no scroll
      // range (computeProgress returns 0 for range ≤ 0) and where the <md
      // wrapper/stage natural heights differ at all the mount pass clamps
      // progress to 1 — both incidental values with no meaning on a phone,
      // and either one parks the WRONG entry at the focal point. The stepped
      // index is the intended <md input; continuousIndex/markerAngle stay the
      // ONE derivation at both widths (UI-SPEC §3.1e).
      const c = mdMedia.matches ? continuousIndex(progress, roleCount) : steppedIndexRef.current;
      const active = activeIndexFromContinuous(c, roleCount);
      let geometry = geometryRef.current;
      if (geometryDirty || !geometry) {
        geometry = measureGeometry();
        if (!geometry) return; // zero-size zone (e.g. hidden) — nothing to write
        geometryRef.current = geometry;
        geometryDirty = false;
        revealMarkers();
      }
      const labelGeometry: ArcGeometry = {
        ...geometry,
        radius: geometry.radius * LABEL_RADIUS_RATIO,
      };
      // ALL writes AFTER all reads. REV-23: the marker writes are NOT
      // md-gated — the arc positions its markers at every width (§3.1c).
      for (let i = 0; i < roleCount && i < dots.length; i += 1) {
        const theta = rm ? reducedMotionAngle(i, roleCount) : markerAngle(i, c, roleCount);
        const emphasis = rm
          ? reducedMotionEmphasis(i, c, roleCount)
          : markerEmphasis(i, c, roleCount);
        const point = markerPoint(geometry, theta);
        const dot = dots[i];
        if (dot) {
          // RM-1/W-7: under reduce no scale component is written at all.
          const scaleWrite = rm ? '' : ` scale(${emphasis.scale})`;
          dot.style.transform = `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)${scaleWrite}`;
          dot.style.opacity = String(emphasis.opacity);
        }
        const label = labels[i];
        if (label) {
          const labelPoint = markerPoint(labelGeometry, theta);
          // B-2: right-align toward the arc interior when the anchor sits
          // left of the diameter (θ strictly inside (90°, 270°)).
          const towardDiameter = theta > 90 && theta < 270;
          label.style.transform = `translate(${labelPoint.x}px, ${labelPoint.y}px) translate(0, -50%)${towardDiameter ? ' translateX(-100%)' : ''}`;
          label.style.opacity = String(emphasis.opacity);
        }
      }
      // REV-23: layer ownership is md-only. With the <md dormancy return
      // retired, an ungated pass at <md runs with progress pinned at 0 where
      // contentLayer(i, 0).visible is |i| < 1 — it would write
      // visibility:hidden onto entries 2-5 and four of the five CV entries
      // would vanish on every phone.
      if (mdMedia.matches) {
        for (let i = 0; i < roleCount && i < layers.length; i += 1) {
          const layer = contentLayer(i, c, rm); // RM-2: translateY ≡ 0 under reduce
          const el = layers[i];
          el.style.opacity = String(layer.opacity);
          el.style.transform = `translateY(${layer.translateY}px)`;
          el.style.visibility = layer.visible ? 'visible' : 'hidden';
        }
      }
      // REV-23: same gate — below md the discrete step owns the active index,
      // so a ResizeObserver pass (the URL-bar collapse right after a tap) must
      // never stomp it back to entry 0.
      if (mdMedia.matches && active !== activeIndexRef.current) {
        activeIndexRef.current = active;
        setActiveIndex(active); // the ONLY per-pass state write, on change (§6)
      }
    };

    const schedule = () => {
      if (frameRef.current !== 0) return; // ≤1 derivation pass per frame (E-8)
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = 0;
        derive();
      });
    };
    scheduleRef.current = schedule; // REV-23: the <md step's re-derivation bridge

    const onScroll = () => {
      if (mdMedia.matches) schedule(); // dormant below md — no rAF loop (B-1)
    };

    const onMdChange = () => {
      if (mdMedia.matches) {
        setStageActive(true); // the hook re-owns per-layer visibility (B-1 path c)
        geometryDirty = true;
        schedule();
      } else {
        setStageActive(false); // all layers readable in the compact form
        clearLayerStyles();
        // REV-23: re-derive with c′ = the stepped index instead of dumping
        // every marker untransformed at the arc origin (the retired clear
        // loop's pile-up on any md→<md transition).
        geometryDirty = true;
        schedule();
      }
    };

    const observer = new ResizeObserver(() => {
      geometryDirty = true; // E-6: recompute zone geometry, rAF-coalesced
      schedule();
    });

    main.addEventListener('scroll', onScroll, { passive: true });
    mdMedia.addEventListener('change', onMdChange);
    observer.observe(stage);
    if (mdMedia.matches) {
      derive(); // E-9: first pass reads the ACTUAL scroll position — instant landing
    } else {
      setStageActive(false); // corrected on mount (B-1: below md all layers readable)
      clearLayerStyles();
      // REV-23/§3.1c: the THREE <md derive triggers are mount + ResizeObserver
      // + the discrete step. Without this line the <md first paint would rest
      // entirely on the observer's initial delivery — an implicit dependency.
      geometryDirty = true;
      schedule();
    }

    return () => {
      main.removeEventListener('scroll', onScroll);
      mdMedia.removeEventListener('change', onMdChange);
      observer.disconnect();
      scheduleRef.current = null; // REV-23: drop the <md bridge with the effect
      if (frameRef.current !== 0) cancelAnimationFrame(frameRef.current);
      if (fadeTimerRef.current !== null) clearTimeout(fadeTimerRef.current);
    };
  }, [roleCount]);

  // Post-mount discrete read for the dot size-class gate (W-7): hydration-
  // safe (never during render), re-read at every DISCRETE change; the rAF
  // channels adopt the mode per pass instead (E-13).
  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, [activeIndex]);

  const goToRole = (index: number) => {
    const target = Math.min(Math.max(index, 0), roleCount - 1);
    const stage = document.getElementById(STAGE_ID);
    const wrapper = stage?.parentElement ?? null;
    const main = document.querySelector<HTMLElement>(MAIN_SELECTOR);
    if (!stage || !wrapper || !main) return;
    if (!window.matchMedia('(min-width: 768px)').matches) {
      // REV-23 <md branch: below md there is no scroll range to move in, so
      // the discrete step IS the derivation input. Write the stepped index,
      // mirror it onto activeIndexRef (so the next stepRole(±1) composes from
      // the step, not a stale 0), re-render the discrete classes, bring the
      // entry into view — block:'nearest' only, so the page is not yanked —
      // and re-run the imperative derivation through the bridge (marker
      // transforms are written by the rAF pass; setActiveIndex alone writes
      // none, so without this the focal marker never moves).
      steppedIndexRef.current = target;
      activeIndexRef.current = target;
      setActiveIndex(target);
      stage.querySelectorAll<HTMLElement>('[data-timeline-layer]')[target]?.scrollIntoView({
        block: 'nearest',
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
      scheduleRef.current?.();
      return;
    }
    const wrapperRect = wrapper.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    const mainPaddingTop = parseFloat(getComputedStyle(main).paddingTop) || 0;
    const rel = wrapperRect.top - mainRect.top - mainPaddingTop; // fresh at invocation (§5)
    const range = wrapper.offsetHeight - stage.offsetHeight;
    const top = scrollTargetForRole(main.scrollTop, rel, target, roleCount, range);
    // RM-3: the tour's behavior branch verbatim (explore-tour.tsx:157-159) —
    // an explicit 'smooth' would bypass the CSS scroll-behavior override.
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
    main.scrollTo({ top, behavior }); // scrolling IS the progress input (D-02)
  };

  const stepRole = (delta: number) => {
    goToRole(activeIndexRef.current + delta);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault(); // ONLY on handled keys (§5)
    stepRole(event.key === 'ArrowDown' ? 1 : -1); // REV-23: steps at every width
  };

  return { activeIndex, stageActive, reducedMotion, arcZoneWidth, stepRole, handleKeyDown };
}