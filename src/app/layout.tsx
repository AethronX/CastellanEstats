import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://castellan-estates.example.com"),
  title: {
    default: "Castellan Estates — Residences Beyond Time",
    template: "%s — Castellan Estates",
  },
  description:
    "Castellan Estates composes private residences like cinema — irreplaceable addresses, timeless architecture, and uncompromised craft across Dubai, Oman, and beyond.",
  keywords: [
    "luxury real estate",
    "private residences",
    "Dubai villas",
    "penthouse",
    "luxury property investment",
  ],
  openGraph: {
    title: "Castellan Estates — Residences Beyond Time",
    description:
      "An immersive journey through architecture, light, and stillness. Private residences composed like cinema.",
    type: "website",
    images: [{ url: "/images/hero.webp", width: 3413, height: 1920 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Castellan Estates — Residences Beyond Time",
    description: "Private residences composed like cinema.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#faf8f2",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Castellan Estates",
  description:
    "Private residences composed like cinema — irreplaceable addresses, timeless architecture, and uncompromised craft.",
  url: "https://castellan-estates.example.com",
  logo: "https://castellan-estates.example.com/icon.svg",
  address: [
    { "@type": "PostalAddress", addressLocality: "Dubai", streetAddress: "Level 58, Marina Gate" },
    { "@type": "PostalAddress", addressLocality: "London", streetAddress: "9 Grosvenor Street, Mayfair" },
    { "@type": "PostalAddress", addressLocality: "Muscat", streetAddress: "Al Mouj Marina, Walk 12" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="grain cursor-none-desktop font-sans bg-obsidian text-ivory">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
