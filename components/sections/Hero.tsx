"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { HERO_WORDS, JOB_TITLE } from "@/lib/site";

// v1 parity: hero fades to 0 and scales to 0.96 over the first 380px of
// scroll; the headline word cycles every 2.5s with a 280ms swap. The first
// word is server-rendered so crawlers always see it.
export function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 380], [1, 0]);
  const scale = useTransform(scrollY, [0, 380], [1, 0.96]);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setWordIndex((i) => (i + 1) % HERO_WORDS.length),
      2500,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <motion.section id="home" className="hero-wrap" style={{ opacity, scale }}>
      <div className="hero-bg" />
      <div className="hero-content">
        <div className="hero-eyebrow">Montréal, QC · Available now</div>
        <div className="hero-ident">
          Nanthan <span>SR</span>
        </div>
        <h1 className="hero-name">
          <span className="muted">I&apos;m a</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={HERO_WORDS[wordIndex]}
              className="bright"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.28 }}
            >
              {HERO_WORDS[wordIndex]}
            </motion.span>
          </AnimatePresence>
        </h1>
        <p className="hero-sub">
          {JOB_TITLE}. Engineer by degree. Explorer by nature.
        </p>
        <div className="hero-btns">
          <a href="#work" className="btn-p">
            See My Work
          </a>
          <a href="#contact" className="btn-g">
            Let&apos;s Talk
          </a>
          <a href="/resume.pdf" className="btn-g" target="_blank">
            Resume ↗
          </a>
        </div>
      </div>
      <div className="hero-scroll">scroll</div>
    </motion.section>
  );
}
