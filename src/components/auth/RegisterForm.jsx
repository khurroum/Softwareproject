import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
} from "react-icons/fi";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "../../validation/registerSchema";
import api from "../../services/api";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // =========================
  // REGISTER
  // =========================

  const onSubmit = async (data) => {
    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      console.log(response.data);

      alert("Registration successful! You can now login.");
    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
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
              <FiUser size={27} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join us and start shopping today.
            </p>
          </div>

          {/* =========================
              FORM
          ========================= */}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* =========================
                FULL NAME
            ========================= */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>

              <div className="relative">
                <FiUser
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={19}
                />

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  {...register("name")}
                  className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                    errors.name
                      ? "border-red-400 focus:border-red-500 focus:ring-red-50"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-50"
                  }`}
                />
              </div>

              {errors.name && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* =========================
                EMAIL
            ========================= */}

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
                  className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
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

            {/* =========================
                PASSWORD
            ========================= */}

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
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  {...register("password")}
                  className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-red-50"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-50"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={19} /> : <FiEye size={19} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* =========================
                CONFIRM PASSWORD
            ========================= */}

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <FiLock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={19}
                />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className={`w-full rounded-xl border bg-gray-50 py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-gray-400 focus:bg-white focus:ring-4 ${
                    errors.confirmPassword
                      ? "border-red-400 focus:border-red-500 focus:ring-red-50"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-50"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={19} />
                  ) : (
                    <FiEye size={19} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs font-medium text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* =========================
                TERMS
            ========================= */}

            <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-500">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              <span>
                I agree to the{" "}
                <span className="font-semibold text-gray-700">
                  Terms & Conditions
                </span>
                .
              </span>
            </label>

            {/* =========================
                REGISTER BUTTON
            ========================= */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}

              {!isSubmitting && (
                <FiArrowRight
                  className="transition-transform group-hover:translate-x-1"
                  size={18}
                />
              )}
            </button>
          </form>

          {/* =========================
              LOGIN
          ========================= */}

          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?
              <Link
                to="/login"
                className="ml-1.5 font-bold text-blue-600 transition hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom text */}

      <p className="mt-5 text-center text-xs text-gray-400">
        By creating an account, you agree to our terms.
      </p>
    </div>
  );
}
