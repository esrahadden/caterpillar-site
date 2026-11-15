import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "AI Consultant for Small Businesses | Caterpillar AI Consulting",
  description: "Caterpillar AI Consulting builds and installs AI tools for small businesses: automations, custom AI assistants, team training and seminars.",
  keywords: "AI consulting, AI training, artificial intelligence, workflow automation, AI strategy, AI tools, business transformation",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Caterpillar AI Consulting",
  url: "https://www.caterpillar-consulting.ai",
  email: "samer@caterpillar-consulting.ai",
  telephone: "+1-404-939-0628",
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
