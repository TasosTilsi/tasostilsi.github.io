/**
 * /explore — Visual Portfolio Explorer (phase EXPLORE-01).
 *
 * Server component: imports data and passes it through the ExploreShell client
 * boundary (theme state lives behind that boundary; panels stay
 * server-rendered — D-08). Sibling of the (main)/ route group — it must NOT
 * inherit the CLI's h-screen overflow-hidden terminal shell
 * (src/app/(main)/layout.tsx:16).
 *
 * The inline About panel below is the tracer's thinnest main-area stand-in —
 * it is replaced by the full panel grid in plan 02.
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