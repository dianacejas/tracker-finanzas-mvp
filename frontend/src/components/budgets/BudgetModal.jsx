import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const MONTHS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

export default function BudgetModal({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  initialData = null,
  defaultMonth,
  defaultYear,
}) {
  const isEdit = Boolean(initialData);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      category: "",
      amount: "",
      month: defaultMonth,
      year: defaultYear,
    },
  });

  useEffect(() => {
    if (isOpen) {
      setApiError("");
      if (initialData) {
        reset({
          category: initialData.category,
          amount: initialData.amount,
          month: initialData.month,
          year: initialData.year,
        });
      } else {
        reset({
          category: "",
          amount: "",
          month: defaultMonth,
          year: defaultYear,
        });
      }
    }
  }, [isOpen, initialData, defaultMonth, defaultYear, reset]);

  const expenseCategories = categories.filter(
    (cat) => cat.type === "EXPENSE" || cat.type === "BOTH"
  );

  const handleFormSubmit = async (data) => {
    setApiError("");
    try {
      const payload = {
        category: parseInt(data.category),
        amount: data.amount,
        month: parseInt(data.month),
        year: parseInt(data.year),
      };
      await onSubmit(payload);
      onClose();
    } catch (error) {
      const detail = error?.response?.data;
      if (detail) {
        if (typeof detail === "string") {
          setApiError(detail);
        } else if (detail.non_field_errors) {
          setApiError(detail.non_field_errors[0]);
        } else {
          const firstError = Object.values(detail)[0];
          setApiError(Array.isArray(firstError) ? firstError[0] : firstError);
        }
      } else {
        setApiError("Error al guardar el presupuesto");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-100">
            {isEdit ? "Editar Presupuesto" : "Nuevo Presupuesto"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-neutral-300">Categoría</label>
            <select
              {...register("category", { required: "Selecciona una categoría" })}
              disabled={isEdit}
              className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-neutral-600 focus:outline-none disabled:opacity-50"
            >
              <option value="">Seleccionar...</option>
              {expenseCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-rose-400">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-neutral-300">Monto presupuestado</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              {...register("amount", {
                required: "Ingresa un monto",
                min: { value: 0.01, message: "El monto debe ser mayor a 0" },
              })}
              className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-neutral-600 focus:outline-none"
              placeholder="0.00"
            />
            {errors.amount && <p className="mt-1 text-xs text-rose-400">{errors.amount.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-neutral-300">Mes</label>
              <select
                {...register("month", { required: true })}
                className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-neutral-600 focus:outline-none"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-neutral-300">Año</label>
              <input
                type="number"
                {...register("year", { required: true, min: 2000 })}
                className="mt-1 w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-neutral-600 focus:outline-none"
              />
            </div>
          </div>

          {apiError && (
            <div className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-400">
              {apiError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear presupuesto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
