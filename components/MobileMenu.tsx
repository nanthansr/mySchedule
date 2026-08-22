"use client";

import Link from "next/link";

const MENU_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
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
