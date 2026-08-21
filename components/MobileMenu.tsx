"use client";

import Link from "next/link";

const MENU_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#skills", label: "Skills" },
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/#writing", label: "Writing" },
  { href: "/#experience", label: "Experience" },
  { href: "/#life", label: "Life" },
  { href: "/library/", label: "Library" },
  { href: "/#contact", label: "Contact" },
];

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div className={`mob-menu${open ? " open" : ""}`}>
      <button className="mob-close" onClick={onClose} aria-label="Close menu">
        ✕
      </button>
      {MENU_LINKS.map((link) => (
        <Link key={link.href} href={link.href} onClick={onClose}>
          {link.label}
        </Link>
      ))}
      <a
        href="https://github.com/nanthansr"
        target="_blank"
        rel="noopener"
        onClick={onClose}
      >
        GitHub
      </a>
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener"
        onClick={onClose}
        className="nav-resume"
      >
        Resume ↗
      </a>
    </div>
  );
}
