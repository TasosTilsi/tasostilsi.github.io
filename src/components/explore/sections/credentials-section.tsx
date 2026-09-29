"use client";

/**
 * CredentialsSection — the phase-11 tabbed Credentials panel (UI-SPEC §2–§6).
 *
 * A client LEAF island (UI-SPEC §10): the installed shadcn Tabs primitive is a
 * client component, so this section carries the directive itself and stays a
 * leaf inside the server-rendered grid — everything it renders is derived from
 * plain serializable slices of PortfolioData, no fetching, no state of its own.
 *
 * Three tabs — Articles | Certifications | Presentations (locked labels, §2.3),
 * default Articles, so the Articles rows are REAL TEXT in the static export
 * (§8); the other two bodies are hydration-only, because Radix mounts
 * TabsContent through Presence only while its tab is selected and no content
 * opts into forced mounting. That boundary is pinned by the acceptance suite —
 * opting into forced mounting would move client-only markup into the export.
 *
 * Rows are the calm phase-7 list vocabulary (§2.4/§3.2): 44px rail, a 1px
 * divider dropped on the last row, a muted icon per tab (ICON-01), the item
 * name truncating, the JSON date rendered VERBATIM, and a hover/focus-only
 * ArrowUpRight nudged by the existing `.exp-nudge` CSS hook. No new motion and
 * no motion library — the phase-7 CSS vocabulary is the whole budget
 * (MOTION-01) — and no carousel/stack machinery.
 *
 * Link affordance is URL-only (§5.3/§5.4, CERT-ID-01): a row becomes an anchor
 * only when `isExternalLink` proves an http(s) URL. Certifications store four
 * null links and one `"ID: GRTB-…"` verification string in `link`, so that tab
 * legitimately renders ZERO anchors — the ID joins the date on one combined
 * `date · ID` secondary line as plain text. Articles only: a featured entry
 * whose link is missing/empty is omitted entirely (§4.2), falling back to the
 * empty state if that empties the tab.
 */
import { ArrowUpRight, Award, FileText, MonitorPlay } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PortfolioData } from '@/data/portfolio-main-data';

/** §2.4 row rail: 44px-equivalent target, no gap in the list — dividers separate. */
const ROW_BASE = 'flex min-h-[44px] items-center gap-3 border-b border-border';

/** §3.2 interactive row: whole-row hit target, hover/active surface + the shared focus ring. */
const ROW_INTERACTIVE =
  'group hover:bg-muted/40 active:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background';

/**
 * The ONLY condition under which a row becomes an anchor (§5.3/§5.4): a real
 * http(s) URL. Verification-ID strings and null links can never reach an href.
 */
const isExternalLink = (link?: string | null): link is string =>
  typeof link === 'string' && link.startsWith('http');

type CredentialRow = {
  key: string;
  name: string;
  secondary: string;
  href: string | null;
};

/** One shared row primitive for all three tabs — never three divergent copies. */
function CredentialList({
  rows,
  Icon,
  empty,
}: {
  rows: CredentialRow[];
  Icon: LucideIcon;
  empty: string;
}) {
  // §4.2 EMPTY-01: exactly one calm non-link row, same rhythm, icon slot kept.
  if (rows.length === 0) {
    return (
      <div className="flex flex-col">
        <div className={`${ROW_BASE} border-b-0`}>
          <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{empty}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      {rows.map((row, index) => {
        const last = index === rows.length - 1;
        const rowClass = last ? `${ROW_BASE} border-b-0` : ROW_BASE;
        const chrome = (
          <>
            <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground group-hover:text-accent group-hover:underline group-focus-visible:underline">
              {row.name}
            </span>
            <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
              {row.secondary}
            </span>
            {row.href && (
              <ArrowUpRight
                aria-hidden="true"
                className="ml-1 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 exp-nudge group-hover:opacity-100 group-focus-visible:opacity-100"
              />
            )}
          </>
        );
        return row.href ? (
          <a
            key={row.key}
            href={row.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${rowClass} ${ROW_INTERACTIVE}`}
          >
            {chrome}
          </a>
        ) : (
          <div key={row.key} className={rowClass}>
            {chrome}
          </div>
        );
      })}
    </div>
  );
}

export function CredentialsSection({
  articles,
  certifications,
  presentations,
}: {
  articles: PortfolioData['articles'];
  certifications: PortfolioData['certifications'];
  presentations: PortfolioData['presentations'];
}) {
  const articleRows: CredentialRow[] = articles
    .filter((article) => article.featured)
    .filter((article) => isExternalLink(article.link))
    .map((article) => ({
      key: article.link,
      name: article.name,
      secondary: article.date,
      href: article.link,
    }));

  const certificationRows: CredentialRow[] = certifications
    .filter((certification) => certification.featured)
    .map((certification) => ({
      key: certification.name,
      name: certification.name,
      secondary:
        certification.link && !isExternalLink(certification.link)
          ? `${certification.date} · ${certification.link}`
          : certification.date,
      href: isExternalLink(certification.link) ? certification.link : null,
    }));

  const presentationRows: CredentialRow[] = presentations
    .filter((presentation) => presentation.featured)
    .map((presentation) => ({
      key: presentation.name,
      name: presentation.name,
      secondary: presentation.date,
      href: isExternalLink(presentation.link) ? presentation.link : null,
    }));

  return (
    <Tabs defaultValue="articles">
      <TabsList className="mb-3 h-auto flex-wrap">
        <TabsTrigger value="articles" className="min-h-[44px]">
          Articles
        </TabsTrigger>
        <TabsTrigger value="certifications" className="min-h-[44px]">
          Certifications
        </TabsTrigger>
        <TabsTrigger value="presentations" className="min-h-[44px]">
          Presentations
        </TabsTrigger>
      </TabsList>
      <TabsContent value="articles" className="mt-0">
        <CredentialList rows={articleRows} Icon={FileText} empty="No featured articles." />
      </TabsContent>
      <TabsContent value="certifications" className="mt-0">
        <CredentialList rows={certificationRows} Icon={Award} empty="No featured certifications." />
      </TabsContent>
      <TabsContent value="presentations" className="mt-0">
        <CredentialList rows={presentationRows} Icon={MonitorPlay} empty="No featured presentations." />
      </TabsContent>
    </Tabs>
  );
}
