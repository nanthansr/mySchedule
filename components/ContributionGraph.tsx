"use client";

// GitHub contribution heatmap, fetched in the browser (this is a static
// export - there is no server to proxy through). Decorative by design:
// on any failure - offline, API gone, slow network - the whole block
// renders nothing rather than an error state. No meaningful text lives
// here, so the export gate loses nothing when it is absent.
import { useEffect, useState } from "react";

type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type GraphData = { total: number; days: ContributionDay[] };

const SOURCE = "https://github-contributions-api.jogruber.de/v4/nanthansr?y=last";

export function ContributionGraph() {
  const [data, setData] = useState<GraphData | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    fetch(SOURCE, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then((json: { total?: { lastYear?: number }; contributions?: ContributionDay[] }) => {
        const days = json?.contributions;
        if (!Array.isArray(days) || days.length === 0) return;
        const total =
          json?.total?.lastYear ??
          days.reduce((sum, day) => sum + day.count, 0);
        setData({ total, days });
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  if (!data) return null;

  return (
    <section className="chips-section contrib-section" aria-label="GitHub activity">
      <span className="chip-group-label">GitHub · last year</span>
      <div className="contrib-scroll">
        <div
          className="contrib-grid"
          role="img"
          aria-label={`${data.total} GitHub contributions in the last year`}
        >
          {data.days.map((day) => (
            <span
              key={day.date}
              className={`contrib-cell l${day.level}`}
              title={`${day.date}: ${day.count} contributions`}
            />
          ))}
        </div>
      </div>
      <p className="contrib-caption">
        {data.total} contributions in the last year
      </p>
    </section>
  );
}
