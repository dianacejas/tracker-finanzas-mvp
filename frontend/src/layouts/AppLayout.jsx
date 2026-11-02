import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, PieChart, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import peshiLogo from '/peshi_logo_fin.png';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transacciones', icon: ArrowLeftRight },
  { to: '/budgets', label: 'Presupuestos', icon: PieChart },
];

export function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Aseguramos el cierre de sesión aunque falle la petición
    } finally {
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } catch {
        // ignore
      }
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7ece1] dark:bg-[#242038] text-[#242038] dark:text-[#f7ece1] transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#1c182d]/90 backdrop-blur-md border-b border-[#cac4ce]/50 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Marca */}
          <div className="flex items-center gap-2.5">
            <img
              src={peshiLogo}
              alt="PESHITO Logo"
              className="w-9 h-9 object-contain drop-shadow-sm"
            />
            <span className="text-lg font-black tracking-widest text-[#9067c6] uppercase">
              PESHITO
            </span>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#9067c6]/15 text-[#9067c6] dark:text-[#8d86c9]'
                      : 'text-[#242038]/70 dark:text-[#cac4ce] hover:bg-[#9067c6]/10 hover:text-[#9067c6] dark:hover:text-[#8d86c9]'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[#f7ece1] dark:bg-[#242038]/80 border border-[#cac4ce]/60 dark:border-white/10 text-[#242038] dark:text-[#f7ece1] hover:scale-105 transition-all cursor-pointer"
              aria-label="Alternar tema"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#242038]" />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-[#242038]/70 dark:text-[#cac4ce] hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-all cursor-pointer"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      {/* Navegación Móvil */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 dark:bg-[#1c182d]/95 backdrop-blur-md border-t border-[#cac4ce]/50 dark:border-white/10">
        <div className="grid grid-cols-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-[#9067c6] dark:text-[#8d86c9]'
                    : 'text-[#242038]/60 dark:text-[#cac4ce]/70'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
      <div className="h-16 md:hidden" />
    </div>
  );
}
