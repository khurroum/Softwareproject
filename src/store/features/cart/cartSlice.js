import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // ==================================================
    // ADD PRODUCT TO CART
    // ==================================================

    addToCart: (state, action) => {
      const product = action.payload;

      // MongoDB normally uses _id.
      // Some frontend components may use id.
      const productId =
        product?._id ||
        product?.id ||
        product?.product?._id ||
        product?.product?.id;

      if (!productId) {
        console.error(
          "Cannot add product to cart: Product ID is missing.",
          product
        );

        return;
      }

      const existingItem = state.items.find(
        (item) =>
          String(item.id) === String(productId)
      );

      if (existingItem) {
        existingItem.quantity +=
          Number(product.quantity || 1);

        return;
      }

      // Store a normalized cart object.
      state.items.push({
        ...product,

        // IMPORTANT:
        // Always keep the MongoDB product ID
        // as `id` for the frontend cart.
        id: productId,

        // Also preserve _id when available.
        _id: product?._id || productId,

        quantity:
          Number(product.quantity) || 1,
      });
    },

    // ==================================================
    // INCREASE QUANTITY
    // ==================================================

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          String(item.id) ===
          String(action.payload)
      );

      if (item) {
        item.quantity += 1;
      }
    },

    // ==================================================
    // DECREASE QUANTITY
    // ==================================================

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) =>
          String(item.id) ===
          String(action.payload)
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    // ==================================================
    // UPDATE QUANTITY
    // ==================================================

    updateQuantity: (state, action) => {
      const {
        id,
        quantity,
      } = action.payload;

      const item = state.items.find(
        (item) =>
          String(item.id) ===
          String(id)
      );

      if (item) {
        item.quantity =
          Math.max(
            1,
            Number(quantity) || 1
          );
      }
    },

    // ==================================================
    // REMOVE PRODUCT
    // ==================================================

    removeFromCart: (state, action) => {
      state.items =
        state.items.filter(
          (item) =>
            String(item.id) !==
            String(action.payload)
        );
    },

    // ==================================================
    // CLEAR CART
    // ==================================================

    clearCart: (state) => {
      state.items = [];
    },

    // ==================================================
    // RESTORE CART
    // ==================================================

    setCart: (state, action) => {
      const items =
        Array.isArray(action.payload)
          ? action.payload
          : [];

      // Normalize older cart data.
      state.items = items
        .map((item) => {
          const productId =
            item?._id ||
            item?.id ||
            item?.product?._id ||
            item?.product?.id;

          if (!productId) {
            console.warn(
              "Skipping cart item without product ID:",
              item
            );

            return null;
          }

          return {
            ...item,

            id: productId,

            _id:
              item?._id ||
              productId,

            quantity:
              Number(item.quantity) || 1,
          };
        })
        .filter(Boolean);
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