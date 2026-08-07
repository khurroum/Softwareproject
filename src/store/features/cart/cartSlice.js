import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // Add product to cart
    addToCart: (state, action) => {
      const product = action.payload;

      const existingItem = state.items.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += product.quantity || 1;
      } else {
        state.items.push({
          ...product,
          quantity: product.quantity || 1,
        });
      }
    },

    // Increase quantity
    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload
      );

      if (item) {
        item.quantity += 1;
      }
    },

    // Decrease quantity
    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.id === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    // Update quantity directly
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;

      const item = state.items.find(
        (item) => item.id === id
      );

      if (item) {
        item.quantity = quantity;
      }
    },

    // Remove product completely
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    // Clear current Redux cart
    clearCart: (state) => {
      state.items = [];
    },

    // Restore a user's saved cart
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  removeFromCart,
  clearCart,
  setCart,
} = cartSlice.actions;

export default cartSlice.reducer;