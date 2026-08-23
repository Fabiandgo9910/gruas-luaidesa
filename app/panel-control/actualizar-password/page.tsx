"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function ActualizarPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;
      setOk(true);
      setTimeout(() => router.push("/panel-control/login"), 1800);
    } catch {
      setError(
        "No se pudo actualizar la contraseña. El enlace puede haber caducado: solicita uno nuevo desde 'Recuperar contraseña'."
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
          <p className="text-sand-100/40 text-xs uppercase tracking-widest mt-1">Nueva contraseña</p>
        </div>

        {ok ? (
          <div className="bg-ink-800 border border-gold/20 rounded-2xl p-7 text-center">
            <p className="text-sand-100/70 text-sm">Contraseña actualizada. Redirigiendo al login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-ink-800 border border-gold/20 rounded-2xl p-7 space-y-4">
            <p className="text-sand-100/50 text-sm">
              Este enlace te llegó por email tras solicitar la recuperación. Elige tu nueva contraseña.
            </p>
            <div>
              <label htmlFor="password" className="block text-[11px] text-gold-dark font-semibold uppercase tracking-wider mb-1.5">
                Nueva contraseña
              </label>
              <input
                id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ink-900/60 border border-gold/20 rounded-xl px-4 py-3 text-sand-100 placeholder-sand-100/25 focus:outline-none focus:border-gold text-sm"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div>
              <label htmlFor="confirmar" className="block text-[11px] text-gold-dark font-semibold uppercase tracking-wider mb-1.5">
                Confirmar contraseña
              </label>
              <input
                id="confirmar" type="password" required value={confirmar} onChange={(e) => setConfirmar(e.target.value)}
                className="w-full bg-ink-900/60 border border-gold/20 rounded-xl px-4 py-3 text-sand-100 placeholder-sand-100/25 focus:outline-none focus:border-gold text-sm"
                placeholder="Repite la contraseña"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gold hover:bg-gold-light disabled:opacity-50 text-ink-900 font-condensed font-black uppercase tracking-wider rounded-xl transition-colors"
            >
              {loading ? "Guardando..." : "Guardar contraseña"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
