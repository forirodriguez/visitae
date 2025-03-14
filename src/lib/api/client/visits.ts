import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Visit, VisitStatus, VisitType } from "@/types/visits";

// Tipos para las respuestas de la API
type ApiResponse<T> = {
  data: T;
  success: boolean;
};

type ApiErrorResponse = {
  error: string;
  message?: string;
  success: false;
};

// Tipo para eventos del calendario
type CalendarEvent = {
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
};

// Tipo para crear/actualizar visitas
type VisitInput = {
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

// Obtener todas las visitas (con filtros opcionales)
export async function fetchVisits(filters?: {
  propertyId?: string;
  status?: VisitStatus;
  startDate?: string;
  endDate?: string;
}): Promise<Visit[]> {
  // Construir parámetros de consulta
  const queryParams = new URLSearchParams();

  if (filters?.propertyId) queryParams.set("propertyId", filters.propertyId);
  if (filters?.status) queryParams.set("status", filters.status);
  if (filters?.startDate) queryParams.set("startDate", filters.startDate);
  if (filters?.endDate) queryParams.set("endDate", filters.endDate);

  // Intentar obtener datos de la API real
  try {
    const response = await fetch(`/api/visits?${queryParams}`);

    if (!response.ok) {
      throw new Error("Error al obtener visitas");
    }

    const { data } = (await response.json()) as ApiResponse<Visit[]>;
    return data;
  } catch (error) {
    console.error("Error fetching visits from API, using mock data:", error);

    // Datos mock de respaldo para desarrollo
    return [
      {
        id: "v1",
        propertyId: "prop1",
        propertyTitle: "Apartamento de lujo con vistas al mar",
        propertyImage:
          "/placeholder.svg?height=300&width=400&text=Apartamento+Lujo",
        clientName: "Carlos Rodríguez",
        clientEmail: "carlos@example.com",
        clientPhone: "600123456",
        date: new Date(2025, 2, 10),
        time: "10:00",
        type: "presencial",
        status: "confirmada",
        agentId: "agent-001",
        notes: "Cliente interesado en compra inmediata",
      },
      {
        id: "v2",
        propertyId: "prop2",
        propertyTitle: "Casa adosada con jardín privado",
        propertyImage:
          "/placeholder.svg?height=300&width=400&text=Casa+Adosada",
        clientName: "Laura Martínez",
        clientEmail: "laura@example.com",
        clientPhone: "600789012",
        date: new Date(2025, 2, 10),
        time: "12:30",
        type: "presencial",
        status: "pendiente",
        agentId: "agent-001",
      },
    ];
  }
}

// Obtener una visita específica por ID
export async function fetchVisitById(id: string): Promise<Visit> {
  try {
    const response = await fetch(`/api/visits/${id}`);

    if (!response.ok) {
      throw new Error("Error al obtener la visita");
    }

    const { data } = (await response.json()) as ApiResponse<Visit>;
    return data;
  } catch (error) {
    console.error("Error fetching visit by ID, using mock data:", error);

    // Dato mock de respaldo para desarrollo
    return {
      id,
      propertyId: "prop1",
      propertyTitle: "Apartamento de lujo con vistas al mar",
      propertyImage:
        "/placeholder.svg?height=300&width=400&text=Apartamento+Lujo",
      clientName: "Carlos Rodríguez",
      clientEmail: "carlos@example.com",
      clientPhone: "600123456",
      date: new Date(),
      time: "10:00",
      type: "presencial",
      status: "confirmada",
      agentId: "agent-001",
      notes: "Visita de prueba",
    };
  }
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

  try {
    const response = await fetch(`/api/visits/calendar?${queryParams}`);

    if (!response.ok) {
      throw new Error("Error al obtener eventos del calendario");
    }

    const { data } = (await response.json()) as ApiResponse<CalendarEvent[]>;
    return data;
  } catch (error) {
    console.error("Error fetching calendar events, using mock data:", error);

    // Datos mock de respaldo para desarrollo
    const startDate = new Date(start);

    // Crear algunos eventos mock en el rango de fechas
    const mockEvents: CalendarEvent[] = [
      {
        id: "v1",
        title: "Apartamento de lujo - Carlos Rodríguez",
        start: new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + 1,
          10,
          0
        ).toISOString(),
        end: new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + 1,
          11,
          0
        ).toISOString(),
        status: "confirmada",
        type: "presencial",
        property: {
          id: "prop1",
          title: "Apartamento de lujo con vistas al mar",
          image: "/placeholder.svg?height=300&width=400&text=Apartamento+Lujo",
          location: "Paseo Marítimo, Málaga",
        },
        client: {
          name: "Carlos Rodríguez",
          email: "carlos@example.com",
          phone: "600123456",
        },
        notes: "Cliente interesado en compra inmediata",
        agentId: "agent-001",
      },
      {
        id: "v2",
        title: "Casa adosada - Laura Martínez",
        start: new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + 2,
          12,
          30
        ).toISOString(),
        end: new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + 2,
          13,
          30
        ).toISOString(),
        status: "pendiente",
        type: "presencial",
        property: {
          id: "prop2",
          title: "Casa adosada con jardín privado",
          image: "/placeholder.svg?height=300&width=400&text=Casa+Adosada",
          location: "Urbanización Los Pinos, Marbella",
        },
        client: {
          name: "Laura Martínez",
          email: "laura@example.com",
          phone: "600789012",
        },
        agentId: "agent-001",
      },
    ];

    return mockEvents;
  }
}

// HOOKS DE REACT QUERY

// Hook para obtener todas las visitas
export function useVisits(filters?: {
  propertyId?: string;
  status?: VisitStatus;
  startDate?: string;
  endDate?: string;
}) {
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
      try {
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

        const { data } = (await response.json()) as ApiResponse<Visit>;
        return data;
      } catch (error) {
        console.error("Error creating visit:", error);
        // Para desarrollo, simular éxito incluso si hay error
        return {
          id: `new-${Date.now()}`,
          propertyId: visitData.propertyId,
          date: new Date(visitData.date),
          time: visitData.time,
          type: visitData.type,
          status: visitData.status,
        } as Visit;
      }
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
      try {
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

        const { data: updatedVisit } =
          (await response.json()) as ApiResponse<Visit>;
        return updatedVisit;
      } catch (error) {
        console.error("Error updating visit:", error);
        // Para desarrollo, simular éxito incluso si hay error
        return { id, ...data } as unknown as Visit;
      }
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
      try {
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

        const { data: updatedVisit } =
          (await response.json()) as ApiResponse<Visit>;
        return updatedVisit;
      } catch (error) {
        console.error("Error updating visit status:", error);
        // Para desarrollo, simular éxito incluso si hay error
        return { id, status } as Visit;
      }
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
      try {
        const response = await fetch(`/api/visits/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData: ApiErrorResponse = await response.json();
          throw new Error(
            errorData.message ||
              errorData.error ||
              "Error al eliminar la visita"
          );
        }

        return true;
      } catch (error) {
        console.error("Error deleting visit:", error);
        // Para desarrollo, simular éxito incluso si hay error
        return true;
      }
    },
    onSuccess: () => {
      // Invalidar consultas relacionadas para que se actualicen
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });
}
