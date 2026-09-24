"use client";

/**
 * ExperienceSection — the full-width semicircular career-timeline stage
 * (phase 8, REV-07/REV-12/REV-13; UI-SPEC §2/§3/§8/§9/§10; D-03…D-07).
 *
 * ONE DOM serves three hydration paths (§8 B-1): the md+ interactive stage
 * (arc zone + content layers + controls, driven by useTimelineProgress —
 * seam 2), the <md compact form (the SAME layer nodes restacked by
 * md:-scoped classes — year chip leads, all three roles visible, no cramped
 * arc), and the no-JS static export (role 1 = Chubb renders real text;
 * layers 2–3 carry visibility:hidden + aria-hidden — the SSR styles are the
 * §9 derivation evaluated at progress 0, no special-casing). The interaction
 * activates on hydration (D-07); no geometry-dependent layout (flow text).
 *
 * Role selection is the pinned phase-6 contract: selectTimelineRoles
 * (timeline-geometry.ts, the phase's ONE derivation site) filters
 * isTechRelated in JSON order — no sorting, no slice (D-06 supersedes the
 * phase-7 order-cap). Zero tech-filtered roles render nothing at all (E-1).
 * Every rendered string traces to portfolio-main-data.json through the pure
 * module: the merged duration·location meta idiom carries over verbatim
 * with both strings AS STORED (R-7/U-8 — dash style never normalized);
 * bullets are the first three of responsibilities (U-3 — fewer render what
 * exists, absent/empty omit the whole list).
 *
 * Stage anatomy (§1.2/§2/§3): interior row md:grid md:grid-cols-[2fr_3fr]
 * (the 40/60 split), arc zone hidden below md; the left-bulging C arc is a
 * server-rendered aria-hidden SVG (fixed viewBox, non-scaling-stroke) whose
 * geometry is client-measured — zero layout shift on hydration; markers are
 * absolutely-positioned REAL TEXT (dot + year label) positioned by the
 * hook's rAF writes (rendered at inline opacity 0 pre-measurement, fading
 * in 150ms after the first measured frame — §9); markers carry NO
 * hover/press/cursor affordance and no current-state marker attribute —
 * emphasis is visual,
 * state is announced by the sr-only aria-live region on DISCRETE
 * activeIndex changes only (§4/§10).
 *
 * Interaction (§4/§5): exactly TWO interactive controls — the Prev/Next
 * buttons (44px targets, the tour's GHOST_INTERACTION focus recipe
 * verbatim, disabled at the clamped ends); the ArrowUp/ArrowDown handler
 * rides the group root. The active marker's date line renders the duration
 * AS STORED behind the W-4 measurable predicate (dateLineFits over the
 * measured arc-zone width — computed, not eyeballed; the §1.4 md-width
 * estimate stands in before the first measurement).
 *
 * Discrete class swaps (active marker color, dot fill) ride React state on
 * activeIndex change with transition-colors 200ms ease-out (the phase-7
 * vocabulary) — transition-COLORS, deliberately not the plan's shorthand
 * transition-[color,opacity]: opacity and transform are written per-frame
 * by the hook's rAF channel, and a per-frame-written property must never
 * carry a CSS transition (UI-SPEC §6 row 1 — a transition would fight the
 * writes and lag the scroll); the color-only set still smooths the discrete
 * swap. The dot SIZE-class swap is gated on the hook's post-mount
 * reducedMotion state — suppressed entirely under reduced motion (W-7: a
 * 2px size change is spatial movement). No new suppressor CSS (R-6) —
 * inline Tailwind utilities only, under .explore-shell scope by DOM
 * position; the guard stays the single suppressor.
 */
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { PortfolioData } from '@/data/portfolio-main-data';
import {
  contentLayer,
  dateLineFits,
  selectTimelineRoles,
  type TimelineRole,
} from '../timeline-geometry';
import { useTimelineProgress } from '../use-timeline-progress';
import { TerminalPointer } from './terminal-pointer';

/** The tour's GHOST_INTERACTION recipe verbatim (explore-tour.tsx:60-61, §4). */
const GHOST_INTERACTION =
  'rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

export function ExperienceSection({
  experience,
}: {
  experience: PortfolioData['experience'];
}) {
  const roles = selectTimelineRoles(experience); // D-06: filter-governed, JSON order
  if (roles.length === 0) {
    return null; // E-1: zero tech-filtered roles → the body renders nothing (§11)
  }
  return <TimelineStage roles={roles} />;
}

function TimelineStage({ roles }: { roles: TimelineRole[] }) {
  const roleCount = roles.length;
  const {
    activeIndex,
    stageActive,
    reducedMotion,
    arcZoneWidth,
    stepRole,
    handleKeyDown,
  } = useTimelineProgress(roleCount);
  const active = roles[activeIndex];
  // W-4: the active marker's date line renders only when the measured arc
  // zone can hold it (6px/char at the 10px date size — the pure predicate).
  const dateFits = dateLineFits(active.entry.duration, arcZoneWidth ?? 250);

  return (
    <div role="group" aria-label="Career timeline" onKeyDown={handleKeyDown}>
      <div className="gap-4 md:grid md:h-[calc(100dvh-14rem)] md:grid-cols-[2fr_3fr]">
        {/* Arc zone — the 40% column at md+; hidden below md (§1.2/§8). */}
        <div className="hidden md:flex md:flex-col">
          <div data-timeline-arc-zone="true" className="relative flex-1">
            <svg
              viewBox="0 0 100 200"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d="M 100 0 A 100 100 0 0 0 100 200"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            {roles.map((role, index) => {
              const isActive = index === activeIndex;
              // W-7: under reduced motion the size-class swap is SUPPRESSED
              // — dots stay at the inactive size; only the fill swaps.
              const dotSize = !isActive || reducedMotion ? 'h-1.5 w-1.5' : 'h-2 w-2';
              const dotFill = isActive ? 'bg-chart-2' : 'bg-muted-foreground/40';
              return (
                <span
                  key={`dot-${role.entry.company}-${index}`}
                  data-timeline-dot="true"
                  aria-hidden="true"
                  style={{ opacity: 0 }}
                  className={`absolute left-0 top-0 rounded-full transition-colors duration-200 ease-out ${dotSize} ${dotFill}`}
                />
              );
            })}
            {roles.map((role, index) => {
              const isActive = index === activeIndex;
              return (
                <span
                  key={`label-${role.entry.company}-${index}`}
                  data-timeline-label="true"
                  style={{ opacity: 0 }}
                  className={`absolute left-0 top-0 whitespace-nowrap font-mono tabular-nums transition-colors duration-200 ease-out ${
                    isActive
                      ? 'text-sm font-medium text-foreground'
                      : 'text-xs text-muted-foreground'
                  }`}
                >
                  {role.year !== null && (
                    <>
                      {role.year}
                      {isActive && dateFits && (
                        <span className="block text-[10px] tabular-nums text-muted-foreground">
                          {role.entry.duration}
                        </span>
                      )}
                    </>
                  )}
                </span>
              );
            })}
          </div>
          {/* Control row — the ONLY interactive controls (§4); absent below md. */}
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => stepRole(-1)}
              disabled={activeIndex === 0}
              aria-label="Previous role"
              className={`flex h-[44px] min-w-[44px] items-center justify-center px-3 text-xs text-muted-foreground disabled:opacity-50 ${GHOST_INTERACTION}`}
            >
              <ChevronUp aria-hidden="true" className="h-4 w-4" />
            </button>
            <span
              aria-hidden="true"
              className="font-mono text-[10px] tabular-nums text-muted-foreground"
            >
              {String(activeIndex + 1).padStart(2, '0')} / {String(roleCount).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => stepRole(1)}
              disabled={activeIndex === roleCount - 1}
              aria-label="Next role"
              className={`flex h-[44px] min-w-[44px] items-center justify-center px-3 text-xs text-accent disabled:opacity-50 ${GHOST_INTERACTION}`}
            >
              <ChevronDown aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
        {/* Content column — the §3 grid stack, vertically centered at md+. */}
        <div className="flex flex-col justify-center">
          <div className="space-y-5 md:space-y-0 md:grid">
            {roles.map((role, index) => {
              const entry = role.entry;
              const bullets = (entry.responsibilities ?? []).slice(0, 3);
              // §9: SSR = the derivation evaluated at progress 0 — layer 0
              // visible real text, layers 1–2 visibility:hidden. The style
              // prop stays CONSTANT after hydration (React never re-writes
              // it), so the hook's rAF writes own the live values.
              const ssr = contentLayer(index, 0, false);
              return (
                <div
                  key={`${entry.company}-${entry.duration}-${index}`}
                  data-timeline-layer="true"
                  aria-hidden={stageActive && index !== activeIndex}
                  style={{
                    opacity: ssr.opacity,
                    transform: `translateY(${ssr.translateY}px)`,
                    visibility: ssr.visible ? 'visible' : 'hidden',
                  }}
                  className="md:col-start-1 md:row-start-1"
                >
                  {/* md:hidden year chip — the compact form's marker row (§8). */}
                  <div className="flex items-center gap-2 md:hidden">
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-chart-2" />
                    {role.year !== null && (
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {role.year}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-medium text-foreground">{entry.title}</h3>
                  <p className="mt-0.5 text-sm text-foreground">{entry.company}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="tabular-nums">{entry.duration}</span>
                    <span aria-hidden="true"> · </span>
                    {entry.location}
                  </p>
                  {bullets.length > 0 && (
                    <ul className="mt-2 space-y-1.5 list-disc pl-4 marker:text-muted-foreground">
                      {bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="text-xs leading-relaxed text-muted-foreground"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
          <p className="sr-only" aria-live="polite">
            {`Role ${activeIndex + 1} of ${roleCount} — ${active.entry.title}, ${active.entry.company}`}
          </p>
          <TerminalPointer command="experience --all" />
        </div>
      </div>
    </div>
  );
}