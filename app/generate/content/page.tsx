"use client";

import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { NoApiKeyBanner } from "@/components/NoApiKeyBanner";
import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";

interface Article {
  id: string;
  title: string;
  url?: string | null;
  language: string;
  tags: string[];
  status: string;
  createdAt: string;
}

const FORMATS = [
  { value: "twitter", label: "Hilo de Twitter", icon: "𝕏" },
  { value: "linkedin", label: "Post de LinkedIn", icon: "in" },
  { value: "article", label: "Artículo largo", icon: "✒" },
];

export default function ContentPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [format, setFormat] = useState("twitter");
  const [context, setContext] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([
      fetch("/api/articles?status=all").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]).then(([data, settings]) => {
      if (Array.isArray(data)) setArticles(data);
      setHasApiKey(settings.hasKey ?? false);
    });
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [articles]);

  const filteredArticles = useMemo(() => articles.filter((a) => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchTags = activeTags.size === 0 || [...activeTags].every((t) => a.tags.includes(t));
    return matchSearch && matchTags;
  }), [articles, search, activeTags]);

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  function toggleSelect(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  }

  async function handleGenerate() {
    if (selected.size === 0) { toast.error("Selecciona al menos un artículo"); return; }
    setLoading(true); setResult("");
    try {
      const res = await fetch("/api/generate/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleIds: Array.from(selected), format, context: context.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.content);
      toast.success("Contenido generado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al generar");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copiado al portapapeles");
  }

  function renderContent() {
    if (!result) return null;
    if (format === "twitter") {
      const tweets = result.split(/\n(?=\d+\/|\n)/).filter(Boolean);
      return (
        <div className="space-y-3">
          {tweets.map((tweet, i) => (
            <div
              key={i}
              className="p-3 rounded-lg border text-sm leading-relaxed transition-colors"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
            >
              {tweet.trim()}
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--foreground)", fontFamily: "Georgia, serif" }}>
        {result}
      </div>
    );
  }

  return (
    <AppShell>
      <div className="max-w-4xl">
        {hasApiKey === false && <NoApiKeyBanner />}
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Generar contenido</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          Crea contenido con tu voz usando tu base de conocimiento como guía de estilo.
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Left panel */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h2 className="text-xs font-medium mb-3" style={{ color: "var(--muted)" }}>FORMATO</h2>
              <div className="space-y-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-sm transition-all text-left font-medium"
                    style={{
                      background: format === f.value ? "rgba(99,102,241,0.1)" : "var(--card)",
                      borderColor: format === f.value ? "var(--accent)" : "var(--border)",
                      color: format === f.value ? "var(--accent)" : "var(--foreground)",
                    }}
                  >
                    <span className="font-mono text-xs w-6 text-center">{f.icon}</span>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>
                ARTÍCULOS ({selected.size} seleccionados)
              </h2>

              {/* Search */}
              <div className="relative mb-2">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--muted)" }}>🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-7 pr-3 py-1.5 rounded-md text-xs outline-none border transition-colors"
                  style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
                />
              </div>

              {/* Tag filters */}
              {allTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className="px-2 py-0.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        background: activeTags.has(tag) ? "var(--accent)" : "var(--subtle)",
                        color: activeTags.has(tag) ? "#ffffff" : "var(--muted)",
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              <div className="space-y-2 max-h-52 overflow-y-auto">
                {articles.length === 0 && (
                  <p className="text-xs py-4 text-center" style={{ color: "var(--muted)" }}>No hay artículos</p>
                )}
                {filteredArticles.filter((a) => a.status === "new").map((a) => (
                  <ArticleCard key={a.id} article={a} selected={selected.has(a.id)} onSelect={toggleSelect} />
                ))}
                {filteredArticles.some((a) => a.status === "used") && (
                  <>
                    <p className="text-xs pt-1 pb-0.5" style={{ color: "var(--muted)" }}>— Ya usados —</p>
                    {filteredArticles.filter((a) => a.status === "used").map((a) => (
                      <ArticleCard key={a.id} article={a} selected={selected.has(a.id)} onSelect={toggleSelect} dimmed />
                    ))}
                  </>
                )}
                {articles.length > 0 && filteredArticles.length === 0 && (
                  <p className="text-xs text-center py-3" style={{ color: "var(--muted)" }}>Sin resultados.</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-medium mb-2" style={{ color: "var(--muted)" }}>ÁNGULO (opcional)</h2>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Contexto adicional o ángulo concreto que quieres destacar..."
                rows={3}
                className="w-full px-3 py-2 rounded-md text-sm outline-none border resize-none transition-colors"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || selected.size === 0}
              className="w-full py-2.5 rounded-md text-sm font-medium disabled:opacity-50 transition-opacity"
              style={{ background: "var(--accent)", color: "#ffffff" }}
            >
              {loading ? "Generando..." : "Generar contenido"}
            </button>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-medium" style={{ color: "var(--muted)" }}>RESULTADO</h2>
              {result && (
                <button
                  onClick={handleCopy}
                  className="text-xs px-3 py-1 rounded font-medium"
                  style={{ background: "var(--btn-secondary)", color: "var(--btn-secondary-text)" }}
                >
                  {copied ? "¡Copiado!" : "Copiar todo"}
                </button>
              )}
            </div>

            <div
              className="rounded-xl border p-5 min-h-96 transition-colors"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              {loading && (
                <div className="flex items-center gap-2" style={{ color: "var(--muted)" }}>
                  <span className="animate-pulse text-xl">✒</span>
                  <span className="text-sm">Generando con tu voz...</span>
                </div>
              )}
              {!loading && !result && (
                <p className="text-sm" style={{ color: "var(--muted)" }}>El contenido generado aparecerá aquí...</p>
              )}
              {result && renderContent()}
            </div>

            {result && (
              <textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="mt-3 w-full px-3 py-2 rounded-lg border text-xs resize-none outline-none transition-colors"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--muted)", height: "80px" }}
                placeholder="Puedes editar el resultado directamente aquí..."
              />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
