// ─── TransactionList.tsx ──────────────────────────────────────────────────────
import { useState } from "react";
import toast from "react-hot-toast";
import {
  MdOutlineSwapHoriz,
  MdTrendingUp,
  MdTrendingDown,
  MdOutlineEdit,
  MdOutlineDeleteOutline,
} from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { transactionsApi } from "../../services/transaction.service";
import ConfirmModal from "../ConfirmModal";

const formatLKR = (amount: number) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(amount);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function TransactionList({ transactions, loading, onDelete }: any) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      setDeleting(true);
      await transactionsApi.delete(selectedId);
      toast.success("Transaction deleted");
      onDelete();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
      setOpen(false);
      setSelectedId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-gray-100 bg-white py-20 shadow-sm">
        <AiOutlineLoading3Quarters className="animate-spin text-2xl text-blue-400" />
        <span className="ml-3 text-sm text-gray-400">Loading transactions…</span>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center shadow-sm">
        <MdOutlineSwapHoriz className="mb-3 text-5xl text-gray-200" />
        <p className="text-sm font-medium text-gray-400">No transactions yet</p>
        <p className="mt-1 text-xs text-gray-300">Add your first transaction above</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-gray-100 bg-gray-50/70 px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          <span>Transaction</span>
          <span className="text-right">Amount</span>
          <span className="hidden sm:block">Date</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        {transactions.map((t: any, idx: number) => {
          const isIncome = t.type === "income";
          const categoryName =
            typeof t.categoryId === "object" ? t.categoryId?.name : "Uncategorized";

          return (
            <div
              key={t._id}
              className={`group grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-5 py-4 transition-colors duration-150 hover:bg-gray-50/60 ${
                idx !== transactions.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              {/* Left: icon + info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isIncome ? "bg-emerald-100" : "bg-red-100"
                  }`}
                >
                  {isIncome ? (
                    <MdTrendingUp className="text-lg text-emerald-600" />
                  ) : (
                    <MdTrendingDown className="text-lg text-red-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-700">{t.title}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {categoryName}
                    </span>
                    {t.note && (
                      <span className="truncate text-[10px] text-gray-400 hidden sm:block">
                        · {t.note}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <p
                className={`text-sm font-bold tabular-nums ${
                  isIncome ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {isIncome ? "+" : "-"}
                {formatLKR(t.amount)}
              </p>

              {/* Date */}
              <p className="hidden text-xs text-gray-400 sm:block whitespace-nowrap">
                {t.createdAt ? formatDate(t.createdAt) : "—"}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-violet-500 shadow-sm ring-1 ring-gray-100 transition hover:bg-violet-50"
                  title="Edit"
                >
                  <MdOutlineEdit className="text-sm" />
                </button>
                <button
                  onClick={() => handleDeleteClick(t._id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-red-400 shadow-sm ring-1 ring-gray-100 transition hover:bg-red-50"
                  title="Delete"
                >
                  <MdOutlineDeleteOutline className="text-sm" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        open={open}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        onCancel={() => setOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}