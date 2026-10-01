/**
 * Public address of the portfolio: canonical URLs, structured data, link previews, the sitemap and robots.txt.
 * Live at https://princechakusa.github.io/work-profile (set by the deploy workflow). When a custom domain is
 * connected, set NEXT_PUBLIC_SITE_URL to it and drop NEXT_PUBLIC_BASE_PATH.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://princechakusa.github.io/work-profile").replace(/\/$/, "");

/** Cloudflare Web Analytics token (free, cookie-free). Leave unset to ship without analytics. */
export const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN || "";

/** Sub-path the site is served under (for example "/work-profile" on GitHub Pages); empty on a custom domain. */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

/** Prefix a file in public/ with the base path, e.g. asset("/prince.jpg"). */
export const asset = (path: string) => `${BASE_PATH}${path}`;
