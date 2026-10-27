import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "INCOME", label: "Ingreso" },
  { value: "EXPENSE", label: "Gasto" },
];

/**
 * Modal para crear/editar transacciones
 */
export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  transaction = null,
  categories = [],
}) {
  const isEditing = Boolean(transaction);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      type: "EXPENSE",
      category: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    },
  });

  const selectedType = watch("type");

  // Filtrar categorías según el tipo seleccionado (mismo tipo o BOTH)
  const filteredCategories = useMemo(() => {
    if (!selectedType) return categories;
    return categories.filter((category) => {
      if (!category?.type) return true;
      if (category.type === "BOTH") return true;
      return category.type === selectedType;
    });
  }, [categories, selectedType]);

  // Al abrir el modal, cargar datos para edición o resetear para creación
  useEffect(() => {
    if (isOpen) {
      if (isEditing && transaction) {
        reset({
          type: transaction.type || "EXPENSE",
          category: transaction.category || "",
          amount: transaction.amount || "",
          date: transaction.date || new Date().toISOString().split("T")[0],
          description: transaction.description || "",
        });
      } else {
        reset({
          type: "EXPENSE",
          category: "",
          amount: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
        });
      }
    }
  }, [isOpen, isEditing, transaction, reset]);

  // Si la categoría seleccionada ya no es válida para el tipo elegido, limpiar selección
  useEffect(() => {
    const currentCategoryId = watch("category");
    if (!currentCategoryId) return;

    const categoryExists = filteredCategories.some(
      (cat) => String(cat.id) === String(currentCategoryId)
    );

    if (!categoryExists) {
      setValue("category", "");
    }
  }, [selectedType, filteredCategories, setValue, watch]);

  const handleFormSubmit = async (data) => {
    // Asegurar que amount sea string/number coherente con backend
    const payload = {
      ...data,
      amount: String(data.amount),
      category: Number(data.category),
    };
    await onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Editar transacción" : "Nueva transacción"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="px-6 py-4 space-y-4">
          {/* Tipo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de transacción
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                    selectedType === option.value
                      ? option.value === "INCOME"
                        ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register("type", { required: "El tipo es obligatorio" })}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.type.message}</p>
            )}
          </div>

          {/* Categoría */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoría
            </label>
            <select
              {...register("category", { required: "La categoría es obligatorio" })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Selecciona una categoría</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>
            )}
            {filteredCategories.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No hay categorías disponibles para este tipo.
              </p>
            )}
          </div>

          {/* Monto */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Monto
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              {...register("amount", {
                required: "El monto es obligatorio",
                min: {
                  value: 0.01,
                  message: "El monto debe ser mayor a 0",
                },
                valueAsNumber: false,
              })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.amount && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>
            )}
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Fecha
            </label>
            <input
              type="date"
              {...register("date", { required: "La fecha es obligatoria" })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.date && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.date.message}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción (opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Descripción del movimiento..."
              {...register("description")}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* Botones */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {isSubmitting
                ? "Guardando..."
                : isEditing
                ? "Guardar cambios"
                : "Crear transacción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
