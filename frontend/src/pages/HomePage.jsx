import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Sparkles, 
  PieChart, 
  Sun, 
  Moon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Shield, 
  CreditCard, 
  CheckCircle2,
  Target,
  Lightbulb,
  Lock,
  ShieldCheck,
  FileDown,
  BadgeCheck,
  FileText,
  Menu,
  X
} from 'lucide-react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure
} from '@heroui/react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/useAuth';

export default function HomePage() {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === 'dark';
  const { isAuthenticated: authIsAuthenticated } = useAuth();
  const isAuthenticated = authIsAuthenticated || (typeof window !== 'undefined' && Boolean(localStorage.getItem('access_token')));
  const [activeMockupTab, setActiveMockupTab] = useState('peshi'); // 'balance' | 'gastos' | 'peshi'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalType, setModalType] = useState('terms'); // 'terms' | 'privacy'

  const handleOpenModal = (type) => {
    setModalType(type);
    onOpen();
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    if (targetId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div id="inicio" className="min-h-screen bg-[#faf8f6] dark:bg-[#242038] text-[#242038] dark:text-[#f7ece1] font-sans transition-colors duration-300 relative overflow-x-clip selection:bg-[#9067c6]/20 scroll-smooth">
      
      {/* Resplandor ambiental multicapa de fondo (SaaS Glows vivos) */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] sm:w-[950px] h-[480px] bg-gradient-to-b from-[#9067c6]/25 via-[#8d86c9]/10 to-transparent blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-[850px] -right-24 w-[450px] sm:w-[650px] h-[550px] bg-gradient-to-tr from-[#9067c6]/15 via-[#8d86c9]/10 to-transparent blur-[140px] rounded-full pointer-events-none -z-10 opacity-80" />
      <div className="absolute bottom-[400px] -left-20 w-[400px] sm:w-[550px] h-[450px] bg-gradient-to-br from-[#8d86c9]/15 to-transparent blur-[130px] rounded-full pointer-events-none -z-10 opacity-70" />

      {/* Navbar Pública */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#faf8f6]/80 dark:bg-[#242038]/80 border-b border-slate-200/80 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Oficial y Badge con retorno suave al inicio */}
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

          {/* Navegación central con Smooth Scroll controlado */}
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

      {/* Hero Section Asimétrica (2 Columnas en Desktop) */}
      <section className="pt-10 sm:pt-16 pb-16 lg:pb-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Columna Izquierda: Propuesta de Valor & Branding */}
          <div className="lg:col-span-6 xl:col-span-6 text-left">
            
            {/* Badge superior con halo de alto contraste */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9067c6]/20 border border-[#9067c6]/45 text-[#242038] dark:text-[#f7ece1] text-xs font-bold mb-5 shadow-[0_0_15px_rgba(144,103,198,0.25)] animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-[#9067c6] dark:text-[#b392e2]"/>
              <span>Control financiero sin estrés</span>
            </div>

            {/* Titular Principal con Gradiente de Marca */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] text-[#242038] dark:text-[#f7ece1]">
              El control de tu dinero, con la{' '}
              <span className="bg-gradient-to-r from-[#9067c6] via-[#a882dd] to-[#b392e2] bg-clip-text text-transparent">
                claridad
              </span>{' '}
              que siempre necesitaste.
            </h1>

            {/* Subtítulo Fluido */}
            <p className="text-sm sm:text-base text-[#242038]/75 dark:text-[#cac4ce] mt-5 leading-relaxed font-medium max-w-xl">
              Registra tus gastos en segundos, fija límites mensuales por categoría y mira crecer tus ahorros en tiempo real. Simple, visual y diseñado para acompañarte todos los días.
            </p>

            {/* Acciones Principales */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mt-7">
              <Link
                to={isAuthenticated ? "/dashboard" : "/register"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#9067c6] hover:bg-[#8d86c9] text-white text-sm font-bold shadow-lg shadow-[#9067c6]/25 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                {isAuthenticated ? "Ir a mi Panel" : "Comenzar ahora — Es gratis"}
                <ArrowRight className="w-4 h-4"/>
              </Link>
              <Link
                to={isAuthenticated ? "/dashboard" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-300/80 dark:border-white/15 bg-white/80 dark:bg-white/[0.04] text-[#242038] dark:text-[#f7ece1] text-sm font-bold shadow-sm hover:border-[#9067c6]/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-all hover:scale-[1.02]"
              >
                {isAuthenticated ? "Ver mis balances →" : "Ver panel en vivo →"}
              </Link>
            </div>

            <p className="text-xs text-[#242038]/50 dark:text-[#cac4ce]/60 mt-3 font-medium">
              Sin tarjetas de crédito requeridas · Registro en menos de 1 minuto
            </p>

            {/* Micro-tarjeta de la mascota Peshi flotando */}
            <div className="hidden md:flex items-center gap-3.5 p-3 sm:p-3.5 mt-7 rounded-2xl bg-white/80 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10 shadow-sm backdrop-blur-md max-w-md group hover:border-[#9067c6]/40 transition-colors">
              <div className="relative shrink-0">
                <img 
                  src="/peshi_logo_fin.png" 
                  alt="Peshi" 
                  className="w-11 h-11 object-contain p-1 rounded-2xl bg-[#9067c6]/10 border border-[#9067c6]/20 group-hover:scale-105 transition-transform" 
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#242038] animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#242038] dark:text-[#f7ece1]">Peshi te cuida cada peso</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    En línea
                  </span>
                </div>
                <p className="text-[11px] text-[#242038]/70 dark:text-[#cac4ce] truncate sm:whitespace-normal">
                  "Asigna techos de gasto inteligentes y ahorra sin sacrificios."
                </p>
              </div>
            </div>

          </div>

          {/* Columna Derecha: Showcase Interactivo de la App */}
          <div className="lg:col-span-6 xl:col-span-6 relative">
            
            {/* Halo de luz exterior interactivo */}
            <div className="absolute -inset-3 bg-gradient-to-r from-[#9067c6]/25 via-[#8d86c9]/15 to-[#9067c6]/20 rounded-3xl blur-3xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="bg-white/95 dark:bg-[#1c182d]/95 backdrop-blur-md border border-slate-200/90 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300">
              
              {/* Header del Mockup */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-[#242038]/50 dark:text-[#cac4ce]/60 ml-2">peshito.app/dashboard</span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3"/> +12.4% este mes
                </span>
              </div>

              {/* Barra de pestañas interactivas */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-black/25 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveMockupTab('balance')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMockupTab === 'balance'
                      ? 'bg-[#9067c6] text-white shadow-sm'
                      : 'text-[#242038]/60 dark:text-[#cac4ce] hover:text-[#9067c6]'
                  }`}
                >
                  Balance
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMockupTab('gastos')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMockupTab === 'gastos'
                      ? 'bg-[#9067c6] text-white shadow-sm'
                      : 'text-[#242038]/60 dark:text-[#cac4ce] hover:text-[#9067c6]'
                  }`}
                >
                  Gastos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMockupTab('peshi')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeMockupTab === 'peshi'
                      ? 'bg-[#9067c6] text-white shadow-sm'
                      : 'text-[#242038]/60 dark:text-[#cac4ce] hover:text-[#9067c6]'
                  }`}
                >
                  <span>Modo Peshi</span>
                  <span className={`w-2 h-2 rounded-full ${activeMockupTab === 'peshi' ? 'bg-white' : 'bg-[#9067c6]'} animate-pulse`} />
                </button>
              </div>

              {/* Vista Tab: Balance General */}
              {activeMockupTab === 'balance' && (
                <div className="space-y-3.5 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-black/20 border border-slate-200/60 dark:border-white/5">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-[#8d86c9] dark:text-[#cac4ce] uppercase tracking-wider">Balance Total</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Margen saludable
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-[#242038] dark:text-[#f7ece1] mt-1">$14.250,00</p>
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200/50 dark:border-white/5 text-xs">
                      <div>
                        <span className="text-[10px] text-[#242038]/60 dark:text-[#cac4ce]">Ingresos</span>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400">+$3.800,00</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#242038]/60 dark:text-[#cac4ce]">Gastos</span>
                        <p className="font-bold text-rose-600 dark:text-rose-400">-$1.240,50</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-black/20 border border-slate-200/60 dark:border-white/5">
                    <div className="flex items-center justify-between text-xs font-bold text-[#242038] dark:text-[#f7ece1] mb-1.5">
                      <span>Alimentación & Super</span>
                      <span className="text-[#9067c6]">68% ($340 / $500)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-black/30 overflow-hidden">
                      <div className="h-full bg-[#9067c6] rounded-full transition-all duration-500" style={{ width: '68%' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Vista Tab: Lista de Gastos */}
              {activeMockupTab === 'gastos' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-black/20 border border-slate-200/50 dark:border-white/5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-semibold text-[#242038] dark:text-[#f7ece1]">Supermercado Central</p>
                        <p className="text-[10px] text-[#242038]/50 dark:text-[#cac4ce]/70">Alimentación · Hace 2h</p>
                      </div>
                    </div>
                    <span className="font-bold text-rose-600">-$85,20</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-black/20 border border-slate-200/50 dark:border-white/5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-semibold text-[#242038] dark:text-[#f7ece1]">Pago de Salario</p>
                        <p className="text-[10px] text-[#242038]/50 dark:text-[#cac4ce]/70">Ingreso laboral · Ayer</p>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">+$3.200,00</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 dark:bg-black/20 border border-slate-200/50 dark:border-white/5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-semibold text-[#242038] dark:text-[#f7ece1]">Suscripción Streaming</p>
                        <p className="text-[10px] text-[#242038]/50 dark:text-[#cac4ce]/70">Servicios · Hace 3 días</p>
                      </div>
                    </div>
                    <span className="font-bold text-rose-600">-$14,99</span>
                  </div>
                </div>
              )}

              {/* Vista Tab: Modo Peshi Consejos */}
              {activeMockupTab === 'peshi' && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#9067c6]/15 via-white dark:via-[#1c182d] to-[#8d86c9]/10 border border-[#9067c6]/30 animate-fade-in">
                  <div className="flex items-center gap-3 mb-3">
                    <img 
                      src="/peshi_logo_fin.png" 
                      alt="Peshi" 
                      className="w-12 h-12 object-contain p-1 rounded-2xl bg-white dark:bg-[#242038] shadow-sm" 
                    />
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9067c6]">
                        Consejo Financiero de Peshi
                      </span>
                      <h4 className="text-sm font-bold text-[#242038] dark:text-[#f7ece1]">
                        ¡Vas con excelente ritmo!
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs text-[#242038]/80 dark:text-[#cac4ce] leading-relaxed">
                    Llevas un <strong>20% por debajo</strong> de tu límite en Ocio y Salidas. Si sostienes este hábito hasta fin de mes, acumularás un extra de <strong>$380</strong> para tu fondo de ahorro.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#9067c6]/20 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 text-center">
                      <span className="text-[#242038]/60 dark:text-[#cac4ce] block text-[10px]">Límite consumido</span>
                      <strong className="text-[#9067c6] text-sm">32.6%</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 text-center">
                      <span className="text-[#242038]/60 dark:text-[#cac4ce] block text-[10px]">Días del ciclo</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 text-sm">18 restantes</strong>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Bento Grid de Características con Recursos Visuales */}
      <section id="caracteristicas" className="scroll-mt-20 sm:scroll-mt-24 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9067c6]">Todo en un solo lugar</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#242038] dark:text-[#f7ece1] mt-2">
            Diseñado para que organizar tu plata no dé pereza.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Límites Inteligentes */}
          <div className="p-7 rounded-3xl bg-white/90 dark:bg-[#1c182d]/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#9067c6]/40 hover:shadow-lg flex flex-col justify-between">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-[#9067c6]/10 text-[#9067c6] mb-4">
                <PieChart className="w-6 h-6"/>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#9067c6]/10 text-[#9067c6]">
                Límites Inteligentes
              </span>
              <h3 className="text-xl font-bold text-[#242038] dark:text-[#f7ece1] mt-2">
                Nunca más te pases a fin de mes.
              </h3>
              <p className="text-xs sm:text-sm text-[#242038]/70 dark:text-[#cac4ce] mt-2 leading-relaxed">
                Asigna techos de gasto a comida, transporte o entretenimiento con barras dinámicas que te avisan antes de sobregirarte.
              </p>
            </div>
          </div>

          {/* Card 2: Visual Card (Unsplash - Ahorro & Tranquilidad) */}
          <div className="relative group rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#9067c6]/40 hover:shadow-lg min-h-[290px] flex flex-col justify-end p-7">
            <img 
              src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80"
              alt="Ahorro y tranquilidad financiera"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#242038] via-[#242038]/75 to-transparent pointer-events-none" />
            <div className="relative z-10 text-white">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider mb-2 text-white">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Tranquilidad Real
              </span>
              <h3 className="text-xl font-bold text-white">
                Ahorrar sin privarte de tus gustos.
              </h3>
              <p className="text-xs sm:text-sm text-[#cac4ce] mt-2 leading-relaxed">
                Visualiza tus márgenes de ahorro mensual para tomar decisiones con calma y sin ansiedad.
              </p>
            </div>
          </div>

          {/* Card 3: Cero Fricción */}
          <div className="p-7 rounded-3xl bg-white/90 dark:bg-[#1c182d]/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#9067c6]/40 hover:shadow-lg flex flex-col justify-between">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
                <Zap className="w-6 h-6"/>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Cero Fricción
              </span>
              <h3 className="text-xl font-bold text-[#242038] dark:text-[#f7ece1] mt-2">
                Carga movimientos en 3 clics.
              </h3>
              <p className="text-xs sm:text-sm text-[#242038]/70 dark:text-[#cac4ce] mt-2 leading-relaxed">
                Olvídate de planillas interminables de Excel. Registra tus ingresos y gastos al instante con categorías y fechas precisas.
              </p>
            </div>
          </div>

          {/* Card 4: Visual Card (Unsplash - Estilo de vida / Portabilidad) */}
          <div className="relative group rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#9067c6]/40 hover:shadow-lg min-h-[290px] flex flex-col justify-end p-7">
            <img 
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80"
              alt="Finanzas ordenadas en cualquier dispositivo"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#242038] via-[#242038]/75 to-transparent pointer-events-none" />
            <div className="relative z-10 text-white">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider mb-2 text-white">
                <CreditCard className="w-3 h-3 text-emerald-300" />
                Siempre Disponible
              </span>
              <h3 className="text-xl font-bold text-white">
                Acceso ágil desde cualquier lugar.
              </h3>
              <p className="text-xs sm:text-sm text-[#cac4ce] mt-2 leading-relaxed">
                Revisa y anota gastos sobre la marcha desde tu celular, tablet o notebook con interfaz adaptativa.
              </p>
            </div>
          </div>

          {/* Card 5: Seguridad y Privacidad */}
          <div className="p-7 rounded-3xl bg-white/90 dark:bg-[#1c182d]/90 backdrop-blur-md border border-slate-200/80 dark:border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#9067c6]/40 hover:shadow-lg flex flex-col justify-between md:col-span-2">
            <div>
              <div className="p-3 w-fit rounded-2xl bg-[#9067c6]/10 text-[#9067c6] mb-4">
                <Shield className="w-6 h-6"/>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#9067c6]/10 text-[#9067c6]">
                Privacidad Total
              </span>
              <h3 className="text-xl font-bold text-[#242038] dark:text-[#f7ece1] mt-2">
                Tus datos son 100% confidenciales.
              </h3>
              <p className="text-xs sm:text-sm text-[#242038]/70 dark:text-[#cac4ce] mt-2 leading-relaxed max-w-xl">
                Tus registros están blindados con autenticación segura y cifrado continuo. No comercializamos tu información financiera ni mostramos anuncios molestos.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-slate-200/60 dark:border-white/5 text-xs text-[#242038]/60 dark:text-[#cac4ce]">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Sin conexión bancaria obligatoria</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Cifrado en tránsito</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Exportación libre</span>
            </div>
          </div>

        </div>
      </section>

      {/* Sección Pasos (Cómo funciona) */}
      <section id="como-funciona" className="scroll-mt-20 sm:scroll-mt-24 py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9067c6]">Paso a paso</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#242038] dark:text-[#f7ece1] mt-2">
            Tres pasos simples hacia el orden
          </h2>
        </div>

        <div className="relative">
          {/* Conector visual tenue entre pasos en pantallas grandes */}
          <div className="hidden md:block absolute top-12 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-[#9067c6]/25 via-emerald-500/25 to-[#9067c6]/25 pointer-events-none -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Paso 01 */}
            <div className="group text-center p-7 rounded-3xl bg-white/70 dark:bg-[#1c182d]/70 backdrop-blur-md border border-slate-200/80 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#9067c6]/40 hover:shadow-lg">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#9067c6]/10 text-[#9067c6] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Target className="w-6 h-6 text-[#9067c6]" />
              </div>
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#9067c6]/10 text-[#9067c6] mb-2">
                Paso 01
              </span>
              <h4 className="text-base font-bold text-[#242038] dark:text-[#f7ece1] mb-1.5">Define tus metas</h4>
              <p className="text-xs text-[#242038]/70 dark:text-[#cac4ce] leading-relaxed">
                Establece cuánto quieres gastar por categoría cada mes para tener reglas claras desde el día uno.
              </p>
            </div>

            {/* Paso 02 */}
            <div className="group text-center p-7 rounded-3xl bg-white/70 dark:bg-[#1c182d]/70 backdrop-blur-md border border-slate-200/80 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#9067c6]/40 hover:shadow-lg">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-2">
                Paso 02
              </span>
              <h4 className="text-base font-bold text-[#242038] dark:text-[#f7ece1] mb-1.5">Registra sobre la marcha</h4>
              <p className="text-xs text-[#242038]/70 dark:text-[#cac4ce] leading-relaxed">
                Anota cada compra o ingreso desde tu celular en 3 segundos, categorizado y sin fricciones.
              </p>
            </div>

            {/* Paso 03 */}
            <div className="group text-center p-7 rounded-3xl bg-white/70 dark:bg-[#1c182d]/70 backdrop-blur-md border border-slate-200/80 dark:border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#9067c6]/40 hover:shadow-lg">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#9067c6]/10 text-[#9067c6] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Lightbulb className="w-6 h-6 text-[#9067c6]" />
              </div>
              <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#9067c6]/10 text-[#9067c6] mb-2">
                Paso 03
              </span>
              <h4 className="text-base font-bold text-[#242038] dark:text-[#f7ece1] mb-1.5">Decisiones inteligentes</h4>
              <p className="text-xs text-[#242038]/70 dark:text-[#cac4ce] leading-relaxed">
                Visualiza tu balance neto y ajusta tus hábitos con métricas visuales y consejos empáticos de Peshi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Confianza / Seguridad (id="seguridad") */}
      <section id="seguridad" className="scroll-mt-20 sm:scroll-mt-24 py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9067c6]">Seguridad y Privacidad</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#242038] dark:text-[#f7ece1] mt-2">
            Tu tranquilidad y tus datos, siempre blindados
          </h2>
          <p className="text-xs sm:text-sm text-[#242038]/70 dark:text-[#cac4ce] mt-2">
            Diseñamos PESHITO con una arquitectura de respeto absoluto por la privacidad e integridad de tu información.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#1c182d]/70 backdrop-blur-sm border border-slate-200/80 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#9067c6]/40 hover:shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#9067c6]/10 text-[#9067c6] flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-[#9067c6]" />
            </div>
            <h4 className="text-sm font-bold text-[#242038] dark:text-[#f7ece1] mb-1">Seguridad y Encriptación</h4>
            <p className="text-xs text-[#242038]/70 dark:text-[#cac4ce] leading-relaxed">
              Tus datos están blindados con cifrado avanzado. Tu sesión y registros están resguardados para que solo tú tengas acceso.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#1c182d]/70 backdrop-blur-sm border border-slate-200/80 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#9067c6]/40 hover:shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-[#242038] dark:text-[#f7ece1] mb-1">Sin Vinculación Bancaria</h4>
            <p className="text-xs text-[#242038]/70 dark:text-[#cac4ce] leading-relaxed">
              Tus claves bancarias nunca se solicitan. Registras de forma autónoma sin exponer tus credenciales.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#1c182d]/70 backdrop-blur-sm border border-slate-200/80 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#9067c6]/40 hover:shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-[#9067c6]/10 text-[#9067c6] flex items-center justify-center mb-3">
              <FileDown className="w-5 h-5 text-[#9067c6]" />
            </div>
            <h4 className="text-sm font-bold text-[#242038] dark:text-[#f7ece1] mb-1">Reportes y Exportación</h4>
            <p className="text-xs text-[#242038]/70 dark:text-[#cac4ce] leading-relaxed">
              Tus finanzas no quedan atrapadas. Descarga tus resúmenes y reportes mensuales cuando quieras en PDF o Excel listos para imprimir o analizar.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-[#1c182d]/70 backdrop-blur-sm border border-slate-200/80 dark:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#9067c6]/40 hover:shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <BadgeCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="text-sm font-bold text-[#242038] dark:text-[#f7ece1] mb-1">100% Sin Publicidad</h4>
            <p className="text-xs text-[#242038]/70 dark:text-[#cac4ce] leading-relaxed">
              Cero venta de métricas a terceros ni anuncios invasivos. Tu experiencia es limpia, rápida y privada.
            </p>
          </div>
        </div>
      </section>

      {/* Pre-footer Call to Action con Peshi Mascota (/peshi-bg.png) */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="relative p-6 sm:p-10 md:p-12 rounded-3xl bg-gradient-to-br from-[#9067c6]/20 via-white/90 dark:via-[#1c182d]/90 to-[#8d86c9]/15 border border-[#9067c6]/30 shadow-2xl backdrop-blur-md overflow-hidden">
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-[#9067c6]/20 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-[#8d86c9]/15 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-5 md:items-center gap-6 text-center md:text-left">
            {/* Columna de texto (3 columnas) */}
            <div className="md:col-span-3 flex flex-col items-center md:items-start pt-4 sm:pt-0">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9067c6]/10 text-[#9067c6] border border-[#9067c6]/20 text-[10px] font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3 h-3 text-[#9067c6]" />
                Comienza hoy mismo
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#242038] dark:text-[#f7ece1] leading-tight">
                Da el primer paso hacia una relación sana con tu plata.
              </h2>
              <p className="text-xs sm:text-sm text-[#242038]/70 dark:text-[#cac4ce] mt-3 leading-relaxed max-w-lg">
                Únete a PESHITO y toma el mando de tus finanzas hoy mismo. Es rápido, visual, intuitivo y completamente gratuito.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-center md:items-start gap-3 w-full sm:w-auto">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#9067c6] hover:bg-[#8d86c9] text-white text-sm font-bold shadow-lg shadow-[#9067c6]/25 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
                >
                  {isAuthenticated ? "Ir a mi Panel" : "Crear mi cuenta gratis"}
                  <ArrowRight className="w-4 h-4"/>
                </Link>
                <span className="text-[11px] text-[#242038]/50 dark:text-[#cac4ce]/60 font-medium pt-1 sm:pt-0">
                  Sin tarjetas ni contratos
                </span>
              </div>
            </div>

            {/* Ilustración de Peshi (2 columnas) */}
            <div className="md:col-span-2 relative flex justify-center items-center">
              <div className="absolute w-36 h-36 sm:w-48 sm:h-48 bg-[#9067c6]/20 blur-2xl rounded-full -z-10 animate-pulse" />
              <img 
                src="/peshi-bg.png" 
                alt="Peshi Mascota" 
                className="w-32 sm:w-44 md:w-56 h-auto object-contain drop-shadow-[0_20px_30px_rgba(144,103,198,0.35)] hover:scale-105 transition-transform duration-500 select-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Completo */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 pt-16 pb-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-200/60 dark:border-white/5">
          {/* Lado Izquierdo: Branding & Autoría */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div 
              onClick={(e) => handleSmoothScroll(e, 'inicio')}
              className="flex items-center gap-2.5 cursor-pointer group w-fit"
            >
              <img 
                src="/peshi_logo_fin.png" 
                alt="PESHITO" 
                className="w-8 h-8 object-contain transition-transform group-hover:scale-105" 
              />
              <span className="font-black text-lg tracking-wider text-[#9067c6] group-hover:text-[#8d86c9] uppercase transition-colors">
                PESHITO
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#242038]/70 dark:text-[#cac4ce] max-w-sm leading-relaxed">
              Finanzas personales pensadas para personas reales.
            </p>
            <p className="text-xs text-[#242038]/60 dark:text-[#cac4ce]/70 pt-1">
              Diseñado y desarrollado por{" "}
              <span className="font-semibold text-[#9067c6] dark:text-[#b392e2]">CP dev</span>
            </p>
          </div>

          {/* Centro: Navegación Rápida */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#9067c6]">
              Navegación
            </h5>
            <ul className="flex flex-col gap-2 text-xs font-medium text-[#242038]/70 dark:text-[#cac4ce]">
              <li>
                <a 
                  href="#inicio" 
                  onClick={(e) => handleSmoothScroll(e, 'inicio')}
                  className="hover:text-[#9067c6] dark:hover:text-white transition-colors"
                >
                  Inicio
                </a>
              </li>
              <li>
                <a 
                  href="#caracteristicas" 
                  onClick={(e) => handleSmoothScroll(e, 'caracteristicas')}
                  className="hover:text-[#9067c6] dark:hover:text-white transition-colors"
                >
                  Características
                </a>
              </li>
              <li>
                <a 
                  href="#como-funciona" 
                  onClick={(e) => handleSmoothScroll(e, 'como-funciona')}
                  className="hover:text-[#9067c6] dark:hover:text-white transition-colors"
                >
                  Cómo funciona
                </a>
              </li>
              <li>
                <a 
                  href="#seguridad" 
                  onClick={(e) => handleSmoothScroll(e, 'seguridad')}
                  className="hover:text-[#9067c6] dark:hover:text-white transition-colors"
                >
                  Seguridad
                </a>
              </li>
            </ul>
          </div>

          {/* Derecha: Legal & Redes Sociales */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#9067c6]">
              Legal y Comunidad
            </h5>
            <div className="flex flex-col gap-2 text-xs font-medium text-[#242038]/70 dark:text-[#cac4ce]">
              <button
                type="button"
                onClick={() => handleOpenModal('terms')}
                className="text-left hover:text-[#9067c6] dark:hover:text-white transition-colors cursor-pointer w-fit"
              >
                Términos y condiciones
              </button>
              <button
                type="button"
                onClick={() => handleOpenModal('privacy')}
                className="text-left hover:text-[#9067c6] dark:hover:text-white transition-colors cursor-pointer w-fit"
              >
                Política de privacidad
              </button>
            </div>

            {/* Iconos de Redes Sociales */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-[#8d86c9] dark:text-[#cac4ce]/70 block mb-2">
                Conéctate con nosotros
              </span>
              <div className="flex items-center gap-2.5 text-[#242038]/70 dark:text-[#cac4ce]">
                <a
                  href="#"
                  aria-label="X (Twitter)"
                  className="w-8 h-8 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 flex items-center justify-center hover:text-[#9067c6] dark:hover:text-white hover:border-[#9067c6]/50 hover:scale-110 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 flex items-center justify-center hover:text-[#9067c6] dark:hover:text-white hover:border-[#9067c6]/50 hover:scale-110 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="GitHub"
                  className="w-8 h-8 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 flex items-center justify-center hover:text-[#9067c6] dark:hover:text-white hover:border-[#9067c6]/50 hover:scale-110 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 flex items-center justify-center hover:text-[#9067c6] dark:hover:text-white hover:border-[#9067c6]/50 hover:scale-110 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 0 0 1.69-1.69 1.69 1.69 0 1 0-3.38 0c0 .93.76 1.69 1.69 1.69m1.39 9.74v-8.37H5.07v8.37z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de Cierre Inferior (Copyright) */}
        <div className="pt-8 flex items-center justify-center sm:justify-between text-xs text-[#242038]/60 dark:text-[#cac4ce]/70">
          <p>© 2026 PESHITO. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Modal Informativo de Términos / Privacidad */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        classNames={{
          base: "bg-white dark:bg-[#1c182d] border border-slate-200 dark:border-white/10 text-[#242038] dark:text-[#f7ece1] rounded-3xl mx-4 max-w-lg shadow-2xl",
          header: "border-b border-slate-100 dark:border-white/10 pb-3 pt-5 px-6",
          body: "py-5 px-6",
          footer: "border-t border-slate-100 dark:border-white/10 pt-3 pb-5 px-6",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2 text-base font-bold">
                {modalType === 'terms' ? (
                  <>
                    <FileText className="w-5 h-5 text-[#9067c6] shrink-0" />
                    <span>Términos y Condiciones</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Política de Privacidad</span>
                  </>
                )}
              </ModalHeader>
              <ModalBody className="text-xs leading-relaxed space-y-3.5 text-slate-600 dark:text-[#cac4ce]">
                {modalType === 'terms' ? (
                  <>
                    <p>
                      <strong className="text-[#242038] dark:text-[#f7ece1]">1. Propósito:</strong> PESHITO es una herramienta de registro y visualización de finanzas personales diseñada para acompañar tus hábitos de ahorro y control de gastos de forma autónoma.
                    </p>
                    <p>
                      <strong className="text-[#242038] dark:text-[#f7ece1]">2. Uso del servicio:</strong> El usuario es responsable de la veracidad de los datos registrados y del resguardo de sus credenciales de acceso.
                    </p>
                    <p>
                      <strong className="text-[#242038] dark:text-[#f7ece1]">3. Disponibilidad:</strong> La plataforma se ofrece como servicio continuo sin cargos ocultos ni vinculaciones bancarias obligatorias.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      <strong className="text-[#242038] dark:text-[#f7ece1]">1. Cero venta de datos:</strong> En PESHITO tu información financiera es estrictamente tuya. No comercializamos métricas ni registros con entidades comerciales ni redes publicitarias.
                    </p>
                    <p>
                      <strong className="text-[#242038] dark:text-[#f7ece1]">2. Autenticación y resguardo:</strong> Tu cuenta opera mediante autenticación segura y cifrada para evitar accesos no autorizados a tus registros.
                    </p>
                    <p>
                      <strong className="text-[#242038] dark:text-[#f7ece1]">3. Exportación y portabilidad:</strong> Puedes exportar o eliminar tus presupuestos y movimientos cuando lo desees en formatos abiertos y compatibles.
                    </p>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button 
                  className="bg-[#9067c6] hover:bg-[#8d86c9] text-white font-semibold rounded-xl px-5 text-xs shadow-md shadow-[#9067c6]/20 cursor-pointer" 
                  onPress={onClose} 
                  size="sm"
                >
                  Entendido
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>
  );
}
