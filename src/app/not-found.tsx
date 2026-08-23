import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-neutral-500 max-w-sm">
        No encontramos este restaurante o esta página. Comprueba la URL o vuelve al inicio.
      </p>
      <Link href="/" className="px-5 py-2.5 rounded-full bg-black text-white text-sm">
        Volver al inicio
      </Link>
    </main>
  );
}
