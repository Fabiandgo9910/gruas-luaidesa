// ============================================================
// Diccionarios de traducción (selector de idioma del lado del
// cliente — NO son rutas /en /pt /it indexables por separado en
// Google; para eso haría falta un proyecto de SEO multiidioma
// aparte, con hreflang y traducción legal revisada). Cubre las
// zonas de mayor visibilidad: menú, portada, CTA final y footer.
// ============================================================

export type Idioma = "es" | "en" | "pt" | "it";

export const IDIOMAS: { code: Idioma; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "pt", label: "PT" },
  { code: "it", label: "IT" },
];

export interface Diccionario {
  nav: { grua: string; baterias: string; cobertura: string; proceso: string; contacto: string; whatsapp: string };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    title3: string;
    subtitle: string;
    ctaCall: string;
    ctaWhatsapp: string;
  };
  ctaFinal: {
    title1: string;
    title2: string;
    subtitle: string;
    whatsapp: string;
  };
  footer: {
    tagline: string;
    linksTitle: string;
    linkGrua: string;
    linkBaterias: string;
    linkPrivacidad: string;
    linkCondiciones: string;
    linkRgpd: string;
    contactTitle: string;
    whatsappDirecto: string;
    disponible: string;
    rights: string;
  };
}

export const DICCIONARIOS: Record<Idioma, Diccionario> = {
  es: {
    nav: { grua: "Grúa", baterias: "Baterías", cobertura: "Cobertura", proceso: "Cómo trabajamos", contacto: "Contacto", whatsapp: "WhatsApp" },
    hero: {
      badge: "Operativos ahora · 24h",
      title1: "Grúa en", title2: "Madrid", title3: "y toda España",
      subtitle: "Rescate vehicular con respuesta rápida, precio cerrado y factura legal para particulares y empresas.",
      ctaCall: "Llamar ahora", ctaWhatsapp: "WhatsApp",
    },
    ctaFinal: {
      title1: "¿Coche parado?", title2: "Estamos a un clic",
      subtitle: "Grúa 24h en Madrid y toda España, o batería nueva instalada en el momento. Sin esperas, sin sorpresas en el precio.",
      whatsapp: "WhatsApp",
    },
    footer: {
      tagline: "Servicio de grúa y rescate vehicular, y venta e instalación de baterías de coche a domicilio, en Madrid y toda España.",
      linksTitle: "Enlaces", linkGrua: "Servicio de grúa", linkBaterias: "Baterías de coche",
      linkPrivacidad: "Política de Privacidad", linkCondiciones: "Condiciones de Uso", linkRgpd: "Protección de Datos (RGPD)",
      contactTitle: "Contacto urgente", whatsappDirecto: "WhatsApp directo",
      disponible: "Disponible 24h · 7 días · Madrid y España",
      rights: "Todos los derechos reservados.",
    },
  },
  en: {
    nav: { grua: "Towing", baterias: "Batteries", cobertura: "Coverage", proceso: "How we work", contacto: "Contact", whatsapp: "WhatsApp" },
    hero: {
      badge: "Operating now · 24h",
      title1: "Towing in", title2: "Madrid", title3: "and all of Spain",
      subtitle: "Vehicle recovery with fast response, fixed pricing and a legal invoice, for individuals and businesses.",
      ctaCall: "Call now", ctaWhatsapp: "WhatsApp",
    },
    ctaFinal: {
      title1: "Car broken down?", title2: "We're one click away",
      subtitle: "24h towing in Madrid and all of Spain, or a new battery installed on the spot. No waiting, no price surprises.",
      whatsapp: "WhatsApp",
    },
    footer: {
      tagline: "Towing and vehicle recovery service, plus car battery sales and home installation, in Madrid and across Spain.",
      linksTitle: "Links", linkGrua: "Towing service", linkBaterias: "Car batteries",
      linkPrivacidad: "Privacy Policy", linkCondiciones: "Terms of Use", linkRgpd: "Data Protection (GDPR)",
      contactTitle: "Urgent contact", whatsappDirecto: "Direct WhatsApp",
      disponible: "Available 24h · 7 days · Madrid and Spain",
      rights: "All rights reserved.",
    },
  },
  pt: {
    nav: { grua: "Reboque", baterias: "Baterias", cobertura: "Cobertura", proceso: "Como trabalhamos", contacto: "Contacto", whatsapp: "WhatsApp" },
    hero: {
      badge: "Operacionais agora · 24h",
      title1: "Reboque em", title2: "Madrid", title3: "e toda a Espanha",
      subtitle: "Socorro veicular com resposta rápida, preço fechado e fatura legal para particulares e empresas.",
      ctaCall: "Ligar agora", ctaWhatsapp: "WhatsApp",
    },
    ctaFinal: {
      title1: "Carro avariado?", title2: "Estamos a um clique",
      subtitle: "Reboque 24h em Madrid e em toda a Espanha, ou bateria nova instalada na hora. Sem esperas, sem surpresas no preço.",
      whatsapp: "WhatsApp",
    },
    footer: {
      tagline: "Serviço de reboque e socorro veicular, e venda e instalação de baterias de carro ao domicílio, em Madrid e em toda a Espanha.",
      linksTitle: "Links", linkGrua: "Serviço de reboque", linkBaterias: "Baterias de carro",
      linkPrivacidad: "Política de Privacidade", linkCondiciones: "Termos de Uso", linkRgpd: "Proteção de Dados (RGPD)",
      contactTitle: "Contacto urgente", whatsappDirecto: "WhatsApp direto",
      disponible: "Disponível 24h · 7 dias · Madrid e Espanha",
      rights: "Todos os direitos reservados.",
    },
  },
  it: {
    nav: { grua: "Carro attrezzi", baterias: "Batterie", cobertura: "Copertura", proceso: "Come lavoriamo", contacto: "Contatto", whatsapp: "WhatsApp" },
    hero: {
      badge: "Operativi ora · 24h",
      title1: "Carro attrezzi a", title2: "Madrid", title3: "e in tutta la Spagna",
      subtitle: "Soccorso stradale con risposta rapida, prezzo fisso e fattura legale per privati e aziende.",
      ctaCall: "Chiama ora", ctaWhatsapp: "WhatsApp",
    },
    ctaFinal: {
      title1: "Auto in panne?", title2: "Siamo a un clic",
      subtitle: "Carro attrezzi 24h a Madrid e in tutta la Spagna, o batteria nuova installata sul momento. Nessuna attesa, nessuna sorpresa sul prezzo.",
      whatsapp: "WhatsApp",
    },
    footer: {
      tagline: "Servizio di carro attrezzi e soccorso stradale, e vendita e installazione di batterie auto a domicilio, a Madrid e in tutta la Spagna.",
      linksTitle: "Link", linkGrua: "Servizio carro attrezzi", linkBaterias: "Batterie auto",
      linkPrivacidad: "Informativa sulla Privacy", linkCondiciones: "Termini di Utilizzo", linkRgpd: "Protezione Dati (RGPD)",
      contactTitle: "Contatto urgente", whatsappDirecto: "WhatsApp diretto",
      disponible: "Disponibili 24h · 7 giorni · Madrid e Spagna",
      rights: "Tutti i diritti riservati.",
    },
  },
};
