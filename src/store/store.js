import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/auth/authSlice";
import cartReducer from "./features/cart/cartSlice";
import productReducer from "./features/product/productSlice";
import orderReducer from "./features/order/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
  },
});

// Keep track of the previous cart
let previousCart = store.getState().cart.items;

store.subscribe(() => {
  const state = store.getState();

  const user = state.auth.user;
  const currentCart = state.cart.items;

  // Only save when the cart itself has changed
  if (currentCart !== previousCart) {
    previousCart = currentCart;

    if (user?.email) {
      const userCartKey = `cart_${user.email}`;

      localStorage.setItem(
        userCartKey,
        JSON.stringify(currentCart)
      );
    }
  }
});