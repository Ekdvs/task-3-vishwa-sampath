import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  MdOutlineDashboard,
  MdOutlineRefresh,
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { dashboardApi } from "../../services/dashboard.service";
import type { DashboardChartsData, DashboardSummary } from "../../types";
import SummaryCards from "../../components/dashboard/SummaryCards";
import MonthlyChart from "../../components/dashboard/MonthlyChart";
import CategoryChart from "../../components/dashboard/CategoryChart";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import SpendingPieChart from "../../components/dashboard/SpendingPieChart";
import DailyTrendChart from "../../components/dashboard/DailyTrendChart";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" },
  }),
};

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [charts, setCharts] = useState<DashboardChartsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const [summaryRes, chartsRes] = await Promise.all([
        dashboardApi.getSummary(),
        dashboardApi.getChartsData(),
      ]);
      setSummary(summaryRes.data.data);
      setCharts(chartsRes.data.data);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-3 text-gray-400">
        <AiOutlineLoading3Quarters className="animate-spin text-3xl text-blue-400" />
        <p className="text-sm font-medium">Loading dashboard…</p>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-LK", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <motion.div
        variants={fadeUp} custom={0} initial="hidden" animate="visible"
        className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
            <MdOutlineDashboard className="text-xl text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Financial Overview</h1>
            <p className="text-xs text-gray-400">{today}</p>
          </div>
        </div>
        <button
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 self-start rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-500 shadow-sm transition hover:bg-gray-50 disabled:opacity-60 sm:self-auto"
        >
          <MdOutlineRefresh className={`text-base ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </motion.div>

      {/* SUMMARY CARDS */}
      <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
        <SummaryCards summary={summary} />
      </motion.div>

      {/* TOP CHARTS ROW */}
      <motion.div
        variants={fadeUp} custom={2} initial="hidden" animate="visible"
        className="grid grid-cols-1 gap-5 lg:grid-cols-2"
      >
        <MonthlyChart data={charts?.monthlyData || []} />
        <SpendingPieChart data={charts?.categoryData || []} />
      </motion.div>

      {/* SECONDARY CHARTS ROW */}
      <motion.div
        variants={fadeUp} custom={3} initial="hidden" animate="visible"
        className="grid grid-cols-1 gap-5 lg:grid-cols-3"
      >
        <div className="lg:col-span-2">
          <CategoryChart data={charts?.categoryData || []} />
        </div>
        <DailyTrendChart data={charts?.monthlyData || []} />
      </motion.div>

      {/* RECENT TRANSACTIONS */}
      <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible">
        <RecentTransactions data={charts?.recentTransactions || []} />
      </motion.div>
    </div>
  );
}