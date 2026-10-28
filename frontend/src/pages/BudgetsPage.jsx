import { useEffect, useState } from "react";
import { Plus, Target } from "lucide-react";

import { useAuth } from "../context/useAuth";
import { budgetsService } from "../api/budgets.service";
import { getCategories } from "../api/categories.service";
import BudgetPeriodSelector from "../components/budgets/BudgetPeriodSelector";
import BudgetCard from "../components/budgets/BudgetCard";
import BudgetModal from "../components/budgets/BudgetModal";

function SkeletonCard() {
  return (
    <article className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-neutral-800" />
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-neutral-800" />
          <div className="h-2 w-16 rounded bg-neutral-800" />
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="h-6 w-20 rounded bg-neutral-800" />
        <div className="h-6 w-20 rounded bg-neutral-800" />
      </div>
      <div className="mt-4 h-2 w-full rounded bg-neutral-800" />
    </article>
  );
}

export default function BudgetsPage() {
  const { user } = useAuth();
  const currency = user?.preferred_currency ?? "USD";
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetsData, categoriesData] = await Promise.all([
        budgetsService.getBudgets({ month, year }),
        categoriesService.getCategories(),
      ]);
      const budgetsList = Array.isArray(budgetsData) ? budgetsData : budgetsData?.results || [];
      setBudgets(budgetsList);
      const categoriesList = Array.isArray(categoriesData) ? categoriesData : categoriesData?.results || [];
      setCategories(categoriesList);
    } catch (error) {
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, year]);

  const handlePeriodChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleCreate = () => {
    setEditingBudget(null);
    setModalOpen(true);
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setModalOpen(true);
  };

  const handleDelete = async (budget) => {
    if (confirm("¿Eliminar este presupuesto?")) {
      try {
        await budgetsService.deleteBudget(budget.id);
        fetchData();
      } catch (error) {
        // ignore
      }
    }
  };

  const handleSubmit = async (payload) => {
    if (editingBudget) {
      await budgetsService.updateBudget(editingBudget.id, payload);
    } else {
      await budgetsService.createBudget(payload);
    }
    fetchData();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Presupuestos</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Gestiona y monitorea tus límites de gasto por categoría
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BudgetPeriodSelector month={month} year={year} onChange={handlePeriodChange} />
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
          >
            <Plus className="h-4 w-4" />
            Nuevo Presupuesto
          </button>
        </div>
      </header>

      {loading ? (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </section>
      ) : budgets.length === 0 ? (
        <section className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 py-12 text-center">
          <Target className="h-12 w-12 text-neutral-600" />
          <h2 className="mt-4 text-lg font-medium text-neutral-100">
            Sin presupuestos para este período
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            Crea tu primer presupuesto para empezar a monitorear tus gastos
          </p>
          <button
            type="button"
            onClick={handleCreate}
            className="mt-4 flex items-center gap-2 rounded-lg bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
          >
            <Plus className="h-4 w-4" />
            Nuevo Presupuesto
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              currency={currency}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </section>
      )}

      <BudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        initialData={editingBudget}
        defaultMonth={month}
        defaultYear={year}
      />
    </div>
  );
}
