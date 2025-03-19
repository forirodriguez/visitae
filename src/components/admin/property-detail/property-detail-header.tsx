"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  MoreHorizontal,
  Star,
  Trash2,
  Eye,
  Loader2,
  Calendar,
  Share2,
} from "lucide-react";
import PropertyStatusBadge from "@/components/admin/property-status-badge";
import { toast } from "sonner";
import { PropertyDetail } from "./property-detail";
import {
  togglePropertyFeatured,
  updatePropertyStatus,
} from "@/lib/api/client/properties";

interface PropertyDetailHeaderProps {
  property: PropertyDetail;
  onDelete: () => Promise<void>;
  isLoading: boolean;
  onPropertyUpdate: () => void; // Callback para actualizar los datos después de cambios
}

export default function PropertyDetailHeader({
  property,
  onDelete,
  isLoading,
  onPropertyUpdate,
}: PropertyDetailHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  // Mutación para cambiar el estado destacado
  const featureMutation = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      togglePropertyFeatured(id, isFeatured),
    onSuccess: () => {
      const newFeaturedState = !property.isFeatured;
      toast.success(
        newFeaturedState ? "Propiedad destacada" : "Propiedad no destacada",
        {
          description: newFeaturedState
            ? "La propiedad se mostrará en secciones destacadas."
            : "La propiedad ya no se mostrará como destacada.",
        }
      );

      // Invalidar la consulta de la propiedad para recargarla
      queryClient.invalidateQueries({ queryKey: ["property", property.id] });
      // Invalidar la lista de propiedades
      queryClient.invalidateQueries({ queryKey: ["properties"] });

      // Llamar al callback para actualizar datos
      onPropertyUpdate();
    },
    onError: (error) => {
      console.error("Error al cambiar estado destacado:", error);
      toast.error("Error al cambiar estado destacado", {
        description:
          "No se pudo completar la operación. Inténtalo de nuevo más tarde.",
      });
    },
  });

  // Mutación para cambiar el estado
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updatePropertyStatus(
        id,
        status as "borrador" | "publicada" | "destacada" | "inactiva"
      ),
    onSuccess: (_, variables) => {
      const statusMessages = {
        borrador: "Guardada como borrador",
        publicada: "Propiedad publicada",
        destacada: "Propiedad destacada",
        inactiva: "Propiedad inactiva",
      };

      toast.success(
        statusMessages[variables.status as keyof typeof statusMessages],
        {
          description:
            "El estado de la propiedad ha sido actualizado correctamente.",
        }
      );

      // Invalidar la consulta de la propiedad para recargarla
      queryClient.invalidateQueries({ queryKey: ["property", property.id] });
      // Invalidar la lista de propiedades
      queryClient.invalidateQueries({ queryKey: ["properties"] });

      // Llamar al callback para actualizar datos
      onPropertyUpdate();
    },
    onError: (error) => {
      console.error("Error al cambiar estado:", error);
      toast.error("Error al cambiar estado", {
        description:
          "No se pudo completar la operación. Inténtalo de nuevo más tarde.",
      });
    },
  });

  // Navegar a la página de edición
  const handleEditProperty = () => {
    // Obtener el locale actual de la URL
    const locale = window.location.pathname.split("/")[1];
    router.push(`/${locale}/dashboard/properties/${property.id}/edit`);
  };

  // Ver la propiedad publicada
  const handleViewPublished = () => {
    // Obtener el locale actual de la URL
    const locale = window.location.pathname.split("/")[1];
    router.push(`/${locale}/propiedades/${property.id}`);
  };

  // Cambiar estado destacado
  const handleToggleFeatured = async () => {
    featureMutation.mutate({
      id: property.id,
      isFeatured: !property.isFeatured,
    });
  };

  // Cambiar estado (publicada, borrador, etc.)
  const handleStatusChange = async (
    newStatus: "borrador" | "publicada" | "destacada" | "inactiva"
  ) => {
    statusMutation.mutate({ id: property.id, status: newStatus });
  };

  // Compartir propiedad
  const handleShare = () => {
    setShowShareDialog(true);
    // En una implementación real, aquí tendríamos opciones para compartir
  };

  // Programar visita
  const handleScheduleVisit = () => {
    setShowScheduleDialog(true);
    // En una implementación real, aquí tendríamos un formulario para programar visita
  };

  // Determinar si hay alguna operación en curso
  const isActionLoading =
    isLoading || featureMutation.isPending || statusMutation.isPending;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold truncate">{property.title}</h2>
          {property.isFeatured && (
            <Badge className="bg-amber-500 text-white">Destacada</Badge>
          )}
          <PropertyStatusBadge status={property.status} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleViewPublished}
          disabled={
            isActionLoading ||
            property.status === "borrador" ||
            property.status === "inactiva"
          }
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">Ver publicada</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleScheduleVisit}
          disabled={isActionLoading}
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Programar visita</span>
        </Button>

        <Button
          variant="default"
          size="sm"
          className="flex items-center gap-1 bg-blue-800 hover:bg-blue-900"
          onClick={handleEditProperty}
          disabled={isActionLoading}
        >
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Editar</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isActionLoading}>
              {isActionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
              <span className="sr-only">Más acciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleEditProperty}
              disabled={isActionLoading}
            >
              <Edit className="mr-2 h-4 w-4" />
              <span>Editar propiedad</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleShare} disabled={isActionLoading}>
              <Share2 className="mr-2 h-4 w-4" />
              <span>Compartir propiedad</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => handleStatusChange("publicada")}
              disabled={property.status === "publicada" || isActionLoading}
            >
              {statusMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              <span>Publicar</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleStatusChange("borrador")}
              disabled={property.status === "borrador" || isActionLoading}
            >
              {statusMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Edit className="mr-2 h-4 w-4" />
              )}
              <span>Guardar como borrador</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleStatusChange("inactiva")}
              disabled={property.status === "inactiva" || isActionLoading}
            >
              {statusMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Eye className="mr-2 h-4 w-4 text-gray-400" />
              )}
              <span>Marcar como inactiva</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleToggleFeatured}
              disabled={isActionLoading}
            >
              {featureMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Star className="mr-2 h-4 w-4" />
              )}
              <span>
                {property.isFeatured
                  ? "Quitar destacado"
                  : "Marcar como destacada"}
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600"
              disabled={isActionLoading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Eliminar propiedad</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar propiedad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La propiedad se eliminará
              permanentemente de la plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={isActionLoading}
            >
              {isActionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para compartir (implementación básica) */}
      <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Compartir propiedad</AlertDialogTitle>
            <AlertDialogDescription>
              Comparte esta propiedad con clientes potenciales.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4">
            <div className="p-3 bg-gray-100 rounded-md">
              <p className="text-sm font-mono break-all">
                {window.location.origin}/propiedades/{property.id}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/propiedades/${property.id}`
                  );
                  toast.success("Enlace copiado al portapapeles");
                  setShowShareDialog(false);
                }}
              >
                Copiar enlace
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  toast.success("Correo enviado", {
                    description:
                      "Se ha enviado un correo con la información de la propiedad",
                  });
                  setShowShareDialog(false);
                }}
              >
                Enviar por correo
              </Button>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cerrar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para programar visita (implementación básica) */}
      <AlertDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Programar visita</AlertDialogTitle>
            <AlertDialogDescription>
              Programa una visita para mostrar esta propiedad a un cliente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-center py-6">
            <p>Funcionalidad en desarrollo</p>
            <p className="text-sm text-gray-500 mt-2">
              Esta funcionalidad estará disponible próximamente.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cerrar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
