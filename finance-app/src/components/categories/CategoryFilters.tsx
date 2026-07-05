import { MdOutlineSearch, MdOutlineFilterList, MdClose } from "react-icons/md";

type Props = {
  search: string;
  setSearch: (v: string) => void;
  filter: "all" | "income" | "expense";
  setFilter: (v: "all" | "income" | "expense") => void;
};

const FILTERS: { value: "all" | "income" | "expense"; label: string }[] = [
  { value: "all",     label: "All" },
  { value: "income",  label: "Income" },
  { value: "expense", label: "Expense" },
];

const activeStyle: Record<string, string> = {
  all:     "bg-violet-500 text-white shadow-sm ring-violet-200",
  income:  "bg-emerald-500 text-white shadow-sm ring-emerald-200",
  expense: "bg-red-500 text-white shadow-sm ring-red-200",
};

export default function CategoryFilters({ search, setSearch, filter, setFilter }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">

      {/* Search */}
      <div className="relative flex-1">
        <MdOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories…"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-9 text-sm text-gray-700 placeholder-gray-400 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <MdClose className="text-base" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="hidden h-6 w-px bg-gray-200 sm:block" />

      {/* Filter buttons */}
      <div className="flex items-center gap-1.5">
        <MdOutlineFilterList className="mr-1 shrink-0 text-lg text-gray-400" />
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize ring-1 transition-all duration-200 ${
              filter === f.value
                ? activeStyle[f.value]
                : "bg-gray-50 text-gray-500 ring-gray-200 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}