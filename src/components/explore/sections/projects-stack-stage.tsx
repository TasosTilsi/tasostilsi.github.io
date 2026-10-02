'use client';

/**
 * ProjectsStackStage — the phase's ONLY framer-motion import site (D-06,
 * UI-SPEC §3): the swipe-driven, Tinder-style stacked-card carousel for the
 * Projects panel. Replaces the retired scroll-driven composition.
 *
 * Motion contract: a single ring-buffer foreground index drives every card's
 * depth through the pure cardState() module. The foreground card is a
 * framer-motion drag="x" target; drag-release above the pinned offset or
 * velocity threshold flies the card off in the swipe direction and loops it
 * to the back of the stack. Keyboard Prev/Next and Arrow keys trigger the
 * same fly-off/loop choreography. Reduced motion bypasses the fly-off and
 * swaps state instantly (opacity-only). The reduced-motion preference is
 * MOUNT-GATED: framer's useReducedMotion hook is read during render but its
 * value is consumed only after a mount-only effect flips a mounted flag, so
 * the first client render reproduces the server's non-RM geometry exactly
 * (no hydration mismatch and no first-paint flash for an RM user); after
 * mount the RM contract above takes over unchanged.
 *
 * A11y: role="group" aria-label="Projects carousel"; only the foreground card
 * is not aria-hidden and not pointer-events-none. An aria-live="polite" region
 * announces the active project name, throttled to one announcement per 500ms.
 *
 * Shadows: the foreground card carries the shell's --panel-shadow-hover bloom
 * and is overflow-visible so the shadow renders visibly behind it onto the
 * cards beneath.
 *
 * Containment (2026-10-02 defect fix, DEFECT 2): the stage container carries a
 * FIXED height that holds the full depth range (card + peek band + safe
 * margin, see PEEK_BAND_PX) and clips with `overflow-hidden`, so the
 * behind-card peeks and the 500px swipe fly-off can never extend the layout —
 * no negative-space escape upward or downward and no scroll height added to
 * the document. The card box is BOTTOM-ANCHORED inside the stage, which
 * decouples the card's own height from the band the peeks travel through. The
 * bloom glow that lands on the peeking cards lives INSIDE that band, so it
 * survives the clip; only the ≤4px outward side/bottom glow softens at the
 * clip edge (depth shading on the cards beneath is what the design needs).
 *
 * Centering (2026-10-02 defect fix, DEFECT 1): the stack root is a flex column
 * with `items-center justify-center` around the stage wrapper, and the
 * Projects panel body is vertically centered inside its (content-driven,
 * grid-stretched) PanelShell by the md-scoped placement shell classes in
 * explore-panels.tsx — genuine centering in both axes at md+, same
 * containment + centering inside the compact stage at <md.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import {
  cardState,
  firstSentence,
  projectTechnologies,
  projectYear,
  projectVisualVariant,
  swipeAccepts,
} from '../projects-card-state';
import type { PortfolioData } from '@/data/portfolio-main-data';

type ProjectEntry = PortfolioData['projects'][number];
type SwipeMode = 'full' | 'compact';
type SwipeDirection = -1 | 1;

/** Card shell classes reused by SSR and motion stacks. */
const CARD_SHELL =
  'w-full aspect-[4/3] rounded-lg border border-border bg-card mx-auto relative';

/** Focus ring recipe for the active-card link (W-13: no exp-lift on cards). */
const RING_RECIPE =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** The 44px ghost-button interaction recipe from the Experience stage. */
const GHOST_INTERACTION =
  'rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Throttle window for the aria-live active-card announcement. */
const ANNOUNCEMENT_THROTTLE_MS = 500;

/** Fly-off animation constants. */
const EXIT_X = 500;
const EXIT_ROTATION = 12;

/**
 * Stage containment arithmetic (2026-10-02 defect fix, DEFECT 2).
 *
 * The stage container carries a FIXED height that holds the FULL depth range:
 *
 *   full    520 + 250 + 20 = 790   (md+: 560 + 250 + 20 = 830)
 *   compact 420 + 250 + 20 = 690   (the <md surface)
 *
 * = the front card's own box + the deepest behind-card peek band + a safe
 * margin. PEEK_BAND_PX covers the LEVELS table's depth-5 magnitudes (|yUp|
 * 190, |yLeave| 246) rounded up to 250px, so a behind-card at any depth peeks
 * ABOVE the front card but never OUTSIDE the stage — no negative-space escape
 * upward; the bottom-anchored card box means none downward either.
 * PEEK_SAFE_PX covers the curated ±1° rotation and ±4px translateX overhang.
 *
 * The card box is BOTTOM-ANCHORED inside the stage (left/right/bottom 0) so
 * the card's own height stays decoupled from the band the peeks travel
 * through. `overflow-hidden` on the stage then clips the 500px swipe fly-off
 * and any rotation overhang, so no card can extend the layout — the stage
 * never adds scroll height to <main> or to the document. The bloom glow that
 * lands on the peeking cards lives INSIDE the band and survives the clip;
 * only the ≤4px outward side/bottom glow softens at the clip edge, which is
 * exactly the depth shading on the cards beneath the design needs.
 */
const PEEK_BAND_PX = 250;
const PEEK_SAFE_PX = 20;

/** The front card's own box per mode — unchanged geometry (520/560 / 420). */
const CARD_HEIGHT_CLASS: Record<SwipeMode, string> = {
  full: 'h-[520px] md:h-[560px]',
  compact: 'h-[420px]',
};

/** The stage's fixed height per mode = card + PEEK_BAND_PX + PEEK_SAFE_PX. */
const STAGE_HEIGHT_CLASS: Record<SwipeMode, string> = {
  full: 'h-[790px] md:h-[830px]',
  compact: 'h-[690px]',
};

/** Editorial-calm promotion transition when cards advance one depth level. */
const PROMOTE_TRANSITION = { duration: 0.25, ease: [0.25, 1, 0.5, 1] as const };

/** Token-driven monochrome colors for the generative visuals. */
function visualColors() {
  return {
    border: 'hsl(var(--border))',
    muted: 'hsl(var(--muted-foreground))',
    accent: 'hsl(var(--accent))',
    foreground: 'hsl(var(--foreground))',
    destructive: 'hsl(var(--destructive))',
    card: 'hsl(var(--card))',
  };
}

/** Header strip: name + optional year chip + tagline. */
function CardHeader({ project }: { project: ProjectEntry }) {
  const year = projectYear(project.date);
  const tagline = firstSentence(project.description, 120);
  return (
    <div className="relative z-20 border-t border-border bg-card p-3">
      <div className="flex items-baseline gap-2">
        <span className="min-w-0 text-sm font-medium text-foreground">
          {project.name}
        </span>
        {year && (
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {year}
          </span>
        )}
      </div>
      {tagline && (
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
          {tagline}
        </p>
      )}
    </div>
  );
}

/** Expanded panel on the active card only. */
function CardExpandedPanel({
  project,
  visible,
}: {
  project: ProjectEntry;
  visible: boolean;
}) {
  const description = firstSentence(project.description, 120);
  const technologies = projectTechnologies(project.description, 4);
  if (!visible) return null;
  return (
    <motion.div
      className="absolute inset-x-0 bottom-16 z-10 origin-bottom border-t border-border bg-card/95 p-3 backdrop-blur-sm"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
    >
      {description && (
        <p className="text-xs leading-relaxed text-foreground">{description}</p>
      )}
      {technologies.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-sm border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-xs font-medium text-accent ${RING_RECIPE}`}
          >
            View project
            <ArrowUpRight aria-hidden="true" className="h-3 w-3 shrink-0" />
          </a>
        )}
        {project.sourceUrl && project.sourceUrl !== project.link && (
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground ${RING_RECIPE}`}
          >
            Source
            <ArrowUpRight aria-hidden="true" className="h-3 w-3 shrink-0" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

/** DeepIndex: terminal / context-engine mock. */
function TerminalVisual() {
  const c = visualColors();
  return (
    <svg
      viewBox="0 0 200 150"
      className="h-full w-full"
      aria-hidden="true"
      style={{ background: c.card }}
    >
      <rect x="8" y="6" width="184" height="138" rx="6" fill="none" stroke={c.border} strokeWidth="1.5" />
      <circle cx="22" cy="18" r="3" fill={c.muted} />
      <circle cx="34" cy="18" r="3" fill={c.accent} />
      <circle cx="46" cy="18" r="3" fill={c.foreground} />
      <text x="18" y="42" fontSize="9" fontFamily="monospace" fill={c.foreground}>
        &gt; query_context
      </text>
      <rect x="96" y="35" width="6" height="10" fill={c.accent} className="blinking-cursor" />
      <text x="18" y="58" fontSize="8" fontFamily="monospace" fill={c.foreground}>
        index: 14 files, 312 entities
      </text>
      <text x="18" y="73" fontSize="8" fontFamily="monospace" fill={c.muted}>
        embedding: 384-dim dense
      </text>
      <text x="18" y="88" fontSize="8" fontFamily="monospace" fill={c.muted}>
        graph: 47 nodes linked
      </text>
      <text x="18" y="103" fontSize="8" fontFamily="monospace" fill={c.muted} opacity="0.6">
        cache: warm (SQLite)
      </text>
      <text x="18" y="118" fontSize="8" fontFamily="monospace" fill={c.muted} opacity="0.4">
        MCP server ready
      </text>
      <rect x="8" y="126" width="184" height="18" rx="3" fill="none" stroke={c.border} />
      <rect x="14" y="131" width="18" height="8" rx="1" fill={c.accent} opacity="0.7" />
      <rect x="36" y="131" width="18" height="8" rx="1" fill={c.muted} opacity="0.5" />
      <rect x="58" y="131" width="18" height="8" rx="1" fill={c.muted} opacity="0.3" />
      <text x="168" y="139" fontSize="7" fontFamily="monospace" fill={c.foreground}>
        READY
      </text>
    </svg>
  );
}

/** Clarif-AI: contract-analysis panel. */
function ContractVisual() {
  const c = visualColors();
  return (
    <svg
      viewBox="0 0 200 150"
      className="h-full w-full"
      aria-hidden="true"
      style={{ background: c.card }}
    >
      <rect x="16" y="8" width="168" height="134" rx="4" fill="none" stroke={c.border} />
      <rect x="24" y="16" width="100" height="6" rx="2" fill={c.foreground} opacity="0.8" />
      <rect x="24" y="28" width="152" height="2" rx="1" fill={c.border} />
      <rect x="24" y="36" width="120" height="3" rx="1" fill={c.muted} />
      <rect x="24" y="48" width="110" height="3" rx="1" fill={c.muted} />
      <rect x="24" y="60" width="130" height="3" rx="1" fill={c.muted} />
      <rect x="24" y="72" width="90" height="3" rx="1" fill={c.muted} />
      <rect x="24" y="84" width="125" height="3" rx="1" fill={c.muted} />
      <rect x="24" y="96" width="105" height="3" rx="1" fill={c.muted} />
      <rect x="22" y="58" width="3" height="9" rx="1" fill={c.accent} />
      <rect x="22" y="82" width="3" height="9" rx="1" fill={c.accent} />
      <polygon points="148,48 154,60 142,60" fill="none" stroke={c.destructive} strokeWidth="1.2" />
      <polygon points="148,84 154,96 142,96" fill="none" stroke={c.destructive} strokeWidth="1.2" />
      <rect x="166" y="34" width="10" height="10" rx="1" fill="none" stroke={c.border} />
      <rect x="166" y="50" width="10" height="10" rx="1" fill="none" stroke={c.border} />
      <path d="M168 54 L171 57 L175 51" stroke={c.accent} strokeWidth="1.2" fill="none" />
      <rect x="166" y="66" width="10" height="10" rx="1" fill="none" stroke={c.border} />
      <rect x="166" y="82" width="10" height="10" rx="1" fill="none" stroke={c.border} />
      <path d="M168 86 L171 89 L175 83" stroke={c.accent} strokeWidth="1.2" fill="none" />
      <rect x="166" y="98" width="10" height="10" rx="1" fill="none" stroke={c.border} />
    </svg>
  );
}

/** Generic architecture-glyph panel. */
function GlyphVisual() {
  const c = visualColors();
  return (
    <svg
      viewBox="0 0 200 150"
      className="h-full w-full"
      aria-hidden="true"
      style={{ background: c.card }}
    >
      <circle cx="50" cy="50" r="18" fill="none" stroke={c.foreground} strokeWidth="1.5" />
      <circle cx="150" cy="50" r="18" fill="none" stroke={c.foreground} strokeWidth="1.5" />
      <circle cx="100" cy="110" r="18" fill="none" stroke={c.accent} strokeWidth="1.5" />
      <line x1="64" y1="56" x2="136" y2="56" stroke={c.border} strokeWidth="1.2" />
      <line x1="60" y1="66" x2="92" y2="96" stroke={c.border} strokeWidth="1.2" />
      <line x1="140" y1="66" x2="108" y2="96" stroke={c.border} strokeWidth="1.2" />
      <rect x="44" y="44" width="12" height="12" rx="2" fill={c.muted} opacity="0.4" />
      <rect x="144" y="44" width="12" height="12" rx="2" fill={c.muted} opacity="0.4" />
      <rect x="94" y="104" width="12" height="12" rx="2" fill={c.accent} opacity="0.3" />
      <ellipse cx="100" cy="75" rx="70" ry="40" fill="none" stroke={c.border} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

/** Quality-report / metrics panel. */
function ReportVisual() {
  const c = visualColors();
  return (
    <svg
      viewBox="0 0 200 150"
      className="h-full w-full"
      aria-hidden="true"
      style={{ background: c.card }}
    >
      <rect x="14" y="10" width="52" height="30" rx="3" fill="none" stroke={c.border} />
      <rect x="22" y="16" width="28" height="4" rx="1" fill={c.foreground} />
      <rect x="22" y="24" width="36" height="3" rx="1" fill={c.muted} opacity="0.6" />
      <rect x="74" y="10" width="52" height="30" rx="3" fill="none" stroke={c.border} />
      <rect x="82" y="16" width="28" height="4" rx="1" fill={c.accent} />
      <rect x="82" y="24" width="36" height="3" rx="1" fill={c.muted} opacity="0.6" />
      <rect x="134" y="10" width="52" height="30" rx="3" fill="none" stroke={c.border} />
      <rect x="142" y="16" width="28" height="4" rx="1" fill={c.foreground} />
      <rect x="142" y="24" width="36" height="3" rx="1" fill={c.muted} opacity="0.6" />
      <rect x="18" y="54" width="20" height="50" rx="2" fill={c.muted} opacity="0.3" />
      <rect x="46" y="54" width="20" height="70" rx="2" fill={c.muted} opacity="0.5" />
      <rect x="74" y="54" width="20" height="40" rx="2" fill={c.accent} opacity="0.6" />
      <rect x="102" y="54" width="20" height="60" rx="2" fill={c.muted} opacity="0.4" />
      <rect x="130" y="54" width="20" height="45" rx="2" fill={c.muted} opacity="0.35" />
      <path d="M18 118 L60 108 L100 112 L140 102 L182 96" stroke={c.foreground} strokeWidth="1.5" fill="none" />
      <circle cx="18" cy="118" r="2" fill={c.foreground} />
      <circle cx="60" cy="108" r="2" fill={c.foreground} />
      <circle cx="100" cy="112" r="2" fill={c.foreground} />
      <circle cx="140" cy="102" r="2" fill={c.foreground} />
      <circle cx="182" cy="96" r="2" fill={c.accent} />
    </svg>
  );
}

/** KPI dashboard panel. */
function DashboardVisual() {
  const c = visualColors();
  return (
    <svg
      viewBox="0 0 200 150"
      className="h-full w-full"
      aria-hidden="true"
      style={{ background: c.card }}
    >
      <rect x="14" y="10" width="82" height="34" rx="3" fill="none" stroke={c.border} />
      <rect x="20" y="16" width="40" height="5" rx="1" fill={c.foreground} />
      <rect x="20" y="26" width="60" height="3" rx="1" fill={c.muted} opacity="0.5" />
      <rect x="104" y="10" width="82" height="34" rx="3" fill="none" stroke={c.border} />
      <rect x="110" y="16" width="40" height="5" rx="1" fill={c.accent} />
      <rect x="110" y="26" width="60" height="3" rx="1" fill={c.muted} opacity="0.5" />
      <rect x="14" y="52" width="82" height="34" rx="3" fill="none" stroke={c.border} />
      <rect x="20" y="58" width="40" height="5" rx="1" fill={c.foreground} />
      <rect x="20" y="68" width="60" height="3" rx="1" fill={c.muted} opacity="0.5" />
      <rect x="104" y="52" width="82" height="34" rx="3" fill="none" stroke={c.border} />
      <rect x="110" y="58" width="40" height="5" rx="1" fill={c.muted} />
      <rect x="110" y="68" width="60" height="3" rx="1" fill={c.muted} opacity="0.5" />
      <rect x="20" y="104" width="160" height="6" rx="3" fill={c.border} opacity="0.3" />
      <rect x="20" y="104" width="112" height="6" rx="3" fill={c.accent} opacity="0.7" />
      <rect x="20" y="118" width="160" height="6" rx="3" fill={c.border} opacity="0.3" />
      <rect x="20" y="118" width="80" height="6" rx="3" fill={c.foreground} opacity="0.5" />
      <rect x="20" y="132" width="160" height="6" rx="3" fill={c.border} opacity="0.3" />
      <rect x="20" y="132" width="48" height="6" rx="3" fill={c.muted} opacity="0.5" />
    </svg>
  );
}

/** Service topology / route network panel. */
function NetworkVisual() {
  const c = visualColors();
  return (
    <svg
      viewBox="0 0 200 150"
      className="h-full w-full"
      aria-hidden="true"
      style={{ background: c.card }}
    >
      <line x1="30" y1="40" x2="170" y2="40" stroke={c.border} strokeWidth="1.5" />
      <line x1="30" y1="75" x2="170" y2="75" stroke={c.border} strokeWidth="1.5" />
      <line x1="30" y1="110" x2="170" y2="110" stroke={c.border} strokeWidth="1.5" />
      <line x1="60" y1="40" x2="60" y2="110" stroke={c.border} strokeWidth="1.5" />
      <line x1="100" y1="40" x2="100" y2="110" stroke={c.border} strokeWidth="1.5" />
      <line x1="140" y1="40" x2="140" y2="110" stroke={c.border} strokeWidth="1.5" />
      <path d="M30 75 L60 75 L60 110 L100 110 L100 40 L170 40" stroke={c.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="60" cy="75" r="5" fill={c.card} stroke={c.foreground} strokeWidth="1.5" />
      <circle cx="100" cy="110" r="5" fill={c.card} stroke={c.foreground} strokeWidth="1.5" />
      <circle cx="100" cy="40" r="5" fill={c.card} stroke={c.foreground} strokeWidth="1.5" />
      <circle cx="170" cy="40" r="5" fill={c.accent} stroke={c.foreground} strokeWidth="1.5" />
      <path d="M150 115 L155 130 L145 130 Z" fill={c.accent} opacity="0.6" />
      <circle cx="150" cy="110" r="5" fill="none" stroke={c.foreground} strokeWidth="1.2" />
      <circle cx="175" cy="115" r="10" fill="none" stroke={c.muted} />
      <path d="M175 109 L178 115 L175 121 L172 115 Z" fill={c.muted} opacity="0.5" />
    </svg>
  );
}

/** Renders the deterministic monochrome visual keyed by project name. */
function GenerativeVisual({ projectName }: { projectName: string }) {
  const variant = projectVisualVariant(projectName);
  switch (variant) {
    case 'terminal-mock':
      return <TerminalVisual />;
    case 'contract-analysis':
      return <ContractVisual />;
    case 'glyph':
      return <GlyphVisual />;
    case 'report':
      return <ReportVisual />;
    case 'dashboard':
      return <DashboardVisual />;
    case 'network':
      return <NetworkVisual />;
    default:
      return <GlyphVisual />;
  }
}

interface SwipeCardProps {
  project: ProjectEntry;
  index: number;
  count: number;
  frontIndex: number;
  mode: SwipeMode;
  reducedMotion: boolean;
  pendingSwipe: SwipeDirection | null;
  onSwipe: (direction: SwipeDirection) => void;
}

/** A single swipeable stack card. */
function SwipeCard({
  project,
  index,
  count,
  frontIndex,
  mode,
  reducedMotion,
  pendingSwipe,
  onSwipe,
}: SwipeCardProps) {
  const controls = useAnimationControls();
  const isFront = index === frontIndex;
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const hasMounted = useRef(false);

  const depth = useMemo(
    () => ((index - frontIndex) % count + count) % count,
    [index, frontIndex, count],
  );
  const compactHidden = mode === 'compact' && depth > 1;
  const state = useMemo(
    () => cardState(index, frontIndex, count, reducedMotion),
    [index, frontIndex, count, reducedMotion],
  );

  const initialTarget = useMemo(
    () => ({
      x: state.translateX,
      y: state.translateY,
      scale: state.scale,
      rotate: state.rotation,
      opacity: compactHidden ? 0 : state.opacity,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const performExit = async (direction: SwipeDirection) => {
    setIsExiting(true);
    await controls.start({
      x: direction * EXIT_X,
      rotate: direction * EXIT_ROTATION,
      opacity: 0,
      transition: { duration: 0.22, ease: 'easeOut' },
    });
    const newFront = (frontIndex + direction + count) % count;
    const nextState = cardState(index, newFront, count, reducedMotion);
    const nextHidden =
      mode === 'compact' && ((index - newFront + count) % count) > 1;
    controls.set({
      x: nextState.translateX,
      y: nextState.translateY,
      scale: nextState.scale,
      rotate: nextState.rotation,
      opacity: nextHidden ? 0 : nextState.opacity,
    });
    setIsExiting(false);
    onSwipe(direction);
  };

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (isExiting || (isFront && isDragging)) return;
    const target = cardState(index, frontIndex, count, reducedMotion);
    const hidden = mode === 'compact' && depth > 1;
    controls.start({
      x: target.translateX,
      y: target.translateY,
      scale: target.scale,
      rotate: target.rotation,
      opacity: hidden ? 0 : target.opacity,
      transition: hidden ? { duration: 0 } : PROMOTE_TRANSITION,
    });
  }, [frontIndex, reducedMotion, mode, count, isExiting, isDragging, isFront, controls, index, depth]);

  useEffect(() => {
    if (pendingSwipe === null || !isFront || reducedMotion || isExiting) return;
    performExit(pendingSwipe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSwipe, isFront, reducedMotion, isExiting]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const accepted = swipeAccepts(info.offset.x, info.velocity.x);
    if (accepted !== 0) {
      performExit(accepted);
      return;
    }
    const target = cardState(index, frontIndex, count, reducedMotion);
    controls.start({
      x: target.translateX,
      y: target.translateY,
      scale: target.scale,
      rotate: target.rotation,
      opacity: compactHidden ? 0 : target.opacity,
      transition: { type: 'spring', stiffness: 500, damping: 30 },
    });
  };

  const visibility = compactHidden || !state.visible ? 'hidden' : 'visible';

  return (
    <motion.div
      className={`${CARD_SHELL} ${CARD_HEIGHT_CLASS[mode]} ${isFront ? 'overflow-visible' : 'pointer-events-none overflow-hidden'}`}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: state.zIndex,
        visibility,
        boxShadow: isFront ? 'var(--panel-shadow-hover)' : undefined,
      }}
      initial={initialTarget}
      animate={controls}
      drag={isFront && !reducedMotion ? 'x' : false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      aria-hidden={isFront ? undefined : 'true'}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <GenerativeVisual projectName={project.name} />
      </div>
      <CardExpandedPanel project={project} visible={isFront} />
      <CardHeader project={project} />
    </motion.div>
  );
}

interface ProjectsSwipeStackProps {
  projects: ProjectEntry[];
  mode: SwipeMode;
}

/** Generic swipe stack: full (md+) or compact (mobile). */
export function ProjectsSwipeStack({ projects, mode }: ProjectsSwipeStackProps) {
  const count = projects.length;
  const [mounted, setMounted] = useState(false);
  const prefersReduced = useReducedMotion() ?? false;
  // Why the gate: framer's useReducedMotion hook initialises from matchMedia
  // on the first client render (node_modules/framer-motion/dist/es/utils/
  // reduced-motion/use-reduced-motion.mjs uses useState(prefersReducedMotion
  // .current)) while the server render always resolves false, so consuming
  // the raw value would make the first client render differ from the SSR
  // markup (hydration style mismatch + first-paint flash). The mounted flag
  // keeps the first client render identical to the server's and applies the
  // RM contract immediately after mount.
  const reducedMotion = mounted ? prefersReduced : false;
  const [frontIndex, setFrontIndex] = useState(0);
  const [pendingSwipe, setPendingSwipe] = useState<SwipeDirection | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const lastAnnouncementRef = useRef(0);

  useEffect(() => {
    const now = Date.now();
    if (now - lastAnnouncementRef.current >= ANNOUNCEMENT_THROTTLE_MS) {
      lastAnnouncementRef.current = now;
      const project = projects[frontIndex];
      setAnnouncement(
        project
          ? `Project ${String(frontIndex + 1).padStart(2, '0')} of ${String(count).padStart(2, '0')}: ${project.name}`
          : '',
      );
    }
  }, [frontIndex, count, projects]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSwipe = (direction: SwipeDirection) => {
    setFrontIndex((i) => (i + direction + count) % count);
    setPendingSwipe(null);
  };

  const cycle = (direction: SwipeDirection) => {
    if (reducedMotion) {
      handleSwipe(direction);
      return;
    }
    if (pendingSwipe !== null) return;
    setPendingSwipe(direction);
  };

  const goTo = (target: number) => {
    setFrontIndex(Math.min(Math.max(target, 0), count - 1));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let handled = false;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      cycle(1); // Previous: right-fly-off, back card forward.
      handled = true;
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      cycle(-1); // Next: left-fly-off, front card to back.
      handled = true;
    } else if (event.key === 'Home') {
      goTo(0);
      handled = true;
    } else if (event.key === 'End') {
      goTo(count - 1);
      handled = true;
    }
    if (handled) event.preventDefault();
  };

  if (count <= 1) {
    const project = projects[0];
    return (
      <div
        className="flex h-full flex-col justify-center"
        role="group"
        aria-label="Projects carousel"
      >
        <div
          className={`${CARD_SHELL} overflow-visible`}
          style={{ boxShadow: 'var(--panel-shadow-hover)' }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <GenerativeVisual projectName={project.name} />
          </div>
          <CardExpandedPanel project={project} visible />
          <CardHeader project={project} />
        </div>
      </div>
    );
  }

  const stageHeightClass = STAGE_HEIGHT_CLASS[mode];
  const widthClass = mode === 'full' ? 'max-w-[540px]' : 'max-w-[320px]';

  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center"
      role="group"
      aria-label="Projects carousel"
      onKeyDown={handleKeyDown}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <div className={`relative mx-auto w-full ${widthClass} ${stageHeightClass} overflow-hidden`}>
        {projects.map((project, index) => (
          <SwipeCard
            key={project.name}
            project={project}
            index={index}
            count={count}
            frontIndex={frontIndex}
            mode={mode}
            reducedMotion={reducedMotion}
            pendingSwipe={pendingSwipe}
            onSwipe={handleSwipe}
          />
        ))}
      </div>
      <div className="shrink-0">
        <div className="flex items-center justify-center gap-2 py-2">
          <button
            type="button"
            aria-label="Previous project"
            onClick={() => cycle(1)}
            className={`inline-flex h-[44px] min-w-[44px] items-center justify-center text-muted-foreground transition-colors ${GHOST_INTERACTION}`}
          >
            <ChevronUp aria-hidden="true" className="h-4 w-4" />
          </button>
          <span className="min-w-[3.5rem] text-center font-mono text-[10px] tabular-nums text-muted-foreground">
            {String(frontIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          <button
            type="button"
            aria-label="Next project"
            onClick={() => cycle(-1)}
            className={`inline-flex h-[44px] min-w-[44px] items-center justify-center text-accent transition-colors ${GHOST_INTERACTION}`}
          >
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** The md+ full-mode stage export. */
export function ProjectsStackStage({ projects }: { projects: ProjectEntry[] }) {
  return <ProjectsSwipeStack projects={projects} mode="full" />;
}
