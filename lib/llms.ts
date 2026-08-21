// llms.txt - a plain-markdown map of this site for language models reading
// it directly. Same facts as the page, no navigation to wade through.
// Direct port of llms_txt() from v1's build-site.py.
import {
  BLURB,
  EMAIL,
  GITHUB,
  LINKEDIN,
  NAME,
  PAGES,
  SITE,
} from "./site";
import type { Post, Project, Publication } from "./types";

export function llmsTxt(
  projects: Project[],
  writing: { publications: Publication[]; posts: Post[] },
): string {
  const lines: string[] = [
    `# ${NAME}`,
    "",
    `> ${BLURB}`,
    "",
    `- Site: ${SITE}/`,
    `- GitHub: ${GITHUB}`,
    `- LinkedIn: ${LINKEDIN}`,
    `- Email: ${EMAIL}`,
    "- Location: Montreal, Quebec, Canada",
    "- Languages: Tamil (native), English (advanced), French (B1, working toward B2)",
    "",
    "Every number below is reproducible from the linked repository. Nothing here",
    "is an estimate presented as a measurement.",
    "",
    "## Projects",
    "",
  ];
  for (const p of projects) {
    lines.push(`### ${p.title} (${p.year})`, "", `${p.tagline}.`, "", p.summary, "");
    lines.push(...p.facts.map((f) => `- ${f}`));
    lines.push("", `- Stack: ${p.stack.join(", ")}`, `- Repository: ${p.repo}`);
    if (p.case_study) lines.push(`- Case study: ${SITE}/${p.case_study}`);
    lines.push("");
  }
  lines.push("## Writing", "");
  for (const pub of writing.publications) {
    lines.push(`- [${pub.name}](${pub.url}) on ${pub.platform} - ${pub.description}`);
  }
  lines.push("");
  for (const p of writing.posts) {
    lines.push(`- ${p.date}: [${p.title}](${p.url})`);
  }
  lines.push("", "## Pages", "");
  for (const pg of PAGES) {
    lines.push(`- ${SITE}${pg}`);
  }
  lines.push("");
  return lines.join("\n");
}
