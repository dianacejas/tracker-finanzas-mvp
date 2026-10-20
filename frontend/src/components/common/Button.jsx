import { cn } from "../../utils/cn";

const VARIANTS = {
  primary:
    "bg-income text-neutral-950 hover:bg-income-dark focus-visible:outline-income",
  danger:
    "bg-expense text-white hover:bg-expense-dark focus-visible:outline-expense",
  ghost:
    "bg-transparent text-neutral-300 hover:bg-neutral-800 focus-visible:outline-neutral-600",
};

/** Boton reutilizable con estados de carga y variantes semanticas. */
export function Button({
  children,
  variant = "primary",
  type = "button",
  loading = false,
  disabled = false,
  className,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5",
        "text-sm font-semibold transition-colors",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
