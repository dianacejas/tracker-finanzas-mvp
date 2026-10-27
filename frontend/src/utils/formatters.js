/**
 * Formatea un monto a moneda legible
 * @param {number|string} amount
 * @param {string} currency
 */
export const formatCurrency = (amount, currency = "USD") => {
  const numericAmount = typeof amount === "string" ? Number(amount) : Number(amount);

  if (Number.isNaN(numericAmount)) {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(0);
  }

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

/**
 * Formatea una fecha YYYY-MM-DD a DD/MM/YYYY
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";

  // Intentar parseo directo para evitar desfases por zona horaria
  const parts = String(dateString).split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("es-ES").format(date);
};

export default {
  formatCurrency,
  formatDate,
};
