"use client";

// Scroll-reveal wrapper - the motion equivalent of v1's IntersectionObserver
// (.reveal / .in, threshold 0.07, 0.1s stagger tiers). Children are
// server-rendered and pass through, so all text stays in the exported HTML.
import { motion } from "motion/react";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.07 }}
      transition={{
        duration: 0.7,
        delay: delay * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
