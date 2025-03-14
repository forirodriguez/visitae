// src/app/api/availability/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

// Schema de validación para parámetros de consulta opcionales
const querySchema = z.object({
  activeOnly: z
    .string()
    .optional()
    .transform((val) => val === "true"), // Convertir string a boolean
});

export async function GET(request: Request) {
  try {
    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url);
    const { activeOnly } = querySchema.parse(Object.fromEntries(searchParams));

    // Buscar todos los agentes (con disponibilidad o sin ella)
    const agents = await prisma.user.findMany({
      where: {
        role: "agent",
        ...(activeOnly && { isActive: true }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        isActive: true,
      },
      orderBy: { name: "asc" },
    });

    // Obtener todas las disponibilidades de agentes
    const availabilities = await prisma.agentAvailability.findMany({
      where: {
        agentId: {
          in: agents.map((agent) => agent.id),
        },
      },
    });

    // Crear un mapa de disponibilidades por agentId para acceso rápido
    const availabilityMap = availabilities.reduce(
      (map, availability) => {
        map[availability.agentId] = availability.weekData;
        return map;
      },
      {} as Record<string, unknown>
    );

    // Combinar agentes con sus disponibilidades
    const agentsWithAvailability = agents.map((agent) => {
      // Disponibilidad predeterminada si no existe
      const defaultAvailability = {
        lunes: {
          enabled: true,
          timeSlots: [{ id: "lun-1", startTime: "09:00", endTime: "18:00" }],
        },
        martes: {
          enabled: true,
          timeSlots: [{ id: "mar-1", startTime: "09:00", endTime: "18:00" }],
        },
        miercoles: {
          enabled: true,
          timeSlots: [{ id: "mie-1", startTime: "09:00", endTime: "18:00" }],
        },
        jueves: {
          enabled: true,
          timeSlots: [{ id: "jue-1", startTime: "09:00", endTime: "18:00" }],
        },
        viernes: {
          enabled: true,
          timeSlots: [{ id: "vie-1", startTime: "09:00", endTime: "18:00" }],
        },
        sabado: {
          enabled: true,
          timeSlots: [{ id: "sab-1", startTime: "10:00", endTime: "14:00" }],
        },
        domingo: { enabled: false, timeSlots: [] },
      };

      return {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        avatarUrl: agent.avatarUrl,
        isActive: agent.isActive,
        availability: availabilityMap[agent.id] || defaultAvailability,
        hasCustomAvailability: Boolean(availabilityMap[agent.id]),
      };
    });

    // Devolver respuesta exitosa
    return NextResponse.json({
      agents: agentsWithAvailability,
      count: agentsWithAvailability.length,
    });
  } catch (error) {
    console.error("Error obteniendo disponibilidades de agentes:", error);

    // Determinar tipo de error y devolver respuesta apropiada
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Parámetros de consulta inválidos", details: error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al obtener las disponibilidades de los agentes" },
      { status: 500 }
    );
  }
}
