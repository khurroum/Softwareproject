import { useSelector } from "react-redux";

export default function OrderSummary() {
  const cartItems = useSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="rounded-xl border p-8 h-fit">

      <h2 className="mb-6 text-3xl font-bold">
        Order Summary
      </h2>

      <div className="space-y-4">

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between"
          >
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        <hr />

        <div className="flex justify-between font-bold">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>

        <div className="flex justify-between text-2xl font-bold">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

      </div>

      <button className="mt-8 w-full rounded-lg bg-green-600 py-4 font-semibold text-white hover:bg-green-700">
        Place Order
      </button>

    </div>
  );
}