import { createSlice } from '@reduxjs/toolkit';

const initialCartState = {
    cartId: null,
    nfts: [],
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
            state.nfts = [];
            state.error = null;
        },
        addItem: (state, action) => {
            state.nfts.push(action.payload);
        },
        removeItem: (state, action) => {
            state.nfts = state.nfts.filter(item => item.id !== action.payload);
        },
        syncCart: (state, action) => {
            state.cartId = action.payload.cartId;
            state.nfts = action.payload.nfts || [];
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

export const { setCartId, clearCart, addItem, removeItem, syncCart, setLoading, setError } = cartSlice.actions;

export default cartSlice.reducer;