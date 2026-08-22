import { Reveal } from "@/components/Reveal";
import { getExperience } from "@/lib/data";
import type { ExperienceRole } from "@/lib/types";

function TimelineEntry({ entry }: { entry: ExperienceRole }) {
  return (
    <div className="tl-entry">
      <h3 className="tl-co">{entry.company}</h3>
      <p className="tl-role">{entry.role}</p>
      <p className="tl-period">{entry.period}</p>
      <ul className="ebulls">
        {entry.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}

export function Experience() {
  const { roles, volunteering, education } = getExperience();
  return (
    <section className="wrap-sm" id="experience">
      <Reveal>
        <span className="section-label">Experience</span>
      </Reveal>
      <Reveal>
        <h2 className="mixed-heading" style={{ marginBottom: "3rem" }}>
          <span className="dim">Work</span>
          <br />
          History.
        </h2>
      </Reveal>
      <div className="timeline">
        {roles.map((role) => (
          <Reveal key={`${role.company}-${role.role}`}>
            <TimelineEntry entry={role} />
          </Reveal>
        ))}
      </div>

      <Reveal className="vol-block">
        <span className="section-label">Community</span>
        <h3 className="vol-title">Volunteering</h3>
        <p className="vol-intro">{volunteering.intro}</p>
        <div className="timeline">
          {volunteering.entries.map((entry) => (
            <TimelineEntry key={entry.company} entry={entry} />
          ))}
        </div>
      </Reveal>

      <Reveal className="edu-grid">
        {education.map((edu) => (
          <div key={edu.degree} className="edu-c">
            <div className="edu-deg">{edu.degree}</div>
            <div className="edu-sch">{edu.school}</div>
            <div className="edu-meta">{edu.meta}</div>
            <div className="edu-gpa">{edu.detail}</div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
