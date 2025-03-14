import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import {
  formatApiResponse,
  formatApiSuccess,
  formatApiNotFound,
} from "@/lib/api/utils/response-formatter";
import { z } from "zod";

// Esquema para actualización parcial de propiedad
const PropertyUpdateSchema = z.object({
  title: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .optional(),
  price: z.number().positive("El precio debe ser positivo").optional(),
  location: z
    .string()
    .min(3, "La ubicación debe tener al menos 3 caracteres")
    .optional(),
  image: z.string().url("La imagen debe ser una URL válida").optional(),
  bedrooms: z
    .number()
    .int()
    .nonnegative("El número de habitaciones debe ser positivo")
    .optional(),
  bathrooms: z
    .number()
    .int()
    .nonnegative("El número de baños debe ser positivo")
    .optional(),
  area: z.number().positive("El área debe ser positiva").optional(),
  type: z
    .enum(["venta", "alquiler"], {
      errorMap: () => ({ message: "El tipo debe ser 'venta' o 'alquiler'" }),
    })
    .optional(),
  description: z.string().optional(),
  propertyType: z.string().optional(),
  address: z.string().optional(),
  features: z.array(z.string()).optional(),
  status: z
    .enum(["publicada", "borrador", "destacada", "inactiva"], {
      errorMap: () => ({ message: "Estado no válido" }),
    })
    .optional(),
  isNew: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

// GET /api/properties/[id] - Obtener una propiedad por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!property) {
      return formatApiNotFound("Propiedad no encontrada");
    }

    return formatApiResponse(property);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/properties/[id] - Actualizar una propiedad completa
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validar datos completos
    const validatedData = PropertyUpdateSchema.parse(body);

    // Verificar que la propiedad existe
    const existingProperty = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!existingProperty) {
      return formatApiNotFound("Propiedad no encontrada");
    }

    // Actualizar propiedad
    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: validatedData,
    });

    return formatApiResponse(updatedProperty);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/properties/[id] - Actualizar campos específicos de una propiedad
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validar datos parciales
    const validatedData = PropertyUpdateSchema.partial().parse(body);

    // Verificar que la propiedad existe
    const existingProperty = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!existingProperty) {
      return formatApiNotFound("Propiedad no encontrada");
    }

    // Actualizar campos específicos
    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: validatedData,
    });

    return formatApiResponse(updatedProperty);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/properties/[id] - Eliminar una propiedad
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que la propiedad existe
    const existingProperty = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!existingProperty) {
      return formatApiNotFound("Propiedad no encontrada");
    }

    // Usar una transacción para asegurar que todo se elimina correctamente
    await prisma.$transaction(async (tx) => {
      // Eliminar visitas relacionadas
      await tx.visit.deleteMany({
        where: { propertyId: params.id },
      });

      // Eliminar relaciones con agentes
      await tx.agentProperty.deleteMany({
        where: { propertyId: params.id },
      });

      // Eliminar la propiedad
      await tx.property.delete({
        where: { id: params.id },
      });
    });

    return formatApiSuccess("Propiedad eliminada correctamente");
  } catch (error) {
    return handleApiError(error);
  }
}
