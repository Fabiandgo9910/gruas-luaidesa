import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Protección de Datos (RGPD)",
  description: "Información sobre la protección de datos y cumplimiento del RGPD en Grúas Luaidesa.",
  robots: { index: true, follow: true },
};

const EMPRESA = "Grúas Luaidesa";
const EMAIL = "gruasluaidesa@gmail.com";
const FECHA = "1 de enero de 2025";

export default function ProteccionDatos() {
  return (
    <main className="min-h-screen bg-brand-black">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-32">
        <Link href="/" className="inline-flex items-center gap-2 text-gold/60 hover:text-gold text-sm mb-10 transition-colors">
          ← Volver al inicio
        </Link>
        <h1 className="font-condensed font-black text-5xl uppercase text-gold-light mb-2">Protección de Datos</h1>
        <p className="text-gold-dark text-sm font-semibold mb-1">Cumplimiento RGPD · LOPDGDD</p>
        <p className="text-brand-cream/40 text-sm mb-12">Última actualización: {FECHA}</p>

        <div className="bg-brand-brown/50 border border-gold/30 rounded-2xl p-6 mb-10">
          <p className="text-sm text-brand-cream/70 leading-relaxed">
            De conformidad con el <strong className="text-gold">Reglamento (UE) 2016/679 (RGPD)</strong> y la{" "}
            <strong className="text-gold">Ley Orgánica 3/2018 (LOPDGDD)</strong>, {EMPRESA} le informa sobre el tratamiento de sus datos personales de forma transparente y completa.
          </p>
        </div>

        <div className="space-y-10 text-brand-cream/70 leading-relaxed">
          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">1. Responsable del tratamiento</h2>
            <div className="bg-brand-brown/30 border border-gold/10 rounded-xl p-5 text-sm space-y-2">
              <p><span className="text-brand-cream/50">Entidad:</span> <strong className="text-brand-cream/90">{EMPRESA}</strong></p>
              <p><span className="text-brand-cream/50">Domicilio:</span> Madrid, España</p>
              <p><span className="text-brand-cream/50">Contacto DPD:</span> <a href={`mailto:${EMAIL}`} className="text-gold underline">{EMAIL}</a></p>
            </div>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">2. Registro de actividades de tratamiento</h2>
            <div className="space-y-4">
              {[
                { actividad: "Gestión de solicitudes de servicio", base: "Ejecución de contrato (Art. 6.1.b)", plazo: "3 años desde la última interacción", datos: "Nombre, teléfono, email, ciudad, tipo de servicio" },
                { actividad: "Comunicaciones comerciales", base: "Consentimiento (Art. 6.1.a)", plazo: "Hasta retirada del consentimiento", datos: "Nombre, email, teléfono" },
                { actividad: "Analítica web", base: "Consentimiento (Art. 6.1.a)", plazo: "26 meses (GA4)", datos: "IP anonimizada, cookies, comportamiento de navegación" },
                { actividad: "Obligaciones legales", base: "Obligación legal (Art. 6.1.c)", plazo: "Según normativa aplicable (máx. 10 años)", datos: "Datos de facturación y contables" },
              ].map((item) => (
                <div key={item.actividad} className="bg-brand-brown/40 border border-gold/10 rounded-xl p-5 text-sm">
                  <p className="font-semibold text-brand-cream/90 mb-2">{item.actividad}</p>
                  <p><span className="text-brand-cream/40">Base jurídica:</span> <span className="text-gold-dark">{item.base}</span></p>
                  <p><span className="text-brand-cream/40">Conservación:</span> {item.plazo}</p>
                  <p><span className="text-brand-cream/40">Datos tratados:</span> {item.datos}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">3. Encargados del tratamiento</h2>
            <div className="space-y-3 text-sm">
              {[
                { nombre: "Google LLC (Analytics 4)", servicio: "Analítica web anónima, solo con consentimiento", pais: "EE.UU. — Cláusulas contractuales tipo UE", info: "https://policies.google.com/privacy" },
                { nombre: "Supabase Inc.", servicio: "Base de datos de solicitudes (leads)", pais: "UE (región configurable) — DPA disponible", info: "https://supabase.com/privacy" },
                { nombre: "Vercel Inc.", servicio: "Alojamiento del sitio web", pais: "EE.UU. — DPA disponible", info: "https://vercel.com/legal/privacy-policy" },
              ].map((enc) => (
                <div key={enc.nombre} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 bg-brand-brown/30 border border-gold/10 rounded-lg px-4 py-3">
                  <div>
                    <p className="font-semibold text-brand-cream/90">{enc.nombre}</p>
                    <p className="text-brand-cream/40">{enc.servicio} · {enc.pais}</p>
                  </div>
                  <a href={enc.info} target="_blank" rel="noopener noreferrer" className="text-gold text-xs underline flex-shrink-0">Ver política</a>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">4. Transferencias internacionales</h2>
            <p>Los datos pueden ser transferidos a países fuera del Espacio Económico Europeo (EEE), en particular a EE.UU., a través de nuestros encargados del tratamiento (Google, Vercel). Dichas transferencias se realizan con las garantías adecuadas según el Art. 46 RGPD (Cláusulas Contractuales Tipo o marcos equivalentes).</p>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">5. Sus derechos RGPD</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { derecho: "Acceso", desc: "Conocer qué datos tratamos sobre usted.", art: "Art. 15" },
                { derecho: "Rectificación", desc: "Corregir datos inexactos o incompletos.", art: "Art. 16" },
                { derecho: "Supresión", desc: "Solicitar la eliminación de sus datos.", art: "Art. 17" },
                { derecho: "Limitación", desc: "Restringir el tratamiento en ciertos casos.", art: "Art. 18" },
                { derecho: "Portabilidad", desc: "Recibir sus datos en formato estructurado.", art: "Art. 20" },
                { derecho: "Oposición", desc: "Oponerse al tratamiento por interés legítimo.", art: "Art. 21" },
              ].map((d) => (
                <div key={d.derecho} className="bg-brand-brown/40 border border-gold/10 rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-brand-cream/90">{d.derecho}</p>
                    <span className="text-xs text-gold-dark">{d.art}</span>
                  </div>
                  <p className="text-brand-cream/50">{d.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 bg-brand-brown/60 border border-gold/20 rounded-xl p-5 text-sm">
              <p className="text-brand-cream/80">Para ejercer cualquiera de estos derechos, envíe un correo a <a href={`mailto:${EMAIL}`} className="text-gold underline">{EMAIL}</a> indicando el derecho que desea ejercer y adjuntando una copia de su DNI.</p>
              <p className="mt-3 text-brand-cream/50">Plazo de respuesta: 30 días hábiles (prorrogable otros 60 días en casos complejos, con notificación previa).</p>
            </div>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">6. Reclamación ante la AEPD</h2>
            <p>Si considera que el tratamiento de sus datos no se ajusta a la normativa, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos:</p>
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-gold underline hover:text-gold-light transition-colors">
              www.aepd.es →
            </a>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">7. Medidas de seguridad</h2>
            <p>{EMPRESA} aplica las medidas técnicas y organizativas apropiadas para garantizar la seguridad de los datos personales, incluyendo:</p>
            <ul className="mt-4 space-y-2 text-sm list-disc list-inside">
              <li>Cifrado de las comunicaciones mediante HTTPS/TLS.</li>
              <li>Acceso restringido a los datos por parte del personal autorizado.</li>
              <li>Revisión periódica de las medidas de seguridad.</li>
              <li>Uso de proveedores certificados con acuerdos de encargado del tratamiento.</li>
            </ul>
          </section>
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link href="/politica-privacidad" className="text-gold/60 hover:text-gold text-sm transition-colors">Política de Privacidad →</Link>
          <Link href="/condiciones-uso" className="text-gold/60 hover:text-gold text-sm transition-colors">Condiciones de Uso →</Link>
        </div>
      </div>
    </main>
  );
}
