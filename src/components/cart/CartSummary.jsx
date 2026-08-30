import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../store/features/cart/cartSlice";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/currency";

export default function CartSummary() {
  const dispatch = useDispatch();

  // ==================================================
  // CART
  // ==================================================

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  // ==================================================
  // SETTINGS
  // ==================================================

  const currency = useSelector(
    (state) => state.settings.currency
  );

  // ==================================================
  // TOTAL ITEMS
  // ==================================================

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  // ==================================================
  // SUBTOTAL
  // ==================================================

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="mt-10 rounded-xl border bg-gray-50 p-8">

      {/* ==================================================
          TITLE
      ================================================== */}

      <h2 className="text-3xl font-bold">
        Cart Summary
      </h2>


      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="mt-6 space-y-4 text-lg">

        {/* ITEMS */}

        <div className="flex justify-between">
          <span>Items</span>

          <span>
            {totalItems}
          </span>
        </div>


        {/* SUBTOTAL */}

        <div className="flex justify-between">
          <span>Subtotal</span>

          <span>
            {formatPrice(
              subtotal,
              currency
            )}
          </span>
        </div>


        {/* SHIPPING */}

        <div className="flex justify-between">
          <span>Shipping</span>

          <span className="text-green-600">
            Free
          </span>
        </div>


        <hr />


        {/* TOTAL */}

        <div className="flex justify-between text-2xl font-bold">

          <span>
            Total
          </span>

          <span>
            {formatPrice(
              subtotal,
              currency
            )}
          </span>

        </div>

      </div>


      {/* ==================================================
          ACTIONS
      ================================================== */}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">

        {/* CLEAR CART */}

        <button
          type="button"
          onClick={() =>
            dispatch(clearCart())
          }
          className="rounded-lg border border-red-500 px-6 py-3 text-red-500 transition hover:bg-red-50"
        >
          Clear Cart
        </button>


        {/* CHECKOUT */}

        <Link
          to="/checkout"
          className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
        >
          Proceed to Checkout
        </Link>

      </div>

    </div>
  );
}