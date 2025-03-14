import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import {
  formatApiResponse,
  formatApiNotFound,
} from "@/lib/api/utils/response-formatter";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth/config";
import { z } from "zod";
import { hash, compare } from "bcrypt";

// Esquema para actualizar el perfil del usuario actual
const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),
  phone: z.string().optional().nullable(),
  avatarUrl: z.string().url("URL de avatar inválida").optional().nullable(),
});

// Esquema para cambiar la contraseña
const ChangePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z
    .string()
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
});

// GET /api/users/me - Obtener usuario actual
export async function GET() {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No autenticado",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
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

    if (!user) {
      return formatApiNotFound("Usuario no encontrado");
    }

    return formatApiResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/users/me - Actualizar perfil del usuario actual
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No autenticado",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verificar que el usuario existe en la base de datos
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!existingUser) {
      return formatApiNotFound("Usuario no encontrado");
    }

    const body = await request.json();

    // Determinar si es una actualización de perfil o cambio de contraseña
    if (body.currentPassword && body.newPassword) {
      // Cambio de contraseña
      const validatedData = ChangePasswordSchema.parse(body);

      // Verificar contraseña actual
      const passwordValid = await compare(
        validatedData.currentPassword,
        existingUser.password || ""
      );

      if (!passwordValid) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Contraseña actual incorrecta",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Actualizar contraseña
      const hashedPassword = await hash(validatedData.newPassword, 10);

      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
      });

      return formatApiResponse({
        success: true,
        message: "Contraseña actualizada correctamente",
      });
    } else {
      // Actualización de perfil
      const validatedData = UpdateProfileSchema.parse(body);

      // Actualizar datos del perfil
      const updatedUser = await prisma.user.update({
        where: { id: session.user.id },
        data: validatedData,
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
    }
  } catch (error) {
    return handleApiError(error);
  }
}
