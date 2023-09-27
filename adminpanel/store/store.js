import { configureStore } from "@reduxjs/toolkit";
import { createWrapper, } from "next-redux-wrapper";
import auth from "./UserSlice";

export const store = configureStore({
    reducer: {
        auth
    }
})

const makeStore = () => store;

export const wrapper = createWrapper(makeStore);