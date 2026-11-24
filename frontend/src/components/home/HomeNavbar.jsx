import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, ArrowRight, Menu, X } from 'lucide-react';

export default function HomeNavbar({
  isDark,
  toggleMode,
  isAuthenticated,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  handleSmoothScroll,
}) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#faf8f6]/80 dark:bg-[#242038]/80 border-b border-slate-200/80 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo Oficial y Retorno al inicio */}
        <a 
          href="#inicio" 
          onClick={(e) => handleSmoothScroll(e, 'inicio')}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <img 
            src="/peshi_logo_fin.png" 
            alt="PESHITO" 
            className="w-8 h-8 object-contain transition-transform group-hover:scale-110" 
          />
          <span className="text-xl sm:text-2xl font-black tracking-tight text-[#242038] dark:text-[#f7ece1]">
            PESHITO
          </span>
        </a>

        {/* Navegación central con Smooth Scroll */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#242038]/70 dark:text-[#cac4ce]">
          <a 
            href="#inicio" 
            onClick={(e) => handleSmoothScroll(e, 'inicio')}
            className="hover:text-[#9067c6] dark:hover:text-white transition-colors cursor-pointer"
          >
            Inicio
          </a>
          <a 
            href="#caracteristicas" 
            onClick={(e) => handleSmoothScroll(e, 'caracteristicas')}
            className="hover:text-[#9067c6] dark:hover:text-white transition-colors cursor-pointer"
          >
            Características
          </a>
          <a 
            href="#como-funciona" 
            onClick={(e) => handleSmoothScroll(e, 'como-funciona')}
            className="hover:text-[#9067c6] dark:hover:text-white transition-colors cursor-pointer"
          >
            Cómo funciona
          </a>
          <a 
            href="#seguridad" 
            onClick={(e) => handleSmoothScroll(e, 'seguridad')}
            className="hover:text-[#9067c6] dark:hover:text-white transition-colors cursor-pointer"
          >
            Seguridad
          </a>
        </nav>

        {/* Botones de acción */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleMode}
            className="p-2 rounded-xl text-[#242038]/70 dark:text-[#cac4ce] hover:text-[#9067c6] dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Cambiar tema"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400"/> : <Moon className="w-4 h-4 text-[#242038]"/>}
          </button>

          {isAuthenticated ? (
            <Link 
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#9067c6] hover:bg-[#8d86c9] text-white text-xs font-bold shadow-md shadow-[#9067c6]/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
              to="/dashboard"
            >
              <span>Ir a mi Panel</span>
              <ArrowRight className="w-3.5 h-3.5"/>
            </Link>
          ) : (
            <>
              <Link 
                className="hidden sm:inline-block px-3.5 py-2 text-xs font-bold text-[#242038]/80 dark:text-[#f7ece1] hover:text-[#9067c6] transition-colors" 
                to="/login"
              >
                Iniciar sesión
              </Link>
              <Link 
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#9067c6] hover:bg-[#8d86c9] text-white text-xs font-bold shadow-md shadow-[#9067c6]/25 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                to="/register"
              >
                <span>Crear cuenta</span>
              </Link>
            </>
          )}

          {/* Botón Hamburguesa Móvil */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#242038]/70 dark:text-[#cac4ce] hover:text-[#9067c6] dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-white/10 bg-[#faf8f6]/95 dark:bg-[#1c182d]/95 backdrop-blur-xl px-4 py-5 shadow-2xl space-y-4">
          <nav className="flex flex-col gap-2">
            <a
              href="#inicio"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleSmoothScroll(e, 'inicio');
              }}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#242038] dark:text-[#f7ece1] hover:bg-[#9067c6]/10 hover:text-[#9067c6] transition-colors"
            >
              Inicio
            </a>
            <a
              href="#caracteristicas"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleSmoothScroll(e, 'caracteristicas');
              }}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#242038] dark:text-[#f7ece1] hover:bg-[#9067c6]/10 hover:text-[#9067c6] transition-colors"
            >
              Características
            </a>
            <a
              href="#como-funciona"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleSmoothScroll(e, 'como-funciona');
              }}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#242038] dark:text-[#f7ece1] hover:bg-[#9067c6]/10 hover:text-[#9067c6] transition-colors"
            >
              Cómo funciona
            </a>
            <a
              href="#seguridad"
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleSmoothScroll(e, 'seguridad');
              }}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-[#242038] dark:text-[#f7ece1] hover:bg-[#9067c6]/10 hover:text-[#9067c6] transition-colors"
            >
              Seguridad
            </a>
          </nav>

          {!isAuthenticated && (
            <div className="pt-2 border-t border-slate-200/60 dark:border-white/10 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold text-[#242038] dark:text-[#f7ece1] hover:border-[#9067c6]"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-[#9067c6] text-white text-xs font-bold shadow-md shadow-[#9067c6]/25"
              >
                Crear cuenta gratis
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
