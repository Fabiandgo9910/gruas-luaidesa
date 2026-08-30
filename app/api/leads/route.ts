import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/lib/supabase";
import { enviarNotificacionLead } from "@/lib/email";
import { rateLimit, obtenerIp } from "@/lib/rate-limit";

// ============================================================
// API Route: POST /api/leads
// Recibe solicitudes del formulario web y las guarda en Supabase.
// ============================================================

// Regex simples pero suficientes para validar formato en servidor
// (la validación "bonita" ya ocurre en el cliente; esta es la que
// realmente protege los datos).
const PHONE_REGEX = /^[+]?[\d\s()-]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LONGITUD_MAXIMA = { ciudad: 100, servicio: 100, mensaje: 1000 };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nombre,
      telefono,
      email,
      ciudad,
      servicio,
      mensaje,
      source,
      referrer,
      // Campo honeypot: invisible para humanos, atractivo para bots.
      // Si viene relleno, es spam casi con toda seguridad.
      website,
      // Marca de tiempo de cuándo se mostró el formulario (la manda
      // el cliente). Un envío en menos de 2 segundos es casi siempre
      // un bot rellenando el formulario de forma instantánea.
      formularioMostradoEn,
    } = body;

    const ip = obtenerIp(req);

    // --- Honeypot: responde 200 "falso" para no darle pistas al bot ---
    if (website) {
      return NextResponse.json({ success: true });
    }

    // --- Envío sospechosamente rápido (bot) ---
    if (typeof formularioMostradoEn === "number" && Date.now() - formularioMostradoEn < 2000) {
      return NextResponse.json({ success: true });
    }

    // --- Rate limiting básico por IP: máx. 5 envíos por minuto ---
    if (ip !== "desconocida" && !rateLimit(`lead:${ip}`, 5, 60_000)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Inténtalo de nuevo en un minuto." },
        { status: 429 }
      );
    }

    // --- Validación de campos obligatorios ---
    if (!nombre?.trim() || !telefono?.trim() || !ciudad?.trim() || !servicio?.trim()) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (nombre, teléfono, ciudad, servicio)." },
        { status: 400 }
      );
    }

    if (nombre.trim().length < 2 || nombre.trim().length > 100) {
      return NextResponse.json({ error: "Nombre no válido." }, { status: 400 });
    }

    if (!PHONE_REGEX.test(telefono.trim())) {
      return NextResponse.json({ error: "Teléfono no válido." }, { status: 400 });
    }

    if (email && !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Email no válido." }, { status: 400 });
    }

    if (ciudad.trim().length > LONGITUD_MAXIMA.ciudad || servicio.trim().length > LONGITUD_MAXIMA.servicio) {
      return NextResponse.json({ error: "Uno de los campos es demasiado largo." }, { status: 400 });
    }

    if (mensaje && mensaje.length > LONGITUD_MAXIMA.mensaje) {
      return NextResponse.json({ error: "El mensaje es demasiado largo (máximo 1000 caracteres)." }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || "";

    const lead = await saveLead({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: email?.trim(),
      ciudad: ciudad.trim(),
      servicio: servicio.trim(),
      mensaje: mensaje?.trim(),
      origen: "formulario_web",
      source_url: source,
      referrer: referrer || "directo",
      user_agent: userAgent.substring(0, 300),
      ip,
    });

    // El email es informativo (best effort): si falla, no debe impedir
    // que la solicitud se considere guardada — lo importante ya está
    // en la base de datos. Se espera aquí (en vez de "fire and forget")
    // porque en Vercel la función puede detenerse justo después de
    // responder, y así nos aseguramos de que el envío se intente.
    await enviarNotificacionLead({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      email: email?.trim(),
      ciudad: ciudad.trim(),
      servicio: servicio.trim(),
      mensaje: mensaje?.trim(),
    });

    return NextResponse.json({ success: true, id: lead?.id });
  } catch (error) {
    console.error("[API /leads] Error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor. Por favor, llámanos directamente." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Método no permitido" }, { status: 405 });
}
