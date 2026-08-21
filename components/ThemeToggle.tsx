"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isLight = mounted && theme === "light";
  return (
    <button
      type="button"
      className="theme-btn"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label="Toggle color theme"
    >
      {isLight ? "● Dark" : "◐ Light"}
    </button>
  );
}
