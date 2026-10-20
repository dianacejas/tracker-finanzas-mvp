import { useId } from "react";

import { cn } from "../../utils/cn";

/** Campo de formulario con etiqueta, error accesible y clases consistentes. */
export function Input({ label, error, className, id, ...props }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium uppercase tracking-wide text-neutral-400"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full rounded-lg border bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100",
          "placeholder:text-neutral-600",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          error
            ? "border-expense focus:ring-expense"
            : "border-neutral-700 focus:border-income focus:ring-income/40",
          className
        )}
        {...props}
      />

      {error && (
        <p id={errorId} role="alert" className="text-xs text-expense">
          {error}
        </p>
      )}
    </div>
  );
}
