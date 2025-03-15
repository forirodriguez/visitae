import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import {
  formatApiResponse,
  formatApiSuccess,
  formatApiNotFound,
} from "@/lib/api/utils/response-formatter";
import { z } from "zod";

// Esquema para actualización parcial de visita
const VisitUpdateSchema = z.object({
  propertyId: z
    .string()
    .min(1, "El ID de la propiedad es requerido")
    .optional(),
  clientId: z.string().min(1, "El ID del cliente es requerido").optional(),
  date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  time: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Formato de hora inválido (HH:MM)"
    )
    .optional(),
  type: z.enum(["presencial", "videollamada"]).optional(),
  status: z
    .enum(["pendiente", "confirmada", "cancelada", "completada"])
    .optional(),
  agentId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Función para extraer `id` de la URL
const getVisitIdFromUrl = (request: NextRequest) => {
  const urlParts = request.nextUrl.pathname.split("/");
  return urlParts[urlParts.length - 1]; // Último segmento de la URL
};

// GET /api/visits/[id] - Obtener una visita por ID
export async function GET(request: NextRequest) {
  try {
    const id = getVisitIdFromUrl(request);

    const visit = await prisma.visit.findUnique({
      where: { id },
      include: {
        property: true,
        agent: true,
        client: true,
      },
    });

    if (!visit) {
      return formatApiNotFound("Visita no encontrada");
    }

    return formatApiResponse(visit);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/visits/[id] - Actualizar una visita completa
export async function PUT(request: NextRequest) {
  try {
    const id = getVisitIdFromUrl(request);
    const body = await request.json();

    // Validar datos completos
    const validatedData = VisitUpdateSchema.parse(body);

    // Verificar que la visita existe
    const existingVisit = await prisma.visit.findUnique({ where: { id } });

    if (!existingVisit) {
      return formatApiNotFound("Visita no encontrada");
    }

    // Actualizar visita
    const updatedVisit = await prisma.visit.update({
      where: { id },
      data: validatedData,
      include: {
        property: true,
        agent: true,
        client: true,
      },
    });

    return formatApiResponse(updatedVisit);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/visits/[id] - Actualizar campos específicos de una visita
export async function PATCH(request: NextRequest) {
  try {
    const id = getVisitIdFromUrl(request);
    const body = await request.json();

    // Validar datos parciales
    const validatedData = VisitUpdateSchema.partial().parse(body);

    // Verificar que la visita existe
    const existingVisit = await prisma.visit.findUnique({ where: { id } });

    if (!existingVisit) {
      return formatApiNotFound("Visita no encontrada");
    }

    // Actualizar campos específicos
    const updatedVisit = await prisma.visit.update({
      where: { id },
      data: validatedData,
      include: {
        property: true,
        agent: true,
        client: true,
      },
    });

    return formatApiResponse(updatedVisit);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/visits/[id] - Eliminar una visita
export async function DELETE(request: NextRequest) {
  try {
    const id = getVisitIdFromUrl(request);

    // Verificar que la visita existe
    const existingVisit = await prisma.visit.findUnique({ where: { id } });

    if (!existingVisit) {
      return formatApiNotFound("Visita no encontrada");
    }

    // Eliminar la visita
    await prisma.visit.delete({ where: { id } });

    return formatApiSuccess("Visita eliminada correctamente");
  } catch (error) {
    return handleApiError(error);
  }
}
