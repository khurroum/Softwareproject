import { useSelector } from "react-redux";
import CartItem from "./CartItem";

export default function CartList() {
  const cartItems = useSelector(
    (state) => state.cart.items
  );

  return (
    <div className="space-y-6">

      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          item={item}
        />
      ))}

    </div>
  );
}