/**
 * /explore — Visual Portfolio Explorer (phase EXPLORE-01, plan 01).
 *
 * Composition (D-01, UI-SPEC §2.1):
 *
 *   <ExploreShell>                          client boundary — owns theme state
 *     ├── <ExploreHeader name title />      window glyphs + data-driven title
 *     ├── <main aria-label tabIndex={0}>    ONLY scroll container (§2.1)
 *     │     └── <section id="about">        inline placeholder panel
 *     └── <ExploreStatusBar theme />        breadcrumb + theme + 0/5 counter
 *
 * Server component: imports portfolio-main-data.json and passes name/title
 * through the ExploreShell client boundary — all interactive theme state
 * lives behind that boundary while panels stay server-rendered (D-08).
 * The page metadata lives in the sibling explore/layout.tsx alongside the
 * before-paint theme script (flash prevention, UI-SPEC §9.1).
 *
 * Route placement: sibling of the (main)/ route group — it must NOT inherit
 * the CLI's h-screen overflow-hidden terminal shell
 * (src/app/(main)/layout.tsx:16). SSG-compatible: pure data imports, no
 * server APIs, so the static export (output: 'export') emits out/explore.html.
 *
 * The inline About panel below is the tracer's thinnest main-area stand-in —
 * it is replaced by the full 5-panel grid in plan 02 (D-01: About,
 * Experience, Skills, Projects, Contact).
 */
import portfolioData from '@/data/portfolio-main-data.json';
import { ExploreShell } from '@/components/explore/explore-shell';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExplorePage() {
  return (
    <ExploreShell
      name={portfolioData.about.name}
      title={portfolioData.about.title}
    >
      <section id="about" className="rounded-md border bg-card p-4">
        <h2 className="text-sm font-medium">About</h2>
        <div className="mt-2 space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </section>
    </ExploreShell>
  );
}