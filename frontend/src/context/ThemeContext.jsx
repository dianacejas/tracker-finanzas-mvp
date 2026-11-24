import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);

const PALETTES = [
  { id: "violet-magenta", name: "Violet/Magenta", colors: ["#454ade", "#b14aed", "#c874d9", "#e1bbc9", "#1b1f3b"] },
  { id: "periwinkle-amethyst", name: "Periwinkle/Amethyst", colors: ["#97dffc", "#858ae3", "#613dc1", "#4e148c", "#2c0735"] },
  { id: "sage-yale-blue", name: "Sage/Yale Blue", colors: ["#0d1821", "#344966", "#b4cded", "#bfcc94", "#f0f4ef"] },
  { id: "lilac-indigo", name: "Lilac/Indigo", colors: ["#2e294e", "#efbcd5", "#be97c6", "#8661c1", "#4b5267"] },
  { id: "cerulean-ink", name: "Cerulean/Ink Black", colors: ["#ffffff", "#00171f", "#003459", "#007ea7", "#00a8e8"] },
];

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("peshito-mode");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [palette, setPalette] = useState(() => {
    if (typeof window === "undefined") return "violet-magenta";
    return localStorage.getItem("peshito-palette") || "violet-magenta";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    localStorage.setItem("peshito-mode", mode);
  }, [mode]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", palette);
    localStorage.setItem("peshito-palette", palette);
  }, [palette]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleMode: () => setMode((m) => (m === "light" ? "dark" : "light")),
      palette,
      setPalette,
      palettes: PALETTES,
    }),
    [mode, palette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
