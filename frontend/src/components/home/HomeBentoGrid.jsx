import React from 'react';
import { PieChart, Sparkles, Zap, CreditCard, Shield, CheckCircle2 } from 'lucide-react';

export default function HomeBentoGrid() {
  return (
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

        {/* Card 4: Visual Card (Unsplash - Portabilidad) */}
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
  );
}
