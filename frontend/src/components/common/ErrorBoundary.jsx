import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary capturó un error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#faf8f6] dark:bg-[#242038] text-[#242038] dark:text-[#f7ece1]">
          <div className="w-full max-w-md bg-white dark:bg-[#1c182d] border border-rose-500/20 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <h2 className="text-xl font-bold tracking-tight">
              Algo no salió como esperábamos
            </h2>
            
            <p className="text-xs text-[#8d86c9] dark:text-[#cac4ce]">
              Ocurrió un error al cargar la vista. Puedes intentar recargar la página o volver al panel principal.
            </p>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-black/30 text-left text-xs text-rose-500 dark:text-rose-400 font-mono overflow-auto max-h-24">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-[#9067c6] hover:bg-[#8d86c9] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Recargar página
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
