import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const PAGES = ["", "/work", "/projects", "/education", "/why-me", "/cv", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({ url: `${SITE_URL}${path}`, changeFrequency: "monthly", priority: path ? 0.8 : 1 }));
}
