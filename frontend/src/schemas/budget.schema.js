import { z } from "zod";

export const budgetSchema = z.object({
  category: z
    .number({ invalid_type_error: "Debes seleccionar una categoría." })
    .int()
    .positive("Debes seleccionar una categoría."),
  amount: z
    .number({ invalid_type_error: "El monto debe ser un número." })
    .positive("El monto del presupuesto debe ser mayor a 0.")
    .max(999999999.99, "El monto supera el límite permitido."),
  month: z
    .number()
    .int()
    .min(1, "Mes inválido.")
    .max(12, "Mes inválido."),
  year: z
    .number()
    .int()
    .min(2000, "Año inválido.")
    .max(2100, "Año inválido."),
});
