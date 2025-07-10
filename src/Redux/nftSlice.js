import { createSlice } from '@reduxjs/toolkit';

const initialNftState = {
    nfts: [],
    selectedNft: null,
    loading: false,
    error: null
};

const nftSlice = createSlice({
    name: 'nft',
    initialState: initialNftState,
    reducers: {
        setNfts: (state, action) => {
            state.nfts = action.payload;
            state.loading = false;
            state.error = null;
        },
        setSelectedNft: (state, action) => {
            state.selectedNft = action.payload;
            state.loading = false;
            state.error = null;
        },
        addNft: (state, action) => {
            state.nfts.push(action.payload);
        },
        updateNft: (state, action) => {
            const index = state.nfts.findIndex(nft => nft.id === action.payload.id);
            if (index !== -1) {
                state.nfts[index] = action.payload;
            }
        },
        deleteNft: (state, action) => {
            state.nfts = state.nfts.filter(nft => nft.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const { 
    setNfts, 
    setSelectedNft, 
    addNft, 
    updateNft, 
    deleteNft,
    setLoading,
    setError 
} = nftSlice.actions;

export default nftSlice.reducer; 