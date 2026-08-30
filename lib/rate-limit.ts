// ============================================================
// Limitador de peticiones muy simple, por IP, en memoria.
// ============================================================
// Nota honesta sobre sus límites: en Vercel cada función serverless
// puede ejecutarse en instancias distintas, así que esta memoria NO
// se comparte al 100% entre todas las peticiones a nivel global —
// es una capa básica que frena a un mismo visitante/bot que insiste
// muchas veces seguidas contra la MISMA instancia, no una protección
// anti-DDoS de nivel red (eso ya lo cubre la propia infraestructura
// de Vercel/Cloudflare por delante de tu aplicación). Para un límite
// estricto y 100% fiable en producción de verdad, el paso siguiente
// sería Upstash Redis + @upstash/ratelimit, pero eso ya exige otro
// servicio externo — esto cubre el caso normal sin dependencias nuevas.

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limite: number, ventanaMs: number): boolean {
  const ahora = Date.now();
  const actual = buckets.get(key);

  if (!actual || ahora > actual.resetAt) {
    buckets.set(key, { count: 1, resetAt: ahora + ventanaMs });
    return true;
  }

  if (actual.count >= limite) {
    return false;
  }

  actual.count += 1;
  return true;
}

export function obtenerIp(req: Request): string {
  const headers = req.headers;
  return (
    headers.get("x-real-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "desconocida"
  );
}
