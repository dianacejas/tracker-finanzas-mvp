import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, PieChart, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useTheme } from '../context/ThemeContext';
import peshiLogo from '/peshi_logo_fin.png';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transacciones', icon: ArrowLeftRight },
  { to: '/budgets', label: 'Presupuestos', icon: PieChart },
];

export function AppLayout() {
  const { logout } = useAuth();
  const { mode, toggleMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Aseguramos el cierre de sesión aunque falle la petición
    } finally {
      try {
        localStorage.removeItem('access_token');
      } catch {
        // ignore
      }
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f6] dark:bg-[#242038] text-[#242038] dark:text-[#f7ece1] transition-colors duration-300">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#1c182d]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Marca */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group transition-transform hover:scale-[1.02]"
            title="Ir a inicio"
          >
            <img
              src={peshiLogo}
              alt="PESHITO Logo"
              className="w-9 h-9 object-contain drop-shadow-sm transition-transform group-hover:rotate-[-4deg]"
            />
            <span className="text-lg font-black tracking-widest text-[#9067c6] group-hover:text-[#8d86c9] uppercase transition-colors">
              PESHITO
            </span>
          </Link>

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
              onClick={toggleMode}
              className="p-2 rounded-full bg-[#f7ece1] dark:bg-[#242038]/80 border border-[#cac4ce]/60 dark:border-white/10 text-[#242038] dark:text-[#f7ece1] hover:scale-105 transition-all cursor-pointer"
              aria-label="Alternar tema"
            >
              {mode === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#242038]" />}
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
