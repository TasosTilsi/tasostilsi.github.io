import type { Metadata } from 'next';
import portfolioData from '@/data/portfolio-main-data.json';
import { EXPLORE_THEME_STORAGE_KEY } from '@/components/explore/constants';

/**
 * D-05 flash prevention: synchronous inline before-paint script rendered as
 * the FIRST child of the /explore layout, ahead of {children}.
 *
 * Contract (UI-SPEC §9.1 / §17.7):
 * - reads ONLY the explore key — never the CLI's "portfolio-theme";
 * - strips any lingering dark/light classes, then applies the persisted
 *   theme; anything invalid, absent, or throwing resolves to "dark"
 *   (dark is the unconditional default — no prefers-color-scheme detection);
 * - kept as a static string so the static export (output: 'export') emits it
 *   verbatim into out/explore.html — no next/script, no dynamic import;
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
 * (src/app/layout.tsx:20-48) with the explore identity.
 */
export const metadata: Metadata = {
  title: `${portfolioData.about.name} | ${portfolioData.about.title} | Visual Portfolio Explorer`,
  description: portfolioData.meta.description,
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