import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../api/transactions.service";
import { getCategories } from "../api/categories.service";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionTable from "../components/transactions/TransactionTable";
import TransactionModal from "../components/transactions/TransactionModal";
import DeleteConfirmModal from "../components/transactions/DeleteConfirmModal";

const DEFAULT_FILTERS = {
  type: "ALL",
  category: "",
  start_date: "",
  end_date: "",
};

const PAGE_SIZE = 20;

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cargar categorías al montar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    fetchCategories();
  }, []);

  // Construir parámetros para la API
  const buildParams = useCallback(() => {
    const params = {
      page,
      page_size: PAGE_SIZE,
    };

    if (filters.type && filters.type !== "ALL") {
      params.type = filters.type;
    }
    if (filters.category) {
      params.category = filters.category;
    }
    if (filters.start_date) {
      params.start_date = filters.start_date;
    }
    if (filters.end_date) {
      params.end_date = filters.end_date;
    }

    return params;
  }, [filters, page]);

  // Cargar transacciones
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getTransactions(buildParams());
      // Soportar paginación DRF
      if (Array.isArray(data)) {
        setTransactions(data);
        setCount(data.length);
      } else {
        setTransactions(data.results || []);
        setCount(data.count || 0);
      }
    } catch (err) {
      console.error("Error al cargar transacciones:", err);
      setError("No se pudieron cargar las transacciones.");
      setTransactions([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Cuando cambian los filtros, volver a página 1
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleFilterReset = (resetValues) => {
    setFilters(resetValues);
    setPage(1);
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  // Guardar transacción (crear o editar)
  const handleSubmit = async (payload) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, payload);
      } else {
        await createTransaction(payload);
      }
      handleCloseModal();
      await fetchTransactions();
    } catch (err) {
      console.error("Error al guardar transacción:", err);
      // Los errores de validación se mostrarán desde el backend si es necesario
      throw err;
    }
  };

  // Abrir modal de confirmación para eliminar
  const handleDeleteClick = (transaction) => {
    setDeletingTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  // Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;
    setIsDeleting(true);
    try {
      await deleteTransaction(deletingTransaction.id);
      setIsDeleteModalOpen(false);
      setDeletingTransaction(null);
      await fetchTransactions();
    } catch (err) {
      console.error("Error al eliminar transacción:", err);
      alert("No se pudo eliminar la transacción.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Cerrar modal de eliminación
  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setDeletingTransaction(null);
  };

  // Cambio de página
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Transacciones
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gestiona tus ingresos y gastos
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Nueva Transacción
          </button>
        </div>

        {/* Filtros */}
        <TransactionFilters
          categories={categories}
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleFilterReset}
        />

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Tabla */}
        <TransactionTable
          transactions={transactions}
          loading={loading}
          page={page}
          count={count}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {/* Modales */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          transaction={editingTransaction}
          categories={categories}
        />

        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          transaction={deletingTransaction}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}
