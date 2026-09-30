/**
 * Every fact on the site lives here, so the pages never disagree with each other.
 * Numbers come from Prince. Lines marked DRAFT were written for him and still need his confirmation.
 */

export const CONTACT = {
  email: "chakusaprince@gmail.com",
  linkedin: "https://linkedin.com/in/princechakusa",
  github: "https://github.com/princechakusa",
  location: "Abu Dhabi, UAE",
  from: "Zimbabwe",
  open: "Open to roles in the UAE, the GCC and remote",
};

export type Role = {
  id: string;
  when: string;
  title: string;
  company: string;
  current?: boolean;
  did: string[];
  added: string[];
  learned: string;
  note?: string;
};

export const ROLES: Role[] = [
  {
    id: "authors",
    when: "Apr 2026 — Now",
    title: "Guest Relations Executive Supervisor",
    company: "The Authors Holiday Homes",
    current: true,
    did: [
      "I supervise the guest relations team and make sure that every guest is looked after from arrival to departure.",
      "I handle escalated guest issues, and I coach the team to resolve problems the first time.",
    ],
    added: [
      "I improved the company's systems, so the team works from clearer tools and processes.",
      "I improved the way the team is managed, so standards hold on every shift.",
    ],
    learned: "How to build a team that delivers the same standard every day.",
  },
  {
    id: "homevy",
    when: "Jan 2026 — Mar 2026",
    title: "Guest Experience Lead",
    company: "Luxury Homevy",
    did: [
      "I led the guest experience across 40 properties with a team of 5.",
      "We communicated with guests through Hostaway and WhatsApp.",
    ],
    added: [
      "I analysed more than 200 guest reviews to show the company what guests value most.",
      "I tracked our service levels (SLAs) and procedures (SOPs) across the portfolio.",
    ],
    learned: "How to turn guest feedback into better service.",
    note: "The company scaled back after a market-wide drop in bookings, and I moved on to my current role.",
  },
  {
    id: "stonetree",
    when: "Nov 2024 — Dec 2025",
    title: "Customer Care Agent, promoted to Team Leader of Property Operations",
    company: "Stonetree",
    did: [
      "I joined as a Customer Care Agent and was promoted to Team Leader of Property Operations.",
      "I was responsible for more than 350 units.",
      "I led a team of 12 across concierge, maintenance and housekeeping.",
    ],
    added: [
      "I kept the portfolio compliant with DTCM holiday home rules.",
      "I put standard operating procedures (SOPs) in place, so service was consistent across every unit.",
      "I managed vendor service level agreements (SLAs) and reported on operations to management.",
    ],
    learned: "How to lead a team, and how to keep standards consistent across a large portfolio.",
  },
  {
    id: "daniels",
    when: "Jan 2023 — Oct 2024",
    title: "Guest Relations Officer",
    company: "Daniels Holiday Homes",
    did: ["I welcomed guests, checked them in, and supported them throughout their stay."],
    added: [
      "Guest review scores increased by 25%.",
      "Guest satisfaction (CSAT and NPS) increased by 20%.",
      "Front desk workload fell by 40% with digital concierge tools.",
      "Onboarding time fell by 20%.",
    ],
    learned: "How to understand what a guest needs, and how to solve problems quickly.",
  },
];

export const CAREER_STATS = [
  { n: "4", l: "UAE holiday home companies" },
  { n: "350+", l: "Units I was responsible for" },
  { n: "12", l: "People in my largest team" },
  { n: "+25%", l: "Guest review scores at Daniels" },
];

export type Study = {
  name: string;
  status: string;
  done: boolean;
  what: string;
  applied: string[];
  levelUp: string;
};

// DRAFT: the "what" and "levelUp" lines were written for Prince from his roles; confirm them.
export const STUDY: Study[] = [
  {
    name: "Associate of Science in Computer Science",
    status: "Completed 2026",
    done: true,
    what: "Programming, systems and software development.",
    applied: ["PaMarket", "FixHub", "Luxury Homevy", "The Authors Holiday Homes"],
    levelUp:
      "It turned me from someone who uses systems into someone who builds them. It is how I built PaMarket and FixHub, and why I pick up tools like Hostaway quickly.",
  },
  {
    name: "Business Management Diploma",
    status: "Completed",
    done: true,
    what: "Planning, organising people and running operations.",
    applied: ["Stonetree", "The Authors Holiday Homes"],
    levelUp:
      "It gave me the structure to plan and lead. I used it when I led a team of 12 across 350+ units at Stonetree, and I use it now as a supervisor.",
  },
  {
    name: "CompTIA A+",
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
    what: "Anti-money laundering and countering the financing of terrorism.",
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
    { k: "My role", v: "I designed and built it" },
    { k: "Status", v: "Live, with real listings" },
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
    { t: "Code", h: "https://github.com/princechakusa/PaMarket" },
  ],
  shots: [
    { src: "/pamarket/web-desktop.jpg", alt: "PaMarket website home page", kind: "desktop" },
    { src: "/pamarket/web-mobile.jpg", alt: "PaMarket website on a phone", kind: "phone" },
    { src: "/pamarket/pamarket-splash.jpg", alt: "PaMarket app opening screen", kind: "phone" },
    { src: "/pamarket/pamarket-account.jpg", alt: "PaMarket app account screen", kind: "phone" },
  ],
};

export const FIXHUB = {
  summary:
    "A maintenance ticketing system for property managers. A manager can log a job, assign it and track it until it is fixed. I built it because maintenance requests were getting lost in group chats.",
  links: [{ t: "Code", h: "https://github.com/princechakusa/fixhub-backend" }],
};

// DRAFT: Home page about lines, written for Prince from his story.
export const ABOUT = [
  "I am Prince Chakusa, from Zimbabwe and based in Abu Dhabi.",
  "I have worked in UAE holiday homes since 2023. I started at the front desk, checking guests in, and I have moved up to lead teams, run a portfolio of more than 350 units, and supervise guest relations.",
  "I also build software. PaMarket, my marketplace for Zimbabwe, is live on the web, the App Store and Google Play.",
  "I have completed a degree in computer science, and I am now studying business administration.",
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
  { t: "Tools", items: ["Hostaway", "WhatsApp for guest communication", "Digital concierge tools"] },
  { t: "Technology", items: ["Software development", "JavaScript", "HTML and CSS", "Supabase and PostgreSQL", "IT support (CompTIA A+)"] },
];

export const QUOTE = {
  text: "Prince is one of those colleagues who looks for ways to make things better. During our time working together, he consistently demonstrated strong operational instincts and a real commitment to follow-through. The projects he has since built, including analytics and maintenance tools, reflect exactly the initiative and problem-solving mindset I saw in him firsthand.",
  by: "Anna Wilcox",
  role: "Chief Accountant · LinkedIn recommendation, March 2026",
  link: "https://www.linkedin.com/in/princechakusa/details/recommendations/",
};
