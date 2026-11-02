import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Trash2, 
  X,
  Calendar,
  Tag
} from 'lucide-react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([
    { id: 1, title: 'Supermercado Central', category: 'Alimentación', amount: -85.20, date: '2026-11-01', type: 'expense' },
    { id: 2, title: 'Pago de Salario', category: 'Ingresos', amount: 3200.00, date: '2026-10-31', type: 'income' },
    { id: 3, title: 'Suscripción Streaming', category: 'Ocio', amount: -14.99, date: '2026-10-28', type: 'expense' },
    { id: 4, title: 'Restaurante Peshi', category: 'Alimentación', amount: -42.00, date: '2026-10-26', type: 'expense' },
    { id: 5, title: 'Combustible Shell', category: 'Transporte', amount: -55.00, date: '2026-10-24', type: 'expense' },
    { id: 6, title: 'Venta de artículo usado', category: 'Ingresos', amount: 150.00, date: '2026-10-20', type: 'income' },
    { id: 7, title: 'Farmacia y Medicinas', category: 'Salud', amount: -32.50, date: '2026-10-18', type: 'expense' },
  ]);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'income' | 'expense'
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc' | 'amount-desc' | 'amount-asc'

  // Modal de Nueva Transacción
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Alimentación');
  const [newType, setNewType] = useState('expense');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Filtrado y ordenamiento en memoria
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = 
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'all' || t.type === selectedType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'amount-desc') return Math.abs(b.amount) - Math.abs(a.amount);
        if (sortBy === 'amount-asc') return Math.abs(a.amount) - Math.abs(b.amount);
        return 0;
      });
  }, [transactions, searchTerm, selectedType, sortBy]);

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const val = parseFloat(newAmount);
    if (!newTitle || isNaN(val) || val <= 0) return;

    const newTx = {
      id: Date.now(),
      title: newTitle,
      category: newCategory,
      amount: newType === 'expense' ? -val : val,
      date: newDate,
      type: newType,
    };

    setTransactions([newTx, ...transactions]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewAmount('');
    setNewCategory('Alimentación');
    setNewType('expense');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-['Inter'] transition-colors duration-300">
      
      {/* Cabecera y Botón Nuevo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#cac4ce]/40 dark:border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242038] dark:text-[#f7ece1] tracking-tight">
            Transacciones
          </h1>
          <p className="text-xs sm:text-sm text-[#8d86c9] dark:text-[#cac4ce] mt-1 font-medium">
            Historial detallado y gestión de todos tus ingresos y gastos
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9067c6] hover:bg-[#8d86c9] text-white text-sm font-semibold shadow-md shadow-[#9067c6]/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus className="w-4 h-4"/>
          Nueva Transacción
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Input Buscador */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por concepto o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] placeholder:text-[#cac4ce] text-sm focus:outline-none focus:border-[#9067c6] transition-colors"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#8d86c9] dark:text-[#cac4ce]/60 pointer-events-none"/>
        </div>

        {/* Filtro Tipo y Orden */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
          {/* Selector de Tipo */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-black/30 border border-[#cac4ce]/30 dark:border-white/5">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-white dark:bg-[#1c182d] text-[#242038] dark:text-[#f7ece1] shadow-xs'
                  : 'text-[#8d86c9] dark:text-[#cac4ce]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedType('income')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedType === 'income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-[#8d86c9] dark:text-[#cac4ce]'
              }`}
            >
              Ingresos
            </button>
            <button
              onClick={() => setSelectedType('expense')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedType === 'expense'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-[#8d86c9] dark:text-[#cac4ce]'
              }`}
            >
              Gastos
            </button>
          </div>

          {/* Selector de Orden */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 px-3 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-[#1c182d] text-[#242038] dark:text-[#f7ece1] text-xs font-medium focus:outline-none focus:border-[#9067c6] transition-colors cursor-pointer"
          >
            <option value="date-desc">Más recientes primero</option>
            <option value="amount-desc">Mayor monto</option>
            <option value="amount-asc">Menor monto</option>
          </select>
        </div>

      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#cac4ce]/40 dark:border-white/10 bg-slate-50/70 dark:bg-black/20 text-[#8d86c9] dark:text-[#cac4ce] text-xs font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">Transacción</th>
                <th className="py-3.5 px-5">Categoría</th>
                <th className="py-3.5 px-5">Fecha</th>
                <th className="py-3.5 px-5 text-right">Monto</th>
                <th className="py-3.5 px-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cac4ce]/30 dark:divide-white/5 text-sm">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl shrink-0 ${
                          tx.type === 'income'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {tx.type === 'income' ? <ArrowDownLeft className="w-4 h-4"/> : <ArrowUpRight className="w-4 h-4"/>}
                        </div>
                        <span className="font-semibold text-[#242038] dark:text-[#f7ece1]">
                          {tx.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-black/30 border border-[#cac4ce]/30 dark:border-white/10 text-xs font-medium text-[#242038] dark:text-[#cac4ce]">
                        <Tag className="w-3 h-3 text-[#9067c6]"/>
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-xs text-[#8d86c9] dark:text-[#cac4ce]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5"/>
                        {tx.date}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right font-bold">
                      <span className={tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                        {tx.type === 'income' ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar transacción"
                      >
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[#8d86c9] dark:text-[#cac4ce]">
                    <p className="text-sm font-medium">No se encontraron movimientos con los filtros aplicados.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pie de tabla con totalizadores */}
        <div className="p-4 border-t border-[#cac4ce]/40 dark:border-white/10 bg-slate-50/50 dark:bg-black/10 flex items-center justify-between text-xs text-[#8d86c9] dark:text-[#cac4ce]">
          <span>Mostrando {filteredTransactions.length} de {transactions.length} registros</span>
          <span className="font-semibold text-[#242038] dark:text-[#f7ece1]">
            Balance filtrado: ${filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Modal Nueva Transacción */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#cac4ce]/30 dark:border-white/10">
              <h3 className="text-lg font-extrabold text-[#242038] dark:text-[#f7ece1]">
                Nueva Transacción
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 mb-4 rounded-xl bg-slate-100 dark:bg-black/30 border border-[#cac4ce]/30 dark:border-white/5">
              <button
                type="button"
                onClick={() => setNewType('expense')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  newType === 'expense' ? 'bg-rose-500 text-white shadow-sm' : 'text-[#8d86c9] dark:text-[#cac4ce]'
                }`}
              >
                Gasto
              </button>
              <button
                type="button"
                onClick={() => setNewType('income')}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  newType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-[#8d86c9] dark:text-[#cac4ce]'
                }`}
              >
                Ingreso
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3.5">
              <div>
                <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce] block mb-1">Monto ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] placeholder:text-[#cac4ce] text-sm focus:outline-none focus:border-[#9067c6] transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce] block mb-1">Concepto / Título</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Combustible, Compra en farmacia..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] placeholder:text-[#cac4ce] text-sm focus:outline-none focus:border-[#9067c6] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce] block mb-1">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-[#1c182d] text-[#242038] dark:text-[#f7ece1] text-xs font-medium focus:outline-none focus:border-[#9067c6] transition-colors cursor-pointer"
                  >
                    <option value="Alimentación">Alimentación</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Ocio">Ocio</option>
                    <option value="Salud">Salud</option>
                    <option value="Ingresos">Ingresos</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce] block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-[#1c182d] text-[#242038] dark:text-[#f7ece1] text-xs font-medium focus:outline-none focus:border-[#9067c6] transition-colors"
                  />
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
                  Registrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
