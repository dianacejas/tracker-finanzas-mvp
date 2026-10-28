import { AlertTriangle } from "lucide-react";

export default function BudgetProgressBar({ progressPercentage, isExceeded }) {
  const percentage = typeof progressPercentage === "string" ? parseFloat(progressPercentage) : progressPercentage || 0;
  const exceeded = isExceeded || percentage > 100;

  let barColor = "bg-emerald-500";
  if (exceeded) {
    barColor = "bg-rose-500 animate-pulse";
  } else if (percentage > 75) {
    barColor = "bg-amber-500";
  }

  const displayWidth = Math.min(percentage, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-400">Progreso</span>
        <span className={`font-medium tabular-nums ${exceeded ? "text-rose-400" : "text-neutral-300"}`}>
          {percentage.toFixed(2)}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-800">
        <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${displayWidth}%` }} />
      </div>
      {exceeded && (
        <div className="flex items-center gap-1 text-xs text-rose-400">
          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
          <span>Sobregiro</span>
        </div>
      )}
    </div>
  );
}
