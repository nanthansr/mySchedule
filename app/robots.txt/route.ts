import { AI_CRAWLERS, SITE } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    "# Everything here is meant to be read, by people and by machines alike.",
    "",
    "User-agent: *",
    "Allow: /",
    "",
  ];
  for (const bot of AI_CRAWLERS) {
    lines.push(`User-agent: ${bot}`, "Allow: /", "");
  }
  lines.push(`Sitemap: ${SITE}/sitemap.xml`, "");
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
