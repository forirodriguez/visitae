"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle, X, GripVertical, Star, StarOff } from "lucide-react";
import PropertyFormSection from "@/components/admin/property-form/property-form-section";
import type { PropertyFormData } from "@/components/admin/property-form/property-form";
import ImageGalleryUploader from "./image-gallery-uploader";
import Image from "next/image";

interface GalleryTabProps {
  formData: PropertyFormData;
  onChange: (
    section: keyof PropertyFormData,
    field: string,
    value: unknown
  ) => void;
  errors: Record<string, string>;
}

export default function GalleryTab({
  formData,
  onChange,
  errors,
}: GalleryTabProps) {
  const [draggedImage, setDraggedImage] = useState<string | null>(null);

  // Colección de imágenes reales para usar como respaldo
  const fallbackImages = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&h=450&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&h=450&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&h=450&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&h=450&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800&h=450&auto=format&fit=crop",
  ];

  // Obtener una imagen de respaldo basada en el índice
  const getFallbackImage = (id: string) => {
    // Usar alguna característica del ID para seleccionar una imagen consistentemente
    const hashCode = id.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    return fallbackImages[hashCode % fallbackImages.length];
  };

  const handleImageUpload = (files: FileList) => {
    // En un caso real, aquí subiríamos las imágenes a un servidor
    // Por ahora, simulamos la subida creando URLs locales

    const newImages = Array.from(files).map((file, index) => {
      const id = `new-${Date.now()}-${index}`;
      const url = URL.createObjectURL(file);

      return {
        id,
        url,
        isPrimary: formData.images.length === 0 && index === 0, // Primera imagen como principal si no hay otras
        order: formData.images.length + index,
      };
    });

    onChange("images", "images", [...formData.images, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    const updatedImages = formData.images.filter((img) => img.id !== id);

    // Si eliminamos la imagen principal, establecer la primera como principal
    if (
      formData.images.find((img) => img.id === id)?.isPrimary &&
      updatedImages.length > 0
    ) {
      updatedImages[0].isPrimary = true;
    }

    onChange("images", "images", updatedImages);
  };

  const handleSetPrimary = (id: string) => {
    const updatedImages = formData.images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));

    onChange("images", "images", updatedImages);
  };

  const handleDragStart = (id: string) => {
    setDraggedImage(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedImage === null || draggedImage === id) return;

    const draggedIndex = formData.images.findIndex(
      (img) => img.id === draggedImage
    );
    const targetIndex = formData.images.findIndex((img) => img.id === id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const updatedImages = [...formData.images];
    const [draggedItem] = updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(targetIndex, 0, draggedItem);

    // Actualizar el orden
    const reorderedImages = updatedImages.map((img, index) => ({
      ...img,
      order: index,
    }));

    onChange("images", "images", reorderedImages);
  };

  const handleDragEnd = () => {
    setDraggedImage(null);
  };

  return (
    <div className="space-y-8">
      <PropertyFormSection
        title="Galería de imágenes"
        description="Sube imágenes de la propiedad (máximo 20 imágenes)"
      >
        <div className="space-y-4">
          <ImageGalleryUploader onUpload={handleImageUpload} />

          {errors.images && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.images}</span>
            </div>
          )}

          {formData.images.length > 0 && (
            <div className="space-y-2">
              <Label>Imágenes subidas ({formData.images.length})</Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Arrastra para reordenar. Marca una imagen como principal.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.images.map((image) => (
                  <div
                    key={image.id}
                    draggable
                    onDragStart={() => handleDragStart(image.id)}
                    onDragOver={(e) => handleDragOver(e, image.id)}
                    onDragEnd={handleDragEnd}
                    className={`relative group border rounded-md overflow-hidden ${
                      image.isPrimary
                        ? "ring-2 ring-blue-500 dark:ring-blue-400"
                        : ""
                    } ${draggedImage === image.id ? "opacity-50" : ""}`}
                  >
                    <div className="aspect-video relative">
                      <Image
                        fill
                        src={image.url || getFallbackImage(image.id)}
                        alt="Property"
                        className="w-full h-full object-cover"
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:bg-black/20"
                            onClick={() => handleSetPrimary(image.id)}
                          >
                            {image.isPrimary ? (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:bg-black/20"
                            onClick={() => handleRemoveImage(image.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {image.isPrimary && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-md">
                          Principal
                        </div>
                      )}

                      <div className="absolute top-2 right-2 bg-black/50 text-white rounded-full h-6 w-6 flex items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                        <GripVertical className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PropertyFormSection>
    </div>
  );
}
