/**
 * /motion-demo — THROWAWAY engine-comparison prototype (branch phase-8).
 *
 * Lets the user visually decide between two scroll-driven animation engines
 * for the upcoming editorial content transition:
 *   ENGINE A — hand-rolled rAF (zero animation deps)
 *   ENGINE B — framer-motion
 *
 * Both sections render the identical visual contract (same entries, same
 * keyframes, same coexistence behaviour) from demo-shared.tsx. This page is
 * NOT linked from anywhere and is to be deleted after the engine decision.
 *
 * page.tsx stays a Server Component because `metadata` cannot be exported
 * from a 'use client' module — the interactive halves live in the sibling
 * client components engine-a-raf.tsx / engine-b-framer.tsx.
 */

import type { Metadata } from 'next';
import EngineARaf from './engine-a-raf';
import EngineBFramer from './engine-b-framer';

export const metadata: Metadata = {
  title: 'Motion Engine Prototype',
};

export default function MotionDemoPage() {
  return (
    <main
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: 'var(--font-jetbrains), var(--font-geist-mono), monospace' }}
    >
      <div className="border-b border-accent/40 bg-accent/10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-accent">
        ENGINE PROTOTYPE — scratch page, to be deleted after the engine decision
      </div>
      <EngineARaf />
      <div className="border-y border-dashed bg-muted/20 py-3 text-center text-xs uppercase tracking-widest text-muted-foreground">
        section divider — Engine A above · Engine B below
      </div>
      <EngineBFramer />
    </main>
  );
}