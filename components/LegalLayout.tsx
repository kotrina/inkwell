import Link from "next/link";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div style={{ background: "var(--background)", fontFamily: "Georgia, serif", color: "var(--foreground)", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ background: "var(--sidebar)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ fontWeight: "bold", fontSize: "16px", color: "var(--accent)", textDecoration: "none" }}>
            ✒ Klipwise
          </Link>
          <Link href="/" style={{ fontSize: "13px", color: "var(--muted)", textDecoration: "none" }}>
            ← Volver
          </Link>
        </div>
      </nav>

      {/* Contenido */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px", color: "var(--foreground)" }}>
          {title}
        </h1>
        <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "48px" }}>
          Última actualización: {lastUpdated}
        </p>

        <div style={{ lineHeight: "1.8", fontSize: "15px" }}>
          {children}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "20px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { href: "/legal", label: "Aviso Legal" },
            { href: "/privacy", label: "Política de Privacidad" },
            { href: "/cookies", label: "Política de Cookies" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ fontSize: "12px", color: "var(--muted)", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
