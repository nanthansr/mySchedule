"use client";

// The switchable shelf: a Projects | Writing control over one 3D shelf.
// Owns the shelf CSS import (both routes get it through here), the WebGL
// bail-out, and - embedded on the home page - an IntersectionObserver gate
// so three.js only loads when the section approaches the viewport.
// Switching tabs remounts ShelfMount via `key`, which disposes the engine
// and resets all shelf state (a stale activeIndex from a longer shelf
// would crash a shorter one).
import { useEffect, useRef, useState } from "react";
import type { CatalogBook } from "@/lib/shelf/catalog";
import { ShelfMount } from "./ShelfMount";
import type { ShelfVariant } from "./Shelf";
import "./shelf.css";

type ShelfTab = "projects" | "writing";

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function ShelfShowcase({
  projects,
  writing,
  variant,
}: {
  projects: CatalogBook[];
  writing: CatalogBook[];
  variant: ShelfVariant;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<ShelfTab>("projects");
  const [supported, setSupported] = useState(true);
  const [near, setNear] = useState(variant === "page");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!supportsWebGL()) setSupported(false);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (near) return;
    const host = hostRef.current;
    if (!host || !("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [near]);

  // No WebGL: the server-rendered plain list is the experience. The
  // embedded stage would be an empty box, so it renders nothing at all.
  if (!supported) return null;

  const books = tab === "projects" ? projects : writing;

  return (
    <div ref={hostRef} className={variant === "embedded" ? "shelf-embed" : undefined}>
      <div className="shelf-tabs" role="group" aria-label="Choose a shelf">
        <button
          type="button"
          aria-pressed={tab === "projects"}
          onClick={() => setTab("projects")}
        >
          Projects
        </button>
        <button
          type="button"
          aria-pressed={tab === "writing"}
          onClick={() => setTab("writing")}
        >
          Writing
        </button>
      </div>
      {near ? <ShelfMount key={tab} books={books} variant={variant} /> : null}
    </div>
  );
}
