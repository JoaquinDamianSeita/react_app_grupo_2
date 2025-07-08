import { configureStore, createSlice } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const initialAuthState = {
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    cart: cartReducer,
  },
});

export default store; 