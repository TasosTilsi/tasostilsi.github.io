"use client";

/**
 * ExploreIntro — typewriter strip (D-07, UI-SPEC §4).
 *
 * Region ② of the IDE frame: accent ❯ prefix + TypingEffect rendering the
 * REAL visitor-facing `${name} — ${title}` from portfolio-main-data.json,
 * reusing the CLI's TypingEffect UNMODIFIED (D-07 — its pulsing `_` cursor
 * disappears on completion by design; CLI reuse protection). Timing pinned:
 * speed=30, delay=400; runs once per mount, no persistence, no replay.
 *
 * Accessibility split (UI-SPEC §4/§13): a server-rendered sr-only <h1>
 * holds the full text — the screen-reader and no-JS source — while the
 * visually animated span is aria-hidden (char-by-char mutation is AT
 * noise) and renders EMPTY in static HTML, filling client-side (accepted
 * pinned tradeoff: no CLS, no flash-of-full-text on hydration).
 *
 * Reduced motion (UI-SPEC §12): a one-shot mount-effect matchMedia check —
 * which runs before the 400ms delay fires, so no character types — swaps
 * the animated span for the static full text; TypingEffect is not rendered
 * at all under reduce.
 *
 * No layout shift: the strip reserves height with px arbitrary values
 * (min-h-[60px] md:min-h-[20px] — immune to the ≤640px html{font-size:14px}
 * rem shrink; text-sm line-height = 20px/line, the ~91-char refreshed
 * name—title string wraps to three lines at 375px — checker B-6 3-line
 * reserve), shrink-0, border-b per UI-SPEC §2.1/§4.
 */
import { useEffect, useState } from 'react';
import { TypingEffect } from '@/components/cli/TypingEffect';

export function ExploreIntro({ name, title }: { name: string; title: string }) {
  const fullText = `${name} — ${title}`;
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true);
    }
  }, []);

  return (
    <div className="flex min-h-[60px] shrink-0 items-center border-b px-4 text-sm md:min-h-[20px]">
      <h1 className="sr-only">{fullText}</h1>
      <span aria-hidden="true" className="text-accent">
        ❯
      </span>
      <span aria-hidden="true" className="ml-2 text-foreground">
        {reducedMotion ? (
          fullText
        ) : (
          <TypingEffect text={fullText} speed={30} delay={400} />
        )}
      </span>
    </div>
  );
}