"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";

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
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Eye,
  Upload,
  Building,
  MapPin,
  ListFilter,
  Image,
  Settings,
  CheckCircle,
} from "lucide-react";
import BasicInfoTab from "./basic-info-tab";
import LocationTab from "./location-tab";
import FeaturesTab from "./features-tab";
import GalleryTab from "./gallery-tab";
import AdvancedTab from "@/components/admin/property-form/advance-tab";
import PropertyCard from "@/components/properties/PropertyCard-preview";
import { formDataToProperty } from "@/utils/property-adapter";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tipos para la propiedad
export interface PropertyFormData {
  // Información básica
  title: string;
  description: string;
  price: string;
  operationType: "venta" | "alquiler";
  propertyType: string;

  // Ubicación
  address: string;
  latitude: string;
  longitude: string;
  neighborhood: string;
  city: string;
  postalCode: string;

  // Características
  bedrooms: string;
  bathrooms: string;
  squareMetersBuilt: string;
  squareMetersUsable: string;
  constructionYear: string;
  parkingSpaces: string;
  features: string[];
  energyRating: string;

  // Galería
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
    order: number;
  }[];

  // Detalles avanzados
  status: "borrador" | "publicada" | "destacada" | "inactiva";
  isFeatured: boolean;
  publishDate: string;
  visibility: "publica" | "privada";
  tags: string[];
}

// Valores iniciales para el formulario
const initialFormData: PropertyFormData = {
  title: "",
  description: "",
  price: "",
  operationType: "venta",
  propertyType: "",

  address: "",
  latitude: "",
  longitude: "",
  neighborhood: "",
  city: "",
  postalCode: "",

  bedrooms: "",
  bathrooms: "",
  squareMetersBuilt: "",
  squareMetersUsable: "",
  constructionYear: "",
  parkingSpaces: "",
  features: [],
  energyRating: "",

  images: [],

  status: "borrador",
  isFeatured: false,
  publishDate: new Date().toISOString().split("T")[0],
  visibility: "publica",
  tags: [],
};

// Datos de ejemplo para edición
const samplePropertyData: PropertyFormData = {
  title: "Apartamento de lujo con vistas al mar",
  description:
    "Espectacular apartamento con vistas panorámicas al mar Mediterráneo. Acabados de alta calidad, amplias estancias y terraza privada. Ubicado en una de las mejores zonas de Málaga, a pocos minutos de la playa y de todos los servicios.",
  price: "450000",
  operationType: "venta",
  propertyType: "apartamento",

  address: "Paseo Marítimo 123, Málaga",
  latitude: "36.7213",
  longitude: "-4.4214",
  neighborhood: "Paseo Marítimo",
  city: "Málaga",
  postalCode: "29016",

  bedrooms: "3",
  bathrooms: "2",
  squareMetersBuilt: "120",
  squareMetersUsable: "110",
  constructionYear: "2018",
  parkingSpaces: "1",
  features: ["terraza", "piscina", "ascensor", "seguridad"],
  energyRating: "A",

  images: [
    {
      id: "img1",
      url: "/placeholder.svg?height=300&width=400&text=Imagen+1",
      isPrimary: true,
      order: 0,
    },
    {
      id: "img2",
      url: "/placeholder.svg?height=300&width=400&text=Imagen+2",
      isPrimary: false,
      order: 1,
    },
    {
      id: "img3",
      url: "/placeholder.svg?height=300&width=400&text=Imagen+3",
      isPrimary: false,
      order: 2,
    },
  ],

  status: "publicada",
  isFeatured: true,
  publishDate: "2023-10-15",
  visibility: "publica",
  tags: ["lujo", "vistas", "nuevo"],
};

// Componente de pestañas del formulario con marcas de completado
function PropertyFormTabs({
  activeTab,
  completedTabs,
}: {
  activeTab: string;
  completedTabs: Record<string, boolean>;
}) {
  return (
    <TabsList className="grid w-full grid-cols-5 h-auto p-0 bg-gray-100 dark:bg-gray-900 rounded-t-lg rounded-b-none overflow-hidden">
      {[
        { id: "basic-info", label: "Información básica", icon: Building },
        { id: "location", label: "Ubicación", icon: MapPin },
        { id: "features", label: "Características", icon: ListFilter },
        { id: "gallery", label: "Galería", icon: Image },
        { id: "advanced", label: "Avanzado", icon: Settings },
      ].map(({ id, label, icon: Icon }) => (
        <TabsTrigger
          key={id}
          value={id}
          className={`flex items-center gap-2 rounded-none border-r border-gray-200 dark:border-gray-800 py-3 ${
            activeTab === id
              ? "bg-white dark:bg-gray-800 border-b-2 border-b-blue-800 dark:border-b-blue-700"
              : ""
          } ${id !== activeTab ? "pointer-events-none opacity-70" : ""}`}
          disabled={id !== activeTab}
        >
          {completedTabs[id] ? (
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <Icon className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">
            {id === "basic-info"
              ? "Info"
              : id === "features"
                ? "Caract."
                : label}
          </span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

interface PropertyFormProps {
  propertyId?: string;
}

export default function PropertyForm({ propertyId }: PropertyFormProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("basic-info");
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [completedTabs, setCompletedTabs] = useState<Record<string, boolean>>(
    {}
  );

  // Cargar datos de la propiedad si estamos en modo edición
  useEffect(() => {
    if (propertyId) {
      // En un caso real, aquí haríamos una llamada a la API para obtener los datos
      // Por ahora, usamos datos de ejemplo
      setFormData(samplePropertyData);
      checkTabsCompletion(samplePropertyData);
    }
  }, [propertyId]);

  // Manejar cambios en el formulario
  const handleChange = (
    section: keyof PropertyFormData,
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error si el campo tiene valor
    if (formErrors[field] && value) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Verificar qué pestañas están completas
  const checkTabsCompletion = (data: PropertyFormData) => {
    const completed: Record<string, boolean> = {};

    // Verificar pestaña de información básica
    completed["basic-info"] = !!(
      data.title &&
      data.description &&
      data.price &&
      data.propertyType
    );

    // Verificar pestaña de ubicación
    completed["location"] = !!(data.address && data.city);

    // Verificar pestaña de características
    completed["features"] = !!(
      data.bedrooms &&
      data.bathrooms &&
      data.squareMetersBuilt
    );

    // Verificar pestaña de galería
    completed["gallery"] = data.images.length > 0;

    // Pestaña avanzada siempre está "completa" ya que no tiene campos obligatorios
    completed["advanced"] = true;

    setCompletedTabs(completed);
  };

  // Función para ir al siguiente paso del formulario
  const goToNextStep = () => {
    const tabs = ["basic-info", "location", "features", "gallery", "advanced"];
    const currentIndex = tabs.indexOf(activeTab);

    if (currentIndex < tabs.length - 1) {
      // Validar solo la sección actual antes de avanzar
      const isValid = validateCurrentStep();

      if (isValid) {
        // Actualizar el estado de completitud de la pestaña actual
        setCompletedTabs((prev) => ({
          ...prev,
          [activeTab]: true,
        }));

        const nextTab = tabs[currentIndex + 1];
        setActiveTab(nextTab);

        // Hacer scroll al inicio del formulario para mejor UX
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  // Función para ir al paso anterior del formulario
  const goToPreviousStep = (targetTab: string) => {
    // No necesitamos validar al retroceder
    setActiveTab(targetTab);
    // Hacer scroll al inicio del formulario para mejor UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Validar solo la sección actual
  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};

    switch (activeTab) {
      case "basic-info":
        if (!formData.title) errors.title = "El título es obligatorio";
        if (!formData.description)
          errors.description = "La descripción es obligatoria";
        if (!formData.price) errors.price = "El precio es obligatorio";
        if (!formData.propertyType)
          errors.propertyType = "El tipo de propiedad es obligatorio";
        break;

      case "location":
        if (!formData.address) errors.address = "La dirección es obligatoria";
        if (!formData.city) errors.city = "La ciudad es obligatoria";
        break;

      case "features":
        if (!formData.bedrooms)
          errors.bedrooms = "El número de dormitorios es obligatorio";
        if (!formData.bathrooms)
          errors.bathrooms = "El número de baños es obligatorio";
        if (!formData.squareMetersBuilt)
          errors.squareMetersBuilt =
            "Los metros cuadrados construidos son obligatorios";
        break;

      case "gallery":
        if (formData.images.length === 0)
          errors.images = "Debe subir al menos una imagen";
        break;
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Por favor, complete todos los campos obligatorios", {
        description:
          "No se puede avanzar hasta completar la información requerida.",
      });
      return false;
    }

    return true;
  };

  // Validar formulario completo (todas las secciones) y actualizar el estado isFormComplete
  const validateFullForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validar información básica
    if (!formData.title) errors.title = "El título es obligatorio";
    if (!formData.description)
      errors.description = "La descripción es obligatoria";
    if (!formData.price) errors.price = "El precio es obligatorio";
    if (!formData.propertyType)
      errors.propertyType = "El tipo de propiedad es obligatorio";

    // Validar ubicación
    if (!formData.address) errors.address = "La dirección es obligatoria";
    if (!formData.city) errors.city = "La ciudad es obligatoria";

    // Validar características
    if (!formData.bedrooms)
      errors.bedrooms = "El número de dormitorios es obligatorio";
    if (!formData.bathrooms)
      errors.bathrooms = "El número de baños es obligatorio";
    if (!formData.squareMetersBuilt)
      errors.squareMetersBuilt =
        "Los metros cuadrados construidos son obligatorios";

    // Validar galería
    if (formData.images.length === 0)
      errors.images = "Debe subir al menos una imagen";

    setFormErrors(errors);
    const formIsComplete = Object.keys(errors).length === 0;
    return formIsComplete;
  };

  // Guardar como borrador
  const handleSaveDraft = async () => {
    setIsLoading(true);

    try {
      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // En un caso real enviaríamos los datos a la API
      // Por ahora, guardamos en localStorage para demostrar
      const savedProperties = JSON.parse(
        localStorage.getItem("savedProperties") || "[]"
      ) as Array<PropertyFormData & { id: string }>;
      const propertyToSave = {
        ...formData,
        id: propertyId || `prop_${new Date().getTime()}`,
        status: "borrador" as const,
      };

      // Si existe, actualizamos, si no, añadimos
      const existingIndex = savedProperties.findIndex(
        (p) => p.id === propertyToSave.id
      );
      if (existingIndex >= 0) {
        savedProperties[existingIndex] = propertyToSave;
      } else {
        savedProperties.push(propertyToSave);
      }

      localStorage.setItem("savedProperties", JSON.stringify(savedProperties));

      toast.success("Borrador guardado", {
        description: "La propiedad se ha guardado como borrador correctamente.",
      });

      // En un caso real, redirigir a la lista de propiedades o a la vista de detalle
      if (!propertyId) {
        router.push("/admin/properties");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error al guardar", {
        description:
          "Ha ocurrido un error al guardar el borrador. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Publicar propiedad
  const handlePublish = async () => {
    if (!validateFullForm()) {
      // Mostrar toast de error y cambiar a la primera pestaña con errores
      toast.error("Error de validación", {
        description: "Por favor, completa todos los campos obligatorios.",
      });

      // Encontrar la primera pestaña con errores
      const tabsWithErrors = {
        "basic-info": ["title", "description", "price", "propertyType"],
        location: ["address", "city", "postalCode"],
        features: ["bedrooms", "bathrooms", "squareMetersBuilt"],
        gallery: ["images"],
        advanced: [],
      };

      for (const [tab, fields] of Object.entries(tabsWithErrors)) {
        if (fields.some((field) => formErrors[field])) {
          setActiveTab(tab);
          break;
        }
      }

      return;
    }

    setShowPublishDialog(false);
    setIsLoading(true);

    try {
      // Simulamos una llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Guardamos en localStorage como propiedad publicada
      const savedProperties = JSON.parse(
        localStorage.getItem("savedProperties") || "[]"
      ) as Array<PropertyFormData & { id: string }>;
      const propertyToSave = {
        ...formData,
        id: propertyId || `prop_${new Date().getTime()}`,
        status: "publicada" as const,
      };

      // Si existe, actualizamos, si no, añadimos
      const existingIndex = savedProperties.findIndex(
        (p) => p.id === propertyToSave.id
      );
      if (existingIndex >= 0) {
        savedProperties[existingIndex] = propertyToSave;
      } else {
        savedProperties.push(propertyToSave);
      }

      localStorage.setItem("savedProperties", JSON.stringify(savedProperties));

      toast.success("Propiedad publicada", {
        description: "La propiedad se ha publicado correctamente.",
      });

      // En un caso real, redirigir a la lista de propiedades o a la vista de detalle
      router.push("/admin/properties");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error al publicar", {
        description:
          "Ha ocurrido un error al publicar la propiedad. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Previsualizar propiedad
  const handlePreview = () => {
    if (!validateFullForm()) {
      toast.error("Error de validación", {
        description:
          "Por favor, completa todos los campos obligatorios antes de previsualizar.",
      });
      return;
    }

    setShowPreviewDialog(true);
  };

  // Convertir datos del formulario al formato que espera PropertyCard
  const getPropertyPreview = () => {
    return formDataToProperty(formData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <PropertyFormTabs
            activeTab={activeTab}
            completedTabs={completedTabs}
          />

          <TabsContent value="basic-info" className="p-6 space-y-6">
            <BasicInfoTab
              formData={formData}
              onChange={handleChange}
              errors={formErrors}
            />
            <div className="flex justify-between mt-6">
              <div></div> {/* Espacio vacío para mantener el justify-between */}
              <Button
                onClick={goToNextStep}
                className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Siguiente: Ubicación
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="location" className="p-6 space-y-6">
            <LocationTab
              formData={formData}
              onChange={handleChange}
              errors={formErrors}
            />
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => goToPreviousStep("basic-info")}
              >
                ← Atrás
              </Button>
              <Button
                onClick={goToNextStep}
                className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Siguiente: Características
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="features" className="p-6 space-y-6">
            <FeaturesTab
              formData={formData}
              onChange={handleChange}
              errors={formErrors}
            />
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => goToPreviousStep("location")}
              >
                ← Atrás
              </Button>
              <Button
                onClick={goToNextStep}
                className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Siguiente: Galería
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="p-6 space-y-6">
            <GalleryTab
              formData={formData}
              onChange={handleChange}
              errors={formErrors}
            />
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => goToPreviousStep("features")}
              >
                ← Atrás
              </Button>
              <Button
                onClick={goToNextStep}
                className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Siguiente: Ajustes avanzados
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="p-6 space-y-6">
            <AdvancedTab
              formData={formData}
              onChange={handleChange}
              errors={formErrors}
            />
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => goToPreviousStep("gallery")}
              >
                ← Atrás
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  disabled={isLoading}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Previsualizar
                </Button>
                <Button
                  onClick={() => {
                    const isValid = validateFullForm();
                    if (isValid) {
                      setShowPublishDialog(true);
                    } else {
                      toast.error("Formulario incompleto", {
                        description:
                          "Debes completar todos los campos obligatorios antes de publicar.",
                      });
                    }
                  }}
                  className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800"
                  disabled={isLoading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Publicar
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Guardar como borrador
        </Button>
      </div>

      {/* Diálogo de confirmación para publicar */}
      <AlertDialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Publicar propiedad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción publicará la propiedad y estará visible para todos los
              usuarios. ¿Estás seguro de que deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublish}
              className="bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Publicar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de previsualización con PropertyCard */}
      <AlertDialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Vista previa de la propiedad</AlertDialogTitle>
            <AlertDialogDescription>
              Así es como se verá la propiedad una vez publicada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4 max-w-sm mx-auto">
            <PropertyCard property={getPropertyPreview()} />
          </div>
          <div className="mt-4 p-4 border rounded-md max-h-60 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">Descripción completa</h3>
            <p className="text-gray-700 dark:text-gray-300">
              {formData.description}
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
