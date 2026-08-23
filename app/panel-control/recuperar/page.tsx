"use client";
import { useState } from "react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseBrowser();
      const redirectTo = `${window.location.origin}/panel-control/actualizar-password`;
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (authError) throw authError;
      setEnviado(true);
    } catch {
      // Por seguridad no revelamos si el email existe o no.
      setEnviado(true);
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
          <p className="text-sand-100/40 text-xs uppercase tracking-widest mt-1">Recuperar contraseña</p>
        </div>

        {enviado ? (
          <div className="bg-ink-800 border border-gold/20 rounded-2xl p-7 text-center">
            <p className="text-sand-100/70 text-sm leading-relaxed">
              Si el email existe en el sistema, te hemos enviado un enlace para restablecer tu contraseña.
              Revisa tu bandeja de entrada (y la carpeta de spam).
            </p>
            <Link href="/panel-control/login" className="inline-block mt-5 text-gold hover:text-gold-light text-sm font-semibold">
              Volver al login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-ink-800 border border-gold/20 rounded-2xl p-7 space-y-4">
            <p className="text-sand-100/50 text-sm">
              Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>
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

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gold hover:bg-gold-light disabled:opacity-50 text-ink-900 font-condensed font-black uppercase tracking-wider rounded-xl transition-colors"
            >
              {loading ? "Enviando..." : "Enviar enlace"}
            </button>

            <div className="text-center pt-1">
              <Link href="/panel-control/login" className="text-xs text-sand-100/40 hover:text-gold transition-colors">
                Volver al login
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
