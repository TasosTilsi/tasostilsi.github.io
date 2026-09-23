/**
 * PanelShell — shared panel chrome (phase EXPLORE-02, UI-SPEC §3).
 *
 * Byte-identical reproduction of the phase-1 shell anatomy: the section
 * wrapper (the locked chrome card classes + optional grid-placement
 * className), the header row (8×8px aria-hidden accent chip in the
 * section's chart-N color + the locked section label as text-sm
 * font-medium), and a body slot below the chrome row (mt-3 is the first
 * body gap, UI-SPEC §3).
 *
 * D-02 hierarchy device (EXPLORE-07 plan 02, UI-SPEC §5): the header row
 * gains a quiet oversized mono index (01–04) at its right end — aria-hidden,
 * zero-padded by the sole caller (explore-panels.tsx) from the
 * EXPLORE_SECTIONS map index, no literals in JSX. Drawer items, tour card
 * headings and the status bar are explicitly out of scope (UI-SPEC §5).
 *
 * NON-INTERACTIVE, pinned (UI-SPEC §17.6): no hover affordance, no pointer
 * cursor, not focusable — a hover style would promise navigation that does
 * not exist until later phases; the index device is decorative chrome and
 * keeps the panel chrome hover-inert. Stable section id lands on the
 * <section> so drawer anchors and no-JS hash navigation resolve against it.
 *
 * Server component (UI-SPEC §2): no client directive, no hooks — the body is
 * passed in as server-rendered children so the whole panel stays in the
 * static export.
 */
import type { ReactNode } from 'react';
import type { ExploreSectionId } from './constants';

export function PanelShell({
  id,
  label,
  accent,
  index,
  className,
  children,
}: {
  id: ExploreSectionId;
  label: string;
  accent: string;
  index: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={`rounded-md border bg-card p-4${className ? ` ${className}` : ''}`}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`h-2 w-2 shrink-0 rounded-full ${accent}`}
        />
        <h2 className="text-sm font-medium">{label}</h2>
        <span
          aria-hidden="true"
          className="ml-auto select-none font-mono text-2xl font-medium leading-none tabular-nums text-muted-foreground/50"
        >
          {index}
        </span>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}