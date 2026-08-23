import { NextRequest, NextResponse } from "next/server";
import { registrarEventoContacto, type TipoEvento } from "@/lib/supabase";

// ============================================================
// POST /api/eventos
// Registra un evento de contacto (clic a llamada, clic a WhatsApp,
// envío de formulario) para poder llevar control real de leads más
// allá de Google Analytics. Se llama en fire-and-forget desde
// lib/analytics.ts, así que responde rápido y nunca rompe la UI
// aunque falle: un error aquí no debe impedir que el usuario llame
// o escriba por WhatsApp.
// ============================================================

const TIPOS_VALIDOS: TipoEvento[] = ["llamada", "whatsapp", "whatsapp_bateria", "formulario"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tipo, origen, pagina, detalle } = body as {
      tipo: TipoEvento;
      origen?: string;
      pagina?: string;
      detalle?: string;
    };

    if (!TIPOS_VALIDOS.includes(tipo)) {
      return NextResponse.json({ error: "Tipo de evento no válido." }, { status: 400 });
    }

    await registrarEventoContacto({
      tipo,
      origen: origen?.substring(0, 100),
      pagina: pagina?.substring(0, 300),
      detalle: detalle?.substring(0, 200),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // No se loguea como error crítico: este endpoint es "best effort".
    console.warn("[API /eventos] No se pudo registrar el evento:", error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
