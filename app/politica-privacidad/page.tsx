import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Grúas Luaidesa. Información sobre el tratamiento de datos personales.",
  robots: { index: true, follow: true },
};

const FECHA = "1 de enero de 2025";
const EMPRESA = "Grúas Luaidesa";
const EMAIL_LEGAL = "gruasluaidesa@gmail.com";
const DOMICILIO = "Madrid, España";

export default function PoliticaPrivacidad() {
  return (
    <main className="min-h-screen bg-brand-black">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-32">
        <Link href="/" className="inline-flex items-center gap-2 text-gold/60 hover:text-gold text-sm mb-10 transition-colors">
          ← Volver al inicio
        </Link>

        <h1 className="font-condensed font-black text-5xl uppercase text-gold-light mb-2">Política de Privacidad</h1>
        <p className="text-brand-cream/40 text-sm mb-12">Última actualización: {FECHA}</p>

        <div className="prose-custom space-y-10 text-brand-cream/70 leading-relaxed">

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">1. Responsable del tratamiento</h2>
            <p>De conformidad con el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), le informamos que el responsable del tratamiento de los datos es:</p>
            <ul className="mt-4 space-y-1 text-sm">
              <li><strong className="text-brand-cream/90">Razón social:</strong> {EMPRESA}</li>
              <li><strong className="text-brand-cream/90">Domicilio:</strong> {DOMICILIO}</li>
              <li><strong className="text-brand-cream/90">Correo electrónico:</strong> <a href={`mailto:${EMAIL_LEGAL}`} className="text-gold hover:underline">{EMAIL_LEGAL}</a></li>
              <li><strong className="text-brand-cream/90">Actividad:</strong> Servicio de grúa y rescate vehicular</li>
            </ul>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">2. Datos que recogemos</h2>
            <p>Recopilamos los siguientes datos personales cuando usted utiliza nuestro sitio web o nos contacta:</p>
            <ul className="mt-4 space-y-2 text-sm list-disc list-inside">
              <li>Nombre y apellidos</li>
              <li>Número de teléfono</li>
              <li>Dirección de correo electrónico</li>
              <li>Ciudad o localización del servicio solicitado</li>
              <li>Tipo de servicio requerido</li>
              <li>Datos de navegación: IP, navegador, sistema operativo, páginas visitadas, fuente de tráfico</li>
              <li>Datos de cookies analíticas (Google Analytics 4)</li>
            </ul>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">3. Finalidad del tratamiento</h2>
            <div className="space-y-4 text-sm">
              <div className="bg-brand-brown/50 border border-gold/10 rounded-xl p-5">
                <p className="font-semibold text-brand-cream/90 mb-1">Gestión de solicitudes de servicio</p>
                <p>Atender y gestionar las solicitudes de grúa, rescate o asistencia vehicular enviadas a través del formulario web, WhatsApp o llamada telefónica.</p>
              </div>
              <div className="bg-brand-brown/50 border border-gold/10 rounded-xl p-5">
                <p className="font-semibold text-brand-cream/90 mb-1">Comunicación comercial</p>
                <p>Envío de información sobre nuestros servicios cuando usted lo haya solicitado expresamente. Siempre puede darse de baja.</p>
              </div>
              <div className="bg-brand-brown/50 border border-gold/10 rounded-xl p-5">
                <p className="font-semibold text-brand-cream/90 mb-1">Análisis estadístico y mejora del servicio</p>
                <p>Mediante cookies analíticas (Google Analytics 4) analizamos el tráfico y comportamiento de los usuarios de forma anónima y agregada para mejorar la experiencia del sitio.</p>
              </div>
            </div>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">4. Base jurídica del tratamiento</h2>
            <ul className="space-y-3 text-sm list-disc list-inside">
              <li><strong className="text-brand-cream/90">Ejecución de un contrato o medidas precontractuales</strong> (Art. 6.1.b RGPD): tratamiento de datos para gestionar el servicio solicitado.</li>
              <li><strong className="text-brand-cream/90">Consentimiento</strong> (Art. 6.1.a RGPD): para el envío de comunicaciones comerciales y el uso de cookies analíticas.</li>
              <li><strong className="text-brand-cream/90">Interés legítimo</strong> (Art. 6.1.f RGPD): mejora del servicio y análisis interno de la actividad.</li>
            </ul>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">5. Conservación de los datos</h2>
            <p>Sus datos personales se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron recabados:</p>
            <ul className="mt-4 space-y-2 text-sm list-disc list-inside">
              <li>Datos de contacto y solicitudes: hasta 3 años desde la última interacción.</li>
              <li>Datos de facturación: 5 años conforme a obligaciones fiscales.</li>
              <li>Datos analíticos: 26 meses (según configuración de GA4).</li>
            </ul>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">6. Comunicación a terceros</h2>
            <p>No cedemos sus datos a terceros salvo en los siguientes casos:</p>
            <ul className="mt-4 space-y-2 text-sm list-disc list-inside">
              <li><strong className="text-brand-cream/90">Google LLC:</strong> proveedor de Google Analytics 4, solo si usted acepta cookies analíticas. Acuerdo de tratamiento de datos conforme al RGPD.</li>
              <li><strong className="text-brand-cream/90">Supabase Inc.:</strong> proveedor de la base de datos donde se almacenan de forma segura las solicitudes enviadas desde el formulario web. Acuerdo de tratamiento de datos conforme al RGPD.</li>
              <li><strong className="text-brand-cream/90">Vercel Inc.:</strong> proveedor de alojamiento (hosting) del sitio web.</li>
              <li><strong className="text-brand-cream/90">Obligación legal:</strong> cuando así lo exijan las autoridades competentes.</li>
            </ul>
            <p className="mt-4 text-sm">Todos los proveedores cuentan con las garantías adecuadas para el tratamiento de datos conforme al RGPD.</p>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">7. Sus derechos</h2>
            <p>En cualquier momento puede ejercer los siguientes derechos enviando un correo a <a href={`mailto:${EMAIL_LEGAL}`} className="text-gold underline">{EMAIL_LEGAL}</a>:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
              {["Acceso a sus datos", "Rectificación de datos inexactos", "Supresión (derecho al olvido)", "Limitación del tratamiento", "Portabilidad de datos", "Oposición al tratamiento", "Retirar el consentimiento en cualquier momento"].map((d) => (
                <div key={d} className="flex items-center gap-2 bg-brand-brown/50 border border-gold/10 rounded-lg px-4 py-2.5">
                  <span className="text-gold">→</span> {d}
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm">También tiene derecho a presentar una reclamación ante la <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-gold underline">Agencia Española de Protección de Datos (AEPD)</a> si considera que el tratamiento no se ajusta a la normativa.</p>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">8. Cookies</h2>
            <p>Este sitio web utiliza cookies propias y de terceros. Para más información, consulte nuestra política de cookies integrada en el aviso al acceder al sitio. Puede gestionar sus preferencias en cualquier momento.</p>
            <div className="mt-4 space-y-3 text-sm">
              {[
                { tipo: "Cookies técnicas", desc: "Necesarias para el funcionamiento básico del sitio. No requieren consentimiento.", base: "Interés legítimo" },
                { tipo: "Cookies analíticas (GA4)", desc: "Analizan el uso del sitio de forma anónima. Activadas solo con su consentimiento.", base: "Consentimiento" },
              ].map((c) => (
                <div key={c.tipo} className="bg-brand-brown/50 border border-gold/10 rounded-lg px-4 py-3">
                  <p className="font-semibold text-brand-cream/90">{c.tipo}</p>
                  <p className="text-brand-cream/50 mt-1">{c.desc}</p>
                  <p className="text-gold-dark text-xs mt-1">Base: {c.base}</p>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-gold/10" />

          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">9. Cambios en esta política</h2>
            <p>Nos reservamos el derecho de modificar esta política para adaptarla a cambios legislativos o mejoras en nuestros servicios. Las modificaciones serán comunicadas en esta misma página.</p>
          </section>

        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Link href="/condiciones-uso" className="text-gold/60 hover:text-gold text-sm transition-colors">Condiciones de uso →</Link>
          <Link href="/proteccion-datos" className="text-gold/60 hover:text-gold text-sm transition-colors">Protección de datos →</Link>
        </div>
      </div>
    </main>
  );
}
