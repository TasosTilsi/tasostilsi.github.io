/**
 * SkillsSection — Skills panel body (D-06, plan EXPLORE-06 REV-05).
 *
 * PRIMARY rendering: the competency + proof cards (§4.2) — one card per
 * core_competencies cluster, each an accent chip (the outline-variant Badge
 * carrying the Skills panel accent identity: chart-3 text + 40%-alpha
 * chart-3 border) with the cluster name plus the one-line quantified proof
 * beneath, both verbatim from the refreshed data. Density keys on lg —
 * never md/sm (§2.3: the panel body is ≈320px at md, too narrow for two
 * cards; at lg 8 cards = 4×2, zero empty cells).
 *
 * SURVIVING body (U-2 adjudication on record): D-06 removes ONLY the bar
 * chart + treemap — the grouped chips (soft_skills / hard_skills
 * categories / languages, the only /explore rendering of the full
 * hard-skills lists) and their headers stay byte-identical below the cards,
 * still fed by viz-data's skillsGroupCounts (§10 single source), with the
 * two mandatory chip className overrides (§17.2): neutral font weight and
 * suppressed pointer events (§10 pins chips static). The TerminalPointer
 * stays at the body end.
 *
 * The old bar chart, mention treemap and the techMentions corpus prop are
 * GONE (D-06) — the section imports no chart library and no mention
 * machinery; the server-side experience prop reverted with them (OQ-10).
 *
 * REV-09 (EXPLORE-07 plan 02, D-02/UI-SPEC §4): the card presentation is
 * redesigned at taste level — the card li carries the exp-lift hook (inert
 * until plan 03 defines .exp-lift in globals.css under the .explore-shell
 * scope, D-02/D-04), the accent chip alternates left/right by index parity
 * (column-wise zigzag in the lg 4×2 grid, alternating left/right down the
 * stack at base) and the proof gap widens mt-1.5 → mt-2, proof text staying
 * left-aligned both ways (reading stability). Cursor stays default — the
 * cards are NOT interactive. Chips, overrides, TerminalPointer and
 * graceful-hide stay byte-identical.
 *
 * Server component (UI-SPEC §2): no client directive, no hooks — copy
 * arrives entirely from the portfolio data via props (D-07). Graceful-hide
 * (UI-SPEC §11): empty competencies renders no cards block while the chips
 * block stays independent; with no contentful group either the body renders
 * nothing — no fallback copy.
 */
import { Badge } from '@/components/ui/badge';
import type { PortfolioData } from '@/data/portfolio-main-data';
import { skillsGroupCounts } from '../viz-data';
import { TerminalPointer } from './terminal-pointer';

export function SkillsSection({
  skills,
  competencies,
}: {
  skills: PortfolioData['skills'];
  competencies: PortfolioData['core_competencies'];
}) {
  const groups = skillsGroupCounts(skills);
  if (groups.length === 0 && competencies.length === 0) {
    return null;
  }
  return (
    <div className="space-y-3">
      {competencies.length > 0 && (
        <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {competencies.map((competency, index) => (
            <li key={competency.name} className="flex flex-col rounded-md border border-border p-3 exp-lift">
              <div className={index % 2 === 0 ? "self-start" : "self-end"}>
                <Badge
                  variant="outline"
                  className="font-normal pointer-events-none text-chart-3 border-chart-3/40"
                >
                  {competency.name}
                </Badge>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {competency.proof}
              </p>
            </li>
          ))}
        </ul>
      )}
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