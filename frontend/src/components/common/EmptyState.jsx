import React from "react";
import peshiLogo from "/peshi_logo_fin.png";

export default function EmptyState({
  title = "Sin datos por aquí",
  description = "No encontramos elementos para mostrar en este período.",
  actionLabel,
  onAction,
}) {
  return (
    <div className="w-full py-12 px-6 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="relative mb-4 group">
        <div className="absolute inset-0 bg-[#9067c6]/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
        <img
          src={peshiLogo}
          alt="Peshi Mascota"
          className="relative w-24 h-24 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-[#242038] dark:text-[#f7ece1] mb-1 max-w-sm">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-[#8d86c9] dark:text-[#cac4ce] max-w-md font-medium mb-5">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-[#9067c6] hover:bg-[#8d86c9] text-white text-xs font-bold shadow-md shadow-[#9067c6]/20 transition-all hover:scale-105 cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
