"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

export default function HeroSection() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1600&h=600&auto=format&fit=crop')",
            filter: "brightness(0.7)",
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Encuentra tu hogar ideal
          </h1>
          <p className="text-xl text-white/90">
            Miles de propiedades a un clic de distancia
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <Tabs defaultValue="compra" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="compra">Compra</TabsTrigger>
                <TabsTrigger value="alquiler">Alquiler</TabsTrigger>
              </TabsList>

              <TabsContent value="compra" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Buscar por ubicación, barrio o ciudad"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de propiedad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="duplex">Dúplex</SelectItem>
                        <SelectItem value="terreno">Terreno</SelectItem>
                        <SelectItem value="oficina">Oficina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-1 md:col-span-1">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Precio</span>
                        <span>
                          €{priceRange[0].toLocaleString()} - €
                          {priceRange[1].toLocaleString()}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[0, 1000000]}
                        max={2000000}
                        step={10000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>
                  </div>

                  <div>
                    <Button className="w-full bg-blue-800 hover:bg-blue-900">
                      Buscar
                    </Button>
                  </div>
                </div>

                <div>
                  <button
                    onClick={toggleAdvancedFilters}
                    className="flex items-center justify-center w-full text-sm text-blue-800 hover:text-blue-900 transition-colors"
                  >
                    {showAdvancedFilters ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        <span>Ocultar filtros avanzados</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        <span>Mostrar filtros avanzados</span>
                      </>
                    )}
                  </button>

                  {showAdvancedFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      <div>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Dormitorios" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                            <SelectItem value="5">5+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Baños" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Superficie (m²)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50">50+ m²</SelectItem>
                            <SelectItem value="100">100+ m²</SelectItem>
                            <SelectItem value="150">150+ m²</SelectItem>
                            <SelectItem value="200">200+ m²</SelectItem>
                            <SelectItem value="300">300+ m²</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="alquiler" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Buscar por ubicación, barrio o ciudad"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de propiedad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="duplex">Dúplex</SelectItem>
                        <SelectItem value="habitacion">Habitación</SelectItem>
                        <SelectItem value="oficina">Oficina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-1 md:col-span-1">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Precio mensual</span>
                        <span>
                          €{(priceRange[0] / 100).toLocaleString()} - €
                          {(priceRange[1] / 100).toLocaleString()}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[0, 1000000]}
                        max={500000}
                        step={5000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                    </div>
                  </div>

                  <div>
                    <Button className="w-full bg-blue-800 hover:bg-blue-900">
                      Buscar
                    </Button>
                  </div>
                </div>

                <div>
                  <button
                    onClick={toggleAdvancedFilters}
                    className="flex items-center justify-center w-full text-sm text-blue-800 hover:text-blue-900 transition-colors"
                  >
                    {showAdvancedFilters ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        <span>Ocultar filtros avanzados</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        <span>Mostrar filtros avanzados</span>
                      </>
                    )}
                  </button>

                  {showAdvancedFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      <div>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Dormitorios" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                            <SelectItem value="4">4+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Baños" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1+</SelectItem>
                            <SelectItem value="2">2+</SelectItem>
                            <SelectItem value="3">3+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Amueblado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="si">Sí</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="parcial">
                              Parcialmente
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}
