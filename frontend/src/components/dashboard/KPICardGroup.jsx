import { ArrowDownRight, ArrowUpRight, Percent, Wallet } from "lucide-react";

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

function StatCard({ label, value, tone = "neutral", icon: Icon, subtitle }) {
  const tones = {
    income: "text-income",
    expense: "text-expense",
    neutral: "text-neutral-100",
    positive: "text-income",
    negative: "text-expense",
  };

  return (
    <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-neutral-400">
          {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
          <h3 className="text-xs font-medium uppercase tracking-widest">{label}</h3>
        </div>
      </header>
      <p className={`mt-3 text-2xl font-bold tabular-nums ${tones[tone]}`}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>}
    </article>
  );
}

function SkeletonCard() {
  return (
    <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 animate-pulse">
      <div className="h-3 w-24 rounded bg-neutral-800" />
      <div className="mt-3 h-8 w-32 rounded bg-neutral-800" />
      <div className="mt-2 h-2 w-16 rounded bg-neutral-800" />
    </article>
  );
}

export default function KPICardGroup({ summary, currency, loading }) {
  if (loading) {
    return (
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </section>
    );
  }

  const totalIncome = summary?.total_income ?? "0.00";
  const totalExpense = summary?.total_expense ?? "0.00";
  const netSavings =
    typeof summary?.net_savings === "string"
      ? summary.net_savings
      : (parseFloat(totalIncome) - parseFloat(totalExpense)).toFixed(2);
  const savingsRate = summary?.savings_rate ?? 0;

  const netValue = parseFloat(netSavings);
  const incomeValue = parseFloat(totalIncome);
  const expenseValue = parseFloat(totalExpense);

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Ingresos Totales"
        value={formatCurrency(incomeValue, currency)}
        tone="income"
        icon={ArrowUpRight}
        subtitle="Acumulado del período"
      />
      <StatCard
        label="Gastos Totales"
        value={formatCurrency(expenseValue, currency)}
        tone="expense"
        icon={ArrowDownRight}
        subtitle="Acumulado del período"
      />
      <StatCard
        label="Balance Neto"
        value={formatCurrency(netValue, currency)}
        tone={netValue >= 0 ? "income" : "expense"}
        icon={Wallet}
        subtitle={netValue >= 0 ? "Superávit" : "Déficit"}
      />
      <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
        <header className="flex items-center gap-2 text-neutral-400">
          <Percent className="h-4 w-4" aria-hidden="true" />
          <h3 className="text-xs font-medium uppercase tracking-widest">Tasa de Ahorro</h3>
        </header>
        <p className="mt-3 text-2xl font-bold tabular-nums text-neutral-100">
          {Number(savingsRate).toFixed(2)}%
        </p>
        <div className="mt-3 h-1.5 w-full rounded-full bg-neutral-800">
          <div
            className="h-1.5 rounded-full bg-income"
            style={{ width: `${Math.min(Math.max(Number(savingsRate), 0), 100)}%` }}
          />
        </div>
      </article>
    </section>
  );
}
