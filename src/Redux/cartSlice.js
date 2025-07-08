import { createSlice } from '@reduxjs/toolkit';

const initialCartState = {
    cartId: null,
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        setCartId: (state, action) => {
            state.cartId = action.payload;
        },
        clearCart: (state) => {
            state.cartId = null;
            state.items = [];
        },
        setItems: (state, action) => {
            state.items = action.payload;
        },
        addItem: (state, action) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
        },
    },
});

export const { setCartId } = cartSlice.actions;

export default cartSlice.reducer;