import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-neutral-950 p-6 text-center">
      <p className="text-5xl font-bold text-neutral-700">404</p>
      <h1 className="text-lg font-semibold text-neutral-100">
        Pagina no encontrada
      </h1>
      <Link
        to="/dashboard"
        className="text-sm font-semibold text-income hover:text-income-dark"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
