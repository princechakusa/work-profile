import type { ReelProps } from "./InsightReel";

/** LinkedIn reel calendar. Work topics only: no politics, nothing about job hunting, no "about me" explainers. */
export const REELS: Record<string, ReelProps & { date: string }> = {
  "reel-01-five-star": {
    date: "2026-10-02",
    kicker: "GUEST EXPERIENCE",
    hook: ["A 5-star stay", "is decided before", "the guest arrives."],
    beats: [
      { art: "building", title: "Before arrival", text: "The guest already knows the address, the access steps and who to call, before they have to ask." },
      { art: "key", title: "Access that works", text: "Codes tested, keys accounted for. Nobody should wait in a lobby on day one." },
      { art: "checklist", title: "Inspected, not just cleaned", text: "A checklist catches what tired eyes miss after the tenth turnover of the day." },
      { art: "chat", title: "One reply standard", text: "A response time the whole team holds to. Fast answers stop small issues becoming reviews." },
      { art: "chart", title: "Reviews are data", text: "Patterns in feedback tell you exactly what to fix next." },
    ],
    close: ["Guests never see", "the system.", "They feel it."],
  },
  "reel-02-ai-guests": {
    date: "2026-10-06",
    kicker: "AI AT WORK",
    hook: ["AI can answer", "a guest in seconds.", "Should it?"],
    beats: [
      { art: "ai", title: "Let AI draft", text: "Use it to write the first reply fast. A person decides what actually gets sent." },
      { art: "checklist", title: "Start with repeats", text: "Wi-Fi, parking, check-out time. The questions you answer fifty times a week." },
      { art: "shield", title: "Keep people on the hard ones", text: "Complaints, refunds and anything sensitive stay with a human." },
      { art: "chart", title: "Measure it", text: "Response time, resolution rate and review scores show if it is really helping." },
    ],
    close: ["Speed wins the reply.", "People win", "the stay."],
  },
  "reel-03-sop": {
    date: "2026-10-09",
    kicker: "OPERATIONS",
    hook: ["An SOP nobody", "follows is", "a wish list."],
    beats: [
      { art: "team", title: "Write it with the team", text: "The people who do the job know where the real problems are." },
      { art: "key", title: "Make right the easy way", text: "If the correct step is the slowest step, people will skip it on a busy day." },
      { art: "search", title: "Check, don't assume", text: "Spot checks show whether the process lives on the floor or only on paper." },
      { art: "ladder", title: "Escalate, don't work around", text: "When something doesn't fit, raise it. Workarounds hide the problem until it grows." },
    ],
    close: ["Good systems hold", "on the busiest", "day of the year."],
  },
  "reel-04-reviews": {
    date: "2026-10-13",
    kicker: "GUEST FEEDBACK",
    hook: ["How to actually", "read 200", "guest reviews."],
    beats: [
      { art: "tags", title: "Tag every complaint", text: "One label per issue. Check-in, cleaning, response, noise." },
      { art: "chart", title: "Count, don't remember", text: "The loudest review is not always the biggest problem. The numbers are." },
      { art: "checklist", title: "Fix the top three", text: "Small fixes to the most common issues move scores more than big projects." },
      { art: "team", title: "Close the loop", text: "Tell the team what changed and why. Then watch the next month's reviews." },
    ],
    close: ["Feedback is free", "consulting.", "Read it properly."],
  },
  "reel-05-leading": {
    date: "2026-10-16",
    kicker: "LEADERSHIP",
    hook: ["Leading across", "departments.", "What holds it together."],
    beats: [
      { art: "team", title: "One shared brief", text: "Concierge, maintenance and housekeeping start the day with the same picture." },
      { art: "checklist", title: "Clear owners", text: "Every open issue has one name on it, not a department." },
      { art: "ladder", title: "Known escalation", text: "Everyone knows who to call, and when, without asking." },
      { art: "chat", title: "Recognise quiet wins", text: "The problem that never reached the guest deserves credit too." },
    ],
    close: ["Teams don't follow", "charts.", "They follow clarity."],
  },
  "reel-06-trust": {
    date: "2026-10-20",
    kicker: "TRUST AND RISK",
    hook: ["Due diligence", "isn't just", "for banks."],
    beats: [
      { art: "search", title: "Know who is staying", text: "Guest registration is a requirement, and it protects owners, neighbours and the business." },
      { art: "checklist", title: "Check that it adds up", text: "Does the booking match the guest who arrives? Small mismatches are worth a question." },
      { art: "ladder", title: "Escalate what doesn't fit", text: "Unusual payments or patterns go to the right person, not into a group chat." },
      { art: "shield", title: "Keep the record", text: "If it isn't written down, it didn't happen. Records protect everyone." },
    ],
    close: ["Trust is built", "on checks", "done quietly."],
  },
};
