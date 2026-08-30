"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Barra dorada arriba del todo que se anima brevemente en cada
 * cambio de página, dando sensación de carga incluso cuando la
 * navegación es casi instantánea (mejora percibida de velocidad).
 */
export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((k) => k + 1);
  }, [pathname, searchParams]);

  return <div key={key} className="top-progress-bar" />;
}
