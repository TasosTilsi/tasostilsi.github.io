/**
 * ExploreHeader — IDE header bar (UI-SPEC §3, D-01).
 *
 * Server-safe presentational component in the tracer slice; the right cluster
 * gains interactive controls from the tasks that implement them (theme toggle
 * in Task 3, drawer toggle in plan 02). No dead buttons.
 *
 * The px-based h-[52px] height is immune to the ≤640px html{font-size:14px}
 * rem shrink (UI-SPEC §3/§11) — do not convert to rem utilities.
 */
export function ExploreHeader({ name, title }: { name: string; title: string }) {
  return (
    <header className="flex h-[52px] shrink-0 items-center gap-2 border-b bg-background px-4">
      {/* Window glyphs: decorative traffic-light dots — aria-hidden, never interactive */}
      <div aria-hidden="true" className="flex shrink-0 items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: 'hsl(var(--chart-5))' }}
        />
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: 'hsl(var(--chart-3))' }}
        />
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: 'hsl(var(--chart-2))' }}
        />
      </div>
      {/* Title: name-only below md, name — title at md+; exactly one span visible */}
      <span className="min-w-0 flex-1 truncate text-sm text-foreground md:hidden">
        {name}
      </span>
      <span className="hidden min-w-0 flex-1 truncate text-sm text-foreground md:inline">
        {`${name} — ${title}`}
      </span>
    </header>
  );
}