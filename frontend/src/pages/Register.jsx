import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { extractApiError } from "../api/authApi";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useAuth } from "../context/useAuth";
import { AuthLayout, AuthLink } from "../layouts/AuthLayout";

/** Monedas ISO 4217 ofrecidas en el alta. */
const CURRENCIES = [
  { code: "USD", label: "USD - Dolar estadounidense" },
  { code: "EUR", label: "EUR - Euro" },
  { code: "ARS", label: "ARS - Peso argentino" },
  { code: "MXN", label: "MXN - Peso mexicano" },
  { code: "COP", label: "COP - Peso colombiano" },
  { code: "CLP", label: "CLP - Peso chileno" },
  { code: "BRL", label: "BRL - Real brasileno" },
];

const MIN_PASSWORD_LENGTH = 8;

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    preferred_currency: "USD",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function validate() {
    const errors = {};
    if (!form.username.trim()) {
      errors.username = "El nombre de usuario es obligatorio.";
    }
    if (!form.email.trim()) {
      errors.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = "Ingresa un email valido.";
    }
    if (!form.password) {
      errors.password = "La contrasena es obligatoria.";
    } else if (form.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    }
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        preferred_currency: form.preferred_currency,
      });

      // Alta correcta: iniciamos sesion para llevar al usuario al dashboard.
      await login(form.email.trim(), form.password);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setFormError(extractApiError(error, "No se pudo crear la cuenta."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a controlar tus finanzas"
      footer={
        <>
          Ya tienes cuenta? <AuthLink to="/login">Inicia sesion</AuthLink>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <p
            role="alert"
            className="rounded-lg border border-expense/40 bg-expense/10 px-3 py-2 text-sm text-expense"
          >
            {formError}
          </p>
        )}

        <Input
          label="Nombre de usuario"
          name="username"
          autoComplete="username"
          placeholder="tu_usuario"
          value={form.username}
          onChange={handleChange}
          error={fieldErrors.username}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />

        <Input
          label="Contrasena"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder={`Minimo ${MIN_PASSWORD_LENGTH} caracteres`}
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />

        <div className="space-y-1.5">
          <label
            htmlFor="preferred_currency"
            className="block text-xs font-medium uppercase tracking-wide text-neutral-400"
          >
            Moneda preferida
          </label>
          <select
            id="preferred_currency"
            name="preferred_currency"
            value={form.preferred_currency}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 focus:border-income focus:outline-none focus:ring-2 focus:ring-income/40"
          >
            {CURRENCIES.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.label}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" loading={submitting}>
          {submitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>
    </AuthLayout>
  );
}
