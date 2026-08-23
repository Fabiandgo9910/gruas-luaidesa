"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseBrowser();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      router.push("/panel-control");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? "Email o contraseña incorrectos."
          : "No se pudo iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink-900 flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-condensed text-2xl font-black text-sand-100 uppercase tracking-wide">
            Grúas <span className="text-gold">Luaidesa</span>
          </p>
          <p className="text-sand-100/40 text-xs uppercase tracking-widest mt-1">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-ink-800 border border-gold/20 rounded-2xl p-7 space-y-4">
          <div>
            <label htmlFor="email" className="block text-[11px] text-gold-dark font-semibold uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-ink-900/60 border border-gold/20 rounded-xl px-4 py-3 text-sand-100 placeholder-sand-100/25 focus:outline-none focus:border-gold text-sm"
              placeholder="admin@tuempresa.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[11px] text-gold-dark font-semibold uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <input
              id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ink-900/60 border border-gold/20 rounded-xl px-4 py-3 text-sand-100 placeholder-sand-100/25 focus:outline-none focus:border-gold text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gold hover:bg-gold-light disabled:opacity-50 text-ink-900 font-condensed font-black uppercase tracking-wider rounded-xl transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-center pt-1">
            <Link href="/panel-control/recuperar" className="text-xs text-sand-100/40 hover:text-gold transition-colors">
              ¿Has olvidado tu contraseña?
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
