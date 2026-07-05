import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MdOutlineLogout } from "react-icons/md";
import { AiOutlineBarChart } from "react-icons/ai";
import { authApi } from "../../services/auth.service";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await authApi.logout();
    if (res.data.success) {
      logout();
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="flex h-16 items-center justify-between  bg-white px-6 shadow-sm">

      {/* LEFT */}
      <div className="flex items-center gap-2">
        <AiOutlineBarChart className="text-2xl text-blue-600" />
        <span className="text-base font-bold text-gray-800">
          Finance Dashboard
        </span>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* USER */}
        <div className="flex items-center gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white">
            {initials}
          </div>

          <span className="hidden text-sm font-medium text-gray-700 sm:block">
            {user?.name}
          </span>

        </div>

        {/* DIVIDER */}
        <div className="h-6 w-px bg-gray-200" />

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
        >
          <MdOutlineLogout className="text-base" />
          Logout
        </button>

      </div>
    </header>
  );
}