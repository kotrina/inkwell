"use client";

import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ManualPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/manual")
      .then((r) => r.text())
      .then((text) => { setContent(text); setLoading(false); });
  }, []);

  return (
    <AppShell>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Manual de usuario
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Guía completa de uso de Klipwise.
        </p>

        {loading ? (
          <div className="animate-pulse text-2xl text-center py-16" style={{ color: "var(--accent)" }}>✒</div>
        ) : (
          <div className="prose-inkwell">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mt-10 mb-4 pb-2 border-b" style={{ color: "var(--foreground)", borderColor: "var(--border)" }}>{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-semibold mt-8 mb-3" style={{ color: "var(--foreground)" }}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-semibold mt-6 mb-2" style={{ color: "var(--foreground)" }}>{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--foreground)", fontFamily: "Georgia, serif" }}>{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="text-sm space-y-1 mb-4 pl-5 list-disc" style={{ color: "var(--foreground)" }}>{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="text-sm space-y-1 mb-4 pl-5 list-decimal" style={{ color: "var(--foreground)" }}>{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold" style={{ color: "var(--foreground)" }}>{children}</strong>
                ),
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--accent)" }}>{children}</a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="text-sm pl-4 py-1 my-4 rounded-r-md border-l-4 italic" style={{ borderColor: "var(--accent)", background: "rgba(99,102,241,0.08)", color: "var(--muted)" }}>
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: "var(--subtle)", color: "var(--accent)" }}>{children}</code>
                ),
                hr: () => (
                  <hr className="my-8" style={{ borderColor: "var(--border)" }} />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full text-sm border-collapse">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead style={{ background: "var(--subtle)" }}>{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="text-left text-xs font-semibold px-3 py-2 border" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>{children}</th>
                ),
                td: ({ children }) => (
                  <td className="px-3 py-2 border text-sm" style={{ borderColor: "var(--border)", color: "var(--foreground)" }}>{children}</td>
                ),
                tr: ({ children }) => (
                  <tr className="transition-colors" style={{ borderColor: "var(--border)" }}>{children}</tr>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </AppShell>
  );
}
