import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const DEFAULT_COLORS = [
  "#22d3ee",
  "#a78bfa",
  "#34d399",
  "#f59e0b",
  "#f43f5e",
  "#60a5fa",
  "#fb7185",
  "#2dd4bf",
];

function formatCurrency(amount, currency = "USD") {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount || 0;
  try {
    return new Intl.NumberFormat("es", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${numericAmount.toFixed(2)} ${currency}`;
  }
}

function CustomTooltip({ active, payload, currency }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const data = payload[0].payload;
  const name = data.category_name || data.name || "Categoría";
  const amount = data.total_amount ?? data.value;
  const percentage = data.percentage;

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950/95 px-3 py-2 shadow-xl backdrop-blur">
      <p className="text-xs font-medium text-neutral-100">{name}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-neutral-100">
        {formatCurrency(amount, currency)}
      </p>
      {percentage !== undefined && percentage !== null && (
        <p className="text-xs text-neutral-400">{Number(percentage).toFixed(2)}%</p>
      )}
    </div>
  );
}

export default function CategoryExpensePieChart({ data = [], currency = "USD", loading }) {
  if (loading) {
    return (
      <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <header className="flex items-center gap-2 text-neutral-400">
          <PieChartIcon className="h-4 w-4" aria-hidden="true" />
          <h2 className="text-xs font-medium uppercase tracking-widest">
            Distribución de Gastos por Categoría
          </h2>
        </header>
        <div className="mt-6 flex h-64 items-center justify-center">
          <div className="h-48 w-48 animate-pulse rounded-full bg-neutral-800" />
        </div>
      </article>
    );
  }

  if (!data || data.length === 0) {
    return (
      <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <header className="flex items-center gap-2 text-neutral-400">
          <PieChartIcon className="h-4 w-4" aria-hidden="true" />
          <h2 className="text-xs font-medium uppercase tracking-widest">
            Distribución de Gastos por Categoría
          </h2>
        </header>
        <div className="mt-6 flex h-64 flex-col items-center justify-center text-center">
          <p className="text-sm text-neutral-400">Sin gastos en este período</p>
          <p className="mt-1 text-xs text-neutral-500">
            No hay egresos registrados para mostrar el desglose.
          </p>
        </div>
      </article>
    );
  }

  const chartData = data.map((item, index) => ({
    ...item,
    name: item.category_name || item.name,
    value: typeof item.total_amount === "string" ? parseFloat(item.total_amount) : item.total_amount,
    color: item.category_color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  return (
    <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <header className="flex items-center gap-2 text-neutral-400">
        <PieChartIcon className="h-4 w-4" aria-hidden="true" />
        <h2 className="text-xs font-medium uppercase tracking-widest">
          Distribución de Gastos por Categoría
        </h2>
      </header>
      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip currency={currency} />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 space-y-2">
        {chartData.map((item, index) => (
          <li key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-neutral-300">{item.name}</span>
            </div>
            <div className="flex items-center gap-3 tabular-nums">
              <span className="text-neutral-100">{formatCurrency(item.value, currency)}</span>
              <span className="text-xs text-neutral-500">
                {item.percentage !== undefined ? `${Number(item.percentage).toFixed(2)}%` : ""}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
