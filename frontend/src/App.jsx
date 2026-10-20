import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { cn } from "./utils/cn";

const MOVEMENTS = [
  { label: "Sueldo", amount: "+1.250,00", kind: "income" },
  { label: "Alquiler", amount: "-480,00", kind: "expense" },
  { label: "Supermercado", amount: "-96,40", kind: "expense" },
];

function MovementRow({ label, amount, kind }) {
  const isIncome = kind === "income";

  return (
    <li className="flex items-center justify-between border-b border-neutral-800 py-2 last:border-b-0">
      <span className="text-sm text-neutral-300">{label}</span>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          isIncome ? "text-income" : "text-expense"
        )}
      >
        {amount}
      </span>
    </li>
  );
}

export default function App() {
  const balance = 673.6;

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-6">
      <section className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl">
        <header className="flex items-center gap-2 text-neutral-400">
          <Wallet className="h-4 w-4" aria-hidden="true" />
          <h1 className="text-xs font-medium uppercase tracking-widest">
            Balance del mes
          </h1>
        </header>

        <p
          className={cn(
            "mt-3 text-3xl font-bold tabular-nums",
            balance >= 0 ? "text-income" : "text-expense"
          )}
        >
          {balance >= 0 ? "+" : "-"}${Math.abs(balance).toFixed(2)}
        </p>

        <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
          <TrendingUp className="h-3 w-3" aria-hidden="true" />
          78% del presupuesto mensual
        </p>

        <ul className="mt-6">
          {MOVEMENTS.map((movement) => (
            <MovementRow key={movement.label} {...movement} />
          ))}
        </ul>

        <footer className="mt-6 flex items-center gap-2 rounded-lg bg-expense/10 p-3 text-xs text-expense">
          <TrendingDown className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Tailwind v3 con tokens financieros activos.</span>
        </footer>
      </section>
    </main>
  );
}
