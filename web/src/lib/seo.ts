import type { Metadata } from "next";
import { PAMARKET, STUDY } from "@/lib/content";
import { PROFILE } from "@/lib/profile";
import { SITE_URL } from "@/lib/site";

/**
 * Metadata and structured data for every page, built from the canonical profile.
 * URLs are absolute and built here rather than through metadataBase, because the site lives under a sub-path
 * (/work-profile) that relative URL resolution would drop.
 */

/** Public URL of a route. The home page keeps its trailing slash: GitHub Pages redirects the bare sub-path to it. */
export const pageUrl = (path: string) => (path === "/" || path === "" ? `${SITE_URL}/` : `${SITE_URL}${path}`);

export const OG_IMAGE = {
  url: `${SITE_URL}/og.png`,
  width: 1200,
  height: 630,
  alt: `${PROFILE.name}, ${PROFILE.currentRole}, ${PROFILE.location.label}`,
};

/** Unique title, description, canonical URL and social cards for one route. */
export function pageMeta({ path, title, description }: { path: string; title: string; description: string }): Metadata {
  const url = pageUrl(path);
  const isHome = path === "/";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      ...(isHome ? { type: "profile", firstName: "Prince", lastName: "Chakusa" } : { type: "website" }),
      url,
      title,
      description,
      siteName: PROFILE.name,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const person = { "@id": PERSON_ID };

const organisation = (name: string, extra: Record<string, unknown> = {}) => ({ "@type": "Organization", name, ...extra });

const credentials = STUDY.filter((q) => q.done && q.institution).map((q) => ({
  "@type": "EducationalOccupationalCredential",
  name: q.name,
  credentialCategory: q.name.startsWith("Associate") ? "degree" : q.name.includes("Diploma") ? "diploma" : "certification",
  recognizedBy: organisation(q.institution!),
}));

/** Prince as one entity, referenced by @id from every other block. */
export const personSchema = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: PROFILE.name,
  url: pageUrl("/"),
  image: `${SITE_URL}/prince.jpg`,
  jobTitle: PROFILE.currentRole,
  description: PROFILE.summary,
  email: `mailto:${PROFILE.email}`,
  telephone: PROFILE.phone.replace(/\s/g, ""),
  address: { "@type": "PostalAddress", addressLocality: PROFILE.location.city, addressCountry: PROFILE.location.countryCode },
  worksFor: organisation(PROFILE.currentEmployer, {
    address: { "@type": "PostalAddress", addressLocality: PROFILE.location.city, addressCountry: PROFILE.location.countryCode },
  }),
  hasOccupation: {
    "@type": "Occupation",
    name: PROFILE.currentRole,
    occupationLocation: { "@type": "City", name: PROFILE.location.city },
    skills: PROFILE.areas.join(", "),
  },
  knowsAbout: PROFILE.areas,
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "University of the People" },
    { "@type": "EducationalOrganization", name: "Lyceum College", address: { "@type": "PostalAddress", addressCountry: "ZA" } },
  ],
  hasCredential: credentials,
  sameAs: [PROFILE.linkedin, PROFILE.github],
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: pageUrl("/"),
  name: PROFILE.name,
  description: PROFILE.short,
  inLanguage: "en",
  about: person,
  publisher: person,
};

export const profilePageSchema = {
  "@type": "ProfilePage",
  "@id": `${pageUrl("/")}#profilepage`,
  url: pageUrl("/"),
  name: `${PROFILE.name}, ${PROFILE.currentRole}`,
  description: PROFILE.short,
  inLanguage: "en",
  isPartOf: { "@id": WEBSITE_ID },
  mainEntity: person,
  about: person,
};

export const pamarketSchema = {
  "@type": "SoftwareApplication",
  "@id": `${pageUrl("/projects")}#pamarket`,
  name: "PaMarket",
  description:
    "An online marketplace and jobs board for Zimbabwe, where people buy and sell across all 10 provinces, find work, buy or rent cars and discover verified businesses.",
  url: "https://pamarketzw.com",
  applicationCategory: "ShoppingApplication",
  operatingSystem: "Web, iOS, Android",
  downloadUrl: PAMARKET.links.filter((l) => l.t === "App Store" || l.t === "Google Play").map((l) => l.h),
  countriesSupported: "ZW",
  author: person,
  creator: person,
};

/** Serialises one or more blocks as a single @graph, safe to inline in a script tag. */
export const jsonLd = (...blocks: object[]) =>
  JSON.stringify({ "@context": "https://schema.org", "@graph": blocks }).replace(/</g, "\\u003c");
