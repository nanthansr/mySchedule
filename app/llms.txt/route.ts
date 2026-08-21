import { getProjects, getWriting } from "@/lib/data";
import { llmsTxt } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  const body = llmsTxt(getProjects(), getWriting());
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
