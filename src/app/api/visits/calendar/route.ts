// src/app/api/visits/calendar/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import { formatApiResponse } from "@/lib/api/utils/response-formatter";
import { z } from "zod";
import { parseISO, addHours } from "date-fns";

// Esquema para validar parámetros de consulta
const QuerySchema = z.object({
  start: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha de inicio inválida",
  }),
  end: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha de fin inválida",
  }),
  agentId: z.string().optional(),
});

/**
 * GET /api/visits/calendar
 * Devuelve visitas formateadas como eventos de calendario para el rango de fechas especificado
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url);
    const { start, end, agentId } = QuerySchema.parse(
      Object.fromEntries(searchParams)
    );

    // Convertir strings a objetos Date
    const startDate = parseISO(start);
    const endDate = parseISO(end);

    // Consultar visitas en el rango de fechas especificado
    const visits = await prisma.visit.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
        ...(agentId && { agentId }),
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            image: true,
            location: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    // Transformar visitas a formato de evento de calendario
    const calendarEvents = visits.map((visit) => {
      // Crear fecha/hora de inicio combinando fecha y hora
      const startDateTime = new Date(visit.date);
      const [hours, minutes] = visit.time.split(":").map(Number);
      startDateTime.setHours(hours, minutes);

      // Crear fecha/hora de fin (asumimos visitas de 1 hora)
      const endDateTime = addHours(startDateTime, 1);

      return {
        id: visit.id,
        title: `${visit.property.title} - ${visit.client.name}`,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        status: visit.status,
        type: visit.type,
        property: {
          id: visit.property.id,
          title: visit.property.title,
          image: visit.property.image,
          location: visit.property.location,
        },
        client: {
          name: visit.client.name,
          email: visit.client.email,
          phone: visit.client.phone || "",
        },
        notes: visit.notes,
        agentId: visit.agentId,
        agentName: visit.agent?.name,
      };
    });

    return formatApiResponse(calendarEvents);
  } catch (error) {
    return handleApiError(error);
  }
}
