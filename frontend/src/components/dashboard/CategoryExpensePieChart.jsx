import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import EmptyState from "../common/EmptyState";
import { SkeletonChart } from "../common/Skeleton";

const DEFAULT_COLORS = [
  "#9067c6", // Peshito Violet
  "#f59e0b", // Ámbar cálido
  "#8d86c9", // Lavanda medio
  "#6366f1", // Índigo
  "#10b981", // Esmeralda
  "#ec4899", // Rosa tenue
  "#06b6d4", // Cyan
  "#f97316", // Naranja
];

function CustomTooltip({ active, payload, currency = "ARS" }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0].payload;
  const name = item.name || "Categoría";
  const amount = item.value;
  const percentage = item.percentage;

  return (
    <div className="rounded-2xl border border-[#cac4ce]/60 dark:border-white/10 bg-white/95 dark:bg-[#1c182d]/95 px-4 py-2.5 shadow-2xl backdrop-blur-md">
      <p className="text-xs font-bold text-[#242038] dark:text-[#f7ece1]">{name}</p>
      <p className="mt-1 text-sm font-extrabold tabular-nums text-[#9067c6] dark:text-[#8d86c9]">
        {formatCurrency(amount, currency)}
      </p>
      {percentage !== undefined && percentage !== null && (
        <p className="text-[11px] font-semibold text-[#8d86c9] dark:text-[#cac4ce]">
          {Number(percentage).toFixed(1)}% del total
        </p>
      )}
    </div>
  );
}

export default function CategoryExpensePieChart({ data = [], currency = "ARS", loading, month = "Mes actual" }) {
  const displayMonth = month;

  if (loading) {
    return <SkeletonChart />;
  }

  const rawList = Array.isArray(data) ? data : data?.results || [];

  const chartData = rawList
    .map((item, index) => {
      const val = typeof item.total_amount === "string" ? parseFloat(item.total_amount) : item.total_amount || 0;
      return {
        ...item,
        name: item.category_name || item.name || "General",
        value: val,
        color: item.category_color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const totalSum = chartData.reduce((acc, curr) => acc + curr.value, 0);

  const finalChartData = chartData.map((item) => ({
    ...item,
    percentage: totalSum > 0 ? (item.value / totalSum) * 100 : 0,
  }));


  if (!rawList || rawList.length === 0 || totalSum === 0) {
    return (
      <div className="rounded-2xl border border-[#cac4ce]/60 dark:border-white/10 bg-white dark:bg-[#1c182d] p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#cac4ce]/30 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#9067c6]/10 text-[#9067c6]">
              <PieChartIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#8d86c9] dark:text-[#cac4ce]">
                Distribución de Gastos
              </h2>
            </div>
          </div>
          {displayMonth && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[#242038] dark:text-[#f7ece1] capitalize">
              {displayMonth}
            </span>
          )}
        </div>
        <div className="pt-4">
          <EmptyState
            title="Sin gastos en este período"
            description="Registra movimientos para visualizar la distribución por categoría."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#cac4ce]/60 dark:border-white/10 bg-white dark:bg-[#1c182d] p-6 shadow-sm">
      {/* Encabezado */}
      <div className="flex items-center justify-between pb-4 border-b border-[#cac4ce]/30 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#9067c6]/10 text-[#9067c6]">
            <PieChartIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#8d86c9] dark:text-[#cac4ce]">
              Distribución de Gastos
            </h2>
            <p className="text-xs text-[#242038]/70 dark:text-[#f7ece1]/70 font-medium">
              Por categoría
            </p>
          </div>
        </div>
        {displayMonth && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-[#242038] dark:text-[#f7ece1] capitalize">
            {displayMonth}
          </span>
        )}
      </div>

      {/* Contenedor Principal: 2 columnas horizontal */}
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6 pt-4">
        {/* Columna Izquierda (md:col-span-5) - Gráfico Centrado con etiqueta interior */}
        <div className="md:col-span-5 relative flex items-center justify-center">
          <div className="relative h-60 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={finalChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  cornerRadius={4}
                  paddingAngle={3}
                  stroke="none"
                >
                  {finalChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip currency={currency} />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Etiqueta centrada en el hueco de la dona */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
              <span className="text-[11px] sm:text-xs font-bold text-[#8d86c9] uppercase tracking-wider">
                Total Gastos
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#242038] dark:text-[#f7ece1] tabular-nums mt-0.5 tracking-tight">
                {formatCurrency(totalSum, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Columna Derecha (md:col-span-7) - Leyenda Detallada */}
        <div className="md:col-span-7">
          <ul className="space-y-3 max-h-72 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {finalChartData.map((item, index) => {
              const percentage = item.percentage;
              return (
                <li
                  key={index}
                  className="flex flex-col gap-1.5 p-2 rounded-xl hover:bg-slate-100/60 dark:hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-[#242038] dark:text-[#f7ece1] truncate max-w-[130px] sm:max-w-[180px]">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 tabular-nums">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#9067c6]/10 text-[#9067c6] dark:text-[#8d86c9]">
                        {percentage.toFixed(0)}%
                      </span>
                      <span className="font-bold text-[#242038] dark:text-[#f7ece1]">
                        {formatCurrency(item.value, currency)}
                      </span>
                    </div>
                  </div>
                  {/* Barra de progreso mini */}
                  <div className="w-full h-1.5 rounded-full bg-slate-200/70 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(3, percentage))}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
