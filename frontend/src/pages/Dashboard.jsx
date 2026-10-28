import { useEffect, useState } from "react";

import { useAuth } from "../context/useAuth";
import { analyticsService } from "../api/analytics.service";
import KPICardGroup from "../components/dashboard/KPICardGroup";
import CategoryExpensePieChart from "../components/dashboard/CategoryExpensePieChart";
import MonthlyComparisonBarChart from "../components/dashboard/MonthlyComparisonBarChart";
import PeriodFilterBar from "../components/dashboard/PeriodFilterBar";

function getPeriodParams(period) {
  const now = new Date();
  if (period === "current") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
    };
  }
  if (period === "previous") {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0);
    return {
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
    };
  }
  return {};
}

export default function Dashboard() {
  const { user } = useAuth();
  const currency = user?.preferred_currency ?? "USD";

  const [period, setPeriod] = useState("current");
  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const params = getPeriodParams(period);
        const [summaryData, breakdownData, trendData] = await Promise.all([
          analyticsService.getFinancialSummary(params),
          analyticsService.getCategoryBreakdown(params),
          analyticsService.getMonthlyTrend({ months: period === "last6" ? 6 : 6 }),
        ]);

        if (!ignore) {
          setSummary(summaryData);
          setBreakdown(Array.isArray(breakdownData) ? breakdownData : []);
          setTrend(Array.isArray(trendData) ? trendData : []);
        }
      } catch (error) {
        if (!ignore) {
          setSummary(null);
          setBreakdown([]);
          setTrend([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [period]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">
            Hola, {user?.username ?? "usuario"}
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Dashboard analítico - Métricas financieras y gestión de presupuestos
          </p>
        </div>
        <PeriodFilterBar period={period} onChange={setPeriod} />
      </header>

      <KPICardGroup summary={summary} currency={currency} loading={loading} />

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MonthlyComparisonBarChart data={trend} currency={currency} loading={loading} />
        </div>
        <div className="lg:col-span-5">
          <CategoryExpensePieChart data={breakdown} currency={currency} loading={loading} />
        </div>
      </section>
    </div>
  );
}
