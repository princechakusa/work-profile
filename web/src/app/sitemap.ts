import type { MetadataRoute } from "next";
import { pageUrl } from "@/lib/seo";

export const dynamic = "force-static";

// every public page; URLs match each page's canonical URL exactly
const PAGES: [string, number][] = [
  ["/", 1],
  ["/work", 0.9],
  ["/cv", 0.9],
  ["/projects", 0.8],
  ["/education", 0.8],
  ["/why-me", 0.7],
  ["/contact", 0.6],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([path, priority]) => ({ url: pageUrl(path), changeFrequency: "monthly", priority }));
}
