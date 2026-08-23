"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { UtensilsCrossed, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error("Correo o contraseña incorrectos");
        setLoading(false);
        return;
      }
      toast.success("Bienvenido");
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message ?? "No se pudo conectar con Supabase");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 flex flex-col gap-4"
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center">
            <UtensilsCrossed size={22} />
          </div>
          <h1 className="font-semibold text-lg">Iniciar sesión</h1>
        </div>

        <input
          type="email"
          required
          autoFocus
          id="email"
          aria-label="Correo electrónico"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />
        <input
          type="password"
          required
          id="password"
          aria-label="Contraseña"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-black text-white rounded-xl py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Entrar
        </button>
      </form>
    </main>
  );
}
