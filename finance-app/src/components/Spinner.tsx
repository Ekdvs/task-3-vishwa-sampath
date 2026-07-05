import { FaSpinner } from "react-icons/fa";

export default function Spinner({ small = false }: { small?: boolean }) {
  return (
    <FaSpinner className={`animate-spin text-teal-600 ${small ? "text-sm" : "text-2xl"}`} />
  );
}