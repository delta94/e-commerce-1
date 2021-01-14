import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productsApi } from "../api/productsApi";

export const addToCart = createAsyncThunk(
  "cart/cartAddItem",
  async ({ id, qty }) => {
    const data = await productsApi.getProduct(id);
    const item = {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    };
    return item;
  }
);
const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];
export const cartSlice = createSlice({
  name: "cart",
  initialState: { cartItems: cartItemsFromStorage },
  reducers: {
    removeItem: (state,{payload})=>{
      state.cartItems=state.cartItems.filter(i=>i.product!==payload);
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    }
  },
  extraReducers: {
    [addToCart.fulfilled]: (state, { payload }) => {
      const exitItem = state.cartItems.find(
        (i) => i.product === payload.product
      );

      if (exitItem) {
        state.cartItems=state.cartItems.map((i) =>
          i.product === payload.product ? payload : i
        );
      } else {
        state.cartItems.push(payload);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
});
export const {removeItem}=cartSlice.actions