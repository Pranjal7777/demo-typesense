// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { myLocationField, OtpDataWithVerificationForSignUp, OtpDataWithVerificationId, RequestResendOtpData, RequestSendVerificationCodePayload, ResponseGetAllCategoriesPayload, ResponseGetAllGrandParentCategoriesPayload, ResponseSetUserDetailsDispatchPayload, Token, User } from '../types';
import { ACCESS_TOKEN, IS_USER_AUTH, REFRESH_ACCESS_TOKEN, USER_INFO } from '@/constants/cookies';
import { removeCookie, setCookie } from '@/utils/cookies';


interface AuthInitialState {
  userInfo: User | null,
  token: Token | null,
  myLocation: myLocationField,
  otpData: RequestSendVerificationCodePayload | OtpDataWithVerificationId | RequestResendOtpData | OtpDataWithVerificationForSignUp,
  ipAddress: string | null,
  categories:ResponseGetAllGrandParentCategoriesPayload | null,
  categoriesWithChildren :ResponseGetAllCategoriesPayload
}

const initialState: AuthInitialState = {
  userInfo: (typeof window !== 'undefined' && localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')!) : null,
  token: (typeof window !== 'undefined' && localStorage.getItem('token')) ? JSON.parse(localStorage.getItem('token')!) : null,
  otpData: (typeof window !== 'undefined' && localStorage.getItem('otpData')) ? JSON.parse(localStorage.getItem('otpData')!) : null,
  myLocation: (typeof window !== 'undefined' && localStorage.getItem('myLocation')) ? JSON.parse(localStorage.getItem('myLocation')!) : null,
  ipAddress: (typeof window !== 'undefined' && localStorage.getItem('ipAddress')) ? localStorage.getItem('ipAddress') : null,
  categories: (typeof window !== 'undefined' && localStorage.getItem('categories')) ? JSON.parse(localStorage.getItem('categories')!) : null,
  categoriesWithChildren :(typeof window !== 'undefined' && localStorage.getItem('categoriesWithChildren')) ? JSON.parse(localStorage.getItem('categoriesWithChildren')!) : null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setGuestTokenDispatch: (state: AuthInitialState, action: PayloadAction<Token>) => {
      state.token = action.payload;
      localStorage.setItem('token', JSON.stringify(action.payload));
      setCookie(ACCESS_TOKEN, action?.payload?.accessToken, { expires: 1 });
      setCookie(REFRESH_ACCESS_TOKEN, action?.payload?.refreshToken, { expires: 1 });
    },

    setOtpVerificationDetailsDispatch: (
      state: AuthInitialState,
      action: PayloadAction<OtpDataWithVerificationId | OtpDataWithVerificationForSignUp | RequestResendOtpData>
    ) => {
      state.otpData = action.payload;

      localStorage.setItem('otpData', JSON.stringify(action.payload));
    },
    setUserDetailsDispatch: (state: AuthInitialState, action: PayloadAction<ResponseSetUserDetailsDispatchPayload>) => {
      state.userInfo = action.payload.user;
      state.token = action.payload.token;

      setCookie('userInfo', JSON.stringify(action.payload.user), { expires: 2, path: '/' });
      setCookie(IS_USER_AUTH, JSON.stringify(true), { expires: 2 });
      setCookie(ACCESS_TOKEN, JSON.stringify(action?.payload?.token.accessToken), { expires: 2 });
      setCookie(REFRESH_ACCESS_TOKEN, JSON.stringify(action?.payload?.token.refreshToken), { expires: 2 });
      //setCookie('token', tokenString, { expires: 7, path: '/' });

      localStorage.removeItem('timer');
      localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
      localStorage.setItem('token', JSON.stringify(action.payload.token));
    },
    setRemoveUserDataDispatch: (state: AuthInitialState) => {
      state.userInfo = null;
      state.token = null;
      removeCookie(ACCESS_TOKEN);
      removeCookie(IS_USER_AUTH);
      removeCookie(REFRESH_ACCESS_TOKEN);
      removeCookie(USER_INFO);
      localStorage.removeItem('userInfo'); // Remove user data from localStorage
      localStorage.removeItem('token');
    },
    setMyLocationDispatch: (state: AuthInitialState, action: PayloadAction<myLocationField>) => {
      state.myLocation = action.payload;
      localStorage.setItem('myLocation', JSON.stringify(action.payload));
    },
    setRemoveMyLocationDispatch: (state: AuthInitialState) => {
      if (state.myLocation) {
        state.myLocation.address = ''; // Clear address if myLocation exists
        // state.myLocation.city = "";
        // state.myLocation.country = "";
        // state.myLocation.latitude = "";
        // state.myLocation.longitude = "";
      }
      localStorage.removeItem('myLocation');
    },
    setUpdateLocationDispatch: (state: AuthInitialState, action: PayloadAction<myLocationField>) => {
      if (state.myLocation) {
        state.myLocation.address = action.payload.address;
        state.myLocation.city = action.payload.city;
        state.myLocation.country = action.payload.country;
        state.myLocation.latitude = action.payload.latitude;
        state.myLocation.longitude = action.payload.longitude;
      }
      localStorage.setItem('myLocation', JSON.stringify(action.payload));
    },
    setMyIpAddressDispatch: (state: AuthInitialState, action: PayloadAction<string>) => {
      state.ipAddress = action.payload;
      localStorage.setItem('ipAddress', action.payload);
    },
    setMyCategoriesDispatch: (
      state: AuthInitialState,
      action: PayloadAction<ResponseGetAllGrandParentCategoriesPayload>
    ) => {
      state.categories = action.payload;
      localStorage.setItem('categories', JSON.stringify(action.payload));
    },
    setMyCategoriesWithChildrenDispatch: (
      state: AuthInitialState,
      action: PayloadAction<ResponseGetAllCategoriesPayload>
    ) => {
      state.categoriesWithChildren = action.payload;
      localStorage.setItem('categoriesWithChildren', JSON.stringify(action.payload));
    },
    setUpdateAccessTokenDispatch: (
      state: AuthInitialState,
      action: PayloadAction<{ accessToken: string; accessExpireAt: number }>
    ) => {
      setCookie(ACCESS_TOKEN, action.payload.accessToken, { expires: action.payload.accessExpireAt });
      state.token = {
        accessToken: action.payload.accessToken,
        accessExpireAt: action.payload.accessExpireAt,
        refreshToken: state.token?.refreshToken || '',
      };
    },
    updateUserInfoDispatch: (state: AuthInitialState, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
      setCookie('userInfo', JSON.stringify(action.payload), { expires: 2, path: '/' });
     localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },

    // logout: (state) => {
    //   state.userInfo = null;
    // },
  },
});

export const { setRemoveUserDataDispatch,setGuestTokenDispatch, setUpdateAccessTokenDispatch,updateUserInfoDispatch } = authSlice.actions;
