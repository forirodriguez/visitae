// src/app/api/users/agents/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";
import { z } from "zod";

// Schema de validación para parámetros de consulta opcionales
const querySchema = z.object({
  active: z
    .string()
    .optional()
    .transform((val) => val === "true"), // Convertir string a boolean
  search: z.string().optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)), // Página por defecto es 1
});

export async function GET(request: Request) {
  try {
    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url);
    const { active, search, limit, page } = querySchema.parse(
      Object.fromEntries(searchParams)
    );

    // Calcular paginación
    const skip = limit && page ? (page - 1) * limit : undefined;
    // Obtener total de agentes que coinciden con los filtros
    const total = await prisma.user.count({
      where: {
        role: "agent",
        ...(active !== undefined && { isActive: active }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
    });

    // Obtener agentes de la base de datos
    const agents = await prisma.user.findMany({
      where: {
        role: "agent",
        ...(active !== undefined && { isActive: active }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        isActive: true,
        createdAt: true,
        // Contar propiedades asignadas al agente
        _count: {
          select: {
            agentVisits: true,
            AgentProperty: true,
          },
        },
      },
      orderBy: { name: "asc" },
      ...(limit && { take: limit }),
      ...(skip !== undefined && { skip }),
    });

    // Calcular metadatos de paginación
    const pagination = limit
      ? {
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        }
      : null;

    // Transformar los datos para el formato esperado por el frontend
    const formattedAgents = agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      email: agent.email,
      phone: agent.phone || "",
      avatarUrl: agent.avatarUrl || "",
      isActive: agent.isActive,
      createdAt: agent.createdAt,
      // Estadísticas
      stats: {
        properties: agent._count.AgentProperty,
        visits: agent._count.agentVisits,
      },
    }));

    // Devolver respuesta exitosa
    return NextResponse.json({
      agents: formattedAgents,
      pagination,
      total,
    });
  } catch (error) {
    console.error("Error fetching agents:", error);

    // Determinar tipo de error y devolver respuesta apropiada
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Parámetros de consulta inválidos", details: error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al obtener la lista de agentes" },
      { status: 500 }
    );
  }
}
