/**
 * Prince Chakusa's canonical professional identity. The pages, metadata, structured data, link-preview image and CV
 * all read their identity from here, so the site never describes him two different ways.
 *
 * Current title (Prince, 2026-10-01): "Guest Relations Supervisor". Do not use "Guest Relations Executive Supervisor".
 * Education institutions and the CompTIA scope come from his resume (web/cv/cv.html).
 */

export const PROFILE = {
  name: "Prince Chakusa",
  currentRole: "Guest Relations Supervisor",
  currentEmployer: "The Authors Holiday Homes",
  currentSince: "April 2026",
  location: { city: "Abu Dhabi", country: "United Arab Emirates", countryCode: "AE", label: "Abu Dhabi, UAE" },
  from: "Zimbabwe",

  /** One line under the name. */
  headline: "Guest Relations Supervisor · Hospitality and property operations · Software developer",

  /** The canonical description of Prince: what search engines and AI answers should quote. */
  summary:
    "Prince Chakusa is a Guest Relations Supervisor at The Authors Holiday Homes in Abu Dhabi, UAE. Since 2023 he has worked across four UAE holiday home companies, from front desk guest relations to leading a team of 12 and directing day-to-day operations for more than 350 short-term rental units, including DTCM compliance, standard operating procedures and vendor SLAs. He also develops software: he designed and built PaMarket, a live marketplace for Zimbabwe on the web, iOS and Android. He holds an Associate of Science in Computer Science and is studying for a Bachelor of Business Administration and an AML-CFT certificate.",

  /** Short form for meta descriptions (under 160 characters). */
  short: "Guest Relations Supervisor in Abu Dhabi with UAE hospitality and property operations experience, and the developer of PaMarket.",

  areas: [
    "Guest relations",
    "Guest experience",
    "Hospitality operations",
    "Property operations",
    "Short-term rental operations",
    "Team leadership",
    "DTCM compliance",
    "Standard operating procedures (SOPs)",
    "Vendor management and SLAs",
    "Operational systems",
    "Software development",
    "Mobile app development",
    "AML-CFT (professional development, in progress)",
  ],

  email: "chakusaprince@gmail.com",
  phone: "+971 58 977 2645",
  whatsapp: "https://wa.me/971589772645?text=Hi%20Prince%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20talk%20about%20a%20role.",
  linkedin: "https://www.linkedin.com/in/princechakusa",
  github: "https://github.com/princechakusa",
  availability: "Open to roles in the UAE, the GCC and remote",
  seeking: "guest relations, guest experience, hospitality and property operations roles, and roles that bring operations and technology together",
};
