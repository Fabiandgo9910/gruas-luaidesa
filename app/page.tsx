import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  { n: "01", title: "Nos cuentas qué pasa", desc: "Llamas, escribes por WhatsApp o rellenas el formulario. Una persona real te atiende, sin centralitas ni esperas." },
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
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />

      {/* ===== HERO — sand-100 (claro) ===== */}
      <section className="relative overflow-hidden bg-sand-100 bg-grain pt-36 pb-24 sm:pt-40 sm:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_8%,rgba(201,162,39,0.20)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgba(201,162,39,0.10)_0%,transparent_45%)]" />

        <div className="relative z-10 max-w-container mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            {/* Columna texto */}
            <div>
              <div className="inline-flex items-center gap-2 mb-7">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-gold animate-ping-slow" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-dark" />
                </span>
                <span className="text-[11px] font-semibold text-gold-dark uppercase tracking-[0.2em]">Operativos ahora · 24h</span>
              </div>

              <h1 className="font-condensed font-black text-5xl sm:text-6xl md:text-7xl leading-[0.98] uppercase text-ink-900 mb-6">
                Grúa en
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">Madrid</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 200 24"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 w-full h-4 text-gold-light/70 -z-0"
                  >
                    <path d="M2 18 C 40 6, 90 22, 130 10 S 180 4, 198 14" stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
                <br />
                <span className="text-gold">y toda España</span>
              </h1>

              <p className="max-w-lg text-base md:text-lg text-ink-700/60 mb-10 leading-relaxed">
                Rescate vehicular con respuesta rápida, precio cerrado y factura legal
                para particulares y empresas.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 mb-12">
                <a
                  href={`tel:${PHONE_HREF}`}
                  className="flex items-center justify-center gap-3 bg-ink-900 hover:bg-ink-700 text-sand-100 font-condensed font-black text-lg uppercase tracking-wide rounded-full px-8 py-4 transition-all hover:-translate-y-0.5 shadow-gold"
                >
                  <IconPhone className="w-5 h-5" /> Llamar ahora
                </a>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola, necesito una grúa urgente en Madrid")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 border-2 border-ink-900/15 hover:border-ink-900/40 text-ink-900 font-condensed font-black text-lg uppercase tracking-wide rounded-full px-8 py-4 transition-all"
                >
                  <IconWhatsApp className="w-5 h-5 text-whatsapp" /> WhatsApp
                </a>
              </div>

              {/* Confianza — una sola línea, sin cajas */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-ink-700/50 text-xs font-medium">
                <span className="flex items-center gap-1.5"><IconInvoice className="w-4 h-4 text-gold" /> Factura legal</span>
                <span className="flex items-center gap-1.5"><IconTag className="w-4 h-4 text-gold" /> Precio cerrado</span>
                <span className="flex items-center gap-1.5"><IconClock className="w-4 h-4 text-gold" /> 20–30 min de media</span>
              </div>
            </div>

            {/* Columna ilustrativa — ruta + tarjeta flotante (solo escritorio) */}
            <div className="relative hidden lg:block h-[420px]">
              <svg
                aria-hidden="true"
                viewBox="0 0 420 420"
                className="absolute inset-0 w-full h-full"
                fill="none"
              >
                <path
                  d="M50 370 C 130 370, 90 250, 190 225 S 330 130, 370 55"
                  stroke="#C9A227"
                  strokeOpacity="0.4"
                  strokeWidth="2.5"
                  strokeDasharray="1 12"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="370" r="5" fill="#C9A227" fillOpacity="0.55" />
              </svg>

              {/* Grúa sobre la ruta */}
              <div className="absolute left-[34%] top-[52%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg]">
                <div className="w-16 h-16 rounded-2xl bg-ink-900 flex items-center justify-center text-gold-light shadow-panel">
                  <IconTruck className="w-8 h-8" />
                </div>
              </div>

              {/* Pin de destino */}
              <div className="absolute right-[10%] top-[10%] rotate-[6deg]">
                <div className="w-11 h-11 rounded-full bg-gold flex items-center justify-center text-ink-900 shadow-gold">
                  <IconPin className="w-5 h-5" />
                </div>
              </div>

              {/* Tarjeta flotante */}
              <div className="absolute left-[6%] bottom-[6%] bg-sand-200/95 backdrop-blur border border-gold/25 rounded-2xl shadow-panel px-6 py-5 rotate-[-3deg]">
                <p className="font-mono text-[10px] text-gold-dark uppercase tracking-[0.2em] mb-1">Tiempo medio</p>
                <p className="font-condensed font-black text-4xl text-ink-900 leading-none">
                  20–30<span className="text-base align-top ml-1 text-ink-700/40">min</span>
                </p>
                <p className="text-[11px] text-ink-700/40 mt-1.5">Madrid capital</p>
              </div>
            </div>
          </div>
        </div>

        <a href="#servicios" aria-label="Ir a servicios" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-ink-900/25 hover:text-gold transition-colors">
          <IconChevronDown className="w-6 h-6 animate-bounce" />
        </a>
      </section>

      {/* ===== SERVICIOS — ink-900 (oscuro, el más profundo) ===== */}
      <section id="servicios" className="py-24 sm:py-28 bg-ink-900">
        <div className="max-w-container mx-auto px-5">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">Lo que hacemos</p>
              <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl uppercase text-sand-100">
                Nuestros <span className="text-gold">servicios</span>
              </h2>
              <p className="mt-4 text-sand-100/50">
                Desde una avería simple hasta el rescate en autopista — cubrimos cualquier situación, en cualquier punto de España.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SERVICIOS.map((s, i) => (
              <Reveal key={s.title} delay={i * 80} className={s.big ? "md:col-span-2" : ""}>
                <article
                  className={`h-full bg-ink-800 border border-sand-100/10 hover:border-gold/40 rounded-2xl p-7 sm:p-8 transition-all hover:-translate-y-1 group ${s.big ? "sm:flex sm:items-center sm:gap-8" : ""}`}
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
                  <p className={`text-sand-100/50 text-sm leading-relaxed ${s.big ? "sm:w-2/3" : ""}`}>{s.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BATERÍAS — sand-100 (claro, sección de negocio propia) ===== */}
      <section id="baterias" className="py-24 sm:py-28 bg-sand-100">
        <div className="max-w-container mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <Reveal>
              <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">También hacemos esto</p>
              <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl uppercase text-ink-900 mb-6">
                Baterías de coche, <span className="text-gold">instaladas a domicilio</span>
              </h2>
              <p className="text-ink-700/60 leading-relaxed mb-8 max-w-md">
                Vendemos e instalamos baterías de coche de todas las marcas y amperajes —incluidas las de
                sistema <strong className="text-gold-dark">Start-Stop</strong>— donde tú estés, en Madrid y
                alrededores. Sin necesidad de ir a ningún taller.
              </p>
              <div className="flex flex-col sm:flex-row gap-3.5">
                <Link
                  href="/baterias-coche-madrid"
                  className="flex items-center justify-center gap-3 bg-ink-900 hover:bg-ink-700 text-sand-100 font-condensed font-black text-base uppercase tracking-wide rounded-full px-7 py-3.5 transition-all hover:-translate-y-0.5 shadow-gold"
                >
                  Ver catálogo de baterías
                </Link>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola, quiero saber qué batería lleva mi coche")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 border-2 border-ink-900/15 hover:border-ink-900/40 text-ink-900 font-condensed font-black text-base uppercase tracking-wide rounded-full px-7 py-3.5 transition-all"
                >
                  <IconWhatsApp className="w-4 h-4 text-whatsapp" /> Consultar por WhatsApp
                </a>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { Icon: IconBolt, title: "Con o sin Start-Stop", desc: "Compatibles con cualquier sistema de tu vehículo." },
                  { Icon: IconClock, title: "Instalación en el momento", desc: "Te la cambiamos in situ, sin dejar el coche en ningún sitio." },
                  { Icon: IconTag, title: "Precio por WhatsApp", desc: "Consulta el precio exacto de cada modelo al instante." },
                  { Icon: IconShield, title: "Todas las marcas", desc: "Amplio catálogo filtrable por marca y amperaje." },
                ].map((f) => (
                  <div key={f.title} className="bg-sand-200 border border-ink-900/10 rounded-2xl p-5">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold-dark mb-3">
                      <f.Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-condensed font-bold text-sm text-ink-900 uppercase mb-1">{f.title}</h3>
                    <p className="text-xs text-ink-700/50 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== ZONA COBERTURA — sand-200 (claro, distinto del hero) ===== */}
      <section id="cobertura" className="py-24 sm:py-28 bg-sand-200">
        <div className="max-w-container mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <Reveal>
              <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">Cobertura geográfica</p>
              <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl uppercase text-ink-900 mb-6">
                Madrid y <span className="text-gold">toda España</span>
              </h2>
              <p className="text-ink-700/60 leading-relaxed mb-8 max-w-md">
                Base principal en <strong className="text-gold-dark">Madrid</strong>, con cobertura prioritaria en toda la Comunidad de Madrid y servicio coordinado en el resto del territorio nacional.
              </p>

              <div className="flex flex-wrap gap-2">
                {ZONAS.map((z) => (
                  <span
                    key={z}
                    className="bg-sand-100 border border-ink-900/10 text-ink-700/65 text-xs rounded-full px-3.5 py-1.5 hover:border-gold/50 hover:text-gold-dark transition-colors"
                  >
                    {z}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="bg-sand-100 border border-ink-900/10 rounded-2xl p-7 sm:p-8 space-y-6">
                {[
                  { Icon: IconPin, title: "Madrid Capital", time: "15–25 minutos" },
                  { Icon: IconRoute, title: "Comunidad de Madrid", time: "25–45 minutos" },
                  { Icon: IconShield, title: "Resto de España", time: "Servicio coordinado" },
                ].map((z) => (
                  <div key={z.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold-dark flex-shrink-0">
                      <z.Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h3 className="font-condensed font-bold text-lg text-ink-900 uppercase">{z.title}</h3>
                      <p className="text-sm text-ink-700/50">{z.time}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t border-ink-900/10 pt-6">
                  <a
                    href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola, necesito saber si cubrís mi zona")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-ink-900 hover:bg-ink-700 text-sand-100 font-semibold rounded-xl transition-colors"
                  >
                    <IconWhatsApp className="w-4 h-4 text-whatsapp" /> Consultar cobertura en mi zona
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== POR QUÉ LUAIDESA — ink-800 (oscuro, matiz distinto) ===== */}
      <section className="py-24 sm:py-28 bg-ink-800">
        <div className="max-w-container mx-auto px-5">
          <Reveal>
            <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3 text-center">Nuestra diferencia</p>
            <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl uppercase text-sand-100 mb-16 text-center">
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
                <div className="h-full bg-ink-900 border border-sand-100/10 rounded-2xl p-8">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/25 flex items-center justify-center text-gold mb-6">
                    <item.Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-condensed font-black text-2xl text-gold-light uppercase mb-3">{item.title}</h3>
                  <p className="text-sand-100/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESO — sand-100 (claro) ===== */}
      <section id="proceso" className="py-24 sm:py-28 bg-sand-100">
        <div className="max-w-container mx-auto px-5">
          <Reveal>
            <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">Cómo trabajamos</p>
            <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl uppercase text-ink-900 mb-16">
              Tres pasos, <span className="text-gold">sin complicaciones</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {PROCESO.map((p, i) => (
              <Reveal key={p.n} delay={i * 100} className="relative">
                <span className="font-mono text-sm text-gold-dark tracking-widest">{p.n}</span>
                <h3 className="font-condensed font-black text-2xl text-ink-900 uppercase mt-3 mb-3">{p.title}</h3>
                <p className="text-ink-700/55 text-sm leading-relaxed">{p.desc}</p>
                {i < PROCESO.length - 1 && (
                  <div className="hidden md:block absolute top-2 right-[-24px] w-12 h-px bg-gold/30" />
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FORMULARIO DE CONTACTO — ink-900 (oscuro) ===== */}
      <section id="contacto" className="py-24 sm:py-28 bg-ink-900">
        <div className="max-w-container mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <Reveal>
              <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">Contacto</p>
              <h2 className="font-condensed font-black text-4xl sm:text-5xl md:text-6xl uppercase text-sand-100 mb-6">
                Solicita tu <span className="text-gold">servicio</span>
              </h2>
              <p className="text-sand-100/55 leading-relaxed mb-8 max-w-md">
                Rellena el formulario y te llamamos en minutos. Si es urgente, usa el botón de llamada directa.
              </p>

              <div className="space-y-3.5 max-w-md">
                <a
                  href={`tel:${PHONE_HREF}`}
                  className="flex items-center gap-4 bg-ink-800 border border-gold/20 hover:border-gold rounded-xl px-5 py-4 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center text-gold shrink-0">
                    <IconPhone className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-sand-100/35 uppercase tracking-wider">Llamada directa · 24h</p>
                    <p className="text-gold-light font-semibold">{PHONE}</p>
                  </div>
                </a>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola, quiero solicitar un servicio de grúa")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-ink-800 border border-sand-100/10 hover:border-whatsapp/50 rounded-xl px-5 py-4 transition-colors"
                >
                  <div className="w-10 h-10 bg-whatsapp/15 rounded-lg flex items-center justify-center text-whatsapp shrink-0">
                    <IconWhatsApp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-[11px] text-sand-100/35 uppercase tracking-wider">WhatsApp</p>
                    <p className="text-sand-100 font-semibold">Escríbenos ahora</p>
                  </div>
                </a>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="bg-ink-800 border border-sand-100/10 rounded-2xl p-6 md:p-8">
                <h3 className="font-condensed font-bold text-xl text-gold-light uppercase mb-6">
                  Formulario de contacto
                </h3>
                <LeadForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== FAQ SEO — sand-200 (claro) ===== */}
      <section className="py-24 sm:py-28 bg-sand-200">
        <div className="max-w-3xl mx-auto px-5">
          <Reveal>
            <div className="text-center mb-14">
              <p className="text-gold-dark text-xs font-bold uppercase tracking-[4px] mb-3">Preguntas frecuentes</p>
              <h2 className="font-condensed font-black text-4xl sm:text-5xl uppercase text-ink-900">
                Resolvemos tus <span className="text-gold">dudas</span>
              </h2>
            </div>
          </Reveal>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={Math.min(i * 40, 200)}>
                <details className="group bg-sand-100 border border-ink-900/10 hover:border-gold/40 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer text-ink-900 font-semibold list-none text-[15px]">
                    <span>{item.q}</span>
                    <IconChevronDown className="w-4 h-4 text-gold-dark shrink-0 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-5 text-ink-700/65 text-sm leading-relaxed border-t border-ink-900/10 pt-4">
                    {item.a}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STICKY CTA MÓVIL ===== */}
      <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-ink-900/95 backdrop-blur border-t border-gold/20 p-3 flex gap-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <a
          href={`tel:${PHONE_HREF}`}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gold text-ink-900 font-condensed font-black text-base uppercase rounded-xl"
        >
          <IconPhone className="w-4 h-4" /> Llamar
        </a>
        <a
          href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola, necesito una grúa urgente")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-sand-100 text-ink-900 font-condensed font-black text-base uppercase rounded-xl"
        >
          <IconWhatsApp className="w-4 h-4 text-whatsapp" /> WhatsApp
        </a>
      </div>

      <Footer />
    </main>
  );
}
