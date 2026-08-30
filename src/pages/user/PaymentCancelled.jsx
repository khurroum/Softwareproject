import { Link } from "react-router-dom";
import { FiArrowLeft, FiShoppingBag } from "react-icons/fi";

export default function PaymentCancelled() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg rounded-3xl border bg-white p-10 text-center shadow-xl">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
          <FiArrowLeft className="text-yellow-600" size={44} />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Payment Cancelled
        </h1>

        <p className="mt-4 leading-7 text-gray-500">
          You cancelled the payment process.
          Your order has not been paid yet.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

          <Link
            to="/checkout"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Return to Checkout
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