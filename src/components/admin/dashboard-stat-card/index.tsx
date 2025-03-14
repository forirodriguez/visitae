import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  description: string;
  icon: React.ReactNode;
}

export default function DashboardStatCard({
  title,
  value,
  change,
  trend,
  description,
  icon,
}: DashboardStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1">
          <span
            className={cn(
              "flex items-center text-xs font-medium",
              trend === "up" && "text-green-600 dark:text-green-500",
              trend === "down" && "text-red-600 dark:text-red-500",
              trend === "neutral" && "text-gray-600 dark:text-gray-400"
            )}
          >
            {trend === "up" && <TrendingUp className="mr-1 h-3 w-3" />}
            {trend === "down" && <TrendingDown className="mr-1 h-3 w-3" />}
            {change}
          </span>
          <CardDescription className="ml-2 text-xs">
            {description}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
