import Link from "next/link";
import { Store } from "lucide-react";

export default function RestaurantNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6 bg-neutral-50">
      <div className="w-12 h-12 rounded-xl bg-neutral-200 flex items-center justify-center">
        <Store size={22} className="text-neutral-500" />
      </div>
      <h1 className="text-xl font-semibold">No encontramos este restaurante</h1>
      <p className="text-neutral-500 max-w-sm text-sm">
        O no existe todavía, o está desactivado. Si eres el super admin, créalo o
        actívalo desde <code className="bg-neutral-200 px-1.5 py-0.5 rounded">/admin</code>{" "}
        (con tu usuario de super admin).
        Si solo quieres ver un ejemplo, corre <code className="bg-neutral-200 px-1.5 py-0.5 rounded">npm run seed</code>{" "}
        y visita <code className="bg-neutral-200 px-1.5 py-0.5 rounded">/demo</code>.
      </p>
      <Link href="/" className="px-5 py-2.5 rounded-full bg-black text-white text-sm">
        Volver al inicio
      </Link>
    </main>
  );
}
