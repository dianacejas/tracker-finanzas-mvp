import { BadgeDollarSign, TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { useAuth } from "../context/useAuth";

/** Formatea un monto segun la moneda preferida del usuario. */
function formatCurrency(amount, currency) {
  try {
    return new Intl.NumberFormat("es", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Codigo de moneda invalido: mostramos el monto con el codigo crudo.
    return `${amount.toFixed(2)} ${currency}`;
  }
}

/** Tarjeta de resumen con un valor y su etiqueta. */
function StatCard({ label, value, tone = "neutral", icon: Icon }) {
  const tones = {
    income: "text-income",
    expense: "text-expense",
    neutral: "text-neutral-100",
  };

  return (
    <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <header className="flex items-center gap-2 text-neutral-400">
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        <h3 className="text-xs font-medium uppercase tracking-widest">{label}</h3>
      </header>
      <p
        className={`mt-3 text-2xl font-bold tabular-nums ${tones[tone]}`}
      >
        {value}
      </p>
    </article>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const currency = user?.preferred_currency ?? "USD";
  const balance = 673.6;
  const income = 1250.0;
  const expenses = 576.4;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-neutral-100">
          Hola, {user?.username ?? "usuario"}
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Este es el resumen de tu actividad financiera.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Balance"
          value={formatCurrency(balance, currency)}
          tone={balance >= 0 ? "income" : "expense"}
          icon={Wallet}
        />
        <StatCard
          label="Ingresos"
          value={formatCurrency(income, currency)}
          tone="income"
          icon={TrendingUp}
        />
        <StatCard
          label="Gastos"
          value={formatCurrency(expenses, currency)}
          tone="expense"
          icon={TrendingDown}
        />
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <header className="flex items-center gap-2 text-neutral-400">
          <BadgeDollarSign className="h-4 w-4" aria-hidden="true" />
          <h2 className="text-xs font-medium uppercase tracking-widest">
            Tu perfil
          </h2>
        </header>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Email
            </dt>
            <dd className="mt-1 text-sm text-neutral-100">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-neutral-500">
              Moneda preferida
            </dt>
            <dd className="mt-1 text-sm text-neutral-100">
              {user?.preferred_currency}
            </dd>
          </div>
        </dl>

        <p className="mt-6 rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-xs text-neutral-400">
          Los movimientos y presupuestos llegan en los proximos sprints. Esta
          vista confirma que la sesion JWT, el contexto de autenticacion y el
          guardia de rutas funcionan de punta a punta.
        </p>
      </section>
    </div>
  );
}
