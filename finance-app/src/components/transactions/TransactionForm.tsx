import { useState } from "react";
import toast from "react-hot-toast";
import {
  MdOutlineAdd,
  MdOutlineTitle,
  MdOutlineAttachMoney,
  MdOutlineCategory,
  MdOutlineNotes,
} from "react-icons/md";
import { transactionsApi } from "../../services/transaction.service";

export default function TransactionForm({ categories, onSuccess }: any) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
    categoryId: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const createTransaction = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    if (!form.amount || Number(form.amount) <= 0) return toast.error("Enter a valid amount");
    if (!form.categoryId) return toast.error("Please select a category");

    try {
      setLoading(true);
      await transactionsApi.create({ ...form, amount: Number(form.amount) });
      toast.success("Transaction added");
      setForm({ title: "", amount: "", type: "expense", categoryId: "", note: "" });
      onSuccess();
    } catch {
      toast.error("Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((c: any) => c.type === form.type);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-500">
        <MdOutlineAdd className="text-base text-blue-500" />
        New Transaction
      </h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">

        {/* TITLE */}
        <div className="relative">
          <MdOutlineTitle className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* AMOUNT */}
        <div className="relative">
          <MdOutlineAttachMoney className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
          <input
            name="amount"
            type="number"
            placeholder="Amount (LKR)"
            value={form.amount}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* TYPE TOGGLE */}
        <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">
          {(["income", "expense"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, type: t, categoryId: "" })}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold capitalize transition-all duration-200 ${
                form.type === t
                  ? t === "income"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-red-500 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* CATEGORY */}
        <div className="relative">
          <MdOutlineCategory className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-700 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select Category</option>
            {filteredCategories.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* NOTE */}
        <div className="relative">
          <MdOutlineNotes className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
          <input
            name="note"
            placeholder="Note (optional)"
            value={form.note}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 transition focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* SUBMIT */}
        <button
          onClick={createTransaction}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-600 active:scale-95 disabled:opacity-60"
        >
          <MdOutlineAdd className="text-lg" />
          {loading ? "Adding…" : "Add Transaction"}
        </button>
      </div>
    </div>
  );
}