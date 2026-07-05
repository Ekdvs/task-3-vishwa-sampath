import { MdOutlineEdit, MdOutlineDeleteOutline, MdTrendingUp, MdTrendingDown } from "react-icons/md";

type Props = {
  category: {
    _id: string;
    name: string;
    type: "income" | "expense";
  };
  onEdit: (cat: any) => void;
  onDelete: (id: string) => void;
};

export default function CategoryCard({ category, onEdit, onDelete }: Props) {
  const isIncome = category.type === "income";

  return (
    <div
      className={`group relative flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 hover:shadow-md ${
        isIncome
          ? "border-emerald-100 bg-emerald-50/60 hover:border-emerald-200"
          : "border-red-100 bg-red-50/60 hover:border-red-200"
      }`}
    >
      {/* Left: icon + info */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm ${
            isIncome ? "bg-emerald-100" : "bg-red-100"
          }`}
        >
          {isIncome ? (
            <MdTrendingUp className="text-xl text-emerald-600" />
          ) : (
            <MdTrendingDown className="text-xl text-red-500" />
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700">{category.name}</p>
          <span
            className={`mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              isIncome
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-500"
            }`}
          >
            <span className={`h-1 w-1 rounded-full ${isIncome ? "bg-emerald-500" : "bg-red-500"}`} />
            {category.type}
          </span>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <button
          onClick={() => onEdit(category)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-violet-500 shadow-sm ring-1 ring-gray-100 transition hover:bg-violet-50 hover:text-violet-600"
          title="Edit"
        >
          <MdOutlineEdit className="text-base" />
        </button>

        <button
          onClick={() => onDelete(category._id)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-red-400 shadow-sm ring-1 ring-gray-100 transition hover:bg-red-50 hover:text-red-600"
          title="Delete"
        >
          <MdOutlineDeleteOutline className="text-base" />
        </button>
      </div>
    </div>
  );
}