"use client";

import { useState } from "react";
import { Calendar, Clock, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ScheduleDay } from "./schedule-day";
import { ScheduleSummary } from "./schedule-summary";
import { toast } from "sonner";

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

// Tipo de vista
type ViewMode = "config" | "summary";

export default function AvailabilityScheduler() {
  // Estado para controlar la vista actual
  const [viewMode, setViewMode] = useState<ViewMode>("config");

  // Estado inicial para la semana
  const [schedule, setSchedule] = useState<WeekSchedule>({
    lunes: { enabled: true, slots: [] },
    martes: { enabled: true, slots: [] },
    miercoles: { enabled: true, slots: [] },
    jueves: { enabled: true, slots: [] },
    viernes: { enabled: true, slots: [] },
    sabado: { enabled: false, slots: [] },
    domingo: { enabled: false, slots: [] },
  });

  // Estado para la pestaña activa
  const [activeDay, setActiveDay] = useState("lunes");

  // Obtener la lista de días
  const allDays = Object.keys(schedule);

  // Función para actualizar la disponibilidad de un día
  const updateDaySchedule = (day: string, daySchedule: DaySchedule) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: daySchedule,
    }));
  };

  // Función para copiar el horario de un día a otros
  const copyToOtherDays = (fromDay: string, toDays: string[]) => {
    const updatedSchedule = { ...schedule };

    // Para cada día seleccionado, copiamos los slots del día origen
    toDays.forEach((toDay) => {
      updatedSchedule[toDay] = {
        ...updatedSchedule[toDay],
        slots: [...schedule[fromDay].slots],
      };
    });

    setSchedule(updatedSchedule);

    toast.success("Horario copiado", {
      description: `El horario de ${fromDay} ha sido copiado a ${toDays.length} día(s).`,
    });
  };

  // Función para guardar la disponibilidad
  const saveAvailability = () => {
    console.log("Guardando disponibilidad:", schedule);
    toast.success("Disponibilidad guardada", {
      description: "Tu horario ha sido actualizado correctamente.",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Configuración de Disponibilidad
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "config" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("config")}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Disponibilidad
            </Button>
            <Button
              variant={viewMode === "summary" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("summary")}
              className="gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Resumen
            </Button>
          </div>
        </div>
        <CardDescription>
          {viewMode === "config"
            ? "Indica los días y horarios en los que estarás disponible para atender a los clientes."
            : "Visualiza un resumen de tu disponibilidad semanal."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {viewMode === "config" ? (
          <Tabs
            value={activeDay}
            onValueChange={setActiveDay}
            className="w-full"
          >
            <TabsList className="grid grid-cols-7 mb-4">
              {Object.keys(schedule).map((day) => (
                <TabsTrigger
                  key={day}
                  value={day}
                  className={!schedule[day].enabled ? "opacity-50" : ""}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(schedule).map(([day, daySchedule]) => (
              <TabsContent key={day} value={day}>
                <ScheduleDay
                  day={day}
                  schedule={daySchedule}
                  allDays={allDays}
                  onChange={(updatedSchedule) =>
                    updateDaySchedule(day, updatedSchedule)
                  }
                  onCopyToOtherDays={copyToOtherDays}
                />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <ScheduleSummary schedule={schedule} />
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm">Presencial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm">Videollamada</span>
          </div>
        </div>
        <Button onClick={saveAvailability} className="gap-2">
          <Clock className="h-4 w-4" />
          Guardar Disponibilidad
        </Button>
      </CardFooter>
    </Card>
  );
}
