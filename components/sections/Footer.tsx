import { GITHUB } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="ft-l">Thanks for stopping by :)</div>
      <div className="ft-b">The Happy Glitch</div>
      <div className="ft-r">
        <a className="ft-link" href={GITHUB} target="_blank" rel="noopener">
          GitHub ↗
        </a>
        © 2026 Nanthan SR. All rights reserved.
      </div>
    </footer>
  );
}
