import { FaPlus, FaEdit, FaSave, FaTimes, FaListUl } from "react-icons/fa";
import type { Category } from "../../types";

interface BudgetForm {
  categoryId:   string;
  categoryName: string;
  amount:       string;
  period:       string;
}

interface BudgetFormModalProps {
  form:       BudgetForm;
  setForm:    (form: BudgetForm) => void;
  categories: Category[];
  editId:     string | null;
  onSave:     () => void;
  onCancel:   () => void;
  saving:     boolean;
}

const PERIODS = ["weekly", "monthly", "yearly"] as const;

export default function BudgetFormModal({
  form,
  setForm,
  categories,
  editId,
  onSave,
  onCancel,
  saving,
}: BudgetFormModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden">

        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${editId ? "bg-indigo-100 text-indigo-600" : "bg-teal-100 text-teal-600"}`}>
              {editId ? <FaEdit size={15} /> : <FaPlus size={15} />}
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">
                {editId ? "Edit Budget" : "New Budget"}
              </h2>
              <p className="text-xs text-slate-400">
                {editId ? "Update your budget details" : "Set a spending limit"}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            aria-label="Close modal"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="relative">
              <FaListUl className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={13} />
              <select
                value={form.categoryId}
                onChange={(e) => {
                  const cat = categories.find((c) => c._id === e.target.value);
                  setForm({ ...form, categoryId: e.target.value, categoryName: cat?.name || "" });
                }}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 appearance-none transition-all"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm pointer-events-none">
                $
              </span>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0"
                min={0}
                className="w-full pl-7 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
              />
            </div>
          </div>

          {/* Period toggle buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Period
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setForm({ ...form, period: p })}
                  className={`py-2.5 rounded-xl text-sm font-semibold border capitalize transition-all duration-200 ${
                    form.period === p
                      ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200"
                      : "bg-white text-slate-500 border-slate-200 hover:border-teal-300 hover:text-teal-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold shadow-md shadow-teal-200 hover:shadow-lg hover:shadow-teal-300 hover:scale-[1.02] active:scale-100 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <FaSave size={13} />
            )}
            {saving ? "Saving…" : editId ? "Update" : "Create"}
          </button>
        </div>

      </div>
    </div>
  );
}