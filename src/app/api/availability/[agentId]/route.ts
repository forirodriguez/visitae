import { NextRequest, NextResponse } from "next/server";
import { WeekAvailability } from "@/types/visits";

// Obtener disponibilidad de un agente por su ID
export async function GET(request: NextRequest) {
  try {
    const agentId = request.nextUrl.searchParams.get("agentId");

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: "ID de agente requerido" },
        { status: 400 }
      );
    }

    const agentAvailability = await prisma.agentAvailability.findUnique({
      where: { agentId },
    });

    if (!agentAvailability) {
      return NextResponse.json(
        { success: false, error: "Disponibilidad no encontrada" },
        { status: 404 }
      );
    }

    const availability: WeekAvailability = JSON.parse(
      agentAvailability.weekData
    );

    return NextResponse.json(
      { success: true, data: availability },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al obtener disponibilidad:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener disponibilidad" },
      { status: 500 }
    );
  }
}

// Actualizar disponibilidad de un agente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { availability } = body;

    const urlParts = request.nextUrl.pathname.split("/");
    const agentId = urlParts[urlParts.length - 1];

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: "ID de agente requerido en la URL" },
        { status: 400 }
      );
    }

    if (!availability) {
      return NextResponse.json(
        { success: false, error: "Datos de disponibilidad requeridos" },
        { status: 400 }
      );
    }

    const updatedAvailability = await prisma.agentAvailability.upsert({
      where: { agentId },
      update: { weekData: JSON.stringify(availability) },
      create: { agentId, weekData: JSON.stringify(availability) },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Disponibilidad actualizada correctamente",
        data: JSON.parse(updatedAvailability.weekData),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar disponibilidad:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar disponibilidad" },
      { status: 500 }
    );
  }
}
