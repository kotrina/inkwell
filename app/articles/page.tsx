"use client";

import { AppShell } from "@/components/AppShell";
import { ArticleCard } from "@/components/ArticleCard";
import { useState, useEffect, useRef } from "react";
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

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<StatusTab>("new");
  const [mode, setMode] = useState<InputMode>("url");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchArticles(activeTab); }, [activeTab]);

  async function fetchArticles(status: StatusTab) {
    const res = await fetch(`/api/articles?status=${status}`);
    if (res.ok) setArticles(await res.json());
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
      // Refrescar si estamos en la tab "new" o "all"
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

  async function handleTagsChange(id: string, tags: string[]) {
    await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags }),
    });
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, tags } : a)));
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
      <div className="max-w-3xl">
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
                  background: mode === m ? "var(--accent)" : "transparent",
                  color: mode === m ? "#ffffff" : "var(--muted)",
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
                className="px-4 py-2 rounded-md text-sm font-medium transition-opacity disabled:opacity-50"
                style={{ background: "var(--btn-secondary)", color: "var(--btn-secondary-text)" }}
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
        <div className="flex gap-1 mb-4 p-1 rounded-lg w-fit" style={{ background: "var(--subtle)" }}>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="px-4 py-1.5 text-xs rounded-md transition-all font-medium"
              style={{
                background: activeTab === tab.value ? "var(--card)" : "transparent",
                color: activeTab === tab.value ? "var(--foreground)" : "var(--muted)",
                boxShadow: activeTab === tab.value ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista de artículos */}
        <div className="space-y-3">
          {articles.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
              {activeTab === "new" && "No hay artículos nuevos."}
              {activeTab === "used" && "No hay artículos usados todavía."}
              {activeTab === "archived" && "No hay artículos archivados."}
              {activeTab === "all" && "Aún no hay artículos. ¡Añade el primero!"}
            </p>
          )}
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onDelete={handleDelete}
              onTagsChange={handleTagsChange}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
