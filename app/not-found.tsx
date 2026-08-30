import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IconTruck, IconWhatsApp, IconPhone } from "@/components/icons";

const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "34674088195";
const PHONE = process.env.NEXT_PUBLIC_PHONE_NUMBER || "+34 674 08 81 95";
const PHONE_HREF = PHONE.replace(/\s/g, "");

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <section className="min-h-[80vh] flex items-center pt-24 pb-16 bg-sand-100">
        <div className="max-w-container mx-auto px-5 text-center">
          <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center text-gold-dark mx-auto mb-8">
            <IconTruck className="w-9 h-9" />
          </div>
          <p className="font-condensed text-8xl sm:text-9xl font-black text-ink-900/10 leading-none mb-2">404</p>
          <h1 className="font-condensed font-black text-3xl sm:text-4xl uppercase text-ink-900 mb-4">
            Esta página se ha quedado tirada
          </h1>
          <p className="text-ink-700/60 max-w-md mx-auto mb-10">
            No hemos encontrado lo que buscabas. Puede que el enlace esté mal escrito o que la página se haya movido.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
            <Link
              href="/"
              className="px-7 py-3.5 bg-ink-900 hover:bg-ink-700 text-sand-100 font-condensed font-black uppercase tracking-wide rounded-full transition-all hover:-translate-y-0.5"
            >
              Volver al inicio
            </Link>
            <Link
              href="/baterias-coche-madrid"
              className="px-7 py-3.5 border-2 border-ink-900/15 hover:border-ink-900/40 text-ink-900 font-condensed font-black uppercase tracking-wide rounded-full transition-all"
            >
              Ver baterías de coche
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
            <a href={`tel:${PHONE_HREF}`} className="flex items-center gap-2 text-ink-900/70 hover:text-gold-dark transition-colors">
              <IconPhone className="w-4 h-4" /> {PHONE}
            </a>
            <a
              href={`https://wa.me/${WA}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-whatsapp hover:text-whatsapp/80 transition-colors"
            >
              <IconWhatsApp className="w-4 h-4" /> Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
