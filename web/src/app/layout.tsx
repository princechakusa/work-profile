import type { Metadata } from "next";
import { Big_Shoulders, Familjen_Grotesk, Martian_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const display = Big_Shoulders({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-display" });
const body = Familjen_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = Martian_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "Prince Chakusa | Holiday Home Operations Leader",
    template: "%s | Prince Chakusa",
  },
  description:
    "From the front desk to leading the team: Prince Chakusa has run 350+ holiday homes in Dubai and builds the software that keeps them running.",
  keywords: [
    "holiday home operations",
    "guest experience",
    "property operations",
    "hospitality team leader",
    "Dubai hospitality",
    "Abu Dhabi hospitality",
    "Prince Chakusa",
  ],
  authors: [{ name: "Prince Chakusa" }],
  creator: "Prince Chakusa",
  category: "portfolio",
  robots: { index: true, follow: true },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Prince Chakusa",
  jobTitle: "Guest Relations Executive Supervisor",
  email: "mailto:chakusaprince@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Abu Dhabi", addressCountry: "AE" },
  sameAs: ["https://linkedin.com/in/princechakusa", "https://github.com/princechakusa"],
  knowsAbout: ["Guest experience", "Holiday home operations", "Property operations", "Team leadership", "DTCM compliance", "Software development"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }} />
        <SmoothScroll>
          <SiteNav />
          {children}
          <SiteFooter />
        </SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
