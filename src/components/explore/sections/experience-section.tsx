"use client";

/**
 * ExperienceSection — the full-width semicircular career-timeline stage
 * (phase 8, REV-07/REV-12/REV-13; phase 9 REV-16 education-on-arc;
 * UI-SPEC §2/§3/§8/§9/§10; D-03…D-07).
 *
 * ONE DOM serves three hydration paths (§8 B-1): the md+ interactive stage
 * (arc zone + content layers + controls, driven by useTimelineProgress —
 * seam 2), the <md compact form (the SAME layer nodes restacked by
 * md:-scoped classes — year chip leads, all five entries visible, no cramped
 * arc), and the no-JS static export (entry 1 = Chubb role renders real
 * text; layers 2–5 carry visibility:hidden + aria-hidden — the SSR styles
 * are the §9 derivation evaluated at progress 0, no special-casing). The
 * interaction activates on hydration (D-07); no geometry-dependent layout
 * (flow text).
 *
 * Entry selection is the phase-9 ONE derivation site: selectTimelineEntries
 * (timeline-geometry.ts) merges experience.filter(isTechRelated) with
 * education.filter(featured) sorted year-DESCENDING — present-first (user
 * directive: the experience is shown from the present to the past; Chubb
 * 2023 is the arc's focal point at rest) (D-03/REV-16 — the phase-6
 * isTechRelated filter still governs the role side; no slice).
 * Zero selected entries render nothing at all (E-1). Content templates are
 * type-aware (§3.3): roles render title > company > duration·location meta
 * (both strings AS STORED, R-7/U-8 — dash style never normalized) > the
 * first three responsibilities bullets (U-3 — fewer render what exists,
 * absent/empty omit the whole list); education renders degree > institution
 * > duration AS STORED (no location, no separator, dash style never
 * normalized) > specialization as a single muted line ONLY when present
 * (BEng has none — omits). Every rendered string traces to
 * portfolio-main-data.json through the pure module.
 *
 * Stage anatomy (§1.2/§2/§3): interior row md:grid md:grid-cols-[2fr_3fr]
 * (the 40/60 split), arc zone hidden below md; the left-bulging C arc is a
 * server-rendered aria-hidden SVG (fixed viewBox, non-scaling-stroke) whose
 * geometry is client-measured — zero layout shift on hydration; markers are
 * absolutely-positioned REAL TEXT (dot + year label) positioned by the
 * hook's rAF writes (rendered at inline opacity 0 pre-measurement, fading
 * in 150ms after the first measured frame — §9). Marker anatomy is
 * type-aware (§3.2 W-2): role markers keep the filled dot + active size
 * swap; education markers are the CONSTANT hollow dot (rounded-full border
 * border-chart-2 bg-transparent — never fills, never swaps size class; the
 * type difference IS the visual distinction, emphasis rides the existing
 * ladder + label treatment) with a plain year label — no date-line suffix.
 * Marker keys are type-aware (education entries have no company — the
 * primary keys the type: entry.company for roles, entry.institution for
 * education, plus index). Markers carry NO hover/press/cursor affordance
 * and no current-state marker attribute — emphasis is visual, state is
 * announced by the sr-only aria-live region on DISCRETE activeIndex changes
 * only (§4/§10).
 *
 * Interaction (§4/§5): exactly TWO interactive controls — the Prev/Next
 * buttons (44px targets, the tour's GHOST_INTERACTION focus recipe
 * verbatim, disabled at the clamped ends over 5 stops); the
 * ArrowUp/ArrowDown handler rides the group root. The active ROLE marker's
 * date line renders the duration AS STORED behind the W-4 measurable
 * predicate (dateLineFits over the measured arc-zone width — computed, not
 * eyeballed; the §1.4 md-width estimate stands in before the first
 * measurement); education markers render the year only.
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
 * 2px size change is spatial movement) and never applies to education dots
 * (W-2: constant anatomy). No new suppressor CSS (R-6) — inline Tailwind
 * utilities only, under .explore-shell scope by DOM position; the guard
 * stays the single suppressor.
 */
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { PortfolioData } from '@/data/portfolio-main-data';
import {
  contentLayer,
  dateLineFits,
  selectTimelineEntries,
  type TimelineEntry,
} from '../timeline-geometry';
import { useTimelineProgress } from '../use-timeline-progress';
import { TerminalPointer } from './terminal-pointer';

/** The tour's GHOST_INTERACTION recipe verbatim (explore-tour.tsx:60-61, §4). */
const GHOST_INTERACTION =
  'rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/**
 * The §3.2/§3.3 type-aware primary: roles key on entry.company; education
 * on entry.institution (education entries have no company — the `in`
 * predicate narrows the union; roles always carry it in the JSON).
 */
const entryPrimary = (t: TimelineEntry): string =>
  'company' in t.entry ? t.entry.company : t.entry.institution;

export function ExperienceSection({
  experience,
  education,
}: {
  experience: PortfolioData['experience'];
  education: PortfolioData['education'];
}) {
  const entries = selectTimelineEntries(experience, education); // D-06/D-03: the ONE derivation site
  if (entries.length === 0) {
    return null; // E-1: zero selected entries → the body renders nothing (§11)
  }
  return <TimelineStage entries={entries} />;
}

function TimelineStage({ entries }: { entries: TimelineEntry[] }) {
  const entryCount = entries.length;
  const {
    activeIndex,
    stageActive,
    reducedMotion,
    arcZoneWidth,
    stepRole,
    handleKeyDown,
  } = useTimelineProgress(entryCount);
  const active = entries[activeIndex];
  // W-4: the ACTIVE ROLE marker's date line renders only when the measured
  // arc zone can hold it (6px/char at the 10px date size — the pure
  // predicate). Education markers render the year only (§3.2) — the
  // date-line suffix never applies to them.
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
            {entries.map((t, index) => {
              const isActive = index === activeIndex;
              const isEducation = t.type === 'education';
              // W-2: education dots are the CONSTANT hollow dot in both
              // states — never fill, never swap size; the type difference IS
              // the visual distinction. W-7: role dots' size-class swap is
              // SUPPRESSED under reduced motion (dots stay at the inactive
              // size; only the fill swaps).
              const dotClass = isEducation
                ? 'h-1.5 w-1.5 rounded-full border border-chart-2 bg-transparent'
                : `rounded-full transition-colors duration-200 ease-out ${
                    !isActive || reducedMotion ? 'h-1.5 w-1.5' : 'h-2 w-2'
                  } ${isActive ? 'bg-chart-2' : 'bg-muted-foreground/40'}`;
              return (
                <span
                  key={`dot-${entryPrimary(t)}-${index}`}
                  data-timeline-dot="true"
                  aria-hidden="true"
                  style={{ opacity: 0 }}
                  className={`absolute left-0 top-0 ${dotClass}`}
                />
              );
            })}
            {entries.map((t, index) => {
              const isActive = index === activeIndex;
              // §3.2: education labels render the YEAR only — no date-line
              // suffix (the type-aware template carries the dates).
              const showDateLine =
                t.type === 'role' && isActive && dateFits;
              return (
                <span
                  key={`label-${entryPrimary(t)}-${index}`}
                  data-timeline-label="true"
                  style={{ opacity: 0 }}
                  className={`absolute left-0 top-0 whitespace-nowrap font-mono tabular-nums transition-colors duration-200 ease-out ${
                    isActive
                      ? 'text-sm font-medium text-foreground'
                      : 'text-xs text-muted-foreground'
                  }`}
                >
                  {t.year !== null && (
                    <>
                      {t.year}
                      {showDateLine && (
                        <span className="block text-[10px] tabular-nums text-muted-foreground">
                          {t.entry.duration}
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
              {String(activeIndex + 1).padStart(2, '0')} / {String(entryCount).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => stepRole(1)}
              disabled={activeIndex === entryCount - 1}
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
            {entries.map((t, index) => {
              const entry = t.entry;
              const isEducation = t.type === 'education';
              // The narrowing predicate for the union entry: roles carry
              // company (and responsibilities); education carries
              // institution (and an optional specialization).
              const isRole = 'company' in entry;
              const bullets = isRole ? (entry.responsibilities ?? []).slice(0, 3) : [];
              // §9: SSR = the derivation evaluated at progress 0 — layer 0
              // visible real text, layers 1–4 visibility:hidden. The style
              // prop stays CONSTANT after hydration (React never re-writes
              // it), so the hook's rAF writes own the live values.
              const ssr = contentLayer(index, 0, false);
              return (
                <div
                  key={`${t.type}-${entryPrimary(t)}-${entry.duration}-${index}`}
                  data-timeline-layer="true"
                  aria-hidden={stageActive && index !== activeIndex}
                  style={{
                    opacity: ssr.opacity,
                    transform: `translateY(${ssr.translateY}px)`,
                    visibility: ssr.visible ? 'visible' : 'hidden',
                  }}
                  className="md:col-start-1 md:row-start-1"
                >
                  {/* md:hidden year chip — the compact form's marker row (§8);
                  education chips carry the hollow dot too (§3.3). */}
                  <div className="flex items-center gap-2 md:hidden">
                    {isEducation ? (
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full border border-chart-2 bg-transparent"
                      />
                    ) : (
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-chart-2" />
                    )}
                    {t.year !== null && (
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {t.year}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-medium text-foreground">
                    {isRole ? entry.title : entry.degree}
                  </h3>
                  <p className="mt-0.5 text-sm text-foreground">{entryPrimary(t)}</p>
                  {isEducation ? (
                    <>
                      {/* Education dates: duration AS STORED — no location,
                      no separator, dash style never normalized (§3.3). */}
                      <p className="text-xs text-muted-foreground">
                        <span className="tabular-nums">{entry.duration}</span>
                      </p>
                      {'specialization' in entry && entry.specialization && (
                        <p className="text-xs text-muted-foreground">{entry.specialization}</p>
                      )}
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <p className="sr-only" aria-live="polite">
            {`Entry ${activeIndex + 1} of ${entryCount} — ${
              'company' in active.entry ? active.entry.title : active.entry.degree
            }, ${entryPrimary(active)}`}
          </p>
          <TerminalPointer command="experience --all" />
        </div>
      </div>
    </div>
  );
}