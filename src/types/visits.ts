// src/types/visits.ts
import { Property } from "@/types/property";

// Tipo de visita: presencial o videollamada
export type VisitType = "presencial" | "videollamada";

// Estados posibles de una visita
export type VisitStatus =
  | "pendiente"
  | "confirmada"
  | "cancelada"
  | "completada";

// Interfaz principal para las visitas
export interface Visit {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: Date;
  time: string;
  type: VisitType; // Tipo de visita: presencial o videollamada
  status: VisitStatus;
  agentId?: string; // ID del agente asignado
  notes?: string;
}

// Información relacionada con la disponibilidad semanal del agente
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface DayAvailability {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

export type WeekDay =
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado"
  | "domingo";

export type WeekAvailability = {
  [key in WeekDay]: DayAvailability;
};

// Agente inmobiliario
export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  availability: WeekAvailability;
  properties?: string[]; // IDs de propiedades asignadas
}

// Función de utilidad para convertir Property a datos de visita
export function propertyToVisitProperty(property: Property): {
  propertyId: string;
  propertyTitle: string;
  propertyImage?: string;
} {
  return {
    propertyId: property.id,
    propertyTitle: property.title,
    propertyImage: property.image,
  };
}
