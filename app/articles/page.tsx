"use client";

import { AppShell } from "@/components/AppShell";
import { useState, useEffect, useRef, useMemo } from "react";
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

type InputMode = "url" | "text" | "pdf";
type StatusTab = "new" | "used" | "archived" | "all";

const STATUS_TABS: { value: StatusTab; label: string }[] = [
  { value: "new", label: "Nuevos" },
  { value: "used", label: "Usados" },
  { value: "archived", label: "Archivados" },
  { value: "all", label: "Todos" },
];

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  new:      { label: "nuevo",     bg: "rgba(52,211,153,0.15)",  color: "#34d399" },
  used:     { label: "usado",     bg: "rgba(148,163,184,0.15)", color: "#94a3b8" },
  archived: { label: "archivado", bg: "rgba(148,163,184,0.10)", color: "#64748b" },
};

const STATUS_ACTIONS: Record<string, { label: string; next: string }[]> = {
  new:      [{ label: "Archivar", next: "archived" }],
  used:     [{ label: "→ Nuevo", next: "new" }, { label: "Archivar", next: "archived" }],
  archived: [{ label: "Restaurar", next: "new" }],
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

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<StatusTab>("new");
  const [mode, setMode] = useState<InputMode>("url");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearch("");
    setActiveTags(new Set());
    fetchArticles(activeTab);
  }, [activeTab]);

  async function fetchArticles(status: StatusTab) {
    const res = await fetch(`/api/articles?status=${status}`);
    if (res.ok) setArticles(await res.json());
  }

  // Derived: all tags from loaded articles
  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [articles]);

  // Derived: filtered articles
  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
      const matchTags = activeTags.size === 0 || [...activeTags].every((t) => a.tags.includes(t));
      return matchSearch && matchTags;
    });
  }, [articles, search, activeTags]);

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  async function handleScrape() {
    if (!url) return;
    setScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTitle(data.title);
      setContent(data.content);
      toast.success("Contenido extraído correctamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al procesar la URL");
    } finally {
      setScraping(false);
    }
  }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setScraping(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTitle(data.title);
      setContent(data.content);
      toast.success("PDF procesado correctamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al procesar el PDF");
    } finally {
      setScraping(false);
    }
  }

  async function handleSave() {
    if (!title || !content) { toast.error("Título y contenido son requeridos"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, url: mode === "url" ? url : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTitle(""); setContent(""); setUrl("");
      toast.success("Artículo guardado");
      if (activeTab === "new" || activeTab === "all") {
        setArticles((prev) => [data, ...prev]);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este artículo?")) return;
    const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (res.ok) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success("Artículo eliminado");
    }
  }

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      const labels: Record<string, string> = { new: "nuevo", used: "usado", archived: "archivado" };
      toast.success(`Marcado como ${labels[status] ?? status}`);
    }
  }

  return (
    <AppShell>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--foreground)" }}>Artículos</h1>

        {/* Formulario añadir */}
        <div className="rounded-xl p-6 border mb-8" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="text-xs font-medium mb-4" style={{ color: "var(--muted)" }}>AÑADIR ARTÍCULO</h2>

          <div className="flex gap-1 mb-4 p-1 rounded-lg" style={{ background: "var(--subtle)" }}>
            {(["url", "text", "pdf"] as InputMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-1.5 text-xs rounded-md transition-all font-medium"
                style={{
                  background: mode === m ? "var(--card)" : "transparent",
                  color: mode === m ? "var(--foreground)" : "var(--muted)",
                  boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {m === "url" ? "URL" : m === "text" ? "Texto" : "PDF"}
              </button>
            ))}
          </div>

          {mode === "url" && (
            <div className="flex gap-2 mb-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 rounded-md text-sm outline-none border transition-colors"
                style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
                onKeyDown={(e) => e.key === "Enter" && handleScrape()}
              />
              <button
                onClick={handleScrape}
                disabled={scraping || !url}
                className="px-4 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50"
                style={{ background: "transparent", color: "var(--accent)", border: "1px solid rgba(129,140,248,0.4)" }}
              >
                {scraping ? "Extrayendo..." : "Extraer"}
              </button>
            </div>
          )}

          {mode === "pdf" && (
            <div className="mb-4">
              <input ref={fileRef} type="file" accept=".pdf" onChange={handlePdfUpload} className="hidden" />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={scraping}
                className="w-full py-8 rounded-lg border-2 border-dashed text-sm transition-colors disabled:opacity-50"
                style={{ borderColor: "var(--border)", color: "var(--muted)" }}
              >
                {scraping ? "Procesando PDF..." : "Haz clic para subir un PDF"}
              </button>
            </div>
          )}

          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del artículo"
              className="w-full px-3 py-2 rounded-md text-sm outline-none border transition-colors"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={mode === "text" ? "Pega el texto aquí..." : "El contenido aparecerá aquí tras la extracción"}
              rows={mode === "text" ? 8 : 4}
              className="w-full px-3 py-2 rounded-md text-sm outline-none border resize-none transition-colors"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading || !title || !content}
                className="px-5 py-2 rounded-md text-sm font-medium transition-opacity disabled:opacity-50"
                style={{ background: "var(--accent)", color: "#ffffff" }}
              >
                {loading ? "Guardando..." : "Guardar artículo"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs de estado */}
        <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
          <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: "var(--subtle)" }}>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className="px-4 py-1.5 text-xs rounded-md transition-all font-medium"
                style={{
                  background: activeTab === tab.value ? "var(--card)" : "transparent",
                  color: activeTab === tab.value ? "var(--foreground)" : "var(--muted)",
                  boxShadow: activeTab === tab.value ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 min-w-48 max-w-xs relative">
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
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
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
              <button
                onClick={() => setActiveTags(new Set())}
                className="px-2.5 py-0.5 rounded-full text-xs transition-all"
                style={{ color: "var(--muted)" }}
              >
                × limpiar
              </button>
            )}
          </div>
        )}

        {/* Tabla de artículos */}
        {articles.length === 0 ? (
          <p className="text-sm text-center py-12" style={{ color: "var(--muted)" }}>
            {activeTab === "new" && "No hay artículos nuevos."}
            {activeTab === "used" && "No hay artículos usados todavía."}
            {activeTab === "archived" && "No hay artículos archivados."}
            {activeTab === "all" && "Aún no hay artículos. ¡Añade el primero!"}
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-center py-12" style={{ color: "var(--muted)" }}>
            Sin resultados para esa búsqueda.
          </p>
        ) : (
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
            {/* Header */}
            <div
              className="grid text-xs font-medium px-4 py-2.5"
              style={{
                background: "var(--subtle)",
                color: "var(--muted)",
                gridTemplateColumns: "1fr 140px 52px 80px 70px 80px",
              }}
            >
              <span>TÍTULO</span>
              <span>TAGS</span>
              <span>IDIOMA</span>
              <span>ESTADO</span>
              <span>FECHA</span>
              <span></span>
            </div>

            {/* Rows */}
            {filtered.map((article, i) => {
              const st = STATUS_STYLES[article.status] ?? STATUS_STYLES.new;
              const actions = STATUS_ACTIONS[article.status] ?? [];
              const visibleTags = article.tags.slice(0, 2);
              const extraTags = article.tags.length - visibleTags.length;

              return (
                <div
                  key={article.id}
                  className="group grid items-center px-4 py-3 transition-colors"
                  style={{
                    gridTemplateColumns: "1fr 140px 52px 80px 70px 80px",
                    borderTop: i > 0 ? `1px solid var(--border)` : "none",
                    background: "var(--card)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--subtle)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--card)")}
                >
                  {/* Título */}
                  <span
                    className="text-sm truncate pr-3 font-medium"
                    style={{ color: "var(--foreground)" }}
                    title={article.title}
                  >
                    {article.url ? (
                      <a href={article.url} target="_blank" rel="noopener noreferrer"
                        className="hover:underline" style={{ color: "var(--foreground)" }}>
                        {article.title}
                      </a>
                    ) : article.title}
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

                  {/* Acciones (visibles al hover) */}
                  <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    {actions.map((action) => (
                      <button
                        key={action.next}
                        onClick={() => handleStatusChange(article.id, action.next)}
                        className="text-xs px-1.5 py-0.5 rounded transition-colors"
                        style={{ background: "var(--subtle)", color: "var(--muted)" }}
                        title={action.label}
                      >
                        {action.label}
                      </button>
                    ))}
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-xs px-1.5 py-0.5 rounded transition-colors hover:text-red-400"
                      style={{ color: "var(--muted)" }}
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Footer con conteo */}
            <div
              className="px-4 py-2 text-xs"
              style={{ background: "var(--subtle)", borderTop: "1px solid var(--border)", color: "var(--muted)" }}
            >
              {filtered.length} {filtered.length === 1 ? "artículo" : "artículos"}
              {filtered.length !== articles.length && ` de ${articles.length}`}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
