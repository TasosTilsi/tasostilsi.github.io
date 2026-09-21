/**
 * SkillsSection — Skills panel body (D-01, D-04, UI-SPEC §6).
 *
 * The JSON's own grouping, in JSON key order with no sorting and no
 * re-shaping — the soft-skill group first, then each hard-skill category in
 * insertion order labelled by its key verbatim, then the spoken-languages
 * group — now lives in viz-data's skillsGroupCounts (§10 single source; see
 * the phase-3 note below). Group headers are prettified chrome labels — a
 * structural key→label map allowed per §17.4 (W-5 resolved); the two
 * 'Languages' rows stay separate groups keyed by their distinct JSON paths,
 * order carrying the disambiguation.
 *
 * Chips are the existing outline-variant Badge with two mandatory
 * className overrides (D-04, §17.2): the chip font weight is neutralized
 * (the base weight is too heavy at chip density) and pointer events are
 * suppressed (the primitive's other variants carry hover styles and CSS
 * :hover fires on divs — §10 pins chips static, no cursor change, not
 * focusable). Every group renders as-is — no cap (CONTEXT discretion).
 *
 * Server component (UI-SPEC §2): no client directive, no hooks — copy
 * arrives entirely from the portfolio data via props (D-07). Graceful-hide
 * (UI-SPEC §11): a missing or empty group is skipped entirely, and with no
 * contentful group at all the body renders nothing — no fallback copy.
 *
 * Phase 3 augmentation (D-01, UI-SPEC §1 ①/§10): the bar chart composes as
 * the FIRST child, fed by viz-data's skillsGroupCounts — the SAME builder
 * logic adopted verbatim into the pure module (§10 single source: chart and
 * chips can never drift). Chips and headers below stay byte-identical.
 */
import { Badge } from '@/components/ui/badge';
import type { PortfolioData } from '@/data/portfolio-main-data';
import { skillsGroupCounts } from '../viz-data';
import { TerminalPointer } from './terminal-pointer';
import { SkillsChart } from './skills-chart';

export function SkillsSection({ skills }: { skills: PortfolioData['skills'] }) {
  const groups = skillsGroupCounts(skills);
  if (groups.length === 0) {
    return null;
  }
  return (
    <div className="space-y-3">
      <SkillsChart rows={groups} />
      {groups.map((group) => (
        <div key={group.id}>
          <p className="text-xs text-muted-foreground">{group.label}</p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {group.items.map((skill) => (
              <li key={skill}>
                <Badge variant="outline" className="font-normal pointer-events-none">
                  {skill}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <TerminalPointer command="skills" />
    </div>
  );
}