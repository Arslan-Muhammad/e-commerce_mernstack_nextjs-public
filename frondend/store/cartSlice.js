'use Client'
import { createSlice } from "@reduxjs/toolkit";



const cart =
    typeof window !== "undefined" && localStorage.getItem("cart") !== null
        ? JSON.parse(localStorage.getItem("cart"))
        : [];

const setCartListFunc =async (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart))
};

const initialState = {
    cart: cart
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        ADD_TO_CART(state, action) {
            const newItem = action.payload;
            const itemInCart = state.cart.find((item) => item._id === newItem._id);
            if (!itemInCart) {
                state.cart.push({ ...newItem, qty: 1, totalPrice: newItem.price });
            } else {
                itemInCart.qty = itemInCart.qty + 1;
                itemInCart.totalPrice = itemInCart.qty * newItem.price;
            }


            setCartListFunc(
                state.cart.map((item) => item)
            )
        },

        INCREMENT_ITEM: (state, action) => {
            const newItem = action.payload;
            const itemInCart = state.cart.find((item) => item._id === newItem._id)
            itemInCart.qty = itemInCart.qty + 1;
            itemInCart.totalPrice = itemInCart.qty * newItem.price;
            setCartListFunc(
                state.cart.map((item) => item)
            )
        },
        DECREMENT_ITEM: (state, action) => {
            const newItem = action.payload;
            const itemInCart = state.cart.find((item) => item._id === newItem._id);
            if (itemInCart.qty === 1) {
                itemInCart.qty = 1
            } else {
                itemInCart.qty = itemInCart.qty - 1;
                itemInCart.totalPrice = itemInCart.qty * newItem.price;
            }
            setCartListFunc(
                state.cart.map((item) => item)
            )
        },
        DELETE_ITEM: (state, action) => {
            const newItem = action.payload;
            const itemInCart = state.cart.filter((item) => item._id !== newItem);
            state.cart = itemInCart;
            setCartListFunc(
                state.cart.map((item) => item)
            )
        },
        CLEAR_CART: (state) => {
            state.cart = [];
            setCartListFunc(
                state.cart.map((item) => item)
            )
        }
    }
});

export const { ADD_TO_CART, INCREMENT_ITEM, DECREMENT_ITEM, DELETE_ITEM, CLEAR_CART } = cartSlice.actions;

export default cartSlice.reducer;