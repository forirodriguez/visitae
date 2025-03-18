// src/app/api/visits/check-conflict/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import { formatApiResponse } from "@/lib/api/utils/response-formatter";
import { z } from "zod";

// Esquema para validar parámetros de consulta
const QuerySchema = z.object({
  propertyId: z.string(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha inválida",
  }),
  time: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Formato de hora inválido (HH:MM)"
    ),
  excludeVisitId: z.string().optional(),
});

/**
 * GET /api/visits/check-conflict
 * Verifica si existe un conflicto de horario para una visita
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url);
    const { propertyId, date, time, excludeVisitId } = QuerySchema.parse(
      Object.fromEntries(searchParams)
    );

    // Convertir fecha a objeto Date
    const visitDate = new Date(date);

    // Extraer horas y minutos
    const [hours, minutes] = time.split(":").map(Number);

    // Calcular ventana de tiempo para verificar conflictos (1 hora antes y después)
    const visitTimeInMinutes = hours * 60 + minutes;

    // Buscar visitas programadas para la misma propiedad en la misma fecha
    const visitsOnSameDay = await prisma.visit.findMany({
      where: {
        propertyId,
        date: {
          gte: new Date(visitDate.setHours(0, 0, 0, 0)),
          lt: new Date(visitDate.setHours(23, 59, 59, 999)),
        },
        status: {
          in: ["pendiente", "confirmada"],
        },
        ...(excludeVisitId && {
          NOT: { id: excludeVisitId },
        }),
      },
    });

    // Verificar si alguna visita tiene un horario que se solapa (menos de 60 minutos entre ellas)
    const hasConflict = visitsOnSameDay.some((visit) => {
      const [existingHours, existingMinutes] = visit.time
        .split(":")
        .map(Number);
      const existingTimeInMinutes = existingHours * 60 + existingMinutes;

      // Consideramos conflicto si hay menos de 60 minutos entre visitas
      return Math.abs(existingTimeInMinutes - visitTimeInMinutes) < 60;
    });

    return formatApiResponse({
      hasConflict,
      conflictingVisits: hasConflict ? visitsOnSameDay.length : 0,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
