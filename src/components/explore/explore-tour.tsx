"use client";

/**
 * ExploreTour — the spotlight wizard tour on /explore (phase EXPLORE-04).
 *
 * A hand-rolled, NON-modal overlay (UI-SPEC §0/§1): Radix Dialog's modal
 * machinery would set pointer-events none + aria-hidden on the whole page and
 * break the D-01 hole pass-through, and its non-modal mode still dismisses on
 * outside pointer-down, which §1 forbids. So: one fixed full-viewport wrapper
 * (z-40) rendered inside the shell root as its LAST child (W-4 paint order —
 * the card must paint above the dim), never portaled — the overlay inherits
 * the shell tokens + the reduced-motion guard for free.
 *
 * Pointer-events model (§1): the wrapper + dim are pointer-events-none; the
 * step card is the ONLY pointer-events-auto descendant — the page stays fully
 * interactive during the tour (the dim is visual-only) and outside clicks
 * never dismiss (dismissal = X / ESC / finish / link-out only).
 *
 * §10 motion budget: the ONLY overlay animation is the pinned 150ms opacity
 * fade of the dim, declared as the tour-dim-in CSS keyframes inside an inline
 * <style> in this client-only wrapper (it never SSRs — R-5 hydration: the
 * overlay renders null until open). The phase-1 reduced-motion guard
 * (globals.css:581-593 — animation: none !important on .explore-shell *)
 * suppresses the fade under prefers-reduced-motion automatically: zero new
 * CSS files. Card + cut-out appear with the fading dim; their geometry
 * repositions are instant.
 *
 * Storage access is confined to the plan-01 data tier: readTourFlag /
 * writeTourFlag from use-explore-visited.ts (D-05) — this file never
 * touches storage directly.
 *
 * R-6: the overlay relies on fixed positioning against the viewport — NEVER
 * add transform / animate-* classes to .explore-shell or any ancestor between
 * it and the viewport, or every overlay coordinate silently breaks.
 */

import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { X } from 'lucide-react';
import {
  EXPLORE_TOUR_ACCENTS,
  EXPLORE_TOUR_FINISH,
  EXPLORE_TOUR_STEPS,
  ExploreSectionId,
} from './constants';
import { placeCard, type TourRect } from './tour-placement';
import { readTourFlag, writeTourFlag } from './use-explore-visited';

/** §4 primary-action label ladder, indexed by stepIndex (0-5). */
const PRIMARY_LABELS = ['Start', 'Next', 'Next', 'Next', 'Finish', 'Done'] as const;

/** §0 header ghost recipe — shared by the card's X/Back/Next controls. */
const GHOST_INTERACTION =
  'rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function ExploreTour({
  open,
  reopenEpoch,
  onOpenChange,
  onMarkVisited,
}: {
  open: boolean;
  reopenEpoch: number;
  onOpenChange: (open: boolean) => void;
  onMarkVisited: (id: ExploreSectionId) => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [panelRect, setPanelRect] = useState<TourRect | null>(null);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const [viewport, setViewport] = useState(() =>
    typeof window === 'undefined'
      ? { width: 0, height: 0 }
      : { width: window.innerWidth, height: window.innerHeight },
  );
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Stable handle for mount-only effects (auto-open lands in Task 3) —
  // the shell's setTourOpen is stable, but the ref keeps exhaustive-deps honest.
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  const step = EXPLORE_TOUR_STEPS[Math.min(stepIndex, EXPLORE_TOUR_STEPS.length - 1)];
  const isFinish = step.id === 'finish';
  const headingId = 'explore-tour-heading';

  // §3 activation order per step: content steps mark visited FIRST (at
  // activation, not after settle) then settle → measure → render; no-target
  // steps clear the panel rect so the plain dim + centered/docked card
  // render (D-02). The programmatic scroll-into-view call lives ONLY here —
  // the §2/W-3 re-measure below is measure-only, never a re-scroll.
  useEffect(() => {
    if (!open) return;
    const current = EXPLORE_TOUR_STEPS[Math.min(stepIndex, EXPLORE_TOUR_STEPS.length - 1)];
    if (!current) return;
    if (current.sectionId === null) {
      setPanelRect(null); // welcome/finish (or E-6 path): plain dim, no hole
      return;
    }
    onMarkVisited(current.sectionId);

    const main = document.querySelector<HTMLElement>('.explore-shell > main');
    const target = document.getElementById(current.sectionId);
    if (!main || !target) {
      setPanelRect(null); // E-6: missing target → plain dim + docked card
      return;
    }

    let cancelled = false;
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let frame = 0;

    const measure = () => {
      if (cancelled) return;
      const rect = target.getBoundingClientRect();
      setPanelRect({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
    };

    // W-1: idempotent settle guard — scrollend and the timeout race, the
    // first one wins; §2's double rAF lands before the measurement.
    const settle = () => {
      if (settled) return;
      settled = true;
      if (timer !== null) clearTimeout(timer);
      main.removeEventListener('scrollend', settle);
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(measure);
      });
    };

    // W-2 already-in-view fast path: scrollend never fires when the scroll
    // position does not change — zero-scroll steps must not pay the 700ms
    // timeout, so skip the race and measure after a double rAF.
    const targetRect = target.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    const inView =
      targetRect.top >= mainRect.top &&
      targetRect.left >= mainRect.left &&
      targetRect.bottom <= mainRect.bottom &&
      targetRect.right <= mainRect.right;
    if (inView) {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(measure);
      });
    } else {
      // §10: an explicit 'smooth' bypasses the CSS scroll-behavior override,
      // so branch the behavior at call time (RESEARCH §1.4).
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth';
      target.scrollIntoView({ block: 'start', behavior });
      main.addEventListener('scrollend', settle, { once: true });
      timer = setTimeout(settle, 700); // fallback: older engines lack scrollend
    }

    return () => {
      cancelled = true; // E-5: rapid Next/Back — last click wins
      if (timer !== null) clearTimeout(timer);
      cancelAnimationFrame(frame);
      main.removeEventListener('scrollend', settle);
    };
  }, [open, stepIndex, onMarkVisited]);

  // D-05/E-10 reset: every open (from closed, or the Tour button clicked
  // while open — the shell bumps reopenEpoch on every Tour click; auto-open
  // does not) lands on step 1 (welcome). Flag untouched on reset (E-10).
  useEffect(() => {
    if (open) setStepIndex(0);
  }, [open, reopenEpoch]);

  // §7/D-05 auto-open: exactly once per page load, 800ms after mount, ONLY
  // when no tour flag exists (ANY non-null value suppresses, E-8 — read via
  // the data-tier accessor). Any pointerdown/keydown before it fires cancels
  // the timer (the visitor is already driving). Opens at step 1 through the
  // reset effect above; auto-open does NOT bump reopenEpoch (E-10 semantics).
  useEffect(() => {
    if (readTourFlag() !== null) return;
    let cancelled = false;
    const cancel = () => {
      cancelled = true;
    };
    const timer = setTimeout(() => {
      if (cancelled) return;
      document.removeEventListener('pointerdown', cancel, { capture: true });
      document.removeEventListener('keydown', cancel, { capture: true });
      onOpenChangeRef.current(true);
    }, 800);
    document.addEventListener('pointerdown', cancel, { once: true, capture: true });
    document.addEventListener('keydown', cancel, { once: true, capture: true });
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener('pointerdown', cancel, { capture: true });
      document.removeEventListener('keydown', cancel, { capture: true });
    };
  }, []);

  // D-04: the 'completed' flag is bound to finish ACTIVATION (render of the
  // finish card, §7), not to dismissal — a later Done/ESC 'seen' write
  // no-ops against it inside writeTourFlag (never downgrades, D-05).
  useEffect(() => {
    if (!open) return;
    if (step.id === 'finish') writeTourFlag('completed');
  }, [open, step]);

  // Dismissal (X / ESC / Done): mark 'seen' (guard no-ops post-completion,
  // D-04/D-05) + close + return focus to the header Tour button — it exists
  // in every case, including auto-open (§7). No flag write on
  // navigation-away (E-11): only these explicit handlers write.
  const dismiss = useCallback(() => {
    writeTourFlag('seen');
    onOpenChangeRef.current(false);
    document.getElementById('explore-tour-trigger')?.focus();
  }, []);

  const goBack = useCallback(() => {
    setStepIndex((index) => Math.max(0, index - 1));
  }, []);

  const goNext = useCallback(() => {
    setStepIndex((index) => Math.min(EXPLORE_TOUR_STEPS.length - 1, index + 1));
  }, []);

  // §9/E-12: the tour registers its ESC keydown on document in capture phase
  // while open. A drawer opened AFTER the tour registers later, so this
  // listener fires first: dismiss the tour AND swallow the press — one ESC
  // never double-dismisses tour + drawer (R-7; the drawer closes on the NEXT
  // ESC). Drawer-only open: Radix closes the drawer, unchanged.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopImmediatePropagation();
      dismiss();
    };
    document.addEventListener('keydown', onKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [open, dismiss]);

  // §6/W-6: card-ELEMENT-scoped keydowns — Tab cycles the card's focusables
  // only (inherently suspended while the drawer is open mid-tour: this
  // handler simply does not fire then, and E-2's Radix return-to-trigger
  // governs — no post-drawer-close refocus, surfaced per UI-SPEC §13);
  // ArrowLeft/ArrowRight = Back/Next, disabled-aware via clamping.
  const onCardKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goBack();
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
      return;
    }
    if (event.key !== 'Tab') return;
    const card = cardRef.current;
    if (!card) return;
    const focusables = Array.from(
      card.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'),
    );
    if (focusables.length === 0) return;
    const active = document.activeElement;
    const inside = active instanceof HTMLElement && card.contains(active);
    if (event.shiftKey) {
      if (!inside || active === focusables[0]) {
        event.preventDefault();
        focusables[focusables.length - 1].focus();
      }
    } else if (!inside || active === focusables[focusables.length - 1]) {
      event.preventDefault();
      focusables[0].focus();
    }
  };

  // §9/OQ-9: focus lands on the card (never lost behind the overlay) on open
  // and on every step change; preventScroll keeps focus from scrolling.
  useEffect(() => {
    if (!open) return;
    cardRef.current?.focus({ preventScroll: true });
  }, [open, stepIndex]);

  // §2 two-pass converge: measure the rendered card and feed placeCard — the
  // layout effect runs before paint, so the first painted frame already
  // carries the real geometry (no visible jump on open / step change).
  useLayoutEffect(() => {
    if (!open) return;
    const el = cardRef.current;
    if (!el) return;
    setCardSize((prev) =>
      prev.width === el.offsetWidth && prev.height === el.offsetHeight
        ? prev
        : { width: el.offsetWidth, height: el.offsetHeight },
    );
  }, [open, stepIndex]);

  // §2 re-measure (b) + (c): window resize / orientationchange (rAF-coalesced)
  // and <main> scrollends re-measure — ALL INSTANT, never animated. This
  // handler is measure-only (W-3): user scrollends re-position the cut-out +
  // card but NEVER re-scroll to the panel; mid-scroll drift is accepted and
  // corrected here (E-4/U-2). The programmatic scroll-into-view fires on step
  // activation only (single call site in the activation effect above).
  useEffect(() => {
    if (!open) return;
    const main = document.querySelector<HTMLElement>('.explore-shell > main');
    const current = EXPLORE_TOUR_STEPS[Math.min(stepIndex, EXPLORE_TOUR_STEPS.length - 1)];
    if (!main) return;
    const sectionId = current?.sectionId ?? null;

    const measurePanel = () => {
      if (sectionId === null) return;
      const el = document.getElementById(sectionId);
      if (!el) return; // E-6
      const rect = el.getBoundingClientRect();
      setPanelRect({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
      const card = cardRef.current;
      if (card) {
        setCardSize((prev) =>
          prev.width === card.offsetWidth && prev.height === card.offsetHeight
            ? prev
            : { width: card.offsetWidth, height: card.offsetHeight },
        );
      }
    };

    const onUserScrollEnd = () => measurePanel();

    let frame = 0;
    const remeasure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setViewport({ width: window.innerWidth, height: window.innerHeight });
        measurePanel();
      });
    };

    main.addEventListener('scrollend', onUserScrollEnd);
    window.addEventListener('resize', remeasure);
    window.addEventListener('orientationchange', remeasure);
    return () => {
      cancelAnimationFrame(frame);
      main.removeEventListener('scrollend', onUserScrollEnd);
      window.removeEventListener('resize', remeasure);
      window.removeEventListener('orientationchange', remeasure);
    };
  }, [open, stepIndex]);

  if (!open) return null;

  // §3 placement: the pure plan-01 module is the single geometry authority —
  // its R-10 viewport-intersection gate docks the card deterministically for
  // panels scrolled off-viewport (never off-screen, SPEC acceptance).
  const placement = placeCard({ panelRect, cardSize, viewport });
  // §1 dim-painter choice: content steps with a settled target render the
  // cut-out hole (its box-shadow IS the dim); welcome/finish and E-6
  // missing-target steps render the plain full dim. The two paint as
  // SIBLING conditional slots before the card (W-4): within content steps
  // the hole keeps its element identity across step changes / re-measures
  // (no remount, no fade replay); swapping dim-painter KINDS mounts a
  // fresh element, replaying the pinned §10 fade exactly once.
  const showHole = step.sectionId !== null && panelRect !== null;

  return (
    <div data-tour-overlay className="pointer-events-none fixed inset-0 z-40">
      <style>{'@keyframes tour-dim-in { from { opacity: 0; } to { opacity: 1; } }'}</style>
      {showHole && panelRect ? (
        <div
          data-tour-hole
          aria-hidden="true"
          className="pointer-events-none absolute rounded-md"
          style={{
            left: panelRect.left - 12,
            top: panelRect.top - 12,
            width: panelRect.width + 24,
            height: panelRect.height + 24,
            boxShadow: '0 0 0 100vmax rgba(0,0,0,0.7)',
            animation: 'tour-dim-in 150ms ease-out',
          }}
        />
      ) : null}
      {!showHole && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0"
          style={{ background: 'rgba(0,0,0,0.7)', animation: 'tour-dim-in 150ms ease-out' }}
        />
      )}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={headingId}
        tabIndex={-1}
        onKeyDown={onCardKeyDown}
        className={`pointer-events-auto absolute rounded-md border bg-card p-4 shadow-lg ${GHOST_INTERACTION ? '' : ''}`}
        style={{ top: placement.top, left: placement.left, width: placement.width }}
      >
        {/* §9/W-5: SR step announcements — on step change and once on open. */}
        <span aria-live="polite" className="sr-only">
          {`Step ${stepIndex + 1} of 7 — ${step.announce}`}
        </span>
        <div className="flex min-h-11 items-center gap-2">
          {step.sectionId !== null && (
            <span
              aria-hidden="true"
              className={`h-2 w-2 shrink-0 rounded-full ${EXPLORE_TOUR_ACCENTS[step.sectionId]}`}
            />
          )}
          <span id={headingId} className="text-sm font-medium">
            {step.heading}
          </span>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close tour"
            className={`ml-auto flex h-[44px] w-[44px] shrink-0 items-center justify-center text-muted-foreground ${GHOST_INTERACTION}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {isFinish ? (
            <>
              <p>{EXPLORE_TOUR_FINISH.congrats}</p>
              <p className="mt-2">
                <Link href={EXPLORE_TOUR_FINISH.linkHref} className="text-accent">
                  {EXPLORE_TOUR_FINISH.linkLabel}
                </Link>
              </p>
              <p className="mt-1">{EXPLORE_TOUR_FINISH.hint}</p>
            </>
          ) : (
            <p>{step.body}</p>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className={`flex h-[44px] px-3 items-center text-xs text-muted-foreground disabled:opacity-50 ${GHOST_INTERACTION}`}
          >
            Back
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <div className="hidden items-center gap-1 sm:flex" aria-hidden="true">
              {EXPLORE_TOUR_STEPS.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-1.5 w-1.5 rounded-full ${i === stepIndex ? 'bg-accent' : 'bg-muted-foreground/40'}`}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground">
              {`Step ${stepIndex + 1} of ${EXPLORE_TOUR_STEPS.length}`}
            </span>
          </div>
          <button
            type="button"
            onClick={stepIndex === EXPLORE_TOUR_STEPS.length - 1 ? dismiss : goNext}
            className={`flex h-[44px] px-3 items-center text-xs text-accent ${GHOST_INTERACTION}`}
          >
            {PRIMARY_LABELS[stepIndex]}
          </button>
        </div>
      </div>
    </div>
  );
}