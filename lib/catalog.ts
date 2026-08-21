// Derives the 13-book library catalog from the site's data files at build
// time - no separate book list to maintain. Projects bind in blue, writing
// in copper; every book opens its real URL.
import { getProjects, getWriting } from "./data";
import type { BookMotif, CatalogBook } from "./shelf/catalog";
import { bindingFor, hashSeed } from "./shelf/palette";

const PROJECT_MOTIFS: Record<string, BookMotif> = {
  culprit: "maze",
  "mlops-fraud-pipeline": "network",
  "aws-two-tier-project": "schematic",
  "visual-francais": "windows",
  pomofocus: "orbit",
};

const POST_MOTIFS: BookMotif[] = [
  "steps",
  "boom",
  "fracture",
  "circuit",
  "lattice",
  "continuum",
  "flight",
];

function shortTitle(title: string, max = 26): string {
  if (title.length <= max) return title;
  const words = title.split(" ");
  let out = "";
  for (const word of words) {
    if ((out + " " + word).trim().length > max) break;
    out = (out + " " + word).trim();
  }
  return out || title.slice(0, max);
}

function postSlug(url: string): string {
  return url.replace(/\/+$/, "").split("/").pop() ?? url;
}

export function buildCatalog(): CatalogBook[] {
  const projects = getProjects();
  const writing = getWriting();
  const books: CatalogBook[] = [];

  for (const p of projects) {
    const binding = bindingFor("project", p.slug);
    const seed = hashSeed(p.slug);
    books.push({
      id: p.slug,
      title: p.title,
      shortTitle: shortTitle(p.title),
      author: "Nanthan SR",
      description: p.summary,
      quote: p.tagline,
      quoteBy: "",
      format: `Project · ${p.stack[0]}`,
      availability: `${p.status[0].toUpperCase()}${p.status.slice(1)} · ${p.year}`,
      url: p.case_study ? `/${p.case_study}` : p.repo,
      internal: Boolean(p.case_study),
      ...binding,
      motif: PROJECT_MOTIFS[p.slug] ?? "efficiency",
      height: 2.1 + (seed % 5) * 0.025,
      thickness: 0.24 + (seed % 4) * 0.02,
      linkLabel: p.case_study ? "Read the case study" : "View code on GitHub",
      living: p.status === "flagship",
    });
  }

  for (const pub of writing.publications) {
    const id = `pub-${pub.name.replace(/[^a-z0-9]+/gi, "-")}`;
    books.push({
      id,
      title: pub.name,
      shortTitle: shortTitle(pub.name),
      author: "Nanthan SR",
      description: pub.description,
      quote: "Build logs and postmortems. Those are the parts worth reading.",
      quoteBy: "from the writing section",
      format: `Blog · ${pub.platform}`,
      availability: `${writing.posts.length} posts`,
      url: pub.url,
      ...bindingFor("writing", id),
      motif: "branches",
      height: 2.18,
      thickness: 0.27,
      linkLabel: "Read the blog",
    });
  }

  writing.posts.forEach((post, index) => {
    const id = postSlug(post.url);
    const seed = hashSeed(id);
    books.push({
      id,
      title: post.title,
      shortTitle: shortTitle(post.title),
      author: "nandy.triesthings",
      description: `Published ${post.date} on nandy.triesthings (${post.publication}).`,
      quote: "",
      quoteBy: "",
      format: "Blog post",
      availability: post.date,
      url: post.url,
      ...bindingFor("writing", id),
      motif: POST_MOTIFS[index % POST_MOTIFS.length],
      height: 2.02 + (seed % 4) * 0.025,
      thickness: 0.17 + (seed % 3) * 0.015,
      linkLabel: "Read the post",
    });
  });

  return books;
}
