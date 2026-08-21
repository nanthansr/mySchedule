import { Reveal } from "@/components/Reveal";
import { BLOG, EMAIL, GITHUB, LINKEDIN } from "@/lib/site";

export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <Reveal className="contact-inner">
        <span className="section-label">Contact</span>
        <h2 className="mixed-heading" style={{ marginBottom: "1.25rem" }}>
          <span className="dim">Let&apos;s</span>
          <br />
          talk.
        </h2>
        <p>
          I&apos;m always open to opportunities, collaborations, or just an
          interesting conversation — about cloud engineering, life in Montréal,
          or the meaning of consciousness.
        </p>
        <div className="cpills">
          <a className="cp" href={`mailto:${EMAIL}`} aria-label="Email">
            <span>✉</span> {EMAIL}
          </a>
          <a
            className="cp"
            href={LINKEDIN}
            target="_blank"
            rel="noopener"
            aria-label="LinkedIn"
          >
            <span>💼</span> Connect on LinkedIn
          </a>
          <a
            className="cp"
            href={GITHUB}
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
          >
            <span>🐙</span> GitHub
          </a>
          <a
            className="cp"
            href={BLOG}
            target="_blank"
            rel="noopener"
            aria-label="Blog"
          >
            <span>✍</span> Read the Blog
          </a>
        </div>
      </Reveal>
    </section>
  );
}
