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

// Función para extraer `id` de la URL
const getUserIdFromUrl = (request: NextRequest) => {
  const urlParts = request.nextUrl.pathname.split("/");
  return urlParts[urlParts.length - 1]; // Último segmento de la URL
};

// GET /api/users/[id] - Obtener un usuario por su ID
export async function GET(request: NextRequest) {
  try {
    const id = getUserIdFromUrl(request);

    const user = await prisma.user.findUnique({
      where: { id },
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
export async function PUT(request: NextRequest) {
  try {
    const id = getUserIdFromUrl(request);
    const body = await request.json();

    const validatedData = UserUpdateSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return formatApiNotFound("Usuario no encontrado");
    }

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

    const updateData = { ...validatedData };

    if (updateData.password) {
      updateData.password = await hash(updateData.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
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
export async function PATCH(request: NextRequest) {
  try {
    const id = getUserIdFromUrl(request);
    const body = await request.json();

    const validatedData = UserUpdateSchema.partial().parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return formatApiNotFound("Usuario no encontrado");
    }

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

    const updateData = { ...validatedData };

    if (updateData.password) {
      updateData.password = await hash(updateData.password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
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
export async function DELETE(request: NextRequest) {
  try {
    const id = getUserIdFromUrl(request);

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return formatApiNotFound("Usuario no encontrado");
    }

    if (request.nextUrl.searchParams.get("softDelete") === "true") {
      await prisma.user.update({
        where: { id },
        data: { isActive: false },
      });

      return formatApiSuccess("Usuario desactivado correctamente");
    }

    await prisma.user.delete({
      where: { id },
    });

    return formatApiSuccess("Usuario eliminado correctamente");
  } catch (error) {
    return handleApiError(error);
  }
}
