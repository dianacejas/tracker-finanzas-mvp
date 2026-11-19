import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Accordion, AccordionItem } from "@heroui/react";
import { formatCurrency } from '../../utils/formatters';

export default function BudgetCard({ budget, transactions = [], onEdit, onDelete }) {
  const spentVal = Number(budget.spent_amount || 0);
  const limitVal = Number(budget.amount || 0);
  const percent = budget.progress_percentage !== undefined 
    ? Number(budget.progress_percentage) 
    : (limitVal > 0 ? (spentVal / limitVal) * 100 : 0);
  const isOver = budget.is_exceeded || percent > 100;
  const isWarning = percent >= 80 && !isOver;
  const categoryName = budget.category_detail?.name || 'Categoría';
  const categoryColor = budget.category_detail?.color || '#9067c6';

  const categoryTransactions = transactions.filter((t) => {
    const isCategoryMatch = 
      (t.category && budget.category && String(t.category) === String(budget.category)) ||
      (t.category_detail?.name && budget.category_detail?.name && 
        t.category_detail.name.toLowerCase() === budget.category_detail.name.toLowerCase()) ||
      (t.category && typeof t.category === 'string' && budget.category && typeof budget.category === 'string' &&
        t.category.toLowerCase() === budget.category.toLowerCase());

    const isExpense = 
      t.type === 'EXPENSE' || 
      t.type?.toLowerCase() === 'expense' || 
      Number(t.amount) < 0;

    return isCategoryMatch && isExpense;
  });

  return (
    <div className="bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
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
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(budget);
              }}
              className="p-1.5 text-slate-400 hover:text-[#9067c6] dark:hover:text-[#b392e2] rounded-lg transition-colors cursor-pointer"
              title="Editar presupuesto"
            >
              <Pencil className="w-4 h-4"/>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(budget.id);
              }}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
              title="Eliminar presupuesto"
            >
              <Trash2 className="w-4 h-4"/>
            </button>
          </div>
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
                        -{formatCurrency(Math.abs(Number(item.amount)), 'ARS')}
                      </span>
                    </div>
                  ))}

                  {categoryTransactions.length > 3 && (
                    <p className="text-center text-[10px] text-[#9067c6] font-semibold pt-1">
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
}
