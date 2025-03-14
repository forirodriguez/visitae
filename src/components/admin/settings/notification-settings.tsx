// src/components/admin/settings/notification-settings.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, MessageSquare, Calendar, Save } from "lucide-react";
import { toast } from "sonner";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  icon: React.ReactNode;
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "new-visit",
      title: "Nueva visita programada",
      description: "Recibe notificaciones cuando un cliente agenda una visita",
      email: true,
      push: true,
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      id: "visit-reminder",
      title: "Recordatorio de visitas",
      description: "Recibe recordatorios antes de las visitas programadas",
      email: true,
      push: true,
      icon: <Bell className="h-5 w-5" />,
    },
    {
      id: "visit-cancelled",
      title: "Visita cancelada",
      description: "Recibe notificaciones cuando un cliente cancela una visita",
      email: true,
      push: true,
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      id: "new-message",
      title: "Nuevos mensajes",
      description:
        "Recibe notificaciones cuando un cliente te envía un mensaje",
      email: true,
      push: true,
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      id: "property-interest",
      title: "Interés en propiedad",
      description:
        "Recibe notificaciones cuando un cliente muestra interés en una propiedad",
      email: true,
      push: false,
      icon: <Mail className="h-5 w-5" />,
    },
  ]);

  const toggleSetting = (id: string, channel: "email" | "push") => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id
          ? { ...setting, [channel]: !setting[channel] }
          : setting
      )
    );
  };

  const handleSaveSettings = () => {
    // En una aplicación real, aquí se enviarían los datos al servidor
    toast.success("Preferencias guardadas", {
      description: "Tus preferencias de notificación se han actualizado.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Preferencias de notificación</CardTitle>
            <CardDescription>
              Elige cómo y cuándo quieres recibir notificaciones
            </CardDescription>
          </div>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" /> Guardar cambios
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-2">Tipo de notificación</div>
            <div className="text-center">Email</div>
            <div className="text-center">Mensaje Texto</div>
          </div>

          <Separator />

          {settings.map((setting) => (
            <div key={setting.id} className="grid grid-cols-4 items-center">
              <div className="col-span-2 flex items-start gap-3">
                <div className="mt-0.5 text-muted-foreground">
                  {setting.icon}
                </div>
                <div>
                  <Label className="font-medium">{setting.title}</Label>
                  <p className="text-sm text-muted-foreground">
                    {setting.description}
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={setting.email}
                  onCheckedChange={() => toggleSetting(setting.id, "email")}
                  aria-label={`Activar notificaciones por email para ${setting.title}`}
                />
              </div>
              <div className="flex justify-center">
                <Switch
                  checked={setting.push}
                  onCheckedChange={() => toggleSetting(setting.id, "push")}
                  aria-label={`Activar notificaciones push para ${setting.title}`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
