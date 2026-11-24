import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function HomePreFooterCta({ isAuthenticated }) {
  return (
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
  );
}
