import { ThemeToggle } from "@/components/ThemeToggle";

export const NAV_LINKS = [
  { href: "/#skills", label: "Skills" },
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#writing", label: "Writing" },
  { href: "/#experience", label: "Experience" },
  { href: "/library/", label: "Library" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  return (
    <nav className="site-nav scrolled" aria-label="Site">
      <a href="/#home" className="nav-name">
        Nanthan <span>SR</span>
      </a>
      <ul className="nav-links">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
        <li>
          <a href="https://github.com/nanthansr" target="_blank" rel="noopener">
            GitHub
          </a>
        </li>
        <li>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener"
            className="nav-resume"
          >
            Resume ↗
          </a>
        </li>
      </ul>
      <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <ThemeToggle />
      </div>
    </nav>
  );
}
