import { configureStore } from "@reduxjs/toolkit";
import user from "./userSlice";
import cart from "./cartSlice"
import { createWrapper } from "next-redux-wrapper";

export const store = configureStore({
  reducer: {
    user, cart
  },
});

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);
