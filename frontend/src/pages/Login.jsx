import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { extractApiError } from "../api/authApi";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { useAuth } from "../context/useAuth";
import { AuthLayout, AuthLink } from "../layouts/AuthLayout";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname ?? "/dashboard";

  function validate() {
    const errors = {};
    if (!email.trim()) {
      errors.email = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Ingresa un email valido.";
    }
    if (!password) {
      errors.password = "La contrasena es obligatoria.";
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
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (error) {
      setFormError(
        extractApiError(error, "Credenciales incorrectas. Intenta de nuevo.")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Inicia sesion"
      subtitle="Accede a tu tracker de finanzas"
      footer={
        <>
          No tienes cuenta? <AuthLink to="/register">Registrate</AuthLink>
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
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
        />

        <Input
          label="Contrasena"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Tu contrasena"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={fieldErrors.password}
        />

        <Button type="submit" loading={submitting}>
          {submitting ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </AuthLayout>
  );
}
