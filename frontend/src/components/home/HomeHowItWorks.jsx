import React from 'react';
import { Target, Zap, Lightbulb } from 'lucide-react';

export default function HomeHowItWorks() {
  return (
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
  );
}
