//src/components/admin/calendar/visits-list.tsx
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { mockVisits, mockProperties, mockAgent } from "@/lib/mock-data/visits";
import { Visit, VisitStatus, VisitType } from "@/types/visits";
import VisitDialog from "./visit-dialog";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import Image from "next/image";

// Constantes
const ITEMS_PER_PAGE = 10;

export default function VisitsList() {
  // Estados para los filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | VisitStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | VisitType>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [propertyFilter, setPropertyFilter] = useState("all");

  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Estado para la visita seleccionada y el panel lateral
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false);

  // Estados para el diálogo de visita
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState<Visit | null>(null);

  // Estado para manejar las visitas (simulado)
  const [visits, setVisits] = useState<Visit[]>(mockVisits);

  // Filtrar las visitas según los criterios
  const filteredVisits = visits.filter((visit) => {
    // Filtro de búsqueda por texto
    const matchesSearch =
      visit.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.clientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      visit.clientPhone.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtro por estado
    const matchesStatus =
      statusFilter === "all" || visit.status === statusFilter;

    // Filtro por tipo
    const matchesType = typeFilter === "all" || visit.type === typeFilter;

    // Filtro por propiedad
    const matchesProperty =
      propertyFilter === "all" || visit.propertyId === propertyFilter;

    // Filtro por rango de fechas
    const matchesDateRange =
      !dateRange ||
      !dateRange.from ||
      !dateRange.to ||
      (visit.date >= dateRange.from && visit.date <= dateRange.to);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType &&
      matchesProperty &&
      matchesDateRange
    );
  });

  // Ordenar visitas cronológicamente (más recientes primero)
  const sortedVisits = [...filteredVisits].sort((a, b) => {
    // Primero comparar por fecha
    const dateComparison = a.date.getTime() - b.date.getTime();
    if (dateComparison !== 0) return dateComparison;

    // Si la fecha es la misma, comparar por hora
    const timeA = a.time.split(":").map(Number);
    const timeB = b.time.split(":").map(Number);
    const hourComparison = timeA[0] - timeB[0];
    if (hourComparison !== 0) return hourComparison;
    return timeA[1] - timeB[1];
  });

  // Calcular la paginación
  const totalPages = Math.ceil(sortedVisits.length / ITEMS_PER_PAGE);
  const paginatedVisits = sortedVisits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Restablecer la página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, dateRange, propertyFilter]);

  // Obtener color según el estado de la visita
  const getStatusBadge = (status: VisitStatus) => {
    switch (status) {
      case "pendiente":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800/30"
          >
            Pendiente
          </Badge>
        );
      case "confirmada":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/30"
          >
            Confirmada
          </Badge>
        );
      case "completada":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/30"
          >
            Completada
          </Badge>
        );
      case "cancelada":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/30"
          >
            Cancelada
          </Badge>
        );
    }
  };

  // Manejador para ver detalles de una visita
  const handleViewDetails = (visit: Visit) => {
    setSelectedVisit(visit);
    setIsDetailSheetOpen(true);
  };

  // Manejador para editar una visita
  const handleEditVisit = (visit: Visit) => {
    setVisitToEdit(visit);
    setDialogOpen(true);
  };

  // Manejador para eliminar una visita
  const handleDeleteVisit = (visitId: string) => {
    // En una aplicación real, aquí iría la llamada a la API
    setVisits(visits.filter((visit) => visit.id !== visitId));
    if (selectedVisit?.id === visitId) {
      setSelectedVisit(null);
      setIsDetailSheetOpen(false);
    }
  };

  // Manejador para contactar al cliente (solo placeholder por ahora)
  const handleContactClient = (method: "email" | "phone", contact: string) => {
    if (method === "email") {
      window.open(`mailto:${contact}`);
    } else {
      window.open(`tel:${contact}`);
    }
  };

  // Manejador para actualizar el estado de una visita
  const handleUpdateStatus = (visitId: string, newStatus: VisitStatus) => {
    // En una aplicación real, aquí iría la llamada a la API
    const updatedVisits = visits.map((visit) =>
      visit.id === visitId ? { ...visit, status: newStatus } : visit
    );
    setVisits(updatedVisits);

    // Actualizar la visita seleccionada si corresponde
    if (selectedVisit?.id === visitId) {
      setSelectedVisit({ ...selectedVisit, status: newStatus });
    }
  };

  // Manejador para guardar visita editada
  const handleSaveVisit = (updatedVisit: Visit) => {
    // En una aplicación real, aquí iría la llamada a la API
    const updatedVisits = visits.map((visit) =>
      visit.id === updatedVisit.id ? updatedVisit : visit
    );
    setVisits(updatedVisits);

    // Actualizar la visita seleccionada si corresponde
    if (selectedVisit?.id === updatedVisit.id) {
      setSelectedVisit(updatedVisit);
    }

    setDialogOpen(false);
    setVisitToEdit(null);
  };

  // Funciones de navegación de páginas
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Determinar el botón de estado a mostrar según el estado actual de la visita
  const getStatusButton = (visit: Visit) => {
    switch (visit.status) {
      case "pendiente":
        return (
          <DropdownMenuItem
            onClick={() => handleUpdateStatus(visit.id, "confirmada")}
          >
            <Badge className="mr-2 bg-green-100 text-green-800 hover:bg-green-200">
              Confirmar
            </Badge>
          </DropdownMenuItem>
        );
      case "confirmada":
        return (
          <DropdownMenuItem
            onClick={() => handleUpdateStatus(visit.id, "completada")}
          >
            <Badge className="mr-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
              Marcar como realizada
            </Badge>
          </DropdownMenuItem>
        );
      case "pendiente":
      case "confirmada":
        return (
          <DropdownMenuItem
            onClick={() => handleUpdateStatus(visit.id, "cancelada")}
          >
            <Badge className="mr-2 bg-red-100 text-red-800 hover:bg-red-200">
              Cancelar
            </Badge>
          </DropdownMenuItem>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Listado de visitas</CardTitle>
            <CardDescription>
              Gestiona todas las visitas programadas
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por cliente, propiedad o contacto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Filtrar visitas</h4>

                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground">
                      Estado
                    </h5>
                    <Select
                      value={statusFilter}
                      onValueChange={(value: "all" | VisitStatus) =>
                        setStatusFilter(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        <SelectItem value="pendiente">Pendientes</SelectItem>
                        <SelectItem value="confirmada">Confirmadas</SelectItem>
                        <SelectItem value="completada">Completadas</SelectItem>
                        <SelectItem value="cancelada">Canceladas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground">
                      Tipo de visita
                    </h5>
                    <Select
                      value={typeFilter}
                      onValueChange={(value: "all" | VisitType) =>
                        setTypeFilter(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los tipos</SelectItem>
                        <SelectItem value="presencial">Presencial</SelectItem>
                        <SelectItem value="videollamada">
                          Videollamada
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground">
                      Propiedad
                    </h5>
                    <Select
                      value={propertyFilter}
                      onValueChange={setPropertyFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las propiedades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          Todas las propiedades
                        </SelectItem>
                        {mockProperties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-medium text-muted-foreground">
                      Rango de fechas
                    </h5>
                    <DateRangePicker
                      value={dateRange}
                      onChange={setDateRange}
                      locale={es}
                      placeholder="Seleccionar rango"
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setTypeFilter("all");
                      setPropertyFilter("all");
                      setDateRange(undefined);
                    }}
                  >
                    Restablecer filtros
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Mostrador de filtros activos */}
            <div className="flex flex-wrap gap-1 items-center">
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Estado: {statusFilter}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => setStatusFilter("all")}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {typeFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Tipo: {typeFilter}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => setTypeFilter("all")}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {propertyFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Propiedad:{" "}
                  {mockProperties
                    .find((p) => p.id === propertyFilter)
                    ?.title.substring(0, 15) + "..." || propertyFilter}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => setPropertyFilter("all")}
                  >
                    ×
                  </button>
                </Badge>
              )}
              {dateRange?.from && (
                <Badge variant="secondary" className="text-xs">
                  Fechas: {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                  {dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : "..."}
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={() => setDateRange(undefined)}
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tabla de visitas */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Fecha</TableHead>
                <TableHead className="w-[100px]">Hora</TableHead>
                <TableHead className="w-[250px]">Propiedad</TableHead>
                <TableHead className="w-[180px]">Cliente</TableHead>
                <TableHead className="w-[120px]">Tipo</TableHead>
                <TableHead className="w-[120px]">Estado</TableHead>
                <TableHead className="w-[80px] text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVisits.length > 0 ? (
                paginatedVisits.map((visit) => (
                  <TableRow
                    key={visit.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewDetails(visit)}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{format(visit.date, "dd/MM/yyyy")}</span>
                      </div>
                    </TableCell>
                    <TableCell>{visit.time}</TableCell>
                    <TableCell className="font-medium">
                      {visit.propertyTitle}
                    </TableCell>
                    <TableCell>{visit.clientName}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          visit.type === "presencial"
                            ? "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
                            : "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300"
                        }
                      >
                        {visit.type === "presencial"
                          ? "Presencial"
                          : "Videollamada"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(visit.status)}</TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(visit)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditVisit(visit)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar visita
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />

                          {/* Botón de estado condicional */}
                          {getStatusButton(visit)}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() =>
                              handleContactClient("email", visit.clientEmail)
                            }
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Contactar por email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleContactClient("phone", visit.clientPhone)
                            }
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Contactar por teléfono
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteVisit(visit.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron visitas con los filtros actuales.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {sortedVisits.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} a{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, sortedVisits.length)} de{" "}
              {sortedVisits.length} visitas
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      {/* Panel lateral de detalles */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Detalles de la visita</SheetTitle>
            <SheetDescription>
              {selectedVisit &&
                format(selectedVisit.date, "EEEE d 'de' MMMM 'de' yyyy", {
                  locale: es,
                })}
            </SheetDescription>
          </SheetHeader>

          {selectedVisit && (
            <div className="mt-6 space-y-6">
              {/* Estado de la visita */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Estado:</h3>
                {getStatusBadge(selectedVisit.status)}
              </div>

              <Separator />

              {/* Información de la propiedad */}
              <div>
                <h3 className="text-sm font-medium mb-2">Propiedad</h3>
                <div className="bg-muted/40 rounded-lg p-3">
                  <p className="font-medium">{selectedVisit.propertyTitle}</p>
                  {selectedVisit.propertyImage && (
                    <div className="mt-2 relative h-32 rounded-md overflow-hidden">
                      <Image
                        fill
                        src={selectedVisit.propertyImage}
                        alt={selectedVisit.propertyTitle}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Fecha y detalles */}
              <div>
                <h3 className="text-sm font-medium mb-2">
                  Detalles de la visita
                </h3>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha:</span>
                    <span>{format(selectedVisit.date, "dd/MM/yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hora:</span>
                    <span>{selectedVisit.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo:</span>
                    <span>
                      {selectedVisit.type === "presencial"
                        ? "Presencial"
                        : "Videollamada"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Agente asignado:
                    </span>
                    <span>{mockAgent.name}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Información del cliente */}
              <div>
                <h3 className="text-sm font-medium mb-2">Cliente</h3>
                <div className="space-y-2">
                  <p className="font-medium">{selectedVisit.clientName}</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${selectedVisit.clientEmail}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {selectedVisit.clientEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${selectedVisit.clientPhone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {selectedVisit.clientPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Notas (si existen) */}
              {selectedVisit.notes && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Notas</h3>
                  <div className="bg-muted/40 rounded-lg p-3">
                    <p className="text-sm">{selectedVisit.notes}</p>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-wrap gap-2 mt-6">
                <Button
                  variant="default"
                  onClick={() => handleEditVisit(selectedVisit)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar visita
                </Button>

                {selectedVisit.status === "pendiente" && (
                  <Button
                    variant="outline"
                    className="text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800"
                    onClick={() =>
                      handleUpdateStatus(selectedVisit.id, "confirmada")
                    }
                  >
                    Confirmar visita
                  </Button>
                )}

                {selectedVisit.status === "confirmada" && (
                  <Button
                    variant="outline"
                    className="text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                    onClick={() =>
                      handleUpdateStatus(selectedVisit.id, "completada")
                    }
                  >
                    Marcar como realizada
                  </Button>
                )}

                {(selectedVisit.status === "pendiente" ||
                  selectedVisit.status === "confirmada") && (
                  <Button
                    variant="outline"
                    className="text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800"
                    onClick={() =>
                      handleUpdateStatus(selectedVisit.id, "cancelada")
                    }
                  >
                    Cancelar visita
                  </Button>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Diálogo para editar visitas */}
      <VisitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedDate={visitToEdit?.date || new Date()}
        existingVisit={visitToEdit}
        onSave={handleSaveVisit}
      />
    </Card>
  );
}
