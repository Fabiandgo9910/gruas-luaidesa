import { NextRequest, NextResponse } from "next/server";
import { saveLead } from "@/lib/supabase";

// ============================================================
// API Route: POST /api/leads
// Recibe solicitudes del formulario web y las guarda en Supabase.
// ============================================================

// Regex simples pero suficientes para validar formato en servidor
// (la validación "bonita" ya ocurre en el cliente; esta es la que
// realmente protege los datos).
const PHONE_REGEX = /^[+]?[\d\s()-]{7,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Límite simple de peticiones por IP en memoria (protección básica
// contra flood; para tráfico alto conviene mover esto a Supabase
// o a un servicio dedicado como Upstash).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

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
    } = body;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "desconocida";

    // --- Honeypot: responde 200 "falso" para no darle pistas al bot ---
    if (website) {
      return NextResponse.json({ success: true });
    }

    // --- Rate limiting básico por IP ---
    if (ip !== "desconocida" && isRateLimited(ip)) {
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
