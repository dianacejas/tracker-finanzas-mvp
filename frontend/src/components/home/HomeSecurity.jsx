import React from 'react';
import { Lock, ShieldCheck, FileDown, BadgeCheck } from 'lucide-react';

export default function HomeSecurity() {
  return (
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
  );
}
