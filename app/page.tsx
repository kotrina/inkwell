import Link from "next/link";

export default function Home() {
  return (
    <div style={{ background: "var(--background)", fontFamily: "Georgia, serif", color: "var(--foreground)" }}>

      {/* Nav */}
      <nav style={{ background: "var(--sidebar)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: "bold", fontSize: "18px", color: "var(--accent)" }}>✒ Klipwise</span>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link href="/login" style={{ fontSize: "14px", color: "var(--muted)", textDecoration: "none" }}>
              Iniciar sesión
            </Link>
            <Link
              href="/login?mode=register"
              style={{ fontSize: "14px", background: "var(--accent)", color: "#fff", padding: "8px 18px", borderRadius: "6px", textDecoration: "none", fontWeight: "500" }}
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "#f0ebe3", padding: "96px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", color: "var(--accent)", fontSize: "13px", fontWeight: "500", padding: "4px 14px", borderRadius: "20px", marginBottom: "28px", border: "1px solid rgba(99,102,241,0.2)" }}>
            Tu biblioteca editorial personal
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: "bold", lineHeight: "1.15", marginBottom: "24px", color: "var(--foreground)" }}>
            Guarda artículos,<br />
            <span style={{ color: "var(--accent)" }}>genera contenido</span> con IA
          </h1>
          <p style={{ fontSize: "18px", color: "#64748b", lineHeight: "1.7", marginBottom: "40px", maxWidth: "560px", margin: "0 auto 40px" }}>
            Captura artículos de cualquier fuente, organiza tu conocimiento y usa la IA para generar resúmenes y posts en segundos.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/login?mode=register"
              style={{ background: "var(--accent)", color: "#fff", padding: "14px 32px", borderRadius: "8px", textDecoration: "none", fontSize: "16px", fontWeight: "600" }}
            >
              Crear cuenta gratis →
            </Link>
            <Link
              href="/login"
              style={{ background: "var(--sidebar)", color: "var(--foreground)", padding: "14px 32px", borderRadius: "8px", textDecoration: "none", fontSize: "16px", border: "1px solid var(--border)" }}
            >
              Iniciar sesión
            </Link>
          </div>
          <p style={{ marginTop: "20px", fontSize: "13px", color: "var(--muted)" }}>Sin tarjeta de crédito · Gratis para empezar</p>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold", marginBottom: "12px" }}>Todo lo que necesitas</h2>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "16px", marginBottom: "56px" }}>De la captura a la publicación, en un solo lugar.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px" }}>
          {[
            {
              icon: "📥",
              title: "Captura",
              desc: "Guarda artículos pegando una URL, escribiendo texto o subiendo un PDF. Klipwise extrae el contenido automáticamente.",
            },
            {
              icon: "🗂",
              title: "Organiza",
              desc: "Etiqueta, filtra y archiva tu biblioteca. Busca por título, etiqueta o estado para encontrar cualquier artículo al instante.",
            },
            {
              icon: "✍️",
              title: "Genera",
              desc: "Selecciona artículos y pide a la IA que cree resúmenes por email, posts para LinkedIn o hilos de Twitter.",
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "32px 28px" }}
            >
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>{f.icon}</div>
              <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>{f.title}</h3>
              <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.65" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section style={{ background: "#f0ebe3", padding: "80px 24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "12px" }}>Cómo funciona</h2>
          <p style={{ color: "var(--muted)", fontSize: "16px", marginBottom: "56px" }}>Tres pasos para convertir artículos en contenido.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", textAlign: "left" }}>
            {[
              { n: "1", title: "Añade", desc: "Pega una URL, escribe texto o sube un PDF. Klipwise extrae y guarda el contenido en tu biblioteca." },
              { n: "2", title: "Organiza", desc: "Etiqueta tus artículos, filtra por estado (nuevo, usado, archivado) y mantén tu biblioteca ordenada." },
              { n: "3", title: "Genera", desc: "Selecciona los artículos que quieres usar y la IA generará resúmenes por email o contenido para redes sociales." },
            ].map((step) => (
              <div key={step.n} style={{ display: "flex", gap: "20px", alignItems: "flex-start", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px 28px" }}>
                <div style={{ background: "var(--accent)", color: "#fff", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "16px", flexShrink: 0 }}>
                  {step.n}
                </div>
                <div>
                  <h4 style={{ fontSize: "17px", fontWeight: "bold", marginBottom: "6px" }}>{step.title}</h4>
                  <p style={{ color: "#64748b", fontSize: "15px", lineHeight: "1.65", margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ padding: "96px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>Empieza hoy, gratis</h2>
          <p style={{ color: "var(--muted)", fontSize: "17px", lineHeight: "1.7", marginBottom: "36px" }}>
            Sin tarjeta de crédito. Sin límites artificiales. Solo tú, tus artículos y la IA.
          </p>
          <Link
            href="/login?mode=register"
            style={{ display: "inline-block", background: "var(--accent)", color: "#fff", padding: "16px 40px", borderRadius: "8px", textDecoration: "none", fontSize: "17px", fontWeight: "600" }}
          >
            Crear mi cuenta gratis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px", textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>
          © 2025 Klipwise ·{" "}
          <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none" }}>Iniciar sesión</Link>
        </p>
      </footer>

    </div>
  );
}
