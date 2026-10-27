import { useEffect, useState } from "react";

const TYPE_OPTIONS = [
  { value: "ALL", label: "Todos" },
  { value: "INCOME", label: "Ingresos" },
  { value: "EXPENSE", label: "Gastos" },
];

/**
 * Barra de filtros para transacciones
 */
export default function TransactionFilters({
  categories = [],
  filters,
  onChange,
  onReset,
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    const next = { ...localFilters, [key]: value };
    setLocalFilters(next);
    onChange(next);
  };

  const handleReset = () => {
    const resetValues = {
      type: "ALL",
      category: "",
      start_date: "",
      end_date: "",
    };
    setLocalFilters(resetValues);
    if (onReset) {
      onReset(resetValues);
    } else {
      onChange(resetValues);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Tipo */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Tipo
          </label>
          <select
            value={localFilters.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categoría */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Categoría
          </label>
          <select
            value={localFilters.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha desde */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Desde
          </label>
          <input
            type="date"
            value={localFilters.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Fecha hasta */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Hasta
          </label>
          <input
            type="date"
            value={localFilters.end_date}
            onChange={(e) => handleChange("end_date", e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Limpiar filtros */}
        <div className="flex flex-col gap-1 justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
