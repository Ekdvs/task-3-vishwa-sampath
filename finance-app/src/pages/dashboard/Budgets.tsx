import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  FaWallet, FaChartPie, FaArrowUp, FaCheckCircle, FaPlus,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

import { budgetsApi }    from "../../services/budget.service";
import { categoriesApi } from "../../services/category.service";
import { fmt }           from "../../utils/budgetHelpers";
import type { Budget, Category } from "../../types";

import StatCard        from "../../components/budgets/StatCard";
import BudgetCard      from "../../components/budgets/BudgetCard";
import BudgetFormModal from "../../components/budgets/BudgetFormModal";
import ConfirmModal    from "../../components/ConfirmModal";
import Spinner         from "../../components/Spinner";

// ─── types ────────────────────────────────────────────────────────────────────
type FilterKey = "all" | "ok" | "warn" | "over";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",  label: "All" },
  { key: "ok",   label: "On Track" },
  { key: "warn", label: "Warning" },
  { key: "over", label: "Exceeded" },
];

const defaultForm = {
  categoryId:   "",
  categoryName: "",
  amount:       "",
  period:       "monthly",
};

// ─── helpers ──────────────────────────────────────────────────────────────────
function filterBudgets(budgets: Budget[], key: FilterKey) {
  if (key === "ok")   return budgets.filter((b) => !b.isExceeded && b.percentage < 75);
  if (key === "warn") return budgets.filter((b) => !b.isExceeded && b.percentage >= 75);
  if (key === "over") return budgets.filter((b) => b.isExceeded);
  return budgets;
}

function countFilter(budgets: Budget[], key: FilterKey) {
  return filterBudgets(budgets, key).length;
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
        <FaChartPie className="text-teal-500" size={24} />
      </div>
      <h3 className="font-bold text-slate-700 text-lg mb-1">No budgets yet</h3>
      <p className="text-sm text-slate-400 mb-6 max-w-xs">
        Start tracking your spending by creating your first budget category.
      </p>
      <button
        onClick={onNew}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold shadow-md shadow-teal-200 hover:shadow-lg hover:scale-105 transition-all duration-200"
      >
        <FaPlus size={12} />
        Create First Budget
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Budgets() {
  const [budgets,    setBudgets]    = useState<Budget[]>([]);
  const [rawBudgets, setRawBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading,    setLoading]    = useState(false);

  const [form,     setForm]     = useState(defaultForm);
  const [editId,   setEditId]   = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);

  const [filter, setFilter] = useState<FilterKey>("all");

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, r, c] = await Promise.all([
        budgetsApi.getAllProgress(),
        budgetsApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setBudgets(p.data.data);
      setRawBudgets(r.data.data);
      setCategories(c.data.data);
    } catch {
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── handlers ───────────────────────────────────────────────────────────────
  const openCreate = () => {
    setForm(defaultForm);
    setEditId(null);
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    const b = rawBudgets.find((x) => x._id === id);
    if (!b) return;
    setForm({
      categoryId:   b.categoryId,
      categoryName: b.categoryName,
      amount:       String(b.amount),
      period:       b.period,
    });
    setEditId(id);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (editId) {
        await budgetsApi.update(editId, payload);
        toast.success("Budget updated");
      } else {
        await budgetsApi.create(payload);
        toast.success("Budget created");
      }
      setShowForm(false);
      setEditId(null);
      setForm(defaultForm);
      fetchAll();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await budgetsApi.delete(deleteId);
      toast.success("Budget deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
      fetchAll();
    }
  };

  // ── derived stats ──────────────────────────────────────────────────────────
  const total   = budgets.reduce((a, b) => a + b.budgetAmount, 0);
  const spent   = budgets.reduce((a, b) => a + b.spent,        0);
  const healthy = budgets.filter((b) => !b.isExceeded && b.percentage < 75).length;
  const pctUsed = total > 0 ? (spent / total) * 100 : 0;
  const filtered = filterBudgets(budgets, filter);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/80 p-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-200">
              <FaWallet className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 leading-none">Budgets</h1>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                <HiSparkles className="text-teal-400" size={12} />
                {budgets.length} budget{budgets.length !== 1 ? "s" : ""} tracked this month
              </p>
            </div>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold shadow-md shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 hover:scale-105 active:scale-100 transition-all duration-200 self-start sm:self-auto"
          >
            <FaPlus size={12} />
            New Budget
          </button>
        </div>

        {/* ── Stat cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Budget"
            value={fmt(total)}
            sub="This month's limit"
            icon={<FaWallet className="text-indigo-500" size={16} />}
            accent="border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-white"
          />
          <StatCard
            label="Total Spent"
            value={fmt(spent)}
            sub={`${pctUsed.toFixed(0)}% of budget`}
            icon={<FaArrowUp className="text-rose-500" size={16} />}
            accent="border-rose-100 bg-gradient-to-br from-rose-50/60 to-white"
          />
          <StatCard
            label="Remaining"
            value={fmt(total - spent)}
            sub="Left to spend"
            icon={<FaCheckCircle className="text-emerald-500" size={16} />}
            accent="border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white"
          />
          <StatCard
            label="Healthy"
            value={`${healthy} / ${budgets.length}`}
            sub="On-track budgets"
            icon={<FaChartPie className="text-teal-500" size={16} />}
            accent="border-teal-100 bg-gradient-to-br from-teal-50/60 to-white"
          />
        </div>

        {/* ── Monthly overview bar ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-bold text-slate-700">Monthly Overview</p>
              <p className="text-xs text-slate-400">Across all categories</p>
            </div>
            <span className={`text-sm font-bold tabular-nums ${pctUsed >= 90 ? "text-rose-500" : "text-slate-700"}`}>
              {fmt(spent)}{" "}
              <span className="text-slate-300 font-normal">/ {fmt(total)}</span>
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out ${
                pctUsed >= 100 ? "from-rose-500 to-red-600"
                : pctUsed >= 75 ? "from-amber-400 to-orange-400"
                : "from-teal-400 to-emerald-500"
              }`}
              style={{ width: `${Math.min(pctUsed, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">{pctUsed.toFixed(0)}% of total budget used</p>
        </div>

        {/* ── Filter tabs ──────────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                filter === f.key
                  ? "bg-slate-800 text-white border-slate-800 shadow-md"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {f.label}
              {f.key !== "all" && (
                <span className="ml-1.5 opacity-60 text-[10px]">
                  {countFilter(budgets, f.key)}
                </span>
              )}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 whitespace-nowrap">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Budget grid ──────────────────────────────────────────── */}
        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <EmptyState onNew={openCreate} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => (
              <BudgetCard
                key={b.budgetId}
                budget={b}
                onEdit={handleEdit}
                onDelete={setDeleteId}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modals ───────────────────────────────────────────────── */}
      {showForm && (
        <BudgetFormModal
          form={form}
          setForm={setForm}
          categories={categories}
          editId={editId}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          saving={saving}
        />
      )}

      {deleteId && (
        <ConfirmModal
          open={true}
          title="Delete Budget"
          message="This will permanently remove the budget. This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}