'use client';

/**
 * ProjectsEditorialStage — the phase's ONLY framer-motion import site (D-05,
 * UI-SPEC §4.3): the md+ editorial scroll composition (REV-17) rendered by
 * the server ProjectsSection panel inside its rows viewport.
 *
 * Architecture (RESEARCH P1 — the verified useScroll container trap): the
 * outer component is the SSR surface — it renders the §4.4 constant
 * progress-0 row stack (row 0 real text; rows 1–5 parked at +H, opacity 0,
 * visibility hidden, aria-hidden) with plain elements until BOTH scroll
 * elements are discovered in a mount effect: the container via
 * document.querySelector('.explore-shell > main') (the MAIN_SELECTOR
 * precedent — window scroll is always 0 inside the shell, so a window
 * fallback would permanently mistrack) and the target via
 * closest('[data-editorial-wrapper]'). useScroll throws an invariant on a
 * still-pending ref and permanently caches a window fallback when the
 * container is undefined — so the Inner child is NEVER rendered while
 * either element is missing, and the discovered elements are handed over as
 * ref INITIAL VALUES (already hydrated; no framer effect ever sees a
 * pending ref).
 *
 * Motion contract (§4.3, D-04 — Editorial-calm): ONE progress MotionValue
 * (useScroll over the wrapper's 300vh range, offset ['start start',
 * 'end end']); per-row useTransform consumes the pure rowState module —
 * the motion channel never inlines row math; NO springs, no bounce, no
 * snap points, no wheel or touch listeners anywhere (the single scroll source
 * stays .explore-shell > main, D-05). The discrete a11y channel
 * (aria-hidden/visibility at |d| ≥ 1) rides React state written ONLY on
 * discrete visible-row-set changes via useMotionValueEvent (the phase-8
 * "React state only on discrete change" contract carried over); no
 * aria-live on this stage (§8). Reduced motion (useReducedMotion) → y ≡ 0,
 * opacity-only swaps, the sticky range retained. Hover/focus on linked
 * rows is color-only — NO exp-lift (P5: the transform channel is owned by
 * the motion system).
 *
 * H (the §4.3 motion constant) is the MEASURED height of the stage root
 * (getBoundingClientRect on mount + on resize via a ResizeObserver — U-14),
 * falling back to the §4.3 pre-measurement constant (480) pre-measurement
 * and treating height ≤ 0 as non-measurable (the display:none rows
 * viewport below md keeps y at 0 — no NaN styles reach the hidden
 * subtree).
 */
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { firstSentence, rowState, rowYear } from '../projects-row-state';
import type { PortfolioData } from '@/data/portfolio-main-data';

type ProjectEntry = PortfolioData['projects'][number];

/** The ONLY scroll source — the explore main scroll container (never window). */
const MAIN_SELECTOR = '.explore-shell > main';
/** The stage's scroll target — the wrapper div explore-panels stamps (R-3: no id). */
const WRAPPER_SELECTOR = '[data-editorial-wrapper]';
/** §4.3 pre-measurement fallback height (U-14/U-15 guard). */
const H_FALLBACK = 480;
/** Ring recipe on linked row blocks (the W-2 card vocabulary). */
const RING_RECIPE =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background';
/** §4.2 row block: the border-t divider is part of the block and rides its
 * transform/opacity (uniform ruling, row 0 included); stacked on the md grid. */
const ROW_CLASS = 'block border-t border-border pt-4 md:col-start-1 md:row-start-1';

/** §4.2 row content shared by the SSR fallback rows and the motion rows. */
function RowBody({ project }: { project: ProjectEntry }) {
  const year = rowYear(project.date);
  return (
    <>
      <div className="flex items-baseline gap-3">
        <span
          aria-hidden="true"
          className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground"
        >
          {year ?? '—'}
        </span>
        {project.link ? (
          <span className="flex min-w-0 items-center gap-1 text-base font-medium text-foreground transition-colors duration-200 ease-out group-hover:text-accent group-focus-visible:text-accent">
            {project.name}
            <ArrowUpRight
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 transition-colors duration-200 ease-out group-hover:text-accent group-focus-visible:text-accent"
            />
          </span>
        ) : (
          <span className="min-w-0 text-base font-medium text-foreground">
            {project.name}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {firstSentence(project.description, 120)}
      </p>
    </>
  );
}

/** The §4.4 SSR row stack: constant styles from rowState at progress 0 —
 * row 0 real text, rows 1+ parked below and excluded from a11y/tab order. */
function SsrRowStack({ projects }: { projects: ProjectEntry[] }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="md:grid">
        {projects.map((project, index) => {
          const at = rowState(index, 0, projects.length, H_FALLBACK, false);
          const hidden = index !== 0;
          const body = <RowBody project={project} />;
          return project.link ? (
            <a
              key={project.name}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`group ${ROW_CLASS} ${RING_RECIPE}`}
              aria-hidden={hidden || undefined}
              style={{
                opacity: at.opacity,
                transform: `translateY(${at.y}px)`,
                visibility: at.visible ? 'visible' : 'hidden',
              }}
            >
              {body}
            </a>
          ) : (
            <div
              key={project.name}
              className={ROW_CLASS}
              aria-hidden={hidden || undefined}
              style={{
                opacity: at.opacity,
                transform: `translateY(${at.y}px)`,
                visibility: at.visible ? 'visible' : 'hidden',
              }}
            >
              {body}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Discrete visible-row set at a progress value — derives THROUGH the pure
 * module (the motion channel never inlines row math). */
function computeVisibleRows(progress: number, count: number): number[] {
  const rows: number[] = [];
  for (let index = 0; index < count; index++) {
    if (rowState(index, progress, count, H_FALLBACK, false).visible) {
      rows.push(index);
    }
  }
  return rows;
}

interface InnerProps {
  mainEl: HTMLElement;
  wrapperEl: HTMLElement;
  projects: ProjectEntry[];
}

/** The discovered, hydration-safe motion composition. Rendered only after
 * the mount gate resolved both elements (the P1 hard rule). */
function Inner({ mainEl, wrapperEl, projects }: InnerProps) {
  // Ref INITIAL VALUES are hydrated elements — no framer effect ever sees
  // a pending ref (the P1 trap is unreachable by construction).
  const containerRef = useRef<HTMLElement>(mainEl);
  const targetRef = useRef<HTMLElement>(wrapperEl);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState(H_FALLBACK);
  const reducedMotion = useReducedMotion() ?? false;
  const count = projects.length;
  // The ONE progress source (D-04): a single MotionValue 0→1 across the
  // wrapper's 300vh range — continuous interpolation, no discrete thresholds.
  const progress = useScroll({
    container: containerRef,
    target: targetRef,
    offset: ['start start', 'end end'],
  }).scrollYProgress;
  // Discrete a11y channel: React state ONLY on visible-row-set changes.
  const [visibleRows, setVisibleRows] = useState<number[]>(() =>
    computeVisibleRows(progress.get(), count),
  );
  const visibleRowsRef = useRef(visibleRows);
  useMotionValueEvent(progress, 'change', (latest) => {
    const next = computeVisibleRows(latest, count);
    const prev = visibleRowsRef.current;
    if (next.length !== prev.length || next.some((v, i) => v !== prev[i])) {
      visibleRowsRef.current = next;
      setVisibleRows(next);
    }
  });
  // U-14: measure the stage root once + on resize (the rows viewport's
  // explicit height box); a 0-height read (display:none below md) is
  // ignored — rowState's H ≤ 0 totality keeps y at 0 either way.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const h = el.getBoundingClientRect().height;
      if (Number.isFinite(h) && h > 0) setHeight(h);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={stageRef} className="h-full">
      <div className="flex h-full flex-col justify-center">
        <div className="md:grid">
          {projects.map((project, index) => (
            <MotionRow
              key={project.name}
              project={project}
              index={index}
              count={count}
              progress={progress}
              height={height}
              reducedMotion={reducedMotion}
              visible={visibleRows.includes(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface MotionRowProps {
  project: ProjectEntry;
  index: number;
  count: number;
  progress: MotionValue<number>;
  height: number;
  reducedMotion: boolean;
  visible: boolean;
}

/** One motion row: the per-row useTransform pair consumes the pure
 * rowState (the single derivation source); visibility/aria-hidden ride the
 * discrete channel, y/opacity the continuous MotionValues. */
function MotionRow({
  project,
  index,
  count,
  progress,
  height,
  reducedMotion,
  visible,
}: MotionRowProps) {
  const y = useTransform(progress, (p) =>
    rowState(index, p, count, height, reducedMotion).y,
  );
  const opacity = useTransform(progress, (p) =>
    rowState(index, p, count, height, reducedMotion).opacity,
  );
  const body = <RowBody project={project} />;
  return project.link ? (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`group ${ROW_CLASS} ${RING_RECIPE}`}
      style={{ y, opacity, visibility: visible ? 'visible' : 'hidden' }}
      aria-hidden={!visible}
    >
      {body}
    </motion.a>
  ) : (
    <motion.div
      className={ROW_CLASS}
      style={{ y, opacity, visibility: visible ? 'visible' : 'hidden' }}
      aria-hidden={!visible}
    >
      {body}
    </motion.div>
  );
}

/**
 * ProjectsEditorialStage — the SSR surface + the mount gate. Pre-discovery
 * (SSR, static export, no-JS, and the first client frame) the §4.4
 * constant progress-0 stack renders with plain elements; on discovery the
 * Inner motion composition takes over and the MotionValues adopt per-frame
 * on hydration. HARD RULE (P1): Inner never renders while either element
 * is missing.
 */
export function ProjectsEditorialStage({
  projects,
}: {
  projects: ProjectEntry[];
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [scrollElements, setScrollElements] = useState<{
    main: HTMLElement;
    wrapper: HTMLElement;
  } | null>(null);

  useEffect(() => {
    const main = document.querySelector<HTMLElement>(MAIN_SELECTOR);
    const wrapper =
      stageRef.current?.closest<HTMLElement>(WRAPPER_SELECTOR) ?? null;
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
        <SsrRowStack projects={projects} />
      )}
    </div>
  );
}