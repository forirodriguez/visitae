import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

interface PropertyTimelineProps {
  timeline: {
    id: string;
    date: string;
    action: string;
    user: {
      name: string;
      avatar: string;
    };
    details?: string;
  }[];
}

// Colección de avatares reales para usar como alternativa a placeholders
const defaultAvatars = [
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=32&h=32&auto=format&fit=crop", // Carlos
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=32&h=32&auto=format&fit=crop", // María
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=32&h=32&auto=format&fit=crop", // Juan
];

export default function PropertyTimeline({ timeline }: PropertyTimelineProps) {
  // Ordenar eventos por fecha (más recientes primero)
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getActionColor = (action: string) => {
    if (action.includes("creada")) return "bg-green-100 dark:bg-green-900";
    if (action.includes("publicada")) return "bg-blue-100 dark:bg-blue-900";
    if (action.includes("destacada")) return "bg-yellow-100 dark:bg-yellow-900";
    if (action.includes("actualizada"))
      return "bg-purple-100 dark:bg-purple-900";
    if (action.includes("eliminada")) return "bg-red-100 dark:bg-red-900";
    return "bg-gray-100 dark:bg-gray-800";
  };

  // Función para obtener un avatar aleatorio pero consistente basado en el nombre
  const getDefaultAvatar = (name: string) => {
    // Usar la primera letra del nombre como un índice simple
    const index = name.charCodeAt(0) % defaultAvatars.length;
    return defaultAvatars[index];
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Historial de actividad</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Registro de cambios y acciones realizadas en esta propiedad
        </p>
      </div>

      <div className="space-y-4">
        {sortedTimeline.map((event) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="relative h-8 w-8">
                <Image
                  fill
                  src={event.user.avatar || getDefaultAvatar(event.user.name)}
                  alt={event.user.name}
                  className="rounded-full object-cover"
                />
                <span
                  className={`absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white dark:border-gray-900 ${getActionColor(event.action)}`}
                />
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{event.action}</p>
                <time className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(event.date), {
                    addSuffix: true,
                    locale: es,
                  })}
                </time>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Por {event.user.name}
              </p>
              {event.details && <p className="text-sm mt-1">{event.details}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
