import { createSlice } from '@reduxjs/toolkit';

const initialCartState = {
    cartId: null,
    items: [],
    loading: false,
    error: null,
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
            state.error = null;
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
        syncCart: (state, action) => {
            state.cartId = action.payload.cartId;
            state.items = action.payload.items || [];
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setCartId, clearCart, setItems, addItem, removeItem, syncCart, setLoading, setError } = cartSlice.actions;

export default cartSlice.reducer;