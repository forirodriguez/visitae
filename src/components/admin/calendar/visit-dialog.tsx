"use client";

import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Visit, VisitStatus, VisitType } from "@/types/visits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SimpleDatePicker from "@/components/admin/calendar/simple-day-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Datos de ejemplo - reemplazar con tus propios datos o lógica
const mockAgents = [
  { id: "agent1", name: "Carlos Rodríguez" },
  { id: "agent2", name: "Ana Martínez" },
];

const mockProperties = [
  {
    id: "prop1",
    title: "Apartamento de lujo con vistas al mar",
    image: "/placeholder.svg?height=60&width=80&text=P1",
  },
  {
    id: "prop2",
    title: "Casa adosada con jardín privado",
    image: "/placeholder.svg?height=60&width=80&text=P2",
  },
];

interface VisitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  existingVisit?: Visit | null;
  onSave?: (visit: Visit) => void;
}

export default function VisitDialog({
  open,
  onOpenChange,
  selectedDate,
  existingVisit,
  onSave,
}: VisitDialogProps) {
  // Estado inicial para una nueva visita - usando useMemo para evitar recrearlo en cada render
  const initialVisitState = useMemo(
    () => ({
      propertyId: "",
      propertyTitle: "",
      propertyImage: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      date: selectedDate,
      time: "10:00",
      type: "presencial" as VisitType,
      status: "pendiente" as VisitStatus,
      agentId: mockAgents.length > 0 ? mockAgents[0].id : "",
      notes: "",
    }),
    [selectedDate]
  ); // Solo depende de selectedDate

  // Estado del formulario
  const [formData, setFormData] = useState<Omit<Visit, "id"> & { id?: string }>(
    initialVisitState
  );

  // Estado para errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Actualizar el formulario cuando cambia la visita existente o fecha seleccionada
  useEffect(() => {
    if (existingVisit) {
      setFormData({
        ...existingVisit,
      });
    } else {
      setFormData({
        ...initialVisitState,
        date: selectedDate,
      });
    }
    setErrors({});
  }, [existingVisit, selectedDate, open, initialVisitState]);

  // Actualizar título y propiedades cuando cambia la selección de propiedad
  useEffect(() => {
    if (formData.propertyId) {
      const selectedProperty = mockProperties.find(
        (p) => p.id === formData.propertyId
      );
      if (selectedProperty) {
        setFormData((prev) => ({
          ...prev,
          propertyTitle: selectedProperty.title,
          propertyImage: selectedProperty.image,
        }));
      }
    }
  }, [formData.propertyId]);

  // Manejar cambios en el formulario
  const handleChange = (
    field: keyof typeof formData,
    value: string | Date | VisitType | VisitStatus
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar error para el campo modificado
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validar el formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.propertyId) {
      newErrors.propertyId = "Selecciona una propiedad";
    }

    if (!formData.clientName) {
      newErrors.clientName = "El nombre del cliente es obligatorio";
    }

    if (!formData.clientEmail) {
      newErrors.clientEmail = "El email del cliente es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = "Email no válido";
    }

    if (!formData.clientPhone) {
      newErrors.clientPhone = "El teléfono del cliente es obligatorio";
    }

    if (!formData.agentId) {
      newErrors.agentId = "Selecciona un agente";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Generar ID para nuevas visitas
      const visitToSave: Visit = {
        ...(formData as Omit<Visit, "id">),
        id: formData.id || `visit-${Date.now()}`,
      };

      // Llamar al callback onSave si existe
      if (onSave) {
        await onSave(visitToSave);
      } else {
        // Si no hay callback, simplemente cerrar el diálogo
        console.log("Visita guardada (simulación):", visitToSave);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error al guardar la visita:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Opciones de horas (cada 30 minutos de 8:00 a 20:00)
  const timeOptions = Array.from({ length: 25 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingVisit ? "Editar visita" : "Programar nueva visita"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sección Propiedad */}
          <div className="space-y-2">
            <Label htmlFor="propertyId">
              Propiedad <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.propertyId}
              onValueChange={(value) => handleChange("propertyId", value)}
            >
              <SelectTrigger
                id="propertyId"
                className={errors.propertyId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecciona una propiedad" />
              </SelectTrigger>
              <SelectContent>
                {mockProperties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.propertyId && (
              <p className="text-sm text-red-500">{errors.propertyId}</p>
            )}
          </div>

          {/* Sección Cliente */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Información del cliente
            </h3>

            <div className="space-y-2">
              <Label htmlFor="clientName">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleChange("clientName", e.target.value)}
                className={errors.clientName ? "border-red-500" : ""}
              />
              {errors.clientName && (
                <p className="text-sm text-red-500">{errors.clientName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleChange("clientEmail", e.target.value)}
                className={errors.clientEmail ? "border-red-500" : ""}
              />
              {errors.clientEmail && (
                <p className="text-sm text-red-500">{errors.clientEmail}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">
                Teléfono <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => handleChange("clientPhone", e.target.value)}
                className={errors.clientPhone ? "border-red-500" : ""}
              />
              {errors.clientPhone && (
                <p className="text-sm text-red-500">{errors.clientPhone}</p>
              )}
            </div>
          </div>

          {/* Sección Fecha y Hora */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Fecha y hora
            </h3>

            <div className="space-y-2">
              <Label htmlFor="date">
                Fecha <span className="text-red-500">*</span>
              </Label>
              <Popover
                open={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(formData.date, "PP", { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <SimpleDatePicker
                    selected={formData.date}
                    onSelect={(date: string | Date) => {
                      handleChange("date", date);
                      setIsDatePickerOpen(false);
                    }}
                    disabled={(date: Date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">
                Hora <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.time}
                onValueChange={(value) => handleChange("time", value)}
              >
                <SelectTrigger id="time">
                  <SelectValue placeholder="Selecciona una hora" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sección Tipo de Visita */}
          <div className="space-y-2">
            <Label>
              Tipo de visita <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value: VisitType) => handleChange("type", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="presencial" id="presencial" />
                <Label htmlFor="presencial" className="font-normal">
                  Presencial
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="videollamada" id="videollamada" />
                <Label htmlFor="videollamada" className="font-normal">
                  Videollamada
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Sección Agente */}
          <div className="space-y-2">
            <Label htmlFor="agentId">
              Agente asignado <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.agentId}
              onValueChange={(value) => handleChange("agentId", value)}
            >
              <SelectTrigger
                id="agentId"
                className={errors.agentId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecciona un agente" />
              </SelectTrigger>
              <SelectContent>
                {mockAgents.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.agentId && (
              <p className="text-sm text-red-500">{errors.agentId}</p>
            )}
          </div>

          {/* Sección Estado (solo para edición) */}
          {existingVisit && (
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value: VisitStatus) =>
                  handleChange("status", value)
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Añade información adicional sobre la visita..."
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              {isSubmitting
                ? "Guardando..."
                : existingVisit
                  ? "Actualizar"
                  : "Programar visita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
