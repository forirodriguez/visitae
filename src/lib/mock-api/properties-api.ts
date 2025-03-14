// src/lib/mock-api/properties-api.ts

import { Property } from "@/types/property";
import { getAllProperties, getPropertyById } from "@/lib/mock-data/properties";

// Simulamos un retraso para emular una API real
const apiDelay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Obtiene todas las propiedades
 */
export async function fetchProperties(): Promise<Property[]> {
  await apiDelay();
  return getAllProperties();
}

/**
 * Obtiene una propiedad por su ID
 */
export async function fetchPropertyById(id: string): Promise<Property | null> {
  await apiDelay();
  return getPropertyById(id);
}

/**
 * Elimina una propiedad por su ID
 */
export async function deleteProperty(id: string): Promise<boolean> {
  await apiDelay(1500); // Operaciones de eliminación suelen tardar más

  // Simulamos una eliminación exitosa
  try {
    // En una implementación real, aquí modificaríamos el estado global
    // o haríamos una llamada a la API real

    // Para simulación, simplemente devolvemos true
    console.log(`Simulando eliminación de propiedad con ID: ${id}`);

    // 90% de probabilidad de éxito, 10% de error simulado
    if (Math.random() > 0.1) {
      return true;
    } else {
      throw new Error("Error simulado al eliminar la propiedad");
    }
  } catch (error) {
    console.error("Error al eliminar la propiedad:", error);
    throw error;
  }
}

/**
 * Actualiza el estado de una propiedad
 */
export async function updatePropertyStatus(
  id: string,
  status: "borrador" | "publicada" | "destacada" | "inactiva"
): Promise<boolean> {
  await apiDelay(1000);

  try {
    console.log(`Actualizando estado de propiedad ${id} a "${status}"`);
    // En una implementación real, aquí modificaríamos el estado
    return true;
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
    throw error;
  }
}

/**
 * Actualiza si una propiedad es destacada o no
 */
export async function togglePropertyFeatured(
  id: string,
  isFeatured: boolean
): Promise<boolean> {
  await apiDelay(1000);

  try {
    console.log(`Propiedad ${id} ${isFeatured ? "destacada" : "no destacada"}`);
    return true;
  } catch (error) {
    console.error("Error al actualizar propiedad destacada:", error);
    throw error;
  }
}

/**
 * Añade una nota a una propiedad
 */
export async function addPropertyNote(
  propertyId: string,
  content: string
): Promise<{
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    avatar: string;
  };
}> {
  await apiDelay(800);

  try {
    // Generamos un ID único para la nota
    const noteId = `note-${Date.now()}`;

    // Creamos la nueva nota
    const newNote = {
      id: noteId,
      content,
      createdAt: new Date().toISOString(),
      user: {
        name: "Usuario Actual",
        avatar: "/placeholder.svg?height=40&width=40&text=UC",
      },
    };

    console.log(`Añadiendo nota a propiedad ${propertyId}:`, newNote);

    return newNote;
  } catch (error) {
    console.error("Error al añadir la nota:", error);
    throw error;
  }
}

/**
 * Visita programada para una propiedad
 */
export async function schedulePropertyVisit(
  propertyId: string,
  visitData: {
    date: string;
    time: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    notes?: string;
  }
): Promise<boolean> {
  await apiDelay(1200);

  try {
    console.log(`Programando visita para propiedad ${propertyId}:`, visitData);
    return true;
  } catch (error) {
    console.error("Error al programar la visita:", error);
    throw error;
  }
}
