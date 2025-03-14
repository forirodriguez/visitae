"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Actualizar el estado inicialmente
    setMatches(media.matches);

    // Configurar el listener para los cambios
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Usar addEventListerner moderno si está disponible
    if (media.addEventListener) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } else {
      // Fallback para navegadores antiguos
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query]);

  return matches;
}
