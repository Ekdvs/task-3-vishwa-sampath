import { FaEdit, FaTrash, FaBullseye, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import { fmt, getLevel } from "../../utils/budgetHelpers";
import BudgetProgressBar from "./BudgetProgress";
import type { Budget } from "../../types";

const LEVEL_META = {
  ok: {
    label:  "On Track",
    strip:  "from-emerald-400 to-teal-500",
    badge:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon:   <FaCheckCircle className="text-emerald-500" size={11} />,
  },
  warn: {
    label:  "Watch Out",
    strip:  "from-amber-400 to-orange-400",
    badge:  "bg-amber-50 text-amber-700 border-amber-200",
    icon:   <FaExclamationTriangle className="text-amber-500" size={11} />,
  },
  over: {
    label:  "Over Budget",
    strip:  "from-rose-500 to-red-600",
    badge:  "bg-rose-50 text-rose-700 border-rose-200",
    icon:   <FaTimesCircle className="text-rose-500" size={11} />,
  },
};

interface BudgetCardProps {
  budget:   Budget;
  onEdit:   (id: string) => void;
  onDelete: (id: string) => void;
}

export default function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const remaining = budget.budgetAmount - budget.spent;
  const level     = getLevel(budget.percentage, budget.isExceeded);
  const meta      = LEVEL_META[level];

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col">

      {/* Top color strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${meta.strip}`} />

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-800 text-base truncate">{budget.categoryName}</h3>
            <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full capitalize">
              <FaBullseye size={8} />
              {budget.period}
            </span>
          </div>

          {/* Action buttons — visible on hover */}
          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => onEdit(budget.budgetId)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-400 border border-slate-100 hover:border-indigo-200 transition-all duration-200"
              aria-label="Edit budget"
            >
              <FaEdit size={12} />
            </button>
            <button
              onClick={() => onDelete(budget.budgetId)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 border border-slate-100 hover:border-rose-200 transition-all duration-200"
              aria-label="Delete budget"
            >
              <FaTrash size={12} />
            </button>
          </div>
        </div>

        {/* Amount tiles */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Budget</p>
            <p className="text-sm font-bold text-slate-700 tabular-nums">{fmt(budget.budgetAmount)}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Spent</p>
            <p className={`text-sm font-bold tabular-nums ${budget.isExceeded ? "text-rose-600" : "text-slate-700"}`}>
              {fmt(budget.spent)}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <BudgetProgressBar percentage={budget.percentage} isExceeded={budget.isExceeded} />

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-50">
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${meta.badge}`}>
            {meta.icon}
            {meta.label}
          </span>
          <div className="text-right">
            <p className="text-[10px] text-slate-400">{remaining < 0 ? "Over by" : "Remaining"}</p>
            <p className={`text-sm font-bold tabular-nums ${remaining < 0 ? "text-rose-600" : "text-emerald-600"}`}>
              {fmt(Math.abs(remaining))}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}