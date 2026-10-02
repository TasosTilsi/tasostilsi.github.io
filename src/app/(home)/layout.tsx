import type { Metadata } from 'next';
import portfolioData from '@/data/portfolio-main-data.json';
import { EXPLORE_THEME_STORAGE_KEY } from '@/components/explore/constants';

/**
 * D-05 flash prevention: synchronous inline before-paint script rendered as
 * the FIRST child of the landing route's layout, ahead of the children slot.
 *
 * Contract (UI-SPEC §9.1 / §17.7):
 * - reads ONLY the explore key — never the CLI's "portfolio-theme";
 * - strips any lingering dark/light classes, then applies the persisted
 *   theme; anything invalid, absent, or throwing resolves to "dark"
 *   (dark is the unconditional default — no prefers-color-scheme detection);
 * - kept as a static string so the static export (output: 'export') emits it
 *   verbatim into out/index.html — no next/script, no dynamic import;
 * - route-scoped ON PURPOSE (phase-12 R-2): the root layout is shared with
 *   /cli and /resume, and running this script there would strip THEIR
 *   dark/light classes at every boot and rebuild them from the explore key.
 *   This layout is the landing route's only layout, so the blast radius stays
 *   exactly one route — never lift this script into src/app/layout.tsx;
 * - pre-hydration class mutation is safe: root <html> carries
 *   suppressHydrationWarning (src/app/layout.tsx:92).
 */
const themeInitScript = `
try {
  var stored = localStorage.getItem("${EXPLORE_THEME_STORAGE_KEY}");
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(stored === "light" ? "light" : "dark");
} catch (e) {
  document.documentElement.classList.add("dark");
}
`;

/**
 * D-08: data-driven page metadata, mirroring the root pattern
 * (src/app/layout.tsx:29-57) with the landing (explore) identity.
 *
 * The Open Graph + Twitter card fields are declared EXPLICITLY and are NOT
 * optional polish: metadata merges per top-level field, so a layout that
 * declares only title/description silently inherits the ROOT's CLI-branded
 * social card — measured on the pre-swap build, out/explore.html carried
 * `og:title = "<name> | Interactive CLI Portfolio"`. The social card is what
 * a recruiter sees when the link is pasted into Slack or LinkedIn, so it must
 * carry the landing branding (phase-12 R-3 / P-11).
 * The base URL for relative metadata images stays on the root layout
 * (src/app/layout.tsx:30), so it still resolves here.
 */
export const metadata: Metadata = {
  title: `${portfolioData.about.name} | ${portfolioData.about.title} | Visual Portfolio Explorer`,
  description: portfolioData.meta.description,
  openGraph: {
    title: `${portfolioData.about.name} | ${portfolioData.about.title} | Visual Portfolio Explorer`,
    description: portfolioData.meta.description,
    url: 'https://tasostilsi.github.io/',
    siteName: `${portfolioData.about.name}'s Portfolio`,
    images: [
      {
        url: portfolioData.about.profileImageUrl,
        width: 800,
        height: 800,
        alt: `${portfolioData.about.name}'s Profile Image`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `${portfolioData.about.name} | ${portfolioData.about.title} | Visual Portfolio Explorer`,
    description: portfolioData.meta.description,
  },
};

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      {children}
    </>
  );
}