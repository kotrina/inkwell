import { LegalLayout } from "@/components/LegalLayout";

const S = {
  h2: { fontSize: "18px", fontWeight: "bold", marginTop: "40px", marginBottom: "12px", color: "var(--foreground)" } as React.CSSProperties,
  p: { marginBottom: "16px", color: "#475569" } as React.CSSProperties,
  ul: { marginBottom: "16px", paddingLeft: "20px", color: "#475569" } as React.CSSProperties,
};

export default function LegalPage() {
  return (
    <LegalLayout title="Aviso Legal" lastUpdated="mayo de 2026">

      <h2 style={S.h2}>1. Identificación del titular</h2>
      <p style={S.p}>
        En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos identificativos:
      </p>
      <ul style={S.ul}>
        <li><strong>Titular:</strong> Raúl Cotrina</li>
        <li><strong>NIF:</strong> 09012736W</li>
        <li><strong>Domicilio:</strong> Avenida de la Coruña 37 1A, San Sebastián de los Reyes, Madrid</li>
        <li><strong>Email:</strong> raulcotrina@gmail.com</li>
        <li><strong>Web:</strong> https://klipwise.app</li>
      </ul>

      <h2 style={S.h2}>2. Objeto y ámbito de aplicación</h2>
      <p style={S.p}>
        El presente Aviso Legal regula el acceso y uso del sitio web klipwise.app (en adelante, &quot;el Sitio&quot;), así como de los servicios ofrecidos a través del mismo. El acceso y uso del Sitio implica la aceptación plena y sin reservas de las condiciones establecidas en este Aviso Legal.
      </p>

      <h2 style={S.h2}>3. Condiciones de uso</h2>
      <p style={S.p}>El usuario se compromete a:</p>
      <ul style={S.ul}>
        <li>Hacer un uso lícito del Sitio y sus servicios, sin contravenir la legislación vigente.</li>
        <li>No utilizar el Sitio para actividades fraudulentas, ilegales o que puedan causar daño a terceros.</li>
        <li>No intentar acceder a áreas restringidas del Sitio sin autorización.</li>
        <li>Proporcionar información veraz y actualizada en los formularios de registro.</li>
      </ul>

      <h2 style={S.h2}>4. Propiedad intelectual e industrial</h2>
      <p style={S.p}>
        Todos los contenidos del Sitio (textos, imágenes, código fuente, logotipos y demás elementos) son propiedad del titular o disponen de la correspondiente licencia de uso. Queda prohibida su reproducción, distribución, comunicación pública o transformación sin autorización expresa del titular.
      </p>
      <p style={S.p}>
        El nombre comercial &quot;Klipwise&quot; y el dominio klipwise.app son utilizados por el titular con carácter exclusivo para la prestación de este servicio.
      </p>

      <h2 style={S.h2}>5. Limitación de responsabilidad</h2>
      <p style={S.p}>
        El titular no garantiza la disponibilidad continua del Sitio ni se hace responsable de los daños que pudieran derivarse de interrupciones, errores técnicos o accesos no autorizados ajenos a su control. El contenido generado por inteligencia artificial tiene carácter orientativo y no constituye asesoramiento profesional de ningún tipo.
      </p>

      <h2 style={S.h2}>6. Legislación aplicable y jurisdicción</h2>
      <p style={S.p}>
        El presente Aviso Legal se rige por la legislación española. Para la resolución de cualquier controversia derivada del acceso o uso del Sitio, las partes se someten a la jurisdicción de los Juzgados y Tribunales de Madrid, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
      </p>

    </LegalLayout>
  );
}
