import { motion } from "framer-motion";
import {
  MdTrendingUp,
  MdTrendingDown,
  MdAccountBalance,
  MdOutlineReceiptLong,
} from "react-icons/md";
import { formatLKR } from "../../utils/budgetHelpers";

const cards = [
  {
    key: "income",
    label: "Total Income",
    icon: MdTrendingUp,
    color: "text-emerald-600",
    iconBg: "bg-emerald-100",
    border: "border-emerald-100",
    gradient: "from-emerald-50 to-white",
    valueColor: "text-emerald-600",
  },
  {
    key: "expense",
    label: "Total Expenses",
    icon: MdTrendingDown,
    color: "text-red-500",
    iconBg: "bg-red-100",
    border: "border-red-100",
    gradient: "from-red-50 to-white",
    valueColor: "text-red-500",
  },
  {
    key: "balance",
    label: "Net Balance",
    icon: MdAccountBalance,
    color: "text-blue-600",
    iconBg: "bg-blue-100",
    border: "border-blue-100",
    gradient: "from-blue-50 to-white",
    valueColor: "text-blue-600",
  },
];

export default function SummaryCards({ summary }: any) {
  const savingsRate =
    summary?.income > 0
      ? Math.round(((summary.income - summary.expense) / summary.income) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const value = summary?.[card.key] || 0;

        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm ${card.border} ${card.gradient}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {card.label}
                </p>
                <p className={`mt-2 text-2xl font-bold tabular-nums ${card.valueColor}`}>
                  {formatLKR(value)}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}>
                <Icon className={`text-xl ${card.color}`} />
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Savings rate card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.21 }}
        className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Savings Rate
            </p>
            <p className={`mt-2 text-2xl font-bold tabular-nums ${savingsRate >= 0 ? "text-violet-600" : "text-red-500"}`}>
              {savingsRate}%
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
            <MdOutlineReceiptLong className="text-xl text-violet-600" />
          </div>
        </div>
        {/* Mini progress bar */}
        <div className="mt-4 h-1.5 w-full rounded-full bg-gray-100">
          <div
            className={`h-1.5 rounded-full transition-all duration-700 ${savingsRate >= 20 ? "bg-violet-500" : savingsRate >= 0 ? "bg-yellow-400" : "bg-red-400"}`}
            style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
          />
        </div>
        <p className="mt-1.5 text-[10px] text-gray-400">
          {savingsRate >= 20 ? "Great savings!" : savingsRate >= 0 ? "Room to improve" : "Overspending"}
        </p>
      </motion.div>
    </div>
  );
}