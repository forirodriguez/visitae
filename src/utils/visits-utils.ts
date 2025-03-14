// src/lib/utils/visits-utils.ts
import { Visit } from "@/types/visits";
import { Property } from "@/types/property";
import { mockVisits } from "@/lib/mock-data/visits";
import { mockProperties } from "@/lib/mock-data/properties";

// Interfaz para visitas con datos completos de propiedad
export interface VisitWithProperty extends Visit {
  property: Property;
}

/**
 * Obtiene una visita con los datos completos de la propiedad
 * @param visitId ID de la visita
 * @returns Visita con datos completos de propiedad o undefined si no existe
 */
export function getVisitWithProperty(
  visitId: string
): VisitWithProperty | undefined {
  const visit = mockVisits.find((v) => v.id === visitId);
  if (!visit) return undefined;

  const property = mockProperties.find((p) => p.id === visit.propertyId);
  if (!property) return undefined;

  return {
    ...visit,
    property,
  };
}

/**
 * Obtiene todas las visitas con los datos completos de las propiedades
 * @returns Array de visitas con datos completos de propiedades
 */
export function getAllVisitsWithProperties(): VisitWithProperty[] {
  return mockVisits
    .map((visit) => {
      const property = mockProperties.find((p) => p.id === visit.propertyId);
      if (!property) return null;

      return {
        ...visit,
        property,
      };
    })
    .filter((visit): visit is VisitWithProperty => visit !== null);
}

/**
 * Obtiene las visitas de una propiedad específica
 * @param propertyId ID de la propiedad
 * @returns Array de visitas para la propiedad especificada
 */
export function getVisitsByPropertyId(propertyId: string): Visit[] {
  return mockVisits.filter((visit) => visit.propertyId === propertyId);
}

/**
 * Obtiene las propiedades con visitas pendientes o confirmadas
 * @returns Array de propiedades con visitas programadas
 */
export function getPropertiesWithScheduledVisits(): Property[] {
  // Obtener IDs únicos de propiedades con visitas pendientes o confirmadas
  const propertyIds = new Set(
    mockVisits
      .filter((visit) => ["pendiente", "confirmada"].includes(visit.status))
      .map((visit) => visit.propertyId)
  );

  // Obtener propiedades completas
  return mockProperties.filter((property) => propertyIds.has(property.id));
}

/**
 * Obtiene las visitas pendientes para una propiedad
 * @param propertyId ID de la propiedad
 * @returns Array de visitas pendientes ordenadas por fecha
 */
export function getPendingVisitsForProperty(propertyId: string): Visit[] {
  const pendingVisits = mockVisits.filter(
    (visit) =>
      visit.propertyId === propertyId &&
      ["pendiente", "confirmada"].includes(visit.status)
  );

  // Ordenar por fecha y hora
  return pendingVisits.sort((a, b) => {
    const dateA = a.date.getTime();
    const dateB = b.date.getTime();
    if (dateA !== dateB) return dateA - dateB;

    // Si la fecha es la misma, ordenar por hora
    const timeA =
      parseInt(a.time.split(":")[0]) * 60 + parseInt(a.time.split(":")[1]);
    const timeB =
      parseInt(b.time.split(":")[0]) * 60 + parseInt(b.time.split(":")[1]);
    return timeA - timeB;
  });
}

/**
 * Verifica si una propiedad tiene visitas conflictivas en una fecha y hora específicas
 * @param propertyId ID de la propiedad
 * @param date Fecha a verificar
 * @param time Hora a verificar
 * @param excludeVisitId ID de visita a excluir (para edición)
 * @returns true si existe conflicto, false si no hay conflicto
 */
export function hasVisitConflict(
  propertyId: string,
  date: Date,
  time: string,
  excludeVisitId?: string
): boolean {
  // Convertir la fecha a fecha simple sin la parte de tiempo
  const dateToCheck = new Date(date.setHours(0, 0, 0, 0));

  // Buscar visitas para la misma propiedad, en la misma fecha
  const visitsOnSameDay = mockVisits.filter(
    (visit) =>
      visit.propertyId === propertyId &&
      visit.date.getDate() === dateToCheck.getDate() &&
      visit.date.getMonth() === dateToCheck.getMonth() &&
      visit.date.getFullYear() === dateToCheck.getFullYear() &&
      ["pendiente", "confirmada"].includes(visit.status) &&
      (excludeVisitId ? visit.id !== excludeVisitId : true)
  );

  // Verificar conflictos de tiempo (considerando que una visita dura aproximadamente 1 hora)
  return visitsOnSameDay.some((visit) => {
    const existingHour = parseInt(visit.time.split(":")[0]);
    const existingMinute = parseInt(visit.time.split(":")[1]);
    const newHour = parseInt(time.split(":")[0]);
    const newMinute = parseInt(time.split(":")[1]);

    // Convertir a minutos para facilitar comparación
    const existingTimeInMinutes = existingHour * 60 + existingMinute;
    const newTimeInMinutes = newHour * 60 + newMinute;

    // Verificar si hay menos de 60 minutos entre las visitas
    return Math.abs(existingTimeInMinutes - newTimeInMinutes) < 60;
  });
}
