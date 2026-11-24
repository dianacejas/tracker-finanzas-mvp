import React from 'react';

export default function HomeFooter({ handleSmoothScroll, onOpenModal }) {
  return (
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
              onClick={() => onOpenModal('terms')}
              className="text-left hover:text-[#9067c6] dark:hover:text-white transition-colors cursor-pointer w-fit"
            >
              Términos y condiciones
            </button>
            <button
              type="button"
              onClick={() => onOpenModal('privacy')}
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
  );
}
