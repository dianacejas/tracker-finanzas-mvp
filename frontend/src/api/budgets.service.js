import api from "./axios";

export const budgetsService = {
  getBudgets: async (params = {}) => {
    const response = await api.get("/budgets/", { params });
    return response.data;
  },

  createBudget: async (data) => {
    const response = await api.post("/budgets/", data);
    return response.data;
  },

  updateBudget: async (id, data) => {
    const response = await api.patch(`/budgets/${id}/`, data);
    return response.data;
  },

  deleteBudget: async (id) => {
    const response = await api.delete(`/budgets/${id}/`);
    return response.data;
  },
};

export default budgetsService;
