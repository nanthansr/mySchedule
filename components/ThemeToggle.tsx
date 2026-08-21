"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

// Renders a stable label until mounted so server and client HTML agree.
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

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
