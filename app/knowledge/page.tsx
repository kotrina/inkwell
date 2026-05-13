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
  { value: "tone", label: "Tone", desc: "Examples of your voice and tone" },
  { value: "style", label: "Style", desc: "How you structure your writing" },
  { value: "topic", label: "Topic", desc: "Areas of interest or expertise" },
  { value: "example", label: "Example", desc: "Reference texts you have written" },
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
      toast.success("Content extracted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error processing the URL");
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
      toast.success("PDF processed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error processing the PDF");
    } finally {
      setScraping(false);
    }
  }

  async function handleSave() {
    if (!title || !content) { toast.error("Title and content are required"); return; }
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
      toast.success("Saved to knowledge base");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/knowledge/${id}`, { method: "DELETE" });
    if (res.ok) { setItems((prev) => prev.filter((i) => i.id !== id)); toast.success("Deleted"); }
  }

  return (
    <AppShell>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>Knowledge base</h1>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          Add examples of your writing, tone and style. AI will use them to generate content in your voice.
        </p>

        <div className="rounded-xl p-6 border mb-8" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <h2 className="text-xs font-medium mb-4" style={{ color: "var(--muted)" }}>ADD ITEM</h2>

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
                  background: mode === m ? "var(--card)" : "transparent",
                  color: mode === m ? "var(--foreground)" : "var(--muted)",
                  boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {m === "url" ? "URL" : m === "text" ? "Text" : "PDF"}
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
                style={{
                  background: "transparent",
                  color: "var(--accent)",
                  border: "1px solid rgba(129,140,248,0.4)",
                }}
              >
                {scraping ? "Extracting..." : "Extract"}
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
                {scraping ? "Processing PDF..." : "Click to upload a PDF"}
              </button>
            </div>
          )}

          <div className="space-y-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Descriptive title"
              className="w-full px-3 py-2 rounded-md text-sm outline-none border transition-colors"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={mode === "text" ? "Paste reference text here..." : "Content will appear here"}
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
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {items.length === 0 && (
            <p className="text-sm text-center py-8" style={{ color: "var(--muted)" }}>
              No items yet. Add writing examples so AI can learn your voice.
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
                {new Date(item.createdAt).toLocaleDateString("en-GB")}
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
