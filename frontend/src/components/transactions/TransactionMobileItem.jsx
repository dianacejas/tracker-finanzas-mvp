import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function TransactionMobileItem({ transaction, onEdit, onDelete }) {
  const isIncome = transaction.type === 'INCOME' || transaction.type === 'income';
  const catName = transaction.category_detail?.name || transaction.category || 'General';
  const catColor = transaction.category_detail?.color || '#9067c6';

  return (
    <div className="py-3 px-1 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0 pr-1">
        <div className={`p-2 rounded-xl shrink-0 ${
          isIncome 
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
        }`}>
          {isIncome ? <ArrowDownLeft className="w-4 h-4"/> : <ArrowUpRight className="w-4 h-4"/>}
        </div>
        <div className="truncate">
          <p className="text-xs font-bold text-[#242038] dark:text-[#f7ece1] truncate">
            {transaction.description || transaction.title || 'Sin concepto'}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-[#8d86c9] dark:text-[#cac4ce]">{transaction.date}</span>
            <span 
              className="text-[9px] px-1.5 py-0.2 rounded-full font-semibold"
              style={{
                backgroundColor: `${catColor}15`,
                color: catColor,
                border: `1px solid ${catColor}30`
              }}
            >
              {catName}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <span className={`text-xs font-black ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isIncome ? '+' : '-'}{formatCurrency(Math.abs(Number(transaction.amount)), 'ARS')}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onEdit(transaction)}
          className="p-1 text-slate-400 hover:text-[#9067c6] dark:hover:text-[#b392e2] rounded-lg transition-colors cursor-pointer"
          title="Editar transacción"
        >
          <Pencil className="w-3.5 h-3.5"/>
        </button>
        <button
          type="button"
          onClick={() => onDelete(transaction.id)}
          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
          title="Eliminar transacción"
        >
          <Trash2 className="w-3.5 h-3.5"/>
        </button>
      </div>
    </div>
  );
}
