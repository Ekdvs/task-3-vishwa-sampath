import { motion } from "framer-motion";
import { MdTrendingUp, MdTrendingDown, MdOutlineReceipt } from "react-icons/md";
import { formatLKR } from "../../utils/budgetHelpers";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-LK", { day: "2-digit", month: "short" });

export default function RecentTransactions({ data }: any) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
            <MdOutlineReceipt className="text-base text-orange-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-700">Recent Transactions</h2>
            <p className="text-[10px] text-gray-400">Last {data.length} transactions</p>
          </div>
        </div>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold text-gray-500">
          {data.length} records
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MdOutlineReceipt className="mb-2 text-4xl text-gray-200" />
          <p className="text-sm text-gray-400">No recent transactions</p>
        </div>
      ) : (
        <div className="space-y-1">
          {data.map((tx: any, i: number) => {
            const isIncome = tx.type === "income";
            return (
              <motion.div
                key={tx._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50/80"
              >
                {/* Icon */}
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isIncome ? "bg-emerald-100" : "bg-red-100"}`}>
                  {isIncome
                    ? <MdTrendingUp className="text-lg text-emerald-600" />
                    : <MdTrendingDown className="text-lg text-red-500" />
                  }
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-700">{tx.title}</p>
                  <div className="flex items-center gap-1.5">
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${isIncome ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                      {tx.categoryId?.name || "Uncategorized"}
                    </span>
                    {tx.createdAt && (
                      <span className="text-[10px] text-gray-400">{formatDate(tx.createdAt)}</span>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <p className={`shrink-0 text-sm font-bold tabular-nums ${isIncome ? "text-emerald-600" : "text-red-500"}`}>
                  {isIncome ? "+" : "−"}{formatLKR(tx.amount)}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}