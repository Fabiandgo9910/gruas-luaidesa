import { notFound } from "next/navigation";
import { getBateriaPorId } from "@/lib/supabase";
import BateriaForm from "@/components/admin/BateriaForm";

export const dynamic = "force-dynamic";

export default async function EditarBateriaPage({ params }: { params: { id: string } }) {
  const bateria = await getBateriaPorId(params.id);
  if (!bateria) notFound();

  return (
    <div>
      <h1 className="font-condensed text-3xl font-black text-sand-100 uppercase mb-8">Editar batería</h1>
      <BateriaForm bateria={bateria} />
    </div>
  );
}
