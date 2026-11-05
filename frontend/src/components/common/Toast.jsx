import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all animate-fade-in ${
                isSuccess
                  ? "bg-white/95 dark:bg-[#1c182d]/95 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                  : isError
                  ? "bg-white/95 dark:bg-[#1c182d]/95 border-rose-500/30 text-rose-600 dark:text-rose-400"
                  : "bg-white/95 dark:bg-[#1c182d]/95 border-[#9067c6]/30 text-[#9067c6] dark:text-[#8d86c9]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isSuccess && <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />}
                {isError && <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />}
                {!isSuccess && !isError && <Info className="w-5 h-5 shrink-0 text-[#9067c6]" />}
                <span className="text-xs sm:text-sm font-semibold text-[#242038] dark:text-[#f7ece1]">
                  {toast.message}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { addToast: () => {} };
  }
  return context;
}
