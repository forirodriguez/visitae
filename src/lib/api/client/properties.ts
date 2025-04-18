// src/lib/api/client/properties.ts
import { Property, PropertyFilter } from "@/types/property";

// Función para obtener todas las propiedades con filtros opcionales
export async function fetchProperties(
  filters?: PropertyFilter
): Promise<Property[]> {
  try {
    // Construir parámetros de consulta desde los filtros
    const params = new URLSearchParams();

    if (filters?.type) params.append("type", filters.type);
    if (filters?.minPrice !== undefined)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.minBedrooms !== undefined)
      params.append("minBedrooms", filters.minBedrooms.toString());
    if (filters?.location) params.append("location", filters.location);
    if (filters?.keyword) params.append("keyword", filters.keyword);

    // Realizar la solicitud al endpoint
    const response = await fetch(`/api/properties?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Error al obtener propiedades");
    }

    const data = await response.json();
    return data.data; // Asumiendo que la respuesta tiene una propiedad "data"
  } catch (error) {
    console.error("Error en fetchProperties:", error);
    throw error;
  }
}

// Función para obtener una propiedad por ID
export async function fetchPropertyById(id: string): Promise<Property> {
  const response = await fetch(`/api/properties/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener la propiedad");
  }

  const data = await response.json();
  return data.data;
}

// Función para crear una nueva propiedad
export async function createProperty(
  propertyData: Omit<Property, "id">
): Promise<Property> {
  const response = await fetch("/api/properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(propertyData),
  });

  if (!response.ok) {
    throw new Error("Error al crear la propiedad");
  }

  const data = await response.json();
  return data.data;
}

// Función para actualizar una propiedad existente
export async function updateProperty(
  id: string,
  propertyData: Partial<Property>
): Promise<Property> {
  const response = await fetch(`/api/properties/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(propertyData),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar la propiedad");
  }

  const data = await response.json();
  return data.data;
}

// Función para eliminar una propiedad
export async function deleteProperty(id: string): Promise<boolean> {
  const response = await fetch(`/api/properties/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar la propiedad");
  }

  return true;
}

// Función para actualizar el estado de una propiedad
export async function updatePropertyStatus(
  id: string,
  status: "borrador" | "publicada" | "destacada" | "inactiva"
): Promise<Property> {
  const response = await fetch(`/api/properties/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el estado de la propiedad");
  }

  const data = await response.json();
  return data.data;
}

// Función para marcar/desmarcar una propiedad como destacada
export async function togglePropertyFeatured(
  id: string,
  isFeatured: boolean
): Promise<Property> {
  const response = await fetch(`/api/properties/${id}/featured`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isFeatured }),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el estado destacado de la propiedad");
  }

  const data = await response.json();
  return data.data;
}

// Función para añadir una nota a una propiedad
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
  const response = await fetch(`/api/properties/${propertyId}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("Error al añadir nota a la propiedad");
  }

  const data = await response.json();
  return data.data;
}
