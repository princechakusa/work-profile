import type { Metadata } from "next";
import { Big_Shoulders, Familjen_Grotesk, Martian_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";
import { PROFILE } from "@/lib/profile";
import { OG_IMAGE, personSchema, websiteSchema } from "@/lib/seo";
import { CF_BEACON_TOKEN, SITE_URL, asset } from "@/lib/site";
import "./globals.css";

const display = Big_Shoulders({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-display" });
const body = Familjen_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body" });
const mono = Martian_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: asset("/icon.png") },
  // defaults only; every page sets its own title, description, canonical URL and social cards (lib/seo.ts)
  openGraph: { type: "website", siteName: PROFILE.name, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  title: `${PROFILE.name} | ${PROFILE.currentRole}, ${PROFILE.location.label}`,
  description: `${PROFILE.name}: ${PROFILE.short}`,
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: PROFILE.name,
  category: "portfolio",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <JsonLd blocks={[personSchema, websiteSchema]} />
        <SmoothScroll>
          <SiteNav />
          {children}
          <SiteFooter />
        </SmoothScroll>
        <WhatsAppButton />
        <Cursor />
        {CF_BEACON_TOKEN && (
          <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })} />
        )}
      </body>
    </html>
  );
}
