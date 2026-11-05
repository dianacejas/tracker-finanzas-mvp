import React, { useState, useMemo } from 'react';
import { 
  PieChart, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { 
  Button, 
  Input, 
  Select, 
  SelectItem,
  Accordion,
  AccordionItem
} from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import budgetsService from "../api/budgets.service";
import { getTransactions } from "../api/transactions.service";
import { getCategories } from "../api/categories.service";
import { extractApiError } from "../api/authApi";
import { QUERY_KEYS } from "../api/queryKeys";
import { budgetSchema } from "../schemas/budget.schema";
import { formatCurrency } from "../utils/formatters";
import { useToast } from "../components/common/Toast";
import { SkeletonCard } from "../components/common/Skeleton";
import EmptyState from "../components/common/EmptyState";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function BudgetsPage() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [modalError, setModalError] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);

  // Queries TanStack
  const { data: rawCategories = [] } = useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: getCategories,
  });

  const categories = useMemo(() => {
    const list = Array.isArray(rawCategories) ? rawCategories : [];
    return list.filter(c => c.type === 'EXPENSE' || c.type === 'BOTH');
  }, [rawCategories]);

  const {
    data: budgetsData = [],
    isLoading: loading,
    error: queryError,
    refetch: loadBudgets,
  } = useQuery({
    queryKey: QUERY_KEYS.budgets({ month: selectedMonth, year: selectedYear }),
    queryFn: () => budgetsService.getBudgets({ month: selectedMonth, year: selectedYear }),
  });

  const budgets = useMemo(() => {
    return Array.isArray(budgetsData) ? budgetsData : budgetsData?.results || [];
  }, [budgetsData]);

  // Transacciones del mes para desglose de consumos
  const startDate = useMemo(() => `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`, [selectedYear, selectedMonth]);
  const endDate = useMemo(() => {
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    return `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  }, [selectedYear, selectedMonth]);

  const { data: txData = [] } = useQuery({
    queryKey: QUERY_KEYS.transactions({ start_date: startDate, end_date: endDate, page_size: 100 }),
    queryFn: () => getTransactions({ start_date: startDate, end_date: endDate, page_size: 100 }),
  });

  const transactions = useMemo(() => {
    return Array.isArray(txData) ? txData : txData?.results || [];
  }, [txData]);

  const error = queryError ? extractApiError(queryError, "No se pudieron cargar los presupuestos.") : null;

  // Mutaciones
  const createMutation = useMutation({
    mutationFn: budgetsService.createBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      addToast("Presupuesto fijado con éxito", "success");
      setIsModalOpen(false);
    },
    onError: (err) => {
      setModalError(extractApiError(err, "No se pudo guardar el presupuesto."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: budgetsService.deleteBudget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      addToast("Presupuesto eliminado con éxito", "info");
    },
    onError: (err) => {
      alert(extractApiError(err, "No se pudo eliminar el presupuesto."));
    },
  });

  // Navegación de mes
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
  };

  // Cálculos globales basados en respuesta del backend
  const totals = useMemo(() => {
    let totalLimit = 0;
    let totalSpent = 0;

    budgets.forEach((b) => {
      totalLimit += Number(b.amount || 0);
      totalSpent += Number(b.spent_amount || 0);
    });

    const remaining = totalLimit - totalSpent;
    const percentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
    return { totalLimit, totalSpent, remaining, percentage };
  }, [budgets]);

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleOpenModal = () => {
    setModalError('');
    setNewLimit('');
    if (categories.length > 0) {
      setNewCategoryId(String(categories[0].id));
    } else {
      setNewCategoryId('');
    }
    setIsModalOpen(true);
  };

  const handleCreateBudget = (e) => {
    e.preventDefault();
    setModalError('');
    const parsedLimit = parseFloat(newLimit);

    const validation = budgetSchema.safeParse({
      category: Number(newCategoryId),
      amount: parsedLimit,
      month: selectedMonth,
      year: selectedYear,
    });

    if (!validation.success) {
      setModalError(validation.error.errors[0]?.message || "Datos de presupuesto inválidos.");
      return;
    }

    createMutation.mutate({
      category: validation.data.category,
      amount: validation.data.amount.toFixed(2),
      month: validation.data.month,
      year: validation.data.year,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-['Inter'] transition-colors duration-300">
      
      {/* Cabecera y Acción Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#cac4ce]/40 dark:border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-[#9067c6]/10 text-[#9067c6] border border-[#9067c6]/20">
            <PieChart className="w-6 h-6"/>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242038] dark:text-[#f7ece1] tracking-tight">
                Presupuestos
              </h1>
              
              {/* Selector de Período Mes/Año */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9067c6]/10 text-[#9067c6] dark:text-[#8d86c9] border border-[#9067c6]/20 text-xs font-bold">
                <button 
                  type="button"
                  onClick={handlePrevMonth}
                  className="hover:scale-110 transition-transform cursor-pointer"
                  title="Mes anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span>{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</span>
                <button 
                  type="button"
                  onClick={handleNextMonth}
                  className="hover:scale-110 transition-transform cursor-pointer"
                  title="Mes siguiente"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#8d86c9] dark:text-[#cac4ce] font-medium mt-0.5">
              Planifica tus techos de gasto por categoría y mantén tus finanzas bajo control
            </p>
          </div>
        </div>

        <Button 
          color="primary"
          onPress={handleOpenModal}
          className="bg-[#9067c6] hover:bg-[#8d86c9] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#9067c6]/20 rounded-xl cursor-pointer"
          startContent={<Plus className="w-4 h-4" />}
        >
          Nuevo Presupuesto
        </Button>
      </div>

      {/* Alerta de Error si falla la API */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <Button 
            size="sm"
            variant="light"
            color="danger"
            onPress={() => loadBudgets()}
            className="ml-auto font-bold"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Tarjetas Resumen Global */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wider text-[#8d86c9] dark:text-[#cac4ce] uppercase">
              Presupuesto Total
            </span>
            <div className="p-2 rounded-xl bg-[#9067c6]/10 text-[#9067c6]">
              <PieChart className="w-4 h-4"/>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#242038] dark:text-[#f7ece1]">
            {formatCurrency(totals.totalLimit, 'ARS')}
          </div>
          <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-1 font-medium">
            Límite combinado para {MONTH_NAMES[selectedMonth - 1]}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wider text-[#8d86c9] dark:text-[#cac4ce] uppercase">
              Total Consumido
            </span>
            <div className={`p-2 rounded-xl ${totals.percentage > 100 ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
              <TrendingUp className="w-4 h-4"/>
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${totals.percentage > 100 ? 'text-rose-600 dark:text-rose-400' : 'text-[#242038] dark:text-[#f7ece1]'}`}>
            {formatCurrency(totals.totalSpent, 'ARS')}
          </div>
          <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-1 font-medium">
            {totals.percentage.toFixed(1)}% del techo mensual alcanzado
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wider text-[#8d86c9] dark:text-[#cac4ce] uppercase">
              Margen Disponible
            </span>
            <div className={`p-2 rounded-xl ${totals.remaining < 0 ? 'bg-rose-500/10 text-rose-600' : 'bg-[#9067c6]/10 text-[#9067c6]'}`}>
              {totals.remaining < 0 ? <AlertTriangle className="w-4 h-4"/> : <CheckCircle2 className="w-4 h-4"/>}
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${totals.remaining < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {formatCurrency(totals.remaining, 'ARS')}
          </div>
          <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-1 font-medium">
            {totals.remaining < 0 ? 'Límite global superado' : 'Disponible para gastar'}
          </p>
        </div>
      </div>

      {/* Grid de Tarjetas de Presupuesto */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.length > 0 ? (
            budgets.map((b) => {
              const spentVal = Number(b.spent_amount || 0);
              const limitVal = Number(b.amount || 0);
              const percent = b.progress_percentage !== undefined ? Number(b.progress_percentage) : (limitVal > 0 ? (spentVal / limitVal) * 100 : 0);
              const isOver = b.is_exceeded || percent > 100;
              const isWarning = percent >= 80 && !isOver;
              const categoryName = b.category_detail?.name || 'Categoría';
              const categoryColor = b.category_detail?.color || '#9067c6';

              const categoryTransactions = transactions.filter((t) => {
                const isCategoryMatch = 
                  (t.category && b.category && String(t.category) === String(b.category)) ||
                  (t.category_detail?.name && b.category_detail?.name && 
                    t.category_detail.name.toLowerCase() === b.category_detail.name.toLowerCase()) ||
                  (t.category && typeof t.category === 'string' && b.category && typeof b.category === 'string' &&
                    t.category.toLowerCase() === b.category.toLowerCase());

                const isExpense = 
                  t.type === 'EXPENSE' || 
                  t.type?.toLowerCase() === 'expense' || 
                  Number(t.amount) < 0;

                return isCategoryMatch && isExpense;
              });

              return (
                <div 
                  key={b.id} 
                  className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full shrink-0" 
                          style={{ backgroundColor: categoryColor }} 
                        />
                        <h3 className="font-bold text-base text-[#242038] dark:text-[#f7ece1]">
                          {categoryName}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemToDelete(b.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar presupuesto"
                      >
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>

                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-black text-[#242038] dark:text-[#f7ece1]">
                        {formatCurrency(spentVal, 'ARS')}
                      </span>
                      <span className="text-xs font-semibold text-[#8d86c9] dark:text-[#cac4ce]">
                        de {formatCurrency(limitVal, 'ARS')}
                      </span>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-black/30 overflow-hidden mb-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isOver 
                            ? 'bg-rose-500' 
                            : isWarning 
                            ? 'bg-amber-500' 
                            : 'bg-[#9067c6]'
                        }`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs pt-3 border-t border-[#cac4ce]/30 dark:border-white/5 mt-3">
                      <span className={`font-semibold ${
                        isOver 
                          ? 'text-rose-600 dark:text-rose-400' 
                          : isWarning 
                          ? 'text-amber-600 dark:text-amber-400' 
                          : 'text-[#8d86c9] dark:text-[#cac4ce]'
                      }`}>
                        {isOver 
                          ? `Excedido por ${formatCurrency(spentVal - limitVal, 'ARS')}` 
                          : `Quedan ${formatCurrency(limitVal - spentVal, 'ARS')}`}
                      </span>
                      <span className="font-bold text-[#242038] dark:text-[#f7ece1]">
                        {percent.toFixed(0)}%
                      </span>
                    </div>

                    {/* Desglose de consumos recientes con Accordion de HeroUI */}
                    <div className="mt-3 border-t border-slate-100 dark:border-white/5 pt-1">
                      <Accordion
                        isCompact
                        className="px-0"
                        itemClasses={{
                          base: "py-0 w-full",
                          title: "text-[11px] font-semibold text-[#8d86c9] dark:text-[#cac4ce] hover:text-[#9067c6] dark:hover:text-white transition-colors",
                          trigger: "px-1 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors",
                          content: "pt-1 pb-2 space-y-2",
                        }}
                      >
                        <AccordionItem
                          key="consumos"
                          aria-label="Ver consumos recientes"
                          title={
                            <div className="flex items-center justify-between w-full pr-2">
                              <span>Ver consumos recientes</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-[#242038] dark:text-[#cac4ce]">
                                {categoryTransactions.length}
                              </span>
                            </div>
                          }
                        >
                          {categoryTransactions.length > 0 ? (
                            <div className="space-y-1.5">
                              {categoryTransactions.slice(0, 3).map((item) => (
                                <div 
                                  key={item.id} 
                                  className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5"
                                >
                                  <div className="truncate max-w-[65%]">
                                    <p className="font-semibold text-[#242038] dark:text-[#f7ece1] truncate">
                                      {item.description || item.title || item.concept || 'Gasto registrado'}
                                    </p>
                                    <p className="text-[10px] text-[#8d86c9] dark:text-[#cac4ce]">{item.date}</p>
                                  </div>
                                  <span className="font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap">
                                    -${Math.abs(Number(item.amount)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              ))}

                              {categoryTransactions.length > 3 && (
                                <p className="text-center text-[10px] text-[#9067c6] font-semibold pt-1 cursor-pointer hover:underline">
                                  + {categoryTransactions.length - 3} movimientos más en Transacciones
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[11px] text-center text-[#8d86c9] dark:text-[#cac4ce] py-2">
                              Sin gastos registrados en esta categoría este mes.
                            </p>
                          )}
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full">
              <EmptyState
                title={`No hay presupuestos para ${MONTH_NAMES[selectedMonth - 1]} de ${selectedYear}`}
                description="Planifica tus techos de gasto por categoría para mantener tus ahorros protegidos."
                actionLabel="+ Nuevo Presupuesto"
                onAction={handleOpenModal}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal Nuevo Presupuesto con HeroUI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-3xl p-7 sm:p-8 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#cac4ce]/30 dark:border-white/10">
              <h3 className="text-lg font-extrabold text-[#242038] dark:text-[#f7ece1]">
                Fijar Presupuesto ({MONTH_NAMES[selectedMonth - 1]} {selectedYear})
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

            <form onSubmit={handleCreateBudget} className="flex flex-col gap-5">
              {/* Categoría con HeroUI Select y SelectItem */}
              <Select
                label="Categoría de Gasto"
                placeholder="Seleccionar categoría..."
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
                {categories.map((cat) => (
                  <SelectItem key={String(cat.id)} textValue={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </Select>

              {/* Límite Mensual con HeroUI Input - Solo números positivos */}
              <Input
                label="Límite Mensual"
                type="text"
                inputMode="decimal"
                isRequired
                placeholder="0.00"
                startContent={<span className="text-[#8d86c9] text-sm">$</span>}
                value={newLimit}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/[^0-9.]/g, '');
                  setNewLimit(sanitized);
                }}
                variant="bordered"
                size="sm"
                classNames={{
                  inputWrapper: "h-12 px-4 rounded-xl border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 focus-within:border-[#9067c6] dark:focus-within:border-[#9067c6]",
                  input: "text-sm",
                }}
              />

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
                  Guardar Límite
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
