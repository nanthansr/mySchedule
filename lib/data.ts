// Build-time JSON loaders. These run in server components only, so under
// `output: 'export'` every string here lands in the served HTML.
import { readFileSync } from "node:fs";
import path from "node:path";
import type {
  Education,
  ExperienceRole,
  LifeCard,
  Post,
  Project,
  Publication,
  SkillCard,
} from "./types";

function loadJson<T>(name: string): T {
  const file = path.join(process.cwd(), "data", name);
  return JSON.parse(readFileSync(file, "utf-8")) as T;
}

export function getProjects(): Project[] {
  return loadJson<{ projects: Project[] }>("projects.json").projects;
}

export function getWriting(): { publications: Publication[]; posts: Post[] } {
  const data = loadJson<{ publications: Publication[]; posts: Post[] }>(
    "posts.json",
  );
  return { publications: data.publications, posts: data.posts };
}

export function getSkills(): SkillCard[] {
  return loadJson<{ skills: SkillCard[] }>("skills.json").skills;
}

export function getExperience(): {
  roles: ExperienceRole[];
  volunteering: { intro: string; entries: ExperienceRole[] };
  education: Education[];
} {
  return loadJson("experience.json");
}

export function getLife(): {
  quote: string;
  bento: LifeCard[];
  journal: { label: string; sub: string; items: string[] };
} {
  return loadJson("life.json");
}
