import { Link } from "react-router-dom";
import { FiCheckCircle, FiShoppingBag } from "react-icons/fi";

export default function PaymentSuccess() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg rounded-3xl border bg-white p-10 text-center shadow-xl">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <FiCheckCircle className="text-green-600" size={44} />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Payment Successful!
        </h1>

        <p className="mt-4 leading-7 text-gray-500">
          Your payment has been successfully processed.
          Your order is now being prepared.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            View My Orders
          </Link>

          <Link
            to="/products"
            className="flex items-center justify-center gap-2 rounded-xl border px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <FiShoppingBag size={18} />
            Continue Shopping
          </Link>

        </div>

      </div>
    </section>
  );
}