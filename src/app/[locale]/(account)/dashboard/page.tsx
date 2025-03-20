"use client";

import { useState } from "react";
import DashboardStatCard from "@/components/admin/dashboard-stat-card";
import RecentActivityList from "@/components/admin/recent-activity-list";
import CalendarContainer from "@/components/admin/calendar/calendar-container";
import VisitDialog from "@/components/admin/calendar/visit-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, TrendingUp, Eye, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { Visit, VisitStatus } from "@/types/visits";
import { useVisits, useVisitOperations } from "@/hooks/useVisits";
import { useProperties } from "@/hooks/useProperties";
import { format } from "date-fns";
import { toast } from "sonner";
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

export default function DashboardPage() {
  // Obtener la fecha actual formateada para el rango inicial
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Estado para el diálogo de visitas
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState<Visit | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Estado para el diálogo de confirmación de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState<string | null>(null);

  // Fechas formateadas para la consulta de visitas
  const startDateStr = format(startOfMonth, "yyyy-MM-dd");
  const endDateStr = format(endOfMonth, "yyyy-MM-dd");

  // Usar los hooks para obtener datos del backend
  const { data: visits = [], isLoading: visitsLoading } = useVisits({
    startDate: startDateStr,
    endDate: endDateStr,
  });

  const { properties = [], isLoading: propertiesLoading } = useProperties();

  // Operaciones CRUD para visitas
  const {
    createVisit,
    updateVisit,
    updateVisitStatus,
    deleteVisit,
    isLoading: operationsLoading,
  } = useVisitOperations();

  // Manejador para añadir visita
  const handleAddVisit = (date?: Date) => {
    setVisitToEdit(null);
    if (date) {
      setSelectedDate(date);
    }
    setDialogOpen(true);
  };

  // Manejador para editar visita
  const handleEditVisit = (visitId: string) => {
    const visit = visits.find((v) => v.id === visitId);
    if (visit) {
      setVisitToEdit(visit);
      setDialogOpen(true);
    }
  };

  // Manejador para mostrar diálogo de confirmación para eliminar visita
  const handleConfirmDelete = (visitId: string) => {
    setVisitToDelete(visitId);
    setDeleteDialogOpen(true);
  };

  // Manejador para eliminar visita
  const handleDeleteVisit = async () => {
    if (!visitToDelete) return;

    try {
      await deleteVisit(visitToDelete);
      toast.success("Visita eliminada correctamente");
      // La consulta se actualizará automáticamente gracias a React Query
    } catch (error) {
      toast.error("Error al eliminar la visita");
      console.error("Error eliminando visita:", error);
    } finally {
      setDeleteDialogOpen(false);
      setVisitToDelete(null);
    }
  };

  // Adaptador para CalendarContainer - convierte objetos Visit a visitId
  const handleUpdateVisitStatusById = async (
    visitId: string,
    newStatus: VisitStatus
  ) => {
    try {
      await updateVisitStatus(visitId, newStatus);
      toast.success(`Visita ${newStatus} correctamente`);
    } catch (error) {
      toast.error("Error al actualizar el estado de la visita");
      console.error("Error actualizando estado de visita:", error);
    }
  };

  // Manejador para guardar visita (nueva o editada)
  const handleSaveVisit = async (visitData: Visit) => {
    try {
      if (visitToEdit) {
        // Actualizar visita existente
        await updateVisit(visitData.id, {
          propertyId: visitData.propertyId,
          date: visitData.date.toISOString().split("T")[0], // Formato YYYY-MM-DD
          time: visitData.time,
          type: visitData.type,
          status: visitData.status,
          notes: visitData.notes,
          clientId: "client-1", // Asumiendo un valor por defecto para pruebas
          agentId: visitData.agentId,
        });
        toast.success("Visita actualizada correctamente");
      } else {
        // Obtener un clientId válido - podría venir de una API o selección del usuario
        // Por ahora, usamos el mismo valor pero con mejor manejo:
        const clientId = "client-1"; // En producción, esto debería ser dinámico

        // Añadir nueva visita con validación de respuesta
        const result = await createVisit({
          propertyId: visitData.propertyId,
          date: visitData.date.toISOString().split("T")[0],
          time: visitData.time,
          type: visitData.type,
          status: visitData.status,
          notes: visitData.notes,
          clientId: clientId,
          agentId: visitData.agentId,
        });

        if (result && result.id) {
          toast.success("Visita programada correctamente");
        } else {
          toast.warning(
            "La visita se guardó, pero podría haber información incompleta"
          );
          console.log("Respuesta de creación de visita:", result);
        }
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error("Error al guardar la visita");
      console.error("Error guardando visita:", error);
    }
  };

  // Estadísticas rápidas para las tarjetas
  const totalProperties = properties.length;
  const publishedProperties = properties.filter(
    (p) => p.status === "publicada"
  ).length;
  const draftProperties = properties.filter(
    (p) => p.status === "borrador"
  ).length;
  const scheduledVisits = visits.filter((v) =>
    ["pendiente", "confirmada"].includes(v.status)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Panel Administrativo
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href={"dashboard/properties/new"}>
            <Button className="bg-blue-800 hover:bg-blue-900 ">
              <Plus className="mr-2 h-4 w-4" />
              Añadir propiedad
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Mostrar un estado de carga mientras se obtienen los datos */}
          {visitsLoading ? (
            <Card>
              <CardContent className="py-10">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Componente de Calendario/Agenda */
            <CalendarContainer
              visits={visits}
              onAddVisit={handleAddVisit}
              onEditVisit={handleEditVisit}
              onUpdateVisitStatus={handleUpdateVisitStatusById}
              onDeleteVisit={handleConfirmDelete}
              isLoading={operationsLoading}
            />
          )}

          {/* Actividad reciente en una card separada */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad reciente</CardTitle>
              <CardDescription>
                Últimas propiedades añadidas o editadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivityList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Analíticas</CardTitle>
              <CardDescription>
                Visualiza datos detallados sobre el rendimiento de tus
                propiedades
              </CardDescription>
            </CardHeader>
            <CardContent>
              {propertiesLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                /* Stats Cards */
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <DashboardStatCard
                    title="Total Propiedades"
                    value={totalProperties.toString()}
                    change="+12%"
                    trend="up"
                    description="Comparado con el mes anterior"
                    icon={<Home className="h-5 w-5" />}
                  />
                  <DashboardStatCard
                    title="Propiedades Publicadas"
                    value={publishedProperties.toString()}
                    change="+8%"
                    trend="up"
                    description="Comparado con el mes anterior"
                    icon={<Eye className="h-5 w-5" />}
                  />
                  <DashboardStatCard
                    title="Propiedades en Borrador"
                    value={draftProperties.toString()}
                    change="-3%"
                    trend="down"
                    description="Comparado con el mes anterior"
                    icon={<Clock className="h-5 w-5" />}
                  />
                  <DashboardStatCard
                    title="Visitas Agendadas"
                    value={scheduledVisits.toString()}
                    change="+18%"
                    trend="up"
                    description="Comparado con el mes anterior"
                    icon={<TrendingUp className="h-5 w-5" />}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informes</CardTitle>
              <CardDescription>
                Genera y descarga informes personalizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">
                  Contenido de informes en desarrollo
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para crear/editar visitas */}
      <VisitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={selectedDate}
        existingVisit={visitToEdit}
        onSave={handleSaveVisit}
      />

      {/* Diálogo de confirmación para eliminar visita */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la
              visita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVisit}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
