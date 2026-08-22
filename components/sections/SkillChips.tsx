import { Reveal } from "@/components/Reveal";
import { getSkills } from "@/lib/data";

// The skills data as one quiet row per group - the compact successor to
// the retired horizontal card deck.
export function SkillChips() {
  const skills = getSkills();
  return (
    <section className="chips-section" aria-label="Skills at a glance">
      {skills.map((skill) => (
        <Reveal key={skill.id}>
          <div className="chip-group">
            <span className="chip-group-label">{skill.label}</span>
            <ul className="chip-row">
              {skill.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </section>
  );
}
