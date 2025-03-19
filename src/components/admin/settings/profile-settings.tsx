// src/components/admin/settings/profile-settings.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PencilLine, Upload, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Juan Pérez",
    email: "juan@visitae.com",
    phone: "600 123 456",
    role: "Administrador",
    bio: "Agente inmobiliario con más de 10 años de experiencia en el sector. Especializado en propiedades de lujo y zona centro.",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUserDataChange = (
    field: keyof typeof userData,
    value: string
  ) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (
    field: keyof typeof passwordData,
    value: string
  ) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    // En una aplicación real, aquí se enviarían los datos al servidor
    toast.success("Perfil actualizado", {
      description: "Tus datos de perfil se han guardado correctamente.",
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    // Validación básica
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Error", {
        description: "Por favor, completa todos los campos.",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Error", {
        description: "Las contraseñas nuevas no coinciden.",
      });
      return;
    }

    // En una aplicación real, aquí se enviaría la solicitud al servidor
    toast.success("Contraseña actualizada", {
      description: "Tu contraseña ha sido cambiada correctamente.",
    });

    // Limpiar campos
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Información personal</CardTitle>
              <CardDescription>Actualiza tus datos de perfil</CardDescription>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" /> Guardar
                </>
              ) : (
                <>
                  <PencilLine className="mr-2 h-4 w-4" /> Editar
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex flex-col items-center">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=987&auto=format&fit=crop"
                  alt="Foto de perfil"
                />
                <AvatarFallback>CG</AvatarFallback>
              </Avatar>

              {isEditing && (
                <Button variant="outline" className="mt-4 text-sm">
                  <Upload className="mr-2 h-4 w-4" /> Cambiar foto
                </Button>
              )}
            </div>

            <div className="md:w-2/3 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) =>
                      handleUserDataChange("name", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      handleUserDataChange("email", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) =>
                      handleUserDataChange("phone", e.target.value)
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Input id="role" value={userData.role} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografía</Label>
                <Textarea
                  id="bio"
                  value={userData.bio}
                  onChange={(e) => handleUserDataChange("bio", e.target.value)}
                  disabled={!isEditing}
                  rows={4}
                  className="resize-none"
                />
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" /> Guardar cambios
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar contraseña</CardTitle>
          <CardDescription>
            Actualiza tu contraseña para mantener tu cuenta segura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Contraseña actual</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  handlePasswordChange("currentPassword", e.target.value)
                }
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    handlePasswordChange("newPassword", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange("confirmPassword", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleChangePassword}>Cambiar contraseña</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
