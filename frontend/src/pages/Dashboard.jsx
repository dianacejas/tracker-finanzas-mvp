import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PieChart,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Alimentación', 'Transporte', 'Ocio', 'Servicios', 'Salud', 'Salario', 'Otros'];

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    balance: 14250.00,
    income: 3800.00,
    expenses: 1240.50,
  });

  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, title: 'Supermercado Central', category: 'Alimentación', amount: -85.20, date: 'Hoy' },
    { id: 2, title: 'Pago de Salario', category: 'Ingresos', amount: 3200.00, date: 'Ayer' },
    { id: 3, title: 'Suscripción Streaming', category: 'Ocio', amount: -14.99, date: '28 Oct' },
    { id: 4, title: 'Restaurante Peshi', category: 'Alimentación', amount: -42.00, date: '26 Oct' },
  ]);

  const [budgets] = useState([
    { id: 1, name: 'Alimentación', spent: 340, limit: 500, percentage: 68 },
    { id: 2, name: 'Servicios e Internet', spent: 120, limit: 150, percentage: 80 },
    { id: 3, name: 'Entretenimiento', spent: 45, limit: 100, percentage: 45 },
  ]);

  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txType, setTxType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Alimentación');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setAmount('');
    setCategory('Alimentación');
    setTxType('expense');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const finalAmount = txType === 'expense' ? -parsedAmount : parsedAmount;

    const newTx = {
      id: Date.now(),
      title: title.trim(),
      category: txType === 'income' ? 'Ingresos' : category,
      amount: finalAmount,
      date: 'Hoy',
    };

    setRecentTransactions([newTx, ...recentTransactions]);
    setMetrics((prev) => ({
      balance: prev.balance + finalAmount,
      income: txType === 'income' ? prev.income + parsedAmount : prev.income,
      expenses: txType === 'expense' ? prev.expenses + parsedAmount : prev.expenses,
    }));

    handleCloseModal();
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-['Inter'] transition-colors duration-300 relative">
      
      {/* Cabecera y Acción Rápida */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#cac4ce]/40 dark:border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242038] dark:text-[#f7ece1] tracking-tight">
            Panel General
          </h1>
          <p className="text-xs sm:text-sm text-[#8d86c9] dark:text-[#cac4ce] mt-1 font-medium">
            Resumen en tiempo real del estado de tus finanzas
          </p>
        </div>

        <button 
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9067c6] hover:bg-[#8d86c9] text-white text-sm font-semibold shadow-md shadow-[#9067c6]/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4"/>
          Nueva Transacción
        </button>
      </div>

      {/* Grid de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Balance Total */}
        <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-wider text-[#8d86c9] dark:text-[#cac4ce] uppercase">
              Balance Total
            </span>
            <div className="p-2.5 rounded-xl bg-[#9067c6]/10 text-[#9067c6] dark:text-[#8d86c9]">
              <Wallet className="w-5 h-5"/>
            </div>
          </div>
          <div className="text-3xl font-black text-[#242038] dark:text-[#f7ece1] tracking-tight">
            ${metrics.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5"/> +12.4% vs mes anterior
          </p>
        </div>

        {/* Ingresos del Mes */}
        <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-wider text-[#8d86c9] dark:text-[#cac4ce] uppercase">
              Ingresos del Mes
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-5 h-5"/>
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            +${metrics.income.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-2 font-medium">
            2 depósitos registrados
          </p>
        </div>

        {/* Gastos del Mes */}
        <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold tracking-wider text-[#8d86c9] dark:text-[#cac4ce] uppercase">
              Gastos del Mes
            </span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <TrendingDown className="w-5 h-5"/>
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
            -${metrics.expenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-2 font-medium">
            32.6% del total presupuestado
          </p>
        </div>

      </div>

      {/* Grid Secundario: Transacciones y Presupuestos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lista de Transacciones Recientes */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-[#242038] dark:text-[#f7ece1]">
              Últimos Movimientos
            </h2>
            <Link className="text-xs font-bold text-[#9067c6] hover:text-[#8d86c9] transition-colors" to="/transactions">
              Ver todos →
            </Link>
          </div>

          <div className="divide-y divide-[#cac4ce]/30 dark:divide-white/5">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    tx.amount > 0 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}>
                    {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4"/> : <ArrowUpRight className="w-4 h-4"/>}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#242038] dark:text-[#f7ece1]">
                      {tx.title}
                    </p>
                    <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce]">
                      {tx.category} • {tx.date}
                    </p>
                  </div>
                </div>

                <span className={`text-sm font-bold ${
                  tx.amount > 0 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-[#242038] dark:text-[#f7ece1]'
                }`}>
                  {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen de Presupuestos */}
        <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-[#242038] dark:text-[#f7ece1]">
                Presupuestos
              </h2>
              <div className="p-1.5 rounded-lg bg-[#9067c6]/10 text-[#9067c6]">
                <PieChart className="w-4 h-4"/>
              </div>
            </div>

            <div className="space-y-4">
              {budgets.map((b) => (
                <div key={b.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-[#242038] dark:text-[#cac4ce]">{b.name}</span>
                    <span className="text-[#8d86c9] dark:text-[#cac4ce]">
                      ${b.spent} / ${b.limit}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-black/30 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        b.percentage > 85 ? 'bg-rose-500' : 'bg-[#9067c6]'
                      }`}
                      style={{ width: `${Math.min(b.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link className="w-full py-2.5 mt-6 rounded-xl border border-[#cac4ce] dark:border-white/15 text-[#242038] dark:text-[#f7ece1] text-xs font-bold text-center hover:bg-slate-50 dark:hover:bg-white/5 transition-colors block" to="/budgets">
            Administrar Presupuestos
          </Link>
        </div>

      </div>

      {/* Modal Nueva Transacción */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#cac4ce]/40 dark:border-white/10">
              <h3 className="text-lg font-bold text-[#242038] dark:text-[#f7ece1]">
                Nueva Transacción
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5 text-[#8d86c9]" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="p-6 space-y-5">
              {/* Tipo */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-black/25 border border-[#cac4ce]/40 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    txType === 'expense'
                      ? 'bg-white dark:bg-[#9067c6] text-[#242038] dark:text-white shadow-sm'
                      : 'text-[#8d86c9] dark:text-[#cac4ce]'
                  }`}
                >
                  Gasto
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    txType === 'income'
                      ? 'bg-white dark:bg-emerald-600 text-[#242038] dark:text-white shadow-sm'
                      : 'text-[#8d86c9] dark:text-[#cac4ce]'
                  }`}
                >
                  Ingreso
                </button>
              </div>

              {/* Monto */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce]">
                  Monto
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-[#8d86c9]">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full h-11 pl-8 pr-4 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] placeholder:text-[#cac4ce] text-sm focus:outline-none focus:border-[#9067c6] transition-colors"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce]">
                  Descripción / Concepto
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Compra en supermercado"
                  className="w-full h-11 px-4 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] placeholder:text-[#cac4ce] text-sm focus:outline-none focus:border-[#9067c6] transition-colors"
                />
              </div>

              {/* Categoría y Fecha */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce]">
                    Categoría
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={txType === 'income'}
                    className="w-full h-11 px-3 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] text-sm focus:outline-none focus:border-[#9067c6] transition-colors disabled:opacity-50"
                  >
                    {CATEGORIES.filter(c => c !== 'Salario').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce]">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] text-sm focus:outline-none focus:border-[#9067c6] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 h-11 rounded-xl border border-[#cac4ce] dark:border-white/15 text-[#242038] dark:text-[#f7ece1] text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-[#9067c6] hover:bg-[#8d86c9] text-white text-sm font-semibold shadow-md shadow-[#9067c6]/20 transition-all"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
