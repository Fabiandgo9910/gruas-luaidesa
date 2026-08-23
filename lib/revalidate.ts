import { revalidatePath } from "next/cache";

/**
 * Invalida al instante la caché de Next.js para que un cambio en
 * una batería (crear/editar/publicar/eliminar) se refleje sin
 * demora tanto en el panel de administración como en la tienda
 * pública (incluidas las fichas individuales de producto).
 */
export function revalidarBaterias() {
  revalidatePath("/panel-control/baterias");
  revalidatePath("/panel-control");
  // "layout" invalida también todas las páginas hijas, incluidas
  // las fichas dinámicas /baterias-coche-madrid/[slug]
  revalidatePath("/baterias-coche-madrid", "layout");
}
