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

/**
 * Formatea un porcentaje numérico con símbolo %.
 * @param {number|string} value
 * @param {number} decimals
 */
export const formatPercentage = (value, decimals = 1) => {
  const num = typeof value === "string" ? parseFloat(value) : Number(value);
  const val = Number.isNaN(num) ? 0 : num;
  return `${val.toFixed(decimals)}%`;
};

/**
 * Calcula el porcentaje seguro entre un valor consumido y un límite.
 * @param {number|string} spent
 * @param {number|string} limit
 */
export const calculatePercentage = (spent, limit) => {
  const s = typeof spent === "string" ? parseFloat(spent) : Number(spent) || 0;
  const l = typeof limit === "string" ? parseFloat(limit) : Number(limit) || 0;
  if (l <= 0) return 0;
  return (s / l) * 100;
};

export default {
  formatCurrency,
  formatDate,
  formatPercentage,
  calculatePercentage,
};
