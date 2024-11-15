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
import { ACCESS_TOKEN, REFRESH_ACCESS_TOKEN } from '@/constants/cookies';
import { setRemoveUserDataDispatch, setGuestTokenDispatch } from '../slices/auth-slice';
import { GUEST_REFRESH_TOKEN_URL } from '@/api/endpoints';
import { GetGuestTokenConfig, ResponseGetGuestTokenPayload } from '../types';
import platform from 'platform';

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
      headers.set('City', geoLocation.city || DEFAULT_LOCATION.city);
      headers.set('Country', geoLocation.country || DEFAULT_LOCATION.country);
      headers.set('Ipaddress', ipAddressHeader || DEFAULT_LOCATION.ip);
      headers.set('Latitude', geoLocation.latitude || DEFAULT_LOCATION.latitude);
      headers.set('Longitude', geoLocation.longitude || DEFAULT_LOCATION.longitude);
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
  if (result.error && (result.error.status === 401 || result.error.status === 400)) {
    
    setRemoveUserDataDispatch();

    // Create the request options for the refresh token
    const refreshArgs: FetchArgs = {
      url: `${AUTH_URL_V1}/${GUEST_REFRESH_TOKEN_URL}`,
      method: 'POST',
      body: getGuestTokenConfig,
      headers: {
        Authorization: `${guestRefreshToken?.replace(/"/g, '')}`,
      },
    };
    const refreshResult = await baseQuery(refreshArgs, api, extraOptions);

    const data = refreshResult as ResponseGetGuestTokenPayload;

    if (data && data.data.token.accessToken) {
      // store the new token
      api.dispatch(setGuestTokenDispatch(data.data.token));

      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
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
