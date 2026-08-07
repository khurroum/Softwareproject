import { useSelector } from "react-redux";

import EmptyCart from "../../components/cart/EmptyCart";
import CartList from "../../components/cart/CartList";
import CartSummary from "../../components/cart/CartSummary";

export default function Cart() {

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      <h1 className="mb-10 text-5xl font-bold">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <CartList />
          <CartSummary />
        </>
      )}

    </section>
  );
}