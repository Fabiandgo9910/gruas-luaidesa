import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ConfigRequeridaPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-neutral-50">
      <div className="max-w-lg bg-white border border-amber-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} />
        </div>
        <h1 className="text-xl font-semibold mb-2">Falta configurar Supabase</h1>
        <p className="text-sm text-neutral-500 mb-4">
          Esta sección necesita conectarse a tu proyecto de Supabase y todavía no
          detecto las variables de entorno, o no responden correctamente.
        </p>

        <ol className="text-left text-sm text-neutral-600 flex flex-col gap-2 bg-neutral-50 rounded-xl p-4 mb-5">
          <li>1. Copia <code className="bg-neutral-200 px-1 rounded">.env.example</code> como <code className="bg-neutral-200 px-1 rounded">.env.local</code></li>
          <li>2. Rellena <code className="bg-neutral-200 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>, <code className="bg-neutral-200 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> y <code className="bg-neutral-200 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> con los datos de Settings → API en tu proyecto Supabase</li>
          <li>3. Ejecuta el archivo <code className="bg-neutral-200 px-1 rounded">supabase/schema.sql</code> en el SQL Editor de Supabase</li>
          <li>4. Reinicia el servidor (<code className="bg-neutral-200 px-1 rounded">npm run dev</code>)</li>
        </ol>

        <Link href="/" className="text-sm underline text-neutral-500">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
