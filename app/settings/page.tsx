"use client";

import { AppShell } from "@/components/AppShell";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Provider = "anthropic" | "openai" | "gemini";

const PROVIDERS: { value: Provider; label: string; placeholder: string; docsUrl: string }[] = [
  {
    value: "anthropic",
    label: "Anthropic (Claude)",
    placeholder: "sk-ant-api03-...",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    value: "openai",
    label: "OpenAI (GPT-4o)",
    placeholder: "sk-proj-...",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  {
    value: "gemini",
    label: "Google Gemini",
    placeholder: "AIza...",
    docsUrl: "https://aistudio.google.com/app/apikey",
  },
];

export default function SettingsPage() {
  const [provider, setProvider] = useState<Provider>("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setHasKey(data.hasKey);
        if (data.provider) {
          setCurrentProvider(data.provider);
          setProvider(data.provider);
        }
        setLoading(false);
      });
  }, []);

  const selectedProviderInfo = PROVIDERS.find((p) => p.value === provider)!;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast.error("Introduce una API Key");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHasKey(true);
      setCurrentProvider(provider);
      setApiKey("");
      toast.success("API Key guardada correctamente");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("¿Eliminar la API Key guardada?")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/settings", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHasKey(false);
      setCurrentProvider(null);
      toast.success("API Key eliminada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AppShell>
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Configuración
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Gestiona tu API Key de IA. Sin ella, la generación de contenido y resúmenes no estará disponible.
        </p>

        {/* Estado actual */}
        {!loading && (
          <div
            className="flex items-center justify-between px-4 py-3 rounded-lg mb-8"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: hasKey ? "#22c55e" : "#f59e0b" }}
              />
              <span className="text-sm" style={{ color: "var(--foreground)" }}>
                {hasKey
                  ? `API Key configurada · ${PROVIDERS.find((p) => p.value === currentProvider)?.label ?? currentProvider}`
                  : "Sin API Key configurada"}
              </span>
            </div>
            {hasKey && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs transition-colors hover:underline"
                style={{ color: "var(--muted)" }}
              >
                {deleting ? "Eliminando…" : "Eliminar"}
              </button>
            )}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Selector de proveedor */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              Proveedor de IA
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setProvider(p.value)}
                  className="px-3 py-2.5 rounded-md text-xs font-medium border transition-all text-center"
                  style={{
                    borderColor: provider === p.value ? "var(--accent)" : "var(--border)",
                    background: provider === p.value ? "rgba(129,140,248,0.1)" : "var(--card)",
                    color: provider === p.value ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input de API Key */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                API Key
              </label>
              <a
                href={selectedProviderInfo.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline"
                style={{ color: "var(--accent)" }}
              >
                Obtener API Key →
              </a>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={hasKey ? "••••••••••••••••••••• (escribe para reemplazar)" : selectedProviderInfo.placeholder}
                className="w-full px-3 py-2.5 rounded-md text-sm pr-16"
                style={{
                  background: "var(--input-bg)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                  outline: "none",
                }}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                style={{ color: "var(--muted)" }}
              >
                {showKey ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
              Tu API Key se cifra antes de guardarse y nunca se muestra en claro.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-md text-sm font-medium transition-opacity"
            style={{
              background: "var(--accent)",
              color: "#fff",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Guardando…" : hasKey ? "Actualizar API Key" : "Guardar API Key"}
          </button>
        </form>

        {/* Info adicional */}
        <div
          className="mt-8 px-4 py-3 rounded-lg text-xs space-y-1"
          style={{ background: "var(--subtle)", color: "var(--muted)" }}
        >
          <p className="font-medium" style={{ color: "var(--foreground)" }}>¿Qué proveedor elegir?</p>
          <p><strong>Anthropic (Claude):</strong> mejor resultado para textos en español y contenido con matices.</p>
          <p><strong>OpenAI (GPT-4o):</strong> opción equilibrada, ampliamente compatible.</p>
          <p><strong>Gemini:</strong> buena opción si ya tienes acceso a Google AI Studio.</p>
        </div>
      </div>
    </AppShell>
  );
}
