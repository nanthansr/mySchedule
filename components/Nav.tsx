"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "motion/react";
import { MobileMenu } from "@/components/MobileMenu";
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
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 60));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <nav className={`site-nav${scrolled ? " scrolled" : ""}`} aria-label="Site">
        <Link href="/#home" className="nav-name">
          Nanthan <span>SR</span>
        </Link>
        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
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
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </nav>
    </>
  );
}
