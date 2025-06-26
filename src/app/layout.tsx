
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import portfolioData from '@/data/portfolio-main-data.json';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata from JSON
export const metadata: Metadata = {
  metadataBase: new URL('https://tasostilsi.github.io'), // IMPORTANT: Update this to your actual deployed domain
  title: `${portfolioData.about.name} | ${portfolioData.about.title} | Interactive CLI Portfolio`,
  description: portfolioData.meta.description,
  keywords: portfolioData.meta.keywords,
  authors: [{ name: portfolioData.meta.author, url: portfolioData.about.contact.linkedin }],
  openGraph: {
    title: `${portfolioData.about.name} | Interactive CLI Portfolio`,
    description: `Interactive command-line portfolio of ${portfolioData.about.name}.`,
    url: 'https://tasostilsi.github.io/', // IMPORTANT: Update this to your actual deployed domain
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
    title: `${portfolioData.about.name} | Interactive CLI Portfolio`,
    description: `Explore ${portfolioData.about.name}'s interactive CLI-style portfolio.`,
    // images: [portfolioData.about.profileImageUrl], // Add your Twitter card image URL here
  },
};

export const viewport: Viewport = {
  themeColor: [ // Example theme colors, can be adjusted
    { media: '(prefers-color-scheme: light)', color: '#EEEEEE' }, // Light theme background
    { media: '(prefers-color-scheme: dark)', color: '#1A1A1A' },  // Dark theme background (example)
  ],
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": portfolioData.about.name,
    "url": "https://tasostilsi.github.io/", // IMPORTANT: Update this to your actual deployed domain
    "image": portfolioData.about.profileImageUrl,
    "email": portfolioData.about.email,
    "jobTitle": portfolioData.about.title,
    "description": portfolioData.about.description,
    "knowsAbout": [
      ...portfolioData.skills.soft_skills,
      ...Object.values(portfolioData.skills.hard_skills).flat(),
      ...portfolioData.skills.languages
    ],
    "alumniOf": portfolioData.education.map(edu => ({ "@type": "EducationalOrganization", "name": edu.institution })),
    "sameAs": [
      portfolioData.about.contact.linkedin,
      portfolioData.about.contact.github,
      portfolioData.about.contact.medium,
      portfolioData.about.contact.facebook,
      portfolioData.about.contact.instagram,
      portfolioData.about.contact.twitter,
      portfolioData.about.contact.twitch,
    ].filter(Boolean)
  };

  return (
    // The 'dark' or 'light' class will be applied dynamically by TerminalInterface.tsx
    // h-full is important for the CLI layout to fill the screen
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta charSet={portfolioData.meta.charset} />
        <meta name="viewport" content={portfolioData.meta.viewport} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TLWL6FDZE7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TLWL6FDZE7');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-mono antialiased h-full flex flex-col`} suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
