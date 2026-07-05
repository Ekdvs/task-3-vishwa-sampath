import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdOutlineSwapHoriz, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { transactionsApi } from "../../services/transaction.service";
import { categoriesApi } from "../../services/category.service";
import TransactionForm from "../../components/transactions/TransactionForm";
import TransactionList from "../../components/transactions/TransactionList";

const formatLKR = (amount: number) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(amount);

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await transactionsApi.getAll();
      setTransactions(res.data.data);
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoriesApi.getAll();
      setCategories(res.data.data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  // Summary stats
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
          <MdOutlineSwapHoriz className="text-xl text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Transactions</h1>
          <p className="text-xs text-gray-400">{transactions.length} records</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Balance */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Balance</p>
          <p className={`mt-1 text-2xl font-bold ${balance >= 0 ? "text-blue-600" : "text-red-500"}`}>
            {formatLKR(balance)}
          </p>
          <p className="mt-1 text-xs text-gray-400">{transactions.length} total transactions</p>
        </div>

        {/* Income */}
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <MdTrendingUp className="text-base text-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500">Income</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{formatLKR(totalIncome)}</p>
          <p className="mt-1 text-xs text-gray-400">
            {transactions.filter((t) => t.type === "income").length} transactions
          </p>
        </div>

        {/* Expense */}
        <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-5 shadow-sm">
          <div className="flex items-center gap-1.5">
            <MdTrendingDown className="text-base text-red-400" />
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Expenses</p>
          </div>
          <p className="mt-1 text-2xl font-bold text-red-500">{formatLKR(totalExpense)}</p>
          <p className="mt-1 text-xs text-gray-400">
            {transactions.filter((t) => t.type === "expense").length} transactions
          </p>
        </div>
      </div>

      {/* FORM */}
      <TransactionForm categories={categories} onSuccess={fetchTransactions} />

      {/* LIST */}
      <TransactionList transactions={transactions} loading={loading} onDelete={fetchTransactions} />
    </div>
  );
}