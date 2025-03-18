// src/app/api/visits/upcoming/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import { formatApiResponse } from "@/lib/api/utils/response-formatter";
import { z } from "zod";

// Esquema para validar parámetros de consulta
const QuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 5)),
  agentId: z.string().optional(),
});

/**
 * GET /api/visits/upcoming
 * Devuelve las próximas visitas programadas (pendientes o confirmadas)
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url);
    const { limit, agentId } = QuerySchema.parse(
      Object.fromEntries(searchParams)
    );

    // Fecha actual
    const today = new Date();

    // Consultar visitas futuras (pendientes o confirmadas)
    const upcomingVisits = await prisma.visit.findMany({
      where: {
        date: {
          gte: today,
        },
        status: {
          in: ["pendiente", "confirmada"],
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
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      take: limit,
    });

    // Formatear datos para coincidir con la estructura esperada
    const formattedVisits = upcomingVisits.map((visit) => ({
      id: visit.id,
      propertyId: visit.propertyId,
      propertyTitle: visit.property.title,
      propertyImage: visit.property.image,
      clientName: visit.client.name,
      clientEmail: visit.client.email,
      clientPhone: visit.client.phone || "",
      date: visit.date,
      time: visit.time,
      type: visit.type,
      status: visit.status,
      agentId: visit.agentId,
      notes: visit.notes,
    }));

    return formatApiResponse(formattedVisits);
  } catch (error) {
    return handleApiError(error);
  }
}
