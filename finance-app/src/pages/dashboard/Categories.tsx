import React, { useEffect, useMemo, useState } from "react";
import CategoryFilters from "../../components/categories/CategoryFilters";
import CategoryCard from "../../components/categories/CategoryCard";
import { categoriesApi } from "../../services/category.service";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";
import Loading from "../../components/Loading";
import {
  MdOutlineCategory,
  MdOutlineAdd,
  MdOutlineEdit,
} from "react-icons/md";

type Category = {
  _id: string;
  name: string;
  type: "income" | "expense";
};

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoriesApi.getAll();
      if (res.data.success) {
        setCategories(res.data.data);
        toast.success(res.data.message || "Categories loaded");
      } else {
        toast.error(res.data.message || "Failed to load categories");
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchSearch = cat.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || cat.type === filter;
      return matchSearch && matchFilter;
    });
  }, [categories, search, filter]);

  const incomeCount = categories.filter((c) => c.type === "income").length;
  const expenseCount = categories.filter((c) => c.type === "expense").length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");

    try {
      if (editId) {
        const res = await categoriesApi.update(editId, { name, type });
        if (res.data.success) toast.success(res.data.message || "Category updated");
        else toast.error(res.data.message || "Failed to update");
      } else {
        const res = await categoriesApi.create({ name, type });
        if (res.data.success) toast.success(res.data.message || "Category created");
        else toast.error(res.data.message || "Failed to create");
      }
      setName("");
      setType("expense");
      setEditId(null);
      fetchCategories();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (cat: Category) => {
    setName(cat.name);
    setType(cat.type);
    setEditId(cat._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await categoriesApi.delete(deleteId);
      if (res.data.success) toast.success(res.data.message || "Category deleted");
      else toast.error(res.data.message || "Failed to delete");
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
            <MdOutlineCategory className="text-xl text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Categories</h1>
            <p className="text-xs text-gray-400">{categories.length} total categories</p>
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {incomeCount} Income
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500 ring-1 ring-red-200">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {expenseCount} Expense
          </span>
        </div>
      </div>

      {/* FORM */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-600">
          {editId ? (
            <><MdOutlineEdit className="text-base text-violet-500" /> Edit Category</>
          ) : (
            <><MdOutlineAdd className="text-base text-violet-500" /> New Category</>
          )}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          {/* Name input */}
          <div className="flex-1">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Groceries, Salary…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
            />
          </div>

          {/* Type toggle */}
          <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1">
            {(["income", "expense"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold capitalize transition-all duration-200 ${
                  type === t
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

          {/* Submit */}
          <button
            type="submit"
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:brightness-105 active:scale-95 ${
              editId
                ? "bg-violet-500 hover:bg-violet-600"
                : "bg-violet-500 hover:bg-violet-600"
            }`}
          >
            {editId ? (
              <><MdOutlineEdit className="text-base" /> Update</>
            ) : (
              <><MdOutlineAdd className="text-base" /> Add</>
            )}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => { setEditId(null); setName(""); setType("expense"); }}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* FILTERS */}
      <CategoryFilters
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      {/* LIST */}
      {loading ? (
        <Loading text="Loading categories..." />
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <MdOutlineCategory className="mb-3 text-4xl text-gray-300" />
          <p className="text-sm font-medium text-gray-400">No categories found</p>
          <p className="mt-1 text-xs text-gray-300">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((cat) => (
            <CategoryCard
              key={cat._id}
              category={cat}
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      )}

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
}