"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteRestaurant } from "@/app/admin/actions";
import { Trash2 } from "lucide-react";

export default function DeleteRestaurantButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 4000);
      return;
    }
    startTransition(async () => {
      try {
        await deleteRestaurant(id);
        toast.success(`${name} eliminado`);
        router.push("/admin");
      } catch (e: any) {
        toast.error(e.message ?? "Error");
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs ${
        confirming ? "bg-red-500 text-white" : "text-neutral-400 border border-neutral-200"
      }`}
    >
      <Trash2 size={14} /> {confirming ? "¿Seguro? Click de nuevo" : "Eliminar restaurante"}
    </button>
  );
}
