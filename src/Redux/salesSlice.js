
import { createSlice } from '@reduxjs/toolkit';

const initialSalesState = {
  sales: [],
  loading: false,
  error: null,
};

const salesSlice = createSlice({
  name: 'sales',
  initialState: initialSalesState,
  reducers: {
    setSales: (state, action) => {
      state.sales = action.payload;
    },
    addSale: (state, action) => {
      state.sales.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearSales: (state) => {
      state.sales = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setSales, addSale, setLoading, setError, clearSales } = salesSlice.actions;

export default salesSlice.reducer;
