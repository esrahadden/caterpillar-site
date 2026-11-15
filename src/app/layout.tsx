import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { pageMeta, SITE_NAME, SITE_URL } from "@/lib/seo";

// Self-hosted (variable, latin subset) so builds don't depend on fetching Google Fonts.
const redHatDisplay = localFont({
  src: "./fonts/RedHatDisplay-latin.woff2",
  variable: "--font-display",
  weight: "300 900",
  display: "swap",
});

const redHatText = localFont({
  src: "./fonts/RedHatText-latin.woff2",
  variable: "--font-text",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMeta(
    "/",
    "AI Consultant for Small Businesses | Caterpillar AI Consulting",
    "Caterpillar AI Consulting builds and installs AI tools for small businesses: automations, custom AI assistants, team training and seminars.",
  ),
  keywords: "AI consulting, AI training, artificial intelligence, workflow automation, AI strategy, AI tools, business transformation",
};

// Structured data: tells search engines and AI assistants who we are (and that we're not Caterpillar Inc.).
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#business`,
      name: SITE_NAME,
      alternateName: "Caterpillar AI",
      description:
        "AI consulting for small businesses: we build and install AI systems that take estimates, intake, email and reporting off owners' plates, and train teams to use them.",
      url: SITE_URL,
      logo: `${SITE_URL}/logos/caterpillar-logo.png`,
      image: `${SITE_URL}/opengraph-image`,
      email: "samer@caterpillar-consulting.ai",
      telephone: "+1-404-939-0628",
      address: { "@type": "PostalAddress", addressLocality: "Atlanta", addressRegion: "GA", addressCountry: "US" },
      areaServed: { "@type": "Country", name: "United States" },
      founder: { "@id": `${SITE_URL}/#samer` },
      knowsAbout: ["AI consulting", "Workflow automation", "AI assistants", "AI training", "AI model selection"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: [
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI consulting and tool stack audit" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom AI assistants and automations" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "Team AI training" } },
          { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI seminars" } },
        ],
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#samer`,
      name: "Samer Sabbagh",
      jobTitle: "Founder",
      image: `${SITE_URL}/samer.jpg`,
      worksFor: { "@id": `${SITE_URL}/#business` },
      url: `${SITE_URL}/connect`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#business` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${redHatDisplay.variable} ${redHatText.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
