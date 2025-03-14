import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/client";
import { handleApiError } from "@/lib/api/utils/error-handler";
import { formatApiResponse } from "@/lib/api/utils/response-formatter";
import { z } from "zod";
import { hash } from "bcrypt";

// Esquema para validar la creación de usuarios
const UserCreateSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  phone: z.string().optional(),
  avatarUrl: z.string().url("URL de avatar inválida").optional(),
  role: z.enum(["admin", "superadmin", "agent", "client"], {
    errorMap: () => ({ message: "Rol no válido" }),
  }),
});

// GET /api/users - Obtener usuarios con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parámetros de búsqueda
    const role = searchParams.get("role");
    const isActive = searchParams.has("isActive")
      ? searchParams.get("isActive") === "true"
      : undefined;
    const search = searchParams.get("search");

    // Construir la consulta
    const users = await prisma.user.findMany({
      where: {
        ...(role && { role }),
        ...(isActive !== undefined && { isActive }),
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
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Excluimos la contraseña por seguridad
      },
      orderBy: {
        name: "asc",
      },
    });

    return formatApiResponse(users);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/users - Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos
    const validatedData = UserCreateSchema.parse(body);

    // Verificar si el email ya está en uso
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "El email ya está registrado",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Cifrar la contraseña
    const hashedPassword = await hash(validatedData.password, 10);

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      },
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

    return formatApiResponse(user, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
