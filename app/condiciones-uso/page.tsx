import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Condiciones de Uso",
  description: "Condiciones generales de uso del sitio web de Grúas Luaidesa.",
  robots: { index: true, follow: true },
};

const EMPRESA = "Grúas Luaidesa";
const EMAIL = "gruasluaidesa@gmail.com";
const FECHA = "1 de enero de 2025";

export default function CondicionesUso() {
  return (
    <main className="min-h-screen bg-brand-black">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-32">
        <Link href="/" className="inline-flex items-center gap-2 text-gold/60 hover:text-gold text-sm mb-10 transition-colors">
          ← Volver al inicio
        </Link>
        <h1 className="font-condensed font-black text-5xl uppercase text-gold-light mb-2">Condiciones de Uso</h1>
        <p className="text-brand-cream/40 text-sm mb-12">Última actualización: {FECHA}</p>
        <div className="space-y-10 text-brand-cream/70 leading-relaxed">
          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">1. Objeto y ámbito</h2>
            <p>Las presentes condiciones regulan el acceso, navegación y uso del sitio web de <strong className="text-brand-cream/90">{EMPRESA}</strong>. El acceso implica la aceptación plena de estas condiciones.</p>
          </section>
          <hr className="border-gold/10" />
          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">2. Uso permitido</h2>
            <p>El usuario se compromete a un uso lícito del Sitio Web. Queda prohibido usar el sitio con fines fraudulentos, reproducir contenidos sin autorización, introducir malware o acceder a sistemas restringidos.</p>
          </section>
          <hr className="border-gold/10" />
          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">3. Propiedad intelectual</h2>
            <p>Todos los contenidos del Sitio Web son propiedad de {EMPRESA} o de terceros autorizados. Se prohíbe su reproducción sin autorización escrita previa.</p>
          </section>
          <hr className="border-gold/10" />
          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">4. Responsabilidad</h2>
            <p>{EMPRESA} no garantiza la disponibilidad continua del Sitio Web y no se responsabiliza de daños por uso incorrecto, contenidos de terceros enlazados, ni errores de información.</p>
          </section>
          <hr className="border-gold/10" />
          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">5. Condiciones del servicio</h2>
            <p>El Sitio Web es un canal de contacto. Las condiciones específicas del servicio de grúa se confirman por teléfono antes de la prestación. El precio ofrecido siempre es cerrado, sin costes adicionales no acordados.</p>
          </section>
          <hr className="border-gold/10" />
          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">6. Legislación aplicable</h2>
            <p>Estas condiciones se rigen por la legislación española. Para controversias, ambas partes se someten a los Juzgados y Tribunales de Madrid.</p>
          </section>
          <hr className="border-gold/10" />
          <section>
            <h2 className="font-condensed font-bold text-2xl text-gold uppercase mb-4">7. Contacto</h2>
            <p>Consultas: <a href={`mailto:${EMAIL}`} className="text-gold underline">{EMAIL}</a></p>
          </section>
        </div>
        <div className="mt-16 flex flex-wrap gap-4">
          <Link href="/politica-privacidad" className="text-gold/60 hover:text-gold text-sm transition-colors">Política de Privacidad →</Link>
          <Link href="/proteccion-datos" className="text-gold/60 hover:text-gold text-sm transition-colors">Protección de Datos →</Link>
        </div>
      </div>
    </main>
  );
}
