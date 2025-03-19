import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PropertyStatus = "publicada" | "borrador" | "destacada" | "inactiva";

interface PropertyStatusBadgeProps {
  status: PropertyStatus | string;
}

const PropertyStatusBadge: React.FC<PropertyStatusBadgeProps> = ({
  status,
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "publicada":
        return {
          label: "Publicada",
          className: "bg-green-100 text-green-800",
        };
      case "borrador":
        return {
          label: "Borrador",
          className: "bg-gray-100 text-gray-800",
        };
      case "destacada":
        return {
          label: "Destacada",
          className: "bg-blue-100 text-blue-800",
        };
      case "inactiva":
        return {
          label: "Inactiva",
          className: "bg-red-100 text-red-800",
        };
      default:
        return {
          label: status || "Desconocido",
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  const { label, className } = getStatusConfig(status);

  return (
    <Badge variant="secondary" className={cn("font-medium text-xs", className)}>
      {label}
    </Badge>
  );
};

export default PropertyStatusBadge;
