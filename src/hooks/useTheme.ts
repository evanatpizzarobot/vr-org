"use client";

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("vr-org-theme") as Theme | null;
    const next: Theme = stored === "light" ? "light" : "dark";
    setThemeState(next);
    // Keep the DOM attribute in sync with the stored preference on every load.
    // Without this, a returning visitor who chose light mode renders dark
    // because the inline ThemeScript and React state can drift apart.
    document.documentElement.setAttribute("data-theme", next);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem("vr-org-theme", t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  return { theme, setTheme, toggle };
}
