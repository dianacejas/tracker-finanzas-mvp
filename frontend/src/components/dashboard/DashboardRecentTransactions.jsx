import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';

export default function DashboardRecentTransactions({
  transactions = [],
  loading,
  onOpenModal,
}) {
  return (
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

      {loading ? (
        <div className="space-y-3">
          <div className="h-12 w-full bg-slate-200 dark:bg-white/10 rounded-xl animate-pulse" />
          <div className="h-12 w-full bg-slate-200 dark:bg-white/10 rounded-xl animate-pulse" />
          <div className="h-12 w-full bg-slate-200 dark:bg-white/10 rounded-xl animate-pulse" />
        </div>
      ) : transactions.length > 0 ? (
        <div className="divide-y divide-[#cac4ce]/30 dark:divide-white/5">
          {transactions.map((tx) => {
            const isIncome = tx.type === 'INCOME';
            const amountVal = Number(tx.amount || 0);
            const categoryName = tx.category_detail?.name || 'General';
            const categoryColor = tx.category_detail?.color || '#9067c6';

            return (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    isIncome 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}>
                    {isIncome ? <ArrowDownLeft className="w-4 h-4"/> : <ArrowUpRight className="w-4 h-4"/>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-[#242038] dark:text-[#f7ece1] truncate">
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
          onAction={onOpenModal}
        />
      )}
    </div>
  );
}
