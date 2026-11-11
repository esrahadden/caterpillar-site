import type { Metadata } from "next";
import { Red_Hat_Display, Red_Hat_Text } from "next/font/google";
import "./globals.css";

const redHatDisplay = Red_Hat_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const redHatText = Red_Hat_Text({
  variable: "--font-text",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AI Consultant for Small Businesses in Atlanta | Caterpillar AI Consulting",
  description: "Caterpillar AI Consulting builds and installs AI tools for Atlanta small businesses: automations, custom AI assistants, team training and seminars.",
  keywords: "AI consulting, AI training, artificial intelligence, workflow automation, AI strategy, AI tools, business transformation",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Caterpillar AI Consulting",
  url: "https://www.caterpillar-consulting.ai",
  areaServed: "Atlanta, GA",
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
