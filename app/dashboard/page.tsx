"use client";

import { AppShell } from "@/components/AppShell";
import { NoApiKeyBanner } from "@/components/NoApiKeyBanner";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  articles: number;
  knowledge: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({ articles: 0, knowledge: 0 });
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/articles").then((r) => r.json()),
      fetch("/api/knowledge").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]).then(([articles, knowledge, settings]) => {
      setStats({
        articles: Array.isArray(articles) ? articles.length : 0,
        knowledge: Array.isArray(knowledge) ? knowledge.length : 0,
      });
      setHasApiKey(settings.hasKey ?? false);
    });
  }, []);

  const name = session?.user?.name || session?.user?.email?.split("@")[0] || "reader";

  return (
    <AppShell>
      <div className="max-w-2xl">
        {hasApiKey === false && <NoApiKeyBanner />}
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--foreground)" }}>
          Welcome, {name}.
        </h1>
        <p className="mb-10 text-sm" style={{ color: "var(--muted)" }}>
          Your editorial writing space.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <StatCard label="Saved articles" value={stats.articles} href="/articles" />
          <StatCard label="Knowledge items" value={stats.knowledge} href="/knowledge" />
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-medium mb-4" style={{ color: "var(--muted)" }}>
            QUICK ACTIONS
          </h2>
          <QuickAction href="/articles" icon="+" label="Add article" desc="URL, text or PDF" />
          <QuickAction href="/generate/summary" icon="✉" label="Generate digest" desc="Select articles and send by email" />
          <QuickAction href="/generate/content" icon="✒" label="Create content" desc="Twitter thread, LinkedIn post or long article" />
          <QuickAction href="/knowledge" icon="◎" label="Knowledge base" desc="Add your writing style and tone" />
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="block rounded-lg p-5 border transition-all hover:border-indigo-400/50"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="text-3xl font-bold mb-1" style={{ color: "var(--accent)" }}>{value}</div>
      <div className="text-xs" style={{ color: "var(--muted)" }}>{label}</div>
    </Link>
  );
}

function QuickAction({ href, icon, label, desc }: { href: string; icon: string; label: string; desc: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded-lg border transition-all hover:border-indigo-400/50"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <span className="text-lg w-8 text-center" style={{ color: "var(--accent)" }}>{icon}</span>
      <div>
        <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{label}</div>
        <div className="text-xs" style={{ color: "var(--muted)" }}>{desc}</div>
      </div>
      <span className="ml-auto text-xs" style={{ color: "var(--muted)" }}>→</span>
    </Link>
  );
}
