/**
 * Public address of the portfolio. Set NEXT_PUBLIC_SITE_URL at deploy time (for example https://princechakusa.com);
 * it feeds link previews, the sitemap and robots.txt.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://princechakusa.com").replace(/\/$/, "");

/** Cloudflare Web Analytics token (free, cookie-free). Leave unset to ship without analytics. */
export const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN || "";
