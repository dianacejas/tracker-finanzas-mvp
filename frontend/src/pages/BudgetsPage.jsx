import React, { useState, useMemo } from 'react';
import { 
  PieChart, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  X,
  DollarSign
} from 'lucide-react';
import { Select, SelectItem } from "@heroui/react";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([
    { id: 1, category: 'Alimentación', spent: 340, limit: 500 },
    { id: 2, category: 'Servicios e Internet', spent: 120, limit: 150 },
    { id: 3, category: 'Transporte', spent: 85, limit: 100 },
    { id: 4, category: 'Ocio y Salidas', spent: 140, limit: 120 },
    { id: 5, category: 'Salud y Farmacia', spent: 45, limit: 80 },
  ]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('Alimentación');
  const [newLimit, setNewLimit] = useState('');

  // Cálculos globales
  const totals = useMemo(() => {
    const totalLimit = budgets.reduce((acc, curr) => acc + curr.limit, 0);
    const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
    const remaining = totalLimit - totalSpent;
    const percentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
    return { totalLimit, totalSpent, remaining, percentage };
  }, [budgets]);

  const handleDelete = (id) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const handleCreateBudget = (e) => {
    e.preventDefault();
    const parsedLimit = parseFloat(newLimit);
    if (isNaN(parsedLimit) || parsedLimit <= 0) return;

    const exists = budgets.find((b) => b.category === newCategory);
    if (exists) {
      setBudgets(budgets.map((b) => 
        b.category === newCategory ? { ...b, limit: parsedLimit } : b
      ));
    } else {
      setBudgets([
        ...budgets,
        { id: Date.now(), category: newCategory, spent: 0, limit: parsedLimit }
      ]);
    }

    setIsModalOpen(false);
    setNewCategory('Alimentación');
    setNewLimit('');
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
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#9067c6]/10 text-[#9067c6] border border-[#9067c6]/20">
                Noviembre 2026
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#8d86c9] dark:text-[#cac4ce] font-medium mt-0.5">
              Planifica tus techos de gasto por categoría y mantén tus ahorros a salvo
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9067c6] hover:bg-[#8d86c9] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#9067c6]/20 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4"/>
          Nuevo Presupuesto
        </button>
      </div>

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
            ${totals.totalLimit.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-1">Límite global planificado</p>
        </div>

        <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wider text-[#8d86c9] dark:text-[#cac4ce] uppercase">
              Total Consumido
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-4 h-4"/>
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#242038] dark:text-[#f7ece1]">
            ${totals.totalSpent.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-1">
            {totals.percentage.toFixed(1)}% del límite gastado
          </p>
        </div>

        <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wider text-[#8d86c9] dark:text-[#cac4ce] uppercase">
              Disponible
            </span>
            <div className={`p-2 rounded-xl ${totals.remaining >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
              {totals.remaining >= 0 ? <CheckCircle2 className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4"/>}
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black ${totals.remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            ${totals.remaining.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-1">
            {totals.remaining >= 0 ? 'Dentro del margen planificado' : 'Presupuesto excedido'}
          </p>
        </div>
      </div>

      {/* Grid de Presupuestos por Categoría */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {budgets.map((b) => {
          const percent = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
          const isOver = percent > 100;
          const isWarning = percent >= 80 && !isOver;

          return (
            <div 
              key={b.id} 
              className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-base text-[#242038] dark:text-[#f7ece1]">
                    {b.category}
                  </h3>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar presupuesto"
                  >
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-black text-[#242038] dark:text-[#f7ece1]">
                    ${b.spent}
                  </span>
                  <span className="text-xs font-semibold text-[#8d86c9] dark:text-[#cac4ce]">
                    de ${b.limit}
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

              <div className="flex items-center justify-between text-xs pt-3 border-t border-[#cac4ce]/30 dark:border-white/5 mt-3">
                <span className={`font-semibold ${
                  isOver 
                    ? 'text-rose-600 dark:text-rose-400' 
                    : isWarning 
                    ? 'text-amber-600 dark:text-amber-400' 
                    : 'text-[#8d86c9] dark:text-[#cac4ce]'
                }`}>
                  {isOver ? `Excedido por $${b.spent - b.limit}` : `Quedan $${b.limit - b.spent}`}
                </span>
                <span className="font-bold text-[#242038] dark:text-[#f7ece1]">
                  {percent.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nuevo Presupuesto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#cac4ce]/30 dark:border-white/10">
              <h3 className="text-lg font-extrabold text-[#242038] dark:text-[#f7ece1]">
                Fijar Presupuesto
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="flex flex-col gap-4">
              <div>
                <Select
                  label="Categoría"
                  placeholder="Selecciona una categoría"
                  selectedKeys={[newCategory]}
                  onChange={(e) => setNewCategory(e.target.value)}
                  size="sm"
                  classNames={{
                    trigger: "h-11 bg-[#fdfbf9] dark:bg-black/25 border border-[#cac4ce] dark:border-white/15 rounded-xl",
                    label: "text-xs font-semibold text-[#242038] dark:text-[#cac4ce]",
                    value: "text-[#242038] dark:text-[#f7ece1] text-sm",
                    popoverContent: "bg-white dark:bg-[#1c182d] border border-slate-200 dark:border-white/15 text-[#242038] dark:text-[#f7ece1] z-[110]",
                  }}
                  popoverProps={{ className: "z-[110]" }}
                >
                  <SelectItem key="Alimentación">Alimentación</SelectItem>
                  <SelectItem key="Servicios e Internet">Servicios e Internet</SelectItem>
                  <SelectItem key="Transporte">Transporte</SelectItem>
                  <SelectItem key="Ocio y Salidas">Ocio y Salidas</SelectItem>
                  <SelectItem key="Salud y Farmacia">Salud y Farmacia</SelectItem>
                  <SelectItem key="Educación">Educación</SelectItem>
                  <SelectItem key="Otros">Otros</SelectItem>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce] block mb-1">
                  Límite Mensual ($)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="Ej. 300"
                    value={newLimit}
                    onChange={(e) => setNewLimit(e.target.value)}
                    className="w-full h-11 pl-9 pr-3.5 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] placeholder:text-[#cac4ce] text-sm focus:outline-none focus:border-[#9067c6] transition-colors"
                  />
                  <DollarSign className="absolute left-3 w-4 h-4 text-[#8d86c9] dark:text-[#cac4ce]/60 pointer-events-none"/>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-[#cac4ce]/30 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#cac4ce] dark:border-white/15 text-[#242038] dark:text-[#cac4ce] text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#9067c6] hover:bg-[#8d86c9] text-white text-xs font-bold shadow-md shadow-[#9067c6]/20 transition-all cursor-pointer"
                >
                  Guardar Límite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
