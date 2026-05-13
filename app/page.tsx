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
              Sign in
            </Link>
            <Link
              href="/login?mode=register"
              style={{ fontSize: "14px", background: "var(--accent)", color: "#fff", padding: "8px 18px", borderRadius: "6px", textDecoration: "none", fontWeight: "500" }}
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "#f0ebe3", padding: "96px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", color: "var(--accent)", fontSize: "13px", fontWeight: "500", padding: "4px 14px", borderRadius: "20px", marginBottom: "28px", border: "1px solid rgba(99,102,241,0.2)" }}>
            Your personal editorial library
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: "bold", lineHeight: "1.15", marginBottom: "24px", color: "var(--foreground)" }}>
            Save articles,<br />
            <span style={{ color: "var(--accent)" }}>generate content</span> with AI
          </h1>
          <p style={{ fontSize: "18px", color: "#64748b", lineHeight: "1.7", marginBottom: "40px", maxWidth: "560px", margin: "0 auto 40px" }}>
            Capture articles from any source, organise your knowledge, and use AI to generate summaries and posts in seconds.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/login?mode=register"
              style={{ background: "var(--accent)", color: "#fff", padding: "14px 32px", borderRadius: "8px", textDecoration: "none", fontSize: "16px", fontWeight: "600" }}
            >
              Create free account →
            </Link>
            <Link
              href="/login"
              style={{ background: "var(--sidebar)", color: "var(--foreground)", padding: "14px 32px", borderRadius: "8px", textDecoration: "none", fontSize: "16px", border: "1px solid var(--border)" }}
            >
              Sign in
            </Link>
          </div>
          <p style={{ marginTop: "20px", fontSize: "13px", color: "var(--muted)" }}>No credit card required · Free to start</p>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold", marginBottom: "12px" }}>Everything you need</h2>
        <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "16px", marginBottom: "56px" }}>From capture to publication, all in one place.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "28px" }}>
          {[
            {
              icon: "📥",
              title: "Capture",
              desc: "Save articles by pasting a URL, typing text, or uploading a PDF. Klipwise extracts the content automatically.",
            },
            {
              icon: "🗂",
              title: "Organise",
              desc: "Tag, filter and archive your library. Search by title, tag or status to find any article instantly.",
            },
            {
              icon: "✍️",
              title: "Generate",
              desc: "Select articles and let AI create email digests, LinkedIn posts or Twitter threads in seconds.",
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

      {/* How it works */}
      <section style={{ background: "#f0ebe3", padding: "80px 24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "12px" }}>How it works</h2>
          <p style={{ color: "var(--muted)", fontSize: "16px", marginBottom: "56px" }}>Three steps to turn articles into content.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", textAlign: "left" }}>
            {[
              { n: "1", title: "Add", desc: "Paste a URL, write text or upload a PDF. Klipwise extracts and stores the content in your library." },
              { n: "2", title: "Organise", desc: "Tag your articles, filter by status (new, used, archived) and keep your library tidy." },
              { n: "3", title: "Generate", desc: "Select the articles you want to use and AI will create email digests or social media content for you." },
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

      {/* Final CTA */}
      <section style={{ padding: "96px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "16px" }}>Start today, for free</h2>
          <p style={{ color: "var(--muted)", fontSize: "17px", lineHeight: "1.7", marginBottom: "36px" }}>
            No credit card. No artificial limits. Just you, your articles, and AI.
          </p>
          <Link
            href="/login?mode=register"
            style={{ display: "inline-block", background: "var(--accent)", color: "#fff", padding: "16px 40px", borderRadius: "8px", textDecoration: "none", fontSize: "17px", fontWeight: "600" }}
          >
            Create my free account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px", textAlign: "center" }}>
        <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap", marginBottom: "10px" }}>
          {[
            { href: "/legal", label: "Legal Notice" },
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/cookies", label: "Cookie Policy" },
            { href: "/login", label: "Sign in" },
          ].map((l) => (
            <Link key={l.href} href={l.href} style={{ fontSize: "13px", color: "var(--muted)", textDecoration: "none" }}>
              {l.label}
            </Link>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: "12px", color: "var(--muted)" }}>© 2026 Klipwise</p>
      </footer>

    </div>
  );
}
