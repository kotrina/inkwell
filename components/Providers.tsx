"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange={false}>
      <SessionProvider>
        {children}
        <ToasterWithTheme />
      </SessionProvider>
    </ThemeProvider>
  );
}

function ToasterWithTheme() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          fontFamily: "Georgia, serif",
        },
        success: { iconTheme: { primary: "var(--accent)", secondary: "var(--background)" } },
        error: { iconTheme: { primary: "#f87171", secondary: "var(--background)" } },
      }}
    />
  );
}
