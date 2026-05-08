"use client";

import { AppShell } from "@/components/AppShell";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

interface KnowledgeItem {
  id: string;
  title: string;
  url?: string | null;
  type: string;
  createdAt: string;
}

const TYPES = [
  { value: "tone", label: "Tono", desc: "Ejemplos de tu tono de voz" },
  { value: "style", label: "Estilo", desc: "Cómo estructuras tus textos" },
  { value: "topic", label: "Tema", desc: "Áreas de interés o expertise" },
  { value: "example", label: "Ejemplo", desc: "Textos de referencia que has escrito" },
];

type InputMode = "url" | "text" | "pdf";

const typeColors: Record<string, string> = {
  tone: "#818cf8",
  style: "#34d399",
  topic: "#f59e0b",
  example: "#f87171",
};

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [mode, setMode] = useState<InputMode>("text");
  const [type, setType] = useState("tone");
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [scraping, setScraping] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const res = await fetch("/api/knowledge");
    if (res.ok) setItems(await res.json());
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
      setTitle(data.title); setContent(data.content);
      toast.success("Contenido extraído");
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
      setTitle(data.title); setContent(data.content);
      toast.success("PDF procesado");
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
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, url: mode === "url" ? url : undefined, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setItems((prev) => [data, ...prev]);
      setTitle(""); setContent(""); setUrl("");
      toast.success("Guardado en base de conocimiento");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este elemento?")) return;
    const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
    if (res.ok) { setItems((prev) => prev.filter((i) => i.id !== id)); toast.success("Eliminado"); }
  }

  return (
    <AppShell>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Base de conocimiento</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          Añade ejemplos de tu escritura, tono y estilo. La IA los usará para generar contenido con tu voz.
        </p>

        <div className="rounded-xl p-6 border mb-8" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="text-xs font-medium mb-4" style={{ color: "var(--muted)" }}>AÑADIR ELEMENTO</h2>

          {/* Type selector */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className="py-2 px-3 rounded-lg border text-xs transition-all text-left"
                style={{
                  borderColor: type === t.value ? typeColors[t.value] : "var(--border)",
                  background: type === t.value ? `${typeColors[t.value]}18` : "var(--input-bg)",
                  color: type === t.value ? typeColors[t.value] : "var(--muted)",
                }}
              >
                <div className="font-semibold">{t.label}</div>
                <div className="mt-0.5 opacity-70 text-xs leading-tight">{t.desc}</div>
              </button>
            ))}
          </div>

          {/* Input mode tabs */}
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
                className="w-full py-8 rounded-lg border-2 border-dashed text-sm disabled:opacity-50 transition-colors"
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
              placeholder="Título descriptivo"
              className="w-full px-3 py-2 rounded-md text-sm outline-none border transition-colors"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={mode === "text" ? "Pega aquí el texto de referencia..." : "El contenido aparecerá aquí"}
              rows={6}
              className="w-full px-3 py-2 rounded-md text-sm outline-none border resize-none transition-colors"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={loading || !title || !content}
                className="px-5 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                style={{ background: "var(--accent)", color: "#ffffff" }}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {items.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
              Aún no hay elementos. Añade ejemplos de tu escritura para que la IA aprenda tu voz.
            </p>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg border transition-colors"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <span
                className="text-xs px-2 py-0.5 rounded font-mono shrink-0"
                style={{ background: `${typeColors[item.type]}20`, color: typeColors[item.type] }}
              >
                {item.type}
              </span>
              <span className="text-sm flex-1 truncate" style={{ color: "var(--foreground)" }}>{item.title}</span>
              <span className="text-xs shrink-0" style={{ color: "var(--muted)" }}>
                {new Date(item.createdAt).toLocaleDateString("es-ES")}
              </span>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-xs shrink-0 transition-colors hover:text-red-400"
                style={{ color: "var(--muted)" }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
