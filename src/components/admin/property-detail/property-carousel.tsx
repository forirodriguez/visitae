"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import Image from "next/image";

interface PropertyCarouselProps {
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
    order: number;
  }[];
}

export default function PropertyCarousel({ images }: PropertyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  // URL de imagen por defecto cuando no hay imágenes disponibles
  const defaultImageUrl =
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&h=600&auto=format&fit=crop";

  const goToPrevious = () => {
    const isFirstImage = currentIndex === 0;
    const newIndex = isFirstImage ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastImage = currentIndex === images.length - 1;
    const newIndex = isLastImage ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          fill
          src={images[currentIndex]?.url || defaultImageUrl}
          alt={`Property image ${currentIndex + 1}`}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
              onClick={() => setShowFullscreen(true)}
            >
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">Ver a pantalla completa</span>
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Imagen anterior</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
          onClick={goToNext}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Imagen siguiente</span>
        </Button>
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2 p-4 overflow-x-auto">
        {images.map((image, index) => (
          <button
            key={image.id}
            className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden ${
              index === currentIndex
                ? "ring-2 ring-blue-500"
                : "opacity-70 hover:opacity-100"
            }`}
            onClick={() => goToImage(index)}
          >
            <Image
              fill
              src={
                image.url ||
                "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=64&h=64&auto=format&fit=crop"
              }
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-cover"
            />
            {image.isPrimary && (
              <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-[8px] text-center py-0.5">
                Principal
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Diálogo de pantalla completa */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-screen-lg p-0 bg-black">
          <div className="relative h-[80vh] flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white z-10"
              onClick={() => setShowFullscreen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Imagen anterior</span>
            </Button>

            <Image
              fill
              src={images[currentIndex]?.url || defaultImageUrl}
              alt={`Property image ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
              onClick={goToNext}
            >
              <ChevronRight className="h-6 w-6" />
              <span className="sr-only">Imagen siguiente</span>
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
