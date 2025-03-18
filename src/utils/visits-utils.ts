// src/lib/utils/visits-utils.ts
import { Visit } from "@/types/visits";
import { Property } from "@/types/property";
import {
  fetchVisits,
  fetchVisitById,
  checkVisitConflict,
} from "@/lib/api/client/visits";

// Interfaz para visitas con datos completos de propiedad
export interface VisitWithProperty extends Visit {
  property: Property;
}

/**
 * Obtiene una visita con los datos completos de la propiedad
 * @param visitId ID de la visita
 * @returns Promise con la visita y datos de propiedad o undefined si no existe
 */
export async function getVisitWithProperty(
  visitId: string
): Promise<VisitWithProperty | undefined> {
  try {
    // Usar la función de API del cliente
    const visit = await fetchVisitById(visitId, true);
    return visit as VisitWithProperty;
  } catch (error) {
    console.error("Error al obtener visita con propiedad:", error);
    return undefined;
  }
}

/**
 * Obtiene todas las visitas con los datos completos de las propiedades
 * @returns Promise con array de visitas con datos completos de propiedades
 */
export async function getAllVisitsWithProperties(): Promise<
  VisitWithProperty[]
> {
  try {
    // Usar la función de API del cliente
    const visits = await fetchVisits();
    return visits as VisitWithProperty[];
  } catch (error) {
    console.error("Error al obtener todas las visitas con propiedades:", error);
    return [];
  }
}

/**
 * Obtiene las visitas de una propiedad específica
 * @param propertyId ID de la propiedad
 * @returns Promise con array de visitas para la propiedad especificada
 */
export async function getVisitsByPropertyId(
  propertyId: string
): Promise<Visit[]> {
  try {
    // Usar la función de API del cliente
    return await fetchVisits({ propertyId });
  } catch (error) {
    console.error(
      `Error al obtener visitas para propiedad ${propertyId}:`,
      error
    );
    return [];
  }
}

/**
 * Obtiene las propiedades con visitas pendientes o confirmadas
 * @returns Promise con array de propiedades con visitas programadas
 */
export async function getPropertiesWithScheduledVisits(): Promise<Property[]> {
  try {
    const response = await fetch("/api/properties?hasScheduledVisits=true");

    if (!response.ok) {
      throw new Error(
        `Error al obtener propiedades con visitas: ${response.statusText}`
      );
    }

    const { data } = (await response.json()) as {
      data: Property[];
      success: boolean;
    };
    return data;
  } catch (error) {
    console.error(
      "Error al obtener propiedades con visitas programadas:",
      error
    );
    return [];
  }
}

/**
 * Obtiene las visitas pendientes para una propiedad
 * @param propertyId ID de la propiedad
 * @returns Promise con array de visitas pendientes ordenadas por fecha
 */
export async function getPendingVisitsForProperty(
  propertyId: string
): Promise<Visit[]> {
  try {
    // Usar la función de API del cliente con filtros específicos
    return await fetchVisits({
      propertyId,
      status: "pendiente", // Esto puede necesitar ajustes según cómo maneje los filtros tu API
    });
  } catch (error) {
    console.error(
      `Error al obtener visitas pendientes para propiedad ${propertyId}:`,
      error
    );
    return [];
  }
}

/**
 * Verifica si una propiedad tiene visitas conflictivas en una fecha y hora específicas
 * @param propertyId ID de la propiedad
 * @param date Fecha a verificar
 * @param time Hora a verificar
 * @param excludeVisitId ID de visita a excluir (para edición)
 * @returns Promise<boolean> que indica si existe conflicto
 */
export async function hasVisitConflict(
  propertyId: string,
  date: Date,
  time: string,
  excludeVisitId?: string
): Promise<boolean> {
  try {
    // Formatear la fecha para la API (YYYY-MM-DD)
    const formattedDate = date.toISOString().split("T")[0];

    // Usar la función del cliente API
    return await checkVisitConflict(
      propertyId,
      formattedDate,
      time,
      excludeVisitId
    );
  } catch (error) {
    console.error("Error al verificar conflictos de visitas:", error);
    // En caso de error, asumimos que hay conflicto para ser conservadores
    return true;
  }
}
