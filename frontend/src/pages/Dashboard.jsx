import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Button, 
  Input, 
  Select, 
  SelectItem, 
  DatePicker 
} from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import analyticsService from '../api/analytics.service';
import { getTransactions, createTransaction } from '../api/transactions.service';
import budgetsService from '../api/budgets.service';
import { getCategories } from '../api/categories.service';
import { extractApiError } from '../api/authApi';
import { QUERY_KEYS } from '../api/queryKeys';
import { transactionSchema } from '../schemas/transaction.schema';
import { formatCurrency } from '../utils/formatters';
import { useToast } from '../components/common/Toast';
import { SkeletonCard } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import CategoryExpensePieChart from '../components/dashboard/CategoryExpensePieChart';

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Navegación temporal de mes y año
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const { startDate, endDate } = useMemo(() => {
    const start = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    const end = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    return { startDate: start, endDate: end };
  }, [selectedMonth, selectedYear]);

  // Modal Nueva Transacción
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txType, setTxType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => today(getLocalTimeZone()));
  const [modalError, setModalError] = useState('');

  // Queries TanStack
  const {
    data: summary = {
      total_income: "0.00",
      total_expense: "0.00",
      net_savings: "0.00",
      savings_rate: 0,
    },
    isLoading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ['analytics', 'summary', startDate, endDate],
    queryFn: () => analyticsService.getFinancialSummary({ start_date: startDate, end_date: endDate }),
  });

  const {
    data: categoryBreakdown = [],
    isLoading: breakdownLoading,
  } = useQuery({
    queryKey: ['analytics', 'category-breakdown', startDate, endDate],
    queryFn: () => analyticsService.getCategoryBreakdown({ start_date: startDate, end_date: endDate }),
  });

  const {
    data: txData,
    isLoading: txLoading,
  } = useQuery({
    queryKey: QUERY_KEYS.transactions({ page_size: 5 }),
    queryFn: () => getTransactions({ page_size: 5 }),
  });

  const {
    data: budgetsData,
    isLoading: budgetsLoading,
  } = useQuery({
    queryKey: QUERY_KEYS.budgets({ month: selectedMonth, year: selectedYear }),
    queryFn: () => budgetsService.getBudgets({ month: selectedMonth, year: selectedYear }),
  });

  const {
    data: rawCategories = [],
  } = useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: getCategories,
  });

  const recentTransactions = useMemo(() => {
    const list = Array.isArray(txData) ? txData : txData?.results || [];
    return list.slice(0, 5);
  }, [txData]);

  const budgets = useMemo(() => {
    const list = Array.isArray(budgetsData) ? budgetsData : budgetsData?.results || [];
    return list.slice(0, 4);
  }, [budgetsData]);

  const categories = useMemo(() => {
    return Array.isArray(rawCategories) ? rawCategories : [];
  }, [rawCategories]);

  const error = summaryError ? extractApiError(summaryError, "Error al sincronizar datos con el servidor.") : null;

  // Mutation para registrar transacción
  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      addToast("Transacción registrada con éxito", "success");
      handleCloseModal();
    },
    onError: (err) => {
      setModalError(extractApiError(err, "No se pudo registrar el movimiento."));
    },
  });

  // Categorías según el tipo de movimiento seleccionado en modal
  const eligibleCategories = useMemo(() => {
    const required = txType === 'income' ? 'INCOME' : 'EXPENSE';
    return categories.filter(c => c.type === 'BOTH' || c.type === required);
  }, [categories, txType]);

  const handleOpenModal = () => {
    setModalError('');
    setTitle('');
    setAmount('');
    setTxType('expense');
    setSelectedDate(today(getLocalTimeZone()));
    const initialEligible = categories.filter(c => c.type === 'BOTH' || c.type === 'EXPENSE');
    setSelectedCategoryId(initialEligible.length > 0 ? String(initialEligible[0].id) : '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTypeChange = (type) => {
    setTxType(type);
    const required = type === 'income' ? 'INCOME' : 'EXPENSE';
    const nextEligible = categories.filter(c => c.type === 'BOTH' || c.type === required);
    setSelectedCategoryId(nextEligible.length > 0 ? String(nextEligible[0].id) : '');
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    setModalError('');
    const parsedAmount = parseFloat(amount);
    const dateStr = selectedDate ? selectedDate.toString() : new Date().toISOString().split('T')[0];

    const validation = transactionSchema.safeParse({
      amount: parsedAmount,
      category: Number(selectedCategoryId),
      type: txType === 'income' ? 'INCOME' : 'EXPENSE',
      date: dateStr,
      description: title,
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

  const netBalanceNum = parseFloat(summary.net_savings || "0");
  const incomeNum = parseFloat(summary.total_income || "0");
  const expenseNum = parseFloat(summary.total_expense || "0");

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-['Inter'] transition-colors duration-300 relative">
      
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#cac4ce]/40 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9067c6]/10 text-[#9067c6] dark:text-[#8d86c9] text-xs font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#9067c6] animate-pulse"></span>
              Peshito Finance
            </div>

            {/* Selector interactivo de Mes y Año */}
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

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242038] dark:text-[#f7ece1] tracking-tight">
            Panel de Control
          </h1>
          <p className="text-xs sm:text-sm text-[#8d86c9] dark:text-[#cac4ce] font-medium mt-0.5">
            Vista general de tus balances y actividad financiera sincronizada con el backend
          </p>
        </div>

        <Button 
          color="primary"
          onPress={handleOpenModal}
          className="bg-[#9067c6] hover:bg-[#8d86c9] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#9067c6]/20 rounded-xl cursor-pointer"
          startContent={<Plus className="w-4 h-4" />}
        >
          Nuevo Movimiento
        </Button>
      </div>

      {/* Alerta de Error si la API falla */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
          <Button 
            size="sm" 
            variant="light" 
            color="danger" 
            onPress={() => refetchSummary()}
            className="ml-auto font-bold"
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Grid de KPIs Superiores (con Skeleton si carga) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {summaryLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            {/* Balance Neto */}
            <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold tracking-wider text-[#8d86c9] dark:text-[#cac4ce] uppercase">
                  Balance Neto
                </span>
                <div className="p-2.5 rounded-xl bg-[#9067c6]/10 text-[#9067c6]">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#242038] dark:text-[#f7ece1]">
                {formatCurrency(netBalanceNum, 'ARS')}
              </div>
              <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-1 font-medium">
                Saldo acumulado del período
              </p>
            </div>

            {/* Total Ingresos */}
            <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold tracking-wider text-[#8d86c9] dark:text-[#cac4ce] uppercase">
                  Ingresos Totales
                </span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(incomeNum, 'ARS')}
              </div>
              <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-1 font-medium">
                Ingresos recibidos este mes
              </p>
            </div>

            {/* Total Gastos */}
            <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold tracking-wider text-[#8d86c9] dark:text-[#cac4ce] uppercase">
                  Gastos Totales
                </span>
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <TrendingDown className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                -{formatCurrency(expenseNum, 'ARS')}
              </div>
              <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-1 font-medium">
                Total de egresos registrados
              </p>
            </div>

            {/* Tasa de Ahorro */}
            <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold tracking-wider text-[#8d86c9] dark:text-[#cac4ce] uppercase">
                  Tasa de Ahorro
                </span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <PiggyBank className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#242038] dark:text-[#f7ece1]">
                {(summary.savings_rate || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-1 font-medium">
                Porcentaje de ingresos retenido
              </p>
            </div>
          </>
        )}
      </div>

      {/* Grid de Secciones Medias: Gráfico de Dona y Presupuestos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico Circular de Gastos por Categoría (2 columnas) */}
        <div className="lg:col-span-2">
          <CategoryExpensePieChart
            data={categoryBreakdown}
            loading={breakdownLoading}
            currency="ARS"
            month={MONTH_NAMES[selectedMonth - 1]}
          />
        </div>

        {/* Presupuestos del Mes (1 columna) */}
        <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#242038] dark:text-[#f7ece1]">
                  Presupuestos del Mes
                </h2>
                <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce]">
                  Progreso para {MONTH_NAMES[selectedMonth - 1]}
                </p>
              </div>
              <Link 
                to="/budgets" 
                className="text-xs font-semibold text-[#9067c6] hover:text-[#8d86c9] flex items-center gap-1 transition-colors"
              >
                Gestionar <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {budgetsLoading ? (
              <div className="space-y-4">
                <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded-full animate-pulse" />
                <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded-full animate-pulse" />
                <div className="h-4 w-full bg-slate-200 dark:bg-white/10 rounded-full animate-pulse" />
              </div>
            ) : budgets.length > 0 ? (
              <div className="space-y-4">
                {budgets.map((b) => {
                  const spentVal = Number(b.spent_amount || 0);
                  const limitVal = Number(b.amount || 0);
                  const percent = b.progress_percentage !== undefined ? Number(b.progress_percentage) : (limitVal > 0 ? (spentVal / limitVal) * 100 : 0);
                  const isOver = b.is_exceeded || percent > 100;
                  const isWarning = percent >= 80 && !isOver;
                  const categoryName = b.category_detail?.name || 'Categoría';

                  return (
                    <div key={b.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#242038] dark:text-[#f7ece1]">
                          {categoryName}
                        </span>
                        <span className="font-semibold text-[#8d86c9] dark:text-[#cac4ce]">
                          {formatCurrency(spentVal, 'ARS')} / {formatCurrency(limitVal, 'ARS')}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-black/30 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
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
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="Aún no definiste un presupuesto para este mes"
                description="Establece límites para mantener tus finanzas bajo control."
                actionLabel="Fijar presupuesto"
                onAction={() => window.location.assign('/budgets')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Grid Inferior: Últimos Movimientos */}
      <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#242038] dark:text-[#f7ece1]">
              Últimos Movimientos
            </h2>
            <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce]">
              Tus transacciones más recientes registradas
            </p>
          </div>
          <Link 
            to="/transactions" 
            className="text-xs font-semibold text-[#9067c6] hover:text-[#8d86c9] flex items-center gap-1 transition-colors"
          >
            Ver todas <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {txLoading ? (
          <div className="space-y-3">
            <div className="h-12 w-full bg-slate-200 dark:bg-white/10 rounded-xl animate-pulse" />
            <div className="h-12 w-full bg-slate-200 dark:bg-white/10 rounded-xl animate-pulse" />
            <div className="h-12 w-full bg-slate-200 dark:bg-white/10 rounded-xl animate-pulse" />
          </div>
        ) : recentTransactions.length > 0 ? (
          <div className="divide-y divide-[#cac4ce]/30 dark:divide-white/5">
            {recentTransactions.map((tx) => {
              const isIncome = tx.type === 'INCOME';
              const amountVal = Number(tx.amount || 0);
              const categoryName = tx.category_detail?.name || 'General';
              const categoryColor = tx.category_detail?.color || '#9067c6';

              return (
                <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isIncome 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {isIncome ? <ArrowDownLeft className="w-4 h-4"/> : <ArrowUpRight className="w-4 h-4"/>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#242038] dark:text-[#f7ece1]">
                        {tx.description || 'Sin concepto'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: categoryColor }}
                        />
                        <span className="text-xs text-[#8d86c9] dark:text-[#cac4ce]">
                          {categoryName}
                        </span>
                        <span className="text-xs text-[#8d86c9]/60 dark:text-[#cac4ce]/40">•</span>
                        <span className="text-xs text-[#8d86c9] dark:text-[#cac4ce]">
                          {tx.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-sm font-extrabold ${
                    isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {isIncome ? '+' : '-'}{formatCurrency(Math.abs(amountVal), 'ARS')}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Aún no tienes movimientos registrados"
            description="Comienza hoy registrando tu primer ingreso o gasto."
            actionLabel="+ Nuevo Movimiento"
            onAction={handleOpenModal}
          />
        )}
      </div>

      {/* Modal Nueva Transacción con HeroUI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-3xl p-7 sm:p-8 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#cac4ce]/30 dark:border-white/10">
              <h3 className="text-lg font-extrabold text-[#242038] dark:text-[#f7ece1]">
                Registrar Movimiento
              </h3>
              <button 
                type="button"
                onClick={handleCloseModal}
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

            {/* Selector de Tipo */}
            <div className="grid grid-cols-2 gap-2 p-1 mb-4 rounded-xl bg-slate-100 dark:bg-black/30 border border-[#cac4ce]/30 dark:border-white/5">
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  txType === 'expense' ? 'bg-rose-500 text-white shadow-sm' : 'text-[#8d86c9] dark:text-[#cac4ce]'
                }`}
              >
                Gasto
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  txType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-[#8d86c9] dark:text-[#cac4ce]'
                }`}
              >
                Ingreso
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="flex flex-col gap-5">
              {/* Monto con HeroUI Input - Solo números positivos, signo implícito */}
              <Input
                label="Monto"
                type="text"
                inputMode="decimal"
                isRequired
                placeholder="0.00"
                startContent={<span className="text-[#8d86c9] text-sm">$</span>}
                value={amount}
                onChange={(e) => {
                  const sanitized = e.target.value.replace(/[^0-9.]/g, '');
                  setAmount(sanitized);
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
                label="Concepto / Detalle"
                type="text"
                isRequired
                placeholder="Ej. Compra en supermercado"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="bordered"
                size="sm"
                classNames={{
                  inputWrapper: "h-12 px-4 rounded-xl border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 focus-within:border-[#9067c6] dark:focus-within:border-[#9067c6]",
                  input: "text-sm",
                }}
              />

              {/* Categoría y Fecha con HeroUI */}
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Categoría"
                  placeholder="Seleccionar..."
                  selectedKeys={selectedCategoryId ? new Set([String(selectedCategoryId)]) : new Set()}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0];
                    if (val) setSelectedCategoryId(String(val));
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
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#cac4ce]/30 dark:border-white/10">
                <Button
                  variant="bordered"
                  onPress={handleCloseModal}
                  isDisabled={createMutation.isPending}
                  className="flex-1 rounded-xl border-[#cac4ce] dark:border-white/15 text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={createMutation.isPending}
                  className="flex-1 bg-[#9067c6] hover:bg-[#8d86c9] text-white text-xs font-bold rounded-xl shadow-md shadow-[#9067c6]/20 cursor-pointer"
                >
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
