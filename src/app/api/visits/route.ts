// src/app/api/visits/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import { formatApiResponse } from "@/lib/api/utils/response-formatter";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Esquema de validación para parámetros de consulta
const QuerySchema = z.object({
  propertyId: z.string().optional(),
  status: z.string().optional(), // Acepta una cadena que puede contener varios estados separados por coma
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  includeProperties: z
    .string()
    .optional()
    .transform((val) => val === "true"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : undefined)),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
});

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

// Definir tipo para visitas con relaciones incluidas
type VisitWithRelations = Prisma.VisitGetPayload<{
  include: {
    property: true;
    agent: {
      select: {
        id: true;
        name: true;
        email: true;
        avatarUrl: true;
      };
    };
    client: {
      select: {
        id: true;
        name: true;
        email: true;
        phone: true;
      };
    };
  };
}>;

// Definir tipo para visitas sin relaciones
type VisitWithoutRelations = Prisma.VisitGetPayload<object>;

// GET /api/visits - Obtener todas las visitas con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validar parámetros de consulta
    const {
      propertyId,
      status,
      startDate,
      endDate,
      includeProperties,
      limit,
      page,
    } = QuerySchema.parse(Object.fromEntries(searchParams));

    // Procesar estados si se proporcionan múltiples separados por coma
    const statusFilter = status
      ? { in: status.split(",").map((s) => s.trim()) }
      : undefined;

    // Construir base de la consulta
    const whereClause = {
      ...(propertyId && { propertyId }),
      ...(statusFilter && { status: statusFilter }),
      ...(startDate && { date: { gte: new Date(startDate) } }),
      ...(endDate && { date: { lte: new Date(endDate) } }),
    };

    // Ejecutar consulta con o sin relaciones según se solicite
    if (includeProperties) {
      // Consulta con relaciones incluidas
      const visitsWithRelations = (await prisma.visit.findMany({
        where: whereClause,
        include: {
          property: true,
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
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
        ...(limit && { take: limit }),
        ...(page && limit && { skip: (page - 1) * limit }),
      })) as VisitWithRelations[];

      // Formatear respuesta con datos de relaciones
      const formattedVisits = visitsWithRelations.map((visit) => ({
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
        // Incluir objetos relacionados completos
        property: visit.property,
        agent: visit.agent,
        client: visit.client,
      }));

      // Agregar metadatos de paginación si es necesario
      if (limit) {
        const total = await prisma.visit.count({ where: whereClause });
        const paginationData = {
          data: formattedVisits,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        };

        return formatApiResponse(paginationData);
      }

      return formatApiResponse(formattedVisits);
    } else {
      // Consulta sin relaciones incluidas
      const visitsWithoutRelations = (await prisma.visit.findMany({
        where: whereClause,
        orderBy: [{ date: "asc" }, { time: "asc" }],
        ...(limit && { take: limit }),
        ...(page && limit && { skip: (page - 1) * limit }),
      })) as VisitWithoutRelations[];

      // Agregar metadatos de paginación si es necesario
      if (limit) {
        const total = await prisma.visit.count({ where: whereClause });
        const paginationData = {
          data: visitsWithoutRelations,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        };

        return formatApiResponse(paginationData);
      }

      // Responder con los datos tal como vienen
      return formatApiResponse(visitsWithoutRelations);
    }
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
    const visit = (await prisma.visit.create({
      data: validatedData,
      include: {
        property: true,
        agent: true,
        client: true,
      },
    })) as VisitWithRelations;

    // Formatear la respuesta para mantener compatibilidad con la estructura esperada
    const formattedVisit = {
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
    };

    return formatApiResponse(formattedVisit, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
