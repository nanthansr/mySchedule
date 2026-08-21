// Book palettes in the site's identity: projects bind in blues around
// #4B9EFF, writing binds in coppers around #e8865a, seeded per book so
// covers are stable across builds.
export type BookFamily = "project" | "writing";

const PROJECT_BINDINGS = [
  { cover: "#12315a", accent: "#7db4ff", ink: "#eaf2ff" },
  { cover: "#0f2440", accent: "#4B9EFF", ink: "#e3eeff" },
  { cover: "#1a3a6b", accent: "#9cc4ff", ink: "#f0f6ff" },
  { cover: "#14304f", accent: "#5aa2f2", ink: "#e8f1ff" },
  { cover: "#0d1f38", accent: "#86b8ff", ink: "#dcebff" },
];

const WRITING_BINDINGS = [
  { cover: "#5d3521", accent: "#f0a077", ink: "#f9efe6" },
  { cover: "#6b3d26", accent: "#e8865a", ink: "#f7ece1" },
  { cover: "#4e2c1a", accent: "#f4b490", ink: "#f5e9de" },
  { cover: "#74452c", accent: "#ffc39e", ink: "#fcf1e8" },
  { cover: "#63381f", accent: "#e8865a", ink: "#f8ede3" },
  { cover: "#552f1c", accent: "#f2a97e", ink: "#f6ebe0" },
  { cover: "#6f4128", accent: "#ffb68f", ink: "#faf0e7" },
  { cover: "#583220", accent: "#eda06f", ink: "#f7ece2" },
];

export function hashSeed(id: string): number {
  let state = 2166136261;
  for (const char of id) {
    state ^= char.charCodeAt(0);
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

export function bindingFor(family: BookFamily, id: string) {
  const seed = hashSeed(id);
  const pool = family === "project" ? PROJECT_BINDINGS : WRITING_BINDINGS;
  return pool[seed % pool.length];
}
