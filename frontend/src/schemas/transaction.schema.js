import { z } from "zod";

export const transactionSchema = z.object({
  amount: z
    .number({ invalid_type_error: "El monto debe ser un número." })
    .positive("El monto debe ser mayor a cero.")
    .max(999999999.99, "El monto supera el límite permitido."),
  category: z
    .number({ invalid_type_error: "Debes seleccionar una categoría." })
    .int()
    .positive("Debes seleccionar una categoría."),
  type: z.enum(["INCOME", "EXPENSE"]),
  date: z
    .string()
    .min(1, "La fecha es obligatoria.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (AAAA-MM-DD)."),
  description: z
    .string()
    .trim()
    .min(1, "El concepto o descripción es obligatorio.")
    .max(255, "La descripción no puede exceder 255 caracteres."),
});
