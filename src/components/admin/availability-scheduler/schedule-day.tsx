"use client";
import { useState } from "react";
import { Plus, Trash2, Video, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

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

type ScheduleDayProps = {
  day: string;
  schedule: DaySchedule;
  allDays: string[];
  onChange: (schedule: DaySchedule) => void;
  onCopyToOtherDays: (fromDay: string, toDays: string[]) => void;
};

// Opciones de horarios disponibles
const timeOptions = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

export function ScheduleDay({
  day,
  schedule,
  allDays,
  onChange,
  onCopyToOtherDays,
}: ScheduleDayProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Función para manejar la selección de días
  const handleDaySelection = (dayName: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayName)
        ? prev.filter((d) => d !== dayName)
        : [...prev, dayName]
    );
  };

  // Función para copiar el horario a los días seleccionados
  const handleCopySchedule = () => {
    if (selectedDays.length > 0) {
      onCopyToOtherDays(day, selectedDays);
      setDialogOpen(false);
      setSelectedDays([]);
    }
  };

  // Función para cambiar el estado de habilitado/deshabilitado del día
  const toggleDayEnabled = () => {
    onChange({
      ...schedule,
      enabled: !schedule.enabled,
    });
  };

  // Función para agregar un nuevo horario
  const addTimeSlot = () => {
    onChange({
      ...schedule,
      slots: [
        ...schedule.slots,
        { start: "09:00", end: "10:00", type: "presencial" },
      ],
    });
  };

  // Función para eliminar un horario
  const removeTimeSlot = (index: number) => {
    const newSlots = [...schedule.slots];
    newSlots.splice(index, 1);
    onChange({
      ...schedule,
      slots: newSlots,
    });
  };

  // Función para actualizar un horario
  const updateTimeSlot = (index: number, field: string, value: string) => {
    const newSlots = [...schedule.slots];
    newSlots[index] = {
      ...newSlots[index],
      [field]: value,
    };

    // Si el horario de inicio es mayor que el de fin, ajustamos el de fin
    if (
      field === "start" &&
      timeOptions.indexOf(value) >= timeOptions.indexOf(newSlots[index].end)
    ) {
      const endIndex = Math.min(
        timeOptions.indexOf(value) + 2,
        timeOptions.length - 1
      );
      newSlots[index].end = timeOptions[endIndex];
    }

    onChange({
      ...schedule,
      slots: newSlots,
    });
  };

  const dayName = day.charAt(0).toUpperCase() + day.slice(1);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Switch
              id={`${day}-toggle`}
              checked={schedule.enabled}
              onCheckedChange={toggleDayEnabled}
            />
            <Label htmlFor={`${day}-toggle`} className="text-lg font-medium">
              {dayName}
            </Label>
          </div>

          {schedule.enabled && (
            <div className="flex gap-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Copy className="h-4 w-4" />
                    Copiar a otros días
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Copiar horario a otros días</DialogTitle>
                    <DialogDescription>
                      Selecciona los días a los que quieres copiar el horario de{" "}
                      {dayName}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    {allDays
                      .filter((d) => d !== day)
                      .map((otherDay) => (
                        <div
                          key={otherDay}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`copy-${otherDay}`}
                            checked={selectedDays.includes(otherDay)}
                            onCheckedChange={() => handleDaySelection(otherDay)}
                          />
                          <Label htmlFor={`copy-${otherDay}`}>
                            {otherDay.charAt(0).toUpperCase() +
                              otherDay.slice(1)}
                          </Label>
                        </div>
                      ))}
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleCopySchedule}
                      disabled={selectedDays.length === 0}
                    >
                      Copiar horario
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                onClick={addTimeSlot}
                variant="outline"
                size="sm"
                className="gap-1"
              >
                <Plus className="h-4 w-4" />
                Agregar horario
              </Button>
            </div>
          )}
        </div>

        {!schedule.enabled ? (
          <div className="text-center py-8 text-muted-foreground">
            Este día no está habilitado para atención
          </div>
        ) : schedule.slots.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay horarios configurados. Agrega un horario para comenzar.
          </div>
        ) : (
          <div className="space-y-4">
            {schedule.slots.map((slot, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center"
              >
                <Select
                  value={slot.start}
                  onValueChange={(value) =>
                    updateTimeSlot(index, "start", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Inicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={slot.end}
                  onValueChange={(value) => updateTimeSlot(index, "end", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Fin" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions
                      .filter(
                        (time) =>
                          timeOptions.indexOf(time) >
                          timeOptions.indexOf(slot.start)
                      )
                      .map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Select
                  value={slot.type}
                  onValueChange={(value) =>
                    updateTimeSlot(index, "type", value as AppointmentType)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="presencial">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        Presencial
                      </div>
                    </SelectItem>
                    <SelectItem value="videollamada">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <Video className="h-3 w-3" />
                        Videollamada
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTimeSlot(index)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
