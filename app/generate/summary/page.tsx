"use client";

import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Article {
  id: string;
  title: string;
  url?: string | null;
  language: string;
  tags: string[];
  createdAt: string;
}

export default function SummaryPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/articles").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setArticles(data);
    });
  }, []);

  function toggleSelect(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  }

  async function handleGenerate() {
    if (selected.size === 0) { toast.error("Selecciona al menos un artículo"); return; }
    setLoading(true); setSummary("");
    try {
      const res = await fetch("/api/generate/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSummary(data.summary);
      toast.success("Resumen generado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al generar");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendEmail() {
    if (!summary) return;
    setSending(true);
    try {
      const res = await fetch("/api/generate/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summary }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Email enviado correctamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al enviar el email");
    } finally {
      setSending(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copiado al portapapeles");
  }

  return (
    <AppShell>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Resumen por email</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          Selecciona artículos y genera un resumen editorial estructurado en español.
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: article selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-medium" style={{ color: "var(--muted)" }}>
                ARTÍCULOS ({selected.size} seleccionados)
              </h2>
              {selected.size > 0 && (
                <button onClick={() => setSelected(new Set())} className="text-xs" style={{ color: "var(--muted)" }}>
                  Limpiar
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {articles.length === 0 && (
                <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
                  No hay artículos. Ve a /articles para añadir.
                </p>
              )}
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} selected={selected.has(a.id)} onSelect={toggleSelect} />
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || selected.size === 0}
              className="mt-4 w-full py-2.5 rounded-md text-sm font-medium disabled:opacity-50 transition-opacity"
              style={{ background: "var(--accent)", color: "#ffffff" }}
            >
              {loading ? "Generando resumen..." : `Generar resumen (${selected.size})`}
            </button>
          </div>

          {/* Right: output */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-medium" style={{ color: "var(--muted)" }}>RESULTADO</h2>
              {summary && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="text-xs px-2 py-1 rounded font-medium"
                    style={{ background: "var(--btn-secondary)", color: "var(--btn-secondary-text)" }}
                  >
                    {copied ? "¡Copiado!" : "Copiar"}
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={sending}
                    className="text-xs px-2 py-1 rounded font-medium disabled:opacity-50"
                    style={{ background: "var(--accent)", color: "#ffffff" }}
                  >
                    {sending ? "Enviando..." : "✉ Email"}
                  </button>
                </div>
              )}
            </div>

            <div
              className="rounded-lg border p-4 min-h-64 text-sm leading-relaxed transition-colors"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
                whiteSpace: "pre-wrap",
                fontFamily: "Georgia, serif",
              }}
            >
              {loading && (
                <div className="flex items-center gap-2" style={{ color: "var(--muted)" }}>
                  <span className="animate-pulse">✒</span>
                  <span>Generando resumen...</span>
                </div>
              )}
              {!loading && !summary && <span style={{ color: "var(--muted)" }}>El resumen aparecerá aquí...</span>}
              {summary && <span>{summary}</span>}
            </div>

            {summary && (
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="mt-3 w-full px-3 py-2 rounded-lg border text-xs resize-none outline-none transition-colors"
                style={{
                  background: "var(--input-bg)",
                  borderColor: "var(--border)",
                  color: "var(--muted)",
                  height: "100px",
                }}
                placeholder="Puedes editar el resumen aquí antes de enviarlo..."
              />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
