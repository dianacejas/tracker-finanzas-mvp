import { Edit2, Trash2 } from "lucide-react";
import BudgetProgressBar from "./BudgetProgressBar";

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

export default function BudgetCard({ budget, currency, onEdit, onDelete }) {
  const category = budget.category_detail || {};
  const amount = budget.amount;
  const spent = budget.spent_amount;
  const remaining = budget.remaining_amount;
  const percentage = budget.progress_percentage;
  const exceeded = budget.is_exceeded || parseFloat(percentage || 0) > 100;

  const remainingValue = typeof remaining === "string" ? parseFloat(remaining) : remaining || 0;

  return (
    <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
      <header className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: category.color ? `${category.color}20` : "#262626" }}
          >
            <span className="text-lg">{category.icon || "📊"}</span>
          </div>
          <div>
            <h3 className="font-medium text-neutral-100">{category.name || "Categoría"}</h3>
            <p className="text-xs text-neutral-500">
              {budget.month}/{budget.year}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(budget)}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100"
            aria-label="Editar presupuesto"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(budget)}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-rose-400"
            aria-label="Eliminar presupuesto"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <p className="text-xs text-neutral-500">Gastado</p>
          <p className="text-lg font-semibold tabular-nums text-neutral-100">
            {formatCurrency(spent, currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500">Presupuesto</p>
          <p className="text-lg font-semibold tabular-nums text-neutral-300">
            {formatCurrency(amount, currency)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <BudgetProgressBar progressPercentage={percentage} isExceeded={exceeded} />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-neutral-500">Saldo restante</span>
        <span className={`tabular-nums font-medium ${remainingValue < 0 ? "text-rose-400" : "text-emerald-400"}`}>
          {remainingValue < 0 ? "-" : ""}
          {formatCurrency(Math.abs(remainingValue), currency)}
        </span>
      </div>
    </article>
  );
}
