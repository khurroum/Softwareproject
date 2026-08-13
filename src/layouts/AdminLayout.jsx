import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiDollarSign,
  FiBarChart2,
  FiMessageSquare,
  FiSettings,
  FiArrowLeft,
  FiLogOut,
} from "react-icons/fi";

export default function AdminLayout() {
  const navigate = useNavigate();

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: FiGrid,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: FiBox,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: FiShoppingBag,
    },
    {
      name: "Revenue",
      path: "/admin/revenue",
      icon: FiDollarSign,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: FiBarChart2,
    },
    {
      name: "Messages",
      path: "/admin/messages",
      icon: FiMessageSquare,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: FiSettings,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 text-white shadow-2xl lg:block">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        {/* =========================
            LOGO
        ========================= */}

        <div className="relative flex h-24 items-center border-b border-white/10 px-6">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
              <FiGrid size={22} className="text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Admin Panel
              </h1>

              <p className="text-xs text-slate-400">Store Management</p>
            </div>
          </div>
        </div>

        {/* =========================
            NAVIGATION
        ========================= */}

        <nav className="relative px-4 py-6">
          <p className="mb-4 px-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Management
          </p>

          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator */}
                      {isActive && (
                        <span className="absolute left-0 top-2 h-8 w-1 rounded-r-full bg-white" />
                      )}

                      <Icon
                        size={19}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-400 transition group-hover:text-blue-300"
                        }
                      />

                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* =========================
            SIDEBAR BOTTOM
        ========================= */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/10 p-4 backdrop-blur-sm">
          <button
            onClick={() => navigate("/")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <FiArrowLeft size={18} />
            Back to Store
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ==================================================
          MAIN AREA
      ================================================== */}

      <div className="lg:ml-64">
        {/* ==================================================
            TOP HEADER
        ================================================== */}

        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-white/10 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-6 shadow-lg md:px-10">
          {/* Header decorative glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-10 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute left-1/3 top-0 h-20 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
          </div>

          {/* Header title */}

          <div className="relative">
            <h2 className="text-xl font-bold text-white md:text-2xl">
              Admin Dashboard
            </h2>

            <p className="text-sm text-blue-100">Manage your store</p>
          </div>

          {/* Header actions */}

          <div className="relative hidden items-center gap-3 sm:flex">
            <button
              onClick={() => navigate("/")}
              className="rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 font-medium text-white backdrop-blur-sm transition hover:bg-white hover:text-blue-700"
            >
              View Store
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-white px-5 py-2.5 font-semibold text-red-600 shadow-md transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </header>

        {/* ==================================================
            MOBILE NAVIGATION
        ================================================== */}

        <div className="border-b border-slate-200 bg-white p-4 shadow-sm lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600"
                    }`
                  }
                >
                  <Icon size={16} />

                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            PAGE CONTENT
        ================================================== */}

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
