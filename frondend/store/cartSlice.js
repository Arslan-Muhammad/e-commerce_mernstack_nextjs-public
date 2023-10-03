import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: []
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        ADD_TO_CART(state, action){
            const itemInCart = state.cart.find((item) => item._id === action.payload._id);
            if(itemInCart){
                itemInCart.qty++
            } else {
                state.cart.push({...action.payload, qty: 1});
            }
        },
        INCREMENT_ITEM: (state, action) => {
            const item = state.cart.find((item) => item._id ===  action.payload)
            item.qty++;
        },
        DECREMENT_ITEM: (state, action) => {
            const item = state.cart.find((item) => item._id === action.payload);
            if(item.qty === 1){
                item.qty = 1
            } else {
                item.qty--;
            }
        },
        DELETE_ITEM : (state, action) => {
            const item = state.cart.filter((item) => item._id !== action.payload);
            state.cart = item;
        }
    }
});

export const {ADD_TO_CART, INCREMENT_ITEM, DECREMENT_ITEM, DELETE_ITEM} = cartSlice.actions;

export default cartSlice.reducer;