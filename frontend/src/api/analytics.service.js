import api from "./axios";

export const analyticsService = {
  getFinancialSummary: async (params = {}) => {
    const response = await api.get("/analytics/summary/", { params });
    return response.data;
  },

  getCategoryBreakdown: async (params = {}) => {
    const response = await api.get("/analytics/category-breakdown/", {
      params,
    });
    return response.data;
  },

  getMonthlyTrend: async (params = {}) => {
    const response = await api.get("/analytics/monthly-trend/", {
      params,
    });
    return response.data;
  },
};

export default analyticsService;
