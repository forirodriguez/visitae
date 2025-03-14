import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import { formatApiResponse } from "@/lib/api/utils/response-formatter";
import { z } from "zod";

// Esquema de validación para crear visitas
const VisitSchema = z.object({
  propertyId: z.string().min(1, "El ID de la propiedad es requerido"),
  clientId: z.string().min(1, "El ID del cliente es requerido"),
  date: z.string().transform((str) => new Date(str)),
  time: z
    .string()
    .regex(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "Formato de hora inválido (HH:MM)"
    ),
  type: z.enum(["presencial", "videollamada"], {
    errorMap: () => ({
      message: "El tipo debe ser 'presencial' o 'videollamada'",
    }),
  }),
  status: z.enum(["pendiente", "confirmada", "cancelada", "completada"], {
    errorMap: () => ({ message: "Estado no válido" }),
  }),
  agentId: z.string().optional(),
  notes: z.string().optional(),
});

// GET /api/visits - Obtener todas las visitas con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parsear parámetros de búsqueda
    const propertyId = searchParams.get("propertyId");
    const agentId = searchParams.get("agentId");
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status") as
      | "pendiente"
      | "confirmada"
      | "cancelada"
      | "completada"
      | null;
    const type = searchParams.get("type") as
      | "presencial"
      | "videollamada"
      | null;
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined;
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined;

    // Construir consulta
    const visits = await prisma.visit.findMany({
      where: {
        ...(propertyId && { propertyId }),
        ...(agentId && { agentId }),
        ...(clientId && { clientId }),
        ...(status && { status }),
        ...(type && { type }),
        ...(startDate &&
          endDate && {
            date: {
              gte: startDate,
              lte: endDate,
            },
          }),
        ...(startDate &&
          !endDate && {
            date: {
              gte: startDate,
            },
          }),
        ...(!startDate &&
          endDate && {
            date: {
              lte: endDate,
            },
          }),
      },
      include: {
        property: true,
        agent: true,
        client: true,
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    return formatApiResponse(visits);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/visits - Crear una nueva visita
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos de entrada
    const validatedData = VisitSchema.parse(body);

    // Verificar que la propiedad existe
    const property = await prisma.property.findUnique({
      where: { id: validatedData.propertyId },
    });

    if (!property) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "La propiedad especificada no existe",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar que el cliente existe
    const client = await prisma.user.findUnique({
      where: { id: validatedData.clientId },
    });

    if (!client) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "El cliente especificado no existe",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Si se especifica un agente, verificar que existe
    if (validatedData.agentId) {
      const agent = await prisma.user.findUnique({
        where: {
          id: validatedData.agentId,
          role: "agent",
        },
      });

      if (!agent) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "El agente especificado no existe",
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Crear visita
    const visit = await prisma.visit.create({
      data: validatedData,
      include: {
        property: true,
        agent: true,
        client: true,
      },
    });

    return formatApiResponse(visit, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
