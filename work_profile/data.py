"""All portfolio content lives here. Edit this file to update the site."""

NAME = "Prince Chakusa"
EMAIL = "chakusaprince@gmail.com"
LINKEDIN = "https://linkedin.com/in/princechakusa"
GITHUB = "https://github.com/princechakusa"
LOCATION = "Dubai, UAE"

ROLES = ["Operations Leader", "PropTech Builder", "Python Developer", "Guest Experience Lead"]

HERO_LINES = ["Operations runs on systems.", "So does software.", "I build both."]
HERO_SUB = (
    "Five years managing 350+ Dubai holiday homes taught me where the gaps are. "
    "Now I'm building the tools to close them."
)

# (number, suffix/prefix text, label). `value` drives the CSS count-up animation.
STATS = [
    {"value": 350, "prefix": "", "suffix": "+", "label": "Units managed"},
    {"value": 5, "prefix": "", "suffix": " yrs", "label": "UAE operations"},
    {"value": 40, "prefix": "-", "suffix": "%", "label": "Workload cut"},
    {"value": 200, "prefix": "", "suffix": "+", "label": "Reviews analysed"},
]

ABOUT = [
    "I started in Dubai's short-term rental market doing the unglamorous stuff: coordinating "
    "maintenance, managing housekeeping schedules, handling guests who checked in at midnight "
    "and couldn't find the key box.",
    "Over five years the portfolio grew to 350+ units, and so did my frustration with the "
    "software we had to use. Maintenance requests got lost. Guest messages took too long to "
    "answer. So I started building software to close those gaps, starting with PaMarket, an online marketplace for my home country of Zimbabwe.",
    "I'm not pretending to be a senior engineer. I'm someone who understands property "
    "operations at a serious level, can build and ship working software, and knows exactly "
    "what problem needs solving because I've lived it.",
]

DIFFERENTIATORS = [
    ("I know the problem, not just the stack",
     "Every tool I've built came from a real operational gap I hit myself."),
    ("I speak both languages",
     "OTA strategy and occupancy with owners; database schemas with developers."),
    ("I've managed real numbers",
     "350+ units, +25% review scores, -40% front desk workload, -15% costs."),
    ("I ship things",
     "PaMarket is live and open to users."),
]

EXPERIENCE = [
    {
        "role": "Guest Experience Lead",
        "company": "Luxury Homevy Vacation Homes Rental LLC",
        "dates": "Jan 2026 - Present",
        "current": True,
        "summary": (
            "Lead guest experience operations across a 40-property short-term rental portfolio "
            "on Airbnb and Booking.com. Manage a 5-person guest service team, overseeing daily "
            "SLA and SOP compliance across Hostaway and WhatsApp."
        ),
        "detail": (
            "Built and maintain the SLA/SOP compliance tracking systems that monitor response "
            "and resolution times across priority tiers. Run a guest review analytics program "
            "covering 200+ reviews, finding complaint patterns before they hit the ratings."
        ),
        "chips": ["40 properties", "200+ reviews analysed", "Airbnb", "Booking.com", "Hostaway", "SLA/SOP"],
    },
    {
        "role": "Team Leader - Property Operations",
        "company": "Stonetree Vacation Homes Rental LLC",
        "dates": "Nov 2024 - Dec 2025",
        "current": False,
        "summary": (
            "Directed day-to-day operations for 400+ short-term rental units: inspections, "
            "maintenance scheduling, DTCM compliance, and a cross-functional team covering "
            "concierge, maintenance and housekeeping."
        ),
        "detail": (
            "Developed and monitored SOPs across all property and maintenance functions. "
            "Oversaw vendor performance, negotiated SLAs, prepared management reports, and "
            "drove service recovery that protected review scores and brand reputation."
        ),
        "chips": ["400+ units", "DTCM compliance", "SOP development", "Vendor management", "Team leadership"],
    },
    {
        "role": "Guest Relations Officer",
        "company": "Daniels Holiday Homes Rental LLC",
        "dates": "Jan 2023 - Oct 2024",
        "current": False,
        "summary": (
            "Optimised guest check-in/check-out, pushing review scores up 25%. Integrated "
            "digital concierge tools that cut front desk workload by 40%."
        ),
        "detail": (
            "Implemented a CSAT and NPS feedback system that improved response time and guest "
            "satisfaction by 20%. Ran service audits from guest surveys and mentored new "
            "team members, cutting onboarding time by 20%."
        ),
        "chips": ["+25% review scores", "-40% front desk load", "+20% satisfaction", "CSAT/NPS", "Mentoring"],
    },
]

PROJECTS = [
    {
        "name": "PaMarket",
        "tagline": "Konke Endaweni Eyodwa - Everything in one place.",
        "story": (
            "An online marketplace for Zimbabwe: buy, sell and find jobs, built around local "
            "browsing behaviour and payment realities. Live and open to users."
        ),
        "tags": ["JavaScript", "HTML/CSS"],
        "kind": "Marketplace",
        "image": "/pamarket-splash.jpg",
        "repo": "https://github.com/princechakusa/PaMarket",
        "live": "https://pamarketzw.com",
        "ios": "https://apps.apple.com/app/id6794616959",
        "android": "https://play.google.com/store/apps/details?id=com.pamarket.app",
    },
]

# Skill name -> proficiency out of 100 (drives the animated bars).
SKILLS = {
    "Operations": [
        ("Property & STR Operations", 95),
        ("Team Leadership", 90),
        ("Vendor Management", 85),
        ("DTCM Compliance", 85),
        ("SOP & Process Design", 90),
    ],
    "Technical": [
        ("Python", 60),
        ("JavaScript", 65),
        ("Supabase / PostgreSQL", 70),
        ("HTML5 & CSS3", 75),
        ("Git & GitHub", 70),
    ],
}

TOOLS = ["Airbnb", "Booking.com", "Hostaway", "Microsoft 365", "Power BI", "Notion", "REST APIs", "CompTIA A+"]

EDUCATION = [
    ("Associate of Science, Computer Science", "University of the People, USA", "2026"),
    ("AML & CFT Certificate", "Anti-Money Laundering and Counter Financing of Terrorism", "Certified"),
    ("CompTIA A+ Certification", "CompTIA", "Certified"),
    ("Business Management Diploma", "Lyceum College, South Africa", "Completed"),
]

OPEN_TO = ["Operations Manager", "PropTech Role", "Operations Lead", "Entry-Level Developer"]
MARKETS = "UAE - GCC - Remote"
