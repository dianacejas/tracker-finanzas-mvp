import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';

export default function DashboardBudgetsProgress({
  budgets = [],
  loading,
  monthName,
}) {
  return (
    <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#242038] dark:text-[#f7ece1]">
              Presupuestos del Mes
            </h2>
            <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce]">
              Progreso para {monthName}
            </p>
          </div>
          <Link 
            to="/budgets" 
            className="text-xs font-semibold text-[#9067c6] hover:text-[#8d86c9] flex items-center gap-1 transition-colors"
          >
            Gestionar <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
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
              const percent = b.progress_percentage !== undefined 
                ? Number(b.progress_percentage) 
                : (limitVal > 0 ? (spentVal / limitVal) * 100 : 0);
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
  );
}
