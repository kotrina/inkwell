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
    <LegalLayout title="Política de Privacidad" lastUpdated="mayo de 2026">

      <p style={S.p}>
        En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD) y de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), le informamos sobre el tratamiento de sus datos personales.
      </p>

      <h2 style={S.h2}>1. Responsable del tratamiento</h2>
      <ul style={S.ul}>
        <li><strong>Identidad:</strong> Raúl Cotrina</li>
        <li><strong>NIF:</strong> 09012736W</li>
        <li><strong>Dirección:</strong> Avenida de la Coruña 37 1A, San Sebastián de los Reyes, Madrid</li>
        <li><strong>Email:</strong> raulcotrina@gmail.com</li>
      </ul>

      <h2 style={S.h2}>2. Datos personales que tratamos</h2>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Dato</th>
            <th style={S.th}>Finalidad</th>
            <th style={S.th}>Base legal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={S.td}>Nombre</td>
            <td style={S.td}>Personalización de la cuenta</td>
            <td style={S.td}>Ejecución del contrato (Art. 6.1.b RGPD)</td>
          </tr>
          <tr>
            <td style={S.td}>Dirección de email</td>
            <td style={S.td}>Acceso a la cuenta y envío de resúmenes generados</td>
            <td style={S.td}>Ejecución del contrato (Art. 6.1.b RGPD)</td>
          </tr>
          <tr>
            <td style={S.td}>Contraseña (hasheada)</td>
            <td style={S.td}>Autenticación segura</td>
            <td style={S.td}>Ejecución del contrato (Art. 6.1.b RGPD)</td>
          </tr>
          <tr>
            <td style={S.td}>Contenido de artículos</td>
            <td style={S.td}>Prestación del servicio de biblioteca y generación de contenido</td>
            <td style={S.td}>Ejecución del contrato (Art. 6.1.b RGPD)</td>
          </tr>
        </tbody>
      </table>

      <h2 style={S.h2}>3. Plazo de conservación</h2>
      <p style={S.p}>
        Los datos se conservarán mientras el usuario mantenga su cuenta activa. Una vez eliminada la cuenta, los datos se suprimirán en un plazo máximo de 30 días, salvo que exista obligación legal de conservarlos durante un período mayor.
      </p>

      <h2 style={S.h2}>4. Destinatarios y transferencias internacionales</h2>
      <p style={S.p}>
        Los datos no se ceden a terceros con fines comerciales. Para la prestación del servicio, se utilizan los siguientes proveedores técnicos que actúan como encargados del tratamiento:
      </p>
      <ul style={S.ul}>
        <li><strong>Vercel Inc.</strong> — Alojamiento de la aplicación (servidores en la UE disponibles).</li>
        <li><strong>Supabase Inc.</strong> — Base de datos (región EU West).</li>
        <li><strong>Resend Inc.</strong> — Envío de emails transaccionales.</li>
        <li><strong>Anthropic / OpenAI / Google</strong> — Proveedores de IA, según la API Key configurada por el usuario. El contenido de los artículos puede ser procesado por estos proveedores para generar resúmenes.</li>
      </ul>
      <p style={S.p}>
        En el caso de proveedores fuera del Espacio Económico Europeo, las transferencias se amparan en las Cláusulas Contractuales Tipo aprobadas por la Comisión Europea o en el marco EU-US Data Privacy Framework, según corresponda.
      </p>

      <h2 style={S.h2}>5. Derechos del usuario</h2>
      <p style={S.p}>El usuario puede ejercer en cualquier momento los siguientes derechos:</p>
      <ul style={S.ul}>
        <li><strong>Acceso:</strong> conocer qué datos personales se tratan.</li>
        <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
        <li><strong>Supresión:</strong> solicitar la eliminación de sus datos.</li>
        <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado y legible.</li>
        <li><strong>Limitación del tratamiento:</strong> solicitar que se restrinja el uso de sus datos.</li>
        <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos.</li>
      </ul>
      <p style={S.p}>
        Para ejercer estos derechos, envíe un email a <strong>raulcotrina@gmail.com</strong> indicando el derecho que desea ejercer y adjuntando una copia de su documento de identidad.
      </p>

      <h2 style={S.h2}>6. Reclamación ante la autoridad de control</h2>
      <p style={S.p}>
        Si considera que el tratamiento de sus datos no es conforme al RGPD, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD), con sede en C/ Jorge Juan 6, 28001 Madrid, a través de su sitio web{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>www.aepd.es</a>.
      </p>

      <h2 style={S.h2}>7. Seguridad</h2>
      <p style={S.p}>
        Se han adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado. Las contraseñas se almacenan cifradas mediante algoritmos de hash seguros (bcrypt) y nunca en texto plano.
      </p>

    </LegalLayout>
  );
}
