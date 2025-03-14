// src/app/api/properties/featured/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/client"; // Asumiendo que tienes configurado el cliente de Prisma aquí
import { z } from "zod";

// Schema de validación para parámetros de consulta opcionales
const querySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 6)), // Valor por defecto de 6
});

export async function GET(request: Request) {
  try {
    // Obtener y validar parámetros de consulta
    const { searchParams } = new URL(request.url);
    const { limit } = querySchema.parse(Object.fromEntries(searchParams));

    // Obtener propiedades destacadas de la base de datos
    const featuredProperties = await prisma.property.findMany({
      where: {
        isFeatured: true,
        status: {
          in: ["publicada", "destacada"],
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
      select: {
        id: true,
        title: true,
        price: true,
        location: true,
        image: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        type: true,
        isNew: true,
        propertyType: true,
        status: true,
      },
    });

    // Devolver respuesta exitosa
    return NextResponse.json({
      properties: featuredProperties,
      count: featuredProperties.length,
    });
  } catch (error) {
    console.error("Error fetching featured properties:", error);

    // Determinar tipo de error y devolver respuesta apropiada
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.format() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch featured properties" },
      { status: 500 }
    );
  }
}
