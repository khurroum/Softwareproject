import { Link } from "react-router-dom";

export default function EmptyCart() {
  return (
    <div className="py-20 text-center">

      <h2 className="text-4xl font-bold">
        Your Cart is Empty
      </h2>

      <p className="mt-4 text-gray-600">
        Looks like you haven't added anything yet.
      </p>

      <Link
        to="/products"
        className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-4 text-white hover:bg-blue-700"
      >
        Continue Shopping
      </Link>

    </div>
  );
}