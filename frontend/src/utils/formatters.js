/**
 * Formatea un monto a moneda legible estandarizada con separadores de miles y decimales.
 * Por defecto utiliza formato argentino (es-AR / ARS).
 * @param {number|string} amount
 * @param {string} currency
 * @param {string} locale
 */
export const formatCurrency = (amount, currency = "ARS", locale = "es-AR") => {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  const val = Number.isNaN(numericAmount) ? 0 : numericAmount;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  } catch {
    return `$ ${val.toFixed(2)}`;
  }
};

/**
 * Formatea una fecha YYYY-MM-DD a DD/MM/YYYY
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";

  const parts = String(dateString).split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("es-AR").format(date);
};

export default {
  formatCurrency,
  formatDate,
};
