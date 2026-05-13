import { LegalLayout } from "@/components/LegalLayout";

const S = {
  h2: { fontSize: "18px", fontWeight: "bold", marginTop: "40px", marginBottom: "12px", color: "var(--foreground)" } as React.CSSProperties,
  p: { marginBottom: "16px", color: "#475569" } as React.CSSProperties,
  table: { width: "100%", borderCollapse: "collapse" as const, marginBottom: "24px", fontSize: "14px" },
  th: { textAlign: "left" as const, padding: "10px 12px", background: "#f0ebe3", color: "#8a7e72", fontWeight: "600", fontSize: "12px", border: "1px solid #e2e8f0" },
  td: { padding: "10px 12px", color: "#475569", border: "1px solid #e2e8f0", verticalAlign: "top" as const },
  banner: { background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", borderRadius: "8px", padding: "16px 20px", marginBottom: "32px", color: "#065f46", fontSize: "14px" },
};

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de Cookies" lastUpdated="mayo de 2026">

      <div style={S.banner}>
        ✓ <strong>Klipwise no utiliza cookies de seguimiento, publicidad ni analítica.</strong> Solo se usan cookies técnicas estrictamente necesarias para el funcionamiento del servicio, que no requieren su consentimiento.
      </div>

      <h2 style={S.h2}>¿Qué son las cookies?</h2>
      <p style={S.p}>
        Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo cuando los visita. Se utilizan para recordar sus preferencias, mantener su sesión activa y, en algunos casos, rastrear su comportamiento con fines analíticos o publicitarios.
      </p>

      <h2 style={S.h2}>Cookies que utilizamos</h2>
      <p style={S.p}>
        Klipwise únicamente utiliza cookies técnicas de sesión, imprescindibles para que pueda iniciar sesión y navegar por la aplicación de forma segura. Estas cookies no recopilan información personal con fines de seguimiento o publicidad.
      </p>

      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Nombre</th>
            <th style={S.th}>Tipo</th>
            <th style={S.th}>Finalidad</th>
            <th style={S.th}>Duración</th>
            <th style={S.th}>Titular</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={S.td}><code>next-auth.session-token</code></td>
            <td style={S.td}>Técnica</td>
            <td style={S.td}>Mantiene la sesión del usuario autenticado</td>
            <td style={S.td}>30 días</td>
            <td style={S.td}>Klipwise (propia)</td>
          </tr>
          <tr>
            <td style={S.td}><code>next-auth.csrf-token</code></td>
            <td style={S.td}>Técnica</td>
            <td style={S.td}>Protección contra ataques CSRF</td>
            <td style={S.td}>Sesión</td>
            <td style={S.td}>Klipwise (propia)</td>
          </tr>
          <tr>
            <td style={S.td}><code>next-auth.callback-url</code></td>
            <td style={S.td}>Técnica</td>
            <td style={S.td}>Redirige al usuario a la página correcta tras el login</td>
            <td style={S.td}>Sesión</td>
            <td style={S.td}>Klipwise (propia)</td>
          </tr>
        </tbody>
      </table>

      <h2 style={S.h2}>¿Necesita dar su consentimiento?</h2>
      <p style={S.p}>
        No. Las cookies técnicas o estrictamente necesarias están exentas del requisito de consentimiento según el artículo 22.2 de la LSSI-CE y las directrices de la Agencia Española de Protección de Datos (AEPD). Por este motivo, Klipwise no muestra un banner de cookies.
      </p>

      <h2 style={S.h2}>¿Cómo gestionar o eliminar las cookies?</h2>
      <p style={S.p}>
        Puede configurar su navegador para bloquear o eliminar cookies en cualquier momento. Tenga en cuenta que bloquear las cookies técnicas puede impedir que pueda iniciar sesión o usar el servicio correctamente.
      </p>
      <p style={S.p}>Instrucciones para los principales navegadores:</p>
      <ul style={{ marginBottom: "16px", paddingLeft: "20px", color: "#475569" }}>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Safari</a></li>
        <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Microsoft Edge</a></li>
      </ul>

      <h2 style={S.h2}>Cambios en esta política</h2>
      <p style={S.p}>
        Si en el futuro Klipwise incorporara cookies de analítica u otro tipo, esta política se actualizará y se implementarán los mecanismos de consentimiento necesarios. Le informaremos de cualquier cambio relevante.
      </p>

      <h2 style={S.h2}>Contacto</h2>
      <p style={S.p}>
        Para cualquier consulta sobre el uso de cookies, puede contactar con nosotros en{" "}
        <a href="mailto:raulcotrina@gmail.com" style={{ color: "var(--accent)" }}>raulcotrina@gmail.com</a>.
      </p>

    </LegalLayout>
  );
}
