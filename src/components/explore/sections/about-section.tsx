/**
 * AboutSection — the merged About+Contact panel body (REV-04/D-05 → REV-15/D-02).
 *
 * Pinned order, top to bottom (EXPLORE-09 UI-SPEC §2.1 — notes order is
 * authoritative): positioning lead (NEW about.positioning, two block spans,
 * never joined) → metrics row (NEW about.metrics, 2×2 mini-tiles mirroring
 * project-stat-tiles.tsx) → availability chip (NEW about.availability — a
 * verbatim transcription of the CLI welcome-banner line; the CLI file itself
 * is NOT edited) → avatar (about.profileImageUrl, plain <img> — tinyurl is
 * not in next.config remotePatterns and the static export runs unoptimized
 * images, so next/image adds nothing) → the full summary DEMOTED below the
 * lead (§2.6) with the meta row (Briefcase title + MapPin location) kept
 * attached below it → divider → the 9 contact channel rows → the Full resume
 * link LAST (the merged panel's last interactive element).
 *
 * Graceful-hide matrix (§2.8, all server-side, no invented copy): positioning
 * absent/empty → lead omitted AND the summary renders at its pre-phase
 * prominence (text-sm text-foreground — the pre-phase presentation survives
 * as the fallback, never as a parallel rendering); empty metrics → row
 * omitted (1–4 entries render what exists — the UI is total); absent/empty
 * availability → chip omitted; absent/empty profileImageUrl → avatar
 * omitted; a meta item or channel whose value is missing/empty renders no
 * row. Values render as stored (labels uppercased by CSS only — no numeric
 * parsing anywhere).
 *
 * Contacts tightening (§2.7): anatomy unchanged (CHANNELS chrome table,
 * shared ROW_CLASS const, email mailto / external noopener pair, values wrap
 * break-all never clipped); compactness comes from gap-2.5 → gap-2 on the
 * shared ROW_CLASS, a leading-snug value span, my-3 → my-2 divider and
 * mt-3 → mt-2 resume rhythm — min-h-[44px] STAYS through the shared const
 * (the 44px rail) and on the resume row.
 *
 * EXPLORE-07 micro-motion (REV-11/D-04): every motion declaration lives in
 * globals.css under .explore-shell — the channel icons and the resume
 * ArrowRight carry the exp-nudge hook (M3: row hover + row focus, 2px
 * translateX), and both underlined labels carry group-focus-visible:underline
 * for M5 keyboard parity alongside the pre-existing hover underline (M4,
 * instant by design). No new focusables, tab order unchanged. The new §2.1
 * blocks (lead/metrics/chip/avatar) are static chrome — non-interactive,
 * hover-inert (§17.6 precedent); zero new globals.css declarations.
 *
 * Server component (UI-SPEC §2): no client directive, no hooks, no runtime
 * error handlers — copy arrives entirely from the portfolio data via props
 * (D-07; the three new fields were typed same-commit and approved in the
 * phase-9 data round). No Medium brand icon exists in lucide-react 0.475.0,
 * so that channel uses the §8 substitute (imported under its channel alias).
 * DOM order = visual order = tab order: lead → metrics → chip → avatar →
 * summary → meta row (non-focusable) → 9 channel rows → Full resume link
 * last.
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
  'flex min-h-[44px] items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background';

export function AboutSection({ about }: { about: PortfolioData['about'] }) {
  const contact = about.contact;
  const positioning = about.positioning ?? [];
  const [leadLine, leadTail] = positioning;
  const hasPositioning = positioning.length > 0;
  const metrics = about.metrics ?? [];
  return (
    <div>
      {/* §2.1 item 1 — the positioning lead: two block spans, never joined. */}
      {hasPositioning && (
        <div>
          {leadLine && (
            <span className="block text-base font-medium text-foreground leading-snug">
              {leadLine}
            </span>
          )}
          {leadTail && (
            <span className="mt-0.5 block text-base text-accent">{leadTail}</span>
          )}
        </div>
      )}
      {/* §2.1 item 2 — the impact-metric row: 2×2 mini-tiles mirroring
          project-stat-tiles.tsx; renders what exists (1–4 entries — the UI is
          total), omits the row entirely when the array is empty. */}
      {metrics.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-md border border-border p-2.5">
              <p className="text-sm font-medium leading-none tabular-nums text-foreground">
                {metric.value}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      )}
      {/* §2.1 item 3 — the availability chip: verbatim data text, non-interactive. */}
      {about.availability && (
        <div className="mt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-accent">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-chart-1" />
            {about.availability}
          </span>
        </div>
      )}
      {/* §2.1 item 4 — the avatar: plain <img> (tinyurl not in remotePatterns;
          static export runs unoptimized images). Absent/empty → no element. */}
      {about.profileImageUrl && (
        <img
          src={about.profileImageUrl}
          alt={`Portrait of ${about.name}`}
          loading="lazy"
          decoding="async"
          className="mt-3 h-16 w-16 rounded-full object-cover md:h-20 md:w-20"
        />
      )}
      {/* §2.1 item 5 — the full summary, DEMOTED below the lead; reverts to
          its pre-phase prominence when positioning is absent (§2.8 fallback). */}
      <p
        className={
          hasPositioning
            ? 'text-xs leading-relaxed text-muted-foreground'
            : 'text-sm leading-relaxed text-foreground'
        }
      >
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
      {/* §2.1 item 6 — the single divider reused from the removed ContactSection
          (tightened my-3 → my-2, §2.7). */}
      <div className="my-2 border-t border-border" />
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
                className="h-4 w-4 shrink-0 text-muted-foreground exp-nudge"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-foreground group-hover:underline group-focus-visible:underline">
                  {channel.label}
                </span>
                <span className="block break-all text-xs leading-snug text-muted-foreground">
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
      {/* §2.1 item 8 — Full resume link LAST; internal route → same tab (D-03);
          tightened rhythm only (mt-3 → mt-2, §2.7). */}
      <Link
        href="/resume"
        className="mt-2 group flex min-h-[44px] items-center gap-2 rounded-md border border-border px-3 text-sm font-medium text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
      >
        <FileText aria-hidden="true" className="h-4 w-4" />
        <span className="group-hover:underline group-focus-visible:underline">Full resume</span>
        <ArrowRight aria-hidden="true" className="h-4 w-4 exp-nudge" />
      </Link>
    </div>
  );
}