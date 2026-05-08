"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-8 w-16" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs transition-colors"
      style={{ color: "var(--muted)" }}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <span
        className="relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 transition-colors duration-200"
        style={{
          background: isDark ? "var(--accent)" : "var(--border)",
          borderColor: isDark ? "var(--accent)" : "var(--border)",
        }}
      >
        <span
          className="inline-block h-4 w-4 transform rounded-full transition-transform duration-200"
          style={{
            background: "white",
            transform: isDark ? "translateX(16px)" : "translateX(0px)",
          }}
        />
      </span>
      {isDark ? "☾ Oscuro" : "☀ Claro"}
    </button>
  );
}
