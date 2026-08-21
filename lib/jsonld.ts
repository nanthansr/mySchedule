// Structured data - a direct port of jsonld() from v1's build-site.py.
// One Person block, one SoftwareSourceCode per project, one Blog per
// publication.
import { BLURB, EMAIL, GITHUB, JOB_TITLE, LINKEDIN, NAME, SITE } from "./site";
import type { Post, Project, Publication } from "./types";

export function jsonLdBlocks(
  projects: Project[],
  writing: { publications: Publication[]; posts: Post[] },
): object[] {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: NAME,
    jobTitle: JOB_TITLE,
    description: BLURB,
    url: `${SITE}/`,
    email: `mailto:${EMAIL}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Montreal",
      addressRegion: "QC",
      addressCountry: "CA",
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Concordia University" },
    knowsAbout: [...new Set(projects.flatMap((p) => p.stack))].sort(),
    knowsLanguage: ["Tamil", "English", "French"],
    sameAs: [LINKEDIN, GITHUB, ...writing.publications.map((p) => p.url)],
    seeks: {
      "@type": "Demand",
      name: "Full-time backend, ML engineering, MLOps or AI automation roles in Canada",
    },
  };

  const works = projects.map((p) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: p.title,
    description: p.tagline,
    codeRepository: p.repo,
    programmingLanguage: p.stack[0],
    keywords: p.stack.join(", "),
    author: { "@type": "Person", name: NAME, url: `${SITE}/` },
    ...(p.case_study ? { url: `${SITE}/${p.case_study}` } : {}),
  }));

  const blogs = writing.publications.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Blog",
    name: p.name,
    url: p.url,
    author: { "@type": "Person", name: NAME, url: `${SITE}/` },
  }));

  return [person, ...works, ...blogs];
}
