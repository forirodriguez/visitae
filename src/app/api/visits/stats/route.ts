// src/app/api/visits/stats/route.ts
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import { formatApiResponse } from "@/lib/api/utils/response-formatter";

/**
 * GET /api/visits/stats
 * Devuelve estadísticas agregadas de visitas para el dashboard
 */
export async function GET() {
  try {
    // Obtener todas las visitas
    const allVisits = await prisma.visit.findMany();

    // Contar visitas por estado
    const pendingCount = allVisits.filter(
      (v) => v.status === "pendiente"
    ).length;
    const confirmedCount = allVisits.filter(
      (v) => v.status === "confirmada"
    ).length;
    const completedCount = allVisits.filter(
      (v) => v.status === "completada"
    ).length;
    const canceledCount = allVisits.filter(
      (v) => v.status === "cancelada"
    ).length;
    const totalCount = allVisits.length;

    // Contar visitas por tipo
    const presentialCount = allVisits.filter(
      (v) => v.type === "presencial"
    ).length;
    const videoCount = allVisits.filter(
      (v) => v.type === "videollamada"
    ).length;

    // Calcular ratio de conversión
    const conversionRatio =
      completedCount > 0
        ? ((completedCount / totalCount) * 100).toFixed(1)
        : "0";

    // Construir y devolver respuesta
    const stats = {
      byStatus: {
        pendiente: pendingCount,
        confirmada: confirmedCount,
        completada: completedCount,
        cancelada: canceledCount,
        total: totalCount,
      },
      byType: {
        presencial: presentialCount,
        videollamada: videoCount,
      },
      conversion: {
        ratio: conversionRatio,
      },
    };

    return formatApiResponse(stats);
  } catch (error) {
    return handleApiError(error);
  }
}
