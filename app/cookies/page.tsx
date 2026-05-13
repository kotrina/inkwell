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
    <LegalLayout title="Cookie Policy" lastUpdated="May 2026">

      <div style={S.banner}>
        ✓ <strong>Klipwise does not use tracking, advertising or analytics cookies.</strong> Only strictly necessary technical cookies are used to operate the service, which do not require your consent.
      </div>

      <h2 style={S.h2}>What are cookies?</h2>
      <p style={S.p}>
        Cookies are small text files that websites store on your device when you visit them. They are used to remember your preferences, keep your session active, and in some cases, track your behaviour for analytics or advertising purposes.
      </p>

      <h2 style={S.h2}>Cookies we use</h2>
      <p style={S.p}>
        Klipwise only uses technical session cookies, which are essential for you to log in and navigate the application securely. These cookies do not collect personal information for tracking or advertising purposes.
      </p>

      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Name</th>
            <th style={S.th}>Type</th>
            <th style={S.th}>Purpose</th>
            <th style={S.th}>Duration</th>
            <th style={S.th}>Owner</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={S.td}><code>next-auth.session-token</code></td>
            <td style={S.td}>Technical</td>
            <td style={S.td}>Maintains the authenticated user session</td>
            <td style={S.td}>30 days</td>
            <td style={S.td}>Klipwise (first-party)</td>
          </tr>
          <tr>
            <td style={S.td}><code>next-auth.csrf-token</code></td>
            <td style={S.td}>Technical</td>
            <td style={S.td}>Protection against CSRF attacks</td>
            <td style={S.td}>Session</td>
            <td style={S.td}>Klipwise (first-party)</td>
          </tr>
          <tr>
            <td style={S.td}><code>next-auth.callback-url</code></td>
            <td style={S.td}>Technical</td>
            <td style={S.td}>Redirects the user to the correct page after login</td>
            <td style={S.td}>Session</td>
            <td style={S.td}>Klipwise (first-party)</td>
          </tr>
        </tbody>
      </table>

      <h2 style={S.h2}>Do you need to give consent?</h2>
      <p style={S.p}>
        No. Strictly necessary technical cookies are exempt from the consent requirement under Article 22.2 of the LSSI-CE and the guidelines of the Spanish Data Protection Agency (AEPD). For this reason, Klipwise does not display a cookie banner.
      </p>

      <h2 style={S.h2}>How to manage or delete cookies</h2>
      <p style={S.p}>
        You can configure your browser to block or delete cookies at any time. Please note that blocking technical cookies may prevent you from logging in or using the service correctly.
      </p>
      <p style={S.p}>Instructions for the main browsers:</p>
      <ul style={{ marginBottom: "16px", paddingLeft: "20px", color: "#475569" }}>
        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Google Chrome</a></li>
        <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Mozilla Firefox</a></li>
        <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Safari</a></li>
        <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Microsoft Edge</a></li>
      </ul>

      <h2 style={S.h2}>Changes to this policy</h2>
      <p style={S.p}>
        If Klipwise were to introduce analytics or other types of cookies in the future, this policy will be updated and the necessary consent mechanisms will be implemented. We will notify you of any relevant changes.
      </p>

      <h2 style={S.h2}>Contact</h2>
      <p style={S.p}>
        For any questions about our use of cookies, please contact us at{" "}
        <a href="mailto:raulcotrina@gmail.com" style={{ color: "var(--accent)" }}>raulcotrina@gmail.com</a>.
      </p>

    </LegalLayout>
  );
}
