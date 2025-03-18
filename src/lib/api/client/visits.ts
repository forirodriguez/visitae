// src/lib/api/client/visits.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Visit, VisitStatus, VisitType } from "@/types/visits";
import { VisitFilters } from "@/hooks/useVisits";

// Tipo para errores de la API
type ApiErrorResponse = {
  error: string;
  message?: string;
  success: false;
};

// Tipo para eventos del calendario
export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  status: VisitStatus;
  type: VisitType;
  property: {
    id: string;
    title: string;
    image: string;
    location: string;
  };
  client: {
    name: string;
    email: string;
    phone: string;
  };
  notes?: string;
  agentId?: string;
  agentName?: string;
};

// Tipo para crear/actualizar visitas
export type VisitInput = {
  date: string;
  time: string;
  type: VisitType;
  status: VisitStatus;
  propertyId: string;
  clientId: string;
  agentId?: string;
  notes?: string;
};

// FUNCIONES PARA OBTENER DATOS

// Procesar filtros para la API
function processFilters(filters?: VisitFilters): URLSearchParams {
  const queryParams = new URLSearchParams();

  if (!filters) return queryParams;

  if (filters.propertyId) queryParams.set("propertyId", filters.propertyId);

  // Procesar estado(s)
  if (filters.status) {
    if (typeof filters.status === "string" && filters.status.includes(",")) {
      // Si es una cadena con múltiples estados separados por coma
      queryParams.set("status", filters.status);
    } else if (Array.isArray(filters.status)) {
      // Si es un array de estados
      queryParams.set("status", filters.status.join(","));
    } else {
      // Si es un solo estado
      queryParams.set("status", filters.status);
    }
  }

  if (filters.startDate) queryParams.set("startDate", filters.startDate);
  if (filters.endDate) queryParams.set("endDate", filters.endDate);

  return queryParams;
}

// Obtener todas las visitas (con filtros opcionales)
export async function fetchVisits(filters?: VisitFilters): Promise<Visit[]> {
  // Construir parámetros de consulta
  const queryParams = processFilters(filters);

  const response = await fetch(`/api/visits?${queryParams}`);

  if (!response.ok) {
    throw new Error(`Error al obtener visitas: ${response.statusText}`);
  }

  const { data } = (await response.json()) as {
    data: Visit[];
    success: boolean;
  };
  return data;
}

// Obtener una visita específica por ID
export async function fetchVisitById(
  id: string,
  includeProperty?: boolean
): Promise<Visit> {
  const url = includeProperty
    ? `/api/visits/${id}?includeProperty=true`
    : `/api/visits/${id}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al obtener la visita: ${response.statusText}`);
  }

  const { data } = (await response.json()) as { data: Visit; success: boolean };
  return data;
}

// Obtener eventos para el calendario
export async function fetchCalendarEvents(
  start: string,
  end: string,
  agentId?: string
): Promise<CalendarEvent[]> {
  // Construir parámetros de consulta
  const queryParams = new URLSearchParams({
    start,
    end,
  });

  if (agentId) queryParams.set("agentId", agentId);

  const response = await fetch(`/api/visits/calendar?${queryParams}`);

  if (!response.ok) {
    throw new Error(
      `Error al obtener eventos del calendario: ${response.statusText}`
    );
  }

  const { data } = (await response.json()) as {
    data: CalendarEvent[];
    success: boolean;
  };
  return data;
}

// Verificar conflictos de visitas
export async function checkVisitConflict(
  propertyId: string,
  date: string,
  time: string,
  excludeVisitId?: string
): Promise<boolean> {
  let url = `/api/visits/check-conflict?propertyId=${propertyId}&date=${date}&time=${time}`;

  if (excludeVisitId) {
    url += `&excludeVisitId=${excludeVisitId}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al verificar conflictos: ${response.statusText}`);
  }

  const { data } = (await response.json()) as {
    data: { hasConflict: boolean };
    success: boolean;
  };
  return data.hasConflict;
}

// HOOKS DE REACT QUERY

// Hook para obtener todas las visitas
export function useVisits(filters?: VisitFilters) {
  return useQuery({
    queryKey: ["visits", filters],
    queryFn: () => fetchVisits(filters),
  });
}

// Hook para obtener una visita específica
export function useVisit(id?: string) {
  return useQuery({
    queryKey: ["visit", id],
    queryFn: () => fetchVisitById(id!),
    enabled: !!id, // Solo ejecutar si existe el ID
  });
}

// Hook para obtener eventos del calendario
export function useCalendarEvents(
  start: string,
  end: string,
  agentId?: string
) {
  return useQuery({
    queryKey: ["calendarEvents", start, end, agentId],
    queryFn: () => fetchCalendarEvents(start, end, agentId),
  });
}

// Hook para crear una nueva visita
export function useCreateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (visitData: VisitInput) => {
      const response = await fetch("/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(visitData),
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(
          errorData.message || errorData.error || "Error al crear la visita"
        );
      }

      const { data } = (await response.json()) as {
        data: Visit;
        success: boolean;
      };
      return data;
    },
    onSuccess: () => {
      // Invalidar consultas relacionadas para que se actualicen
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });
}

// Hook para actualizar una visita existente
export function useUpdateVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<VisitInput>;
    }) => {
      const response = await fetch(`/api/visits/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            "Error al actualizar la visita"
        );
      }

      const { data: updatedVisit } = (await response.json()) as {
        data: Visit;
        success: boolean;
      };
      return updatedVisit;
    },
    onSuccess: (_, variables) => {
      // Invalidar consultas relacionadas para que se actualicen
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["visit", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });
}

// Hook para actualizar el estado de una visita
export function useUpdateVisitStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: VisitStatus }) => {
      const response = await fetch(`/api/visits/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(
          errorData.message ||
            errorData.error ||
            "Error al actualizar el estado"
        );
      }

      const { data: updatedVisit } = (await response.json()) as {
        data: Visit;
        success: boolean;
      };
      return updatedVisit;
    },
    onSuccess: (_, variables) => {
      // Invalidar consultas relacionadas para que se actualicen
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["visit", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });
}

// Hook para eliminar una visita
export function useDeleteVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/visits/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(
          errorData.message || errorData.error || "Error al eliminar la visita"
        );
      }

      return true;
    },
    onSuccess: () => {
      // Invalidar consultas relacionadas para que se actualicen
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });
}
