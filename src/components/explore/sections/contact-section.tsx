/**
 * ContactSection — Contact panel body (D-03, UI-SPEC §8).
 *
 * Top to bottom: the prominent full-resume row FIRST (accent text, file +
 * arrow icons, bordered, 44px touch height; internal route → same tab via
 * next/link — the only outbound navigation of phase 2, D-03), a divider,
 * then all 9 contact channels in JSON key order. Each channel row shows
 * its lucide icon, a capitalized chrome label, and the stored value
 * EXACTLY as kept (strict data fidelity — no protocol repair, UI-SPEC
 * §11); the row text doubles as the accessible name.
 *
 * Server component (UI-SPEC §2): no client directive, no hooks. The
 * channel table below is structural chrome (UI-SPEC §17.4 — display
 * labels + icon mapping allowed); no Medium brand icon exists in
 * lucide-react 0.475.0, so that channel uses the §8 substitute (imported
 * under its channel alias). One row template is shared by both anchor
 * shells — email rows keep their protocol href with no tab attributes;
 * the 8 external rows open in a new tab with the noopener pair.
 * Graceful-hide (UI-SPEC §11): an optional channel whose value is
 * missing/empty renders no row and invents no copy. No terminal pointer
 * on Contact (D-02 — no matching CLI command). Values wrap (break-all),
 * never clipped (UI-SPEC §3).
 */
import Link from 'next/link';
import {
  ArrowRight,
  Facebook,
  FileText,
  Github,
  Globe as PortfolioIcon,
  Instagram,
  Linkedin,
  Mail,
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

export function ContactSection({
  contact,
}: {
  contact: PortfolioData['about']['contact'];
}) {
  return (
    <div>
      {/* D-03: internal route → same tab; the phase's only outbound navigation. */}
      <Link
        href="/resume"
        className="group flex min-h-[44px] items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
      >
        <FileText aria-hidden="true" className="h-4 w-4" />
        <span className="group-hover:underline">Full resume</span>
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
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
    </div>
  );
}