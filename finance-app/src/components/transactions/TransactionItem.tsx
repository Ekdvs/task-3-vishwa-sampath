import { FaTrash, FaEdit } from "react-icons/fa";
import { transactionsApi } from "../../services/transaction.service";
import toast from "react-hot-toast";

const formatLKR = (amount: number) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
  }).format(amount);

export default function TransactionItem({ transaction, onDelete }: any) {
  const handleDelete = async () => {
    try {
      await transactionsApi.delete(transaction._id);
      toast.success("Deleted");
      onDelete();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b hover:bg-gray-50">

      {/* LEFT */}
      <div>
        <h3 className="font-semibold">{transaction.title}</h3>

        <p className="text-sm text-gray-500">
          {typeof transaction.categoryId === "object"
            ? transaction.categoryId.name
            : "Category"}{" "}
          • {transaction.type}
        </p>

        <p
          className={`font-bold ${
            transaction.type === "income"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {formatLKR(transaction.amount)}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex gap-3">
        <button className="text-blue-500">
          <FaEdit />
        </button>

        <button onClick={handleDelete} className="text-red-500">
          <FaTrash />
        </button>
      </div>
    </div>
  );
}