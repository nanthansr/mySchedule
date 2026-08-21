import { HERO_WORDS, JOB_TITLE } from "@/lib/site";

export function Hero() {
  return (
    <section id="home" className="hero-wrap">
      <div className="hero-bg" />
      <div className="hero-content">
        <div className="hero-eyebrow">Montréal, QC · Available now</div>
        <div className="hero-ident">
          Nanthan <span>SR</span>
        </div>
        <h1 className="hero-name">
          <span className="muted">I&apos;m a</span>
          <span className="bright">{HERO_WORDS[0]}</span>
        </h1>
        <p className="hero-sub">
          {JOB_TITLE}. Engineer by degree. Explorer by nature.
        </p>
        <div className="hero-btns">
          <a href="#projects" className="btn-p">
            See My Work
          </a>
          <a href="#contact" className="btn-g">
            Let&apos;s Talk
          </a>
          <a href="/resume.pdf" className="btn-g" target="_blank">
            Resume ↗
          </a>
        </div>
      </div>
      <div className="hero-scroll">scroll</div>
    </section>
  );
}
