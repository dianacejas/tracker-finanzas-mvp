import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

function formatCurrency(amount, currency = "USD") {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount || 0;
  try {
    return new Intl.NumberFormat("es", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(numericAmount);
  } catch {
    return `${numericAmount.toFixed(0)}`;
  }
}

function formatCurrencyFull(amount, currency = "USD") {
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

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const income = payload.find((p) => p.dataKey === "income")?.value || 0;
  const expense = payload.find((p) => p.dataKey === "expense")?.value || 0;
  const net = income - expense;

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950/95 px-3 py-2 shadow-xl backdrop-blur">
      <p className="text-xs font-medium text-neutral-400">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="mt-1 text-sm tabular-nums" style={{ color: entry.color }}>
          {entry.name}: {formatCurrencyFull(entry.value, currency)}
        </p>
      ))}
      <p className="mt-1 text-xs text-neutral-300">
        Balance neto: {formatCurrencyFull(net, currency)}
      </p>
    </div>
  );
}

function formatMonthLabel(monthStr) {
  if (!monthStr) return "";
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString("es", { month: "short", year: "2-digit" });
}

export default function MonthlyComparisonBarChart({ data = [], currency = "USD", loading }) {
  if (loading) {
    return (
      <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <header className="flex items-center gap-2 text-neutral-400">
          <BarChart3 className="h-4 w-4" aria-hidden="true" />
          <h2 className="text-xs font-medium uppercase tracking-widest">
            Evolución de Ingresos vs Gastos
          </h2>
        </header>
        <div className="mt-6 h-64 animate-pulse rounded bg-neutral-800" />
      </article>
    );
  }

  if (!data || data.length === 0) {
    return (
      <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <header className="flex items-center gap-2 text-neutral-400">
          <BarChart3 className="h-4 w-4" aria-hidden="true" />
          <h2 className="text-xs font-medium uppercase tracking-widest">
            Evolución de Ingresos vs Gastos
          </h2>
        </header>
        <div className="mt-6 flex h-64 flex-col items-center justify-center text-center">
          <p className="text-sm text-neutral-400">Sin datos en el período</p>
          <p className="mt-1 text-xs text-neutral-500">
            No hay movimientos registrados para mostrar la tendencia.
          </p>
        </div>
      </article>
    );
  }

  const chartData = data.map((item) => ({
    month: formatMonthLabel(item.month),
    income: typeof item.income === "string" ? parseFloat(item.income) : item.income || 0,
    expense: typeof item.expense === "string" ? parseFloat(item.expense) : item.expense || 0,
    net: typeof item.net === "string" ? parseFloat(item.net) : item.net || 0,
  }));

  return (
    <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <header className="flex items-center gap-2 text-neutral-400">
        <BarChart3 className="h-4 w-4" aria-hidden="true" />
        <h2 className="text-xs font-medium uppercase tracking-widest">
          Evolución de Ingresos vs Gastos
        </h2>
      </header>
      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
            <XAxis dataKey="month" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#737373"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value, currency)}
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Legend wrapperStyle={{ fontSize: "12px", color: "#a3a3a3" }} />
            <Bar dataKey="income" name="Ingresos" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}
