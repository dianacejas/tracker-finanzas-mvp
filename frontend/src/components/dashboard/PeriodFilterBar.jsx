import { Calendar } from "lucide-react";

export default function PeriodFilterBar({ period, onChange }) {
  const options = [
    { value: "current", label: "Mes actual" },
    { value: "previous", label: "Mes anterior" },
    { value: "last6", label: "Últimos 6 meses" },
  ];

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-neutral-500" aria-hidden="true" />
      <div className="flex rounded-lg border border-neutral-800 bg-neutral-900 p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              period === option.value
                ? "bg-neutral-800 text-neutral-100"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
