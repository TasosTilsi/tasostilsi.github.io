/**
 * SkillsSection — Skills panel body (D-01, D-04, UI-SPEC §6).
 *
 * The JSON's own grouping, in JSON key order with no sorting and no
 * re-shaping: the soft-skill group first, then each hard-skill category in
 * insertion order labelled by its key verbatim, then the spoken-languages
 * group. Group headers are prettified chrome labels — a structural
 * key→label map allowed per §17.4 (W-5 resolved); the two 'Languages'
 * rows stay separate groups keyed by their distinct JSON paths, order
 * carrying the disambiguation.
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
 */
import { Badge } from '@/components/ui/badge';
import type { PortfolioData } from '@/data/portfolio-main-data';
import { TerminalPointer } from './terminal-pointer';

export function SkillsSection({ skills }: { skills: PortfolioData['skills'] }) {
  const groups: Array<{ id: string; label: string; items: string[] }> = [];
  if (skills.soft_skills.length > 0) {
    groups.push({ id: 'soft_skills', label: 'Soft Skills', items: skills.soft_skills });
  }
  for (const [category, items] of Object.entries(skills.hard_skills)) {
    if (items.length > 0) {
      groups.push({ id: `hard_skills.${category}`, label: category, items });
    }
  }
  if (skills.languages.length > 0) {
    groups.push({ id: 'languages', label: 'Languages', items: skills.languages });
  }
  if (groups.length === 0) {
    return null;
  }
  return (
    <div className="space-y-3">
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