import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { MdOutlineDonutLarge } from "react-icons/md";
import { formatLKR } from "../../utils/budgetHelpers";

const COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#f97316",
  "#14b8a6", "#eab308", "#06b6d4", "#a855f7",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.payload.fill }} />
        <p className="text-xs font-semibold text-gray-600">{item.name}</p>
      </div>
      <p className="mt-1 text-sm font-bold text-gray-800">{formatLKR(item.value)}</p>
      <p className="text-[10px] text-gray-400">{item.payload.percent}% of total</p>
    </div>
  );
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function SpendingPieChart({ data }: any) {
  const total = data.reduce((s: number, d: any) => s + (d.totalAmount || 0), 0);

  const enriched = data.map((d: any) => ({
    ...d,
    value: d.totalAmount,
    percent: total > 0 ? Math.round((d.totalAmount / total) * 100) : 0,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50">
          <MdOutlineDonutLarge className="text-base text-pink-500" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-700">Spending Distribution</h2>
          <p className="text-[10px] text-gray-400">Category share of total expenses</p>
        </div>
      </div>

      {enriched.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-gray-300">
          No data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={enriched}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              labelLine={false}
              label={renderCustomLabel}
              animationDuration={900}
            >
              {enriched.map((_: any, i: number) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}