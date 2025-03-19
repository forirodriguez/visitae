interface PropertyInfoCardProps {
  title: string;
  items: {
    label: string;
    value: string;
  }[];
}

export default function PropertyInfoCard({
  title,
  items,
}: PropertyInfoCardProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between py-1 border-b border-gray-100 last:border-0"
          >
            <span className="text-gray-500">{item.label}</span>
            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
