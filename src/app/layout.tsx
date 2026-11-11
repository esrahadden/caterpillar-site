import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
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
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
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
