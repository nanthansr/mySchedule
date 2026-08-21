"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

// v1 parity: the featured-project card rises in once the page has scrolled
// past 100px.
export function HeroCard() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 100));

  return (
    <div className="hero-card-wrap">
      <motion.div
        className="hero-card"
        initial={false}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="hc-label">Featured Project</div>
        <div className="hc-title">
          <span style={{ color: "var(--dim)" }}>Cloud-Native</span>
          <br />
          MLOps Pipeline
        </div>
        <div className="hc-sub">
          FastAPI · XGBoost · MLflow · Prometheus · Grafana · CI/CD · 284,807
          transactions at 577:1
        </div>
        <a href="/case-fraud-pipeline.html" className="hc-btn">
          View Case Study →
        </a>
      </motion.div>
    </div>
  );
}
