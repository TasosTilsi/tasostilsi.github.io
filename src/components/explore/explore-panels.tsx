/**
 * ExplorePanels — the main-area panel grid (D-01, UI-SPEC §6).
 *
 * Tracer slice (plan 02 Task 1): maps EXPLORE_SECTIONS to static placeholder
 * <section> elements with STABLE ids — the anchor targets the drawer's
 * hrefs resolve against (and no-JS/deep-link fallbacks, UI-SPEC §14#15).
 * The full §6 anatomy (accent chip, humor line, skeletons, responsive
 * About-spanning grid) lands in Task 2 — ids stay stable from the start.
 */
import { EXPLORE_SECTIONS } from './constants';

export function ExplorePanels() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {EXPLORE_SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-label={section.label}
          className="rounded-md border bg-card p-4"
        >
          <h2 className="text-sm font-medium">{section.label}</h2>
        </section>
      ))}
    </div>
  );
}