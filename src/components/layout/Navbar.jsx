import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiMenu, FiUser, FiX } from "react-icons/fi";
import Logo from "../common/Logo";

import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../store/features/auth/authSlice";
import { clearCart } from "../../store/features/cart/cartSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // =========================
  // SEARCH
  // =========================

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const searchValue = search.trim();

    if (!searchValue) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(searchValue)}`);

    setSearchOpen(false);
  };

  // =========================
  // CART
  // =========================

  const cartItems = useSelector((state) => state.cart.items);

  const totalItems = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );

  // =========================
  // AUTH
  // =========================

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // =========================
  // ADMIN CHECK
  // =========================

  const isAdmin =
    isAuthenticated && (user?.role === "admin" || user?.isAdmin === true);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
  };

  // =========================
  // NAV LINK STYLE
  // =========================

  const navLinkClass = ({ isActive }) =>
    `
      relative px-1 py-2 text-sm font-medium
      transition-all duration-200
      ${isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}

      after:absolute
      after:bottom-0
      after:left-0
      after:h-0.5
      after:rounded-full
      after:bg-blue-600
      after:transition-all
      after:duration-200

      ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
    `;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* ==================================================
            LOGO
        ================================================== */}

        <div className="shrink-0">
          <Logo />
        </div>

        {/* ==================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/products" className={navLinkClass}>
            Products
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/orders" className={navLinkClass}>
              My Orders
            </NavLink>
          )}
        </div>

        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* ==================================================
              SEARCH
          ================================================== */}

          {searchOpen ? (
            <form
              onSubmit={handleSearchSubmit}
              className="
                flex
                items-center
                overflow-hidden
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                shadow-sm
                transition-all
                duration-200
              "
            >
              <FiSearch size={19} className="ml-3 shrink-0 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                autoFocus
                placeholder="Search products..."
                className="
                  w-32
                  bg-transparent
                  px-3
                  py-2.5
                  text-sm
                  text-gray-800
                  outline-none
                  placeholder:text-gray-400
                  sm:w-48
                  lg:w-60
                "
              />

              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearch("");
                }}
                className="
                  mr-1
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-gray-400
                  transition
                  hover:bg-gray-200
                  hover:text-gray-700
                "
                aria-label="Close search"
              >
                <FiX size={18} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              title="Search Products"
              onClick={() => setSearchOpen(true)}
              className="
                group
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-gray-600
                transition-all
                duration-200
                hover:bg-gray-100
                hover:text-blue-600
              "
            >
              <FiSearch
                size={20}
                className="
                  transition-transform
                  duration-200
                  group-hover:scale-110
                "
              />
            </button>
          )}

          {/* ==================================================
              CART
          ================================================== */}

          <Link
            to="/cart"
            title="Shopping Cart"
            className="
              group
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-gray-600
              transition-all
              duration-200
              hover:bg-gray-100
              hover:text-blue-600
            "
          >
            <div className="relative">
              <FiShoppingCart
                size={21}
                className="
                  transition-transform
                  duration-200
                  group-hover:scale-110
                "
              />

              {totalItems > 0 && (
                <span
                  className="
                    absolute
                    -right-3
                    -top-3
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-600
                    px-1
                    text-[10px]
                    font-bold
                    text-white
                    shadow-sm
                  "
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </div>
          </Link>

          {/* DIVIDER */}

          <div className="mx-1 hidden h-7 w-px bg-gray-200 lg:block" />

          {/* ==================================================
              ADMIN PANEL
          ================================================== */}

          {isAdmin && (
            <Link
              to="/admin"
              className="
                hidden
                rounded-lg
                bg-gray-900
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:bg-gray-800
                hover:shadow-md
                md:block
              "
            >
              Admin Panel
            </Link>
          )}

          {/* ==================================================
              AUTHENTICATED USER
          ================================================== */}

          {isAuthenticated ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/profile"
                className="
                  group
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  px-2
                  py-1.5
                  transition
                  hover:bg-gray-50
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-blue-50
                    text-blue-600
                  "
                >
                  <FiUser size={17} />
                </div>

                <div className="hidden lg:block">
                  <p className="text-xs text-gray-400">Welcome</p>

                  <p className="max-w-[110px] truncate text-sm font-semibold text-gray-800">
                    {user?.name || "User"}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="
                  rounded-lg
                  border
                  border-gray-200
                  px-3.5
                  py-2
                  text-sm
                  font-semibold
                  text-gray-700
                  transition-all
                  duration-200
                  hover:border-red-200
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="
                  rounded-lg
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-gray-700
                  transition
                  hover:bg-gray-100
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  rounded-lg
                  bg-blue-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-blue-700
                  hover:shadow-md
                "
              >
                Create Account
              </Link>
            </div>
          )}

          {/* ==================================================
              MOBILE MENU
          ================================================== */}

          <button
            type="button"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-gray-700
              transition
              hover:bg-gray-100
              hover:text-blue-600
              md:hidden
            "
            aria-label="Open menu"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </nav>
    </header>
  );
}
