import { useDispatch, useSelector } from "react-redux";

import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../store/features/cart/cartSlice";

import { formatPrice } from "../../utils/currency";

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  // ==================================================
  // STORE CURRENCY
  // ==================================================

  const currency = useSelector(
    (state) => state.settings.currency
  );

  // ==================================================
  // ITEM PRICE
  // ==================================================

  const itemPrice = Number(item.price || 0);

  const quantity = Number(
    item.quantity || 0
  );

  const itemTotal =
    itemPrice * quantity;

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="flex flex-col gap-6 rounded-xl border p-6 md:flex-row md:items-center">

      {/* ==================================================
          IMAGE
      ================================================== */}

      <img
        src={item.image}
        alt={item.name}
        className="h-32 w-32 rounded-lg object-cover"
      />


      {/* ==================================================
          PRODUCT INFO
      ================================================== */}

      <div className="flex-1">

        <h2 className="text-2xl font-bold">
          {item.name}
        </h2>

        <p className="mt-2 text-lg text-blue-600">
          {formatPrice(
            itemPrice,
            currency
          )}
        </p>

      </div>


      {/* ==================================================
          QUANTITY
      ================================================== */}

      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={() =>
            dispatch(
              decreaseQuantity(item.id)
            )
          }
          disabled={quantity <= 1}
          className="rounded border px-4 py-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          -
        </button>


        <span className="text-xl font-bold">
          {quantity}
        </span>


        <button
          type="button"
          onClick={() =>
            dispatch(
              increaseQuantity(item.id)
            )
          }
          className="rounded border px-4 py-2 transition hover:bg-gray-100"
        >
          +
        </button>

      </div>


      {/* ==================================================
          TOTAL
      ================================================== */}

      <div className="text-right">

        <p className="text-2xl font-bold">
          {formatPrice(
            itemTotal,
            currency
          )}
        </p>


        {/* REMOVE */}

        <button
          type="button"
          onClick={() =>
            dispatch(
              removeFromCart(item.id)
            )
          }
          className="mt-2 text-red-500 transition hover:text-red-700"
        >
          Remove
        </button>

      </div>

    </div>
  );
}