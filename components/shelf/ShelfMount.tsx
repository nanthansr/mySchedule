"use client";

// Client boundary that loads the shelf (and three.js, ~170 KB gzipped)
// only on this route, only in the browser. Without JavaScript nothing
// mounts and the server-rendered list below the stage is the page.
import dynamic from "next/dynamic";
import type { CatalogBook } from "@/lib/shelf/catalog";
import type { ShelfVariant } from "./Shelf";

const Shelf = dynamic(
  () => import("./Shelf").then((mod) => mod.Shelf),
  { ssr: false },
);

export function ShelfMount({
  books,
  variant = "page",
}: {
  books: CatalogBook[];
  variant?: ShelfVariant;
}) {
  return <Shelf books={books} variant={variant} />;
}
