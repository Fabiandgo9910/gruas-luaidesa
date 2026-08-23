// ============================================================
// Middleware — Protege el panel de administración
// ============================================================
// Cualquier ruta bajo /panel-control (salvo login/recuperar/
// actualizar-password) requiere una sesión válida de Supabase Auth.
// Sin sesión → redirige a /panel-control/login.

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const RUTAS_PUBLICAS_ADMIN = [
  "/panel-control/login",
  "/panel-control/recuperar",
  "/panel-control/actualizar-password",
];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  if (!req.nextUrl.pathname.startsWith("/panel-control")) {
    return res;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Si Supabase Auth no está configurado, no bloqueamos con un error
  // críptico: redirigimos a login, que mostrará el mensaje claro.
  if (!url || !anonKey) {
    if (RUTAS_PUBLICAS_ADMIN.includes(req.nextUrl.pathname)) return res;
    return NextResponse.redirect(new URL("/panel-control/login", req.url));
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        res.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        res.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const esRutaPublica = RUTAS_PUBLICAS_ADMIN.includes(req.nextUrl.pathname);

  if (!user && !esRutaPublica) {
    const loginUrl = new URL("/panel-control/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (user && esRutaPublica && req.nextUrl.pathname === "/panel-control/login") {
    return NextResponse.redirect(new URL("/panel-control", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/panel-control/:path*"],
};
