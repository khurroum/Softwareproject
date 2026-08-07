import { useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../store/features/cart/cartSlice";

export default function CartItem({ item }) {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col gap-6 rounded-xl border p-6 md:flex-row md:items-center">

      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="h-32 w-32 rounded-lg object-cover"
      />

      {/* Product Info */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold">
          {item.name}
        </h2>

        <p className="mt-2 text-lg text-blue-600">
          ${item.price}
        </p>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-3">

        <button
          onClick={() => dispatch(decreaseQuantity(item.id))}
          className="rounded border px-4 py-2 hover:bg-gray-100"
        >
          -
        </button>

        <span className="text-xl font-bold">
          {item.quantity}
        </span>

        <button
          onClick={() => dispatch(increaseQuantity(item.id))}
          className="rounded border px-4 py-2 hover:bg-gray-100"
        >
          +
        </button>

      </div>

      {/* Total */}
      <div className="text-right">
        <p className="text-2xl font-bold">
          ${item.price * item.quantity}
        </p>

        <button
          onClick={() => dispatch(removeFromCart(item.id))}
          className="mt-2 text-red-500 hover:text-red-700"
        >
          Remove
        </button>
      </div>

    </div>
  );
}