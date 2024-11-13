import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Result } from '../types/pdp-types';

interface CheckoutState {
  checkoutProduct: Result | null;
}

const initialState: CheckoutState = {
  checkoutProduct: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckoutProduct: (state, action: PayloadAction<Result>) => {
      state.checkoutProduct = action.payload;
    },
    clearCheckoutData: (state) => {
      state.checkoutProduct = null;
    },
  },
});

export const { setCheckoutProduct, clearCheckoutData } = checkoutSlice.actions;
export default checkoutSlice;
