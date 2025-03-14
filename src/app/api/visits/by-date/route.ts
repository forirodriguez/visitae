// src/app/api/visits/by-date/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

// Schema de validación para los parámetros de consulta
const querySchema = z.object({
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "startDate debe ser una fecha válida",
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "endDate debe ser una fecha válida",
  }),
  agentId: z.string().optional(),
  status: z
    .enum(["pendiente", "confirmada", "cancelada", "completada"])
    .optional(),
  type: z.enum(["presencial", "videollamada"]).optional(),
});

export async function GET(request: Request) {
  try {
    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url);
    const params = querySchema.parse(Object.fromEntries(searchParams));

    // Convertir strings a objetos Date
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    // Asegurarse de que endDate incluya el día completo
    endDate.setHours(23, 59, 59, 999);

    // Construir el objeto de consulta
    const where = {
      date: {
        gte: startDate,
        lte: endDate,
      },
      ...(params.agentId && { agentId: params.agentId }),
      ...(params.status && { status: params.status }),
      ...(params.type && { type: params.type }),
    };

    // Obtener visitas de la base de datos
    const visits = await prisma.visit.findMany({
      where,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            image: true,
            address: true,
          },
        },
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
    });

    // Transformar los datos para que coincidan con la estructura esperada por el frontend
    const formattedVisits = visits.map((visit) => ({
      id: visit.id,
      date: visit.date,
      time: visit.time,
      type: visit.type,
      status: visit.status,
      notes: visit.notes,
      propertyId: visit.propertyId,
      propertyTitle: visit.property.title,
      propertyImage: visit.property.image,
      agentId: visit.agentId,
      clientName: visit.client.name,
      clientEmail: visit.client.email,
      clientPhone: visit.client.phone || "",
      // Datos adicionales útiles
      agentName: visit.agent?.name,
      agentEmail: visit.agent?.email,
      propertyAddress: visit.property.address,
    }));

    // Devolver respuesta exitosa
    return NextResponse.json({
      visits: formattedVisits,
      count: formattedVisits.length,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    });
  } catch (error) {
    console.error("Error fetching visits by date range:", error);

    // Determinar tipo de error y devolver respuesta apropiada
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Parámetros de consulta inválidos", details: error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al obtener visitas por rango de fechas" },
      { status: 500 }
    );
  }
}
