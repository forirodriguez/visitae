// src/app/api/properties/with-visits/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import { formatApiResponse } from "@/lib/api/utils/response-formatter";
import { z } from "zod";
import { Property } from "@/types/property";

// Definir un tipo específico para la respuesta de Prisma con visitas
type PropertyWithVisits = Property & {
  visits?: { id: string }[];
};

// Esquema para validar parámetros de consulta
const QuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  includeVisitCount: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

/**
 * GET /api/properties/with-visits
 * Devuelve propiedades que tienen visitas programadas (pendientes o confirmadas)
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url);
    const { limit, includeVisitCount } = QuerySchema.parse(
      Object.fromEntries(searchParams)
    );

    // Primero, obtener IDs de propiedades con visitas pendientes o confirmadas
    const propertiesWithVisits = (await prisma.property.findMany({
      where: {
        visits: {
          some: {
            status: {
              in: ["pendiente", "confirmada"],
            },
          },
        },
      },
      include: includeVisitCount
        ? {
            visits: {
              where: {
                status: {
                  in: ["pendiente", "confirmada"],
                },
              },
              select: {
                id: true,
              },
            },
          }
        : undefined,
      take: limit,
    })) as PropertyWithVisits[];

    // Formatear la respuesta para agregar el conteo de visitas si se solicitó
    const formattedProperties = propertiesWithVisits.map((property) => {
      const formattedProperty = {
        ...property,
        // Si includeVisitCount es true, agregamos el conteo
        ...(includeVisitCount && { visitCount: property.visits?.length || 0 }),
      };

      // Eliminar el array de visitas si se incluyó en la consulta
      if (includeVisitCount && "visits" in formattedProperty) {
        const { visits, ...rest } = formattedProperty;
        return { ...rest, visitCount: visits?.length || 0 };
      }

      return formattedProperty;
    });

    return formatApiResponse(formattedProperties);
  } catch (error) {
    return handleApiError(error);
  }
}
