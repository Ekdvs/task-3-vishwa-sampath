import { NavLink } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineSwapHoriz,
  MdOutlineAccountBalanceWallet,
  MdOutlineCategory,
  MdOutlineTrendingUp,
} from "react-icons/md";

const menu = [
  { name: "Dashboard", path: "/", icon: MdOutlineDashboard },
  { name: "Transactions", path: "/transactions", icon: MdOutlineSwapHoriz },
  { name: "Budgets", path: "/budgets", icon: MdOutlineAccountBalanceWallet },
  { name: "Categories", path: "/categories", icon: MdOutlineCategory },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 flex-col  bg-white shadow-sm">

      {/* BRAND */}
      <div className="flex h-16 items-center gap-3 border-b px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500 shadow-sm">
          <MdOutlineTrendingUp className="text-lg text-white" />
        </div>

        <span className="text-base font-bold text-gray-800">
          Finance App
        </span>
      </div>

      {/* NAV */}
      <nav className="flex-1 space-y-1 p-3 pt-4">

        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Main Menu
        </p>

        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`text-lg transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                />

                {item.name}

                {/* Active dot */}
                {isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="border-t p-4 text-xs text-gray-400">
        © {new Date().getFullYear()} Finance App
      </div>
    </aside>
  );
}