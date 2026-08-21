"use client";

// The interactive shelf experience. UI chrome adapted from
// mint-playground's ProgressLibrary
// (github.com/mintdotgg/mint-playground
// @ 331533abd5f74acebb36b3598e5c811e2f038901, MIT - see
// licenses/mint-playground.LICENSE), rebound to this site's catalog and
// identity.
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { CatalogBook } from "@/lib/shelf/catalog";
import { ShelfEngine, type ShelfMode } from "@/lib/shelf/ShelfEngine";
import { siteConfig } from "@/lib/shelf/site-config";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <span aria-hidden="true" className={`arrow-icon arrow-icon--${direction}`}>
      <span />
    </span>
  );
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

export type ShelfVariant = "page" | "embedded";

export function Shelf({
  books,
  variant = "page",
}: {
  books: CatalogBook[];
  variant?: ShelfVariant;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ShelfEngine | null>(null);
  const [supported, setSupported] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mode, setMode] = useState<ShelfMode>("browse");
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("Preparing the library");

  const activeBook = books[activeIndex];
  const selectedBook = useMemo(
    () => (selectedIndex === null ? null : books[selectedIndex]),
    [selectedIndex, books],
  );
  const isFocused = mode !== "browse";

  useEffect(() => {
    let cancelled = false;
    let engine: ShelfEngine | null = null;

    async function start() {
      if (!canvasRef.current) return;
      if (!supportsWebGL()) {
        setSupported(false);
        return;
      }
      await document.fonts.ready;
      if (cancelled || !canvasRef.current) return;

      engine = new ShelfEngine(
        canvasRef.current,
        books,
        {
          onActiveIndex: setActiveIndex,
          onMode: (nextMode, index) => {
            setMode(nextMode);
            setSelectedIndex(index);
          },
          onStatus: setStatus,
          onReady: () => setReady(true),
        },
        { wheelMode: variant === "embedded" ? "horizontal-only" : "capture" },
      );
      engineRef.current = engine;
    }

    void start();
    return () => {
      cancelled = true;
      engine?.dispose();
      engineRef.current = null;
    };
  }, [books, variant]);

  if (!supported) return null;

  // On /library the shelf IS the page (<main>, page <h1>); embedded on the
  // home page it is one section among many, so it must not claim either.
  const Root = variant === "page" ? "main" : "div";
  const CaptionHeading = variant === "page" ? "h1" : "h3";

  return (
    <Root
      className={`press-experience ${ready ? "is-ready" : ""} ${
        isFocused ? "is-focused" : "is-browsing"
      }`}
    >
      <canvas
        ref={canvasRef}
        className="shelf-canvas"
        role="application"
        tabIndex={0}
        aria-label={`Interactive three-dimensional shelf of ${books.length} volumes - Nanthan's projects and writing. Drag or use the arrow keys to browse. Press Enter to inspect the selected volume.`}
      />

      {variant === "page" ? (
        <header className="site-header">
          <Link
            className="wordmark"
            href="/"
            aria-label={`${siteConfig.wordmark}, back to the portfolio`}
          >
            <span>{siteConfig.wordmark}</span>
            <span className="wordmark__divider" />
            <span>{siteConfig.collectionName}</span>
          </Link>
          <div className="header-actions">
            <a className="list-cue" href="#library-list">
              Plain list ↓
            </a>
            <div className="edition-mark">
              <span>{books.length} VOLUMES</span>
              <span>01 CONTINUOUS SHELF</span>
            </div>
          </div>
        </header>
      ) : null}

      <section className="browse-caption" aria-hidden={isFocused}>
        <p className="eyebrow">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="eyebrow__line" />
          <span>{String(books.length).padStart(2, "0")}</span>
        </p>
        <CaptionHeading>{activeBook.shortTitle}</CaptionHeading>
        <p className="browse-caption__author">{activeBook.author}</p>
        <button
          type="button"
          className="inspect-button"
          disabled={isFocused}
          onClick={() => engineRef.current?.focusBook(activeIndex)}
          aria-label={`Inspect ${activeBook.title}`}
        >
          <span>Inspect volume</span>
          <span aria-hidden="true">↗</span>
        </button>
      </section>

      <button
        type="button"
        className="shelf-arrow shelf-arrow--left"
        aria-label="Previous volume"
        disabled={isFocused || activeIndex === 0}
        onClick={() => engineRef.current?.browseBy(-1)}
      >
        <ArrowIcon direction="left" />
      </button>
      <button
        type="button"
        className="shelf-arrow shelf-arrow--right"
        aria-label="Next volume"
        disabled={isFocused || activeIndex === books.length - 1}
        onClick={() => engineRef.current?.browseBy(1)}
      >
        <ArrowIcon direction="right" />
      </button>

      <nav className="shelf-index" aria-label="Catalog position">
        <div
          className="shelf-index__ticks"
          style={{ gridTemplateColumns: `repeat(${books.length}, 1fr)` }}
        >
          {books.map((book, index) => (
            <button
              key={book.id}
              type="button"
              className={index === activeIndex ? "is-active" : ""}
              aria-label={`Browse to ${book.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              disabled={isFocused}
              onClick={() => engineRef.current?.browseTo(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="input-hint" aria-hidden="true">
          <span>DRAG</span>
          <i />
          <span>SCROLL</span>
          <i />
          <span>ARROW KEYS</span>
        </div>
      </nav>

      <aside
        className="book-details"
        aria-hidden={!isFocused}
        aria-label={
          selectedBook ? `Details for ${selectedBook.title}` : "Volume details"
        }
      >
        {selectedBook ? (
          <div className="book-details__inner">
            <button
              type="button"
              className="back-button"
              onClick={() => engineRef.current?.returnToShelf()}
            >
              <ArrowIcon direction="left" />
              <span>Return to shelf</span>
            </button>

            <div className="book-details__position">
              <span>{String(selectedIndex! + 1).padStart(2, "0")}</span>
              <span>{String(books.length).padStart(2, "0")}</span>
            </div>

            <div className="book-details__copy">
              <p className="eyebrow">{siteConfig.editionEyebrow}</p>
              <h2>{selectedBook.title}</h2>
              <p className="book-details__author">{selectedBook.author}</p>
              <p className="book-details__description">
                {selectedBook.description}
              </p>

              {selectedBook.quote ? (
                <blockquote>
                  <p>“{selectedBook.quote}”</p>
                  {selectedBook.quoteBy ? (
                    <cite>{selectedBook.quoteBy}</cite>
                  ) : null}
                </blockquote>
              ) : null}

              <dl>
                <div>
                  <dt>Format</dt>
                  <dd>{selectedBook.format}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{selectedBook.availability}</dd>
                </div>
              </dl>

              <a
                className="official-link"
                href={selectedBook.url}
                {...(selectedBook.internal
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
              >
                <span>{selectedBook.linkLabel ?? siteConfig.bookLinkLabel}</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="focus-controls" aria-label="Inspection controls">
              <span>Drag to orbit</span>
              <span>Pinch or scroll to zoom</span>
              <button
                type="button"
                onClick={() => engineRef.current?.resetFocusView()}
              >
                Reset view
              </button>
            </div>
          </div>
        ) : null}
      </aside>

      <div className="experience-status" role="status" aria-live="polite">
        <span className="experience-status__dot" />
        <span>{status}</span>
      </div>

      <div className="loading-screen" aria-hidden={ready}>
        <div className="loading-screen__mark">
          <span />
          <span />
          <span />
        </div>
        <p>Assembling {books.length} volumes</p>
      </div>

      <p className="independent-note">{siteConfig.independentNote}</p>

      <div className="sr-only" aria-live="polite">
        {isFocused && selectedBook
          ? `Inspecting ${selectedBook.title} by ${selectedBook.author}.`
          : `Selected ${activeBook.title} by ${activeBook.author}.`}
      </div>
    </Root>
  );
}
