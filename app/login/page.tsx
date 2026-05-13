"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function LoginForm() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        toast.success("Account created. Signing in...");
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) throw new Error("Invalid credentials");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl p-8 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
      <div className="flex mb-6 border-b" style={{ borderColor: "var(--border)" }}>
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="flex-1 pb-3 text-sm font-medium transition-colors"
            style={{
              color: mode === m ? "var(--accent)" : "var(--muted)",
              borderBottom: mode === m ? "2px solid var(--accent)" : "2px solid transparent",
            }}
          >
            {m === "login" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "var(--muted)" }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 rounded-md text-sm outline-none border transition-colors"
              style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
            />
          </div>
        )}
        <div>
          <label className="block text-xs mb-1.5" style={{ color: "var(--muted)" }}>Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="w-full px-3 py-2 rounded-md text-sm outline-none border transition-colors"
            style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <div>
          <label className="block text-xs mb-1.5" style={{ color: "var(--muted)" }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded-md text-sm outline-none border transition-colors"
            style={{ background: "var(--input-bg)", borderColor: "var(--border)", color: "var(--foreground)" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-md text-sm font-medium transition-opacity disabled:opacity-50"
          style={{ background: "var(--accent)", color: "#ffffff" }}
        >
          {loading ? "..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--background)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--accent)" }}>✒ Klipwise</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Your personal editorial library</p>
        </div>
        <Suspense fallback={<div style={{ color: "var(--muted)", textAlign: "center" }}>...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
