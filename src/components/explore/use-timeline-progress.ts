"use client";

/**
 * useTimelineProgress — the timeline interaction hook (UI-SPEC §14 seam 2,
 * phase 8 REV-12/REV-13; D-02/D-04/D-05; phase-13 REV-23c).
 *
 * Owns everything dynamic about the career-timeline stage and
 * stays THIN over the pure module (timeline-geometry.ts — every per-frame
 * derivation is a pure call; no data shaping here, R-13). The ONE scroll
 * source is the explore main scroll container — '.explore-shell > main',
 * never window (research §1.8.2: window.scrollY is always 0 inside the
 * shell). No wheel/touch listeners anywhere (D-02 — scrolling IS the
 * progress input; the sticky range releases naturally at both ends, no
 * gating code).
 *
 * Scroll channel (UI-SPEC §1.3/§6): ONE passive scroll listener on main, live
 * at EVERY width, that only SCHEDULES a rAF; each frame performs one
 * derivation pass with batched reads first (wrapper/main rects + main
 * padding-top, each read once) then ≤1 write set per element —
 * transform/opacity ONLY (R-5):
 *
 *   rel      = (wrapperRect.top − mainRect.top) − mainPaddingTop
 *   range    = wrapperHeight − stageHeight
 *   progress = computeProgress(rel, range)     — clamped, natural release
 *   c′       = continuousIndex(progress, roleCount)   — UN-branched (REV-23c)
 *   active   = activeIndexFromContinuous(c′, roleCount)
 *
 * REV-23c made that derivation the whole contract at every width: the
 * placement map grants the <md tier its own h-[400vh] range (5 bands × 80vh),
 * so progress is meaningful on a phone and the phase-8 md formula generalizes
 * unchanged. What stays md-ONLY is the IMPERATIVE WRITE channel (the arc-zone
 * geometry measure, the marker transforms and the per-layer
 * opacity/translateY/visibility writes): the <md rail is a React-class
 * composition and the <md body is a class-owned one-at-a-time overlay, so a
 * per-frame write there would fight the class swaps — and there is no measured
 * arc zone below md to write against. The ACTIVE-INDEX write is ungated: it is
 * what moves the rail's accented marker and swaps the single visible entry.
 * React state updates ONLY on activeIndex change and on geometry (resize)
 * change — never per frame (§6/E-8).
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
 * root (the role="group" div) — ArrowUp/ArrowDown step entries; Prev/Next
 * buttons share the same goToRole path. Stepping sets the target entry's
 * POSITION via main.scrollTo(scrollTargetForRole(...)) with the tour's
 * reduced-motion behavior branch at the call site (RM-3) — scrolling IS the
 * progress input, so keyboard never bypasses the single source of truth
 * (D-02), at md+ (the 300vh wrapper) AND below md (the 400vh wrapper): the
 * range is measured fresh from the same wrapper at invocation, so the one
 * formula serves both tiers with each tier's own geometry. Arrows outside the
 * stage fall through to native main scrolling; preventDefault ONLY on
 * handled keys.
 *
 * Reduced motion (E-13): the mode is read FRESH per derivation pass and
 * per invocation via the ONE reduced-motion matchMedia read below — no
 * listener, no stale flag. The discrete channel re-reads
 * it post-mount inside the activeIndex-change effect (hydration-safe,
 * never during render) to gate the dot size-class swap (W-7). The sticky
 * range itself is RETAINED (RM-5 — scroll position is user input); the <md
 * entry swap degrades to an instant opacity swap because the shell's global
 * RM guard kills the layer transition.
 *
 * md gate (REV-23 / REV-23c / §8 B-1): matchMedia('(min-width: 768px)') WITH a
 * change listener (added/removed on cleanup). It owns the IMPERATIVE WRITE
 * CHANNEL and the step handover:
 *  • the derivation (progress → c′ → active) runs at EVERY width;
 *  • the arc-zone measure, the marker transforms and the per-layer
 *    opacity/translateY/visibility writes are md-only — below md the rail and
 *    the one-at-a-time layer classes are the whole presentation;
 *  • the per-pass `setActiveIndex` write is NOT gated (a phone pass must move
 *    the rail);
 *  • entering the compact form clears the inline layer styles ONCE (handing
 *    opacity/visibility to the layer classes) and re-derives; re-entering md+
 *    hands per-layer visibility back to the hook.
 *
 * Cleanup (E-7): scroll listener, md change listener, ResizeObserver,
 * pending rAF frame and the marker fade one-shot are ALL removed/cancelled
 * on unmount.
 *
 * DOM discovery (mount-only): the stage is the sticky section
 * id="experience" (R-3), the extended wrapper is its plain parent div, and
 * markers/layers/arc zone carry the data-timeline-* hooks the stage
 * renders — queried once, order-aligned with the entry array.
 */
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  activeIndexFromContinuous,
  computeProgress,
  contentLayer,
  continuousIndex,
  LABEL_RADIUS_RATIO,
  labelAnchorBudget,
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

export interface TimelineProgress {
  /** Discrete active role index — re-renders ONLY on change (§6). */
  activeIndex: number;
  /** md+ ownership: SSR-true (the §9 export contract), corrected on mount. */
  stageActive: boolean;
  /** Post-mount discrete read gating the dot size-class swap (W-7). */
  reducedMotion: boolean;
  /** Measured arc-zone width for the W-4 date-line predicate (null pre-measurement). */
  arcZoneWidth: number | null;
  /**
   * REV-23: the measured px budget the date line may occupy — the focal
   * label anchor `centerX − 0.88·R` (pure `labelAnchorBudget`), i.e. one
   * derivation beside the predicate it feeds. Null pre-measurement; the
   * call site falls back to the §1.4 md-width estimate.
   */
  anchorBudget: number | null;
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
  const [anchorBudget, setAnchorBudget] = useState<number | null>(null);

  const geometryRef = useRef<ArcGeometry | null>(null);
  const activeIndexRef = useRef(0);
  const frameRef = useRef(0);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // §8 B-1 path (b) / REV-23c: clear the SSR inline styles once so the layer
    // CLASSES take over below md (the active entry at opacity-100 + visible,
    // the other four at opacity-0 + invisible — the one-at-a-time contract);
    // React never re-applies them (the style prop is the constant §9
    // derivation at progress 0).
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
      const geometry = viewBoxToPx({ width: rect.width, height: rect.height });
      setArcZoneWidth(rect.width); // W-4 re-evaluation on geometry change (§6)
      // REV-23: the label predicate's budget, derived at the measurement site
      // where the geometry is already in hand — on EVERY measurement, so a
      // URL-bar collapse never leaves a stale budget behind.
      setAnchorBudget(labelAnchorBudget(geometry));
      return geometry;
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
      // REV-23c: the carousel index is UN-branched. The <md scroll range the
      // placement map now grants the phone makes `progress` meaningful at every
      // width, so the phase-8 md derivation (progress → c′ = (n−1)·progress →
      // active = round(c′) clamped) IS the whole contract — the retired
      // steppedIndexRef existed only because a range-less <md wrapper pinned
      // progress at 0/1 and parked the wrong entry at the focal point.
      const c = continuousIndex(progress, roleCount);
      const active = activeIndexFromContinuous(c, roleCount);
      // REV-23c: the IMPERATIVE channel (marker transforms + layer styles) is
      // md-only. Below md the rail is a React-class composition and the body is
      // a class-owned one-at-a-time overlay, so a per-frame write would fight
      // the class swaps (and would need a measured arc zone that does not exist
      // there). The index derivation above stays width-agnostic.
      if (mdMedia.matches) {
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
        // ALL writes AFTER all reads.
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
        for (let i = 0; i < roleCount && i < layers.length; i += 1) {
          const layer = contentLayer(i, c, rm); // RM-2: translateY ≡ 0 under reduce
          const el = layers[i];
          el.style.opacity = String(layer.opacity);
          el.style.transform = `translateY(${layer.translateY}px)`;
          el.style.visibility = layer.visible ? 'visible' : 'hidden';
        }
      }
      // REV-23c: the active index is written at EVERY width. Below md this is
      // what moves the rail's accented marker and swaps the single visible
      // entry as the range scrolls; the retiree is the md-only gate of the
      // RESOLVED-D1 discrete-step contract, superseded on mobile by the user's
      // one-at-a-time decision.
      if (active !== activeIndexRef.current) {
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

    // REV-23c: the scroll channel is live at EVERY width. Below md the
    // placement map's h-[400vh] wrapper gives the phone a real range, so the
    // scroll position is its progress input too — the retired dormant
    // `if (mdMedia.matches) schedule()` pinned the phone at entry 0.
    const onScroll = () => {
      schedule();
    };

    const onMdChange = () => {
      if (mdMedia.matches) {
        setStageActive(true); // the hook re-owns per-layer visibility (B-1 path c)
        geometryDirty = true;
        schedule();
      } else {
        setStageActive(false); // the <md body is class-owned (REV-23c)
        clearLayerStyles();
        // REV-23c: re-derive so the un-branched index lands on the current
        // scroll position instead of dumping every marker untransformed at the
        // arc origin (the retired clear loop's pile-up on a md→<md transition).
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
      // REV-23c: the <md handover. The SSR layer styles are the §9 derivation
      // evaluated at progress 0 (entry 1 visible, 2-5 hidden); clearing them
      // hands opacity/visibility to the layer classes, which render exactly the
      // active entry from the SAME activeIndex the derivation computes. The
      // schedule() below is the first <md pass (mount is one of its triggers,
      // beside the scroll channel and the ResizeObserver).
      setStageActive(false);
      clearLayerStyles();
      geometryDirty = true;
      schedule();
    }

    return () => {
      main.removeEventListener('scroll', onScroll);
      mdMedia.removeEventListener('change', onMdChange);
      observer.disconnect();
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
    // REV-23c: ONE target formula at every width. The <md scroll range the
    // placement map now grants the phone makes scrollTargetForRole arithmetic
    // valid there too — the range is measured fresh from the SAME wrapper, so
    // the base tier uses its own geometry and no width branch is needed. The
    // retired <md branch wrote the stepped index and called scrollIntoView
    // because a range-less wrapper had nothing to move in.
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

  return {
    activeIndex,
    stageActive,
    reducedMotion,
    arcZoneWidth,
    anchorBudget,
    stepRole,
    handleKeyDown,
  };
}