import api from "./axios";
import { CATEGORIES } from "./endpoints";

/**
 * Obtiene el listado de categorías visibles para el usuario autenticado
 * (globales + privadas propias).
 */
export const getCategories = async (params = {}) => {
  const { data } = await api.get(CATEGORIES, { params });
  // Soportar respuesta paginada o array plano
  if (Array.isArray(data)) {
    return data;
  }
  if (Array.isArray(data?.results)) {
    return data.results;
  }
  return [];
};

export default {
  getCategories,
};
