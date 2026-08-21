import { Reveal } from "@/components/Reveal";
import { getProjects } from "@/lib/data";
import { diagramAlt } from "@/lib/diagrams";

export function Projects() {
  const projects = getProjects();
  return (
    <section className="section-projects" id="projects">
      <Reveal>
        <span className="section-label">Projects</span>
      </Reveal>
      <Reveal>
        <h2 className="mixed-heading" style={{ marginBottom: "1rem" }}>
          <span className="dim">Things I</span>
          <br />
          shipped.
        </h2>
      </Reveal>
      <Reveal>
        <p className="section-lede">
          Every number below is reproducible from the linked repository. Where
          something is unfinished or stale, it says so.
        </p>
      </Reveal>

      <div className="proj-grid">
        {projects.map((project, index) => {
          const alt = diagramAlt(project.image);
          const stem = `/${project.image}`;
          return (
            <Reveal key={project.slug}>
              <article
                className={`proj-card${index % 2 === 1 ? " proj-card-even" : ""}`}
                id={`project-${project.slug}`}
              >
                <figure className={`proj-figure proj-figure-${project.accent}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="diagram-dark"
                    src={`${stem}-dark.svg`}
                    loading="lazy"
                    decoding="async"
                    alt={alt}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="diagram-light"
                    src={`${stem}-light.svg`}
                    loading="lazy"
                    decoding="async"
                    alt={alt}
                  />
                </figure>
                <div className="proj-body">
                  <p className="proj-year">
                    <time dateTime={project.year}>{project.year}</time>
                  </p>
                  <h3 className="proj-title">{project.title}</h3>
                  <p className="proj-tagline">{project.tagline}</p>
                  <p className="proj-summary">{project.summary}</p>
                  <ul className="proj-facts">
                    {project.facts.map((fact) => (
                      <li key={fact}>{fact}</li>
                    ))}
                  </ul>
                  <ul className="proj-stack">
                    {project.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                  <p className="proj-links">
                    {project.case_study && (
                      <a
                        className="proj-link proj-link-primary"
                        href={`/${project.case_study}`}
                      >
                        Read the case study →
                      </a>
                    )}{" "}
                    <a
                      className="proj-link"
                      href={project.repo}
                      target="_blank"
                      rel="noopener"
                    >
                      Code on GitHub →
                    </a>
                  </p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
