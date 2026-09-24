'use client';

/**
 * ENGINE B — framer-motion.
 *
 * Throwaway half of the /motion-demo comparison prototype (deleted after the
 * engine decision). The IDENTICAL visual contract to engine-a-raf.tsx, driven
 * by framer's useScroll (same wrapper offset: 0 = top at viewport top, 1 =
 * bottom at viewport bottom) + useTransform against the SAME shared
 * ENTRY_MOTION keyframes. useReducedMotion zeroes the y channel — opacity-only
 * swaps, no spatial movement. The progress readout is a MotionValue child of a
 * motion.span — updated by the engine without a React re-render.
 */

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { CARD_CLASS, DEMO_ENTRIES, ENTRY_MOTION, EntryBody } from './demo-shared';

function FramerCard({
  progress,
  entry,
  index,
}: {
  progress: MotionValue<number>;
  entry: (typeof DEMO_ENTRIES)[number];
  index: number;
}) {
  const reduced = useReducedMotion();
  const spec = ENTRY_MOTION[index];
  const opacity = useTransform(progress, spec.input, spec.opacity);
  const y = useTransform(progress, spec.input, reduced ? spec.input.map(() => 0) : spec.y);
  return (
    <motion.article data-demo-card={index} className={CARD_CLASS} style={{ opacity, y }}>
      <EntryBody entry={entry} />
    </motion.article>
  );
}

export default function EngineBFramer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });
  const readout = useTransform(scrollYProgress, (p) => `${Math.round(p * 100)}%`);

  return (
    <section aria-label="Engine B — framer-motion">
      <div className="border-b bg-muted/30 px-4 py-2 text-center text-xs uppercase tracking-widest text-muted-foreground">
        ENGINE B — framer-motion
      </div>
      <div ref={wrapperRef} className="relative h-[250vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center p-6">
          <div className="w-full max-w-xl">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>scroll ↓ progress</span>
              <motion.span className="tabular-nums text-accent">{readout}</motion.span>
            </div>
            <div className="grid">
              {DEMO_ENTRIES.map((entry, i) => (
                <FramerCard key={entry.company} progress={scrollYProgress} entry={entry} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}