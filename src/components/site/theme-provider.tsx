"use client";

import { createContext, useContext, type ReactNode } from "react";

const ThemeContext = createContext<{ toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  function toggle() {
    const isDark = document.documentElement.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    localStorage.setItem("rome-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.classList.toggle("light", next === "light");
  }

  return <ThemeContext.Provider value={{ toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within ThemeProvider");
  return value;
}
