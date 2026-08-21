// Alt text for project diagrams is authored once, inside each SVG's
// aria-label, and extracted at build time - a direct port of _alt() from
// v1's scripts/build-site.py. Hard-fails when a diagram is missing so a
// project can never ship without its figure.
import { readFileSync } from "node:fs";
import path from "node:path";

export function diagramAlt(imageStem: string): string {
  const file = path.join(
    process.cwd(),
    "public",
    `${imageStem.replace(/^\/?/, "")}-light.svg`,
  );
  let svg: string;
  try {
    svg = readFileSync(file, "utf-8");
  } catch {
    throw new Error(
      `Missing diagram ${file} - run: python scripts/build-diagrams.py`,
    );
  }
  const match = svg.match(/aria-label="([^"]+)"/);
  if (!match) {
    throw new Error(`No aria-label in ${file} - alt text is authored there.`);
  }
  return match[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&");
}
