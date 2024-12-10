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
// const refreshTokenPayload: { accessToken: string; refreshToken: string } = {
//   accessToken: Cookies.get(ACCESS_TOKEN) || 
//     'Bearer eyJhbGciOiJSU0EtT0FFUCIsImN0eSI6IkpXVCIsImVuYyI6IkExMjhHQ00iLCJ0eXAiOiJKV1QifQ.puEvK9pJSMw4nVfw0Smm_uKD8lmcLQ6cv2EILv_PusnOlXJko1dLxK6H8EnLNNvvOAAytHfnfAtxwDDsuyhC-9KgqUPWcFI_YZ32TWEmf3dGJvuIy0UYJaoQzfK_jhE1VgpMw-4dc420s6Y4iYXTIZrMCJ6vqA4xR0N0VXOuoBI.Sjtb1sIeYJm6fVcv.GkeXS1J6Rkno2v74IzpTmv-2Sh7nVN0U836sRhY4YSHxSj24KuywTDCpXvsFju3m-fw4N8DfYe8L3m5PTx1bI56FkJiNCndopbsGp-9M_BasTgatl77xm7vdQ7Jf4epmwmVC9gEhD8F5Da6g91nUSPRpofU61KOMh0rdu8Fs3soShe0Ll9k3Y0woSfdDqnMn4nKn-jT5GdhsEdR2n_0EcVBIX3mlKoaF0a3tk5bQOFlSSkeFom8ZSgnUlIjTexsqdP2zdnPpH7g2ZDdw1HvfQgCk_gSBuWhEY3G3cfY-39ehlR5e5RH4_FR4BBOiAk1LH--FLDgluSOAppScI6wx64tIBKmicPdwFggSgnDEv-lp-BntreEcuMEnpJlBidcj4c0Hv4W5wPDDwLdlS1tA-g-hWbsEIyEaeCLQ9JAnNo1Bp1ASdx8bdTMc6USy7_pOFJz-dUaOD9YM1OY-IcKOaQF7wE-z_6OuZPmsmsTB_02DPXCdKZXZpDrF-4m0pHzHz3vhrNURnV492SwmfvYe_OTCGUbwUli0ALMuM9OstEj5B4j0V5AOPwi8oRANfLrQswVj4NXUAqiOXItwJUCcaIIawFRAhHtmoSd_9Y19URKY65TH5kKk40UBcceYyQUWxunophMHIn4BjxI0aj1rlyOlP40nl1L1EqaIZRVxAkGHuHQWiVKq1cQCGXLmUUxZe_Ir0s67f2H2lA8XS1cbTJ_bEFcXZ39W8-ugwPVKMazW-NbM83jjMfnfr7ekdwSo1--3gvnXQ0S3ILFqS2I2DEV24v5Z0MjRV2UAK4oLERgKRwwAsM6-p1mMPqzmytimDI_ZP6hi4G1-JSJoKRU9_fdro5Gde0s1lwfAZTvvpYvrz3UXqEJT07eJ4gVlM6Ub_U2wmZ1VMyo-3_QjGszwt63kI-2WVE340puN9xqU5a2sHgDdNXsvTDOC5wMXQEFFpqjsvnGRWf5xtxZCPAis2oosRU6tgI0ancr6z872scGuMa06HWHT24oWjg.4WXDocXAZ0Gf32Y1gPe7Ew',
//   refreshToken: Cookies.get(REFRESH_ACCESS_TOKEN) || '6e46be9f-e23d-b0f9-6f75-5dbd447b6a3e',
// };

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
    // const refreshArgs: FetchArgs = {
    //   url: `${BASE_API_URL}${AUTH_URL_V1}/${GUEST_REFRESH_TOKEN_URL}`,
    //   method: 'POST',
    //   body: refreshTokenPayload,
    //   headers: {
    //     Authorization: `${guestGeneratedToken}`,
    //   },
    // };
    // try {
        // const refreshResult = await baseQuery(refreshArgs, api, extraOptions);
        const refreshTokenPayload: { accessToken: string; refreshToken: string } = {
          accessToken: Cookies.get(ACCESS_TOKEN) || '',
          refreshToken: Cookies.get(REFRESH_ACCESS_TOKEN) || '',
        };

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
              window.location.href = '/';
              // return result;
            
          }
          else{
            const data = await refreshResult.json();
            setUpdateAccessTokenDispatch({
              accessToken: data.data.accessToken,
              accessExpireAt: data.data.accessExpireAt,
            });
            setCookie(ACCESS_TOKEN, JSON.stringify(data.data.accessToken), { expires: 2 });
             window.location.href = '/';
            //  return result;
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
