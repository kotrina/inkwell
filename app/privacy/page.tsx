import { LegalLayout } from "@/components/LegalLayout";

const S = {
  h2: { fontSize: "18px", fontWeight: "bold", marginTop: "40px", marginBottom: "12px", color: "var(--foreground)" } as React.CSSProperties,
  p: { marginBottom: "16px", color: "#475569" } as React.CSSProperties,
  ul: { marginBottom: "16px", paddingLeft: "20px", color: "#475569" } as React.CSSProperties,
  table: { width: "100%", borderCollapse: "collapse" as const, marginBottom: "24px", fontSize: "14px" },
  th: { textAlign: "left" as const, padding: "10px 12px", background: "#f0ebe3", color: "#8a7e72", fontWeight: "600", fontSize: "12px", border: "1px solid #e2e8f0" },
  td: { padding: "10px 12px", color: "#475569", border: "1px solid #e2e8f0", verticalAlign: "top" as const },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="May 2026">

      <p style={S.p}>
        In accordance with Regulation (EU) 2016/679 of the European Parliament and of the Council (GDPR) and Organic Law 3/2018 of 5 December on the Protection of Personal Data and guarantee of digital rights (LOPDGDD), we inform you about the processing of your personal data.
      </p>

      <h2 style={S.h2}>1. Data controller</h2>
      <ul style={S.ul}>
        <li><strong>Identity:</strong> Raúl Cotrina</li>
        <li><strong>NIF:</strong> 09012736W</li>
        <li><strong>Address:</strong> Avenida de la Coruña 37 1A, San Sebastián de los Reyes, Madrid, Spain</li>
        <li><strong>Email:</strong> raulcotrina@gmail.com</li>
      </ul>

      <h2 style={S.h2}>2. Personal data we process</h2>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Data</th>
            <th style={S.th}>Purpose</th>
            <th style={S.th}>Legal basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={S.td}>Name</td>
            <td style={S.td}>Account personalisation</td>
            <td style={S.td}>Performance of contract (Art. 6.1.b GDPR)</td>
          </tr>
          <tr>
            <td style={S.td}>Email address</td>
            <td style={S.td}>Account access and delivery of generated summaries</td>
            <td style={S.td}>Performance of contract (Art. 6.1.b GDPR)</td>
          </tr>
          <tr>
            <td style={S.td}>Password (hashed)</td>
            <td style={S.td}>Secure authentication</td>
            <td style={S.td}>Performance of contract (Art. 6.1.b GDPR)</td>
          </tr>
          <tr>
            <td style={S.td}>Article content</td>
            <td style={S.td}>Provision of the library and content generation service</td>
            <td style={S.td}>Performance of contract (Art. 6.1.b GDPR)</td>
          </tr>
        </tbody>
      </table>

      <h2 style={S.h2}>3. Retention period</h2>
      <p style={S.p}>
        Data will be retained for as long as the user keeps their account active. Once the account is deleted, data will be erased within a maximum of 30 days, unless there is a legal obligation to retain it for a longer period.
      </p>

      <h2 style={S.h2}>4. Recipients and international transfers</h2>
      <p style={S.p}>
        Data is not shared with third parties for commercial purposes. For the provision of the service, the following technical providers act as data processors:
      </p>
      <ul style={S.ul}>
        <li><strong>Vercel Inc.</strong> — Application hosting (EU servers available).</li>
        <li><strong>Supabase Inc.</strong> — Database (EU West region).</li>
        <li><strong>Resend Inc.</strong> — Transactional email delivery.</li>
        <li><strong>Anthropic / OpenAI / Google</strong> — AI providers, depending on the API key configured by the user. Article content may be processed by these providers to generate summaries.</li>
      </ul>
      <p style={S.p}>
        Where providers are located outside the European Economic Area, transfers are covered by the Standard Contractual Clauses approved by the European Commission or the EU-US Data Privacy Framework, as applicable.
      </p>

      <h2 style={S.h2}>5. Your rights</h2>
      <p style={S.p}>You may exercise the following rights at any time:</p>
      <ul style={S.ul}>
        <li><strong>Access:</strong> find out what personal data is being processed.</li>
        <li><strong>Rectification:</strong> correct inaccurate or incomplete data.</li>
        <li><strong>Erasure:</strong> request deletion of your data.</li>
        <li><strong>Portability:</strong> receive your data in a structured, machine-readable format.</li>
        <li><strong>Restriction of processing:</strong> request that the use of your data be restricted.</li>
        <li><strong>Objection:</strong> object to the processing of your data.</li>
      </ul>
      <p style={S.p}>
        To exercise these rights, send an email to <strong>raulcotrina@gmail.com</strong> stating the right you wish to exercise and attaching a copy of your identity document.
      </p>

      <h2 style={S.h2}>6. Right to lodge a complaint</h2>
      <p style={S.p}>
        If you consider that the processing of your data does not comply with the GDPR, you have the right to lodge a complaint with the Spanish Data Protection Agency (AEPD), located at C/ Jorge Juan 6, 28001 Madrid, through its website{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>www.aepd.es</a>.
      </p>

      <h2 style={S.h2}>7. Security</h2>
      <p style={S.p}>
        The necessary technical and organisational measures have been adopted to ensure the security of personal data and prevent its alteration, loss, processing or unauthorised access. Passwords are stored encrypted using secure hashing algorithms (bcrypt) and are never stored in plain text.
      </p>

    </LegalLayout>
  );
}
