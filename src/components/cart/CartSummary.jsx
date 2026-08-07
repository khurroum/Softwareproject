import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../store/features/cart/cartSlice";
import { Link } from "react-router-dom";

export default function CartSummary() {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="mt-10 rounded-xl border bg-gray-50 p-8">

      <h2 className="text-3xl font-bold">
        Cart Summary
      </h2>

      <div className="mt-6 space-y-4 text-lg">

        <div className="flex justify-between">
          <span>Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>

        <hr />

        <div className="flex justify-between text-2xl font-bold">
          <span>Total</span>
          <span>${subtotal}</span>
        </div>

      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">

        <button
          onClick={() => dispatch(clearCart())}
          className="rounded-lg border border-red-500 px-6 py-3 text-red-500 hover:bg-red-50"
        >
          Clear Cart
        </button>

        <Link
          to="/checkout"
          className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
        >
          Proceed to Checkout
        </Link>

      </div>

    </div>
  );
}