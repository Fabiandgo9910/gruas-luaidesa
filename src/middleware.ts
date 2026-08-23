import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const LOGIN_PATH = "/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedPath = pathname.startsWith("/admin") && pathname !== LOGIN_PATH;

  // Si faltan las variables de entorno de Supabase, no rompemos TODA la web:
  // la página pública sigue funcionando, solo bloqueamos /admin.
  const missingEnv =
    !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (missingEnv) {
    if (isProtectedPath) {
      return NextResponse.redirect(new URL("/config-requerida", request.url));
    }
    return NextResponse.next();
  }

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  try {
    const result = await updateSession(request);
    response = result.response;

    if (!result.user) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
    if (result.role !== "owner" && result.role !== "super_admin") {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
  } catch (err) {
    // Si Supabase no responde (proyecto pausado, red caída, credenciales
    // incorrectas...), no dejamos pasar al panel privado, pero sí explicamos
    // qué pasó en vez de dar un error críptico.
    console.error("[middleware] Error consultando Supabase:", err);
    return NextResponse.redirect(new URL("/config-requerida", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js|workbox-.*).*)",
  ],
};
