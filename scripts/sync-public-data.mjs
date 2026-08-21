// Copies data/*.json into public/data/ so the machine-readable feed keeps its
// v1 URLs (/data/projects.json, /data/posts.json, ...) in the static export.
// Runs as the npm "prebuild" hook. Source of truth stays /data.
import { cpSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, "data");
const dest = path.join(root, "public", "data");

mkdirSync(dest, { recursive: true });
let count = 0;
for (const file of readdirSync(src)) {
  if (!file.endsWith(".json")) continue;
  cpSync(path.join(src, file), path.join(dest, file));
  count += 1;
}
console.log(`sync-public-data: copied ${count} JSON file(s) to public/data/`);
