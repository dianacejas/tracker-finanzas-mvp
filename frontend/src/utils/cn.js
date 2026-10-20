import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases condicionales (clsx) resolviendo conflictos de Tailwind
 * (tailwind-merge). Las clases posteriores ganan ante utilidades en conflicto.
 *
 * @param {...any} inputs Clases, arrays u objetos condicionales.
 * @returns {string} Cadena de clases lista para el atributo className.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
