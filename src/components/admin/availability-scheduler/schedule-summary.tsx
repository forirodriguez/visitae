import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";

// Tipos para nuestros datos
type AppointmentType = "presencial" | "videollamada";
type DaySchedule = {
  enabled: boolean;
  slots: {
    start: string;
    end: string;
    type: AppointmentType;
  }[];
};

type WeekSchedule = {
  [key: string]: DaySchedule;
};

type ScheduleSummaryProps = {
  schedule: WeekSchedule;
};

export function ScheduleSummary({ schedule }: ScheduleSummaryProps) {
  // Función para formatear el nombre del día
  const formatDayName = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  // Ordenar los días de la semana (lunes primero)
  const orderedDays = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-muted text-left">Día</th>
                  <th className="border p-2 bg-muted text-left">Estado</th>
                  <th className="border p-2 bg-muted text-left">Horarios</th>
                </tr>
              </thead>
              <tbody>
                {orderedDays.map((day) => (
                  <tr key={day}>
                    <td className="border p-2 font-medium">
                      {formatDayName(day)}
                    </td>
                    <td className="border p-2">
                      {schedule[day].enabled ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Habilitado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          No disponible
                        </span>
                      )}
                    </td>
                    <td className="border p-2">
                      {schedule[day].enabled ? (
                        schedule[day].slots.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {schedule[day].slots.map((slot, index) => (
                              <div
                                key={index}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                                  slot.type === "presencial"
                                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                                    : "bg-green-50 text-green-700 border-l-4 border-green-500"
                                }`}
                              >
                                {slot.type === "videollamada" && (
                                  <Video className="h-3 w-3" />
                                )}
                                <span>
                                  {slot.start} - {slot.end}
                                </span>
                                <span className="text-xs ml-auto">
                                  {slot.type === "presencial"
                                    ? "Presencial"
                                    : "Videollamada"}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Sin horarios configurados
                          </span>
                        )
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No disponible
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">
              Resumen de disponibilidad
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  Atención Presencial
                </h4>
                <div className="space-y-1 text-sm">
                  {orderedDays.some(
                    (day) =>
                      schedule[day].enabled &&
                      schedule[day].slots.some(
                        (slot) => slot.type === "presencial"
                      )
                  ) ? (
                    orderedDays.map((day) => {
                      const presencialSlots = schedule[day].enabled
                        ? schedule[day].slots.filter(
                            (slot) => slot.type === "presencial"
                          )
                        : [];

                      return presencialSlots.length > 0 ? (
                        <div key={day} className="flex items-center">
                          <span className="font-medium w-24">
                            {formatDayName(day)}:
                          </span>
                          <span>
                            {presencialSlots.map((slot, i) => (
                              <span key={i}>
                                {slot.start}-{slot.end}
                                {i < presencialSlots.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </span>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <p className="text-muted-foreground">
                      No hay horarios configurados para atención presencial
                    </p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <Video className="h-3 w-3" />
                  Atención por Videollamada
                </h4>
                <div className="space-y-1 text-sm">
                  {orderedDays.some(
                    (day) =>
                      schedule[day].enabled &&
                      schedule[day].slots.some(
                        (slot) => slot.type === "videollamada"
                      )
                  ) ? (
                    orderedDays.map((day) => {
                      const videoSlots = schedule[day].enabled
                        ? schedule[day].slots.filter(
                            (slot) => slot.type === "videollamada"
                          )
                        : [];

                      return videoSlots.length > 0 ? (
                        <div key={day} className="flex items-center">
                          <span className="font-medium w-24">
                            {formatDayName(day)}:
                          </span>
                          <span>
                            {videoSlots.map((slot, i) => (
                              <span key={i}>
                                {slot.start}-{slot.end}
                                {i < videoSlots.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </span>
                        </div>
                      ) : null;
                    })
                  ) : (
                    <p className="text-muted-foreground">
                      No hay horarios configurados para videollamadas
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
