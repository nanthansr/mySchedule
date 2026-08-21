// Scroll-reveal wrapper. Phase 3: renders children statically so every
// section lands complete in the exported HTML. Phase 4 upgrades this to a
// motion.div with whileInView - call sites stay unchanged.
export function Reveal({
  children,
  className,
  delay: _delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}
