// Site-wide constants. JOB_TITLE changes must be mirrored into
// docs/profile-README.md in the same commit (carried over from v1's
// build-site.py rule).
export const SITE = "https://nanthansr.github.io";
export const NAME = "Nanthan SR";
export const JOB_TITLE = "Backend and ML Engineer";
export const BLURB =
  "Backend and ML engineer in Montreal. I ship systems end to end, not notebooks. MSc Applied Computer Science, Concordia. Open to full-time backend, ML engineering, MLOps and AI automation roles.";
export const LINKEDIN = "https://www.linkedin.com/in/nanthan-sr/";
export const GITHUB = "https://github.com/nanthansr";
export const EMAIL = "nanthansr@gmail.com";
export const BLOG = "https://nandytriesthings.hashnode.dev/";

export const PAGES = ["/", "/case-fraud-pipeline.html", "/library/"];

export const HERO_WORDS = [
  "Builder.",
  "Creator.",
  "Problem Solver.",
  "Tinkerer.",
  "Engineer.",
  "Maker.",
  "Explorer.",
];

// Named AI crawlers welcomed in robots.txt - ported verbatim from v1
// build-site.py. The AI-readability layer is why this list exists.
export const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
  "Bytespider",
  "meta-externalagent",
];
