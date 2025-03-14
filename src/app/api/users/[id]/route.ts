import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import {
  formatApiResponse,
  formatApiSuccess,
  formatApiNotFound,
} from "@/lib/api/utils/response-formatter";
import { z } from "zod";
import { hash } from "bcrypt";

// Esquema para validar la actualización de usuarios
const UserUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),
  email: z.string().email("Email inválido").optional(),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional(),
  phone: z.string().optional().nullable(),
  avatarUrl: z.string().url("URL de avatar inválida").optional().nullable(),
  role: z
    .enum(["admin", "superadmin", "agent", "client"], {
      errorMap: () => ({ message: "Rol no válido" }),
    })
    .optional(),
  isActive: z.boolean().optional(),
});

// GET /api/users/[id] - Obtener un usuario por su ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Incluir datos relacionados si son necesarios
        ...(request.nextUrl.searchParams.get("includeVisits") === "true" && {
          agentVisits: true,
          clientVisits: true,
        }),
        ...(request.nextUrl.searchParams.get("includeProperties") ===
          "true" && {
          properties: true,
        }),
      },
    });

    if (!user) {
      return formatApiNotFound("Usuario no encontrado");
    }

    return formatApiResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT /api/users/[id] - Actualizar un usuario completo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validar datos
    const validatedData = UserUpdateSchema.parse(body);

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return formatApiNotFound("Usuario no encontrado");
    }

    // Si se actualiza el email, verificar que no esté en uso
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "El email ya está en uso por otro usuario",
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Preparar datos para actualización
    const updateData = { ...validatedData };

    // Si hay una nueva contraseña, cifrarla
    if (updateData.password) {
      updateData.password = await hash(updateData.password, 10);
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return formatApiResponse(updatedUser);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/users/[id] - Actualizar campos específicos de un usuario
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validar datos parciales
    const validatedData = UserUpdateSchema.partial().parse(body);

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return formatApiNotFound("Usuario no encontrado");
    }

    // Si se actualiza el email, verificar que no esté en uso
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "El email ya está en uso por otro usuario",
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Preparar datos para actualización
    const updateData = { ...validatedData };

    // Si hay una nueva contraseña, cifrarla
    if (updateData.password) {
      updateData.password = await hash(updateData.password, 10);
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return formatApiResponse(updatedUser);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/users/[id] - Eliminar un usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return formatApiNotFound("Usuario no encontrado");
    }

    // En lugar de eliminar al usuario, podríamos desactivarlo
    if (request.nextUrl.searchParams.get("softDelete") === "true") {
      await prisma.user.update({
        where: { id: params.id },
        data: { isActive: false },
      });

      return formatApiSuccess("Usuario desactivado correctamente");
    }

    // Eliminar el usuario y sus relaciones
    await prisma.user.delete({
      where: { id: params.id },
    });

    return formatApiSuccess("Usuario eliminado correctamente");
  } catch (error) {
    return handleApiError(error);
  }
}
