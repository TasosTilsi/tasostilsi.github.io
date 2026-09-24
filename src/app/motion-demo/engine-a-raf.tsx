'use client';

/**
 * ENGINE A — hand-rolled rAF (zero animation deps).
 *
 * Throwaway half of the /motion-demo comparison prototype (deleted after the
 * engine decision). Same pattern as src/components/explore/use-timeline-progress.ts:
 * ONE passive window scroll listener that only SCHEDULES a rAF; each frame does
 * one derivation pass with batched reads first, then transform/opacity writes
 * only; the reduced-motion mode is read fresh per pass and swaps to
 * opacity-only (no translate written); scroll/resize listeners and the pending
 * frame are cleaned up on unmount. React never re-renders per frame — the only
 * dynamic state lives in element styles + the readout text.
 */

import { useEffect, useRef } from 'react';
import type { CSSProperties, RefObject } from 'react';
import {
  CARD_CLASS,
  DEMO_ENTRIES,
  ENTRY_MOTION,
  EntryBody,
  INITIAL_CARD_STYLE,
} from './demo-shared';

/** E-13 house pattern: the ONE reduced-motion read, invoked fresh per pass. */
const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Piecewise-linear keyframe sampler (the hand-rolled twin of useTransform). */
function sampleLinear(input: readonly number[], output: readonly number[], p: number): number {
  if (p <= input[0]) return output[0];
  for (let k = 1; k < input.length; k += 1) {
    if (p <= input[k]) {
      const t = (p - input[k - 1]) / (input[k] - input[k - 1]);
      return output[k - 1] + t * (output[k] - output[k - 1]);
    }
  }
  return output[output.length - 1];
}

/**
 * The small typed scroll hook: one progress value p ∈ [0, 1] through the
 * wrapper (0 = wrapper top at viewport top, 1 = wrapper bottom at viewport
 * bottom), driving every entry card imperatively from ENTRY_MOTION.
 */
function useRafScrollStage(): {
  wrapperRef: RefObject<HTMLDivElement>;
  stageRef: RefObject<HTMLDivElement>;
} {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) return;
    const cards = Array.from(stage.querySelectorAll<HTMLElement>('[data-demo-card]'));
    const readout = stage.querySelector<HTMLElement>('[data-demo-readout]');
    if (cards.length === 0) return;

    const derive = () => {
      const rm = prefersReducedMotion(); // fresh per pass
      // Batched reads FIRST — never interleaved with writes.
      const rect = wrapper.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = range > 0 ? Math.min(Math.max(-rect.top / range, 0), 1) : 0;
      // Writes AFTER all reads — transform/opacity only.
      for (let i = 0; i < cards.length; i += 1) {
        const spec = ENTRY_MOTION[i];
        const el = cards[i];
        if (!spec || !el) continue;
        const opacity = sampleLinear(spec.input, spec.opacity, p);
        const y = sampleLinear(spec.input, spec.y, p);
        el.style.opacity = String(opacity);
        el.style.transform = rm ? '' : `translateY(${y}px)`; // RM: no spatial movement
      }
      if (readout) readout.textContent = `${Math.round(p * 100)}%`;
    };

    const schedule = () => {
      if (frameRef.current !== 0) return; // ≤1 derivation pass per frame
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = 0;
        derive();
      });
    };

    const onScroll = () => schedule();
    const onResize = () => schedule();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    derive(); // first pass reads the actual scroll position — instant landing

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frameRef.current !== 0) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return { wrapperRef, stageRef };
}

export default function EngineARaf() {
  const { wrapperRef, stageRef } = useRafScrollStage();
  return (
    <section aria-label="Engine A — hand-rolled rAF (zero deps)">
      <div className="border-b bg-muted/30 px-4 py-2 text-center text-xs uppercase tracking-widest text-muted-foreground">
        ENGINE A — hand-rolled rAF (zero deps)
      </div>
      <div ref={wrapperRef} className="relative h-[250vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center p-6">
          <div className="w-full max-w-xl">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>scroll ↓ progress</span>
              <span data-demo-readout className="tabular-nums text-accent">
                0%
              </span>
            </div>
            <div className="grid">
              {DEMO_ENTRIES.map((entry, i) => (
                <article
                  key={entry.company}
                  data-demo-card={i}
                  className={CARD_CLASS}
                  style={INITIAL_CARD_STYLE[i] as CSSProperties}
                >
                  <EntryBody entry={entry} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}