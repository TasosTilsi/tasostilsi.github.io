
// Removed Header and Footer imports and components

import type { Metadata } from 'next';
import portfolioData from '@/data/portfolio-main-data.json';

// Import global styles
import '../globals.css';

/**
 * D-02: the CLI terminal carries its OWN branding, co-located with the route
 * that owns it. The strings are identical to the root layout's
 * (src/app/layout.tsx:31-32), so the move has zero visual delta; openGraph /
 * twitter stay on the root layout, which already describes the site, and
 * metadataBase stays there too. The shell below is byte-identical to the
 * pre-swap (main)/layout.tsx.
 */
export const metadata: Metadata = {
  title: `${portfolioData.about.name} | ${portfolioData.about.title} | Interactive CLI Portfolio`,
  description: portfolioData.meta.description,
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      {/* This div ensures the layout container takes full height and hides its own overflow */}
      <div className="flex flex-col h-screen bg-background text-foreground font-mono overflow-hidden">
        {/* The main content area is now flex-grow to fill available space */}
        {/* We keep overflow-auto here so the content *within* main can scroll if it exceeds the main area's height */}
        <main className="flex-grow overflow-auto">
          {children}
        </main>
      </div>
    </>
  );
}

    