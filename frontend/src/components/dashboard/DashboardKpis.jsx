import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { SkeletonCard } from '../common/Skeleton';

export default function DashboardKpis({ summary, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const netBalanceNum = parseFloat(summary.net_savings || "0");
  const incomeNum = parseFloat(summary.total_income || "0");
  const expenseNum = parseFloat(summary.total_expense || "0");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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
          {formatPercentage(summary.savings_rate || 0, 1)}
        </div>
        <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce] mt-1 font-medium">
          Porcentaje de ingresos retenido
        </p>
      </div>
    </div>
  );
}
