import { NextRequest, NextResponse } from "next/server";
import { WeekAvailability } from "@/types/visits";
import { mockAgent } from "@/lib/mock-data/visits";

export async function GET(request: NextRequest) {
  try {
    const agentId = request.nextUrl.searchParams.get("agentId");
    if (agentId) {
      if (agentId === mockAgent.id) {
        const availability: WeekAvailability = mockAgent.availability;
        return NextResponse.json(
          { success: true, data: availability },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { success: false, error: "Agente no encontrado" },
          { status: 404 }
        );
      }
    } else {
      throw new Error("ID de agente requerido");
    }
  } catch (error) {
    console.error("Error al obtener disponibilidad:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener disponibilidad" },
      { status: 500 }
    );
  }
}

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

    console.log(`Actualizando disponibilidad para el agente ${agentId}`);

    return NextResponse.json(
      {
        success: true,
        message: "Disponibilidad actualizada correctamente",
        data: availability,
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
