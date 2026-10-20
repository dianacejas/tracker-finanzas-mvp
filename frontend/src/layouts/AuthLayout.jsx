import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Layout para las paginas publicas de autenticacion: centra el contenido y
 * muestra la marca del producto.
 */
export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-6">
      <div className="w-full max-w-sm">
        <header className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-income/10">
            <Wallet className="h-6 w-6 text-income" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-bold text-neutral-100">{title}</h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-neutral-400">{subtitle}</p>
          )}
        </header>

        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl">
          {children}
        </section>

        {footer && (
          <p className="mt-6 text-center text-sm text-neutral-400">{footer}</p>
        )}
      </div>
    </main>
  );
}

/** Enlace estilizado para navegar entre login y registro. */
export function AuthLink({ to, children }) {
  return (
    <Link to={to} className="font-semibold text-income hover:text-income-dark">
      {children}
    </Link>
  );
}
