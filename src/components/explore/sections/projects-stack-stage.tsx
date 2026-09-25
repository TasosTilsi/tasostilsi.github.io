'use client';

/**
 * ProjectsStackStage — the phase's ONLY framer-motion import site (D-06,
 * UI-SPEC §9): the md+ scroll-driven stacked-card carousel for the Projects
 * panel. Replaces the phase-9 editorial rows.
 *
 * Architecture (RESEARCH P1 / W-12): the outer component is the SSR surface.
 * It renders the constant progress-0 stack with plain elements until BOTH the
 * `.explore-shell > main` scroll container and the `closest('[data-editorial-wrapper]')`
 * wrapper are discovered in a mount effect. useScroll throws if its refs start
 * undefined and permanently caches a bad fallback, so the motion Inner is never
 * rendered pre-discovery, and the discovered elements are handed over as ref
 * INITIAL VALUES (already hydrated; no framer effect sees a pending ref).
 *
 * Motion contract (UI-SPEC §3): ONE scrollYProgress MotionValue from useScroll
 * over the wrapper's 300vh range with offset ['start start', 'end end']. Per-card
 * useTransform consumes the pure cardState(cardIndex, carouselProgress, count, rm)
 * module — the motion channel never inlines stack math. No springs, no bounce,
 * no snap points, no wheel/touch listeners (D-05: the single scroll source stays
 * .explore-shell > main).
 *
 * A11y (UI-SPEC §7): the stack is a role="group" aria-label="Projects carousel".
 * ALL non-active cards are aria-hidden="true" regardless of opacity; only the
 * rounded activeIndex card exposes its link(s) to tab order. The expanded info
 * panel renders only on the active card. An aria-live="polite" region announces
 * the active project name, throttled to one announcement per 500ms.
 *
 * Interaction (UI-SPEC §5): Prev/Next 44px ghost buttons and Arrow keys step the
 * carousel by scrolling the main container to the target band. Home/End jump to
 * first/last. Only handled keys call preventDefault.
 *
 * Reduced motion: useReducedMotion() is passed to cardState and gates scroll
 * behavior; CSS guard suppresses stray transitions.
 *
 * Resize (UI-SPEC §6.3/§8): a ResizeObserver on the wrapper remeasures
 * wrapper offsetTop/offsetHeight and main clientHeight on resize; a window
 * resize fallback covers older environments. Cleanup removes both.
 */
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';
import {
  cardState,
  firstSentence,
  projectTechnologies,
  projectYear,
  projectVisualVariant,
} from '../projects-card-state';
import type { PortfolioData } from '@/data/portfolio-main-data';

type ProjectEntry = PortfolioData['projects'][number];

const MAIN_SELECTOR = '.explore-shell > main';
const WRAPPER_SELECTOR = '[data-editorial-wrapper]';

/** Card shell classes reused by SSR and motion stacks. */
const CARD_SHELL =
  'w-full max-w-[540px] max-h-full aspect-[4/3] rounded-lg border border-border bg-card mx-auto relative overflow-hidden';

/** Focus ring recipe for the active-card link (W-13: no exp-lift on cards). */
const RING_RECIPE =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** The 44px ghost-button interaction recipe from the Experience stage. */
const GHOST_INTERACTION =
  'rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';

/** Throttle window for the aria-live active-card announcement. */
const ANNOUNCEMENT_THROTTLE_MS = 500;

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

/** Expanded panel on the active card only: description, chips, links. */
function CardExpandedPanel({
  project,
  activeAmount,
  visible,
}: {
  project: ProjectEntry;
  activeAmount: MotionValue<number>;
  visible: boolean;
}) {
  const description = firstSentence(project.description, 120);
  const technologies = projectTechnologies(project.description, 4);
  const opacity = useTransform(activeAmount, (v) => v);
  const scaleY = useTransform(activeAmount, (v) => v);
  const translateY = useTransform(activeAmount, (v) => (1 - v) * 8);

  if (!visible) return null;

  return (
    <motion.div
      className="absolute inset-x-0 bottom-16 z-10 origin-bottom border-t border-border bg-card/95 p-3 backdrop-blur-sm"
      style={{
        opacity,
        scaleY,
        translateY,
      }}
    >
      {description && (
        <p className="text-xs leading-relaxed text-foreground">
          {description}
        </p>
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
      {/* title bar dots */}
      <circle cx="22" cy="18" r="3" fill={c.muted} />
      <circle cx="34" cy="18" r="3" fill={c.accent} />
      <circle cx="46" cy="18" r="3" fill={c.foreground} />
      {/* prompt lines */}
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
      {/* status bar */}
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
      {/* clause rows */}
      <rect x="24" y="36" width="120" height="3" rx="1" fill={c.muted} />
      <rect x="24" y="48" width="110" height="3" rx="1" fill={c.muted} />
      <rect x="24" y="60" width="130" height="3" rx="1" fill={c.muted} />
      <rect x="24" y="72" width="90" height="3" rx="1" fill={c.muted} />
      <rect x="24" y="84" width="125" height="3" rx="1" fill={c.muted} />
      <rect x="24" y="96" width="105" height="3" rx="1" fill={c.muted} />
      {/* accent-flagged clauses */}
      <rect x="22" y="58" width="3" height="9" rx="1" fill={c.accent} />
      <rect x="22" y="82" width="3" height="9" rx="1" fill={c.accent} />
      {/* warning triangles */}
      <polygon points="148,48 154,60 142,60" fill="none" stroke={c.destructive} strokeWidth="1.2" />
      <polygon points="148,84 154,96 142,96" fill="none" stroke={c.destructive} strokeWidth="1.2" />
      {/* checklist column */}
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
      {/* orbit ring */}
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
      {/* header tiles */}
      <rect x="14" y="10" width="52" height="30" rx="3" fill="none" stroke={c.border} />
      <rect x="22" y="16" width="28" height="4" rx="1" fill={c.foreground} />
      <rect x="22" y="24" width="36" height="3" rx="1" fill={c.muted} opacity="0.6" />
      <rect x="74" y="10" width="52" height="30" rx="3" fill="none" stroke={c.border} />
      <rect x="82" y="16" width="28" height="4" rx="1" fill={c.accent} />
      <rect x="82" y="24" width="36" height="3" rx="1" fill={c.muted} opacity="0.6" />
      <rect x="134" y="10" width="52" height="30" rx="3" fill="none" stroke={c.border} />
      <rect x="142" y="16" width="28" height="4" rx="1" fill={c.foreground} />
      <rect x="142" y="24" width="36" height="3" rx="1" fill={c.muted} opacity="0.6" />
      {/* bars */}
      <rect x="18" y="54" width="20" height="50" rx="2" fill={c.muted} opacity="0.3" />
      <rect x="46" y="54" width="20" height="70" rx="2" fill={c.muted} opacity="0.5" />
      <rect x="74" y="54" width="20" height="40" rx="2" fill={c.accent} opacity="0.6" />
      <rect x="102" y="54" width="20" height="60" rx="2" fill={c.muted} opacity="0.4" />
      <rect x="130" y="54" width="20" height="45" rx="2" fill={c.muted} opacity="0.35" />
      {/* trend line */}
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
      {/* kpi grid */}
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
      {/* bar indicators */}
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
      {/* route lines */}
      <line x1="30" y1="40" x2="170" y2="40" stroke={c.border} strokeWidth="1.5" />
      <line x1="30" y1="75" x2="170" y2="75" stroke={c.border} strokeWidth="1.5" />
      <line x1="30" y1="110" x2="170" y2="110" stroke={c.border} strokeWidth="1.5" />
      <line x1="60" y1="40" x2="60" y2="110" stroke={c.border} strokeWidth="1.5" />
      <line x1="100" y1="40" x2="100" y2="110" stroke={c.border} strokeWidth="1.5" />
      <line x1="140" y1="40" x2="140" y2="110" stroke={c.border} strokeWidth="1.5" />
      {/* highlighted route */}
      <path d="M30 75 L60 75 L60 110 L100 110 L100 40 L170 40" stroke={c.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* nodes */}
      <circle cx="60" cy="75" r="5" fill={c.card} stroke={c.foreground} strokeWidth="1.5" />
      <circle cx="100" cy="110" r="5" fill={c.card} stroke={c.foreground} strokeWidth="1.5" />
      <circle cx="100" cy="40" r="5" fill={c.card} stroke={c.foreground} strokeWidth="1.5" />
      <circle cx="170" cy="40" r="5" fill={c.accent} stroke={c.foreground} strokeWidth="1.5" />
      {/* pin glyph */}
      <path d="M150 115 L155 130 L145 130 Z" fill={c.accent} opacity="0.6" />
      <circle cx="150" cy="110" r="5" fill="none" stroke={c.foreground} strokeWidth="1.2" />
      {/* compass */}
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

/** The SSR stack renders all cards at carouselProgress = 0 so the foreground
 *  DeepIndex card is real text/markup before hydration. */
function SsrStack({ projects }: { projects: ProjectEntry[] }) {
  return (
    <div className="flex h-full flex-col justify-center" role="group" aria-label="Projects carousel">
      <div className="relative mx-auto w-full max-w-[540px]">
        {projects.map((project, index) => {
          const st = cardState(index, 0, projects.length, false);
          return (
            <div
              key={project.name}
              className={CARD_SHELL}
              style={{
                position: 'absolute',
                inset: 0,
                transform: `translateY(${st.translateY}px) translateX(${st.translateX}px) scale(${st.scale}) rotate(${st.rotation}deg)`,
                opacity: st.opacity,
                zIndex: st.zIndex,
                visibility: st.visible ? 'visible' : 'hidden',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <GenerativeVisual projectName={project.name} />
              </div>
              <CardHeader project={project} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface InnerProps {
  mainEl: HTMLElement;
  wrapperEl: HTMLElement;
  projects: ProjectEntry[];
}

/** The hydrated motion composition. Cards derive continuously from cardState. */
function Inner({ mainEl, wrapperEl, projects }: InnerProps) {
  const containerRef = useRef<HTMLElement>(mainEl);
  const targetRef = useRef<HTMLElement>(wrapperEl);
  const reducedMotion = useReducedMotion() ?? false;
  const cards = projects;
  const count = cards.length;

  const progress = useScroll({
    container: containerRef,
    target: targetRef,
    offset: ['start start', 'end end'],
  }).scrollYProgress;
  const fullActive = useMotionValue(1);

  // Active index derived from the single continuous progress value.
  const activeIndexValue = useTransform(progress, (p) => Math.round((count - 1) * p));
  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(activeIndexValue, 'change', (latest) => {
    const next = Math.round(latest);
    if (next !== activeIndex) setActiveIndex(next);
  });

  // Throttled aria-live announcement.
  const [announcement, setAnnouncement] = useState('');
  const lastAnnouncementRef = useRef(0);
  useEffect(() => {
    const now = Date.now();
    if (now - lastAnnouncementRef.current >= ANNOUNCEMENT_THROTTLE_MS) {
      lastAnnouncementRef.current = now;
      const project = projects[activeIndex];
      setAnnouncement(
        project
          ? `Project ${String(activeIndex + 1).padStart(2, '0')} of ${String(count).padStart(2, '0')}: ${project.name}`
          : '',
      );
    }
  }, [activeIndex, count, projects]);

  // Geometry refs for keyboard stepping; updated by ResizeObserver + fallback.
  const geometryRef = useRef({
    wrapperTop: wrapperEl.offsetTop,
    wrapperHeight: wrapperEl.offsetHeight,
    mainHeight: mainEl.clientHeight,
  });
  const [, setGeometryTick] = useState(0);

  useEffect(() => {
    const measure = () => {
      geometryRef.current = {
        wrapperTop: wrapperEl.offsetTop,
        wrapperHeight: wrapperEl.offsetHeight,
        mainHeight: mainEl.clientHeight,
      };
      setGeometryTick((n) => n + 1);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapperEl);
    observer.observe(mainEl);
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [mainEl, wrapperEl]);

  const goToCard = (targetIndex: number) => {
    const target = Math.min(Math.max(targetIndex, 0), count - 1);
    const { wrapperTop, wrapperHeight, mainHeight } = geometryRef.current;
    const targetProgress = target / (count - 1);
    const scrollable = wrapperHeight - mainHeight;
    const targetScrollTop = wrapperTop + targetProgress * scrollable;
    const behavior = reducedMotion ? 'auto' : 'smooth';
    const main = mainEl;
    main.scrollTo({ top: targetScrollTop, behavior });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let handled = false;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      goToCard(activeIndex - 1);
      handled = true;
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      goToCard(activeIndex + 1);
      handled = true;
    } else if (event.key === 'Home') {
      goToCard(0);
      handled = true;
    } else if (event.key === 'End') {
      goToCard(count - 1);
      handled = true;
    }
    if (handled) event.preventDefault();
  };

  if (cards.length <= 1) {
    const project = cards[0];
    return (
      <div
        className="flex h-full flex-col justify-center"
        role="group"
        aria-label="Projects carousel"
      >
        <div className={CARD_SHELL}>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <GenerativeVisual projectName={project.name} />
          </div>
          <CardExpandedPanel project={project} activeAmount={fullActive} visible />
          <CardHeader project={project} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-full flex-col"
      role="group"
      aria-label="Projects carousel"
      onKeyDown={handleKeyDown}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <div className="relative flex-1">
        <div className="relative mx-auto h-full w-full max-w-[540px]">
          {projects.map((project, index) => (
            <MotionCard
              key={project.name}
              project={project}
              index={index}
              count={count}
              progress={progress}
              reducedMotion={reducedMotion}
              isActive={activeIndex === index}
            />
          ))}
        </div>
      </div>
      <div className="shrink-0">
        <div className="flex items-center justify-center gap-2 py-2">
          <button
            type="button"
            aria-label="Previous project"
            disabled={activeIndex <= 0}
            onClick={() => goToCard(activeIndex - 1)}
            className={`inline-flex h-[44px] min-w-[44px] items-center justify-center text-muted-foreground transition-colors disabled:opacity-50 ${GHOST_INTERACTION}`}
          >
            <ChevronUp aria-hidden="true" className="h-4 w-4" />
          </button>
          <span className="min-w-[3.5rem] text-center font-mono text-[10px] tabular-nums text-muted-foreground">
            {String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
          <button
            type="button"
            aria-label="Next project"
            disabled={activeIndex >= count - 1}
            onClick={() => goToCard(activeIndex + 1)}
            className={`inline-flex h-[44px] min-w-[44px] items-center justify-center text-accent transition-colors disabled:opacity-50 ${GHOST_INTERACTION}`}
          >
            <ChevronDown aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MotionCardProps {
  project: ProjectEntry;
  index: number;
  count: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
  isActive: boolean;
}

function MotionCard({ project, index, count, progress, reducedMotion, isActive }: MotionCardProps) {
  const transform = useTransform(progress, (p) => {
    const st = cardState(index, p, count, reducedMotion);
    return `translateY(${st.translateY}px) translateX(${st.translateX}px) scale(${st.scale}) rotate(${st.rotation}deg)`;
  });
  const opacity = useTransform(progress, (p) => cardState(index, p, count, reducedMotion).opacity);
  const zIndex = useTransform(progress, (p) => cardState(index, p, count, reducedMotion).zIndex);
  const visibility = useTransform(progress, (p) => (cardState(index, p, count, reducedMotion).visible ? 'visible' : 'hidden'));
  const activeAmount = useTransform(progress, (p) => cardState(index, p, count, reducedMotion).activeAmount);

  return (
    <motion.div
      className={`${CARD_SHELL} ${isActive ? '' : 'pointer-events-none'}`}
      style={{
        position: 'absolute',
        inset: 0,
        transform,
        opacity,
        zIndex,
        visibility,
      }}
      aria-hidden={isActive ? undefined : 'true'}
    >
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <GenerativeVisual projectName={project.name} />
      </div>
      <CardExpandedPanel project={project} activeAmount={activeAmount} visible={isActive} />
      <CardHeader project={project} />
    </motion.div>
  );
}

/** The ProjectsStackStage export: SSR surface + mount gate. */
export function ProjectsStackStage({ projects }: { projects: ProjectEntry[] }) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [scrollElements, setScrollElements] = useState<{
    main: HTMLElement;
    wrapper: HTMLElement;
  } | null>(null);

  useEffect(() => {
    const main = document.querySelector<HTMLElement>(MAIN_SELECTOR);
    const wrapper = stageRef.current?.closest<HTMLElement>(WRAPPER_SELECTOR) ?? null;
    if (main && wrapper) setScrollElements({ main, wrapper });
  }, []);

  return (
    <div ref={stageRef} className="h-full">
      {scrollElements ? (
        <Inner
          mainEl={scrollElements.main}
          wrapperEl={scrollElements.wrapper}
          projects={projects}
        />
      ) : (
        <SsrStack projects={projects} />
      )}
    </div>
  );
}
