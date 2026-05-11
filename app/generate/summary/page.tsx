"use client";

import { AppShell } from "@/components/AppShell";
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

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  new:      { label: "nuevo",     bg: "rgba(52,211,153,0.15)",  color: "#34d399" },
  used:     { label: "usado",     bg: "rgba(148,163,184,0.15)", color: "#94a3b8" },
  archived: { label: "archivado", bg: "rgba(148,163,184,0.10)", color: "#64748b" },
};

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "hoy";
  if (d === 1) return "ayer";
  if (d < 7) return `hace ${d} días`;
  if (d < 30) return `hace ${Math.floor(d / 7)} sem.`;
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

export default function SummaryPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"new" | "used" | "all">("new");

  useEffect(() => {
    Promise.all([
      fetch("/api/articles?status=new,used").then((r) => r.json()),
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

  const filtered = useMemo(() => articles.filter((a) => {
    const matchTab = activeTab === "all" || a.status === activeTab;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchTags = activeTags.size === 0 || [...activeTags].every((t) => a.tags.includes(t));
    return matchTab && matchSearch && matchTags;
  }), [articles, search, activeTags, activeTab]);

  const sortedFiltered = useMemo(() => [
    ...filtered.filter((a) => a.status === "new"),
    ...filtered.filter((a) => a.status !== "new"),
  ], [filtered]);

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === sortedFiltered.length && sortedFiltered.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sortedFiltered.map((a) => a.id)));
    }
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

  const allSelected = sortedFiltered.length > 0 && selected.size === sortedFiltered.length;
  const someSelected = selected.size > 0 && !allSelected;

  return (
    <AppShell>
      <div className="max-w-4xl">
        {hasApiKey === false && <NoApiKeyBanner />}
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Resumen por email</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          Selecciona artículos y genera un resumen editorial estructurado en español.
        </p>

        {/* Bloque 1 — Tabla de selección */}
        <div className="mb-6">
          {/* Tabs + búsqueda + filtros */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {/* Tabs de estado */}
            <div className="flex gap-1 p-1 rounded-lg shrink-0" style={{ background: "var(--tab-warm-bg)" }}>
              {([
                { value: "new", label: "Nuevos" },
                { value: "used", label: "Usados" },
                { value: "all", label: "Todos" },
              ] as { value: "new" | "used" | "all"; label: string }[]).map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className="px-3 py-1.5 text-xs rounded-md transition-all font-medium"
                  style={{
                    background: activeTab === tab.value ? "var(--tab-warm-active)" : "transparent",
                    color: activeTab === tab.value ? "var(--foreground)" : "var(--table-header-text)",
                    boxShadow: activeTab === tab.value ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative flex-1 min-w-48 max-w-xs">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--muted)" }}>🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título..."
                className="w-full pl-7 pr-3 py-1.5 rounded-md text-xs outline-none border transition-colors"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
              />
            </div>
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: activeTags.has(tag) ? "var(--accent)" : "var(--subtle)",
                      color: activeTags.has(tag) ? "#ffffff" : "var(--muted)",
                    }}
                  >
                    {tag}
                  </button>
                ))}
                {activeTags.size > 0 && (
                  <button onClick={() => setActiveTags(new Set())} className="px-2 py-0.5 text-xs" style={{ color: "var(--muted)" }}>
                    × limpiar
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Tabla */}
          {articles.length === 0 ? (
            <p className="text-sm text-center py-12" style={{ color: "var(--muted)" }}>
              No hay artículos. Ve a Artículos para añadir.
            </p>
          ) : (
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
              {/* Header */}
              <div
                className="grid text-xs font-medium px-4 py-2.5 tracking-wide"
                style={{
                  background: "var(--table-header)",
                  color: "var(--table-header-text)",
                  gridTemplateColumns: "36px 1fr 140px 52px 80px 70px",
                }}
              >
                <span className="flex items-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={toggleAll}
                    className="cursor-pointer"
                  />
                </span>
                <span>TÍTULO</span>
                <span>TAGS</span>
                <span>IDIOMA</span>
                <span>ESTADO</span>
                <span>FECHA</span>
              </div>

              {/* Rows */}
              {sortedFiltered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm" style={{ color: "var(--muted)", background: "var(--card)" }}>
                  Sin resultados para esa búsqueda.
                </div>
              ) : (
                sortedFiltered.map((article, i) => {
                  const st = STATUS_STYLES[article.status] ?? STATUS_STYLES.new;
                  const isSelected = selected.has(article.id);
                  const visibleTags = article.tags.slice(0, 2);
                  const extraTags = article.tags.length - visibleTags.length;
                  const isUsed = article.status === "used";

                  return (
                    <div
                      key={article.id}
                      onClick={() => toggleSelect(article.id)}
                      className="grid items-center px-4 py-3 cursor-pointer transition-colors"
                      style={{
                        gridTemplateColumns: "36px 1fr 140px 52px 80px 70px",
                        borderTop: i > 0 ? "1px solid var(--border)" : "none",
                        background: isSelected
                          ? "rgba(99,102,241,0.06)"
                          : "var(--card)",
                        opacity: isUsed ? 0.65 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = "var(--table-row-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isSelected ? "rgba(99,102,241,0.06)" : "var(--card)";
                      }}
                    >
                      {/* Checkbox */}
                      <span className="flex items-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(article.id)}
                          className="cursor-pointer"
                        />
                      </span>

                      {/* Título */}
                      <span
                        className="text-sm truncate pr-3 font-medium"
                        style={{ color: "var(--foreground)" }}
                        title={article.title}
                      >
                        {article.title}
                      </span>

                      {/* Tags */}
                      <div className="flex gap-1 flex-wrap">
                        {visibleTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded text-xs"
                            style={{ background: "var(--subtle)", color: "var(--muted)" }}
                          >
                            {tag}
                          </span>
                        ))}
                        {extraTags > 0 && (
                          <span className="text-xs" style={{ color: "var(--muted)" }}>+{extraTags}</span>
                        )}
                      </div>

                      {/* Idioma */}
                      <span
                        className="text-xs font-mono uppercase px-1.5 py-0.5 rounded w-fit"
                        style={{ background: "var(--subtle)", color: "var(--muted)" }}
                      >
                        {article.language}
                      </span>

                      {/* Estado */}
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium w-fit"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>

                      {/* Fecha */}
                      <span className="text-xs" style={{ color: "var(--muted)" }}>
                        {relativeDate(article.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}

              {/* Footer — conteo + botón generar */}
              <div
                className="px-4 py-2.5 flex items-center justify-between"
                style={{ background: "var(--table-header)", borderTop: "1px solid var(--border)" }}
              >
                <span className="text-xs" style={{ color: "var(--table-header-text)" }}>
                  {selected.size > 0
                    ? `${selected.size} seleccionado${selected.size > 1 ? "s" : ""} de ${sortedFiltered.length}`
                    : `${sortedFiltered.length} artículo${sortedFiltered.length !== 1 ? "s" : ""}`}
                </span>
                <div className="flex items-center gap-3">
                  {selected.size > 0 && (
                    <button
                      onClick={() => setSelected(new Set())}
                      className="text-xs"
                      style={{ color: "var(--table-header-text)" }}
                    >
                      Limpiar selección
                    </button>
                  )}
                  <button
                    onClick={handleGenerate}
                    disabled={loading || selected.size === 0}
                    className="px-4 py-1.5 rounded-md text-xs font-medium disabled:opacity-40 transition-opacity"
                    style={{ background: "var(--accent)", color: "#ffffff" }}
                  >
                    {loading ? "Generando..." : `Generar resumen${selected.size > 0 ? ` (${selected.size})` : ""}`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bloque 2 — Resultado (ancho completo) */}
        {(loading || summary) && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-medium tracking-wide" style={{ color: "var(--muted)" }}>RESULTADO</h2>
              {summary && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="text-xs px-3 py-1.5 rounded font-medium"
                    style={{ background: "var(--btn-secondary)", color: "var(--btn-secondary-text)" }}
                  >
                    {copied ? "¡Copiado!" : "Copiar"}
                  </button>
                  <button
                    onClick={handleSendEmail}
                    disabled={sending}
                    className="text-xs px-3 py-1.5 rounded font-medium disabled:opacity-50"
                    style={{ background: "var(--accent)", color: "#ffffff" }}
                  >
                    {sending ? "Enviando..." : "✉ Email"}
                  </button>
                </div>
              )}
            </div>

            <div
              className="rounded-xl border p-6 text-sm leading-relaxed"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
                whiteSpace: "pre-wrap",
                fontFamily: "Georgia, serif",
                minHeight: "200px",
              }}
            >
              {loading && (
                <div className="flex items-center gap-2" style={{ color: "var(--muted)" }}>
                  <span className="animate-pulse text-lg">✒</span>
                  <span>Generando resumen...</span>
                </div>
              )}
              {summary && <span>{summary}</span>}
            </div>

            {summary && (
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="mt-3 w-full px-4 py-3 rounded-xl border text-sm resize-none outline-none transition-colors"
                style={{
                  background: "var(--input-bg)",
                  borderColor: "var(--border)",
                  color: "var(--muted)",
                  height: "120px",
                  fontFamily: "Georgia, serif",
                }}
                placeholder="Puedes editar el resumen aquí antes de enviarlo..."
              />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
