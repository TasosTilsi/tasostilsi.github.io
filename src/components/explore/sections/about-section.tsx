/**
 * AboutSection — the merged About+Contact panel body (REV-04/D-05, UI-SPEC §3.2).
 *
 * Pinned order, top to bottom (UI-SPEC §3.2): description paragraph → meta row
 * (Briefcase title + MapPin location) → divider → the 9 contact channel rows →
 * the Full resume link LAST. The contact anatomy (CHANNELS chrome table,
 * ROW_CLASS, the row template, the bordered accent resume row) is absorbed
 * verbatim from the removed contact-section.tsx; the resume row moved from
 * first (its old Contact position) to last — it is the merged panel's LAST
 * interactive element (§3.2 item 5, §14.2) — with mt-3 spacing above it.
 * Keeps About's chart-1 accent and grid identity (D-05). No profile photo
 * anywhere (D-05), no name repetition (the header bar and intro strip carry
 * it), no TerminalPointer on the merged panel (§3.2 item 6).
 *
 * Server component (UI-SPEC §2): no client directive, no hooks — copy arrives
 * entirely from the portfolio data via props (D-07). No Medium brand icon
 * exists in lucide-react 0.475.0, so that channel uses the §8 substitute
 * (imported under its channel alias). One row template is shared by both
 * anchor shells — email rows keep their protocol href with no tab attributes;
 * the 8 external rows open in a new tab with the noopener pair. Graceful-hide
 * (UI-SPEC §11): a meta item or channel whose value is missing/empty renders
 * no row and invents no copy. Values wrap (break-all), never clipped
 * (UI-SPEC §3). DOM order = visual order = tab order (§11.2): description →
 * meta row (non-focusable) → 9 channel rows → Full resume link last.
 */
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  Facebook,
  FileText,
  Github,
  Globe as PortfolioIcon,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  PenLine as MediumIcon,
  Twitch,
  Twitter,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PortfolioData } from '@/data/portfolio-main-data';

type ContactChannel = keyof PortfolioData['about']['contact'];

/** §17.4 chrome table: 9 channels in JSON key order, labels + icons pinned by UI-SPEC §8. */
const CHANNELS: ReadonlyArray<{
  key: ContactChannel;
  label: string;
  Icon: LucideIcon;
}> = [
  { key: 'email', label: 'Email', Icon: Mail },
  { key: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { key: 'github', label: 'GitHub', Icon: Github },
  { key: 'medium', label: 'Medium', Icon: MediumIcon },
  { key: 'facebook', label: 'Facebook', Icon: Facebook },
  { key: 'instagram', label: 'Instagram', Icon: Instagram },
  { key: 'twitter', label: 'Twitter', Icon: Twitter },
  { key: 'twitch', label: 'Twitch', Icon: Twitch },
  { key: 'portfolio', label: 'Portfolio', Icon: PortfolioIcon },
];

/** Shared row chrome: 44px touch height + the §14 focus ring on both shells. */
const ROW_CLASS =
  'flex min-h-[44px] items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background';

export function AboutSection({ about }: { about: PortfolioData['about'] }) {
  const contact = about.contact;
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
      {/* §3.2 item 3 — the single divider reused from the removed ContactSection. */}
      <div className="my-3 border-t border-border" />
      <div>
        {CHANNELS.map((channel) => {
          const value = contact[channel.key];
          if (!value) {
            return null; // graceful-hide — no row, no invented copy (§11)
          }
          const row = (
            <>
              <channel.Icon
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-muted-foreground"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-foreground group-hover:underline">
                  {channel.label}
                </span>
                <span className="block break-all text-xs text-muted-foreground">
                  {value}
                </span>
              </span>
            </>
          );
          return channel.key === 'email' ? (
            <a key={channel.key} href={`mailto:${value}`} className={ROW_CLASS}>
              {row}
            </a>
          ) : (
            <a
              key={channel.key}
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className={ROW_CLASS}
            >
              {row}
            </a>
          );
        })}
      </div>
      {/* §3.2 item 5 — Full resume link LAST (moved from the old Contact first row);
          D-03: internal route → same tab; the explore surface's outbound navigation. */}
      <Link
        href="/resume"
        className="mt-3 group flex min-h-[44px] items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
      >
        <FileText aria-hidden="true" className="h-4 w-4" />
        <span className="group-hover:underline">Full resume</span>
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </div>
  );
}