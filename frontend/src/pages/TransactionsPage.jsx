import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Trash2, 
  X,
  ArrowLeftRight,
  AlertCircle
} from 'lucide-react';
import { 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  DatePicker 
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactions, createTransaction, deleteTransaction } from "../api/transactions.service";
import { getCategories } from "../api/categories.service";
import { extractApiError } from "../api/authApi";
import { QUERY_KEYS } from "../api/queryKeys";
import { transactionSchema } from "../schemas/transaction.schema";
import { formatCurrency } from "../utils/formatters";
import { useToast } from "../components/common/Toast";
import { SkeletonTableRows } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";

export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Paginación y Filtros
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'income' | 'expense'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'amount-desc' | 'amount-asc'

  // Modal de Nueva Transacción
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newType, setNewType] = useState('expense'); // 'expense' | 'income'
  const [selectedDate, setSelectedDate] = useState(() => today(getLocalTimeZone()));
  const [modalError, setModalError] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);

  // Parámetros para la API
  const queryParams = useMemo(() => {
    const p = { page, page_size: pageSize };
    if (selectedType !== 'all') {
      p.type = selectedType.toUpperCase();
    }
    if (selectedCategory !== 'all') {
      p.category = Number(selectedCategory);
    }
    return p;
  }, [page, pageSize, selectedType, selectedCategory]);

  // Consultas con TanStack Query
  const {
    data: txResponse,
    isLoading: loading,
    error: queryError,
    refetch: loadTransactions,
  } = useQuery({
    queryKey: QUERY_KEYS.transactions(queryParams),
    queryFn: () => getTransactions(queryParams),
  });

  const { data: rawCategories = [] } = useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: getCategories,
  });

  const categories = useMemo(() => {
    return Array.isArray(rawCategories) ? rawCategories : [];
  }, [rawCategories]);

  const transactions = useMemo(() => {
    return Array.isArray(txResponse) ? txResponse : txResponse?.results || [];
  }, [txResponse]);

  const totalCount = useMemo(() => {
    return Array.isArray(txResponse) ? txResponse.length : txResponse?.count || 0;
  }, [txResponse]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const error = queryError ? extractApiError(queryError, "No se pudieron cargar las transacciones.") : null;

  // Mutaciones
  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      addToast("Transacción registrada con éxito", "success");
      setIsModalOpen(false);
    },
    onError: (err) => {
      setModalError(extractApiError(err, "No se pudo guardar la transacción."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      addToast("Transacción eliminada con éxito", "info");
    },
    onError: (err) => {
      alert(extractApiError(err, "No se pudo eliminar la transacción."));
    },
  });

  // Categorías filtradas por tipo para el modal
  const eligibleCategories = useMemo(() => {
    const requiredType = newType === 'income' ? 'INCOME' : 'EXPENSE';
    return categories.filter(c => c.type === 'BOTH' || c.type === requiredType);
  }, [categories, newType]);

  const handleOpenModal = () => {
    setModalError('');
    setNewTitle('');
    setNewAmount('');
    setNewType('expense');
    setSelectedDate(today(getLocalTimeZone()));

    const initialEligible = categories.filter(c => c.type === 'BOTH' || c.type === 'EXPENSE');
    setNewCategoryId(initialEligible.length > 0 ? String(initialEligible[0].id) : '');

    setIsModalOpen(true);
  };

  const handleTypeChange = (type) => {
    setNewType(type);
    const requiredType = type === 'income' ? 'INCOME' : 'EXPENSE';
    const nextEligible = categories.filter(c => c.type === 'BOTH' || c.type === requiredType);
    setNewCategoryId(nextEligible.length > 0 ? String(nextEligible[0].id) : '');
  };

  // Filtrado y ordenamiento en cliente sobre la página actual
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const catName = t.category_detail?.name || '';
        const desc = t.description || '';
        const matchesSearch = 
          desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          catName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'amount-desc') return Math.abs(Number(b.amount)) - Math.abs(Number(a.amount));
        if (sortBy === 'amount-asc') return Math.abs(Number(a.amount)) - Math.abs(Number(b.amount));
        return 0;
      });
  }, [transactions, searchTerm, sortBy]);

  const pageBalance = useMemo(() => {
    return filteredTransactions.reduce((acc, curr) => {
      const sign = curr.type === 'INCOME' ? 1 : -1;
      return acc + (sign * Number(curr.amount || 0));
    }, 0);
  }, [filteredTransactions]);

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    setModalError('');
    const val = parseFloat(newAmount);
    const dateStr = selectedDate ? selectedDate.toString() : new Date().toISOString().split('T')[0];

    const validation = transactionSchema.safeParse({
      amount: val,
      category: Number(newCategoryId),
      type: newType === 'income' ? 'INCOME' : 'EXPENSE',
      date: dateStr,
      description: newTitle,
    });

    if (!validation.success) {
      setModalError(validation.error.errors[0]?.message || "Datos de transacción inválidos.");
      return;
    }

    createMutation.mutate({
      amount: validation.data.amount.toFixed(2),
      category: validation.data.category,
      type: validation.data.type,
      date: validation.data.date,
      description: validation.data.description,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-['Inter'] transition-colors duration-300">
      
      {/* Cabecera y Botón Nuevo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#cac4ce]/40 dark:border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-[#9067c6]/10 text-[#9067c6] border border-[#9067c6]/20">
            <ArrowLeftRight className="w-6 h-6"/>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242038] dark:text-[#f7ece1] tracking-tight">
                Transacciones
              </h1>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#9067c6]/10 text-[#9067c6] border border-[#9067c6]/20">
                Historial Real
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#8d86c9] dark:text-[#cac4ce] font-medium mt-0.5">
              Gestión centralizada de todos tus ingresos y egresos
            </p>
          </div>
        </div>

        <Button 
          color="primary"
          onPress={handleOpenModal}
          className="bg-[#9067c6] hover:bg-[#8d86c9] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#9067c6]/20 rounded-xl cursor-pointer w-full sm:w-auto"
          startContent={<Plus className="w-4 h-4" />}
        >
          Nueva Transacción
        </Button>
      </div>

      {/* Alerta de Error de API */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <Button 
            size="sm"
            variant="light"
            color="danger"
            onPress={() => loadTransactions()}
            className="ml-auto font-bold"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 bg-white dark:bg-[#1c182d] p-4 rounded-2xl border border-[#cac4ce]/60 dark:border-white/10 shadow-sm">
        
        {/* Buscador */}
        <div className="sm:col-span-5 relative">
          <Input
            placeholder="Buscar por descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<Search className="w-4 h-4 text-[#8d86c9] dark:text-[#cac4ce]/60" />}
            size="sm"
            variant="bordered"
            classNames={{
              inputWrapper: "h-10 rounded-xl border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 focus-within:border-[#9067c6]",
            }}
          />
        </div>

        {/* Filtro por Categoría */}
        <div className="sm:col-span-3">
          <Select
            label="Categoría"
            placeholder="Todas"
            selectedKeys={new Set([selectedCategory])}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0];
              if (val) {
                setSelectedCategory(val);
                setPage(1);
              }
            }}
            size="sm"
            variant="bordered"
            classNames={{
              trigger: "h-10 rounded-xl border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25",
              popoverContent: "bg-white dark:bg-[#1c182d] border border-slate-200 dark:border-white/15 text-[#242038] dark:text-[#f7ece1] z-[150]",
            }}
          >
            <SelectItem key="all" textValue="Todas las categorías">Todas las categorías</SelectItem>
            {categories.map((c) => (
              <SelectItem key={String(c.id)} textValue={c.name}>{c.name}</SelectItem>
            ))}
          </Select>
        </div>

        {/* Filtro por Tipo */}
        <div className="sm:col-span-2">
          <Select
            label="Tipo"
            placeholder="Todos"
            selectedKeys={new Set([selectedType])}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0];
              if (val) {
                setSelectedType(val);
                setPage(1);
              }
            }}
            size="sm"
            variant="bordered"
            classNames={{
              trigger: "h-10 rounded-xl border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25",
              popoverContent: "bg-white dark:bg-[#1c182d] border border-slate-200 dark:border-white/15 text-[#242038] dark:text-[#f7ece1] z-[150]",
            }}
          >
            <SelectItem key="all" textValue="Todos los tipos">Todos</SelectItem>
            <SelectItem key="income" textValue="Ingresos">Ingresos</SelectItem>
            <SelectItem key="expense" textValue="Gastos">Gastos</SelectItem>
          </Select>
        </div>

        {/* Ordenamiento */}
        <div className="sm:col-span-2">
          <Select
            label="Orden"
            selectedKeys={new Set([sortBy])}
            onSelectionChange={(keys) => {
              const val = Array.from(keys)[0];
              if (val) setSortBy(val);
            }}
            size="sm"
            variant="bordered"
            classNames={{
              trigger: "h-10 rounded-xl border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25",
              popoverContent: "bg-white dark:bg-[#1c182d] border border-slate-200 dark:border-white/15 text-[#242038] dark:text-[#f7ece1] z-[150]",
            }}
          >
            <SelectItem key="date-desc" textValue="Recientes">Recientes</SelectItem>
            <SelectItem key="amount-desc" textValue="Mayor $">Mayor $</SelectItem>
            <SelectItem key="amount-asc" textValue="Menor $">Menor $</SelectItem>
          </Select>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#cac4ce]/40 dark:border-white/10 bg-slate-50/75 dark:bg-black/20 text-xs font-semibold text-[#8d86c9] dark:text-[#cac4ce] uppercase tracking-wider">
                <th className="py-3.5 px-5">Movimiento</th>
                <th className="py-3.5 px-5">Categoría</th>
                <th className="py-3.5 px-5">Fecha</th>
                <th className="py-3.5 px-5 text-right">Monto</th>
                <th className="py-3.5 px-5 text-center">Acciones</th>
              </tr>
            </thead>
            {loading ? (
              <SkeletonTableRows rows={6} />
            ) : filteredTransactions.length > 0 ? (
              <tbody className="divide-y divide-[#cac4ce]/30 dark:divide-white/5 font-medium">
                {filteredTransactions.map((tx) => {
                  const isIncome = tx.type === 'INCOME';
                  const amountVal = Number(tx.amount || 0);
                  const categoryName = tx.category_detail?.name || 'General';
                  const categoryColor = tx.category_detail?.color || '#9067c6';

                  return (
                    <tr 
                      key={tx.id} 
                      className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl shrink-0 ${
                            isIncome 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          }`}>
                            {isIncome ? <ArrowDownLeft className="w-4 h-4"/> : <ArrowUpRight className="w-4 h-4"/>}
                          </div>
                          <div>
                            <p className="font-bold text-[#242038] dark:text-[#f7ece1]">
                              {tx.description || 'Sin concepto'}
                            </p>
                            <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce]">
                              {isIncome ? 'Ingreso recibido' : 'Gasto registrado'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{ 
                            backgroundColor: `${categoryColor}15`, 
                            color: categoryColor,
                            border: `1px solid ${categoryColor}30`
                          }}
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full" 
                            style={{ backgroundColor: categoryColor }} 
                          />
                          {categoryName}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-xs text-[#8d86c9] dark:text-[#cac4ce]">
                        {tx.date}
                      </td>
                      <td className="py-4 px-5 text-right font-black text-sm">
                        <span className={isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                          {isIncome ? '+' : '-'}{formatCurrency(Math.abs(amountVal), 'ARS')}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button
                          type="button"
                          onClick={() => setItemToDelete(tx.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar transacción"
                        >
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ) : null}
          </table>

          {!loading && filteredTransactions.length === 0 && (
            <EmptyState
              title="No se encontraron movimientos"
              description="No hay transacciones que coincidan con los filtros seleccionados."
              actionLabel="+ Nueva Transacción"
              onAction={handleOpenModal}
            />
          )}
        </div>

        {/* Pie de tabla con totalizadores y paginación */}
        <div className="p-4 border-t border-[#cac4ce]/40 dark:border-white/10 bg-slate-50/50 dark:bg-black/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8d86c9] dark:text-[#cac4ce]">
          <span>Mostrando {filteredTransactions.length} de {totalCount} registros</span>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-[#cac4ce]/60 dark:border-white/10 text-xs font-semibold text-[#242038] dark:text-[#cac4ce] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Anterior
              </button>
              <span className="font-bold text-[#242038] dark:text-[#f7ece1] px-2">
                Pág. {page} de {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-[#cac4ce]/60 dark:border-white/10 text-xs font-semibold text-[#242038] dark:text-[#cac4ce] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Siguiente
              </button>
            </div>
          )}

          <span className="font-semibold text-[#242038] dark:text-[#f7ece1]">
            Balance en página: <span className={pageBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
              {pageBalance >= 0 ? '+' : '-'}{formatCurrency(Math.abs(pageBalance), 'ARS')}
            </span>
          </span>
        </div>
      </div>

      {/* Modal Nueva Transacción con HeroUI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-3xl p-7 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#cac4ce]/30 dark:border-white/10">
              <h3 className="text-lg font-extrabold text-[#242038] dark:text-[#f7ece1]">
                Nueva Transacción
              </h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {modalError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 p-1 mb-4 rounded-xl bg-slate-100 dark:bg-black/30 border border-[#cac4ce]/30 dark:border-white/5">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  newType === 'expense' ? 'bg-rose-500 text-white shadow-sm' : 'text-[#8d86c9] dark:text-[#cac4ce]'
                }`}
              >
                Gasto
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  newType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-[#8d86c9] dark:text-[#cac4ce]'
                }`}
              >
                Ingreso
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-5">
              {/* Monto con HeroUI Input - Signo negativo implícito, solo números positivos */}
              <Input
                label="Monto"
                type="text"
                inputMode="decimal"
                isRequired
                placeholder="0.00"
                startContent={<span className="text-[#8d86c9] text-sm">$</span>}
                value={newAmount}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/[^0-9.]/g, '');
                  setNewAmount(sanitized);
                }}
                variant="bordered"
                size="sm"
                classNames={{
                  inputWrapper: "h-12 px-4 rounded-xl border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 focus-within:border-[#9067c6] dark:focus-within:border-[#9067c6]",
                  input: "text-sm",
                }}
              />

              {/* Concepto con HeroUI Input */}
              <Input
                label="Concepto / Título"
                type="text"
                isRequired
                placeholder="Ej. Combustible, Farmacia..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                variant="bordered"
                size="sm"
                classNames={{
                  inputWrapper: "h-12 px-4 rounded-xl border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 focus-within:border-[#9067c6] dark:focus-within:border-[#9067c6]",
                  input: "text-sm",
                }}
              />

              <div className="grid grid-cols-2 gap-3">
                {/* Categoría con HeroUI Select y SelectItem */}
                <Select
                  label="Categoría"
                  placeholder="Seleccionar..."
                  selectedKeys={newCategoryId ? new Set([String(newCategoryId)]) : new Set()}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0];
                    if (val) setNewCategoryId(String(val));
                  }}
                  isRequired
                  variant="bordered"
                  size="sm"
                  classNames={{
                    trigger: "h-12 px-4 rounded-xl border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] text-sm",
                    popoverContent: "bg-white dark:bg-[#1c182d] border border-slate-200 dark:border-white/15 text-[#242038] dark:text-[#f7ece1] z-[150]",
                  }}
                >
                  {eligibleCategories.map((cat) => (
                    <SelectItem key={String(cat.id)} textValue={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </Select>

                {/* Fecha con HeroUI DatePicker */}
                <DatePicker
                  label="Fecha"
                  value={selectedDate}
                  onChange={setSelectedDate}
                  isRequired
                  variant="bordered"
                  size="sm"
                  classNames={{
                    inputWrapper: "h-12 px-4 rounded-xl border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 focus-within:border-[#9067c6] dark:focus-within:border-[#9067c6] text-sm",
                    popoverContent: "bg-white dark:bg-[#1c182d] border border-slate-200 dark:border-white/15 text-[#242038] dark:text-[#f7ece1] z-[150]",
                  }}
                />
              </div>

              {/* Botones con HeroUI Button */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#cac4ce]/30 dark:border-white/10">
                <Button
                  variant="bordered"
                  onPress={() => setIsModalOpen(false)}
                  isDisabled={createMutation.isPending}
                  className="rounded-xl border-[#cac4ce] dark:border-white/15 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={createMutation.isPending}
                  className="bg-[#9067c6] hover:bg-[#8d86c9] text-white text-xs font-bold rounded-xl shadow-md shadow-[#9067c6]/20 cursor-pointer"
                >
                  Registrar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-white dark:bg-[#1c182d] border border-slate-200/80 dark:border-white/10 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6"/>
            </div>
            
            <h3 className="text-lg font-bold text-[#242038] dark:text-[#f7ece1] mb-1">
              ¿Eliminar elemento?
            </h3>
            <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mb-6">
              Esta acción no se puede deshacer y afectará el balance de tus registros.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-[#242038] dark:text-[#cac4ce] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  handleDelete(itemToDelete);
                  setItemToDelete(null);
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
