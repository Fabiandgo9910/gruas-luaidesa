import Navbar from "@/components/Navbar";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import {
  IconPhone, IconWhatsApp, IconTruck, IconRoute, IconAlert, IconShield,
  IconBolt, IconTag, IconPin, IconClock, IconInvoice, IconChevronDown,
} from "@/components/icons";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34674088195";
const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+34 674 08 81 95";
const PHONE_HREF = PHONE.replace(/\s/g, "");

const SERVICIOS = [
  { Icon: IconTruck, title: "Grúa de emergencia", desc: "Avería, accidente o atasco. Llegamos las 24 horas del día, todos los días del año.", kw: "grúa emergencia Madrid", big: true },
  { Icon: IconRoute, title: "Traslado de vehículo", desc: "Movemos tu coche de un punto a otro sin un solo arañazo. Precio cerrado.", kw: "traslado vehículo Madrid" },
  { Icon: IconPin, title: "Rescate en carretera", desc: "Autopistas, nacionales y vías secundarias en toda España.", kw: "rescate carretera España" },
  { Icon: IconAlert, title: "Asistencia por accidente", desc: "Coordinamos con seguros y autoridades para que tú no tengas que hacerlo.", kw: "asistencia accidente tráfico" },
];

const ZONAS = [
  "Madrid Capital", "Alcalá de Henares", "Getafe", "Leganés", "Alcorcón",
  "Móstoles", "Fuenlabrada", "Parla", "Torrejón de Ardoz", "Pozuelo de Alarcón",
  "Majadahonda", "Las Rozas", "Coslada", "Rivas-Vaciamadrid", "Valdemoro",
  "Barcelona", "Valencia", "Sevilla", "Resto de España",
];

const PROCESO = [
  { n: "01", title: "Nos cuentas qué pasa", desc: "Llamas, escribes por WhatsApp o rellenas el formulario. Un persona real te atiende, sin centralitas ni esperas." },
  { n: "02", title: "Confirmamos precio cerrado", desc: "Te decimos el coste exacto antes de movernos. Sin sorpresas al llegar, sin letra pequeña." },
  { n: "03", title: "Llegamos y resolvemos", desc: "Grúa en camino con protocolo de seguridad. Tu vehículo llega intacto al destino acordado." },
];

const FAQ = [
  { q: "¿Cuánto tarda en llegar la grúa en Madrid?", a: "Nuestro tiempo medio de respuesta en Madrid capital es de 20 a 30 minutos. En zonas periféricas de la Comunidad de Madrid puede ser de 30 a 45 minutos dependiendo del tráfico." },
  { q: "¿Cuánto cuesta un servicio de grúa?", a: "El precio varía según el tipo de servicio, distancia y horario. Te damos presupuesto cerrado antes de desplazarnos, sin sorpresas ni costes ocultos." },
  { q: "¿Emitís factura?", a: "Sí. Somos una empresa legalmente constituida y emitimos factura tanto a particulares como a empresas para cualquier servicio realizado." },
  { q: "¿Cubren toda España o solo Madrid?", a: "Tenemos cobertura en toda España. Nuestra base principal está en Madrid, desde donde cubrimos toda la Comunidad de Madrid y coordinamos servicios en el resto del territorio nacional." },
  { q: "¿Trabajan de noche y en festivos?", a: "Sí, operamos 24 horas al día, 7 días a la semana, incluidos festivos. Las emergencias no tienen horario, y nosotros tampoco." },
  { q: "¿Puedo solicitar grúa por WhatsApp?", a: "Sí. Puedes contactarnos por WhatsApp, llamada o formulario. Por WhatsApp puedes enviarnos tu ubicación directamente para una respuesta aún más rápida." },
];

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-brand-cream pt-36 pb-24 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_0%,rgba(201,162,39,0.16)_0%,transparent_55%)]" />

        <div className="relative z-10 max-w-container mx-auto px-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-7">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 animate-ping-slow" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold text-gold-dark uppercase tracking-[0.2em]">Operativos ahora · 24h</span>
            </div>

            <h1 className="font-condensed font-black text-5xl sm:text-6xl md:text-7xl leading-[0.98] uppercase text-brand-black mb-6">
              Grúa en Madrid
              <br />
              <span className="text-gold">y toda España</span>
            </h1>

            <p className="max-w-lg text-base md:text-lg text-brand-black/55 mb-10 leading-relaxed">
              Rescate vehicular con respuesta rápida, precio cerrado y factura legal
              para particulares y empresas.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 mb-12">
              <a
                href={`tel:${PHONE_HREF}`}
                className="flex items-center justify-center gap-3 bg-brand-black hover:bg-brand-brown text-brand-cream font-condensed font-black text-lg uppercase tracking-wide rounded-full px-8 py-4 transition-all hover:-translate-y-0.5"
              >
                <IconPhone className="w-5 h-5" /> Llamar ahora
              </a>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola, necesito una grúa urgente en Madrid")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 border-2 border-brand-black/15 hover:border-brand-black/40 text-brand-black font-condensed font-black text-lg uppercase tracking-wide rounded-full px-8 py-4 transition-all"
              >
                <IconWhatsApp className="w-5 h-5" /> WhatsApp
              </a>
            </div>

            {/* Confianza — una sola línea, sin cajas */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-brand-black/45 text-xs font-medium">
              <span className="flex items-center gap-1.5"><IconInvoice className="w-4 h-4 text-gold" /> Factura legal</span>
              <span className="flex items-center gap-1.5"><IconTag className="w-4 h-4 text-gold" /> Precio cerrado</span>
              <span className="flex items-center gap-1.5"><IconClock className="w-4 h-4 text-gold" /> 20–30 min de media</span>
            </div>
          </div>
        </div>

        <a href="#servicios" aria-label="Ir a servicios" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-brand-black/25 hover:text-gold transition-colors">
          <IconChevronDown className="w-6 h-6 animate-bounce" />
        </a>
      </section>

      {/* ===== SERVICIOS ===== */}
      <section id="servicios" className="py-24 sm:py-28 bg-brand-brown">
        <div className="max-w-container mx-auto px-5">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">Lo que hacemos</p>
              <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl uppercase text-brand-cream">
                Nuestros <span className="text-gold">servicios</span>
              </h2>
              <p className="mt-4 text-brand-cream/50">
                Desde una avería simple hasta el rescate en autopista — cubrimos cualquier situación, en cualquier punto de España.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SERVICIOS.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className={s.big ? "md:col-span-2" : ""}>
                <article
                  className={`h-full bg-brand-black border border-gold/15 hover:border-gold/40 rounded-2xl p-7 sm:p-8 transition-all hover:-translate-y-1 group ${s.big ? "sm:flex sm:items-center sm:gap-8" : ""}`}
                  aria-label={s.kw}
                >
                  <div className={s.big ? "sm:w-1/3" : ""}>
                    <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold mb-5">
                      <s.Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-condensed font-bold text-xl sm:text-2xl uppercase text-gold-light mb-3 group-hover:text-gold transition-colors">
                      {s.title}
                    </h3>
                  </div>
                  <p className={`text-brand-cream/50 text-sm leading-relaxed ${s.big ? "sm:w-2/3" : ""}`}>{s.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ZONA COBERTURA ===== */}
      <section id="cobertura" className="py-24 sm:py-28 bg-brand-black">
        <div className="max-w-container mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <Reveal>
              <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">Cobertura geográfica</p>
              <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl uppercase text-brand-cream mb-6">
                Madrid y <span className="text-gold">toda España</span>
              </h2>
              <p className="text-brand-cream/55 leading-relaxed mb-8 max-w-md">
                Base principal en <strong className="text-gold">Madrid</strong>, con cobertura prioritaria en toda la Comunidad de Madrid y servicio coordinado en el resto del territorio nacional.
              </p>

              <div className="flex flex-wrap gap-2">
                {ZONAS.map((z) => (
                  <span
                    key={z}
                    className="bg-brand-brown border border-gold/15 text-brand-cream/60 text-xs rounded-full px-3.5 py-1.5 hover:border-gold/50 hover:text-gold transition-colors"
                  >
                    {z}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="bg-brand-brown border border-gold/15 rounded-2xl p-7 sm:p-8 space-y-6">
                {[
                  { Icon: IconPin, title: "Madrid Capital", time: "15–25 minutos" },
                  { Icon: IconRoute, title: "Comunidad de Madrid", time: "25–45 minutos" },
                  { Icon: IconShield, title: "Resto de España", time: "Servicio coordinado" },
                ].map((z) => (
                  <div key={z.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold flex-shrink-0">
                      <z.Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="font-condensed font-bold text-lg text-gold-light uppercase">{z.title}</h3>
                      <p className="text-sm text-brand-cream/45">{z.time}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gold/15 pt-6">
                  <a
                    href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola, necesito saber si cubrís mi zona")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#1fb958] text-white font-semibold rounded-xl transition-colors"
                  >
                    <IconWhatsApp className="w-4 h-4" /> Consultar cobertura en mi zona
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== POR QUÉ LUAIDESA ===== */}
      <section className="py-24 sm:py-28 bg-brand-brown">
        <div className="max-w-container mx-auto px-5">
          <Reveal>
            <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3 text-center">Nuestra diferencia</p>
            <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl uppercase text-brand-cream mb-16 text-center">
              Por qué elegirnos
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { Icon: IconShield, title: "Seguridad garantizada", desc: "Protocolos rigurosos en cada operación. Tu vehículo llega sin un solo daño adicional." },
              { Icon: IconBolt, title: "Respuesta inmediata", desc: "Atendemos tu llamada al momento. Sin centralitas, sin esperas. Persona real, respuesta real." },
              { Icon: IconTag, title: "Precio cerrado", desc: "Te decimos el precio antes de ir. Sin sorpresas al llegar, sin costes ocultos al finalizar." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="h-full bg-brand-black border border-gold/15 rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold mb-6">
                    <item.Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-condensed font-black text-2xl text-gold-light uppercase mb-3">{item.title}</h3>
                  <p className="text-brand-cream/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESO ===== */}
      <section id="proceso" className="py-24 sm:py-28 bg-brand-black">
        <div className="max-w-container mx-auto px-5">
          <Reveal>
            <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">Cómo trabajamos</p>
            <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl uppercase text-brand-cream mb-16">
              Tres pasos, <span className="text-gold">sin complicaciones</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {PROCESO.map((p, i) => (
              <Reveal key={p.n} delay={i * 100} className="relative">
                <span className="font-mono text-sm text-gold-dark tracking-widest">{p.n}</span>
                <h3 className="font-condensed font-black text-2xl text-brand-cream uppercase mt-3 mb-3">{p.title}</h3>
                <p className="text-brand-cream/50 text-sm leading-relaxed">{p.desc}</p>
                {i < PROCESO.length - 1 && (
                  <div className="hidden md:block absolute top-2 right-[-24px] w-12 h-px bg-gold/20" />
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FORMULARIO DE CONTACTO ===== */}
      <section id="contacto" className="py-24 sm:py-28 bg-brand-brown">
        <div className="max-w-container mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <Reveal>
              <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">Contacto</p>
              <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl uppercase text-brand-cream mb-6">
                Solicita tu <span className="text-gold">servicio</span>
              </h2>
              <p className="text-brand-cream/55 leading-relaxed mb-8 max-w-md">
                Rellena el formulario y te llamamos en minutos. Si es urgente, usa el botón de llamada directa.
              </p>

              <div className="space-y-3.5 max-w-md">
                <a
                  href={`tel:${PHONE_HREF}`}
                  className="flex items-center gap-4 bg-brand-black border border-gold/20 hover:border-gold rounded-xl px-5 py-4 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center text-gold shrink-0">
                    <IconPhone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-brand-cream/35 uppercase tracking-wider">Llamada directa · 24h</p>
                    <p className="text-gold-light font-semibold">{PHONE}</p>
                  </div>
                </a>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola, quiero solicitar un servicio de grúa")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-green-900/20 border border-green-700/30 hover:border-green-500 rounded-xl px-5 py-4 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-700/20 rounded-lg flex items-center justify-center text-green-400 shrink-0">
                    <IconWhatsApp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-brand-cream/35 uppercase tracking-wider">WhatsApp</p>
                    <p className="text-green-400 font-semibold">Escríbenos ahora</p>
                  </div>
                </a>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="bg-brand-black border border-gold/15 rounded-2xl p-6 md:p-8">
                <h3 className="font-condensed font-bold text-xl text-gold-light uppercase mb-6">
                  Formulario de contacto
                </h3>
                <LeadForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== FAQ SEO ===== */}
      <section className="py-24 sm:py-28 bg-brand-black">
        <div className="max-w-3xl mx-auto px-5">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">Preguntas frecuentes</p>
              <h2 className="font-condensed font-black text-4xl sm:text-5xl uppercase text-brand-cream">
                Resolvemos tus <span className="text-gold">dudas</span>
              </h2>
            </div>
          </Reveal>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={Math.min(i * 40, 200)}>
                <details className="group bg-brand-brown/50 border border-gold/15 hover:border-gold/35 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer text-brand-cream font-semibold list-none text-[15px]">
                    <span>{item.q}</span>
                    <IconChevronDown className="w-4 h-4 text-gold shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-5 text-brand-cream/55 text-sm leading-relaxed border-t border-gold/10 pt-4">
                    {item.a}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STICKY CTA MÓVIL ===== */}
      <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-brand-black/95 backdrop-blur border-t border-gold/20 p-3 flex gap-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <a
          href={`tel:${PHONE_HREF}`}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gold text-brand-black font-condensed font-black text-base uppercase rounded-xl"
        >
          <IconPhone className="w-4 h-4" /> Llamar
        </a>
        <a
          href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola, necesito una grúa urgente")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white font-condensed font-black text-base uppercase rounded-xl"
        >
          <IconWhatsApp className="w-4 h-4" /> WhatsApp
        </a>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="bg-brand-black border-t border-gold/15 py-14 pb-28 md:pb-14">
        <div className="max-w-container mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <p className="font-condensed font-black text-2xl text-gold-light uppercase tracking-wider mb-3">Grúas Luaidesa</p>
              <p className="text-brand-cream/40 text-sm leading-relaxed max-w-xs">
                Servicio de grúa y rescate vehicular en Madrid y toda España. Seguridad, rapidez y factura legal en cada servicio.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-dark mb-4">Legal</p>
              <ul className="space-y-2">
                <li><Link href="/politica-privacidad" className="text-brand-cream/40 hover:text-gold text-sm transition-colors">Política de Privacidad</Link></li>
                <li><Link href="/condiciones-uso" className="text-brand-cream/40 hover:text-gold text-sm transition-colors">Condiciones de Uso</Link></li>
                <li><Link href="/proteccion-datos" className="text-brand-cream/40 hover:text-gold text-sm transition-colors">Protección de Datos (RGPD)</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold-dark mb-4">Contacto urgente</p>
              <a href={`tel:${PHONE_HREF}`} className="block text-gold-light font-semibold mb-1 hover:text-gold transition-colors">{PHONE}</a>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer" className="block text-green-400 text-sm hover:text-green-300 transition-colors mb-3">WhatsApp directo →</a>
              <p className="text-xs text-brand-cream/30">Disponible 24h · 7 días · Madrid y España</p>
            </div>
          </div>
          <div className="border-t border-gold/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-brand-cream/30">© {new Date().getFullYear()} Grúas Luaidesa. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
