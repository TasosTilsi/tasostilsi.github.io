/**
 * AboutSection — About panel body (D-05, UI-SPEC §4).
 *
 * Text-only: the full about description verbatim, then a meta row with the
 * job title (Briefcase icon) and location (MapPin icon). No profile photo
 * anywhere (D-05 — the profile-image field and dob are intentionally
 * unused), no name repetition (the header bar and intro strip carry it),
 * and no terminal pointer (D-02 — no matching CLI command).
 *
 * Server component (UI-SPEC §2): no client directive, no hooks — copy arrives
 * entirely from the portfolio data via props (D-07). Graceful-hide
 * (UI-SPEC §11): a meta item renders only when its string is non-empty;
 * no fallback copy is invented. Content text wraps fully and is never
 * clipped (UI-SPEC §3).
 */
import { Briefcase, MapPin } from 'lucide-react';
import type { PortfolioData } from '@/data/portfolio-main-data';

export function AboutSection({ about }: { about: PortfolioData['about'] }) {
  return (
    <div>
      <p className="text-sm leading-relaxed text-foreground">
        {about.description}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {about.title && (
          <span className="flex items-center gap-1.5">
            <Briefcase aria-hidden="true" className="h-3.5 w-3.5" />
            <span>{about.title}</span>
          </span>
        )}
        {about.location && (
          <span className="flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
            <span>{about.location}</span>
          </span>
        )}
      </div>
    </div>
  );
}