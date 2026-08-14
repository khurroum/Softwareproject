import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  loading: false,
  error: "",
};

const productSlice = createSlice({
  name: "product",

  initialState,

  reducers: {
    // =========================
    // SET PRODUCTS
    // =========================
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = "";
    },

    // =========================
    // LOADING
    // =========================
    setProductLoading: (state, action) => {
      state.loading = action.payload;
    },

    // =========================
    // ERROR
    // =========================
    setProductError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // =========================
    // CLEAR PRODUCTS
    // =========================
    clearProducts: (state) => {
      state.products = [];
      state.loading = false;
      state.error = "";
    },
  },
});

export const {
  setProducts,
  setProductLoading,
  setProductError,
  clearProducts,
} = productSlice.actions;

export default productSlice.reducer;