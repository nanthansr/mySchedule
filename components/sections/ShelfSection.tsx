import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ShelfShowcase } from "@/components/shelf/ShelfShowcase";
import { buildShelfCatalogs } from "@/lib/catalog";
import { getProjects } from "@/lib/data";

// The home page's work browser: the 3D shelf, embedded. The <details>
// list below it keeps every volume's text in the exported HTML (the
// export gate and the AI-readability surface both depend on that) without
// repeating the shelf's content visually.
export function ShelfSection() {
  const { projects, writing } = buildShelfCatalogs();
  const projectData = getProjects();

  return (
    <section className="wrap-sm" id="work">
      <Reveal>
        <span className="section-label">Work</span>
      </Reveal>
      <Reveal>
        <h2 className="mixed-heading" style={{ marginBottom: "1rem" }}>
          <span className="dim">The</span>
          <br />
          Library.
        </h2>
      </Reveal>
      <Reveal>
        <p className="section-lede">
          Every project and post as a book on a shelf. Open a volume and it
          links to the real thing - the repository, the case study, or the
          post. <Link href="/library/">Open the full Library →</Link>
        </p>
      </Reveal>

      <ShelfShowcase projects={projects} writing={writing} variant="embedded" />

      <details className="work-list" id="work-list">
        <summary>The shelf as a plain list</summary>
        {projectData.map((project) => (
          <article className="work-item" key={project.slug}>
            <h3>
              <a
                {...(project.case_study
                  ? { href: `/${project.case_study}` }
                  : {
                      href: project.repo,
                      target: "_blank",
                      rel: "noopener",
                    })}
              >
                {project.title}
              </a>
            </h3>
            <p className="work-meta">
              <time dateTime={project.year}>{project.year}</time>
              {" · "}
              {project.stack.join(", ")}
            </p>
            <p className="work-summary">
              {project.tagline} {project.summary}
            </p>
            <ul className="work-facts">
              {project.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
            <p className="work-links">
              {project.case_study && (
                <a href={`/${project.case_study}`}>Read the case study →</a>
              )}{" "}
              <a href={project.repo} target="_blank" rel="noopener">
                Code on GitHub →
              </a>
            </p>
          </article>
        ))}
        {writing.map((book) => (
          <article className="work-item" key={book.id}>
            <h3>
              {book.internal ? (
                <Link href={book.url}>{book.title}</Link>
              ) : (
                <a href={book.url} target="_blank" rel="noopener">
                  {book.title}
                </a>
              )}
            </h3>
            <p className="work-meta">
              {book.format} · {book.availability}
            </p>
            <p className="work-summary">{book.description}</p>
          </article>
        ))}
      </details>
    </section>
  );
}
