import { Reveal } from "@/components/Reveal";
import { getExperience } from "@/lib/data";
import type { ExperienceRole } from "@/lib/types";

function ExpRow({ entry }: { entry: ExperienceRole }) {
  const sizeClass =
    entry.size === "md" ? " exp-co-md" : entry.size === "sm" ? " exp-co-sm" : "";
  return (
    <div className="exp-row">
      <div>
        <div className={`exp-co${sizeClass}`}>{entry.company}</div>
        <div className="exp-role">{entry.role}</div>
        <div className="exp-per">{entry.period}</div>
      </div>
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
      <Reveal className="exp-hdrs">
        <div className="exp-hdr on">Company</div>
        <div className="exp-hdr">Details</div>
      </Reveal>
      <div className="exp-rows">
        {roles.map((role) => (
          <Reveal key={`${role.company}-${role.role}`}>
            <ExpRow entry={role} />
          </Reveal>
        ))}
      </div>

      <Reveal className="vol-block">
        <span className="section-label">Community</span>
        <h3 className="vol-title">Volunteering</h3>
        <p className="vol-intro">{volunteering.intro}</p>
        <div className="exp-rows">
          {volunteering.entries.map((entry) => (
            <ExpRow key={entry.company} entry={entry} />
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
