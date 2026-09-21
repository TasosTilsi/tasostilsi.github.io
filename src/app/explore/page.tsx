/**
 * /explore — Visual Portfolio Explorer (phase EXPLORE-01, plan 02).
 *
 * Composition (D-01, UI-SPEC §2.1):
 *
 *   <ExploreShell>                          client boundary — owns theme state
 *     ├── <ExploreHeader name title />      window glyphs + title + toggles
 *     ├── <main aria-label tabIndex={0}>    ONLY scroll container (§2.1)
 *     │     └── <ExplorePanels />           5-panel grid, stable section ids
 *     └── <ExploreStatusBar theme />        breadcrumb + theme + 0/5 counter
 *
 * Server component: imports portfolio-main-data.json and passes name/title
 * through the ExploreShell client boundary — all interactive theme/drawer
 * state lives behind that boundary while panels stay server-rendered (D-08).
 * The page metadata lives in the sibling explore/layout.tsx alongside the
 * before-paint theme script (flash prevention, UI-SPEC §9.1).
 *
 * Route placement: sibling of the (main)/ route group — it must NOT inherit
 * the CLI's h-screen overflow-hidden terminal shell
 * (src/app/(main)/layout.tsx:16). SSG-compatible: pure data imports, no
 * server APIs, so the static export (output: 'export') emits out/explore.html.
 *
 * The five placeholder panels come from ExplorePanels (plan 02): stable
 * section ids as drawer anchor targets; real panel content is phase 2.
 */
import portfolioData from '@/data/portfolio-main-data.json';
import { ExploreShell } from '@/components/explore/explore-shell';
import { ExplorePanels } from '@/components/explore/explore-panels';

export default function ExplorePage() {
  return (
    <ExploreShell
      name={portfolioData.about.name}
      title={portfolioData.about.title}
    >
      <ExplorePanels />
    </ExploreShell>
  );
}