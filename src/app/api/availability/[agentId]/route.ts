// src/app/api/availability/[agentId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

// Schema para validar el JSON de disponibilidad semanal
const timeSlotSchema = z.object({
  id: z.string(),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "El formato de hora debe ser HH:MM (24h)",
  }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "El formato de hora debe ser HH:MM (24h)",
  }),
});

const dayAvailabilitySchema = z.object({
  enabled: z.boolean(),
  timeSlots: z.array(timeSlotSchema),
});

const weekAvailabilitySchema = z.object({
  lunes: dayAvailabilitySchema,
  martes: dayAvailabilitySchema,
  miercoles: dayAvailabilitySchema,
  jueves: dayAvailabilitySchema,
  viernes: dayAvailabilitySchema,
  sabado: dayAvailabilitySchema,
  domingo: dayAvailabilitySchema,
});

// Obtener disponibilidad de un agente
export async function GET(
  request: Request,
  { params }: { params: { agentId: string } }
) {
  try {
    const { agentId } = params;

    // Verificar que el agente existe
    const agent = await prisma.user.findUnique({
      where: { id: agentId, role: "agent" },
      select: { id: true, name: true },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agente no encontrado" },
        { status: 404 }
      );
    }

    // Obtener la disponibilidad del agente
    const availability = await prisma.agentAvailability.findUnique({
      where: { agentId },
    });

    // Si no existe disponibilidad, devolver una por defecto
    if (!availability) {
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

      return NextResponse.json({
        agent: { id: agent.id, name: agent.name },
        availability: defaultAvailability,
        isDefault: true,
      });
    }

    // Devolver la disponibilidad existente
    return NextResponse.json({
      agent: { id: agent.id, name: agent.name },
      availability: availability.weekData,
      isDefault: false,
    });
  } catch (error) {
    console.error("Error obteniendo disponibilidad del agente:", error);
    return NextResponse.json(
      { error: "Error al obtener la disponibilidad" },
      { status: 500 }
    );
  }
}

// Actualizar disponibilidad de un agente
export async function PUT(
  request: Request,
  { params }: { params: { agentId: string } }
) {
  try {
    const { agentId } = params;
    const body = await request.json();

    // Validar el cuerpo de la solicitud
    const availabilityData = weekAvailabilitySchema.parse(body.availability);

    // Verificar que el agente existe
    const agent = await prisma.user.findUnique({
      where: { id: agentId, role: "agent" },
      select: { id: true },
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agente no encontrado" },
        { status: 404 }
      );
    }

    // Actualizar o crear la disponibilidad del agente
    const updatedAvailability = await prisma.agentAvailability.upsert({
      where: { agentId },
      update: {
        weekData: availabilityData,
      },
      create: {
        agentId,
        weekData: availabilityData,
      },
    });

    return NextResponse.json({
      message: "Disponibilidad actualizada correctamente",
      availability: updatedAvailability.weekData,
    });
  } catch (error) {
    console.error("Error actualizando disponibilidad del agente:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Datos de disponibilidad inválidos", details: error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar la disponibilidad" },
      { status: 500 }
    );
  }
}
