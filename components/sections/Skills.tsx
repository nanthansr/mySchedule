import { Reveal } from "@/components/Reveal";
import { getSkills } from "@/lib/data";

export function Skills() {
  const skills = getSkills();
  return (
    <section id="skills" style={{ paddingTop: "7rem" }}>
      <Reveal className="skills-header">
        <span className="section-label">What I Build</span>
        <h2 className="mixed-heading">
          <span className="dim">Powerful skills,</span>
          <br />
          seamlessly delivered.
        </h2>
      </Reveal>
      <div className="feat-track">
        {skills.map((card, i) => (
          <Reveal
            key={card.id}
            className={`feat-card feat-${card.palette}`}
            delay={(i % 4) + 1}
          >
            <div className="feat-card-icon">{card.icon}</div>
            <div className="feat-card-label">{card.label}</div>
            <div className="feat-card-title">
              {card.title.map((line, j) => (
                <span key={line}>
                  {j > 0 && <br />}
                  {line}
                </span>
              ))}
            </div>
            <div className="feat-tags">
              {card.tags.map((tag) => (
                <span key={tag} className="feat-tag">
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
