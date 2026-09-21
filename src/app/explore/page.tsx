/**
 * /explore — Visual Portfolio Explorer (phase EXPLORE-01, plan 01 tracer).
 *
 * Server component composing the IDE shell (D-01, D-08):
 * header bar → main panel area → bottom status bar. Sibling of the (main)/
 * route group — it must NOT inherit the CLI's h-screen overflow-hidden
 * terminal shell (src/app/(main)/layout.tsx:16).
 *
 * The shell root carries the `explore-shell` scope marker (theme + font
 * scope, UI-SPEC §2.1). Single h-dvh class — Tailwind ^3.4.1 ships it
 * natively; h-screen is never stacked (§2.1). overflow-x-hidden is the
 * belt-and-braces no-horizontal-scroll guarantee (EXPLORE-06).
 *
 * The inline About panel below is the tracer's thinnest main-area stand-in —
 * it is replaced by the full panel grid in plan 02.
 */
import portfolioData from '@/data/portfolio-main-data.json';
import { ExploreHeader } from '@/components/explore/explore-header';
import { ExploreStatusBar } from '@/components/explore/explore-status-bar';
import { Skeleton } from '@/components/ui/skeleton';

export default function ExplorePage() {
  return (
    <div className="explore-shell flex h-dvh flex-col overflow-x-hidden bg-background text-foreground">
      <ExploreHeader
        name={portfolioData.about.name}
        title={portfolioData.about.title}
      />
      <main
        aria-label="Portfolio sections"
        tabIndex={0}
        className="flex-1 overflow-y-auto p-4 md:p-6"
      >
        <section id="about" className="rounded-md border bg-card p-4">
          <h2 className="text-sm font-medium">About</h2>
          <div className="mt-2 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </section>
      </main>
      <ExploreStatusBar theme="dark" />
    </div>
  );
}