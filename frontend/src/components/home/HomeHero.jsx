import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, TrendingUp, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function HomeHero({
  isAuthenticated,
  activeMockupTab,
  setActiveMockupTab,
}) {
  return (
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
  );
}
