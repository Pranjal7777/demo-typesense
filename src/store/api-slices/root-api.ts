import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import {
  AUTH_URL_V1,
  BASE_API_URL,
  DEFAULT_LOCATION,
  GUEST_TOKEN_DEFAULT_PASS,
  GUEST_TOKEN_DEFAULT_USER,
} from '../../config/index';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

import Cookies from 'js-cookie';
import { ACCESS_TOKEN, IS_USER_AUTH, REFRESH_ACCESS_TOKEN } from '@/constants/cookies';
import { setRemoveUserDataDispatch, setGuestTokenDispatch, setUpdateAccessTokenDispatch } from '../slices/auth-slice';
import { GUEST_REFRESH_TOKEN_URL } from '@/api/endpoints';
import { GetGuestTokenConfig, ResponseGetGuestTokenPayload } from '../types';
import platform from 'platform';
import { removeCookie, setCookie } from '@/utils/cookies';
import { getGuestTokenFromServer } from '@/helper/get-guest-token-from-server';

// Define the base query with its proper type from RTK Query
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  prepareHeaders: (headers) => {
    const authToken = Cookies.get(ACCESS_TOKEN);
    const storedLocation = localStorage.getItem('myLocation');
    const geoLocation = storedLocation !== null ? JSON.parse(storedLocation) : null;
    const myIpAddress: string | null = localStorage.getItem('ipAddress');
    const ipAddressHeader = myIpAddress !== null ? myIpAddress : '';

    if (authToken) {
      headers.set('authorization', authToken.replace(/"/g, ''));
      headers.set('Content-Type', 'application/json');
      headers.set('lan', 'en');
      headers.set('platform', '3');
      headers.set('City', geoLocation?.city || DEFAULT_LOCATION.city);
      headers.set('Country', geoLocation?.country || DEFAULT_LOCATION.country);
      headers.set('Ipaddress', ipAddressHeader || DEFAULT_LOCATION.ip);
      headers.set('Latitude', geoLocation?.latitude || DEFAULT_LOCATION.latitude);
      headers.set('Longitude', geoLocation?.longitude || DEFAULT_LOCATION.longitude);
    }
    return headers;
  },
});

const getGuestTokenConfig: GetGuestTokenConfig = {
  deviceId: 'web_app',
  deviceMake: platform.name as string,
  deviceModel: platform.version as string,
  deviceTypeCode: 3,
  deviceOs: ((platform?.os?.family as string) + '-' + platform?.os?.version) as string,
  appVersion: 'v1',
  browserVersion: platform.version as string,
};
const refreshTokenPayload:{ accessToken: string; refreshToken: string } = {
  accessToken: Cookies.get(ACCESS_TOKEN) || '',
  refreshToken: Cookies.get(REFRESH_ACCESS_TOKEN) || '',
};


export const guestGeneratedToken = 'Basic ' + btoa(GUEST_TOKEN_DEFAULT_USER + ':' + GUEST_TOKEN_DEFAULT_PASS);
const guestRefreshToken = Cookies.get(REFRESH_ACCESS_TOKEN);

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  if(!(api.endpoint).includes('getGuestToken') && !Cookies.get(ACCESS_TOKEN) ){
    await new Promise(res => setTimeout(res, 2000));
  }
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && (result.error.status === 401 || result.error.status === 400 || result.error.status === 406)) {
    
    setRemoveUserDataDispatch();

    // Create the request options for the refresh token
    // const tokenForRefresh = 'Basic ' + btoa(GUEST_TOKEN_DEFAULT_USER + ':' + GUEST_TOKEN_DEFAULT_PASS);;
    const refreshArgs: FetchArgs = {
      url: `${BASE_API_URL}${AUTH_URL_V1}/${GUEST_REFRESH_TOKEN_URL}`,
      method: 'POST',
      body: refreshTokenPayload,
      headers: {
        Authorization: `${guestGeneratedToken}`,
      },
    };
    // try {
        // const refreshResult = await baseQuery(refreshArgs, api, extraOptions);
          const refreshResult = await fetch(`${BASE_API_URL}${AUTH_URL_V1}/${GUEST_REFRESH_TOKEN_URL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: guestGeneratedToken,
            },
            body: JSON.stringify(refreshTokenPayload),
          });

          if(!refreshResult.ok){
            setRemoveUserDataDispatch();
            removeCookie('refreshAccessToken');
            removeCookie('accessToken');
            removeCookie('isUserAuth');
            removeCookie('userInfo');
            localStorage.clear();
            const guestTokenResponse = await fetch(`${BASE_API_URL + AUTH_URL_V1}/guestLogin`, {
              method: 'POST',
              headers: {
                Authorization: `${guestGeneratedToken}`,
                'Content-Type': 'application/json',
                lan: 'en',
                platform: '3',
              },
              body: JSON.stringify(getGuestTokenConfig),
            });
            const guestTokenResponseData = await guestTokenResponse.json();
            setCookie(ACCESS_TOKEN, guestTokenResponseData.data.token?.accessToken, { expires: 1 });
            setCookie(REFRESH_ACCESS_TOKEN, guestTokenResponseData.data.token?.refreshToken, { expires: 1 });
            setGuestTokenDispatch(guestTokenResponseData.data.token);           
            window.location.href = '/login';
            
          }
          else{
            const data = await refreshResult.json();
            setUpdateAccessTokenDispatch({
              accessToken: data.data.accessToken,
              accessExpireAt: data.data.accessExpireAt,
            });
            setCookie(ACCESS_TOKEN, JSON.stringify(data.data.accessToken), { expires: 2 });
            window.location.href = '/';
          }
  }

  return result;
};

export const rootApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Product', 'Order', 'User','HighlightedProducts'],
  endpoints: () => ({}),
});
