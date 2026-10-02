/**
 * / — Visual Portfolio Explorer, the primary landing (phase EXPLORE-01,
 * plan 02; promoted from /explore by phase EXPLORE-12, REV-22).
 *
 * Composition (D-01, UI-SPEC §2.1):
 *
 *   <ExploreShell>                          client boundary — owns theme state
 *     ├── <ExploreHeader name title />      window glyphs + title + toggles
 *     ├── intro slot                        <ExploreIntro> typewriter strip (D-07)
 *     ├── <main aria-label tabIndex={0}>    ONLY scroll container (§2.1)
 *     │     └── <ExplorePanels data />      5-panel grid, stable section ids
 *     └── <ExploreStatusBar theme />        breadcrumb + theme + 0/5 counter
 *
 * Server component: imports portfolio-main-data.json and passes name/title
 * through the ExploreShell client boundary plus the full typed data object
 * down to ExplorePanels (page → panels → sections as typed props, D-07) —
 * all interactive theme/drawer/
 * typewriter state lives behind that boundary while panels stay
 * server-rendered (D-08). The intro goes through the shell's dedicated
 * slot (NOT children) so it sits outside the main scroll container as
 * shrink-0 chrome, per UI-SPEC §2.1 region order.
 * The page metadata lives in the sibling (home)/layout.tsx alongside the
 * before-paint theme script (flash prevention, UI-SPEC §9.1; phase-12 D-02 /
 * UI-SPEC §4.4) — never in the root layout, which is shared with /cli and
 * /resume.
 *
 * Route placement: a (home) route group resolving to / — the group name
 * contributes nothing to the URL, and its layout is the ONLY layout this
 * route gets, so the before-paint script's blast radius stays one route. The
 * landing must NOT inherit the CLI's h-screen overflow-hidden terminal shell
 * — that wrapper now lives in src/app/cli/layout.tsx and applies to /cli
 * only; the landing's own frame is the explore shell's h-dvh
 * (src/components/explore/explore-shell.tsx). SSG-compatible: pure data
 * imports, no server APIs, so the static export (output: 'export') emits
 * out/index.html.
 *
 * Panels come from ExplorePanels: stable section ids as drawer anchor
 * targets; section bodies render the real portfolio content from the data
 * prop (phase 2).
 */
import portfolioData from '@/data/portfolio-main-data.json';
import { ExploreShell } from '@/components/explore/explore-shell';
import { ExploreIntro } from '@/components/explore/explore-intro';
import { ExplorePanels } from '@/components/explore/explore-panels';

export default function ExplorePage() {
  return (
    <ExploreShell
      name={portfolioData.about.name}
      title={portfolioData.about.title}
      intro={
        <ExploreIntro
          name={portfolioData.about.name}
          title={portfolioData.about.title}
        />
      }
    >
      <ExplorePanels data={portfolioData} />
    </ExploreShell>
  );
}