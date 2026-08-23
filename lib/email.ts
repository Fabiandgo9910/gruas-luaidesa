// ============================================================
// Envío de email de notificación (nuevo lead del formulario)
// ============================================================
// Usa la API HTTP de Resend (https://resend.com) con un simple
// fetch — no hace falta instalar ningún paquete nuevo.
// Es "best effort": si falla el envío del email, NUNCA debe romper
// el guardado del lead en la base de datos (eso es lo crítico).
// ============================================================

import type { LeadInsert } from "@/lib/supabase";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;
// Remitente por defecto: el dominio de pruebas de Resend, que
// funciona sin verificar ningún dominio propio. Para producción
// puedes verificar tu propio dominio en Resend y cambiar esta env var.
const EMAIL_FROM = process.env.EMAIL_FROM || "Grúas Luaidesa <onboarding@resend.dev>";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Envía un email a NOTIFICATION_EMAIL avisando de un nuevo lead.
 * No lanza si falla (solo hace console.warn) para no romper el
 * guardado en base de datos, que es lo importante.
 */
export async function enviarNotificacionLead(lead: LeadInsert) {
  if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
    console.warn(
      "[email] RESEND_API_KEY o NOTIFICATION_EMAIL no configurados: no se envía email de aviso (el lead sí se ha guardado en la base de datos)."
    );
    return;
  }

  const filas = [
    ["Nombre", lead.nombre],
    ["Teléfono", lead.telefono],
    ["Email", lead.email || "—"],
    ["Ciudad", lead.ciudad],
    ["Servicio", lead.servicio],
    ["Mensaje", lead.mensaje || "—"],
  ];

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#1A1208;">Nueva solicitud de grúa</h2>
      <table style="width:100%; border-collapse: collapse;">
        ${filas
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 0; color:#8a7a55; font-size:12px; text-transform:uppercase; vertical-align:top; width:110px;">${escapeHtml(
              label
            )}</td>
            <td style="padding:8px 0; color:#1A1208; font-size:14px;">${escapeHtml(String(value))}</td>
          </tr>`
          )
          .join("")}
      </table>
      <p style="margin-top:24px; font-size:12px; color:#999;">
        Este aviso es automático. La solicitud ya está guardada en tu base de datos de Supabase (tabla "leads").
      </p>
    </div>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [NOTIFICATION_EMAIL],
        reply_to: lead.email || undefined,
        subject: `Nueva solicitud de grúa — ${lead.nombre} (${lead.ciudad})`,
        html,
      }),
    });

    if (!res.ok) {
      const detalle = await res.text().catch(() => "");
      console.warn(`[email] Resend respondió ${res.status}: ${detalle}`);
    }
  } catch (error) {
    console.warn("[email] No se pudo enviar el aviso por email:", error);
  }
}
