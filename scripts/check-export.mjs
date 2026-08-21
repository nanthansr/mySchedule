// The machine gate for the static export - v2's replacement for
// `build-site.py --check`. Run after `npm run build`; exits 1 on any
// violation of the rules the site is built around.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, "out");
let failures = 0;

function fail(msg) {
  failures += 1;
  console.error(`  FAIL ${msg}`);
}
function ok(msg) {
  console.log(`  ok   ${msg}`);
}
function read(rel) {
  return readFileSync(path.join(out, rel), "utf-8");
}
function count(haystack, needle) {
  return haystack.split(needle).length - 1;
}

if (!existsSync(out)) {
  console.error("out/ does not exist - run `npm run build` first");
  process.exit(2);
}

const projects = JSON.parse(
  readFileSync(path.join(root, "data", "projects.json"), "utf-8"),
).projects;
const posts = JSON.parse(
  readFileSync(path.join(root, "data", "posts.json"), "utf-8"),
);

// 1a. home page: every project as a real <article>, text in the bytes
console.log("== home page");
const home = read("index.html");
const articles = count(home, "<article");
articles >= 5 ? ok(`${articles} <article> elements`) : fail(`only ${articles} <article> elements`);
for (const p of projects) {
  home.includes(p.title) ? ok(`project: ${p.title}`) : fail(`missing project title: ${p.title}`);
}
home.includes("Backend and ML Engineer")
  ? ok("job title present")
  : fail("job title missing");
const jsonld = count(home, "application/ld+json");
jsonld >= 7 ? ok(`${jsonld} JSON-LD references`) : fail(`only ${jsonld} JSON-LD references`);

// 1b. library page: all 13 volumes in the served HTML
console.log("== library page");
if (!existsSync(path.join(out, "library", "index.html"))) {
  fail("out/library/index.html missing");
} else {
  const library = read(path.join("library", "index.html"));
  const wanted = [
    ...projects.map((p) => p.title),
    ...posts.publications.map((p) => p.name),
    ...posts.posts.map((p) => p.url),
  ];
  const missing = wanted.filter((w) => !library.includes(w));
  missing.length === 0
    ? ok(`all ${wanted.length} volumes in the HTML`)
    : fail(`library page missing: ${missing.join(", ")}`);
}

// 2. machine-readable surface
console.log("== machine-readable surface");
for (const f of ["llms.txt", "robots.txt", "sitemap.xml"]) {
  existsSync(path.join(out, f)) ? ok(f) : fail(`${f} missing`);
}
const AI_CRAWLERS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-Web",
  "anthropic-ai", "PerplexityBot", "Google-Extended", "CCBot",
  "Applebot-Extended", "Bytespider", "meta-externalagent",
];
const robots = read("robots.txt");
const missingBots = AI_CRAWLERS.filter((b) => !robots.includes(b));
missingBots.length === 0
  ? ok("all 12 AI crawlers in robots.txt")
  : fail(`robots.txt missing: ${missingBots.join(", ")}`);
const sitemap = read("sitemap.xml");
for (const page of ["/", "/case-fraud-pipeline.html", "/library/"]) {
  sitemap.includes(`https://nanthansr.github.io${page}</loc>`)
    ? ok(`sitemap: ${page}`)
    : fail(`sitemap missing ${page}`);
}

// 3. public data feed parses
console.log("== public data feed");
for (const f of ["projects.json", "posts.json"]) {
  try {
    JSON.parse(read(path.join("data", f)));
    ok(`data/${f} parses`);
  } catch {
    fail(`data/${f} missing or invalid`);
  }
}

// 4. no retired fabricated figures anywhere in the export
console.log("== honesty greps");
const fabricated = /99\.2%|18ms|AUC-PR 0\.87|xgboost_v3/;
function htmlFiles(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...htmlFiles(full));
    else if (entry.endsWith(".html")) found.push(full);
  }
  return found;
}
const dirty = htmlFiles(out).filter((f) =>
  fabricated.test(readFileSync(f, "utf-8")),
);
dirty.length === 0
  ? ok("no retired fabricated figures")
  : fail(`fabricated figure found in: ${dirty.join(", ")}`);

// 5. private files never ship
console.log("== private files");
for (const banned of ["docs", "scripts", "CLAUDE.md", "README.md"]) {
  existsSync(path.join(out, banned))
    ? fail(`${banned} leaked into out/`)
    : ok(`${banned} not exported`);
}

// 6. case study ships byte-identical
console.log("== case study");
const src = readFileSync(path.join(root, "public", "case-fraud-pipeline.html"));
const exported = readFileSync(path.join(out, "case-fraud-pipeline.html"));
src.equals(exported)
  ? ok("case-fraud-pipeline.html byte-identical")
  : fail("case-fraud-pipeline.html differs from public/ source");

// 7. resume is real
console.log("== resume");
existsSync(path.join(out, "resume.pdf"))
  ? ok("resume.pdf exported")
  : fail("resume.pdf missing");

// 8. license hygiene: no Stripe-harvested asset code in the shelf port
console.log("== shelf license hygiene");
const shelfDir = path.join(root, "lib", "shelf");
const shelfDirty = readdirSync(shelfDir).filter((f) =>
  /stripe-assets|stripe-foil|OBJLoader/.test(
    readFileSync(path.join(shelfDir, f), "utf-8"),
  ),
);
shelfDirty.length === 0
  ? ok("no Stripe asset code paths in lib/shelf")
  : fail(`Stripe asset references in: ${shelfDirty.join(", ")}`);

// 9. no Cyrillic homoglyphs in the stylesheet (the v1 --surface bug)
console.log("== stylesheet homoglyphs");
const css = readFileSync(path.join(root, "app", "globals.css"), "utf-8");
/[Ѐ-ӿ]/.test(css)
  ? fail("Cyrillic character in app/globals.css")
  : ok("globals.css clean");

console.log("");
if (failures > 0) {
  console.error(`export NOT verified - ${failures} failure(s)`);
  process.exit(1);
}
console.log("export verified");
