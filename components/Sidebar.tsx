"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: "⊞" },
  { href: "/articles", label: "Artículos", icon: "◈" },
  { href: "/knowledge", label: "Conocimiento", icon: "◎" },
  { href: "/generate/summary", label: "Resumen email", icon: "✉" },
  { href: "/generate/content", label: "Generar contenido", icon: "✒" },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside
      style={{
        background: "var(--sidebar)",
        borderRight: "1px solid var(--border)",
        width: "220px",
        minHeight: "100vh",
      }}
      className="flex flex-col shrink-0 transition-colors duration-200"
    >
      <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
        <span className="text-lg font-bold tracking-tight" style={{ color: "var(--accent)" }}>
          ✒ Inkwell
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
              style={{
                color: active ? "var(--accent)" : "var(--muted)",
                background: active ? "rgba(129,140,248,0.1)" : "transparent",
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: "var(--border)" }}>
        <ThemeToggle />
        {[
          { href: "/settings", label: "Configuración", icon: "⚙" },
          { href: "/manual", label: "Manual de usuario", icon: "?" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
            style={{
              color: pathname === item.href ? "var(--accent)" : "var(--muted)",
              background: pathname === item.href ? "rgba(129,140,248,0.1)" : "transparent",
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
        <div className="px-3 pt-2">
          <p className="text-xs mb-1.5 truncate" style={{ color: "var(--muted)" }}>
            {session?.user?.email}
          </p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs transition-colors hover:underline"
            style={{ color: "var(--muted)" }}
          >
            Cerrar sesión →
          </button>
        </div>
      </div>
    </aside>
  );
}
