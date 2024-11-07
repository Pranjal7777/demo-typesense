import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
  likedProducts: { [key: string]: boolean };
  likeCounts: { [key: string]: number };
}

const initialState: ProductState = {
  likedProducts: {},
  likeCounts: {},
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    toggleLike(state, action: PayloadAction<{ productId: string; isLiked: boolean }>) {
      const { productId, isLiked } = action.payload;
      state.likedProducts[productId] = isLiked;
      state.likeCounts[productId] = isLiked
        ? (state.likeCounts[productId] || 0) + 1
        : (state.likeCounts[productId] || 0) - 1;
    },
    setLikeCount(state, action: PayloadAction<{ productId: string; count: number }>) {
      const { productId, count } = action.payload;
      state.likeCounts[productId] = count;
    },
  },
});

export const { toggleLike, setLikeCount } = productSlice.actions;
export default productSlice;
