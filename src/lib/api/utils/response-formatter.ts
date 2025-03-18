//src/lib/api/utils/response-formatter.ts
import { NextResponse } from "next/server";

type ApiResponseOptions = {
  status?: number;
  headers?: Record<string, string>;
};

/**
 * Formatea la respuesta de la API de manera consistente
 */
export function formatApiResponse<T>(
  data: T,
  options: ApiResponseOptions = {}
) {
  const { status = 200, headers = {} } = options;

  return NextResponse.json({ data, success: true }, { status, headers });
}

/**
 * Formatea un mensaje de éxito para operaciones sin datos de retorno
 */
export function formatApiSuccess(
  message: string = "Operación completada con éxito",
  options: ApiResponseOptions = {}
) {
  const { status = 200, headers = {} } = options;

  return NextResponse.json({ message, success: true }, { status, headers });
}

/**
 * Formatea un error de la API de manera consistente
 */
export function formatApiError(
  message: string = "Se produjo un error",
  options: ApiResponseOptions = {}
) {
  const { status = 400, headers = {} } = options;

  return NextResponse.json(
    { error: message, success: false },
    { status, headers }
  );
}

/**
 * Formatea una respuesta para recursos no encontrados
 */
export function formatApiNotFound(message: string = "Recurso no encontrado") {
  return formatApiError(message, { status: 404 });
}
