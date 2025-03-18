// src/lib/api/client/dashboard.ts
import { useQuery } from "@tanstack/react-query";
import { Property } from "@/types/property";
import { Visit } from "@/types/visits";

// Tipos para respuestas específicas
export interface VisitStats {
  byStatus: {
    pendiente: number;
    confirmada: number;
    completada: number;
    cancelada: number;
    total: number;
  };
  byType: {
    presencial: number;
    videollamada: number;
  };
  conversion: {
    ratio: string;
  };
}

// ==== FUNCIONES PARA OBTENER DATOS ====

/**
 * Obtiene estadísticas de visitas para el dashboard
 */
export async function fetchVisitStats(): Promise<VisitStats> {
  const response = await fetch("/api/visits/stats");

  if (!response.ok) {
    throw new Error(
      `Error al obtener estadísticas de visitas: ${response.statusText}`
    );
  }

  const { data } = (await response.json()) as {
    data: VisitStats;
    success: boolean;
  };
  return data;
}

/**
 * Obtiene las próximas visitas programadas
 * @param limit Número máximo de visitas a obtener
 */
export async function fetchUpcomingVisits(limit: number = 3): Promise<Visit[]> {
  const response = await fetch(`/api/visits/upcoming?limit=${limit}`);

  if (!response.ok) {
    throw new Error(
      `Error al obtener próximas visitas: ${response.statusText}`
    );
  }

  const { data } = (await response.json()) as {
    data: Visit[];
    success: boolean;
  };
  return data;
}

/**
 * Obtiene propiedades que tienen visitas programadas
 * @param limit Número máximo de propiedades a obtener
 */
export async function fetchPropertiesWithVisits(
  limit: number = 6
): Promise<Property[]> {
  const response = await fetch(
    `/api/properties/with-visits?limit=${limit}&includeVisitCount=true`
  );

  if (!response.ok) {
    throw new Error(
      `Error al obtener propiedades con visitas: ${response.statusText}`
    );
  }

  const { data } = (await response.json()) as {
    data: (Property & { visitCount?: number })[];
    success: boolean;
  };
  return data;
}

// ==== HOOKS DE REACT QUERY ====

/**
 * Hook para obtener estadísticas de visitas
 */
export function useVisitStats() {
  return useQuery({
    queryKey: ["visitStats"],
    queryFn: fetchVisitStats,
  });
}

/**
 * Hook para obtener las próximas visitas programadas
 */
export function useUpcomingVisits(limit: number = 3) {
  return useQuery({
    queryKey: ["upcomingVisits", limit],
    queryFn: () => fetchUpcomingVisits(limit),
  });
}

/**
 * Hook para obtener propiedades con visitas programadas
 */
export function usePropertiesWithVisits(limit: number = 6) {
  return useQuery({
    queryKey: ["propertiesWithVisits", limit],
    queryFn: () => fetchPropertiesWithVisits(limit),
  });
}
