"use client";

import Link from "next/link";

export function NoApiKeyBanner() {
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-lg mb-6 text-sm"
      style={{
        background: "rgba(234,179,8,0.1)",
        border: "1px solid rgba(234,179,8,0.35)",
        color: "var(--foreground)",
      }}
    >
      <span className="text-base mt-0.5">⚠️</span>
      <div>
        <span className="font-semibold">No AI API key configured.</span>{" "}
        Klipwise works as a content library, but summary and content generation are not available.{" "}
        <Link
          href="/settings"
          className="underline font-medium"
          style={{ color: "var(--accent)" }}
        >
          Set up your API key →
        </Link>
      </div>
    </div>
  );
}
