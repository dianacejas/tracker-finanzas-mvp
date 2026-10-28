import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function BudgetPeriodSelector({ month, year, onChange }) {
  const handlePrev = () => {
    if (month === 1) {
      onChange(12, year - 1);
    } else {
      onChange(month - 1, year);
    }
  };

  const handleNext = () => {
    if (month === 12) {
      onChange(1, year + 1);
    } else {
      onChange(month + 1, year);
    }
  };

  const handleMonthChange = (e) => {
    onChange(parseInt(e.target.value), year);
  };

  const handleYearChange = (e) => {
    onChange(month, parseInt(e.target.value));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-2">
        <Calendar className="h-4 w-4 text-neutral-500" aria-hidden="true" />
        <button
          type="button"
          onClick={handlePrev}
          className="p-1 text-neutral-400 hover:text-neutral-100"
          aria-label="Mes anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <select
          value={month}
          onChange={handleMonthChange}
          className="bg-transparent px-2 py-1.5 text-sm text-neutral-100 focus:outline-none"
        >
          {MONTHS.map((name, index) => (
            <option key={index + 1} value={index + 1}>
              {name}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={handleYearChange}
          className="bg-transparent px-2 py-1.5 text-sm text-neutral-100 focus:outline-none"
        >
          {Array.from({ length: 5 }, (_, i) => year - 2 + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleNext}
          className="p-1 text-neutral-400 hover:text-neutral-100"
          aria-label="Mes siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
