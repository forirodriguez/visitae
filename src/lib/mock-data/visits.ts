// src/lib/mock-data/visits.ts
import {
  Visit,
  VisitStatus,
  WeekAvailability,
  WeekDay,
  Agent,
} from "@/types/visits";
import { mockProperties } from "@/lib/mock-data/properties";

// Definición de la disponibilidad del agente
export const defaultAgentAvailability: WeekAvailability = {
  lunes: {
    enabled: true,
    timeSlots: [
      { id: "lun-1", startTime: "09:00", endTime: "14:00" },
      { id: "lun-2", startTime: "16:00", endTime: "19:00" },
    ],
  },
  martes: {
    enabled: true,
    timeSlots: [
      { id: "mar-1", startTime: "09:00", endTime: "14:00" },
      { id: "mar-2", startTime: "16:00", endTime: "19:00" },
    ],
  },
  miercoles: {
    enabled: true,
    timeSlots: [
      { id: "mie-1", startTime: "09:00", endTime: "14:00" },
      { id: "mie-2", startTime: "16:00", endTime: "19:00" },
    ],
  },
  jueves: {
    enabled: true,
    timeSlots: [
      { id: "jue-1", startTime: "09:00", endTime: "14:00" },
      { id: "jue-2", startTime: "16:00", endTime: "19:00" },
    ],
  },
  viernes: {
    enabled: true,
    timeSlots: [
      { id: "vie-1", startTime: "09:00", endTime: "14:00" },
      { id: "vie-2", startTime: "16:00", endTime: "19:00" },
    ],
  },
  sabado: {
    enabled: true,
    timeSlots: [{ id: "sab-1", startTime: "10:00", endTime: "14:00" }],
  },
  domingo: {
    enabled: false,
    timeSlots: [],
  },
};

// Agente principal
export const mockAgent: Agent = {
  id: "agent-001",
  name: "Carlos García",
  email: "carlos@visitae.com",
  phone: "600111222",
  avatarUrl: "/placeholder.svg?height=100&width=100&text=CG",
  availability: defaultAgentAvailability,
  properties: mockProperties.map((prop) => prop.id), // El agente maneja todas las propiedades por defecto
};

// Visitas de ejemplo
export const mockVisits: Visit[] = [
  {
    id: "v1",
    date: new Date(2025, 2, 10), // 10 de marzo de 2025
    time: "10:00",
    propertyId: "prop1",
    propertyTitle: mockProperties.find((p) => p.id === "prop1")?.title || "",
    propertyImage: mockProperties.find((p) => p.id === "prop1")?.image,
    clientName: "Carlos Rodríguez",
    clientEmail: "carlos@example.com",
    clientPhone: "600123456",
    type: "presencial",
    status: "confirmada",
    agentId: "agent-001",
    notes: "Cliente interesado en compra inmediata",
  },
  {
    id: "v2",
    date: new Date(2025, 2, 10), // 10 de marzo de 2025
    time: "12:30",
    propertyId: "prop2",
    propertyTitle: mockProperties.find((p) => p.id === "prop2")?.title || "",
    propertyImage: mockProperties.find((p) => p.id === "prop2")?.image,
    clientName: "Laura Martínez",
    clientEmail: "laura@example.com",
    clientPhone: "600789012",
    type: "presencial",
    status: "pendiente",
    agentId: "agent-001",
  },
  {
    id: "v3",
    date: new Date(2025, 2, 11), // 11 de marzo de 2025
    time: "16:00",
    propertyId: "prop3",
    propertyTitle: mockProperties.find((p) => p.id === "prop3")?.title || "",
    propertyImage: mockProperties.find((p) => p.id === "prop3")?.image,
    clientName: "Miguel Sánchez",
    clientEmail: "miguel@example.com",
    clientPhone: "600345678",
    type: "videollamada",
    status: "confirmada",
    agentId: "agent-001",
    notes: "Cliente solicitó información sobre financiación",
  },
  {
    id: "v4",
    date: new Date(2025, 2, 13), // 13 de marzo de 2025
    time: "11:15",
    propertyId: "prop1",
    propertyTitle: mockProperties.find((p) => p.id === "prop1")?.title || "",
    propertyImage: mockProperties.find((p) => p.id === "prop1")?.image,
    clientName: "Ana López",
    clientEmail: "ana@example.com",
    clientPhone: "600567890",
    type: "presencial",
    status: "pendiente",
    agentId: "agent-001",
  },
  {
    id: "v5",
    date: new Date(2025, 2, 14), // 14 de marzo de 2025
    time: "15:30",
    propertyId: "prop10",
    propertyTitle: mockProperties.find((p) => p.id === "prop10")?.title || "",
    propertyImage: mockProperties.find((p) => p.id === "prop10")?.image,
    clientName: "Pedro Gómez",
    clientEmail: "pedro@example.com",
    clientPhone: "600901234",
    type: "videollamada",
    status: "cancelada",
    agentId: "agent-001",
  },
  {
    id: "v6",
    date: new Date(2025, 2, 17), // 17 de marzo de 2025
    time: "09:00",
    propertyId: "prop5",
    propertyTitle: mockProperties.find((p) => p.id === "prop5")?.title || "",
    propertyImage: mockProperties.find((p) => p.id === "prop5")?.image,
    clientName: "Elena Fernández",
    clientEmail: "elena@example.com",
    clientPhone: "600234567",
    type: "presencial",
    status: "confirmada",
    agentId: "agent-001",
  },
  {
    id: "v7",
    date: new Date(2025, 2, 17), // 17 de marzo de 2025
    time: "11:30",
    propertyId: "prop2",
    propertyTitle: mockProperties.find((p) => p.id === "prop2")?.title || "",
    propertyImage: mockProperties.find((p) => p.id === "prop2")?.image,
    clientName: "Javier Torres",
    clientEmail: "javier@example.com",
    clientPhone: "600678901",
    type: "presencial",
    status: "pendiente",
    agentId: "agent-001",
  },
  {
    id: "v8",
    date: new Date(2025, 2, 18), // 18 de marzo de 2025
    time: "14:00",
    propertyId: "prop3",
    propertyTitle: mockProperties.find((p) => p.id === "prop3")?.title || "",
    propertyImage: mockProperties.find((p) => p.id === "prop3")?.image,
    clientName: "Sofía Ramírez",
    clientEmail: "sofia@example.com",
    clientPhone: "600890123",
    type: "videollamada",
    status: "confirmada",
    agentId: "agent-001",
  },
  {
    id: "v9",
    date: new Date(2025, 2, 19), // 19 de marzo de 2025
    time: "10:45",
    propertyId: "prop8",
    propertyTitle: mockProperties.find((p) => p.id === "prop8")?.title || "",
    propertyImage: mockProperties.find((p) => p.id === "prop8")?.image,
    clientName: "Roberto Álvarez",
    clientEmail: "roberto@example.com",
    clientPhone: "600111222",
    type: "presencial",
    status: "pendiente",
    agentId: "agent-001",
    notes: "Interesado en alquiler de larga duración",
  },
  {
    id: "v10",
    date: new Date(2025, 2, 21), // 21 de marzo de 2025
    time: "17:30",
    propertyId: "prop9",
    propertyTitle: mockProperties.find((p) => p.id === "prop9")?.title || "",
    propertyImage: mockProperties.find((p) => p.id === "prop9")?.image,
    clientName: "María Carmen López",
    clientEmail: "mcarmen@example.com",
    clientPhone: "600333444",
    type: "videollamada",
    status: "pendiente",
    agentId: "agent-001",
  },
  {
    id: "v11",
    date: new Date(2025, 2, 22), // 22 de marzo de 2025
    time: "12:00",
    propertyId: "prop11",
    propertyTitle: mockProperties.find((p) => p.id === "prop11")?.title || "",
    propertyImage: mockProperties.find((p) => p.id === "prop11")?.image,
    clientName: "Alberto González",
    clientEmail: "alberto@example.com",
    clientPhone: "600555666",
    type: "presencial",
    status: "completada",
    agentId: "agent-001",
    notes: "Cliente muy satisfecho, quiere revisar opciones de contrato",
  },
  {
    id: "v12",
    date: new Date(2025, 2, 22), // 22 de marzo de 2025
    time: "16:15",
    propertyId: "prop6",
    propertyTitle: mockProperties.find((p) => p.id === "prop6")?.title || "",
    propertyImage: mockProperties.find((p) => p.id === "prop6")?.image,
    clientName: "Lucía Martín",
    clientEmail: "lucia@example.com",
    clientPhone: "600777888",
    type: "videollamada",
    status: "confirmada",
    agentId: "agent-001",
  },
];

// Función auxiliar para comprobar si un horario encaja en la disponibilidad del agente
export function isWithinAgentAvailability(
  date: Date,
  time: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _agentId: string = "agent-001"
): boolean {
  // Convertir día de la semana a formato de clave para WeekAvailability
  const weekDays: WeekDay[] = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ];
  const dayIndex = date.getDay();
  const dayKey = weekDays[dayIndex];

  // Comprobar si el día está habilitado en la disponibilidad del agente
  const agentAvailability = mockAgent.availability;
  const dayAvailability = agentAvailability[dayKey];

  if (!dayAvailability.enabled) {
    return false;
  }

  // Extraer hora de la visita para comparar
  const visitHour = parseInt(time.split(":")[0]);
  const visitMinute = parseInt(time.split(":")[1]);

  // Comprobar si el horario cae dentro de alguna franja disponible
  return dayAvailability.timeSlots.some((slot) => {
    const startHour = parseInt(slot.startTime.split(":")[0]);
    const startMinute = parseInt(slot.startTime.split(":")[1]);
    const endHour = parseInt(slot.endTime.split(":")[0]);
    const endMinute = parseInt(slot.endTime.split(":")[1]);

    const visitTimeInMinutes = visitHour * 60 + visitMinute;
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    return (
      visitTimeInMinutes >= startTimeInMinutes &&
      visitTimeInMinutes < endTimeInMinutes
    );
  });
}

// Función para filtrar visitas por propiedad
export function getVisitsByProperty(propertyId: string): Visit[] {
  return mockVisits.filter((visit) => visit.propertyId === propertyId);
}

// Función para filtrar visitas por estado
export function getVisitsByStatus(status: VisitStatus): Visit[] {
  return mockVisits.filter((visit) => visit.status === status);
}

// Función para filtrar visitas por rango de fechas
export function getVisitsByDateRange(startDate: Date, endDate: Date): Visit[] {
  return mockVisits.filter(
    (visit) => visit.date >= startDate && visit.date <= endDate
  );
}

// Función para ordenar visitas por fecha y hora
export function sortVisitsByDateTime(visits: Visit[]): Visit[] {
  return [...visits].sort((a, b) => {
    const dateComparison = a.date.getTime() - b.date.getTime();
    if (dateComparison !== 0) return dateComparison;

    const timeA =
      parseInt(a.time.split(":")[0]) * 60 + parseInt(a.time.split(":")[1]);
    const timeB =
      parseInt(b.time.split(":")[0]) * 60 + parseInt(b.time.split(":")[1]);
    return timeA - timeB;
  });
}

// Función para obtener las próximas visitas (cantidad limitada)
export function getUpcomingVisits(limit: number = 5): Visit[] {
  const today = new Date();
  const upcomingVisits = mockVisits.filter(
    (visit) =>
      visit.date >= today && ["pendiente", "confirmada"].includes(visit.status)
  );

  return sortVisitsByDateTime(upcomingVisits).slice(0, limit);
}

// Función para obtener estadísticas de visitas
export function getVisitStats() {
  const pendingCount = mockVisits.filter(
    (v) => v.status === "pendiente"
  ).length;
  const confirmedCount = mockVisits.filter(
    (v) => v.status === "confirmada"
  ).length;
  const completedCount = mockVisits.filter(
    (v) => v.status === "completada"
  ).length;
  const canceledCount = mockVisits.filter(
    (v) => v.status === "cancelada"
  ).length;

  const totalVisits = mockVisits.length;
  const presentialCount = mockVisits.filter(
    (v) => v.type === "presencial"
  ).length;
  const videoCount = mockVisits.filter((v) => v.type === "videollamada").length;

  return {
    byStatus: {
      pendiente: pendingCount,
      confirmada: confirmedCount,
      completada: completedCount,
      cancelada: canceledCount,
      total: totalVisits,
    },
    byType: {
      presencial: presentialCount,
      videollamada: videoCount,
    },
    conversion: {
      ratio:
        completedCount > 0
          ? ((completedCount / totalVisits) * 100).toFixed(1)
          : 0,
    },
  };
}

// Función para obtener una visita por su ID
export function getVisitById(visitId: string): Visit | undefined {
  return mockVisits.find((visit) => visit.id === visitId);
}
export { mockProperties };
