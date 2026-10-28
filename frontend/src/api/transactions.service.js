import api from "./axios";
import { TRANSACTIONS } from "./endpoints";

const TRANSACTIONS_URL = TRANSACTIONS || "/transactions/";

/**
 * Obtiene transacciones paginadas con filtros opcionales
 * @param {Object} params - { page, page_size, type, category, start_date, end_date }
 */
export const getTransactions = async (params = {}) => {
  const { data } = await api.get(TRANSACTIONS_URL, { params });
  return data;
};

/**
 * Crea una nueva transacción
 */
export const createTransaction = async (payload) => {
  const { data } = await api.post(TRANSACTIONS_URL, payload);
  return data;
};

/**
 * Actualiza parcialmente una transacción existente
 */
export const updateTransaction = async (id, payload) => {
  const { data } = await api.patch(`${TRANSACTIONS_URL}${id}/`, payload);
  return data;
};

/**
 * Elimina una transacción
 */
export const deleteTransaction = async (id) => {
  await api.delete(`${TRANSACTIONS_URL}${id}/`);
  return true;
};

export default {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
