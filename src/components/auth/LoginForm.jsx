import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../validation/loginSchema";
import api from "../../services/api";

import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../store/features/auth/authSlice";
import { setCart } from "../../store/features/cart/cartSlice";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // =========================
  // REDIRECT IF LOGGED IN
  // =========================

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // =========================
  // LOGIN
  // =========================

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const user = response.data.user;
      const token = response.data.token;

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      dispatch(
        loginSuccess({
          user,
          token,
        })
      );

      // Restore user's cart
      const userCartKey = `cart_${user.email}`;

      const savedCart =
        localStorage.getItem(userCartKey);

      if (savedCart) {
        try {
          const previousCart =
            JSON.parse(savedCart);

          dispatch(setCart(previousCart));
        } catch (error) {
          console.error(
            "Failed to restore cart:",
            error
          );

          dispatch(setCart([]));
        }
      } else {
        dispatch(setCart([]));
      }

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <div className="w-full max-w-md">

      {/* =========================
          CARD
      ========================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">

        {/* Top Accent */}
        <div className="h-1.5 bg-blue-600" />

        <div className="p-7 sm:p-9">

          {/* =========================
              HEADER
          ========================= */}

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiShield size={27} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue shopping with us.
            </p>

          </div>


          {/* =========================
              FORM
          ========================= */}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">

                <FiMail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={19}
                />

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...register("email")}
                  className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                    errors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-red-50"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-50"
                  }`}
                />

              </div>

              {errors.email && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.email.message}
                </p>
              )}

            </div>


            {/* PASSWORD */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">

                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={19}
                />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-red-50"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-50"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff size={19} />
                  ) : (
                    <FiEye size={19} />
                  )}
                </button>

              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.password.message}
                </p>
              )}

            </div>


            {/* =========================
                REMEMBER / FORGOT
            ========================= */}

            <div className="flex items-center justify-between gap-3">

              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">

                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                Remember me

              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Forgot password?
              </Link>

            </div>


            {/* =========================
                LOGIN BUTTON
            ========================= */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Signing in..."
                : "Sign In"}

              {!isSubmitting && (
                <FiArrowRight
                  className="transition-transform group-hover:translate-x-1"
                  size={18}
                />
              )}

            </button>

          </form>


          {/* =========================
              REGISTER
          ========================= */}

          <div className="mt-7 border-t border-gray-100 pt-6 text-center">

            <p className="text-sm text-gray-500">

              Don't have an account?

              <Link
                to="/register"
                className="ml-1.5 font-bold text-blue-600 transition hover:text-blue-700"
              >
                Create one
              </Link>

            </p>

          </div>

        </div>

      </div>


      {/* Security Text */}

      <p className="mt-5 text-center text-xs text-gray-400">
        Your information is securely protected.
      </p>

    </div>
  );
}