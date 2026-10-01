import { asset } from "@/lib/site";
import { PROFILE } from "@/lib/profile";

/**
 * Every fact on the site lives here, so the pages never disagree with each other.
 * Numbers and wording are confirmed by Prince (2026-10-01).
 */

// contact details come from the canonical profile
export const CONTACT = {
  email: PROFILE.email,
  linkedin: PROFILE.linkedin,
  github: PROFILE.github,
  phone: PROFILE.phone,
  whatsapp: PROFILE.whatsapp,
  location: PROFILE.location.label,
  from: PROFILE.from,
  open: PROFILE.availability,
};

export type Role = {
  id: string;
  when: string;
  title: string;
  company: string;
  location: string;
  current?: boolean;
  did: string[];
  added: string[];
  learned: string;
  note?: string;
};

export const ROLES: Role[] = [
  {
    id: "authors",
    when: "Apr 2026 to now",
    title: PROFILE.currentRole,
    company: PROFILE.currentEmployer,
    location: "Abu Dhabi, UAE",
    current: true,
    did: [
      "Supervise the guest relations team, ensuring every guest is looked after from arrival to departure.",
      "Handle escalated guest issues and coach the team to resolve problems at first contact.",
    ],
    added: [
      "Improved the company's operating systems, giving the team clearer tools and processes.",
      "Strengthened team management, so service standards hold on every shift.",
    ],
    learned: "How to build a team that delivers the same standard every day.",
  },
  {
    id: "homevy",
    when: "Jan 2026 to Mar 2026",
    title: "Guest Experience Lead",
    company: "Luxury Homevy Vacation Homes",
    location: "Dubai, UAE",
    did: [
      "Led guest experience operations across a 40-property short-term rental portfolio with a team of 5.",
      "Managed guest communication across Hostaway and WhatsApp, maintaining daily SLA and SOP compliance.",
    ],
    added: [
      "Analysed more than 200 guest reviews to identify recurring issues and what guests value most.",
      "Built SLA and SOP compliance tracking to monitor response and resolution times across the portfolio.",
    ],
    learned: "How to turn guest feedback into better service.",
    note: "The company scaled back after a market-wide drop in bookings, and I moved on to my current role.",
  },
  {
    id: "stonetree",
    when: "Nov 2024 to Dec 2025",
    title: "Customer Care Agent, promoted to Team Leader of Property Operations",
    company: "Stonetree Vacation Homes",
    location: "Dubai, UAE",
    did: [
      "Promoted from Customer Care Agent to Team Leader of Property Operations.",
      "Directed day-to-day operations for more than 350 short-term rental units, ensuring guest satisfaction and operational efficiency.",
      "Led a cross-functional team of 12 across concierge, maintenance and housekeeping.",
    ],
    added: [
      "Ensured full DTCM compliance across property listings, permits and regulatory documentation.",
      "Standardised operating procedures across all units, reducing annual operational costs by 15%.",
      "Managed vendor contracts and service level agreements, and prepared performance reports for management.",
    ],
    learned: "How to lead a team, and how to keep standards consistent across a large portfolio.",
  },
  {
    id: "daniels",
    when: "Jan 2023 to Oct 2024",
    title: "Guest Relations Officer",
    company: "Daniels Holiday Homes",
    location: "Dubai, UAE",
    did: ["Delivered guest check-in and front desk support, looking after guests throughout their stay.", "Conducted service audits based on guest surveys to guide operational improvements."],
    added: [
      "Optimised check-in and check-out processes, improving guest review scores by 25%.",
      "Implemented a CSAT and NPS feedback system, improving guest satisfaction by 20%.",
      "Integrated digital concierge tools, reducing front desk workload by 40%.",
      "Mentored new team members, reducing onboarding time by 20%.",
    ],
    learned: "How to understand what a guest needs, and how to solve problems quickly.",
  },
];

/** Compliance and operational-control work across his roles, all taken from the role history above and his CV. */
export const COMPLIANCE = [
  { t: "DTCM compliance", d: "Kept property listings, permits and regulatory documentation compliant with Dubai's DTCM holiday home rules across 350+ units at Stonetree." },
  { t: "Standard operating procedures", d: "Standardised SOPs across every unit at Stonetree, cutting annual operating costs by 15%." },
  { t: "Vendor management and SLAs", d: "Managed vendor contracts and service level agreements at Stonetree, and reported performance to management." },
  { t: "SLA and SOP monitoring", d: "Built tracking for response and resolution times across Hostaway and WhatsApp at Luxury Homevy." },
  { t: "Audits and inspections", d: "Ran service audits from guest surveys at Daniels Holiday Homes, and property inspections and service recovery at Stonetree." },
];

/** AML-CFT is professional development in progress, not a current role or a completed certificate. */
export const AML = {
  status: "In progress",
  covers: "Anti-money laundering (AML) and countering the financing of terrorism (CFT): customer due diligence, recognising suspicious activity, record keeping and reporting obligations.",
  why: "I am studying for an AML-CFT certificate to build on the compliance side of my operations work: regulatory documentation, operational controls, SOPs, monitoring against agreed standards, and an eye for risk.",
  builds: ["DTCM compliance and regulatory documentation", "SOPs and operational controls", "SLA monitoring and reporting", "Audits, inspections and risk awareness"],
  note: "The certificate is still in progress. It is professional development alongside my hospitality career; I have not held an AML role.",
};

export const CAREER_STATS = [
  { n: "4", l: "UAE holiday home companies" },
  { n: "350+", l: "Units I was responsible for" },
  { n: "12", l: "People in my largest team" },
  { n: "+25%", l: "Guest review scores at Daniels" },
];

export type Study = {
  name: string;
  institution?: string;
  status: string;
  done: boolean;
  what: string;
  applied: string[];
  levelUp: string;
};

// The "what" and "levelUp" lines were written from his roles and confirmed by Prince.
export const STUDY: Study[] = [
  {
    name: "Associate of Science in Computer Science",
    institution: "University of the People",
    status: "Completed 2026",
    done: true,
    what: "Programming, systems and software development.",
    applied: ["PaMarket", "FixHub", "Luxury Homevy", "The Authors Holiday Homes"],
    levelUp:
      "It turned me from someone who uses systems into someone who builds them. It is how I built PaMarket and FixHub, and why I pick up tools like Hostaway quickly.",
  },
  {
    name: "Business Management Diploma",
    institution: "Lyceum College, South Africa",
    status: "Completed",
    done: true,
    what: "Planning, organising people and running operations.",
    applied: ["Stonetree", "The Authors Holiday Homes"],
    levelUp:
      "It gave me the structure to plan and lead. I used it when I led a team of 12 across 350+ units at Stonetree, and I use it now as a supervisor.",
  },
  {
    name: "CompTIA A+ Core 1",
    institution: "CompTIA",
    status: "Completed",
    done: true,
    what: "IT support: hardware, software, networks and troubleshooting.",
    applied: ["Daniels Holiday Homes", "Stonetree", "Luxury Homevy", "The Authors Holiday Homes"],
    levelUp:
      "I can fix technical problems myself instead of waiting for help, from the digital concierge tools at the front desk to the systems my team uses every day.",
  },
  {
    name: "Bachelor of Business Administration",
    status: "In progress",
    done: false,
    what: "Leadership, finance, strategy and management.",
    applied: ["The Authors Holiday Homes"],
    levelUp: "It is building the leadership and decision-making that I use as a supervisor today, and it prepares me for management roles.",
  },
  {
    name: "AML-CFT Certificate",
    status: "In progress",
    done: false,
    what: "Anti-money laundering and countering the financing of terrorism: professional development, currently in progress.",
    applied: ["Stonetree", "The Authors Holiday Homes"],
    levelUp: "It builds on the DTCM compliance work that I did at Stonetree, and it strengthens the checks I bring to every operation.",
  },
];

export const PAMARKET = {
  tagline: "Konke Endaweni Eyodwa: everything in one place.",
  summary:
    "PaMarket is an online marketplace that I designed and built for Zimbabwe. People use it to buy and sell, find work, rent or buy cars, and discover verified businesses, on the web and in the iPhone and Android apps.",
  glance: [
    { k: "What it is", v: "An online marketplace and jobs board" },
    { k: "Where", v: "Zimbabwe, across all 10 provinces" },
    { k: "Platforms", v: "Website, App Store and Google Play" },
    { k: "Currencies", v: "US dollars and ZiG, with a live rate" },
    { k: "My role", v: "Product design and software development: apps, website and backend" },
    { k: "Built with", v: "React Native, Expo, TypeScript, Supabase, PostgreSQL" },
    { k: "Status", v: "Live, with real listings" },
  ],
  // from the project's repository and README
  role: "I designed the product and developed it end to end: the iPhone and Android apps, the website and the backend.",
  techSummary: "React Native, Expo and TypeScript (apps); a JavaScript progressive web app (website); Supabase and PostgreSQL (backend); Firebase (notifications)",
  stack: [
    { t: "Mobile apps", d: "React Native and Expo, in TypeScript, published on the App Store and Google Play" },
    { t: "Website", d: "A JavaScript progressive web app at pamarketzw.com" },
    { t: "Backend", d: "Supabase and PostgreSQL" },
    { t: "Notifications", d: "Firebase" },
  ],
  categories: ["Vehicles", "Property and rentals", "Phones and electronics", "Agriculture and farming", "Services and trades", "Jobs", "Campus gear", "Businesses", "Institutions"],
  why: [
    "In Zimbabwe, buying, selling and job hunting were scattered across many different group chats and social media posts.",
    "There was no proper search, no categories, and no protection for the buyer or the seller.",
    "I built PaMarket so that people have one trusted place for all of it.",
  ],
  features: [
    { t: "Marketplace", d: "Buy and sell across all 10 provinces, from phones and electronics to property and farming." },
    { t: "Jobs", d: "Employers post vacancies and people find work in the same place." },
    { t: "Verified businesses", d: "Businesses and institutions are verified before they are listed." },
    { t: "Cars", d: "Cars for sale and car rental in their own sections." },
    { t: "Two currencies", d: "Prices in US dollars or ZiG, with a live exchange rate." },
    { t: "Safer trading", d: "Fraud screening, escrow protection and 24/7 WhatsApp support." },
  ],
  helps: [
    { who: "Buyers", how: "find what they need faster, and trade more safely." },
    { who: "Sellers", how: "reach people across the whole country, not just one group chat." },
    { who: "Job seekers", how: "see real vacancies in one place." },
  ],
  links: [
    { t: "Website", h: "https://pamarketzw.com" },
    { t: "App Store", h: "https://apps.apple.com/app/id6794616959" },
    { t: "Google Play", h: "https://play.google.com/store/apps/details?id=com.pamarket.app" },
    { t: "Source code", h: "https://github.com/princechakusa/PaMarket" },
  ],
  shots: [
    { src: asset("/pamarket/web-desktop.jpg"), alt: "PaMarket website home page", kind: "desktop" },
    { src: asset("/pamarket/web-mobile.jpg"), alt: "PaMarket website on a phone", kind: "phone" },
    { src: asset("/pamarket/pamarket-splash.jpg"), alt: "PaMarket app opening screen", kind: "phone" },
    { src: asset("/pamarket/pamarket-account.jpg"), alt: "PaMarket app account screen", kind: "phone" },
  ],
};

export const FIXHUB = {
  summary:
    "A maintenance ticketing system for property managers. A manager can log a job, assign it and track it until it is fixed. I built it because maintenance requests were getting lost in group chats.",
  links: [{ t: "GitHub profile", h: "https://github.com/princechakusa" }],
};

// Home page about lines, confirmed by Prince.
export const ABOUT = [
  "I am Prince Chakusa, from Zimbabwe and based in Abu Dhabi.",
  "I have worked in UAE holiday homes since 2023. I started at the front desk, checking guests in, and I have moved up to lead teams, run a portfolio of more than 350 units, and supervise guest relations.",
  "I also build software. PaMarket, my marketplace for Zimbabwe, is live on the web, the App Store and Google Play.",
  "I have completed a degree in computer science, and I am now studying business administration.",
];

/**
 * Direct answers for the home page: the questions search engines and AI assistants are asked about Prince.
 * Every answer restates facts already on the site; AML-CFT is described as study in progress, never as a role.
 */
export const ANSWERS: { q: string; a: string; link?: { href: string; t: string } }[] = [
  {
    q: "Who is Prince Chakusa?",
    a: `Prince Chakusa is a ${PROFILE.currentRole} at ${PROFILE.currentEmployer} in ${PROFILE.location.label}. He works in hospitality and property operations, and he also develops software, including the PaMarket marketplace.`,
  },
  {
    q: "What does Prince Chakusa do?",
    a: "He supervises the guest relations team at The Authors Holiday Homes: he makes sure every guest is looked after from arrival to departure, handles escalated guest issues, coaches the team, and has improved the company's operating systems and team management.",
    link: { href: "/work", t: "See his work history" },
  },
  {
    q: "Where is Prince Chakusa based?",
    a: `He is based in ${PROFILE.location.city}, United Arab Emirates. He is originally from ${PROFILE.from}.`,
  },
  {
    q: "What is Prince Chakusa's professional background?",
    a: "He started in 2023 as a Guest Relations Officer at Daniels Holiday Homes in Dubai, joined Stonetree Vacation Homes as a Customer Care Agent and was promoted to Team Leader of Property Operations, led guest experience at Luxury Homevy Vacation Homes, and became Guest Relations Supervisor at The Authors Holiday Homes in April 2026.",
  },
  {
    q: "What experience does Prince Chakusa have in hospitality operations?",
    a: "At Stonetree he directed day-to-day operations for more than 350 short-term rental units, including DTCM compliance, standard operating procedures, vendor SLAs and performance reporting; standardising procedures cut annual operating costs by 15%. At Luxury Homevy he led guest experience for a 40-property portfolio, and at Daniels Holiday Homes he raised guest review scores by 25%.",
  },
  {
    q: "What leadership experience does Prince Chakusa have?",
    a: "He led a team of 12 across concierge, maintenance and housekeeping at Stonetree, a team of 5 at Luxury Homevy, and now supervises the guest relations team at The Authors Holiday Homes. At Daniels Holiday Homes he mentored new staff, cutting onboarding time by 20%.",
  },
  {
    q: "What technology projects has Prince Chakusa built?",
    a: "PaMarket, a live marketplace and jobs board for Zimbabwe; FixHub, a maintenance ticketing tool for property managers; and this interactive portfolio, built with Next.js, TypeScript and Three.js.",
    link: { href: "/projects", t: "See his projects" },
  },
  {
    q: "What is PaMarket?",
    a: "PaMarket is an online marketplace and jobs board for Zimbabwe, live on the web, the App Store and Google Play. People use it to buy and sell across all 10 provinces, find work, buy or rent cars and discover verified businesses. Prince designed it and developed the apps (React Native and Expo), the website and the Supabase and PostgreSQL backend.",
  },
  {
    q: "What education does Prince Chakusa have?",
    a: "An Associate of Science in Computer Science from the University of the People (completed 2026), a Diploma in Business Management from Lyceum College, and CompTIA A+ Core 1. He is studying for a Bachelor of Business Administration.",
    link: { href: "/education", t: "See his education" },
  },
  {
    q: "What AML-CFT development does Prince Chakusa have?",
    a: "He is studying for an AML-CFT (anti-money laundering and countering the financing of terrorism) certificate, which is in progress. It builds on his compliance experience in property operations, such as DTCM compliance, regulatory documentation, SOPs and operational controls. He has not held an AML role.",
    link: { href: "/education#aml-cft", t: "About his AML-CFT studies" },
  },
  {
    q: "Is Prince Chakusa open to new opportunities?",
    a: `Yes. He is open to ${PROFILE.seeking}, in the UAE, the GCC and remote.`,
    link: { href: "/contact", t: "Contact him" },
  },
];

export const DRIVES = [
  { t: "Great stays", d: "A guest who leaves happy is the whole point of the job. I still measure my work by that." },
  { t: "Fixing problems at the source", d: "When the same problem keeps coming back, I would rather build the fix than keep working around it." },
  { t: "Growing people", d: "I enjoy coaching a team until it delivers the same standard every day." },
  { t: "Building for home", d: "PaMarket started because people in Zimbabwe needed a safer, simpler way to buy, sell and find work." },
];

export const STRENGTHS = [
  { t: "Guest experience", d: "From check-in to review, I know what makes a stay great." },
  { t: "Leadership", d: "I have led teams of up to 12 people across concierge, maintenance and housekeeping." },
  { t: "Operations", d: "DTCM compliance, SOPs, vendor SLAs and reporting across 350+ units." },
  { t: "Technology", d: "I build software and solve technical problems myself." },
  { t: "Learning fast", d: "Promoted within a year, and always studying something new." },
];

export const REASONS = [
  {
    t: "I have worked at every level",
    d: "Front desk, customer care, team leader, guest experience lead and supervisor. I know what each role needs because I have done it.",
  },
  {
    t: "My results are measurable",
    d: "At Daniels Holiday Homes, review scores rose by 25% and satisfaction by 20%, while front desk workload fell by 40% and onboarding time by 20%. At Stonetree I was responsible for more than 350 units.",
  },
  {
    t: "I bring operations and technology together",
    d: "I run operations, and I build software. When a process is broken, I can fix it at the source, the way I did with FixHub.",
  },
  {
    t: "I keep levelling up",
    d: "I was promoted within my first year at Stonetree. I have completed computer science, and I am studying business administration and AML-CFT.",
  },
];

export const SKILLS = [
  { t: "Operations", items: ["Guest relations", "Check-in and guest support", "Team leadership and coaching", "DTCM compliance", "SOPs", "Vendor SLAs", "Reporting", "Review analysis"] },
  { t: "Platforms", items: ["Hostaway", "Airbnb", "Booking.com", "WhatsApp", "Bitrix24", "Slack", "Notion", "Microsoft 365", "Digital concierge tools"] },
  { t: "Technology", items: ["Software development", "TypeScript", "JavaScript", "React Native and Expo", "Next.js and React", "HTML and CSS", "Supabase and PostgreSQL", "IT support (CompTIA A+ Core 1)"] },
];

export const QUOTE = {
  text: "Prince is one of those colleagues who looks for ways to make things better. During our time working together, he consistently demonstrated strong operational instincts and a real commitment to follow-through. The projects he has since built, including analytics and maintenance tools, reflect exactly the initiative and problem-solving mindset I saw in him firsthand.",
  by: "Anna Wilcox",
  role: "Chief Accountant · LinkedIn recommendation, March 2026",
  link: "https://www.linkedin.com/in/princechakusa/details/recommendations/",
};
