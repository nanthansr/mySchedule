import { PAGES, SITE } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = PAGES.map(
    (p) =>
      `  <url>\n    <loc>${SITE}${p}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`,
  ).join("\n");
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${urls}\n</urlset>\n`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
