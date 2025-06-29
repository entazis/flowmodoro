/**
 * Custom hook for managing dark mode with system preference detection
 */

import { STORAGE_KEYS } from "@/constants/timer";
import { useEffect, useState } from "react";
import { useLocalStorage } from "./use-local-storage";

type ThemePreference = "light" | "dark" | "system";

/**
 * Custom hook for managing dark mode
 * @returns Object with isDark state and toggle function
 */
export function useDarkMode() {
  const [themePreference, setThemePreference] =
    useLocalStorage<ThemePreference>(STORAGE_KEYS.THEME_PREFERENCE, "system");

  const [isDark, setIsDark] = useState(false);

  // Function to check system preference
  const getSystemPreference = (): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  // Function to apply theme to document
  const applyTheme = (dark: boolean) => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // Calculate actual dark mode state based on preference
  const calculateDarkMode = (): boolean => {
    switch (themePreference) {
      case "dark":
        return true;
      case "light":
        return false;
      case "system":
      default:
        return getSystemPreference();
    }
  };

  // Update dark mode when preference changes
  useEffect(() => {
    const newIsDark = calculateDarkMode();
    setIsDark(newIsDark);
    applyTheme(newIsDark);
  }, [themePreference]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (themePreference === "system") {
        const newIsDark = getSystemPreference();
        setIsDark(newIsDark);
        applyTheme(newIsDark);
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    // Set initial state
    handleChange();

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themePreference]);

  // Toggle between light and dark (not system)
  const toggleDarkMode = () => {
    const newPreference = isDark ? "light" : "dark";
    setThemePreference(newPreference);
  };

  // Set specific theme preference
  const setThemePreferenceMode = (preference: ThemePreference) => {
    setThemePreference(preference);
  };

  return {
    /** Current dark mode state */
    isDark,
    /** Current theme preference */
    themePreference,
    /** Toggle between light and dark */
    toggleDarkMode,
    /** Set specific theme preference */
    setThemePreference: setThemePreferenceMode,
    /** Whether system preference is dark */
    systemPrefersDark: getSystemPreference(),
  };
}
