import type { ReactNode } from "react";

interface PropertyFormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function PropertyFormSection({
  title,
  description,
  children,
}: PropertyFormSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
