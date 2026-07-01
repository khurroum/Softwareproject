import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRouter from "./routes/AppRouter";

import { setCart } from "./store/features/cart/cartSlice";

function App() {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user?.email) {
      return;
    }

    const userCartKey = `cart_${user.email}`;

    const savedCart = localStorage.getItem(userCartKey);

    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);

        console.log("Restoring cart after refresh:", cart);

        dispatch(setCart(cart));
      } catch (error) {
        console.error("Failed to restore cart:", error);

        dispatch(setCart([]));
      }
    } else {
      dispatch(setCart([]));
    }
  }, [user, dispatch]);

  return <AppRouter />;
}

export default App;