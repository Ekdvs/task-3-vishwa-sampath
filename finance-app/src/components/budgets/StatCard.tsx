import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  accent: string;
  trend?: number;
}

export default function StatCard({ label, value, sub, icon, accent, trend }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border ${accent} hover:shadow-lg transition-all duration-300`}>
      {/* Decorative background circle */}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 bg-current" />

      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm">
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
              trend >= 0 ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
            }`}
          >
            {trend >= 0 ? <FaArrowUp size={9} /> : <FaArrowDown size={9} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-2xl font-black text-slate-800 tabular-nums leading-none">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}