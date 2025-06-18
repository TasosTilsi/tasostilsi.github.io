"use client";

import {
  LOCAL_STORAGE_THEME_KEY,
  Theme,
  VALID_THEMES,
} from "@/components/cli/constants";
import { useCallback, useEffect, useState } from "react";

export function useCliTheme(defaultTheme: Theme = "dark") {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }
    try {
      const savedTheme = localStorage.getItem(
        LOCAL_STORAGE_THEME_KEY
      ) as Theme | null;
      if (savedTheme && VALID_THEMES.includes(savedTheme)) {
        return savedTheme;
      }
    } catch (e) {
      console.error("Failed to access localStorage for theme on init:", e);
    }
    return defaultTheme;
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      VALID_THEMES.forEach((themeName) => {
        if (themeName !== currentTheme) {
          document.documentElement.classList.remove(themeName);
        }
      });

      if (
        VALID_THEMES.includes(currentTheme) &&
        !document.documentElement.classList.contains(currentTheme)
      ) {
        document.documentElement.classList.add(currentTheme);
      }

      try {
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, currentTheme);
      } catch (e) {
        console.error("Failed to save theme to localStorage:", e);
      }
    }
  }, [currentTheme]);

  const setTheme = useCallback((theme: Theme) => {
    if (VALID_THEMES.includes(theme)) {
      setCurrentTheme(theme);
    }
  }, []);

  return { currentTheme, setTheme, VALID_THEMES };
}
