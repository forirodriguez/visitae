// src/components/admin/property-list-table/index.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Trash2,
  Pencil,
  Eye,
  Bed,
  Bath,
  Home,
  Star,
} from "lucide-react";
import PropertyStatusBadge from "@/components/admin/property-status-badge";
import { DeletePropertyModal } from "@/components/admin/property-list-table/delete-property-modal";
import { Property, PropertyFilter } from "@/types/property";
import { fetchProperties, deleteProperty } from "@/lib/api/client/properties";
import { toast } from "sonner";

export default function PropertyListTable() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all" as string,
    status: "all" as string,
    propertyType: "all" as string,
    priceMin: "",
    priceMax: "",
    beds: "all" as string,
    featured: "all" as string,
  });

  // Estado para modales de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null
  );

  // Obtener todos los tipos de propiedades únicos para el filtro
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);

  // Cargar propiedades
  const loadProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      // Convertir los filtros al formato esperado por la API
      const propertyFilter: PropertyFilter = {
        type:
          filters.type !== "all"
            ? (filters.type as "venta" | "alquiler")
            : undefined,
        minPrice: filters.priceMin ? parseInt(filters.priceMin) : undefined,
        maxPrice: filters.priceMax ? parseInt(filters.priceMax) : undefined,
        minBedrooms:
          filters.beds !== "all" ? parseInt(filters.beds) : undefined,
        keyword: searchQuery || undefined,
        status: undefined,
        featured: false,
      };

      // Obtener propiedades del endpoint con los filtros aplicados
      const data = await fetchProperties(propertyFilter);

      // Aplicar filtros adicionales del lado del cliente si es necesario
      // (para los filtros que no soporta directamente la API)
      let filteredData = [...data];

      if (filters.status !== "all") {
        filteredData = filteredData.filter((p) => p.status === filters.status);
      }

      if (filters.featured !== "all") {
        filteredData = filteredData.filter((p) =>
          filters.featured === "featured" ? p.isFeatured : !p.isFeatured
        );
      }

      if (filters.propertyType !== "all") {
        filteredData = filteredData.filter(
          (p) => p.propertyType === filters.propertyType
        );
      }

      setProperties(filteredData);

      // Extraer tipos de propiedades únicos
      const types = Array.from(
        new Set(data.map((p) => p.propertyType).filter(Boolean))
      );
      setPropertyTypes(types);

      // Resetear a la primera página cuando cambian los filtros
      setCurrentPage(1);
    } catch (error) {
      console.error("Error al cargar propiedades:", error);
      setError("No se pudieron cargar las propiedades. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar propiedades al iniciar
  useEffect(() => {
    loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    // Debounce para evitar muchas llamadas
    const timeoutId = setTimeout(() => {
      loadProperties();
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery]);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  // Paginación
  const paginatedProperties = properties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Selección de propiedades
  const toggleSelectAll = () => {
    if (selectedProperties.length === paginatedProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(paginatedProperties.map((p) => p.id));
    }
  };

  const toggleSelectProperty = (id: string) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(selectedProperties.filter((p) => p !== id));
    } else {
      setSelectedProperties([...selectedProperties, id]);
    }
  };

  // Acciones en lote
  const handleBulkAction = async (action: string) => {
    if (!selectedProperties.length) return;

    if (action === "delete") {
      // Mostrar modal de confirmación para eliminar en lote
      setBulkDeleteModalOpen(true);
    } else if (
      action === "publish" ||
      action === "unpublish" ||
      action === "feature"
    ) {
      // Implementar otras acciones en lote según sea necesario
      toast.info("Esta función estará disponible próximamente");
    }
  };

  // Ejecutar eliminación en lote después de confirmar
  const confirmBulkDelete = async () => {
    try {
      // Eliminar propiedades en serie
      let successCount = 0;
      let errorCount = 0;

      for (const id of selectedProperties) {
        try {
          await deleteProperty(id);
          successCount++;
        } catch (err) {
          errorCount++;
          console.error(`Error eliminando propiedad ${id}:`, err);
        }
      }

      if (successCount > 0) {
        toast.success(
          `${successCount} propiedad${successCount !== 1 ? "es" : ""} eliminada${successCount !== 1 ? "s" : ""} correctamente`
        );
      }

      if (errorCount > 0) {
        toast.error(
          `No se pudieron eliminar ${errorCount} propiedad${errorCount !== 1 ? "es" : ""}`
        );
      }

      // Recargar propiedades
      loadProperties();

      // Después de aplicar la acción, limpiar la selección
      setSelectedProperties([]);

      // Cerrar el modal
      setBulkDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar propiedades:", error);
      toast.error("Error al eliminar las propiedades. Intente nuevamente.");
    }
  };

  // Resetear filtros
  const resetFilters = () => {
    setFilters({
      type: "all",
      status: "all",
      propertyType: "all",
      priceMin: "",
      priceMax: "",
      beds: "all",
      featured: "all",
    });
    setSearchQuery("");
  };

  // Navegar a la página de detalles
  const handleViewDetails = (propertyId: string) => {
    // Obtener el locale actual de la URL
    const locale = window.location.pathname.split("/")[1];
    router.push(`/${locale}/dashboard/properties/${propertyId}`);
  };

  // Navegar a la página de edición
  const handleEditProperty = (propertyId: string) => {
    // Obtener el locale actual de la URL
    const locale = window.location.pathname.split("/")[1];
    router.push(`/${locale}/dashboard/properties/${propertyId}/edit`);
  };

  // Mostrar modal de confirmación de eliminación
  const openDeleteModal = (property: Property) => {
    setPropertyToDelete(property);
    setDeleteModalOpen(true);
  };

  // Manejar eliminación de una propiedad después de confirmar
  const confirmDeleteProperty = async () => {
    if (!propertyToDelete) return;

    try {
      await deleteProperty(propertyToDelete.id);
      toast.success(
        `Propiedad "${propertyToDelete.title}" eliminada correctamente`
      );

      // Recargar propiedades
      loadProperties();

      // Cerrar el modal
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
      toast.error("Error al eliminar la propiedad. Intente nuevamente.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Encabezado con botón de nueva propiedad */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Propiedades</h2>
      </div>
      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar propiedades..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-gray-100 dark:bg-gray-800" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filtros</span>
          </Button>
        </div>

        {selectedProperties.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedProperties.length} seleccionados
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Acciones
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones en lote</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction("publish")}>
                  Publicar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("unpublish")}>
                  Despublicar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("feature")}>
                  Destacar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleBulkAction("delete")}
                  className="text-red-600 dark:text-red-400"
                >
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Filtros expandibles */}
      {showFilters && (
        <div className="grid gap-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de operación</label>
              <Select
                value={filters.type}
                onValueChange={(value) =>
                  setFilters({ ...filters, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="publicada">Publicada</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="destacada">Destacada</SelectItem>
                  <SelectItem value="inactiva">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de propiedad</label>
              <Select
                value={filters.propertyType}
                onValueChange={(value) =>
                  setFilters({ ...filters, propertyType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Destacadas</label>
              <Select
                value={filters.featured}
                onValueChange={(value) =>
                  setFilters({ ...filters, featured: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="featured">Destacadas</SelectItem>
                  <SelectItem value="not-featured">No destacadas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Precio mínimo</label>
              <Input
                type="number"
                placeholder="Mínimo"
                value={filters.priceMin}
                onChange={(e) =>
                  setFilters({ ...filters, priceMin: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Precio máximo</label>
              <Input
                type="number"
                placeholder="Máximo"
                value={filters.priceMax}
                onChange={(e) =>
                  setFilters({ ...filters, priceMax: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Habitaciones</label>
              <Select
                value={filters.beds}
                onValueChange={(value) =>
                  setFilters({ ...filters, beds: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cualquier número" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier número</SelectItem>
                  <SelectItem value="0">Estudio (0)</SelectItem>
                  <SelectItem value="1">1 habitación</SelectItem>
                  <SelectItem value="2">2 habitaciones</SelectItem>
                  <SelectItem value="3">3 habitaciones</SelectItem>
                  <SelectItem value="4">4 habitaciones</SelectItem>
                  <SelectItem value="5">5+ habitaciones</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={resetFilters}>
              Resetear
            </Button>
            <Button
              className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800"
              onClick={() => setShowFilters(false)}
            >
              Aplicar filtros
            </Button>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          {error}
          <Button
            variant="link"
            onClick={loadProperties}
            className="ml-2 text-red-600 dark:text-red-400"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Tabla de propiedades */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    paginatedProperties.length > 0 &&
                    selectedProperties.length === paginatedProperties.length
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Seleccionar todas"
                />
              </TableHead>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Ubicación</TableHead>
              <TableHead className="hidden md:table-cell">Precio</TableHead>
              <TableHead className="hidden md:table-cell">Detalles</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell colSpan={8} className="py-4">
                      <div className="flex space-x-4 items-center">
                        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-12 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="hidden md:block h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="hidden md:block h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="hidden md:block h-4 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="h-5 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                        <div className="ml-auto h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            ) : paginatedProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No se encontraron propiedades.
                </TableCell>
              </TableRow>
            ) : (
              paginatedProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProperties.includes(property.id)}
                      onCheckedChange={() => toggleSelectProperty(property.id)}
                      aria-label={`Seleccionar ${property.title}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="relative h-12 w-16 overflow-hidden rounded-md">
                      <Image
                        src={property.image || "/placeholder.svg"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                      {property.isNew && (
                        <div className="absolute top-0 right-0">
                          <Badge className="bg-green-600 text-white text-xs">
                            Nuevo
                          </Badge>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div>
                      {property.title}
                      {property.isFeatured && (
                        <span className="ml-2">
                          <Star className="inline-block h-4 w-4 text-amber-500" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {property.propertyType}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {property.location}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <span className="font-medium">
                        {property.type === "venta"
                          ? `${property.price.toLocaleString("es-ES")} €`
                          : `${property.price.toLocaleString("es-ES")} €/mes`}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {property.type === "venta" ? "Venta" : "Alquiler"}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Home className="h-4 w-4 mr-1" />
                        <span>{property.area} m²</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PropertyStatusBadge status={property.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(property.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver detalles</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditProperty(property.id)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDeleteModal(property)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Eliminar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando {paginatedProperties.length} de {properties.length}{" "}
          propiedades
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">Primera página</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>
          <span className="text-sm">
            Página {currentPage} de {Math.max(1, totalPages)}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>

      {/* Modal de confirmación para eliminar una propiedad */}
      <DeletePropertyModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDeleteProperty}
        title={propertyToDelete?.title || ""}
        isBulkDelete={false}
      />

      {/* Modal de confirmación para eliminar múltiples propiedades */}
      <DeletePropertyModal
        open={bulkDeleteModalOpen}
        onOpenChange={setBulkDeleteModalOpen}
        onConfirm={confirmBulkDelete}
        title=""
        isBulkDelete={true}
        count={selectedProperties.length}
      />
    </div>
  );
}
