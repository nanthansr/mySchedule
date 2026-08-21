import type { Metadata } from "next";
import Link from "next/link";
import { ShelfMount } from "@/components/library/ShelfMount";
import { buildCatalog } from "@/lib/catalog";
import "./library.css";

export const metadata: Metadata = {
  title: "The Library — Nanthan SR",
  description:
    "Nanthan's projects and writing as an interactive 3D bookshelf. Every volume opens the real thing - the repository, the case study, or the post.",
  alternates: { canonical: "/library/" },
};

export default function LibraryPage() {
  const books = buildCatalog();
  const kindLabel = (format: string) =>
    format.startsWith("Project") ? "Project" : format;

  return (
    <div className="library-page">
      <div className="library-stage">
        <div className="stage-teaser">
          <p className="eyebrow">
            <span>NANTHAN SR</span>
            <span className="eyebrow__line" />
            <span>THE LIBRARY</span>
          </p>
          <h1>The Library</h1>
          <p>
            {books.length} volumes - every project and post on this site as a
            book on one shelf. The interactive version needs JavaScript and
            WebGL; the full list is just below.
          </p>
        </div>
        <ShelfMount books={books} />
      </div>

      <section className="library-below" id="library-list">
        <h2>All {books.length} volumes</h2>
        <p className="library-lede">
          The same shelf as a plain list. Every entry links to the real thing.
        </p>
        <ul className="library-list">
          {books.map((book) =>
            book.internal ? (
              <li key={book.id}>
                <span className="book-kind">{kindLabel(book.format)}</span>
                <Link href={book.url}>{book.title}</Link>
              </li>
            ) : (
              <li key={book.id}>
                <span className="book-kind">{kindLabel(book.format)}</span>
                <a href={book.url} target="_blank" rel="noopener">
                  {book.title}
                </a>
              </li>
            ),
          )}
        </ul>
        <p className="library-attribution">
          Shelf engine adapted from{" "}
          <a
            href="https://github.com/mintdotgg/mint-playground"
            target="_blank"
            rel="noopener"
          >
            mint-playground
          </a>{" "}
          (MIT), itself inspired by Stripe Press. Not affiliated with or
          endorsed by Stripe. <Link href="/">← Back to the portfolio</Link>
        </p>
      </section>
    </div>
  );
}
