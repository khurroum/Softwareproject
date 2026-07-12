import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">

      {/* Left Side */}
      <div className="hidden bg-blue-600 p-16 text-white lg:flex lg:flex-col lg:justify-center">

        <h1 className="text-5xl font-bold">
          ShopEase
        </h1>

        <p className="mt-6 text-xl">
          Shop smarter with quality products and secure payments.
        </p>

        <div className="mt-12 space-y-5">

          <div>
            ✅ Premium Quality Products
          </div>

          <div>
            🚚 Fast Delivery
          </div>

          <div>
            🔒 Secure Payments
          </div>

          <div>
            💬 24/7 Customer Support
          </div>

        </div>

      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center bg-gray-100 p-6">
        <Outlet />
      </div>

    </div>
  );
}