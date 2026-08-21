export interface Project {
  slug: string;
  title: string;
  tagline: string;
  year: string;
  status: "active" | "flagship" | "shipped";
  summary: string;
  facts: string[];
  stack: string[];
  repo: string;
  case_study: string | null;
  image: string;
  accent: "mlops" | "web" | "iso";
}

export interface Publication {
  name: string;
  platform: string;
  url: string;
  feed: string;
  description: string;
}

export interface Post {
  title: string;
  url: string;
  date: string;
  publication: string;
}

export interface SkillCard {
  id: string;
  icon: string;
  label: string;
  title: string[];
  tags: string[];
  palette: "cloud" | "ml" | "lang" | "tools" | "cert";
}

export interface ExperienceRole {
  company: string;
  role: string;
  period: string;
  bullets: string[];
  size?: "md" | "sm";
}

export interface Education {
  degree: string;
  school: string;
  meta: string;
  detail: string;
}

export interface LifeCard {
  id: string;
  size: "wide" | "reg" | "half";
  icon: string;
  title: string;
  desc: string;
  palette: string;
}
