import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiShield,
  FiShoppingBag,
  FiShoppingCart,
  FiLogOut,
} from "react-icons/fi";

export default function Profile() {
  // ==================================================
  // GET LOGGED-IN USER
  // ==================================================

  const user = useSelector(
    (state) => state.auth.user
  );

  // ==================================================
  // NOT LOGGED IN
  // ==================================================

  if (!user) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-20">

        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <FiUser
              size={36}
              className="text-gray-500"
            />
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Profile
          </h1>

          <p className="mt-3 text-gray-500">
            Please login to view your profile.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </Link>

        </div>

      </section>
    );
  }

  // ==================================================
  // USER INFORMATION
  // ==================================================

  const userName =
    user.name ||
    user.username ||
    "User";

  const userEmail =
    user.email ||
    "No email available";

  const userRole =
    user.role ||
    "customer";

  const userId =
    user._id ||
    user.id ||
    "N/A";

  const displayRole =
    userRole.toLowerCase() === "admin"
      ? "Administrator"
      : "Customer";

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-10">

        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Account
        </p>

        <h1 className="mt-2 text-4xl font-bold md:text-5xl">
          My Profile
        </h1>

        <p className="mt-3 text-gray-500">
          Manage your account information and
          access your shopping activity.
        </p>

      </div>


      {/* ==================================================
          PROFILE HEADER
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

        {/* TOP AREA */}

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-10 md:px-10">

          <div className="flex flex-col items-center gap-5 sm:flex-row">

            {/* AVATAR */}

            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-white/30 bg-white text-4xl font-bold text-blue-600 shadow-lg">

              {userName
                .charAt(0)
                .toUpperCase()}

            </div>


            {/* NAME */}

            <div className="text-center text-white sm:text-left">

              <h2 className="text-3xl font-bold">
                {userName}
              </h2>

              <p className="mt-1 text-blue-100">
                {userEmail}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold">
                {displayRole}
              </span>

            </div>

          </div>

        </div>


        {/* ==================================================
            ACCOUNT INFORMATION
        ================================================== */}

        <div className="p-6 md:p-10">

          <h2 className="text-2xl font-bold">
            Account Information
          </h2>

          <p className="mt-1 text-gray-500">
            Your account details.
          </p>


          <div className="mt-8 grid gap-5 md:grid-cols-2">

            {/* NAME */}

            <div className="rounded-xl border p-5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FiUser size={22} />
                </div>

                <div className="min-w-0">

                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>

                  <p className="mt-1 truncate text-lg font-semibold">
                    {userName}
                  </p>

                </div>

              </div>

            </div>


            {/* EMAIL */}

            <div className="rounded-xl border p-5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FiMail size={22} />
                </div>

                <div className="min-w-0">

                  <p className="text-sm text-gray-500">
                    Email Address
                  </p>

                  <p className="mt-1 truncate text-lg font-semibold">
                    {userEmail}
                  </p>

                </div>

              </div>

            </div>


            {/* ROLE */}

            <div className="rounded-xl border p-5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FiShield size={22} />
                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Account Type
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {displayRole}
                  </p>

                </div>

              </div>

            </div>


            {/* USER ID */}

            <div className="rounded-xl border p-5">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <FiUser size={22} />
                </div>

                <div className="min-w-0">

                  <p className="text-sm text-gray-500">
                    User ID
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-gray-700">
                    {userId}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              QUICK ACTIONS
          ================================================== */}

          <div className="mt-10">

            <h2 className="text-2xl font-bold">
              Quick Actions
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              {/* ORDERS */}

              <Link
                to="/orders"
                className="flex items-center gap-4 rounded-xl border p-5 transition hover:border-blue-300 hover:bg-blue-50"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <FiShoppingBag size={22} />
                </div>

                <div>

                  <p className="font-semibold">
                    My Orders
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    View your previous orders
                  </p>

                </div>

              </Link>


              {/* CART */}

              <Link
                to="/cart"
                className="flex items-center gap-4 rounded-xl border p-5 transition hover:border-blue-300 hover:bg-blue-50"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <FiShoppingCart size={22} />
                </div>

                <div>

                  <p className="font-semibold">
                    Shopping Cart
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    View items in your cart
                  </p>

                </div>

              </Link>

            </div>

          </div>


          {/* ==================================================
              ACCOUNT STATUS
          ================================================== */}

          <div className="mt-8 rounded-xl bg-gray-50 p-5">

            <div className="flex items-center gap-3">

              <span className="h-3 w-3 rounded-full bg-green-500" />

              <div>

                <p className="font-semibold">
                  Account Active
                </p>

                <p className="text-sm text-gray-500">
                  You are currently logged in.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}