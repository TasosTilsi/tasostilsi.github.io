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
 * NON-INTERACTIVE, pinned (UI-SPEC §17.6): no hover affordance, no pointer
 * cursor, not focusable — a hover style would promise navigation that does
 * not exist until later phases. Stable section id lands on the <section>
 * so drawer anchors and no-JS hash navigation resolve against it.
 *
 * Server component (UI-SPEC §2): no client directive, no hooks — the body is
 * passed in as server-rendered children so the whole panel stays in the
 * static export. Until plan 02 task 3 removes it, the transitional
 * placeholder body lives in explore-panels.tsx and renders inside this
 * slot for panels whose real body is not registered yet.
 */
import type { ReactNode } from 'react';
import type { ExploreSectionId } from './constants';

export function PanelShell({
  id,
  label,
  accent,
  className,
  children,
}: {
  id: ExploreSectionId;
  label: string;
  accent: string;
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
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}