import React, { useState } from 'react';
import { Mail, User, Eye, EyeOff, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import peshiLogo from '/peshi_logo_fin.png';
import { useTheme } from '../context/ThemeContext';
import { extractApiError, registerRequest } from '../api/authApi';
import { registerSchema } from '../schemas/auth.schema';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { mode, toggleMode } = useTheme();
  const isDark = mode === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const validation = registerSchema.safeParse({
      username: name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      setErrorMessage(validation.error.errors[0]?.message || 'Datos de registro inválidos.');
      return;
    }

    setIsLoading(true);

    try {
      await registerRequest({
        username: validation.data.username,
        email: validation.data.email,
        password: validation.data.password,
      });

      navigate('/login');
    } catch (err) {
      if (!err?.response || (err?.name === 'TypeError' && err?.message?.toLowerCase().includes('fetch'))) {
        setErrorMessage('No pudimos conectar con el servicio. Comprueba tu conexión e intenta de nuevo.');
      } else {
        setErrorMessage(extractApiError(err, 'No se pudo crear la cuenta. Verifica los datos ingresados.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#f7ece1] dark:bg-[#242038] font-['Inter'] transition-colors duration-300 relative">
      <button
        type="button"
        onClick={toggleMode}
        className="absolute top-6 right-6 p-2.5 rounded-full bg-white dark:bg-[#242038]/80 border border-[#cac4ce] dark:border-white/10 text-[#242038] dark:text-[#f7ece1] shadow-md hover:scale-105 transition-all cursor-pointer"
        aria-label="Alternar tema"
      >
        {isDark ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5 text-[#242038]" />}
      </button>

      <div className="flex flex-col items-center mb-6 text-center">
        <img
          src={peshiLogo}
          alt="PESHITO Logo"
          className="w-20 h-20 object-contain drop-shadow-md mb-3 hover:scale-105 transition-transform duration-300"
        />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9067c6]/10 dark:bg-[#9067c6]/20 border border-[#9067c6]/25 text-[#9067c6] dark:text-[#8d86c9] text-xs font-semibold tracking-wide uppercase mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9067c6] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9067c6]"></span>
          </span>
          PESHITO FINANCE
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242038] dark:text-[#f7ece1] tracking-tight">
          Crea tu cuenta
        </h1>
        <p className="text-xs sm:text-sm text-[#8d86c9] dark:text-[#cac4ce] mt-1 font-medium max-w-xs">
          Comienza hoy a tomar el control de tu dinero
        </p>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-[#1c182d] border border-[#cac4ce]/60 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl transition-colors duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errorMessage && (
            <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 w-full text-center font-medium">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce]">
              Nombre de usuario
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="tu_usuario"
                className="w-full h-11 pl-4 pr-11 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] placeholder:text-[#cac4ce] text-sm focus:outline-none focus:border-[#9067c6] transition-colors"
              />
              <User className="absolute right-3.5 w-4 h-4 text-[#8d86c9] dark:text-[#cac4ce]/60 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce]">
              Email
            </label>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full h-11 pl-4 pr-11 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] placeholder:text-[#cac4ce] text-sm focus:outline-none focus:border-[#9067c6] transition-colors"
              />
              <Mail className="absolute right-3.5 w-4 h-4 text-[#8d86c9] dark:text-[#cac4ce]/60 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce]">
              Contraseña
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-4 pr-11 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] placeholder:text-[#cac4ce] text-sm focus:outline-none focus:border-[#9067c6] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#8d86c9] hover:text-[#9067c6] dark:text-[#cac4ce]/60 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Mostrar u ocultar contraseña"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#242038] dark:text-[#cac4ce]">
              Confirmar contraseña
            </label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-4 pr-11 rounded-xl border border-[#cac4ce] dark:border-white/15 bg-[#fdfbf9] dark:bg-black/25 text-[#242038] dark:text-[#f7ece1] placeholder:text-[#cac4ce] text-sm focus:outline-none focus:border-[#9067c6] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 text-[#8d86c9] hover:text-[#9067c6] dark:text-[#cac4ce]/60 dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Mostrar u ocultar confirmación de contraseña"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 mt-2 bg-[#9067c6] hover:bg-[#8d86c9] text-white font-bold text-sm tracking-wide rounded-xl shadow-md shadow-[#9067c6]/25 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Registrando...' : 'Crear cuenta'}
          </button>

          <p className="text-center text-xs text-[#242038]/70 dark:text-[#cac4ce] mt-1 font-normal">
            ¿Ya tienes una cuenta?{' '}
            <Link className="text-[#9067c6] hover:text-[#8d86c9] font-bold transition-colors ml-1" to="/login">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>

      <footer className="mt-8 py-4 text-center text-xs text-[#8d86c9] dark:text-[#cac4ce]/70 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        <Link className="hover:text-[#9067c6] dark:hover:text-white transition-colors cursor-pointer" to="/">
          ← Volver a inicio
        </Link>
        <span className="hidden sm:inline text-slate-300 dark:text-white/10">•</span>
        <span>© 2026 PESHITO</span>
        <span className="hidden sm:inline text-slate-300 dark:text-white/10">•</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-[#9067c6] dark:hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-[#9067c6] dark:hover:text-white transition-colors">Términos</a>
        </div>
      </footer>
    </div>
  );
}
