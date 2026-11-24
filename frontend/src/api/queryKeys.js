/**
 * Fábrica centralizada de Query Keys para TanStack Query.
 * Previene el uso de strings mágicos dispersos por el código.
 */
export const QUERY_KEYS = {
  categories: ["categories"],
  transactions: (params = {}) => ["transactions", params],
  budgets: (params = {}) => ["budgets", params],
  analyticsSummary: (period) => ["analytics", "summary", period],
  analyticsExpensesByCategory: (period) => ["analytics", "expenses-by-category", period],
  analyticsMonthlyComparison: (year) => ["analytics", "monthly-comparison", year],
};
