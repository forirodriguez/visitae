import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function handleApiError(error: unknown) {
  console.error("API Error:", error);

  // Errores de validación de Zod
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation error",
        details: error.format(),
      },
      { status: 400 }
    );
  }

  // Errores específicos de Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Error de clave única duplicada
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: "Duplicate entry",
          message: `Ya existe un registro con este ${error.meta?.target || "valor"}`,
        },
        { status: 409 }
      );
    }

    // Error de registro no encontrado
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Not found", message: "El recurso solicitado no existe" },
        { status: 404 }
      );
    }

    // Error de relación inválida
    if (error.code === "P2003") {
      return NextResponse.json(
        {
          error: "Invalid relation",
          message: "Referencia a un registro que no existe",
        },
        { status: 400 }
      );
    }
  }

  // Error genérico para todo lo demás
  return NextResponse.json(
    { error: "Internal server error", message: "Error interno del servidor" },
    { status: 500 }
  );
}
