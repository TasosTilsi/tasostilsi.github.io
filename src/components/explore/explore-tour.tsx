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
import { placeCard } from './tour-placement';
import { readTourFlag, writeTourFlag } from './use-explore-visited';

/** §4 primary-action label ladder, indexed by stepIndex (0-6). */
const PRIMARY_LABELS = ['Start', 'Next', 'Next', 'Next', 'Next', 'Finish', 'Done'] as const;

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

  // Task 1 tracer: content steps render the temporary no-target treatment —
  // the real spotlight (mark → settle → measure → cut-out) replaces it in
  // Task 2, which consumes onMarkVisited at step activation (§3 order).
  void onMarkVisited;

  // D-05/E-10 reset: every open (from closed, or the Tour button clicked
  // while open — the shell bumps reopenEpoch on every Tour click; auto-open
  // does not) lands on step 1 (welcome). Flag untouched on reset (E-10).
  useEffect(() => {
    if (open) setStepIndex(0);
  }, [open, reopenEpoch]);

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

  // Keep placeCard's viewport honest while the tour is open (the rAF-coalesced
  // panel re-measure lands in Task 2; the card geometry needs this now).
  useEffect(() => {
    if (!open) return;
    const syncViewport = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', syncViewport);
    return () => window.removeEventListener('resize', syncViewport);
  }, [open]);

  if (!open) return null;

  // Task 1 tracer: every step is treated as no-target — welcome/finish
  // geometry (docked <640px, centered ≥640px). The card is the wrapper's
  // LAST child (W-4) so the dim never paints over it.
  const placement = placeCard({ panelRect: null, cardSize, viewport });

  return (
    <div data-tour-overlay className="pointer-events-none fixed inset-0 z-40">
      <style>{'@keyframes tour-dim-in { from { opacity: 0; } to { opacity: 1; } }'}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{ background: 'rgba(0,0,0,0.7)', animation: 'tour-dim-in 150ms ease-out' }}
      />
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