import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio.")
    .email("Ingresa un email válido."),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria."),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "El nombre de usuario debe tener al menos 3 caracteres.")
      .max(150, "El nombre de usuario no puede exceder 150 caracteres."),
    email: z
      .string()
      .trim()
      .min(1, "El email es obligatorio.")
      .email("Ingresa un email válido."),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z
      .string()
      .min(1, "Confirma tu contraseña."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });
