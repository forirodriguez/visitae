import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import { formatApiResponse } from "@/lib/api/utils/response-formatter";
import { z } from "zod";

// Esquema de validación para crear/actualizar propiedades
const PropertySchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  price: z.number().positive("El precio debe ser positivo"),
  location: z.string().min(3, "La ubicación debe tener al menos 3 caracteres"),
  image: z.string().url("La imagen debe ser una URL válida"),
  bedrooms: z
    .number()
    .int()
    .nonnegative("El número de habitaciones debe ser positivo"),
  bathrooms: z
    .number()
    .int()
    .nonnegative("El número de baños debe ser positivo"),
  area: z.number().positive("El área debe ser positiva"),
  type: z.enum(["venta", "alquiler"], {
    errorMap: () => ({ message: "El tipo debe ser 'venta' o 'alquiler'" }),
  }),
  description: z.string(),
  propertyType: z.string(),
  address: z.string(),
  features: z.array(z.string()),
  status: z.enum(["publicada", "borrador", "destacada", "inactiva"], {
    errorMap: () => ({ message: "Estado no válido" }),
  }),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

// GET /api/properties - Obtener todas las propiedades con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parsear parámetros de búsqueda
    const type = searchParams.get("type") as "venta" | "alquiler" | null;
    const minPrice = searchParams.has("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined;
    const maxPrice = searchParams.has("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined;
    const minBedrooms = searchParams.has("minBedrooms")
      ? Number(searchParams.get("minBedrooms"))
      : undefined;
    const location = searchParams.get("location");
    const keyword = searchParams.get("keyword");
    const featured = searchParams.has("featured")
      ? searchParams.get("featured") === "true"
      : undefined;
    const status = searchParams.get("status") as
      | "publicada"
      | "borrador"
      | "destacada"
      | "inactiva"
      | null;

    // Construir consulta
    const properties = await prisma.property.findMany({
      where: {
        ...(type && { type }),
        ...(minPrice !== undefined && { price: { gte: minPrice } }),
        ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
        ...(minBedrooms !== undefined && { bedrooms: { gte: minBedrooms } }),
        ...(location && {
          location: {
            contains: location,
            mode: "insensitive",
          },
        }),
        ...(keyword && {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
            { location: { contains: keyword, mode: "insensitive" } },
          ],
        }),
        ...(featured !== undefined && { isFeatured: featured }),
        ...(status && { status }),
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return formatApiResponse(properties);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/properties - Crear una nueva propiedad
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos de entrada
    const validatedData = PropertySchema.parse(body);

    // Crear propiedad
    const property = await prisma.property.create({
      data: validatedData,
    });

    return formatApiResponse(property, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
