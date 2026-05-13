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
      toast.error("Please enter an API key");
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
      toast.success("API key saved successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error saving API key");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete the saved API key?")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/settings", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHasKey(false);
      setCurrentProvider(null);
      toast.success("API key deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error deleting API key");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AppShell>
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Settings
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          Manage your AI API key. Without it, content and digest generation will not be available.
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
                  ? `API key configured · ${PROVIDERS.find((p) => p.value === currentProvider)?.label ?? currentProvider}`
                  : "No API key configured"}
              </span>
            </div>
            {hasKey && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs transition-colors hover:underline"
                style={{ color: "var(--muted)" }}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            )}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSave} className="space-y-5">
          {/* Selector de proveedor */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--foreground)" }}>
              AI provider
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
                Get API key →
              </a>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={hasKey ? "••••••••••••••••••••• (type to replace)" : selectedProviderInfo.placeholder}
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
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
              Your API key is encrypted before being stored and never shown in plain text.
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
            {saving ? "Saving…" : hasKey ? "Update API key" : "Save API key"}
          </button>
        </form>

        {/* Info adicional */}
        <div
          className="mt-8 px-4 py-3 rounded-lg text-xs space-y-1"
          style={{ background: "var(--subtle)", color: "var(--muted)" }}
        >
          <p className="font-medium" style={{ color: "var(--foreground)" }}>Which provider should I choose?</p>
          <p><strong>Anthropic (Claude):</strong> best results for nuanced editorial content.</p>
          <p><strong>OpenAI (GPT-4o):</strong> well-rounded option, widely compatible.</p>
          <p><strong>Gemini:</strong> great choice if you already have access to Google AI Studio.</p>
        </div>
      </div>
    </AppShell>
  );
}
