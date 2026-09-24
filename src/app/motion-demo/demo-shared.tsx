/**
 * Shared throwaway fixtures for the motion-engine comparison prototype
 * (scratch page /motion-demo — to be deleted after the engine decision).
 *
 * Single source of truth so ENGINE A (hand-rolled rAF) and ENGINE B
 * (framer-motion) drive IDENTICAL visuals from IDENTICAL keyframes.
 */

import type { CSSProperties } from 'react';

export interface DemoEntry {
  year: string;
  title: string;
  company: string;
  bullets: string[];
}

export const DEMO_ENTRIES: DemoEntry[] = [
  {
    year: '2023',
    title: 'Senior Software Engineer in Test',
    company: 'Chubb',
    bullets: [
      'Internal NPM automation framework adopted by 12+ engineering teams across 20+ projects.',
      'MCP servers and AI agent skills serving 30+ engineers at the point of work.',
    ],
  },
  {
    year: '2022',
    title: 'Software Engineer in Test',
    company: 'Upstream Systems',
    bullets: [
      'Automated smoke and regression suites integrated into daily CI/CD delivery cycles.',
      'Shift-left strategy fed by UX and performance findings before development began.',
    ],
  },
  {
    year: '2019',
    title: 'Software Engineer in Test',
    company: 'Netcompany-Intrasoft',
    bullets: [
      "Built the team's first Jenkins CI pipelines for test automation, with overnight regression runs.",
      'Authored test artifacts and traceability matrices achieving 100% requirement coverage.',
    ],
  },
];

/**
 * The scroll-linked keyframe contract — one progress value p ∈ [0, 1] through
 * the ~250vh wrapper. Each entry transitions inside a window centred on its
 * boundary (1/3 and 2/3, half-width 1/12):
 *
 *   outgoing (dying entry): translateY 0 → -80px, opacity 1 → 0.15 → 0
 *                           (0.15 reached mid-window — the spec'd coexistence
 *                           range — then fully gone by window end so nothing
 *                           lingers behind the settled card)
 *   incoming (next entry):  translateY 120px → 0, opacity 0 → 1
 *
 * Both engines consume these exact arrays: framer's useTransform directly,
 * the rAF engine via a piecewise-linear sampler.
 */
export interface EntryMotionSpec {
  input: number[];
  opacity: number[];
  y: number[];
}

export const ENTRY_MOTION: EntryMotionSpec[] = [
  {
    // entry 0 — visible at p=0, exits across [0.25, 5/12]
    input: [0, 0.25, 1 / 3, 5 / 12, 1],
    opacity: [1, 1, 0.15, 0, 0],
    y: [0, 0, -80, -80, -80],
  },
  {
    // entry 1 — enters across [0.25, 5/12], exits across [7/12, 3/4]
    input: [0, 0.25, 5 / 12, 7 / 12, 2 / 3, 3 / 4, 1],
    opacity: [0, 0, 1, 1, 0.15, 0, 0],
    y: [120, 120, 0, 0, -80, -80, -80],
  },
  {
    // entry 2 — enters across [7/12, 3/4], settles for the tail
    input: [0, 7 / 12, 3 / 4, 1],
    opacity: [0, 0, 1, 1],
    y: [120, 120, 0, 0],
  },
];

/** Pre-JS (SSR) card styles — the p=0 derivation, matching §9 house pattern. */
export const INITIAL_CARD_STYLE: CSSProperties[] = [
  { opacity: 1 },
  { opacity: 0, transform: 'translateY(120px)' },
  { opacity: 0, transform: 'translateY(120px)' },
];

/** Shared card classes — both engines render the identical visual chrome. */
export const CARD_CLASS =
  '[grid-area:1/1] rounded-lg border bg-card p-6 shadow-md';

export function EntryBody({ entry }: { entry: DemoEntry }) {
  return (
    <>
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {entry.year}
      </span>
      <h2 className="mt-2 text-xl font-semibold">{entry.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{entry.company}</p>
      <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-muted-foreground">
        {entry.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </>
  );
}