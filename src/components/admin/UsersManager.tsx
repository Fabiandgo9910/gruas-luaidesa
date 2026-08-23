"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createOwnerUser, reassignOwnerRestaurant } from "@/app/admin/actions";
import { UserPlus, Wrench } from "lucide-react";
import type { Profile } from "@/types";

export default function UsersManager({
  restaurantId,
  owners,
}: {
  restaurantId: string;
  owners: Profile[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [fixing, setFixing] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    formData.set("restaurant_id", restaurantId);
    try {
      await createOwnerUser(formData);
      toast.success("Usuario creado y asignado a este restaurante. Ya puede iniciar sesión en /admin/login");
      (document.getElementById("owner-form") as HTMLFormElement)?.reset();
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Error al crear usuario");
    } finally {
      setSaving(false);
    }
  }

  async function handleReassign(formData: FormData) {
    setFixing(true);
    formData.set("restaurant_id", restaurantId);
    try {
      await reassignOwnerRestaurant(formData);
      toast.success("Usuario reasignado a este restaurante");
      (document.getElementById("reassign-form") as HTMLFormElement)?.reset();
      router.refresh();
    } catch (e: any) {
      toast.error(e.message ?? "Error al reasignar");
    } finally {
      setFixing(false);
    }
  }

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold mb-3">Usuarios con acceso a este restaurante</h3>
        <div className="bg-white rounded-2xl border border-neutral-100 divide-y divide-neutral-100">
          {owners.length === 0 && (
            <p className="p-4 text-sm text-neutral-400">Aún no hay admins asignados a este restaurante.</p>
          )}
          {owners.map((o) => (
            <div key={o.id} className="p-4 text-sm flex justify-between">
              <span>{o.full_name || o.email}</span>
              <span className="text-neutral-400">{o.email}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
          <UserPlus size={16} /> Crear nuevo acceso (admin del restaurante)
        </h3>
        <form id="owner-form" action={handleSubmit} className="bg-white rounded-2xl border border-neutral-100 p-4 flex flex-col gap-3">
          <input
            name="full_name"
            placeholder="Nombre completo"
            className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Correo electrónico"
            className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
          />
          <input
            name="password"
            type="text"
            required
            minLength={6}
            placeholder="Contraseña temporal (mín. 6 caracteres)"
            className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
          />
          <button
            disabled={saving}
            className="self-start bg-black text-white rounded-xl px-4 py-2.5 text-sm disabled:opacity-60"
          >
            {saving ? "Creando..." : "Crear acceso"}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-1.5 text-neutral-600">
          <Wrench size={16} /> ¿Un usuario quedó sin restaurante asignado?
        </h3>
        <p className="text-xs text-neutral-500 mb-3">
          Si ya creaste un usuario (aquí o directo en Supabase) y al entrar le
          dice "sin restaurante asignado", ponlo aquí para asignarlo a{" "}
          <strong>este</strong> restaurante.
        </p>
        <form
          id="reassign-form"
          action={handleReassign}
          className="bg-white rounded-2xl border border-neutral-100 p-4 flex flex-col gap-3"
        >
          <input
            name="email"
            type="email"
            required
            placeholder="Correo del usuario a corregir"
            className="border border-neutral-200 rounded-xl px-4 py-2.5 text-sm"
          />
          <button
            disabled={fixing}
            className="self-start bg-neutral-800 text-white rounded-xl px-4 py-2.5 text-sm disabled:opacity-60"
          >
            {fixing ? "Asignando..." : "Asignar a este restaurante"}
          </button>
        </form>
      </div>
    </div>
  );
}
