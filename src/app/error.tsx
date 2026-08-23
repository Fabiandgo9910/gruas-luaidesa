"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const looksLikeConfigIssue =
    /supabase|env|NEXT_PUBLIC|fetch failed|ENOTFOUND/i.test(error?.message ?? "");

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-neutral-50">
      <div className="max-w-lg bg-white border border-red-100 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} />
        </div>
        <h1 className="text-xl font-semibold mb-2">Algo falló al cargar esta página</h1>

        {looksLikeConfigIssue ? (
          <p className="text-sm text-neutral-500 mb-5">
            Parece un problema de configuración de Supabase (variables de entorno
            faltantes, proyecto pausado, o el archivo{" "}
            <code className="bg-neutral-200 px-1 rounded">supabase/schema.sql</code>{" "}
            aún no se ejecutó). Revisa la sección 2 y 3 del README.
          </p>
        ) : (
          <p className="text-sm text-neutral-500 mb-5 break-words">{error?.message}</p>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="flex items-center gap-1.5 bg-black text-white rounded-xl px-4 py-2.5 text-sm"
          >
            <RefreshCcw size={14} /> Reintentar
          </button>
          <Link href="/" className="text-sm underline text-neutral-500">
            Ir al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
