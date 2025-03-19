import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: "added" | "edited" | "deleted" | "published";
  property: {
    id: string;
    title: string;
    image: string;
  };
  user: {
    name: string;
    avatar: string;
  };
  timestamp: string;
}

const recentActivities: ActivityItem[] = [
  {
    id: "act1",
    type: "added",
    property: {
      id: "prop1",
      title: "Apartamento de lujo con vistas al mar",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=40&h=40&auto=format&fit=crop",
    },
    user: {
      name: "Carlos Rodríguez",
      avatar:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=32&h=32&auto=format&fit=crop",
    },
    timestamp: "Hace 35 minutos",
  },
  {
    id: "act2",
    type: "edited",
    property: {
      id: "prop2",
      title: "Casa adosada con jardín privado",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=40&h=40&auto=format&fit=crop",
    },
    user: {
      name: "Laura Martínez",
      avatar:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=32&h=32&auto=format&fit=crop",
    },
    timestamp: "Hace 2 horas",
  },
  {
    id: "act3",
    type: "published",
    property: {
      id: "prop3",
      title: "Ático dúplex con terraza panorámica",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=40&h=40&auto=format&fit=crop",
    },
    user: {
      name: "Miguel Sánchez",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=32&h=32&auto=format&fit=crop",
    },
    timestamp: "Hace 3 horas",
  },
  {
    id: "act4",
    type: "deleted",
    property: {
      id: "prop4",
      title: "Piso reformado en zona exclusiva",
      image:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=40&h=40&auto=format&fit=crop",
    },
    user: {
      name: "Ana García",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=32&h=32&auto=format&fit=crop",
    },
    timestamp: "Hace 5 horas",
  },
  {
    id: "act5",
    type: "edited",
    property: {
      id: "prop5",
      title: "Villa de lujo con piscina privada",
      image:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=40&h=40&auto=format&fit=crop",
    },
    user: {
      name: "Javier López",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=32&h=32&auto=format&fit=crop",
    },
    timestamp: "Hace 8 horas",
  },
];

export default function RecentActivityList() {
  const getActivityLabel = (type: ActivityItem["type"]) => {
    switch (type) {
      case "added":
        return {
          text: "Añadida",
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        };
      case "edited":
        return {
          text: "Editada",
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        };
      case "deleted":
        return {
          text: "Eliminada",
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        };
      case "published":
        return {
          text: "Publicada",
          color:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        };
      default:
        return {
          text: "Actualizada",
          color:
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        };
    }
  };

  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => {
        const activityLabel = getActivityLabel(activity.type);

        return (
          <div key={activity.id} className="flex items-start space-x-4">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={activity.property.image}
                alt={activity.property.title}
              />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              <div className="flex items-center">
                <p className="text-sm font-medium leading-none">
                  {activity.property.title}
                </p>
                <Badge
                  variant="secondary"
                  className={cn(
                    "ml-2 px-1.5 py-0.5 text-xs",
                    activityLabel.color
                  )}
                >
                  {activityLabel.text}
                </Badge>
              </div>

              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Por {activity.user.name}</span>
                <span className="mx-1">•</span>
                <span>{activity.timestamp}</span>
              </div>
            </div>

            <Avatar className="h-6 w-6">
              <AvatarImage
                src={activity.user.avatar}
                alt={activity.user.name}
              />
              <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        );
      })}
    </div>
  );
}
