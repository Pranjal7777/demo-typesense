import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { bindActionCreators } from '@reduxjs/toolkit';
import {authSlice} from '../slices/auth-slice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const allActions = {
  ...authSlice.actions,
  // ...countrySlice.actions,
  // ...productSlice.actions,
  // ...categorySlice.actions,
  // ...orderSlice.actions,
  // ...orderStatusSlice.actions,
  // ...attributeSlice.actions
};

export const useActions = () => {
  const dispatch = useAppDispatch();
  return bindActionCreators(allActions, dispatch);
};


