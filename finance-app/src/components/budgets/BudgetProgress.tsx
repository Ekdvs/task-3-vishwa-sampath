import { FaFire } from "react-icons/fa";
import { getLevel } from "../../utils/budgetHelpers";

const LEVEL_BAR: Record<string, string> = {
  ok:   "from-emerald-400 to-teal-500",
  warn: "from-amber-400 to-orange-400",
  over: "from-rose-500 to-red-600",
};

interface BudgetProgressBarProps {
  percentage: number;
  isExceeded: boolean;
}

export default function BudgetProgressBar({ percentage, isExceeded }: BudgetProgressBarProps) {
  const level = getLevel(percentage, isExceeded);
  const safe  = Math.min(percentage, 100);

  return (
    <div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${LEVEL_BAR[level]} transition-all duration-700 ease-out`}
          style={{ width: `${safe}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[11px] text-slate-400">{percentage.toFixed(1)}% used</span>
        {isExceeded && (
          <span className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
            <FaFire size={9} /> Exceeded
          </span>
        )}
      </div>
    </div>
  );
}