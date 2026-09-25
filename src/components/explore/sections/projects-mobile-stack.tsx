'use client';

/**
 * ProjectsMobileStack — compact swipe-driven wrapper over the shared
 * ProjectsSwipeStack (phase-10 REV-21).
 *
 * The mobile surface reuses the same Tinder-style ring-buffer drag/keyboard
 * choreography as the md+ stage, but renders a simplified composition:
 * only the foreground card and the card immediately behind it are visible,
 * deeper cards are hidden. Framer-motion stays inside the single sanctioned
 * import site (projects-stack-stage.tsx).
 */
import { ProjectsSwipeStack } from './projects-stack-stage';
import type { PortfolioData } from '@/data/portfolio-main-data';

type ProjectEntry = PortfolioData['projects'][number];

export function ProjectsMobileStack({ projects }: { projects: ProjectEntry[] }) {
  return <ProjectsSwipeStack projects={projects} mode="compact" />;
}
